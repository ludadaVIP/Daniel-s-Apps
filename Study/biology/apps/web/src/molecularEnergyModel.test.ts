import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MolecularEnergyDiagram,
  MolecularEnergyExplore,
} from './MolecularEnergyWorld';
import { molecularEnergyLessons } from './content/molecularEnergy';
import {
  anticodon,
  carbonBudget,
  codingDna,
  coupling,
  dnaComplement,
  expression,
  feedbackFlux,
  replication,
  respiration,
  teachingRna,
  templateDna,
  transcribe,
  translate,
} from './molecularEnergyModel';

describe('directional genetic information', () => {
  it('keeps original material constant while total duplexes double', () => {
    expect(replication(0)).toMatchObject({
      molecules: 1,
      oldStrands: 2,
      newStrands: 0,
    });
    for (let n = 1; n <= 4; n++) {
      const row = replication(n);
      expect(row.oldStrands).toBe(2);
      expect(row.oldStrands + row.newStrands).toBe(2 * row.molecules);
      expect(row.hybridMolecules / row.molecules).toBe(2 / 2 ** n);
    }
  });
  it('checks both template complementarity and coding/RNA correspondence', () => {
    expect(templateDna).toBe('TACCGAAAACCTATT');
    expect(dnaComplement(templateDna)).toBe(codingDna);
    expect(transcribe('TACTTT')).toBe('AUGAAA');
    expect(teachingRna).toBe('AUGGCUUUUGGAUAA');
    expect(teachingRna).toBe(codingDna.replaceAll('T', 'U'));
    expect(() => transcribe('AUG')).toThrow();
  });
  it('decodes the verified short sequence and excludes stop from residue counts', () => {
    expect(translate(teachingRna).aminoAcids).toEqual([
      'Met',
      'Ala',
      'Phe',
      'Gly',
    ]);
    expect(translate(teachingRna).codons).toHaveLength(5);
    expect(translate(teachingRna.replace('GCU', 'GCC')).aminoAcids).toEqual(
      translate(teachingRna).aminoAcids,
    );
    expect(translate('AUGGCCUUCUAG').aminoAcids).toEqual(['Met', 'Ala', 'Phe']);
    expect(translate('AUGUAAGGA').aminoAcids).toEqual(['Met']);
    expect(anticodon('GCU')).toBe('CGA');
    expect(anticodon('UAA')).toBeNull();
    expect(() => translate('AUGG')).toThrow();
    expect(() => translate('AAA')).toThrow();
  });
  it('separates RNA regulation, protein regulation and a causal lag', () => {
    const high = expression(2, 0.5),
      low = expression(2, 0.1);
    expect(high[1]).toMatchObject({ rna: 2, protein: 0 });
    expect(high[5]!.rna).toBe(3.875);
    expect(high[5]!.protein).toBe(4.453125);
    expect(low[5]!.protein).toBeCloseTo(0.890625);
    expect(high.map((row) => row.rna)).toEqual(low.map((row) => row.rna));
    expect(
      expression(0, 0.5).every((row) => row.rna === 0 && row.protein === 0),
    ).toBe(true);
    expect(expression(4, 0).every((row) => row.protein === 0)).toBe(true);
    expect(expression(2, 0.5, 20).at(-1)!.rna).toBeCloseTo(4, 4);
  });
});
describe('energy, matter and control are separate ledgers', () => {
  it('requires both a negative conditional sum and physical connection', () => {
    expect(coupling(20, -30, true)).toEqual({ total: -10, canDrive: true });
    expect(coupling(20, -30, false).canDrive).toBe(false);
    expect(coupling(35, -30, true).canDrive).toBe(false);
    expect(coupling(30, -30, true).canDrive).toBe(false);
  });
  it('conserves carbon in complete oxidation and lactate fermentation', () => {
    const aerobic = respiration(true),
      lactate = respiration(false);
    for (const route of [aerobic, lactate]) {
      expect(route.co2 + route.lactate * 3).toBe(route.inputCarbon);
      expect(route.productCarbon).toBe(6);
      expect(route.glycolysisAtp + route.cycleAtp + route.oxidativeAtp).toBe(
        route.totalAtp,
      );
    }
    expect(aerobic.electronPairs).toBe(2 * aerobic.oxygen);
    expect(lactate).toMatchObject({
      electronPairs: 0,
      co2: 0,
      oxidativeAtp: 0,
      totalAtp: 2,
    });
  });
  it('detects reducing-power limitation that extra ATP cannot solve', () => {
    expect(carbonBudget(6, 18, 12).g3p).toBe(2);
    expect(carbonBudget(6, 18, 6).g3p).toBe(1);
    expect(carbonBudget(6, 36, 6).g3p).toBe(1);
    expect(carbonBudget(9, 18, 18).g3p).toBe(2);
    expect(carbonBudget(9, 27, 18).g3p).toBe(3);
    for (const atp of [0, 9, 18, 36])
      for (const nadph of [0, 6, 12, 24]) {
        const row = carbonBudget(6, atp, nadph);
        expect(row.fixedCarbon).toBeLessThanOrEqual(6);
        expect(row.remainingAtp).toBeGreaterThanOrEqual(0);
        expect(row.remainingNadph).toBeGreaterThanOrEqual(0);
        expect(row.remainingAtp + row.g3p * 9).toBeCloseTo(atp);
        expect(row.remainingNadph + row.g3p * 6).toBeCloseTo(nadph);
      }
  });
  it('makes inhibition specific, reversible and distinct from substrate supply', () => {
    expect(feedbackFlux(6, 0, true)).toBe(9);
    expect(feedbackFlux(6, 4, true)).toBe(4.5);
    expect(feedbackFlux(6, 12, true)).toBe(2.25);
    expect(feedbackFlux(6, 12, false)).toBe(9);
    expect(feedbackFlux(6, 0, true)).toBe(feedbackFlux(6, 0, false));
    expect(feedbackFlux(0, 12, true)).toBe(0);
    expect(feedbackFlux(6, 4, true)).toBeGreaterThan(feedbackFlux(2, 4, true));
  });
  it('rejects nonfinite and physically invalid amounts instead of returning misleading diagrams', () => {
    for (const value of [NaN, Infinity, -1]) {
      expect(() => replication(value)).toThrow();
      expect(() => expression(value, 0.5)).toThrow();
      expect(() => expression(2, value)).toThrow();
      expect(() => carbonBudget(6, value, 12)).toThrow();
      expect(() => carbonBudget(value, 18, 12)).toThrow();
      expect(() => feedbackFlux(value, 0, true)).toThrow();
      expect(() => feedbackFlux(6, value, true)).toThrow();
    }
    expect(() => expression(2, 0.5, 1.5)).toThrow();
    expect(() => expression(5, 0.5)).toThrow();
    expect(() => coupling(NaN, -30, true)).toThrow();
    expect(() => coupling(20, -Infinity, true)).toThrow();
  });
});
describe('lesson and rendered diagram contracts', () => {
  it('provides eight complete lessons with stable progress IDs and distinct skill checks', () => {
    expect(molecularEnergyLessons.map((lesson) => lesson.id)).toEqual(
      Array.from({ length: 8 }, (_, i) => `L${121 + i}`),
    );
    for (const lesson of molecularEnergyLessons) {
      expect(lesson.objectives).toHaveLength(3);
      expect(lesson.prediction).toHaveLength(3);
      expect(new Set(lesson.prediction.map((p) => p.en)).size).toBe(3);
      expect(lesson.terms.length).toBeGreaterThanOrEqual(6);
      expect(lesson.terms.length).toBeLessThanOrEqual(10);
      expect(lesson.questions.map((question) => question.id)).toEqual(
        [1, 2, 3, 4].map((n) => `${lesson.id}-q${n}`),
      );
      expect(lesson.questions.map((question) => question.skill)).toEqual([
        'concept',
        'concept',
        'reasoning',
        'vocabulary',
      ]);
      expect(
        lesson.questions.every(
          (question) =>
            question.feedback.en.length > 30 && question.revisit.zh.length > 5,
        ),
      ).toBe(true);
    }
  });
  it('renders each language with scoped styles, valid colour attributes and accessible scroll regions', () => {
    for (const mode of ['zh', 'en', 'bilingual'] as const)
      for (const lesson of molecularEnergyLessons) {
        const markup = renderToStaticMarkup(
          createElement(MolecularEnergyDiagram, { id: lesson.id, mode }),
        );
        expect(markup).toContain('class="bio-s6-lab me-lab"');
        expect(markup).toContain('role="region" tabindex="0"');
        expect(markup.match(/<title>/g)).toHaveLength(1);
        const colours = Array.from(
          markup.matchAll(/\b(?:stroke|fill)="(#[^"]+)"/g),
          (match) => match[1],
        );
        expect(colours.length).toBeGreaterThan(3);
        for (const colour of colours)
          expect(colour).toMatch(/^#(?:[\da-f]{3}|[\da-f]{6})$/i);
        expect(markup).not.toContain('[object Object]');
      }
  });
  it('offers time playback only for processes, retaining static records for every model', () => {
    for (const lesson of molecularEnergyLessons) {
      const markup = renderToStaticMarkup(
        createElement(MolecularEnergyExplore, {
          id: lesson.id,
          mode: 'en',
          onExplore: () => {},
        }),
      );
      expect(markup).toContain('me-record');
      expect(markup.includes('bio-playback')).toBe(
        ['L121', 'L122', 'L123', 'L124', 'L126'].includes(lesson.id),
      );
    }
  });
});
