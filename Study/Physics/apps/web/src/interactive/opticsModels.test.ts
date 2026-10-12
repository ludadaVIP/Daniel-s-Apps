import { describe, expect, it } from 'vitest';
import {
  opticsKinds,
  opticsParameters,
  opticsReading,
  opticsLimits,
  opticsRecord,
  lightInterface,
  reflectedDirection,
  mirrorRays,
  fibreRay,
  criticalAngle,
  fibreAngle,
  opticalCursor,
  lightSpeed,
} from './opticsModels';
import { opticsLessons } from '../content/optics';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { units } from '../content/curriculum';
import { experiments } from '../content/experiments';
import { freshLesson, decodeProgress, isMastered } from '../progress';
const rad = (x: number) => (x * Math.PI) / 180;
const finiteTree = (v: unknown): boolean =>
  typeof v === 'number'
    ? Number.isFinite(v)
    : v !== null && typeof v === 'object'
      ? Object.values(v).every(finiteTree)
      : true;
describe('Geometric optics: geometry, clock and energy', () => {
  it('preserves reflected vector length, tangent component and reversed normal component', () => {
    for (const base of [0, 30, 60])
      for (const rotation of [-10, 0, 10]) {
        const m = reflectedDirection(base, rotation),
          tangent = { x: m.normal.y, y: -m.normal.x };
        expect(Math.hypot(m.reflected.x, m.reflected.y)).toBeCloseTo(1, 12);
        expect(
          m.reflected.x * tangent.x + m.reflected.y * tangent.y,
        ).toBeCloseTo(m.incident.x * tangent.x + m.incident.y * tangent.y, 12);
        expect(
          m.reflected.x * m.normal.x + m.reflected.y * m.normal.y,
        ).toBeCloseTo(
          -(m.incident.x * m.normal.x + m.incident.y * m.normal.y),
          12,
        );
        expect(m.incidence).toBeCloseTo(Math.abs(base + rotation), 10);
        expect(m.bearing).toBeCloseTo(base + 2 * rotation, 10);
      }
  });
  it('constructs stationary shortest real mirror paths with a fixed virtual image', () => {
    for (const d of [0.5, 1, 1.5])
      for (const y of [-0.5, 0, 0.5]) {
        const m = mirrorRays(d, y);
        expect(m.image).toEqual({ x: d, y: 0.4 });
        for (const r of m.rays) {
          const distance = (q: number) =>
              Math.hypot(d, q - 0.4) + Math.hypot(1.8, q - r.eye.y),
            h = 1e-5;
          expect(
            (distance(r.q.y + h) - distance(r.q.y - h)) / (2 * h),
          ).toBeCloseTo(0, 9);
          expect(distance(r.q.y)).toBeLessThan(distance(r.q.y + 0.1));
          expect(distance(r.q.y)).toBeCloseTo(
            Math.hypot(d + 1.8, r.eye.y - 0.4),
            12,
          );
          expect(r.arrivalNS).toBeCloseTo(
            (distance(r.q.y) / lightSpeed) * 1e9,
            12,
          );
          for (const t of [0, r.arrivalNS * 0.4, r.arrivalNS])
            expect(opticalCursor(r.path, t)!.x).toBeLessThanOrEqual(1e-12);
        }
      }
  });
  it('matches Snell to the independently stationary weighted travel time', () => {
    for (const [n1, n2] of [
      [1, 1.5],
      [1.5, 1],
      [1, 1.333],
    ])
      for (const i of [0, 20, 40]) {
        const m = lightInterface(n1!, n2!, i),
          r = rad(m.transmitted!);
        expect(n1! * Math.sin(rad(i))).toBeCloseTo(n2! * Math.sin(r), 12);
        const sourceX = -Math.sin(rad(i)),
          sourceY = Math.cos(rad(i)),
          endX = Math.sin(r),
          endY = -Math.cos(r),
          h = 1e-5;
        const time = (x: number) =>
          n1! * Math.hypot(x - sourceX, sourceY) +
          n2! * Math.hypot(endX - x, endY);
        expect((time(h) - time(-h)) / (2 * h)).toBeCloseTo(0, 8);
        expect(time(0)).toBeLessThan(time(0.1));
        expect(
          lightInterface(n2!, n1!, m.transmitted!).transmitted,
        ).toBeCloseTo(i, 10);
      }
  });
  it('uses Fresnel amplitudes and normal energy flux, including Brewster and normal incidence', () => {
    for (const [n1, n2] of [
      [1, 1.5],
      [1.5, 1],
      [1, 1.333],
    ])
      for (const i of [0, 20, 40]) {
        const m = lightInterface(n1!, n2!, i),
          ci = Math.cos(rad(i)),
          ct = Math.cos(rad(m.transmitted!));
        const ts = (2 * n1! * ci) / (n1! * ci + n2! * ct),
          tp = (2 * n1! * ci) / (n2! * ci + n1! * ct),
          flux = (n2! * ct) / (n1! * ci);
        expect(m.Rs + flux * ts * ts).toBeCloseTo(1, 12);
        expect(m.Rp + flux * tp * tp).toBeCloseTo(1, 12);
        expect(m.T).toBeCloseTo((flux * (ts * ts + tp * tp)) / 2, 12);
      }
    expect(lightInterface(1, 1.5, 0).R).toBeCloseTo(0.04, 12);
    expect(
      lightInterface(1, 1.5, (Math.atan(1.5) * 180) / Math.PI).Rp,
    ).toBeCloseTo(0, 12);
    expect(lightInterface(1.5, 1.5, 90).R).toBe(0);
  });
  it('separates grazing at the exact critical boundary from no transmitted ray above it', () => {
    expect(lightInterface(1.5, 1, criticalAngle - 1e-4).state).toBe(
      'transmitted',
    );
    const c = lightInterface(1.5, 1, criticalAngle);
    expect(c.state).toBe('critical');
    expect(c.transmitted).toBe(90);
    expect(c.R).toBe(1);
    expect(c.T).toBe(0);
    const above = lightInterface(1.5, 1, criticalAngle + 1e-4);
    expect(above.state).toBe('total');
    expect(above.transmitted).toBeNull();
    expect(lightInterface(1, 1.5, 70).critical).toBeNull();
    expect(opticsParameters('critical', 1).paths).toHaveLength(1);
    expect(opticsParameters('critical', 2).paths).toHaveLength(1);
    expect(opticsParameters('critical', 0).paths).toHaveLength(2);
    expect(
      opticsReading(opticsParameters('snell', 1, 0), 1).inferredIndex,
    ).toBeNull();
    expect(
      opticsReading(opticsParameters('snell', 1), 1).inferredIndex,
    ).toBeCloseTo(1.5, 12);
  });
  it('holds frequency while slab transit, wavelength and excess delay change', () => {
    for (const i of [0, 1, 2])
      for (const L of [0.1, 0.3, 1]) {
        const m = opticsReading(opticsParameters('index', i, L), 1);
        expect(m.frequency * m.wavelengthNM * 1e-9).toBeCloseTo(
          lightSpeed / m.n2,
          6,
        );
        expect(m.slabTransitNS).toBeCloseTo(
          ((m.n2 * L) / lightSpeed) * 1e9,
          12,
        );
        expect(m.extraDelayNS).toBeCloseTo(
          (((m.n2 - 1) * L) / lightSpeed) * 1e9,
          12,
        );
        expect(m.durationNS).toBeCloseTo(
          ((1.6 + (m.n2 - 1) * L) / lightSpeed) * 1e9,
          12,
        );
      }
  });
  it('counts geometrical wall intersections and conserves each polarization across repeated leaks', () => {
    for (const a of [0, 1e-8, 12, fibreAngle, 30, 40]) {
      const m = fibreRay(a),
        expected = Math.max(
          0,
          Math.ceil((4 * Math.tan(rad(a)) - 0.3) / 0.6 - 1e-12),
        );
      expect(m.events).toHaveLength(expected);
      expect(m.durationNS).toBeCloseTo(
        ((0.04 * 1.5) / (lightSpeed * Math.cos(rad(a)))) * 1e9,
        12,
      );
      for (const s of m.core) {
        expect(Math.abs(s.from.y)).toBeLessThanOrEqual(0.300000001);
        expect(Math.abs(s.to.y)).toBeLessThanOrEqual(0.300000001);
      }
      expect(m.retained + m.leaks.reduce((v, s) => v + s.power, 0)).toBeCloseTo(
        1,
        12,
      );
      if (m.interfaceReading) {
        expect(m.retained).toBeCloseTo(
          (m.interfaceReading.Rs ** expected +
            m.interfaceReading.Rp ** expected) /
            2,
          12,
        );
      }
      if (a <= fibreAngle) {
        expect(m.retained).toBe(1);
        expect(m.leaks).toHaveLength(0);
      }
      for (const s of m.leaks) {
        expect(opticalCursor([s], s.startNS / 2)).toBeNull();
        expect(s.n).toBe(1.45);
      }
    }
    const m = fibreRay(30);
    expect(m.events).toHaveLength(4);
    expect(Math.abs(m.retained - m.R ** 4)).toBeGreaterThan(1e-10);
    expect(m.leaks.reduce((v, s) => v + s.power, 0)).toBeCloseTo(m.escaped, 12);
  });
  it('updates the fibre ledger only at physical wall arrival, and moves by c/n within each segment', () => {
    const p = opticsParameters('fibre', 2),
      f = p.fibre!;
    for (const [j, e] of f.events.entries()) {
      const before = opticsReading(p, (e.timeNS - 1e-8) / p.durationNS),
        after = opticsReading(p, (e.timeNS + 1e-8) / p.durationNS);
      expect(before.bounces).toBe(j);
      expect(after.bounces).toBe(j + 1);
      expect(after.retained + after.escaped).toBeCloseTo(1, 12);
    }
    for (const kind of opticsKinds) {
      const p = opticsParameters(kind, 0),
        scale = kind === 'fibre' ? 0.01 : 1;
      for (const path of p.paths)
        for (const s of path) {
          const t = (s.startNS + s.endNS) / 2,
            c = opticalCursor([s], t)!;
          expect(c.x).toBeCloseTo((s.from.x + s.to.x) / 2, 12);
          expect(c.y).toBeCloseTo((s.from.y + s.to.y) / 2, 12);
          expect(
            (Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y) * scale) /
              ((s.endNS - s.startNS) * 1e-9),
          ).toBeCloseTo(lightSpeed / s.n, 5);
        }
    }
  });
  it('keeps preset and free boundary states finite and rejects invalid model inputs', () => {
    for (const kind of opticsKinds)
      for (const i of [0, 1, 2])
        for (const custom of [
          null,
          opticsLimits[kind].min,
          opticsLimits[kind].max,
        ]) {
          const p = opticsParameters(kind, i, custom);
          for (const progress of [0, 0.5, 1])
            expect(finiteTree(opticsReading(p, progress))).toBe(true);
          expect(opticsRecord(p)).not.toMatch(/NaN|Infinity/);
        }
    for (const kind of opticsKinds) {
      for (const v of [
        NaN,
        Infinity,
        opticsLimits[kind].min - 1,
        opticsLimits[kind].max + 1,
      ])
        expect(() => opticsParameters(kind, 0, v)).toThrow(RangeError);
      for (const i of [-1, 0.5, 3])
        expect(() => opticsParameters(kind, i)).toThrow(RangeError);
    }
    expect(() => opticsParameters('missing' as never, 0)).toThrow(RangeError);
    expect(() => lightInterface(0.5, 1, 20)).toThrow(RangeError);
    expect(() => opticsReading(opticsParameters('fibre', 0), 1.1)).toThrow(
      RangeError,
    );
    expect(() => opticalCursor([], 0)).toThrow(RangeError);
  });
  it('registers seven full bilingual Unit 6.3 courses and preserves earlier mastery', () => {
    expect(Object.keys(units).indexOf('acoustics')).toBeLessThan(
      Object.keys(units).indexOf('optics'),
    );
    expect(lessons.slice(220, 227)).toEqual(opticsLessons);
    expect(opticsLessons.map((l) => l.kind)).toEqual(
      opticsKinds.map((k) => 'optics-' + k),
    );
    const old = lessons[0]!,
      previous = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 12345,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: previous } }))
        .lessons[old.id]?.completedAt,
    ).toBe(12345);
    for (const l of opticsLessons) {
      expect(l.stage).toBe(6);
      expect(l.unit).toBe('optics');
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('optics');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      for (const key of [
        'hook',
        'prediction',
        'explore',
        'concept',
        'example',
        'misconception',
        'realWorld',
        'summary',
        'homeExperiment',
      ] as const) {
        expect(l[key].zh.length).toBeGreaterThan(10);
        expect(l[key].en.length).toBeGreaterThan(20);
      }
      const answers = Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
        state = { ...previous, answers };
      expect(isMastered(l.id, state)).toBe(true);
      expect(isMastered(l.id, { ...state, explored: false })).toBe(false);
      expect(
        isMastered(l.id, {
          ...state,
          answers: {
            ...answers,
            3: (l.exit.correct + 1) % l.exit.options.length,
          },
        }),
      ).toBe(false);
    }
  });
});
