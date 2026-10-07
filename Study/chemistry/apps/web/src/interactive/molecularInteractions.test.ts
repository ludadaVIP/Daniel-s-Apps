import { describe, expect, it } from 'vitest';
import { boilingProfiles, boilingState, dipoleSum, forceInventory, polarityCases, rotatePosition, rotateVector } from './molecularInteractions';

describe('schematic molecular dipoles', () => {
  it('adds bent water dipoles without cancelling them', () => {
    const result = dipoleSum(polarityCases[0]!.dipoles);
    expect(result.polar).toBe(true);
    expect(result.net[0]).toBeCloseTo(0);
    expect(result.net[1]).toBeLessThan(0);
    expect(result.magnitude).toBeCloseTo(2*Math.cos(104.5/2*Math.PI/180));
  });
  it('distinguishes polar-bond cancellation from no polar bond', () => {
    expect(polarityCases[1]!.dipoles.length).toBe(2);
    expect(polarityCases[2]!.dipoles.length).toBe(0);
    expect(dipoleSum(polarityCases[1]!.dipoles).polar).toBe(false);
    expect(dipoleSum(polarityCases[2]!.dipoles).polar).toBe(false);
  });
  it('preserves polarity and magnitude under every offered rotation', () => {
    for (const example of polarityCases) for (const angle of [0,90,180,270]) {
      const rotated = dipoleSum(example.dipoles, angle);
      const initial = dipoleSum(example.dipoles);
      expect(rotated.polar).toBe(initial.polar);
      expect(rotated.magnitude).toBeCloseTo(initial.magnitude);
    }
    expect(rotateVector([1,0],90)[1]).toBeCloseTo(1);
    expect(rotatePosition([50,35],90)).toEqual([65,50]);
  });
  it('retains the water angle in the rotated square-coordinate model', () => {
    for (const angle of [0,90,180,270]) {
      const [o,a,b] = polarityCases[0]!.atoms.map(atom=>rotatePosition(atom.point, angle));
      const va=[a![0]-o![0],a![1]-o![1]], vb=[b![0]-o![0],b![1]-o![1]];
      expect(Math.acos((va[0]!*vb[0]!+va[1]!*vb[1]!)/(Math.hypot(...va)*Math.hypot(...vb)))*180/Math.PI).toBeCloseTo(104.5);
    }
    expect(()=>rotateVector([NaN,0],0)).toThrow(RangeError);
  });
});

describe('intermolecular forces and tabulated boiling points', () => {
  it('includes dispersion for every substance, not only nonpolar molecules', () => {
    for (const profile of boilingProfiles) expect(forceInventory(profile).dispersion).toBe(true);
    expect(forceInventory(boilingProfiles[0])).toEqual({dispersion:true,permanentDipole:false,selfHydrogenBond:false});
    expect(forceInventory(boilingProfiles[1])).toEqual({dispersion:true,permanentDipole:true,selfHydrogenBond:false});
    expect(forceInventory(boilingProfiles[2])).toEqual({dispersion:true,permanentDipole:true,selfHydrogenBond:true});
  });
  it('compares isomers without assigning equal boiling points from equal mass', () => {
    const [,ether,ethanol]=boilingProfiles;
    expect(ether.formula).toBe(ethanol.formula);
    expect(ether.molarMass).toBe(ethanol.molarMass);
    expect(ether.boilingC).toBeLessThan(ethanol.boilingC);
  });
  it('reads the liquid, boundary and gas regimes for every profile', () => {
    for (const profile of boilingProfiles) {
      expect(boilingState(profile,profile.boilingC-0.1)).toBe('liquid');
      expect(boilingState(profile,profile.boilingC)).toBe('coexistence');
      expect(boilingState(profile,profile.boilingC+0.1)).toBe('gas');
      for (const temperature of [-50,-30,25,80]) expect(boilingState(profile,temperature)).toBe(temperature<profile.boilingC?'liquid':'gas');
    }
    expect(boilingState(boilingProfiles[2],25)).toBe('liquid');
    expect(boilingState(boilingProfiles[1],25)).toBe('gas');
  });
  it('rejects temperatures outside the stated liquid/gas comparison window', () => {
    for (const invalid of [-100,101,NaN,Infinity]) expect(()=>boilingState(boilingProfiles[0],invalid)).toThrow(RangeError);
  });
});
