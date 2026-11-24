import { describe, expect, it } from 'vitest';
import {
  balanceRecords,
  changedDissolvingVariables,
  dissolvingTrials,
  evidenceCards,
  isolatesDissolvingVariable,
  massBoundaryCases,
  massBoundaryLedger,
  readingStats,
} from './scienceEvidence';

describe('science evidence and measurement models', () => {
  it('separates direct records from both supported and unsupported inferences', () => {
    expect(
      evidenceCards.find((item) => item.id === 'bubbles-record')?.kind,
    ).toBe('observation');
    expect(
      evidenceCards.find((item) => item.id === 'bubbles-identity')?.kind,
    ).toBe('inference');
    expect(evidenceCards.find((item) => item.id === 'ice-record')?.kind).toBe(
      'inference',
    );
    expect(new Set(evidenceCards.map((item) => item.id)).size).toBe(
      evidenceCards.length,
    );
  });
  it('isolates temperature or stirring without accepting a confounded comparison', () => {
    const [a, b, c, d, e] = dissolvingTrials;
    expect(isolatesDissolvingVariable(a!, b!, 'temperature')).toBe(true);
    expect(isolatesDissolvingVariable(a!, d!, 'stirring')).toBe(true);
    expect(isolatesDissolvingVariable(a!, b!, 'stirring')).toBe(false);
    expect(isolatesDissolvingVariable(a!, a!, 'temperature')).toBe(false);
    expect(changedDissolvingVariables(a!, c!)).toEqual([
      'temperature',
      'water',
    ]);
    expect(changedDissolvingVariables(a!, e!)).toEqual([
      'temperature',
      'sugar',
      'stirring',
      'grains',
    ]);
  });
  it('retains all repeats and makes the authored response comparison inspectable', () => {
    expect(readingStats(dissolvingTrials[0]!.seconds)).toEqual({
      mean: 82,
      minimum: 80,
      maximum: 84,
      spread: 4,
    });
    expect(readingStats(dissolvingTrials[1]!.seconds).mean).toBe(48);
    expect(readingStats([0, 1, 2]).mean).toBe(1);
    expect(readingStats([1, 1, 10]).mean).toBe(4);
  });
  it('distinguishes a consistently shifted mean from spread and coarse display', () => {
    const [near, shifted, spread, coarse] = balanceRecords.map((item) =>
      readingStats(item.readings),
    );
    expect(near!.mean).toBeCloseTo(10, 12);
    expect(shifted!.mean).toBeCloseTo(10.5, 12);
    expect(near!.spread).toBeCloseTo(shifted!.spread, 12);
    expect(spread!.mean).toBeCloseTo(near!.mean, 12);
    expect(spread!.spread).toBeGreaterThan(near!.spread);
    expect(coarse!.spread).toBe(0);
    expect(balanceRecords[3]!.resolution).toBeGreaterThan(
      balanceRecords[0]!.resolution,
    );
  });
  it('does not silently omit invalid measurements or an empty record', () => {
    for (const readings of [[], [NaN], [1, Infinity]])
      expect(() => readingStats(readings)).toThrow(RangeError);
  });
  it('preserves mass and tare accounting across all recorded boundaries and scenarios', () => {
    for (const sample of massBoundaryCases)
      for (let step = 0; step <= 4; step++)
        for (const closed of [true, false]) {
          const result = massBoundaryLedger(sample, step, closed);
          expect(result.totalAccountedG).toBe(110);
          expect(
            result.insideMaterialG + result.insideGasG + result.outsideGasG,
          ).toBe(90);
          expect(result.readingG - result.contentsG).toBe(20);
          expect(result.readingG + result.outsideGasG).toBe(
            result.initialReadingG,
          );
          if (closed) expect(result.readingG).toBe(110);
        }
  });
  it('changes an open vessel reading without destroying the escaped matter', () => {
    const open = massBoundaryLedger(massBoundaryCases[2]!, 4, false);
    expect(open.readingG).toBe(108);
    expect(open.outsideGasG).toBe(2);
    expect(open.contentsG).toBe(88);
    const closed = massBoundaryLedger(massBoundaryCases[2]!, 4, true);
    expect(closed.readingG).toBe(110);
    expect(closed.insideGasG).toBe(2);
    expect(closed.outsideGasG).toBe(0);
    expect(massBoundaryLedger(massBoundaryCases[0]!, 4, false).readingG).toBe(
      110,
    );
  });
  it('rejects a position outside the authored record instead of inventing data', () => {
    for (const step of [-1, 5, 0.5, NaN, Infinity])
      expect(() =>
        massBoundaryLedger(massBoundaryCases[0]!, step, true),
      ).toThrow(RangeError);
  });
});
