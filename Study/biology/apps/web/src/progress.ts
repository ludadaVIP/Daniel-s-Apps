import { useState } from 'react';
import { lessons, questions, type Lesson } from './content';
import { units } from './units';
import {
  emptyProject,
  projectTextReady,
  projectCheck,
  stageQuestions,
  type ProjectDraft,
} from './project';
export const STORAGE_KEY = 'study-biology-v1';
export type Answer = { choice: number; first: number; at: number };
export type Session = {
  step: number;
  prediction?: number;
  explored?: boolean;
  note: string;
  completedAt?: number;
};
export type Mission = {
  object: string;
  evidence: string;
  reasoning: string;
  savedAt?: number;
};
export const emptyMission = (): Mission => ({
  object: '',
  evidence: '',
  reasoning: '',
});
export type Progress = {
  version: 1;
  sessions: Record<string, Session>;
  answers: Record<string, Answer>;
  mission: Mission;
  missions: Record<string, Mission>;
  projects: Record<string, ProjectDraft>;
};
export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: {},
  answers: {},
  mission: { object: '', evidence: '', reasoning: '' },
  missions: {},
  projects: {},
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
  clean.mission = decodeMission(data.mission);
  for (const unit of units.filter((u) => u.id !== 'U01')) {
    if (data.missions?.[unit.id])
      clean.missions[unit.id] = decodeMission(data.missions[unit.id]);
  }
  if (data.projects?.S01) clean.projects.S01 = decodeProject(data.projects.S01);
  return clean;
}
function decodeProject(data: ProjectDraft): ProjectDraft {
  if (
    !Array.isArray(data.records) ||
    data.records.length !== 5 ||
    typeof data.zh !== 'string' ||
    typeof data.en !== 'string' ||
    !data.answers ||
    typeof data.answers !== 'object'
  )
    throw new Error('Invalid project');
  const draft = emptyProject();
  draft.records = data.records.map((row) => {
    if (
      !row ||
      !['real', 'virtual'].includes(row.source) ||
      ![row.name, row.evidence, row.habitat, row.question].every(
        (v) => typeof v === 'string',
      )
    )
      throw new Error('Invalid field record');
    return {
      name: row.name.slice(0, 500),
      evidence: row.evidence.slice(0, 500),
      habitat: row.habitat.slice(0, 500),
      question: row.question.slice(0, 500),
      source: row.source,
    };
  });
  draft.zh = data.zh.slice(0, 1000);
  draft.en = data.en.slice(0, 1000);
  for (const q of stageQuestions) {
    const choice = data.answers[q.id];
    if (choice === undefined) continue;
    if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length)
      throw new Error('Invalid project answer');
    draft.answers[q.id] = choice;
  }
  if (
    Number.isFinite(data.savedAt) &&
    data.savedAt! > 0 &&
    projectTextReady(draft)
  )
    draft.savedAt = data.savedAt;
  return draft;
}
export function withProject(
  p: Progress,
  id: string,
  patch: Partial<ProjectDraft>,
): Progress {
  return {
    ...p,
    projects: {
      ...p.projects,
      [id]: { ...(p.projects[id] ?? emptyProject()), ...patch },
    },
  };
}
export function stageOutcome(p: Progress) {
  const draft = p.projects.S01 ?? emptyProject(),
    check = projectCheck(draft);
  const lessonCount = Array.from(
    { length: 24 },
    (_, i) => `L${String(i + 1).padStart(3, '0')}`,
  ).filter((id) => p.sessions[id]?.completedAt).length;
  const missionCount = Array.from(
    { length: 6 },
    (_, i) => `U${String(i + 1).padStart(2, '0')}`,
  ).filter((id) => missionForUnit(p, id).savedAt).length;
  return {
    lessons: lessonCount,
    missions: missionCount,
    complete:
      lessonCount === 24 &&
      missionCount === 6 &&
      projectTextReady(draft) &&
      !!draft.savedAt &&
      check.answered === 5 &&
      check.correct >= 4,
  };
}
function decodeMission(data: Mission): Mission {
  const result = emptyMission();
  for (const key of ['object', 'evidence', 'reasoning'] as const) {
    if (typeof data?.[key] !== 'string') throw new Error('Invalid mission');
    result[key] = data[key].slice(0, 2000);
  }
  if (
    Number.isFinite(data.savedAt) &&
    data.savedAt! > 0 &&
    [result.object, result.evidence, result.reasoning].every((s) => s.trim())
  )
    result.savedAt = data.savedAt;
  return result;
}
export function missionForUnit(p: Progress, id: string): Mission {
  return id === 'U01' ? p.mission : (p.missions[id] ?? emptyMission());
}
export function withMission(
  p: Progress,
  id: string,
  patch: Partial<Mission>,
): Progress {
  const mission = { ...missionForUnit(p, id), ...patch };
  return id === 'U01'
    ? { ...p, mission }
    : { ...p, missions: { ...p.missions, [id]: mission } };
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
