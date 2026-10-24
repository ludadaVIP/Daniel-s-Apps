import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { logicFunctionRetrieval } from './content/logicFunctionRetrieval';
import { logicFunctionRecurrence } from './content/logicFunctionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  absoluteSolution,
  conditionClass,
  finiteSet,
  normalUnion,
  operateSets,
  parseRealUnion,
  subset,
  unionContains,
  unionText,
  checkRealUnion,
} from './logicModels';
import {
  inequalityAt,
  intersectIntervals,
  intervalContains,
  parseRealSet,
  relationHolds,
  solveInequality,
} from './inequalityModels';
import {
  addR,
  divR,
  evaluateAffine,
  mulR,
  parseAffine,
  rational,
  textR,
} from './algebraModels';
import { readRational } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(logicFunctionRetrieval);
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
describe('logic and function recurrence', () => {
  it('covers all eleven H01-H02 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['H01', 'H02'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(11);
    expect(new Set(logicFunctionRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of logicFunctionRecurrence) {
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
  it('keeps sixteen bilingual derivations human-reviewed and outside canonical checks', () => {
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
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('preserves observational multiplicity while checking numerical sets, empty subsets and universe-relative complements', () => {
    for (const [
      u,
      raw,
      universe,
      b,
      intersection,
      union,
      complement,
      extra,
    ] of [
      [
        'H25',
        '1,1,2,4',
        '0,1,2,3,4,5,6',
        '2,3,4',
        '2,4',
        '1,2,3,4',
        '0,3,5,6',
        '7,8',
      ],
      [
        'H26',
        '2,2,4,6',
        '1,2,3,4,5,6,7,8',
        '1,4,7',
        '4',
        '1,2,4,6,7',
        '1,3,5,7,8',
        '9,10',
      ],
    ] as const) {
      const a = finiteSet(raw)!,
        U = finiteSet(universe)!,
        B = finiteSet(b)!;
      expect(raw.split(',')).toHaveLength(4);
      expect(a).toHaveLength(3);
      for (const [op, wanted] of [
        ['intersection', intersection],
        ['union', union],
        ['complement', complement],
      ] as const)
        expect(operateSets(U, a, B, op)).toEqual(finiteSet(wanted));
      expect(subset([], a)).toBe(true);
      expect(subset([a[0]!], a)).toBe(true);
      expect(a.includes(`{${a[0]}}`)).toBe(false);
      expect(a.includes('∅')).toBe(false);
      const ac = operateSets(U, a, B, 'complement');
      expect(operateSets(U, a, ac, 'intersection')).toEqual([]);
      expect(operateSets(U, a, ac, 'union')).toEqual(U);
      expect(
        operateSets(finiteSet(`${universe},${extra}`)!, a, B, 'complement'),
      ).toEqual(finiteSet(`${complement},${extra}`));
      expect(logicFunctionRetrieval[u].questions[0]!.stem.en).toContain(raw);
    }
  });
  it('checks exact domain counterexamples and both implication directions, retaining universal arguments in the answer', () => {
    for (const [u, shift, p, witness] of [
      ['H25', 0, 3, '1/2'],
      ['H26', 2, 4, '5/2'],
    ] as const) {
      const m = addR(readRational(witness), rational(BigInt(-shift)));
      expect(textR(m)).toBe('1/2');
      expect(relationHolds(mulR(m, m), '<', m)).toBe(true);
      expect(equalPolynomial('x^2-x', 'x(x-1)')).toBe(true);
      // A symbolic factorization plus m<=0 or m>=1 proves the integer claim;
      // finite samples cannot prove that universal statement.
      expect(logicFunctionRetrieval[u].questions[1]!.solution.en).toContain(
        'no integer lies between zero and one',
      );
      expect(conditionClass([`${p}`], [`${-p}`, `${p}`])).toBe(
        'sufficient-only',
      );
      expect(conditionClass([`${-p}`, `${p}`], [`${p}`])).toBe(
        'necessary-only',
      );
      expect(conditionClass([`${p}`], [`${p}`])).toBe('both');
      expect((-p) ** 2).toBe(p * p);
      expect(-p >= 0).toBe(false);
      expect(logicFunctionRetrieval[u].questions[2]!.solution.en).toContain(
        'not-Q⇒not-P',
      );
    }
  });
  it('checks all twelve complete absolute-value sets for each context, including zero and negative radii', () => {
    const signs = ['<', '<=', '>', '>='] as const;
    for (const [centre, radius, lo, hi] of [
      [3, 2, 1, 5],
      [-1, 4, -5, 3],
    ] as const) {
      const expected = [
        [
          `(${lo},${hi})`,
          `[${lo},${hi}]`,
          `x<${lo} or x>${hi}`,
          `x<=${lo} or x>=${hi}`,
        ],
        ['∅', `{${centre}}`, `x<${centre} or x>${centre}`, 'all reals'],
        ['∅', '∅', 'all reals', 'all reals'],
      ];
      for (const [j, right] of [radius, 0, -2].entries())
        for (const [i, sign] of signs.entries()) {
          const actual = absoluteSolution('1', `${-centre}`, `${right}`, sign);
          expect(checkRealUnion(unionText(actual), expected[j]![i]!)).toBe(
            true,
          );
          for (const x of [lo, centre, hi])
            expect(unionContains(actual, rational(BigInt(x)))).toBe(
              relationHolds(
                rational(BigInt(Math.abs(x - centre))),
                sign,
                rational(BigInt(right)),
              ),
            );
        }
    }
  });
  it('checks complete image witnesses, inverse ambiguity and general strict-monotonicity differences', () => {
    for (const [u, centre, domain] of [
      ['H25', 0, '[-2,2]'],
      ['H26', 1, '[-1,3]'],
    ] as const) {
      const f = (x: number) => (x - centre) ** 2;
      expect(f(centre)).toBe(0);
      expect(f(centre - 2)).toBe(4);
      expect(f(centre + 2)).toBe(4);
      for (const y of [0, 1, 4]) {
        const x = centre + Math.sqrt(y);
        expect(f(x)).toBe(y);
        expect(
          intervalContains(parseRealSet(domain)!, readRational(`${x}`)),
        ).toBe(true);
      }
      expect(intervalContains(parseRealSet('[0,4]')!, readRational('9'))).toBe(
        false,
      );
      expect(
        equalPolynomial(
          `(v-${centre})^2-(u-${centre})^2`,
          `(v-u)(v+u-${2 * centre})`,
          ['u', 'v'],
        ),
      ).toBe(true);
      const [x1, x2] = u === 'H25' ? [-2, -1] : [0, 1];
      expect(x1! < x2!).toBe(true);
      expect(f(x1!)).toBeGreaterThan(f(x2!));
      expect(logicFunctionRetrieval[u].questions[4]!.solution.en).toContain(
        'each such y is attained',
      );
      expect(logicFunctionRetrieval[u].questions[5]!.solution.en).toContain(
        'nondecreasing and nonincreasing',
      );
    }
  });
  it('derives exact transformed domains and point coordinates and re-evaluates zero inner coefficients', () => {
    for (const [u, a, b, h, k, low, high, wanted, inputs, outputs] of [
      [
        'H25',
        -2,
        -2,
        3,
        5,
        1,
        9,
        '[-3/2,5/2]',
        [1, 4, 9],
        [
          ['5/2', '3'],
          ['1', '1'],
          ['-3/2', '-1'],
        ],
      ],
      [
        'H26',
        3,
        -3,
        -1,
        -2,
        -2,
        1,
        '[-4/3,-1/3]',
        [-2, 0, 1],
        [
          ['-1/3', '10'],
          ['-1', '-2'],
          ['-4/3', '1'],
        ],
      ],
    ] as const) {
      const domainFor = (inner: number) =>
        intersectIntervals(
          solveInequality(inequalityAt(`${inner}(x-(${h}))>=${low}`)),
          solveInequality(inequalityAt(`${inner}(x-(${h}))<=${high}`)),
        );
      const domain = domainFor(b);
      expect(checkRealUnion(unionText([domain]), wanted)).toBe(true);
      expect(
        checkRealUnion(
          unionText([domainFor(0)]),
          u === 'H25' ? '∅' : 'all reals',
        ),
      ).toBe(true);
      for (const [i, input] of inputs.entries()) {
        const x = addR(
          rational(BigInt(h)),
          divR(rational(BigInt(input)), rational(BigInt(b))),
        );
        const fy = u === 'H25' ? Math.sqrt(input) : input ** 2;
        const y = addR(
          rational(BigInt(k)),
          mulR(rational(BigInt(a)), rational(BigInt(fy))),
        );
        expect([textR(x), textR(y)]).toEqual(outputs[i]);
        expect(intervalContains(domain, x)).toBe(true);
        expect(
          textR(evaluateAffine(parseAffine(`${b}(x-(${h}))`, 'x')!, x)),
        ).toBe(`${input}`);
      }
      expect(logicFunctionRetrieval[u].questions[6]!.solution.en).toMatch(
        /same supplied composite domain/i,
      );
    }
  });
  it('solves the actual tariff table symbolically and retains the disconnected feasible set and threshold ownership', () => {
    for (const [u, limit, budget, split, wanted] of [
      ['H25', 6, 5, 2, ['[0,3]', '[0,5/3]∪(2,5/2]']],
      ['H26', 8, 10, 3, ['[0,7/2]', '[0,5/2]∪(3,5]']],
    ] as const) {
      const rows = logicFunctionRetrieval[u].questions[7]!.contextTable!.rows;
      expect(rows).toHaveLength(4);
      const parsed = rows.map((r) => ({
        domain: parseRealSet(r[1]!.en)!,
        fee: parseAffine(r[2]!.en, 'x')!,
        feasible: intersectIntervals(
          parseRealSet(r[1]!.en)!,
          solveInequality(inequalityAt(`${r[2]!.en}<=${budget}`)),
        ),
      }));
      for (const [j, offset] of [0, 2].entries()) {
        const pair = parsed.slice(offset, offset + 2),
          feasible = normalUnion(pair.map((r) => r.feasible));
        expect(checkRealUnion(unionText(feasible), wanted[j]!)).toBe(true);
        expect(
          pair.map((r) => intervalContains(r.domain, rational(BigInt(split)))),
        ).toEqual([true, false]);
        for (let n = -1; n <= 4 * limit + 1; n++) {
          const x = rational(BigInt(n), 4n),
            applicable = pair.filter((r) => intervalContains(r.domain, x));
          expect(applicable).toHaveLength(n >= 0 && n <= 4 * limit ? 1 : 0);
          expect(unionContains(feasible, x)).toBe(
            applicable.length === 1 &&
              relationHolds(
                evaluateAffine(applicable[0]!.fee, x),
                '<=',
                rational(BigInt(budget)),
              ),
          );
        }
      }
      expect(
        unionContains(parseRealUnion(wanted[1])!, rational(BigInt(split))),
      ).toBe(false);
      expect(
        unionContains(
          parseRealUnion(wanted[1])!,
          rational(BigInt(split * 4 + 1), 4n),
        ),
      ).toBe(true);
    }
  });
});
