export const magneticKinds = [
  'materials',
  'poles',
  'field',
  'earth',
  'wire',
  'coil',
  'motor',
  'generator',
] as const;
export type MagneticKind = (typeof magneticKinds)[number];
export type Vector = { x: number; y: number };
const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite magnetic model inputs required');
};
export function magneticCase(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid magnetic comparison');
}
function signCheck(sign: number) {
  if (![0, 1, -1].includes(sign)) throw new RangeError('Invalid polarity');
}
export const magneticMaterials = [
  { zh: '普通钢片', en: 'Plain steel', attracted: true },
  { zh: '铝片', en: 'Aluminium', attracted: false },
  { zh: '木片', en: 'Wood', attracted: false },
] as const;
/** Qualitative prescribed samples: not a material-identification or force simulator. */
export function materialCase(index: number) {
  magneticCase(index);
  return magneticMaterials[index]!;
}
/** Held ideal bar magnets. Splitting gives two new N/S pairs, not separated poles. */
export function poleCase(index: number) {
  magneticCase(index);
  const left = ['S', 'N'] as const;
  const right = index === 1 ? (['N', 'S'] as const) : (['S', 'N'] as const);
  return {
    left,
    right,
    split: index === 2,
    attraction: left[1] !== right[0],
    facing: `${left[1]} / ${right[0]}`,
  };
}
export function bearing(v: Vector) {
  finite(v.x, v.y);
  return Math.hypot(v.x, v.y) === 0
    ? null
    : (Math.atan2(v.x, v.y) * 180) / Math.PI;
}
/** Normalized point-dipole far-field map, x right/east and y up/north. Interior excluded. */
export function dipoleField(x: number, y: number, polarity = 1): Vector {
  finite(x, y);
  signCheck(polarity);
  if (polarity === 0) throw new RangeError('Permanent magnet needs a polarity');
  const r = Math.hypot(x, y);
  if (r < 0.9 - 1e-12 || r > 10)
    throw new RangeError('Probe must remain in the declared exterior map');
  const factor = polarity / r ** 3;
  return {
    x: factor * (3 * (x / r) ** 2 - 1),
    y: factor * 3 * (x / r) * (y / r),
  };
}
export const fieldAngles = [90, 0, 45] as const;
export function fieldProbe(angle: number, polarity = 1) {
  finite(angle);
  if (angle < 0 || angle > 360) throw new RangeError('Probe angle outside map');
  const a = (angle * Math.PI) / 180,
    x = 1.5 * Math.cos(a),
    y = 1.5 * Math.sin(a);
  const field = dipoleField(x, y, polarity);
  return { x, y, field, heading: bearing(field)! };
}
/** Exact exterior meridian curves of the same ideal dipole: r=k sin²θ. */
export function dipoleLine(k: number, upper = true): Vector[] {
  finite(k);
  if (k < 1 || k > 4 || typeof upper !== 'boolean')
    throw new RangeError('Invalid exterior field line');
  const start = Math.asin(Math.sqrt(0.9 / k));
  return Array.from({ length: 101 }, (_, i) => {
    const theta = start + ((Math.PI - 2 * start) * i) / 100,
      r = k * Math.sin(theta) ** 2;
    return {
      x: r * Math.cos(theta),
      y: (upper ? 1 : -1) * r * Math.sin(theta),
    };
  });
}
export const earthDistances = [null, 1, 3] as const;
/** Assigned local horizontal Earth field (0,1), plus a sideways dipole disturbance. */
export function earthCompass(distance: number | null) {
  if (distance !== null) {
    finite(distance);
    if (distance < 1 || distance > 4)
      throw new RangeError('Distance must be 1–4 relative units');
  }
  const east = distance === null ? 0 : 2 / distance ** 3;
  const total = { x: east, y: 1 };
  return { distance, east, total, heading: bearing(total)! };
}
/** Long straight wire viewed end-on; + current out of page creates counterclockwise field.
 * Fixed normalized background (0,1) remains present even when wire current is zero. */
