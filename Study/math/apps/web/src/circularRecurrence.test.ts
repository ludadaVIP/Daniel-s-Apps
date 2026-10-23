import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { circularRecurrenceRetrieval } from './content/circularRecurrenceRetrieval';
import { circularRecurrenceEvidence } from './content/circularRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  circularAt,
  circularSolutions,
  degreeToPi,
  waveModel,
  checkCircleIdentity,
} from './circularModels';
import { addR, mulR, negR, textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { checkRadical } from './radicalModels';
const sets = Object.values(circularRecurrenceRetrieval);
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
describe('circular recurrence', () => {
  it('covers all six H04 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H04')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(circularRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of circularRecurrenceEvidence) {
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

  it('retains complete winding, directed arc ratios and radius invariance', () => {
    for (const [unit, degrees, radius, angle, arc, representative, turns] of [
      ['H32', '-750', '3', '-25/6', '-25/2', '-1/6', '-2'],
      ['H36', '1110', '4', '37/6', '74/3', '1/6', '3'],
    ] as const) {
      expect(textR(degreeToPi(degrees))).toBe(angle);
      expect(textR(mulR(R(radius), R(angle)))).toBe(arc);
      expect(textR(addR(R(representative), mulR(R('2'), R(turns))))).toBe(
        angle,
      );
      expect(textR(mulR(R(`${2 * Number(radius)}`), R(angle)))).toBe(
        textR(mulR(R('2'), R(arc))),
      );
      expect(
        circularRecurrenceRetrieval[unit].questions[0]!.solution.en,
      ).toContain('radian');
    }
  });
  it('checks signed coordinates and ratios while rejecting zero-cosine tangent', () => {
    for (const [angle, cos, sin, tan] of [
      ['-5/6', '-√3/2', '-1/2', '√3/3'],
      ['5/3', '1/2', '-√3/2', '-√3'],
    ] as const) {
      const point = circularAt(angle);
      for (const [actual, wanted] of [
        [point.cos, cos],
        [point.sin, sin],
        [point.tan!, tan],
      ] as const)
        expect(checkRadical(actual, wanted)).toBe(true);
    }
    for (const angle of ['1/2', '3/2'])
      expect(circularAt(angle).tan).toBeNull();
  });
  it('checks coordinate traces and exact half-turn counterexamples without using samples as a universal period proof', () => {
    const angles = ['0', '1/2', '1', '3/2', '2'];
    expect(angles.map((a) => circularAt(a).sin)).toEqual([
      '0',
      '1',
      '0',
      '-1',
      '0',
    ]);
    expect(angles.map((a) => circularAt(a).cos)).toEqual([
      '1',
      '0',
      '-1',
      '0',
      '1',
    ]);
    expect(circularAt('1/2').sin).not.toBe(circularAt('3/2').sin);
    expect(circularAt('0').cos).not.toBe(circularAt('1').cos);
    for (const set of sets) {
      expect(set.questions[2]!.solution.en).toContain('every');
      expect(set.questions[2]!.solution.en).toContain('at least2π');
    }
  });
  it('checks all ten transformed points, ranges, reciprocal scales and zero-amplitude periods', () => {
    for (const [unit, p, xs, ys, amplitude, period] of [
      [
        'H32',
        { family: 'sin', a: '-3', b: '2', h: '1/6', d: '1' },
        ['1/6', '5/12', '2/3', '11/12', '7/6'],
        ['1', '-2', '1', '4', '1'],
        '3',
        '1',
      ],
      [
        'H36',
        { family: 'cos', a: '2', b: '-3', h: '-1/9', d: '-1' },
        ['-1/9', '-5/18', '-4/9', '-11/18', '-7/9'],
        ['1', '-1', '-3', '-1', '1'],
        '2',
        '2/3',
      ],
    ] as const) {
      expect(xs.map((x) => waveModel(p, x).output)).toEqual(ys);
      expect(xs.map((x) => textR(waveModel(p, x).argument))).toEqual([
        '0',
        '1/2',
        '1',
        '3/2',
        '2',
      ]);
      expect(textR(waveModel(p, '0').amplitude)).toBe(amplitude);
      expect(textR(waveModel(p, '0').period!)).toBe(period);
      expect(waveModel({ ...p, a: '0' }, '0').period).toBeNull();
      expect(waveModel({ ...p, a: '0' }, '0').output).toBe(p.d);
      const zeroInner =
        Number(p.a) * Number(circularAt('0')[p.family]) + Number(p.d);
      expect(zeroInner).toBe(1);
      expect(
        circularRecurrenceRetrieval[unit].questions[3]!.solution.en,
      ).toMatch(/(?:no LEAST|neither has a least) positive period/);
    }
  });
  it('verifies circle identities and exact refutation while preserving original denominator exclusions', () => {
    expect(checkCircleIdentity('s^2+c^2', '1')).toBe(true);
    expect(checkCircleIdentity('1-c^2', 's^2')).toBe(true);
    expect(checkCircleIdentity('1-s^2', 'c^2')).toBe(true);
    expect(checkCircleIdentity('s+c', '1')).toBe(false);
    const p = circularAt('1/4');
    expect(checkRadical(`(${p.sin})+(${p.cos})`, '√2')).toBe(true);
    expect(circularAt('0').sin).toBe('0');
    expect(circularAt('1/2').cos).toBe('0');
    for (const set of sets)
      expect(set.questions[4]!.solution.en).toContain('0/0');
  });
  it('generates both transformed root branches, exact endpoint filtering and out-of-range empty sets', () => {
    for (const [unit, p, wanted] of [
      [
        'H32',
        {
          family: 'sin',
          b: '2',
          h: '1/6',
          target: '1/2',
          low: '-5/12',
          high: '19/12',
          lowClosed: true,
          highClosed: false,
        },
        ['-5/12', '1/4', '7/12', '5/4'],
      ],
      [
        'H36',
        {
          family: 'cos',
          b: '-3',
          h: '-1/9',
          target: '1/2',
          low: '-2/3',
          high: '2/3',
          lowClosed: true,
          highClosed: false,
        },
        ['-2/3', '-2/9', '0', '4/9'],
      ],
    ] as const) {
      const roots = circularSolutions(p);
      expect(roots.map(textR)).toEqual(wanted);
      expect(circularSolutions({ ...p, lowClosed: false }).map(textR)).toEqual(
        wanted.slice(1),
      );
      expect(circularSolutions({ ...p, highClosed: true }).map(textR)).toEqual([
        ...wanted,
        p.high,
      ]);
      expect(circularSolutions({ ...p, target: '2' })).toEqual([]);
      for (const root of roots) {
        const inner = mulR(R(p.b), addR(root, negR(R(p.h))));
        expect(checkRadical(circularAt(textR(inner))[p.family], p.target)).toBe(
          true,
        );
      }
      expect(
        circularRecurrenceRetrieval[unit].questions[5]!.solution.en,
      ).toContain('k=−1,0');
    }
  });
});
