import { describe, expect, it } from 'vitest';
import {
  compositionSamples,
  empiricalFromMasses,
  formulaText,
  hydrateLedger,
  hydrateRecords,
  molecularFromEmpirical,
} from './composition';

describe('mass to formula inference', () => {
  it('converts masses to moles before normalising', () => {
    const a = empiricalFromMasses(compositionSamples[0].elements)!;
    expect(a.moles).toEqual([1, 2, 1]);
    expect(a.formula).toBe('CH₂O');
    expect(a.formulaMass).toBe(30);
    expect(a.counts).not.toEqual([12, 2, 16]);
    for (const sample of compositionSamples) {
      expect(empiricalFromMasses(sample.elements)!.formula).toBe(
        sample.choices[sample.correct],
      );
    }
  });
  it('preserves an empirical ratio under batch scaling', () => {
    const a = empiricalFromMasses(compositionSamples[0].elements)!;
    for (const scale of [0.1, 0.5, 2, 10]) {
      expect(
        empiricalFromMasses(
          compositionSamples[0].elements.map((e) => ({
            ...e,
            massG: e.massG * scale,
          })),
        )!.counts,
      ).toEqual(a.counts);
    }
  });
  it('retains a half ratio until every term can be multiplied by two', () => {
    const iron = empiricalFromMasses(compositionSamples[2].elements)!;
    expect(iron.normalised[1]).toBeCloseTo(1.5);
    expect(iron.multiplier).toBe(2);
    expect(iron.counts).toEqual([2, 3]);
    expect(iron.formula).toBe('Fe₂O₃');
  });
  it('needs independent molar mass to select a molecular multiplier', () => {
    for (const sample of compositionSamples.slice(0, 2)) {
      const empirical = empiricalFromMasses(sample.elements)!;
      expect(
        molecularFromEmpirical(sample.elements, empirical, sample.molarMass!)!
          .formula,
      ).toBe(sample.molarMass === 180 ? 'C₆H₁₂O₆' : 'C₂H₄O₂');
      expect(molecularFromEmpirical(sample.elements, empirical, 45)).toBeNull();
    }
    expect(formulaText(['C', 'H', 'O'], [12, 22, 11])).toBe('C₁₂H₂₂O₁₁');
  });
  it('accepts small rounding but refuses an unsupported small-integer ratio', () => {
    expect(
      empiricalFromMasses([
        { symbol: 'C', atomicMass: 12, massG: 40 },
        { symbol: 'H', atomicMass: 1, massG: 6.67 },
        { symbol: 'O', atomicMass: 16, massG: 53.33 },
      ])!.formula,
    ).toBe('CH₂O');
    expect(
      empiricalFromMasses([
        { symbol: 'H', atomicMass: 1, massG: 1 },
        { symbol: 'O', atomicMass: 16, massG: 19.52 },
      ]),
    ).toBeNull();
    expect(() =>
      empiricalFromMasses([
        { symbol: 'C', atomicMass: 12, massG: 0 },
        { symbol: 'H', atomicMass: 1, massG: 1 },
      ]),
    ).toThrow(RangeError);
    expect(() =>
      empiricalFromMasses([
        { symbol: 'C', atomicMass: 12, massG: 1 },
        { symbol: 'C', atomicMass: 12, massG: 1 },
      ]),
    ).toThrow(RangeError);
    expect(() =>
      molecularFromEmpirical(
        compositionSamples[0].elements,
        empiricalFromMasses(compositionSamples[0].elements)!,
        NaN,
      ),
    ).toThrow(RangeError);
  });
});

describe('hydrate evidence ledger', () => {
  it('subtracts the container and waits for repeated readings', () => {
    for (const stage of [0, 1, 2]) {
      const data = hydrateLedger(hydrateRecords[0]!, stage);
      expect(data.initialSampleG).toBeCloseTo(4.99);
      expect(data.ready).toBe(false);
      expect(data.ratio).toBeNull();
    }
    expect(hydrateLedger(hydrateRecords[0]!, 2).remainingSampleG).toBeCloseTo(
      3.19,
    );
  });
  it('finds five waters per formula unit from an intact final record', () => {
    const data = hydrateLedger(hydrateRecords[0]!, 3);
    expect(data.ready).toBe(true);
    expect(data.lostG).toBeCloseTo(1.8);
    expect(data.saltMol).toBeCloseTo(0.02);
    expect(data.waterMol).toBeCloseTo(0.1);
    expect(data.ratio).toBeCloseTo(5);
  });
  it('refuses a formula from known spillage even when the mass is constant', () => {
    const data = hydrateLedger(hydrateRecords[1]!, 3);
    expect(data.stable).toBe(true);
    expect(data.knownSolidLoss).toBe(true);
    expect(data.ready).toBe(false);
    expect(data.ratio).toBeNull();
  });
  it('transfers the method to a different salt rather than assuming five waters', () => {
    const data = hydrateLedger(hydrateRecords[2]!, 3);
    expect(data.ready).toBe(true);
    expect(data.initialSampleG).toBeCloseTo(4.92);
    expect(data.remainingSampleG).toBeCloseTo(2.4);
    expect(data.lostG).toBeCloseTo(2.52);
    expect(data.saltMol).toBeCloseTo(0.02);
    expect(data.waterMol).toBeCloseTo(0.14);
    expect(data.ratio).toBeCloseTo(7);
  });
  it('accounts for initial mass at every offered stage and rejects invalid stages', () => {
    for (const record of hydrateRecords)
      for (let stage = 0; stage < record.totalsG.length; stage++) {
        const data = hydrateLedger(record, stage);
        expect(data.remainingSampleG + data.lostG).toBeCloseTo(
          data.initialSampleG,
        );
      }
    for (const stage of [-1, 0.5, 4, NaN])
      expect(() => hydrateLedger(hydrateRecords[0]!, stage)).toThrow(
        RangeError,
      );
  });
});
