import { describe, it, expect } from 'vitest';
import { circleGeometryMeaningRetrieval } from './content/circleGeometryMeaningRetrieval';
import { similarityCircleTrigRetrieval } from './content/similarityCircleTrigRetrieval';
import { analyticGeometryRecurrenceRetrieval } from './content/analyticGeometryRecurrenceRetrieval';
import { similarityCircleTrigRecurrence } from './content/similarityCircleTrigRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { addR, mulR, divR, negR, textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { exactRootText } from './pythagoreanModels';
import {
  lineCircle,
  circlePoint,
  tangentModel,
  sectorExact,
  angleFromArc,
  diameterAltitude,
} from './circleGeometryModels';

const sets = Object.values(circleGeometryMeaningRetrieval);
const row = (i: number, n: number, k: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const value = (s: string, k: string) =>
  R(s.match(new RegExp(k + '=([0-9/]+)'))![1]!);
const square = (s: string) => mulR(R(s), R(s));
const subtract = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const minor = (a: number, b: number) =>
  Math.min((a - b + 360) % 360, (b - a + 360) % 360);
const angle = (
  a: { x: number; y: number },
  p: { x: number; y: number },
  b: { x: number; y: number },
) =>
  (Math.acos(
    Math.max(
      -1,
      Math.min(
        1,
        ((a.x - p.x) * (b.x - p.x) + (a.y - p.y) * (b.y - p.y)) /
          (Math.hypot(a.x - p.x, a.y - p.y) * Math.hypot(b.x - p.x, b.y - p.y)),
      ),
    ),
  ) *
    180) /
  Math.PI;

describe('J95 circle premises, derivations and inverse models', () => {
  it('keeps original ten tasks and bridges, reuses two actual locus tasks, and only adds eight new cards', () => {
    const entries = similarityCircleTrigRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J95-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(20);
    expect(refs.filter((id) => id.includes('-SIM-CIRCLE-TRIG-'))).toHaveLength(
      10,
    );
    expect(
      refs.filter((id) => id.includes('-CIRCLE-GEOMETRY-MEANING-')),
    ).toHaveLength(12);
    expect(
      refs.filter((id) => id.includes('-ANALYTIC-GEOMETRY-')),
    ).toHaveLength(2);
    for (const s of Object.values(similarityCircleTrigRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(
        s.questions.slice(2, 7).map((q) => s.bridgeByQuestion[q.id]),
      ).toEqual([1, 2, 3, 4, 5].map((n) => `J95-L0${n}`));
    }
    for (const s of Object.values(analyticGeometryRecurrenceRetrieval)) {
      expect(s.questions).toHaveLength(5);
      expect(s.bridgeByQuestion[s.questions[3]!.id]).toBe('H36-L04');
    }
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J95'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('retains bilingual original givens and human review for all independent parts', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(4);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual(
        [1, 2, 3, 4].map((n) => `J95-L0${n}`),
      );
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('HL AA tangent half arc done', q.answer)).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('recomputes fractional half/full chords and the secant hidden by a finite segment', () => {
    for (let i = 0; i < 2; i++) {
      const c = row(i, 1, 'C'),
        r = value(c, 'r'),
        d = divR(value(c, 'd'), R('10'));
      const m = lineCircle(textR(r), textR(d));
      expect([textR(r), textR(d), m.chord]).toEqual(
        i === 0 ? ['5/2', '3/2', '4'] : ['13/2', '5/2', '12'],
      );
      expect(m.kind).toBe('secant');
      const s = row(i, 1, 'S'),
        y = Number(s.match(/y=([\d/]+)/)![1]!.split('/')[0]) / 2;
      const x = i === 0 ? 2 : 6;
      expect(textR(addR(square(String(x)), square(String(y))))).toBe(
        textR(mulR(r, r)),
      );
      expect(y).toBeLessThan(Number(r[0]) / Number(r[1]));
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        i === 0 ? '(−2,3/2),(2,3/2)' : '(−6,5/2),(6,5/2)',
      );
      expect(lineCircle(textR(r), '0').diameter).toBe(true);
    }
  });
  it('derives fractional central/base angles in both directions and rejects the 180-degree triangle', () => {
    for (let i = 0; i < 2; i++) {
      const theta = value(row(i, 1, 'A'), 'θ'),
        base = divR(subtract(R('180'), theta), R('2'));
      expect(textR(base)).toBe(i === 0 ? '235/4' : '105/4');
      const supplied = value(row(i, 1, 'B'), '∠OAB');
      expect(textR(subtract(R('180'), mulR(R('2'), supplied)))).toBe(
        i === 0 ? '225/2' : '285/2',
      );
      const a = circlePoint(0),
        b = circlePoint(180);
      expect(a.x * b.y - a.y * b.x).toBeCloseTo(0);
      expect(sets[i]!.questions[0]!.solution.en).toContain('collinear');
    }
  });
  it('verifies equal-radii addition and subtraction using actual vertex geometry, major arcs, and a valid rhombus counterexample', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 2, 'E'),
        a = value(raw, 'A'),
        b = value(raw, 'B'),
        p = value(raw, 'P'),
        r = value(raw, 'R');
      const nums = [a, b, p, r].map((v) => Number(v[0]) / Number(v[1]));
      const [an, bn, pn, rn] = nums as [number, number, number, number];
      const sum = (180 - minor(an, pn)) / 2 + (180 - minor(bn, pn)) / 2;
      const difference = Math.abs(
        (180 - minor(an, rn)) / 2 - (180 - minor(bn, rn)) / 2,
      );
      expect(sum).toBe(i === 0 ? 35 : 55);
      expect(difference).toBe(sum);
      expect(
        angle(circlePoint(an), circlePoint(pn), circlePoint(bn)),
      ).toBeCloseTo(sum);
      expect(
        angle(circlePoint(an), circlePoint(rn), circlePoint(bn)),
      ).toBeCloseTo(sum);
      const major = Number(row(i, 2, 'U').match(/A→B=(\d+)/)![1]);
      expect([(360 - major) / 2, major / 2]).toEqual(
        i === 0 ? [55, 125] : [35, 145],
      );
      const alpha = Number(row(i, 2, 'K').match(/∠A=(\d+)/)![1]);
      // A=(0,0), B=(1,0), D=(cos α,sin α), C=B+D is a convex rhombus.
      const rad = (alpha * Math.PI) / 180,
        A = { x: 0, y: 0 },
        B = { x: 1, y: 0 },
        D = { x: Math.cos(rad), y: Math.sin(rad) },
        C = { x: 1 + D.x, y: D.y };
      expect(angle(B, A, D)).toBeCloseTo(alpha);
      expect(angle(B, C, D)).toBeCloseTo(alpha);
      expect(alpha).not.toBe(180 - alpha);
      expect(D.y).toBeGreaterThan(0);
    }
  });
  it('recomputes exact mixed-unit tangent roots, decimal residuals and four-angle tangent relationships', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 3, 'T'),
        r = divR(value(raw, 'OT'), R('10')),
        op = value(raw, 'OP');
      const m = tangentModel(textR(r), textR(op));
      expect([textR(m.square), m.length]).toEqual(
        i === 0 ? ['6', '√6'] : ['8', '2√2'],
      );
      const candidate = R(raw.match(/candidate ([\d.]+)/)![1]!);
      const residual = subtract(mulR(candidate, candidate), m.square);
      expect(textR(residual)).toBe(i === 0 ? '1/400' : '89/10000');
      expect(textR(addR(m.square, mulR(r, r)))).toBe(textR(mulR(op, op)));
      const theta = value(row(i, 3, 'A'), 'TOS');
      expect(textR(subtract(R('180'), theta))).toBe(
        i === 0 ? '290/3' : '190/3',
      );
    }
  });
  it('checks all three actual perpendicular lines and the retained-coordinate counterexample after removing tangency', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 3, 'V'),
        r = value(raw, 'r'),
        rn = Number(r[0]) / Number(r[1]);
      expect(
        [rn, 0, rn + 1].map((x) => lineCircle(textR(r), String(x)).kind),
      ).toEqual(['tangent', 'secant', 'disjoint']);
      expect(rn * rn).toBeGreaterThan(0);
      const w = row(i, 3, 'W'),
        radius = value(w, 'r'),
        op = R(i === 0 ? '7/2' : '9/2');
      expect(textR(subtract(op, radius))).toBe('1');
      expect(textR(subtract(mulR(op, op), mulR(radius, radius)))).toBe(
        i === 0 ? '6' : '8',
      );
      expect(sets[i]!.questions[2]!.solution.en).toContain('collinear');
    }
  });
  it('inverts exact arc and area data, includes complements, and recalculates both changing factors', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 4, 'I'),
        r = value(raw, 'r');
      const arc = raw.match(/l=(\d+)π(?:\/(\d+))?cm/)!,
        coefficient = R(arc[1]! + '/' + (arc[2] ?? '1'));
      const theta = angleFromArc(textR(r), textR(coefficient)),
        m = sectorExact(textR(r), textR(theta));
      expect([textR(theta), textR(m.areaCoefficient)]).toEqual(
        i === 0 ? ['300', '135/8'] : ['240', '75/2'],
      );
      const complement = sectorExact(
        textR(r),
        textR(subtract(R('360'), theta)),
      );
      expect(textR(addR(m.arcCoefficient, complement.arcCoefficient))).toBe(
        textR(mulR(R('2'), r)),
      );
      expect(textR(addR(m.areaCoefficient, complement.areaCoefficient))).toBe(
        textR(mulR(r, r)),
      );
      const rcase = row(i, 4, 'R'),
        area = rcase.match(/S=(\d+)π\/(\d+)cm²/)!,
        fraction = divR(value(rcase, 'θ'), R('360'));
      expect(exactRootText(divR(R(area[1]! + '/' + area[2]!), fraction))).toBe(
        textR(r),
      );
      const j = row(i, 4, 'J'),
        a = value(j, 'a'),
        b = value(j, 'b'),
        newR = mulR(r, a),
        newTheta = mulR(theta, b),
        changed = sectorExact(textR(newR), textR(newTheta));
      expect([
        textR(newR),
        textR(newTheta),
        textR(changed.arcCoefficient),
        textR(changed.areaCoefficient),
      ]).toEqual(
        i === 0
          ? ['9', '150', '15/2', '135/4']
          : ['45/4', '160', '10', '225/4'],
      );
      expect(textR(divR(changed.arcCoefficient, m.arcCoefficient))).toBe('1');
      expect(textR(divR(changed.areaCoefficient, m.areaCoefficient))).toBe(
        i === 0 ? '2' : '3/2',
      );
      const own = diameterAltitude(i === 0 ? '6' : '8', '2');
      expect([textR(own.abSquare), textR(own.bdSquare)]).toEqual(
        i === 0 ? ['12', '8'] : ['16', '12'],
      );
      expect(
        checkAnswer(i === 0 ? '2√3' : '4', {
          kind: 'root-length',
          value: own.ab,
          square: textR(own.abSquare),
        }),
      ).toBe(true);
      expect(
        checkAnswer(i === 0 ? '2√2' : '2√3', {
          kind: 'root-length',
          value: own.bd,
          square: textR(own.bdSquare),
        }),
      ).toBe(true);
      expect(sets[i]!.questions[3]!.stem.en).toContain('DESIGN a different');
    }
  });
});
