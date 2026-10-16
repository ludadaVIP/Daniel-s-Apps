import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  parseAffine,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import type { Coordinate } from './cartesianModels';
export type RigidTransform =
  | { kind: 'translate'; vector: Coordinate }
  | { kind: 'reflect'; line: 'x-axis' | 'y-axis' | 'x=1' | 'y=x' }
  | { kind: 'rotate'; center: Coordinate; turns: 1 | 2 | 3 };
const Z: Rational = [0n, 1n],
  TWO: Rational = [2n, 1n];
export function rigidImage(p: Coordinate, t: RigidTransform): Coordinate {
  if (t.kind === 'translate')
    return [addR(p[0], t.vector[0]), addR(p[1], t.vector[1])];
  if (
    t.kind === 'reflect' &&
    !['x-axis', 'y-axis', 'x=1', 'y=x'].includes(t.line)
  )
    throw new RangeError('Known reflection line');
  if (t.kind === 'reflect')
    return t.line === 'x-axis'
      ? [p[0], negR(p[1])]
      : t.line === 'y-axis'
        ? [negR(p[0]), p[1]]
        : t.line === 'x=1'
          ? [addR(TWO, negR(p[0])), p[1]]
          : [p[1], p[0]];
  if (![1, 2, 3].includes(t.turns)) throw new RangeError('Use quarter turns');
  const x = addR(p[0], negR(t.center[0])),
    y = addR(p[1], negR(t.center[1])),
    q: Coordinate =
      t.turns === 1
        ? [negR(y), x]
        : t.turns === 2
          ? [negR(x), negR(y)]
          : [y, negR(x)];
  return [addR(q[0], t.center[0]), addR(q[1], t.center[1])];
}
export const origin: Coordinate = [Z, Z];
export const midpoint = (a: Coordinate, b: Coordinate): Coordinate => [
  divR(addR(a[0], b[0]), TWO),
  divR(addR(a[1], b[1]), TWO),
];
export function squaredDistance(a: Coordinate, b: Coordinate) {
  const x = addR(a[0], negR(b[0])),
    y = addR(a[1], negR(b[1]));
  return addR(mulR(x, x), mulR(y, y));
}
export const transformTriangle: Coordinate[] = [
  [
    [-2n, 1n],
    [-1n, 1n],
  ],
  [Z, [-1n, 1n]],
  [
    [-1n, 1n],
    [1n, 1n],
  ],
];
export function integerRoot(n: bigint) {
  if (n < 0n) throw new RangeError('Nonnegative square');
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2)),
    y = (x + n / x) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}
export function exactRootText(square: Rational) {
  square = rational(square[0], square[1]);
  if (square[0] < 0n) throw new RangeError('Nonnegative length square');
  const n = integerRoot(square[0]),
    d = integerRoot(square[1]);
  return n * n === square[0] && d * d === square[1]
    ? textR(rational(n, d))
    : `√${square[1] === 1n ? String(square[0]) : `(${textR(square)})`}`;
}
/** One nonnegative rational value or one rational multiple of a single root.
 * Exact comparison uses its square; no decimal tolerance or executable input. */
