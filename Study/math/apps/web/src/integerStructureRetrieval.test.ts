import { describe, it, expect } from 'vitest';
import { integerStructureRetrieval } from './content/integerStructureRetrieval';
import { numberTheoryRetrieval } from './content/numberTheoryRetrieval';
import { primaryRecurrence } from './content/primaryRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  arithmeticTrace,
  positiveFactors,
  factorPairs,
  positiveMultiples,
  trialDivision,
  numberKind,
  commonNumbers,
  type ArithmeticToken,
} from './integerModels';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(integerStructureRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const tokens = (e: string) =>
  e
    .match(/\d+|[+−×÷()]/g)!
    .map((v) => (/^\d+$/.test(v) ? Number(v) : v)) as ArithmeticToken[];
// Independent operator-stack evaluation; no source trace or executable input text.
const valueOf = (e: string) => {
  const numbers: number[] = [],
    ops: string[] = [],
    priority = (o: string) => ('×÷'.includes(o) ? 2 : 1);
  const apply = () => {
    const op = ops.pop(),
      b = numbers.pop()!,
      a = numbers.pop()!;
    if (op === '÷' && (b === 0 || a % b !== 0))
      throw new RangeError('Non-exact whole quotient');
    numbers.push(
      op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b,
    );
  };
  for (const t of tokens(e)) {
    if (typeof t === 'number') numbers.push(t);
    else if (t === '(') ops.push(t);
    else if (t === ')') {
      while (ops.length && ops.at(-1) !== '(') apply();
      if (ops.at(-1) !== '(') throw new SyntaxError('Unmatched bracket');
      ops.pop();
    } else {
      while (
        ops.length &&
        ops.at(-1) !== '(' &&
        priority(ops.at(-1)!) >= priority(t)
      )
        apply();
      ops.push(t);
    }
  }
  if (ops.includes('(')) throw new SyntaxError('Unclosed bracket');
  while (ops.length) apply();
  return numbers[0]!;
};
const factors = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const chain = (text: string, id: string) =>
  text.match(new RegExp(id + ': ([0-9+−×÷()=]+)'))![1]!.split('=');
describe('P51 whole-expression and divisibility retrieval', () => {
  it('adds ten bilingual human tasks to distinct later units, retaining their original two-task default groups', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set<string>();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P51'));
      const old = Object.values(numberTheoryRetrieval).find(
        (g) => g.unit === s.unit,
      )!;
      expect(old.questions).toHaveLength(2);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(old.id);
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.en && h.zh)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('correct because factors', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P51-L0' + (i + 1));
      }
    }
    expect(ids.size).toBe(10);
  });
  it('checks every full line of actual M/S/Z chains, zero roles, quotient places, product strategies and independent budgets', () => {
    for (const s of sets) {
      const q = s.questions[0]!;
      for (const [id, e] of rows(s, 0)) {
        const lines = chain(q.solution.en, id!);
        expect(lines[0]).toBe(e);
        const expected = valueOf(e!),
          trace = arithmeticTrace(tokens(e!));
        expect(trace.result).toBe(expected);
        expect(lines.map(valueOf)).toEqual(lines.map(() => expected));
        expect(lines.at(-1)).toBe(String(expected));
        expect(lines).toEqual([
          trace.original.replaceAll(' ', ''),
          ...trace.steps.map((t) => t.after.replaceAll(' ', '')),
        ]);
        for (const step of trace.steps)
          expect(valueOf(step.before)).toBe(valueOf(step.after));
      }
      const sequential = rows(s, 0)[1]![1]!,
        nums = sequential.match(/\d+/g)!.map(Number),
        [a, b, c, d] = nums;
      expect(q.solution.en).toContain(b + '×' + a! / b! + '=' + a);
      const changed = a + '÷(' + b + '×' + c + ')+' + d;
      expect(valueOf(changed)).not.toBe(valueOf(sequential));
      expect(q.solution.en).toContain(
        '=' + valueOf(changed) + ', a DIFFERENT expression',
      );
      const z = rows(s, 0)[2]![1]!,
        divisor = Number(z.match(/÷(\d+)/)![1]);
      expect(valueOf('0÷' + divisor)).toBe(0);
      expect(() => arithmeticTrace(tokens(divisor + '÷0'))).toThrow();
      expect(() => arithmeticTrace(tokens('0÷0'))).toThrow();
      expect(q.solution.en).toContain(divisor + '÷0 and 0÷0 are undefined');
      const budget = q.stem.en.match(
        /budget of NZ\$(\d+), buy (\d+) sets at NZ\$(\d+)/,
      )!;
      const money = Number(budget[1]),
        count = Number(budget[2]),
        price = Number(budget[3]);
      expect(q.solution.en).toContain(
        'cost ' + count + '×' + price + '=NZ$' + count * price,
      );
      expect(q.solution.en).toContain(
        'remaining ' +
          money +
          '−' +
          count * price +
          '=NZ$' +
          (money - count * price),
      );
      const product = rows(s, 0)[0]![1]!.match(/\+(\d+)×(\d+)−/)!;
      expect(q.solution.en).toContain('Product strategies:');
      const strategies = q.solution.en.match(
        /Product strategies: ([0-9()+−×=]+) and ([0-9()+−×=]+)/,
      )!;
      for (const strategy of strategies.slice(1))
        expect(strategy.split('=').map(valueOf)).toEqual(
          strategy
            .split('=')
            .map(() => Number(product[1]) * Number(product[2])),
        );
    }
  });
  it('audits eight scope chains including nested/right brackets and distinguishes one coincidental match from general equivalence', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        r = rows(s, 1);
      for (const [id, e] of r) {
        const lines = chain(q.solution.en, id!),
          result = valueOf(e!);
        expect(lines[0]).toBe(e);
        expect(lines.map(valueOf)).toEqual(lines.map(() => result));
        expect(arithmeticTrace(tokens(e!)).result).toBe(result);
      }
      for (const i of [0, 2, 4])
        expect(valueOf(r[i]![1]!)).not.toBe(valueOf(r[i + 1]![1]!));
      const right = arithmeticTrace(tokens(r[6]![1]!));
      expect(right.steps[0]!.depth).toBe(1);
      expect(right.steps[0]!.op).toBe('+');
      expect(right.steps[0]!.result).toBe(15);
      const nested = arithmeticTrace(tokens(r[7]![1]!));
      expect(nested.steps.map((x) => x.depth)).toEqual([2, 1, 0]);
      const c = r[2]![1]!.replace(/×\d+$/, '×1'),
        d = r[3]![1]!.replace(/×\d+\)/, '×1)');
      expect(valueOf(c)).toBe(valueOf(d));
      expect(q.solution.en).toContain(c + '=6×1=6');
      expect(q.solution.en).toContain('ALL inputs');
    }
  });
  it('reconstructs all actual factor pairs, swapped arrays, remaining cards and positive-multiple positions without truncating the quotient', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        data = Object.fromEntries(rows(s, 2).map((r) => [r[0]!, Number(r[2])])),
        { N: n, R: r, D: d, B: base, K: k } = data;
      const fs = factors(n!),
        pairs = Array.from({ length: n! }, (_, i) => i + 1)
          .filter((i) => i * i <= n! && n! % i === 0)
          .map((i) => [i, n! / i]);
      expect(positiveFactors(n!)).toEqual(fs);
      expect(factorPairs(n!).map((p) => [p.a, p.b])).toEqual(pairs);
      expect(q.solution.en).toContain('factors ' + fs.join(',') + ':');
      expect(n! % r!).toBe(0);
      expect(r! * (n! / r!)).toBe(n);
      expect((n! / r!) * r!).toBe(n);
      const trial = trialDivision(n!, d!);
      expect(d! * trial.quotient + trial.remainder).toBe(n);
      expect(trial.remainder).toBeGreaterThan(0);
      expect(trial.remainder).toBeLessThan(d!);
      expect(q.solution.en).toContain(
        n + '=' + d + '×' + trial.quotient + '+' + trial.remainder,
      );
      expect(q.solution.en).toContain(
        n + '÷' + d + '=' + trial.quotient + '+' + trial.remainder + '/' + d,
      );
      expect(n! / d!).toBeCloseTo(trial.quotient + trial.remainder / d!);
      expect(n! / d!).not.toBe(trial.quotient);
      const ms = Array.from({ length: 8 }, (_, i) => base! * (i + 1));
      expect(positiveMultiples(base!)).toEqual(ms);
      expect(q.solution.en).toContain(ms.join(','));
      expect(positiveMultiples(base!, k!).at(-1)).toBe(base! * k!);
      expect(q.solution.en).toContain(base + '×' + k + '=' + base! * k!);
      expect(positiveFactors(1)).toEqual([1]);
      expect(() => positiveFactors(0)).toThrow();
      expect(q.solution.en).toContain(
        'not a positive multiple or positive factor',
      );
      const limit = Math.floor(Math.sqrt(n!));
      expect((limit + 1) ** 2).toBeGreaterThan(n!);
      expect(q.solution.zh).toContain('1至' + limit);
      // Square de-duplication is retained in both earlier tasks, not claimed new here.
      for (const old of Object.values(numberTheoryRetrieval))
        expect(old.questions[1]!.solution.en).toMatch(
          /counting six once|six is one distinct factor/,
        );
    }
  });
  it('independently classifies every actual integer and verifies complete bounded prime checks versus a nontrivial composite witness', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        data = Object.fromEntries(
          rows(s, 3).map(([id, n]) => [id!, Number(n)]),
        ),
        prime = data.P!,
        composite = data.C!,
        bound = Math.floor(Math.sqrt(prime));
      for (const n of Object.values(data)) {
        const fs = factors(n),
          kind = n < 2 ? 'neither' : fs.length === 2 ? 'prime' : 'composite';
        expect(numberKind(n)).toBe(kind);
      }
      expect(factors(prime)).toEqual([1, prime]);
      expect((bound + 1) ** 2).toBeGreaterThan(prime);
      for (let d = 2; d <= bound; d++) {
        const division = trialDivision(prime, d);
        expect(division.remainder).not.toBe(0);
        expect(q.solution.en).toContain(
          prime + '=' + d + '×' + division.quotient + '+' + division.remainder,
        );
      }
      expect(q.stem.en).toContain('through ' + bound);
      expect(q.solution.en).toContain((bound + 1) ** 2 + '>' + prime);
      const root = Math.sqrt(composite);
      expect(Number.isInteger(root)).toBe(true);
      expect(root).toBeGreaterThan(1);
      expect(root).toBeLessThan(composite);
      expect(q.solution.en).toContain(composite + '=' + root + '×' + root);
      expect(trialDivision(composite, 2).remainder).toBe(1);
      expect(factors(composite)).toEqual([1, root, composite]);
      expect(trialDivision(prime, prime).remainder).toBe(0);
      expect(q.solution.en).toContain('only trivial factors');
      expect(q.solution.en).toContain('does not prove composite');
    }
  });
  it('proves greatest bag counts, first positive recurrence after an empty short window and one/equal/coprime boundaries from actual tables', () => {
    for (const s of sets) {
      const q = s.questions[4]!;
      for (const [id, aText, bText] of rows(s, 4)) {
        const a = Number(aText),
          b = Number(bText),
          cf = factors(a).filter((d) => b % d === 0),
          gcf = cf.at(-1)!;
        let lcm = Math.max(a, b);
        while (lcm % a !== 0 || lcm % b !== 0) lcm++;
        const m = commonNumbers(a, b);
        expect(m.commonFactors).toEqual(cf);
        expect(m.gcf).toBe(gcf);
        expect(m.lcm).toBe(lcm);
        if (id === 'G') {
          expect(q.solution.en).toContain('Common ' + cf.join(','));
          expect(q.solution.en).toContain(gcf + '×' + a / gcf + '=' + a);
          expect(q.solution.en).toContain(gcf + '×' + b / gcf + '=' + b);
          const candidate = Number(
            q.stem.en.match(/First test (\d+) bags/)![1],
          );
          expect(a % candidate).toBe(0);
          expect(b % candidate).toBe(0);
          expect(candidate).toBeLessThan(gcf);
        } else if (id === 'T') {
          expect(m.visibleCommon).toEqual([]);
          const left = Array.from({ length: lcm / a }, (_, i) => a * (i + 1)),
            right = Array.from({ length: lcm / b }, (_, i) => b * (i + 1));
          expect(left.filter((x) => right.includes(x))).toEqual([lcm]);
          expect(q.solution.en).toContain(
            'COMPLETE extended lists: ' +
              left.join(',') +
              ' and ' +
              right.join(','),
          );
          expect(q.solution.en).toContain(
            lcm + '=' + a + '×' + lcm / a + '=' + b + '×' + lcm / b,
          );
        } else
          expect(q.solution.en).toContain(
            id +
              '(' +
              a +
              ',' +
              b +
              '):' +
              (id === 'I' ? 'GCF' + gcf + '/LCM' + lcm : gcf + '/' + lcm),
          );
      }
      expect(() => commonNumbers(0, 8)).toThrow();
      expect(q.solution.en).toContain('positive integer inputs');
    }
  });
  it('preserves all thirteen original references and adds exact new tasks to five existing source tags', () => {
    const es = primaryRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P51-'),
    );
    expect(es).toHaveLength(5);
    expect(es.reduce((n, e) => n + e.targets.length, 0)).toBe(23);
    expect(new Set(es.flatMap((e) => e.targets)).size).toBe(20);
    expect(
      es
        .flatMap((e) => e.targets)
        .filter((id) => !id.includes('INTEGER-STRUCTURE')),
    ).toEqual([
      'P68-L04-G',
      'P68-L04-Q3',
      'P68-L05-Q3',
      'J71-L06-Q6',
      'P65-L03-Q6',
      'P65-L05-Q6',
      'J71-L06-Q6',
      'P53-MAINT-P51-Q2',
      'P63-MAINT-P51-Q2',
      'P53-MAINT-P51-Q1',
      'P63-MAINT-P51-Q1',
      'P53-MAINT-P51-Q2',
      'P63-MAINT-P51-Q2',
    ]);
    for (const [i, e] of es.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(q.skill).toBe(e.skill);
        expect(e.targets).toContain(q.id);
        expect(
          recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === q.id)!.href,
        ).toBe(maintenanceHref(s, q.id));
      }
  });
});
