import { t } from '../model';
const pair = (i: number) =>
  ['H24', 'H33'].map((u) => `${u}-MAINT-PROB-PROCESS-Q${i}`);
const e = (
  skill: string,
  l: string,
  targets: string[],
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets,
  rationale: t(rz, re),
});
export const probabilityProcessRecurrence = [
  e(
    'probability-independence-product',
    'J97-L01',
    pair(3),
    '全模型乘积与样本吻合的不同',
    'Full-model product versus a matching sample',
    'H24由12等权编号格2/2/4/4算交1/6=1/3×1/2，H33由20格3/2/9/6算3/20=1/4×3/5，四类非等权。另各有限观察表恰吻合乘积仍不证真实独立；一次偏离也不证装置坏，模型全空间与样本/总体身份明确。',
    'H24 calculates 1/6=1/3×1/2 from twelve equiprobable IDs with category counts 2/2/4/4; H33 calculates 3/20=1/4×3/5 from twenty IDs with counts 3/2/9/6. Categories are not equiprobable. Each also audits a matching finite observed table as insufficient for real independence, while a mismatch alone does not prove a faulty device.',
  ),
  e(
    'probability-conditional-product',
    'J97-L02',
    pair(1),
    '每支剩余袋与互斥路径和',
    'Remaining bag on each branch and disjoint-path sums',
    '两组亲画放回/不放回两层树，3红2蓝给RR3/10、RB/BR各3/10，2红2蓝给RR1/6、RB/BR各1/3。第一颜色后重数第二袋分母与分子，异色为两条互斥顺序之和3/5或2/3，不把四字母串平均或复用放回分母。',
    'Both draw replacement/no-replacement trees. Three red/two blue gives RR3/10 and RB/BR3/10 each; two red/two blue gives RR1/6 and RB/BR1/3 each. Second-bag counts change after the first colour. Different colours sum two disjoint orders to 3/5 or 2/3 rather than averaging colour strings or retaining replacement denominators.',
  ),
  e(
    'probability-without-ordered-pairs',
    'J97-L03',
    pair(1),
    '完整编号格、对角排除与一致顺序',
    'Complete ID grids, diagonal removal and consistent order',
    'H24编号格放回25、不放回20，颜色计数9/6/6/4与6/6/6/2；H33为16/12格，颜色4/4/4/4与2/4/4/2。实际生成格并排同编号对角线，R1R2与R2R1各保，不混无序分子和有序分母；H33放回颜色等权只是本袋特例。',
    'H24 generates twenty-five/twenty ID cells with colour counts 9/6/6/4 and 6/6/6/2; H33 generates sixteen/twelve cells with counts 4/4/4/4 and 2/4/4/2. Same-ID diagonals are removed, reverse orders remain distinct and unordered numerators cannot use ordered denominators. Equal replacement colour weights in H33 are only a special case.',
  ),
  e(
    'probability-frame-response-bias',
    'J97-L04',
    ['H27-L05-X', 'H34-L01-Q6', 'H34-L01-X'],
    '一次结果、设计偏差与未回答',
    'One result, design bias and nonresponse',
    'H27对200人20回应15是须报本次75%及总体逻辑界15/200..195/200，未回应不记否，并区分随机抽样/分配与总体范围。H34以六编号0/6模型具体比较本次误差、完整框期望及只A框恒0偏差，框内扩样不补遗漏；偶然恰值不认证设计无偏。',
    'H27 requires observed 75% from fifteen yes among twenty responses out of two hundred, logical population bounds 15/200..195/200 and no coding nonresponse as no, with sampling/allocation and generalisation separated. H34’s six-ID zero/six model compares single error, full-frame expectation and A-only constant-zero bias; larger within-frame samples cannot repair omissions and one exact result cannot certify unbiased design.',
  ),
  e(
    'probability-simulation-theory',
    'J97-L05',
    pair(2),
    '完整轮次、恢复与有限模拟',
    'Complete rounds, restoration and finite simulation',
    '两组轮内移球、轮后恢复原袋，理论异色3/5或2/3；虚构模拟4/5再5/6、5/6再6/7，整数通分比较到理论距离反而增大。分母完整两抽轮而非抽数，0轮未定义；不恢复改变重复模型，标种子有限伪随机不当真实装置资料或理论证明。',
    'Both remove within rounds and restore the original bag between rounds, with theory 3/5 or 2/3. Fictional simulation changes 4/5 to 5/6 or 5/6 to 6/7; exact denominator comparisons show greater distance from theory. Frequencies use complete two-draw rounds, zero rounds are undefined and never restoring changes the repeated process. Labelled finite seeded simulation is neither real-device evidence nor a theory proof.',
  ),
];
