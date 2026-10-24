import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `advanced-equation-${i}`,
  sourceLesson: `H35-L0${i}`,
  sourceTask: `H35-L0${i}-Q6`,
  targets: ['H36', 'H38'].map((u) => `${u}-MAINT-ADVANCED-EQUATION-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const advancedEquationRecurrenceEvidence = [
  e(
    1,
    '原复合域与分支逆序',
    'Original composite domains and inverse branch order',
    '新门槛u≥2/≤−2或u≥1/≤−1与平移复合，亲生原域、值域、两逆及双向验回；域外平方多项式值不补定义。全平方非单射、逆复合逆序、a0公共端点和倒数差异均实际要求。',
    'New thresholds u≥2/≤−2 or u≥1/≤−1 combined with shifts require original domains,ranges,both branch inverses and two-way checks. Polynomial extension values do not restore invalid inputs. Full-square noninjectivity,reverse undoing,a0 endpoints and reciprocal distinctions are required.',
  ),
  e(
    2,
    '递减底的等价与原对数条件',
    'Decreasing-base equivalence and original log conditions',
    '两新半底对数和候选±6/±5仅留正支，分别回两原真数核。半底指数等式仍一对一，不等式翻向生成[3,∞)/(−∞,−2]；b1指数退化而log1未定义，非正底不获全实指数域。',
    'New half-base log sums have candidates±6/±5 but retain only positive branches after checking BOTH original arguments. Half-base exponent equality remains injective,while inequalities reverse to[3,∞)/(−∞,−2]. Base-one exponent degeneracy differs from undefined log base one;nonpositive bases gain no all-real exponent domain.',
  ),
  e(
    3,
    '因式约分与全部周期孔',
    'Factor cancellation and all periodic holes',
    '新商式cos²/(1+sin)及给定二倍角后的(1−cos2θ)/sin，先因式证明再排−π/2+2kπ或kπ。延拓2/0不当原孔值，不能约加减项；有限试角和窗口不作恒等式证明。',
    'New quotients cos²/(1+sin) and the supplied double-angle(1−cos2θ)/sin require factor proofs before excluding−π/2+2kπ or kπ. Extension values two/zero are not original hole values. Additive-term cancellation and finite angle/window checks do not prove identities.',
  ),
  e(
    4,
    '点身份、反射与零倍率的域',
    'Point identity,reflection and domains at zero scaling',
    '实际源抛物线及P/Q生成两新变换：目标(0,−5)/(2,−5)或(−6,8)/(2,8)，水平倍率1/2或2。偶对称使图集重合但点映射反转；一般内层原域不因a0恢复，1/u在b0为空域，在a0且b非零仍有孔。',
    'Actual SOURCE parabola and P/Q require new target points(0,−5)/(2,−5) or(−6,8)/(2,8),with horizontal factors1/2 or two. Even symmetry conceals pointwise reflection. The general inner-input domain is retained at a0:1/u with b0 has empty domain,and with a0/nonzero b still has its hole.',
  ),
  e(
    5,
    '完备候选、增根与丢根',
    'Exhaustive candidates,extraneous and lost roots',
    '每单元四独立方程重建原域与候选；根式域内负候选失败、分式唯一候选落孔给合法空集，零乘积保0，绝对值两支齐全。以包含/等价推出完备而非只代回或看有限图窗。',
    'Four independent equations per unit rebuild original domains and candidate sets. Negative radical candidates fail within domain;the sole rational candidate is a hole,proving emptiness. Zero products preserve zero and absolute values retain both branches. Inclusion/equivalence proves completeness rather than substitution or finite plots alone.',
  ),
];
