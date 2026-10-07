const positive = (n: number) => Number.isFinite(n) && n > 0;
/** Static submerged volumes; the animation is illustrative, not a fluid solver. */
export function floatingState(
  objectDensity: number,
  waterDensity: number,
  volume = 100,
) {
  if (![objectDensity, waterDensity, volume].every(positive))
    throw new RangeError('Densities and volume must be positive');
  const mass = objectDensity * volume;
  const fraction = objectDensity / waterDensity;
  return {
    mass,
    floats: fraction < 1,
    neutral: fraction === 1,
    submergedFraction: Math.min(1, fraction),
    displacedVolume: Math.min(volume, mass / waterDensity),
    displacedWaterMass: Math.min(volume * waterDensity, mass),
  };
}
export const floatMaterials = {
  ice: { density: 0.917, color: '#b4d7e0' },
  wood: { density: 0.6, color: '#d2af7f' },
  rock: { density: 2.6, color: '#a3a1af' },
  plastic: { density: 1.01, color: '#bea8d4' },
} as const;
/** Equal clay mass. A dry open bowl excludes 300 cm³; flooding removes that space. */
export function boatState(shape: 'lump' | 'bowl', cargo: number) {
  if (!Number.isFinite(cargo) || cargo < 0)
    throw new RangeError('Cargo must be nonnegative');
  const clayMass = 100;
  const mass = clayMass + cargo;
  const dryVolume = shape === 'bowl' ? 300 : 50;
  const dryWaterCapacity = dryVolume; // fresh water: 1 g/cm³
  const status =
    mass < dryWaterCapacity
      ? 'floating'
      : mass === dryWaterCapacity
        ? 'at-rim'
        : 'sinking';
  const flooded = shape === 'bowl' && status === 'sinking';
  const solidVolume = 50 + cargo / 8; // clay 2 g/cm³; compact steel load 8 g/cm³
  const displacedWaterMass = status === 'sinking' ? solidVolume : mass;
  return {
    mass,
    clayMass,
    dryWaterCapacity,
    status,
    flooded,
    submergedFraction: Math.min(1, mass / dryWaterCapacity),
    displacedWaterMass,
  };
}
export function bounceParameters(
  height: number,
  restitution: number,
  gravity = 9.8,
) {
  if (
    !positive(height) ||
    !positive(gravity) ||
    !Number.isFinite(restitution) ||
    restitution < 0 ||
    restitution > 1
  )
    throw new RangeError('Invalid bounce conditions');
  const fallTime = Math.sqrt((2 * height) / gravity);
  const reboundSpeed = restitution * Math.sqrt(2 * gravity * height);
  return {
    fallTime,
    reboundHeight: height * restitution ** 2,
    retainedFraction: restitution ** 2,
    reboundSpeed,
    duration: fallTime + (2 * reboundSpeed) / gravity,
  };
}
export function bounceHeight(
  height: number,
  restitution: number,
  time: number,
) {
  const p = bounceParameters(height, restitution);
  const t = Math.max(0, time);
  if (t <= p.fallTime) return Math.max(0, height - 4.9 * t * t);
  const after = t - p.fallTime;
  if (t >= p.duration) return 0;
  return Math.max(0, p.reboundSpeed * after - 4.9 * after * after);
}
export function echoState(distance: number, speed = 343) {
  if (!positive(distance) || !positive(speed))
    throw new RangeError('Invalid sound path');
  const delay = (2 * distance) / speed;
  return { roundTrip: 2 * distance, delay, likelySeparate: delay >= 0.1 };
}
export function echoPosition(distance: number, elapsed: number, speed = 343) {
  const { delay } = echoState(distance, speed);
  const t = Math.max(0, Math.min(delay, elapsed));
  return t <= delay / 2 ? speed * t : 2 * distance - speed * t;
}
