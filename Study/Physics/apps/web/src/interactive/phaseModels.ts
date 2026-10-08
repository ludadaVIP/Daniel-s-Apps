// Prescribed equilibrium models of pure water near normal atmospheric pressure.
// Energies are transfers to/from the sample, not exact changes in internal energy:
// pressure-volume work and container/loss terms are omitted in these approximations.
export const waterPhase = {
  fusionJPerG: 334,
  vaporisationJPerG: 2260,
  iceJPerGDegree: 2.1,
  liquidJPerGDegree: 4.2,
} as const;
function finite(...v: number[]) {
  if (v.some((x) => !Number.isFinite(x)))
    throw new RangeError('Finite inputs required');
}
function positive(v: number) {
  finite(v);
  if (v <= 0) throw new RangeError('Positive quantity required');
  return v;
}
function nonnegative(v: number) {
  finite(v);
  if (v < 0) throw new RangeError('Nonnegative quantity required');
  return v;
}
function checked(v: number) {
  finite(v);
  return v;
}
export type FusionDirection = 'melting' | 'freezing';
export function fusion(
  massG: number,
  transferJ: number,
  direction: FusionDirection,
) {
  positive(massG);
  nonnegative(transferJ);
  if (direction !== 'melting' && direction !== 'freezing')
    throw new RangeError('Known phase direction');
  const fullTransfer = checked(massG * waterPhase.fusionJPerG);
  if (transferJ > fullTransfer)
    throw new RangeError('Only the 0 Celsius phase-change interval');
  const changedG = transferJ / waterPhase.fusionJPerG;
  const iceG = direction === 'melting' ? massG - changedG : changedG;
  return {
    temperature: 0,
    changedG,
    iceG,
    liquidG: massG - iceG,
    iceFraction: iceG / massG,
    fullTransfer,
    transferToSample: direction === 'melting' ? transferJ : -transferJ,
  };
}
export const fusionCases = [
  { mass: 50, direction: 'melting' },
  { mass: 100, direction: 'melting' },
  { mass: 50, direction: 'freezing' },
  { mass: 100, direction: 'freezing' },
] as const;
export const fusionTransfer = 16700;
export function boiling(massG: number, absorbedJ: number) {
  positive(massG);
  nonnegative(absorbedJ);
  const fullTransfer = checked(massG * waterPhase.vaporisationJPerG);
  if (absorbedJ > fullTransfer)
    throw new RangeError('Only the 100 Celsius boiling interval');
  const vapourG = absorbedJ / waterPhase.vaporisationJPerG;
  return {
    temperature: 100,
    vapourG,
    liquidG: massG - vapourG,
    fractionVaporised: vapourG / massG,
    fullTransfer,
  };
}
export const boilingCases = [
  { mass: 20, input: 11300 },
  { mass: 20, input: 22600 },
  { mass: 40, input: 22600 },
] as const;
/** Qualitative onset for an initially dry, above-freezing surface in prescribed air.
 * Dew point is an input, not calculated from humidity. No droplet amount/time predicted. */
export function condensation(surfaceC: number, dewPointC: number, airC = 25) {
  finite(surfaceC, dewPointC, airC);
  if (
    surfaceC <= 0 ||
    surfaceC > airC ||
    dewPointC < 0 ||
    dewPointC > airC ||
    airC > 40
  )
    throw new RangeError(
      'Above-freezing teaching interval with dew point at/below air temperature',
    );
  return { condenses: surfaceC < dewPointC, surfaceC, dewPointC, airC };
}
export const condensationCases = [
  { surface: 8, dewPoint: 15 },
  { surface: 8, dewPoint: 5 },
  { surface: 22, dewPoint: 15 },
] as const;
export const warmingCases = [
  { mass: 20, power: 50 },
  { mass: 20, power: 100 },
  { mass: 40, power: 50 },
] as const;
export function warmingPlan(massG: number, absorbedPowerW: number) {
  positive(massG);
  positive(absorbedPowerW);
  const iceJ = checked(massG * waterPhase.iceJPerGDegree * 10),
    fusionJ = checked(massG * waterPhase.fusionJPerG),
    liquidJ = checked(massG * waterPhase.liquidJPerGDegree * 20),
    totalJ = checked(iceJ + fusionJ + liquidJ);
  return {
    iceJ,
    fusionJ,
    liquidJ,
    totalJ,
    iceSeconds: checked(iceJ / absorbedPowerW),
    meltingSeconds: checked(fusionJ / absorbedPowerW),
    endMeltingSeconds: checked((iceJ + fusionJ) / absorbedPowerW),
    duration: checked(totalJ / absorbedPowerW),
  };
}
export function warmingSnapshot(
  massG: number,
  absorbedPowerW: number,
  seconds: number,
) {
  nonnegative(seconds);
  const plan = warmingPlan(massG, absorbedPowerW),
    elapsed = Math.min(seconds, plan.duration),
    energyJ = Math.min(plan.totalJ, checked(absorbedPowerW * elapsed));
  const iceUsed = Math.min(energyJ, plan.iceJ),
    fusionUsed = Math.min(Math.max(0, energyJ - plan.iceJ), plan.fusionJ),
    liquidUsed = Math.max(0, energyJ - plan.iceJ - plan.fusionJ);
  const temperature =
    energyJ < plan.iceJ
      ? -10 + iceUsed / (massG * waterPhase.iceJPerGDegree)
      : energyJ < plan.iceJ + plan.fusionJ
        ? 0
        : Math.min(20, liquidUsed / (massG * waterPhase.liquidJPerGDegree));
  const state =
    energyJ < plan.iceJ
      ? 'ice'
      : energyJ < plan.iceJ + plan.fusionJ
        ? 'melting'
        : 'water';
  return {
    elapsed,
    energyJ,
    temperature,
    state,
    iceUsed,
    fusionUsed,
    liquidUsed,
    iceFraction: 1 - fusionUsed / plan.fusionJ,
    ...plan,
  };
}
/** Exact piecewise-linear vertices up to the elapsed probe; no future curve segment. */
export function warmingPoints(
  massG: number,
  absorbedPowerW: number,
  seconds: number,
) {
  const s = warmingSnapshot(massG, absorbedPowerW, seconds);
  const times = [
    ...new Set(
      [0, s.iceSeconds, s.endMeltingSeconds, s.duration]
        .filter((t) => t <= s.elapsed)
        .concat(s.elapsed),
    ),
  ].sort((a, b) => a - b);
  return times.map((time) => ({
    time,
    temperature: warmingSnapshot(massG, absorbedPowerW, time).temperature,
  }));
}
