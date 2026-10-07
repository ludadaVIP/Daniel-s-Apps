export type LengthUnit = 'm' | 'cm' | 'mm';
export function lengthReading(metres: number, unit: LengthUnit) {
  return metres * { m: 1, cm: 100, mm: 1000 }[unit];
}
export function timingEstimate(count: number, stopDelay: number, period = 2) {
  if (!Number.isInteger(count) || count <= 0 || stopDelay < 0 || period <= 0)
    throw new RangeError('Invalid timing conditions');
  return {
    total: count * period + stopDelay,
    perCycle: period + stopDelay / count,
    errorPerCycle: stopDelay / count,
  };
}
export const rollingSamples = {
  smooth: [8.8, 9, 9.2],
  rough: [2.8, 3, 3.2],
} as const;
export function mean(values: readonly number[]) {
  return values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;
}
export type Walk = 'steady' | 'pause';
export const walkingSamples = {
  steady: [0, 1, 2, 3, 4],
  pause: [0, 2, 2, 2, 4],
} as const;
export function walkingDistance(walk: Walk, time: number) {
  const t = Math.max(0, Math.min(4, time));
  const i = Math.floor(t);
  const samples = walkingSamples[walk];
  return i === 4
    ? samples[4]
    : samples[i]! + (samples[i + 1]! - samples[i]!) * (t - i);
}
