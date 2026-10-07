export const solutionSpecificHeat = 4.18; // J/(g °C), school approximation

/** Authored virtual records, not experimental measurements or a kinetic model. */
export const calorimetryRecords = [
  { volumeEachMl: 50, initialC: 25, finalC: 31.8, heatLoss: false },
  { volumeEachMl: 100, initialC: 25, finalC: 31.8, heatLoss: false },
  { volumeEachMl: 50, initialC: 25, finalC: 30.6, heatLoss: true },
] as const;

export function solutionHeat(massG: number, initialC: number, finalC: number) {
  if (![massG, initialC, finalC].every(Number.isFinite) || massG <= 0)
    throw new RangeError(
      'Use a positive solution mass and finite temperatures.',
    );
  return massG * solutionSpecificHeat * (finalC - initialC);
}

export function calorimetryLedger(record: (typeof calorimetryRecords)[number]) {
  const massG = 2 * record.volumeEachMl; // density 1.00 g/mL; additive volumes
  const reactedMol = record.volumeEachMl / 1000; // both 1.00 mol/L; 1:1
  const solutionJ = solutionHeat(massG, record.initialC, record.finalC);
  return {
    massG,
    reactedMol,
    deltaT: record.finalC - record.initialC,
    solutionJ,
    apparentReactionKj: -solutionJ / 1000,
    apparentMolarKj: -solutionJ / 1000 / reactedMol,
  };
}

export const hessSpecies = [
  'C(s, graphite)',
  'O₂(g)',
  'CO(g)',
  'CO₂(g)',
] as const;
export type SpeciesInventory = readonly [number, number, number, number];
// Products positive, reactants negative. Rounded 25 °C standard-state values.
export const hessSteps = [
  { inventory: [-1, -0.5, 1, 0] as SpeciesInventory, enthalpyKj: -111 },
  { inventory: [0, -0.5, -1, 1] as SpeciesInventory, enthalpyKj: -283 },
] as const;
export const hessFactors = [1, -1, 2, -2] as const;
export type HessFactor = (typeof hessFactors)[number];

export function combineHessSteps(first: HessFactor, second: HessFactor) {
  if (!hessFactors.includes(first) || !hessFactors.includes(second))
    throw new RangeError('Use one of the supported equation multipliers.');
  const inventory = hessSpecies.map(
    (_, i) =>
      hessSteps[0].inventory[i]! * first + hessSteps[1].inventory[i]! * second,
  ) as unknown as SpeciesInventory;
  return {
    inventory,
    enthalpyKj:
      hessSteps[0].enthalpyKj * first + hessSteps[1].enthalpyKj * second,
    cancelledCo:
      first * second > 0 ? Math.min(Math.abs(first), Math.abs(second)) : 0,
  };
}

export function equationText(inventory: SpeciesInventory) {
  const side = (sign: number) =>
    inventory
      .flatMap((v, i) => {
        if (v * sign <= 0) return [];
        const amount = Math.abs(v);
        return [
          `${amount === 1 ? '' : amount === 0.5 ? '½' : amount + ' '}${hessSpecies[i]}`,
        ];
      })
      .join(' + ') || '∅';
  return `${side(-1)} → ${side(1)}`;
}

export function hessTargetMatches(
  inventory: SpeciesInventory,
  factor: HessFactor,
) {
  return inventory.every((value, i) => value === [-1, -1, 0, 1][i]! * factor);
}
