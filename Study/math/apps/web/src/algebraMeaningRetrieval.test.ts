import { describe, it, expect } from 'vitest';
import { algebraMeaningRetrieval } from './content/algebraMeaningRetrieval';
import { relationsRecurrence } from './content/relationsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  algebraEquation,
  parseAffine,
  evaluateAffine,
  equivalentExpression,
  rational,
  textR,
  solveAlgebra,
  transformEquation,
  sameSolutions,
  growingRows,
  type Rational,
} from './algebraModels';
const sets = Object.values(algebraMeaningRetrieval);
const raw = (i: number, q: number, k: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const n = (i: number, q: number, k: string) => Number(raw(i, q, k));
const at = (expression: string, value: Rational, variable = 'n') =>
  textR(evaluateAffine(parseAffine(expression, variable)!, value));
const solution = (left: string, right: string) =>
  solveAlgebra(algebraEquation(left, right));
describe('P65 letter values, complete constructions and reversible operations', () => {
  it('preserves all eleven original targets and binds ten human-reviewed cards to their exact source models', () => {
    const evidence = relationsRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P65-'),
    );
    expect(evidence.flatMap((e) => e.targets)).toHaveLength(21);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(21);
    expect(
      evidence.flatMap((e) =>
        e.targets.filter((id) => !id.includes('ALGEBRA-MEANING')),
      ),
    ).toHaveLength(11);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of evidence.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(s.bridgeByQuestion[q.id]).toBe(e.sourceLesson);
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P65'));
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.hints).toHaveLength(2);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
      }
    for (const e of relationsRecurrence.filter(
      (e) => !e.sourceLesson.startsWith('P65-'),
    ))
      expect(e.targets.every((t) => !t.includes('ALGEBRA-MEANING'))).toBe(true);
    expect(
      relationsRecurrence
        .filter((e) => e.sourceLesson.startsWith('P64-'))
        .flatMap((e) => e.targets),
    ).toHaveLength(30);
    expect(lessons).toHaveLength(358);
  });
  it('keeps every occurrence, coefficient, constant and contextual domain separate', () => {
    for (const [i, k, c, v, w, negative, half] of [
      [0, 3, 4, -3, -2, '-5', '11/2'],
      [1, 4, 1, -2, -3, '-7', '3'],
    ] as const) {
      expect([n(i, 1, 'K'), n(i, 1, 'C'), n(i, 1, 'V'), n(i, 1, 'W')]).toEqual([
        k,
        c,
        v,
        w,
      ]);
      const expanded = Array.from({ length: k }, () => 'n').join('+') + '+' + c;
      expect(equivalentExpression(expanded, `${k}n+${c}`)).toBe(true);
      expect(at(expanded, rational(BigInt(v)))).toBe(negative);
      expect(at(expanded, rational(0n))).toBe(String(c));
      expect(at(expanded, rational(1n, 2n))).toBe(half);
      expect(k * 2).not.toBe(Number(String(k) + '2'));
      expect(w + w).toBe(i === 0 ? -4 : -6);
      const allowed = (x: number) => Number.isInteger(x) && x >= 0;
      expect([v, 0, 0.5].map(allowed)).toEqual([false, true, false]);
      expect(at(`${k}n+${c}`, rational(1n))).toBe(
        at(`n+${k + c - 1}`, rational(1n)),
      );
      expect(at(`${k}n+${c}`, rational(2n))).not.toBe(
        at(`n+${k + c - 1}`, rational(2n)),
      );
    }
  });
  it('inverts complete constructions without rounding indices and supplies a genuinely different continuation', () => {
    for (const [i, r, f, s, t, u, first, second, far, index] of [
      [0, 4, 3, 17, 31, 32, 7, 11, 71, 7],
      [1, 5, 2, 23, 47, 48, 7, 12, 117, 9],
    ] as const) {
      expect([
        n(i, 2, 'R'),
        n(i, 2, 'F'),
        n(i, 2, 'S'),
        n(i, 2, 'T'),
        n(i, 2, 'U'),
      ]).toEqual([r, f, s, t, u]);
      const draw = (stage: number) =>
        Array.from({ length: r }, () =>
          Array.from({ length: stage }, () => 1),
        ).flat().length + f;
      expect([draw(1), draw(2), r * s + f]).toEqual([first, second, far]);
      expect(draw(2) - draw(1)).toBe(r);
      expect((t - f) / r).toBe(index);
      expect(r * index + f).toBe(t);
      expect((u - f) % r).not.toBe(0);
      for (const rounded of [Math.floor((u - f) / r), Math.ceil((u - f) / r)])
        expect(r * rounded + f).not.toBe(u);
      const ruleA = (n: number) => r * n + f,
        ruleB = (n: number) => (n < 3 ? r * n + f : 100);
      expect([ruleA(1), ruleA(2)]).toEqual([ruleB(1), ruleB(2)]);
      expect(ruleA(3)).not.toBe(ruleB(3));
      expect([0, -1, 0.5].every((n) => !Number.isInteger(n) || n < 1)).toBe(
        true,
      );
      expect(s).toBeGreaterThan(10);
    }
    expect(growingRows(17).total).toBe(53); // Original model always has three rows plus two, not the new paper construction.
    expect(() => growingRows(0)).toThrow();
  });
  it('reconstructs per-bag/overall fixed terms and respects subtraction and halving order', () => {
    for (const [i, g, e, b, c, h, inside, outside, halfThen, thenHalf] of [
      [0, 3, 2, 4, 10, 3, 6, 2, '4', '5/2'],
      [1, 4, 3, 5, 12, 4, 12, 3, '5', '3'],
    ] as const) {
      expect([
        n(i, 3, 'G'),
        n(i, 3, 'E'),
        n(i, 3, 'B'),
        n(i, 3, 'C'),
        n(i, 3, 'H'),
      ]).toEqual([g, e, b, c, h]);
      expect(at(`${g}(n+${e})`, rational(0n))).toBe(String(inside));
      expect(at(`${g}n+${e}`, rational(0n))).toBe(String(outside));
      expect(equivalentExpression(`${g}(n+${e})`, `${g}n+${g * e}`)).toBe(true);
      expect(equivalentExpression(`2(n-${b})`, `2n-${2 * b}`)).toBe(true);
      expect(equivalentExpression(`${c}-n`, `-n+${c}`)).toBe(true);
      expect(equivalentExpression(`${c}-n`, `n-${c}`)).toBe(false);
      expect(equivalentExpression(`n/2+${h}`, `(n+${2 * h})/2`)).toBe(true);
      expect(equivalentExpression(`n/2+${h}`, `(n+${h})/2`)).toBe(false);
      expect(at(`n/2+${h}`, rational(2n))).toBe(halfThen);
      expect(at(`(n+${h})/2`, rational(2n))).toBe(thenHalf);
    }
  });
  it('retains all solutions under four reversible actions, detects unilateral changes and distinguishes three zero relations', () => {
    for (const [i, k, t, a, num, den] of [
      [0, -3, 6, 3, -2n, 1n],
      [1, -4, 10, 4, -5n, 2n],
    ] as const) {
      expect([
        n(i, 4, 'K'),
        n(i, 4, 'T'),
        n(i, 4, 'A'),
        raw(i, 4, 'M'),
      ]).toEqual([k, t, a, '-1/2']);
      const original = algebraEquation(`${k}x`, String(t)),
        root = rational(num, den);
      expect(solveAlgebra(original)).toEqual({ kind: 'one', value: root });
      expect(solution(String(t), `${k}x`)).toEqual(solveAlgebra(original));
      for (const [op, inverse, amount] of [
        ['+', '−', rational(BigInt(a))],
        ['−', '+', rational(BigInt(a))],
        ['×', '÷', rational(-1n, 2n)],
        ['÷', '×', rational(-1n, 2n)],
      ] as const) {
        const changed = transformEquation(original, op, amount);
        expect(sameSolutions(original, changed)).toBe(true);
        expect(transformEquation(changed, inverse, amount)).toEqual(original);
      }
      const wrong = transformEquation(
        original,
        '÷',
        rational(BigInt(k)),
        'left',
      );
      expect(solveAlgebra(wrong)).toEqual({
        kind: 'one',
        value: rational(BigInt(t)),
      });
      expect(sameSolutions(original, wrong)).toBe(false);
      expect(k * t).not.toBe(t);
      expect(at(`${k}x`, rational(0n), 'x')).toBe('0');
      expect(t).not.toBe(0);
      for (const op of ['×', '÷'] as const)
        expect(() => transformEquation(original, op, rational(0n))).toThrow();
    }
    expect(solution('0x', '0')).toEqual({ kind: 'all' });
    expect(solution('0x', '1')).toEqual({ kind: 'none' });
    expect(solution('7x', '0')).toEqual({ kind: 'one', value: rational(0n) });
  });
  it('compares two exact bracket paths, finite-decimal errors and inverse division order', () => {
    for (const [
      i,
      a,
      b,
      c,
      d,
      e,
      f,
      g,
      rootN,
      rootD,
      roundedN,
      roundedD,
      left,
    ] of [
      [0, 3, 2, 4, '-0.67', 3, 2, 4, -2n, 3n, -67n, 100n, '399/100'],
      [1, 6, 1, 5, '-0.17', 5, 3, 2, -1n, 6n, -17n, 100n, '249/50'],
    ] as const) {
      expect([
        n(i, 5, 'A'),
        n(i, 5, 'B'),
        n(i, 5, 'C'),
        raw(i, 5, 'D'),
        n(i, 5, 'E'),
        n(i, 5, 'F'),
        n(i, 5, 'G'),
      ]).toEqual([a, b, c, d, e, f, g]);
      const original = algebraEquation(`${a}(x+${b})`, String(c)),
        root = rational(rootN, rootD);
      const divFirst = transformEquation(
        transformEquation(original, '÷', rational(BigInt(a))),
        '−',
        rational(BigInt(b)),
      );
      const expanded = algebraEquation(`${a}x+${a * b}`, String(c));
      const expandedFirst = transformEquation(
        transformEquation(expanded, '−', rational(BigInt(a * b))),
        '÷',
        rational(BigInt(a)),
      );
      expect(solveAlgebra(divFirst)).toEqual({ kind: 'one', value: root });
      expect(solveAlgebra(expandedFirst)).toEqual({ kind: 'one', value: root });
      expect(at(`${a}(x+${b})`, root, 'x')).toBe(String(c));
      expect(at(`${a}(x+${b})`, rational(roundedN, roundedD), 'x')).toBe(left);
      expect(left).not.toBe(String(c));
      expect(solution(`(x-${e})/${f}`, String(g))).toEqual({
        kind: 'one',
        value: rational(11n),
      });
      expect((11 - e) / f).toBe(g);
      expect(solution(`${a}(x+${b})`, String(a * b))).toEqual({
        kind: 'one',
        value: rational(0n),
      });
    }
  });
});
