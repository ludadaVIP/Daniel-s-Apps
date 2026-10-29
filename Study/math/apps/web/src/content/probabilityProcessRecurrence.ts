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

// Preserve every original task and its primary bridge. Share only genuinely
// common subskills; supplementary task keys never inherit old checked answers.
const supplements = [
  t(
    '复用H33/H34 COUNTING-STRUCTURE-Q4双方向条件与零条件、Q5零A/零F仍按乘积独立的实际任务，原H24-L05/L06主桥不改。新增两单元N1实际列奇偶交集与正概率乘积，并与原Q3可同时发生的独立模型对照；非同义词须给一般正乘积理由。',
    'Reuse H33/H34 COUNTING-STRUCTURE-Q4 directional/zero conditionals and Q5 zero-A/zero-F product independence, preserving their H24-L05/L06 primary bridges. New N1 in two units generates even/odd intersection and positive marginal product, contrasted with old Q3 co-occurring independence, with a general positive-product argument.',
  ),
  t(
    '共享N1亲画一红三蓝/四蓝条件树，区分已知首红的次红0与完整RR0、BB1/2或3/5、各可达节点出枝和1；独立全蓝首红不可能时条件未定义而联合0，不写0乘未定义。原Q1完整树继续用。',
    'Shared N1 draws sole-red/three-or-four-blue trees, distinguishing second red given first red from joint RR, both zero, alongside BB1/2 or3/5 and outgoing sums at reachable nodes. A separate all-blue impossible first-red node has undefined conditional but zero joint mass, never zero times undefined. Retain old Q1 full trees.',
  ),
  t(
    '共享N1由补事件和互斥三路径分别得至少蓝7/10或5/6，区别BB/异色；给同一不放回空间的非平凡A/D实际编号集，交1/12或1/20等于乘积，再与首红/次红不独立对照，不能凭抽取规则判断所有事件。',
    'Shared N1 obtains at least blue7/10 or5/6 by both complement and three disjoint paths, distinguishing BB/different colours. Explicit nontrivial A/D sets in the same no-replacement space have intersection1/12 or1/20 equal to their product, contrasted with dependent first-red/second-red; the rule alone does not classify every event pair.',
  ),
  t(
    '新增N2实算全体与A框比例、改目标为A后适用普查、完整准确全体普查及范围。独立R分开回应率和回答者是比例，Z的0/3回应率为0但0/0是比例未定义；自主设计覆盖/回应/普查三个案例及偶合反例。旧H27逻辑界和H34设计偏差继续保留。',
    'New N2 calculates target/A-frame proportions, a census after retargeting to A and an accurate full census with scope. Separate R distinguishes response rate from respondent yes; Z gives response rate0/3=0 but undefined respondent0/0. Own coverage/nonresponse/census designs and a coincidental-match example complement preserved H27 bounds/H34 design-bias work.',
  ),
  t(
    '新增N3给两种子各12轮固定程序ID原表，亲数10+2不等批累计7/12或5/6，错误均值11/20或9/10；实画前三累计点/零轮无点、末十窗不替全批、追加保前缀/同规则重放、两批都报告不挑选；自主另一袋两规则理论和预定两种子各100轮模板，未生成标待生成，模拟与实测分账。',
    'New N3 supplies fixed twelve-round ID records for each of two seeds: count unequal10+2 batches for7/12 or5/6 rather than wrong averages11/20 or9/10. Draw initial cumulative points, no zero-round point; distinguish latest-ten window/full run, prefix extension/replay and reporting both runs without selection. An own bag requires both-rule theory and two prespecified100-round templates, marking ungenerated data pending and separating simulation from measurements.',
  ),
];
for (const [i, entry] of probabilityProcessRecurrence.entries()) {
  const n = i < 3 ? 1 : i - 1;
  entry.targets.push(
    ...['H24', 'H33'].map((u) => `${u}-MAINT-PROBABILITY-MEANING-Q${n}`),
  );
  if (i === 0)
    entry.targets.push(
      ...['H33', 'H34'].flatMap((u) =>
        [4, 5].map((n) => `${u}-MAINT-COUNTING-STRUCTURE-Q${n}`),
      ),
    );
  entry.rationale = t(
    entry.rationale.zh + ' ' + supplements[i]!.zh,
    entry.rationale.en + ' ' + supplements[i]!.en,
  );
}
