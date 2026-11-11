import { describe, expect, it } from 'vitest';
import {
  atpBudget,
  chromosomeCounts,
  gametes,
  photoCurve,
  photosynthesisAtoms,
  photosynthesisRate,
  punnett,
  sampleOffspring,
} from './energyGeneModel';
describe('energy and inheritance classroom models', () => {
  it('conserves each atom in the net equation while retaining oxygen provenance', () => {
    expect(photosynthesisAtoms.reactants).toEqual(photosynthesisAtoms.products);
    expect(photosynthesisAtoms.reactants).toEqual({ C: 6, H: 12, O: 18 });
    expect(photosynthesisAtoms.beforeCancellation.reactants).toEqual(
      photosynthesisAtoms.beforeCancellation.products,
    );
    expect(photosynthesisAtoms.beforeCancellation.reactants).toEqual({
      C: 6,
      H: 24,
      O: 24,
    });
    expect(photosynthesisAtoms.releasedOxygenSource).toBe('water');
    expect(photosynthesisAtoms.carbonSource).toBe('CO2');
  });
  it('saturates light and permits a different factor to limit', () => {
    const fixed = { light: 50, co2: 20, temperature: 25 };
    expect(photosynthesisRate(fixed).rate).toBe(40);
    expect(photosynthesisRate({ ...fixed, light: 100 }).rate).toBe(40);
    expect(photosynthesisRate({ ...fixed, co2: 50 }).rate).toBe(100);
    expect(photosynthesisRate(fixed).limitingFactors).toEqual(['co2']);
    expect(photoCurve('temperature', { ...fixed, co2: 100 })[20]?.rate).toBe(0);
    for (const light of [-20, 0, 20, 100, 300])
      for (const temperature of [-5, 25, 55]) {
        const r = photosynthesisRate({ light, temperature, co2: 100 });
        expect(r.rate).toBeGreaterThanOrEqual(0);
        expect(r.rate).toBeLessThanOrEqual(100);
        expect(r.assumptions.join(' ')).toContain('not growth');
      }
  });
  it('accounts for every ATP token without creating energy', () => {
    expect(atpBudget(3, 0, 5)).toMatchObject({
      completed: 3,
      remaining: 0,
      unmet: 2,
      energyInputRequired: false,
    });
    const result = atpBudget(3, 4, 5);
    expect(result.start + result.regenerated).toBe(
      result.completed + result.remaining,
    );
    expect(result.energyInputRequired).toBe(true);
  });
  it('distinguishes ploidy, chromosomes and DNA through S and both divisions', () => {
    expect(chromosomeCounts.afterS).toMatchObject({
      chromosomesPerCell: 4,
      dnaMoleculesPerCell: 8,
      ploidy: 2,
      C: 4,
    });
    expect(chromosomeCounts.afterI).toMatchObject({
      chromosomesPerCell: 2,
      dnaMoleculesPerCell: 4,
      ploidy: 1,
      C: 2,
    });
    expect(chromosomeCounts.afterII).toMatchObject({
      chromosomesPerCell: 2,
      dnaMoleculesPerCell: 2,
      ploidy: 1,
      C: 1,
    });
    for (const stage of ['afterS', 'afterI', 'afterII'] as const)
      expect(
        chromosomeCounts[stage].cells *
          chromosomeCounts[stage].dnaMoleculesPerCell,
      ).toBe(8);
  });
  it('normalizes probabilities and preserves one allele from each parent', () => {
    for (const a of ['AA', 'Aa', 'aa'] as const)
      for (const b of ['AA', 'Aa', 'aa'] as const) {
        const result = punnett(a, b);
        expect(
          Object.values(result.probabilities).reduce((x, y) => x + y, 0),
        ).toBe(1);
        result.cells.forEach((c) => {
          expect(gametes(a)).toContain(c.fromFirst);
          expect(gametes(b)).toContain(c.fromSecond);
        });
      }
    expect(punnett('Aa', 'Aa').probabilities).toEqual({
      AA: 0.25,
      Aa: 0.5,
      aa: 0.25,
    });
    expect(punnett('Aa', 'aa').dominantPhenotype).toBe(0.5);
  });
  it('reproduces seeded independent draws and allows small-sample variation', () => {
    const one = sampleOffspring('Aa', 'Aa', 40, 42);
    expect(one).toEqual(sampleOffspring('Aa', 'Aa', 40, 42));
    expect(one.offspring).not.toEqual(
      sampleOffspring('Aa', 'Aa', 40, 43).offspring,
    );
    expect(Object.values(one.counts).reduce((x, y) => x + y, 0)).toBe(40);
    expect(sampleOffspring('AA', 'aa', 100, 1).counts).toEqual({
      AA: 0,
      Aa: 100,
      aa: 0,
    });
    expect(sampleOffspring('Aa', 'Aa', 4, 42).counts).not.toEqual({
      AA: 1,
      Aa: 2,
      aa: 1,
    });
    expect(sampleOffspring('Aa', 'Aa', 4, 42).offspring).toEqual(
      one.offspring.slice(0, 4),
    );
    const originCheck = sampleOffspring('AA', 'Aa', 400, 27);
    originCheck.offspring.forEach((child) => {
      expect(child.fromFirst).toBe('A');
      expect(gametes('Aa')).toContain(child.fromSecond);
    });
    expect(originCheck.counts.aa).toBe(0);
    expect(Math.abs(originCheck.counts.AA / 400 - 0.5)).toBeLessThan(0.08);
  });
});
