import { gravitationLessons } from '../content/gravitation';
import { circularLessons } from '../content/circular';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
import { describe, expect, it } from 'vitest';
import {
  attractingPair,
  ellipseOrbit,
  radialLaunch,
  gravitationReading,
  gravitationKinds,
  gravitationDefault,
  gravitationLimits,
  GRAVITY_G,
  type GravitationKind,
} from './gravitationModels';
const read = (
  k: GravitationKind,
  i: number,
  p = 1,
  v = gravitationDefault(k, i),
) => gravitationReading(k, i, v, p);
const derivative = (f: (t: number) => number, t: number, h = 1e-5) =>
  (f(t + h) - f(t - h)) / (2 * h);
const integral = (f: (t: number) => number, end: number, n = 4000) => {
  let s = f(0) + f(end);
  for (let j = 1; j < n; j++) s += (j % 2 ? 4 : 2) * f((end * j) / n);
  return (s * end) / (3 * n);
};
/** Independent Cartesian RK4 integrator, not anomaly/time inversion. */
function rk4(
  start: number[],
  duration: number,
  steps: number,
  rhs: (s: number[]) => number[],
) {
  let state = [...start];
  const dt = duration / steps;
  for (let j = 0; j < steps; j++) {
    const k1 = rhs(state),
      k2 = rhs(state.map((x, i) => x + (dt * k1[i]!) / 2)),
      k3 = rhs(state.map((x, i) => x + (dt * k2[i]!) / 2)),
      k4 = rhs(state.map((x, i) => x + dt * k3[i]!));
    state = state.map(
      (x, i) => x + (dt * (k1[i]! + 2 * k2[i]! + 2 * k3[i]! + k4[i]!)) / 6,
    );
  }
  return state;
}
describe('gravitation connects actual interactions, field and motion', () => {
  it('uses SI gravity and equal opposite forces but mass-dependent accelerations', () => {
    const q = attractingPair(1000, 4000, 0);
    expect(q.force).toBeCloseTo((GRAVITY_G * 1000 * 4000) / 4, 14);
    expect(q.aA / -q.aB).toBeCloseTo(4, 12);
    expect(q.xB - q.xA).toBe(2);
  });
  it('preserves pair momentum, mass centre and mechanical energy throughout free fall', () => {
    for (const b of [500, 1000, 2000, 4000])
      for (const t of [0, 100, 1200, 2000]) {
        const q = attractingPair(1000, b, t);
        expect(1000 * q.xA + b * q.xB).toBeCloseTo(0, 9);
        expect(1000 * q.vA + b * q.vB).toBeCloseTo(0, 10);
        expect(q.kinetic + q.potential).toBeCloseTo(
          (-GRAVITY_G * 1000 * b) / 2,
          12,
        );
        expect(q.r).toBeGreaterThan(0.2);
      }
  });
  it('differentiates pair positions and velocities on the very slow physical clock', () => {
    const q = attractingPair(1000, 4000, 1000),
      f = (t: number) => attractingPair(1000, 4000, t);
    expect(derivative((t) => f(t).xA, 1000, 0.01)).toBeCloseTo(q.vA, 10);
    expect(derivative((t) => f(t).vA, 1000, 0.01)).toBeCloseTo(q.aA, 12);
    expect(derivative((t) => f(t).vB, 1000, 0.01)).toBeCloseTo(q.aB, 12);
  });
  it('matches an independently integrated two-body relative fall', () => {
    for (const b of [500, 4000]) {
      const mu = GRAVITY_G * (1000 + b),
        s = rk4([2, 0], 2000, 2000, ([r, v]) => [v!, -mu / r! ** 2]),
        q = attractingPair(1000, b, 2000);
      expect(q.r).toBeCloseTo(s[0]!, 10);
      expect(q.vB - q.vA).toBeCloseTo(s[1]!, 12);
    }
  });
  it('doubles source mass but quarters force when centre distance doubles', () => {
    expect([0, 1, 2].map((i) => read('inverse', i).force)).toEqual([2, 4, 0.5]);
    expect(read('inverse', 2).r).toBe(4);
  });
  it('keeps g independent of test mass and scales actual force with that mass', () => {
    const a = read('field', 0),
      b = read('field', 1),
      c = read('field', 2);
    expect(a.g).toBe(b.g);
    expect(b.force).toBe(2 * a.force);
    expect(c.g).toBe(2 * a.g);
    for (const m of [0.5, 3])
      expect(read('field', 0, 0.3, m).force / m).toBe(2);
  });
  it('does not confuse apparatus acceleration with free-field g', () => {
    const q = read('field', 0, 0.4);
    expect(Math.hypot(q.ax, q.ay)).toBeCloseTo(Math.PI ** 2 / 32, 12);
    expect(Math.hypot(q.ax, q.ay)).toBeLessThan(q.g);
    expect(read('inverse', 2, 0.4).ax).toBe(0);
  });
  it('uses R+h and separates universal G from local field strength', () => {
    expect([0, 1, 2].map((i) => read('g', i).g)).toEqual([8, 16, 2]);
    expect(read('g', 0, 1, 3).g).toBe(0.5);
    expect(GRAVITY_G).toBe(6.67e-11);
  });
  it('matches the circular member while other tangent speeds make ellipses', () => {
    const q = ellipseOrbit(1, 1);
    expect(q.e).toBe(0);
    expect(q.r).toBeCloseTo(2, 12);
    expect(q.x).toBeCloseTo(2 * Math.cos(1), 12);
    expect(q.y).toBeCloseTo(2 * Math.sin(1), 12);
    expect(ellipseOrbit(0.85, 0).e).toBeGreaterThan(0);
    expect(ellipseOrbit(1.2, 0).e).toBeGreaterThan(0);
  });
  it('keeps the start position fixed and the actual tangent speed selectable', () => {
    for (const f of [0.85, 1, 1.25]) {
      const q = ellipseOrbit(f, 0);
      expect(q.x).toBeCloseTo(2, 12);
      expect(q.y).toBeCloseTo(0, 12);
      expect(q.vx).toBeCloseTo(0, 12);
      expect(q.vy).toBeCloseTo(2 * f, 12);
      expect(q.peri).toBeGreaterThan(1);
    }
  });
  it('differentiates Kepler positions and velocities under central inverse-square force', () => {
    for (const f of [0.85, 1, 1.25])
      for (const t of [0.2, 1.5, 3.8]) {
        const q = ellipseOrbit(f, t),
          model = (s: number) => ellipseOrbit(f, s);
        for (const [position, velocity, acceleration] of [
          ['x', 'vx', 'ax'],
          ['y', 'vy', 'ay'],
        ] as const) {
          expect(derivative((s) => model(s)[position], t)).toBeCloseTo(
            q[velocity],
            7,
          );
          expect(derivative((s) => model(s)[velocity], t)).toBeCloseTo(
            q[acceleration],
            7,
          );
        }
      }
  });
  it('preserves orbital energy, angular momentum and equal area per unit time', () => {
    for (const f of [0.85, 1.2, 1.25])
      for (const t of [0, 1, 2, 4]) {
        const q = ellipseOrbit(f, t);
        expect((q.vx * q.vx + q.vy * q.vy) / 2 - 8 / q.r).toBeCloseTo(
          q.energy,
          10,
        );
        expect(q.x * q.vy - q.y * q.vx).toBeCloseTo(4 * f, 10);
        expect(q.r).toBeGreaterThanOrEqual(q.peri - 1e-12);
        expect(q.r).toBeLessThanOrEqual(q.apo + 1e-12);
      }
  });
  it('matches independent Cartesian integration for low and high initial speeds', () => {
    for (const f of [0.85, 1.25]) {
      const s = rk4([2, 0, 0, 2 * f], 4, 4000, ([x, y, vx, vy]) => {
          const r = Math.hypot(x!, y!);
          return [vx!, vy!, (-8 * x!) / r ** 3, (-8 * y!) / r ** 3];
        }),
        q = ellipseOrbit(f, 4);
      for (const [j, key] of ['x', 'y', 'vx', 'vy'].entries())
        expect(q[key as 'x' | 'y' | 'vx' | 'vy']).toBeCloseTo(s[j]!, 8);
    }
  });
  it('only keeps ground longitude when satellite angular speed matches body rotation', () => {
    const low = read('satellite', 0),
      sync = read('satellite', 1),
      high = read('satellite', 2);
    expect(sync.relativeAngle).toBe(0);
    expect(sync.period).toBe(2 * Math.PI);
    expect(low.relativeAngle).toBeGreaterThan(0);
    expect(high.relativeAngle).toBeLessThan(0);
    expect(low.period).toBeLessThan(sync.period);
    expect(high.period).toBeGreaterThan(sync.period);
  });
  it('satisfies Kepler period scaling for circular satellite radii', () => {
    const a = read('satellite', 0),
      b = read('satellite', 2);
    expect((b.period / a.period) ** 2).toBeCloseTo((b.r / a.r) ** 3, 12);
    expect((a.speed * a.speed) / a.r).toBeCloseTo(a.g, 12);
  });
  it('classifies bound, critical and escaping launches by total energy', () => {
    const a = radialLaunch(1.5, 0),
      b = radialLaunch(Math.sqrt(8), 0),
      c = radialLaunch(3.5, 0);
    expect(a.energy).toBe(-2.875);
    expect(b.energy).toBeCloseTo(0, 12);
    expect(c.energy).toBe(2.125);
    expect(c.asymptoticSpeed).toBeCloseTo(Math.sqrt(4.25), 12);
  });
  it('does not call every outward-moving probe an escape', () => {
    const q = radialLaunch(2.75, 8);
    expect(q.v).toBeGreaterThan(0);
    expect(q.energy).toBeLessThan(0);
    expect(q.turnRadius).toBeGreaterThan(q.r);
  });
  it('models a bound return and ends at first surface contact before impact', () => {
    const q = radialLaunch(1.5, 8);
    expect(q.duration).toBeLessThan(8);
    expect(q.contact).toBe(true);
    expect(q.r).toBe(1);
    expect(q.v).toBeLessThan(0);
    expect((q.v * q.v) / 2 - 8).toBeCloseTo(q.energy, 10);
    expect(q.time).toBe(q.duration);
  });
  it('matches the exact parabolic radial time law and keeps inward gravity at escape', () => {
    const t = 8,
      q = radialLaunch(Math.sqrt(8), t);
    expect(q.r).toBeCloseTo((2 ** 1.5 + 6 * t) ** (2 / 3), 10);
    expect(q.v).toBeGreaterThan(0);
    expect(q.v).toBeLessThan(Math.sqrt(8));
    expect(q.acceleration).toBeLessThan(0);
    expect(q.kinetic + q.potential).toBeCloseTo(0, 10);
  });
  it('differentiates all radial branches before impact and preserves energy', () => {
    for (const v of [1.5, 2.75, Math.sqrt(8), 3, 3.5])
      for (const t of [0.1, 0.5, 1]) {
        const q = radialLaunch(v, t),
          f = (s: number) => radialLaunch(v, s);
        expect(derivative((s) => f(s).r, t)).toBeCloseTo(q.v, 6);
        expect(derivative((s) => f(s).v, t)).toBeCloseTo(q.acceleration, 6);
        expect(q.kinetic + q.potential).toBeCloseTo(q.energy, 9);
      }
  });
  it('matches independent radial RK4 across bound, threshold and hyperbolic branches', () => {
    for (const v of [1.5, Math.sqrt(8), 3.5]) {
      const t = v === 1.5 ? 2 : 8,
        s = rk4([2, v], t, 4000, ([r, v]) => [v!, -8 / r! ** 2]),
        q = radialLaunch(v, t);
      expect(q.r).toBeCloseTo(s[0]!, 8);
      expect(q.v).toBeCloseTo(s[1]!, 8);
    }
  });
  it('integrates gravity work to kinetic change for returning and escaping probes', () => {
    for (const v of [1.5, Math.sqrt(8), 3.5]) {
      const end = v === 1.5 ? 2 : 8,
        q = radialLaunch(v, end),
        w = integral((t) => {
          const q = radialLaunch(v, t);
          return q.acceleration * q.v;
        }, end);
      expect(w).toBeCloseTo(q.kinetic - (v * v) / 2, 6);
    }
  });
  it('separates nonzero gravity from zero scale normal in drop and orbit', () => {
    const a = read('weightless', 0),
      b = read('weightless', 1),
      c = read('weightless', 2);
    expect(a.normal).toBe(20);
    expect(a.ay).toBe(0);
    expect(b.normal).toBe(0);
    expect(b.force).toBe(20);
    expect(b.ay).toBe(-10);
    expect(c.normal).toBe(0);
    expect(c.force).toBe(4);
    expect(Math.hypot(c.ax, c.ay)).toBeCloseTo(2, 12);
  });
  it('does not remove mass or double the free acceleration of a heavier passenger', () => {
    for (const i of [0, 1, 2]) {
      const a = read('weightless', i, 0.5, 1),
        b = read('weightless', i, 0.5, 4);
      expect(b.mass).toBe(4);
      expect(b.force).toBe(4 * a.force);
      expect(b.ax).toBe(a.ax);
      expect(b.ay).toBe(a.ay);
      expect(b.x).toBe(a.x);
      expect(b.y).toBe(a.y);
    }
  });
  it('keeps all preset/free endpoints finite and within declared model windows', () => {
    for (const k of gravitationKinds)
      for (const i of [0, 1, 2])
        for (const v of [
          gravitationDefault(k, i),
          gravitationLimits[k].min,
          gravitationLimits[k].max,
        ])
          for (const p of [0, 0.5, 1]) {
            const q = read(k, i, p, v);
            for (const x of Object.values(q))
              if (typeof x === 'number') expect(Number.isFinite(x)).toBe(true);
            expect(q.time).toBeLessThanOrEqual(q.duration);
            if (k === 'orbit') expect(q.r).toBeGreaterThan(1);
          }
  });
  it('rejects nonfinite inputs and unsupported domains instead of drawing invented motion', () => {
    for (const k of gravitationKinds) {
      for (const i of [-1, 0.5, 3])
        expect(() => read(k, i)).toThrow(RangeError);
      for (const p of [NaN, Infinity, -0.1, 1.1])
        expect(() => read(k, 0, p)).toThrow(RangeError);
      for (const v of [
        NaN,
        Infinity,
        gravitationLimits[k].min - 1,
        gravitationLimits[k].max + 1,
      ])
        expect(() => read(k, 0, 1, v)).toThrow(RangeError);
    }
    expect(() => ellipseOrbit(0.5, 1)).toThrow();
    expect(() => radialLaunch(0, 1)).toThrow();
    expect(() => attractingPair(1000, 1000, 3000)).toThrow();
  });
});

