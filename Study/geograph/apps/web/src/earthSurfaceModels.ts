import { modelFrame } from './geologyModels';

export const earthSurfaceLessonIds = [
  'GEO-025',
  'GEO-026',
  'GEO-027',
  'GEO-028',
];
export type SurfaceLabel = 'erode' | 'deposit' | 'plain';
/** A selected single-channel plan view. Coordinates and frames are not surveyed data. */
export function bendGeometry(frame: number) {
  const amplitude = 60 + 10 * modelFrame(String(frame), 4);
  const centre = (x: number) =>
    210 - amplitude * Math.sin(((x - 80) / 480) * Math.PI * 2);
  return {
    amplitude,
    points: Array.from({ length: 97 }, (_, i) => ({
      x: 80 + i * 5,
      y: centre(80 + i * 5),
    })),
    sites: [
      {
        id: 'A',
        x: 200,
        y: centre(200) - 28,
        correct: 'erode' as SurfaceLabel,
      },
      {
        id: 'B',
        x: 200,
        y: centre(200) + 28,
        correct: 'deposit' as SurfaceLabel,
      },
      { id: 'C', x: 320, y: 85, correct: 'plain' as SurfaceLabel },
      {
        id: 'D',
        x: 440,
        y: centre(440) + 28,
        correct: 'erode' as SurfaceLabel,
      },
      {
        id: 'E',
        x: 440,
        y: centre(440) - 28,
        correct: 'deposit' as SurfaceLabel,
      },
    ],
  };
}
export const glacierCases = [
  {
    id: 'advance',
    zh: '末端补给超过损失',
    en: 'Front supply exceeds loss',
    delta: 20,
  },
  {
    id: 'balance',
    zh: '末端补给与损失相当',
    en: 'Front supply matches loss',
    delta: 0,
  },
  {
    id: 'retreat',
    zh: '末端损失超过补给',
    en: 'Front loss exceeds supply',
    delta: -20,
  },
] as const;
export type GlacierCase = (typeof glacierCases)[number]['id'];
/** A front/marker analogy, not an instantaneous mass-balance response or glacier forecast. */
export function glacierPositions(kind: string, frame: number) {
  const f = modelFrame(String(frame), 4);
  const scenario = glacierCases.find((c) => c.id === kind) ?? glacierCases[0];
  return { front: 400 + scenario.delta * f, marker: 145 + 25 * f };
}
/** Cross sections with arbitrary shared plotting coordinates; all valleys differ in reality. */
export function valleySection(kind: 'river' | 'glacier') {
  return Array.from({ length: 41 }, (_, i) => {
    const x = -1 + i / 20;
    return {
      x,
      depth: kind === 'river' ? 1 - Math.abs(x) : 1 - Math.pow(Math.abs(x), 4),
    };
  });
}
export function driftTrack(direction: 'right' | 'left', step: number) {
  const f = modelFrame(String(step), 8),
    sign = direction === 'right' ? 1 : -1;
  const start = direction === 'right' ? 150 : 490;
  return Array.from({ length: f + 1 }, (_, i) => ({
    x: start + sign * Math.ceil(i / 2) * 45,
    y: i % 2 === 0 ? 300 : 175,
  }));
}
export const beachCases = [
  {
    id: 'gain',
    zh: '进入3，离开1',
    en: '3 in, 1 out',
    incoming: 3,
    outgoing: 1,
  },
  {
    id: 'stable',
    zh: '进入2，离开2',
    en: '2 in, 2 out',
    incoming: 2,
    outgoing: 2,
  },
  {
    id: 'loss',
    zh: '进入1，离开3',
    en: '1 in, 3 out',
    incoming: 1,
    outgoing: 3,
  },
] as const;
export function beachBudget(kind: string) {
  const c = beachCases.find((s) => s.id === kind) ?? beachCases[0];
  return {
    initial: 6,
    incoming: c.incoming,
    outgoing: c.outgoing,
    remaining: 6 + c.incoming - c.outgoing,
  };
}
export const soilLayers = [
  { id: 'O', zh: '有机残体层', en: 'Organic layer', colour: '#4a4933' },
  { id: 'A', zh: '表层矿质土', en: 'Mineral topsoil', colour: '#80704c' },
  { id: 'B', zh: '下层土', en: 'Subsoil', colour: '#b18b60' },
  {
    id: 'C',
    zh: '较少改变的母质',
    en: 'Less-altered parent material',
    colour: '#d0b594',
  },
  {
    id: 'R',
    zh: '坚硬基岩（非土壤）',
    en: 'Hard bedrock (not soil)',
    colour: '#898d83',
  },
] as const;
export function readSoilOrder(value: string | undefined) {
  const order = value?.split(',') ?? [];
  return order.length === 5 &&
    new Set(order).size === 5 &&
    order.every((id) => soilLayers.some((l) => l.id === id))
    ? order
    : ['B', 'R', 'O', 'C', 'A'];
}
export function moveSoilLayer(order: string[], id: string, direction: -1 | 1) {
  const result = readSoilOrder(order.join(',')),
    i = result.indexOf(id),
    j = i + direction;
  if (i >= 0 && j >= 0 && j < result.length)
    [result[i], result[j]] = [result[j]!, result[i]!];
  return result;
}
/** One invented mineral-soil sample, constant 50 pore units. No universal soil recipe. */
export function soilPores(water: number) {
  const w = modelFrame(String(water), 50);
  return { mineral: 45, organic: 5, water: w, air: 50 - w };
}
export function earthSurfaceFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-025')
    return (
      [0, 4].every((f) => d[`bend-seen-${f}`] === 'yes') &&
      ['normal', 'high'].every((s) => d[`flood-seen-${s}`] === 'yes') &&
      bendGeometry(4).sites.every((s) => d[`bend-${s.id}`] === s.correct) &&
      d['bend-change'] === 'lateral' &&
      d['flood-limit'] === 'possible'
    );
  if (id === 'GEO-026')
    return (
      ['river', 'glacier'].every((k) => d[`valley-seen-${k}`] === 'yes') &&
      d['valley-river'] === 'V' &&
      d['valley-glacier'] === 'U' &&
      glacierCases.every(
        (c) =>
          d[`ice-seen-${c.id}-0`] === 'yes' &&
          d[`ice-seen-${c.id}-4`] === 'yes' &&
          d[`ice-front-${c.id}`] === c.id,
      ) &&
      d['ice-motion'] === 'down' &&
      d['ice-work'] === 'abrasion' &&
      d['valley-limit'] === 'history'
    );
  if (id === 'GEO-027')
    return (
      ['right', 'left'].every(
        (k) =>
          d[`drift-seen-${k}-0`] === 'yes' &&
          d[`drift-seen-${k}-8`] === 'yes' &&
          d[`drift-net-${k}`] === k,
      ) &&
      beachCases.every(
        (c) => d[`beach-seen-${c.id}`] === 'yes' && d[`beach-${c.id}`] === c.id,
      ) &&
      d['coast-cliff'] === 'erode' &&
      d['coast-beach'] === 'deposit' &&
      d['coast-stack'] === 'remnant' &&
      d['coast-limit'] === 'budget'
    );
  if (id === 'GEO-028')
    return (
      d['soil-order'] === 'O,A,B,C,R' &&
      d['soil-checked'] === 'yes' &&
      [0, 25, 50].every((n) => d[`pore-seen-${n}`] === 'yes') &&
      ['mineral', 'organic', 'water', 'air'].every(
        (k) => d[`soil-component-${k}`] === k,
      ) &&
      d['soil-air'] === 'less' &&
      d['soil-parent'] === 'transported' &&
      d['soil-plant'] === 'supplied' &&
      d['soil-photo'] === 'tests'
    );
  return false;
}
