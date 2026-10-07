import { describe, expect, it } from 'vitest';
import {
  canAdvanceGalvanic,
  copperPlating,
  galvanicInventory,
} from './electrochemistry';

describe('galvanic charge and material ledger', () => {
  it('keeps each solution and the bridge electrically neutral after every balanced step', () => {
    for (let steps = 0; steps <= 4; steps++) {
      const r = galvanicInventory(steps);
      expect(2 * r.zincIons - r.leftNitrate).toBe(0);
      expect(2 * r.copperIons + r.rightPotassium - r.rightNitrate).toBe(0);
      expect(r.bridgePotassium - r.bridgeNitrate).toBe(0);
    }
  });
  it('preserves both metals and all spectator-ion inventories', () => {
    for (let steps = 0; steps <= 4; steps++) {
      const r = galvanicInventory(steps);
      expect(r.zincMetal + r.zincIons).toBe(6);
      expect(r.copperMetal + r.copperIons).toBe(6);
      expect(r.rightPotassium + r.bridgePotassium).toBe(8);
      expect(r.leftNitrate + r.rightNitrate + r.bridgeNitrate).toBe(20);
      expect(Object.values(r).every((n) => n >= 0)).toBe(true);
      expect(r.electronTransfers).toBe(2 * steps);
    }
  });
  it('cannot sustain reaction without either path or beyond the stock limit', () => {
    expect(canAdvanceGalvanic(0, true, true)).toBe(true);
    expect(canAdvanceGalvanic(2, false, true)).toBe(false);
    expect(canAdvanceGalvanic(2, true, false)).toBe(false);
    expect(canAdvanceGalvanic(4, true, true)).toBe(false);
  });
  it('rejects impossible discrete steps', () => {
    for (const bad of [-1, 5, 0.5, NaN])
      expect(() => galvanicInventory(bad)).toThrow(RangeError);
  });
});

describe('ideal copper electroplating', () => {
  it('requires two moles of electrons per mole of copper deposited', () => {
    const r = copperPlating(1, 600);
    expect(r.charge).toBe(600);
    expect(r.electronMoles).toBeCloseTo(600 / 96485, 12);
    expect(r.copperMoles * 2).toBeCloseTo(r.electronMoles, 12);
    expect(r.mass).toBeCloseTo(0.1974400166, 9);
  });
  it('doubles ideal deposition when either current or time doubles', () => {
    const base = copperPlating(1, 600);
    expect(copperPlating(2, 600).mass).toBeCloseTo(2 * base.mass, 12);
    expect(copperPlating(1, 1200).mass).toBeCloseTo(2 * base.mass, 12);
  });
  it('requires power and never exhausts the 1 g anode in offered settings', () => {
    expect(copperPlating(2, 1200, false).mass).toBe(0);
    for (const current of [1, 2])
      for (const seconds of [300, 600, 1200]) {
        const r = copperPlating(current, seconds);
        expect(r.mass).toBeLessThan(1);
        expect(1 - r.mass + (1 + r.mass)).toBeCloseTo(2, 12);
      }
  });
  it('rejects invalid measurements', () => {
    for (const bad of [-1, Infinity, NaN]) {
      expect(() => copperPlating(bad, 600)).toThrow(RangeError);
      expect(() => copperPlating(1, bad)).toThrow(RangeError);
    }
  });
});
