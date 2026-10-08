import type { LiftingDesign } from './lifting';
import { designBounds } from './lifting';
import { leverLift } from './interactive/machineModels';
export const liftingArms = [10, 20, 40] as const;
/** Slow vertical forces on a light lever; aggregate loss, fixed 10 cm load arm, 15° stroke. */
export function liftingComparison(
  d: LiftingDesign,
  armCm = d.effortArmCm,
  progress = 1,
) {
  for (const [key, [min, max]] of Object.entries(designBounds)) {
    const value = d[key as keyof LiftingDesign];
    if (!Number.isFinite(value) || value < min || value > max)
      throw new RangeError('Invalid design goal');
  }
  if (
    !Number.isFinite(armCm) ||
    armCm < 10 ||
    armCm > 40 ||
    !Number.isFinite(progress) ||
    progress < 0 ||
    progress > 1
  )
    throw new RangeError('Invalid lever preview');
  const ideal = leverLift(armCm / 100, 0.1, d.weight),
    ratio = ideal.ratio;
  const force = ideal.force / d.efficiency,
    handTravelCm = ratio * d.heightCm,
    outputWork = (d.weight * d.heightCm) / 100,
    inputWork = outputWork / d.efficiency;
  const forceOK = force <= d.forceLimit + 1e-9,
    travelOK = handTravelCm <= d.travelLimitCm + 1e-9,
    strokeOK = d.heightCm <= ideal.loadRise * 100 + 1e-9,
    feasible = forceOK && travelOK && strokeOK;
  const p = feasible ? progress : 0,
    angle = Math.asin(Math.min(1, d.heightCm / 10)) * p;
  const currentLiftCm = 10 * Math.sin(angle),
    currentHandCm = ratio * currentLiftCm;
  return {
    armCm,
    ratio,
    force,
    handTravelCm,
    outputWork,
    inputWork,
    loss: inputWork - outputWork,
    maxLiftCm: ideal.loadRise * 100,
    forceOK,
    travelOK,
    strokeOK,
    feasible,
    angle,
    currentLiftCm,
    currentHandCm,
    currentInputWork: (force * currentHandCm) / 100,
    currentOutputWork: (d.weight * currentLiftCm) / 100,
  };
}
