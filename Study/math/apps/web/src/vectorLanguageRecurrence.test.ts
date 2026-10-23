import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { vectorLanguageRetrieval } from './content/vectorLanguageRetrieval';
import { vectorLanguageRecurrence } from './content/vectorLanguageRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  addVec3,
  subVec3,
  scaleVec3,
  squareVec3,
  spatialAngle,
  vec3,
} from './spaceVectorModels';
import {
  addV,
  subtractV,
  scaleV,
  squareV,
  readVector,
  multipleV,
  angleV,
  vectorZero,
} from './vectorModels';
import { readRational as R } from './rationalModels';
import { textR } from './algebraModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(vectorLanguageRetrieval);
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
describe('vector language recurrence', () => {
  it('covers all six H05 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H05')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(vectorLanguageRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of vectorLanguageRecurrence) {
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
  it('keeps eight bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(4);
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

  it('checks nonorigin displacements, opposite equal lengths and simultaneous-translation invariants in two and three dimensions', () => {
    const a = vec3(2, -1, 4),
      b = vec3(5, 3, 2),
      w = vec3(-1, 2, 3),
      u = subVec3(b, a);
    expect(u.map(textR)).toEqual(['3', '4', '-2']);
    expect(addVec3(a, w).map(textR)).toEqual(['1', '1', '7']);
    expect(addVec3(b, w).map(textR)).toEqual(['4', '5', '5']);
    expect(subVec3(addVec3(b, w), addVec3(a, w))).toEqual(u);
    expect(textR(squareVec3(u))).toBe('29');
    expect(squareVec3(subVec3(a, b))).toEqual(squareVec3(u));
    expect(spatialAngle(u, subVec3(a, b)).kind).toBe('straight');
    const A = readVector('(-2,3)'),
      B = readVector('(4,1)'),
      W = readVector('(3,-4)'),
      U = subtractV(B, A);
    expect(U.map(textR)).toEqual(['6', '-2']);
    expect(subtractV(addV(B, W), addV(A, W))).toEqual(U);
    expect(addV(A, W).map(textR)).toEqual(['1', '-1']);
    expect(addV(B, W).map(textR)).toEqual(['7', '-3']);
    expect(textR(squareV(U))).toBe('40');
    expect(angleV(U, subtractV(A, B)).kind).toBe('straight');
    expect(angleV(vectorZero, U).kind).toBe('undefined');
  });
  it('checks head-to-tail sums and both directed head differences with inverse recovery', () => {
    const u = vec3(1, 2, -1),
      v = vec3(-2, 1, 3),
      difference = subVec3(u, v);
    expect(addVec3(u, v).map(textR)).toEqual(['-1', '3', '2']);
    expect(difference.map(textR)).toEqual(['3', '1', '-4']);
    expect(subVec3(v, u)).toEqual(scaleVec3(R('-1'), difference));
    expect(addVec3(difference, v)).toEqual(u);
    const U = readVector('(2,-1)'),
      V = readVector('(-1,3)'),
      D = subtractV(U, V);
    expect(addV(U, V).map(textR)).toEqual(['1', '2']);
    expect(D.map(textR)).toEqual(['3', '-4']);
    expect(subtractV(V, U)).toEqual(scaleV(R('-1'), D));
    expect(addV(D, V)).toEqual(U);
  });
  it('checks negative scalar direction/length and all, unique and impossible zero-source equations', () => {
    const u = vec3(2, -4, 2),
      v = scaleVec3(R('-3/2'), u);
    expect(v.map(textR)).toEqual(['-3', '6', '-3']);
    expect([textR(squareVec3(u)), textR(squareVec3(v))]).toEqual(['24', '54']);
    expect(spatialAngle(u, v).kind).toBe('straight');
    const U = readVector('(-3,6)'),
      V = scaleV(R('-2/3'), U);
    expect(V.map(textR)).toEqual(['2', '-4']);
    expect([textR(squareV(U)), textR(squareV(V))]).toEqual(['45', '20']);
    expect(angleV(U, V).kind).toBe('straight');
    const unique = multipleV(U, vectorZero);
    expect(unique.kind).toBe('unique');
    if (unique.kind === 'unique') expect(textR(unique.factor)).toBe('0');
    expect(multipleV(vectorZero, vectorZero).kind).toBe('all');
    expect(multipleV(vectorZero, readVector('(0,1)')).kind).toBe('none');
    for (const k of ['-3/2', '0', '5'])
      expect(scaleVec3(R(k), vec3(0, 0, 0))).toEqual(vec3(0, 0, 0));
  });
  it('verifies the general diagonal identity and both explicit missing-premise counterexamples', () => {
    // Summing this identity for every coordinate gives4u·v without
    // assuming rectangular structure or using finitely many examples as proof.
    expect(equalPolynomial('(u+v)^2-(u-v)^2', '4uv', ['u', 'v'])).toBe(true);
    for (const [a, b, c, d, square, baseLengths] of [
      [
        vec3(-3, 0, 1),
        vec3(3, 0, 1),
        vec3(2, 2, 1),
        vec3(-2, 2, 1),
        '29',
        ['36', '16'],
      ],
      [
        vec3(-4, 0, 0),
        vec3(4, 0, 0),
        vec3(1, 3, 0),
        vec3(-1, 3, 0),
        '34',
        ['64', '4'],
      ],
    ] as const) {
      expect(textR(squareVec3(subVec3(c, a)))).toBe(square);
      expect(textR(squareVec3(subVec3(d, b)))).toBe(square);
      expect([
        textR(squareVec3(subVec3(b, a))),
        textR(squareVec3(subVec3(d, c))),
      ]).toEqual(baseLengths);
      expect(subVec3(b, a)).not.toEqual(subVec3(c, d));
    }
  });
});
