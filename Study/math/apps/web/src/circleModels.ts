import { parseAffine, sameR, type Rational } from './algebraModels';
export type CircleUnit = 'cm' | 'cm²' | 'cm³';
const unitEnd: Record<CircleUnit, RegExp> = {
  cm: /\s*(?:cm|centimet(?:er|re)s?|厘米)$/i,
  'cm²': /\s*(?:cm(?:²|\^2|2)|square centimet(?:er|re)s?|平方厘米)$/i,
  'cm³': /\s*(?:cm(?:³|\^3|3)|cubic centimet(?:er|re)s?|立方厘米)$/i,
};
/** Parse an exact multiple of pi using rational coefficients, never decimal pi. */
export function piCoefficient(raw: string, unit?: CircleUnit): Rational | null {
  const stripped = unit ? raw.trim().replace(unitEnd[unit], '') : raw.trim();
  const expression = parseAffine(
    stripped.replace(/pi/gi, 'p').replace(/[πΠ]/g, 'p'),
    'p',
  );
  return expression && expression.b[0] === 0n ? expression.a : null;
}
export function checkPiMultiple(
  raw: string,
  coefficient: string,
  unit: CircleUnit,
) {
  const actual = piCoefficient(raw, unit),
    expected = parseAffine(coefficient, 'p');
  return (
    !!actual && !!expected && expected.a[0] === 0n && sameR(actual, expected.b)
  );
}
export function positiveMeasure(value: number, max = 50) {
  if (!Number.isFinite(value) || value <= 0 || value > max)
    throw new RangeError(
      'Use a positive finite measurement within the model range',
    );
  return value;
}
export function circleMeasures(r: number) {
  positiveMeasure(r);
  return {
    r,
    d: 2 * r,
    cCoefficient: 2 * r,
    aCoefficient: r * r,
    c: 2 * Math.PI * r,
    area: Math.PI * r * r,
  };
}
export function circleParts(r: number, angle: number, offset: number) {
  circleMeasures(r);
  if (
    !Number.isFinite(angle) ||
    angle < 0 ||
    angle > 360 ||
    !Number.isFinite(offset) ||
    Math.abs(offset) > 0.8
  )
    throw new RangeError('Use a valid angle and chord offset');
  const theta = (angle * Math.PI) / 180,
    u: [number, number] = [Math.cos(theta), Math.sin(theta)],
    v: [number, number] = [-u[1], u[0]],
    s = r * Math.sqrt(1 - offset * offset);
  const chord = [-1, 1].map(
    (sign) =>
      [
        v[0] * offset * r + sign * u[0] * s,
        v[1] * offset * r + sign * u[1] * s,
      ] as [number, number],
  );
  return {
    r,
    angle,
    offset,
    radius: [r * u[0], r * u[1]] as [number, number],
    diameter: [
      [-r * u[0], -r * u[1]],
      [r * u[0], r * u[1]],
    ] as [number, number][],
    chord,
    chordLength: 2 * s,
    isDiameter: offset === 0,
  };
}
export function simulatedPiReading(d: number, precision: 0.1 | 1) {
  positiveMeasure(d, 100);
  if (precision !== 0.1 && precision !== 1)
    throw new RangeError('Choose the stated ruler precision');
  const circumference = Math.round((Math.PI * d) / precision) * precision;
  return {
    d,
    c: Number(circumference.toFixed(1)),
    ratio: circumference / d,
    precision,
  };
}
export function measuredPiRatio(d: number, c: number) {
  positiveMeasure(d, 100);
  positiveMeasure(c, 400);
  return c / d;
}
export const sectorCounts = [6, 8, 16, 32, 64] as const;
export function sectorRearrangement(r: number, count: number) {
  circleMeasures(r);
  if (!sectorCounts.some((n) => n === count))
    throw new RangeError('Use one of the even sector counts');
  const alpha = Math.PI / count,
    s = r * Math.sin(alpha),
    height = r * Math.cos(alpha),
    base = count * s;
  const pieces = Array.from({ length: count }, (_, id) => ({
    id,
    up: id % 2 === 0,
    apex: [id * s, id % 2 === 0 ? height : 0] as [number, number],
  }));
  return {
    r,
    count,
    alpha,
    s,
    height,
    base,
    arcHalf: Math.PI * r,
    sectorArea: (Math.PI * r * r) / count,
    totalArea: Math.PI * r * r,
    guideArea: base * height,
    sag: r - height,
    pieces,
  };
}
export function cylinderMeasures(r: number, h: number, lids: 0 | 1 | 2) {
  circleMeasures(r);
  positiveMeasure(h);
  if (![0, 1, 2].includes(lids))
    throw new RangeError('Choose zero, one or two circular ends');
  return {
    r,
    h,
    lids,
    netWidth: 2 * Math.PI * r,
    netHeight: h,
    lateralCoefficient: 2 * r * h,
    baseCoefficient: r * r,
    surfaceCoefficient: 2 * r * h + lids * r * r,
    volumeCoefficient: r * r * h,
  };
}
export const piTerm = (coefficient: number) =>
  `${coefficient === 1 ? '' : coefficient}π`;
