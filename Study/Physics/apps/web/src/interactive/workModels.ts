import { gravitationalEnergy } from './energyModels';

const finite = (n: number) => {
  if (!Number.isFinite(n)) throw new RangeError('Expected a finite number');
  return n;
};
const positive = (n: number) => {
  if (finite(n) <= 0) throw new RangeError('Expected a positive number');
  return n;
};
const nonnegative = (n: number) => {
  if (finite(n) < 0) throw new RangeError('Expected a nonnegative number');
  return n;
};
export const workScenarios = [
  { id: 'push', force: [6, 0], displacement: [2, 0] },
  { id: 'hold', force: [0, 20], displacement: [0, 0] },
  { id: 'carry', force: [0, 20], displacement: [2, 0] },
  { id: 'lift', force: [0, 20], displacement: [0, 1] },
  { id: 'lower', force: [0, 20], displacement: [0, -1] },
] as const;

// Constant force on an object in the ground frame. Coordinates: right/up positive.
export function forceWork(fx: number, fy: number, dx: number, dy: number) {
  return finite(finite(fx) * finite(dx) + finite(fy) * finite(dy));
}
export function pushLedger(force: number, distance: number) {
  nonnegative(force);
  nonnegative(distance);
  const applied = forceWork(force, 0, distance, 0);
  return {
    applied,
    friction: -applied,
    net: 0,
    kineticChange: 0,
    thermal: applied,
  };
}
export function averagePower(work: number, seconds: number) {
  return finite(finite(work) / positive(seconds));
}
export function liftingTask(
  mass: number,
  height: number,
  duration: number,
  g = 10,
) {
  positive(mass);
  nonnegative(height);
  positive(duration);
  positive(g);
  const work = gravitationalEnergy(mass, height, 0, g);
  return { mass, height, duration, work, power: averagePower(work, duration) };
}
// Prescribed constant-speed lift during its task interval, acceleration ramps omitted.
export function liftingSnapshot(
  mass: number,
  height: number,
  duration: number,
  elapsed: number,
) {
  const task = liftingTask(mass, height, duration);
  nonnegative(elapsed);
  const time = Math.min(elapsed, duration),
    fraction = time / duration;
  return {
    ...task,
    time,
    raised: finite(height * fraction),
    doneWork: finite(task.work * fraction),
    finished: elapsed >= duration,
  };
}
// Nonrotating load, steady upward motion. Applied force and friction are along the ramp.
export function rampTask(
  mass: number,
  height: number,
  length: number,
  friction = 0,
  g = 10,
) {
  positive(mass);
  positive(height);
  positive(length);
  nonnegative(friction);
  positive(g);
  if (length < height)
    throw new RangeError('Ramp length cannot be less than its rise');
  const useful = gravitationalEnergy(mass, height, 0, g);
  const gravityComponent = finite(useful / length),
    force = finite(gravityComponent + friction);
  const input = finite(force * length),
    thermal = finite(friction * length);
  const horizontal = finite(
    length * Math.sqrt(Math.max(0, 1 - (height / length) ** 2)),
  );
  return {
    mass,
    height,
    length,
    friction,
    force,
    horizontal,
    input,
    useful,
    thermal,
    efficiency: finite(useful / positive(input)),
  };
}
