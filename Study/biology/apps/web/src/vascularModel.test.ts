import { describe, it, expect } from 'vitest';
import {
  rootExchange,
  plantRoutes,
  leafExchange,
  flowerState,
} from './vascularModel';
import {
  decodeProgress,
  emptyProgress,
  withMission,
  missionForUnit,
  stageOutcome,
} from './progress';
describe('plant routes and boundaries', () => {
  it('allows inward, balanced and outward root exchange according to total water potential', () => {
    expect(rootExchange('inward')).toMatchObject({
      soilRank: 'higher',
      rootRank: 'lower',
      direction: 'soil-to-root',
    });
    expect(rootExchange('equal').direction).toBe('no-net');
    expect(rootExchange('outward')).toMatchObject({
      soilRank: 'lower',
      rootRank: 'higher',
      direction: 'root-to-soil',
    });
  });
  it('separates xylem water from source-to-sink phloem with both above and below destinations', () => {
    expect(plantRoutes.water.stops).toEqual([
      'soil',
      'root',
      'stem',
      'leaf',
      'air',
    ]);
    expect(plantRoutes.water.tissue).toBe('xylem');
    expect(plantRoutes['leaf-sugar']).toMatchObject({
      tissue: 'phloem',
      source: 'mature-leaf',
      sink: 'root',
    });
    expect(plantRoutes['store-sugar']).toMatchObject({
      tissue: 'phloem',
      source: 'root-store',
      sink: 'bud',
    });
    for (const cargo of ['leaf-sugar', 'store-sugar'] as const)
      expect(plantRoutes[cargo].stops).toContain('loading');
    expect(plantRoutes['store-sugar'].stops).not.toContain('soil');
  });
  it('keeps pore restriction distinct from humidity and never infers zero water loss or a quantitative rate', () => {
    for (const pore of ['open', 'narrow'] as const)
      for (const air of ['drier', 'humid'] as const) {
        const a = leafExchange(pore, air);
        expect(a.waterDirection).toBe('leaf-to-air');
        expect(a.carbonDirection).toBe('air-to-leaf');
        expect(a.poreAccess).toBe(pore === 'open' ? 'greater' : 'restricted');
        expect(a.vapourDifference).toBe(
          air === 'drier' ? 'greater' : 'smaller',
        );
        expect(a.residualLossPossible).toBe(true);
        expect(a).not.toHaveProperty('rate');
      }
  });
  it('keeps incompatible deposited pollen at the stigma without tube, fusion or seed', () => {
    for (let i = 0; i < 6; i++) {
      const s = flowerState('incompatible', i);
      expect(s.pollenAtStigma).toBe(i >= 1);
      expect(s.tube || s.spermInTube || s.eggFusion || s.seed || s.fruit).toBe(
        false,
      );
    }
  });
  it('orders landing, tube, sperm delivery, fusion and development instead of turning the grain into a seed', () => {
    expect(flowerState('compatible', 1)).toMatchObject({
      pollenAtStigma: true,
      tube: false,
      eggFusion: false,
      seed: false,
    });
    expect(flowerState('compatible', 2)).toMatchObject({
      tube: true,
      spermInTube: false,
      seed: false,
    });
    expect(flowerState('compatible', 3)).toMatchObject({
      tube: true,
      spermInTube: true,
      eggFusion: false,
    });
    expect(flowerState('compatible', 4)).toMatchObject({
      eggFusion: true,
      seed: false,
      fruit: false,
    });
    expect(flowerState('compatible', 5)).toMatchObject({
      seed: true,
      fruit: true,
    });
  });
  it('restores U11 without replacing U10 or adding S02 records to S01 counts', () => {
    let p = withMission(emptyProgress(), 'U10', {
      object: '氧',
      evidence: '肺泡',
      reasoning: '交换',
      savedAt: 1,
    });
    p = withMission(p, 'U11', {
      object: '叶片',
      evidence: '模型',
      reasoning: '蒸腾',
      savedAt: 2,
    });
    p.sessions.L040 = { step: 3, note: '已有储备' };
    p.sessions.L044 = { step: 3, note: '花粉不是种子' };
    const r = decodeProgress(JSON.stringify(p));
    expect(missionForUnit(r, 'U10').object).toBe('氧');
    expect(missionForUnit(r, 'U11').savedAt).toBe(2);
    expect(r.sessions.L040?.note).toBe('已有储备');
    expect(r.sessions.L044?.note).toBe('花粉不是种子');
    expect(stageOutcome(r)).toMatchObject({ lessons: 0, missions: 0 });
  });
});
