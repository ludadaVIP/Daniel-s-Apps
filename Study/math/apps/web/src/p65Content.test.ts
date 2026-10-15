import { describe, it, expect } from 'vitest';
import {
  p65Lessons,
  p65CheckQuestions,
  p65ReviewQuestion,
} from './content/P65';
import { lessons, curriculum, reviewQuestionFor, unitChecks } from './content';
import { checkAnswer, exactRational } from './model';
import {
  parseAffine,
  equivalentExpression,
  evaluateAffine,
  rational,
  textR,
  sameR,
  growingRows,
  algebraEquation,
  transformEquation,
  solveAlgebra,
  sameSolutions,
} from './algebraModels';
const markdown = import.meta.glob('../../../content/lessons/P65-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p65Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p65CheckQuestions,
];
const value = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
describe('P65 authored algebra and exact mathematics', () => {
  it('opens exactly the five planned titles with full bilingual examples and valid backwards prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P65')!;
    expect(p65Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.P65.questions).toHaveLength(8);
    for (const l of p65Lessons) {
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
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
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id} -> ${id}`).toBeTruthy();
        if (p.unit === 'P65') expect(p.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(all).toHaveLength(358);
    expect(
      all
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(new Set(p65Lessons.map((l) => l.lab)).size).toBe(5);
    expect(p65Lessons[4]!.familyChallenge!.en).toContain('no weighing');
  });
  it('validates all 48 items, independently entered answers, hints and manual evidence', () => {
    expect(items).toHaveLength(48);
    expect(new Set(items.map((q) => q.id)).size).toBe(48);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(27);
    expect(items.filter((q) => q.answer.kind === 'expression')).toHaveLength(9);
    expect(items.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
    for (const q of items) {
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
        expect(q.answer.rubric.en.length).toBeGreaterThan(140);
      } else {
        expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      for (const option of q.options ?? []) {
        expect(option.feedback.zh).toBeTruthy();
        expect(option.feedback.en).toBeTruthy();
      }
    }
    // Answers transcribed independently from stems, guided/Q2–Q5/exit.
    const answers = [
      ['11', '3', '-1', '15', '7', '-11'],
      ['62', '32', '5', '9', 'n+n+n+2', '47'],
      ['3n+6', 'n+n+n+2', '2n-8', '-n+10', '(n+6)/2', '4n+4'],
      ['5', '-3', '0.5', '0', '-4', '3.5'],
      ['3', '10', '-1/3', '2', '0', '-2.5'],
    ];
    p65Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(answers[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    ['-1', '29', '3n+6', '-3.5', '0.5', '0', 'n+n+n+n+n+1'].forEach((s, i) =>
      expect(checkAnswer(s, p65CheckQuestions[i]!.answer)).toBe(true),
    );
  });
  it('uses exact coefficient identities rather than a finite sample or string match', () => {
    for (const s of [
      '3n+6',
      'n+n+n+6',
      '3*(n+2)',
      '(n+2)*3',
      '3（n＋2）',
      '6+3×n',
      '3n+12/2',
      '(6n+12)/2',
    ])
      expect(equivalentExpression(s, '3(n+2)')).toBe(true);
    for (const s of [
      '3n+2',
      '5n',
      '15',
      '3(n+2)=15',
      '3(x+2)',
      '3N+6',
      'n*n',
      'n/n',
      '1/(n-n)',
      'n/0',
      'n/0.0',
      '3n+6 m',
      '3n+6%',
      '2 3n',
      '3**n',
      'Math.random()',
      '3(n+2',
      '3n+2)',
      '',
    ])
      expect(equivalentExpression(s, '3(n+2)'), s).toBe(false);
    expect(equivalentExpression('2n', 'n+1')).toBe(false); // coincide at n=1 only
    expect(equivalentExpression('n/2+3', '(n+6)/2')).toBe(true);
    expect(equivalentExpression('0.1n+0.2n', '3n/10')).toBe(true);
    expect(parseAffine('n'.repeat(181))).toBeNull();
    expect(parseAffine('x', 'xx')).toBeNull();
    expect(checkAnswer('3n+6', { kind: 'number', value: '15' })).toBe(false);
    expect(
      checkAnswer('3x+6', {
        kind: 'expression',
        value: '3(x+2)',
        variable: 'x',
      }),
    ).toBe(true);
  });
  it('independently checks linear expression arithmetic over signs, fractions and grouped forms', () => {
    for (let a = -5; a <= 5; a++)
      for (let b = -4; b <= 4; b++)
        for (let n = -6; n <= 6; n++) {
          const expression = parseAffine(`${a}(n+(${b}))/2`)!;
          expect(
            sameR(
              evaluateAffine(expression, rational(BigInt(n))),
              rational(BigInt(a * (n + b)), 2n),
            ),
          ).toBe(true);
          expect(
            equivalentExpression(`${a}(n+(${b}))/2`, `${a}n/2+(${a * b})/2`),
          ).toBe(true);
        }
    expect(textR(rational(0n, -5n))).toBe('0');
    expect(textR(rational(2n, -6n))).toBe('-1/3');
    expect(() => rational(1n, 0n)).toThrow();
  });
  it('counts the constructed nth term independently without mistaking an index for a total', () => {
    let previous = 0;
    for (let n = 1; n <= 120; n++) {
      const pieces = [
        ...Array.from({ length: 3 }, () =>
          Array.from({ length: n }, () => 1),
        ).flat(),
        1,
        1,
      ];
      const m = growingRows(n);
      expect(m.total).toBe(pieces.length);
      if (n > 1) expect(m.total - previous).toBe(3);
      previous = m.total;
    }
    expect(growingRows(20).total).toBe(62);
    expect(growingRows(10000).total).toBe(30002);
    for (const n of [0, -1, 1.5, 10001, NaN, Infinity])
      expect(() => growingRows(n)).toThrow();
  });
  it('preserves exactly the original rational solution under reversible equal operations', () => {
    for (let a = 1; a <= 5; a++)
      for (let b = -3; b <= 3; b++)
        for (let c = -5; c <= 5; c++) {
          const original = algebraEquation(`${a}(x+(${b}))`, String(c)),
            solution = solveAlgebra(original);
          expect(solution.kind).toBe('one');
          if (solution.kind !== 'one')
            throw new Error('Expected a unique solution');
          // Independently solve a(x+b)=c as (c-ab)/a and substitute.
          expect(
            sameR(solution.value, rational(BigInt(c - a * b), BigInt(a))),
          ).toBe(true);
          expect(
            sameR(
              evaluateAffine(original.left, solution.value),
              rational(BigInt(c)),
            ),
          ).toBe(true);
          const first = transformEquation(original, '÷', rational(BigInt(a))),
            second = transformEquation(first, '−', rational(BigInt(b)));
          expect(sameSolutions(original, first)).toBe(true);
          expect(sameSolutions(original, second)).toBe(true);
          expect(textR(second.left.a)).toBe('1');
          expect(textR(second.left.b)).toBe('0');
          for (const op of ['+', '−', '×', '÷'] as const) {
            const changed = transformEquation(original, op, rational(-3n, 2n));
            expect(sameSolutions(original, changed)).toBe(true);
          }
          const broken = transformEquation(original, '+', rational(1n), 'left');
          expect(sameSolutions(original, broken)).toBe(false);
        }
  });
  it('separates equal candidate values from solution-set equivalence and rejects zero factors', () => {
    const original = algebraEquation('2x', '10'),
      damaged = transformEquation(original, '÷', rational(2n), 'left');
    expect(
      sameR(
        evaluateAffine(damaged.left, rational(10n)),
        evaluateAffine(damaged.right, rational(10n)),
      ),
    ).toBe(true);
    expect(
      sameR(
        evaluateAffine(original.left, rational(10n)),
        evaluateAffine(original.right, rational(10n)),
      ),
    ).toBe(false);
    expect(sameSolutions(original, algebraEquation('0', '0'))).toBe(false);
    expect(solveAlgebra(algebraEquation('x', 'x')).kind).toBe('all');
    expect(solveAlgebra(algebraEquation('x+1', 'x')).kind).toBe('none');
    expect(
      sameSolutions(algebraEquation('x', 'x'), algebraEquation('0', '0')),
    ).toBe(true);
    for (const op of ['×', '÷'] as const)
      expect(() => transformEquation(original, op, rational(0n))).toThrow();
    expect(() => algebraEquation('x*x', '3')).toThrow();
  });
  it('independently evaluates 400 retrievals including constructed expressions and fractional solutions', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const a = 2 + (k % 4),
          b = 1 + (Math.floor(k / 4) % 5),
          n = -4 + (k % 13),
          q = p65ReviewQuestion(p65Lessons[i]!.id, k);
        if (q.answer.kind === 'number') {
          const expected =
            i === 0
              ? a * n + b
              : i === 1
                ? a * (1 + (k % 24)) + b
                : i === 3
                  ? n / a
                  : n / a - b;
          expect(value(q.answer.value), q.id).toBeCloseTo(expected, 12);
          if (i === 4)
            expect(a * (value(q.answer.value) + b)).toBeCloseTo(n, 12);
        } else if (q.answer.kind === 'expression') {
          const e = parseAffine(q.answer.value)!;
          expect(textR(e.a)).toBe(String(a));
          expect(textR(e.b)).toBe(String(a * b));
        } else throw new Error(q.id);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
        expect(q.id).toBe(`${p65Lessons[i]!.id}-R${k}`);
      }
    for (const n of [-1, 0.2, 100001, NaN])
      expect(() => p65ReviewQuestion('P65-L01', n)).toThrow();
    expect(() => p65ReviewQuestion('P65-L09', 0)).toThrow();
  });
});
