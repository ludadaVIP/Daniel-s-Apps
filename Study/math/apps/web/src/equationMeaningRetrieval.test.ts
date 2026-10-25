import { describe, it, expect } from 'vitest';
import { equationMeaningRetrieval } from './content/equationMeaningRetrieval';
import { earlyAlgebraRecurrence } from './content/earlyAlgebraRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import { isEquationLab } from './EquationLabs';
import { isAdvancedEquationLab } from './AdvancedEquationLabs';
import {
  solveEarlyEquation,
  equationSides,
  changeBalance,
  balanceValues,
  patternPieces,
  type EarlyEquation,
  type BalanceState,
} from './equationModels';
type R = [number, number];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const normal = ([n, d]: R): R => {
  const g = gcd(n, d);
  return [n / g, d / g];
};
const r = (s: string): R => {
  if (s.includes('/')) return normal(s.split('/').map(Number) as R);
  const [a, b = ''] = s.split('.');
  return normal([Number(a) * 10 ** b.length + Number(b), 10 ** b.length]);
};
const plus = (a: R, b: R): R =>
    normal([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]),
  minus = (a: R, b: R): R => plus(a, [-b[0], b[1]]),
  times = (a: R, b: R): R => normal([a[0] * b[0], a[1] * b[1]]),
  divide = (a: R, b: R): R => normal([a[0] * b[1], a[1] * b[0]]);
