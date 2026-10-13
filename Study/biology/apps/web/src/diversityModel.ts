import { t } from './schema';
export type LocalLife =
  'cabbage' | 'fern' | 'tui' | 'kereru' | 'weta' | 'katipo';
export const localLife = {
  cabbage: {
    name: t('卷心菜树 · tī kōuka', 'Cabbage tree · tī kōuka'),
    scientific: 'Cordyline australis',
    clue: t(
      '细长带状叶在枝端成簇；图示小型树。',
      'Long strap-like leaves cluster at branch tips; a small tree is shown.',
    ),
    leafy: true,
    frond: false,
    feathers: false,
    tuft: false,
    sixLegs: false,
  },
  fern: {
    name: t('银蕨 · ponga', 'Silver fern · ponga'),
    scientific: 'Alsophila dealbata',
    clue: t(
      '羽状分裂的蕨叶，翻面处示银白色；不是羽毛。',
      'Divided fronds with a silvery underside shown at a turned tip, not feathers.',
    ),
    leafy: true,
    frond: true,
    feathers: false,
    tuft: false,
    sixLegs: false,
  },
  tui: {
    name: t('蜜雀 · tūī', 'Tūī'),
    scientific: 'Prosthemadera novaeseelandiae',
    clue: t(
      '成鸟喉部一簇白羽，身体可有深色与金属光泽。',
      'An adult with a white throat tuft and dark, iridescent plumage.',
    ),
    leafy: false,
    frond: false,
    feathers: true,
    tuft: true,
    sixLegs: false,
  },
  kereru: {
    name: t('新西兰鸽 · kererū', 'Kererū · New Zealand pigeon'),
    scientific: 'Hemiphaga novaeseelandiae',
    clue: t(
      '成鸟有明显白色胸腹，头部与背部有绿色光泽。',
      'An adult with a broad white breast/belly and green-toned head/back.',
    ),
    leafy: false,
    frond: false,
    feathers: true,
    tuft: false,
    sixLegs: false,
  },
  weta: {
    name: t('惠灵顿树沙螽 · wētā', 'Wellington tree wētā'),
    scientific: 'Hemideina crassidens',
    clue: t(
      '本例昆虫有六条腿、两根长触角，后腿较粗。',
      'This insect has six legs, two long antennae and enlarged hind legs.',
    ),
    leafy: false,
    frond: false,
    feathers: false,
    tuft: false,
    sixLegs: true,
  },
  katipo: {
    name: t('卡蒂波蜘蛛 · katipō', 'Katipō spider'),
    scientific: 'Latrodectus katipo',
    clue: t(
      '本例成年雌蛛有八条腿，腹部红色条纹；不用于真实蜘蛛鉴定。',
      'This adult female has eight legs and a red abdomen stripe; not for real spider identification.',
    ),
    leafy: false,
    frond: false,
    feathers: false,
    tuft: false,
    sixLegs: false,
  },
} as const;
export const specimenIds = Object.keys(localLife) as LocalLife[];
export type KeyNode = 'leafy' | 'frond' | 'feathers' | 'tuft' | 'sixLegs';
export const keyNodes: Record<
  KeyNode,
  {
    question: ReturnType<typeof t>;
    yes: KeyNode | LocalLife;
    no: KeyNode | LocalLife;
    yesLabel: ReturnType<typeof t>;
    noLabel: ReturnType<typeof t>;
  }
