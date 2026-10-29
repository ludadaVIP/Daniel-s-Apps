import { describe, it, expect } from 'vitest';
import { integrationMeaningRetrieval } from './content/integrationMeaningRetrieval';
import { integrationAuditRecurrence } from './content/integrationAuditRecurrence';
import { similarityCircleTrigRecurrence } from './content/similarityCircleTrigRecurrence';
import { integrationAuditRetrieval } from './content/integrationAuditRetrieval';
import { functionMeaningRetrieval } from './content/functionMeaningRetrieval';
import { rootQuadraticRetrieval } from './content/rootQuadraticRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readRational as R } from './rationalModels';
import { addR, mulR, divR, negR, textR } from './algebraModels';
import { principalRadical, radicalText } from './radicalModels';
const sets = Object.values(integrationMeaningRetrieval);
const entries = [
  ...integrationAuditRecurrence,
  ...similarityCircleTrigRecurrence,
].filter((e) => e.sourceLesson.startsWith('J98-'));
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const v = (s: string, key: string) => R(s.split(key)[1]!.match(/^[\d/.]+/)![0]);
const sq = (x: ReturnType<typeof R>) => mulR(x, x);
const minus = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const le = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  a[0] * b[1] <= b[0] * a[1];
describe('J98 structural integration with reused proofs and exact design limits', () => {
  it('preserves ten original references and adds only four independent cards alongside effective reused tasks', () => {
    const refs = entries.flatMap((e) => e.targets);
    expect(entries).toHaveLength(5);
    expect(refs).toHaveLength(28);
    expect(new Set(refs).size).toBe(18);
    expect(
      refs.filter((s) => s.includes('-INTEGRATION-MEANING-')),
    ).toHaveLength(8);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const set = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(set.unit)).toBeGreaterThan(order.indexOf('J98'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
    for (const set of Object.values(integrationAuditRetrieval))
      expect(set.questions.map((q) => set.bridgeByQuestion[q.id])).toEqual([
        'J98-L02',
        'J98-L03',
        'J98-L04',
      ]);
  });
  it('uses bilingual original tables and human review without keyword acceptance or inherited old keys', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(2);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J98-L01',
        'J98-L05',
      ]);
      for (const q of s.questions) {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('valid all constraints right angle', q.answer),
        ).toBeNull();
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.hints).toHaveLength(2);
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
      }
    }
  });
  it('checks fractional rectangle parts, perimeter, current values, coincidental linear matches and both distinct dimension changes', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 1, 'R'),
        x = v(raw, 'x='),
        d = v(raw, 'd='),
        area = mulR(x, addR(x, d)),
        per = addR(mulR(R('4'), x), mulR(R('2'), d));
      expect(textR(area)).toBe(i === 0 ? '3' : '5/2');
      expect(textR(per)).toBe(i === 0 ? '7' : '13/2');
      expect(textR(addR(sq(x), mulR(d, x)))).toBe(textR(area));
      expect(textR(mulR(R('2'), x))).toBe(textR(area));
      const test = R('1/2');
      expect(textR(mulR(test, addR(test, d)))).toBe(i === 0 ? '1/2' : '5/8');
      const vx = mulR(R('2'), x),
        va = mulR(vx, addR(vx, d)),
        vp = addR(mulR(R('4'), vx), mulR(R('2'), d));
      expect([
        textR(va),
        textR(vp),
        textR(divR(va, area)),
        textR(divR(vp, per)),
      ]).toEqual(
        i === 0
          ? ['21/2', '13', '7/2', '13/7']
          : ['65/8', '23/2', '13/4', '23/13'],
      );
      expect(textR(mulR(vx, mulR(R('2'), addR(x, d))))).toBe(
        i === 0 ? '12' : '10',
      );
    }
  });
  it('checks actual legal premise-removed triangles rather than calling an underdetermined prediction necessarily false', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 1, 'P'),
        a = v(raw, 'a='),
        b = v(raw, 'b='),
        sum = addR(sq(a), sq(b)),
        root = principalRadical(sum);
      expect(textR(sum)).toBe(i === 0 ? '25/4' : '169/4');
      expect(radicalText(root)).toBe(i === 0 ? '5/2' : '13/2');
      expect(le(a, b)).toBe(true);
      expect(2n * b[0] * a[1]).toBeGreaterThan(a[0] * b[1]);
      expect(a[0]).toBeGreaterThan(0n);
      expect(le(sum, sq(b))).toBe(false);
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        'possible but not unique',
      );
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        'universal every-triangle claim IS refuted',
      );
    }
  });
  it('derives each forced side and audits positive area and budget squares from the actual original data', () => {
    for (let i = 0; i < 2; i++) {
      const b = row(i, 2, 'B'),
        h = v(b, 'h≥'),
        run = v(b, 'r≤'),
        w = v(b, 'w='),
        p = v(b, 'p='),
        budget = v(b, 'budget='),
        maxA = v(b, 'A≤');
      expect(textR(divR(h, run))).toBe('1/4');
      const s2 = addR(sq(h), sq(run)),
        a2 = mulR(s2, sq(w)),
        c2 = mulR(a2, sq(p));
      expect(radicalText(principalRadical(s2))).toBe(
        i === 0 ? '3√17/4' : '√17/2',
      );
      expect(textR(a2)).toBe('153/25');
      expect(textR(c2)).toBe(i === 0 ? '15300' : '29988');
      expect(le(a2, sq(maxA))).toBe(true);
      expect(le(c2, sq(budget))).toBe(true);
      // For positive h,r, a≤h≤r/4≤a establishes both equality boundaries.
      expect(textR(mulR(run, R('1/4')))).toBe(textR(h));
    }
  });
  it('rejects cent-display equality when exact cost exceeds the budget and distinguishes width-only area passes from budget failures', () => {
    for (let i = 0; i < 2; i++) {
      const b = row(i, 2, 'B'),
        h = v(b, 'h≥'),
        run = v(b, 'r≤'),
        w = v(b, 'w='),
        p = v(b, 'p='),
        budget = v(b, 'budget='),
        maxA = v(b, 'A≤');
      const s2 = addR(sq(h), sq(run)),
        c2 = mulR(mulR(s2, sq(w)), sq(p)),
        limit = v(row(i, 2, 'T'), 'budget=');
      expect(textR(sq(limit))).toBe(
        i === 0 ? '152992161/10000' : '299878489/10000',
      );
      expect(le(c2, sq(limit))).toBe(false);
      const exactCost = Math.sqrt(Number(c2[0]) / Number(c2[1]));
      expect(exactCost.toFixed(2)).toBe(i === 0 ? '123.69' : '173.17');
      const wide = v(row(i, 2, 'W'), 'w='),
        a2 = mulR(s2, sq(wide)),
        wideCost2 = mulR(a2, sq(p));
      expect(textR(a2)).toBe(i === 0 ? '3965913/640000' : '248897/40000');
      expect(textR(wideCost2)).toBe(i === 0 ? '3965913/256' : '12195953/400');
      expect(le(a2, sq(maxA))).toBe(true);
      expect(le(wideCost2, sq(budget))).toBe(false);
      expect(minus(wide, w)[0]).toBeGreaterThan(0n);
      expect(sets[i]!.questions[1]!.stem.en).toContain('UNROUNDED model C');
    }
  });
  it('requires genuinely separate own feasible and near-miss reports, and rejects unrestricted signed squaring', () => {
    for (const s of sets) {
      const q = s.questions[1]!;
      expect(q.stem.en).toContain('EVERY constraint');
      expect(q.stem.en).toContain('CHOOSE another positive width');
      expect(q.stem.en).toContain(
        'Saving/exporting transports text rather than granting parent review',
      );
      expect(q.solution.en).toContain('not a close alternative');
    }
    expect(le(R('-3'), R('-2'))).toBe(true);
    expect(le(sq(R('-3')), sq(R('-2')))).toBe(false);
  });
  it('reuses actual affine-recovery and precision tasks while retaining their original bridges', () => {
    const graph = entries.find((e) => e.sourceLesson === 'J98-L02')!,
      audit = entries.find((e) => e.sourceLesson === 'J98-L04')!;
    for (const s of Object.values(functionMeaningRetrieval)) {
      const q = s.questions[1]!;
      expect(q.stem.en).toContain('two NONZERO inputs');
      expect(q.stem.en).toContain('labelled actual tick values');
      expect(graph.targets).toContain(q.id);
      expect(s.bridgeByQuestion[q.id]).toBe('J85-L06');
    }
    for (const s of Object.values(rootQuadraticRetrieval)) {
      const q = s.questions[2]!;
      expect(q.stem.en).toContain('midpoint');
      expect(q.stem.en).toContain('exact or approximate');
      expect(audit.targets).toContain(q.id);
      expect(s.bridgeByQuestion[q.id]).toBe('J91-L05');
    }
  });
});
