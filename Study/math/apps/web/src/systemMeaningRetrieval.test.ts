import { describe, expect, it } from 'vitest';
import { systemMeaningRetrieval } from './content/systemMeaningRetrieval';
import { polynomialSystemRecurrence } from './content/polynomialSystemRecurrence';
import { geometryGraphRetrieval } from './content/geometryGraphRetrieval';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import { textR } from './algebraModels';
import {
  parseLinearSystem,
  auditSystemPair,
  solveSystem,
  substitutionTrace,
  combineSystemRows,
  replaceSystemRow,
  sameSystemSolutions,
  checkSystemModel,
  auditSystemContext,
  pointInSystemWindow,
} from './systemModels';

const sets = Object.values(systemMeaningRetrieval);
const raw = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const system = (s: string) => parseLinearSystem(s)!;
const point = (s: string) => {
  const result = solveSystem(system(s));
  expect(result.kind).toBe('one');
  if (result.kind !== 'one') throw Error('Expected unique source');
  return result.point.map(textR);
};

describe('J83 exact pairs, complete row operations and quantity models', () => {
  it('keeps fourteen original references/four tasks, adds six shared tasks and reuses the actual sixth axis cards', () => {
    const entries = polynomialSystemRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J83-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(12);
    expect(
      refs.filter((id) => id.includes('-MAINT-POLY-SYSTEM-')),
    ).toHaveLength(14);
    expect(entries[3]!.targets).toEqual([
      'J95-MAINT-POLY-SYSTEM-Q10',
      'J96-MAINT-POLY-SYSTEM-Q10',
      'J93-MAINT-REASONS-Q6',
      'J94-MAINT-REASONS-Q6',
    ]);
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J83-L02',
        'J83-L03',
        'J83-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('checks each given candidate, component-spliced pair and reversed exact pair against BOTH original rows', () => {
    for (const c of [
      {
        i: 0,
        exact: '(1/3,-2/3)',
        reverse: '(-2/3,1/3)',
        p: ['0', '3'],
        q: ['5', '1'],
        reversed: ['-1', '-1'],
      },
      {
        i: 1,
        exact: '(-1/3,2/3)',
        reverse: '(2/3,-1/3)',
        p: ['1', '1'],
        q: ['2', '-1'],
        reversed: ['0', '1'],
      },
    ]) {
      const original = system(raw(c.i, 1, 'S'));
      const P = auditSystemPair(original, raw(c.i, 1, 'P'))!,
        Q = auditSystemPair(original, raw(c.i, 1, 'Q'))!;
      expect(P.rows.map((r) => textR(r.left))).toEqual(c.p);
      expect(Q.rows.map((r) => textR(r.left))).toEqual(c.q);
      expect(P.rows.map((r) => r.pass)).toEqual([true, false]);
      expect(Q.rows.map((r) => r.pass)).toEqual([false, true]);
      const mix = `(${textR(P.point[0])},${textR(Q.point[1])})`;
      expect(mix).toBe('(1,1)');
      expect(auditSystemPair(original, mix)!.rows.map((r) => r.pass)).toEqual([
        false,
        false,
      ]);
      expect(auditSystemPair(original, c.exact)!.pass).toBe(true);
      expect(
        auditSystemPair(original, c.reverse)!.rows.map((r) => textR(r.left)),
      ).toEqual(c.reversed);
      expect(auditSystemPair(original, c.reverse)!.pass).toBe(false);
    }
  });
  it('reaches the same exact thirds through both isolation directions without using truncated decimal equality', () => {
    for (const [i, expected] of [
      [0, ['1/3', '-2/3']],
      [1, ['-1/3', '2/3']],
    ] as const) {
      const original = system(raw(i, 1, 'S'));
      expect(point(raw(i, 1, 'S'))).toEqual(expected);
      for (const target of ['x', 'y'] as const)
        expect(substitutionTrace(original, target).point!.map(textR)).toEqual(
          expected,
        );
      const candidate = auditSystemPair(original, raw(i, 1, 'C'))!;
      expect(candidate.rows[1]!.pass).toBe(true);
      expect(candidate.rows[0]!.pass).toBe(false);
      expect(candidate.rows[0]!.left.map(String)).toEqual(
        i === 0 ? ['-1', '100'] : ['101', '100'],
      );
    }
  });
  it('constructs noninteger first-row solutions that a finite integer list cannot exhaust', () => {
    for (const [i, candidate] of [
      [0, '(1/2,-1)'],
      [1, '(1/2,1/4)'],
    ] as const) {
      const audit = auditSystemPair(system(raw(i, 1, 'S')), candidate)!;
      expect(audit.rows.map((r) => r.pass)).toEqual([true, false]);
      expect(audit.point.some((v) => v[1] !== 1n)).toBe(true);
      expect(sets[i]!.questions[0]!.solution.en).toContain('ALL real t');
    }
  });
  it('scales every coefficient and right constant before combining, then reverses using a retained row', () => {
    for (const c of [
      {
        i: 0,
        k1: 3,
        k2: 2,
        scaled: [
          ['9', '6', '3'],
          ['4', '-6', '-16'],
        ],
        combined: ['13', '0', '-13'],
        solution: ['-1', '2'],
      },
      {
        i: 1,
        k1: 2,
        k2: 3,
        scaled: [
          ['4', '6', '-2'],
          ['9', '-6', '-24'],
        ],
        combined: ['13', '0', '-26'],
        solution: ['-2', '1'],
      },
    ]) {
      const original = system(raw(c.i, 2, 'E'));
      expect(raw(c.i, 2, 'K')).toContain(`k1=${c.k1}; k2=${c.k2}`);
      const row1 = combineSystemRows(original, String(c.k1), '0'),
        row2 = combineSystemRows(original, '0', String(c.k2));
      expect([row1, row2].map((r) => [r.a, r.b, r.c].map(textR))).toEqual(
        c.scaled,
      );
      const replacement = replaceSystemRow(
        original,
        0,
        String(c.k1),
        String(c.k2),
      );
      expect(replacement.valid).toBe(true);
      expect(
        [
          replacement.combined.a,
          replacement.combined.b,
          replacement.combined.c,
        ].map(textR),
      ).toEqual(c.combined);
      expect(sameSystemSolutions(original, replacement.rows)).toBe(true);
      const recovered = combineSystemRows(
        replacement.rows,
        `1/${c.k1}`,
        `-${c.k2}/${c.k1}`,
      );
      expect([recovered.a, recovered.b, recovered.c].map(textR)).toEqual(
        [original[0].a, original[0].b, original[0].c].map(textR),
      );
      expect(point(raw(c.i, 2, 'E'))).toEqual(c.solution);
    }
  });
  it('distinguishes dropping the retained equation from an equivalent replacement that has not cancelled y', () => {
    for (const [i, x, expected] of [
      [0, -1, ['5', '-1', '-7']],
      [1, -2, ['5', '1', '-9']],
    ] as const) {
      const original = system(raw(i, 2, 'E')),
        k1 = i === 0 ? '3' : '2',
        k2 = i === 0 ? '2' : '3';
      const M = combineSystemRows(original, k1, k2);
      expect(auditSystemPair([M, M], `(${x},0)`)!.pass).toBe(true);
      expect(auditSystemPair(original, `(${x},0)`)!.pass).toBe(false);
      expect(sameSystemSolutions(original, [M, M])).toBe(false);
      const alternative = replaceSystemRow(original, 0, '1', '1');
      expect(sameSystemSolutions(original, alternative.rows)).toBe(true);
      expect(
        [
          alternative.combined.a,
          alternative.combined.b,
          alternative.combined.c,
        ].map(textR),
      ).toEqual(expected);
      expect(alternative.combined.b[0]).not.toBe(0n);
    }
  });
  it('reuses coordinate tasks requiring different axis intervals, not another geometry question with a guessed ID', () => {
    for (const [s, horizontal, vertical] of [
      [geometryGraphRetrieval.J93, 'two', '1/2'],
      [geometryGraphRetrieval.J94, '1/2', 'two'],
    ] as const) {
      const q = s.questions[5]!;
      expect(q.id).toBe(`${s.unit}-MAINT-REASONS-Q6`);
      expect(q.skill).toBe('coordinate-plot-and-scale');
      expect(q.stem.en).toContain(`horizontal intervals ${horizontal}`);
      expect(q.stem.en).toContain(`vertical intervals ${vertical}`);
      expect(s.questions).toHaveLength(9);
    }
  });
  it('checks all thirty-six permitted original designs, equivalent original rows and the final-value distinction', () => {
    for (let i = 0; i < 2; i++)
      for (const b of [i + 2, i + 3])
        for (const X of [6, 7, 8])
          for (const Y of [1, 2, 3]) {
            const N = X + Y,
              M = (b + 2) * X + b * Y,
              source = `x+y=${N};${b + 2}x+${b}y=${M}`;
            expect(raw(i, 3, 'D')).toContain(`b∈{${i + 2},${i + 3}}`);
            expect(point(source)).toEqual([String(X), String(Y)]);
            expect(
              checkSystemModel(
                `-2x-2y=${-2 * N};(${b + 2}/2)x+(${b}/2)y=${M}/2`,
                source,
              ),
            ).toBe(true);
            expect(checkSystemModel(`x=${X};y=${Y}`, source)).toBe(false);
            expect(
              sameSystemSolutions(system(source), system(`x=${X};y=${Y}`)),
            ).toBe(true);
          }
  });
  it('separates the exact shifted-price algebraic pair, whole-count domain and failed rounded alternatives', () => {
    for (const b of [2, 3, 4])
      for (const X of [6, 7, 8])
        for (const Y of [1, 2, 3]) {
          const N = X + Y,
            M = (b + 2) * X + b * Y,
            source = system(`x+y=${N};${b + 2}x+${b}y=${M + 1}`),
            candidate = `(${2 * X + 1}/2,${2 * Y - 1}/2)`;
          expect(
            auditSystemContext(source, candidate, 'nonnegative-integer')!
              .accepted,
          ).toBe(false);
          expect(
            auditSystemContext(source, candidate, 'nonnegative')!.accepted,
          ).toBe(true);
          expect(auditSystemPair(source, candidate)!.pass).toBe(true);
          expect(auditSystemPair(source, `(${X},${Y})`)!.pass).toBe(false);
          expect((b + 2) * (X + 1) + b * (Y - 1)).toBe(M + 2);
          expect(auditSystemPair(source, `(${X + 1},${Y - 1})`)!.pass).toBe(
            false,
          );
        }
  });
  it('retains full real lines, nonnegative segments and finite ticket lattice points as distinct sets', () => {
    const small = { xMin: -5, xMax: 5, yMin: -5, yMax: 5, xStep: 1, yStep: 1 },
      wide = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, xStep: 2, yStep: 2 };
    for (const N of [7, 8, 9, 10, 11])
      for (const b of [2, 3, 4]) {
        const source = system(`x+y=${N};${b}x+${b}y=${b * N}`),
          result = solveSystem(source);
        expect(result.kind).toBe('infinite');
        const ticketPairs: [number, number][] = [];
        for (let x = 0; x <= N; x++)
          for (let y = 0; y <= N; y++)
            if (auditSystemPair(source, `(${x},${y})`)!.pass)
              ticketPairs.push([x, y]);
        expect(ticketPairs).toHaveLength(N + 1);
        expect(auditSystemPair(source, `(-1,${N + 1})`)!.pass).toBe(true);
        expect(
          auditSystemContext(source, `(-1,${N + 1})`, 'nonnegative')!.accepted,
        ).toBe(false);
        expect(auditSystemPair(source, '(0,0)')!.pass).toBe(false);
      }
    for (const X of [6, 7, 8])
      for (const Y of [1, 2, 3]) {
        const result = solveSystem(
          system(`x+y=${X + Y};5x+3y=${5 * X + 3 * Y}`),
        );
        if (result.kind !== 'one') throw Error('Independent source expected');
        expect(pointInSystemWindow(result.point, small)).toBe(false);
        expect(pointInSystemWindow(result.point, wide)).toBe(true);
      }
  });
});
