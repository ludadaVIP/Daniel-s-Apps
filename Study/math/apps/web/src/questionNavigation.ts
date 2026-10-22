import type { Lesson } from './model';

export function lessonQuestionPosition(lesson: Lesson, id: string | null) {
  if (!id) return undefined;
  if (id === lesson.guided.id) return { step: 3 as const };
  if (id === lesson.exit.id) return { step: 5 as const };
  const practiceIndex = lesson.questions.findIndex(
    (question) => question.id === id,
  );
  return practiceIndex < 0 ? undefined : { step: 4 as const, practiceIndex };
}
