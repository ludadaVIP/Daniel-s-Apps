import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { maintenanceSets } from './content/maintenance';
import { coreAlgebraRetrieval } from './content/coreAlgebraRetrieval';
import { coreAlgebraRecurrence } from './content/coreAlgebraRecurrence';
import { checkAnswer } from './model';
import { equalPolynomial } from './polynomialModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(coreAlgebraRetrieval);
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
type F = [number, number];
const f = (n: number, d = 1): F => {
  if (d === 0) throw new Error('undefined rational');
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.abs(n), Math.abs(d));
  return [(Math.sign(d) * n) / g, Math.abs(d) / g];
};
const add = (a: F, b: F) => f(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a: F, b: F) => add(a, [-b[0], b[1]]);
const mul = (a: F, b: F) => f(a[0] * b[0], a[1] * b[1]);
const div = (a: F, b: F) => f(a[0] * b[1], a[1] * b[0]);
const has = (u: 'J83' | 'J84', i: number, fragment: string) =>
  expect(
    coreAlgebraRetrieval[u].questions[i - 1]!.solution.zh.replaceAll('−', '-'),
  ).toContain(fragment);
describe('core rational and algebra recurrence', () => {
  it('retrieves all seventeen actual J71-J73 skills through exact later-unit tasks', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J71', 'J72', 'J73'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(17);
    expect(new Set(coreAlgebraRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of coreAlgebraRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        l.questions.some((q) => q.id === e.sourceTask && q.skill === e.skill),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(l.unit!),
          );
          const link = recurrenceLinksFor(l.id)
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
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
    }
  });
  it('keeps sixteen bilingual model arguments human-reviewed and outside original checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(16);
    for (const s of sets) {
      expect(s.questions).toHaveLength(8);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer(
            '25/2 17/3 -23/2 zero original reciprocal same unit',
            q.answer,
          ),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('independently checks exact rational cancellation, directions, scaling and expression structure', () => {
    expect(f(-10, 8)).toEqual(f(-5, 4));
    expect(f(-21, 6)).toEqual(f(-7, 2));
    for (const [u, a, b, result, negativeSum, scale, quot, product] of [
      [
        'J83',
        f(-5, 6),
        f(3, 4),
        f(-1, 12),
        f(-19, 12),
        f(-2, 3),
        f(5, 4),
        f(-5, 9),
      ],
      [
        'J84',
        f(-7, 8),
        f(5, 6),
        f(-1, 24),
        f(-41, 24),
        f(-3, 4),
        f(7, 6),
        f(-21, 32),
      ],
    ] as const) {
      expect(add([...a], [...b])).toEqual([...result]);
      expect(sub([...a], [-b[0], b[1]])).toEqual([...result]);
      expect(sub([...a], [...b])).toEqual([...negativeSum]);
      expect(sub([...result], [...b])).toEqual([...a]);
      expect(div([...a], [...scale])).toEqual([...quot]);
      expect(mul([...quot], [...scale])).toEqual([...a]);
      expect(mul([-a[0], a[1]], [...scale])).toEqual([...product]);
      has(u, 3, `${result[0]}/${result[1]}`);
      has(u, 4, `${negativeSum[0]}/${negativeSum[1]}`);
      has(u, 5, `${quot[0]}/${quot[1]}`);
      has(u, 5, `${product[0]}/${product[1]}`);
    }
    expect(sub(f(-1, 3), f(-7, 6))).toEqual(f(5, 6));
    expect(sub(f(1, 3), f(-7, 6))).toEqual(f(3, 2));
    expect(sub(f(-1, 4), f(-9, 8))).toEqual(f(7, 8));
    expect(sub(f(1, 4), f(-9, 8))).toEqual(f(11, 8));
    expect(add(mul(div(f(-8), f(2)), f(-3)), f(1, 2))).toEqual(f(25, 2));
    expect(add(div(f(-8), mul(f(2), f(-3))), f(1, 2))).toEqual(f(11, 6));
    expect(sub(mul(div(f(-9), f(3)), f(-2)), f(1, 3))).toEqual(f(17, 3));
    expect(sub(div(f(-9), mul(f(3), f(-2))), f(1, 3))).toEqual(f(7, 6));
    has('J83', 6, '25/2');
    has('J83', 6, '11/6');
    has('J84', 6, '17/3');
    has('J84', 6, '7/6');
    expect(() => div(f(1), f(0))).toThrow('undefined rational');
  });
  it('checks polynomial identities generally and original fraction equations by exact substitution', () => {
    expect(equalPolynomial('(3x^2-2x+4)-(x^2+5x-6)', '2x^2-7x+10', ['x'])).toBe(
      true,
    );
    expect(equalPolynomial('(4y^2+y-3)-(2y^2-5y+7)', '2y^2+6y-10', ['y'])).toBe(
      true,
    );
    expect(equalPolynomial('2x^2-7x+10+x^2+5x-6', '3x^2-2x+4', ['x'])).toBe(
      true,
    );
    expect(equalPolynomial('2y^2+6y-10+2y^2-5y+7', '4y^2+y-3', ['y'])).toBe(
      true,
    );
    has('J83', 7, '2x²-7x+10');
    has('J84', 7, '2y²+6y-10');
    expect(
      add(sub(div(sub(f(1), f(2)), f(3)), div(add(f(1), f(1)), f(4))), f(1)),
    ).toEqual(f(1, 6));
    const y = f(-23, 2);
    expect(
      add(sub(div(add(y, f(1)), f(2)), div(sub(y, f(2)), f(3))), f(1)),
    ).toEqual(f(1, 4));
    expect(equalPolynomial('4(x-2)-3(x+1)+12-2', 'x-1', ['x'])).toBe(true);
    expect(equalPolynomial('6(y+1)-4(y-2)+12-3', '2y+23', ['y'])).toBe(true);
    has('J83', 8, 'x=1');
    has('J84', 8, 'y=-23/2');
    expect(equalPolynomial('x^2', 'x', ['x'])).toBe(false);
  });
});
