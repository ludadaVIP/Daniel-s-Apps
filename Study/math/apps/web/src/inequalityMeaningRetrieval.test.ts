import { describe, expect, it } from 'vitest';
import { inequalityMeaningRetrieval } from './content/inequalityMeaningRetrieval';
import { inequalityFunctionRecurrence } from './content/inequalityFunctionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import { readRational as R } from './rationalModels';
import { addR, mulR, divR, negR, textR } from './algebraModels';
import {
  inequalityAt,
  solveInequality,
  parseRealSet,
  sameInterval,
  auditInequality,
  transformInequality,
  intervalContains,
  relationHolds,
  inequalityTrace,
} from './inequalityModels';

const sets = Object.values(inequalityMeaningRetrieval);
const value = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const eqSet = (source: string, target: string) =>
  expect(sameInterval(parseRealSet(source)!, parseRealSet(target)!)).toBe(true);

describe('J84 common operations, constant truth and independently designed constraints', () => {
  it('preserves ten existing tasks, shares six new tasks across five lessons and retains manual grading', () => {
    const entries = inequalityFunctionRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J84-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(20);
    expect(new Set(refs).size).toBe(16);
    expect(refs.filter((id) => id.includes('-MAINT-ORDER-RULE-'))).toHaveLength(
      10,
    );
    expect(entries.map((e) => e.targets[2]!.slice(-1))).toEqual([
      '3',
      '1',
      '1',
      '2',
      '3',
    ]);
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J84-L03',
        'J84-L04',
        'J84-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('distinguishes reversible both-side addition, a one-sided counterexample and zero-addition coincidence', () => {
    for (const [i, amount, set, trial] of [
      [0, '-3', 'x<=-2', 'x<=1'],
      [1, '4', 'x>2', 'x>-2'],
    ] as const) {
      const original = inequalityAt(value(i, 1, 'S'));
      const valid = transformInequality(original, '+', amount, 'both', false);
      expect(valid.safeRule && valid.preserves).toBe(true);
      expect(
        sameInterval(solveInequality(valid.next!), parseRealSet(set)!),
      ).toBe(true);
      const wrong = transformInequality(original, '+', amount, 'left', false);
      expect(wrong.safeRule || wrong.preserves).toBe(false);
      expect(
        sameInterval(solveInequality(wrong.next!), parseRealSet(trial)!),
      ).toBe(true);
      expect(auditInequality(original, '0')!.pass).toBe(false);
      expect(auditInequality(wrong.next!, '0')!.pass).toBe(true);
      const coincidence = transformInequality(
        original,
        '+',
        '0',
        'left',
        false,
      );
      expect(coincidence.preserves).toBe(true);
      expect(coincidence.safeRule).toBe(false);
      const restored = transformInequality(
        valid.next!,
        '+',
        textR(negR(R(amount))),
        'both',
        false,
      );
      expect(
        sameInterval(
          solveInequality(original),
          solveInequality(restored.next!),
        ),
      ).toBe(true);
    }
  });
  it('retains a/b identities for negative translation and fractional negative division, including equal originals', () => {
    for (const c of [
      {
        i: 0,
        a: '-3/2',
        b: '2',
        h: '-4',
        k: '-2',
        equal: '-1',
        shift: ['-11/2', '-2'],
        quot: ['3/4', '-1'],
        equalQuot: '1/2',
      },
      {
        i: 1,
        a: '-2',
        b: '5/2',
        h: '-3',
        k: '-3/2',
        equal: '-2',
        shift: ['-5', '-1/2'],
        quot: ['4/3', '-5/3'],
        equalQuot: '4/3',
      },
    ]) {
      const [a, b, h, k] = [c.a, c.b, c.h, c.k].map(R) as [
        ReturnType<typeof R>,
        ReturnType<typeof R>,
        ReturnType<typeof R>,
        ReturnType<typeof R>,
      ];
      expect(value(c.i, 1, 'A').replaceAll('−', '-')).toBe(
        `a=${c.a}; b=${c.b}; h=${c.h}; k=${c.k}`,
      );
      expect([addR(a, h), addR(b, h)].map(textR)).toEqual(c.shift);
      expect(relationHolds(addR(a, h), '<', addR(b, h))).toBe(true);
      expect([divR(a, k), divR(b, k)].map(textR)).toEqual(c.quot);
      expect(relationHolds(divR(a, k), '>', divR(b, k))).toBe(true);
      const diff = divR(addR(b, negR(a)), k);
      expect(relationHolds(diff, '<', R('0'))).toBe(true);
      expect(textR(divR(R(c.equal), k))).toBe(c.equalQuot);
      expect(relationHolds(divR(R(c.equal), k), '=', divR(R(c.equal), k))).toBe(
        true,
      );
    }
  });
  it('translates an at-most temperature constraint without adding a nonnegative amount domain', () => {
    for (const [i, offset, edge, reading] of [
      [0, '-3/2', '1', '-7/2'],
      [1, '-5/2', '2', '-9/2'],
    ] as const) {
      expect(value(i, 1, 'T')).toContain(`x+(${offset.replaceAll('-', '−')})`);
      const original = inequalityAt(`x+(${offset})<=-1/2`);
      eqSet(`x+(${offset})<=-1/2`, `x<=${edge}`);
      expect(auditInequality(original, edge)!.left).toBe('-1/2');
      expect(auditInequality(original, '-2')).toMatchObject({
        left: reading,
        pass: true,
      });
      expect(auditInequality(original, String(Number(edge) + 1))!.pass).toBe(
        false,
      );
      expect(intervalContains(solveInequality(original), R('-100'))).toBe(true);
    }
  });
  it('checks complete negative distribution, exact thirds and concrete original failures at rounded boundaries', () => {
    for (const c of [
      {
        i: 0,
        set: 'x>=5/3',
        edge: '5/3',
        decimal: '1.66',
        left: '92/25',
        right: '183/50',
        diff: '1/50',
        member: '2',
        atEdge: '11/3',
      },
      {
        i: 1,
        set: 'x<=-5/3',
        edge: '-5/3',
        decimal: '-1.66',
        left: '108/25',
        right: '217/50',
        diff: '-1/50',
        member: '-2',
        atEdge: '13/3',
      },
    ]) {
      const source = value(c.i, 2, 'E'),
        original = inequalityAt(source);
      eqSet(source, c.set);
      const steps = inequalityTrace(original);
      for (const step of steps) eqSet(step.text, c.set);
      expect(auditInequality(original, c.edge)).toMatchObject({
        left: c.atEdge,
        right: c.atEdge,
        pass: true,
      });
      expect(auditInequality(original, c.member)!.pass).toBe(true);
      expect(auditInequality(original, '0')!.pass).toBe(false);
      const rounded = auditInequality(original, value(c.i, 2, 'C'))!;
      expect(rounded).toMatchObject({
        left: c.left,
        right: c.right,
        pass: false,
      });
      expect(textR(addR(R(rounded.left), negR(R(rounded.right))))).toBe(c.diff);
      expect(
        intervalContains(
          parseRealSet(c.set.replace(c.edge, c.decimal))!,
          R(c.decimal),
        ),
      ).toBe(true);
      expect(intervalContains(parseRealSet(c.set)!, R(c.decimal))).toBe(false);
    }
  });
  it('classifies four cancelled-variable inequalities generally, preserving strictness rather than dividing zero', () => {
    for (const i of [0, 1])
      for (const [key, truth] of [
        ['F', true],
        ['N', false],
        ['Zs', false],
        ['Zi', true],
      ] as const) {
        const original = inequalityAt(value(i, 2, key));
        eqSet(value(i, 2, key), truth ? 'all reals' : 'no solution');
        const trace = inequalityTrace(original);
        expect(trace.at(-1)!.reason).toBe('constant');
        for (const x of ['0', '-3/2', '7/3', '1000'])
          expect(auditInequality(original, x)!.pass).toBe(truth);
        expect(
          transformInequality(original, '÷', '0', 'both', false).next,
        ).toBeNull();
      }
    expect(relationHolds(R('0'), '<', R('0'))).toBe(false);
    expect(relationHolds(R('0'), '<=', R('0'))).toBe(true);
  });
  it('uses one candidate in both conditions, separates AND/OR and proves the off-window interval is nonempty', () => {
    for (const [i, lo, hi, mid] of [
      [0, 7, 9, 8],
      [1, 8, 11, 9],
    ] as const) {
      expect(value(i, 3, 'A')).toContain(
        `at least ${lo} AND strictly below ${hi}`,
      );
      const originals = [inequalityAt(`x>=${lo}`), inequalityAt(`x<${hi}`)];
      const passes = (x: number) =>
        originals.map((e) => auditInequality(e, String(x))!.pass);
      expect(passes(lo)).toEqual([true, true]);
      expect(passes(hi)).toEqual([true, false]);
      expect(passes(mid)).toEqual([true, true]);
      expect(passes(lo - 1)).toEqual([false, true]);
      expect(passes(hi + 1)).toEqual([true, false]);
      const intersection = parseRealSet(`x>=${lo};x<${hi}`)!;
      for (let x = -5; x <= 5; x++)
        expect(intervalContains(intersection, R(String(x)))).toBe(false);
      expect(intervalContains(intersection, R(String(mid)))).toBe(true);
      // The two ranges overlap: every x either lies below hi, or is at least hi>lo.
      for (const x of [-100, lo - 1, lo, mid, hi, 100])
        expect(passes(x).some(Boolean)).toBe(true);
      expect(value(i, 3, 'W')).toBe('[−5,5] → [−12,12]');
    }
  });
  it('selects the stronger same-direction bound and strict equal bound with exact weaker-only witnesses', () => {
    for (const [i, strong, strict, witness, r] of [
      [0, 'x>=-3/2', 'x>-3/2', '-2', '-3/2'],
      [1, 'x<=-5/4', 'x<-5/4', '-1', '-5/4'],
    ] as const) {
      eqSet(value(i, 3, 'B'), strong);
      eqSet(value(i, 3, 'C'), strict);
      const rows = value(i, 3, 'B').split(';').map(inequalityAt);
      expect(rows.map((e) => auditInequality(e, witness)!.pass)).toEqual([
        true,
        false,
      ]);
      expect(intervalContains(parseRealSet(strong)!, R(r))).toBe(true);
      expect(intervalContains(parseRealSet(strict)!, R(r))).toBe(false);
    }
  });
  it('independently audits every permitted design, both quantity domains and two constructed touching cases', () => {
    for (const [i, p, f, uppers] of [
      [0, 2, 1, ['7/2', '9/2']],
      [1, 3, 2, ['10/3', '13/3']],
    ] as const) {
      for (const L of [1, 2])
        for (const u of uppers) {
          const U = R(u),
            budget = addR(mulR(R(String(p)), U), R(String(f)));
          const original = `x>=${L};${p}x+${f}<=${textR(budget)}`;
          eqSet(original, `${L}<=x<=${u}`);
          const set = parseRealSet(original)!;
          expect(intervalContains(set, U)).toBe(true);
          expect(intervalContains(set, R(String(L)))).toBe(true);
          expect(intervalContains(set, R('0'))).toBe(false);
          const maximum = Number(U[0] / U[1]);
          const allowed = Array.from({ length: 8 }, (_, n) => n).filter((n) =>
            intervalContains(set, R(String(n))),
          );
          expect(allowed).toEqual(
            Array.from({ length: maximum - L + 1 }, (_, n) => n + L),
          );
          expect(
            relationHolds(R(String(p * (maximum + 1) + f)), '>', budget),
          ).toBe(true);
          eqSet(`x>=${L};${p}x+${f}<=${p * L + f}`, `x=${L}`);
          eqSet(`x>${L};${p}x+${f}<=${p * L + f}`, 'no solution');
        }
      expect(value(i, 3, 'D')).toContain(`p=${p}; f=${f}`);
    }
  });
});
