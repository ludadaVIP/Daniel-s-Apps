import { describe, expect, it } from 'vitest';
import {
  calculationFeedback,
  decodeGraduationProject,
  editGraduationCase,
  emptyGraduationProject,
  graduationCaseReady,
  graduationQuestionLessons,
  graduationQuestions,
  graduationUnderstanding,
  observationDate,
  plantAnalysis,
  ratioPercent,
  saveGraduationCase,
  validISODate,
  validPlantRecords,
  wolfRecords,
  wolfSummary,
} from './graduationProject';
import { researchFixture } from './graduationProject.fixtures';
import {
  escapeHtml,
  graduationGraphSvg,
  graduationReportHtml,
} from './graduationReport';
import {
  STORAGE_KEY,
  decodeProgress,
  emptyProgress,
  graduationStageOutcome,
  stageOutcome,
  leafStageOutcome,
  ecoStageOutcome,
  storyStageOutcome,
  evidenceStageOutcome,
  withGraduationProject,
  withMission,
} from './progress';

describe('graduation evidence, arithmetic and source boundaries', () => {
  it('sums ten raw rows once, distinguishes group kinds, uses weighted pooled shares and zero denominators', () => {
    expect(wolfRecords).toHaveLength(10);
    expect(wolfRecords.filter((r) => r.kind === 'pack')).toHaveLength(7);
    expect(wolfRecords.filter((r) => r.kind === 'group')).toHaveLength(1);
    expect(wolfSummary('all')).toEqual({
      adults: 67,
      pups: 17,
      total: 84,
      share: (17 / 84) * 100,
      rows: 10,
    });
    expect(wolfSummary('Northern Range')).toEqual({
      adults: 36,
      pups: 17,
      total: 53,
      share: (17 / 53) * 100,
      rows: 5,
    });
    expect(wolfSummary('Interior').share).toBe(0);
    expect(ratioPercent(0, 0)).toBeNull();
    expect(ratioPercent(5, Infinity)).toBeNull();
    const wrongAverage =
      (wolfRecords.slice(0, 4).reduce((s, r) => s + r.pups / r.total, 0) / 4) *
      100;
    expect(wrongAverage).not.toBeCloseTo(
      wolfSummary('Northern Range').share!,
      2,
    );
    const draft = researchFixture('official');
    expect(
      calculationFeedback('official', draft.cases.official, 0).correct,
    ).toBe(true);
    draft.cases.official.calculations[0] = String((17 / 36) * 100);
    expect(
      calculationFeedback('official', draft.cases.official, 0),
    ).toMatchObject({ correct: false });
    expect(
      calculationFeedback('official', draft.cases.official, 0).text,
    ).toContain('53');
  });
  it('starts observations empty and keeps real zero, missing, irregular time and other plants distinct', () => {
    expect(emptyGraduationProject().cases.observation.records).toEqual([]);
    const c = researchFixture('observation').cases.observation;
    const a = plantAnalysis(c);
    expect(a.valid.map((r) => r.day)).toEqual([0, 3, 10]);
    expect(a.excluded.map((r) => r.id)).toEqual(['Ptest5', 'Ptest-other']);
    expect(a.difference).toBe(5);
    expect(a.relative).toBe(50);
    c.records[0]!.value = 0;
    expect(plantAnalysis(c).valid).toHaveLength(3);
    expect(plantAnalysis(c).difference).toBe(15);
    expect(plantAnalysis(c).relative).toBeNull();
    c.calculations = ['15', 'NA'];
    expect(calculationFeedback('observation', c, 1).correct).toBe(true);
    expect(observationDate(c, 3)).toBe('2026-10-04');
    const svg = graduationGraphSvg('observation', c);
    expect(svg).toContain('Ptest0: day 0, 0 cm');
    expect(svg).not.toContain('Ptest-other:');
    expect(svg.match(/<circle/g) ?? []).toHaveLength(3);
    // Day 5 is missing: no segment joins day 3 across the gap to day 10.
    expect(svg.match(/stroke-width="3"/g) ?? []).toHaveLength(1);
  });
  it('requires real dates, finite bounded values, unique stable IDs and unique plant/days', () => {
    expect(validISODate('2024-02-29')).toBe(true);
    for (const date of [
      '2026-02-29',
      '2026-02-30',
      '2026-1-01',
      '0000-01-01',
      '2026-13-01',
      'x',
    ])
      expect(validISODate(date)).toBe(false);
    const rows = researchFixture('observation').cases.observation.records;
    expect(validPlantRecords(rows)).toBe(true);
    expect(validPlantRecords([...rows, { ...rows[0]! }])).toBe(false);
    expect(validPlantRecords([{ ...rows[0]!, day: 0.5 }])).toBe(false);
    expect(validPlantRecords([{ ...rows[0]!, value: NaN }])).toBe(false);
    expect(validPlantRecords([{ ...rows[0]!, value: Infinity }])).toBe(false);
    expect(validPlantRecords([{ ...rows[0]!, value: -1 }])).toBe(false);
  });
});
describe('graduation drafts, saving and strict storage', () => {
  it('saves each case independently; edits revoke only that save and invalidate changed evidence references', () => {
    let d = researchFixture('official');
    d.cases.observation = researchFixture('observation').cases.observation;
    d = saveGraduationCase(
      saveGraduationCase(d, 'official', 10),
      'observation',
      20,
    );
    expect(d.cases.official.savedAt).toBe(10);
    expect(d.cases.observation.savedAt).toBe(20);
    d = editGraduationCase(d, 'observation', {
      records: d.cases.observation.records.map((r) =>
        r.id === 'Ptest0' ? { ...r, value: 11 } : r,
      ),
    });
    expect(d.cases.observation.savedAt).toBeUndefined();
    expect(d.cases.official.savedAt).toBe(10);
    expect(d.cases.observation.citations).toEqual(['Ptest10']);
    d = editGraduationCase(d, 'official', { scope: 'Interior' });
    expect(d.cases.official.savedAt).toBeUndefined();
    expect(d.cases.official.citations).toEqual([]);
    d = editGraduationCase(d, 'observation', {
      records: d.cases.observation.records.filter((r) => r.id !== 'Ptest10'),
    });
    expect(d.cases.observation.citations).toEqual([]);
  });
  it('requires five own-note segments, valid time budgets, two calculations and manual review without English hard gating', () => {
    const d = researchFixture('official'),
      c = d.cases.official;
    expect(graduationCaseReady('official', c)).toBe(true);
    c.text.claim = '此处只比较年末的年龄组成，不能推出生存率。';
    c.text.secondLanguage = '';
    expect(graduationCaseReady('official', c)).toBe(true);
    c.speech[0]!.notes = ' ';
    expect(graduationCaseReady('official', c)).toBe(false);
    c.speech[0]!.notes = '我的讲解';
    c.speech[0]!.seconds = 300;
    expect(graduationCaseReady('official', c)).toBe(false);
    c.speech[0]!.seconds = 45;
    c.rubric[0] = false;
    expect(graduationCaseReady('official', c)).toBe(false);
  });
  it('strictly decodes legitimate cases and rejects wrong enums, IDs, arrays, answers, timestamps and nonfinite data', () => {
    const d = saveGraduationCase(
      researchFixture('observation'),
      'observation',
      10,
    );
    expect(decodeGraduationProject(JSON.parse(JSON.stringify(d)))).toEqual(d);
    const bad = [
      (x: typeof d) => {
        x.active = 'unknown' as typeof x.active;
      },
      (x: typeof d) => {
        x.cases.observation.records[0]!.value = Infinity;
      },
      (x: typeof d) => {
        x.cases.observation.startDate = '2026-02-30';
      },
      (x: typeof d) => {
        x.cases.observation.citations = ['unknown'];
      },
      (x: typeof d) => {
        x.cases.official.scope = 'ocean' as typeof x.cases.official.scope;
      },
      (x: typeof d) => {
        x.cases.observation.speech[0]!.seconds = 45.5;
      },
      (x: typeof d) => {
        x.cases.observation.rubric = [];
      },
      (x: typeof d) => {
        x.cases.observation.savedAt = -1;
      },
      (x: typeof d) => {
        x.cases.observation.savedAt = 1e308;
      },
      (x: typeof d) => {
        x.answers['S06-Q1'] = 3;
      },
      (x: typeof d) => {
        x.answers['S06-Q99'] = 0;
      },
      (x: typeof d) => {
        x.cases.official.records = x.cases.observation.records;
      },
    ];
    for (const mutate of bad) {
      const copy = structuredClone(d);
      mutate(copy);
      expect(() => decodeGraduationProject(copy)).toThrow();
    }
    expect(() => decodeGraduationProject({ ...d, cases: [] })).toThrow();
  });
  it('restores old version-one records directly and keeps six stage outcomes independent of authored course count', () => {
    expect(STORAGE_KEY).toBe('study-biology-v1');
    const old = emptyProgress();
    old.sessions.L001 = { step: 3, note: '旧记录', completedAt: 5 };
    old.mission = {
      object: '旧主张',
      evidence: '旧证据',
      reasoning: '旧推理',
      savedAt: 5,
    };
    const restored = decodeProgress(JSON.stringify(old));
    expect(restored).toEqual(old);
    const oldCounts = [
      stageOutcome,
      leafStageOutcome,
      ecoStageOutcome,
      storyStageOutcome,
      evidenceStageOutcome,
    ].map((fn) => fn(restored));
    let p = withGraduationProject(
      restored,
      saveGraduationCase(researchFixture('official'), 'official', 10),
    );
    expect(graduationStageOutcome(p).complete).toBe(false);
    for (let n = 121; n <= 144; n++)
      p.sessions[`L${n}`] = { step: 3, note: 'S06', completedAt: 10 };
    for (let n = 31; n <= 36; n++)
      p = withMission(p, `U${n}`, {
        object: '主张',
        evidence: '证据',
        reasoning: '推理',
        savedAt: 10,
      });
    expect(graduationStageOutcome(p)).toEqual({
      lessons: 24,
      missions: 6,
      complete: false,
    });
    const d = p.projects.S06!;
    graduationQuestions.forEach((q) => {
      d.answers[q.id] = q.correct;
    });
    d.active = 'observation';
    expect(graduationStageOutcome(p).complete).toBe(true);
    const roundtrip = decodeProgress(JSON.stringify(p));
    expect(roundtrip.sessions.L001).toEqual(old.sessions.L001);
    expect(roundtrip.mission).toEqual(old.mission);
    expect(
      [
        stageOutcome,
        leafStageOutcome,
        ecoStageOutcome,
        storyStageOutcome,
        evidenceStageOutcome,
      ].map((fn) => fn(roundtrip)),
    ).toEqual(oldCounts);
    delete d.answers['S06-Q6'];
    expect(graduationStageOutcome(p).complete).toBe(false);
  });
  it('maps all six distinct questions to the correct representative lesson and permits corrections', () => {
    expect(graduationQuestionLessons).toEqual([
      'L123',
      'L127',
      'L131',
      'L134',
      'L138',
      'L143',
    ]);
    const d = emptyGraduationProject();
    graduationQuestions.forEach((q) => {
      d.answers[q.id] = (q.correct + 1) % q.options.length;
    });
    expect(graduationUnderstanding(d)).toEqual({ answered: 6, correct: 0 });
    graduationQuestions.forEach((q) => {
      d.answers[q.id] = q.correct;
    });
    expect(graduationUnderstanding(d)).toEqual({ answered: 6, correct: 6 });
  });
});
describe('complete, safe offline report', () => {
  it('exports all 100 raw records, excluded/missing/zero values, full prose, every script segment and actual learner answers safely', () => {
    const d = researchFixture('observation'),
      c = d.cases.observation;
    c.records = Array.from({ length: 100 }, (_, i) => ({
      id: `Plong${i}`,
      plant: i > 90 ? 'OTHER' : 'TEST-PLANT-A',
      day: i * 2,
      value: i === 2 ? null : i,
    }));
    c.text.claim = '<script>alert("x")</script>&\u0001' + '中W'.repeat(5000);
    c.speech[4]!.notes = 'LAST SEGMENT <img onerror=x> ' + 'Long '.repeat(1000);
    d.answers['S06-Q1'] = 1;
    const html = graduationReportHtml(d, 'observation');
    expect(html).toContain('DRAFT');
    expect(html).toContain('Plong99');
    expect(html).toContain('OTHER');
    expect(html).toContain('Excluded: other plant');
    expect(html).toContain('NA / 缺失');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('中W'.repeat(5000));
    expect(html).toContain('Long '.repeat(1000));
    expect(html).toContain('Needs revision');
    expect(html).toContain('UAA adds another residue');
    expect(html).toContain('not externally verified');
    expect(html).toContain('planned');
    expect(html).not.toContain('foreignObject');
    expect(html).not.toContain('javascript:');
    expect(escapeHtml('a\u0001<&"')).toBe('a�&lt;&amp;&quot;');
    expect(escapeHtml('\ud800x\udc00')).toBe('�x�');
  });
  it('exports source hash, actual scope, all raw official rows, pooled summary and bilingual scientific boundaries', () => {
    const d = researchFixture('official');
    d.cases.official.scope = 'Interior';
    d.cases.official.graph = 'shares';
    const html = graduationReportHtml(d, 'official');
    for (const r of wolfRecords) expect(html).toContain(r.id);
    expect(html).toContain('02B4C2EE9FA76DF');
    expect(html).toContain('2025-12-31');
    expect(html).toContain('0/31');
    expect(html).toContain('no: other region');
    expect(html).toContain('not density, birth rate');
    expect(html).toContain('not a translation');
    expect(html).toContain('五段口头稿');
  });
});
