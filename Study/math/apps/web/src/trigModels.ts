import { addR, divR, mulR, textR, sameR, type Rational } from './algebraModels';
import { readRootLength } from './pythagoreanModels';
import { principalRadical, radicalText, readRadical } from './radicalModels';
import { positiveS, numberS } from './similarityModels';
import { readRational } from './rationalModels';
export type TrigFunction = 'sin' | 'cos' | 'tan';
export type TrigReference = 'A' | 'B';
export function checkTrigFunction(raw: string, wanted: TrigFunction) {
  const aliases: Record<TrigFunction, string[]> = {
    sin: ['sin', 'sine', '正弦'],
    cos: ['cos', 'cosine', '余弦'],
    tan: ['tan', 'tangent', '正切'],
  };
  return aliases[wanted].includes(raw.trim().toLowerCase());
}
export function trigTriangle(
  adjacent: string,
  opposite: string,
  reference: TrigReference = 'A',
  scale = '1',
) {
  const x = readRootLength(adjacent),
    y = readRootLength(opposite),
    k = positiveS(scale, 3);
  if (
    !x ||
    !y ||
    x[0] <= 0n ||
    y[0] <= 0n ||
    numberS(x) > 900 ||
    numberS(y) > 900 ||
    !['A', 'B'].includes(reference)
  )
    throw new RangeError(
      'Positive bounded right-triangle legs and A/B reference',
    );
  const h = addR(x, y),
    opp = reference === 'A' ? y : x,
    adj = reference === 'A' ? x : y,
    ratio = (f: TrigFunction) =>
      f === 'tan'
        ? radicalText(principalRadical(divR(opp, adj)))
        : radicalText(principalRadical(divR(f === 'sin' ? opp : adj, h))),
    size = (r: Rational) => radicalText(principalRadical(mulR(r, mulR(k, k))));
  return {
    reference,
    scale: k,
    adjacentSquare: adj,
    oppositeSquare: opp,
    hypotenuseSquare: h,
    ratio,
    sizes: { AC: size(x), BC: size(y), AB: size(h) },
    roles: {
      opposite: reference === 'A' ? 'BC' : 'AC',
      adjacent: reference === 'A' ? 'AC' : 'BC',
      hypotenuse: 'AB',
    },
    points: {
      A: { x: 0, y: 0 },
      C: { x: Math.sqrt(numberS(x)) * numberS(k), y: 0 },
      B: {
        x: Math.sqrt(numberS(x)) * numberS(k),
        y: Math.sqrt(numberS(y)) * numberS(k),
      },
    },
  };
}
export const trigTriangles = [
  { id: '3-4-5', adjacent: '4', opposite: '3' },
  { id: '5-12-13', adjacent: '12', opposite: '5' },
  { id: '8-15-17', adjacent: '8', opposite: '15' },
  { id: '45°', adjacent: '1', opposite: '1' },
  { id: '30°', adjacent: '√3', opposite: '1' },
  { id: '60°', adjacent: '1', opposite: '√3' },
];
export function trigValues(degrees: number) {
  if (!Number.isFinite(degrees) || degrees < 0 || degrees > 90)
    throw new RangeError('Use 0≤degrees≤90');
  const special: Record<number, [number, number, number | null]> = {
    0: [0, 1, 0],
    30: [0.5, Math.sqrt(3) / 2, Math.sqrt(3) / 3],
    45: [Math.sqrt(2) / 2, Math.sqrt(2) / 2, 1],
    60: [Math.sqrt(3) / 2, 0.5, Math.sqrt(3)],
    90: [1, 0, null],
  };
  const exact = special[degrees],
    r = (degrees * Math.PI) / 180;
  return {
    degrees,
    sin: exact?.[0] ?? Math.sin(r),
    cos: exact?.[1] ?? Math.cos(r),
    tan: degrees === 90 ? null : (exact?.[2] ?? Math.tan(r)),
    acute: degrees > 0 && degrees < 90,
  };
}
export function radicalNumber(raw: string) {
  const v = readRadical(raw);
  if (!v) throw new RangeError('Exact bounded numerical radical');
  return [...v].reduce(
    (s, [rad, r]) => s + Math.sqrt(Number(rad)) * numberS(r),
    0,
  );
}
export function inverseTrig(f: TrigFunction, ratio: string) {
  if (!['sin', 'cos', 'tan'].includes(f))
    throw new RangeError('Known trig function');
  const value = radicalNumber(ratio);
  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    (f !== 'tan' && value >= 1) ||
    value > 100
  )
    throw new RangeError('Ratio must determine an acute angle');
  const degrees =
    ((f === 'sin'
      ? Math.asin(value)
      : f === 'cos'
        ? Math.acos(value)
        : Math.atan(value)) *
      180) /
    Math.PI;
  return {
    function: f,
    ratio,
    value,
    degrees,
    radians: (degrees * Math.PI) / 180,
  };
}
/** School calculator output: bounded positive quantities, at most four decimal places.
 * A few machine ulps correct binary representations of exact halfway inputs. */
