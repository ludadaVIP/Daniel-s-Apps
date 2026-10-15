import { describe, it, expect } from 'vitest';
import {
  j73Lessons,
  j73CheckQuestions,
  j73ReviewQuestion,
} from './content/J73';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import { solveAlgebra, sameSolutions, type Rational } from './algebraModels';
import {
  parseLinearEquation,
  checkLinearEquation,
  checkSolutionClass,
  linearSource,
  sourceText,
  linearTrace,
  linearTransform,
  bracketCases,
  fractionCases,
  fractionTrace,
  candidateAudit,
  contextSolution,
  wordEquation,
  allowedInContext,
} from './linearModels';
const markdown = import.meta.glob('../../../content/lessons/J73-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j73Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j73CheckQuestions,
];
const equalFraction = (r: Rational, n: number, d = 1) =>
  expect(r[0] * BigInt(d)).toBe(BigInt(n) * r[1]);
describe('J73 authored linear equations and exact model boundaries', () => {
  it('registers the six roadmap lessons, prior prerequisites and two complete examples in each language', () => {
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
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'J73')!;
    expect(j73Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J73.questions).toHaveLength(8);
    expect(new Set(j73Lessons.map((l) => l.lab)).size).toBe(6);
    for (const l of j73Lessons) {
      expect(l.stage).toBe('J07');
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
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(j73ReviewQuestion(l.id, 0));
    }
  });
  it('executes all accepted and misconception cases for 56 unique bilingual items', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    for (const [kind, count] of Object.entries({
      number: 33,
      'linear-equation': 3,
      'solution-class': 6,
      choice: 7,
      explain: 7,
    }))
      expect(all.filter((q) => q.answer.kind === kind)).toHaveLength(count);
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
        expect(checkAnswer('all', q.answer)).toBeNull();
        continue;
      }
      expect(q.answerChecks!.accepted.length).toBeGreaterThan(0);
      expect(q.answerChecks!.rejected.length).toBeGreaterThan(0);
      for (const value of q.answerChecks!.accepted)
        expect(checkAnswer(value, q.answer), `${q.id} accepts ${value}`).toBe(
          true,
        );
      for (const value of q.answerChecks!.rejected)
        expect(checkAnswer(value, q.answer), `${q.id} rejects ${value}`).toBe(
          false,
        );
    }
  });
  it('independently checks all 42 constructed answers and seven selected choices from the stated problems', () => {
    const expected = [
      ['4', '2', '0', 'all', 'none', '-1/3'],
      ['3', '4', '5', '-3', '6', '5/3'],
      ['7', '1', '-3', '2', '4', '-1/7'],
      ['8', '8', '-3', '1/2', '4', '12/5'],
      ['11', 'x+x+8=30', '2', '20=3x+2', '8', '19/2'],
      ['none', 'none', '1/3', '3', '-3', 'none'],
    ];
    j73Lessons.forEach((l, i) => {
      const constructed = [l.guided, ...l.questions.slice(1, 5), l.exit];
      constructed.forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(l.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String([1, 2, 0, 1, 2, 0][i]),
      });
    });
    ['3', '-4', '7/2', '1/3', '26=x+x+6', 'none'].forEach((v, i) =>
      expect(checkAnswer(v, j73CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j73CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '2',
    });
    expect(checkAnswer('-0.33', j73Lessons[0]!.exit.answer)).toBe(false);
    expect(checkAnswer('9.5 years', j73Lessons[4]!.exit.answer)).toBe(true);
    expect(checkAnswer('9.5 people', j73Lessons[4]!.exit.answer)).toBe(false);
  });
  it('solves 625 integer coefficient equations by independent determinant arithmetic, including zero, none and all', () => {
    for (let a = -2; a <= 2; a++)
      for (let b = -2; b <= 2; b++)
        for (let c = -2; c <= 2; c++)
          for (let d = -2; d <= 2; d++) {
            const s = { left: `${a}x+(${b})`, right: `${c}x+(${d})` },
              result = solveAlgebra(linearSource(s));
            if (a === c) expect(result.kind).toBe(b === d ? 'all' : 'none');
            else {
              expect(result.kind).toBe('one');
              if (result.kind === 'one') {
                equalFraction(result.value, d - b, a - c);
                const [n, den] = result.value;
                expect(BigInt(a) * n + BigInt(b) * den).toBe(
                  BigInt(c) * n + BigInt(d) * den,
                );
              }
            }
          }
  });
  it('requires the explicitly requested original quantity sides while recognising equivalent solution sets', () => {
    for (const input of ['x+(x+8)=30', '30=2*x+8', '2(x+4)=30', 'x+x+8＝30'])
      expect(checkLinearEquation(input, 'x+(x+8)=30')).toBe(true);
    for (const input of ['x=11', '2x=22', '4x+16=60']) {
      expect(checkLinearEquation(input, 'x+(x+8)=30')).toBe(false);
      expect(checkLinearEquation(input, 'x+(x+8)=30', false)).toBe(true);
    }
    for (const input of ['2x=30', 'x=12', '3x=20'])
      expect(checkLinearEquation(input, 'x+(x+8)=30', false)).toBe(false);
    expect(checkLinearEquation('0=0', '2x+2=2(x+1)', false)).toBe(true);
    expect(checkLinearEquation('1=3', '2x+1=2x+3', false)).toBe(true);
  });
  it('parses restricted exact affine equations and rejects ambiguous equalities, unknowns, nonlinear syntax and zero divisors', () => {
    for (const raw of ['2（x−3）＝x＋1', '(1/2)x+2=5', '3x÷4+1／2=x/2−1/4'])
      expect(parseLinearEquation(raw), raw).toBeTruthy();
    for (const raw of [
      '',
      'x',
      'x=',
      'x=1=2',
      'x==2',
      'y=2',
      'x*x=2',
      'x^2=4',
      '1/x=2',
      'x/0=2',
      'x/(x-1)=2',
      'x=NaN',
      'x=Infinity',
      'x=alert(1)',
      'x=1;process.exit()',
      'x=' + '1'.repeat(181),
    ])
      expect(parseLinearEquation(raw), raw).toBeNull();
    expect(() => linearSource({ left: '1/x', right: '2' })).toThrow();
  });
  it('separates syntax-only solution classes from numerical zero and from prose claims', () => {
    for (const s of [
      'none',
      'NO SOLUTION',
      '无解',
      '无符合条件的解',
      '∅',
      '{}',
    ])
      expect(checkSolutionClass(s, 'none')).toBe(true);
    for (const s of ['all', 'all rational numbers', '任意有理数', '所有有理数'])
      expect(checkSolutionClass(s, 'all')).toBe(true);
    for (const s of [
      '0',
      'x=0',
      'infinitely many',
      'every positive integer',
      'I think no solution because zero',
    ]) {
      expect(checkSolutionClass(s, 'none')).toBe(false);
      expect(checkSolutionClass(s, 'all')).toBe(false);
    }
  });
  it('preserves solutions under reversible operations and distinguishes actual preservation from a safe general rule', () => {
    for (const source of [
      { left: '5x+2', right: '2x+11' },
      { left: '2x+2', right: '2(x+1)' },
      { left: '2x+1', right: '2x+3' },
    ]) {
      const original = linearSource(source);
      for (const op of ['+', '−', '×', '÷'] as const)
        for (const amount of ['-3', '1/2', '2']) {
          const r = linearTransform(original, op, amount, 'both');
          expect(r.safeRule).toBe(true);
          expect(r.preserves).toBe(true);
          expect(sameSolutions(original, r.next!)).toBe(true);
        }
      for (const op of ['+', '−'] as const)
        for (const amount of ['2x', 'x-3'])
          expect(linearTransform(original, op, amount, 'both').safeRule).toBe(
            true,
          );
      expect(linearTransform(original, '÷', '0', 'both').next).toBeNull();
      expect(linearTransform(original, '×', 'x', 'both').next).toBeNull();
      expect(linearTransform(original, '×', '0', 'both').safeRule).toBe(false);
    }
    const base = linearSource({ left: '5x+2', right: '2x+11' });
    expect(linearTransform(base, '×', '0', 'both').preserves).toBe(false);
    expect(linearTransform(base, '−', '2', 'left').preserves).toBe(false);
    const coincidence = linearTransform(
      linearSource({ left: 'x', right: '0' }),
      '×',
      '2',
      'left',
    );
    expect(coincidence.preserves).toBe(true);
    expect(coincidence.safeRule).toBe(false);
    expect(linearTransform(base, '+', '?', 'both').reason).toBe('invalid');
  });
  it('keeps every bracket trace equivalent and independently verifies negative factors and degenerate results', () => {
    const expected = ['7', '1', '-3', 'all', 'none'];
    bracketCases.forEach((s, i) => {
      const trace = linearTrace(s);
      for (const step of trace.steps)
        expect(sameSolutions(trace.original, step.equation)).toBe(true);
      if (trace.solution.kind === 'one')
        expect(
          checkAnswer(expected[i]!, {
            kind: 'number',
            value: `${trace.solution.value[0]}/${trace.solution.value[1]}`,
          }),
        ).toBe(true);
      else expect(trace.solution.kind).toBe(expected[i]);
    });
    const r = linearTrace(bracketCases[1]!);
    equalFraction(r.steps[0]!.equation.left.a, -3);
    equalFraction(r.steps[0]!.equation.left.b, 6);
    for (const s of bracketCases.slice(3))
      expect(linearTrace(s).steps.some((s) => s.reason === 'divide')).toBe(
        false,
      );
  });
  it('verifies each denominator-clearing side by its exact scaling factor and retains integer terms', () => {
    fractionCases.forEach((s, i) => {
      const trace = fractionTrace(i),
        base = linearSource(s);
      expect(trace.lcd).toBe([6, 6, 4, 6][i]);
      for (const side of ['left', 'right'] as const) {
        const scaled = trace.steps[1]!.equation[side];
        for (const key of ['a', 'b'] as const) {
          const r = scaled[key],
            o = base[side][key];
          expect(r[0] * o[1]).toBe(o[0] * BigInt(trace.lcd) * r[1]);
        }
      }
      for (const step of trace.steps)
        expect(sameSolutions(base, step.equation)).toBe(true);
      const solved = trace.solution;
      expect(solved.kind).toBe('one');
      if (solved.kind === 'one')
        equalFraction(solved.value, [8, 8, -3, 1][i]!, i === 3 ? 2 : 1);
    });
    equalFraction(fractionTrace(1).steps[1]!.equation.right.b, -6);
    expect(() => fractionTrace(-1)).toThrow();
    expect(() => fractionTrace(4)).toThrow();
  });
  it('audits equality and domain independently, retaining exact fractions, signed Celsius and valid zero counts', () => {
    expect(
      candidateAudit({ left: '3x', right: '8' }, '8/3', 'integer'),
    ).toMatchObject({
      left: '8',
      right: '8',
      equationPass: true,
      contextPass: false,
      accepted: false,
    });
    expect(
      candidateAudit({ left: '3x', right: '8' }, '3', 'integer'),
    ).toMatchObject({
      left: '9',
      right: '8',
      equationPass: false,
      contextPass: true,
      accepted: false,
    });
    expect(
      candidateAudit({ left: '3x', right: '1' }, '1/3', 'positive')!.accepted,
    ).toBe(true);
    expect(
      candidateAudit({ left: 'x+5', right: '2' }, '-3', 'rational')!.accepted,
    ).toBe(true);
    expect(
      candidateAudit({ left: '4x', right: '0' }, '0', 'integer')!.accepted,
    ).toBe(true);
    expect(
      contextSolution({ left: '2x+5', right: '3' }, 'nonnegative').kind,
    ).toBe('none');
    for (const raw of ['x=4', '4 cm', '1/0', '3+1', 'NaN'])
      expect(candidateAudit({ left: 'x', right: '4' }, raw)).toBeNull();
    expect(allowedInContext([0n, 1n], 'positive')).toBe(false);
    expect(allowedInContext([0n, 1n], 'nonnegative')).toBe(true);
  });
  it('checks all 451 age pairs and 451 whole-bag models against independent domain arithmetic', () => {
    for (let a = 2; a <= 12; a++)
      for (let total = 0; total <= 40; total++) {
        const age = wordEquation('ages', a, total),
          bag = wordEquation('groups', a, total);
        expect(age.algebra.kind).toBe('one');
        if (age.algebra.kind === 'one')
          equalFraction(age.algebra.value, total - a, 2);
        expect(age.context.kind).toBe(total >= a ? 'one' : 'none');
        expect(bag.algebra.kind).toBe('one');
        if (bag.algebra.kind === 'one')
          equalFraction(bag.algebra.value, total - 2, a);
        expect(bag.context.kind).toBe(
          total >= 2 && (total - 2) % a === 0 ? 'one' : 'none',
        );
      }
    for (const args of [
      [1, 10],
      [13, 20],
      [3, -1],
      [3, 41],
      [2.5, 10],
    ])
      expect(() => wordEquation('ages', args[0]!, args[1]!)).toThrow();
    expect(sourceText(wordEquation('ages', 8, 30).source)).toBe('x+(x+8) = 30');
  });
  it('independently computes 480 retrieval answers including identities, empty contextual sets and original models', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const id = `J73-L0${i + 1}`,
          q = j73ReviewQuestion(id, k),
          a = (k % 9) - 4,
          b = 1 + (Math.floor(k / 9) % 5),
          c = (k % 5) - 2,
          p = 1 + (k % 8);
        const expected =
          i === 0
            ? k % 5 === 0
              ? 'all'
              : k % 5 === 1
                ? 'none'
                : String(a)
            : i === 1 || i === 2
              ? String(a)
              : i === 3
                ? `${a - c}/${b}`
                : i === 4
                  ? k % 2 === 0
                    ? String(p)
                    : `${b * p + 2}=${b}x+2`
                  : k % 3 === 0
                    ? a >= 0 && a % b === 0
                      ? String(a / b)
                      : 'none'
                    : k % 3 === 1
                      ? `${p}/${b}`
                      : String(a - b);
        expect(checkAnswer(expected, q.answer), `${id}/${k}`).toBe(true);
        for (const v of q.answerChecks!.accepted)
          expect(checkAnswer(v, q.answer), `${id}/${k} accepts ${v}`).toBe(
            true,
          );
        for (const v of q.answerChecks!.rejected)
          expect(checkAnswer(v, q.answer), `${id}/${k} rejects ${v}`).toBe(
            false,
          );
        if (q.answer.kind === 'number')
          expect(exactRational(q.answer.value)).not.toBeNull();
        expect(j73ReviewQuestion(id, k + 80).answer).toEqual(q.answer);
      }
    for (const id of ['J73-L00', 'J73-L07', 'J72-L01', 'J73-L01-X'])
      expect(() => j73ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN, Infinity])
      expect(() => j73ReviewQuestion('J73-L01', n)).toThrow();
  });
});
