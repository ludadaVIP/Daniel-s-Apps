import { describe, expect, it } from 'vitest';
import { microbeEvidence, fermentation, transferPath, barrierSequence, lifeCycles, cycleTransition, plantReproduction, animalDevelopment, targetResponse } from './connectionModel';

describe('microbial evidence and bounded causal models', () => {
  it('retains uncertainty before structural evidence and does not equate fungi with multicellularity', () => {
    expect(microbeEvidence('yeast', false).conclusion).toBe('insufficient');
    expect(microbeEvidence('yeast', true).conclusion).toBe('fungus');
    expect(microbeEvidence('mould', true).nucleusVisible).toBe(true);
    expect(microbeEvidence('bacterium', true).nucleusVisible).toBe(false);
  });
  it('requires both viable yeast and substrate without turning playback steps into rates', () => {
    for (const viable of [true, false]) for (const sugar of [true, false]) {
      expect(fermentation(viable, sugar, 3).carbonDioxide).toBe(viable && sugar);
      expect(fermentation(viable, sugar, 3).ethanol).toBe(viable && sugar);
    }
    expect(fermentation(true, true, 0).carbonDioxide).toBe(false);
  });
  it('breaks only the selected touch pathway and never predicts infection', () => {
    expect(transferPath('touch', true).reached).toEqual(['source', 'surface']);
    expect(transferPath('touch', false).reached).toEqual(['source', 'surface', 'hand', 'entry']);
    expect(transferPath('air', true)).toEqual(transferPath('air', false));
    expect(transferPath('air', false).predictsInfection).toBe(false);
  });
  it('clamps barrier frames and keeps challenged barriers distinct from certain infection', () => {
    expect(barrierSequence('airway', false, -2).visible).toHaveLength(1);
    expect(barrierSequence('stomach', true, 50).visible).toHaveLength(3);
    expect(barrierSequence('skin', true, 2).certainInfection).toBe(false);
  });
});
describe('life cycles and development', () => {
  it('distinguishes seed generations and vegetative offspring without cycling parents backwards', () => {
    expect(cycleTransition('pea', 3).nextGeneration).toBe(true);
    expect(cycleTransition('butterfly', 3).stage).toEqual(lifeCycles.butterfly.stages[3]);
    expect(cycleTransition('frog', -1).index).toBe(0);
    expect(cycleTransition('strawberry', 40).index).toBe(3);
  });
  it('does not treat pollination as fertilisation or make runner offspring into seeds', () => {
    expect(plantReproduction('flower', false, 3).newSeed).toBe(false);
    expect(plantReproduction('flower', true, 1).gameteFusion).toBe(false);
    expect(plantReproduction('flower', true, 3).newSeed).toBe(true);
    expect(plantReproduction('runner', true, 3)).toMatchObject({ gameteFusion: false, newSeed: false, daughterPlant: true });
  });
  it('separates fertilisation location from development location and requires fusion in this sexual model', () => {
    expect(animalDevelopment('chicken', true, 3).fertilisation.zh).toBe('体内');
    expect(animalDevelopment('chicken', true, 3).development.zh).toBe('体外：卵内');
    for (const kind of ['frog', 'chicken', 'human'] as const) expect(animalDevelopment(kind, false, 3).embryo).toBe(false);
    expect(animalDevelopment('human', true, 3).inheritedSources).toBe(2);
  });
  it('requires a matching receptor for the illustrated specific response without assigning puberty timing', () => {
    for (const s of [false, true]) for (const r of [false, true]) expect(targetResponse(s, r).specificResponse).toBe(s && r);
    expect(targetResponse(true, true).predictsTiming).toBe(false);
  });
});
