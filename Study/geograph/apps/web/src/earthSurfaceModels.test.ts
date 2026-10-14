import { describe, expect, it } from 'vitest';
import { activityFinished } from './Activities';
import {
  beachBudget,
  beachCases,
  bendGeometry,
  driftTrack,
  earthSurfaceFinished,
  glacierCases,
  glacierPositions,
  moveSoilLayer,
  readSoilOrder,
  soilPores,
  valleySection,
} from './earthSurfaceModels';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';
const missions = (): Record<string, Record<string, string>> => ({
  'GEO-025': {
    'bend-seen-0': 'yes',
    'bend-seen-4': 'yes',
    'flood-seen-normal': 'yes',
    'flood-seen-high': 'yes',
    ...Object.fromEntries(
      bendGeometry(4).sites.map((s) => [`bend-${s.id}`, s.correct]),
    ),
    'bend-change': 'lateral',
    'flood-limit': 'possible',
  },
  'GEO-026': {
    'valley-seen-river': 'yes',
    'valley-seen-glacier': 'yes',
    'valley-river': 'V',
    'valley-glacier': 'U',
    ...Object.fromEntries(
      glacierCases.flatMap((c) => [
        [`ice-seen-${c.id}-0`, 'yes'],
        [`ice-seen-${c.id}-4`, 'yes'],
        [`ice-front-${c.id}`, c.id],
      ]),
    ),
    'ice-motion': 'down',
    'ice-work': 'abrasion',
    'valley-limit': 'history',
  },
  'GEO-027': {
    ...Object.fromEntries(
      ['right', 'left'].flatMap((k) => [
        [`drift-seen-${k}-0`, 'yes'],
        [`drift-seen-${k}-8`, 'yes'],
        [`drift-net-${k}`, k],
      ]),
    ),
    ...Object.fromEntries(
      beachCases.flatMap((c) => [
        [`beach-seen-${c.id}`, 'yes'],
        [`beach-${c.id}`, c.id],
      ]),
    ),
    'coast-cliff': 'erode',
    'coast-beach': 'deposit',
    'coast-stack': 'remnant',
    'coast-limit': 'budget',
  },
  'GEO-028': {
    'soil-order': 'O,A,B,C,R',
    'soil-checked': 'yes',
    ...Object.fromEntries([0, 25, 50].map((n) => [`pore-seen-${n}`, 'yes'])),
    ...Object.fromEntries(
      ['mineral', 'organic', 'water', 'air'].map((k) => [
        `soil-component-${k}`,
        k,
      ]),
    ),
    'soil-air': 'less',
    'soil-parent': 'transported',
    'soil-plant': 'supplied',
    'soil-photo': 'tests',
  },
});
describe('GEO-025–028 surface process models', () => {
  it('keeps inner/outer bends relative to curvature, with opposite page-side erosion and lateral migration', () => {
    const start = bendGeometry(0),
      end = bendGeometry(4);
    expect(start.points).toHaveLength(97);
    expect(start.points[0]!.y).toBeCloseTo(start.points[96]!.y);
    expect(end.sites[0]!.y).toBeLessThan(start.sites[0]!.y);
    expect(end.sites[3]!.y).toBeGreaterThan(start.sites[3]!.y);
    expect(end.sites[0]!.correct).toBe('erode');
    expect(end.sites[3]!.correct).toBe('erode');
    expect(end.sites[1]!.correct).toBe('deposit');
    expect(end.sites[4]!.correct).toBe('deposit');
    expect(end.sites[2]!.y).toBeLessThan(
      end.points.find((p) => p.x === 320)!.y - 30,
    );
    expect(bendGeometry(NaN)).toEqual(start);
    expect(bendGeometry(999)).toEqual(end);
  });
  it('uses shared cross-section extents while the U analogy has a wider deep floor', () => {
    const v = valleySection('river'),
      u = valleySection('glacier');
    expect(v.map((p) => p.x)).toEqual(u.map((p) => p.x));
    expect(v[0]!.depth).toBe(0);
    expect(u[40]!.depth).toBe(0);
    expect(v[20]!.depth).toBe(1);
    expect(u[20]!.depth).toBe(1);
    expect(u.filter((p) => p.depth >= 0.8).length).toBeGreaterThan(
      v.filter((p) => p.depth >= 0.8).length,
    );
    for (const p of [...v, ...u]) expect(p.depth).toBeGreaterThanOrEqual(0);
  });
  it('moves the ice marker down-valley under retreat, advance and balanced front conditions', () => {
    for (const c of glacierCases) {
      const a = glacierPositions(c.id, 0),
        b = glacierPositions(c.id, 4);
      expect(b.marker).toBeGreaterThan(a.marker);
      expect(b.front - a.front).toBe(c.delta * 4);
      for (let f = 0; f <= 4; f++)
        expect(glacierPositions(c.id, f).marker).toBeLessThan(
          glacierPositions(c.id, f).front,
        );
    }
    expect(glacierPositions('corrupt', Infinity)).toEqual(
      glacierPositions('advance', 0),
    );
    expect(glacierPositions('retreat', 99)).toEqual(
      glacierPositions('retreat', 4),
    );
  });
  it('retains seaward backwash but reverses net alongshore movement when wave approach reverses', () => {
    const r = driftTrack('right', 8),
      l = driftTrack('left', 8);
    expect(r).toHaveLength(9);
    expect(l).toHaveLength(9);
    for (let i = 1; i < 8; i += 2) {
      expect(r[i + 1]!.x).toBe(r[i]!.x);
      expect(r[i + 1]!.y).toBeGreaterThan(r[i]!.y);
      expect(l[i + 1]!.x).toBe(l[i]!.x);
    }
    expect(r[8]!.x - r[0]!.x).toBe(180);
    expect(l[8]!.x - l[0]!.x).toBe(-180);
    expect(r[8]!.y).toBe(r[0]!.y);
    expect(driftTrack('left', NaN)).toHaveLength(1);
    expect(driftTrack('right', 100)).toEqual(r);
  });
  it('accounts for both sediment input and output without equating deposition alone with net gain', () => {
    expect(beachCases.map((c) => beachBudget(c.id).remaining)).toEqual([
      8, 6, 4,
    ]);
    for (const c of beachCases) {
      const b = beachBudget(c.id);
      expect(b.remaining + b.outgoing).toBe(b.initial + b.incoming);
      expect(b.incoming).toBeGreaterThan(0);
    }
    expect(beachBudget('broken')).toEqual(beachBudget('gain'));
  });
  it('shares a fixed pore volume between water and air, with finite clamping', () => {
    for (let n = 0; n <= 50; n++) {
      const p = soilPores(n);
      expect(p.air + p.water).toBe(50);
      expect(p.mineral + p.organic + p.air + p.water).toBe(100);
    }
    expect(soilPores(50).air).toBe(0);
    expect(soilPores(Infinity)).toEqual(soilPores(0));
    expect(soilPores(-1).water).toBe(0);
    expect(soilPores(51).water).toBe(50);
  });
  it('repairs duplicated/missing soil layers and preserves all layers through bounded sorting', () => {
    const draft = ['B', 'R', 'O', 'C', 'A'];
    expect(readSoilOrder('O,A,B,C,C')).toEqual(draft);
    expect(readSoilOrder('O,A,B,C,R')).toEqual(['O', 'A', 'B', 'C', 'R']);
    expect(moveSoilLayer(draft, 'B', -1)).toEqual(draft);
    expect(moveSoilLayer(draft, 'A', 1)).toEqual(draft);
    expect(moveSoilLayer(draft, 'unknown', 1)).toEqual(draft);
    expect(new Set(moveSoilLayer(draft, 'O', -1)).size).toBe(5);
  });
  it('requires observed model states and causal/limitation judgments before each mission finishes', () => {
    for (const [id, d] of Object.entries(missions())) {
      expect(activityFinished(id, newActivity())).toBe(false);
      expect(activityFinished(id, { ...newActivity(), decisions: d })).toBe(
        true,
      );
      for (const key of Object.keys(d)) {
        const partial = { ...d };
        delete partial[key];
        expect(earthSurfaceFinished(id, partial), `${id}: missing ${key}`).toBe(
          false,
        );
        expect(
          earthSurfaceFinished(id, { ...d, [key]: 'invalid' }),
          `${id}: wrong ${key}`,
        ).toBe(false);
      }
    }
    expect(
      earthSurfaceFinished('GEO-028', {
        ...missions()['GEO-028']!,
        'soil-order': 'A,O,B,C,R',
      }),
    ).toBe(false);
  });
  it('round-trips new sessions and seventh feedback alongside original v1 notes and sixth feedback', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', {
      note: '保留最早的观察',
      step: 4,
    });
    p.feedbackByBlock['GEO-021'] = {
      interest: 4,
      independence: 3,
      useful: '旧反馈',
      difficult: '',
    };
    for (const [id, d] of Object.entries(missions()))
      p = patchSession(p, id, {
        activity: { ...newActivity(), decisions: d },
        step: 3,
        note: '验收示例：条件、变化与局限。',
      });
    p.feedbackByBlock['GEO-025'] = {
      interest: 4,
      independence: 3,
      useful: '对照',
      difficult: '尺度',
    };
    expect(readProgress(JSON.stringify(p))).toEqual(p);
  });
});
