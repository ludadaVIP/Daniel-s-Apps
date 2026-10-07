export function rollingMotion(
  initialSpeed: number,
  deceleration: number,
  time: number,
) {
  if (deceleration <= 0) throw new RangeError('Deceleration must be positive');
  const t = Math.max(0, Math.min(time, initialSpeed / deceleration));
  return {
    distance: initialSpeed * t - 0.5 * deceleration * t * t,
    speed: Math.max(0, initialSpeed - deceleration * t),
    stopTime: initialSpeed / deceleration,
    stopDistance: (initialSpeed * initialSpeed) / (2 * deceleration),
  };
}
export function raceTime(distance: number, speed: number) {
  if (speed <= 0) throw new RangeError('Speed must be positive');
  return distance / speed;
}
