import { describe, expect, it } from 'vitest';
import { lessons, section } from './content';
import curriculum from '../../../curriculum/index.json';
import {
  decodeProgress,
  emptyProgress,
  outcome,
  reviewQueue,
  missionForUnit,
  withMission,
  withProject,
  stageOutcome,
} from './progress';
import {
  seedModel,
  virusCopies,
  microscopeView,
  particlePosition,
  plantSugar,
  armGeometry,
  gasRoutes,
  gardenLinks,
  gardenConsumers,
  gardenFeeding,
  fairTestIssues,
  summariseGrowth,
  seedlingRecords,
} from './models';
import { units } from './units';
import { emptyProject, stageQuestions } from './project';
import { cellParts, cellActivity, type CellKind } from './cellModel';

describe('representative cell models', () => {
  it('separates shared structures from cell-type-specific structures', () => {
    for (const kind of ['animal', 'leaf', 'onion'] as CellKind[]) {
      const parts = cellParts(kind);
      expect(new Set(parts).size).toBe(parts.length);
      for (const shared of [
        'membrane',
        'cytoplasm',
        'nucleus',
        'mitochondria',
        'ribosomes',
      ])
        expect(parts).toContain(shared);
      expect(parts.includes('wall')).toBe(kind !== 'animal');
      expect(parts.includes('vacuole')).toBe(kind !== 'animal');
      expect(parts.includes('chloroplasts')).toBe(kind === 'leaf');
    }
    const copy = cellParts('leaf');
    copy.pop();
    expect(cellParts('leaf')).toContain('chloroplasts');
  });
  it('limits photosynthesis by chloroplast profile and light while preserving day/night respiration', () => {
    for (const kind of ['animal', 'leaf', 'onion'] as CellKind[])
      for (const light of [false, true]) {
        const state = cellActivity(kind, light);
        expect(state.photosynthesis).toBe(kind === 'leaf' && light);
        expect(state.respiration).toBe(true);
        expect(state.proteinAssembly).toBe(true);
      }
  });
  it('restores S02 notes without changing S01 stage completion', () => {
    let progress = emptyProgress();
    progress = withMission(progress, 'U06', {
      object: '旧方案',
      evidence: '控制条件',
      reasoning: '比较',
      savedAt: 10,
    });
    progress = withMission(progress, 'U07', {
      object: '叶肉与洋葱',
      evidence: '共同膜，不同叶绿体',
      reasoning: '分工',
      savedAt: 20,
    });
    progress.sessions.L028 = {
      step: 3,
      note: '组织不等于器官',
      completedAt: 20,
    };
    const restored = decodeProgress(JSON.stringify(progress));
    expect(missionForUnit(restored, 'U07').object).toBe('叶肉与洋葱');
    expect(missionForUnit(restored, 'U06').object).toBe('旧方案');
    expect(restored.sessions.L028?.note).toBe('组织不等于器官');
    expect(stageOutcome(restored).lessons).toBe(0);
    expect(stageOutcome(restored).missions).toBe(1);
    expect(stageOutcome(restored).complete).toBe(false);
  });
});
describe('pilot curriculum contract', () => {
  it('offers complete units within the 144-lesson roadmap', () => {
    const list = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(curriculum).toHaveLength(6);
    expect(list).toHaveLength(144);
    expect(new Set(list.map((l) => l.id)).size).toBe(144);
    expect(
      list.filter((l) => l.status === 'available').map((l) => l.id),
    ).toEqual(lessons.map((l) => l.id));
    expect(units.flatMap((u) => u.lessonIds)).toEqual(lessons.map((l) => l.id));
    expect(
      new Set(lessons.flatMap((l) => l.questions.map((q) => q.id))).size,
    ).toBe(lessons.length * 4);
    for (const l of lessons) {
      expect(l.questions).toHaveLength(4);
      expect(l.questions.filter((q) => q.skill === 'reasoning')).toHaveLength(
        1,
      );
      for (const name of [
        'Hook',
        'Predict',
        'See',
        'Explore',
        'Explain',
        'Misconception',
        'Depth',
        'Apply',
        'Vocabulary',
        'Check',
        'Mission',
      ]) {
        expect(
          section(l.id, name).zh.trim(),
          `${l.id} ${name} zh`,
        ).toBeTruthy();
        expect(
          section(l.id, name).en.trim(),
          `${l.id} ${name} en`,
        ).toBeTruthy();
      }
      for (const q of l.questions) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.feedback.zh).toBeTruthy();
        expect(q.feedback.en).toBeTruthy();
      }
    }
  });
});
describe('understanding and recall', () => {
  it('restores field drafts without replacing old missions and requires the full stage for completion', () => {
    const draft = emptyProject();
    draft.records = draft.records.map((row, i) => ({
      ...row,
      name: `生物${i + 1}`,
      evidence: '虚拟场景可见外观',
      habitat: '叶片或土壤',
      question: '下次怎样观察？',
    }));
    draft.zh = '我观察到生物与环境的联系。';
    draft.en = 'I observed organisms in different habitats.';
    draft.savedAt = 100;
    for (const q of stageQuestions) draft.answers[q.id] = q.correct;
    const original = emptyProgress();
    original.mission = {
      object: '旧种子',
      evidence: '萌发',
      reasoning: '生命活动',
      savedAt: 1,
    };
    let progress = decodeProgress(
      JSON.stringify(withProject(original, 'S01', draft)),
    );
    expect(progress.projects.S01).toEqual(draft);
    expect(progress.mission).toEqual(original.mission);
    expect(stageOutcome(progress).complete).toBe(false);
    for (let i = 1; i <= 24; i++)
      progress.sessions[`L${String(i).padStart(3, '0')}`] = {
        step: 3,
        note: '',
        completedAt: 1,
      };
    for (const unit of units.filter((u) => u.stage === 'S01'))
      progress = withMission(progress, unit.id, {
        object: '问题',
        evidence: '记录',
        reasoning: '解释',
        savedAt: 1,
      });
    expect(stageOutcome(progress).complete).toBe(true);
    const below = withProject(progress, 'S01', {
      answers: Object.fromEntries(
        stageQuestions.map((q, i) => [
          q.id,
          i < 3 ? q.correct : (q.correct + 1) % 3,
        ]),
      ),
    });
    expect(stageOutcome(below).complete).toBe(false);
    const unfinished = withProject(progress, 'S01', {
      records: draft.records.map((r, i) =>
        i === 4 ? { ...r, question: '' } : r,
      ),
    });
    expect(
      stageOutcome(decodeProgress(JSON.stringify(unfinished))).complete,
    ).toBe(false);
    expect(() =>
      decodeProgress(
        JSON.stringify(
          withProject(progress, 'S01', { answers: { 'S01-q1': 99 } }),
        ),
      ),
    ).toThrow();
  });
  it('preserves first-release records and saves unit missions independently', () => {
    const old = {
      version: 1,
      sessions: {
        L001: { step: 3, note: '旧笔记 / old note', completedAt: 10 },
      },
      answers: {},
      mission: {
        object: '种子',
        evidence: '萌芽',
        reasoning: '生长',
        savedAt: 10,
      },
    };
    const restored = decodeProgress(JSON.stringify(old));
    expect(restored.sessions.L001?.note).toBe('旧笔记 / old note');
    expect(missionForUnit(restored, 'U01')).toEqual(old.mission);
    const updated = withMission(restored, 'U02', {
      object: '酵母',
      evidence: '一个细胞',
      reasoning: '可独立完成生命活动',
      savedAt: 20,
    });
    const reloaded = decodeProgress(JSON.stringify(updated));
    expect(missionForUnit(reloaded, 'U01')).toEqual(old.mission);
    expect(missionForUnit(reloaded, 'U02').savedAt).toBe(20);
    expect(missionForUnit(restored, 'U02').object).toBe('');
    const body = withMission(reloaded, 'U04', {
      object: '跑步需要多个器官 / running needs organs',
      evidence: '肺到心到肌肉 / lungs-heart-muscle',
      reasoning: '交换与运输协作 / exchange and transport cooperate',
      savedAt: 30,
    });
    const bodyReloaded = decodeProgress(JSON.stringify(body));
    expect(missionForUnit(bodyReloaded, 'U04').savedAt).toBe(30);
    expect(missionForUnit(bodyReloaded, 'U02').savedAt).toBe(20);
    expect(missionForUnit(bodyReloaded, 'U01')).toEqual(old.mission);
    const ecology = withMission(bodyReloaded, 'U05', {
      object: '瓢虫与蚜虫 / ladybird and aphid',
      evidence: '虚拟取食证据 / virtual feeding evidence',
      reasoning: '可能的间接影响 / possible indirect effect',
      savedAt: 40,
    });
    const ecoReloaded = decodeProgress(JSON.stringify(ecology));
    expect(missionForUnit(ecoReloaded, 'U05').savedAt).toBe(40);
    expect(missionForUnit(ecoReloaded, 'U04').savedAt).toBe(30);
    expect(missionForUnit(ecoReloaded, 'U01')).toEqual(old.mission);
  });
  it('puts mistakes before overdue correct answers', () => {
    const l = lessons[0]!,
      p = emptyProgress();
    p.sessions[l.id] = { step: 3, note: '', completedAt: 1000 };
    const a = l.questions[0]!,
      b = l.questions[1]!;
    p.answers[a.id] = { choice: a.correct, first: a.correct, at: 1000 };
    p.answers[b.id] = {
      choice: (b.correct + 1) % b.options.length,
      first: 1,
      at: 2000,
    };
    expect(reviewQueue(p, 1000 + 86400000).map((q) => q.id)).toEqual([
      b.id,
      a.id,
    ]);
  });
  it('does not block biology mastery for an incorrect English term', () => {
    const l = lessons[0]!,
      p = emptyProgress();
    for (const q of l.questions)
      p.answers[q.id] = {
        choice:
          q.skill === 'vocabulary'
            ? (q.correct + 1) % q.options.length
            : q.correct,
        first: 0,
        at: 1,
      };
    expect(outcome(l, p).mastered).toBe(true);
    expect(outcome(l, p).vocabulary.correct).toBe(0);
    expect(reviewQueue(p, 1)).toHaveLength(1);
  });
  it('revisits mistakes immediately and correct answers after 1, 7 and 30 days', () => {
    const l = lessons[0]!,
      q = l.questions[0]!,
      p = emptyProgress(),
      start = 1000,
      day = 86400000;
    p.sessions[l.id] = { step: 3, note: '', completedAt: start };
    p.answers[q.id] = { choice: q.correct, first: q.correct, at: start };
    expect(reviewQueue(p, start + day - 1)).toHaveLength(0);
    expect(reviewQueue(p, start + day)).toHaveLength(1);
    p.answers[q.id]!.at = start + day;
    expect(reviewQueue(p, start + day)).toHaveLength(0);
    expect(reviewQueue(p, start + 7 * day)).toHaveLength(1);
    p.answers[q.id]!.at = start + 7 * day;
    expect(reviewQueue(p, start + 30 * day)).toHaveLength(1);
    p.answers[q.id]!.at = start + 30 * day;
    expect(reviewQueue(p, start + 31 * day)).toHaveLength(0);
  });
  it('restores bilingual notes and rejects malformed answers and unknown schemas', () => {
    const p = emptyProgress();
    p.sessions.L001 = {
      step: 1,
      prediction: 2,
      note: '我观察到 / I observed',
      explored: true,
    };
    expect(decodeProgress(JSON.stringify(p))).toEqual(p);
    expect(() => decodeProgress('{')).toThrow();
    expect(() =>
      decodeProgress(JSON.stringify({ ...p, version: 2 })),
    ).toThrow();
    expect(() =>
      decodeProgress(
        JSON.stringify({
          ...p,
          answers: { 'L001-q1': { choice: 99, first: 0, at: 1 } },
        }),
      ),
    ).toThrow();
  });
});
describe('simplified biological models', () => {
  it('detects every combination of listed confounders without predicting an outcome', () => {
    for (const water of [false, true])
      for (const variety of [false, true])
        for (const temperature of [false, true]) {
          const issues = fairTestIssues({ water, variety, temperature });
          expect(issues.includes('water')).toBe(!water);
          expect(issues.includes('variety')).toBe(!variety);
          expect(issues.includes('temperature')).toBe(!temperature);
          expect(issues).toHaveLength(
            Number(!water) + Number(!variety) + Number(!temperature),
          );
        }
  });
  it('calculates gains from paired heights, retains variation and does not invent an empty-sample mean', () => {
    expect(
      summariseGrowth(seedlingRecords.filter((r) => r.group === 'weak')),
    ).toEqual({ gains: [6, 7, 8], n: 3, mean: 7 });
    expect(
      summariseGrowth(seedlingRecords.filter((r) => r.group === 'strong')),
    ).toEqual({ gains: [3, 4, 5], n: 3, mean: 4 });
    expect(
      summariseGrowth([
        { id: 'test', group: 'weak', start: 8, end: 6, pale: false },
      ]),
    ).toEqual({ gains: [-2], n: 1, mean: -2 });
    expect(summariseGrowth([])).toEqual({ gains: [], n: 0, mean: null });
  });
  it('retains alternative feeding paths after local predator removal without changing other links', () => {
    const initial = JSON.stringify(gardenFeeding);
    for (const ladybird of [false, true]) {
      for (const birdLink of [false, true]) {
        const links = gardenLinks(ladybird, birdLink);
        expect(gardenConsumers('plant', links)).toEqual([
          'aphid',
          'caterpillar',
        ]);
        expect(gardenConsumers('caterpillar', links)).toEqual(['bird']);
        const predators = gardenConsumers('aphid', links);
        expect(predators.includes('ladybird')).toBe(ladybird);
        expect(predators.includes('bird')).toBe(birdLink);
        expect(gardenConsumers('bird', links)).toEqual([]);
      }
    }
    expect(JSON.stringify(gardenFeeding)).toBe(initial);
  });

  it('keeps forearm length fixed throughout bending and straightening', () => {
    for (const angle of [-10, 0, 30, 60, 90, 120]) {
      const arm = armGeometry(angle);
      expect(
        Math.hypot(arm.hand.x - arm.elbow.x, arm.hand.y - arm.elbow.y),
      ).toBeCloseTo(arm.length);
      expect(arm.angle).toBeGreaterThanOrEqual(0);
      expect(arm.angle).toBeLessThanOrEqual(90);
    }
    expect(armGeometry(0).hand).toEqual({ x: 190, y: 270 });
    expect(armGeometry(90).hand.x).toBe(305);
  });
  it('connects both gas journeys through the appropriate heart side', () => {
    expect(gasRoutes.oxygen).toEqual(['air', 'lungs', 'leftHeart', 'cells']);
    expect(gasRoutes.carbon).toEqual(['cells', 'rightHeart', 'lungs', 'air']);
  });

  it('requires light and both material inputs to depict new sugar production', () => {
    for (const light of [false, true])
      for (const water of [false, true])
        for (const carbon of [false, true]) {
          const result = plantSugar(light, water, carbon);
          expect(result.canMakeSugar).toBe(light && water && carbon);
          expect(result.missing.length).toBe(
            Number(!light) + Number(!water) + Number(!carbon),
          );
        }
    expect(plantSugar(false, true, true).missing).toEqual(['light']);
    expect(plantSugar(true, true, false).missing).toEqual(['carbon']);
  });
  it('increases magnification while shrinking the same specimen field', () => {
    const low = microscopeView(4),
      medium = microscopeView(10),
      high = microscopeView(40);
    expect([
      low.magnification,
      medium.magnification,
      high.magnification,
    ]).toEqual([40, 100, 400]);
    expect([
      low.fieldMicrometres,
      medium.fieldMicrometres,
      high.fieldMicrometres,
    ]).toEqual([2000, 800, 200]);
    expect(low.magnification * low.fieldMm).toBe(
      high.magnification * high.fieldMm,
    );
  });
  it('allows only the preset permeable particle across the membrane', () => {
    for (let step = 0; step < 3; step++)
      expect(particlePosition(step, true)).toBe(particlePosition(step, false));
    expect(particlePosition(3, true)).toBeGreaterThan(120);
    expect(particlePosition(3, false)).toBe(120);
    expect(particlePosition(99, false)).toBe(120);
    expect(particlePosition(-1, true)).toBe(40);
  });
  it('requires water, oxygen and a suitable temperature; excess water is not always better', () => {
    expect(seedModel('moist', 20, true).grows).toBe(true);
    expect(seedModel('dry', 20, true).reason).toBe('dry');
    expect(seedModel('submerged', 20, true).reason).toBe('oxygen');
    expect(seedModel('moist', 20, false).grows).toBe(false);
    expect(seedModel('moist', 5, true).grows).toBe(false);
    expect(seedModel('moist', 40, true).grows).toBe(false);
  });
  it('never depicts independent viral replication without a suitable host', () => {
    for (let step = 0; step < 4; step++)
      expect(virusCopies(false, step)).toBe(1);
    expect(virusCopies(true, 2)).toBe(1);
    expect(virusCopies(true, 3)).toBe(4);
  });
});
