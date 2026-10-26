import { describe, it, expect } from 'vitest';
import { chanceMeaningRetrieval } from './content/chanceMeaningRetrieval';
import { primaryCapstoneRecurrence } from './content/primaryCapstoneRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons, lessonById } from './content';
import { checkAnswer } from './model';
import { rational, textR } from './algebraModels';
import {
  orderedSummary,
  bagChance,
  spinnerModel,
  eventChance,
  frequencySummary,
} from './chanceModels';
const sets = Object.values(chanceMeaningRetrieval);
const rows = (i: number, q: number) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows;
const values = (i: number, q: number) => rows(i, q).map((r) => r[2]!.en);
describe('P67 retained identities, purposeful summaries and event records', () => {
  it('keeps original evidence and shares the mechanism/frequency card without double-counting tasks', () => {
    const e = primaryCapstoneRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P67-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(31);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(24);
    expect(
      e.flatMap((e) => e.targets.filter((t) => !t.includes('CHANCE-MEANING'))),
    ).toHaveLength(21);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const q = s.questions[[0, 1, 3, 2, 3][i]!]!;
        expect(entry.targets).toContain(q.id);
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P67'));
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.hints).toHaveLength(2);
      }
    for (const s of sets)
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'P67-L01',
        'P67-L02',
        'P67-L04',
        'P67-L05',
      ]);
    for (const e of primaryCapstoneRecurrence.filter(
      (e) => !e.sourceLesson.startsWith('P67-'),
    ))
      expect(e.targets.every((t) => !t.includes('CHANCE-MEANING'))).toBe(true);
    expect(lessons).toHaveLength(358);
  });
  it('sorts every original ID and refutes extremes/deduplication using actual numerical differences', () => {
    for (const [i, input, ordered, ids, median, mode] of [
      [0, [11, 2, 2, 5, 8], [2, 2, 5, 8, 11], [1, 2, 3, 4, 0], 5, 2],
      [1, [13, 0, 4, 0, 9], [0, 0, 4, 9, 13], [1, 3, 2, 4, 0], 4, 0],
    ] as const) {
      expect(values(i, 1).map(Number)).toEqual(input);
      const m = orderedSummary([...input]);
      expect(m.sorted.map((r) => r.value)).toEqual(ordered);
      expect(m.sorted.map((r) => r.id)).toEqual(ids);
      expect(m.middle).toEqual([2]);
      expect(m.median).toEqual(rational(BigInt(median)));
      expect(m.modes).toEqual([mode]);
      expect(m.maxFrequency).toBe(2);
      expect((Math.min(...input) + Math.max(...input)) / 2).toBe(6.5);
      expect(orderedSummary([...new Set(input)]).median).toEqual(
        rational(13n, 2n),
      );
      expect(m.median).not.toEqual(rational(13n, 2n));
    }
    expect(orderedSummary([0, 0, 0]).modes).toEqual([0]);
    expect(orderedSummary([0, 1, 2]).modes).toEqual([]);
    expect(orderedSummary([2, 4, 6, 8]).median).toEqual(rational(5n));
    expect([2, 4, 6, 8]).not.toContain(5);
  });
  it('uses nominal frequencies rather than arbitrary numeric codes and retains a zero in exact equal sharing', () => {
    for (const [i, counts, waits, total, median] of [
      [0, [3, 1, 1], [0, 1, 3], 4, 1],
      [1, [1, 3, 1], [0, 2, 3], 5, 2],
    ] as const) {
      expect(values(i, 2).map(Number)).toEqual([...counts, ...waits]);
      const names = ['A', 'B', 'C'],
        modal = names[counts.indexOf(3)];
      expect(modal).toBe(i === 0 ? 'A' : 'B');
      const ordinary = counts.reduce((sum, c, j) => sum + c * (j + 1), 0),
        recoded = counts.reduce((sum, c, j) => sum + c * (10 - j), 0);
      expect(ordinary).not.toBe(recoded); // The nominal records stayed fixed; their arbitrary numeric code changed.
      const m = orderedSummary([...waits]);
      expect([m.count, m.total]).toEqual([3, total]);
      expect(m.mean).toEqual(rational(BigInt(total), 3n));
      expect(m.median).toEqual(rational(BigInt(median)));
      expect(m.modes).toEqual([]);
      expect(orderedSummary(waits.filter((v) => v !== 0)).mean).not.toEqual(
        m.mean,
      );
    }
  });
  it('counts overlapping ID events once, then rebuilds a no-replacement bag instead of keeping its old denominator', () => {
    for (const [i, labels, counts, uN, vN, interN, total, afterN, afterD] of [
      [0, ['A', 'A', 'B', 'C'], [2, 1, 1], 3, 2, 1, 4, 2, 3],
      [1, ['A', 'B', 'B', 'C', 'C'], [1, 2, 2], 3, 4, 2, 5, 1, 2],
    ] as const) {
      expect(values(i, 3)).toEqual(labels);
      const records = rows(i, 3).map((r) => ({
        id: r[0]!.en,
        label: r[2]!.en,
      }));
      const u = records
          .filter((r) => r.label === 'A' || r.label === 'B')
          .map((r) => r.id),
        v = records
          .filter((r) => r.label === 'B' || r.label === 'C')
          .map((r) => r.id);
      const union = new Set([...u, ...v]),
        intersection = u.filter((id) => v.includes(id));
      expect([u.length, v.length, union.size, intersection.length]).toEqual([
        uN,
        vN,
        total,
        interN,
      ]);
      expect(u.length + v.length).toBeGreaterThan(total);
      expect(u.length + v.length - intersection.length).toBe(total);
      expect(bagChance([...counts], [0, 1]).probability).toEqual(
        rational(BigInt(uN), BigInt(total)),
      );
      expect(bagChance([...counts], [1, 2]).probability).toEqual(
        rational(BigInt(vN), BigInt(total)),
      );
      expect(bagChance([...counts], [1]).probability).toEqual(
        rational(BigInt(interN), BigInt(total)),
      );
      const after = [counts[0] - 1, counts[1], counts[2]];
      expect(bagChance(after, [0, 1]).probability).toEqual(
        rational(BigInt(afterN), BigInt(afterD)),
      );
      expect(bagChance([...counts], []).probability).toEqual(rational(0n));
      expect(bagChance([...counts], [0, 1, 2]).probability).toEqual(
        rational(1n),
      );
    }
    expect(() => bagChance([0, 0, 0], [])).toThrow();
  });
  it('recounts all ordered records rather than the display window and independently compares exact frequency distances', () => {
    const original = [
      ['A', 'A', 'B', 'C', 'A', 'B', 'A', 'C', 'A', 'A'],
      ['A', 'B', 'A', 'A', 'C', 'B', 'A', 'C', 'B', 'A', 'B', 'C'],
    ];
    for (const [i, total, a, b, pDen, oldN, oldD, newN, newD, windowStart] of [
      [0, 10, 6, 2, 2, 1n, 10n, 3n, 22n, 3],
      [1, 12, 5, 4, 3, 1n, 12n, 5n, 39n, 5],
    ] as const) {
      const outcomes = values(i, 4);
      expect(outcomes).toEqual(original[i]);
      expect(rows(i, 4).map((r) => r[0]!.en)).toEqual(
        Array.from({ length: total }, (_, i) => 'T' + (i + 1)),
      );
      const model = spinnerModel(
        ['A', 'B', 'C'],
        i === 0 ? [2, 1, 1] : [1, 1, 1],
      );
      expect(eventChance(model, ['A']).probability).toEqual(
        rational(1n, BigInt(pDen)),
      );
      expect(eventChance(model, ['B']).probability).toEqual(
        i === 0 ? rational(1n, 4n) : rational(1n, 3n),
      );
      const fa = frequencySummary(outcomes, ['A']),
        fb = frequencySummary(outcomes, ['B']);
      expect([fa.trials, fa.hits, fb.trials, fb.hits]).toEqual([
        total,
        a,
        total,
        b,
      ]);
      expect(fa.frequency).toEqual(rational(BigInt(a), BigInt(total)));
      expect(fb.frequency).toEqual(rational(BigInt(b), BigInt(total)));
      expect(total - 7).toBe(windowStart);
      expect(
        textR(frequencySummary(outcomes.slice(-8), ['A']).frequency!),
      ).toBe(i === 0 ? '1/2' : '1/4');
      expect(frequencySummary(outcomes.slice(-8), ['A']).frequency).not.toEqual(
        fa.frequency,
      );
      expect(fa.trace.slice(0, 3).map((p) => [p.trials, p.value])).toEqual(
        i === 0
          ? [
              [1, 1],
              [2, 1],
              [3, 2 / 3],
            ]
          : [
              [1, 1],
              [2, 1 / 2],
              [3, 2 / 3],
            ],
      );
      const dist = (hits: number, n: number) =>
        rational(BigInt(Math.abs(pDen * hits - n)), BigInt(pDen * n));
      expect(dist(a, total)).toEqual(rational(oldN, oldD));
      expect(dist(a + 1, total + 1)).toEqual(rational(newN, newD));
      expect(newN * oldD).toBeGreaterThan(oldN * newD);
      expect(frequencySummary([], ['A']).frequency).toBeNull();
      expect(
        frequencySummary(['B', 'B', 'B', 'B', 'B'], ['A']).frequency,
      ).toEqual(rational(0n));
    }
  });
  it('supplies original observations and individually identified bags in repaired exact-transfer question stems', () => {
    const j76 = lessonById('J76-L03')!.questions[5]!,
      j972 = lessonById('J97-L02')!.questions[5]!,
      j973 = lessonById('J97-L03')!.questions[5]!;
    expect(j76.stem.en).toContain('4,5,6,7,8');
    expect(j76.stem.zh).toContain('4、5、6、7、8');
    expect(orderedSummary([4, 5, 6, 7, 50]).mean).toEqual(rational(72n, 5n));
    expect(orderedSummary([4, 5, 6, 7, 0]).mean).toEqual(rational(22n, 5n));
    expect(j972.stem.en).toContain('three red and two blue');
    expect(j973.stem.en).toContain('R1,R2,R3,B1,B2');
    const ids = ['R1', 'R2', 'R3', 'B1', 'B2'],
      pairs = ids.flatMap((a) => ids.map((b) => [a, b]));
    expect(pairs).toHaveLength(25);
    const without = pairs.filter(([a, b]) => a !== b);
    expect(without).toHaveLength(20);
    expect(
      without.filter(([a, b]) => a!.startsWith('R') && b!.startsWith('R')),
    ).toHaveLength(6);
  });
});
