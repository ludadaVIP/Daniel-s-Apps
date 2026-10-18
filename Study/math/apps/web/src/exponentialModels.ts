import {
  rational,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';

const one = rational(1n);
/** Small exact classroom inputs. No floating-point equality is used for powers. */
export function integerPower(base: Rational, exponent: number): Rational {
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 40)
    throw new RangeError('Use an integer exponent from -40 to 40');
  if (!base[0] && exponent <= 0)
    throw new RangeError('Zero needs a positive exponent');
  let value = one;
  for (let i = 0; i < Math.abs(exponent); i++) value = mulR(value, base);
  return exponent < 0 ? divR(one, value) : value;
}
function root(n: bigint, degree: number): bigint | null {
  let lo = 0n,
    hi = n + 1n;
  while (lo + 1n < hi) {
    const mid = (lo + hi) / 2n;
    if (mid ** BigInt(degree) <= n) lo = mid;
    else hi = mid;
  }
  return lo ** BigInt(degree) === n ? lo : null;
}
/** Positive bases only: avoids ambiguous real conventions for negative-base rational powers. */
export function rationalPower(
  base: Rational,
  exponent: Rational,
): Rational | null {
  if (
    base[0] <= 0n ||
    exponent[1] > 12n ||
    exponent[0] < -40n ||
    exponent[0] > 40n
  )
    throw new RangeError(
      'Positive base; reduced numerator -40..40 and denominator 1..12',
    );
  const n = root(base[0], Number(exponent[1])),
    d = root(base[1], Number(exponent[1]));
  if (n === null || d === null) return null; // irrational, never replace by a rounded rational
  return integerPower(rational(n, d), Number(exponent[0]));
}
export function validLogBase(a: Rational): boolean {
  return a[0] > 0n && !sameR(a, one);
}
function factor(n: bigint): Map<bigint, bigint> {
  const out = new Map<bigint, bigint>();
  for (let p = 2n; p * p <= n; p++) {
    while (n % p === 0n) {
      out.set(p, (out.get(p) ?? 0n) + 1n);
      n /= p;
    }
  }
  if (n > 1n) out.set(n, (out.get(n) ?? 0n) + 1n);
  return out;
}
function vector(r: Rational) {
  const f = factor(r[0]);
  for (const [p, e] of factor(r[1])) f.set(p, (f.get(p) ?? 0n) - e);
  return f;
}
/** Return a rational logarithm exactly when prime-exponent vectors are proportional. */
export function exactLog(base: Rational, value: Rational): Rational | null {
  if (!validLogBase(base) || value[0] <= 0n) throw new RangeError('Log domain');
  if ([...base, ...value].some((n) => n > 1000000n))
    throw new RangeError('Factoring limit');
  const a = vector(base),
    y = vector(value);
  const [p, e] = [...a].find(([, n]) => n !== 0n)!;
  const result = rational(y.get(p) ?? 0n, e);
  for (const prime of new Set([...a.keys(), ...y.keys()])) {
    if ((y.get(prime) ?? 0n) * result[1] !== (a.get(prime) ?? 0n) * result[0])
      return null;
  }
  return result;
}
export function exponentialAt(
  initial: Rational,
  multiplier: Rational,
  step: number,
): Rational {
  if (initial[0] <= 0n || multiplier[0] <= 0n)
    throw new RangeError('Positive quantities');
  return mulR(initial, integerPower(multiplier, step));
}
/** First whole step satisfying >= target (growth) or <= target (decay), verified exactly. */
export function firstWholeStep(
  initial: Rational,
  multiplier: Rational,
  target: Rational,
): number | null {
  if (initial[0] <= 0n || multiplier[0] <= 0n || target[0] <= 0n)
    throw new RangeError('Positive quantities');
  const growth = multiplier[0] >= multiplier[1];
  for (let k = 0; k <= 40; k++) {
    const v = exponentialAt(initial, multiplier, k);
    const delta = v[0] * target[1] - target[0] * v[1];
    if (growth ? delta >= 0n : delta <= 0n) return k;
  }
  return null;
}
export const asNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export function readPositive(raw: string): Rational {
  const r = readRational(raw);
  if (!r || r[0] <= 0n) throw new RangeError('Positive rational required');
  return r;
}
export const powerText = (base: string, exponent: number) =>
  textR(integerPower(readPositive(base), exponent));
