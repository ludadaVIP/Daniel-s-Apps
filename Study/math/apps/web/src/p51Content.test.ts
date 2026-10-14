import { describe, it, expect } from 'vitest';
import {
  p51Lessons,
  p51CheckQuestions,
  p51ReviewQuestion,
} from './content/P51';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  arithmeticTrace,
  wholeOperation,
  positiveFactors,
  factorPairs,
  positiveMultiples,
  trialDivision,
  numberKind,
  commonNumbers,
  mixedCases,
  orderCases,
  type ArithmeticToken,
} from './integerModels';
const markdown = import.meta.glob('../../../content/lessons/P51-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...p51Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p51CheckQuestions,
];
const factorsOracle = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).filter((d) =>
    Number.isInteger(n / d),
  );
const commonOracle = (a: number, b: number) => {
  const divisors = factorsOracle(a).filter((d) => Number.isInteger(b / d));
  let lcm = a;
  while (lcm % b !== 0) lcm += a;
  return { gcf: Math.max(...divisors), lcm };
};
describe('P51 complete authored content', () => {
  it('matches all five planned titles with independent bilingual examples and valid prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P51')!;
    expect(p51Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(p51Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p51Lessons) {
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
      for (const copy of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh, l.id).toBeTruthy();
        expect(copy.en, l.id).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const prior = [...lessons, ...p51Lessons].find((p) => p.id === id);
        expect(prior, `${l.id}→${id}`).toBeTruthy();
        if (prior!.unit === 'P51') expect(prior!.order).toBeLessThan(l.order!);
      }
    }
    expect(p51Lessons[4]!.familyChallenge!.en).toContain('No real purchase');
  });
  it('verifies all 48 items, equivalents and wrong answers, two hints, specific choice feedback and manual rubrics', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.id)).size).toBe(48);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(questions.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      6,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags!.length).toBeGreaterThan(0);
      for (const copy of [
        q.stem,
        ...q.hints,
        q.solution,
        ...q.solutionSteps!,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain')
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      else {
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id} accepts ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false),
        );
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently derives every numeric target from its arithmetic, factors or simultaneous conditions', () => {
    const oracle: Record<string, number> = {
      'P51-L01-G': 1200 + 36 * 25 - 480 / 6,
      'P51-L01-Q2': (3600 / 9) * 4 + 275,
      'P51-L01-Q3': 5000 - 18 * 125 + 840 / 7,
      'P51-L01-Q4': 0 * 875 + 2400 / 6,
      'P51-L01-Q5': 3000 - 18 * 125,
      'P51-L01-X': 2400 + 48 * 25 - 630 / 7,
      'P51-L02-G': 24 + 36 / 6,
      'P51-L02-Q2': (24 + 36) / 6,
      'P51-L02-Q3': 20 - 6 + 4,
      'P51-L02-Q4': 60 - (8 + 4) * 3,
      'P51-L02-Q5': 2 * 3 + (4 + 5),
      'P51-L02-X': (240 - 60) / 9 + 12 * 3,
      'P51-L03-G': 24 / 4,
      'P51-L03-Q2': 36 / 6,
      'P51-L03-Q3': 7 * 5,
      'P51-L03-Q4': factorsOracle(36).length,
      'P51-L03-Q5': 25 - 4 * 6,
      'P51-L03-X': 42 / 7,
      'P51-L04-G': factorsOracle(29).length,
      'P51-L04-Q2': factorsOracle(9).length,
      'P51-L04-Q3': 21 / 3,
      'P51-L04-Q4': [2, 3, 5, 7].length,
      'P51-L04-Q5': factorsOracle(49).length,
      'P51-L04-X': factorsOracle(31).length,
      'P51-L05-G': commonOracle(18, 24).gcf,
      'P51-L05-Q2': commonOracle(24, 36).gcf,
      'P51-L05-Q3': commonOracle(8, 12).lcm,
      'P51-L05-Q4': commonOracle(8, 9).gcf,
      'P51-L05-Q5': commonOracle(6, 6).lcm,
      'P51-L05-X': commonOracle(20, 30).gcf,
      'P51-CHECK-Q1': 1500 + 24 * 25 - 360 / 6,
      'P51-CHECK-Q2': (180 + 60) / 8,
      'P51-CHECK-Q3': 48 / 6,
      'P51-CHECK-Q4': factorsOracle(25).length,
      'P51-CHECK-Q6': commonOracle(16, 24).gcf,
      'P51-CHECK-Q7': commonOracle(6, 10).lcm,
    };
    const numeric = questions.filter((q) => q.answer.kind === 'number');
    expect(numeric.map((q) => q.id).sort()).toEqual(Object.keys(oracle).sort());
    numeric.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
    expect(checkAnswer('202000%', p51Lessons[0]!.guided.answer)).toBe(false);
  });
  it('keeps all array and common-list diagrams consistent with the requested quantity', () => {
    for (const q of questions) {
      const d = q.diagram;
      if (d?.kind === 'integer-array') {
        expect(d.hideColumns).toBe(true);
        expect(checkAnswer(String(d.n / d.rows), q.answer), q.id).toBe(true);
        expect(d.n % d.rows).toBe(0);
      } else if (d?.kind === 'integer-common') {
        const m = commonOracle(d.a, d.b);
        expect(
          checkAnswer(String(d.mode === 'factors' ? m.gcf : m.lcm), q.answer),
          q.id,
        ).toBe(true);
      }
    }
  });
  it('independently verifies 400 retrieval evaluations with parentheses, domains and new positive common values', () => {
    for (let k = 0; k < 80; k++)
      for (const l of p51Lessons) {
        const q = p51ReviewQuestion(l.id, k);
        let expected: number;
        if (l.order === 1) {
          const a = 1000 + 100 * (k % 20),
            b = 12 + (k % 25),
            c = 5 * (1 + (Math.floor(k / 4) % 5)),
            quotient = 10 + (k % 19);
          expected = a + b * c - quotient;
        } else if (l.order === 2) {
          const a = 20 + (k % 16),
            b = 2 + (k % 7),
            c = 2 + (Math.floor(k / 3) % 5);
          expected = k % 2 ? (a + b) * c : a + b * c;
        } else if (l.order === 3) {
          const rows = 2 + (k % 5),
            each = 3 + (Math.floor(k / 8) % 6);
          expected = k % 2 ? rows * each : each;
        } else if (l.order === 4)
          expected = factorsOracle(
            [1, 2, 9, 13, 15, 21, 25, 49][k % 8]!,
          ).length;
        else {
          const a = 1 + (k % 12),
            b = 1 + (Math.floor(k / 3) % 12),
            m = commonOracle(a, b);
          expected = k % 2 ? m.lcm : m.gcf;
        }
        expect(checkAnswer(String(expected), q.answer), q.id).toBe(true);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
        );
      }
    expect(() => p51ReviewQuestion('P51-L01', -1)).toThrow();
    expect(() => p51ReviewQuestion('P51-L01', 0.5)).toThrow();
    expect(() => p51ReviewQuestion('missing', 0)).toThrow();
  });
  it('accepts time duration aliases and other valid units without confusing time, length and bag count', () => {
    const time = p51Lessons[4]!.questions[2]!.answer;
    ['24 min', '24 mins', '24 minutes', '24分钟', '48/2 minutes'].forEach((a) =>
      expect(checkAnswer(a, time), a).toBe(true),
    );
    ['24 m', '24 bags', '0 min'].forEach((a) =>
      expect(checkAnswer(a, time), a).toBe(false),
    );
    expect(checkAnswer('6 bags', p51Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('6 cards', p51Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('750 NZD', p51Lessons[0]!.questions[4]!.answer)).toBe(
      true,
    );
  });
});
describe('P51 exact arithmetic and positive-number models', () => {
  it('keeps equal-level operations left-associative and resolves right-side brackets before outside products', () => {
    expect(mixedCases.map((c) => arithmeticTrace(c).result)).toEqual([
      2020, 1875, 2870, 400,
    ]);
    expect(orderCases.map((c) => arithmeticTrace(c.tokens).result)).toEqual([
      30, 10, 8, 18, 24, 15,
    ]);
    expect(
      arithmeticTrace([24, '÷', 6, '×', 2]).steps.map((s) => s.op),
    ).toEqual(['÷', '×']);
    expect(arithmeticTrace([20, '−', 6, '+', 4]).result).toBe(18);
    const right = arithmeticTrace([2, '×', 3, '+', '(', 4, '+', 5, ')']);
    expect(right.steps[0]).toMatchObject({
      op: '+',
      left: 4,
      right: 5,
      result: 9,
      depth: 1,
    });
    expect(right.steps[0]!.after).toBe('2 × 3 + 9');
    const nested = arithmeticTrace([
      2,
      '×',
      '(',
      3,
      '+',
      '(',
      4,
      '×',
      5,
      ')',
      ')',
    ]);
    expect(nested.steps.map((s) => s.result)).toEqual([20, 23, 46]);
  });
  it('matches independent arithmetic over generated whole expressions and verifies each replacement', () => {
    for (let a = 100; a <= 600; a += 100)
      for (let b = 0; b <= 8; b++)
        for (let c = 1; c <= 5; c++) {
          const tokens: ArithmeticToken[] = [
              a,
              '+',
              b,
              '×',
              c,
              '−',
              24,
              '÷',
              6,
            ],
            m = arithmeticTrace(tokens);
          expect(m.result).toBe(a + b * c - 4);
          m.steps.forEach((s) => {
            const independent =
              s.op === '+'
                ? s.left + s.right
                : s.op === '−'
                  ? s.left - s.right
                  : s.op === '×'
                    ? s.left * s.right
                    : s.left / s.right;
            expect(s.result).toBe(independent);
            expect(s.after).not.toBe(s.before);
          });
          expect(m.steps.at(-1)!.after).toBe(String(m.result));
        }
  });
  it('rejects malformed expressions, zero divisors, nonwhole quotients and invalid ranges without truncation', () => {
    expect(() => arithmeticTrace([24, '÷', 0])).toThrow();
    expect(() => arithmeticTrace([24, '÷', 5])).toThrow();
    expect(() => arithmeticTrace(['(', 2, '+', 3])).toThrow();
    expect(() => arithmeticTrace([2, 3])).toThrow();
    expect(() => arithmeticTrace([2, '+'])).toThrow();
    expect(() => arithmeticTrace([-1, '+', 2])).toThrow();
    expect(() => arithmeticTrace([2, '−', 3])).toThrow();
    expect(() => arithmeticTrace([])).toThrow();
    expect(wholeOperation('×', 0, 875)).toBe(0);
    expect(wholeOperation('−', 6, 6)).toBe(0);
  });
  it('enumerates all positive factors and unique pairs, keeping square roots once and positive multiples starting above zero', () => {
    for (let n = 1; n <= 60; n++) {
      expect(positiveFactors(n)).toEqual(factorsOracle(n));
      const pairs = factorPairs(n);
      expect(pairs.every((p) => p.a * p.b === n && p.a <= p.b)).toBe(true);
      expect(
        [...new Set(pairs.flatMap((p) => [p.a, p.b]))].sort((a, b) => a - b),
      ).toEqual(factorsOracle(n));
      expect(positiveMultiples(n)).toEqual(
        Array.from({ length: 8 }, (_, i) => n * (i + 1)),
      );
    }
    expect(positiveFactors(36)).toHaveLength(9);
    expect(factorPairs(36).filter((p) => p.a === p.b)).toEqual([
      { a: 6, b: 6 },
    ]);
    expect(positiveFactors(1)).toEqual([1]);
    expect(() => positiveFactors(0)).toThrow();
    expect(() => positiveMultiples(0)).toThrow();
  });
  it('preserves every remainder in trial division, including zero and incomplete groups', () => {
    for (let n = 0; n <= 60; n++)
      for (let d = 1; d <= 60; d++) {
        const m = trialDivision(n, d);
        expect(d * m.quotient + m.remainder).toBe(n);
        expect(m.remainder).toBeGreaterThanOrEqual(0);
        expect(m.remainder).toBeLessThan(d);
        expect(m.divides).toBe(n % d === 0);
      }
    expect(trialDivision(49, 2)).toMatchObject({
      quotient: 24,
      remainder: 1,
      divides: false,
    });
    expect(trialDivision(49, 7)).toMatchObject({
      quotient: 7,
      remainder: 0,
      divides: true,
    });
    expect(() => trialDivision(25, 0)).toThrow();
  });
  it('classifies every integer zero through sixty against an independently specified prime set', () => {
    const primes = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
    ];
    for (let n = 0; n <= 60; n++)
      expect(numberKind(n), String(n)).toBe(
        n < 2 ? 'neither' : primes.includes(n) ? 'prime' : 'composite',
      );
    expect(() => numberKind(-1)).toThrow();
  });
  it('finds greatest common factors and least positive common multiples against independent bounded searches', () => {
    for (let a = 1; a <= 60; a++)
      for (let b = 1; b <= 60; b++) {
        const m = commonNumbers(a, b),
          oracle = commonOracle(a, b);
        expect(m.gcf).toBe(oracle.gcf);
        expect(m.lcm).toBe(oracle.lcm);
        expect(m.lcm % a).toBe(0);
        expect(m.lcm % b).toBe(0);
        expect(m.gcf * m.lcm).toBe(a * b);
      }
    expect(commonNumbers(11, 12).visibleCommon).toEqual([]);
    expect(commonNumbers(11, 12).lcm).toBe(132);
    expect(commonNumbers(6, 6)).toMatchObject({ gcf: 6, lcm: 6 });
    expect(commonNumbers(8, 9).gcf).toBe(1);
    expect(() => commonNumbers(0, 12)).toThrow();
  });
});
