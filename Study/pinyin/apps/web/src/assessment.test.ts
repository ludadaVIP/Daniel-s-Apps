import { describe, expect, it } from 'vitest';
import { assessments, assessmentExercises, exercises } from './content';
import {
  assessmentOutcome,
  gradeAnswer,
  readCounts,
  textAccuracy,
  type Result,
} from './engine';
import { emptyProgress, recordAttempt, validProgress } from './progress';
const final = assessments.find((a) => a.id === 'A06')!;
const qs = final.questionIds.map((id) =>
  assessmentExercises.find((q) => q.id === id)!,
);
function perfect() {
  return Object.fromEntries(
    qs.map((q) => {
      const total = q.wordIds?.length ?? q.readingTotal;
      return [
        q.id,
        {
          correct: true,
          response: total
            ? JSON.stringify({ correctCount: total, totalCount: total })
            : q.acceptedAnswers[0]!,
          source: total ? 'parent' : 'automatic',
        },
      ];
    }),
  ) as Record<string, Result>;
}
describe('independent graduation dimensions', () => {
  it('counts actual syllables rather than batches and accepts 26/30 despite one weak batch', () => {
    const answers = perfect();
    answers[qs[0]!.id] = {
      correct: false,
      response: JSON.stringify({ correctCount: 1, totalCount: 5 }),
      source: 'parent',
    };
    const outcome = assessmentOutcome(final, qs, answers);
    expect(outcome.groups[0]!.correct).toBe(26);
    expect(outcome.passed).toBe(true);
    answers[qs[1]!.id] = {
      correct: false,
      response: JSON.stringify({ correctCount: 4, totalCount: 5 }),
      source: 'parent',
    };
    expect(assessmentOutcome(final, qs, answers).passed).toBe(false);
  });
  it('requires every answer and cannot average away a failed input operation or missing punctuation', () => {
    const answers = perfect();
    expect(assessmentOutcome(final, qs, answers).passed).toBe(true);
    delete answers[qs[0]!.id];
    expect(assessmentOutcome(final, qs, answers).passed).toBe(false);
    const badOperation = perfect();
    badOperation[qs[11]!.id]!.correct = false;
    expect(assessmentOutcome(final, qs, badOperation).passed).toBe(false);
    const noPunctuation = perfect();
    noPunctuation[qs[15]!.id]!.response = qs[15]!.acceptedAnswers[0]!.replace(
      /。/g,
      '',
    );
    const result = assessmentOutcome(final, qs, noPunctuation);
    expect(result.groups[4]!.accuracy).toBe(1);
    expect(result.groups[4]!.passed).toBe(false);
  });
  it('requires 11/12 words and 43/50 passage syllables', () => {
    const answers = perfect();
    const word = qs[6]!;
    answers[word.id]!.response = JSON.stringify({
      correctCount: 2,
      totalCount: 3,
    });
    const passage = qs[10]!;
    answers[passage.id]!.response = JSON.stringify({
      correctCount: 43,
      totalCount: 50,
    });
    expect(assessmentOutcome(final, qs, answers).passed).toBe(true);
    answers[passage.id]!.response = JSON.stringify({
      correctCount: 42,
      totalCount: 50,
    });
    expect(assessmentOutcome(final, qs, answers).passed).toBe(false);
  });
  it('rejects malformed, fractional or fabricated reading totals', () => {
    const q = qs[0]!;
    for (const response of [
      '读对',
      '{}',
      '{bad',
      '{"correctCount":6,"totalCount":5}',
      '{"correctCount":4.5,"totalCount":5}',
      '{"correctCount":4,"totalCount":4}',
    ])
      expect(readCounts(q, response)).toBeUndefined();
  });
  it('uses edit distance to penalize substituted, omitted and added hanzi without double rounding', () => {
    const q = { ...qs[15]!, acceptedAnswers: ['一二三四五六七八九十。'] };
    expect(
      textAccuracy(q.acceptedAnswers[0]!, '一二三四五六七八九。').accuracy,
    ).toBe(0.9);
    expect(gradeAnswer(q, '一二三四五六七八九。').correct).toBe(true);
    expect(gradeAnswer(q, '一二三四五六七八。').correct).toBe(false);
    expect(gradeAnswer(q, '一二三四五六七八九百。').correct).toBe(true);
    expect(gradeAnswer(q, '一二三四五六七八九十百千。').correct).toBe(false);
    const assessment = {
      ...final,
      questionIds: [q.id],
      groups: [
        { id: 'input', label: 'input', questionIds: [q.id], minAccuracy: 0.9 },
      ],
    };
    const answer: Result = {
      correct: true,
      response: '一二三四五六七八九。',
      source: 'automatic',
    };
    expect(assessmentOutcome(assessment, [q], { [q.id]: answer }).passed).toBe(
      true,
    );
  });
  it('preserves prior lesson records while storing grouped checkpoint evidence in the same progress version', () => {
    const old = recordAttempt(emptyProgress(), 'L01', {
      questionId: 'L01-Q01',
      correct: true,
      response: 'nǐ',
      source: 'automatic',
      at: '2026-10-11T03:00:00Z',
      durationMs: 1,
      context: 'lesson',
    });
    const updated = recordAttempt(old, 'A06', {
      questionId: qs[0]!.id,
      correct: true,
      response: perfect()[qs[0]!.id]!.response,
      source: 'parent',
      at: '2026-10-11T03:00:00Z',
      durationMs: 1,
      context: 'lesson',
    });
    expect(updated.sessions.L01).toEqual(old.sessions.L01);
    expect(validProgress(JSON.parse(JSON.stringify(updated)))).toBe(true);
  });
  it('does not pretend to automatically judge original writing content', () => {
    const q = exercises.find((q) => q.freeWriting)!;
    expect(gradeAnswer(q, '好'.repeat(60)).message).toContain('还需要');
    expect(gradeAnswer(q, '好'.repeat(59)).correct).toBe(false);
    expect(gradeAnswer(q, '好'.repeat(101)).correct).toBe(false);
    expect(gradeAnswer(q, 'abc' + '好'.repeat(60)).correct).toBe(false);
  });
});
