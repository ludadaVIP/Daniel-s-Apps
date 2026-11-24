import { describe, expect, it } from 'vitest';
import { lessons } from './lessons';
import { guidedSequences, pathGroups, pathLevels } from './path';

describe('chemistry curriculum integrity', () => {
  it('keeps stable unique identifiers and consecutive lesson numbers', () => {
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(
      lessons.length,
    );
    expect(lessons.map((lesson) => lesson.order)).toEqual(
      lessons.map((_, i) => i + 1),
    );
    const questions = lessons.flatMap((lesson) => [
      ...lesson.questions,
      ...(lesson.learning?.quickChecks ?? []),
    ]);
    expect(new Set(questions.map((question) => question.id)).size).toBe(
      questions.length,
    );
  });
  it('keeps learning-path counts equal to actual module contents', () => {
    for (const level of pathLevels) {
      expect(
        lessons.filter((lesson) => lesson.levelId === level.id).length,
        level.id,
      ).toBe(level.lessonCount);
    }
    for (const lesson of lessons)
      expect(
        pathLevels.some((level) => level.id === lesson.levelId),
        lesson.id,
      ).toBe(true);
  });
  it('provides valid answers, bilingual feedback and optional HTTPS resources', () => {
    for (const lesson of lessons) {
      expect(lesson.questions.length, lesson.id).toBeGreaterThan(0);
      for (const question of [
        ...lesson.questions,
        ...(lesson.learning?.quickChecks ?? []),
      ]) {
        expect(Number.isInteger(question.answer), question.id).toBe(true);
        expect(question.answer, question.id).toBeGreaterThanOrEqual(0);
        expect(question.answer, question.id).toBeLessThan(
          question.options.length,
        );
        for (const copy of [
          question.prompt,
          question.explanation,
          ...question.options,
        ]) {
          expect(copy.zh.trim().length, question.id).toBeGreaterThan(0);
          expect(copy.en.trim().length, question.id).toBeGreaterThan(0);
        }
      }
      for (const resource of lesson.resources ?? [])
        expect(new URL(resource.url).protocol).toBe('https:');
    }
  });
  it('keeps prerequisite links valid and free of dependency cycles', () => {
    const visit = (id: string, ancestors = new Set<string>()) => {
      expect(ancestors.has(id), `cycle at ${id}`).toBe(false);
      const lesson = lessons.find((item) => item.id === id);
      expect(lesson, `missing prerequisite ${id}`).toBeDefined();
      const next = new Set([...ancestors, id]);
      for (const prerequisite of lesson?.learning?.prerequisites ?? [])
        visit(prerequisite, next);
    };
    for (const lesson of lessons) visit(lesson.id);
  });
  it('groups every curriculum module once using stable IDs rather than array positions', () => {
    const grouped = pathGroups.flatMap((group) => group.levelIds);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual(
      pathLevels.map((level) => level.id).sort(),
    );
  });
  it('keeps recommended follow-up links valid', () => {
    for (const lesson of lessons) {
      const nextId = lesson.nextLessonId;
      if (nextId) {
        expect(nextId).not.toBe(lesson.id);
        expect(
          lessons.some((item) => item.id === nextId),
          nextId,
        ).toBe(true);
      }
    }
  });
  it('keeps home guided sequences linked to available lessons in prerequisite order', () => {
    for (const sequence of guidedSequences) {
      expect(new Set(sequence.lessonIds).size).toBe(sequence.lessonIds.length);
      sequence.lessonIds.forEach((id, index) => {
        const lesson = lessons.find((item) => item.id === id);
        expect(lesson, id).toBeDefined();
        for (const prerequisite of lesson?.learning?.prerequisites ?? []) {
          const prerequisiteIndex = sequence.lessonIds.indexOf(prerequisite);
          if (prerequisiteIndex !== -1)
            expect(prerequisiteIndex).toBeLessThan(index);
        }
      });
    }
  });
  it('gives the new guided lessons the planned objectives, worked examples and separate checks', () => {
    for (const lesson of lessons.filter((item) => item.learning)) {
      const learning = lesson.learning!;
      expect(learning.objectives.length).toBeGreaterThanOrEqual(2);
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
      expect(learning.quickChecks.length).toBeGreaterThanOrEqual(2);
      expect(learning.quickChecks.length).toBeLessThanOrEqual(3);
      expect(lesson.questions.length).toBeGreaterThanOrEqual(5);
      expect(lesson.questions.length).toBeLessThanOrEqual(8);
      expect(
        lesson.questions.some((question) => question.kind === 'application'),
      ).toBe(true);
      for (const text of [
        ...learning.objectives,
        learning.workedExample.prompt,
        ...learning.workedExample.steps,
        learning.workedExample.answer,
        learning.anotherWay,
        learning.explainPrompt,
      ]) {
        expect(text.zh.trim().length, lesson.id).toBeGreaterThan(0);
        expect(text.en.trim().length, lesson.id).toBeGreaterThan(0);
      }
      for (const question of [...lesson.questions, ...learning.quickChecks]) {
        expect(question.conceptIds?.length, question.id).toBeGreaterThan(0);
        expect(question.kind, question.id).toBeDefined();
      }
    }
  });
});
