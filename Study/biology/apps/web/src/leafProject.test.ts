import { describe, expect, it } from 'vitest';
import {
  emptyLeafProject,
  leafRouteIds,
  leafRoutes,
  leafStageQuestions,
  leafTextReady,
  leafLabelCheck,
  decodeLeafProject,
  leafUnderstanding,
} from './leafProject';
import { leafDiagramSvg } from './leafDiagram';
import {
  emptyProgress,
  withLeafProject,
  withProject,
  withMission,
  decodeProgress,
  stageOutcome,
  leafStageOutcome,
} from './progress';
import { emptyProject } from './project';
import { units } from './units';
const ready = () => {
  const d = emptyLeafProject();
  for (const id of leafRouteIds)
    d.routes[id] = {
      tag: leafRoutes[id].tag,
      note: '来源→边界→去向。 Source → boundary → destination.',
    };
  d.zh = '光供能，CO₂供碳；糖是物质并储存化学能。';
  d.en =
    'Light supplies energy; CO₂ supplies carbon. Sugars are matter storing chemical energy.';
  d.savedAt = 100;
  for (const q of leafStageQuestions) d.answers[q.id] = q.correct;
  return d;
};
describe('second-stage leaf project', () => {
  it('distinguishes matter from energy without treating sugars as pure energy', () => {
    const d = ready();
    expect(leafLabelCheck(d)).toBe(4);
    expect(leafRoutes.water.tag).toBe('matter');
    expect(leafRoutes.carbon.tag).toBe('matter');
    expect(leafRoutes.light.tag).toBe('energy');
    expect(leafRoutes.sugar.tag).toBe('both');
    d.routes.sugar.tag = 'energy';
    expect(leafTextReady(d)).toBe(true);
    expect(leafLabelCheck(d)).toBe(3);
  });
  it('preserves S01 records, S02 writing, old missions and sessions across decoding without conflating their shapes', () => {
    const first = emptyProject();
    first.records[0]!.name = '蜗牛样动物';
    first.zh = '旧草稿';
    let p = withProject(emptyProgress(), 'S01', first);
    p = withMission(p, 'U12', {
      object: '六图',
      evidence: '腿数',
      reasoning: '保留未知',
      savedAt: 1,
    });
    p.sessions.L044 = { step: 3, note: '花粉相容', completedAt: 2 };
    p = withLeafProject(p, ready());
    const r = decodeProgress(JSON.stringify(p));
    expect(r.projects.S01).toEqual(first);
    expect(r.projects.S02).toEqual(ready());
    expect(r.missions.U12).toEqual(p.missions.U12);
    expect(r.sessions.L044).toEqual(p.sessions.L044);
    expect(stageOutcome(r)).toMatchObject({
      lessons: 0,
      missions: 0,
      complete: false,
    });
  });
  it('keeps the stage incomplete until its own 24 lessons and six missions join a saved, correctly labelled project and full check', () => {
    let p = withLeafProject(emptyProgress(), ready());
    expect(leafStageOutcome(p).complete).toBe(false);
    for (const u of units.filter((u) => u.stage === 'S01')) {
      for (const id of u.lessonIds)
        p.sessions[id] = { step: 3, note: '', completedAt: 1 };
      p = withMission(p, u.id, {
        object: '问题',
        evidence: '线索',
        reasoning: '解释',
        savedAt: 1,
      });
    }
    expect(leafStageOutcome(p)).toMatchObject({
      lessons: 0,
      missions: 0,
      complete: false,
    });
    for (const u of units.filter((u) => u.stage === 'S02')) {
      for (const id of u.lessonIds)
        p.sessions[id] = { step: 3, note: '', completedAt: 1 };
      p = withMission(p, u.id, {
        object: '问题',
        evidence: '线索',
        reasoning: '解释',
        savedAt: 1,
      });
    }
    expect(leafStageOutcome(p)).toMatchObject({
      lessons: 24,
      missions: 6,
      complete: true,
    });
    const d = ready();
    d.routes.light.tag = 'matter';
    expect(leafStageOutcome(withLeafProject(p, d)).complete).toBe(false);
    expect(
      leafStageOutcome(withLeafProject(p, { ...ready(), savedAt: undefined }))
        .complete,
    ).toBe(false);
    const a = { ...ready().answers };
    a['S02-q1'] = 0;
    a['S02-q2'] = 1;
    expect(
      leafStageOutcome(withLeafProject(p, { ...ready(), answers: a })).complete,
    ).toBe(false);
    a['S02-q2'] = 0;
    expect(
      leafStageOutcome(withLeafProject(p, { ...ready(), answers: a })).complete,
    ).toBe(true);
    delete a['S02-q1'];
    expect(
      leafStageOutcome(withLeafProject(p, { ...ready(), answers: a })).complete,
    ).toBe(false);
  });
  it('restores partial drafts, trims bounds and validates enums and answer ranges', () => {
    const d = emptyLeafProject();
    d.routes.water.note = '观察'.repeat(400);
    d.zh = '中'.repeat(1200);
    d.savedAt = 1;
    const r = decodeLeafProject(d);
    expect(r.routes.water.note).toHaveLength(600);
    expect(r.zh).toHaveLength(1000);
    expect(r.savedAt).toBeUndefined();
    expect(r.routes.light.tag).toBe('unmarked');
    expect(leafTextReady(r)).toBe(false);
    expect(() =>
      decodeLeafProject({ ...d, answers: { 'S02-q1': 9 } }),
    ).toThrow();
    expect(() =>
      decodeLeafProject({
        ...d,
        routes: { ...d.routes, water: { tag: 'wrong', note: '' } },
      } as never),
    ).toThrow();
  });
  it('keeps bilingual route labels and all student explanations in escaped, standalone SVG, without truncating writing', () => {
    const d = ready();
    d.routes.water.note = '<script>alert("x")</script> & 水';
    d.zh = '叶'.repeat(600);
    d.en = 'A & B';
    const svg = leafDiagramSvg(d, undefined, 4, true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('A &amp; B');
    expect(svg.match(/叶/g)!.length).toBeGreaterThanOrEqual(600);
    for (const id of leafRouteIds) {
      expect(svg).toContain(leafRoutes[id].short.zh);
      expect(svg).toContain(leafRoutes[id].short.en);
    }
    expect(svg).toContain('Matter + chemical energy');
    expect(svg).not.toContain('undefined');
  });
  it('uses five distinct cross-unit questions with feedback and full-answer 80 percent threshold data', () => {
    expect(new Set(leafStageQuestions.map((q) => q.id)).size).toBe(5);
    for (const q of leafStageQuestions) {
      expect(q.options[q.correct]).toBeDefined();
      expect(q.feedback.zh).toBeTruthy();
      expect(q.feedback.en).toBeTruthy();
    }
    expect(leafUnderstanding(ready())).toEqual({ answered: 5, correct: 5 });
  });
});