export function roundTrig(value: number, places: number) {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    value > 10000 ||
    !Number.isInteger(places) ||
    places < 0 ||
    places > 4
  )
    throw new RangeError('Bounded nonnegative quantity and 0–4 decimal places');
  const factor = 10 ** places,
    scaled = value * factor,
    rounded =
      Math.floor(scaled + 0.5 + Number.EPSILON * Math.max(1, scaled) * 4) /
      factor;
  return rounded.toFixed(places);
}
export type TrigRoundedUnit = '°' | 'm' | '%';
function trigQuantityText(raw: string, unit?: TrigRoundedUnit) {
  const ends: Record<TrigRoundedUnit, RegExp> = {
    '°': /\s*(?:°|degrees?|deg|度)$/i,
    m: /\s*(?:m|metres?|meters?|米)$/i,
    '%': /\s*(?:%|％|percent)$/i,
  };
  return (unit ? raw.trim().replace(ends[unit], '') : raw.trim())
    .trim()
    .replace(/[−－]/g, '-');
}
export function trigQuantityMatches(
  raw: string,
  value: string,
  unit?: TrigRoundedUnit,
) {
  try {
    return sameR(
      readRational(trigQuantityText(raw, unit)),
      readRational(value),
    );
  } catch {
    return false;
  }
}
export function checkTrigRounded(
  raw: string,
  value: string,
  places: number,
  unit?: TrigRoundedUnit,
) {
  if (!Number.isInteger(places) || places < 0 || places > 4) return false;
  const s = trigQuantityText(raw, unit);
  if (
    !(
      places === 0 ? /^\+?\d+$/ : new RegExp(`^\\+?(?:\\d+)?\\.\\d{${places}}$`)
    ).test(s)
  )
    return false;
  try {
    return sameR(readRational(s), readRational(value));
  } catch {
    return false;
  }
}
export const inverseTrigCases: [TrigFunction, string][] = [
  ['sin', '3/5'],
  ['cos', '4/5'],
  ['tan', '3/4'],
  ['sin', '1/2'],
  ['tan', '1'],
  ['sin', '6/5'],
];
export function treeHeight(
  distance: number,
  degrees: number,
  eye: number,
  distanceKind: 'horizontal' | 'sight' = 'horizontal',
  baseElevation = 0,
) {
  if (
    !Number.isFinite(distance) ||
    distance <= 0 ||
    distance > 50 ||
    !Number.isFinite(eye) ||
    eye < 0 ||
    eye > 3 ||
    !Number.isFinite(baseElevation) ||
    Math.abs(baseElevation) > 3 ||
    !['horizontal', 'sight'].includes(distanceKind)
  )
    throw new RangeError('Bounded fictional height model');
  const v = trigValues(degrees);
  if (!v.acute || v.tan === null)
    throw new RangeError('Use an acute elevation angle');
  const horizontal =
      distanceKind === 'horizontal' ? distance : distance * v.cos,
    rise = distanceKind === 'horizontal' ? distance * v.tan : distance * v.sin,
    top = eye + rise,
    height = top - baseElevation;
  if (top > 60 || height <= 0)
    throw new RangeError('Positive bounded target height');
  return {
    distance,
    degrees,
    eye,
    distanceKind,
    baseElevation,
    horizontal,
    rise,
    top,
    height,
    sight: distanceKind === 'sight' ? distance : Math.hypot(horizontal, rise),
  };
}
export function slopeModel(rise: string, run: string) {
  const vertical = positiveS(rise, 30),
    horizontal = positiveS(run, 30),
    ratio = divR(vertical, horizontal);
  return {
    rise: vertical,
    run: horizontal,
    ratio,
    percent: numberS(ratio) * 100,
    degrees: (Math.atan(numberS(ratio)) * 180) / Math.PI,
    length: Math.hypot(numberS(vertical), numberS(horizontal)),
    text: textR(ratio),
  };
}
