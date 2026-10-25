import { describe, it, expect } from 'vitest';
import { fractionDecimalMeaningRetrieval } from './content/fractionDecimalMeaningRetrieval';
import { numberTheoryRetrieval } from './content/numberTheoryRetrieval';
import { foundationRecurrence } from './content/foundationRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { lessons, curriculum, unitChecks } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readWholeNumber } from './numberModels';

const sets = Object.values(fractionDecimalMeaningRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const cents = (s: string) => {
  const m = s.match(/^(\d+)\.(\d{1,2})$/)!;
  expect(m).toBeTruthy();
  return Number(m[1]) * 100 + Number(m[2]!.padEnd(2, '0'));
};
const dollars = (c: number) => (c / 100).toFixed(2);

describe('B04 detailed fraction, decimal and money meanings', () => {
  it('checks original choice mathematics and gives distinct bilingual feedback for every misconception without changing option identities', () => {
    const source = lessons.filter((l) => l.id.startsWith('B04-'));
    const choices = source
      .flatMap((l) => [l.guided, ...l.questions, l.exit])
      .filter((q) => q.answer.kind === 'choice');
    expect(choices).toHaveLength(6);
    expect(choices.reduce((n, q) => n + q.options!.length, 0)).toBe(17);
    const expected = new Map([
      ['L01-Q1', 1],
      ['L02-G', 0],
      ['L02-Q3', 2],
      ['L03-Q3', 1],
      ['L04-Q3', 0],
      ['L05-Q3', 1],
    ]);
    const ratio = (label: string) => {
      const [n, d] = label.split('/').map(Number);
      return n! / d!;
    };
    for (const q of choices) {
      expect(q.answer.kind).toBe('choice');
      expect(q.answer.kind === 'choice' && Number(q.answer.value)).toBe(
        expected.get(q.id),
      );
      const ids = q.id === 'L02-G' ? ['0', '1'] : ['0', '1', '2'];
      expect(q.options!.map((o) => o.id)).toEqual(ids);
      expect(new Set(q.options!.map((o) => o.feedback.en)).size).toBe(
        ids.length,
      );
      for (const option of q.options!) {
        expect(option.feedback.zh && option.feedback.en).toBeTruthy();
        expect(option.feedback.en).not.toContain('Check “');
        expect(checkAnswer(option.id, q.answer)).toBe(
          Number(option.id) === expected.get(q.id),
        );
      }
      if (q.id === 'L02-G')
        expect(ratio(q.options![0]!.text.en)).toBeGreaterThan(
          ratio(q.options![1]!.text.en),
        );
      if (q.id === 'L02-Q3')
        expect(q.options!.map((o) => ratio(o.text.en))).toEqual([
          1 / 2,
          1 / 3,
          1 / 6,
        ]);
      if (q.id === 'L03-Q3')
        expect(q.options!.map((o) => ratio(o.text.en) > 1 / 2)).toEqual([
          false,
          true,
          false,
        ]);
      if (q.id === 'L04-Q3') {
        expect(Number(q.options![0]!.text.en)).toBeGreaterThan(
          Number(q.options![1]!.text.en),
        );
        expect(50 - 45).toBe(5);
      }
      if (q.id === 'L05-Q3') {
        expect(
          q.options!.map((o) => {
            const [whole, part] = o.text.en.replace('NZ$', '').split('.');
            return (Number(whole! + part!) * 100) / 10 ** part!.length;
          }),
        ).toEqual([205, 250, 200.5]);
        expect(q.options![2]!.feedback.en).toContain(
          '0.005 dollar is 0.5 cent, not fifty',
        );
      }
    }
    const mark = source
      .find((l) => l.id === 'B04-L03')!
      .questions.find((q) => q.id === 'L03-Q1')!;
    expect(mark.stem.zh).toContain('从0向右走2个区间');
    expect(mark.stem.en).toContain('second mark after 0');
    expect(checkAnswer('2/5', mark.answer)).toBe(true);
    expect(checkAnswer('1/5', mark.answer)).toBe(false);
  });
  it('registers ten bilingual human tasks with unchanged formal and older group identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    expect(
      new Set(sets.flatMap((s) => s.questions.map((q) => q.id))).size,
    ).toBe(10);
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('B04'));
      expect(maintenanceForUnit(s.unit).some((g) => g.id === s.id)).toBe(true);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(
        numberTheoryRetrieval[s.unit].id,
      );
      expect(numberTheoryRetrieval[s.unit].questions).toHaveLength(2);
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('same whole hundredths correct money', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh === c.en)),
        ).toBe(true);
        expect(s.bridgeByQuestion[q.id]).toBe('B04-L0' + (i + 1));
      }
    }
  });
  it('computes removed/remaining complements and the actual unequal strips, including zero/all and the genuine quarter repair', () => {
    for (const s of sets) {
      const q = s.questions[0]!;
      for (const [label, nn, ss] of rows(s, 0)) {
        const n = Number(nn),
          selected = Number(ss),
          remaining = n - selected;
        expect(q.solution.en).toContain(
          label + ': removed ' + selected + '/' + n,
        );
        expect(q.solution.en).toContain('remaining ' + remaining + '/' + n);
        expect(q.solution.zh).toContain('取' + selected + '/' + n);
        expect(q.solution.zh).toContain('余' + remaining + '/' + n);
        expect(selected + remaining).toBe(n);
        expect(selected).toBeGreaterThanOrEqual(0);
        expect(selected).toBeLessThanOrEqual(n);
      }
      const strip = q.stem.en.match(
        /strip (\d+) cm long is cut along its length into ([\d, ]+) cm sections/,
      )!;
      const whole = Number(strip[1]),
        parts = strip[2]!.split(', ').map(Number);
      expect(parts).toHaveLength(4);
      expect(parts.reduce((v, n) => v + n, 0)).toBe(whole);
      expect(new Set(parts).size).toBeGreaterThan(1);
      for (const part of parts)
        expect(q.solution.en).toContain(part + '/' + whole);
      expect(q.solution.en).toContain(
        'Repair: ' + whole + '÷4=' + whole / 4 + ' cm per quarter',
      );
      expect(q.solution.en).toContain('ORIGINAL whole');
      expect(q.solution.en).toContain('constant width');
    }
  });
  it('checks actual halves, thirds and quarters, their recombination and the strict reversed physical-length comparison', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        data = rows(s, 1);
      for (const [, ww, dd] of data) {
        const w = Number(ww),
          d = Number(dd);
        expect(q.solution.en).toContain(w + '÷' + d + '=' + w / d + ' cm');
      }
      const w = Number(data[0]![1]),
        quarter = w / 4;
      expect(q.solution.en).toContain('1/4+1/4=2/4=1/2');
      expect(q.solution.en).toContain(
        quarter + '+' + quarter + '=' + w / 2 + ' cm',
      );
      expect(q.solution.en).toContain('4/4=1, 4×' + quarter + '=' + w + ' cm');
      const m = q.stem.en.match(
        /quarter of a (\d+) cm large strip with one half of an (\d+) cm small strip/,
      )!;
      const big = Number(m[1]),
        small = Number(m[2]);
      expect(big / 4).toBeGreaterThan(small / 2);
      expect(q.solution.en).toContain(
        big + '×1/4=' + big / 4 + ' cm, ' + small + '×1/2=' + small / 2 + ' cm',
      );
      expect(q.solution.en).toContain('1/2>1/3>1/4');
      expect(q.solution.en).toContain('1/4<1/2 remains true');
      expect(1 * 2).toBeLessThan(1 * 4); // Cross multiplication preserves numerical order independently of reference lengths.
    }
  });
  it('reconstructs every tick and equivalent point from the actual interval counts and diagnoses changed counts, scale and decimal approximation', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        data = rows(s, 2);
      for (const [label, dd, mm] of data) {
        const d = Number(dd),
          move = Number(mm),
          ticks = Array.from({ length: d + 1 }, (_, i) =>
            i === 0 ? '0' : i === d ? '1' : i + '/' + d,
          );
        expect(q.solution.en).toContain(
          label +
            ': interval 1/' +
            d +
            '; ticks ' +
            ticks.join(',') +
            ', ' +
            readWholeNumber(d + 1).en.toUpperCase() +
            ' marks',
        );
        expect(q.solution.en).toContain('P=' + move + '/' + d);
      }
      const d = Number(data[0]![1]),
        move = Number(data[0]![2]);
      expect(Number(data[1]![2]) * d).toBe(move * Number(data[1]![1]));
      expect(move / (d * 2)).not.toBe(move / d);
      expect(q.solution.en).toContain(move + '/' + d * 2);
      const paper = q.stem.en.match(/paper positions 0, (\d+), (\d+) cm/)!;
      const wrong = Number(paper[1]),
        end = Number(paper[2]);
      expect(wrong).not.toBe(end / 2);
      expect(q.solution.en).toContain('repaired middle is ' + end / 2 + ' cm');
      expect(q.solution.en).toContain('3×1/3=1');
      expect(q.solution.en).toContain('3×0.333=0.999≠1');
      expect(333 * 3).toBe(999);
      expect(333 * 3).not.toBe(1000);
      expect(q.solution.en).toContain('1/3≈0.333, not exact equality');
    }
  });
  it('rebuilds actual hundred grids and both zero roles through the full 100/100 boundary', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        data = rows(s, 3);
      for (const [label, total, nn] of data) {
        const n = Number(nn);
        expect(Number(total)).toBe(100);
        const prefix =
          label +
          ': ' +
          n +
          ' cells=' +
          Math.floor(n / 10) +
          ' tenths+' +
          (n % 10) +
          ' hundredths=' +
          n +
          '/100=' +
          dollars(n);
        expect(q.solution.en).toContain(prefix);
        expect(q.solution.zh).toContain(n + '/100=' + dollars(n));
      }
      const a = Number(data[0]![2]),
        b = Number(data[1]![2]),
        c = Number(data[2]![2]);
      expect(c).toBe(b * 10);
      expect(c).toBeGreaterThan(a);
      expect(a).toBeGreaterThan(b);
      expect(q.solution.en).toContain(
        dollars(c) + '>' + dollars(a) + '>' + dollars(b),
      );
      expect(q.solution.en).toContain('1/10=10/100=0.10');
      expect(q.solution.en).toContain('1 whole+0 tenths+0 hundredths');
      expect(q.solution.en).toContain('TENFOLD');
    }
  });
  it('reads every actual money amount as whole dollars, decimal cents and total cents and independently checks estimated/exact change and open-plan arithmetic', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        data = rows(s, 4);
      const written = [
        ...q.solution.en.matchAll(
          /(M\d): NZ\$(\d+\.\d+)(?:=NZ\$\d+\.\d+)?=(\d+) dollars\+(\d+) cents=(\d+) cents/g,
        ),
      ];
      expect(written).toHaveLength(3);
      for (const [i, m] of written.entries()) {
        const row = data[i]!,
          value = cents(row[1]!);
        expect(m[1]).toBe(row[0]);
        expect(m[2]).toBe(row[1]);
        expect(Number(m[3])).toBe(Math.floor(value / 100));
        expect(Number(m[4])).toBe(value % 100);
        expect(Number(m[5])).toBe(value);
        expect(q.solution.zh).toContain('=' + value + '分');
      }
      expect(cents(data[1]![1]!)).toBe(cents(data[2]![1]!));
      expect(cents(data[0]![1]!)).not.toBe(cents(data[1]![1]!));
      const r = data[3]!,
        p = cents(r[1]!),
        p2 = cents(r[2]!),
        payment = cents(r[3]!),
        total = p + p2,
        change = payment - total;
      expect(q.solution.en).toContain(
        p + '+' + p2 + '=' + total + ' cents=NZ$' + dollars(total),
      );
      expect(q.solution.en).toContain(
        payment + '−' + total + '=' + change + ' cents=NZ$' + dollars(change),
      );
      expect(q.solution.en).toContain(
        total + '+' + change + '=' + payment + ' cents',
      );
      const rounded = [p, p2].map((c) => Math.floor((c + 50) / 100));
      expect(q.solution.en).toContain(
        'rounded prices ' +
          rounded[0] +
          ' and ' +
          rounded[1] +
          ', estimated total ' +
          (rounded[0]! + rounded[1]!) +
          ' dollars, estimated change ' +
          (payment / 100 - rounded[0]! - rounded[1]!),
      );
      expect(q.solution.en).toContain('zero cents=NZ$0.00');
      const own = q.solution.en.match(
        /invented example: prices (\d+)\/(\d+) cents, payment (\d+) cents/,
      )!;
      const a = Number(own[1]),
        b = Number(own[2]),
        pay = Number(own[3]),
        cost = a + b,
        balance = pay - cost;
      expect(a).toBeGreaterThan(0);
      expect(b).toBeGreaterThan(0);
      expect(pay % 100).toBe(0);
      expect(balance).toBeGreaterThanOrEqual(0);
      expect(q.solution.en).toContain(
        a +
          '+' +
          b +
          '=' +
          cost +
          ' cents, change ' +
          pay +
          '−' +
          cost +
          '=' +
          balance +
          ' cents=NZ$' +
          dollars(balance),
      );
      expect(q.solution.en).toContain(
        'check ' + cost + '+' + balance + '=' + pay,
      );
      expect(q.solution.en).toContain(
        'accept ANY two positive whole-cent prices',
      );
      expect(q.solution.en).toContain(
        'not a claim about a shop or real family activity',
      );
    }
  });
  it('retains twenty older target references and links all six source tags to exact new later-unit tasks without renaming legacy IDs', () => {
    const evidence = foundationRecurrence.filter((e) =>
      e.sourceLesson.startsWith('B04-'),
    );
    expect(evidence).toHaveLength(6);
    expect(evidence.reduce((n, e) => n + e.targets.length, 0)).toBe(32);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(28);
    for (const e of evidence) {
      expect(e.sourceTask).toMatch(/^L0[1-5]-Q/);
      const i = Number(e.sourceLesson.slice(-1)) - 1;
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id)!;
        expect(link.href).toBe(maintenanceHref(s, q.id));
      }
    }
  });
});
