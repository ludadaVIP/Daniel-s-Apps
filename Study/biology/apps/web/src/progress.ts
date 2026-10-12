import { useState } from 'react';
import { lessons, questions, type Lesson } from './content';
export const STORAGE_KEY = 'study-biology-v1';
export type Answer = { choice: number; first: number; at: number };
export type Session = {
  step: number;
  prediction?: number;
  explored?: boolean;
  note: string;
  completedAt?: number;
};
export type Progress = {
  version: 1;
  sessions: Record<string, Session>;
  answers: Record<string, Answer>;
  mission: {
    object: string;
    evidence: string;
    reasoning: string;
    savedAt?: number;
  };
};
export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: {},
  answers: {},
  mission: { object: '', evidence: '', reasoning: '' },
});
export const newSession = (): Session => ({ step: 0, note: '' });
export function decodeProgress(raw: string): Progress {
  const data = JSON.parse(raw);
  if (data?.version !== 1 || !data.sessions || !data.answers || !data.mission)
    throw new Error('Invalid progress');
  const clean = emptyProgress();
  for (const l of lessons) {
    const s = data.sessions[l.id];
    if (!s) continue;
    if (
      !Number.isInteger(s.step) ||
      s.step < 0 ||
      s.step > 3 ||
      typeof s.note !== 'string'
    )
      throw new Error('Invalid session');
    clean.sessions[l.id] = {
      step: s.step,
      note: s.note.slice(0, 2000),
      ...(Number.isInteger(s.prediction) &&
      s.prediction >= 0 &&
      s.prediction < l.prediction.length
        ? { prediction: s.prediction }
        : {}),
      ...(s.explored === true ? { explored: true } : {}),
      ...(Number.isFinite(s.completedAt) && s.completedAt > 0
        ? { completedAt: s.completedAt }
        : {}),
    };
  }
  for (const q of questions) {
    const a = data.answers[q.id];
    if (!a) continue;
    if (
      ![a.choice, a.first].every(
        (x) => Number.isInteger(x) && x >= 0 && x < q.options.length,
      ) ||
      !Number.isFinite(a.at)
    )
      throw new Error('Invalid answer');
    clean.answers[q.id] = { choice: a.choice, first: a.first, at: a.at };
  }
  for (const key of ['object', 'evidence', 'reasoning'] as const) {
    if (typeof data.mission[key] !== 'string')
      throw new Error('Invalid mission');
    clean.mission[key] = data.mission[key].slice(0, 2000);
  }
  if (Number.isFinite(data.mission.savedAt) && data.mission.savedAt > 0)
    clean.mission.savedAt = data.mission.savedAt;
  return clean;
}
export function outcome(lesson: Lesson, progress: Progress) {
  const result = (skill: string) => {
    const qs = lesson.questions.filter((q) => q.skill === skill);
    return {
      correct: qs.filter((q) => progress.answers[q.id]?.choice === q.correct)
        .length,
      total: qs.length,
    };
  };
  const concept = result('concept'),
    reasoning = result('reasoning'),
    vocabulary = result('vocabulary');
  return {
    concept,
    reasoning,
    vocabulary,
    answered: lesson.questions.every((q) => !!progress.answers[q.id]),
    mastered:
      concept.correct / concept.total >= 0.8 &&
      reasoning.correct === reasoning.total,
  };
}
export function reviewQueue(progress: Progress, now = Date.now()) {
  return questions
    .filter((q) => {
      const a = progress.answers[q.id];
      if (!a) return false;
      if (a.choice !== q.correct) return true;
      const completed = progress.sessions[q.id.split('-')[0]!]?.completedAt;
      if (!completed) return false;
      return [1, 7, 30].some(
        (days) =>
          now >= completed + days * 86400000 &&
          a.at < completed + days * 86400000,
      );
    })
    .sort((a, b) => {
      const aa = progress.answers[a.id]!,
        bb = progress.answers[b.id]!;
      return (
        Number(bb.choice !== b.correct) - Number(aa.choice !== a.correct) ||
        aa.at - bb.at
      );
    });
}
export function useProgress() {
  const [initial] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return { data: raw ? decodeProgress(raw) : emptyProgress(), error: '' };
    } catch {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) localStorage.setItem(`${STORAGE_KEY}-backup`, raw);
      } catch {
        /* Storage may be unavailable. */
      }
      return {
        data: emptyProgress(),
        error:
          '恢复记录时遇到问题，旧记录尽可能保留为备份。本次可继续学习。 / Could not restore progress; a backup was attempted. You can keep learning.',
      };
    }
  });
  const [progress, setProgress] = useState(initial.data);
  const [error, setError] = useState(initial.error);
  const [saved, setSaved] = useState(false);
  function update(fn: (p: Progress) => Progress) {
    const next = fn(progress);
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(true);
      setError('');
    } catch {
      setSaved(false);
      setError(
        '浏览器无法保存，本次进度仅保留在当前页面。 / Browser storage is unavailable; keep this page open to retain this session.',
      );
    }
  }
  function session(id: string, patch: Partial<Session>) {
    update((p) => ({
      ...p,
      sessions: {
        ...p.sessions,
        [id]: { ...(p.sessions[id] ?? newSession()), ...patch },
      },
    }));
  }
  function answer(id: string, choice: number) {
    update((p) => ({
      ...p,
      answers: {
        ...p.answers,
        [id]: { choice, first: p.answers[id]?.first ?? choice, at: Date.now() },
      },
    }));
  }
  return { progress, error, saved, update, session, answer };
}
export type Store = ReturnType<typeof useProgress>;
