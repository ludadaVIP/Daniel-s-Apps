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
