import { describe, expect, it } from 'vitest';
import {
  entityCatalog,
  entityInventory,
  formulaBatch,
  formulaChoices,
  moleculeSamples,
  readParticleCount,
  type EntityId,
} from './moleculeEvidence';
describe('molecule and formula evidence', () => {
  it('counts monatomic helium separately from molecules without splitting its two-letter symbol', () => {
    expect(entityInventory(['He', 'He', 'He', 'He'])).toEqual({
      byElement: { He: 4 },
      atoms: 4,
      molecules: 0,
      elementKinds: 1,
      substanceKinds: 1,
      classification: 'element',
    });
  });
  it('distinguishes molecular elements from compounds and repeated copies from substance types', () => {
    const oxygen = entityInventory(['O2', 'O2', 'O2']);
    expect(oxygen).toMatchObject({
      byElement: { O: 6 },
      atoms: 6,
      molecules: 3,
      elementKinds: 1,
      substanceKinds: 1,
      classification: 'element',
    });
    const water = entityInventory(['H2O', 'H2O']);
    expect(water).toMatchObject({
      byElement: { H: 4, O: 2 },
      atoms: 6,
      molecules: 2,
      elementKinds: 2,
      substanceKinds: 1,
      classification: 'compound',
    });
  });
  it('does not confuse equal atom inventories with equal substances or molecular grouping', () => {
    const water = entityInventory(['H2O', 'H2O']);
    const feed = entityInventory(['H2', 'H2', 'O2']);
    expect(feed.byElement).toEqual(water.byElement);
    expect(feed.atoms).toBe(water.atoms);
    expect(feed).toMatchObject({
      molecules: 3,
      substanceKinds: 2,
      classification: 'mixture',
    });
    expect(water).toMatchObject({
      molecules: 2,
      substanceKinds: 1,
      classification: 'compound',
    });
  });
  it('recognises two oxygen allotropes as different substances despite one element type', () => {
    expect(entityInventory(['O2', 'O3'])).toMatchObject({
      byElement: { O: 5 },
      atoms: 5,
      molecules: 2,
      elementKinds: 1,
      substanceKinds: 2,
      classification: 'mixture',
    });
    expect(entityInventory(['H2O', 'O2'])).toMatchObject({
      byElement: { H: 2, O: 3 },
      atoms: 5,
      molecules: 2,
      substanceKinds: 2,
      classification: 'mixture',
    });
  });
  it('multiplies all atom types by each offered coefficient while retaining molecular formulas', () => {
    const perCopy = {
      H2O: { H: 2, O: 1 },
      H2O2: { H: 2, O: 2 },
      CO2: { C: 1, O: 2 },
      NH3: { N: 1, H: 3 },
      O2: { O: 2 },
    };
    for (const id of formulaChoices)
      for (let copies = 1; copies <= 4; copies++) {
        const b = formulaBatch(id, copies);
        expect(b.molecules).toBe(copies);
        expect(new Set(b.entities)).toEqual(new Set([id]));
        expect(b.byElement).toEqual(
          Object.fromEntries(
            Object.entries(perCopy[id as keyof typeof perCopy]).map(
              ([s, n]) => [s, n * copies],
            ),
          ),
        );
        expect(b.atoms).toBe(
          Object.values(b.byElement).reduce((a, b) => a + b, 0),
        );
      }
    expect(formulaBatch('CO2', 3)).toMatchObject({
      byElement: { C: 3, O: 6 },
      atoms: 9,
      molecules: 3,
    });
    expect(formulaBatch('NH3', 2)).toMatchObject({
      byElement: { N: 2, H: 6 },
      atoms: 8,
      molecules: 2,
    });
  });
  it('keeps coefficients different from changed molecular subscripts', () => {
    expect(formulaBatch('H2O', 2)).toMatchObject({
      byElement: { H: 4, O: 2 },
      atoms: 6,
      molecules: 2,
    });
    expect(formulaBatch('H2O2', 1)).toMatchObject({
      byElement: { H: 2, O: 2 },
      atoms: 4,
      molecules: 1,
    });
  });
  it('requires complete nonnegative whole-number answers without treating blanks as zero', () => {
    expect(readParticleCount('0')).toBe(0);
    expect(readParticleCount(' 12 ')).toBe(12);
    for (const value of [
      '',
      ' ',
      '-1',
      '1.5',
      '2x',
      '3e1',
      'Infinity',
      '9007199254740992',
    ])
      expect(readParticleCount(value)).toBeNull();
  });
  it('rejects invalid model settings and keeps the six authored samples within the catalog', () => {
    for (const copies of [0, 5, 1.5, NaN])
      expect(() => formulaBatch('H2O', copies)).toThrow();
    expect(() => entityInventory([])).toThrow();
    expect(() => entityInventory(['unknown' as EntityId])).toThrow();
    expect(moleculeSamples).toHaveLength(6);
    for (const sample of moleculeSamples)
      for (const id of sample.entities) expect(entityCatalog[id]).toBeDefined();
  });
});
