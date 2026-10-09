import { describe, it, expect } from 'vitest';
import {
  daylight,
  seasonReading,
  moonReading,
  moonPatch,
  planets,
  solarRuler,
  orbitReading,
  starReading,
  cosmicLevel,
  lightTravel,
  AU_KM,
  LIGHT_YEAR_KM,
  LIGHT_KM_PER_SECOND,
  JULIAN_YEAR_SECONDS,
} from './spaceModels';
import { spaceLessons } from '../content/space';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { units } from '../content/curriculum';
import { decodeProgress, freshLesson } from '../progress';
describe('Earth/space: geometry, viewpoints, motion and honest scales', () => {
  it('uses one fixed solar direction to classify noon, midnight and horizon crossings', () => {
    expect(daylight(12)).toMatchObject({ x: -1, state: 'day' });
    expect(daylight(0)).toMatchObject({ x: 1, state: 'night' });
    expect(daylight(6).state).toBe('horizon');
    expect(daylight(18).state).toBe('horizon');
    for (const h of [0, 3, 6, 9, 12, 15, 18, 21, 24]) {
      const m = daylight(h);
      expect(Math.hypot(m.x, m.y)).toBeCloseTo(1);
      expect(m.solarCosine).toBeCloseTo(-m.x);
    }
    expect(daylight(24).x).toBeCloseTo(daylight(0).x);
    expect(daylight(24).y).toBeCloseTo(daylight(0).y);
  });
  it('reverses opposite place orientation after twelve hours and rotates counterclockwise from above north', () => {
    for (const h of [0, 3, 6, 9, 12]) {
      const a = daylight(h),
        b = daylight(h + 12);
      expect(b.x).toBeCloseTo(-a.x);
      expect(b.y).toBeCloseTo(-a.y);
    }
    const a = daylight(12),
      b = daylight(13);
    expect(a.x * b.y - a.y * b.x).toBeGreaterThan(0);
  });
  it('gives equal geometric equinox days at opposite latitudes on a fixed circular orbit', () => {
    for (const latitude of [-60, -45, 0, 45, 60]) {
      const m = seasonReading(0, latitude);
      expect(m.daylightHours).toBeCloseTo(12);
      expect(m.distanceAU).toBe(1);
      expect(m.noonAltitude).toBe(90 - Math.abs(latitude));
    }
  });
  it('swaps June/December hemispheres with conserved paired daylight, without changing distance', () => {
    const n = seasonReading(90, 45),
      s = seasonReading(90, -45),
      winter = seasonReading(270, 45);
    expect(n.declination).toBeCloseTo(23.5);
    expect(n.noonAltitude).toBeCloseTo(68.5);
    expect(s.noonAltitude).toBeCloseTo(21.5);
    expect(n.daylightHours + s.daylightHours).toBeCloseTo(24);
    expect(n.daylightHours).toBeCloseTo(15.4364474144, 8);
    expect(winter.daylightHours).toBeCloseTo(s.daylightHours);
    expect(winter.distanceAU).toBe(n.distanceAU);
    for (const phase of [0, 30, 90, 150, 270, 360])
      for (const lat of [0, 30, 45, 60])
        expect(
          seasonReading(phase, lat).daylightHours +
            seasonReading(phase, -lat).daylightHours,
        ).toBeCloseTo(24);
  });
  it('removes the seasonal geometrical difference when tilt is zero, but retains latitude differences', () => {
    for (const phase of [0, 90, 270]) {
      const m = seasonReading(phase, 45, 0);
      expect(m.daylightHours).toBeCloseTo(12);
      expect(m.noonAltitude).toBe(45);
      expect(m.noonProjection).toBeCloseTo(Math.SQRT1_2);
    }
    expect(seasonReading(90, 0, 0).noonAltitude).toBe(90);
  });
  it('matches the Moon orbit position, visible illumination and separate synodic-cycle clock', () => {
    expect(moonReading(0)).toMatchObject({ x: -1, illuminated: 0, day: 0 });
    expect(moonReading(90).illuminated).toBeCloseTo(0.5);
    expect(moonReading(180).illuminated).toBe(1);
    expect(moonReading(270).illuminated).toBeCloseTo(0.5);
    expect(moonReading(360).day).toBeCloseTo(29.53, 10);
    expect(moonReading(90).day).toBeCloseTo(29.53 / 4);
    for (const a of [15, 45, 90, 150])
      expect(moonReading(a).illuminated).toBeCloseTo(
        moonReading(360 - a).illuminated,
      );
  });
  it('draws a spherical bright patch whose area agrees with the illuminated-disc fraction', () => {
    for (const angle of [0, 15, 45, 90, 135, 180, 225, 270, 315, 360]) {
      const ps = moonPatch(angle, 50);
      let area = 0;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i]!,
          b = ps[(i + 1) % ps.length]!;
        area += a.x * b.y - a.y * b.x;
      }
      expect(Math.abs(area / 2) / (Math.PI * 2500)).toBeCloseTo(
        moonReading(angle).illuminated,
        2,
      );
      for (const p of ps)
        expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(50 + 1e-9);
    }
    expect(moonPatch(90, 50).every((p) => p.x >= -1e-9)).toBe(true);
    expect(moonPatch(270, 50).every((p) => p.x <= 1e-9)).toBe(true);
  });
  it('keeps all eight planet orbital scales in one order and converts a single model ruler', () => {
    expect(planets.map((p) => p.en)).toEqual([
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ]);
    for (let i = 1; i < 8; i++)
      expect(planets[i]!.au).toBeGreaterThan(planets[i - 1]!.au);
    expect(solarRuler(2).modelMetres).toBe(0.1);
    expect(solarRuler(4).modelMetres).toBeCloseTo(0.5203);
    expect(solarRuler(7).modelMetres).toBeCloseTo(3.007);
    for (let i = 0; i < 8; i++)
      expect(solarRuler(i, 20).modelMetres).toBeCloseTo(
        2 * solarRuler(i, 10).modelMetres,
      );
  });
  it('keeps circular radius, energy and perpendicular velocity/acceleration consistent', () => {
    for (const r of [1.5, 2, 2.5])
      for (const p of [0, 0.2, 0.5, 1]) {
        const m = orbitReading(0, p, r);
        expect(m.r).toBeCloseTo(r);
        expect(m.speed).toBeCloseTo(Math.sqrt(1 / r));
        expect(m.gravity).toBeCloseTo(1 / r ** 2);
        expect(m.specificEnergy).toBeCloseTo(-1 / (2 * r));
        expect(m.x * m.vx + m.y * m.vy).toBeCloseTo(0);
        expect(m.vx * m.ax + m.vy * m.ay).toBeCloseTo(0);
        expect(m.x * m.vy - m.y * m.vx).toBeCloseTo(Math.sqrt(r));
      }
  });
  it('ties plotted orbit motion to the derivative of position and central acceleration', () => {
    for (const p of [0.2, 0.5, 0.8]) {
      const dp = 1e-5,
        a = orbitReading(0, p - dp),
        b = orbitReading(0, p + dp),
        m = orbitReading(0, p),
        dt = b.elapsed - a.elapsed;
      expect((b.x - a.x) / dt).toBeCloseTo(m.vx, 6);
      expect((b.y - a.y) / dt).toBeCloseTo(m.vy, 6);
      expect((b.vx - a.vx) / dt).toBeCloseTo(m.ax, 6);
      expect((b.vy - a.vy) / dt).toBeCloseTo(m.ay, 6);
    }
  });
  it('uses the same initial tangential velocity for an imagined gravity-free straight path', () => {
    const start = orbitReading(0, 0),
      noGravity = orbitReading(1, 0),
      end = orbitReading(1, 1);
    expect(noGravity.initialSpeed).toBe(start.initialSpeed);
    expect(end.x).toBe(2);
    expect(end.y).toBeCloseTo(4 * Math.SQRT1_2);
    expect(end.speed).toBeCloseTo(start.speed);
    expect(end.gravity).toBe(0);
    expect(end.ax).toBe(0);
    expect(end.ay).toBe(0);
  });
  it('integrates the analytic radial free fall to first contact rather than through the body', () => {
    const start = orbitReading(2, 0),
      end = orbitReading(2, 1);
    expect(start.r).toBeCloseTo(2);
    expect(start.speed).toBeCloseTo(0);
    expect(end.r).toBe(1);
    expect(end.contact).toBe(true);
    expect(end.elapsed).toBeCloseTo(2 * (Math.PI / 4 + 0.5));
    expect(end.speed).toBeCloseTo(1);
    expect(orbitReading(2, 0.9)).toEqual({ ...end, clock: 3.6 });
    for (const p of [0.1, 0.25, 0.5]) {
      const m = orbitReading(2, p);
      expect(m.y).toBe(0);
      expect(m.vx).toBeLessThan(0);
      expect(m.specificEnergy).toBeCloseTo(-0.5);
      const dp = 1e-5,
        a = orbitReading(2, p - dp),
        b = orbitReading(2, p + dp);
      expect((b.x - a.x) / (b.elapsed - a.elapsed)).toBeCloseTo(m.vx, 5);
    }
  });
  it('separates star luminosity from detector irradiance under inverse-square spreading', () => {
    expect(starReading(1, 1).brightness).toBe(1);
    expect(starReading(1, 2)).toMatchObject({ brightness: 0.25, areaRatio: 4 });
    expect(starReading(4, 2).brightness).toBe(1);
    expect(starReading(1, 4).brightness).toBe(0.0625);
  });
  it('separates planetary systems, one galaxy and wider collections instead of a cosmic census', () => {
    expect(cosmicLevel(0).memberEn).toContain('Sun');
    expect(cosmicLevel(1).memberEn).toContain('Star systems');
    expect(cosmicLevel(2).addressEn).toContain('part');
  });
  it('converts AU and Julian light-years to finite signal travel time and correct arrival', () => {
    expect(LIGHT_YEAR_KM).toBeCloseTo(9460730472580.8, 0);
    expect(lightTravel(1, 'AU').seconds).toBeCloseTo(499.0047838);
    expect(lightTravel(4.25, 'ly').years).toBeCloseTo(4.25);
    expect(lightTravel(100000, 'ly').years).toBeCloseTo(100000);
    expect(lightTravel(1, 'AU').km).toBe(AU_KM);
    expect(LIGHT_YEAR_KM / LIGHT_KM_PER_SECOND).toBeCloseTo(
      JULIAN_YEAR_SECONDS,
      6,
    );
    const halfway = lightTravel(4.25, 'ly', 0.5);
    expect(halfway.arrived).toBe(false);
    expect(halfway.travelledKm).toBeCloseTo(halfway.km / 2);
    expect(halfway.elapsed).toBeCloseTo(halfway.seconds / 2);
    expect(lightTravel(4.25, 'ly', 1).arrived).toBe(true);
  });
  it('rejects nonfinite inputs and unsupported viewpoints, indices or unit systems', () => {
    for (const f of [
      () => daylight(NaN),
      () => daylight(25),
      () => seasonReading(360, 66),
      () => seasonReading(-1, 45),
      () => seasonReading(90, 45, 31),
      () => moonReading(-1),
      () => moonPatch(90, 0),
      () => solarRuler(8),
      () => solarRuler(2, 0),
      () => orbitReading(3, 1),
      () => orbitReading(0, 1.1),
      () => orbitReading(0, 1, 1),
      () => starReading(0, 1),
      () => starReading(1, Infinity),
      () => cosmicLevel(0.5),
      () => lightTravel(0, 'AU'),
      () => lightTravel(1, 'm' as 'AU'),
      () => lightTravel(1, 'ly', -1),
    ])
      expect(f).toThrow(RangeError);
  });
  it('registers eight bilingual bodies and stations representing all twelve Earth/space topics', () => {
    expect(lessons.slice(115, 123)).toEqual(spaceLessons);
    expect(units.space.en).toContain('Earth');
    expect(new Set(spaceLessons.map((l) => l.kind)).size).toBe(8);
    for (const l of spaceLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('space');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('space');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(l.questions).toHaveLength(3);
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
        expect(l[key].zh.length).toBeGreaterThan(12);
        expect(l[key].en.length).toBeGreaterThan(20);
      }
      expect(l.vocabulary).toHaveLength(4);
    }
  });
  it('preserves completed magnetic course IDs and answers after appending space', () => {
    const l = lessons[114]!,
      saved = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        completedAt: 456,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [l.id]: saved }, notes: [] }))
        .lessons[l.id]?.completedAt,
    ).toBe(456);
  });
});