describe('eight gravitation courses retain bilingual learning and old progress', () => {
  it('appends eight courses after circular motion and registers one station each', () => {
    const start = lessons.findIndex((l) => l.id === gravitationLessons[0]!.id);
    expect(lessons.slice(start - 7, start).map((l) => l.id)).toEqual(
      circularLessons.map((l) => l.id),
    );
    expect(gravitationLessons.map((l) => l.kind)).toEqual(
      gravitationKinds.map((k) => 'gravitation-' + k),
    );
    for (const l of gravitationLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('gravitation');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe(
        'gravitation',
      );
      expect(experiments.filter((x) => x.id === l.kind)).toHaveLength(1);
    }
  });
  it('provides complete original bilingual explanations, home investigations and varied checks', () => {
    for (const l of gravitationLessons) {
      for (const key of [
        'title',
        'subtitle',
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
        expect(l[key]!.zh).toMatch(/[\u4e00-\u9fff]/);
        expect(l[key]!.en).toMatch(/[A-Za-z]/);
      }
      expect(l.vocabulary).toHaveLength(4);
      expect(l.predictions).toHaveLength(3);
      expect(l.questions).toHaveLength(3);
      expect(new Set(l.questions.map((q) => q.correct)).size).toBe(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options).toHaveLength(3);
        expect(q.explanation.zh.length).toBeGreaterThan(5);
        expect(q.explanation.en.length).toBeGreaterThan(15);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(3);
      }
    }
  });
  it('requires exploration, correct practice and exit while preserving previous completion', () => {
    const old = circularLessons[6]!,
      state = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        step: 4,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 12345,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: state } })).lessons[
        old.id
      ]?.completedAt,
    ).toBe(12345);
    for (const l of gravitationLessons) {
      const done = {
        ...state,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, done)).toBe(true);
      expect(isMastered(l.id, { ...done, explored: false })).toBe(false);
      expect(
        isMastered(l.id, { ...done, answers: { ...done.answers, 3: 1 } }),
      ).toBe(false);
    }
  });
});
