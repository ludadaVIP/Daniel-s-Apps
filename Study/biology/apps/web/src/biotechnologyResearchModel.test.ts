import { describe, expect, it } from 'vitest';
import {
  pcrCopies,
  pcrEvidence,
  gelPosition,
  editingEvidence,
  summarise,
  eligibleObservations,
  pairedDifferences,
  talkMinutes,
} from './biotechnologyResearchModel';
describe('DNA evidence has controls and bounded claims', () => {
  it('cannot manufacture a target without a template; ideal doubling is conditional', () => {
    expect(pcrCopies(0, 8)).toBe(0);
    expect(pcrCopies(2, 4)).toBe(32);
    expect(pcrCopies(2, 4, 0.5)).toBeCloseTo(10.125);
    expect(pcrCopies(2, 0)).toBe(2);
    expect(() => pcrCopies(1, -1)).toThrow();
    expect(() => pcrCopies(0.5, 2)).toThrow();
    expect(() => pcrCopies(1, 2, 1.1)).toThrow();
  });
  it('contamination prevents interpretation despite positive-control amplification', () => {
    expect(pcrEvidence(0, 4, 1, 'clean')).toMatchObject({
      sample: 0,
      positive: 32,
      positiveAdded: 30,
      positiveAmplified: true,
      controlsValid: true,
      interpretable: true,
    });
    expect(pcrEvidence(2, 4, 1, 'contaminated')).toMatchObject({
      blank: 16,
      positive: 32,
      positiveAmplified: true,
      controlsValid: false,
      interpretable: false,
    });
  });
  it('inhibition prevents new copies without deleting existing templates', () => {
    expect(pcrEvidence(2, 0, 1, 'inhibited')).toMatchObject({
      sample: 2,
      positive: 2,
      positiveAdded: 0,
      positiveAmplified: false,
      controlsValid: false,
      interpretable: false,
    });
    expect(pcrEvidence(2, 4, 1, 'inhibited')).toMatchObject({
      sample: 2,
      positive: 2,
      positiveAdded: 0,
      positiveAmplified: false,
      controlsValid: false,
      interpretable: false,
    });
    expect(pcrEvidence(0, 4, 1, 'inhibited').sample).toBe(0);
  });
  it('existing positive template alone does not certify amplification at zero cycles or efficiency', () => {
    for (const [cycles, efficiency] of [
      [0, 1],
      [4, 0],
    ] as const) {
      expect(pcrEvidence(2, cycles, efficiency, 'clean')).toMatchObject({
        sample: 2,
        positive: 2,
        positiveAdded: 0,
        positiveAmplified: false,
        controlsValid: false,
        interpretable: false,
      });
    }
    expect(pcrEvidence(2, 0, 1, 'contaminated')).toMatchObject({
      sample: 2,
      positive: 2,
      blank: 1,
      controlsValid: false,
    });
    expect(() => pcrEvidence(2, 4, 1.1, 'inhibited')).toThrow();
  });
  it('uses log size rather than equal distance per base pair', () => {
    expect(gelPosition(100)).toBeGreaterThan(gelPosition(1600));
    expect(gelPosition(200) - gelPosition(400)).toBeCloseTo(
      gelPosition(400) - gelPosition(800),
    );
    expect(() => gelPosition(0)).toThrow();
    expect(editingEvidence()).toEqual({
      sampleFraction: 0.6,
      checkedFraction: 0.2,
    });
  });
});
describe('research denominators and uncertainty', () => {
  it('retains observed zero and excludes missing rather than inventing measurements', () => {
    expect(summarise([2, 4, null, 0])).toMatchObject({
      n: 3,
      missing: 1,
      mean: 2,
      min: 0,
      max: 4,
      range: 4,
    });
    expect(summarise([null])).toMatchObject({ n: 0, mean: null, range: null });
    expect(summarise([]).mean).toBeNull();
  });
  it('does not mix longer effort or missing observations into equal-effort pairs', () => {
    expect(
      summarise(eligibleObservations('B', false).map((r) => r.count)).mean,
    ).toBe(5);
    expect(
      summarise(eligibleObservations('B', true).map((r) => r.count)).mean,
    ).toBe(4);
    expect(pairedDifferences()).toEqual([
      { day: 1, difference: 2 },
      { day: 3, difference: 2 },
      { day: 10, difference: 2 },
    ]);
    expect(talkMinutes(420, 105)).toBe(4);
    expect(talkMinutes(420, 0)).toBeNull();
  });
});
