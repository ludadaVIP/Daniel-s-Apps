import { describe, expect, it } from 'vitest';
import {
  emptyEcoProject,
  decodeEcoProject,
  ecoTextReady,
  ecoEstimateCheck,
  ecoStageQuestions,
  ecoUnderstanding,
  ecoWritingFields,
} from './ecoProject';
import { estimateMeadow, pathSample, randomQuadrats } from './populationModel';
import {
  emptyProgress,
  decodeProgress,
  withEcoProject,
  withLeafProject,
  withProject,
  withMission,
  ecoStageOutcome,
  stageOutcome,
  leafStageOutcome,
} from './progress';
import { emptyProject } from './project';
import { emptyLeafProject } from './leafProject';
import { ecoReport } from './ecoReport';
import { units } from './units';
const ready = () => {
  const d = emptyEcoProject();
  d.estimate = String(estimateMeadow(d.sampleIds).estimate);
  for (const key of ecoWritingFields)
    d[key] =
      `${key}: 数字来自原始样方，结论仍需证据。 Evidence comes from quadrat records; explanations need testing.`;
  d.savedAt = 100;
  for (const question of ecoStageQuestions)
    d.answers[question.id] = question.correct;
  return d;
};
describe('S03 ecological research project', () => {
  it('checks sampled-area arithmetic while allowing stated rounding and retaining uncertainty', () => {
    const d = ready();
    expect(ecoTextReady(d)).toBe(true);
    expect(ecoEstimateCheck(d)).toBe(true);
    d.estimate = '';
    expect(ecoEstimateCheck(d)).toBe(false);
    d.method = 'chosen';
    d.sampleIds = [...pathSample];
    d.estimate = '24';
    expect(ecoEstimateCheck(d)).toBe(true);
    expect(ecoTextReady(d)).toBe(true);
    d.estimate = '4';
    expect(ecoEstimateCheck(d)).toBe(false);
    d.sampleIds = ['Q01'];
    d.estimate = '0';
    expect(ecoTextReady(d)).toBe(false);
  });
  it('preserves old project shapes, missions and notes beside an independent new draft', () => {
    const first = emptyProject();
    first.records[0]!.name = '旧蜗牛记录';
    const second = emptyLeafProject();
    second.routes.water.note = '旧水路线';
    let p = withProject(emptyProgress(), 'S01', first);
    p = withLeafProject(p, second);
    p = withEcoProject(p, ready());
    p = withMission(p, 'U12', {
      object: '六图',
      evidence: '叶片',
      reasoning: '未知出口',
      savedAt: 1,
    });
    p = withMission(p, 'U17', {
      object: '草地',
      evidence: '6m²',
      reasoning: '估计不是普查',
      savedAt: 1,
    });
    p.sessions.L048 = { step: 3, note: '旧笔记', completedAt: 2 };
    const r = decodeProgress(JSON.stringify(p));
    expect(r.version).toBe(1);
    expect(r.projects.S01).toEqual(first);
    expect(r.projects.S02).toEqual(second);
    expect(r.projects.S03).toEqual(ready());
    expect(r.missions.U12).toEqual(p.missions.U12);
    expect(r.missions.U17).toEqual(p.missions.U17);
    expect(r.sessions.L048).toEqual(p.sessions.L048);
    expect(ecoStageOutcome(r)).toMatchObject({
      lessons: 0,
      missions: 1,
      complete: false,
    });
  });
  it('requires all of S03 rather than borrowing older completed lessons or saved projects', () => {
    let p = withEcoProject(emptyProgress(), ready());
    for (const u of units.filter((u) => u.stage !== 'S03')) {
      for (const id of u.lessonIds)
        p.sessions[id] = { step: 3, note: '', completedAt: 1 };
      p = withMission(p, u.id, {
        object: '旧',
        evidence: '记录',
        reasoning: '解释',
        savedAt: 1,
      });
    }
    expect(ecoStageOutcome(p)).toMatchObject({
      lessons: 0,
      missions: 0,
      complete: false,
    });
    for (const u of units.filter((u) => u.stage === 'S03')) {
      for (const id of u.lessonIds)
        p.sessions[id] = { step: 3, note: '', completedAt: 1 };
      p = withMission(p, u.id, {
        object: '新',
        evidence: '数据',
        reasoning: '局限',
        savedAt: 1,
      });
    }
    expect(ecoStageOutcome(p)).toMatchObject({
      lessons: 24,
      missions: 6,
      complete: true,
    });
    expect(stageOutcome(p).lessons).toBe(24);
    expect(leafStageOutcome(p).lessons).toBe(24);
    expect(
      ecoStageOutcome(withEcoProject(p, { savedAt: undefined })).complete,
    ).toBe(false);
    expect(
      ecoStageOutcome(withEcoProject(p, { estimate: '999' })).complete,
    ).toBe(false);
    const answers = { ...ready().answers };
    for (const q of ecoStageQuestions.slice(0, 2))
      answers[q.id] = (q.correct + 1) % q.options.length;
    expect(ecoStageOutcome(withEcoProject(p, { answers })).complete).toBe(
      false,
    );
    answers[ecoStageQuestions[0]!.id] = ecoStageQuestions[0]!.correct;
    expect(ecoStageOutcome(withEcoProject(p, { answers })).complete).toBe(true);
    delete answers[ecoStageQuestions[0]!.id];
    expect(ecoStageOutcome(withEcoProject(p, { answers })).complete).toBe(
      false,
    );
  });
  it('restores partial drafts, limits writing, and rejects forged random plans and duplicate or unknown cells', () => {
    const d = emptyEcoProject();
    d.claim = '中'.repeat(1700);
    d.savedAt = 1;
    const r = decodeEcoProject(d);
    expect(r.claim).toHaveLength(1500);
    expect(r.savedAt).toBeUndefined();
    expect(r.answers).toEqual({});
    expect(() =>
      decodeEcoProject({ ...d, sampleIds: ['Q01', 'Q01'] }),
    ).toThrow();
    expect(() => decodeEcoProject({ ...d, sampleIds: ['Q99'] })).toThrow();
    expect(() =>
      decodeEcoProject({ ...d, sampleIds: randomQuadrats(43) }),
    ).toThrow();
    expect(() => decodeEcoProject({ ...d, seed: -1 })).toThrow();
    expect(() =>
      decodeEcoProject({ ...d, answers: { 'S03-q1': 3 } }),
    ).toThrow();
    const chosen = { ...d, method: 'chosen' as const, sampleIds: [] };
    expect(decodeEcoProject(chosen).sampleIds).toEqual([]);
  });
  it('exports every raw record and full writing as inert plain text with no data invention', () => {
    const d = ready();
    d.zh = '叶'.repeat(1500);
    d.reasoning = '<script>alert("x")</script> & 原样文字';
    const text = ecoReport(d),
      estimate = estimateMeadow(d.sampleIds);
    expect(text).toContain('Not measured field data');
    for (const q of estimate.records)
      expect(text).toContain(`${q.id}: ${q.count}`);
    expect(text).toContain('4/6 × 36 = 24');
    expect(text).toContain(`Estimate: ${estimate.estimate.toFixed(2)}`);
    expect(text.match(/叶/g)).toHaveLength(1500);
    expect(text).toContain(d.reasoning);
    expect(text).not.toContain('undefined');
    expect(ecoUnderstanding(d)).toEqual({ answered: 5, correct: 5 });
  });
  it('distinguishes answered questions from correct answers in incomplete exported reports', () => {
    const draft = emptyEcoProject();
    expect(ecoReport(draft)).toContain('0/5 answered; 正确0/5题 / 0/5 correct');
    draft.answers[ecoStageQuestions[0]!.id] = ecoStageQuestions[0]!.correct;
    draft.answers[ecoStageQuestions[1]!.id] =
      (ecoStageQuestions[1]!.correct + 1) %
      ecoStageQuestions[1]!.options.length;
    const report = ecoReport(draft);
    expect(report).toContain('2/5 answered; 正确1/5题 / 1/5 correct');
    expect(report).not.toContain('1/2 answered');
  });
});
