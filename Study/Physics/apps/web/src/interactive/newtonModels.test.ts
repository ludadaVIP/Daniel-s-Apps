import { describe, it, expect } from 'vitest';
import {
  forceResponse,
  interaction,
  newtonKinds,
  newtonDefault,
  newtonLimits,
  newtonReading,
  newtonRecord,
  forceCards,
  checkForceDiagram,
} from './newtonModels';
import { newtonLessons } from '../content/newton';
import { trajectoryLessons } from '../content/trajectories';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { units } from '../content/curriculum';
import { decodeProgress, freshLesson, isMastered } from '../progress';
describe('Newton laws connect interactions, target boundaries and motion', () => {
  it('keeps rest and both velocity directions when net force is zero', () => {
    const rows = [0, 1, 2].map((i) =>
      newtonReading('inertia', i, newtonDefault('inertia', i)),
    );
    expect(rows.map((m) => m.net)).toEqual([0, 0, 0]);
    expect(rows.map((m) => m.velocity)).toEqual([0, 2, -2]);
    expect(rows.map((m) => m.position)).toEqual([10, 16, 4]);
    expect(rows[2]!.config.right).toBe(4);
    expect(rows[2]!.config.left).toBe(-4);
  });
  it('adds all signed interactions before computing acceleration', () => {
    const rows = [0, 1, 2].map((i) =>
      newtonReading('net', i, newtonDefault('net', i)),
    );
    expect(rows.map((m) => m.net)).toEqual([0, 4, -4]);
    expect(rows.map((m) => m.acceleration)).toEqual([0, 2, -2]);
    expect(rows.map((m) => m.velocity)).toEqual([1, 5, -3]);
    expect(forceResponse(2, [6, -2], 1, 2)).toEqual(
      forceResponse(2, [2, 4, -2], 1, 2),
    );
  });
  it('slows a right-moving cart then reverses it continuously under left net force', () => {
    const at = newtonReading('net', 2, 6, 0.25),
      after = newtonReading('net', 2, 6, 0.5);
    expect(at.time).toBe(0.5);
    expect(at.velocity).toBe(0);
    expect(at.position).toBe(5.25);
    expect(at.acceleration).toBe(-2);
    expect(after.velocity).toBe(-1);
    expect(after.position).toBe(5);
  });
  it('doubles acceleration at fixed mass without generally doubling final velocity', () => {
    const a = forceResponse(2, [2], 3, 2),
      b = forceResponse(2, [4], 3, 2);
    expect(b.acceleration).toBe(2 * a.acceleration);
    expect([a.velocity, b.velocity]).toEqual([5, 7]);
    expect(b.velocity).not.toBe(2 * a.velocity);
  });
  it('uses an inverse mass relation under matching force and keeps ma fixed', () => {
    const rows = [0, 1, 2].map((i) =>
      newtonReading('mass', i, newtonDefault('mass', i)),
    );
    expect(rows.map((m) => m.acceleration)).toEqual([4, 2, 1]);
    expect(rows.map((m) => m.velocity)).toEqual([8, 4, 2]);
    expect(rows.map((m) => m.position)).toEqual([9, 5, 3]);
    rows.forEach((m) => expect(m.mass * m.acceleration).toBe(4));
  });
  it('links position and velocity derivatives to Fnet/m across the allowed force cases', () => {
    const h = 1e-5;
    for (const mass of [1, 2, 4])
      for (const forces of [[0], [2], [6, -2], [2, -6]])
        for (const t of [0.5, 1, 1.5]) {
          const m = forceResponse(mass, forces, 1, t),
            b = forceResponse(mass, forces, 1, t - h),
            a = forceResponse(mass, forces, 1, t + h);
          expect((a.position - b.position) / (2 * h)).toBeCloseTo(
            m.velocity,
            7,
          );
          expect((a.velocity - b.velocity) / (2 * h)).toBeCloseTo(
            m.net / mass,
            7,
          );
        }
  });
  it('requires exactly the external forces on the named target, excluding outgoing/internal/ma cards', () => {
    for (let i = 0; i < 3; i++) {
      const cards = forceCards(i),
        expected = cards.filter((c) => c.external).map((c) => c.id);
      expect(checkForceDiagram(i, expected)).toBe(true);
      expect(checkForceDiagram(i, [...expected].reverse())).toBe(true);
      expect(checkForceDiagram(i, [])).toBe(false);
      expect(checkForceDiagram(i, expected.slice(1))).toBe(false);
      expect(checkForceDiagram(i, [...expected, 'acceleration'])).toBe(false);
      expect(checkForceDiagram(i, [...expected, expected[0]!])).toBe(false);
      for (const card of cards.filter((c) => !c.external))
        expect(checkForceDiagram(i, [...expected, card.id])).toBe(false);
    }
  });
  it('agrees with the vector sum of valid diagrams in each coordinate', () => {
    for (let i = 0; i < 3; i++) {
      const cards = forceCards(i).filter((c) => c.external),
        x = cards
          .filter((c) => c.axis === 'x')
          .reduce((a, b) => a + b.value, 0),
        y = cards
          .filter((c) => c.axis === 'y')
          .reduce((a, b) => a + b.value, 0),
        m = newtonReading('diagram', i, 4);
      expect(x).toBe(m.net);
      expect(y).toBe(0);
      expect(m.acceleration).toBe(x / m.mass);
    }
    expect(
      [0, 1, 2].map((i) => newtonReading('diagram', i, 4).acceleration),
    ).toEqual([3, 0, 1.5]);
  });
  it('has balanced friction only for the prescribed already-sliding cart', () => {
    const m = newtonReading('diagram', 1, 4);
    expect(m.velocity).toBe(2);
    expect(m.acceleration).toBe(0);
    expect(m.position).toBe(5);
    expect(forceCards(1).find((c) => c.id === 'friction')).toMatchObject({
      external: true,
      value: -6,
      axis: 'x',
    });
  });
  it('keeps equal and opposite forces with unequal mass-dependent accelerations', () => {
    const p = interaction(2, 4, 4, 2);
    expect(p.forceA).toBe(-p.forceB);
    expect(p.A.acceleration).toBe(-2);
    expect(p.B.acceleration).toBe(1);
    expect(p.A.velocity).toBe(-4);
    expect(p.B.velocity).toBe(2);
    expect(p.A.position).toBe(3);
    expect(p.B.position).toBe(11);
  });
  it('preserves mass-weighted center while both individual carts accelerate', () => {
    for (const [a, b] of [
      [2, 2],
      [2, 4],
      [4, 2],
    ])
      for (const force of [2, 4, 6])
        for (let j = 0; j <= 20; j++) {
          const p = interaction(a!, b!, force, j / 10);
          expect(p.center).toBeCloseTo(p.initialCenter, 12);
          expect(p.momentum).toBeCloseTo(0, 12);
          expect(p.mA * p.A.acceleration + p.mB * p.B.acceleration).toBe(0);
        }
  });
  it('uses the combined system as zero external horizontal force rather than a third physical push', () => {
    for (let i = 0; i < 3; i++) {
      const m = newtonReading('pairs', i, 4);
      expect(m.net).toBe(0);
      expect(m.acceleration).toBe(0);
      expect(m.velocity).toBe(0);
      expect(m.position).toBeCloseTo(m.pair!.center);
      expect(m.mass).toBe(m.pair!.totalMass);
    }
  });
  it('preserves zero initial time and keeps all UI cases inside fixed drawing domains', () => {
    for (const k of newtonKinds)
      for (let i = 0; i < 3; i++) {
        const limits = newtonLimits(k),
          values =
            k === 'diagram'
              ? [4]
              : [limits.min, newtonDefault(k, i), limits.max];
        for (const value of values)
          for (let j = 0; j <= 20; j++) {
            const m = newtonReading(k, i, value, j / 20);
            expect(m.position).toBeGreaterThanOrEqual(0);
            expect(m.position).toBeLessThanOrEqual(20);
            expect(Math.abs(m.velocity)).toBeLessThanOrEqual(8);
            if (m.pair)
              for (const cart of [m.pair.A, m.pair.B]) {
                expect(cart.position).toBeGreaterThanOrEqual(0);
                expect(cart.position).toBeLessThanOrEqual(20);
                expect(Math.abs(cart.velocity)).toBeLessThanOrEqual(8);
              }
          }
        expect(newtonReading(k, i, newtonDefault(k, i), 0).time).toBe(0);
      }
  });
  it('rejects nonfinite, out-of-range and malformed model conditions', () => {
    for (const fn of [
      () => forceResponse(0, [2], 0, 1),
      () => forceResponse(2, [], 0, 1),
      () => forceResponse(2, [NaN], 0, 1),
      () => forceResponse(2, [9], 0, 1),
      () => forceResponse(2, [2], Infinity, 1),
      () => forceResponse(2, [2], 0, -1),
      () => interaction(2, 4, 1, 1),
      () => interaction(2, 4, 4, 3),
      () => newtonReading('mass', 3, 2),
      () => newtonReading('net', 0.5, 2),
      () => newtonReading('diagram', 0, 3),
      () => newtonReading('inertia', 0, 0, 1.1),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('retains bilateral signs, SI units and separate receiver records', () => {
    for (const k of newtonKinds)
      for (let i = 0; i < 3; i++) {
        const row = newtonRecord(k, i);
        expect(
          row.every(
            (s) => s.length > 25 && s.includes('N') && s.includes('m/s²'),
          ),
        ).toBe(true);
      }
    expect(newtonRecord('pairs', 1)[1]).toContain('A receives -4 N, B 4 N');
  });
  it('registers six bilingual Stage 5 courses after kinematics and in the correct route unit order', () => {
    expect(lessons.slice(160, 166)).toEqual(newtonLessons);
    expect(newtonLessons.map((l) => l.kind)).toEqual(
      newtonKinds.map((k) => `newton-${k}`),
    );
    expect(Object.keys(units).indexOf('newton')).toBeGreaterThan(
      Object.keys(units).indexOf('kinematics'),
    );
    for (const l of newtonLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('newton');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('newton');
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
      expect(l.vocabulary).toHaveLength(4);
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
  it('preserves prior mastery and requires observations, practice and transfer for Newton lessons', () => {
    const old = trajectoryLessons[6]!,
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
    for (const l of newtonLessons) {
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
