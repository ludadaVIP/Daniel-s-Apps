import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { signalingEvolutionLessons } from './content/signalingEvolution';
import { signalingEvolutionUnits } from './signalingEvolutionUnits';
import {
  SignalingEvolutionDiagram,
  SignalingEvolutionExplore,
  SignalingEvolutionHookArt,
} from './SignalingEvolutionWorld';
import {
  alleleCounts,
  clades,
  evolutionFrames,
  feedbackFrames,
  hardyWeinberg,
  immuneFrames,
  mean,
  migrate,
  rotateTree,
  selectedFrequency,
  signalFrames,
  spikeTrain,
  teachingTree,
  tips,
  traitData,
} from './signalingEvolutionModel';

describe('conditional signalling and diploid population models', () => {
  it('distinguishes absent reception from interrupted transduction', () => {
    expect(
      signalFrames(false, true).every((f) => !f.bound && !f.response),
    ).toBe(true);
    expect(signalFrames(true, false).at(-1)).toEqual({
      bound: true,
      relay: false,
      response: false,
    });
    expect(
      signalFrames(true, true).map((f) => [f.bound, f.relay, f.response]),
    ).toEqual([
      [false, false, false],
      [true, false, false],
      [true, true, false],
      [true, true, true],
    ]);
  });
  it('encodes intensity with frequency rather than changed spike amplitude', () => {
    const weak = spikeTrain(false),
      strong = spikeTrain(true);
    expect(weak.filter((v) => v.mv === 30)).toHaveLength(2);
    expect(strong.filter((v) => v.mv === 30)).toHaveLength(5);
    for (const trace of [weak, strong]) {
      expect(trace[0]).toEqual({ ms: 0, mv: -70 });
      expect(trace.at(-1)?.ms).toBe(100);
      expect(Math.max(...trace.map((v) => v.mv))).toBe(30);
      expect(Math.min(...trace.map((v) => v.mv))).toBe(-80);
    }
  });
  it('corrects signed deviation, including documented initial delayed history', () => {
    expect(feedbackFrames(0.3, 0, 2)).toEqual([10, 7, 4.9]);
    expect(feedbackFrames(0, 2, 4)).toEqual([10, 10, 10, 10, 10]);
    expect(feedbackFrames(0.6, 1, 2)).toEqual([10, 4, -2]);
    expect(
      feedbackFrames(0.3, 0).every((v, i, all) => i === 0 || v < all[i - 1]!),
    ).toBe(true);
    expect(feedbackFrames(0.6, 1).some((v) => v < 0)).toBe(true);
    for (const args of [
      [NaN, 0],
      [-0.1, 0],
      [0.7, 0],
      [0.3, -1],
      [0.3, 0.5],
      [0.3, 3],
    ])
      expect(() => feedbackFrames(args[0]!, args[1]!)).toThrow();
  });
  it('keeps selected T-dependent antibody branch separate from available activated CD8', () => {
    expect(immuneFrames(false, true).at(-1)).toEqual({
      presented: true,
      helper: false,
      plasma: false,
      antibody: false,
      killing: true,
    });
    expect(immuneFrames(true, false).at(-1)).toEqual({
      presented: true,
      helper: true,
      plasma: true,
      antibody: true,
      killing: false,
    });
    expect(immuneFrames(true, true)[0]?.presented).toBe(false);
  });
  it('conserves diploid copies and keeps genotype fractions distinct from allele frequency', () => {
    expect(alleleCounts(20, 40, 40)).toEqual({
      N: 100,
      A: 80,
      a: 120,
      copies: 200,
      p: 0.4,
      q: 0.6,
    });
    expect(alleleCounts(0, 100, 0).p).toBe(0.5);
    expect(alleleCounts(0, 0, 0).p).toBeNull();
    expect(alleleCounts(0, 0, 5).p).toBe(0);
    expect(alleleCounts(5, 0, 0).p).toBe(1);
    for (let AA = 0; AA <= 10; AA++)
      for (let Aa = 0; Aa <= 10; Aa++) {
        const c = alleleCounts(AA, Aa, 7);
        expect(c.A + c.a).toBe(2 * c.N);
        expect(c.p! + c.q!).toBeCloseTo(1);
      }
    expect(() => alleleCounts(-1, 0, 0)).toThrow();
    expect(() => alleleCounts(0, 0.5, 0)).toThrow();
    expect(hardyWeinberg(0.4)).toEqual([0.16000000000000003, 0.48, 0.36]);
    expect(hardyWeinberg(0)).toEqual([0, 0, 1]);
    expect(() => hardyWeinberg(1.01)).toThrow();
  });
  it('uses genotype fitness weights and weighted immigrant denominators', () => {
    expect(selectedFrequency(0.4, 0.4)).toBeCloseTo(0.512 / 1.16);
    expect(selectedFrequency(0.4, 0)).toBeCloseTo(0.4);
    expect(selectedFrequency(0, 0.4)).toBe(0);
    expect(selectedFrequency(1, 0.4)).toBe(1);
    expect(migrate(0.4, 20, 0.8, 10)).toBeCloseTo(16 / 30);
    expect(migrate(0.25, 80, 0.75, 20)).toBeCloseTo(0.35);
    expect(migrate(0.4, 20, 0.8, 20)).toBeCloseTo(0.6);
    expect(migrate(0.4, 20, 0.8, 0)).toBe(0.4);
    expect(() => migrate(0.5, 0, 0.8, 10)).toThrow();
    expect(() => selectedFrequency(0.4, -1)).toThrow();
  });
  it('reproduces seeded runs, preserves absence/fixation, and stays on a 2N-copy grid', () => {
    const options = { p: 0.4, N: 20, seed: 17, drift: true };
    expect(evolutionFrames(options)).toEqual(evolutionFrames(options));
    expect(evolutionFrames(options)).not.toEqual(
      evolutionFrames({ ...options, seed: 29 }),
    );
    for (const p of [0, 1])
      expect(evolutionFrames({ ...options, p, selection: 0.4 })).toEqual(
        Array<number>(11).fill(p),
      );
    for (let seed = 1; seed <= 100; seed++) {
      for (const p of evolutionFrames({
        ...options,
        seed,
        selection: 0.4,
        migrants: 10,
      })) {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
        expect(p * 40).toBeCloseTo(Math.round(p * 40));
      }
    }
    expect(
      evolutionFrames({ ...options, p: 0, drift: false, migrants: 10 })[1],
    ).toBeCloseTo(8 / 30);
    expect(
      evolutionFrames({
        ...options,
        drift: false,
        selection: 0,
        migrants: 0,
      }).every((p) => Math.abs(p - 0.4) < 1e-12),
    ).toBe(true);
    expect(() => evolutionFrames({ ...options, N: 0 })).toThrow();
    expect(() => evolutionFrames({ ...options, seed: NaN })).toThrow();
    expect(() => evolutionFrames({ ...options, p: -0.1 })).toThrow();
  });
  it('shows stronger average random fluctuations in smaller populations without directional purpose', () => {
    const deviation = (N: number) =>
      Array.from(
        { length: 400 },
        (_, i) =>
          evolutionFrames({
            p: 0.5,
            N,
            seed: i + 1,
            drift: true,
            generations: 1,
          })[1]! - 0.5,
      );
    const small = deviation(20),
      large = deviation(200);
    expect(Math.abs(mean(small))).toBeLessThan(0.025);
    expect(Math.abs(mean(large))).toBeLessThan(0.015);
    expect(mean(small.map((x) => x * x))).toBeGreaterThan(
      4 * mean(large.map((x) => x * x)),
    );
    expect(small.some((x) => x > 0)).toBe(true);
    expect(small.some((x) => x < 0)).toBe(true);
  });
  it('preserves clades under internal rotations rather than treating tip order as evidence', () => {
    expect(clades(teachingTree)).toEqual(['AB', 'ABCD', 'CD']);
    expect(clades(rotateTree(teachingTree))).toEqual(clades(teachingTree));
    expect(tips(rotateTree(teachingTree))).toEqual(['C', 'D', 'A', 'B']);
    expect(
      clades([
        ['A', 'C'],
        ['B', 'D'],
      ]),
    ).not.toEqual(clades(teachingTree));
    expect(clades('A')).toEqual([]);
    expect(clades(['E', ['F', 'G']])).toContain('FG');
    expect(clades(['E', ['F', 'G']])).not.toContain('EF');
  });
  it('compares independent group means and detects the constructed environment interaction', () => {
    const p = traitData.parallel,
      i = traitData.interaction;
    expect(mean(p.A[1]) - mean(p.A[0])).toBe(6);
    expect(mean(p.B[1]) - mean(p.B[0])).toBe(6);
    expect(mean(i.A[1]) - mean(i.A[0])).toBe(10);
    expect(mean(i.B[1]) - mean(i.B[0])).toBe(2);
    expect(mean(i.A[0])).toBeLessThan(mean(i.B[0]));
    expect(mean(i.A[1])).toBeGreaterThan(mean(i.B[1]));
    expect(() => mean([])).toThrow();
    expect(() => mean([NaN])).toThrow();
  });
});

