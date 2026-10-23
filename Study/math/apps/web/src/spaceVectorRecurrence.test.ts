import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { spaceVectorRetrieval } from './content/spaceVectorRetrieval';
import { spaceVectorRecurrence } from './content/spaceVectorRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  vec3,
  zeroVec3,
  subVec3,
  addVec3,
  scaleVec3,
  midpointVec3,
  squareVec3,
  dotVec3,
  spatialAngle,
  vectorLine3,
  vectorPlane3,
  vectorLinePlaneRelation,
  vectorLineRelation,
  planeResidual3,
  pointLineProjection,
  pointPlaneProjection,
} from './spaceVectorModels';
import { textR, addR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(spaceVectorRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('space vector recurrence', () => {
  it('covers all five H23 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H23')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(spaceVectorRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of spaceVectorRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps ten bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks all endpoint, midpoint and translation coordinates and the omitted projection terms', () => {
    for (const [A, B, W, D, M, AP, BP, MP, norm] of [
      [
        vec3(1, -2, 4),
        vec3(-2, 2, 1),
        vec3(2, 1, -1),
        vec3(-3, 4, -3),
        vec3('-1/2', 0, '5/2'),
        vec3(3, -1, 3),
        vec3(0, 3, 0),
        vec3('3/2', 1, '3/2'),
        '34',
      ],
      [
        vec3(-2, 1, 3),
        vec3(2, -2, 5),
        vec3(-1, 2, 4),
        vec3(4, -3, 2),
        vec3(0, '-1/2', 4),
        vec3(-3, 3, 7),
        vec3(1, 0, 9),
        vec3(-1, '3/2', 8),
        '29',
      ],
    ] as const) {
      expect(subVec3(B, A)).toEqual(D);
      expect(midpointVec3(A, B)).toEqual(M);
      expect(addVec3(A, W)).toEqual(AP);
      expect(addVec3(B, W)).toEqual(BP);
      expect(midpointVec3(AP, BP)).toEqual(MP);
      expect(subVec3(BP, AP)).toEqual(D);
      expect(textR(squareVec3(D))).toBe(norm);
      expect(textR(squareVec3(vec3(textR(D[0]), textR(D[1]), 0)))).toBe('25');
      expect(subVec3(A, B)).toEqual(scaleVec3(R('-1'), D));
    }
    expect(equalPolynomial('(b+2)-(a+2)', 'b-a', ['a', 'b'])).toBe(true);
  });
  it('checks complete three-component combinations,inverse recovery,negative scale and a length counterexample', () => {
    for (const [u, v, a, b, w] of [
      [vec3(2, -1, 3), vec3(-1, 2, 1), '2', '-3', vec3(7, -8, 3)],
      [vec3(-1, 3, 2), vec3(2, 1, -2), '-2', '1', vec3(4, -5, -6)],
    ] as const) {
      expect(addVec3(scaleVec3(R(a), u), scaleVec3(R(b), v))).toEqual(w);
      expect(subVec3(w, scaleVec3(R(b), v))).toEqual(scaleVec3(R(a), u));
    }
    expect(spatialAngle(vec3(1, 0, 0), vec3(-2, 0, 0)).kind).toBe('straight');
    expect(spatialAngle(zeroVec3(), vec3(1, 0, 0)).kind).toBe('undefined');
    expect(textR(squareVec3(addVec3(vec3(1, 0, 0), vec3(0, 0, 1))))).toBe('2');
    expect(equalPolynomial('(k*x)^2', 'k^2*x^2', ['k', 'x'])).toBe(true);
  });
  it('checks exact signed vector cosines and the distinct smaller-line cosine with nonzero premises', () => {
    for (const [u, v, w] of [
      [vec3(1, 0, 1), vec3(-1, 1, -1), vec3(1, 0, -1)],
      [vec3(1, 1, 0), vec3(-1, -1, 1), vec3(1, -1, 0)],
    ] as const) {
      expect([
        textR(squareVec3(u)),
        textR(squareVec3(v)),
        textR(dotVec3(u, v)),
      ]).toEqual(['2', '3', '-2']);
      expect(spatialAngle(u, v).cosine).toBe('-√6/3');
      expect(spatialAngle(u, v).kind).toBe('obtuse');
      expect(spatialAngle(u, scaleVec3(R('-1'), v)).cosine).toBe('√6/3');
      expect(spatialAngle(u, w).kind).toBe('right');
      expect(spatialAngle(zeroVec3(), u).kind).toBe('undefined');
    }
  });
  it('checks all six line/plane classifications,full intersection points and both skew counterexamples', () => {
    for (const [n, d, contained, parallel, u, cross, I] of [
      [
        vec3(1, 2, -1),
        2,
        vec3(2, 0, 0),
        vec3(3, 0, 0),
        vec3(2, -1, 0),
        vec3(1, 0, 0),
        vec3(2, 0, 0),
      ],
      [
        vec3(2, -1, 2),
        3,
        vec3(0, -3, 0),
        vec3(0, -4, 0),
        vec3(1, 2, 0),
        vec3(0, 1, 0),
        vec3(0, -3, 0),
      ],
    ] as const) {
      const plane = vectorPlane3(n, d);
      expect(
        vectorLinePlaneRelation(vectorLine3(contained, u), plane).kind,
      ).toBe('contained');
      expect(
        vectorLinePlaneRelation(vectorLine3(parallel, u), plane).kind,
      ).toBe('parallel');
      const hit = vectorLinePlaneRelation(
        vectorLine3(zeroVec3(), cross),
        plane,
      );
      expect(hit.kind).toBe('intersecting');
      expect(hit.intersection).toEqual(I);
      expect(textR(planeResidual3(plane, I))).toBe('0');
      expect(
        vectorLinePlaneRelation(vectorLine3(zeroVec3(), n), plane)
          .perpendicular,
      ).toBe(true);
    }
    for (const z of [1, 2])
      expect(
        vectorLineRelation(
          vectorLine3(zeroVec3(), vec3(1, 0, 0)),
          vectorLine3(vec3(0, 0, z), vec3(0, 1, 0)),
        ),
      ).toBe('skew');
    expect(() => vectorLine3(zeroVec3(), zeroVec3())).toThrow();
    expect(() => vectorPlane3(zeroVec3(), 0)).toThrow();
  });
  it('checks both plane and line projections,negative rescalings,on-object zero and Pythagoras for arbitrary tangent displacement', () => {
    for (const [P, n, d, planeH, A, u, lineH] of [
      [
        vec3(3, 2, 4),
        vec3(1, 2, 2),
        6,
        vec3(2, 0, 2),
        vec3(1, 0, 2),
        vec3(1, 1, 0),
        vec3(3, 2, 2),
      ],
      [
        vec3(4, 3, 3),
        vec3(2, -1, 2),
        2,
        vec3(2, 4, 1),
        vec3(0, 1, 1),
        vec3(2, 0, 1),
        vec3(4, 1, 3),
      ],
    ] as const) {
      const plane = vectorPlane3(n, d),
        line = vectorLine3(A, u),
        pp = pointPlaneProjection(P, plane),
        lp = pointLineProjection(P, line);
      expect(pp.foot).toEqual(planeH);
      expect(pp.distance).toBe('3');
      expect(textR(planeResidual3(plane, planeH))).toBe('0');
      expect(lp.foot).toEqual(lineH);
      expect(textR(lp.parameter)).toBe('2');
      expect(lp.distance).toBe('2');
      expect(textR(dotVec3(lp.displacement, u))).toBe('0');
      expect(
        pointPlaneProjection(P, vectorPlane3(scaleVec3(R('-2'), n), -2 * d))
          .foot,
      ).toEqual(planeH);
      const scaled = pointLineProjection(
        P,
        vectorLine3(A, scaleVec3(R('-2'), u)),
      );
      expect(scaled.foot).toEqual(lineH);
      expect(textR(scaled.parameter)).toBe('-1');
      expect(pointLineProjection(lineH, line).distance).toBe('0');
      expect(pointPlaneProjection(planeH, plane).distance).toBe('0');
      for (const k of ['-3', '0', '2/3']) {
        const Q = addVec3(lineH, scaleVec3(R(k), u));
        expect(squareVec3(subVec3(P, Q))).toEqual(
          addR(squareVec3(subVec3(P, lineH)), squareVec3(subVec3(Q, lineH))),
        );
      }
    }
    // Per coordinate,the summed cross term is2(P-H)·(Q-H),zero by perpendicularity.
    expect(equalPolynomial('(a-b)^2', 'a^2-2ab+b^2', ['a', 'b'])).toBe(true);
  });
});
