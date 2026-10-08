export const CART_MASS = 2;
function checkForce(force: number, time: number) {
  if (!Number.isFinite(force) || Math.abs(force) > 6 || !Number.isFinite(time))
    throw new RangeError('Invalid force observation');
}
export function forceCart(force: number, time: number, initialVelocity = 1) {
  checkForce(force, time);
  if (![0, 1].includes(initialVelocity))
    throw new RangeError('Invalid starting motion');
  const t = Math.max(0, Math.min(time, 2)),
    acceleration = force / CART_MASS;
  return {
    time: t,
    acceleration,
    velocity: initialVelocity + acceleration * t,
    position: 2 + initialVelocity * t + 0.5 * acceleration * t * t,
  };
}
export function springResponse(force: number) {
  if (!Number.isFinite(force) || Math.abs(force) > 2)
    throw new RangeError('Outside spring model range');
  return {
    force,
    changeCm: (force / 40) * 100,
    lengthCm: 20 + (force / 40) * 100,
  };
}
export function frictionBlock(
  force: number,
  time: number,
  initiallyMoving: boolean,
  rough: boolean,
) {
  checkForce(force, time);
  const t = Math.max(0, Math.min(time, 2)),
    initial = initiallyMoving ? 1 : 0,
    kinetic = rough ? 2 : 0,
    limit = rough ? 3 : 0;
  const fromRest = (elapsed: number, start: number) => {
    if (Math.abs(force) <= limit)
      return {
        position: start,
        velocity: 0,
        friction: force === 0 ? 0 : -force,
        netForce: 0,
        phase: 'sticking' as const,
      };
    const friction = kinetic === 0 ? 0 : -Math.sign(force) * kinetic,
      netForce = force + friction;
    return {
      position: start + ((0.5 * netForce) / CART_MASS) * elapsed ** 2,
      velocity: (netForce / CART_MASS) * elapsed,
      friction,
      netForce,
      phase: 'sliding' as const,
    };
  };
  if (!initial) return { time: t, ...fromRest(t, 2) };
  const friction = kinetic === 0 ? 0 : -kinetic,
    netForce = force + friction,
    acceleration = netForce / CART_MASS;
  const stopTime = acceleration < 0 ? -initial / acceleration : Infinity;
  if (t >= stopTime) {
    const stopPosition =
      2 + initial * stopTime + 0.5 * acceleration * stopTime ** 2;
    return { time: t, ...fromRest(t - stopTime, stopPosition) };
  }
  return {
    time: t,
    position: 2 + initial * t + 0.5 * acceleration * t ** 2,
    velocity: initial + acceleration * t,
    friction,
    netForce,
    phase: 'sliding' as const,
  };
}
export type PaperShape = 'flat' | 'crumpled';
const PAPER_MASS = 0.005,
  DROP_HEIGHT = 20,
  G = 10;
function dropAt(time: number, coefficient: number) {
  if (coefficient === 0)
    return { distance: 0.5 * G * time ** 2, velocity: G * time };
  const tau = PAPER_MASS / coefficient,
    terminal = G * tau;
  return {
    distance: terminal * (time + tau * Math.expm1(-time / tau)),
    velocity: -terminal * Math.expm1(-time / tau),
  };
}
export function paperDrop(shape: PaperShape, air: boolean, time: number) {
  if (!['flat', 'crumpled'].includes(shape) || !Number.isFinite(time))
    throw new RangeError('Invalid paper drop');
  const coefficient = air ? (shape === 'flat' ? 0.01 : 0.001) : 0;
  let lo = 0,
    hi = 10;
  for (let i = 0; i < 60; i++) {
    const middle = (lo + hi) / 2;
    if (dropAt(middle, coefficient).distance < DROP_HEIGHT) lo = middle;
    else hi = middle;
  }
  const landingTime = (lo + hi) / 2,
    t = Math.max(0, Math.min(time, landingTime)),
    state = dropAt(t, coefficient),
    landed = time >= landingTime;
  return {
    time: t,
    landingTime,
    landed,
    distance: landed ? DROP_HEIGHT : state.distance,
    velocity: landed ? 0 : state.velocity,
    gravity: PAPER_MASS * G,
    drag: landed ? 0 : coefficient * state.velocity,
    coefficient,
    mass: PAPER_MASS,
    height: DROP_HEIGHT,
  };
}
