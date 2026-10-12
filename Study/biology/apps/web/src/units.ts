import { t } from './schema';
export const units = [
  {
    id: 'U01',
    stage: 'S01',
    title: t('生命是什么？', 'What is life?'),
    question: t(
      '怎样用证据判断生命？',
      'How can evidence help us recognise life?',
    ),
    lessonIds: ['L001', 'L002', 'L003', 'L004'],
    missionTitle: t(
      '给身边的物体，写一份生命证据。',
      'Build a case for something nearby.',
    ),
    missionPrompt: t(
      '在家里选一个物体。把观察和解释分开：我认为……，因为我观察到……，这说明……。可以记录“不确定”，并说还需要什么证据。',
      'Choose something at home. Separate observation and explanation: I claim …, I observed …, this suggests … . You can be unsure and explain what evidence is missing.',
    ),
    claimLabel: t(
      '① 我的主张：哪个物体？活的、不活的，还是不确定？',
      '① Claim: what object? Living, non-living, or unsure?',
    ),
  },
  {
    id: 'U02',
    stage: 'S01',
    title: t('进入微观世界', 'Into the microscopic world'),
    question: t(
      '一个小小的细胞，怎样与整个生命联系起来？',
      'How does a tiny cell connect to a whole living thing?',
    ),
    lessonIds: ['L005', 'L006', 'L007', 'L008'],
    missionTitle: t(
      '厨房里的细胞侦探：酵母与洋葱。',
      'Kitchen cell detective: yeast and onion.',
    ),
    missionPrompt: t(
      '回看 L008 的双语示意图。一个酵母细胞可以是一个完整个体；洋葱表皮的一格细胞是植物的一部分。写下你的主张、图中能观察到的证据，以及图示不能单独证明的事。可用厨房里的洋葱和有标签的面包酵母作生活对照，无需培养或购买显微镜。',
      'Revisit the L008 diagrams. One yeast cell can be an organism; an onion epidermal cell is part of a plant. State your claim, visible evidence and what the diagrams alone cannot establish. Compare with a kitchen onion and labelled baking yeast; no culturing or microscope purchase is needed.',
    ),
    claimLabel: t(
      '① 我的主张：酵母的一格与洋葱的一格，哪个是完整个体？',
      '① Claim: which single cell represents a whole organism—yeast or onion?',
    ),
  },
];
export function unitForLesson(id: string) {
  return units.find((unit) => unit.lessonIds.includes(id))!;
}
