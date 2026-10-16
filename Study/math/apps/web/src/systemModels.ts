import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  affineText,
  type Rational,
} from './algebraModels';
import {
  parsePolynomial,
  plusP,
  scaleP,
  polynomialText,
  type Polynomial,
} from './polynomialModels';
import { readRational } from './rationalModels';
import {
  readCoordinate,
  coordinateText,
  lineSegment,
  plotBounds,
  type Coordinate,
  type PlotBounds,
  type PlotPoint,
} from './cartesianModels';
export type SystemRow = { a: Rational; b: Rational; c: Rational };
export type LinearSystem = readonly [SystemRow, SystemRow];
const ZERO: Rational = [0n, 1n];
const subtract = (a: Rational, b: Rational) => addR(a, negR(b));
const bounded = (n: number, min: number, max: number) => {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Bounded integer parameter');
  return n;
};
export function systemRow(a: string, b: string, c: string): SystemRow {
  return { a: readRational(a), b: readRational(b), c: readRational(c) };
}
export function parseSystemRow(raw: string): SystemRow | null {
  if (raw.length > 240) return null;
  const sides = raw.replace(/＝/g, '=').split('=');
  if (sides.length !== 2 || sides.some((v) => !v.trim())) return null;
  const l = parsePolynomial(sides[0]!, ['x', 'y']),
    r = parsePolynomial(sides[1]!, ['x', 'y']);
  if (!l || !r) return null;
  try {
    const difference = plusP(l, scaleP(r, [-1n, 1n]));
    if ([...difference.keys()].some((k) => !['', 'x', 'y'].includes(k)))
      return null;
    return {
      a: difference.get('x') ?? ZERO,
      b: difference.get('y') ?? ZERO,
      c: negR(difference.get('') ?? ZERO),
    };
  } catch {
    return null;
  }
}
export function parseLinearSystem(raw: string): LinearSystem | null {
  if (raw.length > 500) return null;
  let s = raw.trim().replace(/；/g, ';');
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1);
  else if (/[{}]/.test(s)) return null;
  const equations = s.split(/[;\n]/).map((v) => v.trim());
  if (equations.length !== 2 || equations.some((v) => !v)) return null;
  const a = parseSystemRow(equations[0]!),
    b = parseSystemRow(equations[1]!);
  return a && b ? [a, b] : null;
}
export function rowText(r: SystemRow) {
  const p: Polynomial = new Map();
  if (r.a[0]) p.set('x', r.a);
  if (r.b[0]) p.set('y', r.b);
  return `${polynomialText(p)} = ${textR(r.c)}`;
}
export const systemText = (s: LinearSystem) => s.map(rowText).join('; ');
export function sameSystemRelation(a: SystemRow, b: SystemRow) {
  const aa = [a.a, a.b, a.c],
    bb = [b.a, b.b, b.c],
    i = aa.findIndex((v) => v[0] !== 0n);
  if (i < 0) return bb.every((v) => v[0] === 0n);
  if (bb[i]![0] === 0n) return false;
  return aa.every((v, j) => sameR(mulR(v, bb[i]!), mulR(bb[j]!, aa[i]!)));
}
export function checkSystemModel(raw: string, expected: string) {
  const a = parseLinearSystem(raw),
    b = parseLinearSystem(expected);
  if (!a || !b) return false;
  if ([...a, ...b].some((r) => !r.a[0] && !r.b[0])) return false;
  return (
    (sameSystemRelation(a[0], b[0]) && sameSystemRelation(a[1], b[1])) ||
    (sameSystemRelation(a[0], b[1]) && sameSystemRelation(a[1], b[0]))
  );
}
export type SystemSolution =
  | { kind: 'one'; point: Coordinate; determinant: Rational }
  | { kind: 'none' }
  | { kind: 'infinite'; rank: 0 | 1; line?: SystemRow };
