import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { distributionRecurrenceRetrieval } from './content/distributionRecurrenceRetrieval';
import { distributionRecurrenceEvidence } from './content/distributionRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  distribution,
  affineDistribution,
  tableText,
  binomialDistribution,
  binomialEvent,
  standardDensity,
  normalAudit,
  normalCdf,
  standardScore,
  probability4,
} from './distributionModels';
import { plotBounds } from './cartesianModels';
import { textR, rational, addR, mulR, divR, negR } from './algebraModels';
import { readRational as R } from './rationalModels';
const subtract = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
// Round the displayed decimal table as an exact rational; binary .022750
// lies below the half-way value and Number.toFixed would incorrectly give .0227.
const tableFour = (r: ReturnType<typeof R>) => {
  const n = (2n * r[0] * 10000n + r[1]) / (2n * r[1]);
  return `${n / 10000n}.${String(n % 10000n).padStart(4, '0')}`;
};
const law = (
  q: (typeof distributionRecurrenceRetrieval.H35_DISTRIBUTION.questions)[number],
) =>
  distribution(
    q.contextTable!.rows.map(
      (row) => [row[0]!.en, row[1]!.en] as [string, string],
    ),
  );
const sets = Object.values(distributionRecurrenceRetrieval);
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
describe('distribution recurrence', () => {
  it('covers all six H33 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H33')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(distributionRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of distributionRecurrenceEvidence) {
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

  it('reconstructs full ID preimages and nonlinear merges from actual tables,including probability legality and zero support', () => {
    for (const [key, shift, xTable, yTable] of [
      ['H35_DISTRIBUTION', '2', '-1:1/3;2:1/2;5:1/6', '0:1/2;3:1/2'],
      ['H38_DISTRIBUTION', '1', '0:3/8;1:1/2;3:1/8', '0:1/2;1:3/8;2:1/8'],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[0]!,
        rows = q.contextTable!.rows;
      expect(new Set(rows.map((r) => r[0]!.en)).size).toBe(rows.length);
      const counts = new Map<string, number>(),
        ys = new Map<string, number>();
      for (const row of rows) {
        const x = row[1]!.en,
          delta = subtract(R(x), R(shift)),
          y = textR(delta[0] < 0n ? negR(delta) : delta);
        counts.set(x, (counts.get(x) ?? 0) + 1);
        ys.set(y, (ys.get(y) ?? 0) + 1);
      }
      const grouped = (m: Map<string, number>) =>
        distribution(
          [...m].map(([x, n]) => [
            x,
            textR(rational(BigInt(n), BigInt(rows.length))),
          ]),
        );
      const expected = (raw: string) =>
        distribution(
          raw.split(';').map((r) => r.split(':') as [string, string]),
        );
      expect(tableText(grouped(counts))).toBe(tableText(expected(xTable)));
      expect(tableText(grouped(ys))).toBe(tableText(expected(yTable)));
      const zero = distribution([
        ...grouped(counts).rows.map(
          (r) => [textR(r.value), textR(r.p)] as [string, string],
        ),
        ['99', '0'],
      ]);
      expect(zero.support.map(textR)).toEqual(
        grouped(counts).support.map(textR),
      );
      expect(q.solution.en).toContain('preimages');
      expect(q.solution.en).toContain('zero row');
    }
    expect(() =>
      distribution([
        ['0', '1/4'],
        ['1', '1/2'],
      ]),
    ).toThrow();
    expect(() =>
      distribution([
        ['0', '-1/6'],
        ['1', '1'],
        ['2', '1/6'],
      ]),
    ).toThrow();
  });
  it('uses actual unequal probability laws for expectations,unattainable finite sums and independent conditional probabilities', () => {
    for (const [key, mean, scale, shift, changed, total] of [
      ['H35_DISTRIBUTION', '2', '3', '-1', '5', '20'],
      ['H38_DISTRIBUTION', '11/2', '-2', '4', '-7', '55'],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[1]!,
        m = law(q);
      expect(textR(m.mean)).toBe(mean);
      expect(m.support.some((x) => textR(x) === mean)).toBe(false);
      expect(textR(affineDistribution(m, scale, shift).mean)).toBe(changed);
      expect(textR(mulR(R('10'), m.mean))).toBe(total);
      const low = m.rows[0]!,
        high = m.rows[1]!;
      const totals = Array.from({ length: 11 }, (_, k) =>
        textR(
          addR(
            mulR(R(String(10 - k)), low.value),
            mulR(R(String(k)), high.value),
          ),
        ),
      );
      expect(totals).not.toContain(total);
      const past = mulR(low.p, mulR(low.p, low.p));
      expect(textR(divR(mulR(past, high.p), past))).toBe(textR(high.p));
      expect(q.solution.en).toContain(`${total} cm`);
      expect(q.solution.en).toContain('not independence');
    }
  });
  it('computes both weighted variance identities and exact affine/zero-scale moments without treating support size as sample size', () => {
    for (const [key, mean, variance, scale, shift, ym, yv, sd, ysd] of [
      ['H35_DISTRIBUTION', '2', '8', '-3', '2', '-4', '72', '2√2', '6√2'],
      [
        'H38_DISTRIBUTION',
        '11/2',
        '27/4',
        '-2',
        '1',
        '-10',
        '27',
        '3√3/2',
        '3√3',
      ],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[2]!,
        m = law(q);
      expect(textR(m.mean)).toBe(mean);
      expect(textR(m.variance)).toBe(variance);
      expect(textR(subtract(m.second, mulR(m.mean, m.mean)))).toBe(variance);
      const signed = m.rows.reduce(
        (sum, r) => addR(sum, mulR(r.p, subtract(r.value, m.mean))),
        rational(0n),
      );
      expect(textR(signed)).toBe('0');
      const y = affineDistribution(m, scale, shift);
      expect(textR(y.mean)).toBe(ym);
      expect(textR(y.variance)).toBe(yv);
      expect(textR(y.variance)).toBe(
        textR(mulR(mulR(R(scale), R(scale)), m.variance)),
      );
      const fixed = affineDistribution(m, '0', shift);
      expect(textR(fixed.variance)).toBe('0');
      expect(fixed.support.map(textR)).toEqual([shift]);
      expect(q.solution.en).toContain(`SD=${sd} cm`);
      expect(q.solution.en).toContain(`SD(Y)=${ysd} cm`);
      expect(q.solution.en).toContain('SD(Y)=|a|SD(X)');
      expect(q.solution.en).toContain('cm²');
    }
  });
  it('enumerates disjoint ordered trials before binomial factors,contrasts dependent draws and preserves degenerate models', () => {
    for (const [
      key,
      n,
      p,
      k,
      exact,
      atLeast,
      mean,
      variance,
      bag,
      dependent,
      independent,
    ] of [
      [
        'H35_DISTRIBUTION',
        6,
        '1/3',
        2,
        '80/243',
        '665/729',
        '2',
        '4/3',
        6,
        '1/15',
        '1/9',
      ],
      [
        'H38_DISTRIBUTION',
        5,
        '2/5',
        3,
        '144/625',
        '2882/3125',
        '2',
        '6/5',
        5,
        '1/10',
        '4/25',
      ],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[3]!,
        model = binomialDistribution(n, p),
        failure = subtract(R('1'), R(p));
      let ways = 0,
        sum = rational(0n),
        nonzero = rational(0n);
      for (let mask = 0; mask < 2 ** n; mask++) {
        let count = 0,
          weight = R('1');
        for (let j = 0; j < n; j++) {
          const win = !!(mask & (1 << j));
          if (win) count++;
          weight = mulR(weight, win ? R(p) : failure);
        }
        if (count === k) {
          sum = addR(sum, weight);
          ways++;
        }
        if (count > 0) nonzero = addR(nonzero, weight);
      }
      expect(ways).toBe(n === 6 ? 15 : 10);
      expect(textR(sum)).toBe(exact);
      expect(textR(nonzero)).toBe(atLeast);
      expect(textR(binomialEvent(model, k, 'exact'))).toBe(exact);
      expect(textR(model.mean)).toBe(mean);
      expect(textR(model.variance)).toBe(variance);
      expect(
        textR(mulR(rational(2n, BigInt(bag)), rational(1n, BigInt(bag - 1)))),
      ).toBe(dependent);
      expect(textR(mulR(R(p), R(p)))).toBe(independent);
      expect(dependent).not.toBe(independent);
      expect(q.solution.en).toContain(exact);
      expect(q.solution.en).toContain(atLeast);
      expect(q.solution.en).toContain(dependent);
      expect(q.solution.en).toContain('unequal p');
    }
    expect(binomialDistribution(0, '1/3').support.map(textR)).toEqual(['0']);
    expect(binomialDistribution(6, '0').support.map(textR)).toEqual(['0']);
    expect(binomialDistribution(6, '1').support.map(textR)).toEqual(['6']);
    for (const p of ['0', '1'])
      expect(textR(binomialDistribution(6, p).variance)).toBe('0');
  });
  it('checks actual density coordinates,units and finite windows,and constructs a same-moment discrete counterexample', () => {
    for (const [key, mean, sd] of [
      ['H35_DISTRIBUTION', 10, 2],
      ['H38_DISTRIBUTION', 20, 3],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[4]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual normal plot');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.curves).toHaveLength(2);
      expect(d.points).toHaveLength(0);
      expect(d.xLabel).toBe('offset (cm)');
      expect(d.yLabel).toBe('density (1/cm)');
      expect(d.bounds.xMin).toBe(0);
      expect(d.bounds.xMax).toBe(2 * mean);
      for (const [j, curve] of d.curves!.entries()) {
        const s = sd * (j + 1);
        expect(curve.points).toHaveLength(161);
        for (const point of curve.points)
          expect(point.y).toBeCloseTo(
            standardDensity((point.x - mean) / s) / s,
            13,
          );
        expect(curve.points[80]!.x).toBe(mean);
      }
      expect(d.curves![0]!.points[80]!.y / 2).toBeCloseTo(
        d.curves![1]!.points[80]!.y,
        13,
      );
      const narrow = normalAudit(
          String(mean),
          String(sd),
          '0',
          String(2 * mean),
        ),
        wide = normalAudit(String(mean), String(2 * sd), '0', String(2 * mean));
      expect(narrow.probability).toBeLessThan(1);
      expect(wide.probability).toBeLessThan(narrow.probability);
      expect(
        probability4(
          normalAudit(
            String(mean),
            String(sd),
            String(mean - sd),
            String(mean + sd),
          ).probability,
        ),
      ).toBe('0.6827');
      expect(narrow.pointProbability).toBe(0);
      const discrete = distribution([
        [String(mean - sd), '1/2'],
        [String(mean + sd), '1/2'],
      ]);
      expect(textR(discrete.mean)).toBe(String(mean));
      expect(textR(discrete.variance)).toBe(String(sd * sd));
      const closed = discrete.rows.filter(
        (r) =>
          Number(r.value[0]) / Number(r.value[1]) >= mean - sd &&
          Number(r.value[0]) / Number(r.value[1]) <= mean + sd,
      );
      const open = discrete.rows.filter(
        (r) =>
          Number(r.value[0]) / Number(r.value[1]) > mean - sd &&
          Number(r.value[0]) / Number(r.value[1]) < mean + sd,
      );
      expect(textR(closed.reduce((a, r) => addR(a, r.p), rational(0n)))).toBe(
        '1',
      );
      expect(open).toHaveLength(0);
      expect(q.solution.en).toContain('OPEN zero');
      expect(q.solution.en).toContain('nonzero tails');
    }
  });
  it('uses the actual six-decimal left-tail table without early rounding,and keeps z1 separate from a percentile claim', () => {
    for (const [key, mean, sd, lo, hi, tail, zl, zh, zt, interval, right] of [
      [
        'H35_DISTRIBUTION',
        '10',
        '2',
        '7',
        '13',
        '14',
        '-3/2',
        '3/2',
        '2',
        '0.8664',
        '0.0228',
      ],
      [
        'H38_DISTRIBUTION',
        '20',
        '3',
        '14',
        '26',
        '49/2',
        '-2',
        '2',
        '3/2',
        '0.9545',
        '0.0668',
      ],
    ] as const) {
      const q = distributionRecurrenceRetrieval[key].questions[5]!,
        table = new Map(
          q.contextTable!.rows.map((r) => [textR(R(r[0]!.en)), R(r[1]!.en)]),
        );
      for (const [z, cdf] of table)
        expect(Number(cdf[0]) / Number(cdf[1])).toBeCloseTo(
          normalCdf(Number(R(z)[0]) / Number(R(z)[1])),
          6,
        );
      const a = normalAudit(mean, sd, lo, hi);
      expect(textR(a.zl)).toBe(zl);
      expect(textR(a.zh)).toBe(zh);
      expect(textR(standardScore(tail, mean, sd))).toBe(zt);
      const fromTable = subtract(table.get(zh)!, table.get(zl)!);
      expect(tableFour(fromTable)).toBe(interval);
      const complement = subtract(R('1'), table.get(zt)!);
      expect(tableFour(complement)).toBe(right);
      expect(probability4(a.probability)).toBe(interval);
      expect(
        probability4(1 - normalCdf(Number(R(zt)[0]) / Number(R(zt)[1]))),
      ).toBe(right);
      expect(textR(standardScore(textR(addR(R(mean), R(sd))), mean, sd))).toBe(
        '1',
      );
      expect(q.solution.en).toContain(interval);
      expect(q.solution.en).toContain(right);
      expect(q.solution.en).toContain('P(X≤upper)=1');
      expect(() => standardScore(mean, mean, '0')).toThrow();
      expect(() => normalAudit(mean, '0', lo, hi)).toThrow();
    }
  });
});