export function wireCompass(current: number, distance: number) {
  signCheck(current);
  finite(distance);
  if (distance < 0.75 || distance > 3)
    throw new RangeError('Distance must be 0.75–3 relative units');
  const wire = { x: current === 0 ? 0 : -current / distance, y: 0 },
    total = { x: wire.x, y: 1 };
  return { current, distance, wire, total, heading: bearing(total)! };
}
export const coilCases = [
  { current: 0, iron: true },
  { current: 0.2, iron: false },
  { current: 0.2, iron: true },
] as const;
/** Ideal regulated-current comparison. Assigned soft-iron factor 3, no saturation/remanence. */
export function coilField(
  turns: number,
  current: number,
  iron: boolean,
  polarity = 1,
) {
  finite(turns, current);
  signCheck(polarity);
  if (polarity === 0) throw new RangeError('Winding direction must be nonzero');
  if (
    !Number.isInteger(turns) ||
    turns < 10 ||
    turns > 40 ||
    current < 0 ||
    current > 0.4 ||
    typeof iron !== 'boolean'
  )
    throw new RangeError('Invalid coil setting');
  const ampereTurns = turns * current,
    relative = (ampereTurns / 4) * (iron ? 3 : 1);
  return {
    turns,
    current,
    iron,
    ampereTurns,
    relative,
    rightPole:
      current === 0 || polarity === 0 ? null : polarity > 0 ? 'N' : 'S',
    signedField: polarity * relative,
  };
}
export const motorSupplies = [1, 0, -1] as const;
/** Top view: x right, z down, +y toward viewer. Active conductor at +(a sinθ,a cosθ)
 * carries +y for positive coil current. Fz=-N I L B; commutation keeps shaft torque sign.
 * A prescribed rotation is illustrated, never solved as RPM or acceleration. */
export function motorReading(supply: number, angle: number) {
  signCheck(supply);
  finite(angle);
  if (Math.abs(angle) > 10000)
    throw new RangeError('Angle outside illustration');
  const radians = (angle * Math.PI) / 180,
    sine = Math.sin(radians),
    cosine = Math.cos(radians);
  const current = Math.abs(sine) < 1e-10 ? 0 : supply * Math.sign(sine) * 0.2;
  const forceZ = current === 0 ? 0 : -20 * current * 0.1 * 0.4;
  const x = 0.05 * sine,
    z = 0.05 * cosine,
    torque = current === 0 ? 0 : -2 * x * forceZ;
  return {
    angle,
    current,
    supplyCurrent: supply * 0.2,
    forceZ,
    x,
    z,
    torque,
    deadPoint: Math.abs(sine) < 1e-10,
  };
}
export const generatorCases = [
  { speed: 0, closed: true },
  { speed: 1, closed: true },
  { speed: 1, closed: false },
] as const;
/** Ideal AC generator with slip rings: N=20, B=.4 T, A=.01 m², R=10 Ω.
 * Positive controlled turn starts at maximum flux, e=-dΦ/dt. The assigned window
 * is 1.25 turns, so its end shows peak voltage rather than a misleading zero. */
export function generatorReading(
  speed: number,
  closed: boolean,
  progress: number,
) {
  finite(speed, progress);
  if (
    speed < 0 ||
    speed > 2 ||
    (speed > 0 && speed < 0.5) ||
    progress < 0 ||
    progress > 1 ||
    typeof closed !== 'boolean'
  )
    throw new RangeError('Invalid generator setting');
  const omega = 2 * Math.PI * speed,
    phase = speed === 0 ? 0 : 2.5 * Math.PI * progress;
  const seconds = speed === 0 ? 0 : phase / omega,
    flux = 0.08 * Math.cos(phase),
    peak = 0.08 * omega;
  const voltage = peak * Math.sin(phase),
    current = closed ? voltage / 10 : 0;
  const energy =
    !closed || speed === 0
      ? 0
      : (peak ** 2 / 10) * (seconds / 2 - Math.sin(2 * phase) / (4 * omega));
  return {
    speed,
    closed,
    phase,
    seconds,
    flux,
    peak,
    voltage,
    current,
    currentPeak: closed ? peak / 10 : 0,
    energy,
    mechanicalInput: energy,
    loadPower: voltage * current,
  };
}
