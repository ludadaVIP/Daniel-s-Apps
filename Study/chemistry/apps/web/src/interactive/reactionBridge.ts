import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type ChangeVerdict = 'physical' | 'chemical' | 'insufficient';
export type EvidenceBasis = 'appearance' | 'same' | 'new' | 'missing';
export const changeEvidenceCards: Array<{
  id: string;
  title: LocalizedText;
  observation: LocalizedText;
  identity: LocalizedText;
  verdict: ChangeVerdict;
  explanation: LocalizedText;
}> = [
  {
    id: 'A',
    title: t('A · 液体里有气泡', 'A · Bubbles in a liquid'),
    observation: t(
      '一杯液体中不断出现气泡。仅有这条外观记录。',
      'Bubbles repeatedly appear in a liquid. This appearance is the only record.',
    ),
    identity: t(
      '本题补充：纯水受热沸腾。给定完整身份清单中，液体与蒸气都是 H₂O；冷凝后仍是水，没有新增物质种类。',
      'Added record: pure water is boiling. The supplied complete identity list gives H₂O in both liquid and vapour; condensation returns water, with no new substance type.',
    ),
    verdict: 'physical',
    explanation: t(
      '气泡在这里来自状态变化；给定身份保持。不能从其他未知气泡直接推断同一结果。',
      'These bubbles reflect a phase change with unchanged supplied identities. Other unknown bubbles need their own evidence.',
    ),
  },
  {
    id: 'B',
    title: t('B · 液体里有气泡', 'B · Bubbles in a liquid'),
    observation: t(
      '两份材料接触后出现气泡。仅有这条外观记录。',
      'Bubbles appear after two materials meet. This appearance is the only record.',
    ),
    identity: t(
      '本题补充：指定酸与碳酸氢盐体系的前后身份记录确认形成了新的 CO₂ 气体；这不是原先困住的空气或液态 CO₂ 沸腾。此为给定教学记录，不是现场检测。',
      'Added record: before/after identities for a specified acid–hydrogen carbonate system confirm newly formed CO₂ gas, rather than trapped air or boiling liquid CO₂. This is a supplied teaching record, not a live test.',
    ),
    verdict: 'chemical',
    explanation: t(
      '支持化学变化的是新增物质的身份记录，气泡外观只是线索。气体也含原来材料中的原子。',
      'New-substance identity supports chemical change; bubbles alone were only a clue. The gas still contains atoms from the starting materials.',
    ),
  },
  {
    id: 'C',
    title: t('C · 出现白色固体', 'C · A white solid appears'),
    observation: t(
      '原来清澈的液体中出现白色固体。尚未给物质身份。',
      'A white solid appears in a previously clear liquid. No identities are supplied yet.',
    ),
    identity: t(
      '本题补充：食盐水中的水被移走，析出 NaCl 晶体。给定完整身份清单确认 NaCl 只是从溶液中结晶，水仍是 H₂O，没有新化学物质形成。',
      'Added record: water is removed from salt water and NaCl crystallises. The supplied complete identity list confirms crystallisation of the original salt, unchanged H₂O, and no new chemical substance.',
    ),
    verdict: 'physical',
    explanation: t(
      '出现固体不一定是新物质形成；本题是原有盐结晶。不能把所有白色固体都当作化学沉淀。',
      'A new solid appearance need not mean a new substance; this salt crystallised. Not every white solid establishes a chemical precipitation reaction.',
    ),
  },
  {
    id: 'D',
    title: t('D · 出现白色固体', 'D · A white solid appears'),
    observation: t(
      '两杯清液混合后出现白色固体。仅凭外观还未鉴定固体。',
      'Two clear liquids give a white solid on mixing. Appearance alone has not identified it.',
    ),
    identity: t(
      '本题补充：给定的反应前后身份记录确认，硝酸银溶液与氯化钠溶液接触后，形成新物质 AgCl 固体。鉴定信息已由题目提供，不需要孩子操作试剂。',
      'Added record: supplied before/after identities confirm new AgCl solid after silver nitrate and sodium chloride solutions meet. Identity evidence is given; no reagent handling is needed.',
    ),
    verdict: 'chemical',
    explanation: t(
      '题设确认新物质 AgCl，支持化学变化；白色本身不能识别 AgCl，更不能证明任意两杯清液都如此反应。',
      'The supplied new AgCl identity supports chemical change. White colour alone neither identifies AgCl nor predicts every pair of clear liquids.',
    ),
  },
  {
    id: 'E',
    title: t('E · 混合后颜色改变', 'E · Colour changes on mixing'),
    observation: t(
      '蓝色与黄色液体混合后看起来绿色。只记录了颜色。',
      'Blue and yellow liquids look green after mixing. Only colour is recorded.',
    ),
    identity: t(
      '本题补充：给定完整组成清单规定，两种不反应的色素混合，前后是同样的色素分子与水，只是分布改变；没有新增物质。',
      'Added record: the complete supplied inventory specifies two non-reacting dyes. The same dye molecules and water remain, redistributed with no new substance.',
    ),
    verdict: 'physical',
    explanation: t(
      '本题明确给出不反应与身份保持，支持物理混合。不能仅从绿色推断任何未知色素都不反应。',
      'Unchanged identities and the specified non-reaction support physical mixing here. Green appearance alone cannot establish that for arbitrary dyes.',
    ),
  },
  {
    id: 'F',
    title: t('F · 表面颜色改变', 'F · A surface changes colour'),
    observation: t(
      '一个物体表面从红棕色变成黑色。暂时没有成分信息。',
      'A surface changes from reddish brown to black, with no composition information yet.',
    ),
    identity: t(
      '本题补充：指定铜与氧的体系中，题设身份记录确认出现新物质 CuO，不只是阴影或表面湿润造成的变色。本题不提供加热操作。',
      'Added record: supplied identities for a specified copper/oxygen system confirm new CuO, rather than shadow or wetting. No heating procedure is provided.',
    ),
    verdict: 'chemical',
    explanation: t(
      '新增 CuO 的身份记录支持化学变化，黑色只是外观线索；不能凭颜色判断未知黑色固体就是 CuO。',
      'New CuO identity supports chemical change; black appearance was only a clue and cannot identify an unknown black solid.',
    ),
  },
  {
    id: 'G',
    title: t('G · 温度降低', 'G · Temperature falls'),
    observation: t(
      '两份材料接触后，题设温度读数降低。未给材料身份。',
      'A supplied temperature record falls after materials meet. Their identities are not yet given.',
    ),
    identity: t(
      '本题补充：冰加入纯水后融化并使水降温。给定完整组成清单中始终只有 H₂O，变化在状态和能量分配。',
      'Added record: ice melts in pure water and cools it. The supplied complete composition list contains only H₂O throughout; state and energy distribution change.',
    ),
    verdict: 'physical',
    explanation: t(
      '降温可由熔化与能量转移引起；这里没有新增物质。温度变化不是化学变化的专属证据。',
      'Melting and energy transfer can cool a system without new substances. Temperature change is not exclusive to chemical reactions.',
    ),
  },
  {
    id: 'H',
    title: t('H · 温度降低', 'H · Temperature falls'),
    observation: t(
      '两份未知材料混合后温度降低。没有物质身份记录。',
      'Two unknown materials cool on mixing, with no identity records.',
    ),
    identity: t(
      '本题补充：另一组重复记录也显示降温，但仍未给出材料身份、状态变化或前后组成。重复现象并没有补上缺失的身份对照。',
      'Added record: a repeat also shows cooling, but gives no material identities, phase change or before/after composition. Repetition has not supplied the missing identity comparison.',
    ),
    verdict: 'insufficient',
    explanation: t(
      '多一次相同现象仍不能区分反应、溶解、熔化等可能过程。证据不足不等于“已证明没有反应”。',
      'A repeated observation still cannot distinguish reaction, dissolving or melting. Insufficient evidence does not prove that no reaction occurred.',
    ),
  },
];
export function changeEvidenceState(index: number, expanded: boolean) {
  if (
    !Number.isInteger(index) ||
    !changeEvidenceCards[index] ||
    typeof expanded !== 'boolean'
  )
    throw new Error('Invalid evidence card');
  const card = changeEvidenceCards[index]!;
  const verdict: ChangeVerdict = expanded ? card.verdict : 'insufficient';
  const basis: EvidenceBasis =
    verdict === 'physical'
      ? 'same'
      : verdict === 'chemical'
        ? 'new'
        : 'missing';
  return { card, verdict, basis };
}
export const bridgeMolecules = {
  H2: { formula: 'H₂', atoms: { H: 2 } },
  O2: { formula: 'O₂', atoms: { O: 2 } },
  H2O: { formula: 'H₂O', atoms: { H: 2, O: 1 } },
  N2: { formula: 'N₂', atoms: { N: 2 } },
  NH3: { formula: 'NH₃', atoms: { N: 1, H: 3 } },
  CO: { formula: 'CO', atoms: { C: 1, O: 1 } },
  CO2: { formula: 'CO₂', atoms: { C: 1, O: 2 } },
  H2O2: { formula: 'H₂O₂', atoms: { H: 2, O: 2 } },
  Cl2: { formula: 'Cl₂', atoms: { Cl: 2 } },
  HCl: { formula: 'HCl', atoms: { H: 1, Cl: 1 } },
} as const;
export type BridgeMoleculeId = keyof typeof bridgeMolecules;
export type EquationTerm = {
  molecule: BridgeMoleculeId;
  side: 'left' | 'right';
};
export const moleculeEquationCases: Array<{
  terms: EquationTerm[];
  scope: LocalizedText;
}> = [
  {
    terms: [
      { molecule: 'H2', side: 'left' },
      { molecule: 'O2', side: 'left' },
      { molecule: 'H2O', side: 'right' },
    ],
    scope: t(
      '指定氢、氧形成水的组成记账；不模拟点火或反应条件。',
      'Composition accounting for specified water formation; ignition and reaction conditions are not modelled.',
    ),
  },
  {
    terms: [
      { molecule: 'N2', side: 'left' },
      { molecule: 'H2', side: 'left' },
      { molecule: 'NH3', side: 'right' },
    ],
    scope: t(
      '只核对指定合成氨正方向的原子账本。真实反应可逆，条件、平衡和产率不在模型中。',
      'Audit only the forward atom ledger for specified ammonia synthesis. The real reaction is reversible; conditions, equilibrium and yield are outside this model.',
    ),
  },
  {
    terms: [
      { molecule: 'CO', side: 'left' },
      { molecule: 'O2', side: 'left' },
      { molecule: 'CO2', side: 'right' },
    ],
    scope: t(
      '只作指定 CO 氧化的纸面记账，不是实验，也不模拟混合气体。',
      'Paper accounting for specified CO oxidation, not an experiment or a mixed-gas simulation.',
    ),
  },
  {
    terms: [
      { molecule: 'H2O2', side: 'left' },
      { molecule: 'H2O', side: 'right' },
      { molecule: 'O2', side: 'right' },
    ],
    scope: t(
      '只作指定过氧化氢分解的组成记账，不模拟速率、催化剂或操作条件。',
      'Composition accounting for specified peroxide decomposition; rates, catalysts and procedures are not modelled.',
    ),
  },
  {
    terms: [
      { molecule: 'H2', side: 'left' },
      { molecule: 'Cl2', side: 'left' },
      { molecule: 'HCl', side: 'right' },
    ],
    scope: t(
      '这里只清点指定分子氯化氢形成的组成，不模拟混气或操作。HCl 指分子氯化氢，不是水溶液中的离子清单。',
      'Only count composition for specified molecular hydrogen chloride formation, without gas mixing or procedures. HCl denotes molecules, not an inventory of ions in aqueous solution.',
    ),
  },
];
export function moleculeEquationLedger(
  index: number,
  coefficients: readonly number[],
) {
  if (
    !Number.isInteger(index) ||
    !moleculeEquationCases[index] ||
    coefficients.length !== 3 ||
    !coefficients.every((n) => Number.isInteger(n) && n >= 1 && n <= 4)
  )
    throw new Error('Invalid equation candidate');
  const scenario = moleculeEquationCases[index]!;
  const left: Record<string, number> = {},
    right: Record<string, number> = {};
  let leftMolecules = 0,
    rightMolecules = 0;
  scenario.terms.forEach((term, i) => {
    const count = coefficients[i]!;
    if (term.side === 'left') leftMolecules += count;
    else rightMolecules += count;
    const total = term.side === 'left' ? left : right;
    for (const [element, n] of Object.entries(
      bridgeMolecules[term.molecule].atoms,
    ))
      total[element] = (total[element] ?? 0) + count * n;
  });
  const elements = [...new Set([...Object.keys(left), ...Object.keys(right)])];
  return {
    scenario,
    left,
    right,
    elements,
    leftMolecules,
    rightMolecules,
    atomsMatch: elements.every((e) => (left[e] ?? 0) === (right[e] ?? 0)),
    moleculesMatch: leftMolecules === rightMolecules,
    leftAtomTotal: Object.values(left).reduce((a, b) => a + b, 0),
    rightAtomTotal: Object.values(right).reduce((a, b) => a + b, 0),
  };
}
