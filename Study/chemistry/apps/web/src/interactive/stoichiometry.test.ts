import { describe, expect, it } from 'vitest';
import { limeYield, waterRecipe } from './stoichiometry';

describe('ideal water recipe', () => {
  it('finds oxygen as the bottleneck and accounts for leftover hydrogen', () => {
    expect(waterRecipe(4, 1)).toMatchObject({
      limiting: 'oxygen',
      water: 2,
      remainingHydrogen: 2,
      remainingOxygen: 0,
      waterMass: 36,
      initialMass: 40,
      remainingMass: 4,
    });
  });
  it('finds hydrogen as the bottleneck even with more moles than oxygen', () => {
    expect(waterRecipe(6, 4)).toMatchObject({
      limiting: 'hydrogen',
      water: 6,
      remainingOxygen: 1,
      waterMass: 108,
    });
  });
  it('uses both reactants together at an exact stoichiometric ratio', () => {
    expect(waterRecipe(4, 2)).toMatchObject({
      limiting: 'both',
      remainingHydrogen: 0,
      remainingOxygen: 0,
    });
  });
  it('conserves mass and both atom inventories across all offered settings', () => {
    for (const h of [1, 2, 4, 6])
      for (const o of [1, 2, 4, 6]) {
        const r = waterRecipe(h, o);
        expect(r.waterMass + r.remainingMass).toBe(r.initialMass);
        expect(r.water * 2 + r.remainingHydrogen * 2).toBe(h * 2);
        expect(r.water + r.remainingOxygen * 2).toBe(o * 2);
        expect(r.remainingHydrogen).toBeGreaterThanOrEqual(0);
        expect(r.remainingOxygen).toBeGreaterThanOrEqual(0);
      }
  });
  it('cannot produce water when either reactant is absent', () => {
    expect(waterRecipe(0, 4).water).toBe(0);
    expect(waterRecipe(4, 0).water).toBe(0);
  });
});

describe('lime yield and sample contamination', () => {
  it('converts feed mass to the theoretical mass of the specified product', () => {
    expect(limeYield(10, 4.48).theoreticalMass).toBeCloseTo(5.6);
    expect(limeYield(10, 4.48).actualPercent).toBeCloseTo(80);
    expect(limeYield(10, 5.04).actualPercent).toBeCloseTo(90);
  });
  it('keeps impurity out of actual yield even when the apparent value exceeds 100%', () => {
    const r = limeYield(10, 4.48, 1.4);
    expect(r.sampleMass).toBeCloseTo(5.88);
    expect(r.apparentPercent).toBeCloseTo(105);
    expect(r.actualPercent).toBeCloseTo(80);
  });
  it('rejects invalid mass and amount inputs', () => {
    for (const bad of [-1, Infinity, NaN]) {
      expect(() => waterRecipe(bad, 2)).toThrow(RangeError);
      expect(() => limeYield(10, bad)).toThrow(RangeError);
    }
    expect(() => limeYield(0, 1)).toThrow(RangeError);
  });
});
