import { describe, it, expect } from 'vitest';
import {
  climateData,
  climateAnswers,
  climateEvidence,
  climateFinished,
  reliefParcel,
  latitudeBelt,
  solarGeometry,
  solarBeam,
  monsoonContrast,
  rainStations,
} from './climateModels';
import { activityFinished } from './Activities';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';

describe('climate processes and evidence limits', () => {
  it('retains same-period precipitation and temperature provenance while keeping their grids distinct', () => {
    expect(climateData.precipitationSource.shape).toEqual([12, 72, 144]);
    expect(climateData.temperatureSource.shape).toEqual([12, 94, 192]);
    for (const s of [
      climateData.precipitationSource,
      climateData.temperatureSource,
    ])
      expect(s.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(climateData.period).toBe('1991–2020');
    expect(climateData.monthDays.reduce((a, b) => a + b, 0)).toBeCloseTo(
      365.2666667,
      6,
    );
    for (const p of climateData.points) {
      expect(p.monthlyRain).toHaveLength(12);
      expect(p.monthlyTemperature).toHaveLength(12);
      expect(p.monthlyRain.every((v) => v >= 0 && Number.isFinite(v))).toBe(
        true,
      );
      expect(
        Math.abs(p.monthlyRain.reduce((a, b) => a + b, 0) - p.annualRain),
      ).toBeLessThan(1.1);
      expect(p.rainGrid).not.toEqual(p.temperatureGrid);
    }
    expect(
      climateData.points.find((p) => p.id === 'india-west')!.monthlyRain[6],
    ).toBeGreaterThan(400);
    const southeast = climateData.points.find(
      (p) => p.id === 'india-southeast',
    )!;
    expect(southeast.rainGrid).toEqual({ lat: 13.75, lon: 81.25 });
    expect(southeast.monthlyRain[9]).toBeGreaterThan(southeast.monthlyRain[6]!);
    expect(
      climateData.points.find((p) => p.id === 'gobi')!.monthlyTemperature[0],
    ).toBeLessThan(0);
    expect(
      climateData.points.find((p) => p.id === 'gobi')!.monthlyTemperature[6],
    ).toBeGreaterThan(20);
    expect(rainStations.map((s) => s.annual)).toEqual([2452, 594]);
  });
  it('reverses windward side and travel without changing the ridge or saturation condition', () => {
    for (const f of [0, 1, 2, 3, 4]) {
      const w = reliefParcel(true, 2, f, true),
        e = reliefParcel(true, 2, f, false);
      expect(w.x + e.x).toBe(900);
      expect(w.height).toBe(e.height);
      expect(w.temperature).toBe(e.temperature);
      expect(w.windward).toBe('west');
      expect(e.windward).toBe('east');
    }
    expect(reliefParcel(false, 1, 2, true).cloud).toBe(false);
    expect(reliefParcel(false, 2, 2, true).cloud).toBe(true);
    expect(reliefParcel(true, 0, 2, true)).toMatchObject({
      cloud: false,
      height: 0,
      temperature: 20,
    });
    expect(reliefParcel(true, 2, 4, true).temperature).toBeGreaterThan(20);
    expect(reliefParcel(false, 1, 4, true).temperature).toBeCloseTo(20);
    expect(reliefParcel(true, 2, 3, true)).toMatchObject({
      descending: true,
      cloud: false,
      height: 1,
    });
  });
  it('uses hemisphere-symmetric astronomical belt boundaries rather than classifying temperature or rainfall', () => {
    for (const lat of [0, 23.4, 40, 66.6, 75])
      expect(latitudeBelt(lat)).toBe(latitudeBelt(-lat));
    expect(latitudeBelt(23.4)).toBe('tropical');
    expect(latitudeBelt(23.41)).toBe('temperate');
    expect(latitudeBelt(66.6)).toBe('polar');
    expect(latitudeBelt(31.428)).toBe('temperate');
  });
  it('keeps beam incidence/area inverse, handles polar night and opposite hemispheric seasons', () => {
    const equator = solarGeometry(0, 0),
      high = solarGeometry(75, 0);
    expect(equator.relativeNoon).toBeCloseTo(1);
    expect(high.relativeNoon).toBeLessThan(equator.relativeNoon);
    expect(high.beamFootprint).toBeGreaterThan(equator.beamFootprint!);
    for (const lat of [0, 45, 75, -43]) {
      const g = solarGeometry(lat, 0);
      expect(g.daylight).toBeCloseTo(12);
      expect(g.relativeNoon * g.beamFootprint!).toBeCloseTo(1);
    }
    expect(solarGeometry(75, 1).daylight).toBe(24);
    expect(solarGeometry(75, 3)).toMatchObject({
      daylight: 0,
      relativeNoon: 0,
      beamFootprint: null,
    });
    expect(solarGeometry(-43, 3).daylight).toBeGreaterThan(
      solarGeometry(-43, 1).daylight,
    );
  });
  it('draws parallel rays with the same perpendicular beam width and the correct ground footprint', () => {
    for (const lat of [0, 45, 75, -43])
      for (const q of [0, 1, 3]) {
        const g = solarGeometry(lat, q),
          b = solarBeam(lat, q);
        if (g.relativeNoon === 0) {
          expect(b).toBeNull();
          continue;
        }
        const [a, c, d, e] = b!.points;
        expect(Math.hypot(a![0]! - c![0]!, a![1]! - c![1]!)).toBeCloseTo(50);
        expect(d![0]! - e![0]!).toBeCloseTo(50 / g.relativeNoon);
        const dx = e![0]! - a![0]!,
          dy = e![1]! - a![1]!;
        expect(dy / Math.hypot(dx, dy)).toBeCloseTo(g.relativeNoon);
      }
  });
  it('reverses prescribed pressure tendencies with thermal contrast and leaves equal-contrast drive zero', () => {
    expect(monsoonContrast(2)).toMatchObject({
      phase: 'warm',
      landPressure: 'L',
      oceanPressure: 'H',
      towardLand: true,
    });
    expect(monsoonContrast(-2)).toMatchObject({
      phase: 'cool',
      landPressure: 'H',
      oceanPressure: 'L',
      towardLand: false,
    });
    expect(monsoonContrast(0)).toMatchObject({
      phase: 'equal',
      magnitude: 0,
      landPressure: '=',
    });
    expect(monsoonContrast(NaN)).toEqual(monsoonContrast(0));
    expect(monsoonContrast(100).contrast).toBe(2);
  });
  it('requires every process comparison and interpretation, with retries and preserved local history', () => {
    let p = patchSession(emptyProgress(), 'GEO-033', {
      note: '此前的时间尺度解释',
    });
    for (const [id, answers] of Object.entries(climateAnswers)) {
      const d = {
        ...answers,
        ...Object.fromEntries(climateEvidence[id]!.map((k) => [k, 'yes'])),
      };
      expect(activityFinished(id, { ...newActivity(), decisions: d })).toBe(
        true,
      );
      for (const k of Object.keys(d)) {
        const missing = { ...d };
        delete missing[k];
        expect(climateFinished(id, missing), `${id} missing${k}`).toBe(false);
      }
      const k = Object.keys(answers)[0]!;
      expect(climateFinished(id, { ...d, [k]: 'wrong' })).toBe(false);
      p = patchSession(p, id, { activity: { ...newActivity(), decisions: d } });
    }
    p.feedbackByBlock['GEO-037'] = {
      interest: 4,
      independence: 3,
      useful: '机制与证据',
      difficult: '不同网格',
    };
    const restored = readProgress(JSON.stringify(p));
    expect(restored.sessions['GEO-033']!.note).toBe('此前的时间尺度解释');
    expect(restored.sessions['GEO-040']!.activity.decisions).toEqual(
      p.sessions['GEO-040']!.activity.decisions,
    );
    expect(restored.feedbackByBlock['GEO-037']).toEqual(
      p.feedbackByBlock['GEO-037'],
    );
    expect(climateFinished('GEO-041', {})).toBe(false);
  });
});
