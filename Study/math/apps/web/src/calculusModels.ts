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
import {
  parsePolynomial,
  polynomialText,
  type Polynomial,
} from './polynomialModels';
export type CalculusCode = 'undefined' | 'does-not-exist';
export function checkCalculusCode(raw: string, expected: CalculusCode) {
  return (
    expected === 'undefined'
      ? ['undefined', '未定义', '无定义']
      : ['does-not-exist', 'dne', '不存在', '极限不存在']
  ).includes(raw.trim().toLowerCase());
}
export const asNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export const subtractR = (a: Rational, b: Rational) => addR(a, negR(b));
export function calculusScalar(raw: string): Rational {
  const r = readRational(raw);
  if ((r[0] < 0n ? -r[0] : r[0]) > 100n * r[1] || r[1] > 10000n)
    throw new RangeError('Bounded calculus scalar');
  return r;
}
export function calculusPolynomial(raw: string): Polynomial {
  const p = parsePolynomial(raw);
  if (
    !p ||
    [...p.values()].some(
      (r) => (r[0] < 0n ? -r[0] : r[0]) > 100n * r[1] || r[1] > 1000n,
    )
  )
    throw new RangeError(
      'Univariate polynomial of degree at most four with bounded rational coefficients',
    );
  return p;
}
export function valueAt(p: Polynomial, x: Rational): Rational {
  let result = rational(0n);
  for (const [key, c] of p) {
    let v = c;
    for (let i = 0; i < key.length; i++) v = mulR(v, x);
    result = addR(result, v);
  }
  return result;
}
export function differentiate(p: Polynomial): Polynomial {
  return new Map(
    [...p]
      .filter(([key]) => key.length > 0)
      .map(([key, c]) => [key.slice(1), mulR(c, rational(BigInt(key.length)))]),
  );
}
export function rateModel(raw: string, aRaw: string, bRaw: string) {
  const p = calculusPolynomial(raw),
    a = calculusScalar(aRaw),
    b = calculusScalar(bRaw),
    fa = valueAt(p, a),
    fb = valueAt(p, b),
    dx = subtractR(b, a),
    dy = subtractR(fb, fa);
  return {
    p,
    a,
    b,
    fa,
    fb,
    dx,
    dy,
    average: dx[0] ? divR(dy, dx) : null,
    derivative: valueAt(differentiate(p), a),
  };
}
export function secantModel(raw: string, aRaw: string, hRaw: string) {
  const a = calculusScalar(aRaw),
    h = calculusScalar(hRaw),
    b = addR(a, h),
    m = rateModel(raw, aRaw, textR(b));
  return { ...m, h };
}
export function tangentModel(raw: string, aRaw: string) {
  const p = calculusPolynomial(raw),
    a = calculusScalar(aRaw),
    y = valueAt(p, a),
    derivative = differentiate(p),
    slope = valueAt(derivative, a),
    intercept = subtractR(y, mulR(slope, a));
  return {
    p,
    a,
    y,
    derivative,
    slope,
    intercept,
    equation: `y=(${textR(slope)})x+(${textR(intercept)})`,
  };
}
export type LimitFamily = 'hole' | 'patched' | 'jump' | 'absolute';
export function limitModel(kind: LimitFamily) {
  if (!['hole', 'patched', 'jump', 'absolute'].includes(kind))
    throw new RangeError('Known limit family');
  const a = rational(kind === 'absolute' ? 0n : 1n),
    left = rational(kind === 'jump' ? 0n : kind === 'absolute' ? 0n : 2n),
    right = rational(kind === 'absolute' ? 0n : 2n);
  const at =
    kind === 'hole'
      ? null
      : rational(kind === 'patched' ? 5n : kind === 'jump' ? 2n : 0n);
  return { kind, a, left, right, at, limit: sameR(left, right) ? left : null };
}
export function limitValue(kind: LimitFamily, x: Rational): Rational | null {
  const m = limitModel(kind);
  if (sameR(x, m.a)) return m.at;
  if (kind === 'hole' || kind === 'patched') return addR(x, rational(1n));
  if (kind === 'jump') return rational(x[0] < x[1] ? 0n : 2n);
  return rational(x[0] < 0n ? -x[0] : x[0], x[1]);
}
export function cornerModel(aRaw: string, hRaw: string) {
  const a = calculusScalar(aRaw),
    h = calculusScalar(hRaw),
    b = addR(a, h),
    abs = (r: Rational) => rational(r[0] < 0n ? -r[0] : r[0], r[1]),
    fa = abs(a),
    fb = abs(b),
    average = h[0] ? divR(subtractR(fb, fa), h) : null;
  return {
    a,
    b,
    h,
    fa,
    fb,
    average,
    derivative: a[0] === 0n ? null : rational(a[0] < 0n ? -1n : 1n),
  };
}
export const derivativeRules = [
  { source: '7', derivative: '0' },
  { source: '3x-2', derivative: '3' },
  { source: 'x^2', derivative: '2x' },
  { source: 'x^3', derivative: '3x^2' },
  { source: 'x^4', derivative: '4x^3' },
  { source: '3x^3-2x+5', derivative: '9x^2-2' },
  { source: '(1/2)x^2-3x', derivative: 'x-3' },
];
export const derivativeText = (raw: string) =>
  polynomialText(differentiate(calculusPolynomial(raw)));
