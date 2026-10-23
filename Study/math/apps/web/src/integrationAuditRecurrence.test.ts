import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { integrationAuditRetrieval } from './content/integrationAuditRetrieval';
import { integrationAuditRecurrence } from './content/integrationAuditRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { rational, addR, mulR, divR, negR, textR } from './algebraModels';
import { readRational } from './rationalModels';
import { solveQuadratic, quadraticCandidateAudit } from './quadraticModels';
import { radicalText } from './radicalModels';
import { parabolaAt } from './parabolaModels';
import { equalPolynomial } from './polynomialModels';
const f = (n: number) => rational(BigInt(n));
const sets = Object.values(integrationAuditRetrieval);
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
describe('integration evidence and strategy recurrence', () => {
  it('covers all three remaining J98 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J98-L02', 'J98-L03', 'J98-L04'].includes(l.id))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(3);
    expect(new Set(integrationAuditRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of integrationAuditRecurrence) {
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
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps six bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(6);
    for (const s of sets) {
      expect(s.questions).toHaveLength(3);
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
  it('interpolates from the actual complete plotted vertices, checks all slopes and keeps display space outside the domain', () => {
    for (const [u, query, wanted, rates] of [
      ['H28', ['5/2', '4', '13/2'], ['7', '6', '3'], ['-2', '0', '-2']],
      ['H38', ['3/2', '3', '11/2'], ['14', '12', '6'], ['-4', '0', '-4']],
    ] as const) {
      const q = integrationAuditRetrieval[u].questions[0]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian')
        throw new Error('Expected actual complete Cartesian graph');
      const points = d.curves![0]!.points;
      expect(points).toEqual(d.points);
      expect(points).toHaveLength(4);
      const end = points.at(-1)!;
      expect(end.y).toBe(0);
      expect(d.bounds.xMax).toBeGreaterThan(end.x);
      const actualRates = points
        .slice(1)
        .map((b, i) => divR(f(b.y - points[i]!.y), f(b.x - points[i]!.x)));
      expect(actualRates.map(textR)).toEqual(rates);
      for (const [i, raw] of query.entries()) {
        const x = readRational(raw),
          a = points[i]!;
        const output = addR(
          f(a.y),
          mulR(actualRates[i]!, addR(x, negR(f(a.x)))),
        );
        expect(textR(output)).toBe(wanted[i]);
        expect(q.solution.zh).toContain(`${wanted[i]}L`);
      }
      expect(d.xLabel).toBe('t / min');
      expect(d.yLabel).toBe('V / L');
      expect(d.caption!.en).toContain(`only for 0≤t≤${end.x}`);
      for (const p of points)
        for (const lang of ['zh', 'en'] as const)
          expect(d.caption![lang]).toContain(`${p.label}(${p.x},${p.y})`);
    }
  });
  it('checks discrete half-pack counterexamples and explicit competing rules through all observations', () => {
    for (const [u, rate, initial, last, one, two, query, f1, f2, outputs] of [
      ['H28', 4, 2, 5, [0, 0], [1, 1], 2, 'x', 'x^2', ['2', '4']],
      ['H38', 6, 1, 4, [1, 2], [2, 4], 3, '2x', '2x+(x-1)(x-2)', ['6', '8']],
    ] as const) {
      expect(rate / 2 + initial).toBe(4);
      expect(Array.from({ length: last + 1 }, (_, n) => n)).not.toContain(0.5);
      for (const [x, y] of [one, two])
        for (const source of [f1, f2])
          expect(textR(parabolaAt(source, f(x)))).toBe(`${y}`);
      expect(equalPolynomial(f1, f2)).toBe(false);
      expect(
        [f1, f2].map((source) => textR(parabolaAt(source, f(query)))),
      ).toEqual(outputs);
      expect(integrationAuditRetrieval[u].questions[0]!.solution.zh).toContain(
        '半包',
      );
    }
  });
  it('checks every rectangle root and original quantity, then derives average speed from separate distance/time branches', () => {
    for (const [
      u,
      offset,
      area,
      negative,
      length,
      perimeter,
      distance,
      v1,
      v2,
      totalDistance,
      average,
    ] of [
      ['H28', 2, 24, '-6', 6, 20, 6, 3, 2, 12, '12/5'],
      ['H38', 3, 28, '-7', 7, 22, 12, 4, 6, 24, '24/5'],
    ] as const) {
      const source = `x(x+${offset})=${area}`;
      expect(new Set(solveQuadratic(source).roots!.map(radicalText))).toEqual(
        new Set([negative, '4']),
      );
      expect(quadraticCandidateAudit(source, '4', 'positive')).toMatchObject({
        equationPass: true,
        contextPass: true,
      });
      expect(
        quadraticCandidateAudit(source, negative, 'positive'),
      ).toMatchObject({ equationPass: true, contextPass: false });
      expect(4 + offset).toBe(length);
      expect(4 * length).toBe(area);
      expect(2 * (4 + length)).toBe(perimeter);
      const time = addR(divR(f(distance), f(v1)), divR(f(distance), f(v2)));
      expect(textR(time)).toBe('5');
      expect(distance * 2).toBe(totalDistance);
      expect(textR(divR(f(totalDistance), time))).toBe(average);
      expect(textR(divR(f(v1 + v2), f(2)))).not.toBe(average);
      expect(integrationAuditRetrieval[u].questions[1]!.solution.zh).toContain(
        `${perimeter}cm`,
      );
    }
  });
  it('checks actual omitted-root counterexamples and premise-based length verification while leaving prose to humans', () => {
    expect(quadraticCandidateAudit('x^2=9', '-3')!.equationPass).toBe(true);
    expect(quadraticCandidateAudit('x^2-2x=0', '0')!.equationPass).toBe(true);
    expect(5 * 5 + 12 * 12).toBe(13 * 13);
    expect(3 * 3 + 4 * 4).toBe(5 * 5);
    for (const s of sets) {
      const q = s.questions[2]!;
      expect(q.stem.en).toContain('cm²');
      expect(q.solution.en).toMatch(/wrong.*unit|unit.*wrong/);
      expect(
        checkAnswer('verified because the digits match cm²', q.answer),
      ).toBeNull();
    }
  });
});
