import { useCallback, useEffect, useState } from 'react';
import {
  scheduleCard,
  type Attempt,
  type CardProgress,
  type Result,
} from './engine';

export const STORAGE_KEY = 'study.pinyin.progress.v1';
export interface Session {
  step: number;
  card: number;
  cursor: number;
  answers: Record<string, Result>;
  ids?: string[];
  finishedAt?: string;
}
export interface Progress {
  version: 1;
  sessions: Record<string, Session>;
  cards: Record<string, CardProgress>;
  attempts: Attempt[];
  parentNotes: string;
}
export function newSession(): Session {
  return { step: 0, card: 0, cursor: 0, answers: {} };
}
export function emptyProgress(): Progress {
  return { version: 1, sessions: {}, cards: {}, attempts: [], parentNotes: '' };
}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function date(value: unknown) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}
function integer(value: unknown, max: number) {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= max
  );
}
export function validProgress(value: unknown): value is Progress {
  if (
    !object(value) ||
    value.version !== 1 ||
    !object(value.sessions) ||
    !object(value.cards) ||
    !Array.isArray(value.attempts) ||
    typeof value.parentNotes !== 'string'
  )
    return false;
  return (
    Object.values(value.sessions).every(
      (s) =>
        object(s) &&
        integer(s.step, 4) &&
        integer(s.card, 100) &&
        integer(s.cursor, 200) &&
        (!s.finishedAt || date(s.finishedAt)) &&
        (!s.ids ||
          (Array.isArray(s.ids) &&
            s.ids.every((id) => typeof id === 'string'))) &&
        object(s.answers) &&
        Object.values(s.answers).every(
          (r) =>
            object(r) &&
            typeof r.correct === 'boolean' &&
            typeof r.response === 'string' &&
            ['automatic', 'self', 'parent'].includes(String(r.source)),
        ),
    ) &&
    Object.values(value.cards).every(
      (c) =>
        object(c) &&
        typeof c.questionId === 'string' &&
        integer(c.stage, 2) &&
        integer(c.wrongStreak, Number.MAX_SAFE_INTEGER) &&
        date(c.due) &&
        (!c.lastCorrect || date(c.lastCorrect)),
    ) &&
    value.attempts.every(
      (a) =>
        object(a) &&
        typeof a.questionId === 'string' &&
        typeof a.response === 'string' &&
        typeof a.correct === 'boolean' &&
        date(a.at) &&
        typeof a.durationMs === 'number' &&
        Number.isFinite(a.durationMs) &&
        a.durationMs >= 0 &&
        ['lesson', 'review', 'lab'].includes(String(a.context)) &&
        ['automatic', 'self', 'parent'].includes(String(a.source)),
    )
  );
}
export function readProgress(storage: Pick<Storage, 'getItem'>): {
  progress: Progress;
  error: string;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { progress: emptyProgress(), error: '' };
    const value: unknown = JSON.parse(raw);
    if (!validProgress(value)) throw new Error('invalid');
    return { progress: value, error: '' };
  } catch {
    return {
      progress: emptyProgress(),
      error:
        '无法读取本地学习记录。旧数据已保留；请在家长报告中导出原始数据，再重置。',
    };
  }
}
export function recordAttempt(
  progress: Progress,
  sessionId: string,
  attempt: Attempt,
): Progress {
  const session = progress.sessions[sessionId] ?? newSession();
  // A submitted question stays scored until the learner starts a new session.
  if (session.answers[attempt.questionId]) return progress;
  return {
    ...progress,
    attempts: [...progress.attempts, attempt],
    cards: {
      ...progress.cards,
      [attempt.questionId]: scheduleCard(
        progress.cards[attempt.questionId],
        attempt,
      ),
    },
    sessions: {
      ...progress.sessions,
      [sessionId]: {
        ...session,
        answers: {
          ...session.answers,
          [attempt.questionId]: {
            correct: attempt.correct,
            response: attempt.response,
            source: attempt.source,
          },
        },
      },
    },
  };
}
export function useProgress() {
  const [initial] = useState(() => {
    try {
      return readProgress(window.localStorage);
    } catch {
      return {
        progress: emptyProgress(),
        error: '浏览器禁用了本地存储，本次学习暂不能保存。',
      };
    }
  });
  const [progress, setProgress] = useState(initial.progress);
  const [error, setError] = useState(initial.error);
  const [blocked, setBlocked] = useState(!!initial.error);
  useEffect(() => {
    if (blocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setError('');
    } catch {
      setError(
        '学习记录未能保存到浏览器。请导出记录备份，再检查存储空间或隐私设置。',
      );
    }
  }, [progress, blocked]);
  const patchSession = useCallback(
    (id: string, fields: Partial<Session>) =>
      setProgress((old) => ({
        ...old,
        sessions: {
          ...old.sessions,
          [id]: { ...(old.sessions[id] ?? newSession()), ...fields },
        },
      })),
    [],
  );
  const answer = useCallback(
    (id: string, attempt: Attempt) =>
      setProgress((old) => recordAttempt(old, id, attempt)),
    [],
  );
  const reset = () => {
    setBlocked(false);
    setError('');
    setProgress(emptyProgress());
  };
  return {
    progress,
    error,
    patchSession,
    answer,
    reset,
    setNotes: (parentNotes: string) =>
      setProgress((old) => ({ ...old, parentNotes })),
  };
}
export type ProgressStore = ReturnType<typeof useProgress>;
