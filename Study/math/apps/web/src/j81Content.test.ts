import { describe, it, expect } from 'vitest';
import {
  j81Lessons,
  j81CheckQuestions,
  j81ReviewQuestion,
} from './content/J81';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  parsePolynomial,
  isFinishedPolynomialProduct,
  polynomialValue,
} from './polynomialModels';
import {
  monomialProduct,
  productGrid,
  singleProduct,
  binomialProduct,
  squareIdentity,
  conjugateIdentity,
  identityProbe,
  partitionGrid,
  squareRemoval,
  differencePieces,
} from './identityModels';
const markdown = import.meta.glob('../../../content/lessons/J81-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j81Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j81CheckQuestions,
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
  for (const [k, v] of pairs) {
    const r = p.get(k)!;
    expect(r, `${raw}:${k}`).toBeTruthy();
    expect(r[0]).toBe(BigInt(v) * r[1]);
  }
}
describe('J81 multiplication, identities and conserved areas', () => {
  it('registers the five planned bilingual lessons with complete bodies, backward prerequisites and stable 358-ID roadmap', () => {
    const units = curriculum.flatMap((s) => s.units),
      planned = units.find((u) => u.id === 'J81')!,
      registry = units.flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j81Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J81.questions).toHaveLength(8);
    for (const l of j81Lessons) {
      expect(l.stage).toBe('J08');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((p) => p.id === id)!;
        expect(p).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j81ReviewQuestion(l.id, 0));
    }
  });
  it('executes every accepted and rejected case for 48 bilingual items and keeps reasoning human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      polynomial: 34,
      number: 2,
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
        expect(checkAnswer('cross terms, area, identity', q.answer)).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently transcribes 36 constructed results and six choices from their stated problems', () => {
    const values = [
      ['-6x^3', '-6x^2y', '-2x^4', '6xy^2', '0', '6x^3'],
      ['2x^2+6x', '-2x^2-5x', '2x^2-3x', '-2xy+2y^2-6y', '0', '6x^3-3x^2+12x'],
      [
        'x^2+5x+6',
        'x^2+3x-10',
        '2x^2-5x-3',
        'x^2+3xy+2y^2',
        'n^2+5n+6',
        'x^2-16',
      ],
      [
        'x^2+6x+9',
        'x^2-8x+16',
        '4x^2+12x+9',
        'x^2-2xy+y^2',
        'x^2/4+2x+4',
        '9x^2-6x+1',
      ],
      ['x^2-9', '4x^2-25', 'x^2-y^2', '9999', 'x^4-4', '9x^2-4'],
    ];
    j81Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      qs.forEach((q, j) =>
        expect(checkAnswer(values[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['6x^2y', '-2x^2+8x', 'x^2-3x-4', '4x^2-4x+1', '9x^2-16', '9996'].forEach(
      (s, i) => expect(checkAnswer(s, j81CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('1', j81CheckQuestions[6]!.answer)).toBe(true);
  });
  it('distinguishes exact equivalence from a finished product without changing previous collection semantics', () => {
    for (const raw of [
      '−6x³',
      '-6*x^3',
      '(-6x^3)',
      '(1/4)x²+2x+4',
      'x²/4+2x+4',
      '6y*x²',
      '0',
      '1/2',
      'x^2+(-3)x',
    ])
      expect(isFinishedPolynomialProduct(raw, ['x', 'y']), raw).toBe(true);
    for (const raw of [
      '(-2x^2)(3x)',
      '-6x^2*x',
      '2*3x',
      'x*x',
      'x²+3x+2x+6',
      '(x+2)(x+3)',
      '0x³',
      'x/0',
      'x^5',
      'x/x',
      'x²+9;alert(1)',
    ])
      expect(isFinishedPolynomialProduct(raw, ['x', 'y']), raw).toBe(false);
    const old = {
      kind: 'polynomial' as const,
      value: '6x^3',
      variables: ['x'],
      collected: true,
    };
    expect(checkAnswer('2x*3x^2', old)).toBe(true);
    expect(checkAnswer('2x*3x^2', { ...old, finishedProduct: true })).toBe(
      false,
    );
    expect(
      checkAnswer('x^2-4', {
        kind: 'polynomial',
        value: 'x^2-4',
        variables: ['x'],
        collected: true,
        finishedProduct: true,
      }),
    ).toBe(true);
  });
  it('independently counts factors and coefficient signs for all 648 bounded monomial products', () => {
    let count = 0;
    for (let a = -4; a <= 4; a++)
      for (let b = -4; b <= 4; b++)
        for (const m of [1, 2])
          for (const n of [1, 2])
            for (const different of [false, true]) {
              const v = monomialProduct(a, b, m, n, different),
                key = 'x'.repeat(m) + (different ? 'y' : 'x').repeat(n);
              coefficients(v.result, { [key]: a * b }, ['x', 'y']);
              expect(v.factors).toHaveLength(m + n);
              expect(v.coefficient).toBe(a * b);
              count++;
            }
    expect(count).toBe(648);
  });
  it('retains all four source pairs including zero and independently verifies 81 signed binomial expansions', () => {
    for (let a = -4; a <= 4; a++)
      for (let b = -4; b <= 4; b++) {
        const m = binomialProduct(a, b);
        expect(m.cells.map((c) => c.id)).toEqual(['0-0', '0-1', '1-0', '1-1']);
        coefficients(m.result, { xx: 1, x: a + b, '': a * b });
        coefficients(m.cells[1]!.text, { x: b });
        coefficients(m.cells[2]!.text, { x: a });
      }
    const p = productGrid(['x', '2', '-3'], ['x', '-4']);
    expect(p.cells).toHaveLength(6);
    coefficients(p.result, { xx: 1, x: -5, '': 4 });
  });
  it('computes every signed outside-factor pair, including fractional and zero cases', () => {
    const expected: Record<string, number>[] = [
      { xx: 2, x: 6 },
      { xx: -2, x: -5 },
      { xx: 2, x: -3 },
      {},
    ];
    expected.forEach((e, i) => {
      const m = singleProduct(i);
      coefficients(m.result, e);
      expect(m.cells).toHaveLength(i === 3 ? 3 : 2);
    });
    expect(singleProduct(3).cells.every((c) => c.text === '0')).toBe(true);
  });
  it('derives square coefficients and demonstrates agreement at zero and disagreement at one for both signs', () => {
    for (let b = 1; b <= 4; b++)
      for (const minus of [false, true]) {
        const m = squareIdentity(b, minus);
        coefficients(m.result, { xx: 1, x: (minus ? -2 : 2) * b, '': b * b });
        expect(m.cells[1]!.text).toBe(m.cells[2]!.text);
        for (let x = -8; x <= 8; x++) {
          const p = identityProbe(b, minus, x);
          expect(p.actual).toBe(String((x + (minus ? -b : b)) ** 2));
          expect(p.missingMiddle).toBe(String(x * x + b * b));
        }
        expect(identityProbe(b, minus, 0).actual).toBe(
          identityProbe(b, minus, 0).missingMiddle,
        );
        expect(identityProbe(b, minus, 1).actual).not.toBe(
          identityProbe(b, minus, 1).missingMiddle,
        );
      }
  });
  it('cancels opposite cross terms and verifies conjugate values independently over signed inputs', () => {
    for (let b = 1; b <= 4; b++) {
      const m = conjugateIdentity(b);
      coefficients(m.result, { xx: 1, '': -b * b });
      coefficients(m.cells[1]!.text, { x: -b });
      coefficients(m.cells[2]!.text, { x: b });
      for (let x = -8; x <= 8; x++)
        expect(polynomialValue(m.result, ['x'], { x: String(x) })).toBe(
          String((x + b) * (x - b)),
        );
    }
  });
  it('preserves areas, lengths and non-overlap through all 15 removal/rearrangement diagrams and 80 partitions', () => {
    for (let x = 4; x <= 8; x++)
      for (let b = 1; b <= 3; b++) {
        const m = differencePieces(x, b),
          r = squareRemoval(x, b);
        expect(r.whole - 2 * r.strip + r.overlap).toBe((x - b) ** 2);
        expect(r.removedOnce + r.remaining).toBe(x * x);
        expect(m.width * m.height).toBe(x * x - b * b);
        expect(m.pieceAreas).toEqual([x * (x - b), b * (x - b)]);
        for (const pieces of [m.before, m.after]) {
          expect(pieces.reduce((s, p) => s + p.width * p.height, 0)).toBe(
            m.area,
          );
          const [a, c] = pieces;
          const overlapX = Math.max(
            0,
            Math.min(a!.x + a!.width, c!.x + c!.width) - Math.max(a!.x, c!.x),
          );
          const overlapY = Math.max(
            0,
            Math.min(a!.y + a!.height, c!.y + c!.height) - Math.max(a!.y, c!.y),
          );
          expect(overlapX * overlapY).toBe(0);
        }
        expect(m.before[1]!.width).toBe(m.after[1]!.height);
        expect(m.before[1]!.height).toBe(m.after[1]!.width);
        expect(m.before[0]).toEqual(m.after[0]);
      }
    for (let x = 2; x <= 6; x++)
      for (let a = 0; a <= 3; a++)
        for (let b = 0; b <= 3; b++) {
          const m = partitionGrid(
            [
              { label: 'x', value: x },
              { label: 'a', value: a },
            ],
            [
              { label: 'x', value: x },
              { label: 'b', value: b },
            ],
          );
          expect(m.cells.reduce((s, c) => s + c.area, 0)).toBe(
            (x + a) * (x + b),
          );
          expect(m.width).toBe(x + b);
          expect(m.height).toBe(x + a);
          for (const c of m.cells) {
            expect(c.x + c.width).toBeLessThanOrEqual(m.width);
            expect(c.y + c.height).toBeLessThanOrEqual(m.height);
          }
        }
  });
  it('independently verifies 400 retrieval variants, exact coefficient maps and every answer check', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 5; i++) {
        const q = j81ReviewQuestion(`J81-L0${i + 1}`, k),
          a = (k % 7) - 3,
          b = 1 + (Math.floor(k / 7) % 5),
          c = (k % 5) - 2,
          u = 1 + (k % 4),
          v = 1 + (Math.floor(k / 4) % 5),
          m = 1 + (k % 2),
          n = 1 + (Math.floor(k / 2) % 2);
        expect(q.answer.kind).toBe('polynomial');
        if (q.answer.kind !== 'polynomial') throw Error('Expected expression');
        if (i === 0)
          coefficients(
            q.answer.value,
            { ['x'.repeat(m) + (k % 3 === 0 ? 'y' : 'x').repeat(n)]: a * b },
            ['x', 'y'],
          );
        else if (i === 1) coefficients(q.answer.value, { xx: a * b, x: a * c });
        else if (i === 2)
          coefficients(q.answer.value, { xx: 1, x: a + c, '': a * c });
        else if (i === 3)
          coefficients(q.answer.value, {
            xx: u * u,
            x: 2 * u * (k % 2 ? -1 : 1) * v,
            '': v * v,
          });
        else coefficients(q.answer.value, { xx: u * u, '': -v * v });
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id}:${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}:${s}`).toBe(false);
      }
    expect(j81ReviewQuestion('J81-L04', 80).stem).toEqual(
      j81ReviewQuestion('J81-L04', 0).stem,
    );
  });
  it('rejects unsupported term sources, sizes, values, ranges and review identities', () => {
    for (const args of [
      [5, 1, 1, 1, false],
      [1, 1, 0, 1, false],
      [1, 1, 1, 3, false],
    ] as const)
      expect(() =>
        monomialProduct(args[0], args[1], args[2], args[3], args[4]),
      ).toThrow();
    expect(() => productGrid(['x+1'], ['x'])).toThrow();
    expect(() => productGrid([], ['x'])).toThrow();
    expect(() => productGrid(['x^3'], ['x^2'])).toThrow();
    expect(() => singleProduct(4)).toThrow();
    expect(() => binomialProduct(0, 5)).toThrow();
    expect(() => squareIdentity(0, false)).toThrow();
    expect(() => conjugateIdentity(5)).toThrow();
    expect(() => identityProbe(2, false, NaN)).toThrow();
    expect(() =>
      partitionGrid([{ label: 'x', value: -1 }], [{ label: 'y', value: 2 }]),
    ).toThrow();
    expect(() =>
      partitionGrid([{ label: 'x', value: 0 }], [{ label: 'y', value: 2 }]),
    ).toThrow();
    expect(() => squareRemoval(3, 3)).toThrow();
    expect(() => differencePieces(5, 4)).toThrow();
    for (const id of ['J81-L00', 'J81-L06', 'J76-L01'])
      expect(() => j81ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j81ReviewQuestion('J81-L01', n)).toThrow();
  });
});
