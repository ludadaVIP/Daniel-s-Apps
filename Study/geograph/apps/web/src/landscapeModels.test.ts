import { describe, expect, it } from 'vitest';
import { activityFinished } from './Activities';
import {
  compressedBlock,
  erosionCases,
  landscapeFinished,
  moveRiverCard,
  particlePositions,
  readRiverOrder,
  readRock,
  riverSettings,
  rockEdges,
  rockProcesses,
  rockStep,
  surfaceBudget,
  surfaceProcesses,
} from './landscapeModels';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';

const missions = (): Record<string, Record<string, string>> => ({
  'GEO-021': {
    'mountain-seen-0': 'yes',
    'mountain-seen-4': 'yes',
    'mountain-map': 'alps',
    'mountain-motion': 'oblique',
    'mountain-material': 'thicken',
    ...Object.fromEntries(
      erosionCases.flatMap((c) => [
        [`budget-seen-${c.id}`, 'yes'],
        [`budget-${c.id}`, c.id],
      ]),
    ),
  },
  'GEO-022': {
    ...Object.fromEntries(
      rockEdges.map((e) => [`rock-edge-${e.id}`, e.process]),
    ),
    ...Object.fromEntries(
      rockProcesses.map((p) => [`rock-used-${p.id}`, 'yes']),
    ),
    'rock-shortcut': 'yes',
    'rock-solid': 'solid',
    'rock-photo-limit': 'origin',
  },
  'GEO-023': {
    ...Object.fromEntries([1, 2, 3].map((f) => [`particle-seen-${f}`, 'yes'])),
    ...Object.fromEntries(
      [0, 50, 100].map((v) => [`compare-seen-${v}`, 'yes']),
    ),
    ...Object.fromEntries(
      surfaceProcesses.map((p, i) => [`surface-${i + 1}`, p.id]),
    ),
    'change-evidence': 'bank',
    'weather-chemical': 'alter',
  },
  'GEO-024': {
    'river-order': 'gorge,meander,plain',
    'river-order-checked': 'yes',
    ...Object.fromEntries(
      riverSettings.flatMap((s) => [
        [`river-seen-${s.id}`, 'yes'],
        [`river-outcome-${s.id}`, s.outcome],
      ]),
    ),
    'river-speed': 'depends',
    'river-photo-limit': 'different',
  },
});
describe('landscape process evidence', () => {
  it('conserves the block analogy area while shortening and thickening, with corrupt frame repair', () => {
    for (let f = 0; f <= 4; f++) {
      const b = compressedBlock(f);
      expect(b.width * b.thickness).toBeCloseTo(17600);
      if (f > 0) {
        expect(b.width).toBeLessThan(compressedBlock(f - 1).width);
        expect(b.thickness).toBeGreaterThan(compressedBlock(f - 1).thickness);
      }
    }
    expect(compressedBlock(Infinity)).toEqual(compressedBlock(0));
    expect(compressedBlock(-10)).toEqual(compressedBlock(0));
    expect(compressedBlock(99)).toEqual(compressedBlock(4));
  });
  it('distinguishes uplift from surface rise under simultaneous fictional removal', () => {
    expect(surfaceBudget(1, 4)).toBe(18);
    expect(surfaceBudget(3, 4)).toBe(10);
    expect(surfaceBudget(5, 4)).toBe(2);
    expect(surfaceBudget(99, 4)).toBe(0);
    for (const r of [1, 3, 5]) expect(surfaceBudget(r, 0)).toBe(10);
    expect(surfaceBudget(3, Infinity)).toBe(10);
  });
  it('allows genuine rock shortcuts and prevents confusing cooling, lithification and solid change', () => {
    expect(rockStep('igneous', 'heat')).toBe('metamorphic');
    expect(rockStep('metamorphic', 'weather')).toBe('sediments');
    expect(rockStep('sediments', 'lithify')).toBe('sedimentary');
    expect(rockStep('sedimentary', 'melt')).toBe('magma');
    expect(rockStep('magma', 'cool')).toBe('igneous');
    expect(rockStep('sediments', 'cool')).toBeNull();
    expect(rockStep('magma', 'heat')).toBeNull();
    expect(rockStep('igneous', 'lithify')).toBeNull();
    expect(readRock('broken')).toBe('igneous');
  });
  it('keeps eight drawn solid particles and separates in-place breakdown, movement and accumulation', () => {
    const stages = [0, 1, 2, 3].map(particlePositions);
    for (const particles of stages) {
      expect(particles).toHaveLength(8);
      expect(new Set(particles.map((p) => `${p.x},${p.y}`)).size).toBe(8);
    }
    expect(Math.max(...stages[1]!.map((p) => p.x))).toBeLessThan(230);
    expect(Math.min(...stages[2]!.map((p) => p.x))).toBeGreaterThan(230);
    expect(stages[3]!.every((p) => p.y >= 230)).toBe(true);
    expect(particlePositions(NaN)).toEqual(stages[0]);
  });
  it('repairs duplicated/unknown river cards and preserves one of each through boundary moves', () => {
    const order = readRiverOrder('plain,plain,meander');
    expect(order).toEqual(['plain', 'gorge', 'meander']);
    expect(readRiverOrder('corrupt')).toEqual(order);
    expect(moveRiverCard(order, 'plain', -1)).toEqual(order);
    const next = moveRiverCard(order, 'plain', 1);
    expect(next).toEqual(['gorge', 'plain', 'meander']);
    expect(moveRiverCard(next, 'plain', 1)).toEqual([
      'gorge',
      'meander',
      'plain',
    ]);
    expect(moveRiverCard(order, 'unknown', 1)).toEqual(order);
  });
  it('requires hands-on histories, all causal cases and limits before recording completed missions', () => {
    for (const [id, d] of Object.entries(missions())) {
      expect(activityFinished(id, newActivity())).toBe(false);
      expect(activityFinished(id, { ...newActivity(), decisions: d })).toBe(
        true,
      );
      for (const key of Object.keys(d)) {
        const partial = { ...d };
        delete partial[key];
        expect(landscapeFinished(id, partial), `${id}: missing ${key}`).toBe(
          false,
        );
        expect(
          landscapeFinished(id, { ...d, [key]: 'wrong' }),
          `${id}: invalid ${key}`,
        ).toBe(false);
      }
    }
    expect(
      landscapeFinished('GEO-024', {
        ...missions()['GEO-024']!,
        'river-order': 'plain,meander,gorge',
      }),
    ).toBe(false);
  });
  it('round-trips new histories and sixth feedback without losing old v1 learning records', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', { note: '保留旧观察' });
    for (const [id, d] of Object.entries(missions()))
      p = patchSession(p, id, {
        step: 3,
        note: '条件、过程、结果；指出局限。',
        activity: { ...newActivity(), decisions: d },
      });
    p.feedbackByBlock['GEO-021'] = {
      interest: 4,
      independence: 3,
      useful: '过程比较',
      difficult: '模型尺度',
    };
    expect(readProgress(JSON.stringify(p))).toEqual(p);
  });
});
