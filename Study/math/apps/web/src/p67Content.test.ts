import { describe, it, expect } from 'vitest';
import {
  p67Lessons,
  p67CheckQuestions,
  p67ReviewQuestion,
} from './content/P67';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import { parseNumberSet, checkNumberSet } from './numberSetAnswers';
import {
  orderedSummary,
  spinnerModel,
  eventChance,
  spinnerAt,
  bagChance,
  nextUniform,
  runSpinnerTrials,
  frequencySummary,
  fractionText,
} from './chanceModels';
const markdown = import.meta.glob('../../../content/lessons/P67-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p67Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p67CheckQuestions,
];
const value = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
describe('P67 authored statistics and chance', () => {
  it('opens all five planned bilingual titles, examples and valid backwards prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P67')!;
    expect(p67Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.P67.questions).toHaveLength(8);
    expect(new Set(p67Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p67Lessons) {
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        if (p.unit === 'P67') expect(p.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(all).toHaveLength(358);
    expect(
      all
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p67Lessons[4]!.familyChallenge!.en).toContain(
      'label them simulated',
    );
  });
  it('validates 48 unique items, bilingual evidence, two hints and manual review rubrics', () => {
    expect(items).toHaveLength(48);
    expect(new Set(items.map((q) => q.id)).size).toBe(48);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(31);
    expect(items.filter((q) => q.answer.kind === 'number-set')).toHaveLength(5);
    expect(items.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
    for (const q of items) {
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
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(140);
      } else {
        expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      for (const o of q.options ?? []) {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      }
    }
  });
  it('independently transcribes each quantitative answer and distinguishes proportions from counts', () => {
    const answers = [
      ['3', '5', '2,1', '无众数', '0', '5'],
      ['8', '3', '3', '5/3', '3', '3'],
      ['50%', '1/3', '0', '1', '25%', '1/2'],
      ['1/2', '75%', '0', '100%', '1/3', '2/3'],
      ['60%', '0', '1/2', '65%', '34%', '57.5%'],
    ];
    p67Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(answers[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    ['4', '4、2', '25%', '2/3', '35%', '2', '3'].forEach((s, i) =>
      expect(checkAnswer(s, p67CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('3', p67Lessons[3]!.guided.answer)).toBe(false);
    expect(checkAnswer('0.33', p67Lessons[3]!.questions[4]!.answer)).toBe(
      false,
    );
    expect(checkAnswer('1/2', p67Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('1.67', p67Lessons[1]!.questions[3]!.answer)).toBe(
      false,
    );
  });
  it('requires all modes without duplicates and separates none, zero and exact equivalent numeric entries', () => {
    for (const s of ['2,1', '1、2', '2；1', '1.0,4/2'])
      expect(checkNumberSet(s, ['1', '2']), s).toBe(true);
    for (const s of [
      '1',
      '2',
      '1,1,2',
      '1,2,3',
      '1,2,',
      '1 2',
      '1+1,1',
      '1 cm,2',
      '100%,2',
      '',
    ])
      expect(checkNumberSet(s, ['1', '2']), s).toBe(false);
    for (const s of [
      'no mode',
      'NO MODES',
      'none',
      '无众数',
      '没有众数',
      '∅',
      '{}',
    ]) {
      expect(checkNumberSet(s, [])).toBe(true);
      expect(checkNumberSet(s, ['0'])).toBe(false);
    }
    expect(checkNumberSet('0', [])).toBe(false);
    expect(checkNumberSet('－0', ['0'])).toBe(true);
    expect(checkNumberSet('−2,1/2', ['0.5', '-2'])).toBe(true);
    expect(checkNumberSet('0,-0', ['0'])).toBe(false);
    expect(parseNumberSet('1,'.repeat(100))).toBeNull();
    expect(checkNumberSet('1', ['1', '1'])).toBe(false);
  });
  it('checks medians, modes and means independently over every short four-valued data sequence', () => {
    // A frequency histogram supplies ranks independently of sorting the observations.
    for (let count = 1; count <= 6; count++)
      for (let code = 0; code < 4 ** count; code++) {
        let remaining = code;
        const values = Array.from({ length: count }, () => {
            const v = remaining % 4;
            remaining = Math.floor(remaining / 4);
            return v;
          }),
          before = [...values],
          m = orderedSummary(values),
          hist = [0, 1, 2, 3].map((v) => values.filter((x) => x === v).length),
          rank = (position: number) => {
            let cumulative = 0;
            for (let v = 0; v < 4; v++) {
              cumulative += hist[v]!;
              if (cumulative > position) return v;
            }
            throw new Error('rank');
          };
        const lo = rank(Math.floor((count - 1) / 2)),
          hi = rank(Math.floor(count / 2));
        expect(Number(m.median[0]) / Number(m.median[1])).toBe((lo + hi) / 2);
        expect(m.mean[0] * BigInt(count)).toBe(
          BigInt(values.reduce((a, b) => a + b, 0)) * m.mean[1],
        );
        const max = Math.max(...hist);
        expect(m.modes).toEqual(
          max < 2 ? [] : [0, 1, 2, 3].filter((v) => hist[v] === max),
        );
        expect(values).toEqual(before);
        expect(m.sorted.map((row) => row.id).sort((a, b) => a - b)).toEqual(
          Array.from({ length: count }, (_, i) => i),
        );
      }
    expect(fractionText(orderedSummary([-4, -2, 0, 0]).median)).toBe('-1');
    expect(fractionText(orderedSummary([1, 2, 2]).mean)).toBe('5/3');
    expect(orderedSummary([0, 0, 0]).modes).toEqual([0]);
  });
  it('enumerates bag event objects independently, including impossible and certain events', () => {
    for (let a = 0; a <= 5; a++)
      for (let b = 0; b <= 5; b++)
        for (let c = 0; c <= 5; c++)
          if (a + b + c) {
            const labels = [
              ...Array(a).fill(0),
              ...Array(b).fill(1),
              ...Array(c).fill(2),
            ];
            for (let mask = 0; mask < 8; mask++) {
              const selected = [0, 1, 2].filter((i) => mask & (1 << i)),
                m = bagChance([a, b, c], selected),
                hits = labels.filter((v) => selected.includes(v)).length;
              expect(m.total).toBe(labels.length);
              expect(m.favourable).toBe(hits);
              expect(m.probability[0] * BigInt(labels.length)).toBe(
                BigInt(hits) * m.probability[1],
              );
              expect(new Set(m.tokens.map((t) => t.id)).size).toBe(
                labels.length,
              );
            }
          }
  });
  it('matches spinner geometry and event probabilities by independently sampling equal angular strata', () => {
    for (const [labels, weights] of [
      [
        ['A', 'B', 'C'],
        [2, 1, 1],
      ],
      [
        ['A', 'B', 'C'],
        [1, 1, 1],
      ],
      [
        ['A', 'A', 'B', 'C'],
        [1, 1, 1, 1],
      ],
      [['A'], [1]],
    ] as [string[], number[]][]) {
      const m = spinnerModel(labels, weights),
        sampleCount = m.total * 200,
        observed: Record<string, number> = {};
      for (let i = 0; i < sampleCount; i++) {
        const outcome = spinnerAt(m, (i + 0.5) / sampleCount).label;
        observed[outcome] = (observed[outcome] ?? 0) + 1;
      }
      expect(m.sectors[0]!.start).toBe(0);
      expect(m.sectors.at(-1)!.end).toBe(1);
      for (const s of m.sectors) {
        expect(s.end - s.start).toBeCloseTo(
          weights[s.id]! / weights.reduce((a, b) => a + b, 0),
          12,
        );
        expect(spinnerAt(m, s.start).id).toBe(s.id);
      }
      for (const label of m.labels) {
        const p = eventChance(m, [label]);
        expect(Number(p.probability[0]) / Number(p.probability[1])).toBe(
          observed[label]! / sampleCount,
        );
      }
      expect(m.equalLabels).toBe(new Set(Object.values(observed)).size === 1);
      expect(eventChance(m, ['D']).kind).toBe('impossible');
      expect(eventChance(m, m.labels).kind).toBe('certain');
    }
    const repeated = spinnerModel(['A', 'A', 'B', 'C'], [1, 1, 1, 1]);
    expect(repeated.equalSectors).toBe(true);
    expect(repeated.equalLabels).toBe(false);
    expect(fractionText(eventChance(repeated, ['A']).probability)).toBe('1/2');
  });
  it('replays a pseudorandom sequence and preserves it across batching without enforcing target frequencies', () => {
    const first = nextUniform(1);
    expect(first.state).toBe(1015568748);
    expect(nextUniform(first.state).state).toBe(1586005467);
    const m = spinnerModel(['A', 'B', 'C'], [2, 1, 1]),
      all = runSpinnerTrials(m, 7, 100),
      a = runSpinnerTrials(m, 7, 10),
      b = runSpinnerTrials(m, a.state, 90);
    expect([...a.outcomes, ...b.outcomes]).toEqual(all.outcomes);
    expect(b.state).toBe(all.state);
    expect(runSpinnerTrials(m, 7, 100)).toEqual(all);
    expect(runSpinnerTrials(m, 8, 100).outcomes.map((v) => v.u)).not.toEqual(
      all.outcomes.map((v) => v.u),
    );
    expect(a.outcomes.map((v) => v.label)).toEqual([
      'A',
      'C',
      'B',
      'C',
      'A',
      'C',
      'A',
      'A',
      'A',
      'C',
    ]);
    expect(a.outcomes.filter((v) => v.label === 'B')).toHaveLength(1);
    const sequence = runSpinnerTrials(m, 7, 1000);
    expect(sequence.outcomes).toHaveLength(1000);
    for (const v of sequence.outcomes) {
      expect(v.u).toBeGreaterThan(0);
      expect(v.u).toBeLessThan(1);
      expect(m.sectors[v.sector]!.label).toBe(v.label);
    }
  });
  it('leaves zero-trial frequency undefined and demonstrates that another observation can move farther from theory', () => {
    expect(frequencySummary([], ['A']).frequency).toBeNull();
    expect(frequencySummary(['B', 'B'], ['A']).frequency).toEqual([0n, 1n]);
    const data = ['A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'],
      m = frequencySummary(data, ['A']);
    expect(fractionText(m.frequency!)).toBe('3/5');
    const farther = frequencySummary([...data, 'A'], ['A']),
      closer = frequencySummary([...data, 'B'], ['A']);
    expect(Math.abs(farther.trace.at(-1)!.value - 0.5)).toBeGreaterThan(0.1);
    expect(Math.abs(closer.trace.at(-1)!.value - 0.5)).toBeLessThan(0.1);
    m.trace.forEach((p, i) => {
      expect(p.trials).toBe(i + 1);
      expect(p.hits).toBe(data.slice(0, i + 1).filter((v) => v === 'A').length);
      expect(p.value).toBe(p.hits / p.trials);
    });
    expect(frequencySummary(data, ['B']).trials).toBe(m.trials);
    expect(frequencySummary(data, ['B']).hits + m.hits).toBe(data.length);
  });
  it('independently checks 400 retrieval answers including alternating median and complete mode sets', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = p67ReviewQuestion(p67Lessons[i]!.id, k),
          a = k % 10,
          b = 1 + (Math.floor(k / 10) % 5);
        if (i === 0 && k % 2 === 1) {
          expect(q.answer.kind).toBe('number-set');
          expect(checkAnswer(`${a + 1},${a}`, q.answer)).toBe(true);
          expect(checkAnswer(String(a), q.answer)).toBe(false);
        } else if (q.answer.kind === 'number') {
          let expected: number;
          if (i === 0) expected = a + 4;
          else if (i === 1) expected = (5 * a + 16) / 5;
          else if (i === 2) expected = b / (b + 2);
          else if (i === 3) expected = (a + 1) / (a + b + 1);
          else {
            const total = 10 + k;
            expected = ((k * 7 + 3) % (total + 1)) / total;
          }
          expect(value(q.answer.value), q.id).toBeCloseTo(expected, 12);
        } else throw new Error(q.id);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
    for (const k of [-1, 0.5, 100001, NaN])
      expect(() => p67ReviewQuestion('P67-L01', k)).toThrow();
    expect(() => p67ReviewQuestion('P67-L09', 0)).toThrow();
  });
  it('rejects undefined models, malformed sets, invalid angular samples and invalid simulation state', () => {
    for (const values of [[], Array(31).fill(1), [1.5], [NaN], [1001]])
      expect(() => orderedSummary(values)).toThrow();
    for (const counts of [
      [0, 0, 0],
      [-1, 2, 3],
      [1.5, 2, 3],
      [11, 0, 0],
    ])
      expect(() => bagChance(counts, [0])).toThrow();
    expect(() => bagChance([1, 2, 3], [0, 0])).toThrow();
    expect(() => bagChance([1, 2, 3], [3])).toThrow();
    expect(() => spinnerModel([], [])).toThrow();
    expect(() => spinnerModel(['A'], [0])).toThrow();
    expect(() => spinnerModel(['A'], [1, 2])).toThrow();
    const m = spinnerModel(['A', 'B'], [1, 1]);
    for (const u of [-0.1, 1, NaN]) expect(() => spinnerAt(m, u)).toThrow();
    expect(() => eventChance(m, ['A', 'A'])).toThrow();
    for (const n of [-1, 1.5, 4294967296])
      expect(() => nextUniform(n)).toThrow();
    expect(() => runSpinnerTrials(m, 1, 0)).toThrow();
    expect(() => runSpinnerTrials(m, 1, 1001)).toThrow();
    expect(() => frequencySummary(Array(1001).fill('A'), ['A'])).toThrow();
  });
});
