import { describe, it, expect } from 'vitest';
import {
  j83Lessons,
  j83CheckQuestions,
  j83ReviewQuestion,
} from './content/J83';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  basicBounds,
  coordinateText,
  type PlotBounds,
} from './cartesianModels';
import {
  systemRow,
  parseSystemRow,
  parseLinearSystem,
  rowText,
  systemText,
  sameSystemRelation,
  checkSystemModel,
  solveSystem,
  sameSystemSolutions,
  checkSystemClass,
  auditSystemPair,
  isolateSystemVariable,
  substitutionTrace,
  replaceSystemRow,
  systemLineSegment,
  pointInSystemWindow,
  relationSystems,
  substitutionSystems,
  eliminationSystems,
  graphSystems,
  firstRelationSamples,
  systemContext,
  auditSystemContext,
  systemFromPoint,
} from './systemModels';
const markdown = import.meta.glob('../../../content/lessons/J83-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j83Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j83CheckQuestions,
];
const source = (s: string) => parseLinearSystem(s)!;
const num = (r: readonly bigint[]) => Number(r[0]) / Number(r[1]);
function pairValue(
  answer: ReturnType<typeof solveSystem>,
  x: number,
  y: number,
) {
  expect(answer.kind).toBe('one');
  if (answer.kind !== 'one') throw Error('Unique');
  expect(answer.point[0][0]).toBe(BigInt(x) * answer.point[0][1]);
  expect(answer.point[1][0]).toBe(BigInt(y) * answer.point[1][1]);
}
describe('J83 simultaneous systems, exact methods and contextual domains', () => {
  it('registers five planned bilingual lessons and complete graph tasks with stable prerequisites and 358 IDs', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons),
      planned = units.find((u) => u.id === 'J83')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j83Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J83.questions).toHaveLength(8);
    for (const l of j83Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.stage).toBe('J08');
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(j83ReviewQuestion(l.id, 0));
    }
    for (const q of [
      j83Lessons[3]!.guided,
      ...j83Lessons[3]!.questions.slice(1, 5),
      j83Lessons[3]!.exit,
    ]) {
      expect(q.diagram?.kind).toBe('cartesian');
      if (q.diagram?.kind === 'cartesian') {
        expect(q.diagram.curves).toHaveLength(2);
        expect(q.diagram.curves![1]!.dash).toBe('7 4');
        expect(q.diagram.points).toHaveLength(0);
      }
    }
  });
  it('executes all accepted and rejected cases for 48 bilingual items while keeping explanations human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      coordinate: 20,
      'linear-system': 4,
      'system-class': 9,
      number: 2,
      expression: 1,
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
          checkAnswer('same pair, eliminate, graph, domain', q.answer),
        ).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently transcribes 36 constructed results and six choices from the stated problems', () => {
    const values = [
      ['(4,3)', '(2,2)', 'x-y=2;x+y=8', '(1,2)', '9', '(6,3)'],
      [
        '(4,3)',
        '1-2x',
        '(1/3,1/3)',
        'infinitely many solutions',
        'no solution',
        '(3,5)',
      ],
      ['(4,3)', '(2,3)', '13', 'infinite', 'none', '(3,2)'],
      ['(3,2)', 'none', 'infinite', '(2,3)', '(0.5,0.5)', '(7,5)'],
      [
        '5x+3y=29;x+y=7',
        '(4,3)',
        '(9/2,5/2)',
        'no allowed solution',
        '(4.5,2.5)',
        '6x+2y=32;x+y=8',
      ],
    ];
    j83Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      qs.forEach((q, j) =>
        expect(checkAnswer(values[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([2, 1, 0, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    [
      '(5,4)',
      '4x+2y=18;x+y=6',
      '(3,1)',
      'none',
      'infinite',
      '(3/2,7/2)',
    ].forEach((s, i) =>
      expect(checkAnswer(s, j83CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('1', j83CheckQuestions[6]!.answer)).toBe(true);
  });
  it('parses exact two-variable relations while preserving original modelling constraints instead of only final values', () => {
    const expected = 'x+y=7;5x+3y=29';
    for (const raw of [
      '5x+3y=29;y+x=7',
      '2x+2y=14;10x+6y=58',
      '{7=x+y；29=3y+5x}',
      'x+y-7=0\n5x+3y-29=0',
    ])
      expect(checkSystemModel(raw, expected), raw).toBe(true);
    expect(sameSystemSolutions(source('x=4;y=3'), source(expected))).toBe(true);
    for (const raw of [
      'x=4;y=3',
      'x+y=7;x+y=7',
      '0=0;5x+3y=29',
      'x+y=7',
      'x+y=7;;5x+3y=29',
    ])
      expect(checkSystemModel(raw, expected), raw).toBe(false);
    const row = parseSystemRow('x/2+y=3/2')!;
    expect(row).toEqual(systemRow('1/2', '1', '3/2'));
    expect(sameSystemRelation(row, parseSystemRow('x+2y=3')!)).toBe(true);
    expect(parseLinearSystem(systemText(source(expected)))).toEqual(
      source(expected),
    );
    expect(parseSystemRow(rowText(row))).toEqual(row);
    for (const raw of [
      'xy=1',
      'x^2+y=1',
      'x/y=1',
      'z+y=2',
      'x=1=2',
      'x+y=alert(1)',
      'x+y=1/0',
    ])
      expect(parseSystemRow(raw), raw).toBeNull();
  });
  it('distinguishes infinitely many line pairs from every pair and handles identity/contradiction rows explicitly', () => {
    for (const raw of [
      'infinite',
      'infinitely many pairs',
      'infinitely many solutions',
      '无穷多解',
    ])
      expect(checkSystemClass(raw, 'infinite')).toBe(true);
    for (const raw of ['all', 'all pairs', '所有数对', '(2,2)', 'many'])
      expect(checkSystemClass(raw, 'infinite')).toBe(false);
    for (const raw of [
      'none',
      'no solution',
      'no allowed solution',
      '无解',
      '∅',
    ])
      expect(checkSystemClass(raw, 'none')).toBe(true);
    const line = source('x+y=4;2x+2y=8');
    expect(solveSystem(line)).toMatchObject({ kind: 'infinite', rank: 1 });
    expect(auditSystemPair(line, '(0,0)')!.pass).toBe(false);
    expect(auditSystemPair(line, '(0,4)')!.pass).toBe(true);
    expect(solveSystem(source('0=0;0=0'))).toEqual({
      kind: 'infinite',
      rank: 0,
    });
    expect(solveSystem(source('0=1;x+y=4'))).toEqual({ kind: 'none' });
    expect(sameSystemSolutions(source('x+y=4;0=0'), line)).toBe(true);
    expect(sameSystemSolutions(source('x+y=5;0=0'), line)).toBe(false);
    expect(sameSystemSolutions(source('0=0;0=0'), line)).toBe(false);
  });
  it('independently recovers bounded integer pairs from every nonsingular small coefficient matrix', () => {
    let count = 0;
    for (let a = -2; a <= 2; a++)
      for (let b = -2; b <= 2; b++)
        for (let d = -2; d <= 2; d++)
          for (let e = -2; e <= 2; e++) {
            const determinant = a * e - b * d;
            if (!determinant) continue;
            for (let x = -2; x <= 2; x++)
              for (let y = -2; y <= 2; y++) {
                const rows = systemFromPoint(x, y, a, b, d, e),
                  answer = solveSystem(rows);
                pairValue(answer, x, y);
                if (answer.kind === 'one') {
                  expect(answer.determinant[0]).toBe(
                    BigInt(determinant) * answer.determinant[1],
                  );
                  expect(
                    auditSystemPair(rows, coordinateText(answer.point))!.pass,
                  ).toBe(true);
                }
                count++;
              }
          }
    expect(count).toBeGreaterThan(10000);
  });
  it('independently classifies all 729 small augmented systems by coefficient and augmented ranks', () => {
    let count = 0;
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++)
          for (let d = -1; d <= 1; d++)
            for (let e = -1; e <= 1; e++)
              for (let f = -1; f <= 1; f++) {
                const rank = a * e - b * d !== 0 ? 2 : a || b || d || e ? 1 : 0,
                  aug =
                    a * e - b * d || a * f - c * d || b * f - c * e
                      ? 2
                      : a || b || c || d || e || f
                        ? 1
                        : 0,
                  expected =
                    rank < aug ? 'none' : rank === 2 ? 'one' : 'infinite',
                  answer = solveSystem([
                    systemRow(String(a), String(b), String(c)),
                    systemRow(String(d), String(e), String(f)),
                  ]);
                expect(answer.kind, `${a},${b},${c};${d},${e},${f}`).toBe(
                  expected,
                );
                if (answer.kind === 'infinite') expect(answer.rank).toBe(rank);
                count++;
              }
    expect(count).toBe(729);
  });
  it('checks candidates in both equations and labels sampled integer pairs without claiming a complete real set', () => {
    expect(
      auditSystemPair(relationSystems[0]!, '(2,5)')!.rows.map((r) => [
        num(r.left),
        num(r.right),
        r.pass,
      ]),
    ).toEqual([
      [7, 7, true],
      [9, 11, false],
    ]);
    expect(auditSystemPair(relationSystems[0]!, '(4,3)')!.pass).toBe(true);
    expect(auditSystemPair(relationSystems[0]!, '4')).toBeNull();
    for (const s of relationSystems) {
      const pairs = firstRelationSamples(s[0]);
      expect(pairs).toHaveLength(10);
      expect(
        pairs.every(
          (p) => auditSystemPair(s, coordinateText(p))!.rows[0]!.pass,
        ),
      ).toBe(true);
      expect(
        pairs.filter((p) => auditSystemPair(s, coordinateText(p))!.pass),
      ).toHaveLength(1);
    }
  });
  it('derives complete substitutions for either isolated variable, including exact fractions and zero-row cases', () => {
    for (const s of substitutionSystems)
      for (const target of ['x', 'y'] as const) {
        const trace = substitutionTrace(s, target),
          sol = solveSystem(s);
        expect(trace.kind).toBe(sol.kind);
        if (trace.kind === 'one') {
          expect(auditSystemPair(s, coordinateText(trace.point!))!.pass).toBe(
            true,
          );
          expect(trace.otherValue).not.toBeNull();
        } else expect(trace.a[0]).toBe(0n);
      }
    expect(isolateSystemVariable(source('2x+y=1;x-y=0')[0], 'y')).toMatchObject(
      { k: [-2n, 1n], b: [1n, 1n] },
    );
    expect(substitutionTrace(substitutionSystems[1]!, 'y').point).toEqual([
      [1n, 3n],
      [1n, 3n],
    ]);
    expect(substitutionTrace(substitutionSystems[2]!, 'y').c[0]).toBe(0n);
    expect(substitutionTrace(substitutionSystems[3]!, 'y').c[0]).not.toBe(0n);
  });
  it('verifies every coefficient in 392 row combinations and allows replacement only when recoverable', () => {
    let count = 0;
    for (const m of eliminationSystems)
      for (let k1 = -3; k1 <= 3; k1++)
        for (let k2 = -3; k2 <= 3; k2++)
          for (const replace of [0, 1] as const) {
            const r = replaceSystemRow(m.rows, replace, String(k1), String(k2));
            expect(r.valid).toBe((replace === 0 ? k1 : k2) !== 0);
            for (const key of ['a', 'b', 'c'] as const)
              expect(r.combined[key][0]).toBe(
                (BigInt(k1) * m.rows[0][key][0] +
                  BigInt(k2) * m.rows[1][key][0]) *
                  r.combined[key][1],
              );
            if (r.valid) {
              expect(r.rows[1 - replace]).toBe(m.rows[1 - replace]);
              expect(sameSystemSolutions(m.rows, r.rows)).toBe(true);
              const factor = replace === 0 ? k1 : k2,
                other = replace === 0 ? k2 : k1;
              for (const key of ['a', 'b', 'c'] as const)
                expect(
                  r.combined[key][0] -
                    BigInt(other) * m.rows[1 - replace]![key][0],
                ).toBe(BigInt(factor) * m.rows[replace][key][0]);
            }
            count++;
          }
    expect(count).toBe(392);
    const dropped = source('x-y=1;x-y=1');
    expect(auditSystemPair(dropped, '(1,0)')!.pass).toBe(true);
    expect(auditSystemPair(eliminationSystems[0]!.rows, '(1,0)')!.pass).toBe(
      false,
    );
  });
  it('clips oblique, vertical and horizontal lines by values while keeping exact off-window and fractional intersections', () => {
    const wide: PlotBounds = {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      xStep: 2,
      yStep: 2,
    };
    for (const s of graphSystems)
      for (const bounds of [basicBounds, wide])
        for (const row of s) {
          const points = systemLineSegment(row, bounds);
          expect(points.length === 0 || points.length === 2).toBe(true);
          for (const p of points) {
            expect(p.x).toBeGreaterThanOrEqual(bounds.xMin - 1e-9);
            expect(p.x).toBeLessThanOrEqual(bounds.xMax + 1e-9);
            expect(p.y).toBeGreaterThanOrEqual(bounds.yMin - 1e-9);
            expect(p.y).toBeLessThanOrEqual(bounds.yMax + 1e-9);
            expect(
              Math.abs(num(row.a) * p.x + num(row.b) * p.y - num(row.c)),
            ).toBeLessThan(1e-9);
          }
        }
    expect(systemLineSegment(graphSystems[3]![0], basicBounds)).toEqual([
      { x: 2, y: -5 },
      { x: 2, y: 5 },
    ]);
    const out = solveSystem(graphSystems[4]!);
    pairValue(out, 7, 5);
    if (out.kind === 'one') {
      expect(pointInSystemWindow(out.point, basicBounds)).toBe(false);
      expect(pointInSystemWindow(out.point, wide)).toBe(true);
    }
    expect(solveSystem(graphSystems[5]!)).toMatchObject({
      kind: 'one',
      point: [
        [1n, 2n],
        [1n, 2n],
      ],
    });
  });
  it('keeps algebraic validity separate from nonnegative integer counts and continuous quantities', () => {
    const tickets = systemContext('tickets'),
      fractional = systemContext('fractional-tickets'),
      juice = systemContext('juice');
    expect(
      auditSystemContext(tickets.rows, '(4,3)', tickets.rule),
    ).toMatchObject({ pass: true, contextPass: true, accepted: true });
    expect(
      auditSystemContext(fractional.rows, '(9/2,5/2)', fractional.rule),
    ).toMatchObject({
      pass: true,
      integer: false,
      contextPass: false,
      accepted: false,
    });
    expect(
      auditSystemContext(juice.rows, '(9/2,5/2)', juice.rule),
    ).toMatchObject({
      pass: true,
      integer: false,
      contextPass: true,
      accepted: true,
    });
    expect(sameSystemSolutions(fractional.rows, juice.rows)).toBe(true);
    const rounded = auditSystemContext(
      fractional.rows,
      '(5,2)',
      fractional.rule,
    )!;
    expect(num(rounded.rows[1]!.left)).toBe(31);
    expect(rounded.pass).toBe(false);
    expect(
      auditSystemContext(source('x=-1;y=2'), '(-1,2)', 'nonnegative'),
    ).toMatchObject({ pass: true, nonnegative: false, accepted: false });
  });
  it('independently verifies all 400 retrieval variants, original relationship models and accepted/rejected inputs', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 5; i++) {
        const q = j83ReviewQuestion(`J83-L0${i + 1}`, k),
          a = (k % 9) - 4,
          b = (Math.floor(k / 9) % 9) - 4,
          n = (k % 7) - 3,
          d = [1, 2, 3][k % 3]!;
        let expected: string;
        if (i === 0) expected = `(${a},${b})`;
        else if (i === 1) expected = `(${n}/${d},${d - 2 * n}/${d})`;
        else if (i === 2)
          expected =
            k % 4 === 1 ? 'infinite' : k % 4 === 2 ? 'none' : `(${a},${b})`;
        else if (i === 3)
          expected =
            k % 5 === 1
              ? 'none'
              : k % 5 === 2
                ? 'infinite'
                : k % 5 === 4
                  ? `(${n}/${d},${d - n}/${d})`
                  : `(${a},${b})`;
        else {
          const total = 8 + (k % 5),
            adult = 1 + (k % 5);
          expected = `5x+3y=${3 * total + 2 * adult};x+y=${total}`;
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.accepted)
          expect(checkAnswer(raw, q.answer), `${q.id}:${raw}`).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer), `${q.id}:${raw}`).toBe(false);
      }
    expect(j83ReviewQuestion('J83-L04', 80).stem).toEqual(
      j83ReviewQuestion('J83-L04', 0).stem,
    );
  });
  it('rejects unsupported syntax, isolation pivots, transformations, sources and review identities', () => {
    for (const raw of ['x=1;y=2;z=3', '{x=1;y=2', 'x=1;y=2;', 'x=1\n\ny=2'])
      expect(parseLinearSystem(raw)).toBeNull();
    expect(() =>
      isolateSystemVariable(systemRow('1', '0', '2'), 'y'),
    ).toThrow();
    expect(() =>
      replaceSystemRow(relationSystems[0]!, 2 as 0, '1', '1'),
    ).toThrow();
    expect(() => systemContext('unknown' as 'tickets')).toThrow();
    expect(() => systemFromPoint(0, 0, 1, 1, 2, 2)).toThrow();
    expect(() => systemFromPoint(13, 0, 1, 0, 0, 1)).toThrow();
    for (const id of ['J83-L00', 'J83-L06', 'J82-L01'])
      expect(() => j83ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j83ReviewQuestion('J83-L01', n)).toThrow();
  });
});
