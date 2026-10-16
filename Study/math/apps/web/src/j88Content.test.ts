import { describe, it, expect } from 'vitest';
import {
  j88Lessons,
  j88CheckQuestions,
  j88ReviewQuestion,
} from './content/J88';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { textR } from './algebraModels';
import {
  fiveNumber,
  quartileCases,
  spreadGroups,
  pairedCases,
  pairedData,
  weatherRecords,
  checkAssociation,
  investigationRecords,
  investigationSummary,
  investigationGate,
  investigationReport,
  translateData,
  type QuartileConvention,
} from './researchModels';
const markdown = import.meta.glob('../../../content/lessons/J88-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j88Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j88CheckQuestions,
];
const value = (s: string) => {
  const [a, b] = s.split('/').map(Number);
  return a! / (b ?? 1);
};
const med = (a: number[]) =>
  a.length % 2
    ? a[(a.length - 1) / 2]!
    : (a[a.length / 2 - 1]! + a[a.length / 2]!) / 2;
function independent(raw: string[], include: boolean) {
  const a = raw.map(value).sort((a, b) => a - b),
    h = Math.floor(a.length / 2),
    odd = a.length % 2,
    lower = a.slice(0, h + (include ? odd : 0)),
    upper = a.slice(a.length - h - (include ? odd : 0)),
    q1 = med(lower),
    q3 = med(upper);
  return [a[0]!, q1, med(a), q3, a.at(-1)!, a.at(-1)! - a[0]!, q3 - q1];
}
const actual = (raw: string[], convention: QuartileConvention) => {
  const s = fiveNumber(raw, convention);
  return [s.min, s.q1, s.median, s.q3, s.max, s.range, s.iqr].map(
    (r) => Number(r[0]) / Number(r[1]),
  );
};
describe('J88 source-aware statistical enquiry and exact summaries', () => {
  it('registers all five planned bilingual lessons and earlier bridges with complete examples', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      units
        .find((u) => u.id === 'J88')!
        .lessons.map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j88Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J88.questions).toHaveLength(8);
    for (const l of j88Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.find((v) => v.id === id)).toBeTruthy();
        expect(lessons.findIndex((v) => v.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j88ReviewQuestion(l.id, 0));
    }
  });
  it('checks 48 complete bilingual items while leaving fourteen explanations to human review', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      number: 18,
      coordinate: 2,
      association: 5,
      'proof-verdict': 3,
      choice: 6,
      explain: 14,
    }))
      expect(
        all.filter((q) => q.answer.kind === kind),
        kind,
      ).toHaveLength(count);
    for (const q of all) {
      expect(q.stem.zh.length).toBeGreaterThan(5);
      expect(q.stem.en.length).toBeGreaterThan(10);
      expect(q.hints).toHaveLength(2);
      expect(q.solution.zh.length).toBeGreaterThan(10);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('PPDAC median cause source', q.answer)).toBeNull();
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(false);
    }
  });
  it('independently records every nonhuman generated answer and each choice', () => {
    const values = [
      ['3', '15/2', '9/2', '9/2', '-5/4', '3/2'],
      ['3/2', '7', '2', '26', '3/2', '2'],
      ['positive', '(3,2)', 'negative', 'no-clear-linear', 'curved', '5'],
      [null, 'insufficient', 'insufficient', null, null, null],
      [null, '1', '5', '9/2', null, null],
    ];
    for (const [i, l] of j88Lessons.entries()) {
      for (const [j, q] of [
        l.guided,
        ...l.questions.slice(1, 5),
        l.exit,
      ].entries()) {
        const v = values[i]![j];
        if (v === null) expect(q.answer.kind).toBe('explain');
        else expect(checkAnswer(v!, q.answer), q.id).toBe(true);
      }
      expect(
        checkAnswer(String([1, 0, 2, 1, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    }
    for (const [i, raw] of [
      '6',
      '17',
      '(4,7)',
      'curved',
      'insufficient',
    ].entries())
      expect(checkAnswer(raw, j88CheckQuestions[i]!.answer)).toBe(true);
    expect(checkAnswer('1', j88CheckQuestions[6]!.answer)).toBe(true);
  });
  it('independently checks 6,552 halves calculations with ties, signed values and both conventions', () => {
    let cases = 0;
    for (let n = 2; n <= 7; n++)
      for (let code = 0; code < 3 ** n; code++) {
        let k = code;
        const raw = Array.from({ length: n }, () => {
          const v = [-2, 0, 3][k % 3]!;
          k = Math.floor(k / 3);
          return String(v);
        });
        for (const c of ['exclude', 'include'] as const) {
          expect(actual(raw, c)).toEqual(independent(raw, c === 'include'));
          cases++;
        }
      }
    expect(cases).toBe(6552);
    expect(actual(['1', '2', '3', '4', '5'], 'exclude')[1]).toBe(1.5);
    expect(actual(['1', '2', '3', '4', '5'], 'include')[1]).toBe(2);
  });
  it('preserves source order and exact fractions and separates common shifts/scales from spread', () => {
    expect(actual(quartileCases[0]!, 'exclude')).toEqual([
      1, 3, 5, 7.5, 9, 8, 4.5,
    ]);
    expect(actual(quartileCases[1]!, 'exclude')).toEqual([
      1, 3, 4.5, 6.5, 8, 7, 3.5,
    ]);
    expect(actual(quartileCases[3]!, 'exclude')).toEqual([
      -2, -1.25, 0, 1.25, 2, 4, 2.5,
    ]);
    expect(textR(fiveNumber(['1/3', '2/3', '1', '4/3', '5/3']).q1)).toBe('1/2');
    const raw = ['9', '2', '4', '4', '5', '7', '8', '1', '6'],
      copy = [...raw];
    fiveNumber(raw);
    expect(raw).toEqual(copy);
    for (let shift = -5; shift <= 5; shift++)
      for (let scale = 1; scale <= 5; scale++) {
        const v = translateData(
            raw.map((x) => String(Number(x) * scale)),
            shift,
          ),
          a = actual(v, 'exclude'),
          base = actual(raw, 'exclude');
        expect(a.slice(0, 5)).toEqual(
          base.slice(0, 5).map((x) => x * scale + shift),
        );
        expect(a.slice(5)).toEqual(base.slice(5).map((x) => x * scale));
      }
  });
  it('demonstrates conflicting range and IQR comparisons without deleting the tail', () => {
    for (const extreme of [false, true]) {
      const [a, b] = spreadGroups(extreme).map((g) => fiveNumber(g.values));
      expect(textR(a!.median)).toBe('5');
      expect(textR(b!.median)).toBe('5');
      expect(textR(a!.range)).toBe(extreme ? '26' : '2');
      expect(textR(a!.iqr)).toBe('3/2');
      expect(textR(b!.range)).toBe('10');
      expect(textR(b!.iqr)).toBe('7');
      expect(a!.n).toBe(9);
    }
    expect(textR(fiveNumber(['4', '5', '5', '5', '30']).q3)).toBe('35/2');
  });
  it('retains paired identities and missing records and verifies the constructed directions independently', () => {
    for (const c of pairedCases) {
      const before = structuredClone(c.records),
        m = pairedData(c.records);
      expect(m.total).toBe(c.records.length);
      expect(m.complete.length + m.missing).toBe(m.total);
      expect(c.records).toEqual(before);
      for (const p of m.complete) {
        const row = c.records.find((r) => r.id === p.id)!;
        expect(p.px).toBe(Number(row.x));
        expect(p.py).toBe(Number(row.y));
      }
      const meanX =
          m.complete.reduce((s, p) => s + p.px, 0) / m.complete.length,
        meanY = m.complete.reduce((s, p) => s + p.py, 0) / m.complete.length,
        cov = m.complete.reduce(
          (s, p) => s + (p.px - meanX) * (p.py - meanY),
          0,
        );
      if (c.pattern === 'positive') expect(cov).toBeGreaterThan(0);
      else if (c.pattern === 'negative') expect(cov).toBeLessThan(0);
      else expect(cov).toBe(0);
      if (c.pattern === 'curved')
        for (const p of m.complete) expect(p.py).toBe((p.px - 4) ** 2);
    }
    expect(pairedData(pairedCases[0]!.records).missing).toBe(1);
  });
  it('verifies the pooled-versus-within-group causal counterexample without pretending to prove its story', () => {
    for (const group of ['all', 'cool', 'warm']) {
      const rows = weatherRecords.filter(
          (r) => group === 'all' || r.group === group,
        ),
        m = pairedData(rows),
        n = m.complete.length,
        sx = m.complete.reduce((s, r) => s + r.px, 0),
        sy = m.complete.reduce((s, r) => s + r.py, 0),
        sxy = m.complete.reduce((s, r) => s + r.px * r.py, 0),
        numerator = n * sxy - sx * sy;
      expect(numerator).toBe(group === 'all' ? 576 : 0);
    }
    expect(j88Lessons[3]!.guided.answer.kind).toBe('explain');
    expect(j88Lessons[3]!.exit.answer.kind).toBe('explain');
  });
  it('retains 12 records, corrects A6 only against its source and calculates observed group summaries', () => {
    const old = investigationRecords(false),
      next = investigationRecords(true);
    expect(old).toHaveLength(12);
    expect(next).toHaveLength(12);
    expect(next.filter((r) => r.value === null).map((r) => r.id)).toEqual([
      'A5',
    ]);
    expect(
      old.filter((r, i) => r.value !== next[i]!.value).map((r) => r.id),
    ).toEqual(['A6']);
    expect(old.find((r) => r.id === 'A6')!.value).toBe('27');
    expect(next.find((r) => r.id === 'A6')!.value).toBe('7');
    const [a, b] = investigationSummary(true).groups;
    expect([a!.summary.n, b!.summary.n]).toEqual([5, 6]);
    expect(actual(a!.values, 'exclude')).toEqual([4, 4.5, 5, 6.5, 7, 3, 2]);
    expect(actual(b!.values, 'exclude')).toEqual([3, 4, 4.5, 5, 6, 3, 1]);
  });
  it('requires every PPDAC gate and exports raw evidence and unreviewed original writing', () => {
    for (let bits = 0; bits < 16; bits++) {
      const s = {
        scope: bits & 1 ? ('records' as const) : ('all' as const),
        missing: bits & 2 ? ('retain' as const) : ('zero' as const),
        corrected: !!(bits & 4),
        medianChecked: !!(bits & 8),
      };
      for (let i = 0; i < 4; i++)
        expect(investigationGate(i, s)).toBe(!!(bits & (1 << i)));
      expect(investigationGate(4, s)).toBe(false);
    }
    const text = investigationReport(
      'My words: A median five exceeds B 4.5, with missingness and desk confounding.',
      true,
    );
    expect(text).toContain('A5\tA\tmissing');
    expect(text).toContain('A6\tA\t7');
    expect(text).toContain('27→7');
    expect(text).toContain('n=5');
    expect(text).toContain('n=6');
    expect(text).toContain('not automatically reviewed');
    expect(text).toContain('My words:');
    expect(() => investigationReport('draft', false)).toThrow();
    expect(() => investigationReport('  ', true)).toThrow();
  });
  it('independently checks 400 retrieval items with 100 explanations left human-reviewed', () => {
    let human = 0;
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = j88ReviewQuestion(`J88-L0${i + 1}`, k),
          o = (k % 7) - 3,
          s = (k % 5) + 1;
        if (i === 3 || (i === 4 && k % 4 === 0)) {
          human++;
          expect(q.answer.kind).toBe('explain');
          expect(checkAnswer('cause', q.answer)).toBeNull();
          continue;
        }
        const expected =
          i === 0
            ? String((k % 2 ? 6 : 2) + o)
            : i === 1
              ? String((k % 2 ? 3 : 4) * s)
              : i === 2
                ? ['positive', 'negative', 'no-clear-linear', 'curved'][k % 4]!
                : String((k % 2 ? 4.5 : 5) + o);
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.accepted)
          expect(checkAnswer(raw, q.answer)).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer)).toBe(false);
      }
    expect(human).toBe(100);
  });
  it('rejects bad data, unknown association descriptions and invalid review bounds', () => {
    for (const raw of [
      [],
      ['1'],
      Array(41).fill('1'),
      ['a', '2'],
      ['1001', '2'],
    ])
      expect(() => fiveNumber(raw)).toThrow();
    expect(() =>
      pairedData([
        { id: 'a', x: '1', y: '2' },
        { id: 'a', x: '2', y: '3' },
      ]),
    ).toThrow();
    expect(() => pairedData([{ id: 'a', x: 'x', y: null }])).toThrow();
    expect(checkAssociation('no relationship', 'no-clear-linear')).toBe(false);
    expect(checkAssociation('caused by', 'positive')).toBe(false);
    expect(checkAssociation(' 正相关 ', 'positive')).toBe(true);
    expect(
      checkAssociation('NO CLEAR LINEAR ASSOCIATION', 'no-clear-linear'),
    ).toBe(true);
    for (const [id, k] of [
      ['J88-L00', 0],
      ['J87-L01', 0],
      ['J88-L01', -1],
      ['J88-L01', 0.5],
      ['J88-L01', 100001],
    ] as const)
      expect(() => j88ReviewQuestion(id, k)).toThrow();
  });
});
