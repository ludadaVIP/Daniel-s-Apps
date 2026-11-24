import { describe, expect, it } from 'vitest';
import {
  changeEvidenceCards,
  changeEvidenceState,
  moleculeEquationCases,
  moleculeEquationLedger,
} from './reactionBridge';
describe('reaction evidence and molecule/atom inventories', () => {
  it('rejects equal combined atom totals when element identities do not match', () => {
    expect(moleculeEquationLedger(0, [1, 2, 2])).toMatchObject({
      leftAtomTotal: 6,
      rightAtomTotal: 6,
      atomsMatch: false,
      left: { H: 2, O: 4 },
      right: { H: 4, O: 2 },
    });
  });
  it('keeps appearance separate from identity evidence and preserves an inconclusive endpoint', () => {
    changeEvidenceCards.forEach((_, i) =>
      expect(changeEvidenceState(i, false)).toMatchObject({
        verdict: 'insufficient',
        basis: 'missing',
      }),
    );
    expect(
      changeEvidenceCards.map((_, i) => changeEvidenceState(i, true).verdict),
    ).toEqual([
      'physical',
      'chemical',
      'physical',
      'chemical',
      'physical',
      'chemical',
      'physical',
      'insufficient',
    ]);
    expect(changeEvidenceState(7, true).basis).toBe('missing');
  });
  it('uses a molecule-count equality counterexample that fails hydrogen conservation', () => {
    expect(moleculeEquationLedger(0, [1, 1, 2])).toMatchObject({
      left: { H: 2, O: 2 },
      right: { H: 4, O: 2 },
      moleculesMatch: true,
      atomsMatch: false,
    });
  });
  it('preserves atom identities while changing molecule totals in both synthesis and decomposition', () => {
    expect(moleculeEquationLedger(0, [2, 1, 2])).toMatchObject({
      atomsMatch: true,
      leftMolecules: 3,
      rightMolecules: 2,
      leftAtomTotal: 6,
      rightAtomTotal: 6,
    });
    expect(moleculeEquationLedger(3, [2, 2, 1])).toMatchObject({
      atomsMatch: true,
      leftMolecules: 2,
      rightMolecules: 3,
      leftAtomTotal: 8,
      rightAtomTotal: 8,
    });
  });
  it('checks every one of the 320 candidates against independent element equations', () => {
    const counts: number[] = [];
    moleculeEquationCases.forEach((_, i) => {
      let balanced = 0;
      for (let a = 1; a <= 4; a++)
        for (let b = 1; b <= 4; b++)
          for (let c = 1; c <= 4; c++) {
            const l = moleculeEquationLedger(i, [a, b, c]);
            const expected = [
              2 * a === 2 * c && 2 * b === c,
              2 * a === c && 2 * b === 3 * c,
              a === c && a + 2 * b === 2 * c,
              2 * a === 2 * b && 2 * a === b + 2 * c,
              2 * a === c && 2 * b === c,
            ][i];
            expect(l.atomsMatch).toBe(expected);
            if (l.atomsMatch) {
              balanced++;
              expect(l.moleculesMatch).toBe(i === 4);
              expect(l.leftAtomTotal).toBe(l.rightAtomTotal);
            }
          }
      counts.push(balanced);
    });
    expect(counts).toEqual([2, 1, 2, 2, 2]);
  });
  it('counts oxygen from both products of peroxide decomposition', () => {
    expect(moleculeEquationLedger(3, [2, 2, 1])).toMatchObject({
      left: { H: 4, O: 4 },
      right: { H: 4, O: 4 },
    });
  });
  it('accepts scaled balanced batches without silently changing molecular subscripts', () => {
    const one = moleculeEquationLedger(2, [2, 1, 2]),
      two = moleculeEquationLedger(2, [4, 2, 4]);
    expect(two.atomsMatch).toBe(true);
    for (const e of one.elements) expect(two.left[e]).toBe(2 * one.left[e]!);
    expect(two.scenario.terms.map((t) => t.molecule)).toEqual([
      'CO',
      'O2',
      'CO2',
    ]);
  });
  it('rejects unsupported cases, missing coefficients and fractional or zero molecule counts', () => {
    for (const [i, coefficients] of [
      [5, [1, 1, 1]],
      [0, [1, 1]],
      [0, [0, 1, 1]],
      [0, [1.5, 1, 1]],
      [0, [5, 1, 1]],
    ] as const)
      expect(() => moleculeEquationLedger(i, coefficients)).toThrow();
    expect(() => changeEvidenceState(-1, true)).toThrow();
    expect(() => changeEvidenceState(8, true)).toThrow();
  });
});
