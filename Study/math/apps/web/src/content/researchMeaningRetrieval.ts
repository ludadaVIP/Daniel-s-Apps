import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H08' | 'H27') => {
  const near = unit === 'H08',
    offset = near ? 0 : 1,
    id = (n: number) => `${unit}-MAINT-RESEARCH-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, en), skill, t(rz, re), [
      t(
        '先逐条保留ID、单位、重复与缺失，再按已声明规则计算。图须标均匀刻度，所有结论指回具体记录和来源；不能为结论改配对或删值。',
        'Retain IDs,units,repeats and missingness before using the stated rule. Label uniform plot scales and trace conclusions to records/sources; do not repair a preferred conclusion by changing pairs or deleting values.',
      ),
      t(
        '每次一个编号或独立案例，可分次、不计时，允许口述/熟悉语言。先生成自己的计算、图与解释，再逐项人审；读题协助与数学提示分开。',
        'One numbered part or independent case per untimed sitting; oral/familiar-language work is welcome. Generate calculations,plots and reasons before reviewing each part. Separate reading help from mathematical hints.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '原条件：编号案例独立；四分位计算排序、保重复，奇数排除整体中位数，偶数直接等分。图标各自变量/单位/刻度；虚构纸上记录不是实测。',
        'Original conditions: labelled cases are independent. Sort and retain repeats; exclude the single odd middle observation and split even samples directly. Label each plot variable,unit and scale. Fictional paper records are not measurements.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const values = near
    ? ['−2', '−1/2', '0', '0', '1/2', '1', '1', '3']
    : ['−3', '−3/2', '−1', '−1', '−1/2', '0', '0', '2'];
  const q1 = card(
    1,
    'even-quartiles-counts-and-affine-spread',
    '① E1–E8保全部身份，列排序后上下半，算五数、IQR与极差；偶数能删掉两个中央值再分半吗？画最小–最大须箱线图和逐条点图，核每个边界。Q1/中位数必须是原记录吗？② 对自己算得的四个闭区间[min,Q1]、[Q1,中位数]、[中位数,Q3]、[Q3,max]，逐区间列原ID、人数与占8条的比例。四个计数相加为何可能超过8，能由箱四段宽或“每份25%”代替逐条核吗？③ 独立D全同值、B仅两条、S仅一条，分别按本课规则判断五数能否算、能算则完整给五数/IQR/极差并画图。零宽的箱是不是没有记录？S那条观察是否因此无效？④ 分别从原E出发：U只加指定常数，求新Q1/Q3/IQR，用一般差说明为何不变；V把每条乘指定正倍数，列新五数/IQR/极差并同轴画图，证明两种跨度怎样变。只改显示窗或每格显示值、原单位不变，能当作V的数值变换吗？',
    '① Retain ALL E1–E8 IDs. List ordered lower/upper halves and find all five numbers,IQR and range. May the two central observations be deleted from an even sample? Draw min–max boxes AND individual dots,checking each boundary. Must Q1/the median be observed values? ② For YOUR four CLOSED intervals [min,Q1],[Q1,median],[median,Q3],[Q3,max],list every original ID,count and proportion of eight. Why may their counts sum above eight? Can segment widths or “25% each” replace record-by-record checking? ③ Independently assess D(all equal),B(two records),S(one record) under THIS course convention. Where defined,give all five numbers/IQR/range and plot. Does a zero-width box mean no observations? Does S’s one observation become invalid? ④ Restart SEPARATELY from E: U adds the supplied constant; find new Q1,Q3,IQR and justify invariance by a general difference. V multiplies every record by the supplied POSITIVE factor; give new five numbers,IQR,range and a common-axis plot,explaining both spread changes. Is changing only the display window/tick spacing while keeping units fixed the same as V’s numerical transformation?',
    `E两半各4条，五数${near ? '−2,−1/4,1/4,1,3' : '−3,−5/4,−3/4,0,2'}，IQR=5/4、极差5；中间两条平均给整体中位数，两条都保留。Q1与中位数本例均非原值。闭区间依次ID{E1,E2}、{E3,E4}、{E5,E6,E7}、{E6,E7,E8}，计数2,2,3,3、比例1/4,1/4,3/8,3/8；E6/E7在共享Q3边界被两闭区间都含，总计10非分割人数。D五数都${near ? 0 : -1}、IQR/极差0但仍5条、每个退成点的闭区间都含5条；不能删重复。B五数${near ? '−1,−1,0,1,1' : '−2,−2,−1,0,0'}，IQR/极差均2；每半一条。S观察本身有效，但本课五数至少2有效值，不能由一条推两半分布，也不能补另一条0。U的Q1/Q3=${near ? '−13/4、−2' : '3/4、2'}，差仍5/4；一般(Q3+d)−(Q1+d)=Q3−Q1。V五数${near ? '−4,−1/2,1/2,2,6' : '−9/2,−15/8,−9/8,0,3'}，IQR=${near ? '5/2' : '15/8'}、极差${near ? '10' : '15/2'}。正倍率保持排序且中间平均同倍，故四分位/两跨度乘c>0；显示窗不改变原值/单位或统计量，图区须共同覆盖所有点。`,
    `E has four records in each half and five numbers ${near ? '−2,−1/4,1/4,1,3' : '−3,−5/4,−3/4,0,2'},IQR5/4,range five. Average the two central observations for the overall median; delete neither. Here Q1 and median are not observations. Closed-interval ID sets are {E1,E2},{E3,E4},{E5,E6,E7},{E6,E7,E8}:counts2,2,3,3 and proportions1/4,1/4,3/8,3/8. E6/E7 lie on shared Q3 boundaries,so ten summed memberships are not eight disjoint people. D has all five numbers ${near ? 0 : -1},IQR/range zero,but FIVE observations; each collapsed closed interval contains all five. Retain duplicates. B’s five numbers are ${near ? '−1,−1,0,1,1' : '−2,−2,−1,0,0'},IQR/range two,one record per half. S is a valid observation but this course requires at least TWO for its five-number calculation; do not invent a second zero. U gives Q1,Q3=${near ? '−13/4,−2' : '3/4,two'},unchanged IQR5/4; generally(Q3+d)−(Q1+d)=Q3−Q1. V’s five numbers are ${near ? '−4,−1/2,1/2,2,6' : '−9/2,−15/8,−9/8,0,3'},IQR${near ? '5/2' : '15/8'},range${near ? 'ten' : '15/2'}. Positive c preserves order and scales middle averages,so quartiles and both spreads scale by c. A display window changes no values,units or summaries; use common axes covering all points.`,
  );
  table(q1, [
    ...values.map(
      (v, i) =>
        [
          `E${i + 1}`,
          'E组有向位置/cm',
          'Group E signed position/cm',
          v + 'cm',
          v + 'cm',
        ] as Row,
    ),
    [
      'D',
      '独立五条同值',
      'Separate five equal observations',
      `D1–D5各${near ? 0 : -1}cm`,
      `D1–D5 each ${near ? 0 : -1}cm`,
    ],
    [
      'B',
      '独立两条记录',
      'Separate two observations',
      near ? 'B1=−1cm；B2=1cm' : 'B1=−2cm；B2=0cm',
      near ? 'B1=−1cm; B2=1cm' : 'B1=−2cm; B2=0cm',
    ],
    [
      'S',
      '独立单条记录',
      'Separate single observation',
      `S1=${near ? 0 : -1}cm，仅一条`,
      `S1=${near ? 0 : -1}cm; only one observation`,
    ],
    [
      'U/V',
      '各从原E独立改变',
      'Independent changes from original E',
      near
        ? 'U: x′=x−3；V: x′=2x，单位仍cm'
        : 'U: x′=x+2；V: x′=3x/2，单位仍cm',
      near
        ? 'U:x′=x−3; V:x′=2x,units remain cm'
        : 'U:x′=x+2; V:x′=3x/2,units remain cm',
    ],
  ]);
  const xs = [0, 1, 2, 3, 4].map((x) => x + offset),
    pos = [1, 3, 2, 4, 5].map((y) => y + offset),
    neg = [5, 3, 4, 2, 1].map((y) => y + offset);
  const weather = [
    ...[
      [1, 2],
      [1, 4],
      [3, 2],
      [3, 4],
    ].map(([x, y], i) => `C${i + 1}=(${x! + offset},${y! + offset})`),
    ...[
      [7, 8],
      [7, 10],
      [9, 8],
      [9, 10],
    ].map(([x, y], i) => `W${i + 1}=(${x! + offset},${y! + offset})`),
  ].join('; ');
  const q2 = card(
    2,
    'scatter-directions-and-causal-alternatives',
    '① P/N/C三个独立案例各画散点，横轴为练习轮数、纵轴得分，每轴标名称/单位/均匀刻度。分别描述整体正向、负向或无明显线性方向，指出P/N各一个与整体相反的局部变化；不能要求每一步同向。再把同一P横轴每格由1轮改为2轮、纵轴刻度不变，重画并标出至少P1/P5，核原数对与方向是否改变；变陡就关联更强吗？与旧U形卡对比：C和U形都不能只凭“非直线”说完全无关。P6缺失保表不补零；再给P2同数对新ID P7，新增前后行数、完整对数和不同点位置数各怎样，重合标签能当删记录吗？② W另为八天零食x份/租车y次的构造观察。亲画合并和两天气分组图；在每组分别列低x/高x各对应的y及其均值，说明合并向上与组内无同样上升如何并存。天气是已证唯一原因吗？多观察、线更直或按天气分组，各能单独证明因果或完全无因果吗？③ 独立虚构学习卡中，当周补练次数和当周错题数同向，有人说补练制造错误。提出反向解释与共同因素各一个候选，写还需哪些时间顺序/记录/设计证据。候选故事不是已证原因；区别随机抽取观察与随机分配处理，设计方案不是已经得到结果。',
    '① Plot independent P,N,C with labelled practice-round and score axes,units and uniform ticks. Describe positive,negative or no clear linear direction; identify ONE local change in P/N opposing its overall direction. Every successive step need not agree. Replot the SAME P with x ticks changing from one to two rounds per division and unchanged y ticks; label at least P1/P5 and check original pairs/direction. Does a steeper appearance mean stronger association? Contrast C with the existing U-shape task:neither an unsuitable straight-line summary nor no clear linear trend proves no relationship. Retain missing P6 without zero imputation. Then add new ID P7 with P2’s SAME pair:compare row count,complete-pair count and distinct plotted positions before/after. May merged labels erase observations? ② Separate W is eight constructed snack(x portions)/rental(y count) days. Draw pooled and weather-stratified plots. Within EACH weather group list y values and their mean at low/high x,explaining a pooled rise without the same within-group rise. Is weather the proved sole cause? Do more observations,a straighter line or weather stratification alone prove causation or no causal effect? ③ In SEPARATE fictional learning cards,weekly extra practice and weekly errors rise together. Audit “practice creates errors”:offer ONE reverse-direction and ONE common-factor candidate,with the timing,records or design evidence still needed. Candidates are not proved causes. Distinguish random observational sampling from treatment assignment,and proposed design from obtained results.',
    `P总体正向但第二到第三条${3 + offset}→${2 + offset}下降；N总体负向但第二到第三条${3 + offset}→${4 + offset}上升。横轴每格2轮时同一x占横向格数减半、纵向不变，视觉可更陡但原配对/方向/关联强弱未变，刻度和显示单位必须标清。C每个x都配${1 + offset}和${5 + offset}，无明显向上/下线性方向；不等于无关系、独立、总体规律或因果结论，旧U形则明确弯曲。P原6行5完整对5位置，P6未知非0；加P7后7行6完整对仍5位置，P2/P7各自保身份。W凉组低/高x分别${1 + offset}/${3 + offset}，各y列表${2 + offset},${4 + offset}、均值${3 + offset}；暖组低/高x${7 + offset}/${9 + offset}，各y${8 + offset},${10 + offset}、均值${9 + offset}。组间位置一起上移6，合并可向上，而各组内两均值相同；须实际画点不靠一句混杂。天气仅候选，分组未排所有其他因素，未证因果不等于证无因果。反向候选：错题多促使增加补练；共同因素候选：题目难度/基础差异影响两者。需核补练和错题时间、原对象配对与任务难度，必要时在可行条件下公平随机分配处理、共同条件、重复并检查波动/范围。随机抽更多观察有助覆盖却未随机操纵补练；提出方案不等于实施或结果，合理替代候选亦可。`,
    `P is positive overall despite second-to-third score ${3 + offset}→${2 + offset}; N is negative despite ${3 + offset}→${4 + offset}. Changing to two x rounds per division halves horizontal grid positions while keeping vertical positions; the apparent steepness changes without changing original pairs,direction or strength. Label scales and units. C pairs each x with both ${1 + offset} and ${5 + offset},showing no clear rising/falling linear trend. This proves neither no relationship,independence,population shape nor causation; the old U example is explicitly curved. P originally has six rows,five complete pairs,five positions. P6 is unknown,not zero. Adding P7 gives seven rows,six complete pairs,still five positions; retain both P2/P7 IDs. In W,cool low/high x=${1 + offset}/${3 + offset} each have y values ${2 + offset},${4 + offset},mean${3 + offset}; warm low/high x=${7 + offset}/${9 + offset} each have y${8 + offset},${10 + offset},mean${9 + offset}. Both group centres shift up by six,allowing a pooled rise while within-group means match. Draw actual points,not merely a confounding slogan. Weather remains a candidate; stratification does not control everything,and unproved causation is not proved absence. Reverse candidate:more errors prompt more practice. Common-factor candidate:task difficulty/prior preparation affects both. Check temporal order,original paired units and task difficulty;where feasible use fair random allocation,common conditions,replication and variation/scope checks. Randomly sampling more observations helps coverage without manipulating practice. A proposed plan is neither implementation nor results; other reasonable labelled candidates count equally.`,
  );
  table(q2, [
    [
      'P',
      '独立正向候选记录',
      'Separate candidate rising records',
      xs.map((x, i) => `P${i + 1}=(${x},${pos[i]})`).join('; ') +
        `; P6=(${5 + offset},缺失)`,
      xs.map((x, i) => `P${i + 1}=(${x},${pos[i]})`).join('; ') +
        `; P6=(${5 + offset},missing)`,
    ],
    [
      'N',
      '独立负向候选记录',
      'Separate candidate falling records',
      xs.map((x, i) => `N${i + 1}=(${x},${neg[i]})`).join('; '),
      xs.map((x, i) => `N${i + 1}=(${x},${neg[i]})`).join('; '),
    ],
    [
      'C',
      '独立均衡散点',
      'Separate balanced cloud',
      [0, 2, 4]
        .map((x) => `x=${x + offset}各有y=${1 + offset}与${5 + offset}`)
        .join('; '),
      [0, 2, 4]
        .map(
          (x) => `x=${x + offset} each has y=${1 + offset} and ${5 + offset}`,
        )
        .join('; '),
    ],
    [
      'W',
      '独立凉C/暖W八天',
      'Separate eight cool-C/warm-W days',
      weather,
      weather,
    ],
  ]);
  const av = [2, 3, 3, 4].map((v) => v + offset),
    bv = [1, 2, 2, 3, 3, 5].map((v) => v + offset),
    source = 6 + offset,
    entered = near ? 26 : 37;
  const q3 = card(
    3,
    'source-correction-and-scoped-report',
    '① 原表12行，A5缺失，A6录入值与给定原卡不符。写可追溯日志，列ID/旧值/原卡值/依据/新值，保全部行；与旧报告卡的单位换算和已核同次重复合并区别。不能因数大就删。② 纠正后对A/B分别列有效ID、排序两半、五数/中位/IQR/极差及cm单位，同一数轴画箱线与原点图。报告总行数、两组有效n、缺失；相同极差能推出同分布或每条同值吗？③ 独立反事实：若原卡反而确认A6原录大值，就保它并重算A的中位/IQR/极差，说明与纠正分支的不同；不能为得到较小波动硬改。④ 以纠正分支写自己的PPDAC短报告，五步各与原数据相连，含数字、来源、缺失、适用范围与不能回答的因果/总体问题。已知不同桌面且未随机分配，提出下一轮设计但不虚构已执行。可用纸笔保存草稿；下载或一个关卡通过是否就是自由报告获人工验收？如返查数据/缩小问题范围，怎样记录修改而不抹去旧来源？',
    '① The raw table has twelve rows,missing A5,and entered A6 conflicting with the supplied source card. Write an audit log with ID,old value,source value,evidence and replacement while retaining every row. Distinguish source correction from the existing report task’s unit conversion and confirmed duplicate-import merge. Size alone does not justify deletion. ② After correction,list effective IDs,ordered halves,five numbers,median,IQR,range and cm units for A/B. Draw common-axis boxes AND original dots. Report all rows,observed n and missingness. Do equal ranges imply identical distributions or individual values? ③ SEPARATE counterfactual:if the source instead CONFIRMS the originally entered large A6 value,retain it and recompute A’s median,IQR,range. Compare with the correction branch;do not force a smaller spread. ④ Write YOUR scoped PPDAC report for the corrected branch,connecting all five stages to records and giving numbers,sources,missingness and unsupported causal/population claims. Different desks and no random allocation are GIVEN:improve the next design without inventing an executed experiment. Paper drafts suffice. Is downloading or passing one finite gate human approval of a free report? If revisiting sources/narrowing the question,how would you log changes while preserving provenance?',
    `日志A6：原录${entered}cm、原卡${source}cm，据该原卡改为${source}cm，保A6与A5缺失。12行，A有效A1,A2,A3,A4,A6共5、缺1，B六ID全有效。纠后A五数${near ? '2,5/2,3,5,6' : '3,7/2,4,6,7'}、中位${3 + offset}、IQR5/2、极差4cm；下半${2 + offset},${3 + offset}，上半${4 + offset},${source}。B五数${near ? '1,2,5/2,3,5' : '2,3,7/2,4,6'}、中位${near ? '5/2' : '7/2'}、IQR1、极差4cm；偶数两半各三条，不删中央值。极差同4但中位/IQR不同；A的典型值较大不代表每条更大或普遍更好。若原卡确认原录${entered}，A中位仍${3 + offset}、Q1=${near ? '5/2' : '7/2'}、Q3=${near ? '15' : '21'}、IQR=${near ? '25/2' : '35/2'}、极差${near ? '24' : '34'}，保来源与大值，两个分支不混。PPDAC问题限本批、计划单位/方法/ID/缺失/来源，数据留痕纠错，分析配同轴图与上述数值，结论带A/B有效5/6与缺失1/0。不同桌面非随机分配不支持组别因果或推广全部；改进共同条件、可行随机分配、重复和更广覆盖并保波动/范围。返查/改范围要标日期、理由与原版本；单位换算不改物理量，同次重复合并需身份核证，转录纠正需原卡，不能混为任意删改。纸上报告或导出仍须人读全部理由，有限关卡不理解自由全文，任何合条件完整表达均可。`,
    `Log A6:entered ${entered}cm,source ${source}cm,replace by ${source}cm BECAUSE of that source,retaining A6 and missing A5. Keep twelve rows. A has IDs A1,A2,A3,A4,A6 observed n5,one missing;B has all six IDs. Corrected A’s five numbers=${near ? '2,5/2,3,5,6' : '3,7/2,4,6,7'},median${3 + offset},IQR5/2,range4cm;halves ${2 + offset},${3 + offset} and ${4 + offset},${source}. B’s five numbers=${near ? '1,2,5/2,3,5' : '2,3,7/2,4,6'},median${near ? '5/2' : '7/2'},IQR1,range4cm;split its six records into halves of three without deleting the central pair. Equal ranges coexist with different centres/IQRs;greater typical A does not mean every A is greater or universally better. If the source instead verifies entered ${entered},A’s median remains${3 + offset},Q1=${near ? '5/2' : '7/2'},Q3=${near ? '15' : '21'},IQR=${near ? '25/2' : '35/2'},range${near ? '24' : '34'}:retain that value and provenance,keeping branches separate. Scope PPDAC to this batch;plan units,methods,IDs,missingness and source checks;log correction;analyse on common axes with these numbers;report n5/6 and missing1/0. Different desks/no random allocation prevent group causation or universal generalisation. Improve common conditions,feasible random allocation,replication and coverage while retaining uncertainty/scope. Log dates,reasons and old versions when revisiting sources or scope. Unit conversion retains physical quantity,a duplicate merge needs same-occasion identity evidence,and transcription correction needs its source card;none authorises arbitrary deletion. Paper or exported reports still require human reading;finite gates do not understand free text. Accept any complete permitted expression.`,
  );
  table(q3, [
    ...Array.from(
      { length: 6 },
      (_, i) =>
        [
          `A${i + 1}`,
          'A组录入距离',
          'Group A entered distance',
          i === 4 ? '缺失' : `${i === 5 ? entered : av[i]}cm`,
          i === 4 ? 'missing' : `${i === 5 ? entered : av[i]}cm`,
        ] as Row,
    ),
    ...bv.map(
      (v, i) =>
        [
          `B${i + 1}`,
          'B组录入距离',
          'Group B entered distance',
          v + 'cm',
          v + 'cm',
        ] as Row,
    ),
    [
      'SRC',
      '给定可核原卡',
      'Supplied checkable source',
      `A6原卡=${source}cm；A/B不同桌面、未随机分配`,
      `A6 source=${source}cm; A/B different desks,no random allocation`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-RESEARCH-MEANING`,
    unit,
    title: t(
      '分半人数、散点证据与来源纠错',
      'Halves and counts,scatter evidence and source correction',
    ),
    intro: t(
      '三张纸笔卡，每次一个编号或独立案例，可分次、不计时，口述/熟悉语言均可。先生成计算、图和报告再逐项人审；读题帮助与数学提示分开。全为虚构资料，无需实际调查、招募、购买或上传。',
      'Three paper cards,one numbered part/independent case per untimed sitting. Oral/familiar-language work is welcome. Generate calculations,plots and reports before human review;separate reading help from mathematical hints. All data are fictional;no actual survey,recruitment,purchase or upload is required.',
    ),
    bridge: 'J88-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 3, 5].map((l, i) => [id(i + 1), `J88-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const researchMeaningRetrieval = {
  H08_RESEARCH_MEANING: makeSet('H08'),
  H27_RESEARCH_MEANING: makeSet('H27'),
};
