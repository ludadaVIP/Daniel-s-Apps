import { useCallback, useEffect, useState } from 'react';
import {
  emptyProgress,
  isProgress,
  type Progress,
  type Session,
  newSession,
} from './model';
import { lessons } from './content';
export const STORAGE_KEY = 'study-math-v1';
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { progress: emptyProgress(), error: false };
    const value: unknown = JSON.parse(raw);
    if (isProgress(value)) return { progress: value, error: false };
    return { progress: emptyProgress(), error: true };
  } catch {
    return { progress: emptyProgress(), error: true };
  }
}
export function useProgress() {
  const [initial] = useState(load),
    [progress, setProgress] = useState(initial.progress),
    [error, setError] = useState(initial.error);
  const [blocked] = useState(initial.error);
  useEffect(() => {
    if (blocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setError(false);
    } catch {
      setError(true);
    }
  }, [progress, blocked]);
  const update = useCallback(
    (id: string, fn: (session: Session) => Session) =>
      setProgress((old) => ({
        ...old,
        lastLesson: id,
        sessions: {
          ...old.sessions,
          [id]: fn(old.sessions[id] ?? newSession()),
        },
      })),
    [],
  );
  return { progress, setProgress, update, error };
}
export type Store = ReturnType<typeof useProgress>;
export function reviewQueue(progress: Progress) {
  return lessons.filter((l) => {
    const s = progress.sessions[l.id];
    return (
      !!s &&
      ([...l.questions, l.exit].some(
        (q) => s.answers[q.id]?.checked && !s.answers[q.id]?.independent,
      ) ||
        (!!s.nextReview && new Date(s.nextReview).getTime() <= Date.now())) &&
      (!progress.reviews[l.id]?.completedAt ||
        new Date(progress.reviews[l.id]!.completedAt!).getTime() <
          new Date(s.completedAt ?? 0).getTime() ||
        (!!s.nextReview && new Date(s.nextReview).getTime() <= Date.now()))
    );
  });
}
export function downloadProgress(progress: Progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: 'application/json',
    }),
    url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = 'study-math-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
