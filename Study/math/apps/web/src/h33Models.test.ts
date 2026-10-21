import { describe, it, expect } from 'vitest';
import {
  distribution,
  distributionCases,
  affineDistribution,
  checkDistributionTable,
  tableText,
  distributionSimulation,
  binomialDistribution,
  binomialEvent,
  normalCdf,
  normalAudit,
  standardScore,
  standardDensity,
  probability4,
  checkDistributionRounded,
} from './distributionModels';
import { rational, sameR, addR, mulR } from './algebraModels';
const R = (n: number, d = 1) => rational(BigInt(n), BigInt(d));
describe('H33 exact discrete distributions and numerical normal areas', () => {
  it('merges outcomes conceptually while requiring a full valid unambiguous submitted table', () => {
    const s = '0:1/4;1:1/2;2:1/4';
    for (const raw of ['2:0.25;0:1/4;1:0.5', '0：1/4；1：2/4；2：1/4'])
      expect(checkDistributionTable(raw, s)).toBe(true);
    for (const raw of [
      '0:1/3;1:1/3;2:1/3',
      '0:-1/4;1:1;2:1/4',
      '0:1/4;1:1/4;2:1/4',
      '0:1/4;1:1/4;1.0:1/4;2:1/4',
      '0:1/4;1:1/2;2:1/4;7:0',
      '0:1/4;1:1/2;2:1/4;',
      '0:NaN',
      'eval(x)',
    ])
      expect(checkDistributionTable(raw, s), raw).toBe(false);
    expect(() =>
      distribution([
        ['0', '1/2'],
        ['1', '-1/2'],
      ]),
    ).toThrow();
    expect(() => distribution([])).toThrow();
    expect(tableText(distribution(distributionCases.heads))).toBe(s);
  });
  it('checks probability-weighted moments, unattainable means and exact affine identities', () => {
    const m = distribution(distributionCases.twoPoint);
    expect(m.mean).toEqual(R(3, 2));
    expect(m.variance).toEqual(R(9, 4));
    expect(m.support.some((v) => sameR(v, m.mean))).toBe(false);
    for (const raw of Object.values(distributionCases))
      for (let a = -3; a <= 3; a++)
        for (let b = -3; b <= 3; b++) {
          const x = distribution(raw),
            y = affineDistribution(x, String(a), String(b));
          expect(y.mean).toEqual(addR(mulR(R(a), x.mean), R(b)));
          expect(y.variance).toEqual(mulR(R(a * a), x.variance));
          if (a === 0) {
            expect(y.rows).toHaveLength(1);
            expect(y.variance[0]).toBe(0n);
          }
          expect(sameR(addR(y.variance, mulR(y.mean, y.mean)), y.second)).toBe(
            true,
          );
        }
    expect(distribution(distributionCases.rare).mean).toEqual(R(1));
    expect(distribution(distributionCases.heads).variance).toEqual(R(1, 2));
  });
  it('keeps zero-trial mean undefined and seeded draws reproducible without forcing an expected sample mean', () => {
    const m = distribution(distributionCases.twoPoint),
      zero = distributionSimulation(m, 42, 0);
    expect(zero.average).toBeNull();
    expect(zero.counts).toEqual([0, 0]);
    const a = distributionSimulation(m, 42, 10),
      b = distributionSimulation(m, 42, 100);
    expect(b.trace.slice(0, 10)).toEqual(a.trace);
    expect(b.counts.reduce((s, n) => s + n, 0)).toBe(100);
    expect(b.total).toEqual(R(3 * b.counts[1]!));
    expect(b.average).toEqual(R(3 * b.counts[1]!, 100));
    expect(distributionSimulation(m, 42, 100)).toEqual(b);
    let state = 42n;
    const expected = [];
    for (let i = 0; i < 10; i++) {
      state = (1664525n * state + 1013904223n) % 4294967296n;
      expected.push({
        state: Number(state),
        value: 2n * state + 1n < 4294967296n ? '0' : '3',
      });
    }
    expect(a.trace).toEqual(expected);
    expect(distributionSimulation(m, 1234, 10).trace).not.toEqual(a.trace);
    for (const n of [-1, 0.5, 2001])
      expect(() => distributionSimulation(m, 42, n)).toThrow();
  });
  it('independently enumerates ordered binary outcomes including n zero and p zero or one', () => {
    for (let n = 0; n <= 10; n++)
      for (const [num, den] of [
        [0, 1],
        [1, 3],
        [1, 2],
        [1, 1],
      ] as const) {
        const m = binomialDistribution(n, `${num}/${den}`),
          weights = Array.from({ length: n + 1 }, () => 0n);
        for (let mask = 0; mask < 2 ** n; mask++) {
          let successes = 0,
            w = 1n;
          for (let j = 0; j < n; j++) {
            const success = Boolean(mask & (1 << j));
            successes += Number(success);
            w *= BigInt(success ? num : den - num);
          }
          weights[successes]! += w;
        }
        m.rows.forEach((r, k) =>
          expect(r.p).toEqual(rational(weights[k]!, BigInt(den) ** BigInt(n))),
        );
        expect(m.mean).toEqual(R(n * num, den));
        expect(m.variance).toEqual(R(n * num * (den - num), den * den));
        for (let k = 0; k <= n; k++) {
          expect(binomialEvent(m, k, 'exact')).toEqual(m.rows[k]!.p);
          const expected = weights.slice(k).reduce((s, w) => s + w, 0n);
          expect(binomialEvent(m, k, 'at-least')).toEqual(
            rational(expected, BigInt(den) ** BigInt(n)),
          );
        }
      }
    expect(binomialEvent(binomialDistribution(4, '1/2'), 2, 'exact')).toEqual(
      R(3, 8),
    );
    expect(() => binomialDistribution(3, '4/3')).toThrow();
    expect(binomialDistribution(12, '1/97').mean).toEqual(R(12, 97));
  });
  it('checks numerical CDF against independent erf references, symmetry and monotonicity', () => {
    const refs = {
      '-8': 6.106226635438361e-16,
      '-6': 9.865876449133282e-10,
      '-4': 3.167124183311998e-5,
      '-3': 0.0013498980316301035,
      '-2': 0.022750131948179153,
      '-1.5': 0.06680720126885809,
      '-1': 0.15865525393145713,
      '-0.5': 0.30853753872598694,
      '0': 0.5,
      '0.5': 0.691462461274013,
      '1': 0.8413447460685428,
      '1.5': 0.9331927987311419,
      '2': 0.9772498680518209,
      '3': 0.9986501019683699,
      '4': 0.9999683287581669,
      '6': 0.9999999990134123,
      '8': 0.9999999999999993,
    };
    for (const [z, p] of Object.entries(refs))
      expect(Math.abs(normalCdf(Number(z)) - p)).toBeLessThan(2e-12);
    let prev = 0;
    for (let i = -64; i <= 64; i++) {
      const z = i / 8,
        v = normalCdf(z);
      expect(v).toBeGreaterThanOrEqual(prev);
      expect(Math.abs(v + normalCdf(-z) - 1)).toBeLessThan(2e-14);
      prev = v;
    }
    for (const z of [-9, 9, Infinity, NaN])
      expect(() => normalCdf(z)).toThrow();
  });
  it('independently integrates density by a fine trapezoid rule and preserves corresponding intervals under standardisation', () => {
    const trap = (a: number, b: number, n: number) => {
      const h = (b - a) / n;
      let sum = (standardDensity(a) + standardDensity(b)) / 2;
      for (let i = 1; i < n; i++) sum += standardDensity(a + i * h);
      return sum * h;
    };
    expect(trap(-8, 8, 100000)).toBeCloseTo(1, 9);
    expect(trap(-1, 1, 100000)).toBeCloseTo(normalCdf(1) - normalCdf(-1), 9);
    for (const mean of [-10, 0, 50, 100])
      for (const sd of [1, 2, 5, 10]) {
        const m = normalAudit(
          String(mean),
          String(sd),
          String(mean - sd),
          String(mean + sd),
        );
        expect(m.zl).toEqual(R(-1));
        expect(m.zh).toEqual(R(1));
        expect(m.probability).toBeCloseTo(0.6826894921370859, 11);
        expect(m.pointProbability).toBe(0);
      }
    expect(standardScore('85', '100', '10')).toEqual(R(-3, 2));
    for (const sd of ['0', '-1'])
      expect(() => standardScore('1', '0', sd)).toThrow();
    expect(() => normalAudit('0', '1', '2', '1')).toThrow();
  });
  it('labels rounding deliberately and rejects exact-looking or invalid probability formats', () => {
    expect(probability4(normalCdf(1.5))).toBe('0.9332');
    expect(probability4(1 - normalCdf(2))).toBe('0.0228');
    expect(probability4(normalCdf(1.5) - normalCdf(-1.5))).toBe('0.8664');
    expect(checkDistributionRounded('0.6827', '0.6827')).toBe(true);
    for (const raw of [
      '0.68268949',
      '0.683',
      '68.27%',
      '6827/10000',
      '-0.6827',
      '0.6826',
    ])
      expect(checkDistributionRounded(raw, '0.6827')).toBe(false);
    expect(checkDistributionRounded('2.0000', '2.0000')).toBe(false);
  });
});
