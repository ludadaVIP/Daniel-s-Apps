import { describe, it, expect } from 'vitest';
import {
  collisionMotion,
  separationMotion,
  stoppingMotion,
  pulse,
  momentumKinds,
  momentumReading,
  momentumDefault,
  momentumLimits,
  momentumRecord,
} from './momentumModels';
import { momentumLessons } from '../content/momentum';
import { dynamicsLessons } from '../content/dynamics';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
const derivative = (f: (t: number) => number, t: number) => {
  const h = 1e-5;
  return (f(t + h) - f(t - h)) / (2 * h);
};
const integrate = (f: (t: number) => number, a: number, b: number) => {
  const n = 10000,
    h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * h) * h;
  return sum;
};
describe('momentum is a signed system ledger, with continuous force-driven motion', () => {
  it('distinguishes equal speed, unequal mass and reversed direction', () => {
    expect(
      [0, 1, 2].map(
        (i) =>
          momentumReading('quantity', i, momentumDefault('quantity', i), 1).pA,
      ),
    ).toEqual([2, 4, -2]);
    expect(momentumReading('quantity', 1, 0, 1).total).toBe(0);
    const a = momentumReading('quantity', 0, 2, 1),
      b = momentumReading('quantity', 0, 4, 1);
    expect(b.pA / a.pA).toBe(2);
    expect(b.energy / a.energy).toBe(4);
  });
  it('conserves total momentum throughout internal collision for every mass and restitution', () => {
    for (const mB of [2, 3, 4])
      for (const e of [0, 0.5, 1])
        for (const t of [0, 0.5, 1, 1.2, 1.3, 1.6, 2, 3]) {
          const m = collisionMotion(mB, e, 0, t);
          expect(m.total).toBeCloseTo(8, 12);
          expect(m.forceA + m.forceB).toBeCloseTo(0, 12);
        }
  });
  it('adds external impulse without deleting internal exchange', () => {
    for (const t of [0, 0.5, 1.2, 1.6, 3])
      for (const mB of [2, 4]) {
        const m = collisionMotion(mB, 0, 2, t);
        expect(m.total - m.initial).toBeCloseTo(2 * t, 12);
        expect(m.forceA + m.forceB).toBeCloseTo(2, 12);
      }
    expect(collisionMotion(2, 0, 2, 3).vA).toBe(3.5);
  });
  it('obtains common velocities from the full-system mass when carts stick', () => {
    expect(collisionMotion(2, 0, 0, 3).vA).toBe(2);
    const m = collisionMotion(4, 0, 0, 3);
    expect(m.vA).toBeCloseTo(4 / 3, 12);
    expect(m.vB).toBeCloseTo(4 / 3, 12);
  });
  it('reproduces elastic, partial and sticky outcomes with distinct energy ledgers', () => {
    for (const [e, a, b, K] of [
      [1, 0, 4, 16],
      [0.5, 1, 3, 10],
      [0, 2, 2, 8],
    ]) {
      const m = collisionMotion(2, e!, 0, 3);
      expect(m.vA).toBe(a);
      expect(m.vB).toBe(b);
      expect(m.energy).toBe(K);
      expect(m.finalEnergy).toBe(K);
    }
  });
  it('checks energy loss using the independent reduced-mass identity', () => {
    for (const mB of [2, 3, 4])
      for (const e of [0, 0.2, 0.5, 1]) {
        const m = collisionMotion(mB, e, 0, 3),
          mu = (2 * mB) / (2 + mB);
        expect(m.initialEnergy - m.energy).toBeCloseTo(
          0.5 * mu * 16 * (1 - e * e),
          12,
        );
      }
  });
  it('keeps position and velocity continuous at both collision boundaries', () => {
    for (const t of [1, 1.6])
      for (const e of [0, 0.5, 1]) {
        const a = collisionMotion(4, e, 2, t - 1e-8),
          b = collisionMotion(4, e, 2, t + 1e-8);
        expect(a.xA).toBeCloseTo(b.xA, 6);
        expect(a.xB).toBeCloseTo(b.xB, 6);
        expect(a.vA).toBeCloseTo(b.vA, 6);
        expect(a.vB).toBeCloseTo(b.vB, 6);
      }
  });
  it('differentiates both cart paths and momenta against the actual external and internal forces', () => {
    for (const mB of [2, 4])
      for (const e of [0, 0.5, 1])
        for (const t of [0.5, 1.2, 1.4, 2]) {
          const f = (s: number) => collisionMotion(mB, e, 2, s),
            m = f(t);
          expect(derivative((s) => f(s).xA, t)).toBeCloseTo(m.vA, 7);
          expect(derivative((s) => f(s).xB, t)).toBeCloseTo(m.vB, 7);
          expect(derivative((s) => f(s).pA, t)).toBeCloseTo(m.forceA, 6);
          expect(derivative((s) => f(s).pB, t)).toBeCloseTo(m.forceB, 6);
        }
  });
  it('integrates a finite contact force independently to the delivered impulse', () => {
    const m = collisionMotion(4, 0.5, 0, 3);
    expect(
      integrate((t) => collisionMotion(4, 0.5, 0, t).forceA, 1, 1.6),
    ).toBeCloseTo(m.internalImpulse, 6);
  });
  it('allows temporary elastic kinetic-energy storage without labelling it a final loss', () => {
    expect(collisionMotion(2, 1, 0, 1.3).energy).toBeCloseTo(8, 12);
    expect(collisionMotion(2, 1, 0, 3).energy).toBe(16);
  });
  it('separates unequal masses with opposite momentum and inverse-mass velocity change', () => {
    const m = separationMotion(4, 0, 4, 2);
    expect(m.vA).toBe(-2);
    expect(m.vB).toBe(1);
    expect(m.pA).toBe(-4);
    expect(m.pB).toBe(4);
    expect(m.total).toBe(0);
    expect(m.energy).toBe(6);
  });
  it('preserves a nonzero moving-system total and accounts for released energy', () => {
    const m = separationMotion(2, 1, 4, 2);
    expect(m.vA).toBe(-1);
    expect(m.vB).toBe(3);
    expect(m.total).toBe(4);
    expect(m.initialEnergy).toBe(2);
    expect(m.energy).toBe(10);
    for (const t of [0, 0.1, 0.5, 1, 2])
      expect(separationMotion(4, 1, 6, t).total).toBeCloseTo(6, 12);
  });
  it('does not create a release at zero impulse and uses one model for position, velocity and force', () => {
    const zero = separationMotion(4, 1, 0, 2);
    expect(zero.vA).toBe(1);
    expect(zero.vB).toBe(1);
    expect(zero.energy).toBe(zero.initialEnergy);
    for (const t of [0.2, 0.6, 1.5]) {
      const f = (s: number) => separationMotion(4, 1, 6, s),
        m = f(t);
      expect(derivative((s) => f(s).xA, t)).toBeCloseTo(m.vA, 7);
      expect(derivative((s) => f(s).xB, t)).toBeCloseTo(m.vB, 7);
      expect(derivative((s) => f(s).pA, t)).toBeCloseTo(m.forceA, 6);
    }
  });
  it('matches force–time areas to the same momentum change for both force shapes', () => {
    for (const shape of ['rectangle', 'triangle'] as const)
      for (const T of [0.1, 0.2, 0.5, 1]) {
        const m = stoppingMotion(0.5, T, shape, 1);
        expect(m.impulse).toBe(-2);
        expect(m.momentum).toBe(0);
        expect(
          integrate((t) => stoppingMotion(0.5, T, shape, t).force, 0, T),
        ).toBeCloseTo(-2, 6);
      }
  });
  it('distinguishes peak from mean and duration from impulse', () => {
    const a = stoppingMotion(0.5, 0.2, 'rectangle', 1),
      b = stoppingMotion(0.5, 0.2, 'triangle', 1),
      c = stoppingMotion(0.5, 0.8, 'triangle', 1);
    expect(a.average).toBe(-10);
    expect(a.peak).toBe(10);
    expect(b.average).toBe(-10);
    expect(b.peak).toBe(20);
    expect(c.average).toBe(-2.5);
    expect(c.peak).toBe(5);
  });
  it('integrates velocity for both stop shapes and holds position without reversal after rest', () => {
    for (const shape of ['rectangle', 'triangle'] as const)
      for (const T of [0.1, 0.4, 0.8]) {
        const at = stoppingMotion(1, T, shape, T),
          after = stoppingMotion(1, T, shape, 1);
        expect(at.position).toBeCloseTo(2 * T, 12);
        expect(after.position).toBe(at.position);
        expect(after.velocity).toBe(0);
        expect(after.force).toBe(0);
        expect(
          integrate((t) => stoppingMotion(1, T, shape, t).velocity, 0, T),
        ).toBeCloseTo(at.position, 6);
        for (const t of [T * 0.2, T * 0.7]) {
          const f = (s: number) => stoppingMotion(1, T, shape, s),
            m = f(t);
          expect(derivative((s) => f(s).position, t)).toBeCloseTo(
            m.velocity,
            6,
          );
          expect(derivative((s) => f(s).momentum, t)).toBeCloseTo(m.force, 5);
        }
      }
  });
  it('increases required stopping distance when fixed momentum change is spread over more time', () => {
    const a = stoppingMotion(1, 0.1, 'rectangle', 1),
      b = stoppingMotion(1, 0.4, 'rectangle', 1),
      c = stoppingMotion(1, 0.8, 'rectangle', 1);
    expect([a.average, b.average, c.average]).toEqual([-40, -10, -5]);
    expect([a.distance, b.distance, c.distance]).toEqual([0.2, 0.8, 1.6]);
    expect([a.impulse, b.impulse, c.impulse]).toEqual([-4, -4, -4]);
  });
  it('checks cumulative pulse derivatives and symmetry independently', () => {
    for (const shape of ['rectangle', 'triangle', 'cosine'] as const) {
      expect(pulse(shape, 1).fraction).toBe(1);
      expect(pulse(shape, 1).integral).toBeCloseTo(0.5, 12);
      for (const s of [0.1, 0.3, 0.7, 0.9]) {
        expect(derivative((t) => pulse(shape, t).integral, s)).toBeCloseTo(
          pulse(shape, s).fraction,
          8,
        );
        expect(derivative((t) => pulse(shape, t).fraction, s)).toBeCloseTo(
          pulse(shape, s).density,
          8,
        );
      }
    }
  });
  it('keeps all permitted paths and force/energy/momentum drawings inside their shared domains', () => {
    for (const k of momentumKinds)
      for (let i = 0; i < 3; i++)
        for (const value of [
          momentumLimits[k].min,
          momentumDefault(k, i),
          momentumLimits[k].max,
        ])
          for (let step = 0; step <= 120; step++) {
            const m = momentumReading(k, i, value, step / 120);
            expect(m.xA).toBeGreaterThanOrEqual(0);
            expect(m.xA).toBeLessThanOrEqual(24);
            if (m.pair) {
              expect(m.xB).toBeGreaterThanOrEqual(0);
              expect(m.xB).toBeLessThanOrEqual(24);
              expect(m.xB).toBeGreaterThan(m.xA);
            }
            for (const p of [m.pA, m.pB, m.total])
              expect(Math.abs(p)).toBeLessThanOrEqual(20.00000001);
            expect(m.energy).toBeGreaterThanOrEqual(0);
            expect(m.energy).toBeLessThanOrEqual(60);
            expect(m.finalEnergy).toBeLessThanOrEqual(60);
            if (!m.pair) expect(m.force).toBeGreaterThanOrEqual(-50);
          }
  });
  it('rejects invalid range values, nonfinite values, comparison indices and progress', () => {
    for (const k of momentumKinds)
      for (const n of [
        NaN,
        Infinity,
        -Infinity,
        momentumLimits[k].min - 1,
        momentumLimits[k].max + 1,
      ])
        expect(() => momentumReading(k, 0, n, 0)).toThrow();
    for (const n of [-1, 0.5, 3, NaN])
      expect(() => momentumDefault('quantity', n)).toThrow();
    for (const p of [-0.1, 1.1, NaN])
      expect(() => momentumReading('quantity', 0, 2, p)).toThrow();
  });
  it('registers complete bilingual courses after all existing IDs and supplies comparison records', () => {
    expect(lessons.slice(166, 172)).toEqual(dynamicsLessons);
    expect(lessons.slice(172, 178)).toEqual(momentumLessons);
    expect(momentumLessons.map((l) => l.kind)).toEqual(
      momentumKinds.map((k) => `momentum-${k}`),
    );
    for (const l of momentumLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('momentum');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('momentum');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      for (const f of [
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
        expect(l[f].zh.length).toBeGreaterThan(12);
        expect(l[f].en.length).toBeGreaterThan(25);
      }
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      for (const q of [...l.questions, l.exit])
        expect(q.options[q.correct]).toBeDefined();
    }
    for (const k of momentumKinds)
      for (let i = 0; i < 3; i++)
        for (const s of momentumRecord(k, i)) {
          expect(s).toContain('kg·m/s');
          expect(s).toContain('N·s');
        }
  });
  it('preserves older saved mastery and requires exploration and all answers for each new course', () => {
    const old = dynamicsLessons[5]!,
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
    for (const l of momentumLessons) {
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
