import { describe, it, expect } from 'vitest';
import { pythagoreanMeaningRetrieval } from './content/pythagoreanMeaningRetrieval';
import { congruenceMotionRecurrence } from './content/congruenceMotionRecurrence';
import { congruenceMotionRetrieval } from './content/congruenceMotionRetrieval';
import { cartesianMeaningRetrieval } from './content/cartesianMeaningRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import { readCoordinate as P, coordinateText } from './cartesianModels';
import { readRational as R } from './rationalModels';
import { addR, negR, mulR, textR } from './algebraModels';
import {
  rigidImage,
  squaredDistance,
  midpoint,
  pythagoreanSquare,
  pythagoreanClassification,
  checkRootLength,
  readRootLength,
} from './pythagoreanModels';
const C = (p: Parameters<typeof coordinateText>[0]) =>
  coordinateText(p).replace(/\s/g, '');
const sets = Object.values(pythagoreanMeaningRetrieval);
const row = (i: number, n: number, key: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === key,
  )![2]!.en;
describe('J87 fractional transformations and exact premises', () => {
  it('retains ten old arguments, reuses existing reflection/distance tasks and adds just six cards', () => {
    const entries = congruenceMotionRecurrence.filter((e) =>
        e.sourceLesson.startsWith('J87-'),
      ),
      refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(18);
    expect(refs.filter((id) => id.includes('-CONG-MOTION-'))).toHaveLength(12);
    expect(
      refs.filter((id) => id.includes('-PYTHAGOREAN-MEANING-')),
    ).toHaveLength(10);
    expect(entries[2]!.targets).toEqual([
      'H05-MAINT-CONG-MOTION-Q8',
      'H06-MAINT-CONG-MOTION-Q8',
    ]);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of entries)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J87'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    for (const s of Object.values(congruenceMotionRetrieval))
      expect(s.questions).toHaveLength(10);
    for (const s of Object.values(cartesianMeaningRetrieval))
      expect(s.bridgeByQuestion[s.questions[0]!.id]).toBe('J75-L02');
    expect(lessons).toHaveLength(358);
  });
  it('keeps six bilingual original tables and explicit human review with separate keys', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J87-L01',
        'J87-L02',
        'J87-L04',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('right exact midpoint squared all done', q.answer),
        ).toBeNull();
        expect(q.hints).toHaveLength(2);
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en && c.zh)),
        ).toBe(true);
      }
    }
  });
  it('checks actual fractional triangle data, diagonal mirrors and swapped identities', () => {
    for (const i of [0, 1]) {
      const points = [...row(i, 1, 'G').matchAll(/[ABC](\([^)]*\))/g)].map(
        (m) => P(m[1]!)!,
      );
      expect(points).toHaveLength(3);
      const diagonal = points.map((p) =>
        C(rigidImage(p, { kind: 'reflect', line: 'y=x' })),
      );
      expect(diagonal).toEqual(
        i === 0
          ? ['(1/2,1/2)', '(2,-3/2)', '(-3/2,2)']
          : ['(-1/2,-1/2)', '(-3/2,3/2)', '(1/2,2)'],
      );
      expect(textR(squaredDistance(points[0]!, points[1]!))).toBe(
        i === 0 ? '25/4' : '5',
      );
      for (const line of ['y=x', 'y-axis'] as const) {
        const image = points.map((p) =>
          rigidImage(p, { kind: 'reflect', line }),
        );
        expect(squaredDistance(image[0]!, image[1]!)).toEqual(
          squaredDistance(points[0]!, points[1]!),
        );
        for (const [j, p] of points.entries())
          expect(rigidImage(image[j]!, { kind: 'reflect', line })).toEqual(p);
      }
    }
  });
  it('verifies each own-sign example stage and preserves every edge under the composition', () => {
    for (const i of [0, 1]) {
      const original = ['(0,0)', '(1/2,0)', i === 0 ? '(0,1)' : '(0,2)'].map(
        (p) => P(p)!,
      );
      const translated = original.map((p) =>
        rigidImage(p, {
          kind: 'translate',
          vector: P(i === 0 ? '(1,-1)' : '(-1,2)')!,
        }),
      );
      const mirrored = translated.map((p) =>
        rigidImage(p, { kind: 'reflect', line: 'y=x' }),
      );
      const final = mirrored.map((p) =>
        rigidImage(p, {
          kind: 'rotate',
          center: P(i === 0 ? '(1,1)' : '(-1,1)')!,
          turns: 2,
        }),
      );
      expect(final.map(C)).toEqual(
        i === 0
          ? ['(3,1)', '(3,1/2)', '(2,1)']
          : ['(-4,3)', '(-4,5/2)', '(-6,3)'],
      );
      for (const image of [translated, mirrored, final])
        for (const [a, b] of [
          [0, 1],
          [1, 2],
          [2, 0],
        ])
          expect(squaredDistance(image[a!]!, image[b!]!)).toEqual(
            squaredDistance(original[a!]!, original[b!]!),
          );
      expect(sets[i]!.questions[0]!.stem.en).toContain('SEQUENTIALLY');
    }
  });
  it('recovers fractional half-turn centres and distinguishes equal-radius directions and fixed sets', () => {
    for (const i of [0, 1]) {
      const h = row(i, 2, 'H').match(
        /P=(\([^)]*\)); FIRST 180° image P′=(\([^)]*\))/,
      )!;
      const p = P(h[1]!)!,
        image = P(h[2]!)!,
        o = midpoint(p, image);
      expect(C(o)).toBe(i === 0 ? '(3/2,1)' : '(-1,2)');
      expect(rigidImage(p, { kind: 'rotate', center: o, turns: 2 })).toEqual(
        image,
      );
      expect(C(rigidImage(p, { kind: 'rotate', center: o, turns: 1 }))).toBe(
        i === 0 ? '(-1/2,-1)' : '(1/2,0)',
      );
      const cw = rigidImage(p, { kind: 'rotate', center: o, turns: 3 });
      expect(C(cw)).toBe(i === 0 ? '(7/2,3)' : '(-5/2,4)');
      expect(squaredDistance(o, cw)).toEqual(squaredDistance(o, p));
      expect(
        rigidImage(image, { kind: 'rotate', center: o, turns: 2 }),
      ).toEqual(p);
      const fixed = P(i === 0 ? '(1/3,-2/3)' : '(-2/3,4/3)')!;
      expect(midpoint(fixed, fixed)).toEqual(fixed);
      expect(
        rigidImage(fixed, { kind: 'rotate', center: fixed, turns: 2 }),
      ).toEqual(fixed);
    }
  });
  it('checks fractional hypotenuse/leg squares, radical equivalence and exact decimal discrepancies', () => {
    for (const i of [0, 1]) {
      const leg = i === 0 ? '5/12' : '8/15',
        hyp = i === 0 ? '13/12' : '17/15';
      const forward = pythagoreanSquare(leg, '1', 'hypotenuse');
      expect(forward.kind).toBe('length');
      if (forward.kind === 'length')
        expect(checkRootLength(hyp, textR(forward.square))).toBe(true);
      const inverse = pythagoreanSquare('1', hyp, 'leg');
      expect(inverse.kind).toBe('length');
      if (inverse.kind === 'length')
        expect(checkRootLength(leg, textR(inverse.square))).toBe(true);
      const s = row(i, 3, 'S/D')
        .split(';')[0]!
        .split(',')
        .map((s) => s.replace(/cm$/, ''));
      expect(s).toHaveLength(3);
      for (const radical of s)
        expect(checkRootLength(radical, i === 0 ? '5/4' : '13/9')).toBe(true);
      expect(
        checkRootLength(i === 0 ? '-√5/2' : '-√13/3', i === 0 ? '5/4' : '13/9'),
      ).toBe(false);
      const decimal = i === 0 ? '1.12' : '1.20';
      const delta = addR(
        readRootLength(decimal)!,
        negR(R(i === 0 ? '5/4' : '13/9')),
      );
      expect(textR(delta)).toBe(i === 0 ? '11/2500' : '-1/225');
      expect(checkRootLength(decimal, i === 0 ? '5/4' : '13/9')).toBe(false);
      expect(mulR(R(hyp), R(hyp))).toEqual(R(i === 0 ? '169/144' : '289/225'));
    }
  });
  it('checks exact near-right classification before rounding and rejects a zero-side square equality', () => {
    for (const i of [0, 1]) {
      const sides = row(i, 3, 'K').replace(/cm/g, '').split(',');
      const m = pythagoreanClassification(sides)!;
      expect(m.kind).toBe(i === 0 ? 'obtuse' : 'acute');
      expect(textR(m.delta!)).toBe(
        i === 0 ? '250001/10000000000' : '-249999/10000000000',
      );
      expect(pythagoreanClassification(['3/4', '1', '1.25'])!.kind).toBe(
        'right',
      );
      expect(
        pythagoreanClassification(row(i, 3, 'Z').replace(/cm/g, '').split(','))!
          .kind,
      ).toBe('impossible');
      const wrong = i === 0 ? ['2', '4', '6'] : ['3', '5', '8'];
      expect(pythagoreanClassification(wrong)!.kind).toBe('impossible');
    }
  });
});
