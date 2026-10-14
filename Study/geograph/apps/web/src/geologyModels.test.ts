import { describe, expect, it } from 'vitest';
import {
  boundaryOffsets,
  boundaryTypes,
  earthLayers,
  geologyFinished,
  modelFrame,
  volcanoCases,
} from './geologyModels';
import earthquakes from '../../../content/earthquake-data.json';
import { activityFinished } from './Activities';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';
const completeMissions = (): Record<string, Record<string, string>> => ({
  'GEO-017': {
    ...Object.fromEntries(earthLayers.map((p) => [`inside-${p.id}`, p.id])),
    'inside-state': 'solid',
    'inside-evidence': 'waves',
  },
  'GEO-018': {
    'puzzle-fit': 'checked',
    'puzzle-evidence': 'fossils',
    'plate-size': 'both',
    ...Object.fromEntries(
      boundaryTypes.flatMap((p) => [
        [`boundary-seen-${p.id}`, 'yes'],
        [`boundary-${p.id}`, p.id],
      ]),
    ),
  },
  'GEO-019': {
    ...Object.fromEntries([0, 2, 3, 4].map((n) => [`fault-seen-${n}`, 'yes'])),
    'quake-focus': 'underground',
    'quake-epicentre': 'above',
    'quake-pattern': 'limited',
    'quake-safety': 'cover',
  },
  'GEO-020': {
    ...Object.fromEntries(
      volcanoCases.flatMap((p) => [
        [`volcano-${p.id}`, p.setting],
        [`magma-${p.id}`, p.cause],
        [`volcano-seen-${p.id}`, 'yes'],
      ]),
    ),
    'volcano-limit': 'some',
  },
});
describe('geological teaching evidence', () => {
  it('keeps divergence/convergence opposite and transform motion parallel to the boundary', () => {
    const d = boundaryOffsets('divergent', 4),
      c = boundaryOffsets('convergent', 4),
      t = boundaryOffsets('transform', 4);
    expect(d.leftX).toBeLessThan(0);
    expect(d.rightX).toBeGreaterThan(0);
    expect(c.leftX).toBeGreaterThan(0);
    expect(c.rightX).toBeLessThan(0);
    expect(t.leftX).toBe(0);
    expect(t.rightX).toBe(0);
    expect(t.leftY).toBeLessThan(0);
    expect(t.rightY).toBeGreaterThan(0);
    expect(boundaryOffsets('divergent', -1)).toEqual(
      boundaryOffsets('divergent', 0),
    );
  });
  it('repairs corrupt persisted frame values without an out-of-range diagram', () => {
    for (const v of ['NaN', 'Infinity', 'corrupt', undefined])
      expect(modelFrame(v, 4)).toBe(0);
    expect(modelFrame('-7', 4)).toBe(0);
    expect(modelFrame('999', 4)).toBe(4);
    expect(modelFrame('2.4', 4)).toBe(2);
  });
  it('requires every layer, boundary, fault observation and volcanic causal case before completing', () => {
    for (const [id, d] of Object.entries(completeMissions())) {
      expect(activityFinished(id, newActivity())).toBe(false);
      expect(geologyFinished(id, d)).toBe(true);
      expect(activityFinished(id, { ...newActivity(), decisions: d })).toBe(
        true,
      );
      for (const key of Object.keys(d)) {
        const partial = { ...d };
        delete partial[key];
        expect(geologyFinished(id, partial), `${id} missing ${key}`).toBe(
          false,
        );
        expect(geologyFinished(id, { ...d, [key]: 'wrong' })).toBe(false);
      }
    }
  });
  it('retains S1 atlas/notes and four S2 mission histories in the same v1 store', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', {
      note: '旧的蓝色家园记录',
    });
    for (const [id, d] of Object.entries(completeMissions()))
      p = patchSession(p, id, {
        step: 3,
        activity: { ...newActivity(), decisions: d },
        note: '解释原因，保留模型的局限。',
      });
    p.feedbackByBlock['GEO-017'] = {
      interest: 4,
      independence: 3,
      useful: '剖面',
      difficult: '时间尺度',
    };
    expect(readProgress(JSON.stringify(p))).toEqual(p);
  });
  it('uses actual catalogue locations with an explicit historical period and magnitude threshold', () => {
    expect(earthquakes.events).toHaveLength(121);
    expect(new Set(earthquakes.events.map((p) => p.id)).size).toBe(121);
    expect(earthquakes.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(earthquakes.minimumMagnitude).toBe(6);
    for (const p of earthquakes.events) {
      expect(p.time).toBeGreaterThanOrEqual(Date.UTC(2020, 0, 1));
      expect(p.time).toBeLessThan(Date.UTC(2021, 0, 1));
      expect(p.magnitude).toBeGreaterThanOrEqual(6);
      expect(p.lon).toBeGreaterThanOrEqual(-180);
      expect(p.lon).toBeLessThanOrEqual(180);
      expect(p.lat).toBeGreaterThanOrEqual(-90);
      expect(p.lat).toBeLessThanOrEqual(90);
      expect(Number.isFinite(p.depthKm)).toBe(true);
    }
  });
});
