import { describe, expect, it } from 'vitest';
import {
  atomInventory,
  carriesIonicCurrent,
  conductorSamples,
  inventoryCharge,
  precipitate,
  precipitationCases,
  spectatorIons,
  validSpectatorCancellation,
  type IonInventory,
} from './ionicReactions';

describe('ionic reaction inventories', () => {
  it('requires both mobility and charge for ionic conduction', () => {
    expect(conductorSamples.map(carriesIonicCurrent)).toEqual([
      false,
      true,
      false,
    ]);
  });
  it('conserves every element and total charge for every offered mixing setting', () => {
    for (const reaction of precipitationCases) {
      for (let left = 1; left <= 6; left++) {
        for (let right = 1; right <= 6; right++) {
          const result = precipitate(reaction, left, right);
          const combined: IonInventory = { ...result.after };
          for (const [id, amount] of Object.entries(result.solid)) {
            const key = id as keyof IonInventory;
            combined[key] = (combined[key] ?? 0) + amount;
          }
          expect(
            atomInventory(combined),
            `${reaction.id}, ${left}, ${right}`,
          ).toEqual(atomInventory(result.before));
          expect(inventoryCharge(result.before)).toBe(0);
          expect(inventoryCharge(result.after)).toBe(0);
          expect(inventoryCharge(result.solid)).toBe(0);
          expect(Object.values(result.after).every((n) => n >= 0)).toBe(true);
        }
      }
    }
  });
  it('tracks the limiting ion, spectators, and mmol-to-gram conversion', () => {
    const result = precipitate(precipitationCases[0]!, 2, 3);
    expect(result.solidMmol).toBe(2);
    expect(result.massG).toBeCloseTo(0.287, 10);
    expect(result.after).toEqual({ Ag: 0, nitrate: 2, Na: 3, Cl: 1 });
    expect(precipitate(precipitationCases[0]!, 2, 6).solidMmol).toBe(2);
    expect(precipitate(precipitationCases[0]!, 4, 6).solidMmol).toBe(4);
  });
  it('retains the two-to-one spectator ratios of calcium chloride and sodium carbonate', () => {
    const result = precipitate(precipitationCases[1]!, 3, 2);
    expect(result.after).toEqual({ Ca: 1, Cl: 6, Na: 4, carbonate: 0 });
    expect(result.massG).toBeCloseTo(0.2, 10);
  });
  it('does not invent a precipitate by swapping partners in the soluble control', () => {
    const result = precipitate(precipitationCases[2]!, 2, 5);
    expect(result.solidMmol).toBe(0);
    expect(result.after).toEqual(result.before);
    expect(result.solid).toEqual({});
  });
  it('cancels only unchanged aqueous species, including all required spectators', () => {
    const silver = precipitationCases[0]!;
    expect(spectatorIons(silver).sort()).toEqual(['Na', 'nitrate']);
    expect(validSpectatorCancellation(silver, ['nitrate', 'Na'])).toBe(true);
    expect(validSpectatorCancellation(silver, ['Na'])).toBe(false);
    expect(validSpectatorCancellation(silver, ['Na', 'Ag'])).toBe(false);
    expect(validSpectatorCancellation(silver, ['Na', 'nitrate', 'Cl'])).toBe(
      false,
    );
    expect(
      validSpectatorCancellation(precipitationCases[1]!, ['Cl', 'Na']),
    ).toBe(true);
    expect(validSpectatorCancellation(precipitationCases[2]!, [])).toBe(false);
  });
  it('accepts fractional and zero amounts without consuming absent ions', () => {
    expect(precipitate(precipitationCases[0]!, 0.5, 0.25).solidMmol).toBe(0.25);
    expect(precipitate(precipitationCases[0]!, 0, 3).solidMmol).toBe(0);
  });
  it('rejects impossible non-finite or negative inputs', () => {
    for (const value of [-1, NaN, Infinity]) {
      expect(() => precipitate(precipitationCases[0]!, value, 1)).toThrow(
        RangeError,
      );
      expect(() => precipitate(precipitationCases[0]!, 1, value)).toThrow(
        RangeError,
      );
    }
  });
});
