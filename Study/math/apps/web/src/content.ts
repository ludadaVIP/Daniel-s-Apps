import curriculumData from '../../../content/curriculum.json';
import {
  lessons as b04Lessons,
  diagnosticGroups,
  reviewQuestions as b04ReviewQuestions,
  reviewQuestionFor as b04ReviewQuestionFor,
} from './content/foundationPilot';
import {
  b01Lessons,
  b01ReviewQuestion,
  b01CheckQuestions,
} from './content/B01';
import {
  b02Lessons,
  b02ReviewQuestion,
  b02CheckQuestions,
} from './content/B02';
import {
  b03Lessons,
  b03CheckQuestions,
  b03ReviewQuestion,
} from './content/B03';
import {
  b05Lessons,
  b05CheckQuestions,
  b05ReviewQuestion,
} from './content/B05';
import {
  b06Lessons,
  b06CheckQuestions,
  b06ReviewQuestion,
} from './content/B06';
import { t, type Lesson, type Question } from './model';
import {
  p51Lessons,
  p51CheckQuestions,
  p51ReviewQuestion,
} from './content/P51';
import {
  p52Lessons,
  p52CheckQuestions,
  p52ReviewQuestion,
} from './content/P52';
import {
  p53Lessons,
  p53CheckQuestions,
  p53ReviewQuestion,
} from './content/P53';
import {
  p54Lessons,
  p54CheckQuestions,
  p54ReviewQuestion,
} from './content/P54';
import {
  p55Lessons,
  p55CheckQuestions,
  p55ReviewQuestion,
} from './content/P55';
export const curriculum = curriculumData;
export const lessons: Lesson[] = [
  ...b01Lessons,
  ...b02Lessons,
  ...b03Lessons,
  ...b04Lessons.map((l) => ({
    ...l,
    stage: 'B00',
    unit: 'B04',
    order: Number(l.id.slice(-2)),
    skillTags: [...new Set(l.questions.map((q) => q.skill))],
    nzYearHints: [4, 5, 6],
    cnGradeHints: [4, 5],
    contentStatus: 'ready' as const,
  })),
  ...b05Lessons,
  ...b06Lessons,
  ...p51Lessons,
  ...p52Lessons,
  ...p53Lessons,
  ...p54Lessons,
  ...p55Lessons,
];
export { diagnosticGroups };
export const lessonById = (id?: string) => lessons.find((l) => l.id === id);
export const openUnits = curriculum
  .flatMap((stage) =>
    stage.units.map((unit) => ({
      ...unit,
      stage: stage.id,
      openLessons: lessons.filter((l) => l.unit === unit.id),
    })),
  )
  .filter((unit) => unit.openLessons.length);
export const reviewQuestions: Record<string, Question> = {
  ...Object.fromEntries(
    p55Lessons.map((l) => [l.id, p55ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p54Lessons.map((l) => [l.id, p54ReviewQuestion(l.id, 0)]),
  ),
  ...b04ReviewQuestions,
  ...Object.fromEntries(
    b01Lessons.map((l) => [l.id, b01ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b02Lessons.map((l) => [l.id, b02ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b03Lessons.map((l) => [l.id, b03ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b05Lessons.map((l) => [l.id, b05ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b06Lessons.map((l) => [l.id, b06ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p51Lessons.map((l) => [l.id, p51ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p52Lessons.map((l) => [l.id, p52ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p53Lessons.map((l) => [l.id, p53ReviewQuestion(l.id, 0)]),
  ),
};
export function reviewQuestionFor(id: string, round: number): Question {
  if (id.startsWith('B01-')) return b01ReviewQuestion(id, round);
  if (id.startsWith('B02-')) return b02ReviewQuestion(id, round);
  if (id.startsWith('B03-')) return b03ReviewQuestion(id, round);
  if (id.startsWith('B05-')) return b05ReviewQuestion(id, round);
  if (id.startsWith('B06-')) return b06ReviewQuestion(id, round);
  if (id.startsWith('P51-')) return p51ReviewQuestion(id, round);
  if (id.startsWith('P52-')) return p52ReviewQuestion(id, round);
  if (id.startsWith('P55-')) return p55ReviewQuestion(id, round);
  if (id.startsWith('P54-')) return p54ReviewQuestion(id, round);
  if (id.startsWith('P53-')) return p53ReviewQuestion(id, round);
  return b04ReviewQuestionFor(id, round);
}
export const unitChecks = {
  P55: {
    id: 'P55-CHECK',
    unit: 'P55',
    title: t('等量关系小回顾', 'A small equality-relationship review'),
    questions: p55CheckQuestions,
    bridge: 'P55-L01',
  },
  P54: {
    id: 'P54-CHECK',
    unit: 'P54',
    title: t('分数加减小回顾', 'A small fraction-operation review'),
    questions: p54CheckQuestions,
    bridge: 'P54-L01',
  },
  P51: {
    id: 'P51-CHECK',
    unit: 'P51',
    title: t('整数策略小回顾', 'A small whole-number strategy review'),
    questions: p51CheckQuestions,
    bridge: 'P51-L01',
  },
  B01: {
    id: 'B01-CHECK',
    unit: 'B01',
    title: t('数感小回顾', 'A small number-sense review'),
    questions: b01CheckQuestions,
    bridge: 'B01-L01',
  },
  B02: {
    id: 'B02-CHECK',
    unit: 'B02',
    title: t('运算意义小回顾', 'A small operation-meaning review'),
    questions: b02CheckQuestions,
    bridge: 'B02-L01',
  },
  P52: {
    id: 'P52-CHECK',
    unit: 'P52',
    title: t('小数小回顾', 'A small decimal review'),
    questions: p52CheckQuestions,
    bridge: 'P52-L01',
  },
  B03: {
    id: 'B03-CHECK',
    unit: 'B03',
    title: t('计算策略小回顾', 'A small calculation-strategy review'),
    questions: b03CheckQuestions,
    bridge: 'B03-L01',
  },
  P53: {
    id: 'P53-CHECK',
    unit: 'P53',
    title: t('分数小回顾', 'A small fraction review'),
    questions: p53CheckQuestions,
    bridge: 'P53-L01',
  },
  B05: {
    id: 'B05-CHECK',
    unit: 'B05',
    title: t('测量与读图小回顾', 'A small measurement and chart review'),
    questions: b05CheckQuestions,
    bridge: 'B05-L01',
  },
  B06: {
    id: 'B06-CHECK',
    unit: 'B06',
    title: t('问题解决小回顾', 'A small problem-solving review'),
    questions: b06CheckQuestions,
    bridge: 'B06-L01',
  },
};
export type UnitCheckId = keyof typeof unitChecks;
