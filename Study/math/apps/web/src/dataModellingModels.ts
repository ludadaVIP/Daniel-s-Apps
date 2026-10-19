import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
export type DataCode =
  | 'nominal'
  | 'ordinal'
  | 'discrete'
  | 'continuous'
  | 'right-skew'
  | 'left-skew'
  | 'symmetric'
  | 'asymmetric'
  | 'undefined'
  | 'not-identified'
  | 'interpolation'
  | 'extrapolation';
const aliases: Record<DataCode, string[]> = {
  nominal: ['nominal', '名义', '无序类别'],
  ordinal: ['ordinal', '有序类别', '顺序'],
  discrete: ['discrete', '离散', '离散数值'],
  continuous: ['continuous', '连续', '连续数值'],
  'right-skew': ['right-skew', '右偏'],
  'left-skew': ['left-skew', '左偏'],
  symmetric: ['symmetric', '对称'],
  asymmetric: ['asymmetric', '不对称'],
  undefined: ['undefined', '无定义'],
  'not-identified': ['not-identified', '不能唯一确定'],
  interpolation: ['interpolation', '内插'],
  extrapolation: ['extrapolation', '外推'],
};
export const checkDataCode = (raw: string, code: DataCode) =>
  aliases[code].includes(raw.trim().toLowerCase());
