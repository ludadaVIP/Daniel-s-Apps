import { t } from './model';
export const decimalPlaceNames = [
  t('个位', 'Ones'),
  t('十分位', 'Tenths'),
  t('百分位', 'Hundredths'),
  t('千分位', 'Thousandths'),
];
export const decimalUnits = [1000, 100, 10, 1] as const;
export function formatMilli(value: number, trim = false): string {
  if (!Number.isSafeInteger(value))
    throw new RangeError('Use integer thousandths');
  const magnitude = Math.abs(value),
    fraction = String(magnitude % 1000).padStart(3, '0');
  const result = `${value < 0 ? '-' : ''}${Math.floor(magnitude / 1000)}.${fraction}`;
  return trim ? result.replace(/\.?0+$/, '') : result;
}
export function decimalDigits(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 9999)
    throw new RangeError('Chart supports zero to 9.999');
  return decimalUnits.map((unit, i) => ({
    digit: Math.floor(value / unit) % 10,
    unit,
    name: decimalPlaceNames[i]!,
    contribution: (Math.floor(value / unit) % 10) * unit,
  }));
}
export function roundMilli(value: number, digits: 0 | 1 | 2) {
  if (!Number.isSafeInteger(value) || value < 0 || ![0, 1, 2].includes(digits))
    throw new RangeError('Rounding requires non-negative integer thousandths');
  const step = 10 ** (3 - digits),
    lower = Math.floor(value / step) * step;
  return value - lower < step / 2 ? lower : lower + step;
}
export function firstDifferentDecimal(a: number, b: number) {
  const left = decimalDigits(a),
    right = decimalDigits(b);
  return left.findIndex((p, i) => p.digit !== right[i]!.digit);
}
export type DecimalColumn = {
  place: number;
  left: number;
  right: number;
  incoming: number;
  raw: number;
  digit: number;
  outgoing: number;
};
export function decimalColumns(
  a: number,
  b: number,
  operation: 'add' | 'subtract',
) {
  const left = decimalDigits(a),
    right = decimalDigits(b);
  if (operation === 'subtract' && a < b)
    throw new RangeError(
      'This subtraction model uses non-negative differences',
    );
  if (operation === 'add' && a + b > 9999)
    throw new RangeError('Chart result exceeds the ones place');
  const columns: DecimalColumn[] = [];
  let incoming = 0;
  for (let i = 3; i >= 0; i--) {
    const raw =
      operation === 'add'
        ? left[i]!.digit + right[i]!.digit + incoming
        : left[i]!.digit - right[i]!.digit - incoming;
    const digit = operation === 'add' ? raw % 10 : raw < 0 ? raw + 10 : raw;
    const outgoing =
      operation === 'add' ? Math.floor(raw / 10) : raw < 0 ? 1 : 0;
    columns.push({
      place: i,
      left: left[i]!.digit,
      right: right[i]!.digit,
      incoming,
      raw,
      digit,
      outgoing,
    });
    incoming = outgoing;
  }
  return { result: operation === 'add' ? a + b : a - b, columns };
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
export function decimalDivision(milli: number, groups: number) {
  if (
    !Number.isSafeInteger(milli) ||
    milli < 0 ||
    !Number.isInteger(groups) ||
    groups < 1 ||
    groups > 100
  )
    throw new RangeError('Invalid equal-sharing model');
  const denominator = 1000 * groups,
    factor = gcd(milli, denominator),
    numerator = milli / factor,
    reducedDenominator = denominator / factor;
  return {
    numerator,
    denominator: reducedDenominator,
    exact: `${numerator}/${reducedDenominator}`,
    exactAtThousandths: milli % groups === 0,
    wholeThousandths: Math.floor(milli / groups),
    remainder: milli % groups,
    roundedThousandths: Math.floor(milli / groups + 0.5),
  };
}
export function shoppingModel(
  priceCents: number,
  count: number,
  budgetCents: number,
) {
  if (
    ![priceCents, count, budgetCents].every(
      (v) => Number.isSafeInteger(v) && v >= 0,
    )
  )
    throw new RangeError('Use non-negative integer cents and counts');
  const total = priceCents * count,
    estimate = Math.floor((priceCents + 5) / 10) * 10 * count;
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(estimate))
    throw new RangeError('Money total exceeds the integer model');
  return {
    total,
    estimate,
    change: budgetCents - total,
    shortfall: Math.max(0, total - budgetCents),
  };
}
