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
];
