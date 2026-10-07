import { describe, expect, it } from 'vitest';
import {
  ethanoicAcidHydronium,
  phFromHydronium,
  strongAcidHydronium,
} from './acidMath';

describe('25 °C introductory acid models', () => {
  it('has neutral pure water at zero added strong acid', () => {
    expect(strongAcidHydronium(0)).toBe(1e-7);
    expect(phFromHydronium(strongAcidHydronium(0))).toBe(7);
  });

  it('makes tenfold dilution increase pH by about one away from neutrality', () => {
    const before = phFromHydronium(strongAcidHydronium(0.01));
    const after = phFromHydronium(strongAcidHydronium(0.001));
    expect(before).toBeCloseTo(2, 6);
    expect(after - before).toBeCloseTo(1, 6);
  });

  it('approaches pH 7 from below under extreme dilution, never becoming alkaline', () => {
    let previous = 0;
    for (const c of [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12]) {
      const ph = phFromHydronium(strongAcidHydronium(c));
      expect(ph).toBeGreaterThan(previous);
      expect(ph).toBeLessThan(7);
      previous = ph;
    }
    expect(phFromHydronium(strongAcidHydronium(1e-8))).toBeCloseTo(6.9783, 4);
  });

  it('satisfies the ethanoic-acid equilibrium equation across every preset', () => {
    for (const c of [0.001, 0.01, 0.1]) {
      const h = ethanoicAcidHydronium(c);
      expect(h).toBeGreaterThan(0);
      expect(h).toBeLessThan(c);
      expect((h * h) / (c - h)).toBeCloseTo(1.8e-5, 12);
    }
  });

  it('gives about 1.3% ionisation for 0.1 mol/L ethanoic acid', () => {
    const h = ethanoicAcidHydronium(0.1);
    expect((h / 0.1) * 100).toBeCloseTo(1.3, 1);
    expect(phFromHydronium(h)).toBeCloseTo(2.88, 2);
  });

  it('does not mistake concentration for strength', () => {
    expect(strongAcidHydronium(0.01)).toBeGreaterThan(
      ethanoicAcidHydronium(0.01),
    );
    expect(ethanoicAcidHydronium(0.1)).toBeGreaterThan(
      strongAcidHydronium(0.0001),
    );
  });

  it('rejects unsupported inputs instead of displaying misleading numbers', () => {
    for (const bad of [-1, NaN, Infinity])
      expect(() => strongAcidHydronium(bad)).toThrow(RangeError);
    for (const bad of [0, 1e-8, 1, NaN])
      expect(() => ethanoicAcidHydronium(bad)).toThrow(RangeError);
    for (const bad of [0, -1, NaN, Infinity])
      expect(() => phFromHydronium(bad)).toThrow(RangeError);
  });
});
