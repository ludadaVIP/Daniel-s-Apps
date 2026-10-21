import {
  rational,
  addR,
  mulR,
  divR,
  textR,
  type Rational,
} from './algebraModels';
import {
  leastSquares,
  candidateFit,
  dataValue,
  dataNumber,
  subData,
  type DataPair,
} from './dataModellingModels';
const pairs = (
  values: readonly (readonly [string | number, string | number])[],
): DataPair[] =>
  values.map(([x, y], i) => ({ id: `P${i + 1}`, x: String(x), y: String(y) }));
export const statisticsCases = {
  noisy: pairs([
    [1, 1],
    [2, 3],
    [3, 2],
  ]),
  perfect: pairs([
    [1, 2],
    [2, 4],
    [3, 6],
  ]),
  negative: pairs([
    [1, 6],
    [2, 4],
    [3, 2],
  ]),
  curve: pairs([
    [1, 4],
    [2, 1],
    [3, 0],
    [4, 1],
    [5, 4],
  ]),
  flat: pairs([
    [1, 2],
    [2, 2],
    [3, 2],
  ]),
  vertical: pairs([
    [2, 1],
    [2, 3],
    [2, 2],
  ]),
  influence: pairs([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 0],
  ]),
  fan: pairs([
    [1, '3/2'],
    [1, '5/2'],
    [2, 2],
    [2, 6],
    [3, 3],
    [3, 9],
  ]),
};
export type StatisticsCase = keyof typeof statisticsCases;
function rootFloor(n: bigint) {
  if (n < 0n) throw new RangeError('Nonnegative root');
  if (n < 2n) return n;
  let x = n,
    y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}
