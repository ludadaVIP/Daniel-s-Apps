import { describe, expect, it } from 'vitest';
import {
  averageGasRate,
  changedRateVariables,
  disturbedEquilibrium,
  equilibrate,
  equilibriumFlows,
  initialEquilibrium,
  rateTimes,
  rateTrials,
} from './reactionEvidence';

describe('authored reaction-rate teaching records', () => {
  it('identifies the changed variable, including the confounded pair', () => {
    const [a, b, c, d] = rateTrials;
    expect(changedRateVariables(a, b)).toEqual(['concentration']);
    expect(changedRateVariables(a, d)).toEqual(['temperature']);
    expect(changedRateVariables(c, d)).toEqual(['surface']);
    expect(changedRateVariables(a, c)).toEqual(['temperature', 'surface']);
  });
  it('keeps cumulative gas nondecreasing with a common final volume', () => {
    for (const trial of rateTrials) {
      expect(trial.gas.length).toBe(rateTimes.length);
      expect(trial.gas[0]).toBe(0);
      expect(trial.gas[6]).toBe(40);
      for (let i = 1; i < trial.gas.length; i++)
        expect(trial.gas[i]).toBeGreaterThanOrEqual(trial.gas[i - 1]!);
    }
  });
  it('uses differences over an interval, not total volume divided by end time', () => {
    expect(averageGasRate(rateTrials[0], 0, 20)).toBe(0.75);
    expect(averageGasRate(rateTrials[1], 0, 20)).toBe(1.25);
    expect(averageGasRate(rateTrials[0], 10, 30)).toBe(0.65);
    expect(() => averageGasRate(rateTrials[0], 20, 20)).toThrow(RangeError);
    expect(() => averageGasRate(rateTrials[0], 5, 20)).toThrow(RangeError);
  });
});

describe('fictional reversible A₂ ⇌ 2A model', () => {
  it('starts at dynamic equilibrium with both flows nonzero', () => {
    expect(equilibriumFlows(initialEquilibrium)).toEqual({
      forward: 4,
      reverse: 4,
    });
  });
  it('preserves atomic inventory and equal nonzero flows after each perturbation', () => {
    for (const change of ['compress', 'warm', 'catalyst', 'add-a'] as const) {
      const immediate = disturbedEquilibrium(change),
        final = equilibrate(immediate);
      expect(2 * final.dimer + final.monomer).toBeCloseTo(
        2 * immediate.dimer + immediate.monomer,
        12,
      );
      const flow = equilibriumFlows(final);
      expect(flow.forward).toBeGreaterThan(0);
      expect(flow.forward).toBeCloseTo(flow.reverse, 12);
    }
  });
  it('does not change amounts instantaneously when volume is halved', () => {
    const immediate = disturbedEquilibrium('compress');
    expect(immediate.monomer).toBe(2);
    expect(immediate.dimer).toBe(2);
    expect(equilibriumFlows(immediate)).toEqual({ forward: 4, reverse: 8 });
    const final = equilibrate(immediate);
    expect(final.monomer).toBeCloseTo(1.5, 12);
    expect(final.dimer).toBeCloseTo(2.25, 12);
    expect(final.monomer / final.volume).toBeGreaterThan(
      initialEquilibrium.monomer / initialEquilibrium.volume,
    );
  });
  it('warms the endothermic-forward model toward more monomer', () => {
    const final = equilibrate(disturbedEquilibrium('warm'));
    expect(final.monomer).toBeGreaterThan(initialEquilibrium.monomer);
  });
  it('changes both flows but not the equilibrium composition with a catalyst', () => {
    const final = equilibrate(disturbedEquilibrium('catalyst'));
    expect(final.monomer).toBeCloseTo(initialEquilibrium.monomer, 12);
    expect(final.dimer).toBeCloseTo(initialEquilibrium.dimer, 12);
    expect(equilibriumFlows(final)).toEqual({ forward: 12, reverse: 12 });
  });
  it('consumes some added product without cancelling the addition completely', () => {
    const immediate = disturbedEquilibrium('add-a'),
      final = equilibrate(immediate);
    expect(immediate.monomer).toBe(4);
    expect(final.monomer).toBeLessThan(immediate.monomer);
    expect(final.monomer).toBeGreaterThan(initialEquilibrium.monomer);
    expect(2 * final.dimer + final.monomer).toBe(8);
  });
});
