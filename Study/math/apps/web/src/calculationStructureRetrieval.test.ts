import { describe, it, expect } from 'vitest';
import { calculationStructureRetrieval } from './content/calculationStructureRetrieval';
import { foundationRetrieval } from './content/foundationRetrieval';
import { foundationRecurrence } from './content/foundationRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { lessons, curriculum, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  columnCalculation,
  splitProduct,
  areaProduct,
  longDivision,
  estimateCalculation,
} from './calculationModels';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readWholeNumber } from './numberModels';

const sets = Object.values(calculationStructureRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const signed = (n: number) => String(n).replace('-', '−');

describe('B03 detailed calculation retrieval from actual authored givens', () => {
  it('adds ten bilingual process tasks to two existing later owners while preserving formal and older group identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    expect(
      new Set(sets.flatMap((s) => s.questions.map((q) => q.id))).size,
    ).toBe(10);
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('B03'));
      expect(maintenanceForUnit(s.unit).some((x) => x.id === s.id)).toBe(true);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(
        foundationRetrieval[s.unit].id,
      );
      expect(foundationRetrieval[s.unit].questions).toHaveLength(9);
      expect(s.questions).toHaveLength(5);
      expect(s.intro.en).toContain('ONE SUBPART');
      for (const [i, q] of s.questions.entries()) {
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer('1005 302 conserved correct', q.answer)).toBeNull();
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          q.stem.en && q.stem.zh && q.solution.en && q.solution.zh,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.en && h.zh)).toBe(true);
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en === c.zh)),
        ).toBe(true);
        expect(s.bridgeByQuestion[q.id]).toBe('B03-L0' + (i + 1));
        expect(q.diagram).toBeUndefined(); // The learner generates the missing diagrams, not a revealed answer figure.
      }
    }
  });
  it('checks every actual column expression, weighted exchange row, final carry, zero and faulty-column inverse', () => {
    for (const s of sets) {
      const q = s.questions[0]!;
      for (const [label, aa, op, bb] of rows(s, 0)) {
        const a = Number(aa),
          b = Number(bb),
          m = columnCalculation(a, b, op === '+' ? 'add' : 'subtract');
        expect(q.solution.en).toContain(a + op! + b + '=' + m.result);
        expect(q.solution.zh).toContain(a + op! + b + '=' + m.result);
        expect(q.solution.en).toContain(
          op === '+'
            ? m.result + '−' + b + '=' + a
            : m.result + '+' + b + '=' + a,
        );
        expect(m.result).toBe(op === '+' ? a + b : a - b);
        if (op === '+')
          for (const c of m.steps)
            expect(c.raw).toBe(c.digit + 10 * c.outgoing);
        else
          for (const c of m.steps)
            expect(
              c.after.reduce(
                (v, d, i) => v + d * 10 ** (c.after.length - i - 1),
                0,
              ),
            ).toBe(a);
        if (label === 'A') expect(m.finalCarry).toBe(1);
        if (label === 'B') {
          const exchanged = m.steps[0]!.after;
          const expansion = exchanged
            .map((n, i) => n * 10 ** (exchanged.length - i - 1))
            .join('+');
          expect(q.solution.en).toContain(a + '=' + expansion);
          const bad = Number(
            String(a)
              .split('')
              .map((d, i) => Math.abs(Number(d) - Number(String(b)[i])))
              .join(''),
          );
          expect(q.solution.en).toContain(
            bad + '+' + b + '=' + (bad + b) + '≠' + a,
          );
          expect(bad + b).not.toBe(a);
          expect(exchanged.slice(1, 3)).toEqual([9, 9]);
          expect(exchanged[3]).toBeGreaterThan(9);
        }
        if (label === 'E') expect(m.result).toBe(0);
      }
      expect(q.solution.en).toContain('zero is a value');
      expect(q.solution.en).toContain('TEN');
      expect(q.solution.en).toContain('HUNDRED');
      expect(q.solution.en).toContain('THOUSAND');
    }
  });
  it('recomputes all actual cuts, empty regions and one-factor doubling instead of assuming one particular decomposition', () => {
    for (const s of sets) {
      const q = s.questions[1]!;
      const actual = rows(s, 1).map(([label, g, size, c]) => ({
        label,
        m: splitProduct(Number(g), Number(size), Number(c)),
      }));
      for (const { label, m } of actual) {
        const head =
          label +
          ': ' +
          m.groups +
          '×' +
          m.cut +
          '+' +
          m.groups +
          '×' +
          m.rest +
          '=';
        expect(q.solution.en).toContain(
          head +
            (label!.startsWith('A')
              ? m.left + '+' + m.right + '=' + m.total
              : m.total),
        );
        expect(q.solution.zh).toContain(head);
        expect(m.left + m.right).toBe(m.groups * m.size);
      }
      const a = actual[0]!.m,
        gap = 10 - a.size;
      expect(q.solution.en).toContain(
        a.groups +
          '×' +
          a.size +
          '=' +
          a.groups +
          '×10−' +
          a.groups +
          '×' +
          gap +
          '=' +
          a.groups * 10 +
          '−' +
          a.groups * gap +
          '=' +
          a.total,
      );
      expect(a.groups * 10 - gap).not.toBe(a.total);
      const given = q.stem.en.match(/given (\d+)×(\d+)=(\d+)/)!;
      const [g, size, known] = given.slice(1).map(Number) as [
        number,
        number,
        number,
      ];
      expect(g * size).toBe(known);
      expect(q.solution.en).toContain(
        g +
          '×' +
          size * 2 +
          '=' +
          g +
          '×' +
          size +
          '+' +
          g +
          '×' +
          size +
          '=' +
          known +
          '+' +
          known +
          '=' +
          known * 2,
      );
      expect(q.solution.en).toContain(g * 2 + '×' + size * 2 + '=' + known * 4);
      expect(new Set(actual.slice(0, 4).map((x) => x.m.total)).size).toBe(1);
      expect(actual[4]!.m.groups).toBe(0);
      expect(actual[5]!.m.groups).toBeGreaterThan(0);
      expect(actual[5]!.m.size).toBe(0);
      expect(q.solution.en).toContain('row outlines');
    }
  });
  it('reconstructs the actual four areas, horizontal bands, wrong tens height and distinct perimeter/zero regions', () => {
    for (const s of sets) {
      const q = s.questions[2]!;
      for (const [label, aa, bb] of rows(s, 2)) {
        const a = Number(aa),
          b = Number(bb),
          m = areaProduct(a, b),
          areas = m.parts.map((p) => p.area);
        expect(q.solution.en).toContain(
          areas.join('+') + '=' + m.total + ' cm²',
        );
        expect(q.solution.zh).toContain(
          areas.join('+') + '=' + m.total + ' cm²',
        );
        expect(q.solution.en).toContain(
          a * m.bTens + '+' + a * m.bOnes + '=' + m.total,
        );
        expect(areas.reduce((v, n) => v + n, 0)).toBe(a * b);
        if (label === 'N') {
          const badHeight = (b % 10) + Math.floor(b / 10);
          expect(q.solution.en).toContain(
            a +
              '×' +
              Math.floor(b / 10) +
              '+' +
              a +
              '×' +
              (b % 10) +
              '=' +
              a * badHeight,
          );
          expect(q.solution.en).toContain(a + '+' + b + '=' + (a + b) + ' cm');
          expect(q.solution.en).toContain(
            '2×' + (a + b) + '=' + 2 * (a + b) + ' cm',
          );
          expect(a * badHeight).not.toBe(a * b);
        } else {
          expect(m.parts.filter((p) => p.width === 0)).toHaveLength(2);
          expect(m.parts.filter((p) => p.area === 0)).toHaveLength(2);
        }
      }
      expect(q.stem.en).toContain('SAME length scale');
      expect(q.solution.en).toContain('no positive-width patches');
    }
  });
  it('verifies all five actual division batches, each named unit step, essential zero, remainder rejection and exact/count distinction', () => {
    for (const s of sets) {
      const q = s.questions[3]!;
      for (const [label, nn, dd] of rows(s, 3)) {
        const n = Number(nn),
          d = Number(dd),
          m = longDivision(n, d),
          all = m.quotient + (m.remainder > 0 ? 1 : 0);
        const identity = n + '=' + d + '×' + m.quotient + '+' + m.remainder;
        expect(q.solution.en).toContain(
          label +
            ': ' +
            identity +
            '; full ' +
            m.quotient +
            ', minimum all ' +
            all,
        );
        expect(q.solution.zh).toContain(identity);
        expect(m.quotient * d + m.remainder).toBe(n);
        expect(m.remainder).toBeGreaterThanOrEqual(0);
        expect(m.remainder).toBeLessThan(d);
        expect(all * d).toBeGreaterThanOrEqual(n);
        if (all > 0) expect((all - 1) * d).toBeLessThan(n);
        if (m.remainder)
          expect(q.solution.en).toContain(
            'exact ' +
              n +
              '÷' +
              d +
              '=' +
              m.quotient +
              '+' +
              m.remainder +
              '/' +
              d,
          );
        if (label === 'L' || label === 'I')
          for (const [i, row] of m.steps.entries()) {
            expect(row.available).toBe(row.previous * 10 + row.digit);
            expect(row.available).toBe(d * row.quotientDigit + row.remainder);
            expect(q.solution.en).toContain(
              row.available +
                '=' +
                (i ? row.previous + '×10+' + row.digit + '=' : '') +
                d +
                '×' +
                row.quotientDigit +
                '+' +
                row.remainder,
            );
          }
        if (label === 'I') {
          const deleted = Number(String(m.quotient).replace('0', ''));
          expect(q.solution.en).toContain(
            d +
              '×' +
              deleted +
              '+' +
              m.remainder +
              '=' +
              (d * deleted + m.remainder) +
              '≠' +
              n,
          );
        }
        if (label === 'R') {
          const falseR = m.remainder + d;
          expect(q.solution.en).toContain(
            n + '=' + d + '×' + (m.quotient - 1) + '+' + falseR,
          );
          expect(d * (m.quotient - 1) + falseR).toBe(n);
          expect(falseR).toBeGreaterThanOrEqual(d);
        }
      }
      expect(q.solution.en).toContain('add ONE only when r>0');
      expect(q.solution.en).toContain('including 0÷0');
    }
    expect(() => longDivision(0, 0)).toThrow(RangeError);
    expect(() => longDivision(5, 0)).toThrow(RangeError);
  });
  it('checks written estimates, operand/result bounds and candidate screening, then validates the authored example of an open budget design', () => {
    for (const s of sets) {
      const q = s.questions[4]!;
      for (const [label, aa, op, bb, uu, cc] of rows(s, 4)) {
        const a = Number(aa),
          b = Number(bb),
          u = Number(uu) as 10 | 100;
        const m = estimateCalculation(
          a,
          b,
          op === '+' ? 'add' : op === '−' ? 'subtract' : 'multiply',
          u,
        );
        expect(q.solution.en).toContain(
          label +
            ': ' +
            a +
            op! +
            b +
            '≈' +
            m.roundA +
            op! +
            m.roundB +
            '=' +
            m.estimate,
        );
        expect(q.solution.zh).toContain(
          a + op! + b + '≈' + m.roundA + op + m.roundB + '=' + m.estimate,
        );
        for (const [value, lo, hi] of [
          [a, m.aLow, m.aHigh],
          [b, m.bLow, m.bHigh],
        ]) {
          expect(q.solution.en).toContain(value + ' in ' + lo + '–' + hi);
          expect(lo).toBeLessThanOrEqual(value!);
          expect(hi).toBeGreaterThanOrEqual(value!);
        }
        if (op === '−') {
          expect(q.solution.en).toContain(
            'Lower ' +
              m.aLow +
              '−' +
              m.bHigh +
              '=' +
              m.lower +
              ', upper ' +
              m.aHigh +
              '−' +
              m.bLow +
              '=' +
              m.upper,
          );
          expect(m.aLow - m.bLow).toBeGreaterThan(m.exact);
        } else
          expect(q.solution.en).toContain(
            'Bounds ' + m.lower + '≤' + a + op! + b + '≤' + m.upper,
          );
        const candidates = cc!.split(' / ').map(Number);
        expect(candidates).toHaveLength(3);
        expect(candidates[0]! < m.lower || candidates[0]! > m.upper).toBe(true);
        expect(
          candidates.slice(1).every((n) => n >= m.lower && n <= m.upper),
        ).toBe(true);
        expect(candidates[1]).toBe(m.exact - 1);
        expect(candidates[2]).toBe(m.exact);
        expect(q.solution.en).toContain(
          'Outside ' +
            candidates[0] +
            '; inside ' +
            candidates[1] +
            '/' +
            candidates[2],
        );
      }
      const plan = q.solution.en.match(
        /prices (\d+)\/(\d+) NZD, counts (\d+)\/(\d+), (\d+)×(\d+)\+(\d+)×(\d+)=(\d+)\+(\d+)=(\d+); estimate (\d+)\+(\d+)=(\d+), estimated balance (zero|−\d+)(?:,| but) exact (−\d+)/,
      )!;
      expect(plan).toBeTruthy();
      const [
        p1,
        p2,
        c1,
        c2,
        m1,
        k1,
        m2,
        k2,
        sub1,
        sub2,
        cost,
        e1,
        e2,
        estimate,
      ] = plan.slice(1, 15).map(Number) as number[];
      expect([m1, k1, m2, k2]).toEqual([p1, c1, p2, c2]);
      expect(p1! >= 1 && p1! <= 10 && p2! >= 1 && p2! <= 10).toBe(true);
      expect(sub1).toBe(p1! * c1!);
      expect(sub2).toBe(p2! * c2!);
      expect(cost).toBe(sub1! + sub2!);
      expect(cost).toBeGreaterThan(50);
      expect(e1).toBe(Math.round(sub1! / 10) * 10);
      expect(e2).toBe(Math.round(sub2! / 10) * 10);
      expect(estimate).toBe(e1! + e2!);
      expect(plan[15]).toBe(
        50 - estimate! === 0 ? 'zero' : signed(50 - estimate!),
      );
      expect(plan[16]).toBe(signed(50 - cost!));
      const repair = q.solution.en.match(
        /Repair counts (\d+)\/(\d+): cost (\d+)\+(\d+)=(\d+), estimate (\d+)\+(\d+)=(\d+)/,
      )!;
      const [rc1, rc2, rs1, rs2, rc, re1, re2, re] = repair
        .slice(1)
        .map(Number) as number[];
      expect(rc1).toBeGreaterThanOrEqual(1);
      expect(rc2).toBeGreaterThanOrEqual(1);
      expect(rs1).toBe(p1! * rc1!);
      expect(rs2).toBe(p2! * rc2!);
      expect(rc).toBe(rs1! + rs2!);
      expect(rc).toBeLessThanOrEqual(50);
      expect(re1).toBe(Math.round(rs1! / 10) * 10);
      expect(re2).toBe(Math.round(rs2! / 10) * 10);
      expect(re).toBe(re1! + re2!);
      expect(q.solution.en).toContain(
        'estimated balance ' +
          readWholeNumber(50 - re!).en.toLowerCase() +
          ', exact ' +
          readWholeNumber(50 - rc!).en.toLowerCase(),
      );
      expect(q.solution.en).toContain('Accept other valid prices/counts');
      expect(q.solution.en).toContain('exact category costs 40 and 12');
      expect(40 + 12).toBeGreaterThan(50);
      expect(Math.round(40 / 10) * 10 + Math.round(12 / 10) * 10).toBe(50);
      expect(q.solution.en).toContain('M uses cm², not cm or km');
    }
  });
  it('retains ten older targets and connects each new source objective to both distinct later units with exact set links', () => {
    const evidence = foundationRecurrence.filter((e) =>
      e.sourceLesson.startsWith('B03-'),
    );
    expect(evidence).toHaveLength(5);
    for (const [i, e] of evidence.entries()) {
      expect(e.targets).toHaveLength(4);
      for (const unit of ['P51', 'P52'])
        expect(e.targets).toContain(unit + '-MAINT-FOUNDATION-Q' + (i + 1));
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id)!;
        expect(link.href).toBe(maintenanceHref(s, q.id));
      }
    }
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(20);
  });
});
