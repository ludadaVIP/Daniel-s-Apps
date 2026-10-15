import { boundedWhole } from './measurementModels';

export function frequencyTable(
  categories: string[],
  records: (string | null)[],
) {
  if (
    !categories.length ||
    new Set(categories).size !== categories.length ||
    categories.some((s) => !s)
  )
    throw new RangeError('Use distinct non-empty categories');
  if (
    records.length > 200 ||
    records.some((v) => v !== null && !categories.includes(v))
  )
    throw new RangeError('Each response must be a category or missing');
  const rows = categories.map((id) => ({
    id,
    count: records.filter((v) => v === id).length,
  }));
  return {
    rows,
    recorded: rows.reduce((s, r) => s + r.count, 0),
    missing: records.filter((v) => v === null).length,
    invited: records.length,
  };
}
export function meanSummary(values: number[]) {
  if (!values.length || values.length > 30)
    throw new RangeError('Use one to thirty observations');
  values.forEach((v) => boundedWhole(v, 100, 0));
  const total = values.reduce((s, v) => s + v, 0);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const factor = gcd(total, values.length);
  return {
    total,
    count: values.length,
    n: total / factor,
    d: values.length / factor,
    mean: total / values.length,
  };
}
export function shareOne(values: number[]) {
  meanSummary(values);
  const next = [...values],
    high = Math.max(...values),
    low = Math.min(...values);
  if (high - low <= 1) return next;
  next[next.indexOf(high)]!--;
  next[next.indexOf(low)]!++;
  return next;
}
export type TimeObservation = { time: number; value: number | null };
export function timeSeries(points: TimeObservation[], maxY: number) {
  boundedWhole(maxY, 100, 1);
  if (points.length < 2 || points.length > 20 || points[0]!.time < 0)
    throw new RangeError('Use two to twenty ordered observations');
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    if (
      !Number.isFinite(p.time) ||
      p.time > 100 ||
      (i > 0 && p.time <= points[i - 1]!.time)
    )
      throw new RangeError('Time must increase strictly');
    if (
      p.value !== null &&
      (!Number.isFinite(p.value) || p.value < 0 || p.value > maxY)
    )
      throw new RangeError('Keep values within the labelled scale');
  }
  const first = points[0]!.time,
    last = points[points.length - 1]!.time;
  const plotted = points.map((p) => ({
    ...p,
    x: 60 + ((p.time - first) / (last - first)) * 420,
    y: p.value === null ? null : 260 - (p.value / maxY) * 210,
  }));
  const segments = plotted
    .slice(1)
    .flatMap((p, i) =>
      plotted[i]!.y !== null && p.y !== null
        ? [{ from: plotted[i]!, to: p }]
        : [],
    );
  return { points: plotted, segments };
}
export function barScale(values: number[], baseline: number, maximum: number) {
  if (
    !values.length ||
    !Number.isFinite(baseline) ||
    !Number.isFinite(maximum) ||
    baseline < 0 ||
    maximum <= baseline ||
    maximum > 100
  )
    throw new RangeError('Use a valid positive chart span');
  if (values.some((v) => !Number.isFinite(v) || v < baseline || v > maximum))
    throw new RangeError('Bars must lie inside the shown scale');
  return values.map((v) => ({
    value: v,
    height: ((v - baseline) / (maximum - baseline)) * 210,
  }));
}
export const recipeBase = { servings: 4, flourG: 200, milkMl: 300 };
export function recipePlan(servings: number, budgetCents: number) {
  boundedWhole(servings, 12, 1);
  boundedWhole(budgetCents, 10000, 0);
  const flourG = (recipeBase.flourG * servings) / recipeBase.servings;
  const milkMl = (recipeBase.milkMl * servings) / recipeBase.servings;
  // Whole packs are purchased, including partially used packs. All prices are fictional.
  const flourPacks = Math.ceil(flourG / 500),
    milkPacks = Math.ceil(milkMl / 1000);
  const costCents = flourPacks * 240 + milkPacks * 300;
  return {
    servings,
    flourG,
    milkMl,
    flourPacks,
    milkPacks,
    costCents,
    balanceCents: budgetCents - costCents,
    flourLeft: flourPacks * 500 - flourG,
    milkLeft: milkPacks * 1000 - milkMl,
  };
}
