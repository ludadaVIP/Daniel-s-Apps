import { describe, it, expect } from 'vitest';
import {
  p66Lessons,
  p66CheckQuestions,
  p66ReviewQuestion,
} from './content/P66';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  piCoefficient,
  circleMeasures,
  circleParts,
  simulatedPiReading,
  measuredPiRatio,
  sectorRearrangement,
  sectorCounts,
  cylinderMeasures,
} from './circleModels';
const markdown = import.meta.glob('../../../content/lessons/P66-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p66Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p66CheckQuestions,
];
const value = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
const coefficient = (s: string) => {
  const r = piCoefficient(s)!;
  return Number(r[0]) / Number(r[1]);
};
describe('P66 authored circles and spatial measurement', () => {
  it('publishes the five planned bilingual lessons with two examples per language and valid prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P66')!;
    expect(p66Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(p66Lessons.map((l) => l.lab)).size).toBe(5);
    expect(unitChecks.P66.questions).toHaveLength(8);
    for (const l of p66Lessons) {
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1400);
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
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        if (p.unit === 'P66') expect(p.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(all).toHaveLength(358);
    expect(
      all
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p66Lessons[4]!.familyChallenge!.en).toContain(
      'No cutting rigid cans',
    );
  });
  it('checks all 48 items, exact and approximate conventions, units and manual evidence', () => {
    expect(items).toHaveLength(48);
    expect(new Set(items.map((q) => q.id)).size).toBe(48);
    expect(items.filter((q) => q.answer.kind === 'pi-multiple')).toHaveLength(
      14,
    );
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(22);
    expect(items.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
    for (const q of items) {
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
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(140);
      } else {
        expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      for (const option of q.options ?? []) {
        expect(option.feedback.zh).toBeTruthy();
        expect(option.feedback.en).toBeTruthy();
      }
    }
  });
  it('independently transcribes all constructed numeric/pi answers without reading stored standard answers', () => {
    const expected = [
      ['6', '5', '8', '1.5', '4', '9'],
      ['3.14', '3.15', '3', '3.14', '3.14', '3.1'],
      ['10pi', '25.12', '8pi', '18.84', '12pi', '5'],
      ['9pi', '50.24', '16pi', '4', '36pi', '12.56'],
      ['28pi', '20pi', '20pi', '24pi', '62.8', '50.24'],
    ];
    p66Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    ['8', '3.15', '6pi', '25pi', '36pi', '1', '33pi'].forEach((s, i) =>
      expect(checkAnswer(s, p66CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('31.4', p66Lessons[2]!.guided.answer)).toBe(false);
    expect(checkAnswer('10', p66Lessons[2]!.guided.answer)).toBe(false);
  });
  it('recognizes exact multiples of pi by rational coefficients and rejects rounded values and wrong dimensions', () => {
    const spec = {
      kind: 'pi-multiple' as const,
      value: '6π',
      coefficient: '6',
      unit: 'cm²' as const,
    };
    for (const s of [
      '6π',
      '6pi',
      '6*π',
      'π*6',
      '12π/2',
      '3π+3π',
      '(1/2)*12π',
      '6Π',
      '6pi cm2',
      '6π cm^2',
      '6π square centimeters',
      '6π平方厘米',
    ])
      expect(checkAnswer(s, spec), s).toBe(true);
    for (const s of [
      '6',
      '18.84',
      '6π cm',
      '6π cm³',
      '6π m²',
      '6π+1',
      '6π²',
      '6π*π',
      '6π/π',
      '6π/0',
      '6π=18.84',
      '6π%',
      '6x',
      'Math.PI*6',
      '6 π cm2 garbage',
    ])
      expect(checkAnswer(s, spec), s).toBe(false);
    expect(
      checkAnswer('pi/2', { ...spec, value: 'π/2', coefficient: '1/2' }),
    ).toBe(true);
    expect(
      checkAnswer('0.5π', { ...spec, value: 'π/2', coefficient: '1/2' }),
    ).toBe(true);
    expect(
      checkAnswer('18.84 cm', { kind: 'number', value: '18.84', unit: 'cm' }),
    ).toBe(true);
    expect(
      checkAnswer('6π', { kind: 'number', value: '18.84', unit: 'cm' }),
    ).toBe(false);
    for (const unit of ['cm', 'cm²', 'cm³'] as const)
      for (let n = 1; n <= 80; n++) {
        expect(
          checkAnswer(`${n * 2}π/2 ${unit}`, {
            kind: 'pi-multiple',
            coefficient: String(n),
            value: `${n}π`,
            unit,
          }),
        ).toBe(true);
        expect(
          checkAnswer(`${n + 1}π`, {
            kind: 'pi-multiple',
            coefficient: String(n),
            value: `${n}π`,
            unit,
          }),
        ).toBe(false);
      }
  });
  it('checks circle endpoints, distances, centre incidence and rotation independently', () => {
    for (let r = 1; r <= 6; r++)
      for (let angle = 0; angle <= 360; angle += 30)
        for (const offset of [-0.8, -0.5, 0, 0.5, 0.8]) {
          const m = circleParts(r, angle, offset),
            distance = (a: number[], b: number[]) =>
              Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
          expect(distance(m.radius, [0, 0])).toBeCloseTo(r, 10);
          expect(distance(m.diameter[0]!, m.diameter[1]!)).toBeCloseTo(
            2 * r,
            10,
          );
          for (const p of [...m.chord, ...m.diameter])
            expect(distance(p, [0, 0])).toBeCloseTo(r, 10);
          const midpoint = m.chord[0]!.map((v, i) => (v + m.chord[1]![i]!) / 2);
          expect(Math.hypot(...midpoint)).toBeCloseTo(Math.abs(offset) * r, 10);
          expect(m.isDiameter).toBe(offset === 0);
          expect(m.chordLength).toBeCloseTo(
            distance(m.chord[0]!, m.chord[1]!),
            10,
          );
          expect(m.chordLength).toBeLessThanOrEqual(2 * r + 1e-10);
        }
  });
  it('keeps simulated quantization and arbitrary measured quotients distinct from exact pi', () => {
    for (const d of [2, 4, 6, 8, 10, 20])
      for (const precision of [0.1, 1] as const) {
        const m = simulatedPiReading(d, precision);
        expect(Math.abs(m.c - Math.PI * d)).toBeLessThanOrEqual(
          precision / 2 + 1e-12,
        );
        expect(m.ratio).toBeCloseTo(m.c / d, 12);
        expect(m.c / precision).toBeCloseTo(Math.round(m.c / precision), 12);
      }
    expect(measuredPiRatio(4, 12.6)).toBe(3.15);
    expect(measuredPiRatio(6, 18)).toBe(3);
    expect(measuredPiRatio(4, 20)).toBe(5);
    expect(simulatedPiReading(4, 0.1).c).toBe(12.6);
    expect(simulatedPiReading(4, 1).c).toBe(13);
  });
  it('conserves sectors with true circular arcs while finite guide dimensions converge from below', () => {
    const polygonArea = (points: number[][]) =>
      Math.abs(
        points.reduce((sum, p, i) => {
          const q = points[(i + 1) % points.length]!;
          return sum + p[0]! * q[1]! - p[1]! * q[0]!;
        }, 0),
      ) / 2;
    for (const r of [1, 3, 6]) {
      let previousBase = 0,
        previousHeight = 0,
        previousArea = 0;
      for (const n of sectorCounts) {
        const m = sectorRearrangement(r, n);
        expect(m.pieces).toHaveLength(n);
        expect(new Set(m.pieces.map((p) => p.id)).size).toBe(n);
        expect(m.pieces.filter((p) => p.up)).toHaveLength(n / 2);
        expect(m.base).toBeGreaterThan(previousBase);
        expect(m.height).toBeGreaterThan(previousHeight);
        expect(m.guideArea).toBeGreaterThan(previousArea);
        expect(m.base).toBeLessThan(Math.PI * r);
        expect(m.height).toBeLessThan(r);
        expect(m.guideArea).toBeLessThan(Math.PI * r * r);
        let sampledArea = 0;
        for (const p of m.pieces) {
          const centerAngle = p.up ? -Math.PI / 2 : Math.PI / 2;
          const arc = Array.from({ length: 257 }, (_, j) => {
            const theta =
              centerAngle - Math.PI / n + (j * ((2 * Math.PI) / n)) / 256;
            return [
              p.apex[0] + r * Math.cos(theta),
              p.apex[1] + r * Math.sin(theta),
            ];
          });
          sampledArea += polygonArea([p.apex, ...arc]);
          for (const endpoint of [arc[0]!, arc[256]!])
            expect(
              Math.hypot(endpoint[0]! - p.apex[0], endpoint[1]! - p.apex[1]),
            ).toBeCloseTo(r, 10);
        }
        expect(sampledArea).toBeCloseTo(Math.PI * r * r, 3);
        expect(m.totalArea).toBeCloseTo(sampledArea, 3);
        expect(m.sectorArea * n).toBeCloseTo(m.totalArea, 10);
        previousBase = m.base;
        previousHeight = m.height;
        previousArea = m.guideArea;
      }
    }
  });
  it('independently counts cylinder faces, preserves net scale and separates volume from surface area', () => {
    for (let r = 1; r <= 6; r++)
      for (let h = 1; h <= 10; h++) {
        const base = r * r,
          side = 2 * r * h,
          results = ([0, 1, 2] as const).map((k) => cylinderMeasures(r, h, k));
        results.forEach((m, k) => {
          expect(m.surfaceCoefficient).toBe(
            [side, ...Array.from({ length: k }, () => base)].reduce(
              (a, b) => a + b,
              0,
            ),
          );
          expect(m.volumeCoefficient).toBe(
            Array.from({ length: h }, () => base).reduce((a, b) => a + b, 0),
          );
          expect(m.netWidth).toBeCloseTo(circleMeasures(r).c, 12);
          expect(m.netHeight).toBe(h);
        });
        expect(
          results[2]!.surfaceCoefficient - results[1]!.surfaceCoefficient,
        ).toBe(base);
        expect(new Set(results.map((m) => m.volumeCoefficient)).size).toBe(1);
      }
    expect(cylinderMeasures(2, 5, 2).surfaceCoefficient).toBe(28);
    expect(cylinderMeasures(2, 5, 1).surfaceCoefficient).toBe(24);
    expect(cylinderMeasures(2, 5, 0).volumeCoefficient).toBe(20);
    expect(circleMeasures(4).area / circleMeasures(2).area).toBe(4);
    expect(circleMeasures(4).c / circleMeasures(2).c).toBe(2);
  });
  it('independently verifies 400 review answers and their rejection examples', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = p66ReviewQuestion(p66Lessons[i]!.id, k),
          r = 1 + (k % 8),
          h = 1 + (Math.floor(k / 8) % 10);
        if (i === 0 && q.answer.kind === 'number')
          expect(value(q.answer.value)).toBe((1 + (k % 24)) / 2);
        else if (i === 1 && q.answer.kind === 'number') {
          const d = 2 * (1 + (k % 5)),
            C = Math.round(Math.PI * d * 10) / 10;
          expect(value(q.answer.value)).toBeCloseTo(C / d, 12);
        } else if (q.answer.kind === 'pi-multiple') {
          const expected =
            i === 2
              ? 2 * r
              : i === 3
                ? r * r
                : k % 2 === 1
                  ? r * r * h
                  : 2 * r * h + (k % 3) * r * r;
          expect(coefficient(q.answer.value)).toBe(expected);
          expect(q.answer.unit).toBe(
            i === 2 ? 'cm' : i === 4 && k % 2 === 1 ? 'cm³' : 'cm²',
          );
        } else throw new Error(q.id);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
    for (const n of [-1, 0.2, 100001, NaN])
      expect(() => p66ReviewQuestion('P66-L01', n)).toThrow();
    expect(() => p66ReviewQuestion('P66-L09', 0)).toThrow();
  });
  it('rejects undefined and out-of-domain geometry and measurements', () => {
    for (const v of [0, -1, NaN, Infinity, 51])
      expect(() => circleMeasures(v)).toThrow();
    expect(() => circleParts(2, 361, 0)).toThrow();
    expect(() => circleParts(2, 0, 0.9)).toThrow();
    expect(() => sectorRearrangement(3, 7)).toThrow();
    expect(() => sectorRearrangement(3, 128)).toThrow();
    expect(() => cylinderMeasures(2, 0, 2)).toThrow();
    expect(() => cylinderMeasures(2, 3, 3 as 2)).toThrow();
    expect(() => measuredPiRatio(0, 12)).toThrow();
    expect(() => measuredPiRatio(4, -1)).toThrow();
    expect(() => simulatedPiReading(4, 0.01 as 1)).toThrow();
  });
});
