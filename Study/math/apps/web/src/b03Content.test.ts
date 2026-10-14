import { describe, it, expect } from 'vitest';
import {
  b03Lessons,
  b03CheckQuestions,
  b03ReviewQuestion,
} from './content/B03';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  columnCalculation,
  splitProduct,
  areaProduct,
  longDivision,
  estimateCalculation,
} from './calculationModels';
const markdown = import.meta.glob('../../../content/lessons/B03-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...b03Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...b03CheckQuestions,
];
describe('B03 full unit teaching contract', () => {
  it('matches the plan with bilingual examples, progression, support and a family challenge', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'B03')!;
    expect(b03Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(b03Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of b03Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.stage).toBe('B00');
      expect(l.unit).toBe('B03');
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
        l.title,
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh).toBeTruthy();
        expect(copy.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = [...lessons, ...b03Lessons].find((p) => p.id === id);
        expect(p, `${l.id}: ${id}`).toBeTruthy();
        if (p!.unit === 'B03') expect(p!.order).toBeLessThan(l.order!);
      }
    }
    expect(b03Lessons[4]!.familyChallenge!.en).toContain('NZ$50');
  });
  it('checks all 48 items, two-level hints, rejected misconceptions and manual reasoning', () => {
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
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain')
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      else {
        expect(q.answerChecks!.accepted.length).toBeGreaterThan(0);
        expect(q.answerChecks!.rejected.length).toBeGreaterThan(0);
        for (const a of q.answerChecks!.accepted)
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
        for (const a of q.answerChecks!.rejected)
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false);
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently derives every numeric scenario, including requested estimates rather than exact answers', () => {
    const oracle: Record<string, number> = {
      'B03-L01-G': 268 + 157,
      'B03-L01-Q2': 408 - 179,
      'B03-L01-Q3': 1000 - 1,
      'B03-L01-Q4': 999 + 1,
      'B03-L01-Q5': 126 + 287,
      'B03-L01-X': 502 - 268,
      'B03-L02-G': 6 * 8,
      'B03-L02-Q2': 8 * 7,
      'B03-L02-Q3': 4 * 3,
      'B03-L02-Q4': 27 * 2,
      'B03-L02-Q5': 5 * 12,
      'B03-L02-X': 8 * 9,
      'B03-L03-G': 23 * 14,
      'B03-L03-Q2': 32 * 21,
      'B03-L03-Q3': 24 * 13,
      'B03-L03-Q4': 40 * 12,
      'B03-L03-Q5': 18 * 25,
      'B03-L03-X': 31 * 12,
      'B03-L04-G': 936 / 12,
      'B03-L04-Q2': 408 / 4,
      'B03-L04-Q3': Math.floor(235 / 6),
      'B03-L04-Q4': 235 % 6,
      'B03-L04-Q5': 0 / 6,
      'B03-L04-X': 574 / 7,
      'B03-L05-G': 300 + 400,
      'B03-L05-Q2': 800 - 400,
      'B03-L05-Q3': 20 * 20,
      'B03-L05-Q4': 30 * 20,
      'B03-L05-Q5': 200 + 300,
      'B03-L05-X': 50 * 20,
      'B03-CHECK-Q1': 298 + 403,
      'B03-CHECK-Q2': 502 - 268,
      'B03-CHECK-Q4': 31 * 12,
      'B03-CHECK-Q5': 408 / 4,
      'B03-CHECK-Q6': 317 - 8 * 39,
      'B03-CHECK-Q7': 400 + 200,
    };
    const numeric = questions.filter((q) => q.answer.kind === 'number');
    expect(numeric.map((q) => q.id).sort()).toEqual(Object.keys(oracle).sort());
    numeric.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
    expect(checkAnswer('701', b03Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('700', b03CheckQuestions[0]!.answer)).toBe(false);
  });
  it('verifies 400 review evaluations including changing answer roles and a bounded eighty-round cycle', () => {
    for (let k = 0; k < 80; k++)
      for (const l of b03Lessons) {
        const q = b03ReviewQuestion(l.id, k);
        let expected: number;
        if (l.order === 1)
          expected =
            k % 2 === 0
              ? 208 + 17 * k + 157 + 9 * (k % 8)
              : 1000 + 10 * k - (1 + 13 * (k % 19));
        else if (l.order === 2)
          expected = (2 + (k % 8)) * (3 + (Math.floor(k / 8) % 8));
        else if (l.order === 3)
          expected = (12 + (k % 28)) * (11 + (Math.floor(k / 7) % 19));
        else if (l.order === 4)
          expected = k % 2 === 0 ? 20 + k : k % (2 + (k % 11));
        else {
          const form = k % 3,
            a =
              form === 0
                ? 198 + 11 * k
                : form === 1
                  ? 12 + (k % 20)
                  : 21 + (k % 28),
            b =
              form === 0
                ? 302 + 9 * k
                : form === 1
                  ? 19 + (k % 11)
                  : 11 + (Math.floor(k / 5) % 22);
          expected =
            form === 0
              ? Math.round(a / 10) * 10 + Math.round(b / 10) * 10
              : form === 1
                ? Math.round(a / 10) * 10 * Math.round(b / 10) * 10
                : Math.floor(a / 10) * 10 * Math.floor(b / 10) * 10;
        }
        expect(checkAnswer(String(expected), q.answer), q.id).toBe(true);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(false),
        );
      }
    expect(b03ReviewQuestion('B03-L05', 80).answer).toEqual(
      b03ReviewQuestion('B03-L05', 0).answer,
    );
    expect(() => b03ReviewQuestion('B03-L01', -1)).toThrow();
    expect(() => b03ReviewQuestion('missing', 0)).toThrow();
  });
});
describe('honest place-value procedures and estimation evidence', () => {
  it('preserves the original minuend across zero-chain exchanges and reconstructs every result digit', () => {
    const m = columnCalculation(408, 179, 'subtract');
    expect(m.steps[0]!.after).toEqual([3, 9, 18]);
    expect(m.result).toBe(229);
    expect(columnCalculation(1000, 1, 'subtract').steps[0]!.after).toEqual([
      0, 9, 9, 10,
    ]);
    const pairs = [
      [0, 0],
      [999, 1],
      [1000, 1],
      [502, 268],
      [9999, 9999],
      [9000, 8079],
      [7010, 999],
      [268, 157],
      [408, 179],
    ];
    for (const [a, b] of pairs)
      for (const op of ['add', 'subtract'] as const) {
        if (op === 'subtract' && b! > a!) continue;
        const m = columnCalculation(a!, b!, op);
        expect(m.result).toBe(op === 'add' ? a! + b! : a! - b!);
        for (const s of m.steps) {
          expect(s.digit).toBeGreaterThanOrEqual(0);
          expect(s.digit).toBeLessThan(10);
          if (op === 'subtract')
            expect(
              s.after.reduce(
                (sum, d, i) => sum + d * 10 ** (m.top.length - i - 1),
                0,
              ),
            ).toBe(a);
          else expect(s.raw).toBe(s.digit + 10 * s.outgoing);
        }
      }
    expect(columnCalculation(999, 1, 'add').finalCarry).toBe(1);
    expect(() => columnCalculation(4, 8, 'subtract')).toThrow();
    expect(() => columnCalculation(1.5, 2, 'add')).toThrow();
  });
  it('counts both split regions and gives all four areas with a common coordinate scale', () => {
    expect(splitProduct(6, 8, 5)).toMatchObject({
      left: 30,
      right: 18,
      total: 48,
    });
    for (let cut = 0; cut <= 8; cut++) {
      const m = splitProduct(6, 8, cut);
      expect(m.left + m.right).toBe(48);
    }
    expect(splitProduct(0, 8, 5).total).toBe(0);
    expect(() => splitProduct(6, 8, 9)).toThrow();
    expect(areaProduct(23, 14).parts.map((p) => p.area)).toEqual([
      200, 30, 80, 12,
    ]);
    for (const [a, b] of [
      [0, 25],
      [10, 10],
      [24, 13],
      [40, 12],
      [99, 99],
      [11, 49],
    ]) {
      const m = areaProduct(a!, b!);
      expect(m.total).toBe(a! * b!);
      expect(m.parts.reduce((s, p) => s + p.width * p.height, 0)).toBe(a! * b!);
      expect(m.aTens + m.aOnes).toBe(a);
      expect(m.bTens + m.bOnes).toBe(b);
    }
    expect(() => areaProduct(100, 2)).toThrow();
  });
  it('tracks unit exchanges in every division digit, retaining internal zeros and exact remainders', () => {
    expect(longDivision(1005, 5).steps.map((s) => s.quotientDigit)).toEqual([
      0, 2, 0, 1,
    ]);
    expect(
      longDivision(936, 12).steps.map((s) => [
        s.available,
        s.quotientDigit,
        s.remainder,
      ]),
    ).toEqual([
      [9, 0, 9],
      [93, 7, 9],
      [96, 8, 0],
    ]);
    for (const total of [0, 1, 12, 235, 317, 408, 574, 936, 1005, 9999])
      for (let d = 1; d <= 12; d++) {
        const m = longDivision(total, d);
        expect(m.quotient).toBe(Math.floor(total / d));
        expect(m.remainder).toBe(total % d);
        expect(d * m.quotient + m.remainder).toBe(total);
        m.steps.forEach((s) => {
          expect(s.available).toBe(s.previous * 10 + s.digit);
          expect(s.used + s.remainder).toBe(s.available);
          expect(s.remainder).toBeLessThan(d);
          expect(s.quotientDigit).toBeLessThan(10);
        });
      }
    expect(() => longDivision(0, 0)).toThrow();
    expect(() => longDivision(-1, 4)).toThrow();
  });
  it('bounds exact results with sign-correct subtraction endpoints without proving an inside candidate', () => {
    for (const unit of [10, 100] as const)
      for (const a of [0, 19, 23, 100, 298, 802, 9999])
        for (const b of [0, 7, 19, 100, 397])
          for (const op of ['add', 'subtract', 'multiply'] as const) {
            if (op === 'subtract' && b > a) continue;
            const m = estimateCalculation(a, b, op, unit),
              exact = op === 'add' ? a + b : op === 'subtract' ? a - b : a * b;
            expect(m.exact).toBe(exact);
            expect(m.lower).toBeLessThanOrEqual(exact);
            expect(m.upper).toBeGreaterThanOrEqual(exact);
          }
    expect(estimateCalculation(802, 397, 'subtract', 100)).toMatchObject({
      lower: 400,
      upper: 600,
      estimate: 400,
      exact: 405,
    });
    const m = estimateCalculation(23, 19, 'multiply', 10);
    expect(m.lower).toBe(200);
    expect(m.upper).toBe(600);
    expect(438).toBeGreaterThan(m.lower);
    expect(438).toBeLessThan(m.upper);
    expect(438).not.toBe(m.exact);
  });
});
