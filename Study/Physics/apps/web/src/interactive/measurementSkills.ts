/** Teaching data, not readings collected from a learner's real experiment. */
export const referenceLength = 10;
export function calibrationReadings(offset: number, division: number) {
  if (!Number.isFinite(offset) || ![1, 0.1].includes(division))
    throw new RangeError('Invalid ruler settings');
  return [9.9, 10, 10.1].map((v) =>
    Number((Math.round((v + offset) / division) * division).toFixed(1)),
  );
}
export function displacedVolume(before: number, after: number) {
  if (![before, after].every(Number.isFinite) || before < 0 || after < before)
    throw new RangeError('Invalid cylinder readings');
  return after - before;
}
export function blockVolume(a: number, b: number, c: number) {
  if (![a, b, c].every((n) => Number.isFinite(n) && n > 0))
    throw new RangeError('Invalid block dimensions');
  return a * b * c;
}
export const repeatTimes = [10.2, 9.8, 10] as const;
export type Trial = { value: number; invalid: boolean };
export function trialSummary(trials: Trial[]) {
  if (!trials.every((t) => Number.isFinite(t.value) && t.value >= 0))
    throw new RangeError('Invalid measurement');
  const raw = trials.map((t) => t.value),
    included = trials.filter((t) => !t.invalid).map((t) => t.value);
  const average = (values: number[]) =>
    values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
  return {
    rawMean: average(raw),
    mean: average(included),
    count: included.length,
    range: included.length ? Math.max(...included) - Math.min(...included) : null,
  };
}
export function paperReading(count: number, endpointError = 0) {
  if (![1, 20, 100].includes(count) || ![0, 1].includes(endpointError))
    throw new RangeError('Invalid paper settings');
  const trueThickness = 0.1, division = 1;
  // Fixed small endpoint variation, rounded to this model's 1 mm divisions.
  const stackReading = Math.round(count * trueThickness + 0.18 + endpointError);
  return {
    count,
    trueThickness,
    division,
    stackReading,
    estimate: stackReading / count,
    resolved: count * trueThickness >= division,
    endpointContribution: endpointError / count,
  };
}
