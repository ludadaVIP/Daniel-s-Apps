import { describe, it, expect } from 'vitest';
import {
  p56Lessons,
  p56CheckQuestions,
  p56ReviewQuestion,
} from './content/P56';
import { lessons, curriculum, reviewQuestionFor, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  convertGeometryUnit,
  conversionText,
  rectangleArea,
  triangleRearrangement,
  parallelogramCut,
  trapezoidRearrangement,
  polygonArea,
  cuboid,
  cuboidNet,
  unitTiling,
  type Point,
  type GeoUnit,
} from './geometryModels';

const markdown = import.meta.glob('../../../content/lessons/P56-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...p56Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p56CheckQuestions,
];
// Hand calculations transcribed from the authored stems, independent of workshop models.
// Each row: guided, Q2, Q3, Q4, Q5, exit.
const answers = [
  [250, 12000, 3000, 2.5, 600, 2000],
  [24, 25, 3, 2, 5, 2.4],
  [12, 7.5, 20, 0.15, 6, 18],
  [24, 24, 20, 19.5, 7, 40],
  [24, 27, 60, 0.06, 3, 24],
  [52, 40, 54, 62, 58, 5.5],
];
const numericValue = (raw: string) => {
  const [n, d = '1'] = raw.split('/');
  return Number(n) / Number(d);
};
// Independent fan triangulation, rather than the implementation's shoelace sum.
const area = (ps: Point[]) =>
  Math.abs(
    ps.slice(1, -1).reduce((sum, p, i) => {
      const a = ps[0]!,
        b = ps[i + 2]!;
      return (
        sum +
        ((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) / 2
      );
    }, 0),
  );
const inside = (p: Point, ps: Point[]) => {
  let result = false;
  for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
    const a = ps[i]!,
      b = ps[j]!;
    if (
      a[1] > p[1] !== b[1] > p[1] &&
      p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      result = !result;
  }
  return result;
};

describe('P56 publication and authored mathematics', () => {
  it('publishes six planned lessons with bilingual explanations, two examples and backward prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P56')!;
    expect(p56Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(lessons.filter((l) => l.unit === 'P56')).toHaveLength(6);
    expect(new Set(p56Lessons.map((l) => l.lab)).size).toBe(6);
    expect(unitChecks.P56.questions).toHaveLength(8);
    for (const l of p56Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
      for (const copy of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.keywords,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh).toBeTruthy();
        expect(copy.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const previous = lessons.find((p) => p.id === id)!;
        expect(previous, `${l.id} → ${id}`).toBeTruthy();
        if (previous.unit === 'P56')
          expect(previous.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const allPlanned = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(allPlanned).toHaveLength(358);
    expect(
      allPlanned
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p56Lessons[5]!.familyChallenge!.en).toContain(
      'no cutting or purchase',
    );
  });
  it('checks 56 unique items including unit rejection, equivalence and manual explanations', () => {
    expect(questions).toHaveLength(56);
    expect(new Set(questions.map((q) => q.id)).size).toBe(56);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      42,
    );
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      7,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags).toContain(q.skill);
      for (const copy of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      } else {
        for (const value of q.answerChecks!.accepted)
          expect(checkAnswer(value, q.answer), `${q.id} accepts ${value}`).toBe(
            true,
          );
        for (const value of q.answerChecks!.rejected)
          expect(checkAnswer(value, q.answer), `${q.id} rejects ${value}`).toBe(
            false,
          );
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently verifies every authored numeric answer from the original quantities', () => {
    p56Lessons.forEach((l, i) => {
      const items = [
        l.guided,
        ...l.questions.filter((q) => q.answer.kind === 'number'),
        l.exit,
      ];
      expect(items).toHaveLength(6);
      items.forEach((q, j) => {
        expect(q.answer.kind).toBe('number');
        if (q.answer.kind === 'number')
          expect(numericValue(q.answer.value), q.id).toBeCloseTo(
            answers[i]![j]!,
            10,
          );
      });
    });
    const checkValues = [400, 40, 17.5, 30, 30, 47];
    p56CheckQuestions
      .filter((q) => q.answer.kind === 'number')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(numericValue(q.answer.value)).toBe(checkValues[i]);
      });
  });
  it('supports bilingual cubic and capacity units while refusing a different dimension', () => {
    const volume = p56Lessons[4]!.guided.answer,
      surface = p56Lessons[5]!.guided.answer;
    for (const s of [
      '24 cm³',
      '24 cm^3',
      '24 cubic centimetres',
      '24 立方厘米',
      '48/2',
    ])
      expect(checkAnswer(s, volume)).toBe(true);
    for (const s of ['24 cm²', '24 cm', '24 m³', '2400%', '0/0'])
      expect(checkAnswer(s, volume)).toBe(false);
    for (const s of ['52 平方厘米', '52 cm2', '52 square centimetres'])
      expect(checkAnswer(s, surface)).toBe(true);
    expect(checkAnswer('24 升', p56Lessons[4]!.exit.answer)).toBe(true);
    expect(checkAnswer('60 毫升', p56Lessons[4]!.questions[2]!.answer)).toBe(
      true,
    );
  });
  it('independently checks 80 rounds per lesson, changed variants and invalid requests', () => {
    const factors: Record<GeoUnit, number> = {
      mm: 0.1,
      cm: 1,
      dm: 10,
      m: 100,
      km: 100000,
      'cm²': 1,
      'dm²': 100,
      'm²': 10000,
      'cm³': 1,
      'dm³': 1000,
      'm³': 1000000,
      L: 1000,
      mL: 1,
    };
    const conversions: [GeoUnit, GeoUnit][] = [
      ['m', 'cm'],
      ['cm', 'm'],
      ['m²', 'cm²'],
      ['cm²', 'm²'],
      ['m³', 'cm³'],
      ['L', 'mL'],
      ['cm³', 'L'],
      ['mL', 'cm³'],
    ];
    for (let k = 0; k < 80; k++)
      for (let index = 0; index < 6; index++) {
        const l = p56Lessons[index]!,
          q = p56ReviewQuestion(l.id, k);
        const w = 2 + (k % 5),
          d = 2 + (Math.floor(k / 5) % 4),
          h = 2 + (Math.floor(k / 20) % 4);
        const [from, to] = conversions[k % 8]!;
        const expected = [
          (((1 + Math.floor(k / 8)) / 4) * factors[from]) / factors[to],
          w * d,
          (w * d) / 2,
          k % 2 ? ((w + d) * h) / 2 : w * h,
          w * d * h,
          2 * (w * d + w * h + d * h) - (k % 2 ? w * d : 0),
        ][index]!;
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(numericValue(q.answer.value), q.id).toBeCloseTo(expected, 10);
        for (const v of q.answerChecks!.accepted)
          expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(true);
        for (const v of q.answerChecks!.rejected)
          expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const l of p56Lessons) {
      expect(p56ReviewQuestion(l.id, 0).stem).not.toEqual(
        p56ReviewQuestion(l.id, 1).stem,
      );
      for (const n of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
        expect(() => p56ReviewQuestion(l.id, n)).toThrow();
    }
    expect(() => p56ReviewQuestion('P56-L99', 0)).toThrow();
  });
});

describe('P56 invariant geometry', () => {
  it('converts exact lengths, areas and volumes reversibly while retaining dimensions', () => {
    const cases: [string, GeoUnit, GeoUnit, string][] = [
      ['1', 'm²', 'cm²', '10000'],
      ['0.003', 'm³', 'cm³', '3000'],
      ['2.5', 'm', 'cm', '250'],
      ['1/3', 'L', 'cm³', '1000/3'],
      ['0.6', 'L', 'mL', '600'],
      ['1000', 'mL', 'dm³', '1'],
      ['0', 'cm³', 'L', '0'],
    ];
    for (const [raw, from, to, expected] of cases) {
      expect(conversionText(convertGeometryUnit(raw, from, to))).toBe(expected);
      const back = convertGeometryUnit(expected, to, from);
      expect(numericValue(conversionText(back))).toBeCloseTo(
        numericValue(raw),
        12,
      );
    }
    expect(unitTiling(3)).toMatchObject({
      visible: 100,
      layers: 10,
      count: 1000,
    });
    for (const [a, b] of [
      ['cm²', 'cm'],
      ['cm³', 'cm²'],
      ['L', 'm'],
    ] as [GeoUnit, GeoUnit][])
      expect(() => convertGeometryUnit('1', a, b)).toThrow();
    for (const raw of ['-1', '0/0', 'NaN', '20%'])
      expect(() => convertGeometryUnit(raw, 'm', 'cm')).toThrow();
  });
  it('preserves exact polygon partitions through left and right cuts with no gaps or overlaps', () => {
    for (const b of [1, 3, 6, 12])
      for (const h of [1, 3, 10])
        for (let shift = -b; shift <= b; shift++) {
          const m = parallelogramCut(b, h, shift);
          expect(area(m.original)).toBe(b * h);
          expect(area(m.cut) + area(m.remaining)).toBe(b * h);
          expect(area(m.moved)).toBe(area(m.cut));
          expect(polygonArea(m.rectangle)).toBe(area(m.rectangle));
          // Offset probes avoid integer boundaries. Verify membership, not only summed area.
          for (let y = 0.37; y < h; y += 0.73)
            for (let x = -b + 0.19; x < 3 * b; x += 0.83) {
              const p: Point = [x, y];
              expect(
                Number(inside(p, m.cut)) + Number(inside(p, m.remaining)),
              ).toBe(Number(inside(p, m.original)));
              expect(
                Number(inside(p, m.moved)) + Number(inside(p, m.remaining)),
              ).toBe(Number(inside(p, m.rectangle)));
            }
        }
  });
  it('pairs all allowed triangle apex positions and trapezoid bases into the claimed parallelogram', () => {
    for (const b of [1, 5, 12])
      for (let apex = -b; apex <= 2 * b; apex++) {
        const m = triangleRearrangement(b, 3, apex);
        expect(area(m.original)).toBe((b * 3) / 2);
        expect(area(m.first)).toBe(area(m.original));
        expect(area(m.second)).toBe(area(m.first));
        expect(area(m.pair.original)).toBe(area(m.first) + area(m.second));
        expect(m.mirror).toBe(apex > b);
      }
    for (const a of [1, 5, 12])
      for (const b of [1, 5, 12])
        for (const shift of [-b, 0, b]) {
          const m = trapezoidRearrangement(a, b, 3, shift);
          expect(area(m.first)).toBe(((a + b) * 3) / 2);
          expect(area(m.first) + area(m.second)).toBe(area(m.pair.original));
          expect(m.isParallelogram).toBe(a === b);
        }
  });
  it('counts complete cube layers and tiles each net with distinct cells and valid bounds', () => {
    for (let w = 1; w <= 6; w++)
      for (let d = 1; d <= 6; d++)
        for (let h = 1; h <= 6; h++) {
          const solid = cuboid(w, d, h);
          const positions = new Set(
            solid.cubes.map((c) => `${c.x},${c.y},${c.z}`),
          );
          expect(positions.size).toBe(w * d * h);
          for (let z = 0; z < h; z++)
            expect(solid.cubes.filter((c) => c.z === z)).toHaveLength(w * d);
          for (const lid of [true, false]) {
            const net = cuboidNet(w, d, h, lid),
              cells = new Set<string>();
            for (const f of net.faces)
              for (let x = 0; x < f.w; x++)
                for (let y = 0; y < f.h; y++) {
                  const key = `${f.x + x},${f.y + y}`;
                  expect(cells.has(key)).toBe(false);
                  cells.add(key);
                  expect(f.x + x).toBeLessThan(net.bounds.width);
                  expect(f.y + y).toBeGreaterThanOrEqual(net.bounds.y);
                  expect(f.y + y).toBeLessThan(
                    net.bounds.y + net.bounds.height,
                  );
                }
            expect(cells.size).toBe(
              w * d + 2 * w * h + 2 * d * h + (lid ? w * d : 0),
            );
            expect(net.surface).toBe(cells.size);
            expect(net.faces).toHaveLength(lid ? 6 : 5);
          }
        }
    expect(cuboidNet(4, 3, 2).bounds).toMatchObject({
      width: 14,
      height: 8,
      area: 112,
    });
    expect(rectangleArea(6, 4)).toMatchObject({ area: 24, perimeter: 20 });
    for (const fn of [
      () => cuboid(0, 2, 3),
      () => rectangleArea(1.5, 4),
      () => triangleRearrangement(3, 4, 7),
      () => parallelogramCut(3, 4, 4),
      () => cuboidNet(9, 2, 3),
    ])
      expect(fn).toThrow();
  });
});
