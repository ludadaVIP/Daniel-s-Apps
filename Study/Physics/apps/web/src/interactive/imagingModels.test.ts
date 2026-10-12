import { describe, expect, it } from 'vitest';
import {
  imagingKinds,
  imagingParameters,
  imagingLimits,
  imagingRecord,
  lensImage,
  objectRay,
  lensTransfer,
  drift,
  screenBundle,
  opticalInstrument,
  clipSegment,
} from './imagingModels';
import { imagingLessons } from '../content/imaging';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { freshLesson, decodeProgress, isMastered } from '../progress';
const finite = (x: unknown): boolean =>
  typeof x === 'number'
    ? Number.isFinite(x)
    : x !== null && typeof x === 'object'
      ? Object.values(x).every(finite)
      : true;
describe('Imaging: signed positions, ray transfer and receiving planes', () => {
  it('recovers the image from independent intersections of two general rays', () => {
    for (const f of [-10, 10])
      for (const u of [5, 8, 11, 20, 30, 40])
        for (const h of [0.2, 0.5, 1.2]) {
          const a = objectRay(u, h, -0.75, f),
            b = objectRay(u, h, 0.75, f),
            v = (b.hit - a.hit) / (a.outgoing.slope - b.outgoing.slope),
            height = a.hit + v * a.outgoing.slope,
            m = lensImage(u, f, h);
          expect(m.v).toBeCloseTo(v, 10);
          expect(m.imageHeight).toBeCloseTo(height, 10);
          expect(1 / u + 1 / v).toBeCloseTo(1 / f, 12);
        }
  });
  it('preserves ray phase-space area through lenses and drifts, and reverses sequential transforms', () => {
    const a = { y: 0.2, slope: 0.03 },
      b = { y: -0.4, slope: -0.02 },
      w = (r: typeof a, s: typeof a) => r.y * s.slope - r.slope * s.y;
    for (const f of [-10, 10])
      for (const d of [-3, 2, 20]) {
        const at = drift(lensTransfer(a, f), d),
          bt = drift(lensTransfer(b, f), d);
        expect(w(at, bt)).toBeCloseTo(w(a, b), 12);
        const recovered = lensTransfer(drift(at, -d), -f);
        expect(recovered.y).toBeCloseTo(a.y, 12);
        expect(recovered.slope).toBeCloseTo(a.slope, 12);
      }
  });
  it('distinguishes finite real/virtual positions from parallel output at the exact focus', () => {
    expect(lensImage(30, 10).v).toBeCloseTo(15, 12);
    expect(lensImage(8, 10).v).toBeCloseTo(-40, 12);
    const focal = lensImage(10, 10);
    expect(focal.state).toBe('infinity');
    expect(focal.v).toBeNull();
    expect(focal.m).toBeNull();
    expect(focal.reciprocal).toBe(0);
    for (const H of [-0.75, 0, 0.75])
      expect(objectRay(10, 0.5, H, 10).outgoing.slope).toBeCloseTo(-0.05, 12);
    expect(lensImage(10 - 1e-4, 10).v).toBeLessThan(-100000);
    expect(lensImage(10 + 1e-4, 10).v).toBeGreaterThan(100000);
  });
  it('gives a smaller upright virtual image between every real object and a diverging lens', () => {
    for (let u = 5; u <= 40; u++) {
      const l = lensImage(u, -10);
      expect(l.state).toBe('virtual');
      expect(l.v).toBeGreaterThan(-u);
      expect(l.v).toBeLessThan(0);
      expect(l.m).toBeGreaterThan(0);
      expect(l.m).toBeLessThan(1);
    }
  });
  it('handles principal rays as special cases without forcing every ray through the focus', () => {
    expect(objectRay(30, 0.5, 0.5, 10).incoming.slope).toBe(0);
    expect(drift(objectRay(30, 0.5, 0.5, 10).outgoing, 10).y).toBeCloseTo(
      0,
      12,
    );
    expect(objectRay(30, 0.5, 0, 10).outgoing.slope).toBeCloseTo(-1 / 60, 12);
    expect(objectRay(30, 0.5, -0.25, 10).outgoing.slope).toBeCloseTo(0, 12);
    for (const H of [-0.75, -0.5, 0, 0.5, 0.75])
      expect(drift(objectRay(30, 0.5, H, 10).outgoing, 15).y).toBeCloseTo(
        -0.25,
        12,
      );
  });
  it('scales image height at fixed geometry, independently of angular magnification', () => {
    for (const u of [8, 20, 30]) {
      const a = lensImage(u, 10, 0.5),
        b = lensImage(u, 10, 1);
      expect(b.v).toBe(a.v);
      expect(b.m).toBe(a.m);
      expect(b.imageHeight).toBeCloseTo(a.imageHeight! * 2, 12);
    }
    expect(lensImage(30, 10).m).toBeCloseTo(-0.5, 12);
    expect(lensImage(8, 10).m).toBeCloseTo(5, 12);
  });
  it('maintains dimensional scale when all lengths are converted together', () => {
    const cm = lensImage(30, 10, 0.5),
      m = lensImage(0.3, 0.1, 0.005);
    expect(m.v).toBeCloseTo(cm.v! / 100, 12);
    expect(m.imageHeight).toBeCloseTo(cm.imageHeight! / 100, 12);
    expect(m.m).toBeCloseTo(cm.m!, 12);
  });
  it('derives receiving-plane spread from independently traced endpoint rays', () => {
    for (const u of [25, 100])
      for (const z of [4.5, 5, 6.25, 7])
        for (const a of [0.075, 0.3]) {
          const b = screenBundle(u, 0.5, 5, z, a),
            factor = 1 + z / u - z / 5;
          expect(b.centre).toBeCloseTo((-z * 0.5) / u, 12);
          expect(b.diameter).toBeCloseTo(2 * a * Math.abs(factor), 12);
          expect(b.heights.reduce((s, y) => s + y, 0) / 3).toBeCloseTo(
            b.centre,
            12,
          );
        }
  });
  it('accommodates a nearer object onto the fixed reduced-eye retina', () => {
    const far = imagingParameters('eye', 0),
      nearOld = imagingParameters('eye', 1),
      nearNew = imagingParameters('eye', 2);
    expect(far.z).toBe(1.7);
    expect(nearNew.z).toBe(1.7);
    expect(nearOld.f).toBe(far.f);
    expect(far.bundle.focused).toBe(true);
    expect(nearOld.bundle.focused).toBe(false);
    expect(nearNew.bundle.focused).toBe(true);
    expect(nearOld.lens.v).toBeGreaterThan(nearOld.z);
    expect(nearNew.value - far.value).toBeCloseTo(3, 12);
    expect(nearOld.bundle.diameter * 10).toBeCloseTo(0.0612, 12);
  });
  it('narrows defocus with a smaller pupil without shifting the ideal image or centroid', () => {
    const a = imagingParameters('camera', 1),
      b = imagingParameters('camera', 1, null, true),
      focused = imagingParameters('camera', 2);
    expect(a.lens.v).toBeCloseTo(6.25, 12);
    expect(b.lens.v).toBe(a.lens.v);
    expect(b.bundle.centre).toBe(a.bundle.centre);
    expect(a.bundle.diameter / b.bundle.diameter).toBeCloseTo(4, 12);
    expect(a.bundle.diameter * 10).toBeCloseTo(18 / 19, 12);
    expect(a.bundle.focused).toBe(false);
    expect(b.bundle.focused).toBe(false);
    expect(focused.bundle.focused).toBe(true);
  });
  it('collimates the telescope output with a focal-length ratio and changing separation', () => {
    for (const i of [0, 1])
      for (const fe of [2, 2.5, 5, 6]) {
        const m = opticalInstrument(i, fe);
        expect(m.z).toBe(m.fo + fe);
        expect(m.M).toBe(-m.fo / fe);
        for (const r of m.rays) {
          expect(drift(r.afterObjective, m.fo).y).toBeCloseTo(
            m.fo * m.theta,
            12,
          );
          expect(r.outgoing.slope / m.theta).toBeCloseTo(m.M, 12);
        }
      }
  });
  it('forms the microscope intermediate real image before a separate angular eyepiece stage', () => {
    for (const fe of [2, 2.5, 5, 6]) {
      const m = opticalInstrument(2, fe);
      expect(m.firstImage!.v).toBeCloseTo(6, 12);
      expect(m.firstImage!.m).toBeCloseTo(-5, 12);
      expect(m.z).toBeCloseTo(6 + fe, 12);
      expect(m.M).toBeCloseTo((-5 * 25) / fe, 12);
      for (const r of m.rays) {
        expect(drift(r.afterObjective, 6).y).toBeCloseTo(-0.05, 12);
        expect(r.outgoing.slope).toBeCloseTo(0.05 / fe, 12);
      }
    }
    expect(opticalInstrument(2, 2.5).M).toBeCloseTo(-50, 12);
  });
  it('clips long and off-axis paths to the display without changing underlying image positions', () => {
    const box = { left: -2, right: 3, bottom: -1, top: 1 };
    expect(clipSegment({ x: -100, y: 0 }, { x: 100, y: 0 }, box)).toEqual([
      { x: -2, y: 0 },
      { x: 3, y: 0 },
    ]);
    expect(clipSegment({ x: 0, y: -10 }, { x: 0, y: 10 }, box)).toEqual([
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ]);
    expect(clipSegment({ x: 0, y: 3 }, { x: 1, y: 3 }, box)).toBeNull();
    const l = lensImage(11, 10);
    expect(l.v).toBeCloseTo(110, 10);
    const r = objectRay(11, 0.5, 0.5, 10),
      clipped = clipSegment(
        { x: 0, y: 0.5 },
        { x: 60, y: drift(r.outgoing, 60).y },
        { left: -45, right: 60, bottom: -3.2, top: 3.2 },
      );
    expect(clipped).not.toBeNull();
    expect(l.v).toBeCloseTo(110, 10);
  });
  it('keeps all permitted preset/free states finite and rejects invalid configurations', () => {
    for (const kind of imagingKinds)
      for (const i of [0, 1, 2])
        for (const v of [
          null,
          imagingLimits[kind].min,
          imagingLimits[kind].max,
        ]) {
          const p = imagingParameters(kind, i, v);
          expect(finite(p)).toBe(true);
          expect(imagingRecord(p)).not.toMatch(/NaN|undefined cm/);
        }
    for (const kind of imagingKinds) {
      for (const v of [
        NaN,
        Infinity,
        imagingLimits[kind].min - 1,
        imagingLimits[kind].max + 1,
      ])
        expect(() => imagingParameters(kind, 0, v)).toThrow(RangeError);
      for (const i of [-1, 0.5, 3])
        expect(() => imagingParameters(kind, i)).toThrow(RangeError);
    }
    expect(() => imagingParameters('missing' as never, 0)).toThrow(RangeError);
    expect(() => imagingParameters('eye', 0, null, true)).toThrow(RangeError);
    expect(() => lensImage(0, 10)).toThrow(RangeError);
    expect(() => lensImage(10, 0)).toThrow(RangeError);
    expect(() => screenBundle(30, 0.5, 10, 0, 0.3)).toThrow(RangeError);
  });
  it('registers eight full bilingual Unit 6.3 courses while retaining old progress', () => {
    expect(lessons.slice(227, 235)).toEqual(imagingLessons);
    expect(imagingLessons.map((l) => l.kind)).toEqual(
      imagingKinds.map((k) => 'imaging-' + k),
    );
    const old = lessons[0]!;
    const previous = {
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
    for (const l of imagingLessons) {
      expect(l.stage).toBe(6);
      expect(l.unit).toBe('optics');
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('imaging');
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
      const answers = Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
        state = { ...previous, answers };
      expect(isMastered(l.id, state)).toBe(true);
      expect(isMastered(l.id, { ...state, explored: false })).toBe(false);
      expect(
        isMastered(l.id, {
          ...state,
          answers: {
            ...answers,
            3: (l.exit.correct + 1) % l.exit.options.length,
          },
        }),
      ).toBe(false);
    }
  });
});
