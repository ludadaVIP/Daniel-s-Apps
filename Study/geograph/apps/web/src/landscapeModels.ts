import { modelFrame } from './geologyModels';

export const landscapeLessonIds = ['GEO-021', 'GEO-022', 'GEO-023', 'GEO-024'];
/** An area-preserving block analogy, not a simulation of a particular crust. */
export function compressedBlock(frame: number) {
  const f = modelFrame(String(frame), 4);
  const width = 440 - f * 45;
  return { width, thickness: 17600 / width, area: 17600 };
}
export const erosionCases = [
  { id: 'grow', removal: 1, zh: '搬走较少', en: 'Less removal' },
  { id: 'steady', removal: 3, zh: '搬走相等', en: 'Equal removal' },
  { id: 'lower', removal: 5, zh: '搬走较多', en: 'More removal' },
] as const;
/** Arbitrary classroom height units per interval; no observed rate or forecast. */
export function surfaceBudget(removal: number, frame: number) {
  const r = Number.isFinite(removal) ? Math.max(0, removal) : 0;
  return Math.max(0, 10 + (3 - r) * modelFrame(String(frame), 4));
}
export const rockStates = [
  { id: 'magma', zh: '岩浆', en: 'Magma', x: 110, y: 90 },
  { id: 'igneous', zh: '火成岩', en: 'Igneous rock', x: 480, y: 90 },
  { id: 'sediments', zh: '松散沉积物', en: 'Loose sediment', x: 495, y: 235 },
  { id: 'sedimentary', zh: '沉积岩', en: 'Sedimentary rock', x: 330, y: 340 },
  { id: 'metamorphic', zh: '变质岩', en: 'Metamorphic rock', x: 110, y: 270 },
] as const;
export type RockState = (typeof rockStates)[number]['id'];
export const rockProcesses = [
  { id: 'cool', zh: '冷却结晶', en: 'Cool & crystallise' },
  { id: 'weather', zh: '风化、侵蚀与搬运', en: 'Weather, erode & transport' },
  { id: 'lithify', zh: '沉积、压实与胶结', en: 'Deposit, compact & cement' },
  {
    id: 'heat',
    zh: '受热／受压，保持固态',
    en: 'Heat / pressure, staying solid',
  },
  { id: 'melt', zh: '熔融', en: 'Melt' },
] as const;
export type RockProcess = (typeof rockProcesses)[number]['id'];
export const rockEdges = [
  { id: 'A', from: 'magma', to: 'igneous', process: 'cool' },
  { id: 'B', from: 'igneous', to: 'sediments', process: 'weather' },
  { id: 'C', from: 'sediments', to: 'sedimentary', process: 'lithify' },
  { id: 'D', from: 'sedimentary', to: 'metamorphic', process: 'heat' },
  { id: 'E', from: 'metamorphic', to: 'magma', process: 'melt' },
] as const;
export function rockStep(
  state: RockState,
  process: RockProcess,
): RockState | null {
  if (process === 'cool') return state === 'magma' ? 'igneous' : null;
  if (process === 'lithify')
    return state === 'sediments' ? 'sedimentary' : null;
  if (state === 'magma' || state === 'sediments') return null;
  if (process === 'weather') return 'sediments';
  if (process === 'melt') return 'magma';
  if (process === 'heat') return 'metamorphic';
  return null;
}
export function readRock(value: string | undefined): RockState {
  return rockStates.some((p) => p.id === value)
    ? (value as RockState)
    : 'igneous';
}
export const surfaceProcesses = [
  { id: 'weather', zh: '原地风化', en: 'Weather in place' },
  { id: 'transport', zh: '侵蚀与搬运', en: 'Erode & transport' },
  { id: 'deposit', zh: '沉积', en: 'Deposit' },
] as const;
/** Eight drawn solid particles are conserved in this selected process sequence. */
export function particlePositions(frame: number) {
  const f = modelFrame(String(frame), 3);
  return Array.from({ length: 8 }, (_, i) => ({
    x:
      f === 0
        ? 100 + (i % 4) * 22
        : f === 1
          ? 95 + (i % 4) * 30
          : f === 2
            ? 270 + i * 28
            : 440 + (i % 4) * 24,
    y:
      f === 0
        ? 150 + Math.floor(i / 4) * 22
        : f === 1
          ? 220 + Math.floor(i / 4) * 24
          : f === 2
            ? 210 + (i % 3) * 12
            : 247 - Math.floor(i / 4) * 17,
  }));
}
export const riverCards = [
  {
    id: 'gorge',
    zh: '窄谷 · A点300单位',
    en: 'Narrow valley · A, 300 units',
    asset: 'river-gorge',
  },
  {
    id: 'meander',
    zh: '宽谷曲流 · B点100单位',
    en: 'Wide valley bends · B, 100 units',
    asset: 'river-meander',
  },
  {
    id: 'plain',
    zh: '平原河口 · C点0单位',
    en: 'Plain / outlet · C, 0 units',
    asset: 'canterbury-fields',
  },
] as const;
export function readRiverOrder(value: string | undefined) {
  const order = value?.split(',') ?? [];
  return order.length === 3 &&
    new Set(order).size === 3 &&
    order.every((id) => riverCards.some((c) => c.id === id))
    ? order
    : ['plain', 'gorge', 'meander'];
}
export function moveRiverCard(order: string[], id: string, direction: -1 | 1) {
  const result = readRiverOrder(order.join(','));
  const i = result.indexOf(id),
    j = i + direction;
  if (i >= 0 && j >= 0 && j < result.length)
    [result[i], result[j]] = [result[j]!, result[i]!];
  return result;
}
export const riverSettings = [
  {
    id: 'steep',
    zh: '陡坡、岩质窄谷',
    en: 'Steep, narrow bedrock valley',
    outcome: 'incision',
  },
  {
    id: 'bends',
    zh: '缓坡、单一河道、可侵蚀河岸',
    en: 'Gentle slope, single channel, erodible banks',
    outcome: 'meander',
  },
  {
    id: 'gravel',
    zh: '缓坡、较多砂砾、易变化河岸',
    en: 'Gentle slope, abundant gravel, changing banks',
    outcome: 'braided',
  },
] as const;
export function landscapeFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-021')
    return (
      d['mountain-seen-0'] === 'yes' &&
      d['mountain-seen-4'] === 'yes' &&
      d['mountain-map'] === 'alps' &&
      d['mountain-motion'] === 'oblique' &&
      d['mountain-material'] === 'thicken' &&
      erosionCases.every(
        (c) =>
          d[`budget-seen-${c.id}`] === 'yes' && d[`budget-${c.id}`] === c.id,
      )
    );
  if (id === 'GEO-022')
    return (
      rockEdges.every((e) => d[`rock-edge-${e.id}`] === e.process) &&
      rockProcesses.every((p) => d[`rock-used-${p.id}`] === 'yes') &&
      d['rock-shortcut'] === 'yes' &&
      d['rock-solid'] === 'solid' &&
      d['rock-photo-limit'] === 'origin'
    );
  if (id === 'GEO-023')
    return (
      [1, 2, 3].every((f) => d[`particle-seen-${f}`] === 'yes') &&
      [0, 50, 100].every((v) => d[`compare-seen-${v}`] === 'yes') &&
      surfaceProcesses.every((p, i) => d[`surface-${i + 1}`] === p.id) &&
      d['change-evidence'] === 'bank' &&
      d['weather-chemical'] === 'alter'
    );
  if (id === 'GEO-024')
    return (
      d['river-order-checked'] === 'yes' &&
      readRiverOrder(d['river-order']).join(',') === 'gorge,meander,plain' &&
      riverSettings.every(
        (s) =>
          d[`river-seen-${s.id}`] === 'yes' &&
          d[`river-outcome-${s.id}`] === s.outcome,
      ) &&
      d['river-speed'] === 'depends' &&
      d['river-photo-limit'] === 'different'
    );
  return false;
}
