import { describe, it, expect } from 'vitest';
import { signedMeaningRetrieval } from './content/signedMeaningRetrieval';
import { relationsRecurrence } from './content/relationsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  temperatureReading,
  signedAxisPosition,
  axisWalk,
  compareSigned,
  signedMovement,
  absoluteDistance,
  signedLabel,
} from './signedModels';
const sets = Object.values(signedMeaningRetrieval);
const raw = (i: number, q: number, key: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === key,
  )![2]!.en;
const n = (i: number, q: number, key: string) =>
  Number(raw(i, q, key).replace('−', '-'));
describe('P64 signed-number subskills with independently calculated conditions', () => {
  it('retains twenty original references and appends ten exact tasks without changing formal counts', () => {
    const e = relationsRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P64-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(30);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(26);
    expect(
      e.flatMap((e) => e.targets.filter((t) => !t.includes('SIGNED-MEANING'))),
    ).toHaveLength(20);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(entry.targets).toContain(q.id);
        expect(s.bridgeByQuestion[q.id]).toBe(entry.sourceLesson);
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P64'));
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.kind).toBe('explain');
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
      }
    expect(
      relationsRecurrence
        .filter((e) => e.sourceLesson.startsWith('P63-'))
        .flatMap((e) => e.targets),
    ).toHaveLength(27);
    for (const e of relationsRecurrence.filter(
      (e) => !e.sourceLesson.startsWith('P64-'),
    ))
      expect(e.targets.every((t) => !t.includes('SIGNED-MEANING'))).toBe(true);
    expect(maintenanceSets.P67.questions).toHaveLength(5);
    expect(maintenanceSets.J75.questions).toHaveLength(6);
    expect(lessons).toHaveLength(358);
  });
  it('reads one-degree intervals below a negative anchor and distinguishes a picture boundary from temperature', () => {
    for (const [i, expected] of [
      [0, -6],
      [1, -8],
    ] as const) {
      const a = n(i, 1, 'A'),
        g = n(i, 1, 'G'),
        u = n(i, 1, 'U');
      expect(a - g * u).toBe(expected);
      const m = temperatureReading(expected);
      expect(m.side).toBe('below');
      expect(m.y - m.zeroY).toBe(-expected * 12);
      expect(m.steps).toBe(-expected);
      expect(temperatureReading(-expected).y).toBeLessThan(m.zeroY);
      expect([-1 + 1, -1 + 1 + 1]).toEqual([0, 1]);
      expect(temperatureReading(-0)).toEqual(temperatureReading(0));
    }
    expect(-16).toBeLessThan(-15);
    expect(() => temperatureReading(-16)).toThrow(); // Paper extension, not a new workshop input.
  });
  it('counts intervals rather than ticks and retains unit geometry under window extension', () => {
    for (const [i, p] of [
      [0, -6],
      [1, -8],
    ] as const) {
      const count = n(i, 2, 'N'),
        u = n(i, 2, 'U');
      const stops = Array.from({ length: count + 1 }, (_, k) => -k * u);
      expect(stops.at(-1)).toBe(p);
      expect(stops).toHaveLength(count + 1);
      const old = signedAxisPosition(p),
        wide = signedAxisPosition(p, -16, 16);
      expect(old.x - old.zeroX).toBe(p * 24);
      expect(wide.x - wide.zeroX).toBe(p * 24);
      expect(axisWalk(p, 'left')).toBe(p - 1);
      expect(axisWalk(p, 'right')).toBe(p + 1);
    }
    expect(axisWalk(-12, 'left')).toBe(-12);
    expect(() => signedAxisPosition(-13)).toThrow();
    expect(signedAxisPosition(-13, -16, 16).value).toBe(-13);
    expect(signedAxisPosition(-0).x).toBe(signedAxisPosition(0).x);
    expect([signedLabel(-0), signedLabel(+0, true)]).toEqual(['0', '0']);
  });
  it('orders both negatives and zero while rejecting the unrestricted nearer-zero shortcut', () => {
    for (const [i, expected] of [
      [0, [-10, -3, 0, 3]],
      [1, [-11, -4, 0, 4]],
    ] as const) {
      const a = n(i, 3, 'A'),
        b = n(i, 3, 'B'),
        c = n(i, 3, 'C');
      expect([a, b, 0, c].sort((a, b) => a - b)).toEqual(expected);
      expect([
        compareSigned(a, b).relation,
        compareSigned(b, 0).relation,
        compareSigned(a, c).relation,
        compareSigned(b, b).relation,
      ]).toEqual(['<', '<', '<', '=']);
      expect(Math.abs(a)).toBeGreaterThan(Math.abs(b));
      expect(a).toBeLessThan(b);
      expect(c).toBeLessThan(c + 2); // The nearer positive is smaller.
      expect(compareSigned(c, c + 2).relation).toBe('<');
      expect(compareSigned(a, b).right).toBe(b);
    }
  });
  it('checks every independent signed-operation row against hard-coded endpoint and distance oracles', () => {
    const oracles = [
      [
        [-5, '+', 7, 7, 2, 7],
        [-5, '−', -7, 7, 2, 7],
        [3, '−', 7, -7, -4, 7],
        [-5, '+', -3, -3, -8, 3],
        [-5, '−', -3, 3, -2, 3],
        [-5, '+', 5, 5, 0, 5],
        [-5, '−', 0, 0, -5, 0],
        [-10, '+', -8, -8, -18, 8],
      ],
      [
        [-4, '+', 6, 6, 2, 6],
        [-4, '−', -6, 6, 2, 6],
        [2, '−', 6, -6, -4, 6],
        [-4, '+', -2, -2, -6, 2],
        [-4, '−', -2, 2, -2, 2],
        [-4, '+', 4, 4, 0, 4],
        [-4, '−', 0, 0, -4, 0],
        [10, '+', 8, 8, 18, 8],
      ],
    ] as const;
    for (const [i, expected] of oracles.entries()) {
      const rows = sets[i]!.questions[3]!.contextTable!.rows;
      expect(rows).toHaveLength(8);
      for (const [
        j,
        [start, op, term, delta, end, distance],
      ] of expected.entries()) {
        expect(rows[j]!.map((c) => c.en)).toEqual([
          'R' + (j + 1),
          String(start),
          op,
          String(term),
        ]);
        const m = signedMovement(start, op, term);
        expect([m.delta, m.end, m.distance]).toEqual([delta, end, distance]);
        expect(m.crossesZero).toBe(j < 3);
        expect(m.reachesZero).toBe(j === 5);
        expect(m.direction).toBe(
          delta < 0 ? 'left' : delta > 0 ? 'right' : 'stay',
        );
        expect(end - delta).toBe(start);
        expect(m.min).toBeLessThanOrEqual(end);
        expect(m.max).toBeGreaterThanOrEqual(end);
        expect(
          signedAxisPosition(end, m.min, m.max).x -
            signedAxisPosition(start, m.min, m.max).x,
        ).toBe(delta * 24);
      }
      const rightNegative = signedMovement(
        ...(expected[4].slice(0, 3) as [number, '−', number]),
      );
      expect(rightNegative.end).toBe(-2);
      expect(rightNegative.direction).toBe('right');
    }
  });
  it('splits only crossings, reaches zero without a phantom extra step, and extends rather than clipping', () => {
    for (const [start, move, leftStart] of [
      [-5, 7, 3],
      [-4, 6, 2],
    ] as const) {
      const m = signedMovement(start, '+', move),
        left = signedMovement(leftStart, '−', move);
      expect(m.waypoints).toEqual([start, 0, 2]);
      expect([m.firstLeg, m.remaining]).toEqual([-start, 2]);
      expect(left.waypoints).toEqual([leftStart, 0, -4]);
      expect(left.firstLeg + left.remaining).toBe(move);
      expect(signedMovement(2, '−', move).end).toBe(start);
      const zero = signedMovement(start, '+', -start),
        stay = signedMovement(start, '−', 0);
      expect([zero.crossesZero, zero.reachesZero, zero.remaining]).toEqual([
        false,
        true,
        0,
      ]);
      expect(zero.waypoints).toEqual([start, 0]);
      expect([stay.direction, stay.distance, stay.remaining]).toEqual([
        'stay',
        0,
        0,
      ]);
    }
    expect(signedMovement(-10, '+', -8).min).toBe(-18);
    expect(signedMovement(10, '+', 8).max).toBe(18);
    expect(() => signedMovement(-6, '+', 10)).toThrow(); // Existing J82 paper task is outside this UI's term range.
  });
  it('measures arbitrary point pairs, reverses signed change, and reconstructs zero-distance solutions', () => {
    for (const [i, expected] of [
      [0, [-7, 4, -2, 5, 11, 5]],
      [1, [-9, 5, -3, 6, 14, 6]],
    ] as const) {
      const p = n(i, 5, 'P'),
        q = n(i, 5, 'Q'),
        r = n(i, 5, 'R'),
        d = n(i, 5, 'D');
      expect([p, q, r, d, q - p, r - p]).toEqual(expected);
      expect(absoluteDistance(p).opposite).toBe(absoluteDistance(p).distance);
      expect(absoluteDistance(q).opposite).not.toBe(
        absoluteDistance(q).distance,
      );
      for (const end of [q, r]) {
        const forward = end - p,
          back = p - end;
        expect(forward).toBe(-back);
        expect(Math.abs(forward)).toBe(Math.abs(back));
        expect(Math.abs(forward)).not.toBe(Math.abs(p));
      }
      expect(q - p).toBe(Math.abs(q) + Math.abs(p));
      expect(r - p).toBe(Math.abs(p) - Math.abs(r));
      const positions = Array.from({ length: 25 }, (_, k) => k - 12);
      expect(positions.filter((x) => Math.abs(x) === d)).toEqual([-d, d]);
      expect(positions.filter((x) => Math.abs(x) === d && x < 0)).toEqual([-d]);
      expect(positions.filter((x) => Math.abs(x) === 0)).toEqual([0]);
      expect(positions.filter((x) => Math.abs(x) === -d)).toEqual([]);
    }
    expect(absoluteDistance(-0)).toEqual(absoluteDistance(0));
  });
});
