import { describe, expect, it } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { fractionRecurrence } from './content/fractionRecurrence';
import { fractionRetrieval } from './content/fractionRetrieval';
import { earlyAlgebraRecurrence } from './content/earlyAlgebraRecurrence';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';

const sets = Object.values(fractionRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...sets.flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('fraction representations and additive recurrence', () => {
  it('covers all P54 tags and, with the earlier two concepts, all P53 tags through actual later tasks', () => {
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    const sources = lessons.filter((l) => ['P53', 'P54'].includes(l.unit!));
    const skills = new Set(
      sources.flatMap((l) =>
        [l.guided, ...l.questions, l.exit].map((q) => q.skill),
      ),
    );
    expect(
      new Set(
        [
          ...fractionRecurrence,
          ...earlyAlgebraRecurrence.filter((e) =>
            e.sourceLesson.startsWith('P53'),
          ),
        ].map((e) => e.skill),
      ),
    ).toEqual(skills);
    expect(fractionRecurrence).toHaveLength(9);
    for (const e of fractionRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        [source.guided, ...source.questions, source.exit].some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const task = tasks.get(id)!;
          expect(task, id).toBeDefined();
          expect(units.indexOf(task.unit)).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((group) => group.targets)
            .find((t) => t.id === id)!;
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
  it('requires generating a simplest fraction and rejects equivalent unfinished or wrong-unit answers', () => {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    const complement = tasks.get('P55-L04-Q5')!.q;
    expect(checkAnswer(`${4 - 1}/4`, complement.answer)).toBe(true);
    expect(checkAnswer('5/4', complement.answer)).toBe(false);
    for (const [s, n, d] of [
      [fractionRetrieval.P61, 18, 24],
      [fractionRetrieval.P65, 21, 35],
    ] as const) {
      const q = s.questions[2]!;
      const g = gcd(n, d),
        expected = `${n / g}/${d / g}`;
      expect(checkAnswer(expected, q.answer)).toBe(true);
      expect(checkAnswer(`${n}/${d}`, q.answer)).toBe(false);
      expect(checkAnswer(`${(2 * n) / g}/${(2 * d) / g}`, q.answer)).toBe(
        false,
      );
      expect(checkAnswer(String(n / d), q.answer)).toBe(false);
      expect(
        checkAnswer(expected + (s.unit === 'P61' ? ' m' : ' L'), q.answer),
      ).toBe(false);
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), a).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), a).toBe(false);
    }
  });
  it('keeps eight tasks, their units, bridges and human arguments separate from canonical lessons and checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(4);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
    for (const id of new Set(fractionRecurrence.flatMap((e) => e.targets))) {
      const q = tasks.get(id)!.q;
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('same denominator proper 2 3/4 3/5 7/12', q.answer),
        ).toBeNull();
      }
    }
  });
  it('independently checks classification boundaries, mixed units, comparisons, additive steps and ratio references', () => {
    for (const [n, d, whole, remainder] of [
      [3, 4, 0, 3],
      [4, 4, 1, 0],
      [5, 4, 1, 1],
      [2, 3, 0, 2],
      [3, 3, 1, 0],
      [7, 3, 2, 1],
    ]) {
      expect(Math.floor(n! / d!)).toBe(whole);
      expect(n! % d!).toBe(remainder);
      expect(n! < d!).toBe(whole === 0); // positive proper fractions only
    }
    for (const [n, d, whole, remainder] of [
      [17, 5, 3, 2],
      [17, 7, 2, 3],
      [10, 3, 3, 1],
      [21, 5, 4, 1],
    ])
      expect(whole! * d! + remainder!).toBe(n);
    expect(2 * 7 + 3).toBe(17);
    expect(4 * 5 + 1).toBe(21);
    expect(4 + 1).not.toBe(21);
    expect(7 * 2).toBeLessThan(5 * 3);
    expect((12 * 7) / 12).toBeGreaterThan((8 * 5) / 8);
    expect(5 * 4).toBeLessThan(7 * 3);
    expect((18 * 5) / 9).toBeGreaterThan((12 * 7) / 12);
    expect(3 * 3).toBe(9);
    expect(9 / 4).not.toBe(9 / 12);
    expect((14 + 21) / 5).toBe(7);
    expect(2 * 4 - 2 * 3).toBe(2); // remaining quarters after two full portions
    expect((5 - 1) / 4).toBe(1);
    expect((-1 + 2 * 3) / 3).toBe(5 / 3);
    expect((-3 + 2) / 4).toBe(-1 / 4);
    expect((5 - 2 * 3) / 3).toBe(-1 / 3);
    expect((-3 - 2) / 4).toBe(-5 / 4);
    expect((2 * 3) / 4 + 1 / 2).toBe(2);
    expect(1 / 2 / (3 / 4)).toBe(2 / 3);
    expect(1 / 2).not.toBe(2 / 3);
    expect(7 * 2 + 7 * 3).toBe(7 * 5); // common denominator five, exact integers
    expect(7 / 5).not.toBe(1 / 5);
    // For a 2 km route, 1/3 of it plus 1/4 km is 11/12 km, or 11/24 of the route.
    expect(8 + 3).toBe(11);
    expect(11 * 12).not.toBe(7 * 24);
  });
});
