import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assets, curriculum, lessons, parseLessonMarkdown } from './content';
import { activityFinished } from './Activities';
import {
  routeFinished,
  routeMove,
  rotatePoint,
  worldPoint,
  worldTargets,
} from './models';
import {
  dueLessons,
  emptyProgress,
  finishSession,
  newActivity,
  patchSession,
  readProgress,
} from './progress';

describe('published curriculum and assets', () => {
  it('retains every planned ID and publishes complete lessons in curriculum order', () => {
    expect(curriculum).toHaveLength(6);
    const ids = curriculum.flatMap((s) => {
      expect(s.lessons).toHaveLength(16);
      return s.lessons.map((l) => l.id);
    });
    expect(ids).toEqual(
      Array.from(
        { length: 96 },
        (_, i) => `GEO-${String(i + 1).padStart(3, '0')}`,
      ),
    );
    expect(
      curriculum.flatMap((s) =>
        s.lessons.filter((l) => l.status === 'available').map((l) => l.id),
      ),
    ).toEqual(lessons.map((l) => l.id));
    expect(lessons).toHaveLength(40);
    expect(
      curriculum.flatMap((s) =>
        s.lessons.filter((l) => l.project).map((l) => l.id),
      ),
    ).toEqual([
      'GEO-016',
      'GEO-032',
      'GEO-048',
      'GEO-064',
      'GEO-080',
      'GEO-096',
    ]);
  });
  it('has bilingual evidence, guidance, explanations and transfer feedback in every lesson', () => {
    for (const l of lessons) {
      expect(l.outcomes.length).toBeGreaterThanOrEqual(2);
      expect(l.terms.length).toBeGreaterThanOrEqual(3);
      expect(l.blocks['parent']!.en).toMatch(/alternative/i);
      expect(l.sources.length).toBeGreaterThan(0);
      expect(l.assetIds).toContain(l.hero);
      for (const id of l.assetIds)
        expect(assets.find((a) => a.id === id)?.publishable).toBe(true);
      for (const q of [...l.recall, l.transfer]) {
        expect(q.options[q.answer]).toBeDefined();
        for (const text of [q.prompt, q.explanation, q.hint, ...q.options]) {
          expect(text.zh.trim().length).toBeGreaterThan(0);
          expect(text.en.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
  it('rejects a lesson missing an English story before it can publish', () => {
    expect(() =>
      parseLessonMarkdown(
        'id: GEO-001\n<!-- section:hook --><!-- zh -->问题<!-- en -->Question',
      ),
    ).toThrow(/missing bilingual/);
  });
  it('ships cleared local files and preserves exact photographic capture years', () => {
    const root = fileURLToPath(new URL('../../../../', import.meta.url));
    for (const a of assets) {
      expect(a.publishable).toBe(true);
      expect(a.verified_on).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.license.trim().length).toBeGreaterThan(0);
      const path = a.path.startsWith('/')
        ? `${root}public${a.path}`
        : `${root}${a.path}`;
      expect(existsSync(path), path).toBe(true);
      expect(a.creator).not.toMatch(/TBD/);
    }
    expect(assets.find((a) => a.id === 'apollo17-earth')?.data_year).toBe(1972);
    expect(assets.find((a) => a.id === 'south-island-modis')?.data_year).toBe(
      2007,
    );
    const img = readFileSync(
      `${root}public/geography/images/apollo17-earth.jpg`,
    );
    expect(img[0]).toBe(0xff);
    expect(img[1]).toBe(0xd8);
  });
});
describe('map directions and evidence tasks', () => {
  it('keeps east clockwise from north after a quarter turn', () => {
    const north = rotatePoint(250, 150, 90),
      east = rotatePoint(350, 250, 90);
    expect(north.x).toBeCloseTo(350);
    expect(north.y).toBeCloseTo(250);
    expect(east.x).toBeCloseTo(250);
    expect(east.y).toBeCloseTo(350);
  });
  it('blocks the direct river crossing while allowing the connected bridge route', () => {
    expect(routeMove(['school'], 'library')).toMatchObject({
      valid: false,
      reason: 'river',
    });
    let route = ['school'];
    for (const stop of ['south', 'bridge', 'north', 'library']) {
      const next = routeMove(route, stop);
      expect(next.valid).toBe(true);
      route = next.route;
    }
    expect(routeFinished(route)).toBe(true);
    expect(routeFinished(['school', 'bridge', 'library'])).toBe(false);
  });
  it('shows one Pacific region after recentering without moving New Zealand north of the equator', () => {
    const nz = worldPoint(173, -41, 180);
    expect(nz.x).toBeGreaterThan(400);
    expect(nz.x).toBeLessThan(500);
    expect(nz.y).toBeGreaterThan(225);
    expect(worldPoint(-145, -6, 0).x).toBeLessThan(100);
    expect(worldPoint(-145, -6, 180).x).toBeGreaterThan(500);
  });
  it('records learning evidence only after actual maps and model tasks are complete', () => {
    expect(activityFinished('GEO-001', newActivity())).toBe(false);
    expect(
      activityFinished('GEO-001', {
        ...newActivity(),
        found: ['land', 'cloud', 'ocean'],
      }),
    ).toBe(true);
    expect(
      activityFinished('GEO-002', {
        ...newActivity(),
        matches: { asia: 'africa' },
      }),
    ).toBe(false);
    expect(
      activityFinished('GEO-002', {
        ...newActivity(),
        matches: Object.fromEntries(worldTargets.map((p) => [p.id, p.id])),
      }),
    ).toBe(true);
    expect(
      activityFinished('GEO-003', {
        ...newActivity(),
        decisions: {
          appearance: 'roads',
          connections: 'roads',
          landforms: 'terrain',
        },
      }),
    ).toBe(false);
    expect(
      activityFinished('GEO-004', {
        ...newActivity(),
        route: ['school', 'south', 'bridge', 'north', 'library'],
        decisions: { direction: 'N' },
      }),
    ).toBe(false);
    expect(
      activityFinished('GEO-004', {
        ...newActivity(),
        route: ['school', 'south', 'bridge', 'north', 'library'],
        decisions: { direction: 'N', rotated: 'yes' },
      }),
    ).toBe(true);
  });
});
describe('local learning records', () => {
  it('retains notes, a lesson step, answers and models after a reload', () => {
    const original = patchSession(emptyProgress(), 'GEO-004', {
      step: 4,
      note: '北箭头给了我证据。',
      answers: { 'direction-q1': 1 },
      activity: {
        ...newActivity(),
        rotation: 90,
        route: ['school', 'south', 'bridge'],
      },
    });
    const restored = readProgress(JSON.stringify(original));
    expect(restored).toEqual(original);
  });
  it('ignores invalid lesson IDs and repairs malformed fields safely', () => {
    const repaired = readProgress(
      JSON.stringify({
        version: 1,
        sessions: {
          'GEO-096': {},
          'GEO-001': {
            step: 999,
            note: 42,
            activity: { rotation: 17, layer: 'fake', route: 42 },
            answers: { a: -1, b: 0 },
          },
        },
      }),
    );
    expect(repaired.sessions['GEO-096']).toBeUndefined();
    expect(repaired.sessions['GEO-001']).toMatchObject({
      step: 0,
      note: '',
      answers: { b: 0 },
      activity: { rotation: 0, layer: 'satellite', route: ['school'] },
    });
    expect(() => readProgress('{broken')).toThrow();
    expect(() => readProgress('{"version":2}')).toThrow();
  });
  it('schedules a revisit seven days later and preserves the original exploration date', () => {
    const now = 2_000_000_000_000;
    const p = finishSession(emptyProgress(), 'GEO-001', now);
    expect(dueLessons(p, now + 6 * 86400000)).toEqual([]);
    expect(dueLessons(p, now + 7 * 86400000)).toEqual(['GEO-001']);
    expect(
      finishSession(p, 'GEO-001', now + 8 * 86400000).sessions['GEO-001']!
        .completedAt,
    ).toBe(now);
  });
});
