import { t } from '../model';
const pair = (i: number) =>
  ['J93', 'J94'].map((u) => `${u}-MAINT-REASONS-Q${i}`);
const e = (
  skill: string,
  z: string,
  en: string,
  l: string,
  targets: string[],
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
const originalGeometryGraphRecurrence = [
  e(
    'geometric-objects-and-angle',
    '点线射线、角与不变量',
    'Points, lines, rays, angles and invariants',
    'J74-L01',
    pair(1),
    'J93画AB四种对象及∠COD37°，J94画PQ及∠RST128°。两处都标端点、无限方向、射线反序与角中间顶点，解释点无大小、屏幕裁切非端点、同向延长和整体旋转保角，不只认名称。',
    'J93 draws four AB objects and angle COD37°; J94 uses PQ and RST128°. Both label endpoints, infinite directions, reversed rays and middle-letter vertices, distinguishing geometric points from ink, clipping from endpoints and angle invariance under extension/rotation rather than merely naming objects.',
  ),
  e(
    'vertical-and-adjacent-angles',
    '对顶、邻补与反例',
    'Vertical/adjacent supplementary angles and counterexamples',
    'J74-L02',
    pair(2),
    'J93从交角42°求138/42/138，J94从57°求123/57/123；都须画两条真直线与反向射线，由两个180°和同减共同角证明对顶相等，并给互补非邻接、相等非对顶反例。',
    'J93 derives 138/42/138 from a 42° crossing and J94 123/57/123 from 57°. Both draw actual straight lines and opposite rays, prove vertical equality by subtracting a common angle from two 180° sums and give supplementary-nonadjacent and equal-nonvertical counterexamples.',
  ),
  e(
    'parallel-conditions-and-pairs',
    '平行前提、角对与逆判',
    'Parallel premises, angle pairs and converse criteria',
    'J74-L03',
    pair(3),
    '两组Q3具体定位上右θ、下右α、上左下β、上右下γ，分别从52°或68°核同位、内错、同旁内；删平行后只保同交点对顶/邻补，α不定；反向用指定同位相等判平行并说明不许循环。',
    'Both Q3 tasks fix upper top-right θ, lower top-right α, upper bottom-left β and bottom-right γ, starting at 52° or 68°. They justify corresponding, alternate and same-side pairs, retain only local vertical/straight relations after removing parallelism and use the specified corresponding equality conversely without circular reasoning.',
  ),
  e(
    'triangle-sum-with-reasons',
    '辅助平行线与三角形内外角',
    'Auxiliary parallels and triangle interior/exterior angles',
    'J74-L04',
    pair(4),
    'J93由A48、B67推C65、外角115，J94由38、79推C63、外角117。两处强制过C作AB平行线，标内错角组成平角，再比较两个180°和推出外角，不能只代背出的内角和。',
    'J93 derives C65° and exterior115° from A48°,B67°; J94 derives C63°,exterior117° from 38°,79°. Both construct through C a parallel to AB, identify alternate angles making a straight angle and compare two 180° sums for the exterior theorem, rather than merely substituting a memorised sum.',
  ),
  e(
    'triangle-class-and-existence',
    '严格存在条件与双重分类',
    'Strict existence and two classification axes',
    'J74-L05',
    pair(5),
    'J93固定4、7给3<c<11，J94固定5、9给4<c<14，都解释端点退化、核三条边不等式、给不等边例，并用45/45/90同时等腰直角及至少两边相等定义解释等边包含。先验存在而非给假三角形贴名称。',
    'J93 derives 3<c<11 for fixed sides four/seven and J94 4<c<14 for five/nine. Both explain degenerate endpoints, check all inequalities, classify a scalene example and use 45/45/90 for simultaneous isosceles/right classifications and equilateral inclusion under the at-least-two-equal definition. Existence precedes classification.',
  ),
  e(
    'linked-geometrical-reasons',
    '已知、辅助构造与完整理由链',
    'Givens, auxiliary constructions and linked reasons',
    'J74-L06',
    [...pair(3), ...pair(4), ...pair(5), 'J86-L06-Q6'],
    '两组Q3区分局部条件与缺失的平行前提、明确逆判不循环；Q4必须写辅助平行→内错角→平角→内角和→外角的完整链；Q5先排退化存在失败。J86进一步逐条列公共边、构造、全等判据及对应结论。实际生成论证，不把卡片顺序正确当自由证明完成。',
    'Both Q3 tasks distinguish local facts from missing parallel premises and prevent circular converses. Q4 requires a full chain from auxiliary parallel through alternate and straight angles to the interior sum and exterior theorem, while Q5 excludes degenerate nonexistence first. J86 further enumerates common sides, constructions, congruence criteria and corresponding conclusions. These generate arguments rather than treating card order as completed free proof.',
  ),
  e(
    'ordered-cartesian-position',
    '有序坐标、象限与轴',
    'Ordered coordinates, quadrants and axes',
    'J75-L01',
    pair(6),
    'J93主动描P(−6,3/2)、Q(0,−1)，J94描P(−3/2,6)、Q(−1,0)，都说明x先y后、四象限符号、零坐标与原点不属象限，交换P两项变第四象限另点，改变视窗不改数据。',
    'J93 plots P(−6,3/2),Q(0,−1); J94 plots P(−3/2,6),Q(−1,0). Both explain x-before-y, all quadrant signs, axis/origin exclusions, a distinct quadrant-IV point after swapping entries and unchanged data under window changes.',
  ),
  e(
    'coordinate-plot-and-scale',
    '按各轴刻度描点并投影读回',
    'Plotting by axis-specific scales and reading projections',
    'J75-L02',
    pair(6),
    'J93横格2纵格1/2，P须左3格上3格却坐标−6、3/2；J94横格1/2纵格2，同样格数却坐标−3/2、6。两处亲画投影读回及轴上Q，分格数、单位数与显示像素，不仅说出给定坐标。',
    'J93 uses horizontal intervals two and vertical halves: three left/three up gives (−6,3/2). J94 reverses scales for (−3/2,6) with the same cell counts. Both explicitly draw, project back and plot an axis point, distinguishing cells, units and pixels rather than copying the supplied pair.',
  ),
  e(
    'same-row-table-points',
    '同行配对、连线与输入域',
    'Paired rows, connections and input domains',
    'J75-L03',
    [...pair(7), 'J88-L03-Q6'],
    'J93由完整水量规则生成(0,12)/(2.5,7)/(6,0)，J94由摄氏规则生成(0,−3)/(2,0)/(4,3)，都按同行点作图、给定连续规则才域内连线，整卡输入只画整数点。J88进一步解释分列排序毁掉记录配对、缺失不补零、无直线趋势不等于无关系。',
    'J93 generates paired water rows (0,12),(2.5,7),(6,0); J94 temperature rows (0,−3),(2,0),(4,3). Both graph paired points, justify continuous connections only from supplied rules and restrict card counts to integer points. J88 further explains destroyed pairing after separate sorts, missing values not being zeros and no linear trend not meaning no relationship.',
  ),
  e(
    'affine-rate-and-intercept',
    '变化率、截距与规则依据',
    'Rate, intercept and rule evidence',
    'J75-L04',
    [...pair(7), 'J85-L05-Q6'],
    'J93解释V=12−2t的−2L/min和12L，J94解释T=−3+1.5t的1.5°C/h和−3°C，非零截距均非正比例；两处解释m=0常数在J75广义与J85一次约定中的区别，有限观测不能证明未给规则。J85另比较2x、2x+3、常数及x²。',
    'J93 explains −2L/min and twelve litres in V=12−2t; J94 explains 1.5°C/h and −3°C in T=−3+1.5t. Nonzero intercepts prevent direct proportion. Both distinguish zero-slope constants under the J75 and J85 conventions and reject proving an unspecified rule from finite observations; J85 further contrasts 2x,2x+3,constants and x².',
  ),
  e(
    'contextual-graph-domain',
    '现实变量的单位、范围与局部模型',
    'Units, domains and local contextual rules',
    'J75-L05',
    [...pair(7), 'J85-L06-Q6', 'J98-L05-Q6'],
    'J93核水0至6min连续、排空后负量域外及卡片整数；J94核0至4h摄氏负读数有效与整卡离散。两处给率/初值单位、同一关系的显示变换与有限观测范围。J85核固定费/排空/整包，J98核只改宽与统一缩放各约束是否仍成立，不将代数可算当情境可用。',
    'J93 checks continuous water time zero to six, negative amounts outside the domain and integer cards. J94 checks valid negative Celsius readings on zero-to-four hours versus discrete cards. Both retain rate/initial units, display-versus-rule changes and finite scope. J85 checks fixed fees, emptying and whole packs; J98 checks constraints under width-only versus uniform scaling, distinguishing algebraic outputs from admissibility.',
  ),
  e(
    'sample-population-and-frame',
    '总体、抽样框、方法与单次样本',
    'Population, frame, method and one realised sample',
    'J76-L01',
    ['J97-L04-Q6', 'H27-L04-Q6', 'H34-L01-Q6'],
    'J97解释八张卡恰一半不能认证覆盖与每次代表；H27用目标均值2、固定选A/B均值0说明重复便利设计方差0仍有偏；H34明确一次误差0不同于设计期望无偏，并要求目标总体、抽样框、未响应和测量。复现方法、覆盖、样本波动与结论范围，不以大样本或一次接近认证代表性。',
    'J97 explains why eight cards with exactly half successes do not certify coverage or every realised sample. H27 contrasts target mean two with fixed A/B mean zero: repeated zero-variance selection can stay biased. H34 separates one zero error from design-unbiased expectation and explicitly checks population, frame, nonresponse and measurement. These retrieve method, coverage, sampling variability and scope rather than certifying representativeness from size or one close result.',
  ),
  e(
    'distribution-centre-spread-shape',
    '中心、分散、形状与图示范围',
    'Centre, spread, shape and graphical scope',
    'J76-L02',
    ['J88-L02-Q6', 'H08-L02-Q6', 'H33-L05-Q6'],
    'J88在同中位5下比较极差A26>B10而IQR(A)=3/2<IQR(B)=7，必须指明指标、保尾值和共同数轴；H08以0,0,0,4,4,4对称却双峰反驳正态套用；H33说明组距改外观、有限频率和模型假设不同。不能把同中心、对称或好看图形当相同分布或普遍机制。',
    'J88 compares equal medians five but range A26>B10 and IQR A3/2<B7, requiring named metrics, retained tails and a common axis. H08 uses symmetric yet bimodal 0,0,0,4,4,4 to refute an automatic normal assumption. H33 distinguishes bin-dependent appearance, finite frequencies and model conditions. Equal centres, symmetry or attractive graphs do not establish identical distributions or mechanisms.',
  ),
  e(
    'mean-and-unusual-record',
    '异常记录、摘要重算与保留',
    'Unusual records, recomputed summaries and retention',
    'J76-L03',
    ['J91-MAINT-PRIMARY-Q6', 'J92-MAINT-PRIMARY-Q6', 'J88-L02-Q6'],
    'J91核10改40后均值5到10、中位5，再独立改原尾0后中位3；J92核11改41后均值4到9、中位4，再独立改0后中位3/2、唯一众数0。两处保六条记录，说明核实异常不能为好看删除，中位数并非永不变；J88另核保30的极差/IQR指标差异。',
    'J91 changes ten to forty for mean five→ten with median five, then separately changes the original tail to zero for median three. J92 changes eleven to forty-one for mean four→nine with median four, then separately to zero for median 3/2 and only mode zero. Both retain six records, reject deleting verified extremes for appearance and show the median can change. J88 further retains thirty while distinguishing range and IQR.',
  ),
  e(
    'complete-equally-likely-space',
    '编号基本结果与事件权重',
    'Numbered elementary outcomes and event weights',
    'J76-L04',
    [...pair(8), 'J97-L03-Q6', 'H24-L01-Q6', 'H24-L04-Q6'],
    'J93树任务强制算3红2蓝放回25/不放回20编号有序对及颜色9/6/6/4与6/6/6/2权重；J94用2红1蓝得9/6对及4/2/2/1与2/2/2/0。两处不合并不同编号/先后、不把颜色名数当分母，J97/H24另核受限列举及硬币串等可能而计数类不等权。',
    'J93 requires twenty-five/twenty numbered ordered pairs with colour weights 9,6,6,4 versus 6,6,6,2 for three red/two blue. J94 uses nine/six pairs with 4,2,2,1 versus 2,2,2,0 for two red/one blue. Both retain identity/order and reject category-count denominators. J97/H24 further check constrained enumeration and equiprobable coin strings versus unequally weighted head-count classes.',
  ),
  e(
    'conditional-two-step-tree',
    '条件分支、路径与试验重置',
    'Conditional branches, paths and trial resets',
    'J76-L05',
    [...pair(8), 'J97-L02-Q6'],
    '两组Q8必须亲画放回/不放回两棵树、逐支写条件分母、沿路乘、互斥路相加核1；J93不放回RR3/10而非9/25，J94抽唯一蓝后BB0不属可发生空间。都区分编号路径与颜色合并，轮内移走、轮间恢复及有限记录不保证补偿。',
    'Both Q8 tasks explicitly draw replacement/no-replacement trees, label conditional denominators, multiply along paths and add disjoint paths to one. J93 obtains no-replacement RR3/10 rather than 9/25; J94 excludes BB after the only blue ball is removed. Both distinguish numbered paths from colour groups, remove within rounds, restore between rounds and reject compensation guarantees.',
  ),
];

export const geometryGraphRecurrence = originalGeometryGraphRecurrence.map(
  (entry) => {
    if (entry.sourceLesson.startsWith('J76-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1;
      const cards = [1, 2, 2, 3, 3][i]!;
      const extra =
        i === 1
          ? ['H27-MAINT-DATA-LANGUAGE-Q2', 'H34-MAINT-DATA-LANGUAGE-Q2']
          : i === 4
            ? ['J97-L03-Q5']
            : [];
      if (!cards) return entry;
      const details = [
        [
          '新两Q1分S/R/E独立案例，主动算样本1/6、均值分别5min/6min、未测补全导致不同总体均值；回答率5/8或3/5与回答者是3/5或1/3分开；设计前提下粗估20/30人非普查。',
          'Both new Q1s separate S/R/E cases, computing sampling fraction 1/6, sample means five/six minutes and distinct population completions; response fractions 5/8 or 3/5 differ from respondent-yes 3/5 or 1/3. Design-based rough estimates twenty/thirty are not census facts.',
        ],
        [
          '新两Q2画原四ID同中心不同分布及原B逐条+3/−1平移，同轴求均值/中位/极差、频数，辨零极差/未观察均值。直接复用H27/H34原Q2四ID图的开闭区间计数，不重复造题。',
          'Both new Q2s plot four-ID equal-centre distributions and translate original B by +3/−1 on common axes, recomputing mean/median/range/frequency and distinguishing zero range and unobserved means. Reuse the existing H27/H34 four-ID open/closed interval counts without new questions.',
        ],
        [
          '新共享Q2的自创分支保原B四ID，只改一条并主动重算均值/中位数，以总和变化除4核均值变化；既有J91/J92的六条记录与零尾/真实异常任务完整保留。',
          'Shared new Q2’s creative branch retains four original B IDs, changes one and recomputes mean/median, checking mean change as total change divided by four. Existing J91/J92 six-record zero-tail and verified-extreme tasks remain intact.',
        ],
        [
          '新两Q3各逐条列完整放回/不放回有序编号空间，分别9/6与16/12条，主动生成事件ID子集并核等权基本结果与颜色权重；不以总数代完整列举。',
          'Both new Q3s list EVERY replacement/no-replacement ordered ID outcome, nine/six or sixteen/twelve, construct favourable ID subsets and distinguish equal basics from colour weights. Totals alone do not meet the listing requirement.',
        ],
        [
          '新共享Q3分别按完整ID、RR补事件与互斥三路径算至少一蓝，并对照恰一次：J93放回8/9与4/9、不放回1与2/3；J94放回3/4与1/2、不放回5/6与2/3。保J97原Q5至少一蓝7/10，旧树Q8继续核完整条件树。',
          'Shared new Q3s use complete IDs, the RR complement and disjoint paths for at least one blue versus exactly one: J93 replacement 8/9 versus 4/9, no replacement one versus 2/3; J94 replacement 3/4 versus 1/2, no replacement 5/6 versus 2/3. Retain original J97 Q5’s 7/10 and existing Q8s for complete conditional trees.',
        ],
      ][i]!;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J93', 'J94'].map(
            (u) => `${u}-MAINT-INFERENCE-MEANING-Q${cards}`,
          ),
          ...extra,
          ...(i === 4
            ? [
                'J93-MAINT-INFERENCE-MEANING-Q2',
                'J94-MAINT-INFERENCE-MEANING-Q2',
              ]
            : []),
        ],
        rationale: t(
          `${entry.rationale.zh} ${details[0]}${i === 4 ? ' 新Q2另自创八ID总体/受限框、两组同均值异极差图并改一条记录重算摘要，承接源家庭纸上任务，不当真实调查。' : ''}`,
          `${entry.rationale.en} ${details[1]}${i === 4 ? ' New Q2 also creates an eight-ID population/restricted frame, equal-mean different-range plots and a one-record summary recalculation, retrieving the source paper family task without claiming a real survey.' : ''}`,
        ),
      };
    }
    if (entry.sourceLesson.startsWith('J75-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1;
      if (i === 4)
        return {
          ...entry,
          targets: [
            ...entry.targets,
            'J93-MAINT-CARTESIAN-MEANING-Q3',
            'J94-MAINT-CARTESIAN-MEANING-Q3',
          ],
          rationale: t(
            `${entry.rationale.zh} J93新Q3另给摄氏T=−5+2t、连续0至3h，主动算一小时−3°C、画端点(0,−5)/(3,1)并举域外时刻，解释负摄氏有效而水量负值无效；与J94原Q7共同复现此具体边界。两新Q3另独立自创有限匀速排水与整数卡片费模型，各三行表、标轴图、允许域与域外例，补主动创作而非只读给定模型。`,
            `${entry.rationale.en} New J93 Q3 separately supplies Celsius T=−5+2t on continuous zero-to-three hours: calculate −3°C at one hour, draw endpoints (0,−5)/(3,1), give an out-of-domain time and explain valid negative Celsius versus invalid negative volume. Together with original J94 Q7 this retrieves that specific boundary. Both new Q3s also require self-created finite-time draining and whole-card cost models, each with three rows, labelled plots, domains and invalid-input examples, retrieving creation as well as interpretation.`,
          ),
        };
      const cards = [[1], [1], [3], [2, 3], []][i]!;
      const details = [
        [
          '新Q1从原点外P分别走横纵/纵横两路，数对槽不交换；保持原位置换m/cm单位则数值换算，只改显示时原数对不变。',
          'New Q1 starts from non-origin P and constructs both route orders without swapping slots; changing m/cm units converts values for the same location, while display-only changes preserve the pair.',
        ],
        [
          '新Q1分别从原P平移得(−7/2,1)/(−1,7/2)，独立x轴反射得(−6,−3/2)/(−3/2,−6)且二次回原；另生成(200,300)cm并对比只改显示刻度仍(2,3)m。',
          'New Q1 independently translates original P to (−7/2,1)/(−1,7/2), reflects it in x to (−6,−3/2)/(−3/2,−6) and back, then generates (200,300)cm versus unchanged (2,3)m under display-only rescaling.',
        ],
        [
          '新Q3保乱序C/A/B三ID同行点，整行按x排序、对照分列排序（J93恰好同序须解释不能依此保证配对），用不等输入间隔定位；亲算负输入及两规则在三记录/新输入处，分清点、连续限制线段与四个整数卡片点。',
          'New Q3 preserves unordered C/A/B paired IDs, sorts whole rows and contrasts separate column sorts (J93’s coincidental common order is explicitly not a guarantee), locates unequal input gaps, computes negative inputs and two rules at observed/new inputs, and distinguishes observations, a restricted continuous segment and four integer card points.',
        ],
        [
          '新Q2由两非零x点精确求k=−1/2、b2/3并倒序差商复核，三行区分固定减半单位与折半、Δy与最终y；另求常数3/−2和零，解释重复不足与冲突无单值。共享Q3亲算三点吻合但新点分离的F/G，并与非零正比例比较。',
          'New Q2 derives exact k=−1/2,b2/3 from two nonzero-x points and reversed differences; three rows distinguish subtracting half a unit from halving, and Δy from final y. Separate constants three/negative two and zero distinguish duplicate insufficiency from conflicting non-single-valued data. Shared Q3 computes F/G agreement at three observations but divergence at a new input and contrasts nonzero direct proportion.',
        ],
        ['', ''],
      ][i]!;
      if (!cards.length) return entry;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J93', 'J94'].flatMap((u) =>
            cards.map((n) => `${u}-MAINT-CARTESIAN-MEANING-Q${n}`),
          ),
        ],
        rationale: t(
          `${entry.rationale.zh} ${details[0]}`,
          `${entry.rationale.en} ${details[1]}`,
        ),
      };
    }
    if (!entry.sourceLesson.startsWith('J74-')) return entry;
    const i = Number(entry.sourceLesson.slice(-2)) - 1,
      n = [1, 2, 0, 2, 3, 0][i]!;
    if (!n) return entry;
    const details = [
      [
        '新两组第1卡亲画内部/外部射线，分别由不重叠部分和整角扣部分求60/80与30/40；另构造零/锐/直/钝/平角并解释显示界非数学边界。',
        'New card ones construct interior/outside rays and derive 60/80 and 30/40 from non-overlapping parts versus whole-minus-part, then construct zero/acute/right/obtuse/straight angles and distinguish display limits from mathematical boundaries.',
      ],
      [
        '新两组第2卡分别从对顶表达式解x22.5或27.5，再求实际97.5/95及邻角82.5/85，核360并画垂直交线的相等邻补反例。',
        'New card twos solve vertical-expression parameters 22.5/27.5, reconstruct actual angles 97.5/95 and adjacent 82.5/85, check 360 and construct equal adjacent supplementary angles at perpendicular lines.',
      ],
      ['', ''],
      [
        '新两组第2卡共享独立等腰顶角分配、直角余角与外角逆求：底角71.25/63.75、余角57.5/42.5，另远内72/69.25与邻内59.5/42.5，保各完整条件与理由。',
        'New shared card twos derive equal bases 71.25/63.75, right-triangle complements 57.5/42.5 and separate exterior targets: remote 72/69.25 versus adjacent 59.5/42.5, retaining each independent premise and reason.',
      ],
      [
        '新两组第3卡分别全列整数第三边4至10或5至13，另验正实3.5/4.5和两等长仍不成形的2/2/5或3/3/7；自构等腰锐/直/钝三组并核正性、180及分类包含。',
        'New card threes enumerate integer third sides 4–10 or 5–13, check real 3.5/4.5 and impossible equal-length sets (2,2,5)/(3,3,7), then construct acute/right/obtuse isosceles triples with positivity, total and inclusive classifications.',
      ],
      ['', ''],
    ][i]!;
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['J93', 'J94'].map((u) => `${u}-MAINT-PLANE-MEANING-Q${n}`),
      ],
      rationale: t(
        `${entry.rationale.zh} ${details[0]}`,
        `${entry.rationale.en} ${details[1]}`,
      ),
    };
  },
);
