export type RootCase = 'inward' | 'equal' | 'outward';
/** Total water potential ranks, not moisture percentage or measured pressure. */
export function rootExchange(condition: RootCase) {
  return {
    net: condition,
    direction:
      condition === 'inward'
        ? 'soil-to-root'
        : condition === 'outward'
          ? 'root-to-soil'
          : 'no-net',
    soilRank:
      condition === 'inward'
        ? 'higher'
        : condition === 'outward'
          ? 'lower'
          : 'equal',
    rootRank:
      condition === 'inward'
        ? 'lower'
        : condition === 'outward'
          ? 'higher'
          : 'equal',
  } as const;
}
export type PlantCargo = 'water' | 'leaf-sugar' | 'store-sugar';
export const plantRoutes = {
  water: {
    tissue: 'xylem',
    source: 'soil',
    sink: 'leaf',
    stops: ['soil', 'root', 'stem', 'leaf', 'air'],
  },
  'leaf-sugar': {
    tissue: 'phloem',
    source: 'mature-leaf',
    sink: 'root',
    stops: ['mature-leaf', 'loading', 'stem', 'unloading', 'root'],
  },
  'store-sugar': {
    tissue: 'phloem',
    source: 'root-store',
    sink: 'bud',
    stops: ['root-store', 'loading', 'stem', 'unloading', 'bud'],
  },
} as const;
export type Aperture = 'open' | 'narrow';
export type AirMoisture = 'drier' | 'humid';
/** Fixed light, temperature, wind and actively assimilating leaf. No computed rates. */
export function leafExchange(aperture: Aperture, air: AirMoisture) {
  return {
    carbonDirection: 'air-to-leaf',
    waterDirection: 'leaf-to-air',
    poreAccess: aperture === 'open' ? 'greater' : 'restricted',
    vapourDifference: air === 'drier' ? 'greater' : 'smaller',
    residualLossPossible: true,
  } as const;
}
export type PollenCase = 'compatible' | 'incompatible';
/** Compatible branch assumes successful tube growth and subsequent development. */
export function flowerState(pollen: PollenCase, frame: number) {
  const step = Math.min(5, Math.max(0, Math.floor(frame)));
  const compatible = pollen === 'compatible';
  return {
    step,
    pollenAtStigma: step >= 1,
    tube: compatible && step >= 2,
    spermInTube: compatible && step === 3,
    eggFusion: compatible && step >= 4,
    seed: compatible && step === 5,
    fruit: compatible && step === 5,
  };
}
