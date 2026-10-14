import { describe, it, expect } from 'vitest';
import {
  b05Lessons,
  b05CheckQuestions,
  b05ReviewQuestion,
} from './content/B05';
import { lessons, curriculum } from './content';
import { checkAnswer, type AnswerSpec } from './model';
import {
  rulerLength,
  rectangleBoundary,
  fullTiles,
  tileCoverage,
  rotateCoverage,
  angleGeometry,
  angleKind,
  barGeometry,
} from './measurementModels';
const markdown = import.meta.glob('../../../content/lessons/B05-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...b05Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...b05CheckQuestions,
];
describe('B05 complete teaching content', () => {
  it('matches the five planned lessons with bilingual worked examples and genuine support paths', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'B05')!;
    expect(b05Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(b05Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of b05Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(l.questions.some((q) => q.answer.kind === 'explain')).toBe(true);
      for (const copy of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh).toBeTruthy();
        expect(copy.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const prior = [...lessons, ...b05Lessons].find((p) => p.id === id);
        expect(prior, `${l.id}: ${id}`).toBeTruthy();
        if (prior!.unit === 'B05') expect(prior!.order).toBeLessThan(l.order!);
      }
    }
    expect(b05Lessons[4]!.familyChallenge!.en).toContain('ten cards');
  });
  it('checks all 48 answers, meaningful wrong units, explanations and two hint levels', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.id)).size).toBe(48);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(questions.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      6,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags!.length).toBeGreaterThan(0);
      for (const copy of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain')
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      else {
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
        );
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently derives every numeric result from endpoints, sides, cells, turns or categories', () => {
    const oracle: Record<string, number> = {
      'B05-L01-G': 10 - 3,
      'B05-L01-Q2': 4 * 10,
      'B05-L01-Q3': 11 - 3,
      'B05-L01-Q4': 750 / 10,
      'B05-L01-Q5': 1500 / 1000,
      'B05-L01-X': 2 * 100 + 35,
      'B05-L02-G': 8 + 5 + 8 + 5,
      'B05-L02-Q2': 6 * 4,
      'B05-L02-Q3': 5 + 6 + 7,
      'B05-L02-Q4': 30 / 2 - 9,
      'B05-L02-Q5': 4 + 3 + 4 + 3,
      'B05-L02-X': 9 + 4 + 9 + 4,
      'B05-L03-G': 6 * 4,
      'B05-L03-Q2': 3 * 4,
      'B05-L03-Q3': 3 + 3 + 1,
      'B05-L03-Q4': 4 * 3,
      'B05-L03-Q5': 8 * 3,
      'B05-L03-X': 5 * 3,
      'B05-L04-G': 360 / 4,
      'B05-L04-Q2': 45 + 45,
      'B05-L04-Q3': 0,
      'B05-L04-Q4': 3,
      'B05-L04-Q5': 60,
      'B05-L04-X': 360 / 2,
      'B05-L05-G': 10,
      'B05-L05-Q2': 8 + 6 + 10,
      'B05-L05-Q3': 10 - 8,
      'B05-L05-Q4': 4 + 0 + 6,
      'B05-L05-Q5': 10,
      'B05-L05-X': 12 + 8,
      'B05-CHECK-Q1': 13 - 5,
      'B05-CHECK-Q2': 3 * 100 + 40,
      'B05-CHECK-Q3': 7 + 4 + 7 + 4,
      'B05-CHECK-Q4': 3 + 3 + 3 + 1,
      'B05-CHECK-Q6': 360 / 2,
      'B05-CHECK-Q7': 12 - 4,
    };
    const numeric = questions.filter((q) => q.answer.kind === 'number');
    expect(numeric.map((q) => q.id).sort()).toEqual(Object.keys(oracle).sort());
    numeric.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
    expect(checkAnswer('9000%', b05Lessons[3]!.guided.answer)).toBe(false);
  });
  it('verifies 400 review evaluations including zero length, missing sides, gaps and category differences', () => {
    for (let k = 0; k < 80; k++)
      for (const l of b05Lessons) {
        const q = b05ReviewQuestion(l.id, k);
        let expected: number;
        if (l.order === 1)
          expected =
            k % 3 === 0
              ? (1 + (k % 18)) * 10
              : k % 3 === 1
                ? k % 19
                : (1 + (k % 4)) * 100 + 5 + (k % 90);
        else if (l.order === 2)
          expected =
            k % 2
              ? 2 + (Math.floor(k / 9) % 9)
              : 2 * (2 + (k % 9) + (2 + (Math.floor(k / 9) % 9)));
        else if (l.order === 3)
          expected =
            (2 + (k % 7)) * (2 + (Math.floor(k / 7) % 7)) -
            (k % 2 ? 1 + (k % 3) : 0);
        else if (l.order === 4)
          expected =
            k % 3 === 0
              ? 45 + 15 * (k % 7)
              : k % 3 === 1
                ? [45, 90, 120, 180][k % 4]!
                : [3, 4, 4, 0][k % 4]!;
        else {
          const a = 4 + (k % 13),
            b = 1 + (Math.floor(k / 6) % 10),
            c = 2 + (Math.floor(k / 3) % 16);
          expected =
            k % 3 === 0 ? a + b + c : k % 3 === 1 ? Math.abs(a - c) : a + c;
        }
        expect(checkAnswer(String(expected), q.answer), q.id).toBe(true);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(false),
        );
      }
    expect(() => b05ReviewQuestion('B05-L01', 0.5)).toThrow();
    expect(() => b05ReviewQuestion('missing', 0)).toThrow();
  });
});
describe('units and honest geometric representations', () => {
  it.each([
    ['mm', ['40 mm', '40 millimetres', '40毫米'], ['40 cm', '40 m²']],
    ['cm', ['40 cm', '40 centimetres', '40厘米'], ['40 mm', '40 cm²']],
    [
      'cm²',
      ['40 cm²', '40 cm^2', '40 square centimetres', '40平方厘米'],
      ['40 cm', '40 m²'],
    ],
    [
      'm²',
      ['40 m²', '40 m^2', '40 square metres', '40平方米'],
      ['40 m', '40 cm²'],
    ],
    ['°', ['40°', '40 degrees', '40度'], ['40 cm', '40°C']],
    ['people', ['40 people', '40人', '40 persons'], ['40 cm', '40%']],
  ] as const)(
    'accepts %s aliases while rejecting other dimensions',
    (unit, good, bad) => {
      const answer: AnswerSpec = { kind: 'number', value: '40', unit };
      good.forEach((a) => expect(checkAnswer(a, answer), a).toBe(true));
      bad.forEach((a) => expect(checkAnswer(a, answer), a).toBe(false));
    },
  );
  it('subtracts nonzero endpoints and preserves the same length on a different unit scale', () => {
    expect(rulerLength(30, 100)).toMatchObject({ mm: 70, cm: 7, metres: 0.07 });
    expect(rulerLength(70, 140).mm).toBe(rulerLength(0, 70).mm);
    expect(rulerLength(30, 30).mm).toBe(0);
    expect(() => rulerLength(50, 30)).toThrow();
    expect(() => rulerLength(-1, 40)).toThrow();
  });
  it('forms one continuous closed perimeter without reusing or omitting unit segments', () => {
    for (let w = 1; w <= 12; w++)
      for (let h = 1; h <= 12; h++) {
        const m = rectangleBoundary(w, h);
        expect(m.perimeter).toBe(2 * w + 2 * h);
        expect(
          new Set(m.segments.map((s) => `${s.x1},${s.y1},${s.x2},${s.y2}`))
            .size,
        ).toBe(m.perimeter);
        m.segments.forEach((s, i) => {
          expect(Math.abs(s.x2 - s.x1) + Math.abs(s.y2 - s.y1)).toBe(1);
          const next = m.segments[(i + 1) % m.segments.length]!;
          expect([s.x2, s.y2]).toEqual([next.x1, next.y1]);
        });
      }
    expect(rectangleBoundary(8, 5).perimeter).toBe(
      rectangleBoundary(7, 6).perimeter,
    );
    expect(rectangleBoundary(8, 5).area).not.toBe(rectangleBoundary(7, 6).area);
  });
  it('rotates every filled cell bijectively, keeps gaps and gives an empty coverage zero area', () => {
    for (const [w, h, selected] of [
      [6, 4, fullTiles(6, 4)],
      [3, 3, [0, 1, 2, 3, 4, 5, 6]],
      [10, 1, [0, 5, 9]],
      [2, 7, []],
    ] as const) {
      let current: { width: number; height: number; selected: number[] } = {
        width: w,
        height: h,
        selected: [...selected],
      };
      const original = tileCoverage(w, h, [...selected]);
      for (let i = 0; i < 4; i++) {
        current = rotateCoverage(
          current.width,
          current.height,
          current.selected,
        );
        expect(
          tileCoverage(current.width, current.height, current.selected).area,
        ).toBe(original.area);
      }
      expect(current.selected).toEqual([...selected].sort((a, b) => a - b));
      expect(current.width).toBe(w);
      expect(current.height).toBe(h);
    }
    expect(tileCoverage(3, 3, [0, 1, 2, 3, 4, 5, 6])).toMatchObject({
      area: 7,
      full: false,
      rows: [3, 3, 1],
    });
    expect(() => tileCoverage(3, 3, [0, 0])).toThrow();
    expect(() => tileCoverage(3, 3, [9])).toThrow();
  });
  it('preserves the measured opening under length changes and rotation, including zero and straight boundaries', () => {
    expect([0, 1, 89, 90, 91, 179, 180].map(angleKind)).toEqual([
      'zero',
      'acute',
      'acute',
      'right',
      'obtuse',
      'obtuse',
      'straight',
    ]);
    for (const theta of [0, 45, 90, 120, 180])
      for (const length of [40, 110, 130])
        for (const rotation of [0, 45, 90, 270, 359]) {
          const m = angleGeometry(theta, length, rotation),
            a = { x: m.first.x - 200, y: m.first.y - 170 },
            b = { x: m.second.x - 200, y: m.second.y - 170 };
          expect(Math.hypot(a.x, a.y)).toBeCloseTo(length, 9);
          expect(Math.hypot(b.x, b.y)).toBeCloseTo(length, 9);
          const measured =
            (Math.atan2(
              Math.abs(a.x * b.y - a.y * b.x),
              a.x * b.x + a.y * b.y,
            ) *
              180) /
            Math.PI;
          expect(measured).toBeCloseTo(theta, 8);
        }
    expect(() => angleGeometry(181, 100, 0)).toThrow();
  });
  it('maps bar heights to the same values under changing tick density and axis maximum, with zero truly zero', () => {
    const a = barGeometry([8, 6, 10], 20, 2),
      b = barGeometry([8, 6, 10], 20, 5),
      c = barGeometry([8, 6, 10], 40, 5);
    expect(a.heights).toEqual(b.heights);
    expect(c.heights).toEqual(a.heights.map((h) => h / 2));
    expect(a.total).toBe(24);
    expect(c.total).toBe(24);
    expect(a.ticks[0]).toBe(0);
    expect(c.ticks.at(-1)).toBe(40);
    expect(barGeometry([4, 0, 6], 20, 2).heights[1]).toBe(0);
    expect(() => barGeometry([8], 0, 1)).toThrow();
    expect(() => barGeometry([21], 20, 2)).toThrow();
    expect(() => barGeometry([], 20, 2)).toThrow();
  });
});
