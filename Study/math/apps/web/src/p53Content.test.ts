import { describe, it, expect } from 'vitest';
import {
  p53Lessons,
  p53CheckQuestions,
  p53ReviewQuestion,
} from './content/P53';
import { lessons } from './content';
import { checkAnswer, type AnswerSpec } from './model';
import {
  fractionValue,
  fractionGcd,
  simplifyFraction,
  commonFractionFactors,
  divideFraction,
  refineFraction,
  fractionWholes,
  mixedFraction,
  improperFraction,
  compareFractions,
  commonDenominator,
} from './fractionModels';
const markdown = import.meta.glob('../../../content/lessons/P53-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...p53Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p53CheckQuestions,
];
const relaxed = (spec: AnswerSpec): AnswerSpec =>
  spec.kind === 'number'
    ? {
        ...spec,
        fractionRule: undefined,
        requiredDenominator: undefined,
        formats: undefined,
      }
    : spec;
describe('P53 complete content and independent mathematical review', () => {
  it('implements the six planned lessons with two original examples and usable prerequisites', () => {
    expect(p53Lessons.map((l) => l.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `P53-L0${i + 1}`),
    );
    expect(new Set(p53Lessons.map((l) => l.lab)).size).toBe(6);
    for (const l of p53Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.stage).toBe('P05');
      expect(l.unit).toBe('P53');
      expect(l.keywords).toHaveLength(3);
      expect(l.questions.length).toBe(l.order === 4 ? 7 : 6);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice').length,
      ).toBeLessThan(l.questions.length / 2);
      expect(l.questions.some((q) => q.answer.kind === 'explain')).toBe(true);
      [
        l.title,
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.keywords,
        ...l.parent.prompts,
      ].forEach((v) => {
        expect(v.zh).toBeTruthy();
        expect(v.en).toBeTruthy();
      });
      [...l.prerequisites, l.parent.bridge].forEach((id) =>
        expect(
          [...lessons, ...p53Lessons].some(
            (p) => p.id === id && (p.unit !== 'P53' || p.order! < l.order!),
          ),
          `${l.id}: ${id}`,
        ).toBe(true),
      );
    }
    expect(p53Lessons[5]!.familyChallenge!.en).toContain('New Zealand');
    expect(p53CheckQuestions).toHaveLength(8);
  });
  it('checks all 57 questions against authored accepted forms, common wrong answers and bilingual feedback', () => {
    expect(questions).toHaveLength(57);
    expect(new Set(questions.map((q) => q.id)).size).toBe(57);
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.difficulty).toBeTruthy();
      expect(q.misconceptionTags).toContain(q.skill);
      [q.stem, q.solution, ...q.hints, ...q.solutionSteps!].forEach((v) => {
        expect(v.zh).toBeTruthy();
        expect(v.en).toBeTruthy();
      });
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        continue;
      }
      q.answerChecks!.accepted.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id} accepts ${a}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false),
      );
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently verifies all 41 numeric quantities regardless of the requested representation', () => {
    const oracle: Record<string, string> = {
      'P53-L01-G': '1/6',
      'P53-L01-Q2': '1/8',
      'P53-L01-Q3': '1/5',
      'P53-L01-Q4': String(12 / 6),
      'P53-L01-Q5': String(12 / 2),
      'P53-L01-X': '1/8',
      'P53-L02-G': '5/2',
      'P53-L02-Q2': String(Math.floor(7 / 3)),
      'P53-L02-Q3': '5/4',
      'P53-L02-Q4': String(Math.ceil(9 / 4)),
      'P53-L02-Q5': '8/3',
      'P53-L02-X': '7/5',
      'P53-L03-G': '11/4',
      'P53-L03-Q2': `${2 * 5 + 2}/5`,
      'P53-L03-Q3': '13/6',
      'P53-L03-Q4': `${3 * 4 + 1}/4`,
      'P53-L03-Q5': '9/2',
      'P53-L03-X': '8/3',
      'P53-L04-G': String(2 * 2),
      'P53-L04-Q2': String(2 * 4),
      'P53-L04-Q3': String(4 * 3),
      'P53-L04-Q4': '4/10',
      'P53-L04-X': '2/3',
      'P53-L05-G': '12/18',
      'P53-L05-Q2': '8/12',
      'P53-L05-Q3': '10/15',
      'P53-L05-Q4': '16/20',
      'P53-L05-Q5': '9/12',
      'P53-L05-X': '15/20',
      'P53-L06-G': String(3 * 3),
      'P53-L06-Q2': String(5 * 2),
      'P53-L06-Q3': '7/10',
      'P53-L06-Q4': '36',
      'P53-L06-Q5': '2/3',
      'P53-L06-X': '5/8',
      'P53-CHECK-Q1': '1/7',
      'P53-CHECK-Q3': '9/4',
      'P53-CHECK-Q4': `${2 * 5 + 1}/5`,
      'P53-CHECK-Q5': String(3 * 4),
      'P53-CHECK-Q6': '18/24',
      'P53-CHECK-Q7': '7/10',
    };
    const numeric = questions.filter((q) => q.answer.kind === 'number');
    expect(numeric).toHaveLength(Object.keys(oracle).length);
    numeric.forEach((q) =>
      expect(checkAnswer(oracle[q.id]!, relaxed(q.answer)), q.id).toBe(true),
    );
    expect(3 * 4).toBeGreaterThan(2 * 5);
    expect(7 * 3).toBeGreaterThan(2 * 10);
    expect(5 * 12).toBeGreaterThan(7 * 8);
  });
  it('validates 480 bounded review rounds, forms and independently computed values', () => {
    for (let k = 0; k < 80; k++)
      for (const l of p53Lessons) {
        const q = p53ReviewQuestion(l.id, k);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}:${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}:${a}`).toBe(false),
        );
        let value = '';
        if (l.order === 1) value = `1/${2 + (k % 7)}`;
        if (l.order === 2) {
          const d = 2 + (k % 5),
            n = k % 8 === 7 ? d : d + 1 + (k % 6);
          value = k % 2 ? String(Math.floor(n / d)) : `${n}/${d}`;
        }
        if (l.order === 3) {
          const d = 2 + (k % 5);
          value = `${(1 + (k % 3)) * d + 1 + (k % (d - 1))}/${d}`;
        }
        if (l.order === 4)
          value = String((k % 2 ? 4 + (k % 3) : 1 + (k % 3)) * (2 + (k % 4)));
        if (l.order === 5) value = `${2 + (k % 4)}/${3 + (k % 5)}`;
        if (l.order === 6) {
          const a = { n: 1 + (k % 2), d: 3 + (k % 4) },
            b = { n: 1 + ((k + 2) % 3), d: 4 + (k % 5) };
          if (k % 2)
            value = a.n * b.d >= b.n * a.d ? `${a.n}/${a.d}` : `${b.n}/${b.d}`;
          else {
            let denominator = Math.max(a.d, b.d);
            while (denominator % a.d || denominator % b.d) denominator++;
            value = String(denominator);
          }
        }
        expect(checkAnswer(value, relaxed(q.answer)), q.id).toBe(true);
      }
    expect(p53ReviewQuestion('P53-L03', 80).answer).toEqual(
      p53ReviewQuestion('P53-L03', 0).answer,
    );
    expect(() => p53ReviewQuestion('missing', 0)).toThrow();
    expect(() => p53ReviewQuestion('P53-L01', -1)).toThrow();
  });
});
describe('fraction form rules and exact model invariants', () => {
  it('accepts equivalent values freely when no representation rule was requested', () => {
    for (const input of ['2/4', '0.5', '50%', '1/2'])
      expect(checkAnswer(input, { kind: 'number', value: '1/2' })).toBe(true);
    for (const input of ['2 1/3', '2 2/6', '7/3'])
      expect(checkAnswer(input, { kind: 'number', value: '7/3' })).toBe(true);
  });
  it('enforces a unit numerator and explicitly requested denominator independently of value equivalence', () => {
    expect(
      checkAnswer('1／6', {
        kind: 'number',
        value: '1/6',
        fractionRule: 'unit',
      }),
    ).toBe(true);
    expect(
      checkAnswer('2/12', {
        kind: 'number',
        value: '1/6',
        fractionRule: 'unit',
      }),
    ).toBe(false);
    expect(
      checkAnswer('4/10', {
        kind: 'number',
        value: '2/5',
        requiredDenominator: 10,
      }),
    ).toBe(true);
    expect(
      checkAnswer('2/5', {
        kind: 'number',
        value: '2/5',
        requiredDenominator: 10,
      }),
    ).toBe(false);
    expect(
      checkAnswer('1/0', {
        kind: 'number',
        value: '1/6',
        fractionRule: 'unit',
      }),
    ).toBe(false);
    expect(
      checkAnswer('1/6', {
        kind: 'number',
        value: '1/6',
        requiredDenominator: Infinity,
      }),
    ).toBe(false);
  });
  it('separates mixed and improper forms while handling integral boundaries and invalid remainders', () => {
    const mixed: AnswerSpec = {
      kind: 'number',
      value: '11/4',
      fractionRule: 'mixed',
    };
    expect(checkAnswer('2 6/8', mixed)).toBe(true);
    expect(checkAnswer('11/4', mixed)).toBe(false);
    expect(checkAnswer('2.75', mixed)).toBe(false);
    expect(checkAnswer('1 7/4', mixed)).toBe(false);
    expect(checkAnswer('2 3/0', mixed)).toBe(false);
    expect(
      checkAnswer('2', { kind: 'number', value: '8/4', fractionRule: 'mixed' }),
    ).toBe(true);
    expect(
      checkAnswer('2 0/4', {
        kind: 'number',
        value: '8/4',
        fractionRule: 'mixed',
      }),
    ).toBe(false);
    expect(
      checkAnswer('5/5', {
        kind: 'number',
        value: '1',
        fractionRule: 'improper',
      }),
    ).toBe(true);
    expect(
      checkAnswer('1', {
        kind: 'number',
        value: '1',
        fractionRule: 'improper',
      }),
    ).toBe(false);
    expect(
      checkAnswer('2 1/3 L', {
        kind: 'number',
        value: '7/3',
        fractionRule: 'mixed',
        unit: 'L',
      }),
    ).toBe(true);
    expect(
      checkAnswer('2 1/3 m', {
        kind: 'number',
        value: '7/3',
        fractionRule: 'mixed',
        unit: 'L',
      }),
    ).toBe(false);
  });
  it('requires coprime simplest fractions while allowing integer and zero results', () => {
    const spec: AnswerSpec = {
      kind: 'number',
      value: '12/18',
      fractionRule: 'simplest',
    };
    expect(checkAnswer('2/3', spec)).toBe(true);
    expect(checkAnswer('6/9', spec)).toBe(false);
    expect(checkAnswer('12/18', spec)).toBe(false);
    expect(
      checkAnswer('1', {
        kind: 'number',
        value: '18/18',
        fractionRule: 'simplest',
      }),
    ).toBe(true);
    expect(
      checkAnswer('1/1', {
        kind: 'number',
        value: '18/18',
        fractionRule: 'simplest',
      }),
    ).toBe(true);
    expect(
      checkAnswer('0/1', {
        kind: 'number',
        value: '0',
        fractionRule: 'simplest',
      }),
    ).toBe(true);
    expect(
      checkAnswer('0/6', {
        kind: 'number',
        value: '0',
        fractionRule: 'simplest',
      }),
    ).toBe(false);
  });
  it('conserves selected parts across multiple whole strips and mixed conversions', () => {
    for (let d = 2; d <= 8; d++)
      for (let n = 0; n <= 18; n++) {
        const value = { n, d },
          wholes = fractionWholes(value),
          mixed = mixedFraction(value);
        expect(wholes.reduce((sum, w) => sum + w.n, 0)).toBe(n);
        expect(wholes.every((w) => w.d === d && w.n <= d)).toBe(true);
        expect(improperFraction(mixed.whole, mixed.n, d)).toEqual(value);
      }
    expect(() => fractionValue(1, 0)).toThrow();
    expect(() => fractionValue(-1, 4)).toThrow();
    expect(() => improperFraction(1, 4, 4)).toThrow();
  });
  it('preserves equal shading through every refinement and legal regrouping', () => {
    for (let d = 2; d <= 24; d++)
      for (let n = 0; n <= d; n++) {
        const original = { n, d };
        for (let factor = 1; factor <= 4; factor++) {
          const fine = refineFraction(original, factor);
          expect(fine.n * d).toBe(n * fine.d);
        }
        for (const factor of commonFractionFactors(original)) {
          const reduced = divideFraction(original, factor);
          expect(reduced.n * d).toBe(n * reduced.d);
        }
        const simplest = simplifyFraction(original);
        expect(simplest.n * d).toBe(n * simplest.d);
        expect(fractionGcd(simplest.n, simplest.d)).toBe(1);
      }
    expect(() => divideFraction({ n: 12, d: 18 }, 5)).toThrow();
    expect(() => refineFraction({ n: 1, d: 2 }, 0)).toThrow();
  });
  it('uses the least common denominator and exact order, including equivalent pairs', () => {
    expect(commonDenominator({ n: 4, d: 9 }, { n: 5, d: 12 })).toEqual({
      d: 36,
      left: { n: 16, d: 36 },
      right: { n: 15, d: 36 },
    });
    expect(compareFractions({ n: 2, d: 3 }, { n: 4, d: 6 })).toBe(0);
    for (let a = 2; a <= 8; a++)
      for (let b = 2; b <= 8; b++) {
        const m = commonDenominator({ n: 1, d: a }, { n: 1, d: b });
        expect(m.d % a).toBe(0);
        expect(m.d % b).toBe(0);
        expect(
          Array.from({ length: m.d - 1 }, (_, i) => i + 1).some(
            (d) => d % a === 0 && d % b === 0,
          ),
        ).toBe(false);
        expect(m.left.n * a).toBe(m.d);
        expect(m.right.n * b).toBe(m.d);
        expect(compareFractions(m.left, m.right)).toBe(
          compareFractions({ n: 1, d: a }, { n: 1, d: b }),
        );
      }
  });
});
