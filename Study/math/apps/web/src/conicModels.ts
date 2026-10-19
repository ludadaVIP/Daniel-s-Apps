import {
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { coordinateText, type Coordinate } from './cartesianModels';
import {
  parsePolynomial,
  plusP,
  scaleP,
  type Polynomial,
} from './polynomialModels';
import { principalRadical, radicalText } from './radicalModels';
export const cq = (v: number | string): Rational => readRational(String(v));
export const cp = (x: number | string, y: number | string): Coordinate => [
  cq(x),
  cq(y),
];
export const cn = (v: Rational) => Number(v[0]) / Number(v[1]);
export const subC = (a: Rational, b: Rational) => addR(a, negR(b));
export const absC = (v: Rational): Rational => (v[0] < 0n ? negR(v) : v);
export const squareC = (v: Rational) => mulR(v, v);
const small = (v: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(v) || v < lo || v > hi)
    throw new RangeError('Bounded classroom integer');
  return v;
};
export type ConicAxis = 'horizontal' | 'vertical';
function axisCheck(axis: ConicAxis) {
  if (!['horizontal', 'vertical'].includes(axis))
    throw new RangeError('A coordinate axis is required');
}
export type PlaneLine = { a: Rational; b: Rational; c: Rational };
export function planeLine(a: number, b: number, c: number): PlaneLine {
  [a, b, c].forEach((v) => small(v, -20, 20));
  if (!a && !b) throw new RangeError('A and B cannot both be zero');
  return { a: cq(a), b: cq(b), c: cq(c) };
}
export const lineValue = (l: PlaneLine, p: Coordinate) =>
  addR(addR(mulR(l.a, p[0]), mulR(l.b, p[1])), l.c);
export const normalSquare = (l: PlaneLine) => addR(squareC(l.a), squareC(l.b));
export function projectionFoot(l: PlaneLine, p: Coordinate): Coordinate {
  const n = normalSquare(l);
  if (!n[0]) throw new RangeError('A genuine line is required');
  const k = divR(lineValue(l, p), n);
  return [subC(p[0], mulR(k, l.a)), subC(p[1], mulR(k, l.b))];
}
export const lineDistanceSquare = (l: PlaneLine, p: Coordinate) =>
  divR(squareC(lineValue(l, p)), normalSquare(l));
export const exactDistance = (s: Rational) => radicalText(principalRadical(s));
export const pointDistanceSquare = (p: Coordinate, q: Coordinate) =>
  addR(squareC(subC(p[0], q[0])), squareC(subC(p[1], q[1])));
export const lineEquation = (l: PlaneLine) =>
  `${textR(l.a)}x+(${textR(l.b)})y+(${textR(l.c)})=0`;
export function planeEquation(raw: string): Polynomial | null {
  if (raw.length > 490) return null;
  const sides = raw.replace(/＝/g, '=').split('=');
  if (sides.length !== 2 || sides.some((s) => !s.trim())) return null;
  const a = parsePolynomial(sides[0]!, ['x', 'y']),
    b = parsePolynomial(sides[1]!, ['x', 'y']);
  if (!a || !b) return null;
  try {
    const p = plusP(a, scaleP(b, [-1n, 1n]));
    if (
      !p.size ||
      [...p.keys()].some((k) => k.length > 2) ||
      ![...p.keys()].some((k) => k.length)
    )
      return null;
    return p;
  } catch {
    return null;
  }
}
// Equations differ by a nonzero constant only. Extra factors can add points and are rejected.
export function checkPlaneEquation(raw: string, expected: string) {
  const a = planeEquation(raw),
    b = planeEquation(expected);
  if (!a || !b || a.size !== b.size) return false;
  const [key, pivot] = [...b][0]!,
    other = a.get(key);
  return (
    !!other &&
    [...b].every(([k, v]) => {
      const actual = a.get(k);
      return !!actual && sameR(mulR(actual, pivot), mulR(v, other));
    })
  );
}
export type ConicCode =
  'on' | 'inside' | 'outside' | 'empty' | 'point' | 'circle' | 'undefined';
const codes: Record<ConicCode, string[]> = {
  on: ['on', '在曲线上', '在圆上'],
  inside: ['inside', '内部', '圆内'],
  outside: ['outside', '外部', '圆外'],
  empty: ['empty', '空集', '无实点'],
  point: ['point', '单点'],
  circle: ['circle', '圆'],
  undefined: ['undefined', '无定义'],
};
export const checkConicCode = (raw: string, expected: ConicCode) =>
  codes[expected].includes(raw.trim().toLowerCase());
export function circleLocus(h: number, k: number, radiusSquare: number) {
  small(h, -3, 3);
  small(k, -3, 3);
  small(radiusSquare, -1, 25);
  return {
    centre: cp(h, k),
    radiusSquare: cq(radiusSquare),
    kind: (radiusSquare < 0
      ? 'empty'
      : radiusSquare === 0
        ? 'point'
        : 'circle') as ConicCode,
    equation: `(x-(${h}))^2+(y-(${k}))^2=${radiusSquare}`,
  };
}
export function circlePosition(
  p: Coordinate,
  centre: Coordinate,
  radiusSquare: Rational,
): ConicCode {
  if (radiusSquare[0] < 0n) return 'empty';
  const d = subC(pointDistanceSquare(p, centre), radiusSquare);
  return !d[0] ? 'on' : d[0] < 0n ? 'inside' : 'outside';
}
export type FocusConic = {
  kind: 'parabola' | 'ellipse' | 'hyperbola';
  centre: Coordinate;
  axis: ConicAxis;
  equation: string;
  focusMinus: Coordinate;
  focusPlus: Coordinate;
  a: Rational;
  b: Rational;
  c: Rational;
  directrix?: { axis: 'x' | 'y'; value: Rational };
  p?: Rational;
};
const locate = (
  h: number,
  k: number,
  u: Rational,
  v: Rational,
  axis: ConicAxis,
): Coordinate =>
  axis === 'horizontal'
    ? [addR(cq(h), u), addR(cq(k), v)]
    : [addR(cq(h), v), addR(cq(k), u)];
