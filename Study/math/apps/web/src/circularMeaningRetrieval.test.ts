import { describe, it, expect } from 'vitest';
import { circularMeaningRetrieval } from './content/circularMeaningRetrieval';
import { circularRecurrenceRetrieval } from './content/circularRecurrenceRetrieval';
import { circularRecurrenceEvidence } from './content/circularRecurrenceEvidence';
import { lessons, curriculum, unitChecks } from './content';
import { maintenanceSets } from './content/maintenance';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import {
  circularAt,
  circularSolutions,
  checkCircleIdentity,
} from './circularModels';
import { textR } from './algebraModels';
const sets = Object.values(circularMeaningRetrieval);
const compact = (s: string) => s.replaceAll(' ', '');
const eq = (
  family: 'sin' | 'cos' | 'tan',
  b: string,
  h: string,
  target: string,
  low: string,
  high: string,
  highClosed = false,
) =>
  circularSolutions({
    family,
    b,
    h,
    target,
    low,
    high,
    lowClosed: true,
    highClosed,
  }).map(textR);
describe('H04 circle meaning and existing later operations', () => {
  it('preserves twelve old tasks, shares fourteen new references and reuses five existing tasks', () => {
    const refs = circularRecurrenceEvidence.flatMap((e) => e.targets);
    expect(refs).toHaveLength(31);
    expect(new Set(refs).size).toBe(27);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of circularRecurrenceEvidence.entries()) {
      for (const u of ['H32', 'H36'])
        expect(e.targets).toContain(`${u}-MAINT-CIRCULAR-Q${i + 1}`);
      const links = recurrenceLinksFor(e.sourceLesson).flatMap(
        (g) => g.targets,
      );
      for (const id of e.targets) {
        const link = links.find((t) => t.id === id)!;
        expect(link, id).toBeDefined();
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
        const set = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        );
        const lesson = lessons.find((l) =>
          [l.guided, ...l.questions, l.exit].some((q) => q.id === id),
        );
        expect(units.indexOf((set?.unit ?? lesson?.unit)!), id).toBeGreaterThan(
          units.indexOf('H04'),
        );
      }
    }
    for (const old of Object.values(circularRecurrenceRetrieval)) {
      expect(Object.values(maintenanceSets).some((s) => s.id === old.id)).toBe(
        true,
      );
      expect(old.questions).toHaveLength(6);
      expect(old.questions.map((q) => old.bridgeByQuestion[q.id])).toEqual(
        [1, 2, 3, 4, 5, 6].map((n) => `H04-L0${n}`),
      );
    }
  });
  it('computes mixed-unit pure radians, exact degrees and final rounding from the givens', () => {
    for (const [i, s] of sets.entries()) {
      const a = s.questions[0]!.contextTable!.rows[0]![2]!.en;
      const r = Number(a.match(/r=([0-9.]+)/)![1]),
        arc = Number(a.match(/s=([−0-9.]+)/)![1]!.replace('−', '-'));
      const theta = i === 0 ? (arc * 100) / r : arc / 100 / r;
      expect(theta).toBe(i === 0 ? -1.5 : 2.5);
      const ref = s.questions[0]!.solution.en;
      expect(ref).toContain(
        ((theta * 180) / Math.PI).toFixed(1).replace('-', '−') + '°',
      );
      expect((arc * 2) / (r * 2)).toBe(arc / r);
      expect(ref).toContain(i === 0 ? 'NOT −3π/2' : 'NOT 5π/2');
      expect(ref).toContain('±');
    }
  });
  it('independently inverts swapped signed coordinates and distinguishes circle and graph points', () => {
    for (const [i, s] of sets.entries()) {
      const theta = [7 / 6, 11 / 6][i]! * Math.PI,
        swapped = [4 / 3, 2 / 3][i]! * Math.PI;
      expect(Math.cos(theta)).toBeCloseTo(
        ((i === 0 ? -1 : 1) * Math.sqrt(3)) / 2,
        13,
      );
      expect(Math.sin(theta)).toBeCloseTo(-0.5, 13);
      expect(Math.cos(swapped)).toBeCloseTo(Math.sin(theta), 13);
      expect(Math.sin(swapped)).toBeCloseTo(Math.cos(theta), 13);
      const ref = compact(s.questions[1]!.solution.en);
      expect(ref).toContain(i === 0 ? 'S=(7π/6,−1/2)' : 'S=(11π/6,−1/2)');
      expect(ref).toContain(i === 0 ? 'C=(7π/6,−√3/2)' : 'C=(11π/6,√3/2)');
      for (const x of [-7.1, -Math.PI, -0.7, 0, 0.7, Math.PI, 8.4]) {
        expect(Math.sin(-x)).toBeCloseTo(-Math.sin(x), 13);
        expect(Math.cos(-x)).toBeCloseTo(Math.cos(x), 13);
        expect(Math.sin(x + 2 * Math.PI)).toBeCloseTo(Math.sin(x), 13);
      }
      expect(ref).toContain('Everyrealangle');
      expect(ref).toContain('isattained');
    }
  });
  it('audits principal-root signs, tangent-square exclusions and the reused requested forms', () => {
    for (const [i, s] of sets.entries()) {
      const a = [5, 8][i]!,
        h = [13, 17][i]!,
        c = [12, 15][i]!;
      expect(a * a + c * c).toBe(h * h);
      const cosine = (i === 0 ? -c : c) / h,
        tangent = -a / h / cosine;
      expect(Math.sqrt(1 - (-a / h) ** 2)).toBeCloseTo(Math.abs(cosine), 14);
      expect(tangent).toBeCloseTo(i === 0 ? 5 / 12 : -8 / 15, 14);
      const ref = s.questions[2]!.solution.en;
      expect(ref).toContain('|cosθ|');
      expect(ref).toContain('π/2+kπ');
      expect(ref).toContain('undefined, not zero');
    }
    const form = lessons.find((l) => l.id === 'H35-L03')!;
    const q = (n: number) =>
      form.questions.find((q) => q.id === `H35-L03-Q${n}`)!;
    expect(q(3).stem.en).toContain('(s+c)²−2sc');
    expect(q(4).stem.en).toContain('s²−c²');
    expect(q(5).stem.en).toContain('(1−c²)/s');
    expect(checkCircleIdentity('(s+c)^2-2*s*c', '1', 'constant')).toBe(false);
    expect(checkCircleIdentity('1', '1', 'constant')).toBe(true);
    expect(checkCircleIdentity('1-2*c^2', 's^2-c^2', 'c')).toBe(true);
    expect(checkCircleIdentity('s^2-c^2', 's^2-c^2', 'c')).toBe(false);
    expect(1 + Math.tan(0.7) ** 2).toBeCloseTo(1 / Math.cos(0.7) ** 2, 14);
  });
  it('requires a second later-unit expansion and cosine-only operation without duplicating it in H36', () => {
    const near = sets[0]!.questions[2]!,
      far = sets[1]!.questions[2]!;
    expect(
      near.contextTable!.rows.find((r) => r[0]!.en === 'F')![2]!.en,
    ).toContain('(sinθ−cosθ)²+2sinθcosθ');
    expect(near.stem.en).toContain('expand the square fully');
    expect(near.solutionSteps).toEqual([near.solution]);
    expect(near.answer).toEqual({ kind: 'explain', rubric: near.solution });
    expect(near.solution.en).toContain('s²−2sc+c²+2sc=1');
    expect(near.solution.en).toContain('c²−(1−c²)=2c²−1');
    expect(far.contextTable!.rows.some((r) => r[0]!.en === 'F')).toBe(false);
    for (const angle of [-5, -Math.PI, -0.7, 0, 0.8, 3, 7]) {
      const s = Math.sin(angle),
        c = Math.cos(angle);
      expect((s - c) ** 2 + 2 * s * c).toBeCloseTo(1, 13);
      expect(c * c - s * s).toBeCloseTo(2 * c * c - 1, 13);
    }
    expect(checkCircleIdentity('2*c^2-1', 'c^2-s^2', 'c')).toBe(true);
    expect(checkCircleIdentity('c^2-s^2', 'c^2-s^2', 'c')).toBe(false);
  });
  it('recalculates every time-table value, extrema and midline root before converting time units', () => {
    for (const [i, s] of sets.entries()) {
      const table = s.questions[3]!.contextTable!.rows;
      const raw = table[1]![2]!.en.match(/t=([^ ]+)/)![1]!;
      const times = raw
        .split(',')
        .map((x) =>
          x.includes('/')
            ? Number(x.split('/')[0]) / Number(x.split('/')[1])
            : Number(x),
        );
      const H = (t: number) =>
        i === 0
          ? 5 - 1.5 * Math.cos((Math.PI * t) / 3 + Math.PI / 3)
          : 7 + 2.5 * Math.sin((Math.PI * t) / 4 - Math.PI / 2);
      const heights = times.map(H),
        expected =
          i === 0
            ? [17 / 4, 5, 13 / 2, 5, 7 / 2, 17 / 4]
            : [9 / 2, 7, 19 / 2, 7, 9 / 2];
      heights.forEach((h, j) => expect(h).toBeCloseTo(expected[j]!, 13));
      expect(Math.max(...heights)).toBeCloseTo(i === 0 ? 13 / 2 : 19 / 2, 13);
      expect(Math.min(...heights)).toBeCloseTo(i === 0 ? 7 / 2 : 9 / 2, 13);
      const roots = i === 0 ? [0.5, 3.5] : [2, 6];
      roots.forEach((t) => expect(H(t)).toBeCloseTo(i === 0 ? 5 : 7, 13));
      const converted = (v: number) =>
        i === 0
          ? 5 - 1.5 * Math.cos((Math.PI * v) / 180 + Math.PI / 3)
          : 7 + 2.5 * Math.sin(15 * Math.PI * v - Math.PI / 2);
      for (const t of [...times, 1.1, 3.3])
        expect(converted(i === 0 ? t * 60 : t / 60)).toBeCloseTo(H(t), 12);
      const ref = s.questions[3]!.solution.en;
      expect(ref).toContain(
        i === 0 ? 'heights17/4,5,13/2,5,7/2,17/4' : 'heights9/2,7,19/2,7,9/2',
      );
      expect(ref).toContain(i === 0 ? '{30,210}' : '{1/30,1/10}');
      expect(ref).toContain('k=0,1');
      expect(ref).toContain('no solution');
    }
  });
  it('checks transformed tangent roots and poles, merged extreme branches and non-special inverse roots', () => {
    const roots = [
      eq('tan', '-2', '1/4', '0', '-1/4', '3/4', true),
      eq('tan', '3', '-1/6', '1', '-1/6', '5/6'),
    ];
    expect(roots).toEqual([
      ['-1/4', '1/4', '3/4'],
      ['-1/12', '1/4', '7/12'],
    ]);
    expect(eq('sin', '2', '0', '1', '0', '2', true)).toEqual(['1/4', '5/4']);
    expect(eq('cos', '-2', '0', '-1', '-1', '1')).toEqual(['-1/2', '1/2']);
    for (const [i, s] of sets.entries()) {
      for (const x of i === 0 ? [0, 0.5] : [0, 1 / 3, 2 / 3]) {
        const u = i === 0 ? -2 * (x - 1 / 4) : 3 * (x + 1 / 6);
        expect(Math.abs(Math.cos(u * Math.PI))).toBeLessThan(1e-14);
      }
      const ref = s.questions[4]!.solution.en;
      expect(ref).toContain(
        i === 0 ? 'roots{−π/4,π/4,3π/4}' : 'roots{−π/12,π/4,7π/12}',
      );
      expect(ref).toContain(i === 0 ? '{0,π/2}' : '{0,π/3,2π/3}');
      const alpha = i === 0 ? Math.asin(1 / 3) : Math.acos(1 / 3);
      const candidates =
        i === 0 ? [alpha, Math.PI - alpha] : [alpha, 2 * Math.PI - alpha];
      candidates.forEach((x) =>
        expect((i === 0 ? Math.sin : Math.cos)(x)).toBeCloseTo(1 / 3, 14),
      );
      expect(candidates[0]).not.toBe(candidates[1]);
      expect(() =>
        eq(i === 0 ? 'sin' : 'cos', '1', '0', '1/3', '0', '2'),
      ).toThrow(/not an empty-set claim/);
      expect(ref).toContain(i === 0 ? '{α,π−α}' : '{β,2π−β}');
    }
    expect(circularAt('1/2').tan).toBeNull();
  });
  it('keeps ten human-reviewed bilingual cards separate from 358 formal lessons and six source checks', () => {
    expect(lessons).toHaveLength(358);
    expect(unitChecks.H04.questions).toHaveLength(8);
    for (const s of sets) {
      expect(Object.values(maintenanceSets).some((v) => v.id === s.id)).toBe(
        true,
      );
      expect(s.questions).toHaveLength(5);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual(
        [1, 3, 5, 4, 6].map((n) => `H04-L0${n}`),
      );
      for (const q of s.questions) {
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.stem.zh.length).toBeGreaterThan(100);
        expect(q.stem.en.length).toBeGreaterThan(250);
        expect(q.contextTable!.rows.length).toBeGreaterThanOrEqual(2);
        expect(q.hints).toHaveLength(2);
      }
    }
    const choice = lessons.find((l) => l.id === 'H04-L01')!.questions[0]!;
    expect(choice.stem.en).toContain('nonnegative');
  });
});
