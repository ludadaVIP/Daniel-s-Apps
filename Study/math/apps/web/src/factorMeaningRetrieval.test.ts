import { describe, expect, it } from 'vitest';
import { factorMeaningRetrieval } from './content/factorMeaningRetrieval';
import { polynomialSystemRecurrence } from './content/polynomialSystemRecurrence';
import { polynomialSystemRetrieval } from './content/polynomialSystemRetrieval';
import { identityMeaningRetrieval } from './content/identityMeaningRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import {
  checkFactorisation,
  commonFactor,
  inspectCommonFactor,
  quadraticSearch,
} from './factorModels';
import { equalPolynomial } from './polynomialModels';

const sets = Object.values(factorMeaningRetrieval);
const raw = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const math = (s: string) => s.replaceAll('−', '-').replaceAll('²', '^2');
const same = (left: string, right: string, variables: string[]) =>
  expect(
    equalPolynomial(math(left), math(right), variables),
    `${left} = ${right}`,
  ).toBe(true);

describe('J82 integer factors, original terms and independent constructions', () => {
  it('preserves all ten original references and adds only six shared manual tasks to the five source lessons', () => {
    const entries = polynomialSystemRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J82-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(20);
    expect(new Set(refs).size).toBe(16);
    expect(
      refs.filter((id) => id.includes('-MAINT-POLY-SYSTEM-')),
    ).toHaveLength(10);
    expect(entries.map((e) => e.targets.slice(0, 2))).toEqual(
      [5, 4, 6, 7, 8].map((n) =>
        ['J95', 'J96'].map((u) => `${u}-MAINT-POLY-SYSTEM-Q${n}`),
      ),
    );
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(polynomialSystemRetrieval[s.unit].questions).toHaveLength(10);
      expect(
        Object.values(identityMeaningRetrieval).find((m) => m.unit === s.unit)!
          .questions,
      ).toHaveLength(3);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J82-L01',
        'J82-L03',
        'J82-L04',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('computes signed numerical GCD and minimum exponent for every original three-term source, retaining ±1', () => {
    const cases = [
      {
        i: 0,
        raw: '−12x²y+18xy²−6xy',
        terms: [
          { coefficient: -12, key: 'xxy' },
          { coefficient: 18, key: 'xyy' },
          { coefficient: -6, key: 'xy' },
        ],
        g: 6,
        key: 'xy',
        rem: [-2, 3, -1],
        positive: '6xy(-2x+3y-1)',
        negative: '-6xy(2x-3y+1)',
        vars: ['x', 'y'],
      },
      {
        i: 1,
        raw: '−20ab²+30a²b−10ab',
        terms: [
          { coefficient: -20, key: 'xyy' },
          { coefficient: 30, key: 'xxy' },
          { coefficient: -10, key: 'xy' },
        ],
        g: 10,
        key: 'xy',
        rem: [-2, 3, -1],
        positive: '10ab(-2b+3a-1)',
        negative: '-10ab(2b-3a+1)',
        vars: ['a', 'b'],
      },
    ];
    for (const c of cases) {
      expect(raw(c.i, 1, 'G')).toBe(c.raw);
      const model = commonFactor(c.terms);
      expect(model.coefficient).toBe(c.g);
      expect(model.key).toBe(c.key);
      expect(model.quotients.map((term) => term.coefficient)).toEqual(c.rem);
      expect(model.quotients[2]!.key).toBe('');
      same(c.raw, c.positive, c.vars);
      same(c.raw, c.negative, c.vars);
      expect(checkFactorisation(c.negative, c.positive, c.vars)).toBe(true);
      expect(
        equalPolynomial(math(c.raw), c.positive.replace('-1)', ')'), c.vars),
      ).toBe(false);
      expect(equalPolynomial(math(c.raw), `-(${c.positive})`, c.vars)).toBe(
        false,
      );
    }
  });
  it('rejects overextraction and nongreatest completion while retaining zero-variable identities', () => {
    for (const [i, terms] of [
      [
        { coefficient: -12, key: 'xxy' },
        { coefficient: 18, key: 'xyy' },
        { coefficient: -6, key: 'xy' },
      ],
      [
        { coefficient: -20, key: 'xyy' },
        { coefficient: 30, key: 'xxy' },
        { coefficient: -10, key: 'xy' },
      ],
    ].entries()) {
      const rename = (s: string) =>
        i === 0 ? math(s) : math(s).replaceAll('a', 'x').replaceAll('b', 'y');
      expect(inspectCommonFactor(terms, rename(raw(i, 1, 'C')))).toEqual({
        valid: true,
        greatest: false,
      });
      expect(inspectCommonFactor(terms, rename(raw(i, 1, 'E')))).toEqual({
        valid: false,
        greatest: false,
      });
      expect(inspectCommonFactor(terms, `${i === 0 ? -6 : -10}xy`)).toEqual({
        valid: true,
        greatest: true,
      });
    }
    same('-12x^2*0+18x*0^2-6x*0', '0', ['x']);
    same('-20a*0^2+30a^2*0-10a*0', '0', ['a']);
    expect(
      checkFactorisation('3xy(-4x+6y-2)', '6xy(-2x+3y-1)', ['x', 'y']),
    ).toBe(false);
  });
  it('fully factors both original double-base patterns with content and both middle signs', () => {
    for (const c of [
      {
        i: 0,
        vars: ['x', 'y'],
        D: '2(2x-3y)(2x+3y)',
        S: '2(2x-3y)^2',
        flip: '8x^2+24xy+18y^2',
        flipFactors: '2(2x+3y)^2',
      },
      {
        i: 1,
        vars: ['a', 'b'],
        D: '3(2a-3b)(2a+3b)',
        S: '3(2a+3b)^2',
        flip: '12a^2-36ab+27b^2',
        flipFactors: '3(2a-3b)^2',
      },
    ]) {
      same(raw(c.i, 2, 'D'), c.D, c.vars);
      same(raw(c.i, 2, 'S'), c.S, c.vars);
      same(c.flip, c.flipFactors, c.vars);
      expect(checkFactorisation(c.S, c.S, c.vars)).toBe(true);
      expect(checkFactorisation(c.D, c.S, c.vars)).toBe(false);
      expect(
        checkFactorisation(
          c.i === 0 ? '2(4x^2-9y^2)' : '3(4a^2-9b^2)',
          c.D,
          c.vars,
        ),
      ).toBe(false);
    }
  });
  it('audits factor order and balanced signs without treating a single changed sign as equivalent', () => {
    for (const [
      source,
      reordered,
      balanced,
      oneSign,
      square,
      reversedSquare,
      vars,
    ] of [
      [
        '2(2x-3y)(2x+3y)',
        '(2x+3y)2(2x-3y)',
        '2(3y-2x)(-2x-3y)',
        '2(3y-2x)(2x+3y)',
        '2(2x-3y)^2',
        '2(3y-2x)(3y-2x)',
        ['x', 'y'],
      ],
      [
        '3(2a-3b)(2a+3b)',
        '(2a+3b)3(2a-3b)',
        '3(3b-2a)(-2a-3b)',
        '3(3b-2a)(2a+3b)',
        '3(2a+3b)^2',
        '3(-2a-3b)(-2a-3b)',
        ['a', 'b'],
      ],
    ] as const) {
      expect(checkFactorisation(reordered, source, [...vars])).toBe(true);
      expect(checkFactorisation(balanced, source, [...vars])).toBe(true);
      expect(checkFactorisation(oneSign, source, [...vars])).toBe(false);
      expect(checkFactorisation(reversedSquare, square, [...vars])).toBe(true);
    }
  });
  it('exhausts both signs of every unordered positive-product pair rather than confusing a successful pair with completeness', () => {
    for (const [i, q, expected] of [
      [
        0,
        12,
        [
          [-12, -1],
          [-6, -2],
          [-4, -3],
          [1, 12],
          [2, 6],
          [3, 4],
        ],
      ],
      [
        1,
        10,
        [
          [-10, -1],
          [-5, -2],
          [1, 10],
          [2, 5],
        ],
      ],
    ] as const) {
      const pairs: [number, number][] = [];
      for (let r = -q; r <= q; r++)
        for (let s = r; s <= q; s++) if (r * s === q) pairs.push([r, s]);
      expect(pairs).toEqual(expected);
      expect(quadraticSearch(7, q).pairs.map((p) => [p.r, p.s])).toEqual(
        expected,
      );
      expect(
        quadraticSearch(-7, q)
          .pairs.filter((p) => p.hit)
          .map((p) => p.sum),
      ).toEqual([-7]);
      for (const [r, s] of pairs)
        expect(sets[i]!.questions[2]!.solution.en).toContain(
          `(${r < 0 ? '−' + -r : r},${s < 0 ? '−' + -s : s}):${r + s < 0 ? '−' + -(r + s) : r + s}`,
        );
    }
  });
  it('checks pure squares, monic scope and the full product-one impossibility separately from variable sampling', () => {
    same(raw(0, 3, 'Z'), 'x*x', ['x']);
    same(raw(1, 3, 'Z'), 't*t', ['t']);
    same(raw(0, 3, 'N'), raw(0, 3, 'C'), ['x']);
    same(raw(1, 3, 'N'), raw(1, 3, 'C'), ['t']);
    expect(equalPolynomial('2x^2+7x+3', '(x+1)(x+3)')).toBe(false);
    for (const p of [-1, 1]) {
      expect(
        quadraticSearch(p, 1).pairs.map((pair) => [pair.r, pair.s, pair.sum]),
      ).toEqual([
        [-1, -1, -2],
        [1, 1, 2],
      ]);
      expect(quadraticSearch(p, 1).match).toBeUndefined();
    }
    for (const [i, constant] of [
      [0, 9],
      [1, 16],
    ]) {
      expect(sets[i!]!.questions[1]!.solution.en).toContain(
        `rs=−r²≤0, contradicting positive ${constant}`,
      );
      expect(sets[i!]!.questions[1]!.stem.en).toContain('PROVE');
    }
  });
  it('checks every allowed independent garden, unfinished example and matching-zero false product using full identities', () => {
    for (const k of [2, 3])
      for (let u = 1; u <= 3; u++)
        for (let v = u + 1; v <= 3; v++) {
          same(`${k}w^2+${k * u}w`, `${k}w(w+${u})`, ['w']);
          same(`w^2+${2 * u}w+${u * u}`, `(w+${u})^2`, ['w']);
          same(`w^2+${u + v}w+${u * v}`, `(w+${u})(w+${v})`, ['w']);
          expect(
            checkFactorisation(`${k}(w^2+${u}w)`, `${k}w(w+${u})`, ['w']),
          ).toBe(false);
          same(`(2w+${u})(w+${v})-(w+${u})(w+${v})`, `w^2+${v}w`, ['w']);
          expect((2 * 0 + u) * (0 + v)).toBe(0 ** 2 + (u + v) * 0 + u * v);
          expect((2 + u) * (1 + v)).not.toBe((1 + u) * (1 + v));
        }
    expect((2 + 2) * (1 + 3)).toBe(16);
    for (const s of sets)
      expect(s.questions[2]!.solution.en).toContain(
        'sixteen rather than twelve',
      );
  });
});
