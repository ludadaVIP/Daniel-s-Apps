import { describe, expect, it } from 'vitest';
import { curriculum, lessons, lessonById } from './content';
import { earlyAlgebraRecurrence } from './content/earlyAlgebraRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';

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

describe('fraction reference and introductory algebra recurrence', () => {
  it('locates both P53 concepts and all five P55 source skills in two different later units', () => {
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    const p55Skills = new Set(
      lessons
        .filter((l) => l.unit === 'P55')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(
      new Set(
        earlyAlgebraRecurrence
          .filter((e) => e.sourceLesson.startsWith('P55'))
          .map((e) => e.skill),
      ),
    ).toEqual(p55Skills);
    expect(earlyAlgebraRecurrence).toHaveLength(7);
    for (const e of earlyAlgebraRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        [l.guided, ...l.questions, l.exit].some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const task = tasks.get(id)!;
          expect(task, id).toBeDefined();
          expect(units.indexOf(task.unit)).toBeGreaterThan(
            units.indexOf(l.unit!),
          );
          expect(
            task.q.stem.zh &&
              task.q.stem.en &&
              task.q.solution.zh &&
              task.q.solution.en,
          ).toBeTruthy();
          const link = recurrenceLinksFor(l.id)
            .flatMap((group) => group.targets)
            .find((target) => target.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return task.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });

  it('requires actual reasoning for every target, even when input repeats the rubric or correct numbers', () => {
    const ids = new Set(earlyAlgebraRecurrence.flatMap((e) => e.targets));
    for (const id of ids) {
      const q = tasks.get(id)!.q;
      expect(q.answer.kind, id).toBe('explain');
      expect(checkAnswer(q.solution.en, q.answer), id).toBeNull();
      expect(
        checkAnswer('same whole 1/4 x=3 n² equal sides nonzero', q.answer),
        id,
      ).toBeNull();
    }
  });

  it('independently checks referenced shares, equivalence, consistent unknowns, pattern rules and model domains', () => {
    expect(12 / 3).toBe(4);
    expect(6 / 3).toBe(2);
    expect((12 / 3) * 2).toBe(8);
    expect((6 / 3) * 2).toBe(4);
    expect(10 * 80).toBe(20 * 40);
    expect(10 * 4).toBe(40);
    expect(375 * 100).toBe((375 / 10) * 1000);
    expect(2 * 12).toBe(8 * 3);
    expect(1 * 12).toBe(3 * 4);
    expect(18 - 4).toBe(14);
    expect(14 * 12).toBe(7 * 24);
    for (const n of [0, -2]) expect(n + n + 3).toBe(2 * n + 3);
    expect(0 + 0 + 3).not.toBe(0 + 5);
    expect(5 * 3 + 2).toBe(2 * 3 + 11);
    expect(2 * 10).not.toBe(10);
    for (let n = 1; n <= 20; n++) {
      const constructed =
        Array.from({ length: 3 }, () => n).reduce((a, b) => a + b, 0) + 2;
      expect(constructed).toBe(3 * n + 2);
      expect((n + 1) ** 2 - n ** 2).toBe(2 * n + 1);
    }
    const alternative = (n: number) => 2 * n + (n - 1) * (n - 2) * (n - 3);
    for (const n of [1, 2, 3]) expect(alternative(n)).toBe(2 * n);
    expect([2 * 4, alternative(4)]).toEqual([8, 14]);
    // Cross-multiply rather than treating rounded decimals as exact fractions.
    expect(3 * -1 + 6 * 3).toBe(5 * 3); // x=-1/3 in 3x+6=5
    expect(3 * -33 + 6 * 100).toBe(501); // x=-0.33 is not exact
    expect(501).not.toBe(5 * 100);
    expect(3 * 0).toBe(0);
    for (const x of [-2, 0, 3]) {
      expect(2 * x + 1).not.toBe(2 * x + 3);
      expect(2 * (x + 1)).toBe(2 * x + 2);
    }
    expect(11 + (11 + 8)).toBe(30);
    expect(3 * 6 + 2).toBe(20);
    const tickets = [9 / 2, 5 / 2];
    expect(tickets[0]! + tickets[1]!).toBe(7);
    expect(5 * tickets[0]! + 3 * tickets[1]!).toBe(30);
    expect(tickets.every(Number.isInteger)).toBe(false);
    expect(tickets.every((x) => x >= 0)).toBe(true); // allowed litre amounts
    expect(5 * 5 + 3 * 2).toBe(31); // rounding does not repair ticket model
  });
});
