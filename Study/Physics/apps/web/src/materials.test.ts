import { describe, expect, it } from 'vitest';
import { decodeProgress, freshLesson } from './progress';
import { lessons } from './content/lessons';
import {
  emptyMaterials,
  emptyMaterial,
  emptyMaterialTrial,
  decodeMaterials,
  materialNumber,
  materialTrial,
  materialSummary,
  materialsState,
  materialFormat,
  referenceDifference,
  materialsMarkdown,
  materialPlanFields,
  materialSampleFields,
  materialReferences,
  type MaterialTrial,
} from './materials';
function cylinder(mass = '54', before = '40', after = '60'): MaterialTrial {
  return {
    ...emptyMaterialTrial('displacement'),
    mass,
    before,
    after,
    dryMass: true,
    volumeChecked: true,
  };
}
function recorded() {
  const draft = emptyMaterials();
  draft.fields = {
    question: '未知小块，猜可能含铝',
    tools: '秤0.1 g，量筒1 mL',
    procedure: '干燥称量，再完整浸没无气泡',
  };
  draft.specimens[0]!.label = '家中的小块';
  draft.specimens[0]!.fields = {
    observation: '无气泡，也没有看到空洞',
    judgment: '密度接近铝参照，但不能确定',
    uncertainty: '可能是合金，也要检查量筒误差',
  };
  draft.specimens[0]!.trials = [cylinder(), cylinder()];
  return draft;
}
describe('Mystery Materials evidence records', () => {
  it('parses bounded decimal readings and treats zero only as a permissible initial water reading', () => {
    for (const raw of [
      '',
      '0',
      '-1',
      '2 g',
      '1e3',
      'Infinity',
      'NaN',
      '1,2',
      '0.0001',
      '5001',
    ])
      expect(materialNumber(raw, 5000)).toBeUndefined();
    expect(materialNumber(' ５４.５ ', 5000)).toBe(54.5);
    expect(materialNumber('.125', 100)).toBe(0.125);
    expect(materialNumber('0', 1000, true)).toBe(0);
    expect(materialNumber('100', 100)).toBe(100);
  });
  it('derives the same specimen volume from three edges or the water change, not the final reading', () => {
    const edges = {
      ...emptyMaterialTrial(),
      mass: '54',
      length: '5',
      width: '2',
      height: '2',
      dryMass: true,
      volumeChecked: true,
    };
    expect(materialTrial(edges)).toMatchObject({
      mass: 54,
      volume: 20,
      density: 2.7,
      used: true,
    });
    expect(materialTrial(cylinder())).toMatchObject({
      mass: 54,
      volume: 20,
      density: 2.7,
      used: true,
    });
    expect(materialTrial(cylinder('54', '0', '20')).volume).toBe(20);
    for (const after of ['40', '39', '0', '1001'])
      expect(materialTrial(cylinder('54', '40', after))).toMatchObject({
        density: undefined,
        used: false,
        unresolved: true,
      });
    expect(materialTrial({ ...edges, height: '101' }).density).toBeUndefined();
  });
  it('keeps an apparent ratio visible without treating unchecked conditions as usable evidence', () => {
    const specimen = recorded().specimens[0]!;
    specimen.trials[0]!.volumeChecked = false;
    expect(materialTrial(specimen.trials[0]!)).toMatchObject({
      density: 2.7,
      entered: true,
      used: false,
      unresolved: true,
    });
    expect(materialSummary(specimen)).toMatchObject({
      numericCount: 2,
      count: 1,
      rawDensity: 2.7,
      density: 2.7,
      complete: false,
    });
    specimen.trials[0]!.volumeChecked = true;
    expect(materialSummary(specimen).complete).toBe(true);
  });
  it('uses mean mass / mean volume from the same trials rather than averaging individual ratios', () => {
    const specimen = recorded().specimens[0]!;
    specimen.trials = [cylinder('50', '0', '10'), cylinder('60', '0', '30')];
    const s = materialSummary(specimen);
    expect(s.meanMass).toBe(55);
    expect(s.meanVolume).toBe(20);
    expect(s.density).toBe(2.75);
    expect(s.density).not.toBe((5 + 2) / 2);
    expect(s.densityRange).toBe(3);
  });
  it('requires a reason for exclusions and retains both raw estimates and restored originals', () => {
    const specimen = recorded().specimens[0]!;
    specimen.trials.push({ ...cylinder('54', '40', '52'), excluded: true });
    expect(materialSummary(specimen)).toMatchObject({
      count: 3,
      complete: false,
    });
    specimen.trials[2]!.note = 'object was only partly immersed';
    const s = materialSummary(specimen);
    expect(s).toMatchObject({
      count: 2,
      numericCount: 3,
      density: 2.7,
      complete: true,
    });
    expect(s.rawDensity).toBeCloseTo(162 / 52);
    expect(specimen.trials[2]!.after).toBe('52');
    specimen.trials[2]!.excluded = false;
    expect(materialSummary(specimen).count).toBe(3);
    expect(specimen.trials[2]!.note).toBe('object was only partly immersed');
    expect(materialSummary(specimen).density).toBeCloseTo(s.rawDensity!);
  });
  it('ignores unused blank slots but requires entered errors to be resolved or documented', () => {
    const specimen = recorded().specimens[0]!;
    specimen.trials.push(emptyMaterialTrial());
    expect(materialSummary(specimen).complete).toBe(true);
    specimen.trials[2]!.mass = 'scale failed';
    expect(materialSummary(specimen).complete).toBe(false);
    specimen.trials[2]!.excluded = true;
    specimen.trials[2]!.note = 'scale battery failed; no usable measurement';
    expect(materialSummary(specimen).complete).toBe(true);
    expect(
      materialsMarkdown({ ...recorded(), specimens: [specimen] }),
    ).toContain('scale failed');
  });
  it('requires the plan, two used trials and explanations while allowing an uncertain identity', () => {
    const draft = recorded();
    expect(materialsState(emptyMaterials()).completed).toBe(false);
    expect(materialsState(draft)).toMatchObject({
      planned: true,
      count: 1,
      completed: true,
    });
    draft.specimens[0]!.fields.judgment = '仍不能判断 / Not yet sure';
    expect(materialsState(draft).completed).toBe(true);
    for (const f of materialPlanFields)
      expect(
        materialsState({ ...draft, fields: { ...draft.fields, [f.key]: '' } })
          .completed,
      ).toBe(false);
    for (const f of materialSampleFields) {
      const specimen = {
        ...draft.specimens[0]!,
        fields: { ...draft.specimens[0]!.fields, [f.key]: '' },
      };
      expect(materialSummary(specimen).complete).toBe(false);
    }
    draft.specimens.push(emptyMaterial('B'));
    expect(materialsState(draft)).toMatchObject({ count: 1, completed: false });
  });
  it('decodes bounded drafts, retaining case position without trusting unknown fields or duplicate IDs', () => {
    const draft = recorded();
    draft.specimens[0]!.trials = Array.from({ length: 9 }, () => ({
      ...cylinder(),
      note: 'x'.repeat(900),
    }));
    draft.specimens[0]!.fields.unknown = 'ignore';
    draft.fields.question = 'x'.repeat(1000);
    draft.specimens.push(emptyMaterial('A'), emptyMaterial('B'));
    draft.activeId = 'B';
    draft.step = 3;
    const decoded = decodeMaterials(draft)!;
    expect(decoded.specimens.map((s) => s.id)).toEqual(['A', 'B']);
    expect(decoded.activeId).toBe('B');
    expect(decoded.step).toBe(3);
    expect(decoded.specimens[0]!.trials).toHaveLength(6);
    expect(decoded.specimens[0]!.trials[0]!.note).toHaveLength(500);
    expect(decoded.specimens[0]!.fields.unknown).toBeUndefined();
    expect(decoded.fields.question).toHaveLength(800);
    const invalidMethod = decodeMaterials({
      fields: {},
      specimens: [
        {
          id: 'A',
          fields: {},
          trials: [
            {
              ...cylinder(),
              method: 'unknown',
              length: '5',
              width: '2',
              height: '2',
            },
          ],
        },
      ],
    })!;
    expect(invalidMethod.specimens[0]!.trials[0]!.volumeChecked).toBe(false);
    expect(materialSummary(invalidMethod.specimens[0]!).count).toBe(0);
    for (const raw of [
      null,
      [],
      { fields: [], specimens: [] },
      { fields: {}, specimens: 'oops' },
    ])
      expect(decodeMaterials(raw)).toBeUndefined();
    expect(
      decodeMaterials({
        fields: {},
        specimens: [{ id: 'constructor' }],
        activeId: '__proto__',
        step: 99,
        updatedAt: Infinity,
      }),
    ).toMatchObject({ activeId: 'A', step: 3, updatedAt: 0 });
  });
  it('preserves earlier lessons, notes and walking drafts when adding materials storage', () => {
    const lesson = lessons[0]!,
      progress = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        completedAt: 1,
        answers: Object.fromEntries(
          [...lesson.questions, lesson.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const decoded = decodeProgress(
      JSON.stringify({
        lessons: { [lesson.id]: progress },
        notes: [{ id: 'n', observation: 'old', question: 'why', createdAt: 1 }],
        walkingProject: {
          fields: { route: 'old route' },
          readings: {},
          updatedAt: 1,
        },
        materialsProject: recorded(),
      }),
    );
    expect(decoded.lessons[lesson.id]?.completedAt).toBe(1);
    expect(decoded.notes[0]?.observation).toBe('old');
    expect(decoded.walkingProject?.fields.route).toBe('old route');
    expect(decoded.materialsProject?.specimens[0]?.label).toBe('家中的小块');
    expect(decodeProgress('{}')).toEqual({ lessons: {}, notes: [] });
  });
  it('reports comparisons as differences without an identity tolerance and avoids rounding tiny positive results to zero', () => {
    expect(referenceDifference(2.7, 2.7)).toBe(0);
    expect(referenceDifference(2.25, 2.7)).toBeCloseTo(16.6667, 3);
    expect(referenceDifference(undefined, 2.7)).toBeUndefined();
    expect(referenceDifference(NaN, 2.7)).toBeUndefined();
    expect(referenceDifference(2.7, 0)).toBeUndefined();
    expect(materialFormat(0.00000054)).toBe('5.40e-7');
    expect(materialFormat(54000000)).toBe('5.40e+7');
    expect(materialFormat(0)).toBe('0.00');
  });
  it('exports all raw readings, inactive-method entries, condition checks and uncertainty in both languages', () => {
    const draft = recorded();
    draft.specimens[0]!.trials[0] = {
      ...cylinder(),
      length: '5',
      width: '2',
      height: '2',
      note: 'bubble|seen\nrepeated',
      excluded: true,
    };
    const report = materialsMarkdown(draft);
    expect(report).toContain('bubble\\|seen<br>repeated');
    expect(report).toContain(
      '| 1 | 排水 / Displacement | 54 | 5 | 2 | 2 | 40 | 60 | 20.00 | 2.70 | 是 / Yes | 是 / Yes | 有原因排除 / Excluded with reason',
    );
    expect(report).toContain('可能是合金');
    expect(report).toContain('no identification tolerance');
    for (const f of [...materialPlanFields, ...materialSampleFields]) {
      expect(report).toContain(f.label.zh);
      expect(report).toContain(f.label.en);
      expect(f.hint.zh).toBeTruthy();
      expect(f.hint.en).toBeTruthy();
    }
    for (const ref of materialReferences) {
      expect(report).toContain(ref.name.zh);
      expect(report).toContain(ref.name.en);
    }
  });
});
