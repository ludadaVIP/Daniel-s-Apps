import { describe, expect, it } from 'vitest';
import {
  acousticKinds,
  acousticParameters,
  acousticReading,
  acousticLimits,
  acousticRecord,
  soundPacket,
  pressureLevel,
  soundIntensity,
  forcedResponse,
  columnSample,
  dopplerReading,
  echoReading,
  echoEnvelope,
  ultrasoundReading,
  ultrasoundEnvelope,
} from './acousticModels';
import { acousticLessons } from '../content/acoustics';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { units } from '../content/curriculum';
import { experiments } from '../content/experiments';
import { freshLesson, decodeProgress, isMastered } from '../progress';
const finiteTree = (v: unknown): boolean =>
  typeof v === 'number'
    ? Number.isFinite(v)
    : v !== null && typeof v === 'object'
      ? Object.values(v).every(finiteTree)
      : true;
const integral = (
  fn: (x: number) => number,
  a: number,
  b: number,
  n = 10000,
) => {
  let v = 0;
  for (let i = 0; i <= n; i++)
    v += (i === 0 || i === n ? 0.5 : 1) * fn(a + ((b - a) * i) / n);
  return (v * (b - a)) / n;
};
describe('Acoustics: local motion, measurements and echoes', () => {
  it('delays a compact packet without transporting its medium', () => {
    for (const i of [0, 1]) {
      const p = acousticParameters('propagation', i);
      expect(soundPacket(p, 1, 0.99 / p.c).displacement).toBe(0);
      expect(soundPacket(p, 1, 1 / p.c + 0.002).displacement).not.toBe(0);
      expect(soundPacket(p, 1, 1 / p.c + 0.011).displacement).toBe(0);
      expect(
        integral((t) => soundPacket(p, 1, t).velocity, 0, 0.025),
      ).toBeCloseTo(0, 12);
    }
  });
  it('connects pressure to the independent time derivative of displacement', () => {
    for (const i of [0, 1]) {
      const p = acousticParameters('propagation', i),
        t = 1 / p.c + 0.00321,
        h = 1e-8,
        s = soundPacket(p, 1, t);
      const v =
        (soundPacket(p, 1, t + h).displacement -
          soundPacket(p, 1, t - h).displacement) /
        (2 * h);
      expect(s.velocity).toBeCloseTo(v, 10);
      expect(s.pressure / (p.density * p.c)).toBeCloseTo(v, 10);
    }
  });
  it('satisfies the longitudinal wave equation and right-going pressure gradient', () => {
    const p = acousticParameters('propagation', 0),
      x = 0.7,
      t = 0.00623,
      hx = 1e-5,
      ht = hx / p.c,
      s = soundPacket(p, x, t);
    const dtt =
      (soundPacket(p, x, t + ht).displacement -
        2 * s.displacement +
        soundPacket(p, x, t - ht).displacement) /
      ht ** 2;
    const dxx =
      (soundPacket(p, x + hx, t).displacement -
        2 * s.displacement +
        soundPacket(p, x - hx, t).displacement) /
      hx ** 2;
    expect(dtt).toBeCloseTo(p.c * p.c * dxx, 5);
    expect(s.pressure).toBeCloseTo(
      (-p.density *
        p.c *
        p.c *
        (soundPacket(p, x + hx, t).displacement -
          soundPacket(p, x - hx, t).displacement)) /
        (2 * hx),
      6,
    );
  });
  it('has no mechanical sound, arrival or recorded wavelength in vacuum', () => {
    const p = acousticParameters('propagation', 2);
    for (const t of [0, 0.005, 0.02])
      expect(soundPacket(p, 1, t)).toEqual({
        displacement: 0,
        velocity: 0,
        pressure: 0,
      });
    expect(acousticRecord(p)).toContain('no arrival or sound wavelength');
  });
  it('keeps pressure and speed fixed while frequency changes both clocks and wavelength', () => {
    for (const [i, f] of [200, 400, 800].entries()) {
      const m = acousticReading(acousticParameters('pitch', i), 1);
      expect(m.frequency).toBe(f);
      expect(m.c).toBe(343);
      expect(m.rms).toBe(0.002);
      expect(m.frequency * m.wavelength).toBeCloseTo(343, 12);
      expect(0.01 * m.frequency).toBe([2, 4, 8][i]);
    }
  });
  it('derives RMS and intensity from independently integrated sine pressure', () => {
    for (const rms of [0.001, 0.002, 0.004, 0.01]) {
      const mean = integral(
        (t) => (Math.SQRT2 * rms * Math.cos(2 * Math.PI * 400 * t)) ** 2,
        0,
        0.01,
      );
      expect(Math.sqrt(mean / 0.01)).toBeCloseTo(rms, 12);
      expect(mean / (0.01 * 1.2 * 343)).toBeCloseTo(soundIntensity(rms), 15);
    }
  });
  it('separates doubled pressure, quadrupled intensity and a 6.02 dB increment', () => {
    expect(pressureLevel(0.002)).toBeCloseTo(40, 12);
    expect(pressureLevel(0.004) - pressureLevel(0.002)).toBeCloseTo(
      6.020599913,
      9,
    );
    expect(soundIntensity(0.004) / soundIntensity(0.002)).toBeCloseTo(4, 12);
    expect(pressureLevel(20e-6)).toBe(0);
    expect(pressureLevel(2e-6)).toBeCloseTo(-20, 12);
  });
  it('satisfies initial rest and the driven oscillator differential equation', () => {
    for (const f of [0.5, 1, 2, 3, 3.5]) {
      const initial = forcedResponse(f, 0);
      expect(initial.displacement).toBeCloseTo(0, 12);
      expect(initial.velocity).toBeCloseTo(0, 12);
      for (const t of [0.03, 0.4, 1.23, 7]) {
        const h = 1e-5,
          m = forcedResponse(f, t);
        expect(
          (forcedResponse(f, t + h).displacement -
            forcedResponse(f, t - h).displacement) /
            (2 * h),
        ).toBeCloseTo(m.velocity, 8);
        expect(
          (forcedResponse(f, t + h).velocity -
            forcedResponse(f, t - h).velocity) /
            (2 * h),
        ).toBeCloseTo(m.acceleration, 7);
      }
    }
  });
  it('matches an independent fourth-order numerical initial-value solution', () => {
    const dt = 0.0005,
      w0 = 4 * Math.PI,
      damping = 2 * 0.15 * w0;
    for (const f of [1, 2, 3]) {
      let x = 0,
        v = 0;
      const acceleration = (t: number, q: number, u: number) =>
        0.1 * Math.cos(2 * Math.PI * f * t) - damping * u - w0 * w0 * q;
      for (let i = 0; i < 16000; i++) {
        const t = i * dt,
          a1 = acceleration(t, x, v),
          v2 = v + (a1 * dt) / 2,
          x2 = x + (v * dt) / 2,
          a2 = acceleration(t + dt / 2, x2, v2),
          v3 = v + (a2 * dt) / 2,
          x3 = x + (v2 * dt) / 2,
          a3 = acceleration(t + dt / 2, x3, v3),
          v4 = v + a3 * dt,
          x4 = x + v3 * dt,
          a4 = acceleration(t + dt, x4, v4);
        x += (dt * (v + 2 * v2 + 2 * v3 + v4)) / 6;
        v += (dt * (a1 + 2 * a2 + 2 * a3 + a4)) / 6;
      }
      expect(x).toBeCloseTo(forcedResponse(f, 8).displacement, 10);
      expect(v).toBeCloseTo(forcedResponse(f, 8).velocity, 9);
    }
  });
  it('balances mechanical energy against force work minus damping loss', () => {
    for (const f of [1, 2, 3]) {
      const m = forcedResponse(f, 8),
        w0 = 4 * Math.PI,
        E = 0.5 * m.velocity ** 2 + 0.5 * w0 * w0 * m.displacement ** 2;
      const work = integral(
        (t) => {
          const s = forcedResponse(f, t);
          return s.force * s.velocity - 2 * 0.15 * w0 * s.velocity * s.velocity;
        },
        0,
        8,
        40000,
      );
      expect(work).toBeCloseTo(E, 9);
    }
  });
  it('distinguishes the largest prescribed response from the exact damped peak', () => {
    const peak = 2 * Math.sqrt(1 - 2 * 0.15 ** 2);
    expect(peak).toBeCloseTo(1.954482028, 8);
    expect(forcedResponse(peak, 8).steadyAmplitude).toBeGreaterThan(
      forcedResponse(2, 8).steadyAmplitude,
    );
    expect(forcedResponse(2, 8).steadyAmplitude).toBeGreaterThan(
      forcedResponse(1, 8).steadyAmplitude,
    );
    expect(forcedResponse(2, 8).steadyAmplitude).toBeGreaterThan(
      forcedResponse(3, 8).steadyAmplitude,
    );
  });
  it('keeps open-end pressure and closed-end displacement nodes zero at all times', () => {
    for (let i = 0; i < 3; i++)
      for (const L of [0.2, 0.5, 1]) {
        const p = acousticParameters('columns', i, L);
        for (let j = 0; j <= 40; j++) {
          const t = (p.duration * j) / 40;
          expect(columnSample(p, L, t).pressure).toBeCloseTo(0, 12);
          expect(
            p.closed
              ? columnSample(p, 0, t).displacement
              : columnSample(p, 0, t).pressure,
          ).toBeCloseTo(0, 12);
        }
      }
  });
  it('couples air-column boundaries and length with complementary modal shapes', () => {
    const f = [343, 171.5, 343];
    for (let i = 0; i < 3; i++) {
      const p = acousticParameters('columns', i),
        m = acousticReading(p, 0);
      expect(p.frequency).toBe(f[i]);
      expect(m.wavelength).toBe((p.closed ? 4 : 2) * p.length);
      const s = columnSample(p, p.length / 3, 0);
      expect(
        s.displacement * s.displacement + s.pressure * s.pressure,
      ).toBeCloseTo(1, 12);
    }
  });
  it('emits fronts from past source locations with physical propagation radii', () => {
    const p = acousticParameters('doppler', 0),
      m = dopplerReading(p, 0.02);
    for (const front of m.fronts) {
      expect(front.centre).toBeCloseTo(68.6 * front.emitted, 12);
      expect(front.radius).toBeCloseTo(343 * (0.02 - front.emitted), 12);
      expect(front.centre + 343 * (front.arrival - front.emitted)).toBeCloseTo(
        5,
        12,
      );
    }
  });
  it('derives received intervals independently from consecutive arrival times', () => {
    for (const M of [-0.4, -0.2, 0, 0.2, 0.4]) {
      const p = acousticParameters('doppler', 0, M),
        m = dopplerReading(p, 0.02);
      const arrivals = m.fronts.map(
        (front) => front.emitted + (5 - front.centre) / 343,
      );
      for (let i = 1; i < arrivals.length; i++)
        expect(1 / (arrivals[i]! - arrivals[i - 1]!)).toBeCloseTo(
          m.observedFrequency,
          8,
        );
      expect(m.spacingAhead * m.observedFrequency).toBeCloseTo(343, 10);
      expect(m.firstArrival).toBeCloseTo(5 / 343, 12);
    }
  });
  it('counts arrivals only after they reach the receiver', () => {
    const p = acousticParameters('doppler', 0),
      first = 5 / 343;
    expect(dopplerReading(p, first - 1e-7).arrivals).toBe(0);
    expect(dopplerReading(p, first).arrivals).toBe(1);
    expect(dopplerReading(p, first + 0.002 - 1e-7).arrivals).toBe(1);
    expect(dopplerReading(p, first + 0.002).arrivals).toBe(2);
  });
  it('ranges from a round trip and leaves range empty before receipt', () => {
    for (let i = 0; i < 3; i++) {
      const p = acousticParameters('echo', i),
        m = echoReading(p, 0.02);
      expect(m.roundTrip).toBeCloseTo((2 * p.distance) / 343, 12);
      expect(echoReading(p, m.roundTrip - 1e-7).inferredDistance).toBeNull();
      expect(echoReading(p, m.roundTrip).inferredDistance).toBeCloseTo(
        p.distance,
        12,
      );
      expect(echoReading(p, p.distance / 343).front).toBeCloseTo(
        p.distance,
        12,
      );
      expect(m.front).toBe(0);
    }
  });
  it('does not confuse known geometry with a measured echo in the blind region', () => {
    const p = acousticParameters('echo', 0, 0.02),
      m = echoReading(p, 0.02);
    expect(m.minimumRange).toBe(0.08575);
    expect(m.detectable).toBe(false);
    expect(m.inferredDistance).toBeNull();
    expect(
      echoReading(acousticParameters('echo', 0, 0.1), 0.02).detectable,
    ).toBe(true);
    expect(acousticRecord(p)).toContain('not measured');
  });
  it('has an eight-cycle compact envelope with correct onset and peak', () => {
    const m = echoReading(acousticParameters('echo', 0), 0);
    expect(m.pulseDuration).toBe(0.0002);
    expect(echoEnvelope(0.001, 0.001, m.pulseDuration)).toBe(0);
    expect(echoEnvelope(0.0011, 0.001, m.pulseDuration)).toBeCloseTo(1, 12);
    expect(echoEnvelope(0.0013, 0.001, m.pulseDuration)).toBe(0);
  });
  it('maps ultrasound echo time to the actual two interface depths', () => {
    for (const f of [2, 5, 10])
      for (const gap of [0.1, 1, 2]) {
        const m = ultrasoundReading(f, gap);
        expect((m.echoes[0]!.time * 1540) / 2).toBeCloseTo(0.03, 12);
        expect(
          ((m.echoes[1]!.time - m.echoes[0]!.time) * 1540) / 2,
        ).toBeCloseTo(gap * 0.001, 12);
      }
  });
  it('verifies Gaussian half-maximum width and its axial distance conversion', () => {
    for (const f of [2, 5, 10]) {
      const m = ultrasoundReading(f, 1),
        e = m.echoes[0]!;
      const peak = e.amplitude,
        half =
          e.amplitude *
          Math.exp(-4 * Math.log(2) * (m.pulseFWHM / 2 / m.pulseFWHM) ** 2);
      expect(half / peak).toBeCloseTo(0.5, 12);
      expect(m.axialFWHM * 1000).toBeCloseTo(
        [1.54, 0.616, 0.308][[2, 5, 10].indexOf(f)]!,
        12,
      );
    }
  });
  it('applies round-trip frequency-dependent amplitude loss without automatic gain', () => {
    for (const [i, f] of [2, 5, 10].entries()) {
      const e = ultrasoundReading(f, 1).echoes[0]!;
      expect(e.lossDB).toBe([6, 15, 30][i]);
      expect(20 * Math.log10(e.amplitude)).toBeCloseTo(-e.lossDB, 12);
    }
    expect(ultrasoundReading(10, 1).echoes[0]!.amplitude).toBeLessThan(
      ultrasoundReading(2, 1).echoes[0]!.amplitude,
    );
  });
  it('resolves two one-millimetre interfaces at shorter pulses without inventing a resolution cutoff', () => {
    const countPeaks = (f: number) => {
      const values = Array.from({ length: 2001 }, (_, i) =>
        ultrasoundEnvelope(f, 1, (35 + (10 * i) / 2000) * 1e-6),
      );
      return values
        .slice(1, -1)
        .filter((v, i) => v > values[i]! && v > values[i + 2]!).length;
    };
    expect(countPeaks(2)).toBe(1);
    expect(countPeaks(5)).toBe(2);
    expect(countPeaks(10)).toBe(2);
  });
  it('keeps canonical and free edge readings finite and rejects invalid inputs', () => {
    for (const kind of acousticKinds)
      for (let i = 0; i < 3; i++)
        for (const custom of [
          null,
          acousticLimits[kind].min,
          acousticLimits[kind].max,
        ]) {
          const p = acousticParameters(kind, i, custom);
          for (const progress of [0, 0.5, 1]) {
            const s = acousticReading(p, progress);
            expect(finiteTree(s)).toBe(true);
          }
          expect(acousticRecord(p)).not.toMatch(/NaN|Infinity/);
        }
    for (const kind of acousticKinds) {
      for (const v of [
        NaN,
        Infinity,
        acousticLimits[kind].min - 1,
        acousticLimits[kind].max + 1,
      ])
        expect(() => acousticParameters(kind, 0, v)).toThrow(RangeError);
      for (const i of [-1, 0.5, 3])
        expect(() => acousticParameters(kind, i)).toThrow(RangeError);
    }
    expect(() => acousticParameters('missing' as never, 0)).toThrow(RangeError);
    expect(() => acousticReading(acousticParameters('echo', 0), 1.1)).toThrow(
      RangeError,
    );
    expect(() => pressureLevel(0)).toThrow(RangeError);
    expect(() => forcedResponse(2, -1)).toThrow(RangeError);
  });
  it('registers eight complete bilingual courses and stations in Unit 6.2', () => {
    expect(Object.keys(units).indexOf('waves')).toBeLessThan(
      Object.keys(units).indexOf('acoustics'),
    );
    expect(lessons.slice(212, 220)).toEqual(acousticLessons);
    expect(acousticLessons.map((l) => l.kind)).toEqual(
      acousticKinds.map((k) => 'acoustics-' + k),
    );
    for (const l of acousticLessons) {
      expect(l.stage).toBe(6);
      expect(l.unit).toBe('acoustics');
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('acoustics');
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
      for (const q of [...l.questions, l.exit])
        expect(q.options[q.correct]).toBeDefined();
    }
  });
  it('preserves earlier progress while requiring observation and correct exit mastery', () => {
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
    for (const l of acousticLessons) {
      const current = {
        ...previous,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, current)).toBe(true);
      expect(isMastered(l.id, { ...current, explored: false })).toBe(false);
      expect(
        isMastered(l.id, { ...current, answers: { ...current.answers, 3: 1 } }),
      ).toBe(false);
    }
  });
});
