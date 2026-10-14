export type FractionValue = { n: number; d: number };
export function fractionValue(n: number, d: number): FractionValue {
  if (
    !Number.isSafeInteger(n) ||
    n < 0 ||
    n > 10000 ||
    !Number.isSafeInteger(d) ||
    d < 1 ||
    d > 10000
  )
    throw new RangeError(
      'Use bounded non-negative fractions with a positive denominator',
    );
  return { n, d };
}
export function fractionGcd(a: number, b: number): number {
  return b === 0 ? a : fractionGcd(b, a % b);
}
export function simplifyFraction(value: FractionValue): FractionValue {
  const { n, d } = fractionValue(value.n, value.d),
    factor = fractionGcd(n, d);
  return { n: n / factor, d: d / factor };
}
export function commonFractionFactors(value: FractionValue): number[] {
  const { n, d } = fractionValue(value.n, value.d);
  return Array.from(
    { length: Math.min(n || d, d) - 1 },
    (_, i) => i + 2,
  ).filter((k) => n % k === 0 && d % k === 0);
}
export function divideFraction(
  value: FractionValue,
  factor: number,
): FractionValue {
  const { n, d } = fractionValue(value.n, value.d);
  if (!Number.isInteger(factor) || factor < 1 || n % factor || d % factor)
    throw new RangeError('Divide both by a common positive factor');
  return { n: n / factor, d: d / factor };
}
export function refineFraction(
  value: FractionValue,
  factor: number,
): FractionValue {
  const { n, d } = fractionValue(value.n, value.d);
  if (!Number.isInteger(factor) || factor < 1 || factor > 24)
    throw new RangeError('Choose a positive integer refinement');
  return fractionValue(n * factor, d * factor);
}
export function fractionWholes(value: FractionValue) {
  const { n, d } = fractionValue(value.n, value.d);
  return Array.from({ length: Math.max(1, Math.ceil(n / d)) }, (_, i) => ({
    n: Math.max(0, Math.min(d, n - i * d)),
    d,
  }));
}
export function mixedFraction(value: FractionValue) {
  const { n, d } = fractionValue(value.n, value.d);
  return { whole: Math.floor(n / d), n: n % d, d };
}
export function improperFraction(
  whole: number,
  n: number,
  d: number,
): FractionValue {
  fractionValue(n, d);
  if (!Number.isSafeInteger(whole) || whole < 0 || n >= d)
    throw new RangeError('Mixed remainder must be proper');
  return fractionValue(whole * d + n, d);
}
export function compareFractions(left: FractionValue, right: FractionValue) {
  fractionValue(left.n, left.d);
  fractionValue(right.n, right.d);
  const diff = left.n * right.d - right.n * left.d;
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
}
export function commonDenominator(left: FractionValue, right: FractionValue) {
  fractionValue(left.n, left.d);
  fractionValue(right.n, right.d);
  const d = (left.d / fractionGcd(left.d, right.d)) * right.d;
  return {
    d,
    left: { n: left.n * (d / left.d), d },
    right: { n: right.n * (d / right.d), d },
  };
}
export function fractionKind(value: FractionValue) {
  const { n, d } = fractionValue(value.n, value.d);
  return n === 0 ? 'zero' : n < d ? 'proper' : 'improper';
}
