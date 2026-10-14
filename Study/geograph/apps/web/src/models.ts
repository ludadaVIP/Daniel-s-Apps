export type Point = {
  id: string;
  x: number;
  y: number;
  zh: string;
  en: string;
};
export const routePoints: Point[] = [
  { id: 'school', x: 100, y: 350, zh: '学校', en: 'School' },
  { id: 'south', x: 300, y: 350, zh: '桥南', en: 'South bank' },
  { id: 'bridge', x: 300, y: 250, zh: '桥', en: 'Bridge' },
  { id: 'north', x: 300, y: 150, zh: '桥北', en: 'North bank' },
  { id: 'library', x: 100, y: 150, zh: '图书馆', en: 'Library' },
  { id: 'park', x: 100, y: 450, zh: '公园', en: 'Park' },
];
const edges = [
  ['school', 'south'],
  ['south', 'bridge'],
  ['bridge', 'north'],
  ['north', 'library'],
  ['school', 'park'],
];
export function routeMove(
  route: string[],
  to: string,
): {
  route: string[];
  valid: boolean;
  reason: 'same' | 'river' | 'adjacent' | 'moved';
} {
  const last = route.at(-1) ?? 'school';
  if (last === to) return { route, valid: false, reason: 'same' };
  if (
    edges.some(([a, b]) => (a === last && b === to) || (b === last && a === to))
  )
    return { route: [...route, to].slice(-30), valid: true, reason: 'moved' };
  return {
    route,
    valid: false,
    reason: last === 'school' && to === 'library' ? 'river' : 'adjacent',
  };
}
export function routeFinished(route: string[]) {
  return (
    route[0] === 'school' &&
    route.at(-1) === 'library' &&
    route.includes('bridge') &&
    route.every(
      (id, i) =>
        i === 0 ||
        edges.some(
          ([a, b]) =>
            (a === route[i - 1] && b === id) ||
            (b === route[i - 1] && a === id),
        ),
    )
  );
}
export function rotatePoint(
  x: number,
  y: number,
  rotation: number,
  centre = 250,
) {
  const a = (rotation * Math.PI) / 180;
  return {
    x: centre + (x - centre) * Math.cos(a) - (y - centre) * Math.sin(a),
    y: centre + (x - centre) * Math.sin(a) + (y - centre) * Math.cos(a),
  };
}
export const worldTargets = [
  {
    id: 'asia',
    name: { zh: '亚洲', en: 'Asia' },
    lon: 95,
    lat: 43,
    kind: 'land',
  },
  {
    id: 'europe',
    name: { zh: '欧洲', en: 'Europe' },
    lon: 20,
    lat: 55,
    kind: 'land',
  },
  {
    id: 'africa',
    name: { zh: '非洲', en: 'Africa' },
    lon: 20,
    lat: 4,
    kind: 'land',
  },
  {
    id: 'north-america',
    name: { zh: '北美洲', en: 'North America' },
    lon: -110,
    lat: 45,
    kind: 'land',
  },
  {
    id: 'south-america',
    name: { zh: '南美洲', en: 'South America' },
    lon: -60,
    lat: -18,
    kind: 'land',
  },
  {
    id: 'oceania',
    name: { zh: '大洋洲', en: 'Oceania' },
    lon: 134,
    lat: -25,
    kind: 'land',
  },
  {
    id: 'antarctica',
    name: { zh: '南极洲', en: 'Antarctica' },
    lon: 20,
    lat: -78,
    kind: 'land',
  },
  {
    id: 'pacific',
    name: { zh: '太平洋', en: 'Pacific' },
    lon: -145,
    lat: -6,
    kind: 'ocean',
  },
  {
    id: 'atlantic',
    name: { zh: '大西洋', en: 'Atlantic' },
    lon: -35,
    lat: 8,
    kind: 'ocean',
  },
  {
    id: 'indian',
    name: { zh: '印度洋', en: 'Indian' },
    lon: 80,
    lat: -25,
    kind: 'ocean',
  },
  {
    id: 'arctic',
    name: { zh: '北冰洋', en: 'Arctic' },
    lon: -135,
    lat: 78,
    kind: 'ocean',
  },
  {
    id: 'southern',
    name: { zh: '南大洋', en: 'Southern' },
    lon: 45,
    lat: -62,
    kind: 'ocean',
  },
];
export function worldPoint(lon: number, lat: number, centre = 0) {
  return { x: ((lon + 180 - centre + 360) % 360) * 2.5, y: (90 - lat) * 2.5 };
}

/** Position clues are readable without seeing colour or manipulating a pointer. */
export const worldClues: Record<string, { zh: string; en: string }> = {
  asia: {
    zh: '赤道以北，欧洲以东的广大陆地区域。',
    en: 'A broad land region north of the equator and east of Europe.',
  },
  europe: {
    zh: '非洲以北，与亚洲陆地相连的区域。',
    en: 'A land region north of Africa, connected to Asia.',
  },
  africa: {
    zh: '赤道穿过，欧洲以南的大块陆地。',
    en: 'A large land region south of Europe, crossed by the equator.',
  },
  'north-america': {
    zh: '赤道以北，亚洲与欧洲的另一侧，美洲的北部。',
    en: 'The northern part of the Americas, north of the equator, across the oceans from Asia and Europe.',
  },
  'south-america': {
    zh: '美洲的南部，赤道穿过北部，向南逐渐收窄。',
    en: 'The southern Americas, with the equator near the north and land narrowing southwards.',
  },
  oceania: {
    zh: '亚洲以南、太平洋附近，包括澳大利亚、新西兰和许多岛屿。',
    en: 'A region south of Asia, including Australia, New Zealand and many Pacific islands.',
  },
  antarctica: {
    zh: '地球最南端，围绕南极的陆地。',
    en: 'Land around the South Pole, at the far south of Earth.',
  },
  pacific: {
    zh: '亚洲、大洋洲与美洲之间的海洋区域，地图边缘可能将它切开。',
    en: 'Ocean between Asia/Oceania and the Americas, sometimes split by the map edges.',
  },
  atlantic: {
    zh: '美洲与欧洲、非洲之间的海洋区域。',
    en: 'Ocean between the Americas and Europe/Africa.',
  },
  indian: {
    zh: '亚洲南部、非洲东侧、澳大利亚西侧之间的海洋。',
    en: 'Ocean south of Asia, east of Africa and west of Australia.',
  },
  arctic: {
    zh: '远在北方、靠近北极的海洋区域。',
    en: 'Ocean in the far north, near the North Pole.',
  },
  southern: {
    zh: '围绕南极洲的海洋区域；与更北的海洋相连。',
    en: 'Ocean around Antarctica, connected with the oceans to its north.',
  },
};
