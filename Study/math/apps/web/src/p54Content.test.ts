import { describe, it, expect } from 'vitest';
import {
  p54Lessons,
  p54CheckQuestions,
  p54ReviewQuestion,
} from './content/P54';
import { lessons, curriculum } from './content';
import { checkAnswer, type AnswerSpec } from './model';
import {
  fractionOperation,
  commonDenominatorChoices,
  fractionStories,
} from './fractionOperationModels';
const markdown = import.meta.glob('../../../content/lessons/P54-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...p54Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p54CheckQuestions,
];
const parse = (s: string) => {
  const [n, d = '1'] = s.split('/');
  return { n: Number(n), d: Number(d) };
};
const oracle = (a: number, b: number, c: number, d: number, op: string) => ({
  n: a * d + (op === '+' ? 1 : -1) * c * b,
  d: b * d,
});
const least = (a: number, b: number) => {
  let n = a;
  while (n % b) n += a;
  return n;
};
const gcd = (a: number, b: number) => {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
const relaxed = (spec: AnswerSpec): AnswerSpec =>
  spec.kind === 'number'
    ? {
        ...spec,
        fractionRule: undefined,
        requiredDenominator: undefined,
        formats: undefined,
      }
    : spec;
// Independently transcribed operands; answers are derived here without the workshop model.
const operands: Record<string, [number, number, number, number, string]> = {
  'P54-L01-G': [3, 8, 2, 8, '+'],
  'P54-L01-Q2': [1, 6, 3, 6, '+'],
  'P54-L01-Q3': [5, 8, 7, 8, '+'],
  'P54-L01-Q4': [2, 5, 1, 5, '+'],
  'P54-L01-Q5': [0, 9, 4, 9, '+'],
  'P54-L01-X': [3, 4, 3, 4, '+'],
  'P54-L02-G': [7, 8, 3, 8, '−'],
  'P54-L02-Q2': [5, 6, 1, 6, '−'],
  'P54-L02-Q3': [9, 8, 5, 8, '−'],
  'P54-L02-Q4': [3, 7, 3, 7, '−'],
  'P54-L02-Q5': [5, 5, 2, 5, '−'],
  'P54-L02-X': [11, 10, 3, 10, '−'],
  'P54-L03-G': [2, 3, 1, 4, '+'],
  'P54-L03-Q2': [1, 2, 1, 3, '+'],
  'P54-L03-Q3': [3, 4, 2, 3, '+'],
  'P54-L03-Q4': [1, 4, 1, 6, '+'],
  'P54-L03-Q5': [2, 5, 1, 10, '+'],
  'P54-L03-X': [1, 2, 1, 4, '+'],
  'P54-L04-G': [3, 4, 1, 6, '−'],
  'P54-L04-Q2': [5, 6, 1, 4, '−'],
  'P54-L04-Q3': [7, 6, 3, 4, '−'],
  'P54-L04-Q4': [2, 3, 4, 6, '−'],
  'P54-L04-Q5': [1, 1, 3, 8, '−'],
  'P54-L04-X': [4, 5, 1, 2, '−'],
  'P54-L05-G': [3, 4, 2, 3, '+'],
  'P54-L05-Q2': [5, 6, 1, 4, '−'],
  'P54-L05-Q3': [17, 12, 1, 2, '−'],
  'P54-L05-Q4': [3, 4, 1, 2, '−'],
  'P54-L05-Q5': [1, 3, 1, 6, '+'],
  'P54-L05-X': [1, 1, 7, 12, '−'],
  'P54-CHECK-Q1': [3, 10, 4, 10, '+'],
  'P54-CHECK-Q2': [13, 12, 5, 12, '−'],
  'P54-CHECK-Q3': [2, 3, 1, 6, '+'],
  'P54-CHECK-Q4': [7, 8, 1, 3, '−'],
  'P54-CHECK-Q6': [5, 6, 1, 2, '+'],
  'P54-CHECK-Q7': [1, 1, 7, 12, '−'],
};
describe('P54 authored content and independent mathematics', () => {
  it('matches the five planned titles with complete bilingual teaching and backward prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P54')!;
    expect(p54Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(p54Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p54Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = [...lessons, ...p54Lessons].find((p) => p.id === id);
        expect(p, `${l.id}→${id}`).toBeTruthy();
        if (p!.unit === 'P54') expect(p!.order).toBeLessThan(l.order!);
      }
    }
    expect(p54Lessons[4]!.familyChallenge!.en).toContain('No real purchase');
  });
  it('checks all 48 items and all authored accepted/rejected forms, hints, feedback and manual reasoning', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.id)).size).toBe(48);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      6,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags).toContain(q.skill);
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
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
        continue;
      }
      expect(q.answerChecks!.accepted.length).toBeGreaterThan(0);
      q.answerChecks!.accepted.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id} accepted ${v}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id} rejected ${v}`).toBe(false),
      );
      if (q.answer.kind === 'choice')
        q.options!.forEach((o) => {
          expect(o.feedback.zh).toBeTruthy();
          expect(o.feedback.en).toBeTruthy();
        });
    }
  });
  it('derives the 36 numeric answers from independent rational arithmetic and retains two-step story evidence', () => {
    for (const q of questions) {
      if (q.answer.kind !== 'number') continue;
      const data = operands[q.id]!;
      expect(data, q.id).toBeTruthy();
      const expected = oracle(...data),
        answer = parse(q.answer.value);
      expect(answer.n * expected.d, q.id).toBe(expected.n * answer.d);
    }
    const two = p54Lessons[4]!.questions[2]!;
    expect(two.solution.en).toContain('17/12 L');
    expect(two.solution.en).toContain('11/12 L');
    expect(p54Lessons[4]!.exit.solution.en).toContain('7/12 L');
  });
  it('distinguishes correct quantity from requested simplest or specified-denominator representation', () => {
    const simplest = p54Lessons[1]!.guided.answer;
    expect(checkAnswer('4/8', simplest)).toBe(false);
    expect(checkAnswer('4/8', relaxed(simplest))).toBe(true);
    expect(checkAnswer('1/2', simplest)).toBe(true);
    const specified = p54Lessons[2]!.questions[3]!.answer;
    expect(checkAnswer('5/12', specified)).toBe(false);
    expect(checkAnswer('5/12', relaxed(specified))).toBe(true);
    expect(checkAnswer('10/24', specified)).toBe(true);
    expect(p54Lessons[2]!.questions[3]!.solution.en).toContain('6/24');
    const zero = p54Lessons[3]!.questions[3]!.answer;
    expect(checkAnswer('0', zero)).toBe(true);
    expect(checkAnswer('0/1', zero)).toBe(true);
    expect(checkAnswer('0/0', zero)).toBe(false);
  });
  it('accepts appropriate bilingual measurement suffixes and rejects mismatched units and percentages', () => {
    const litres = p54Lessons[4]!.guided.answer;
    for (const value of ['17/12 L', '17/12 litres', '17/12 升'])
      expect(checkAnswer(value, litres)).toBe(true);
    for (const value of ['17/12 m', '17/12 km', '141.6666667%'])
      expect(checkAnswer(value, litres)).toBe(false);
    const length = p54Lessons[3]!.questions[4]!.answer;
    expect(checkAnswer('5/8 米', length)).toBe(true);
    expect(checkAnswer('5/8 L', length)).toBe(false);
    const money = p54Lessons[4]!.questions[3]!.answer;
    expect(checkAnswer('NZ$1/4', money)).toBe(true);
    expect(checkAnswer('1/4 L', money)).toBe(false);
  });
  it('independently verifies 400 retrieval evaluations with changed quantities, signs, units and cleared identity', () => {
    for (const l of p54Lessons) {
      expect(p54ReviewQuestion(l.id, 0).stem).not.toEqual(
        p54ReviewQuestion(l.id, 1).stem,
      );
      for (let round = 0; round < 80; round++) {
        const q = p54ReviewQuestion(l.id, round);
        expect(q.id).toBe(`${l.id}-R${round}`);
        expect(q.lessonId).toBe(l.id);
        const matches = [...q.stem.en.matchAll(/(\d+)\/(\d+)/g)];
        expect(matches).toHaveLength(2);
        const [a, b] = matches;
        const op =
          q.stem.en.includes('−') || q.stem.en.includes('remains') ? '−' : '+';
        const expected = oracle(
          Number(a![1]),
          Number(a![2]),
          Number(b![1]),
          Number(b![2]),
          op,
        );
        const answer = parse(
          (q.answer as Extract<AnswerSpec, { kind: 'number' }>).value,
        );
        expect(answer.n * expected.d).toBe(expected.n * answer.d);
        q.answerChecks!.accepted.forEach((v) =>
          expect(checkAnswer(v, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((v) =>
          expect(checkAnswer(v, q.answer), q.id).toBe(false),
        );
      }
    }
    for (const round of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
      expect(() => p54ReviewQuestion('P54-L01', round)).toThrow();
    expect(() => p54ReviewQuestion('P54-L09', 0)).toThrow();
  });
});
describe('P54 exact workshop mathematics', () => {
  it('covers every bounded denominator and numerator, zero, improper sums and add-back differences with an independent oracle', () => {
    for (let da = 1; da <= 12; da++)
      for (let db = 1; db <= 12; db++)
        for (let a = 0; a <= 2 * da; a++)
          for (let b = 0; b <= 2 * db; b++) {
            const left = { n: a, d: da },
              right = { n: b, d: db };
            for (const op of ['+', '−'] as const) {
              const e = oracle(a, da, b, db, op);
              if (e.n < 0) {
                expect(() => fractionOperation(left, right, op)).toThrow();
                continue;
              }
              const m = fractionOperation(left, right, op);
              expect(m.least).toBe(least(da, db));
              expect(m.raw.n * e.d).toBe(e.n * m.raw.d);
              expect(m.simplest.n * e.d).toBe(e.n * m.simplest.d);
              expect(gcd(m.simplest.n, m.simplest.d)).toBe(1);
              expect(m.left.n * da).toBe(a * m.left.d);
              expect(m.right.n * db).toBe(b * m.right.d);
              const check =
                op === '−' ? m.raw.n + m.right.n : m.raw.n - m.right.n;
              expect(check).toBe(m.left.n);
            }
          }
  });
  it('validates alternative common denominators and does not silently swap or clamp illegal inputs', () => {
    const a = { n: 2, d: 3 },
      b = { n: 1, d: 4 };
    const m = fractionOperation(a, b, '+', 24);
    expect(m.raw).toEqual({ n: 22, d: 24 });
    expect(m.simplest).toEqual({ n: 11, d: 12 });
    for (let da = 1; da <= 12; da++)
      for (let db = 1; db <= 12; db++) {
        const a = { n: 1, d: da },
          b = { n: 1, d: db };
        for (const d of commonDenominatorChoices(a, b)) {
          if (d % da || d % db)
            expect(() => fractionOperation(a, b, '+', d)).toThrow();
          else {
            const m = fractionOperation(a, b, '+', d);
            expect(m.left.n * da).toBe(d);
            expect(m.right.n * db).toBe(d);
          }
        }
      }
    for (const d of [0, 7, 12.5, 289])
      expect(() => fractionOperation(a, b, '+', d)).toThrow();
    for (const a of [
      { n: -1, d: 3 },
      { n: 7, d: 3 },
      { n: 1, d: 0 },
      { n: 1, d: 13 },
      { n: NaN, d: 3 },
    ])
      expect(() => fractionOperation(a, b, '+')).toThrow();
    expect(() => fractionOperation({ n: 0, d: 3 }, b, '−')).toThrow();
    expect(() => fractionOperation(a, b, '×' as '+')).toThrow();
  });
  it('uses shared litre/metre/dollar reference units in all four story contexts and retains exact zero', () => {
    expect(
      fractionStories.map(
        (s) => fractionOperation(s.left, s.right, s.operation).simplest,
      ),
    ).toEqual([
      { n: 17, d: 12 },
      { n: 7, d: 12 },
      { n: 3, d: 4 },
      { n: 0, d: 1 },
    ]);
    expect(fractionStories[0]!.stem.en).toContain('not one jug');
  });
});
