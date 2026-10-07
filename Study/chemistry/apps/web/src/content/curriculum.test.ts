import { describe, expect, it } from 'vitest';
import { lessons } from './lessons';
import { pathLevels } from './path';

describe('chemistry curriculum integrity', () => {
  it('keeps stable unique identifiers and consecutive lesson numbers', () => {
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(
      lessons.length,
    );
    expect(lessons.map((lesson) => lesson.order)).toEqual(
      lessons.map((_, i) => i + 1),
    );
    const questions = lessons.flatMap((lesson) => lesson.questions);
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
      for (const question of lesson.questions) {
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
});
