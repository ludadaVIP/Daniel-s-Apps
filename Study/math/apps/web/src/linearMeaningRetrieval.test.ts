import { describe, it, expect } from 'vitest';
import { linearMeaningRetrieval } from './content/linearMeaningRetrieval';
import { coreAlgebraRecurrence } from './content/coreAlgebraRecurrence';
import { maintenanceSets } from './content/maintenance';
import {
  j73Lessons,
  j73CheckQuestions,
  j73ReviewQuestion,
} from './content/J73';
import { lessonById, lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  parseLinearEquation,
  candidateAudit,
  linearTransform,
  contextSolution,
  checkLinearEquation,
  type ContextRule,
} from './linearModels';
import { solveAlgebra, textR, sameSolutions } from './algebraModels';
const sets = Object.values(linearMeaningRetrieval);
const raw = (i: number, q: number, r = 0) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows[r]![2]!.en;
const source = (equation: string) => {
  const [left, right] = equation.split('=');
  return { left: left!, right: right! };
};
const root = (equation: string) => {
  const r = solveAlgebra(parseLinearEquation(equation)!);
  expect(r.kind).toBe('one');
  return r.kind === 'one' ? textR(r.value) : '';
};
const clean = (s: string) => s.replaceAll('−', '-');
describe('J73 full solutions, reversible rules and original contextual quantities', () => {
  it('preserves sixteen original references, reuses both constant-denominator tasks and shares modelling/domain cards', () => {
    const entries = coreAlgebraRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J73-'),
    );
    expect(entries.flatMap((e) => e.targets)).toHaveLength(26);
    expect(new Set(entries.flatMap((e) => e.targets)).size).toBe(17);
    expect(
      entries.flatMap((e) =>
        e.targets.filter((t) => !t.includes('LINEAR-MEANING')),
      ),
    ).toHaveLength(16);
    expect(entries[3]!.targets).toEqual([
      'J83-MAINT-CORE-ALGEBRA-Q8',
      'J84-MAINT-CORE-ALGEBRA-Q8',
    ]);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of entries.entries())
      for (const s of sets) {
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J73'));
        const n = [1, 2, 3, 0, 4, 4][i]!;
        if (n) expect(e.targets).toContain(s.questions[n - 1]!.id);
        else
          expect(e.targets.some((t) => t.includes('LINEAR-MEANING'))).toBe(
            false,
          );
      }
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J73-L01',
        'J73-L02',
        'J73-L03',
        'J73-L05',
      ]);
      for (const q of s.questions)
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
    }
    expect(lessons).toHaveLength(358);
  });
  it('independently solves raw originals, computes both exact and rounded sides and classifies zero/none/all', () => {
    for (const [i, x, both, approx, left, right] of [
      [0, '-1/3', '-1/3', '-0.33', '-8/25', '-33/100'],
      [1, '-2/3', '-7/3', '-0.67', '-47/20', '-117/50'],
    ] as const) {
      const eq = raw(i, 1);
      expect(root(eq)).toBe(x);
      expect(candidateAudit(source(eq), x)).toMatchObject({
        left: both,
        right: both,
        accepted: true,
      });
      expect(candidateAudit(source(eq), approx)).toMatchObject({
        left,
        right,
        equationPass: false,
      });
      expect(root(raw(i, 1, 1))).toBe('0');
      expect(solveAlgebra(parseLinearEquation(raw(i, 1, 2))!)).toEqual({
        kind: 'none',
      });
      expect(solveAlgebra(parseLinearEquation(raw(i, 1, 3))!)).toEqual({
        kind: 'all',
      });
      for (const v of ['0', '1/2', '-17/3'])
        expect(candidateAudit(source(raw(i, 1, 3)), v)?.accepted).toBe(true);
      expect(clean(sets[i]!.questions[0]!.solution.en)).toContain(x);
    }
  });
  it('separates defined operations, safe rules and coincidental solution preservation with explicit counterexamples', () => {
    for (const [i, x, both, factor, newRoot, scaled] of [
      [0, '3/2', '17/2', '2', '1', '-(7/2)x+1=-(3/2)x-2'],
      [1, '-1/7', '19/7', '3', '2/3', '(5/2)x-1=-x-3/2'],
    ] as const) {
      const original = parseLinearEquation(raw(i, 2))!;
      expect(root(raw(i, 2))).toBe(x);
      expect(candidateAudit(source(raw(i, 2)), x)).toMatchObject({
        left: both,
        right: both,
        accepted: true,
      });
      const half = linearTransform(original, '×', '-1/2', 'both');
      expect(half).toMatchObject({ safeRule: true, preserves: true });
      expect(sameSolutions(half.next!, parseLinearEquation(scaled)!)).toBe(
        true,
      );
      expect(linearTransform(half.next!, '×', '-2', 'both').next).toEqual(
        original,
      );
      const erased = linearTransform(original, '×', '0', 'both');
      expect(erased).toMatchObject({
        safeRule: false,
        preserves: false,
        reason: 'zero-factor',
      });
      expect(solveAlgebra(erased.next!)).toEqual({ kind: 'all' });
      expect(candidateAudit(source(raw(i, 2)), '0')?.equationPass).toBe(false);
      expect(linearTransform(original, '÷', '0', 'both')).toMatchObject({
        next: null,
        reason: 'zero-divisor',
      });
      expect(
        linearTransform(parseLinearEquation('2x=0')!, '×', factor, 'left'),
      ).toMatchObject({ safeRule: false, preserves: true });
      const unsafe = linearTransform(
        parseLinearEquation('2x=4')!,
        '×',
        factor,
        'left',
      );
      expect(unsafe).toMatchObject({ safeRule: false, preserves: false });
      const r = solveAlgebra(unsafe.next!);
      expect(r.kind === 'one' && textR(r.value)).toBe(newRoot);
      expect(root('2x=4')).toBe('2');
      expect(
        linearTransform(parseLinearEquation('x=0')!, '÷', 'x', 'both'),
      ).toMatchObject({ next: null, reason: 'variable-factor' });
    }
  });
  it('checks every signed fractional bracket term and rejects a correctly solved wrong intermediate in the original', () => {
    for (const [i, x, both, bad, bl, br] of [
      [0, '2/3', '5/3', '-7/3', '23/3', '-4/3'],
      [1, '-3/4', '-5/2', '7/4', '-15/2', '5/2'],
    ] as const) {
      expect(root(raw(i, 3))).toBe(x);
      expect(candidateAudit(source(raw(i, 3)), x)).toMatchObject({
        left: both,
        right: both,
        accepted: true,
      });
      expect(root(raw(i, 3, 1))).toBe(bad);
      expect(candidateAudit(source(raw(i, 3)), bad)).toMatchObject({
        left: bl,
        right: br,
        equationPass: false,
      });
      expect(clean(sets[i]!.questions[2]!.solution.en)).toContain(bad);
    }
  });
  it('builds age, future-age and pack models from original givens, retaining exact roots and rounding counterexamples', () => {
    for (const [
      i,
      gap,
      total,
      young,
      old,
      rounded,
      bags,
      count,
      badCount,
      futureGap,
      years,
      futureYoung,
    ] of [
      [0, 7, 30, '23/2', '37/2', '12', 4, '15/4', '4', 8, 3, '5'],
      [1, 5, 26, '21/2', '31/2', '11', 6, '5/2', '3', 11, 4, '7'],
    ] as const) {
      const ageNums = raw(i, 4).match(/\d+/g)!.map(Number);
      expect(ageNums).toEqual([gap, total]);
      const age = { left: `x+(x+${gap})`, right: String(total) };
      expect(root(`${age.left}=${age.right}`)).toBe(young);
      expect(candidateAudit(age, young, 'nonnegative')?.accepted).toBe(true);
      expect(candidateAudit(age, rounded, 'nonnegative')?.equationPass).toBe(
        false,
      );
      expect(
        checkLinearEquation(
          `${total}=x+x+${gap}`,
          `${age.left}=${age.right}`,
          true,
        ),
      ).toBe(true);
      expect(
        checkLinearEquation(`x=${young}`, `${age.left}=${age.right}`, true),
      ).toBe(false);
      expect(raw(i, 4, 1).match(/\d+/g)!.map(Number)).toEqual([
        futureGap,
        years,
      ]);
      expect(root(`x+${futureGap}+${years}=2(x+${years})`)).toBe(futureYoung);
      expect(raw(i, 4, 2).match(/\d+/g)!.map(Number)).toEqual([bags, 17]);
      const pack = { left: `${bags}x+2`, right: '17' };
      expect(root(`${pack.left}=17`)).toBe(count);
      expect(candidateAudit(pack, count, 'integer')).toMatchObject({
        equationPass: true,
        contextPass: false,
        accepted: false,
      });
      expect(contextSolution(pack, 'integer')).toEqual({ kind: 'none' });
      expect(candidateAudit(pack, badCount, 'integer')?.equationPass).toBe(
        false,
      );
      for (const val of [young, old, count])
        expect(clean(sets[i]!.questions[3]!.solution.en)).toContain(val);
    }
    expect(
      candidateAudit({ left: 'x+(x+2)', right: '5' }, '3/2', 'nonnegative')
        ?.accepted,
    ).toBe(true);
    expect(
      candidateAudit({ left: '2x+2', right: '5' }, '3/2', 'integer'),
    ).toMatchObject({ equationPass: true, contextPass: false });
    expect(
      candidateAudit({ left: '2x+2', right: '5' }, '2', 'integer')
        ?.equationPass,
    ).toBe(false);
  });
  it('uses context-specific gates for positive fractional lengths, negative temperatures, zero counts and impossible prices', () => {
    for (const [i, items] of [
      [
        0,
        [
          ['3x=2', '2/3', 'positive', true],
          ['x+7=3', '-4', 'rational', true],
          ['4x=0', '0', 'integer', true],
          ['2x+7=5', '-1', 'nonnegative', false],
        ],
      ],
      [
        1,
        [
          ['6x=1', '1/6', 'positive', true],
          ['x+9=2', '-7', 'rational', true],
          ['5x=0', '0', 'integer', true],
          ['3x+4=1', '-1', 'nonnegative', false],
        ],
      ],
    ] as const) {
      expect(sets[i]!.questions[3]!.contextTable!.rows).toHaveLength(7);
      for (const [eq, x, rule, allowed] of items) {
        expect(root(eq)).toBe(x);
        expect(
          candidateAudit(source(eq), x, rule as ContextRule),
        ).toMatchObject({
          equationPass: true,
          contextPass: allowed,
          accepted: allowed,
        });
      }
      expect(
        candidateAudit(
          source(items[0]![0]),
          i === 0 ? '0.67' : '0.17',
          'positive',
        )?.equationPass,
      ).toBe(false);
      expect(
        candidateAudit(source(items[0]![0]), '0', 'positive')?.contextPass,
      ).toBe(false);
    }
  });
  it('limits the original-model-only hint to original-quantity answer tasks, including generated review rounds', () => {
    const tasks = [
      j73Lessons[4]!.guided,
      ...j73Lessons[4]!.questions,
      j73Lessons[4]!.exit,
      ...j73CheckQuestions.filter(
        (q) => q.skill === 'original-quantity-modelling',
      ),
      ...Array.from({ length: 80 }, (_, r) => j73ReviewQuestion('J73-L05', r)),
    ];
    const kinds = new Set<string>();
    for (const q of tasks) {
      kinds.add(q.answer.kind);
      const model = q.answer.kind === 'linear-equation';
      for (const lang of ['zh', 'en'] as const) {
        const text = [...q.hints, ...(q.solutionSteps ?? [])]
          .map((h) => h[lang])
          .join(' ');
        if (model)
          expect(text).toContain(
            lang === 'zh' ? '先不移项' : 'do not transpose yet',
          );
        else
          expect(text).not.toContain(
            lang === 'zh' ? '先不移项' : 'do not transpose yet',
          );
      }
      for (const a of q.answerChecks?.accepted ?? [])
        expect(checkAnswer(a, q.answer), q.id).toBe(true);
    }
    expect(kinds).toEqual(
      new Set(['number', 'choice', 'linear-equation', 'explain']),
    );
  });
  it('supplies all original draining, charging and whole-pack conditions at the repaired exact target', () => {
    const q = lessonById('J85-L06')!.questions[5]!;
    expect(
      coreAlgebraRecurrence.find((e) => e.sourceLesson === 'J73-L06')!.targets,
    ).toContain(q.id);
    const rows = q.contextTable!.rows;
    expect(rows).toHaveLength(3);
    expect(rows[0]![1]!.en).toContain('NZ$2 per km plus one fixed NZ$5');
    expect(rows[0]![1]!.en).toContain('0–8 km');
    expect(rows[1]![1]!.en).toContain('12 L, removing 2 L per minute');
    expect(rows[1]![1]!.en).not.toContain('six minutes');
    expect(root('12-2x=0')).toBe('6');
    expect(candidateAudit({ left: '12-2x', right: '0' }, '7')?.left).toBe('-2');
    expect(rows[2]![1]!.en).toContain('Three cards per whole pack plus two');
    expect(rows[2]![1]!.en).toContain('0–4 whole packs');
    expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
  });
});
