import { describe, expect, it } from 'vitest';
import {
  diatomicCandidate,
  lewisInventory,
  lonePairPoints,
  sharingMolecules,
} from './lewisEvidence';
describe('Lewis shared-electron accounting', () => {
  it('separates all electrons, valence electrons and shared versus lone electrons in five supplied molecules', () => {
    const expected = [
      [2, 2, 2, 0],
      [18, 8, 2, 6],
      [10, 8, 4, 4],
      [10, 8, 6, 2],
      [10, 8, 8, 0],
    ];
    sharingMolecules.forEach((m, i) => {
      const l = lewisInventory(m);
      expect([
        l.totalElectrons,
        l.valenceBudget,
        l.sharedElectrons,
        l.loneElectrons,
      ]).toEqual(expected[i]);
      expect(l.passesRules).toBe(true);
      expect(l.coreElectrons + l.valenceBudget).toBe(l.totalElectrons);
    });
  });
  it('counts shared electrons once globally but in both bonded atoms’ local checks', () => {
    const water = lewisInventory(sharingMolecules[2]!);
    expect(water.local.map((a) => a.count)).toEqual([8, 2, 2]);
    expect(water.localSum).toBe(12);
    expect(water.valenceBudget).toBe(8);
    for (const m of sharingMolecules) {
      const l = lewisInventory(m);
      expect(l.localSum).toBe(l.picturedValence + l.sharedElectrons);
    }
  });
  it('does not accept satisfied oxygen octets when the neutral global budget is exceeded', () => {
    const l = lewisInventory(diatomicCandidate(1, 1, 3, 3));
    expect(l).toMatchObject({
      valenceBudget: 12,
      picturedValence: 14,
      localTargetsMatch: true,
      budgetMatches: false,
      passesRules: false,
    });
    expect(l.local.map((a) => a.count)).toEqual([8, 8]);
  });
  it('finds the restricted H2/O2/N2 solutions only when both the global and local checks agree', () => {
    const accepted: number[][] = [];
    for (let i = 0; i < 3; i++)
      for (let order = 1; order <= 3; order++)
        for (let left = 0; left <= 3; left++)
          for (let right = 0; right <= 3; right++) {
            const l = lewisInventory(diatomicCandidate(i, order, left, right));
            expect(l.picturedValence).toBe(2 * order + 2 * left + 2 * right);
            expect(l.localSum).toBe(l.picturedValence + l.sharedElectrons);
            if (l.passesRules) accepted.push([i, order, left, right]);
          }
    expect(accepted).toEqual([
      [0, 1, 0, 0],
      [1, 2, 2, 2],
      [2, 3, 1, 1],
    ]);
  });
  it('identifies nitrogen’s double-bond octet trap and its triple-bond ledger', () => {
    expect(lewisInventory(diatomicCandidate(2, 2, 2, 2))).toMatchObject({
      picturedValence: 12,
      valenceBudget: 10,
      localTargetsMatch: true,
      budgetMatches: false,
    });
    expect(lewisInventory(diatomicCandidate(2, 3, 1, 1))).toMatchObject({
      sharedElectrons: 6,
      loneElectrons: 4,
      valenceBudget: 10,
      passesRules: true,
    });
  });
  it('keeps hydrogen’s two-electron local target rather than applying an octet to every atom', () => {
    expect(
      lewisInventory(diatomicCandidate(0, 1, 0, 0)).local.map((a) => a.target),
    ).toEqual([2, 2]);
    expect(lewisInventory(diatomicCandidate(0, 2, 0, 0))).toMatchObject({
      localTargetsMatch: false,
      budgetMatches: false,
    });
  });
  it('keeps authored atom labels, lone-pair dots and bond endpoints within the drawing frame', () => {
    for (const m of [
      ...sharingMolecules,
      ...[0, 1, 2].map((i) => diatomicCandidate(i, 3, 3, 3)),
    ])
      for (const a of m.atoms) {
        expect(a.x).toBeGreaterThan(22);
        expect(a.x).toBeLessThan(298);
        expect(a.y).toBeGreaterThan(22);
        expect(a.y).toBeLessThan(238);
        for (const angle of a.loneAngles)
          for (const p of lonePairPoints(a, angle)) {
            expect(p.x).toBeGreaterThan(5);
            expect(p.x).toBeLessThan(315);
            expect(p.y).toBeGreaterThan(5);
            expect(p.y).toBeLessThan(255);
          }
      }
  });
  it('rejects invalid candidate settings and dangling or repeated graph edges', () => {
    for (const n of [-1, 3, 1.5, NaN])
      expect(() => diatomicCandidate(n, 1, 0, 0)).toThrow();
    expect(() => diatomicCandidate(0, 4, 0, 0)).toThrow();
    expect(() => diatomicCandidate(0, 1, -1, 0)).toThrow();
    expect(() => diatomicCandidate(0, 1, 0, 4)).toThrow();
    const m = sharingMolecules[0]!;
    expect(() =>
      lewisInventory({ ...m, bonds: [{ from: 'a', to: 'absent', order: 1 }] }),
    ).toThrow();
    expect(() =>
      lewisInventory({ ...m, bonds: [...m.bonds, ...m.bonds] }),
    ).toThrow();
  });
});
