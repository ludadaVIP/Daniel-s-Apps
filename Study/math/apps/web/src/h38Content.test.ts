import { describe, it, expect } from 'vitest';
import {
  h38Lessons,
  h38CheckQuestions,
  h38ReviewQuestion,
} from './content/H38';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H38-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['90', '30', '30', '15', '30'],
  ['120', '-15', 'false', '10', '5'],
  ['7', '91', '8', 'false', 'false'],
  ['90', 'false', '1', '60', 'true'],
  ['{100}', '100', '240', '{}', '{120}'],
];
const all = [
  ...h38Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h38CheckQuestions,
];
describe('H38 authored final project curriculum', () => {
  it('matches five planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h38Lessons).toHaveLength(5);
    expect(unitChecks.H38.questions).toEqual(h38CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H38-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h38Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h38Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h38ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with five choices and thirteen human arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(5);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(13);
    h38Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h38CheckQuestions[i]!.answer)).toBe(
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
            'model units rainfall residual monotonic necessity sufficiency budget',
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
  it('independently verifies 120 bilingual variants using physical units, residuals, exhaustive thresholds and catalog intersections', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let round = 0; round < 24; round++) {
        const a = 1 + (round % 6),
          b = 1 + Math.floor(round / 6),
          q = h38ReviewQuestion(`H38-L0${i + 1}`, round);
        let expected: string;
        if (i === 0) {
          const cubicMillimetres = (10 * a * 1000000 * 2 * b) / 4;
          expected = String(cubicMillimetres / 1000000);
        } else if (i === 1) {
          const r = b + 3,
            observed = 5 * a * r - a - b;
          expected = String(observed - 5 * a * r);
        } else if (i === 2) {
          const count = 8 * a + b;
          let worst = 0;
          for (let threshold = 0; threshold <= count; threshold++) {
            let lo = 0,
              hi = count,
              calls = 0;
            while (lo < hi) {
              const mid = Math.floor((lo + hi) / 2);
              calls++;
              if (mid >= threshold) hi = mid;
              else lo = mid + 1;
            }
            worst = Math.max(worst, calls);
          }
          expected = String(count - worst);
        } else if (i === 3)
          expected = String(
            Array.from({ length: b + 1 }, () => 10 * a).reduce(
              (x, y) => x + y,
              0,
            ),
          );
        else {
          const demand = 10 * a,
            min = 20 * Math.ceil((3 * demand) / 20),
            budget = 40 + 2 * (min + 20 * (b - 1)),
            values = [];
          for (let c = 0; c <= 300; c += 20) {
            let s = 0,
              ok = true;
            for (const inflow of [3 * demand, 0, 0, 3 * demand, 0]) {
              s = Math.min(c, s + inflow);
              if (s < demand) ok = false;
              s = Math.max(0, s - demand);
            }
            if (ok && 40 + 2 * c <= budget) values.push(c);
          }
          expected = `{${values.join(',')}}`;
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('999', q.answer)).toBe(false);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h38ReviewQuestion(`H38-L0${i + 1}`, round + 24).stem).toEqual(
          q.stem,
        );
        expect(h38ReviewQuestion(`H38-L0${i + 1}`, round + 24).id).not.toBe(
          q.id,
        );
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h38ReviewQuestion('H38-L01', n)).toThrow();
    for (const id of ['H38-L00', 'H38-L06', 'H33-L01'])
      expect(() => h38ReviewQuestion(id, 0)).toThrow();
    expect(h38ReviewQuestion('H38-L05', 100000).id).toBe('H38-L05-R100000');
  });
});
