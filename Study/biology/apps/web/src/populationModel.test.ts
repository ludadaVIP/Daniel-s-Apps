import { describe, expect, it } from 'vitest';
import {
  meadowGrid,
  meadowCensus,
  meadowArea,
  pathSample,
  randomQuadrats,
  estimateMeadow,
  populationBalance,
  limitingResource,
  resourceScenarios,
  variationBins,
  leafLengths,
  spotCounts,
  offspringPossibilities,
  fictionalLeafLength,
  mean,
  type Genotype,
} from './populationModel';
describe('virtual ecological evidence', () => {
  it('keeps every cell unique, exact census and area explicit; a census estimate equals truth', () => {
    expect(meadowGrid).toHaveLength(36);
    expect(new Set(meadowGrid.map((q) => q.id)).size).toBe(36);
    expect(meadowArea).toBe(36);
    expect(meadowCensus).toBe(96);
    expect(estimateMeadow(meadowGrid.map((q) => q.id)).estimate).toBe(
      meadowCensus,
    );
  });
  it('uses sampled area rather than whole area as the density denominator and exposes convenience bias', () => {
    const r = estimateMeadow(pathSample);
    expect(r.count).toBe(4);
    expect(r.sampledArea).toBe(6);
    expect(r.estimate).toBe(24);
    expect(() => estimateMeadow([])).toThrow();
    expect(() => estimateMeadow(['Q01', 'Q01'])).toThrow();
    expect(() => estimateMeadow(['Q99'])).toThrow();
  });
  it('draws reproducible distinct quadrats, retaining variation between seeds', () => {
    expect(randomQuadrats(42)).toEqual(randomQuadrats(42));
    const estimates = new Set<number>();
    for (let seed = 1; seed < 40; seed++) {
      const ids = randomQuadrats(seed, 12);
      expect(new Set(ids).size).toBe(12);
      estimates.add(estimateMeadow(ids).estimate);
    }
    expect(estimates.size).toBeGreaterThan(10);
    expect(() => randomQuadrats(0, 37)).toThrow();
  });
  it('balances all four population flows and rejects impossible removals', () => {
    expect(populationBalance(20, 5, 3, 2, 4)).toBe(20);
    expect(populationBalance(20, 5, 3, 6, 4)).toBe(24);
    expect(() => populationBalance(2, 0, 3, 0, 0)).toThrow();
    expect(() => populationBalance(2, -1, 0, 0, 0)).toThrow();
  });
  it('changes the limiting resource without inventing additive capacity or causal survey evidence', () => {
    expect(limitingResource(resourceScenarios.dry)).toEqual({
      capacity: 3,
      limits: ['water'],
    });
    expect(limitingResource(resourceScenarios.watered)).toEqual({
      capacity: 6,
      limits: ['minerals'],
    });
    expect(limitingResource(resourceScenarios.shaded)).toEqual({
      capacity: 2,
      limits: ['light'],
    });
    expect(
      limitingResource({ water: 2, light: 2, minerals: 6 }).limits,
    ).toEqual(['water', 'light']);
    expect(mean([])).toBeNull();
  });
});
describe('fictional trait models', () => {
  it('retains every record exactly once in nonoverlapping variation bins', () => {
    expect(variationBins('length').reduce((s, b) => s + b.count, 0)).toBe(
      leafLengths.length,
    );
    expect(variationBins('spots').reduce((s, b) => s + b.count, 0)).toBe(
      spotCounts.length,
    );
    expect(variationBins('spots').map((b) => b.count)).toEqual([3, 4, 5]);
  });
  it('distinguishes environmental changes for one genotype from differences under the same environment', () => {
    for (const g of ['AA', 'Aa', 'aa'] as Genotype[])
      expect(
        fictionalLeafLength(g, 'sheltered') - fictionalLeafLength(g, 'exposed'),
      ).toBe(4);
    expect(fictionalLeafLength('AA', 'exposed')).toBe(
      fictionalLeafLength('aa', 'sheltered'),
    );
  });
  it('takes one allele from each parent and retains all four equally likely gamete combinations', () => {
    for (const a of ['AA', 'Aa', 'aa'] as Genotype[])
      for (const b of ['AA', 'Aa', 'aa'] as Genotype[]) {
        const possibilities = offspringPossibilities(a, b);
        expect(possibilities).toHaveLength(4);
        for (const p of possibilities) {
          expect(a.includes(p.first)).toBe(true);
          expect(b.includes(p.second)).toBe(true);
        }
      }
    expect(offspringPossibilities('Aa', 'Aa').map((p) => p.genotype)).toEqual([
      'AA',
      'Aa',
      'Aa',
      'aa',
    ]);
    expect(
      offspringPossibilities('AA', 'aa').every((p) => p.genotype === 'Aa'),
    ).toBe(true);
  });
});
