import { describe, it, expect } from 'vitest';
import {
  p55Lessons,
  p55CheckQuestions,
  p55ReviewQuestion,
} from './content/P55';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  solveEarlyEquation,
  equationSides,
  equationQuantity,
  rationalText,
  equationWorking,
  changeBalance,
  balanceValues,
  patternPieces,
  patternRule,
  type EarlyEquation,
} from './equationModels';
const markdown = import.meta.glob('../../../content/lessons/P55-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...p55Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p55CheckQuestions,
];
// Separate number-based rational oracle for bounded authored examples; no workshop solver calls.
type R = [number, number];
const parse = (s: string): R => {
  if (s.includes('/')) {
    const [n, d] = s.split('/').map(Number);
    return [n!, d!];
  }
  const places = s.split('.')[1]?.length ?? 0;
  return [Number(s.replace('.', '')), 10 ** places];
};
const calc = (kind: EarlyEquation['kind'], x: R, a: R): R =>
  kind === 'add'
    ? [x[0] * a[1] + a[0] * x[1], x[1] * a[1]]
    : kind === 'subtract'
      ? [x[0] * a[1] - a[0] * x[1], x[1] * a[1]]
      : kind === 'subtract-from'
        ? [a[0] * x[1] - x[0] * a[1], a[1] * x[1]]
        : kind === 'multiply'
          ? [x[0] * a[0], x[1] * a[1]]
          : [x[0] * a[1], x[1] * a[0]];
