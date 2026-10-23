import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { dataLanguageRetrieval } from './content/dataLanguageRetrieval';
import { dataLanguageRecurrence } from './content/dataLanguageRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  dataSummary,
  transformData,
  zScore,
  leastSquares,
  candidateFit,
  regressionPrediction,
} from './dataModellingModels';
import { readRational as R } from './rationalModels';
import { addR, mulR, rational, textR } from './algebraModels';
import { checkRadical, principalRadical, radicalText } from './radicalModels';
import { equalPolynomial } from './polynomialModels';
const sets = Object.values(dataLanguageRetrieval);
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
describe('data language recurrence', () => {
  it('covers all five H08 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H08')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(dataLanguageRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of dataLanguageRecurrence) {
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
  it('keeps eight bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(4);
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

  it('checks the actual six-row provenance tables, distinct IDs, missing outcomes and non-invariant nominal-code means', () => {
    for (const [key, colour, means] of [
      ['H27_DATA', 'Blue', ['7/4', '65/2']],
      ['H34', 'Red', ['9/4', '105/2']],
    ] as const) {
      const rows = dataLanguageRetrieval[key].questions[0]!.contextTable!.rows;
      expect(rows).toHaveLength(6);
      expect(new Set(rows.map((r) => r[1]!.en)).size).toBe(5);
      expect(rows[4]!.slice(1, 3)).toEqual(rows[0]!.slice(1, 3));
      expect(rows[4]![3]!.en).toBe('Confirmed same-ID/occasion copy');
      expect(rows[5]![2]!.en).toBe('Missing');
      const original = rows.filter((r) => r[3]!.en === 'Original');
      expect(original).toHaveLength(4);
      expect(new Set(original.map((r) => r[1]!.en)).size).toBe(4);
      expect(original.filter((r) => r[2]!.en === colour)).toHaveLength(2);
      for (const [j, codes] of [
        { Blue: 1, Green: 2, Red: 3 },
        { Blue: 10, Green: 20, Red: 90 },
      ].entries()) {
        const sum = original.reduce(
          (s, r) => s + codes[r[2]!.en as keyof typeof codes],
          0,
        );
        expect(textR(rational(BigInt(sum), 4n))).toBe(means[j]);
      }
    }
  });
  it('checks the actual bimodal plots, reflection symmetry and closed versus open endpoint counts', () => {
    for (const [key, mean, variance] of [
      ['H27_DATA', '2', '4'],
      ['H34', '4', '9'],
    ] as const) {
      const q = dataLanguageRetrieval[key].questions[1]!,
        diagram = q.diagram!;
      if (diagram.kind !== 'dot-distribution')
        throw Error('Four distinct-ID records need a visible plot');
      expect(diagram.values).toHaveLength(4);
      const counts = new Map<number, number>();
      for (const value of diagram.values)
        counts.set(value, (counts.get(value) ?? 0) + 1);
      expect([...counts.values()]).toEqual([2, 2]);
      const summary = dataSummary(diagram.values.map(String));
      expect(textR(summary.mean)).toBe(mean);
      expect(textR(summary.variance!)).toBe(variance);
      const mu = Number(mean),
        sd = Math.sqrt(Number(variance));
      expect(
        diagram.values.every((v) => counts.get(2 * mu - v) === counts.get(v)),
      ).toBe(true);
      expect(diagram.values.filter((v) => Math.abs(v - mu) <= sd)).toHaveLength(
        4,
      );
      expect(diagram.values.filter((v) => Math.abs(v - mu) < sd)).toHaveLength(
        0,
      );
      expect(q.solution.en).toContain('68%');
    }
  });
  it('checks squared spreads under both divisor conventions, exact reflected z values and positive/zero scale boundaries', () => {
    for (const [
      raw,
      ss,
      variance,
      sampleVariance,
      sd,
      sampleSd,
      c,
      d,
      muPrime,
      varPrime,
    ] of [
      [
        ['3', '5', '5', '7'],
        '8',
        '2',
        '8/3',
        '√2',
        '2√6/3',
        '-2',
        '10',
        '0',
        '8',
      ],
      [
        ['2', '5', '5', '8'],
        '18',
        '9/2',
        '6',
        '3√2/2',
        '√6',
        '-3',
        '20',
        '5',
        '81/2',
      ],
    ] as const) {
      const summary = dataSummary(raw),
        sample = dataSummary(raw, 'sample');
      expect(textR(summary.mean)).toBe('5');
      expect(textR(summary.ss)).toBe(ss);
      expect(textR(summary.variance!)).toBe(variance);
      expect(textR(sample.variance!)).toBe(sampleVariance);
      expect(
        checkRadical(radicalText(principalRadical(summary.variance!)), sd),
      ).toBe(true);
      expect(
        checkRadical(radicalText(principalRadical(sample.variance!)), sampleSd),
      ).toBe(true);
      expect(checkRadical(`(${Number(raw[0]) - 5})/(${sd})`, '-√2')).toBe(true);
      const changed = transformData(raw, c, d),
        next = dataSummary(changed);
      expect(textR(next.mean)).toBe(muPrime);
      expect(textR(next.variance!)).toBe(varPrime);
      const nextSD = radicalText(principalRadical(next.variance!));
      expect(
        checkRadical(`(${changed[0]}-(${muPrime}))/(${nextSD})`, '√2'),
      ).toBe(true);
      const positive = transformData(raw, '2', '5'),
        positiveSummary = dataSummary(positive),
        positiveSD = radicalText(principalRadical(positiveSummary.variance!));
      expect(textR(positiveSummary.mean)).toBe('15');
      expect(checkRadical(`(${positive[0]}-15)/(${positiveSD})`, '-√2')).toBe(
        true,
      );
      expect(next.variance).toEqual(mulR(mulR(R(c), R(c)), summary.variance!));
    }
    expect(equalPolynomial('(c*d)^2', 'c^2*d^2', ['c', 'd'])).toBe(true);
    expect(textR(dataSummary(['5', '5', '5', '5']).variance!)).toBe('0');
    expect(zScore('5', '5', '0')).toBeNull();
  });
  it('proves both whole-parameter SSE identities and distinguishes unique original predictions from nonidentified slopes and new-input predictions', () => {
    for (const [x, ys, mean, b, intercept, nextPrediction] of [
      ['2', ['1', '4', '7'], '4', '1', '2', '5'],
      ['3', ['2', '5', '8'], '5', '2', '-1', '7'],
    ] as const) {
      const rows = ys.map((y, i) => ({ id: `ID${i + 1}`, x, y })),
        fit = leastSquares(rows);
      expect(fit.slope).toBeNull();
      expect(fit.intercept).toBeNull();
      expect(textR(fit.sxx)).toBe('0');
      expect(textR(fit.sse)).toBe('18');
      expect(fit.rows.map((r) => textR(r.residual))).toEqual(['-3', '0', '3']);
      expect(regressionPrediction(rows, x)).toEqual(R(mean));
      expect(regressionPrediction(rows, `${Number(x) + 1}`)).toBeNull();
      const expression = ys.map((y) => `(${y}-(a+${x}b))^2`).join('+');
      expect(
        equalPolynomial(expression, `18+3(a+${x}b-${mean})^2`, ['a', 'b']),
      ).toBe(true);
      expect(textR(candidateFit(rows, mean, '0').sse)).toBe('18');
      expect(textR(candidateFit(rows, intercept, b).sse)).toBe('18');
      const next = addR(R(intercept), mulR(R(b), R(`${Number(x) + 1}`)));
      expect(textR(next)).toBe(nextPrediction);
      expect(next).not.toEqual(R(mean));
    }
  });
});
