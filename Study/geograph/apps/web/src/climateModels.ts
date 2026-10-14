import data from '../../../content/climate-process-data.json';
import climate from '../../../content/climate-data.json';
import { cloudParcel } from './weatherModels';
import { seasonLight } from './skillModels';
export const climateData = data;
const climateNames: Record<string, string> = {
  tropical: 'Equatorial cell',
  temperate: 'Midlatitude cell',
  polar: 'Greenland cell',
  plateau: 'Tibetan Plateau cell',
  lowland: 'East China lowland cell',
};
export const climatePoints = climate.points.map((p) => ({
  ...p,
  en: climateNames[p.id] ?? p.id,
}));
export const climateLessonIds = ['GEO-037', 'GEO-038', 'GEO-039', 'GEO-040'];
/** Two factual annual normals cited from NIWA2018 Table6,1981–2010.
 * City reference points are coarse context, not exact station coordinates. */
export const rainStations = [
  {
    id: 'west',
    zh: '格雷茅斯机场',
    en: 'Greymouth Aero',
    lat: -42.5,
    lon: 171.2,
    annual: 2452,
  },
  {
    id: 'east',
    zh: '基督城机场',
    en: 'Christchurch Aero',
    lat: -43.5,
    lon: 172.6,
    annual: 594,
  },
];
export function boundedStep(
  value: string | undefined,
  max: number,
  fallback = 0,
) {
  const n = Number(value);
  return value !== undefined && Number.isInteger(n) && n >= 0 && n <= max
    ? n
    : fallback;
}
/** Prescribed mountain crossing; ascent reuses GEO-036 approximate parcel.
 * All condensate removed at crest is an explicit idealisation for dry descent. */
export function reliefParcel(
  wet: boolean,
  peak: number,
  frame: number,
  west: boolean,
) {
  const ridge = [0, 1, 2].includes(peak) ? peak : 2;
  const f = Number.isInteger(frame) && frame >= 0 && frame <= 4 ? frame : 0;
  const z = [0, ridge / 2, ridge, ridge / 2, 0][f]!;
  const summit = cloudParcel(wet, ridge);
  const ascent = cloudParcel(wet, z);
  const descending = f > 2;
  const temperature = descending
    ? summit.temperature + 9.8 * (ridge - z)
    : ascent.temperature;
  const cloud = !descending && ascent.cloud;
  return {
    ridge,
    frame: f,
    height: z,
    temperature,
    base: summit.base,
    cloud,
    descending,
    windward: west ? 'west' : 'east',
    lee: west ? 'east' : 'west',
    condensedAtCrest: summit.cloud,
    x: west ? 120 + 165 * f : 780 - 165 * f,
  };
}
/** Astronomical latitude belts using the same chosen23.4° tilt as GEO-008.
 * They are not Köppen classes or a full diagnosis of actual climate. */
export function latitudeBelt(latitude: number) {
  const a = Math.abs(latitude);
  return a <= 23.4 ? 'tropical' : a >= 66.6 ? 'polar' : 'temperate';
}
export function solarGeometry(latitude: number, quarter: number) {
  const lat = Number.isFinite(latitude)
    ? Math.max(-75, Math.min(75, latitude))
    : 0;
  const q = [0, 1, 3].includes(quarter) ? quarter : 0;
  const light = seasonLight(lat, q);
  const incidence = Math.max(0, Math.sin((light.noonHeight * Math.PI) / 180));
  return {
    ...light,
    latitude: lat,
    quarter: q,
    relativeNoon: incidence,
    beamFootprint: incidence > 1e-8 ? 1 / incidence : null,
  };
}
/** Equal50-unit beam width measured perpendicular to rays; its projected
 * horizontal footprint is50/sin(altitude). The same geometry drives the SVG. */
export function solarBeam(latitude: number, quarter: number) {
  const a = solarGeometry(latitude, quarter);
  if (a.relativeNoon <= 0) return null;
  const angle = (a.noonHeight * Math.PI) / 180,
    s = Math.sin(angle),
    c = Math.cos(angle),
    x = 450 - 190 * c,
    y = 370 - 190 * s;
  return {
    points: [
      [x - 25 * s, y + 25 * c],
      [x + 25 * s, y - 25 * c],
      [450 + 25 / s, 370],
      [450 - 25 / s, 370],
    ],
    footprint: 50 / s,
  };
}
/** Chosen land-minus-ocean contrast. Symbolic levels, not°C or pressure hPa.
 * Prescribed circulation tendency; no solved winds or precipitation forecast. */
