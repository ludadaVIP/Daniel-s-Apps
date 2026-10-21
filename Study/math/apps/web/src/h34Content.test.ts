import { describe, it, expect } from 'vitest';
import {
  h34Lessons,
  h34CheckQuestions,
  h34ReviewQuestion,
} from './content/H34';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H34-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['-3', '6', '3', '0', '-3'],
  ['3', '15', '0:1/5;3:3/5;6:1/5', '18/5', '0'],
  ['[8,12]', '1', '2', '[9,11]', '0.9545'],
  ['1/16', 'reject', '5/16', '1/8', 'reject'],
  ['below-target', '1/25', '5', 'uncertain', 'meets-target'],
];
const all = [
  ...h34Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h34CheckQuestions,
];
describe('H34 authored statistical inference curriculum', () => {
  it('matches five planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h34Lessons).toHaveLength(5);
    expect(unitChecks.H34.questions).toEqual(h34CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H34-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h34Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h34Lessons) {
      expect(l.stage).toBe('H12');
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((r) => r.id === l.id)?.available).toBe(true);
      expect(l.minutes).toBe(20);
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(
          lessons.findIndex((p) => p.id === id),
          id,
        ).toBeGreaterThanOrEqual(0);
        expect(
          lessons.findIndex((p) => p.id === id),
          id,
        ).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h34ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with five choices and thirteen human arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(5);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(13);
    h34Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h34CheckQuestions[i]!.answer)).toBe(
        true,
      );
    });
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(
          checkAnswer('probability weights mean variance normality', q.answer),
        ).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
      } else {
        q.answerChecks!.accepted.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}:${v}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}:${v}`).toBe(false),
        );
      }
    }
  });
  it('independently recomputes 120 distinct bilingual retrievals using parameter errors, weighted means, exact intervals, ordered null outcomes and practical thresholds', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h34ReviewQuestion(`H34-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) expected = String(b - a);
        else if (i === 1) expected = String(a + b);
        else if (i === 2) expected = `[${10 + a - 2 * b},${10 + a + 2 * b}]`;
        else if (i === 3) {
          const n = a + 3,
            observed = n - b + 1;
          let count = 0;
          for (let mask = 0; mask < 2 ** n; mask++) {
            let ones = 0;
            for (let j = 0; j < n; j++)
              ones += Number(Boolean(mask & (1 << j)));
            if (ones >= observed) count++;
          }
          expected = `${count}/${2 ** n}`;
        } else {
          const lo = a - 3 - b / 2,
            hi = a - 3 + b / 2;
          expected =
            lo >= 1 ? 'meets-target' : hi < 1 ? 'below-target' : 'uncertain';
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h34ReviewQuestion(`H34-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h34ReviewQuestion(`H34-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h34ReviewQuestion('H34-L01', n)).toThrow();
    for (const id of ['H34-L00', 'H34-L06', 'H33-L01'])
      expect(() => h34ReviewQuestion(id, 0)).toThrow();
    expect(h34ReviewQuestion('H34-L05', 100000).id).toBe('H34-L05-R100000');
  });
});
