import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { inferenceRecurrenceRetrieval } from './content/inferenceRecurrenceRetrieval';
import { inferenceRecurrenceEvidence } from './content/inferenceRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { distribution, normalCdf, probability4 } from './distributionModels';
import {
  knownSigmaInterval,
  exactBinomialTest,
} from './statisticalInferenceModels';
import { plotBounds } from './cartesianModels';
import { textR, rational, addR, mulR, divR, negR } from './algebraModels';
import { compareR } from './inequalityModels';
import { readRational as R } from './rationalModels';
const minus = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const average = (xs: ReturnType<typeof R>[]) =>
  divR(xs.reduce(addR, rational(0n)), rational(BigInt(xs.length)));
const enumerate = (xs: ReturnType<typeof R>[], n: number) => {
  const samples: { indices: number[]; mean: ReturnType<typeof R> }[] = [];
  const visit = (start: number, chosen: number[]) => {
    if (chosen.length === n) {
      samples.push({
        indices: chosen,
        mean: average(chosen.map((i) => xs[i]!)),
      });
      return;
    }
    for (let i = start; i < xs.length; i++) visit(i + 1, [...chosen, i]);
  };
  visit(0, []);
  return samples;
};
const lawOf = (values: ReturnType<typeof R>[]) => {
  const counts = new Map<string, number>();
  for (const x of values) counts.set(textR(x), (counts.get(textR(x)) ?? 0) + 1);
  return distribution(
    [...counts].map(([x, c]) => [
      x,
      textR(rational(BigInt(c), BigInt(values.length))),
    ]),
  );
};
const sets = Object.values(inferenceRecurrenceRetrieval);
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
describe('inference recurrence', () => {
  it('covers all five H34 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H34')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(inferenceRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of inferenceRecurrenceEvidence) {
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
  it('keeps ten bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
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

  it('separates actual full/restricted design expectations from a lucky zero-error sample and census claims', () => {
    for (const [key, truth, ab, error, frameMean, bias] of [
      ['H35_INFERENCE', '4', '0', '-4', '2', '-2'],
      ['H38_INFERENCE', '6', '10', '4', '8', '2'],
    ] as const) {
      const q = inferenceRecurrenceRetrieval[key].questions[0]!,
        rows = q.contextTable!.rows,
        xs = rows.map((r) => R(r[1]!.en));
      expect(rows.map((r) => r[0]!.en)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
      expect(textR(average(xs))).toBe(truth);
      expect(textR(average(xs.slice(0, 2)))).toBe(ab);
      expect(textR(minus(average(xs.slice(0, 2)), average(xs)))).toBe(error);
      const all = enumerate(xs, 2),
        frame = enumerate(xs.slice(0, 4), 2);
      expect(all).toHaveLength(15);
      expect(frame).toHaveLength(6);
      expect(textR(average(all.map((s) => s.mean)))).toBe(truth);
      expect(textR(average(frame.map((s) => s.mean)))).toBe(frameMean);
      expect(textR(minus(average(frame.map((s) => s.mean)), average(xs)))).toBe(
        bias,
      );
      const cd = frame.find((s) => s.indices.join(',') === '2,3')!;
      expect(textR(minus(cd.mean, average(xs)))).toBe('0');
      expect(bias).not.toBe('0');
      const frameCensus = enumerate(xs.slice(0, 4), 4);
      expect(frameCensus).toHaveLength(1);
      expect(textR(minus(frameCensus[0]!.mean, average(xs)))).toBe(bias);
      for (let i = 0; i < 6; i++)
        expect(all.filter((s) => s.indices.includes(i))).toHaveLength(5);
      const inclusionIdentity = divR(
        xs.reduce((sum, y) => addR(sum, mulR(y, R('2/6'))), rational(0n)),
        R('2'),
      );
      expect(textR(inclusionIdentity)).toBe(truth);
      expect(q.solution.en).toContain('Σyᵢ(2/6)=μ');
      expect(q.solution.en).toContain('missingness');
      expect(q.solution.en).toContain('Accidental zero error');
    }
  });
  it('rebuilds every ID-pair mass and finite-population variance,without widening the canonical six-ID model', () => {
    for (const [key, truth, expected, bias] of [
      ['H35_INFERENCE', '4', '0:1/15;2:2/5;4:1/5;6:2/15;8:1/5', '-2'],
      ['H38_INFERENCE', '6', '2:1/5;4:2/15;6:1/5;8:2/5;10:1/15', '2'],
    ] as const) {
      const q = inferenceRecurrenceRetrieval[key].questions[1]!,
        rows = q.contextTable!.rows,
        xs = rows.map((r) => R(r[1]!.en)),
        samples = enumerate(xs, 2),
        m = lawOf(samples.map((s) => s.mean)),
        individual = lawOf(xs);
      const rendered = m.rows
        .map((r) => `${textR(r.value)}:${textR(r.p)}`)
        .join(';');
      expect(rendered).toBe(expected);
      expect(textR(m.mean)).toBe(truth);
      expect(textR(m.variance)).toBe('32/5');
      expect(textR(individual.variance)).toBe('16');
      for (const sample of samples) {
        const pair = sample.indices.map((i) => rows[i]![0]!.en).join('');
        expect(q.solution.en).toContain(pair);
      }
      for (const [n, variance] of [
        [2, '32/5'],
        [3, '16/5'],
        [6, '0'],
      ] as const) {
        const exact = lawOf(enumerate(xs, n).map((s) => s.mean));
        expect(textR(exact.variance)).toBe(variance);
        const formula = mulR(
          divR(individual.variance, rational(BigInt(n))),
          rational(BigInt(6 - n), 5n),
        );
        expect(textR(formula)).toBe(variance);
      }
      const frame = lawOf(enumerate(xs.slice(0, 4), 2).map((s) => s.mean));
      expect(textR(frame.variance)).toBe('4/3');
      expect(textR(minus(frame.mean, m.mean))).toBe(bias);
      expect(textR(addR(frame.variance, mulR(R(bias), R(bias))))).toBe('16/3');
      expect(q.solution.en).toContain('SE=√(32/5) cm');
      expect(q.solution.en).toContain('R0 frequencies are undefined');
    }
  });
  it('constructs exact intervals from the actual given-mean plot,counts endpoint coverage and distinguishes model families', () => {
    for (const [key, truth, sigma, n, interval, tight, larger] of [
      ['H35_INFERENCE', '10', '6', 36, ['8', '12'], ['8.04', '11.96'], 144],
      ['H38_INFERENCE', '-3', '4', 16, ['-5', '-1'], ['-4.96', '-1.04'], 64],
    ] as const) {
      const q = inferenceRecurrenceRetrieval[key].questions[2]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need means plot');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.points).toHaveLength(4);
      expect(d.curves).toHaveLength(1);
      expect(d.curves![0]!.points.every((p) => p.x === Number(truth))).toBe(
        true,
      );
      expect(d.points.map((p) => p.label)).toEqual(['M1', 'M2', 'M3', 'M4']);
      expect(d.points.map((p) => p.x)).toEqual(
        [-2, -1, 2, 3].map((delta) => Number(truth) + delta),
      );
      expect(d.yLabel).toBe('constructed row');
      const full = knownSigmaInterval(truth, sigma, n, '2'),
        small = knownSigmaInterval(truth, sigma, n, '1.96'),
        more = knownSigmaInterval(truth, sigma, larger, '2');
      expect(textR(full.se)).toBe('1');
      expect([textR(full.lower), textR(full.upper)]).toEqual(
        interval.map((x) => textR(R(x))),
      );
      expect([textR(small.lower), textR(small.upper)]).toEqual(
        tight.map((x) => textR(R(x))),
      );
      expect(textR(more.se)).toBe('1/2');
      expect(
        textR(
          divR(minus(full.upper, full.lower), minus(more.upper, more.lower)),
        ),
      ).toBe('2');
      expect(full.coverage).toBeGreaterThan(small.coverage);
      expect(probability4(full.coverage)).toBe('0.9545');
      expect(probability4(small.coverage)).toBe('0.9500');
      const covered = d.points.map((p) => {
        const ci = knownSigmaInterval(String(p.x), sigma, n, '2');
        return (
          compareR(ci.lower, R(truth)) <= 0 && compareR(R(truth), ci.upper) <= 0
        );
      });
      expect(covered).toEqual([true, true, true, false]);
      expect(q.solution.en).toContain('3/4');
      expect(q.solution.en).toContain('not simulation or user data');
      expect(q.solution.en).toContain('not an individual prediction interval');
      expect(q.solution.en).toContain('no posterior probability');
    }
  });
  it('enumerates null strings and every possible planned rejection,including empty discrete rejection sets', () => {
    for (const [
      key,
      n,
      alpha,
      upP,
      twoP,
      upCritical,
      twoCritical,
      upRate,
      twoRate,
    ] of [
      ['H35_INFERENCE', 5, '1/20', '1/32', '1/16', [5], [], '1/32', '0'],
      [
        'H38_INFERENCE',
        6,
        '1/8',
        '7/64',
        '7/32',
        [5, 6],
        [0, 6],
        '7/64',
        '1/32',
      ],
    ] as const) {
      const q = inferenceRecurrenceRetrieval[key].questions[3]!,
        counts = Array.from({ length: 2 ** n }, (_, mask) =>
          Array.from({ length: n }, (_, i) => (mask >> i) & 1).reduce(
            (a, b) => a + b,
            0,
          ),
        );
      for (const alternative of ['upper', 'two-sided'] as const) {
        const extreme = (k: number, observed: number) =>
          alternative === 'upper'
            ? k >= observed
            : Math.abs(2 * k - n) >= Math.abs(2 * observed - n);
        const pAt = (observed: number) =>
          rational(
            BigInt(counts.filter((k) => extreme(k, observed)).length),
            BigInt(2 ** n),
          );
        const critical = Array.from({ length: n + 1 }, (_, k) => k).filter(
          (k) => compareR(pAt(k), R(alpha)) <= 0,
        );
        const model = exactBinomialTest(n, 5, alternative, alpha);
        expect(textR(model.p)).toBe(textR(pAt(5)));
        expect(textR(model.p)).toBe(alternative === 'upper' ? upP : twoP);
        expect(model.critical).toEqual(critical);
        expect(critical).toEqual(
          alternative === 'upper' ? upCritical : twoCritical,
        );
        const rate = rational(
          BigInt(counts.filter((k) => critical.includes(k)).length),
          BigInt(2 ** n),
        );
        expect(textR(rate)).toBe(alternative === 'upper' ? upRate : twoRate);
        expect(textR(model.falsePositive)).toBe(textR(rate));
        expect(compareR(rate, R(alpha))).toBeLessThan(0);
        expect(model.decision).toBe(
          alternative === 'upper' ? 'reject' : 'do-not-reject',
        );
      }
      expect(q.solution.en).toContain(upP);
      expect(q.solution.en).toContain(twoP);
      expect(q.solution.en).toContain('Equivalence needs');
      expect(q.solution.en).toContain('type II');
    }
  });
  it('computes every actual effect-table interval and target conclusion,while keeping magnitude,direction and causal design separate', () => {
    for (const [key, sigma, target, endpoints] of [
      [
        'H35_INFERENCE',
        '8',
        '2',
        [
          ['0.2432', '0.5568'],
          ['-3.84', '11.84'],
          ['2.432', '5.568'],
          ['-5.568', '-2.432'],
        ],
      ],
      [
        'H38_INFERENCE',
        '6',
        '1',
        [
          ['0.1824', '0.4176'],
          ['-2.88', '8.88'],
          ['1.824', '4.176'],
          ['-4.176', '-1.824'],
        ],
      ],
    ] as const) {
      const q = inferenceRecurrenceRetrieval[key].questions[4]!,
        rows = q.contextTable!.rows;
      expect(rows.map((r) => r[0]!.en)).toEqual(['A', 'B', 'C', 'D']);
      expect(q.contextTable!.caption.en).toContain('α=0.05');
      const cis = rows.map((r, i) => {
        const ci = knownSigmaInterval(
          r[1]!.en,
          sigma,
          Number(r[2]!.en),
          '1.96',
        );
        expect([textR(ci.lower), textR(ci.upper)]).toEqual(
          endpoints[i]!.map((x) => textR(R(x))),
        );
        return ci;
      });
      const zs = cis.map((ci) => divR(ci.mean, ci.se));
      expect(zs.map(textR)).toEqual(['5', '1', '5', '-5']);
      const ps = zs.map(
        (z) => 2 * normalCdf(-Math.abs(Number(z[0]) / Number(z[1]))),
      );
      expect(ps[0]).toBeCloseTo(0.0000005733031438, 14);
      expect(probability4(ps[1]!)).toBe('0.3173');
      expect(ps[2]).toBe(ps[0]);
      expect(ps[3]).toBe(ps[0]);
      expect(textR(divR(cis[2]!.mean, cis[0]!.mean))).toBe('10');
      expect(compareR(cis[0]!.upper, R(target))).toBeLessThan(0);
      expect(compareR(cis[2]!.lower, R(target))).toBeGreaterThan(0);
      expect(compareR(cis[1]!.lower, R('0'))).toBeLessThan(0);
      expect(compareR(cis[1]!.upper, R(target))).toBeGreaterThan(0);
      expect(compareR(cis[3]!.upper, R('0'))).toBeLessThan(0);
      expect(q.solution.en).toContain('not proved useless');
      expect(q.solution.en).toContain('harmful');
      expect(q.solution.en).toContain('Random sampling');
      expect(q.solution.en).toContain('random assignment');
    }
  });
});
