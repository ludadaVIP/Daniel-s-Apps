import { describe, expect, it } from 'vitest';
import {
  binaryFormulaLedger,
  binaryFormulaPairs,
  formulaUnit,
  greatestCommonDivisor,
  groupedFormulaLedger,
  groupedFormulaPairs,
  parseSignedCount,
} from './formulaEvidence';

describe('formula-unit inventories', () => {
  it('separates a neutral batch from the standard simplest formula', () => {
    expect(binaryFormulaLedger(2, 4, 4)).toMatchObject({
      formula: 'CaO',
      net: 0,
      simplest: false,
      formulaUnits: 4,
      reducedCations: 1,
      reducedAnions: 1,
    });
    expect(binaryFormulaLedger(1, 2, 4)).toMatchObject({
      formula: 'MgCl₂',
      neutral: true,
      simplest: false,
      formulaUnits: 2,
    });
    expect(binaryFormulaLedger(3, 2, 3)).toMatchObject({
      formula: 'Al₂O₃',
      neutral: true,
      simplest: true,
      formulaUnits: 1,
    });
  });
  it('does not mistake a coprime charged inventory for a neutral formula', () => {
    expect(binaryFormulaLedger(1, 1, 1)).toMatchObject({
      net: 1,
      simplest: true,
      neutral: false,
      formulaUnits: null,
    });
    expect(binaryFormulaLedger(1, 1, 3)).toMatchObject({
      net: -1,
      simplest: true,
      neutral: false,
    });
  });
  it('checks all 180 candidates against independent positive/negative-charge and scale invariants', () => {
    const neutral: number[] = [],
      simplest: number[] = [];
    binaryFormulaPairs.forEach((_, index) => {
      let n = 0,
        s = 0;
      for (let c = 1; c <= 6; c++)
        for (let a = 1; a <= 6; a++) {
          const l = binaryFormulaLedger(index, c, a);
          expect(l.net).toBe(c * l.cation.charge + a * l.anion.charge);
          expect(greatestCommonDivisor(l.reducedCations, l.reducedAnions)).toBe(
            1,
          );
          if (l.neutral) {
            n++;
            if (l.simplest) s++;
            expect(Number.isInteger(l.formulaUnits)).toBe(true);
            expect(l.formulaUnits! * l.cations).toBe(c);
            expect(l.formulaUnits! * l.anions).toBe(a);
          } else expect(l.formulaUnits).toBeNull();
        }
      neutral.push(n);
      simplest.push(s);
    });
    expect(neutral).toEqual([6, 3, 6, 2, 2]);
    expect(simplest).toEqual([1, 1, 1, 1, 1]);
  });
  it('writes parentheses only around repeated polyatomic ions and preserves peroxide identity', () => {
    expect(groupedFormulaPairs.map((p) => formulaUnit(p).formula)).toEqual([
      'Mg(OH)₂',
      'Ca(NO₃)₂',
      'Al₂(SO₄)₃',
      '(NH₄)₂SO₄',
      'NH₄NO₃',
      'Li₂O₂',
    ]);
    expect(groupedFormulaLedger(5, 1)).toMatchObject({
      cations: 2,
      anions: 1,
      atoms: { Li: 2, O: 2 },
    });
  });
  it('multiplies the coefficient, group count and internal subscript independently in all 24 states', () => {
    const expected = [
      { Mg: 1, O: 2, H: 2 },
      { Ca: 1, N: 2, O: 6 },
      { Al: 2, S: 3, O: 12 },
      { N: 2, H: 8, S: 1, O: 4 },
      { N: 2, H: 4, O: 3 },
      { Li: 2, O: 2 },
    ];
    expected.forEach((atoms, index) => {
      for (let coefficient = 1; coefficient <= 4; coefficient++) {
        const l = groupedFormulaLedger(index, coefficient);
        expect(l.net).toBe(0);
        expect(l.atoms).toEqual(
          Object.fromEntries(
            Object.entries(atoms).map(([e, n]) => [e, coefficient * n]),
          ),
        );
        expect(l.totalCations * l.cation.charge).toBe(
          -l.totalAnions * l.anion.charge,
        );
      }
    });
  });
  it('adds the same element from two different ions without merging their identities', () => {
    const l = groupedFormulaLedger(4, 3);
    expect(l.atoms).toEqual({ N: 6, H: 12, O: 9 });
    expect(l.contributions.N).toEqual(['3 × 1 × 1', '3 × 1 × 1']);
    expect(l.totalCations).toBe(3);
    expect(l.totalAnions).toBe(3);
  });
  it('requires explicit safe signed integers, allowing a copied minus sign but rejecting blank, fractions and expressions', () => {
    expect(['0', '-1', '+2', ' −3 '].map(parseSignedCount)).toEqual([
      0, -1, 2, -3,
    ]);
    for (const text of [
      '',
      ' ',
      '1.5',
      '1e2',
      '2-1',
      '--2',
      'Infinity',
      '9007199254740992',
    ])
      expect(parseSignedCount(text)).toBeNull();
  });
  it('rejects unsupported cases, counts and reversed ion signs', () => {
    for (const args of [
      [-1, 1, 1],
      [5, 1, 1],
      [0, 0, 1],
      [0, 7, 1],
      [0, 1.5, 1],
    ])
      expect(() =>
        binaryFormulaLedger(...(args as [number, number, number])),
      ).toThrow();
    for (const args of [
      [6, 1],
      [0, 0],
      [0, 5],
      [0, 1.5],
    ])
      expect(() =>
        groupedFormulaLedger(...(args as [number, number])),
      ).toThrow();
    expect(() => formulaUnit({ cation: 'Cl', anion: 'Na' })).toThrow();
    expect(() => greatestCommonDivisor(0, 2)).toThrow();
  });
});
