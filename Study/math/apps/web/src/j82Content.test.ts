import { describe, it, expect } from 'vitest';
import {
  j82Lessons,
  j82CheckQuestions,
  j82ReviewQuestion,
} from './content/J82';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  parsePolynomial,
  polynomialValue,
  equalPolynomial,
} from './polynomialModels';
import {
  visibleFactorKeys,
  checkFactorisation,
  commonFactor,
  inspectCommonFactor,
  commonCases,
  differenceFactor,
  perfectSquareFactor,
  quadraticSearch,
  checkingCases,
  inspectFactorProposal,
  factorProbe,
} from './factorModels';
const markdown = import.meta.glob('../../../content/lessons/J82-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j82Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j82CheckQuestions,
];
function coefficients(
  raw: string,
  expected: Record<string, number>,
  variables = ['x'],
) {
  const p = parsePolynomial(raw, variables)!;
  expect(p).toBeTruthy();
  const pairs = Object.entries(expected).filter(([, v]) => v !== 0);
  expect(p.size).toBe(pairs.length);
  for (const [key, v] of pairs) {
    const r = p.get(key)!;
    expect(r, `${raw}:${key}`).toBeTruthy();
    expect(r[0]).toBe(BigInt(v) * r[1]);
  }
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
describe('J82 exact completed integer factorisation and scope', () => {
  it('registers five planned bilingual lessons with backward prerequisites and two complete examples per language', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons),
      planned = units.find((u) => u.id === 'J82')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j82Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J82.questions).toHaveLength(8);
    for (const l of j82Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.stage).toBe('J08');
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((v) => v.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j82ReviewQuestion(l.id, 0));
    }
  });
  it('executes all accepted and misconception cases for 48 unique bilingual items without grading prose automatically', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      factorisation: 32,
      polynomial: 3,
      number: 1,
      choice: 6,
      explain: 6,
    }))
      expect(all.filter((q) => q.answer.kind === kind)).toHaveLength(count);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const s of [q.stem, ...q.hints, ...q.solutionSteps!, q.solution]) {
        expect(s.zh, q.id).toBeTruthy();
        expect(s.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(
          checkAnswer('GCF, middle, integer, identity', q.answer),
        ).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently transcribes 36 constructed results, sign/order alternatives and six choice answers', () => {
    const values = [
      [
        '6x(x+2)',
        '3x(3-2x)',
        '4xy(2x-3y)',
        '3x²(2x+3)',
        '5x(2x-3)',
        '4y(x+2y)',
      ],
      [
        '(x+3)(x-3)',
        '(2x+5)(2x-5)',
        '(x+y)(x-y)',
        '(x²+4)(x-2)(x+2)',
        '2(x+3)(x-3)',
        '(3x+2)(3x-2)',
      ],
      ['(x+3)(x+3)', '(4-x)^2', '(3-2x)^2', '(y-x)^2', '2(x+3)^2', '(3x+1)^2'],
      [
        '(x+3)(x+2)',
        '(x-2)(x+3)',
        '(x-3)(x-2)',
        '(x+2)(x-3)',
        '(x+4)x',
        '(x+2)(x-4)',
      ],
      ['2(x+3)(x-3)', '2x²+5x-3', '(2-x)^2', '2', '3x(x+2)(x-2)', 'x²-6x+9'],
    ];
    j82Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      qs.forEach((q, j) =>
        expect(checkAnswer(values[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 0, 2, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    [
      '6x(2x+3)',
      '(x+4)(x-4)',
      '(5-x)^2',
      '(x-2)(x+4)',
      '2x(x+2)(x-2)',
      'x²-x-6',
    ].forEach((s, i) =>
      expect(checkAnswer(s, j82CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('1', j82CheckQuestions[6]!.answer)).toBe(true);
  });
  it('recognises visible multiplicative structure, repeated factors, scalar moves and balanced signs', () => {
    for (const s of ['6(x+2)x', '-6x(-x-2)', '3*2x(x+2)', '（6x）（x＋2）'])
      expect(checkFactorisation(s, '6x(x+2)'), s).toBe(true);
    for (const s of ['(x-3)^2', '(3-x)²', '(x-3)(x-3)', '(-x+3)(3-x)'])
      expect(checkFactorisation(s, '(x-3)^2'), s).toBe(true);
    expect(checkFactorisation('(x²+4)(x+2)(x-2)', '(x-2)(x+2)(x^2+4)')).toBe(
      true,
    );
    expect(checkFactorisation('x^2', 'x*x')).toBe(true);
    expect(checkFactorisation('(x+y)(y-x)', '-(x-y)(x+y)', ['x', 'y'])).toBe(
      true,
    );
    expect(visibleFactorKeys('(x-3)^2')).toHaveLength(2);
  });
  it('rejects equivalent but unfinished sums, residual numerical/letter factors and a stopped difference of squares', () => {
    for (const s of [
      '6x²+12x',
      '3x(2x+4)',
      '6(x²+2x)',
      '6x(x+1+1)',
      '6x(x+2)+0',
    ]) {
      expect(equalPolynomial(s, '6x(x+2)')).toBe(true);
      expect(checkFactorisation(s, '6x(x+2)'), s).toBe(false);
    }
    expect(checkFactorisation('(2x+6)(x+3)', '2(x+3)^2')).toBe(false);
    expect(checkFactorisation('2(x²-9)', '2(x-3)(x+3)')).toBe(false);
    expect(checkFactorisation('(x²-4)(x²+4)', '(x-2)(x+2)(x²+4)')).toBe(false);
    for (const s of [
      'x=3,-3',
      '(x-3)/(x+3)',
      '(x-3)(x+3);alert(1)',
      'sqrt(x)',
      'x^5',
      '(x+3',
      '0(x-3)',
      '(x-3)/0',
    ])
      expect(checkFactorisation(s, '(x-3)(x+3)'), s).toBe(false);
    expect(visibleFactorKeys('0')).toBeNull();
    expect(visibleFactorKeys('x', 'not-letters'.split(''))).toBeNull();
  });
  it('extracts numerical GCD and minimum shared exponents independently across 216 signed source pairs', () => {
    let count = 0;
    for (let a = 1; a <= 8; a++)
      for (let b = 1; b <= 9; b++)
        for (const sign of [-1, 1, 2]) {
          const terms = [
            { coefficient: 3 * a * sign, key: 'xx' },
            { coefficient: 6 * b, key: 'xxx' },
          ];
          if (Math.abs(terms[0]!.coefficient) > 100) continue;
          const m = commonFactor(terms),
            g = gcd(3 * a * sign, 6 * b);
          expect(m.coefficient).toBe(g);
          expect(m.key).toBe('xx');
          expect(m.quotients).toEqual([
            { coefficient: (3 * a * sign) / g, key: '' },
            { coefficient: (6 * b) / g, key: 'x' },
          ]);
          coefficients(m.result, { xx: 3 * a * sign, xxx: 6 * b });
          expect(checkFactorisation(m.result, m.result)).toBe(true);
          count++;
        }
    expect(count).toBe(216);
    expect(commonFactor(commonCases[2]!).factor).toBe('4xy');
  });
  it('checks every term for proposed common factors instead of cancelling away missing letters', () => {
    let count = 0;
    for (const terms of commonCases)
      for (let c = 1; c <= 12; c++)
        for (let x = 0; x <= 3; x++)
          for (let y = 0; y <= 2; y++) {
            if (x + y > 4) continue;
            const candidate = `${c}${'x'.repeat(x)}${'y'.repeat(y)}`,
              m = inspectCommonFactor(terms, candidate),
              valid = terms.every(
                (t) =>
                  t.coefficient % c === 0 &&
                  [...t.key].filter((v) => v === 'x').length >= x &&
                  [...t.key].filter((v) => v === 'y').length >= y,
              );
            expect(m.valid, candidate).toBe(valid);
            const g = terms.reduce((a, t) => gcd(a, t.coefficient), 0),
              mx = Math.min(
                ...terms.map((t) => [...t.key].filter((v) => v === 'x').length),
              ),
              my = Math.min(
                ...terms.map((t) => [...t.key].filter((v) => v === 'y').length),
              );
            expect(m.greatest).toBe(valid && c === g && x === mx && y === my);
            count++;
          }
    expect(count).toBeGreaterThan(500);
    expect(inspectCommonFactor(commonCases[0]!, '-6x')).toEqual({
      valid: true,
      greatest: true,
    });
  });
  it('normalises common content before difference/perfect-square factors in all 90 bounded cases', () => {
    for (let a = 1; a <= 5; a++)
      for (let b = 1; b <= 6; b++) {
        const d = differenceFactor(a, b),
          g = gcd(a, b);
        expect(d.g).toBe(g);
        coefficients(d.result, { xx: a * a, '': -b * b });
        expect(checkFactorisation(d.result, d.result)).toBe(true);
        for (const minus of [false, true]) {
          const s = perfectSquareFactor(a, b, minus);
          coefficients(s.result, {
            xx: a * a,
            x: 2 * a * (minus ? -b : b),
            '': b * b,
          });
          expect(s.g).toBe(g);
          expect(visibleFactorKeys(s.result)).toHaveLength(2);
        }
      }
  });
  it('independently searches all 1825 monic integer quadratics and treats zero constant by extraction', () => {
    let count = 0;
    for (let p = -12; p <= 12; p++)
      for (let q = -36; q <= 36; q++) {
        const m = quadraticSearch(p, q),
          brute: { r: number; s: number }[] = [];
        for (let r = -36; r <= 36; r++)
          for (let s = r; s <= 36; s++)
            if (r * s === q && r + s === p) brute.push({ r, s });
        expect(Boolean(m.match)).toBe(brute.length > 0);
        if (m.factor) {
          coefficients(m.factor, { xx: 1, x: p, '': q });
          expect(visibleFactorKeys(m.factor)).toHaveLength(2);
        }
        if (q !== 0) {
          const pairs = [];
          for (let r = -36; r <= 36; r++)
            for (let s = r; s <= 36; s++)
              if (r * s === q) pairs.push(`${r},${s}`);
          expect(m.pairs.map((v) => `${v.r},${v.s}`).sort()).toEqual(
            pairs.sort(),
          );
        } else expect(m.pairs).toHaveLength(1);
        count++;
      }
    expect(count).toBe(1825);
    expect(quadraticSearch(1, 1).factor).toBeNull();
    expect(quadraticSearch(4, 0).factor).toBeTruthy();
  });
  it('separates false identity, unfinished equivalence and completion, including a one-input coincidence', () => {
    expect(
      checkingCases.map(
        (m) => inspectFactorProposal(m.source, m.result, m.proposal).status,
      ),
    ).toEqual(['different', 'different', 'unfinished', 'different']);
    const m = inspectFactorProposal('x²+5x+6', '(x+2)(x+3)', '(x+1)(x+6)');
    expect(m.expanded).toBe('x^2 + 7x + 6');
    expect(m.coefficients.find((v) => v.key === 'x')!.source).toEqual([5n, 1n]);
    expect(m.coefficients.find((v) => v.key === 'x')!.proposed).toEqual([
      7n,
      1n,
    ]);
    expect(
      inspectFactorProposal('x²+5x+6', '(x+2)(x+3)', '(x+3)(x+2)').status,
    ).toBe('complete');
    expect(inspectFactorProposal('x²+5x+6', '(x+2)(x+3)', 'x/0').status).toBe(
      'invalid',
    );
    expect(factorProbe('x²+5x+6', '(x+1)(x+6)', 0)).toEqual({
      source: '6',
      proposal: '6',
      x: 0,
    });
    expect(factorProbe('x²+5x+6', '(x+1)(x+6)', 1)).toEqual({
      source: '12',
      proposal: '14',
      x: 1,
    });
  });
  it('independently verifies 400 retrieval variants and all accepted/rejected form cases', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 5; i++) {
        const question = j82ReviewQuestion(`J82-L0${i + 1}`, k),
          a = 1 + (k % 5),
          b = 1 + (Math.floor(k / 5) % 6),
          r = (k % 9) - 4,
          s = (Math.floor(k / 9) % 9) - 4,
          answer = question.answer;
        if (answer.kind !== 'factorisation' && answer.kind !== 'polynomial')
          throw Error('Constructed algebra answer');
        if (i === 0) coefficients(answer.value, { xx: a, x: a * b });
        else if (i === 1) {
          const u = 1 + (k % 3);
          coefficients(answer.value, { xx: u * u, '': -b * b });
        } else if (i === 2) {
          const u = 1 + (k % 3);
          coefficients(answer.value, {
            xx: u * u,
            x: 2 * u * (k % 2 ? -b : b),
            '': b * b,
          });
        } else if (i === 3 || k % 2 === 0)
          coefficients(answer.value, { xx: 1, x: r + s, '': r * s });
        else coefficients(answer.value, { xx: a, '': -a * b * b });
        for (const raw of question.answerChecks!.accepted)
          expect(checkAnswer(raw, answer), `${question.id}:${raw}`).toBe(true);
        for (const raw of question.answerChecks!.rejected)
          expect(checkAnswer(raw, answer), `${question.id}:${raw}`).toBe(false);
      }
    expect(j82ReviewQuestion('J82-L03', 80).stem).toEqual(
      j82ReviewQuestion('J82-L03', 0).stem,
    );
  });
  it('rejects unsupported source terms, ranges, inconsistent references and invalid review requests', () => {
    expect(() =>
      commonFactor([
        { coefficient: 0, key: 'x' },
        { coefficient: 2, key: 'xx' },
      ]),
    ).toThrow();
    expect(() =>
      commonFactor([
        { coefficient: 1, key: 'x' },
        { coefficient: 2, key: 'x' },
      ]),
    ).toThrow();
    expect(() =>
      commonFactor([
        { coefficient: 1, key: 'yx' },
        { coefficient: 2, key: 'x' },
      ]),
    ).toThrow();
    expect(() => differenceFactor(0, 2)).toThrow();
    expect(() => perfectSquareFactor(2, 7, false)).toThrow();
    expect(() => quadraticSearch(13, 0)).toThrow();
    expect(() => quadraticSearch(0, -37)).toThrow();
    expect(() => inspectFactorProposal('x²-9', '(x+3)^2', 'x')).toThrow();
    expect(() => factorProbe('x', 'x', NaN)).toThrow();
    for (const id of ['J82-L00', 'J82-L06', 'J81-L01'])
      expect(() => j82ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j82ReviewQuestion('J82-L01', n)).toThrow();
    expect(polynomialValue('6x(x+2)', ['x'], { x: '0' })).toBe('0');
  });
});
