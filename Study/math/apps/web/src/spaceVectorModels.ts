import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { principalRadical, radicalText, readRadical } from './radicalModels';
import type { ExactPoint3, SpacePoint, SolidCode } from './solidModels';
import type { VectorCode } from './vectorModels';
export type Vec3 = ExactPoint3;
const q = (v: string | number) => readRational(String(v));
export function vec3(
  x: string | number,
  y: string | number,
  z: string | number,
): Vec3 {
  const values = [q(x), q(y), q(z)] as const;
  if (
    values.some(
      (v) => v[1] > 1000n || v[0] > 1000n * v[1] || v[0] < -1000n * v[1],
    )
  )
    throw new RangeError('Bounded rational input components');
  return values;
}
export function readVec3(raw: string): Vec3 | null {
  if (raw.length > 240) return null;
  let s = raw
    .trim()
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/，/g, ',');
  if (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1);
  else if (/[()]/.test(s)) return null;
  const p = s.split(',');
  if (p.length !== 3) return null;
  try {
    return vec3(p[0]!, p[1]!, p[2]!);
  } catch {
    return null;
  }
}
export const vec3Text = (v: Vec3) => `(${v.map(textR).join(', ')})`;
export const vec3Number = (v: Vec3): SpacePoint =>
  v.map((r) => Number(r[0]) / Number(r[1])) as unknown as SpacePoint;
export const zeroVec3 = (): Vec3 => vec3(0, 0, 0);
export const addVec3 = (a: Vec3, b: Vec3): Vec3 => [
  addR(a[0], b[0]),
  addR(a[1], b[1]),
  addR(a[2], b[2]),
];
export const scaleVec3 = (k: Rational, a: Vec3): Vec3 => [
  mulR(k, a[0]),
  mulR(k, a[1]),
  mulR(k, a[2]),
];
export const subVec3 = (a: Vec3, b: Vec3) => addVec3(a, scaleVec3(q(-1), b));
export const dotVec3 = (a: Vec3, b: Vec3) =>
  addR(addR(mulR(a[0], b[0]), mulR(a[1], b[1])), mulR(a[2], b[2]));
export const crossVec3 = (a: Vec3, b: Vec3): Vec3 => [
  addR(mulR(a[1], b[2]), negR(mulR(a[2], b[1]))),
  addR(mulR(a[2], b[0]), negR(mulR(a[0], b[2]))),
  addR(mulR(a[0], b[1]), negR(mulR(a[1], b[0]))),
];
export const squareVec3 = (v: Vec3) => dotVec3(v, v);
export const isZeroVec3 = (v: Vec3) => v.every((r) => r[0] === 0n);
export const sameVec3 = (a: Vec3, b: Vec3) =>
  a.every((r, i) => sameR(r, b[i]!));
export const midpointVec3 = (a: Vec3, b: Vec3) =>
  scaleVec3(rational(1n, 2n), addVec3(a, b));
export const lengthVec3 = (v: Vec3) =>
  radicalText(principalRadical(squareVec3(v)));
export function checkVec3(raw: string, expected: string) {
  const a = readVec3(raw),
    b = readVec3(expected);
  return !!a && !!b && sameVec3(a, b);
}
export function spatialAngle(
  u: Vec3,
  v: Vec3,
): { dot: Rational; kind: VectorCode; cosine: string | null } {
  const dot = dotVec3(u, v);
  if (isZeroVec3(u) || isZeroVec3(v))
    return { dot, kind: 'undefined', cosine: null };
  const parallel = isZeroVec3(crossVec3(u, v)),
    kind: VectorCode = parallel
      ? dot[0] > 0n
        ? 'zero-angle'
        : 'straight'
      : dot[0] > 0n
        ? 'acute'
        : dot[0] < 0n
          ? 'obtuse'
          : 'right';
  const cosine = readRadical(
    `(${textR(dot)})/sqrt(${textR(mulR(squareVec3(u), squareVec3(v)))})`,
  );
  if (!cosine) throw new RangeError('Exact cosine outside radical support');
  return { dot, kind, cosine: radicalText(cosine) };
}
export type VectorLine3 = { point: Vec3; direction: Vec3 };
export type VectorPlane3 = { normal: Vec3; offset: Rational };
export function vectorLine3(point: Vec3, direction: Vec3): VectorLine3 {
  if (isZeroVec3(direction))
    throw new RangeError('A line requires nonzero direction');
  return { point, direction };
}
export function vectorPlane3(
  normal: Vec3,
  offset: string | number,
): VectorPlane3 {
  if (isZeroVec3(normal))
    throw new RangeError('A plane requires nonzero normal');
  return { normal, offset: q(offset) };
}
export const planeResidual3 = (plane: VectorPlane3, p: Vec3) =>
  addR(dotVec3(plane.normal, p), negR(plane.offset));
