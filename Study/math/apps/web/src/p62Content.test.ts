import { describe, it, expect } from 'vitest';
import {
  p62Lessons,
  p62CheckQuestions,
  p62ReviewQuestion,
} from './content/P62';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  ratio,
  ratioText,
  decimalText,
  percentText,
  roundedPercent,
  perHundred,
  decimalPercent,
  fractionPercent,
  percentCells,
  percentOf,
  wholeFromPercent,
  priceChange,
  moneyText,
} from './percentModels';
const markdown = import.meta.glob('../../../content/lessons/P62-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...p62Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p62CheckQuestions,
];
const expected = [
  [1 / 4, 3 / 10, 1 / 80, 0, 1, 3 / 10],
  [0.375, 0.035, 1.25, 0.5, 0.375, 0.008],
  [3 / 8, 7 / 20, 1 / 3, 5 / 4, 2 / 3, 3 / 5],
  [28, 30, 15, 0, 1.5, 5],
  [60, 48, 120, 24, 17.5, 60],
  [64, 16, 80, 0.3, 76.8, 90],
];
const numericValue = (s: string) => {
  const v = exactRational(s)!;
  return Number(v[0]) / Number(v[1]);
};
describe('P62 authored percentage content', () => {
  it('registers the six planned bilingual lessons, backwards prerequisites and two examples in each language', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P62')!;
    expect(p62Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.P62.questions).toHaveLength(8);
    expect(new Set(p62Lessons.map((l) => l.lab)).size).toBe(6);
    p62Lessons.forEach((l) => {
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
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
        const p = lessons.find((x) => x.id === id)!;
        expect(p, `${l.id}→${id}`).toBeTruthy();
        if (p.unit === 'P62') expect(p.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    });
    const full = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(full).toHaveLength(358);
    expect(
      full
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(lessons.filter((l) => l.unit === 'P62')).toHaveLength(6);
    expect(p62Lessons[5]!.familyChallenge!.en).toContain('No purchase');
  });
  it('checks all 56 unique authored items, bilingual evidence and accepted/rejected examples', () => {
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
        ...q.solutionSteps!,
        ...q.hints,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
      } else {
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently transcribes every numeric answer, including inverse quantities and changed price bases', () => {
    p62Lessons.forEach((l, i) => {
      const qs = [
        l.guided,
        ...l.questions.filter((q) => q.answer.kind === 'number'),
        l.exit,
      ];
      expect(qs).toHaveLength(6);
      qs.forEach((q, j) => {
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(numericValue(q.answer.value), q.id).toBeCloseTo(
          expected[i]![j]!,
          12,
        );
      });
    });
    const checkExpected = [0.063, 7 / 8, 24, 60, 51, 1 / 6];
    p62CheckQuestions
      .filter((q) => q.answer.kind === 'number')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(numericValue(q.answer.value), q.id).toBeCloseTo(
            checkExpected[i]!,
            12,
          );
      });
    expect(checkAnswer('16', p62Lessons[5]!.guided.answer)).toBe(false);
    expect(checkAnswer('64', p62Lessons[5]!.questions[1]!.answer)).toBe(false);
    expect(checkAnswer('80', p62Lessons[5]!.questions[4]!.answer)).toBe(false);
  });
  it('requires percent notation, exact recurring values, the requested decimal form and correct measurement units', () => {
    const thirds = p62Lessons[2]!.questions[2]!.answer;
    for (const s of ['33 1/3%', '100/3%', '200/6 ％', '33 2/6%'])
      expect(checkAnswer(s, thirds), s).toBe(true);
    for (const s of [
      '33.3%',
      '33.333333%',
      '1/3',
      '33 1/3',
      '100/3%%',
      '1/3 L',
    ])
      expect(checkAnswer(s, thirds), s).toBe(false);
    const decimal = p62Lessons[1]!.questions[4]!.answer;
    expect(checkAnswer('.375', decimal)).toBe(true);
    expect(checkAnswer('3/8', decimal)).toBe(false);
    expect(checkAnswer('37.5%', decimal)).toBe(false);
    const litres = p62Lessons[3]!.guided.answer;
    for (const s of ['28', '56/2 升', '28 litres'])
      expect(checkAnswer(s, litres)).toBe(true);
    for (const s of ['28%', '28 g', '28 NZD'])
      expect(checkAnswer(s, litres)).toBe(false);
    const cost = p62Lessons[5]!.questions[4]!.answer;
    for (const s of ['NZ$76.80', '76.8 新西兰元', '768/10'])
      expect(checkAnswer(s, cost)).toBe(true);
  });
  it('verifies 480 retrieval evaluations independently across proportions, exact conversion, amounts, inverse amounts and prices', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 6; i++) {
        const id = p62Lessons[i]!.id,
          q = p62ReviewQuestion(id, k);
        if (q.answer.kind !== 'number') throw new Error(q.id);
        const expectedValue =
          i === 0
            ? (1 + (k % 5)) / (20 + 10 * (Math.floor(k / 5) % 5))
            : i === 1
              ? (1 + ((k * 37) % 2000)) / 1000
              : i === 2
                ? (1 + (k % 5)) / [3, 4, 6, 8, 12][Math.floor(k / 5) % 5]!
                : i === 3
                  ? ((20 + (k % 10) * 5) * (5 + Math.floor(k / 10) * 5)) / 100
                  : i === 4
                    ? 20 + (k % 10) * 4
                    : (20 + (k % 8) * 10) *
                      (1 +
                        ((k % 2 === 1 ? 1 : -1) *
                          [10, 15, 20, 25, 30][Math.floor(k / 8) % 5]!) /
                          100);
        expect(numericValue(q.answer.value), q.id).toBeCloseTo(
          expectedValue,
          12,
        );
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
        expect(p62ReviewQuestion(id, k + 80).stem).toEqual(q.stem);
      }
    for (const n of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => p62ReviewQuestion('P62-L01', n)).toThrow();
    expect(() => p62ReviewQuestion('P62-L99', 0)).toThrow();
  });
});
describe('P62 exact mathematics and visual geometry', () => {
  it('normalizes terminating decimal representations without float rounding, and marks recurring values separately', () => {
    for (let n = 0; n <= 2000; n++) {
      const m = decimalPercent(n),
        r = exactRational(m.percent)!;
      expect(r[0] * 1000n).toBe(BigInt(n) * r[1]);
      expect(numericValue(m.decimal)).toBeCloseTo(n / 1000, 12);
    }
    expect(decimalText({ n: 1, d: 3 })).toBeNull();
    expect(decimalText({ n: 1, d: 128 })).toBe('0.0078125');
    expect(percentText({ n: 1, d: 3 })).toBe('33 1/3%');
    expect(percentText({ n: 1, d: 120 })).toBe('5/6%');
    expect(roundedPercent({ n: 1, d: 3 })).toBe('33.3%');
    expect(roundedPercent({ n: 2, d: 3 })).toBe('66.7%');
    expect(ratioText({ n: 0, d: 8 })).toBe('0');
  });
  it('preserves every bounded source ratio and actual count, including fractional per-hundred coefficients', () => {
    for (let total = 1; total <= 100; total++)
      for (let n = 0; n <= total; n++) {
        const m = perHundred(n, total);
        expect(m.selected).toBe(n);
        expect(m.total).toBe(total);
        expect(m.coefficient.n * total).toBe(100 * n * m.coefficient.d);
      }
    expect(perHundred(1, 80).coefficient).toEqual({ n: 5, d: 4 });
  });
  it('counts original hundredths and proportional partial-cell area through zero, thirds and two wholes', () => {
    for (let d = 1; d <= 12; d++)
      for (let n = 0; n <= 2 * d; n++) {
        const g = percentCells({ n, d });
        expect(g.cells).toHaveLength(g.frames * 100);
        expect(
          new Set(g.cells.map((c) => `${c.frame}:${c.x}:${c.y}`)).size,
        ).toBe(g.cells.length);
        expect(g.cells.reduce((s, c) => s + c.filled, 0)).toBeCloseTo(
          (100 * n) / d,
          10,
        );
        expect(g.cells.every((c) => c.filled >= 0 && c.filled <= 1)).toBe(true);
        const f = fractionPercent(n, d),
          p = exactRational(f.exact)!;
        expect(p[0] * BigInt(d)).toBe(BigInt(n) * p[1]);
      }
    expect(
      percentCells({ n: 3, d: 8 }).cells.filter(
        (c) => c.filled > 0 && c.filled < 1,
      ),
    ).toEqual([expect.objectContaining({ index: 37, filled: 0.5 })]);
    expect(
      percentCells({ n: 2, d: 1 }).cells.filter((c) => c.filled === 1),
    ).toHaveLength(200);
  });
  it('checks direct and inverse percentage calculations by multiplication, retaining noninteger quantities and zero-rate classifications', () => {
    for (let whole = 0; whole <= 100; whole++)
      for (let rate = 0; rate <= 150; rate++) {
        const m = percentOf(whole, rate);
        expect(m.amount.n * 100).toBe(whole * rate * m.amount.d);
      }
    for (let part = 1; part <= 60; part++)
      for (let rate = 1; rate <= 150; rate++) {
        const m = wholeFromPercent(part, rate);
        if (m.kind !== 'unique') throw new Error('missing whole');
        expect(m.whole.n * rate).toBe(part * 100 * m.whole.d);
        expect(m.one.n * rate).toBe(part * m.one.d);
      }
    expect(wholeFromPercent(0, 0).kind).toBe('undetermined');
    expect(wholeFromPercent(18, 0).kind).toBe('inconsistent');
    expect(wholeFromPercent(0, 30).kind).toBe('zero-whole');
    expect(percentOf(5, 30).amount).toEqual({ n: 3, d: 2 });
    expect(wholeFromPercent(7, 40)).toMatchObject({ whole: { n: 35, d: 2 } });
  });
  it('uses integer cents and changing bases, verifies all UI combinations and refuses silent fractional-cent rounding', () => {
    for (const cents of [2000, 4000, 8000, 10000])
      for (let rate = 0; rate <= 100; rate += 5)
        for (const direction of ['discount', 'increase'] as const) {
          const first = priceChange(cents, rate, direction),
            second = priceChange(
              first.next,
              rate,
              direction === 'discount' ? 'increase' : 'discount',
            );
          expect(first.change * 100).toBe(cents * rate);
          expect(second.change * 100).toBe(first.next * rate);
          expect(second.next * 10000).toBe(cents * (10000 - rate * rate));
        }
    expect(priceChange(8000, 20, 'discount').next).toBe(6400);
    expect(priceChange(6400, 20, 'increase').next).toBe(7680);
    expect(priceChange(6400, 25, 'increase').next).toBe(8000);
    expect(moneyText(7680)).toBe('NZ$76.80');
    expect(() => priceChange(1, 50, 'discount')).toThrow(/rounding/);
  });
  it('rejects malformed percent syntax and invalid model domains while preserving exact old-style fractions and decimals', () => {
    for (const s of ['25%%', '33 3/3%', '1/0%', '%', '1.2.3%', 'abc%', '1e2%'])
      expect(exactRational(s), s).toBeNull();
    expect(exactRational('33 1/3 %')).toEqual([1n, 3n]);
    expect(exactRational('100/3％')).toEqual([1n, 3n]);
    expect(exactRational('6/16')).toEqual([3n, 8n]);
    expect(exactRational('2.25')).toEqual([9n, 4n]);
    for (const fn of [
      () => ratio(-1, 2),
      () => ratio(1, 0),
      () => perHundred(1, 0),
      () => perHundred(3, 2),
      () => decimalPercent(2001),
      () => fractionPercent(1, 0),
      () => fractionPercent(7, 3),
      () => percentCells({ n: 3, d: 1 }),
      () => percentOf(1, -1),
      () => wholeFromPercent(1, 151),
      () => priceChange(100, -1, 'increase'),
      () => moneyText(0.5),
    ])
      expect(fn).toThrow();
  });
});
