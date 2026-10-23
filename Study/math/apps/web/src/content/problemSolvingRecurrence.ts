import { t } from '../model';
const e = (
  i: number,
  targets: string[],
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill: `problem-solving-${i}`,
  sourceLesson: `H28-L0${i}`,
  sourceTask: `H28-L0${i}-Q6`,
  targets,
  focus: t(z, en),
  rationale: t(rz, re),
});
export const problemSolvingRecurrence = [
  e(
    1,
    ['H31-L05-X', 'H38-L01-X'],
    '依赖拆解与独立约束',
    'Dependency decomposition and separate constraints',
    '复用围栏与水箱出口。前者由2x+y=L、正长度和上限构建面积与可行域，再区别可行/全局最优及整数并列；后者逐项构建进水、容量截断、供水、结转与缺口，解释时间先后使总量比较不足以判可行。均要求重新生成模型依赖、量与限制，不只是看先修链接。',
    'Reuse fence and tank exits. The fence constructs area/domain from2x+y=L,positive lengths and a cap,then separates feasibility,global optimality and integer ties. The tank generates inflow,capacity clipping,supply,carry-over and deficits in time order. Both rebuild model dependencies,quantities and constraints rather than merely following prerequisites.',
  ),
  e(
    2,
    ['H35-MAINT-REPRESENTATION-Q1', 'H38-MAINT-REPRESENTATION-Q1'],
    '换横轴、整包逆像与取消分支',
    'Changing axes,whole-pack inverse images and cancellation branches',
    '两新原规则及实际包数费用图需生成需求/包数/人数费用表，交点k3反推全部整数n，分别含取消为{0,7,8}/{0,6,7}。仿射延拓不当实际小数人数，库存覆盖的正活动k0费用不同于取消，丢活动标志使仅k不能决定唯一费。',
    'New rules and actual pack-fee plots require generating demand/pack/person-fee rows and recovering integer n from k3,giving{0,7,8}/{0,6,7} including cancellation. Affine extensions do not authorise fractional people. Active stock-covered k0 has fees unlike cancellation;discarding event status prevents k alone determining a fee.',
  ),
  e(
    3,
    ['H31-L04-X', 'H38-L04-X'],
    '边界、定义域与合法失败',
    'Boundaries,domains and valid failures',
    '复用最值与容量证明。H31须比较包含端点、尖点和开端点未取到界，不把驻点当全结论。H38在全部非负整数C域以首三日必要下界90和可行账本证明充分，C89是域内但缺1的合法失败，不能把仅检查一个可行方案当最小性证明。',
    'The extrema exit checks included endpoints,corners and unattained open-end bounds. The capacity exit proves necessity C≥90 over all nonnegative integers and sufficiency by a complete ledger;C89 is a valid-domain failure missing one unit. Both distinguish boundaries and domain membership from feasibility and complete proofs.',
  ),
  e(
    4,
    ['H31-L04-Q6', 'H37-L03-X'],
    '有效反例与全称主张的限度',
    'Valid counterexamples and limits of universal claims',
    '复用零导数最大值主张及局部贪心最短路主张。前者须给x³0处驻点却非极大的反例；后者须生成非负有向陷阱图的两完整合法路径，局部廉价AB1后总10而AC3后总5。原域和前提均保，明确结论失败而非给无效输入。',
    'One task requests a counterexample to zero derivative implying a maximum:cubic at zero satisfies the premise but lacks a maximum. The other requires legal nonnegative directed paths in a greedy trap:locally cheaper AB1 leads to total ten,while AC3 leads to five. Domain and premises remain valid while the universal conclusions fail.',
  ),
  e(
    5,
    ['H36-L05-X', 'H38-L05-X'],
    '带单位、可行集与条件性报告',
    'Units,feasible sets and conditional reports',
    '复用屋顶净高与终章方案报告。屋顶保米单位、上半截面、完整宽度、H3单点/H4空集及未验证结构；水箱保目录和预算及逐日供水，名义/高用量/长干期给不同可行集，区分模型事实、假设、校准和验证，现实新条件需重算。',
    'The roof report retains metre units,upper cross-section,full widths,H3 singleton/H4 empty cases and unvalidated structural assumptions. The tank report retains catalogue,budget and daily supply while nominal,high-use and dry scenarios change feasible sets. Both separate model facts,assumptions and validation,requiring new evidence/recalculation outside scope.',
  ),
];
