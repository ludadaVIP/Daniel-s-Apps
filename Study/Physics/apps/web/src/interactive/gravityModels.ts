export type GravityLocation = 'earth' | 'moon';
export const SURFACE_GRAVITY: Record<GravityLocation, number> = {
  earth: 10,
  moon: 1.6,
};
function gravityAt(location: GravityLocation) {
  if (location !== 'earth' && location !== 'moon')
    throw new RangeError('Unknown gravity location');
  return SURFACE_GRAVITY[location];
}
export function gravityMeasurement(mass: number, location: GravityLocation) {
  const gravity = gravityAt(location);
  if (!Number.isFinite(mass) || mass <= 0 || mass > 100)
    throw new RangeError('Invalid model mass');
  const weight = mass * gravity;
  return {
    mass,
    gravity,
    weight,
    earthCalibratedReading: weight / SURFACE_GRAVITY.earth,
  };
}
export function balanceTilt(mass: number, reference: number) {
  gravityMeasurement(mass, 'earth');
  gravityMeasurement(reference, 'earth');
  return Math.max(-14, Math.min(14, (reference - mass) * 12));
}
export function gravityFall(
  mass: number,
  location: GravityLocation,
  height: number,
  time: number,
) {
  const measurement = gravityMeasurement(mass, location);
  if (
    !Number.isFinite(height) ||
    height <= 0 ||
    height > 20 ||
    !Number.isFinite(time)
  )
    throw new RangeError('Invalid fall observation');
  const landingTime = Math.sqrt((2 * height) / measurement.gravity);
  const elapsed = Math.max(0, Math.min(time, landingTime));
  const landed = time >= landingTime;
  return {
    ...measurement,
    time: elapsed,
    landingTime,
    landed,
    distance: landed ? height : 0.5 * measurement.gravity * elapsed ** 2,
    heightRemaining: landed
      ? 0
      : height - 0.5 * measurement.gravity * elapsed ** 2,
    speed: landed ? 0 : measurement.gravity * elapsed,
    impactSpeed: measurement.gravity * landingTime,
  };
}
