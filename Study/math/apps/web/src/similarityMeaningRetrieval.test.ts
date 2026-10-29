import { describe, it, expect } from 'vitest';
import { similarityMeaningRetrieval } from './content/similarityMeaningRetrieval';
import { similarityCircleTrigRetrieval } from './content/similarityCircleTrigRetrieval';
import { congruenceMotionRetrieval } from './content/congruenceMotionRetrieval';
import { similarityCircleTrigRecurrence } from './content/similarityCircleTrigRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { addR, mulR, divR, textR, sameR, type Rational } from './algebraModels';
import { readRational } from './rationalModels';
import { exactRootText } from './pythagoreanModels';
import {
  rectangleScale,
  availableSimilarityRules,
  mapDistance,
  shadowHeight,
} from './similarityModels';
const sets = Object.values(similarityMeaningRetrieval);
const row = (i: number, n: number, k: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const value = (s: string, k: string) =>
  readRational(s.match(new RegExp(k + '=([0-9/]+)'))![1]!);
const R = (s: string) => readRational(s);
const inverse = (r: Rational) => divR([1n, 1n], r);
describe('J94 directed similarity,area units and application premises', () => {
  it('preserves original tasks and SSA bridges with only eight independently keyed supplements', () => {
    const entries = similarityCircleTrigRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J94-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(14);
    expect(refs.filter((id) => id.includes('-SIM-CIRCLE-TRIG-'))).toHaveLength(
      10,
    );
    expect(refs.filter((id) => id.includes('-CONG-MOTION-'))).toHaveLength(2);
    expect(
      refs.filter((id) => id.includes('-SIMILARITY-MEANING-')),
    ).toHaveLength(12);
    for (const s of Object.values(similarityCircleTrigRetrieval)) {
      expect(s.questions).toHaveLength(10);
      expect(s.bridgeByQuestion[s.questions[0]!.id]).toBe('J94-L01');
      expect(s.bridgeByQuestion[s.questions[1]!.id]).toBe('J94-L03');
    }
    for (const s of Object.values(congruenceMotionRetrieval))
      expect(s.bridgeByQuestion[s.questions[1]!.id]).toBe('J86-L02');
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J94'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('provides bilingual original conditions and human review without keyword grading', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions).toHaveLength(4);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J94-L03',
        'J94-L02',
        'J94-L04',
        'J94-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('AA SAS SSS all ratios square done', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('calculates mixed-unit reductions,reverse side recovery and all correspondence positions', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 1, 'T'),
        order = raw.match(/△ABC∼△([A-Z]{3})/)![1]!,
        ab = value(raw, 'AB'),
        targetAB = divR(value(raw, order.slice(0, 2)), [10n, 1n]),
        bc = value(raw, 'BC'),
        targetCA = value(raw, order[0]! + order[2]!),
        k = divR(targetAB, ab),
        targetBC = mulR(bc, k),
        ca = divR(targetCA, k);
      expect(order).toBe(i === 0 ? 'FDE' : 'EFD');
      expect([k, inverse(k), targetBC, ca].map(textR)).toEqual(
        i === 0 ? ['2/3', '3/2', '5', '7/2'] : ['3/4', '4/3', '5/2', '20/3'],
      );
      expect(sameR(mulR(ca, k), targetCA)).toBe(true);
      const lengths = [ab, bc, ca].map((r) => Number(r[0]) / Number(r[1]));
      expect(Math.max(...lengths) * 2).toBeLessThan(
        lengths.reduce((a, b) => a + b, 0),
      );
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        i === 0 ? 'A/F,B/D,C/E' : 'A/E,B/F,C/D',
      );
    }
  });
  it('reconstructs whole sides before nested ratios and validates distinct insufficient models', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 1, 'N'),
        ad = value(raw, 'AD'),
        db = value(raw, 'DB'),
        ab = addR(ad, db),
        k = divR(ad, ab),
        ae = mulR(value(raw, 'AC'), k),
        de = mulR(value(raw, 'BC'), k),
        ec = addR(value(raw, 'AC'), mulR([-1n, 1n], ae));
      expect([ab, k, inverse(k), ae, de, ec].map(textR)).toEqual(
        i === 0
          ? ['5/2', '3/5', '5/3', '2', '5/2', '4/3']
          : ['4', '5/8', '8/5', '3', '20/3', '9/5'],
      );
      expect(sameR(divR(ad, db), k)).toBe(false);
      const insufficient = row(i, 1, 'I'),
        givenTarget = divR(value(insufficient, i === 0 ? 'FD' : 'EF'), [
          10n,
          1n,
        ]),
        width = Number(givenTarget[0]) / Number(givenTarget[1]),
        heights = i === 0 ? [3, 6] : [2, 4];
      expect(width).toBe(i === 0 ? 4 : 6);
      expect(heights[0]).not.toBe(heights[1]);
      for (const h of heights) {
        expect((width * h) / 2).toBeGreaterThan(0);
        expect(Math.hypot(width, 0)).toBe(width);
      }
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        i === 0 ? 'E(4,3) or E(4,6)' : 'D(6,2) or D(6,4)',
      );
    }
  });
  it('checks actual nonright AA,included SAS,all-three SSS and the independent changed third ratio', () => {
    for (let i = 0; i < 2; i++) {
      const aa = row(i, 2, 'A'),
        alpha = Number(aa.match(/A=D=(\d+)/)![1]),
        beta = Number(aa.match(/B=E=(\d+)/)![1]);
      expect(180 - alpha - beta).toBe(i === 0 ? 75 : 65);
      expect(
        availableSimilarityRules({ angles: ['A', 'B'], ratios: {} }),
      ).toEqual(['AA']);
      expect(textR(divR(value(aa, 'DE'), value(aa, 'AB')))).toBe(
        i === 0 ? '3/2' : '4/5',
      );
      const s = row(i, 2, 'S'),
        ab = divR(value(s, 'DE'), value(s, 'AB')),
        ac = divR(value(s, 'DF'), value(s, 'AC'));
      expect([textR(ab), textR(ac)]).toEqual(
        i === 0 ? ['3/2', '3/2'] : ['2/3', '2/3'],
      );
      expect(
        availableSimilarityRules({
          angles: ['A'],
          ratios: { AB: textR(ab), CA: textR(ac) },
        }),
      ).toEqual(['SAS']);
      expect(
        availableSimilarityRules({
          angles: ['B'],
          ratios: { AB: textR(ab), CA: textR(ac) },
        }),
      ).toEqual(['insufficient']);
      const p = row(i, 2, 'P'),
        ratios = {
          AB: textR(divR(value(p, 'DE'), value(p, 'AB'))),
          BC: textR(divR(value(p, 'EF'), value(p, 'BC'))),
          CA: textR(divR(value(p, 'FD'), value(p, 'CA'))),
        };
      expect(availableSimilarityRules({ angles: [], ratios })).toEqual(['SSS']);
      const changed = textR(divR(value(row(i, 2, 'U'), 'FD'), value(p, 'CA')));
      expect(changed).toBe(i === 0 ? '5/3' : '7/10');
      expect(
        availableSimilarityRules({
          angles: [],
          ratios: { ...ratios, CA: changed },
        }),
      ).toEqual(['insufficient']);
    }
  });
  it('separates unit cells,original-area blocks,positive inverse ratios and exact radical scales', () => {
    for (let i = 0; i < 2; i++) {
      const g = row(i, 3, 'G').match(/(\d+)×(\d+)cm;k=(\d+)/)!,
        w = Number(g[1]),
        h = Number(g[2]),
        k = Number(g[3]),
        m = rectangleScale(String(w), String(h), String(k));
      expect(
        [
          m.targetWidth,
          m.targetHeight,
          m.sourceArea,
          m.targetArea,
          m.areaRatio,
          m.perimeterRatio,
        ].map(textR),
      ).toEqual(
        i === 0
          ? ['6', '4', '6', '24', '4', '2']
          : ['12', '9', '12', '108', '9', '3'],
      );
      expect(w * h * k * k).toBe(i === 0 ? 24 : 108);
      expect(k * k).toBe(i === 0 ? 4 : 9);
      const areaRatio = R(row(i, 3, 'F').split('=')[1]!),
        root = exactRootText(areaRatio),
        reduced = rectangleScale(String(w), String(h), root);
      expect(root).toBe(i === 0 ? '3/4' : '2/3');
      expect(
        [
          reduced.targetWidth,
          reduced.targetHeight,
          reduced.targetArea,
          reduced.perimeterRatio,
        ].map(textR),
      ).toEqual(
        i === 0 ? ['9/4', '3/2', '27/8', '3/4'] : ['8/3', '2', '16/3', '2/3'],
      );
      const v = row(i, 3, 'V'),
        target = R(v.match(/AREA ratio(\d+)/)![1]!),
        decimal = R(v.match(/positive scale([\d.]+)/)![1]!);
      expect(exactRootText(target)).toBe(i === 0 ? '√2' : '√3');
      expect(textR(mulR(decimal, decimal))).toBe(
        i === 0 ? '19881/10000' : '29929/10000',
      );
      expect(sameR(mulR(decimal, decimal), target)).toBe(false);
    }
  });
  it('computes nonuniform perimeter separately and proves both equal-area rectangle matchings fail', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 3, 'T'),
        m = raw.match(/(\d+)×(\d+)cm;horizontal([\d/]+),vertical([\d/]+)/)!,
        r = rectangleScale(m[1]!, m[2]!, m[3]!, m[4]!);
      expect(
        [
          r.targetWidth,
          r.targetHeight,
          r.targetArea,
          r.areaRatio,
          r.perimeterRatio,
        ].map(textR),
      ).toEqual(
        i === 0 ? ['6', '3', '18', '3', '9/5'] : ['8', '9', '72', '6', '17/7'],
      );
      const original = divR(r.width, r.height),
        target = divR(r.targetWidth, r.targetHeight);
      expect(sameR(original, target) || sameR(original, inverse(target))).toBe(
        false,
      );
      const own = i === 0 ? [R('9/2'), R('4/3')] : [R('8'), R('3/2')],
        ownAspect = divR(own[0]!, own[1]!);
      expect(sameR(mulR(own[0]!, own[1]!), r.sourceArea)).toBe(true);
      expect(
        sameR(original, ownAspect) || sameR(original, inverse(ownAspect)),
      ).toBe(false);
      expect(sets[i]!.questions[2]!.solution.en).toContain(
        i === 0 ? '9/2×4/3' : '8×3/2',
      );
    }
  });
  it('recomputes actual map inverses,identical final frames with different motif scaling,and mixed-unit shadow models', () => {
    for (let i = 0; i < 2; i++) {
      const raw = row(i, 4, 'M'),
        den = raw.match(/^1:(\d+)/)![1]!,
        ab = raw.match(/straight AB([\d/]+)cm/)![1]!,
        cd = R(raw.match(/ground CD([\d/]+)km/)![1]!),
        display = raw.match(/bar=(\d+)\/(\d+)px,zoom([\d/]+)/)!,
        zoom = R(display[3]!);
      expect(textR(mapDistance(ab, den))).toBe('3/2');
      expect(textR(divR(mulR(cd, [100000n, 1n]), R(den)))).toBe(
        i === 0 ? '15/4' : '3/2',
      );
      expect(textR(divR([100000n, 1n], R(den)))).toBe(i === 0 ? '5' : '5/3');
      expect(
        [mulR(R(display[1]!), zoom), mulR(R(display[2]!), zoom)].map(textR),
      ).toEqual(i === 0 ? ['225', '150'] : ['120', '80']);
      const p = row(i, 4, 'P').match(
          /Original(\d+)×(\d+)cm,target width(\d+)cm;stretch frame(\d+)×([\d/]+)cm;crop retains(\d+)×(\d+)cm/,
        )!,
        factor = divR(R(p[3]!), R(p[1]!)),
        uniform = rectangleScale(p[1]!, p[2]!, textR(factor)),
        stretch = rectangleScale(
          p[1]!,
          p[2]!,
          textR(factor),
          textR(divR(R(p[5]!), R(p[2]!))),
        ),
        crop = rectangleScale(p[6]!, p[7]!, textR(factor));
      expect(
        [
          uniform.targetHeight,
          uniform.targetArea,
          uniform.areaRatio,
          stretch.targetArea,
          stretch.areaRatio,
          crop.targetArea,
          crop.areaRatio,
        ].map(textR),
      ).toEqual(
        i === 0
          ? ['6', '54', '9/4', '81/2', '27/16', '81/2', '9/4']
          : ['9', '108', '9/4', '72', '3/2', '72', '9/4'],
      );
      expect([crop.targetWidth, crop.targetHeight].map(textR)).toEqual(
        [stretch.targetWidth, stretch.targetHeight].map(textR),
      );
      expect(sameR(stretch.sx, stretch.sy)).toBe(false);
      expect(sameR(crop.sx, crop.sy)).toBe(true);
      const s = row(i, 4, 'S').match(
          /Rod(\d+)cm,shadow([\d/]+)m;target shadow([\d/]+)m/,
        )!,
        rod = divR(R(s[1]!), [100n, 1n]),
        shadow = R(s[3]!);
      expect(textR(shadowHeight(textR(rod), s[2]!, s[3]!))).toBe(
        i === 0 ? '9/4' : '3',
      );
      const alternativeHeights = [shadow, mulR([2n, 1n], shadow)];
      expect(alternativeHeights.map((h) => textR(divR(h, shadow)))).toEqual([
        '1',
        '2',
      ]);
      expect(sets[i]!.questions[3]!.solution.en).toContain(
        i === 0 ? 'heights3/2 or3m' : 'heights5/2 or5m',
      );
    }
  });
});
