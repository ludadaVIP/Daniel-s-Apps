import { describe, it, expect } from 'vitest';
import { rational, textR } from './algebraModels';
import { asNumber, valueAt } from './calculusModels';
import { equalPolynomial, polynomialText } from './polynomialModels';
import {
  shapeModel,
  analysisFamilies,
  closedExtrema,
  productModel,
  chainModel,
  appliedRateModel,
  checkAnalysisCode,
} from './functionAnalysisModels';
describe('H26 exact analysis models against independent algebra and domain oracles', () => {
  it('classifies factored signs, isolated zeros, constants and the nondifferentiable corner', () => {
    const rules: Record<string, (x: number) => number> = {
      'cubic-turn': (x) => 3 * x * x - 3,
      'cubic-flat': (x) => 3 * x * x,
      square: (x) => 2 * x,
      'negative-square': (x) => -2 * x,
      constant: () => 0,
      corner: (x) => Math.sign(x),
    };
    for (const family of analysisFamilies) {
      const m = shapeModel(family);
      for (const x of [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3]) {
        const r = rational(BigInt(x * 2), 2n),
          actual = m.slope(r);
        if (family === 'corner' && x === 0) expect(actual).toBeNull();
        else expect(asNumber(actual!)).toBeCloseTo(rules[family]!(x));
      }
    }
    expect(shapeModel('cubic-turn').intervals.map((r) => r[2])).toEqual([
      'increasing',
      'decreasing',
      'increasing',
    ]);
    expect(shapeModel('cubic-flat').classification(0)).toBe('neither');
    expect(shapeModel('corner').classification(0)).toBe('local-min');
    expect(shapeModel('constant').classification(0)).toBe('neither');
    expect(shapeModel('cubic-turn').classification(-1)).toBe('local-max');
    expect(shapeModel('cubic-turn').classification(1)).toBe('local-min');
    expect(shapeModel('square').classification(1)).toBe('neither');
  });
  it('compares both endpoints, all interior candidates and ties without inventing a finite stationary set for constants', () => {
    const a = closedExtrema('cubic-turn', '-2', '3');
    expect(textR(a.max)).toBe('18');
    expect(a.maxAt).toEqual(['3']);
    expect(textR(a.min)).toBe('-2');
    expect(a.minAt).toEqual(['-2', '1']);
    const b = closedExtrema('cubic-turn', '-2', '2');
    expect(b.maxAt).toEqual(['-1', '2']);
    const c = closedExtrema('corner', '-3/2', '1');
    expect(c.minAt).toEqual(['0']);
    expect(textR(c.max)).toBe('3/2');
    const d = closedExtrema('constant', '-2', '3');
    expect(d.allMin && d.allMax).toBe(true);
    expect(textR(d.min)).toBe('2');
    expect(
      closedExtrema('square', '1/2', '3/2').candidates.map((c) => textR(c.x)),
    ).toEqual(['1/2', '3/2']);
    for (const [l, r] of [
      ['1', '1'],
      ['2', '1'],
    ])
      expect(() => closedExtrema('square', l!, r!)).toThrow();
  });
  it('checks 1215 product values and rates against independently expanded coefficient formulas', () => {
    for (const a of [-1, 0, 1])
      for (const b of [-1, 0, 1])
        for (const c of [-1, 0, 1])
          for (const d of [-1, 0, 1])
            for (const e of [-1, 0, 1])
              for (const x of [-2, -0.5, 0, 0.5, 2]) {
                const m = productModel(
                  `${a}x^2+(${b})x+(${c})`,
                  `${d}x+(${e})`,
                  String(x),
                );
                // Expansion coefficients: ad x³+(ae+bd)x²+(be+cd)x+ce.
                const value =
                  a * d * x ** 3 +
                  (a * e + b * d) * x * x +
                  (b * e + c * d) * x +
                  c * e;
                const rate =
                  3 * a * d * x * x + 2 * (a * e + b * d) * x + b * e + c * d;
                expect(asNumber(m.value)).toBeCloseTo(value);
                expect(asNumber(m.rate)).toBeCloseTo(rate);
                expect(
                  equalPolynomial(
                    polynomialText(m.derivative),
                    `${3 * a * d}x^2+(${2 * (a * e + b * d)})x+(${b * e + c * d})`,
                    ['x'],
                  ),
                ).toBe(true);
              }
    expect(textR(productModel('x^2+1', 'x-2', '1').rate)).toBe('0');
  });
  it('checks 500 linear compositions and quadratic-inner cases by binomial expansion', () => {
    for (const a of [-2, -1, 0, 1, 2])
      for (const b of [-2, -1, 0, 1, 2])
        for (const n of [1, 2, 3, 4])
          for (const x of [-2, -0.5, 0, 0.5, 2]) {
            const m = chainModel(`${a}x+(${b})`, n, String(x));
            // Differentiate each binomial term independently; never use the chain helper as an oracle.
            const choose = (n: number, k: number) => {
              let v = 1;
              for (let j = 1; j <= k; j++) v = (v * (n - j + 1)) / j;
              return v;
            };
            let expected = 0;
            for (let k = 1; k <= n; k++)
              expected +=
                choose(n, k) * a ** k * b ** (n - k) * k * x ** (k - 1);
            expect(asNumber(m.rate)).toBeCloseTo(expected);
            expect(asNumber(m.value)).toBeCloseTo((a * x + b) ** n);
          }
    for (const x of [-2, -0.5, 0, 0.5, 2])
      expect(asNumber(chainModel('x^2+1', 2, String(x)).rate)).toBeCloseTo(
        4 * x ** 3 + 4 * x,
      );
    expect(textR(chainModel('2', 3, '0').rate)).toBe('0');
  });
  it('keeps physical domain, speed and units separate from algebraic extension', () => {
    for (const x of [0, 0.5, 1, 2, 3, 4]) {
      const m = appliedRateModel('position', String(x));
      expect(asNumber(m.rate!)).toBe(2 * x - 4);
      expect(asNumber(m.speed!)).toBe(Math.abs(2 * x - 4));
      expect(m.unit).toBe('m/s');
    }
    for (const x of [0, 0.5, 1, 2, 3]) {
      const m = appliedRateModel('area', String(x));
      expect(asNumber(m.value!)).toBe((1 + 2 * x) ** 2);
      expect(asNumber(m.rate!)).toBe(4 + 8 * x);
      expect(m.unit).toBe('m²/s');
    }
    for (const kind of ['position', 'area'] as const)
      for (const x of ['-1', '10']) {
        const m = appliedRateModel(kind, x);
        expect(m.inside).toBe(false);
        expect(m.value).toBeNull();
        expect(m.rate).toBeNull();
        expect(m.algebraicRate).not.toBeNull();
      }
    expect(appliedRateModel('position', '4').inside).toBe(true);
    expect(appliedRateModel('area', '4').inside).toBe(false);
  });
  it('accepts exact fractions and strict codes while enforcing parser and display bounds', () => {
    expect(checkAnalysisCode(' 递减 ', 'decreasing')).toBe(true);
    expect(checkAnalysisCode('LOCAL-MAX', 'local-max')).toBe(true);
    expect(checkAnalysisCode('maximum', 'local-max')).toBe(false);
    expect(checkAnalysisCode('0', 'constant')).toBe(false);
    expect(textR(productModel('x/2', 'x/3', '1/2').rate)).toBe('1/6');
    expect(textR(chainModel('x/2+1', 2, '1/2').rate)).toBe('5/4');
    for (const raw of ['x^5', '1/x', '101x', 'NaN', 'x+y'])
      expect(() => productModel(raw, 'x', '0')).toThrow();
    expect(() => productModel('x^3', 'x^2', '0')).toThrow();
    for (const n of [0, 1.5, 5])
      expect(() => chainModel('x', n, '0')).toThrow();
    expect(() => chainModel('x^2', 3, '0')).toThrow();
    expect(() => appliedRateModel('area', '101')).toThrow();
    expect(
      asNumber(valueAt(productModel('0', 'x', '0').derivative, rational(1n))),
    ).toBe(0);
  });
});
