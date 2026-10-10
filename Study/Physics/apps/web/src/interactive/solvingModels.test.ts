import { describe, it, expect } from 'vitest';
import {
  arrivalModel,
  energyModel,
  springModel,
  densityModel,
  solvingKinds,
  solvingCase,
  solvingProblem,
  solvingSteps,
  reasoningSteps,
  strictNumber,
  checkReasonAnswer,
  solvedPrefix,
  blankReasonDraft,
  decodeReasonDrafts,
  reasoningReport,
  type SolvingKind,
  type ReasonDraft,
} from './solvingModels';
import { solvingLessons } from '../content/solving';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
const solved = (kind: SolvingKind, i: number): ReasonDraft => ({
  step: 7,
  input: '',
  answers: reasoningSteps(solvingProblem(kind, i)).map((s) =>
    s.numeric ? String(s.numeric.expected) : s.correct,
  ),
});
const encode = (cases: unknown[]) => JSON.stringify({ version: 1, cases });
describe('eight-step reasoning preserves physical meaning and evidence', () => {
  it('checks arrival by substitution and distinguishes no travel from no target distance', () => {
    for (const [d, v] of [
      [120, 2],
      [240, 4],
      [5, 0.5],
    ]) {
      const m = arrivalModel(d!, v!);
      expect(m.seconds! * v!).toBeCloseTo(d!);
    }
    expect(arrivalModel(120, 0).seconds).toBeNull();
    expect(arrivalModel(0, 0).seconds).toBe(0);
  });
  it('conserves supplied usable energy and converts duration to minutes', () => {
    const a = energyModel(1200, 2),
      b = energyModel(1200, 4),
      c = energyModel(2400, 2);
    expect(a.seconds).toBe(600);
    expect(a.minutes).toBe(10);
    expect(b.seconds).toBe(a.seconds / 2);
    expect(c.seconds).toBe(a.seconds * 2);
    for (const m of [a, b, c]) expect(m.power * m.seconds).toBe(m.energy);
  });
  it('balances gravity with spring force while separating extension from total length', () => {
    for (const [mass, g] of [
      [1, 10],
      [2, 10],
      [1, 1.6],
    ]) {
      const m = springModel(mass!, g!, 100);
      expect(m.stiffness * m.metres).toBeCloseTo(m.weight);
      expect(m.centimetres).toBeCloseTo(m.metres * 100);
      expect(m.totalCentimetres - m.centimetres).toBe(20);
    }
    expect(springModel(1, 1.6, 100).centimetres).toBe(1.6);
  });
  it('retains calculable partial immersion but rejects it as validated whole-solid density', () => {
    const a = densityModel(54, 50, 70, true),
      b = densityModel(108, 50, 90, true),
      c = densityModel(54, 50, 62, false);
    expect(a.apparentDensity).toBe(2.7);
    expect(b.apparentDensity).toBe(a.apparentDensity);
    expect(c).toMatchObject({ volume: 12, apparentDensity: 4.5, valid: false });
    expect(c.mass).toBe(a.mass);
  });
  it('rejects nonfinite values, zero denominators and cases outside the model', () => {
    for (const fn of [
      () => arrivalModel(NaN, 2),
      () => arrivalModel(1, -1),
      () => energyModel(1200, 0),
      () => energyModel(Infinity, 2),
      () => springModel(1, 10, 0),
      () => springModel(-1, 10, 100),
      () => densityModel(54, 50, 50, true),
      () => densityModel(54, 70, 50, true),
      () => densityModel(54, 50, Infinity, true),
      () => solvingCase(0.5),
      () => solvingCase(3),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('uses all twelve teaching scenarios with stated quantities and conditions', () => {
    const expected = [
      [60, 60, null],
      [600, 300, 1200],
      [10, 20, 1.6],
      [2.7, 2.7, 4.5],
    ];
    solvingKinds.forEach((k, j) =>
      [0, 1, 2].forEach((i) => {
        const p = solvingProblem(k, i);
        expect(p.result).toBe(expected[j]![i]);
        for (const pair of [
          p.name,
          p.story,
          p.known,
          p.assumptions,
          p.resultLabel,
          p.equation,
        ])
          expect(pair.every(Boolean)).toBe(true);
        expect(p.row.length).toBeGreaterThan(1);
      }),
    );
  });
  it('requires the eight plan steps in order, with one supported choice at each choice step', () => {
    expect(solvingSteps).toHaveLength(8);
    for (const k of solvingKinds)
      for (let i = 0; i < 3; i++) {
        const steps = reasoningSteps(solvingProblem(k, i));
        expect(steps.map((s) => s.title)).toEqual(solvingSteps);
        for (const s of steps) {
          expect(s.feedback.every(Boolean)).toBe(true);
          if (s.numeric) expect(s.options).toHaveLength(0);
          else {
            expect(
              s.options.filter((o) => checkReasonAnswer(s, o.id)),
            ).toHaveLength(1);
            expect(s.options.every((o) => o.text.every(Boolean))).toBe(true);
          }
        }
      }
  });
  it('places supported choices at varied positions without changing their meaning', () => {
    const positions = new Set<number>();
    for (const k of solvingKinds)
      for (let i = 0; i < 3; i++)
        for (const s of reasoningSteps(solvingProblem(k, i)))
          if (!s.numeric)
            positions.add(s.options.findIndex((o) => o.id === s.correct));
    expect([...positions].sort()).toEqual([0, 1, 2]);
  });
  it('accepts explicit finite decimals and scientific notation, never blank or unit-bearing strings', () => {
    expect(strictNumber(' 6e2 ')).toBe(600);
    expect(strictNumber('+.016')).toBe(0.016);
    expect(strictNumber('0')).toBe(0);
    for (const v of [
      '',
      ' ',
      '0x10',
      'NaN',
      'Infinity',
      '1e999',
      '60 s',
      '1,200',
      '2*3',
      '1'.repeat(41),
    ])
      expect(strictNumber(v)).toBeNull();
  });
  it('checks numerical rounding, not truthy strings or unsupported choice IDs', () => {
    const s = reasoningSteps(solvingProblem('energy', 0))[5]!;
    expect(checkReasonAnswer(s, '600.5')).toBe(true);
    expect(checkReasonAnswer(s, '601')).toBe(false);
    expect(checkReasonAnswer(s, 600)).toBe(false);
    expect(checkReasonAnswer(s, '')).toBe(false);
    expect(
      checkReasonAnswer(
        reasoningSteps(solvingProblem('arrival', 2))[5]!,
        'no-arrival',
      ),
    ).toBe(true);
  });
  it('requires a contiguous verified prefix; later correct answers cannot bypass an earlier error', () => {
    const p = solvingProblem('density', 2),
      d = solved('density', 2);
    expect(solvedPrefix(p, d.answers)).toBe(8);
    d.answers[3] = 'identify';
    expect(solvedPrefix(p, d.answers)).toBe(3);
    expect(solvedPrefix(p, [])).toBe(0);
  });
  it('recovers fresh independent drafts from corrupted or oversized storage', () => {
    for (const raw of [
      null,
      '{',
      'null',
      '[]',
      '{"version":2,"cases":[]}',
      'x'.repeat(16001),
      encode([null, 4, {}]),
    ]) {
      const d = decodeReasonDrafts('arrival', raw);
      expect(d).toEqual(Array.from({ length: 3 }, blankReasonDraft));
      d[0]!.answers[0] = 'changed';
      expect(d[1]!.answers[0]).toBeNull();
    }
  });
  it('revalidates persisted answers instead of trusting a completed flag or requested step', () => {
    const d = solved('arrival', 0);
    d.answers[2] = 'bad';
    const read = decodeReasonDrafts(
      'arrival',
      encode([{ ...d, step: 99, completed: true }, solved('arrival', 1)]),
    );
    expect(read[0]!.step).toBe(2);
    expect(read[0]!.answers[2]).toBe('bad');
    expect(read[0]!.answers.slice(3)).toEqual(Array(5).fill(null));
    expect(solvedPrefix(solvingProblem('arrival', 1), read[1]!.answers)).toBe(
      8,
    );
    expect(read[2]).toEqual(blankReasonDraft());
  });
  it('bounds restored input, step and answer types without treating an empty calculation as zero', () => {
    const d = decodeReasonDrafts(
      'energy',
      encode([
        { step: -4, input: 'x'.repeat(100), answers: [42, {}, 'x'.repeat(41)] },
      ]),
    )[0]!;
    expect(d.step).toBe(0);
    expect(d.input).toHaveLength(40);
    expect(d.answers).toEqual(Array(8).fill(null));
    const zero = reasoningSteps({
      ...solvingProblem('energy', 0),
      result: 0,
    })[5]!;
    expect(checkReasonAnswer(zero, '')).toBe(false);
    expect(checkReasonAnswer(zero, '0')).toBe(true);
  });
  it('exports only fully checked cases, preserving all eight bilingual steps and original units', () => {
    const report = reasoningReport('arrival', [
      solved('arrival', 0),
      blankReasonDraft(),
      solved('arrival', 2),
    ]);
    expect(report.match(/^## /gm)).toHaveLength(2);
    for (const s of solvingSteps) expect(report).toContain(`${s[0]} / ${s[1]}`);
    expect(report).toContain('120 m');
    expect(report).toContain('No finite arrival time');
    expect(report).toContain('not personal measurements');
  });
  it('keeps invalid density evidence in the report with its procedural limitation', () => {
    const report = reasoningReport('density', [
      blankReasonDraft(),
      blankReasonDraft(),
      solved('density', 2),
    ]);
    expect(report).toContain('4.5 g/cm³');
    expect(report).toContain('reject it as valid density');
    expect(report).toContain('50');
    expect(report).toContain('62');
  });
  it('registers four complete bilingual courses, their stations and catalog bodies in plan order', () => {
    expect(lessons.slice(143, 147)).toEqual(solvingLessons);
    expect(solvingLessons.map((l) => l.kind)).toEqual(
      solvingKinds.map((k) => `solving-${k}`),
    );
    for (const l of solvingLessons) {
      expect(l.stage).toBe(4);
      expect(l.unit).toBe('solving');
      expect(lessonCatalog.find((c) => c.id === l.id)?.kind).toBe(l.kind);
      expect(experiments.some((e) => e.id === l.kind)).toBe(true);
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit])
        expect(q.options[q.correct]).toBeDefined();
      for (const t of [
        l.title,
        l.hook,
        l.concept,
        l.example,
        l.summary,
        l.homeExperiment,
      ])
        expect(t.zh && t.en).toBeTruthy();
    }
  });
});
