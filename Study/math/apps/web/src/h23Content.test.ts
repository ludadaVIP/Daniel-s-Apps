import { describe, it, expect } from 'vitest';
import {
  h23Lessons,
  h23CheckQuestions,
  h23ReviewQuestion,
} from './content/H23';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H23-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h23Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h23CheckQuestions,
];
const anchors = [
  ['(3,4,-4)', '(5/2,0,1)', 'sqrt(41)', '(-3,-4,4)', '(4,2,0)'],
  ['(3,1,2)', '(-1,3,-4)', '(0,5,-5)', '(-1/2,-1,1/2)', '(0,0,0)'],
  ['0', 'sqrt(6)/6', 'straight', 'undefined', '-sqrt(2)/2'],
  ['parallel', 'contained', 'intersecting', '(1,0,0)', 'parallel'],
  ['6', '(1,0,1)', '(4,3,1)', '3sqrt(2)', '0'],
];
describe('H23 authored spatial vector curriculum and independent retrieval anchors', () => {
  it('matches the five planned bilingual lessons and valid earlier prerequisites with two complete examples in each language', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(h23Lessons).toHaveLength(5);
    expect(
      registry
        .filter((l) => l.id.startsWith('H23-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h23Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H23.questions).toEqual(h23CheckQuestions);
    for (const l of h23Lessons) {
      expect(l.stage).toBe('H11');
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((p) => p.id === l.id)?.available).toBe(true);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBe(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n, id).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h23ReviewQuestion(l.id, 0));
    }
  });
  it('checks 48 distinct anchors, 30 constructed answers, six choices and twelve parent-reviewed arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h23Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('normal vector projection', q.answer)).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(false);
    }
    h23CheckQuestions
      .slice(0, 5)
      .forEach((q, i) =>
        expect(checkAnswer(anchors[i]![0]!, q.answer)).toBe(true),
      );
    expect(checkAnswer('2', h23CheckQuestions[5]!.answer)).toBe(true);
  });
  it('recomputes 120 retrievals independently and verifies 24 distinct bilingual stems per lesson', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const x = -2 + (k % 4),
          y = -1 + (Math.floor(k / 4) % 3),
          z = 1 + Math.floor(k / 12),
          q = h23ReviewQuestion(`H23-L0${i + 1}`, k),
          mode = k % 3;
        let expected: string;
        if (i === 0) {
          const u = [2 - x, y + 1, z - 2];
          expected =
            mode === 0
              ? `(${u.join(',')})`
              : mode === 1
                ? `((${x + 2})/2,(${y - 1})/2,(${z + 2})/2)`
                : String(u.reduce((s, v) => s + v * v, 0));
          if (mode === 1) expected = `(${x + 2}/2,${y - 1}/2,${z + 2}/2)`;
        } else if (i === 1) {
          const values =
            mode === 0
              ? [x + 1, y - 1, z + 2]
              : mode === 1
                ? [x - 1, y + 1, z - 2]
                : [2 * x - 1, 2 * y + 1, 2 * z - 2];
          expected = `(${values.join(',')})`;
        } else if (i === 2)
          expected =
            k % 2 === 0 ? String(x) : `${x}/sqrt(${x * x + y * y + z * z})`;
        else if (i === 3)
          expected =
            mode === 0 ? (k < 12 ? 'contained' : 'parallel') : 'intersecting';
        else {
          const s = x + 2 * y + 2 * z - 3;
          expected =
            k % 2 === 0
              ? `sqrt(${s * s}/9)`
              : `(${9 * x - s}/9,${9 * y - 2 * s}/9,${9 * z - 2 * s}/9)`;
        }
        expect(checkAnswer(expected, q.answer), `${q.id}: ${expected}`).toBe(
          true,
        );
        for (const wrong of q.answerChecks!.rejected)
          expect(checkAnswer(wrong, q.answer)).toBe(false);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h23ReviewQuestion(`H23-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h23ReviewQuestion(`H23-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities and noninteger or out-of-range retrieval rounds', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h23ReviewQuestion('H23-L01', r)).toThrow();
    expect(() => h23ReviewQuestion('H23-L06', 0)).toThrow();
    expect(h23ReviewQuestion('H23-L05', 100000).id).toBe('H23-L05-R100000');
  });
});
