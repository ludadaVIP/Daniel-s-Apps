import { describe, expect, it } from 'vitest';
import {
  calorimetryLedger,
  calorimetryRecords,
  combineHessSteps,
  equationText,
  hessFactors,
  hessSteps,
  hessTargetMatches,
  solutionHeat,
} from './thermochemistry';

describe('virtual calorimetry records', () => {
  it('uses both solution masses and gives opposite heat signs', () => {
    const a = calorimetryLedger(calorimetryRecords[0]);
    expect(a.massG).toBe(100);
    expect(a.reactedMol).toBe(0.05);
    expect(a.deltaT).toBeCloseTo(6.8);
    expect(a.solutionJ).toBeCloseTo(2842.4);
    expect(a.apparentReactionKj).toBeCloseTo(-2.8424);
    expect(a.apparentMolarKj).toBeCloseTo(-56.848);
  });
  it('doubles heat, not temperature rise or per-mole enthalpy', () => {
    const a = calorimetryLedger(calorimetryRecords[0]);
    const b = calorimetryLedger(calorimetryRecords[1]);
    expect(b.solutionJ).toBeCloseTo(2 * a.solutionJ);
    expect(b.deltaT).toBe(a.deltaT);
    expect(b.apparentMolarKj).toBe(a.apparentMolarKj);
  });
  it('does not treat heat lost from the solution as a changed intrinsic enthalpy', () => {
    const a = calorimetryLedger(calorimetryRecords[0]);
    const c = calorimetryLedger(calorimetryRecords[2]);
    expect(c.solutionJ).toBeCloseTo(2340.8);
    expect(c.apparentMolarKj).toBeCloseTo(-46.816);
    expect(calorimetryRecords[2].heatLoss).toBe(true);
    expect(Math.abs(c.apparentMolarKj)).toBeLessThan(
      Math.abs(a.apparentMolarKj),
    );
  });
  it('handles cooling, no temperature change, and invalid inputs', () => {
    expect(solutionHeat(100, 30, 25)).toBe(-2090);
    expect(solutionHeat(100, 25, 25)).toBe(0);
    for (const mass of [0, -1, NaN, Infinity])
      expect(() => solutionHeat(mass, 25, 30)).toThrow(RangeError);
    expect(() => solutionHeat(100, NaN, 30)).toThrow(RangeError);
  });
});

describe('Hess equation inventory', () => {
  it('cancels CO and adds enthalpies for the forward target', () => {
    expect(combineHessSteps(1, 1)).toEqual({
      inventory: [-1, -1, 0, 1],
      enthalpyKj: -394,
      cancelledCo: 1,
    });
    expect(equationText(combineHessSteps(1, 1).inventory)).toBe(
      'C(s, graphite) + O₂(g) → CO₂(g)',
    );
  });
  it('reverses signs and scales quantities with equation multipliers', () => {
    expect(combineHessSteps(-1, -1).enthalpyKj).toBe(394);
    expect(combineHessSteps(2, 2).enthalpyKj).toBe(-788);
    expect(combineHessSteps(-2, -2).enthalpyKj).toBe(788);
    expect(equationText(combineHessSteps(-1, -1).inventory)).toBe(
      'CO₂(g) → C(s, graphite) + O₂(g)',
    );
  });
  it('conserves C and O and checks the entire target, not just a heat number', () => {
    for (const a of hessFactors)
      for (const b of hessFactors) {
        const result = combineHessSteps(a, b);
        const [c, o2, co, co2] = result.inventory;
        expect(c + co + co2).toBe(0);
        expect(2 * o2 + co + 2 * co2).toBe(0);
        expect(hessTargetMatches(result.inventory, a)).toBe(a === b);
        expect(result.cancelledCo).toBe(
          a * b > 0 ? Math.min(Math.abs(a), Math.abs(b)) : 0,
        );
      }
    expect(combineHessSteps(1, 2).inventory[2]).toBe(-1);
    expect(combineHessSteps(1, -1).cancelledCo).toBe(0);
  });
  it('closes an energy cycle and rejects unsupported equation factors', () => {
    expect(hessSteps[0].enthalpyKj + hessSteps[1].enthalpyKj + 394).toBe(0);
    expect(() => combineHessSteps(0 as never, 1)).toThrow(RangeError);
  });
});
