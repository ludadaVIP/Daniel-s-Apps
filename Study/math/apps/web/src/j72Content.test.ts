import { describe, it, expect } from 'vitest';
import {
  j72Lessons,
  j72CheckQuestions,
  j72ReviewQuestion,
} from './content/J72';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  parsePolynomial,
  equalPolynomial,
  isCollectedPolynomial,
  polynomialText,
  polynomialValue,
  substitutionText,
  termBuckets,
  distribution,
  expressionPair,
  storyModel,
} from './polynomialModels';
const markdown = import.meta.glob('../../../content/lessons/J72-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j72Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j72CheckQuestions,
];
const coefficient = (raw: string, key: string, vars = ['x']) =>
  parsePolynomial(raw, vars)!.get(key) ?? [0n, 1n];
const sameCoefficient = (
  raw: string,
  key: string,
  n: number,
  d = 1,
  vars = ['x'],
) => {
  const c = coefficient(raw, key, vars);
  expect(c[0] * BigInt(d)).toBe(BigInt(n) * c[1]);
};
describe('J72 authored algebra and structural polynomial checking', () => {
  it('registers all five planned bilingual lessons, backwards prerequisites and the complete roadmap', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'J72')!;
    expect(j72Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(unitChecks.J72.questions).toHaveLength(8);
    expect(new Set(j72Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of j72Lessons) {
      expect(l.stage).toBe('J07');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(j72ReviewQuestion(l.id, 0));
    }
  });
  it('validates 48 unique bilingual items including form-specific accepted and rejected evidence', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'number')).toHaveLength(7);
    expect(all.filter((q) => q.answer.kind === 'polynomial')).toHaveLength(29);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
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
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(300);
      } else {
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
  it('independently transcribes all 36 constructed answers and the six choices', () => {
    const expected = [
      ['-3', '-2.5', '3.75', '-7', '5', '6'],
      ['7x²+3x', '3yx+3y', '5x/6-2', '0', 'x²+4x-3', '2x²+7yx'],
      ['8-6x', '-x²+2x-3', 'x+8', '2x²-3x', '0', '2x²-8x+3'],
      ['x²-3x+7', '3x²+2x+3', '2xy-6y', 'x²/6+3x', '0', '3x²-2x+7'],
      ['4n+6', '3(n+2)', '2((n+2)+n)', 'n(n+2)', '5n-2', '2(3n+4)'],
    ];
    j72Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    ['15', '5x²-x', '-3x+6', 'x²+3x-5', '5yx-y', '3n+5'].forEach((a, i) =>
      expect(checkAnswer(a, j72CheckQuestions[i]!.answer)).toBe(true),
    );
    [1, 2, 1, 2, 0].forEach((a, i) =>
      expect(j72Lessons[i]!.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String(a),
      }),
    );
    expect(j72CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '1',
    });
  });
  it('compares coefficients, not finite sample points, and handles two variables and rational coefficients exactly', () => {
    expect(polynomialValue('x²', ['x'], { x: '0' })).toBe(
      polynomialValue('x', ['x'], { x: '0' }),
    );
    expect(polynomialValue('x²', ['x'], { x: '1' })).toBe(
      polynomialValue('x', ['x'], { x: '1' }),
    );
    expect(equalPolynomial('x²', 'x')).toBe(false);
    for (const [a, b] of [
      ['3x²+4x²', '7x^2'],
      ['(x+y)^2', 'x²+2xy+y²'],
      ['xy-yx', '0'],
      ['(x+y)(x-y)', 'x²-y²'],
      ['(1/2)x+(1/3)x', '5x/6'],
      ['-(x²-2x+3)', '-x²+2x-3'],
      ['−2（3x－4）', '8-6x'],
      ['-x²', '-(x*x)'],
    ])
      expect(equalPolynomial(a!, b!, ['x', 'y']), a).toBe(true);
    expect(equalPolynomial('-x²', '(-x)²')).toBe(false);
    expect(equalPolynomial('x^2+y^2', '2xy', ['x', 'y'])).toBe(false);
    expect(polynomialText(parsePolynomial('(x+y)^2', ['x', 'y'])!)).toBe(
      'x^2 + 2xy + y^2',
    );
  });
  it('distinguishes a correct identity from completed distribution and one term per variable part', () => {
    for (const s of [
      '7x²+3x',
      '3x+7x^2',
      '(5/6)x-2',
      '(7x²+3x)',
      '-x²+2x-3',
      '0',
      '0/2',
      '3xy+3y',
      '3yx+3y',
    ])
      expect(isCollectedPolynomial(s, ['x', 'y']), s).toBe(true);
    for (const s of [
      '3x²+4x²+3x',
      '2(x+x)',
      'x(x+1)-x',
      '-(x-1)',
      '0x+0',
      '0x',
      'x*0',
      'x-x',
      'x^2-x*x',
      '2x+1+2',
      '0x+3',
    ])
      expect(isCollectedPolynomial(s, ['x', 'y']), s).toBe(false);
    const collected = j72Lessons[2]!.guided.answer;
    expect(checkAnswer('-2(3x-4)', collected)).toBe(false);
    if (collected.kind !== 'polynomial') throw Error('Polynomial');
    expect(checkAnswer('-2(3x-4)', { ...collected, collected: false })).toBe(
      true,
    );
    expect(checkAnswer('n(n+2)', j72Lessons[4]!.questions[3]!.answer)).toBe(
      true,
    );
  });
  it('checks 343 distributions and 1372 substitutions using independently derived integer coefficients', () => {
    for (let k = -3; k <= 3; k++)
      for (let a = -3; a <= 3; a++)
        for (let b = -3; b <= 3; b++) {
          const model = distribution(k, a, b);
          sameCoefficient(model.result, 'x', k * a);
          sameCoefficient(model.result, '', k * b);
          expect(isCollectedPolynomial(model.result)).toBe(true);
          for (const [n, d] of [
            [-2, 1],
            [-1, 2],
            [0, 1],
            [2, 1],
          ]) {
            const v = exactRational(
              polynomialValue(model.original, ['x'], { x: `${n}/${d}` })!,
            )!;
            expect(v[0] * BigInt(d!)).toBe(
              BigInt(k * (a * n! + b * d!)) * v[1],
            );
          }
        }
  });
  it('preserves every signed card identity in 1029 groupings and independently checks each coefficient', () => {
    for (let a = -3; a <= 3; a++)
      for (let b = -3; b <= 3; b++)
        for (let c = -3; c <= 3; c++)
          for (const third of ['xx', 'yx', 'x']) {
            const cards = [
                { id: 'A', coefficient: a, key: 'xx' },
                { id: 'B', coefficient: b, key: 'x' },
                { id: 'C', coefficient: c, key: third },
                { id: 'D', coefficient: 1, key: '' },
              ],
              m = termBuckets(cards);
            expect(
              m.groups.flatMap((g) => g.cards.map((c) => c.id)).sort(),
            ).toEqual(['A', 'B', 'C', 'D']);
            sameCoefficient(m.result, 'xx', a + (third === 'xx' ? c : 0), 1, [
              'x',
              'y',
            ]);
            sameCoefficient(m.result, 'x', b + (third === 'x' ? c : 0), 1, [
              'x',
              'y',
            ]);
            sameCoefficient(m.result, 'xy', third === 'yx' ? c : 0, 1, [
              'x',
              'y',
            ]);
            sameCoefficient(m.result, '', 1, 1, ['x', 'y']);
          }
  });
  it('checks 162 polynomial sums and differences with independent coefficient subtraction and add-back evidence', () => {
    for (let a = -4; a <= 4; a++)
      for (let b = -4; b <= 4; b++)
        for (const subtract of [false, true]) {
          const m = expressionPair(`2x^2-x+(${a})`, `x^2+${b}x-4`, subtract),
            sign = subtract ? -1 : 1;
          sameCoefficient(m.result, 'xx', 2 + sign);
          sameCoefficient(m.result, 'x', -1 + sign * b);
          sameCoefficient(m.result, '', a - sign * 4);
          expect(
            equalPolynomial(
              `(${m.result})${subtract ? '+' : '-'}(${m.second})`,
              m.first,
            ),
          ).toBe(true);
        }
  });
  it('evaluates negative rational substitutions consistently and preserves modelling domains, targets and units', () => {
    expect(substitutionText('x^2+2x-3', ['x'], { x: '-2' })).toBe(
      '(-2)^2+2(-2)-3',
    );
    expect(polynomialValue('x²-x', ['x'], { x: '-3/2' })).toBe('15/4');
    expect(polynomialValue('2xy+x', ['x', 'y'], { x: '-1/2', y: '3' })).toBe(
      '-7/2',
    );
    expect(polynomialValue('xy', ['x', 'y'], { x: '1' })).toBeNull();
    for (let n = 1; n <= 8; n++) {
      const p = storyModel('perimeter', n),
        a = storyModel('area', n);
      expect(Number(p.value)).toBe(2 * (n + 2) + 2 * n);
      expect(p.unit).toBe('cm');
      expect(Number(a.value)).toBe(n * (n + 2));
      expect(a.unit).toBe('cm²');
      for (let fare = 0; fare <= 8; fare++)
        for (let fee = 0; fee <= 12; fee++) {
          const t = storyModel('tickets', n, fare, fee);
          expect(Number(t.value)).toBe(n * fare + fee);
          expect(t.unit).toBe('NZD');
        }
    }
    expect(equalPolynomial('n(n+2)', '4n+4', ['n'])).toBe(false);
  });
  it('independently checks 400 retrieval variants including omitted zero terms and completed form', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const a = (k % 7) - 3,
          b = 1 + (Math.floor(k / 7) % 5),
          c = (k % 5) - 2,
          q = j72ReviewQuestion(j72Lessons[i]!.id, k);
        expect(q.answer.kind === 'explain').toBe(false);
        if (q.answer.kind === 'number') {
          const d = [1, 2, 4][k % 3]!,
            v = exactRational(q.answer.value)!;
          expect(v[0] * BigInt(d * d)).toBe(
            BigInt(a * a + b * a * d + c * d * d) * v[1],
          );
        } else if (q.answer.kind === 'polynomial') {
          if (i === 1) {
            sameCoefficient(q.answer.value, 'xx', a + c);
            sameCoefficient(q.answer.value, 'x', b - 1);
          } else if (i === 2) {
            sameCoefficient(q.answer.value, 'x', a * b);
            sameCoefficient(q.answer.value, '', a * c);
          } else if (i === 3) {
            sameCoefficient(q.answer.value, 'xx', b - 1);
            sameCoefficient(q.answer.value, 'x', a - c);
            sameCoefficient(q.answer.value, '', 5);
          } else {
            sameCoefficient(q.answer.value, 'n', b + 2, 1, ['n']);
            sameCoefficient(q.answer.value, '', a + 4, 1, ['n']);
          }
          if (q.answer.collected)
            expect(
              isCollectedPolynomial(q.answer.value, q.answer.variables),
            ).toBe(true);
        }
        if (q.answer.kind === 'number' || q.answer.kind === 'polynomial') {
          for (const s of q.answerChecks!.accepted)
            expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
          for (const s of q.answerChecks!.rejected)
            expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(
              false,
            );
        }
      }
  });
  it('rejects unsupported grammar, unsafe text and invalid domains rather than sampling an answer', () => {
    for (const s of [
      'x/x',
      '1/x',
      'x/(x-1)',
      'x/0',
      'x/(1-1)',
      'x^0',
      'x^-1',
      'x^5',
      'x^2^3',
      'x2',
      '2 3',
      'x=2',
      'x+z',
      'Math.random()',
      'x;alert(1)',
      '<script>',
      '1e3',
      '50%',
      'x+',
      '('.repeat(241),
    ])
      expect(parsePolynomial(s), s).toBeNull();
    expect(parsePolynomial('x', ['x', 'x'])).toBeNull();
    expect(parsePolynomial('x', ['x', 'y', 'z'])).toBeNull();
    expect(polynomialValue('x', ['x'], { x: '1/0' })).toBeNull();
    for (const run of [
      () => distribution(7, 1, 1),
      () =>
        termBuckets([
          { id: 'A', coefficient: 1, key: 'x' },
          { id: 'A', coefficient: 2, key: 'x' },
        ]),
      () => storyModel('tickets', 0),
      () => substitutionText('xy', ['x', 'y'], { x: '1' }),
      () => j72ReviewQuestion('J72-L06', 0),
      () => j72ReviewQuestion('J72-L01', -1),
      () => j72ReviewQuestion('J72-L01', 0.5),
      () => j72ReviewQuestion('J72-L01', 100001),
    ])
      expect(run).toThrow(RangeError);
  });
});
