import { describe, expect, it } from 'vitest';
import {
  floatingState,
  floatMaterials,
  boatState,
  bounceParameters,
  bounceHeight,
  echoState,
  echoPosition,
} from './mysteryModels';
import { lessons } from '../content/lessons';
import { mysteryLessons } from '../content/mysteries';
describe('floating evidence', () => {
  it('balances floating ice against displaced water and leaves most of the ice submerged', () => {
    const ice = floatingState(floatMaterials.ice.density, 1);
    expect(ice.mass).toBeCloseTo(91.7);
    expect(ice.floats).toBe(true);
    expect(ice.submergedFraction).toBeCloseTo(0.917);
    expect(ice.displacedWaterMass).toBeCloseTo(ice.mass);
    expect(ice.displacedVolume).toBeCloseTo(91.7);
    const sea = floatingState(floatMaterials.ice.density, 1.025);
    expect(sea.submergedFraction).toBeLessThan(ice.submergedFraction);
    expect(sea.mass).toBe(ice.mass);
    expect(sea.displacedWaterMass).toBeCloseTo(ice.mass);
  });
  it('retains buoyancy for sinking objects and lets the same sample change behavior with water density', () => {
    const rock = floatingState(2.6, 1);
    expect(rock.floats).toBe(false);
    expect(rock.displacedWaterMass).toBe(100);
    expect(rock.mass).toBe(260);
    expect(rock.submergedFraction).toBe(1);
    expect(floatingState(1.01, 1).floats).toBe(false);
    expect(floatingState(1.01, 1.025).floats).toBe(true);
    expect(floatingState(1, 1).neutral).toBe(true);
    expect(() => floatingState(0, 1)).toThrow();
    expect(() => floatingState(NaN, 1)).toThrow();
  });
  it('keeps clay mass unchanged while shape and flooding alter displacement', () => {
    const lump = boatState('lump', 0),
      empty = boatState('bowl', 0),
      loaded = boatState('bowl', 150),
      rim = boatState('bowl', 200),
      flooded = boatState('bowl', 250);
    expect(lump.mass).toBe(empty.mass);
    expect(lump.clayMass).toBe(100);
    expect(lump.displacedWaterMass).toBe(50);
    expect(lump.status).toBe('sinking');
    expect(empty.status).toBe('floating');
    expect(empty.displacedWaterMass).toBe(100);
    expect(loaded.mass).toBe(250);
    expect(loaded.displacedWaterMass).toBe(loaded.mass);
    expect(loaded.submergedFraction).toBeCloseTo(5 / 6);
    expect(rim.status).toBe('at-rim');
    expect(rim.flooded).toBe(false);
    expect(flooded.status).toBe('sinking');
    expect(flooded.flooded).toBe(true);
    // After flooding, open hull space is water-filled: only clay and compact cargo displace water.
    expect(flooded.displacedWaterMass).toBeCloseTo(50 + 250 / 8);
    expect(flooded.displacedWaterMass).toBeLessThan(flooded.mass);
    expect(() => boatState('bowl', -1)).toThrow();
  });
});
describe('bounce evidence', () => {
  it('preserves the right height/energy ratio and cannot create energy in a passive collision', () => {
    expect(bounceParameters(1, 0.8).reboundHeight).toBeCloseTo(0.64);
    expect(bounceParameters(2, 0.8).reboundHeight).toBeCloseTo(1.28);
    expect(bounceParameters(1, 0.05).retainedFraction).toBeCloseTo(0.0025);
    for (const h of [0.5, 1, 1.5, 2])
      for (const e of [0, 0.05, 0.8, 1]) {
        const p = bounceParameters(h, e);
        expect(p.reboundHeight).toBeLessThanOrEqual(h);
        expect(bounceHeight(h, e, 0)).toBe(h);
        expect(bounceHeight(h, e, p.fallTime)).toBeCloseTo(0);
        expect(
          bounceHeight(h, e, p.fallTime + p.reboundSpeed / 9.8),
        ).toBeCloseTo(p.reboundHeight);
        expect(bounceHeight(h, e, p.duration + 1)).toBe(0);
      }
    expect(() => bounceParameters(1, 1.1)).toThrow();
  });
});
describe('echo evidence', () => {
  it('counts the outward and return journeys using the medium-specific sound speed', () => {
    const near = echoState(5),
      far = echoState(50);
    expect(far.roundTrip).toBe(100);
    expect(far.delay).toBeCloseTo(100 / 343);
    expect(echoState(100).delay).toBeCloseTo(2 * far.delay);
    expect(near.likelySeparate).toBe(false);
    expect(far.likelySeparate).toBe(true);
    expect(echoState(50, 1500).delay).toBeCloseTo(100 / 1500);
    expect(echoPosition(50, 0)).toBe(0);
    expect(echoPosition(50, far.delay / 2)).toBeCloseTo(50);
    expect(echoPosition(50, far.delay)).toBeCloseTo(0);
    expect(echoPosition(50, far.delay * 2)).toBeCloseTo(0);
    expect(() => echoState(50, 0)).toThrow();
  });
});
describe('mystery progression', () => {
  it('places the four full mysteries after measurement and before motion without replacing previous lessons', () => {
    const graph = lessons.findIndex((l) => l.id === 'simple-graphs'),
      speed = lessons.findIndex((l) => l.id === 'what-is-speed');
    expect(mysteryLessons).toHaveLength(4);
    for (const l of mysteryLessons) {
      const index = lessons.findIndex((v) => v.id === l.id);
      expect(index).toBeGreaterThan(graph);
      expect(index).toBeLessThan(speed);
      expect(l.stage).toBe(0);
      expect(l.unit).toBe('mysteries');
      expect(l.questions).toHaveLength(3);
    }
  });
});
