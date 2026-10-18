import { describe, it, expect } from 'vitest';
import {
  j97Lessons,
  j97CheckQuestions,
  j97ReviewQuestion,
} from './content/J97';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  jointModel,
  jointCases,
  checkIndependence,
  numberedPairs,
  surveyPopulation,
  surveySample,
  simulatePairs,
} from './probabilityModels';
import { treeEvent, type TreeEvent } from './inferenceModels';
const bodies = import.meta.glob('../../../content/lessons/J97-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j97Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j97CheckQuestions,
];
const fraction = (r: readonly bigint[], n: number, d: number) =>
  expect(r[0]! * BigInt(d)).toBe(BigInt(n) * r[1]!);
const hit = (code: string, e: TreeEvent) =>
  e === 'two-red'
    ? code === 'RR'
    : e === 'different'
      ? code === 'RB' || code === 'BR'
      : code !== 'RR';
function oracle(
  red: number,
  blue: number,
  replace: boolean,
  event: TreeEvent,
  seed: number,
  count: number,
) {
  let state = BigInt(seed),
    hits = 0;
  const out: { first: string; second: string; hits: number }[] = [],
    tokens = [
      ...Array.from({ length: red }, (_, i) => `R${i + 1}`),
      ...Array.from({ length: blue }, (_, i) => `B${i + 1}`),
    ];
  const choose = (length: number) => {
    state = (1664525n * state + 1013904223n) % 4294967296n;
    return Number(((2n * state + 1n) * BigInt(length)) / 8589934592n);
  };
  for (let i = 0; i < count; i++) {
    const k = choose(tokens.length),
      first = tokens[k]!,
      second = (replace ? tokens : tokens.filter((_, j) => j !== k))[
        choose(tokens.length - (replace ? 0 : 1))
      ]!;
    if (hit(first[0]! + second[0]!, event)) hits++;
    out.push({ first, second, hits });
  }
  return out;
}
describe('J97 complete probability models, conditional counting and finite simulation', () => {
  it('registers the five planned courses with earlier prerequisites and two full examples per language', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('J97-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j97Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J97.questions).toHaveLength(8);
    for (const l of j97Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.findIndex((p) => p.id === id)).toBeGreaterThanOrEqual(0);
        expect(lessons.findIndex((p) => p.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j97ReviewQuestion(l.id, 0));
    }
  });
  it('checks every one of 48 items while leaving ten explanations human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      if (q.answer.kind === 'explain') {
        expect(
          checkAnswer('probability yes correct explanation', q.answer),
        ).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id}: rejects ${a}`).toBe(false);
    }
  });
  it('anchors every constructed quantity, judgement and choice independently', () => {
    const anchors: (string | null)[][] = [
      ['独立', '2/9', '1/3', '不独立', '0', null],
      ['3/10', '1/2', '3/10', '3/5', '9/25', '3/10'],
      ['3/5', '20', '3/10', '1/10', '7/10', '0'],
      ['1/4', '1/2', '3/4', 'insufficient', 'sufficient', null],
      ['11/20', '3/5', 'insufficient', '29/50', '61/110', null],
    ];
    j97Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((a, j) =>
        expect(checkAnswer(a ?? 'reason', qs[j]!.answer)).toBe(
          a === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['independent', '3/10', '3/5', '3/4', '61/110', null, '2', null].forEach(
      (a, i) =>
        expect(checkAnswer(a ?? 'reason', j97CheckQuestions[i]!.answer)).toBe(
          a === null ? null : true,
        ),
    );
  });
  it('audits all 1295 nonempty small joint spaces by independent cross products', () => {
    for (let a = 0; a < 6; a++)
      for (let b = 0; b < 6; b++)
        for (let c = 0; c < 6; c++)
          for (let d = 0; d < 6; d++) {
            const n = a + b + c + d;
            if (!n) continue;
            const m = jointModel([a, b, c, d]);
            fraction(m.pAB, a, n);
            fraction(m.pA, a + b, n);
            fraction(m.pB, a + c, n);
            expect(m.independent).toBe(a * n === (a + b) * (a + c));
            expect(m.disjoint).toBe(a === 0);
            if (a + b) fraction(m.givenA!, a, a + b);
            else expect(m.givenA).toBeNull();
          }
  });
  it('distinguishes unequal independent marginals, nonzero disjoint events and impossible conditions', () => {
    expect(jointCases.map((c) => jointModel(c.cells).independent)).toEqual([
      true,
      false,
      false,
      true,
      true,
    ]);
    expect(jointModel([0, 0, 2, 2]).givenA).toBeNull();
    for (const a of ['INDEPENDENT', ' 独立 ', '相互独立'])
      expect(checkIndependence(a, 'independent')).toBe(true);
    for (const a of ['dependent', '不独立', 'not independent'])
      expect(checkIndependence(a, 'dependent')).toBe(true);
    for (const a of ['互斥', '可能', 'yes', 'independent dependent'])
      expect(checkIndependence(a, 'independent')).toBe(false);
  });
  it('enumerates all bounded eligible ordered ID pairs, excluding only the same ID without replacement', () => {
    for (let r = 0; r <= 5; r++)
      for (let b = 0; b <= 5; b++)
        for (const replace of [false, true]) {
          if (r + b < 2) continue;
          const m = numberedPairs(r, b, replace),
            n = r + b;
          expect(m.labelled).toHaveLength(n * (replace ? n : n - 1));
          expect(new Set(m.labelled.map((p) => p.id)).size).toBe(
            m.labelled.length,
          );
          for (const p of m.labelled) {
            const [a, z] = p.id.split('-');
            if (!replace) expect(a).not.toBe(z);
          }
          for (const leaf of m.leaves) {
            const count = m.labelled.filter((p) => p.code === leaf.code).length;
            fraction(leaf.probability, count, m.labelled.length);
            expect(leaf.possible).toBe(count > 0);
          }
          fraction(m.totalProbability, 1, 1);
        }
  });
  it('sums only disjoint event paths and validates different/at-least-blue complements', () => {
    for (let r = 1; r <= 5; r++)
      for (let b = 1; b <= 5; b++)
        for (const replace of [false, true]) {
          const m = numberedPairs(r, b, replace);
          for (const e of [
            'two-red',
            'different',
            'at-least-blue',
          ] as TreeEvent[]) {
            const a = treeEvent(m, e),
              count = m.labelled.filter((p) => hit(p.code, e)).length;
            fraction(a.probability, count, m.labelledTotal);
            expect(a.labelledHits).toBe(count);
          }
          const rr = treeEvent(m, 'two-red'),
            blue = treeEvent(m, 'at-least-blue');
          expect(rr.labelledHits + blue.labelledHits).toBe(m.labelledTotal);
        }
    fraction(
      treeEvent(numberedPairs(3, 2, false), 'different').probability,
      3,
      5,
    );
  });
  it('keeps complete census, local coverage and nonresponse denominators separate', () => {
    expect(surveyPopulation).toHaveLength(24);
    expect(surveyPopulation.filter((p) => p.yes)).toHaveLength(12);
    const a = surveySample(8, 'nearby', 19);
    expect(a.frameSize).toBe(8);
    expect(a.census).toBe(false);
    fraction(a.frequency!, 1, 4);
    const c = surveySample(24, 'all', 19);
    expect(c.census).toBe(true);
    fraction(c.frequency!, 1, 2);
    const missing = surveySample(24, 'nonresponse', 19);
    expect(missing.missing).toBe(8);
    expect(missing.respondents).toBe(16);
    expect(missing.yes).toBe(6);
    fraction(missing.frequency!, 3, 8);
    expect(
      missing.invited
        .filter((p) => p.group === 'C')
        .every((p) => p.response === null),
    ).toBe(true);
  });
  it('replays unique-ID survey samples without promising perfect group coverage or zero response', () => {
    let varied = false,
      empty = false;
    for (let seed = 0; seed < 80; seed++) {
      const a = surveySample(8, 'all', seed);
      expect(new Set(a.invited.map((p) => p.id)).size).toBe(8);
      expect(surveySample(8, 'all', seed)).toEqual(a);
      if (a.yes !== 4) varied = true;
      const b = surveySample(1, 'nonresponse', seed);
      if (b.respondents === 0) {
        empty = true;
        expect(b.frequency).toBeNull();
        expect(b.missing).toBe(1);
      }
    }
    expect(varied).toBe(true);
    expect(empty).toBe(true);
  });
  it('rejects invalid joint spaces, frames, trial counts and random states', () => {
    for (const c of [
      [],
      [0, 0, 0, 0],
      [-1, 1, 1, 1],
      [25, 1, 1, 1],
      [0.5, 1, 1, 1],
    ])
      expect(() => jointModel(c)).toThrow();
    for (const [n, method, seed] of [
      [9, 'nearby', 1],
      [0, 'all', 1],
      [25, 'all', 1],
      [8, 'other', 1],
      [8, 'all', -1],
    ] as const)
      expect(() => surveySample(n, method as 'all', seed)).toThrow();
    for (const n of [-1, 1001, 0.5, NaN])
      expect(() => simulatePairs(3, 2, false, 'different', 37, n)).toThrow();
    expect(() => simulatePairs(3, 2, false, 'different', -1, 1)).toThrow();
    expect(() =>
      simulatePairs(3, 2, false, 'other' as TreeEvent, 1, 1),
    ).toThrow();
  });
  it('matches seeded ID records with an independent BigInt generator and removal oracle', () => {
    for (let r = 1; r <= 5; r++)
      for (let b = 1; b <= 5; b++)
        for (const replace of [false, true])
          for (const event of [
            'two-red',
            'different',
            'at-least-blue',
          ] as TreeEvent[])
            for (const seed of [0, 37, 4294967295]) {
              const expected = oracle(r, b, replace, event, seed, 30),
                actual = simulatePairs(r, b, replace, event, seed, 30);
              expect(
                actual.records.map(({ first, second, hits }) => ({
                  first,
                  second,
                  hits,
                })),
              ).toEqual(expected);
              actual.records.forEach((v, i) => {
                fraction(v.frequency, expected[i]!.hits, i + 1);
                expect(v.hit).toBe(hit(v.code, event));
              });
            }
  });
  it('extends the same prefix, restores the original bag per trial and replays restart', () => {
    const a = simulatePairs(1, 1, false, 'different', 37, 1000),
      b = simulatePairs(1, 1, false, 'different', 37, 10);
    expect(a.records.slice(0, 10)).toEqual(b.records);
    expect(a.records.every((r) => r.first !== r.second && r.hit)).toBe(true);
    fraction(a.frequency!, 1, 1);
    expect(simulatePairs(1, 1, false, 'different', 37, 10)).toEqual(b);
    expect(simulatePairs(3, 2, false, 'different', 38, 30).records).not.toEqual(
      simulatePairs(3, 2, false, 'different', 37, 30).records,
    );
  });
  it('keeps zero-trial frequency undefined and finite errors nonmonotonic', () => {
    const zero = simulatePairs(3, 2, false, 'different', 37, 0);
    expect(zero.frequency).toBeNull();
    expect(zero.records).toHaveLength(0);
    fraction(zero.theory, 3, 5);
    const m = simulatePairs(3, 2, false, 'different', 37, 200);
    let worse = false;
    for (let i = 10; i < m.records.length; i++)
      if (
        Math.abs(m.records[i]!.hits / (i + 1) - 0.6) >
        Math.abs(m.records[i - 1]!.hits / i - 0.6)
      )
        worse = true;
    expect(worse).toBe(true);
    expect(m.records.some((r) => r.hits / r.n !== 0.6)).toBe(true);
  });
  it('independently checks all 400 retrieval quantities and classifications', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = j97ReviewQuestion(`J97-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) {
          const a = 1 + (k % 3),
            b = 1 + (Math.floor(k / 3) % 2),
            c = 1 + (Math.floor(k / 6) % 3),
            d = 1 + (Math.floor(k / 18) % 2),
            cells = [a * c + (k % 2), a * d, b * c, b * d],
            n = cells.reduce((s, v) => s + v, 0);
          expected =
            cells[0]! * n === (cells[0]! + cells[1]!) * (cells[0]! + cells[2]!)
              ? 'independent'
              : 'dependent';
        } else if (i === 1 || i === 2) {
          const r = 1 + (k % 5),
            b = 1 + (Math.floor(k / 5) % 5),
            n = r + b,
            replace = i === 1 && Math.floor(k / 25) % 2 === 1,
            den = n * (replace ? n : n - 1),
            rr = r * (replace ? r : r - 1),
            bb = b * (replace ? b : b - 1),
            diff = 2 * r * b;
          if (i === 1) expected = `${[rr, r * b, r * b, bb][k % 4]}/${den}`;
          else
            expected = `${[diff, rr, den - rr][Math.floor(k / 5) % 3]}/${den}`;
        } else
          expected = `${1 + (k % (i === 3 ? 5 : 13))}/${i === 3 ? 5 + (k % 4) : 20 + (k % 11)}`;
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('-3', q.answer)).toBe(false);
      }
  });
  it('bounds review IDs and rounds without relabelling the unchanged bank', () => {
    for (const id of ['J97-L00', 'J97-L06', 'J96-L01'])
      expect(() => j97ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j97ReviewQuestion('J97-L01', n)).toThrow();
    expect(j97ReviewQuestion('J97-L01', 80).id).not.toBe(
      j97ReviewQuestion('J97-L01', 0).id,
    );
    expect(j97ReviewQuestion('J97-L01', 80).stem).toEqual(
      j97ReviewQuestion('J97-L01', 0).stem,
    );
  });
});