const fmt = ([n, d]: R) => (d === 1 ? String(n) : `${n}/${d}`);
const big = ([n, d]: R) => [BigInt(n), BigInt(d)];
const sets = Object.values(equationMeaningRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((row) => row.map((c) => c.en));
const parse = (raw: string): EarlyEquation => {
  const [left, b] = raw.replaceAll('□', 'x').split('=');
  if (left === 'x+x') return { kind: 'multiply', a: '2', b: b! };
  let m = left!.match(/^x\+(.+)$/);
  if (m) return { kind: 'add', a: m[1]!, b: b! };
  m = left!.match(/^x−(.+)$/);
  if (m) return { kind: 'subtract', a: m[1]!, b: b! };
  m = left!.match(/^(.+)−x$/);
  if (m) return { kind: 'subtract-from', a: m[1]!, b: b! };
  m = left!.match(/^x÷(.+)$/);
  if (m) return { kind: 'divide', a: m[1]!, b: b! };
  m = left!.match(/^(\d+)×?x$/);
  if (m) return { kind: 'multiply', a: m[1]!, b: b! };
  throw new Error(raw);
};
const answer = (eq: EarlyEquation): R => {
  const a = r(eq.a),
    b = r(eq.b);
  return eq.kind === 'add'
    ? minus(b, a)
    : eq.kind === 'subtract'
      ? plus(b, a)
      : eq.kind === 'subtract-from'
        ? minus(a, b)
        : eq.kind === 'multiply'
          ? divide(b, a)
          : times(b, a);
};
const originalLeft = (eq: EarlyEquation, x: R) => {
  const a = r(eq.a);
  return eq.kind === 'add'
    ? plus(x, a)
    : eq.kind === 'subtract'
      ? minus(x, a)
      : eq.kind === 'subtract-from'
        ? minus(a, x)
        : eq.kind === 'multiply'
          ? times(a, x)
          : divide(x, a);
};
describe('P55 detailed equation meaning and construction', () => {
  it('registers ten bilingual human tasks with five precise bridges while keeping all older groups and formal identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P55'));
      expect(s.questions).toHaveLength(5);
      const older = maintenanceForUnit(s.unit).filter((g) => g.id !== s.id);
      expect(older.length).toBeGreaterThan(0);
      expect(maintenanceForUnit(s.unit)[0]!.id).not.toBe(s.id);
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
        expect(
          checkAnswer('correct same unknown because', q.answer),
        ).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P55-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((row) => row.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(10);
  });
  it('independently solves every original unknown position and checks repeated-symbol, separate-problem and zero meanings', () => {
    for (const s of sets) {
      const q = s.questions[0]!;
      for (const [id, , raw] of rows(s, 0)) {
        const eq = parse(raw!),
          value = answer(eq),
          solved = solveEarlyEquation(eq);
        expect(solved).toEqual({ status: 'one', value: big(value) });
        expect(originalLeft(eq, value)).toEqual(r(eq.b));
        expect(equationSides(eq, fmt(value)).equal).toBe(true);
        expect(q.solution.en).toContain(`${id}:box=${fmt(value)}`);
        if (id === 'E') expect(value).toEqual([0, 1]);
        if (id === 'F') {
          const total = Number(eq.b),
            match = q.solution.en.match(
              /In F, (\d+)\+(\d+) has the correct sum/,
            )!;
          expect(Number(match[1]) + Number(match[2])).toBe(total);
          expect(match[1]).not.toBe(match[2]);
          expect(Number(match[1])).not.toBe(value[0]);
        }
      }
      expect(q.solution.en).toContain(
        'Independent new problems may have different solutions',
      );
    }
  });
  it('rebuilds all fifteen reported side comparisons, four common actions and one-sided counterexamples from actual pan records', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        data = rows(s, 1),
        left = data[0]![1]!.match(/^(\d+)□\+(\d+)$/)!,
        right = data[0]![2]!.match(/^(\d+)□\+(\d+)$/)!;
      const state: BalanceState = {
        left: { boxes: Number(left[1]), known: Number(left[2]) },
        right: { boxes: Number(right[1]), known: Number(right[2]) },
      };
      const candidates = data[1]![1]!.split(',').map(Number),
        actions = ['add-unit', 'add-box', 'remove-box', 'remove-unit'] as const;
      const states = [
        state,
        ...actions.map((action) => changeBalance(state, action, 'both')),
      ];
      const reported = [
        ...q.solution.en.matchAll(/x=(\d+):L=(\d+),R=(\d+),L−R=(-?\d+)/g),
      ];
      expect(reported).toHaveLength(15);
      for (const [i, p] of states.entries())
        for (const [j, c] of candidates.entries()) {
          const expected = {
              left: p.left.boxes * c + p.left.known,
              right: p.right.boxes * c + p.right.known,
            },
            line = reported[i * 3 + j]!;
          expect(line.slice(1).map(Number)).toEqual([
            c,
            expected.left,
            expected.right,
            expected.left - expected.right,
          ]);
          expect(balanceValues(p, c)).toMatchObject(expected);
        }
      for (let c = 0; c <= 20; c++) {
        const baseline = balanceValues(state, c);
        for (const p of states) {
          const v = balanceValues(p, c);
          expect(v.left - v.right).toBe(baseline.left - baseline.right);
        }
      }
      const solution =
        (state.right.known - state.left.known) /
        (state.left.boxes - state.right.boxes);
      expect(balanceValues(state, solution).relation).toBe('equal');
      const dot = balanceValues(
        changeBalance(state, 'add-unit', 'left'),
        solution,
      );
      expect(dot.left - dot.right).toBe(1);
      const oneBox = changeBalance(state, 'add-box', 'left');
      expect(balanceValues(oneBox, 0)).toEqual(balanceValues(state, 0));
      expect(balanceValues(oneBox, solution).relation).not.toBe('equal');
      const removed = changeBalance(state, 'remove-box', 'both'),
        snapshot = JSON.stringify(removed);
      expect(() => changeBalance(removed, 'remove-box', 'both')).toThrow();
      expect(JSON.stringify(removed)).toBe(snapshot);
      const [a, b, c] = data[2]![1]!.split('=');
      const add = (v: string) =>
        v
          .split('+')
          .map(Number)
          .reduce((sum, n) => sum + n, 0);
      expect(add(a!)).toBe(15);
      expect(add(b!)).toBe(Number(c));
      expect(add(a!)).not.toBe(add(b!));
      expect(q.solution.en).toContain('not an equality chain');
      expect(q.solution.en).toContain('Division by zero is undefined');
    }
  });
  it('derives every square edge and counter coordinate independently, verifies near/far counts and distinguishes two complete prefix continuations', () => {
    const edge = (x1: number, y1: number, x2: number, y2: number) =>
      [[x1, y1].join(','), [x2, y2].join(',')].sort().join('|');
    for (const s of sets) {
      const q = s.questions[2]!;
      for (const [, , raw] of rows(s, 2)) {
        const n = Number(raw),
          expected = new Set<string>();
        for (let i = 0; i < n; i++) {
          expected.add(edge(i, 0, i + 1, 0));
          expected.add(edge(i, 1, i + 1, 1));
          expected.add(edge(i, 0, i, 1));
          expected.add(edge(i + 1, 0, i + 1, 1));
        }
        const square = patternPieces('squares', n);
        expect(
          new Set(square.segments.map((e) => edge(e.x1, e.y1, e.x2, e.y2))),
        ).toEqual(expected);
        expect(expected.size).toBe(3 * n + 1);
        expect(4 + 3 * (n - 1)).toBe(expected.size);
        const counters = patternPieces('counters', n),
          dots = new Set<string>();
        for (let row = 0; row < 2; row++)
          for (let col = 0; col < n; col++) dots.add(`${col},${row}`);
        dots.add(`${n},0`);
        expect(
          new Set(counters.counters.map((c) => `${c.column},${c.row}`)),
        ).toEqual(dots);
        expect(dots.size).toBe(2 * n + 1);
        expect(counters.counters.filter((c) => c.extra)).toHaveLength(1);
        expect(q.solution.en).toContain(
          `n=${n}:sticks=${expected.size},counters=${dots.size}`,
        );
      }
      expect(4 * 1).toBe(3 * 1 + 1);
      expect(4 * 2).not.toBe(3 * 2 + 1);
      expect(1 + 3).toBe(4);
      expect(2 + 3).not.toBe(7);
      expect(1 + 2).toBe(3);
      expect(2 + 2).not.toBe(5);
      const joined = (n: number) => 3 * n + 1,
        alternative = (n: number) => (n <= 3 ? 3 * n + 1 : 10 + 4 * (n - 3));
      for (let n = 1; n <= 3; n++) expect(alternative(n)).toBe(joined(n));
      expect(joined(4)).toBe(13);
      expect(alternative(4)).toBe(14);
      expect(q.solution.en).toContain('placing EVERY later square separately');
      expect(() => patternPieces('squares', 0)).toThrow();
      expect(q.solution.en).toContain('an empty diagram has zero sticks');
    }
  });
  it('checks exact inverses, approximate substitution, unique zero, all, none and undefined division as distinct cases', () => {
    for (const s of sets) {
      const q = s.questions[3]!;
      for (const [id, raw, candidate] of rows(s, 3)) {
        const eq = parse(raw!);
        if (id === 'G') {
          expect(() => solveEarlyEquation(eq)).toThrow(
            /divisor cannot be zero/,
          );
          expect(q.solution.en).toContain(
            'UNDEFINED, not a defined equation with no solutions',
          );
          continue;
        }
        if (id === 'E' || id === 'F') {
          expect(solveEarlyEquation(eq).status).toBe(
            id === 'E' ? 'all' : 'none',
          );
          for (const trial of ['0', '1/2', '2', '19/7'])
            expect(equationSides(eq, trial).equal).toBe(id === 'E');
          continue;
        }
        const value = answer(eq);
        expect(solveEarlyEquation(eq)).toEqual({
          status: 'one',
          value: big(value),
        });
        expect(originalLeft(eq, value)).toEqual(r(eq.b));
        expect(equationSides(eq, fmt(value)).equal).toBe(true);
        if (id === 'A') {
          expect(value).toEqual([1, Number(eq.a)]);
          const actual = originalLeft(eq, r(candidate!));
          expect(equationSides(eq, candidate!).left).toEqual(big(actual));
          expect(equationSides(eq, candidate!).equal).toBe(false);
          expect(q.solution.en).toContain(
            `Candidate ${candidate} gives ${fmt(actual)}≠1`,
          );
        }
        if (id === 'D') {
          const dec = s.unit === 'P57' ? '0.6' : '0.625';
          expect(r(dec)).toEqual(value);
          expect(q.solution.en).toContain(`x=${fmt(value)}=${dec}`);
        }
        if (id === 'H') expect(value).toEqual([0, 1]);
      }
    }
  });
  it('reconstructs original models, exact money and lengths, loose-extra errors and indivisible-card feasibility from the actual table', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        data = Object.fromEntries(rows(s, 4).map((row) => [row[0]!, row[2]!])),
        num = (key: string) => Number(data[key]);
      const original = num('A_T') - num('A_R');
      expect(q.solution.en).toContain(`x+${data.A_R}=${data.A_T}`);
      expect(q.solution.en).toContain(`x=${original} cards`);
      expect(original + num('A_R')).toBe(num('A_T'));
      const length = normal([num('B_T'), num('B_N')]);
      expect(q.solution.en).toContain(`x=${fmt(length)} m`);
      expect(
        equationSides(
          { kind: 'multiply', a: data.B_N!, b: data.B_T!, reversed: true },
          fmt(length),
        ).equal,
      ).toBe(true);
      expect(num('E_T')).toBe(num('B_T'));
      expect(num('E_N')).toBe(num('B_N'));
      expect(length[1]).not.toBe(1);
      for (const count of [
        Math.floor(num('E_T') / num('E_N')),
        Math.ceil(num('E_T') / num('E_N')),
      ])
        expect(count * num('E_N')).not.toBe(num('E_T'));
      const money = plus(r(data.C_S!), r(data.C_R!));
      expect(q.solution.en).toContain(
        `x=${fmt(money)}, checked by ${fmt(money)}−${data.C_S}=${data.C_R}`,
      );
      const correct = num('D_N') * num('D_C') + num('D_L'),
        wrong = num('D_N') * (num('D_C') + num('D_L'));
      expect(correct).toBe(num('D_T'));
      expect(wrong).not.toBe(correct);
      expect(wrong - correct).toBe((num('D_N') - 1) * num('D_L'));
      expect(q.solution.en).toContain(
        `an excess of ${(num('D_N') - 1) * num('D_L')}`,
      );
      expect(q.stem.en).toContain('two-step solving is NOT required');
      const blue = plus(r(data.F_R!), r(data.F_M!));
      expect(q.solution.en).toContain(`giving ${fmt(blue)} m`);
      expect(minus(blue, r(data.F_M!))).toEqual(r(data.F_R!));
      expect(q.solution.en).toContain(
        'no contextually allowed solution, without denying the algebraic root',
      );
      expect(q.solution.en).toContain(
        'accept other sound original relationships',
      );
    }
  });
  it('uses disjoint exact model families so H35 cannot intercept basic hooks and workshops again', () => {
    expect(
      lessons.filter((l) => isEquationLab(l.lab)).map((l) => l.id),
    ).toEqual([1, 2, 3, 4, 5].map((n) => `P55-L0${n}`));
    expect(
      lessons.filter((l) => isAdvancedEquationLab(l.lab)).map((l) => l.id),
    ).toEqual([1, 2, 3, 4, 5].map((n) => `H35-L0${n}`));
    expect(
      lessons.some((l) => isEquationLab(l.lab) && isAdvancedEquationLab(l.lab)),
    ).toBe(false);
  });
  it('retains thirteen original references while linking five existing tags to ten exact later tasks', () => {
    const es = earlyAlgebraRecurrence.filter((e) =>
        e.sourceLesson.startsWith('P55-'),
      ),
      original = [
        ['P65-L01-Q6', 'J73-L02-Q6'],
        ['P65-L04-Q6', 'J73-L02-Q6'],
        ['P65-L02-Q6', 'H07-L01-Q6', 'H07-L01-X'],
        ['P65-L04-Q6', 'P65-L05-Q6', 'J73-L01-Q6', 'J73-L02-Q6'],
        ['J73-L05-Q6', 'J83-L05-Q6'],
      ];
    expect(es).toHaveLength(5);
    expect(es.reduce((n, e) => n + e.targets.length, 0)).toBe(23);
    expect(new Set(es.flatMap((e) => e.targets)).size).toBe(20);
    for (const [i, e] of es.entries()) {
      expect(
        e.targets.filter((id) => !id.includes('EQUATION-MEANING')),
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
