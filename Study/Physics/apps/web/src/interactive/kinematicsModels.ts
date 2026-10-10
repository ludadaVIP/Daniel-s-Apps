export type KinematicsKind =
  'position' | 'journey' | 'velocity' | 'average' | 'acceleration' | 'rate';
export const kinematicsKinds: KinematicsKind[] = [
  'position',
  'journey',
  'velocity',
  'average',
  'acceleration',
  'rate',
];
export type Pair = [string, string];
function range(n: number, a: number, b: number) {
  if (!Number.isFinite(n) || n < a || n > b)
    throw new RangeError('Outside this kinematics model');
  return n;
}
export function kinematicsCase(i: number) {
  if (!Number.isInteger(i)) throw new RangeError('Integer case required');
  return range(i, 0, 2);
}
export function constantMotion(x0: number, u: number, a: number, t: number) {
  for (const v of [x0, u, a]) range(v, -100, 100);
  range(t, 0, 30);
  return {
    position: x0 + u * t + 0.5 * a * t * t,
    velocity: u + a * t,
    acceleration: a,
  };
}
// Integrate |v|, splitting at a possible smooth turning point.
export function motionInterval(
  x0: number,
  u: number,
  a: number,
  start: number,
  end: number,
) {
  range(start, 0, 30);
  range(end, start, 30);
  const first = constantMotion(x0, u, a, start),
    last = constantMotion(x0, u, a, end),
    turning = a === 0 ? null : -u / a,
    elapsed = end - start,
    distance =
      turning !== null && turning > start && turning < end
        ? Math.abs(
            constantMotion(x0, u, a, turning).position - first.position,
          ) +
          Math.abs(last.position - constantMotion(x0, u, a, turning).position)
        : Math.abs(last.position - first.position),
    displacement = last.position - first.position;
  return {
    first,
    last,
    start,
    end,
    elapsed,
    distance,
    displacement,
    averageVelocity: elapsed === 0 ? null : displacement / elapsed,
    averageSpeed: elapsed === 0 ? null : distance / elapsed,
  };
}
export function coordinate(world: number, origin: number, positive: 1 | -1) {
  range(world, -100, 100);
  range(origin, -100, 100);
  if (positive !== 1 && positive !== -1)
    throw new RangeError('Signed direction required');
  return positive * (world - origin);
}
export function velocityChange(
  initial: number,
  final: number,
  duration: number,
) {
  range(initial, -100, 100);
  range(final, -100, 100);
  range(duration, 0.1, 30);
  return {
    change: final - initial,
    duration,
    acceleration: (final - initial) / duration,
  };
}
export function kinematicsDefault(kind: KinematicsKind, index: number) {
  kinematicsCase(index);
  switch (kind) {
    case 'position':
      return index === 0 ? 0 : 10;
    case 'journey':
      return [2, 4, 8][index]!;
    case 'velocity':
      return [2, 4, 6][index]!;
    case 'average':
      return [4, 8, 8][index]!;
    case 'acceleration':
      return [0.5, -0.5, -0.5][index]!;
    case 'rate':
      return [2, 4, 2][index]!;
  }
}
export function kinematicsConfig(
  kind: KinematicsKind,
  index: number,
  value = kinematicsDefault(kind, index),
) {
  kinematicsCase(index);
  let x0 = 3,
    u = 4,
    a = -1,
    start = 0,
    end = 8,
    origin = 0,
    positive: 1 | -1 = 1;
  switch (kind) {
    case 'position':
      range(value, -4, 14);
      u = 2;
      a = 0;
      end = 6;
      origin = value;
      positive = index === 2 ? -1 : 1;
      break;
    case 'journey':
    case 'velocity':
      range(value, 0, 8);
      end = value;
      break;
    case 'average':
      start = index === 1 ? 4 : 0;
      range(value, start + 0.5, 8);
      end = value;
      break;
    case 'acceleration':
      range(value, -0.5, 0.5);
      x0 = index === 2 ? 15 : 3;
      u = index === 1 ? 4 : index === 2 ? -1 : 1;
      a = value;
      end = 6;
      break;
    case 'rate':
      range(value, 1, 6);
      u = index === 2 ? 6 : 2;
      a = velocityChange(u, index === 2 ? 2 : 6, value).acceleration;
      end = value;
      break;
  }
  return {
    x0,
    u,
    a,
    start,
    end,
    origin,
    positive,
    trackMax:
      kind === 'acceleration'
        ? 40
        : kind === 'rate'
          ? 30
          : kind === 'position'
            ? 18
            : 14,
  };
}
export function kinematicsReading(
  kind: KinematicsKind,
  index: number,
  value: number,
  progress = 1,
) {
  range(progress, 0, 1);
  const c = kinematicsConfig(kind, index, value),
    time = c.start + (c.end - c.start) * progress,
    m = motionInterval(c.x0, c.u, c.a, c.start, time),
    initial = coordinate(m.first.position, c.origin, c.positive),
    position = coordinate(m.last.position, c.origin, c.positive),
    velocity = c.positive * m.last.velocity,
    acceleration = c.positive * c.a;
  return {
    ...c,
    ...m,
    time,
    initial,
    position,
    velocity,
    speed: Math.abs(velocity),
    acceleration,
    displacement: c.positive * m.displacement,
    averageVelocity:
      m.averageVelocity === null ? null : c.positive * m.averageVelocity,
    changeVelocity: c.positive * (m.last.velocity - m.first.velocity),
    direction: velocity === 0 ? null : velocity > 0 ? 'positive' : 'negative',
  };
}
export function kinematicsRecord(kind: KinematicsKind, index: number): Pair {
  const m = kinematicsReading(kind, index, kinematicsDefault(kind, index)),
    f = (n: number) => String(Number(n.toFixed(4)));
  switch (kind) {
    case 'position':
      return [
        `原点 ${m.origin} m · ${m.positive === 1 ? '向右为正' : '向左为正'} · x=${f(m.position)} m · Δx=${f(m.displacement)} m`,
        `Origin ${m.origin} m · ${m.positive === 1 ? 'right positive' : 'left positive'} · x=${f(m.position)} m · Δx=${f(m.displacement)} m`,
      ];
    case 'journey':
      return [
        `t=${m.time} s · Δx=${f(m.displacement)} m · 路程 ${f(m.distance)} m`,
        `t=${m.time} s · Δx=${f(m.displacement)} m · distance ${f(m.distance)} m`,
      ];
    case 'velocity':
      return [
        `t=${m.time} s · v=${f(m.velocity)} m/s · 速率 ${f(m.speed)} m/s`,
        `t=${m.time} s · v=${f(m.velocity)} m/s · speed ${f(m.speed)} m/s`,
      ];
    case 'average':
      return [
        `${m.start}→${m.end} s · Δx=${f(m.displacement)} m · 平均速度 ${f(m.averageVelocity!)} m/s · 平均速率 ${f(m.averageSpeed!)} m/s`,
        `${m.start}→${m.end} s · Δx=${f(m.displacement)} m · mean velocity ${f(m.averageVelocity!)} m/s · mean speed ${f(m.averageSpeed!)} m/s`,
      ];
    default:
      return [
        `v：${f(m.first.velocity)}→${f(m.velocity)} m/s · Δt=${f(m.elapsed)} s · a=${f(m.acceleration)} m/s²`,
        `v: ${f(m.first.velocity)}→${f(m.velocity)} m/s · Δt=${f(m.elapsed)} s · a=${f(m.acceleration)} m/s²`,
      ];
  }
}
