import { describe, it, expect } from 'vitest';
import { fractionStructureRetrieval } from './content/fractionStructureRetrieval';
import { fractionRetrieval } from './content/fractionRetrieval';
import { earlyAlgebraRecurrence } from './content/earlyAlgebraRecurrence';
import { fractionRecurrence } from './content/fractionRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  fractionWholes,
  fractionKind,
  mixedFraction,
  improperFraction,
  refineFraction,
  divideFraction,
  simplifyFraction,
  commonDenominator,
  compareFractions,
} from './fractionModels';
const sets = Object.values(fractionStructureRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const records = (s: (typeof sets)[number], i: number) =>
  Object.fromEntries(rows(s, i).map((r) => [r[0]!, r.slice(1)]));
const frac = (s: string) => {
  const [n, d] = s.split('/').map(Number);
  return { n: n!, d: d! };
};
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const reduced = (n: number, d: number) => `${n / gcd(n, d)}/${d / gcd(n, d)}`;
const numbers = (s: string) => s.split(',').map(Number);
const compare = (a: { n: number; d: number }, b: { n: number; d: number }) =>
  Math.sign(a.n * b.d - b.n * a.d);

describe('P53 detailed fraction wholes and representations', () => {
  it('registers twelve bilingual human tasks with exact bridges while preserving four-task defaults and formal identities', () => {
    expect(lessons).toHaveLength(358);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P53'));
      const old = Object.values(fractionRetrieval).find(
        (g) => g.unit === s.unit,
      )!;
      expect(old.questions).toHaveLength(4);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(old.id);
      expect(s.questions).toHaveLength(6);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('correct because same whole', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P53-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(12);
  });
  it('reconstructs every actual cell region, unequal-shape equality, one-cell transfer and rope units on a fixed scale', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        r = records(s, 0),
        value = (key: string) => Number(r[key]![1]);
      const area = value('G_R') * value('G_C'),
        regions = rows(s, 0)
          .filter((row) => /^[A-D]$/.test(row[0]!))
          .map((row) => numbers(row[2]!));
      const all = regions.flat().sort((a, b) => a - b);
      expect(all).toEqual(Array.from({ length: area }, (_, i) => i + 1));
      expect(regions.every((region) => region.length === 4)).toBe(true);
      // One horizontal strip and a region spanning several rows have different shapes, equal unit-cell area.
      const occupiedRows = regions.map(
        (region) =>
          new Set(region.map((n) => Math.floor((n - 1) / value('G_C')))).size,
      );
      expect(occupiedRows[0]).toBe(1);
      expect(occupiedRows[1]).toBeGreaterThan(1);
      expect(q.solution.en).toContain(`Grid area=${area} cm²`);
      expect(q.solution.en).toContain(
        `each has 4 cm² and fraction 1/${regions.length}`,
      );
      const moved = [
        regions[0]!.slice(1),
        [...regions[1]!, regions[0]![0]!],
        ...regions.slice(2),
      ];
      expect(moved.map((a) => a.length)).toEqual([
        3,
        5,
        ...regions.slice(2).map(() => 4),
      ]);
      expect(moved.flat().sort((a, b) => a - b)).toEqual(all);
      expect(q.solution.en).toContain(
        `fractions 3/${area}, 5/${area} and 4/${area}`,
      );
      const d = value('d'),
        k = value('k');
      for (const key of ['W_A', 'W_B']) {
        const w = value(key);
        expect(q.solution.en).toContain(
          `${key}: ${reduced(w, d)} m each, ${reduced(w * k, d)} m`,
        );
        expect(w * k * d).toBe(w * (k * d));
        const part = simplifyFraction({ n: w, d });
        expect(part.n * d).toBe(w * part.d);
      }
      expect(q.solution.en).toContain(`1/${d}=2/${2 * d}`);
      expect(q.solution.en).toContain('zero denominator is invalid');
      expect(value('W_A')).toBeGreaterThan(value('W_B'));
    }
  });
  it('distinguishes filled wholes, minimal outlines, zero guides and changing only the denominator in actual litre rows', () => {
    for (const s of sets) {
      const q = s.questions[1]!;
      for (const [id, ns, ds] of rows(s, 1)) {
        const n = Number(ns),
          d = Number(ds),
          full = Math.floor(n / d),
          rem = n - full * d,
          outlines = Math.ceil(n / d),
          kind = n === 0 ? 'zero' : n < d ? 'proper' : 'improper';
        expect(fractionKind({ n, d })).toBe(kind);
        expect(mixedFraction({ n, d })).toEqual({ whole: full, n: rem, d });
        const bars = fractionWholes({ n, d });
        expect(bars.reduce((v, b) => v + b.n, 0)).toBe(n);
        expect(bars.length).toBe(n === 0 ? 1 : outlines);
        expect(bars.every((b) => b.d === d && b.n <= d)).toBe(true);
        expect(q.solution.en).toContain(
          `${id}:${n}/${d}; ${kind}; full=${full}; remainder=${rem}/${d}; minimum outlines=${outlines}`,
        );
        if (id === 'C') {
          expect(outlines).toBe(full + 1);
          expect(rem).toBeGreaterThan(0);
          expect(q.solution.en).toContain(`${n}/${2 * d} L`);
          expect(compare({ n, d: 2 * d }, { n, d })).toBe(-1);
        }
        if (id === 'D') {
          expect(outlines).toBe(full);
          expect(rem).toBe(0);
        }
        if (id === 'B') {
          expect(n).toBe(d);
          expect(kind).toBe('improper');
        }
      }
      expect(q.solution.en).toContain('zero outlines minimally required');
    }
  });
  it('checks all mixed-number remainder identities, equal-valued nonstandard forms, integer/zero cases and required denominators', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        r = records(s, 2);
      for (const id of ['A', 'B', 'C', 'Z']) {
        const f = frac(r[id]![1]!),
          whole = Math.floor(f.n / f.d),
          rem = f.n - whole * f.d;
        expect(q.solution.en).toContain(`${f.n}=${whole}×${f.d}+${rem}`);
        expect(improperFraction(whole, rem, f.d)).toEqual(f);
        expect(rem).toBeLessThan(f.d);
      }
      const a = frac(r.A![1]!),
        am = mixedFraction(a);
      expect(q.solution.en).toContain(`2 ${2 * am.n}/12`);
      expect((2 * 12 + 2 * am.n) * a.d).toBe(a.n * 12);
      const [ew, ef] = r.E![1]!.split(' '),
        ep = frac(ef!);
      expect(Number(ew) * ep.d + ep.n).toBe(a.n);
      expect(ep.n).toBeGreaterThanOrEqual(ep.d);
      expect(() => improperFraction(Number(ew), ep.n, ep.d)).toThrow();
      const [w, n, d] = numbers(r.D![1]!),
        numerator = w! * d! + n!;
      expect(q.solution.en).toContain(`D:${w} ${n}/${d}=${numerator}/${d} m`);
      expect((w! + n!) / d!).not.toBe(numerator / d!);
      expect((w! * n!) / d!).not.toBe(numerator / d!);
      expect(q.solution.en).toContain(`${2 * numerator}/10 equals D's value`);
      expect(q.solution.en).toContain(`not ${am.n}/${a.n}`);
    }
  });
  it('audits both blank roles, reversible refinement, zero/one factor conditions and actual whole changes using original tables', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        r = records(s, 3),
        [n, d, k] = numbers(r.A![1]!),
        [bn, bd, target] = numbers(r.B![1]!),
        w = Number(r.W![1]);
      const fine = refineFraction({ n: n!, d: d! }, k!),
        factor = target! / bn!,
        missing = bd! * factor;
      expect(fine).toEqual({ n: n! * k!, d: d! * k! });
      expect(divideFraction(fine, k!)).toEqual({ n: n!, d: d! });
      expect(q.solution.en).toContain(`A:${n}/${d}=${fine.n}/${fine.d}`);
      expect(q.solution.en).toContain(`B:${bn}/${bd}=${target}/${missing}`);
      expect(q.solution.en).toContain(`C:${fine.n}/${fine.d}=${n}/${d}`);
      expect(r.C![1]).toBe(`${fine.n}/${fine.d} → ?/${d}`);
      expect(refineFraction({ n: n!, d: d! }, 1)).toEqual({ n: n!, d: d! });
      expect(() => refineFraction({ n: n!, d: d! }, 0)).toThrow();
      expect(n! * (d! * k!)).not.toBe(n! * d!);
      expect(q.solution.en).toContain(`ONE/${k} of the former amount`);
      expect(q.solution.en).toContain(
        `both forms select ${reduced(w * n!, d!)} L`,
      );
      expect(q.solution.en).toContain(
        `Doubling W gives ${reduced(2 * w * n!, d!)} L`,
      );
      expect(q.solution.en).toContain('accept other correct equal fractions');
      const original = { n: n!, d: d! };
      for (let f = 2; f <= 12; f++)
        if (f !== k) {
          const other = refineFraction(original, f);
          expect(other.n * original.d).toBe(original.n * other.d);
        }
    }
  });
  it('reconstructs both simplification paths, coprime and odd counterexamples, invalid subtraction, zero and integer forms', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        r = records(s, 4),
        get = (key: string) => ({
          n: Number(r[key]![0]),
          d: Number(r[key]![1]),
        });
      const a = get('A'),
        g = gcd(a.n, a.d),
        mid = { n: a.n / 2, d: a.d / 2 },
        end = { n: a.n / g, d: a.d / g };
      expect(g / 2).toBeGreaterThan(1);
      expect(divideFraction(a, 2)).toEqual(mid);
      expect(divideFraction(mid, g / 2)).toEqual(end);
      expect(divideFraction(a, g)).toEqual(end);
      expect(q.solution.en).toContain(
        `A:${a.n}/${a.d}=${mid.n}/${mid.d}=${end.n}/${end.d} L`,
      );
      expect(gcd(end.n, end.d)).toBe(1);
      const b = get('B'),
        common = Array.from(
          { length: Math.min(b.n, b.d) },
          (_, i) => i + 1,
        ).filter((f) => b.n % f === 0 && b.d % f === 0);
      expect(common).toEqual([1]);
      expect(Math.abs(b.n - b.d)).toBeGreaterThan(1);
      const c = get('C');
      expect(c.n % 2).toBe(1);
      expect(gcd(c.n, c.d)).toBe(3);
      expect(q.solution.en).toContain(`C:${c.n}/${c.d}=${reduced(c.n, c.d)}`);
      const sub = get('S');
      expect(compare(sub, { n: sub.n - 1, d: sub.d - 1 })).not.toBe(0);
      expect(q.solution.en).toContain(
        `cross-products ${sub.n * (sub.d - 1)}≠${(sub.n - 1) * sub.d}`,
      );
      for (const id of ['D', 'Z']) {
        const f = get(id),
          simplified = simplifyFraction(f);
        expect(simplified.d).toBe(1);
        expect(simplified.n).toBe(id === 'D' ? 3 : 0);
      }
      expect(() => divideFraction(a, 0)).toThrow();
      expect(() => divideFraction(a, 7)).toThrow();
    }
  });
  it('independently finds least common units and full multiple lists, tests equality, changed wholes and all unknown-whole orderings', () => {
    for (const s of sets) {
      const q = s.questions[5]!,
        r = records(s, 5),
        a = frac(r.A![0]!),
        b = frac(r.A![1]!);
      let lcd = 1;
      while (lcd % a.d !== 0 || lcd % b.d !== 0) lcd++;
      const ln = (a.n * lcd) / a.d,
        rn = (b.n * lcd) / b.d;
      expect(commonDenominator(a, b)).toEqual({
        d: lcd,
        left: { n: ln, d: lcd },
        right: { n: rn, d: lcd },
      });
      expect(ln - rn).toBe(1);
      expect(q.solution.en).toContain(
        `A:${a.n}/${a.d}=${ln}/${lcd}>${rn}/${lcd}=${b.n}/${b.d}; gap=1/${lcd} km`,
      );
      const list = (step: number) =>
        Array.from({ length: lcd / step }, (_, i) => (i + 1) * step);
      const left = list(a.d),
        right = list(b.d);
      expect(left.filter((n) => right.includes(n))).toEqual([lcd]);
      expect(q.solution.en).toContain(
        `lists ${left.join(', ')} and ${right.join(', ')} first meet at ${lcd}`,
      );
      expect(a.d * b.d).toBeGreaterThan(lcd);
      expect((a.d + b.d) % a.d !== 0 || (a.d + b.d) % b.d !== 0).toBe(true);
      for (const id of ['B', 'C', 'E']) {
        const left = frac(r[id]![0]!),
          right = frac(r[id]![1]!);
        expect(compareFractions(left, right)).toBe(id === 'E' ? 0 : 1);
        expect(compare(left, right)).toBe(id === 'E' ? 0 : 1);
      }
      const changed = { n: b.n * Number(r.F![1]), d: b.d };
      expect(compare(a, changed)).toBe(-1);
      expect(q.solution.en).toContain(
        `right becomes ${reduced(changed.n, changed.d)} km`,
      );
      const gl = frac(r.G![0]!),
        gr = frac(r.G![1]!);
      const possibilities = new Set<number>();
      for (let w1 = 1; w1 <= 12; w1++)
        for (let w2 = w1 + 1; w2 <= 16; w2++)
          possibilities.add(
            compare({ n: gl.n * w1, d: gl.d }, { n: gr.n * w2, d: gr.d }),
          );
      expect(possibilities).toEqual(new Set([-1, 0, 1]));
      const example = q.solution.en.match(
        /wholes \((\d+),(\d+)\), \((\d+),(\d+)\), \((\d+),(\d+)\) m give left (\d+) m and right ([\d/]+), ([\d/]+), ([\d/]+) m/,
      )!;
      expect(example).not.toBeNull();
      const expectedSigns = [1, 0, -1];
      for (let i = 0; i < 3; i++) {
        const w1 = Number(example[1 + 2 * i]),
          w2 = Number(example[2 + 2 * i]);
        const actualLeft = { n: gl.n * w1, d: gl.d },
          actualRight = { n: gr.n * w2, d: gr.d };
        expect(w2).toBeGreaterThan(w1);
        expect(actualLeft.n).toBe(Number(example[7]) * actualLeft.d);
        const rightText = example[8 + i]!,
          reported = frac(
            rightText.includes('/') ? rightText : rightText + '/1',
          );
        expect(actualRight.n * reported.d).toBe(reported.n * actualRight.d);
        expect(compare(actualLeft, actualRight)).toBe(expectedSigns[i]);
      }
      expect(q.solution.en).toContain('1/2 km=500 m > 1/2 m');
      expect(500 / (1 / 2)).toBe(1000);
    }
  });
  it('retains fourteen original references while linking six existing tags to twelve different later tasks', () => {
    const evidence = [...earlyAlgebraRecurrence, ...fractionRecurrence].filter(
      (e) => e.sourceLesson.startsWith('P53-'),
    );
    const original: Record<string, string[]> = {
      'P53-L01': ['P61-L03-Q6', 'P62-L01-Q6'],
      'P53-L02': ['P61-MAINT-P53-Q1', 'P65-MAINT-P53-Q1'],
      'P53-L03': ['P61-MAINT-P53-Q2', 'P65-MAINT-P53-Q2'],
      'P53-L04': ['P54-L03-Q6', 'P54-L04-Q6', 'P62-L01-Q6', 'P62-L02-Q6'],
      'P53-L05': ['P61-MAINT-P53-Q3', 'P65-MAINT-P53-Q3'],
      'P53-L06': ['P61-MAINT-P53-Q4', 'P65-MAINT-P53-Q4'],
    };
    expect(evidence).toHaveLength(6);
    expect(evidence.reduce((n, e) => n + e.targets.length, 0)).toBe(26);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(25);
    for (const e of evidence) {
      expect(
        e.targets.filter((id) => !id.includes('FRACTION-STRUCTURE')),
      ).toEqual(original[e.sourceLesson]);
      for (const s of sets) {
        const q = s.questions[Number(e.sourceLesson.slice(-2)) - 1]!;
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
