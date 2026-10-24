import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { conicDefinitionRetrieval } from './content/conicDefinitionRetrieval';
import { conicDefinitionRecurrence } from './content/conicDefinitionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  cp,
  planeLine,
  projectionFoot,
  lineDistanceSquare,
  pointDistanceSquare,
  lineValue,
  circleLocus,
  circlePosition,
  checkPlaneEquation,
  exactDistance,
} from './conicModels';
import { textR, addR, mulR, negR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(conicDefinitionRetrieval);
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
describe('conic definition recurrence', () => {
  it('covers all six H22 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H22')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(conicDefinitionRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of conicDefinitionRecurrence) {
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
  it('keeps twelve bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(12);
    for (const s of sets) {
      expect(s.questions).toHaveLength(6);
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

  it('checks constructed line equations, whole-parameter substitutions, zero direction and vertical status', () => {
    expect(checkPlaneEquation('x=2', '3x-6=0')).toBe(true);
    expect(checkPlaneEquation('x+2y-5=0', 'y=-x/2+5/2')).toBe(true);
    expect(checkPlaneEquation('2x-3y+13=0', 'y=2x/3+13/3')).toBe(true);
    expect(equalPolynomial('(1+2t)+2(2-t)-5', '0', ['t'])).toBe(true);
    expect(equalPolynomial('2(-2+3t)-3(3+2t)+13', '0', ['t'])).toBe(true);
    expect(() => planeLine(0, 0, 0)).toThrow();
    expect(() => planeLine(0, 0, 1)).toThrow();
    expect(checkPlaneEquation('x=4', 'y=-1')).toBe(false);
  });
  it('checks exact perpendicular feet, distance invariance under negative equation scaling and on-line zero', () => {
    for (const [abc, p, foot, distance] of [
      [[3, 4, -5], cp(3, 4), cp('3/5', '4/5'), '4'],
      [[4, -3, 7], cp(1, 2), cp('1/5', '13/5'), '1'],
    ] as const) {
      const l = planeLine(abc[0], abc[1], abc[2]),
        H = projectionFoot(l, p),
        scaled = planeLine(
          ...(abc.map((v) => -2 * v) as [number, number, number]),
        );
      // -2 stays inside the existing classroom model's coefficient bounds.
      expect(H).toEqual(foot);
      expect(textR(lineValue(l, H))).toBe('0');
      expect(exactDistance(lineDistanceSquare(l, p))).toBe(distance);
      expect(pointDistanceSquare(p, H)).toEqual(lineDistanceSquare(l, p));
      expect(projectionFoot(scaled, p)).toEqual(H);
      expect(lineDistanceSquare(scaled, p)).toEqual(lineDistanceSquare(l, p));
      expect(textR(lineDistanceSquare(l, H))).toBe('0');
      const d = [negR(l.b), l.a],
        ph = [addR(p[0], negR(H[0])), addR(p[1], negR(H[1]))];
      expect(textR(addR(mulR(d[0]!, ph[0]!), mulR(d[1]!, ph[1]!)))).toBe('0');
      for (const t of ['-2', '0', '3/2']) {
        const Q = [
          addR(H[0], mulR(R(t), d[0]!)),
          addR(H[1], mulR(R(t), d[1]!)),
        ] as const;
        expect(pointDistanceSquare(p, Q)).toEqual(
          addR(pointDistanceSquare(p, H), pointDistanceSquare(H, Q)),
        );
      }
    }
    expect(equalPolynomial('(n+t)^2', 'n^2+2nt+t^2', ['n', 't'])).toBe(true);
  });
  it('checks square completion, radii, on-versus-inside and point/empty boundaries', () => {
    for (const [h, k, r2, P, expanded] of [
      [2, -1, 9, cp(5, -1), 'x^2+y^2-4x+2y-4=0'],
      [-3, 2, 16, cp(-3, 6), 'x^2+y^2+6x-4y-3=0'],
    ] as const) {
      const c = circleLocus(h, k, r2);
      expect(checkPlaneEquation(c.equation, expanded)).toBe(true);
      expect(circlePosition(P, c.centre, c.radiusSquare)).toBe('on');
      expect(circlePosition(c.centre, c.centre, c.radiusSquare)).toBe('inside');
      expect(exactDistance(c.radiusSquare)).toBe(String(Math.sqrt(r2)));
      expect(circleLocus(h, k, 0).kind).toBe('point');
      expect(circleLocus(h, k, -1).kind).toBe('empty');
    }
  });
  it('checks both translated parabola distances, signed parameters and the whole equidistance identity', () => {
    for (const [h, k, p, P, F, dx] of [
      [1, 2, -2, cp(-1, 6), cp(-1, 2), 3],
      [-2, 1, 3, cp(1, 7), cp(1, 1), -5],
    ] as const) {
      expect(pointDistanceSquare(P, F)).toEqual(
        pointDistanceSquare(P, cp(dx, textR(P[1]))),
      );
      expect(textR(pointDistanceSquare(P, F))).toBe(String(4 * p * p));
      expect(F).toEqual(cp(h + p, k));
      expect(dx).toBe(h - p);
      expect(
        equalPolynomial(`(x-(${p}))^2+y^2-(x+(${p}))^2`, `y^2-${4 * p}x`, [
          'x',
          'y',
        ]),
      ).toBe(true);
    }
    expect(equalPolynomial('(x-0)^2+y^2-(x+0)^2', 'y^2', ['x', 'y'])).toBe(
      true,
    );
  });
  it('checks horizontal/vertical focal sums and full squared identities supporting the converse', () => {
    for (const [F1, F2, V, a, c] of [
      [cp(-1, -1), cp(5, -1), cp(7, -1), 5, 3],
      [cp(-3, -2), cp(-3, 6), cp(-3, 8), 6, 4],
    ] as const) {
      const d1 = exactDistance(pointDistanceSquare(V, F1)),
        d2 = exactDistance(pointDistanceSquare(V, F2));
      expect(Number(d1) + Number(d2)).toBe(2 * a);
      expect(exactDistance(pointDistanceSquare(F1, F2))).toBe(String(2 * c));
      const b2 = a * a - c * c;
      for (const sign of [1, -1])
        expect(
          equalPolynomial(
            `(${a}+(${sign * c}/${a})x)^2-((x+(${sign * c}))^2+y^2)`,
            `-${b2}(x^2/${a * a}+y^2/${b2}-1)`,
            ['x', 'y'],
          ),
        ).toBe(true);
    }
    expect(
      checkPlaneEquation('(x-2)^2/25+(y+1)^2/16=1', '16(x-2)^2+25(y+1)^2=400'),
    ).toBe(true);
    expect(
      checkPlaneEquation('(y-2)^2/36+(x+3)^2/20=1', '5(y-2)^2+9(x+3)^2=180'),
    ).toBe(true);
    for (const x of [-3, -1, 0, 1, 3])
      expect(Math.abs(x + 3) + Math.abs(x - 3)).toBe(6);
  });
  it('checks both signed branches, exterior-ray equality and full hyperbola squared identities', () => {
    for (const [F1, F2, positive, negative] of [
      [cp(-3, 2), cp(7, 2), cp(5, 2), cp(-1, 2)],
      [cp(1, -4), cp(1, 6), cp(1, 4), cp(1, -2)],
    ] as const) {
      for (const [P, want] of [
        [positive, 6],
        [negative, -6],
      ] as const) {
        const d1 = Number(exactDistance(pointDistanceSquare(P, F1))),
          d2 = Number(exactDistance(pointDistanceSquare(P, F2)));
        expect(d1 - d2).toBe(want);
        expect(Math.abs(d1 - d2)).toBe(6);
      }
    }
    for (const sign of [1, -1])
      expect(
        equalPolynomial(
          `(5x/3+(${sign * 3}))^2-((x+(${sign * 5}))^2+y^2)`,
          '16(x^2/9-y^2/16-1)',
          ['x', 'y'],
        ),
      ).toBe(true);
    for (const x of [-8, -5, -4, 0, 4, 5, 8]) {
      const diff = Math.abs(Math.abs(x + 5) - Math.abs(x - 5));
      expect(diff === 10).toBe(Math.abs(x) >= 5);
      expect(diff).toBeLessThanOrEqual(10);
    }
  });
});
