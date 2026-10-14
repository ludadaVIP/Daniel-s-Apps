import { t, type Question, type Lesson } from '../model';
import type { LocalizedText } from '@study/shared';
export function numeric(
  id: string,
  stem: LocalizedText,
  value: string,
  skill: string,
  hints: LocalizedText[],
  steps: LocalizedText[],
  checks: { accepted: string[]; rejected: string[] },
  diagram?: Question['diagram'],
): Question {
  return {
    id,
    lessonId: id.split('-').slice(0, 2).join('-'),
    type: diagram ? 'visual_select' : 'numeric',
    difficulty: 'developing',
    stem,
    answer: { kind: 'number', value },
    skill,
    hints,
    solution: t(
      steps.map((s) => s.zh).join(' '),
      steps.map((s) => s.en).join(' '),
    ),
    solutionSteps: steps,
    answerChecks: checks,
    misconceptionTags: [skill],
    diagram,
  };
}
export function choice(
  id: string,
  stem: LocalizedText,
  correct: number,
  skill: string,
  options: { text: LocalizedText; feedback: LocalizedText }[],
  hints: LocalizedText[],
  steps: LocalizedText[],
): Question {
  return {
    id,
    lessonId: id.split('-').slice(0, 2).join('-'),
    type: 'single_choice',
    difficulty: 'foundation',
    stem,
    answer: { kind: 'choice', value: String(correct) },
    skill,
    hints,
    options: options.map((o, i) => ({ ...o, id: String(i) })),
    solution: t(
      steps.map((s) => s.zh).join(' '),
      steps.map((s) => s.en).join(' '),
    ),
    solutionSteps: steps,
    answerChecks: {
      accepted: [String(correct)],
      rejected: options
        .map((_, i) => String(i))
        .filter((i) => i !== String(correct)),
    },
    misconceptionTags: [skill],
  };
}
export function reasoning(
  id: string,
  stem: LocalizedText,
  skill: string,
  rubric: LocalizedText,
  hints: LocalizedText[],
): Question {
  return {
    id,
    lessonId: id.split('-').slice(0, 2).join('-'),
    type: 'error_spotting',
    difficulty: 'transfer',
    stem,
    skill,
    answer: { kind: 'explain', rubric },
    solution: rubric,
    solutionSteps: [rubric],
    hints,
    misconceptionTags: [skill],
  };
}
export function b01Lesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    stage: 'B00',
    unit: 'B01',
    order: Number(lesson.id.slice(-2)),
    skillTags: [...new Set(lesson.questions.map((q) => q.skill))],
    nzYearHints: [4, 5, 6],
    cnGradeHints: [4, 5],
    contentStatus: 'ready',
  };
}

export function p52Lesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    stage: 'P05',
    unit: 'P52',
    order: Number(lesson.id.slice(-2)),
    skillTags: [...new Set(lesson.questions.map((q) => q.skill))],
    nzYearHints: [5, 6],
    cnGradeHints: [5],
    contentStatus: 'ready',
  };
}
export function decimalQuestion(
  id: string,
  stem: LocalizedText,
  value: string,
  skill: string,
  hints: LocalizedText[],
  steps: LocalizedText[],
  checks: { accepted: string[]; rejected: string[] },
  unit?: 'NZD' | 'm' | 'L' | 'km',
  diagram?: Question['diagram'],
): Question {
  const question = numeric(
    id,
    stem,
    value,
    skill,
    hints,
    steps,
    checks,
    diagram,
  );
  question.answer = { kind: 'number', value, formats: ['decimal'], unit };
  return question;
}

export function p53Lesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    stage: 'P05',
    unit: 'P53',
    order: Number(lesson.id.slice(-2)),
    skillTags: [...new Set(lesson.questions.map((q) => q.skill))],
    nzYearHints: [5, 6],
    cnGradeHints: [5],
    contentStatus: 'ready',
  };
}

export function b02Lesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    stage: 'B00',
    unit: 'B02',
    order: Number(lesson.id.slice(-2)),
    skillTags: [...new Set(lesson.questions.map((q) => q.skill))],
    nzYearHints: [3, 4, 5, 6],
    cnGradeHints: [2, 3, 4, 5],
    contentStatus: 'ready',
  };
}
export function b03Lesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    stage: 'B00',
    unit: 'B03',
    order: Number(lesson.id.slice(-2)),
    skillTags: [...new Set(lesson.questions.map((q) => q.skill))],
    nzYearHints: [4, 5, 6],
    cnGradeHints: [3, 4, 5],
    contentStatus: 'draft',
  };
}
