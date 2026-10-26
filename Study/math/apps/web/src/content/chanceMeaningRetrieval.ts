import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J93' | 'J94') => {
  const near = unit === 'J93',
    id = (n: number) => `${unit}-MAINT-CHANCE-MEANING-Q${n}`;
  const source = [1, 2, 4, 5];
  const card = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次一个编号分问，可分多次、不计时。先保原记录与身份、自主画表/图和解释，再逐项人审。允许口述与熟悉语言；读题协助与数学提示分开。',
        'One numbered part per untimed sitting. Retain original records and IDs; construct tables/plots and explanations before human review of every requirement. Oral or familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '给定假想原记录；编号是原记录身份，各分支独立。统计量、概率与频率须自行生成。',
        'Given fictional original records. IDs retain observation identity; branches are independent. Generate summaries, probabilities and frequencies yourself.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象/分支', 'Object/branch'),
        t('原值', 'Original value'),
      ],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const observations = near ? [11, 2, 2, 5, 8] : [13, 0, 4, 0, 9],
    median = near ? 5 : 4,
    mode = near ? 2 : 0;
  const q1 = card(
    1,
    'median-and-all-modes',
    '① 五条假想等待min按原ID保留，自己排全部记录，标排序位置与正中ID，求中位数和全部众数，写频数依据。位置号改变会改变记录身份吗，重复值和零能删吗？② 分别算最小/最大平均、先去重再取中位数；与正确结果比较，说明为什么看两端或把同值记录合并会改变问题。一个结果偶然与另一统计量相同，能替代定义吗？③ 另给0、0、0与0、1、2，按“最高且至少重复”约定求全部众数。偶数条的中间两值平均可能未出现，这与上述奇数条取中间一条有何不同？画一组偶数反例，不能只复述术语。',
    '① Retain the five fictional waits in min by ORIGINAL ID. ORDER every observation, mark position numbers and central ID, and give median and ALL modes with frequencies. Does a new position change identity? May duplicates or zero be removed? ② Calculate the mean of extremes and, SEPARATELY, the median after deduplicating. Compare with the correct median: why do these procedures change the question? Can coincidence between summaries replace their definitions? ③ Compare modes for 0,0,0 and 0,1,2 under the highest-repeated convention. Explain odd single-middle versus even middle-pair averaging, and DRAW an even-count counterexample whose median was not observed.',
    `排序${[...observations].sort((a, b) => a - b).join('、')}，原五条正中位置3，中位${median}min；众数${mode}出现2次，其他各一次，ID不因位置改变。最小最大平均${near ? '13/2' : '13/2'}min，先去重后的中位也13/2，均非原${median}，记录数与位置条件被改。零和重复都有效。0、0、0众数0；0、1、2无众数不是0。偶数反例可取2、4、6、8，中位(4+6)/2=5未观察到；其他满足要求的例子也接受，不据中位和众数某次巧合就混同定义。`,
    `Order ${[...observations].sort((a, b) => a - b).join(',')}: the middle is position three, median ${median}min; mode ${mode} occurs twice, all others once. IDs survive reordering. The extremes average 13/2min; the deduplicated median is also 13/2, both different from original ${median}, because records and positions changed. Zero and repeats are valid. Modes: 0,0,0 gives zero; 0,1,2 has no mode. One even-count counterexample is 2,4,6,8 with median five absent from the data; accept other valid examples. Coincidence does not merge definitions.`,
    '每条卡保原身份，另写排序位置；先找中间的秩，再数每个值出现次数。',
    'Retain each observation ID and separately write ordered positions. Locate middle ranks, then count frequencies.',
  );
  table(
    q1,
    observations.map((v, i) => [
      `I${i + 1}`,
      '等待/min',
      'Wait/min',
      String(v),
    ]),
  );

  const categoryCounts = near ? [3, 1, 1] : [1, 3, 1],
    waits = near ? [0, 1, 3] : [0, 2, 3],
    sum = near ? 4 : 5;
  const q2 = card(
    2,
    'summary-purpose',
    '表中C分支为无顺序的纸卡类别计数，字母只是名称；W分支为另外三次假想等待min，不混为一组。① 用C回答最常见类别并列每类频数。如果把名称一一改成动物名，频数关系会变吗？能按字母表任意赋1/2/3后把“平均类别”或“数值中位类别”当数据自身意义吗？② 对W分别回答“完整总量均分三份”“排序中间位置”“最常见值”，各给对应量与精确值，保零。均值必须是原记录之一吗，能把它截整或改成中位数吗？③ 用已有后续记录的极端值保留原则解释，这些摘要丢掉哪些信息、只描述哪批记录；不由小样本保证每个人或下一次。',
    'C gives NOMINAL card-category counts; the letters are names without order. W is a SEPARATE set of three fictional waits in min. ① Find the most common C category and every frequency. Would a one-to-one renaming with animal names change frequencies? Does arbitrarily coding A/B/C as 1/2/3 create a meaningful numerical mean or median of the original categories? ② For W separately answer equal sharing of the FULL total, ordered middle position and most frequent value, with exact values and zero retained. Must the mean be observed, truncated or replaced by median? ③ Explain information lost by summaries and the scope of these records, retaining verified extremes rather than selecting attractive records. Do not guarantee everybody or the next observation from this sample.',
    `C的A/B/C频数${categoryCounts.join('/')}，众数类别${near ? 'A' : 'B'}；一一改名不改同类关系，任意数字编码的均值依编码而变，不是原类别的数值摘要。W全和${sum}min、条数3，均值${sum}/3min；中位${near ? 1 : 2}min，各数一次故无众数。删零后错分母2，不能拿该均值替原值；精确均分不必出现过，不截整也不换成中位。不同摘要回答不同问题、都丢部分分布信息，只描述C或W各自给定批次，不删除核实极端值或预测所有人。`,
    `C frequencies A/B/C are ${categoryCounts.join('/')}; modal category=${near ? 'A' : 'B'}. One-to-one renaming preserves category identity/frequency. A numeric code’s mean depends on the arbitrary coding, not a scale in these nominal data. W totals ${sum}min across three records: mean ${sum}/3min, median ${near ? 1 : 2}min and no mode since each value occurs once. Removing zero wrongly changes the denominator to two. An exact mean need not be observed; do not truncate it or substitute median. Summaries answer different questions and omit distribution information. Conclusions describe their separate given batches, not everyone or the next observation; retain verified extremes.`,
    '先区分名称计数与有数值单位的等待；同一记录可被问不同问题，统计量按问题选。',
    'Separate category counts from measured waits. The same records can answer different questions, requiring different summaries.',
  );
  table(q2, [
    ...categoryCounts.map(
      (v, i) =>
        [
          `C${i + 1}`,
          `类别${String.fromCharCode(65 + i)}张数`,
          `Count of category ${String.fromCharCode(65 + i)}`,
          String(v),
        ] as [string, string, string, string],
    ),
    ...waits.map(
      (v, i) =>
        [`W${i + 1}`, '另题等待/min', 'Separate wait/min', String(v)] as [
          string,
          string,
          string,
          string,
        ],
    ),
  ]);

  const labels = near ? ['A', 'A', 'B', 'C'] : ['A', 'B', 'B', 'C', 'C'];
  const q3 = card(
    3,
    'finite-event-probability',
    '原表逐枚列非空袋的同样大小圆片，充分混匀且每一ID等可能单抽。U是“A或B”，V是“B或C”。① 自己列U、V和“U或V”的完整ID集合，给精确概率；“U或V”可直接把P(U)+P(V)相加吗？指出被重复数的原ID并修正，分母始终数对象不数类别。② 对“既U又V”、无D、全部A/B/C分别算概率并解释0/1的模型意义；圈选事件会改变抽取机会吗？③ 抽后放回才保下一轮同袋；另假设首次抽走一枚A且不放回，重数余袋与P(U)。再把所有圆片移走，空袋未定义与原非空袋P(D)=0相同吗？不要求真实抽片。',
    'The table lists every same-sized token ID in a NONEMPTY mixed bag, each assumed equally likely in one draw. U means A or B; V means B or C. ① LIST the full ID sets for U,V and U OR V, giving exact probabilities. May P(U)+P(V) be used directly? Identify duplicated original IDs and correct the count; the denominator counts objects, not names. ② Find U AND V, absent D and all A/B/C probabilities, explaining zero/one within the model. Does event highlighting change drawing chances? ③ Replacement retains the next round’s bag. Separately suppose one A was drawn and NOT replaced: recount remaining tokens and P(U). Then remove EVERY token: is the undefined empty draw the same as P(D)=0 in the original nonempty bag? No real draw is required.',
    `${near ? 'U=I1/I2/I3，V=I3/I4，交I3' : 'U=I1/I2/I3，V=I2/I3/I4/I5，交I2/I3'}；并集保全部${labels.length}个ID不重复，P(U)=${near ? '3/4' : '3/5'}、P(V)=${near ? '1/2' : '4/5'}、并1、交${near ? '1/4' : '2/5'}。直接相加${near ? '5/4' : '7/5'}超过1，重复计B；减交后为1，概率无单位。D没有符合对象给0/正总数=0；全部事件为1，圈选不改机制。独立移走一枚A后${near ? '余A1/B1/C1共3，P(U)=2/3' : '余A0/B2/C2共4，P(U)=1/2'}，不沿用原比。全空没有这次抽取结果，0/0未定义；不与有效袋中不可能事件混同。`,
    `${near ? 'U=I1/I2/I3, V=I3/I4, intersection=I3' : 'U=I1/I2/I3, V=I2/I3/I4/I5, intersection=I2/I3'}. Their union includes all ${labels.length} IDs ONCE. P(U)=${near ? '3/4' : '3/5'}, P(V)=${near ? '1/2' : '4/5'}, union=1, intersection=${near ? '1/4' : '2/5'}. Direct sums ${near ? '5/4' : '7/5'} exceed one by double-counting B; subtract the intersection. Probability has no unit. Absent D gives zero over a positive total; all tokens give one. Highlighting changes no mechanism. Independently removing one A leaves ${near ? 'one each A/B/C, total three and P(U)=2/3' : 'zero A, two B/two C, total four and P(U)=1/2'}, not the original ratio. An empty bag supplies no draw outcome and 0/0 is undefined, unlike an impossible event in a valid bag.`,
    '把每个事件写成原ID集合；“或”先合并再数，每个ID最多一次。',
    'Write each event as an original-ID set. For OR, form the union before counting each ID once.',
  );
  table(
    q3,
    labels.map((v, i) => [
      `I${i + 1}`,
      '单枚等可能圆片标签',
      'One equally likely token label',
      v,
    ]),
  );

  const outcomes = near
    ? ['A', 'A', 'B', 'C', 'A', 'B', 'A', 'C', 'A', 'A']
    : ['A', 'B', 'A', 'A', 'C', 'B', 'A', 'C', 'B', 'A', 'B', 'C'];
  const q4 = card(
    4,
    'frequency-versus-probability',
    `理想独立重复，均匀角度转盘为${near ? 'A半圆、B/C各四分之一' : 'A/B/C等分三份'}。原表仅为给定假想示例记录，非真实实测，也不声称是工作台某种子实际生成。① 先由机制分别求P(A)、P(B)，再从整批按ID数A/B频率，换观察字母不重抽、不改分母。只显示末八条时首条累计编号多少，能用窗口八条代替整批吗？画前三次A累计点，零次时能先画频率0点吗？② 从原批追加一次A，比较离理论P(A)的距离，给精确分数；更多一次是否必更近，过去能强迫下次补偿吗？另独立给五次全非A记录，频率0能否证明模型P(A)=0，与零次频率有何不同？③ 相同结构/种子能重放程序记录是什么意思，能把本表冒称程序输出或真实测量吗？改变结构或种子后为何另开批次，最新八条与全批记录各保什么？`,
    `Ideal INDEPENDENT repetition uses uniform angles: ${near ? 'A occupies one half, B/C one quarter each' : 'A/B/C occupy equal thirds'}. The table is GIVEN FICTIONAL example records, neither real observations nor claimed output from a workshop seed. ① Derive P(A),P(B) from the mechanism, then recount A/B frequencies over ALL original IDs without new draws or a denominator change. If only the latest eight are shown, what is their first cumulative index, and may that window replace the full batch? Plot the first three cumulative A points; may a no-trial frequency-zero point be invented? ② Append one A to the ORIGINAL batch and compare exact distance from theoretical P(A). Must another trial improve agreement or compensate for history? Independently take five non-A outcomes: does recorded frequency zero establish P(A)=0, and how does it differ from no trials? ③ What does replaying a structure/seed mean? May this given table be called program output or physical measurement? Why start a fresh batch on structure/seed changes, and what do the latest-eight window and full records retain?`,
    `理论A=${near ? '1/2' : '1/3'}、B=${near ? '1/4' : '1/3'}；全批${outcomes.length}条，A${near ? 6 : 5}、B${near ? 2 : 4}，频率A=${near ? '3/5' : '5/12'}、B=${near ? '1/5' : '1/3'}。末八条从${outcomes.length - 7}起，A窗口${near ? '4/8=1/2' : '2/8=1/4'}不替原全批；换事件只重数同批。前三A点${near ? '(1,1)/(2,1)/(3,2/3)' : '(1,1)/(2,1/2)/(3,2/3)'}，零次未定义不造点。追加A后${near ? '7/11，离1/2为3/22大于原1/10' : '6/13，离1/3为5/39大于原1/12'}，反驳必近；下一次理想概率不补偿。独立五次零命中频率0/5=0，理论A仍正；零次0/0未定义。给定假想表不冒程序实跑或实测；同种子结构重放仅指规则固定序列，不证明实物公平或所有长序列性质。改模型/种子另批，窗口不丢全累计。`,
    `Theory: A=${near ? '1/2' : '1/3'}, B=${near ? '1/4' : '1/3'}. ALL ${outcomes.length} records contain ${near ? 6 : 5} A and ${near ? 2 : 4} B: frequencies A=${near ? '3/5' : '5/12'}, B=${near ? '1/5' : '1/3'}. The latest eight start at ${outcomes.length - 7}; their A rate ${near ? '4/8=1/2' : '2/8=1/4'} cannot replace the full batch. Changing the event recounts that batch. First-three A points are ${near ? '(1,1)/(2,1)/(3,2/3)' : '(1,1)/(2,1/2)/(3,2/3)'}. No-trial frequency is undefined, with no invented point. Another A gives ${near ? '7/11, distance 3/22 from 1/2 exceeding the original 1/10' : '6/13, distance 5/39 from 1/3 exceeding the original 1/12'}. Thus improvement is not guaranteed and next-trial theory does not compensate. Five non-A results give 0/5=0 while theoretical A stays positive; zero trials give undefined 0/0. Given fictional records are not claimed program runs or measurements. Replaying a seed/structure means a fixed rule reproduces a sequence, not proof of physical fairness or all long-run properties. New structures/seeds require new batches; a window does not erase cumulative records.`,
    '先分别写理论机制与完整记录分母，再重数事件；窗口起点不是新的第一轮。',
    'State theory assumptions and the full recorded denominator separately. Recount the event; a window’s first display entry is not trial one.',
  );
  table(
    q4,
    outcomes.map((v, i) => [
      `T${i + 1}`,
      '该批一次原结果',
      'One original batch outcome',
      v,
    ]),
  );
  return {
    id: `${unit}-MAINT-CHANCE-MEANING`,
    unit,
    title: t(
      '记录身份、问题目的与事件计数',
      'Record identity, summary purposes and event counting',
    ),
    bridge: 'P67-L01',
    bridgeByQuestion: Object.fromEntries(
      source.map((l, i) => [id(i + 1), `P67-L0${l}`]),
    ),
    intro: t(
      '四张纸笔卡，一次一个编号小问、可分多次且不计时。保留全部给定假想记录，先自己画表/图、数对象并解释，再逐项人审；允许口述/熟悉语言，读题协助与数学提示分开。不需采集个人数据、实际抽片或冒称做过实验。',
      'Four paper cards, ONE numbered part per untimed sitting. Retain all given fictional records; construct tables/plots, count objects and explain before human review of every requirement. Oral/familiar-language responses are welcome; distinguish reading help from mathematical hints. No personal-data collection or physical draws are needed, and no experiment is claimed.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const chanceMeaningRetrieval = {
  J93_CHANCE_MEANING: makeSet('J93'),
  J94_CHANCE_MEANING: makeSet('J94'),
};
