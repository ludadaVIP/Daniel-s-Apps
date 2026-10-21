import { describe, it, expect } from 'vitest';
import {
  h37Lessons,
  h37CheckQuestions,
  h37ReviewQuestion,
} from './content/H37';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H37-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['9', '36', '(k+1)^2', 'false', '2'],
  ['31', '1', '13', '8', 'insufficient'],
  ['A-B-C-D-E', '6', 'A-C-D-E', 'A-C-E', 'unreachable'],
  ['[0,-2;1,0]', '(-4,1)', '[0,-1;2,0]', '0', '(3,0)'],
  ['23/16', '1/32', '6', '2', 'false'],
];
const all = [
  ...h37Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h37CheckQuestions,
];
describe('H37 authored enrichment curriculum', () => {
  it('matches five planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h37Lessons).toHaveLength(5);
    expect(unitChecks.H37.questions).toEqual(h37CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H37-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h37Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h37Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h37ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with five choices and thirteen human arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(5);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(13);
    h37Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h37CheckQuestions[i]!.answer)).toBe(
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
  it('independently verifies 120 bilingual parameter variants with weighted costs, sequential maps and error bounds', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let round = 0; round < 24; round++) {
        const a = 1 + (round % 6),
          b = 1 + Math.floor(round / 6),
          q = h37ReviewQuestion(`H37-L0${i + 1}`, round);
        let expected: string;
        if (i === 0) {
          const sum = (n: number) =>
            Array.from({ length: n }, (_, j) => b * (2 * j + 1)).reduce(
              (x, y) => x + y,
              0,
            );
          expected = String(sum(a + 1) - sum(a));
        } else if (i === 1) {
          let u = a;
          for (let n = 0; n < 3; n++) u = 2 * u + b;
          expected = String(u);
        } else if (i === 2)
          expected = String(Math.min(a + (b + 1), b + (a + 2)));
        else if (i === 3) {
          const rotate = [-b, 1];
          expected = `(${a * rotate[0]!},${rotate[1]})`;
        } else {
          let width = a;
          for (let n = 0; n < b; n++) width /= 2;
          expected = String(width / 2);
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('999', q.answer)).toBe(false);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h37ReviewQuestion(`H37-L0${i + 1}`, round + 24).stem).toEqual(
          q.stem,
        );
        expect(h37ReviewQuestion(`H37-L0${i + 1}`, round + 24).id).not.toBe(
          q.id,
        );
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h37ReviewQuestion('H37-L01', n)).toThrow();
    for (const id of ['H37-L00', 'H37-L06', 'H33-L01'])
      expect(() => h37ReviewQuestion(id, 0)).toThrow();
    expect(h37ReviewQuestion('H37-L05', 100000).id).toBe('H37-L05-R100000');
  });
});
