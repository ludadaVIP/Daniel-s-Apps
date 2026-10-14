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
import { t, type Lesson, type Question } from './model';
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
export const curriculum = curriculumData;
export const lessons: Lesson[] = [
  ...b01Lessons,
  ...b02Lessons,
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
  ...p52Lessons,
  ...p53Lessons,
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
  ...b04ReviewQuestions,
  ...Object.fromEntries(
    b01Lessons.map((l) => [l.id, b01ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b02Lessons.map((l) => [l.id, b02ReviewQuestion(l.id, 0)]),
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
  if (id.startsWith('P52-')) return p52ReviewQuestion(id, round);
  if (id.startsWith('P53-')) return p53ReviewQuestion(id, round);
  return b04ReviewQuestionFor(id, round);
}
export const unitChecks = {
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
  P53: {
    id: 'P53-CHECK',
    unit: 'P53',
    title: t('分数小回顾', 'A small fraction review'),
    questions: p53CheckQuestions,
    bridge: 'P53-L01',
  },
};
export type UnitCheckId = keyof typeof unitChecks;
