import { describe, it, expect } from 'vitest';
import { percentMeaningRetrieval } from './content/percentMeaningRetrieval';
import { percentRecurrence } from './content/percentRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  perHundred,
  decimalPercent,
  fractionPercent,
  percentCells,
  percentOf,
  wholeFromPercent,
  priceChange,
  ratio,
  percentText,
} from './percentModels';
const sets = Object.values(percentMeaningRetrieval);
const given = (i: number, q: number, key: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === key,
  )![2]!.en;
const num = (i: number, q: number, key: string) =>
  Number(given(i, q, key).replace('%', ''));
const eq = (v: { n: number; d: number }, n: number, d = 1) =>
  expect(v).toEqual(ratio(n, d));
const decimalParts = (s: string) => {
  const [whole, places = ''] = s.split('.');
  return { n: Number(whole + places), d: 10 ** places.length };
};
describe('P62 percentage meanings in two additional later units', () => {
  it('adds twelve manually reviewed arguments without replacing the twelve original references or owner defaults', () => {
    expect(percentRecurrence.flatMap((e) => e.targets)).toHaveLength(24);
    expect(new Set(percentRecurrence.flatMap((e) => e.targets)).size).toBe(24);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of percentRecurrence.entries()) {
      expect(e.targets.slice(0, 2)).toEqual(
        ['J75', 'J76'].map((u) => `${u}-MAINT-PERCENT-Q${i + 1}`),
      );
      expect(e.targets.slice(2)).toEqual(sets.map((s) => s.questions[i]!.id));
      for (const s of sets) {
        expect(Object.values(maintenanceSets).find((x) => x.id === s.id)).toBe(
          s,
        );
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P62'));
        const q = s.questions[i]!;
        expect(s.bridgeByQuestion[q.id]).toBe('P62-L0' + (i + 1));
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
      }
    }
    expect(maintenanceSets.P65.questions).toHaveLength(4);
    expect(maintenanceSets.P68.questions).toHaveLength(5);
    expect(maintenanceSets.J75.questions).toHaveLength(6);
    expect(maintenanceSets.J76.questions).toHaveLength(6);
    expect(lessons).toHaveLength(358);
  });
  it('retains actual cards, partial standard cells and reverse count recovery instead of rounding a grid', () => {
    for (const [i, den, full, partialN, partialD, expected] of [
      [0, 80, 3, 3, 4, '3.75%'],
      [1, 40, 7, 1, 2, '7.5%'],
    ] as const) {
      const total = num(i!, 1, 'A_N'),
        marked = num(i!, 1, 'A_M'),
        m = perHundred(marked, total);
      expect(total).toBe(den);
      expect(marked).toBe(3);
      expect(percentText(m.value)).toBe(expected);
      const cells = percentCells(m.value).cells;
      expect(cells.filter((c) => c.filled === 1)).toHaveLength(full!);
      expect(cells.filter((c) => c.filled > 0 && c.filled < 1)).toHaveLength(1);
      expect(cells[full!]!.filled).toBe(partialN! / partialD!);
      const rare = num(i!, 1, 'D_N');
      expect(rare).toBe(i === 0 ? 200 : 400);
      expect(percentText(ratio(1, rare))).toBe(i === 0 ? '0.5%' : '0.25%');
      expect(percentCells(ratio(1, rare)).cells[0]!.filled).toBe(
        i === 0 ? 0.5 : 0.25,
      );
      const b = num(i!, 1, 'B_N'),
        c = num(i!, 1, 'C_N');
      eq(perHundred(6, c).value, marked, b);
      expect(m.value.n * perHundred(marked, b).value.d).not.toBe(
        perHundred(marked, b).value.n * m.value.d,
      );
      eq(perHundred(0, total).value, 0);
      eq(perHundred(total, total).value, 1);
      expect(() => perHundred(0, 0)).toThrow();
      expect(() => perHundred(total + 1, total)).toThrow();
    }
  });
  it('preserves values below one percent, extended wholes, reverse decimals and the zero exception', () => {
    for (const [i, milli, large, p, e] of [
      [0, 6, 1400, '0.6%', '140%'],
      [1, 9, 1600, '0.9%', '160%'],
    ] as const) {
      const d = num(i, 2, 'D'),
        extended = num(i, 2, 'E');
      expect(d * 1000).toBe(milli);
      expect(extended * 1000).toBe(large);
      expect(decimalPercent(milli).percent).toBe(p);
      expect(given(i, 2, 'P')).toBe(p);
      expect(decimalPercent(large).percent).toBe(e);
      const grid = percentCells(ratio(large, 1000));
      expect(grid.frames).toBe(2);
      expect(grid.cells).toHaveLength(200);
      expect(grid.cells.filter((c) => c.filled === 1)).toHaveLength(large / 10);
      const values = given(i, 2, 'V').split(', ').map(decimalParts);
      for (let j = 1; j < 3; j++)
        expect(values[j]!.n * 10 * values[j - 1]!.d).toBe(
          values[j - 1]!.n * values[j]!.d,
        );
      const coefficient = decimalParts(given(i, 2, 'P').replace('%', '')),
        original = decimalParts(given(i, 2, 'D'));
      expect(coefficient.n * original.d).toBe(original.n * coefficient.d * 100);
      expect(num(i, 2, 'P')).not.toBe(d);
    }
    expect(decimalPercent(0).percent).toBe('0%');
    expect(decimalPercent(0).decimal).toBe('0');
  });
  it('keeps exact and rounded percent coefficients distinct and checks partial cell areas with original frames', () => {
    const cases = [
      {
        i: 0,
        tn: 7,
        td: 8,
        exact: '87.5%',
        rN: 4,
        rD: 9,
        rExact: '44 4/9%',
        approx: '44.4%',
        whole: 44,
        pn: 4,
        pd: 9,
        approxN: 444,
        scaled: 3996,
      },
      {
        i: 1,
        tn: 9,
        td: 8,
        exact: '112.5%',
        rN: 5,
        rD: 6,
        rExact: '83 1/3%',
        approx: '83.3%',
        whole: 83,
        pn: 1,
        pd: 3,
        approxN: 833,
        scaled: 4998,
      },
    ];
    for (const c of cases) {
      expect(given(c.i, 3, 'T')).toBe(`${c.tn}/${c.td}`);
      expect(fractionPercent(c.tn, c.td).exact).toBe(c.exact);
      expect(given(c.i, 3, 'R')).toBe(`${c.rN}/${c.rD}`);
      const m = fractionPercent(c.rN, c.rD);
      expect(m.exact).toBe(c.rExact);
      expect(m.approximate).toBe(c.approx);
      expect(given(c.i, 3, 'R_P')).toBe(c.approx);
      const cells = percentCells(m.value).cells;
      expect(cells.filter((x) => x.filled === 1)).toHaveLength(c.whole);
      expect(cells[c.whole]!.filled).toBe(c.pn / c.pd);
      expect(c.approxN * c.rD).toBe(c.scaled);
      expect(c.scaled).not.toBe(c.rN * 1000);
      const [en, ed] = given(c.i, 3, 'E').split('/').map(Number);
      expect(ed).toBe(20);
      eq(ratio(en! * 5, 100), en!, ed!);
      expect(en! / 100).not.toBe(en! / ed!);
    }
    expect(percentCells(ratio(0, 1)).cells.every((c) => c.filled === 0)).toBe(
      true,
    );
    const two = percentCells(ratio(2, 1));
    expect(two.frames).toBe(2);
    expect(two.cells.filter((c) => c.filled === 1)).toHaveLength(200);
  });
  it('conserves nonintegral selections and remainders, permits excess requirements and rejects reverse zero ratios', () => {
    for (const [i, n, d, restN, restD, overN, overD] of [
      [0, 49, 20, 91, 20, 35, 4],
      [1, 33, 20, 187, 20, 55, 4],
    ]) {
      const w = num(i!, 4, 'W'),
        r = num(i!, 4, 'P'),
        m = percentOf(w, r);
      eq(m.amount, n!, d!);
      eq(m.one, w, 100);
      const rest = ratio(w * m.amount.d - m.amount.n, m.amount.d);
      eq(rest, restN!, restD!);
      expect(m.amount.n * rest.d + rest.n * m.amount.d).toBe(
        w * m.amount.d * rest.d,
      );
      expect(m.amount.n * 100).toBe(w * r * m.amount.d);
      expect(m.amount.d).toBeGreaterThan(1);
      eq(percentOf(2 * w, r).amount, 2 * n!, d!);
      eq(percentOf(w, 125).amount, overN!, overD!);
      eq(percentOf(w, 0).amount, 0);
      eq(percentOf(w, 100).amount, w);
      eq(percentOf(0, r).amount, 0);
      expect(() => ratio(0, 0)).toThrow();
    }
  });
  it('recovers smaller positive references and nonintegral wholes while separating three zero conditions', () => {
    for (const [i, expected, oneN, oneD, bN] of [
      [0, 28, 7, 25, 45],
      [1, 30, 3, 10, 55],
    ]) {
      const p = num(i!, 5, 'A_P'),
        r = num(i!, 5, 'R'),
        m = wholeFromPercent(p, r);
      expect(m.kind).toBe('unique');
      if (m.kind !== 'unique') throw Error('Expected positive reference');
      eq(m.whole, expected!);
      eq(m.one, oneN!, oneD!);
      expect(m.whole.n * r).toBe(p * 100 * m.whole.d);
      expect(m.whole.n / m.whole.d).toBeLessThan(p);
      const b = wholeFromPercent(num(i!, 5, 'B_P'), num(i!, 5, 'B_R'));
      expect(b.kind).toBe('unique');
      if (b.kind !== 'unique') throw Error('Expected positive reference');
      eq(b.whole, bN!, 2);
      expect(wholeFromPercent(0, 0).kind).toBe('undetermined');
      expect([10, 20].map((w) => w * 0)).toEqual([0, 0]);
      expect(wholeFromPercent(p, 0).kind).toBe('inconsistent');
      expect(wholeFromPercent(0, r).kind).toBe('zero-whole');
      const same = wholeFromPercent(p, 100);
      if (same.kind !== 'unique') throw Error('Expected identity');
      eq(same.whole, p);
    }
  });
  it('checks exact cents, distinguishes retained and removed rates and derives the new-base recovery rate', () => {
    for (const [i, off, firstC, savedC, secondC, lastC, recovery] of [
      [0, 20, 3200, 800, 640, 3840, '25%'],
      [1, 25, 7500, 2500, 1875, 9375, '33 1/3%'],
    ] as const) {
      const c = num(i, 6, 'C'),
        pay = num(i, 6, 'PAY');
      expect(pay + off).toBe(100);
      const first = priceChange(c, off, 'discount'),
        second = priceChange(first.next, off, 'increase');
      expect(first.next).toBe(firstC);
      expect(first.change).toBe(savedC);
      expect(second.change).toBe(secondC);
      expect(second.next).toBe(lastC);
      expect(second.next * 10000).toBe(c * (100 - off) * (100 + off));
      expect(priceChange(c, pay, 'discount').next).not.toBe(first.next);
      const rate = ratio(savedC, firstC);
      expect(percentText(rate)).toBe(recovery);
      expect(firstC * (rate.d + rate.n)).toBe(c * rate.d);
      expect(firstC * off).not.toBe(savedC * 100);
      expect(priceChange(c, 0, 'discount').next).toBe(c);
      const zero = priceChange(c, 100, 'discount');
      expect(zero.next).toBe(0);
      expect(priceChange(zero.next, 100, 'increase').next).toBe(0);
      expect(() => ratio(c, 0)).toThrow();
    }
    expect(() => priceChange(101, 5, 'discount')).toThrow(/whole cents/);
  });
});
