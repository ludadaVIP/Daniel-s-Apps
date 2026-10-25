import { describe, it, expect } from 'vitest';
import { ratioMeaningRetrieval } from './content/ratioMeaningRetrieval';
import { relationsRecurrence } from './content/relationsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  orderedRatio,
  simplifyRatio,
  reduceBy,
  allocateRatio,
  checkRatioPair,
  mapScale,
  costCurve,
  graphCoordinates,
} from './ratioModels';
import { ratio } from './percentModels';
const sets = Object.values(ratioMeaningRetrieval);
const given = (i: number, q: number, k: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const number = (i: number, q: number, k: string) => Number(given(i, q, k));
const decimal = (s: string) => {
  const [w, p = ''] = s.split('.');
  return { n: Number(w + p), d: 10 ** p.length };
};
const fraction = (s: string) => {
  const [n, d = '1'] = s.split('/');
  return ratio(Number(n), Number(d));
};
const eq = (v: { n: number; d: number }, n: number, d = 1) =>
  expect(v).toEqual(ratio(n, d));
describe('P63 subskills through additional ratio-meaning cards', () => {
  it('retains original shared evidence, adds twelve exact tasks and leaves other units unchanged', () => {
    const e = relationsRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P63-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(27);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(23);
    expect(
      e.flatMap((e) => e.targets.filter((t) => !t.includes('RATIO-MEANING'))),
    ).toHaveLength(15);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(entry.targets).toContain(q.id);
        expect(s.bridgeByQuestion[q.id]).toBe(entry.sourceLesson);
        expect(Object.values(maintenanceSets).find((x) => x.id === s.id)).toBe(
          s,
        );
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P63'));
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
      }
    for (const other of relationsRecurrence.filter(
      (e) => !e.sourceLesson.startsWith('P63-'),
    ))
      expect(other.targets.every((t) => !t.includes('RATIO-MEANING'))).toBe(
        true,
      );
    expect(maintenanceSets.P68.questions).toHaveLength(5);
    expect(maintenanceSets.J75.questions).toHaveLength(6);
    expect(maintenanceSets.J81.questions).toHaveLength(8);
    expect(maintenanceSets.J82.questions).toHaveLength(8);
    expect(lessons).toHaveLength(358);
  });
  it('matches mixed measurement units and distinguishes quotient, whole share and difference', () => {
    for (const c of [
      { i: 0, a: 75, b: 125, simple: [3, 5], share: [3, 8], diff: 50 },
      { i: 1, a: 120, b: 180, simple: [2, 3], share: [2, 5], diff: 60 },
    ]) {
      const a = decimal(given(c.i, 1, 'A')),
        b = number(c.i, 1, 'B');
      expect(a.n * 100).toBe(c.a * a.d);
      expect(b).toBe(c.b);
      const m = orderedRatio(c.a, b);
      expect(m.simple).toEqual(c.simple);
      eq(m.firstOfTotal, c.share[0]!, c.share[1]!);
      expect(b - c.a).toBe(c.diff);
      expect(orderedRatio(b, c.a).simple).toEqual([...c.simple].reverse());
      expect(orderedRatio(2 * c.a, 2 * b).simple).toEqual(m.simple);
      expect(2 * b - 2 * c.a).toBe(2 * c.diff);
      expect(c.a / b).not.toBe(c.a / (c.a + b));
      eq(orderedRatio(0, b).value, 0);
      expect(orderedRatio(0, b).simple).toEqual([0, 1]);
      expect(() => orderedRatio(b, 0)).toThrow();
      expect(() => simplifyRatio('0:0')).toThrow();
    }
  });
  it('uses nonunique common counting units, coprime integer terms and exact fractional terms', () => {
    for (const c of [
      {
        i: 0,
        a: 12,
        b: 18,
        alt: [6, 9],
        simple: [2, 3],
        fa: 9,
        fb: 10,
        fs: [9, 10],
        g: 6,
      },
      {
        i: 1,
        a: 15,
        b: 25,
        alt: [3, 5],
        simple: [3, 5],
        fa: 8,
        fb: 15,
        fs: [8, 15],
        g: 5,
      },
    ]) {
      const d = given(c.i, 2, 'D'),
        m = simplifyRatio(d),
        unit = fraction(given(c.i, 2, 'U'));
      expect(m.simple).toEqual(c.simple);
      // The lesson explicitly permits tenths even when the model chooses a reduced common unit.
      expect(c.a * unit.d).toBe(c.alt[0]! * 10 * unit.n);
      expect(c.b * unit.d).toBe(c.alt[1]! * 10 * unit.n);
      expect(reduceBy(c.a, c.b, 1).kind).toBe('equivalent');
      expect(reduceBy(c.a, c.b, c.g).kind).toBe('simplest');
      expect(reduceBy(c.a, c.b, number(c.i, 2, 'K')).kind).toBe('invalid');
      const fm = simplifyRatio(given(c.i, 2, 'F'));
      expect(fm.denominator).toBe(12);
      expect([fm.first, fm.second]).toEqual([c.fa, c.fb]);
      expect(fm.simple).toEqual(c.fs);
      expect(
        simplifyRatio(`${2 * c.simple[0]!}:${2 * c.simple[1]!}`).simple,
      ).toEqual(c.simple);
      expect(m.first * m.simple[1]).toBe(m.second * m.simple[0]);
    }
    expect(simplifyRatio('0:5').simple).toEqual([0, 1]);
    expect(() => simplifyRatio('0:0')).toThrow();
  });
  it('checks both sum and weights, then refines counting shares without changing allocations', () => {
    for (const c of [
      { i: 0, an: 24, ad: 5, bn: 36, bd: 5 },
      { i: 1, an: 54, ad: 7, bn: 72, bd: 7 },
    ]) {
      const w = number(c.i, 3, 'W'),
        a = number(c.i, 3, 'A_W'),
        b = number(c.i, 3, 'B_W'),
        m = allocateRatio(w, a, b),
        twice = allocateRatio(w, 2 * a, 2 * b);
      eq(m.first, c.an, c.ad);
      eq(m.second, c.bn, c.bd);
      expect(m.first.n * m.second.d + m.second.n * m.first.d).toBe(
        w * m.first.d * m.second.d,
      );
      expect(m.first.n * b * m.second.d).toBe(m.second.n * a * m.first.d);
      expect((w / 2) * b).not.toBe((w / 2) * a);
      expect(twice.first).toEqual(m.first);
      expect(twice.second).toEqual(m.second);
      expect(twice.parts).toBe(2 * m.parts);
      expect(2 * twice.each.n * m.each.d).toBe(m.each.n * twice.each.d);
      expect(w % (a + b)).not.toBe(0);
      const cards = allocateRatio(2 * (a + b), a, b);
      eq(cards.first, 2 * a);
      eq(cards.second, 2 * b);
      eq(allocateRatio(0, a, b).first, 0);
      eq(allocateRatio(0, a, b).second, 0);
      expect(() => ratio(0, 0)).toThrow();
    }
  });
  it('reconstructs fractional and reverse rows, rejecting fixed additions and one-zero rows', () => {
    for (const c of [
      {
        i: 0,
        b1: [3, 4],
        b2: [15, 1],
        reverse: [3, 1],
        q1: [7, 2],
        q2: [8, 5],
      },
      {
        i: 1,
        b1: [2, 3],
        b2: [20, 1],
        reverse: [7, 2],
        q1: [10, 3],
        q2: [7, 5],
      },
    ]) {
      const [a, b] = given(c.i, 4, 'R').split(':').map(Number),
        s = fraction(given(c.i, 4, 'S')),
        l = fraction(given(c.i, 4, 'L')),
        v = fraction(given(c.i, 4, 'V'));
      const first = ratio(s.n * b!, s.d * a!),
        second = ratio(l.n * b!, l.d * a!),
        reverse = ratio(v.n * a!, v.d * b!);
      eq(first, c.b1[0]!, c.b1[1]!);
      eq(second, c.b2[0]!, c.b2[1]!);
      eq(reverse, c.reverse[0]!, c.reverse[1]!);
      expect(first.n * a! * s.d).toBe(s.n * b! * first.d);
      expect(second.n * a! * l.d).toBe(l.n * b! * second.d);
      const addedFirst = ratio((first.n + first.d) * s.d, first.d * s.n),
        addedSecond = ratio((second.n + second.d) * l.d, second.d * l.n);
      eq(addedFirst, c.q1[0]!, c.q1[1]!);
      eq(addedSecond, c.q2[0]!, c.q2[1]!);
      expect(addedFirst).not.toEqual(addedSecond);
      expect(checkRatioPair(a!, b!, 0, 0)).toBe('origin');
      expect(checkRatioPair(a!, b!, 0, 1)).toBe('different');
      expect(checkRatioPair(a!, b!, 1, 0)).toBe('different');
      expect(() => checkRatioPair(a!, b!, 0.5, 0.75)).toThrow(); // Paper fractional rows do not claim new integer-slider options.
    }
  });
  it('converts the actual decimal route, inversely maps distance and updates half/quarter-size paper scales', () => {
    for (const c of [
      {
        i: 0,
        cm: 100000,
        metres: 1000,
        km: [1, 1],
        map: [5, 1],
        printed: 50000,
        route: [2, 1],
      },
      {
        i: 1,
        cm: 160000,
        metres: 1600,
        km: [8, 5],
        map: [9, 2],
        printed: 160000,
        route: [1, 1],
      },
    ]) {
      const h = decimal(given(c.i, 5, 'AB')),
        v = decimal(given(c.i, 5, 'BC')),
        scale = number(c.i, 5, 'N'),
        z = number(c.i, 5, 'Z'),
        distance = decimal(given(c.i, 5, 'D'));
      const route = ratio(h.n * v.d + v.n * h.d, h.d * v.d);
      eq(route, 4);
      const real = ratio(route.n * scale, route.d);
      eq(real, c.cm);
      eq(ratio(real.n, 100 * real.d), c.metres);
      eq(ratio(real.n, 100000 * real.d), c.km[0]!, c.km[1]!);
      eq(ratio(distance.n * 100000, distance.d * scale), c.map[0]!, c.map[1]!);
      expect(scale * z).toBe(c.printed);
      const printedRoute = ratio(route.n, route.d * z);
      eq(printedRoute, c.route[0]!, c.route[1]!);
      expect(printedRoute.n * c.printed).toBe(real.n * printedRoute.d);
      expect(2 * scale * 2).toBe(c.cm); // Two original 2cm graphic bars.
      // A DISTINCT supported half-cm pair has the same aggregate length; original decimal legs remain unchanged paper conditions.
      const original = mapScale(2.5, 1.5, scale, 1),
        zoom = mapScale(2.5, 1.5, scale, 2);
      expect(zoom.realCm).toEqual(original.realCm);
      eq(original.realCm, c.cm);
      expect(zoom.pixelsPerOriginalCm).toBe(2 * original.pixelsPerOriginalCm);
      expect(zoom.barKm).toEqual(original.barKm);
      expect(() => mapScale(h.n / h.d, v.n / v.d, scale, 1)).toThrow(
        /half-centimetre/,
      );
    }
  });
  it('retains actual rates under axis rescaling, converts L to mL and respects continuous versus discrete domains', () => {
    for (const c of [
      {
        i: 0,
        k: 3,
        y: [0, 4.5, 7.5, 18],
        py40: 192,
        py80: 246,
        kn: 3,
        kd: 1000,
      },
      { i: 1, k: 4, y: [0, 6, 10, 24], py40: 156, py80: 228, kn: 1, kd: 250 },
    ]) {
      expect(number(c.i, 6, 'K')).toBe(c.k);
      expect(number(c.i, 6, 'Y') / c.k).toBe(6);
      const xs = given(c.i, 6, 'X').split(', ').map(Number),
        m = costCurve('direct', c.k),
        points = xs.map((x) => m.points.find((p) => p.x === x)!);
      expect(points.map((p) => p.y)).toEqual(c.y);
      expect(m.atZero).toBe(0);
      expect(m.proportional).toBe(true);
      const at40 = graphCoordinates(points, 40),
        at80 = graphCoordinates(points, 80);
      expect(at40[3]!.py).toBe(c.py40);
      expect(at80[3]!.py).toBe(c.py80);
      for (let i = 0; i < points.length; i++) {
        expect(at40[i]!.px).toBe(at80[i]!.px);
        expect(300 - at40[i]!.py).toBe(2 * (300 - at80[i]!.py));
        if (points[i]!.x > 0) expect(points[i]!.y / points[i]!.x).toBe(c.k);
      }
      const perMl = ratio(c.k, 1000);
      eq(perMl, c.kn, c.kd);
      expect(xs.map((x) => 1000 * x)).toEqual([0, 1500, 2500, 6000]);
      for (const p of points)
        expect(perMl.n * (p.x * 1000)).toBe(p.y * perMl.d);
      expect(xs.some((x) => !Number.isInteger(x))).toBe(true);
      expect(() => ratio(0, 0)).toThrow();
    }
  });
});
