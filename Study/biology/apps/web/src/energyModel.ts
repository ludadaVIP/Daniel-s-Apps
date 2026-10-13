import { plantSugar } from './models';
export type LightCue = 0 | 1 | 2;
/** Qualitative prerequisites with suitable enzymes/temperature and no usable
 * reserve sustaining the depicted sugar-making route. No rate/yield inference. */
export function photosynthesisConditions(
  light: LightCue,
  water: boolean,
  carbon: boolean,
) {
  return plantSugar(light > 0, water, carbon);
}
export type EnergyCell = 'leaf' | 'root' | 'muscle';
export type CellEnvironment = 'day' | 'night' | 'noOxygen';
/** Viable representative cells with available sugar and suitable other conditions.
 * Missing oxygen removes only the depicted aerobic route, not all ATP pathways. */
export function respirationProfile(
  cell: EnergyCell,
  environment: CellEnvironment,
) {
  return {
    aerobic: environment !== 'noOxygen',
    photosynthesis: cell === 'leaf' && environment === 'day',
  };
}
export type CarbonPool = 'input' | 'processing' | 'output';
/** When carbon is supplied, six tracer identities remain in one schematic pool. Tour stages are
 * explanatory, not reaction timing; hydrogen/oxygen and intermediates omitted. */
export function carbonTracers(
  frame: number,
  possible: boolean,
  available = true,
): { id: number; pool: CarbonPool }[] {
  const pool =
    !possible || frame <= 0 ? 'input' : frame >= 3 ? 'output' : 'processing';
  return Array.from({ length: available ? 6 : 0 }, (_, id) => ({ id, pool }));
}
export type TransferPercent = 5 | 10 | 20;
export type BudgetLevel = {
  level: 'plant' | 'herbivore' | 'predator';
  incoming: number;
  next: number;
  detritus: number;
  heat: number;
};
/** Authored closed energy account, arbitrary E units and identical transfer
 * fractions for two links. Initial 1000E is plant organic chemical energy, not
 * incident sunlight. 20% goes to detritus; remainder after next-level transfer
 * is heat after respiration/work. Terminal level has no onward feeding link.
 * Detritus remains available to decomposers; not all non-transfer is heat. */
export function foodEnergyBudget(percent: TransferPercent): BudgetLevel[] {
  if (![5, 10, 20].includes(percent))
    throw new RangeError('Unsupported teaching transfer scenario');
  let incoming = 1000;
  return (['plant', 'herbivore', 'predator'] as const).map((level, i) => {
    const next = i < 2 ? (incoming * percent) / 100 : 0,
      detritus = incoming * 0.2,
      heat = incoming - next - detritus;
    const row = { level, incoming, next, detritus, heat };
    incoming = next;
    return row;
  });
}