export function solveSystem(s: LinearSystem): SystemSolution {
  const valid = s.filter((r) => r.a[0] !== 0n || r.b[0] !== 0n);
  if (s.some((r) => !r.a[0] && !r.b[0] && r.c[0])) return { kind: 'none' };
  if (!valid.length) return { kind: 'infinite', rank: 0 };
  if (valid.length === 1) return { kind: 'infinite', rank: 1, line: valid[0]! };
  const [u, v] = s,
    d = subtract(mulR(u.a, v.b), mulR(v.a, u.b));
  if (d[0])
    return {
      kind: 'one',
      point: [
        divR(subtract(mulR(u.c, v.b), mulR(v.c, u.b)), d),
        divR(subtract(mulR(u.a, v.c), mulR(v.a, u.c)), d),
      ],
      determinant: d,
    };
  return sameSystemRelation(u, v)
    ? { kind: 'infinite', rank: 1, line: u }
    : { kind: 'none' };
}
export function sameSystemSolutions(a: LinearSystem, b: LinearSystem) {
  const x = solveSystem(a),
    y = solveSystem(b);
  if (x.kind !== y.kind) return false;
  if (x.kind === 'none') return true;
  if (x.kind === 'one' && y.kind === 'one')
    return sameR(x.point[0], y.point[0]) && sameR(x.point[1], y.point[1]);
  if (x.kind === 'infinite' && y.kind === 'infinite')
    return (
      x.rank === y.rank &&
      (x.rank === 0 || sameSystemRelation(x.line!, y.line!))
    );
  return false;
}
export function checkSystemClass(raw: string, kind: 'none' | 'infinite') {
  const s = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  return (
    kind === 'none'
      ? [
          'none',
          'no solution',
          'no solutions',
          'no allowed solution',
          'no allowed solutions',
          '无解',
          '没有解',
          '无符合条件的解',
          '∅',
          '{}',
        ]
      : [
          'infinite',
          'infinitely many solutions',
          'infinitely many pairs',
          '无穷多解',
          '有无穷多组解',
          '无穷多组解',
          '无穷多个解',
          'infinitely many ordered pairs',
          '无穷多个数对',
        ]
  ).includes(s);
}
export function auditSystemPair(s: LinearSystem, raw: string) {
  const point = readCoordinate(raw);
  if (!point) return null;
  const rows = s.map((row) => {
    const left = addR(mulR(row.a, point[0]), mulR(row.b, point[1]));
    return { left, right: row.c, pass: sameR(left, row.c) };
  });
  return {
    point,
    text: coordinateText(point),
    rows,
    pass: rows.every((r) => r.pass),
  };
}
export function isolateSystemVariable(row: SystemRow, target: 'x' | 'y') {
  if (!['x', 'y'].includes(target)) throw new RangeError('Choose x or y');
  const pivot = target === 'x' ? row.a : row.b,
    other = target === 'x' ? row.b : row.a;
  if (!pivot[0]) throw new RangeError('Cannot isolate a missing variable');
  const k = divR(negR(other), pivot),
    b = divR(row.c, pivot),
    letter = target === 'x' ? 'y' : 'x';
  return {
    target,
    other: letter as 'x' | 'y',
    k,
    b,
    expression: affineText({ a: k, b }, letter),
  };
}
export function substitutionTrace(s: LinearSystem, target: 'x' | 'y' = 'y') {
  const first = s[0],
    second = s[1],
    iso = isolateSystemVariable(first, target),
    coefficient = target === 'x' ? second.a : second.b,
    other = target === 'x' ? second.b : second.a,
    a = addR(other, mulR(coefficient, iso.k)),
    c = subtract(second.c, mulR(coefficient, iso.b));
  const substituted =
    target === 'y'
      ? `(${textR(second.a)})x + (${textR(second.b)})(${iso.expression}) = ${textR(second.c)}`
      : `(${textR(second.a)})(${iso.expression}) + (${textR(second.b)})y = ${textR(second.c)}`;
  if (!a[0])
    return {
      iso,
      substituted,
      a,
      c,
      kind: c[0] ? ('none' as const) : ('infinite' as const),
      point: null,
      otherValue: null,
      targetValue: null,
    };
  const otherValue = divR(c, a),
    targetValue = addR(mulR(iso.k, otherValue), iso.b),
    point: Coordinate =
      target === 'y' ? [otherValue, targetValue] : [targetValue, otherValue];
  return {
    iso,
    substituted,
    a,
    c,
    kind: 'one' as const,
    point,
    otherValue,
    targetValue,
  };
}
export function combineSystemRows(
  s: LinearSystem,
  k1: string,
  k2: string,
): SystemRow {
  const u = readRational(k1),
    v = readRational(k2),
    [a, b] = s;
  return {
    a: addR(mulR(u, a.a), mulR(v, b.a)),
    b: addR(mulR(u, a.b), mulR(v, b.b)),
    c: addR(mulR(u, a.c), mulR(v, b.c)),
  };
}
export function replaceSystemRow(
  s: LinearSystem,
  replace: 0 | 1,
  k1: string,
  k2: string,
) {
  if (replace !== 0 && replace !== 1)
    throw new RangeError('Choose the replaced row');
  const factors = [readRational(k1), readRational(k2)],
    combined = combineSystemRows(s, k1, k2);
  // This checks a universally reversible row operation, not whether a special
  // dependent input happens to keep its solution set after information is removed.
  if (!factors[replace]![0])
    return { valid: false as const, combined, rows: s };
  const rows: LinearSystem =
    replace === 0 ? [combined, s[1]] : [s[0], combined];
  return { valid: true as const, combined, rows };
}
export function systemLineSegment(
  r: SystemRow,
  bounds: PlotBounds,
): PlotPoint[] {
  plotBounds(bounds);
  const value = (v: Rational) => Number(v[0]) / Number(v[1]);
  if (r.b[0])
    return lineSegment(
      value(divR(negR(r.a), r.b)),
      value(divR(r.c, r.b)),
      bounds,
    );
  if (!r.a[0]) return [];
  const x = value(divR(r.c, r.a));
  return x < bounds.xMin || x > bounds.xMax
    ? []
    : [
        { x, y: bounds.yMin },
        { x, y: bounds.yMax },
      ];
}
export function pointInSystemWindow(p: Coordinate, b: PlotBounds) {
  plotBounds(b);
  const x = Number(p[0][0]) / Number(p[0][1]),
    y = Number(p[1][0]) / Number(p[1][1]);
  return x >= b.xMin && x <= b.xMax && y >= b.yMin && y <= b.yMax;
}
const source = (raw: string) => {
  const s = parseLinearSystem(raw);
  if (!s) throw new RangeError('Valid system source');
  return s;
};
export const relationSystems = ['x+y=7;2x+y=11', 'x+y=4;x-y=0'].map(source);
export const substitutionSystems = [
  'x+y=7;2x+y=11',
  '2x+y=1;x-y=0',
  'x+y=4;2x+2y=8',
  'x+y=4;2x+2y=9',
].map(source);
export const eliminationSystems = [
  { source: '2x+y=11;x-y=1', k1: 1, k2: 1 },
  { source: '2x+3y=13;3x-2y=0', k1: 2, k2: 3 },
  { source: 'x+y=4;2x+2y=8', k1: 2, k2: -1 },
  { source: 'x+y=4;2x+2y=9', k1: 2, k2: -1 },
].map((v) => ({ ...v, rows: source(v.source) }));
export const graphSystems = [
  'x+y=5;x-y=1',
  'x+y=4;x+y=6',
  'x+y=4;2x+2y=8',
  'x=2;y=3',
  'x+y=12;x-y=2',
  'x+y=1;x-y=0',
].map(source);
export function firstRelationSamples(row: SystemRow) {
  const iso = isolateSystemVariable(row, 'y');
  return Array.from({ length: 10 }, (_, i) => {
    const x = rational(BigInt(i - 1));
    return [x, addR(mulR(iso.k, x), iso.b)] as Coordinate;
  });
}
export type SystemContextKind = 'tickets' | 'fractional-tickets' | 'juice';
export function systemContext(kind: SystemContextKind) {
  if (!['tickets', 'fractional-tickets', 'juice'].includes(kind))
    throw new RangeError('Choose supplied fictional context');
  const total = kind === 'tickets' ? 29 : 30,
    rows = source(`x+y=7;5x+3y=${total}`);
  return {
    kind,
    total,
    rows,
    source: systemText(rows),
    rule:
      kind === 'juice'
        ? ('nonnegative' as const)
        : ('nonnegative-integer' as const),
    xUnit: kind === 'juice' ? 'L' : 'tickets',
    yUnit: kind === 'juice' ? 'L' : 'tickets',
  };
}
export function auditSystemContext(
  s: LinearSystem,
  raw: string,
  rule: 'nonnegative' | 'nonnegative-integer',
) {
  if (!['nonnegative', 'nonnegative-integer'].includes(rule))
    throw new RangeError('Choose domain');
  const audit = auditSystemPair(s, raw);
  if (!audit) return null;
  const nonnegative = audit.point.every((v) => v[0] >= 0n),
    integer = audit.point.every((v) => v[1] === 1n),
    contextPass = nonnegative && (rule === 'nonnegative' || integer);
  return {
    ...audit,
    nonnegative,
    integer,
    contextPass,
    accepted: audit.pass && contextPass,
  };
}
export function systemFromPoint(
  x: number,
  y: number,
  a: number,
  b: number,
  d: number,
  e: number,
): LinearSystem {
  [x, y, a, b, d, e].forEach((v) => bounded(v, -12, 12));
  if (a * e - b * d === 0) throw new RangeError('Independent source rows');
  return [
    systemRow(String(a), String(b), String(a * x + b * y)),
    systemRow(String(d), String(e), String(d * x + e * y)),
  ];
}
