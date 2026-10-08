const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite pressure-model values required');
};
const result = (...values: number[]) => {
  finite(...values);
  return values;
};
export function contactPressure(force: number, areaCm2: number) {
  finite(force, areaCm2);
  if (force < 0 || areaCm2 <= 0)
    throw new RangeError(
      'Compression force must be nonnegative; area positive',
    );
  const areaM2 = areaCm2 / 10000,
    pascals = force / areaM2;
  if (areaM2 === 0) throw new RangeError('Area underflow');
  result(pascals);
  return {
    force,
    areaCm2,
    areaM2,
    pascals,
    kPa: pascals / 1000,
    forcePerCm2: force / areaCm2,
  };
}
export const contactCases = [
  { force: 60, area: 30 },
  { force: 60, area: 60 },
  { force: 120, area: 30 },
] as const;
export const shoeCases = [
  { area: 200, zh: '平底接触', en: 'Flat contact' },
  { area: 20, zh: '窄小接触', en: 'Narrow contact' },
  { area: 1000, zh: '雪鞋接触', en: 'Snowshoe contact' },
] as const;
export function contactTiles(force: number, area: number) {
  if (!Number.isInteger(area) || area < 30 || area > 60 || area % 10 !== 0)
    throw new RangeError('Tile model uses 30–60 cm² in rows of ten');
  const m = contactPressure(force, area);
  return Array.from({ length: area }, (_, i) => ({
    column: i % 10,
    row: Math.floor(i / 10),
    areaCm2: 1,
    force: m.forcePerCm2,
  }));
}
export function footprintPair(area: number) {
  const m = contactPressure(600, area),
    widthCm = Math.sqrt(area / 6),
    lengthCm = 3 * widthCm;
  result(widthCm, lengthCm);
  return { ...m, widthCm, lengthCm, forceEach: 300 };
}
export const liquidCases = [
  { depth: 0.1, density: 1000 },
  { depth: 0.3, density: 1000 },
  { depth: 0.3, density: 1200 },
] as const;
export function liquidPressure(
  density: number,
  depth: number,
  surfacePressure = 101000,
  g = 10,
) {
  finite(density, depth, surfacePressure, g);
  if (density <= 0 || depth < 0 || surfacePressure < 0 || g <= 0)
    throw new RangeError('Invalid liquid conditions');
  const increment = density * g * depth,
    absolute = surfacePressure + increment;
  result(increment, absolute);
  return {
    depth,
    density,
    increment,
    absolute,
    incrementKPa: increment / 1000,
    absoluteKPa: absolute / 1000,
  };
}
export function pressureDifference(
  outside: number,
  inside: number,
  areaCm2: number,
) {
  finite(outside, inside, areaCm2);
  if (outside < 0 || inside < 0 || areaCm2 <= 0)
    throw new RangeError('Invalid pressure/area');
  const outsideForce = contactPressure(0, areaCm2).areaM2 * outside,
    insideForce = (areaCm2 / 10000) * inside;
  result(outsideForce, insideForce, outsideForce - insideForce);
  return {
    outside,
    inside,
    areaCm2,
    outsideForce,
    insideForce,
    difference: outside - inside,
    netInward: outsideForce - insideForce,
  };
}
export const atmosphereCases = [101000, 81000, 61000] as const;
export const strawCases = [
  { surface: 101000, mouth: 99000, vented: true },
  { surface: 101000, mouth: 101000, vented: true },
  { surface: 99000, mouth: 99000, vented: false },
] as const;
export function strawColumn(
  surface: number,
  mouth: number,
  density = 1000,
  g = 10,
) {
  finite(surface, mouth, density, g);
  if (surface < 0 || mouth < 0 || density <= 0 || g <= 0)
    throw new RangeError('Invalid straw conditions');
  const difference = surface - mouth,
    signedHeight = difference / density / g;
  result(difference, signedHeight);
  return { difference, signedHeight, aboveSurface: Math.max(0, signedHeight) };
}
export const syringeCases = [20, 10, 5] as const;
export function gasSyringe(volumeMl: number, vented = false) {
  finite(volumeMl);
  if (volumeMl < 5 || volumeMl > 20)
    throw new RangeError('Teaching syringe uses 5–20 mL');
  const initialVolume = 20,
    outside = 101000,
    areaCm2 = 2,
    absolute = vented ? outside : (outside * initialVolume) / volumeMl;
  const forces = pressureDifference(outside, absolute, areaCm2);
  return {
    volumeMl,
    vented,
    initialVolume,
    absolute,
    kPa: absolute / 1000,
    gauge: absolute - outside,
    holdingForce: forces.insideForce - forces.outsideForce,
    pressureVolume: absolute * volumeMl,
    outside,
    areaCm2,
  };
}
export function prescribedContact(force: number, area: number) {
  return contactCases.findIndex((c) => c.force === force && c.area === area);
}
export function prescribedLiquid(depth: number, density: number) {
  return liquidCases.findIndex(
    (c) => Math.abs(c.depth - depth) < 1e-9 && c.density === density,
  );
}
