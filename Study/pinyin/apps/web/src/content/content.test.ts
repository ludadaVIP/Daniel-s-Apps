import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  allExercises,
  assessments,
  assessmentExercises,
  exercises,
  labExercises,
  lessonMarkdown,
  lessons,
  skills,
  words,
} from './index';
describe('publishable curriculum integrity', () => {
  it('publishes all 24 complete lessons', () => {
    expect(lessons).toHaveLength(24);
    expect(lessons.filter((l) => l.available)).toHaveLength(24);
    lessons
      .filter((l) => l.available)
      .forEach((l) => {
        expect(
          lessonMarkdown(l.number).split(/\n(?=## )/).length,
        ).toBeGreaterThan(3);
        const qs = exercises.filter((q) => q.lessonId === l.id);
        expect(qs.length).toBeGreaterThanOrEqual(12);
        expect(qs.filter((q) => q.phase === 'challenge')).toHaveLength(8);
        expect(
          qs.some(
            (q) =>
              q.type ===
              (l.week <= 4 || l.number === 21
                ? 'read_aloud'
                : 'type_hanzi_ime'),
          ),
        ).toBe(true);
      });
  });
  it('reviews earlier skills and provides two transfer tasks per new lesson', () => {
    lessons
      .filter((l) => l.number >= 5)
      .forEach((l) => {
        const qs = exercises.filter((q) => q.lessonId === l.id);
        expect(qs).toHaveLength(16);
        expect(qs.filter((q) => q.phase === 'review')).toHaveLength(4);
        expect(qs.filter((q) => q.transfer).length).toBeGreaterThanOrEqual(2);
        qs.filter((q) => q.phase === 'review').forEach((q) => {
          q.skillIds.forEach((id) =>
            expect(
              skills.find((s) => s.id === id)!.introducedIn ?? 1,
            ).toBeLessThan(l.number),
          );
          if (q.wordId)
            expect(words[q.wordId]!.introducedIn ?? 1).toBeLessThan(l.number);
        });
      });
    [
      'ia',
      'iao',
      'ian',
      'iang',
      'iong',
      'ua',
      'uo',
      'uai',
      'uan',
      'uang',
      'üe',
      'üan',
    ].forEach((combination) =>
      expect(lessonMarkdown(13)).toContain(combination),
    );
  });
  it('assigns every checkpoint question exactly once and keeps final passages within the planned lengths', () => {
    expect(assessments).toHaveLength(7);
    assessments.forEach((a) => {
      expect(a.groups.flatMap((g) => g.questionIds).sort()).toEqual(
        [...a.questionIds].sort(),
      );
      a.questionIds.forEach((id) =>
        expect(assessmentExercises.some((q) => q.id === id)).toBe(true),
      );
    });
    const final = assessments.find((a) => a.id === 'A06')!;
    const qs = final.questionIds.map((id) =>
      assessmentExercises.find((q) => q.id === id)!,
    );
    const count = (id: string) =>
      qs
        .filter((q) =>
          final.groups.find((g) => g.id === id)!.questionIds.includes(q.id),
        )
        .reduce(
          (total, q) => total + (q.wordIds?.length ?? q.readingTotal ?? 1),
          0,
        );
    expect(count('syllables')).toBe(30);
    expect(count('words')).toBe(12);
    expect(count('operations')).toBe(4);
    expect(count('passage')).toBeGreaterThanOrEqual(40);
    expect(count('passage')).toBeLessThanOrEqual(60);
    expect(
      [...words['message-final']!.hanzi].filter((c) =>
        /\p{Script=Han}/u.test(c),
      ).length,
    ).toBeGreaterThanOrEqual(60);
    expect(
      [...words['message-final']!.hanzi].filter((c) =>
        /\p{Script=Han}/u.test(c),
      ).length,
    ).toBeLessThanOrEqual(100);
    const earlierWords = new Set(
      exercises
        .filter((q) => Number(q.lessonId.slice(1)) <= 16)
        .map((q) => q.wordId),
    );
    const fourthWeek = assessments.find((a) => a.id === 'A04')!;
    const syllables = fourthWeek.groups
      .find((g) => g.id === 'syllables')!
      .questionIds.flatMap(
        (id) => assessmentExercises.find((q) => q.id === id)!.wordIds!,
      );
    expect(
      syllables.filter((id) => !earlierWords.has(id)).length,
    ).toBeGreaterThanOrEqual(6);
  });
  it('keeps all seven exercise types available without mislabeling keyboard previews as courses', () => {
    expect(new Set(allExercises.map((q) => q.type)).size).toBe(7);
    expect(labExercises.every((q) => q.lessonId === 'LAB')).toBe(true);
    expect(words.nv!.pinyinMarked).toBe('nǚ');
    expect(words.nv!.pinyinPlain).toBe('nv');
  });
  it('aligns explicit full-pinyin input strings with reviewed marked spellings', () => {
    Object.values(words).forEach((w) => {
      const letters = w.pinyinMarked
        .toLowerCase()
        .replace(/[üǖǘǚǜ]/g, 'v')
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/[^a-z]/g, '');
      expect(w.pinyinPlain.replace(/'/g, ''), w.id).toBe(letters);
    });
  });
  it('has unique answers, reviewed vocabulary, known skills and actual bundled audio', () => {
    expect(new Set(allExercises.map((q) => q.id)).size).toBe(
      allExercises.length,
    );
    Object.values(words).forEach((w) =>
      expect(
        existsSync(
          fileURLToPath(new URL(`../audio/${w.audio}.wav`, import.meta.url)),
        ),
      ).toBe(true),
    );
    allExercises.forEach((q) => {
      expect(q.skillIds.every((id) => skills.some((s) => s.id === id))).toBe(
        true,
      );
      if (q.wordId) expect(words[q.wordId]).toBeTruthy();
      q.wordIds?.forEach((id) => expect(words[id]).toBeTruthy());
      if (q.options) {
        expect(new Set(q.options.map((o) => o.value)).size).toBe(
          q.options.length,
        );
        expect(
          q.options.filter((o) => q.acceptedAnswers.includes(o.value)),
        ).toHaveLength(1);
        q.options
          .filter((o) => o.wordId)
          .forEach((o) => expect(words[o.wordId!]).toBeTruthy());
      }
    });
  });
});
