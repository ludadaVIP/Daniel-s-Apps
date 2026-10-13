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
/** Qualitative photosynthesis prerequisites; not a plant-care or growth-rate model. */
export function plantSugar(light: boolean, water: boolean, carbon: boolean) {
  return {
    canMakeSugar: light && water && carbon,
    missing: [!light && 'light', !water && 'water', !carbon && 'carbon'].filter(
      Boolean,
    ),
  };
}
/** Teaching arm: constant forearm length, angle measured from straight down. */
export function armGeometry(degrees: number) {
  const angle = Math.max(0, Math.min(90, degrees));
  const radians = (angle * Math.PI) / 180;
  const elbow = { x: 190, y: 155 };
  const length = 115;
  return {
    angle,
    elbow,
    length,
    hand: {
      x: elbow.x + length * Math.sin(radians),
      y: elbow.y + length * Math.cos(radians),
    },
  };
}
/** Gas journeys include the appropriate heart side between lungs and tissues. */
export const gasRoutes = {
  oxygen: ['air', 'lungs', 'leftHeart', 'cells'],
  carbon: ['cells', 'rightHeart', 'lungs', 'air'],
} as const;
export type GardenOrganism =
  'plant' | 'aphid' | 'caterpillar' | 'ladybird' | 'bird';
export type FeedingLink = { food: GardenOrganism; consumer: GardenOrganism };
/** Selected virtual observations; food → consumer, never pursuit direction. */
export const gardenFeeding: readonly FeedingLink[] = [
  { food: 'plant', consumer: 'aphid' },
  { food: 'aphid', consumer: 'ladybird' },
  { food: 'plant', consumer: 'caterpillar' },
  { food: 'caterpillar', consumer: 'bird' },
  { food: 'aphid', consumer: 'bird' },
];
/** Connectivity only: presence of a link does not predict abundance or feeding strength. */
export function gardenLinks(ladybirdPresent = true, birdEatsAphids = true) {
  return gardenFeeding.filter(
    (link) =>
      (ladybirdPresent || link.consumer !== 'ladybird') &&
      (birdEatsAphids || !(link.food === 'aphid' && link.consumer === 'bird')),
  );
}
export function gardenConsumers(
  food: GardenOrganism,
  links: readonly FeedingLink[],
) {
  return links
    .filter((link) => link.food === food)
    .map((link) => link.consumer);
}

export type FairPlan = {
  water: boolean;
  variety: boolean;
  temperature: boolean;
};
export const fairTestIssues = (plan: FairPlan) =>
  (['water', 'variety', 'temperature'] as const).filter((key) => !plan[key]);
export type SeedlingRecord = {
  id: string;
  group: 'weak' | 'strong';
  start: number;
  end: number;
  pale: boolean;
};
// Authored fictional observations, not a growth simulator or real trial.
export const seedlingRecords: readonly SeedlingRecord[] = [
  { id: 'A1', group: 'weak', start: 4, end: 10, pale: true },
  { id: 'A2', group: 'weak', start: 4, end: 11, pale: true },
  { id: 'A3', group: 'weak', start: 4, end: 12, pale: true },
  { id: 'B1', group: 'strong', start: 4, end: 7, pale: false },
  { id: 'B2', group: 'strong', start: 4, end: 8, pale: false },
  { id: 'B3', group: 'strong', start: 4, end: 9, pale: false },
];
export function summariseGrowth(records: readonly SeedlingRecord[]) {
  const gains = records.map((r) => r.end - r.start);
  return {
    gains,
    n: gains.length,
    mean: gains.length
      ? gains.reduce((sum, value) => sum + value, 0) / gains.length
      : null,
  };
}