export function readRootLength(raw: string): Rational | null {
  if (raw.length > 180) return null;
  const s = raw
    .trim()
    .replace(/[−－]/g, '-')
    .replace(/（/g, '(')
    .replace(/）/g, ')');
  const matches = [
    ...s.matchAll(/sqrt\(([^()]*)\)|√\(([^()]*)\)|√(\d+(?:\.\d*)?|\.\d+)/gi),
  ];
  try {
    if (matches.length > 1) return null;
    if (!matches.length) {
      if (/[a-z√]/i.test(s)) return null;
      const a = parseAffine(s, 'x');
      return a && !a.a[0] && a.b[0] >= 0n ? mulR(a.b, a.b) : null;
    }
    const m = matches[0]!,
      radicand = readRational(m[1] ?? m[2] ?? m[3]!);
    if (radicand[0] < 0n) return null;
    const outside = s.slice(0, m.index) + s.slice(m.index! + m[0].length);
    if (/[a-z]/i.test(outside)) return null;
    const a = parseAffine(
      s.slice(0, m.index) + 'x' + s.slice(m.index! + m[0].length),
      'x',
    );
    if (!a || a.b[0] || (a.a[0] < 0n && radicand[0] !== 0n)) return null;
    return mulR(mulR(a.a, a.a), radicand);
  } catch {
    return null;
  }
}
export function checkRootLength(raw: string, square: string) {
  const actual = readRootLength(raw);
  try {
    const expected = readRational(square);
    return !!actual && expected[0] >= 0n && sameR(actual, expected);
  } catch {
    return false;
  }
}
export type PlanePoint = { x: number; y: number };
export function dissection(a: number, b: number) {
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    a <= 0 ||
    b <= 0 ||
    a > 10 ||
    b > 10
  )
    throw new RangeError('Positive bounded legs');
  const s = a + b;
  return {
    a,
    b,
    s,
    hyp: {
      pieces: [
        [
          { x: 0, y: 0 },
          { x: a, y: 0 },
          { x: 0, y: b },
        ],
        [
          { x: a, y: 0 },
          { x: s, y: 0 },
          { x: s, y: a },
        ],
        [
          { x: s, y: a },
          { x: s, y: s },
          { x: b, y: s },
        ],
        [
          { x: b, y: s },
          { x: 0, y: s },
          { x: 0, y: b },
        ],
      ],
      gaps: [
        [
          { x: a, y: 0 },
          { x: s, y: a },
          { x: b, y: s },
          { x: 0, y: b },
        ],
      ],
    },
    legs: {
      pieces: [
        [
          { x: a, y: 0 },
          { x: s, y: 0 },
          { x: a, y: a },
        ],
        [
          { x: s, y: 0 },
          { x: s, y: a },
          { x: a, y: a },
        ],
        [
          { x: 0, y: a },
          { x: a, y: a },
          { x: 0, y: s },
        ],
        [
          { x: a, y: a },
          { x: a, y: s },
          { x: 0, y: s },
        ],
      ],
      gaps: [
        [
          { x: 0, y: 0 },
          { x: a, y: 0 },
          { x: a, y: a },
          { x: 0, y: a },
        ],
        [
          { x: a, y: a },
          { x: s, y: a },
          { x: s, y: s },
          { x: a, y: s },
        ],
      ],
    },
  };
}
export function pythagoreanSquare(
  a: string,
  b: string,
  unknown: 'hypotenuse' | 'leg',
  rightGiven = true,
) {
  const x = readRational(a),
    y = readRational(b);
  if (x[0] <= 0n || y[0] <= 0n) return { kind: 'impossible' as const };
  if (!rightGiven) return { kind: 'insufficient' as const };
  // For a missing leg, a is the known leg and b the given hypotenuse.
  const square =
    unknown === 'hypotenuse'
      ? addR(mulR(x, x), mulR(y, y))
      : addR(mulR(y, y), negR(mulR(x, x)));
  return square[0] > 0n
    ? { kind: 'length' as const, square, text: exactRootText(square) }
    : { kind: 'impossible' as const };
}
const cmp = (a: Rational, b: Rational) => {
  const d = a[0] * b[1] - b[0] * a[1];
  return d < 0n ? -1 : d > 0n ? 1 : 0;
};
export function pythagoreanClassification(raw: readonly string[]) {
  if (raw.length !== 3) return null;
  try {
    const sides = raw.map(readRational).sort(cmp),
      [a, b, c] = sides as [Rational, Rational, Rational];
    if (a[0] <= 0n || cmp(addR(a, b), c) <= 0)
      return { kind: 'impossible' as const, sides };
    const delta = addR(mulR(c, c), negR(addR(mulR(a, a), mulR(b, b))));
    return {
      kind:
        delta[0] === 0n
          ? ('right' as const)
          : delta[0] > 0n
            ? ('obtuse' as const)
            : ('acute' as const),
      sides,
      delta,
    };
  } catch {
    return null;
  }
}
export const pythagoreanCases = [
  { id: 'rectangle', a: '3', b: '4', unknown: 'hypotenuse', unit: 'm' },
  { id: 'leg', a: '5', b: '13', unknown: 'leg', unit: 'cm' },
  { id: 'root', a: '2', b: '3', unknown: 'hypotenuse', unit: 'm' },
  { id: 'fraction', a: '3/4', b: '1', unknown: 'hypotenuse', unit: 'cm' },
  { id: 'no-right', a: '3', b: '4', unknown: 'hypotenuse', unit: 'cm' },
] as const;
