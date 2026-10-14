import { useEffect, useState } from 'react';
import { lessons, publishedIds } from './content';
import { readAtlas, type AtlasDraft } from './atlasModel';
import { readLandformReport, type LandformReport } from './landformReport';

export type ActivityState = {
  found: string[];
  matches: Record<string, string>;
  layer: 'satellite' | 'roads' | 'terrain';
  decisions: Record<string, string>;
  rotation: number;
  route: string[];
  centre: number;
  atlas?: AtlasDraft;
  landformReport?: LandformReport;
};
export type Session = {
  step: number;
  startedAt?: number;
  completedAt?: number;
  reviewAt?: number;
  prediction: number | null;
  note: string;
  oral: boolean;
  level: 'explored' | 'explain' | 'transfer';
  answers: Record<string, number>;
  activity: ActivityState;
};
export type FamilyFeedback = {
  interest: number;
  independence: number;
  useful: string;
  difficult: string;
};
export type Progress = {
  version: 1;
  sessions: Record<string, Session>;
  feedback: FamilyFeedback;
  feedbackByBlock: Record<string, FamilyFeedback>;
};
export const newFeedback = (): FamilyFeedback => ({
  interest: 3,
  independence: 3,
  useful: '',
  difficult: '',
});
export const STORAGE_KEY = 'study-geography-v1';
export const newActivity = (): ActivityState => ({
  found: [],
  matches: {},
  layer: 'satellite',
  decisions: {},
  rotation: 0,
  route: ['school'],
  centre: 0,
});
export const newSession = (): Session => ({
  step: 0,
  prediction: null,
  note: '',
  oral: false,
  level: 'explored',
  answers: {},
  activity: newActivity(),
});
export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: {},
  feedback: newFeedback(),
  feedbackByBlock: {},
});
const object = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
const number = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max
    ? v
    : fallback;
const string = (v: unknown) => (typeof v === 'string' ? v.slice(0, 3000) : '');
const strings = (v: unknown) =>
  Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === 'string' && x.length < 50)
        .slice(0, 30)
    : [];
const dictionary = (v: unknown) =>
  Object.fromEntries(
    Object.entries(object(v)).filter(
      ([k, val]) => k.length < 50 && typeof val === 'string' && val.length < 50,
    ),
  ) as Record<string, string>;
export function readProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  const root = object(JSON.parse(raw));
  if (root.version !== 1 || !root.sessions || typeof root.sessions !== 'object')
    throw new Error('Unsupported geography record');
  const progress = emptyProgress();
  for (const [id, value] of Object.entries(object(root.sessions))) {
    if (!publishedIds.has(id)) continue;
    const s = object(value),
      a = object(s.activity);
    progress.sessions[id] = {
      ...newSession(),
      step: number(s.step, 0, 6, 0),
      prediction:
        typeof s.prediction === 'number' &&
        s.prediction >= 0 &&
        s.prediction <= 2 &&
        Number.isInteger(s.prediction)
          ? s.prediction
          : null,
      note: string(s.note),
      oral: s.oral === true,
      level:
        s.level === 'explain' || s.level === 'transfer' ? s.level : 'explored',
      answers: Object.fromEntries(
        Object.entries(object(s.answers)).filter(
          ([k, v]) =>
            k.length < 60 &&
            typeof v === 'number' &&
            Number.isInteger(v) &&
            v >= 0 &&
            v <= 2,
        ),
      ) as Record<string, number>,
      activity: {
        found: strings(a.found),
        matches: dictionary(a.matches),
        decisions: dictionary(a.decisions),
        layer:
          a.layer === 'roads' || a.layer === 'terrain' ? a.layer : 'satellite',
        rotation: [0, 90, 180, 270].includes(Number(a.rotation))
          ? Number(a.rotation)
          : 0,
        route: strings(a.route).length ? strings(a.route) : ['school'],
        centre: a.centre === 180 ? 180 : 0,
        ...(id === 'GEO-016' && a.atlas ? { atlas: readAtlas(a.atlas) } : {}),
        ...(id === 'GEO-032' && a.landformReport
          ? { landformReport: readLandformReport(a.landformReport) }
          : {}),
      },
      ...Object.fromEntries(
        ['startedAt', 'completedAt', 'reviewAt'].flatMap((k) =>
          typeof s[k] === 'number' && Number.isFinite(s[k]) && s[k] > 0
            ? [[k, s[k]]]
            : [],
        ),
      ),
    };
  }
  const f = object(root.feedback);
  progress.feedback = {
    interest: number(f.interest, 1, 5, 3),
    independence: number(f.independence, 1, 5, 3),
    useful: string(f.useful),
    difficult: string(f.difficult),
  };
  for (const [id, rawFeedback] of Object.entries(
    object(root.feedbackByBlock),
  )) {
    if (!lessons.some((l, i) => i % 4 === 0 && l.id === id)) continue;
    const feedback = object(rawFeedback);
    progress.feedbackByBlock[id] = {
      interest: number(feedback.interest, 1, 5, 3),
      independence: number(feedback.independence, 1, 5, 3),
      useful: string(feedback.useful),
      difficult: string(feedback.difficult),
    };
  }
  return progress;
}
export function patchSession(
  progress: Progress,
  id: string,
  patch: Partial<Session>,
): Progress {
  return {
    ...progress,
    sessions: {
      ...progress.sessions,
      [id]: { ...(progress.sessions[id] ?? newSession()), ...patch },
    },
  };
}
export function finishSession(
  progress: Progress,
  id: string,
  now = Date.now(),
): Progress {
  return patchSession(progress, id, {
    completedAt: progress.sessions[id]?.completedAt ?? now,
    reviewAt: now + 7 * 86400000,
    step: 6,
  });
}
export const dueLessons = (progress: Progress, now = Date.now()) =>
  Object.entries(progress.sessions)
    .filter(([, s]) => s.completedAt && (s.reviewAt ?? 0) <= now)
    .map(([id]) => id);
export function useProgress() {
  const [initial] = useState(() => {
    try {
      return {
        progress: readProgress(localStorage.getItem(STORAGE_KEY)),
        error: '',
      };
    } catch {
      return {
        progress: emptyProgress(),
        error:
          '无法读取原有记录；当前可继续学习，新操作会尝试保存。 / Earlier records could not be read; new changes will try to save.',
      };
    }
  });
  const [progress, setProgress] = useState(initial.progress);
  const [error, setError] = useState(initial.error);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!revision) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setError('');
    } catch {
      setError(
        '本机保存失败，请先导出手帐；当前学习仍可继续。 / Local saving failed. Export your notebook; learning can continue.',
      );
    }
  }, [progress, revision]);
  function update(fn: (p: Progress) => Progress) {
    setProgress(fn);
    setRevision((r) => r + 1);
  }
  function patch(id: string, patch: Partial<Session>) {
    update((p) => patchSession(p, id, patch));
  }
  return { progress, update, patch, error };
}
export type Store = ReturnType<typeof useProgress>;
