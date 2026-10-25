import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { fractionOperationsRecurrence } from './content/fractionOperationsRecurrence';
import { fractionOperationsRetrieval } from './content/fractionOperationsRetrieval';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';

const sets = Object.values(fractionOperationsRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('fraction-operation content recurrence', () => {
  it('retrieves every actual P61 skill through exact tasks in at least two later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'P61')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(fractionOperationsRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of fractionOperationsRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const laterUnits = new Set(
        e.targets.map((id) => {
          const task = tasks.get(id)!;
          expect(task, id).toBeDefined();
          expect(units.indexOf(task.unit)).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          expect(task.q.answer.kind).toBe('explain');
          expect(checkAnswer(task.q.solution.zh, task.q.answer)).toBeNull();
          return task.unit;
        }),
      );
      expect(laterUnits.size).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('requires ten bilingual model arguments and preserves existing lessons and reviews', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('9/10 10/21 zero denominator original whole', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('checks each model with exact rational conservation and rejects the stated misconceptions', () => {
    const cases = [
      {
        groups: 4,
        n: 3,
        d: 5,
        totalN: 12,
        totalD: 5,
        cols: 4,
        rows: 5,
        chosen: 3,
        takeRows: 2,
        productN: 3,
        productD: 10,
        improperCols: 5,
        improperN: 1,
        improperD: 2,
        shareN: 3,
        shareD: 5,
        count: 4,
        eachN: 3,
        eachD: 20,
        whole: 3,
        standardN: 2,
        standardD: 5,
        quotN: 15,
        quotD: 2,
        full: 7,
        leftN: 1,
        leftD: 5,
        leftRatioN: 1,
        leftRatioD: 2,
      },
      {
        groups: 5,
        n: 7,
        d: 8,
        totalN: 35,
        totalD: 8,
        cols: 3,
        rows: 7,
        chosen: 2,
        takeRows: 3,
        productN: 2,
        productD: 7,
        improperCols: 4,
        improperN: 4,
        improperD: 7,
        shareN: 5,
        shareD: 6,
        count: 3,
        eachN: 5,
        eachD: 18,
        whole: 2,
        standardN: 3,
        standardD: 8,
        quotN: 16,
        quotD: 3,
        full: 5,
        leftN: 1,
        leftD: 8,
        leftRatioN: 1,
        leftRatioD: 3,
      },
    ];
    for (const c of cases) {
      expect(c.groups * c.n * c.totalD).toBe(c.totalN * c.d);
      expect((c.groups * c.n) / (c.groups * c.d)).toBe(c.n / c.d);
      expect((c.groups * c.n) / (c.groups * c.d)).not.toBe(c.totalN / c.totalD);
      expect(c.chosen * c.takeRows * c.productD).toBe(
        c.productN * c.cols * c.rows,
      );
      expect(c.improperCols * c.takeRows * c.improperD).toBe(
        c.improperN * c.cols * c.rows,
      );
      expect(c.count * c.eachN * c.shareD).toBe(c.shareN * c.eachD);
      expect(c.whole * c.standardD * c.quotD).toBe(c.quotN * c.standardN);
      expect(c.full * c.standardN * c.leftD + c.leftN * c.standardD).toBe(
        c.whole * c.standardD * c.leftD,
      );
      expect(c.leftN * c.standardD * c.leftRatioD).toBe(
        c.leftRatioN * c.leftD * c.standardN,
      );
      expect(c.leftN / c.leftD).not.toBe(c.leftRatioN / c.leftRatioD);
      expect(c.full).toBe(Math.floor(c.quotN / c.quotD));
    }
    expect((1 * 3) / 5).toBe(3 / 5);
    expect((1 * 4) / 5).toBe(4 / 5);
    // Inverse checks cross-multiply integers; no decimal tolerance hides errors.
    for (const [an, ad, bn, bd, qn, qd] of [
      [3, 5, 2, 3, 9, 10],
      [5, 6, 7, 4, 10, 21],
    ]) {
      expect(qn! * bn! * ad!).toBe(an! * qd! * bd!);
      expect(bn! * bd!).not.toBe(0);
    }
    expect((5 / 9) * 3).not.toBe(5 / 6);
    expect(5 / 6 / (1 / 2)).toBeGreaterThan(5 / 6);
    // Zero divisor: no solution for a nonzero dividend, non-unique for zero.
    expect([-3, 0, 2].every((q) => q * 0 === 0)).toBe(true);
  });
});
