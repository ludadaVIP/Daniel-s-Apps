import { describe, it, expect } from 'vitest';
import { cartesianMeaningRetrieval } from './content/cartesianMeaningRetrieval';
import { geometryGraphRecurrence } from './content/geometryGraphRecurrence';
import { maintenanceSets } from './content/maintenance';
import { j75Lessons } from './content/J75';
import { lessons } from './content';
import { checkAnswer } from './model';
import { readCoordinate } from './cartesianModels';
import {
  addR,
  negR,
  divR,
  mulR,
  textR,
  rational,
  parseAffine,
  evaluateAffine,
} from './algebraModels';

const sets = Object.values(cartesianMeaningRetrieval);
const raw = (s: number, q: number, row: string) =>
  sets[s]!.questions[q - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === row,
  )![2]!.en;
const pairs = (s: string) =>
  [...s.matchAll(/\([^()]+,[^()]+\)/g)].map((m) => readCoordinate(m[0])!);
const sub = (a: Parameters<typeof addR>[0], b: Parameters<typeof addR>[0]) =>
  addR(a, negR(b));
const rule = (k: string, b: string) => parseAffine(`${k}x+(${b})`, 'x')!;
describe('J75 specific coordinate and affine meaning', () => {
  it('keeps all fourteen old references and shares only genuinely requested new tasks', () => {
    const entries = geometryGraphRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J75-'),
    );
    expect(entries.flatMap((e) => e.targets)).toHaveLength(26);
    expect(new Set(entries.flatMap((e) => e.targets)).size).toBe(14);
    expect(
      entries.flatMap((e) =>
        e.targets.filter((t) => !t.includes('CARTESIAN-MEANING')),
      ),
    ).toHaveLength(14);
    expect(entries[4]!.targets.filter((t) => t.includes('CARTESIAN'))).toEqual([
      'J93-MAINT-CARTESIAN-MEANING-Q3',
      'J94-MAINT-CARTESIAN-MEANING-Q3',
    ]);
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J75-L02',
        'J75-L04',
        'J75-L03',
      ]);
      for (const q of s.questions) {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('derives translated endpoints and involutive reflections from the raw original points', () => {
    for (const [i, end, image] of [
      [0, ['-7/2', '1'], ['-6', '-3/2']],
      [1, ['-1', '7/2'], ['-3/2', '-6']],
    ] as const) {
      const [p, d] = pairs(raw(i, 1, 'P/T'));
      const actual = [addR(p![0], d![0]), addR(p![1], d![1])].map(textR);
      expect(actual).toEqual(end);
      expect(pairs(raw(i, 1, 'R'))[0]).toEqual(p);
      const reflected = [p![0], negR(p![1])] as const;
      expect(reflected.map(textR)).toEqual(image);
      expect([reflected[0], negR(reflected[1])]).toEqual(p);
      expect(d!.map(textR)).not.toEqual(end);
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        '(' + end.join(',').replaceAll('-', '−') + ')',
      );
    }
  });
  it('converts both measurement-unit values while keeping display-only metre values fixed', () => {
    for (const [i, s] of sets.entries()) {
      expect(raw(i, 1, 'U')).toContain('(2m,3m)');
      expect(raw(i, 1, 'U')).toContain('1m=100cm');
      const cm = [2, 3].map((v) => v * 100);
      expect(cm).toEqual([200, 300]);
      expect(raw(i, 1, 'D')).toContain('units stay m');
      expect([2 / 1, 3 / 1]).not.toEqual([2 / 2, 3 / 1]);
      expect(s.questions[0]!.solution.en).toContain('(200,300)cm');
    }
  });
  it('solves the two nonzero-input pairs exactly, preserving a reversed difference quotient', () => {
    for (const [i, b] of [
      [0, '2'],
      [1, '3'],
    ] as const) {
      const [a, c] = pairs(raw(i, 2, 'A'));
      expect(a![0][0]).not.toBe(0n);
      expect(c![0][0]).not.toBe(0n);
      const k = divR(sub(c![1], a![1]), sub(c![0], a![0]));
      const intercept = sub(a![1], mulR(k, a![0]));
      expect(textR(k)).toBe('-1/2');
      expect(textR(intercept)).toBe(b);
      expect(divR(sub(a![1], c![1]), sub(a![0], c![0]))).toEqual(k);
      for (const p of [a!, c!])
        expect(evaluateAffine({ a: k, b: intercept }, p[0])).toEqual(p[1]);
      expect(sets[i]!.questions[1]!.solution.en).toContain('b=' + b);
    }
  });
  it('distinguishes fixed half-unit decreases, halving, changes and final values', () => {
    for (const [i, b] of [
      [0, 2],
      [1, 3],
    ] as const) {
      const ys = [0, 1, 2].map((x) =>
        evaluateAffine(rule('-1/2', String(b)), rational(BigInt(x))),
      );
      expect(ys.map(textR)).toEqual(
        i === 0 ? ['2', '3/2', '1'] : ['3', '5/2', '2'],
      );
      expect(sub(ys[1]!, ys[0]!)).toEqual(rational(-1n, 2n));
      expect(divR(ys[0]!, rational(2n))).not.toEqual(ys[1]);
      expect(mulR(rational(-1n, 2n), rational(3n))).toEqual(rational(-3n, 2n));
      expect(sets[i]!.questions[1]!.solution.en).toContain(
        'not a determined final output',
      );
    }
    expect(j75Lessons[3]!.exit.solution.zh).toContain('减少 1/2');
    expect(j75Lessons[3]!.exit.solution.zh).not.toContain('y 减半');
    expect(j75Lessons[1]!.guided.hints[1]!.en).toContain(
      'measurement units fixed',
    );
  });
  it('derives constant and zero rules and distinguishes duplicate insufficiency from conflicts', () => {
    for (const [i, constant] of [
      [0, '3'],
      [1, '-2'],
    ] as const) {
      for (const [row, b] of [
        ['C', constant],
        ['Z', '0'],
      ] as const) {
        const [a, c] = pairs(raw(i, 2, row));
        const k = divR(sub(c![1], a![1]), sub(c![0], a![0]));
        expect(textR(k)).toBe('0');
        expect(textR(sub(a![1], mulR(k, a![0])))).toBe(b);
      }
      const [a, c] = pairs(raw(i, 2, 'D'));
      expect(a).toEqual(c);
      expect(evaluateAffine(rule('0', '2'), a![0])).toEqual(a![1]);
      expect(evaluateAffine(rule('1', '1'), a![0])).toEqual(a![1]);
      const [d, e] = pairs(raw(i, 2, 'E'));
      expect(d![0]).toEqual(e![0]);
      expect(d![1]).not.toEqual(e![1]);
      expect(() => divR(sub(c![1], a![1]), sub(c![0], a![0]))).toThrow();
    }
  });
  it('reads actual record rows and supplied expressions to compute a finite-match counterexample', () => {
    for (const [i, s] of sets.entries()) {
      const records = ['A', 'B', 'C'].map((id) =>
        raw(i, 3, id).match(/-?\d+/g)!.map(Number),
      );
      const f = parseAffine(raw(i, 3, 'F').split('=')[1]!, 'x')!;
      const fAt = (x: number) =>
        Number(evaluateAffine(f, rational(BigInt(x)))[0]) /
        Number(evaluateAffine(f, rational(BigInt(x)))[1]);
      const factors = raw(i, 3, 'G').split('=')[1]!.includes('(x+2)x(x−3)')
        ? [-2, 0, 3]
        : [-1, 1, 4];
      expect(records.map((r) => r[0])).toEqual(factors);
      const gAt = (x: number) =>
        fAt(x) + factors.reduce((p, root) => p * (x - root), 1);
      for (const [x, y] of records) {
        expect(fAt(x!)).toBe(y);
        expect(gAt(x!)).toBe(y);
      }
      const x = Number(raw(i, 3, 'N').split('=')[1]);
      expect([fAt(x), gAt(x)]).toEqual(i === 0 ? [3, -3] : [0, -6]);
      expect(fAt(-1)).toBe(i === 0 ? -1 : 3);
      const [a, b, c] = factors;
      expect(b! - a!).not.toBe(c! - b!);
      expect(s.questions[2]!.solution.en).toContain(`G=${gAt(x)}`);
      const p = parseAffine(raw(i, 3, 'P').split('=')[1]!, 'x')!;
      expect(textR(p.b)).toBe('0');
      expect(textR(p.a)).not.toBe('0');
      expect(textR(f.b)).not.toBe('0');
    }
  });
  it('retains row identity and clips a supplied rule without admitting half-card inputs', () => {
    for (const [i, s] of sets.entries()) {
      expect(
        s.questions[2]!.contextTable!.rows.slice(0, 3).map((r) => r[0]!.en),
      ).toEqual(['C', 'A', 'B']);
      const original = ['A', 'B', 'C'].map((id) =>
        raw(i, 3, id).match(/-?\d+/g)!.map(Number),
      );
      const columns = original.map((r) => r[1]!).sort((a, b) => a - b);
      expect(original.map((r) => r[1])).toEqual(
        i === 0 ? columns : [...columns].reverse(),
      );
      expect(raw(i, 3, 'K')).toContain('n∈{0,1,2,3}');
      expect([0, 1, 2, 3].map((n) => [n, 2 * n + 3])).toEqual([
        [0, 3],
        [1, 5],
        [2, 7],
        [3, 9],
      ]);
      expect(Number.isInteger(0.5)).toBe(false);
      expect(2 * 0.5 + 3).toBe(4);
      expect(s.questions[2]!.solution.en).toContain(
        'not an admissible half-card fee',
      );
    }
  });
  it('retrieves valid negative Celsius in J93 as well as the old J94 temperature task', () => {
    expect(raw(0, 3, 'H')).toContain('T=−5+2t');
    expect([0, 1, 3].map((t) => -5 + 2 * t)).toEqual([-5, -3, 1]);
    expect(sets[0]!.questions[2]!.solution.en).toContain(
      'valid negative Celsius reading',
    );
    expect(
      sets[1]!.questions[2]!.contextTable!.rows.some((r) => r[0]!.en === 'H'),
    ).toBe(false);
  });
  it('accepts different self-created continuous and integer models within explicit domains', () => {
    for (const [i, a, r, p, b, nmax] of [
      [0, 8, 2, 2, 1, 3],
      [1, 6, 1, 3, 2, 2],
    ] as const) {
      const stop = a / r;
      const water = [0, stop / 2, stop].map((t) => [t, a - r * t]);
      expect(water[2]![1]).toBe(0);
      expect(water.every(([t, v]) => t! >= 0 && t! <= stop && v! >= 0)).toBe(
        true,
      );
      expect(a - r * (stop + 1)).toBeLessThan(0);
      const cards = [0, 1, nmax].map((n) => [n, p * n + b]);
      expect(cards[0]![1]).toBe(b);
      expect(p).toBeGreaterThan(0);
      expect(sets[i]!.questions[2]!.stem.en).toContain('invent a finite-time');
      expect(sets[i]!.questions[2]!.solution.en).toContain(
        'not a unique formula',
      );
    }
  });
});
