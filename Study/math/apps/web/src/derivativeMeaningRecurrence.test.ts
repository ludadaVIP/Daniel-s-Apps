import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { derivativeMeaningRetrieval } from './content/derivativeMeaningRetrieval';
import { derivativeMeaningRecurrence } from './content/derivativeMeaningRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  rateModel,
  secantModel,
  tangentModel,
  cornerModel,
  calculusPolynomial,
  differentiate,
  valueAt,
  derivativeText,
  subtractR,
} from './calculusModels';
import { textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
import { checkPlaneEquation } from './conicModels';
const sets = Object.values(derivativeMeaningRetrieval);
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
describe('derivative meaning recurrence', () => {
  it('covers all six H25 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H25')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(derivativeMeaningRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of derivativeMeaningRecurrence) {
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

  it('checks both full motion increments,segmented distances,shift invariance and zero-time undefined ratios', () => {
    for (const c of [1, 2]) {
      const raw = `(x-${c})^2`,
        end = 2 * c,
        m = rateModel(raw, '0', String(end));
      expect([m.fa, m.fb, m.dy, m.dx, m.average!].map(textR)).toEqual([
        String(c * c),
        String(c * c),
        '0',
        String(end),
        '0',
      ]);
      expect(textR(valueAt(m.p, R(String(c))))).toBe('0');
      expect((c * c + c * c) / end).toBe(c);
      const shifted = rateModel(`${raw}+7`, '0', String(end));
      expect(shifted.average).toEqual(m.average);
      expect(shifted.dy).toEqual(m.dy);
      expect(rateModel(raw, String(c), String(c)).average).toBeNull();
    }
  });
  it('checks the whole cubic increment identity,both current secants and original zero-increment holes', () => {
    expect(equalPolynomial('(a+h)^3-a^3', 'h(3a^2+3ah+h^2)', ['a', 'h'])).toBe(
      true,
    );
    for (const [a, h, q, d, error] of [
      ['2', '1/2', '61/4', '12', '13/4'],
      ['-1', '-1/2', '19/4', '3', '7/4'],
    ] as const) {
      const m = secantModel('x^3', a, h);
      expect(textR(m.average!)).toBe(q);
      expect(textR(m.derivative)).toBe(d);
      expect(textR(subtractR(m.average!, m.derivative))).toBe(error);
      expect(secantModel('x^3', a, '0').average).toBeNull();
    }
  });
  it('checks exact hole cancellation while retaining the point exclusion and distinct jump sides', () => {
    for (const [a, patch, left, right] of [
      [2, 9, 1, 5],
      [-1, 7, -4, 0],
    ] as const) {
      expect(equalPolynomial(`x^2-${a * a}`, `(x-(${a}))(x+(${a}))`)).toBe(
        true,
      );
      expect(2 * a).not.toBe(patch);
      expect(left).not.toBe(right);
      const average = (left + right) / 2;
      expect(average).not.toBe(left);
      expect(average).not.toBe(right);
      // The full cancellation identity is general;no finite table is promoted to a limit proof.
      expect(valueAt(calculusPolynomial(`x+(${a})`), R(String(a)))).toEqual(
        R(String(2 * a)),
      );
    }
  });
  it('checks corner quotient sides and shifted cubics with horizontal nonconstant crossing', () => {
    expect(cornerModel('0', '-1/10').average).toEqual(R('-1'));
    expect(cornerModel('0', '1/10').average).toEqual(R('1'));
    expect(cornerModel('0', '1/10').derivative).toBeNull();
    expect(cornerModel('0', '0').average).toBeNull();
    for (const a of [2, -1]) {
      const raw = `(x-(${a}))^3`,
        p = calculusPolynomial(raw);
      expect(valueAt(p, R(String(a)))).toEqual(R('0'));
      expect(valueAt(differentiate(p), R(String(a)))).toEqual(R('0'));
      expect(valueAt(p, R(String(a - 1)))).toEqual(R('-1'));
      expect(valueAt(p, R(String(a + 1)))).toEqual(R('1'));
    }
  });
  it('checks derivative functions separately from values,and repairs both erroneous products through expansion', () => {
    for (const [raw, derivative, value, slope] of [
      ['2x^4-3x^2+7', '8x^3-6x', '6', '2'],
      ['-x^4+4x^3-2', '-4x^3+12x^2', '1', '8'],
    ] as const) {
      expect(equalPolynomial(derivativeText(raw), derivative)).toBe(true);
      const m = tangentModel(raw, '1');
      expect(textR(m.y)).toBe(value);
      expect(textR(m.slope)).toBe(slope);
    }
    for (const [raw, expanded, right, wrong, atOne] of [
      ['x^2(x^2+1)', 'x^4+x^2', '4x^3+2x', '4x^2', '6'],
      ['x^2(x-2)', 'x^3-2x^2', '3x^2-4x', '2x', '-1'],
    ] as const) {
      expect(equalPolynomial(raw, expanded)).toBe(true);
      expect(equalPolynomial(derivativeText(expanded), right)).toBe(true);
      expect(textR(valueAt(calculusPolynomial(right), R('1')))).toBe(atOne);
      expect(valueAt(calculusPolynomial(wrong), R('1'))).not.toEqual(R(atOne));
    }
    expect(derivativeText('7')).toBe('0');
  });
  it('checks complete tangents,all intersection factorizations and crossing without importing circle-only definitions', () => {
    for (const [raw, a, line, factor, ys, wrong] of [
      [
        'x^3-3x',
        '-1',
        'y=2',
        '(x+1)^2(x-2)',
        [
          [-1, 2],
          [2, 2],
        ],
        'y=x+3',
      ],
      [
        'x^3-6x',
        '1',
        'y=-3x-2',
        '(x-1)^2(x+2)',
        [
          [1, -5],
          [-2, 4],
        ],
        'y=x-6',
      ],
    ] as const) {
      const tangent = tangentModel(raw, a);
      expect(checkPlaneEquation(tangent.equation, line)).toBe(true);
      expect(
        equalPolynomial(
          `${raw}-(${textR(tangent.slope)}x+(${textR(tangent.intercept)}))`,
          factor,
        ),
      ).toBe(true);
      for (const [x, y] of ys)
        expect(valueAt(tangent.p, R(String(x)))).toEqual(R(String(y)));
      expect(checkPlaneEquation(wrong, line)).toBe(false);
    }
    const zero = tangentModel('x^3', '0');
    expect(checkPlaneEquation(zero.equation, 'y=0')).toBe(true);
    expect(valueAt(zero.p, R('-1'))).toEqual(R('-1'));
    expect(valueAt(zero.p, R('1'))).toEqual(R('1'));
  });
});
