import { describe, it, expect } from 'vitest';
import {
  specimenIds,
  specimenPath,
  keyPosition,
  keyCandidates,
  localLife,
  speciesComparison,
  interactionEvidence,
  habitatFocus,
  habitatConcern,
} from './diversityModel';
import {
  emptyProgress,
  withMission,
  decodeProgress,
  missionForUnit,
  stageOutcome,
} from './progress';
describe('classification evidence and local habitats', () => {
  it('identifies exactly six sample organisms with exclusive binary routes and progressively smaller candidate sets', () => {
    expect(new Set(specimenIds).size).toBe(6);
    const paths = specimenIds.map(specimenPath);
    expect(new Set(paths.map((p) => p.join(','))).size).toBe(6);
    for (const id of specimenIds) {
      const p = specimenPath(id);
      expect(keyPosition(p)).toBe(id);
      expect(keyCandidates(p)).toEqual([id]);
      for (let n = 1; n <= p.length; n++) {
        expect(keyCandidates(p.slice(0, n))).toContain(id);
        expect(keyCandidates(p.slice(0, n)).length).toBeLessThan(
          keyCandidates(p.slice(0, n - 1)).length,
        );
      }
    }
  });
  it('keeps ferns separate from feathers and complete six-legged insects separate from eight-legged spider illustrations', () => {
    expect(localLife.fern).toMatchObject({
      leafy: true,
      frond: true,
      feathers: false,
    });
    expect(localLife.weta.sixLegs).toBe(true);
    expect(localLife.katipo.sixLegs).toBe(false);
    expect(keyCandidates([false, false])).toEqual(['weta', 'katipo']);
    expect(keyCandidates([true])).toEqual(['fern', 'cabbage']);
  });
  it('does not let similar colour prove species identity or a partial view compel a guess', () => {
    expect(speciesComparison('variation')).toBe('same-species');
    expect(speciesComparison('different')).toBe('different-species');
    expect(speciesComparison('uncertain')).toBe('insufficient-evidence');
  });
  it('requires the pollen transfer condition before claiming a plant-side potential benefit', () => {
    expect(interactionEvidence('mutualism', true)).toMatchObject({
      a: 'benefit',
      b: 'potential-benefit',
      pollenTransferred: true,
    });
    expect(interactionEvidence('mutualism', false)).toMatchObject({
      a: 'benefit',
      b: 'unconfirmed',
      pollenTransferred: false,
    });
    expect(interactionEvidence('competition', true)).toMatchObject({
      a: 'cost',
      b: 'cost',
      resource: 'limited-light',
    });
    expect(interactionEvidence('predation', true)).toMatchObject({
      a: 'benefit',
      b: 'cost',
      resource: 'prey',
    });
  });
  it('limits habitat-change statements to assessed resources without making species disappear or inferring population size', () => {
    expect(habitatFocus.forest).not.toContain('katipo');
    expect(habitatFocus.coast).toContain('katipo');
    expect(habitatConcern('forest', true, 'tui')).toBe(
      'nectar-options-reduced',
    );
    expect(habitatConcern('coast', true, 'katipo')).toBe('shelter-reduced');
    expect(habitatConcern('coast', true, 'cabbage')).toBe('not-assessed');
    expect(habitatFocus.coast).toEqual(['cabbage', 'katipo']);
  });
  it('restores U12 key notes and U11 routes independently while leaving S01 requirements unchanged', () => {
    let p = withMission(emptyProgress(), 'U11', {
      object: '叶片',
      evidence: '气孔',
      reasoning: '取舍',
      savedAt: 1,
    });
    p = withMission(p, 'U12', {
      object: '六样本',
      evidence: '特征',
      reasoning: '未知可保留',
      savedAt: 2,
    });
    p.sessions.L048 = { step: 3, note: '栖息地不是标签', completedAt: 3 };
    const r = decodeProgress(JSON.stringify(p));
    expect(missionForUnit(r, 'U11').object).toBe('叶片');
    expect(missionForUnit(r, 'U12').savedAt).toBe(2);
    expect(r.sessions.L048?.note).toBe('栖息地不是标签');
    expect(stageOutcome(r)).toMatchObject({
      lessons: 0,
      missions: 0,
      complete: false,
    });
  });
});
