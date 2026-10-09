export type GraphKind =
  'axes' | 'reading' | 'gradient' | 'area' | 'linear' | 'curve' | 'experiment';
export const graphKinds: GraphKind[] = [
  'axes',
  'reading',
  'gradient',
  'area',
  'linear',
  'curve',
  'experiment',
];
function range(n: number, min: number, max: number) {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Outside this graph model');
  return n;
}
export function graphCase(i: number) {
  if (!Number.isInteger(i)) throw new RangeError('Integer case required');
  return range(i, 0, 2);
}
export function axisReading(i: number, seconds: number) {
  graphCase(i);
  range(seconds, 0, 6);
  const position = 2 + seconds;
  return {
    seconds,
    position,
    horizontal: seconds / (i === 2 ? 60 : 1),
    vertical: position * (i === 1 ? 100 : 1),
    timeUnit: i === 2 ? 'min' : 's',
    positionUnit: i === 1 ? 'cm' : 'm',
  };
}
export function walkingReading(seconds: number) {
  range(seconds, 0, 6);
  let position: number, distance: number, velocity: number;
  if (seconds < 2) {
    position = 1 + 2 * seconds;
    distance = 2 * seconds;
    velocity = 2;
  } else if (seconds < 4) {
    position = 5;
    distance = 4;
    velocity = 0;
  } else {
    position = 5 - 2 * (seconds - 4);
    distance = 4 + 2 * (seconds - 4);
    velocity = -2;
  }
  return { seconds, position, distance, displacement: position - 1, velocity };
}
export function secant(fn: (t: number) => number, a: number, b: number) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a)
    throw new RangeError('A positive interval is required');
  const ya = fn(a),
    yb = fn(b);
  if (!Number.isFinite(ya) || !Number.isFinite(yb))
    throw new RangeError('Finite readings required');
  return {
    a,
    b,
    ya,
    yb,
    run: b - a,
    rise: yb - ya,
    gradient: (yb - ya) / (b - a),
  };
}
export function straightGradient(i: number, start = 1) {
  graphCase(i);
  range(start, 0, 2);
  const velocity = [1, 2, -1][i]!;
  return { velocity, ...secant((t) => 6 + velocity * t, start, start + 2) };
}
export function velocityArea(i: number, seconds: number) {
  graphCase(i);
  range(seconds, 0, 6);
  if (i === 0)
    return {
      seconds,
      velocity: 2,
      displacement: 2 * seconds,
      distance: 2 * seconds,
      positive: 2 * seconds,
      negative: 0,
    };
  if (i === 1) {
    const positive = 2 * Math.min(seconds, 3),
      negative = -2 * Math.max(0, seconds - 3);
    return {
      seconds,
      velocity: seconds < 3 ? 2 : -2,
      displacement: positive + negative,
      distance: positive - negative,
      positive,
      negative,
    };
  }
  const displacement = (seconds * seconds) / 3;
  return {
    seconds,
    velocity: (2 * seconds) / 3,
    displacement,
    distance: displacement,
    positive: displacement,
    negative: 0,
  };
}
export function heatingLine(i: number, power: number, seconds: number) {
  graphCase(i);
  range(power, 50, 200);
  range(seconds, 0, 6);
  const initial = i === 1 ? 30 : 20,
    capacity = 100,
    gradient = power / capacity;
  return {
    initial,
    power,
    capacity,
    seconds,
    temperature: initial + gradient * seconds,
    gradient,
    energy: power * seconds,
  };
}
export function acceleratingReading(seconds: number) {
  range(seconds, 0, 6);
  return {
    seconds,
    position: 0.5 * seconds * seconds,
    velocity: seconds,
    acceleration: 1,
    timeSquared: seconds * seconds,
  };
}
export function curveInterval(start: number, squared = false) {
  range(start, 0, 5);
  const a = acceleratingReading(start),
    b = acceleratingReading(start + 1),
    run = squared ? b.timeSquared - a.timeSquared : 1,
    rise = b.position - a.position;
  return {
    a,
    b,
    run,
    rise,
    gradient: rise / run,
    meanVelocity: rise,
    unit: squared ? 'm/s²' : 'm/s',
  };
}
export const springReadings = [
  { force: 0, readings: [2.1, 1.9, 2] },
  { force: 1, readings: [7.3, 6.8, 7.1] },
  { force: 2, readings: [12.1, 11.9, 12.2] },
  { force: 3, readings: [17.1, 16.8, 17] },
  { force: 4, readings: [22.2, 22, 21.9] },
];
export function linearFit(
  points: { x: number; y: number }[],
  throughOrigin = false,
) {
  if (
    points.length < 2 ||
    points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))
  )
    throw new RangeError('At least two finite points required');
  const mx = points.reduce((a, p) => a + p.x, 0) / points.length,
    my = points.reduce((a, p) => a + p.y, 0) / points.length;
  const denominator = points.reduce(
    (a, p) => a + (throughOrigin ? p.x * p.x : (p.x - mx) ** 2),
    0,
  );
  if (denominator === 0) throw new RangeError('Distinct x readings required');
  const slope =
      points.reduce(
        (a, p) => a + (throughOrigin ? p.x * p.y : (p.x - mx) * (p.y - my)),
        0,
      ) / denominator,
    intercept = throughOrigin ? 0 : my - slope * mx;
  return {
    slope,
    intercept,
    residuals: points.map((p) => p.y - (slope * p.x + intercept)),
  };
}
export function graphExperiment(
  i: number,
  correction = i === 1 ? 2 : 0,
  throughOrigin = false,
) {
  graphCase(i);
  range(correction, 0, 3);
  const coarse = i === 2,
    resolution = coarse ? 1 : 0.1;
  const rows = springReadings.map((r) => {
    const raw = r.readings.map((v) => (coarse ? Math.round(v) : v)),
      values = raw.map((v) => v - correction),
      mean = values.reduce((a, v) => a + v, 0) / values.length;
    return {
      force: r.force,
      raw,
      values,
      mean,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });
  const fit = linearFit(
    rows.map((r) => ({ x: r.force, y: r.mean })),
    throughOrigin,
  );
  return { rows, fit, correction, resolution };
}
export function graphDefault(kind: GraphKind, i: number) {
  graphCase(i);
  switch (kind) {
    case 'axes':
      return 4;
    case 'reading':
      return [2, 3, 5][i]!;
    case 'gradient':
      return 1;
    case 'area':
      return 6;
    case 'linear':
      return i === 2 ? 200 : 100;
    case 'curve':
      return i === 0 ? 1 : 4;
    case 'experiment':
      return i === 1 ? 2 : 0;
  }
}
