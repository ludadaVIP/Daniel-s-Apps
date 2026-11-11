/** Original conditional teaching models: no measured species or site is represented. */
export function selection(
  p: number,
  successA: number,
  successB: number,
  generations: number,
) {
  if (
    ![p, successA, successB, generations].every(Number.isFinite) ||
    p < 0 ||
    p > 1 ||
    successA < 0 ||
    successB < 0 ||
    !Number.isInteger(generations) ||
    generations < 0
  )
    throw new Error('Invalid selection inputs');
  const frequencies = [p];
  for (let i = 0; i < generations; i++) {
    const total = p * successA + (1 - p) * successB;
    if (total === 0)
      throw new Error('No reproductive output; frequency undefined');
    p = (p * successA) / total;
    frequencies.push(p);
  }
  return frequencies;
}
export const variationRoutes = [
  {
    route: 'mutation',
    before: ['AB', 'ab'],
    after: ['AB', 'ab', 'aB*'],
    newAllele: true,
    inherited:
      'Only if transmitted through the reproductive lineage in this animal example.',
  },
  {
    route: 'recombination',
    before: ['AB', 'ab'],
    after: ['AB', 'ab', 'Ab', 'aB'],
    newAllele: false,
    inherited:
      'Existing alleles are reshuffled into gametes; no new allele is required.',
  },
  {
    route: 'somatic',
    before: ['AB', 'ab'],
    after: ['AB', 'ab', 'skin*'],
    newAllele: true,
    inherited:
      'A skin-cell mutation is not ordinarily passed to offspring in this animal example.',
  },
] as const;
export const evidenceRecords = [
  {
    line: 'fossils',
    observation:
      'Undisturbed layers: older limb-bearing aquatic forms below younger forms with weight-bearing limbs.',
    limitation: 'Gaps, reworking and dating uncertainty must be checked.',
  },
  {
    line: 'anatomy',
    observation:
      'Different functions share a detailed arrangement of corresponding limb bones.',
    limitation: 'Similarity in function alone may arise through convergence.',
  },
  {
    line: 'molecules',
    observation:
      'Invented aligned 100-base segment: A–B differ at 4 sites; A–C at 18; B–C at 17.',
    limitation:
      'One short sequence can mislead; compare independent genes and sampling.',
  },
] as const;
export type Tree = string | readonly [Tree, Tree];
export const fictionalTree: Tree = [['Amber', 'Birch'], 'Cobalt'];
export function clades(tree: Tree): string[] {
  if (typeof tree === 'string') return [tree];
  return [...clades(tree[0]), ...clades(tree[1])];
}
export function treeSplits(tree: Tree): string[] {
  if (typeof tree === 'string') return [];
  return [
    clades(tree).sort().join('|'),
    ...treeSplits(tree[0]),
    ...treeSplits(tree[1]),
  ].sort();
}
export function rotateTree(tree: Tree): Tree {
  return typeof tree === 'string'
    ? tree
    : [rotateTree(tree[1]), rotateTree(tree[0])];
}
export const carbonInitial = { air: 40, plants: 30, detritus: 20, fuel: 10 };
export type CarbonStocks = typeof carbonInitial;
export const carbonFlows = [
  { name: 'photosynthesis', from: 'air', to: 'plants', amount: 8 },
  { name: 'respiration', from: 'plants', to: 'air', amount: 3 },
  { name: 'litter', from: 'plants', to: 'detritus', amount: 4 },
  { name: 'decomposition', from: 'detritus', to: 'air', amount: 2 },
  { name: 'combustion', from: 'fuel', to: 'air', amount: 5 },
] as const;
export function transfer<T extends Record<string, number>>(
  stocks: T,
  from: keyof T,
  to: keyof T,
  amount: number,
): T {
  const source = stocks[from],
    destination = stocks[to];
  if (
    source === undefined ||
    destination === undefined ||
    !Number.isFinite(amount) ||
    amount < 0 ||
    amount > source ||
    from === to ||
    Object.values(stocks).some((x) => !Number.isFinite(x) || x < 0)
  )
    throw new Error('Invalid conserved transfer');
  return { ...stocks, [from]: source - amount, [to]: destination + amount };
}
export function carbonStates(burn = true): CarbonStocks[] {
  const states = [{ ...carbonInitial }];
  for (const flow of carbonFlows)
    states.push(
      transfer(
        states[states.length - 1]!,
        flow.from,
        flow.to,
        flow.name === 'combustion' && !burn ? 0 : flow.amount,
      ),
    );
  return states;
}
export const nitrogenPaths = {
  uptake: ['N₂', 'NH₄⁺', 'NO₂⁻', 'NO₃⁻', 'organic N', 'NH₄⁺'],
  return: ['N₂', 'NH₄⁺', 'NO₂⁻', 'NO₃⁻', 'N₂', 'N₂'],
} as const;
/** One token is one nitrogen atom, not one molecule, at every step. */
export function nitrogenState(path: keyof typeof nitrogenPaths, step: number) {
  if (!Number.isInteger(step) || step < 0 || step > 5)
    throw new Error('Invalid nitrogen step');
  return { form: nitrogenPaths[path][step]!, nitrogenAtoms: 1 };
}
export function energyBudget(input: number, efficiency: number) {
  if (
    !Number.isFinite(input) ||
    input < 0 ||
    ![0.05, 0.1, 0.2].includes(efficiency)
  )
    throw new Error('Invalid energy budget');
  const next = input * efficiency;
  const detritus = input * 0.3;
  return { input, next, detritus, heat: input - next - detritus };
}
export type Community = 'diverse' | 'redundant' | 'single';
export type Disturbance = 'drought' | 'flood';
const responses = {
  diverse: { drought: [70, 90], flood: [55, 85], richness: 4 },
  redundant: { drought: [40, 65], flood: [75, 92], richness: 4 },
  single: { drought: [65, 88], flood: [20, 45], richness: 1 },
} as const;
export function disturbanceComparison({
  community,
  disturbance,
}: {
  community: Community;
  disturbance: Disturbance;
}) {
  const [impact, recovered] = responses[community][disturbance];
  return {
    community,
    disturbance,
    richness: responses[community].richness,
    assumptions: [
      'Original fictional litter-decomposition rate index: pre-disturbance rate 100, day 1 impact and day 30 recovery; identical litter inputs. Not species counts or a forecast.',
      'Equal starting total decomposition and standardized brief drought/flood pulse through day1; restore common baseline moisture immediately after day1 and maintain it until day30. Moisture-sensitive enzyme activity and survival are prescribed, not fitted; compensation needs surviving decomposers with different moisture responses.',
      community === 'diverse'
        ? 'Four decomposer species share litter use but differ in moisture tolerance; survivors partly compensate.'
        : community === 'redundant'
          ? 'Four decomposer species share litter use and similar drought sensitivity; shared sensitivity limits compensation.'
          : 'One decomposer species is comparatively drought tolerant but flood sensitive.',
    ],
    records: [
      { time: 0, phase: 'before' as const, function: 100 },
      { time: 1, phase: 'impact' as const, function: impact },
      { time: 30, phase: 'recovery' as const, function: recovered },
    ],
    resistance: impact / 100,
    resilience: (recovered - impact) / (100 - impact),
    uncertainty:
      'Invented deterministic comparison; real resistance and recovery require replication, a defined time window, function and disturbance. No confidence interval can be inferred.',
  };
}
export const disturbanceComparisonRecords = (
  ['diverse', 'redundant', 'single'] as const
).flatMap((community) =>
  (['drought', 'flood'] as const).map((disturbance) =>
    disturbanceComparison({ community, disturbance }),
  ),
);
