import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { exponentialLogRetrieval } from './content/exponentialLogRetrieval';
import { exponentialLogRecurrence } from './content/exponentialLogRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  exactLog,
  exponentialAt,
  firstWholeStep,
  integerPower,
  rationalPower,
  validLogBase,
} from './exponentialModels';
import { divR, mulR, textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { solveQuadratic } from './quadraticModels';
import { checkRadicalSet } from './quadraticModels';
import {
  readRadical,
  multiplyRadicals,
  sameRadical,
  radicalText,
} from './radicalModels';
const sets = Object.values(exponentialLogRetrieval);
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
describe('exponential and logarithmic recurrence', () => {
  it('covers all six H03 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H03')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(exponentialLogRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of exponentialLogRecurrence) {
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

  it('checks reciprocal products and quotients separately from addition, parentheses and zero exclusion', () => {
    expect(textR(mulR(integerPower(R('3'), -2), integerPower(R('3'), 5)))).toBe(
      '27',
    );
    expect(textR(divR(integerPower(R('5'), 3), integerPower(R('5'), 5)))).toBe(
      '1/25',
    );
    expect(3 ** 2 + 3 ** 3).toBe(36);
    expect(5 ** 2 + 5 ** 3).toBe(150);
    for (const [b, n, value] of [
      [-2, 4, 16],
      [-3, 2, 9],
    ] as const) {
      expect(textR(integerPower(R(`${b}`), n))).toBe(`${value}`);
      expect(-((-b) ** n)).toBe(-value);
      expect(
        textR(mulR(integerPower(R(`${b}`), n), integerPower(R(`${b}`), -n))),
      ).toBe('1');
    }
    expect(() => integerPower(R('0'), -2)).toThrow();
    expect(() => integerPower(R('0'), -3)).toThrow();
  });
  it('checks positive rational powers exactly and exhibits incompatible negative-base procedures without widening the model convention', () => {
    for (const [base, root, result, negative, degree, odd, positive] of [
      ['16', '2', '1/8', -27n, 6n, 3n, 3n],
      ['81', '3', '1/27', -32n, 10n, 5n, 2n],
    ] as const) {
      expect(textR(rationalPower(R(base), R('1/4'))!)).toBe(root);
      expect(textR(rationalPower(R(base), R('-3/4'))!)).toBe(result);
      expect(positive ** degree).toBe(negative ** 2n);
      expect((-positive) ** odd).toBe(negative);
      expect(() => rationalPower([negative, 1n], R('1/3'))).toThrow();
    }
  });
  it('checks growth and decay model ambiguity, exact adjacent thresholds, directions and time-unit conversion', () => {
    for (const [u, initial, multiplier, target, values] of [
      ['H31', '3', '2', '20', ['3', '6', '12', '24']],
      ['H35', '80', '1/2', '12', ['80', '40', '20', '10']],
    ] as const) {
      expect(
        [0, 1, 2, 3].map((n) =>
          textR(exponentialAt(R(initial), R(multiplier), n)),
        ),
      ).toEqual(values);
      expect(firstWholeStep(R(initial), R(multiplier), R(target))).toBe(3);
      const threshold =
        u === 'H31'
          ? Math.log(20 / 3) / Math.log(2)
          : Math.log(3 / 20) / Math.log(1 / 2);
      expect(threshold).toBeGreaterThan(2);
      expect(threshold).toBeLessThan(3);
      // These integer checks certify the first integer under the stated
      // monotonic model, not the existence of that mechanism from two points.
      const alternate = (t: number) =>
        u === 'H31' ? 3 * (1 + t) : 80 / (t + 1);
      expect([0, 1].map(alternate)).toEqual(values.slice(0, 2).map(Number));
      expect(alternate(2)).not.toBe(Number(values[2]));
      expect(exponentialLogRetrieval[u].questions[2]!.solution.en).toContain(
        'Two points are insufficient',
      );
    }
    expect(textR(integerPower(R('2'), 24))).toBe('16777216');
    expect((0.5 ** (1 / 24)) ** 24).toBeCloseTo(0.5, 12);
  });
  it('checks logarithmic inverse values, both kinds of domain failure and legal decreasing bases', () => {
    for (const [base, value] of [
      ['4', '1/8'],
      ['9', '1/27'],
    ] as const) {
      expect(textR(exactLog(R(base), R(value))!)).toBe('-3/2');
      expect(textR(rationalPower(R(base), R('-3/2'))!)).toBe(value);
    }
    for (const base of ['0', '-2', '1']) {
      expect(validLogBase(R(base))).toBe(false);
      expect(() => exactLog(R(base), R('1'))).toThrow();
    }
    expect(() => exactLog(R('2'), R('-1'))).toThrow();
    expect(textR(exactLog(R('1/2'), R('1/8'))!)).toBe('3');
    expect(validLogBase(R('1/2'))).toBe(true);
  });
  it('checks product/quotient logs, exact sum counterexamples and complete algebraic candidates against the original domains', () => {
    const p = exactLog(R('2'), R('8'))!,
      q = exactLog(R('2'), R('4'))!;
    expect(textR(exactLog(R('2'), R('32'))!)).toBe(
      textR([p[0] * q[1] + q[0] * p[1], p[1] * q[1]]),
    );
    expect(textR(exactLog(R('2'), R('2'))!)).toBe('1');
    expect(textR(exactLog(R('2'), R('16'))!)).toBe('4');
    expect(2 * Number(textR(p))).toBe(6);
    expect(exactLog(R('3'), R('18'))).toBeNull();
    expect(3 ** 4).toBe(81);
    for (const [equation, positive, negative] of [
      ['(x-2)(x+2)=32', '6', '-6'],
      ['(x-1)(x+1)=9', '√10', '-√10'],
    ] as const) {
      const roots = solveQuadratic(equation).roots!;
      expect(roots).toHaveLength(2);
      expect(
        checkRadicalSet(`{${positive},${negative}}`, roots.map(radicalText)),
      ).toBe(true);
      const x = readRadical(positive)!;
      expect(
        sameRadical(
          multiplyRadicals(x, x),
          readRadical(positive === '6' ? '36' : '10')!,
        ),
      ).toBe(true);
      // Negative candidates put both original linear arguments below zero;
      // their positive product alone cannot license the original logs.
      const approximate = positive === '6' ? 6 : Math.sqrt(10),
        shift = positive === '6' ? 2 : 1;
      expect(approximate - shift).toBeGreaterThan(0);
      expect(-approximate + shift).toBeLessThan(0);
    }
  });
});
