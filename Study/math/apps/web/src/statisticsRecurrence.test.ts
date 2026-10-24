import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { statisticsRetrieval } from './content/statisticsRetrieval';
import { statisticsRecurrence } from './content/statisticsRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  leastSquares,
  candidateFit,
  dataSummary,
  type DataPair,
} from './dataModellingModels';
import {
  correlationModel,
  transformPairs,
  responseBounds,
} from './statisticsModels';
import { textR, addR, mulR, divR, rational, negR } from './algebraModels';
import { equalPolynomial } from './polynomialModels';
import { plotBounds } from './cartesianModels';
const readPairs = (
  index: 0 | 1,
  key: keyof typeof statisticsRetrieval,
): DataPair[] =>
  statisticsRetrieval[key].questions[index]!.contextTable!.rows.map((r) => ({
    id: r[0]!.en,
    x: r[1]!.en,
    y: r[2]!.en,
  }));
const sets = Object.values(statisticsRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('statistics recurrence', () => {
  it('covers all five H27 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H27')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(statisticsRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of statisticsRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twelve bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(12);
    for (const s of sets) {
      expect(s.questions).toHaveLength(6);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks actual raw pairing identities,correlations,independent whole-row reorder,unit scaling and undefined constant columns', () => {
    for (const [key, ids, r, sxx, syy, sxy, newSlope] of [
      ['H34_STATISTICS', ['A', 'B', 'C'], '1/2', '2', '8', '2', '2'],
      ['H38_STATISTICS', ['P', 'Q', 'R'], '-1/2', '2', '2', '-1', '-1'],
    ] as const) {
      const rows = readPairs(0, key),
        m = correlationModel(rows);
      expect(rows.map((r) => r.id)).toEqual(ids);
      expect(new Set(rows.map((r) => r.id)).size).toBe(3);
      expect([
        textR(m.fit.sxx),
        textR(m.syy),
        textR(m.fit.sxy),
        m.text,
      ]).toEqual([sxx, syy, sxy, r]);
      expect(correlationModel([...rows].reverse()).exact).toEqual(m.exact);
      const ys = rows.map((r) => r.y).sort((a, b) => Number(a) - Number(b));
      const forged = rows.map((r, i) => ({ ...r, y: ys[i]! }));
      expect(correlationModel(forged).text).toBe('1');
      expect(forged).not.toEqual(rows);
      const changed = correlationModel(
        transformPairs(rows, '2', '10', '4', '3'),
      );
      expect(changed.exact).toEqual(m.exact);
      expect(textR(changed.fit.slope!)).toBe(newSlope);
      expect(
        correlationModel(transformPairs(rows, '-3', '5', '1', '0')).exact,
      ).toEqual(negR(m.exact!));
      expect(
        correlationModel(transformPairs(rows, '0', '5', '1', '0')).defined,
      ).toBe(false);
      expect(
        statisticsRetrieval[key].questions[0]!.solution.en.replace(/−/g, '-'),
      ).toContain(`r=${r}`);
    }
  });
  it('verifies both actual all-parameter SSE expressions against original table rows and checks candidate residual conditions', () => {
    for (const [key, a, b, sse, candidates, actualResiduals] of [
      [
        'H34_STATISTICS',
        '2',
        '1',
        '6',
        [
          ['4', '0'],
          ['0', '2'],
        ],
        ['-1', '2', '-1'],
      ],
      [
        'H38_STATISTICS',
        '2',
        '-1/2',
        '3/2',
        [
          ['2', '0'],
          ['2', '-1'],
        ],
        ['1/2', '-1', '1/2'],
      ],
    ] as const) {
      const rows = readPairs(1, key),
        fit = leastSquares(rows),
        q = statisticsRetrieval[key].questions[1]!;
      expect(rows).toEqual(readPairs(0, key));
      expect([
        textR(fit.intercept!),
        textR(fit.slope!),
        textR(fit.sse),
      ]).toEqual([a, b, sse]);
      expect(fit.rows.map((r) => textR(r.residual))).toEqual(actualResiduals);
      expect(
        textR(
          fit.rows.reduce(
            (s, r) => addR(s, mulR(r.px, r.residual)),
            rational(0n),
          ),
        ),
      ).toBe('0');
      for (const [ca, cb] of candidates) {
        const m = candidateFit(rows, ca, cb);
        expect(textR(m.sse)).toBe(key === 'H34_STATISTICS' ? '8' : '2');
        expect(
          textR(m.rows.reduce((s, r) => addR(s, r.residual), rational(0n))),
        ).toBe('0');
      }
      const expression = q.solution.en.match(/SSE=([^,;.]+)/)![1]!;
      expect(expression).toBeTruthy();
      const raw = rows.map((r) => `(${r.y}-(a+b*(${r.x})))^2`).join('+');
      expect(equalPolynomial(raw, expression, ['a', 'b'])).toBe(true);
      const constant = rows.map((r) => ({ ...r, x: '2' })),
        f = leastSquares(constant);
      expect(f.slope).toBeNull();
      expect(f.rows.every((r) => textR(r.predicted) === textR(f.my))).toBe(
        true,
      );
    }
  });
  it('checks actual ID-labelled U-scatter coordinates,original-x residuals and explicit dependent zero-events despite r zero', () => {
    for (const [key, residuals, sse] of [
      ['H34_STATISTICS', ['2', '-1', '-2', '-1', '2'], '14'],
      ['H38_STATISTICS', ['4', '-2', '-4', '-2', '4'], '56'],
    ] as const) {
      const d = statisticsRetrieval[key].questions[2]!.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual given scatter');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.curves).toEqual([]);
      expect(d.points).toHaveLength(5);
      const rows = d.points!.map((p) => ({
        id: p.label!,
        x: String(p.x),
        y: String(p.y),
      }));
      expect(rows.map((r) => r.id)).toEqual(['U1', 'U2', 'U3', 'U4', 'U5']);
      const m = correlationModel(rows);
      expect(m.text).toBe('0');
      expect(textR(m.fit.sse)).toBe(sse);
      expect(m.fit.rows.map((r) => textR(r.residual))).toEqual(residuals);
      expect(m.fit.rows.map((r) => textR(r.px))).toEqual([
        '-2',
        '-1',
        '0',
        '1',
        '2',
      ]);
      for (const p of d.points!)
        expect(d.caption!.en).toContain(`${p.label}(${p.x},${p.y})`);
      const x0 = rows.filter((r) => r.x === '0').length,
        y0 = rows.filter((r) => r.y === '0').length,
        both = rows.filter((r) => r.x === '0' && r.y === '0').length;
      expect([x0, y0, both]).toEqual([1, 1, 1]);
      expect(rational(BigInt(both), 5n)).not.toEqual(
        mulR(rational(BigInt(x0), 5n), rational(BigInt(y0), 5n)),
      );
    }
  });
  it('enumerates every actual four-ID sample and exact mean variance without widening fixed classroom model bounds', () => {
    for (const [key, mean, popVar, means, variance, bias] of [
      ['H34_STATISTICS', '2', '6', ['0', '1', '3', '1', '3', '4'], '2', '-2'],
      [
        'H38_STATISTICS',
        '4',
        '11',
        ['1', '3', '5', '3', '5', '7'],
        '11/3',
        '-3',
      ],
    ] as const) {
      const rows = statisticsRetrieval[key].questions[3]!.contextTable!.rows,
        pop = rows.map((r) => r[1]!.en);
      expect(rows.map((r) => r[0]!.en)).toEqual(['A', 'B', 'C', 'D']);
      expect(rows[0]![1]).toEqual(rows[1]![1]);
      const samples: { ids: string; mean: string }[] = [];
      for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 4; j++)
          samples.push({
            ids: rows[i]![0]!.en + rows[j]![0]!.en,
            mean: textR(
              divR(
                addR(rational(BigInt(pop[i]!)), rational(BigInt(pop[j]!))),
                rational(2n),
              ),
            ),
          });
      expect(samples.map((s) => s.ids)).toEqual([
        'AB',
        'AC',
        'AD',
        'BC',
        'BD',
        'CD',
      ]);
      expect(samples.map((s) => s.mean)).toEqual(means);
      const summary = dataSummary(pop),
        distribution = dataSummary(samples.map((s) => s.mean));
      expect([textR(summary.mean), textR(summary.variance!)]).toEqual([
        mean,
        popVar,
      ]);
      expect(textR(distribution.mean)).toBe(mean);
      expect(textR(distribution.variance!)).toBe(variance);
      expect(
        textR(addR(rational(BigInt(samples[0]!.mean)), negR(summary.mean))),
      ).toBe(bias);
      expect(dataSummary([mean]).variance).toEqual(rational(0n));
    }
  });
  it('checks actual known/unknown tables,all attainable logical proportions and the distinction from response proportions', () => {
    for (const [key, n, r, y, rate, low, high] of [
      ['H34_STATISTICS', 60, 12, 9, '3/4', '3/20', '19/20'],
      ['H38_STATISTICS', 80, 16, 10, '5/8', '1/8', '37/40'],
    ] as const) {
      const rows = statisticsRetrieval[key].questions[4]!.contextTable!.rows;
      expect(rows.map((r) => Number(r[1]!.en))).toEqual([y, r - y, n - r, n]);
      const bounds = responseBounds(n, r, y);
      expect(
        [bounds.sampleRate, bounds.lower, bounds.upper].map(textR),
      ).toEqual([rate, low, high]);
      const possibilities = Array.from({ length: n - r + 1 }, (_, k) =>
        rational(BigInt(y + k), BigInt(n)),
      );
      expect(possibilities[0]).toEqual(bounds.lower);
      expect(possibilities.at(-1)).toEqual(bounds.upper);
      expect(new Set(possibilities.map(textR)).size).toBe(n - r + 1);
      expect(rows[2]![0]!.en).toBe('Outcome unknown');
    }
  });
  it('recalculates actual five-versus-four ID influence branches without mutating source records or reusing old centring', () => {
    for (const [index, set] of sets.entries()) {
      const q = set.questions[5]!,
        table = q.contextTable!;
      const rows = table.rows.map((r) => ({
        id: r[0]!.en,
        x: r[1]!.en,
        y: r[2]!.en,
      }));
      const before = JSON.stringify(rows),
        all = correlationModel(rows),
        branch = correlationModel(rows.filter((p) => p.id !== 'I5'));
      const numbers = (m: ReturnType<typeof correlationModel>) =>
        [
          m.fit.mx,
          m.fit.my,
          m.fit.sxx,
          m.syy,
          m.fit.sxy,
          m.fit.slope!,
          m.fit.intercept!,
          m.fit.sse,
        ].map(textR);
      const clauses = q.solution.en.split('Four-point branch: ');
      const read = (s: string) => {
        const m = s.match(
          /means\(([^,]+),([^)]+)\), Sxx=([^,]+), Syy=([^,]+), Sxy=([^,]+), r=([^;]+); slope=([^,]+), intercept=([^,]+), fitted y=[^,]+, SSE=([^.]*)\./,
        )!;
        expect(m).toBeTruthy();
        return {
          numbers: [m[1], m[2], m[3], m[4], m[5], m[7], m[8], m[9]],
          r: m[6],
        };
      };
      expect(read(clauses[0]!).numbers).toEqual(numbers(all));
      expect(read(clauses[1]!).numbers).toEqual(numbers(branch));
      expect(read(clauses[0]!).r).toBe(all.text);
      expect(read(clauses[1]!).r).toBe(branch.text);
      expect(all.text).toBe('0');
      expect(branch.text).toBe(index === 0 ? '1' : '-1');
      const originalFifth = candidateFit(
        rows,
        textR(branch.fit.intercept!),
        textR(branch.fit.slope!),
      ).rows[4]!;
      const written = q.solution.en.match(
        /four-point line predicts ([-\d]+) with residual ([-\d]+)/,
      )!;
      expect(written.slice(1)).toEqual([
        textR(originalFifth.predicted),
        textR(originalFifth.residual),
      ]);
      expect(JSON.stringify(rows)).toBe(before);
      expect(table.rows.map((r) => r[0]!.en)).toEqual([
        'I1',
        'I2',
        'I3',
        'I4',
        'I5',
      ]);
      expect(q.solution.en).toContain('not proof of error');
      expect(q.solution.en).toContain('different samples');
      expect(q.solution.en).toContain('checkable provenance');
      expect(q.solution.en).toContain('independent data');
      expect(q.answer.kind).toBe('explain');
      const d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Original scatter required');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.curves).toEqual([]);
      expect(d.points!.map((p) => [p.label, String(p.x), String(p.y)])).toEqual(
        table.rows.map((r) => r.map((x) => x.en)),
      );
      for (const source of ['H27-L01', 'H27-L03']) {
        const link = recurrenceLinksFor(source)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id);
        expect(link).toBeDefined();
      }
    }
  });
});
