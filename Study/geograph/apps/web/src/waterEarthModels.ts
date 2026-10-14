import ocean from '../../../content/ocean-temperature-data.json';
import nzQuakes from '../../../content/nz-earthquake-data.json';
import { modelFrame } from './geologyModels';
export { ocean, nzQuakes };
export const waterEarthLessonIds = ['GEO-029', 'GEO-030', 'GEO-031', 'GEO-032'];
export const waterNodes = [
  { id: 'surface', zh: '地表雨水', en: 'Surface rainwater', x: 250, y: 215 },
  { id: 'river', zh: '河流', en: 'River', x: 520, y: 310 },
  { id: 'sea', zh: '海洋', en: 'Ocean', x: 710, y: 400 },
  { id: 'soil', zh: '土壤水', en: 'Soil water', x: 200, y: 360 },
  { id: 'ground', zh: '地下水', en: 'Groundwater', x: 360, y: 480 },
  { id: 'plant', zh: '植物', en: 'Plant', x: 80, y: 210 },
  { id: 'vapour', zh: '水汽（气体）', en: 'Vapour (gas)', x: 710, y: 80 },
  { id: 'cloud', zh: '云中液滴／冰晶', en: 'Cloud drops/ice', x: 360, y: 70 },
] as const;
export type WaterNode = (typeof waterNodes)[number]['id'];
export const waterEdges = [
  { id: 'runoff', from: 'surface', to: 'river', zh: '径流', en: 'Runoff' },
  {
    id: 'infiltrate',
    from: 'surface',
    to: 'soil',
    zh: '下渗',
    en: 'Infiltration',
  },
  {
    id: 'recharge',
    from: 'soil',
    to: 'ground',
    zh: '补给地下水',
    en: 'Recharge',
  },
  { id: 'uptake', from: 'soil', to: 'plant', zh: '根吸水', en: 'Root uptake' },
  {
    id: 'discharge',
    from: 'ground',
    to: 'river',
    zh: '地下水排出',
    en: 'Discharge',
  },
  { id: 'stream', from: 'river', to: 'sea', zh: '河流入海', en: 'Streamflow' },
  { id: 'evaporate', from: 'sea', to: 'vapour', zh: '蒸发', en: 'Evaporation' },
  {
    id: 'transpire',
    from: 'plant',
    to: 'vapour',
    zh: '蒸腾',
    en: 'Transpiration',
  },
  {
    id: 'soil-evap',
    from: 'soil',
    to: 'vapour',
    zh: '土壤蒸发',
    en: 'Soil evaporation',
  },
  {
    id: 'condense',
    from: 'vapour',
    to: 'cloud',
    zh: '凝结',
    en: 'Condensation',
  },
  { id: 'rain', from: 'cloud', to: 'surface', zh: '降水', en: 'Precipitation' },
] as const;
export const waterJourneys = [
  {
    id: 'runoff',
    zh: '经河流与海洋回到云',
    en: 'River/ocean back to cloud',
    route: ['surface', 'river', 'sea', 'vapour', 'cloud'],
  },
  {
    id: 'plant',
    zh: '经土壤与植物回到云',
    en: 'Soil/plant back to cloud',
    route: ['surface', 'soil', 'plant', 'vapour', 'cloud'],
  },
  {
    id: 'ground',
    zh: '经地下水到达河流',
    en: 'Groundwater to river',
    route: ['surface', 'soil', 'ground', 'river'],
  },
] as const;
export function readWaterRoute(route: string[]) {
  if (route[0] !== 'surface') return ['surface'];
  const valid = ['surface'];
  for (const next of route.slice(1, 30)) {
    if (!waterEdges.some((e) => e.from === valid.at(-1) && e.to === next))
      break;
    valid.push(next);
  }
  return valid;
}
export function waterMove(route: string[], edgeId: string) {
  const valid = readWaterRoute(route),
    edge = waterEdges.find((e) => e.id === edgeId);
  if (!edge || edge.from !== valid.at(-1) || valid.length >= 30)
    return { valid: false, route: valid, completed: [] as string[] };
  const next = [...valid, edge.to];
  return {
    valid: true,
    route: next,
    completed: waterJourneys
      .filter(
        (j) =>
          j.route.length === next.length &&
          j.route.every((n, i) => n === next[i]),
      )
      .map((j) => j.id),
  };
}
/** Ten parcels in an invented event. All partitions conserve the same water input. */
export function rainBudget(sealed: boolean) {
  return sealed
    ? { rain: 10, runoff: 7, infiltration: 2, retained: 1 }
    : { rain: 10, runoff: 3, infiltration: 6, retained: 1 };
}
export const currentCases = [
  {
    id: 'gulf',
    zh: '湾流及北大西洋延伸',
    en: 'Gulf Stream / N Atlantic extension',
    kind: 'warm',
    points: [
      [-79, 26],
      [-75, 34],
      [-65, 40],
      [-45, 43],
      [-25, 48],
      [-12, 54],
    ],
    clueZh: '从低纬向较高纬输送较暖水；延伸有分支。',
    clueEn:
      'Carries relatively warm water towards higher latitudes; extension branches.',
  },
  {
    id: 'canary',
    zh: '加那利寒流',
    en: 'Canary Current',
    kind: 'cool',
    points: [
      [-14, 40],
      [-16, 32],
      [-19, 25],
      [-23, 18],
    ],
    clueZh: '北非西侧向较低纬移动较凉表层水。',
    clueEn:
      'Cooler surface water moves towards lower latitudes west of North Africa.',
  },
  {
    id: 'acc',
    zh: '南极绕极流',
    en: 'Antarctic Circumpolar Current',
    kind: 'east',
    points: [
      [-175, -55],
      [-100, -55],
      [-20, -55],
      [60, -55],
      [175, -55],
    ],
    clueZh: '南大洋环绕南极总体向东，不是南北往返一条线。',
    clueEn: 'Broadly eastward around Antarctica, not one north–south route.',
  },
] as const;
export type CurrentId = (typeof currentCases)[number]['id'];
/** One schematic heat parcel, with no current speed or temperature forecast. */
export function heatParcel(frame: number, kind: 'warm' | 'cool') {
  const f = modelFrame(String(frame), 4);
  return { x: 110 + f * 100, colour: kind === 'warm' ? '#b96450' : '#4e709f' };
}
export const nzSegments = [
  {
    id: 'hikurangi',
    zh: '东北：Hikurangi',
    en: 'NE: Hikurangi',
    motion: 'pacific-under',
    coords: [
      [179, -34],
      [178.5, -36],
      [178, -38],
      [177, -40],
      [175.5, -41.5],
    ],
  },
  {
    id: 'alpine',
    zh: '中南：Alpine Fault',
    en: 'Central/S: Alpine Fault',
    motion: 'oblique',
    coords: [
      [173.5, -41.5],
      [172, -42.5],
      [170.8, -43.3],
      [169.4, -44.5],
      [168.4, -45.5],
    ],
  },
  {
    id: 'puysegur',
    zh: '西南：Puysegur',
    en: 'SW: Puysegur',
    motion: 'australian-under',
    coords: [
      [167.4, -45.4],
      [166.4, -46.5],
      [165.5, -47.8],
    ],
  },
] as const;
export const alpsCoords = [
  [172, -42.2],
  [171, -42.8],
  [170.5, -43.3],
  [169.5, -44.7],
];
export const quakeDepthBand = (depth: number) =>
  depth < 40 ? 'shallow' : depth < 100 ? 'middle' : 'deep';
