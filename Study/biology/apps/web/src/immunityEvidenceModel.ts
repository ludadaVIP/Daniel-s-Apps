/** Original teaching datasets. No clinical predictions or inferential statistics. */
export const immuneRoutes = [
  { event: 'skin', route: 'innate', count: 60 },
  { event: 'phagocyte', route: 'innate', count: 25 },
  { event: 'B-cell clone', route: 'adaptive', count: 15 },
] as const;
export const memoryCurve = {
  first: [0, 1, 3, 8, 4, 2],
  repeat: [2, 7, 16, 20, 12, 6],
};
export type Population = { sensitive: number; resistant: number };
const count = (v: number) => {
  if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v))
    throw new Error('Nonnegative whole counts required');
  return v;
};
export function resistantFraction(p: Population): number | null {
  count(p.sensitive);
  count(p.resistant);
  const total = p.sensitive + p.resistant;
  return total === 0 ? null : p.resistant / total;
}
/** Equal inheritance and division; selection changes survival, never converts a sensitive cell. */
export function resistanceFrames(
  initialResistant: number,
  pressure: boolean,
): Population[] {
  count(initialResistant);
  if (initialResistant > 20) throw new Error('At most 20 starting cells');
  const start = {
    sensitive: 20 - initialResistant,
    resistant: initialResistant,
  };
  const survivors = pressure
    ? { sensitive: 0, resistant: initialResistant }
    : { ...start };
  return [
    start,
    survivors,
    { sensitive: survivors.sensitive * 4, resistant: survivors.resistant * 4 },
  ];
}
export function riskComparison(
  eventsA: number,
  nA: number,
  eventsB: number,
  nB: number,
) {
  [eventsA, nA, eventsB, nB].forEach(count);
  if (!nA || !nB || eventsA > nA || eventsB > nB)
    throw new Error('Valid nonzero denominators required');
  const a = eventsA / nA,
    b = eventsB / nB;
  return {
    a,
    b,
    absoluteReduction: b - a,
    relativeReduction: b === 0 ? null : (b - a) / b,
  };
}
export const studyData = {
  outcome: 'fictional symptom event',
  complete: {
    A: { events: 10, observed: 200 },
    B: { events: 20, observed: 200 },
  },
  separateMissing: {
    A: { assigned: 200, observed: 170, events: 10, missing: 30 },
    B: { assigned: 200, observed: 200, events: 20, missing: 0 },
  },
};
export const seedlingData = { short: [8, 9, 10, 9], long: [11, 12, 12, 13] };
export function summary(values: readonly number[]) {
  if (!values.length || values.some((v) => !Number.isFinite(v)))
    throw new Error('Finite data required');
  const min = Math.min(...values),
    max = Math.max(...values);
  return {
    n: values.length,
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    min,
    max,
    range: max - min,
  };
}
export function biologicalReplicates(sampleIds: readonly string[]) {
  if (sampleIds.some((id) => !id.trim()))
    throw new Error('Sample IDs required');
  return new Set(sampleIds).size;
}
export function pairedDifference(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length || !a.length)
    throw new Error('Matched nonempty pairs required');
  return summary(b.map((v, i) => v - a[i]!));
}
export const blockData = [
  { block: 'near window', short: 10, long: 13 },
  { block: 'far window', short: 8, long: 11 },
];
export function assessHypothesis(
  factor: string,
  outcome: string,
  controls: boolean,
) {
  return (
    factor === 'light hours' &&
    outcome === 'height change in cm after 7 days' &&
    controls
  );
}
