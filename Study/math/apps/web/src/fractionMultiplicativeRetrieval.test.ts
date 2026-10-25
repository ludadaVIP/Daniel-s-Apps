import { describe, it, expect } from 'vitest';
import { fractionMultiplicativeRetrieval } from './content/fractionMultiplicativeRetrieval';
import { fractionOperationsRecurrence } from './content/fractionOperationsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons, lessonById } from './content';
import { checkAnswer } from './model';
import {
  repeatFraction,
  areaProduct,
  partOfAmount,
  shareFraction,
  fractionQuotient,
} from './fractionProductModels';
import { simplifyFraction } from './fractionModels';
const sets = Object.values(fractionMultiplicativeRetrieval);
const F = (n: number, d = 1) => ({ n, d });
const eq = (v: { n: number; d: number }, n: number, d = 1) =>
  expect(v).toEqual(simplifyFraction(F(n, d)));
const given = (i: number, q: number, key: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === key,
  )![2]!.en;
const read = (i: number, q: number, key: string) => {
  const [n, d = '1'] = given(i, q, key).split('/');
  return F(Number(n), Number(d));
};

describe('P61 multiplicative subskills in two later units', () => {
  it('retains thirteen existing references, adds twelve exact tasks and leaves existing owner groups intact', () => {
    expect(fractionOperationsRecurrence.flatMap((e) => e.targets)).toHaveLength(
      25,
    );
    expect(
      new Set(fractionOperationsRecurrence.flatMap((e) => e.targets)).size,
    ).toBe(25);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of fractionOperationsRecurrence.entries()) {
      const added = e.targets.filter((x) =>
        x.includes('FRACTION-MULTIPLICATIVE'),
      );
      expect(added).toEqual(sets.map((s) => s.questions[i]!.id));
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(
          Object.values(maintenanceSets).find((group) => group.id === s.id),
        ).toBe(s);
        expect(s.bridgeByQuestion[q.id]).toBe(e.sourceLesson);
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P61'));
        expect(lessonById(e.sourceLesson)).toBeDefined();
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
      }
    }
    expect(maintenanceSets.P63.questions).toHaveLength(2);
    expect(maintenanceSets.P67.questions).toHaveLength(5);
    expect(lessons).toHaveLength(358);
  });
  it('uses original-unit pieces for improper repeated quantities and distinguishes count from size', () => {
    for (const [i, expectedN, expectedD, lower] of [
      [0, 15, 4, 3],
      [1, 28, 5, 5],
    ]) {
      const count = Number(given(i!, 1, 'R_N')),
        part = read(i!, 1, 'R_L'),
        m = repeatFraction(count, part);
      eq(m.result, expectedN!, expectedD!);
      expect(m.result.n / m.result.d).toBeGreaterThan(lower!);
      expect(m.result.n / m.result.d).toBeLessThan(lower! + 1);
      expect(part.n / part.d).not.toBe(m.result.n / m.result.d);
      eq(repeatFraction(count, F(0, part.d)).result, 0);
      eq(repeatFraction(0, part).result, 0);
      eq(repeatFraction(1, part).result, part.n, part.d);
    }
  });
  it('reconstructs equal-area cells with both factors above one without normalising the expanded canvas', () => {
    for (const [i, n, d, cells, perWhole] of [
      [0, 20, 9, 20, 9],
      [1, 21, 10, 42, 20],
    ]) {
      const a = read(i!, 2, 'A'),
        b = read(i!, 2, 'B'),
        m = areaProduct(a, b);
      eq(m.result, n!, d!);
      expect(m.cellsPerWhole).toBe(perWhole);
      expect(m.cells.filter((c) => c.overlap)).toHaveLength(cells!);
      expect(m.across * m.down).toBe(4);
      expect(m.cells.length).toBe(4 * perWhole!);
      eq(areaProduct(a, F(0)).result, 0);
      eq(areaProduct(a, F(1)).result, a.n, a.d);
    }
    const m = areaProduct(F(2), F(2));
    expect(m.cells.filter((c) => c.overlap)).toHaveLength(4);
    eq(m.result, 4);
    eq(areaProduct(F(0), F(2)).result, 0);
  });
  it('keeps exact continuous selections and rejects rounding as a repair for indivisible cards', () => {
    for (const [i, n, d, doubledN, reducedN] of [
      [0, 14, 3, 28, 7],
      [1, 33, 7, 66, 22],
    ]) {
      const w = Number(given(i!, 3, 'W')),
        p = read(i!, 3, 'F'),
        m = partOfAmount(w, p);
      eq(m.result, n!, d!);
      eq(partOfAmount(2 * w, p).result, doubledN!, d!);
      eq(partOfAmount(w, F(p.n - 1, p.d)).result, reducedN!, d!);
      const complement = partOfAmount(w, F(p.d - p.n, p.d)).result;
      expect(m.result.n * complement.d + complement.n * m.result.d).toBe(
        w * m.result.d * complement.d,
      );
      expect(m.result.d).not.toBe(1);
      const cents = Math.round((m.result.n * 100) / m.result.d);
      expect(cents * m.result.d).not.toBe(m.result.n * 100);
      eq(partOfAmount(w, F(0, p.d)).result, 0);
      eq(partOfAmount(w, F(p.d, p.d)).result, w);
      eq(partOfAmount(0, p).result, 0);
    }
  });
  it('subdivides improper totals before allocation and detects loss from rounding each share', () => {
    for (const [i, n, d, pieces, perPerson] of [
      [0, 7, 12, 21, 7],
      [1, 11, 24, 44, 11],
    ]) {
      const total = read(i!, 4, 'S'),
        k = Number(given(i!, 4, 'K')),
        m = shareFraction(total, k);
      eq(m.result, n!, d!);
      expect(m.pieces).toHaveLength(pieces!);
      for (let p = 0; p < k; p++)
        expect(m.pieces.filter((x) => x.owner === p)).toHaveLength(perPerson!);
      expect(k * m.result.n * total.d).toBe(total.n * m.result.d);
      expect((k * total.n) / total.d).not.toBe(total.n / total.d);
      const roundedHundredths = Math.round((m.result.n * 100) / m.result.d);
      expect(k * roundedHundredths * total.d).not.toBe(100 * total.n);
      eq(shareFraction(total, 1).result, total.n, total.d);
      eq(shareFraction(F(0), k).result, 0);
      expect(() => shareFraction(total, 0)).toThrow();
    }
  });
  it('requires no extra portion at exact exhaustion and distinguishes sharing units from group counts', () => {
    for (const [i, expected] of [
      [0, 6],
      [1, 4],
    ]) {
      const t = read(i!, 5, 'T'),
        g = read(i!, 5, 'G'),
        m = fractionQuotient(t, g);
      eq(m.result, expected!);
      expect(m.fullGroups).toBe(expected);
      eq(m.remainder, 0);
      eq(m.fractionOfGroup, 0);
      eq(fractionQuotient(t, F(1)).result, t.n);
      eq(fractionQuotient(F(0), g).result, 0);
      expect(() => fractionQuotient(t, F(0))).toThrow();
      const people = Number(given(i!, 5, 'D'));
      // The workshop sharing model permits totals up to two; use exact algebra for T=3.
      const share = F(t.n, t.d * people);
      expect(people * share.n * t.d).toBe(t.n * share.d);
      expect(share.n / share.d).not.toBe(m.result.n / m.result.d);
    }
  });
  it('derives reciprocal division from common pieces, allowing a nonleast common denominator', () => {
    for (const [i, den, total, per, n, d, rn, rd, fn, fd] of [
      [0, 24, 21, 16, 21, 16, 5, 24, 5, 16],
      [1, 12, 10, 9, 10, 9, 1, 12, 1, 9],
    ]) {
      const u = read(i!, 6, 'U'),
        v = read(i!, 6, 'V'),
        m = fractionQuotient(u, v);
      expect([m.denominator, m.total, m.perGroup]).toEqual([den, total, per]);
      eq(m.result, n!, d!);
      eq(m.remainder, rn!, rd!);
      eq(m.fractionOfGroup, fn!, fd!);
      expect(m.fullGroups).toBe(1);
      eq(simplifyFraction(F(2 * total!, 2 * per!)), n!, d!);
      expect(m.result.n * v.n * u.d).toBe(u.n * m.result.d * v.d);
      expect(m.reciprocal.n * v.n).toBe(m.reciprocal.d * v.d);
      // An additive opposite cancels a sum; its product with V is negative, never one.
      expect(-v.n * v.n).not.toBe(v.d * v.d);
      // The explicitly requested bd partition need not be the least one.
      eq(simplifyFraction(F(u.n * v.d, u.d * v.n)), n!, d!);
    }
    eq(fractionQuotient(F(0), F(2, 5)).result, 0);
    expect(() => fractionQuotient(F(2, 5), F(0))).toThrow();
    expect(() => fractionQuotient(F(0), F(0))).toThrow();
    expect([-2, 0, 3].map((q) => q * 0)).toEqual([-0, 0, 0]);
  });
});