export function correlationModel(raw: readonly DataPair[]) {
  const fit = leastSquares(raw),
    syy = fit.rows.reduce((s, r) => {
      const d = subData(r.py, fit.my);
      return addR(s, mulR(d, d));
    }, rational(0n));
  const defined = fit.sxx[0] !== 0n && syy[0] !== 0n;
  const squared = defined
    ? divR(mulR(fit.sxy, fit.sxy), mulR(fit.sxx, syy))
    : null;
  const sign = fit.sxy[0] < 0n ? -1n : fit.sxy[0] > 0n ? 1n : 0n;
  let exact: Rational | null = null;
  if (squared) {
    const n = rootFloor(squared[0]),
      d = rootFloor(squared[1]);
    if (n * n === squared[0] && d * d === squared[1])
      exact = rational(sign * n, d);
  }
  const value = squared ? Number(sign) * Math.sqrt(dataNumber(squared)) : null;
  const text = !squared
    ? 'undefined'
    : exact
      ? textR(exact)
      : `${sign < 0n ? '-' : ''}sqrt(${squared[0] * squared[1]})/${squared[1]}`;
  return { fit, syy, defined, squared, value, exact, text };
}
export function transformPairs(
  raw: readonly DataPair[],
  xScale: string,
  xShift: string,
  yScale: string,
  yShift: string,
) {
  const k = dataValue(xScale),
    h = dataValue(xShift),
    m = dataValue(yScale),
    c = dataValue(yShift);
  return raw.map((r) => ({
    id: r.id,
    x: textR(addR(mulR(dataValue(r.x), k), h)),
    y: textR(addR(mulR(dataValue(r.y), m), c)),
  }));
}
export function regressionAudit(
  raw: readonly DataPair[],
  a: string,
  b: string,
) {
  const fit = leastSquares(raw),
    candidate = candidateFit(raw, a, b),
    n = rational(BigInt(raw.length)),
    offset = subData(addR(dataValue(a), mulR(dataValue(b), fit.mx)), fit.my),
    levelCost = mulR(n, mulR(offset, offset)),
    slopeDifference = fit.slope
      ? subData(dataValue(b), fit.slope)
      : rational(0n),
    slopeCost = mulR(fit.sxx, mulR(slopeDifference, slopeDifference));
  return {
    fit,
    candidate,
    levelCost,
    slopeCost,
    gap: subData(candidate.sse, fit.sse),
    sumResidual: candidate.rows.reduce(
      (s, r) => addR(s, r.residual),
      rational(0n),
    ),
    sumXResidual: candidate.rows.reduce(
      (s, r) => addR(s, mulR(r.px, r.residual)),
      rational(0n),
    ),
  };
}
export const samplingPopulation = [
  { id: 'A', value: '0' },
  { id: 'B', value: '0' },
  { id: 'C', value: '4' },
  { id: 'D', value: '4' },
] as const;
export type SamplingDesign = 'srs' | 'convenience';
export function samplingDistribution(
  n: number,
  design: SamplingDesign = 'srs',
) {
  if (
    !Number.isInteger(n) ||
    n < 1 ||
    n > 4 ||
    !['srs', 'convenience'].includes(design)
  )
    throw new RangeError(
      'Known design, one to four distinct population members',
    );
  const subsets: number[][] = [];
  const visit = (start: number, selected: number[]) => {
    if (selected.length === n) {
      subsets.push(selected);
      return;
    }
    for (let j = start; j < 4; j++) visit(j + 1, [...selected, j]);
  };
  visit(0, []);
  const chosen = design === 'convenience' ? [subsets[0]!] : subsets;
  const samples = chosen.map((indices, i) => ({
    id: `S${i + 1}`,
    indices,
    ids: indices.map((j) => samplingPopulation[j]!.id),
    mean: divR(
      indices.reduce(
        (s, j) => addR(s, dataValue(samplingPopulation[j]!.value)),
        rational(0n),
      ),
      rational(BigInt(n)),
    ),
  }));
  const mean = divR(
      samples.reduce((s, r) => addR(s, r.mean), rational(0n)),
      rational(BigInt(samples.length)),
    ),
    variance = divR(
      samples.reduce((s, r) => {
        const d = subData(r.mean, mean);
        return addR(s, mulR(d, d));
      }, rational(0n)),
      rational(BigInt(samples.length)),
    ),
    populationMean = rational(2n),
    bias = subData(mean, populationMean);
  const counts = new Map<string, number>();
  for (const s of samples) {
    const key = textR(s.mean);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const distribution = [...counts]
    .sort(([a], [b]) => dataNumber(subData(dataValue(a), dataValue(b))))
    .map(([value, count]) => ({
      value,
      count,
      probability: rational(BigInt(count), BigInt(samples.length)),
    }));
  return {
    n,
    design,
    samples,
    distribution,
    mean,
    variance,
    populationMean,
    bias,
  };
}
export function samplingSimulation(
  n: number,
  repetitions: number,
  seed: number,
  design: SamplingDesign = 'srs',
) {
  if (
    !Number.isInteger(repetitions) ||
    repetitions < 1 ||
    repetitions > 500 ||
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 0xffffffff
  )
    throw new RangeError('Bounded repetitions and 32-bit seed');
  const exact = samplingDistribution(n, design),
    count = exact.samples.length,
    limit = Math.floor(0x100000000 / count) * count;
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return (z ^ (z >>> 14)) >>> 0;
  };
  const draws = Array.from({ length: repetitions }, (_, i) => {
    let u = next();
    while (u >= limit) u = next();
    const sample = exact.samples[u % count]!;
    return { round: i + 1, ...sample };
  });
  const counts = new Map<string, number>();
  for (const d of draws) {
    const key = textR(d.mean);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const empirical = exact.distribution.map((d) => ({
    ...d,
    observed: counts.get(d.value) ?? 0,
    frequency: rational(BigInt(counts.get(d.value) ?? 0), BigInt(repetitions)),
  }));
  const average = divR(
    draws.reduce((s, d) => addR(s, d.mean), rational(0n)),
    rational(BigInt(repetitions)),
  );
  return {
    exact,
    draws,
    empirical,
    average,
    last: draws.at(-1)!,
    seed,
    repetitions,
  };
}
export function responseBounds(
  population: number,
  respondents: number,
  yes: number,
) {
  if (
    ![population, respondents, yes].every(Number.isSafeInteger) ||
    population < 1 ||
    population > 10000 ||
    respondents < 1 ||
    respondents > population ||
    yes < 0 ||
    yes > respondents
  )
    throw new RangeError('Consistent distinct binary response counts');
  return {
    population,
    respondents,
    yes,
    missing: population - respondents,
    sampleRate: rational(BigInt(yes), BigInt(respondents)),
    lower: rational(BigInt(yes), BigInt(population)),
    upper: rational(BigInt(yes + population - respondents), BigInt(population)),
  };
}
