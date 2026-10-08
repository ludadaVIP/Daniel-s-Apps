import { describe, expect, it } from 'vitest';
import { periscopeRay, reflectVector } from './periscopeModel';
describe('two-mirror geometry', () => {
  it('preserves direction magnitude and tangent component while reversing the normal component', () => {
    for (const tilt of [0, 35, 45, 55, 90]) {
      const a = (tilt * Math.PI) / 180,
        d = { x: 0.6, y: 0.8 },
        out = reflectVector(d, tilt),
        tangent = { x: Math.cos(a), y: Math.sin(a) },
        normal = { x: -Math.sin(a), y: Math.cos(a) };
      expect(Math.hypot(out.x, out.y)).toBeCloseTo(1, 12);
      expect(out.x * tangent.x + out.y * tangent.y).toBeCloseTo(
        d.x * tangent.x + d.y * tangent.y,
        12,
      );
      expect(out.x * normal.x + out.y * normal.y).toBeCloseTo(
        -(d.x * normal.x + d.y * normal.y),
        12,
      );
    }
  });
  it('routes parallel 45-degree mirrors downward then horizontally into the aperture', () => {
    const m = periscopeRay(45);
    expect(m.middleDirection.x).toBeCloseTo(0, 12);
    expect(m.middleDirection.y).toBeCloseTo(1, 12);
    expect(m.direction.x).toBeCloseTo(1, 12);
    expect(m.direction.y).toBeCloseTo(0, 12);
    expect(m.end.y).toBeCloseTo(280, 12);
    expect(m.hit).toBe(true);
    expect(m.path).toHaveLength(4);
    expect(m.blockedDirect.x).toBeGreaterThan(110);
    expect(m.blockedDirect.x).toBeLessThan(225);
    expect(m.blockedDirect.y).toBe(140);
  });
  it('turns the exit direction by twice the lower tilt change and misses on either side', () => {
    expect(periscopeRay(35).outgoingAngle).toBeCloseTo(-20, 12);
    expect(periscopeRay(55).outgoingAngle).toBeCloseTo(20, 12);
    expect(periscopeRay(35).end.y).toBeCloseTo(189.0074414, 6);
    expect(periscopeRay(55).end.y).toBeCloseTo(370.9925586, 6);
    expect(periscopeRay(35).hit).toBe(false);
    expect(periscopeRay(55).hit).toBe(false);
    expect(periscopeRay(43).hit).toBe(true);
    expect(periscopeRay(42).hit).toBe(false);
    for (let tilt = 30; tilt <= 60; tilt++) {
      const m = periscopeRay(tilt);
      expect(m.windowExitY).toBeGreaterThan(245);
      expect(m.windowExitY).toBeLessThan(315);
      expect(m.end.y).toBeGreaterThan(130);
      expect(m.end.y).toBeLessThan(430);
    }
  });
  it('rejects invalid model settings rather than drawing a fabricated path', () => {
    for (const angle of [NaN, Infinity, -Infinity, 29, 61])
      expect(() => periscopeRay(angle)).toThrow(RangeError);
    expect(() => reflectVector({ x: Infinity, y: 0 }, 45)).toThrow(RangeError);
  });
});
