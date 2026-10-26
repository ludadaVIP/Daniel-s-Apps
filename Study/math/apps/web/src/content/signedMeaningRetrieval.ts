import { t, type Question } from '../model';
import { reasoning } from './builders';
import { signedLabel } from '../signedModels';
const s = (n: number) => signedLabel(n, true);
const makeSet = (unit: 'P67' | 'J75') => {
  const near = unit === 'P67',
    id = (n: number) => `${unit}-MAINT-SIGNED-MEANING-Q${n}`;
  const task = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '可分多次，一次一个编号小问或一行。先自己画刻度/数轴和写理由，再逐项人工核查。读题协助与数学提示分开。',
        'Split across sittings, ONE numbered part or row at a time. Draw scales/axes and give your own reasons before human review of EVERY requirement. Separate reading assistance from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '编号给定原条件；独立分支按题干区分。所求读数、位置、变化与距离须自行生成。',
        'IDs give original conditions. Separate branches are identified in the prompt. Generate requested readings, positions, changes and distances yourself.',
      ),
      columns: [t('编号', 'ID'), t('条件', 'Condition'), t('给定值', 'Given')],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const below = near ? 1 : 3,
    temp = -5 - below;
  const q1 = task(
    1,
    'signed-temperature-reference',
    '① 每小格仍1°C，只每5格印数字。指示在A下方G个小格，先自己画完整一度刻度和稀疏标签，读带符号的摄氏值；把数字印密会改变指示高度、读数或实际单位吗？数起点线还是跨过的间隔，漏负号会去哪里？② 另从−1°C连续升高两次、每次1°C，逐次标读数，说明0°C、+0°C、−0°C是否另有位置，零既非正也非负是否等于“没有温度”。③ 显示窗只到−15°C，亲给一个低于窗底、却不被这张图排除的合理假想摄氏读数；不把图窗或0°C称最低。保留给定1°C间隔，不把数字标签相差5当每小格5。',
    '① Every small interval is STILL 1°C, with numbers printed only every fifth interval. The indicator is G small intervals BELOW A. DRAW the one-degree ticks and sparse labels, then give the SIGNED Celsius reading. Does printing more labels alter the indicator, reading or unit? Count starting ticks or crossed intervals? Where would omitting the minus sign place the reading? ② SEPARATELY start at −1°C and rise twice by 1°C each time. Mark both successive readings. Are 0°C,+0°C,−0°C different positions? Does being neither positive nor negative mean no temperature exists? ③ The displayed window stops at −15°C. GENERATE one reasonable fictional reading below that boundary not ruled out by this diagram. Neither the window nor 0°C is a minimum. Retain 1°C intervals, not 5°C intervals merely because printed labels differ by five.',
    `A=−5°C，向下${below}个1°C间隔得${s(temp)}°C；零到该位置跨${-temp}间隔，起点零线不算一度。漏负号变${-temp}°C，是零上另一位置；印密标签不改读数或高度。另−1→0→+1°C，0、+0、−0同一零参照，非正非负但仍是摄氏读数，不是没有温度。窗底−15只限图示，例如−16°C可在扩展刻度标出；本题不要求物理极限知识或真实测温。每度小格不因5度数字标签改变。`,
    `A=−5°C and ${below} one-degree moves downward give ${s(temp)}°C. From zero this crosses ${-temp} intervals; the starting tick is not a completed degree. Omitting the sign gives ${-temp}°C ABOVE zero. Denser labels change neither value nor height. The SEPARATE sequence is −1→0→+1°C. The notations 0,+0,−0 share one zero reference: neither positive nor negative, but still a temperature reading. A displayed bottom at −15 limits the picture; for example −16°C can appear on an extended scale. No physical-limit facts or actual measurement are required. Five-degree printed labels do not change the one-degree small intervals.`,
    '先找−5°C与零，再每次向下一个一度间隔，不数已站着的起点。',
    'Locate −5°C and zero, then count downward one-degree intervals rather than the starting tick.',
  );
  table(q1, [
    ['A', '已标摄氏参照/°C', 'Labelled Celsius anchor/°C', '−5'],
    ['G', '指示在A下方的小间隔数', 'Small intervals below A', String(below)],
    ['U', '每个小间隔/°C', 'Each small interval/°C', '1'],
  ]);

  const steps = near ? 6 : 8,
    p = -steps;
  const q2 = task(
    2,
    'integer-axis-position',
    '① 画向右增大的等单位数轴，从0向左N次，每次1单位，逐步标所有停点；从0到P共有几间隔、连同两端有几条刻度线？零能算第一次已走步吗？写P及左右紧邻整数。② 保原点和单位，改为每4格才印数字，P若不印数是否消失？再把显示窗从−12…+12扩到−16…+16，重标0与P，给一个原窗外但仍是整数的位置。按钮在−12停用能证明整数到此结束吗？③ 把+0、−0、0画在同一条轴，并分类为整数、正数或负数。另给P右邻作反查：向右一格如何改变负整数，不能把负半轴另画成向左增大。',
    '① DRAW an equally spaced rightward-increasing axis. From zero move LEFT N times, one unit each, marking EVERY stop. How many intervals connect zero to P, and how many ticks including both endpoints? Is zero already a completed step? Give P and its immediate integer neighbours. ② Keep zero and the unit but print only every fourth number: does an unlabelled P disappear? Extend the window from −12…+12 to −16…+16 and relabel zero/P. GENERATE an integer outside the original window. Does a disabled button at −12 prove that integers stop there? ③ Place +0,−0,0 on the same line and classify zero as integer, positive or negative. Check P’s right neighbour: how does one rightward step change a negative integer, without reversing the negative half-axis?',
    `N=${steps}，从0逐次−1到${p}，共${steps}间隔、含端点${steps + 1}条线；零未走一步。P=${p}，左邻${p - 1}、右邻${p + 1}；右移增大1。稀疏标签不改变P或每格单位，未印数仍有位置。扩窗后0和P的数值不变，每格仍1，例−13是原窗外的有效整数，可在新窗标；原−12操作边界不定义整数终点。+0、−0、0重合，零是整数但既非正也非负，不能分成两个起点。`,
    `N=${steps}: stops run from −1 through ${p}, crossing ${steps} intervals with ${steps + 1} boundary ticks INCLUDING both endpoints. Zero has not completed a step. P=${p}, left neighbour=${p - 1}, right neighbour=${p + 1}; a rightward step adds one. Sparse labels retain the point and unit. Extending the window preserves zero/P values and unit spacing; −13 is one valid integer outside the original window. The old button limit at −12 does not end the integers. +0,−0,0 coincide: zero is an integer, neither positive nor negative, not two starting points.`,
    '相邻两条线才围一个间隔；换视窗或少印数字，不改原位置所代表的整数。',
    'Two adjacent ticks enclose one interval. A new window or fewer labels does not change the represented integer.',
  );
  table(q2, [
    [
      'N',
      '从零向左的一单位移动次数',
      'One-unit leftward moves from zero',
      String(steps),
    ],
    ['U', '每间隔单位数', 'Units per interval', '1'],
  ]);

  const a = near ? -10 : -11,
    b = near ? -3 : -4,
    c = -b;
  const q3 = task(
    3,
    'negative-number-order',
    '① A、B、0、C在同一向右增大的单位轴上，自己定位、排序，并写A?B、B?0、A?C、B?B四个关系；同时指出A/B中较大与较小者，别只给无符号数码。重合点是否要错开画成两个不同位置？② 用A/B反驳“绝对值较大就数值较大”，再亲给两个正数反驳“所有数离零越近越大”。“两个负数中靠零较近者较大”的限定为什么不可丢？③ 若A与B是同单位假想摄氏读数，较暖者如何写完整符号与°C，两个都在零下就能省负号吗？再说明零大于负数却仍不是正数。',
    '① LOCATE A,B,0,C on one rightward-increasing unit axis, sort them and fill A?B,B?0,A?C,B?B. Identify BOTH larger and smaller values among A/B, retaining signs. Should coincident points be artificially separated? ② Use A/B to refute “larger absolute value means larger signed number”. GENERATE two POSITIVE numbers refuting “nearer zero is always larger”. Why must the shortcut “nearer zero is larger” be restricted to TWO NEGATIVE numbers? ③ If A/B were fictional Celsius readings, report the warmer one WITH its sign and °C. May minus signs be dropped because both are below zero? Explain why zero exceeds negatives without being positive.',
    `${a}<${b}<0<${c}；A<B、B<0、A<C、B=B，较大${b}、较小${a}。相同数同位置合标，不人为分开。|A|=${-a}>|B|=${-b}，但A<B，距离大小不能代替带符号顺序。正数反例可用${c}<${c + 2}：${c}较靠零却较小，其他有效正数反例也可。近零较大只限定两负数，根本依据是向右增大。较暖为${s(b)}°C仍零下，不能写+${-b}°C；0>B但零非正。`,
    `${a}<${b}<0<${c}. Thus A<B,B<0,A<C,B=B; larger=${b}, smaller=${a}. Equal values share one position. Although |A|=${-a}>|B|=${-b}, A<B, so distance does not determine signed order. A positive counterexample is ${c}<${c + 2}: the nearer ${c} is SMALLER; accept other valid positive examples. The nearer-zero shortcut applies to two negatives, while rightward-increasing order is fundamental. The warmer reading is ${s(b)}°C, still below zero, not +${-b}°C. Zero exceeds B but is not positive.`,
    '先完整保留每个负号，再问数轴哪点更靠右；反例须满足你正在检验的条件。',
    'Keep each minus sign, then ask which point lies right. A counterexample must satisfy the conditions of the claim it tests.',
  );
  table(q3, [
    ['A', '第一带符号整数', 'First signed integer', String(a)],
    ['B', '第二带符号整数', 'Second signed integer', String(b)],
    ['C', '给定正整数', 'Given positive integer', String(c)],
  ]);

  const start = near ? -5 : -4,
    move = near ? 7 : 6,
    small = near ? 3 : 2;
  const rows: { key: string; start: number; op: '+' | '−'; term: number }[] = [
    { key: 'R1', start, op: '+', term: move },
    { key: 'R2', start, op: '−', term: -move },
    { key: 'R3', start: near ? 3 : 2, op: '−', term: move },
    { key: 'R4', start, op: '+', term: -small },
    { key: 'R5', start, op: '−', term: -small },
    { key: 'R6', start, op: '+', term: -start },
    { key: 'R7', start, op: '−', term: 0 },
    { key: 'R8', start: near ? -10 : 10, op: '+', term: near ? -8 : 8 },
  ];
  const results = rows.map((r) => {
    const delta = r.op === '+' ? r.term : -r.term,
      end = r.start + delta;
    return {
      ...r,
      delta,
      end,
      distance: Math.abs(delta),
      cross: r.start * end < 0,
    };
  });
  const summaryZh = results
    .map(
      (r) =>
        `${r.key}：变化${s(r.delta)}、${r.delta < 0 ? '向左' : r.delta > 0 ? '向右' : '不移动'}，终点${s(r.end)}、距离${r.distance}`,
    )
    .join('；');
  const summaryEn = results
    .map(
      (r) =>
        `${r.key}: change=${s(r.delta)}, ${r.delta < 0 ? 'left' : r.delta > 0 ? 'right' : 'stay'}, endpoint=${s(r.end)}, distance=${r.distance}`,
    )
    .join('; ');
  const q4 = task(
    4,
    'signed-cross-zero-movement',
    '① 一次一行：按原起点、运算和带符号项，自行写带符号变化、方向、终点和距离，不把“减”与项的负号混成一个符号。R2/R5为什么撤销左向变化？保留原起点，不能把所有负号都改正。② 为R1/R3画两阶段箭头，标到零已走与剩余步；为R4/R5说明有无到零，检验向右是否保证终点为正。再区分R6恰到零、R7不移动、R8超过初窗±12：画足单位而不把终点截边。③ 每行用终点减变化核回；另把R1倒走，给反向变化与距离。终点数码、带符号变化、路程和到零距离能互换吗？',
    '① ONE ROW at a time: from the stated start, operation and SIGNED term, generate signed change, direction, endpoint and distance. Distinguish subtraction from a negative term. Why do R2/R5 undo leftward changes? Retain the original start rather than making every sign positive. ② DRAW two-stage arrows for R1/R3, marking steps to zero and remaining steps. Explain whether R4/R5 reach zero and whether moving right guarantees a positive endpoint. Distinguish R6 reaching zero exactly, R7 no movement, and R8 beyond the initial ±12 window: extend equal units without clipping the endpoint. ③ Check EVERY row by endpoint minus change. Reverse R1 and report reverse change and distance. Are endpoint, signed change, travel and distance to zero interchangeable?',
    `${summaryZh}。R1先${-start}格到零、余${start + move}格向右；R3先${near ? 3 : 2}格到零、余4格向左。R2/R5减负项是撤销对应左移，原起点不变；R5右移后仍${s(start + small)}，不保证为正。R4/R5未跨零；R6只到零、余0步，R7没有一格移动。R8扩窗到${near ? '−18…+12' : '−12…+18'}，保相同单位，端点${near ? '−18' : '+18'}不可截成±12。各行终点−带符号变化=原起点；R1倒走变化${s(-move)}、距离仍${move}，终点${s(start)}，原终点2不是走过距离。`,
    `${summaryEn}. R1 goes ${-start} units to zero, then ${start + move} right; R3 goes ${near ? 3 : 2} to zero, then four left. R2/R5 undo negative changes without changing the starting value. R5 moves right yet ends at ${s(start + small)}, still negative. R4/R5 do not cross zero; R6 reaches zero with no steps remaining, and R7 has no unit step. R8 needs window ${near ? '−18…+12' : '−12…+18'}, retaining equal spacing and endpoint ${near ? '−18' : '+18'}, not clipping at ±12. Every row has endpoint−change=start. Reversing R1 gives change ${s(-move)}, distance ${move} and endpoint ${s(start)}. Its forward endpoint two is not its travelled distance.`,
    '每行先把运算翻成一段有方向变化，再走完全部步数；只对真正跨零的行拆阶段。',
    'Translate each operation into a directed change, then complete ALL steps. Split at zero only when the path actually crosses it.',
  );
  q4.contextTable = {
    caption: t(
      '每行独立，原起点不承接上一行；只给条件，不填待求结果。',
      'Rows are INDEPENDENT: each starts from its own given value, not the preceding endpoint. Only conditions are supplied.',
    ),
    columns: [
      t('编号', 'ID'),
      t('起点', 'Start'),
      t('运算', 'Operation'),
      t('带符号项', 'Signed term'),
    ],
    rows: rows.map((r) =>
      [r.key, String(r.start), r.op, String(r.term)].map((v) => t(v, v)),
    ),
  };

  const p5 = near ? -7 : -9,
    q5 = near ? 4 : 5,
    r5 = near ? -2 : -3,
    d5 = near ? 5 : 6;
  const q5task = task(
    5,
    'absolute-value-distance',
    '① 亲画P、Q、R和0，分别给P/Q的原数、相反数、绝对值。哪些只是某一负数上碰巧相同，不能说两种概念一样？② 分别求P→Q、Q→P、P→R、R→P的带符号变化和非负距离，再与|P|比较；何时可把两点到零距离相加，何时重叠不能重计？标清每个距离的两端，不能把任何两点间距都称|P|。③ 自己生成两个不同整数，到零距离都为D；若另限负数呢？D改0有几处位置，D改负数可能吗？用具体点检验“绝对值必正”“同绝对值必同数”“绝对值就是相反数”。',
    '① DRAW P,Q,R and zero. Give the original value, opposite and absolute value of P and Q. Which equalities merely coincide for a negative value rather than identifying two concepts? ② Find SIGNED changes and NONNEGATIVE distances for P→Q,Q→P,P→R,R→P, then compare with |P|. When may distances to zero be added, and when would overlapping paths be double-counted? Mark BOTH endpoints of every measured distance. ③ GENERATE two distinct integers each D units from zero. What if the value must also be negative? How many positions when D=0, and is a negative D possible? Use concrete points to test “always positive”, “equal absolute values imply equal numbers” and “absolute value means opposite”.',
    `P=${p5}，相反数${-p5}、绝对值${-p5}，此处碰巧同；Q=${q5}，相反数${-q5}、绝对值${q5}，已不同。P→Q变化${s(q5 - p5)}、距离${q5 - p5}；反向变化${s(p5 - q5)}、距离不变。P→R变化${s(r5 - p5)}、距离${r5 - p5}，反向变化${s(p5 - r5)}、距离同。|P|=${-p5}只量P到0；跨零P/Q的两段可相加，同侧P/R要扣重叠，不是${-p5}+${-r5}。到零D=${d5}可取${-d5}与${d5}，仅限负数时取${-d5}；D=0只有0，负距离不可能。±${d5}不同数却同绝对值；|0|=0反驳必正，Q的正数例子反驳绝对值总等相反数。`,
    `P=${p5} has opposite ${-p5} and absolute value ${-p5}, coincident in THIS case. Q=${q5} instead has opposite ${-q5} and absolute value ${q5}. P→Q: change ${s(q5 - p5)}, distance ${q5 - p5}; reverse change ${s(p5 - q5)}, same distance. P→R: change ${s(r5 - p5)}, distance ${r5 - p5}; reversing changes the sign, not distance. |P|=${-p5} measures P to ZERO only. Across zero P/Q distances add; same-side P/R paths overlap, so adding ${-p5}+${-r5} double-counts. At distance D=${d5}, positions ${-d5} and ${d5} are distinct; a negative-value condition selects ${-d5}. D=0 has only zero, and negative distance is impossible. The pair ±${d5} refutes equal absolute values implying equal numbers; |0|=0 refutes strict positivity, and positive Q refutes equating absolute value with opposite.`,
    '每个距离先标“从哪里到哪里”；先画位置，再判断是否经过零与是否重复计段。',
    'Label both endpoints before calculating a distance. Draw positions to see whether the route crosses zero or overlaps.',
  );
  table(q5task, [
    ['P', '第一点整数', 'First point integer', String(p5)],
    ['Q', '第二点整数', 'Second point integer', String(q5)],
    ['R', '第三点整数', 'Third point integer', String(r5)],
    ['D', '另题到零距离', 'Separate distance to zero', String(d5)],
  ]);
  return {
    id: `${unit}-MAINT-SIGNED-MEANING`,
    unit,
    title: t(
      '读数、位置与有方向的变化',
      'Readings, positions and directed changes',
    ),
    bridge: 'P64-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P64-L0${n}`]),
    ),
    intro: t(
      '五张纸笔过程卡可分多次，一次一个编号小问或一行，不计时。先自己画图、数单位、写理由，再逐项人审。可口述或用熟悉语言；读题协助与数学提示分开。温度及移动全为假想，不需测温、查天气或真实出行。',
      'Five paper-and-pencil cards can span several sittings, ONE numbered part or row at a time without a timer. Draw, count units and explain independently before human review of every requirement. Oral or familiar-language explanations are welcome; distinguish reading assistance from mathematical hints. All temperatures and movements are fictional; no measurement, weather lookup or travel is needed.',
    ),
    questions: [q1, q2, q3, q4, q5task],
  };
};
export const signedMeaningRetrieval = {
  P67_SIGNED_MEANING: makeSet('P67'),
  J75_SIGNED_MEANING: makeSet('J75'),
};
