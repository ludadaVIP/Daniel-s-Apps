import { ions } from './ionicReactions';
import { protonSpecies } from './protonReactions';

type FormulaIon = {
  formula: string;
  label: string;
  charge: number;
  atoms: Readonly<Record<string, number>>;
};
export const formulaIons = {
  Na: { ...ions.Na, formula: 'Na' },
  Mg: { formula: 'Mg', label: 'Mg²⁺', charge: 2, atoms: { Mg: 1 } },
  Ca: { ...ions.Ca, formula: 'Ca' },
  Al: { formula: 'Al', label: 'Al³⁺', charge: 3, atoms: { Al: 1 } },
  Li: { formula: 'Li', label: 'Li⁺', charge: 1, atoms: { Li: 1 } },
  Cl: { ...ions.Cl, formula: 'Cl' },
  oxide: { formula: 'O', label: 'O²⁻', charge: -2, atoms: { O: 1 } },
  nitride: { formula: 'N', label: 'N³⁻', charge: -3, atoms: { N: 1 } },
  hydroxide: { ...protonSpecies.hydroxide, formula: 'OH' },
  nitrate: { ...ions.nitrate, formula: 'NO₃' },
  sulfate: {
    formula: 'SO₄',
    label: 'SO₄²⁻',
    charge: -2,
    atoms: { S: 1, O: 4 },
  },
  ammonium: { ...protonSpecies.ammonium, formula: 'NH₄' },
  peroxide: { formula: 'O₂', label: 'O₂²⁻', charge: -2, atoms: { O: 2 } },
} as const satisfies Record<string, FormulaIon>;
export type FormulaIonId = keyof typeof formulaIons;
export type FormulaPair = { cation: FormulaIonId; anion: FormulaIonId };
export const binaryFormulaPairs: FormulaPair[] = [
  { cation: 'Na', anion: 'Cl' },
  { cation: 'Mg', anion: 'Cl' },
  { cation: 'Ca', anion: 'oxide' },
  { cation: 'Al', anion: 'oxide' },
  { cation: 'Ca', anion: 'nitride' },
];
export const groupedFormulaPairs: FormulaPair[] = [
  { cation: 'Mg', anion: 'hydroxide' },
  { cation: 'Ca', anion: 'nitrate' },
  { cation: 'Al', anion: 'sulfate' },
  { cation: 'ammonium', anion: 'sulfate' },
  { cation: 'ammonium', anion: 'nitrate' },
  { cation: 'Li', anion: 'peroxide' },
];
function positiveInteger(n: number) {
  if (!Number.isSafeInteger(n) || n < 1)
    throw new Error('Expected positive integer');
}
export function greatestCommonDivisor(a: number, b: number): number {
  positiveInteger(a);
  positiveInteger(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
const subscript = (n: number) =>
  n === 1 ? '' : String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]!);
function ionPart(ion: FormulaIon, count: number) {
  const polyatomic = Object.values(ion.atoms).reduce((a, b) => a + b, 0) > 1;
  return `${polyatomic && count > 1 ? `(${ion.formula})` : ion.formula}${subscript(count)}`;
}
export function formulaUnit(pair: FormulaPair) {
  const cation: FormulaIon = formulaIons[pair.cation],
    anion: FormulaIon = formulaIons[pair.anion];
  if (!cation || !anion || cation.charge <= 0 || anion.charge >= 0)
    throw new Error('Invalid ion pair');
  const common = greatestCommonDivisor(cation.charge, -anion.charge);
  const cations = -anion.charge / common,
    anions = cation.charge / common;
  return {
    cation,
    anion,
    cations,
    anions,
    formula: ionPart(cation, cations) + ionPart(anion, anions),
  };
}
function pairAt(pairs: FormulaPair[], index: number) {
  if (!Number.isInteger(index) || !pairs[index])
    throw new Error('Invalid formula case');
  return pairs[index]!;
}
export function binaryFormulaLedger(
  index: number,
  cations: number,
  anions: number,
) {
  if (![cations, anions].every((n) => Number.isInteger(n) && n >= 1 && n <= 6))
    throw new Error('Invalid ion counts');
  const unit = formulaUnit(pairAt(binaryFormulaPairs, index));
  const common = greatestCommonDivisor(cations, anions);
  const positive = cations * unit.cation.charge,
    negative = anions * unit.anion.charge;
  const net = positive + negative;
  return {
    ...unit,
    positive,
    negative,
    net,
    neutral: net === 0,
    simplest: common === 1,
    common,
    reducedCations: cations / common,
    reducedAnions: anions / common,
    formulaUnits: net === 0 ? cations / unit.cations : null,
  };
}
export function groupedFormulaLedger(index: number, coefficient: number) {
  if (!Number.isInteger(coefficient) || coefficient < 1 || coefficient > 4)
    throw new Error('Invalid coefficient');
  const unit = formulaUnit(pairAt(groupedFormulaPairs, index));
  const atoms: Record<string, number> = {};
  const contributions: Record<string, string[]> = {};
  for (const [ion, perUnit] of [
    [unit.cation, unit.cations],
    [unit.anion, unit.anions],
  ] as const)
    for (const [element, inside] of Object.entries(ion.atoms)) {
      atoms[element] = (atoms[element] ?? 0) + coefficient * perUnit * inside;
      (contributions[element] ??= []).push(
        `${coefficient} × ${perUnit} × ${inside}`,
      );
    }
  return {
    ...unit,
    coefficient,
    atoms,
    contributions,
    totalCations: coefficient * unit.cations,
    totalAnions: coefficient * unit.anions,
    net:
      coefficient *
      (unit.cations * unit.cation.charge + unit.anions * unit.anion.charge),
  };
}
export function parseSignedCount(value: string): number | null {
  const clean = value.trim().replace('−', '-');
  if (!/^[+-]?\d+$/.test(clean)) return null;
  const number = Number(clean);
  return Number.isSafeInteger(number) ? number : null;
}
