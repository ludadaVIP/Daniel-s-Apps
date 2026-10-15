import { exactRational } from './model';
import { ratio } from './percentModels';
const bound = (n: number, min: number, max: number) => {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Quantity outside the ratio workshop range');
};
const whole = (n: number, min: number, max: number) => {
  bound(n, min, max);
  if (!Number.isSafeInteger(n)) throw new RangeError('Use whole counts');
};
export const commonFactor = (a: number, b: number): number =>
  b ? commonFactor(b, a % b) : a;
export function orderedRatio(a: number, b: number) {
  whole(a, 0, 1000);
  whole(b, 1, 1000);
  const g = commonFactor(a, b);
  return {
    a,
    b,
    total: a + b,
    value: ratio(a, b),
    firstOfTotal: ratio(a, a + b),
    simple: [a / g, b / g] as const,
  };
}
export function ratioTerms(raw: string) {
  const terms = raw.trim().replace(/：/g, ':').split(':');
  if (
    terms.length !== 2 ||
    terms.some((s) => s.includes('%') || s.includes('％'))
  )
    return null;
  const a = exactRational(terms[0]!),
    b = exactRational(terms[1]!);
  if (!a || !b || a[0] < 0n || a[1] <= 0n || b[0] <= 0n || b[1] <= 0n)
    return null;
  return { a, b };
}
export function simplifyRatio(raw: string) {
  const r = ratioTerms(raw);
  if (!r)
    throw new RangeError(
      'Use an ordered ratio with non-negative first and positive second term',
    );
  const a = Number(r.a[0] * r.b[1]),
    b = Number(r.b[0] * r.a[1]);
  whole(a, 0, 10000);
  whole(b, 1, 10000);
  const denominatorGcd = commonFactor(Number(r.a[1]), Number(r.b[1]));
  const denominator = Number(r.a[1] * r.b[1]) / denominatorGcd;
  const first = (Number(r.a[0]) * denominator) / Number(r.a[1]);
  const second = (Number(r.b[0]) * denominator) / Number(r.b[1]);
  const g = commonFactor(first, second);
  return {
    first,
    second,
    denominator,
    gcd: g,
    simple: [first / g, second / g] as const,
  };
}
export function reduceBy(a: number, b: number, divisor: number) {
  orderedRatio(a, b);
  whole(divisor, 1, 1000);
  if (a % divisor || b % divisor) return { kind: 'invalid' } as const;
  const first = a / divisor,
    second = b / divisor;
  return {
    kind: commonFactor(first, second) === 1 ? 'simplest' : 'equivalent',
    first,
    second,
  } as const;
}
export function allocateRatio(total: number, a: number, b: number) {
  whole(total, 0, 100);
  whole(a, 1, 12);
  whole(b, 1, 12);
  return {
    total,
    a,
    b,
    parts: a + b,
    each: ratio(total, a + b),
    first: ratio(total * a, a + b),
    second: ratio(total * b, a + b),
  };
}
export function ratioTable(a: number, b: number) {
  whole(a, 1, 8);
  whole(b, 1, 8);
  return [1, 2, 3, 4].map((factor) => ({
    factor,
    x: a * factor,
    y: b * factor,
  }));
}
export function checkRatioPair(a: number, b: number, x: number, y: number) {
  whole(a, 1, 8);
  whole(b, 1, 8);
  whole(x, 0, 48);
  whole(y, 0, 48);
  return x === 0 && y === 0
    ? 'origin'
    : b * x === a * y
      ? 'equivalent'
      : 'different';
}
export function mapScale(
  horizontal: number,
  vertical: number,
  scale: number,
  zoom: number = 1,
) {
  bound(horizontal, 0, 8);
  bound(vertical, 0, 8);
  whole(scale, 1000, 200000);
  if (
    ![1, 2].includes(zoom) ||
    !Number.isInteger(horizontal * 2) ||
    !Number.isInteger(vertical * 2)
  )
    throw new RangeError(
      'Use half-centimetre original-map coordinates and a supported zoom',
    );
  const route = horizontal + vertical;
  const realCm = ratio(Math.round(route * 2) * scale, 2);
  const realM = ratio(realCm.n, realCm.d * 100),
    realKm = ratio(realCm.n, realCm.d * 100000);
  return {
    horizontal,
    vertical,
    route,
    scale,
    zoom,
    realCm,
    realM,
    realKm,
    pixelsPerOriginalCm: 40 * zoom,
    printedScale: scale / zoom,
    barKm: ratio(2 * scale, 100000),
  };
}
export type CurveKind = 'direct' | 'fee' | 'square';
export function costCurve(kind: CurveKind, rate: number) {
  if (!['direct', 'fee', 'square'].includes(kind))
    throw new RangeError('Unknown relationship');
  whole(rate, 1, 5);
  const amount = (x: number) => {
    bound(x, 0, 8);
    return kind === 'square' ? x * x : rate * x + (kind === 'fee' ? 4 : 0);
  };
  const points = Array.from({ length: 17 }, (_, i) => ({
    x: i / 2,
    y: amount(i / 2),
  }));
  const rates = [1, 2, 4].map((x) => ({
    x,
    y: amount(x),
    perLitre: ratio(Math.round(amount(x) * 2), x * 2),
  }));
  return {
    kind,
    rate,
    points,
    rates,
    atZero: amount(0),
    proportional: kind === 'direct',
    minimumY: amount(8) <= 40 ? 40 : 80,
  };
}
export function graphCoordinates(
  points: { x: number; y: number }[],
  maxY: number,
) {
  if (![40, 80, 160].includes(maxY))
    throw new RangeError('Choose a labelled graph range');
  return points.map((p) => {
    bound(p.x, 0, 8);
    bound(p.y, 0, maxY);
    return { ...p, px: 60 + p.x * 55, py: 300 - (p.y / maxY) * 240 };
  });
}
