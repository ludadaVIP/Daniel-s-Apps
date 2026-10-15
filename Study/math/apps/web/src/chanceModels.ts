import { rational, textR, type Rational } from './algebraModels';
export function orderedSummary(values: number[]) {
  if (
    !values.length ||
    values.length > 30 ||
    values.some((v) => !Number.isSafeInteger(v) || Math.abs(v) > 1000)
  )
    throw new RangeError('Use one to thirty bounded whole-number observations');
  const sorted = values
      .map((value, id) => ({ value, id }))
      .sort((a, b) => a.value - b.value || a.id - b.id),
    count = sorted.length,
    total = values.reduce((a, b) => a + b, 0),
    middle = count % 2 ? [Math.floor(count / 2)] : [count / 2 - 1, count / 2];
  const frequencies = [...new Set(values)]
      .sort((a, b) => a - b)
      .map((value) => ({
        value,
        count: values.filter((v) => v === value).length,
      })),
    maxFrequency = Math.max(...frequencies.map((f) => f.count));
  return {
    sorted,
    count,
    total,
    middle,
    median: rational(
      BigInt(middle.reduce((s, i) => s + sorted[i]!.value, 0)),
      BigInt(middle.length),
    ),
    mean: rational(BigInt(total), BigInt(count)),
    frequencies,
    modes:
      maxFrequency < 2
        ? []
        : frequencies
            .filter((f) => f.count === maxFrequency)
            .map((f) => f.value),
    maxFrequency,
  };
}
export type SpinnerSector = {
  id: number;
  label: string;
  weight: number;
  start: number;
  end: number;
};
export type SpinnerModel = {
  sectors: SpinnerSector[];
  total: number;
  labels: string[];
  labelWeights: { label: string; weight: number }[];
  equalSectors: boolean;
  equalLabels: boolean;
};
export function spinnerModel(
  labels: string[],
  weights: number[],
): SpinnerModel {
  if (
    !labels.length ||
    labels.length > 8 ||
    weights.length !== labels.length ||
    labels.some((s) => !s || s.length > 8) ||
    weights.some((w) => !Number.isSafeInteger(w) || w <= 0 || w > 8) ||
    weights.reduce((s, w) => s + w, 0) > 32
  )
    throw new RangeError(
      'Use one to eight named positive sectors, total weight at most 32',
    );
  const total = weights.reduce((s, w) => s + w, 0);
  let previous = 0;
  const sectors = labels.map((label, id) => {
      const start = previous;
      previous += weights[id]!;
      return {
        id,
        label,
        weight: weights[id]!,
        start: start / total,
        end: previous / total,
      };
    }),
    names = [...new Set(labels)],
    labelWeights = names.map((label) => ({
      label,
      weight: sectors
        .filter((s) => s.label === label)
        .reduce((s, v) => s + v.weight, 0),
    }));
  return {
    sectors,
    total,
    labels: names,
    labelWeights,
    equalSectors: new Set(weights).size === 1,
    equalLabels: new Set(labelWeights.map((r) => r.weight)).size === 1,
  };
}
export function eventChance(model: SpinnerModel, event: string[]) {
  if (new Set(event).size !== event.length)
    throw new RangeError('Name each event label once');
  const favourable = model.sectors
      .filter((s) => event.includes(s.label))
      .reduce((s, v) => s + v.weight, 0),
    probability = rational(BigInt(favourable), BigInt(model.total));
  return {
    favourable,
    total: model.total,
    probability,
    kind:
      favourable === 0
        ? ('impossible' as const)
        : favourable === model.total
          ? ('certain' as const)
          : ('possible' as const),
  };
}
export function spinnerAt(model: SpinnerModel, u: number) {
  if (!Number.isFinite(u) || u < 0 || u >= 1)
    throw new RangeError('Use a uniform angle fraction in [0,1)');
  return model.sectors.find((s) => u < s.end)!;
}
export function bagChance(counts: number[], selected: number[]) {
  if (
    counts.length !== 3 ||
    counts.some((n) => !Number.isSafeInteger(n) || n < 0 || n > 10) ||
    !counts.some(Boolean) ||
    new Set(selected).size !== selected.length ||
    selected.some((i) => !Number.isInteger(i) || i < 0 || i >= 3)
  )
    throw new RangeError(
      'Use a nonempty three-label bag and distinct selected labels',
    );
  const total = counts.reduce((a, b) => a + b, 0),
    favourable = selected.reduce((a, i) => a + counts[i]!, 0);
  return {
    favourable,
    total,
    probability: rational(BigInt(favourable), BigInt(total)),
    tokens: counts.flatMap((n, label) =>
      Array.from({ length: n }, (_, i) => ({ label, id: `${label}-${i}` })),
    ),
  };
}
export function nextUniform(state: number) {
  if (!Number.isSafeInteger(state) || state < 0 || state > 0xffffffff)
    throw new RangeError('Use an unsigned 32-bit simulation state');
  const next = (Math.imul(1664525, state) + 1013904223) >>> 0;
  return { state: next, u: (next + 0.5) / 4294967296 };
}
export function runSpinnerTrials(
  model: SpinnerModel,
  state: number,
  count: number,
) {
  if (!Number.isSafeInteger(count) || count < 1 || count > 1000)
    throw new RangeError('Use one to one thousand trials');
  const outcomes: { label: string; sector: number; u: number }[] = [];
  for (let i = 0; i < count; i++) {
    const next = nextUniform(state),
      sector = spinnerAt(model, next.u);
    state = next.state;
    outcomes.push({ label: sector.label, sector: sector.id, u: next.u });
  }
  return { state, outcomes };
}
export function frequencySummary(outcomes: string[], event: string[]) {
  if (outcomes.length > 1000 || new Set(event).size !== event.length)
    throw new RangeError('Keep one batch within one thousand observations');
  let hits = 0;
  const trace = outcomes.map((label, i) => {
    if (event.includes(label)) hits++;
    return { trials: i + 1, hits, value: hits / (i + 1) };
  });
  const trials = outcomes.length;
  return {
    hits,
    trials,
    frequency: trials ? rational(BigInt(hits), BigInt(trials)) : null,
    trace,
  };
}
export const fractionText = (value: Rational) => textR(value);
