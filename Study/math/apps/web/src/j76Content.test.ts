import { describe, it, expect } from 'vitest';
import {
  j76Lessons,
  j76CheckQuestions,
  j76ReviewQuestion,
} from './content/J76';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  readOutcomeSet,
  checkOutcomeSet,
  fictionalPopulation,
  sampleRecords,
  distribution,
  distributionPairs,
  intervalCount,
  changedRecord,
  sampleSpace,
  drawTree,
  treeEvent,
} from './inferenceModels';
const markdown = import.meta.glob('../../../content/lessons/J76-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j76Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j76CheckQuestions,
];
describe('J76 data scope, distribution and exact probability reasoning', () => {
  it('registers five planned bilingual lessons and completes J07 while preserving all 358 IDs', () => {
    const registry = curriculum.flatMap((s) =>
        s.units.flatMap((u) => u.lessons),
      ),
      planned = curriculum.flatMap((s) => s.units).find((u) => u.id === 'J76')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j76Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J76.questions).toHaveLength(8);
    const stage = curriculum.find((s) => s.id === 'J07')!;
    expect(stage.units.flatMap((u) => u.lessons)).toHaveLength(33);
    expect(
      stage.units.flatMap((u) => u.lessons).every((l) => l.available),
    ).toBe(true);
    for (const l of j76Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j76ReviewQuestion(l.id, 0));
    }
  });
  it('executes all accepted/equivalent/misconception cases for 48 unique bilingual items', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      number: 31,
      'outcome-set': 5,
      choice: 6,
      explain: 6,
    }))
      expect(all.filter((q) => q.answer.kind === kind)).toHaveLength(count);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('random, mean, conditional', q.answer)).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently transcribes 36 constructed results and six choices, including exact percentage probabilities', () => {
    const expected = [
      ['6', '48', '1/4', '20', '9 min', '5/8'],
      ['0', '6', '4', '3', '1/2', '5'],
      ['72/5', '6', '22/5', '5', '42/5', '6'],
      ['TT,TH,HT,HH', '6', 'T3,H3,H1,T2,T1,H2', '1/6', '50%', '22,21,12,11'],
      [
        '1/3',
        '4/9',
        '1/2',
        'B1-R2,R2-B1,R1-B1,B1-R1,R2-R1,R1-R2',
        '5/9',
        '2/3',
      ],
    ];
    j76Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(l.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String([2, 1, 0, 2, 1][i]),
      });
    });
    ['8', '9', '6', 'RR,RL,LR,LL', '1/6', '1/10'].forEach((v, i) =>
      expect(checkAnswer(v, j76CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j76CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '2',
    });
    expect(checkAnswer('0.44', j76Lessons[4]!.questions[1]!.answer)).toBe(
      false,
    );
  });
  it('checks complete outcome sets independently of listing order, preserving order inside each code and rejecting duplicates', () => {
    expect(checkOutcomeSet('{tt，th；ht hh}', ['HH', 'HT', 'TH', 'TT'])).toBe(
      true,
    );
    expect(checkOutcomeSet('R2-R1,R1-R2', ['R1-R2', 'R2-R1'])).toBe(true);
    expect(checkOutcomeSet('HH,HT,TT', ['HH', 'HT', 'TH', 'TT'])).toBe(false);
    expect(checkOutcomeSet('HH,HT,TH,TT,HT', ['HH', 'HT', 'TH', 'TT'])).toBe(
      false,
    );
    for (const raw of [
      'HH,,TT',
      '{HH,TT',
      'HH,TT}',
      'HH;',
      '(H,H),(T,T)',
      'HH=1/4',
      'alert(1)',
      'HH/TT',
      'HH%',
      'HH,'.repeat(400),
    ])
      expect(readOutcomeSet(raw), raw).toBeNull();
    expect(checkOutcomeSet('{}', ['HH'])).toBe(false);
    expect(checkOutcomeSet('HH', ['HH', 'HH'])).toBe(false);
  });
  it('samples 700 reproducible distinct-ID subsets from the full frame without altering the population', () => {
    expect(fictionalPopulation).toHaveLength(24);
    expect(new Set(fictionalPopulation.map((p) => p.id)).size).toBe(24);
    expect(fictionalPopulation.reduce((s, p) => s + p.value, 0)).toBe(192);
    const snapshot = JSON.stringify(fictionalPopulation);
    for (let size = 2; size <= 8; size++)
      for (let seed = 0; seed < 100; seed++) {
        const m = sampleRecords(size, 'random', seed);
        expect(m.sample).toHaveLength(size);
        expect(new Set(m.sample.map((p) => p.id)).size).toBe(size);
        expect(m.frameSize).toBe(24);
        expect(m.summary.mean[0] * BigInt(size)).toBe(
          BigInt(m.sample.reduce((s, p) => s + p.value, 0)) * m.summary.mean[1],
        );
        expect(
          m.sample.every((p) => fictionalPopulation.some((q) => q.id === p.id)),
        ).toBe(true);
        expect(sampleRecords(size, 'random', seed).sample).toEqual(m.sample);
      }
    expect(JSON.stringify(fictionalPopulation)).toBe(snapshot);
    for (let size = 2; size <= 8; size++) {
      const m = sampleRecords(size, 'nearby', 1);
      expect(m.frameSize).toBe(8);
      expect(m.sample.every((p) => p.group === 'A')).toBe(true);
    }
  });
  it('includes an independently reproduced counterexample where this random sample is farther than the convenience sample', () => {
    const random = sampleRecords(2, 'random', 17),
      nearby = sampleRecords(2, 'nearby', 17);
    expect(random.sample.map((p) => p.id)).toEqual(['C8', 'C2']);
    expect(random.sample.map((p) => p.value)).toEqual([12, 14]);
    expect(random.summary.mean).toEqual([13n, 1n]);
    expect(nearby.summary.mean).toEqual([4n, 1n]);
    expect(random.population.mean).toEqual([8n, 1n]);
    expect(13 - 8).toBeGreaterThan(8 - 4);
  });
  it('distinguishes equal centres from spread and shape, retaining duplicates and inclusive interval boundaries', () => {
    const pair = distributionPairs[0]!,
      a = distribution(pair.a),
      b = distribution(pair.b);
    expect(a.mean).toEqual([3n, 1n]);
    expect(b.mean).toEqual(a.mean);
    expect(b.median).toEqual(a.median);
    expect(a.range).toBe(0);
    expect(b.range).toBe(6);
    expect(a.count).toBe(6);
    expect(intervalCount([2, 3, 3, 4, 5], 2, 4)).toBe(4);
    const shift = distributionPairs[1]!;
    expect(shift.b.map((n, i) => n - shift.a[i]!)).toEqual([3, 3, 3, 3, 3, 3]);
    expect(distribution(shift.a).range).toBe(distribution(shift.b).range);
  });
  it('independently recalculates every replacement value from zero to sixty, including changed median and fixed count', () => {
    for (let n = 0; n <= 60; n++) {
      const m = changedRecord(n),
        sorted = [4, 5, 6, 7, n].sort((a, b) => a - b);
      expect(m.after.count).toBe(5);
      expect(m.after.mean[0] * 5n).toBe(BigInt(22 + n) * m.after.mean[1]);
      expect(m.after.median).toEqual([BigInt(sorted[2]!), 1n]);
      expect(m.meanChange[0] * 5n).toBe(BigInt(n - 8) * m.meanChange[1]);
      expect(m.changed[4]).toBe(n);
      expect(m.original).toEqual([4, 5, 6, 7, 8]);
    }
    expect(changedRecord(50).after.mean).toEqual([72n, 5n]);
    expect(changedRecord(0).after.median).toEqual([5n, 1n]);
  });
  it('enumerates complete equal-outcome spaces and exposes unequal aggregated dice-sum counts', () => {
    expect(sampleSpace('coins').outcomes.map((o) => o.id)).toEqual([
      'HH',
      'HT',
      'TH',
      'TT',
    ]);
    expect(sampleSpace('coin-spinner').total).toBe(6);
    expect(sampleSpace('coin-spinner').probability).toEqual([1n, 6n]);
    const dice = sampleSpace('dice');
    expect(dice.total).toBe(36);
    expect(new Set(dice.outcomes.map((o) => o.id)).size).toBe(36);
    expect(dice.probability).toEqual([1n, 6n]);
    const sums = Array.from(
      { length: 11 },
      (_, i) =>
        dice.outcomes.filter((o) => Number(o.a) + Number(o.b) === i + 2).length,
    );
    expect(sums).toEqual([1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
  });
  it('verifies all 66 replacement trees by independent labelled-pair enumeration, conditional counts and exact event sums', () => {
    let cases = 0;
    for (let r = 0; r <= 5; r++)
      for (let b = 0; b <= 5; b++) {
        const total = r + b;
        if (total < 2) continue;
        for (const replace of [false, true]) {
          cases++;
          const m = drawTree(r, b, replace),
            tokens = [
              ...Array.from({ length: r }, (_, i) => `R${i + 1}`),
              ...Array.from({ length: b }, (_, i) => `B${i + 1}`),
            ],
            pairs = tokens.flatMap((a) =>
              tokens.filter((c) => replace || a !== c).map((c) => [a, c]),
            );
          expect(m.labelledTotal).toBe(total * (replace ? total : total - 1));
          expect(m.labelled.map((p) => p.id).sort()).toEqual(
            pairs.map((p) => p.join('-')).sort(),
          );
          expect(m.totalProbability).toEqual([1n, 1n]);
          for (const leaf of m.leaves) {
            const hits = pairs.filter(
              (p) => p[0]![0] === leaf.first && p[1]![0] === leaf.second,
            ).length;
            expect(leaf.probability[0] * BigInt(pairs.length)).toBe(
              BigInt(hits) * leaf.probability[1],
            );
            expect(leaf.secondTotal).toBe(replace ? total : total - 1);
            expect(leaf.secondCount).toBe(
              (leaf.second === 'R' ? r : b) -
                (!replace && leaf.first === leaf.second ? 1 : 0),
            );
            expect(leaf.possible).toBe(hits > 0);
          }
          for (const event of [
            'two-red',
            'different',
            'at-least-blue',
          ] as const) {
            const out = treeEvent(m, event),
              hits = pairs.filter((p) =>
                event === 'two-red'
                  ? p.every((s) => s[0] === 'R')
                  : event === 'different'
                    ? p[0]![0] !== p[1]![0]
                    : p.some((s) => s[0] === 'B'),
              ).length;
            expect(out.labelledHits).toBe(hits);
            expect(out.probability[0] * BigInt(pairs.length)).toBe(
              BigInt(hits) * out.probability[1],
            );
          }
        }
      }
    expect(cases).toBe(66);
    const m = drawTree(2, 1, false);
    expect(m.possible).toEqual(['RR', 'RB', 'BR']);
    expect(m.leaves.find((l) => l.code === 'BB')!.probability).toEqual([
      0n,
      1n,
    ]);
    expect(drawTree(2, 1, true).leaves.map((l) => l.probability)).toEqual([
      [4n, 9n],
      [2n, 9n],
      [2n, 9n],
      [1n, 9n],
    ]);
  });
  it('independently checks all 400 retrieval answers and their explicit accepted/rejected evidence', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const id = `J76-L0${i + 1}`,
          q = j76ReviewQuestion(id, k),
          a = 2 + (k % 7),
          b = 1 + (Math.floor(k / 7) % 6),
          c = 1 + (k % 5),
          n = 2 + (k % 3),
          expected =
            i === 0
              ? `1/${3 + Math.floor(k / 7)}`
              : i === 1
                ? String(2 * b)
                : i === 2
                  ? `${5 * a + 6 + 10 * b}/5`
                  : i === 3
                    ? ['H', 'T']
                        .flatMap((f) =>
                          Array.from({ length: n }, (_, j) => `${f}${j + 1}`),
                        )
                        .reverse()
                        .join(',')
                    : `${a * (a - 1)}/${(a + c) * (a + c - 1)}`;
        expect(checkAnswer(expected, q.answer), `${id}/${k}`).toBe(true);
        for (const v of q.answerChecks!.accepted)
          expect(checkAnswer(v, q.answer)).toBe(true);
        for (const v of q.answerChecks!.rejected)
          expect(checkAnswer(v, q.answer), `${id}/${k} rejects ${v}`).toBe(
            false,
          );
        if (q.answer.kind === 'number')
          expect(exactRational(q.answer.value)).not.toBeNull();
        expect(j76ReviewQuestion(id, k + 80).answer).toEqual(q.answer);
      }
  });
  it('rejects unsupported counts, invalid observations and out-of-contract retrievals', () => {
    for (const n of [0, 1, 9, NaN, 2.5])
      expect(() => sampleRecords(n, 'random', 1)).toThrow();
    expect(() => sampleRecords(6, 'random', -1)).toThrow();
    for (const n of [-1, 61, Infinity, 1.5])
      expect(() => changedRecord(n)).toThrow();
    for (const pair of [
      [0, 0],
      [1, 0],
      [-1, 2],
      [6, 2],
      [2.5, 1],
    ])
      expect(() => drawTree(pair[0]!, pair[1]!, false)).toThrow();
    expect(() => distribution([])).toThrow();
    expect(() => intervalCount([1], 2, 1)).toThrow();
    for (const id of ['J76-L00', 'J76-L06', 'J75-L01'])
      expect(() => j76ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j76ReviewQuestion('J76-L01', n)).toThrow();
  });
});
