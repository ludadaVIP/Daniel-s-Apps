export const placeLessonIds = ['GEO-013', 'GEO-014', 'GEO-015', 'GEO-016'];
export const landUseScenes = [
  {
    id: 'city',
    asset: 'nyc-oblique',
    zh: '海湾城市',
    en: 'Harbour city',
    expected: 'built',
    date: '2022-04-17',
    clueZh: '密集建筑与规则街区，旁边有水道；公园不是农田的充分证据。',
    clueEn:
      'Dense buildings and street blocks beside waterways; a park alone is not evidence of farmland.',
  },
  {
    id: 'suburbs',
    asset: 'phoenix-suburbs',
    zh: '城市边缘',
    en: 'Urban edge',
    expected: 'mixed',
    date: '2009-10-29',
    clueZh:
      '蓝灰色建成区域与少量规则农田共存；不能仅凭影像认定每栋建筑的用途。',
    clueEn:
      'Blue-grey built-up areas coexist with some regular fields; imagery does not establish every building’s use.',
  },
  {
    id: 'fields',
    asset: 'canterbury-fields',
    zh: '农田与河流',
    en: 'Fields and river',
    expected: 'agriculture',
    date: '2015-10-17',
    clueZh:
      '规则矩形田块与分汊河道；深绿林带可能是人工种植，也不是未受人影响的证明。',
    clueEn:
      'Regular rectangular fields and braided channels; dark-green forest may be planted, not proof of untouched nature.',
  },
] as const;
export const nzFeatures = [
  {
    id: 'auckland',
    letter: 'A',
    zh: '奥克兰',
    en: 'Auckland',
    lon: 174.76,
    lat: -36.85,
    kind: 'city',
    clueZh: '北岛北部，靠近狭窄地峡的城市。',
    clueEn: 'A city near the narrow northern North Island isthmus.',
  },
  {
    id: 'wellington',
    letter: 'B',
    zh: '惠灵顿',
    en: 'Wellington',
    lon: 174.78,
    lat: -41.29,
    kind: 'city',
    clueZh: '北岛南端，库克海峡旁的城市。',
    clueEn: 'A city at the southern end of North Island beside Cook Strait.',
  },
  {
    id: 'christchurch',
    letter: 'C',
    zh: '基督城',
    en: 'Christchurch',
    lon: 172.63,
    lat: -43.53,
    kind: 'city',
    clueZh: '南岛东侧，坎特伯雷平原临海的城市。',
    clueEn: 'A coastal city on the eastern Canterbury Plains of South Island.',
  },
  {
    id: 'alps',
    letter: 'D',
    zh: '南阿尔卑斯山脉',
    en: 'Southern Alps',
    lon: 170.5,
    lat: -43.3,
    kind: 'mountain',
    clueZh: '南岛中部偏西的长山脉；点只代表大致区域。',
    clueEn:
      'A long range towards western-central South Island; the point represents a region.',
  },
  {
    id: 'ruapehu',
    letter: 'E',
    zh: '鲁阿佩胡火山',
    en: 'Ruapehu',
    lon: 175.56,
    lat: -39.28,
    kind: 'volcano',
    clueZh: '北岛中央火山地区的山峰。',
    clueEn: 'A peak in the central North Island volcanic region.',
  },
  {
    id: 'waikato',
    letter: 'F',
    zh: '怀卡托河',
    en: 'Waikato River',
    lon: 175.3,
    lat: -37.8,
    kind: 'river',
    clueZh: '北岛从陶波湖一带向西北入海的河流；点代表汉密尔顿附近河段。',
    clueEn:
      'A North Island river flowing from the Taupō region towards a northwest outlet; point near Hamilton.',
  },
  {
    id: 'clutha',
    letter: 'G',
    zh: '克卢萨河',
    en: 'Clutha River',
    lon: 169.7,
    lat: -45.8,
    kind: 'river',
    clueZh: '南岛南部，从内陆湖区流向东南海岸的河流。',
    clueEn:
      'A southern South Island river linking inland lake country to the southeast coast.',
  },
] as const;
export const nzPoint = (lon: number, lat: number) => ({
  x: (lon - 164) * 45 * 0.755,
  y: (-lat - 33) * 45,
});
export const detectiveScenes = [
  {
    id: 'harbour',
    asset: 'nyc-oblique',
    date: '2022-04-17',
    placeZh: '纽约及新泽西',
    placeEn: 'New York and New Jersey',
    profileZh: '温带海湾城市，有密集建成区与跨水交通。',
    profileEn:
      'A temperate harbour metropolis with dense built areas and crossings.',
    observedZh: '密集建筑、规则街区与宽水道；斜视照片中南方在上。',
    observedEn:
      'Dense structures, street blocks and broad waterways; south is at the top of this oblique view.',
    evidence: ['blocks', 'water'],
    options: [
      ['heat', '一张照片证明全年炎热', 'One photo proves year-round heat'],
      ['blocks', '建筑与规则街区', 'Buildings and regular street blocks'],
      ['water', '宽水道及跨水连接', 'Broad waterways and crossings'],
    ],
  },
  {
    id: 'sand',
    asset: 'namib-dunes',
    date: '2019-11-13',
    placeZh: '纳米布沙海',
    placeEn: 'Namib Sand Sea',
    profileZh: '干旱区域，长条沙丘与少量岩石露头。',
    profileEn: 'An arid region with long dunes and occasional rock outcrops.',
    observedZh: '成组长条脊线、较少植被与浅色露头；仅凭沙丘不能唯一确定国家。',
    observedEn:
      'Groups of long ridges, sparse vegetation and pale outcrops; dunes alone cannot uniquely identify a country.',
    evidence: ['ridges', 'bare'],
    options: [
      ['river', '蓝色连续河道', 'A continuous blue river'],
      ['ridges', '成组长条沙丘脊线', 'Groups of long dune ridges'],
      [
        'bare',
        '大片裸露地面与少量植被',
        'Extensive bare ground and sparse vegetation',
      ],
    ],
  },
  {
    id: 'farm',
    asset: 'canterbury-fields',
    date: '2015-10-17',
    placeZh: '坎特伯雷平原',
    placeEn: 'Canterbury Plains',
    profileZh: '新西兰农业平原，规则田块与编织状河网。',
    profileEn:
      'An agricultural New Zealand plain with regular fields and braided channels.',
    observedZh:
      '规则矩形地块、林带与宽阔分汊河道；颜色不能直接告诉我们作物品种。',
    observedEn:
      'Regular rectangular plots, forest belts and broad braided channels; colour alone does not identify crops.',
    evidence: ['plots', 'braids'],
    options: [
      ['plots', '规则矩形田块', 'Regular rectangular fields'],
      ['braids', '宽阔分汊河道', 'Broad braided channels'],
      ['income', '影像可读出农民收入', 'Imagery reveals farmers’ income'],
    ],
  },
  {
    id: 'mountains',
    asset: 'south-island-modis',
    date: '2007-12-07',
    placeZh: '新西兰南岛',
    placeEn: 'New Zealand’s South Island',
    profileZh: '中纬度海岛，中央山脉、海岸与较宽东部平原。',
    profileEn:
      'A mid-latitude island with central mountains, coast and broader eastern plains.',
    observedZh: '山地白色区域与岛屿海岸、东侧较平土地；白色可能是雪、冰或云。',
    observedEn:
      'White mountain areas, island coast and flatter eastern land; white may mean snow, ice or cloud.',
    evidence: ['coast', 'relief'],
    options: [
      ['coast', '岛屿海岸与周围海洋', 'Island coast and surrounding ocean'],
      [
        'relief',
        '中部山脉与东侧平地',
        'Central mountains and flatter eastern land',
      ],
      ['season', '有白色就一定是冬季', 'White must mean winter'],
    ],
  },
] as const;
export function detectiveFinished(id: string, d: Record<string, string>) {
  const scene = detectiveScenes.find((p) => p.id === id);
  return (
    !!scene &&
    d[`guess-${id}`] === id &&
    scene.evidence.every((k) => d[`evidence-${id}-${k}`] === 'yes') &&
    d[`confidence-${id}`] === 'likely' &&
    d[`revealed-${id}`] === 'yes' &&
    d[`checked-${id}`] === 'source'
  );
}
export function placeFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-013')
    return (
      landUseScenes.every((p) => d[`landuse-${p.id}`] === p.expected) &&
      d['landuse-limit'] === 'limited'
    );
  if (id === 'GEO-014')
    return (
      nzFeatures.every((p) => d[`nz-${p.id}`] === p.id) &&
      d['nz-comparison'] === 'varied'
    );
  if (id === 'GEO-015')
    return detectiveScenes.every((p) => detectiveFinished(p.id, d));
  return false;
}
