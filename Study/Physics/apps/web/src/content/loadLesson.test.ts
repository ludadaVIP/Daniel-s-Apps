import { describe, expect, it, vi } from 'vitest';
import { lessonCatalog } from './catalog';
import { catalogEntry } from './catalogEntry';
import { lessons, lessonCollections } from './lessons';
import { lessonPacks } from './packs';
import { createLessonLoader } from './loadLesson';
import {
  decodeProgress,
  freshLesson,
  isMastered,
  dueLessons,
} from '../progress';

describe('on-demand lesson content and stable progress', () => {
  it('keeps catalog text, order, assessments and pack ownership in sync with every course', () => {
    expect(lessonCatalog).toEqual(
      lessons.map((lesson) => {
        const packs = Object.entries(lessonCollections).filter(([, group]) =>
          group.some((l) => l.id === lesson.id),
        );
        expect(packs).toHaveLength(1);
        return catalogEntry(
          lesson,
          packs[0]![0] as keyof typeof lessonCollections,
        );
      }),
    );
    expect(new Set(lessonCatalog.map((l) => l.id)).size).toBe(
      lessonCatalog.length,
    );
    expect(Object.keys(lessonPacks)).toEqual(Object.keys(lessonCollections));
    for (const entry of lessonCatalog) {
      expect(entry).not.toHaveProperty('concept');
      expect(entry).not.toHaveProperty('questions');
      expect(entry).not.toHaveProperty('hook');
    }
  });

  it('loads only the selected content group and caches its sibling courses', async () => {
    const density = vi.fn(lessonPacks.density),
      motion = vi.fn(lessonPacks.motion);
    const loader = createLessonLoader({ ...lessonPacks, density, motion });
    expect(density).not.toHaveBeenCalled();
    expect(loader.getLoaded('same-volume-different-mass')).toBeUndefined();
    expect(await loader.load('same-volume-different-mass')).toEqual(
      lessonCollections.density[0],
    );
    expect(loader.getLoaded('density-mass-over-volume')).toEqual(
      lessonCollections.density[1],
    );
    await loader.load('density-mass-over-volume');
    expect(density).toHaveBeenCalledTimes(1);
    expect(motion).not.toHaveBeenCalled();
  });

  it('shares an in-flight group request across lesson and review readers', async () => {
    let resolve!: (value: typeof lessons) => void;
    const gravity = vi.fn(
      () =>
        new Promise<typeof lessons>((done) => {
          resolve = done;
        }),
    );
    const loader = createLessonLoader({ ...lessonPacks, gravity });
    const pending = lessonCollections.gravity.map((l) => loader.load(l.id));
    expect(gravity).toHaveBeenCalledTimes(1);
    expect(loader.getLoaded(lessonCollections.gravity[0]!.id)).toBeUndefined();
    resolve(lessonCollections.gravity);
    expect(await Promise.all(pending)).toEqual(lessonCollections.gravity);
  });

  it('does not cache failed requests and allows later content recovery', async () => {
    const foundations = vi
      .fn(lessonPacks.foundations)
      .mockRejectedValueOnce(new Error('offline'));
    const loader = createLessonLoader({ ...lessonPacks, foundations });
    await expect(loader.load('physics-everywhere')).rejects.toThrow('offline');
    expect(loader.getLoaded('physics-everywhere')).toBeUndefined();
    expect(await loader.load('physics-everywhere')).toEqual(
      lessonCollections.foundations[0],
    );
    expect(foundations).toHaveBeenCalledTimes(2);
  });

  it('rejects stale answer metadata and commits no siblings from a mismatched group', async () => {
    const stale = structuredClone(lessonCollections.gravity);
    stale[1]!.questions[0]!.correct =
      (stale[1]!.questions[0]!.correct + 1) %
      stale[1]!.questions[0]!.options.length;
    const gravity = vi.fn(lessonPacks.gravity).mockResolvedValueOnce(stale);
    const loader = createLessonLoader({ ...lessonPacks, gravity });
    await expect(loader.load(stale[0]!.id)).rejects.toThrow('does not match');
    expect(loader.getLoaded(stale[0]!.id)).toBeUndefined();
    expect(await loader.load(stale[0]!.id)).toEqual(
      lessonCollections.gravity[0],
    );
  });

  it('rejects missing or duplicate courses rather than opening a wrong body', async () => {
    for (const broken of [
      lessonCollections.gravity.slice(1),
      [
        lessonCollections.gravity[0]!,
        lessonCollections.gravity[0]!,
        lessonCollections.gravity[2]!,
      ],
    ]) {
      const loader = createLessonLoader({
        ...lessonPacks,
        gravity: async () => broken,
      });
      await expect(
        loader.load(lessonCollections.gravity[0]!.id),
      ).rejects.toThrow('does not match');
      expect(
        loader.getLoaded(lessonCollections.gravity[0]!.id),
      ).toBeUndefined();
    }
  });

  it('validates and preserves every existing completion and review before bodies load', () => {
    const time = 200000000;
    const saved = Object.fromEntries(
      lessons.map((lesson) => [
        lesson.id,
        {
          ...freshLesson(),
          step: 4,
          unlockedStep: 4,
          prediction: 0,
          explored: true,
          answers: Object.fromEntries(
            [...lesson.questions, lesson.exit].map((q, i) => [i, q.correct]),
          ),
          completedAt: time,
          reviewedAt: time + 1000,
        },
      ]),
    );
    const progress = decodeProgress(
      JSON.stringify({ lessons: saved, notes: [] }),
    );
    expect(progress.lessons).toEqual(saved);
    expect(dueLessons(progress, time + 86401000).map((l) => l.id)).toEqual(
      lessons.map((l) => l.id),
    );
    for (const lesson of lessons) {
      const p = progress.lessons[lesson.id]!;
      expect(isMastered(lesson.id, p)).toBe(true);
      const wrong = {
        ...p,
        answers: {
          ...p.answers,
          0:
            (lesson.questions[0]!.correct + 1) %
            lesson.questions[0]!.options.length,
        },
      };
      expect(isMastered(lesson.id, wrong)).toBe(false);
      const decoded = decodeProgress(
        JSON.stringify({ lessons: { [lesson.id]: wrong } }),
      );
      expect(decoded.lessons[lesson.id]!.completedAt).toBeUndefined();
      for (const prediction of [-1, 1.5, lesson.predictions.length, NaN])
        expect(isMastered(lesson.id, { ...p, prediction })).toBe(false);
    }
  });

  it('handles unknown IDs without fetching unrelated content', async () => {
    const foundations = vi.fn(lessonPacks.foundations);
    const loader = createLessonLoader({ ...lessonPacks, foundations });
    expect(await loader.load('missing-course')).toBeUndefined();
    expect(await loader.load('constructor')).toBeUndefined();
    expect(foundations).not.toHaveBeenCalled();
    expect(isMastered('missing-course', freshLesson())).toBe(false);
  });
});
