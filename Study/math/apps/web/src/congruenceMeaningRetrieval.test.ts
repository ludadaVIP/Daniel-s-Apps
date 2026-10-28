import { describe, it, expect } from 'vitest';
import { congruenceMeaningRetrieval } from './content/congruenceMeaningRetrieval';
import { congruenceMotionRetrieval } from './content/congruenceMotionRetrieval';
import { congruenceMotionRecurrence } from './content/congruenceMotionRecurrence';
import { planeMeaningRetrieval } from './content/planeMeaningRetrieval';
import { maintenanceSets } from './content/maintenance';
import { recurrenceLinksFor } from './recurrenceTargets';
import { lessons, curriculum, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  angleTriangle,
  isoscelesModel,
  checkGeometryCode,
} from './congruenceModels';

const sets = Object.values(congruenceMeaningRetrieval);
describe('J86 genuine subskill gaps with retained congruence arguments', () => {
  it('retains all twelve old references, reuses two plane cards and adds eight independent cards', () => {
    const entries = congruenceMotionRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J86-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(28);
    expect(new Set(refs).size).toBe(20);
    expect(refs.filter((id) => id.includes('-CONG-MOTION-'))).toHaveLength(12);
    expect(
      refs.filter((id) => id.includes('-CONGRUENCE-MEANING-')),
    ).toHaveLength(12);
    const owners = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries) {
      const links = recurrenceLinksFor(e.sourceLesson).flatMap(
        (g) => g.targets,
      );
      expect(new Set(e.targets).size).toBe(e.targets.length);
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(owners.indexOf(s.unit)).toBeGreaterThan(owners.indexOf('J86'));
        expect(
          new URL(
            links.find((l) => l.id === id)!.href,
            'http://localhost',
          ).searchParams.get('question'),
        ).toBe(id);
      }
    }
    for (const s of Object.values(congruenceMotionRetrieval))
      expect(s.questions).toHaveLength(10);
    for (const s of Object.values(planeMeaningRetrieval)) {
      expect(s.bridgeByQuestion[s.questions[2]!.id]).toBe('J74-L05');
      expect(s.questions[2]!.stem.en).toContain(
        'Construct interior-angle sets',
      );
    }
    expect(lessons).toHaveLength(358);
  });
  it('keeps bilingual original conditions, human review and separate session keys', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((v) => v.id === s.id)).toBe(s);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J86-L03',
        'J86-L04',
        'J86-L05',
        'J86-L06',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('SSS SAS ASA AAS congruent yes', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('checks six ordered rewrites and rejects reversing a triangle as if it were an edge', () => {
    const expected = [
      ['ABC↔EFD', 'ACB↔EDF', 'BAC↔FED', 'BCA↔FDE', 'CAB↔DEF', 'CBA↔DFE'],
      ['ABC↔FDE', 'ACB↔FED', 'BAC↔DFE', 'BCA↔DEF', 'CAB↔EFD', 'CBA↔EDF'],
    ];
    for (const [i, rows] of expected.entries()) {
      const q = sets[i]!.questions[0]!;
      for (const r of rows) expect(q.solution.en).toContain(r);
      const target = rows[0]!.split('↔')[1]!;
      expect(
        checkGeometryCode([...target].reverse().join(''), target, false),
      ).toBe(false);
      expect(checkGeometryCode('BA', 'AB', true)).toBe(true);
    }
  });
  it('checks legal ASA/AAS values before criteria and excludes zero, straight and excessive angle sums', () => {
    for (const [i, a, b, s, c] of [
      [0, 35, 75, 4, 70],
      [1, 40, 85, 6, 55],
    ] as const) {
      const rows = sets[i]!.questions[0]!.contextTable!.rows;
      expect(rows[1]![2]!.en).toContain(
        `∠A=∠D=${a}°, ∠B=∠E=${b}°, AB=DE=${s}cm`,
      );
      expect(rows[2]![2]!.en).toContain(
        `∠A=∠D=${a}°, ∠C=∠F=${b}°, AB=DE=${s}cm`,
      );
      expect(angleTriangle(a, b, s)).toHaveLength(3);
      expect(a + b + c).toBe(180);
      expect(sets[i]!.questions[0]!.solution.en).toContain(`C=${c}°`);
    }
    for (const [a, b] of [
      [0, 70],
      [80, 100],
      [100, 90],
    ])
      expect(() => angleTriangle(a!, b!, 4)).toThrow();
  });
  it('checks inverse and relabelled isosceles identities over the whole valid domain', () => {
    for (const [i, b, a] of [
      [0, 35, 110],
      [1, 55, 70],
    ] as const) {
      expect(isoscelesModel(a).base).toBe(b);
      expect(sets[i]!.questions[1]!.solution.en).toContain(`B=${a}°`);
    }
    for (const beta of [0.5, 20, 25, 40, 50, 60, 75, 89.5])
      expect(isoscelesModel(180 - 2 * beta).base).toBe(beta);
    for (const a of [0, 180, -20]) expect(() => isoscelesModel(a)).toThrow();
  });
  it('checks separate quadrilateral angle/diagonal cases without conflating bisection and equal diagonals', () => {
    for (const [i, a, ao, bo] of [
      [0, 65, 3, 4],
      [1, 115, 5, 6],
    ] as const) {
      expect(2 * a + 2 * (180 - a)).toBe(360);
      expect(2 * ao).not.toBe(2 * bo);
      const q = sets[i]!.questions[2]!;
      expect(q.solution.en).toContain(`AC=${2 * ao},BD=${2 * bo} cm`);
      expect(q.solution.en).toContain('AOB≅COD');
    }
  });
  it('verifies valid common-diagonal proof examples and a genuine independent counterexample', () => {
    const dist2 = (a: number[], b: number[]) =>
      (a[0]! - b[0]!) ** 2 + (a[1]! - b[1]!) ** 2;
    const cross = (a: number[], b: number[]) => a[0]! * b[1]! - a[1]! * b[0]!;
    const a = [0, 0],
      b = [4, 0],
      c = [5, 3],
      d = [1, 3],
      o = [2.5, 1.5];
    expect(dist2(a, b)).toBe(dist2(c, d));
    expect(dist2(b, c)).toBe(dist2(d, a));
    expect(dist2(a, o)).toBe(dist2(c, o));
    expect(dist2(b, o)).toBe(dist2(d, o));
    expect(cross([4, 0], [-4, 0])).toBe(0);
    expect(cross([1, 3], [1, 3])).toBe(0);
    const halfA = [-2, 0],
      halfC = [2, 0],
      halfB = [0, 1],
      halfD = [0, -3],
      halfO = [0, 0];
    expect(dist2(halfA, halfO)).toBe(dist2(halfC, halfO));
    expect(dist2(halfB, halfO)).not.toBe(dist2(halfD, halfO));
    expect(cross([2, 1], [-2, -3])).not.toBe(0);
    expect(cross([2, -1], [2, -3])).not.toBe(0);
    const ta = [-3, 0],
      tb = [3, 0],
      tc = [2, 2],
      td = [-2, 2];
    expect(dist2(ta, td)).toBe(5);
    expect(dist2(tb, tc)).toBe(5);
    expect(cross([1, 2], [-1, 2])).not.toBe(0);
    expect(sets[0]!.questions[3]!.stem.en).toContain('T2 MUST use AC');
    expect(sets[1]!.questions[3]!.stem.en).toContain('T2 MUST use BD');
    expect(sets[1]!.questions[3]!.solution.en).toContain('ABD≅CDB');
    for (const s of sets) {
      expect(s.questions[3]!.solution.en).toContain('AOD≅COB');
      expect(s.questions[3]!.stem.en).toContain('SAME original givens');
      expect(s.questions[3]!.stem.en).toContain('REMOVE BO=OD');
    }
  });
});