export function waterEarthFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-029')
    return (
      waterJourneys.every((j) => d[`water-path-${j.id}`] === 'yes') &&
      ['runoff', 'infiltrate', 'evaporate', 'condense', 'rain'].every(
        (e) => d[`water-name-${e}`] === e,
      ) &&
      d['rain-seen-open'] === 'yes' &&
      d['rain-seen-sealed'] === 'yes' &&
      d['rain-claim'] === 'conditional' &&
      d['cloud-state'] === 'drops' &&
      d['water-driver'] === 'energy-gravity'
    );
  if (id === 'GEO-030')
    return (
      currentCases.every(
        (c) =>
          d[`current-seen-${c.id}`] === 'yes' &&
          d[`current-kind-${c.id}`] === c.kind,
      ) &&
      ['jan', 'jul'].every((m) =>
        ['A', 'B'].every((p) => d[`sst-${m}-${p}`] === 'yes'),
      ) &&
      d['sst-compare'] === 'A' &&
      d['sst-variable'] === 'surface' &&
      d['current-driver'] === 'multiple' &&
      d['climate-limit'] === 'multiple' &&
      ['warm', 'cool'].every((k) =>
        [0, 4].every((f) => d[`heat-${k}-${f}`] === 'yes'),
      )
    );
  if (id === 'GEO-031')
    return (
      ['boundary', 'relief', 'quakes'].every(
        (l) => d[`nz-layer-${l}`] === 'yes',
      ) &&
      nzSegments.every(
        (s) =>
          d[`nz-seen-${s.id}`] === 'yes' && d[`nz-motion-${s.id}`] === s.motion,
      ) &&
      d['nz-evidence'] === 'combined' &&
      d['nz-quakes-limit'] === 'sample' &&
      d['nz-mountain-time'] === 'both'
    );
  return false;
}
