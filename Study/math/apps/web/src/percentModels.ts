export type Ratio = { n: number; d: number };
function integer(value: number, low: number, high: number) {
  if (!Number.isSafeInteger(value) || value < low || value > high)
    throw new RangeError('Use an integer within the workshop range');
}
export function ratio(n: number, d: number): Ratio {
  integer(n, 0, 100000000);
  integer(d, 1, 100000000);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
export function ratioText(v: Ratio) {
  const r = ratio(v.n, v.d);
  return r.d === 1 ? String(r.n) : `${r.n}/${r.d}`;
}
export function decimalText(v: Ratio): string | null {
  const r = ratio(v.n, v.d);
  let d = r.d;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  if (d !== 1) return null;
  // Long division: no floating point rounding or scientific notation.
  let remainder = r.n % r.d;
  let result = String(Math.floor(r.n / r.d));
  if (remainder) result += '.';
  while (remainder) {
    remainder *= 10;
    result += Math.floor(remainder / r.d);
    remainder %= r.d;
  }
  return result;
}
export function percentText(v: Ratio) {
  const coefficient = ratio(v.n * 100, v.d);
  const decimal = decimalText(coefficient);
  if (decimal !== null) return `${decimal}%`;
  const whole = Math.floor(coefficient.n / coefficient.d);
  const remainder = coefficient.n % coefficient.d;
  return `${whole ? `${whole} ` : ''}${remainder}/${coefficient.d}%`;
}
export function roundedPercent(v: Ratio, places = 1) {
  integer(places, 0, 3);
  const p = ratio(v.n * 100 * 10 ** places, v.d);
  const rounded = Math.floor((p.n * 2 + p.d) / (p.d * 2));
  return `${(rounded / 10 ** places).toFixed(places)}%`;
}
export function perHundred(selected: number, total: number) {
  integer(total, 1, 100);
  integer(selected, 0, total);
  const value = ratio(selected, total);
  return { selected, total, value, coefficient: ratio(selected * 100, total) };
}
export function decimalPercent(milli: number) {
  integer(milli, 0, 2000);
  const value = ratio(milli, 1000);
  return {
    milli,
    value,
    decimal: decimalText(value)!,
    percent: percentText(value),
  };
}
export function fractionPercent(n: number, d: number) {
  integer(d, 1, 12);
  integer(n, 0, 2 * d);
  const value = ratio(n, d);
  return {
    value,
    coefficient: ratio(n * 100, d),
    exact: percentText(value),
    approximate: roundedPercent(value),
  };
}
export function percentCells(value: Ratio) {
  const v = ratio(value.n, value.d);
  if (v.n > 2 * v.d)
    throw new RangeError('At most two reference wholes fit this grid');
  const frames = Math.max(1, Math.ceil(v.n / v.d));
  return {
    frames,
    cells: Array.from({ length: frames * 100 }, (_, i) => ({
      index: i,
      frame: Math.floor(i / 100),
      x: i % 10,
      y: Math.floor((i % 100) / 10),
      filled: Math.max(0, Math.min(v.d, 100 * v.n - i * v.d)) / v.d,
    })),
  };
}
export function percentOf(whole: number, rate: number) {
  integer(whole, 0, 200);
  integer(rate, 0, 150);
  return {
    whole,
    rate,
    one: ratio(whole, 100),
    amount: ratio(whole * rate, 100),
  };
}
export function wholeFromPercent(part: number, rate: number) {
  integer(part, 0, 100);
  integer(rate, 0, 150);
  if (rate === 0)
    return { kind: part === 0 ? 'undetermined' : 'inconsistent' } as const;
  if (part === 0) return { kind: 'zero-whole' } as const;
  return {
    kind: 'unique',
    one: ratio(part, rate),
    whole: ratio(part * 100, rate),
  } as const;
}
export function priceChange(
  cents: number,
  rate: number,
  direction: 'discount' | 'increase',
) {
  integer(cents, 0, 50000);
  integer(rate, 0, 100);
  if (direction !== 'discount' && direction !== 'increase')
    throw new RangeError('Choose a price direction');
  const change = (cents * rate) / 100;
  if (!Number.isInteger(change))
    throw new RangeError(
      'This price model requires exact whole cents; no silent rounding',
    );
  return {
    cents,
    rate,
    direction,
    change,
    next: cents + (direction === 'increase' ? change : -change),
  };
}
export const moneyText = (cents: number) => {
  integer(cents, 0, 100000);
  return `NZ$${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
};
