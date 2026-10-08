import { describe, expect, it } from 'vitest';
import {
  pointShadow,
  shadowCases,
  reflection,
  planeMirror,
  refraction,
  refractionCases,
  thinLens,
  lensCases,
  eyeFocus,
  eyeCases,
  colourBands,
  colourCases,
  prismRay,
  prismVertices,
  prismEntry,
  transmittedBands,
  pointOnPath,
} from './lightModels';
import { lightLessons } from '../content/light';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { units } from '../content/curriculum';
import { decodeProgress, freshLesson } from '../progress';
import { emptyInsulation } from '../insulation';
const rad = (v: number) => (v * Math.PI) / 180;
describe('light paths and evidence', () => {
  it('projects point-source boundary rays with a fixed screen and separates distance from size changes', () => {
    expect(
      shadowCases.map((c) => pointShadow(c.distance, c.height).shadowHeight),
    ).toEqual([3, 2, 4]);
    expect(pointShadow(2, 1, 8).shadowHeight).toBe(4);
    for (const d of [1, 2, 3, 4])
      for (const h of [0.25, 1, 2]) {
        const m = pointShadow(d, h);
        expect(h / 2 / d).toBeCloseTo(m.shadowHeight / 2 / m.screen);
      }
  });
  it('uses the normal for equal reflection angles, keeping surface angles complementary', () => {
    for (const a of [0, 20, 45, 60, 75]) {
      const m = reflection(a);
      expect(m.incidence).toBe(m.reflected);
      expect(m.incidence + m.toSurface).toBe(90);
    }
    expect(planeMirror(0.6)).toMatchObject({
      objectDistance: 0.6,
      imageDistance: 0.6,
      separation: 1.2,
      magnification: 1,
    });
  });
  it('refracts reversibly, changes speed without turning at normal incidence, and does not invent a ray beyond critical', () => {
    const first = refraction(45, false),
      back = refraction(first.transmitted!, true);
    expect(first.transmitted).toBeCloseTo(32.04, 2);
    expect(back.transmitted).toBeCloseTo(45);
    expect(refraction(0, false).transmitted).toBe(0);
    expect(refraction(0, false).speedRatio).not.toBe(1);
    for (const c of refractionCases) {
      const m = refraction(c.incidence, c.fromWater);
      expect(m.n1 * Math.sin(rad(c.incidence))).toBeCloseTo(
        m.n2 * Math.sin(rad(m.transmitted!)),
      );
    }
    expect(refraction(30, true).transmitted).toBeCloseTo(41.8, 2);
    expect(refraction(45, true).totalReflection).toBe(false);
    expect(refraction(50, true)).toMatchObject({
      totalReflection: true,
      transmitted: undefined,
    });
    expect(refraction(60, true).critical).toBeCloseTo(48.61, 2);
  });
  it('distinguishes real inverted from virtual upright lens images and handles an object exactly at focus', () => {
    const models = lensCases.map((c) => thinLens(c.object, c.focal));
    models.forEach((m, i) => {
      expect(m.image).toBeCloseTo([1.5, 2, -3][i]!);
      expect(m.magnification).toBeCloseTo([-0.5, -1, 4][i]!);
      expect(1 / m.object + 1 / m.image!).toBeCloseTo(1 / m.focal);
    });
    expect(models.map((m) => m.real)).toEqual([true, true, false]);
    // The rendered centre and parallel rays must share the calculated tip at signed image distance.
    for (const m of models) {
      const centre = -m.image! / m.object,
        parallel = 1 - m.image! / m.focal;
      expect(centre).toBeCloseTo(parallel);
      expect(centre).toBeCloseTo(m.magnification!);
    }
    expect(thinLens(1, 1)).toMatchObject({
      image: undefined,
      magnification: undefined,
      real: false,
    });
  });
  it('keeps the retina fixed and restores focusing with stronger convergence instead of moving the screen', () => {
    const m = eyeCases.map((c) => eyeFocus(c.object, c.focal));
    expect(m.map((x) => x.retina)).toEqual([1.5, 1.5, 1.5]);
    expect(m.map((x) => x.focused)).toEqual([true, false, true]);
    expect(m[1]!.image).toBe(2);
    expect(m[1]!.spread).toBeCloseTo(0.25);
    expect(m[2]!.image).toBeCloseTo(1.5);
    expect(m[2]!.spread).toBeCloseTo(0);
    expect(m[2]!.focal).toBeLessThan(m[1]!.focal);
  });
  it('traces a single actual prism with equal input direction, two Snell refractions and wavelength-dependent deviation', () => {
    const [a, b, c] = prismVertices;
    expect(Math.hypot(b!.x - a!.x, b!.y - a!.y)).toBeCloseTo(142);
    expect(Math.hypot(c!.x - b!.x, c!.y - b!.y)).toBeCloseTo(142);
    const models = colourBands.map((b) => prismRay(b.n));
    expect(models[0]!.deviation).toBeLessThan(models[1]!.deviation);
    expect(models[1]!.deviation).toBeLessThan(models[2]!.deviation);
    for (const m of models) {
      const direction =
        (Math.atan2(m.exit.y - prismEntry.y, m.exit.x - prismEntry.x) * 180) /
        Math.PI;
      expect(direction).toBeCloseTo(m.insideAngle);
      expect(Math.sin(rad(45))).toBeCloseTo(
        m.index * Math.sin(rad(45 - direction)),
      );
      expect(m.index * Math.sin(rad(m.r2))).toBeCloseTo(
        Math.sin(rad(m.exitAngle)),
      );
      // Exit is on the same physical right prism face, not independently drawn colour endpoints.
      expect((m.exit.x - b!.x) / (c!.x - b!.x)).toBeCloseTo(
        (m.exit.y - b!.y) / (c!.y - b!.y),
      );
      expect(
        (Math.atan2(m.end.y - m.exit.y, m.end.x - m.exit.x) * 180) / Math.PI,
      ).toBeCloseTo(m.deviation);
      expect(m.end.y).toBeLessThan(398);
    }
  });
  it('selects only existing spectral bands through ideal filters, with no colour creation', () => {
    expect(
      colourCases.map(
        (c) => transmittedBands(c, 'none').filter(Boolean).length,
      ),
    ).toEqual([3, 1, 2]);
    expect(transmittedBands(colourCases[0]!, 'red')).toEqual([
      true,
      false,
      false,
    ]);
    expect(transmittedBands(colourCases[1]!, 'blue')).toEqual([
      false,
      false,
      false,
    ]);
    expect(transmittedBands(colourCases[2]!, 'blue')).toEqual([
      false,
      false,
      false,
    ]);
  });
  it('places tracing markers on real segments and rejects nonfinite or impossible inputs', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 4 },
    ];
    expect(pointOnPath(path, 0)).toEqual(path[0]);
    expect(pointOnPath(path, 1)).toEqual(path[2]);
    expect(pointOnPath(path, 3 / 7)).toEqual(path[1]);
    expect(pointOnPath(path, 0.5)).toEqual({ x: 3, y: 0.5 });
    for (const fn of [
      () => pointShadow(0, 1),
      () => pointShadow(4, 1, 4),
      () => reflection(90),
      () => reflection(NaN),
      () => planeMirror(-1),
      () => refraction(Infinity, false),
      () => thinLens(0, 1),
      () => thinLens(2, 0),
      () => eyeFocus(2, 1, NaN),
      () => prismRay(NaN),
      () => transmittedBands([true], 'none'),
      () => pointOnPath(path, 1.1),
      () =>
        pointOnPath(
          [
            { x: NaN, y: 0 },
            { x: 1, y: 1 },
          ],
          0.5,
        ),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('adds seven complete bilingual courses after sound without losing earlier mastery or projects', () => {
    expect(lessons.slice(64, 71)).toEqual(lightLessons);
    const stageUnits = [
      ...new Set(lessons.filter((l) => l.stage === 2).map((l) => l.unit)),
    ];
    expect(
      Object.keys(units).filter((k) =>
        stageUnits.includes(k as (typeof stageUnits)[number]),
      ),
    ).toEqual(stageUnits);
    for (const l of lightLessons) {
      expect(l.unit).toBe('light');
      expect(l.stage).toBe(2);
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('light');
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
        expect(l[key].zh).toBeTruthy();
        expect(l[key].en).toBeTruthy();
      }
      for (const a of [...l.questions, l.exit]) {
        expect(a.options[a.correct]?.zh).toBeTruthy();
        expect(a.options[a.correct]?.en).toBeTruthy();
        expect(a.explanation.zh).toBeTruthy();
        expect(a.explanation.en).toBeTruthy();
      }
    }
    const earlier = lessons[59]!,
      saved = {
        ...freshLesson(),
        explored: true,
        prediction: 0,
        completedAt: 123,
        answers: Object.fromEntries(
          [...earlier.questions, earlier.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const decoded = decodeProgress(
      JSON.stringify({
        lessons: { [earlier.id]: saved },
        notes: [],
        insulationProject: {
          ...emptyInsulation(),
          fields: { question: 'keep my two cups' },
        },
      }),
    );
    expect(decoded.lessons[earlier.id]?.completedAt).toBe(123);
    expect(decoded.insulationProject?.fields.question).toBe('keep my two cups');
  });
});
