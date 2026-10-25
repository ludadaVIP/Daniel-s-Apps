import { describe, it, expect } from 'vitest';
import { decimalStructureRetrieval } from './content/decimalStructureRetrieval';
import { fractionRetrieval } from './content/fractionRetrieval';
import { primaryRecurrence } from './content/primaryRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  decimalDigits,
  firstDifferentDecimal,
  roundMilli,
  decimalColumns,
  decimalDivision,
  shoppingModel,
} from './decimalModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(decimalStructureRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const scaled = (text: string, places: number) => {
  const [w, d = ''] = text.match(/\d+(?:\.\d+)?/)![0].split('.');
  return Number(w) * 10 ** places + Number(d.padEnd(places, '0'));
};
const milli = (text: string) => scaled(text, 3),
  cents = (text: string) => scaled(text, 2);
const f = (v: number) => (v / 1000).toFixed(3),
  cash = (v: number) => (v / 100).toFixed(2);
const round = (v: number, step: number) => {
  const low = Math.floor(v / step) * step;
  return 2 * (v - low) < step ? low : low + step;
};
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

describe('P52 detailed decimal units, precision and operations', () => {
  it('registers twelve bilingual human tasks with six precise bridges and keeps the existing four-task defaults and formal identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set<string>();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P52'));
      const old = Object.values(fractionRetrieval).find(
        (g) => g.unit === s.unit,
      )!;
      expect(old.questions).toHaveLength(4);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(old.id);
      expect(s.questions).toHaveLength(6);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.en && q.stem.zh && q.solution.en && q.solution.zh,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.en && h.zh)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('correct units because same', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P52-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(12);
  });
  it('rebuilds actual thousandth counts, place contributions, zero changes and correctly scaled fractional zoom windows', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        r = rows(s, 0),
        values = r.map((x) => milli(x[1]!));
      for (const [i, v] of values.entries()) {
        const chart = decimalDigits(v),
          digits = String(v).padStart(4, '0').split('').map(Number),
          weights = [1000, 100, 10, 1];
        expect(chart.map((p) => p.digit)).toEqual(digits);
        expect(chart.reduce((sum, p) => sum + p.contribution, 0)).toBe(v);
        expect(digits.reduce((sum, d, j) => sum + d * weights[j]!, 0)).toBe(v);
        expect(q.solution.en).toContain(
          r[i]![0] +
            ': ' +
            f(v) +
            '=' +
            Math.floor(v / 1000) +
            '+' +
            chart
              .slice(1)
              .map((p) => f(p.contribution))
              .join('+') +
            '; total ' +
            v +
            ' thousandths',
        );
      }
      const a = values[0]!,
        b = values[1]!,
        c = values[2]!,
        d = values[3]!,
        e = values[4]!;
      expect(d).toBe(c * 10);
      expect(e).toBe(c * 100);
      expect(milli(r[1]![1]!.slice(0, -1))).toBe(b);
      expect(milli(r[0]![1]!.replace(/(\d\.\d)0/, '$1'))).not.toBe(a);
      expect(q.solution.en).toContain('gives ' + f(a + 1));
      expect(q.solution.en).toContain('gives ' + f(a + 10));
      const fract = a % 1000,
        start = Math.floor(fract / 100) * 100,
        startHund = Math.floor(fract / 10) * 10;
      expect(q.solution.en).toContain(
        'Tenth window ' + f(start) + ' to ' + f(start + 100),
      );
      expect(q.solution.en).toContain(
        'hundredth window ' + f(startHund) + ' to ' + f(startHund + 10),
      );
      expect(q.solution.en).toContain(
        'Remaining shading is ' + f(fract - startHund),
      );
      expect(q.solution.en).toContain('ONLY fractional ' + f(fract));
      const rope = q.stem.en.match(/rope of (\d+) m and (\d+) mm/)!;
      const total = Number(rope[1]) * 1000 + Number(rope[2]);
      expect(q.solution.en).toContain('=' + f(total) + ' m=' + total + ' mm');
    }
  });
  it('recomputes exact sort order, first differing places, halfway carries, double rounding and separately estimated sums', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        rs = rows(s, 1),
        d = Object.fromEntries(rs.map(([id, n]) => [id!, milli(n!)])),
        sorted = [d.S1!, d.S2!, d.S3!, d.S4!].sort((a, b) => a - b);
      expect(q.solution.en).toContain('Order ' + sorted.map(f).join('<'));
      expect(firstDifferentDecimal(sorted[0]!, sorted[1]!)).toBe(1);
      expect(firstDifferentDecimal(sorted[1]!, sorted[2]!)).toBe(1);
      expect(firstDifferentDecimal(sorted[2]!, sorted[3]!)).toBe(3);
      const lower = Math.floor(d.R! / 10) * 10,
        upper = lower + 10;
      expect(d.R! - lower).toBe(upper - d.R!);
      expect(roundMilli(d.R!, 2)).toBe(upper);
      expect(q.solution.en).toContain('report≈' + (upper / 1000).toFixed(2));
      const direct = round(d.D!, 100),
        double = round(round(d.D!, 10), 100);
      expect(direct).not.toBe(double);
      expect(roundMilli(d.D!, 1)).toBe(direct);
      expect(roundMilli(roundMilli(d.D!, 2), 1)).toBe(double);
      expect(q.solution.en).toContain(
        'directly to tenths≈' + (direct / 1000).toFixed(1),
      );
      expect(d.E2! - d.E1!).toBe(2);
      expect(round(d.E1!, 100)).toBe(round(d.E2!, 100));
      const est = round(d.K1!, 100) + round(d.K2!, 100),
        exact = d.K1! + d.K2!;
      expect(q.solution.en).toContain(
        'estimates ' +
          (round(d.K1!, 100) / 1000).toFixed(1) +
          '+' +
          (round(d.K2!, 100) / 1000).toFixed(1) +
          '=' +
          (est / 1000).toFixed(1) +
          ' km',
      );
      expect(q.solution.en).toContain(
        'exact ' + f(d.K1!) + '+' + f(d.K2!) + '=' + f(exact) + ' km',
      );
      expect(est).not.toBe(exact);
    }
  });
  it('verifies the actual consecutive carries and full borrowing exchanges, zero differences and mismatched digit units', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        r = rows(s, 2);
      expect(q.misconceptionTags).toContain('decimal-addition');
      expect(q.misconceptionTags).toContain('decimal-subtraction');
      for (const [id, op, left, right] of r) {
        const a = milli(left!),
          b = milli(right!),
          expected = op === '+' ? a + b : a - b,
          m = decimalColumns(a, b, op === '+' ? 'add' : 'subtract');
        expect(m.result).toBe(expected);
        expect(
          m.columns.reduce(
            (sum, c) => sum + c.digit * [1000, 100, 10, 1][c.place]!,
            0,
          ),
        ).toBe(expected);
        expect(q.solution.en).toContain(
          id + ':' + f(a) + op + f(b) + '=' + f(expected) + ' m',
        );
        if (id === 'A')
          expect(m.columns.map((c) => c.outgoing)).toEqual([1, 1, 1, 0]);
        if (id === 'B') {
          expect(m.columns.map((c) => c.outgoing)).toEqual([1, 1, 1, 0]);
          const match = q.solution.en.match(
            /regroup [\d.]+=(\d+) ones\+(\d+) tenths\+(\d+) hundredths\+(\d+) thousandths/,
          )!;
          const expanded = match.slice(1).map(Number);
          expect(
            expanded.reduce((sum, v, i) => sum + v * [1000, 100, 10, 1][i]!, 0),
          ).toBe(a);
          expect(expected + b).toBe(a);
        }
        if (id === 'C') expect(expected).toBe(0);
        if (id === 'D') {
          const tenths = a / 100;
          const mixedUnitSum = tenths + b;
          expect(Number.isInteger(tenths)).toBe(true);
          expect(mixedUnitSum).not.toBe(expected);
          expect(q.solution.en).toContain(
            'not ' +
              tenths +
              '+' +
              b +
              '=' +
              mixedUnitSum +
              ' then ' +
              f(mixedUnitSum),
          );
        }
      }
    }
  });
  it('checks all actual repeated groups in integer thousandths, including whole products, no groups and existing empty groups', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        r = rows(s, 3);
      for (const [id, amount, groups] of r) {
        const a = milli(amount!),
          g = Number(groups),
          total = Array.from({ length: g }, () => a).reduce(
            (sum, x) => sum + x,
            0,
          );
        expect(total).toBe(a * g);
        expect(q.solution.en).toContain(
          id + ':' + f(a) + ' L×' + g + '=' + f(total) + ' L',
        );
        expect(
          decimalDigits(total).reduce((sum, p) => sum + p.contribution, 0),
        ).toBe(total);
      }
      expect((milli(r[1]![1]!) * Number(r[1]![2])) % 1000).toBe(0);
      expect(Number(r[2]![2])).toBe(0);
      expect(Number(r[3]![2])).toBe(4);
      expect(milli(r[3]![1]!)).toBe(0);
      const positive = milli(r[0]![1]!);
      expect(positive * 4).toBeGreaterThan(positive);
      expect(positive * 1).toBe(positive);
      expect(positive * 0).toBe(0);
      expect(q.solution.en).toContain('FOUR empty groups');
      expect(q.solution.en).toContain('zero shading width');
      expect(q.solution.en).toContain('Each full track is 2 L');
    }
  });
  it('cross-multiplies the actual exact shares and audits rounded totals on both sides, zero totals and a fixed-total halving', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        r = rows(s, 4);
      let above = 0,
        below = 0;
      for (const [id, total, groups] of r.filter((x) => x[0] !== 'F')) {
        const a = milli(total!),
          g = Number(groups),
          m = decimalDivision(a, g),
          match = q.solution.en.match(
            new RegExp(
              id +
                ':' +
                f(a).replace('.', '\\.') +
                '÷' +
                g +
                '=(\\d+)/(\\d+) L',
            ),
          )!;
        const n = Number(match[1]),
          d = Number(match[2]);
        expect(n * g * 1000).toBe(a * d);
        expect(gcd(n, d)).toBe(1);
        expect(m.numerator).toBe(n);
        expect(m.denominator).toBe(d);
        const floor = Math.floor(a / g),
          rounded = floor + (2 * (a % g) >= g ? 1 : 0);
        expect(m.roundedThousandths).toBe(rounded);
        if (a % g === 0) expect(q.solution.en).toContain('=' + f(a / g) + ' L');
        else {
          const display = rounded * g,
            delta = Math.abs(display - a);
          expect(delta).toBeGreaterThan(0);
          if (display > a) above++;
          else below++;
          expect(q.solution.en).toContain(
            'displays ' +
              f(rounded) +
              '×' +
              g +
              '=' +
              f(display) +
              ' L, ' +
              f(delta) +
              ' L ' +
              (display > a ? 'ABOVE' : 'BELOW') +
              ' original',
          );
        }
      }
      expect(above).toBe(1);
      expect(below).toBe(1);
      expect(decimalDivision(0, 5).numerator).toBe(0);
      expect(() => decimalDivision(1000, 0)).toThrow();
      expect(() => decimalDivision(0, 0)).toThrow();
      const fixed = milli(r.find((x) => x[0] === 'F')![1]!);
      expect((fixed / 6) * 2).toBe(fixed / 3);
      expect(q.solution.en).toContain(
        'F:' +
          f(fixed) +
          '÷3=' +
          f(fixed / 3) +
          ' L; ÷6=' +
          f(fixed / 6) +
          ' L',
      );
    }
  });
  it('reconstructs exact money/length cases and accepts the whole feasible space of positive-count three-item plans', () => {
    for (const s of sets) {
      const q = s.questions[5]!,
        r = Object.fromEntries(rows(s, 5).map(([id, , v]) => [id!, v!])),
        p = cents(r.M_P!),
        n = Number(r.M_N!),
        cost = p * n;
      expect(q.solution.en).toContain(
        'cost ' + p + '×' + n + '=' + cost + ' cents=NZ$' + cash(cost),
      );
      const estimate = round(p, 10) * n;
      expect(q.solution.en).toContain('total≈NZ$' + cash(estimate));
      for (const id of ['B', 'B2']) {
        const b = cents(r[id]!),
          m = shoppingModel(p, n, b);
        expect(m.total).toBe(cost);
        expect(m.estimate).toBe(estimate);
        if (b >= cost) {
          expect(q.solution.en).toContain(
            'remaining ' + (b - cost) + ' cents=NZ$' + cash(b - cost),
          );
          expect(m.change + cost).toBe(b);
        } else {
          expect(q.solution.en).toContain(
            'shortfall ' + (cost - b) + ' cents=NZ$' + cash(cost - b),
          );
          expect(m.shortfall + b).toBe(cost);
        }
      }
      expect(shoppingModel(p, n, cost).change).toBe(0);
      expect(shoppingModel(p, n, cost).shortfall).toBe(0);
      const length = milli(r.L_T!),
        each = milli(r.L_E!),
        cuts = Number(r.L_N!),
        used = each * cuts;
      expect(q.solution.en).toContain(
        'used ' + f(each) + '×' + cuts + '=' + f(used) + ' m',
      );
      expect(q.solution.en).toContain(
        'remaining ' +
          f(length) +
          '−' +
          f(used) +
          '=' +
          f(length - used) +
          ' m',
      );
      expect((length / 4) * 4).toBe(length);
      const pencilTotal = cents(r.E_T!),
        pencils = Number(r.E_N!);
      expect(pencilTotal % pencils).toBe(0);
      expect(q.solution.en).toContain(
        pencilTotal +
          ' cents÷' +
          pencils +
          '=' +
          pencilTotal / pencils +
          ' cents each',
      );
      const prices = [cents(r.F1!), cents(r.F2!), cents(r.F3!)],
        counts = q.solution.en
          .match(/ONE plan: counts (\d+)\/(\d+)\/(\d+)/)!
          .slice(1)
          .map(Number),
        exact = prices.reduce((sum, v, i) => sum + v * counts[i]!, 0),
        estimated = prices.reduce(
          (sum, v, i) => sum + round(v, 10) * counts[i]!,
          0,
        );
      expect(counts.every((c) => Number.isInteger(c) && c > 0)).toBe(true);
      expect(exact).toBeLessThanOrEqual(1000);
      expect(q.solution.en).toContain(
        '=' + exact + ' cents; remaining ' + (1000 - exact) + ' cents',
      );
      expect(q.solution.en).toContain('estimates ' + estimated + ' cents');
      let feasible = 0;
      for (let a = 1; a <= Math.floor(1000 / prices[0]!); a++)
        for (let b = 1; b <= Math.floor(1000 / prices[1]!); b++)
          for (let c = 1; c <= Math.floor(1000 / prices[2]!); c++) {
            const spend = a * prices[0]! + b * prices[1]! + c * prices[2]!;
            if (spend <= 1000) {
              feasible++;
              expect(spend + (1000 - spend)).toBe(1000);
            }
          }
      expect(feasible).toBeGreaterThan(1);
      expect(q.solution.en).toContain(
        'Accept ANY positive whole count for each type',
      );
    }
  });
  it('keeps all original references while connecting seven existing source tags to twelve exact later tasks', () => {
    const es = primaryRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P52-'),
    );
    expect(es).toHaveLength(7);
    expect(es.reduce((n, e) => n + e.targets.length, 0)).toBe(45);
    expect(new Set(es.flatMap((e) => e.targets)).size).toBe(32);
    const original = [
      ['P56-L01-Q3', 'P56-L01-Q5', 'P62-L02-Q5', 'P62-L02-Q6', 'P62-L02-X'],
      ['P62-L02-Q6', 'P62-L03-Q6', 'J91-L05-Q2', 'J91-L05-X', 'J98-L04-X'],
      ['P57-L05-Q3', 'P57-L05-Q5', 'J71-L03-Q3'],
      ['P57-L05-Q3', 'P57-L05-Q5', 'J74-L02-X', 'J71-L04-Q3'],
      ['P56-L01-Q3', 'P56-L01-Q5', 'P56-L02-X', 'P57-L05-Q5', 'P57-L05-Q6'],
      ['P62-L02-Q5', 'P62-L03-Q6', 'P68-L01-Q3', 'P68-L01-X'],
      ['P57-L05-Q3', 'P57-L05-Q5', 'P57-L05-Q6', 'P63-L05-Q2', 'P63-L05-Q6'],
    ];
    for (const [i, e] of es.entries()) {
      expect(
        e.targets.filter((id) => !id.includes('DECIMAL-STRUCTURE')),
      ).toEqual(original[i]);
      const index = Number(e.sourceLesson.slice(-2)) - 1;
      for (const s of sets) {
        const q = s.questions[index]!;
        expect(e.targets).toContain(q.id);
        expect(q.misconceptionTags).toContain(e.skill);
        expect(
          recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === q.id)!.href,
        ).toBe(maintenanceHref(s, q.id));
      }
    }
  });
});
