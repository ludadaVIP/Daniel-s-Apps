import { rational, textR } from './algebraModels';
import { nextUniform } from './chanceModels';

const integer = (n: number, max = 50) => {
  if (!Number.isSafeInteger(n) || n < 0 || n > max)
    throw new RangeError('Bounded nonnegative integer required');
  return n;
};
export function factorial(n: number): bigint {
  integer(n);
  let result = 1n;
  for (let k = 2; k <= n; k++) result *= BigInt(k);
  return result;
}
export function permutations(n: number, r: number, repeat = false): bigint {
  integer(n);
  integer(r);
  if (repeat) return BigInt(n) ** BigInt(r);
  if (r > n) return 0n;
  let result = 1n;
  for (let k = 0; k < r; k++) result *= BigInt(n - k);
  return result;
}
export function combinations(n: number, r: number): bigint {
  integer(n);
  integer(r);
  if (r > n) return 0n;
  const k = Math.min(r, n - r);
  let result = 1n;
  for (let i = 1; i <= k; i++)
    result = (result * BigInt(n - i + 1)) / BigInt(i);
  return result;
}
/** Complete small lists only: no truncation masquerading as enumeration. */
export function orderedSelections(
  n: number,
  r: number,
  repeat = false,
): string[][] {
  integer(n, 6);
  integer(r, 3);
  const labels = Array.from({ length: n }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  const rows: string[][] = [];
  const visit = (prefix: string[]) => {
    if (prefix.length === r) {
      rows.push(prefix);
      return;
    }
    for (const x of labels)
      if (repeat || !prefix.includes(x)) visit([...prefix, x]);
  };
  visit([]);
  return rows;
}
export function selectionGroups(n: number, r: number) {
  const groups = new Map<string, string[][]>();
  for (const row of orderedSelections(n, r)) {
    const key = [...row].sort().join('');
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.entries()].map(([key, orders]) => ({
    key: key || '∅',
    orders,
  }));
}
export function countingUnion(a: readonly string[], b: readonly string[]) {
  if (new Set(a).size !== a.length || new Set(b).size !== b.length)
    throw new RangeError('Each category must list distinct identities');
  const overlap = a.filter((x) => b.includes(x));
  return { a: [...a], b: [...b], overlap, union: [...new Set([...a, ...b])] };
}
export function countingStages(
  first: number,
  second: number,
  excludeSame: boolean,
) {
  integer(first, 6);
  integer(second, 6);
  const rows = Array.from({ length: first }, (_, i) =>
    Array.from({ length: second }, (_, j) => ({
      first: i + 1,
      second: j + 1,
    })).filter((p) => !excludeSame || p.first !== p.second),
  );
  return { rows, total: rows.reduce((s, row) => s + row.length, 0) };
}
export const pascalRow = (n: number) => {
  integer(n);
  return Array.from({ length: n + 1 }, (_, k) => combinations(n, k));
};
export function binomialCoefficient(n: number, k: number, b: number) {
  integer(n, 12);
  integer(k, 12);
  if (!Number.isSafeInteger(b) || Math.abs(b) > 5)
    throw new RangeError('Small integer b');
  return combinations(n, k) * BigInt(b) ** BigInt(k);
}
/** Each record is a fresh n-flip trial, not a forced theoretical histogram. */
export function simulateBinomial(n: number, trials: number, seed: number) {
  integer(n, 8);
  integer(trials, 1000);
  nextUniform(seed);
  const bins = Array<number>(n + 1).fill(0),
    records: number[] = [];
  let state = seed;
  for (let trial = 0; trial < trials; trial++) {
    let heads = 0;
    for (let flip = 0; flip < n; flip++) {
      const draw = nextUniform(state);
      state = draw.state;
      if (draw.u < 0.5) heads++;
    }
    bins[heads]!++;
    records.push(heads);
  }
  return {
    bins,
    records,
    trials,
    state,
    frequencies: bins.map((v) =>
      trials ? rational(BigInt(v), BigInt(trials)) : null,
    ),
    theory: pascalRow(n).map((v) => rational(v, 2n ** BigInt(n))),
  };
}
export function contingency(cells: readonly number[]) {
  if (cells.length !== 4) throw new RangeError('Four disjoint cells');
  cells.forEach((n) => integer(n, 100000));
  const [ab, aOnly, bOnly, neither] = cells as [number, number, number, number];
  const total = ab + aOnly + bOnly + neither;
  if (!total) throw new RangeError('Nonempty outcome space');
  const a = ab + aOnly,
    b = ab + bOnly;
  return {
    ab,
    aOnly,
    bOnly,
    neither,
    total,
    a,
    b,
    pA: rational(BigInt(a), BigInt(total)),
    pB: rational(BigInt(b), BigInt(total)),
    pAB: rational(BigInt(ab), BigInt(total)),
    aGivenB: b ? rational(BigInt(ab), BigInt(b)) : null,
    bGivenA: a ? rational(BigInt(ab), BigInt(a)) : null,
    independent: ab * total === a * b,
    disjoint: ab === 0,
  };
}
/** Counts are expected masses in a hypothetical 1,000-item model, not observations. */
export function sourceFlagModel(
  priorPercent: number,
  flagA: number,
  flagOther: number,
) {
  [priorPercent, flagA, flagOther].forEach((n) => integer(n, 100));
  const a = 10 * priorPercent,
    other = 1000 - a;
  const aFlag = rational(BigInt(a * flagA), 100n);
  const otherFlag = rational(BigInt(other * flagOther), 100n);
  // Common 100,000-unit space keeps all integer percentage inputs exact.
  const counts = contingency([
    a * flagA,
    a * (100 - flagA),
    other * flagOther,
    other * (100 - flagOther),
  ]);
  return {
    ...counts,
    aMass: a,
    otherMass: other,
    aFlag,
    otherFlag,
    flagMassText: `${textR(aFlag)} + ${textR(otherFlag)}`,
    posterior: counts.aGivenB,
    likelihoodA: a ? rational(BigInt(flagA), 100n) : null,
    likelihoodOther: other ? rational(BigInt(flagOther), 100n) : null,
  };
}
