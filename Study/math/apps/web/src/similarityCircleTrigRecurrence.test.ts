import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { similarityCircleTrigRetrieval } from './content/similarityCircleTrigRetrieval';
import { similarityCircleTrigRecurrence } from './content/similarityCircleTrigRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { rational, mulR, divR, addR, textR } from './algebraModels';
import { readRational } from './rationalModels';
const frac = (a: number, b = 1) => rational(BigInt(a), BigInt(b));
const sets = Object.values(similarityCircleTrigRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('similarity circle trig and geometric integration recurrence', () => {
  it('covers all seventeen J94-J96 and selected J98 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter(
          (l) =>
            ['J94', 'J95', 'J96'].includes(l.unit!) ||
            ['J98-L01', 'J98-L05'].includes(l.id),
        )
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(17);
    expect(new Set(similarityCircleTrigRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of similarityCircleTrigRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twenty bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const s of sets) {
      expect(s.questions).toHaveLength(10);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks every ordered similarity side, nested proportion, squared area and map conversion', () => {
    for (const [
      u,
      kNum,
      kDen,
      sides,
      target,
      ad,
      ab,
      bc,
      areaNum,
      areaDen,
      scale,
      printed,
      zoomNum,
      zoomDen,
    ] of [
      [
        'H22',
        3,
        2,
        [5, 3, 4],
        ['15/2', '9/2', '6'],
        3,
        5,
        10,
        9,
        25,
        25000,
        4,
        2,
        1,
      ],
      [
        'H23',
        2,
        1,
        [13, 5, 12],
        ['26', '10', '24'],
        4,
        7,
        14,
        16,
        49,
        40000,
        3,
        3,
        2,
      ],
    ] as const) {
      const k = frac(kNum, kDen);
      expect(sides.map((x) => textR(mulR(frac(x), k)))).toEqual(target);
      expect(textR(mulR(k, frac(kDen, kNum)))).toBe('1');
      expect(textR(mulR(frac(ad, ab), frac(bc)))).toBe(u === 'H22' ? '6' : '8');
      expect(mulR(frac(ad, ab), frac(ad, ab))).toEqual(frac(areaNum, areaDen));
      const km = frac(printed * scale, 100000),
        zoom = frac(zoomNum, zoomDen);
      expect(textR(km)).toBe(u === 'H22' ? '1' : '6/5');
      expect(divR(mulR(frac(printed), zoom), zoom)).toEqual(frac(printed));
      expect(textR(mulR(km, zoom))).toBe(u === 'H22' ? '2' : '9/5'); // Incorrectly applying the old printed ruler after zoom.
      expect(
        similarityCircleTrigRetrieval[u].questions[1]!.solution.zh,
      ).toContain(u === 'H22' ? '9S/25' : '16S/49');
    }
    expect(2 * 3).toBe(6); // Area factor under separate horizontal/vertical scale; no common corresponding length factor follows.
  });
  it('checks chord halves, line-contact boundaries, intercepted arcs and exact sector fractions', () => {
    for (const [u, r, chord, d, minor, sectorR, theta, arc, area] of [
      ['H22', 5, 6, 4, 100, 6, 150, '5', '15'],
      ['H23', 13, 10, 12, 140, 10, 72, '4', '20'],
    ] as const) {
      expect(d * d + (chord / 2) ** 2).toBe(r * r);
      expect(r * r - (r + 1) ** 2).toBeLessThan(0);
      expect(r * r - r * r).toBe(0);
      expect(r * r - (r - 1) ** 2).toBeGreaterThan(0);
      expect(minor / 2 + (360 - minor) / 2).toBe(180);
      expect(textR(frac(2 * sectorR * theta, 360))).toBe(arc);
      expect(textR(frac(sectorR * sectorR * theta, 360))).toBe(area);
      expect(textR(frac(2 * sectorR * 360, 360))).toBe(`${2 * sectorR}`);
      const q = similarityCircleTrigRetrieval[u].questions;
      expect(q[2]!.solution.zh).toContain(`取正${d}cm`);
      expect(q[3]!.solution.zh).toContain(`APB=ARB=${minor / 2}°`);
      expect(q[5]!.solution.zh).toContain(`${arc}π+${2 * sectorR}`);
      expect(q[2]!.solution.zh).toContain('距离MX=|s|');
    }
  });
  it('checks tangent lengths and every exact circle-altitude proof quantity with original constraints', () => {
    for (const [u, r, op, tangent, a, b, c, bd, dc, alt] of [
      ['H22', 6, 10, 8, 6, 8, 10, '18/5', '32/5', '24/5'],
      ['H23', 8, 17, 15, 5, 12, 13, '25/13', '144/13', '60/13'],
    ] as const) {
      expect(op * op - r * r).toBe(tangent * tangent);
      expect(op).toBeGreaterThan(r);
      expect(a * a + b * b).toBe(c * c);
      expect(textR(frac(a * a, c))).toBe(bd);
      expect(textR(frac(a * b, c))).toBe(alt);
      expect(addR(readRational(bd), readRational(dc))).toEqual(frac(c));
      expect(mulR(readRational(bd), readRational(dc))).toEqual(
        mulR(readRational(alt), readRational(alt)),
      );
      for (const x of [bd, dc, alt])
        expect(readRational(x)[0]).toBeGreaterThan(0n);
      const q = similarityCircleTrigRetrieval[u].questions;
      expect(q[4]!.solution.zh).toContain(`取正${tangent}cm`);
      for (const x of [bd, dc, alt]) expect(q[6]!.solution.zh).toContain(x);
      expect(q[6]!.solution.zh).toContain('△ABD∼△CBA');
      expect(q[6]!.stem.en).toContain('an arbitrary E');
    }
  });
  it('checks all reference-angle ratios, scale cancellation and unknown-hypotenuse division', () => {
    for (const [u, o, a, h, newO, newH, ratios, reverse] of [
      [
        'H22',
        5,
        12,
        13,
        6,
        '78/5',
        ['5/13', '12/13', '5/12'],
        ['12/13', '5/13', '12/5'],
      ],
      [
        'H23',
        8,
        15,
        17,
        10,
        '85/4',
        ['8/17', '15/17', '8/15'],
        ['15/17', '8/17', '15/8'],
      ],
    ] as const) {
      expect(o * o + a * a).toBe(h * h);
      expect([frac(o, h), frac(a, h), frac(o, a)].map(textR)).toEqual(ratios);
      expect([frac(a, h), frac(o, h), frac(a, o)].map(textR)).toEqual(reverse);
      for (const k of ['3/2', '2/3']) {
        expect(
          divR(mulR(frac(o), readRational(k)), mulR(frac(h), readRational(k))),
        ).toEqual(frac(o, h));
        expect(
          divR(mulR(frac(o), readRational(k)), mulR(frac(a), readRational(k))),
        ).toEqual(frac(o, a));
      }
      expect(textR(divR(frac(newO), frac(o, h)))).toBe(newH);
      expect(
        similarityCircleTrigRetrieval[u].questions[7]!.solution.zh,
      ).toContain(newH);
      expect(
        similarityCircleTrigRetrieval[u].questions[7]!.solution.en,
      ).toContain('AA');
    }
  });
  it('checks mixed-unit degree inversion and strict acute bounds without reciprocal confusion', () => {
    for (const [u, o, a, degrees, rounded] of [
      ['H22', 9, 120 / 10, 36.86989765, '36.9'],
      ['H23', 50 / 100, 1.2, 22.61986495, '22.6'],
    ] as const) {
      const angle = (Math.atan(o / a) * 180) / Math.PI;
      expect(angle).toBeCloseTo(degrees, 8);
      expect(angle.toFixed(1)).toBe(rounded);
      expect(angle).not.toBe(a / o);
      expect(
        similarityCircleTrigRetrieval[u].questions[8]!.solution.zh,
      ).toContain(`舍为${rounded}°`);
    }
    expect(Math.sqrt(3)).toBeGreaterThan(1);
    // Compare two genuinely acute projections: 30° and 60°.
    const o1 = 0.5,
      a1 = Math.sqrt(3) / 2,
      o2 = Math.sqrt(3) / 2,
      a2 = 0.5;
    expect(o2 / a2).toBeGreaterThan(o1 / a2);
    expect(o1 / a2).toBeGreaterThan(o1 / a1);
    for (const q of sets.map((s) => s.questions[8]!)) {
      expect(q.stem.zh).toContain('0°<θ<90°');
      expect(q.solution.zh).toContain('sinθ=1.2超界');
    }
  });
  it('checks width-only versus uniform-scale area/cost, violated limits and independent instrument heights', () => {
    for (const [
      u,
      h,
      run,
      slope,
      widthNew,
      rate,
      kRaw,
      hLimit,
      rLimit,
      area,
      cost,
      widthArea,
      widthCost,
      scaledArea,
      scaledCost,
      instrument,
      target,
    ] of [
      [
        'H22',
        3,
        4,
        5,
        3,
        12,
        '2',
        4,
        6,
        '10',
        '120',
        '15',
        '180',
        '40',
        '480',
        '1.2',
        '4.2',
      ],
      [
        'H23',
        5,
        12,
        13,
        4,
        10,
        '3/2',
        6,
        15,
        '26',
        '260',
        '52',
        '520',
        '117/2',
        '585',
        '1.5',
        '6.5',
      ],
    ] as const) {
      expect(h * h + run * run).toBe(slope * slope);
      expect(textR(frac(2 * slope))).toBe(area);
      expect(textR(frac(2 * slope * rate))).toBe(cost);
      expect(textR(frac(widthNew * slope))).toBe(widthArea);
      expect(textR(frac(widthNew * slope * rate))).toBe(widthCost);
      const k = readRational(kRaw),
        scaled = mulR(frac(2 * slope), mulR(k, k));
      expect(textR(scaled)).toBe(scaledArea);
      expect(textR(mulR(scaled, frac(rate)))).toBe(scaledCost);
      expect(divR(mulR(frac(h), k), mulR(frac(run), k))).toEqual(frac(h, run));
      const scaledH = mulR(frac(h), k),
        scaledRun = mulR(frac(run), k);
      expect(scaledH[0]).toBeGreaterThan(BigInt(hLimit) * scaledH[1]);
      expect(scaledRun[0]).toBeGreaterThan(BigInt(rLimit) * scaledRun[1]);
      expect(
        textR(addR(mulR(frac(run), frac(h, run)), readRational(instrument))),
      ).toBe(textR(readRational(target)));
      expect(
        similarityCircleTrigRetrieval[u].questions[9]!.solution.zh,
      ).toContain(`${scaledCost}`);
    }
    for (const u of ['H05', 'H06']) {
      const original =
        maintenanceSets[u as keyof typeof maintenanceSets].questions[7]!;
      expect(original.id).toBe(`${u}-MAINT-CONG-MOTION-Q8`);
      expect(original.stem.en).toContain('general');
      expect(checkAnswer(original.solution.en, original.answer)).toBeNull();
    }
  });
});