describe('S06 U33–34 delivery contract', () => {
  it('has stable question ids, separate skill coverage, three goals and predictions', () => {
    expect(signalingEvolutionLessons.map((l) => l.id)).toEqual(
      Array.from({ length: 8 }, (_, i) => `L${129 + i}`),
    );
    for (const lesson of signalingEvolutionLessons) {
      expect(lesson.minutes).toBe(38);
      expect(lesson.objectives).toHaveLength(3);
      expect(lesson.prediction).toHaveLength(3);
      expect(new Set(lesson.prediction.map((p) => p.en)).size).toBe(3);
      expect(lesson.terms.length).toBeGreaterThanOrEqual(6);
      expect(lesson.terms.length).toBeLessThanOrEqual(10);
      expect(lesson.questions.map((q) => q.id)).toEqual(
        [1, 2, 3, 4].map((n) => `${lesson.id}-q${n}`),
      );
      expect(lesson.questions.map((q) => q.skill)).toEqual([
        'concept',
        'concept',
        'reasoning',
        'vocabulary',
      ]);
      for (const q of lesson.questions)
        expect(q.options[q.correct]).toBeDefined();
    }
    expect(signalingEvolutionUnits.map((u) => u.stage)).toEqual(['S06', 'S06']);
  });
  it('renders every export in all languages with named keyboard scroll regions and valid colour literals', () => {
    for (const lesson of signalingEvolutionLessons)
      for (const mode of ['zh', 'en', 'bilingual'] as const) {
        for (const Component of [
          SignalingEvolutionDiagram,
          SignalingEvolutionHookArt,
          SignalingEvolutionExplore,
        ]) {
          const markup = renderToStaticMarkup(
            createElement(Component, {
              id: lesson.id,
              mode,
              onExplore: () => {},
            }),
          );
          expect(markup).toContain('bio-s6-lab se-lab');
          expect(markup).toContain('tabindex="0"');
          expect(markup).toContain('aria-label=');
          expect(markup).not.toContain('NaN');
          expect(markup).not.toContain('undefined');
          for (const color of markup.matchAll(/(?:fill|stroke)="(#[^"]+)"/g))
            expect(color[1]).toMatch(/^#[0-9a-f]{6}$/i);
          if (['L133', 'L135', 'L136'].includes(lesson.id))
            expect(markup).not.toContain('bio-playback');
        }
      }
  });
});
