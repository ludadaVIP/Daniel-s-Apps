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
import { piCoefficient } from './circleModels';
import { checkRadical, readRadical, radicalText } from './radicalModels';
import { compareR } from './inequalityModels';
import {
  parsePolynomial,
  plusP,
  scaleP,
  type Polynomial,
} from './polynomialModels';
export type CircularFamily = 'sin' | 'cos' | 'tan';
const R = readRational,
  Z = rational(0n),
  ONE = rational(1n),
  TWO = rational(2n);
export const circularNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export function angleText(r: Rational): string {
  if (!r[0]) return '0';
  const sign = r[0] < 0n ? '-' : '',
    n = r[0] < 0n ? -r[0] : r[0];
  return `${sign}${n === 1n ? '' : n}pi${r[1] === 1n ? '' : `/${r[1]}`}`;
}
export function readAngle(raw: string): Rational | null {
  if (raw.length > 180 || /[°度]/.test(raw)) return null;
  return piCoefficient(raw.trim().replace(/\s*(?:radians?|rad|弧度)$/i, ''));
}
export function checkAngle(raw: string, coefficient: string): boolean {
  const r = readAngle(raw);
  return r !== null && sameR(r, R(coefficient));
}
export function checkAngleSet(raw: string, coefficients: string[]): boolean {
  if (raw.length > 700) return false;
  let s = raw.trim().replace(/，/g, ',');
  if (['∅', '{}', 'empty', 'empty set', '空集'].includes(s.toLowerCase()))
    return coefficients.length === 0;
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1);
  else if (/[{}]/.test(s)) return false;
  const entries = s.split(',');
  if (entries.length > 80) return false;
  const parsed = entries.map(readAngle);
  if (parsed.some((r) => r === null)) return false;
  const unique = [...new Map(parsed.map((r) => [textR(r!), r!])).values()];
  return (
    unique.length === coefficients.length &&
    unique.every((r) => coefficients.some((v) => sameR(r, R(v))))
  );
}
export function checkCircularValue(raw: string, value: string | null): boolean {
  return value === null || value === 'undefined'
    ? ['undefined', '无定义', '未定义'].includes(raw.trim().toLowerCase())
    : checkRadical(raw, value);
}
export function degreeToPi(degrees: string): Rational {
  return divR(R(degrees), rational(180n));
}
export function piToDegree(coefficient: string): Rational {
  return mulR(R(coefficient), rational(180n));
}
/** Exact values at multiples of pi/12. An angle keeps its original winding in the UI. */
const circularCache = new Map<
  number,
  { sin: string; cos: string; tan: string | null }
