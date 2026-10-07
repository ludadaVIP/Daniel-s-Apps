import { describe, expect, it } from 'vitest';
import {
  butaneSkeleton,
  ethaneSkeleton,
  etheneSkeleton,
  hydrocarbonInventory,
  isobutaneSkeleton,
  polyetheneSegment,
  propaneSkeleton,
  sameCarbonConnectivity,
} from './organicStructures';

describe('hydrocarbon structure and connectivity', () => {
  it('gives C4H10 for both isomers with different local hydrogen counts', () => {
    expect(hydrocarbonInventory(butaneSkeleton)).toEqual({
      carbons: 4,
      hydrogens: 10,
      perCarbon: [3, 2, 2, 3],
    });
    expect(hydrocarbonInventory(isobutaneSkeleton)).toEqual({
      carbons: 4,
      hydrogens: 10,
      perCarbon: [1, 3, 3, 3],
    });
    expect(hydrocarbonInventory(propaneSkeleton).hydrogens).toBe(8);
  });
  it('recognises the same connectivity under an arbitrary carbon relabelling', () => {
    expect(
      sameCarbonConnectivity(butaneSkeleton, {
        carbons: 4,
        bonds: [
          [2, 0, 1],
          [0, 3, 1],
          [3, 1, 1],
        ],
      }),
    ).toBe(true);
    expect(sameCarbonConnectivity(butaneSkeleton, isobutaneSkeleton)).toBe(
      false,
    );
    expect(sameCarbonConnectivity(butaneSkeleton, propaneSkeleton)).toBe(false);
  });
  it('accounts for bond order when comparing graphs', () => {
    expect(sameCarbonConnectivity(etheneSkeleton, ethaneSkeleton)).toBe(false);
    expect(hydrocarbonInventory(etheneSkeleton)).toEqual({
      carbons: 2,
      hydrogens: 4,
      perCarbon: [2, 2],
    });
    expect(hydrocarbonInventory(ethaneSkeleton)).toEqual({
      carbons: 2,
      hydrogens: 6,
      perCarbon: [3, 3],
    });
  });
  it('conserves atoms when one H2 is added to ethene', () => {
    const before = hydrocarbonInventory(etheneSkeleton),
      after = hydrocarbonInventory(ethaneSkeleton);
    expect(before.carbons).toBe(after.carbons);
    expect(before.hydrogens + 2).toBe(after.hydrogens);
  });
  it('rejects bonds that would overfill a carbon', () => {
    expect(() =>
      hydrocarbonInventory({
        carbons: 3,
        bonds: [
          [0, 1, 3],
          [0, 2, 2],
        ],
      }),
    ).toThrow(RangeError);
    expect(() =>
      hydrocarbonInventory({
        carbons: 2,
        bonds: [
          [0, 1, 1],
          [0, 1, 1],
        ],
      }),
    ).toThrow(RangeError);
  });
});

describe('polyethene interior segments, not complete molecules', () => {
  it('keeps the ethene atom inventory without a small-molecule byproduct', () => {
    const monomer = hydrocarbonInventory(etheneSkeleton);
    for (const n of [2, 3, 4]) {
      const segment = polyetheneSegment(n);
      expect(segment.carbons).toBe(n * monomer.carbons);
      expect(segment.hydrogens).toBe(n * monomer.hydrogens);
      expect(segment.continuationBonds).toBe(2);
      expect(
        2 * segment.internalBonds +
          segment.continuationBonds +
          segment.hydrogens,
      ).toBe(4 * segment.carbons);
    }
  });
  it('does not pretend the segment is a capped alkane molecule', () => {
    expect(polyetheneSegment(3).hydrogens).toBe(12);
    expect(polyetheneSegment(3).hydrogens).not.toBe(14);
    expect(() => polyetheneSegment(0)).toThrow(RangeError);
  });
});
