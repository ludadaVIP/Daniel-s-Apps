import { describe, expect, it } from 'vitest';
import {
  cellGeometry,
  cycleInventory,
  segregateSisters,
  orderMitosis,
  expressionProfile,
  reactionEnergy,
  enzymeRate,
  enzymeCurve,
  defaultEnzymeConditions,
  enzymeEvidencePairs,
  catalyticTurnover,
  digestionRoute,
} from './divisionEnzymeModel';
describe('size and information accounting', () => {
  it('scales area quadratically and volume cubically with inverse-length ratio', () => {
    const a = cellGeometry(1),
      b = cellGeometry(2);
    expect(b.area / a.area).toBe(4);
    expect(b.volume / a.volume).toBe(8);
    expect(b.ratio).toBe(3);
    expect(cellGeometry(2, 'flat').volume).toBe(b.volume);
    expect(cellGeometry(2, 'flat').area).toBeGreaterThan(b.area);
    expect(() => cellGeometry(0)).toThrow();
  });
  it('replicates DNA without changing ploidy or pre-anaphase chromosome count', () => {
    const g1 = cycleInventory('G1'),
      g2 = cycleInventory('G2'),
      child = cycleInventory('daughter');
    expect(g2.dnaC).toBe(2 * g1.dnaC);
    expect(g2.chromosomes).toBe(g1.chromosomes);
    expect(g2.ploidy).toBe(g1.ploidy);
    expect(child).toMatchObject({ chromosomes: 4, dnaC: 2 });
  });
  it('sends one copy of each homologue to each daughter, conserving eight chromatids', () => {
    const normal = segregateSisters(),
      fault = segregateSisters(true);
    expect(normal.left.map((x) => x[0])).toEqual(['A', 'a', 'B', 'b']);
    expect(normal.right.map((x) => x[0])).toEqual(['A', 'a', 'B', 'b']);
    expect(new Set([...normal.left, ...normal.right]).size).toBe(8);
    expect(fault.left.length + fault.right.length).toBe(8);
    expect(fault.equal).toBe(false);
    expect(
      orderMitosis([
        'prophase',
        'metaphase',
        'anaphase',
        'telophase',
        'cytokinesis',
      ]),
    ).toBe(true);
    expect(
      orderMitosis([
        'metaphase',
        'prophase',
        'anaphase',
        'telophase',
        'cytokinesis',
      ]),
    ).toBe(false);
  });
  it('changes expressed genes rather than deleting the common genome', () => {
    const skin = expressionProfile('skin', true),
      nerve = expressionProfile('nerve', false);
    expect(skin.genes).toEqual(nerve.genes);
    expect(skin.active).not.toEqual(nerve.active);
    expect(nerve.repairByDivision).toBe(false);
  });
});
describe('catalysis, curves and digestive specificity', () => {
  it('lowers the barrier without changing endpoint energy', () => {
    expect(reactionEnergy(true).activation).toBeLessThan(
      reactionEnergy(false).activation,
    );
    expect(reactionEnergy(true).deltaG).toBe(reactionEnergy(false).deltaG);
    expect(reactionEnergy(true).products).toBe(reactionEnergy(false).products);
  });
  it('conserves substrate units while reusing the catalyst and respects mismatch', () => {
    for (let step = 0; step < 12; step++) {
      const r = catalyticTurnover(8, 2, step);
      expect(r.substrate + r.product).toBe(8);
      expect(r.enzyme).toBe(2);
    }
    expect(catalyticTurnover(8, 1, 4, false).product).toBe(0);
  });
  it('has a fictional optimum and substrate saturation rather than unlimited linear gain', () => {
    const curve = enzymeCurve('temperature'),
      peak = curve.reduce((a, b) => (b.rate > a.rate ? b : a));
    expect(peak.x).toBe(40);
    expect(enzymeCurve('pH').find((x) => x.x === 7)?.rate).toBe(peak.rate);
    expect(enzymeRate({ ...defaultEnzymeConditions, substrate: 0 })).toBe(0);
    expect(
      enzymeRate({ ...defaultEnzymeConditions, substrate: 16 }),
    ).toBeLessThan(2 * enzymeRate(defaultEnzymeConditions));
    expect(enzymeRate({ ...defaultEnzymeConditions, enzyme: 0 })).toBe(0);
  });
  it('distinguishes reversible cold slowdown from persistent damaging heat history at the same assay temperature', () => {
    const [cold, hot] = enzymeEvidencePairs;
    expect(enzymeRate(cold.after)).toBeGreaterThan(enzymeRate(cold.before));
    expect(cold.after.temperatureC).toBe(hot.after.temperatureC);
    expect(enzymeRate(hot.after)).toBeCloseTo(enzymeRate(cold.after) * 0.08);
  });
  it('does not turn bile into an enzyme or amylase directly into glucose production', () => {
    expect(digestionRoute('fat', 'bile')).toMatchObject({
      chemical: false,
      matched: true,
    });
    expect(digestionRoute('starch', 'amylase').product).toContain(
      'oligosaccharides',
    );
    expect(digestionRoute('protein', 'amylase').matched).toBe(false);
    expect(digestionRoute('fat', 'lipase').product).toContain('monoglycerides');
  });
});
