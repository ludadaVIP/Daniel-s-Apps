import {
  rational,
  addR,
  mulR,
  divR,
  negR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { compareR } from './inequalityModels';
import { combinations } from './countingModels';
import { nextUniform } from './chanceModels';
const R = readRational,
  Z = rational(0n),
  ONE = rational(1n),
  sub = (a: Rational, b: Rational) => addR(a, negR(b));
export const distributionNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export type DistributionRow = { value: Rational; p: Rational };
export function distribution(raw: readonly (readonly [string, string])[]) {
  return auditRows(raw.map(([x, p]) => ({ value: R(x), p: R(p) })));
}
function auditRows(rows: DistributionRow[]) {
  if (!rows.length || rows.length > 25)
    throw new RangeError('One to twenty-five rows');
  if (
    rows.some(
      (r) =>
        compareR(r.p, Z) < 0 ||
        compareR(r.p, ONE) > 0 ||
        Math.abs(distributionNumber(r.value)) > 1000,
    ) ||
    new Set(rows.map((r) => textR(r.value))).size !== rows.length ||
    !sameR(
      rows.reduce((s, r) => addR(s, r.p), Z),
      ONE,
    )
  )
    throw new RangeError(
      'Distinct bounded values and probabilities summing exactly to one',
    );
  rows.sort((a, b) => compareR(a.value, b.value));
  const mean = rows.reduce((s, r) => addR(s, mulR(r.value, r.p)), Z),
    second = rows.reduce(
      (s, r) => addR(s, mulR(mulR(r.value, r.value), r.p)),
      Z,
    ),
    variance = rows.reduce(
      (s, r) =>
        addR(s, mulR(mulR(sub(r.value, mean), sub(r.value, mean)), r.p)),
      Z,
    );
  return {
    rows,
    mean,
    second,
    variance,
    sd: `sqrt(${textR(variance)})`,
    support: rows.filter((r) => r.p[0] > 0n).map((r) => r.value),
  };
}
export const distributionCases = {
  heads: [
    ['0', '1/4'],
    ['1', '1/2'],
    ['2', '1/4'],
  ],
  twoPoint: [
    ['0', '1/2'],
    ['3', '1/2'],
  ],
  spread: [
    ['-1', '1/2'],
    ['3', '1/2'],
  ],
  symmetric: [
    ['0', '1/2'],
    ['2', '1/2'],
  ],
  fixed: [['2', '1']],
  rare: [
    ['0', '9/10'],
    ['10', '1/10'],
  ],
} as const;
export type DistributionCase = keyof typeof distributionCases;
export function affineDistribution(
  m: ReturnType<typeof distribution>,
  scale: string,
  shift: string,
) {
  const a = R(scale),
    b = R(shift);
  if (
    Math.abs(distributionNumber(a)) > 10 ||
    Math.abs(distributionNumber(b)) > 100
  )
    throw new RangeError('Bounded affine transform');
  const merged = new Map<string, DistributionRow>();
  for (const row of m.rows) {
    const value = addR(mulR(a, row.value), b),
      key = textR(value);
    merged.set(key, { value, p: addR(merged.get(key)?.p ?? Z, row.p) });
  }
  return auditRows([...merged.values()]);
}
export function checkDistributionTable(raw: string, expected: string) {
  const parse = (s: string) => {
    const parts = s.trim().replace(/：/g, ':').replace(/；/g, ';').split(';');
    if (parts.length > 25 || parts.some((p) => !p.trim()))
      throw Error('Rows separated by semicolons');
    return distribution(
      parts.map((p) => {
        const pair = p.split(':');
        if (pair.length !== 2) throw Error('value:probability');
        return [pair[0]!, pair[1]!] as [string, string];
      }),
    );
  };
  try {
    const a = parse(raw),
      b = parse(expected);
    return (
      a.rows.length === b.rows.length &&
      a.rows.every(
        (r, i) => sameR(r.value, b.rows[i]!.value) && sameR(r.p, b.rows[i]!.p),
      )
    );
  } catch {
    return false;
  }
}
export function tableText(m: ReturnType<typeof distribution>) {
  return m.rows.map((r) => `${textR(r.value)}:${textR(r.p)}`).join(';');
}
export function distributionSimulation(
  m: ReturnType<typeof distribution>,
  seed: number,
  count: number,
) {
  if (!Number.isSafeInteger(count) || count < 0 || count > 2000)
    throw new RangeError('Zero to two thousand trials');
  nextUniform(seed);
  let state = seed,
    total = Z;
  const counts = m.rows.map(() => 0),
    trace: { state: number; value: string }[] = [];
  for (let i = 0; i < count; i++) {
    const next = nextUniform(state);
    state = next.state;
    const u = rational(2n * BigInt(state) + 1n, 8589934592n);
    let cumulative = Z,
      index = m.rows.length - 1;
    for (let j = 0; j < m.rows.length; j++) {
      cumulative = addR(cumulative, m.rows[j]!.p);
      if (compareR(u, cumulative) < 0) {
        index = j;
        break;
      }
    }
    const row = m.rows[index]!;
    counts[index]!++;
    total = addR(total, row.value);
    if (trace.length < 12) trace.push({ state, value: textR(row.value) });
  }
  return {
    seed,
    state,
    count,
    counts,
    total,
    average: count ? divR(total, rational(BigInt(count))) : null,
    trace,
  };
}
export function binomialDistribution(n: number, pRaw: string) {
  if (!Number.isSafeInteger(n) || n < 0 || n > 12)
    throw new RangeError('Zero to twelve fixed trials');
  const p = R(pRaw);
  if (compareR(p, Z) < 0 || compareR(p, ONE) > 0)
    throw new RangeError('Probability zero through one');
  const q = sub(ONE, p),
    power = (r: Rational, k: number) =>
      rational(r[0] ** BigInt(k), r[1] ** BigInt(k)),
    m = auditRows(
      Array.from({ length: n + 1 }, (_, k) => ({
        value: rational(BigInt(k)),
        p: mulR(
          rational(combinations(n, k)),
          mulR(power(p, k), power(q, n - k)),
        ),
      })),
    );
  return { ...m, n, p };
}
export function binomialEvent(
  m: ReturnType<typeof binomialDistribution>,
  k: number,
  kind: 'exact' | 'at-least' | 'at-most',
) {
  if (
    !Number.isSafeInteger(k) ||
    k < 0 ||
    k > m.n ||
    !['exact', 'at-least', 'at-most'].includes(kind)
  )
    throw new RangeError('Known count event');
  return m.rows
    .filter((_, j) =>
      kind === 'exact' ? j === k : kind === 'at-least' ? j >= k : j <= k,
    )
    .reduce((s, r) => addR(s, r.p), Z);
}
export const standardDensity = (z: number) =>
  Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
const cdfCache = new Map<number, number>();
/** Composite Simpson, 4096 panels. Far tails integrate [|z|,12] directly to avoid cancellation; omitted tail <2e-33. */
export function normalCdf(z: number) {
  if (!Number.isFinite(z) || Math.abs(z) > 8)
    throw new RangeError('Standard score between minus eight and eight');
  if (z === 0) return 0.5;
  const cached = cdfCache.get(z);
  if (cached !== undefined) return cached;
  const n = 4096,
    a = Math.abs(z),
    tail = a >= 4,
    lo = tail ? a : 0,
    hi = tail ? 12 : a,
    h = (hi - lo) / n;
  let sum = standardDensity(lo) + standardDensity(hi);
  for (let i = 1; i < n; i++)
    sum += (i % 2 ? 4 : 2) * standardDensity(lo + i * h);
  const area = (h * sum) / 3,
    left = tail ? area : 0.5 - area,
    value = z < 0 ? left : 1 - left;
  if (cdfCache.size > 200) cdfCache.clear();
  cdfCache.set(z, value);
  return value;
}
export function normalAudit(
  meanRaw: string,
  sdRaw: string,
  loRaw: string,
  hiRaw: string,
) {
  const mean = R(meanRaw),
    sd = R(sdRaw),
    lo = R(loRaw),
    hi = R(hiRaw);
  if (
    compareR(sd, Z) <= 0 ||
    Math.abs(distributionNumber(mean)) > 1000 ||
    distributionNumber(sd) > 100 ||
    compareR(lo, hi) > 0
  )
    throw new RangeError('Positive scale and ordered bounds');
  const zl = divR(sub(lo, mean), sd),
    zh = divR(sub(hi, mean), sd),
    left = normalCdf(distributionNumber(zl)),
    right = normalCdf(distributionNumber(zh));
  return {
    mean,
    sd,
    lo,
    hi,
    zl,
    zh,
    left,
    right,
    probability: right - left,
    pointProbability: 0,
  };
}
export function standardScore(xRaw: string, meanRaw: string, sdRaw: string) {
  const sd = R(sdRaw);
  if (compareR(sd, Z) <= 0)
    throw new RangeError('A standard score needs positive standard deviation');
  return divR(sub(R(xRaw), R(meanRaw)), sd);
}
export function probability4(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1)
    throw new RangeError('Approximate probability');
  return value.toFixed(4);
}
export function checkDistributionRounded(raw: string, value: string) {
  return (
    /^\d\.\d{4}$/.test(raw.trim()) &&
    Number(raw.trim()) <= 1 &&
    raw.trim() === value
  );
}
