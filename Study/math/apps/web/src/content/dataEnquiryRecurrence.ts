import { t } from '../model';
const pair = (i: number) =>
  ['H08', 'H27'].map((u) => `${u}-MAINT-DATA-ENQUIRY-Q${i}`);
const supplements: Record<string, number[]> = {
  'J88-L01': [1],
  'J88-L02': [1, 3],
  'J88-L03': [2],
  'J88-L04': [2],
  'J88-L05': [3],
};
const extraEvidence: Record<string, ReturnType<typeof t>> = {
  'J88-L01': t(
    ' 新N1再算八项负分数偶数分半、闭区间ID人数2/2/3/3与共享边界、全同/两条/单条边界。',
    ' New N1 computes even signed fractional halves,closed-interval ID counts2/2/3/3 with shared boundaries,and equal/two/single-record cases.',
  ),
  'J88-L02': t(
    ' 新N1实际算平移/正倍缩放四分位与跨度，新N3对照原卡纠错与已核大值保留；另复用J93/J94旧平移卡Q2的逐ID新图/跨度和自主分布。',
    ' New N1 computes translated/scaled quartiles and spreads;N3 contrasts source correction with retention of verified large values. Existing J93/J94 Q2 adds per-ID translated plots/ranges and independently created distributions.',
  ),
  'J88-L03': t(
    ' 新N2实际画正/负/均衡散点，指出逆整体局部变化，补新ID重合前后行数/完整对数/位置数，区别旧U形。',
    ' New N2 plots rising/falling/balanced pairs,identifies opposing local steps,and counts rows/complete pairs/positions around an overlapping new ID,contrasting the old U shape.',
  ),
  'J88-L04': t(
    ' 新N2画八天合并/天气分组图，核每组低高x的y均值相同而组间同向；自提反向因果/共同因素候选及尚需证据。',
    ' New N2 plots eight pooled/weather-grouped days and checks equal within-group low/high-x means despite pooled direction,then proposes reverse/common-factor candidates and needed evidence.',
  ),
  'J88-L05': t(
    ' 新N3保12行/缺A5，原卡纠正A6并日志、重算两组与独立确认大值分支，自己写相连PPDAC和返查版本。纸稿/导出/有限关卡非人工认可。',
    ' New N3 retains twelve rows/missing A5,logs source correction of A6,recomputes groups and a separate verified-large-value branch,and writes connected PPDAC with revision provenance. Paper/export/finite gates are not human approval.',
  ),
};
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
  targets: [
    ...pair(i),
    ...['H08', 'H27'].flatMap((u) =>
      (supplements[l] ?? []).map((n) => `${u}-MAINT-RESEARCH-MEANING-Q${n}`),
    ),
    ...(l === 'J88-L02'
      ? ['J93', 'J94'].map((u) => `${u}-MAINT-INFERENCE-MEANING-Q2`)
      : []),
  ],
  rationale: t(
    rz + (extraEvidence[l]?.zh ?? ''),
    re + (extraEvidence[l]?.en ?? ''),
  ),
});
export const dataEnquiryRecurrence = [
  e(
    'quartile-convention',
    'J88-L01',
    1,
    '四分位约定、重复与须线',
    'Quartile conventions, repeats and whiskers',
    'H08/H27各对五项按奇数排除/包含中位数算不同四分位，再对九项保负号与重复，分别画最小最大版和1.5IQR须线版。须端是围栏内实际观测，30/31另标异常候选，围栏不当须端或删值令；箱段宽不是人数比例。',
    'Each task calculates different quartiles under odd-sample exclusion/inclusion, then retains negative/repeated values in nine-item minimum/maximum and 1.5IQR whisker plots. Whiskers reach actual in-fence observations; thirty/thirty-one are marked separately. Fences are not endpoints or deletion orders, and box-segment widths are not headcounts.',
  ),
  e(
    'spread-evidence',
    'J88-L02',
    2,
    '指标限定与IQR非绝对免疫',
    'Measure-qualified spread and nonimmune IQR',
    '两处原九项A/B同中位5/6，原极差6/10、IQR2/8；A尾值改30/41后极差29/39而IQR2，说明全跨度与中部可相反。从原A独立重设同尾值0，重排后IQR3，反驳永不受影响；保全部已核记录与同轴同单位，不删出想要的结论。',
    'Both nine-item A/B pairs share median five/six, with original ranges six/ten and IQRs two/eight. Changing A’s tail to thirty/forty-one yields range twenty-nine/thirty-nine but IQR two, separating total and middle spread. Independently resetting the original tail to zero changes IQR to three, disproving immunity. All verified records remain, with common axes and units rather than deletion to preference.',
  ),
  e(
    'paired-association',
    'J88-L03',
    4,
    '完整配对、缺失与非线性形状',
    'Complete pairs, missingness and nonlinear shape',
    '两组各保五ID数对画U形散点，另有缺失y的ID6只排该项成对分析不造0。分列排序会造原来不存在的(0,0)或(−2,1)，须自己给反例；编号不当路径连接，中心交积和0仍有U形，不误称无关系、独立、总体形状或因果结论。',
    'Each plots five ID-preserved U-shaped pairs and excludes a missing-y sixth ID only from that paired analysis without zero imputation. Separate sorting invents absent pairs (0,0) or (−2,1), which learners identify. IDs are not a path. Zero centred cross-product sum coexists with a U shape, not proving no relationship, independence, population shape or causation.',
  ),
  e(
    'causal-evidence',
    'J88-L04',
    3,
    '混杂、观察与改进设计',
    'Confounding, observation and improved design',
    'H08/H27飞行资料分别给A60cm/B80cm释放且未随机分配，要求指出高度混杂、更多点/更直趋势/按高度分组不自动证明因果或排尽混杂。下一轮固定条件、随机分配折法、重复记录；区别总体随机抽样和处理随机分配，参与材料因果不自动普推。',
    'Both flight datasets give unequal release heights A60/B80 cm without random allocation. Learners identify height confounding and explain why more points, straighter trends or height grouping do not automatically establish causation or remove every confounder. They improve conditions, allocation and repeated records while distinguishing random sampling for population scope from random treatment allocation and avoiding automatic generalisation.',
  ),
  e(
    'statistical-enquiry',
    'J88-L05',
    3,
    '相连PPDAC、可追溯清理与有限结论',
    'Connected PPDAC, traceable cleaning and bounded conclusions',
    '两处从带单位ID表写完整PPDAC：40/50mm转4/5cm留痕，缺A6不补0，只并已核同次重复B3而保不同ID同值。有效A5/B6，排除法中位4/5或5/6、IQR4/2，报告本批B中位较大、中部较窄，列不能回答的因果/总体问题及后续设计，而非只写缩写或导出当通过。',
    'Each writes connected PPDAC from an ID/unit table: logged conversion of forty/fifty mm to four/five cm, no zero for missing A6, merging only the confirmed same-occasion B3 duplicate while retaining equal values under different IDs. Effective n is five/six; exclusion medians are four/five or five/six and IQRs four/two. Reports bound conclusions to this batch, name unanswerable causal/population questions and improve design rather than only listing initials or treating export as approval.',
  ),
];
