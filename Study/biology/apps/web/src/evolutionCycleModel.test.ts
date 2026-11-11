import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { evolutionCycleLessons } from './content/evolutionCycles';
import { evolutionCycleUnits } from './evolutionCycleUnits';
import {
  EvolutionCycleDiagram,
  EvolutionCycleExplore,
  EvolutionCycleHookArt,
} from './EvolutionCycleWorld';
import {
  selection,
  carbonStates,
  carbonFlows,
  transfer,
  carbonInitial,
  energyBudget,
  nitrogenState,
  fictionalTree,
  rotateTree,
  treeSplits,
  disturbanceComparison,
  disturbanceComparisonRecords,
} from './evolutionCycleModel';
describe('conditional evolution and ecosystem mechanisms', () => {
  it('normalizes reproductive contributions and needs initial variation', () => {
    expect(selection(0.5, 2, 1, 1)[1]).toBeCloseTo(2 / 3);
    for (const p of selection(0.2, 2, 1, 12)) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
      expect(p + (1 - p)).toBe(1);
    }
    expect(selection(0, 2, 1, 5)).toEqual([0, 0, 0, 0, 0, 0]);
    expect(selection(0.5, 1, 2, 3)[3]).toBeLessThan(0.5);
    expect(() => selection(0.5, 0, 0, 1)).toThrow();
  });
  it('conserves stocks in every carbon frame and changes air only through flux', () => {
    for (const burn of [true, false])
      for (const s of carbonStates(burn)) {
        expect(Object.values(s).reduce((a, b) => a + b, 0)).toBe(100);
        expect(Math.min(...Object.values(s))).toBeGreaterThanOrEqual(0);
      }
    expect(carbonStates(true)[5]!.air - carbonStates(false)[5]!.air).toBe(5);
    expect(carbonFlows[0].from).toBe('air');
    expect(() => transfer(carbonInitial, 'fuel', 'air', 11)).toThrow();
    expect(() => transfer(carbonInitial, 'fuel', 'air', -1)).toThrow();
  });
  it('closes energy accounts at each efficiency and each level', () => {
    for (const e of [0.05, 0.1, 0.2]) {
      let input = 1000;
      for (let i = 0; i < 4; i++) {
        const b = energyBudget(input, e);
        expect(b.next + b.detritus + b.heat).toBeCloseTo(input);
        expect(Math.min(b.next, b.detritus, b.heat)).toBeGreaterThanOrEqual(0);
        input = b.next;
      }
    }
    expect(energyBudget(1000, 0.2).next).toBe(200);
  });
  it('tracks nitrogen atoms rather than conflating atoms and N2 molecules', () => {
    for (const path of ['uptake', 'return'] as const)
      for (let step = 0; step < 6; step++)
        expect(nitrogenState(path, step).nitrogenAtoms).toBe(1);
    expect(nitrogenState('return', 4).form).toBe('N₂');
    expect(nitrogenState('uptake', 4).form).toBe('organic N');
  });
  it('preserves common-ancestor groups under branch rotation', () => {
    expect(treeSplits(rotateTree(fictionalTree))).toEqual(
      treeSplits(fictionalTree),
    );
    expect(treeSplits(fictionalTree)).toContain('Amber|Birch');
  });
  it('has a biodiversity counterexample and disturbance-specific outcomes', () => {
    const a = disturbanceComparison({
        community: 'redundant',
        disturbance: 'drought',
      }),
      b = disturbanceComparison({
        community: 'single',
        disturbance: 'drought',
      });
    expect(a.richness).toBeGreaterThan(b.richness);
    expect(a.resistance).toBeLessThan(b.resistance);
    expect(a.records[2]!.function).toBeLessThan(b.records[2]!.function);
    expect(disturbanceComparisonRecords).toHaveLength(6);
    for (const r of disturbanceComparisonRecords) {
      expect(r.resilience).toBeGreaterThanOrEqual(0);
      expect(r.resilience).toBeLessThanOrEqual(1);
      expect(r.assumptions.length).toBe(3);
      expect(r.records.map((x) => x.time)).toEqual([0, 1, 30]);
      expect(r.resilience).toBeCloseTo(
        (r.records[2]!.function - r.records[1]!.function) /
          (100 - r.records[1]!.function),
      );
    }
  });
  it('delivers the eight lessons with separate science and vocabulary scoring', () => {
    expect(evolutionCycleLessons.map((x) => x.id)).toEqual([
      'L089',
      'L090',
      'L091',
      'L092',
      'L093',
      'L094',
      'L095',
      'L096',
    ]);
    expect(evolutionCycleUnits.flatMap((x) => x.lessonIds)).toEqual(
      evolutionCycleLessons.map((x) => x.id),
    );
    for (const l of evolutionCycleLessons) {
      expect(l.minutes).toBeGreaterThanOrEqual(25);
      expect(l.minutes).toBeLessThanOrEqual(35);
      expect(l.objectives.length).toBeGreaterThanOrEqual(2);
      expect(l.objectives.length).toBeLessThanOrEqual(4);
      expect(l.terms.length).toBeGreaterThanOrEqual(6);
      expect(l.terms.length).toBeLessThanOrEqual(8);
      expect(l.questions.map((q) => q.skill)).toEqual([
        'concept',
        'concept',
        'reasoning',
        'vocabulary',
      ]);
      for (const q of l.questions) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(q.feedback.en.length).toBeGreaterThan(40);
        expect(q.revisit.en.length).toBeGreaterThan(15);
      }
    }
  });
  it('renders all diagrams, labs and hook art in every language with one-string SVG titles', () => {
    const hooks = new Set<string>();
    for (const l of evolutionCycleLessons)
      for (const mode of ['zh', 'en', 'bilingual'] as const) {
        for (const component of [
          EvolutionCycleDiagram,
          EvolutionCycleExplore,
          EvolutionCycleHookArt,
        ]) {
          const html = renderToStaticMarkup(
            createElement(component, { id: l.id, mode, onExplore: () => {} }),
          );
          expect(html.match(/<svg\b/g)).toHaveLength(1);
          expect(html.match(/<title>/g)).toHaveLength(1);
          expect(html).not.toContain('undefined');
          expect(html).toContain('role="img"');
          if (component === EvolutionCycleExplore) {
            expect(html).toContain('bio-s3-lab');
            expect(html).toContain('aria-pressed');
            expect(html).toContain('<details>');
          }
          if (component === EvolutionCycleHookArt && mode === 'en')
            hooks.add(html);
        }
      }
    expect(hooks.size).toBe(8);
  });
  it('keeps complete bilingual manuscript mechanisms and metadata aligned', () => {
    const manuscripts = import.meta.glob(
      '../../../curriculum/s04/u2[34]/l*.md',
      { query: '?raw', import: 'default', eager: true },
    ) as Record<string, string>;
    expect(Object.keys(manuscripts)).toHaveLength(8);
    for (const l of evolutionCycleLessons) {
      const md = Object.entries(manuscripts).find(([p]) =>
        p.endsWith(l.id.toLowerCase() + '.md'),
      )![1];
      expect(md).toContain('stage: S04');
      expect(md).toContain(`title_zh: ${l.title.zh}`);
      expect(md).toContain(`diagram: ${l.id}-D01`);
      expect(md.match(/^## /gm)).toHaveLength(11);
      expect(md.match(/^### 中文/gm)).toHaveLength(11);
      expect(md.match(/^### English/gm)).toHaveLength(11);
      const explain = md.split('## Explain')[1]!.split('## Misconception')[0]!;
      const zh = explain
        .split('### 中文')[1]!
        .split('### English')[0]!
        .replace(/\s/g, '');
      const en = explain.split('### English')[1]!.trim().split(/\s+/);
      expect(zh.length).toBeGreaterThanOrEqual(450);
      expect(zh.length).toBeLessThanOrEqual(700);
      expect(en.length).toBeGreaterThanOrEqual(200);
      expect(en.length).toBeLessThanOrEqual(350);
      for (const q of l.questions) {
        expect(md).toContain(q.prompt.zh);
        expect(md).toContain(q.feedback.en);
      }
    }
  });
});