export function parabolaModel(
  h: number,
  k: number,
  pRaw: string,
  axis: ConicAxis,
): FocusConic {
  small(h, -3, 3);
  small(k, -3, 3);
  axisCheck(axis);
  if (!['-2', '-1', '-1/2', '1/2', '1', '2'].includes(pRaw))
    throw new RangeError('Nonzero supported focal parameter');
  const p = cq(pRaw),
    focus = locate(h, k, p, cq(0), axis),
    directrix = {
      axis: axis === 'horizontal' ? ('x' as const) : ('y' as const),
      value: subC(cq(axis === 'horizontal' ? h : k), p),
    };
  return {
    kind: 'parabola',
    centre: cp(h, k),
    axis,
    a: absC(p),
    b: cq(0),
    c: absC(p),
    p,
    focusMinus: focus,
    focusPlus: focus,
    directrix,
    equation:
      axis === 'horizontal'
        ? `(y-(${k}))^2=(${textR(mulR(cq(4), p))})(x-(${h}))`
        : `(x-(${h}))^2=(${textR(mulR(cq(4), p))})(y-(${k}))`,
  };
}
export const ellipseSizes = [
  [5, 3, 4],
  [5, 4, 3],
  [13, 5, 12],
] as const; // a,c,b
export const hyperbolaSizes = [
  [3, 5, 4],
  [4, 5, 3],
  [5, 13, 12],
] as const; // a,c,b
export function focalModel(
  kind: 'ellipse' | 'hyperbola',
  h: number,
  k: number,
  index: number,
  axis: ConicAxis,
): FocusConic {
  if (!['ellipse', 'hyperbola'].includes(kind))
    throw new RangeError('Supported focal conic');
  small(h, -3, 3);
  small(k, -3, 3);
  small(index, 0, 2);
  axisCheck(axis);
  const [a, c, b] = (kind === 'ellipse' ? ellipseSizes : hyperbolaSizes)[
      index
    ]!,
    u = axis === 'horizontal' ? `(x-(${h}))` : `(y-(${k}))`,
    v = axis === 'horizontal' ? `(y-(${k}))` : `(x-(${h}))`;
  return {
    kind,
    centre: cp(h, k),
    axis,
    a: cq(a),
    b: cq(b),
    c: cq(c),
    focusMinus: locate(h, k, cq(-c), cq(0), axis),
    focusPlus: locate(h, k, cq(c), cq(0), axis),
    equation: `${u}^2/${a * a}${kind === 'ellipse' ? '+' : '-'}${v}^2/${b * b}=1`,
  };
}
export function conicPoint(m: FocusConic, tRaw: string, branch: 1 | -1 = 1) {
  const t = cq(tRaw);
  if (Math.abs(cn(t)) > 2 || t[1] > 100n || ![1, -1].includes(branch))
    throw new RangeError('Bounded trace parameter');
  let u: Rational, v: Rational, dMinus: Rational, dPlus: Rational;
  if (m.kind === 'parabola') {
    u = mulR(m.p!, squareC(t));
    v = mulR(mulR(cq(2), m.p!), t);
    dMinus = mulR(absC(m.p!), addR(cq(1), squareC(t)));
    dPlus = dMinus;
  } else {
    const ts = squareC(t),
      den = m.kind === 'ellipse' ? addR(cq(1), ts) : subC(cq(1), ts);
    if (m.kind === 'hyperbola' && den[0] <= 0n)
      throw new RangeError('Hyperbola trace uses |t|<1');
    u = mulR(
      m.a,
      divR(m.kind === 'ellipse' ? subC(cq(1), ts) : addR(cq(1), ts), den),
    );
    if (m.kind === 'hyperbola') u = mulR(cq(branch), u);
    v = divR(mulR(mulR(cq(2), m.b), t), den);
    const projected = divR(mulR(m.c, u), m.a);
    if (m.kind === 'ellipse') {
      dMinus = addR(m.a, projected);
      dPlus = subC(m.a, projected);
    } else {
      const base = divR(mulR(m.c, absC(u)), m.a);
      dMinus = addR(base, mulR(cq(branch), m.a));
      dPlus = subC(base, mulR(cq(branch), m.a));
    }
  }
  const point = locate(cn(m.centre[0]), cn(m.centre[1]), u, v, m.axis);
  return {
    point,
    dMinus,
    dPlus,
    constant: m.kind === 'parabola' ? dMinus : mulR(cq(2), m.a),
    signedDifference: subC(dMinus, dPlus),
    directrixFoot: m.directrix
      ? ((m.directrix.axis === 'x'
          ? [m.directrix.value, point[1]]
          : [point[0], m.directrix.value]) as Coordinate)
      : undefined,
  };
}
export const conicPointText = (m: FocusConic, t: string, branch: 1 | -1 = 1) =>
  coordinateText(conicPoint(m, t, branch).point);
