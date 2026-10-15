import { readRational } from './rationalModels';
import {
  rational,
  addR,
  mulR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
export type Coordinate = readonly [Rational, Rational];
export function readCoordinate(raw: string): Coordinate | null {
  if (raw.length > 160) return null;
  let s = raw
    .trim()
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/，/g, ',');
  if (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1);
  else if (/[()]/.test(s)) return null;
  const parts = s.split(',');
  if (parts.length !== 2) return null;
  try {
    return [readRational(parts[0]!), readRational(parts[1]!)];
  } catch {
    return null;
  }
}
export const coordinateText = (p: Coordinate) =>
  `(${textR(p[0])}, ${textR(p[1])})`;
export function plotNumber(raw: string) {
  const r = readRational(raw),
    n = Number(r[0]) / Number(r[1]);
  if (!Number.isFinite(n) || Math.abs(n) > 100000)
    throw new RangeError('Bounded display value');
  return n;
}
export function checkCoordinate(input: string, expected: string) {
  const a = readCoordinate(input),
    b = readCoordinate(expected);
  return !!a && !!b && sameR(a[0], b[0]) && sameR(a[1], b[1]);
}
export function coordinateRegion(p: Coordinate) {
  const x = p[0][0],
    y = p[1][0];
  return x === 0n && y === 0n
    ? 'origin'
    : y === 0n
      ? 'x-axis'
      : x === 0n
        ? 'y-axis'
        : x > 0n
          ? y > 0n
            ? 'I'
            : 'IV'
          : y > 0n
            ? 'II'
            : 'III';
}
export type PlotBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep: number;
  yStep: number;
};
export type PlotPoint = { x: number; y: number; label?: string };
const finite = (n: number) => {
  if (!Number.isFinite(n) || Math.abs(n) > 100000)
    throw new RangeError('Finite bounded plotting data');
  return n;
};
export function plotBounds(b: PlotBounds) {
  Object.values(b).forEach(finite);
  if (
    b.xMin >= b.xMax ||
    b.yMin >= b.yMax ||
    b.xMin > 0 ||
    b.xMax < 0 ||
    b.yMin > 0 ||
    b.yMax < 0 ||
    b.xStep <= 0 ||
    b.yStep <= 0 ||
    (b.xMax - b.xMin) / b.xStep > 24 ||
    (b.yMax - b.yMin) / b.yStep > 24
  )
    throw new RangeError(
      'Ordered bounds containing both zero axes and a bounded positive tick spacing',
    );
  for (const [lo, hi, step] of [
    [b.xMin, b.xMax, b.xStep],
    [b.yMin, b.yMax, b.yStep],
  ])
    if (
      !Number.isInteger((hi! - lo!) / step!) ||
      !Number.isInteger(lo! / step!)
    )
      throw new RangeError('Tick steps must align with zero and bounds');
  return b;
}
export function plotPosition(p: PlotPoint, b: PlotBounds) {
  plotBounds(b);
  finite(p.x);
  finite(p.y);
  if (p.x < b.xMin || p.x > b.xMax || p.y < b.yMin || p.y > b.yMax)
    throw new RangeError('Point outside plot');
  return {
    x: 64 + ((p.x - b.xMin) / (b.xMax - b.xMin)) * 400,
    y: 310 - ((p.y - b.yMin) / (b.yMax - b.yMin)) * 280,
  };
}
export const ticks = (lo: number, hi: number, step: number) =>
  Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) =>
    Number((lo + i * step).toFixed(8)),
  );
export function lineValue(k: string, b: string, x: string) {
  return addR(mulR(readRational(k), readRational(x)), readRational(b));
}
export function tableValues(k: string, b: string, xs: string[]) {
  if (!xs.length || xs.length > 25)
    throw new RangeError('Use a bounded nonempty table');
  return xs.map((x) => ({ x, y: textR(lineValue(k, b, x)) }));
}
/** Clip a supplied straight-line model to both its domain and the labelled viewing window. */
export function lineSegment(
  k: number,
  intercept: number,
  b: PlotBounds,
  domain: readonly [number, number] = [b.xMin, b.xMax],
): PlotPoint[] {
  plotBounds(b);
  [k, intercept, ...domain].forEach(finite);
  if (domain[0] > domain[1]) throw new RangeError('Ordered domain');
  let lo = Math.max(b.xMin, domain[0]),
    hi = Math.min(b.xMax, domain[1]);
  if (k === 0) {
    if (intercept < b.yMin || intercept > b.yMax) return [];
  } else {
    const y0 = (b.yMin - intercept) / k,
      y1 = (b.yMax - intercept) / k;
    lo = Math.max(lo, Math.min(y0, y1));
    hi = Math.min(hi, Math.max(y0, y1));
  }
  if (lo > hi) return [];
  return [
    { x: lo, y: Math.max(b.yMin, Math.min(b.yMax, k * lo + intercept)) },
    { x: hi, y: Math.max(b.yMin, Math.min(b.yMax, k * hi + intercept)) },
  ];
}
export type CoordinateContext = 'water' | 'cards' | 'temperature';
export function contextGraph(kind: CoordinateContext, raw: string) {
  const x = readRational(raw);
  let k: Rational,
    b: Rational,
    allowed: boolean,
    domain: readonly [number, number],
    bounds: PlotBounds;
  if (kind === 'water') {
    k = rational(-2n);
    b = rational(12n);
    domain = [0, 6];
    allowed = x[0] >= 0n && x[0] <= 6n * x[1];
    bounds = { xMin: 0, xMax: 8, yMin: 0, yMax: 16, xStep: 2, yStep: 4 };
  } else if (kind === 'cards') {
    k = rational(3n);
    b = rational(5n);
    domain = [0, 6];
    allowed = x[1] === 1n && x[0] >= 0n && x[0] <= 6n;
    bounds = { xMin: 0, xMax: 8, yMin: 0, yMax: 25, xStep: 2, yStep: 5 };
  } else if (kind === 'temperature') {
    k = rational(3n, 2n);
    b = rational(-4n);
    domain = [0, 4];
    allowed = x[0] >= 0n && x[0] <= 4n * x[1];
    bounds = { xMin: 0, xMax: 6, yMin: -4, yMax: 4, xStep: 1, yStep: 1 };
  } else throw new RangeError('Choose a supplied fictional context');
  const rawValue = addR(mulR(k, x), b),
    continuous = kind !== 'cards';
  return {
    kind,
    k: textR(k),
    b: textR(b),
    x: textR(x),
    rawValue: textR(rawValue),
    value: allowed ? textR(rawValue) : null,
    allowed,
    continuous,
    domain,
    bounds,
  };
}
export const basicBounds: PlotBounds = {
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  xStep: 1,
  yStep: 1,
};
export const plottingCases = [
  { id: 'integer', x: -2, y: 3, bounds: basicBounds },
  {
    id: 'half',
    x: 1.5,
    y: -0.5,
    bounds: { xMin: -2, xMax: 2, yMin: -2, yMax: 2, xStep: 0.5, yStep: 0.5 },
  },
  { id: 'axis', x: 0, y: -3, bounds: basicBounds },
];
