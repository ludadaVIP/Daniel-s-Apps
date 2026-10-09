import { describe, expect, it } from 'vitest';
import {
  materialCase,
  poleCase,
  bearing,
  dipoleField,
  fieldProbe,
  dipoleLine,
  earthCompass,
  wireCompass,
  coilField,
  motorReading,
  generatorReading,
} from './magneticModels';
import { magnetismLessons } from '../content/magnetism';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { units } from '../content/curriculum';
import { decodeProgress, freshLesson } from '../progress';

describe('magnetic direction, controlled comparisons and conversion', () => {
  it('distinguishes the prescribed steel from a conducting aluminium sample and wood', () => {
    expect([0, 1, 2].map((i) => materialCase(i).attracted)).toEqual([
      true,
      false,
      false,
    ]);
    expect(materialCase(1).en).toBe('Aluminium');
  });
  it('changes attraction to repulsion by facing poles and retains two poles in each split piece', () => {
    expect(poleCase(0)).toMatchObject({
      facing: 'N / S',
      attraction: true,
      split: false,
    });
    expect(poleCase(1)).toMatchObject({ facing: 'N / N', attraction: false });
    const split = poleCase(2);
    expect(split.split).toBe(true);
    expect(split.left).toEqual(['S', 'N']);
    expect(split.right).toEqual(['S', 'N']);
    expect(split.attraction).toBe(true);
  });
  it('keeps a null heading for a zero vector and uses north/east heading conventions', () => {
    expect(bearing({ x: 0, y: 0 })).toBeNull();
    expect(bearing({ x: 0, y: 2 })).toBe(0);
    expect(bearing({ x: 2, y: 0 })).toBe(90);
    expect(bearing({ x: -1, y: 1 })).toBe(-45);
  });
  it('maps compass directions locally rather than aiming all needles at one pole', () => {
    expect(fieldProbe(90).heading).toBeCloseTo(-90);
    expect(fieldProbe(0).heading).toBeCloseTo(90);
    expect(fieldProbe(45).heading).toBeCloseTo(18.43494882);
    for (const angle of [0, 45, 90, 180, 270, 360]) {
      const p = fieldProbe(angle);
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(1.5);
      const reverse = fieldProbe(angle, -1);
      expect(reverse.field.x).toBeCloseTo(-p.field.x);
      expect(reverse.field.y).toBeCloseTo(-p.field.y);
    }
  });
  it('uses the same dipole direction for rendered line tangents and compass needles', () => {
    for (const k of [1.2, 1.9, 2.6])
      for (const upper of [true, false]) {
        const line = dipoleLine(k, upper);
        for (let i = 1; i < line.length - 1; i++) {
          const p = line[i]!,
            a = line[i - 1]!,
            b = line[i + 1]!,
            v = dipoleField(p.x, p.y),
            dx = b.x - a.x,
            dy = b.y - a.y;
          const alignment =
            (dx * v.x + dy * v.y) / (Math.hypot(dx, dy) * Math.hypot(v.x, v.y));
          expect(alignment).toBeGreaterThan(0.999);
          expect(Math.hypot(p.x, p.y)).toBeGreaterThanOrEqual(0.9 - 1e-10);
        }
      }
  });
  it('weakens the ideal dipole exterior as inverse cube at matched direction', () => {
    const near = dipoleField(1.5, 0),
      far = dipoleField(3, 0);
    expect(near.x / far.x).toBeCloseTo(8);
    expect(near.y).toBe(0);
  });
  it('retains background when the nearby disturbance is removed or moved farther', () => {
    expect(earthCompass(null)).toMatchObject({
      east: 0,
      total: { x: 0, y: 1 },
      heading: 0,
    });
    expect(earthCompass(1).heading).toBeCloseTo(63.43494882);
    expect(earthCompass(3).heading).toBeCloseTo(4.2363948);
    expect(earthCompass(1).east / earthCompass(3).east).toBeCloseTo(27);
    expect(earthCompass(4).total.y).toBe(1);
  });
  it('uses right-hand wire direction and adds it to the preserved background', () => {
    expect(wireCompass(0, 1).heading).toBe(0);
    expect(wireCompass(1, 1).heading).toBe(-45);
    expect(wireCompass(-1, 1).heading).toBe(45);
    expect(wireCompass(1, 2).wire.x).toBe(-0.5);
    expect(wireCompass(1, 2).heading).toBeCloseTo(-26.56505118);
  });
  it('separately controls coil current, turns, core factor and pole direction', () => {
    expect(coilField(20, 0, true)).toMatchObject({
      relative: 0,
      rightPole: null,
    });
    expect(coilField(20, 0.2, false).relative).toBe(1);
    expect(coilField(20, 0.2, true).relative).toBe(3);
    expect(coilField(40, 0.2, false).relative).toBe(2);
    expect(coilField(20, 0.4, false).relative).toBe(2);
    expect(coilField(40, 0.4, true).relative).toBe(12);
    const reverse = coilField(20, 0.2, true, -1);
    expect(reverse.rightPole).toBe('S');
    expect(reverse.signedField).toBe(-3);
    expect(reverse.relative).toBe(3);
  });
  it('derives motor torque from the two active-side forces with correct geometric dead points', () => {
    const quarter = motorReading(1, 90);
    expect(quarter.current).toBeCloseTo(0.2);
    expect(quarter.forceZ).toBeCloseTo(-0.16);
    expect(quarter.torque).toBeCloseTo(0.016);
    expect(motorReading(1, 30).torque).toBeCloseTo(0.008);
    expect(motorReading(-1, 30).torque).toBeCloseTo(-0.008);
    for (const angle of [0, 180, 360])
      expect(motorReading(1, angle)).toMatchObject({
        deadPoint: true,
        current: 0,
        torque: 0,
      });
  });
  it('commutates each half-turn so drive direction survives coil-current reversal', () => {
    expect(motorReading(1, 30).current).toBeCloseTo(0.2);
    expect(motorReading(1, 210).current).toBeCloseTo(-0.2);
    for (const angle of [30, 90, 150, 210, 270, 330, 390]) {
      expect(motorReading(1, angle).torque).toBeGreaterThan(0);
      expect(motorReading(-1, angle).torque).toBeLessThan(0);
      expect(motorReading(0, angle).torque).toBe(0);
    }
  });
  it('does not generate sustained voltage in an unchanging flux and distinguishes an open load', () => {
    for (const p of [0, 0.3, 0.75, 1])
      expect(generatorReading(0, true, p)).toMatchObject({
        flux: 0.08,
        voltage: 0,
        current: 0,
        energy: 0,
      });
    const closed = generatorReading(1, true, 1),
      open = generatorReading(1, false, 1);
    expect(closed.peak).toBeCloseTo(0.5026548246);
    expect(closed.voltage).toBeCloseTo(closed.peak);
    expect(closed.current).toBeCloseTo(0.05026548246);
    expect(closed.energy).toBeCloseTo(0.015791367);
    expect(open.voltage).toBeCloseTo(closed.voltage);
    expect(open.currentPeak).toBe(0);
    expect(open.current).toBe(0);
    expect(open.energy).toBe(0);
  });
  it('reverses slip-ring voltage and current every half turn rather than rectifying it', () => {
    const first = generatorReading(1, true, 0.2),
      second = generatorReading(1, true, 0.6);
    expect(first.voltage).toBeGreaterThan(0);
    expect(second.voltage).toBeLessThan(0);
    expect(second.voltage).toBeCloseTo(-first.voltage);
    expect(second.current).toBeCloseTo(-first.current);
    expect(second.loadPower).toBeGreaterThan(0);
  });
  it('links the induced waveform to negative flux derivative and load energy to power', () => {
    for (const speed of [0.5, 1, 2])
      for (const p of [0.15, 0.37, 0.67, 0.9]) {
        const dp = 1e-5,
          a = generatorReading(speed, true, p - dp),
          b = generatorReading(speed, true, p + dp),
          m = generatorReading(speed, true, p),
          dt = b.seconds - a.seconds;
        expect(-(b.flux - a.flux) / dt).toBeCloseTo(m.voltage, 6);
        expect((b.energy - a.energy) / dt).toBeCloseTo(m.loadPower, 6);
        expect(m.mechanicalInput).toBe(m.energy);
      }
  });
  it('accounts for turning rate and the same-turn physical interval rather than playback duration', () => {
    const slow = generatorReading(1, true, 1),
      fast = generatorReading(2, true, 1);
    expect(slow.seconds).toBe(1.25);
    expect(fast.seconds).toBe(0.625);
    expect(fast.peak).toBeCloseTo(2 * slow.peak);
    expect(fast.energy).toBeCloseTo(2 * slow.energy);
    let integrated = 0;
    const n = 2000;
    for (let i = 0; i < n; i++) {
      const m = generatorReading(1, true, (i + 0.5) / n);
      integrated += (m.loadPower * 1.25) / n;
    }
    expect(integrated).toBeCloseTo(slow.energy, 8);
  });
  it('rejects invalid cases, interior probes and unsupported coil or conversion inputs', () => {
    for (const run of [
      () => materialCase(3),
      () => poleCase(0.5),
      () => bearing({ x: NaN, y: 1 }),
      () => dipoleField(0, 0),
      () => dipoleField(20, 0),
      () => dipoleField(1, 0, 0),
      () => fieldProbe(-1),
      () => dipoleLine(0.5),
      () => earthCompass(0),
      () => wireCompass(2, 1),
      () => wireCompass(1, 0.5),
      () => coilField(20.5, 0.2, true),
      () => coilField(20, 0.5, true),
      () => coilField(20, 0.2, true, 0),
      () => motorReading(1, Infinity),
      () => motorReading(3, 30),
      () => generatorReading(0.01, true, 1),
      () => generatorReading(1, true, 1.01),
    ])
      expect(run).toThrow(RangeError);
  });
  it('registers eight complete bilingual courses covering all ten introductory magnetism topics', () => {
    expect(lessons.slice(107, 115)).toEqual(magnetismLessons);
    expect(units.magnetism.en).toContain('Magnetism');
    expect(new Set(magnetismLessons.map((l) => l.kind)).size).toBe(8);
    for (const l of magnetismLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('magnetism');
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('magnetism');
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
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.options[q.correct]?.en).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
  it('keeps completed electricity records intact as the magnetic unit is appended', () => {
    const l = lessons[106]!,
      saved = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        completedAt: 123,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [l.id]: saved }, notes: [] }))
        .lessons[l.id]?.completedAt,
    ).toBe(123);
  });
});
