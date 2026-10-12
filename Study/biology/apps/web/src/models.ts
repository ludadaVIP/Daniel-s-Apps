export type Water = 'dry' | 'moist' | 'submerged';
export function seedModel(water: Water, temperature: number, oxygen: boolean) {
  if (water === 'dry') return { grows: false, reason: 'dry' as const };
  if (!oxygen || water === 'submerged')
    return { grows: false, reason: 'oxygen' as const };
  if (temperature < 15 || temperature > 30)
    return { grows: false, reason: 'temperature' as const };
  return { grows: true, reason: 'ready' as const };
}
export function virusCopies(host: boolean, step: number) {
  return host && step >= 3 ? 4 : 1;
}
export type Objective = 4 | 10 | 40;
/** Assumed teaching microscope: fixed 10× eyepiece and 2mm field at 4×. */
export function microscopeView(objective: Objective) {
  const fieldMm = (2 * 4) / objective;
  return {
    magnification: 10 * objective,
    fieldMm,
    fieldMicrometres: fieldMm * 1000,
  };
}
export function particlePosition(step: number, permeable: boolean) {
  return [40, 103, 120, permeable ? 180 : 120][Math.max(0, Math.min(3, step))]!;
}
