import { describe, expect, it } from 'vitest';
import {
  candidatePicture,
  dissolvingPicture,
  dissolvingStages,
  phaseCandidates,
  waterPicture,
} from './particleEvidence';
describe('beginner particle evidence', () => {
  it('retains each represented water molecule and its size through nonreacting phase changes', () => {
    const before = waterPicture('liquid');
    for (const phase of ['solid', 'gas'] as const) {
      const after = candidatePicture(phase, 'conserved');
      expect(after.map((p) => [p.id, p.species, p.radius])).toEqual(
        before.map((p) => [p.id, p.species, p.radius]),
      );
      expect(after.map((p) => [p.x, p.y])).not.toEqual(
        before.map((p) => [p.x, p.y]),
      );
    }
  });
  it('separates the missing-particle and enlarged-particle errors instead of combining them', () => {
    for (const phase of ['solid', 'gas'] as const) {
      expect(new Set(phaseCandidates[phase])).toEqual(
        new Set(['lost', 'grown', 'conserved']),
      );
      const lost = candidatePicture(phase, 'lost');
      expect(lost).toHaveLength(8);
      expect(lost.every((p) => p.radius === 9)).toBe(true);
      const grown = candidatePicture(phase, 'grown');
      expect(grown).toHaveLength(12);
      expect(grown.every((p) => p.radius > 9)).toBe(true);
    }
  });
  it('represents greater gas separation without enlarging the water symbols', () => {
    const extent = (phase: 'liquid' | 'solid' | 'gas') => {
      const p = waterPicture(phase);
      return (
        (Math.max(...p.map((x) => x.x)) - Math.min(...p.map((x) => x.x))) *
        (Math.max(...p.map((x) => x.y)) - Math.min(...p.map((x) => x.y)))
      );
    };
    expect(extent('gas')).toBeGreaterThan(extent('liquid'));
    // The schematic must not accidentally imply ice is always denser than water.
    expect(extent('solid')).toBeGreaterThan(extent('liquid'));
  });
  it('accounts for the same individual sugar and water marks through all five process records', () => {
    const initial = dissolvingPicture(0)
      .inside.map((p) => [p.id, p.species, p.radius])
      .sort();
    for (let stage = 0; stage < 5; stage++) {
      const p = dissolvingPicture(stage);
      const all = [...p.inside, ...p.outside, ...p.filter];
      expect(all.map((p) => [p.id, p.species, p.radius]).sort()).toEqual(
        initial,
      );
      expect(new Set(all.map((p) => p.id)).size).toBe(24);
      expect(p.outside.every((p) => p.species === 'W')).toBe(true);
    }
  });
  it('keeps dissolved sugar in the filtrate rather than on ordinary filter paper', () => {
    const p = dissolvingPicture(2);
    expect(p.filter).toEqual([]);
    expect(p.inside.filter((p) => p.species === 'W')).toHaveLength(16);
    expect(p.inside.filter((p) => p.species === 'S')).toHaveLength(8);
  });
  it('removes water rather than sugar during ideal recovery and retains the outside inventory', () => {
    const partial = dissolvingPicture(3),
      final = dissolvingPicture(4);
    expect(partial.inside.filter((p) => p.species === 'W')).toHaveLength(10);
    expect(partial.outside).toHaveLength(6);
    expect(partial.inside.filter((p) => p.species === 'S')).toHaveLength(8);
    expect(final.outside).toHaveLength(16);
    expect(final.inside).toHaveLength(8);
    expect(final.inside.every((p) => p.species === 'S')).toBe(true);
  });
  it('keeps schematic symbols inside their accounting boxes and prevents overlap', () => {
    const pictures = [
      ...(['gas', 'solid'] as const).flatMap((phase) =>
        phaseCandidates[phase].map((claim) => candidatePicture(phase, claim)),
      ),
      waterPicture('liquid'),
      ...dissolvingStages.flatMap((_, i) =>
        Object.values(dissolvingPicture(i)),
      ),
    ];
    for (const marks of pictures) {
      for (const p of marks) {
        expect(p.x - p.radius).toBeGreaterThan(2);
        expect(p.x + p.radius).toBeLessThan(238);
        expect(p.y - p.radius).toBeGreaterThan(2);
        expect(p.y + p.radius).toBeLessThan(198);
      }
      for (let i = 0; i < marks.length; i++)
        for (let j = i + 1; j < marks.length; j++) {
          const a = marks[i]!,
            b = marks[j]!;
          expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(
            a.radius + b.radius,
          );
        }
    }
  });
  it('rejects invalid counts and stage positions without dropping information', () => {
    for (const n of [-1, 5, 1.5, NaN])
      expect(() => dissolvingPicture(n)).toThrow();
    for (const n of [-1, 13, 1.5, NaN])
      expect(() => waterPicture('gas', n)).toThrow();
    expect(() => waterPicture('gas', 12, 0)).toThrow();
  });
});
