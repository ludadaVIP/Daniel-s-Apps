import { addR, mulR, divR, negR, textR, type Rational } from './algebraModels';
import { readRational } from './rationalModels';
import {
  readRadical,
  radicalText,
  sameRadical,
  type RadicalValue,
} from './radicalModels';
import { solveQuadratic } from './quadraticModels';
import type { VectorCode } from './vectorModels';

export type ExactPoint = readonly [string, string];
const R = (n: number | string) => readRational(String(n));
const n = (r: Rational) => Number(r[0]) / Number(r[1]);
const bounded = (v: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(v) || v < lo || v > hi)
    throw new RangeError('Bounded classroom integer');
  return v;
};
const exact = (s: string) => radicalText(readRadical(s)!);
export const pointSetText = (ps: readonly ExactPoint[]) =>
  `{${ps.map((p) => `(${p[0]},${p[1]})`).join(';')}}`;
/** Explicit point pairs; nested arithmetic parentheses are allowed, stray prose is not. */
export function readPointSet(
  raw: string,
): [RadicalValue, RadicalValue][] | null {
  if (raw.length > 1800) return null;
  let s = raw
    .trim()
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/，/g, ',')
    .replace(/；/g, ';');
  if (/^(?:∅|empty|空集|\{\s*\})$/i.test(s)) return [];
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1).trim();
  else if (/[{}]/.test(s)) return null;
  const result: [RadicalValue, RadicalValue][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] !== '(') return null;
    const start = ++i;
    let depth = 1,
      comma = -1;
    while (i < s.length && depth) {
      if (s[i] === '(') depth++;
      else if (s[i] === ')') depth--;
      else if (s[i] === ',' && depth === 1) {
        if (comma >= 0) return null;
        comma = i;
      }
      if (depth) i++;
    }
    if (depth || comma < 0) return null;
    const x = readRadical(s.slice(start, comma)),
      y = readRadical(s.slice(comma + 1, i));
    if (!x || !y) return null;
    if (!result.some((p) => sameRadical(p[0], x) && sameRadical(p[1], y)))
      result.push([x, y]);
    if (result.length > 20) return null;
    s = s.slice(i + 1).trim();
    i = 0;
    if (s) {
      if (!/^[;,]/.test(s)) return null;
      s = s.slice(1).trim();
      if (!s) return null;
    }
  }
  return result.length ? result : null;
}
export function checkPointSet(raw: string, expected: string) {
  const a = readPointSet(raw),
    b = readPointSet(expected);
  return (
    !!a &&
    !!b &&
    a.length === b.length &&
    a.every((p) =>
      b.some((q) => sameRadical(p[0], q[0]) && sameRadical(p[1], q[1])),
    )
  );
}
export const exactPointNumber = (p: ExactPoint) =>
  p.map((s) => {
    const r = readRadical(s);
    if (!r) throw new RangeError('Exact real coordinate');
    return [...r].reduce(
      (sum, [rad, c]) => sum + n(c) * Math.sqrt(Number(rad)),
      0,
    );
  }) as [number, number];
export type IntersectionConic = 'circle' | 'ellipse' | 'parabola' | 'hyperbola';
export type LineDirection = 'horizontal' | 'vertical' | 'diagonal';
export const conicCoefficients: Record<
  IntersectionConic,
  readonly [number, number, number, number, number]
