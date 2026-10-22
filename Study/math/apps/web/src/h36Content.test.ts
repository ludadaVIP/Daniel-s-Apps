import { describe, it, expect } from 'vitest';
import {
  h36Lessons,
  h36CheckQuestions,
  h36ReviewQuestion,
} from './content/H36';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H36-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['{(-4,3);(4,3)}', '1', '{}', '{(2,4)}', '{}'],
  ['(2*x-2)^2+4*y^2=16', '(1,2)', '(1,0)', '4', 'out'],
  ['(3,4)', '(-5,0)', '1', 'out', '(5,0)'],
  ['0', 'undefined', '{(-3,0);(3,0)}', 'x^2+y^2=9', 'straight'],
  ['8', '6', '{(-4,9/5);(4,9/5)}', '[0,0]', '{}'],
];
const all = [
  ...h36Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h36CheckQuestions,
];
describe('H36 authored advanced analytic geometry curriculum', () => {
  it('matches five planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h36Lessons).toHaveLength(5);
    expect(unitChecks.H36.questions).toEqual(h36CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H36-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h36Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h36Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h36ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with five choices and thirteen human arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(5);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(13);
    h36Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h36CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer(
            'locus parameter dot product equation units full width',
            q.answer,
          ),
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
  it('independently verifies 120 bilingual retrievals by original equations, midpoint reconstruction and exact line conditions', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let round = 0; round < 24; round++) {
        const a = 1 + (round % 6),
          b = 1 + Math.floor(round / 6),
          q = h36ReviewQuestion(`H36-L0${i + 1}`, round);
        let expected: string;
        if (i === 0) {
          const points = [];
          for (let x = a - 5; x <= a + 5; x++)
            if ((x - a) ** 2 + 9 === 25) points.push(`(${x},${b + 3})`);
          expected = `{${points.join(';')}}`;
        } else if (i === 1)
          expected = `4*x^2+4*y^2-${4 * a}*x+${a * a - 4 * b * b}=0`;
        else if (i === 2) {
          const r = a + 1,
            d = 4 + b * b;
          expected = `(${r * (4 - b * b)}/${d},${4 * r * b}/${d})`;
          const px = (r * (4 - b * b)) / d,
            py = (4 * r * b) / d;
          expect(px * px + py * py).toBeCloseTo(r * r, 12);
          expect(2 * py).toBeCloseTo(b * (px + r), 12);
          expect(px).toBeGreaterThan(-r);
        } else if (i === 3) expected = String(-a * a + -b * -b);
        else {
          const horizontal = 5 * (a + 2),
            vertical = 3 * b,
            height = (3 * vertical) / 5;
          expected = String((2 * horizontal * 4) / 5);
          expect(
            (Number(expected) / 2) ** 2 / horizontal ** 2 +
              height ** 2 / vertical ** 2,
          ).toBeCloseTo(1, 12);
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('999', q.answer)).toBe(false);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h36ReviewQuestion(`H36-L0${i + 1}`, round + 24).stem).toEqual(
          q.stem,
        );
        expect(h36ReviewQuestion(`H36-L0${i + 1}`, round + 24).id).not.toBe(
          q.id,
        );
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h36ReviewQuestion('H36-L01', n)).toThrow();
    for (const id of ['H36-L00', 'H36-L06', 'H33-L01'])
      expect(() => h36ReviewQuestion(id, 0)).toThrow();
    expect(h36ReviewQuestion('H36-L05', 100000).id).toBe('H36-L05-R100000');
  });
});
