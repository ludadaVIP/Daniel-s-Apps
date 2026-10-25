import { describe, it, expect } from 'vitest';
import { operationMeaningRetrieval } from './content/operationMeaningRetrieval';
import {
  maintenanceSets,
  maintenanceForUnit,
  maintenanceHref,
  recurrenceEvidence,
} from './content/maintenance';
import { lessons, curriculum, unitChecks, lessonById } from './content';
import { checkAnswer } from './model';
import {
  partWhole,
  equalGroups,
  divideObjects,
  inverseFacts,
} from './operationModels';
import { readWholeNumber } from './numberModels';
import { readRational as R } from './rationalModels';
import { textR, mulR, divR } from './algebraModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(operationMeaningRetrieval);
const nums = (s: string) => [...s.matchAll(/\d+/g)].map((m) => Number(m[0]));
const enNumber = (n: number) => readWholeNumber(n).en.toLowerCase();
describe('B02 subskill retrieval with quantity meanings', () => {
  it('registers two actual distinct later-unit groups without changing formal identities or the old nine-task group', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('B02'));
      expect(maintenanceForUnit(s.unit).some((x) => x.id === s.id)).toBe(true);
      expect(s.questions).toHaveLength(5);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('equal groups zero remainder correct complete', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
    expect(maintenanceSets.P51.questions).toHaveLength(9);
    expect(maintenanceForUnit('P51')[0]!.id).not.toBe(
      operationMeaningRetrieval.P51_OPERATIONS.id,
    );
  });
  it('rebuilds the actual four independent card relationships and written inverse checks, including unchanged compared groups', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        given = q.contextTable!.rows.map((r) => nums(r[1]!.zh));
      const written = [
        ...q.solution.en.matchAll(
          /[ABCD]: (?:difference )?(\d+)([+−])(\d+)=(\d+)/g,
        ),
      ].map((m) => [Number(m[1]), m[2], Number(m[3]), Number(m[4])]);
      const expected = given.map(([a, b], i) => [
        a,
        i === 0 ? '+' : '−',
        b,
        i === 0 ? a! + b! : a! - b!,
      ]);
      expect(written).toEqual(expected);
      const [a, b] = given[0]!,
        m = partWhole(a!, b!);
      expect(m.total).toBe(written[0]![3]);
      expect(m.difference).toBe(written[1]![3]);
      expect(m.difference).toBe(written[2]![3]);
      const increase = a! + b! + 1;
      expect(q.solution.en).toContain(a + '+' + (b! + 1) + '=' + increase);
      expect(q.solution.en).toContain('both groups');
      expect(q.stem.en).toContain('whole already contains');
    }
  });
  it('reads actual array and unequal-group counts, checks repeated sums, swapped roles and different zero models', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        rows = q.contextTable!.rows;
      const counts = rows.map((r) => r.slice(1).map((x) => Number(x.en)));
      const [g, size] = counts[0]!,
        m = equalGroups(g!, size!);
      const repeated = Array.from({ length: g! }, () => size!).join('+');
      expect(q.solution.en).toContain(
        repeated + '=' + g + '×' + size + '=' + m.total,
      );
      expect(q.solution.en).toContain(size + '×' + g + '=' + m.total);
      expect(q.solution.en).toContain(g + '+' + size + '=' + (g! + size!));
      expect(q.solution.en).toContain('not two object parts');
      const unequal = counts.slice(1, 4).map((r) => r[1]!);
      expect(new Set(unequal).size).toBeGreaterThan(1);
      expect(q.solution.en).toContain(
        unequal.join('+') + '=' + unequal.reduce((a, b) => a + b, 0),
      );
      expect(3 * unequal[1]!).not.toBe(unequal.reduce((a, b) => a + b, 0));
      for (const [g, p] of counts.slice(4))
        expect(equalGroups(g!, p!).total).toBe(0);
      expect(q.solution.en).toContain('no groups');
      expect(q.solution.en).toContain('empty outlines');
    }
  });
  it('checks every actual sharing/grouping ledger, exact/empty boundaries, all-container minima and divisible-liquid units', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        rows = q.contextTable!.rows.map((r) =>
          r.slice(1).map((x) => Number(x.en)),
        );
      const eq = [...q.solution.en.matchAll(/(\d+)=(\d+)×(\d+)\+(\d+)/g)].map(
        (m) => m.slice(1).map(Number),
      );
      const oracle = rows.map(([n, d]) => {
        const x = divideObjects(n!, d!, 'group');
        return [n, d, x.quotient, x.remainder];
      });
      expect(eq).toEqual(oracle);
      const minimums = rows.map(
        ([n, d]) => Math.floor(n! / d!) + (n! % d! > 0 ? 1 : 0),
      );
      const words = [...q.solution.en.matchAll(/minimum ([A-Z]+) boxes/g)].map(
        (m) => m[1]!.toLowerCase(),
      );
      expect(words).toEqual(minimums.map(enNumber));
      for (const [n, d] of rows) {
        const share = divideObjects(n!, d!, 'share'),
          group = divideObjects(n!, d!, 'group');
        expect(share.groupCount).toBe(d);
        expect(group.perGroup).toBe(d);
        expect(share.assigned + share.remainder).toBe(n);
        expect(share.remainder).toBeLessThan(d!);
        const needed = Math.floor(n! / d!) + (n! % d! > 0 ? 1 : 0);
        expect(needed * d!).toBeGreaterThanOrEqual(n!);
        if (needed > 0) expect((needed - 1) * d!).toBeLessThan(n!);
      }
      const [n, d] = rows[0]!,
        liquid = q.solution.en.match(/gives (\d+\/\d+) L each/)!;
      expect(textR(R(liquid[1]!))).toBe(
        textR(divR(R(String(n)), R(String(d)))),
      );
      expect(textR(mulR(R(liquid[1]!), R(String(d))))).toBe(String(n));
      expect(q.solution.en).toContain('Add one iff r>0');
      for (const mode of ['share', 'group'] as const)
        expect(() => divideObjects(0, 0, mode)).toThrow();
    }
  });
  it('audits actual nonzero/equal/zero-factor rows and all written divisions while preserving quotient roles and nonuniqueness', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        rows = q.contextTable!.rows.map((r) =>
          r.slice(1).map((x) => Number(x.en)),
        );
      const [g, p] = rows[0]!,
        n = equalGroups(g!, p!).total;
      expect(q.solution.en).toContain(
        g + '×' + p + '=' + p + '×' + g + '=' + n,
      );
      const [f1, f2] = rows[1]!,
        sq = equalGroups(f1!, f2!).total;
      expect(f1).toBe(f2);
      expect(q.solution.en).toContain(f1 + '×' + f2 + '=' + sq);
      for (const [a, b] of rows) {
        const f = inverseFacts(a!, b!);
        expect(f.divisions).toHaveLength((a! > 0 ? 1 : 0) + (b! > 0 ? 1 : 0));
        expect(f.total).toBe(a! * b!);
      }
      const divisions = [...q.solution.en.matchAll(/(\d+)÷(\d+)=(\d+)/g)].map(
        (m) => m.slice(1).map(Number),
      );
      expect(divisions).toHaveLength(5);
      for (const [n, d, x] of divisions) {
        expect(d).toBeGreaterThan(0);
        expect(d! * x!).toBe(n);
      }
      expect(q.solution.en).toMatch(/Z1:.*?0÷\d+=0 groups/);
      expect(q.solution.en).toMatch(/Z2:.*?0÷\d+=0 objects per group/);
      const witnesses = [...q.solution.en.matchAll(/0×(\d+)=0/g)].map((m) =>
        Number(m[1]),
      );
      expect(new Set(witnesses).size).toBeGreaterThanOrEqual(2);
      expect(q.solution.en).toContain('0×□=5 has no solution');
    }
  });
  it('uses actual four operation cards and exact budget givens, including every valid positive-integer repair rather than one sample', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        given = q.contextTable!.rows.map((r) => nums(r[1]!.zh));
      const written = [
        ...q.solution.en.matchAll(/[ABCD]: (\d+)([×÷+−])(\d+)=(?:NZ\$)?(\d+)/g),
      ].map((m) => [Number(m[1]), m[2], Number(m[3]), Number(m[4])]);
      const ops = ['×', '÷', '+', '−'];
      expect(written).toEqual(
        given.map(([a, b], i) => [
          a,
          ops[i],
          b,
          i === 0 ? a! * b! : i === 1 ? a! / b! : i === 2 ? a! + b! : a! - b!,
        ]),
      );
      const m = q.stem.zh.match(
        /预算NZ\$(\d+)，甲每件(\d+)元买(\d+)件，乙每件(\d+)元原拟买(\d+)件/,
      )!;
      const [budget, xPrice, xCount, yPrice, yCount] = m.slice(1).map(Number);
      const estimate = q.solution.en
        .match(/Estimate: (\d+)\+(\d+)≈(\d+)/)!
        .slice(1)
        .map(Number);
      const xRounded = Math.round((xPrice! * xCount!) / 10) * 10;
      const yRounded =
        s.unit === 'B06'
          ? yPrice! * yCount!
          : Math.round((yPrice! * yCount!) / 10) * 10;
      expect(estimate).toEqual([xRounded, yRounded, xRounded + yRounded]);
      expect(q.solution.en).toContain('decide with exact costs');
      const cost = xPrice! * xCount! + yPrice! * yCount!,
        excess = cost - budget!;
      expect(excess).toBeGreaterThan(0);
      expect(q.solution.en).toContain(
        xPrice + '×' + xCount + '+' + yPrice + '×' + yCount + '=' + cost,
      );
      expect(q.solution.en).toContain('by ' + enNumber(excess).toUpperCase());
      const repair = Number(q.solution.en.match(/repair is Y=(\d+)/)![1]);
      expect(Number.isInteger(repair) && repair >= 1).toBe(true);
      expect(xPrice! * xCount! + yPrice! * repair).toBeLessThanOrEqual(budget!);
      const writtenRange = q.solution.en.match(/ANY integer Y=(\d+)\.\.(\d+)/)!;
      const lo = Number(writtenRange[1]),
        hi = Number(writtenRange[2]);
      const actual = Array.from({ length: 20 }, (_, i) => i).filter(
        (n) => n >= 1 && xPrice! * xCount! + yPrice! * n <= budget!,
      );
      expect(actual).toEqual(
        Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
      );
      expect(q.solution.en).toContain('other fully checked valid plans');
      expect(checkAnswer('Y=' + repair, q.answer)).toBeNull();
    }
  });
  it('exposes exact new source-card targets in two real later units without faking new skills or formal lessons', () => {
    const b02 = recurrenceEvidence.filter((e) =>
      e.sourceLesson.startsWith('B02-'),
    );
    expect(b02).toHaveLength(6);
    expect(b02.flatMap((e) => e.targets)).toHaveLength(28);
    expect(new Set(b02.flatMap((e) => e.targets)).size).toBe(26);
    for (let i = 1; i <= 5; i++)
      for (const s of sets) {
        const q = s.questions[i - 1]!,
          links = recurrenceLinksFor('B02-L0' + i).flatMap((g) => g.targets);
        const link = links.find((x) => x.id === q.id)!;
        expect(link).toBeDefined();
        expect(link.href).toBe(maintenanceHref(s, q.id));
        expect(
          b02
            .filter((e) => e.sourceLesson === 'B02-L0' + i)
            .every((e) => e.targets.includes(q.id)),
        ).toBe(true);
      }
  });
});
