import { t } from '../model';
const pair = (i: number) =>
  ['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-AUDIT-Q${i}`);
const e = (
  skill: string,
  l: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets: pair(i),
  rationale: t(rz, re),
});
export const integrationAuditRecurrence = [
  e(
    'integration-graph-assumptions',
    'J98-L02',
    1,
    '完整规则、离散输入与有限观察',
    'Complete rules, discrete inputs and finite observations',
    '两组实际给完整水量折线，读三段内值7/6/3L或14/12/6L及暂停零率，端点包含、空后域外不延伸。另整包半包虽输出4整数仍不允许；两观测无函数族须给x/x²或2x/2x+(x−1)(x−2)两规则证预测不唯一，坐标率不依图窗。',
    'Both provide actual complete water polylines,requiring segment queries seven/six/three or fourteen/twelve/six litres and a zero-rate pause,with included endpoints and no post-domain extension. Half-pack input remains invalid despite integer output four. Two observations without a function class need two matching rules,x/x² or2x/2x+(x−1)(x−2),to refute uniqueness. Coordinate rates do not depend on viewport.',
  ),
  e(
    'integration-dependent-strategy',
    'J98-L03',
    2,
    '合法依赖而非唯一点击顺序',
    'Valid dependencies rather than one click order',
    'H28矩形x(x+2)=24候选−6/4筛正得4×6周20，H38的x(x+3)=28候选−7/4得4×7周22；另去返总时间均5h、独立总路程12/24km后均速12/5或24/5。须说明可独立准备与不能提前用的结论，保原式/单位/根全集，不强制唯一算法或把卡片顺序当完整证明。',
    'H28 rectangle x(x+2)=24 filters roots−6/four to4×6,perimeter twenty; H38 x(x+3)=28 filters−7/four to4×7,perimeter twenty-two. Separate journeys have total time five hours and independently prepared distances twelve/twenty-four km,giving averages12/5 or24/5. Learners identify independent preparation and conclusions needing inputs,retain originals/units/complete roots,and avoid one mandatory algorithm or card-order-as-proof.',
  ),
  e(
    'integration-reasonableness-audit',
    'J98-L04',
    3,
    '反例否定、条件不足与按前提核验',
    'Refutation, insufficiency and premise-based verification',
    '两组各自行三种审查：平方方程漏−3或零给实际反例；两观察同过却异预测的两完整函数给不唯一，非已证实际输出不同；已知直角5/12/13或矩形3/4/5正长度平方核验但cm²仍单位错。区分反驳/未知/本例核过，不能凭像素或答案像不像。',
    'Each distinguishes three audits: missing−3 or zero is an actual counterexample to a complete root claim; two matching functions with different predictions prove nonuniqueness,not a known actual alternative output; a given5/12/13 right triangle or3/4/5 rectangle verifies positive length but cm² still fails units. Refutation,remaining uncertainty and this verified case differ; pixels and plausible digits are insufficient.',
  ),
];

const bothNew = (n: number) =>
  ['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-MEANING-Q${n}`);
for (const entry of integrationAuditRecurrence) {
  const lesson = entry.sourceLesson;
  if (lesson === 'J98-L02') {
    entry.targets.push(
      ...['H01', 'H02'].map((u) => `${u}-MAINT-FUNCTION-MEANING-Q2`),
    );
    entry.rationale = t(
      entry.rationale.zh +
        ' 复用H01/H02原FUNCTION-MEANING-Q2：自主连续/整包模型，两个非零输入回求系数后核第三零行，亲画有实际单位/每格值的变化三角形，真换时/分与分币并核完整域；原J85-L06主桥保留。',
      entry.rationale.en +
        ' Reuse H01/H02 FUNCTION-MEANING-Q2: own continuous/whole-pack rules, recover coefficients from two nonzero inputs then check a zero third row, draw actual-unit/tick change triangles, convert hours/minutes and cents with full domains. Preserve J85-L06 primary bridges.',
    );
  } else {
    entry.targets.push(...bothNew(1));
    if (lesson === 'J98-L04')
      entry.targets.push(
        ...['H03', 'H04'].map((u) => `${u}-MAINT-ROOT-QUAD-Q3`),
        ...['H22', 'H23'].map((u) => `${u}-MAINT-SIM-CIRCLE-TRIG-Q10`),
        ...['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-AUDIT-Q2`),
      );
    entry.rationale = t(
      entry.rationale.zh +
        ' 共享新N1以完整条件→关系→正长度→原目标核分数矩形与勾股，撤直角给两种合法第三边：原预测未唯一而非必假，全称必然则有反例。L04同时复用H03/H04原精度Q3、H22/H23原坡度/角度Q10和H28/H38原去返依赖Q2，不把合理数量级、近似或部分检查当全通过，旧主桥均保留。',
      entry.rationale.en +
        ' Shared new N1 audits fractional geometry and Pythagoras through premises→relation→positive length→target. Removing the right angle permits two legal third sides: the prediction is not unique rather than necessarily false, while a universal necessity claim is refuted. L04 additionally reuses original H03/H04 precision Q3, H22/H23 grade/angle Q10 and H28/H38 journey Q2. Plausibility, approximation and partial checks do not establish complete verification; all original primary bridges remain.',
    );
  }
}
