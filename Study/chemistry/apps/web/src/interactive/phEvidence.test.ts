import { describe, expect, it } from 'vitest';
import {
  aqueousPhInventory,
  indicatorEvidence,
  indicatorRange,
  intersectPhIntervals,
  intervalClass,
} from './phEvidence';
describe('pH evidence ranges and complete aqueous inventories', () => {
  it('keeps two yellow readings compatible without assigning the same interval to both tools', () => {
    expect(indicatorEvidence(2, 0)).toMatchObject({
      range: { low: 4.4, high: 6, lowClosed: false, highClosed: false },
      classification: 'acidic',
    });
  });
  it('does not turn the BTB transition category into an exact pH of seven', () => {
    expect(indicatorEvidence(2, 1)).toMatchObject({
      range: { low: 6, high: 7.6 },
      classification: 'undetermined',
    });
  });
  it('audits all nine paired readings against an independent compatibility table', () => {
    const expected = [
      ['acidic', 'incompatible', 'incompatible'],
      ['acidic', 'incompatible', 'incompatible'],
      ['acidic', 'undetermined', 'basic'],
    ];
    for (let a = 0; a < 3; a++)
      for (let b = 0; b < 3; b++)
        expect(indicatorEvidence(a, b).classification).toBe(expected[a]![b]);
    expect(indicatorRange(0, 0).highClosed).toBe(false);
    expect(indicatorRange(0, 1).lowClosed).toBe(true);
  });
  it('handles open endpoints and rejects a spurious single-point overlap', () => {
    expect(
      intersectPhIntervals(
        { low: 3, high: 6, lowClosed: true, highClosed: false },
        { low: 6, high: 8, lowClosed: true, highClosed: true },
      ),
    ).toBeNull();
    const point = intersectPhIntervals(
      { low: 3, high: 7, lowClosed: true, highClosed: true },
      { low: 7, high: 8, lowClosed: true, highClosed: true },
    );
    expect(intervalClass(point)).toBe('neutral');
  });
  it('keeps acidic, neutral and basic complete inventories electrically neutral in all eighteen states', () => {
    const classes = [
      'acidic',
      'basic',
      'neutral',
      'neutral',
      'acidic',
      'basic',
    ];
    classes.forEach((classification, i) => {
      for (let portions = 1; portions <= 3; portions++) {
        const l = aqueousPhInventory(i, portions);
        expect(l.classification).toBe(classification);
        expect(l.net).toBe(0);
        expect(l.positive).toBe(l.counts.hydronium + l.counts.sodium);
        expect(l.negative).toBe(l.counts.hydroxide + l.counts.chloride);
      }
    });
  });
  it('does not change ion concentrations when sampling twice the homogeneous volume', () => {
    for (let i = 0; i < 6; i++) {
      const a = aqueousPhInventory(i, 1),
        b = aqueousPhInventory(i, 2);
      expect(b.counts.hydronium).toBe(2 * a.counts.hydronium);
      expect(b.hydroniumDensity).toBe(a.hydroniumDensity);
      expect(b.hydroxideDensity).toBe(a.hydroxideDensity);
      expect(b.classification).toBe(a.classification);
    }
  });
  it('separates neutral pH from no ions and from a uniquely pure-water inventory', () => {
    const pure = aqueousPhInventory(2, 1),
      salt = aqueousPhInventory(3, 1);
    expect(pure.counts.hydronium).toBeGreaterThan(0);
    expect(pure.counts.hydroxide).toBeGreaterThan(0);
    expect(salt.classification).toBe(pure.classification);
    expect(salt.positive).toBeGreaterThan(pure.positive);
    expect(aqueousPhInventory(0, 1).counts.hydroxide).toBeGreaterThan(0);
  });
  it('rejects unsupported readings, invalid intervals and unsupported sampling portions', () => {
    for (const x of [-1, 3, 0.5])
      expect(() => indicatorEvidence(x, 0)).toThrow();
    expect(() => indicatorRange(2, 0)).toThrow();
    expect(() => aqueousPhInventory(6, 1)).toThrow();
    expect(() => aqueousPhInventory(0, 4)).toThrow();
    expect(() =>
      intersectPhIntervals(
        { low: 8, high: 2, lowClosed: true, highClosed: true },
        { low: 0, high: 14, lowClosed: true, highClosed: true },
      ),
    ).toThrow();
  });
});
