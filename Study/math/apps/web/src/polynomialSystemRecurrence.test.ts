import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { polynomialSystemRetrieval } from './content/polynomialSystemRetrieval';
import { polynomialSystemRecurrence } from './content/polynomialSystemRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { equalPolynomial } from './polynomialModels';
import {
  parseLinearSystem,
  solveSystem,
  auditSystemPair,
  sameSystemSolutions,
} from './systemModels';
import { textR } from './algebraModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(polynomialSystemRetrieval);
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
const system = (s: string) => parseLinearSystem(s)!;
describe('polynomial structure and simultaneous-system recurrence', () => {
  it('covers all fifteen J81-J83 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J81', 'J82', 'J83'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(15);
    expect(new Set(polynomialSystemRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of polynomialSystemRecurrence) {
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
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twenty bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const s of sets) {
      expect(s.questions).toHaveLength(10);
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
  it('counts repeated factors independently for manual degree-six products without widening the automatic grader', () => {
    const product = (
      a: { c: number; letters: string },
      b: { c: number; letters: string },
    ) => {
      const powers: Record<string, number> = {};
      for (const v of a.letters + b.letters) powers[v] = (powers[v] ?? 0) + 1;
      return { coefficient: a.c * b.c, powers };
    };
    expect(
      product({ c: -3, letters: 'xxy' }, { c: 2, letters: 'xyy' }),
    ).toEqual({ coefficient: -6, powers: { x: 3, y: 3 } });
    expect(product({ c: -3, letters: 'xxy' }, { c: -4, letters: 'x' })).toEqual(
      { coefficient: 12, powers: { x: 3, y: 1 } },
    );
    expect(
      product({ c: -2, letters: 'abb' }, { c: 5, letters: 'aab' }),
    ).toEqual({ coefficient: -10, powers: { a: 3, b: 3 } });
    expect(product({ c: -2, letters: 'abb' }, { c: -3, letters: 'a' })).toEqual(
      { coefficient: 6, powers: { a: 2, b: 2 } },
    );
    expect(polynomialSystemRetrieval.J95.questions[0]!.stem.zh).toContain(
      '(−3x²y)(2xy²)',
    );
    expect(polynomialSystemRetrieval.J95.questions[0]!.solution.zh).toContain(
      '−6x³y³+12x³y',
    );
    expect(polynomialSystemRetrieval.J96.questions[0]!.stem.zh).toContain(
      '(−2ab²)(5a²b)',
    );
    expect(polynomialSystemRetrieval.J96.questions[0]!.solution.zh).toContain(
      '−10a³b³+6a²b²',
    );
    for (const s of sets)
      expect(
        checkAnswer(s.questions[0]!.solution.zh, s.questions[0]!.answer),
      ).toBeNull();
  });
  it('checks every degree-four-or-lower authored identity and unfinished/wrong alternatives generally', () => {
    const math = (s: string) =>
      s
        .replaceAll('−', '-')
        .replaceAll('²', '^2')
        .replaceAll('³', '^3')
        .replaceAll('⁴', '^4');
    const cases = [
      ['J95', 2, '(2x+3)(x+4)', '2x^2+11x+12'],
      ['J95', 3, '(x-4)(x-4)', 'x^2-8x+16'],
      ['J95', 4, 'x^4-81', '(x-3)(x+3)(x^2+9)'],
      ['J95', 5, '12x^3+18x^2', '6x^2(2x+3)'],
      ['J95', 6, '3x^2-18x+27', '3(x-3)^2'],
      ['J95', 7, 'x^2-x-12', '(x-4)(x+3)'],
      ['J95', 8, 'x^2+7x+12', '(x+3)(x+4)'],
      ['J95', 8, '5(x^2-16)', '5(x-4)(x+4)'],
      ['J96', 2, '(3t+2)(t+5)', '3t^2+17t+10'],
      ['J96', 3, '(t-5)(t-5)', 't^2-10t+25'],
      ['J96', 4, 't^4-256', '(t-4)(t+4)(t^2+16)'],
      ['J96', 5, '20t^3-30t^2', '10t^2(2t-3)'],
      ['J96', 6, '2t^2+20t+50', '2(t+5)^2'],
      ['J96', 7, 't^2+t-20', '(t+5)(t-4)'],
      ['J96', 8, 't^2-9t+20', '(t-4)(t-5)'],
      ['J96', 8, '4(t^2-25)', '4(t-5)(t+5)'],
    ] as const;
    for (const [u, n, left, right] of cases) {
      const q = polynomialSystemRetrieval[u].questions[n - 1]!;
      expect(math(q.stem.zh), q.id).toContain(left);
      expect(math(q.solution.zh), q.id).toContain(right);
      expect(
        equalPolynomial(left, right, [u === 'J95' ? 'x' : 't']),
        q.id,
      ).toBe(true);
    }
    expect(equalPolynomial('(a+b)(a-b)', 'a^2-b^2', ['a', 'b'])).toBe(true);
    expect(equalPolynomial('(a-b)^2', 'a^2-b^2', ['a', 'b'])).toBe(false);
    expect(equalPolynomial('x^2+7x+12', '(x+1)(x+12)')).toBe(false);
    expect(equalPolynomial('t^2-9t+20', '(t-1)(t-20)', ['t'])).toBe(false);
    expect(equalPolynomial('x^2-4x+9', '(x-3)^2')).toBe(false);
    expect(equalPolynomial('t^2+8t+25', '(t+5)^2', ['t'])).toBe(false);
    for (const [sum, product, expected] of [
      [-1, -12, ['-4,3', '3,-4']],
      [1, -20, ['-4,5', '5,-4']],
    ] as const) {
      const matches: string[] = [];
      for (let r = -20; r <= 20; r++)
        for (let s = -20; s <= 20; s++)
          if (r + s === sum && r * s === product) matches.push(`${r},${s}`);
      expect(matches.sort()).toEqual([...expected].sort());
    }
    for (const n of [2, 3])
      expect(
        Array.from({ length: 2 * n + 1 }, (_, i) => i - n).some(
          (r) => r * -r === -n,
        ),
      ).toBe(false);
  });
  it('checks both original models, exact substitutions and information lost by zero row coefficients', () => {
    for (const s of [
      {
        u: 'J95',
        source: 'x+y=9;5x+3y=41',
        reduced: 'x+y=9;2x=14',
        weak: 'x+y=9;3x+3y=27',
        answer: ['7', '2'],
        text: '(7,2)',
        spurious: '(9,0)',
      },
      {
        u: 'J96',
        source: 'x+y=11;6x+4y=47',
        reduced: 'x+y=11;2x=3',
        weak: 'x+y=11;4x+4y=44',
        answer: ['3/2', '19/2'],
        text: '(3/2,19/2)',
        spurious: '(11,0)',
      },
    ] as const) {
      const original = system(s.source),
        reduced = system(s.reduced),
        weak = system(s.weak);
      const result = solveSystem(original);
      expect(result.kind).toBe('one');
      if (result.kind === 'one')
        expect(result.point.map(textR)).toEqual([...s.answer]);
      expect(auditSystemPair(original, s.text)!.pass).toBe(true);
      expect(sameSystemSolutions(original, reduced)).toBe(true);
      expect(sameSystemSolutions(original, weak)).toBe(false);
      expect(auditSystemPair(weak, s.spurious)!.pass).toBe(true);
      expect(auditSystemPair(original, s.spurious)!.pass).toBe(false);
      expect(solveSystem(weak).kind).toBe('infinite');
      expect(
        polynomialSystemRetrieval[s.u].questions[8]!.solution.zh,
      ).toContain(s.u === 'J95' ? '5x+3(9−x)=41' : '6x+4(11−x)=47');
    }
    const changed = system('x+y=9;5x+3y=40');
    expect(auditSystemPair(changed, '(13/2,5/2)')!.pass).toBe(true);
    expect(auditSystemPair(changed, '(7,2)')!.pass).toBe(false);
    expect(auditSystemPair(system('x+y=11;6x+4y=47'), '(2,9)')!.pass).toBe(
      false,
    );
    expect(auditSystemPair(system('x+y=11;6x+4y=47'), '(1,10)')!.pass).toBe(
      false,
    );
    expect(Number.isInteger(13 / 2)).toBe(false);
    expect(Number.isInteger(3 / 2)).toBe(false);
  });
  it('classifies all eight line systems with exact points and rank-one infinite sets', () => {
    for (const s of [
      {
        sources: ['x+y=3;x-y=0', 'x+y=3;2x+2y=6', 'x+y=3;2x+2y=8', 'x=2;y=-1'],
        points: [
          ['3/2', '3/2'],
          ['2', '-1'],
        ],
      },
      {
        sources: [
          'x+y=5;x-y=2',
          'x+y=5;3x+3y=15',
          'x+y=5;3x+3y=18',
          'x=-1;y=2',
        ],
        points: [
          ['7/2', '3/2'],
          ['-1', '2'],
        ],
      },
    ]) {
      const results = s.sources.map((x) => solveSystem(system(x)));
      expect(results.map((x) => x.kind)).toEqual([
        'one',
        'infinite',
        'none',
        'one',
      ]);
      const first = results[0]!,
        last = results[3]!,
        infinite = results[1]!;
      if (first.kind === 'one')
        expect(first.point.map(textR)).toEqual(s.points[0]);
      if (last.kind === 'one')
        expect(last.point.map(textR)).toEqual(s.points[1]);
      if (infinite.kind === 'infinite') expect(infinite.rank).toBe(1);
      expect(auditSystemPair(system(s.sources[1]!), '(0,0)')!.pass).toBe(false);
    }
  });
});
