import { describe, expect, it } from 'vitest';
import {
  p52Lessons,
  p52CheckQuestions,
  p52ReviewQuestion,
} from './content/P52';
import { lessons } from './content';
import { checkAnswer } from './model';
import {
  decimalDigits,
  formatMilli,
  roundMilli,
  decimalColumns,
  decimalDivision,
  shoppingModel,
} from './decimalModels';
const markdown = import.meta.glob('../../../content/lessons/P52-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const allQuestions = [
  ...p52Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p52CheckQuestions,
];
describe('P52 teaching content and mathematical validation', () => {
  it('covers the six planned ideas with original bilingual worked examples and valid prerequisites', () => {
    expect(p52Lessons.map((l) => l.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `P52-L0${i + 1}`),
    );
    expect(new Set(p52Lessons.map((l) => l.lab)).size).toBe(6);
    for (const l of p52Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.stage).toBe('P05');
      expect(l.unit).toBe('P52');
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
      expect(l.parent.prompts).toHaveLength(2);
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
      for (const id of [...l.prerequisites, l.parent.bridge])
        expect(
          [...lessons, ...p52Lessons].some(
            (p) =>
              p.id === id &&
              (p.unit !== 'P52' || p.order! < l.order! || id === l.id),
          ),
          `${l.id} prerequisite ${id}`,
        ).toBe(true);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
    }
    expect(p52Lessons[5]!.familyChallenge!.en).toContain('NZ$10');
    expect(p52CheckQuestions).toHaveLength(8);
  });
  it('verifies every automatic answer, equivalent decimal, unit and meaningful distractor', () => {
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(
      allQuestions.length,
    );
    for (const q of allQuestions) {
      expect(q.hints).toHaveLength(2);
      expect(q.difficulty).toBeTruthy();
      expect(q.misconceptionTags).toContain(q.skill);
      [q.stem, q.solution, ...q.hints, ...(q.solutionSteps ?? [])].forEach(
        (v) => {
          expect(v.zh).toBeTruthy();
          expect(v.en).toBeTruthy();
        },
      );
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        continue;
      }
      expect(q.solutionSteps!.length).toBeGreaterThan(0);
      q.answerChecks!.accepted.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id} accepted ${a}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id} rejected ${a}`).toBe(false),
      );
      if (q.answer.kind === 'choice')
        q.options!.forEach((o) => {
          expect(o.feedback.zh).toBeTruthy();
          expect(o.feedback.en).toBeTruthy();
        });
    }
  });
  it('checks answers against independent integer-unit arithmetic for every numerical scenario', () => {
    // Values below count thousandths, except L01-Q2 which asks for a count.
    const oracle: Record<string, number> = {
      'P52-L01-G': 300 + 7,
      'P52-L01-Q2': 40 * 1000,
      'P52-L01-Q3': 400 + 7,
      'P52-L01-Q4': 2000 + 50 + 6,
      'P52-L01-Q5': 1000 + 9,
      'P52-L01-X': 63,
      'P52-L02-G': Math.max(800, 750, 805),
      'P52-L02-Q2': 2350,
      'P52-L02-Q3': 810,
      'P52-L02-Q4': 2000,
      'P52-L02-Q5': 1200 + 2700,
      'P52-L02-X': 500,
      'P52-L03-G': 2750 + 680,
      'P52-L03-Q2': 1200 + 450,
      'P52-L03-Q3': 3006 - 580,
      'P52-L03-Q4': 95 + 8,
      'P52-L03-Q5': 5000 - 1275,
      'P52-L03-X': 2500 - 875,
      'P52-L04-G': 325 * 4,
      'P52-L04-Q2': 1250 * 6,
      'P52-L04-Q3': 48 * 5,
      'P52-L04-Q4': 2306 * 0,
      'P52-L04-Q5': 375 * 8,
      'P52-L04-X': 125 * 4,
      'P52-L05-G': 1500 / 4,
      'P52-L05-Q2': 960 / 3,
      'P52-L05-Q3': 1008 / 4,
      'P52-L05-Q4': 7200 / 6,
      'P52-L05-Q5': 4500 / 4,
      'P52-L05-X': 2016 / 8,
      'P52-L06-G': 5000 - 1250 * 3,
      'P52-L06-Q2': 2375 - 850,
      'P52-L06-Q3': 4800 / 4,
      'P52-L06-Q4': 4000 - 850 * 3,
      'P52-L06-Q5': 5000 - (2350 + 1200),
      'P52-L06-X': 5000 - 850 * 4,
      'P52-CHECK-Q1': 500 + 2,
      'P52-CHECK-Q2': Math.max(600, 606, 660),
      'P52-CHECK-Q3': 3000,
      'P52-CHECK-Q4': 4008 - 1250,
      'P52-CHECK-Q5': 75 * 8,
      'P52-CHECK-Q6': 3600 / 8,
      'P52-CHECK-Q7': 10000 - 1350 * 4,
    };
    const numeric = allQuestions.filter((q) => q.answer.kind === 'number');
    expect(numeric).toHaveLength(Object.keys(oracle).length);
    numeric.forEach((q) =>
      expect(
        checkAnswer((oracle[q.id]! / 1000).toFixed(3), q.answer),
        q.id,
      ).toBe(true),
    );
  });
  it('bounds all review variants and independently checks all six generators', () => {
    for (let round = 0; round < 80; round++)
      for (const l of p52Lessons) {
        const q = p52ReviewQuestion(l.id, round),
          k = round;
        const expected =
          l.order === 1
            ? (1 + (k % 8)) * 100 + 1 + (Math.floor(k / 8) % 9)
            : l.order === 2
              ? k % 2
                ? 540 + 5 * k
                : Math.floor((1055 + 10 * k + 5) / 10) * 10
              : l.order === 3
                ? 2306 + 10 * k + (k % 2 ? 580 : -580)
                : l.order === 4
                  ? (125 + 5 * k) * (2 + (k % 5))
                  : l.order === 5
                    ? 125 + 5 * k
                    : k % 2
                      ? 4000 - (125 + 5 * k) * (2 + (k % 3))
                      : (2000 - (85 + 5 * k) * (2 + (k % 3))) * 10;
        expect(expected).toBeGreaterThan(0);
        expect(checkAnswer((expected / 1000).toFixed(3), q.answer), q.id).toBe(
          true,
        );
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(false),
        );
        expect(q.hints).toHaveLength(2);
      }
    expect(p52ReviewQuestion('P52-L05', 80).answer).toEqual(
      p52ReviewQuestion('P52-L05', 0).answer,
    );
    expect(() => p52ReviewQuestion('missing', 0)).toThrow();
    expect(() => p52ReviewQuestion('P52-L01', -1)).toThrow();
    expect(() => p52ReviewQuestion('P52-L01', 0.5)).toThrow();
    expect(p52ReviewQuestion('P52-L03', 0).skill).not.toBe(
      p52ReviewQuestion('P52-L03', 1).skill,
    );
    expect(p52ReviewQuestion('P52-L06', 0).answer).toMatchObject({
      unit: 'NZD',
    });
    expect(p52ReviewQuestion('P52-L06', 1).answer).toMatchObject({ unit: 'm' });
  });
});
describe('exact decimal models and units', () => {
  it('preserves digit contributions and trailing zeros without binary decimal additions', () => {
    for (const n of [0, 1, 10, 40, 100, 307, 999, 1000, 2306, 9999]) {
      expect(decimalDigits(n).reduce((sum, p) => sum + p.contribution, 0)).toBe(
        n,
      );
      expect(formatMilli(n)).toBe((n / 1000).toFixed(3));
    }
    expect(formatMilli(100 + 200, true)).toBe('0.3');
    expect(formatMilli(10000, true)).toBe('10');
    expect(formatMilli(0, true)).toBe('0');
    expect(() => decimalDigits(10000)).toThrow();
  });
  it('rounds ties and carry chains directly to the chosen place', () => {
    expect(roundMilli(1995, 2)).toBe(2000);
    expect(roundMilli(805, 2)).toBe(810);
    expect(roundMilli(1494, 1)).toBe(1500);
    expect(roundMilli(1494, 0)).toBe(1000);
    expect(roundMilli(roundMilli(1494, 1), 0)).toBe(2000);
    for (const digits of [0, 1, 2] as const)
      for (let n = 0; n <= 9999; n += 37) {
        const scale = 10 ** (3 - digits);
        expect(roundMilli(n, digits)).toBe(
          Math.floor((n + scale / 2) / scale) * scale,
        );
      }
  });
  it('conserves value through every carry and successive borrow', () => {
    for (const [a, b, op] of [
      [2750, 680, 'add'],
      [3006, 580, 'subtract'],
      [1003, 508, 'subtract'],
      [9090, 909, 'add'],
      [1000, 999, 'subtract'],
      [0, 0, 'add'],
    ] as const) {
      const m = decimalColumns(a, b, op);
      expect(m.result).toBe(op === 'add' ? a + b : a - b);
      expect(
        m.columns.reduce((sum, c) => sum + c.digit * 10 ** (3 - c.place), 0),
      ).toBe(m.result);
      m.columns.forEach((c, i) => {
        expect(c.incoming).toBe(i === 0 ? 0 : m.columns[i - 1]!.outgoing);
        expect(c.digit).toBe(
          op === 'add' ? c.raw - 10 * c.outgoing : c.raw + 10 * c.outgoing,
        );
      });
    }
    expect(() => decimalColumns(1000, 2000, 'subtract')).toThrow();
    expect(() => decimalColumns(9999, 1, 'add')).toThrow();
  });
  it('preserves exact equal shares and labels finite display errors honestly', () => {
    expect(decimalDivision(1500, 4)).toMatchObject({
      exact: '3/8',
      exactAtThousandths: true,
      roundedThousandths: 375,
    });
    expect(decimalDivision(1000, 3)).toMatchObject({
      exact: '1/3',
      exactAtThousandths: false,
      roundedThousandths: 333,
    });
    expect(decimalDivision(2000, 3)).toMatchObject({
      exact: '2/3',
      exactAtThousandths: false,
      roundedThousandths: 667,
    });
    expect(decimalDivision(0, 4)).toMatchObject({
      exact: '0/1',
      roundedThousandths: 0,
    });
    expect(() => decimalDivision(1000, 0)).toThrow();
    for (let amount = 0; amount <= 3000; amount += 53)
      for (let groups = 1; groups <= 6; groups++) {
        const m = decimalDivision(amount, groups);
        expect(m.numerator * 1000 * groups).toBe(amount * m.denominator);
        expect(m.wholeThousandths * groups + m.remainder).toBe(amount);
        expect(m.exactAtThousandths).toBe(amount % groups === 0);
      }
  });
  it('uses cents for totals, distinguishes estimates, exact change and positive shortfalls', () => {
    expect(shoppingModel(125, 3, 500)).toEqual({
      total: 375,
      estimate: 390,
      change: 125,
      shortfall: 0,
    });
    expect(shoppingModel(400, 4, 500)).toEqual({
      total: 1600,
      estimate: 1600,
      change: -1100,
      shortfall: 1100,
    });
    expect(shoppingModel(125, 0, 500)).toMatchObject({ total: 0, change: 500 });
  });
  it('accepts appropriate decimal representations and rejects wrong dimensions or unsupported formats', () => {
    const spec = {
      kind: 'number',
      value: '1.009',
      unit: 'm',
      formats: ['decimal'],
    } as const;
    for (const input of ['1.009', '1.0090', '1.009 m', '1.009 metres'])
      expect(checkAnswer(input, { ...spec, formats: ['decimal'] })).toBe(true);
    for (const input of [
      '1.009 km',
      '1.009 mm',
      '1009/1000',
      '100.9%',
      '1.009 L',
    ])
      expect(checkAnswer(input, { ...spec, formats: ['decimal'] })).toBe(false);
    expect(
      checkAnswer('3 km', { kind: 'number', value: '3', unit: 'km' }),
    ).toBe(true);
    expect(checkAnswer('3 m', { kind: 'number', value: '3', unit: 'km' })).toBe(
      false,
    );
  });
});
