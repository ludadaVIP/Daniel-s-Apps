const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite machine values required');
};
const progressCheck = (progress: number) => {
  finite(progress);
  if (progress < 0 || progress > 1)
    throw new RangeError('Progress must be 0–1');
};
/** Massless hinged bar, opposed vertical forces, controlled quasistatic 0–15° stroke. */
export function leverLift(
  effortArm: number,
  loadArm: number,
  weight = 30,
  progress = 1,
) {
  finite(effortArm, loadArm, weight);
  progressCheck(progress);
  if (effortArm <= 0 || loadArm <= 0 || weight <= 0)
    throw new RangeError('Positive lever arms and load required');
  const angle = (progress * Math.PI) / 12,
    force = (weight * loadArm) / effortArm,
    loadRise = loadArm * Math.sin(angle),
    effortTravel = effortArm * Math.sin(angle),
    inputWork = force * effortTravel,
    outputWork = weight * loadRise,
    support = force + weight,
    loadMoment = weight * loadArm * Math.cos(angle),
    effortMoment = force * effortArm * Math.cos(angle);
  finite(
    force,
    loadRise,
    effortTravel,
    inputWork,
    outputWork,
    support,
    loadMoment,
    effortMoment,
  );
  return {
    effortArm,
    loadArm,
    weight,
    angle,
    force,
    loadRise,
    effortTravel,
    inputWork,
    outputWork,
    support,
    loadMoment,
    effortMoment,
    ratio: effortArm / loadArm,
  };
}
export const leverCases = [0.1, 0.2, 0.4] as const;
/** A fixed instantaneous wrench pose; angle from pivot-to-contact vector to force. */
export function turningEffect(
  radius: number,
  force: number,
  angleDegrees: number,
) {
  finite(radius, force, angleDegrees);
  if (radius <= 0 || force <= 0 || Math.abs(angleDegrees) > 180)
    throw new RangeError('Invalid torque conditions');
  const radians = (angleDegrees * Math.PI) / 180,
    signedMoment = radius * force * Math.sin(radians),
    perpendicularArm = Math.abs(radius * Math.sin(radians)),
    footX = radius * Math.sin(radians) ** 2,
    footY = -radius * Math.sin(radians) * Math.cos(radians);
  finite(signedMoment, perpendicularArm, footX, footY);
  return {
    radius,
    force,
    angleDegrees,
    radians,
    signedMoment,
    perpendicularArm,
    footX,
    footY,
  };
}
export const turningCases = [
  { radius: 0.2, angle: 90 },
  { radius: 0.1, angle: 90 },
  { radius: 0.2, angle: 0 },
] as const;
/** Fixed, single moving, or two-moving-wheel block; loss is an aggregate energy model. */
export function ropeHoist(
  strands: number,
  weight = 40,
  height = 0.25,
  efficiency = 1,
  progress = 1,
) {
  finite(strands, weight, height, efficiency);
  progressCheck(progress);
  if (
    ![1, 2, 4].includes(strands) ||
    weight <= 0 ||
    height <= 0 ||
    efficiency <= 0 ||
    efficiency > 1
  )
    throw new RangeError('Invalid hoist conditions');
  const force = weight / (strands * efficiency),
    lift = height * progress,
    pull = strands * lift,
    outputWork = weight * lift,
    inputWork = force * pull,
    loss = inputWork - outputWork,
    advantage = weight / force;
  finite(force, lift, pull, outputWork, inputWork, loss, advantage);
  return {
    strands,
    weight,
    height,
    efficiency,
    progress,
    force,
    lift,
    pull,
    outputWork,
    inputWork,
    loss,
    advantage,
  };
}
export const pulleyCases = [1, 2, 4] as const;
export const efficiencyCases = [1, 0.8, 0.5] as const;
/** Two external gears, identical tooth pitch, fixed axes, ideal steady torque transfer. */
export function externalGears(
  inputTeeth: number,
  outputTeeth: number,
  rpm = 6,
  inputTorque = 2,
  inputTurns = 1,
) {
  finite(inputTeeth, outputTeeth, rpm, inputTorque, inputTurns);
  if (
    ![inputTeeth, outputTeeth].every(
      (v) => Number.isInteger(v) && v >= 2 && v <= 240,
    ) ||
    rpm <= 0 ||
    inputTorque <= 0 ||
    inputTurns < 0
  )
    throw new RangeError('Invalid gear conditions');
  const speedRatio = inputTeeth / outputTeeth,
    outputRpm = -rpm * speedRatio,
    outputTurns = -inputTurns * speedRatio,
    outputTorque = inputTorque / speedRatio,
    powerIn = (inputTorque * rpm * Math.PI) / 30,
    powerOut = (outputTorque * Math.abs(outputRpm) * Math.PI) / 30;
  finite(outputRpm, outputTurns, outputTorque, powerIn, powerOut);
  return {
    inputTeeth,
    outputTeeth,
    rpm,
    inputTorque,
    inputTurns,
    speedRatio,
    outputRpm,
    outputTurns,
    outputTorque,
    powerIn,
    powerOut,
  };
}
export const gearCases = [12, 24, 36] as const;
