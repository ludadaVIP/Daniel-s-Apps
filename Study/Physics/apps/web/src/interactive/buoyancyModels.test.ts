import { describe, expect, it } from 'vitest';
import {
  displacedFluid,
  submergedRelease,
  releaseCases,
  pressureUpthrust,
  pressureBuoyancyCases,
  immersionReading,
  immersionCases,
  hangingBuoyancy,
  archimedesCases,
  sealedShip,
  shipCases,
  submarineBallast,
  submarineCases,
  hotAirBalloon,
  balloonCases,
} from './buoyancyModels';
import { buoyancyLessons } from '../content/buoyancy';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';
import { emptyPeriscope } from '../periscope';
describe('buoyancy from actual displaced fluid and whole-system force accounting', () => {
  it('converts mL to cubic metres before fluid mass and weight', () => {
    const m = displacedFluid(1000, 100);
    expect(m.volumeM3).toBe(0.0001);
    expect(m.massKg).toBe(0.1);
    expect(m.buoyancy).toBe(1);
    expect(displacedFluid(1000, 0).buoyancy).toBe(0);
  });
  it('keeps buoyancy on sinking bodies and compares opposing initial forces', () => {
    const rows = releaseCases.map((v) => submergedRelease(v, 200));
    expect(rows.map((m) => m.buoyancy)).toEqual([2, 2, 2]);
    expect(rows.map((m) => m.state)).toEqual(['up', 'neutral', 'down']);
    expect(rows[0]!.netUp).toBeCloseTo(0.8);
    expect(rows[1]!.netUp).toBe(0);
    expect(rows[2]!.netUp).toBe(-1);
    expect(rows[2]!.equilibriumMl).toBeUndefined();
  });
  it('reduces displacement to match weight at surface floating balance', () => {
    const initial = submergedRelease(0.12, 200),
      final = displacedFluid(1000, initial.equilibriumMl!);
    expect(initial.equilibriumMl).toBeCloseTo(120);
    expect(final.buoyancy).toBeCloseTo(initial.weight);
    expect(final.buoyancy).toBeLessThan(initial.buoyancy);
  });
  it('derives upthrust from face pressures, with depth-independent differences for rigid full immersion', () => {
    for (const c of pressureBuoyancyCases) {
      const m = pressureUpthrust(c.topDepth, c.density);
      expect(m.net).toBeCloseTo(displacedFluid(c.density, m.volumeMl).buoyancy);
      expect(m.up - m.down).toBeCloseTo(m.net);
      expect(m.volumeMl).toBe(100);
    }
    const a = pressureUpthrust(0.1, 1000),
      b = pressureUpthrust(0.3, 1000);
    expect(a.net).toBeCloseTo(1);
    expect(b.net).toBeCloseTo(a.net);
    expect(b.down).toBeGreaterThan(a.down);
  });
  it('conserves displaced volume while an externally held block is partly immersed', () => {
    expect(immersionCases.map((v) => immersionReading(v).after)).toEqual([
      150, 200, 250,
    ]);
    for (const f of [0, 0.2, 0.5, 0.8, 1]) {
      const m = immersionReading(f);
      expect(m.after - m.before).toBe(m.submergedMl);
      expect(m.submergedMl).toBe(m.fullVolume * f);
      expect(m.blockAreaCm2 * m.blockHeightCm).toBe(m.fullVolume);
      expect((m.after - m.before) / m.vesselAreaCm2).toBeCloseTo(2 * f);
    }
  });
  it('balances tension plus buoyancy against unchanged body weight', () => {
    const rows = archimedesCases.map((c) =>
      hangingBuoyancy(c.volume, c.density),
    );
    rows.forEach((m, i) => expect(m.tension).toBeCloseTo([2, 1, 1.8][i]!));
    for (const m of rows) {
      expect(m.bodyMass).toBe(0.3);
      expect(m.tension + m.buoyancy).toBeCloseTo(m.weight);
    }
  });
  it('changes displaced-fluid weight with density even at matched submerged volume', () => {
    expect(
      hangingBuoyancy(100, 1200).buoyancy / hangingBuoyancy(100, 1000).buoyancy,
    ).toBeCloseTo(1.2);
    expect(
      pressureUpthrust(0.1, 1200).net / pressureUpthrust(0.1, 1000).net,
    ).toBeCloseTo(1.2);
  });
  it('distinguishes actual floating support from maximum sealed-hull capacity', () => {
    const rows = shipCases.map((c) => sealedShip(c.box, c.cargo));
    expect(rows.map((m) => m.state)).toEqual(['down', 'up', 'down']);
    expect(rows.map((m) => m.shownVolume)).toEqual([120, 300, 500]);
    rows.forEach((m, i) =>
      expect(m.shownBuoyancy).toBeCloseTo([1.2, 3, 5][i]!),
    );
    expect(rows[1]!.maximumBuoyancy).toBe(5);
    expect(rows[1]!.shownNetUp).toBe(0);
    expect(rows[2]!.shownNetUp).toBeCloseTo(-1.5);
  });
  it('increases box-hull draft with cargo and preserves excluded volume even beyond the neutral boundary', () => {
    const light = sealedShip(true, 0),
      loaded = sealedShip(true, 0.1),
      boundary = sealedShip(true, 0.2),
      sinking = sealedShip(true, 0.35);
    expect(loaded.shownVolume).toBeCloseTo(400);
    expect(loaded.shownVolume).toBeGreaterThan(light.shownVolume);
    expect(boundary.state).toBe('neutral');
    expect(boundary.shownVolume).toBe(500);
    expect(sinking.shownVolume).toBe(sinking.capacityMl);
    expect(sinking.maximumBuoyancy).toBe(5);
  });
  it('changes submarine mass without changing fully submerged external displacement', () => {
    const rows = submarineCases.map((v) => submarineBallast(v));
    expect(rows.map((m) => m.buoyancy)).toEqual([20, 20, 20]);
    expect(rows.map((m) => m.state)).toEqual(['up', 'neutral', 'down']);
    for (const [i, m] of rows.entries()) {
      expect(m.netUp).toBeCloseTo([4, 0, -4][i]!);
      expect(m.volumeMl).toBe(2000);
      expect(m.massKg).toBeCloseTo(m.dryMass + m.ballastKg);
    }
  });
  it('counts inside-air and equipment mass instead of calling hot air massless', () => {
    const rows = balloonCases.map((v) => hotAirBalloon(v));
    expect(rows.map((m) => m.insideMass)).toEqual([12, 10.5, 9]);
    expect(rows.map((m) => m.weight)).toEqual([145, 130, 115]);
    expect(rows.map((m) => m.buoyancy)).toEqual([120, 120, 120]);
    expect(rows.map((m) => m.netUp)).toEqual([-25, -10, 5]);
    expect(rows[1]!.insideDensity).toBeLessThan(rows[1]!.outsideDensity);
    expect(rows[1]!.state).toBe('down');
  });
  it('finds a balloon neutral boundary using the whole-system mass budget', () => {
    const m = hotAirBalloon(0.95);
    expect(m.state).toBe('neutral');
    expect(m.netUp).toBeCloseTo(0);
    expect(m.insideMass + m.equipmentMass).toBeCloseTo(
      m.outsideDensity * m.volumeM3,
    );
  });
  it('rejects nonfinite, nonphysical and overflowing model inputs', () => {
    for (const run of [
      () => displacedFluid(0, 100),
      () => displacedFluid(1000, -1),
      () => displacedFluid(1000, 1, 0),
      () => displacedFluid(1000, Number.MIN_VALUE),
      () => displacedFluid(Number.MAX_VALUE, 1e6),
      () => submergedRelease(0, 200),
      () => submergedRelease(0.1, 0),
      () => submergedRelease(Infinity, 200),
      () => pressureUpthrust(-0.1, 1000),
      () => immersionReading(1.1),
      () => immersionReading(NaN),
      () => hangingBuoyancy(201, 1000),
      () => hangingBuoyancy(100, 0),
      () => sealedShip(true, -0.1),
      () => sealedShip(false, 0.1),
      () => submarineBallast(0.81),
      () => submarineBallast(-0.1),
      () => hotAirBalloon(0.8),
      () => hotAirBalloon(Infinity),
    ])
      expect(run).toThrow(RangeError);
  });
  it('adds seven complete bilingual courses in plan order with dedicated stations', () => {
    expect(lessons.slice(77, 84)).toEqual(buoyancyLessons);
    for (const l of buoyancyLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('buoyancy');
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('buoyancy');
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
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.options[q.correct]?.en).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
  it('preserves completed pressure learning and original periscope evidence', () => {
    const l = lessons[76]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        completedAt: 123,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const p = decodeProgress(
      JSON.stringify({
        lessons: { [l.id]: saved },
        notes: [],
        periscopeProject: {
          ...emptyPeriscope(),
          fields: { question: 'keep my two-mirror question' },
        },
      }),
    );
    expect(p.lessons[l.id]?.completedAt).toBe(123);
    expect(p.periscopeProject?.fields.question).toBe(
      'keep my two-mirror question',
    );
  });
});
