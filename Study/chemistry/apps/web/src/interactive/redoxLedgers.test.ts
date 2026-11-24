import { describe, expect, it } from 'vitest';
import {
  displacementAtoms,
  displacementCharge,
  displacementLedger,
  displacementMetals,
  electronPairs,
  halfReactionAudit,
  oxidationCases,
  oxidationLedger,
  type DisplacementInventory,
} from './redoxLedgers';

describe('oxidation number and electron ledgers', () => {
  it('assigns per-atom oxidation numbers, including elemental oxygen and peroxide', () => {
    expect(
      oxidationCases.map((sample) => oxidationLedger(sample).value),
    ).toEqual([-1, -1, 4, -3, -3, 0, -1]);
    for (const sample of oxidationCases) {
      const result = oxidationLedger(sample);
      expect(result.knownContribution + result.count * result.value).toBe(
        sample.charge,
      );
    }
  });
  it('does not confuse proton transfer with a change in Cl or N oxidation number', () => {
    expect(oxidationLedger(oxidationCases[0]!).value).toBe(
      oxidationLedger(oxidationCases[1]!).value,
    );
    expect(oxidationLedger(oxidationCases[3]!).value).toBe(
      oxidationLedger(oxidationCases[4]!).value,
    );
  });
  it('checks electron and charge conservation at every offered multiplier setting', () => {
    for (const pair of electronPairs)
      for (let a = 1; a <= 6; a++)
        for (let b = 1; b <= 6; b++) {
          const result = halfReactionAudit(pair, a, b);
          expect(result.balanced).toBe(a * pair.loss === b * pair.gain);
          if (result.equation) {
            const auditSide = (side: string) => {
              const atoms: Record<string, number> = {};
              let charge = 0;
              for (const term of side.split(' + ')) {
                const match = /^(\d*)(Al|Cu|Zn|Ag)(²⁺|³⁺|⁺)?$/.exec(term);
                expect(match, term).not.toBeNull();
                const count = Number(match![1] || 1);
                const element = match![2]!;
                const charges: Record<string, number> = {
                  '²⁺': 2,
                  '³⁺': 3,
                  '⁺': 1,
                };
                atoms[element] = (atoms[element] ?? 0) + count;
                charge += count * (charges[match![3] ?? ''] ?? 0);
              }
              return { atoms, charge };
            };
            const [left, right] = result.equation.split(' → ');
            expect(auditSide(left!)).toEqual(auditSide(right!));
          }
        }
  });
  it('distinguishes a balanced multiple from the simplest whole-number equation', () => {
    const aluminium = electronPairs[1]!;
    expect(halfReactionAudit(aluminium, 2, 3)).toMatchObject({
      balanced: true,
      simplest: true,
      lost: 6,
      gained: 6,
    });
    expect(halfReactionAudit(aluminium, 4, 6)).toMatchObject({
      balanced: true,
      simplest: false,
    });
    expect(halfReactionAudit(aluminium, 1, 1)).toMatchObject({
      balanced: false,
      equation: null,
    });
    expect(halfReactionAudit(aluminium, 2, 3).equation).toBe(
      '2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu',
    );
    expect(halfReactionAudit(electronPairs[2]!, 1, 2).simplest).toBe(true);
  });
  it('conserves all atoms and charge at every offered displacement amount', () => {
    for (const metal of displacementMetals)
      for (let input = 1; input <= 6; input++)
        for (let copper = 1; copper <= 6; copper++) {
          const result = displacementLedger(metal, input, copper);
          const after: DisplacementInventory = {
            ...result.solution,
            ...result.solids,
          };
          expect(displacementAtoms(after)).toEqual(
            displacementAtoms(result.before),
          );
          expect(displacementCharge(result.before)).toBe(0);
          expect(displacementCharge(result.solution)).toBe(0);
          expect(result.solution.nitrate).toBe(2 * copper);
          expect(Object.values(after).every((n) => n >= 0)).toBe(true);
          expect(result.electronMmol).toBe(2 * result.extent);
        }
  });
  it('limits copper yield without consuming spectators or accumulating free electrons', () => {
    const result = displacementLedger(displacementMetals[0]!, 2, 5);
    expect(result.solution).toEqual({ zincIon: 2, copperIon: 3, nitrate: 10 });
    expect(result.solids).toEqual({ zinc: 0, copper: 2 });
    expect(result.copperMassG).toBeCloseTo(0.127, 12);
    expect(displacementLedger(displacementMetals[0]!, 2, 6).extent).toBe(2);
    expect(result.electronMmol).toBe(4);
  });
  it('retains unreacted metal when copper ions limit the reaction', () => {
    const result = displacementLedger(displacementMetals[1]!, 5, 2);
    expect(result.solids).toEqual({ magnesium: 3, copper: 2 });
    expect(result.solution.copperIon).toBe(0);
    expect(result.solution.magnesiumIon).toBe(2);
  });
  it('supports zero/fractional amounts and rejects nonphysical inputs', () => {
    expect(displacementLedger(displacementMetals[0]!, 0, 2).extent).toBe(0);
    expect(displacementLedger(displacementMetals[0]!, 0.5, 0.25).extent).toBe(
      0.25,
    );
    for (const invalid of [-1, NaN, Infinity]) {
      expect(() =>
        displacementLedger(displacementMetals[0]!, invalid, 2),
      ).toThrow(RangeError);
      expect(() =>
        displacementLedger(displacementMetals[0]!, 2, invalid),
      ).toThrow(RangeError);
    }
    for (const invalid of [0, -1, 0.5, NaN, Infinity])
      expect(() => halfReactionAudit(electronPairs[0]!, invalid, 1)).toThrow(
        RangeError,
      );
  });
});
