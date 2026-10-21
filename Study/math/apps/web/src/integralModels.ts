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
import { parsePolynomial, type Polynomial } from './polynomialModels';
import { readRational } from './rationalModels';
import { valueAt, differentiate, asNumber } from './calculusModels';
import { compareR } from './inequalityModels';
const Z = rational(0n),
  ONE = rational(1n),
  R = readRational,
  sub = (a: Rational, b: Rational) => addR(a, negR(b));
export const integralCases = {
  square: { raw: 'x^2', roots: ['0'], critical: ['0'] },
  line: { raw: 'x', roots: ['0'], critical: [] },
  arch: { raw: '4-x^2', roots: ['-2', '2'], critical: ['0'] },
  shiftSquare: { raw: '(x-1)^2', roots: ['1'], critical: ['1'] },
  crossLine: { raw: 'x-1', roots: ['1'], critical: [] },
  descending: { raw: '2-x', roots: ['2'], critical: [] },
  negativeSquare: { raw: '-x^2', roots: ['0'], critical: ['0'] },
  gap: { raw: '2x-x^2', roots: ['0', '2'], critical: ['1'] },
  rising: { raw: '2x', roots: ['0'], critical: [] },
  motion: { raw: 'x-2', roots: ['2'], critical: [] },
  zero: { raw: '0', roots: [], critical: [] },
  cubic: { raw: 'x^3', roots: ['0'], critical: ['0'] },
} as const;
export type IntegralFamily = keyof typeof integralCases;
function scalar(raw: string) {
  const x = R(raw);
  if (compareR(x, rational(-12n)) < 0 || compareR(x, rational(12n)) > 0)
    throw new RangeError('Bounded integration scalar');
  return x;
}
export function integralPolynomial(raw: string) {
  const p = parsePolynomial(raw);
  if (
    !p ||
    [...p].some(
      ([key, c]) =>
        key.length > 3 ||
        compareR(c, rational(-12n)) < 0 ||
        compareR(c, rational(12n)) > 0 ||
        c[1] > 1000n,
    )
  )
    throw new RangeError(
      'Bounded integrand polynomial of degree at most three',
    );
  return p;
}
export function antiderivativePolynomial(p: Polynomial): Polynomial {
  if ([...p.keys()].some((key) => !/^[x]{0,3}$/.test(key)))
    throw new RangeError('Univariate degree at most three');
  return new Map(
    [...p].map(([key, c]) => [
      key + 'x',
      divR(c, rational(BigInt(key.length + 1))),
    ]),
  );
}
export function polynomialIntegral(p: Polynomial, a: Rational, b: Rational) {
  const F = antiderivativePolynomial(p);
  return sub(valueAt(F, b), valueAt(F, a));
}
export type PrimitiveCondition = { x: string; value: string };
export function checkIntegralPrimitive(
  raw: string,
  integrand: string,
  fullFamily: boolean,
  initial?: PrimitiveCondition,
): boolean {
  try {
    const f = integralPolynomial(integrand),
      p = parsePolynomial(
        raw.replace(/C/g, 'c'),
        fullFamily ? ['x', 'c'] : ['x'],
      );
    if (!p) return false;
    if (fullFamily) {
      if (
        initial ||
        !p.get('c')?.[0] ||
        [...p.keys()].some((key) => key.includes('c') && key !== 'c')
      )
        return false;
    }
    const xPart = new Map([...p].filter(([key]) => key !== 'c')),
      d = differentiate(xPart);
    if (
      d.size !== f.size ||
      ![...f].every(([key, c]) => d.has(key) && sameR(c, d.get(key)!))
    )
      return false;
    return (
      !initial || sameR(valueAt(xPart, scalar(initial.x)), R(initial.value))
    );
  } catch {
    return false;
  }
}
function familyData(kind: IntegralFamily) {
  if (!Object.prototype.hasOwnProperty.call(integralCases, kind))
    throw new RangeError('Known integration family');
  const s = integralCases[kind];
  return { ...s, p: integralPolynomial(s.raw) };
}
export type RiemannTag = 'left' | 'middle' | 'right';
export function uniformPartition(aRaw: string, bRaw: string, n: number) {
  const a = scalar(aRaw),
    b = scalar(bRaw);
  if (compareR(a, b) >= 0 || !Number.isSafeInteger(n) || n < 1 || n > 32)
    throw new RangeError('Increasing interval and one to thirty-two cells');
  return Array.from({ length: n + 1 }, (_, i) =>
    textR(addR(a, mulR(sub(b, a), rational(BigInt(i), BigInt(n))))),
  );
}
export function riemannAudit(
  kind: IntegralFamily,
  edges: string[],
  tag: RiemannTag,
) {
  const m = familyData(kind);
  if (
    !['left', 'middle', 'right'].includes(tag) ||
    edges.length < 2 ||
    edges.length > 33
  )
    throw new RangeError('Bounded partition and known tags');
  const xs = edges.map(scalar);
  if (xs.some((x, i) => i > 0 && compareR(xs[i - 1]!, x) >= 0))
    throw new RangeError('Strictly increasing partition');
  const cells = xs.slice(1).map((right, i) => {
    const left = xs[i]!,
      width = sub(right, left),
      sample =
        tag === 'left'
          ? left
          : tag === 'right'
            ? right
            : divR(addR(left, right), rational(2n)),
      height = valueAt(m.p, sample),
      critical = m.critical
        .map(R)
        .filter((x) => compareR(x, left) > 0 && compareR(x, right) < 0),
      values = [left, ...critical, right].map((x) => valueAt(m.p, x));
    let low = values[0]!,
      high = low;
    for (const v of values) {
      if (compareR(v, low) < 0) low = v;
      if (compareR(v, high) > 0) high = v;
    }
    return {
      left,
      right,
      width,
      sample,
      height,
      product: mulR(width, height),
      low,
      high,
    };
  });
  const sum = cells.reduce((s, c) => addR(s, c.product), Z),
    lower = cells.reduce((s, c) => addR(s, mulR(c.width, c.low)), Z),
    upper = cells.reduce((s, c) => addR(s, mulR(c.width, c.high)), Z),
    mesh = cells
      .map((c) => c.width)
      .reduce((a, b) => (compareR(a, b) >= 0 ? a : b)),
    exact = polynomialIntegral(m.p, xs[0]!, xs.at(-1)!);
  return {
    kind,
    raw: m.raw,
    p: m.p,
    tag,
    edges: xs,
    cells,
    sum,
    lower,
    upper,
    mesh,
    exact,
    error: sub(sum, exact),
  };
}
export function integralAudit(
  kind: IntegralFamily,
  aRaw: string,
  bRaw: string,
) {
  const m = familyData(kind),
    a = scalar(aRaw),
    b = scalar(bRaw),
    orientation = compareR(b, a),
    lo = orientation >= 0 ? a : b,
    hi = orientation >= 0 ? b : a,
    roots = m.roots
      .map(R)
      .filter((x) => compareR(x, lo) > 0 && compareR(x, hi) < 0),
    cuts = [lo, ...roots, hi].sort(compareR);
  const pieces =
      orientation === 0
        ? []
        : cuts.slice(1).map((right, i) => {
            const left = cuts[i]!,
              signed = polynomialIntegral(m.p, left, right),
              area = rational(
                signed[0] < 0n ? -signed[0] : signed[0],
                signed[1],
              );
            return { left, right, signed, area, positive: signed[0] >= 0n };
          }),
    positive = pieces
      .filter((p) => p.signed[0] >= 0n)
      .reduce((s, p) => addR(s, p.area), Z),
    negative = pieces
      .filter((p) => p.signed[0] < 0n)
      .reduce((s, p) => addR(s, p.area), Z),
    magnitude = addR(positive, negative),
    signed = polynomialIntegral(m.p, a, b);
  return {
    kind,
    raw: m.raw,
    p: m.p,
    a,
    b,
    lo,
    hi,
    orientation,
    pieces,
    positive,
    negative,
    magnitude,
    signed,
  };
}
export function stepAccumulation(tRaw: string, rates = [2, 4, 1]) {
  const t = scalar(tRaw);
  if (
    compareR(t, Z) < 0 ||
    compareR(t, rational(4n)) > 0 ||
    rates.length !== 3 ||
    rates.some((n) => !Number.isSafeInteger(n) || n < 0 || n > 8)
  )
    throw new RangeError('Step rates and time zero through four');
  const ends = [0, 1, 3, 4],
    pieces = rates.map((q, i) => {
      const left = rational(BigInt(ends[i]!)),
        right = rational(BigInt(ends[i + 1]!)),
        until =
          compareR(t, left) <= 0 ? left : compareR(t, right) >= 0 ? right : t,
        width = sub(until, left);
      return {
        left,
        right,
        until,
        width,
        rate: rational(BigInt(q)),
        amount: mulR(width, rational(BigInt(q))),
      };
    }),
    amount = pieces.reduce((s, p) => addR(s, p.amount), Z),
    index = compareR(t, ONE) < 0 ? 0 : compareR(t, rational(3n)) < 0 ? 1 : 2,
    current = rational(BigInt(rates[index]!)),
    leftRate = sameR(t, ONE)
      ? rational(BigInt(rates[0]!))
      : sameR(t, rational(3n))
        ? rational(BigInt(rates[1]!))
        : current;
  return {
    t,
    rates,
    pieces,
    amount,
    current,
    leftRate,
    average: t[0] ? divR(amount, t) : null,
  };
}
export function ftcAudit(
  kind: IntegralFamily | 'step',
  lowerRaw: string,
  xRaw: string,
  k = 1,
) {
  if (![1, 2].includes(k)) throw new RangeError('Inner coefficient one or two');
  const x = scalar(xRaw),
    lower = scalar(lowerRaw),
    upper = mulR(rational(BigInt(k)), x);
  scalar(textR(upper));
  if (kind === 'step') {
    const at = stepAccumulation(textR(upper)),
      start = stepAccumulation(textR(lower));
    if (compareR(upper, Z) <= 0 || compareR(upper, rational(4n)) >= 0)
      throw new RangeError('FTC point inside step domain');
    const value = sub(at.amount, start.amount),
      left = mulR(at.leftRate, rational(BigInt(k))),
      right = mulR(at.current, rational(BigInt(k)));
    return {
      kind,
      x,
      lower,
      upper,
      k,
      value,
      integrand: at.current,
      left,
      right,
      derivative: sameR(left, right) ? right : null,
    };
  }
  const m = familyData(kind),
    value = polynomialIntegral(m.p, lower, upper),
    integrand = valueAt(m.p, upper),
    derivative = mulR(integrand, rational(BigInt(k)));
  return {
    kind,
    x,
    lower,
    upper,
    k,
    value,
    integrand,
    left: derivative,
    right: derivative,
    derivative,
  };
}
export type IntegralApplication = 'motion' | 'flow' | 'between';
export function applicationAudit(
  scenario: IntegralApplication,
  extended = false,
  initial = 0,
) {
  if (
    !['motion', 'flow', 'between'].includes(scenario) ||
    !Number.isSafeInteger(initial) ||
    initial < 0 ||
    initial > 20
  )
    throw new RangeError('Known integration application');
  const interval =
      scenario === 'motion'
        ? ['0', extended ? '4' : '5']
        : scenario === 'flow'
          ? ['0', extended ? '2' : '3']
          : extended
            ? ['-1', '3']
            : ['0', '2'],
    kind: IntegralFamily =
      scenario === 'motion' ? 'motion' : scenario === 'flow' ? 'rising' : 'gap',
    m = integralAudit(kind, interval[0]!, interval[1]!);
  return {
    ...m,
    scenario,
    initial,
    final:
      scenario === 'between' ? null : addR(rational(BigInt(initial)), m.signed),
    mean: divR(m.signed, sub(m.b, m.a)),
    meanMagnitude: divR(m.magnitude, sub(m.b, m.a)),
  };
}
export const integrationNumber = asNumber;
