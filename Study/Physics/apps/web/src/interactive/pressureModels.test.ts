import { describe, expect, it } from 'vitest';
import {
  contactPressure,
  contactCases,
  contactTiles,
  footprintPair,
  shoeCases,
  liquidPressure,
  liquidCases,
  pressureDifference,
  atmosphereCases,
  strawColumn,
  strawCases,
  gasSyringe,
  syringeCases,
  prescribedContact,
  prescribedLiquid,
} from './pressureModels';
import { pressureLessons } from '../content/pressure';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';
import { emptyPeriscope } from '../periscope';
describe('pressure with matched forces, areas and absolute pressures', () => {
  it('converts square centimetres before calculating pascals and obeys inverse area scaling', () => {
    const m = contactPressure(60, 30);
    expect(m.areaM2).toBe(0.003);
    expect(m.pascals).toBe(20000);
    expect(contactPressure(60, 60).pascals).toBe(m.pascals / 2);
    expect(contactPressure(120, 30).pascals).toBe(m.pascals * 2);
    expect(contactPressure(0, 30).pascals).toBe(0);
  });
  it('conserves total force across equal-area squares without pretending to model indentation', () => {
    for (const c of contactCases) {
      const tiles = contactTiles(c.force, c.area);
      expect(tiles).toHaveLength(c.area);
      expect(tiles.reduce((s, t) => s + t.force, 0)).toBeCloseTo(c.force);
      expect(tiles.reduce((s, t) => s + t.areaCm2, 0)).toBe(c.area);
      expect(new Set(tiles.map((t) => `${t.column},${t.row}`)).size).toBe(
        c.area,
      );
      expect(Math.max(...tiles.map((t) => t.column))).toBe(9);
      expect(Math.max(...tiles.map((t) => t.row))).toBe(c.area / 10 - 1);
    }
  });
  it('matches both-foot force to both-foot contact geometry at a shared length scale', () => {
    expect(shoeCases.map((c) => footprintPair(c.area).kPa)).toEqual([
      30, 300, 6,
    ]);
    for (const c of shoeCases) {
      const m = footprintPair(c.area);
      expect(2 * m.widthCm * m.lengthCm).toBeCloseTo(c.area);
      expect(m.forceEach * 2).toBe(m.force);
      expect(m.lengthCm / m.widthCm).toBeCloseTo(3);
    }
    expect(footprintPair(1000).widthCm / footprintPair(20).widthCm).toBeCloseTo(
      Math.sqrt(50),
    );
  });
  it('adds hydrostatic depth pressure to surface pressure and distinguishes zero depth', () => {
    expect(
      liquidCases.map((c) => liquidPressure(c.density, c.depth).incrementKPa),
    ).toEqual([1, 3, 3.6]);
    expect(
      liquidCases.map((c) => liquidPressure(c.density, c.depth).absoluteKPa),
    ).toEqual([102, 104, 104.6]);
    const surface = liquidPressure(1000, 0);
    expect(surface.increment).toBe(0);
    expect(surface.absolute).toBe(101000);
    expect(liquidPressure(1000, 0.2, 80000).increment).toBe(2000);
    expect(liquidPressure(1000, 0.2, 80000).absolute).toBe(82000);
  });
  it('keeps equal nonzero opposing atmospheric forces when their net is zero', () => {
    expect(
      atmosphereCases.map((p) => pressureDifference(101000, p, 10).netInward),
    ).toEqual([0, 20, 40]);
    const m = pressureDifference(101000, 101000, 10);
    expect(m.outsideForce).toBe(101);
    expect(m.insideForce).toBe(101);
    expect(pressureDifference(101000, 81000, 20).netInward).toBe(40);
    expect(pressureDifference(81000, 101000, 10).netInward).toBe(-20);
  });
  it('computes a static straw column from a pressure difference, including later sealed balance', () => {
    expect(
      strawCases.map((c) => strawColumn(c.surface, c.mouth).aboveSurface),
    ).toEqual([0.2, 0, 0]);
    expect(strawColumn(101000, 99000).aboveSurface).toBe(
      strawColumn(81000, 79000).aboveSurface,
    );
    expect(strawColumn(101000, 99000, 2000).aboveSurface).toBe(0.1);
    const reversed = strawColumn(99000, 101000);
    expect(reversed.signedHeight).toBe(-0.2);
    expect(reversed.aboveSurface).toBe(0);
    expect(strawCases[2].vented).toBe(false);
    expect(strawCases[2].surface).toBe(strawCases[2].mouth);
  });
  it('conserves absolute pV for the same isothermal sealed gas and balances the pressure difference', () => {
    const results = syringeCases.map((v) => gasSyringe(v));
    expect(results.map((m) => m.kPa)).toEqual([101, 202, 404]);
    for (const m of results) {
      expect(m.pressureVolume).toBe(2020000);
      expect(m.holdingForce).toBeCloseTo((m.absolute - m.outside) * 0.0002);
    }
    expect(results[1]!.holdingForce).toBeCloseTo(20.2);
    expect(results[2]!.holdingForce).toBeCloseTo(60.6);
    expect(new Set(results.map((m) => m.gauge * m.volumeMl)).size).toBe(3);
  });
  it('allows vented gas to escape rather than treating it as a fixed amount', () => {
    for (const v of syringeCases) {
      expect(gasSyringe(v, true).absolute).toBe(101000);
      expect(gasSyringe(v, true).holdingForce).toBe(0);
    }
    expect(gasSyringe(10, true).pressureVolume).not.toBe(
      gasSyringe(20, true).pressureVolume,
    );
  });
  it('rejects nonphysical, nonfinite and overflowing teaching inputs', () => {
    for (const run of [
      () => contactPressure(-1, 30),
      () => contactPressure(60, 0),
      () => contactPressure(1, Number.MIN_VALUE),
      () => contactPressure(Number.MAX_VALUE, 1),
      () => contactTiles(60, 35),
      () => liquidPressure(0, 0.1),
      () => liquidPressure(1000, -0.1),
      () => liquidPressure(1000, 0.1, -1),
      () => liquidPressure(1000, 0.1, 101000, 0),
      () => liquidPressure(Number.MAX_VALUE, 1),
      () => pressureDifference(-1, 101000, 10),
      () => pressureDifference(101000, NaN, 10),
      () => pressureDifference(101000, 100000, 0),
      () => strawColumn(Infinity, 99000),
      () => strawColumn(101000, 99000, 0),
      () => gasSyringe(4),
      () => gasSyringe(21),
      () => gasSyringe(NaN),
    ])
      expect(run).toThrow(RangeError);
  });
  it('recognises only actual prescribed contact/depth settings, including floating-point slider depths', () => {
    expect(prescribedContact(60, 60)).toBe(1);
    expect(prescribedContact(80, 60)).toBe(-1);
    expect(prescribedLiquid(0.1 + 0.2, 1000)).toBe(1);
    expect(prescribedLiquid(0.2, 1000)).toBe(-1);
    expect(prescribedLiquid(0.3, 1200)).toBe(2);
  });
  it('opens Stage 3 with six complete bilingual lessons and dedicated stations', () => {
    expect(lessons.slice(71, 77)).toEqual(pressureLessons);
    for (const l of pressureLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('pressure');
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('pressure');
      for (const k of [
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
        expect(l[k].zh).toBeTruthy();
        expect(l[k].en).toBeTruthy();
      }
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.options[q.correct]?.en).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
  it('preserves prior light mastery and an original periscope draft as the catalog grows', () => {
    const l = lessons[70]!,
      saved = {
        ...freshLesson(),
        explored: true,
        prediction: 0,
        completedAt: 123,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const decoded = decodeProgress(
      JSON.stringify({
        lessons: { [l.id]: saved },
        notes: [],
        periscopeProject: {
          ...emptyPeriscope(),
          fields: { question: 'look over my cardboard wall' },
        },
      }),
    );
    expect(decoded.lessons[l.id]?.completedAt).toBe(123);
    expect(decoded.periscopeProject?.fields.question).toBe(
      'look over my cardboard wall',
    );
  });
});
