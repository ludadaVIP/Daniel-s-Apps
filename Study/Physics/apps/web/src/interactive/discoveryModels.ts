type Point = { x: number; y: number };
export function mirrorRay(object: Point, eye: Point, mirrorX: number) {
  if (
    ![object.x, object.y, eye.x, eye.y, mirrorX].every(Number.isFinite) ||
    object.x >= mirrorX ||
    eye.x >= mirrorX
  )
    throw new RangeError('Object and eye must be in front of mirror');
  const image = { x: 2 * mirrorX - object.x, y: object.y };
  const ratio = (mirrorX - eye.x) / (image.x - eye.x);
  return {
    image,
    reflection: { x: mirrorX, y: eye.y + (image.y - eye.y) * ratio },
    objectDistance: mirrorX - object.x,
    imageDistance: image.x - mirrorX,
  };
}
export type Charge = -1 | 0 | 1;
export function polarizedWall(charge: Charge) {
  if (![-1, 0, 1].includes(charge)) throw new RangeError('Invalid charge sign');
  return { near: -charge, far: charge, total: 0 };
}
export function brakingState(
  time: number,
  belt: boolean,
  speed = 2,
  deceleration = 5,
  gap = 1,
) {
  if (
    ![time, speed, deceleration, gap].every(Number.isFinite) ||
    speed <= 0 ||
    deceleration <= 0 ||
    gap <= 0
  )
    throw new RangeError('Invalid braking conditions');
  const stopTime = speed / deceleration,
    stopDistance = speed ** 2 / (2 * deceleration);
  const contactTime =
    gap <= stopDistance
      ? Math.sqrt((2 * gap) / deceleration)
      : (gap + stopDistance) / speed;
  const t = Math.max(0, Math.min(time, belt ? stopTime : contactTime));
  const brakingTime = Math.min(t, stopTime);
  const vehicleDistance =
    speed * brakingTime - 0.5 * deceleration * brakingTime ** 2;
  const vehicleSpeed = Math.max(0, speed - deceleration * t);
  const contact = !belt && t >= contactTime;
  return {
    stopTime,
    contactTime,
    vehicleDistance,
    vehicleSpeed,
    passengerDistance: belt ? vehicleDistance : speed * t,
    passengerSpeed: belt ? vehicleSpeed : contact ? null : speed,
    preContactSpeed: speed,
    contact,
    relativeDistance: belt ? 0 : speed * t - vehicleDistance,
  };
}
export function fairTestResult(speed: number, rough: boolean) {
  if (![2, 3].includes(speed))
    throw new RangeError('Choose a model starting speed');
  return {
    speed,
    rough,
    deceleration: rough ? 2 : 0.5,
    distance: speed ** 2 / (2 * (rough ? 2 : 0.5)),
  };
}
