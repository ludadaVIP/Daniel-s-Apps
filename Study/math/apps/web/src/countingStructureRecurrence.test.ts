import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { countingStructureRetrieval } from './content/countingStructureRetrieval';
import { countingStructureRecurrence } from './content/countingStructureRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  countingUnion,
  permutations,
  combinations,
  factorial,
  orderedSelections,
  selectionGroups,
  pascalRow,
  binomialCoefficient,
  contingency,
  sourceFlagModel,
} from './countingModels';
import { textR } from './algebraModels';
const sets = Object.values(countingStructureRetrieval);
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
describe('counting structure recurrence', () => {
  it('covers all six H24 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H24')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(countingStructureRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of countingStructureRecurrence) {
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
  it('keeps ten bilingual derivations human-reviewed and outside canonical checks', () => {
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
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks full overlapping unions and exact restricted ordered-pair branches without treating counting as a probability model', () => {
    expect(countingUnion(['A', 'B', 'C', 'D'], ['C', 'D', 'E']).union).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
    ]);
    expect(
      countingUnion(['Q', 'R', 'S', 'T'], ['S', 'T', 'U']).overlap,
    ).toEqual(['S', 'T']);
    const pairs = (n: number, m: number) =>
      Array.from({ length: n }, (_, i) =>
        Array.from({ length: m }, (_, j) => [i + 1, j + 1]).filter(
          ([a, b]) => b! > a!,
        ),
      );
    expect(pairs(3, 4)).toEqual([
      [
        [1, 2],
        [1, 3],
        [1, 4],
      ],
      [
        [2, 3],
        [2, 4],
      ],
      [[3, 4]],
    ]);
    expect(pairs(4, 3)).toEqual([
      [
        [1, 2],
        [1, 3],
      ],
      [[2, 3]],
      [],
      [],
    ]);
  });
  it('checks actual ordered fibres,physical versus displayed identities and empty/impossible selections', () => {
    for (const [n, ordered, groups] of [
      [4, 24, 4],
      [5, 60, 10],
    ] as const) {
      expect(permutations(n, 3)).toBe(BigInt(ordered));
      expect(combinations(n, 3)).toBe(BigInt(groups));
      const fibres = selectionGroups(n, 3);
      expect(fibres).toHaveLength(groups);
      expect(fibres.every((g) => g.orders.length === 6)).toBe(true);
      expect(
        fibres
          .find((g) => g.key === 'ABC')!
          .orders.map((r) => r.join(''))
          .sort(),
      ).toEqual(['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA']);
      expect(permutations(n, 0)).toBe(1n);
      expect(combinations(n, 0)).toBe(1n);
      expect(permutations(n, n + 1)).toBe(0n);
      expect(combinations(n, n + 1)).toBe(0n);
    }
    expect(factorial(0)).toBe(1n);
    const repeated = orderedSelections(3, 3, true),
      count = (key: string) =>
        repeated.filter((r) => [...r].sort().join('') === key).length;
    expect(['AAA', 'AAB', 'ABC'].map(count)).toEqual([1, 3, 6]);
    const physical = orderedSelections(3, 2),
      display = physical.map((r) =>
        r.map((c) => (c === 'C' ? 'B' : 'A')).join(''),
      );
    expect(physical).toHaveLength(6);
    expect(selectionGroups(3, 2)).toHaveLength(3);
    expect([...new Set(display)].sort()).toEqual(['AA', 'AB', 'BA']);
    expect(
      [...new Set(display.map((s) => [...s].sort().join('')))].sort(),
    ).toEqual(['AA', 'AB']);
  });
  it('checks every coin multiplicity,Pascal partition,exact target probability and signed expansion coefficient', () => {
    for (const [n, k, row, coef, b] of [
      [5, 2, [1, 5, 10, 10, 5, 1], 40, -2],
      [6, 3, [1, 6, 15, 20, 15, 6, 1], -20, -1],
    ] as const) {
      expect(pascalRow(n)).toEqual(row.map(BigInt));
      expect(row.reduce((s, v) => s + v, 0)).toBe(2 ** n);
      expect(combinations(n, k)).toBe(
        combinations(n - 1, k - 1) + combinations(n - 1, k),
      );
      expect(Number(combinations(n, k)) / 2 ** n).toBe(5 / 16);
      expect(binomialCoefficient(n, k, b)).toBe(BigInt(coef));
      // Enumerate all strings independently,including both last-position subsets.
      const strings = Array.from({ length: 2 ** n }, (_, x) =>
        x.toString(2).padStart(n, '0'),
      );
      expect(
        row.map(
          (_, heads) =>
            strings.filter(
              (s) => [...s].filter((c) => c === '1').length === heads,
            ).length,
        ),
      ).toEqual(row);
    }
  });
  it('checks actual four-cell tables,total identities,conditional directions,dependence and empty conditions', () => {
    for (const [key, cells, pa, pab, agb, bga] of [
      ['H33_COUNTING', [4, 2, 3, 3], '1/2', '1/3', '4/7', '2/3'],
      ['H34_COUNTING', [6, 3, 2, 9], '9/20', '3/10', '3/4', '2/3'],
    ] as const) {
      const rows =
        countingStructureRetrieval[key].questions[3]!.contextTable!.rows;
      const actual = [
        rows[0]![1]!,
        rows[0]![2]!,
        rows[1]![1]!,
        rows[1]![2]!,
      ].map((c) => Number(c.en));
      expect(actual).toEqual(cells);
      const m = contingency(actual);
      expect([m.pA, m.pAB, m.aGivenB!, m.bGivenA!].map(textR)).toEqual([
        pa,
        pab,
        agb,
        bga,
      ]);
      expect(m.independent).toBe(false);
      expect(Number(rows[2]![3]!.en)).toBe(m.total);
      expect(Number(rows[2]![1]!.en)).toBe(m.b);
      expect(Number(rows[0]![3]!.en)).toBe(m.a);
    }
    expect(contingency([0, 2, 0, 4]).aGivenB).toBeNull();
    expect(contingency([0, 2, 1, 3]).aGivenB).toEqual([0n, 1n]);
  });
  it('checks both-source posterior masses,changed priors and product independence with degenerate conditional boundaries', () => {
    for (const [prior, next, a, b, m1, m2, post, nextPost] of [
      [10, 50, 60, 20, '60', '180', '1/4', '3/4'],
      [20, 60, 75, 25, '150', '200', '3/7', '9/11'],
    ] as const) {
      const m = sourceFlagModel(prior, a, b);
      expect([textR(m.aFlag), textR(m.otherFlag)]).toEqual([m1, m2]);
      expect(textR(m.posterior!)).toBe(post);
      expect(textR(sourceFlagModel(next, a, b).posterior!)).toBe(nextPost);
      const independent = sourceFlagModel(prior, 30, 30);
      expect(independent.independent).toBe(true);
      expect(independent.posterior).toEqual(independent.pA);
    }
    const impossibleA = sourceFlagModel(0, 60, 20);
    expect(impossibleA.independent).toBe(true);
    expect(impossibleA.likelihoodA).toBeNull();
    const impossibleF = sourceFlagModel(20, 0, 0);
    expect(impossibleF.independent).toBe(true);
    expect(impossibleF.posterior).toBeNull();
  });
});
