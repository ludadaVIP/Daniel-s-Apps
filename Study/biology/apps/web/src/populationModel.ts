/** Original virtual meadow. Every cell is 1 m²; counts are invented, not a field survey.
 * Sampling principles checked against OpenStax Biology 2e §45.1.
 */
export const meadowRows = [
  [0, 1, 0, 2, 1, 0],
  [1, 2, 3, 2, 1, 1],
  [2, 4, 6, 5, 3, 2],
  [3, 5, 8, 7, 4, 3],
  [2, 4, 5, 4, 3, 2],
  [1, 2, 3, 2, 1, 1],
] as const;
export const meadowGrid = meadowRows.flatMap((row, r) =>
  row.map((count, c) => ({
    id: `Q${String(r * 6 + c + 1).padStart(2, '0')}`,
    row: r,
    column: c,
    count,
    area: 1,
  })),
);
export type Quadrat = (typeof meadowGrid)[number];
export const meadowArea = meadowGrid.reduce((sum, q) => sum + q.area, 0);
export const meadowCensus = meadowGrid.reduce((sum, q) => sum + q.count, 0);
export const pathSample = meadowGrid.slice(0, 6).map((q) => q.id);
export function randomQuadrats(seed: number, count = 6) {
  if (
    !Number.isInteger(seed) ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > meadowGrid.length
  )
    throw new Error('Invalid sample request');
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const ids = meadowGrid.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  return ids.slice(0, count);
}
export function estimateMeadow(ids: readonly string[]) {
  if (!ids.length || new Set(ids).size !== ids.length)
    throw new Error('Use distinct quadrats');
  const records = ids.map((id) => {
    const q = meadowGrid.find((q) => q.id === id);
    if (!q) throw new Error('Unknown quadrat');
    return q;
  });
  const sampledArea = records.reduce((sum, q) => sum + q.area, 0),
    count = records.reduce((sum, q) => sum + q.count, 0);
  return {
    records,
    sampledArea,
    count,
    density: count / sampledArea,
    estimate: (count / sampledArea) * meadowArea,
    area: meadowArea,
  };
}
export function populationBalance(
  start: number,
  births: number,
  deaths: number,
  immigration: number,
  emigration: number,
) {
  const inputs = [start, births, deaths, immigration, emigration];
  if (inputs.some((n) => !Number.isInteger(n) || n < 0))
    throw new Error('Use non-negative counts');
  const end = start + births + immigration - deaths - emigration;
  if (end < 0) throw new Error('More removals than individuals');
  return end;
}
export const resourceScenarios = {
  dry: { water: 3, light: 8, minerals: 6 },
  watered: { water: 7, light: 8, minerals: 6 },
  shaded: { water: 7, light: 2, minerals: 6 },
} as const;
export function limitingResource(s: {
  water: number;
  light: number;
  minerals: number;
}) {
  const values = Object.entries(s);
  if (values.some(([, n]) => !Number.isFinite(n) || n < 0))
    throw new Error('Invalid resource capacity');
  const capacity = Math.min(...values.map(([, n]) => n));
  return {
    capacity,
    limits: values.filter(([, n]) => n === capacity).map(([key]) => key),
  };
}
export const ecoRecords = [
  { visit: 1, rain: 12, shaded: [2, 3, 4], open: [1, 2, 3] },
  { visit: 2, rain: 25, shaded: [3, 4, 5], open: [2, 4, 3] },
  { visit: 3, rain: 41, shaded: [4, 6, 5], open: [3, 5, 4] },
  { visit: 4, rain: 18, shaded: [4, 5, 3], open: [2, 3, 4] },
] as const;
export function mean(values: readonly number[]) {
  return values.length
    ? values.reduce((s, n) => s + n, 0) / values.length
    : null;
}
export type Genotype = 'AA' | 'Aa' | 'aa';
export type Environment = 'sheltered' | 'exposed';
export function fictionalLeafLength(
  genotype: Genotype,
  environment: Environment,
) {
  const baseline = { AA: 18, Aa: 16, aa: 14 }[genotype];
  return baseline + (environment === 'sheltered' ? 4 : 0);
}
export const leafLengths = [12, 13, 14, 14, 15, 16, 16, 17, 18, 18, 19, 20];
export const spotCounts = [0, 1, 2, 1, 0, 2, 2, 1, 2, 0, 1, 2];
export function variationBins(kind: 'length' | 'spots') {
  return kind === 'spots'
    ? [0, 1, 2].map((value) => ({
        label: String(value),
        count: spotCounts.filter((n) => n === value).length,
      }))
    : [
        [12, 15],
        [15, 18],
        [18, 21],
      ].map(([low, high]) => ({
        label: `${low}–<${high}`,
        count: leafLengths.filter((n) => n >= low! && n < high!).length,
      }));
}
export function offspringPossibilities(first: Genotype, second: Genotype) {
  const normalise = (a: string, b: string): Genotype =>
    a === b ? (`${a}${b}` as Genotype) : 'Aa';
  return first
    .split('')
    .flatMap((a) =>
      second
        .split('')
        .map((b) => ({ first: a, second: b, genotype: normalise(a, b) })),
    );
}
