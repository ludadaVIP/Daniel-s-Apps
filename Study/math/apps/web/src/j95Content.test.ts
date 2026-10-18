import { describe, it, expect } from 'vitest';
import {
  j95Lessons,
  j95ReviewQuestion,
  j95CheckQuestions,
} from './content/J95';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { rational, textR } from './algebraModels';
import {
  circlePoint,
  lineCircle,
  inscribedModel,
  tangentModel,
  tangentAngleGeometry,
  tangentAngle,
  sectorExact,
  angleFromArc,
  diameterAltitude,
  auditCircleProof,
  circleProofCases,
} from './circleGeometryModels';
import { circleArcPath, circleScreen } from './CircleGeometryVisuals';
const bodies = import.meta.glob('../../../content/lessons/J95-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j95Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j95CheckQuestions,
];
const angle = (
  a: { x: number; y: number },
  v: { x: number; y: number },
  b: { x: number; y: number },
) => {
  const x = { x: a.x - v.x, y: a.y - v.y },
    y = { x: b.x - v.x, y: b.y - v.y };
  return (
    (Math.acos(
      Math.max(
        -1,
        Math.min(
          1,
          (x.x * y.x + x.y * y.y) /
            (Math.hypot(x.x, x.y) * Math.hypot(y.x, y.y)),
        ),
      ),
    ) *
      180) /
    Math.PI
  );
};
describe('J95 circle premises, exact measures and proof dependencies', () => {
  it('registers five planned bilingual courses with earlier prerequisites and two examples per language', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('J95-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j95Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J95.questions).toHaveLength(8);
    for (const l of j95Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.stage).toBe('J09');
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n, id).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j95ReviewQuestion(l.id, 0));
    }
  });
  it('validates 48 authored items and retains ten explanations for human review', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('tangent circle proof words', q.answer)).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('anchors every constructed answer and choice independently', () => {
    const anchors: (string | null)[][] = [
      ['割线', '10 cm', '30°', '8', '切线', '不相交'],
      ['40', '140', '90', '110', 'insufficient', null],
      ['4', '12', 'sqrt(24)', '8 cm', '80°', null],
      ['2π cm', '6π cm²', '10π', '30π', '4', '90°'],
      ['110', '15', '12', 'ABC', 'insufficient', null],
    ];
    for (const [i, l] of j95Lessons.entries()) {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      for (const [j, a] of anchors[i]!.entries())
        expect(
          checkAnswer(a ?? 'Parent explanation', qs[j]!.answer),
          qs[j]!.id,
        ).toBe(a === null ? null : true);
      expect(checkAnswer('1', l.questions[0]!.answer)).toBe(true);
    }
    for (const [i, a] of [
      'tangent',
      '140',
      '2√6',
      '6π cm²',
      '15',
      null,
      '1',
      null,
    ].entries())
      expect(
        checkAnswer(a ?? 'Parent explanation', j95CheckQuestions[i]!.answer),
      ).toBe(a === null ? null : true);
  });
  it('classifies all bounded integer centre distances and computes full rather than half chords', () => {
    let n = 0;
    for (let r = 1; r <= 20; r++)
      for (let d = 0; d <= 21; d++) {
        const m = lineCircle(String(r), String(d));
        expect(m.kind).toBe(
          d < r ? 'secant' : d === r ? 'tangent' : 'disjoint',
        );
        expect(m.diameter).toBe(d === 0);
        if (d < r)
          expect(textR(m.chordSquare!)).toBe(String(4 * (r * r - d * d)));
        else expect(m.chordSquare).toBeNull();
        n++;
      }
    expect(n).toBe(440);
    expect(lineCircle('5', '0.0').chord).toBe('10');
    expect(lineCircle('5', '3').chord).toBe('8');
    for (const [r, d] of [
      ['0', '1'],
      ['5', '-1'],
      ['21', '1'],
      ['5', '41'],
      ['5', 'hello'],
    ])
      expect(() => lineCircle(r!, d!)).toThrow();
  });
  it('measures every illustrated inscribed angle from independent vector geometry', () => {
    for (let theta = 20; theta <= 340; theta += 10)
      for (const side of ['selected', 'other'] as const) {
        const m = inscribedModel(theta, side),
          expected = (side === 'selected' ? 360 - theta : theta) / 2;
        expect(angle(m.A, m.P, m.B)).toBeCloseTo(expected, 9);
        expect(m.angle).toBe(expected);
        expect(m.intercepted).toBe(2 * expected);
        for (const p of [m.A, m.P, m.B])
          expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 12);
      }
  });
  it('distinguishes same-side equality, opposite-side supplementation and the diameter case', () => {
    for (const theta of [30, 80, 120, 180, 240, 300]) {
      const a = inscribedModel(theta),
        b = inscribedModel(theta, 'selected');
      expect(a.angle + b.angle).toBe(180);
      const A = circlePoint(0),
        B = circlePoint(theta),
        P = circlePoint(theta + (360 - theta) / 3);
      expect(angle(A, P, B)).toBeCloseTo(theta / 2);
    }
    expect(inscribedModel(80).angle).toBe(40);
    expect(inscribedModel(80, 'selected').angle).toBe(140);
    for (const side of ['selected', 'other'] as const)
      expect(inscribedModel(180, side).angle).toBe(90);
    for (const v of [0, 360, -1, NaN])
      expect(() => inscribedModel(v)).toThrow();
  });
  it('builds actual contacts on the circle with perpendicular tangent segments and equal lengths', () => {
    let n = 0;
    for (let r = 2; r <= 8; r++)
      for (let extra = 1; extra <= 10; extra++) {
        const d = r + extra,
          m = tangentModel(String(r), String(d));
        for (const p of [m.T, m.S]) {
          expect(p.x * p.x + p.y * p.y).toBeCloseTo(r * r, 9);
          const u = { x: m.P.x - p.x, y: m.P.y - p.y };
          expect(p.x * u.x + p.y * u.y).toBeCloseTo(0, 9);
          expect(u.x * u.x + u.y * u.y).toBeCloseTo(d * d - r * r, 9);
        }
        expect(textR(m.square)).toBe(String(d * d - r * r));
        n++;
      }
    expect(n).toBe(70);
    expect(tangentModel('5', '7').length).toBe('2√6');
  });
  it('requires a genuinely external point for two distinct tangents', () => {
    for (const [r, d] of [
      ['3', '3'],
      ['3', '2'],
      ['0', '5'],
      ['21', '25'],
      ['5', '51'],
    ])
      expect(() => tangentModel(r!, d!)).toThrow();
    expect(
      checkAnswer('-4', { kind: 'root-length', value: '4', square: '16' }),
    ).toBe(false);
    expect(
      checkAnswer('4.90', { kind: 'root-length', value: '2√6', square: '24' }),
    ).toBe(false);
  });
  it('checks tangent-angle supplementation against actual contact vectors', () => {
    for (let central = 40; central <= 140; central += 20) {
      const m = tangentAngleGeometry(3, central);
      expect(angle(m.T, m.P, m.S)).toBeCloseTo(180 - central, 9);
      expect(angle(m.T, { x: 0, y: 0 }, m.S)).toBeCloseTo(central, 9);
      expect(tangentAngle(central)).toBe(180 - central);
    }
    for (const x of [0, 180, NaN]) expect(() => tangentAngle(x)).toThrow();
  });
  it('checks 240 exact sector fractions, major sweeps and full-circle boundary seams', () => {
    let n = 0;
    for (let r = 1; r <= 10; r++)
      for (let theta = 15; theta <= 360; theta += 15) {
        const m = sectorExact(String(r), String(theta));
        expect(textR(m.arcCoefficient)).toBe(
          textR(rational(BigInt(2 * r * theta), 360n)),
        );
        expect(textR(m.areaCoefficient)).toBe(
          textR(rational(BigInt(r * r * theta), 360n)),
        );
        expect(textR(m.radialBoundary)).toBe(
          theta === 360 ? '0' : String(2 * r),
        );
        n++;
      }
    expect(n).toBe(240);
    expect(textR(sectorExact('6', '300').arcCoefficient)).toBe('10');
    expect(textR(sectorExact('6', '300').areaCoefficient)).toBe('30');
    expect(textR(angleFromArc('6', '3'))).toBe('90');
    for (const theta of ['0', '361', '-1'])
      expect(() => sectorExact('6', theta)).toThrow();
  });
  it('preserves exact pi semantics and rejects quantity-unit mismatches', () => {
    expect(
      checkAnswer('pi*6', {
        kind: 'pi-multiple',
        coefficient: '6',
        value: '6π',
        unit: 'cm²',
      }),
    ).toBe(true);
    for (const raw of ['18.84', '6π cm', '6'])
      expect(
        checkAnswer(raw, {
          kind: 'pi-multiple',
          coefficient: '6',
          value: '6π',
          unit: 'cm²',
        }),
      ).toBe(false);
  });
  it('draws selected major arc flags, two full-circle arcs and uniform coordinate scales', () => {
    expect(circleArcPath(0, 60, 1, 125)).toContain('0 0 0');
    expect(circleArcPath(0, 300, 1, 125)).toContain('0 1 0');
    expect(circleArcPath(0, 360, 1, 125).match(/A/g)).toHaveLength(2);
    for (const rotation of [0, 90, 180, 270])
      for (const zoom of [0.8, 1]) {
        const o = circleScreen({ x: 0, y: 0 }, 17, rotation, zoom),
          a = circleScreen({ x: 4, y: 0 }, 17, rotation, zoom),
          b = circleScreen({ x: 0, y: 3 }, 17, rotation, zoom);
        expect(Math.hypot(a.x - o.x, a.y - o.y)).toBeCloseTo(68 * zoom);
        expect(Math.hypot(b.x - o.x, b.y - o.y)).toBeCloseTo(51 * zoom);
      }
  });
  it('constructs diameter-altitude figures on their actual circumcircle with independent side identities', () => {
    for (let u = 1; u <= 4; u++)
      for (let v = 1; v <= 4; v++) {
        const ac = u * u + v * v,
          ad = u * u,
          m = diameterAltitude(String(ac), String(ad)),
          x = m.B.x - ac / 2;
        expect(x * x + m.B.y * m.B.y).toBeCloseTo((ac * ac) / 4);
        expect(angle(m.A, m.B, m.C)).toBeCloseTo(90);
        expect(textR(m.abSquare)).toBe(String(ac * ad));
        expect(textR(m.bdSquare)).toBe(String(u * u * v * v));
        expect(m.bd).toBe(String(u * v));
      }
    const m = diameterAltitude('25', '9');
    expect([m.ab, m.bc, m.bd]).toEqual(['15', '20', '12']);
    for (const ad of ['0', '25', '26'])
      expect(() => diameterAltitude('25', ad)).toThrow();
  });
  it('accepts dependency-ordered proof chains and rejects circular or missing premises', () => {
    expect(
      auditCircleProof(0, ['arcs', 'supplement', 'subtract']).available,
    ).toContain('C110');
    expect(
      auditCircleProof(1, ['thales', 'AA', 'ratio', 'root']).available,
    ).toContain('AB15');
    expect(auditCircleProof(1, ['ratio']).missing).toEqual(['similar']);
    expect(auditCircleProof(1, ['thales', 'root']).valid).toBe(false);
    expect(auditCircleProof(0, ['arcs', 'arcs']).valid).toBe(false);
    expect(auditCircleProof(0, ['unknown']).valid).toBe(false);
    expect(auditCircleProof(2, ['supplement']).missing).toEqual(['cyclic']);
    expect(auditCircleProof(1, ['thales', 'AA']).available).not.toContain(
      'square',
    );
    expect(circleProofCases).toHaveLength(3);
  });
  it('validates 400 retrieval rounds with independently computed directed arcs and exact quantities', () => {
    for (const [i, l] of j95Lessons.entries())
      for (let k = 0; k < 80; k++) {
        const q = j95ReviewQuestion(l.id, k);
        let expected: string;
        if (i === 0) {
          const r = 3 + (k % 6),
            d = r + (Math.floor(k / 6) % 3) - 1;
          expected = d < r ? 'secant' : d === r ? 'tangent' : 'disjoint';
        } else if (i === 1) {
          const sweep = 20 + 10 * (k % 33);
          expected = String((Math.floor(k / 33) % 2 ? 360 - sweep : sweep) / 2);
        } else if (i === 2) {
          const r = 3 + (k % 5),
            d = r + (Math.floor(k / 5) % 8) + 1;
          expected = `√${d * d - r * r}`;
        } else if (i === 3) {
          const r = 1 + (k % 10),
            theta = 30 * ((Math.floor(k / 10) % 11) + 1),
            area = Math.floor(k / 5) % 2 === 1;
          expected = `${textR(rational(BigInt(theta * (area ? r * r : 2 * r)), 360n))}π`;
        } else if (k % 2 === 0) expected = String(180 - (30 + (k % 111)));
        else {
          const u = 1 + (k % 4),
            v = 1 + (Math.floor(k / 4) % 4);
          expected = `√${u * u * (u * u + v * v)}`;
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const wrong of q.answerChecks!.rejected)
          expect(checkAnswer(wrong, q.answer)).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const [id, k] of [
      ['J95-L00', 0],
      ['J95-L01', -1],
      ['J95-L01', 0.1],
      ['J95-L01', 100001],
    ] as const)
      expect(() => j95ReviewQuestion(id, k)).toThrow();
  });
});
