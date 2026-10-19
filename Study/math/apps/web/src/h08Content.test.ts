import { describe, it, expect } from 'vitest';
import {
  h08Lessons,
  h08CheckQuestions,
  h08ReviewQuestion,
} from './content/H08';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { textR, sameR } from './algebraModels';
import { readRational } from './rationalModels';
import {
  dataValue,
  dataNumber,
  dataSummary,
  transformData,
  cleaningAudit,
  cleaningRows,
  histogram,
  shapeCases,
  zScore,
  candidateFit,
  leastSquares,
  regressionPrediction,
  regressionCases,
  predictionScope,
  checkDataCode,
} from './dataModellingModels';
const bodies = import.meta.glob('../../../content/lessons/H08-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h08Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h08CheckQuestions,
];
describe('H08 data modelling and independent mathematical audits', () => {
  it('publishes five complete bilingual lessons with earlier prerequisites after verification', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(272);
    expect(openUnits.length).toBeGreaterThanOrEqual(51);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H08-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h08Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H08.questions).toEqual(h08CheckQuestions);
    for (const l of h08Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBe(20);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n, id).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h08ReviewQuestion(l.id, 0));
    }
  });
  it('audits 48 independent authored anchors and keeps 12 explanations human-reviewed', () => {
    const anchors = [
      ['20', 'discrete', '6', '4', '21'],
      ['3', 'right-skew', '1', '11', 'symmetric'],
      ['sqrt(2)', '8', '8/3', 'sqrt(2)', 'undefined'],
      ['2', '1', '-1', '2', 'undefined'],
      ['3/2', '1', '4', '-1', '5'],
    ];
    h08Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 0, 2, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    const unit = ['discrete', 'right-skew', 'sqrt(2)', '2', '4', '2'];
    unit.forEach((v, i) =>
      expect(checkAnswer(v, h08CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('mean sd residual', q.answer)).toBeNull();
        continue;
      }
      expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer)).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
    }
    expect(checkAnswer('1.414', h08Lessons[2]!.guided.answer)).toBe(false);
    expect(checkAnswer('sqrt(8)/2', h08Lessons[2]!.guided.answer)).toBe(true);
  });
  it('retains original identities and field decisions through source-confirmed correction', () => {
    for (const corrected of [false, true]) {
      const a = cleaningAudit(corrected);
      expect([a.unique, a.duplicate, a.missing, a.invalid]).toEqual([
        6, 1, 1, 1,
      ]);
      expect(a.values).toEqual(
        corrected ? ['20', '20', '20', '24'] : ['20', '20', '200', '24'],
      );
      expect(textR(a.summary.mean)).toBe(corrected ? '21' : '66');
      expect(a.rows[1]!.count).toBe('0');
      expect(textR(a.rows[1]!.cm!)).toBe('20');
      expect(a.rows[3]!.count).toBe('1');
      expect(a.rows[4]!.length).toBe('200');
      expect(a.rows[4]!.source).toBe('20');
      expect(a.rows[6]!.duplicate).toBe(true);
    }
    expect(cleaningRows[4]!.length).toBe('200');
    expect(checkDataCode('连续', 'continuous')).toBe(true);
    expect(checkDataCode('0', 'undefined')).toBe(false);
  });
  it('checks 363 signed datasets under both divisors and 5808 affine spread transformations', () => {
    let datasets = 0,
      transforms = 0;
    for (let n = 1; n <= 5; n++)
      for (let k = 0; k < 3 ** n; k++) {
        let v = k;
        const xs = Array.from({ length: n }, () => {
          const a = [-2, 0, 3][v % 3]!;
          v = Math.floor(v / 3);
          return a;
        });
        const mean = xs.reduce((s, x) => s + x, 0) / n,
          ss = xs.reduce((s, x) => s + (x - mean) ** 2, 0);
        datasets++;
        for (const convention of ['population', 'sample'] as const) {
          const s = dataSummary(xs.map(String), convention);
          expect(dataNumber(s.mean)).toBeCloseTo(mean, 12);
          expect(dataNumber(s.ss)).toBeCloseTo(ss, 11);
          expect(s.variance === null).toBe(convention === 'sample' && n === 1);
          if (s.variance)
            expect(dataNumber(s.variance)).toBeCloseTo(
              ss / (convention === 'sample' ? n - 1 : n),
              11,
            );
          for (const factor of ['-2', '0', '1/2', '3'])
            for (const shift of ['-3', '5']) {
              const y = transformData(xs.map(String), factor, shift),
                z = dataSummary(y, convention),
                f = dataNumber(readRational(factor));
              expect(dataNumber(z.mean)).toBeCloseTo(
                mean * f + Number(shift),
                11,
              );
              expect(dataNumber(z.ss)).toBeCloseTo(ss * f * f, 10);
              if (s.sd !== null)
                expect(z.sd!).toBeCloseTo(Math.abs(f) * s.sd, 11);
              transforms++;
            }
        }
      }
    expect(datasets).toBe(363);
    expect(transforms).toBe(5808);
    expect(dataSummary(['4'], 'sample').variance).toBeNull();
    expect(textR(dataSummary(['4']).variance!)).toBe('0');
    expect(textR(dataSummary(['2', '4', '4', '14']).ss)).toBe('88');
  });
  it('preserves histogram counts, boundary ownership, raw mirror evidence and summary counterexamples', () => {
    for (const c of shapeCases)
      for (const width of [1, 2, 4, 8]) {
        const bins = histogram(c.values, width);
        expect(bins.reduce((s, b) => s + b.count, 0)).toBe(c.values.length);
        for (const b of bins)
          expect(b.count).toBe(
            c.values
              .map(Number)
              .filter(
                (x) => x >= b.low && (x < b.high || (b.last && x === b.high)),
              ).length,
          );
      }
    expect(
      histogram(['0', '4', '8', '12', '16'], 4).map((b) => b.count),
    ).toEqual([1, 1, 1, 2]);
    const equal = dataSummary(['0', '0', '2', '3', '5']);
    expect(textR(equal.mean)).toBe('2');
    expect(textR(equal.median)).toBe('2');
    expect(equal.values.some((v) => textR(v) === '4')).toBe(false);
  });
  it('checks z signs and 1848 scale transformations without inventing zero-spread scores', () => {
    let count = 0;
    for (let m = -5; m <= 5; m++)
      for (let sd = 1; sd <= 6; sd++)
        for (let z = -3; z <= 3; z++) {
          const x = m + sd * z;
          expect(dataNumber(zScore(String(x), String(m), String(sd))!)).toBe(z);
          for (const factor of [-1, 0.5, 2, 4]) {
            const q = zScore(
              String(factor * x + 7),
              String(factor * m + 7),
              String(Math.abs(factor) * sd),
            );
            expect(dataNumber(q!)).toBeCloseTo(factor < 0 ? -z : z, 12);
            count++;
          }
        }
    expect(count).toBe(1848);
    expect(zScore('80', '80', '0')).toBeNull();
    expect(zScore('85', '80', '0')).toBeNull();
    expect(() => zScore('1', '0', '-1')).toThrow();
  });
  it('independently fits 343 triples and proves least-squares minimality against 8575 candidate lines', () => {
    let count = 0;
    for (let p = -3; p <= 3; p++)
      for (let q = -3; q <= 3; q++)
        for (let r = -3; r <= 3; r++) {
          const rows = [p, q, r].map((y, i) => ({
              id: String(i),
              x: String(i + 1),
              y: String(y),
            })),
            fit = leastSquares(rows),
            b = (r - p) / 2,
            a = (p + q + r) / 3 - 2 * b,
            ys = [p, q, r],
            rss = ys.reduce((s, y, i) => s + (y - a - b * (i + 1)) ** 2, 0);
          expect(dataNumber(fit.slope!)).toBeCloseTo(b, 12);
          expect(dataNumber(fit.intercept!)).toBeCloseTo(a, 12);
          expect(dataNumber(fit.sse)).toBeCloseTo(rss, 11);
          expect(
            fit.rows.reduce((s, x) => s + dataNumber(x.residual), 0),
          ).toBeCloseTo(0, 12);
          for (let ca = -2; ca <= 2; ca++)
            for (let cb = -2; cb <= 2; cb++) {
              const sse = ys.reduce(
                  (s, y, i) => s + (y - ca - cb * (i + 1)) ** 2,
                  0,
                ),
                actual = candidateFit(rows, String(ca), String(cb));
              expect(dataNumber(actual.sse)).toBe(sse);
              expect(sse - rss).toBeCloseTo(
                3 * (ca - a + 2 * (cb - b)) ** 2 + 2 * (cb - b) ** 2,
                10,
              );
              expect(sse + 1e-10).toBeGreaterThanOrEqual(rss);
              count++;
            }
        }
    expect(count).toBe(8575);
  });
  it('keeps constant-x nonidentification distinct from its identified common fitted value and curved zero slopes', () => {
    const base = regressionCases[0]!.rows,
      fit = leastSquares(base);
    expect([textR(fit.intercept!), textR(fit.slope!), textR(fit.sse)]).toEqual([
      '1',
      '3/2',
      '3/2',
    ]);
    expect(fit.rows.map((r) => textR(r.residual))).toEqual([
      '1/2',
      '-1',
      '1/2',
    ]);
    expect(textR(regressionPrediction(base, '4')!)).toBe('7');
    expect(predictionScope(base, '2')).toBe('interpolation');
    expect(predictionScope(base, '4')).toBe('extrapolation');
    const vertical = regressionCases[3]!.rows,
      v = leastSquares(vertical);
    expect(v.slope).toBeNull();
    expect(textR(regressionPrediction(vertical, '2')!)).toBe('13/3');
    expect(regressionPrediction(vertical, '4')).toBeNull();
    expect(textR(candidateFit(vertical, '13/3', '0').sse)).toBe(
      textR(candidateFit(vertical, '7/3', '1').sse),
    );
    const curve = leastSquares(regressionCases[4]!.rows);
    expect(textR(curve.slope!)).toBe('0');
    expect(textR(curve.sse)).toBe('14');
    expect(textR(leastSquares(regressionCases[5]!.rows).slope!)).toBe('-9/14');
    const horizontal = leastSquares(regressionCases[2]!.rows);
    expect(horizontal.slope).not.toBeNull();
    expect(textR(horizontal.slope!)).toBe('0');
    expect(textR(horizontal.sse)).toBe('0');
  });
  it('audits 120 unique retrieval stems using independent small-parameter answers and cycle identities', () => {
    const classifications = [
      'nominal',
      'ordinal',
      'discrete',
      'continuous',
      'nominal',
      'ordinal',
      'discrete',
      'continuous',
    ];
    h08Lessons.forEach((l, i) => {
      const seen = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const q = h08ReviewQuestion(l.id, k);
        seen.add(q.stem.en);
        let expected: string;
        if (i === 0)
          expected =
            k % 3 === 0
              ? String(5 + k)
              : k % 3 === 1
                ? String(k + 2)
                : classifications[Math.floor(k / 3)]!;
        else if (i === 1) {
          const means = [3, 11, 2, 2],
            medians = [1, 13, 2, 2],
            shapes = ['right-skew', 'left-skew', 'symmetric', 'asymmetric'],
            j = k % 6,
            c = Math.floor(k / 6);
          expected =
            j % 3 === 2
              ? shapes[c]!
              : String((j % 3 === 0 ? means[c]! : medians[c]!) + j);
        } else if (i === 2) {
          const d = 1 + Math.floor(k / 6),
            sum = 2 * d * d;
          expected =
            k % 3 === 0
              ? String(sum)
              : k % 2 === 1
                ? String(d)
                : `sqrt(${sum}/3)`;
        } else if (i === 3)
          expected = k % 6 === 5 ? 'undefined' : String(-2 + (k % 5));
        else {
          const shift = k % 6,
            lift = Math.floor(k / 6);
          expected =
            k % 4 === 0
              ? '1.5'
              : k % 4 === 1
                ? String(1 + lift - 1.5 * shift)
                : k % 4 === 2
                  ? String(7 + lift)
                  : '-1';
        }
        expect(checkAnswer(expected, q.answer), `${q.id}: ${expected}`).toBe(
          true,
        );
        expect(checkAnswer('999', q.answer)).toBe(false);
        expect(h08ReviewQuestion(l.id, k).id).not.toBe(
          h08ReviewQuestion(l.id, k + 24).id,
        );
      }
      expect(seen.size, l.id).toBe(24);
    });
  });
  it('rejects unsupported observations, duplicate pair identities and invalid retrieval requests', () => {
    for (const raw of [
      [],
      Array(41).fill('1'),
      ['1001'],
      ['1/1001'],
      ['no-data'],
      ['1/0'],
    ])
      expect(() => dataSummary(raw)).toThrow();
    expect(() => dataSummary(['1'], 'other' as 'sample')).toThrow();
    expect(() => histogram(['17'], 4)).toThrow();
    expect(() => histogram(['0'], 3)).toThrow();
    expect(() => histogram(['0'], 4, 0, 15)).toThrow();
    expect(() => leastSquares([])).toThrow();
    expect(() =>
      leastSquares([
        { id: 'a', x: '1', y: '2' },
        { id: 'a', x: '2', y: '3' },
      ]),
    ).toThrow();
    expect(() => dataValue('1000.01')).toThrow();
    expect(sameR(dataValue('-1/2'), readRational('-.5'))).toBe(true);
    for (const round of [-1, 0.5, Infinity, 100001])
      expect(() => h08ReviewQuestion('H08-L01', round)).toThrow();
    expect(() => h08ReviewQuestion('H08-L06', 0)).toThrow();
  });
});
