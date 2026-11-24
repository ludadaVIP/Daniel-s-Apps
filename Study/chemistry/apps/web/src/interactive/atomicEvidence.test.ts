import { describe, expect, it } from 'vitest';
import {
  atomicPairs,
  compareAtomicRecords,
  isotopeKits,
  isotopeMean,
  parseAtomicAnswer,
  particleLedger,
} from './atomicEvidence';
describe('atomic identity and isotopic means', () => {
  it('recovers nuclear counts independently from signed electron charge', () => {
    expect(particleLedger({ symbol: 'Na', z: 11, a: 23, charge: 1 })).toEqual({
      protons: 11,
      neutrons: 12,
      electrons: 10,
      massNumber: 23,
      charge: 1,
      isIon: true,
    });
    expect(particleLedger({ symbol: 'Cl', z: 17, a: 37, charge: -1 })).toEqual({
      protons: 17,
      neutrons: 20,
      electrons: 18,
      massNumber: 37,
      charge: -1,
      isIon: true,
    });
    for (const pair of atomicPairs)
      for (const record of [pair.first, pair.second]) {
        const l = particleLedger(record);
        expect(l.protons + l.neutrons).toBe(record.a);
        expect(l.protons - l.electrons).toBe(record.charge);
        expect(
          Math.max(l.protons, l.neutrons, l.electrons),
        ).toBeLessThanOrEqual(20);
      }
  });
  it('allows different isotopes and ion status simultaneously without treating either as a process', () => {
    const same = compareAtomicRecords(
      atomicPairs[0]!.first,
      atomicPairs[0]!.second,
    );
    expect(same).toMatchObject({
      sameElement: true,
      differentIsotopes: false,
      secondIsIon: true,
    });
    const both = compareAtomicRecords(
      atomicPairs[2]!.first,
      atomicPairs[2]!.second,
    );
    expect(both).toMatchObject({
      sameElement: true,
      differentIsotopes: true,
      secondIsIon: true,
    });
    expect(
      compareAtomicRecords(atomicPairs[1]!.first, atomicPairs[1]!.second),
    ).toMatchObject({ differentIsotopes: true, secondIsIon: false });
    expect(
      compareAtomicRecords(atomicPairs[4]!.first, atomicPairs[4]!.second),
    ).toMatchObject({
      differentIsotopes: true,
      secondIsIon: true,
      sameElectrons: false,
    });
  });
  it('does not infer element identity from equal electron counts', () => {
    expect(
      compareAtomicRecords(atomicPairs[3]!.first, atomicPairs[3]!.second),
    ).toEqual({
      sameElement: false,
      differentIsotopes: false,
      sameElectrons: true,
      secondIsIon: true,
    });
  });
  it('keeps all 84 offered isotope calculations within endpoints with complete composition', () => {
    for (let k = 0; k < isotopeKits.length; k++)
      for (const mode of ['mass-number', 'relative'] as const)
        for (let light = 0; light <= 20; light++) {
          const r = isotopeMean(k, light, mode);
          expect(r.lightCount + r.heavyCount).toBe(20);
          expect(r.lightFraction + r.heavyFraction).toBeCloseTo(1, 14);
          expect(r.mean).toBeGreaterThanOrEqual(r.lightMass - 1e-12);
          expect(r.mean).toBeLessThanOrEqual(r.heavyMass + 1e-12);
          if (light === 0) expect(r.mean).toBeCloseTo(r.heavyMass, 12);
          if (light === 20) expect(r.mean).toBeCloseTo(r.lightMass, 12);
          if (light === 10) {
            expect(r.mean).toBeCloseTo((r.lightMass + r.heavyMass) / 2, 12);
            expect(r.nearer).toBe('middle');
          }
        }
  });
  it('distinguishes a mass-number approximation from rounded relative isotope masses', () => {
    expect(isotopeMean(0, 15, 'mass-number')).toMatchObject({
      mean: 35.5,
      roundedMean: 35.5,
      nearer: 'light',
    });
    const r = isotopeMean(0, 15, 'relative');
    expect(r.mean).toBeCloseTo(35.46825, 10);
    expect(r.roundedMean).toBe(35.47);
    expect(isotopeMean(1, 4, 'mass-number').mean).toBeCloseTo(10.8, 12);
    expect(isotopeMean(1, 4, 'relative').mean).toBeCloseTo(10.8098, 10);
  });
  it('moves the mean toward the isotope whose share increases rather than always using a midpoint', () => {
    for (let k = 0; k < 2; k++)
      for (const mode of ['mass-number', 'relative'] as const) {
        let previous = Infinity;
        for (let count = 0; count <= 20; count++) {
          const r = isotopeMean(k, count, mode);
          expect(r.mean).toBeLessThan(previous);
          expect(r.nearer).toBe(
            count > 10 ? 'light' : count < 10 ? 'heavy' : 'middle',
          );
          previous = r.mean;
        }
      }
  });
  it('distinguishes a valid zero from blank, incomplete and inappropriate decimal input', () => {
    expect(parseAtomicAnswer('0')).toBe(0);
    expect(parseAtomicAnswer(' 18 ')).toBe(18);
    expect(parseAtomicAnswer('35.50', true)).toBe(35.5);
    expect(parseAtomicAnswer('1.5')).toBeNull();
    for (const s of [
      '',
      ' ',
      '-1',
      '2x',
      '3e1',
      'NaN',
      'Infinity',
      '9007199254740992',
    ])
      expect(parseAtomicAnswer(s, true)).toBeNull();
  });
  it('rejects inconsistent nuclear records and invalid sample settings', () => {
    for (const r of [
      { symbol: 'Na' as const, z: 10, a: 23, charge: 1 },
      { symbol: 'Cl' as const, z: 17, a: 16, charge: 0 },
      { symbol: 'Na' as const, z: 11, a: 23, charge: 12 },
      { symbol: 'Na' as const, z: 11, a: 23, charge: 0.5 },
    ])
      expect(() => particleLedger(r)).toThrow();
    for (const n of [-1, 21, 1.5, NaN])
      expect(() => isotopeMean(0, n, 'relative')).toThrow();
    expect(() => isotopeMean(2, 15, 'relative')).toThrow();
  });
});
