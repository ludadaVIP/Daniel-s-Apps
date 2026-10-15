import { describe, it, expect } from 'vitest';
import {
  j74Lessons,
  j74CheckQuestions,
  j74ReviewQuestion,
} from './content/J74';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  turnPoint,
  pointDistance,
  intersectionAngles,
  transversalAngles,
  triangleAngles,
  triangleFromAngles,
  triangleSides,
  thirdSideInterval,
  proofSelection,
  checkGeometryClass,
  type PlanePoint,
} from './planeModels';
const markdown = import.meta.glob('../../../content/lessons/J74-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j74Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j74CheckQuestions,
];
const measured = (o: PlanePoint, a: PlanePoint, b: PlanePoint) =>
  (Math.acos(
    Math.max(
      -1,
      Math.min(
        1,
        ((a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)) /
          (Math.hypot(a.x - o.x, a.y - o.y) * Math.hypot(b.x - o.x, b.y - o.y)),
      ),
    ),
  ) *
    180) /
  Math.PI;
describe('J74 plane geometry, conditions and authored reasoning', () => {
  it('registers six exact planned titles, backwards prerequisites and two bilingual examples each', () => {
    const registry = curriculum.flatMap((s) =>
        s.units.flatMap((u) => u.lessons),
      ),
      planned = curriculum.flatMap((s) => s.units).find((u) => u.id === 'J74')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j74Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J74.questions).toHaveLength(8);
    for (const l of j74Lessons) {
      expect(l.stage).toBe('J07');
      expect(l.contentStatus).toBe('ready');
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      expect(reviewQuestionFor(l.id, 0)).toEqual(j74ReviewQuestion(l.id, 0));
    }
  });
  it('checks 56 unique bilingual items, preserving eleven human-reviewed arguments', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    for (const [kind, count] of Object.entries({
      number: 25,
      'geometry-class': 13,
      choice: 7,
      explain: 11,
    }))
      expect(all.filter((q) => q.answer.kind === kind)).toHaveLength(count);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(
          checkAnswer('looks parallel, triangle sum', q.answer),
        ).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
    expect(
      j74Lessons[5]!.questions.filter((q) => q.answer.kind === 'explain'),
    ).toHaveLength(3);
    expect(j74Lessons[5]!.guided.answer.kind).toBe('explain');
    expect(j74Lessons[5]!.exit.answer.kind).toBe('explain');
  });
  it('independently transcribes all 38 constructed results and seven selected choices', () => {
    const expected = [
      ['1', '射线', '直线', '60', '线段', '45'],
      ['42', '138', '68', '30', '90', '142.5'],
      ['65', '115', '无法确定', '平行', '35', '20'],
      ['65', '58', '71', '75', '30', '60.5'],
      [
        '直角三角形',
        '等边三角形',
        '等腰三角形',
        '不能构成三角形',
        '7',
        '钝角三角形',
      ],
      [null, '65', null, null, '40', null],
    ];
    j74Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) => {
        const v = expected[i]![j];
        if (v !== null) expect(checkAnswer(v!, q.answer), q.id).toBe(true);
        else expect(q.answer.kind).toBe('explain');
      });
      expect(l.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String([1, 2, 0, 2, 1, 0][i]),
      });
    });
    ['ray', '58', 'undetermined', '75', 'obtuse', '6'].forEach((s, i) =>
      expect(checkAnswer(s, j74CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j74CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '0',
    });
  });
  it('keeps geometric definitions as bounded labels without pretending to grade prose', () => {
    for (const s of ['line segment', '线段', 'SEGMENT'])
      expect(checkGeometryClass(s, 'segment')).toBe(true);
    for (const s of ['not enough information', '无法确定', 'undetermined'])
      expect(checkGeometryClass(s, 'undetermined')).toBe(true);
    expect(checkGeometryClass('isosceles', 'equilateral')).toBe(false);
    expect(
      checkGeometryClass(
        'I think it is parallel because it looks so',
        'parallel',
      ),
    ).toBe(false);
    expect(checkGeometryClass('no solution', 'impossible')).toBe(false);
  });
  it('preserves turn angles under 36 rotations and three drawn lengths', () => {
    const o = { x: 23, y: -11 };
    for (let rotation = -180; rotation < 180; rotation += 10)
      for (const length of [10, 70, 125])
        for (const angle of [10, 45, 90, 120, 170]) {
          const a = turnPoint(o, rotation, length),
            b = turnPoint(o, rotation + angle, length);
          expect(pointDistance(o, a)).toBeCloseTo(length, 10);
          expect(measured(o, a, b)).toBeCloseTo(angle, 9);
        }
  });
  it('verifies every integral intersection angle and transversal condition independently', () => {
    for (let a = 1; a < 180; a++) {
      const v = intersectionAngles(a);
      expect(v[0]).toBe(v[2]);
      expect(v[1]).toBe(v[3]);
      expect(v[0] + v[1]).toBe(180);
      expect(v.reduce((s, n) => s + n, 0)).toBe(360);
      const p = transversalAngles(a, a, true);
      expect(p.angles[0]).toBe(p.angles[4]);
      expect(p.angles[2]).toBe(p.angles[4]);
      expect(p.angles[3]! + p.angles[4]!).toBe(180);
    }
    const x = transversalAngles(65, 45, false);
    expect(x.angles[4]).toBe(45);
    expect(x.tilt).toBe(20);
    expect(() => transversalAngles(65, 45, true)).toThrow();
  });
  it('constructs triangle vertices whose measured angles match all valid five-degree angle pairs', () => {
    let count = 0;
    for (let a = 10; a <= 160; a += 5)
      for (let b = 10; b <= 160; b += 5) {
        if (a + b >= 180) continue;
        count++;
        const m = triangleFromAngles(a, b),
          [A, B, C] = m.points;
        expect(measured(A, B, C)).toBeCloseTo(a, 8);
        expect(measured(B, A, C)).toBeCloseTo(b, 8);
        expect(measured(C, A, B)).toBeCloseTo(180 - a - b, 8);
        expect(
          Math.abs((B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x)),
        ).toBeGreaterThan(0);
      }
    expect(count).toBeGreaterThan(400);
    expect(triangleAngles(45, 45).kind).toBe('right');
    expect(triangleAngles(40, 40).kind).toBe('obtuse');
    expect(triangleAngles(60, 60).kind).toBe('acute');
  });
  it('checks all 1–12 integer side triples for strict existence, actual side distances and inclusive isosceles membership', () => {
    for (let a = 1; a <= 12; a++)
      for (let b = 1; b <= 12; b++)
        for (let c = 1; c <= 12; c++) {
          const m = triangleSides(a, b, c),
            valid = a + b > c && a + c > b && b + c > a;
          expect(m.valid).toBe(valid);
          if (m.valid) {
            const [A, B, C] = m.points;
            expect(pointDistance(B, C)).toBeCloseTo(a, 8);
            expect(pointDistance(A, C)).toBeCloseTo(b, 8);
            expect(pointDistance(A, B)).toBeCloseTo(c, 8);
            expect(m.kind).toBe(
              a === b && b === c
                ? 'equilateral'
                : a === b || a === c || b === c
                  ? 'isosceles'
                  : 'scalene',
            );
            expect(m.isosceles).toBe(a === b || a === c || b === c);
            expect(m.angles.reduce((s, n) => s + n, 0)).toBeCloseTo(180, 9);
          } else {
            expect(m.kind).toBe('impossible');
            expect(m.points).toBeNull();
          }
        }
  });
  it('excludes both interval endpoints and independently enumerates integer third sides', () => {
    for (let a = 1; a <= 12; a++)
      for (let b = 1; b <= 12; b++) {
        const m = thirdSideInterval(a, b),
          allowed = Array.from({ length: a + b + 1 }, (_, i) => i).filter(
            (c) => c > 0 && a + b > c && a + c > b && b + c > a,
          );
        expect(m.lower).toBe(Math.abs(a - b));
        expect(m.upper).toBe(a + b);
        expect(m.minInteger).toBe(allowed[0]);
        expect(m.maxInteger).toBe(allowed.at(-1));
        expect(triangleSides(a, b, a + b).valid).toBe(false);
        if (a !== b)
          expect(triangleSides(a, b, Math.abs(a - b)).valid).toBe(false);
      }
    expect(thirdSideInterval(2.5, 5)).toEqual({
      lower: 2.5,
      upper: 7.5,
      minInteger: 3,
      maxInteger: 7,
    });
  });
  it('checks proof prerequisites without accepting appearance, circularity or a partial set', () => {
    expect(proofSelection(0, ['straight', 'subtract'])).toBe(true);
    expect(proofSelection(0, ['vertical'])).toBe(false);
    expect(proofSelection(0, ['straight'])).toBe(false);
    expect(proofSelection(0, ['straight', 'subtract', 'appearance'])).toBe(
      false,
    );
    expect(proofSelection(1, ['parallel'])).toBe(true);
    expect(proofSelection(2, ['insufficient'])).toBe(true);
    expect(proofSelection(2, ['parallel'])).toBe(false);
    expect(proofSelection(3, ['triangle'])).toBe(true);
    expect(() => proofSelection(0, ['straight', 'straight'])).toThrow();
  });
  it('independently evaluates 400 automatic retrievals and keeps 80 written-reason retrievals human reviewed', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const id = `J74-L0${i + 1}`,
          q = j74ReviewQuestion(id, k),
          a = 20 + (k % 61),
          b = 25 + (Math.floor(k / 5) % 41);
        if (i === 5) {
          expect(q.answer.kind).toBe('explain');
          expect(checkAnswer(String(180 - a), q.answer)).toBeNull();
          expect(q.solution.en).toContain(`F=${180 - a}°`);
        } else {
          const expected =
            i === 0
              ? String(a + 10 + (k % 31))
              : i === 1
                ? String(180 - a)
                : i === 2
                  ? k % 3 === 0
                    ? 'undetermined'
                    : String(a)
                  : i === 3
                    ? String(180 - a - b)
                    : k % 2 === 0
                      ? 'impossible'
                      : 'scalene';
          expect(checkAnswer(expected, q.answer), `${id}/${k}`).toBe(true);
          for (const s of q.answerChecks!.accepted)
            expect(checkAnswer(s, q.answer)).toBe(true);
          for (const s of q.answerChecks!.rejected)
            expect(checkAnswer(s, q.answer)).toBe(false);
        }
        expect(j74ReviewQuestion(id, k + 80).answer).toEqual(q.answer);
      }
  });
  it('rejects nonfinite, degenerate and out-of-contract model data and invalid retrieval identifiers', () => {
    for (const n of [0, 180, -1, NaN, Infinity])
      expect(() => intersectionAngles(n)).toThrow();
    for (const pair of [
      [90, 90],
      [0, 60],
      [60, -2],
      [100, 85],
    ])
      expect(() => triangleFromAngles(pair[0]!, pair[1]!)).toThrow();
    for (const v of [0, -1, NaN, Infinity, 100001])
      expect(() => triangleSides(3, 4, v)).toThrow();
    expect(() => thirdSideInterval(0, 3)).toThrow();
    expect(() => turnPoint({ x: 0, y: 0 }, NaN, 3)).toThrow();
    expect(() => turnPoint({ x: 0, y: 0 }, 30, -1)).toThrow();
    for (const id of ['J74-L00', 'J74-L07', 'J73-L01'])
      expect(() => j74ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j74ReviewQuestion('J74-L01', n)).toThrow();
  });
});
