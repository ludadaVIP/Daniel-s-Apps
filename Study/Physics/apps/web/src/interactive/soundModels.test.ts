import { describe, expect, it } from 'vitest';
import {
  arrivalTime,
  pulseDisplacement,
  toneModel,
  soundEcho,
  sourceCases,
  soundMedia,
  echoCases,
} from './soundModels';
import { units } from '../content/curriculum';
import { lessons } from '../content/lessons';
import { phaseLessons } from '../content/phase';
import { soundLessons } from '../content/sound';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';
import { emptyInsulation } from '../insulation';
describe('sound evidence models and courses', () => {
  it('starts a finite two-cycle signal and retains its propagation after the source stops', () => {
    expect(pulseDisplacement(0, 0.00125, 0.1, 343)).toBeCloseTo(0.1);
    expect(pulseDisplacement(0, 0.012, 0.1, 343)).toBe(0);
    expect(pulseDisplacement(6.86, 0.012, 0.1, 343)).toBe(0);
    expect(pulseDisplacement(6.86, 0.02125, 0.1, 343)).toBeCloseTo(0.1);
    expect(pulseDisplacement(6.86, 0.031, 0.1, 343)).toBe(0);
    for (const x of [0, 2, 6.86, 10.29])
      for (const t of [0, 0.001, 0.015, 0.025, 0.03])
        expect(pulseDisplacement(x, t, 0, 343)).toBe(0);
  });
  it('keeps local oscillations bounded about equilibrium and doubles displacement without changing arrival', () => {
    for (const speed of [343, 1480])
      for (const x of [0, 4.677, 6.86]) {
        const t = arrivalTime(x, speed)!;
        expect(pulseDisplacement(x, t + 0.00125, 0.2, speed)).toBeCloseTo(
          2 * pulseDisplacement(x, t + 0.00125, 0.1, speed),
        );
        expect(pulseDisplacement(x, t + 0.01, 0.1, speed)).toBeCloseTo(0);
        for (let i = 0; i <= 100; i++)
          expect(
            Math.abs(pulseDisplacement(x, i * 0.0003, 0.2, speed)),
          ).toBeLessThanOrEqual(0.2);
      }
    expect(sourceCases.map((c) => c.amplitude)).toEqual([0.1, 0.2, 0]);
  });
  it('distinguishes no vacuum propagation from zero travel time and uses stated medium speeds', () => {
    expect(arrivalTime(6.86, 343)).toBeCloseTo(0.02);
    expect(arrivalTime(6.86, 1480)).toBeCloseTo(0.004635135135);
    expect(arrivalTime(6.86, undefined)).toBeUndefined();
    expect(pulseDisplacement(6.86, 0.03, 0.1, undefined)).toBe(0);
    expect(soundMedia.map((c) => c.speed)).toEqual([343, 1480, undefined]);
  });
  it('counts cycles in shared time and scales period/wavelength at unchanged air speed', () => {
    expect([200, 400, 800].map((f) => toneModel(f, 0.5).cycles)).toEqual([
      2, 4, 8,
    ]);
    expect([200, 400, 800].map((f) => toneModel(f, 0.5).periodMs)).toEqual([
      5, 2.5, 1.25,
    ]);
    expect(toneModel(200, 0.5).wavelength).toBe(1.715);
    expect(toneModel(800, 0.5).wavelength).toBe(0.42875);
    for (const f of [200, 350, 400, 800])
      expect(toneModel(f, 0.5).wavelength * f).toBeCloseTo(343);
    expect(toneModel(400, 0.5, 0.005).cycles).toBe(2);
  });
  it('scales relative pressure peaks and bounded tone gain without changing cycles or promising perceived ratios', () => {
    for (const amp of [0.25, 0.5, 1]) {
      const s = toneModel(400, amp, 0.000625);
      expect(s.pressure).toBeCloseTo(amp);
      expect(s.periodMs).toBe(2.5);
      expect(s.audioGain).toBeLessThanOrEqual(0.015);
      expect(toneModel(400, amp).cycles).toBe(4);
    }
  });
  it('tracks outgoing and returning pulse fronts without confusing travel with range', () => {
    const outward = soundEcho(34.3, 2000, 0.05);
    expect(outward.returnTime).toBeCloseTo(0.2);
    expect(outward.position).toBeCloseTo(17.15);
    expect(outward.travelled).toBeCloseTo(17.15);
    expect(outward).toMatchObject({ returning: false, arrived: false });
    expect(soundEcho(34.3, 2000, 0.15).position).toBeCloseTo(17.15);
    const end = soundEcho(34.3, 2000, 0.2);
    expect(end).toMatchObject({
      position: 0,
      travelled: 68.6,
      returning: true,
      arrived: true,
    });
    expect(soundEcho(34.3, 2000, 0.25)).toEqual(end);
    expect(soundEcho(17.15, 2000, 0.2).returnTime).toBeCloseTo(0.1);
  });
  it('changes carrier frequency and wavelength while retaining round-trip time and defining ultrasound separately', () => {
    const low = soundEcho(34.3, 2000, 0.2),
      high = soundEcho(34.3, 40000, 0.2);
    expect(high.returnTime).toBe(low.returnTime);
    expect(high.position).toBe(low.position);
    expect(high.wavelength).toBeCloseTo(low.wavelength / 20);
    expect(high.ultrasound).toBe(true);
    expect(low.ultrasound).toBe(false);
    expect(soundEcho(1, 20000, 0).ultrasound).toBe(false);
    echoCases.forEach((c, i) =>
      expect(soundEcho(c.distance, c.frequency, 0).returnTime).toBeCloseTo(
        [0.1, 0.2, 0.2][i]!,
      ),
    );
  });
  it('rejects invalid/nonfinite physical and audio settings instead of drawing impossible values', () => {
    for (const fn of [
      () => arrivalTime(-1, 343),
      () => arrivalTime(10, 0),
      () => arrivalTime(Infinity, undefined),
      () => pulseDisplacement(1, -0.1, 0.1, 343),
      () => pulseDisplacement(1, NaN, 0.1, 343),
      () => pulseDisplacement(1, 0.01, 0.3, 343),
      () => toneModel(0, 0.5),
      () => toneModel(400, 2),
      () => toneModel(400, 0.5, 0.02),
      () => toneModel(Infinity, 0.5),
      () => soundEcho(0, 2000, 0),
      () => soundEcho(1, 2000, Infinity),
      () => soundEcho(1, -1, 0),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('adds five complete bilingual courses in sound unit order, retaining prior course ids and assessments', () => {
    const start = lessons.findIndex((l) => l.id === soundLessons[0]!.id);
    expect(start).toBe(59);
    const stageUnits = [
      ...new Set(lessons.filter((l) => l.stage === 2).map((l) => l.unit)),
    ];
    expect(
      Object.keys(units).filter((k) =>
        stageUnits.includes(k as (typeof stageUnits)[number]),
      ),
    ).toEqual(stageUnits);
    expect(lessons.slice(55, 59).map((l) => l.id)).toEqual(
      phaseLessons.map((l) => l.id),
    );
    expect(lessons.slice(start, start + 5)).toEqual(soundLessons);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of soundLessons) {
      expect(l.stage).toBe(2);
      expect(l.unit).toBe('sound');
      expect(l.questions).toHaveLength(3);
      expect(l.minutes).toBeGreaterThanOrEqual(12);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
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
        expect(l[key].zh).toBeTruthy();
        expect(l[key].en).toBeTruthy();
      }
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.options[q.correct]?.en).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
    const first = lessons[0]!,
      old = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        completedAt: 1,
        answers: Object.fromEntries(
          [...first.questions, first.exit].map((q, i) => [i, q.correct]),
        ),
      },
      draft = { ...emptyInsulation(), fields: { question: 'my saved cups' } };
    const decoded = decodeProgress(
      JSON.stringify({
        lessons: { [first.id]: old },
        notes: [],
        insulationProject: draft,
      }),
    );
    expect(decoded.lessons[first.id]?.completedAt).toBe(1);
    expect(decoded.insulationProject?.fields.question).toBe('my saved cups');
  });
});
