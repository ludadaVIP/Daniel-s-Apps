import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AtomSymbol = 'H' | 'O' | 'C' | 'N' | 'He';
export type EntityId =
  'He' | 'H2' | 'O2' | 'O3' | 'H2O' | 'H2O2' | 'CO2' | 'NH3';
export type MolecularId = Exclude<EntityId, 'He'>;
export type SampleClass = 'element' | 'compound' | 'mixture';
export const entityCatalog: Record<
  EntityId,
  { formula: string; atoms: AtomSymbol[]; molecular: boolean }
> = {
  He: { formula: 'He', atoms: ['He'], molecular: false },
  H2: { formula: 'H₂', atoms: ['H', 'H'], molecular: true },
  O2: { formula: 'O₂', atoms: ['O', 'O'], molecular: true },
  O3: { formula: 'O₃', atoms: ['O', 'O', 'O'], molecular: true },
  H2O: { formula: 'H₂O', atoms: ['H', 'H', 'O'], molecular: true },
  H2O2: { formula: 'H₂O₂', atoms: ['H', 'H', 'O', 'O'], molecular: true },
  CO2: { formula: 'CO₂', atoms: ['C', 'O', 'O'], molecular: true },
  NH3: { formula: 'NH₃', atoms: ['N', 'H', 'H', 'H'], molecular: true },
};
export const atomNames: Record<AtomSymbol, LocalizedText> = {
  H: t('氢', 'Hydrogen'),
  O: t('氧', 'Oxygen'),
  C: t('碳', 'Carbon'),
  N: t('氮', 'Nitrogen'),
  He: t('氦', 'Helium'),
};
export const classNames: Record<SampleClass, LocalizedText> = {
  element: t('纯单质', 'Pure elemental substance'),
  compound: t('纯化合物', 'Pure compound'),
  mixture: t('混合物', 'Mixture'),
};
export const moleculeSamples: Array<{
  id: string;
  entities: EntityId[];
  explanation: LocalizedText;
}> = [
  {
    id: 'A',
    entities: ['He', 'He', 'He', 'He'],
    explanation: t(
      '四个独立 He 原子，原子总数 4、分子数 0。只含一种物质、一种元素，是单质。He 两个字母合在一起是一个元素符号。',
      'Four separate He atoms: 4 atoms and 0 molecules. One substance and one element make a pure elemental substance. The two letters He form one element symbol.',
    ),
  },
  {
    id: 'B',
    entities: ['O2', 'O2', 'O2'],
    explanation: t(
      '三个 O₂ 分子共有六个氧原子。每个分子虽有两个原子，却只有氧一种元素，所以不是化合物。',
      'Three O₂ molecules contain six oxygen atoms. Two atoms per molecule still represent only one element, so this is not a compound.',
    ),
  },
  {
    id: 'C',
    entities: ['H2O', 'H2O'],
    explanation: t(
      '两个相同 H₂O 分子：四个 H 原子、两个 O 原子。两种元素在同一分子内化合，整份模型只有水一种物质。',
      'Two identical H₂O molecules contain four H and two O atoms. Two elements combine within each molecule, while the sample contains only water.',
    ),
  },
  {
    id: 'D',
    entities: ['H2', 'H2', 'O2'],
    explanation: t(
      '两个 H₂ 与一个 O₂ 共三个分子、六个原子，但仍是两种物质的混合物。把它们画在一起不表示它们已经反应成水。',
      'Two H₂ and one O₂ give three molecules and six atoms, but two substances remain mixed. Drawing them together does not show that water has formed.',
    ),
  },
  {
    id: 'E',
    entities: ['H2O', 'O2'],
    explanation: t(
      '一个水分子与一个氧气分子，共两个分子、五个原子。这是化合物与单质组成的混合物，不是所有分子都一样的纯水。',
      'One water molecule and one oxygen molecule give two molecules and five atoms. This is a mixture of a compound and an elemental substance, not pure water.',
    ),
  },
  {
    id: 'F',
    entities: ['O2', 'O3'],
    explanation: t(
      'O₂ 和 O₃ 都只含氧元素，却是不同单质。这里有两种物质，是混合物；同一种颜色、同一种元素，不足以证明纯净。',
      'O₂ and O₃ contain only oxygen but are different elemental substances. Two substances make this a mixture; one colour or one element alone does not prove purity.',
    ),
  },
];

export function entityInventory(entities: readonly EntityId[]) {
  if (!entities.length)
    throw new Error('A sample must contain at least one entity');
  const byElement: Partial<Record<AtomSymbol, number>> = {};
  let molecules = 0;
  for (const id of entities) {
    const entity = entityCatalog[id];
    if (!entity) throw new Error('Unknown entity');
    if (entity.molecular) molecules++;
    for (const atom of entity.atoms)
      byElement[atom] = (byElement[atom] ?? 0) + 1;
  }
  const elementKinds = Object.keys(byElement).length;
  const substanceKinds = new Set(entities).size;
  const classification: SampleClass =
    substanceKinds > 1 ? 'mixture' : elementKinds > 1 ? 'compound' : 'element';
  return {
    byElement,
    atoms: Object.values(byElement).reduce((a, b) => a + b, 0),
    molecules,
    elementKinds,
    substanceKinds,
    classification,
  };
}
export const formulaChoices: MolecularId[] = [
  'H2O',
  'H2O2',
  'CO2',
  'NH3',
  'O2',
];
export function formulaBatch(id: MolecularId, copies: number) {
  if (
    !formulaChoices.includes(id) ||
    !Number.isInteger(copies) ||
    copies < 1 ||
    copies > 4
  )
    throw new Error('Invalid formula batch');
  const entities = Array.from({ length: copies }, () => id);
  return { entities, ...entityInventory(entities) };
}
// A blank entry must never silently count as zero. Require complete whole-number input.
export function readParticleCount(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const n = Number(value.trim());
  return Number.isSafeInteger(n) ? n : null;
}
