import { describe, it, expect } from 'vitest';
import { trigMeaningRetrieval } from './content/trigMeaningRetrieval';
import { similarityCircleTrigRetrieval } from './content/similarityCircleTrigRetrieval';
import { similarityCircleTrigRecurrence } from './content/similarityCircleTrigRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readRational as R } from './rationalModels';
import { addR, mulR, divR, negR, textR } from './algebraModels';
import {
  trigTriangle,
  inverseTrig,
  treeHeight,
  slopeModel,
  roundTrig,
  checkTrigRounded,
} from './trigModels';
import { radicalText, principalRadical } from './radicalModels';
const sets = Object.values(trigMeaningRetrieval);
const row = (i: number, n: number, k: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const value = (s: string, k: string) =>
  R(s.match(new RegExp(k + '=([0-9/]+)'))![1]!);
const subtract = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
describe('J96 exact derivations, representations and height premises', () => {
  it('preserves all original ratio/trend/constraint proofs and only adds six independently keyed cards', () => {
    const entries = similarityCircleTrigRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J96-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(20);
    expect(new Set(refs).size).toBe(12);
    expect(refs.filter((x) => x.includes('-SIM-CIRCLE-TRIG-'))).toHaveLength(
      10,
    );
    expect(refs.filter((x) => x.includes('-TRIG-MEANING-'))).toHaveLength(10);
    for (const s of Object.values(similarityCircleTrigRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(s.questions.slice(7).map((q) => s.bridgeByQuestion[q.id])).toEqual(
        ['J96-L02', 'J96-L04', 'J96-L05'],
      );
    }
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J96'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('keeps all original bilingual conditions and uses human review instead of keyword acceptance', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(3);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J96-L01',
        'J96-L04',
        'J96-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('SOH CAH TOA all done', q.answer)).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('derives the special-angle lengths from actual source sides and checks every ratio and complementary reference', () => {
    for (let i = 0; i < 2; i++) {
      const e = row(i, 1, 'E'),
        side = Number(e.match(/side (\d+)/)![1]),
        half = R(String(side / 2));
      const heightSquare = subtract(
        mulR(R(String(side)), R(String(side))),
        mulR(half, half),
      );
      expect(radicalText(principalRadical(heightSquare))).toBe(
        i === 0 ? '√3' : '2√3',
      );
      const m = trigTriangle(
        radicalText(principalRadical(heightSquare)),
        textR(half),
      );
      expect(
        ['sin', 'cos', 'tan'].map((f) => m.ratio(f as 'sin' | 'cos' | 'tan')),
      ).toEqual(['1/2', '√3/2', '√3/3']);
      const reverse = trigTriangle(
        radicalText(principalRadical(heightSquare)),
        textR(half),
        'B',
      );
      expect(
        ['sin', 'cos', 'tan'].map((f) =>
          reverse.ratio(f as 'sin' | 'cos' | 'tan'),
        ),
      ).toEqual(['√3/2', '1/2', '√3']);
      const leg = R(row(i, 1, 'I').match(/legs ([\d/]+)/)![1]!),
        iso = trigTriangle(textR(leg), textR(leg));
      expect(
        ['sin', 'cos', 'tan'].map((f) => iso.ratio(f as 'sin' | 'cos' | 'tan')),
      ).toEqual(['√2/2', '√2/2', '1']);
      expect(textR(mulR(R('0.71'), R('0.71')))).toBe('5041/10000');
    }
  });
  it('solves independent fractional cosine and tangent side models and checks full triples back', () => {
    for (let i = 0; i < 2; i++) {
      const c = row(i, 1, 'C'),
        cos = value(c, 'cosA'),
        hyp = value(c, 'AB'),
        adj = mulR(cos, hyp);
      const oppSq = subtract(mulR(hyp, hyp), mulR(adj, adj));
      expect([textR(adj), textR(oppSq)]).toEqual(
        i === 0 ? ['9/2', '36'] : ['5/2', '36'],
      );
      const t = row(i, 1, 'T'),
        tan = value(t, 'tanA'),
        opp = value(t, 'BC'),
        backAdj = divR(opp, tan);
      const hSq = addR(mulR(opp, opp), mulR(backAdj, backAdj));
      expect([textR(backAdj), radicalText(principalRadical(hSq))]).toEqual(
        i === 0 ? ['6', '13/2'] : ['15/2', '17/2'],
      );
      expect(textR(divR(opp, backAdj))).toBe(textR(tan));
      expect(textR(mulR(opp, tan))).not.toBe(textR(backAdj));
    }
  });
  it('distinguishes exact values from four-place representation and nonlinear doubling from finite samples', () => {
    for (let i = 0; i < 2; i++) {
      const f = row(i, 2, 'F');
      expect(f).toContain(i === 0 ? 'sin30°' : 'cos60°');
      expect(checkTrigRounded('0.5000', '0.5000', 4)).toBe(true);
      expect(checkTrigRounded('1/2', '0.5000', 4)).toBe(false);
      expect(checkTrigRounded('1.0000', '1.0000', 4)).toBe(true);
      expect(checkTrigRounded('1', '1.0000', 4)).toBe(false);
      const n = row(i, 2, 'N'),
        fName = i === 0 ? 'sin' : 'cos';
      expect(n).toContain(fName + 'θ');
      // Exact squares disprove sin60=2sin30 or cos60=2cos30 without rounded comparisons.
      expect(i === 0 ? 3 / 4 : 1 / 4).not.toBe(i === 0 ? 1 : 3);
      const g = row(i, 2, 'G'),
        theta = Number(g.match(/tan(\d+)°/)![1]),
        v = Math.tan((theta * Math.PI) / 180);
      expect(roundTrig(v, 4)).toBe(i === 0 ? '11.4301' : '5.6713');
      expect(v).toBeGreaterThan(4);
      expect(v).toBeLessThan(i === 0 ? 12 : 6);
      expect(sets[i]!.questions[1]!.solution.en).toContain('undefined');
    }
  });
  it('unifies actual inverse inputs, checks both angles and rounded radian conversion, and admits tangent one', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 2, 'V');
      const ratio =
        i === 0
          ? divR(
              mulR(R(raw.match(/opposite([\d.]+)m/)![1]!), R('100')),
              R(raw.match(/hypotenuse([\d.]+)cm/)![1]!),
            )
          : divR(
              R(raw.match(/opposite([\d.]+)cm/)![1]!),
              mulR(R(raw.match(/hypotenuse([\d.]+)m/)![1]!), R('100')),
            );
      expect(textR(ratio)).toBe(i === 0 ? '3/5' : '5/13');
      const sine = inverseTrig('sin', textR(ratio)),
        cosine = inverseTrig('cos', textR(ratio));
      expect([
        roundTrig(sine.degrees, 1),
        roundTrig(cosine.degrees, 1),
      ]).toEqual(i === 0 ? ['36.9', '53.1'] : ['22.6', '67.4']);
      expect(sine.degrees + cosine.degrees).toBeCloseTo(90);
      const rad = Number(raw.match(/display([\d.]+)rad/)![1]);
      expect(roundTrig((rad * 180) / Math.PI, 1)).toBe(
        roundTrig(sine.degrees, 1),
      );
    }
    for (const f of ['sin', 'cos'] as const)
      for (const q of ['0', '1', '6/5', '-1'])
        expect(() => inverseTrig(f, q)).toThrow();
    expect(roundTrig(inverseTrig('tan', '1').degrees, 1)).toBe('45.0');
    expect(roundTrig(inverseTrig('tan', '6/5').degrees, 1)).toBe('50.2');
    for (const q of ['0', '-1']) expect(() => inverseTrig('tan', q)).toThrow();
  });
  it('recomputes same-number horizontal/sight models and an actual premature-rounding failure', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 3, 'H'),
        D = Number(value(raw, 'D')[0]) / 100,
        e = value(raw, 'e'),
        b = value(raw, 'b'),
        en = Number(e[0]) / Number(e[1]),
        bn = Number(b[0]) / Number(b[1]);
      const horizontal = treeHeight(D, 30, en, 'horizontal', bn),
        sight = treeHeight(D, 30, en, 'sight', bn);
      expect([
        roundTrig(horizontal.height, 1),
        roundTrig(sight.height, 1),
      ]).toEqual(i === 0 ? ['3.1', '2.8'] : ['4.8', '4.3']);
      expect(sight.sight).toBe(D);
      expect(horizontal.horizontal).toBe(D);
      expect(roundTrig(D * 0.6 + en - bn, 1)).toBe(i === 0 ? '3.2' : '5.0');
      expect(row(i, 3, 'L')).toContain('same θ/e/b as H');
      const base0 = treeHeight(D, 30, en, 'horizontal', 0);
      expect(base0.top).toBe(horizontal.top);
      expect(base0.height).toBeGreaterThan(horizontal.height);
      expect([
        roundTrig(base0.height, 1),
        roundTrig(horizontal.height, 1),
      ]).toEqual(i === 0 ? ['3.3', '3.1'] : ['5.6', '4.8']);
      expect(row(i, 3, 'U')).toContain('NOT imported from H');
    }
  });
  it('checks the different author examples while requiring the learner to generate their own legal design', () => {
    for (let i = 0; i < 2; i++) {
      const s = slopeModel(i === 0 ? '1/2' : '3/4', i === 0 ? '3/2' : '1/2');
      expect([
        roundTrig(s.percent, 1),
        roundTrig(s.degrees, 1),
        roundTrig(s.length, 1),
      ]).toEqual(i === 0 ? ['33.3', '18.4', '1.6'] : ['150.0', '56.3', '0.9']);
      expect(() => slopeModel('1', '0')).toThrow();
      expect(sets[i]!.questions[2]!.stem.en).toContain(
        'Choose DIFFERENT valid parameters',
      );
      expect(sets[i]!.questions[2]!.solution.en).toContain(
        'Accept other valid designs',
      );
    }
  });
});
