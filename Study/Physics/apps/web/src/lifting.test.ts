import { describe, expect, it } from 'vitest';
import { decodeProgress, freshLesson } from './progress';
import { decodePeriscope, emptyPeriscope } from './periscope';
import {
  decodeLifting,
  defaultLiftingDesign,
  emptyLifting,
  emptyLiftingTrial,
  liftingFieldLimits,
  liftingHasData,
  liftingState,
  liftingTrial,
  reviseLiftingField,
  reviseLiftingTrial,
  type LiftingDraft,
} from './lifting';
import { liftingMarkdown, liftingFields } from './liftingReport';
import { liftingArms, liftingComparison } from './liftingDesign';
function complete(): LiftingDraft {
  return {
    ...emptyLifting(),
    fields: Object.fromEntries(
      Object.keys(liftingFieldLimits).map((key) => [
        key,
        `Own ${key} evidence`,
      ]),
    ),
    buildChecked: true,
    fairChecked: true,
    trials: ['10', '20', '10.0'].map((effortArmCm) => ({
      ...emptyLiftingTrial(),
      effortArmCm,
      loadArmCm: '5',
      result: 'none',
      observation: 'The cup did not lift; my finger moved a little.',
      checked: true,
    })),
  };
}
describe('saved lifting evidence', () => {
  it('keeps navigation and example models from inventing evidence', () => {
    const d = { ...emptyLifting(), step: 3, updatedAt: 100 };
    expect(liftingHasData(d)).toBe(false);
    expect(liftingState(d).completed).toBe(false);
    expect(d.trials.every((r) => !liftingTrial(r).entered)).toBe(true);
    expect(liftingHasData({ ...d, design: { ...d.design, weight: 50 } })).toBe(
      true,
    );
    expect(
      liftingState({ ...d, design: { ...d.design, weight: 50 } }).used,
    ).toHaveLength(0);
  });
  it('permits an honest all-unsuccessful investigation without optional instruments', () => {
    const d = complete();
    expect(liftingState(d)).toMatchObject({ completed: true, compared: true });
    expect(liftingTrial(d.trials[0]!)).toMatchObject({
      payloadG: undefined,
      effortN: undefined,
      handTravelCm: undefined,
      liftCm: undefined,
      valid: true,
    });
    expect(liftingMarkdown(d)).toContain('没有抬起 / No lift');
  });
  it('requires two hand settings and a repeat at one normalized load mark', () => {
    const d = complete();
    d.trials[2]!.loadArmCm = '５.０００';
    expect(liftingState(d).completed).toBe(true);
    d.trials[2]!.effortArmCm = '30';
    expect(liftingState(d).compared).toBe(false);
    d.trials[2]!.effortArmCm = '10';
    d.trials[1]!.effortArmCm = '10';
    expect(liftingState(d).compared).toBe(false);
    d.trials[1]!.effortArmCm = '20';
    d.trials[1]!.loadArmCm = '6';
    expect(liftingState(d).compared).toBe(false);
  });
  it('does not infer identical apparatus from matching numbers alone', () => {
    const d = complete();
    d.fairChecked = false;
    expect(liftingState(d).completed).toBe(false);
    d.fairChecked = true;
    d.fields.construction = '';
    expect(liftingState(d).completed).toBe(false);
    expect(liftingFields.map((f) => f.key)).toEqual(
      Object.keys(liftingFieldLimits),
    );
  });
  it('rejects invalid decimals and contradictory results while retaining raw values', () => {
    const r = complete().trials[0]!;
    for (const effortArmCm of [
      '0',
      '-1',
      '101',
      'Infinity',
      '1e1',
      '10 cm',
      '10.1234',
    ])
      expect(liftingTrial({ ...r, effortArmCm })).toMatchObject({
        valid: false,
        used: false,
        unresolved: true,
      });
    for (const patch of [
      { payloadG: '201' },
      { effortN: '0' },
      { effortN: '51' },
      { handTravelCm: '201' },
      { liftCm: '21' },
      { liftCm: '0.5' },
    ])
      expect(liftingTrial({ ...r, ...patch }).valid).toBe(false);
    expect(liftingTrial({ ...r, handTravelCm: '0', liftCm: '0' }).valid).toBe(
      true,
    );
    expect(liftingTrial({ ...r, result: 'partial', liftCm: '0' }).valid).toBe(
      false,
    );
    const d = complete();
    d.trials[0]!.effortN = 'a reading?';
    expect(liftingMarkdown(d)).toContain('a reading?');
    expect(liftingState(d).completed).toBe(false);
  });
  it('keeps pending exclusions used until a reason, and retains reversible exclusions', () => {
    let d = complete();
    d.trials[1]!.excluded = true;
    expect(liftingState(d).used).toHaveLength(3);
    expect(liftingState(d).completed).toBe(false);
    d = reviseLiftingTrial(d, 1, { reason: 'Pivot slid sideways.' });
    expect(liftingState(d).used).toHaveLength(2);
    expect(d.trials[1]!.checked).toBe(true);
    expect(liftingMarkdown(d)).toContain('Pivot slid sideways.');
    d = reviseLiftingTrial(d, 1, { excluded: false });
    expect(liftingState(d).completed).toBe(true);
  });
  it('blocks unexplained additional rows but accepts reasoned excluded setup failures', () => {
    const d = complete();
    d.trials.push(emptyLiftingTrial());
    expect(liftingState(d).completed).toBe(true);
    d.trials[3]!.observation = 'Cup slipped';
    expect(liftingState(d).completed).toBe(false);
    d.trials[3]!.excluded = true;
    d.trials[3]!.reason = 'Tape detached before pressing.';
    expect(liftingState(d).completed).toBe(true);
  });
  it('requires confirmation again after apparatus revisions without deleting observations', () => {
    for (const key of ['materials', 'procedure', 'construction']) {
      const d = reviseLiftingField(complete(), key, 'Changed setup');
      expect(d.buildChecked).toBe(false);
      expect(d.fairChecked).toBe(false);
      expect(
        d.trials.every((r) => !r.checked && r.observation.length > 0),
      ).toBe(true);
      expect(liftingState(d).completed).toBe(false);
    }
    expect(
      liftingState(
        reviseLiftingField(complete(), 'explanation', 'Revised reasoning'),
      ).completed,
    ).toBe(true);
  });
  it('invalidates only edited trial checks and never treats model redesign as a physical revision', () => {
    const d = complete(),
      revised = reviseLiftingTrial(d, 1, { observation: 'Rechecked result' });
    expect(revised.trials.map((r) => r.checked)).toEqual([true, false, true]);
    expect(
      liftingState({ ...d, design: { ...d.design, efficiency: 0.5 } })
        .completed,
    ).toBe(true);
    expect(
      reviseLiftingTrial(d, 0, { effortArmCm: '10' }).trials[0]!.checked,
    ).toBe(true);
  });
  it('bounds hostile drafts, restores missing design defaults and preserves finite originals', () => {
    expect(decodeLifting(null)).toBeUndefined();
    expect(decodeLifting({ fields: [], trials: [] })).toBeUndefined();
    const d = decodeLifting({
      fields: { question: 'x'.repeat(1000), unknown: 'ignored' },
      trials: Array.from({ length: 20 }, () => ({
        effortN: 'y'.repeat(50),
        observation: 'z'.repeat(900),
        reason: 'r'.repeat(600),
        checked: 'true',
        result: 'fake',
      })),
      design: {
        weight: Infinity,
        efficiency: -1,
        heightCm: 3,
        effortArmCm: 1000,
      },
      step: 999,
      updatedAt: Infinity,
    })!;
    expect(d.trials).toHaveLength(8);
    expect(d.fields.question).toHaveLength(800);
    expect(d.fields.unknown).toBeUndefined();
    expect(d.design).toEqual({ ...defaultLiftingDesign(), heightCm: 3 });
    expect(d.trials[0]).toMatchObject({ checked: false, result: 'unrecorded' });
    expect(d.trials[0]!.effortN).toHaveLength(16);
    expect(d.trials[0]!.reason).toHaveLength(500);
    expect(d.trials[0]!.observation).toHaveLength(800);
    expect(d.step).toBe(3);
    expect(d.updatedAt).toBe(0);
    expect(decodeLifting({ fields: {}, trials: [null] })!.trials).toHaveLength(
      3,
    );
  });
  it('round-trips alongside existing project and lesson progress', () => {
    const d = complete(),
      lesson = freshLesson();
    const decoded = decodeProgress(
      JSON.stringify({
        lessons: { 'machines-longer-handle': lesson },
        notes: [],
        periscopeProject: emptyPeriscope(),
        liftingProject: d,
      }),
    );
    expect(decoded.liftingProject).toEqual(d);
    expect(decoded.periscopeProject).toEqual(decodePeriscope(emptyPeriscope()));
    expect(decoded.lessons['machines-longer-handle']).toEqual(lesson);
    expect(liftingState(decoded.liftingProject!).completed).toBe(true);
  });
  it('exports bilingual separated model/actual evidence with blank and excluded rows retained', () => {
    const d = complete();
    d.trials[1]!.observation = 'A | B\nNot lifted';
    d.trials[1]!.excluded = true;
    d.trials[1]!.reason = 'Moved pivot';
    d.trials.push(emptyLiftingTrial());
    const report = liftingMarkdown(d);
    expect(report).toContain('A \\| B<br>Not lifted');
    expect(report).toContain('Moved pivot');
    expect(report).toContain('| 4 |');
    expect(report).toContain('未测量或未填写 / Not measured or entered');
    expect(report).toContain('模型设计方案 / Model design');
    expect(report).toContain('My physical trials');
    expect(report).toContain('required values, not measurements');
    expect(report).toContain('| --- | --- | --- | --- |\n| 10 cm |');
    expect(report).not.toMatch(/\|\n\n\|/);
    expect(report).toContain('进行中 / In progress');
    expect(report).toContain('Own explanation evidence');
  });
});
describe('lifting design constraints and energy', () => {
  it('compares the force-distance bargain and selects only the fitting example', () => {
    const d = defaultLiftingDesign(),
      rows = liftingArms.map((arm) => liftingComparison(d, arm));
    expect(rows.map((r) => r.force)).toEqual([50, 25, 12.5]);
    expect(rows.map((r) => r.handTravelCm)).toEqual([2, 4, 8]);
    expect(rows.map((r) => r.feasible)).toEqual([false, false, true]);
    for (const m of rows) {
      expect(m.outputWork).toBeCloseTo(0.8);
      expect(m.inputWork).toBeCloseTo(1);
      expect(m.loss).toBeCloseTo(0.2);
    }
  });
  it('separates insufficient travel and single-stroke limits and never animates an infeasible lift', () => {
    const d = defaultLiftingDesign();
    expect(liftingComparison({ ...d, travelLimitCm: 5 })).toMatchObject({
      forceOK: true,
      travelOK: false,
      feasible: false,
      currentLiftCm: 0,
    });
    expect(
      liftingComparison({ ...d, heightCm: 4, travelLimitCm: 20 }),
    ).toMatchObject({ strokeOK: false, feasible: false, currentLiftCm: 0 });
    expect(liftingComparison({ ...d, heightCm: 4 }).maxLiftCm).toBeCloseTo(
      2.58819045,
    );
  });
  it('keeps animation positions, work and losses consistent through the feasible stroke', () => {
    const d = defaultLiftingDesign();
    for (const p of [0, 0.25, 0.5, 1]) {
      const m = liftingComparison(d, 40, p);
      expect(m.currentHandCm).toBeCloseTo(4 * m.currentLiftCm);
      expect(m.currentOutputWork / (m.currentInputWork || 1)).toBeCloseTo(
        p ? 0.8 : 0,
      );
    }
    expect(liftingComparison(d, 40, 1).currentLiftCm).toBeCloseTo(2);
    expect(liftingComparison(d, 40, 1).currentInputWork).toBeCloseTo(1);
    const ideal = liftingComparison({ ...d, efficiency: 1 });
    expect(ideal.loss).toBe(0);
    expect(ideal.force).toBe(10);
  });
  it('rejects non-finite, unbounded and invalid stroke input', () => {
    const d = defaultLiftingDesign();
    for (const bad of [
      { ...d, weight: NaN },
      { ...d, heightCm: 0 },
      { ...d, efficiency: 0 },
      { ...d, forceLimit: Infinity },
    ])
      expect(() => liftingComparison(bad)).toThrow(RangeError);
    for (const arm of [NaN, 0, 41])
      expect(() => liftingComparison(d, arm)).toThrow(RangeError);
    for (const p of [-1, 1.01, Infinity])
      expect(() => liftingComparison(d, 40, p)).toThrow(RangeError);
  });
});
