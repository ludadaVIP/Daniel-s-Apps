import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J91' | 'J92') => {
  const near = unit === 'J91',
    id = (n: number) => `${unit}-MAINT-APPLIED-MEANING-Q${n}`;
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
        '一次一个编号小问，可分次、不计时。先自己生成有单位的表、图或关系，再逐项人审。允许口述及熟悉语言；读题协助与数学提示分开。',
        'One numbered part per untimed sitting. Generate tables, diagrams or relationships with units before human review of every requirement. Oral and familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string][],
  ) => {
    q.contextTable = {
      caption: t(
        '给定虚构原条件，各分支独立。未列计算结果，须自行重建。无需实际出行、购票或操作水泵。',
        'Given fictional original conditions; branches are independent. Results are not supplied: reconstruct them. No actual outing, purchase or pump operation is needed.',
      ),
      columns: [
        t('编号', 'ID'),
        t('原条件', 'Original condition'),
        t('原值/单位', 'Original value/unit'),
      ],
      rows: rows.map(([key, z, e, vz, ve]) => [
        t(key, key),
        t(z, e),
        t(vz, ve),
      ]),
    };
  };
  const d = near ? 5 : 7,
    moving = near ? 40 : 60,
    stop = near ? 20 : 45;
  const q1 = card(
    1,
    'journey-time-scope',
    `① 按表中单程记录画“累计走过路程—从出发起时间”图，标移动、停留、单位及整程斜率，分别求移动速度和含停留平均速度。交换图的显示尺寸会改变原速率吗？② 保路程与移动时间，仅改停留，使整程平均为${near ? '4' : '7/2'} km/h，逆求总时间与停留，并代回；另有匀速3 km/h行90 min，求路程。③ 独立从原单程出发，另沿原路返回，返回移动${near ? 20 : 30} min且不停。求往返总路程、总时间、平均速度；终点回出发点能说走过路程0吗，能直接平均两段移动速度吗？④ 另给6和12 km/h各走30 min，亲算这次为何恰等于速度算术平均，不将特殊等时情形当通则。再核原移动时间下停留0与路程0两个独立分支；正路程却总时间0能否定义此平均速度？`,
    `① From the original one-way records, DRAW cumulative distance travelled against elapsed time; label movement, stop, units and whole-trip slope. Find moving and elapsed-average speeds. Does resizing the displayed graph change rates? ② Keep distance and moving time, changing ONLY the stop to make elapsed-average speed ${near ? '4' : '7/2'} km/h. Recover total and stopped minutes and substitute back. Separately find the distance at a constant 3 km/h for 90 min. ③ Independently start from the ORIGINAL journey and return along the same route in ${near ? 20 : 30} moving minutes with no further stop. Find total distance, elapsed time and average speed. Does ending at the start make distance travelled zero? May the two moving speeds be averaged directly? ④ Separately travel at 6 and 12 km/h for 30 min EACH: calculate why the arithmetic mean works in this special equal-time case. Also check zero stop and zero distance as separate branches with original positive moving time. Can positive distance with zero elapsed time define this average speed?`,
    `原单程${d}km，移动${moving}min，停${stop}min；移动${near ? '15/2' : '7'}km/h，整程${near ? '5' : '4'}km/h。图停留段水平，整程斜率总路程/总时长，改显示尺度不改数据。目标平均${near ? '4' : '7/2'}需总${near ? 75 : 120}min、停${near ? 35 : 60}min，代回${d}×60/${near ? 75 : 120}；另3×90/60=9/2km。往返${2 * d}km、${near ? 80 : 135}min，平均${near ? '15/2' : '56/9'}km/h；净位置改变0不等累计走过路程0，直接平均移动速度${near ? '45/4' : '21/2'}错。等时例两段3km、6km，共9km/1h=9km/h，才等(6+12)/2。停0时平均等移动速度；路程0且原正时间时两种速率0。总时间0无有效非零距离平均，不除0；不以课堂数值保证现实路况。`,
    `Original: ${d}km, ${moving} moving and ${stop} stopped min. Moving speed=${near ? '15/2' : '7'}km/h; elapsed average=${near ? '5' : '4'}km/h. The stopped segment is horizontal; total-distance/elapsed-time slope is invariant to display resizing. The target ${near ? '4' : '7/2'} needs ${near ? 75 : 120} total and ${near ? 35 : 60} stopped min; check ${d}×60/${near ? 75 : 120}. Separately 3×90/60=9/2km. Return trip: ${2 * d}km over ${near ? 80 : 135}min gives ${near ? '15/2' : '56/9'}km/h. Zero net displacement is not zero distance travelled. Averaging moving speeds gives the wrong ${near ? '45/4' : '21/2'}. The equal-time example covers 3km and 6km in one hour, giving nine, equal to (6+12)/2 in that special case. With zero stop average equals moving speed; with zero distance and positive original time both are zero. Zero elapsed time supplies no valid nonzero-distance average: do not divide by zero. Classroom conditions do not guarantee real travel.`,
    '先把分钟换成小时，往返逐段累加路程与包括停留的时间。逆求时先求总时间，再减移动时间。',
    'Convert minutes to hours, summing distance and elapsed time leg by leg. Inverse work first recovers total time, then subtracts moving time.',
  );
  table(q1, [
    [
      'D',
      '原单程累计走过路程',
      'Original one-way distance travelled',
      String(d) + ' km',
      String(d) + ' km',
    ],
    [
      'M',
      '原单程移动时间',
      'Original one-way moving time',
      String(moving) + ' min',
      String(moving) + ' min',
    ],
    [
      'S',
      '原单程另停留',
      'Additional original stop',
      String(stop) + ' min',
      String(stop) + ' min',
    ],
  ]);

  const amount = near ? 60 : 72,
    a = near ? 3 : 4,
    b = near ? 2 : 3,
    minutes = near ? 7 : 5;
  const q2 = card(
    2,
    'constant-work-rates',
    `同一空容器需装${amount} L，两泵同刻开始、恒速且互不干扰，到满时都自动停机，无漏水。① 用原速率及经过时间画已完成/剩余条，求共同速率、已完成、剩余、此刻还需多久及从开始到满多久；分别写每一步单位，不平均单泵完成时间。② 另从空容器开始，让B停机而A照常，求完成时间；再让两泵都停机，正剩余量的完成时间是0吗？③ 原两泵开始后观察${near ? 14 : 12} min，实装量为何不等于速率乘全部观察时间，剩余能负吗？另核从开始经过0 min。④ 解释相加需要同一工作量单位、同时同对象、速率恒定和无干扰；若共用管道使实际总速率改变，原预测能继续当事实吗？`,
    `The SAME initially empty container needs ${amount} L. Pumps start together, keep constant independent rates and BOTH automatically stop when full, with no leakage. ① Draw completed/remaining bars from the original rates and elapsed time. Find combined rate, completed and remaining work, ADDITIONAL time now needed and TOTAL time from the start. Label units and do not average solo completion times. ② Independently restart empty with B off and A unchanged: find completion time. Then turn BOTH off: is the completion time of positive remaining work zero? ③ Observe ${near ? 14 : 12} min after the original two-pump start: why is actual contents not rate times all observation minutes? Can remaining work be negative? Also check zero elapsed minutes from the start. ④ Explain compatible units, simultaneous work on one job, constant rates and independence. If a shared pipe changes actual total rate, may the original prediction still be claimed as fact?`,
    `共同${a + b}L/min；${minutes}min已装35L，剩${amount - 35}L，另需${near ? '5' : '37/7'}min，总${near ? '12' : '72/7'}min，追加时间与总时间不同。B停则${amount}/${a}=${near ? 20 : 18}min；双停速率0，正任务在此状态不能完成而非0min，不除0。观察${near ? 14 : 12}min时已到满并停，实装${amount}L，不是${near ? 70 : 84}L，剩0不负；0min时装0剩${amount}。条形总长代表同一正任务，速率是每分钟量，乘时间得量，量除非零速率得时间。同一条件才相加；管道改变需用实测速率另建模型，不能靠原预测认证现实。`,
    `Combined ${a + b}L/min. After ${minutes}min: 35L filled, ${amount - 35}L left, ADDITIONAL ${near ? '5' : '37/7'}min and TOTAL ${near ? '12' : '72/7'}min. With B off, ${amount}/${a}=${near ? 20 : 18}min. With both off the rate is zero: positive remaining work cannot finish in that state, not zero minutes; do not divide by zero. At ${near ? 14 : 12}min, automatic shutoff caps contents at ${amount}L, not ${near ? 70 : 84}L, and remaining work is zero, never negative. At time zero, completed zero and remaining ${amount}. Rate×time has work units; work/nonzero rate has time units. Add rates only under the stated common-job conditions. A shared-pipe change needs a new model from actual rates, not a claim that the old prediction certifies reality.`,
    '先求每分钟共同完成量，再把“已经过”“从现在还需”“从开始总共”标成三种时间。',
    'Find combined work per minute, then distinguish elapsed, additional remaining and total completion times.',
  );
  table(q2, [
    [
      'W',
      '同一空容器目标',
      'Same initially empty container target',
      `${amount} L`,
      `${amount} L`,
    ],
    ['A', 'A恒速', 'A constant rate', `${a} L/min`, `${a} L/min`],
    ['B', 'B恒速', 'B constant rate', `${b} L/min`, `${b} L/min`],
    [
      'T',
      '①开始后经过',
      'Elapsed after start in part ①',
      `${minutes} min`,
      `${minutes} min`,
    ],
  ]);

  const counts = near ? [8, null, 12, 0] : [10, 15, null, 0],
    fare = near ? 3 : 2,
    fee = near ? 9 : 8,
    low = near ? 8 : 10,
    high = near ? 12 : 15,
    pack = near ? 4 : 5,
    price = near ? 5 : 4;
  const q3 = card(
    3,
    'chart-multistep-evidence',
    `原表是四日假想人次，不保证不同个体。① 画从0起的柱图，缺测与实测0用不同表示；把上限20改40后，原人数与费用是否变？另从${near ? 6 : 5}起截轴时，${high}与${low}的显示高度比为何不能当人数比？② 每人NZ$${fare}且每登记日必收一次NZ$${fee}组费，零人日也收，缺测日仍登记。逐日算已知日费及合计，说明四日总费用能否确定、缺测日至少知道什么。③ 求${low}到${high}的增加量和相对原日的精确增长比例，解释分母；已知另日总费用NZ$${high * fare + fee}，按同规则反求人次并代回，不能直接总价除单价。④ 另独立改为仅卖每${pack}张NZ$${price}的整包票且无组费。${high}人需几包、几张、费用多少？${high + 1}人呢？说明恰好整除与多一人的不同。图表能单独证明天气导致增长、补缺测0或认定全部是不同游客吗？`,
    `The table gives fictional daily VISITS, not guaranteed distinct people. ① DRAW a zero-based bar chart distinguishing missing from observed zero. If the axis maximum changes from 20 to 40, do counts or costs change? With a separate axis truncated at ${near ? 6 : 5}, why is the displayed-height ratio for ${high} and ${low} not their count ratio? ② Charge NZ$${fare} per visit PLUS one mandatory NZ$${fee} group fee PER registered day, including zero-visit days; the missing day is also registered. Find each known-day cost and their total. Can the four-day cost be determined, and what minimum information remains about the missing day? ③ Find the increase from ${low} to ${high} and its exact proportion relative to the ORIGINAL day; explain the denominator. A separate day costs NZ$${high * fare + fee}: recover its visits under the same tariff and substitute back, rather than dividing the whole bill by the unit fare. ④ Independently replace the tariff with ONLY whole packs of ${pack} tickets for NZ$${price}, no group fee. Find packs, tickets and cost for ${high} visits and for ${high + 1}. Explain exact divisibility versus one extra person. Can this chart alone establish weather causation, impute missing zero or certify unique tourists?`,
    `原${counts.map((c) => (c === null ? '缺测' : c)).join('/')}不因上限改而变，非零柱半高；截轴高度比${near ? '(12−6)/(8−6)=3' : '(15−5)/(10−5)=2'}，人数比3/2。已知日费${near ? '33/45/9，合87' : '28/38/8，合74'}NZD；零日仅必收${fee}，缺测日人数未知所以费用未知但至少${fee}，不能补零求完整总额。增加${high - low}，原基数${low}，增长1/2=50%；倒用新基数为1/3会换问题。反求(${high * fare + fee}−${fee})/${fare}=${high}人次，代回成立。另整包：${high}/${pack}=3包、${high}张、${3 * price}元；${high + 1}需4包${4 * pack}张${4 * price}元，不因相差一人仅加单张价。已知三日人次和${low + high}不是四日总量/不同人数；缺测、重复来访及原因未定，不造数据或因果。`,
    `Original ${counts.map((c) => (c === null ? 'missing' : c)).join('/')} is unchanged by the axis maximum; nonzero bars halve. Truncated height ratio ${near ? '(12−6)/(8−6)=3' : '(15−5)/(10−5)=2'} differs from the count ratio 3/2. Known-day costs are ${near ? '33/45/9, totalling 87' : '28/38/8, totalling 74'} NZD. Zero visits still incur ${fee}; the missing registered day has an unknown cost of AT LEAST ${fee}, so its full cost and the four-day total remain unknown. Increase=${high - low}, original base=${low}: proportion 1/2=50%; dividing by the new count instead gives 1/3 and changes the question. Inverse count=(${high * fare + fee}−${fee})/${fare}=${high}, checked by substitution. Separate packs: ${high}/${pack}=three packs, ${high} tickets, NZ$${3 * price}; ${high + 1} requires four packs, ${4 * pack} tickets, NZ$${4 * price}. One extra visit does not buy a single extra ticket. Known-day visits total ${low + high}, not a complete four-day total or distinct people. Missing values, repeat visits and causes remain unresolved.`,
    '保留原记录再画轴；费用先区分逐人项和每次固定项，反求时倒过来撤销步骤。',
    'Retain records before drawing axes. Separate per-visit and fixed daily charges; undo those steps in reverse order for inverse counts.',
  );
  table(q3, [
    ...counts.map(
      (c, i) =>
        [
          `D${i + 1}`,
          `第${i + 1}日人次`,
          `Day ${i + 1} visits`,
          c === null ? '缺测' : String(c),
          c === null ? 'Missing' : String(c),
        ] as [string, string, string, string, string],
    ),
    ['P', '每人收费', 'Per-visit charge', `NZ$${fare}`, `NZ$${fare}`],
    [
      'F',
      '每登记日必收组费，零人也收',
      'Mandatory daily group fee, even for zero visits',
      `NZ$${fee}`,
      `NZ$${fee}`,
    ],
  ]);

  const people = near ? 4 : 3,
    budget = near ? 80 : 90,
    reserve = near ? 10 : 20;
  const q4 = card(
    4,
    'trip-joint-constraints',
    `09:00出发，${people}人预算NZ$${budget}，完整预算预留${reserve}%，仅原门票减25%，最多240 min。按表先选绕行花园。① 自列原门票、减价额、折后票、整组往返、每人餐费、总支出、预留、账户剩钱与保护预留后的可用余额，检查两条约束；预留是已经花掉的费用吗？② 画从09:00起逐段首尾时刻，含去程、活动、午餐、返程、必须保留机动；等于时间/金钱上限是否满足？③ 独立把允许时间缩到210 min，钱不变是否仍可行？另独立只增加1人，组车费不变但票和餐费重算，检查两条约束。④ 回原人数、预算和240 min，另算直达步道，比较钱/时间与活动取舍；不声称只有一个可行解。⑤ 各自从原条件独立把门票减价改0%、100%，再把预留改0%，分别重算支出/可用额，不能把折扣用到整单或把预留按票价算。⑥ 若另有一张NZ$0.01票要减50%，会出现不足1分；没有舍入约定能自称精确到分吗？说明本题整数分模型范围。`,
    `Depart 09:00 with ${people} people, budget NZ$${budget}, ${reserve}% of the FULL budget reserved, 25% off ONLY original tickets and at most 240 min. Start with scenic garden from the table. ① Make a ledger of original tickets, saving, discounted tickets, GROUP return fare, PER-PERSON lunch, spending, reserve, account balance and spendable headroom AFTER protecting reserve. Check BOTH constraints. Is reserve money already spent? ② DRAW every segment’s start/end clock times, including outbound, visit, lunch, return and required buffer. Does equality at a money/time limit satisfy it? ③ Independently reduce allowed time to 210 min: does unchanged money imply feasibility? Separately add ONE person, keeping group fare fixed but recalculating tickets/lunch, then check both constraints. ④ Restore original people/budget/240 min and calculate direct trail. Compare money, time and activity preferences without claiming a unique feasible plan. ⑤ Independently restore original conditions before each change: ticket discount 0%, then 100%, then reserve 0%. Recalculate spending/available money, never discounting the entire bill or basing reserve on tickets. ⑥ Separately a NZ$0.01 ticket is 50% off, creating a fraction of one cent. With no rounding convention, may it be claimed exact to cents? Explain the whole-cent model limit.`,
    `绕行花园原票${people * 8}、省${people * 2}、付${people * 6}，组往返24、餐${people * 6}，总${24 + people * 12}NZD；预留${(budget * reserve) / 100}，可用72，账户余额${budget - (24 + people * 12)}与可用余额${72 - (24 + people * 12)}不同。预留保留未花，费用不超72。时间09:00–10:00去，10:00–11:00游，11:00–11:30餐，11:30–12:30返，12:30–13:00机动，共240，含机动等上限满足。缩210晚30min即不行。加一人支出${24 + (people + 1) * 12}，${near ? '超过72达12' : '恰等72'}，时间仍240，${near ? '费用失败' : '两项满足'}。直达步道交通40+票0+餐${people * 6}=${40 + people * 6}，时间40+90+30+40+30=230，12:50结束，可用余${72 - (40 + people * 6)}，都可行；活动偏好未定不宣唯一最优。无折扣支出${24 + people * 14}，可用72，${near ? '超8' : '余6'}；全免门票支出${24 + people * 6}、可用余${72 - (24 + people * 6)}；仅零预留支出仍${24 + people * 12}，可用${budget}余${budget - (24 + people * 12)}。各分支独立。1分票半价为0.5分，原整数分模型需明确舍入政策而非暗中截整；不冒真实票价或营业条件。`,
    `Scenic garden: original tickets ${people * 8}, saving ${people * 2}, discounted tickets ${people * 6}, GROUP return 24, lunch ${people * 6}, spending ${24 + people * 12} NZD. Reserve=${(budget * reserve) / 100}, available=72, account balance=${budget - (24 + people * 12)} and spendable headroom=${72 - (24 + people * 12)} differ. Reserve remains unspent; expense is at most 72. Timeline: outbound 09:00–10:00, visit 10:00–11:00, lunch 11:00–11:30, return 11:30–12:30, buffer 12:30–13:00. Total 240 including buffer equals the permitted limit. Reducing the limit to 210 fails by 30min. One added person gives spending ${24 + (people + 1) * 12}, ${near ? '12 over 72' : 'exactly 72'} and unchanged 240min: ${near ? 'money fails' : 'both constraints pass'}. Direct trail costs 40+0+${people * 6}=${40 + people * 6}, takes 40+90+30+40+30=230min, ends 12:50 and leaves ${72 - (40 + people * 6)} spendable. Both are feasible; activity preferences prevent a unique-optimal claim. No discount: spending ${24 + people * 14}, available 72, ${near ? 'short by eight' : 'headroom six'}. Free tickets: spending ${24 + people * 6}, headroom ${72 - (24 + people * 6)}. ONLY zero reserve: spending stays ${24 + people * 12}, available ${budget}, headroom ${budget - (24 + people * 12)}. Branches are independent. A one-cent ticket at half price costs half a cent: the whole-cent model needs a stated rounding policy, not silent truncation. No actual prices or opening conditions are claimed.`,
    '先用原价、单位与收费对象建账，再分别检查费用和时间；每个修改分支从同一原方案开始。',
    'Build the ledger from original prices, units and charge scope, then check money and time separately. Restart each independent change from the original plan.',
  );
  table(q4, [
    [
      'R1',
      '直达：单程时间；整组往返价',
      'Direct: one-way minutes; group RETURN fare',
      '40 min；NZ$40',
      '40 min; NZ$40',
    ],
    [
      'R2',
      '绕行：单程时间；整组往返价',
      'Scenic: one-way minutes; group RETURN fare',
      '60 min；NZ$24',
      '60 min; NZ$24',
    ],
    [
      'A1',
      '展馆：游览；原门票每人',
      'Museum: visit; original ticket per person',
      '90 min；NZ$12',
      '90 min; NZ$12',
    ],
    [
      'A2',
      '花园：游览；原门票每人',
      'Garden: visit; original ticket per person',
      '60 min；NZ$8',
      '60 min; NZ$8',
    ],
    [
      'A3',
      '步道：游览；门票',
      'Trail: visit; ticket',
      '90 min；NZ$0',
      '90 min; NZ$0',
    ],
    [
      'L',
      '午餐：时长；每人价',
      'Lunch: duration; per-person price',
      '30 min；NZ$6',
      '30 min; NZ$6',
    ],
    [
      'B',
      '必须机动；无另收费',
      'Required buffer; no extra charge',
      '30 min',
      '30 min',
    ],
  ]);
  return {
    id: `${unit}-MAINT-APPLIED-MEANING`,
    unit,
    title: t(
      '有单位的逆求、记录与联合约束',
      'Inverse quantities, records and joint constraints',
    ),
    bridge: 'P68-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 4, 5].map((l, i) => [id(i + 1), `P68-L0${l}`]),
    ),
    intro: t(
      '四张纸笔卡，一次一个编号小问、可分多次、不计时。第4卡同时核预算与旅行。数据完全虚构，先画图列账再逐项人审，允许口述/熟悉语言；读题协助与数学提示分开，无需真实出行、消费或水泵实验。',
      'Four paper cards, one numbered part per untimed sitting. Card four checks both budgeting and travel. All data are fictional. Draw diagrams and ledgers before human review of every requirement; oral/familiar-language responses are welcome and reading help is separate from mathematical hints. No real outing, spending or pump experiment is needed.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const appliedMeaningRetrieval = {
  J91_APPLIED_MEANING: makeSet('J91'),
  J92_APPLIED_MEANING: makeSet('J92'),
};
