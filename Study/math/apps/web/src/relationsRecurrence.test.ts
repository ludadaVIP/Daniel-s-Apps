import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { relationsRetrieval } from './content/relationsRetrieval';
import { relationsRecurrence } from './content/relationsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(relationsRetrieval);
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
describe('ratios, negative numbers and early algebra recurrence', () => {
  it('covers all sixteen actual P63-P65 skills in exact tasks across later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['P63', 'P64', 'P65'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(16);
    expect(new Set(relationsRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of relationsRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        l.questions.some((q) => q.id === e.sourceTask && q.skill === e.skill),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(l.unit!),
          );
          const link = recurrenceLinksFor(l.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('preserves sixteen bilingual human-reviewed drawings outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(16);
    for (const s of sets) {
      expect(s.questions).toHaveLength(8);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(checkAnswer(q.solution.zh, q.answer)).toBeNull();
        expect(
          checkAnswer('3:5 2:5 3n+2 zero ratio same value', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('independently recomputes all reused numerical tasks and their units', () => {
    const oracle = new Map([
      ['J94-L05-Q2', String((2 * 100000) / 50000)],
      ['J73-L06-Q5', String(2 - 5)],
      ['J75-L05-Q5', String(-4 + (3 / 2) * 2)],
      ['J75-L02-Q3', String(-3 * 2)],
      ['J71-L01-Q5', String(Math.max(-2.5, -2.05))],
      ['J75-L02-X', `(${-2 + 5},${-1 + 3})`],
    ]);
    const ids = new Set(relationsRecurrence.flatMap((e) => e.targets));
    expect(
      new Set(
        [...ids].filter((id) => tasks.get(id)!.q.answer.kind !== 'explain'),
      ),
    ).toEqual(new Set(oracle.keys()));
    for (const [id, value] of oracle) {
      const q = tasks.get(id)!.q;
      expect(checkAnswer(value, q.answer), id).toBe(true);
      expect(checkAnswer('9999', q.answer), id).toBe(false);
      for (const a of q.answerChecks?.accepted ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(true);
      for (const a of q.answerChecks?.rejected ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(false);
    }
    expect(checkAnswer('4 km', tasks.get('J94-L05-Q2')!.q.answer)).toBe(false);
    expect(checkAnswer('3', tasks.get('J73-L06-Q5')!.q.answer)).toBe(false);
  });
  it('checks allocated totals, indivisibility, common scaling and signed movement', () => {
    for (const [a, b, g, partN, partD] of [
      [18, 30, 6, 3, 8],
      [14, 35, 7, 2, 7],
    ]) {
      expect((a! + b!) * partN!).toBe(a! * partD!);
      expect(a! / g!).toBe(partN!);
      expect((a! - g!) * b!).not.toBe((b! - g!) * a!);
    }
    for (const [whole, wa, wb, den, an, bn] of [
      [11, 3, 5, 8, 33, 55],
      [13, 2, 7, 9, 26, 91],
    ]) {
      expect(an! + bn!).toBe(whole! * den!);
      expect(an! * wb!).toBe(bn! * wa!);
      expect(whole! % den!).not.toBe(0);
      // Exhaust every permitted pair of indivisible allocations, not just rounding.
      expect(
        Array.from({ length: whole! + 1 }, (_, a) => a).some(
          (a) => a * wb! === (whole! - a) * wa!,
        ),
      ).toBe(false);
    }
    expect([(6 * 25000) / 100000, (5 * 40000) / 100000]).toEqual([1.5, 2]);
    expect([25000 / 2, 40000 / 4]).toEqual([12500, 10000]);
    expect([3 * 5 + 2, 4 * 6 + 1]).toEqual([17, 25]);
    expect([3 * 1 + 2, 3 * 2 + 2, 4 * 1 + 1, 4 * 2 + 1]).toEqual([5, 8, 5, 9]);
    for (const [start, change, end] of [
      [-4, 7, 3],
      [-6, 10, 4],
    ]) {
      expect(start! + change!).toBe(end!);
      expect(start! - -change!).toBe(end!);
      expect(end! - start!).toBe(change!);
      expect(Math.abs(start! - end!)).toBe(change!);
      expect(end! - change!).toBe(start!);
    }
    expect([Math.abs(-5), Math.abs(5), Math.abs(0)]).toEqual([5, 5, 0]);
    expect([Math.abs(-2 - -5), Math.abs(-3 - -8)]).toEqual([3, 5]);
  });
});