> = {
  circle: [1, 1, 0, 0, -25],
  ellipse: [9, 25, 0, 0, -225],
  parabola: [1, 0, 0, -1, 0],
  hyperbola: [1, -1, 0, 0, -1],
};
export const conicEquations = {
  circle: 'x²+y²=25',
  ellipse: '9x²+25y²=225',
  parabola: 'y=x²',
  hyperbola: 'x²−y²=1',
};
export function lineConicAudit(
  kind: IntersectionConic,
  direction: LineDirection,
  offset: number,
) {
  if (
    !Object.hasOwn(conicCoefficients, kind) ||
    !['horizontal', 'vertical', 'diagonal'].includes(direction)
  )
    throw new RangeError('Declared conic and line');
  bounded(offset, -6, 6);
  if (kind === 'ellipse' && Math.abs(offset) > 4)
    throw new RangeError('Bounded exact ellipse examples');
  const [xx, yy, lx, ly, c] = conicCoefficients[kind];
  const p: ExactPoint =
    direction === 'vertical' ? [String(offset), '0'] : ['0', String(offset)];
  const d: ExactPoint =
    direction === 'horizontal'
      ? ['1', '0']
      : direction === 'vertical'
        ? ['0', '1']
        : ['1', '1'];
  const [px, py] = p.map(Number),
    [dx, dy] = d.map(Number);
  const A = xx * dx! * dx! + yy * dy! * dy!,
    B = 2 * xx * px! * dx! + 2 * yy * py! * dy! + lx * dx! + ly * dy!,
    C = xx * px! * px! + yy * py! * py! + lx * px! + ly * py! + c;
  const solved = solveQuadratic(`(${A})*x^2+(${B})*x+(${C})=0`);
  const parameters = (solved.roots ?? []).map(radicalText);
  const points: ExactPoint[] = parameters.map((t) => [
    exact(`(${p[0]})+(${d[0]})*(${t})`),
    exact(`(${p[1]})+(${d[1]})*(${t})`),
  ]);
  return {
    kind,
    direction,
    offset,
    p,
    d,
    A,
    B,
    C,
    parameters,
    points,
    discriminant:
      solved.discriminant === null ? null : textR(solved.discriminant),
    degree: A !== 0 ? 2 : B !== 0 ? 1 : 0,
    tangent: A !== 0 && solved.repeated,
    line:
      direction === 'vertical'
        ? `x=${offset}`
        : direction === 'horizontal'
          ? `y=${offset}`
          : `y=x+(${offset})`,
    conic: conicEquations[kind],
  };
}
export type MidpointMotion = 'all' | 'upper' | 'upper-excluded';
export function midpointLocus(
  a: number,
  r: number,
  motion: MidpointMotion,
  card: number,
) {
  bounded(a, -2, 2);
  if (
    ![2, 4, 6].includes(r) ||
    !['all', 'upper', 'upper-excluded'].includes(motion)
  )
    throw new RangeError('Midpoint locus design');
  bounded(card, 0, 3);
  const source: ExactPoint =
    card === 0
      ? ['0', String(r)]
      : card === 1
        ? ['0', String(-r)]
        : card === 2
          ? [String(r), '0']
          : [String(-r), '0'];
  const midpoint: ExactPoint = [
    textR(divR(addR(R(a), R(source[0])), R(2))),
    textR(divR(R(source[1]), R(2))),
  ];
  const reconstruct = (p: ExactPoint): ExactPoint => [
    textR(addR(mulR(R(2), R(p[0])), negR(R(a)))),
    textR(mulR(R(2), R(p[1]))),
  ];
  const contains = (p: ExactPoint) => {
    const [x, y] = reconstruct(p).map(R),
      on = addR(mulR(x!, x!), mulR(y!, y!));
    return (
      on[0] === BigInt(r * r) * on[1] &&
      (motion === 'all' || y![0] >= 0n) &&
      !(
        motion === 'upper-excluded' &&
        x![0] === BigInt(r) * x![1] &&
        y![0] === 0n
      )
    );
  };
  return {
    a,
    r,
    motion,
    source,
    midpoint,
    reconstruct,
    contains,
    admitted: contains(midpoint),
    centre: [textR(divR(R(a), R(2))), '0'] as ExactPoint,
    hole: [textR(divR(R(a + r), R(2))), '0'] as ExactPoint,
    equation: `(2*x-(${a}))^2+4*y^2=${r * r}`,
    radiusSquare: (r * r) / 4,
  };
}
export function rationalCircle(r: number, tRaw: string, restricted = false) {
  if (![3, 5].includes(r)) throw new RangeError('Declared circle radius');
  const t = R(tRaw);
  if (Math.abs(n(t)) > 4 || t[1] > 16n)
    throw new RangeError('Bounded exact parameter probe');
  const square = mulR(t, t),
    den = addR(R(1), square);
  const point: ExactPoint = [
    textR(divR(mulR(R(r), addR(R(1), negR(square))), den)),
    textR(divR(mulR(R(2 * r), t), den)),
  ];
  const inverse = (p: ExactPoint) => {
    const x = R(p[0]),
      y = R(p[1]),
      on = addR(mulR(x, x), mulR(y, y)),
      bottom = addR(x, R(r));
    if (on[0] !== BigInt(r * r) * on[1] || !bottom[0]) return null;
    const candidate = divR(y, bottom);
    return restricted && (candidate[0] < 0n || candidate[0] > candidate[1])
      ? null
      : textR(candidate);
  };
  return {
    r,
    t: tRaw,
    restricted,
    point,
    inverse,
    admitted: !restricted || (t[0] >= 0n && t[0] <= t[1]),
    omitted: [String(-r), '0'] as ExactPoint,
    domain: restricted ? '[0,1]' : 'R',
    equation: `x^2+y^2=${r * r}`,
  };
}
export function diameterAudit(a: number, p: ExactPoint) {
  bounded(a, 1, 4);
  const x = R(p[0]),
    y = R(p[1]);
  if (Math.abs(n(x)) > 10 || Math.abs(n(y)) > 10)
    throw new RangeError('Bounded exact point');
  const dot = addR(addR(mulR(x, x), mulR(y, y)), R(-a * a)),
    cross = mulR(R(2 * a), y);
  const zero =
    y[0] === 0n && (x[0] === BigInt(a) * x[1] || x[0] === BigInt(-a) * x[1]);
  const angle: VectorCode = zero
    ? 'undefined'
    : !cross[0]
      ? dot[0] < 0n
        ? 'straight'
        : 'zero-angle'
      : !dot[0]
        ? 'right'
        : dot[0] < 0n
          ? 'obtuse'
          : 'acute';
  return {
    a,
    p,
    dot: textR(dot),
    cross: textR(cross),
    angle,
    onEquation: dot[0] === 0n,
    admitted: angle === 'right',
    endpoints: [
      [String(-a), '0'],
      [String(a), '0'],
    ] as ExactPoint[],
    equation: `x^2+y^2=${a * a}`,
  };
}
export type ClearanceCase = 'floor' | 'low' | 'high' | 'apex' | 'above';
export function ellipseRoof(scale: number, clearance: ClearanceCase) {
  if (
    ![1, 2].includes(scale) ||
    !['floor', 'low', 'high', 'apex', 'above'].includes(clearance)
  )
    throw new RangeError('Declared roof design');
  const a = 5 * scale,
    b = 3 * scale;
  const height =
    clearance === 'floor'
      ? R(0)
      : clearance === 'low'
        ? R(`${3 * b}/5`)
        : clearance === 'high'
          ? R(`${4 * b}/5`)
          : R(clearance === 'apex' ? b : b + 1);
  const half =
    clearance === 'floor'
      ? R(a)
      : clearance === 'low'
        ? R(`${4 * a}/5`)
        : clearance === 'high'
          ? R(`${3 * a}/5`)
          : clearance === 'apex'
            ? R(0)
            : null;
  const width = half ? textR(mulR(R(2), half)) : null;
  const contains = (p: ExactPoint) => {
    const x = R(p[0]),
      y = R(p[1]);
    const residual = addR(
      divR(mulR(x, x), R(a * a)),
      divR(mulR(y, y), R(b * b)),
    );
    return residual[0] === residual[1] && y[0] >= 0n;
  };
  return {
    scale,
    clearance,
    a,
    b,
    height: textR(height),
    half: half ? textR(half) : null,
    width,
    admissibleX: half ? `[${textR(negR(half))},${textR(half)}]` : '∅',
    points: half
      ? half[0] === 0n
        ? [['0', textR(height)] as ExactPoint]
        : ([
            [textR(negR(half)), textR(height)],
            [textR(half), textR(height)],
          ] as ExactPoint[])
      : [],
    positiveOpening: !!half && half[0] > 0n,
    contains,
    equation: `x^2/${a * a}+y^2/${b * b}=1`,
  };
}
