import { t, type Question, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H35' | 'H38') => {
  const first = unit === 'H35',
    id = (i: number) => `${unit}-MAINT-INFERENCE-Q${i}`;
  const values = first ? [0, 0, 4, 4, 4, 12] : [10, 10, 6, 6, 6, -2];
  const population = {
    caption: t(
      '完整虚构六编号总体；偏移cm，真值仅为教学核查公开',
      'Complete fictional six-ID population; offset in cm, truth disclosed only for this teaching audit',
    ),
    columns: [t('编号', 'ID'), t('偏移/cm', 'Offset/cm')],
    rows: values.map((x, i) => [
      t('ABCDEF'[i]!, 'ABCDEF'[i]!),
      t(String(x), String(x)),
    ]),
  };
  const truth = first ? 10 : -3,
    sigma = first ? 6 : 4,
    n = first ? 36 : 16;
  const means = [truth - 2, truth - 1, truth + 2, truth + 3];
  const meanPlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: first ? 0 : -8,
      xMax: first ? 16 : 4,
      yMin: 0,
      yMax: 5,
      xStep: first ? 2 : 1,
      yStep: 1,
    },
    points: means.map((x, i) => ({ x, y: i + 1, label: `M${i + 1}` })),
    curves: [
      {
        name: 'fixed audit truth, not an interval',
        color: '#a14532',
        points: [
          { x: truth, y: 0 },
          { x: truth, y: 5 },
        ],
      },
    ],
    xLabel: 'mean offset (cm)',
    yLabel: 'constructed row',
    caption: t(
      `四个构造均值M1…M4为${means.join('、')} cm，棕竖线仅为公开核查真μ=${truth} cm，未画区间答案。纵轴是行号，非概率或观测量。四行不是抽样模拟或家庭表现；每个区间须由同一给定方法构造。`,
      `Four CONSTRUCTED means M1…M4 are ${means.join(', ')} cm. The brown vertical line is audit truth μ=${truth} cm, not an interval; interval answers are not drawn. The vertical axis is a row index, not probability or an observed quantity. These rows are neither a sampling simulation nor family performance; construct each interval using the same specified method.`,
    ),
  };
  const effectSigma = first ? '8' : '6',
    small = first ? '2/5' : '3/10',
    large = first ? '4' : '3',
    target = first ? '2' : '1';
  const effects = {
    caption: t(
      `四个独立的假想研究情境；每行均为IID正态、已知σ=${effectSigma}分钟，固定零基线、预定双侧α=0.05；正值有利，预定重要阈值${target}分钟`,
      `Four separate hypothetical studies; each has IID normal observations, known σ=${effectSigma} min, a fixed zero baseline and prespecified two-sided α=0.05. Positive is beneficial; the prespecified important threshold is ${target} min`,
    ),
    columns: [
      t('情境', 'Case'),
      t('估计改善/分钟', 'Estimated improvement/min'),
      t('样本量n', 'Sample size n'),
    ],
    rows: [
      ['A', small, '10000'],
      ['B', large, '4'],
      ['C', large, '100'],
      ['D', `−${large}`, '100'],
    ].map((r) => r.map((x) => t(x, x))),
  };
  const questions: Question[] = [
    reasoning(
      id(1),
      t(
        '表给完整六编号偏移总体（仅此教学公开真值）。求总体参数μ、样本AB均值及有符号误差。设计S从全六编号等可能不放回抽两名；设计F只从框ABCD同法抽两名。分别列可用编号并求均值统计量的设计期望、偏差。F碰巧抽CD误差为0，能证明F无偏吗？把框内样本增为四名能修复E/F遗漏吗？全体普查消除了哪些误差，非响应、错量又怎样？',
        'The table is the COMPLETE six-ID offset population, with truth disclosed only for teaching. Find μ, the AB sample mean and signed error. Design S selects an equally likely unordered pair WITHOUT replacement from all six IDs; design F selects a pair the same way from frame ABCD only. State eligible IDs and find each design expectation/bias. If F happens to draw CD with zero error, does that prove it unbiased? Does enlarging the frame sample to all four repair omitted E/F? Which errors disappear under a full census, and what about nonresponse or mismeasurement?',
      ),
      'stat-inference-1',
      t(
        `${first ? 'μ=4 cm，AB均值0、一次误差−4 cm；S期望4、偏差0。F期望2、偏差−2 cm。CD均值4碰巧误差0，但设计偏差仍−2。框内n4均值2、仍偏−2。' : 'μ=6 cm，AB均值10、一次误差4 cm；S期望6、偏差0。F期望8、偏差2 cm。CD均值6碰巧误差0，但设计偏差仍2。框内n4均值8、仍偏2。'} S框为ABCDEF，F框仅ABCD。同值不同ID仍是不同抽样单位。每个总体编号在S中入样率2/6，E(均值)=(1/2)Σyᵢ(2/6)=μ；F以同理只对框均值无偏。一次误差是本次统计量−参数，偏差是设计期望−参数。偶然零误差与无偏不等价，无偏也不保证逐次正确。完整普查仅消除该模型抽样变异；错误记录、缺失和框外遗漏需另外处理，不能以随机名义自动排除。实际参数通常未知。`,
        `${first ? 'μ=4 cm; AB mean zero, error −4 cm. S has expectation four, bias zero. F has expectation two, bias −2 cm. CD happens to have mean four, error zero, but F still has bias −2. Its four-ID census still has mean two, bias −2.' : 'μ=6 cm; AB mean ten, error 4 cm. S has expectation six, bias zero. F has expectation eight, bias 2 cm. CD happens to have mean six, error zero, but F still has bias 2. Its four-ID census still has mean eight, bias 2.'} S includes ABCDEF; F only ABCD. Equal-valued IDs remain distinct units. Under S each ID has inclusion chance 2/6, so E(mean)=(1/2)Σyᵢ(2/6)=μ. The same argument makes F unbiased only for its FRAME mean. A realised error is this statistic minus parameter; bias is design expectation minus parameter. Accidental zero error does not imply unbiasedness, nor does unbiasedness make every draw correct. A full census removes sampling variation in this model, not mismeasurement, missingness or frame omissions. Random selection alone does not rule those out. Real parameters are usually unknown.`,
      ),
      [
        t(
          '先算六编号均值，再分开列全体框和受限框。',
          'Average all six IDs first, then list the full and restricted frames separately.',
        ),
        t(
          '偏差比较所有可能样本的期望，不能只看CD。',
          'Bias uses the expectation across all possible samples, not just CD.',
        ),
      ],
    ),
    reasoning(
      id(2),
      t(
        '本题再次给完整六编号表，仍等可能无放回抽n=2。列全15个无序编号对及均值，再按同均值合并质量，求理论抽样均值、方差、标准误，与原个体分布方差比较。给一般无放回公式并求n3、n6的方差。若仅框ABCD抽两名，求其均值分布、期望与相对全体偏差：重复R越来越大能修正吗？改变n、R、种子及R=0分别意味着什么，直方图平滑会使理论分布变正态吗？',
        'Use the complete six-ID table independently. Select an equally likely pair WITHOUT replacement. List ALL15 unordered ID pairs and means, then merge equal means with their masses. Find the theoretical sampling mean, variance and standard error against original individual variance. Give the finite-population formula and variances for n=3, n=6. For pairs restricted to ABCD, find their mean law, expectation and bias relative to ALL six. Can increasing repetitions R repair that bias? Distinguish changing n, R, seeds and R=0. Does histogram smoothing make the theoretical law normal?',
      ),
      'stat-inference-2',
      t(
        `${first ? 'AB0；AC/AD/AE/BC/BD/BE各2；AF/BF各6；CD/CE/DE各4；CF/DF/EF各8。均值0,2,4,6,8的质量1/15,6/15,3/15,2/15,3/15，期望4。框ABCD均值0,2,4质量1/6,4/6,1/6，期望2，偏差−2。' : 'AB10；AC/AD/AE/BC/BD/BE各8；AF/BF各4；CD/CE/DE各6；CF/DF/EF各2。均值2,4,6,8,10的质量3/15,2/15,3/15,6/15,1/15，期望6。框ABCD均值6,8,10质量1/6,4/6,1/6，期望8，偏差2。'} 两例原总体方差σ²=Σ(y−μ)²/6=16 cm²，n2均值方差32/5 cm²、SE=√(32/5) cm，不等于16/2。一般SRS无放回Var(均值)=σ²/n·(N−n)/(N−1)，此处N6；n3为16/5 cm²，n6为0。框内n2方差4/3，相对全体MSE=4/3+2²=16/3 cm²。R只影响模拟频率精度，不改设计分布或偏差；增大n改理论分布但框内最多四名仍漏E/F。固定种子只重现轨迹，R0无频率。此处理论分布是有限离散的，平滑绘图或多重复不会把它变成连续正态；有限R也不强制各质量恰为理论数。`,
        `${first ? 'AB0; AC/AD/AE/BC/BD/BE each 2; AF/BF each 6; CD/CE/DE each 4; CF/DF/EF each 8. Means 0,2,4,6,8 have masses 1/15,6/15,3/15,2/15,3/15, expectation four. The ABCD-frame means 0,2,4 have masses 1/6,4/6,1/6, expectation two, bias −2.' : 'AB10; AC/AD/AE/BC/BD/BE each 8; AF/BF each 4; CD/CE/DE each 6; CF/DF/EF each 2. Means 2,4,6,8,10 have masses 3/15,2/15,3/15,6/15,1/15, expectation six. The ABCD-frame means 6,8,10 have masses 1/6,4/6,1/6, expectation eight, bias 2.'} Both original population variances σ²=Σ(y−μ)²/6=16 cm². The pair-mean variance is 32/5 cm², SE=√(32/5) cm, not 16/2. For SRS without replacement, Var(mean)=σ²/n·(N−n)/(N−1), N=6 here. n3 gives 16/5 cm²; n6 gives zero. Restricted-frame pair variance is 4/3; MSE against the full mean is 4/3+2²=16/3 cm². R changes empirical frequency precision, not the design law or bias. n changes the theoretical law, but even all four frame IDs omit E/F. A seed reproduces a trace; R0 frequencies are undefined. This finite discrete theoretical law does not become continuous normal through smoothing or repetition. Finite frequencies need not exactly match theoretical masses.`,
      ),
      [
        t(
          '按字母顺序列AB, AC,…，不可重复BA或丢同值编号。',
          'List AB, AC,… in ID order; do not repeat BA or discard equal-valued IDs.',
        ),
        t(
          '方差先对均值的理论分布加权；无放回修正与重复次数分开。',
          'Weight the theoretical mean law for variance; separate finite-population correction from repetition count.',
        ),
      ],
    ),
    reasoning(
      id(3),
      t(
        `另一个独立模型：IID正态偏移，已知总体σ=${sigma} cm，n=${n}，观测均值${truth} cm。给均值±2SE及±1.96SE区间、宽度、近似重复覆盖率；同条件把n变为${4 * n}怎样？图给四个构造均值，审查用固定真μ=${truth}：都以±2SE构造区间，列端点并数覆盖含边界；为何四行比例不必等于名义覆盖？区间宽必然更准确吗，已观测区间能给固定μ赋95%概率或预测个体吗？若σ未知、依赖、漏框或有限总体不放回，公式可照搬吗？`,
        `A SEPARATE model has IID normal offsets, KNOWN population σ=${sigma} cm, n=${n}, observed mean ${truth} cm. Give mean±2SE and±1.96SE intervals, widths and approximate repeated-sampling coverage. What if n becomes ${4 * n} under the same assumptions? For the four constructed means in the graph, use fixed audit truth μ=${truth}:construct every ±2SE interval, list endpoints and count boundary-inclusive coverage. Why need this four-row fraction not equal nominal coverage? Is a wider interval automatically more accurate? Does an observed interval assign 95% probability to fixed μ or predict individual observations? What changes for unknown σ, dependence, frame omissions or finite-population sampling WITHOUT replacement?`,
      ),
      'stat-inference-3',
      t(
        `${first ? 'SE=1 cm，z2区间[8,12]、宽4 cm，z1.96区间[8.04,11.96]、宽3.92 cm。n144时SE=1/2，z2区间[9,11]、宽2 cm。四构造均值8,9,12,13给区间[6,10]、[7,11]、[10,14]、[11,15]，前三覆盖μ10、后一不覆盖。' : 'SE=1 cm，z2区间[−5,−1]、宽4 cm，z1.96区间[−4.96,−1.04]、宽3.92 cm。n64时SE=1/2，z2区间[−4,−2]、宽2 cm。四构造均值−5,−4,−1,0给区间[−7,−3]、[−6,−2]、[−3,1]、[−2,2]，前三覆盖μ−3、后一不覆盖。'} 该已知σ的IID正态族有SE=σ/√n，覆盖事件等价|Z|≤z*，长期率2Φ(z*)−1；z2约0.9545，z1.96约0.9500。四个构造行给3/4，是教学构造不是模拟估计或用户数据，不能校准名义覆盖；真实有限重复也会波动。固定模型与数据下更大z*通常更宽、覆盖更高但精度更低；同水平增n可缩窄。宽窄不修有偏设计/错模型。参数固定，重复的是随机区间；一次已定区间包含或不包含μ，不能由频率覆盖给μ赋后验概率。均值区间也非个体预测区间。σ未知或依赖等条件变化需另审方法，有限总体须处理设计和修正，不能套本独立正态已知σ公式。`,
        `${first ? 'SE=1 cm. z2 interval[8,12], width 4 cm; z1.96 interval[8.04,11.96], width 3.92 cm. At n144, SE=1/2, z2 interval[9,11], width 2 cm. Constructed means 8,9,12,13 yield[6,10],[7,11],[10,14],[11,15]; the first three cover truth ten, the last misses.' : 'SE=1 cm. z2 interval[−5,−1], width 4 cm; z1.96 interval[−4.96,−1.04], width 3.92 cm. At n64, SE=1/2, z2 interval[−4,−2], width 2 cm. Constructed means −5,−4,−1,0 yield[−7,−3],[−6,−2],[−3,1],[−2,2]; the first three cover truth −3, the last misses.'} Under this known-σ IID normal family, SE=σ/√n and coverage is the event|Z|≤z*, with long-run rate 2Φ(z*)−1:approximately 0.9545 for two and 0.9500 for 1.96. The four constructed rows give 3/4, not simulation or user data; they cannot calibrate nominal coverage. Real finite repetitions also fluctuate. In the same valid family/data, a larger critical value usually increases width/coverage but reduces precision; larger n can narrow intervals at fixed coverage. Width does not repair bias or a wrong model. μ is fixed; random intervals repeat. Once an interval is observed, it covers or misses; frequentist coverage gives no posterior probability for fixed μ. A mean interval is not an individual prediction interval. Unknown σ, dependence and finite-population designs require a fresh method audit, not blind reuse of the IID known-σ formula.`,
      ),
      [
        t(
          '先核σ/√n，再把同一半宽用于每一个构造均值。',
          'Compute σ/√n, then use the SAME margin at every constructed mean.',
        ),
        t(
          '把重复中随机变化的对象指出来，注意端点算覆盖。',
          'Identify what varies across repetitions; boundary equality counts as coverage.',
        ),
      ],
    ),
    reasoning(
      id(4),
      t(
        `事先固定${first ? 5 : 6}次独立二分类试验，H0:p=1/2，观察X=5。预设上侧备择p>1/2及α=${first ? '1/20' : '1/8'}，从有序结果计算包含观测值的“至少同样极端”p值、拒绝域和H0真时实际I类错误率。再作为另一个事先预设方案，以|X−${first ? '5/2' : '3'}|为双侧极端度，同α重算。能看数据后挑较小尾值吗？大p、小p分别能说什么，p是否为H0真概率？不拒绝能证明无差异或等效吗？说明II类错误、反复窥看、多重选择和模拟的局限。`,
        `Before observing data, fix ${first ? 5 : 6} independent binary trials, H0:p=1/2, and an upper alternative p>1/2 with α=${first ? '1/20' : '1/8'}. Observe X=5. Compute the inclusive at-least-as-extreme p value, rejection set and actual type-I error under H0 from ordered outcomes. As a SEPARATE prespecified plan, use two-sided extremeness|X−${first ? '5/2' : '3'}| at the same α and recompute. May you choose the smaller tail after seeing results? What do large/small p say, is p the probability H0 is true, and does nonrejection prove no difference or equivalence? Explain type-II error, peeking, multiple selections and simulation limits.`,
      ),
      'stat-inference-4',
      t(
        `${first ? '上侧只5，p=1/32≤1/20，拒绝域{5}、实际I类率1/32。双侧加0，p=2/32=1/16>1/20，不拒绝；全体最小双侧p也1/16，故α1/20双侧拒绝域空、实际I类率0。' : '上侧5,6共(6+1)/64，p=7/64≤1/8，拒绝域{5,6}、实际I类率7/64。双侧0,1,5,6共14/64，p=7/32>1/8，不拒绝；该α双侧拒绝域{0,6}、实际I类率2/64=1/32。'} H0下每条完整有序串概率2⁻ⁿ，恰k共C(n, k)条；极端集合必须含观测，不是只算恰5，也不自动把任何上尾加倍。p是假设H0和模型条件后，该极端集合发生概率，不是H0为真概率、效应大小或偶然造成数据的概率。α控制重复H0真的拒绝率，离散情况下可严格低于名义值。拒绝仍可能I类错误；H0假却不拒绝为II类。大p可能样本少/变异大/效应小，不能证无差异；等效需预设可忽略范围与合适方法。不能事后换尾、挑阈值、藏多重分析或反复看到显著才停，否则原错误控制不再成立。有限模拟接近不证明独立或H0。`,
        `${first ? 'Upper extremeness is{5}:p=1/32≤1/20, rejection set{5}, actual type-I rate 1/32. The separate two-sided plan adds zero:p=2/32=1/16>1/20, so no rejection. Its minimum possible two-sided p is 1/16; at α1/20 its rejection set is empty and actual type-I rate zero.' : 'Upper extremeness is{5,6}:p=(6+1)/64=7/64≤1/8, rejection set{5,6}, actual type-I rate 7/64. Two-sided extremeness is{0,1,5,6}, giving p=14/64=7/32>1/8, so no rejection. Its α1/8 rejection set is{0,6}, actual type-I rate 2/64=1/32.'} Each full ordered null string has mass 2⁻ⁿ; exact k has C(n, k) strings. Extremeness includes the observation, not just exact-five probability, and one must not blindly double arbitrary upper tails. p is the extreme-set probability ASSUMING H0 and model conditions, not the probability H0 is true, an effect size or the probability chance caused the data. α controls repeated-null rejection and discreteness can make actual rate strictly smaller. Rejection can be type I; nonrejection under false H0 is type II. Large p may reflect little information, variation or a small effect; it does not prove no difference. Equivalence needs a prespecified negligible range and suitable method. Post-data tail switching, threshold shopping, hidden multiplicity and peeking until significant invalidate the original error control. A finite simulation fit proves neither independence nor H0.`,
      ),
      [
        t(
          '数全部2ⁿ有序串，按预设极端规则相加。',
          'Count all 2ⁿ ordered strings, adding those meeting the planned extremeness rule.',
        ),
        t(
          '每个可能观察k都要核p≤α，拒绝域的H0质量才是实际I类率。',
          'Check p≤α at EVERY possible observed k; null mass of the rejection set is the actual type-I rate.',
        ),
      ],
    ),
    reasoning(
      id(5),
      t(
        '表给四个相互独立的假想研究情境，不是同一研究先看结果再改n；每行已知σ、IID正态、零基线、正值有利。逐行算SE、z=估计改善/SE、双侧p≈2Φ(−|z|)与估计±1.96SE区间，再以预定重要阈值判断证据：A、C能同p却不同效应吗，B不显著能说无用吗，D显著能称有益吗？报告单位、条件、方向与不确定性；区间跨阈值时如何表达？随机抽样与随机分配能各自支持什么，模型计算本身证明因果或现实采用价值吗？',
        'The table gives four SEPARATE hypothetical studies, not one study changing n after peeking. Every row assumes known σ, IID normal observations, a zero baseline and positive values as beneficial. Compute each SE, z=estimated improvement/SE, two-sided p≈2Φ(−|z|), and estimate±1.96SE interval. Assess evidence against the PRESPECIFIED important threshold. Can A and C have equal p but different effects? Does nonsignificant B prove uselessness, or significant D imply benefit? Report units, conditions, direction and uncertainty, especially intervals crossing the target. What do random sampling and random assignment each support, and do model calculations alone establish causation or real adoption value?',
      ),
      'stat-inference-5',
      t(
        `${first ? 'A：SE=2/25、z5、区间[0.2432,0.5568]分钟，全低于2；B：SE4、z1、区间[−3.84,11.84]分钟，跨0和2；C：SE4/5、z5、区间[2.432,5.568]分钟，全高于2；D：SE4/5、z−5、区间[−5.568,−2.432]分钟，全在负侧。' : 'A：SE=3/50、z5、区间[0.1824,0.4176]分钟，全低于1；B：SE3、z1、区间[−2.88,8.88]分钟，跨0和1；C：SE3/5、z5、区间[1.824,4.176]分钟，全高于1；D：SE3/5、z−5、区间[−4.176,−1.824]分钟，全在负侧。'} A/C/D的双侧p同约0.0000005733，B约0.3173；按预设α0.05，A/C/D显著、B不拒绝。A虽精确非零但低于重要目标，C在本模型下区间支持超过目标，B信息不足而非证明无用，D方向有害而非有益/无影响。z与p由效应相对SE决定，非效应大小、价值或H0真概率。给定固定参数的区间解释仍为重复覆盖，不是个体范围或参数后验概率。抽样随机化在覆盖/响应等条件下支持目标总体推断；分配随机化在设计条件下支持对参与者的因果比较，并不自动给总体代表性。此表不提供实际抽样或分配证据，故模型答案不认证因果、推广或采用价值。仍需预定方向/阈值、成本、测量质量、设计及完整报告；区间跨阈值时明确不确定，不事后换阈值。`,
        `${first ? 'A:SE=2/25, z5, interval[0.2432,0.5568] min, entirely below two. B:SE4, z1, interval[−3.84,11.84] min, crossing zero and two. C:SE4/5, z5, interval[2.432,5.568] min, entirely above two. D:SE4/5, z−5, interval[−5.568,−2.432] min, entirely negative.' : 'A:SE=3/50, z5, interval[0.1824,0.4176] min, entirely below one. B:SE3, z1, interval[−2.88,8.88] min, crossing zero and one. C:SE3/5, z5, interval[1.824,4.176] min, entirely above one. D:SE3/5, z−5, interval[−4.176,−1.824] min, entirely negative.'} A/C/D share two-sided p≈0.0000005733; B has p≈0.3173. At prespecified α0.05, A/C/D reject zero; B does not. A is precisely nonzero but below the important target; C has model-based interval support above target; B is uncertain, not proved useless; D is harmful, not beneficial or no effect. z/p depend on effect RELATIVE TO SE, not magnitude, value or H0 probability. Intervals retain repeated-coverage meaning, not individual ranges or parameter posterior probabilities. Random sampling supports target-population inference under coverage/response conditions; random assignment supports participant causal comparisons under design assumptions, not automatic population representation. This table supplies neither actual sampling nor assignment evidence, so calculations certify neither causation, generalisability nor adoption value. Report direction, prespecified threshold, costs, measurement quality, design and all analyses. An interval crossing the target leaves uncertainty; do not move thresholds after seeing results.`,
      ),
      [
        t(
          '逐行计算σ/√n，保留有符号效应。',
          'Compute σ/√n separately in each row, retaining the effect sign.',
        ),
        t(
          '分别比较区间与0、与重要阈值；p相同不表示分钟数相同。',
          'Compare each interval separately with zero and the important threshold; equal p does not mean equal minutes.',
        ),
      ],
    ),
  ];
  questions[0]!.contextTable = population;
  questions[1]!.contextTable = population;
  questions[2]!.diagram = meanPlot;
  questions[4]!.contextTable = effects;
  return {
    id: `${unit}-MAINT-INFERENCE`,
    unit,
    title: t(
      '项目报告之前，再核推断的对象与条件',
      'Before project reports, recheck inferential targets and assumptions',
    ),
    bridge: 'H34-L01',
    bridgeByQuestion: Object.fromEntries(
      questions.map((q, i) => [q.id, `H34-L0${i + 1}`]),
    ),
    intro: t(
      '五题各为独立模型，可一次做一个小问。先纸上列样本、算区间或圈极端集合，再解释；整题核齐后才确认。全部数字是教学构造，不是家庭试用、真实研究或已证学习表现。',
      'Five independent model tasks can be split one subpart per sitting. Enumerate samples, calculate intervals or mark extreme outcomes on paper before explaining; confirm only after every part is reviewed. All numbers are teaching constructions, not a family trial, actual research or verified learning performance.',
    ),
    questions,
  };
};
export const inferenceRecurrenceRetrieval = {
  H35_INFERENCE: makeSet('H35'),
  H38_INFERENCE: makeSet('H38'),
};
