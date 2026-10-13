import { t } from './schema';
export type CellKind = 'animal' | 'leaf' | 'onion';
export type CellPart =
  | 'membrane'
  | 'cytoplasm'
  | 'nucleus'
  | 'mitochondria'
  | 'ribosomes'
  | 'wall'
  | 'vacuole'
  | 'chloroplasts';
export const cellNames = {
  animal: t('典型动物细胞', 'Typical animal cell'),
  leaf: t('绿色叶肉细胞', 'Green mesophyll cell'),
  onion: t('地下洋葱鳞叶表皮', 'Underground bulb epidermis'),
};
const shared: CellPart[] = [
  'membrane',
  'cytoplasm',
  'nucleus',
  'mitochondria',
  'ribosomes',
];
export function cellParts(kind: CellKind): CellPart[] {
  return kind === 'animal'
    ? [...shared]
    : [
        ...shared,
        'wall',
        'vacuole',
        ...(kind === 'leaf' ? ['chloroplasts' as const] : []),
      ];
}
export function cellActivity(kind: CellKind, light: boolean) {
  // Representative viable cells with oxygen, stored sugar, amino acids and
  // suitable conditions. These are qualitative possibilities, never rates.
  return {
    photosynthesis: kind === 'leaf' && light,
    respiration: true,
    proteinAssembly: true,
  };
}
export const cellInfo = {
  membrane: {
    name: t('细胞膜', 'Cell membrane'),
    detail: t(
      '分隔内外，选择性调节物质交换；植物细胞的膜在壁里面。',
      'Separates inside from outside and selectively regulates exchange; a plant membrane lies inside the wall.',
    ),
  },
  cytoplasm: {
    name: t('细胞质', 'Cytoplasm'),
    detail: t(
      '细胞膜内、核外的区域，含液体、结构及许多反应；不是空白。',
      'The region inside the membrane but outside the nucleus contains fluid, structures and many reactions; it is not empty.',
    ),
  },
  nucleus: {
    name: t('细胞核', 'Nucleus'),
    detail: t(
      '这里保存大部分DNA，信息副本帮助调节蛋白质制造。核不是会思考的大脑。',
      'Stores most DNA here; information copies help regulate protein production. It is not a thinking brain.',
    ),
  },
  mitochondria: {
    name: t('线粒体', 'Mitochondria'),
    detail: t(
      '承担有氧细胞呼吸的重要步骤，转移已有养分中的能量。植物也有；细胞质也参与呼吸的一些步骤。',
      'Perform major stages of aerobic respiration, transferring energy from existing nutrients. Plants have them too; some respiration stages occur in cytoplasm.',
    ),
  },
  ribosomes: {
    name: t('核糖体', 'Ribosomes'),
    detail: t(
      '按信息把氨基酸组装成蛋白质。图中小点为放大示意，不代表普通光学图能看清它们。',
      'Assemble amino acids into proteins using information. Dots are enlarged symbols, not evidence of ordinary light-microscope visibility.',
    ),
  },
  wall: {
    name: t('细胞壁', 'Cell wall'),
    detail: t(
      '在植物细胞膜外，主要含纤维素，参与支持；不代替细胞膜。',
      'Outside the plant membrane, mainly containing cellulose and supporting the cell; it does not replace the membrane.',
    ),
  },
  vacuole: {
    name: t('中央液泡', 'Central vacuole'),
    detail: t(
      '由膜包围，里面有细胞液，参与储存与膨压支持；不是空气洞。',
      'A membrane-bound compartment with cell sap, contributing to storage and turgor support; not an air pocket.',
    ),
  },
  chloroplasts: {
    name: t('叶绿体', 'Chloroplasts'),
    detail: t(
      '本课绿色叶肉模型中的光合作用场所。典型地下鳞叶表皮模型没有；不能推广到每格植物细胞。',
      'Photosynthetic structures in this green mesophyll model. Absent in the typical underground bulb epidermis model; not a universal plant feature.',
    ),
  },
};
export const cellRoutes = {
  leaf: [
    t('叶肉细胞', 'Mesophyll cell'),
    t('叶肉组织', 'Mesophyll tissue'),
    t('叶片', 'Leaf'),
    t('植物个体', 'Plant organism'),
  ],
  intestine: [
    t('吸收细胞', 'Absorptive cell'),
    t('小肠上皮组织', 'Intestinal epithelium'),
    t('小肠', 'Small intestine'),
    t('人体个体', 'Human organism'),
  ],
};
