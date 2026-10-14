import { describe, it, expect } from 'vitest';
import {
  checkAnswer,
  diagnosticSummary,
  emptyProgress,
  isProgress,
  lessonOutcome,
  newSession,
} from './model';
import {
  curriculum,
  diagnosticGroups,
  lessons,
  reviewQuestions,
} from './content';
import { reviewQueue } from './progress';
describe('exact maths answers', () => {
  it.each(['1/2', '2/4', '0.5', '0.50', '50%', '-2/-4'])(
    'accepts an equivalent value: %s',
    (value) =>
      expect(checkAnswer(value, { kind: 'number', value: '1/2' })).toBe(true),
  );
  it.each([
    '1/0',
    '0/0',
    'NaN',
    'Infinity',
    '0.50000000000000000001',
    '40 cm',
    'hello',
    '1/2/3',
    '',
  ])('rejects invalid and unequal values: %s', (value) =>
    expect(checkAnswer(value, { kind: 'number', value: '1/2' })).toBe(false),
  );
  it('checks units and requested representations', () => {
    expect(
      checkAnswer('40 cm²', { kind: 'number', value: '40', unit: 'cm²' }),
    ).toBe(true);
    expect(
      checkAnswer('40 cm', { kind: 'number', value: '40', unit: 'cm²' }),
    ).toBe(false);
    expect(
      checkAnswer('NZ$2.50', { kind: 'number', value: '2.5', unit: 'NZD' }),
    ).toBe(true);
    expect(
      checkAnswer('2.50 metres', { kind: 'number', value: '2.5', unit: 'NZD' }),
    ).toBe(false);
    expect(
      checkAnswer('1/2', {
        kind: 'number',
        value: '0.5',
        formats: ['decimal'],
      }),
    ).toBe(false);
    expect(
      checkAnswer('.50', {
        kind: 'number',
        value: '0.5',
        formats: ['decimal'],
      }),
    ).toBe(true);
  });
  it('never automatically grades reasoning', () =>
    expect(
      checkAnswer('correct words', {
        kind: 'explain',
        rubric: { zh: '说明理由', en: 'Explain why' },
      }),
    ).toBeNull());
});
describe('curriculum and question integrity', () => {
  it('retains every planned ID with exactly the reviewed lessons open', () => {
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(curriculum).toHaveLength(9);
    expect(all).toHaveLength(358);
    expect(new Set(all.map((l) => l.id)).size).toBe(358);
    expect(all.filter((l) => l.available).map((l) => l.id)).toEqual(
      lessons.map((l) => l.id),
    );
  });
  it('has four groups of six unique diagnostic questions and verified anchors', () => {
    expect(diagnosticGroups).toHaveLength(4);
    diagnosticGroups.forEach((g) => expect(g.questions).toHaveLength(6));
    expect(
      diagnosticGroups[0]!.questions.map((q) =>
        q.answer.kind === 'number' ? q.answer.value : '',
      ),
    ).toEqual(['229', '144', '78', '400', '30', '31']);
  });
  it('validates bilingual content, answers, dependency links and practice mix', () => {
    const questions = [
      ...diagnosticGroups.flatMap((g) => g.questions),
      ...lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
      ...Object.values(reviewQuestions),
    ];
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const q of questions) {
      expect(q.stem.zh).toBeTruthy();
      expect(q.stem.en).toBeTruthy();
      expect(q.solution.en).toBeTruthy();
      expect(q.hints.length).toBeGreaterThan(0);
      if (q.answer.kind !== 'explain')
        expect(checkAnswer(q.answer.value, q.answer)).toBe(true);
      if (q.answer.kind === 'choice')
        expect(
          q.options?.some(
            (o) => o.id === (q.answer as { value: string }).value,
          ),
        ).toBe(true);
    }
    for (const l of lessons) {
      expect(l.questions.length).toBeGreaterThanOrEqual(5);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice').length,
      ).toBeLessThanOrEqual(l.questions.length / 2);
      expect(l.parent.prompts).toHaveLength(2);
      l.prerequisites.forEach((id) =>
        expect(lessons.some((p) => p.id === id)).toBe(true),
      );
    }
  });
});
describe('honest progress and local records', () => {
  const l = lessons[0]!;
  it('requires independent practice, independent exit, and reviewed reasoning', () => {
    const s = newSession();
    for (const q of [...l.questions, l.exit])
      s.answers[q.id] = {
        input: 'answer',
        tries: 1,
        hints: 0,
        correct: true,
        independent: true,
        checked: true,
      };
    expect(lessonOutcome(l, s)).toBe('practice_needed');
    s.explanation = 'Equal pieces of one whole';
    s.parentChecked = true;
    expect(lessonOutcome(l, s)).toBe('ready_to_progress');
    s.answers[l.exit.id]!.independent = false;
    expect(lessonOutcome(l, s)).toBe('practice_needed');
  });
  it('does not turn skipped diagnostics into a grade', () => {
    const p = emptyProgress();
    p.diagnostic['D01-1'] = { input: '', result: 'skipped' };
    expect(diagnosticSummary(diagnosticGroups[0]!.questions, p)).toEqual({
      answered: 1,
      independent: 0,
      skipped: 1,
    });
  });
  it('schedules support and due reviews, then respects the next review date', () => {
    const p = emptyProgress(),
      s = newSession();
    p.sessions[l.id] = s;
    s.answers[l.questions[0]!.id] = {
      input: '0',
      tries: 1,
      hints: 1,
      correct: true,
      independent: false,
      checked: true,
    };
    expect(reviewQueue(p).map((l) => l.id)).toEqual([l.id]);
    p.reviews[l.id] = {
      input: '2/5',
      tries: 1,
      completedAt: new Date().toISOString(),
    };
    s.nextReview = new Date(Date.now() + 86400000).toISOString();
    expect(reviewQueue(p)).toEqual([]);
    s.nextReview = new Date(Date.now() - 1000).toISOString();
    expect(reviewQueue(p)).toHaveLength(1);
  });
  it('rejects corrupt records and accepts a full session', () => {
    const p = emptyProgress();
    p.sessions[l.id] = newSession();
    expect(isProgress(p)).toBe(true);
    expect(isProgress({ ...p, sessions: { [l.id]: { step: 0 } } })).toBe(false);
    expect(isProgress({ version: 9 })).toBe(false);
  });
});
