import weatherData from '../../../content/weather-data.json';
export const weather = weatherData;
export const weatherLessonIds = ['GEO-033', 'GEO-034', 'GEO-035', 'GEO-036'];
export const layers = [
  {
    id: 'troposphere',
    zh: '对流层',
    en: 'Troposphere',
    range: '0–~12 km',
    clueZh: '多数天气；顶界随地区与季节约6–20 km',
    clueEn: 'Most weather; top varies roughly 6–20 km',
  },
  {
    id: 'stratosphere',
    zh: '平流层',
    en: 'Stratosphere',
    range: '~12–50 km',
    clueZh: '臭氧吸收太阳紫外线',
    clueEn: 'Ozone absorbs solar ultraviolet',
  },
  {
    id: 'mesosphere',
    zh: '中间层',
    en: 'Mesosphere',
    range: '~50–85 km',
    clueZh: '许多流星在此发光烧蚀',
    clueEn: 'Many meteors glow and ablate here',
  },
  {
    id: 'thermosphere',
    zh: '热层',
    en: 'Thermosphere',
    range: '~85–600 km',
    clueZh: '国际空间站约400 km；气体很稀薄',
    clueEn: 'ISS around 400 km; very thin gas',
  },
  {
    id: 'exosphere',
    zh: '外逸层',
    en: 'Exosphere',
    range: '~600 km +',
    clueZh: '渐渐过渡到太空，不是硬壳',
    clueEn: 'Gradual transition into space, not a shell',
  },
];
export const scaleCases = [
  {
    id: 'rain',
    zh: '南岛某天的降水估计图',
    en: 'Estimated rain on one South Island day',
    answer: 'weather',
  },
  {
    id: 'mean',
    zh: '1991–2020各年一月平均的汇总',
    en: 'January means combined across 1991–2020',
    answer: 'climate',
  },
  {
    id: 'week',
    zh: '欧洲某地未来三天的预报',
    en: 'A three-day forecast at a European place',
    answer: 'weather',
  },
  {
    id: 'trend',
    zh: '几十年温度随年份是否上升',
    en: 'Whether temperature rises across decades',
    answer: 'change',
  },
];
/** A radiative-only, solar-transparent, single IR-opaque layer in equilibrium.
 * Chosen arbitrary energy units per interval; not Earth's measured budget.
 */
export function energyBudget(absorbing: boolean) {
  return {
    solar: 7,
    surfaceOut: absorbing ? 14 : 7,
    down: absorbing ? 7 : 0,
    spaceOut: 7,
    atmosphereIn: absorbing ? 14 : 0,
    atmosphereOut: absorbing ? 14 : 0,
  };
}
/** Local eastward initial motion: Coriolis north→south/right, south→north/left.
 * Reversing motion reverses map deflection; no trajectory forecast. */
export function windCase(
  reverse: boolean,
  hemisphere: string,
  difference: number,
) {
  const delta = [0, 4, 12].includes(difference) ? difference : 4;
  const direction = reverse ? -1 : 1;
  const bend =
    delta === 0
      ? 0
      : hemisphere === 'north'
        ? 1
        : hemisphere === 'south'
          ? -1
          : 0;
  return {
    delta,
    left: 1010 + (reverse ? 0 : delta),
    right: 1010 + (reverse ? delta : 0),
    direction,
    deflection: bend * direction,
    moving: delta > 0,
  };
}
/** LCL approximation z=(T-Td)/7.8 in km: dry lapse 9.8, Td lapse ~2 K/km.
 * After saturation a chosen 6 K/km is used, not a universal moist lapse rate.
 * Lift is imposed. Mixing, stability, ice and microphysics are omitted. */
export function cloudParcel(wet: boolean, height: number, grow = false) {
  const z = Number.isFinite(height) ? Math.min(2, Math.max(0, height)) : 0;
  const dewpoint = wet ? 16 : 6;
  const base = (20 - dewpoint) / 7.8;
  const cloud = z >= base;
  const temperature = cloud ? 20 - 9.8 * base - 6 * (z - base) : 20 - 9.8 * z;
  return { height: z, base, dewpoint, temperature, cloud, rain: cloud && grow };
}
export const weatherAnswers: Record<string, Record<string, string>> = {
  'GEO-033': {
    'scale-rain': 'weather',
    'scale-mean': 'climate',
    'scale-week': 'weather',
    'scale-trend': 'change',
    'day-claim': 'limited',
    'mean-claim': 'not-every',
    'season-claim': 'opposite',
  },
  'GEO-034': {
    'layer-weather': 'troposphere',
    'layer-ozone': 'stratosphere',
    'layer-meteor': 'mesosphere',
    'layer-iss': 'thermosphere',
    'layer-edge': 'exosphere',
    'energy-claim': 'emit',
    'height-claim': 'variable',
  },
  'GEO-035': {
    'wind-force': 'high-low',
    'wind-gradient': 'stronger',
    'wind-north': 'right',
    'wind-south': 'left',
    'wind-name': 'west',
    'wind-limit': 'other',
  },
  'GEO-036': {
    'cloud-cause': 'expand',
    'cloud-visible': 'drops',
    'cloud-rain': 'growth',
    'cloud-dry': 'higher',
    'cloud-limit': 'imposed',
  },
};
export const weatherEvidence: Record<string, string[]> = {
  'GEO-033': ['day-0', 'day-1', 'climate-nz', 'climate-europe'],
  'GEO-034': ['energy-clear', 'energy-absorb'],
  'GEO-035': [
    'wind-4',
    'wind-12',
    'wind-0',
    'wind-forward-north',
    'wind-forward-south',
    'wind-reverse-north',
  ],
  'GEO-036': [
    'parcel-wet-low',
    'parcel-wet-cloud',
    'parcel-dry-low',
    'parcel-wet-one',
    'parcel-dry-one',
    'parcel-dry-cloud',
    'parcel-small',
    'parcel-grow',
  ],
};
export function weatherFinished(id: string, decisions: Record<string, string>) {
  const answers = weatherAnswers[id];
  return (
    !!answers &&
    Object.entries(answers).every(([k, v]) => decisions[k] === v) &&
    weatherEvidence[id]!.every((k) => decisions[k] === 'yes')
  );
}
