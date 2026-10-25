import { describe, it, expect } from 'vitest';
import { numberStructureTasks } from './content/numberStructureTasks';
import {
  maintenanceSets,
  recurrenceEvidence,
  maintenanceHref,
} from './content/maintenance';
import { curriculum, lessons, unitChecks, lessonById } from './content';
import { checkAnswer } from './model';
import {
  readWholeNumber,
  placeValues,
  axisPosition,
  roundingModel,
  blockValue,
  exchangeHundred,
} from './numberModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = [maintenanceSets.B03, maintenanceSets.B05];
const number = (s: string) => Number(s.replaceAll(',', ''));
describe('B01 subskills revisited in real later units', () => {
  it('appends eight bilingual human-reviewed tasks while retaining original IDs, curriculum and review counts', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    expect(Object.values(numberStructureTasks).flat()).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(9);
      expect(s.questions.map((q) => q.id)).toEqual(
        Array.from({ length: 9 }, (_, i) => s.unit + '-MAINT-B01-Q' + (i + 1)),
      );
      expect(unitChecks[s.unit as 'B03' | 'B05'].questions).toHaveLength(8);
      expect(
        s.questions.filter((q) => q.answer.kind === 'number'),
      ).toHaveLength(3);
      expect(
        s.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(6);
      for (const q of s.questions.slice(5)) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('all correct place ten 1000 approximately', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('rebuilds actual original expansions, spoken names, zero deletion and THREE separate changes rather than a chained transform', () => {
    for (const s of sets) {
      const q = s.questions[5]!,
        d = q.diagram!;
      if (d.kind !== 'place') throw Error('Original place chart required');
      const n = d.value,
        places = placeValues(n, 5),
        hundreds = places.find((p) => p.unit === 100)!.digit;
      expect(q.solution.en).toContain(readWholeNumber(n).en);
      const expansion = q.solution.en.match(/Expansion ([\d,+]+)=([\d,]+)/)!;
      expect(expansion).toBeTruthy();
      expect(
        expansion[1]!
          .split('+')
          .map(number)
          .reduce((a, b) => a + b, 0),
      ).toBe(n);
      expect(number(expansion[2]!)).toBe(n);
      const deleted = Number(String(n).slice(0, 1) + String(n).slice(2));
      expect(q.solution.en).toContain('gives ' + deleted + '=');
      const written = [
        ...q.solution.en.matchAll(/\([123]\) ([\d,]+), change \+([\d,]+)/g),
      ].map((m) => [number(m[1]!), number(m[2]!)]);
      const changed = [n + hundreds * (1000 - 100), n * 10, n + 1000];
      expect(written).toEqual(changed.map((v) => [v, v - n]));
      expect(changed[0]).not.toBe(n * 10);
      expect(changed[1]! - changed[0]!).not.toBe(0);
      expect(q.stem.en).toContain('For EACH separate change restart');
      expect(q.solution.en).toContain('EVERY digit contribution');
      expect(q.solution.en).toContain('reading assistance');
      expect(q.solution.en).toContain('Omitting a zero addend');
    }
  });
  it('reads the actual comparison pairs, proves the higher-place bound and reconstructs both invariant window coordinates with unequal relative positions', () => {
    for (const s of sets) {
      const q = s.questions[6]!,
        w = q.contextTable!.rows.map((r) =>
          r.slice(1).map((v) => Number(v.en)),
        );
      const m = q.stem.en.match(
        /compare ([\d,]+) with ([\d,]+), then ([\d,]+) with ([\d,]+)/,
      )!;
      expect(m).toBeTruthy();
      const values = m.slice(1).map(number);
      for (let i = 0; i < 4; i += 2) {
        const a = values[i]!,
          b = values[i + 1]!;
        expect(a).toBeLessThan(b);
        const as = String(a).padStart(String(b).length, '0'),
          bs = String(b);
        const at = [...as].findIndex((c, j) => c !== bs[j]);
        const unit = 10 ** (bs.length - at - 1),
          high = (Number(bs[at]) - Number(as[at])) * unit,
          lowerGap = (b % unit) - (a % unit);
        expect(high).toBeGreaterThanOrEqual(unit);
        expect(Math.abs(lowerGap)).toBeLessThan(unit);
        expect(high + lowerGap).toBe(b - a);
      }
      const computed = w.map(([start, end, count, p, q]) => {
        const step = (end! - start!) / count!;
        return {
          start: start!,
          end: end!,
          step,
          p: start! + p! * step,
          q: start! + q! * step,
        };
      });
      expect(computed[0]!.p).toBe(computed[1]!.p);
      expect(computed[0]!.q).toBe(computed[1]!.q);
      expect(computed[0]!.p).toBeLessThan(computed[0]!.q);
      expect(
        axisPosition(computed[0]!.p, computed[0]!.start, computed[0]!.end),
      ).not.toBe(
        axisPosition(computed[1]!.p, computed[1]!.start, computed[1]!.end),
      );
      const written = [
        ...q.solution.en.matchAll(
          /step (\d+), P=[^=;]+?=([\d,]+), Q=([\d,]+)/g,
        ),
      ].map((m) => m.slice(1).map(number));
      expect(written).toEqual(computed.map((v) => [v.step, v.p, v.q]));
      const d = q.diagram!;
      if (d.kind !== 'axis') throw Error('Original axis required');
      expect(d.start).toBe(computed[0]!.start);
      expect(d.end).toBe(computed[0]!.end);
      expect(d.point).toBe(computed[0]!.p);
      expect(d.divisions).toBe(w[0]![2]);
      expect(d.labelMode).toBe('endpoints');
      expect(d.showIntervalValue).toBe(false);
      expect([2, 4, 5].map((p, i) => p - [0, 2, 4][i]!)).toEqual([2, 2, 1]);
      expect(q.solution.en).toContain('0,2,4,6 cm');
      expect(q.solution.en).toContain('twenty-one tick marks');
    }
  });
  it('audits ALL actual rounding rows with independent integer quotients, midpoint ties, full carries and separate precision', () => {
    for (const s of sets) {
      const q = s.questions[7]!,
        rows = q.contextTable!.rows.map((r) => r.map((v) => Number(v.en)));
      const written = [
        ...q.solution.en.matchAll(
          /neighbours ([\d,]+)\/([\d,]+)[;,] midpoint ([\d,]+)[;,] distances ([\d,]+)\/([\d,]+), (?:so|giving) approximately ([\d,]+)/g,
        ),
      ].map((m) => m.slice(1).map(number));
      const oracle = rows.map(([n, u]) => {
        const lo = Math.floor(n! / u!) * u!,
          hi = lo + u!,
          mid = (lo + hi) / 2;
        return [lo, hi, mid, n! - lo, hi - n!, n! < mid ? lo : hi];
      });
      expect(written).toEqual(oracle);
      expect(written).toHaveLength(3);
      for (const [i, [n, u]] of rows.entries()) {
        const m = roundingModel(n!, u!);
        expect([
          m.lower,
          m.upper,
          m.midpoint,
          m.distanceLower,
          m.distanceUpper,
          m.rounded,
        ]).toEqual(oracle[i]);
      }
      expect(oracle[0]![3]).toBe(oracle[0]![4]);
      expect(oracle[0]![5]).toBeGreaterThan(rows[0]![0]!);
      expect(String(oracle[0]![5])).toMatch(/^[12]0+$/);
      expect(rows[1]![0]).toBe(rows[2]![0]);
      expect(oracle[1]![5]).not.toBe(oracle[2]![5]);
      const original = rows[1]![0]!,
        direct = oracle[2]![5]!,
        sequential = roundingModel(oracle[1]![5]!, 1000).rounded;
      expect(sequential).not.toBe(direct);
      expect(q.solution.en).toContain(
        [original, oracle[1]![5], sequential]
          .map((n) => n!.toLocaleString('en-NZ'))
          .join('→'),
      );
      expect(q.stem.en).toContain('row TWO’s APPROXIMATION');
      expect(q.solution.en).toContain('original remains');
      expect(q.stem.en).toContain('HALF-UP');
      expect(q.solution.en).toContain('one short');
    }
  });
  it('totals the actual block-count tables and checks equal-count inequality, two-way exchanges and written conservation values', () => {
    for (const s of sets) {
      const q = s.questions[8]!,
        rows = q.contextTable!.rows;
      const weights = rows.map((r) => Number(r[1]!.en)),
        a = rows.map((r) => Number(r[2]!.en)),
        b = rows.map((r) => Number(r[3]!.en));
      const dot = (x: number[]) =>
          x.reduce((n, c, i) => n + c * weights[i]!, 0),
        sum = (x: number[]) => x.reduce((n, c) => n + c, 0);
      expect(weights).toEqual([100, 10, 1]);
      expect(sum(a)).toBe(sum(b));
      expect(dot(a)).toBeGreaterThan(dot(b));
      const written = [...q.solution.en.matchAll(/so ([\d+]+)=(\d+)/g)].map(
        (m) => [
          m[1]!
            .split('+')
            .map(Number)
            .reduce((x, y) => x + y, 0),
          Number(m[2]),
        ],
      );
      expect(written).toEqual([
        [dot(a), dot(a)],
        [dot(b), dot(b)],
      ]);
      const start = { hundreds: a[0]!, tens: a[1]!, ones: a[2]! },
        next = exchangeHundred(start, 'to-tens');
      expect(blockValue(start)).toBe(dot(a));
      expect(blockValue(next)).toBe(dot(a));
      expect(next).toEqual({
        hundreds: a[0]! - 1,
        tens: a[1]! + 10,
        ones: a[2]!,
      });
      expect(exchangeHundred(next, 'to-hundred')).toEqual(start);
      expect(q.solution.en).toContain(
        'now ' +
          readWholeNumber(Object.values(next).reduce((x, y) => x + y, 0)).en +
          ' blocks',
      );
      expect(q.solution.en).toContain('Difference ' + (dot(a) - dot(b)));
      expect(q.solution.en).toContain('zero in tens');
    }
  });
  it('keeps all five broad-skill entries but exposes exact new subskill tasks in BOTH distinct later units and parent cards', () => {
    const evidence = recurrenceEvidence.filter((e) =>
      e.sourceLesson.startsWith('B01-'),
    );
    expect(evidence).toHaveLength(5);
    const unitOrder = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, source] of [
      'B01-L01',
      'B01-L02',
      'B01-L03',
      'B01-L04',
      'B01-L05',
    ].entries()) {
      const suffix = [6, 6, 7, 8, 9][i]!,
        e = evidence.find((e) => e.sourceLesson === source)!;
      for (const s of sets) {
        const q = s.questions.find((q) => q.id.endsWith('-Q' + suffix))!;
        expect(e.targets).toContain(q.id);
        expect(unitOrder.indexOf(s.unit)).toBeGreaterThan(
          unitOrder.indexOf('B01'),
        );
        const link = recurrenceLinksFor(source)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id)!;
        expect(link).toBeDefined();
        expect(link.href).toBe(maintenanceHref(s, q.id));
      }
    }
  });
  it('reuses two actual later lessons for rounding separate quantities before estimating a sum, retaining exact-total distinctions', () => {
    for (const [lessonId, questionId, scale, step] of [
      ['B03-L05', 'B03-L05-Q5', 1, 100],
      ['P52-L02', 'P52-L02-Q5', 1000, 100],
    ] as const) {
      const q = lessonById(lessonId)!.questions.find(
        (q) => q.id === questionId,
      )!;
      const values = [...q.stem.en.matchAll(/(\d+(?:\.\d+)?) (?:m|km)\b/g)].map(
        (m) => Math.round(Number(m[1]) * scale),
      );
      expect(values).toHaveLength(2);
      const estimated = values.reduce(
          (sum, n) => sum + Math.floor((n + step / 2) / step) * step,
          0,
        ),
        exact = values.reduce((a, b) => a + b, 0);
      expect(estimated).not.toBe(exact);
      expect(checkAnswer(String(estimated / scale), q.answer)).toBe(true);
      expect(checkAnswer(String(exact / scale), q.answer)).toBe(false);
      expect(q.solution.en).toContain(String(exact / scale));
      const link = recurrenceLinksFor('B01-L04')
        .flatMap((g) => g.targets)
        .find((t) => t.id === questionId)!;
      expect(link).toBeDefined();
      const url = new URL(link.href, 'http://localhost');
      expect(url.pathname).toBe('/math/lesson/' + lessonId);
      expect(url.searchParams.get('question')).toBe(questionId);
    }
  });
});
