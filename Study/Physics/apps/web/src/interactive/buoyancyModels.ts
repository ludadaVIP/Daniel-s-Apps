import { liquidPressure, contactPressure } from './pressureModels';
const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite buoyancy-model values required');
};
export function displacedFluid(density: number, volumeMl: number, g = 10) {
  finite(density, volumeMl, g);
  if (density <= 0 || volumeMl < 0 || g <= 0)
    throw new RangeError('Invalid displaced fluid');
  const volumeM3 = volumeMl / 1_000_000,
    massKg = density * volumeM3,
    buoyancy = massKg * g;
  if (volumeMl > 0 && volumeM3 === 0) throw new RangeError('Volume underflow');
  finite(massKg, buoyancy);
  return { density, volumeMl, volumeM3, massKg, buoyancy, g };
}
function tendency(netUp: number, weight: number, buoyancy: number) {
  return Math.abs(netUp) <= 1e-10 * Math.max(1, weight, buoyancy)
    ? 'neutral'
    : netUp > 0
      ? 'up'
      : 'down';
}
/** Initial force on a fully submerged, rigid body released from rest; not a trajectory. */
export function submergedRelease(
  massKg: number,
  volumeMl: number,
  density = 1000,
) {
  finite(massKg, volumeMl, density);
  if (massKg <= 0 || volumeMl <= 0)
    throw new RangeError('Body mass and volume must be positive');
  const fluid = displacedFluid(density, volumeMl),
    weight = massKg * fluid.g,
    netUp = fluid.buoyancy - weight;
  const objectDensity = massKg / fluid.volumeM3;
  finite(weight, netUp, objectDensity);
  const state = tendency(netUp, weight, fluid.buoyancy);
  const equilibriumMl =
    state === 'up'
      ? (massKg / density) * 1_000_000
      : state === 'neutral'
        ? volumeMl
        : undefined;
  if (equilibriumMl !== undefined) finite(equilibriumMl);
  return {
    ...fluid,
    massKg,
    weight,
    netUp,
    state,
    objectDensity,
    equilibriumMl,
  };
}
export const releaseCases = [0.12, 0.2, 0.3] as const;
export const pressureBuoyancyCases = [
  { topDepth: 0.1, density: 1000 },
  { topDepth: 0.3, density: 1000 },
  { topDepth: 0.1, density: 1200 },
] as const;
/** Equal flat top/bottom areas, horizontal faces and cancelling side-force pairs. */
export function pressureUpthrust(topDepth: number, density: number) {
  const top = liquidPressure(density, topDepth),
    bottom = liquidPressure(density, topDepth + 0.1);
  const areaM2 = contactPressure(0, 10).areaM2,
    volumeMl = areaM2 * 0.1 * 1_000_000;
  const down = top.absolute * areaM2,
    up = bottom.absolute * areaM2,
    net = up - down;
  finite(down, up, net);
  return {
    topDepth,
    density,
    height: 0.1,
    areaCm2: 10,
    top,
    bottom,
    down,
    up,
    net,
    volumeMl,
  };
}
export const immersionCases = [0, 0.5, 1] as const;
/** A held 100 cm³ block in a 50 cm² graduated vessel, before any spill. */
export function immersionReading(fraction: number) {
  finite(fraction);
  if (fraction < 0 || fraction > 1)
    throw new RangeError('Immersion fraction must be 0–1');
  const before = 150,
    fullVolume = 100,
    submergedMl = fraction * fullVolume,
    after = before + submergedMl;
  return {
    before,
    after,
    fullVolume,
    submergedMl,
    fraction,
    ...displacedFluid(1000, submergedMl),
    vesselAreaCm2: 50,
    blockAreaCm2: 25,
    blockHeightCm: 4,
  };
}
export const archimedesCases = [
  { volume: 100, density: 1000 },
  { volume: 200, density: 1000 },
  { volume: 100, density: 1200 },
] as const;
/** Same 300 g prescribed body mass, held clear of the bottom by a vertical force meter. */
export function hangingBuoyancy(volume: number, density: number) {
  finite(volume, density);
  if (volume < 50 || volume > 200 || ![1000, 1200].includes(density))
    throw new RangeError('Outside teaching force-meter cases');
  const fluid = displacedFluid(density, volume),
    bodyMass = 0.3,
    weight = 3,
    tension = weight - fluid.buoyancy;
  return { ...fluid, bodyMass, weight, tension };
}
export const shipCases = [
  { box: false, cargo: 0 },
  { box: true, cargo: 0 },
  { box: true, cargo: 0.35 },
] as const;
/** Closed, rigid box hull. A sinking hull retains its excluded volume; no flooding shortcut. */
export function sealedShip(box: boolean, cargo: number) {
  finite(cargo);
  if (cargo < 0 || cargo > 0.5 || (!box && cargo !== 0))
    throw new RangeError('Teaching cargo must be 0–500 g');
  const capacityMl = box ? 500 : 120,
    dryMass = 0.3,
    release = submergedRelease(dryMass + cargo, capacityMl);
  const shownVolume = release.equilibriumMl ?? capacityMl,
    shownBuoyancy = displacedFluid(1000, shownVolume).buoyancy;
  return {
    ...release,
    box,
    cargo,
    dryMass,
    capacityMl,
    maximumBuoyancy: release.buoyancy,
    shownVolume,
    shownBuoyancy,
    shownNetUp: shownBuoyancy - release.weight,
  };
}
export const submarineCases = [0, 0.4, 0.8] as const;
export function submarineBallast(ballastKg: number) {
  finite(ballastKg);
  if (ballastKg < 0 || ballastKg > 0.8)
    throw new RangeError('Teaching tank holds 0–800 g ballast water');
  return {
    ...submergedRelease(1.6 + ballastKg, 2000),
    ballastKg,
    ballastMl: ballastKg * 1000,
    tankCapacityMl: 800,
    dryMass: 1.6,
  };
}
export const balloonCases = [1.2, 1.05, 0.9] as const;
/** Fully inflated, vented envelope; outside density and volume fixed, enclosed air mass changes. */
export function hotAirBalloon(insideDensity: number) {
  finite(insideDensity);
  if (insideDensity < 0.9 || insideDensity > 1.2)
    throw new RangeError('Teaching inside-air density must be 0.9–1.2 kg/m³');
  const volumeM3 = 10,
    outsideDensity = 1.2,
    equipmentMass = 2.5,
    insideMass = insideDensity * volumeM3;
  const massKg = equipmentMass + insideMass,
    weight = massKg * 10,
    buoyancy = outsideDensity * volumeM3 * 10,
    netUp = buoyancy - weight;
  return {
    volumeM3,
    outsideDensity,
    insideDensity,
    equipmentMass,
    insideMass,
    massKg,
    weight,
    buoyancy,
    netUp,
    state: tendency(netUp, weight, buoyancy),
  };
}
export const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
