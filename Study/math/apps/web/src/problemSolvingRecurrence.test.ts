import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { representationRetrieval } from './content/representationRetrieval';
import { problemSolvingRecurrence } from './content/problemSolvingRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { plotBounds } from './cartesianModels';
import { equalPolynomial } from './polynomialModels';
import { tangentModel } from './calculusModels';
import { textR } from './algebraModels';
const sets = Object.values(representationRetrieval);
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
describe('problem solving recurrence', () => {
  it('covers all five H28 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H28')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(problemSolvingRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of problemSolvingRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
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
  it('keeps two bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(2);
    for (const s of sets) {
      expect(s.questions).toHaveLength(1);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks actual affine plot intercepts/slopes and every inverse ceiling image including the separate cancelled state', () => {
    for (const [
      key,
      stock,
      size,
      per,
      extra,
      a0,
      a1,
      b0,
      b1,
      selected,
      equalPeople,
      budget,
    ] of [
      [
        'H35_REPRESENTATION',
        3,
        5,
        2,
        1,
        4,
        3,
        10,
        1,
        [
          [0, 0, 0, 0, 0],
          [1, 3, 0, 4, 10],
          [3, 7, 1, 7, 11],
          [6, 13, 2, 10, 12],
          [8, 17, 3, 13, 13],
        ],
        [0, 7, 8],
        13,
      ],
      [
        'H38_REPRESENTATION',
        5,
        6,
        3,
        2,
        5,
        4,
        11,
        2,
        [
          [0, 0, 0, 0, 0],
          [1, 5, 0, 5, 11],
          [3, 11, 1, 9, 13],
          [6, 20, 3, 17, 17],
          [8, 26, 4, 21, 19],
        ],
        [0, 6, 7],
        20,
      ],
    ] as const) {
      const q = representationRetrieval[key].questions[0]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual affine plot');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.xLabel).toBe('k (packs)');
      expect(d.yLabel).toBe('credits');
      expect(d.curves![0]!.points).toEqual([
        { x: 0, y: a0 },
        { x: 4, y: a0 + 4 * a1 },
      ]);
      expect(d.curves![1]!.points).toEqual([
        { x: 0, y: b0 },
        { x: 4, y: b0 + 4 * b1 },
      ]);
      const f = (n: number) => {
        if (n === 0) return [n, 0, 0, 0, 0];
        const demand = per * n + extra,
          k = Math.ceil(Math.max(0, demand - stock) / size);
        return [n, demand, k, a0 + a1 * k, b0 + b1 * k];
      };
      expect([0, 1, 3, 6, 8].map(f)).toEqual(selected);
      expect(
        Array.from({ length: 9 }, (_, n) => f(n))
          .filter((r) => r[3] === r[4])
          .map((r) => r[0]),
      ).toEqual(equalPeople);
      expect(a0 + a1 * 3).toBe(b0 + b1 * 3);
      expect([
        ...new Set(Array.from({ length: 9 }, (_, n) => f(n)[2])),
      ]).toEqual(key === 'H35_REPRESENTATION' ? [0, 1, 2, 3] : [0, 1, 2, 3, 4]);
      for (let n = 1; n <= 8; n++) {
        const shortage = Math.max(0, per * n + extra - stock);
        expect(f(n)[2] === 3).toBe(shortage > 2 * size && shortage <= 3 * size);
      }
      const eight = f(8);
      expect(eight[4]!).toBeLessThanOrEqual(budget);
      expect(eight[3]! <= budget).toBe(key === 'H35_REPRESENTATION');
      expect(f(0)[2]).toBe(f(1)[2]);
      expect(f(0)[3]).not.toBe(f(1)[3]);
      expect(q.solution.en).toContain(equalPeople.join(','));
    }
  });
  it('locates all eight reused manual tasks and verifies the stated stationary and greedy-path failures', () => {
    const reused = problemSolvingRecurrence
      .flatMap((e) => e.targets)
      .filter((id) => !id.includes('MAINT'));
    expect(reused).toHaveLength(8);
    for (const id of reused) {
      const q = tasks.get(id)!.q;
      expect(q.answer.kind).toBe('explain');
      expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
    }
    expect(textR(tangentModel('x^3', '0').slope)).toBe('0');
    expect(equalPolynomial('x^3', '0')).toBe(false);
    const edges = new Map([
      ['A>B', 1],
      ['A>C', 3],
      ['B>E', 9],
      ['C>D', 1],
      ['D>E', 1],
    ]);
    const cost = (path: string[]) =>
      path
        .slice(1)
        .reduce((sum, p, i) => sum + edges.get(`${path[i]}>${p}`)!, 0);
    expect(cost(['A', 'B', 'E'])).toBe(10);
    expect(cost(['A', 'C', 'D', 'E'])).toBe(5);
    expect(edges.get('A>B')!).toBeLessThan(edges.get('A>C')!);
  });
});
