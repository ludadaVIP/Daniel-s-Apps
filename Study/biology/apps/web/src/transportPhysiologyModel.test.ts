import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TransportPhysiologyDiagram } from './TransportPhysiologyWorld';
import {
  absorptionRoute,
  circulationRoute,
  diffusionSeries,
  diffusionStep,
  exchangeCapacity,
  kidneyBalance,
  membranePassage,
  osmosisResponse,
  signalResponse,
  valveOpen,
} from './transportPhysiologyModel';
describe('U25 membrane transport models', () => {
  it('distinguishes lipid permeability from a matching protein', () => {
    expect(membranePassage('oxygen', false).passes).toBe(true);
    expect(membranePassage('ion', false).passes).toBe(false);
    expect(membranePassage('glucose', true).passes).toBe(true);
    expect(membranePassage('oxygen', true).route).toBe('lipid');
    expect(membranePassage('ion', true).route).toBe('protein');
    expect(membranePassage('glucose', true).route).toBe('protein');
    expect(membranePassage('ion', false).route).toBe('blocked');
  });
  it('conserves both compartments and preserves reverse diffusion', () => {
    const result = diffusionStep(16, 4);
    expect(result).toEqual({
      left: 13,
      right: 7,
      forward: 4,
      reverse: 1,
      net: 3,
    });
    for (const row of diffusionSeries(16, 4))
      expect(row.left + row.right).toBeCloseTo(20);
    expect(diffusionStep(10, 10)).toMatchObject({
      forward: 2.5,
      reverse: 2.5,
      net: 0,
    });
    expect(diffusionStep(2, 8).net).toBeLessThan(0);
  });
  it('requires permeability and rejects invalid amounts', () => {
    expect(diffusionStep(16, 4, false)).toMatchObject({
      left: 16,
      right: 4,
      net: 0,
    });
    expect(() => diffusionStep(-1, 2)).toThrow(RangeError);
    expect(() => diffusionStep(NaN, 2)).toThrow(RangeError);
  });
  it('uses total water potential and distinguishes cell walls', () => {
    expect(osmosisResponse(-0.2, -0.5, 'plant')).toMatchObject({
      direction: 'in',
      outcome: 'turgor-rising',
    });
    expect(osmosisResponse(-0.8, -0.5, 'plant').outcome).toBe('water-loss');
    expect(osmosisResponse(-0.8, -0.5, 'animal').outcome).toBe('shrinking');
    expect(osmosisResponse(-0.5, -0.5, 'animal').direction).toBe('balanced');
  });
  it('renders the initial plant membrane next to the cell wall, not withdrawn', () => {
    const svg = renderToStaticMarkup(
      createElement(TransportPhysiologyDiagram, { id: 'L099', mode: 'en' }),
    );
    const membrane = svg.match(
      /data-cell-membrane="wall-adjacent" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/,
    );
    expect(membrane).not.toBeNull();
    const left = Number(membrane![1]),
      width = Number(membrane![3]);
    // Wall inner edges are 216.5 and 423.5; membrane stroke half-width is 2.
    expect(left - 2).toBeLessThanOrEqual(216.5);
    expect(left + width + 2).toBeGreaterThanOrEqual(423.5);
  });
  it('separates geometry and energy; zero gradient has zero passive net', () => {
    expect(exchangeCapacity(2, 0.5, 3, true)).toEqual({
      passive: 12,
      uphill: 2,
    });
    expect(exchangeCapacity(2, 0.5, 3, false).uphill).toBe(0);
    expect(exchangeCapacity(2, 0.5, 0, true).passive).toBe(0);
    expect(() => exchangeCapacity(2, 0, 3, true)).toThrow(RangeError);
  });
});
describe('U26 connected physiology', () => {
  it('keeps pulmonary artery before gas exchange and vein after it', () => {
    expect(circulationRoute[3]![1]).toBe('Pulmonary artery');
    expect(circulationRoute[5]![1]).toBe('Pulmonary vein');
    expect(valveOpen(12, 8)).toBe(true);
    expect(valveOpen(8, 12)).toBe(false);
    expect(valveOpen(8, 8)).toBe(false);
  });
  it('separates digestion from blood and lymph absorption routes', () => {
    expect(absorptionRoute('starch').destination).toBe('blood');
    expect(absorptionRoute('protein').destination).toBe('blood');
    expect(absorptionRoute('fat').destination).toBe('lacteal');
    expect(absorptionRoute('starch').stages[1]![1]).toContain('maltose');
    expect(absorptionRoute('starch').locations).toEqual([
      'lumen',
      'lumen',
      'lumen',
      'blood',
    ]);
    expect(absorptionRoute('protein').locations).toEqual([
      'lumen',
      'lumen',
      'lumen',
      'blood',
    ]);
    expect(absorptionRoute('fat').locations).toEqual([
      'lumen',
      'lumen',
      'epithelium',
      'lacteal',
    ]);
  });
  it('conserves water and makes high ADH reduce model urine', () => {
    for (const adh of ['low', 'high'] as const) {
      const r = kidneyBalance(adh);
      expect(r.recoveredMl + r.urineMl).toBeCloseTo(r.filtrateMl);
    }
    expect(kidneyBalance('high').urineMl).toBeCloseTo(2);
    expect(kidneyBalance('low').urineMl).toBeCloseTo(10);
    expect(kidneyBalance('high', 0).urineMl).toBe(0);
  });
  it('requires receptor and treats times as chosen examples', () => {
    expect(signalResponse('hormone', false).responds).toBe(false);
    expect(signalResponse('nerve', true).route).toBe('axon-synapse');
    expect(signalResponse('hormone', true).onsetSeconds).toBe(5);
  });
});
