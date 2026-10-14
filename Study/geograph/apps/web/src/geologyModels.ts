export const geologyLessonIds = ['GEO-017', 'GEO-018', 'GEO-019', 'GEO-020'];
export const earthLayers = [
  {
    id: 'crust',
    zh: '地壳',
    en: 'Crust',
    stateZh: '固态岩石',
    stateEn: 'Solid rock',
    colour: '#8d8266',
  },
  {
    id: 'mantle',
    zh: '地幔',
    en: 'Mantle',
    stateZh: '主要为固态；长时间可缓慢变形',
    stateEn: 'Mostly solid; deforms slowly over long times',
    colour: '#c7a377',
  },
  {
    id: 'outer',
    zh: '外核',
    en: 'Outer core',
    stateZh: '液态金属',
    stateEn: 'Liquid metal',
    colour: '#ddbf83',
  },
  {
    id: 'inner',
    zh: '内核',
    en: 'Inner core',
    stateZh: '固态金属',
    stateEn: 'Solid metal',
    colour: '#f2dfaf',
  },
] as const;
export const boundaryTypes = [
  {
    id: 'divergent',
    zh: '分离',
    en: 'Divergent',
    motionZh: '← → 拉开',
    motionEn: '← → Move apart',
  },
  {
    id: 'convergent',
    zh: '汇聚',
    en: 'Convergent',
    motionZh: '→ ← 靠近',
    motionEn: '→ ← Move together',
  },
  {
    id: 'transform',
    zh: '错动',
    en: 'Transform',
    motionZh: '↑ ↓ 沿边界相互滑过',
    motionEn: '↑ ↓ Slide past along the boundary',
  },
] as const;
export type BoundaryType = (typeof boundaryTypes)[number]['id'];
export function modelFrame(value: string | undefined, max: number) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
}
/** Display displacement only: no time, speed, stress or eruption forecast. */
export function boundaryOffsets(type: BoundaryType, frame: number) {
  const n = Math.max(0, Math.min(4, Math.round(frame))) * 12;
  return type === 'transform'
    ? { leftX: 0, leftY: -n, rightX: 0, rightY: n }
    : {
        leftX: type === 'divergent' ? -n : n,
        leftY: 0,
        rightX: type === 'divergent' ? n : -n,
        rightY: 0,
      };
}
export const faultFrames = [
  ['开始：断层锁住', 'Start: fault locked'],
  ['缓慢加载：岩石形变', 'Slow loading: rock deforms'],
  ['形变增加，仍未滑动', 'More deformation, still locked'],
  ['突然滑动：释放能量', 'Sudden slip: energy released'],
  ['地震波向外传播', 'Seismic waves spread outward'],
] as const;
export const volcanoCases = [
  {
    id: 'ruapehu',
    zh: '新西兰鲁阿佩胡',
    en: 'Ruapehu, New Zealand',
    lon: 175.56,
    lat: -39.28,
    setting: 'subduction',
    cause: 'water',
    detailZh: '俯冲板块释放流体，帮助上方地幔局部熔融；岩浆再上升。',
    detailEn:
      'Fluids released by the subducting slab help mantle above it partially melt; magma rises.',
  },
  {
    id: 'ridge',
    zh: '大西洋中脊海底',
    en: 'Mid-Atlantic Ridge seafloor',
    lon: -30,
    lat: 0,
    setting: 'rift',
    cause: 'pressure',
    detailZh:
      '板块拉开，热地幔上升时压力降低，可发生部分熔融。点只代表中脊一段。',
    detailEn:
      'Plates separate; hot mantle rises and reduced pressure allows partial melting. The point represents one ridge segment.',
  },
  {
    id: 'hawaii',
    zh: '夏威夷大岛',
    en: 'Island of Hawaiʻi',
    lon: -155.5,
    lat: 19.5,
    setting: 'hotspot',
    cause: 'hot',
    detailZh:
      '板块内部的热点供给岩浆；板块移动可留下较老的火山链。热点来源仍有研究争论。',
    detailEn:
      'An intraplate hotspot supplies magma; plate motion can leave older volcanoes behind. Hotspot origins remain under study.',
  },
] as const;
export const volcanoSettings = [
  { id: 'subduction', zh: '俯冲带', en: 'Subduction zone' },
  { id: 'rift', zh: '裂谷／洋中脊', en: 'Rift / mid-ocean ridge' },
  { id: 'hotspot', zh: '热点', en: 'Hotspot' },
] as const;
export function geologyFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-017')
    return (
      earthLayers.every((p) => d[`inside-${p.id}`] === p.id) &&
      d['inside-state'] === 'solid' &&
      d['inside-evidence'] === 'waves'
    );
  if (id === 'GEO-018')
    return (
      d['puzzle-fit'] === 'checked' &&
      d['puzzle-evidence'] === 'fossils' &&
      d['plate-size'] === 'both' &&
      boundaryTypes.every(
        (p) =>
          d[`boundary-seen-${p.id}`] === 'yes' &&
          d[`boundary-${p.id}`] === p.id,
      )
    );
  if (id === 'GEO-019')
    return (
      [0, 2, 3, 4].every((n) => d[`fault-seen-${n}`] === 'yes') &&
      d['quake-focus'] === 'underground' &&
      d['quake-epicentre'] === 'above' &&
      d['quake-pattern'] === 'limited' &&
      d['quake-safety'] === 'cover'
    );
  if (id === 'GEO-020')
    return (
      volcanoCases.every(
        (p) =>
          d[`volcano-${p.id}`] === p.setting &&
          d[`magma-${p.id}`] === p.cause &&
          d[`volcano-seen-${p.id}`] === 'yes',
      ) && d['volcano-limit'] === 'some'
    );
  return false;
}
