import { describe, expect, it } from 'vitest';
import {
  carbonGasLedger,
  carbonSalts,
  hydroxideStocks,
  neutralisationLedger,
  protonEvents,
  protonInventoryAtoms,
  protonInventoryCharge,
  protonSpecies,
  type ProtonInventory,
} from './protonReactions';

function combine(a: ProtonInventory, b: ProtonInventory): ProtonInventory {
  const result = { ...a };
  for (const [id, amount] of Object.entries(b)) {
    const key = id as keyof ProtonInventory;
    result[key] = (result[key] ?? 0) + amount;
  }
  return result;
}

describe('proton transfers and acid-base ledgers', () => {
  it('conserves atoms and charge in each single transfer event', () => {
    for (const event of protonEvents) {
      expect(protonInventoryAtoms(event.after)).toEqual(
        protonInventoryAtoms(event.before),
      );
      expect(protonInventoryCharge(event.after)).toBe(
        protonInventoryCharge(event.before),
      );
    }
  });
  it('changes each conjugate species by one proton and one unit of charge', () => {
    for (const event of protonEvents) {
      const donor = protonSpecies[event.donor];
      const donorProduct = protonSpecies[event.donorProduct];
      const acceptor = protonSpecies[event.acceptor];
      const acceptorProduct = protonSpecies[event.acceptorProduct];
      expect(donorProduct.charge).toBe(donor.charge - 1);
      expect(acceptorProduct.charge).toBe(acceptor.charge + 1);
      const before = protonInventoryAtoms({ [event.donor]: 1 });
      const after = protonInventoryAtoms({ [event.donorProduct]: 1 });
      expect((before.H ?? 0) - (after.H ?? 0)).toBe(1);
    }
  });
  it('lets water change acid/base role with its reaction partner', () => {
    expect(protonEvents[0]!.acceptor).toBe('water');
    expect(protonEvents[1]!.donor).toBe('water');
    expect(protonEvents[1]!.equation).toContain('⇌');
  });
  it('preserves every element, spectators and charge at all offered neutralisation settings', () => {
    for (const stock of hydroxideStocks)
      for (let acid = 1; acid <= 6; acid++)
        for (let base = 1; base <= 3; base++) {
          const result = neutralisationLedger(stock, acid, base);
          expect(
            protonInventoryAtoms(combine(result.solution, result.produced)),
          ).toEqual(protonInventoryAtoms(result.before));
          expect(protonInventoryCharge(result.solution)).toBe(0);
          expect(result.solution[stock.cation]).toBe(base);
          expect(result.solution.chloride).toBe(acid);
          expect(
            (result.solution.proton ?? 0) * (result.solution.hydroxide ?? 0),
          ).toBe(0);
        }
  });
  it('counts two hydroxides per dissolved calcium hydroxide formula unit', () => {
    const result = neutralisationLedger(hydroxideStocks[1]!, 3, 2);
    expect(result.hydroxideMmol).toBe(4);
    expect(result.reactedMmol).toBe(3);
    expect(result.solution.hydroxide).toBe(1);
    expect(result.solution.calcium).toBe(2);
    expect(result.balance).toBe('base');
    expect(neutralisationLedger(hydroxideStocks[1]!, 4, 2).balance).toBe(
      'balanced',
    );
  });
  it('retains spectator ions when neither strong reactant is in excess', () => {
    const result = neutralisationLedger(hydroxideStocks[0]!, 2, 2);
    expect(result.solution).toEqual({
      proton: 0,
      chloride: 2,
      sodium: 2,
      hydroxide: 0,
    });
    expect(result.produced.water).toBe(2);
  });
  it('conserves atoms and charge through the gas collection boundary for all offered settings', () => {
    for (const salt of carbonSalts)
      for (let amount = 1; amount <= 3; amount++)
        for (let extra = 1; extra <= 3; extra++) {
          const result = carbonGasLedger(salt, amount, extra);
          expect(
            protonInventoryAtoms(combine(result.solution, result.produced)),
          ).toEqual(protonInventoryAtoms(result.before));
          expect(protonInventoryCharge(result.solution)).toBe(0);
          expect(result.solution.proton).toBe(extra);
          expect(result.gasMassG).toBeCloseTo(amount * 0.044, 12);
        }
  });
  it('requires different acid quantities but gives equal gas from equal carbon amounts in acid excess', () => {
    const carbonate = carbonGasLedger(carbonSalts[0]!, 2, 1);
    const bicarbonate = carbonGasLedger(carbonSalts[1]!, 2, 1);
    expect(carbonate.requiredAcidMmol).toBe(4);
    expect(bicarbonate.requiredAcidMmol).toBe(2);
    expect(carbonate.gasMmol).toBe(bicarbonate.gasMmol);
    expect(carbonate.gasMassG).toBeCloseTo(0.088, 12);
  });
  it('does not silently extrapolate the acid-excess model to acid-shortage or invalid inputs', () => {
    for (const extra of [0, -1, NaN, Infinity])
      expect(() => carbonGasLedger(carbonSalts[0]!, 2, extra)).toThrow(
        RangeError,
      );
    for (const amount of [-1, NaN, Infinity]) {
      expect(() =>
        neutralisationLedger(hydroxideStocks[0]!, amount, 2),
      ).toThrow(RangeError);
      expect(() =>
        neutralisationLedger(hydroxideStocks[0]!, 2, amount),
      ).toThrow(RangeError);
      expect(() => carbonGasLedger(carbonSalts[0]!, amount, 1)).toThrow(
        RangeError,
      );
    }
  });
});
