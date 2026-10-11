import { describe, expect, it } from 'vitest';
import {
  circularKinds,
  circularDefault,
  circularLimits,
  circularReading,
  circularRecord,
  uniformCircle,
  loopEvent,
  loopTrack,
  type CircularKind,
} from './circularModels';
import { circularLessons } from '../content/circular';
import { mechanicalEnergyLessons } from '../content/mechanicalEnergy';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
const read = (k: CircularKind, i: number, p = 1, v = circularDefault(k, i)) =>
  circularReading(k, i, v, p);
const d = (f: (t: number) => number, t: number, h = 1e-5) =>
  (f(t + h) - f(t - h)) / (2 * h);
const integrate = (f: (t: number) => number, b: number, n = 10000) => {
  let sum = 0;
  const h = b / n;
  for (let i = 0; i < n; i++) sum += f((i + 0.5) * h) * h;
  return sum;
};
describe('circular geometry and actual forces stay on one physical clock', () => {
  it('keeps distance, displacement and lap period distinct in the same fixed window', () => {
    const a = read('path', 0),
      b = read('path', 1),
      c = read('path', 2);
    expect(a.duration).toBe(2 * Math.PI);
    expect(b.duration).toBe(a.duration);
    expect(a.distance).toBeCloseTo(2 * Math.PI, 12);
    expect(b.distance).toBeCloseTo(a.distance, 12);
    expect(c.distance).toBeCloseTo(4 * Math.PI, 12);
    expect(a.displacement).toBeCloseTo(0, 12);
    expect(b.displacement).toBeCloseTo(4, 12);
    expect(c.displacement).toBeCloseTo(0, 12);
    expect(b.period / a.period).toBe(2);
    expect(c.period).toBe(a.period);
  });
  it('differentiates circular position and velocity, and keeps acceleration perpendicular to velocity', () => {
    for (const r of [0.75, 1, 2, 4])
      for (const v of [0.5, 1, 3])
        for (const direction of [-1, 1])
          for (const t of [0.1, 0.7, 1.3]) {
            const f = (s: number) => uniformCircle(r, v, s, 2, direction),
              m = f(t);
            expect(d((s) => f(s).x, t)).toBeCloseTo(m.vx, 6);
            expect(d((s) => f(s).y, t)).toBeCloseTo(m.vy, 6);
            expect(d((s) => f(s).vx, t)).toBeCloseTo(m.ax, 6);
            expect(d((s) => f(s).vy, t)).toBeCloseTo(m.ay, 6);
            expect(m.vx * m.ax + m.vy * m.ay).toBeCloseTo(0, 10);
            expect(m.x * m.ax + m.y * m.ay).toBeCloseTo(-v * v, 10);
          }
  });
  it('reverses tangent velocity without changing centripetal acceleration at the same point', () => {
    const a = uniformCircle(2, 1, 0, 1, 1),
      b = uniformCircle(2, 1, 0, 1, -1);
    expect(a.vy).toBe(-b.vy);
    expect(a.ax).toBe(b.ax);
    expect(a.ay).toBeCloseTo(b.ay, 12);
  });
  it('removes inward force rather than inventing an outward force at tangent release', () => {
    const m = read('tangent', 2);
    expect(m.x).toBeCloseTo(-Math.PI, 12);
    expect(m.y).toBeCloseTo(2, 12);
    expect(m.vx).toBeCloseTo(-1, 12);
    expect(m.vy).toBeCloseTo(0, 12);
    expect(m.force).toBe(0);
    expect(m.ac).toBe(0);
    expect(m.released).toBe(true);
  });
  it('retains position and velocity at tangent release while allowing acceleration to jump', () => {
    for (const v of [0.5, 1, 1.5]) {
      const a = read('tangent', 2, 0.5 - 1e-8, v),
        b = read('tangent', 2, 0.5 + 1e-8, v);
      for (const key of ['x', 'y', 'vx', 'vy'] as const)
        expect(a[key]).toBeCloseTo(b[key], 6);
      expect(a.ac).toBeGreaterThan(0);
      expect(b.ac).toBe(0);
    }
  });
  it('subtracts velocity vectors rather than their equal magnitudes', () => {
    const m = read('acceleration', 0);
    expect(m.deltaV).toBeCloseTo(Math.sqrt(2), 12);
    expect(m.averageA).toBeCloseTo(Math.sqrt(2) / Math.PI, 12);
    expect(m.ac).toBe(0.5);
    expect(m.averageA).toBeLessThan(m.ac);
    expect(read('acceleration', 0, 0.0001).averageA).toBeCloseTo(0.5, 8);
  });
  it('uses square-speed and inverse-radius scaling for instantaneous inward acceleration', () => {
    expect([0, 1, 2].map((i) => read('acceleration', i).ac)).toEqual([
      0.5, 2, 4,
    ]);
  });
  it('assigns the centripetal role to the actual tension, preserving fixed-speed kinetic energy', () => {
    expect([0, 1, 2].map((i) => read('force', i).force)).toEqual([2, 4, 4]);
    for (let i = 0; i < 3; i++)
      for (const p of [0, 0.25, 0.5, 1]) {
        const r = read('force', i, p);
        expect(r.force).toBe(r.demand);
        expect(r.force).toBeCloseTo(r.mass * Math.hypot(r.ax, r.ay), 12);
        expect(r.kinetic).toBe(2 * r.mass);
      }
  });
  it('gives a physically wider turn when the available lateral force is smaller than demand', () => {
    const a = read('turning', 0),
      b = read('turning', 1),
      c = read('turning', 2);
    expect(a.demand).toBe(2);
    expect(a.force).toBe(2);
    expect(b.demand).toBe(4.5);
    expect(b.force).toBe(4);
    expect(b.actualRadius).toBe(2.25);
    expect(c.force).toBe(4);
    expect(c.actualRadius).toBe(1);
    expect(Math.hypot(b.x, b.y)).toBeGreaterThan(b.radius);
    expect(b.x).toBeCloseTo(-0.25 + 2.25 * Math.cos((4 * Math.PI) / 9), 12);
    expect(b.y).toBeCloseTo(2.25 * Math.sin((4 * Math.PI) / 9), 12);
  });
  it('does not steal kinetic energy to create a capped turn', () => {
    for (const v of [1, 2, 3, 3.5])
      for (let i = 0; i < 3; i++)
        for (const p of [0.1, 0.5, 1]) {
          const m = read('turning', i, p, v);
          expect(Math.hypot(m.vx, m.vy)).toBeCloseTo(v, 12);
          expect(m.ax * m.vx + m.ay * m.vy).toBeCloseTo(0, 10);
          expect(m.force).toBeLessThanOrEqual(4 + 1e-12);
          expect(m.actualRadius).toBeGreaterThanOrEqual(m.radius);
        }
  });
  it('couples orbital radius to gravity and circular speed, with mass-independent acceleration', () => {
    const a = read('orbit', 0),
      b = read('orbit', 1),
      c = read('orbit', 2);
    expect(a.speed).toBe(2);
    expect(b.speed).toBe(a.speed);
    expect(b.force).toBe(2 * a.force);
    expect(b.ac).toBe(a.ac);
    expect(b.period).toBe(a.period);
    expect(c.speed).toBeCloseTo(Math.sqrt(2), 12);
    expect(c.ac).toBeCloseTo(0.5, 12);
    expect(c.period / a.period).toBeCloseTo(2 * Math.sqrt(2), 12);
    for (const radius of [2, 2.5, 3, 4]) {
      const r = read('orbit', 1, 0.6, radius);
      expect(r.force).toBeCloseTo((8 * r.mass) / (r.x * r.x + r.y * r.y), 10);
      expect((r.speed * r.speed) / r.radius).toBeCloseTo(r.ac, 12);
      expect(r.total).toBeCloseTo((-4 * r.mass) / radius, 12);
    }
  });
  it('differentiates all uniform, released and capped motion in physical seconds', () => {
    for (const k of circularKinds.filter((k) => k !== 'loop'))
      for (let i = 0; i < 3; i++)
        for (const p of [0.2, 0.4, 0.7]) {
          const m = read(k, i, p),
            f = (t: number) => read(k, i, t / m.duration);
          expect(d((t) => f(t).x, m.time)).toBeCloseTo(m.vx, 6);
          expect(d((t) => f(t).y, m.time)).toBeCloseTo(m.vy, 6);
          expect(d((t) => f(t).vx, m.time)).toBeCloseTo(m.ax, 6);
          expect(d((t) => f(t).vy, m.time)).toBeCloseTo(m.ay, 6);
        }
  });
});
describe('vertical-loop contact and ballistic departure', () => {
  it('distinguishes sufficient potential-energy budget from the stronger contact condition', () => {
    expect(loopEvent(20).release).toBe(true);
    expect(loopEvent(25).release).toBe(false);
    expect(loopEvent(30).release).toBe(false);
    const e = loopEvent(20);
    expect(e.endAngle).toBeCloseTo(Math.acos(-2 / 3), 12);
    expect(e.endAngle).toBeLessThan(Math.PI);
  });
  it('obtains track transit time independently by integrating reciprocal speed over angle', () => {
    for (const E of [18, 20, 25, 30, 36]) {
      const event = loopEvent(E),
        independent = integrate(
          (theta) => 1 / Math.sqrt(2 * E - 20 * (1 - Math.cos(theta))),
          event.endAngle,
        );
      expect(event.trackTime).toBeCloseTo(independent, 7);
      expect(event.duration).toBeLessThan(2.5);
    }
  });
  it('gives the top correct speed and nonnegative normal at the minimum and higher energies', () => {
    for (const [E, K, N] of [
      [25, 5, 0],
      [30, 10, 10],
      [36, 16, 22],
    ]) {
      const event = loopEvent(E!),
        m = loopTrack(E!, event.trackTime / 2);
      expect(m.theta).toBeCloseTo(Math.PI, 10);
      expect(m.kinetic).toBeCloseTo(K!, 10);
      expect(m.potential).toBeCloseTo(20, 10);
      expect(m.normal).toBeCloseTo(N!, 10);
    }
  });
  it('keeps location, velocity and actual acceleration continuous at loss of contact', () => {
    for (const E of [18, 20, 24]) {
      const e = loopEvent(E),
        a = loopTrack(E, e.trackTime - 1e-8),
        b = loopTrack(E, e.trackTime + 1e-8);
      for (const key of ['x', 'y', 'vx', 'vy', 'ax', 'ay'] as const)
        expect(a[key]).toBeCloseTo(b[key], 5);
      expect(b.normal).toBe(0);
      expect(b.ax).toBe(0);
      expect(b.ay).toBe(-10);
    }
  });
  it('follows projectile equations after release and ends at the first bottom-height crossing', () => {
    const e = loopEvent(20),
      start = loopTrack(20, e.trackTime),
      dt = e.flightTime / 2,
      m = loopTrack(20, e.trackTime + dt),
      end = loopTrack(20, e.duration);
    expect(m.x).toBeCloseTo(start.x + start.vx * dt, 12);
    expect(m.y).toBeCloseTo(start.y + start.vy * dt - 5 * dt * dt, 12);
    expect(m.vy).toBeCloseTo(start.vy - 10 * dt, 12);
    expect(end.y).toBe(-1);
    expect(end.vy).toBeLessThan(0);
    expect(Math.hypot(end.vx, end.vy)).toBeCloseTo(Math.sqrt(40), 10);
    expect(end.kinetic).toBeCloseTo(20, 10);
    expect(end.atEnd).toBe(true);
  });
  it('conserves energy and checks force balance and trajectory derivatives through both phases', () => {
    for (const E of [18, 20, 25, 30, 36]) {
      const e = loopEvent(E);
      for (const p of [0.1, 0.3, 0.6, 0.9]) {
        const t = e.duration * p,
          m = loopTrack(E, t);
        expect(m.total).toBeCloseTo(E, 10);
        expect(d((s) => loopTrack(E, s).x, t)).toBeCloseTo(m.vx, 6);
        expect(d((s) => loopTrack(E, s).y, t)).toBeCloseTo(m.vy, 6);
        expect(d((s) => loopTrack(E, s).vx, t)).toBeCloseTo(m.ax, 5);
        expect(d((s) => loopTrack(E, s).vy, t)).toBeCloseTo(m.ay, 5);
        expect(d((s) => loopTrack(E, s).distance, t)).toBeCloseTo(
          Math.hypot(m.vx, m.vy),
          5,
        );
        expect(d((s) => loopTrack(E, s).kinetic, t)).toBeCloseTo(-10 * m.vy, 5);
        expect(m.ax * m.vx + (m.ay + 10) * m.vy).toBeCloseTo(0, 9);
      }
    }
  });
  it('agrees with an independent RK4 solution of variable-speed constrained motion', () => {
    for (const E of [20, 25, 30]) {
      const event = loopEvent(E),
        target = event.trackTime * 0.7,
        n = 5000,
        h = target / n;
      let theta = 0,
        omega = Math.sqrt(2 * E);
      for (let i = 0; i < n; i++) {
        const acc = (angle: number) => -10 * Math.sin(angle);
        const k1 = [omega, acc(theta)],
          k2 = [omega + (h * k1[1]!) / 2, acc(theta + (h * k1[0]!) / 2)],
          k3 = [omega + (h * k2[1]!) / 2, acc(theta + (h * k2[0]!) / 2)],
          k4 = [omega + h * k3[1]!, acc(theta + h * k3[0]!)];
        theta += (h * (k1[0]! + 2 * k2[0]! + 2 * k3[0]! + k4[0]!)) / 6;
        omega += (h * (k1[1]! + 2 * k2[1]! + 2 * k3[1]! + k4[1]!)) / 6;
      }
      const m = loopTrack(E, target);
      expect(m.theta).toBeCloseTo(theta, 8);
      expect(Math.hypot(m.vx, m.vy)).toBeCloseTo(omega, 8);
    }
  });
  it('checks net gravity work independently over a full track or flight interval', () => {
    for (const E of [20, 25, 30]) {
      const event = loopEvent(E),
        t = event.duration * 0.8,
        m = loopTrack(E, t),
        work = integrate((s) => -10 * loopTrack(E, s).vy, t);
      expect(work).toBeCloseTo(m.kinetic - E, 6);
    }
  });
});
describe('circular teaching domains and curriculum integration', () => {
  it('keeps every allowed model state finite and inside the diagram domains', () => {
    for (const k of circularKinds)
      for (let i = 0; i < 3; i++)
        for (const value of [
          circularLimits[k].min,
          circularDefault(k, i),
          circularLimits[k].max,
        ])
          for (let j = 0; j <= 40; j++) {
            const m = read(k, i, j / 40, value);
            for (const [key, n] of Object.entries(m))
              if (typeof n === 'number')
                expect(Number.isFinite(n), `${k}:${key}`).toBe(true);
            expect(m.x).toBeGreaterThanOrEqual(k === 'tangent' ? -6.3 : -4.01);
            expect(m.x).toBeLessThanOrEqual(4.01);
            expect(m.y).toBeGreaterThanOrEqual(-4.01);
            expect(m.y).toBeLessThanOrEqual(4.01);
            expect(m.normal).toBeGreaterThanOrEqual(0);
            expect(m.kinetic).toBeGreaterThan(0);
            expect(m.force).toBeCloseTo(m.mass * Math.hypot(m.ax, m.ay), 10);
          }
  });
  it('rejects nonfinite input, corrupt comparison and out-of-range progress before rendering', () => {
    for (const k of circularKinds) {
      for (const i of [-1, 3, 0.1, NaN])
        expect(() => read(k, i)).toThrow(RangeError);
      for (const p of [-0.01, 1.01, NaN, Infinity])
        expect(() => read(k, 0, p)).toThrow(RangeError);
      for (const v of [
        NaN,
        Infinity,
        circularLimits[k].min - 1,
        circularLimits[k].max + 1,
      ])
        expect(() => read(k, 0, 0.5, v)).toThrow(RangeError);
    }
    for (const v of [0, -1, NaN, Infinity])
      expect(() => uniformCircle(v, 1, 0)).toThrow(RangeError);
    expect(() => loopTrack(20, -1)).toThrow(RangeError);
    expect(() => loopEvent(17)).toThrow(RangeError);
  });
  it('appends seven complete bilingual lessons and their lazy stations after work/energy content', () => {
    expect(circularLessons).toHaveLength(7);
    const first = lessons.findIndex((l) => l.id === circularLessons[0]!.id);
    expect(lessons.slice(first - 6, first).map((l) => l.id)).toEqual(
      mechanicalEnergyLessons.map((l) => l.id),
    );
    for (const l of circularLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('circular');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('circular');
      expect(experiments.some((e) => e.id === l.kind)).toBe(true);
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      for (const p of [
        l.title,
        l.hook,
        l.concept,
        l.example,
        l.misconception,
        l.homeExperiment,
        l.realWorld,
        l.summary,
      ]) {
        expect(p.zh.trim()).not.toBe('');
        expect(p.en.trim()).not.toBe('');
      }
      for (const q of [...l.questions, l.exit])
        expect(q.options[q.correct]).toBeDefined();
    }
  });
  it('preserves old mastery and requires all new exploration and assessment gates', () => {
    const old = mechanicalEnergyLessons[5]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 24680,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: saved } })).lessons[
        old.id
      ]?.completedAt,
    ).toBe(24680);
    for (const l of circularLessons) {
      const state = {
        ...saved,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, state)).toBe(true);
      expect(isMastered(l.id, { ...state, explored: false })).toBe(false);
      expect(
        isMastered(l.id, { ...state, answers: { ...state.answers, 3: 1 } }),
      ).toBe(false);
    }
  });
  it('provides interpretable records for all twenty-one complete observations', () => {
    for (const k of circularKinds)
      for (let i = 0; i < 3; i++) {
        const s = circularRecord(k, i);
        expect(s).toContain('m/s');
        expect(s).toContain('t=');
        expect(s).not.toMatch(/NaN|Infinity/);
      }
  });
});