export function vectorLinePlaneRelation(
  line: VectorLine3,
  plane: VectorPlane3,
) {
  if (isZeroVec3(line.direction) || isZeroVec3(plane.normal))
    throw new RangeError('Nonzero directions and normals');
  const denominator = dotVec3(line.direction, plane.normal),
    residual = planeResidual3(plane, line.point);
  const kind: SolidCode = denominator[0]
    ? 'intersecting'
    : residual[0]
      ? 'parallel'
      : 'contained';
  const parameter = denominator[0] ? divR(negR(residual), denominator) : null;
  return {
    kind,
    dot: denominator,
    residual,
    parameter,
    intersection: parameter
      ? addVec3(line.point, scaleVec3(parameter, line.direction))
      : null,
    perpendicular: isZeroVec3(crossVec3(line.direction, plane.normal)),
  };
}
export function vectorPlaneRelation(
  a: VectorPlane3,
  b: VectorPlane3,
): SolidCode {
  if (isZeroVec3(a.normal) || isZeroVec3(b.normal))
    throw new RangeError('Nonzero plane normals');
  if (!isZeroVec3(crossVec3(a.normal, b.normal))) return 'intersecting';
  const i = a.normal.findIndex((r) => r[0] !== 0n),
    ratio = divR(b.normal[i]!, a.normal[i]!);
  return sameR(mulR(a.offset, ratio), b.offset) ? 'coincident' : 'parallel';
}
export function vectorLineRelation(a: VectorLine3, b: VectorLine3): SolidCode {
  if (isZeroVec3(a.direction) || isZeroVec3(b.direction))
    throw new RangeError('Nonzero line directions');
  const cross = crossVec3(a.direction, b.direction),
    w = subVec3(b.point, a.point);
  return isZeroVec3(cross)
    ? isZeroVec3(crossVec3(w, a.direction))
      ? 'coincident'
      : 'parallel'
    : dotVec3(w, cross)[0] === 0n
      ? 'intersecting'
      : 'skew';
}
export function pointPlaneProjection(p: Vec3, plane: VectorPlane3) {
  const s = planeResidual3(plane, p),
    norm = squareVec3(plane.normal);
  if (!norm[0]) throw new RangeError('Nonzero plane normal');
  const foot = subVec3(p, scaleVec3(divR(s, norm), plane.normal)),
    displacement = subVec3(p, foot),
    distanceSquare = divR(mulR(s, s), norm);
  return {
    foot,
    displacement,
    distanceSquare,
    distance: radicalText(principalRadical(distanceSquare)),
  };
}
export function pointLineProjection(p: Vec3, line: VectorLine3) {
  const w = subVec3(p, line.point),
    norm = squareVec3(line.direction);
  if (!norm[0]) throw new RangeError('Nonzero line direction');
  const parameter = divR(dotVec3(w, line.direction), norm),
    foot = addVec3(line.point, scaleVec3(parameter, line.direction)),
    displacement = subVec3(p, foot),
    distanceSquare = squareVec3(displacement);
  return {
    foot,
    parameter,
    displacement,
    distanceSquare,
    distance: radicalText(principalRadical(distanceSquare)),
  };
}
export const spatialOperands = [
  vec3(1, 2, -1),
  vec3(-1, 1, 2),
  zeroVec3(),
  vec3('1/2', -1, 2),
];
export const spatialPartners = [
  vec3(2, -1, 3),
  vec3(1, 2, -1),
  vec3(-1, -2, 1),
  vec3(0, 0, 0),
];
export const anglePartners = [
  vec3(2, -1, 0),
  vec3(1, 2, -1),
  vec3(-1, -2, 1),
  vec3(1, 0, 0),
  zeroVec3(),
];
export const spatialPlane = vectorPlane3(vec3(1, 2, 2), 3);
export const spatialDistanceLine = vectorLine3(vec3(1, 0, 1), vec3(1, 1, 0));
export const spatialDistancePoints = [
  vec3(3, 4, 5),
  vec3(2, 1, 1),
  vec3(1, 0, 1),
  zeroVec3(),
];
export const spatialRelationCases = [
  {
    name: ['平行于平面但不在其内', 'Parallel outside the plane'],
    line: vectorLine3(vec3(0, 0, 1), vec3(1, 0, 0)),
    plane: vectorPlane3(vec3(0, 0, 1), 0),
  },
  {
    name: ['直线在平面内', 'Line contained in the plane'],
    line: vectorLine3(zeroVec3(), vec3(1, 0, 0)),
    plane: vectorPlane3(vec3(0, 0, 1), 0),
  },
  {
    name: ['斜线与平面相交', 'Oblique line intersects the plane'],
    line: vectorLine3(vec3(0, 0, 1), vec3(1, 0, -1)),
    plane: vectorPlane3(vec3(0, 0, 1), 0),
  },
  {
    name: ['直线垂直平面', 'Line perpendicular to the plane'],
    line: vectorLine3(vec3(0, 0, 1), vec3(0, 0, -1)),
    plane: vectorPlane3(vec3(0, 0, 1), 0),
  },
] as const;
