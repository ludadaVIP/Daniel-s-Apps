import { blockVolume, displacedVolume } from './measurementSkills';
import { floatingState } from './mysteryModels';
export const DENSITY_SAMPLES = {
  wood: { density: 0.6, color: '#d4b387' },
  aluminium: { density: 2.7, color: '#babcc8' },
  steel: { density: 7.8, color: '#9e9fab' },
} as const;
export type DensitySample = keyof typeof DENSITY_SAMPLES;
export function densitySample(sample: DensitySample, volume: number) {
  if (
    !Object.hasOwn(DENSITY_SAMPLES, sample) ||
    !Number.isFinite(volume) ||
    volume <= 0 ||
    volume > 1000
  )
    throw new RangeError('Invalid density sample');
  const selected = DENSITY_SAMPLES[sample];
  return { ...selected, volume, mass: selected.density * volume };
}
export function densityReading(mass: number, volume: number, si = false) {
  if (
    !Number.isFinite(mass) ||
    !Number.isFinite(volume) ||
    mass <= 0 ||
    volume <= 0 ||
    mass > 10000 ||
    volume > 10000
  )
    throw new RangeError('Invalid density readings');
  return {
    mass: si ? mass / 1000 : mass,
    volume: si ? volume / 1_000_000 : volume,
    density: (mass / volume) * (si ? 1000 : 1),
    massUnit: si ? 'kg' : 'g',
    volumeUnit: si ? 'm³' : 'cm³',
    densityUnit: si ? 'kg/m³' : 'g/cm³',
  };
}
export function regularDensity(long: boolean, si = false) {
  const sides = [long ? 10 : 5, 2, 2] as const;
  const volume = blockVolume(...sides),
    sample = densitySample('aluminium', volume);
  return {
    ...sample,
    sides,
    ...densityReading(sample.mass, volume, si),
    volumeCm3: volume,
    massG: sample.mass,
  };
}
export type ImmersionCase = 'partial' | 'full' | 'bubble';
export function irregularDensity(condition: ImmersionCase) {
  if (!['partial', 'full', 'bubble'].includes(condition))
    throw new RangeError('Invalid immersion condition');
  const before = 40,
    after = condition === 'partial' ? 52 : condition === 'bubble' ? 64 : 60,
    mass = 54;
  const apparentVolume = displacedVolume(before, after);
  return {
    before,
    after,
    mass,
    apparentVolume,
    apparentDensity: mass / apparentVolume,
    valid: condition === 'full',
    trueVolume: 20,
    bubbleVolume: condition === 'bubble' ? 4 : 0,
  };
}
export function densityFloat(density: number, salt: boolean) {
  if (![0.6, 1, 1.02].includes(density))
    throw new RangeError('Invalid floating sample');
  const fluidDensity = salt ? 1.05 : 1;
  return {
    ...floatingState(density, fluidDensity, 20),
    density,
    fluidDensity,
    volume: 20,
  };
}
