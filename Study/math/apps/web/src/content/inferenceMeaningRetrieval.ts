import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J93' | 'J94') => {
  const near = unit === 'J93',
    id = (n: number) => `${unit}-MAINT-INFERENCE-MEANING-Q${n}`;
  type Row = [string, string, string, string, string?];
  const card = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    rows: Row[],
  ): Question => ({
    ...reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(
        '先保留每条ID、数量单位与完整分母；独立案例分别计算。列举要亲自逐条生成，不仅写总数。',
        'Retain every ID, quantity, unit and full denominator; calculate separate cases independently. Generate every requested outcome, not only a total count.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时；允许口述/熟悉语言。先画自己的图、表或集合，再逐项人审。读题协助与数学提示分开。',
        'One numbered part or independent case per untimed sitting; oral/familiar-language responses are welcome. Construct your own plot, table or set before human review of every part. Separate reading help from mathematical hints.',
      ),
    ]),
    contextTable: {
      caption: t(
        '给定虚构原条件；按题目指定组合相关行，独立情境不混用。',
        'Given fictional original conditions; combine related rows as specified, keeping separate contexts apart.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象/案例', 'Object/case'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    },
  });
  const population = near ? 24 : 36,
    values = near ? [2, 4, 6, 8] : [1, 3, 5, 7, 9, 11],
    invited = near ? 8 : 10,
    responded = near ? 5 : 6,
    yes = near ? 3 : 2,
    estimateN = near ? 100 : 80,
    estimateSample = near ? 10 : 8,
    estimateYes = near ? 2 : 3,
    mean = near ? 5 : 6;
  const q1 = card(
    1,
    'sample-population-and-frame',
    'S/R/E是三个独立案例。① S的研究单位是什么？分别写总体条数、已完整取得的样本条数、未测条数与样本占总体的比例，求样本总和与精确均值。总体是未抽的剩余吗，能把样本与总体相加吗？只知道这几条能知道总体均值吗？给未测记录全为0与全为10min两个可行补全，分别算总体均值作反查；这些补全不是新观测。② R求未回答数、回答率及回答者中的“是”比例，分别写分母身份。未回答都能补“否”或0min吗？对全体意见能确定什么，进一步要核查什么？③ E在另给的适用设计前提下，用样本比例粗估目标总体有该特征的人数，说明为何不是普查确数。把抽样框收窄到单一便利组，再增加该组人数，能仅凭条数认证代表性吗？区分抽取机会、实际构成、非响应与随机波动。',
    'S/R/E are THREE SEPARATE cases. ① Identify S’s observation unit. Give population count, fully observed sample count, unmeasured count and sampling fraction; calculate the sample total and exact mean. Is the population only the remainder, or the sample plus the stated population? Does this sample identify its population mean? Complete all unmeasured values first with zero, then separately with ten minutes, computing both population means as counterexamples; these completions are not observations. ② For R find nonresponse count, response fraction and respondent-yes fraction, naming EACH denominator. May every nonresponse be filled with no or zero minutes? What remains unknown about the whole target, and what further evidence is needed? ③ Under E’s SEPARATE suitable-design premise, use its sample proportion for a rough target count. Why is it not a census fact? Does taking more of one restricted convenience group certify representativeness? Distinguish eligibility, realised composition, nonresponse and random variation.',
    `S每条单位为一次通勤记录，总体${population}含样本${values.length}，未测${population - values.length}；样本比${values.length}/${population}=1/6，总和${mean * values.length}min，均值${mean}min。不能用剩余作总体或相加。未测全0的总体均值${near ? '5/6' : '1'}min，全10为${near ? '55/6' : '28/3'}min，均与同一已知样本相容，故总体均值不定；不能把假补全当观测。R未答${invited - responded}，回答率${responded}/${invited}=${near ? '5/8' : '3/5'}，回答者是${yes}/${responded}=${near ? '3/5' : '1/3'}，两个分母不同；未答未知，不是“否”或零值。需原问题/回答、目标框、机会与未答原因，回答者比例不认证总体。E粗估${estimateN}×${estimateYes}/${estimateSample}=${(estimateN * estimateYes) / estimateSample}人，只在所给设计前提下的估计，非逐个普查；有限波动和潜在偏差仍需报告。扩大单一组不补框外机会，随机全框亦不保证每次组成/均值准确。`,
    `S observes commute records: population ${population} INCLUDES ${values.length} measured records; ${population - values.length} remain unmeasured. Sampling fraction=${values.length}/${population}=1/6, sample total=${mean * values.length}min and mean=${mean}min. Do not substitute the remainder for the population or add them. Zero-filled unmeasured values give population mean ${near ? '5/6' : '1'}min; ten-filled values give ${near ? '55/6' : '28/3'}min. Both match the observed sample, so its population mean is undetermined; invented completions are not data. R has ${invited - responded} nonresponses, response fraction ${responded}/${invited}=${near ? '5/8' : '3/5'}, and respondent-yes fraction ${yes}/${responded}=${near ? '3/5' : '1/3'}. Different denominators answer different questions. Missing is neither no nor zero. Seek question wording, raw replies, frame/opportunities and nonresponse causes; respondent proportions do not certify the target. E estimates ${estimateN}×${estimateYes}/${estimateSample}=${(estimateN * estimateYes) / estimateSample} members under its stated suitable-design premise, not a census. Retain sampling uncertainty and possible bias. More from one group does not restore omitted eligibility; a full random frame does not guarantee every realised composition or mean.`,
    [
      [
        'S',
        '独立完整观测样本',
        'Separate fully observed sample',
        `总体${population}条；本次测得下列${values.length}个不同ID的完整通勤min，其余未测`,
        `Population ${population} records; only the following ${values.length} distinct IDs have complete observed commute minutes; others unmeasured`,
      ],
      ...values.map(
        (v, i) => [`S${i + 1}`, 'S通勤/min', 'S commute/min', String(v)] as Row,
      ),
      [
        'R',
        '独立邀请与回应',
        'Separate invitations/responses',
        `邀请${invited}个不同ID，${responded}回答，其中${yes}是，其余回答为否；未答未知`,
        `Invite ${invited} distinct IDs; ${responded} respond, ${yes} yes and other respondents no; nonrespondents unknown`,
      ],
      [
        'E',
        '独立比例粗估',
        'Separate rough proportion estimate',
        `目标${estimateN}人；设计另假定适合用样本比例粗估，完整样本${estimateSample}人中${estimateYes}有特征`,
        `Target ${estimateN}; separately assume a design suitable for rough proportional estimation, with ${estimateYes} feature holders among ${estimateSample} complete sampled members`,
      ],
    ],
  );

  const centre = near ? 2 : 4,
    a = [centre, centre, centre, centre],
    b = near ? [0, 0, 4, 4] : [1, 1, 7, 7],
    shift = near ? 3 : -1,
    range = b[3]! - b[0]!,
    moved = b.map((x) => x + shift);
  const q2 = card(
    2,
    'distribution-centre-spread-shape',
    '① 保A1–A4、B1–B4全部身份，在同单位、同一0–10横轴画两组点图，重复值逐个堆叠。各求均值、中位数、极差，描述簇/空隙与分散。均值相同是否分布相同？B均值处有实际记录吗？A极差0能说没有记录吗？求B中最大值的相对频数，不能把分母改成不同值种数。② 从原B逐条作D指定的纯平移，写每个B原ID的新值、同轴重画，再求三种摘要。说明哪项改变，哪些距离、重复结构、形状与极差保持；不能只背“加常数”。③ 若两张图各自伸缩到占满同样宽度，可以凭外观判同分散吗？这些虚构小批图能证明原因或总体形状吗？说明为什么一个平均数不能代完整分布。',
    '① Retain ALL A1–A4 and B1–B4 IDs and draw dot plots on a COMMON same-unit 0–10 axis, stacking duplicate observations separately. For each group compute mean, median and range, describing clusters, gaps and spread. Do equal means imply identical distributions? Is B’s mean an observed value? Does A’s zero range mean no records? Find the relative frequency of B’s maximum using observations rather than distinct-value names as the denominator. ② Translate EACH original B record by D, retain its ID, tabulate all new values and replot on the SAME axis, recomputing all three summaries. State which changes and which distances, repetitions, shape and range remain; do not merely quote a constant-shift slogan. ③ May separately stretching both plots to fill equal widths establish equal spread? Do these fictional small batches establish causes or a population distribution? Explain why a mean cannot replace the whole distribution.',
    `A/B均值与中位数均${centre}min；A极差0且有4条，B极差${range}min、两端各两条和中间空隙；B未观察到均值${centre}。B最大值频率2/4=1/2，不是2/2。纯平移${shift > 0 ? '+' : ''}${shift}后B1–B4为${moved.join('、')}min，均值与中位数${centre + shift}min、极差仍${range}min；每对差(xᵢ+d)−(xⱼ+d)=xᵢ−xⱼ，重复次数、形状及全跨度保持，中心移动${shift}。点图保每条ID与共同刻度，不能靠各自充满的外观比散布；同均值没保完整位置/频数信息。只描述这两批构造记录，不证原因、总体相同或未来；端点计数另依已读条件。`,
    `Both groups have mean and median ${centre}min. A has range zero but FOUR records; B has range ${range}min, two clusters and a central gap, with no observation at its mean ${centre}. B’s maximum frequency is 2/4=1/2, not 2/2. Translating by ${shift} gives B1–B4=${moved.join(',')}min, mean and median ${centre + shift}min, unchanged range ${range}min. Every pairwise difference (xᵢ+d)−(xⱼ+d)=xᵢ−xⱼ stays fixed, preserving repetitions, shape and full span while moving the centre by ${shift}. Keep every ID and a common scale. Filling separate panels does not establish equal spread, and equal means omit positional/frequency information. These constructed batches prove neither causes nor population/future equality; interval inclusion depends on its stated boundaries.`,
    [
      ...a.map(
        (v, i) => [`A${i + 1}`, 'A组/min', 'Group A/min', String(v)] as Row,
      ),
      ...b.map(
        (v, i) => [`B${i + 1}`, 'B组/min', 'Group B/min', String(v)] as Row,
      ),
      [
        'D',
        '仅平移原B',
        'Translate original B only',
        `每条x′=x${shift > 0 ? '+' : ''}${shift}；两图共同0–10min轴`,
        `Each x′=x${shift > 0 ? '+' : ''}${shift}; plots share a 0–10min axis`,
      ],
    ],
  );
  const creationZh = ` ④ 独立纸上创作：自拟完整八ID演示总体，分A/B各四条同单位记录，均值都为${near ? 3 : 5}min而极差不同；不能只照抄原表。画同轴点图，核全部摘要。声明仅A有抽取资格的框，它能覆盖全体吗，偶然均值吻合能认证方法吗？从你原B只改一个ID的新值，保留原值/新值与虚构更改依据，重新求均值、中位数及均值变化，并以总和变化÷4复核。承认这是设定的纸上资料，不是实测或可以任意更改真实记录。`;
  const creationEn = ` ④ In a separate creative sitting, invent a COMPLETE eight-ID demonstration population in groups A/B with four same-unit observations each, both means ${near ? 3 : 5}min but different ranges; do not just copy the table. Plot on common axes and verify all summaries. Declare a frame allowing only A: does it cover the target, and can an accidentally matching mean certify the method? Change only ONE ID in your original B, retaining old/new values and a fictional reason. Recompute mean, median and mean change, checking total change divided by FOUR. Identify these as invented paper data, neither measurements nor permission to edit real records arbitrarily.`;
  q2.stem = t(q2.stem.zh + creationZh, q2.stem.en + creationEn);
  q2.solution = t(
    `${q2.solution.zh} 自创例仅供复核，其他满足约束的方案亦接受：${near ? 'A=3,3,3,3与B=1,1,5,5，均值/中位都3，极差0/4；独立把B4的5设为9，改后均值4、中位3，均值增(9−5)/4=1。' : 'A=5,5,5,5与B=2,2,8,8，均值/中位都5，极差0/6；独立把B4的8设为0，改后均值3、中位2，均值变(0−8)/4=−2。'}完整总体8，A框4漏B，A均值本次碰巧等总体均值不证明框有一般代表性。核所有ID、同轴图、原/新两套记录与更改条件；只有已核真实错误才可在实际资料中透明更正。`,
    `${q2.solution.en} Accept ANY original construction meeting every constraint. Audit example only: ${near ? 'A=3,3,3,3 and B=1,1,5,5 each have mean/median three and ranges zero/four. Separately set B4 from five to nine: new mean four, median three, mean change (9−5)/4=one.' : 'A=5,5,5,5 and B=2,2,8,8 each have mean/median five and ranges zero/six. Separately set B4 from eight to zero: new mean three, median two, mean change (0−8)/4=−2.'} The complete target has eight IDs but A-only frame four omits B. Its coincidentally correct mean does not certify general representativeness. Review all IDs, common-axis plots, original/new records and change conditions. Real data require a verified error and transparent correction, not an invented replacement.`,
  );
  q2.answer = { kind: 'explain', rubric: q2.solution };
  q2.solutionSteps = [q2.solution];

  const tokens = near ? ['R1', 'B1', 'B2'] : ['R1', 'R2', 'B1', 'B2'],
    red = near ? 1 : 2,
    blue = 2,
    total = tokens.length,
    all = (replace: boolean) =>
      tokens.flatMap((x) =>
        tokens.filter((y) => replace || x !== y).map((y) => `${x}-${y}`),
      ),
    withIDs = all(true),
    withoutIDs = all(false);
  const q3 = card(
    3,
    'complete-equally-likely-space',
    'W/N两个分支各从原袋独立开始。① 每个分支亲自逐条列完整有序编号空间，以“第一ID-第二ID”记，按第一ID分组，不仅写乘法总数。核不漏/不重、反序、同色不同ID与同ID对角线；解释每条基本结果为何等可能。再按RR/RB/BR/BB分组数权重，颜色类别一般等可能吗？② 在每个分支已列的编号表各加“至少一蓝”“恰一次蓝”两栏，逐行勾记以表示完整符合ID子集，再求精确概率，无需重抄代码；哪组含BB？用RR补事件及RB+BR+BB两法复核至少一蓝，用每支剩余数量写条件分数。③ 找其中不可能的颜色路径，解释零概率与没有实验结果不同。集合条目换书写顺序和把一条代码内部两次交换有何区别？若下一轮要重复同一模型，怎样恢复袋内状态？过去偏多某色能强迫补偿吗？不需要真实抽球。',
    'Branches W/N each start INDEPENDENTLY from the original bag. ① In EACH branch, LIST EVERY ordered-ID outcome as firstID-secondID, grouped by first ID; a multiplication total alone is insufficient. Audit omissions, duplicates, reversed paths, distinct same-colour IDs and same-ID diagonal entries. Justify equal likelihood of each basic outcome. Aggregate RR/RB/BR/BB counts: are colour categories generally equal? ② In EACH branch add AT LEAST one blue and EXACTLY one blue columns to your complete ID list and mark every qualifying row to represent both FULL subsets, then calculate exact probabilities; no code recopying is needed. Which includes BB? Recheck at least one blue by the complement of RR and by adding RB+BR+BB, stating conditional fractions from remaining counts. ③ Identify impossible colour paths and distinguish zero event probability from no defined experiment. Contrast reordering set entries with reversing the two IDs inside a code. How must a new round restore this model, and can a past colour excess force compensation? No physical draw is required.',
    `W完整${withIDs.length}条：${withIDs.join(',')}；N完整${withoutIDs.length}条：${withoutIDs.join(',')}。W每条1/${total * total}，N每条1/${total * (total - 1)}，因为首步各1/${total}、次步分别1/${total}或1/${total - 1}；同色不同ID保留，N只排同ID，反序为不同路径。W颜色数${near ? '1/2/2/4' : '4/4/4/4'}、N为${near ? '0/2/2/2' : '2/4/4/2'}，因此不能只数颜色名平均。${near ? 'W至少蓝8/9、恰一次4/9；N至少蓝1、恰一次2/3。N首红后无红，RR0。' : 'W至少蓝3/4、恰一次1/2；N至少蓝5/6、恰一次2/3，N无零颜色类。'}至少一蓝集合是全部编号对排RR，恰一次只留RB/BR（须在完整编号表逐行标出子集）；两者差BB。补事件1−P(RR)与互斥RB+BR+BB一致；用${red}/${total}及抽后红${red - 1}/${total - 1}或放回${red}/${total}核RR，BB同理先${blue}/${total}再${blue - 1}/${total - 1}或${blue}/${total}。若某色为0概率，实验仍有其他结果，不是0/0。集合外部排列不改成员，代码内反序在记录先后时是另一基本结果；轮内按W/N，轮间回原袋并混匀才复同模型。过去频率不令下一轮补偿，不把虚构列表叫实测。`,
    `W contains ALL ${withIDs.length}: ${withIDs.join(',')}. N contains ALL ${withoutIDs.length}: ${withoutIDs.join(',')}. Each W outcome has probability 1/${total * total}; each N outcome 1/${total * (total - 1)}, from first 1/${total} times second 1/${total} or 1/${total - 1}. Retain distinct same-colour IDs; N excludes only the same ID, and reversal is a different recorded path. W colour counts=${near ? '1,2,2,4' : '4,4,4,4'}; N=${near ? '0,2,2,2' : '2,4,4,2'}. Thus colour-name counts alone do not set probabilities. ${near ? 'W: at least blue 8/9, exactly one 4/9; N: at least blue one, exactly one 2/3. N first red leaves no red, making RR zero.' : 'W: at least blue 3/4, exactly one 1/2; N: at least blue 5/6, exactly one 2/3, with no impossible colour class.'} At-least’s ID subset is all pairs except RR; exactly-one retains RB/BR only (require each subset marked row by row in the complete ID table). Their difference is BB. Complement 1−P(RR) equals disjoint RB+BR+BB. RR uses ${red}/${total} times conditional ${red - 1}/${total - 1} without replacement or ${red}/${total} with replacement; BB similarly uses ${blue}/${total} then ${blue - 1}/${total - 1} or ${blue}/${total}. A zero event still leaves other experiment outcomes; it is not undefined 0/0. Reordering set entries preserves membership, whereas reversing IDs changes a recorded path. Apply W/N within rounds and restore/remix the original bag between rounds. Past frequencies force no compensation; fictional enumerations are not measurements.`,
    [
      ...tokens.map(
        (v) =>
          [
            v,
            '同大编号球',
            'Same-sized identified token',
            v.startsWith('R') ? '红/R' : '蓝/B',
          ] as Row,
      ),
      [
        'W',
        '独立放回分支',
        'Independent replacement branch',
        '抽两次，每次放回并混匀；每步各编号等可能',
        'Two draws; replace and remix, each available ID equally likely at each step',
      ],
      [
        'N',
        '独立不放回分支',
        'Independent no-replacement branch',
        '另从原袋抽两次，首球不放回；每步余球各编号等可能',
        'Start from the original bag, draw twice without replacement; each remaining ID equally likely at each step',
      ],
    ],
  );
  return {
    id: `${unit}-MAINT-INFERENCE-MEANING`,
    unit,
    bridge: 'J76-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 4].map((l, i) => [id(i + 1), `J76-L0${l}`]),
    ),
    title: t(
      '样本分母、分布平移与完整有序结果',
      'Sample denominators, shifted distributions and complete ordered outcomes',
    ),
    intro: t(
      '三张独立纸笔卡，按编号或独立案例分多次、不计时。原九题、异常值及区间维护继续保留；新要求另存记录。先自行生成表、图、完整集合和解释，再逐项人审；可口述或用熟悉语言，读题协助和数学提示分开。全为虚构资料，无需调查或真实抽球。',
      'Three independent paper cards split by numbered part or separate case across untimed sittings. Original nine-task, unusual-record and interval retrievals remain; new requirements keep separate records. Generate tables, plots, complete sets and reasons before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. All data are fictional, needing no survey or physical draw.',
    ),
    questions: [q1, q2, q3],
  };
};
export const inferenceMeaningRetrieval = {
  J93_INFERENCE_MEANING: makeSet('J93'),
  J94_INFERENCE_MEANING: makeSet('J94'),
};
