import { describe, it, expect } from 'vitest';
import { functionConceptMeaningRetrieval } from './content/functionConceptMeaningRetrieval';
import { logicFunctionRecurrence } from './content/logicFunctionRecurrence';
import { logicFunctionRetrieval } from './content/logicFunctionRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import { readRational as R } from './rationalModels';
import { addR, mulR, divR, negR, textR, type Rational } from './algebraModels';
const sets = Object.values(functionConceptMeaningRetrieval);
const entries = logicFunctionRecurrence.filter((e) =>
  e.sourceLesson.startsWith('H02-'),
);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const sub = (a: Rational, b: Rational) => addR(a, negR(b));
const sq = (a: Rational) => mulR(a, a),
  cube = (a: Rational) => mulR(sq(a), a);
const cmp = (a: Rational, b: Rational) =>
  a[0] * b[1] < b[0] * a[1] ? -1 : a[0] * b[1] > b[0] * a[1] ? 1 : 0;
const scalar = (raw: string, key: string) =>
  R(raw.split(key + '=')[1]!.split(';')[0]!);
const bounds = (raw: string, key: string) =>
  raw
    .split(key + '=[')[1]!
    .split(']')[0]!
    .split(',')
    .map(R) as [Rational, Rational];
describe('H02 function objects and domains with reused later problems', () => {
  it('retains all twelve original references and primary bridges while adding only uncovered operations', () => {
    const refs = entries.flatMap((e) => e.targets);
    expect(entries).toHaveLength(6);
    expect(refs).toHaveLength(30);
    expect(new Set(refs).size).toBe(26);
    expect(
      refs.filter((id) => id.includes('-FUNCTION-CONCEPT-MEANING-')),
    ).toHaveLength(12);
    const original = [5, 0, 6, 7, 5, 8],
      order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of entries.entries()) {
      const old = original[i]
        ? ['H25', 'H26'].map((u) => `${u}-MAINT-LOGIC-FUNCTION-Q${original[i]}`)
        : ['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-AUDIT-Q1`);
      for (const id of old) expect(e.targets).toContain(id);
      for (const id of e.targets) {
        const set = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(set.unit)).toBeGreaterThan(order.indexOf('H02'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    }
    for (const s of Object.values(logicFunctionRetrieval))
      expect(s.questions.slice(4).map((q) => s.bridgeByQuestion[q.id])).toEqual(
        ['H02-L05', 'H02-L03', 'H02-L04', 'H02-L06'],
      );
    expect(
      logicFunctionRecurrence
        .filter((e) => e.sourceLesson.startsWith('H01-'))
        .flatMap((e) => e.targets),
    ).toHaveLength(20);
    expect(lessons).toHaveLength(358);
  });
  it('uses five independent bilingual human-reviewed cards without automatic keyword acceptance', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        expect(s.bridgeByQuestion[q.id]).toBe('H02-L0' + (i + 2));
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('function range odd inverse', q.answer)).toBeNull();
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('computes finite/interval images, same-input points, all preimages and upper-bounded radical domains', () => {
    for (let i = 0; i < 2; i++) {
      const c = row(i, 1, 'C'),
        [lo, hi] = bounds(c, 'D'),
        offset = R(c.match(/x²−(\d+)/)![1]!);
      const raw = row(i, 1, 'D')
        .split('D={')[1]!
        .split('}')[0]!
        .split(',')
        .map(R);
      const outputs = [
        ...new Set(raw.map((x) => textR(sub(sq(x), offset)))),
      ].sort((a, b) => cmp(R(a), R(b)));
      expect(outputs).toEqual(i ? ['-2', '-1', '2'] : ['-1', '0', '3']);
      expect(
        textR(sub(cmp(sq(lo), sq(hi)) > 0 ? sq(lo) : sq(hi), offset)),
      ).toBe(i ? '2' : '3');
      const x = scalar(row(i, 1, 'X/Y'), 'X');
      expect(raw.some((r) => cmp(r, x) === 0)).toBe(false);
      expect(cmp(x, lo) >= 0 && cmp(x, hi) <= 0).toBe(true);
      expect(textR(sub(sq(x), offset))).toBe(i ? '1/4' : '5/4');
      const candidates = i ? [R('-2'), R('2')] : [R('-1'), R('1')];
      expect(
        candidates.filter((r) => cmp(r, lo) >= 0 && cmp(r, hi) <= 0).map(textR),
      ).toEqual(i ? ['-2'] : ['-1', '1']);
      const m = row(i, 1, 'M'),
        edge = divR(R(i ? '5/3' : '3/2'), R(i ? '2/3' : '2'));
      expect(textR(edge)).toBe(i ? '5/2' : '3/4');
      expect(m).toContain(i ? '5/3−2x/3' : '3/2−2x');
      expect(
        textR(sub(R(i ? '5/3' : '3/2'), mulR(R(i ? '2/3' : '2'), edge))),
      ).toBe('0');
      const sol = sets[i]!.questions[0]!.solution.en;
      expect(sol).toContain('image{0}');
      expect(sol).toContain(
        'intersecting E gives' + (i ? '[−2,5/2]' : '[−1,3/4]'),
      );
      expect(sol).toContain('Announce the domain change before joining');
    }
  });
  it('audits ordered-pair admissibility and exact cube differences without mistaking samples for proof', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 2, 'P')
          .split(';')
          .map(
            (p) =>
              p.replace(/[()]/g, '').split(',').map(R) as [Rational, Rational],
          ),
        d = R(i ? '3/2' : '2');
      const valid = raw.map(
        ([x, y]) =>
          cmp(x, negR(d)) >= 0 &&
          cmp(y, d) <= 0 &&
          cmp(y, negR(d)) >= 0 &&
          cmp(x, d) <= 0 &&
          cmp(x, y) < 0,
      );
      expect(valid).toEqual([true, false, false, false]);
      const [x, y] = raw[0]!;
      expect([textR(cube(x)), textR(cube(y))]).toEqual(
        i ? ['-27/64', '27/64'] : ['-1/8', '1/8'],
      );
      for (let a = -4; a <= 4; a++)
        for (let b = a + 1; b <= 4; b++) {
          const u = R(a + '/4'),
            v = R(b + '/4'),
            factor = addR(addR(sq(v), mulR(u, v)), sq(u));
          expect(cmp(factor, R('0'))).toBe(1);
          expect(textR(sub(cube(v), cube(u)))).toBe(
            textR(mulR(sub(v, u), factor)),
          );
          expect(textR(factor)).toBe(
            textR(
              addR(
                sq(addR(v, divR(u, R('2')))),
                divR(mulR(R('3'), sq(u)), R('4')),
              ),
            ),
          );
        }
      const sol = sets[i]!.questions[1]!.solution.en;
      expect(sol).toContain(
        'Choosing a right study interval preserves original parity',
      );
      expect(sol).toContain(
        'Undefined zero does not violate the CONDITIONAL zero-value result',
      );
      expect(sol).toContain('excludes oddness,not evenness');
    }
  });
  it('independently derives collected cubic coefficients, mapped points and original-domain query exclusions', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 3, 'G'),
        a = scalar(raw, 'a'),
        b = scalar(raw, 'b'),
        h = scalar(raw, 'h'),
        k = scalar(raw, 'k'),
        [lo, hi] = bounds(raw, 'D_f');
      const leading = mulR(a, cube(b));
      const coefficients = [
        leading,
        mulR(R('-3'), mulR(h, leading)),
        mulR(R('3'), mulR(sq(h), leading)),
        sub(k, mulR(leading, cube(h))),
      ];
      expect(coefficients.map(textR)).toEqual(
        i ? ['-9/4', '-27/8', '-27/16', '-17/32'] : ['4', '-6', '3', '1/4'],
      );
      const points = ['-1/2', '0', '1'].map((s) => {
        const u = R(s);
        return [addR(h, divR(u, b)), addR(k, mulR(a, cube(u)))];
      });
      expect(points.map((p) => p.map(textR))).toEqual(
        i
          ? [
              ['-1/6', '-1/3'],
              ['-1/2', '-1/4'],
              ['-7/6', '5/12'],
            ]
          : [
              ['3/4', '13/16'],
              ['1/2', '3/4'],
              ['0', '1/4'],
            ],
      );
      for (const [x, y] of points) {
        const value = addR(
          addR(
            mulR(coefficients[0]!, cube(x!)),
            mulR(coefficients[1]!, sq(x!)),
          ),
          addR(mulR(coefficients[2]!, x!), coefficients[3]!),
        );
        expect(textR(value)).toBe(textR(y!));
      }
      const ends = [addR(h, divR(lo, b)), addR(h, divR(hi, b))].sort(cmp);
      expect(ends.map(textR)).toEqual(i ? ['-7/6', '5/6'] : ['-1/2', '1']);
      const inner = mulR(b, sub(R('1'), h));
      expect(cmp(inner, lo) >= 0 && cmp(inner, hi) <= 0).toBe(!i);
      expect(textR(addR(k, mulR(a, cube(inner))))).toBe(i ? '-251/32' : '5/4');
      const sol = sets[i]!.questions[2]!.solution.en;
      expect(sol).toContain(
        i ? '−9x³/4−27x²/8−27x/16−17/32' : '4x³−6x²+3x+1/4',
      );
      expect(sol).toContain('both full rules equal−x³ on ℝ');
    }
  });
  it('reverses a negative affine rule on its actual image and distinguishes reciprocals and exact radical recovery', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 4, 'A'),
        m = raw.match(/f\(x\)=([−-]?\d+)x\/(\d+)([+−-]\d+)\/(\d+)/)!;
      const slope = R(m[1] + '/' + m[2]),
        intercept = R(m[3] + '/' + m[4]),
        [lo, hi] = bounds(raw, 'D'),
        y = scalar(row(i, 4, 'Y/Z/X~'), 'Y');
      const f = (x: Rational) => addR(mulR(slope, x), intercept),
        inv = (v: Rational) => divR(sub(v, intercept), slope),
        root = inv(R('0'));
      expect([f(hi), f(lo)].map(textR)).toEqual(i ? ['-1', '1'] : ['-4', '2']);
      expect(textR(inv(y))).toBe(i ? '-7/6' : '-5/9');
      expect(textR(f(inv(y)))).toBe(textR(y));
      expect(textR(divR(R('1'), f(y)))).toBe(i ? '-27/17' : '-2/3');
      expect(textR(root)).toBe(i ? '-1/2' : '1/3');
      expect(textR(f(root))).toBe('0');
      const rounded = scalar(row(i, 4, 'Y/Z/X~'), 'X~');
      expect(textR(sub(f(rounded), y))).toBe(i ? '1/450' : '1/150');
      const j = R(row(i, 4, 'R').split('J=')[1]!);
      const original = sq(sub(j, R(i ? '1' : '0')));
      expect(textR(original)).toBe('19881/10000');
      expect(textR(sub(R('2'), original))).toBe('119/10000');
      const sol = sets[i]!.questions[3]!.solution.en;
      expect(sol).toContain(
        i ? 'exact preimage is1+√2' : 'exact preimage is√2',
      );
      expect(sol).toContain('Inverse input ZERO instead legitimately recovers');
    }
  });
  it('derives all started-hour charges and budget membership with exact rational ceilings and an actual proportional-model counterexample', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 5, 'S'),
        rate = R(raw.match(/,([\d/]+)NZD/)![1]!),
        end = Number(raw.match(/≤(\d+)h/)![1]),
        budget = R(row(i, 5, 'B/O').match(/B=([\d/]+)/)![1]!);
      const charge = (x: Rational) =>
        x[0] === 0n ? R('0') : mulR(rate, [(x[0] + x[1] - 1n) / x[1], 1n]);
      const queries = row(i, 5, 'Q1/Q2/Q3')
        .split('=')[1]!
        .split(' h')[0]!
        .split(',')
        .map(R);
      expect(queries.map((x) => textR(charge(x)))).toEqual(
        i ? ['7', '7', '28/3'] : ['5', '5', '15/2'],
      );
      const max = i ? 3 : 2;
      for (let q = 0; q <= end * 8; q++) {
        const x = R(q + '/8');
        expect(cmp(charge(x), budget) <= 0).toBe(cmp(x, R(String(max))) <= 0);
      }
      expect(cmp(mulR(rate, queries[2]!), budget) <= 0).toBe(true);
      expect(cmp(charge(queries[2]!), budget)).toBe(1);
      expect(textR(divR(budget, rate))).toBe(i ? '24/7' : '12/5');
      expect(sets[i]!.questions[4]!.solution.en).toContain(
        'COMPLETE[0,' + max + ']',
      );
      expect(sets[i]!.questions[4]!.stem.en).toContain('CHOOSE T>k>0');
    }
  });
  it('verifies the two supplied own-model examples without treating them as unique answers', () => {
    for (let i = 0; i < 2; i++) {
      const [T, k, p, q, b] = i ? [5, 2, 2, 3, 7] : [4, 1, 3, 1, 4];
      const maxM = i ? 3 : 2,
        maxW = i ? R('7/3') : R('4');
      for (let n = 0; n <= T * 12; n++) {
        const x = R(n + '/12'),
          before = cmp(x, R(String(k))) <= 0;
        const marginal = before
          ? mulR(R(String(p)), x)
          : addR(R(String(p * k)), mulR(R(String(q)), sub(x, R(String(k)))));
        const whole = mulR(R(String(before ? p : q)), x);
        expect(cmp(marginal, R(String(b))) <= 0).toBe(
          cmp(x, R(String(maxM))) <= 0,
        );
        expect(cmp(whole, R(String(b))) <= 0).toBe(cmp(x, maxW) <= 0);
      }
      expect(sets[i]!.questions[4]!.stem.en).toContain(
        'Accept other valid choices',
      );
      expect(sets[i]!.questions[4]!.solution.en).toContain(
        'solve in EACH branch',
      );
    }
  });
});
