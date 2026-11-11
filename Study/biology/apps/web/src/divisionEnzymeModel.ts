/** Qualitative teaching models, not measurements. See U19/U20 media.json for scope. */
export type CellShape = 'cube' | 'flat';
export function cellGeometry(side: number, shape: CellShape = 'cube') {
  if (!(side > 0) || !Number.isFinite(side))
    throw new RangeError('Positive finite length required');
  const dimensions: [number, number, number] =
    shape === 'cube' ? [side, side, side] : [4 * side, side, side / 4];
  const [a, b, c] = dimensions;
  const area = 2 * (a * b + a * c + b * c),
    volume = a * b * c;
  return { dimensions, area, volume, ratio: area / volume };
}
export const cycleStages = ['G1', 'S', 'G2', 'M', 'daughter'] as const;
export type CycleStage = (typeof cycleStages)[number];
/** Counts before anaphase and per daughter after cytokinesis; not transient whole-anaphase counts. */
export function cycleInventory(stage: CycleStage) {
  return {
    chromosomes: 4,
    ploidy: '2n = 4',
    dnaC: stage === 'G1' || stage === 'daughter' ? 2 : 4,
    chromatids: stage === 'G1' || stage === 'daughter' ? 4 : 8,
    basis:
      stage === 'S'
        ? 'end of S'
        : stage === 'M'
          ? 'metaphase, before sister separation'
          : stage,
  };
}
export const mitosisStages = [
  'prophase',
  'metaphase',
  'anaphase',
  'telophase',
  'cytokinesis',
] as const;
export type MitosisStage = (typeof mitosisStages)[number];
export function orderMitosis(cards: MitosisStage[]) {
  return (
    cards.length === 5 &&
    cards.every((card, index) => card === mitosisStages[index])
  );
}
export const homologues = ['A', 'a', 'B', 'b'] as const;
export function segregateSisters(fault = false) {
  const left: string[] = homologues.map((h) => `${h}1`);
  const right: string[] = homologues.map((h) => `${h}2`);
  if (fault) {
    left.push(right.shift()!);
  }
  return { left, right, equal: left.length === 4 && right.length === 4 };
}
export type CellFate = 'skin' | 'muscle' | 'nerve';
export function expressionProfile(fate: CellFate, progenitors: boolean) {
  return {
    genes: ['K', 'M', 'N', 'H'],
    active:
      fate === 'skin'
        ? ['K', 'H']
        : fate === 'muscle'
          ? ['M', 'H']
          : ['N', 'H'],
    repairByDivision: progenitors && fate !== 'nerve',
    matureCellDivides: false,
  };
}
export function reactionEnergy(catalyst: boolean) {
  return {
    reactants: 20,
    products: 5,
    peak: catalyst ? 45 : 90,
    activation: catalyst ? 25 : 70,
    deltaG: -15,
  };
}
export type EnzymeHistory = 'fresh' | 'cooled' | 'heated';
export type EnzymeConditions = {
  temperatureC: number;
  pH: number;
  history: EnzymeHistory;
  substrate: number;
  enzyme: number;
};
export const defaultEnzymeConditions: EnzymeConditions = {
  temperatureC: 40,
  pH: 7,
  history: 'fresh',
  substrate: 8,
  enzyme: 1,
};
/** Fictional enzyme E. Initial-rate proxy, excess water, fixed assay duration; substrate is arbitrary concentration. */
export function enzymeRate(conditions: EnzymeConditions): number {
  const { temperatureC: temp, pH, history, substrate, enzyme } = conditions;
  if (
    ![temp, pH, substrate, enzyme].every(Number.isFinite) ||
    substrate < 0 ||
    enzyme < 0
  )
    throw new RangeError('Finite conditions and nonnegative amounts required');
  const width = temp <= 40 ? 28 : 14;
  const thermal = Math.exp(-Math.pow((temp - 40) / width, 2));
  const acidity = Math.exp(-Math.pow((pH - 7) / 2.2, 2));
  const remaining = history === 'heated' ? 0.08 : 1;
  return (
    ((100 * thermal * acidity * remaining * substrate) / (substrate + 2)) *
    enzyme
  );
}
export function enzymeCurve(
  axis: 'temperature' | 'pH',
  fixed: EnzymeConditions = defaultEnzymeConditions,
) {
  const xs =
    axis === 'temperature'
      ? Array.from({ length: 17 }, (_, i) => i * 5)
      : Array.from({ length: 15 }, (_, i) => i);
  return xs.map((x) => ({
    x,
    rate: enzymeRate({
      ...fixed,
      ...(axis === 'temperature' ? { temperatureC: x } : { pH: x }),
    }),
  }));
}
export const enzymeEvidencePairs: readonly [
  {
    id: string;
    before: EnzymeConditions;
    after: EnzymeConditions;
    interpretation: string;
  },
  {
    id: string;
    before: EnzymeConditions;
    after: EnzymeConditions;
    interpretation: string;
  },
] = [
  {
    id: 'cold-rewarm',
    before: {
      ...defaultEnzymeConditions,
      temperatureC: 5,
      history: 'cooled' as const,
    },
    after: { ...defaultEnzymeConditions, history: 'cooled' as const },
    interpretation:
      'Cold slows this intact enzyme; rewarming restores its model activity.',
  },
  {
    id: 'heat-cool',
    before: {
      ...defaultEnzymeConditions,
      temperatureC: 75,
      history: 'heated' as const,
    },
    after: { ...defaultEnzymeConditions, history: 'heated' as const },
    interpretation:
      'Prior damaging heat leaves only 8% active enzyme in this model; cooling does not restore the original structure.',
  },
];
export function catalyticTurnover(
  substrate: number,
  enzyme: number,
  steps: number,
  matched = true,
) {
  const converted = matched
    ? Math.min(substrate, enzyme * Math.max(0, Math.floor(steps)))
    : 0;
  return { substrate: substrate - converted, product: converted, enzyme };
}
export type FoodSubstrate = 'starch' | 'protein' | 'fat';
export type DigestiveAgent = 'amylase' | 'protease' | 'lipase' | 'bile';
export function digestionRoute(
  substrate: FoodSubstrate,
  agent: DigestiveAgent,
) {
  if (agent === 'bile')
    return {
      chemical: false,
      matched: substrate === 'fat',
      product: 'smaller droplets; same triglyceride molecules',
      next: 'lipase accesses more interface',
    };
  if (substrate === 'starch' && agent === 'amylase')
    return {
      chemical: true,
      matched: true,
      product: 'maltose and shorter oligosaccharides',
      next: 'other intestinal enzymes → glucose',
    };
  if (substrate === 'protein' && agent === 'protease')
    return {
      chemical: true,
      matched: true,
      product: 'shorter peptides',
      next: 'further proteases / peptidases → amino acids',
    };
  if (substrate === 'fat' && agent === 'lipase')
    return {
      chemical: true,
      matched: true,
      product: 'fatty acids and monoglycerides',
      next: 'absorption and lipid processing',
    };
  return {
    chemical: false,
    matched: false,
    product: 'substrate unchanged in this selected route',
    next: 'choose a suitable enzyme',
  };
}
