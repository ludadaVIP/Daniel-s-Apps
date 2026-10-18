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
import {
  readCoordinate,
  coordinateText,
  type Coordinate,
} from './cartesianModels';
import { readRational } from './rationalModels';
import { principalRadical, radicalText, readRadical } from './radicalModels';
export type Vector = Coordinate;
export const vectorZero: Vector = [rational(0n), rational(0n)];
export const vectorNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export function readVector(raw: string): Vector {
  const v = readCoordinate(raw);
  if (!v) throw new RangeError('Use a rational component pair (x,y)');
  return v;
}
export const vectorText = coordinateText;
export const addV = (u: Vector, v: Vector): Vector => [
  addR(u[0], v[0]),
  addR(u[1], v[1]),
];
export const scaleV = (k: Rational, u: Vector): Vector => [
  mulR(k, u[0]),
  mulR(k, u[1]),
];
export const subtractV = (u: Vector, v: Vector): Vector =>
  addV(u, scaleV(rational(-1n), v));
export const dotV = (u: Vector, v: Vector): Rational =>
  addR(mulR(u[0], v[0]), mulR(u[1], v[1]));
export const crossV = (u: Vector, v: Vector): Rational =>
  addR(mulR(u[0], v[1]), negR(mulR(u[1], v[0])));
export const squareV = (v: Vector) => dotV(v, v);
export const sameV = (u: Vector, v: Vector) =>
  sameR(u[0], v[0]) && sameR(u[1], v[1]);
export const isZeroV = (v: Vector) => v[0][0] === 0n && v[1][0] === 0n;
export const betweenV = (a: Vector, b: Vector) => subtractV(b, a);
export const midpointV = (a: Vector, b: Vector) =>
  scaleV(rational(1n, 2n), addV(a, b));
export const lengthV = (v: Vector) => radicalText(principalRadical(squareV(v)));
export type VectorCode =
  | 'equal'
  | 'different'
  | 'same-direction'
  | 'opposite-direction'
  | 'not-parallel'
  | 'undefined'
  | 'acute'
  | 'right'
  | 'obtuse'
  | 'zero-angle'
  | 'straight'
  | 'parallelogram'
  | 'rectangle'
  | 'rhombus'
  | 'square'
  | 'degenerate';
const names: Record<VectorCode, string[]> = {
  equal: ['equal', '相等'],
  different: ['different', '不相等'],
  'same-direction': ['same-direction', '同向'],
  'opposite-direction': ['opposite-direction', '反向', '方向相反'],
  'not-parallel': ['not-parallel', '不平行'],
  undefined: ['undefined', '无定义', '方向未定义', '夹角未定义'],
  acute: ['acute', '锐角'],
  right: ['right', '直角'],
  obtuse: ['obtuse', '钝角'],
  'zero-angle': ['zero-angle', '零角', '0°'],
  straight: ['straight', '平角', '180°'],
  parallelogram: ['parallelogram', '普通平行四边形', '平行四边形'],
  rectangle: ['rectangle', '矩形'],
  rhombus: ['rhombus', '菱形'],
  square: ['square', '正方形'],
  degenerate: ['degenerate', '退化', '退化图形'],
};
export const checkVectorCode = (raw: string, value: VectorCode) =>
  names[value].includes(raw.trim().toLowerCase());
/** This unit classifies geometric directions only for nonzero vectors. */
export function directionV(u: Vector, v: Vector): VectorCode {
  if (isZeroV(u) || isZeroV(v)) return 'undefined';
  if (crossV(u, v)[0] !== 0n) return 'not-parallel';
  return dotV(u, v)[0] > 0n ? 'same-direction' : 'opposite-direction';
}
export function angleV(
  u: Vector,
  v: Vector,
): { kind: VectorCode; cosine: string | null; dot: Rational } {
  const dot = dotV(u, v);
  if (isZeroV(u) || isZeroV(v)) return { kind: 'undefined', cosine: null, dot };
  const denominator = mulR(squareV(u), squareV(v)),
    value = readRadical(`(${textR(dot)})/sqrt(${textR(denominator)})`);
  if (!value)
    throw new RangeError('Exact cosine exceeds the supported radical range');
  const kind: VectorCode = !crossV(u, v)[0]
    ? dot[0] > 0n
      ? 'zero-angle'
      : 'straight'
    : dot[0] > 0n
      ? 'acute'
      : dot[0] < 0n
        ? 'obtuse'
        : 'right';
  return { kind, cosine: radicalText(value), dot };
}
export function parallelogramV(a: Vector, b: Vector, d: Vector) {
  const u = betweenV(a, b),
    v = betweenV(a, d),
    c = addV(a, addV(u, v)),
    cross = crossV(u, v),
    dot = dotV(u, v),
    equalSides = sameR(squareV(u), squareV(v));
  const kind: VectorCode = !cross[0]
    ? 'degenerate'
    : dot[0] === 0n
      ? equalSides
        ? 'square'
        : 'rectangle'
      : equalSides
        ? 'rhombus'
        : 'parallelogram';
  return {
    a,
    b,
    c,
    d,
    u,
    v,
    kind,
    area: rational(cross[0] < 0n ? -cross[0] : cross[0], cross[1]),
    midAC: midpointV(a, c),
    midBD: midpointV(b, d),
    diagonalAC: betweenV(a, c),
    diagonalBD: betweenV(b, d),
  };
}
export const vectorCases = {
  general: { u: '(4,1)', v: '(1,3)' },
  rectangle: { u: '(4,0)', v: '(0,3)' },
  rhombus: { u: '(3,1)', v: '(1,3)' },
  square: { u: '(3,1)', v: '(-1,3)' },
  degenerate: { u: '(4,0)', v: '(2,0)' },
} as const;
export function geometricCase(
  kind: keyof typeof vectorCases,
  translation = '(0,0)',
) {
  const a = addV(readVector('(-2,-1)'), readVector(translation)),
    p = vectorCases[kind];
  return parallelogramV(a, addV(a, readVector(p.u)), addV(a, readVector(p.v)));
}
/** Solve v=k*u by a nonzero component, then verify both components exactly. */
export function multipleV(
  u: Vector,
  v: Vector,
): { kind: 'unique'; factor: Rational } | { kind: 'all' } | { kind: 'none' } {
  if (isZeroV(u)) return isZeroV(v) ? { kind: 'all' } : { kind: 'none' };
  const i = u[0][0] !== 0n ? 0 : 1,
    k = divR(v[i], u[i]);
  return sameV(scaleV(k, u), v)
    ? { kind: 'unique', factor: k }
    : { kind: 'none' };
}
export function vectorFromStrings(x: string, y: string): Vector {
  return [readRational(x), readRational(y)];
}
