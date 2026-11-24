import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const protonSpecies = {
  hydrogenChloride: { label: 'HCl', charge: 0, atoms: { H: 1, Cl: 1 } },
  water: { label: 'H₂O', charge: 0, atoms: { H: 2, O: 1 } },
  hydronium: { label: 'H₃O⁺', charge: 1, atoms: { H: 3, O: 1 } },
  chloride: { label: 'Cl⁻', charge: -1, atoms: { Cl: 1 } },
  ammonia: { label: 'NH₃', charge: 0, atoms: { N: 1, H: 3 } },
  ammonium: { label: 'NH₄⁺', charge: 1, atoms: { N: 1, H: 4 } },
  hydroxide: { label: 'OH⁻', charge: -1, atoms: { O: 1, H: 1 } },
  proton: { label: 'H⁺', charge: 1, atoms: { H: 1 } },
  sodium: { label: 'Na⁺', charge: 1, atoms: { Na: 1 } },
  calcium: { label: 'Ca²⁺', charge: 2, atoms: { Ca: 1 } },
  carbonate: { label: 'CO₃²⁻', charge: -2, atoms: { C: 1, O: 3 } },
  bicarbonate: { label: 'HCO₃⁻', charge: -1, atoms: { H: 1, C: 1, O: 3 } },
  carbonDioxide: { label: 'CO₂', charge: 0, atoms: { C: 1, O: 2 } },
} as const;
export type ProtonSpeciesId = keyof typeof protonSpecies;
export type ProtonInventory = Partial<Record<ProtonSpeciesId, number>>;

export const protonEvents = [
  {
    id: 'acid-in-water',
    title: t('HCl 遇到水', 'HCl meets water'),
    before: { hydrogenChloride: 1, water: 1 },
    after: { chloride: 1, hydronium: 1 },
    donor: 'hydrogenChloride',
    acceptor: 'water',
    donorProduct: 'chloride',
    acceptorProduct: 'hydronium',
    equation: 'HCl + H₂O → Cl⁻ + H₃O⁺',
    explanation: t(
      '在这个正向事件中，HCl 给出 H⁺，水接受 H⁺。水在这里扮演碱；这是一个事件，不是说整杯水全部变成 H₃O⁺。',
      'In this forward event, HCl donates H⁺ and water accepts it. Water acts as a base here. This is one event, not conversion of the whole cup of water to H₃O⁺.',
    ),
  },
  {
    id: 'ammonia-in-water',
    title: t('NH₃ 遇到水', 'NH₃ meets water'),
    before: { water: 1, ammonia: 1 },
    after: { hydroxide: 1, ammonium: 1 },
    donor: 'water',
    acceptor: 'ammonia',
    donorProduct: 'hydroxide',
    acceptorProduct: 'ammonium',
    equation: 'H₂O + NH₃ ⇌ OH⁻ + NH₄⁺',
    explanation: t(
      '在所示正向事件中，水给出 H⁺，NH₃ 接受 H⁺。水这次扮演酸。双向箭头提醒你存在逆过程；氨是弱碱，不能把一个事件画成整杯氨全部转化。',
      'In the shown forward event, water donates H⁺ and NH₃ accepts it. Water acts as an acid this time. The double arrow allows the reverse process; ammonia is a weak base, so one event does not imply complete conversion.',
    ),
  },
  {
    id: 'hydronium-hydroxide',
    title: t('H₃O⁺ 遇到 OH⁻', 'H₃O⁺ meets OH⁻'),
    before: { hydronium: 1, hydroxide: 1 },
    after: { water: 2 },
    donor: 'hydronium',
    acceptor: 'hydroxide',
    donorProduct: 'water',
    acceptorProduct: 'water',
    equation: 'H₃O⁺ + OH⁻ → 2H₂O',
    explanation: t(
      'H₃O⁺ 给出一个 H⁺ 后成为水，OH⁻ 接受它后也成为水。因此生成两份水，而不是让正负电荷或原子消失。',
      'H₃O⁺ becomes water after donating H⁺, and OH⁻ becomes water after accepting it. Two waters result; neither charge nor atoms simply disappear.',
    ),
  },
] satisfies Array<{
  id: string;
  title: LocalizedText;
  before: ProtonInventory;
  after: ProtonInventory;
  donor: ProtonSpeciesId;
  acceptor: ProtonSpeciesId;
  donorProduct: ProtonSpeciesId;
  acceptorProduct: ProtonSpeciesId;
  equation: string;
  explanation: LocalizedText;
}>;

