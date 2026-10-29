import { describe, it, expect } from 'vitest';
import { parabolaMeaningRetrieval } from './content/parabolaMeaningRetrieval';
import { rootQuadraticRetrieval } from './content/rootQuadraticRetrieval';
import { optimisationRecurrenceRetrieval } from './content/optimisationRecurrenceRetrieval';
import { rootQuadraticRecurrence } from './content/rootQuadraticRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  parabolaAt,
  parabolaModel,
  checkQuadraticForm,
  horizontalIntersections,
  intervalExtrema,
} from './parabolaModels';
import { textR } from './algebraModels';
import { readRational } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
import { radicalText } from './radicalModels';
import { checkRadicalSet, quadraticCandidateAudit } from './quadraticModels';
const sets = Object.values(parabolaMeaningRetrieval);
const row = (i: number, n: number, k: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const at = (s: string, x: string) => textR(parabolaAt(s, readRational(x)));
describe('J93 scales,fractional forms and attained extrema', () => {
  it('retains old tasks/bridges and directly reuses two actual fence arguments', () => {
    const entries = rootQuadraticRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J93-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(18);
    expect(refs.filter((id) => id.includes('-ROOT-QUAD-'))).toHaveLength(10);
    expect(refs.filter((id) => id.includes('-PARABOLA-MEANING-'))).toHaveLength(
      12,
    );
    expect(refs.filter((id) => id.includes('-OPTIMISATION-'))).toHaveLength(2);
    for (const s of Object.values(rootQuadraticRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(
        [6, 7, 8, 9].map((i) => s.bridgeByQuestion[s.questions[i]!.id]),
      ).toEqual(['J93-L02', 'J93-L03', 'J93-L04', 'J93-L05']);
    }
    for (const s of Object.values(optimisationRecurrenceRetrieval))
      expect(s.bridgeByQuestion[s.questions[3]!.id]).toBe('H31-L05');
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J93'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('keeps eight bilingual condition tables human-reviewed with independent keys', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(4);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J93-L01',
        'J93-L02',
        'J93-L04',
        'J93-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('vertex factor domain maximum all done', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('audits actual common-scale outputs,nonzero ratios and translated reflection lines', () => {
    const expected = [
      ['-2', '-3/2', '0', '-2', '-1', '2', '-2', '-5/2', '-4'],
      ['1', '-1/2', '-5', '1', '0', '-3', '1', '5/2', '7'],
    ];
    for (let i = 0; i < 2; i++) {
      const curves = row(i, 1, 'S')
          .split(';')
          .map((s) => s.trim().slice(2)),
        h = i === 0 ? 1 : -2,
        k = i === 0 ? -2 : 1;
      expect(
        curves.flatMap((s) => [0, 1, 2].map((d) => at(s, String(h + d)))),
      ).toEqual(expected[i]);
      expect(
        equalPolynomial(`(${curves[0]})+(${curves[2]})`, String(2 * k), ['x']),
      ).toBe(true);
      expect(
        equalPolynomial(
          `(${curves[0]})-(${k})`,
          `(${i === 0 ? '1/2' : '3/2'})*((${curves[1]})-(${k}))`,
          ['x'],
        ),
      ).toBe(true);
      expect(curves.map((s) => parabolaModel(s).opening)).toEqual(
        i === 0 ? ['up', 'up', 'down'] : ['down', 'down', 'up'],
      );
    }
  });
  it('collects real linear/constant cancellations without inventing unique parabola vertices', () => {
    for (let i = 0; i < 2; i++) {
      const linear = parabolaModel(row(i, 1, 'L')),
        constant = parabolaModel(row(i, 1, 'C'));
      expect([textR(linear.a), textR(linear.b), textR(linear.c)]).toEqual(
        i === 0 ? ['0', '2', '1'] : ['0', '-3', '4'],
      );
      expect([linear.vertex, constant.vertex]).toEqual([null, null]);
      expect(textR(constant.c)).toBe(i === 0 ? '3' : '-2');
      expect(textR(constant.b)).toBe('0');
      for (const r of [-2, 0, 3]) {
        expect(at(row(i, 1, 'L'), String(r + 1))).not.toBe(
          at(row(i, 1, 'L'), String(r - 1)),
        );
        expect(at(row(i, 1, 'C'), String(r + 1))).toBe(
          at(row(i, 1, 'C'), String(r - 1)),
        );
      }
    }
  });
  it('recomputes fractional vertices,outside compensation and completed-form distinctions', () => {
    for (let i = 0; i < 2; i++) {
      const g = row(i, 2, 'G'),
        w = row(i, 2, 'W'),
        m = parabolaModel(g),
        vertex = i === 0 ? '2(x+3/4)²-25/8' : '-3(x-1/3)²+4/3',
        factors = i === 0 ? '(2x-1)(x+2)' : '-(3x+1)(x-1)';
      expect([textR(m.vertex!.x), textR(m.vertex!.y), textR(m.c)]).toEqual(
        i === 0 ? ['-3/4', '-25/8', '-2'] : ['1/3', '4/3', '1'],
      );
      expect(checkQuadraticForm(vertex, g, 'vertex')).toBe(true);
      expect(checkQuadraticForm(factors, g, 'factored')).toBe(true);
      expect(checkQuadraticForm(g, g, 'vertex')).toBe(false);
      expect(checkQuadraticForm(g, g, 'standard')).toBe(true);
      expect(checkQuadraticForm(vertex, g, 'standard')).toBe(false);
      expect(
        equalPolynomial(`(${w})-(${g})`, i === 0 ? '9/8' : '-1/3', ['x']),
      ).toBe(true);
      expect(at(w, '0')).toBe(i === 0 ? '-7/8' : '2/3');
      expect(at(w, '0')).not.toBe(at(g, '0'));
      const roots = horizontalIntersections(g, '0').roots!.map(radicalText);
      expect(checkRadicalSet(i === 0 ? '-2,1/2' : '-1/3,1', roots)).toBe(true);
      expect(sets[i]!.questions[1]!.solution.en).toContain('c=ah²+k');
    }
  });
  it('retains zero/repeated factors and separates irrational real factors from strict-sign no-factor cases', () => {
    for (let i = 0; i < 2; i++) {
      const z = row(i, 2, 'Z'),
        d = row(i, 2, 'D'),
        m = row(i, 2, 'M');
      expect(horizontalIntersections(z, '0').roots!.map(radicalText)).toEqual([
        i === 0 ? '0' : '-1',
      ]);
      expect(
        checkQuadraticForm(i === 0 ? '-2*x*x' : '3*(x+1)*(x+1)', z, 'factored'),
      ).toBe(true);
      const roots = horizontalIntersections(d, '0').roots!.map(radicalText);
      expect(checkRadicalSet(i === 0 ? '-√2,√2' : '-√3,√3', roots)).toBe(true);
      for (const x of roots)
        expect(quadraticCandidateAudit(`${d}=0`, x)?.equationPass).toBe(true);
      expect(horizontalIntersections(m, '0').roots).toEqual([]);
      expect(at(m, '0')).toBe(i === 0 ? '1' : '-1');
      expect(parabolaModel(m).opening).toBe(i === 0 ? 'up' : 'down');
    }
  });
  it('solves shifted horizontal two/tangent/no targets and independently checks window visibility', () => {
    for (let i = 0; i < 2; i++) {
      const h = row(i, 3, 'H'),
        levels = row(i, 3, 'Q').slice(2).split(','),
        want = i === 0 ? [['7', '11'], ['9'], []] : [['-9', '-7'], ['-8'], []];
      for (const [j, q] of levels.entries()) {
        const roots = horizontalIntersections(h, q).roots!.map(radicalText);
        expect(checkRadicalSet(want[j]!.join(',') || '∅', roots)).toBe(true);
        for (const x of roots) {
          expect(quadraticCandidateAudit(`${h}=(${q})`, x)?.equationPass).toBe(
            true,
          );
          expect(at(h, x)).toBe(q.replaceAll('−', '-'));
        }
      }
      const xs = want[0]!.map(Number);
      expect(xs.filter((x) => x >= -4 && x <= 6)).toEqual([]);
      expect(xs.filter((x) => x >= -8 && x <= 12)).toEqual(
        i === 0 ? [7, 11] : [-7],
      );
      expect(at(h, '0')).toBe(i === 0 ? '80' : '-125');
    }
  });
  it('checks both closed-domain extrema,all integer ties and independent own-design family', () => {
    for (let i = 0; i < 2; i++) {
      const perimeter = Number(row(i, 4, 'R').match(/Perimeter(\d+)cm/)![1]),
        half = perimeter / 2,
        centre = half / 2,
        lo = i === 0 ? 1 : 2,
        source = `x*(${half}-x)`;
      for (const [j, upper] of [centre, centre - 1].entries()) {
        const e = intervalExtrema(source, String(lo), String(upper));
        expect([
          textR(e.maximum.value),
          ...e.maximum.inputs.map(textR),
        ]).toEqual(
          i === 0
            ? j === 0
              ? ['16', '4']
              : ['15', '3']
            : j === 0
              ? ['36', '6']
              : ['35', '5'],
        );
        expect([
          textR(e.minimum.value),
          ...e.minimum.inputs.map(textR),
        ]).toEqual(i === 0 ? ['7', '1'] : ['20', '2']);
      }
      expect(
        checkRadicalSet(
          i === 0 ? '2,6' : '3,9',
          horizontalIntersections(
            source,
            row(i, 4, 'Q').replace('cm²', ''),
          ).roots!.map(radicalText),
        ),
      ).toBe(true);
      const score = row(i, 4, 'S').split(';')[0]!,
        last = i === 0 ? 3 : 5;
      expect(
        Array.from({ length: last + 1 }, (_, x) => at(score, String(x))),
      ).toEqual(
        i === 0 ? ['-1', '1', '1', '-1'] : ['2', '6', '8', '8', '6', '2'],
      );
      const e = intervalExtrema(score, '0', String(last), true);
      expect([textR(e.maximum.value), ...e.maximum.inputs.map(textR)]).toEqual(
        i === 0 ? ['1', '1', '2'] : ['8', '2', '3'],
      );
      expect([textR(e.minimum.value), ...e.minimum.inputs.map(textR)]).toEqual(
        i === 0 ? ['-1', '0', '3'] : ['2', '0', '5'],
      );
    }
    for (const m of [1, 2, 3])
      for (const v of [-2, 0, 3]) {
        const source = `-x²+${2 * m + 1}x+(${v})`,
          ys = Array.from(
            { length: 2 * m + 2 },
            (_, x) => -x * x + (2 * m + 1) * x + v,
          );
        expect(Math.max(...ys)).toBe(m * m + m + v);
        expect(Math.min(...ys)).toBe(v);
        expect(
          ys.flatMap((y, x) => (y === Math.max(...ys) ? [x] : [])),
        ).toEqual([m, m + 1]);
        expect(
          ys.flatMap((y, x) => (y === Math.min(...ys) ? [x] : [])),
        ).toEqual([0, 2 * m + 1]);
        expect(
          equalPolynomial(source, `(${m * m + m + v}+1/4)-(x-(${m}+1/2))²`, [
            'x',
          ]),
        ).toBe(true);
      }
  });
});
