import { describe, it, expect } from 'vitest';
import {
  factorial,
  permutations,
  combinations,
  orderedSelections,
  selectionGroups,
  countingUnion,
  countingStages,
  pascalRow,
  binomialCoefficient,
  simulateBinomial,
  contingency,
  sourceFlagModel,
} from './countingModels';
import { textR } from './algebraModels';
const value = (v: readonly [bigint, bigint] | null) =>
  v ? Number(v[0]) / Number(v[1]) : null;
describe('H24 exact counting and conditional probability models', () => {
  it('counts every small ordered list and subset independently, including empty and impossible selections', () => {
    for (let n = 0; n <= 6; n++)
      for (let r = 0; r <= 3; r++) {
        for (const repeat of [false, true]) {
          const brute: number[][] = [];
          const search = (p: number[]) => {
            if (p.length === r) {
              brute.push(p);
              return;
            }
            for (let x = 0; x < n; x++)
              if (repeat || !p.includes(x)) search([...p, x]);
          };
          search([]);
          expect(permutations(n, r, repeat)).toBe(BigInt(brute.length));
          expect(orderedSelections(n, r, repeat)).toHaveLength(brute.length);
          expect(
            new Set(orderedSelections(n, r, repeat).map((p) => p.join('')))
              .size,
          ).toBe(brute.length);
        }
        const subsets = Array.from({ length: 2 ** n }, (_, mask) =>
          Array.from({ length: n }, (_, i) => i).filter((i) => mask & (1 << i)),
        ).filter((a) => a.length === r);
        expect(combinations(n, r)).toBe(BigInt(subsets.length));
        const groups = selectionGroups(n, r);
        expect(groups).toHaveLength(subsets.length);
        expect(
          groups.every((g) => BigInt(g.orders.length) === factorial(r)),
        ).toBe(true);
      }
    expect(factorial(0)).toBe(1n);
    expect(factorial(20)).toBe(2432902008176640000n);
    expect(factorial(50)).toBe(
      30414093201713378043612608166064768844377641568960512000000000000n,
    );
    expect(permutations(3, 4)).toBe(0n);
    expect(combinations(3, 4)).toBe(0n);
  });
  it('deduplicates identities and counts legal continuations without assuming uniform branches', () => {
    expect(countingUnion(['A', 'B', 'C'], ['C', 'D'])).toMatchObject({
      overlap: ['C'],
      union: ['A', 'B', 'C', 'D'],
    });
    for (let a = 0; a <= 6; a++)
      for (let b = 0; b <= 6; b++)
        for (const exclude of [false, true]) {
          const m = countingStages(a, b, exclude);
          expect(m.total).toBe(a * b - (exclude ? Math.min(a, b) : 0));
          expect(
            m.rows.flat().every((p) => !exclude || p.first !== p.second),
          ).toBe(true);
        }
    expect(countingStages(3, 2, true).rows.map((r) => r.length)).toEqual([
      1, 1, 2,
    ]);
  });
  it('matches Pascal coefficients with independent repeated polynomial multiplication, including negative constants', () => {
    for (let n = 0; n <= 12; n++) {
      for (const b of [-2, -1, 0, 1, 2]) {
        let coefficients = [1n];
        for (let f = 0; f < n; f++) {
          const next = Array<bigint>(coefficients.length + 1).fill(0n);
          coefficients.forEach((v, i) => {
            next[i]! += v * BigInt(b);
            next[i + 1]! += v;
          });
          coefficients = next;
        }
        for (let k = 0; k <= n; k++)
          expect(binomialCoefficient(n, k, b)).toBe(coefficients[n - k]);
      }
      expect(pascalRow(n).reduce((a, b) => a + b, 0n)).toBe(2n ** BigInt(n));
      for (let k = 1; k < n; k++)
        expect(combinations(n, k)).toBe(
          combinations(n - 1, k - 1) + combinations(n - 1, k),
        );
    }
  });
  it('retains actual seeded trial records, zero-trial undefined frequencies and exact theoretical weights', () => {
    for (const n of [0, 1, 4, 8]) {
      const empty = simulateBinomial(n, 0, 12345),
        m = simulateBinomial(n, 80, 12345),
        more = simulateBinomial(n, 100, 12345);
      expect(empty.frequencies.every((v) => v === null)).toBe(true);
      expect(m.records).toHaveLength(80);
      expect(m.bins.reduce((a, b) => a + b, 0)).toBe(80);
      expect(m.records.every((v) => v >= 0 && v <= n)).toBe(true);
      expect(m.bins).toEqual(
        m.bins.map((_, j) => m.records.filter((v) => v === j).length),
      );
      expect(more.records.slice(0, 80)).toEqual(m.records);
      m.bins.forEach((v, j) => expect(value(m.frequencies[j]!)).toBe(v / 80));
      expect(m.theory.reduce((s, p) => s + value(p)!, 0)).toBe(1);
      expect(simulateBinomial(n, 80, 12345)).toEqual(m);
    }
    expect(textR(simulateBinomial(4, 0, 0).theory[2]!)).toBe('3/8');
    expect(simulateBinomial(4, 20, 12345).bins).not.toEqual([
      1.25, 5, 7.5, 5, 1.25,
    ]);
  });
  it('checks all small four-cell models using independently restricted numbered outcomes', () => {
    for (let ab = 0; ab <= 4; ab++)
      for (let ao = 0; ao <= 4; ao++)
        for (let bo = 0; bo <= 4; bo++)
          for (let no = 0; no <= 4; no++) {
            const cells = [ab, ao, bo, no];
            if (!cells.some(Boolean)) continue;
            const records = cells.flatMap((count, i) =>
              Array.from({ length: count }, () => ({
                a: i === 0 || i === 1,
                b: i === 0 || i === 2,
              })),
            );
            const a = records.filter((x) => x.a),
              b = records.filter((x) => x.b),
              both = records.filter((x) => x.a && x.b),
              m = contingency(cells);
            expect(value(m.aGivenB)).toBe(
              b.length ? both.length / b.length : null,
            );
            expect(value(m.bGivenA)).toBe(
              a.length ? both.length / a.length : null,
            );
            expect(m.independent).toBe(
              both.length * records.length === a.length * b.length,
            );
            expect(m.disjoint).toBe(both.length === 0);
          }
    expect(contingency([0, 3, 0, 2]).aGivenB).toBeNull();
    expect(contingency([0, 2, 3, 1]).independent).toBe(false);
  });
  it('updates base rates through exact source masses and keeps impossible conditions undefined', () => {
    for (let prior = 0; prior <= 100; prior += 5)
      for (let a = 0; a <= 100; a += 10)
        for (let b = 0; b <= 100; b += 10) {
          const m = sourceFlagModel(prior, a, b),
            massA = (prior * 10 * a) / 100,
            massOther = ((1000 - prior * 10) * b) / 100;
          expect(value(m.aFlag)).toBe(massA);
          expect(value(m.otherFlag)).toBe(massOther);
          expect(value(m.posterior)).toBe(
            massA + massOther ? massA / (massA + massOther) : null,
          );
          expect(value(m.likelihoodA)).toBe(prior ? a / 100 : null);
          expect(value(m.likelihoodOther)).toBe(prior < 100 ? b / 100 : null);
          expect(m.independent).toBe(prior === 0 || prior === 100 || a === b);
        }
    expect(textR(sourceFlagModel(5, 80, 10).posterior!)).toBe('8/27');
    expect(textR(sourceFlagModel(50, 80, 10).posterior!)).toBe('8/9');
    expect(sourceFlagModel(5, 0, 0)).toMatchObject({
      posterior: null,
      independent: true,
    });
  });
  it('rejects invalid counts, incompatible shapes and unbounded simulations', () => {
    for (const bad of [-1, 0.5, NaN, Infinity, 51]) {
      expect(() => factorial(bad)).toThrow();
      expect(() => combinations(bad, 0)).toThrow();
      expect(() => permutations(3, bad)).toThrow();
    }
    expect(() => countingUnion(['A', 'A'], ['B'])).toThrow();
    expect(() => contingency([0, 0, 0, 0])).toThrow();
    expect(() => contingency([1, 2, 3])).toThrow();
    expect(() => contingency([1, -1, 2, 3])).toThrow();
    expect(() => orderedSelections(7, 2)).toThrow();
    expect(() => simulateBinomial(9, 20, 0)).toThrow();
    expect(() => simulateBinomial(4, 1001, 0)).toThrow();
    expect(() => simulateBinomial(4, 20, -1)).toThrow();
    expect(() => sourceFlagModel(101, 20, 10)).toThrow();
    expect(() => binomialCoefficient(4, 2, 0.5)).toThrow();
  });
});
