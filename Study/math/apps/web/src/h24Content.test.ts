import { describe, it, expect } from 'vitest';
import {
  h24Lessons,
  h24CheckQuestions,
  h24ReviewQuestion,
} from './content/H24';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H24-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['5', '6', '4', '4', '6'],
  ['20', '24', '1', '64', '0'],
  ['10', '10', '1', '3/5', '3'],
  ['6', '24', '-6', '32', '3/8'],
  ['3/5', '3/4', '3/10', 'undefined', '1/2'],
  ['8/27', '8/9', 'independent', 'undefined', '4/5'],
];
const all = [
  ...h24Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h24CheckQuestions,
];
const choose = (n: number, r: number) => {
  if (r > n) return 0;
  let v = 1;
  for (let k = 1; k <= r; k++) v = (v * (n - k + 1)) / k;
  return Math.round(v);
};
describe('H24 original bilingual unit, anchors and review variants', () => {
  it('matches all six planned identities and earlier topic prerequisites with two complete examples in each language', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h24Lessons).toHaveLength(6);
    expect(
      registry
        .filter((l) => l.id.startsWith('H24-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h24Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H24.questions).toEqual(h24CheckQuestions);
    for (const l of h24Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((p) => p.id === l.id)?.available).toBe(true);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBe(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const index = lessons.findIndex((p) => p.id === id);
        expect(index, id).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(new Set(l.parent.prompts.map((v) => v.en)).size).toBe(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h24ReviewQuestion(l.id, 0));
    }
  });
  it('checks 56 distinct tasks with 36 constructed answers, six choices and fourteen manually reviewed explanations', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h24Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h24CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer('Bayes independence denominator', q.answer),
        ).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
        continue;
      }
      q.answerChecks!.accepted.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(false),
      );
    }
    expect(checkAnswer('6/10', h24Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('60%', h24Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('0.6', h24Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('0.2963', h24Lessons[5]!.guided.answer)).toBe(false);
  });
  it('independently recomputes 144 retrievals and 24 distinct bilingual prompts per lesson', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 2 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h24ReviewQuestion(`H24-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) expected = String(k % 2 === 0 ? a + b : a * b);
        else if (i === 1) {
          const n = 4 + (k % 6),
            r = 1 + Math.floor(k / 6);
          let v = 1;
          for (let j = 0; j < r; j++) v *= n - j;
          expected = String(v);
        } else if (i === 2)
          expected = String(choose(5 + (k % 6), Math.floor(k / 6)));
        else if (i === 3) {
          const n = 3 + (k % 6),
            r = Math.floor(k / 6);
          expected = String(choose(n, r) * (-2) ** r);
        } else if (i === 4) expected = `${a}/${a + b}`;
        else {
          const p = 5 * (1 + (k % 6)),
            rate = 20 + 20 * Math.floor(k / 6);
          expected = `${p * rate}/${p * rate + (100 - p) * 10}`;
        }
        expect(checkAnswer(expected, q.answer), `${q.id}: ${expected}`).toBe(
          true,
        );
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h24ReviewQuestion(`H24-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h24ReviewQuestion(`H24-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects malformed review IDs and noninteger or out-of-range rounds', () => {
    for (const round of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h24ReviewQuestion('H24-L01', round)).toThrow();
    expect(() => h24ReviewQuestion('H24-L07', 0)).toThrow();
    expect(h24ReviewQuestion('H24-L06', 100000).id).toBe('H24-L06-R100000');
  });
});
