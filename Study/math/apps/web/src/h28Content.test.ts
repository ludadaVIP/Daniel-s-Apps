import { describe, it, expect } from 'vitest';
import {
  h28Lessons,
  h28CheckQuestions,
  h28ReviewQuestion,
} from './content/H28';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H28-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['7', '59', '49', '1', '18'],
  ['6', '43', '{0,14,15}', '47', '20'],
  ['0', '13', '19', 'invalid', 'invalid'],
  ['(1,1)', '0', '3', '(1,2)', '(1/2,2)'],
  ['73', '49', '63', 'valid', 'invalid'],
];
const all = [
  ...h28Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h28CheckQuestions,
];
describe('H28 authored curriculum and varied retrievals', () => {
  it('matches the plan, earlier prerequisites, bilingual examples and complete lesson structure', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h28Lessons).toHaveLength(5);
    expect(unitChecks.H28.questions).toEqual(h28CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H28-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h28Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h28Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((p) => p.id === l.id)?.available).toBe(true);
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h28ReviewQuestion(l.id, 0));
    }
  });
  it('validates 48 tasks, six choices and twelve human arguments without requiring canonical witnesses', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h28Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(checkAnswer('1', l.questions[0]!.answer)).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h28CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer('premise assumptions counterexample', q.answer),
        ).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
      } else {
        q.answerChecks!.accepted.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(false),
        );
      }
    }
    expect(checkAnswer('(2,-3)', h28Lessons[3]!.guided.answer)).toBe(true);
    expect(checkAnswer('0.5', h28Lessons[3]!.questions[2]!.answer)).toBe(true);
    expect(checkAnswer('(2,3)', h28Lessons[3]!.questions[3]!.answer)).toBe(
      true,
    );
    expect(
      checkAnswer('{15;0;14;14}', h28Lessons[1]!.questions[2]!.answer),
    ).toBe(true);
  });
  it('independently checks 120 mathematically varied bilingual retrievals and noncanonical witnesses', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h28ReviewQuestion(`H28-L0${i + 1}`, k),
          n = 13 + a;
        let expected: string;
        if (i === 0) {
          let packets = 0;
          while (b + 8 * packets < 3 * n + 5) packets++;
          expected = String(packets);
        } else if (i === 1) {
          const matches = Array.from({ length: 10 }, (_, j) => j + 1).filter(
            (x) => 7 + (b + 4) * x === 7 + a + 4 * x,
          );
          expected = `{${matches.join(',')}}`;
        } else if (i === 2) {
          let packs = 0;
          const need = (4 + b) * a + (k % 2);
          while (packs * (4 + b) < need) packs++;
          expected = String(packs);
        } else if (i === 3) {
          expected = String(a - 1);
          expect(checkAnswer(String(a), q.answer)).toBe(false);
          expect(checkAnswer('-1/2', q.answer)).toBe(true);
        } else {
          const costs: number[] = [];
          for (const people of [n - 1, n])
            for (let usage = 3; usage <= 3 + b; usage++) {
              let packs = 0;
              while (4 + 8 * packs < people * usage + 5) packs++;
              costs.push(7 + 6 * packs);
            }
          expected = String(Math.max(...costs));
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h28ReviewQuestion(`H28-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h28ReviewQuestion(`H28-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('bounds retrieval identities and rounds', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h28ReviewQuestion('H28-L01', r)).toThrow();
    for (const id of ['H28-L00', 'H28-L06', 'H27-L01'])
      expect(() => h28ReviewQuestion(id, 0)).toThrow();
    expect(h28ReviewQuestion('H28-L05', 100000).id).toBe('H28-L05-R100000');
  });
});
