import { describe, it, expect } from 'vitest';
import {
  h01Lessons,
  h01CheckQuestions,
  h01ReviewQuestion,
} from './content/H01';
import {
  curriculum,
  lessons,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import {
  finiteSet,
  checkFiniteSet,
  operateSets,
  subset,
  conditionClass,
  conditionCases,
  checkLogicCode,
  counterexample,
  normalUnion,
  parseRealUnion,
  unionText,
  checkRealUnion,
  absoluteSolution,
  unionContains,
} from './logicModels';
import { interval, checkRealSet } from './inequalityModels';
import { readRational } from './rationalModels';
const bodies = import.meta.glob('../../../content/lessons/H01-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h01Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h01CheckQuestions,
];
describe('H01 exact sets, domains, implications and absolute-value unions', () => {
  it('opens exactly the planned five titles with valid prerequisites and two examples per language', () => {
    const reg = curriculum.flatMap((s) => s.units).flatMap((u) => u.lessons);
    expect(reg).toHaveLength(358);
    // A milestone floor keeps this unit's audit valid when later units open.
    expect(lessons.length).toBeGreaterThanOrEqual(232);
    expect(openUnits.length).toBeGreaterThanOrEqual(44);
    expect(
      reg
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      reg
        .filter((l) => l.id.startsWith('H01-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h01Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H01.questions).toHaveLength(8);
    for (const l of h01Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.findIndex((p) => p.id === id)).toBeGreaterThanOrEqual(0);
        expect(lessons.findIndex((p) => p.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h01ReviewQuestion(l.id, 0));
    }
  });
  it('audits all 48 items and reserves ten arguments for human review', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('true proof subset', q.answer)).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), q.id).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
    }
  });
  it('anchors every constructed question and choice without reading its stored expected value', () => {
    const anchors: (string | null)[][] = [
      ['3', '6,2,4', '∉', '⊆', '1', null],
      ['4,2', '4,3,2,1', '6,5,3', '1', '{}', '8,7,6,5,3'],
      ['false', '.25', 'not-statement', 'true', 'false', null],
      ['sufficient-only', 'necessary-only', 'both', 'neither', '-2', null],
      [
        '(-1,5)',
        '(-inf,-1] union [5,inf)',
        '[-1,2]',
        '{}',
        'all reals',
        'x<-1 or x>-1',
      ],
    ];
    h01Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((s, j) =>
        expect(checkAnswer(s ?? 'argument', qs[j]!.answer), qs[j]!.id).toBe(
          s === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([1, 2, 0, 0, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
  });
  it('distinguishes finite sets from lists, empty sets from singleton zero, and equivalent rational elements', () => {
    expect(finiteSet('{2,1,1,0}')).toEqual(['0', '1', '2']);
    expect(checkFiniteSet('{.5,1/2,2/4}', '{1/2}')).toBe(true);
    expect(checkFiniteSet('{0}', '{}')).toBe(false);
    expect(finiteSet('{}')).toEqual([]);
    expect(finiteSet('{0}')).toEqual(['0']);
    expect(subset([], ['0'])).toBe(true);
    for (const raw of [
      '',
      '{',
      '{1,}',
      '{{0}}',
      '1/0',
      '1,,2',
      '{a}',
      '1e3',
      '1'.repeat(401),
    ])
      expect(finiteSet(raw), raw).toBeNull();
  });
  it('exhaustively audits all set-operation truth combinations on a six-element universe', () => {
    const u = ['0', '1', '2', '3', '4', '5'];
    for (let x = 0; x < 64; x++)
      for (let y = 0; y < 64; y++) {
        const a = u.filter((_, j) => (x & (1 << j)) !== 0),
          b = u.filter((_, j) => (y & (1 << j)) !== 0);
        expect(operateSets(u, a, b, 'intersection')).toEqual(
          u.filter((_, j) => (x & y & (1 << j)) !== 0),
        );
        expect(operateSets(u, a, b, 'union')).toEqual(
          u.filter((_, j) => ((x | y) & (1 << j)) !== 0),
        );
        expect(operateSets(u, a, b, 'complement')).toEqual(
          u.filter((_, j) => (x & (1 << j)) === 0),
        );
        expect(operateSets(u, a, b, 'difference')).toEqual(
          u.filter((_, j) => (x & (1 << j)) !== 0 && (y & (1 << j)) === 0),
        );
      }
    expect(() => operateSets(u, ['7'], [], 'union')).toThrow();
  });
  it('makes complements depend on the universe while preserving intersection and union', () => {
    const a = ['1', '2'],
      b = ['2', '3'],
      u = ['1', '2', '3', '4'],
      v = [...u, '5'];
    expect(operateSets(u, a, b, 'complement')).toEqual(['3', '4']);
    expect(operateSets(v, a, b, 'complement')).toEqual(['3', '4', '5']);
    for (const op of ['union', 'intersection'] as const)
      expect(operateSets(u, a, b, op)).toEqual(operateSets(v, a, b, op));
  });
  it('audits implication classification through all truth assignments, including empty premises', () => {
    const u = ['a', 'b', 'c'];
    for (let p = 0; p < 8; p++)
      for (let q = 0; q < 8; q++) {
        const a = u.filter((_, j) => (p & (1 << j)) !== 0),
          b = u.filter((_, j) => (q & (1 << j)) !== 0),
          forward = (p & ~q & 7) === 0,
          reverse = (q & ~p & 7) === 0;
        expect(conditionClass(a, b)).toBe(
          forward
            ? reverse
              ? 'both'
              : 'sufficient-only'
            : reverse
              ? 'necessary-only'
              : 'neither',
        );
      }
    expect(conditionCases.map((c) => conditionClass(c.p, c.q))).toEqual([
      'sufficient-only',
      'necessary-only',
      'both',
      'neither',
      'sufficient-only',
    ]);
    expect(checkLogicCode('必要不充分', 'necessary-only')).toBe(true);
    expect(checkLogicCode('sufficient', 'sufficient-only')).toBe(false);
    expect(checkLogicCode('not true', 'true')).toBe(false);
  });
  it('checks admissibility before accepting a counterexample and does not treat confirmations as proof', () => {
    expect(counterexample('1/2', true)).toMatchObject({
      admissible: false,
      refutes: false,
    });
    expect(counterexample('1/2', false)).toMatchObject({
      admissible: true,
      refutes: true,
      square: '1/4',
    });
    for (const x of ['-2', '0', '1', '2'])
      expect(counterexample(x, false)!.refutes).toBe(false);
    expect(counterexample('1/0', false)).toBeNull();
    expect(counterexample('2/2', true)!.admissible).toBe(true);
  });
  it('normalizes unions by exact endpoints without closing a missing point', () => {
    expect(checkRealUnion('x<0 or x>0', 'ℝ')).toBe(false);
    expect(checkRealUnion('x<=0 or x>0', 'ℝ')).toBe(true);
    expect(checkRealUnion('(-inf,0) ∪ {0} ∪ (0,inf)', 'ℝ')).toBe(true);
    expect(checkRealUnion('(0,2] ∪ [1,3)', '0<x<3')).toBe(true);
    expect(checkRealUnion('x>=5 or x<=-1', '(-inf,-1] ∪ [5,inf)')).toBe(true);
    expect(
      unionText(
        normalUnion([
          interval(readRational('0'), readRational('1'), false, true),
          interval(readRational('0'), readRational('2'), true, false),
        ]),
      ),
    ).toBe('0 ≤ x < 2');
    expect(checkRealUnion('x<0 and x>0', '∅')).toBe(true);
    expect(checkRealUnion('x<0; x>0', 'ℝ')).toBe(false);
    expect(checkRealSet('x<0 or x>0', 'ℝ')).toBe(false);
  });
  it('merges a singleton bridge regardless of input order or which neighboring interval is open', () => {
    const parts = ['x<0', '0<x<1', '{0}'];
    for (const order of [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ])
      expect(
        checkRealUnion(order.map((i) => parts[i]).join(' or '), 'x<1'),
      ).toBe(true);
    expect(checkRealUnion('x<0 or 0<x<1', 'x<1')).toBe(false);
    expect(checkRealUnion('x<0 or 0<x<1 or 1<=x<=2 or {0}', 'x<=2')).toBe(true);
    expect(checkRealUnion('(0,1) or {1} or (1,2)', '0<x<2')).toBe(true);
  });
  it('rejects malformed or unbounded union syntax without evaluating expressions', () => {
    for (const s of [
      '',
      'x<0 or',
      'or x>0',
      '[-inf,0]',
      '[0,inf]',
      '[0,1] blah',
      'x/x>0',
      'x=1 or x=2 or x=3 or x=4 or x=5',
      'x'.repeat(1201),
    ])
      expect(parseRealUnion(s), s).toBeNull();
  });
  it('anchors distance, scaled coefficients, strict endpoints and all zero/negative threshold cases', () => {
    for (const [a, b, c, op, want] of [
      ['1', '-2', '3', '<', '-1<x<5'],
      ['1', '-2', '3', '>=', 'x<=-1 or x>=5'],
      ['2', '-1', '3', '<=', '-1<=x<=2'],
      ['-2', '1', '3', '<=', '-1<=x<=2'],
      ['1', '1', '-2', '<', '∅'],
      ['1', '1', '-2', '>=', 'ℝ'],
      ['1', '1', '0', '<=', '{-1}'],
      ['1', '1', '0', '>', 'x<-1 or x>-1'],
      ['1', '1', '0', '>=', 'ℝ'],
      ['1', '1', '0', '<', '∅'],
      ['0', '2', '2', '<=', 'ℝ'],
      ['0', '2', '2', '>', '∅'],
    ])
      expect(
        checkRealUnion(
          unionText(absoluteSolution(a!, b!, c!, op as '<')),
          want!,
        ),
      ).toBe(true);
  });
  it('independently substitutes a dense rational grid across every integer UI configuration', () => {
    for (let a = -3; a <= 3; a++)
      for (let b = -4; b <= 4; b++)
        for (let c = -2; c <= 5; c++)
          for (const op of ['<', '<=', '>', '>='] as const) {
            const set = absoluteSolution(String(a), String(b), String(c), op);
            for (let n = -37; n <= 37; n++) {
              const lhs = Math.abs(a * n + 2 * b),
                rhs = 2 * c,
                want =
                  op === '<'
                    ? lhs < rhs
                    : op === '<='
                      ? lhs <= rhs
                      : op === '>'
                        ? lhs > rhs
                        : lhs >= rhs;
              expect(
                unionContains(set, readRational(`${n}/2`)),
                `${a},${b},${c},${op},${n}/2`,
              ).toBe(want);
            }
          }
  });
  it('keeps non-integer endpoints exact beyond a display window', () => {
    const set = absoluteSolution('3/2', '-1/3', '1/7', '<=');
    expect(checkRealUnion(unionText(set), '8/63<=x<=20/63')).toBe(true);
    expect(unionContains(set, readRational('8/63'))).toBe(true);
    expect(unionContains(set, readRational('20/63'))).toBe(true);
    expect(unionContains(set, readRational('1/10'))).toBe(false);
    expect(
      checkRealUnion(
        unionText(absoluteSolution('1', '-100', '1', '>')),
        'x<99 or x>101',
      ),
    ).toBe(true);
  });
  it('audits 400 retrieval rounds with independent finite-set and direct-substitution oracles', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = h01ReviewQuestion(`H01-L0${i + 1}`, k);
        ids.add(q.id);
        expect(checkAnswer(q.answerChecks!.accepted[0]!, q.answer)).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer)).toBe(false);
        if (i === 0) {
          const want = [];
          for (let n = 0; n <= 1 + (k % 8); n += 2) want.push(String(n));
          expect(checkAnswer(want.join(','), q.answer)).toBe(true);
        }
        if (i === 1) {
          const want = [];
          for (let n = 0; n < 5 + (k % 4); n++) {
            const even = n % 2 === 0,
              three = n % 3 === 0;
            if ([even && three, even || three, !even, even && !three][k % 4])
              want.push(n);
          }
          expect(checkAnswer(`{${want}}`, q.answer)).toBe(true);
        }
        if (i === 2)
          expect(checkAnswer(k % 2 === 0 ? 'true' : 'false', q.answer)).toBe(
            true,
          );
        if (i === 3)
          expect(
            checkAnswer(
              [
                'sufficient-only',
                'necessary-only',
                'both',
                'neither',
                'sufficient-only',
              ][k % 5]!,
              q.answer,
            ),
          ).toBe(true);
        if (i === 4) {
          const a = (k % 7) - 3,
            b = (Math.floor(k / 7) % 7) - 3,
            c = (Math.floor(k / 11) % 6) - 1,
            set = parseRealUnion(q.answerChecks!.accepted[0]!)!;
          for (let n = -20; n <= 20; n++) {
            const l = Math.abs(a * n + 2 * b),
              r = 2 * c;
            expect(unionContains(set, readRational(`${n}/2`))).toBe(
              [l < r, l <= r, l > r, l >= r][k % 4],
            );
          }
        }
      }
    expect(ids.size).toBe(400);
  });
  it('bounds review IDs and raw rounds and deliberately cycles after eighty', () => {
    for (const id of ['H01-L00', 'H01-L06', 'J98-L01'])
      expect(() => h01ReviewQuestion(id, 0)).toThrow();
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h01ReviewQuestion('H01-L01', r)).toThrow();
    expect(h01ReviewQuestion('H01-L05', 100000).id).toBe('H01-L05-R100000');
    expect(h01ReviewQuestion('H01-L05', 80).answer).toEqual(
      h01ReviewQuestion('H01-L05', 0).answer,
    );
  });
});
