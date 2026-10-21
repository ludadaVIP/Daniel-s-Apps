import {
  rational,
  addR,
  mulR,
  divR,
  negR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { compareR } from './inequalityModels';
import {
  distribution,
  binomialDistribution,
  normalCdf,
  distributionNumber as num,
} from './distributionModels';
const R = readRational,
  Z = rational(0n),
  sub = (a: Rational, b: Rational) => addR(a, negR(b));
export const inferencePopulation = [
  { id: 'A1', value: '0' },
  { id: 'A2', value: '0' },
  { id: 'A3', value: '0' },
  { id: 'B1', value: '6' },
  { id: 'B2', value: '6' },
  { id: 'B3', value: '6' },
] as const;
export type InferenceFrame = 'all' | 'near';
export function finiteInference(n: number, frame: InferenceFrame = 'all') {
  if (!['all', 'near'].includes(frame))
    throw new RangeError('Known sampling frame');
  const indices = frame === 'all' ? [0, 1, 2, 3, 4, 5] : [0, 1, 2];
  if (!Number.isSafeInteger(n) || n < 1 || n > indices.length)
    throw new RangeError('Sample size within frame');
  const subsets: number[][] = [];
  function visit(start: number, picked: number[]) {
    if (picked.length === n) {
      subsets.push(picked);
      return;
    }
    for (let j = start; j < indices.length; j++)
      visit(j + 1, [...picked, indices[j]!]);
  }
  visit(0, []);
  const populationMean = rational(3n),
    samples = subsets.map((ids, i) => {
      const mean = divR(
        ids.reduce((s, j) => addR(s, R(inferencePopulation[j]!.value)), Z),
        rational(BigInt(n)),
      );
      return {
        id: `S${i + 1}`,
        indices: ids,
        ids: ids.map((j) => inferencePopulation[j]!.id),
        mean,
        error: sub(mean, populationMean),
      };
    }),
    counts = new Map<string, number>();
  for (const s of samples) {
    const key = textR(s.mean);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const m = distribution(
      [...counts].map(([x, c]) => [x, `${c}/${samples.length}`]),
    ),
    bias = sub(m.mean, populationMean),
    mse = addR(m.variance, mulR(bias, bias));
  return {
    n,
    frame,
    frameIndices: indices,
    samples,
    populationMean,
    m,
    bias,
    mse,
  };
}
/** Same explicitly documented Mulberry32 word protocol used by the earlier sampling workbench. */
function generator(seed: number) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff)
    throw new RangeError('Unsigned 32-bit seed');
  let state = seed;
  return {
    word() {
      state = (state + 0x6d2b79f5) >>> 0;
      let z = state;
      z = Math.imul(z ^ (z >>> 15), z | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return (z ^ (z >>> 14)) >>> 0;
    },
    state: () => state,
  };
}
export function finiteInferenceSimulation(
  n: number,
  frame: InferenceFrame,
  repetitions: number,
  seed: number,
) {
  if (
    !Number.isSafeInteger(repetitions) ||
    repetitions < 0 ||
    repetitions > 500
  )
    throw new RangeError('Zero to five hundred repetitions');
  const exact = finiteInference(n, frame),
    rng = generator(seed),
    size = exact.samples.length,
    limit = Math.floor(4294967296 / size) * size,
    draws = [];
  let total = Z;
  const counts = new Map<string, number>();
  for (let i = 0; i < repetitions; i++) {
    let word = rng.word();
    while (word >= limit) word = rng.word();
    const sample = exact.samples[word % size]!;
    draws.push({ round: i + 1, ...sample });
    total = addR(total, sample.mean);
    const key = textR(sample.mean);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return {
    exact,
    repetitions,
    seed,
    state: rng.state(),
    draws,
    average: repetitions ? divR(total, rational(BigInt(repetitions))) : null,
    empirical: exact.m.rows.map((row) => ({
      ...row,
      count: counts.get(textR(row.value)) ?? 0,
      frequency: repetitions
        ? rational(
            BigInt(counts.get(textR(row.value)) ?? 0),
            BigInt(repetitions),
          )
        : null,
    })),
  };
}
function squareN(n: number) {
  const root = Math.sqrt(n);
  if (!Number.isSafeInteger(n) || n < 1 || n > 10000 || !Number.isInteger(root))
    throw new RangeError('A positive square sample size, at most ten thousand');
  return rational(BigInt(root));
}
export function knownSigmaInterval(
  meanRaw: string,
  sigmaRaw: string,
  n: number,
  criticalRaw = '2',
) {
  const mean = R(meanRaw),
    sigma = R(sigmaRaw),
    critical = R(criticalRaw);
  if (
    compareR(sigma, Z) <= 0 ||
    num(sigma) > 100 ||
    Math.abs(num(mean)) > 1000 ||
    compareR(critical, Z) <= 0 ||
    num(critical) > 4
  )
    throw new RangeError(
      'Bounded mean, positive known sigma and critical value',
    );
  const se = divR(sigma, squareN(n)),
    margin = mulR(critical, se),
    lower = sub(mean, margin),
    upper = addR(mean, margin);
  return {
    mean,
    sigma,
    n,
    critical,
    se,
    margin,
    lower,
    upper,
    value: `[${textR(lower)},${textR(upper)}]`,
    coverage: 2 * normalCdf(num(critical)) - 1,
  };
}
export function coverageSimulation(
  truth: number,
  sigmaRaw: string,
  n: number,
  criticalRaw: string,
  repetitions: number,
  seed: number,
) {
  if (
    !Number.isFinite(truth) ||
    Math.abs(truth) > 100 ||
    !Number.isSafeInteger(repetitions) ||
    repetitions < 0 ||
    repetitions > 200 ||
    n > 100
  )
    throw new RangeError('Bounded normal iid coverage experiment');
  const method = knownSigmaInterval('0', sigmaRaw, n, criticalRaw),
    rng = generator(seed),
    sigma = num(method.sigma),
    margin = num(method.margin),
    intervals = [];
  let hits = 0;
  for (let round = 0; round < repetitions; round++) {
    const observations = [];
    for (let j = 0; j < n; j++) {
      const u = (rng.word() + 0.5) / 4294967296,
        v = (rng.word() + 0.5) / 4294967296;
      observations.push(
        truth + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v),
      );
    }
    const mean = observations.reduce((s, x) => s + x, 0) / n,
      lower = mean - margin,
      upper = mean + margin,
      contains = lower <= truth && truth <= upper;
    if (contains) hits++;
    intervals.push({
      round: round + 1,
      observations,
      mean,
      lower,
      upper,
      contains,
    });
  }
  return {
    truth,
    method,
    seed,
    state: rng.state(),
    repetitions,
    intervals,
    hits,
    frequency: repetitions ? rational(BigInt(hits), BigInt(repetitions)) : null,
  };
}
export type InferenceCode =
  | 'reject'
  | 'do-not-reject'
  | 'not-justified'
  | 'meets-target'
  | 'below-target'
  | 'uncertain';
const codeAliases: Record<InferenceCode, string[]> = {
  reject: ['reject', 'reject h0', '拒绝原假设', '拒绝', '拒绝h0'],
  'do-not-reject': [
    'do-not-reject',
    'do not reject',
    'do not reject h0',
    '不拒绝原假设',
    '不拒绝',
    '不拒绝h0',
  ],
  'not-justified': [
    'not-justified',
    'conditions missing',
    '条件不足',
    '条件不满足',
  ],
  'meets-target': ['meets-target', '达到目标', '达标'],
  'below-target': ['below-target', '低于目标', '未达目标'],
  uncertain: ['uncertain', '尚不确定', '不确定'],
};
export const checkInferenceCode = (raw: string, value: InferenceCode) =>
  codeAliases[value]?.includes(raw.trim().toLowerCase()) ?? false;
export type TestAlternative = 'upper' | 'lower' | 'two-sided';
export function exactBinomialTest(
  n: number,
  observed: number,
  alternative: TestAlternative = 'upper',
  alphaRaw = '1/10',
) {
  if (
    !Number.isSafeInteger(n) ||
    n < 1 ||
    n > 12 ||
    !Number.isSafeInteger(observed) ||
    observed < 0 ||
    observed > n ||
    !['upper', 'lower', 'two-sided'].includes(alternative)
  )
    throw new RangeError(
      'Fixed fair-null binomial count and planned alternative',
    );
  const alpha = R(alphaRaw);
  if (compareR(alpha, Z) <= 0 || compareR(alpha, rational(1n)) >= 0)
    throw new RangeError('Alpha strictly between zero and one');
  const m = binomialDistribution(n, '1/2'),
    isExtreme = (k: number, k0: number) =>
      alternative === 'upper'
        ? k >= k0
        : alternative === 'lower'
          ? k <= k0
          : Math.abs(2 * k - n) >= Math.abs(2 * k0 - n),
    pAt = (k0: number) =>
      m.rows.reduce((s, r, k) => (isExtreme(k, k0) ? addR(s, r.p) : s), Z),
    p = pAt(observed),
    critical = m.rows
      .map((_, k) => k)
      .filter((k) => compareR(pAt(k), alpha) <= 0),
    falsePositive = critical.reduce((s, k) => addR(s, m.rows[k]!.p), Z);
  return {
    n,
    observed,
    alternative,
    alpha,
    m,
    p,
    extreme: m.rows.map((_, k) => k).filter((k) => isExtreme(k, observed)),
    critical,
    falsePositive,
    decision: (compareR(p, alpha) <= 0
      ? 'reject'
      : 'do-not-reject') as InferenceCode,
  };
}
export const practicalCases = {
  tinyPrecise: { effect: '1/5', n: 10000 },
  tinyNoisy: { effect: '1/5', n: 4 },
  largeNoisy: { effect: '2', n: 4 },
  largePrecise: { effect: '2', n: 100 },
  harmful: { effect: '-2', n: 100 },
} as const;
export type PracticalCase = keyof typeof practicalCases;
export function practicalEvidence(kind: PracticalCase, thresholdRaw = '1') {
  if (!Object.prototype.hasOwnProperty.call(practicalCases, kind))
    throw new RangeError('Known comparison case');
  const spec = practicalCases[kind],
    threshold = R(thresholdRaw);
  if (compareR(threshold, Z) <= 0 || num(threshold) > 5)
    throw new RangeError('Positive prespecified beneficial threshold');
  const interval = knownSigmaInterval(spec.effect, '4', spec.n, '1.96'),
    z = divR(interval.mean, interval.se),
    p = 2 * normalCdf(-Math.abs(num(z))),
    meaning: InferenceCode =
      compareR(interval.lower, threshold) >= 0
        ? 'meets-target'
        : compareR(interval.upper, threshold) < 0
          ? 'below-target'
          : 'uncertain';
  return {
    kind,
    ...spec,
    threshold,
    interval,
    z,
    p,
    decision: (p <= 0.05 ? 'reject' : 'do-not-reject') as InferenceCode,
    meaning,
    harm: compareR(interval.upper, Z) < 0,
  };
}
export const inferenceNumber = num;
