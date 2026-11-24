import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type ParticleMark = {
  id: string;
  species: 'W' | 'S';
  x: number;
  y: number;
  radius: number;
};
export type WaterPhase = 'liquid' | 'solid' | 'gas';

// Coordinates are authored schematic positions, not a trajectory or volume scale.
export function waterPicture(
  phase: WaterPhase,
  count = 12,
  radius = 9,
): ParticleMark[] {
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > 12 ||
    !Number.isFinite(radius) ||
    radius <= 0
  )
    throw new Error('Invalid schematic particle settings');
  return Array.from({ length: count }, (_, i) => ({
    id: `w${i}`,
    species: 'W',
    radius,
    x:
      phase === 'gas'
        ? 27 + (i % 4) * 60
        : phase === 'solid'
          ? 62 + (i % 4) * 36
          : 68 + (i % 4) * 32 + (i % 2 ? 6 : 0),
    y:
      phase === 'gas'
        ? 30 + Math.floor(i / 4) * 62
        : phase === 'solid'
          ? 94 + Math.floor(i / 4) * 34
          : 103 + Math.floor(i / 4) * 28 + (i % 3) * 3,
  }));
}
export const phaseCandidates = {
  gas: ['lost', 'conserved', 'grown'],
  solid: ['grown', 'lost', 'conserved'],
} as const;
export type DiagramClaim = 'lost' | 'conserved' | 'grown';
export function candidatePicture(phase: 'solid' | 'gas', claim: DiagramClaim) {
  return waterPicture(
    phase,
    claim === 'lost' ? 8 : 12,
    claim === 'grown' ? 14 : 9,
  );
}
export const phaseFeedback: Record<DiagramClaim, LocalizedText> = {
  conserved: t(
    '这张图保留了 12 个相同的 W 符号，只改变排列与间距。W 仍代表水分子，既没有变大，也没有从封闭范围消失。',
    'This picture keeps 12 identical W symbols and changes their arrangement and spacing. W still represents water molecules; they neither grow nor leave the closed boundary.',
  ),
  lost: t(
    '这张图只剩 8 个 W。题目规定没有物质进出、没有反应，不能用少画分子来解释同一份水的状态变化。',
    'Only 8 W symbols remain. With no transfer of matter and no reaction, losing molecules cannot explain a state change of this same sample.',
  ),
  grown: t(
    '这张图把 W 符号画大了。这里应该改变分子间的排列与间距，不能用“水分子膨胀”解释水变成气体。',
    'The W symbols have grown. Change intermolecular arrangement and spacing here; do not explain vaporisation by inflating water molecules.',
  ),
};

