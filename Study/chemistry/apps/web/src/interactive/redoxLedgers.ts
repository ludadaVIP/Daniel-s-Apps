import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

type OxidationTerm = { element: string; count: number; value: number | null };
export const oxidationCases: Array<{
  id: string;
  formula: string;
  charge: number;
  terms: OxidationTerm[];
  clue: LocalizedText;
}> = [
  {
    id: 'hydrogen-chloride',
    formula: 'HCl',
    charge: 0,
    terms: [
      { element: 'H', count: 1, value: 1 },
      { element: 'Cl', count: 1, value: null },
    ],
    clue: t(
      '本例 H 为 +1；HCl 整体中性。氧化数不是共价键中每个原子的实测净电荷。',
      'Here H is +1 and HCl is neutral overall. Oxidation numbers are not measured net atomic charges in a covalent bond.',
    ),
  },
  {
    id: 'chloride',
    formula: 'Cl⁻',
    charge: -1,
    terms: [{ element: 'Cl', count: 1, value: null }],
    clue: t(
      '单原子离子的氧化数等于该离子的电荷数。比较 HCl 中的 Cl：它的氧化数改变了吗？',
      'A monatomic ion’s oxidation number equals its charge number. Compare Cl in HCl: did its oxidation number change?',
    ),
  },
  {
    id: 'carbonate',
    formula: 'CO₃²⁻',
    charge: -2,
    terms: [
      { element: 'C', count: 1, value: null },
      { element: 'O', count: 3, value: -2 },
    ],
    clue: t(
      '本例每个 O 为 −2；三个 O 的贡献都要计入。整个离子的 −2 不能直接抄给 C。',
      'Each O is −2 here; include all three. The whole ion’s −2 charge is not automatically the oxidation number of C.',
    ),
  },
  {
    id: 'ammonia',
    formula: 'NH₃',
    charge: 0,
    terms: [
      { element: 'N', count: 1, value: null },
      { element: 'H', count: 3, value: 1 },
    ],
    clue: t(
      '本例 H 为 +1，分子整体中性。接受 H⁺ 后成为 NH₄⁺，N 的氧化数仍为 −3。',
      'H is +1 here and the molecule is neutral. On accepting H⁺ to become NH₄⁺, N remains at −3.',
    ),
  },
  {
    id: 'ammonium',
    formula: 'NH₄⁺',
    charge: 1,
    terms: [
      { element: 'N', count: 1, value: null },
      { element: 'H', count: 4, value: 1 },
    ],
    clue: t(
      '四个 H 各为 +1，所有贡献之和应为离子的 +1，而不是 0。',
      'Four H each contribute +1. Contributions sum to the ion’s +1, not to zero.',
    ),
  },
  {
    id: 'oxygen-element',
    formula: 'O₂',
    charge: 0,
    terms: [{ element: 'O', count: 2, value: null }],
    clue: t(
      '单质中元素的氧化数为 0；“氧总是 −2”不是通用规则。',
      'An element in its elemental form has oxidation number 0. “Oxygen is always −2” is not a universal rule.',
    ),
  },
  {
    id: 'peroxide',
    formula: 'H₂O₂',
    charge: 0,
    terms: [
      { element: 'H', count: 2, value: 1 },
      { element: 'O', count: 2, value: null },
    ],
    clue: t(
      '本例 H 为 +1，两个 O 共同平衡 +2。过氧化物是氧通常为 −2 规则的例外之一。',
      'H is +1 here, and the two O together balance +2. Peroxides are an exception to oxygen’s usual −2 assignment.',
    ),
  },
];

export function oxidationLedger(sample: (typeof oxidationCases)[number]) {
  const unknowns = sample.terms.filter((term) => term.value === null);
  if (
    unknowns.length !== 1 ||
    sample.terms.some(
      (term) => !Number.isInteger(term.count) || term.count <= 0,
    )
  )
    throw new RangeError(
      'One unknown element and positive integer counts are required.',
    );
  const unknown = unknowns[0]!;
  const knownContribution = sample.terms.reduce(
    (total, term) => total + term.count * (term.value ?? 0),
    0,
  );
  return {
    unknown: unknown.element,
    count: unknown.count,
    knownContribution,
    value: (sample.charge - knownContribution) / unknown.count,
  };
}

