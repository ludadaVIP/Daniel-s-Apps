const rad = (a: number) => (a * Math.PI) / 180;
const deg = (a: number) => (a * 180) / Math.PI;
function bounded(v: number, min: number, max: number) {
  if (!Number.isFinite(v) || v < min || v > max)
    throw new RangeError('Outside this light model');
  return v;
}
export type Point = { x: number; y: number };
export const shadowCases = [
  { distance: 2, height: 1 },
  { distance: 3, height: 1 },
  { distance: 3, height: 2 },
] as const;
export function pointShadow(distance: number, height: number, screen = 6) {
  bounded(screen, 4, 8);
  bounded(distance, 1, 4);
  bounded(height, 0.25, 2);
  if (distance >= screen) throw new RangeError('Object must be before screen');
  return {
    distance,
    height,
    screen,
    scale: screen / distance,
    shadowHeight: (height * screen) / distance,
  };
}
export function reflection(angle: number) {
  bounded(angle, 0, 75);
  return { incidence: angle, reflected: angle, toSurface: 90 - angle };
}
export function planeMirror(distance: number) {
  bounded(distance, 0.2, 1);
  return {
    objectDistance: distance,
    imageDistance: distance,
    separation: 2 * distance,
    magnification: 1,
  };
}
export const refractionCases = [
  { incidence: 0, fromWater: false },
  { incidence: 45, fromWater: false },
  { incidence: 30, fromWater: true },
] as const;
export function refraction(incidence: number, fromWater: boolean) {
  bounded(incidence, 0, 70);
  const n1 = fromWater ? 1.333 : 1,
    n2 = fromWater ? 1 : 1.333;
  const sine = (n1 / n2) * Math.sin(rad(incidence));
  return {
    incidence,
    n1,
    n2,
    transmitted: sine > 1 ? undefined : deg(Math.asin(Math.min(1, sine))),
    totalReflection: sine > 1,
    speedRatio: n1 / n2,
    critical: fromWater ? deg(Math.asin(1 / 1.333)) : undefined,
  };
}
export const lensCases = [
  { object: 3, focal: 1 },
  { object: 2, focal: 1 },
  { object: 0.75, focal: 1 },
] as const;
export function thinLens(object: number, focal: number) {
  bounded(object, 0.5, 4);
  bounded(focal, 0.6, 1.2);
  const reciprocal = 1 / focal - 1 / object;
  const image = Math.abs(reciprocal) < 1e-12 ? undefined : 1 / reciprocal;
  const magnification = image === undefined ? undefined : -image / object;
  return {
    object,
    focal,
    image,
    magnification,
    real: image !== undefined && image > 0,
  };
}
export const eyeCases = [
  { object: 3, focal: 1 },
  { object: 2, focal: 1 },
  { object: 2, focal: 6 / 7 },
] as const;
export function eyeFocus(object: number, focal: number, retina = 1.5) {
  bounded(retina, 1, 2);
  const lens = thinLens(object, focal);
  // Two rays from the same object tip: through lens centre, and parallel then through F.
  const centre = -retina / object,
    parallel = 1 - retina / focal;
  return {
    ...lens,
    retina,
    centre,
    parallel,
    spread: Math.abs(centre - parallel),
    focused: Math.abs(centre - parallel) < 1e-9,
  };
}
export const colourBands = [
  { zh: '红', en: 'Red', colour: '#c3747c', n: 1.51 },
  { zh: '绿', en: 'Green', colour: '#7caa98', n: 1.52 },
  { zh: '蓝', en: 'Blue', colour: '#809cc3', n: 1.53 },
] as const;
export const colourCases = [
  [true, true, true],
  [true, false, false],
  [true, true, false],
] as const;
// Equilateral 60° prism, first incidence 45°. All bands enter at the same point/direction.
// Diagram coordinates use downward-positive y and one scale, with a rotated prism.
export const prismVertices: Point[] = [
  { x: 190, y: 178 },
  { x: 190 + 142 * Math.cos(rad(-45)), y: 178 + 142 * Math.sin(rad(-45)) },
  { x: 190 + 142 * Math.cos(rad(15)), y: 178 + 142 * Math.sin(rad(15)) },
];
export const prismEntry: Point = {
  x: (190 + prismVertices[1]!.x) / 2,
  y: (178 + prismVertices[1]!.y) / 2,
};
export function prismRay(index: number) {
  bounded(index, 1.4, 1.6);
  const insideAngle = 45 - deg(Math.asin(Math.sin(rad(45)) / index));
  const r2 = 60 - deg(Math.asin(Math.sin(rad(45)) / index));
  const exitAngle = deg(Math.asin(index * Math.sin(rad(r2))));
  const deviation = 45 + exitAngle - 60;
  const direction = {
    x: Math.cos(rad(insideAngle)),
    y: Math.sin(rad(insideAngle)),
  };
  const top = prismVertices[1]!,
    bottom = prismVertices[2]!;
  const edge = { x: bottom.x - top.x, y: bottom.y - top.y };
  const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x;
  const delta = { x: top.x - prismEntry.x, y: top.y - prismEntry.y };
  const travel = cross(delta, edge) / cross(direction, edge);
  const exit = {
    x: prismEntry.x + travel * direction.x,
    y: prismEntry.y + travel * direction.y,
  };
  const end = { x: 575, y: exit.y + (575 - exit.x) * Math.tan(rad(deviation)) };
  return { index, insideAngle, r2, exitAngle, deviation, exit, end };
}
export function transmittedBands(
  source: readonly boolean[],
  filter: 'none' | 'red' | 'blue',
) {
  if (
    source.length !== 3 ||
    source.some((x) => typeof x !== 'boolean') ||
    !['none', 'red', 'blue'].includes(filter)
  )
    throw new RangeError('Unknown band/filter');
  return source.map(
    (present, i) =>
      present && (filter === 'none' || (filter === 'red' ? i === 0 : i === 2)),
  );
}
export function pointOnPath(path: Point[], progress: number): Point {
  bounded(progress, 0, 1);
  if (
    path.length < 2 ||
    path.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))
  )
    throw new RangeError('Invalid path');
  const lengths = path
    .slice(1)
    .map((p, i) => Math.hypot(p.x - path[i]!.x, p.y - path[i]!.y));
  let remaining = progress * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i]!;
    if (remaining <= length || i === lengths.length - 1) {
      const part = length === 0 ? 0 : remaining / length;
      return {
        x: path[i]!.x + (path[i + 1]!.x - path[i]!.x) * part,
        y: path[i]!.y + (path[i + 1]!.y - path[i]!.y) * part,
      };
    }
    remaining -= length;
  }
  return path[path.length - 1]!;
}
