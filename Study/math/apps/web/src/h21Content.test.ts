import { describe, it, expect } from 'vitest';
import {
  h21Lessons,
  h21CheckQuestions,
  h21ReviewQuestion,
} from './content/H21';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { rational, textR, sameR } from './algebraModels';
import {
  complex,
  complexText,
  readComplex,
  checkComplex,
  readComplexSet,
  checkComplexSet,
  sameComplex,
  addComplex,
  subtractComplex,
  multiplyComplex,
  divideComplex,
  powerComplex,
  powerI,
  conjugateComplex,
  squareModulus,
  modulusComplex,
  squareEquationRoots,
  transformComplex,
  realOrNonreal,
  pureImaginary,
  complexComponent,
  complexZero,
} from './complexModels';
const bodies = import.meta.glob('../../../content/lessons/H21-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h21Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h21CheckQuestions,
];
const tuple = (z: ReturnType<typeof readComplex>) => z.map(textR);
const pair = (a: number, b: number) => complex(String(a), String(b));
describe('H21 complex numbers, exact expressions and independent geometric oracles', () => {
  it('opens five verified bilingual lessons with H11 metadata and valid earlier prerequisites', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(277);
    expect(openUnits.length).toBeGreaterThanOrEqual(52);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H21-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h21Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H21.questions).toEqual(h21CheckQuestions);
    for (const l of h21Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.stage).toBe('H11');
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h21ReviewQuestion(l.id, 0));
    }
  });
  it('audits 48 authored anchors, equivalent completed forms and 12 human arguments', () => {
    const anchors = [
      ['±2i', '-i', '1', '{ }', '0'],
      ['-2', '0.5', '0', '0', '(2,-2)'],
      ['-i+8', '2+2i', '2-5i', '2i', '-1'],
      ['3+4i', '25', 'sqrt(2)', '-2-3i', '0'],
      ['-1+2i', '(-1,2)', '3+2i', '1+2i', 'sqrt(5)'],
    ];
    h21Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['2i,-2i', '-2', '8-i', 'sqrt(2)', '1+2i', '2'].forEach((v, i) =>
      expect(checkAnswer(v, h21CheckQuestions[i]!.answer)).toBe(true),
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
        expect(checkAnswer('root centre i modulus', q.answer)).toBeNull();
        continue;
      }
      expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer)).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(false);
    }
    expect(checkAnswer('(2+i)(3-2i)', h21Lessons[2]!.guided.answer)).toBe(
      false,
    );
    expect(checkAnswer('16/2-i', h21Lessons[2]!.guided.answer)).toBe(true);
  });
  it('parses precedence and exact rational coefficients while distinguishing equivalence from completed form', () => {
    const examples: [string, string][] = [
      ['-i^2', '1'],
      ['(-i)^2', '-1'],
      ['i⁻¹', '-i'],
      ['i¹²', '1'],
      ['(2+i)(3-2i)', '8-i'],
      ['(1+i)/(1-i)', 'i'],
      ['1/(2i)', '-1/2i'],
      ['2/3i+1/2', '1/2+2/3i'],
      ['3i/2-1/4', '-1/4+3/2i'],
      ['（1＋i）²', '2i'],
    ];
    for (const [input, expected] of examples)
      expect(checkComplex(input, expected), input).toBe(true);
    for (const raw of ['(2+i)(3-2i)', '6-4i+3i+2', '8-i^1', '-(i-8)']) {
      expect(checkComplex(raw, '8-i')).toBe(true);
      expect(checkComplex(raw, '8-i', true)).toBe(false);
    }
    for (const raw of ['8-i', '-i+8', '16/2-i', '8+(-1)i'])
      expect(checkComplex(raw, '8-i', true)).toBe(true);
    for (const raw of [
      '',
      '2 3',
      '1..2',
      '(1,i)',
      'z=8-i',
      'NaN',
      'Infinity',
      'sqrt(-1)',
      'i^(1/2)',
      'i^13',
      'i^2^3',
      '1/0',
      '0^0',
      '0^-1',
      '(1+i)/(0i)',
      'alert(1)',
    ])
      expect(() => readComplex(raw), raw).toThrow();
    expect(checkComplex('i*i', '-1')).toBe(true);
    expect(checkComplex('i*i', '1')).toBe(false);
    const big = complex('1000', '1000'),
      product = multiplyComplex(big, big);
    expect(checkComplex(complexText(product), '2000000i')).toBe(true);
    expect(sameComplex(readComplex(complexText(product)), product)).toBe(true);
  });
  it('checks 2401 integer operand pairs against independently expanded arithmetic and exact quotient recovery', () => {
    let count = 0;
    for (let a = -3; a <= 3; a++)
      for (let b = -3; b <= 3; b++)
        for (let c = -3; c <= 3; c++)
          for (let d = -3; d <= 3; d++) {
            const z = pair(a, b),
              w = pair(c, d),
              sum = addComplex(z, w),
              difference = subtractComplex(z, w),
              product = multiplyComplex(z, w);
            expect(tuple(sum)).toEqual([String(a + c), String(b + d)]);
            expect(tuple(difference)).toEqual([String(a - c), String(b - d)]);
            expect(tuple(product)).toEqual([
              String(a * c - b * d),
              String(a * d + b * c),
            ]);
            expect(
              checkComplex(
                `(${complexText(z)})(${complexText(w)})`,
                complexText(product),
              ),
            ).toBe(true);
            if (c || d)
              expect(sameComplex(divideComplex(product, w), z)).toBe(true);
            count++;
          }
    expect(count).toBe(2401);
    const fraction = multiplyComplex(
      complex('1/2', '-1/3'),
      complex('-2/5', '3/4'),
    );
    expect(tuple(fraction)).toEqual(['1/20', '61/120']);
  });
  it('keeps complete root sets, domains, duplicates and single principal-root values distinct', () => {
    for (const rhs of [-9, -4, -1, 0, 1, 4, 9])
      for (const domain of ['real', 'complex'] as const) {
        const roots = squareEquationRoots(rhs, domain);
        expect(roots.length).toBe(
          rhs === 0 ? 1 : rhs < 0 && domain === 'real' ? 0 : 2,
        );
        for (const z of roots) {
          const [a, b] = z.map((r) => Number(r[0]) / Number(r[1]));
          expect(a! * a! - b! * b!).toBe(rhs);
          expect(2 * a! * b!).toBeCloseTo(0, 12);
        }
        expect(
          checkComplexSet(complexTextSet(roots), roots.map(complexText)),
        ).toBe(true);
      }
    expect(checkComplexSet('i', ['i', '-i'])).toBe(false);
    expect(checkComplexSet('{−i,i,i}', ['i', '-i'])).toBe(true);
    expect(checkComplexSet('z=±2i', ['2i', '-2i'])).toBe(true);
    expect(checkComplexSet('±0', ['0'])).toBe(true);
    expect(checkComplexSet('{ }', [])).toBe(true);
    expect(checkComplexSet('', [])).toBe(false);
    expect(checkComplexSet('±(1/2+i)', ['1/2+i', '-1/2-i'])).toBe(true);
    expect(checkComplexSet('1,−1', ['i', '-i'])).toBe(false);
    for (const raw of ['{i,}', 'i,,−i', '{i;−i', '±i,0', 'i±i'])
      expect(() => readComplexSet(raw), raw).toThrow();
  });
  it('checks 257 signed powers of i and the limits on general powers', () => {
    const cycle = ['1', 'i', '-1', '-i'];
    for (let n = -128; n <= 128; n++)
      expect(complexText(powerI(n))).toBe(cycle[((n % 4) + 4) % 4]);
    for (let n = -12; n <= 12; n++)
      expect(sameComplex(powerComplex(complex('0', '1'), n), powerI(n))).toBe(
        true,
      );
    expect(complexText(powerComplex(complex('1', '1'), 2))).toBe('2i');
    expect(() => powerComplex(complexZero(), 0)).toThrow();
    expect(() => powerComplex(complexZero(), -1)).toThrow();
  });
  it('checks 289 conjugate, classification and nonnegative norm cases independently', () => {
    let count = 0;
    for (let a = -8; a <= 8; a++)
      for (let b = -8; b <= 8; b++) {
        const z = pair(a, b),
          bar = conjugateComplex(z);
        expect(tuple(bar)).toEqual([String(a), String(-b)]);
        expect(tuple(multiplyComplex(z, bar))).toEqual([
          String(a * a + b * b),
          '0',
        ]);
        expect(textR(squareModulus(z))).toBe(String(a * a + b * b));
        expect(
          checkAnswer(`sqrt(${a * a + b * b})`, {
            kind: 'radical',
            value: modulusComplex(z),
          }),
        ).toBe(true);
        expect(realOrNonreal(z)).toBe(b === 0 ? 'real' : 'nonreal');
        expect(pureImaginary(z)).toBe(
          a === 0 && b !== 0 ? 'pure-imaginary' : 'not-pure-imaginary',
        );
        expect(sameComplex(bar, pair(-a, -b))).toBe(a === 0);
        count++;
      }
    expect(count).toBe(289);
    expect(modulusComplex(complex('3', '-4'))).toBe('5');
    expect(modulusComplex(complexZero())).toBe('0');
  });
  it('checks 2025 points and centres against independent quarter-turn coordinates and four-turn identity', () => {
    let count = 0;
    for (let a = -4; a <= 4; a++)
      for (let b = -4; b <= 4; b++)
        for (let c = -2; c <= 2; c++)
          for (let d = -2; d <= 2; d++) {
            const z = pair(a, b),
              centre = pair(c, d),
              w = transformComplex(z, 'turn-centre', centre);
            expect(tuple(w)).toEqual([String(c - b + d), String(d + a - c)]);
            expect(
              sameR(
                squareModulus(subtractComplex(w, centre)),
                rational(BigInt((a - c) ** 2 + (b - d) ** 2)),
              ),
            ).toBe(true);
            let cycle = z;
            for (let n = 0; n < 4; n++)
              cycle = transformComplex(cycle, 'turn-centre', centre);
            expect(sameComplex(cycle, z)).toBe(true);
            expect(tuple(transformComplex(z, 'times-i', centre))).toEqual([
              String(-b),
              String(a),
            ]);
            expect(tuple(transformComplex(z, 'times-minus-i', centre))).toEqual(
              [String(b), String(-a)],
            );
            expect(tuple(transformComplex(z, 'translate', centre))).toEqual([
              String(a + 1),
              String(b + 1),
            ]);
            expect(tuple(transformComplex(z, 'double', centre))).toEqual([
              String(2 * a),
              String(2 * b),
            ]);
            expect(tuple(transformComplex(z, 'zero', centre))).toEqual([
              '0',
              '0',
            ]);
            count++;
          }
    expect(count).toBe(2025);
    expect(
      complexText(
        transformComplex(complex('2', '1'), 'turn-centre', complex('2', '-1')),
      ),
    ).toBe('-i');
    expect(
      complexText(
        transformComplex(complex('1', '1'), 'turn-centre', complex('1', '1')),
      ),
    ).toBe('1+i');
  });
  it('checks 120 unique retrieval stems with independently computed values and cycle IDs', () => {
    h21Lessons.forEach((l, i) => {
      const stems = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const q = h21ReviewQuestion(l.id, k);
        stems.add(q.stem.en);
        let expected: string;
        if (i === 0) {
          if (k < 12) {
            const rhs = [-9, -4, -1, 0, 4, 9][k % 6]!,
              m = Math.sqrt(Math.abs(rhs));
            expected =
              rhs === 0
                ? '0'
                : rhs < 0 && k < 6
                  ? '∅'
                  : rhs < 0
                    ? `±${m}i`
                    : `${m},-${m}`;
          } else expected = ['1', 'i', '-1', '-i'][(k - 12) % 4]!;
        } else if (i === 1) {
          const a = -2 + (k % 6),
            b = -2 + Math.floor(k / 6);
          expected =
            k % 4 === 0
              ? String(a)
              : k % 4 === 1
                ? String(b)
                : k % 4 === 2
                  ? b === 0
                    ? 'real'
                    : 'nonreal'
                  : a === 0 && b !== 0
                    ? 'pure-imaginary'
                    : 'not-pure-imaginary';
        } else if (i === 2) {
          const a = -2 + (k % 6),
            b = 1 + Math.floor(k / 12),
            c = 1 + Math.floor((k % 12) / 6),
            d = k % 2 === 0 ? -1 : 1;
          const real =
              k % 3 === 0 ? a + c : k % 3 === 1 ? a - c : a * c - b * d,
            imag = k % 3 === 0 ? b + d : k % 3 === 1 ? b - d : a * d + b * c;
          expected = `(${real})+(${imag})i`;
        } else if (i === 3) {
          const a = -2 + (k % 6),
            b = Math.floor(k / 6) - 1;
          expected =
            k % 3 === 0
              ? `${a}${-b < 0 ? '-' : '+'}${Math.abs(b)}i`
              : k % 3 === 1
                ? `sqrt(${a * a + b * b})`
                : String(a * a + b * b);
        } else {
          const a = -2 + (k % 6),
            b = 1 + Math.floor(k / 12),
            kind = k % 4,
            real = kind === 0 ? -b : kind === 1 ? b : kind === 2 ? a : 2 - b,
            imag = kind === 0 ? a : kind === 1 ? -a : kind === 2 ? -b : a;
          expected = k % 3 === 0 ? `(${real},${imag})` : `(${real})+(${imag})i`;
        }
        expect(checkAnswer(expected, q.answer), `${q.id}: ${expected}`).toBe(
          true,
        );
        expect(checkAnswer('999', q.answer)).toBe(false);
        expect(q.id).not.toBe(h21ReviewQuestion(l.id, k + 24).id);
      }
      expect(stems.size, l.id).toBe(24);
    });
  });
  it('rejects unsupported parameters, unsafe exponents, unbounded expressions and invalid review requests', () => {
    for (const raw of ['1001', '1/1001', '1/0'])
      expect(() => complexComponent(raw)).toThrow();
    expect(() => divideComplex(complex('1', '1'), complexZero())).toThrow();
    for (const n of [0.5, 100001, Infinity]) expect(() => powerI(n)).toThrow();
    expect(() => powerComplex(complex('1', '1'), 13)).toThrow();
    expect(() => readComplex('1'.repeat(401))).toThrow();
    expect(() => readComplexSet(' '.repeat(2049))).toThrow();
    expect(() => squareEquationRoots(-2, 'complex')).toThrow();
    for (const round of [-1, 0.1, Infinity, 100001])
      expect(() => h21ReviewQuestion('H21-L01', round)).toThrow();
    expect(() => h21ReviewQuestion('H21-L06', 0)).toThrow();
  });
});
function complexTextSet(roots: readonly ReturnType<typeof readComplex>[]) {
  return roots.length ? `{${roots.map(complexText).join(',')}}` : '∅';
}
