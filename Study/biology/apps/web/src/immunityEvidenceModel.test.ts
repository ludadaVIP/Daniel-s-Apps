import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { immunityEvidenceLessons } from './content/immunityEvidence';
import { immunityEvidenceUnits } from './immunityEvidenceUnits';
import {
  ImmunityEvidenceDiagram,
  ImmunityEvidenceExplore,
  ImmunityEvidenceHookArt,
} from './ImmunityEvidenceWorld';
import {
  resistanceFrames,
  resistantFraction,
  riskComparison,
  summary,
  biologicalReplicates,
  pairedDifference,
  assessHypothesis,
} from './immunityEvidenceModel';

describe('immunity and evidence conditional models', () => {
  it('separates survivor fraction from count and does not create resistance', () => {
    const frames = resistanceFrames(2, true);
    expect(frames).toEqual([
      { sensitive: 18, resistant: 2 },
      { sensitive: 0, resistant: 2 },
      { sensitive: 0, resistant: 8 },
    ]);
    expect(frames.map(resistantFraction)).toEqual([0.1, 1, 1]);
    expect(resistanceFrames(2, false).map(resistantFraction)).toEqual([
      0.1, 0.1, 0.1,
    ]);
    expect(resistanceFrames(0, true)).toEqual([
      { sensitive: 20, resistant: 0 },
      { sensitive: 0, resistant: 0 },
      { sensitive: 0, resistant: 0 },
    ]);
    expect(resistantFraction({ sensitive: 0, resistant: 0 })).toBeNull();
    for (let n = 0; n <= 20; n++) {
      const [start, survivors, children] = resistanceFrames(n, true);
      expect(start!.sensitive + start!.resistant).toBe(20);
      expect(survivors!.resistant).toBe(n);
      expect(children!.resistant).toBe(n * 4);
      expect(children!.sensitive).toBe(0);
    }
    for (const invalid of [-1, 0.5, 21, NaN])
      expect(() => resistanceFrames(invalid, true)).toThrow();
    expect(() => resistantFraction({ sensitive: -1, resistant: 2 })).toThrow();
  });
  it('uses denominators and distinguishes relative from absolute differences', () => {
    const r = riskComparison(10, 200, 20, 200);
    expect(r.a).toBe(0.05);
    expect(r.b).toBe(0.1);
    expect(r.absoluteReduction).toBe(0.05);
    expect(r.relativeReduction).toBe(0.5);
    expect(riskComparison(10, 50, 20, 200).absoluteReduction).toBe(-0.1);
    expect(riskComparison(10, 170, 20, 200).a).toBeCloseTo(0.058823529);
    expect(riskComparison(0, 10, 0, 10).relativeReduction).toBeNull();
    expect(() => riskComparison(1, 0, 2, 10)).toThrow();
    expect(() => riskComparison(11, 10, 2, 10)).toThrow();
    expect(() => riskComparison(-1, 10, 2, 10)).toThrow();
  });
  it('reports true min–max and shows sensitivity to an unverified point', () => {
    expect(summary([8, 9, 10, 9])).toEqual({
      n: 4,
      mean: 9,
      min: 8,
      max: 10,
      range: 2,
    });
    expect(summary([8, 9, 28, 9])).toEqual({
      n: 4,
      mean: 13.5,
      min: 8,
      max: 28,
      range: 20,
    });
    expect(summary([5, 5, 5]).range).toBe(0);
    expect(summary([-2, 0, 2]).mean).toBe(0);
    expect(() => summary([])).toThrow();
    expect(() => summary([1, Infinity])).toThrow();
  });
  it('does not count re-readings or paired before/after as independent plants', () => {
    expect(biologicalReplicates(Array<string>(12).fill('A'))).toBe(1);
    expect(
      biologicalReplicates([
        'A',
        'A',
        'A',
        'B',
        'B',
        'B',
        'C',
        'C',
        'C',
        'D',
        'D',
        'D',
      ]),
    ).toBe(4);
    expect(biologicalReplicates([])).toBe(0);
    expect(() => biologicalReplicates([''])).toThrow();
    expect(pairedDifference([10, 20, 30], [12, 23, 34])).toEqual({
      n: 3,
      mean: 3,
      min: 2,
      max: 4,
      range: 2,
    });
    expect(() => pairedDifference([1], [2, 3])).toThrow();
  });
  it('requires operational factor, response and matched conditions together', () => {
    expect(
      assessHypothesis('light hours', 'height change in cm after 7 days', true),
    ).toBe(true);
    expect(
      assessHypothesis('health', 'height change in cm after 7 days', true),
    ).toBe(false);
    expect(assessHypothesis('light hours', 'happy', true)).toBe(false);
    expect(
      assessHypothesis(
        'light hours',
        'height change in cm after 7 days',
        false,
      ),
    ).toBe(false);
  });
});
describe('eight complete evidence lessons', () => {
  it('provides distinct bilingual predictions, objectives and balanced checks', () => {
    expect(immunityEvidenceLessons.map((l) => l.id)).toEqual([
      'L113',
      'L114',
      'L115',
      'L116',
      'L117',
      'L118',
      'L119',
      'L120',
    ]);
    expect(immunityEvidenceUnits.flatMap((u) => u.lessonIds)).toEqual(
      immunityEvidenceLessons.map((l) => l.id),
    );
    for (const l of immunityEvidenceLessons) {
      expect(l.objectives).toHaveLength(3);
      expect(l.prediction).toHaveLength(3);
      expect(new Set(l.prediction.map((p) => p.en)).size).toBe(3);
      expect(l.terms.length).toBeGreaterThanOrEqual(6);
      expect(l.terms.length).toBeLessThanOrEqual(8);
      expect(l.questions.map((q) => q.skill)).toEqual([
        'concept',
        'concept',
        'reasoning',
        'vocabulary',
      ]);
      for (const q of l.questions) {
        expect(q.feedback.zh.length).toBeGreaterThan(12);
        expect(q.revisit.en.length).toBeGreaterThan(10);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    }
  });
  it('renders all original named diagrams and keyboard-operable activities in every language', () => {
    for (const l of immunityEvidenceLessons)
      for (const mode of ['zh', 'en', 'bilingual'] as const) {
        for (const Art of [ImmunityEvidenceDiagram, ImmunityEvidenceHookArt]) {
          const html = renderToStaticMarkup(
            createElement(Art, { id: l.id, mode }),
          );
          expect(html).toContain('role="img"');
          expect(html).toContain('aria-labelledby=');
          expect(html).toContain('tabindex="0"');
          expect(html).toContain('ie-diagram-scroll');
        }
        const html = renderToStaticMarkup(
          createElement(ImmunityEvidenceExplore, {
            id: l.id,
            mode,
            onExplore: () => {},
          }),
        );
        expect(html).toContain('ie-lab');
        expect(html).toMatch(/<button|type="checkbox"/);
        expect(html).toContain('<table');
        expect(html).toContain('aria-live="polite"');
        expect(html).not.toContain('NaN');
        if (!['L114', 'L115'].includes(l.id))
          expect(html).not.toContain('bio-playback');
      }
  });
});
