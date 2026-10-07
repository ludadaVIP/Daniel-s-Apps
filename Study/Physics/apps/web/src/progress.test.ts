import { describe, expect, it } from 'vitest';
import { lessons } from './content/lessons';
import {
  decodeProgress,
  dueLessons,
  freshLesson,
  isMastered,
  type LessonProgress,
} from './progress';
import { rollingMotion, raceTime } from './interactive/physics';
describe('learning progress', () => {
  it('recovers safely from corrupt or stale stored data', () => {
    expect(decodeProgress('{broken')).toEqual({ lessons: {}, notes: [] });
    expect(decodeProgress('null')).toEqual({ lessons: {}, notes: [] });
    const data = decodeProgress(
      JSON.stringify({
        lessons: {
          'physics-everywhere': {
            step: 99,
            prediction: 10,
            answers: { 0: 100 },
            completedAt: 123,
            mistakes: ['999', '0'],
          },
        },
        notes: [null, { id: 'bad' }],
      }),
    );
    expect(data.lessons['physics-everywhere']).toEqual({
      ...freshLesson(),
      step: 4,
      unlockedStep: 4,
      mistakes: ['0'],
    });
    expect(data.notes).toEqual([]);
  });
  it('requires exploration, prediction, and all correct answers before mastery', () => {
    const l = lessons[0]!;
    const p = freshLesson();
    p.answers = Object.fromEntries(
      [...l.questions, l.exit].map((q, i) => [i, q.correct]),
    );
    expect(isMastered(l.id, p)).toBe(false);
    p.prediction = 1;
    p.explored = true;
    expect(isMastered(l.id, p)).toBe(true);
    p.answers[2] = 0;
    expect(isMastered(l.id, p)).toBe(false);
  });
  it('keeps wrong answers for review and schedules completed lessons after a day', () => {
    const now = 200000000;
    const p: LessonProgress = { ...freshLesson(), completedAt: now };
    const data = { lessons: { 'physics-everywhere': p }, notes: [] };
    expect(dueLessons(data, now + 86399999)).toHaveLength(0);
    expect(dueLessons(data, now + 86400000)).toHaveLength(1);
    p.reviewedAt = now + 86400000;
    expect(dueLessons(data, now + 86400001)).toHaveLength(0);
    p.mistakes = ['1'];
    expect(dueLessons(data, now)).toHaveLength(1);
  });
});
describe('physical models', () => {
  it('stops a rolling ball without reverse motion and gives longer travel with less resistance', () => {
    expect(rollingMotion(3, 0.5, 0).distance).toBe(0);
    expect(rollingMotion(3, 0.5, 100)).toEqual({
      distance: 9,
      speed: 0,
      stopTime: 6,
      stopDistance: 9,
    });
    expect(rollingMotion(3, 1.5, 100).stopDistance).toBe(3);
    expect(() => rollingMotion(3, 0, 1)).toThrow(RangeError);
  });
  it('compares speed using equal distances and valid units', () => {
    expect(raceTime(12, 2)).toBe(6);
    expect(raceTime(12, 4)).toBe(3);
    expect(() => raceTime(12, 0)).toThrow(RangeError);
  });
});
describe('curriculum content', () => {
  it('has unique IDs, complete bilingual copy, and valid assessment answers', () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of lessons) {
      for (const value of [
        l.title,
        l.subtitle,
        l.hook,
        l.prediction,
        l.explore,
        l.concept,
        l.example,
        l.misconception,
        l.realWorld,
        l.summary,
        l.homeExperiment,
        ...l.predictions,
        ...(l.formula ? [l.formula] : []),
        ...l.vocabulary,
      ]) {
        expect(value.zh.trim()).not.toBe('');
        expect(value.en.trim()).not.toBe('');
      }
      for (const q of [...l.questions, l.exit]) {
        for (const value of [q.prompt, q.explanation, ...q.options]) {
          expect(value.zh.trim()).not.toBe('');
          expect(value.en.trim()).not.toBe('');
        }
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
});
