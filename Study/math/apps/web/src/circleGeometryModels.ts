import { addR, mulR, divR, negR, textR, type Rational } from './algebraModels';
import { positiveS, numberS } from './similarityModels';
import { exactRootText } from './pythagoreanModels';
import type { GeoPoint } from './congruenceModels';
import { readRational } from './rationalModels';
import { principalRadical, radicalText } from './radicalModels';
const R = (n: number): Rational => [BigInt(n), 1n];
export const normDegrees = (n: number) => ((n % 360) + 360) % 360;
export function circlePoint(angle: number, r = 1): GeoPoint {
  if (!Number.isFinite(angle) || !Number.isFinite(r) || r <= 0 || r > 100)
    throw new RangeError('Finite angle and 0<radius≤100');
  const a = (normDegrees(angle) * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}
export type CircleLineClass = 'secant' | 'tangent' | 'disjoint';
export function checkCircleLine(raw: string, wanted: CircleLineClass) {
  const aliases: Record<CircleLineClass, string[]> = {
    secant: ['secant', '割线'],
    tangent: ['tangent', '切线'],
    disjoint: ['disjoint', 'no intersection', '不相交', '无交点'],
  };
  return aliases[wanted].includes(
    raw.trim().toLowerCase().replace(/\s+/g, ' '),
  );
}
export function lineCircle(radius: string, distance: string) {
  const r = positiveS(radius, 20),
    actualD = readRational(distance);
  if (
    actualD[0] < 0n ||
    !Number.isFinite(numberS(actualD)) ||
    numberS(actualD) > 40
  )
    throw new RangeError('Use 0≤distance≤40');
  const rsq = mulR(r, r),
    dsq = mulR(actualD, actualD),
    delta = addR(rsq, negR(dsq)),
    kind: CircleLineClass =
      delta[0] > 0n ? 'secant' : delta[0] === 0n ? 'tangent' : 'disjoint',
    chordSquare = mulR(R(4), delta);
  return {
    r,
    d: actualD,
    kind,
    diameter: actualD[0] === 0n,
    chordSquare: kind === 'secant' ? chordSquare : null,
    chord: kind === 'secant' ? exactRootText(chordSquare) : null,
  };
}
/** A and B are at 0° and sweep° counterclockwise. P lies on one open arc.
 * The intercepted arc is always the one that excludes P. */
export function inscribedModel(
  sweep: number,
  side: 'selected' | 'other' = 'other',
) {
  if (
    !Number.isFinite(sweep) ||
    sweep <= 0 ||
    sweep >= 360 ||
    !['selected', 'other'].includes(side)
  )
    throw new RangeError('Distinct endpoints and a known open-arc side');
  const vertex = side === 'selected' ? sweep / 2 : (sweep + 360) / 2,
    intercepted = side === 'selected' ? 360 - sweep : sweep;
  return {
    sweep,
    side,
    vertex,
    intercepted,
    angle: intercepted / 2,
    A: circlePoint(0),
    B: circlePoint(sweep),
    P: circlePoint(vertex),
  };
}
export function tangentModel(radius: string, op: string) {
  const r = positiveS(radius, 20),
    d = positiveS(op, 50),
    square = addR(mulR(d, d), negR(mulR(r, r)));
  if (square[0] <= 0n)
    throw new RangeError('Two distinct external tangents require OP>r');
  const rn = numberS(r),
    dn = numberS(d),
    x = (rn * rn) / dn,
    y = (rn * Math.sqrt(numberS(square))) / dn;
  return {
    r,
    d,
    square,
    length: radicalText(principalRadical(square)),
    P: { x: dn, y: 0 },
    T: { x, y },
    S: { x, y: -y },
  };
}
export function tangentAngle(central: number) {
  if (!Number.isFinite(central) || central <= 0 || central >= 180)
    throw new RangeError('Minor central angle between zero and 180');
  return 180 - central;
}
/** Numerical coordinates for display only; the angle answer stays 180−central. */
export function tangentAngleGeometry(radius: number, central: number) {
  tangentAngle(central);
  if (!Number.isFinite(radius) || radius <= 0 || radius > 20)
    throw new RangeError('Use 0<radius≤20');
  const half = central / 2;
  return {
    P: { x: radius / Math.cos((half * Math.PI) / 180), y: 0 },
    T: circlePoint(half, radius),
    S: circlePoint(-half, radius),
    length: null,
  };
}
export function sectorExact(radius: string, sweep: string) {
  const r = positiveS(radius, 20),
    angle = positiveS(sweep, 360),
    fraction = divR(angle, R(360));
  return {
    r,
    angle,
    fraction,
    arcCoefficient: mulR(mulR(R(2), r), fraction),
    areaCoefficient: mulR(mulR(r, r), fraction),
    radialBoundary: numberS(angle) === 360 ? R(0) : mulR(R(2), r),
  };
}
export function angleFromArc(radius: string, coefficient: string) {
  const r = positiveS(radius, 20),
    c = positiveS(coefficient, 40),
    angle = divR(mulR(R(180), c), r);
  if (numberS(angle) > 360)
    throw new RangeError('Arc cannot exceed one full turn');
  return angle;
}
export function diameterAltitude(ac: string, ad: string) {
  const whole = positiveS(ac, 50),
    part = positiveS(ad, 50),
    dc = addR(whole, negR(part));
  if (dc[0] <= 0n)
    throw new RangeError('Foot must be strictly between diameter endpoints');
  const abSquare = mulR(whole, part),
    bcSquare = mulR(whole, dc),
    bdSquare = mulR(part, dc);
  return {
    ac: whole,
    ad: part,
    dc,
    abSquare,
    bcSquare,
    bdSquare,
    ab: exactRootText(abSquare),
    bc: exactRootText(bcSquare),
    bd: exactRootText(bdSquare),
    A: { x: 0, y: 0 },
    B: { x: numberS(part), y: Math.sqrt(numberS(bdSquare)) },
    C: { x: numberS(whole), y: 0 },
    D: { x: numberS(part), y: 0 },
  };
}
export type CircleProofStep = {
  id: string;
  label: { zh: string; en: string };
  requires: string[];
  gives: string;
};
export const circleProofCases = [
  {
    id: 'cyclic',
    givens: ['cyclic', 'A70'],
    steps: [
      {
        id: 'arcs',
        label: {
          zh: '两条不含各自顶点的弧合成整圆',
          en: 'The two intercepted arcs partition the full circle',
        },
        requires: ['cyclic'],
        gives: 'arcs360',
      },
      {
        id: 'supplement',
        label: {
          zh: '各取一半，得到对角和180°',
          en: 'Halve both arc measures to obtain opposite-angle sum 180°',
        },
        requires: ['arcs360'],
        gives: 'opposite180',
      },
      {
        id: 'subtract',
        label: {
          zh: '代入A=70°，求C=110°',
          en: 'Substitute A=70° to obtain C=110°',
        },
        requires: ['opposite180', 'A70'],
        gives: 'C110',
      },
    ],
  },
  {
    id: 'altitude',
    givens: ['diameter', 'on-circle', 'foot', 'AC25', 'AD9'],
    steps: [
      {
        id: 'thales',
        label: {
          zh: '直径所对圆周角ABC=90°',
          en: 'Angle ABC subtending the diameter is 90°',
        },
        requires: ['diameter', 'on-circle'],
        gives: 'rightB',
      },
      {
        id: 'AA',
        label: {
          zh: '共用A角及两直角，由AA得ADB∼ABC',
          en: 'Use common A and right angles: ADB∼ABC by AA',
        },
        requires: ['rightB', 'foot'],
        gives: 'similar',
      },
      {
        id: 'ratio',
        label: {
          zh: 'AD/AB=AB/AC，所以AB²=AD·AC',
          en: 'AD/AB=AB/AC, hence AB²=AD·AC',
        },
        requires: ['similar'],
        gives: 'square',
      },
      {
        id: 'root',
        label: {
          zh: '代入9与25，长度取正根15',
          en: 'Substitute nine and twenty-five and take positive length fifteen',
        },
        requires: ['square', 'AC25', 'AD9'],
        gives: 'AB15',
      },
    ],
  },
  {
    id: 'missing-circle',
    givens: ['A70'],
    steps: [
      {
        id: 'arcs',
        label: {
          zh: '两条不含顶点的弧合成整圆',
          en: 'The two intercepted arcs partition the full circle',
        },
        requires: ['cyclic'],
        gives: 'arcs360',
      },
      {
        id: 'supplement',
        label: {
          zh: '圆内接四边形对角和180°',
          en: 'Opposite angles of a cyclic quadrilateral sum to 180°',
        },
        requires: ['cyclic'],
        gives: 'opposite180',
      },
      {
        id: 'subtract',
        label: { zh: '用A=70°得C=110°', en: 'Use A=70° to obtain C=110°' },
        requires: ['opposite180', 'A70'],
        gives: 'C110',
      },
    ],
  },
] satisfies { id: string; givens: string[]; steps: CircleProofStep[] }[];
export function auditCircleProof(index: number, chain: string[]) {
  const c = circleProofCases[index];
  if (!c) throw new RangeError('Known proof case');
  const available = new Set(c.givens),
    used = new Set<string>();
  for (const id of chain) {
    const step = c.steps.find((s) => s.id === id);
    if (!step || used.has(id))
      return {
        valid: false,
        missing: ['unknown-or-repeated-step'],
        available: [...available],
      };
    const missing = step.requires.filter((r) => !available.has(r));
    if (missing.length)
      return { valid: false, missing, available: [...available] };
    available.add(step.gives);
    used.add(id);
  }
  return { valid: true, missing: [], available: [...available] };
}
export const circleGeometryText = textR;
