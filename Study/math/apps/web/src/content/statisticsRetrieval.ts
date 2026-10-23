import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H34' | 'H38') => {
  const first = unit === 'H34',
    id = (i: number) => `${unit}-MAINT-STATISTICS-Q${i}`;
  const pairs = first
    ? [
        { id: 'A', x: 1, y: 2 },
        { id: 'B', x: 2, y: 6 },
        { id: 'C', x: 3, y: 4 },
      ]
    : [
        { id: 'P', x: -1, y: 3 },
        { id: 'Q', x: 0, y: 1 },
        { id: 'R', x: 1, y: 2 },
      ];
  const pairTable = {
    caption: t(
      '给定虚构同ID配对观测；整行是一个对象',
      'Given fictional same-ID paired observations;one object per row',
    ),
    columns: [t('编号', 'ID'), t('原x', 'Original x'), t('原y', 'Original y')],
    rows: pairs.map((p) => [
      t(p.id, p.id),
      t(String(p.x), String(p.x)),
      t(String(p.y), String(p.y)),
    ]),
  };
  const curve = [-2, -1, 0, 1, 2].map((x, i) => ({
    id: `U${i + 1}`,
    x,
    y: (first ? 1 : 2) * x * x,
  }));
  const picture: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: -3,
      xMax: 3,
      yMin: first ? -1 : -2,
      yMax: first ? 5 : 10,
      xStep: 1,
      yStep: first ? 1 : 2,
    },
    points: curve.map((p) => ({ x: p.x, y: p.y, label: p.id })),
    curves: [],
    caption: t(
      `五个给定原始配对点，编号与原x均保留；没有把y或残差排序，也没有提供残差图。给定坐标：${curve.map((p) => `${p.id}(${p.x},${p.y})`).join('，')}。`,
      `Five given original paired points retain IDs and original x. Neither y nor residuals have been sorted;the residual plot is not supplied. Given coordinates:${curve.map((p) => `${p.id}(${p.x},${p.y})`).join(', ')}.`,
    ),
  };
  const population = first ? [0, 0, 2, 6] : [1, 1, 5, 9];
  const total = first ? 60 : 80,
    responded = first ? 12 : 16,
    yes = first ? 9 : 10;
  const q = (
    i: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `statistics-${i}`, t(sz, se), [
      t(hz, he),
      t(
        '保留对象ID、原配对、设计、分母与适用范围；一般恒等或精确枚举支持理论，少量候选、漂亮图形和有限模拟只作检查。',
        'Retain IDs,original pairs,designs,denominators and scope. General identities or exact enumeration support theory;finite candidates,attractive plots and simulations only check it.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-STATISTICS`,
    unit,
    bridge: 'H27-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), `H27-L0${i}`]),
    ),
    title: t(
      '推断与项目之后，再核统计证据',
      'After inference and projects,recheck statistical evidence',
    ),
    intro: t(
      '五题分次，每次一题；可将计算、画图和报告再拆开。全部人工核验、不计时，允许纸笔。表、图与成员记录均为虚构数学给定；并非家庭真实试用或调查。',
      'Choose one of five tasks per sitting;split calculation,plotting and reporting if useful. All are human-reviewed without a timer;use paper. Every table,plot and member record is a fictional mathematical given,not a family trial or actual survey.',
    ),
    questions: [
      {
        ...q(
          1,
          '保留表中ID，求两列均值、Sxx、Syy、Sxy和Pearson r。整行倒序与只将y升序重配分别会怎样？说明后者改了哪些对象的配对，不能称清理。改单位x′=10+2x、y′=3+4y时求r′与新斜率；若只对x作负比例反射，r怎样变？用一般中心化差说明规则，常数列为什么不是r=0？r能单独推出因果或总体结论吗？',
          'Retain table IDs and find both means,Sxx,Syy,Sxy and Pearson r. Compare reversing whole rows with sorting only y into new pairs:which object pairs change,and why is that not cleaning? Under x′=10+2x,y′=3+4y,find r′ and the new slope. What does a negative rescaling of x do to r? Justify with general centred deviations. Why is a constant column undefined rather than r=0? Can r alone establish causation or a population conclusion?',
          `${first ? '均值x=2、y=4，Sxx=2、Syy=8、Sxy=2，r=2/√16=1/2，原斜率1。只排序y成2,4,6，把B/C的原测量换配，人工r变1。' : '均值x=0、y=2，Sxx=2、Syy=2、Sxy=−1，r=−1/2，原斜率−1/2。排序y成1,2,3改变P/Q/R配对，人工r变1。'}整行重排各和不变。新单位r′仍${first ? '1/2' : '−1/2'}，斜率乘4/2变${first ? 2 : -1}。一般x′=a+bx、y′=c+dy，中心化差乘b,d，Sxy乘bd、平方和乘b²,d²，非零尺度时r′=sign(bd)r；只反射一列则反号，原身份仍须保。零尺度或原常数列使分母0，r未定义，不能填0。相关描述这些配对的线性关系，不能单凭它认证因果、独立性、代表性或范围外预测。`,
          `${first ? 'Means are x2,y4;Sxx=2,Syy=8,Sxy=2,so r=1/2 and slope one. Sorting only y to2,4,6 replaces B/C measurements and creates r=1.' : 'Means are x0,y2;Sxx=2,Syy=2,Sxy=−1,so r=−1/2 and slope−1/2. Sorting y to1,2,3 changes P/Q/R pairings and creates r=1.'} Whole-row reordering preserves the sums. New units retain r=${first ? '1/2' : '−1/2'} while slope scales by4/2 to${first ? 2 : -1}. In general,affine centred deviations scale by b,d;Sxy by bd,and squared sums by b²,d². Nonzero scales give r′=sign(bd)r. One reflected column reverses r without authorising new pairings. A constant column makes the denominator zero,so r is undefined,not zero. Correlation alone establishes neither causation,independence,representativeness nor extrapolation reliability.`,
          '先逐行保配对再中心化；共同重排不改原资料，单列排序会改交积和。',
          'Keep pairs before centring. Reordering whole rows preserves data;sorting one column changes cross-products.',
        ),
        contextTable: pairTable,
      },
      {
        ...q(
          2,
          `使用本题同样完整给出的三行，逐点核候选${first ? 'ŷ=4、ŷ=2x与ŷ=2+x' : 'ŷ=2、ŷ=2−x与ŷ=2−x/2'}的竖直残差和SSE。为什么残差和0或只比这些候选不够证明最优？对任意实a,b完整展开SSE并写非负平方恒等式，给唯一最优a,b和Σxe。若所有x相同，哪些唯一性会失去，原x处最佳预测还存在吗？`,
          `Using the complete three-row table supplied here,check vertical residuals and SSE for${first ? 'ŷ=4,ŷ=2x and ŷ=2+x' : 'ŷ=2,ŷ=2−x and ŷ=2−x/2'}. Why do zero residual sum or these finite candidates not establish optimality? Expand SSE for ALL real a,b as a nonnegative-square identity,give the unique optimum and Σxe. If all x coincide,which uniqueness is lost,and does a best fitted value at that original x remain?`,
          `${first ? '常数4残差−2,2,0，和0、SSE8；2x残差0,2,−2，SSE8；2+x残差−1,2,−1，SSE6，Σe=Σxe=0。全参数SSE=6+3(a+2b−4)²+2(b−1)²，故唯一b=1、a=2，非只有限比选。' : '常数2残差1,−1,0，SSE2；2−x残差0,−1,1，SSE2；2−x/2残差1/2,−1,1/2，SSE3/2，Σe=Σxe=0。SSE=3/2+3(a−2)²+2(b+1/2)²，唯一a=2、b=−1/2。'}平方差额对全部实参数非负，等号条件同时成立才最优；Σe=0单独不约束斜率。残差在原x竖直量y−ŷ，不是到斜线的最短距离。若x恒x0，平方分解只识别a+bx0=均值y，斜率可任意，原x的最佳预测仍唯一为均值；不由此任选一条线作为已识别外推。`,
          `${first ? 'Constant four has residuals−2,2,0,sum zero,SSE8. Line2x has residuals0,2,−2,SSE8. Line2+x has−1,2,−1,SSE6 and Σe=Σxe=0. For all a,b,SSE=6+3(a+2b−4)²+2(b−1)²,uniquely minimised by a=2,b=1.' : 'Constant two has residuals1,−1,0,SSE2. Line2−x has0,−1,1,SSE2. Line2−x/2 has1/2,−1,1/2,SSE3/2 with Σe=Σxe=0. Full SSE=3/2+3(a−2)²+2(b+1/2)²,uniquely minimised by a=2,b=−1/2.'} Nonnegative squared gaps cover every real parameter,with simultaneous equality conditions. Zero residual sum alone leaves slope unconstrained. Residuals are vertical y−ŷ at original x,not shortest distances to a line. Constant x=x0 identifies only a+bx0=mean y:the original fitted value is unique but slope is free,so a chosen line does not identify extrapolations.`,
          '先将每个y−(a+bx)平方再相加；中心化可把位置误差和斜率误差分成两个非负项。',
          'Square each y−(a+bx) before summing. Centring separates level and slope errors into nonnegative terms.',
        ),
        contextTable: pairTable,
      },
      {
        ...q(
          3,
          `图给五个原配对点，拟合线ŷ=${first ? 2 : 4}。逐ID算残差、SSE，亲画残差图并保原x；解释为何r=0和残差和0仍会遗漏曲线。另虚构残差在x=1、2、3分别为±1、±2、±3，这个小扇形提示检查什么，能证明方差、独立或正态假设吗？若另在这五ID中等可能抽一个，事件X=0与Y=0是否独立？最后说明高r或无显眼图案能否保证新数据预测。`,
          `Five original pairs are plotted,with fitted line ŷ=${first ? 2 : 4}. Compute residuals by ID and SSE,then draw a residual plot at ORIGINAL x. Why can r=0 and zero residual sum coexist with missed curvature? A separate fictional residual display has±1 at x=1,±2 at2 and±3 at3:what should it prompt checking,and does it prove variance,independence or normal assumptions? In a separate uniform draw of one of these five IDs,are X=0 and Y=0 independent? Can high r or no obvious pattern guarantee new-data prediction?`,
          `${first ? '残差2,−1,−2,−1,2，和0、SSE14。' : '残差4,−2,−4,−2,4，和0、SSE56。'}原x仍−2,−1,0,1,2，不能将残差排序后再赋x。Sxy=0且两列变异非零，所以r=0，线性斜率0却有两端正、中间负的弯曲。另小扇形只提示检查散布随x变化、单位、分组或遗漏因素，不证明生成机制、独立、恒方差或正态。辅助等可能ID实验中P(X=0)=P(Y=0)=1/5、交集1/5≠1/25，故不独立，r=0不保证独立。真实预测还需原身份/设计/测量/依赖、异常与适用范围及独立新资料检验，有限图形无明显模式不构成认证，也不推出因果。`,
          `${first ? 'Residuals2,−1,−2,−1,2 sum to zero with SSE14.' : 'Residuals4,−2,−4,−2,4 sum to zero with SSE56.'} Their x remain−2,−1,0,1,2;sorting residuals changes the diagnostic. Here Sxy=0 with nonconstant columns,so r=0,but the systematic positive ends/negative middle reveal missed curvature. The separate small fan prompts checking changing spread,units,groups or omissions;it does not prove a mechanism,independence,constant variance or normality. In the auxiliary uniform-ID experiment,P(X=0)=P(Y=0)=1/5 while their intersection is1/5,not1/25,so dependence coexists with zero correlation. Prediction additionally needs identity,design,measurement,dependence,outliers,range and independent new-data checks. Neither high r nor an apparently patternless finite plot certifies reliability or causation.`,
          '残差点横坐标仍是原对象x；有向误差和0不会消除平方和或系统图案。',
          'A residual point retains its original object’s x. Zero signed-error sum removes neither squared error nor systematic patterns.',
        ),
        diagram: picture,
      },
      {
        ...q(
          4,
          `表是完整四编号演示总体。每轮简单随机不放回抽2人，轮后恢复全体；列全六个同权样本及均值，再给均值分布的期望、方差（按理论概率加权）和总体均值/方差。比较n1、n4及固定只选A,B的设计：方差0为何不保证好？改变n与只增加重复轮数R各改变什么，种子固定又能证明什么？普查修复所有误差吗？`,
          `The table is a complete four-ID demonstration population. Each round takes a simple random sample of two without replacement,then resets the population. List all six equally likely samples/means and the probability-weighted expectation/variance of the mean,plus population mean/variance. Compare n=1,n=4 and always choosing A,B. Why need zero variance not imply a good estimator? Distinguish changing n from increasing repetitions R,and explain what a fixed seed proves. Does a census repair every error?`,
          `${first ? '总体均值2、方差6。AB0、AC1、AD3、BC1、BD3、CD4，各1/6；均值分布0,1,3,4的概率1/6,1/3,1/3,1/6，期望2、方差2。n=1方差6，n=4方差0。固定AB均值0、方差0却偏差−2。' : '总体均值4、方差11。AB1、AC3、AD5、BC3、BD5、CD7，各1/6；均值分布1,3,5,7概率1/6,1/3,1/3,1/6，期望4、方差11/3。n=1方差11，n=4方差0。固定AB均值1、方差0却偏差−3。'}重复数只改善固定设计分布的经验频率估计，不改理论分布或设计偏差，不要求每次更靠近。n改变可能样本及理论分布；同值不同ID仍是不同样本。种子固定只使模拟可重现，不证明无偏、独立或理论等式。这里精确枚举才给概率，组内无放回、组间重置。普查去本模型抽样变异，不自动修复缺失、测量或定义问题；概率方差不用样本n−1。`,
          `${first ? 'Population mean two,variance six. Samples AB,AC,AD,BC,BD,CD have means0,1,3,1,3,4,each probability1/6. Grouped masses are1/6,1/3,1/3,1/6 at0,1,3,4;expectation two,variance two. At n1 variance six;at n4 zero. Fixed AB has mean zero,variance zero and bias−2.' : 'Population mean four,variance eleven. AB,AC,AD,BC,BD,CD give1,3,5,3,5,7,each1/6. Masses1/6,1/3,1/3,1/6 at1,3,5,7 give expectation four,variance11/3. At n1 variance eleven;at n4 zero. Fixed AB has mean one,variance zero and bias−3.'} Repetition count R only improves empirical frequency estimation for the fixed design;it changes neither theory nor bias and need not improve every next estimate. Sample size changes possible samples and their distribution. Equal values at different IDs remain different samples. A fixed seed provides reproducibility,not proof of independence,unbiasedness or theory. Exact enumeration supplies probabilities here,with within-round nonreplacement and between-round reset. A census removes this sampling variation,not missingness,measurement or definition errors. These are probability variances,not sample n−1 estimates.`,
          '先按身份列样本，再按均值合并概率；理论分布方差与有限模拟波动分开。',
          'Enumerate samples by identity before grouping equal means. Separate theoretical variance from finite simulation fluctuation.',
        ),
        contextTable: {
          caption: t(
            '完整虚构四成员总体；相同值不合并身份',
            'Complete fictional four-member population;equal values retain distinct IDs',
          ),
          columns: [t('编号', 'ID'), t('给定数值', 'Given value')],
          rows: population.map((v, i) => [
            t(String.fromCharCode(65 + i), String.fromCharCode(65 + i)),
            t(String(v), String(v)),
          ]),
        },
      },
      {
        ...q(
          5,
          `目标${total}名固定成员，只有${responded}名不同成员自愿回应，其中${yes}个是；未回应者的二元结果未知。报告回应比例、总体可能比例的完整逻辑界并说明两端可达到；为何不是置信区间？再比较两张另设研究卡：①覆盖全体的适当随机抽样且回应完整；②只在志愿者中随机分配两种活动。各能支持什么、还要哪些条件，能否互换“随机”的作用？高r、小训练SSE或很多模拟轮次能补回什么未知吗？`,
          `Of${total} fixed target members,${responded} distinct volunteers respond and${yes} answer yes;all other binary outcomes are unknown. Report the responder proportion and complete logical population bounds,showing both endpoints attainable. Why are these not confidence intervals? Compare separate study cards:(1)proper random sampling covering the target with complete response;(2)random assignment of two activities among volunteers. What can each support,under which conditions,and may their uses of randomness be exchanged? Do high r,small training SSE or many simulation repetitions recover the missing information?`,
          `${first ? '回应9/12=3/4，未知48人，总体下界9/60=3/20，上界(9+48)/60=19/20。' : '回应10/16=5/8，未知64人，总体下界10/80=1/8，上界74/80=37/40。'}未知者全否则下界、全是则上界，二元计数令中间可行比例按1/N离散，区间给外包界，不是连续每个实比例都可实现。这是固定未知值的逻辑范围，不含随机覆盖水平，故非置信区间；未知不记否。卡①在抽样框、回应和测量等条件下支持带抽样不确定性的目标推断，样本比例不等真值；卡②在依从、无干扰、可靠测量等条件下支持参与者的活动效果比较，不自动推广目标全体。观察相关不作因果；数值好看或R大不修复选择、配对、缺失、混杂、依赖、范围和独立验证限制。`,
          `${first ? 'Observed9/12=3/4,with48 unknowns;population bounds9/60=3/20 to57/60=19/20.' : 'Observed10/16=5/8,with64 unknowns;bounds10/80=1/8 to74/80=37/40.'} All unknowns no/yes attain the endpoints. Possible binary proportions lie on the1/N grid:the interval bounds them but does not make every real value attainable. This is a logical range for fixed unknown outcomes,not a random-coverage confidence interval;unknown is not no. Card1 can support uncertain target inference under proper frame,response and measurement conditions;the sample proportion is not the true parameter. Card2 can support participant activity-effect comparisons under compliance,no interference and reliable measurement,without automatic target-wide generalisation. Observational correlation is not causation. High r,small training SSE or large R repair none of the selection,pairing,missingness,confounding,dependence,range or independent-validation limitations.`,
          '把已是、已否、未知分开；随机抽样管代表范围，随机分配管参与者处理比较，条件各自核。',
          'Separate known yes,known no and unknown. Random sampling concerns target inference;random assignment concerns participant treatment comparisons,each with its own conditions.',
        ),
        contextTable: {
          caption: t(
            '虚构固定总体的已知/未知计数；非真实调查',
            'Fictional fixed-population known/unknown counts;not an actual survey',
          ),
          columns: [
            t('状态', 'Status'),
            t('不同成员数', 'Distinct member count'),
          ],
          rows: [
            [t('已回应且是', 'Responded yes'), t(String(yes), String(yes))],
            [
              t('已回应且否', 'Responded no'),
              t(String(responded - yes), String(responded - yes)),
            ],
            [
              t('结果未知', 'Outcome unknown'),
              t(String(total - responded), String(total - responded)),
            ],
            [t('目标合计', 'Target total'), t(String(total), String(total))],
          ],
        },
      },
    ],
  };
};
export const statisticsRetrieval = {
  H34_STATISTICS: makeSet('H34'),
  H38_STATISTICS: makeSet('H38'),
};
