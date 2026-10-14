import type { LocalizedText, SubjectId } from '@study/shared';
import geographyCurriculum from '../../../geograph/content/curriculum.json';
const geographyCount = geographyCurriculum
  .flatMap((s) => s.lessons)
  .filter((l) => l.status === 'available').length;

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
    status: { zh: '235 节探索课已开放', en: '235 discovery lessons open' },
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
    status: {
      zh: '48 节生命探索课已开放',
      en: '48 life discovery lessons open',
    },
    available: true,
    path: '/biology',
  },
  {
    id: 'pinyin',
    number: '04',
    name: { zh: '拼音侦探', en: 'Pinyin' },
    phrase: {
      zh: '解码中文的声音，把想法打出来。',
      en: 'Decode Chinese sounds. Type your ideas.',
    },
    question: {
      zh: '你会说的中文，怎样用字母写出来？',
      en: 'How do letters unlock the Chinese you know?',
    },
    status: { zh: '前四课已开放', en: 'First four lessons open' },
    available: true,
    path: '/pinyin',
  },
  {
    id: 'geography',
    number: '05',
    name: { zh: '地理', en: 'Geography' },
    phrase: {
      zh: '从地图与证据，探索人与世界。',
      en: 'Follow maps and evidence. Explore our world.',
    },
    question: {
      zh: '地图转过来，北也改变了吗？',
      en: 'When a map turns, does north change?',
    },
    status: {
      zh: `${geographyCount} 节双语探索课已开放`,
      en: `${geographyCount} bilingual lessons open`,
    },
    available: true,
    path: '/geography',
  },
  {
    id: 'math',
    number: '06',
    name: { zh: '数学', en: 'Maths' },
    phrase: {
      zh: '先看见，再算懂。发现数学的美。',
      en: 'See it. Make sense of it. Discover maths.',
    },
    question: {
      zh: '一半和二分之一，是同一件事吗？',
      en: 'Can different fractions show the same amount?',
    },
    status: {
      zh: '5 节微课与起点诊断已开放',
      en: '5 micro-lessons and a starting-point check',
    },
    available: true,
    path: '/math',
  },
];
