import { describe, it, expect } from 'vitest';
import {
  weather,
  weatherAnswers,
  weatherFinished,
  energyBudget,
  cloudParcel,
  windCase,
} from './weatherModels';
import { activityFinished } from './Activities';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';

const observations: Record<string, string[]> = {
  'GEO-033': ['day-0', 'day-1', 'climate-nz', 'climate-europe'],
  'GEO-034': ['energy-clear', 'energy-absorb'],
  'GEO-035': [
    'wind-0',
    'wind-4',
    'wind-12',
    'wind-forward-north',
    'wind-forward-south',
    'wind-reverse-north',
  ],
  'GEO-036': [
    'parcel-wet-low',
    'parcel-wet-cloud',
    'parcel-dry-low',
    'parcel-wet-one',
    'parcel-dry-one',
    'parcel-dry-cloud',
    'parcel-small',
    'parcel-grow',
  ],
};
describe('weather evidence and physical conditions', () => {
  it('retains source hashes, original grid and twelve climatology months with daily UTC dates', () => {
    expect(weather.sources.map((s) => s.shape)).toEqual([
      [366, 94, 192],
      [366, 94, 192],
      [12, 94, 192],
      [12, 94, 192],
    ]);
    for (const source of weather.sources)
      expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
    for (const p of weather.points) {
      expect(p.temperature).toHaveLength(12);
      expect(p.rain).toHaveLength(12);
      expect(p.days.map((d) => d.date)).toEqual(['2020-01-11', '2020-01-15']);
      expect(p.rain.every((v) => v >= 0 && Number.isFinite(v))).toBe(true);
    }
    expect(weather.points[0]).toMatchObject({ lat: -42.8564, lon: 172.5 });
    expect(weather.points[0]!.days.map((d) => d.rain)).toEqual([1.04, 0]);
    expect(weather.points[0]!.temperature[0]).toBeGreaterThan(
      weather.points[0]!.temperature[6]!,
    );
    expect(weather.points[1]!.temperature[0]).toBeLessThan(
      weather.points[1]!.temperature[6]!,
    );
  });
  it('conserves energy separately at surface, atmosphere and system boundaries', () => {
    for (const absorbing of [false, true]) {
      const b = energyBudget(absorbing);
      expect(b.solar + b.down).toBe(b.surfaceOut);
      expect(b.atmosphereIn).toBe(b.atmosphereOut);
      expect(b.solar).toBe(b.spaceOut);
    }
    expect(energyBudget(true).surfaceOut).toBeGreaterThan(
      energyBudget(false).surfaceOut,
    );
  });
  it('reverses force with pressure locations and Coriolis map side with initial motion', () => {
    expect(windCase(false, 'north', 4)).toMatchObject({
      left: 1014,
      right: 1010,
      direction: 1,
      deflection: 1,
    });
    expect(windCase(false, 'south', 4)).toMatchObject({ deflection: -1 });
    expect(windCase(true, 'north', 4)).toMatchObject({
      left: 1010,
      right: 1014,
      direction: -1,
      deflection: -1,
    });
    expect(windCase(true, 'south', 4)).toMatchObject({ deflection: 1 });
    expect(windCase(false, 'north', 0)).toMatchObject({
      moving: false,
      deflection: 0,
      left: 1010,
      right: 1010,
    });
    expect(windCase(false, 'none', 12)).toMatchObject({
      delta: 12,
      deflection: 0,
    });
  });
  it('forms cloud only after each saturation height and rain only with cloud plus assumed growth', () => {
    expect(cloudParcel(true, 0, true)).toMatchObject({
      cloud: false,
      rain: false,
      temperature: 20,
    });
    expect(cloudParcel(true, 1)).toMatchObject({ cloud: true, rain: false });
    expect(cloudParcel(false, 1, true)).toMatchObject({
      cloud: false,
      rain: false,
    });
    expect(cloudParcel(false, 2, true)).toMatchObject({
      cloud: true,
      rain: true,
    });
    expect(cloudParcel(false, 2).base).toBeGreaterThan(
      cloudParcel(true, 2).base,
    );
    for (const wet of [false, true]) {
      const base = cloudParcel(wet, 0).base;
      expect(cloudParcel(wet, base - 0.00001).temperature).toBeCloseTo(
        cloudParcel(wet, base + 0.00001).temperature,
        3,
      );
      expect(cloudParcel(wet, 2).temperature).toBeLessThan(
        cloudParcel(wet, 1).temperature,
      );
    }
    expect(cloudParcel(true, NaN).height).toBe(0);
    expect(cloudParcel(true, 20).height).toBe(2);
  });
  it('requires interpretation and condition comparisons, supports retries, and rejects unknown missions', () => {
    for (const [id, answers] of Object.entries(weatherAnswers)) {
      const complete = {
        ...answers,
        ...Object.fromEntries(observations[id]!.map((k) => [k, 'yes'])),
      };
      expect(
        activityFinished(id, { ...newActivity(), decisions: complete }),
      ).toBe(true);
      expect(weatherFinished(id, answers)).toBe(false);
      for (const key of Object.keys(complete)) {
        const incomplete = { ...complete };
        delete incomplete[key];
        expect(weatherFinished(id, incomplete), `${id} missing ${key}`).toBe(
          false,
        );
      }
      const key = Object.keys(answers)[0]!;
      expect(weatherFinished(id, { ...complete, [key]: 'wrong' })).toBe(false);
      expect(weatherFinished(id, { ...complete, [key]: answers[key]! })).toBe(
        true,
      );
    }
    expect(weatherFinished('GEO-037', {})).toBe(false);
  });
  it('preserves ninth-block feedback, weather decisions and earlier records across reload', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', { note: '早期记录' });
    p = patchSession(p, 'GEO-036', {
      activity: {
        ...newActivity(),
        decisions: {
          'parcel-kind': 'dry',
          'parcel-height': '2',
          'parcel-dry-cloud': 'yes',
          ...weatherAnswers['GEO-036'],
        },
      },
    });
    p.feedbackByBlock['GEO-033'] = {
      interest: 4,
      independence: 3,
      useful: '比较时间尺度',
      difficult: '同压不等于无风',
    };
    const restored = readProgress(JSON.stringify(p));
    expect(restored.sessions['GEO-001']!.note).toBe('早期记录');
    expect(restored.sessions['GEO-036']!.activity.decisions).toEqual(
      p.sessions['GEO-036']!.activity.decisions,
    );
    expect(restored.feedbackByBlock['GEO-033']).toEqual(
      p.feedbackByBlock['GEO-033'],
    );
  });
});
