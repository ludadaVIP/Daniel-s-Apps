import { describe, expect, it } from 'vitest';
import {
  detects,
  receptorFor,
  neuralReach,
  addReflexPart,
  reflexRoute,
  hormoneTarget,
  feedbackSeries,
  thermalResponse,
  glucoseResponse,
  waterResponse,
} from './regulationModel';
describe('S03 information and regulation models', () => {
  it('distinguishes three model sensory channels rather than calling one universal', () => {
    for (const stimulus of ['light', 'sound', 'pressure'] as const)
      for (const receptor of ['eye', 'ear', 'skin'] as const)
        expect(detects(stimulus, receptor)).toBe(
          receptorFor[stimulus] === receptor,
        );
  });
  it('allows central information without motor delivery and prevents jumping a selected gap', () => {
    expect(neuralReach('sensory-gap', 4)).toBe(0);
    expect(neuralReach('motor-gap', 4)).toBe(2);
    expect(neuralReach('intact', 4)).toBe(4);
    expect(neuralReach('intact', -2)).toBe(0);
    expect(neuralReach('intact', 2)).toBe(2);
  });
  it('rejects a misordered reflex card without advancing or mutating the route', () => {
    let route: (typeof reflexRoute)[number][] = [];
    for (const next of reflexRoute) {
      const before = [...route];
      const wrong = reflexRoute.find((p) => p !== next)!;
      const rejected = addReflexPart(route, wrong);
      expect(rejected.correct).toBe(false);
      expect(rejected.route).toEqual(before);
      expect(route).toEqual(before);
      route = addReflexPart(route, next).route;
    }
    expect(route).toEqual(reflexRoute);
    expect(addReflexPart(route, 'receptor').correct).toBe(false);
  });
  it('requires a matching receptor but permits a cell to have more than one receptor', () => {
    expect(hormoneTarget('A', 'B')).toBe(false);
    expect(hormoneTarget('B', 'A')).toBe(false);
    for (const messenger of ['A', 'B'] as const) {
      expect(hormoneTarget(messenger, messenger)).toBe(true);
      expect(hormoneTarget(messenger, 'both')).toBe(true);
    }
  });
  it('opposes disturbances from either side without instant perfect constancy', () => {
    for (const d of ['high', 'low'] as const) {
      const active = feedbackSeries(d, true),
        off = feedbackSeries(d, false);
      expect(active[0]).toBe(50);
      expect(active[1]).not.toBe(50);
      for (let i = 2; i < active.length; i++) {
        expect(Math.abs(active[i]! - 50)).toBeLessThan(
          Math.abs(active[i - 1]! - 50),
        );
        expect(off[i]).toBe(off[1]);
      }
      expect(active.at(-1)).not.toBe(50);
    }
  });
  it('separates humid-air effects on evaporation from heat-conserving cold responses', () => {
    expect(thermalResponse('warm', 'humid').evaporation).toBe('reduced');
    expect(thermalResponse('warm', 'drier').vessels).toBe('wider');
    expect(thermalResponse('cold', 'humid')).toEqual(
      thermalResponse('cold', 'drier'),
    );
    expect(thermalResponse('cold', 'drier').shivering).toBe(true);
  });
  it('uses distinct pancreatic cells and opposite liver actions for the two glucose conditions', () => {
    expect(glucoseResponse('high')).toEqual({
      cells: 'beta',
      hormone: 'insulin',
      liver: 'store',
      tendency: 'down',
    });
    expect(glucoseResponse('low')).toEqual({
      cells: 'alpha',
      hormone: 'glucagon',
      liver: 'release',
      tendency: 'up',
    });
  });
  it('keeps water reabsorption opposite urine volume without treating ADH as drinking water', () => {
    expect(waterResponse('concentrated')).toMatchObject({
      adh: 'more',
      permeability: 'higher',
      reabsorption: 'more',
      urineVolume: 'less',
      urineConcentration: 'higher',
      thirst: 'can-increase',
    });
    expect(waterResponse('dilute')).toMatchObject({
      adh: 'less',
      reabsorption: 'less',
      urineVolume: 'more',
      urineConcentration: 'lower',
    });
  });
});
