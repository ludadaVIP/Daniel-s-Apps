import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { sequenceRecurrenceRetrieval } from './content/sequenceRecurrenceRetrieval';
import { sequenceRecurrenceEvidence } from './content/sequenceRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  sequenceIndex,
  recoverArithmetic,
  arithmeticTerm,
  arithmeticSum,
  arithmeticPairs,
  geometricTerm,
  geometricSum,
  geometricTail,
  geometricDefinition,
  adjacentRatio,
  savingsLedger,
  savingsFormula,
  type SavingsConfig,
} from './sequenceModels';
import { addR, divR, mulR, negR, rational, textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(sequenceRecurrenceRetrieval);
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
describe('sequence recurrence', () => {
  it('covers all six H07 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H07')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(sequenceRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of sequenceRecurrenceEvidence) {
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

  it('checks both complete rule witnesses at every observed index and a different fourth term without extending the declared domain', () => {
    for (const [unit, base, observed, fourths] of [
      ['H31', (n: number) => 3 * n - 1, [2, 5, 8], [11, 17]],
      ['H38', (n: number) => n * n, [1, 4, 9], [16, 22]],
    ] as const) {
      const other = (n: number) => base(n) + (n - 1) * (n - 2) * (n - 3);
      expect([1, 2, 3].map(base)).toEqual(observed);
      expect([1, 2, 3].map(other)).toEqual(observed);
      expect([base(4), other(4)]).toEqual(fourths);
      expect(
        sequenceRecurrenceRetrieval[`${unit}_SEQUENCE`].questions[0]!.solution
          .en,
      ).toContain('domain');
    }
    expect(() => sequenceIndex(0)).toThrow();
    expect(() => sequenceIndex(1.5)).toThrow();
  });
  it('recovers arithmetic parameters from distinct indices and retains multiple solutions for a duplicated observation', () => {
    for (const [p, ap, r, ar, first, step, index, value] of [
      [2, '5', 7, '20', '2', '3', 10, '29'],
      [3, '8', 9, '-4', '12', '-2', 6, '2'],
    ] as const) {
      const m = recoverArithmetic(p, R(ap), r, R(ar));
      expect(m.kind).toBe('unique');
      if (m.kind !== 'unique') throw Error('distinct observations');
      expect([textR(m.first), textR(m.step)]).toEqual([first, step]);
      expect(textR(arithmeticTerm(m.first, m.step, index))).toBe(value);
      expect(recoverArithmetic(p, R(ap), p, R(ap)).kind).toBe('insufficient');
      const zeroFirst = R(ap),
        oneFirst = addR(R(ap), rational(BigInt(1 - p)));
      expect(arithmeticTerm(zeroFirst, R('0'), p)).toEqual(
        arithmeticTerm(oneFirst, R('1'), p),
      );
      expect(arithmeticTerm(zeroFirst, R('0'), p + 1)).not.toEqual(
        arithmeticTerm(oneFirst, R('1'), p + 1),
      );
    }
  });
  it('checks two-copy pairing, signed partial sums and a symbolic difference identity including the empty sum', () => {
    for (const [first, step, n, sum, previous, last] of [
      ['2', '3', 10, '155', '126', '29'],
      ['12', '-2', 8, '40', '42', '-2'],
    ] as const) {
      const pairs = arithmeticPairs(R(first), R(step), n);
      expect(textR(pairs.sum)).toBe(sum);
      expect(textR(pairs.doubleSum)).toBe(textR(mulR(R('2'), R(sum))));
      expect(
        pairs.forward.map((x, i) => textR(addR(x, pairs.reverse[i]!))),
      ).toEqual(Array(n).fill(textR(pairs.pairTotal)));
      expect(textR(arithmeticSum(R(first), R(step), n - 1))).toBe(previous);
      expect(textR(addR(R(sum), negR(R(previous))))).toBe(last);
      expect(divR(R(sum), rational(BigInt(n)))).not.toEqual(R(last));
      expect(
        equalPolynomial(
          `n(${2 * Number(first)}+(n-1)(${step}))/2-(n-1)(${2 * Number(first)}+(n-2)(${step}))/2`,
          `${first}+(n-1)(${step})`,
          ['n'],
        ),
      ).toBe(true);
      expect(textR(arithmeticSum(R(first), R(step), 0))).toBe('0');
      expect(arithmeticSum(R(first), R(step), 1)).toEqual(R(first));
    }
  });
  it('checks alternating signs, n-minus-one indexing and the difference between zero recurrences and geometric definitions', () => {
    for (const [first, ratio, terms] of [
      ['8', '-1/2', ['8', '-4', '2', '-1', '1/2']],
      ['-3', '-2', ['-3', '6', '-12', '24', '-48']],
    ] as const) {
      expect(
        [1, 2, 3, 4, 5].map((n) => textR(geometricTerm(R(first), R(ratio), n))),
      ).toEqual(terms);
      expect(
        [1, 2, 3, 4].map((n) => textR(adjacentRatio(R(first), R(ratio), n)!)),
      ).toEqual(Array(4).fill(ratio));
      expect(geometricDefinition(R(first), R(ratio))).toBe(true);
      expect(
        [1, 2, 3].map((n) => textR(geometricTerm(R(first), R('0'), n))),
      ).toEqual([first, '0', '0']);
      expect(adjacentRatio(R(first), R('0'), 2)).toBeNull();
      expect(geometricDefinition(R(first), R('0'))).toBe(false);
    }
    expect(geometricDefinition(R('0'), R('1'))).toBe(false);
    expect(adjacentRatio(R('0'), R('1'), 1)).toBeNull();
  });
  it('retains finite tails, verifies exact term sums and handles q1 without division by zero', () => {
    for (const [first, ratio, n, sum, candidate, gap, unitSum] of [
      ['3', '1/2', 4, '45/8', '6', '3/8', '12'],
      ['-2', '-1/2', 5, '-11/8', '-4/3', '1/24', '-10'],
    ] as const) {
      const actual = geometricSum(R(first), R(ratio), n),
        oneMinus = addR(R('1'), negR(R(ratio)));
      expect(textR(actual)).toBe(sum);
      const direct = Array.from({ length: n }, (_, i) =>
        geometricTerm(R(first), R(ratio), i + 1),
      ).reduce(addR, R('0'));
      expect(actual).toEqual(direct);
      expect(mulR(oneMinus, actual)).toEqual(
        addR(R(first), negR(geometricTail(R(first), R(ratio), n))),
      );
      expect(textR(divR(R(first), oneMinus))).toBe(candidate);
      expect(textR(addR(R(candidate), negR(actual)))).toBe(gap);
      expect(textR(geometricSum(R(first), R('1'), n))).toBe(unitSum);
      expect(textR(geometricSum(R(first), R(ratio), 0))).toBe('0');
    }
  });
  it('checks every two-period ledger step and independently sums timed deposits through n0 and q1', () => {
    for (const [initial, q, c, end, start] of [
      ['80', '3/2', '4', ['124', '190'], ['126', '195']],
      ['60', '1/2', '6', ['36', '24'], ['33', '39/2']],
    ] as const) {
      const config: SavingsConfig = {
        initial: R(initial),
        multiplier: R(q),
        deposit: R(c),
        timing: 'end',
        policy: 'ideal',
      };
      expect(
        savingsLedger(config, 2).rows.map((r) => textR(r.closing)),
      ).toEqual(end);
      expect(
        savingsLedger({ ...config, timing: 'start' }, 2).rows.map((r) =>
          textR(r.closing),
        ),
      ).toEqual(start);
      const ratios = [divR(R(end[0]), R(initial)), divR(R(end[1]), R(end[0]))];
      expect(ratios[0]).not.toEqual(ratios[1]);
      for (const timing of ['end', 'start'] as const)
        for (const n of [0, 1, 2, 5]) {
          const cfg = { ...config, timing };
          expect(savingsFormula(cfg, n)).toEqual(savingsLedger(cfg, n).balance);
          const contributions = Array.from({ length: n }, (_, j) =>
            geometricTerm(R(c), R(q), j + (timing === 'start' ? 2 : 1)),
          ).reduce(addR, R('0'));
          const initialAfter = geometricTerm(R(initial), R(q), n + 1);
          expect(savingsFormula(cfg, n)).toEqual(
            addR(initialAfter, contributions),
          );
          expect(savingsFormula({ ...cfg, multiplier: R('1') }, n)).toEqual(
            addR(R(initial), mulR(R(c), rational(BigInt(n)))),
          );
        }
    }
  });
});
