import type { LocalizedText, SubjectId } from '@study/shared';

export type Subject = {
  id: SubjectId;
  number: string;
  name: LocalizedText;
  phrase: LocalizedText;
  question: LocalizedText;
  status: LocalizedText;
  available: boolean;
  path: string;
};

export const subjects: Subject[] = [
  {
    id: 'physics',
    number: '01',
    name: { zh: '物理', en: 'Physics' },
    phrase: {
      zh: '从力与运动，看懂世界如何运转。',
      en: 'Explore motion, forces and the rules behind them.',
    },
    question: {
      zh: '为什么月亮不会掉下来？',
      en: 'Why does the Moon not fall?',
    },
    status: { zh: '24 节探索课已开放', en: '24 discovery lessons open' },
    available: true,
    path: '/physics',
  },
  {
    id: 'chemistry',
    number: '02',
    name: { zh: '化学', en: 'Chemistry' },
    phrase: {
      zh: '从物质与粒子，走进看不见的变化。',
      en: 'Go from matter and particles to invisible change.',
    },
    question: { zh: '空气也是物质吗？', en: 'Is air matter too?' },
    status: { zh: '正在建设', en: 'In progress' },
    available: true,
    path: '/chemistry',
  },
  {
    id: 'biology',
    number: '03',
    name: { zh: '生物', en: 'Biology' },
    phrase: {
      zh: '从细胞与生命，认识我们和自然。',
      en: 'Explore cells, life and the living world.',
    },
    question: {
      zh: '一粒种子如何长成树？',
      en: 'How does a seed become a tree?',
    },
    status: { zh: '即将开始', en: 'Coming later' },
    available: false,
    path: '/biology',
  },
];
