import { describe, it, expect } from 'vitest';
import { inferenceMeaningRetrieval } from './content/inferenceMeaningRetrieval';
import { geometryGraphRecurrence } from './content/geometryGraphRecurrence';
import { geometryGraphRetrieval } from './content/geometryGraphRetrieval';
import { dataLanguageRetrieval } from './content/dataLanguageRetrieval';
import { primaryCapstoneRetrieval } from './content/primaryCapstoneRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import {
  drawTree,
  treeEvent,
  distribution,
  intervalCount,
} from './inferenceModels';
import { rational, textR } from './algebraModels';

const sets = Object.values(inferenceMeaningRetrieval);
const table = (s: number, q: number) =>
  sets[s]!.questions[q - 1]!.contextTable!.rows;
const raw = (s: number, q: number, id: string) =>
  table(s, q).find((r) => r[0]!.en === id)![2]!.en;
const nums = (s: string) => s.match(/-?\d+/g)!.map(Number);
describe('J76 specific denominators, distributions and full outcome sets', () => {
  it('retains seventeen original references and reuses the existing interval and complement tasks', () => {
    const entries = geometryGraphRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J76-'),
    );
    expect(entries.flatMap((e) => e.targets)).toHaveLength(32);
    expect(new Set(entries.flatMap((e) => e.targets)).size).toBe(23);
    expect(
      entries[2]!.targets.filter((t) => !t.includes('INFERENCE-MEANING')),
    ).toEqual(['J91-MAINT-PRIMARY-Q6', 'J92-MAINT-PRIMARY-Q6', 'J88-L02-Q6']);
    expect(entries[1]!.targets).toContain('H27-MAINT-DATA-LANGUAGE-Q2');
    expect(entries[1]!.targets).toContain('H34-MAINT-DATA-LANGUAGE-Q2');
    expect(entries[4]!.targets).toContain('J97-L03-Q5');
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J76-L01',
        'J76-L02',
        'J76-L04',
      ]);
      expect(geometryGraphRetrieval[s.unit].questions).toHaveLength(9);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('computes sample fractions and means from actual rows, constructing distinct compatible population means', () => {
    for (const [i, N, expectedMean, otherMean] of [
      [0, 24, 5, '55/6'],
      [1, 36, 6, '28/3'],
    ] as const) {
      expect(nums(raw(i, 1, 'S'))).toEqual([N, i === 0 ? 4 : 6]);
      const xs = table(i, 1)
        .filter((r) => /^S\d+$/.test(r[0]!.en))
        .map((r) => Number(r[2]!.en));
      const sum = xs.reduce((a, b) => a + b, 0),
        n = xs.length;
      expect(textR(rational(BigInt(n), BigInt(N)))).toBe('1/6');
      expect(sum / n).toBe(expectedMean);
      expect(textR(rational(BigInt(sum), BigInt(N)))).toBe(
        i === 0 ? '5/6' : '1',
      );
      expect(textR(rational(BigInt(sum + 10 * (N - n)), BigInt(N)))).toBe(
        otherMean,
      );
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        `mean=${expectedMean}min`,
      );
    }
  });
  it('keeps response rate, respondent feature proportion and rough population estimate distinct', () => {
    for (const [
      i,
      invited,
      responded,
      yes,
      responseRate,
      yesRate,
      target,
      n,
      hits,
      estimate,
    ] of [
      [0, 8, 5, 3, '5/8', '3/5', 100, 10, 2, 20],
      [1, 10, 6, 2, '3/5', '1/3', 80, 8, 3, 30],
    ] as const) {
      expect(nums(raw(i, 1, 'R'))).toEqual([invited, responded, yes]);
      expect(textR(rational(BigInt(responded), BigInt(invited)))).toBe(
        responseRate,
      );
      expect(textR(rational(BigInt(yes), BigInt(responded)))).toBe(yesRate);
      expect(responded / invited).not.toBe(yes / responded);
      expect(invited - responded).toBe(i === 0 ? 3 : 4);
      expect(nums(raw(i, 1, 'E'))).toEqual([target, hits, n]);
      expect((target * hits) / n).toBe(estimate);
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        `=${estimate} members`,
      );
      expect(raw(i, 1, 'E')).toContain('assume a design suitable');
    }
  });
  it('reconstructs equal-centre different distributions, preserving all duplicate IDs and unobserved means', () => {
    for (const [i, mean, span] of [
      [0, 2, 4],
      [1, 4, 6],
    ] as const) {
      const a = table(i, 2)
          .filter((r) => /^A\d$/.test(r[0]!.en))
          .map((r) => Number(r[2]!.en)),
        b = table(i, 2)
          .filter((r) => /^B\d$/.test(r[0]!.en))
          .map((r) => Number(r[2]!.en));
      expect(a).toHaveLength(4);
      expect(b).toHaveLength(4);
      expect(distribution(a)).toMatchObject({
        mean: rational(BigInt(mean)),
        median: rational(BigInt(mean)),
        range: 0,
      });
      expect(distribution(b)).toMatchObject({
        mean: rational(BigInt(mean)),
        median: rational(BigInt(mean)),
        range: span,
      });
      expect(b.includes(mean)).toBe(false);
      expect(b.filter((x) => x === Math.max(...b)).length / b.length).toBe(0.5);
    }
  });
  it('translates every original record and recomputes centres and ranges without scaling distances', () => {
    for (const [i, d] of [
      [0, 3],
      [1, -1],
    ] as const) {
      const b = table(i, 2)
          .filter((r) => /^B\d$/.test(r[0]!.en))
          .map((r) => Number(r[2]!.en)),
        moved = b.map((x) => x + d),
        old = distribution(b),
        next = distribution(moved);
      expect(raw(i, 2, 'D')).toContain(`x′=x${d > 0 ? '+' : ''}${d}`);
      expect(next.range).toBe(old.range);
      expect(
        Number(next.mean[0]) / Number(next.mean[1]) -
          Number(old.mean[0]) / Number(old.mean[1]),
      ).toBe(d);
      for (let j = 0; j < b.length; j++)
        for (let k = 0; k < b.length; k++)
          expect(moved[j]! - moved[k]!).toBe(b[j]! - b[k]!);
      expect(sets[i]!.questions[1]!.solution.en).toContain(
        'B1–B4=' + moved.join(','),
      );
    }
  });
  it('reuses actual open/closed boundary tasks with all repeated observations retained', () => {
    for (const s of Object.values(dataLanguageRetrieval)) {
      const q = s.questions[1]!,
        diagram = q.diagram!;
      expect(diagram.kind).toBe('dot-distribution');
      if (diagram.kind !== 'dot-distribution')
        throw new Error('Expected original dot plot');
      const x = diagram.values,
        lo = Math.min(...x),
        hi = Math.max(...x);
      expect(intervalCount(x, lo, hi)).toBe(4);
      expect(x.filter((v) => lo < v && v < hi)).toHaveLength(0);
      expect(q.stem.en).toContain('count the actual proportions');
      expect(q.solution.en).toContain('0/4=0%');
    }
  });
  it('independently enumerates every ordered ID pair and checks full rubric sets and unequal colour weights', () => {
    for (const [i, r, b] of [
      [0, 1, 2],
      [1, 2, 2],
    ] as const) {
      const ids = table(i, 3)
        .map((row) => row[0]!.en)
        .filter((x) => /^[RB]\d$/.test(x));
      expect(ids).toHaveLength(r + b);
      for (const replace of [true, false]) {
        const pairs = ids.flatMap((a) =>
          ids.filter((b) => replace || a !== b).map((b) => `${a}-${b}`),
        );
        expect(new Set(pairs).size).toBe((r + b) * (r + b - (replace ? 0 : 1)));
        for (const pair of pairs)
          expect(sets[i]!.questions[2]!.solution.en).toContain(pair);
        const counts = ['RR', 'RB', 'BR', 'BB'].map(
          (c) => pairs.filter((p) => p[0]! + p.split('-')[1]![0] === c).length,
        );
        expect(counts).toEqual(
          i === 0
            ? replace
              ? [1, 2, 2, 4]
              : [0, 2, 2, 2]
            : replace
              ? [4, 4, 4, 4]
              : [2, 4, 4, 2],
        );
        expect(drawTree(r, b, replace).labelled.map((p) => p.id)).toEqual(
          pairs,
        );
      }
    }
  });
  it('counts at-least and exactly-one subsets and cross-checks complements and conditional paths', () => {
    for (const [i, r, b] of [
      [0, 1, 2],
      [1, 2, 2],
    ] as const)
      for (const replace of [true, false]) {
        const tree = drawTree(r, b, replace),
          total = tree.labelled.length,
          atLeast = tree.labelled.filter((p) => p.code.includes('B')),
          exactly = tree.labelled.filter(
            (p) => p.code === 'RB' || p.code === 'BR',
          ),
          rr = tree.labelled.filter((p) => p.code === 'RR');
        expect(atLeast.length).toBe(total - rr.length);
        expect(atLeast.length - exactly.length).toBe(
          tree.labelled.filter((p) => p.code === 'BB').length,
        );
        const p = rational(BigInt(atLeast.length), BigInt(total));
        expect(treeEvent(tree, 'at-least-blue').probability).toEqual(p);
        expect(treeEvent(tree, 'different').probability).toEqual(
          rational(BigInt(exactly.length), BigInt(total)),
        );
        expect(textR(p)).toBe(
          i === 0 ? (replace ? '8/9' : '1') : replace ? '3/4' : '5/6',
        );
        expect(textR(treeEvent(tree, 'different').probability)).toBe(
          replace ? (i === 0 ? '4/9' : '1/2') : '2/3',
        );
        expect(tree.totalProbability).toEqual(rational(1n));
      }
  });
  it('retains the sufficient unusual-record tasks and reconstructs their changes using all records', () => {
    for (const [unit, xs, last, mean, median] of [
      ['J91', [2, 2, 4, 6, 6, 10], 40, 10, 5],
      ['J92', [0, 0, 3, 5, 5, 11], 41, 9, 4],
    ] as const) {
      const q = primaryCapstoneRetrieval[unit].questions[5]!;
      const changed = [...xs.slice(0, -1), last];
      expect(distribution(changed)).toMatchObject({
        mean: rational(BigInt(mean)),
        median: rational(BigInt(median)),
      });
      expect(
        textR(rational(BigInt(last - xs.at(-1)!), BigInt(xs.length))),
      ).toBe('5');
      expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
    }
  });
  it('checks independent self-created populations and one-record changes without deleting an ID', () => {
    for (const [i, a, b, last, newMean, newMedian] of [
      [0, [3, 3, 3, 3], [1, 1, 5, 5], 9, 4, 3],
      [1, [5, 5, 5, 5], [2, 2, 8, 8], 0, 3, 2],
    ] as const) {
      expect(distribution([...a]).mean).toEqual(distribution([...b]).mean);
      expect(distribution([...a]).range).not.toBe(distribution([...b]).range);
      const changed = [...b.slice(0, -1), last];
      expect(changed).toHaveLength(4);
      expect(distribution(changed)).toMatchObject({
        mean: rational(BigInt(newMean)),
        median: rational(BigInt(newMedian)),
      });
      const delta = (last - b[3]) / 4;
      const oldMean =
        Number(distribution([...b]).mean[0]) /
        Number(distribution([...b]).mean[1]);
      expect(newMean - oldMean).toBe(delta);
      expect(sets[i]!.questions[1]!.stem.en).toContain(
        'COMPLETE eight-ID demonstration',
      );
      expect(sets[i]!.questions[1]!.solution.en).toContain(
        'Accept ANY original construction',
      );
    }
  });
});
