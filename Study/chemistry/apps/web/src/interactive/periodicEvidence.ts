export type NeutralElement = {
  symbol: string;
  z: number;
  period: number;
  group: number;
  shells: readonly number[];
};
export const firstTwenty = [
  { symbol: 'H', z: 1, period: 1, group: 1, shells: [1] },
  { symbol: 'He', z: 2, period: 1, group: 18, shells: [2] },
  { symbol: 'Li', z: 3, period: 2, group: 1, shells: [2, 1] },
  { symbol: 'Be', z: 4, period: 2, group: 2, shells: [2, 2] },
  { symbol: 'B', z: 5, period: 2, group: 13, shells: [2, 3] },
  { symbol: 'C', z: 6, period: 2, group: 14, shells: [2, 4] },
  { symbol: 'N', z: 7, period: 2, group: 15, shells: [2, 5] },
  { symbol: 'O', z: 8, period: 2, group: 16, shells: [2, 6] },
  { symbol: 'F', z: 9, period: 2, group: 17, shells: [2, 7] },
  { symbol: 'Ne', z: 10, period: 2, group: 18, shells: [2, 8] },
  { symbol: 'Na', z: 11, period: 3, group: 1, shells: [2, 8, 1] },
  { symbol: 'Mg', z: 12, period: 3, group: 2, shells: [2, 8, 2] },
  { symbol: 'Al', z: 13, period: 3, group: 13, shells: [2, 8, 3] },
  { symbol: 'Si', z: 14, period: 3, group: 14, shells: [2, 8, 4] },
  { symbol: 'P', z: 15, period: 3, group: 15, shells: [2, 8, 5] },
  { symbol: 'S', z: 16, period: 3, group: 16, shells: [2, 8, 6] },
  { symbol: 'Cl', z: 17, period: 3, group: 17, shells: [2, 8, 7] },
  { symbol: 'Ar', z: 18, period: 3, group: 18, shells: [2, 8, 8] },
  { symbol: 'K', z: 19, period: 4, group: 1, shells: [2, 8, 8, 1] },
  { symbol: 'Ca', z: 20, period: 4, group: 2, shells: [2, 8, 8, 2] },
] as const satisfies readonly NeutralElement[];
export type ElementSymbol = (typeof firstTwenty)[number]['symbol'];
export function neutralElement(symbol: ElementSymbol) {
  const element = firstTwenty.find((e) => e.symbol === symbol);
  if (!element) throw new Error('Unsupported first-twenty element');
  return element;
}
export const shellRecords: Array<{
  symbol: ElementSymbol;
  charge: number;
  shells: readonly number[];
}> = [
  { symbol: 'Na', charge: 1, shells: [2, 8] },
  { symbol: 'Ne', charge: 0, shells: [2, 8] },
  { symbol: 'Cl', charge: -1, shells: [2, 8, 8] },
  { symbol: 'Ar', charge: 0, shells: [2, 8, 8] },
  { symbol: 'Ca', charge: 2, shells: [2, 8, 8] },
  { symbol: 'Ca', charge: 0, shells: [2, 8, 8, 2] },
  { symbol: 'He', charge: 0, shells: [2] },
  { symbol: 'Mg', charge: 2, shells: [2, 8] },
  { symbol: 'O', charge: -2, shells: [2, 8] },
  { symbol: 'K', charge: 0, shells: [2, 8, 8, 1] },
];
export function shellRecord(index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= shellRecords.length)
    throw new Error('Invalid shell record');
  const record = shellRecords[index]!;
  const element = neutralElement(record.symbol);
  return {
    ...record,
    element,
    electrons: record.shells.reduce((a, b) => a + b, 0),
    needsNeutralReference: record.charge !== 0,
  };
}
export const ionTransferPairs: Array<{
  id: string;
  metal: ElementSymbol;
  nonmetal: ElementSymbol;
  positive: number;
  negative: number;
}> = [
  { id: 'Na / Cl', metal: 'Na', nonmetal: 'Cl', positive: 1, negative: -1 },
  { id: 'Mg / Cl', metal: 'Mg', nonmetal: 'Cl', positive: 2, negative: -1 },
  { id: 'Mg / O', metal: 'Mg', nonmetal: 'O', positive: 2, negative: -2 },
  { id: 'Ca / F', metal: 'Ca', nonmetal: 'F', positive: 2, negative: -1 },
  { id: 'Li / O', metal: 'Li', nonmetal: 'O', positive: 1, negative: -2 },
];
export function electronTransferLedger(
  pairIndex: number,
  metalCount: number,
  nonmetalCount: number,
) {
  if (
    !Number.isInteger(pairIndex) ||
    pairIndex < 0 ||
    pairIndex >= ionTransferPairs.length ||
    ![metalCount, nonmetalCount].every(
      (n) => Number.isInteger(n) && n >= 1 && n <= 4,
    )
  )
    throw new Error('Invalid electron inventory');
  const pair = ionTransferPairs[pairIndex]!;
  const supply = metalCount * pair.positive,
    demand = nonmetalCount * -pair.negative;
  const protons =
    metalCount * neutralElement(pair.metal).z +
    nonmetalCount * neutralElement(pair.nonmetal).z;
  const desiredElectrons =
    metalCount * (neutralElement(pair.metal).z - pair.positive) +
    nonmetalCount * (neutralElement(pair.nonmetal).z - pair.negative);
  const candidateCharge = protons - desiredElectrons;
  const status =
    supply === demand ? 'matched' : supply < demand ? 'shortage' : 'surplus';
  return {
    pair,
    metalCount,
    nonmetalCount,
    supply,
    demand,
    protons,
    neutralElectrons: protons,
    desiredElectrons,
    candidateCharge,
    status,
  } as const;
}
