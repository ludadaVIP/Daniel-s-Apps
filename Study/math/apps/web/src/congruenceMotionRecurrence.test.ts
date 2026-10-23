import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { congruenceMotionRetrieval } from './content/congruenceMotionRetrieval';
import { congruenceMotionRecurrence } from './content/congruenceMotionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { equalPolynomial } from './polynomialModels';
import { readCoordinate, type Coordinate } from './cartesianModels';
import { addR, negR, mulR, textR } from './algebraModels';
import {
  rigidImage,
  squaredDistance,
  midpoint,
  checkRootLength,
  pythagoreanClassification,
} from './pythagoreanModels';
const sets = Object.values(congruenceMotionRetrieval);
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
describe('congruence, motion and Pythagorean recurrence', () => {
  it('covers all eleven J86-J87 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J86', 'J87'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(11);
    expect(new Set(congruenceMotionRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of congruenceMotionRecurrence) {
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
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twenty bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const s of sets) {
      expect(s.questions).toHaveLength(10);
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

  it('checks the two exact SSA branches, congruence correspondence and isosceles angles', () => {
    for (const [u, ab, bc, h, r, side, apex, base] of [
      ['H05', 6, 4, 3, 7, [3, 4, 5], 40, 70],
      ['H06', 10, 6, 5, 11, [5, 12, 13], 70, 55],
    ] as const) {
      expect(3 * h * h + h * h).toBe(ab * ab);
      expect(r + h * h).toBe(bc * bc);
      expect(3 * h * h).toBeGreaterThan(r); // h√3−√r>0, so both AC branches are positive.
      expect(r).toBeGreaterThan(0); // distinct branches; B height h>0 prevents degeneracy.
      for (const sign of ['+', '-'])
        expect(
          equalPolynomial(
            `((${h}a${sign}b)-${h}a)^2+${h * h}`,
            `b^2+${h * h}`,
            ['a', 'b'],
          ),
        ).toBe(true);
      const q = congruenceMotionRetrieval[u].questions;
      expect(q[1]!.solution.zh).toContain(`s=${h}√3±√${r}`);
      expect(q[0]!.solution.zh).toContain(
        `DF=${side[0]}、FE=${side[1]}、ED=${side[2]}`,
      );
      expect(apex + 2 * base).toBe(180);
      expect(q[2]!.solution.zh).toContain(`=${base}°`);
      expect(q[2]!.solution.en).toContain('AAS');
    }
  });
  it('calculates both complete trapezium counterexamples without assuming a parallelogram property', () => {
    for (const [u, k, height, leg] of [
      ['H05', 3, 2, 5],
      ['H06', 4, 3, 13],
    ] as const) {
      const a = [-k, 0],
        b = [k, 0],
        c = [2, height],
        d = [-2, height];
      const dist2 = (p: number[], q: number[]) =>
        (p[0]! - q[0]!) ** 2 + (p[1]! - q[1]!) ** 2;
      expect(dist2(a, b)).toBe(4 * k * k);
      expect(dist2(c, d)).toBe(16);
      expect(dist2(a, d)).toBe(leg);
      expect(dist2(b, c)).toBe(leg);
      // Both bases horizontal, but the two directed legs have nonzero determinant.
      expect(
        (d[0]! - a[0]!) * (c[1]! - b[1]!) - (d[1]! - a[1]!) * (c[0]! - b[0]!),
      ).not.toBe(0);
      const proof = congruenceMotionRetrieval[u].questions[4]!;
      expect(proof.stem.en).toContain('Given only AB∥CD and BC∥AD');
      expect(proof.solution.en).toContain('ASA');
      expect(proof.solution.zh).toContain('△ABC≅△CDA');
    }
  });
  it('checks all translated/reflected vertices, preserved pair distances, fixed axes and reversed orientation', () => {
    const p = (s: string) => readCoordinate(s)!;
    const orient = (a: Coordinate, b: Coordinate, c: Coordinate) => {
      const dx = addR(b[0], negR(a[0])),
        dy = addR(b[1], negR(a[1]));
      const ex = addR(c[0], negR(a[0])),
        ey = addR(c[1], negR(a[1]));
      return textR(addR(mulR(dx, ey), negR(mulR(dy, ex))));
    };
    const cases = [
      {
        u: 'H05',
        original: ['(4,-1)', '(2,3)', '(1,0)'],
        vector: '(-3,2)',
        translated: ['(1,1)', '(-1,5)', '(-2,2)'],
        reflected: ['(-2,-1)', '(0,3)', '(1,0)'],
        det: '10',
      },
      {
        u: 'H06',
        original: ['(3,1)', '(-1,-1)', '(0,-2)'],
        vector: '(2,-3)',
        translated: ['(5,-2)', '(1,-4)', '(2,-5)'],
        reflected: ['(3,-5)', '(-1,-3)', '(0,-2)'],
        det: '6',
      },
    ];
    for (const c of cases) {
      const original = c.original.map(p);
      const translated = original.map((v) =>
        rigidImage(v, { kind: 'translate', vector: p(c.vector) }),
      );
      const reflected = original.map((v) =>
        c.u === 'H05'
          ? rigidImage(v, { kind: 'reflect', line: 'x=1' })
          : rigidImage(
              rigidImage(
                rigidImage(v, { kind: 'translate', vector: p('(0,2)') }),
                { kind: 'reflect', line: 'x-axis' },
              ),
              { kind: 'translate', vector: p('(0,-2)') },
            ),
      );
      expect(translated).toEqual(c.translated.map(p));
      expect(reflected).toEqual(c.reflected.map(p));
      expect(orient(original[0]!, original[1]!, original[2]!)).toBe(c.det);
      expect(orient(translated[0]!, translated[1]!, translated[2]!)).toBe(
        c.det,
      );
      expect(orient(reflected[0]!, reflected[1]!, reflected[2]!)).toBe(
        `-${c.det}`,
      );
      for (let i = 0; i < 3; i++)
        for (let j = i + 1; j < 3; j++) {
          expect(squaredDistance(translated[i]!, translated[j]!)).toEqual(
            squaredDistance(original[i]!, original[j]!),
          );
          expect(squaredDistance(reflected[i]!, reflected[j]!)).toEqual(
            squaredDistance(original[i]!, original[j]!),
          );
        }
      expect(textR(squaredDistance(original[0]!, original[1]!))).toBe('20');
      for (let i = 0; i < 3; i++)
        expect(
          textR(midpoint(original[i]!, reflected[i]!)[c.u === 'H05' ? 0 : 1]),
        ).toBe(c.u === 'H05' ? '1' : '-2');
      expect(reflected[2]).toEqual(original[2]);
      expect(
        congruenceMotionRetrieval[c.u as 'H05' | 'H06'].questions[5]!.solution
          .zh,
      ).toContain('√20');
    }
  });
  it('checks both nonorigin quarter-turn directions, half-turn midpoints and two-turn identity', () => {
    const p = (s: string) => readCoordinate(s)!;
    for (const [u, o, v, turns, image, half, square] of [
      ['H05', '(1,2)', '(4,3)', 1, '(0,5)', '(-2,1)', '10'],
      ['H06', '(-2,1)', '(1,3)', 3, '(0,-2)', '(-5,-1)', '13'],
    ] as const) {
      const center = p(o),
        original = p(v),
        rotated = rigidImage(original, { kind: 'rotate', center, turns });
      expect(rotated).toEqual(p(image));
      expect(textR(squaredDistance(center, original))).toBe(square);
      expect(squaredDistance(center, rotated)).toEqual(
        squaredDistance(center, original),
      );
      const turned = rigidImage(original, { kind: 'rotate', center, turns: 2 });
      expect(turned).toEqual(p(half));
      expect(midpoint(original, turned)).toEqual(center);
      expect(rigidImage(turned, { kind: 'rotate', center, turns: 2 })).toEqual(
        original,
      );
      expect(congruenceMotionRetrieval[u].questions[6]!.solution.zh).toContain(
        `P′=${image.replaceAll('-', '−')}`,
      );
    }
  });
  it('checks general area algebra, both numerical dissections, mixed units and exact positive length roots', () => {
    expect(equalPolynomial('(a+b)^2-2ab', 'a^2+b^2', ['a', 'b'])).toBe(true);
    for (const [u, a, b, c, rectangleSquare, otherLeg] of [
      ['H05', 5, 12, 13, 34, 12],
      ['H06', 8, 15, 17, 65, 15],
    ] as const) {
      const outer = (a + b) ** 2,
        four = (4 * a * b) / 2;
      expect(outer - four).toBe(c * c);
      expect(a * a + b * b).toBe(c * c);
      expect(c * c - a * a).toBe(otherLeg * otherLeg);
      expect(checkRootLength(`√${rectangleSquare}`, `${rectangleSquare}`)).toBe(
        true,
      );
      expect(
        checkRootLength(`-√${rectangleSquare}`, `${rectangleSquare}`),
      ).toBe(false);
      expect(checkRootLength(`${rectangleSquare}`, `${rectangleSquare}`)).toBe(
        false,
      );
      expect(congruenceMotionRetrieval[u].questions[7]!.solution.zh).toContain(
        `外面积${outer}`,
      );
      expect(congruenceMotionRetrieval[u].questions[8]!.solution.zh).toContain(
        `√${rectangleSquare} cm`,
      );
    }
    expect(3 ** 2 + (50 / 10) ** 2).toBe(34);
    expect((40 / 10) ** 2 + 7 ** 2).toBe(65);
  });
  it('checks every unordered triple and rejects degeneracy before acute/obtuse classification', () => {
    for (const [sides, kind] of [
      [['13', '5', '12'], 'right'],
      [['1', '2', '3'], 'impossible'],
      [['4', '5', '6'], 'acute'],
      [['2', '3', '4'], 'obtuse'],
      [['17', '8', '15'], 'right'],
      [['2', '3', '5'], 'impossible'],
      [['5', '6', '7'], 'acute'],
      [['3', '4', '6'], 'obtuse'],
      [['0', '1', '1'], 'impossible'],
    ] as const) {
      expect(pythagoreanClassification(sides)?.kind).toBe(kind);
      expect(pythagoreanClassification([...sides].reverse())?.kind).toBe(kind);
    }
    for (const s of sets) {
      expect(s.questions[9]!.solution.en).toContain('SSS');
      expect(s.questions[9]!.solution.en).toContain('fixed sides');
    }
  });
});
