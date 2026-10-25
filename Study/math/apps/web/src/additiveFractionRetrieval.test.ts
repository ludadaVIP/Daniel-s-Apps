import { describe, it, expect } from 'vitest';
import { additiveFractionRetrieval } from './content/additiveFractionRetrieval';
import { fractionRecurrence } from './content/fractionRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { fractionOperation } from './fractionOperationModels';
import { checkAnswer, type Question } from './model';
type F = { n: number; d: number };
const sets = Object.values(additiveFractionRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const f = (s: string): F => {
  const [n, d = 1] = s.split('/').map(Number);
  return { n: n!, d };
};
const equal = (a: F, b: F) => a.n * b.d === b.n * a.d;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const simple = (a: F): F => ({
  n: a.n / gcd(a.n, a.d),
  d: a.d / gcd(a.n, a.d),
});
const fmt = (a: F) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
const arithmetic = (a: F, b: F, sign: '+' | '−'): F => ({
  n: a.n * b.d + (sign === '+' ? 1 : -1) * b.n * a.d,
  d: a.d * b.d,
});
const evalPart = (s: string): F => {
  const m = s.match(/^(\d+(?:\/\d+)?)([+−])(\d+(?:\/\d+)?)$/);
  return m ? arithmetic(f(m[1]!), f(m[3]!), m[2] as '+' | '−') : f(s);
};
const chain = (q: Question, key: string, a: F, b: F, sign: '+' | '−') => {
  const result = arithmetic(a, b, sign),
    match = q.solution.en.match(new RegExp(key + ':([^;]+);'))!;
  expect(match).not.toBeNull();
  const parts = match[1]!.split('=').map(evalPart);
  expect(parts.every((p) => equal(p, result))).toBe(true);
  const last = parts.at(-1)!;
  expect(gcd(last.n, last.d)).toBe(1);
  const inverse = arithmetic(last, b, sign === '+' ? '−' : '+');
  expect(equal(inverse, a)).toBe(true);
  const model = fractionOperation(a, b, sign);
  expect(equal(model.raw, result)).toBe(true);
  expect(model.simplest).toEqual(simple(result));
  return simple(result);
};
describe('P54 additive fraction structure and application', () => {
  it('registers two genuine later owners, ten bilingual human cards and five exact bridges while preserving all earlier P61 groups', () => {
    expect(lessons).toHaveLength(358);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set();
    for (const s of sets) {
      expect(units.indexOf(s.unit)).toBeGreaterThan(units.indexOf('P54'));
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('because same units', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P54-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(10);
    expect(maintenanceForUnit('P55')[0]!.id).toBe(sets[0]!.id);
    const previous = maintenanceForUnit('P61').filter(
      (s) => s.id !== sets[1]!.id,
    );
    expect(previous.map((s) => [s.id, s.questions.length])).toEqual([
      ['P61-MAINT-P53', 4],
      ['P61-MAINT-DECIMAL-STRUCTURE', 6],
      ['P61-MAINT-FRACTION-STRUCTURE', 6],
    ]);
  });
  it('recomputes sums, zero, integer and four-outline cases plus unequal half-jug quantities from actual records', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        r = rows(s, 0);
      for (const [id, as, bs] of r.slice(0, 3)) {
        const a = f(as!),
          b = f(bs!),
          result = chain(q, id!, a, b, '+');
        expect(a.d).toBe(b.d);
        expect(a.n).toBeLessThanOrEqual(2 * a.d);
        expect(b.n).toBeLessThanOrEqual(2 * b.d);
        expect((a.n + b.n) / (a.d + b.d)).not.toBe(result.n / result.d);
        if (id === 'A') expect(result).toEqual({ n: 2, d: 1 });
        if (id === 'B') expect(equal(result, b)).toBe(true);
        if (id === 'C') {
          expect(result).toEqual({ n: 7, d: 2 });
          expect(Math.floor(result.n / result.d)).toBe(3);
          expect(Math.ceil(result.n / result.d)).toBe(4);
        }
      }
      const a = Number(r[3]![1]),
        b = Number(r[3]![2]),
        total = simple({ n: a + b, d: 2 });
      expect(q.solution.en).toContain(`D:${a}/2+${b}/2=${fmt(total)} L`);
      expect(equal(total, { n: a, d: 1 })).toBe(false);
      expect(q.solution.en).toContain('FOUR required outlines');
    }
  });
  it('checks every like-denominator removal, integer exchange and zero case, and refuses infeasible material without mutating operands', () => {
    for (const s of sets) {
      const q = s.questions[1]!;
      for (const [id, as, bs] of rows(s, 1)) {
        const a = f(as!),
          b = f(bs!);
        if (id === 'D') {
          const before = [{ ...a }, { ...b }];
          expect(a.n * b.d).toBeLessThan(b.n * a.d);
          expect(() => fractionOperation(a, b, '−')).toThrow(/non-negative/);
          expect([a, b]).toEqual(before);
          continue;
        }
        const result = chain(q, id!, a, b, '−');
        expect(result.n).toBeGreaterThanOrEqual(0);
        if (id === 'B') expect(result).toEqual({ n: 0, d: 1 });
        if (id === 'E') expect(equal(a, result)).toBe(true);
        if (id === 'C') expect(a).toEqual({ n: 1, d: 1 });
      }
      expect(q.solution.en).toContain('never 0/0');
      expect(q.solution.en).toContain('Reversal changes the story');
    }
  });
  it('verifies distinct refinement factors, nonleast form requirements, real 132-part counts and exact kilometre/metre conversion', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        r = rows(s, 2);
      for (const [id, as, bs] of r.slice(0, 3)) {
        const a = f(as!),
          b = f(bs!),
          v = chain(q, id!, a, b, '+'),
          d = (a.d / gcd(a.d, b.d)) * b.d;
        if (id === 'A') {
          expect(d / a.d).not.toBe(d / b.d);
          expect(v.n).toBeGreaterThan(v.d);
          expect(v.n).toBeLessThan(2 * v.d);
          expect((a.d + b.d) % a.d !== 0 || (a.d + b.d) % b.d !== 0).toBe(true);
          const double = fractionOperation(a, b, '+', 2 * d);
          expect(equal(double.raw, v)).toBe(true);
          expect(double.raw.d).toBe(2 * d);
          expect(q.solution.en).toContain(
            `Requested denominator ${2 * d} gives ${double.raw.n}/${double.raw.d}`,
          );
        }
        if (id === 'H') {
          expect(d).toBe(132);
          const cells = Array.from({ length: d }, (_, i) => i);
          const aCount = (a.n * d) / a.d,
            bCount = (b.n * d) / b.d;
          expect(cells.filter((i) => i < aCount).length).toBe(aCount);
          expect(
            cells.filter((i) => i >= aCount && i < aCount + bCount).length,
          ).toBe(bCount);
          expect(q.solution.en).toContain(
            `=${aCount}/132+${bCount}/132=${aCount + bCount}/132`,
          );
          expect(q.solution.en).toContain('132 actual cells per whole');
        }
      }
      const u = r[3]!,
        km = f(u[1]!),
        m = f(u[2]!),
        leftMetres = { n: km.n * 1000, d: km.d },
        sum = simple(arithmetic(leftMetres, m, '+'));
      expect(q.solution.en).toContain(
        `U:${u[1]} km=${fmt(simple(leftMetres))} m`,
      );
      expect(q.solution.en).toContain(
        `gives ${fmt(sum)} m=${fmt(simple({ n: sum.n, d: sum.d * 1000 }))} km`,
      );
      expect(() => fractionOperation(leftMetres, m, '+')).toThrow(/0–2/);
    }
  });
  it('keeps unlike subtraction ordered under both denominator choices, including zero, integer and unchanged-zero-removal boundaries', () => {
    for (const s of sets) {
      const q = s.questions[3]!;
      for (const [id, as, bs] of rows(s, 3)) {
        const a = f(as!),
          b = f(bs!);
        if (id === 'D') {
          expect(() => fractionOperation(a, b, '−')).toThrow(/non-negative/);
          continue;
        }
        const v = chain(q, id!, a, b, '−');
        if (id === 'A') {
          const d = (a.d / gcd(a.d, b.d)) * b.d,
            twice = fractionOperation(a, b, '−', 2 * d);
          expect(equal(twice.raw, v)).toBe(true);
          expect(q.solution.en).toContain(
            `=${twice.left.n}/${2 * d}−${twice.right.n}/${2 * d}=${twice.raw.n}/${2 * d}=${fmt(v)}`,
          );
        }
        if (id === 'B') expect(v.n).toBe(0);
        if (id === 'C') expect(a.n).toBe(a.d);
        if (id === 'E') expect(equal(v, a)).toBe(true);
      }
      expect(q.solution.en).toContain('Do not reverse or truncate');
    }
  });
  it('reconstructs all two-step quantities, exact route ratios, money and the whole feasible paper-plan space', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        r = Object.fromEntries(rows(s, 4).map((row) => [row[0]!, row[2]!])),
        get = (key: string) => f(r[key]!);
      const mt = simple({ n: Number(r.M_A) + Number(r.M_B), d: 2 }),
        mr = simple(arithmetic(mt, get('M_U'), '−'));
      expect(q.solution.en).toContain(`M:${r.M_A}/2+${r.M_B}/2=${fmt(mt)} L`);
      expect(q.solution.en).toContain(`final ${fmt(mr)} L`);
      expect(equal(arithmetic(mr, get('M_U'), '+'), mt)).toBe(true);
      expect(() => fractionOperation(mt, get('M_U'), '−')).toThrow(/0–2/);
      const uses = arithmetic(get('N_1'), get('N_2'), '+'),
        remain = simple(arithmetic(get('N_T'), uses, '−')),
        mid = simple(arithmetic(get('N_T'), get('N_1'), '−'));
      expect(equal(arithmetic(mid, get('N_2'), '−'), remain)).toBe(true);
      expect(equal(arithmetic(remain, uses, '+'), get('N_T'))).toBe(true);
      expect(q.solution.en).toContain(
        `Successively: ${r.N_T}−${r.N_1}=${fmt(mid)}, then ${fmt(mid)}−${r.N_2}=${fmt(remain)} L`,
      );
      const route = Number(r.R_T),
        p = get('R_P'),
        extra = get('R_E');
      for (const multiplier of [1, 2]) {
        const distance = simple(
            arithmetic({ n: p.n * route * multiplier, d: p.d }, extra, '+'),
          ),
          ratio = simple({ n: distance.n, d: distance.d * route * multiplier });
        expect(q.solution.en).toContain(
          multiplier === 1
            ? `=${fmt(distance)} km, fraction ${fmt(ratio)} of the route`
            : `distance=${fmt(distance)} km and route fraction=${fmt(ratio)}`,
        );
      }
      const money = chain(q, 'S', get('S_A'), get('S_B'), '−');
      expect(money.n).toBeGreaterThan(0);
      const example = q.solution.en.match(
          /ONE paper example: a=(\d+),b=(\d+)/,
        )!,
        a = Number(example[1]),
        b = Number(example[2]),
        total = Number(r.F);
      expect(Number.isInteger(a) && a > 0 && Number.isInteger(b) && b > 0).toBe(
        true,
      );
      expect(a + b).toBeLessThanOrEqual(total);
      expect(q.solution.en).toContain(
        `remainder ${fmt(simple({ n: total - a - b, d: total }))} L`,
      );
      let feasible = 0,
        empty = 0;
      for (let x = 1; x <= total; x++)
        for (let y = 1; y <= total; y++)
          if (x + y <= total) {
            feasible++;
            if (x + y === total) empty++;
            expect(total - x - y + x + y).toBe(total);
          }
      expect(feasible).toBe(66);
      expect(empty).toBe(11);
      expect(q.solution.en).toContain(
        'Accept ANY positive integers a,b with a+b≤12',
      );
    }
  });
  it('states common-denominator divisibility in the same direction in both source languages and rejects the reversed interpretation', () => {
    const q = lessons.find((l) => l.id === 'P54-L03')!.questions[0]!;
    expect(q.hints[0]!.zh).toBe('共同分母必须同时被两个原分母整除。');
    expect(q.hints[0]!.en).toBe(
      'Both denominators must divide the common denominator.',
    );
    for (const d of [12, 24]) {
      expect(d % 4).toBe(0);
      expect(d % 6).toBe(0);
      expect(4 % d).not.toBe(0);
      expect(6 % d).not.toBe(0);
    }
  });
  it('keeps ten original references and adds ten exact task links under five existing source tags', () => {
    const evidence = fractionRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P54-'),
    );
    const original = [
      ['P61-L01-Q6', 'P63-L03-Q6'],
      ['P55-L04-Q5', 'J71-L02-Q6'],
      ['P65-L05-Q6', 'J71-L03-Q6'],
      ['P65-L05-Q6', 'J71-L04-Q6'],
      ['P61-L05-Q6', 'P63-L03-Q6'],
    ];
    expect(evidence).toHaveLength(5);
    expect(evidence.reduce((n, e) => n + e.targets.length, 0)).toBe(20);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(18);
    for (const [i, e] of evidence.entries()) {
      expect(
        e.targets.filter((id) => !id.includes('FRACTION-ADDITIVE')),
      ).toEqual(original[i]);
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        expect(
          recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === q.id)!.href,
        ).toBe(maintenanceHref(s, q.id));
      }
    }
  });
});