const equal = (a: R, b: R) => a[0] * b[1] === b[0] * a[1];
const fixtures: Record<string, [EarlyEquation['kind'], string, string]> = {
  'P55-L01-G': ['add', '7', '19'],
  'P55-L01-Q2': ['subtract-from', '24', '9'],
  'P55-L01-Q3': ['multiply', '4', '28'],
  'P55-L01-Q4': ['divide', '5', '6'],
  'P55-L01-Q5': ['add', '6', '6'],
  'P55-L01-X': ['add', '8', '23'],
  'P55-L02-G': ['add', '5', '12'],
  'P55-L02-Q2': ['add', '9', '15'],
  'P55-L02-Q3': ['add', '8', '17'],
  'P55-L02-Q4': ['add', '7', '16'],
  'P55-L02-Q5': ['add', '6', '17'],
  'P55-L02-X': ['add', '9', '18'],
  'P55-L04-G': ['add', '7', '19'],
  'P55-L04-Q2': ['subtract', '8', '14'],
  'P55-L04-Q3': ['multiply', '4', '5'],
  'P55-L04-Q4': ['divide', '5', '6'],
  'P55-L04-Q5': ['add', '1/4', '1'],
  'P55-L04-X': ['subtract', '1.25', '2.75'],
  'P55-L05-G': ['add', '7', '19'],
  'P55-L05-Q2': ['subtract', '1.25', '2.75'],
  'P55-L05-Q3': ['multiply', '4', '5'],
  'P55-L05-Q4': ['multiply', '6', '48'],
  'P55-L05-Q5': ['subtract', '1/4', '3/4'],
  'P55-L05-X': ['subtract', '9', '17'],
  'P55-CHECK-Q1': ['subtract-from', '30', '12'],
  'P55-CHECK-Q2': ['add', '6', '14'],
  'P55-CHECK-Q4': ['divide', '4', '3'],
  'P55-CHECK-Q6': ['multiply', '5', '35'],
  'P55-CHECK-Q7': ['subtract', '2.40', '3.60'],
};
const patternFixtures: Record<string, ['squares' | 'counters', number]> = {
  'P55-L03-G': ['squares', 4],
  'P55-L03-Q2': ['squares', 10],
  'P55-L03-Q3': ['counters', 5],
  'P55-L03-Q4': ['squares', 8],
  'P55-L03-Q5': ['counters', 6],
  'P55-L03-X': ['squares', 20],
  'P55-CHECK-Q3': ['squares', 7],
};
const edgeOracle = (n: number) => {
  const edges = new Set<string>();
  for (let i = 0; i < n; i++) {
    edges.add(`${i},0-${i + 1},0`);
    edges.add(`${i},1-${i + 1},1`);
    edges.add(`${i},0-${i},1`);
    edges.add(`${i + 1},0-${i + 1},1`);
  }
  return edges;
};
describe('P55 content and independent mathematics', () => {
  it('matches the five planned titles, full bilingual examples and backward prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P55')!;
    expect(p55Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(p55Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p55Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
      for (const copy of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh).toBeTruthy();
        expect(copy.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const previous = [...lessons, ...p55Lessons].find((l) => l.id === id);
        expect(previous, `${l.id}→${id}`).toBeTruthy();
        if (previous!.unit === 'P55')
          expect(previous!.order).toBeLessThan(l.order!);
      }
    }
    expect(p55Lessons[4]!.familyChallenge!.en).toContain('No real purchase');
  });
  it('verifies all 48 item cases, hints, specific choice feedback and manual reasoning without word grading', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.id)).size).toBe(48);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      6,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags).toContain(q.skill);
      for (const copy of [
        q.stem,
        q.solution,
        ...q.solutionSteps!,
        ...q.hints,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
        continue;
      }
      q.answerChecks!.accepted.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: accepts ${v}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: rejects ${v}`).toBe(false),
      );
      if (q.options)
        for (const o of q.options) {
          expect(o.feedback.zh).toBeTruthy();
          expect(o.feedback.en).toBeTruthy();
        }
    }
  });
  it('independently substitutes all 29 equation answers and deduplicates geometry for seven pattern answers', () => {
    for (const q of questions) {
      if (q.answer.kind !== 'number') continue;
      const value = parse(q.answer.value);
      if (fixtures[q.id]) {
        const [kind, a, b] = fixtures[q.id]!;
        expect(equal(calc(kind, value, parse(a)), parse(b)), q.id).toBe(true);
      } else {
        const [kind, n] = patternFixtures[q.id]!;
        expect(n, q.id).toBeTruthy();
        const expected =
          kind === 'squares'
            ? edgeOracle(n).size
            : Array.from({ length: n }, (_, i) => [i, i + n]).flat().length + 1;
        expect(value[0], q.id).toBe(expected * value[1]);
      }
    }
    expect(Object.keys(fixtures)).toHaveLength(29);
    expect(Object.keys(patternFixtures)).toHaveLength(7);
  });
  it('accepts exact fraction/decimal quantities and appropriate units, but rejects approximation, percentages and wrong objects', () => {
    const fraction = p55Lessons[3]!.questions[2]!.answer;
    for (const v of ['5/4', '10/8', '1.25', '1 1/4'])
      expect(checkAnswer(v, fraction)).toBe(true);
    for (const v of ['1', '1.2', '125%'])
      expect(checkAnswer(v, fraction)).toBe(false);
    const length = p55Lessons[4]!.questions[2]!.answer;
    for (const v of ['5/4 m', '1.25 米'])
      expect(checkAnswer(v, length)).toBe(true);
    expect(checkAnswer('1.25 L', length)).toBe(false);
    const sticks = p55Lessons[2]!.guided.answer;
    for (const v of ['13 sticks', '13 根小棒', '13 根', '26/2'])
      expect(checkAnswer(v, sticks)).toBe(true);
    expect(checkAnswer('13 m', sticks)).toBe(false);
    const cards = p55Lessons[4]!.guided.answer;
    expect(checkAnswer('12 张卡', cards)).toBe(true);
    expect(checkAnswer('12 bags', cards)).toBe(false);
  });
  it('independently checks 400 retrieval evaluations with changed relations, pattern constructs and stable IDs', () => {
    for (const l of p55Lessons) {
      expect(p55ReviewQuestion(l.id, 0).stem).not.toEqual(
        p55ReviewQuestion(l.id, 1).stem,
      );
      for (let round = 0; round < 80; round++) {
        const q = p55ReviewQuestion(l.id, round);
        expect(q.id).toBe(`${l.id}-R${round}`);
        expect(q.lessonId).toBe(l.id);
        expect(q.answer.kind).toBe('number');
        if (q.answer.kind !== 'number') continue;
        const value = parse(q.answer.value),
          diagram = q.diagram!;
        if (diagram.kind === 'equation-board')
          expect(
            equal(
              calc(diagram.equation.kind, value, parse(diagram.equation.a)),
              parse(diagram.equation.b),
            ),
            q.id,
          ).toBe(true);
        else if (diagram.kind === 'growing-pattern') {
          const expected =
            diagram.pattern === 'squares'
              ? edgeOracle(diagram.n).size
              : 2 * diagram.n + 1;
          expect(value[0], q.id).toBe(expected * value[1]);
        } else throw new Error('Missing review model');
        q.answerChecks!.accepted.forEach((v) =>
          expect(checkAnswer(v, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id} rejects ${v}`).toBe(false),
        );
      }
    }
    for (const round of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
      expect(() => p55ReviewQuestion('P55-L01', round)).toThrow();
    expect(() => p55ReviewQuestion('P55-L09', 0)).toThrow();
  });
});
describe('P55 exact equation and drawing models', () => {
  it('solves every small supported form and verifies the original independently, including reversed equality and negative algebraic solutions', () => {
    for (const kind of [
      'add',
      'subtract',
      'subtract-from',
      'multiply',
      'divide',
    ] as const)
      for (let a = 0; a <= 10; a++)
        for (let b = 0; b <= 30; b++) {
          const eq = { kind, a: String(a), b: String(b) };
          if (kind === 'divide' && a === 0) {
            expect(() => solveEarlyEquation(eq)).toThrow();
            continue;
          }
          const solved = solveEarlyEquation(eq);
          if (kind === 'multiply' && a === 0) {
            expect(solved.status).toBe(b === 0 ? 'all' : 'none');
            continue;
          }
          expect(solved.status).toBe('one');
          if (solved.status !== 'one') continue;
          const value = rationalText(solved.value);
          expect(equal(calc(kind, parse(value), [a, 1]), [b, 1])).toBe(true);
          expect(equationSides(eq, value).equal).toBe(true);
          const reverse = equationSides({ ...eq, reversed: true }, value);
          expect(reverse.equal).toBe(true);
          expect(rationalText(reverse.left)).toBe(String(b));
          expect(equationWorking(eq).at(-1)).toBe(`x = ${value}`);
        }
  });
  it('retains exact fractional trials and correctly separates every-value and no-value cases without dividing by zero', () => {
    const boundaryCases: [EarlyEquation, [bigint, bigint]][] = [
      [{ kind: 'add', a: '1/9999', b: '1/9998' }, [1n, 9999n * 9998n]],
      [{ kind: 'multiply', a: '1/10000', b: '10000' }, [100000000n, 1n]],
      [{ kind: 'divide', a: '10000', b: '10000' }, [100000000n, 1n]],
      [
        { kind: 'multiply', a: '99999999/10000', b: '1/9999' },
        [10000n, 9999n * 99999999n],
      ],
    ];
    for (const [eq, expected] of boundaryCases) {
      const solved = solveEarlyEquation(eq);
      expect(solved).toEqual({ status: 'one', value: expected });
      expect(equationSides(eq, rationalText(expected)).equal).toBe(true);
    }
    const thirds = { kind: 'multiply' as const, a: '3', b: '1' };
    expect(solveEarlyEquation(thirds)).toEqual({
      status: 'one',
      value: [1n, 3n],
    });
    expect(equationSides(thirds, '1/3').equal).toBe(true);
    expect(equationSides(thirds, '0.333').equal).toBe(false);
    for (const x of ['-2', '0', '1', '17/4']) {
      expect(equationSides({ kind: 'multiply', a: '0', b: '0' }, x).equal).toBe(
        true,
      );
      expect(equationSides({ kind: 'multiply', a: '0', b: '5' }, x).equal).toBe(
        false,
      );
    }
    expect(solveEarlyEquation({ kind: 'add', a: '1/4', b: '1' })).toEqual({
      status: 'one',
      value: [3n, 4n],
    });
  });
  it('proves that identical balance changes preserve the difference and rejects impossible removal without mutation', () => {
    const initial = {
      left: { boxes: 2, known: 6 },
      right: { boxes: 1, known: 10 },
    };
    for (const action of [
      'add-unit',
      'remove-unit',
      'add-box',
      'remove-box',
    ] as const)
      for (let x = 0; x <= 20; x++) {
        const before = balanceValues(initial, x),
          next = changeBalance(initial, action, 'both'),
          after = balanceValues(next, x);
        expect(after.left - after.right).toBe(before.left - before.right);
      }
    const changed = changeBalance(initial, 'add-unit', 'left');
    expect(balanceValues(changed, 4).relation).toBe('left-more');
    expect(balanceValues(initial, 4).relation).toBe('equal');
    const addedBox = changeBalance(initial, 'add-box', 'left');
    expect(
      balanceValues(addedBox, 0).left - balanceValues(addedBox, 0).right,
    ).toBe(balanceValues(initial, 0).left - balanceValues(initial, 0).right);
    expect(
      balanceValues(addedBox, 4).left - balanceValues(addedBox, 4).right,
    ).not.toBe(0);
    const empty = {
      left: { boxes: 1, known: 0 },
      right: { boxes: 0, known: 0 },
    };
    expect(() => changeBalance(empty, 'remove-unit', 'both')).toThrow();
    expect(() => changeBalance(empty, 'remove-box', 'both')).toThrow();
    expect(empty).toEqual({
      left: { boxes: 1, known: 0 },
      right: { boxes: 0, known: 0 },
    });
  });
  it('draws each shared edge once with equal unit lengths and counts real row-plus-extra counters through thirty steps', () => {
    for (let n = 1; n <= 30; n++) {
      const square = patternPieces('squares', n);
      expect(square.count).toBe(edgeOracle(n).size);
      expect(
        new Set(square.segments.map((s) => `${s.x1},${s.y1}-${s.x2},${s.y2}`)),
      ).toEqual(edgeOracle(n));
      for (const s of square.segments)
        expect(Math.abs(s.x1 - s.x2) + Math.abs(s.y1 - s.y2)).toBe(1);
      const dots = patternPieces('counters', n);
      expect(dots.counters).toHaveLength(2 * n + 1);
      expect(dots.counters.filter((c) => c.extra)).toHaveLength(1);
      expect(
        new Set(dots.counters.map((c) => `${c.column},${c.row}`)).size,
      ).toBe(2 * n + 1);
    }
    expect(patternRule('squares', '4n')).toBe(false);
    expect(patternRule('squares', 'n+3')).toBe(false);
    expect(patternRule('squares', '1+3n')).toBe(true);
    expect(patternRule('counters', '1+2n')).toBe(true);
  });
  it('rejects malformed, out-of-domain and zero-divisor inputs instead of evaluating arbitrary expressions', () => {
    for (const v of [
      '1/0',
      '1+2',
      'NaN',
      '100000001',
      '1/1000000000001',
      '0.1%',
      '2**3',
    ])
      expect(() => equationQuantity(v)).toThrow();
    expect(() =>
      solveEarlyEquation({ kind: 'add', a: '10001', b: '2' }),
    ).toThrow();
    expect(() =>
      solveEarlyEquation({ kind: 'add', a: '1/10001', b: '1' }),
    ).toThrow();
    for (const n of [0, -1, 0.5, 31])
      expect(() => patternPieces('squares', n)).toThrow();
    expect(() =>
      solveEarlyEquation({ kind: 'divide', a: '0', b: '1' }),
    ).toThrow();
    expect(() =>
      solveEarlyEquation({ kind: 'add', a: '-1', b: '2' }),
    ).toThrow();
    expect(() =>
      solveEarlyEquation({ kind: 'power' as 'add', a: '2', b: '4' }),
    ).toThrow();
    expect(() =>
      balanceValues(
        { left: { boxes: 9, known: 0 }, right: { boxes: 0, known: 0 } },
        1,
      ),
    ).toThrow();
  });
});
