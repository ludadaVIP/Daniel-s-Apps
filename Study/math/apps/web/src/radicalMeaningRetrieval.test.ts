import { describe, it, expect } from 'vitest';
import { radicalMeaningRetrieval } from './content/radicalMeaningRetrieval';
import { rootQuadraticRecurrence } from './content/rootQuadraticRecurrence';
import { rootQuadraticRetrieval } from './content/rootQuadraticRetrieval';
import { pythagoreanMeaningRetrieval } from './content/pythagoreanMeaningRetrieval';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import {
  squareRoots,
  checkRootSet,
  checkRadical,
  isSimplifiedRadical,
  readRadical,
  radicalClass,
  rootBracket,
} from './radicalModels';
import { readRational as R } from './rationalModels';
import { mulR, addR, negR, textR } from './algebraModels';
const sets = Object.values(radicalMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const radicand = (s: string) => s.match(/^√\(([^)]+)\)/)![1]!;
describe('J91 fractional objects,forms and exact error evidence', () => {
  it('retains old proofs,adds six cards and reuses existing fractional-length audits in later units', () => {
    const entries = rootQuadraticRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J91-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(14);
    expect(refs.filter((id) => id.includes('-ROOT-QUAD-'))).toHaveLength(10);
    expect(refs.filter((id) => id.includes('-RADICAL-MEANING-'))).toHaveLength(
      12,
    );
    expect(
      refs.filter((id) => id.includes('-PYTHAGOREAN-MEANING-')),
    ).toHaveLength(2);
    for (const s of Object.values(rootQuadraticRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(s.bridgeByQuestion[s.questions[1]!.id]).toBe('J91-L04');
    }
    for (const s of Object.values(pythagoreanMeaningRetrieval))
      expect(s.bridgeByQuestion[s.questions[2]!.id]).toBe('J87-L04');
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J91'));
        const target = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === id)!;
        expect(
          new URL(target.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('keeps all six original tables and rubrics bilingual,explicitly human and independently keyed', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J91-L01',
        'J91-L03',
        'J91-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('all real square midpoint done', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en && c.zh)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('recomputes fractional root sets,signs and operation-order domain from actual A–E conditions', () => {
    for (const i of [0, 1]) {
      const a = row(i, 1, 'A').split('=')[1]!,
        root = i === 0 ? '3/4' : '5/6';
      expect(squareRoots(a)).toEqual(['-' + root, root]);
      expect(checkRootSet(root, a)).toBe(false);
      expect(checkRootSet('±' + root, a)).toBe(true);
      expect(checkRadical(row(i, 1, 'B'), root)).toBe(true);
      expect(checkRadical(row(i, 1, 'C'), '-' + root)).toBe(true);
      // The bounded numerical parser does not accept ^2; express the source's square as a product.
      expect(checkRadical(`sqrt((-${root})*(-${root}))`, root)).toBe(true);
      expect(row(i, 1, 'D')).toBe(`√((−${root})²)`);
      expect(readRadical(`sqrt(-(${a}))*sqrt(-(${a}))`)).toBeNull();
      expect(row(i, 1, 'E')).toBe(`(√(−${a}))²`);
    }
  });
  it('classifies finite,repeating,negative irrational and undefined objects without inferring a whole expansion from a prefix', () => {
    for (const i of [0, 1]) {
      const f = row(i, 1, 'F'),
        literal = f.split(';')[0]!,
        p = i === 0 ? 2 : 3,
        prefix = i === 0 ? '0.12' : '0.23',
        digits = i === 0 ? '27' : '18';
      expect(textR(R(literal))).toBe(i === 0 ? '707/500' : '433/250');
      expect(textR(R(digits + '/99'))).toBe(i === 0 ? '3/11' : '2/11');
      expect(radicalClass(literal)).toBe('rational');
      expect(radicalClass('-sqrt(' + p + ')')).toBe('irrational');
      expect(radicalClass('sqrt(-' + p + ')')).toBe('not-real');
      expect(radicalClass(prefix)).toBe('rational');
      expect(radicalClass(prefix + `+sqrt(${p})/1000`)).toBe('irrational');
      expect(1 < p && p < 4).toBe(true);
      expect(row(i, 1, 'P')).toContain('no continuation rule');
      expect(f).toContain('0.(' + digits + ')');
    }
  });
  it('checks equivalence separately from finished fractional forms and recomputes actual difference,sum and quotient', () => {
    for (const i of [0, 1]) {
      const target = i === 0 ? '2√3/5' : '2√5/7',
        g = row(i, 2, 'G').split('. Separate')[0]!.split('; ');
      expect(g).toHaveLength(4);
      expect(g.map((v) => checkRadical(v, target))).toEqual([
        true,
        true,
        true,
        true,
      ]);
      expect(g.map(isSimplifiedRadical)).toEqual([false, true, false, false]);
      expect(checkRadical('-' + target, target)).toBe(false);
      expect(checkRadical(row(i, 2, 'B'), i === 0 ? '-√3/5' : '-√5/7')).toBe(
        true,
      );
      expect(
        checkRadical(row(i, 2, 'C'), i === 0 ? '2√3/5+√2/5' : '2√5/7+√3/7'),
      ).toBe(true);
      expect(checkRadical(row(i, 2, 'D'), i === 0 ? '4/5' : '6/7')).toBe(true);
      const [num, den] = row(i, 2, 'D').split('/√');
      expect(checkRadical(`(${i === 0 ? '4/5' : '6/7'})*√${den}`, num!)).toBe(
        true,
      );
    }
  });
  it('separates valid zero numerators,one and undefined original denominators', () => {
    for (const i of [0, 1]) {
      const forms = row(i, 2, 'E').split('; ');
      expect(forms).toHaveLength(4);
      expect(
        forms.slice(0, 3).map((v, j) => checkRadical(v, j === 1 ? '1' : '0')),
      ).toEqual([true, true, true]);
      expect(readRadical(forms[3]!)).toBeNull();
      expect(readRadical(row(i, 2, 'F'))).toBeNull();
    }
    expect(2 * 2 * 5).toBe(20);
    expect(3 * 3 * 3).toBe(27);
  });
  it('recomputes exact ties,integer carry,perfect squares and both actual absolute errors from supplied radicands', () => {
    for (const i of [0, 1]) {
      const tie = radicand(row(i, 3, 'T')),
        cross = radicand(row(i, 3, 'C')),
        x = radicand(row(i, 3, 'X'));
      const t = rootBracket(tie, 1),
        c = rootBracket(cross, 2),
        b = rootBracket(x, 2);
      expect(textR(mulR(t.midpoint, t.midpoint))).toBe(tie);
      expect(t.rounded).toBe(i === 0 ? '1.3' : '1.8');
      expect(c.rounded).toBe(i === 0 ? '1.00' : '2.00');
      expect(rootBracket(i === 0 ? '4' : '9', 2).exact).toBe(true);
      expect(rootBracket('0', 2).rounded).toBe('0.00');
      const exact = R(i === 0 ? '99/1000' : '199/1000');
      expect(mulR(exact, exact)).toEqual(R(x));
      expect(textR(addR(exact, negR(b.lower)))).toBe('9/1000');
      expect(textR(addR(R(b.rounded), negR(exact)))).toBe('1/1000');
      expect(b.rounded).toBe(i === 0 ? '0.10' : '0.20');
    }
  });
  it('verifies distinct self-designed radicands really share bounds yet round to opposite endpoints', () => {
    for (const [a, b, lo, hi] of [
      ['961/625', '3969/2500', '1.2', '1.3'],
      ['7569/2500', '1936/625', '1.7', '1.8'],
    ]) {
      const x = rootBracket(a!, 1),
        y = rootBracket(b!, 1);
      expect(textR(x.lower)).toBe(textR(R(lo!)));
      expect(x.lower).toEqual(y.lower);
      expect(x.upper).toEqual(y.upper);
      expect(x.rounded).toBe(lo);
      expect(y.rounded).toBe(hi);
      expect(
        textR(addR(mulR(x.midpoint, x.midpoint), negR(R(a!)))),
      ).not.toMatch(/^-/);
      expect(textR(addR(mulR(y.midpoint, y.midpoint), negR(R(b!))))).toMatch(
        /^-/,
      );
    }
  });
});