export const dataNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export const subData = (a: Rational, b: Rational) => addR(a, negR(b));
export function dataValue(raw: string): Rational {
  const r = readRational(raw);
  if (r[1] > 1000n || r[0] > 1000n * r[1] || r[0] < -1000n * r[1])
    throw new RangeError('Use bounded rational observations');
  return r;
}
export function dataSummary(
  raw: readonly string[],
  convention: 'population' | 'sample' = 'population',
) {
  if (
    !raw.length ||
    raw.length > 40 ||
    !['population', 'sample'].includes(convention)
  )
    throw new RangeError('Use one to forty observations and a stated divisor');
  const values = raw.map(dataValue),
    n = values.length,
    mean = divR(values.reduce(addR, rational(0n)), rational(BigInt(n))),
    deviations = values.map((v) => subData(v, mean)),
    squares = deviations.map((v) => mulR(v, v)),
    ss = squares.reduce(addR, rational(0n)),
    divisor = convention === 'sample' ? n - 1 : n,
    variance = divisor === 0 ? null : divR(ss, rational(BigInt(divisor))),
    ordered = [...values].sort((a, b) => dataNumber(subData(a, b))),
    median =
      n % 2
        ? ordered[Math.floor(n / 2)]!
        : divR(addR(ordered[n / 2 - 1]!, ordered[n / 2]!), rational(2n));
  return {
    values,
    n,
    mean,
    deviations,
    squares,
    ss,
    divisor,
    variance,
    sd: variance === null ? null : Math.sqrt(dataNumber(variance)),
    ordered,
    median,
  };
}
export function histogram(
  raw: readonly string[],
  width: number,
  start = 0,
  end = 16,
) {
  if (
    ![1, 2, 4, 8].includes(width) ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    end <= start ||
    (end - start) / width > 40 ||
    (end - start) % width
  )
    throw new RangeError('Use an exact equal-width classroom partition');
  const summary = dataSummary(raw),
    count = (end - start) / width,
    bins = Array.from({ length: count }, (_, i) => ({
      low: start + i * width,
      high: start + (i + 1) * width,
      count: 0,
      last: i === count - 1,
    }));
  for (const r of summary.values) {
    const x = dataNumber(r);
    if (x < start || x > end)
      throw new RangeError('Observation outside stated histogram range');
    bins[Math.min(count - 1, Math.floor((x - start) / width))]!.count++;
  }
  return bins;
}
export const shapeCases = [
  {
    id: 'right',
    shape: 'right-skew' as DataCode,
    values: ['0', '1', '1', '1', '2', '3', '13'],
  },
  {
    id: 'left',
    shape: 'left-skew' as DataCode,
    values: ['1', '11', '12', '13', '13', '13', '14'],
  },
  {
    id: 'symmetric',
    shape: 'symmetric' as DataCode,
    values: ['0', '1', '2', '2', '2', '3', '4'],
  },
  {
    id: 'two-peaks',
    shape: 'symmetric' as DataCode,
    values: ['0', '0', '0', '4', '4', '4'],
  },
  {
    id: 'equal-centres',
    shape: 'asymmetric' as DataCode,
    values: ['0', '0', '2', '3', '5'],
  },
];
export const spreadCases = [
  ['2', '4', '4', '6'],
  ['4', '4', '4', '4'],
  ['4'],
  ['2', '4', '4', '14'],
];
export function transformData(
  raw: readonly string[],
  scale: string,
  shift: string,
) {
  const k = dataValue(scale),
    c = dataValue(shift);
  return raw.map((v) => textR(addR(mulR(dataValue(v), k), c)));
}
export type CleaningRow = {
  id: string;
  colour: string;
  count: string;
  length: string | null;
  unit: 'cm' | 'mm';
  source?: string;
};
export const cleaningRows: readonly CleaningRow[] = [
  { id: 'R1', colour: 'blue', count: '2', length: '20', unit: 'cm' },
  { id: 'R2', colour: 'green', count: '0', length: '200', unit: 'mm' },
  { id: 'R3', colour: 'blue', count: '3', length: null, unit: 'cm' },
  { id: 'R4', colour: 'red', count: '1', length: '-5', unit: 'cm' },
  {
    id: 'R5',
    colour: 'green',
    count: '2',
    length: '200',
    unit: 'cm',
    source: '20',
  },
  { id: 'R6', colour: 'blue', count: '2', length: '24', unit: 'cm' },
  { id: 'R2', colour: 'green', count: '0', length: '200', unit: 'mm' },
];
export function cleaningAudit(corrected: boolean) {
  const seen = new Set<string>();
  const rows = cleaningRows.map((r, entry) => {
    const duplicate = seen.has(r.id);
    seen.add(r.id);
    const used = corrected && r.source ? r.source : r.length;
    const cm =
      used === null
        ? null
        : divR(dataValue(used), rational(r.unit === 'mm' ? 10n : 1n));
    const issue = duplicate
      ? 'duplicate'
      : cm === null
        ? 'missing'
        : cm[0] < 0n
          ? 'invalid'
          : !corrected && r.source
            ? 'source-pending'
            : 'usable';
    return { ...r, entry: entry + 1, cm, issue, duplicate };
  });
  const included = rows.filter(
      (r) => !r.duplicate && r.cm !== null && r.cm[0] >= 0n,
    ),
    values = included.map((r) => textR(r.cm!));
  return {
    rows,
    unique: seen.size,
    duplicate: rows.filter((r) => r.duplicate).length,
    missing: rows.filter((r) => !r.duplicate && r.issue === 'missing').length,
    invalid: rows.filter((r) => !r.duplicate && r.issue === 'invalid').length,
    values,
    summary: dataSummary(values),
    reconciled: corrected,
  };
}
export function zScore(
  value: string,
  mean: string,
  sd: string,
): Rational | null {
  const x = dataValue(value),
    m = dataValue(mean),
    s = dataValue(sd);
  if (s[0] < 0n)
    throw new RangeError('A standard deviation cannot be negative');
  return s[0] === 0n ? null : divR(subData(x, m), s);
}
export type DataPair = { id: string; x: string; y: string };
export const regressionCases: { id: string; rows: DataPair[] }[] = [
  {
    id: 'rising',
    rows: [
      [1, 3],
      [2, 3],
      [3, 6],
    ].map(([x, y], i) => ({ id: `P${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'falling',
    rows: [
      [1, 6],
      [2, 3],
      [3, 3],
    ].map(([x, y], i) => ({ id: `N${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'horizontal',
    rows: [
      [1, 4],
      [2, 4],
      [3, 4],
    ].map(([x, y], i) => ({ id: `H${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'constant-x',
    rows: [
      [2, 3],
      [2, 4],
      [2, 6],
    ].map(([x, y], i) => ({ id: `V${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'curve',
    rows: [
      [0, 4],
      [1, 1],
      [2, 0],
      [3, 1],
      [4, 4],
    ].map(([x, y], i) => ({ id: `C${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'influential',
    rows: [
      [1, 3],
      [2, 3],
      [3, 6],
      [6, 0],
    ].map(([x, y], i) => ({ id: `I${i + 1}`, x: String(x), y: String(y) })),
  },
];
function pairedRows(raw: readonly DataPair[]) {
  if (
    raw.length < 1 ||
    raw.length > 40 ||
    raw.some((r) => !r.id) ||
    new Set(raw.map((r) => r.id)).size !== raw.length
  )
    throw new RangeError('Keep one to forty distinct pair identities');
  return raw.map((r) => ({ ...r, px: dataValue(r.x), py: dataValue(r.y) }));
}
export function candidateFit(
  raw: readonly DataPair[],
  intercept: string,
  slope: string,
) {
  const a = dataValue(intercept),
    b = dataValue(slope),
    rows = pairedRows(raw).map((r) => {
      const predicted = addR(a, mulR(b, r.px)),
        residual = subData(r.py, predicted);
      return { ...r, predicted, residual, square: mulR(residual, residual) };
    });
  return { rows, sse: rows.reduce((s, r) => addR(s, r.square), rational(0n)) };
}
export function leastSquares(raw: readonly DataPair[]) {
  const rows = pairedRows(raw),
    n = rational(BigInt(rows.length)),
    mx = divR(
      rows.reduce((s, r) => addR(s, r.px), rational(0n)),
      n,
    ),
    my = divR(
      rows.reduce((s, r) => addR(s, r.py), rational(0n)),
      n,
    ),
    sxx = rows.reduce((s, r) => {
      const d = subData(r.px, mx);
      return addR(s, mulR(d, d));
    }, rational(0n)),
    sxy = rows.reduce(
      (s, r) => addR(s, mulR(subData(r.px, mx), subData(r.py, my))),
      rational(0n),
    ),
    slope = sxx[0] === 0n ? null : divR(sxy, sxx),
    intercept = slope === null ? null : subData(my, mulR(slope, mx)),
    fitted = rows.map((r) => {
      const predicted =
          slope === null ? my : addR(intercept!, mulR(slope, r.px)),
        residual = subData(r.py, predicted);
      return { ...r, predicted, residual, square: mulR(residual, residual) };
    });
  return {
    mx,
    my,
    sxx,
    sxy,
    slope,
    intercept,
    rows: fitted,
    sse: fitted.reduce((s, r) => addR(s, r.square), rational(0n)),
    minX: Math.min(...rows.map((r) => dataNumber(r.px))),
    maxX: Math.max(...rows.map((r) => dataNumber(r.px))),
  };
}
export function regressionPrediction(raw: readonly DataPair[], x: string) {
  const fit = leastSquares(raw),
    q = dataValue(x);
  return fit.slope === null
    ? sameR(q, fit.mx)
      ? fit.my
      : null
    : addR(fit.intercept!, mulR(fit.slope, q));
}
export function predictionScope(raw: readonly DataPair[], x: string): DataCode {
  const fit = leastSquares(raw),
    q = dataNumber(dataValue(x));
  return q >= fit.minX && q <= fit.maxX ? 'interpolation' : 'extrapolation';
}
