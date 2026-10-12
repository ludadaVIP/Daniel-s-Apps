import { describe, expect, it } from 'vitest';
import {
  waveKinds,
  waveDefault,
  waveLimits,
  waveParameters,
  waveReading,
  waveSample,
  waveCrests,
  waveStart,
  waveNumber,
} from './waveModels';
import { waveLessons } from '../content/waves';
import { lessons } from '../content/lessons';
import { gravitationLessons } from '../content/gravitation';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
const deriv = (f: (t: number) => number, t: number, h = 1e-5) =>
  (f(t + h) - f(t - h)) / (2 * h);
const read = (
  k: (typeof waveKinds)[number],
  i: number,
  p = 1,
  v = waveDefault(k, i),
) => waveReading(k, i, v, p);
describe('wave propagation distinguishes local material from the pattern', () => {
  it('tracks a compact pulse peak and a fixed marker on separate trajectories', () => {
    const p = waveParameters('pulse', 0, 1);
    expect(waveSample(p, 4, 0).displacement).toBe(0);
    expect(waveSample(p, 4, 3).displacement).toBe(0.01);
    expect(waveSample(p, 4, 4).displacement).toBe(0);
    expect(read('pulse', 0).phasePosition).toBe(5);
    expect(read('pulse', 2, 0.375).phasePosition).toBe(4);
    expect(read('pulse', 2, 0.375).displacement).toBe(0.01);
  });
  it('has no artificial repetition clock for an isolated pulse', () => {
    const m = read('pulse', 1);
    expect(m.frequency).toBeNull();
    expect(m.period).toBeNull();
    expect(m.wavelength).toBeNull();
    expect(m.cycles).toBeNull();
    expect(m.power).toBeNull();
  });
  it('keeps compact-pulse displacement, velocity and acceleration continuous at support edges', () => {
    const p = waveParameters('pulse', 0, 1);
    for (const edge of [1.75, 3.25]) {
      const a = waveSample(p, edge, 0),
        b = waveSample(p, edge + 1e-6, 0),
        c = waveSample(p, edge - 1e-6, 0);
      expect(a.displacement).toBe(0);
      expect(a.velocity).toBe(0);
      expect(a.acceleration).toBe(0);
      expect(b.displacement - c.displacement).toBeCloseTo(0, 10);
      expect(b.velocity - c.velocity).toBeCloseTo(0, 10);
      expect(b.acceleration - c.acceleration).toBeCloseTo(0, 7);
    }
  });
  it('differentiates local displacements and velocities on the physical clock', () => {
    for (const kind of waveKinds)
      for (let i = 0; i < 3; i++) {
        const p = waveParameters(kind, i, waveDefault(kind, i)),
          t = kind === 'pulse' ? Math.min(3.1, 2.5 / p.speed) : 0.731,
          s = waveSample(p, 4, t);
        expect(deriv((t) => waveSample(p, 4, t).displacement, t)).toBeCloseTo(
          s.velocity,
          7,
        );
        expect(deriv((t) => waveSample(p, 4, t).velocity, t)).toBeCloseTo(
          s.acceleration,
          6,
        );
      }
  });
  it('satisfies the linear wave equation against an independent spatial finite difference', () => {
    for (const kind of waveKinds) {
      const p = waveParameters(kind, 0, waveDefault(kind, 0)),
        x = kind === 'pulse' ? 3.1 : 4,
        t = kind === 'pulse' ? 2 : 0.37,
        h = 1e-4,
        s = waveSample(p, x, t),
        uxx =
          (waveSample(p, x + h, t).displacement -
            2 * s.displacement +
            waveSample(p, x - h, t).displacement) /
          h ** 2;
      expect(s.acceleration).toBeCloseTo(p.speed ** 2 * uxx, 5);
    }
  });
  it('matches independent finite-difference evolution from initial displacement and velocity', () => {
    for (const f of [0.5, 1, 2]) {
      const N = 4000,
        dx = 10 / N,
        dt = dx / 4,
        steps = 1000,
        k = 2 * Math.PI * f,
        A = 0.01,
        initial = Array.from({ length: N }, (_, i) => A * Math.cos(k * i * dx));
      let previous = initial,
        current = initial.map(
          (u, i) =>
            u +
            dt * A * k * Math.sin(k * i * dx) +
            0.5 *
              (dt / dx) ** 2 *
              (initial[(i + 1) % N]! - 2 * u + initial[(i + N - 1) % N]!),
        );
      for (let n = 1; n < steps; n++) {
        const next = current.map(
          (u, i) =>
            2 * u -
            previous[i]! +
            (dt / dx) ** 2 *
              (current[(i + 1) % N]! - 2 * u + current[(i + N - 1) % N]!),
        );
        previous = current;
        current = next;
      }
      const m = read('clock', 0, (steps * dt) / 4, f);
      expect(current[1600]).toBeCloseTo(m.displacement, 5);
    }
  });
  it('reverses propagation without changing the transverse motion axis', () => {
    expect(read('transverse', 0).direction).toBe(1);
    expect(read('transverse', 1).direction).toBe(-1);
    expect(read('transverse', 0).phasePosition).toBe(4);
    expect(read('transverse', 1).phasePosition).toBe(4);
    for (const i of [0, 1]) {
      const p = waveParameters('transverse', i, 1);
      expect(waveSample(p, 4, 0).velocity).toBeCloseTo(0, 12);
      expect(p.speed).toBe(1);
    }
  });
  it('tracks an actual same-phase crest even for free leftward speed 1.5', () => {
    const p = waveParameters('transverse', 1, 1.5);
    expect(waveStart(p)).toBe(6);
    for (const progress of [0, 0.3, 1]) {
      const m = read('transverse', 1, progress, 1.5);
      expect(waveSample(p, m.phasePosition, m.time).displacement).toBeCloseTo(
        p.amplitude,
        12,
      );
    }
  });
  it('uses spatially adjacent same-phase points rather than just equal heights', () => {
    for (const lambda of [0.5, 1, 2, 3]) {
      const p = waveParameters('wavelength', 0, lambda),
        t = 0.23,
        cs = waveCrests(p, t);
      expect(cs[1]! - cs[0]!).toBeCloseTo(lambda, 12);
      expect(waveSample(p, cs[0]!, t).displacement).toBeCloseTo(
        p.amplitude,
        12,
      );
      expect(waveSample(p, cs[0]! + lambda / 2, t).displacement).toBeCloseTo(
        -p.amplitude,
        12,
      );
    }
  });
  it('separates temporal repetition from spatial repetition', () => {
    const p = waveParameters('clock', 0, 0.75),
      t = 0.2;
    expect(waveSample(p, 4, t + p.period!).displacement).toBeCloseTo(
      waveSample(p, 4, t).displacement,
      12,
    );
    expect(waveSample(p, 4 + p.wavelength!, t).displacement).toBeCloseTo(
      waveSample(p, 4, t).displacement,
      12,
    );
  });
  it('counts complete returns while retaining fractional cycles', () => {
    expect([0, 1, 2].map((i) => read('clock', i).completeCycles)).toEqual([
      2, 4, 8,
    ]);
    const m = read('clock', 0, 0.25, 0.75);
    expect(m.cycles).toBe(0.75);
    expect(m.completeCycles).toBe(0);
    expect(read('clock', 0, 1, 0.75).completeCycles).toBe(3);
    expect(read('clock', 0, 0.125).completeCycles).toBe(0);
  });
  it('gives frequency and period reciprocal units and one-wavelength travel per period', () => {
    for (const kind of waveKinds.filter((k) => k !== 'pulse')) {
      const m = read(kind, 1);
      expect(m.frequency! * m.period!).toBeCloseTo(1, 12);
      expect(m.speed * m.period!).toBeCloseTo(m.wavelength!, 12);
      expect(m.frequency! * m.wavelength!).toBeCloseTo(m.speed, 12);
    }
  });
  it('changes source frequency and wavelength together at fixed medium speed', () => {
    expect([0, 1, 2].map((i) => read('relation', i).speed)).toEqual([1, 1, 1]);
    expect([0, 1, 2].map((i) => read('relation', i).wavelength)).toEqual([
      2,
      1,
      2 / 3,
    ]);
    expect(read('wavelength', 0, 1, 3).frequency).toBe(1 / 3);
  });
  it('holds source frequency fixed while string conditions change speed and wavelength', () => {
    expect([0, 1, 2].map((i) => read('speed', i).speed)).toEqual([1, 2, 1]);
    expect([0, 1, 2].map((i) => read('speed', i).frequency)).toEqual([
      0.5, 0.5, 0.5,
    ]);
    expect([0, 1, 2].map((i) => read('speed', i).wavelength)).toEqual([
      2, 4, 2,
    ]);
    expect(read('speed', 0, 1, 0.0625).speed).toBe(0.5);
  });
  it('changes amplitude and power but not frequency, wavelength or speed', () => {
    const [a, b, c] = [0, 1, 2].map((i) => read('amplitude', i));
    expect(b!.power! / a!.power!).toBeCloseTo(4, 12);
    expect(c!.power! / b!.power!).toBeCloseTo(4, 12);
    for (const m of [a!, b!, c!]) {
      expect(m.speed).toBe(1);
      expect(m.frequency).toBe(0.5);
      expect(m.wavelength).toBe(2);
    }
    expect(a!.power).toBeCloseTo(30.84251375340424e-6, 12);
  });
  it('matches mean power against an independently integrated tension-energy flux', () => {
    for (const i of [0, 1, 2]) {
      const p = waveParameters('amplitude', i, waveDefault('amplitude', i)),
        n = 2000,
        h = p.period! / n;
      let energy = 0;
      for (let j = 0; j <= n; j++) {
        const t = j * h,
          ut = deriv(
            (t) => waveSample(p, 4, t).displacement,
            Math.min(Math.max(t, 1e-5), 4 - 1e-5),
          ),
          ux = deriv((x) => waveSample(p, x, t).displacement, 4);
        energy += -(j === 0 || j === n ? 0.5 : 1) * p.tension * ux * ut * h;
      }
      expect(energy / p.period!).toBeCloseTo(read('amplitude', i).power!, 9);
    }
  });
  it('maps horizontal material displacement while compression follows its spatial gradient', () => {
    const p = waveParameters('longitudinal', 0, 0.08),
      s = waveSample(p, 4, 0),
      expanded = waveSample(p, 4, 0.5),
      compressed = waveSample(p, 4, 1.5);
    expect(s.displacement).toBeCloseTo(0.08, 12);
    expect(s.densityRatio).toBeCloseTo(1, 12);
    expect(expanded.displacement).toBeCloseTo(0, 12);
    expect(expanded.densityRatio).toBeCloseTo(0.799151357, 8);
    expect(compressed.strain).toBeLessThan(0);
    expect(compressed.densityRatio).toBeGreaterThan(1);
    expect(
      deriv((x) => x + waveSample(p, x, 0.43).displacement, 4),
    ).toBeCloseTo(waveSample(p, 4, 0.43).stretch, 8);
  });
  it('conserves mapped material mass when integrating density over deformed cell widths', () => {
    const p = waveParameters('longitudinal', 2, 0.12),
      n = 10000,
      dx = 10 / n,
      t = 0.37;
    let total = 0;
    for (let j = 0; j < n; j++) {
      const a = j * dx,
        b = a + dx,
        Xa = a + waveSample(p, a, t).displacement,
        Xb = b + waveSample(p, b, t).displacement;
      total += waveSample(p, (a + b) / 2, t).densityRatio * (Xb - Xa);
    }
    expect(total).toBeCloseTo(10, 6);
  });
  it('keeps longitudinal particles ordered in every allowed setting', () => {
    for (let i = 0; i < 3; i++)
      for (const A of [0.04, 0.12])
        for (const t of [0, 0.37, 2, 4]) {
          const p = waveParameters('longitudinal', i, A);
          let prev = -Infinity;
          for (let j = 0; j <= 200; j++) {
            const x = j / 20,
              s = waveSample(p, x, t);
            expect(s.stretch).toBeGreaterThan(0.6);
            expect(x + s.displacement).toBeGreaterThan(prev);
            prev = x + s.displacement;
          }
        }
  });
  it('keeps string physical slopes small despite magnified display amplitudes', () => {
    for (const kind of waveKinds.filter((k) => k !== 'longitudinal'))
      for (let i = 0; i < 3; i++)
        for (const value of [waveLimits[kind].min, waveLimits[kind].max]) {
          const p = waveParameters(kind, i, value);
          for (let j = 0; j <= 200; j++)
            expect(Math.abs(waveSample(p, j / 20, 0.17).slope)).toBeLessThan(
              0.13,
            );
        }
  });
  it('keeps all readings finite and tracked crests inside the teaching window', () => {
    for (const k of waveKinds)
      for (let i = 0; i < 3; i++)
        for (const v of [
          waveDefault(k, i),
          waveLimits[k].min,
          waveLimits[k].max,
        ])
          for (const progress of [0, 0.137, 0.5, 1]) {
            const m = read(k, i, progress, v);
            for (const x of Object.values(m))
              if (typeof x === 'number') expect(Number.isFinite(x)).toBe(true);
            expect(m.phasePosition).toBeGreaterThanOrEqual(-1e-9);
            expect(m.phasePosition).toBeLessThanOrEqual(10);
          }
    expect(waveNumber(30.84251375340424e-6)).not.toBe('0');
  });
  it('rejects invalid time, coordinate, comparison, progress and control inputs', () => {
    const p = waveParameters('pulse', 0, 1);
    for (const bad of [NaN, Infinity, -1, 11])
      expect(() => waveSample(p, bad, 1)).toThrow();
    for (const bad of [NaN, Infinity, -1, 5])
      expect(() => waveSample(p, 4, bad)).toThrow();
    for (const k of waveKinds) {
      for (const bad of [-1, 3, 0.5, NaN]) expect(() => read(k, bad)).toThrow();
      for (const bad of [-1, 1.1, NaN]) expect(() => read(k, 0, bad)).toThrow();
      for (const bad of [
        NaN,
        Infinity,
        waveLimits[k].min - 1,
        waveLimits[k].max + 1,
      ])
        expect(() => read(k, 0, 1, bad)).toThrow();
    }
  });
});
describe('Stage 6 wave foundations extend the learning path', () => {
  it('appends eight registered courses after the complete gravitation pack', () => {
    const start = lessons.findIndex((l) => l.id === waveLessons[0]!.id);
    expect(lessons.slice(start - 8, start).map((l) => l.id)).toEqual(
      gravitationLessons.map((l) => l.id),
    );
    expect(waveLessons.map((l) => l.kind)).toEqual(
      waveKinds.map((k) => 'waves-' + k),
    );
    for (const l of waveLessons) {
      expect(l.stage).toBe(6);
      expect(l.unit).toBe('waves');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('waves');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
    }
  });
  it('retains bilingual explanations, investigations, varied practice and transfer', () => {
    for (const l of waveLessons) {
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
      expect(l.predictions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      expect(l.questions).toHaveLength(3);
      expect(new Set(l.questions.map((q) => q.correct)).size).toBe(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options).toHaveLength(3);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(3);
        expect(q.explanation.en.length).toBeGreaterThan(15);
        expect(q.explanation.zh.length).toBeGreaterThan(5);
      }
    }
  });
  it('preserves previous mastery and keeps exploration/practice/exit gates', () => {
    const old = gravitationLessons[7]!,
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
    for (const l of waveLessons) {
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
