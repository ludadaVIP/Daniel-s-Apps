import { describe, it, expect } from 'vitest';
import {
  curriculum,
  lessons,
  unitChecks,
  reviewQuestionFor,
  diagnosticGroups,
} from './content';
import { checkAnswer } from './model';
import plan from '../../../plan.md?raw';
const bodies = import.meta.glob('../../../content/lessons/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
describe('complete planned course coverage without claiming family learning outcomes', () => {
  it('retains the separate four-by-six bilingual diagnostic rather than counting it among the 358 lessons', () => {
    expect(diagnosticGroups.map((g) => g.id)).toEqual([
      'D01',
      'D02',
      'D03',
      'D04',
    ]);
    const ids = new Set<string>();
    for (const g of diagnosticGroups) {
      expect(g.questions).toHaveLength(6);
      for (const q of g.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
          q.id,
        ).toBeTruthy();
        expect(ids.has(q.id), q.id).toBe(false);
        ids.add(q.id);
      }
    }
    expect(ids.size).toBe(24);
  });
  it('joins every planned identity to an available, ready bilingual lesson and all 67 unit reviews', () => {
    const planned = [
      ...new Set(
        [...plan.matchAll(/^- `([A-Z]\d{2}-L\d{2})` /gm)].map((m) => m[1]),
      ),
    ];
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons);
    expect(curriculum).toHaveLength(9);
    expect(units).toHaveLength(67);
    expect(planned).toHaveLength(358);
    expect(registry).toHaveLength(358);
    expect(lessons).toHaveLength(358);
    expect([...registry.map((l) => l.id)].sort()).toEqual([...planned].sort());
    expect([...lessons.map((l) => l.id)].sort()).toEqual([...planned].sort());
    expect(new Set(lessons.map((l) => l.id)).size).toBe(358);
    for (const u of units) {
      const review = unitChecks[u.id as keyof typeof unitChecks];
      expect(review, u.id).toBeTruthy();
      expect(review.questions.length, u.id).toBeGreaterThanOrEqual(6);
      expect(review.questions.length, u.id).toBeLessThanOrEqual(10);
    }
    for (const l of lessons) {
      const entry = registry.find((r) => r.id === l.id)!;
      expect(entry.available, l.id).toBe(true);
      expect(l.contentStatus, l.id).toBe('ready');
      expect(l.title, l.id).toEqual(entry.title);
      const body = bodies[`../../../content/lessons/${l.id}.md`];
      expect(body, l.id).toBeTruthy();
      expect(body!.split('<!-- EN -->'), l.id).toHaveLength(2);
    }
  });
  it('checks all learning contracts, prerequisite links, review retrievals and explicit human grading', () => {
    const allIDs = new Set(lessons.map((l) => l.id));
    for (const l of lessons) {
      expect(l.minutes, l.id).toBeGreaterThanOrEqual(12);
      // The plan recommends 12–20 minute sessions and explicitly allows two sessions.
      expect(l.minutes, l.id).toBeLessThanOrEqual(40);
      expect(l.questions.length, l.id).toBeGreaterThanOrEqual(5);
      expect(l.questions.length, l.id).toBeLessThanOrEqual(8);
      expect(l.keywords.length, l.id).toBeLessThanOrEqual(3);
      expect(l.parent.prompts.length, l.id).toBeGreaterThanOrEqual(2);
      expect(allIDs.has(l.parent.bridge), l.id).toBe(true);
      for (const id of l.prerequisites) {
        expect(allIDs.has(id), `${l.id}:${id}`).toBe(true);
        expect(
          lessons.findIndex((p) => p.id === id),
          `${l.id}:${id}`,
        ).toBeLessThan(lessons.indexOf(l));
      }
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice').length,
        l.id,
      ).toBeLessThanOrEqual(l.questions.length / 2);
      for (const q of [l.guided, ...l.questions, l.exit]) {
        for (const text of [q.stem, q.solution, ...q.hints]) {
          expect(text.zh.trim(), q.id).not.toBe('');
          expect(text.en.trim(), q.id).not.toBe('');
        }
        if (q.answer.kind === 'explain')
          expect(
            checkAnswer(
              'induction units necessary sufficient complete argument',
              q.answer,
            ),
            q.id,
          ).toBeNull();
      }
      const retrieval = reviewQuestionFor(l.id, 0);
      expect(retrieval.stem.zh && retrieval.stem.en, l.id).toBeTruthy();
    }
  });
});
