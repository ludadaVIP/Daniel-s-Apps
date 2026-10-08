/** Small-amplitude, one-dimensional teaching models. No spreading, loss or dispersion. */
export const SOUND_AIR_SPEED = 343;
export const SOUND_WATER_SPEED = 1480;
function bounded(n: number, min: number, max: number) {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Outside sound model bounds');
  return n;
}
export const soundMedia = [
  { zh: '空气 · 20°C', en: 'Air · 20°C', speed: SOUND_AIR_SPEED },
  { zh: '淡水 · 20°C', en: 'Fresh water · 20°C', speed: SOUND_WATER_SPEED },
  { zh: '真空', en: 'Vacuum', speed: undefined },
] as const;
export const sourceCases = [
  { zh: '振动 · 0.10 mm', en: 'Vibrating · 0.10 mm', amplitude: 0.1 },
  { zh: '振动 · 0.20 mm', en: 'Vibrating · 0.20 mm', amplitude: 0.2 },
  { zh: '从未启动', en: 'Never started', amplitude: 0 },
] as const;
export function arrivalTime(distance: number, speed: number | undefined) {
  bounded(distance, 0, 1000);
  if (speed === undefined) return undefined;
  return distance / bounded(speed, 1, 10000);
}
export function pulseDisplacement(
  x: number,
  elapsed: number,
  amplitudeMm: number,
  speed: number | undefined,
) {
  bounded(x, 0, 1000);
  bounded(elapsed, 0, 2);
  bounded(amplitudeMm, 0, 0.2);
  const arrival = arrivalTime(x, speed);
  if (arrival === undefined || amplitudeMm === 0) return 0;
  const localTime = elapsed - arrival;
  return localTime >= 0 && localTime <= 0.01
    ? amplitudeMm * Math.sin(2 * Math.PI * 200 * localTime)
    : 0;
}
export function toneModel(
  frequency: number,
  amplitude: number,
  seconds = 0.01,
) {
  bounded(frequency, 200, 800);
  bounded(amplitude, 0.25, 1);
  bounded(seconds, 0, 0.01);
  return {
    frequency,
    amplitude,
    periodMs: 1000 / frequency,
    cycles: frequency * seconds,
    wavelength: SOUND_AIR_SPEED / frequency,
    pressure: amplitude * Math.sin(2 * Math.PI * frequency * seconds),
    audioGain: 0.015 * amplitude,
  };
}
export const echoCases = [
  { distance: 17.15, frequency: 2000 },
  { distance: 34.3, frequency: 2000 },
  { distance: 34.3, frequency: 40000 },
] as const;
export function soundEcho(
  distance: number,
  frequency: number,
  elapsed: number,
) {
  bounded(distance, 0.001, 1000);
  bounded(frequency, 20, 100000);
  bounded(elapsed, 0, 10);
  const returnTime = (2 * distance) / SOUND_AIR_SPEED,
    time = Math.min(elapsed, returnTime),
    travelled = time * SOUND_AIR_SPEED;
  return {
    returnTime,
    travelled,
    position: travelled <= distance ? travelled : 2 * distance - travelled,
    returning: travelled >= distance,
    arrived: elapsed >= returnTime,
    ultrasound: frequency > 20000,
    wavelength: SOUND_AIR_SPEED / frequency,
  };
}