export function protonInventoryAtoms(inventory: ProtonInventory) {
  const result: Record<string, number> = {};
  for (const [id, amount] of Object.entries(inventory))
    for (const [element, count] of Object.entries(
      protonSpecies[id as ProtonSpeciesId].atoms,
    ))
      result[element] = (result[element] ?? 0) + count * amount;
  return result;
}
export function protonInventoryCharge(inventory: ProtonInventory) {
  return Object.entries(inventory).reduce(
    (total, [id, amount]) =>
      total + amount * protonSpecies[id as ProtonSpeciesId].charge,
    0,
  );
}

export const hydroxideStocks = [
  { id: 'sodium', formula: 'NaOH', cation: 'sodium', hydroxides: 1 },
  { id: 'calcium', formula: 'Ca(OH)₂', cation: 'calcium', hydroxides: 2 },
] as const;

function checkAmounts(...amounts: number[]) {
  if (!amounts.every((amount) => Number.isFinite(amount) && amount >= 0))
    throw new RangeError('Amounts must be finite non-negative mmol.');
}

export function neutralisationLedger(
  stock: (typeof hydroxideStocks)[number],
  acidMmol: number,
  baseMmol: number,
) {
  checkAmounts(acidMmol, baseMmol);
  const hydroxideMmol = baseMmol * stock.hydroxides;
  const reactedMmol = Math.min(acidMmol, hydroxideMmol);
  const before: ProtonInventory = {
    proton: acidMmol,
    chloride: acidMmol,
    [stock.cation]: baseMmol,
    hydroxide: hydroxideMmol,
  };
  const solution: ProtonInventory = {
    ...before,
    proton: acidMmol - reactedMmol,
    hydroxide: hydroxideMmol - reactedMmol,
  };
  const produced: ProtonInventory = { water: reactedMmol };
  const balance =
    acidMmol === hydroxideMmol
      ? 'balanced'
      : acidMmol > hydroxideMmol
        ? 'acid'
        : 'base';
  return { before, solution, produced, reactedMmol, hydroxideMmol, balance };
}

export const carbonSalts = [
  {
    id: 'carbonate',
    formula: 'Na₂CO₃',
    species: 'carbonate',
    sodiums: 2,
    acidPerCarbon: 2,
    equation: 'CO₃²⁻ + 2H⁺ → CO₂ + H₂O',
  },
  {
    id: 'bicarbonate',
    formula: 'NaHCO₃',
    species: 'bicarbonate',
    sodiums: 1,
    acidPerCarbon: 1,
    equation: 'HCO₃⁻ + H⁺ → CO₂ + H₂O',
  },
] as const;

// Only acid-excess cases are modelled. An acid-shortage mixture requires
// carbonate/bicarbonate and gas–liquid equilibria, not just min(nC, nH/2).
export function carbonGasLedger(
  salt: (typeof carbonSalts)[number],
  saltMmol: number,
  excessAcidMmol: number,
) {
  checkAmounts(saltMmol, excessAcidMmol);
  if (excessAcidMmol <= 0)
    throw new RangeError('This model requires excess acid.');
  const requiredAcidMmol = saltMmol * salt.acidPerCarbon;
  const acidMmol = requiredAcidMmol + excessAcidMmol;
  const before: ProtonInventory = {
    [salt.species]: saltMmol,
    sodium: saltMmol * salt.sodiums,
    proton: acidMmol,
    chloride: acidMmol,
  };
  const solution: ProtonInventory = {
    sodium: saltMmol * salt.sodiums,
    proton: excessAcidMmol,
    chloride: acidMmol,
  };
  const produced: ProtonInventory = {
    water: saltMmol,
    carbonDioxide: saltMmol,
  };
  return {
    before,
    solution,
    produced,
    acidMmol,
    requiredAcidMmol,
    gasMmol: saltMmol,
    gasMassG: (saltMmol * 44) / 1000,
  };
}
