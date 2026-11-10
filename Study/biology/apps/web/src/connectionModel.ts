import { t } from './schema';

export const microbeSamples = {
  bacterium: { name: t('代表细菌', 'Representative bacterium'), nucleus: false, multicellular: false, clue: t('细胞膜内有DNA，但没有膜包围的细胞核。', 'DNA lies inside a cell membrane, without a membrane-bound nucleus.') },
  yeast: { name: t('面包酵母', 'Baking yeast'), nucleus: true, multicellular: false, clue: t('这是一个有细胞核的真菌细胞，可形成芽体。', 'A fungal cell with a nucleus; a bud can form.') },
  mould: { name: t('代表霉菌菌丝', 'Representative mould hypha'), nucleus: true, multicellular: true, clue: t('有细胞核；许多菌丝构成菌丝体，示意只画其中一段。', 'Nuclei occur within hyphae; many hyphae form a mycelium. Only one portion is shown.') },
} as const;
export type MicrobeSample = keyof typeof microbeSamples;
export function microbeEvidence(sample: MicrobeSample, revealed: boolean) {
  return { nucleusVisible: revealed && microbeSamples[sample].nucleus, conclusion: revealed ? (sample === 'bacterium' ? 'bacterium' : 'fungus') : 'insufficient' } as const;
}
export function fermentation(viable: boolean, sugar: boolean, step: number) {
  const active = viable && sugar;
  return { active, carbonDioxide: active && step >= 2, ethanol: active && step >= 2, reason: !viable ? 'inactive' : !sugar ? 'no-substrate' : 'fermentation' } as const;
}
export const microbeRoles = [
  { id: 'bread', title: t('面团中的已知面包酵母', 'Known baking yeast in dough'), evidence: t('有糖且条件适宜时产生CO₂；气体可使面团膨起。', 'With sugar and suitable conditions, CO₂ can raise dough.'), role: 'helpful' },
  { id: 'leaf', title: t('落叶上的分解真菌', 'A decomposer fungus on leaf litter'), evidence: t('分解有机物，帮助矿质元素重新进入环境。', 'Breaks down organic matter, helping mineral elements return to the environment.'), role: 'helpful' },
  { id: 'disease', title: t('已有致病证据的细菌', 'A bacterium with established disease evidence'), evidence: t('资料已确认它在给定宿主中可造成病变。', 'Evidence establishes disease-causing ability in the specified host.'), role: 'harmful' },
  { id: 'unknown', title: t('未鉴定的彩色斑点', 'An unidentified coloured spot'), evidence: t('只知道颜色和位置；没有身份、宿主或作用证据。', 'Only colour and location are known, without identity, host or effect evidence.'), role: 'unknown' },
] as const;
export type TransferRoute = 'touch' | 'air';
export function transferPath(route: TransferRoute, breakTouchLink: boolean) {
  const nodes = route === 'touch' ? ['source', 'surface', 'hand', 'entry'] : ['source', 'sharedAir', 'entry'];
  const stop = route === 'touch' && breakTouchLink ? 2 : nodes.length;
  return { nodes, reached: nodes.slice(0, stop), interrupted: stop < nodes.length, predictsInfection: false };
}
export const barrierSites = {
  skin: { title: t('皮肤', 'Skin'), steps: [t('外界接触', 'Outside contact'), t('连续表层', 'Continuous outer layer'), t('限制进入', 'Entry is limited')], challenged: t('破口可提供进入途径；并不表示一定感染。', 'A break can provide an entry route; infection is not certain.') },
  airway: { title: t('呼吸道', 'Airway'), steps: [t('吸入颗粒', 'Inhaled particles'), t('黏液捕获', 'Mucus traps particles'), t('纤毛推动黏液', 'Cilia move mucus')], challenged: t('清除能力减弱时，一部分颗粒更可能留下；数量与感染结果未计算。', 'Weaker clearance can leave some particles behind; neither counts nor infection is calculated.') },
  stomach: { title: t('胃', 'Stomach'), steps: [t('随食物进入', 'Entry with food'), t('酸性环境', 'Acidic environment'), t('抑制许多病原体', 'Many pathogens inhibited')], challenged: t('不是所有病原体都同样怕酸；耐酸者可能通过，这不是无菌保证。', 'Pathogens differ in acid tolerance; some can pass. This is no sterility guarantee.') },
} as const;
export type BarrierSite = keyof typeof barrierSites;
export function barrierSequence(site: BarrierSite, challenged: boolean, frame: number) {
  return { visible: barrierSites[site].steps.slice(0, Math.max(1, Math.min(3, frame + 1))), last: challenged ? barrierSites[site].challenged : barrierSites[site].steps[2], certainInfection: false };
}
export const lifeCycles = {
  butterfly: { name: t('代表蝴蝶', 'Representative butterfly'), stages: [t('卵', 'Egg'), t('幼虫', 'Larva'), t('蛹', 'Pupa'), t('成虫', 'Adult')], link: t('成虫繁殖形成下一代卵；蛹内仍有活跃的发育。', 'Adult reproduction produces eggs of the next generation; active development continues inside the pupa.') },
  frog: { name: t('代表青蛙', 'Representative frog'), stages: [t('受精卵', 'Fertilised egg'), t('蝌蚪', 'Tadpole'), t('幼蛙', 'Froglet'), t('成蛙', 'Adult frog')], link: t('代表水生蝌蚪路线，青蛙物种的生活史并非全部相同。', 'A representative aquatic-tadpole route; frog species do not all share an identical life history.') },
  pea: { name: t('豌豆', 'Pea'), stages: [t('种子', 'Seed'), t('幼苗', 'Seedling'), t('开花植株', 'Flowering plant'), t('果实与种子', 'Fruit and seeds')], link: t('新种子中的胚是下一代；不是原植株变回一颗种子。', 'The embryo in a new seed belongs to the next generation; the parent does not turn back into a seed.') },
  strawberry: { name: t('草莓匍匐茎', 'Strawberry runner'), stages: [t('母株', 'Parent plant'), t('匍匐茎', 'Runner'), t('节上生根', 'Roots at a node'), t('子株', 'Daughter plant')], link: t('这是营养繁殖支路，不经过配子融合；草莓也能开花结种子。', 'This vegetative branch has no gamete fusion; strawberries can also flower and produce seeds.') },
} as const;
export type LifeCycle = keyof typeof lifeCycles;
export function cycleTransition(cycle: LifeCycle, frame: number) {
  const i = Math.max(0, Math.min(3, Math.floor(frame)));
  return { stage: lifeCycles[cycle].stages[i]!, index: i, nextGeneration: cycle === 'pea' ? i === 3 : cycle === 'strawberry' ? i === 3 : false };
}
export function plantReproduction(route: 'flower' | 'runner', compatible: boolean, step: number) {
  const fused = route === 'flower' && compatible && step >= 2;
  return { gameteFusion: fused, newSeed: fused && step >= 3, daughterPlant: route === 'runner' && step >= 3, stalled: route === 'flower' && !compatible && step >= 1 };
}
export const animalCases = {
  frog: { name: t('代表池蛙', 'Representative pond frog'), fertilisation: t('体外：水中', 'External: in water'), development: t('体外：水中', 'Outside: in water') },
  chicken: { name: t('鸡', 'Chicken'), fertilisation: t('体内', 'Internal'), development: t('体外：卵内', 'Outside: inside a laid egg') },
  human: { name: t('人类', 'Humans'), fertilisation: t('体内', 'Internal'), development: t('体内：子宫中', 'Inside: in the uterus') },
} as const;
export type AnimalCase = keyof typeof animalCases;
export function animalDevelopment(kind: AnimalCase, fusion: boolean, step: number) {
  return { ...animalCases[kind], zygote: fusion && step >= 1, embryo: fusion && step >= 2, fetus: kind === 'human' && fusion && step >= 3, offspring: fusion && step >= 4, inheritedSources: fusion ? 2 : 0 };
}
export const changeCards = [
  { title: t('手臂骨长度增加', 'An arm bone increases in length'), answer: 'growth', reason: t('大小的增加是生长证据，不单独说明生殖成熟。', 'An increase in size is growth evidence, not proof of reproductive maturity.') },
  { title: t('生殖系统功能逐步成熟', 'Reproductive function gradually matures'), answer: 'development', reason: t('结构与功能的成熟属于发育；不同个体节奏不同。', 'Maturation of structure and function is development; timing varies.') },
  { title: t('同班同学更高，所以更成熟', 'A taller classmate must be more mature'), answer: 'unsupported', reason: t('仅凭身高不能判断青春期阶段、健康或个人价值。', 'Height alone cannot establish puberty stage, health or personal worth.') },
] as const;
export function targetResponse(signal: boolean, matchingReceptor: boolean) {
  return { specificResponse: signal && matchingReceptor, predictsTiming: false };
}
