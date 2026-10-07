export type CarbonBond = readonly [number, number, 1 | 2 | 3];
export type CarbonSkeleton = { carbons: number; bonds: readonly CarbonBond[] };

export const butaneSkeleton: CarbonSkeleton = {
  carbons: 4,
  bonds: [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 1],
  ],
};
export const isobutaneSkeleton: CarbonSkeleton = {
  carbons: 4,
  bonds: [
    [0, 1, 1],
    [0, 2, 1],
    [0, 3, 1],
  ],
};
export const propaneSkeleton: CarbonSkeleton = {
  carbons: 3,
  bonds: [
    [0, 1, 1],
    [1, 2, 1],
  ],
};
export const etheneSkeleton: CarbonSkeleton = {
  carbons: 2,
  bonds: [[0, 1, 2]],
};
export const ethaneSkeleton: CarbonSkeleton = {
  carbons: 2,
  bonds: [[0, 1, 1]],
};

/** Neutral lesson examples with implicit H and ordinary tetravalent carbon. */
export function hydrocarbonInventory(skeleton: CarbonSkeleton) {
  if (
    !Number.isInteger(skeleton.carbons) ||
    skeleton.carbons < 1 ||
    skeleton.carbons > 8
  )
    throw new RangeError('Use one to eight carbons in this small-graph model');
  const hydrogens = Array<number>(skeleton.carbons).fill(4);
  const seen = new Set<string>();
  for (const [a, b, order] of skeleton.bonds) {
    if (
      ![a, b].every(
        (i) => Number.isInteger(i) && i >= 0 && i < skeleton.carbons,
      ) ||
      a === b ||
      ![1, 2, 3].includes(order)
    )
      throw new RangeError('Invalid carbon bond');
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (seen.has(key)) throw new RangeError('Duplicate carbon bond');
    seen.add(key);
    hydrogens[a]! -= order;
    hydrogens[b]! -= order;
  }
  if (hydrogens.some((n) => n < 0))
    throw new RangeError('Carbon valence exceeds four');
  return {
    carbons: skeleton.carbons,
    hydrogens: hydrogens.reduce((a, b) => a + b, 0),
    perCarbon: hydrogens,
  };
}

/** Exhaustive relabelling for the tiny lesson graphs; coordinates play no role. */
export function sameCarbonConnectivity(a: CarbonSkeleton, b: CarbonSkeleton) {
  hydrocarbonInventory(a);
  hydrocarbonInventory(b);
  if (a.carbons !== b.carbons) return false;
  const size = a.carbons;
  const matrix = (s: CarbonSkeleton) => {
    const m = Array.from({ length: size }, () => Array<number>(size).fill(0));
    for (const [i, j, order] of s.bonds) {
      m[i]![j] = order;
      m[j]![i] = order;
    }
    return m;
  };
  const left = matrix(a),
    right = matrix(b);
  const mapping: number[] = [],
    used = new Set<number>();
  const visit = (index: number): boolean => {
    if (index === size) return true;
    for (let candidate = 0; candidate < size; candidate++) {
      if (
        used.has(candidate) ||
        !mapping.every(
          (mapped, i) => left[index]![i] === right[candidate]![mapped],
        )
      )
        continue;
      mapping.push(candidate);
      used.add(candidate);
      if (visit(index + 1)) return true;
      mapping.pop();
      used.delete(candidate);
    }
    return false;
  };
  return visit(0);
}

/** Interior chain segment only: the two terminal bonds continue outside the view. */
export function polyetheneSegment(units: number) {
  if (!Number.isInteger(units) || units < 1 || units > 6)
    throw new RangeError('Use one to six repeat units');
  const carbons = units * 2;
  return {
    carbons,
    hydrogens: units * 4,
    internalBonds: carbons - 1,
    continuationBonds: 2,
  };
}