>();
export function circularAt(coefficient: string) {
  const theta = R(coefficient),
    ticks = mulR(theta, rational(12n));
  if (ticks[1] !== 1n || ticks[0] < -2400n || ticks[0] > 2400n)
    throw new RangeError('Use multiples of pi/12 within ±200pi');
  const tick = Number(((ticks[0] % 24n) + 24n) % 24n);
  const cached = circularCache.get(tick);
  if (cached)
    return {
      theta,
      tick,
      ...cached,
      degrees: piToDegree(coefficient),
      radians: circularNumber(theta) * Math.PI,
    };
  const first = [
    '0',
    '(sqrt(6)-sqrt(2))/4',
    '1/2',
    'sqrt(2)/2',
    'sqrt(3)/2',
    '(sqrt(6)+sqrt(2))/4',
    '1',
  ];
  const sine = (j: number): string => {
    const n = ((j % 24) + 24) % 24,
      half = n <= 12 ? n : n - 12,
      value = first[half <= 6 ? half : 12 - half]!;
    return radicalText(readRadical(n > 12 ? `-(${value})` : value)!);
  };
  const sin = sine(tick),
    cos = sine(tick + 6),
    tan = checkRadical(cos, '0')
      ? null
      : radicalText(readRadical(`(${sin})/(${cos})`)!);
  circularCache.set(tick, { sin, cos, tan });
  return {
    theta,
    tick,
    sin,
    cos,
    tan,
    degrees: piToDegree(coefficient),
    radians: circularNumber(theta) * Math.PI,
  };
}
export type WaveParams = {
  family: 'sin' | 'cos';
  a: string;
  b: string;
  h: string;
  d: string;
};
export function waveModel(p: WaveParams, input: string) {
  const a = R(p.a),
    b = R(p.b),
    h = R(p.h),
    d = R(p.d),
    x = R(input);
  if (
    !['sin', 'cos'].includes(p.family) ||
    !b[0] ||
    Math.abs(circularNumber(b)) > 4 ||
    Math.abs(circularNumber(b)) < 0.25 ||
    Math.abs(circularNumber(a)) > 4 ||
    Math.abs(circularNumber(h)) > 4 ||
    Math.abs(circularNumber(d)) > 4
  )
    throw new RangeError('Bounded wave; nonzero inner multiplier');
  const argument = mulR(b, addR(x, negR(h)));
  const output = !a[0]
    ? textR(d)
    : radicalText(
        readRadical(
          `(${p.a})*(${circularAt(textR(argument))[p.family]})+(${p.d})`,
        )!,
      );
  return {
    argument,
    output,
    amplitude: rational(a[0] < 0n ? -a[0] : a[0], a[1]),
    period: !a[0] ? null : divR(TWO, rational(b[0] < 0n ? -b[0] : b[0], b[1])),
    midline: d,
    shift: h,
  };
}
/** Reduce c² to 1-s². A zero remainder proves an identity on the unit circle. */
export function circleRemainder(raw: string): Polynomial | null {
  const p = parsePolynomial(raw, ['s', 'c']);
  if (!p) return null;
  const result: Polynomial = new Map();
  const add = (key: string, coefficient: Rational) => {
    const v = addR(result.get(key) ?? Z, coefficient);
    if (v[0]) result.set(key, v);
    else result.delete(key);
  };
  const expand = (s: number, c: number, k: Rational) => {
    if (c < 2) {
      add('c'.repeat(c) + 's'.repeat(s), k);
      return;
    }
    expand(s, c - 2, k);
    expand(s + 2, c - 2, negR(k));
  };
  for (const [key, k] of p)
    expand(
      [...key].filter((c) => c === 's').length,
      [...key].filter((c) => c === 'c').length,
      k,
    );
  return result;
}
export function checkCircleIdentity(
  raw: string,
  expected: string,
  only?: 's' | 'c' | 'constant',
): boolean {
  const parsed = parsePolynomial(raw, ['s', 'c']);
  if (
    !parsed ||
    (only &&
      [...parsed.keys()].some((key) =>
        only === 'constant'
          ? key.length > 0
          : key.includes(only === 's' ? 'c' : 's'),
      ))
  )
    return false;
  const a = circleRemainder(raw),
    b = circleRemainder(expected);
  return (
    a !== null && b !== null && plusP(a, scaleP(b, rational(-1n))).size === 0
  );
}
export type CircularEquation = {
  family: CircularFamily;
  b: string;
  h: string;
  target: string;
  low: string;
  high: string;
  lowClosed: boolean;
  highClosed: boolean;
};
const floor = (r: Rational) =>
  r[0] >= 0n ? r[0] / r[1] : -((-r[0] + r[1] - 1n) / r[1]);
const ceil = (r: Rational) => -floor(negR(r));
/** Exact complete finite solution set for supported special values, without rounding endpoints. */
export function circularSolutions(p: CircularEquation): Rational[] {
  const b = R(p.b),
    h = R(p.h),
    lo = R(p.low),
    hi = R(p.high);
  if (
    !['sin', 'cos', 'tan'].includes(p.family) ||
    !b[0] ||
    Math.abs(circularNumber(b)) > 4 ||
    Math.abs(circularNumber(b)) < 0.25 ||
    Math.abs(circularNumber(h)) > 8 ||
    Math.max(Math.abs(circularNumber(lo)), Math.abs(circularNumber(hi))) > 12 ||
    compareR(lo, hi) > 0
  )
    throw new RangeError('Bounded ordered interval and nonzero multiplier');
  const period = p.family === 'tan' ? ONE : TWO,
    seeds: Rational[] = [];
  for (let i = 0; i < (p.family === 'tan' ? 12 : 24); i++) {
    const c = rational(BigInt(i), 12n),
      value = circularAt(textR(c))[p.family];
    if (value !== null && checkRadical(value, p.target)) seeds.push(c);
  }
  if (!seeds.length) {
    if (p.family !== 'tan') {
      try {
        const target = R(p.target);
        if (compareR(target, ONE) > 0 || compareR(target, negR(ONE)) < 0)
          return [];
      } catch {
        /* unsupported exact target */
      }
    }
    throw new RangeError(
      'Use a supported exact special value; not an empty-set claim',
    );
  }
  const ends = [mulR(b, addR(lo, negR(h))), mulR(b, addR(hi, negR(h)))].sort(
      compareR,
    ),
    out: Rational[] = [];
  for (const seed of seeds) {
    const start = ceil(divR(addR(ends[0]!, negR(seed)), period)),
      end = floor(divR(addR(ends[1]!, negR(seed)), period));
    for (let n = start; n <= end; n++) {
      const x = addR(h, divR(addR(seed, mulR(period, rational(n))), b)),
        left = compareR(x, lo),
        right = compareR(x, hi);
      if (
        (left > 0 || (left === 0 && p.lowClosed)) &&
        (right < 0 || (right === 0 && p.highClosed))
      )
        out.push(x);
    }
  }
  return [...new Map(out.map((r) => [textR(r), r])).values()].sort(compareR);
}
export const solutionText = (rs: Rational[]) =>
  rs.length ? `{${rs.map(angleText).join(',')}}` : '∅';
