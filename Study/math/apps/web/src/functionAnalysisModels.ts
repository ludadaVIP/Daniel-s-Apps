import {
  rational,
  addR,
  mulR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import {
  calculusPolynomial,
  calculusScalar,
  differentiate,
  valueAt,
  asNumber,
} from './calculusModels';
import {
  plusP,
  timesP,
  polynomialText,
  type Polynomial,
} from './polynomialModels';
export type AnalysisCode =
  | 'increasing'
  | 'decreasing'
  | 'constant'
  | 'local-max'
  | 'local-min'
  | 'neither';
const aliases: Record<AnalysisCode, string[]> = {
  increasing: ['increasing', '递增'],
  decreasing: ['decreasing', '递减'],
  constant: ['constant', '恒定'],
  'local-max': ['local-max', '局部极大'],
  'local-min': ['local-min', '局部极小'],
  neither: ['neither', '两者都不是'],
};
export const checkAnalysisCode = (raw: string, value: AnalysisCode) =>
  aliases[value].includes(raw.trim().toLowerCase());
export const signR = (r: Rational) => (r[0] < 0n ? -1 : r[0] > 0n ? 1 : 0);
export type AnalysisFamily =
  | 'cubic-turn'
  | 'cubic-flat'
  | 'square'
  | 'negative-square'
  | 'constant'
  | 'corner';
export const analysisFamilies: AnalysisFamily[] = [
  'cubic-turn',
  'cubic-flat',
  'square',
  'negative-square',
  'constant',
  'corner',
];
export function shapeModel(kind: AnalysisFamily) {
  if (!analysisFamilies.includes(kind))
    throw new RangeError('Known analysis family');
  const raw =
    kind === 'cubic-turn'
      ? 'x^3-3x'
      : kind === 'cubic-flat'
        ? 'x^3'
        : kind === 'square'
          ? 'x^2'
          : kind === 'negative-square'
            ? '-x^2'
            : kind === 'constant'
              ? '2'
              : 'x';
  const p = calculusPolynomial(raw),
    derivative = differentiate(p);
  const critical =
    kind === 'constant' ? [] : kind === 'cubic-turn' ? [-1, 1] : [0];
  const intervals: [string, string, AnalysisCode][] =
    kind === 'cubic-turn'
      ? [
          ['(−∞,−1)', '+', 'increasing'],
          ['(−1,1)', '−', 'decreasing'],
          ['(1,∞)', '+', 'increasing'],
        ]
      : kind === 'cubic-flat'
        ? [
            ['(−∞,0)', '+', 'increasing'],
            ['(0,∞)', '+', 'increasing'],
          ]
        : kind === 'constant'
          ? [['ℝ', '0', 'constant']]
          : kind === 'negative-square'
            ? [
                ['(−∞,0)', '+', 'increasing'],
                ['(0,∞)', '−', 'decreasing'],
              ]
            : [
                ['(−∞,0)', '−', 'decreasing'],
                ['(0,∞)', '+', 'increasing'],
              ];
  const value = (x: Rational) =>
    kind === 'corner'
      ? rational(x[0] < 0n ? -x[0] : x[0], x[1])
      : valueAt(p, x);
  const slope = (x: Rational) =>
    kind === 'corner'
      ? x[0] === 0n
        ? null
        : rational(x[0] < 0n ? -1n : 1n)
      : valueAt(derivative, x);
  const classification = (x: number): AnalysisCode =>
    kind === 'constant'
      ? 'neither'
      : !critical.includes(x)
        ? 'neither'
        : kind === 'cubic-flat'
          ? 'neither'
          : kind === 'cubic-turn'
            ? x === -1
              ? 'local-max'
              : 'local-min'
            : kind === 'negative-square'
              ? 'local-max'
              : 'local-min';
  return {
    kind,
    raw: kind === 'corner' ? '|x|' : raw,
    p,
    derivative,
    critical,
    intervals,
    value,
    slope,
    classification,
  };
}
export function closedExtrema(
  kind: AnalysisFamily,
  leftRaw: string,
  rightRaw: string,
) {
  const m = shapeModel(kind),
    left = calculusScalar(leftRaw),
    right = calculusScalar(rightRaw);
  if (asNumber(left) >= asNumber(right))
    throw new RangeError('Increasing closed interval');
  const xs = [
    left,
    ...m.critical
      .filter((x) => x > asNumber(left) && x < asNumber(right))
      .map((x) => rational(BigInt(x))),
    right,
  ];
  const candidates = xs.map((x) => ({ x, y: m.value(x) }));
  let min = candidates[0]!.y,
    max = min;
  for (const c of candidates) {
    if (signR(addR(c.y, mulR(min, rational(-1n)))) < 0) min = c.y;
    if (signR(addR(c.y, mulR(max, rational(-1n)))) > 0) max = c.y;
  }
  return {
    m,
    left,
    right,
    candidates,
    min,
    max,
    minAt: candidates.filter((c) => sameR(c.y, min)).map((c) => textR(c.x)),
    maxAt: candidates.filter((c) => sameR(c.y, max)).map((c) => textR(c.x)),
    allMin: kind === 'constant',
    allMax: kind === 'constant',
  };
}
export function productModel(uRaw: string, vRaw: string, aRaw: string) {
  const u = calculusPolynomial(uRaw),
    v = calculusPolynomial(vRaw),
    a = calculusScalar(aRaw),
    du = differentiate(u),
    dv = differentiate(v);
  const p = timesP(u, v),
    first = timesP(du, v),
    second = timesP(u, dv),
    derivative = plusP(first, second);
  return {
    u,
    v,
    a,
    p,
    du,
    dv,
    first,
    second,
    derivative,
    value: valueAt(p, a),
    rate: valueAt(derivative, a),
    wrong: valueAt(timesP(du, dv), a),
  };
}
function power(p: Polynomial, n: number) {
  let result: Polynomial = new Map([['', rational(1n)]]);
  for (let i = 0; i < n; i++) result = timesP(result, p);
  return result;
}
export function chainModel(innerRaw: string, n: number, aRaw: string) {
  if (!Number.isInteger(n) || n < 1 || n > 4)
    throw new RangeError('Positive integer outer power up to four');
  const inner = calculusPolynomial(innerRaw),
    a = calculusScalar(aRaw),
    innerDerivative = differentiate(inner),
    p = power(inner, n),
    outer = timesP(new Map([['', rational(BigInt(n))]]), power(inner, n - 1)),
    derivative = timesP(outer, innerDerivative);
  return {
    inner,
    a,
    n,
    p,
    outer,
    innerDerivative,
    derivative,
    innerValue: valueAt(inner, a),
    value: valueAt(p, a),
    rate: valueAt(derivative, a),
    outerValue: valueAt(outer, a),
    innerRate: valueAt(innerDerivative, a),
  };
}
export type RateScenario = 'position' | 'area';
export function appliedRateModel(kind: RateScenario, tRaw: string) {
  if (!['position', 'area'].includes(kind))
    throw new RangeError('Known rate scenario');
  const t = calculusScalar(tRaw),
    p = calculusPolynomial(kind === 'position' ? 'x^2-4x+3' : '(1+2x)^2'),
    derivative = differentiate(p),
    end = kind === 'position' ? 4 : 3,
    inside = t[0] >= 0n && t[0] <= BigInt(end) * t[1];
  const algebraicRate = valueAt(derivative, t);
  return {
    kind,
    t,
    p,
    derivative,
    end,
    inside,
    value: inside ? valueAt(p, t) : null,
    rate: inside ? algebraicRate : null,
    algebraicRate,
    speed:
      kind === 'position' && inside
        ? rational(
            algebraicRate[0] < 0n ? -algebraicRate[0] : algebraicRate[0],
            algebraicRate[1],
          )
        : null,
    unit: kind === 'position' ? 'm/s' : 'm²/s',
  };
}
export const analysisPolynomialText = polynomialText;
