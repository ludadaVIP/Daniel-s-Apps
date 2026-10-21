import { describe, it, expect } from 'vitest';
import {
  finiteInference,
  finiteInferenceSimulation,
  knownSigmaInterval,
  coverageSimulation,
  exactBinomialTest,
  practicalEvidence,
  checkInferenceCode,
} from './statisticalInferenceModels';
import { rational, textR } from './algebraModels';
import { checkAnswer } from './model';
const R = (n: number, d = 1) => rational(BigInt(n), BigInt(d));
describe('H34 sampling design, coverage and planned inference', () => {
  it('independently enumerates every finite-population subset and preserves bias of a restricted frame', () => {
    for (let n = 1; n <= 6; n++) {
      const m = finiteInference(n),
        expected = [];
      for (let mask = 0; mask < 64; mask++) {
        const indices = [];
        for (let i = 0; i < 6; i++) if (mask & (1 << i)) indices.push(i);
        if (indices.length === n) expected.push(indices.join(','));
      }
      expect(m.samples.map((s) => s.indices.join(',')).sort()).toEqual(
        expected.sort(),
      );
      expect(m.m.mean).toEqual(R(3));
      expect(m.bias).toEqual(R(0));
      expect(m.m.variance).toEqual(R(9 * (6 - n), 5 * n));
    }
    const m = finiteInference(2);
    expect(m.samples).toHaveLength(15);
    expect(m.m.rows.map((r) => [textR(r.value), textR(r.p)])).toEqual([
      ['0', '1/5'],
      ['3', '3/5'],
      ['6', '1/5'],
    ]);
    expect(m.samples[0]!.error).toEqual(R(-3));
    for (let n = 1; n <= 3; n++) {
      const b = finiteInference(n, 'near');
      expect(b.m.mean).toEqual(R(0));
      expect(b.bias).toEqual(R(-3));
      expect(b.m.variance).toEqual(R(0));
      expect(b.mse).toEqual(R(9));
    }
    expect(
      checkAnswer('3sqrt(10)/5', {
        kind: 'radical',
        value: finiteInference(2).m.sd,
      }),
    ).toBe(true);
  });
  it('keeps zero-repetition quantities undefined and auditably samples valid subsets with a reproducible prefix', () => {
    const zero = finiteInferenceSimulation(2, 'all', 0, 42);
    expect(zero.average).toBeNull();
    expect(zero.empirical.every((r) => r.frequency === null)).toBe(true);
    const a = finiteInferenceSimulation(2, 'all', 10, 42),
      b = finiteInferenceSimulation(2, 'all', 100, 42);
    expect(b.draws.slice(0, 10)).toEqual(a.draws);
    expect(b.empirical.reduce((s, r) => s + r.count, 0)).toBe(100);
    expect(b.exact.m.variance).toEqual(R(18, 5));
    for (const draw of b.draws) {
      expect(new Set(draw.ids).size).toBe(2);
      expect(draw.mean).toEqual(
        R(draw.indices.filter((i) => i >= 3).length * 6, 2),
      );
    }
    const expectedTotal = b.draws.reduce(
      (s, d) => s + (Number(d.mean[0]) * 2) / Number(d.mean[1]),
      0,
    );
    expect(b.average).toEqual(R(expectedTotal, 200));
    expect(finiteInferenceSimulation(2, 'all', 100, 42)).toEqual(b);
    expect(finiteInferenceSimulation(3, 'near', 100, 42).average).toEqual(R(0));
  });
  it('constructs exact known-sigma intervals with their stated assumptions and critical values', () => {
    const c = knownSigmaInterval('10', '4', 16, '2');
    expect(c.se).toEqual(R(1));
    expect(c.margin).toEqual(R(2));
    expect(c.value).toBe('[8,12]');
    expect(c.coverage).toBeCloseTo(0.9544997361036416, 11);
    expect(knownSigmaInterval('10', '4', 64, '2').value).toBe('[9,11]');
    for (const raw of ['[8,12]', '[16/2,24/2]'])
      expect(checkAnswer(raw, { kind: 'real-union', value: c.value })).toBe(
        true,
      );
    for (const raw of ['(8,12)', '[12,8]', '[9,11]'])
      expect(checkAnswer(raw, { kind: 'real-union', value: c.value })).toBe(
        false,
      );
    for (const n of [1, 4, 16, 64]) {
      const a = knownSigmaInterval('10', '4', n, '1'),
        b = knownSigmaInterval('10', '4', n, '2');
      expect(a.se).toEqual(b.se);
      expect(Number(b.margin[0]) / Number(b.margin[1])).toBe(
        (2 * Number(a.margin[0])) / Number(a.margin[1]),
      );
    }
    expect(knownSigmaInterval('10', '4', 16, '1.96').coverage).toBeCloseTo(
      0.9500042097035591,
      11,
    );
  });
  it('generates n raw observations per normal sample and counts actual coverage without forcing nominal frequency', () => {
    const a = coverageSimulation(10, '4', 16, '2', 10, 42),
      b = coverageSimulation(10, '4', 16, '2', 200, 42);
    expect(b.intervals.slice(0, 10)).toEqual(a.intervals);
    let hits = 0;
    for (const r of b.intervals) {
      expect(r.observations).toHaveLength(16);
      const mean = r.observations.reduce((s, x) => s + x, 0) / 16;
      expect(r.mean).toBe(mean);
      expect(r.lower).toBe(mean - 2);
      expect(r.upper).toBe(mean + 2);
      const hit = mean - 2 <= 10 && 10 <= mean + 2;
      expect(r.contains).toBe(hit);
      hits += Number(hit);
    }
    expect(b.hits).toBe(hits);
    expect(b.frequency).toEqual(R(hits, 200));
    const narrow = coverageSimulation(10, '4', 16, '1', 200, 42);
    expect(narrow.hits).toBeLessThanOrEqual(b.hits);
    const shifted = coverageSimulation(20, '4', 16, '2', 10, 42);
    a.intervals.forEach((r, i) =>
      expect(shifted.intervals[i]!.mean - r.mean).toBeCloseTo(10, 11),
    );
    const zero = coverageSimulation(10, '4', 16, '2', 0, 42);
    expect(zero.frequency).toBeNull();
    expect(zero.intervals).toEqual([]);
  });
  it('independently counts fair ordered outcomes for inclusive one- and two-sided p-values and rejection rates', () => {
    for (let n = 1; n <= 10; n++) {
      const heads = Array.from({ length: 2 ** n }, (_, mask) => {
        let k = 0;
        for (let j = 0; j < n; j++) k += Number(Boolean(mask & (1 << j)));
        return k;
      });
      for (const alternative of ['upper', 'lower', 'two-sided'] as const) {
        const tail = (k0: number) =>
          heads.filter((k) =>
            alternative === 'upper'
              ? k >= k0
              : alternative === 'lower'
                ? k <= k0
                : Math.abs(k - n / 2) >= Math.abs(k0 - n / 2),
          ).length;
        const critical = Array.from({ length: n + 1 }, (_, k) => k).filter(
          (k) => 10 * tail(k) <= 2 ** n,
        );
        for (let k = 0; k <= n; k++) {
          const m = exactBinomialTest(n, k, alternative, '1/10');
          expect(m.p).toEqual(R(tail(k), 2 ** n));
          expect(m.decision).toBe(
            10 * tail(k) <= 2 ** n ? 'reject' : 'do-not-reject',
          );
          expect(m.critical).toEqual(critical);
          expect(m.falsePositive).toEqual(
            R(heads.filter((j) => critical.includes(j)).length, 2 ** n),
          );
        }
      }
    }
  });
  it('retains discrete alpha boundaries and refuses to equate non-rejection with confirmation', () => {
    const upper = exactBinomialTest(4, 4, 'upper', '1/10');
    expect(upper.p).toEqual(R(1, 16));
    expect(upper.falsePositive).toEqual(R(1, 16));
    expect(exactBinomialTest(4, 4, 'two-sided', '1/10').critical).toEqual([]);
    expect(exactBinomialTest(4, 4, 'two-sided').p).toEqual(R(1, 8));
    expect(exactBinomialTest(4, 3).p).toEqual(R(5, 16));
    expect(exactBinomialTest(4, 4, 'upper', '1/16').decision).toBe('reject');
    expect(checkInferenceCode('不拒绝H0', 'do-not-reject')).toBe(true);
    expect(checkInferenceCode('accept h0', 'do-not-reject')).toBe(false);
    expect(checkInferenceCode('条件不足', 'not-justified')).toBe(true);
  });
  it('separates equal test evidence from effect size and compares exact interval endpoints with practical targets', () => {
    const tiny = practicalEvidence('tinyPrecise'),
      large = practicalEvidence('largePrecise'),
      noisy = practicalEvidence('largeNoisy');
    expect(tiny.interval.se).toEqual(R(1, 25));
    expect(tiny.z).toEqual(R(5));
    expect(tiny.interval.value).toBe('[76/625,174/625]');
    expect(tiny.p).toBeCloseTo(0.000000573303143758, 14);
    expect(tiny.p).toBe(large.p);
    expect(tiny.meaning).toBe('below-target');
    expect(large.meaning).toBe('meets-target');
    expect(noisy.meaning).toBe('uncertain');
    expect(noisy.decision).toBe('do-not-reject');
    expect(noisy.p).toBeCloseTo(0.31731050786291415, 11);
    expect(practicalEvidence('harmful').harm).toBe(true);
    expect(practicalEvidence('harmful').decision).toBe('reject');
    expect(practicalEvidence('largePrecise', '152/125').meaning).toBe(
      'meets-target',
    );
    expect(practicalEvidence('largePrecise', '348/125').meaning).toBe(
      'uncertain',
    );
    expect(practicalEvidence('largePrecise', '3').meaning).toBe('below-target');
  });
  it('rejects invalid frames, sample sizes, repetitions, scales and procedures instead of inventing zero estimates', () => {
    for (const n of [0, 7, 0.5]) expect(() => finiteInference(n)).toThrow();
    expect(() => finiteInference(4, 'near')).toThrow();
    expect(() => finiteInferenceSimulation(2, 'all', -1, 42)).toThrow();
    for (const sd of ['0', '-1'])
      expect(() => knownSigmaInterval('10', sd, 16)).toThrow();
    expect(() => knownSigmaInterval('10', '4', 3)).toThrow();
    expect(() => coverageSimulation(10, '4', 10000, '2', 1, 42)).toThrow();
    expect(() => coverageSimulation(10, '4', 16, '2', -1, 42)).toThrow();
    for (const alpha of ['0', '1', '-1/10'])
      expect(() => exactBinomialTest(4, 4, 'upper', alpha)).toThrow();
    expect(() => exactBinomialTest(4, 5)).toThrow();
    expect(() => practicalEvidence('tinyPrecise', '0')).toThrow();
  });
});
