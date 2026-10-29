import { describe, it, expect } from 'vitest';
import { logicMeaningRetrieval } from './content/logicMeaningRetrieval';
import { logicFunctionRecurrence } from './content/logicFunctionRecurrence';
import { logicFunctionRetrieval } from './content/logicFunctionRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  finiteSet,
  absoluteSolution,
  unionText,
  parseRealUnion,
  unionContains,
} from './logicModels';
import { readRational as R } from './rationalModels';
import { addR, mulR, negR, divR, textR } from './algebraModels';

const sets = Object.values(logicMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const entries = logicFunctionRecurrence.filter((e) =>
  e.sourceLesson.startsWith('H01-'),
);
describe('H01 precise objects, directed operations and complete domains', () => {
  it('preserves ten original references and bridges, adding ten independent later tasks', () => {
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(20);
    expect(new Set(refs).size).toBe(18);
    expect(entries).toHaveLength(5);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries) {
      expect(
        e.targets.filter((id) => id.includes('-LOGIC-FUNCTION-')),
      ).toHaveLength(2);
      for (const id of e.targets) {
        const set = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(set.unit)).toBeGreaterThan(order.indexOf('H01'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    }
    for (const s of Object.values(logicFunctionRetrieval))
      expect(
        s.questions.slice(0, 4).map((q) => s.bridgeByQuestion[q.id]),
      ).toEqual(['H01-L02', 'H01-L03', 'H01-L04', 'H01-L05']);
    expect(lessons).toHaveLength(358);
  });
  it('requires human review of bilingual original tables with separate five-card identities', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        expect(s.bridgeByQuestion[q.id]).toBe('H01-L0' + (i + 1));
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('subset sufficient all reals', q.answer)).toBeNull();
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
  it('checks actual rational deduplication and strict rule boundaries rather than string spellings', () => {
    for (let i = 0; i < 2; i++) {
      expect(finiteSet(row(i, 1, 'D'))).toEqual(['0', i ? '3/4' : '1/2', '1']);
      const limit = Number(row(i, 1, 'R').match(/below (\d+)/)![1]);
      const expected = Array.from({ length: limit }, (_, n) => n).filter(
        (n) => n > 0 && n % 2 === 0,
      );
      expect(expected).toEqual(i ? [2, 4, 6, 8, 10] : [2, 4, 6, 8]);
      const solution = sets[i]!.questions[0]!.solution.en;
      expect(solution).toContain('R gives {' + expected.join(',') + '}');
      expect(solution).toContain(
        'C={{0},∅} explicitly has TWO set-valued elements',
      );
      expect(solution).toContain('false,true,true,true');
      expect(solution).toContain('Accept other definite, complete rules');
    }
  });
  it('reconstructs all four ID regions and verifies simultaneous shrinking, including equal/disjoint/empty cases', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 2, 'M');
      const field = (key: string) =>
        raw
          .split(key + '={')[1]!
          .split('}')[0]!
          .split(',')
          .map(Number);
      const u = field('U'),
        a = field('A'),
        b = field('B');
      const cells = [
        u.filter((x) => a.includes(x) && !b.includes(x)),
        u.filter((x) => a.includes(x) && b.includes(x)),
        u.filter((x) => !a.includes(x) && b.includes(x)),
        u.filter((x) => !a.includes(x) && !b.includes(x)),
      ];
      expect(cells).toEqual(
        i
          ? [
              [0, 7],
              [2, 5],
              [1, 6],
              [3, 4],
            ]
          : [
              [1, 7],
              [2, 6],
              [3, 8],
              [4, 5],
            ],
      );
      expect([...cells.flat()].sort((a, b) => a - b)).toEqual(u);
      const max = Number(row(i, 2, 'S').match(/≤(\d+)/)![1]);
      const nu = u.filter((x) => x <= max),
        na = a.filter((x) => nu.includes(x)),
        nb = b.filter((x) => nu.includes(x));
      expect(na).toEqual(i ? [0, 2, 5] : [1, 2, 6]);
      expect(nb).toEqual(i ? [1, 2, 5] : [2, 3, 6]);
      expect(nu.filter((x) => !na.includes(x))).toEqual(
        i ? [1, 3, 4] : [3, 4, 5],
      );
      const s = sets[i]!.questions[1]!.solution.en;
      for (const [j, label] of [
        'A-only',
        'overlap',
        'B-only',
        'neither',
      ].entries())
        expect(s).toContain(label + '={' + cells[j]!.join(',') + '}');
      expect(s).toContain(
        i ? 'Removed IDs 6 and 7 leave' : 'Removed IDs 7 and 8 leave',
      );
      expect(s).toContain('both differences empty');
      expect(s).toContain('Z has empty intersection');
    }
  });
  it('distinguishes unknown truth, open sentences and admissible confirming candidates from refutation', () => {
    for (let i = 0; i < 2; i++) {
      const shift = i ? 2 : 0,
        half = R(i ? '5/2' : '1/2'),
        m = addR(half, R(String(-shift)));
      expect(textR(mulR(m, m))).toBe('1/4');
      const confirming = R(i ? '1' : '-1'),
        cm = addR(confirming, R(String(-shift)));
      expect(textR(cm)).toBe('-1');
      expect(textR(mulR(cm, cm))).toBe('1');
      const q = sets[i]!.questions[2]!;
      expect(q.stem.en).toContain('FIXED but unrevealed');
      expect(q.solution.en).toContain('it IS a statement');
      expect(q.solution.en).toContain(
        'admissible over both, but confirming rather than refuting',
      );
      expect(q.solution.en).toContain(
        'An irrational real can be syntactically rejected yet remain in the real domain',
      );
    }
  });
  it('checks full equal/overlap/empty truth sets and exchanged subjects without implying existence', () => {
    for (let i = 0; i < 2; i++) {
      const vals = i ? [-0.5, 0.5, 1.5, 2.5] : [0.5, 1.5, 2.5, 3.5];
      const [f, g, h, w] = vals as [number, number, number, number];
      const centre = i ? 0 : 1;
      expect([f, g].map((x) => Math.abs(x - centre))).toEqual([0.5, 0.5]);
      const p = [f, g],
        q = [g, h],
        implies = (a: boolean, b: boolean) => !a || b;
      expect(implies(p.includes(f), q.includes(f))).toBe(false);
      expect(implies(q.includes(h), p.includes(h))).toBe(false);
      expect([
        implies(p.includes(w), q.includes(w)),
        implies(q.includes(w), p.includes(w)),
      ]).toEqual([true, true]);
      expect([f, g, h, w].some((x) => x * x === -1)).toBe(false);
      const s = sets[i]!.questions[3]!.solution.en;
      expect(s).toContain('Empty is contained in Q');
      expect(s).toContain('establishes neither a real root');
      expect(s).toContain('changing to necessary-only on exchange');
    }
  });
  it('independently derives fractional positive/negative coefficient bounds, checks original residuals and nonnegative intersections', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 5, 'A');
      const value = (key: string) =>
        raw.split(';' + key + '=')[1]!.split(';')[0]!;
      const a = value('a'),
        b = value('b'),
        c = value('c');
      const expected = i ? [-2, 3] : [-2, 1],
        negExpected = i ? [-3, 2] : [-1, 2];
      const bounds = [addR(negR(R(c)), negR(R(b))), addR(R(c), negR(R(b)))];
      expect(bounds.map((v) => textR(divR(v, R(a))))).toEqual(
        expected.map(String),
      );
      expect(bounds.map((v) => textR(divR(v, negR(R(a))))).reverse()).toEqual(
        negExpected.map(String),
      );
      const abs = (v: ReturnType<typeof R>): ReturnType<typeof R> => [
        v[0] < 0n ? -v[0] : v[0],
        v[1],
      ];
      const residual = (coef: string, x: number) =>
        abs(addR(mulR(R(coef), R(String(x))), R(b)));
      const le = (v: ReturnType<typeof R>) => v[0] * R(c)[1] <= R(c)[0] * v[1];
      for (const x of expected) expect(textR(residual(a, x))).toBe(c);
      const sol = sets[i]!.questions[4]!.solution.en;
      expect(sol).toContain('≤ set is [−2,' + expected[1] + ']');
      expect(sol).toContain('T gives ≤ set [0,' + expected[1] + ']');
      expect(sol).toContain('B centre=');
      const positive = absoluteSolution(a, b, c, '<='),
        negative = absoluteSolution('-' + a, b, c, '<=');
      for (const x of [-10, -3, -2, -1, 0, 1, 2, 3, 10]) {
        expect(unionContains(positive, R(String(x)))).toBe(le(residual(a, x)));
        expect(unionContains(negative, R(String(x)))).toBe(
          le(residual('-' + a, x)),
        );
      }
    }
  });
  it('keeps zero-coefficient constant comparisons distinct from a punctured line and checks actual union bridging', () => {
    for (let i = 0; i < 2; i++) {
      const b = i ? '-1/3' : '3/4',
        c = i ? '5/3' : '9/4';
      const signs = ['<', '<=', '>', '>='] as const;
      expect(
        signs.map((s) => unionText(absoluteSolution('0', b, c, s))),
      ).toEqual(['ℝ', 'ℝ', '∅', '∅']);
      expect(
        signs.map((s) =>
          unionText(absoluteSolution('0', b, i ? '1/3' : '3/4', s)),
        ),
      ).toEqual(['∅', 'ℝ', '∅', 'ℝ']);
      expect(
        signs.map((s) => unionText(absoluteSolution('0', '0', '0', s))),
      ).toEqual(['∅', 'ℝ', '∅', 'ℝ']);
      const z = i ? '-1/2' : '1/2';
      const joined = parseRealUnion(`x<${z} or x>=${z}`)!,
        hole = parseRealUnion(`x<${z} or x>${z}`)!;
      expect(unionContains(joined, R(z))).toBe(true);
      expect(unionContains(hole, R(z))).toBe(false);
      expect(joined).toHaveLength(1);
      expect(hole).toHaveLength(2);
    }
  });
});