export function monsoonContrast(contrast: number) {
  const c = Number.isFinite(contrast) ? Math.max(-2, Math.min(2, contrast)) : 0;
  return {
    contrast: c,
    phase: c > 0 ? 'warm' : c < 0 ? 'cool' : 'equal',
    landPressure: c > 0 ? 'L' : c < 0 ? 'H' : '=',
    oceanPressure: c > 0 ? 'H' : c < 0 ? 'L' : '=',
    towardLand: c > 0,
    magnitude: Math.abs(c),
  };
}
export const desertCases = [
  {
    id: 'sahara',
    zh: '撒哈拉',
    en: 'Sahara',
    cause: 'subsidence',
    clueZh: '副热带下沉空气较不利于成云；各处与各季并不相同。',
    clueEn:
      'Subtropical subsidence often suppresses clouds; places/seasons differ.',
  },
  {
    id: 'gobi',
    zh: '戈壁',
    en: 'Gobi',
    cause: 'interior',
    clueZh: '大陆内部与山地屏障影响水汽供应；冬季可寒冷，夏季也可热。',
    clueEn:
      'Continental interior and mountain barriers limit moisture; winters can be cold and summers hot.',
  },
  {
    id: 'atacama',
    zh: '阿塔卡马',
    en: 'Atacama',
    cause: 'coast',
    clueZh: '冷海流、下沉与山地共同影响少雨；雾不等于大量降雨。',
    clueEn:
      'Cold current, subsidence and mountains contribute to dryness; fog is not heavy rainfall.',
  },
  {
    id: 'antarctica',
    zh: '南极内陆',
    en: 'Antarctic interior',
    cause: 'polar',
    clueZh: '极冷与水汽供应少，内陆降水很少；海岸可更湿。',
    clueEn:
      'Extreme cold and limited moisture supply leave little interior precipitation; coasts can be wetter.',
  },
];
export const climateAnswers: Record<string, Record<string, string>> = {
  'GEO-037': {
    'rain-westside': 'west',
    'rain-eastside': 'east',
    'rain-cooling': 'expand',
    'rain-lee': 'removed-warming',
    'rain-conditions': 'conditional',
    'rain-period': 'climate',
  },
  'GEO-038': {
    ...Object.fromEntries(
      climatePoints.map((p) => [`belt-${p.id}`, latitudeBelt(p.lat)]),
    ),
    'climate-season': 'tilt',
    'climate-height': 'elevation',
    'climate-ocean': 'transport',
    'climate-belt-limit': 'multiple',
  },
  'GEO-039': {
    'monsoon-warm-force': 'sea-land',
    'monsoon-cool-force': 'land-sea',
    'monsoon-scale': 'season',
    'monsoon-rain': 'moisture-lift',
    'monsoon-exception': 'sea-path',
    'monsoon-limit': 'complex',
  },
  'GEO-040': {
    ...Object.fromEntries(
      desertCases.map((c) => [`desert-cause-${c.id}`, c.cause]),
    ),
    'desert-common': 'dry',
    'desert-cold': 'possible',
    'desert-map-limit': 'not-classification',
    'desert-nz': 'not-same',
  },
};
export const climateEvidence: Record<string, string[]> = {
  'GEO-037': [
    'station-west',
    'station-east',
    'relief-west-rise',
    'relief-west-lee',
    'relief-east-rise',
    'relief-east-lee',
    'relief-low-dry',
    'relief-high-dry',
    'relief-flat',
  ],
  'GEO-038': [
    'climate-bands',
    'climate-temperature',
    'solar-0-0',
    'solar-75-0',
    'solar-75-1',
    'solar-75-3',
    'solar-nz-1',
    'solar-nz-3',
  ],
  'GEO-039': [
    'monsoon-warm',
    'monsoon-cool',
    'monsoon-equal',
    'monsoon-west-chart',
    'monsoon-east-chart',
  ],
  'GEO-040': [
    'desert-sahara',
    'desert-gobi',
    'desert-atacama',
    'desert-antarctica',
    'desert-rain-map',
    'desert-temp-map',
    'desert-photo-hot',
    'desert-photo-cold',
  ],
};
export function climateFinished(id: string, d: Record<string, string>) {
  const answers = climateAnswers[id];
  return (
    !!answers &&
    Object.entries(answers).every(([k, v]) => d[k] === v) &&
    climateEvidence[id]!.every((k) => d[k] === 'yes')
  );
}
