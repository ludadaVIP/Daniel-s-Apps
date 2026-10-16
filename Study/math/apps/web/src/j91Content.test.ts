import { describe, it, expect } from 'vitest';
import {
  j91Lessons,
  j91CheckQuestions,
  j91ReviewQuestion,
} from './content/J91';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { rational, textR } from './algebraModels';
import { readRational } from './rationalModels';
import {
  readRadical,
  radicalText,
  checkRadical,
  isSimplifiedRadical,
  squareFactor,
  squareRoots,
  checkRootSet,
  radicalClass,
  checkRealClass,
  rootBracket,
  checkRoundedRoot,
  operationCases,
  simplifyCases,
} from './radicalModels';
const markdown = import.meta.glob('../../../content/lessons/J91-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j91Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j91CheckQuestions,
];
const approximate = (s: string) => {
  const v = readRadical(s);
  return v === null
    ? null
    : [...v].reduce(
        (sum, [k, r]) =>
          sum + (Math.sqrt(Number(k)) * Number(r[0])) / Number(r[1]),
        0,
      );
};
describe('J91 exact radicals, completed simplification and squared rounding', () => {
  it('registers five planned bilingual lessons with earlier bridges and two examples per language', () => {
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
        .find((u) => u.id === 'J91')!
        .lessons.map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j91Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J91.questions).toHaveLength(8);
    for (const l of j91Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.stage).toBe('J09');
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(j91ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 bilingual items, leaving nine explanations human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      radical: 16,
      'root-set': 5,
      'real-class': 6,
      'root-rounded': 5,
      number: 1,
      choice: 6,
      explain: 9,
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
        expect(checkAnswer('root proof domain exact', q.answer)).toBeNull();
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(false);
    }
  });
  it('independently records every constructed answer and all six choices', () => {
    const values = [
      ['±3', '3', '0', 'no real roots', '3', '-1/2,1/2'],
      ['irrational', 'rational', 'rational', 'not-real', null, 'irrational'],
      ['2√3', '6√2', '2√2/3', '-3√5', '√6/4', '7√2'],
      ['5√2', '-√3', '6', '3', '√3-√2', '√2/2'],
      ['1.4', '1.41', '7.1', '2.23', null, '1.00'],
    ];
    for (const [i, l] of j91Lessons.entries()) {
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
        checkAnswer(String([1, 2, 0, 1, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    }
    for (const [i, s] of ['±4', 'rational', '5√2', '3√2', '1.73'].entries())
      expect(checkAnswer(s, j91CheckQuestions[i]!.answer)).toBe(true);
    expect(checkAnswer('1', j91CheckQuestions[6]!.answer)).toBe(true);
  });
  it('independently verifies square-free decomposition for 2,501 integers', () => {
    for (let n = 0; n <= 2500; n++) {
      const f = squareFactor(BigInt(n)),
        a = Number(f.outside),
        b = Number(f.inside);
      expect(a * a * b).toBe(n);
      for (let p = 2; p * p <= b; p++) expect(b % (p * p)).not.toBe(0);
      expect(approximate(`sqrt(${n})`)).toBeCloseTo(Math.sqrt(n), 12);
      const result = radicalText(readRadical(`sqrt(${n})`)!);
      expect(checkRadical(result, `sqrt(${n})`, true), result).toBe(true);
    }
  });
  it('compares exact signed expressions with implicit products and conjugate denominators', () => {
    const pairs = [
      ['√8+√18', '5√2'],
      ['√12-√27', '-√3'],
      ['√3*√12', '6'],
      ['√18/√2', '3'],
      ['1/√2', '√2/2'],
      ['1/(√3+√2)', '√3-√2'],
      ['1/(1+√2)', '√2-1'],
      ['(√2+√3)*(√3-√2)', '1'],
      ['√(8/9)', '2√2/3'],
      ['√(3/8)', '√6/4'],
      ['-√45', '-3√5'],
      ['√2+√3-√2', '√3'],
      ['(2/3)√18', '2√2'],
      ['√0', '0'],
      ['sqrt(2+7)', '3'],
    ];
    for (const [a, b] of pairs) {
      expect(checkRadical(a!, b!)).toBe(true);
      expect(approximate(a!)).toBeCloseTo(approximate(b!)!, 12);
    }
    expect(checkRadical('1.414213562', '√2')).toBe(false);
    expect(checkRadical('-√2', '√2')).toBe(false);
    expect(checkRadical('√2+√3', '√5')).toBe(false);
  });
  it('independently checks 400 binomial radical arithmetic cases against explicit coefficients', () => {
    for (let a = 1; a <= 5; a++)
      for (let b = 1; b <= 5; b++)
        for (const d of [2, 3, 5, 7]) {
          expect(checkRadical(`${a}√${d}+${b}√${d}`, `${a + b}√${d}`)).toBe(
            true,
          );
          expect(
            checkRadical(`${a}√${d}-${b}√${d}`, String(a - b) + `√${d}`),
          ).toBe(true);
          expect(checkRadical(`${a}√${d}*${b}√${d}`, String(a * b * d))).toBe(
            true,
          );
          expect(checkRadical(`${a}√${d}/(${b}√${d})`, `${a}/${b}`)).toBe(true);
        }
  });
  it('distinguishes equivalent unfinished forms from simplified signed sums and constants', () => {
    for (const s of [
      '2√3',
      '-3√5',
      '√2/2',
      '2√2/3',
      '(2/3)√2',
      '√3-√2',
      '-√2+√3',
      '√2+√3',
      '0',
      '3',
      '-1/2',
    ])
      expect(isSimplifiedRadical(s), s).toBe(true);
    for (const s of [
      '√12',
      '3√8',
      '√(8/9)',
      '1/√2',
      '1/(√3+√2)',
      '2√2+3√2',
      '√2-√2',
      '√0',
      '√1',
      '2*3√2',
      '√2+0',
      '0√2',
    ])
      expect(isSimplifiedRadical(s), s).toBe(false);
    expect(checkRadical('√12', '2√3', false)).toBe(true);
    expect(checkRadical('√12', '2√3', true)).toBe(false);
    expect(checkRadical('-√3', '√3', true)).toBe(false);
  });
  it('requires complete distinct real root sets including fractions, irrational roots, zero and empty sets', () => {
    for (let n = 0; n <= 50; n++) {
      const a = String(n * n),
        s = squareRoots(a);
      expect(s).toEqual(n ? ['-' + n, String(n)] : ['0']);
      expect(checkRootSet(n ? `${n},-${n}` : '0', a)).toBe(true);
      expect(checkRootSet(`±${n}`, a)).toBe(true);
      if (n) expect(checkRootSet(String(n), a)).toBe(false);
      expect(checkRootSet(`${n},${n}`, a)).toBe(false);
    }
    for (const s of ['±sqrt(2)', '{-√2,√2}', '√2，-√2'])
      expect(checkRootSet(s, '2')).toBe(true);
    expect(checkRootSet('-1/2,1/2', '1/4')).toBe(true);
    for (const s of ['no real roots', '无实数根', '∅', '{}'])
      expect(checkRootSet(s, '-4')).toBe(true);
    expect(checkRootSet('0', '-4')).toBe(false);
    expect(checkRootSet('-√8,√2', '2')).toBe(false);
  });
  it('classifies exact expressions instead of finite decimal appearances or root symbols', () => {
    for (const s of [
      '0',
      '1/3',
      '1.414213562',
      '√9',
      '√(1/4)',
      '√2*√2',
      '√2-√2',
    ])
      expect(radicalClass(s)).toBe('rational');
    for (const s of ['√2', '-√2', '√2+√3', '1/√2'])
      expect(radicalClass(s)).toBe('irrational');
    expect(radicalClass('sqrt(-2)')).toBe('not-real');
    expect(() => radicalClass('garbage')).toThrow();
    expect(checkRealClass('无理数', 'irrational')).toBe(true);
    expect(checkRealClass('not an integer', 'irrational')).toBe(false);
  });
  it('independently checks exact grid bounds and nearest rounding over 1,000 radicand/precision pairs', () => {
    for (let n = 0; n < 250; n++)
      for (let p = 0; p <= 3; p++) {
        const b = rootBracket(String(n), p),
          scale = 10 ** p,
          l = Number(b.lower[0]) / Number(b.lower[1]),
          u = Number(b.upper[0]) / Number(b.upper[1]),
          k = Math.floor(Math.sqrt(n) * scale);
        expect(Number(b.k)).toBe(k);
        expect(l * l).toBeLessThanOrEqual(n + 1e-9);
        expect(u * u).toBeGreaterThanOrEqual(n - 1e-9);
        if (b.exact) expect(l).toBe(u);
        else expect(u - l).toBeCloseTo(1 / scale, 12);
        expect(b.rounded).toBe(
          (Math.round(Math.sqrt(n) * scale) / scale).toFixed(p),
        );
      }
    expect(rootBracket('999/1000', 2).rounded).toBe('1.00');
    expect(rootBracket('25/16', 1).rounded).toBe('1.3');
    expect(rootBracket('25/16', 2).exact).toBe(true);
    expect(rootBracket('0', 3).rounded).toBe('0.000');
  });
  it('uses exact midpoint comparisons including halfway ties and rejects wrong precision', () => {
    for (let p = 0; p <= 3; p++)
      for (let k = 0; k < 20; k++) {
        const scale = 10n ** BigInt(p),
          n = (2n * BigInt(k) + 1n) ** 2n,
          d = 4n * scale * scale,
          r = textR(rational(n, d)),
          b = rootBracket(r, p);
        expect(b.rounded).toBe(((k + 1) / Number(scale)).toFixed(p));
        const lower = textR(rational(n * 1000n - 1n, d * 1000n));
        if (n > 0n)
          expect(rootBracket(lower, p).rounded).toBe(
            (k / Number(scale)).toFixed(p),
          );
      }
    expect(checkRoundedRoot('1.00', '999/1000', 2)).toBe(true);
    for (const raw of [
      '1',
      '1.0',
      '1.000',
      '1/1',
      '√1',
      '1.00m',
      '9'.repeat(240),
    ])
      expect(checkRoundedRoot(raw, '999/1000', 2)).toBe(false);
  });
  it('checks source catalogues and 400 retrieval items including twenty human rounding arguments', () => {
    for (const s of simplifyCases) {
      const v = radicalText(readRadical(`sqrt(${s})`)!);
      expect(checkRadical(v, `sqrt(${s})`, true)).toBe(true);
    }
    expect(operationCases.map((c) => readRadical(c.source) !== null)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
    ]);
    let human = 0;
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = j91ReviewQuestion(`J91-L0${i + 1}`, k),
          a = (k % 5) + 1,
          b = [2, 3, 5, 6, 7][k % 5]!,
          c = (k % 4) + 1;
        if (i === 4 && k % 4 === 0) {
          human++;
          expect(q.answer.kind).toBe('explain');
          expect(checkAnswer('bounds', q.answer)).toBeNull();
          continue;
        }
        let s: string;
        if (i === 0) {
          const n = Math.abs((k % 7) - 3);
          s = k % 4 === 3 ? 'no real roots' : n ? `±${n}` : '0';
        } else if (i === 1)
          s = [
            'irrational',
            'rational',
            'irrational',
            'rational',
            'rational',
            'not-real',
          ][k % 6]!;
        else if (i === 2) s = `${k % 2 ? '-' : ''}${a}√${b}`;
        else if (i === 3)
          s =
            k % 4 === 0
              ? String(a * b)
              : k % 4 === 1
                ? String(a)
                : `${k % 4 === 2 ? a + c : a - c}√${b}`;
        else
          s = (
            Math.round(Math.sqrt((k % 49) + 2) * 10 ** ((k % 3) + 1)) /
            10 ** ((k % 3) + 1)
          ).toFixed((k % 3) + 1);
        if (i === 3 && k % 4 === 3 && a === c) s = '0';
        expect(checkAnswer(s, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.accepted)
          expect(checkAnswer(raw, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer), q.id).toBe(false);
      }
    expect(human).toBe(20);
  });
  it('rejects invalid domains, zero divisors, malformed syntax and unsupported bounded expressions', () => {
    for (const s of [
      '√(-1)*√(-1)',
      '√2/√0',
      '1/(√2-√2)',
      'sqrt(√2)',
      '1/(1+√2+√3)',
      'x+√2',
      'sqrt(2);process.exit()',
      '√',
      'sqrt2',
      '1/0',
      'NaN',
      '∞',
      '2'.repeat(241),
      '('.repeat(20) + '2' + ')'.repeat(20),
    ])
      expect(readRadical(s), s).toBeNull();
    expect(() => squareFactor(-1n)).toThrow();
    expect(() => rootBracket('-1', 2)).toThrow();
    for (const [id, k] of [
      ['J91-L00', 0],
      ['J88-L01', 0],
      ['J91-L01', -1],
      ['J91-L01', 0.5],
      ['J91-L01', 100001],
    ] as const)
      expect(() => j91ReviewQuestion(id, k)).toThrow();
    expect(readRational('1/4')).toEqual([1n, 4n]);
  });
});
