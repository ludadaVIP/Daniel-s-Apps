import {
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  parseAffine,
  evaluateAffine,
  affineText,
  type Affine,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import {
  readCoordinate,
  lineSegment,
  type Coordinate,
  type PlotBounds,
} from './cartesianModels';
export type FunctionClass =
  'direct' | 'affine' | 'constant' | 'nonlinear' | 'vertical' | 'undetermined';
/** This unit uses the Chinese first-degree convention: m≠0.
 * m=0 is an affine constant function, but not a first-degree function here. */
export function classifyAffine(f: Affine): FunctionClass {
  return !f.a[0] ? 'constant' : !f.b[0] ? 'direct' : 'affine';
}
export function checkFunctionClass(raw: string, kind: FunctionClass) {
  const names: Record<FunctionClass, string[]> = {
    direct: [
      'direct',
      'direct proportion',
      'direct proportional function',
      '正比例',
      '正比例函数',
    ],
    affine: [
      'affine',
      'first degree but not direct',
      'linear but not direct',
      '一次但非正比例',
      '一次函数但非正比例函数',
    ],
    constant: ['constant', 'constant function', '常函数', '常数函数'],
    nonlinear: ['nonlinear', 'nonlinear function', '非线性函数', '非一次函数'],
    vertical: [
      'vertical',
      'vertical line',
      'not a function of x',
      '竖直线',
      '不是x的函数',
      '不是 x 的函数',
    ],
    undetermined: [
      'undetermined',
      'not uniquely determined',
      'not unique',
      '无法唯一确定',
      '不能唯一确定',
    ],
  };
  return names[kind].includes(raw.trim().toLowerCase().replace(/\s+/g, ' '));
}
export function functionModel(m: string, b: string): Affine {
  return { a: readRational(m), b: readRational(b) };
}
export function readFunctionModel(raw: string) {
  return parseAffine(raw, 'x');
}
export function functionAt(f: Affine, raw: string) {
  return evaluateAffine(f, readRational(raw));
}
export const functionText = (f: Affine) => affineText(f, 'x');
export function slopeBetween(p: Coordinate, q: Coordinate) {
  const dx = addR(q[0], negR(p[0])),
    dy = addR(q[1], negR(p[1]));
  return { dx, dy, slope: dx[0] ? divR(dy, dx) : null };
}
export type TwoPointFunction =
  | { kind: 'one'; model: Affine; dx: Rational; dy: Rational }
  | { kind: 'vertical' | 'undetermined'; dx: Rational; dy: Rational };
export function functionFromPoints(
  p: Coordinate,
  q: Coordinate,
): TwoPointFunction {
  const { dx, dy, slope } = slopeBetween(p, q);
  return slope
    ? {
        kind: 'one',
        model: { a: slope, b: addR(p[1], negR(mulR(slope, p[0]))) },
        dx,
        dy,
      }
    : { kind: dy[0] ? 'vertical' : 'undetermined', dx, dy };
}
export function pointOnFunction(f: Affine, p: Coordinate) {
  return sameR(evaluateAffine(f, p[0]), p[1]);
}
export function functionCurve(
  f: Affine,
  bounds: PlotBounds,
  domain?: readonly [number, number],
) {
  return lineSegment(
    Number(f.a[0]) / Number(f.a[1]),
    Number(f.b[0]) / Number(f.b[1]),
    bounds,
    domain,
  );
}
export const functionBounds: PlotBounds = {
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  xStep: 1,
  yStep: 1,
};
export const functionWideBounds: PlotBounds = {
  xMin: -6,
  xMax: 10,
  yMin: -8,
  yMax: 16,
  xStep: 2,
  yStep: 4,
};
export const slopePointCases = [
  ['(1,3)', '(4,9)'],
  ['(-2,5)', '(2,-3)'],
  ['(-1,0)', '(2,2)'],
  ['(-2,3)', '(3,3)'],
] as const;
export const twoPointCases = [
  ['(2,5)', '(5,11)'],
  ['(1,1)', '(3,2)'],
  ['(-2,3)', '(3,3)'],
  ['(2,1)', '(2,4)'],
  ['(2,1)', '(2,1)'],
] as const;
export function pointsFrom(
  source: readonly [string, string],
): readonly [Coordinate, Coordinate] {
  const p = readCoordinate(source[0]),
    q = readCoordinate(source[1]);
  if (!p || !q) throw new RangeError('Use two exact points');
  return [p, q];
}
export const functionComparisons = [
  { source: '2x', kind: 'direct' },
  { source: '2x+3', kind: 'affine' },
  { source: '4', kind: 'constant' },
  { source: 'x^2', kind: 'nonlinear' },
  { source: '0', kind: 'constant' },
  { source: '-x/2', kind: 'direct' },
] as const;
export type FunctionContextKind = 'travel' | 'drain' | 'cards' | 'temperature';
export type FunctionContext = {
  kind: FunctionContextKind;
  model: Affine;
  end: Rational;
  integer: boolean;
  inputUnit: string;
  outputUnit: string;
  rateUnit: string;
};
export function functionContext(kind: FunctionContextKind): FunctionContext {
  const data = {
    travel: {
      m: '2',
      b: '5',
      end: '8',
      integer: false,
      inputUnit: 'km',
      outputUnit: 'NZD',
      rateUnit: 'NZD/km',
    },
    drain: {
      m: '-2',
      b: '12',
      end: '6',
      integer: false,
      inputUnit: 'min',
      outputUnit: 'L',
      rateUnit: 'L/min',
    },
    cards: {
      m: '3',
      b: '2',
      end: '4',
      integer: true,
      inputUnit: 'packs',
      outputUnit: 'cards',
      rateUnit: 'cards/pack',
    },
    temperature: {
      m: '-1/2',
      b: '4',
      end: '8',
      integer: false,
      inputUnit: 'h',
      outputUnit: '°C',
      rateUnit: '°C/h',
    },
  }[kind];
  if (!data) throw new RangeError('Invalid function context');
  return {
    kind,
    model: functionModel(data.m, data.b),
    end: readRational(data.end),
    integer: data.integer,
    inputUnit: data.inputUnit,
    outputUnit: data.outputUnit,
    rateUnit: data.rateUnit,
  };
}
export function auditFunctionContext(
  c: FunctionContext,
  rawX: string,
  rawY: string,
) {
  try {
    const x = readRational(rawX),
      y = readRational(rawY),
      expected = evaluateAffine(c.model, x),
      inRange = x[0] >= 0n && x[0] * c.end[1] <= c.end[0] * x[1],
      integerPass = !c.integer || x[1] === 1n,
      relationPass = sameR(expected, y);
    return {
      x: textR(x),
      y: textR(y),
      expected: textR(expected),
      relationPass,
      inRange,
      integerPass,
      accepted: relationPass && inRange && integerPass,
    };
  } catch {
    return null;
  }
}
export function contextFunctionGraph(c: FunctionContext, b: PlotBounds) {
  const end = Number(c.end[0]) / Number(c.end[1]),
    number = (r: Rational) => Number(r[0]) / Number(r[1]);
  return c.integer
    ? {
        curve: [],
        points: Array.from({ length: end + 1 }, (_, x) => ({
          x,
          y: number(functionAt(c.model, String(x))),
          label: String(x),
        })).filter(
          (p) =>
            p.x >= b.xMin && p.x <= b.xMax && p.y >= b.yMin && p.y <= b.yMax,
        ),
      }
    : { curve: functionCurve(c.model, b, [0, end]), points: [] };
}
