import { describe, expect, it } from 'vitest';
import {
  gasState,
  gasParticles,
  reflectedCoordinate,
  contactState,
  sensibleHeating,
  iceHeating,
  latentState,
  heatKinds,
  heatParameters,
  heatReading,
  heatLimits,
  heatRecord,
  boltzmann,
  avogadro,
  fusionL,
  vaporL,
} from './heatModels';
import { heatLessons } from '../content/heat';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
const close = (a: number, b: number) =>
  expect(Math.abs(a - b)).toBeLessThan(1e-10 * Math.max(Math.abs(b), 1e-30));
describe('Thermal accounting and physical trajectories', () => {
  it('reconstructs 3D energy, zero bulk velocity and isotropy from independent particle sums', () => {
    for (const T of [150, 300, 600])
      for (const massU of [4, 40])
        for (const t of [0, 1.23e-10, 8e-10]) {
          const g = gasState(T, massU),
            ps = gasParticles(T, massU, t);
          const mean = (fn: (q: (typeof ps)[number]) => number) =>
            ps.reduce((s, q) => s + fn(q), 0) / ps.length;
          expect(ps).toHaveLength(48);
          for (const axis of ['vx', 'vy', 'vz'] as const) {
            expect(Math.abs(mean((q) => q[axis]))).toBeLessThan(1e-9);
            close(
              mean((q) => q[axis] ** 2),
              g.rms ** 2 / 3,
            );
          }
          close(
            mean((q) => 0.5 * g.mass * (q.vx ** 2 + q.vy ** 2 + q.vz ** 2)),
            1.5 * boltzmann * T,
          );
          close(
            Math.sqrt(mean((q) => q.vx ** 2 + q.vy ** 2 + q.vz ** 2)),
            g.rms,
          );
          ps.forEach((q) =>
            ['x', 'y', 'z'].forEach((axis) =>
              expect(q[axis as 'x']).toBeGreaterThanOrEqual(0),
            ),
          );
          ps.forEach((q) =>
            ['x', 'y', 'z'].forEach((axis) =>
              expect(q[axis as 'x']).toBeLessThanOrEqual(1e-6),
            ),
          );
        }
  });
  it('retains mirror pairs and constant speed through wall hits', () => {
    for (const t of [0, 2e-10, 5e-10, 8e-10]) {
      const p = gasParticles(600, 4, t, 2);
      expect(p).toHaveLength(96);
      for (let j = 0; j < p.length; j += 2) {
        const a = p[j]!,
          b = p[j + 1]!;
        close(a.x + b.x, 1e-6);
        close(a.y + b.y, 1e-6);
        close(a.z + b.z, 1e-6);
        close(Math.hypot(a.vx, a.vy, a.vz), a.speed);
      }
    }
  });
  it('solves elastic reflection at exact boundaries and differentiates position between hits', () => {
    const L = 1e-6,
      v = 1000,
      start = 2e-7;
    const hit = reflectedCoordinate(start, v, 8e-10, L);
    close(hit.position, L);
    expect(hit.velocity).toBe(-v);
    const returned = reflectedCoordinate(start, v, 1.8e-9, L);
    expect(returned.position).toBe(0);
    expect(returned.velocity).toBe(v);
    const t = 1e-9,
      dt = 1e-13,
      c = reflectedCoordinate(start, v, t, L);
    close(
      (reflectedCoordinate(start, v, t + dt, L).position -
        reflectedCoordinate(start, v, t - dt, L).position) /
        (2 * dt),
      c.velocity,
    );
  });
  it('separates mass, temperature and amount instead of substituting a total for a mean', () => {
    const a = gasState(300, 4),
      b = gasState(600, 4),
      c = gasState(300, 40),
      d = gasState(300, 4, 0.002);
    close(b.meanK, 2 * a.meanK);
    close(b.rms, Math.sqrt(2) * a.rms);
    close(c.rms, a.rms / Math.sqrt(10));
    close(c.meanK, a.meanK);
    close(d.U, 2 * a.U);
    close(d.U, d.N * d.meanK);
    close(d.N, 0.002 * avogadro);
  });
  it('matches a separately integrated thermal contact ODE without snapping equilibrium', () => {
    for (const [Ca, Cb, Ta, Tb] of [
      [10, 10, 400, 300],
      [20, 10, 400, 300],
      [20, 10, 350, 400],
    ]) {
      let a = Ta!,
        b = Tb!;
      const dt = 0.001;
      for (let j = 0; j < 30000; j++) {
        const f = (x: number, y: number) => [(y - x) / Ca!, (x - y) / Cb!];
        const k1 = f(a, b),
          k2 = f(a + (dt * k1[0]!) / 2, b + (dt * k1[1]!) / 2),
          k3 = f(a + (dt * k2[0]!) / 2, b + (dt * k2[1]!) / 2),
          k4 = f(a + dt * k3[0]!, b + dt * k3[1]!);
        a += (dt * (k1[0]! + 2 * k2[0]! + 2 * k3[0]! + k4[0]!)) / 6;
        b += (dt * (k1[1]! + 2 * k2[1]! + 2 * k3[1]! + k4[1]!)) / 6;
      }
      const s = contactState(Ca!, Cb!, Ta!, Tb!, 1, 30);
      expect(s.A).toBeCloseTo(a, 8);
      expect(s.B).toBeCloseTo(b, 8);
      expect(s.Qa + s.Qb).toBeCloseTo(0, 9);
      expect(s.A).not.toBe(s.equilibrium);
    }
  });
  it('permits unequal internal energies at equilibrium and reverses signed heat with temperature', () => {
    const a = contactState(20, 10, 350, 350, 1, 30);
    expect(a.Ua).toBe(7000);
    expect(a.Ub).toBe(3500);
    expect(a.Qa).toBe(0);
    expect(a.powerIntoA).toBe(0);
    const b = contactState(20, 10, 350, 400, 1, 30);
    expect(b.Qa).toBeGreaterThan(0);
    expect(b.Qb).toBeLessThan(0);
    const off = contactState(10, 10, 400, 300, 0, 30);
    expect(off.A).toBe(400);
    expect(off.B).toBe(300);
  });
  it('balances net power, joules, mass and temperature rise with a zero-source limit', () => {
    const a = sensibleHeating(0.1, 4200, 42, 10),
      b = sensibleHeating(0.2, 4200, 42, 10),
      c = sensibleHeating(0.1, 900, 42, 10);
    expect(a.Q).toBe(420);
    expect(a.rise).toBe(1);
    expect(b.rise).toBe(0.5);
    close(c.rise, 14 / 3);
    for (const m of [0.1, 0.2])
      for (const P of [0, 42, 84])
        for (const t of [0, 5, 10]) {
          const s = sensibleHeating(m, 4200, P, t);
          close(s.Q, m * 4200 * s.rise);
          expect(s.Q).toBe(P * t);
        }
    expect(sensibleHeating(0.1, 900, 0, 10).temperature).toBe(20);
  });
  it('joins the heating segments continuously at both exact phase boundaries', () => {
    expect(iceHeating(2100).state).toBe('solid at melting point');
    expect(iceHeating(35500).state).toBe('liquid at melting point');
    for (const Q of [2100, 35500]) {
      expect(iceHeating(Q).temperature).toBe(0);
      expect(Math.abs(iceHeating(Q - 1e-5).temperature)).toBeLessThan(1e-6);
      expect(Math.abs(iceHeating(Q + 1e-5).temperature)).toBeLessThan(1e-6);
    }
    const half = iceHeating(18800);
    close(half.solid, 0.05);
    close(half.liquid, 0.05);
    expect(half.temperature).toBe(0);
    close(iceHeating(42000).temperature, 6500 / 420);
  });
  it('conserves both mass and the piecewise heat budget across warming, melting and liquid warming', () => {
    for (let Q = 0; Q <= 50000; Q += 125) {
      const s = iceHeating(Q);
      close(s.Qice + s.Qmelt + s.Qwater, Q);
      close(s.solid + s.liquid, 0.1);
      expect(s.solid).toBeGreaterThanOrEqual(0);
      expect(s.liquid).toBeGreaterThanOrEqual(0);
      if (s.state === 'melting') expect(s.temperature).toBe(0);
    }
    expect(() => iceHeating(50000, 0.05)).toThrow(RangeError);
  });
  it('uses the converted mass, signed freezing heat and different specific latent heats', () => {
    for (const progress of [0, 0.25, 0.5, 1])
      for (const i of [0, 1, 2]) {
        const s = latentState(i, 0.1, progress);
        close(
          s.converted,
          (s.target * progress) / (i === 1 ? vaporL : fusionL),
        );
        close(s.converted + s.remaining, 0.1);
        close(s.Q, (i === 2 ? -1 : 1) * s.converted * s.L);
        expect(s.temperature).toBe(i === 1 ? 100 : 0);
        expect(s.time).toBe(200 * progress);
      }
    expect(latentState(2, 0.1, 1).Q).toBe(-20000);
    expect(latentState(1, 0.1, 1).converted).toBeLessThan(
      latentState(0, 0.1, 1).converted,
    );
  });
  it('stops small samples at completion without surplus latent heat or negative remaining mass', () => {
    for (const i of [0, 2]) {
      const s = latentState(i, 0.05, 1);
      expect(s.complete).toBe(true);
      expect(s.remaining).toBe(0);
      close(s.converted, 0.05);
      expect(Math.abs(s.Q)).toBe(16700);
      expect(s.time).toBe(167);
    }
    expect(latentState(1, 0.05, 1).complete).toBe(false);
  });
  it('rejects impossible and nonfinite model inputs', () => {
    for (const fn of [
      () => gasState(NaN, 4),
      () => gasParticles(300, 4, -1),
      () => reflectedCoordinate(0, Infinity, 0),
      () => contactState(0, 10, 300, 300, 1, 0),
      () => sensibleHeating(0.1, 900, -1, 10),
      () => iceHeating(-1),
      () => latentState(3, 0.1, 0),
      () => latentState(0, 0.1, 2),
      () => heatParameters('phase', 0, 51),
      () => heatParameters('phase', 3),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('keeps every prescribed and extreme bench state finite and recordable, including zero heat', () => {
    const finite = (x: unknown): boolean =>
      typeof x === 'number'
        ? Number.isFinite(x)
        : x !== null && typeof x === 'object'
          ? Object.values(x).every(finite)
          : true;
    for (const kind of heatKinds)
      for (const i of [0, 1, 2])
        for (const free of [null, heatLimits[kind].min, heatLimits[kind].max]) {
          const p = heatParameters(kind, i, free);
          for (const t of [0, 0.5, 1])
            expect(finite(heatReading(p, t))).toBe(true);
          expect(heatRecord(p)).not.toMatch(/NaN|Infinity/);
        }
  });
  it('registers six complete bilingual courses, exercises, exits and illustrated experiment entrances', () => {
    expect(heatLessons).toHaveLength(6);
    for (const l of heatLessons) {
      const entry = lessonCatalog.find((c) => c.id === l.id);
      expect(entry?.pack).toBe('heat');
      expect(entry?.unit).toBe('heat');
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      expect(l.homeExperiment.en.length).toBeGreaterThan(40);
      expect(
        experiments.some((e) => e.id === l.kind && e.name.en.length > 0),
      ).toBe(true);
    }
  });
});
