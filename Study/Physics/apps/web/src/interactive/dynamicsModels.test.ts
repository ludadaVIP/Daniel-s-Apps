import { describe, it, expect } from 'vitest';
import {
  frictionMotion,
  quadraticFall,
  elevatorMotion,
  vehicleMotion,
  rocketMotion,
  dynamicsKinds,
  dynamicsDefault,
  dynamicsLimits,
  dynamicsDuration,
  dynamicsReading,
  dynamicsRecord,
} from './dynamicsModels';
import { dynamicsLessons } from '../content/dynamics';
import { newtonLessons } from '../content/newton';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
const derivative = (f: (t: number) => number, t: number) => {
  const h = 1e-5;
  return (f(t + h) - f(t - h)) / (2 * h);
};
// Independent RK4 integration of dy/dt=v and dv/dt=g-kv²/m.
function integratedFall(m: number, k: number, u: number, t: number) {
  let v = u,
    y = 0;
  const n = 4000,
    h = t / n,
    a = (v: number) => 10 - (k * v * v) / m;
  for (let i = 0; i < n; i++) {
    const k1 = a(v),
      k2 = a(v + (h * k1) / 2),
      k3 = a(v + (h * k2) / 2),
      k4 = a(v + h * k3);
    y +=
      (h / 6) *
      (v + 2 * (v + (h * k1) / 2) + 2 * (v + (h * k2) / 2) + (v + h * k3));
    v += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  }
  return { v, y };
}
describe('living applications retain correct forces and stage boundaries', () => {
  it('adapts static friction below and at its limit without creating motion', () => {
    for (const push of [0, 1, 6, 10, 12])
      for (const t of [0, 0.5, 2]) {
        const m = frictionMotion(push, 0, t);
        expect(m.friction).toBeCloseTo(-push, 12);
        expect(m.velocity).toBe(0);
        expect(m.position).toBe(0);
        expect(m.acceleration).toBe(0);
      }
  });
  it('switches to kinetic friction only when the rest limit is exceeded', () => {
    const m = frictionMotion(14, 0, 2);
    expect(m.friction).toBe(-8);
    expect(m.acceleration).toBe(3);
    expect(m.velocity).toBe(6);
    expect(m.position).toBe(6);
    expect(m.state).toBe('sliding');
  });
  it('retains sliding below the static threshold and stops without reversal', () => {
    const before = frictionMotion(0, 3, 0.5),
      at = frictionMotion(0, 3, 0.75),
      after = frictionMotion(0, 3, 2);
    expect(before.acceleration).toBe(-4);
    expect(before.velocity).toBe(1);
    expect(at.position).toBe(1.125);
    expect(after.position).toBe(at.position);
    expect(after.velocity).toBe(0);
    expect(after.friction).toBe(0);
    expect(frictionMotion(8, 3, 2).velocity).toBe(3);
    expect(frictionMotion(8, 0, 2).velocity).toBe(0);
  });
  it('keeps position and velocity continuous across a stop with nonzero retained static friction', () => {
    const h = 1e-7,
      b = frictionMotion(4, 3, 1.5 - h),
      a = frictionMotion(4, 3, 1.5 + h);
    expect(a.position).toBeCloseTo(b.position, 10);
    expect(a.velocity).toBe(0);
    expect(b.velocity).toBeCloseTo(0, 5);
    expect(a.friction).toBe(-4);
    expect(a.acceleration).toBe(0);
  });
  it('reproduces no-air kinematics and remains stable as drag tends to zero', () => {
    expect(quadraticFall(1, 0, 0, 2)).toMatchObject({
      position: 20,
      velocity: 20,
      acceleration: 10,
      drag: 0,
      terminal: null,
    });
    for (const k of [1e-14, 1e-9]) {
      const m = quadraticFall(1, k, 3, 1);
      expect(m.position).toBeCloseTo(8, 6);
      expect(m.velocity).toBeCloseTo(13, 6);
    }
  });
  it('agrees with an independently integrated square-drag Newton equation for all terminal branches', () => {
    for (const [mass, k, u, t] of [
      [1, 0.1, 0, 2],
      [1, 0.4, 0, 1.5],
      [1, 0.4, 5, 1.5],
      [1, 0.4, 8, 1.5],
      [2, 0.4, 8, 2],
      [1, 0.05, 3, 2],
    ]) {
      const m = quadraticFall(mass!, k!, u!, t!),
        numeric = integratedFall(mass!, k!, u!, t!);
      expect(m.velocity).toBeCloseTo(numeric.v, 7);
      expect(m.position).toBeCloseTo(numeric.y, 7);
    }
  });
  it('uses weight minus drag, keeps motion downward and approaches balance from both sides', () => {
    const slow = quadraticFall(1, 0.4, 0, 1.5),
      fast = quadraticFall(1, 0.4, 8, 1.5),
      at = quadraticFall(1, 0.4, 5, 1.5);
    expect(slow.velocity).toBeLessThan(5);
    expect(slow.acceleration).toBeGreaterThan(0);
    expect(fast.velocity).toBeGreaterThan(5);
    expect(fast.acceleration).toBeLessThan(0);
    expect(fast.velocity).toBeGreaterThan(0);
    expect(at.velocity).toBe(5);
    expect(at.position).toBe(7.5);
    expect(at.acceleration).toBe(0);
    expect(quadraticFall(1, 0.4, 8, 0).acceleration).toBeCloseTo(-15.6);
  });
  it('retains the square-speed drag law and inverse-square-root balance scaling', () => {
    const one = quadraticFall(1, 0.1, 3, 0),
      two = quadraticFall(1, 0.1, 6, 0);
    expect(two.drag).toBe(4 * one.drag);
    expect(quadraticFall(1, 0.4, 0, 0).terminal).toBe(one.terminal! / 2);
    expect(quadraticFall(2, 0.1, 0, 0).terminal).toBeCloseTo(
      Math.sqrt(2) * one.terminal!,
    );
  });
  it('links fall distance derivatives to velocity and velocity derivatives to net force/mass, including near balance', () => {
    for (const u of [0, 5 - 1e-10, 5, 5 + 1e-10, 8])
      for (const t of [0.2, 0.7, 1.2]) {
        const m = quadraticFall(1, 0.4, u, t);
        expect(
          derivative((t) => quadraticFall(1, 0.4, u, t).position, t),
        ).toBeCloseTo(m.velocity, 6);
        expect(
          derivative((t) => quadraticFall(1, 0.4, u, t).velocity, t),
        ).toBeCloseTo(m.acceleration, 6);
      }
  });
  it('has opposite support sequences for upward and downward trips without changing mass or gravity', () => {
    expect([0.5, 2, 3.5].map((t) => elevatorMotion(0, 2, t).normal)).toEqual([
      24, 20, 16,
    ]);
    expect([0.5, 2, 3.5].map((t) => elevatorMotion(1, 2, t).normal)).toEqual([
      16, 20, 24,
    ]);
    const brake = elevatorMotion(0, 2, 3.5);
    expect(brake.velocity).toBe(1);
    expect(brake.acceleration).toBe(-2);
    expect(brake.weight).toBe(20);
  });
  it('preserves elevator position and velocity at all switching boundaries while final support returns to weight', () => {
    const h = 1e-7;
    for (const i of [0, 1])
      for (const t of [1, 3, 4]) {
        const b = elevatorMotion(i, 2, t - h),
          at = elevatorMotion(i, 2, t);
        expect(b.position).toBeCloseTo(at.position, 5);
        expect(b.velocity).toBeCloseTo(at.velocity, 5);
        if (t < 4) {
          const a = elevatorMotion(i, 2, t + h);
          expect(a.position).toBeCloseTo(at.position, 5);
          expect(a.velocity).toBeCloseTo(at.velocity, 5);
        }
      }
    expect(elevatorMotion(0, 2, 4)).toMatchObject({
      position: 16,
      velocity: 0,
      acceleration: 0,
      normal: 20,
    });
    expect(elevatorMotion(1, 2, 4).position).toBe(4);
    expect(elevatorMotion(2, 2, 4)).toMatchObject({
      position: 18,
      velocity: 2,
      acceleration: 0,
    });
  });
  it('scales support with mass at fixed motion and applies N-weight=ma in every segment', () => {
    for (let i = 0; i < 3; i++)
      for (const t of [0, 0.5, 1, 2, 3, 3.5, 4]) {
        const a = elevatorMotion(i, 1, t),
          b = elevatorMotion(i, 2, t);
        expect(b.normal).toBe(2 * a.normal);
        expect(b.position).toBe(a.position);
        expect(b.normal - b.weight).toBe(b.mass * b.acceleration);
      }
  });
  it('distinguishes driving, steady travel and braking by the full force sum', () => {
    const rows = [0, 1, 2].map((i) => vehicleMotion(i, 6, 2));
    expect(rows.map((m) => m.velocity)).toEqual([6, 4, 0]);
    expect(rows.map((m) => m.position)).toEqual([8, 8, 2]);
    expect(rows.map((m) => m.acceleration)).toEqual([2, 0, 0]);
    expect(vehicleMotion(2, 6, 0.5)).toMatchObject({
      traction: -6,
      resistance: -2,
      acceleration: -4,
      velocity: 2,
    });
  });
  it('caps the external tyre force and changes stopping distance at the same initial conditions', () => {
    const strong = vehicleMotion(2, 6, 2),
      weak = vehicleMotion(2, 2, 2);
    expect(strong.position).toBe(2);
    expect(weak.position).toBe(4);
    expect(weak.stopTime).toBe(2);
    expect(vehicleMotion(2, 2, 0.5).traction).toBe(-2);
    expect(vehicleMotion(0, 0, 2).velocity).toBe(0);
  });
  it('never reverses the car when brake/resistance stages reach zero speed', () => {
    for (let i = 0; i < 3; i++)
      for (const cap of [0, 1, 2, 4, 6])
        for (let j = 0; j <= 40; j++) {
          const m = vehicleMotion(i, cap, j / 20);
          expect(m.velocity).toBeGreaterThanOrEqual(0);
          if (m.state === 'stopped') {
            expect(m.acceleration).toBe(0);
            expect(m.traction + m.resistance).toBe(0);
          }
        }
  });
  it('retains expelled mass, remaining dry-mass bounds and instantaneous thrust response', () => {
    for (const q of [0, 0.25, 1, 2])
      for (const ve of [20, 40])
        for (const t of [0, 1, 2]) {
          const m = rocketMotion(q, ve, t);
          expect(m.mass + m.exhaustMass).toBe(10);
          expect(m.mass).toBeGreaterThanOrEqual(6);
          expect(m.thrust).toBe(q * ve);
          expect(m.acceleration * m.mass).toBeCloseTo(m.thrust, 12);
        }
    expect(rocketMotion(1, 20, 2)).toMatchObject({
      mass: 8,
      exhaustMass: 2,
      thrust: 20,
      acceleration: 2.5,
    });
    expect(rocketMotion(0, 20, 2)).toMatchObject({ velocity: 0, position: 0 });
  });
  it('differentiates rocket trajectories against v and T/current mass rather than initial mass', () => {
    for (const q of [0.25, 1, 2])
      for (const ve of [20, 40])
        for (const t of [0.25, 1, 1.75]) {
          const m = rocketMotion(q, ve, t);
          expect(
            derivative((t) => rocketMotion(q, ve, t).position, t),
          ).toBeCloseTo(m.velocity, 6);
          expect(
            derivative((t) => rocketMotion(q, ve, t).velocity, t),
          ).toBeCloseTo(m.thrust / m.mass, 6);
        }
    const m = rocketMotion(1, 20, 2);
    expect(m.velocity).toBeCloseTo(20 * Math.log(10 / 8), 10);
    expect(m.velocity).toBeGreaterThan(4);
  });
  it('keeps tiny-flow rocket displacement numerically stable and exhaust scaling independent of mass loss', () => {
    const q = 1e-10,
      t = 2,
      m = rocketMotion(q, 20, t);
    expect(m.position / ((((20 * q) / 10) * t * t) / 2)).toBeCloseTo(1, 8);
    const a = rocketMotion(1, 20, 2),
      b = rocketMotion(1, 40, 2);
    expect(b.mass).toBe(a.mass);
    expect(b.velocity).toBe(2 * a.velocity);
    expect(b.position).toBe(2 * a.position);
    expect(b.acceleration).toBe(2 * a.acceleration);
  });
  it('keeps every preset and free-control state in a shared position/velocity drawing domain with Fnet=ma', () => {
    for (const kind of dynamicsKinds) {
      const l = dynamicsLimits(kind);
      for (let i = 0; i < 3; i++)
        for (const value of [l.min, dynamicsDefault(kind, i), l.max])
          for (let j = 0; j <= 40; j++) {
            const m = dynamicsReading(kind, i, value, j / 40);
            expect(m.position).toBeGreaterThanOrEqual(-1e-10);
            expect(m.position).toBeLessThanOrEqual(30);
            expect(m.velocity).toBeGreaterThanOrEqual(-6);
            expect(m.velocity).toBeLessThanOrEqual(25);
            expect(m.net).toBeCloseTo(m.mass * m.acceleration, 10);
            expect(m.duration).toBe(dynamicsDuration(kind));
          }
    }
  });
  it('rejects invalid finite-domain inputs and invalid comparison indices', () => {
    for (const n of [NaN, Infinity, -Infinity, -1, 9])
      expect(() => frictionMotion(2, n, 1)).toThrow(RangeError);
    for (const kind of dynamicsKinds) {
      const l = dynamicsLimits(kind);
      for (const v of [NaN, Infinity, l.min - 1, l.max + 1])
        expect(() => dynamicsReading(kind, 0, v)).toThrow(RangeError);
      for (const i of [-1, 0.5, 3])
        expect(() => dynamicsReading(kind, i, l.min)).toThrow(RangeError);
      for (const p of [-0.1, 1.1, NaN])
        expect(() => dynamicsReading(kind, 0, l.min, p)).toThrow(RangeError);
    }
    expect(() => rocketMotion(3, 20, 1)).toThrow(RangeError);
    expect(() => elevatorMotion(0, 2, 5)).toThrow(RangeError);
    expect(() => quadraticFall(0, 0.1, 0, 1)).toThrow(RangeError);
  });
  it('registers complete bilingual force-application courses after the preserved Newton foundations', () => {
    expect(lessons.slice(160, 166)).toEqual(newtonLessons);
    expect(lessons.slice(166, 172)).toEqual(dynamicsLessons);
    expect(dynamicsLessons.map((l) => l.kind)).toEqual(
      dynamicsKinds.map((k) => `dynamics-${k}`),
    );
    for (const l of dynamicsLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('newton');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('dynamics');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      for (const field of [
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
        expect(l[field].zh.length).toBeGreaterThan(12);
        expect(l[field].en.length).toBeGreaterThan(25);
      }
      expect(l.vocabulary).toHaveLength(4);
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
  it('keeps bilingual full-observation records explicit and preserves earlier saved mastery', () => {
    for (const k of dynamicsKinds)
      for (let i = 0; i < 3; i++) {
        const row = dynamicsRecord(k, i);
        expect(
          row.every(
            (s) => s.length > 25 && s.includes('N') && s.includes('m/s'),
          ),
        ).toBe(true);
      }
    const old = newtonLessons[5]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 12345,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: saved } })).lessons[
        old.id
      ]?.completedAt,
    ).toBe(12345);
    for (const l of dynamicsLessons) {
      const p = {
        ...saved,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, p)).toBe(true);
      expect(isMastered(l.id, { ...p, explored: false })).toBe(false);
      expect(isMastered(l.id, { ...p, answers: { ...p.answers, 3: 1 } })).toBe(
        false,
      );
    }
  });
});
