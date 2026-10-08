const finite = (...values: number[]) => {
  if (values.some((v) => !Number.isFinite(v)))
    throw new RangeError('Finite inputs required');
};
const positive = (v: number) => {
  finite(v);
  if (v <= 0) throw new RangeError('Positive value required');
  return v;
};
const nonnegative = (v: number) => {
  finite(v);
  if (v < 0) throw new RangeError('Nonnegative value required');
  return v;
};
const result = (v: number) => {
  finite(v);
  return v;
};
export function absoluteTemperature(celsius: number) {
  finite(celsius);
  return positive(celsius + 273.15);
}
/** Same ideal monatomic gas; normalized to the small sample at 20 °C. */
export function gasComparison(celsius: number, amount: number) {
  const k = absoluteTemperature(celsius);
  positive(amount);
  return {
    kelvin: k,
    speedScale: Math.sqrt(k / 293.15),
    relativeInternal: result((amount * k) / 293.15),
  };
}
/** Schematic points, paired opposite velocities; inspection phase is not physical time. */
export function gasDots(celsius: number, amount: 1 | 2, phase: number) {
  const { speedScale } = gasComparison(celsius, amount);
  if (amount !== 1 && amount !== 2)
    throw new RangeError('One or two sample portions');
  finite(phase);
  if (phase < 0 || phase > 1) throw new RangeError('Phase 0–1');
  const reflect = (value: number, length: number) => {
    const p = ((value % (2 * length)) + 2 * length) % (2 * length);
    return p <= length ? p : 2 * length - p;
  };
  return Array.from({ length: 8 * amount }, (_, i) => {
    const pair = Math.floor(i / 2) % 4,
      sign = i % 2 ? -1 : 1,
      vx = sign * (16 + pair * 8) * speedScale,
      vy = sign * (12 + (pair % 3) * 7) * speedScale;
    return {
      x: 95 + reflect(25 + ((i * 53) % 355) + vx * phase * 5, 410),
      y: 65 + reflect(15 + ((i * 37) % 110) + vy * phase * 5, 145),
      vx,
      vy,
    };
  });
}
export function waterHeating(massKg: number, joules: number, initial = 20) {
  positive(massKg);
  nonnegative(joules);
  absoluteTemperature(initial);
  if (initial < 0 || initial >= 100)
    throw new RangeError('Liquid-water interval 0–100 °C');
  const capacity = result(massKg * 4200),
    rise = result(joules / capacity),
    temperature = result(initial + rise);
  if (temperature >= 100)
    throw new RangeError('Liquid-water model below boiling');
  return { capacity, rise, temperature, internalIncrease: joules };
}
/** Lumped object cooling/warming in a fixed-temperature bath; no evaporation or phase change. */
export function coolingSample(
  initial: number,
  ambient: number,
  conductance: number,
  seconds: number,
  capacity = 420,
) {
  absoluteTemperature(initial);
  absoluteTemperature(ambient);
  positive(conductance);
  positive(capacity);
  nonnegative(seconds);
  const temperature = result(
      ambient +
        (initial - ambient) * Math.exp((-conductance * seconds) / capacity),
    ),
    internalChange = result(capacity * (temperature - initial));
  return { temperature, internalChange, netOut: -internalChange };
}
export const cupCases = [
  { initial: 60, ambient: 20 },
  { initial: 60, ambient: 40 },
  { initial: 10, ambient: 20 },
] as const;
export function cupSnapshot(caseIndex: number, seconds: number) {
  const c = cupCases[caseIndex];
  if (!c) throw new RangeError('Known cup case');
  return {
    bare: coolingSample(c.initial, c.ambient, 0.7, seconds),
    wrapped: coolingSample(c.initial, c.ambient, 0.14, seconds),
  };
}
/** Wet-surface teaching balance: fixed C and room conductance, prescribed constant net evaporation.
 * Latent energy leaves with evaporated water; room transfer replenishes part of the surface loss.
 * Valid only for this five-minute, still-wet interval. Not a humidity/airflow or human-skin prediction. */
export function wetSurface(rateGramsPerMinute: number, seconds: number) {
  nonnegative(rateGramsPerMinute);
  nonnegative(seconds);
  if (rateGramsPerMinute > 0.2 || seconds > 300)
    throw new RangeError('Five-minute teaching interval');
  const initialWater = 2,
    capacity = 200,
    conductance = 0.5,
    latentPerGram = 2400,
    evaporated = result((rateGramsPerMinute * seconds) / 60),
    latent = result(evaporated * latentPerGram),
    evaporativePower = result((rateGramsPerMinute / 60) * latentPerGram);
  const deficit =
      (evaporativePower / conductance) *
      -Math.expm1((-conductance * seconds) / capacity),
    temperature = 20 - deficit,
    internalChange = -capacity * deficit,
    roomIn = result(Math.max(0, latent + internalChange));
  return {
    temperature,
    waterRemaining: initialWater - evaporated,
    evaporated,
    latent,
    internalChange,
    roomIn,
  };
}
export const transferPaths = [
  { id: 'conduction', movingMatter: false, requiresMatter: true },
  { id: 'convection', movingMatter: true, requiresMatter: true },
  { id: 'radiation', movingMatter: false, requiresMatter: false },
] as const;
