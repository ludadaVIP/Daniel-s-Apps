import { describe, expect, it } from 'vitest';
import {
  photosynthesisConditions,
  respirationProfile,
  carbonTracers,
  foodEnergyBudget,
  type EnergyCell,
  type CellEnvironment,
} from './energyModel';
import {
  decodeProgress,
  emptyProgress,
  withMission,
  missionForUnit,
  stageOutcome,
  withProject,
} from './progress';
import { emptyProject } from './project';
describe('energy and matter models', () => {
  it('requires distinct energy and material prerequisites, without assigning light-dependent rates', () => {
    for (const light of [0, 1, 2] as const)
      for (const water of [true, false])
        for (const carbon of [true, false]) {
          const state = photosynthesisConditions(light, water, carbon);
          expect(state.canMakeSugar).toBe(light > 0 && water && carbon);
          expect(state.missing.includes('light')).toBe(light === 0);
          expect(state.missing.includes('water')).toBe(!water);
          expect(state.missing.includes('carbon')).toBe(!carbon);
        }
    expect(photosynthesisConditions(1, true, true)).toEqual(
      photosynthesisConditions(2, true, true),
    );
  });
  it('keeps day/night respiration independent of chloroplast profile, while requiring oxygen for the depicted aerobic route', () => {
    for (const cell of ['leaf', 'root', 'muscle'] as EnergyCell[])
      for (const env of ['day', 'night', 'noOxygen'] as CellEnvironment[]) {
        const state = respirationProfile(cell, env);
        expect(state.aerobic).toBe(env !== 'noOxygen');
        expect(state.photosynthesis).toBe(cell === 'leaf' && env === 'day');
      }
  });
  it('retains all supplied carbon identities rather than converting them into energy', () => {
    for (const possible of [false, true])
      for (const frame of [0, 1, 2, 3]) {
        const trace = carbonTracers(frame, possible);
        expect(trace.map((p) => p.id)).toEqual([0, 1, 2, 3, 4, 5]);
        expect(new Set(trace.map((p) => p.pool)).size).toBe(1);
        if (!possible)
          expect(trace.every((p) => p.pool === 'input')).toBe(true);
        if (frame === 3 && possible)
          expect(trace.every((p) => p.pool === 'output')).toBe(true);
        expect(carbonTracers(frame, possible, false)).toEqual([]);
      }
  });
  it('balances every energy level and the full account, retaining chemical energy in detritus', () => {
    for (const percent of [5, 10, 20] as const) {
      const rows = foodEnergyBudget(percent);
      expect(rows[0]!.incoming).toBe(1000);
      for (const [i, row] of rows.entries()) {
        expect(row.next + row.detritus + row.heat).toBeCloseTo(row.incoming);
        expect(row.detritus).toBeGreaterThan(0);
        expect(row.heat).toBeGreaterThan(0);
        if (i < 2) expect(rows[i + 1]!.incoming).toBe(row.next);
      }
      expect(rows[2]!.next).toBe(0);
      expect(
        rows.reduce((sum, row) => sum + row.heat + row.detritus, 0),
      ).toBeCloseTo(1000);
    }
    const example = foodEnergyBudget(10);
    expect(example.map((row) => row.incoming)).toEqual([1000, 100, 10]);
    expect(example[0]).toMatchObject({ next: 100, detritus: 200, heat: 700 });
    expect(example[0]!.heat).not.toBe(example[0]!.incoming - example[0]!.next);
  });
  it('compares transfer assumptions without changing plant input or claiming a universal ten percent', () => {
    expect(foodEnergyBudget(5).map((row) => row.incoming)).toEqual([
      1000, 50, 2.5,
    ]);
    expect(foodEnergyBudget(20).map((row) => row.incoming)).toEqual([
      1000, 200, 40,
    ]);
  });
  it('restores U09 records without replacing earlier units or changing S01 completion', () => {
    let p = withMission(emptyProgress(), 'U08', {
      object: '12:4',
      evidence: '5与4次',
      reasoning: '净向右1',
      savedAt: 10,
    });
    p = withMission(p, 'U09', {
      object: '阳光到动物',
      evidence: '模型光与碳',
      reasoning: '碳可循环，能量散热',
      savedAt: 20,
    });
    const draft = emptyProject();
    draft.zh = '旧中文草稿';
    draft.en = 'Old draft';
    p = withProject(p, 'S01', draft);
    p.sessions.L036 = { step: 3, note: '枯落物仍有化学能', completedAt: 20 };
    p.answers['L030-q3'] = { choice: 2, first: 0, at: 10 };
    const restored = decodeProgress(JSON.stringify(p));
    expect(missionForUnit(restored, 'U08').reasoning).toBe('净向右1');
    expect(missionForUnit(restored, 'U09').reasoning).toBe(
      '碳可循环，能量散热',
    );
    expect(restored.sessions.L036?.note).toBe('枯落物仍有化学能');
    expect(restored.answers['L030-q3']).toEqual(p.answers['L030-q3']);
    expect(restored.projects.S01).toEqual(draft);
    expect(stageOutcome(restored).lessons).toBe(0);
    expect(stageOutcome(restored).missions).toBe(0);
  });
});