export const dissolvingStages = [
  {
    title: t('混合前', 'Before mixing'),
    question: t(
      '图中糖晶体由多少个 S 符号代表？',
      'How many S symbols represent the sugar crystal?',
    ),
    options: [
      t('1 个：一个糖堆', '1: one pile'),
      t(
        '8 个：一堆含多个分子符号',
        '8: one pile contains several molecule symbols',
      ),
      t('0 个：只数看得见的液体', '0: only count visible liquid'),
    ],
    answer: 1,
    explanation: t(
      '糖堆不是一个糖分子。图中 8 个 S 代表糖分子，16 个 W 代表水分子；这只是小数量示意，不是实际分子数或比例。',
      'A sugar pile is not one molecule. Eight S symbols represent sugar molecules and 16 W symbols water molecules. These small counts are schematic, not real molecular counts or proportions.',
    ),
  },
  {
    title: t('充分混合后', 'After mixing'),
    question: t(
      '本图中的糖溶解时，主要改变了什么？',
      'What mainly changed as sugar dissolved in this model?',
    ),
    options: [
      t('糖分子的身份', 'The identity of sugar molecules'),
      t('每个糖分子的大小', 'Each sugar molecule’s size'),
      t('糖分子在水中的分布', 'The distribution of sugar molecules in water'),
    ],
    answer: 2,
    explanation: t(
      '8 个 S 分散在水分子之间，糖仍是糖。这里假定糖量低于溶解限度、没有分解或其他反应；不能把这幅图套到所有溶质上。',
      'Eight S symbols are dispersed among water molecules; sugar remains sugar. We assume an amount below the solubility limit with no decomposition or other reaction. Do not apply this picture to every solute.',
    ),
  },
  {
    title: t('普通滤纸过滤清液', 'Ordinary paper filtration'),
    question: t(
      '理想普通过滤后，已溶解的糖在哪里？',
      'After ideal ordinary filtration, where is the dissolved sugar?',
    ),
    options: [
      t('和水一起通过滤纸', 'It passes through with the water'),
      t('全留在滤纸上', 'All on the filter paper'),
      t('被滤纸变成水', 'Converted to water by the paper'),
    ],
    answer: 0,
    explanation: t(
      '普通滤纸主要截留适当大小的不溶固体，不能把这种分子尺度的糖从水中滤出。这里忽略少量附着或损失；膜分离等其他技术另有条件。',
      'Ordinary paper retains suitably sized insoluble solids; it does not remove this molecularly dispersed sugar from water. Small adhesion losses are ignored. Membrane separations have different conditions.',
    ),
  },
  {
    title: t('部分水已离开', 'Some water has left'),
    question: t(
      '6 个 W 已作为水蒸气离开，留下多少个 S？',
      'Six W symbols have left as water vapour. How many S remain?',
    ),
    options: [t('4 个', '4'), t('8 个', '8'), t('0 个', '0')],
    answer: 1,
    explanation: t(
      '水离开不要求糖也同比离开。本图剩下 10 个 W 和 8 个 S，外部有 6 个 W；假定糖不挥发、不分解且仍可溶，不能据这几个符号计算实际浓度。',
      'Water leaving does not require proportional sugar loss. Ten W and eight S remain; six W are outside. Sugar is assumed nonvolatile, undecomposed and still dissolved; these symbols cannot give a real concentration.',
    ),
  },
  {
    title: t('理想完全回收', 'Ideal complete recovery'),
    question: t(
      '水全部离开后，哪份记录完整？',
      'Once all water has left, which record is complete?',
    ),
    options: [
      t('糖留在范围内，水已被消灭', 'Sugar remains; water was destroyed'),
      t('糖分子也变成水蒸气', 'Sugar molecules also became water vapour'),
      t(
        '糖留在范围内，水在范围外仍存在',
        'Sugar remains inside; water still exists outside',
      ),
    ],
    answer: 2,
    explanation: t(
      '范围内有 8 个 S，范围外累计有 16 个 W。实际回收需避免糖分解、飞溅和损失；这只是理想库存，不是家庭加热步骤。',
      'Eight S symbols remain inside and 16 W symbols are accounted for outside. Real recovery must avoid decomposition, splashing and losses. This is an ideal inventory, not a home heating procedure.',
    ),
  },
] as const;

export function dissolvingPicture(stage: number) {
  if (!Number.isInteger(stage) || stage < 0 || stage >= dissolvingStages.length)
    throw new Error('Invalid dissolution stage');
  const outsideCount = stage === 4 ? 16 : stage === 3 ? 6 : 0;
  const water = Array.from({ length: 16 }, (_, i): ParticleMark => ({
    id: `w${i}`,
    species: 'W',
    radius: 8,
    x: 22 + (i % 4) * 60,
    y: stage === 0 ? 20 + Math.floor(i / 4) * 26 : 27 + Math.floor(i / 4) * 44,
  }));
  const sugar = Array.from({ length: 8 }, (_, i): ParticleMark => ({
    id: `s${i}`,
    species: 'S',
    radius: 9,
    x: stage === 0 || stage === 4 ? 76 + (i % 4) * 24 : 48 + (i % 4) * 58,
    y:
      stage === 0 || stage === 4
        ? 138 + Math.floor(i / 4) * 24
        : 48 + Math.floor(i / 4) * 88,
  }));
  return {
    inside: [...water.slice(outsideCount), ...sugar],
    outside: water.slice(0, outsideCount),
    filter: [] as ParticleMark[],
  };
}
