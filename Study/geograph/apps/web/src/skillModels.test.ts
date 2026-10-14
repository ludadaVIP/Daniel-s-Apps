import { describe, expect, it } from 'vitest';
import {
  cities,
  cityTime,
  coordinateMatch,
  coordinateTargets,
  isLit,
  meetingWorks,
  scaleModel,
  seasonLight,
  skillFinished,
} from './skillModels';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';
import { activityFinished } from './Activities';

describe('distance and coordinates', () => {
  it('keeps ground distances invariant while the viewport and graphic bar change', () => {
    for (const zoom of [1, 1.25, 1.5, 1.75, 2]) {
      const map = scaleModel(zoom);
      expect((map.separation / map.barPixels) * map.barKm).toBeCloseTo(10);
      expect(map.routeKm).toBeGreaterThan(map.straightKm);
    }
    expect(scaleModel(2).barKm).toBe(scaleModel(1).barKm / 2);
  });
  it('rejects hemisphere swaps and does not confuse a single grid line with a point', () => {
    const nz = coordinateTargets[0];
    expect(coordinateMatch(-40, 175, nz)).toBe(true);
    expect(coordinateMatch(40, 175, nz)).toBe(false);
    expect(coordinateMatch(-40, -175, nz)).toBe(false);
    expect(coordinateMatch(175, -40, nz)).toBe(false);
    expect(coordinateMatch(0, 0, coordinateTargets[2])).toBe(false);
  });
});
describe('dated time-zone comparisons', () => {
  it('uses the NZ and UK seasonal rules instead of a permanent 12-hour gap', () => {
    expect(cityTime(0, 7, cities[0])).toMatchObject({
      hour: 20,
      date: '2026-01-15',
      offset: 13,
    });
    expect(cityTime(0, 7, cities[1])).toMatchObject({ hour: 7, offset: 0 });
    expect(cityTime(1, 7, cities[0])).toMatchObject({
      hour: 19,
      date: '2026-07-15',
      offset: 12,
    });
    expect(cityTime(1, 7, cities[1])).toMatchObject({ hour: 8, offset: 1 });
    expect(meetingWorks(0, 7)).toBe(true);
    expect(meetingWorks(1, 7)).toBe(true);
    expect(meetingWorks(1, 9)).toBe(false);
    expect(meetingWorks(0, 12)).toBe(false);
  });
  it('carries forward and backward across local dates, including the static fallback', () => {
    expect(cityTime(0, 12, cities[0])).toMatchObject({
      hour: 1,
      date: '2026-01-16',
    });
    expect(cityTime(0, 7, cities[3])).toMatchObject({
      hour: 21,
      date: '2026-01-14',
    });
    expect(cityTime(0, 7.5, cities[0])).toMatchObject({
      hour: 1,
      date: '2026-01-16',
    });
    for (const date of [0, 1])
      for (const hour of [0, 7, 12, 23])
        for (const city of cities) {
          const live = cityTime(date, hour, city),
            fallback = cityTime(date, hour, city, false);
          expect({ ...live, fallback: true }).toEqual(fallback);
        }
  });
});
describe('rotation and seasonal geometry', () => {
  it('changes daily illumination without changing an orbital position', () => {
    expect(isLit(0)).toBe(true);
    expect(isLit(180)).toBe(false);
    expect(isLit(360)).toBe(true);
    expect(isLit(90)).toBe(false); // boundary, not a complete daylight frame
  });
  it('reverses hemispheric daylight at solstices and preserves latitude differences at zero tilt', () => {
    const juneN = seasonLight(37, 1),
      juneS = seasonLight(-37, 1);
    expect(juneN.daylight).toBeGreaterThan(12);
    expect(juneS.daylight).toBeLessThan(12);
    expect(juneN.daylight + juneS.daylight).toBeCloseTo(24);
    expect(seasonLight(-37, 3).daylight).toBeCloseTo(juneN.daylight);
    expect(seasonLight(-37, 3).noonHeight).toBeGreaterThan(juneS.noonHeight);
    for (const quarter of [0, 1, 2, 3]) {
      expect(seasonLight(37, quarter, 0).daylight).toBeCloseTo(12);
      expect(seasonLight(0, quarter).daylight).toBeCloseTo(12);
    }
    expect(seasonLight(0, 1, 0).noonHeight).toBeGreaterThan(
      seasonLight(51.5, 1, 0).noonHeight,
    );
  });
});
describe('new lesson evidence and compatible local records', () => {
  it('requires both distance views, all coordinate locations, both dates and controlled-season evidence', () => {
    for (const id of ['GEO-005', 'GEO-006', 'GEO-007', 'GEO-008'])
      expect(activityFinished(id, newActivity())).toBe(false);
    expect(
      skillFinished('GEO-005', { 'scale-wide': '10', 'scale-close': '10' }),
    ).toBe(false);
    expect(
      skillFinished('GEO-005', {
        'scale-wide': '10',
        'scale-close': '10',
        'scale-route': '16',
      }),
    ).toBe(true);
    expect(
      skillFinished(
        'GEO-006',
        Object.fromEntries(
          coordinateTargets.map((p) => [
            `located-${p.id}`,
            `${p.lat},${p.lon}`,
          ]),
        ),
      ),
    ).toBe(true);
    expect(
      skillFinished('GEO-007', { 'meeting-0': '7', 'meeting-1': '12' }),
    ).toBe(false);
    expect(
      skillFinished('GEO-007', { 'meeting-0': '7', 'meeting-1': '7' }),
    ).toBe(true);
    expect(
      skillFinished('GEO-008', {
        'observed-day': 'yes',
        'observed-night': 'yes',
      }),
    ).toBe(false);
    expect(
      skillFinished(
        'GEO-008',
        Object.fromEntries(
          ['day', 'night', 'june', 'december', 'untilted'].map((k) => [
            `observed-${k}`,
            'yes',
          ]),
        ),
      ),
    ).toBe(true);
    expect(skillFinished('GEO-096', {})).toBe(false);
  });
  it('loads v1 pilot notes and adds new sessions and separate four-lesson family feedback without losing them', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', {
      note: '原来第一课的发现',
      completedAt: 123,
    });
    p = patchSession(p, 'GEO-008', {
      step: 3,
      activity: {
        ...newActivity(),
        decisions: { 'axis-tilt': '0', 'observed-untilted': 'yes' },
      },
    });
    p.feedback.useful = '原四课反馈';
    p.feedbackByBlock['GEO-005'] = {
      interest: 4,
      independence: 2,
      useful: '新四课的零倾角对照',
      difficult: '时差',
    };
    expect(readProgress(JSON.stringify(p))).toEqual(p);
    const old = {
      version: 1,
      sessions: { 'GEO-001': p.sessions['GEO-001'] },
      feedback: p.feedback,
    };
    const restored = readProgress(JSON.stringify(old));
    expect(restored.sessions['GEO-001']?.note).toBe('原来第一课的发现');
    expect(restored.feedback.useful).toBe('原四课反馈');
    expect(restored.feedbackByBlock).toEqual({});
  });
});
