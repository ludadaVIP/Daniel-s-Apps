/** Original classroom models. Indices and capacities are invented, not fitted measurements. */
export type PhotoConditions = {
  light: number;
  co2: number;
  temperature: number;
};
export const photosynthesisAssumptions = [
  'Fictional relative photosynthesis rate, not growth or a real species forecast.',
  'Adequate water, fixed leaf area, mineral supply and all other conditions.',
  'Light and CO2 are dimensionless 0–100 indices; temperature is 0–50 °C.',
  'The minimum-capacity rule illustrates a bottleneck; real responses interact continuously.',
  'The 25 °C optimum and zero endpoints at 0/50 °C are fictional curve choices, not universal plant thresholds.',
] as const;
const bounded = (x: number, max = 100) =>
  Math.max(0, Math.min(max, Number.isFinite(x) ? x : 0));
export function photosynthesisRate(input: PhotoConditions) {
  const light = bounded(input.light),
    co2 = bounded(input.co2),
    temperature = bounded(input.temperature, 50);
  const capacities = {
    light: Math.min(100, light * 2),
    co2: Math.min(100, co2 * 2),
    temperature: Math.max(0, 100 - Math.abs(temperature - 25) * 4),
  };
  const rate = Math.min(...Object.values(capacities));
  const limitingFactors = (
    Object.keys(capacities) as (keyof PhotoConditions)[]
  ).filter((key) => capacities[key] === rate);
  return {
    rate,
    capacities,
    limitingFactors,
    conditions: { light, co2, temperature },
    assumptions: photosynthesisAssumptions,
  };
}
export function photoCurve(
  variable: keyof PhotoConditions,
  fixed: PhotoConditions,
) {
  const max = variable === 'temperature' ? 50 : 100;
  return Array.from({ length: 21 }, (_, i) => {
    const x = (i * max) / 20;
    return { x, rate: photosynthesisRate({ ...fixed, [variable]: x }).rate };
  });
}
type Atoms = { C: number; H: number; O: number };
const carbonDioxide: Atoms = { C: 1, H: 0, O: 2 },
  water: Atoms = { C: 0, H: 2, O: 1 },
  sugar: Atoms = { C: 6, H: 12, O: 6 },
  oxygen: Atoms = { C: 0, H: 0, O: 2 };
function sumAtoms(terms: { coefficient: number; atoms: Atoms }[]): Atoms {
  return terms.reduce(
    (total, term) => ({
      C: total.C + term.coefficient * term.atoms.C,
      H: total.H + term.coefficient * term.atoms.H,
      O: total.O + term.coefficient * term.atoms.O,
    }),
    { C: 0, H: 0, O: 0 },
  );
}
export const photosynthesisAtoms = {
  reactants: sumAtoms([
    { coefficient: 6, atoms: carbonDioxide },
    { coefficient: 6, atoms: water },
  ]),
  products: sumAtoms([
    { coefficient: 1, atoms: sugar },
    { coefficient: 6, atoms: oxygen },
  ]),
  beforeCancellation: {
    reactants: sumAtoms([
      { coefficient: 6, atoms: carbonDioxide },
      { coefficient: 12, atoms: water },
    ]),
    products: sumAtoms([
      { coefficient: 1, atoms: sugar },
      { coefficient: 6, atoms: oxygen },
      { coefficient: 6, atoms: water },
    ]),
  },
  equation: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂',
  carbonSource: 'CO2',
  releasedOxygenSource: 'water',
} as const;
export type RespirationRoute = 'aerobic' | 'lactate' | 'yeast';
export const respiration = {
  aerobic: {
    oxygen: true,
    products: 'CO₂ + H₂O',
    atp: 'greater, variable yield',
  },
  lactate: { oxygen: false, products: 'lactate', atp: 'net 2 from glycolysis' },
  yeast: {
    oxygen: false,
    products: 'ethanol + CO₂',
    atp: 'net 2 from glycolysis',
  },
} as const;
/** Token accounting only: adequate untracked ADP/Pi; supplied ATP units embody energy input. Not a closed nucleotide inventory. */
export function atpBudget(
  initial: number,
  regenerated: number,
  requested: number,
) {
  const start = Math.floor(bounded(initial, 20)),
    input = Math.floor(bounded(regenerated, 20)),
    demand = Math.floor(bounded(requested, 40));
  const completed = Math.min(start + input, demand);
  return {
    start,
    regenerated: input,
    completed,
    remaining: start + input - completed,
    unmet: demand - completed,
    energyInputRequired: input > 0,
  };
}
export type DivisionStage = 'beforeS' | 'afterS' | 'afterI' | 'afterII';
export const chromosomeCounts: Record<
  DivisionStage,
  {
    cells: number;
    chromosomesPerCell: number;
    dnaMoleculesPerCell: number;
    ploidy: number;
    C: number;
  }
> = {
  beforeS: {
    cells: 1,
    chromosomesPerCell: 4,
    dnaMoleculesPerCell: 4,
    ploidy: 2,
    C: 2,
  },
  afterS: {
    cells: 1,
    chromosomesPerCell: 4,
    dnaMoleculesPerCell: 8,
    ploidy: 2,
    C: 4,
  },
  afterI: {
    cells: 2,
    chromosomesPerCell: 2,
    dnaMoleculesPerCell: 4,
    ploidy: 1,
    C: 2,
  },
  afterII: {
    cells: 4,
    chromosomesPerCell: 2,
    dnaMoleculesPerCell: 2,
    ploidy: 1,
    C: 1,
  },
};
export type Genotype = 'AA' | 'Aa' | 'aa';
export type Allele = 'A' | 'a';
export function gametes(parent: Genotype): [Allele, Allele] {
  return [parent[0] as Allele, parent[1] as Allele];
}
export function combine(a: Allele, b: Allele): Genotype {
  return a === b ? ((a + a) as Genotype) : 'Aa';
}
export function punnett(first: Genotype, second: Genotype) {
  const cells = gametes(first).flatMap((fromFirst, row) =>
    gametes(second).map((fromSecond, col) => ({
      row,
      col,
      fromFirst,
      fromSecond,
      genotype: combine(fromFirst, fromSecond),
      probability: 0.25,
    })),
  );
  const probabilities: Record<Genotype, number> = { AA: 0, Aa: 0, aa: 0 };
  cells.forEach((cell) => {
    probabilities[cell.genotype] += cell.probability;
  });
  return { cells, probabilities, dominantPhenotype: 1 - probabilities.aa };
}
export function sampleOffspring(
  first: Genotype,
  second: Genotype,
  count: number,
  seed: number,
) {
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const a = gametes(first),
    b = gametes(second);
  const offspring = Array.from(
    { length: Math.floor(bounded(count, 400)) },
    () => {
      const fromFirst = a[random() < 0.5 ? 0 : 1],
        fromSecond = b[random() < 0.5 ? 0 : 1];
      return {
        fromFirst,
        fromSecond,
        genotype: combine(fromFirst, fromSecond),
      };
    },
  );
  const counts: Record<Genotype, number> = { AA: 0, Aa: 0, aa: 0 };
  offspring.forEach((child) => counts[child.genotype]++);
  return {
    offspring,
    counts,
    seed: seed >>> 0,
    expected: punnett(first, second).probabilities,
  };
}
