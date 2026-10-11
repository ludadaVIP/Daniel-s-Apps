import { describe, expect, it } from 'vitest';
import { allExercises, exercises, labExercises } from './content';
import {
  gradeAnswer,
  lessonOutcome,
  scheduleCard,
  type Attempt,
} from './engine';
import {
  emptyProgress,
  newSession,
  readProgress,
  recordAttempt,
  validProgress,
} from './progress';

const attempt = (correct: boolean, at = '2026-10-11T03:00:00Z'): Attempt => ({
  questionId: 'L03-Q08',
  correct,
  response: 'ma3',
  at,
  durationMs: 2500,
  source: 'automatic',
  context: 'lesson',
});
describe('grading measures the intended skill', () => {
  it('accepts spaces and case in ASCII full pinyin but keeps sh and ü distinctions', () => {
    const q = labExercises[0]!;
    expect(gradeAnswer(q, ' NI HAO ').correct).toBe(true);
    expect(gradeAnswer(q, 'nǐ hǎo').correct).toBe(false);
    const nv = labExercises.find((q) => q.wordId === 'nv')!;
    expect(gradeAnswer(nv, 'nv').correct).toBe(true);
    expect(gradeAnswer(nv, 'nu').correct).toBe(false);
    const shu = { ...q, acceptedAnswers: ['shu'] };
    expect(gradeAnswer(shu, 'su').correct).toBe(false);
  });
  it('grades committed hanzi, equivalent punctuation width, not homophones or missing text', () => {
    const q = labExercises.find((q) => q.wordId === 'science')!;
    expect(gradeAnswer(q, ' 我喜欢科学. ').correct).toBe(true);
    expect(gradeAnswer(q, '我喜欢科学').correct).toBe(false);
    expect(gradeAnswer(q, '我喜换科学。').correct).toBe(false);
    expect(gradeAnswer(q, 'woxihuankexue').correct).toBe(false);
    expect(gradeAnswer(q, '我喜欢科学。', true).correct).toBe(false);
  });
  it('accepts only the reviewed initial/final/tone tuple', () => {
    const q = exercises.find((q) => q.type === 'assemble_syllable')!;
    expect(gradeAnswer(q, 'b|a|1').correct).toBe(true);
    expect(gradeAnswer(q, 'p|a|1').correct).toBe(false);
    expect(gradeAnswer(q, 'b|i|1').correct).toBe(false);
  });
});
describe('review and mastery are earned', () => {
  it('rolls 1/3/7 days from successful recall and never advances on same-day retries', () => {
    const first = scheduleCard(undefined, attempt(true));
    expect(first.due).toBe('2026-10-12T03:00:00.000Z');
    const sameDay = scheduleCard(first, attempt(true, '2026-10-11T04:00:00Z'));
    expect(sameDay.stage).toBe(0);
    const second = scheduleCard(sameDay, attempt(true, '2026-10-12T04:00:00Z'));
    expect(second.due).toBe('2026-10-15T04:00:00.000Z');
    const third = scheduleCard(second, attempt(true, '2026-10-15T04:00:00Z'));
    expect(third.due).toBe('2026-10-22T04:00:00.000Z');
    const wrong = scheduleCard(third, attempt(false, '2026-10-22T04:00:00Z'));
    expect(wrong.stage).toBe(0);
    expect(wrong.wrongStreak).toBe(1);
    expect(wrong.due).toBe('2026-10-22T04:00:00Z');
    const corrected = scheduleCard(
      wrong,
      attempt(true, '2026-10-22T05:00:00Z'),
    );
    expect(corrected.stage).toBe(0);
    expect(corrected.due).toBe('2026-10-23T05:00:00.000Z');
  });
  it('requires all independent questions; guided success cannot grant mastery', () => {
    const qs = exercises.filter((q) => q.lessonId === 'L03');
    const guided = Object.fromEntries(
      qs
        .filter((q) => q.phase !== 'challenge')
        .map((q) => [
          q.id,
          { correct: true, response: '', source: 'automatic' as const },
        ]),
    );
    expect(lessonOutcome(qs, guided).mastered).toBe(false);
    const all = Object.fromEntries(
      qs.map((q) => [
        q.id,
        { correct: true, response: '', source: 'automatic' as const },
      ]),
    );
    const challenge = qs.filter((q) => q.phase === 'challenge');
    all[challenge[0]!.id]!.correct = false;
    expect(lessonOutcome(qs, all).mastered).toBe(true);
    all[challenge[1]!.id]!.correct = false;
    expect(lessonOutcome(qs, all).mastered).toBe(false);
  });
  it('does not let later correction overwrite a submitted independent answer', () => {
    const first = recordAttempt(emptyProgress(), 'L03', attempt(false));
    const retry = recordAttempt(first, 'L03', attempt(true));
    expect(retry.attempts).toHaveLength(1);
    expect(retry.sessions.L03!.answers['L03-Q08']!.correct).toBe(false);
    expect(validProgress(JSON.parse(JSON.stringify(retry)))).toBe(true);
  });
});
describe('storage recovery preserves malformed data', () => {
  it('rejects corrupted JSON and malformed nested records', () => {
    expect(readProgress({ getItem: () => '{bad' }).error).not.toBe('');
    expect(
      validProgress({
        ...emptyProgress(),
        sessions: {
          L01: { ...newSession(), answers: { bad: { correct: 'yes' } } },
        },
      }),
    ).toBe(false);
    expect(
      validProgress({
        ...emptyProgress(),
        cards: {
          bad: { questionId: 'bad', due: 'tomorrow', stage: 0, wrongStreak: 0 },
        },
      }),
    ).toBe(false);
    expect(readProgress({ getItem: () => null }).error).toBe('');
  });
  it('does not confuse preview practice with a curriculum session', () => {
    const q = allExercises.find((q) => q.lessonId === 'LAB')!;
    const p = recordAttempt(emptyProgress(), 'lab', {
      ...attempt(true),
      questionId: q.id,
      context: 'lab',
    });
    expect(p.sessions.L01).toBeUndefined();
    expect(p.sessions.lab!.answers[q.id]!.correct).toBe(true);
  });
});
