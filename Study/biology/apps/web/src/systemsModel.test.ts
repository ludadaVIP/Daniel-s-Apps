import { describe, expect, it } from 'vitest';
import {
  digestiveState,
  gasPressure,
  sphereSurface,
  bloodPaths,
  newDelivery,
  type FoodMaterial,
  type Cargo,
  type HiddenLink,
} from './systemsModel';
import {
  decodeProgress,
  emptyProgress,
  withMission,
  missionForUnit,
  stageOutcome,
  withProject,
} from './progress';
import { emptyProject } from './project';
describe('body systems models', () => {
  it('separates digestion products from absorption and keeps example fibre out of the human-enzyme blood branch', () => {
    for (const material of ['starch', 'protein', 'fibre'] as FoodMaterial[])
      for (let f = 0; f <= 5; f++) {
        const s = digestiveState(material, f);
        expect(s.absorbed).toBe(material !== 'fibre' && f >= 4);
        if (s.absorbed) expect(s.form).toBe('units');
        if (material === 'fibre') {
          expect(s.form).toBe('chain');
          expect(s.destination).toBe(f >= 4 ? 'colon' : 'lumen');
        } else
          expect(s.destination).toBe(
            f < 4 ? 'lumen' : f === 4 ? 'blood' : 'liver',
          );
      }
    expect(digestiveState('starch', 2).product).toBe('glucose');
    expect(digestiveState('protein', 2).product).toBe('amino-acids');
    expect(digestiveState('starch', 0).form).toBe('fragments');
    expect(digestiveState('protein', 0).form).toBe('chain');
  });
  it('holds total sphere volume equal while doubling actual area for eight half-radius spheres, without a rate prediction', () => {
    const a = sphereSurface(1),
      b = sphereSurface(8);
    expect(a.volume).toBeCloseTo(b.volume);
    expect(b.radius).toBe(a.radius / 2);
    expect(b.area / a.area).toBeCloseTo(2);
    expect(a).not.toHaveProperty('rate');
    expect(b).not.toHaveProperty('rate');
  });
  it('uses each gas partial-pressure gradient rather than forcing a constant direction', () => {
    expect(gasPressure('oxygen', 'usual').net).toBe('air-to-blood');
    expect(gasPressure('carbon', 'usual').net).toBe('blood-to-air');
    for (const gas of ['oxygen', 'carbon'] as const) {
      expect(gasPressure(gas, 'equal').net).toBe('balanced');
      const a = gasPressure(gas, 'usual'),
        b = gasPressure(gas, 'reversed');
      expect(b.air).toBe(a.blood);
      expect(b.blood).toBe(a.air);
      expect(b.net).not.toBe(a.net);
    }
  });
  it('keeps the pulmonary circuit between heart sides and includes portal/liver delivery instead of a gut-to-muscle shortcut', () => {
    expect(bloodPaths.oxygen).toEqual([
      'air',
      'lung',
      'pulmonary-vein',
      'left-heart',
      'systemic-artery',
      'tissue',
      'cell',
    ]);
    expect(bloodPaths.carbon).toEqual([
      'cell',
      'tissue',
      'systemic-vein',
      'right-heart',
      'pulmonary-artery',
      'lung',
      'air',
    ]);
    const p = [...bloodPaths.glucose];
    expect(p.slice(0, 3)).toEqual(['gut', 'portal', 'liver']);
    expect(
      p.slice(p.indexOf('right-heart'), p.indexOf('left-heart') + 1),
    ).toEqual([
      'right-heart',
      'pulmonary-artery',
      'lung',
      'pulmonary-vein',
      'left-heart',
    ]);
    expect(p).not.toContain('air');
  });
  it('compares only complete new-delivery links, preserving cargo-specific dependencies', () => {
    for (const cargo of ['oxygen', 'glucose', 'carbon'] as Cargo[])
      for (const hidden of [
        'none',
        'absorption',
        'exchange',
        'transport',
      ] as HiddenLink[]) {
        expect(newDelivery(cargo, hidden)).toBe(
          hidden !== 'transport' &&
            (cargo === 'glucose'
              ? hidden !== 'absorption'
              : hidden !== 'exchange'),
        );
      }
    // No ATP quantity, reserve inventory or time-to-failure is inferred by this boolean.
    expect(newDelivery('oxygen', 'absorption')).toBe(true);
    expect(newDelivery('glucose', 'exchange')).toBe(true);
  });
  it('restores U10 independently from earlier mission, lesson and S01 project records', () => {
    let p = withMission(emptyProgress(), 'U09', {
      object: '叶片',
      evidence: '20%假设',
      reasoning: '碳与能量分开',
      savedAt: 10,
    });
    p = withMission(p, 'U10', {
      object: '氧路线',
      evidence: '肺与组织两次交换',
      reasoning: '循环连接',
      savedAt: 20,
    });
    p.sessions.L036 = { step: 3, note: '枯落物保留化学能', completedAt: 20 };
    p.sessions.L040 = { step: 3, note: '已有储备未计算', completedAt: 30 };
    const draft = emptyProject();
    draft.zh = '旧中文';
    draft.en = 'Earlier draft';
    p = withProject(p, 'S01', draft);
    const result = decodeProgress(JSON.stringify(p));
    expect(missionForUnit(result, 'U09').reasoning).toBe('碳与能量分开');
    expect(missionForUnit(result, 'U10').savedAt).toBe(20);
    expect(result.sessions.L036?.note).toBe('枯落物保留化学能');
    expect(result.sessions.L040?.note).toBe('已有储备未计算');
    expect(result.projects.S01).toEqual(draft);
    expect(stageOutcome(result).lessons).toBe(0);
    expect(stageOutcome(result).missions).toBe(0);
  });
});
