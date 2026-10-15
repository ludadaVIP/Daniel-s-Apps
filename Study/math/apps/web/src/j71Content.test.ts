import { describe, it, expect } from 'vitest';
import {
  j71Lessons,
  j71CheckQuestions,
  j71ReviewQuestion,
} from './content/J71';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { parseAffine } from './algebraModels';
import {
  readRational,
  rationalPair,
  rationalOperation,
  rationalLine,
  expressionTrace,
  mixedExpression,
  expressionText,
  N,
  B,
  type RationalExpr,
} from './rationalModels';
const markdown = import.meta.glob('../../../content/lessons/J71-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j71Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j71CheckQuestions,
];
const ratio = (s: string): [bigint, bigint] => {
  const [n, d = '1'] = s.split('/');
  return [BigInt(n!), BigInt(d)];
};
const equal = (s: string, n: number, d = 1) => {
  const [a, b] = ratio(s);
  expect(a * BigInt(d)).toBe(BigInt(n) * b);
  expect(b).toBeGreaterThan(0n);
};
describe('J71 rational system content and exact independent oracles', () => {
  it('matches six planned bilingual lessons and all available curriculum registrations', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'J71')!;
    expect(j71Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J71.questions).toHaveLength(8);
    expect(new Set(j71Lessons.map((l) => l.lab)).size).toBe(6);
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    for (const l of j71Lessons) {
      expect(l.stage).toBe('J07');
      expect(l.unit).toBe('J71');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      expect(reviewQuestionFor(l.id, 0)).toEqual(j71ReviewQuestion(l.id, 0));
    }
  });
  it('validates 56 unique authored items and their explicit bilingual evidence', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'number')).toHaveLength(42);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(7);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(300);
      } else {
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
      }
      for (const o of q.options ?? []) {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      }
    }
  });
  it('independently transcribes all 42 numeric and seven choice answers', () => {
    const expected = [
      ['1.5', '0', '-0.75', '5/3', '-2.05', '1.75'],
      ['1.5', '2', '1', '0', '0.5', '1.5'],
      ['-0.25', '-5/6', '0.5', '0', '-0.5', '-7/12'],
      ['-0.25', '-0.5', '-1', '1/6', '-1.75', '0.75'],
      ['1', '-5/6', '1.5', '0', '-8/27', '-0.75'],
      ['1/6', '-4', '4', '9', '1', '0.75'],
    ];
    j71Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    ['0.75', '7/6', '-1/4', '1/3', '6/5', '0'].forEach((a, i) =>
      expect(checkAnswer(a, j71CheckQuestions[i]!.answer)).toBe(true),
    );
    [1, 2, 1, 0, 1, 0].forEach((a, i) =>
      expect(j71Lessons[i]!.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String(a),
      }),
    );
    expect(j71CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '1',
    });
  });
  it('accepts exact signed scalar notation and rejects expressions, wrong units and rounded results', () => {
    const spec = j71Lessons[2]!.guided.answer;
    for (const s of ['-1/4', '−1/4', '－1／4', '1/-4', '-0.25', '-.25', '-2/8'])
      expect(checkAnswer(s, spec), s).toBe(true);
    for (const s of ['-3/4+1/2', '-(1/4)', '-25%', '-1/4 km', '-0.2501'])
      expect(checkAnswer(s, spec), s).toBe(false);
    expect(checkAnswer('-0', j71Lessons[0]!.questions[1]!.answer)).toBe(true);
    expect(checkAnswer('-0.5833', j71Lessons[2]!.exit.answer)).toBe(false);
    expect(readRational('1/-2')).toEqual([-1n, 2n]);
    expect(readRational('－.50')).toEqual([-1n, 2n]);
    expect(readRational('-0')).toEqual([0n, 1n]);
  });
  it('checks 1521 rational pairs and 6084 operations against independent integer cross products and inverse relations', () => {
    for (let a = -6; a <= 6; a++)
      for (const ad of [2, 3, 4])
        for (let b = -6; b <= 6; b++)
          for (const bd of [2, 3, 4]) {
            const x = `${a}/${ad}`,
              y = `${b}/${bd}`,
              pair = rationalPair(x, y);
            equal(pair.delta, b * ad - a * bd, ad * bd);
            equal(pair.distance, Math.abs(b * ad - a * bd), ad * bd);
            equal(pair.absolute, Math.abs(a), ad);
            equal(pair.opposite, -a, ad);
            expect(pair.relation).toBe(
              a * bd < b * ad ? '<' : a * bd > b * ad ? '>' : '=',
            );
            expect(pair.coincident).toBe(a * bd === b * ad);
            const sum = rationalOperation(x, y, '+'),
              difference = rationalOperation(x, y, '−'),
              product = rationalOperation(x, y, '×'),
              quotient = rationalOperation(x, y, '÷');
            equal(sum.result!, a * bd + b * ad, ad * bd);
            equal(difference.result!, a * bd - b * ad, ad * bd);
            equal(product.result!, a * b, ad * bd);
            expect(rationalOperation(difference.result!, y, '+').result).toBe(
              rationalPair(x, '0').a,
            );
            if (b === 0) {
              expect(quotient.result).toBeNull();
              expect(quotient.scale).toBeNull();
            } else {
              equal(quotient.result!, a * bd, ad * b);
              expect(rationalOperation(quotient.result!, y, '×').result).toBe(
                pair.a,
              );
            }
            expect(Math.abs((a * Number(sum.common)) % ad)).toBe(0);
            expect(Math.abs((b * Number(sum.common)) % bd)).toBe(0);
          }
  });
  it('preserves unit geometry and merges identical points without inventing a new negative-zero position', () => {
    for (const d of [2, 3, 4])
      for (let a = -6; a <= 6; a++) {
        const m = rationalLine([
          { label: 'A', value: `${a}/${d}` },
          { label: 'B', value: '0' },
        ]);
        const p = m.points.find((p) => p.labels.includes('A'))!;
        expect(p.x - m.zero).toBeCloseTo((a / d) * 96, 12);
        const whole = m.ticks.filter((t) => t.whole);
        whole.slice(1).forEach((t, i) => expect(t.x - whole[i]!.x).toBe(96));
        for (let i = 1; i < m.ticks.length; i++)
          expect(m.ticks[i]!.x - m.ticks[i - 1]!.x).toBeCloseTo(
            96 / m.grid,
            12,
          );
      }
    expect(
      rationalLine([
        { label: 'A', value: '-6/4' },
        { label: 'B', value: '-1.5' },
      ]).points,
    ).toHaveLength(1);
    const z = rationalLine([
      { label: 'A', value: '-0' },
      { label: 'B', value: '0/2' },
    ]);
    expect(z.points[0]!.labels).toEqual(['A', 'B']);
    expect(z.points[0]!.value).toBe('0');
  });
  it('renders all 5967 defined operand/result pairs reachable by the workbenches without changing the unit', () => {
    let cases = 0;
    for (let a = -6; a <= 6; a++)
      for (const ad of [2, 3, 4])
        for (let b = -6; b <= 6; b++)
          for (const bd of [2, 3, 4])
            for (const op of ['+', '−', '×', '÷'] as const) {
              const m = rationalOperation(`${a}/${ad}`, `${b}/${bd}`, op);
              if (m.result === null) continue;
              const axis = rationalLine([
                { label: 'A', value: m.a },
                { label: 'R', value: m.result },
              ]);
              for (const p of axis.points) {
                const [n, d] = ratio(p.value);
                expect((p.x - axis.zero) / axis.unit).toBeCloseTo(
                  Number(n) / Number(d),
                  12,
                );
                expect((p.x - 40) / (axis.unit / axis.grid)).toBeCloseTo(
                  Math.round((p.x - 40) / (axis.unit / axis.grid)),
                  9,
                );
              }
              expect(axis.unit).toBe(96);
              cases++;
            }
    expect(cases).toBe(5967);
  });
  it('checks forty mixed models with independent numeric values and full-expression equivalence at every non-power step', () => {
    for (const a of [2, 3, 4, 5, 6])
      for (const brackets of [false, true])
        for (const family of [
          'fractions',
          'association',
          'powers',
          'zero',
        ] as const) {
          const trace = expressionTrace(mixedExpression(family, a, brackets));
          if (family === 'zero') {
            expect(trace.result).toBeNull();
            expect(trace.rows.at(-1)!.undefined).toBe(true);
            expect(trace.rows.at(-1)!.calculation).toBe('(1 ÷ 0)');
            continue;
          }
          const expected =
            family === 'fractions'
              ? (a - 1) / 6
              : family === 'association'
                ? brackets
                  ? a / 2
                  : (9 * a) / 2
                : brackets
                  ? a * a
                  : -a * a;
          const [n, d] = ratio(trace.result!);
          expect(Number(n) / Number(d)).toBeCloseTo(expected, 12);
          if (family !== 'powers')
            for (const row of trace.rows) {
              for (const s of [row.before, row.after]) {
                const parsed = parseAffine(s)!;
                expect(parsed).toBeTruthy();
                expect(parsed.a[0]).toBe(0n);
                expect(Number(parsed.b[0]) / Number(parsed.b[1])).toBeCloseTo(
                  expected,
                  12,
                );
              }
            }
          expect(trace.rows[0]!.before).toBe(trace.initial);
          trace.rows
            .slice(1)
            .forEach((r, i) => expect(r.before).toBe(trace.rows[i]!.after));
          expect(trace.rows.at(-1)!.after).toBe(trace.result);
        }
  });
  it('distinguishes power bases, unary opposites, absolute values and nested zero divisors', () => {
    const outside = expressionTrace(mixedExpression('powers', 2, false)),
      inside = expressionTrace(mixedExpression('powers', 2, true));
    expect(outside.initial).toBe('−2²');
    expect(outside.rows.map((r) => r.after)).toEqual(['−(4)', '-4']);
    expect(inside.initial).toBe('(-2)²');
    expect(inside.result).toBe('4');
    const cube: RationalExpr = { kind: 'power', base: N('-2/3'), exponent: 3 };
    expect(expressionTrace(cube).result).toBe('-8/27');
    expect(
      expressionTrace({ kind: 'abs', value: B('−', N('-3/2'), N('1/2')) })
        .result,
    ).toBe('2');
    expect(
      expressionTrace(B('+', N('5'), B('÷', N('0'), N('0')))).result,
    ).toBeNull();
    expect(expressionTrace(B('÷', N('0'), N('-2/3'))).result).toBe('0');
    expect(expressionText(B('−', N('-1/2'), N('-3/4')))).toBe(
      '((-1/2) − (-3/4))',
    );
  });
  it('independently evaluates 480 retrieval variants, including zero, distance, inverses and changing power scope', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const a = k % 9,
          b = 1 + (Math.floor(k / 9) % 5),
          d = [2, 3, 4][k % 3]!,
          q = j71ReviewQuestion(j71Lessons[i]!.id, k);
        if (q.answer.kind !== 'number') throw Error('Expected scalar');
        let n: number,
          den = 1;
        if (i === 0) {
          n = (k % 2 === 0 ? 1 : -1) * a;
          den = d;
        } else if (i === 1) {
          n = k % 2 === 1 ? a + b : a;
          den = d;
        } else if (i === 2 || i === 3) {
          n = b * d - 2 * a;
          den = 2 * d;
        } else if (i === 4) {
          if (k % 2 === 1) {
            n = 2 * a;
            den = d * b;
          } else {
            n = a * b;
            den = 2 * d;
          }
        } else if (k % 3 === 0) {
          n = 2 * a - d;
          den = 3 * d;
        } else if (k % 3 === 1) n = (k % 2 === 0 ? 1 : -1) * (a + 1) * (a + 1);
        else {
          n = (a + 1) * b;
          den = 2;
        }
        equal(q.answer.value, n, den);
        expect(checkAnswer(q.answer.value, q.answer)).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
      }
  });
  it('rejects invalid numeric, visual, expression and retrieval domains', () => {
    let deep: RationalExpr = N('1');
    for (let i = 0; i < 60; i++) deep = { kind: 'neg', value: deep };
    for (const run of [
      () => readRational('1/0'),
      () => readRational('1+2'),
      () => readRational('50%'),
      () => readRational('1234567890123'),
      () => rationalLine([]),
      () => rationalLine([{ label: 'A', value: '21' }]),
      () =>
        rationalLine([
          { label: 'A', value: '1/5' },
          { label: 'B', value: '1/7' },
        ]),
      () => mixedExpression('powers', 1, false),
      () => expressionTrace(deep),
      () => j71ReviewQuestion('J71-L07', 0),
      () => j71ReviewQuestion('J71-L01', -1),
      () => j71ReviewQuestion('J71-L01', 0.5),
      () => j71ReviewQuestion('J71-L01', 100001),
    ])
      expect(run).toThrow(RangeError);
  });
});
