import { describe, expect, it } from 'vitest';
import {
  electronTransferLedger,
  firstTwenty,
  ionTransferPairs,
  neutralElement,
  shellRecord,
  shellRecords,
} from './periodicEvidence';
describe('periodic position and electron inventories', () => {
  it('keeps all first-twenty neutral ground-state counts and positions coherent', () => {
    expect(firstTwenty.map((e) => e.z)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    );
    for (const e of firstTwenty) {
      expect(e.shells.reduce((a: number, b: number) => a + b, 0)).toBe(e.z);
      expect(e.shells.length).toBe(e.period);
      expect([1, 2, 13, 14, 15, 16, 17, 18]).toContain(e.group);
    }
    expect(neutralElement('He')).toMatchObject({
      period: 1,
      group: 18,
      shells: [2],
    });
    expect(neutralElement('Ca')).toMatchObject({
      period: 4,
      group: 2,
      shells: [2, 8, 8, 2],
    });
  });
  it('counts supplied ions without moving their element to a noble-gas position', () => {
    for (let i = 0; i < shellRecords.length; i++) {
      const r = shellRecord(i);
      expect(r.element.z - r.electrons).toBe(r.charge);
      expect(r.needsNeutralReference).toBe(r.charge !== 0);
    }
    const sodium = shellRecord(0),
      neon = shellRecord(1);
    expect(sodium.shells).toEqual(neon.shells);
    expect(sodium.element).toMatchObject({ symbol: 'Na', period: 3, group: 1 });
    expect(neon.element).toMatchObject({ symbol: 'Ne', period: 2, group: 18 });
  });
  it('separates an ion shell count from the element period and retains the helium exception', () => {
    const calcium = shellRecord(4);
    expect(calcium.shells).toHaveLength(3);
    expect(calcium.element.period).toBe(4);
    const chloride = shellRecord(2);
    expect(chloride.shells).toHaveLength(3);
    expect(chloride.element).toMatchObject({ period: 3, group: 17 });
    expect(shellRecord(6).element).toMatchObject({
      symbol: 'He',
      period: 1,
      group: 18,
    });
  });
  it('balances both electrons and charge for every one of the 80 candidate inventories', () => {
    let matched = 0;
    for (let k = 0; k < ionTransferPairs.length; k++)
      for (let m = 1; m <= 4; m++)
        for (let n = 1; n <= 4; n++) {
          const l = electronTransferLedger(k, m, n);
          expect(l.protons).toBe(l.neutralElectrons);
          expect(l.candidateCharge).toBe(l.supply - l.demand);
          expect(l.protons - l.desiredElectrons).toBe(l.candidateCharge);
          if (l.status === 'matched') {
            matched++;
            expect(l.desiredElectrons).toBe(l.neutralElectrons);
            expect(l.candidateCharge).toBe(0);
          } else expect(l.desiredElectrons).not.toBe(l.neutralElectrons);
        }
    expect(matched).toBe(14);
  });
  it('shows why a 1:1 magnesium/chlorine candidate cannot close but a 1:2 inventory can', () => {
    expect(electronTransferLedger(1, 1, 1)).toMatchObject({
      supply: 2,
      demand: 1,
      protons: 29,
      neutralElectrons: 29,
      desiredElectrons: 28,
      candidateCharge: 1,
      status: 'surplus',
    });
    expect(electronTransferLedger(1, 1, 2)).toMatchObject({
      supply: 2,
      demand: 2,
      protons: 46,
      desiredElectrons: 46,
      candidateCharge: 0,
      status: 'matched',
    });
  });
  it('distinguishes electron shortage and surplus rather than silently creating or discarding electrons', () => {
    expect(electronTransferLedger(0, 1, 2)).toMatchObject({
      supply: 1,
      demand: 2,
      candidateCharge: -1,
      status: 'shortage',
    });
    expect(electronTransferLedger(0, 2, 1)).toMatchObject({
      supply: 2,
      demand: 1,
      candidateCharge: 1,
      status: 'surplus',
    });
    expect(electronTransferLedger(4, 2, 1)).toMatchObject({
      supply: 2,
      demand: 2,
      candidateCharge: 0,
      status: 'matched',
    });
  });
  it('accepts balanced whole multiples without pretending that equality proves a unique smallest batch', () => {
    const small = electronTransferLedger(1, 1, 2),
      large = electronTransferLedger(1, 2, 4);
    expect(large.status).toBe('matched');
    expect(large.supply).toBe(2 * small.supply);
    expect(large.protons).toBe(2 * small.protons);
  });
  it('rejects unavailable records and fractional or out-of-range atom inventories', () => {
    for (const n of [-1, 10, 0.5, NaN]) expect(() => shellRecord(n)).toThrow();
    for (const n of [0, 5, 1.5, NaN])
      expect(() => electronTransferLedger(0, n, 1)).toThrow();
    expect(() => electronTransferLedger(5, 1, 1)).toThrow();
  });
});
