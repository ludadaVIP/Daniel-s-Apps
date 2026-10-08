import { useEffect, useState } from 'react';
import { lessonCatalog as lessons } from './content/catalog';
import { decodeProjects, type ProjectDraft } from './projects';
import { decodeWalking, type WalkingDraft } from './walking';
import { decodeMaterials, type MaterialsDraft } from './materials';
import { decodePower, type PowerDraft } from './power';
export const STORAGE_KEY = 'study-physics-progress-v1';
export type LessonProgress = {
  step: number;
  unlockedStep: number;
  prediction?: number;
  explored: boolean;
  answers: Record<string, number>;
  mistakes: string[];
  completedAt?: number;
  reviewedAt?: number;
};
export type Note = {
  id: string;
  observation: string;
  question: string;
  createdAt: number;
};
export type Progress = {
  lessons: Record<string, LessonProgress>;
  notes: Note[];
  projects?: Record<string, ProjectDraft>;
  walkingProject?: WalkingDraft;
  materialsProject?: MaterialsDraft;
  powerProject?: PowerDraft;
};
export const freshLesson = (): LessonProgress => ({
  step: 0,
  unlockedStep: 0,
  explored: false,
  answers: {},
  mistakes: [],
});
export function decodeProgress(raw: string | null): Progress {
  const empty: Progress = { lessons: {}, notes: [] };
  try {
    const data = JSON.parse(raw ?? '{}');
    if (!data || typeof data !== 'object') return empty;
    for (const lesson of lessons) {
      const entry = data.lessons?.[lesson.id];
      if (!entry || typeof entry !== 'object') continue;
      const value = freshLesson();
      value.step = Number.isInteger(entry.step)
        ? Math.max(0, Math.min(4, entry.step))
        : 0;
      value.unlockedStep = Math.max(
        value.step,
        Number.isInteger(entry.unlockedStep)
          ? Math.max(0, Math.min(4, entry.unlockedStep))
          : 0,
      );
      if (
        Number.isInteger(entry.prediction) &&
        entry.prediction >= 0 &&
        entry.prediction < lesson.predictionCount
      )
        value.prediction = entry.prediction;
      value.explored = entry.explored === true;
      const questions = lesson.assessments;
      questions.forEach((question, index) => {
        const answer = entry.answers?.[index];
        if (
          Number.isInteger(answer) &&
          answer >= 0 &&
          answer < question.optionCount
        )
          value.answers[index] = answer;
      });
      value.mistakes = Array.isArray(entry.mistakes)
        ? entry.mistakes.filter(
            (id: unknown) =>
              typeof id === 'string' &&
              /^\d+$/.test(id) &&
              Number(id) < questions.length,
          )
        : [];
      if (
        isMastered(lesson.id, value) &&
        Number.isFinite(entry.completedAt) &&
        entry.completedAt > 0
      )
        value.completedAt = entry.completedAt;
      if (Number.isFinite(entry.reviewedAt) && entry.reviewedAt > 0)
        value.reviewedAt = entry.reviewedAt;
      empty.lessons[lesson.id] = value;
    }
    if (Array.isArray(data.notes))
      empty.notes = data.notes
        .filter(
          (n: Note) =>
            n &&
            typeof n.id === 'string' &&
            typeof n.observation === 'string' &&
            typeof n.question === 'string' &&
            Number.isFinite(n.createdAt),
        )
        .slice(0, 100);
    const projects = decodeProjects(data.projects);
    if (projects) empty.projects = projects;
    const walkingProject = decodeWalking(data.walkingProject);
    if (walkingProject) empty.walkingProject = walkingProject;
    const materialsProject = decodeMaterials(data.materialsProject);
    if (materialsProject) empty.materialsProject = materialsProject;
    const powerProject = decodePower(data.powerProject);
    if (powerProject) empty.powerProject = powerProject;
    return empty;
  } catch {
    return empty;
  }
}
export function isMastered(id: string, progress: LessonProgress): boolean {
  const lesson = lessons.find((l) => l.id === id);
  return (
    !!lesson &&
    progress.explored &&
    Number.isInteger(progress.prediction) &&
    progress.prediction! >= 0 &&
    progress.prediction! < lesson.predictionCount &&
    lesson.assessments.every((q, i) => progress.answers[i] === q.correct)
  );
}
export function dueLessons(progress: Progress, now = Date.now()) {
  return lessons.filter((l) => {
    const p = progress.lessons[l.id];
    return (
      p &&
      (p.mistakes.length > 0 ||
        (p.completedAt && now - (p.reviewedAt ?? p.completedAt) >= 86400000))
    );
  });
}
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      return decodeProgress(localStorage.getItem(STORAGE_KEY));
    } catch {
      return decodeProgress(null);
    }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setStorageAvailable(false);
    }
  }, [progress]);
  function update(change: (old: Progress) => Progress) {
    setProgress(change);
  }
  function saveLesson(
    id: string,
    change: (old: LessonProgress) => LessonProgress,
  ) {
    update((old) => ({
      ...old,
      lessons: {
        ...old.lessons,
        [id]: change(old.lessons[id] ?? freshLesson()),
      },
    }));
  }
  return { progress, saveLesson, update, storageAvailable };
}
export type ProgressStore = ReturnType<typeof useProgress>;
