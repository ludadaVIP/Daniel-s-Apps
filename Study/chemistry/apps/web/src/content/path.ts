import type { LocalizedText } from '@study/shared';

export type PathLevel = {
  id: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonCount: number;
  topics: LocalizedText[];
};

// A Phase 0 roadmap preview. Phase 1 will load this from validated content files.
export const pathLevels: PathLevel[] = [
  {
    id: 'matter',
    number: '01',
    title: { zh: '物质与粒子', en: 'Matter & particles' },
    description: {
      zh: '从身边看得见的东西，走进看不见的微观世界。',
      en: 'Start with everyday materials, then explore the invisible world.',
    },
    lessonCount: 5,
    topics: [
      { zh: '什么是物质？', en: 'What is matter?' },
      { zh: '一切由粒子构成', en: 'Everything is made of particles' },
      { zh: '固体、液体和气体', en: 'Solids, liquids and gases' },
    ],
  },
  {
    id: 'substances',
    number: '02',
    title: { zh: '元素、化合物与混合物', en: 'Elements, compounds & mixtures' },
    description: {
      zh: '学会用更清楚的方式给物质分类。',
      en: 'Learn to classify materials more precisely.',
    },
    lessonCount: 4,
    topics: [
      { zh: '纯净物与混合物', en: 'Pure substances and mixtures' },
      { zh: '什么是元素？', en: 'What is an element?' },
      { zh: '什么是化合物？', en: 'What is a compound?' },
    ],
  },
  {
    id: 'atoms',
    number: '03',
    title: { zh: '原子结构', en: 'Atomic structure' },
    description: {
      zh: '认识质子、中子、电子，理解元素的身份。',
      en: 'Meet protons, neutrons and electrons—and what identifies an element.',
    },
    lessonCount: 8,
    topics: [
      { zh: '什么是原子？', en: 'What is an atom?' },
      { zh: '质子、中子、电子', en: 'Protons, neutrons and electrons' },
      { zh: '原子序数与质量数', en: 'Atomic and mass numbers' },
    ],
  },
  {
    id: 'table',
    number: '04',
    title: { zh: '元素周期表', en: 'The periodic table' },
    description: {
      zh: '找到周期表里的规律，不再靠死记硬背。',
      en: 'Discover its patterns instead of memorizing a chart.',
    },
    lessonCount: 8,
    topics: [
      { zh: '周期表、族与周期', en: 'The table, groups and periods' },
      { zh: '金属与非金属', en: 'Metals and non-metals' },
      { zh: '第 1、17、18 族', en: 'Groups 1, 17 and 18' },
    ],
  },
  {
    id: 'bonding',
    number: '05',
    title: { zh: '离子与化学键', en: 'Ions & chemical bonding' },
    description: {
      zh: '从“最外层电子”走到盐、水和材料为什么能形成。',
      en: 'Move from outer electrons to why salt, water and materials can form.',
    },
    lessonCount: 5,
    topics: [
      { zh: '原子为什么连接？', en: 'Why atoms connect' },
      { zh: '离子键与共价键', en: 'Ionic and covalent bonds' },
      { zh: '结构怎样影响性质？', en: 'How structure affects properties' },
    ],
  },
  {
    id: 'formulae',
    number: '06',
    title: { zh: '化学式与命名', en: 'Chemical formulae & naming' },
    description: {
      zh: '读懂元素符号、下标和系数，让化学语言真正有意义。',
      en: 'Decode symbols, subscripts and coefficients so chemical language makes sense.',
    },
    lessonCount: 6,
    topics: [
      { zh: '化学式告诉我们什么？', en: 'What does a formula tell us?' },
      { zh: '下标与原子比例', en: 'Subscripts and atom ratios' },
      { zh: '离子电荷与最简比', en: 'Ion charges and simplest ratios' },
      { zh: '二元离子化合物命名', en: 'Naming binary ionic compounds' },
      { zh: '可变电荷与罗马数字', en: 'Variable charges and Roman numerals' },
      { zh: '多原子离子与括号', en: 'Polyatomic ions and parentheses' },
      { zh: '分子化合物与数字前缀', en: 'Molecular compounds and prefixes' },
    ],
  },
  {
    id: 'reactions',
    number: '07',
    title: { zh: '化学反应与方程式', en: 'Chemical reactions & equations' },
    description: {
      zh: '看见原子如何重新组合，再用方程式把过程准确记录下来。',
      en: 'Watch atoms rearrange, then record the process precisely with equations.',
    },
    lessonCount: 3,
    topics: [
      { zh: '反应物怎样变成生成物？', en: 'How do reactants become products?' },
      { zh: '反应现象与证据', en: 'Reaction observations and evidence' },
      { zh: '原子与质量守恒', en: 'Conservation of atoms and mass' },
      {
        zh: '读懂方程式的箭头、系数和下标',
        en: 'Read arrows, coefficients and subscripts',
      },
      { zh: '配平与原子守恒', en: 'Balancing and atom conservation' },
    ],
  },
  {
    id: 'acids',
    number: '08',
    title: { zh: '酸、碱与盐', en: 'Acids, bases & salts' },
    description: {
      zh: '从舌尖的酸味走到 pH 颜色尺，理解清洁、土壤和中和背后的规律。',
      en: 'Travel from sour taste to the pH colour scale, then explore the patterns behind cleaning, soil and neutralisation.',
    },
    lessonCount: 1,
    topics: [
      { zh: '酸、碱与 pH', en: 'Acids, bases and pH' },
      { zh: '指示剂的颜色线索', en: 'Indicator colour clues' },
      {
        zh: '安全观察与正确判断',
        en: 'Safe observations and sound conclusions',
      },
    ],
  },
];
