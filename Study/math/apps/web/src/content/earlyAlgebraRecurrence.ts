import { t } from '../model';

const structurePair = (n: number) =>
  ['P61', 'P65'].map((unit) => `${unit}-MAINT-FRACTION-STRUCTURE-Q${n}`);
const equationPair = (n: number) =>
  ['P57', 'P65'].map((unit) => `${unit}-MAINT-EQUATION-MEANING-Q${n}`);
export const earlyAlgebraRecurrence = [
  {
    skill: 'unit-fraction-whole',
    focus: t(
      '单位分数、整体与实际量',
      'Unit shares, reference wholes and actual amounts',
    ),
    sourceLesson: 'P53-L01',
    sourceTask: 'P53-L01-Q6',
    targets: ['P61-L03-Q6', 'P62-L01-Q6', ...structurePair(1)],
    rationale: t(
      'P61把12L与6L各等分三份，分别生成4L与2L的单位份额，再取两份得8L与4L；P62把10/40与20/80都化成1/4、25/100，实际标记数仍为10与20。两处区分分数单位、参考整体和带单位实际量，不能用相同涂色比例保证相同数量。新Q1另用实际格号生成不同形状同面积区域，再转移一格反查等分；绳段的比例、份数与实际米数分别生成，含单位分数形式与零分母条件。',
      'P61 partitions twelve and six litres into thirds, obtaining unit shares of four and two litres before selecting two shares. P62 rewrites 10/40 and 20/80 as 1/4 and 25/100 while actual marked counts remain ten and twenty. Both distinguish fraction unit, reference whole and measured amount; the same shaded proportion does not ensure the same quantity. New Q1s generate equal-area regions of different shapes from cell IDs and transfer one cell to test equal shares. Rope proportions, counts and metres are generated separately, including unit-fraction form and invalid zero denominators.',
    ),
  },
  {
    skill: 'equivalent-fraction',
    focus: t(
      '等值分数保留原量',
      'Equivalent fractions retain the original amount',
    ),
    sourceLesson: 'P53-L04',
    sourceTask: 'P53-L04-Q6',
    targets: [
      'P54-L03-Q6',
      'P54-L04-Q6',
      'P62-L01-Q6',
      'P62-L02-Q6',
      ...structurePair(4),
    ],
    rationale: t(
      'P54须把2/3同时扩为8/12、1/4扩为3/12，并用另一共同分母24解释3/4−1/6的同量结果；P62须说明10/40=20/80=1/4=25/100以及375/1000=37.5/100。分子分母共同缩放、整体与所取量不变在两个单元都由解释任务主动重建，不能只改分母。新Q4用原涂色重新细分、分子及分母两类填空、反向分组、1/0倍数条件与开放生成另一等值式；实际整体翻倍时另算升数。',
      'P54 rescales both numerator and denominator of 2/3 and 1/4 to twelfths and explains an alternative denominator of twenty-four for 3/4−1/6. P62 explains 10/40=20/80=1/4=25/100 and 375/1000=37.5/100. Both explanation tasks reconstruct common scaling and conserved amount rather than changing only a denominator. New Q4s repartition original shading, solve both blank roles, reverse grouping, distinguish factors one and zero and generate another valid equivalent fraction. Doubling the actual whole requires recalculating litres.',
    ),
  },
  {
    skill: 'box-unknown',
    focus: t('同一符号保持同一未知量', 'One symbol keeps one unknown value'),
    sourceLesson: 'P55-L01',
    sourceTask: 'P55-L01-Q6',
    targets: ['P65-L01-Q6', 'J73-L02-Q6', ...equationPair(1)],
    rationale: t(
      'P65解释n+n是两个相同的n，并对n=0、−2分别一致代入；J73处理5x+2=2x+11时两边的x都须为同一值3，代回均17。迁移从方框到字母、从一边重复到等式两边重复；换独立赋值可以换值，同一次代入不能把重复符号各挑一个数。新Q1逐行定义未知对象，生成不同位置、重复符号与零解，画图并核原左右值；同和不同值数对不能替代相同方框。',
      'P65 explains that n+n contains two copies of the same n and substitutes zero and negative two consistently in separate cases. J73 uses the same x=3 on both sides of 5x+2=2x+11, obtaining seventeen each. The idea transfers from boxes to letters and from repetition on one side to both sides: independent assignments may differ, but repeated symbols within one assignment may not. New Q1s define every unknown object and generate varied positions, repeated symbols and a zero root with diagrams and original side values. A pair with the correct sum cannot replace identical boxes.',
    ),
  },
  {
    skill: 'equal-sign-relationship',
    focus: t('等号两侧与等值步骤', 'Equality of both sides and valid steps'),
    sourceLesson: 'P55-L02',
    sourceTask: 'P55-L02-Q6',
    targets: ['P65-L04-Q6', 'J73-L02-Q6', ...equationPair(2)],
    rationale: t(
      'P65把2x=10单改为x=10后代回得20≠10，并解释同乘零虽相等却丢约束；J73把“移项”还原为两边同减2x、同减2、同除非零3。两单元都用具体左右值与可逆步骤说明等号的关系含义，不能把它当“接下来算”的箭头。新Q2按原两盘和三个候选重算四种同量操作的差，给单边反例、零候选巧合与第二次去框不足，修正不等值连等式。',
      'P65 rejects changing only 2x=10 to x=10 by checking twenty versus ten, and explains information lost by multiplying both sides by zero. J73 expands transposition into subtracting 2x and two from both sides, then dividing both by nonzero three. Both use actual side values and reversible steps to treat equals as a relationship rather than a next-calculation arrow. New Q2s recompute four common actions for three candidates, compare one-sided counterexamples and a zero-candidate coincidence, refuse a second unavailable box removal and repair unequal chains.',
    ),
  },
  {
    skill: 'pattern-expression',
    focus: t(
      '由构造或完整规则支持一般式',
      'General expressions justified by construction or a complete rule',
    ),
    sourceLesson: 'P55-L03',
    sourceTask: 'P55-L03-Q6',
    targets: ['P65-L02-Q6', 'H07-L01-Q6', 'H07-L01-X', ...equationPair(3)],
    rationale: t(
      'P65由三行各n与固定两块推出3n+2，解释增长三不足以说明总数；H07由首项1及每步2n+1核(n+1)²−n²，支持通项n²，并给前三项相同却第四项不同的两公式。两单元都区分序号、增长、固定项和一般依据，有限试值不替代完整规则。后者是具备先修后从图形构造到递推结构的远迁移。新Q3从实际边集合与两行点写两种一般式，算近远步，核首次偶合与空图边界；有限4/7/10记录另给完整不同续构造。',
      'P65 derives 3n+2 from three rows of n and two fixed blocks, explaining why growth of three alone does not give a total. H07 checks (n+1)²−n² against the given increment 2n+1 and first term one, supporting n², and gives formulas agreeing on three terms but differing on the fourth. Both separate index, increment, fixed information and general justification. The latter is a later transfer from construction to recurrence once prerequisites are in place. New Q3s derive two expressions from actual edges and two-row counters, evaluate near/far steps, test first-term coincidences and the empty-diagram boundary, and supply different complete continuations of a finite 4,7,10 prefix.',
    ),
  },
  {
    skill: 'one-step-equation',
    focus: t(
      '逆运算、精确解与退化边界',
      'Inverse steps, exact solutions and degenerate boundaries',
    ),
    sourceLesson: 'P55-L04',
    sourceTask: 'P55-L04-Q6',
    targets: [
      'P65-L04-Q6',
      'P65-L05-Q6',
      'J73-L01-Q6',
      'J73-L02-Q6',
      ...equationPair(4),
    ],
    rationale: t(
      'P65在3(x+2)=5中执行同除3、同减2的一步逆操作并代回精确−1/3，另解释乘零不保完整解集；J73通过3x=0、矛盾式、恒等式区分唯一零解、无解和全部允许值，并说明非零除数。两处均核原式，不把除零或−0.33近似数当精确求解。新Q4逐种选择有定义的逆操作，精确分数与近似候选代回分开；唯一零、零系数全满足/无解及除零未定义分别说明。',
      'P65 performs individual inverse steps of division by three and subtraction of two in 3(x+2)=5 and checks exact −1/3, while explaining information lost by multiplication by zero. J73 distinguishes unique zero, no solution and all allowed values using 3x=0, a contradiction and an identity, retaining nonzero-divisor conditions. Both check the original relationship rather than allowing division by zero or substituting approximate −0.33 for an exact solution. New Q4s justify defined inverses and distinguish exact fraction substitution from approximate trials, separating unique zero, zero-coefficient all/none and undefined division.',
    ),
  },
  {
    skill: 'equation-story',
    focus: t(
      '先列数量关系，再核情境允许性',
      'Model quantity relationships, then check contextual validity',
    ),
    sourceLesson: 'P55-L05',
    sourceTask: 'P55-L05-Q6',
    targets: ['J73-L05-Q6', 'J83-L05-Q6', ...equationPair(5)],
    rationale: t(
      'J73定义年龄或每袋数量，写x+(x+8)=30或3x+2=20，并区分原建模关系与最后解；J83定义两类票数或升数，写x+y=7及5x+3y=30，代回9/2、5/2后再核完整票数限制。两处都从量名、单位、固定项和范围建立等式，不把解值等式或擅自取整冒充原模型。新Q5从原量、每段长度、钱数与袋外散卡列原模型并核单位，比较同方程的连续长度与不可拆卡数，不用取整改题。',
      'J73 defines ages or bag quantities and forms x+(x+8)=30 or 3x+2=20, distinguishing original modelling relationships from final solutions. J83 defines ticket counts or litres and forms x+y=7 and 5x+3y=30, then checks 9/2 and 5/2 against whole-ticket restrictions. Both build equations from quantities, units, fixed amounts and domains, not from solution statements or arbitrary rounding. New Q5s form original models for originals, per-piece lengths, money and extras outside bags, then contrast continuous length with indivisible cards under the same algebraic equation rather than rounding away the mismatch.',
    ),
  },
];
