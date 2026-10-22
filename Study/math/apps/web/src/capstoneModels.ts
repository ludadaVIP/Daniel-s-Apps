import {
  rational,
  addR,
  mulR,
  negR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational, valueR } from './rationalModels';
const whole = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Bounded whole project parameter');
  return n;
};
const scalar = (s: string) => {
  const r = readRational(s);
  if (valueR(s) < 0 || valueR(s) > 1000)
    throw new RangeError('Project litres in [0,1000]');
  return r;
};
const sub = (a: Rational, b: Rational) => addR(a, negR(b));
const min = (a: Rational, b: Rational) => (a[0] * b[1] <= b[0] * a[1] ? a : b);
const zero = rational(0n);
export type WaterRow = {
  day: number;
  opening: string;
  inflow: string;
  beforeUse: string;
  overflow: string;
  served: string;
  deficit: string;
  closing: string;
};
export function waterLedger(
  capacity: number,
  inflows: readonly string[],
  demand: string,
  initial = '0',
) {
  whole(capacity, 0, 300);
  if (inflows.length < 1 || inflows.length > 10)
    throw new RangeError('One to ten days');
  const cap = rational(BigInt(capacity)),
    need = scalar(demand);
  let stored = scalar(initial);
  if (stored[0] * cap[1] > cap[0] * stored[1])
    throw new RangeError('Initial storage exceeds capacity');
  const rows: WaterRow[] = [];
  for (const [i, s] of inflows.entries()) {
    const inflow = scalar(s),
      available = addR(stored, inflow),
      before = min(cap, available),
      overflow = sub(available, before),
      served = min(need, before),
      deficit = sub(need, served),
      closing = sub(before, served);
    rows.push({
      day: i + 1,
      opening: textR(stored),
      inflow: textR(inflow),
      beforeUse: textR(before),
      overflow: textR(overflow),
      served: textR(served),
      deficit: textR(deficit),
      closing: textR(closing),
    });
    stored = closing;
  }
  const total = (key: 'overflow' | 'served' | 'deficit') =>
    textR(rows.reduce((s, r) => addR(s, readRational(r[key])), zero));
  return {
    capacity,
    rows,
    closing: textR(stored),
    overflow: total('overflow'),
    served: total('served'),
    deficit: total('deficit'),
    meetsEveryDay: rows.every((r) => r.deficit === '0'),
  };
}
export type Scenario = 'nominal' | 'high-use' | 'dry';
export const rainScenarios = {
  nominal: { rain: [6, 0, 0, 6, 0], demand: 30 },
  'high-use': { rain: [8, 0, 0, 8, 0], demand: 40 },
  dry: { rain: [6, 0, 0, 0, 6], demand: 30 },
} as const;
export function rainInflow(area: number, efficiency: string, rain: number) {
  whole(area, 1, 100);
  whole(rain, 0, 30);
  const eta = readRational(efficiency);
  if (eta[0] < 0n || eta[0] > eta[1])
    throw new RangeError('Efficiency in [0,1]');
  // 1 mm × 1 m² = 1 litre: no extra factor 1000.
  return textR(mulR(rational(BigInt(area * rain)), eta));
}
export function rainAudit(
  capacity = 60,
  scenario: Scenario = 'nominal',
  area = 20,
  efficiency = '3/4',
) {
  const s = rainScenarios[scenario];
  if (!s) throw new RangeError('Known rain scenario');
  const inflows = s.rain.map((r) => rainInflow(area, efficiency, r));
  return {
    ...waterLedger(capacity, inflows, String(s.demand)),
    rain: s.rain,
    demand: s.demand,
    area,
    efficiency,
    inflows,
  };
}
export type CaptureModel = 'proportional' | 'offset' | 'capped';
export const captureData = [
  { rain: 0, litres: 0, set: 'calibration' },
  { rain: 2, litres: 30, set: 'calibration' },
  { rain: 4, litres: 60, set: 'calibration' },
  { rain: 6, litres: 90, set: 'calibration' },
  { rain: 8, litres: 105, set: 'validation' },
  { rain: 10, litres: 100, set: 'validation' },
] as const;
export function capturePrediction(kind: CaptureModel, rain: number) {
  if (!Number.isFinite(rain) || rain < 0 || rain > 10)
    throw new RangeError('Rain in [0,10]');
  if (!['proportional', 'offset', 'capped'].includes(kind))
    throw new RangeError('Known capture hypothesis');
  return kind === 'proportional'
    ? 15 * rain
    : kind === 'offset'
      ? 15 * rain + 10
      : Math.min(15 * rain, 105);
}
export function captureAudit(kind: CaptureModel, tolerance = 5) {
  whole(tolerance, 0, 20);
  const rows = captureData.map((r) => ({
    ...r,
    prediction: capturePrediction(kind, r.rain),
    residual: r.litres - capturePrediction(kind, r.rain),
  }));
  const validation = rows.filter((r) => r.set === 'validation');
  return {
    rows,
    maxValidationError: Math.max(
      ...validation.map((r) => Math.abs(r.residual)),
    ),
    withinTolerance: validation.every((r) => Math.abs(r.residual) <= tolerance),
    zeroCompatible: capturePrediction(kind, 0) === 0,
  };
}
export type SearchRow = {
  lo: number;
  hi: number;
  mid: number;
  passes: boolean;
};
export function lowerBoundTrace(
  count: number,
  predicate: (i: number) => boolean,
) {
  whole(count, 1, 301);
  let lo = 0,
    hi = count;
  const rows: SearchRow[] = [];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2),
      passes = predicate(mid);
    rows.push({ lo, hi, mid, passes });
    if (passes) hi = mid;
    else lo = mid + 1;
  }
  return { answer: lo === count ? null : lo, evaluations: rows.length, rows };
}
export function linearTrace(count: number, predicate: (i: number) => boolean) {
  whole(count, 1, 301);
  const rows: { candidate: number; passes: boolean }[] = [];
  let answer: number | null = null;
  for (let i = 0; i < count; i++) {
    const passes = predicate(i);
    rows.push({ candidate: i, passes });
    if (passes) {
      answer = i;
      break;
    }
  }
  return { answer, evaluations: rows.length, rows };
}
export type SearchCase = 'water' | 'budget-window' | 'impossible';
export function searchAudit(kind: SearchCase = 'water', maximum = 150) {
  whole(maximum, 0, 300);
  if (!['water', 'budget-window', 'impossible'].includes(kind))
    throw new RangeError('Known search case');
  const scenario = kind === 'impossible' ? 'dry' : 'nominal',
    predicate = (c: number) =>
      rainAudit(c, scenario).meetsEveryDay &&
      (kind !== 'budget-window' || 40 + 2 * c <= 240);
  const linear = linearTrace(maximum + 1, predicate);
  // The budget predicate is a window, not an upward-closed set. Do not run an unjustified binary search.
  return {
    linear,
    binary:
      kind === 'budget-window' ? null : lowerBoundTrace(maximum + 1, predicate),
    maximum,
    kind,
    monotone: kind !== 'budget-window',
    worstBinary: Math.ceil(Math.log2(maximum + 2)),
    predicate,
  };
}
export function argumentAudit(capacity: number) {
  const m = rainAudit(capacity);
  return {
    model: m,
    necessary: 90,
    sufficient: m.meetsEveryDay,
    minimal: capacity === 90,
    previous: capacity > 0 ? rainAudit(capacity - 1) : null,
  };
}
export type ProjectScope = 'nominal' | 'both' | 'including-dry';
export const tankCatalog = Array.from({ length: 9 }, (_, i) => i * 20);
export const tankCost = (capacity: number) => 40 + 2 * whole(capacity, 0, 300);
export function projectAudit(scope: ProjectScope = 'nominal', budget = 240) {
  whole(budget, 0, 1000);
  if (!['nominal', 'both', 'including-dry'].includes(scope))
    throw new RangeError('Known project scope');
  const scenarios: Scenario[] =
    scope === 'nominal'
      ? ['nominal']
      : scope === 'both'
        ? ['nominal', 'high-use']
        : ['nominal', 'high-use', 'dry'];
  const rows = tankCatalog.map((capacity) => {
    const ledgers = scenarios.map((s) => ({
        scenario: s,
        ...rainAudit(capacity, s),
      })),
      cost = tankCost(capacity),
      waterOK = ledgers.every((r) => r.meetsEveryDay);
    return {
      capacity,
      cost,
      ledgers,
      waterOK,
      budgetOK: cost <= budget,
      feasible: waterOK && cost <= budget,
    };
  });
  const feasible = rows.filter((r) => r.feasible),
    best = feasible[0] ?? null;
  return {
    scope,
    budget,
    scenarios,
    rows,
    feasible: feasible.map((r) => r.capacity),
    best,
  };
}
