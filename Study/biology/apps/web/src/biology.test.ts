import { describe, expect, it } from 'vitest';
import { lessons, section } from './content';
import curriculum from '../../../curriculum/index.json';
import {
  decodeProgress,
  emptyProgress,
  outcome,
  reviewQueue,
  missionForUnit,
  withMission,
} from './progress';
import {
  seedModel,
  virusCopies,
  microscopeView,
  particlePosition,
} from './models';
import { units } from './units';
describe('pilot curriculum contract', () => {
  it('offers complete units within the 144-lesson roadmap', () => {
    const list = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(curriculum).toHaveLength(6);
    expect(list).toHaveLength(144);
    expect(new Set(list.map((l) => l.id)).size).toBe(144);
    expect(
      list.filter((l) => l.status === 'available').map((l) => l.id),
    ).toEqual(lessons.map((l) => l.id));
    expect(units.flatMap((u) => u.lessonIds)).toEqual(lessons.map((l) => l.id));
    expect(
      new Set(lessons.flatMap((l) => l.questions.map((q) => q.id))).size,
    ).toBe(lessons.length * 4);
    for (const l of lessons) {
      expect(l.questions).toHaveLength(4);
      expect(l.questions.filter((q) => q.skill === 'reasoning')).toHaveLength(
        1,
      );
      for (const name of [
        'Hook',
        'Predict',
        'See',
        'Explore',
        'Explain',
        'Misconception',
        'Depth',
        'Apply',
        'Vocabulary',
        'Check',
        'Mission',
      ]) {
        expect(
          section(l.id, name).zh.trim(),
          `${l.id} ${name} zh`,
        ).toBeTruthy();
        expect(
          section(l.id, name).en.trim(),
          `${l.id} ${name} en`,
        ).toBeTruthy();
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
  it('preserves first-release records and saves unit missions independently', () => {
    const old = {
      version: 1,
      sessions: {
        L001: { step: 3, note: '旧笔记 / old note', completedAt: 10 },
      },
      answers: {},
      mission: {
        object: '种子',
        evidence: '萌芽',
        reasoning: '生长',
        savedAt: 10,
      },
    };
    const restored = decodeProgress(JSON.stringify(old));
    expect(restored.sessions.L001?.note).toBe('旧笔记 / old note');
    expect(missionForUnit(restored, 'U01')).toEqual(old.mission);
    const updated = withMission(restored, 'U02', {
      object: '酵母',
      evidence: '一个细胞',
      reasoning: '可独立完成生命活动',
      savedAt: 20,
    });
    const reloaded = decodeProgress(JSON.stringify(updated));
    expect(missionForUnit(reloaded, 'U01')).toEqual(old.mission);
    expect(missionForUnit(reloaded, 'U02').savedAt).toBe(20);
    expect(missionForUnit(restored, 'U02').object).toBe('');
  });
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
  it('increases magnification while shrinking the same specimen field', () => {
    const low = microscopeView(4),
      medium = microscopeView(10),
      high = microscopeView(40);
    expect([
      low.magnification,
      medium.magnification,
      high.magnification,
    ]).toEqual([40, 100, 400]);
    expect([
      low.fieldMicrometres,
      medium.fieldMicrometres,
      high.fieldMicrometres,
    ]).toEqual([2000, 800, 200]);
    expect(low.magnification * low.fieldMm).toBe(
      high.magnification * high.fieldMm,
    );
  });
  it('allows only the preset permeable particle across the membrane', () => {
    for (let step = 0; step < 3; step++)
      expect(particlePosition(step, true)).toBe(particlePosition(step, false));
    expect(particlePosition(3, true)).toBeGreaterThan(120);
    expect(particlePosition(3, false)).toBe(120);
    expect(particlePosition(99, false)).toBe(120);
    expect(particlePosition(-1, true)).toBe(40);
  });
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
