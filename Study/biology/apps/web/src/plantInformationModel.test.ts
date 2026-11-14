import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlantInformationDiagram } from './PlantInformationWorld';
import { plantInformationLessons } from './content/plantInformation';
import {
  complement,
  dnaCounts,
  divisionCheckpoint,
  photosynthesis,
  plantTrait,
  traitDistribution,
  transpiration,
  transportRoutes,
} from './plantInformationModel';
describe('plant transport and environmental boundaries', () => {
  it('allows opposite phloem directions in separate routes while retaining root-to-leaf water', () => {
    expect(transportRoutes('leaf-source').phloem).toContainEqual([
      'leaf',
      'shoot',
    ]);
    expect(transportRoutes('leaf-source').phloem).toContainEqual([
      'leaf',
      'root',
    ]);
    expect(transportRoutes('store-source').phloem).toContainEqual([
      'store',
      'shoot',
    ]);
    expect(transportRoutes('store-source').phloem).toContainEqual([
      'leaf',
      'shoot',
    ]);
    expect(transportRoutes('store-source').xylem).toEqual(['root', 'leaf']);
  });
  it('removes the water-vapour gradient at saturated air and suppresses loss with closed stomata', () => {
    expect(transpiration(100, 3, 35, 100, false).rate).toBe(0);
    expect(transpiration(30, 3, 35, 100, true).rate).toBeLessThan(
      transpiration(30, 0, 20, 100, false).rate,
    );
    expect(transpiration(40, 1, 25, 100, false).uptake).not.toBe(
      transpiration(40, 1, 25, 100, false).rate,
    );
  });
  it('distinguishes a light-limited response from a carbon-limited plateau', () => {
    expect(photosynthesis(20, 40)).toBe(photosynthesis(20, 70));
    expect(photosynthesis(90, 40)).toBe(photosynthesis(60, 40));
    expect(photosynthesis(90, 70)).toBeGreaterThan(photosynthesis(90, 40));
    expect(photosynthesis(0, 100)).toBe(0);
  });
});
describe('rendered science diagrams', () => {
  it('keeps stable unspaced question identifiers for progress and review records', () => {
    for (const lesson of plantInformationLessons) {
      expect(lesson.questions.map((question) => question.id)).toEqual(
        [1, 2, 3, 4].map((n) => `${lesson.id}-q${n}`),
      );
    }
  });
  it('renders valid visible colour attributes, scoped roots and both limiting-factor curves', () => {
    for (const mode of ['zh', 'en', 'bilingual'] as const) {
      for (let n = 105; n <= 112; n++) {
        const markup = renderToStaticMarkup(
          createElement(PlantInformationDiagram, { id: `L${n}`, mode }),
        );
        expect(markup).toContain('class="bio-s5-lab pi-lab"');
        const colours = Array.from(
          markup.matchAll(/\b(?:stroke|fill)="(#[^"]+)"/g),
          (match) => match[1],
        );
        expect(colours.length).toBeGreaterThan(3);
        for (const colour of colours)
          expect(colour).toMatch(
            /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
          );
        if (n === 107) {
          expect(markup.match(/<polyline\b/g)).toHaveLength(2);
          expect(markup).toMatch(
            /<polyline[^>]+stroke="#a15e40"[^>]+stroke-width="5"/,
          );
          expect(markup).toMatch(
            /<polyline[^>]+stroke="#347c65"[^>]+stroke-width="2"/,
          );
        }
      }
    }
  });
});
describe('information, division and variation', () => {
  it('preserves complement involution and whole-double-strand pairing totals', () => {
    for (const fragment of ['ATGC', 'AAAA', 'GCGCG', 'ATGCCAT']) {
      expect(complement(complement(fragment))).toBe(fragment);
      const n = dnaCounts(fragment);
      expect(n.A).toBe(n.T);
      expect(n.G).toBe(n.C);
      expect(Object.values(n).reduce((a, b) => a + b, 0)).toBe(
        2 * fragment.length,
      );
    }
    expect(() => dnaCounts('AUG')).toThrow();
  });
  it('conserves replicated DNA across completed divisions with no second replication', () => {
    for (const kind of ['mitosis', 'meiosis'] as const) {
      const replicated = divisionCheckpoint(kind, 1);
      for (const stage of [2, 3]) {
        const end = divisionCheckpoint(kind, stage);
        expect(end.cells * end.dna).toBe(replicated.dna);
        expect(end.cells * end.chromatids).toBe(replicated.chromatids);
      }
    }
    expect(divisionCheckpoint('meiosis', 2).sets).toBe(1);
    expect(divisionCheckpoint('mitosis', 3).sets).toBe(2);
  });
  it('uses the same population and an explicit genotype-dependent environmental effect', () => {
    expect(traitDistribution(0).reduce((a, b) => a + b.count, 0)).toBe(64);
    expect(traitDistribution(2).reduce((a, b) => a + b.count, 0)).toBe(64);
    expect(plantTrait(6, 2) - plantTrait(6, 0)).toBeGreaterThan(
      plantTrait(0, 2) - plantTrait(0, 0),
    );
    expect(plantTrait(3, 0)).not.toBe(plantTrait(3, 2));
  });
});
