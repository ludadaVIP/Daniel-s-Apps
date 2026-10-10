export type VectorKind =
  'quantities' | 'direction' | 'arrows' | 'addition' | 'components';
export const vectorKinds: VectorKind[] = [
  'quantities',
  'direction',
  'arrows',
  'addition',
  'components',
];
export type Vec = { x: number; y: number };
function range(n: number, min: number, max: number) {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Outside this vector model');
  return n;
}
function finite(v: Vec) {
  if (!Number.isFinite(v.x) || !Number.isFinite(v.y))
    throw new RangeError('Finite components required');
  return v;
}
export function vectorCase(i: number) {
  if (!Number.isInteger(i)) throw new RangeError('Integer case required');
  return range(i, 0, 2);
}
const clean = (n: number) => (Math.abs(n) < 1e-10 ? 0 : n);
export function magnitude(v: Vec) {
  finite(v);
  return Math.hypot(v.x, v.y);
}
export function vectorHeading(v: Vec) {
  finite(v);
  return magnitude(v) < 1e-10
    ? null
    : ((((Math.atan2(v.y, v.x) * 180) / Math.PI) % 360) + 360) % 360;
}
export function polar(size: number, angle: number): Vec {
  range(size, 0, 1e6);
  range(angle, -360, 360);
  const r = (angle * Math.PI) / 180;
  return { x: clean(size * Math.cos(r)), y: clean(size * Math.sin(r)) };
}
export function sumVectors(a: Vec, b: Vec): Vec {
  finite(a);
  finite(b);
  return { x: clean(a.x + b.x), y: clean(a.y + b.y) };
}
export function inBasis(v: Vec, degrees: number) {
  finite(v);
  range(degrees, -360, 360);
  const r = (degrees * Math.PI) / 180;
  return {
    x: clean(v.x * Math.cos(r) + v.y * Math.sin(r)),
    y: clean(-v.x * Math.sin(r) + v.y * Math.cos(r)),
  };
}
export function routeReading(i: number, scale = 1, fraction = 1) {
  vectorCase(i);
  range(scale, 0, 1.5);
  range(fraction, 0, 1);
  const source: Vec[][] = [
    [
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ],
    [
      { x: 4, y: 0 },
      { x: -4, y: 0 },
    ],
    [{ x: 4, y: 3 }],
  ];
  const legs = source[i]!.map((v) => ({ x: v.x * scale, y: v.y * scale })),
    total = legs.reduce((s, v) => s + magnitude(v), 0);
  let remaining = total * fraction,
    position: Vec = { x: 0, y: 0 };
  const points: Vec[] = [position];
  for (const v of legs) {
    const length = magnitude(v),
      used = Math.min(remaining, length),
      p = length ? used / length : 0;
    position = sumVectors(position, { x: v.x * p, y: v.y * p });
    points.push(position);
    remaining = Math.max(0, remaining - used);
    if (used < length) break;
  }
  return {
    legs,
    points,
    position,
    distance: total * fraction,
    totalDistance: total,
    displacement: magnitude(position),
    direction: vectorHeading(position),
    elapsed: total * fraction,
    speed: total ? 1 : 0,
  };
}
export function directionReading(i: number, basis = 0) {
  vectorCase(i);
  range(basis, -90, 90);
  const heading = [0, 90, 180][i]!,
    velocity = polar(3, heading),
    components = inBasis(velocity, basis);
  return { velocity, components, basis, heading, speed: 3 };
}
export function arrowReading(i: number, scale = 15) {
  vectorCase(i);
  range(scale, 5, 30);
  const speed = i === 0 ? 3 : 6,
    tail = i === 2 ? { x: 340, y: 235 } : { x: 110, y: 145 };
  return {
    speed,
    scale,
    tail,
    head: { x: tail.x + speed * scale, y: tail.y },
    pixels: speed * scale,
    velocity: { x: speed, y: 0 },
    heading: 0,
  };
}
export function boatReading(
  i: number,
  currentAngle = i === 0 ? 90 : 180,
  seconds = 4,
) {
  vectorCase(i);
  range(currentAngle, 0, 360);
  range(seconds, 0, 4);
  const boat = { x: 3, y: 0 },
    current = polar(i === 2 ? 3 : 4, currentAngle),
    ground = sumVectors(boat, current);
  return {
    boat,
    current,
    ground,
    seconds,
    speed: magnitude(ground),
    heading: vectorHeading(ground),
    position: { x: ground.x * seconds, y: ground.y * seconds },
    waterPosition: { x: boat.x * seconds, y: boat.y * seconds },
    currentShift: { x: current.x * seconds, y: current.y * seconds },
  };
}
export const componentAngle = (Math.atan2(3, 4) * 180) / Math.PI;
export function ropeReading(angle = componentAngle) {
  range(angle, 0, 90);
  const force = polar(10, angle),
    weight = 20,
    normal = weight - force.y;
  return {
    angle,
    force,
    magnitude: magnitude(force),
    weight,
    normal,
    horizontalNet: force.x,
    verticalNet: clean(force.y + normal - weight),
    cosine: force.x / 10,
    sine: force.y / 10,
  };
}
export function vectorDefault(kind: VectorKind, i: number) {
  vectorCase(i);
  switch (kind) {
    case 'quantities':
      return 1;
    case 'direction':
      return 0;
    case 'arrows':
      return 15;
    case 'addition':
      return i === 0 ? 90 : 180;
    case 'components':
      return [0, componentAngle, 90][i]!;
  }
}
