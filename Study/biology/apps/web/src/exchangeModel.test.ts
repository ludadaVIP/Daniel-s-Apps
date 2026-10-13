import { describe, expect, it } from 'vitest';
import {
  membraneRoute,
  diffusionRun,
  osmosisTendency,
  boxMetrics,
  shapeMetrics,
} from './exchangeModel';
import {
  decodeProgress,
  emptyProgress,
  withMission,
  withProject,
  missionForUnit,
  stageOutcome,
} from './progress';
import { emptyProject } from './project';
describe('substance exchange models', () => {
  it('keeps lipid passage separate from a specific ion channel', () => {
    for (const open of [true, false]) {
      expect(membraneRoute('oxygen', open)).toBe('lipid');
      expect(membraneRoute('protein', open)).toBe('blocked');
    }
    expect(membraneRoute('sodium', false)).toBe('blocked');
    expect(membraneRoute('sodium', true)).toBe('channel');
  });
  it('conserves every walker and reconciles directional flux with count changes', () => {
    for (const left of [4, 8, 12] as const)
      for (const seed of [1, 12345, 12346, 4294967295]) {
        const run = diffusionRun(left, seed);
        expect(run).toHaveLength(7);
        expect(run[0]!.left).toBe(left);
        expect(run[0]!.leftToRight + run[0]!.rightToLeft).toBe(0);
        for (const [i, s] of run.entries()) {
          expect(s.tick).toBe(i * 32);
          expect(s.left + s.right).toBe(16);
          expect(s.particles.filter((p) => p.x < 12)).toHaveLength(s.left);
          expect(s.particles.map((p) => p.id).sort((a, b) => a - b)).toEqual(
            Array.from({ length: 16 }, (_, n) => n),
          );
          for (const p of s.particles) {
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.x).toBeLessThan(24);
            expect(p.y).toBeGreaterThanOrEqual(0);
            expect(p.y).toBeLessThan(12);
          }
          if (i) {
            expect(run[i - 1]!.left - s.left).toBe(
              s.leftToRight - s.rightToLeft,
            );
            expect(s.trail).toHaveLength(33);
            for (let j = 1; j < s.trail.length; j++)
              expect(
                Math.abs(s.trail[j]!.x - s.trail[j - 1]!.x) +
                  Math.abs(s.trail[j]!.y - s.trail[j - 1]!.y),
              ).toBeLessThanOrEqual(1);
          }
        }
      }
  });
  it('replays deterministically, changes traces, and allows balanced-start motion and reverse intervals', () => {
    const run = diffusionRun(12);
    expect(diffusionRun(12)).toEqual(run);
    expect(diffusionRun(12, 12346)).not.toEqual(run);
    const equal = diffusionRun(8);
    expect(equal.some((s) => s.leftToRight > 0 && s.rightToLeft > 0)).toBe(
      true,
    );
    expect(equal.some((s) => s.left !== 8)).toBe(true);
    expect(run.some((s) => s.rightToLeft > s.leftToRight)).toBe(true);
    expect(run[1]!.particles).not.toEqual(run[0]!.particles);
    run[1]!.particles[0]!.x = 99;
    expect(run[0]!.particles.every((p) => p.x < 24)).toBe(true);
  });
  it('produces a high-to-low ensemble tendency without forcing each trace to exact equality', () => {
    const averages = ([4, 8, 12] as const).map(
      (left) =>
        Array.from(
          { length: 128 },
          (_, i) => diffusionRun(left, i + 1).at(-1)!.left,
        ).reduce((a, b) => a + b, 0) / 128,
    );
    expect(averages[0]).toBeGreaterThan(4);
    expect(averages[0]).toBeLessThan(8);
    expect(averages[2]).toBeLessThan(12);
    expect(averages[2]).toBeGreaterThan(8);
    expect(Math.abs(averages[1]! - 8)).toBeLessThan(0.5);
  });
  it('requires a water-permeable boundary for each initial osmosis tendency', () => {
    for (const solution of ['dilute', 'same', 'concentrated'] as const)
      expect(osmosisTendency(solution, false)).toBe('blocked');
    expect(osmosisTendency('dilute', true)).toBe('into');
    expect(osmosisTendency('same', true)).toBe('balanced');
    expect(osmosisTendency('concentrated', true)).toBe('out');
  });
  it('compares exact exposed geometry at equal volume and obeys scaling rules', () => {
    expect(shapeMetrics('large')).toEqual({
      area: 24,
      volume: 8,
      areaPerVolume: 3,
      centreDistance: 1,
    });
    expect(shapeMetrics('small')).toEqual({
      area: 48,
      volume: 8,
      areaPerVolume: 6,
      centreDistance: 0.5,
    });
    expect(shapeMetrics('flat')).toEqual({
      area: 28,
      volume: 8,
      areaPerVolume: 3.5,
      centreDistance: 0.5,
    });
    const small = boxMetrics(1, 1, 1),
      large = boxMetrics(5, 5, 5);
    expect(large.area / small.area).toBe(25);
    expect(large.volume / small.volume).toBe(125);
    expect(large.areaPerVolume / small.areaPerVolume).toBeCloseTo(1 / 5);
    expect(boxMetrics(2, 1, 4)).toEqual(shapeMetrics('flat'));
    for (const bad of [0, -1, NaN, Infinity])
      expect(() => boxMetrics(bad, 1, 1)).toThrow(RangeError);
    for (const bad of [0, -1, 1.5, Infinity])
      expect(() => boxMetrics(1, 1, 1, bad)).toThrow(RangeError);
  });
  it('restores U08 without overwriting earlier missions, project or S01 counts', () => {
    let p = withMission(emptyProgress(), 'U07', {
      object: '叶肉与洋葱',
      evidence: '结构',
      reasoning: '工作',
      savedAt: 10,
    });
    const project = {
      ...emptyProject(),
      zh: '先前观察',
      en: 'Previous observations',
      savedAt: 10,
    };
    project.records = project.records.map((r, i) => ({
      ...r,
      name: `生物${i + 1}`,
      evidence: '虚拟记录',
      habitat: '叶片',
      question: '下一次怎样观察？',
    }));
    p = withProject(p, 'S01', project);
    p = withMission(p, 'U08', {
      object: '12:4，0到32步',
      evidence: '12到11；5向右4向左',
      reasoning: '净向右1',
      savedAt: 20,
    });
    p.sessions.L032 = { step: 3, note: '几何不是速率', completedAt: 20 };
    const restored = decodeProgress(JSON.stringify(p));
    expect(missionForUnit(restored, 'U08').reasoning).toBe('净向右1');
    expect(missionForUnit(restored, 'U07').object).toBe('叶肉与洋葱');
    expect(restored.projects.S01).toEqual(project);
    expect(restored.sessions.L032?.note).toBe('几何不是速率');
    expect(stageOutcome(restored).lessons).toBe(0);
    expect(stageOutcome(restored).missions).toBe(0);
  });
});
