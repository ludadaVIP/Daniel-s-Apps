import type { LocalizedText } from '@study/shared';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const ions = {
  Ag: { label: 'Ag⁺', charge: 1, atoms: { Ag: 1 } },
  Na: { label: 'Na⁺', charge: 1, atoms: { Na: 1 } },
  K: { label: 'K⁺', charge: 1, atoms: { K: 1 } },
  Ca: { label: 'Ca²⁺', charge: 2, atoms: { Ca: 1 } },
  Cl: { label: 'Cl⁻', charge: -1, atoms: { Cl: 1 } },
  nitrate: { label: 'NO₃⁻', charge: -1, atoms: { N: 1, O: 3 } },
  carbonate: { label: 'CO₃²⁻', charge: -2, atoms: { C: 1, O: 3 } },
} as const;
export type IonId = keyof typeof ions;
export type IonInventory = Partial<Record<IonId, number>>;

export const precipitationCases = [
  {
    id: 'silver-chloride',
    title: t('硝酸银 + 氯化钠', 'Silver nitrate + sodium chloride'),
    left: 'AgNO₃',
    right: 'NaCl',
    leftIons: { Ag: 1, nitrate: 1 },
    rightIons: { Na: 1, Cl: 1 },
    solid: 'AgCl',
    solidIons: { Ag: 1, Cl: 1 },
    molarMass: 143.5,
    net: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
    equation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)',
    observation: t('形成白色沉淀', 'A white precipitate forms'),
  },
  {
    id: 'calcium-carbonate',
    title: t('氯化钙 + 碳酸钠', 'Calcium chloride + sodium carbonate'),
    left: 'CaCl₂',
    right: 'Na₂CO₃',
    leftIons: { Ca: 1, Cl: 2 },
    rightIons: { Na: 2, carbonate: 1 },
    solid: 'CaCO₃',
    solidIons: { Ca: 1, carbonate: 1 },
    molarMass: 100,
    net: 'Ca²⁺(aq) + CO₃²⁻(aq) → CaCO₃(s)',
    equation: 'CaCl₂(aq) + Na₂CO₃(aq) → CaCO₃(s) + 2NaCl(aq)',
    observation: t('形成白色沉淀', 'A white precipitate forms'),
  },
  {
    id: 'no-precipitate',
    title: t(
      '氯化钠 + 硝酸钾（对照）',
      'Sodium chloride + potassium nitrate (control)',
    ),
    left: 'NaCl',
    right: 'KNO₃',
    leftIons: { Na: 1, Cl: 1 },
    rightIons: { K: 1, nitrate: 1 },
    solid: null,
    solidIons: {},
    molarMass: 0,
    net: null,
    equation: null,
    observation: t('本模型中不形成沉淀', 'No precipitate forms in this model'),
  },
] satisfies Array<{
  id: string;
  title: LocalizedText;
  left: string;
  right: string;
  leftIons: IonInventory;
  rightIons: IonInventory;
  solid: string | null;
  solidIons: IonInventory;
  molarMass: number;
  net: string | null;
  equation: string | null;
  observation: LocalizedText;
}>;
export type PrecipitationCase = (typeof precipitationCases)[number];

export function precipitate(
  reaction: PrecipitationCase,
  leftMmol: number,
  rightMmol: number,
) {
  if (![leftMmol, rightMmol].every((n) => Number.isFinite(n) && n >= 0))
    throw new RangeError('Amounts must be finite non-negative mmol.');
  const before: IonInventory = {};
  for (const [inventory, amount] of [
    [reaction.leftIons, leftMmol],
    [reaction.rightIons, rightMmol],
  ] as const) {
    for (const [id, coefficient] of Object.entries(inventory)) {
      const ion = id as IonId;
      before[ion] = (before[ion] ?? 0) + coefficient * amount;
    }
  }
  const participants = Object.entries(reaction.solidIons) as Array<
    [IonId, number]
  >;
  const solidMmol = participants.length
    ? Math.min(...participants.map(([id, ratio]) => (before[id] ?? 0) / ratio))
    : 0;
  const after = { ...before };
  const solid: IonInventory = {};
  for (const [id, ratio] of participants) {
    solid[id] = solidMmol * ratio;
    after[id] = (before[id] ?? 0) - solid[id]!;
  }
  return {
    before,
    after,
    solid,
    solidMmol,
    massG: (solidMmol / 1000) * reaction.molarMass,
  };
}

export function inventoryCharge(inventory: IonInventory) {
  return Object.entries(inventory).reduce(
    (sum, [id, amount]) => sum + ions[id as IonId].charge * amount,
    0,
  );
}

export function atomInventory(inventory: IonInventory) {
  const result: Record<string, number> = {};
  for (const [id, amount] of Object.entries(inventory)) {
    for (const [element, count] of Object.entries(ions[id as IonId].atoms))
      result[element] = (result[element] ?? 0) + amount * count;
  }
  return result;
}

export function spectatorIons(reaction: PrecipitationCase): IonId[] {
  if (!reaction.solid) return [];
  return [
    ...new Set([
      ...Object.keys(reaction.leftIons),
      ...Object.keys(reaction.rightIons),
    ]),
  ].filter((id) => !(id in reaction.solidIons)) as IonId[];
}

export function validSpectatorCancellation(
  reaction: PrecipitationCase,
  selected: IonId[],
) {
  const expected = spectatorIons(reaction);
  const actual = new Set(selected);
  return (
    Boolean(reaction.solid) &&
    actual.size === expected.length &&
    expected.every((id) => actual.has(id))
  );
}

export const conductorSamples = [
  {
    id: 'salt-solid',
    name: t('干燥固体 NaCl', 'Dry solid NaCl'),
    mobile: false,
    particles: [
      { label: 'Na⁺', charge: 1 },
      { label: 'Cl⁻', charge: -1 },
    ],
    explanation: t(
      '离子本来就存在，但被约束在晶格位置附近；本模型中不能靠自由迁移形成持续离子电流。',
      'Ions already exist, but are constrained near lattice positions; they cannot carry a sustained ionic current here.',
    ),
  },
  {
    id: 'salt-water',
    name: t('NaCl 水溶液', 'NaCl solution'),
    mobile: true,
    particles: [
      { label: 'Na⁺', charge: 1 },
      { label: 'Cl⁻', charge: -1 },
    ],
    explanation: t(
      '水将原有的 Na⁺ 和 Cl⁻ 分散开；它们能移动并传递电荷。溶液整体仍然电中性。',
      'Water disperses existing Na⁺ and Cl⁻ ions. They can move and carry charge; the solution as a whole stays neutral.',
    ),
  },
  {
    id: 'sugar-water',
    name: t('蔗糖水溶液', 'Sucrose solution'),
    mobile: true,
    particles: [{ label: 'C₁₂H₂₂O₁₁', charge: 0 }],
    explanation: t(
      '蔗糖主要以中性分子分散；能移动不等于能传递净电荷。忽略水本身的微弱导电和杂质。',
      'Sucrose disperses mainly as neutral molecules. Mobility alone does not carry net charge. Water’s tiny conductivity and impurities are omitted.',
    ),
  },
];

export function carriesIonicCurrent(sample: (typeof conductorSamples)[number]) {
  return (
    sample.mobile && sample.particles.some((particle) => particle.charge !== 0)
  );
}
