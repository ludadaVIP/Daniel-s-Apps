import { describe, expect, it } from 'vitest';
import { lessons, section } from './content';
import curriculum from '../../../curriculum/index.json';
import {
  decodeProgress,
  emptyProgress,
  outcome,
  reviewQueue,
} from './progress';
import { seedModel, virusCopies } from './models';
describe('pilot curriculum contract', () => {
  it('offers only the four complete lessons out of the 144-lesson roadmap', () => {
    const list = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(curriculum).toHaveLength(6);
    expect(list).toHaveLength(144);
    expect(new Set(list.map((l) => l.id)).size).toBe(144);
    expect(
      list.filter((l) => l.status === 'available').map((l) => l.id),
    ).toEqual(lessons.map((l) => l.id));
    for (const l of lessons) {
      expect(l.questions).toHaveLength(4);
      expect(l.questions.filter((q) => q.skill === 'reasoning')).toHaveLength(
        1,
      );
      for (const name of ['Explain', 'Misconception', 'Depth']) {
        expect(section(l.id, name).zh.length).toBeGreaterThan(30);
        expect(section(l.id, name).en.length).toBeGreaterThan(30);
      }
      for (const q of l.questions) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.feedback.zh).toBeTruthy();
        expect(q.feedback.en).toBeTruthy();
      }
    }
  });
});
describe('understanding and recall', () => {
  it('puts mistakes before overdue correct answers', () => {
    const l = lessons[0]!,
      p = emptyProgress();
    p.sessions[l.id] = { step: 3, note: '', completedAt: 1000 };
    const a = l.questions[0]!,
      b = l.questions[1]!;
    p.answers[a.id] = { choice: a.correct, first: a.correct, at: 1000 };
    p.answers[b.id] = {
      choice: (b.correct + 1) % b.options.length,
      first: 1,
      at: 2000,
    };
    expect(reviewQueue(p, 1000 + 86400000).map((q) => q.id)).toEqual([
      b.id,
      a.id,
    ]);
  });
  it('does not block biology mastery for an incorrect English term', () => {
    const l = lessons[0]!,
      p = emptyProgress();
    for (const q of l.questions)
      p.answers[q.id] = {
        choice:
          q.skill === 'vocabulary'
            ? (q.correct + 1) % q.options.length
            : q.correct,
        first: 0,
        at: 1,
      };
    expect(outcome(l, p).mastered).toBe(true);
    expect(outcome(l, p).vocabulary.correct).toBe(0);
    expect(reviewQueue(p, 1)).toHaveLength(1);
  });
  it('revisits mistakes immediately and correct answers after 1, 7 and 30 days', () => {
    const l = lessons[0]!,
      q = l.questions[0]!,
      p = emptyProgress(),
      start = 1000,
      day = 86400000;
    p.sessions[l.id] = { step: 3, note: '', completedAt: start };
    p.answers[q.id] = { choice: q.correct, first: q.correct, at: start };
    expect(reviewQueue(p, start + day - 1)).toHaveLength(0);
    expect(reviewQueue(p, start + day)).toHaveLength(1);
    p.answers[q.id]!.at = start + day;
    expect(reviewQueue(p, start + day)).toHaveLength(0);
    expect(reviewQueue(p, start + 7 * day)).toHaveLength(1);
    p.answers[q.id]!.at = start + 7 * day;
    expect(reviewQueue(p, start + 30 * day)).toHaveLength(1);
    p.answers[q.id]!.at = start + 30 * day;
    expect(reviewQueue(p, start + 31 * day)).toHaveLength(0);
  });
  it('restores bilingual notes and rejects malformed answers and unknown schemas', () => {
    const p = emptyProgress();
    p.sessions.L001 = {
      step: 1,
      prediction: 2,
      note: '我观察到 / I observed',
      explored: true,
    };
    expect(decodeProgress(JSON.stringify(p))).toEqual(p);
    expect(() => decodeProgress('{')).toThrow();
    expect(() =>
      decodeProgress(JSON.stringify({ ...p, version: 2 })),
    ).toThrow();
    expect(() =>
      decodeProgress(
        JSON.stringify({
          ...p,
          answers: { 'L001-q1': { choice: 99, first: 0, at: 1 } },
        }),
      ),
    ).toThrow();
  });
});
describe('simplified biological models', () => {
  it('requires water, oxygen and a suitable temperature; excess water is not always better', () => {
    expect(seedModel('moist', 20, true).grows).toBe(true);
    expect(seedModel('dry', 20, true).reason).toBe('dry');
    expect(seedModel('submerged', 20, true).reason).toBe('oxygen');
    expect(seedModel('moist', 20, false).grows).toBe(false);
    expect(seedModel('moist', 5, true).grows).toBe(false);
    expect(seedModel('moist', 40, true).grows).toBe(false);
  });
  it('never depicts independent viral replication without a suitable host', () => {
    for (let step = 0; step < 4; step++)
      expect(virusCopies(false, step)).toBe(1);
    expect(virusCopies(true, 2)).toBe(1);
    expect(virusCopies(true, 3)).toBe(4);
  });
});
