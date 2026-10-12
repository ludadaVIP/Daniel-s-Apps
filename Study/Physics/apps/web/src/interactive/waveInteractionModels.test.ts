import { describe, expect, it } from 'vitest';
import {
  interactionKinds,
  interactionParameters,
  interactionSample,
  interactionPulse,
  interactionReading,
  interactionRecord,
  interactionLimits,
  diffractionAmplitude,
  diffractionFirstMinimum,
  refractionPhase,
  stringEnergy,
} from './waveInteractionModels';
import { waveInteractionLessons } from '../content/waveInteractions';
import { waveLessons } from '../content/waves';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
const integrate = (
  fn: (x: number) => number,
  a: number,
  b: number,
  n = 4000,
) => {
  let s = 0;
  for (let i = 0; i <= n; i++)
    s += (i === 0 || i === n ? 0.5 : 1) * fn(a + ((b - a) * i) / n);
  return (s * (b - a)) / n;
};
describe('Physical wave interactions', () => {
  it('satisfies fixed displacement and free slope at the boundary at all times', () => {
    for (let j = 0; j <= 120; j++) {
      const t = j / 20;
      expect(
        interactionSample(interactionParameters('reflection', 0), 8, t).u,
      ).toBeCloseTo(0, 12);
      expect(
        interactionSample(interactionParameters('reflection', 1), 8, t).dx,
      ).toBeCloseTo(0, 12);
    }
    expect(
      interactionSample(interactionParameters('reflection', 1), 8, 3).u,
    ).toBeCloseTo(0.02, 12);
  });
  it('returns the correct sign and probe arrival times without a ghost string', () => {
    for (let i = 0; i < 3; i++) {
      const p = interactionParameters('reflection', i);
      expect(interactionSample(p, 6, 2).u).toBeCloseTo(0.01, 12);
      expect(interactionSample(p, 6, 4).u).toBeCloseTo(0.01 * p.ratio, 12);
      expect(interactionSample(p, 2, 6).u).toBeCloseTo(0.01 * p.ratio, 12);
    }
    expect(() =>
      interactionSample(interactionParameters('reflection', 0), 8.01, 3),
    ).toThrow(RangeError);
  });
  it('matches an independent finite-difference initial-value solver for both reflecting ends', () => {
    const cells = 1600,
      dx = 8 / cells,
      dt = 0.0015,
      c = 2,
      steps = 3000;
    for (let index = 0; index < 2; index++) {
      const u = new Float64Array(cells + 1),
        prev = new Float64Array(cells + 1);
      const initial = (x: number) =>
        Math.abs(x - 2) < 0.8
          ? 0.01 * Math.cos((Math.PI * (x - 2)) / 1.6) ** 4
          : 0;
      const velocity = (x: number) =>
        ((initial(x - 1e-5) - initial(x + 1e-5)) / 2e-5) * c;
      for (let i = 0; i <= cells; i++) u[i] = initial(i * dx);
      for (let i = 1; i < cells; i++)
        prev[i] =
          u[i]! -
          dt * velocity(i * dx) +
          0.5 * ((c * dt) / dx) ** 2 * (u[i + 1]! - 2 * u[i]! + u[i - 1]!);
      let current = u,
        previous = prev;
      for (let step = 0; step < steps; step++) {
        const next = new Float64Array(cells + 1);
        for (let i = 1; i < cells; i++)
          next[i] =
            2 * current[i]! -
            previous[i]! +
            ((c * dt) / dx) ** 2 *
              (current[i + 1]! - 2 * current[i]! + current[i - 1]!);
        next[cells] =
          index === 0
            ? 0
            : 2 * current[cells]! -
              previous[cells]! +
              2 *
                ((c * dt) / dx) ** 2 *
                (current[cells - 1]! - current[cells]!);
        previous = current;
        current = next;
      }
      const p = interactionParameters('reflection', index);
      for (const x of [4.6, 5, 5.4])
        expect(
          Math.abs(
            current[Math.round(x / dx)]! -
              interactionSample(p, x, steps * dt).u,
          ),
        ).toBeLessThan(2e-5);
    }
  });
  it('accounts for absorbed energy with independent boundary flux integration', () => {
    for (const r of [-1, -0.5, 0, 0.5, 1]) {
      const p = interactionParameters('reflection', 0, r),
        initial = stringEnergy(p, 0, 2000).total,
        returned = stringEnergy(p, 6, 2000).total;
      const absorbed = integrate(
        (t) => {
          const s = interactionSample(p, 8, t);
          return -s.dx * s.velocity;
        },
        0,
        6,
      );
      expect(returned / initial).toBeCloseTo(r * r, 8);
      expect((returned + absorbed) / initial).toBeCloseTo(1, 8);
    }
  });
  it('preserves phase, frequency and wavefront continuity across refraction', () => {
    for (let i = 0; i < 3; i++)
      for (const angle of [0, 15, 30, 35]) {
        const p = interactionParameters('refraction', i, angle);
        expect(Math.sin(p.incidence) / 2).toBeCloseTo(
          Math.sin(p.refraction) / (i + 1),
          12,
        );
        expect(p.frequency * p.wavelength).toBeCloseTo(i + 1, 12);
        for (const x of [-4, -1, 0, 2, 4])
          for (const t of [0, 0.25, 2])
            expect(refractionPhase(p, x, -1e-9, t)).toBeCloseTo(
              refractionPhase(p, x, 1e-9, t),
              7,
            );
      }
  });
  it('turns toward/away from the normal and does not turn at normal incidence', () => {
    expect(
      (interactionParameters('refraction', 0).refraction * 180) / Math.PI,
    ).toBeCloseTo(14.477512, 5);
    expect(
      (interactionParameters('refraction', 2).refraction * 180) / Math.PI,
    ).toBeCloseTo(48.590378, 5);
    for (let i = 0; i < 3; i++)
      expect(interactionParameters('refraction', i, 0).refraction).toBe(0);
  });
  it('derives the diffraction envelope independently from aperture phasor integration', () => {
    for (const q of [0.5, 1, 2, 4, 6])
      for (const theta of [0, 15, 30, 60, 75]) {
        const k = 2 * Math.PI * q * Math.sin((theta * Math.PI) / 180),
          real = integrate((z) => Math.cos(k * z), -0.5, 0.5),
          imag = integrate((z) => Math.sin(k * z), -0.5, 0.5);
        expect(real).toBeCloseTo(diffractionAmplitude(q, theta), 5);
        expect(imag).toBeCloseTo(0, 10);
      }
  });
  it('distinguishes absent, edge and interior diffraction minima', () => {
    expect(diffractionFirstMinimum(0.5)).toBeNull();
    expect(diffractionFirstMinimum(1)).toBe(90);
    expect(diffractionFirstMinimum(2)).toBeCloseTo(30, 10);
    expect(diffractionFirstMinimum(4)).toBeCloseTo(14.477512, 5);
    for (const q of [1, 2, 4, 6])
      expect(diffractionAmplitude(q, diffractionFirstMinimum(q)!)).toBeCloseTo(
        0,
        10,
      );
    expect(diffractionAmplitude(1, 30) ** 2).toBeCloseTo(4 / Math.PI ** 2, 12);
  });
  it('has a continuous symmetric axis limit and normalized intensity bounds', () => {
    for (const q of [0.5, 1, 2, 4, 6]) {
      expect(diffractionAmplitude(q, 0)).toBe(1);
      expect(diffractionAmplitude(q, 1e-10)).toBeCloseTo(1, 12);
      for (let d = 0; d <= 75; d++) {
        expect(diffractionAmplitude(q, d)).toBeCloseTo(
          diffractionAmplitude(q, -d),
          12,
        );
        expect(diffractionAmplitude(q, d) ** 2).toBeLessThanOrEqual(1);
      }
    }
  });
  it('adds signed pulses at overlap and lets them pass through afterward', () => {
    for (let i = 0; i < 3; i++) {
      const p = interactionParameters('interference', i);
      expect(interactionSample(p, 5, 2).u).toBeCloseTo(
        0.01 * (1 + p.ratio),
        12,
      );
      expect(interactionSample(p, 8, 4).u).toBeCloseTo(0.01, 12);
      expect(interactionSample(p, 2, 4).u).toBeCloseTo(0.01 * p.ratio, 12);
    }
  });
  it('retains kinetic energy when opposite pulse displacements cancel everywhere', () => {
    const p = interactionParameters('interference', 1),
      e = stringEnergy(p, 2);
    for (let j = 0; j <= 100; j++)
      expect(interactionSample(p, j / 10, 2).u).toBeCloseTo(0, 12);
    expect(Math.abs(interactionSample(p, 5.3, 2).velocity)).toBeGreaterThan(
      0.01,
    );
    expect(e.potential).toBeCloseTo(0, 12);
    expect(e.kinetic).toBeCloseTo(
      (2 * 5 * Math.PI ** 2 * 0.5625 * 0.01 ** 2) / (16 * 0.8),
      10,
    );
  });
  it('moves energy into strain for equal positive pulse overlap', () => {
    const p = interactionParameters('interference', 0),
      e = stringEnergy(p, 2);
    expect(e.kinetic).toBeCloseTo(0, 12);
    expect(e.potential * 1e6).toBeCloseTo(433.72285, 3);
  });
  it('conserves full pulse energy before, during and after every signed overlap', () => {
    for (const b of [-1, -0.5, 0, 0.25, 1]) {
      const p = interactionParameters('interference', 0, b),
        expected =
          ((1 + b * b) * 5 * Math.PI ** 2 * 0.5625 * 0.01 ** 2) / (16 * 0.8);
      for (const t of [0, 1, 1.8, 2, 2.2, 3, 4])
        expect(stringEnergy(p, t).total).toBeCloseTo(expected, 9);
    }
  });
  it('matches temporal and spatial derivatives and the wave equation', () => {
    const h = 1e-4;
    for (const kind of ['reflection', 'interference', 'standing'] as const)
      for (let i = 0; i < 3; i++) {
        const p = interactionParameters(kind, i);
        for (const [x, t] of [
          [5.2, 1.8],
          [4.3, 2.1],
          [2.8, 3.2],
        ] as const) {
          const s = interactionSample(p, x, t),
            up = interactionSample(p, x, t + h).u,
            um = interactionSample(p, x, t - h).u,
            xp = interactionSample(p, x + h, t).u,
            xm = interactionSample(p, x - h, t).u;
          expect(s.velocity).toBeCloseTo((up - um) / (2 * h), 6);
          expect(s.dx).toBeCloseTo((xp - xm) / (2 * h), 6);
          expect((up - 2 * s.u + um) / h ** 2).toBeCloseTo(
            (p.speed ** 2 * (xp - 2 * s.u + xm)) / h ** 2,
            5,
          );
        }
      }
  });
  it('keeps fixed-end nodes zero at every time and antinodes at maximum amplitude', () => {
    for (let i = 0; i < 3; i++)
      for (const L of [3, 6, 9]) {
        const p = interactionParameters('standing', i, L);
        for (let j = 0; j <= p.mode; j++)
          for (const t of [0, 0.25, 0.5, 1, 1.7, 3.9])
            expect(interactionSample(p, (j * L) / p.mode, t).u).toBeCloseTo(
              0,
              12,
            );
        for (let j = 0; j < p.mode; j++)
          expect(
            Math.abs(interactionSample(p, ((j + 0.5) * L) / p.mode, 0).u),
          ).toBeCloseTo(0.01, 12);
      }
  });
  it('separates a flat snapshot from a node using velocities', () => {
    const p = interactionParameters('standing', 0),
      t = 1 / (4 * p.frequency);
    expect(interactionSample(p, p.length / 2, t).u).toBeCloseTo(0, 12);
    expect(
      Math.abs(interactionSample(p, p.length / 2, t).velocity),
    ).toBeGreaterThan(0.01);
    expect(interactionSample(p, 0, t).velocity).toBeCloseTo(0, 12);
  });
  it('couples harmonic number, length, wavelength and frequency at held speed', () => {
    for (let i = 0; i < 3; i++) {
      const p = interactionParameters('standing', i),
        short = interactionParameters('standing', i, 3);
      expect(p.frequency).toBeCloseTo((i + 1) * 0.25, 12);
      expect((p.mode * p.wavelength) / 2).toBeCloseTo(p.length, 12);
      expect(short.frequency).toBeCloseTo(2 * p.frequency, 12);
      expect(short.speed).toBe(p.speed);
    }
  });
  it('conserves standing-mode energy and has zero mean net flux', () => {
    for (let i = 0; i < 3; i++) {
      const p = interactionParameters('standing', i),
        expected =
          0.25 * p.length * p.amplitude ** 2 * (2 * Math.PI * p.frequency) ** 2;
      for (const t of [0, 0.25, 0.5, 1, 2.7, 4])
        expect(stringEnergy(p, t).total).toBeCloseTo(expected, 10);
      const flux = integrate(
        (t) => {
          const s = interactionSample(p, 0.31 * p.length, t);
          return -0.25 * p.speed ** 2 * s.dx * s.velocity;
        },
        0,
        1 / p.frequency,
      );
      expect(flux).toBeCloseTo(0, 12);
    }
  });
  it('keeps all prescribed and free edge readings finite without domain leaks', () => {
    for (const kind of interactionKinds)
      for (let i = 0; i < 3; i++)
        for (const v of [
          null,
          interactionLimits[kind].min,
          interactionLimits[kind].max,
        ]) {
          const p = interactionParameters(kind, i, v);
          for (const s of [0, 0.5, 1]) {
            const m = interactionReading(p, s);
            expect(Number.isFinite(m.time)).toBe(true);
            expect(Number.isFinite(p.refraction)).toBe(true);
          }
          expect(interactionRecord(p)).not.toMatch(/NaN|Infinity/);
        }
  });
  it('rejects invalid kinds, cases, controls, probes and inspection windows', () => {
    expect(() => interactionParameters('missing' as never, 0)).toThrow(
      RangeError,
    );
    for (const i of [-1, 0.5, 3])
      expect(() => interactionParameters('reflection', i)).toThrow(RangeError);
    for (const kind of interactionKinds)
      for (const v of [
        NaN,
        Infinity,
        interactionLimits[kind].min - 1,
        interactionLimits[kind].max + 1,
      ])
        expect(() => interactionParameters(kind, 0, v)).toThrow(RangeError);
    const p = interactionParameters('standing', 0);
    for (const s of [-0.1, 1.1, NaN])
      expect(() => interactionReading(p, s)).toThrow(RangeError);
    expect(() => interactionSample(p, -1, 0)).toThrow(RangeError);
    expect(() => interactionSample(p, 0, -1)).toThrow(RangeError);
    expect(() => diffractionAmplitude(0, 0)).toThrow(RangeError);
    expect(() => diffractionAmplitude(2, 91)).toThrow(RangeError);
    expect(() => interactionPulse(0, 0.01, 0)).toThrow(RangeError);
  });
  it('registers five complete bilingual courses without altering the preceding eight', () => {
    expect(waveLessons).toHaveLength(8);
    expect(waveInteractionLessons).toHaveLength(5);
    for (const lesson of waveInteractionLessons) {
      expect(lesson.stage).toBe(6);
      expect(lesson.unit).toBe('waves');
      expect(lesson.questions).toHaveLength(3);
      expect(lesson.vocabulary).toHaveLength(4);
      expect(experiments.some((e) => e.id === lesson.kind)).toBe(true);
      expect(lessonCatalog.find((e) => e.id === lesson.id)?.pack).toBe(
        'waveInteractions',
      );
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
        'formula',
      ] as const) {
        expect(lesson[key]!.zh.length).toBeGreaterThan(3);
        expect(lesson[key]!.en.length).toBeGreaterThan(3);
      }
    }
  });
});