export const electronPairs = [
  {
    id: 'zinc-copper',
    donor: 'Zn',
    donorIon: 'Zn²⁺',
    loss: 2,
    acceptorIon: 'Cu²⁺',
    acceptor: 'Cu',
    gain: 2,
  },
  {
    id: 'aluminium-copper',
    donor: 'Al',
    donorIon: 'Al³⁺',
    loss: 3,
    acceptorIon: 'Cu²⁺',
    acceptor: 'Cu',
    gain: 2,
  },
  {
    id: 'zinc-silver',
    donor: 'Zn',
    donorIon: 'Zn²⁺',
    loss: 2,
    acceptorIon: 'Ag⁺',
    acceptor: 'Ag',
    gain: 1,
  },
] as const;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
const term = (coefficient: number, species: string) =>
  `${coefficient === 1 ? '' : coefficient}${species}`;

export function halfReactionAudit(
  pair: (typeof electronPairs)[number],
  oxidationMultiplier: number,
  reductionMultiplier: number,
) {
  if (
    ![oxidationMultiplier, reductionMultiplier].every(
      (n) => Number.isSafeInteger(n) && n > 0,
    )
  )
    throw new RangeError('Multipliers must be positive safe integers.');
  const divisor = gcd(pair.loss, pair.gain);
  const minimumOxidation = pair.gain / divisor;
  const minimumReduction = pair.loss / divisor;
  const lost = pair.loss * oxidationMultiplier;
  const gained = pair.gain * reductionMultiplier;
  const balanced = lost === gained;
  return {
    lost,
    gained,
    balanced,
    minimumOxidation,
    minimumReduction,
    simplest:
      balanced &&
      oxidationMultiplier === minimumOxidation &&
      reductionMultiplier === minimumReduction,
    equation: balanced
      ? `${term(oxidationMultiplier, pair.donor)} + ${term(reductionMultiplier, pair.acceptorIon)} → ${term(oxidationMultiplier, pair.donorIon)} + ${term(reductionMultiplier, pair.acceptor)}`
      : null,
  };
}

export const displacementSpecies = {
  zinc: { label: 'Zn(s)', charge: 0, atoms: { Zn: 1 } },
  zincIon: { label: 'Zn²⁺(aq)', charge: 2, atoms: { Zn: 1 } },
  magnesium: { label: 'Mg(s)', charge: 0, atoms: { Mg: 1 } },
  magnesiumIon: { label: 'Mg²⁺(aq)', charge: 2, atoms: { Mg: 1 } },
  copper: { label: 'Cu(s)', charge: 0, atoms: { Cu: 1 } },
  copperIon: { label: 'Cu²⁺(aq)', charge: 2, atoms: { Cu: 1 } },
  nitrate: { label: 'NO₃⁻(aq)', charge: -1, atoms: { N: 1, O: 3 } },
} as const;
export type DisplacementSpeciesId = keyof typeof displacementSpecies;
export type DisplacementInventory = Partial<
  Record<DisplacementSpeciesId, number>
>;
export const displacementMetals = [
  { id: 'zinc', solid: 'zinc', ion: 'zincIon', formula: 'Zn' },
  { id: 'magnesium', solid: 'magnesium', ion: 'magnesiumIon', formula: 'Mg' },
] as const;

export function displacementLedger(
  metal: (typeof displacementMetals)[number],
  metalMmol: number,
  copperMmol: number,
) {
  if (![metalMmol, copperMmol].every((n) => Number.isFinite(n) && n >= 0))
    throw new RangeError('Amounts must be finite and non-negative.');
  const extent = Math.min(metalMmol, copperMmol);
  const before: DisplacementInventory = {
    [metal.solid]: metalMmol,
    copperIon: copperMmol,
    nitrate: 2 * copperMmol,
  };
  const solution: DisplacementInventory = {
    [metal.ion]: extent,
    copperIon: copperMmol - extent,
    nitrate: 2 * copperMmol,
  };
  const solids: DisplacementInventory = {
    [metal.solid]: metalMmol - extent,
    copper: extent,
  };
  return {
    before,
    solution,
    solids,
    extent,
    electronMmol: 2 * extent,
    copperMassG: (extent * 63.5) / 1000,
  };
}

export function displacementAtoms(inventory: DisplacementInventory) {
  const result: Record<string, number> = {};
  for (const [id, amount] of Object.entries(inventory))
    for (const [element, count] of Object.entries(
      displacementSpecies[id as DisplacementSpeciesId].atoms,
    ))
      result[element] = (result[element] ?? 0) + count * amount;
  return result;
}
export function displacementCharge(inventory: DisplacementInventory) {
  return Object.entries(inventory).reduce(
    (total, [id, amount]) =>
      total + amount * displacementSpecies[id as DisplacementSpeciesId].charge,
    0,
  );
}
