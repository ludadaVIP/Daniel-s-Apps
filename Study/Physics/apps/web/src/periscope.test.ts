import { describe, expect, it } from 'vitest';
import { decodeProgress, freshLesson } from './progress';
import { emptyInsulation, decodeInsulation } from './insulation';
import { emptyPower, decodePower } from './power';
import {
  emptyPeriscope,
  emptyPeriscopeTrial,
  decodePeriscope,
  periscopeState,
  periscopeTrial,
  periscopeHasData,
  revisePeriscopeField,
  revisePeriscopeTrial,
  periscopeFields,
  type PeriscopeDraft,
} from './periscope';
import {
  periscopeMarkdown,
  periscopeFields as reportFields,
} from './periscopeReport';
function complete(): PeriscopeDraft {
  return {
    ...emptyPeriscope(),
    fields: Object.fromEntries(
      periscopeFields.map((f) => [f.key, `Own ${f.key} evidence`]),
    ),
    buildChecked: true,
    fairChecked: true,
    trials: ['Start', 'Turned', 'Start'].map((condition) => ({
      ...emptyPeriscopeTrial(),
      condition,
      result: 'not-visible',
      observation: 'No arrow seen; eye was at the marked window.',
      checked: true,
    })),
  };
}
describe('own periscope evidence', () => {
  it('keeps a blank draft blank after step navigation and permits honest unsuccessful observations', () => {
    expect(
      periscopeHasData({ ...emptyPeriscope(), step: 3, updatedAt: 100 }),
    ).toBe(false);
    expect(periscopeState(emptyPeriscope()).completed).toBe(false);
    expect(periscopeState(complete()).completed).toBe(true);
    const d = complete();
    d.trials[1]!.condition = ' start ';
    expect(periscopeState(d).completed).toBe(false);
    d.trials[1]!.condition = 'Different viewpoint';
    expect(periscopeState(d).conditions).toBe(2);
    d.fairChecked = false;
    expect(periscopeState(d).completed).toBe(false);
  });
  it('treats an angle as optional without turning missing, invalid or extreme values into measurements', () => {
    const r = complete().trials[0]!;
    expect(periscopeTrial(r)).toMatchObject({ angle: undefined, valid: true });
    for (const angle of ['0', '90', '４５.５'])
      expect(periscopeTrial({ ...r, angle }).valid).toBe(true);
    for (const angle of [
      '-1',
      '91',
      'Infinity',
      '1e1',
      '45 degrees',
      '45.1234',
    ])
      expect(periscopeTrial({ ...r, angle })).toMatchObject({
        angle: undefined,
        valid: false,
        used: false,
        unresolved: true,
      });
  });
  it('retains and resolves exclusions with reasons, requiring replacement evidence', () => {
    const d = complete();
    d.trials[1]!.excluded = true;
    expect(periscopeState(d)).toMatchObject({
      completed: false,
      used: expect.any(Array),
    });
    expect(periscopeState(d).used).toHaveLength(3);
    d.trials[1]!.reason = 'Eye moved from the marked viewpoint';
    expect(periscopeState(d).used).toHaveLength(2);
    expect(periscopeState(d).completed).toBe(false);
    d.trials.push({
      ...d.trials[1]!,
      excluded: false,
      reason: '',
      checked: true,
    });
    expect(periscopeState(d).completed).toBe(true);
    expect(d.trials[1]!.observation).toContain('No arrow');
    d.trials[1]!.excluded = false;
    expect(periscopeState(d).used).toHaveLength(4);
    d.trials.push({ ...emptyPeriscopeTrial(), angle: 'bad' });
    expect(periscopeState(d).completed).toBe(false);
    d.trials.at(-1)!.excluded = true;
    d.trials.at(-1)!.reason = 'Accidental entry, not a trial';
    expect(periscopeState(d).completed).toBe(true);
  });
  it('clears confirmations when relevant evidence or construction changes without erasing originals', () => {
    const d = complete();
    d.trials[1]!.excluded = true;
    d.trials[1]!.reason = 'Eye moved';
    const changed = revisePeriscopeTrial(d, 0, {
      observation: 'Only the left corner seen',
    });
    expect(changed.trials[0]!.checked).toBe(false);
    expect(changed.trials[2]!.checked).toBe(true);
    const rebuild = revisePeriscopeField(
      d,
      'construction',
      'Adjusted the upper opening',
    );
    expect(rebuild.buildChecked).toBe(false);
    expect(rebuild.fairChecked).toBe(false);
    expect(rebuild.trials.every((r) => !r.checked)).toBe(true);
    expect(rebuild.trials[1]).toMatchObject({
      observation: d.trials[1]!.observation,
      excluded: true,
      reason: 'Eye moved',
    });
    expect(
      revisePeriscopeField(d, 'question', 'A clearer prediction').trials,
    ).toEqual(d.trials);
    expect(
      revisePeriscopeField(d, 'construction', d.fields.construction!),
    ).toBe(d);
  });
  it('bounds hostile stored data and preserves older progress alongside a round-tripped draft', () => {
    expect(decodePeriscope(null)).toBeUndefined();
    expect(decodePeriscope({ fields: [], trials: [] })).toBeUndefined();
    const bad = decodePeriscope({
      fields: { question: 'q'.repeat(2000), injected: 'ignore' },
      trials: Array.from({ length: 40 }, () => ({
        condition: 'c'.repeat(400),
        result: '__proto__',
        checked: 'true',
        angle: 'bad',
        reason: 'r'.repeat(700),
      })),
      step: 99,
      updatedAt: Infinity,
    })!;
    expect(bad.trials).toHaveLength(8);
    expect(bad.trials[0]).toMatchObject({
      result: 'unrecorded',
      checked: false,
      angle: 'bad',
    });
    expect(bad.trials[0]!.condition).toHaveLength(300);
    expect(bad.trials[0]!.reason).toHaveLength(500);
    expect(bad.fields.question).toHaveLength(800);
    expect(bad.fields.injected).toBeUndefined();
    expect(bad).toMatchObject({ step: 3, updatedAt: 0 });
    const restored = decodeProgress(
      JSON.stringify({
        lessons: { 'physics-everywhere': freshLesson() },
        notes: [{ id: 'n', observation: 'old', question: 'why', createdAt: 1 }],
        powerProject: emptyPower(),
        insulationProject: emptyInsulation(),
        periscopeProject: complete(),
      }),
    );
    expect(restored.powerProject).toEqual(decodePower(emptyPower()));
    expect(restored.insulationProject).toEqual(
      decodeInsulation(emptyInsulation()),
    );
    expect(restored.lessons['physics-everywhere']).toEqual(freshLesson());
    expect(restored.notes[0]!.observation).toBe('old');
    expect(periscopeState(restored.periscopeProject!).completed).toBe(true);
    expect(decodePeriscope({ fields: {}, trials: [] })!.trials).toHaveLength(3);
  });
  it('exports original invalid and excluded records with bilingual interpretation limits', () => {
    expect(reportFields.map(({ key, max }) => ({ key, max }))).toEqual(
      periscopeFields,
    );
    const d = complete();
    d.trials[1] = {
      ...d.trials[1]!,
      angle: 'invalid',
      excluded: true,
      reason: 'Viewpoint | moved\nwhile reading',
    };
    const report = periscopeMarkdown(d);
    expect(report).toContain('invalid');
    expect(report).toContain('Viewpoint \\| moved<br>while reading');
    expect(report).toContain('有原因排除 / Excluded with reason');
    expect(report).toContain('未测 / Not measured');
    expect(report).toContain('Record in progress');
    expect(report).toContain('not measured data or a guarantee');
    expect(report).not.toContain('success rate:');
  });
});
