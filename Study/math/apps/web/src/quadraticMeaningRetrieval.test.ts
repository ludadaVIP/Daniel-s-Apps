import { describe, it, expect } from 'vitest';
import { quadraticMeaningRetrieval } from './content/quadraticMeaningRetrieval';
import { rootQuadraticRetrieval } from './content/rootQuadraticRetrieval';
import { rootQuadraticRecurrence } from './content/rootQuadraticRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import {
  solveQuadratic,
  completingSquare,
  quadraticCandidateAudit,
  checkRadicalSet,
  zeroPolynomialText,
  evaluatePolynomialRadical,
  sameQuadraticSolutions,
  feasibleQuadraticRoots,
} from './quadraticModels';
import { readRadical, radicalText, sameRadical } from './radicalModels';
import { checkFactorisation } from './factorModels';
import { equalPolynomial } from './polynomialModels';
import { textR } from './algebraModels';
const sets = Object.values(quadraticMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
describe('J92 original equations,branches and domain supplements', () => {
  it('keeps old arguments and bridges,reuses actual intersection plots and adds only six independently keyed cards', () => {
    const entries = rootQuadraticRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J92-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(28);
    expect(new Set(refs).size).toBe(14);
    expect(refs.filter((id) => id.includes('-ROOT-QUAD-'))).toHaveLength(14);
    expect(
      refs.filter((id) => id.includes('-QUADRATIC-MEANING-')),
    ).toHaveLength(14);
    for (const s of Object.values(rootQuadraticRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(
        [3, 4, 5, 8].map((i) => s.bridgeByQuestion[s.questions[i]!.id]),
      ).toEqual(['J92-L02', 'J92-L04', 'J92-L06', 'J93-L04']);
    }
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J92'));
        const target = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === id)!;
        expect(
          new URL(target.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('keeps six complete bilingual original-condition tables and explicit human review', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J92-L02',
        'J92-L03',
        'J92-L06',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('factor complete domain all roots done', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('recomputes collected linear/cubic cases and rejects zero-product candidates in the actual nonzero original', () => {
    for (const i of [0, 1]) {
      const l = solveQuadratic(row(i, 1, 'L')),
        h = solveQuadratic(row(i, 1, 'H'));
      expect(l.kind).toBe('linear');
      expect(textR(l.b)).toBe(i === 0 ? '2' : '-3');
      expect(
        checkRadicalSet(i === 0 ? '3' : '-2', l.roots!.map(radicalText)),
      ).toBe(true);
      const a = quadraticCandidateAudit(row(i, 1, 'L'), i === 0 ? '3' : '-2')!;
      expect([a.left, a.right, a.equationPass]).toEqual(
        i === 0 ? ['15', '15', true] : ['10', '10', true],
      );
      expect(h.kind).toBe('higher');
      expect(h.degree).toBe(3);
      for (const bad of ['0', i === 0 ? '2' : '-2']) {
        const audit = quadraticCandidateAudit(row(i, 1, 'A'), bad)!;
        expect([audit.left, audit.right, audit.equationPass]).toEqual([
          '0',
          '3',
          false,
        ]);
      }
      expect(
        checkRadicalSet(
          i === 0 ? '-1,3' : '-3,1',
          solveQuadratic(row(i, 1, 'A')).roots!.map(radicalText),
        ),
      ).toBe(true);
    }
  });
  it('checks nonmonic factors,fractional roots with square discriminant,repeated constants and integer-factor scope', () => {
    for (const i of [0, 1]) {
      const source = row(i, 1, 'B'),
        b = solveQuadratic(source),
        expected = i === 0 ? ['-2/3', '1/2'] : ['-1/2', '2/3'];
      expect(textR(b.discriminant!)).toBe('49');
      expect(b.roots).toHaveLength(2);
      expect(
        checkFactorisation(
          zeroPolynomialText(source),
          i === 0 ? '(3x+2)(2x-1)' : '(3x-2)(2x+1)',
          ['x'],
        ),
      ).toBe(false);
      expect(
        equalPolynomial(
          i === 0 ? '(3x+2)(2x-1)' : '(3x-2)(2x+1)',
          zeroPolynomialText(source),
          ['x'],
        ),
      ).toBe(true);
      for (const root of expected)
        expect(quadraticCandidateAudit(source, root)!.equationPass).toBe(true);
      expect(feasibleQuadraticRoots(source, 'whole')).toEqual([]);
      const c = solveQuadratic(row(i, 1, 'C'));
      expect(c.repeated).toBe(true);
      expect(c.roots).toHaveLength(1);
      expect(
        quadraticCandidateAudit(row(i, 1, 'C'), i === 0 ? '2' : '-3')!
          .equationPass,
      ).toBe(true);
      const p = i === 0 ? 2 : 3,
        pairs = [
          [1, -p],
          [-1, p],
        ] as const;
      expect(pairs.every(([a, b]) => a * b === -p && a + b !== 0)).toBe(true);
      const d = solveQuadratic(row(i, 1, 'D'));
      expect(d.roots).toHaveLength(2);
      for (const r of [`sqrt(${p})`, `-sqrt(${p})`])
        expect(quadraticCandidateAudit(row(i, 1, 'D'), r)!.equationPass).toBe(
          true,
        );
    }
  });
  it('recomputes normalisation,fractional completing terms and exact residuals of wrongly grouped candidates', () => {
    for (const i of [0, 1]) {
      const g = row(i, 2, 'G'),
        m = completingSquare(g);
      expect([m.p, m.added, m.completed].map(textR)).toEqual(
        i === 0 ? ['3/4', '9/16', '17/16'] : ['-1/3', '1/9', '7/9'],
      );
      expect(textR(m.discriminant!)).toBe(i === 0 ? '17' : '28');
      const expected =
        i === 0
          ? ['(-3-sqrt(17))/4', '(-3+sqrt(17))/4']
          : ['(1-sqrt(7))/3', '(1+sqrt(7))/3'];
      for (const r of expected)
        expect(quadraticCandidateAudit(g, r)!.equationPass).toBe(true);
      const wrong = i === 0 ? '-3+sqrt(17)/4' : '1+sqrt(7)/3',
        delta = evaluatePolynomialRadical(
          solveQuadratic(g).p,
          readRadical(wrong)!,
        );
      // Independent expansion: 2(-3+s/4)^2+3(-3+s/4)-1=81/8-9s/4; far analogue=4/3+4s/3.
      expect(
        sameRadical(
          delta,
          readRadical(i === 0 ? '81/8-9sqrt(17)/4' : '4/3+4sqrt(7)/3')!,
        ),
      ).toBe(true);
      expect(delta.size).toBe(2);
      expect(quadraticCandidateAudit(g, wrong)!.equationPass).toBe(false);
      expect(row(i, 2, 'W')).toBe(i === 0 ? '−3±√17/4' : '1±√7/3');
    }
  });
  it('preserves both negative-multiple branches and distinguishes zero/negative square targets with fractional picture areas', () => {
    for (const i of [0, 1]) {
      expect(sameQuadraticSolutions(row(i, 2, 'G'), row(i, 2, 'F'))).toBe(true);
      expect(textR(solveQuadratic(row(i, 2, 'F')).discriminant!)).toBe(
        i === 0 ? '68' : '112',
      );
      const z = completingSquare(row(i, 2, 'Z')),
        m = completingSquare(row(i, 2, 'M'));
      expect([z.p, z.added, z.completed].map(textR)).toEqual(
        i === 0 ? ['1/2', '1/4', '0'] : ['3/2', '9/4', '0'],
      );
      expect(z.roots).toHaveLength(1);
      expect(m.roots).toHaveLength(0);
      expect(textR(m.completed)).toBe(i === 0 ? '-3/4' : '-1');
      const p = i === 0 ? 0.5 : 1.5,
        area = 4 + 2 * (2 * p) + p * p;
      expect(area).toBe((2 + p) ** 2);
      expect(area).toBe(i === 0 ? 25 / 4 : 49 / 4);
      expect(row(i, 2, 'P')).toContain('does not restrict original Z');
    }
  });
  it('audits rectangle equation/domain separately and both included time endpoints against the actual equations', () => {
    for (const i of [0, 1]) {
      const r = i === 0 ? 'x(x+2)=15' : 'x(x+1)=12';
      expect(row(i, 3, 'R')).toContain(i === 0 ? '15cm²' : '12cm²');
      const positive = quadraticCandidateAudit(r, '3', 'positive')!,
        negative = quadraticCandidateAudit(
          r,
          i === 0 ? '-5' : '-4',
          'positive',
        )!;
      expect([
        positive.accepted,
        negative.equationPass,
        negative.contextPass,
      ]).toEqual([true, true, false]);
      expect([negative.left, negative.right]).toEqual(
        i === 0 ? ['15', '15'] : ['12', '12'],
      );
      const t = row(i, 3, 'T').split(';')[0]!,
        u = row(i, 3, 'U').split(';')[0]!;
      expect(feasibleQuadraticRoots(t, 'first-two')).toEqual(['0']);
      expect(feasibleQuadraticRoots(u, 'first-two').sort()).toEqual(
        i === 0 ? ['1', '2'] : ['1/2', '2'],
      );
      expect(quadraticCandidateAudit(t, '2', 'first-two')!.equationPass).toBe(
        false,
      );
      expect(quadraticCandidateAudit(u, '0', 'first-two')!.equationPass).toBe(
        false,
      );
      expect(quadraticCandidateAudit(u, '2', 'first-two')!.accepted).toBe(true);
      expect([
        textR(solveQuadratic(t).discriminant!),
        textR(solveQuadratic(u).discriminant!),
      ]).toEqual(i === 0 ? ['9', '1'] : ['16', '9/4']);
    }
  });
  it('checks independent own rectangle/card examples without converting fictional designs into observations', () => {
    for (const [source, root, negative] of [
      ['x(x+1)=6', '2', '-3'],
      ['x(x+3)=4', '1', '-4'],
    ]) {
      expect(
        quadraticCandidateAudit(source!, root!, 'positive')!.accepted,
      ).toBe(true);
      const rejected = quadraticCandidateAudit(source!, negative!, 'positive')!;
      expect(rejected.equationPass).toBe(true);
      expect(rejected.contextPass).toBe(false);
      expect(completingSquare(source!).roots).toHaveLength(2);
    }
    for (const [source, ratio] of [
      ['2x²=3', 1.5],
      ['3x²=6', 2],
    ] as const) {
      expect(solveQuadratic(source).roots).toHaveLength(2);
      expect(feasibleQuadraticRoots(source, 'whole')).toEqual([]);
      expect(1 < ratio && ratio < 4).toBe(true);
    }
  });
});
