import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { complexRecurrenceRetrieval } from './content/complexRecurrenceRetrieval';
import { complexRecurrenceEvidence } from './content/complexRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  complex,
  complexI,
  complexZero,
  complexText,
  readComplex,
  addComplex,
  subtractComplex,
  multiplyComplex,
  negateComplex,
  conjugateComplex,
  squareModulus,
  modulusComplex,
  divideComplex,
  powerComplex,
  powerI,
  squareEquationRoots,
  transformComplex,
} from './complexModels';
import { textR } from './algebraModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(complexRecurrenceRetrieval);
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
describe('complex recurrence', () => {
  it('covers all five H21 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H21')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(complexRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of complexRecurrenceEvidence) {
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

  it('checks both complete root factorisations and reciprocal cycles without extending parser bounds', () => {
    expect(squareEquationRoots(-9, 'real')).toEqual([]);
    expect(squareEquationRoots(-9, 'complex').map(complexText)).toEqual([
      '3i',
      '-3i',
    ]);
    // This polynomial identity underlies the zero-product argument for all u.
    for (const r of ['3', '4']) {
      expect(equalPolynomial('(u-v)(u+v)', 'u^2-v^2', ['u', 'v'])).toBe(true);
      for (const sign of ['', '-'])
        expect(complexText(powerComplex(readComplex(`${sign}${r}i`), 2))).toBe(
          `-${Number(r) ** 2}`,
        );
    }
    expect([-7, 14, -9, 23].map((n) => complexText(powerI(n)))).toEqual([
      'i',
      '-1',
      '-i',
      '-i',
    ]);
    expect(complexText(divideComplex(complex('1', '0'), complexI()))).toBe(
      '-i',
    );
    expect(powerI(-7)).toEqual(powerComplex(complexI(), -7));
  });
  it('checks real parameter pairs and distinct complex counterpairs, retaining real imaginary coefficients', () => {
    for (const [a, b, want, first] of [
      ['3', '-4', '2-5i', true],
      ['5', '-4+i', '2-5i', true],
      ['-2', '6', '-3+4i', false],
      ['-1', '6+2i', '-3+4i', false],
    ] as const) {
      const A = readComplex(a),
        B = readComplex(b);
      const value = first
        ? addComplex(
            subtractComplex(A, complex('1', '0')),
            multiplyComplex(
              addComplex(
                multiplyComplex(complex('2', '0'), B),
                complex('3', '0'),
              ),
              complexI(),
            ),
          )
        : addComplex(
            addComplex(
              multiplyComplex(complex('2', '0'), A),
              complex('1', '0'),
            ),
            multiplyComplex(subtractComplex(B, complex('2', '0')), complexI()),
          );
      expect(value).toEqual(readComplex(want));
    }
    expect(readComplex('-5i').map(textR)).toEqual(['0', '-5']);
    expect(readComplex('4i').map(textR)).toEqual(['0', '4']);
  });
  it('checks every distributed result and the whole real/imaginary square identities', () => {
    for (const [a, b, sum, diff, product, square] of [
      ['2-3i', '-1+2i', '1-i', '3-5i', '4+7i', '-5-12i'],
      ['-2+i', '3-2i', '1-i', '-5+3i', '-4+7i', '3-4i'],
    ] as const) {
      const z = readComplex(a),
        w = readComplex(b);
      expect(
        [
          addComplex(z, w),
          subtractComplex(z, w),
          multiplyComplex(z, w),
          powerComplex(z, 2),
        ].map(complexText),
      ).toEqual([sum, diff, product, square]);
    }
    expect(equalPolynomial('a*a-b*b', 'a^2-b^2', ['a', 'b'])).toBe(true);
    expect(equalPolynomial('a*b+b*a', '2ab', ['a', 'b'])).toBe(true);
  });
  it('checks conjugation, squared norms, exact quotient recovery and zero boundaries', () => {
    for (const [raw, conj, negative, mod, norm, numerator, quotient] of [
      ['3-4i', '3+4i', '-3+4i', '5', '25', '2+i', '(2+11i)/25'],
      ['-5+12i', '-5-12i', '5-12i', '13', '169', '1-2i', '(-29-2i)/169'],
    ] as const) {
      const z = readComplex(raw),
        q = divideComplex(readComplex(numerator), z);
      expect(complexText(conjugateComplex(z))).toBe(conj);
      expect(complexText(negateComplex(z))).toBe(negative);
      expect(modulusComplex(z)).toBe(mod);
      expect(textR(squareModulus(z))).toBe(norm);
      expect(multiplyComplex(z, conjugateComplex(z))).toEqual(
        complex(norm, '0'),
      );
      expect(q).toEqual(readComplex(quotient));
      expect(multiplyComplex(q, z)).toEqual(readComplex(numerator));
    }
    expect(() => divideComplex(complexI(), complexZero())).toThrow();
    expect(conjugateComplex(complexZero())).toEqual(complexZero());
    expect(modulusComplex(complexZero())).toBe('0');
    // Real-part equality a=-a is equivalent to 2a=0; no condition on b.
    expect(equalPolynomial('a-(-a)', '2a', ['a'])).toBe(true);
  });
  it('checks actual equal-scale givens, centred images, circles, inverse and affine origin images', () => {
    for (const [key, c, z, w, image, norm, zeroImage] of [
      ['H35_COMPLEX', '1+2i', '4+i', '3-i', '2+5i', '10', '3+i'],
      ['H37', '-2+i', '1+5i', '3+4i', '-6+4i', '25', '-1+3i'],
    ] as const) {
      const q = complexRecurrenceRetrieval[key].questions[4]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual coordinates');
      expect(d.points).toHaveLength(2);
      expect(d.points!.map((p) => p.label)).toEqual(['C', 'Z']);
      expect(d.curves).toHaveLength(1);
      expect(d.curves![0]!.points).toEqual(d.points);
      expect(400 / (d.bounds.xMax - d.bounds.xMin)).toBe(
        280 / (d.bounds.yMax - d.bounds.yMin),
      );
      const C = readComplex(c),
        Z = readComplex(z),
        W = subtractComplex(Z, C),
        V = transformComplex(Z, 'turn-centre', C);
      expect(W).toEqual(readComplex(w));
      expect(V).toEqual(readComplex(image));
      expect(textR(squareModulus(W))).toBe(norm);
      expect(squareModulus(subtractComplex(V, C))).toEqual(squareModulus(W));
      expect(
        subtractComplex(C, multiplyComplex(complexI(), subtractComplex(V, C))),
      ).toEqual(Z);
      expect(transformComplex(C, 'turn-centre', C)).toEqual(C);
      expect(
        complexText(transformComplex(complexZero(), 'turn-centre', C)),
      ).toBe(zeroImage);
      expect(multiplyComplex(complexI(), W)).toEqual([
        W[1].map((n, i) => (i === 0 ? -n : n)),
        W[0],
      ]);
      for (const point of d.points!)
        expect(d.caption!.en).toContain(
          `${point.label}(${point.x},${point.y})`,
        );
    }
    expect(equalPolynomial('(-b)^2+a^2', 'a^2+b^2', ['a', 'b'])).toBe(true);
  });
});