> = {
  leafy: {
    question: t('图中有植物的叶片吗？', 'Are plant leaves shown?'),
    yes: 'frond',
    no: 'feathers',
    yesLabel: t('有叶片', 'Leaves shown'),
    noLabel: t('是动物结构', 'Animal structures'),
  },
  frond: {
    question: t(
      '叶片是分裂的蕨叶，还是带状成簇？',
      'Divided fronds or clustered straps?',
    ),
    yes: 'fern',
    no: 'cabbage',
    yesLabel: t('分裂的蕨叶', 'Divided fronds'),
    noLabel: t('带状叶成簇', 'Clustered straps'),
  },
  feathers: {
    question: t('图中动物有羽毛吗？', 'Does the animal have feathers?'),
    yes: 'tuft',
    no: 'sixLegs',
    yesLabel: t('有羽毛', 'Feathers'),
    noLabel: t('无羽毛，分节的腿', 'No feathers; jointed legs'),
  },
  tuft: {
    question: t(
      '白羽是喉部小簇，还是大片胸腹？',
      'A throat tuft or a broad white breast?',
    ),
    yes: 'tui',
    no: 'kereru',
    yesLabel: t('喉部白羽簇', 'White throat tuft'),
    noLabel: t('白色胸腹', 'Broad white breast'),
  },
  sixLegs: {
    question: t(
      '完整图示有几条腿？',
      'How many legs in this complete illustration?',
    ),
    yes: 'weta',
    no: 'katipo',
    yesLabel: t('六条腿与触角', 'Six legs and antennae'),
    noLabel: t('八条腿', 'Eight legs'),
  },
};
export function keyPosition(answers: readonly boolean[]): KeyNode | LocalLife {
  let node: KeyNode | LocalLife = 'leafy';
  for (const a of answers) {
    if (!(node in keyNodes)) break;
    const branch: (typeof keyNodes)[KeyNode] = keyNodes[node as KeyNode];
    node = a ? branch.yes : branch.no;
  }
  return node;
}
export function keyCandidates(answers: readonly boolean[]): LocalLife[] {
  const root = keyPosition(answers),
    walk = (node: KeyNode | LocalLife): LocalLife[] =>
      node in keyNodes
        ? [
            ...walk(keyNodes[node as KeyNode].yes),
            ...walk(keyNodes[node as KeyNode].no),
          ]
        : [node as LocalLife];
  return walk(root);
}
export function specimenPath(id: LocalLife): boolean[] {
  const path: boolean[] = [];
  let node: KeyNode | LocalLife = 'leafy';
  while (node in keyNodes) {
    const answer: boolean = localLife[id][node as KeyNode];
    path.push(answer);
    node = answer
      ? keyNodes[node as KeyNode].yes
      : keyNodes[node as KeyNode].no;
  }
  return path;
}
export type PairCase = 'variation' | 'different' | 'uncertain';
export function speciesComparison(kind: PairCase) {
  return kind === 'variation'
    ? 'same-species'
    : kind === 'different'
      ? 'different-species'
      : 'insufficient-evidence';
}
export type Interaction = 'competition' | 'predation' | 'mutualism';
export function interactionEvidence(kind: Interaction, pollenContact: boolean) {
  return {
    resource:
      kind === 'competition'
        ? 'limited-light'
        : kind === 'predation'
          ? 'prey'
          : 'nectar',
    a: kind === 'competition' ? 'cost' : 'benefit',
    b:
      kind === 'predation'
        ? 'cost'
        : kind === 'competition'
          ? 'cost'
          : pollenContact
            ? 'potential-benefit'
            : 'unconfirmed',
    pollenTransferred: kind === 'mutualism' && pollenContact,
  } as const;
}
export type Habitat = 'forest' | 'coast';
/** Members are a selected teaching focus, never an exhaustive geographic distribution. */
export const habitatFocus: Record<Habitat, readonly LocalLife[]> = {
  forest: ['cabbage', 'fern', 'tui', 'kereru', 'weta'],
  coast: ['cabbage', 'katipo'],
};
export function habitatConcern(
  habitat: Habitat,
  changed: boolean,
  id: LocalLife,
) {
  if (!changed) return 'baseline';
  return habitat === 'forest' && id === 'tui'
    ? 'nectar-options-reduced'
    : habitat === 'coast' && id === 'katipo'
      ? 'shelter-reduced'
      : 'not-assessed';
}
