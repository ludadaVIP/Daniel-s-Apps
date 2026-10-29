import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H24' | 'H33') => {
  const near = unit === 'H24',
    n = near ? 4 : 5,
    b = n - 1,
    r = near ? 3 : 2,
    id = (i: number) => `${unit}-MAINT-PROBABILITY-MEANING-Q${i}`;
  const card = (
    i: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(i), t(z, en), skill, t(rz, re), [
      t(
        '先定义每个独立案例的总体或等可能编号空间，圈条件分母；把联合、条件、补事件、实际频率分别写。不要从类别名称、图窗或一次吻合猜结论。',
        'Define each separate population or equiprobable ID space and circle conditional denominators. Separate joint, conditional, complement and observed-frequency questions. Category names, display windows and one match do not establish a conclusion.',
      ),
      t(
        '一次一个编号，可分次不计时、口述或熟悉语言。读题协助与数学提示分开；自主方案接受不同合法答案，全部理由由家长阅读。资料是虚构纸上模型或明确注明的教学程序记录，无需真实调查、购买、上传。',
        'One numbered part per untimed sitting; oral or familiar-language work is welcome. Separate reading assistance from mathematical hints. Accept different valid own designs after human review. These are fictional paper models or explicitly labelled teaching-program records; no real survey, purchase or upload is required.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, caption: [string, string], rows: Row[]) => {
    q.contextTable = {
      caption: t(...caption),
      columns: [
        t('编号', 'ID'),
        t('独立案例', 'Separate case'),
        t('原资料', 'Original data'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const dPairs = near
    ? 'R1→B1;B1→R1;B2→B3;B3→B2'
    : 'R1→B1;B1→R1;B2→B3;B3→B4;B4→B2';
  const q1 = card(
    1,
    'probability-disjoint-zero-and-complement',
    '① M列出偶数/奇数事件，算交集和边际乘积，判断互斥与独立；结合旧Q3的可同时发生独立模型，反驳把两词当同义词。写一般理由：两个正概率互斥事件为何不独立？零概率事件边界改用已有COUNTING卡核，不进行零除。另按V的原A/B身份亲画四格表，再只转置行列显示而不换事件，各概率与独立结论变吗？与真正更换已知条件有何不同？② T亲画两层不放回条件树，首红后第二红的条件概率与完整RR各是多少？再算BB，核每个可到达节点的出枝和1；同色为何仍可发生？Z独立全蓝袋的首红不可能，在该节点问次红是0还是未定义？直接由空间判RR的联合概率，不能乘一个未定义条件。③ C用旧Q1已生成的完整编号空间，分别由1−P(RR)和RB+BR+BB求至少一次蓝，区别两次蓝和颜色不同。④ E在表给不放回袋内，A=第一抽R1，D=表列有序对的集合。亲数A、D、交集与总数，用乘积判据决定这两个具体事件是否独立；再与第一红/第二红比较，解释“不放回”不能代替对任意事件的判断。',
    '① For M, list even/odd events and calculate intersection and marginal product. Decide disjointness and independence, contrasting the old Q3 independent model where both can occur. Give the general reason two positive-probability disjoint events are dependent. Use the existing COUNTING cards for zero-event boundaries without division by zero. For V, DRAW its complete table, then transpose ONLY its display while preserving original A/B identities. Do probabilities or independence change? Distinguish this from changing the actual conditioning event. ② DRAW T’s no-replacement conditional tree. Find second red GIVEN first red and the COMPLETE RR probability separately; also find BB and check outgoing sums at every reachable node. Why can the same colour still occur? In separate all-blue Z, first red is impossible: is second red given that node zero or undefined? Determine joint RR directly from the space rather than multiplying an undefined conditional. ③ Using old Q1’s complete ID space for C, find at least one blue BOTH as 1−P(RR) and RB+BR+BB. Distinguish two blues and different colours. ④ For E, A=first R1 and D=the listed set of ordered pairs. Count A,D,intersection and all outcomes. Test independence of THESE events by products, then contrast first red/second red. Why does no replacement not determine every possible event pair’s dependence?',
    `M偶/奇各1/2、交集0、乘积1/4，互斥但不独立；一般P(A)>0且P(B)>0使乘积正，不能等于互斥交集0。旧Q3交集正且等乘积，独立可同时发生。V原A行/B列转成B行/A列后四格按显示顺序为${near ? '2,4,2,4' : '3,9,2,6'}；原A概率仍${near ? '1/3' : '1/4'}、原B仍${near ? '1/2' : '3/5'}、交集仍${near ? '1/6' : '3/20'}，独立不变。事件身份随标签追踪，不把转置当真的从已知A改为已知B。T有1红${b}蓝，首红1/${n}>0后余${b}蓝，次红条件0/${b}=0，RR=(1/${n})×0=0；BB=${b}/${n}×${b - 1}/${b}=${near ? '1/2' : '3/5'}，并非所有同色不可能。首红后出枝0+1=1；首蓝后红1/${b}、蓝${b - 1}/${b}合1。Z全蓝${near ? 2 : 3}球，首红0，通常条件P(次红|首红)=0/0未定义，直接知RR无编号结果、联合0；不要写0×未定义。C原${r}红2蓝，RR=${near ? '3/10' : '1/6'}，至少蓝=${near ? '7/10' : '5/6'}；也由${near ? '3/10+3/10+1/10' : '1/3+1/3+1/6'}求和。BB=${near ? '1/10' : '1/6'}，异色=${near ? '3/5' : '2/3'}，事件不同。E总${n * (n - 1)}个等可能有序对，A有${n - 1}、D有${n}、交集仅R1→B1一个；P(A)=1/${n}，P(D)=1/${n - 1}，交集1/${n * (n - 1)}等乘积，故两个非平凡事件独立。首红/次红各1/${n}而交集0，不独立；同一不放回空间内不同事件可有不同结论。`,
    `M even/odd each has probability 1/2, intersection zero and product 1/4: disjoint and dependent. Generally two positive marginals have positive product, unlike a disjoint zero intersection. Old Q3 has positive intersection equal to its product, so independent events can co-occur. V transposes from A-rows/B-columns to B-rows/A-columns with display-order counts ${near ? '2,4,2,4' : '3,9,2,6'}. Original P(A)=${near ? '1/3' : '1/4'}, P(B)=${near ? '1/2' : '3/5'} and intersection=${near ? '1/6' : '3/20'} remain unchanged, as does independence. Follow original event labels; display transposition is not switching the actual conditioning event. T has one red and ${b} blue. Given first red, second-red probability is 0/${b}=0; complete RR=(1/${n})×0=0. BB=${b}/${n}×${b - 1}/${b}=${near ? '1/2' : '3/5'}, so same colour remains possible. After red outgoing probabilities are 0+1=1; after blue they are 1/${b} and ${b - 1}/${b}, summing to one. In all-blue Z, first red has probability zero and the ordinary conditional is undefined 0/0. Joint RR is zero because it contains no outcomes, not from multiplying an undefined conditional. C has ${r} red and two blue: RR=${near ? '3/10' : '1/6'}; at least blue=${near ? '7/10' : '5/6'} by complement or ${near ? '3/10+3/10+1/10' : '1/3+1/3+1/6'}. Two-blue probability ${near ? '1/10' : '1/6'} and different-colour ${near ? '3/5' : '2/3'} describe different events. E has ${n * (n - 1)} ordered equiprobable outcomes: ${n - 1} in A, ${n} in D and only R1→B1 in their intersection. Thus P(A)=1/${n},P(D)=1/${n - 1},intersection=1/${n * (n - 1)}, equal to the product: two nontrivial independent events. First-red/second-red marginals are each 1/${n} but intersection zero, hence dependent. Different events in the SAME no-replacement space can have different independence conclusions.`,
  );
  table(
    q1,
    [
      '各案例分别审。M是一次均匀整数取值，V是完整等可能编号四格模型；抽球案例每次对当时可用编号均匀抽取，两抽一轮。E沿用T袋研究同一轮内的两个事件。Z在纸上审零条件，不需滑块改0。',
      'Audit cases separately. M is one uniform integer outcome, V a complete equiprobable-ID four-cell model; token cases use uniform eligible-ID draws, two per round. E uses T’s bag for two events in the same round. Audit Z’s zero condition on paper, without a zero slider.',
    ],
    [
      [
        'M',
        '独立均匀整数模型',
        'Separate uniform-integer model',
        `等可能1..${near ? 6 : 8}；偶数A、奇数B`,
        `Equiprobable 1..${near ? 6 : 8}; A=even,B=odd`,
      ],
      [
        'V',
        '原模型只转置显示',
        'Original model: display transposition only',
        `完整等可能编号；A行/B列顺序AB,A非B,非AB,皆非=${near ? '2,2,4,4' : '3,2,9,6'}`,
        `Complete equiprobable IDs; A-rows/B-columns order AB,A-not-B,not-A-B,neither=${near ? '2,2,4,4' : '3,2,9,6'}`,
      ],
      [
        'T',
        '独立单红不放回袋',
        'Separate sole-red bag',
        `R1,B1..B${b}；不放回`,
        `R1,B1..B${b}; without replacement`,
      ],
      [
        'Z',
        '独立不可能首节点',
        'Separate impossible first node',
        `只有B1..B${near ? 2 : 3}；不放回`,
        `Only B1..B${near ? 2 : 3}; without replacement`,
      ],
      [
        'C',
        '原完整空间的补事件',
        'Complement in old full space',
        `R1..R${r},B1,B2；不放回`,
        `R1..R${r},B1,B2; without replacement`,
      ],
      [
        'E',
        '独立事件审计',
        'Specific event audit',
        `同T原袋；A=首R1；D={${dPairs}}`,
        `T original bag; A=first R1; D={${dPairs}}`,
      ],
    ],
  );
  const q2 = card(
    2,
    'probability-response-census-and-design',
    '① A中完整真值仅为核验设计公开：算全体比例及A框全问完的比例，亲标框外ID组；若研究对象改为A组，完整准确A回应能否确定这个新总体？再审C的完整准确全体普查，只能确定哪个总体，为什么不能推另一个学校/未来人群？旧H34已核重复设计偏差，不重做一般均值证明。② R独立只给邀请/回应/是，写未回答、回应率和回答者是比例，分别说分母是谁，不能把未回答补否或直接外推总体。Z独立无人回答：回应率与回答者是比例是否都为0？提出覆盖和回应两类修订，不能承诺每个小随机样本都恰真值。③ 自主画一个至少两组不同ID的虚构总体及二元记录，设计一次覆盖遗漏、一次全框但非回应、一次完整准确普查；分别写目标/框/邀请/回应/缺失和可支持的结论，再给一个偶然吻合仍不认证办法的例子。允许不同合法数字，不借公开真值代填独立R/Z未知回答。',
    '① A releases full truth ONLY to audit the design. Calculate the whole-population proportion and the A-frame census proportion; label omitted ID groups. If the target changes to A alone, do complete accurate A responses determine THAT population? Audit C’s complete accurate census: which population does it determine, and why not another school or future population? Retain old H34’s design-bias work without repeating its general mean proof. ② Separate R supplies invitations/responses/yes only. Find missing count, response rate and yes proportion AMONG RESPONDENTS, naming each denominator. Do not code missing as no or generalise automatically. Separate zero-response Z: are response rate and respondent yes proportion BOTH zero? Propose separate coverage/response improvements without promising every small random sample exactly matches truth. ③ DESIGN a fictional population with at least two distinct-ID groups and binary records: one undercoverage design, one full frame with nonresponse and one complete accurate census. State target/frame/invitations/responses/missingness and scoped conclusions for each, plus one coincidental match that does not certify the method. Different valid numbers are welcome. Never borrow released A truth to fill the independent R/Z unknown responses.',
    `A共${near ? 24 : 18}个不同ID，三组各${near ? 8 : 6}，是${near ? '2+4+6=12' : '1+3+5=9'}，总体1/2；A框完整比例${near ? '2/8=1/4' : '1/6'}，漏B/C共${near ? 16 : 12}个，框内普查不是原目标普查。若目标改为固定A组，全部准确A回应确可确定A比例；不再是对原全体的推断。C全体准确且无遗漏/缺失，固定目标比例1/2已确定、抽样变异消除，不保证测量无误的现实条件，也不推别处或未来。R邀请${near ? 10 : 9}、回应${near ? 6 : 5}、是${near ? 4 : 2}，未回答4；回应率${near ? '6/10=3/5' : '5/9'}，回应者是比例${near ? '4/6=2/3' : '2/5'}，分别以邀请和回应为分母。Z邀请3、回应0、是0，回应率0/3=0，但是/回应为0/0未定义。改进框让所有目标ID有已知入选机会，并改善跟进/记录非回应；随机与大样本不保证每次精确，匹配亦不证无偏。自主例须ID数/是/否/缺失一致、每个结论限其对象，不能因已知演示真值把未知回答当已观察。`,
    `A has ${near ? 24 : 18} distinct IDs, ${near ? 8 : 6} per group, with ${near ? '2+4+6=12' : '1+3+5=9'} yes: target proportion 1/2. The A-frame census gives ${near ? '2/8=1/4' : '1/6'} and omits ${near ? 16 : 12} B/C IDs; a frame census is not a target census. Changing the target to A alone makes complete accurate A responses sufficient for THAT target. C has complete accurate responses for every fixed target ID, determining 1/2 and removing sampling variation in this model; this is conditional on accuracy and does not generalise elsewhere or into the future. R invites ${near ? 10 : 9}, receives ${near ? 6 : 5} responses with ${near ? 4 : 2} yes, leaving four missing. Response rate=${near ? '6/10=3/5' : '5/9'} uses invitations; respondent yes=${near ? '4/6=2/3' : '2/5'} uses responses. Z has three invitations, zero responses and zero yes: response rate 0/3=0, but respondent yes is undefined 0/0. Improve frame coverage with known selection chances for target IDs, and improve follow-up/record nonresponse separately. Randomness and size do not guarantee exact individual samples; one match does not certify unbiasedness. Own designs must retain IDs, consistent yes/no/missing counts and scoped conclusions without treating released demonstration truth as observed unknown responses.`,
  );
  table(
    q2,
    [
      '各行独立；A公开全体真值是设计演示，R/Z只允许给定回应记录。C声明准确、完整、无遗漏。',
      'Rows are independent. A releases truth for a design demonstration; R/Z permit only their response records. C stipulates accurate complete records without omissions.',
    ],
    [
      [
        'A',
        '全体与受限框',
        'Target and restricted frame',
        `A/B/C各${near ? 8 : 6}个ID，是数${near ? '2/4/6' : '1/3/5'}；只邀请A全体且均回应`,
        `A/B/C each ${near ? 8 : 6} IDs, yes counts ${near ? '2/4/6' : '1/3/5'}; invite all A, all respond`,
      ],
      [
        'C',
        '独立全体普查',
        'Separate full census',
        `A/B/C各${near ? 8 : 6}，是${near ? '2/4/6' : '1/3/5'}；全部准确回应`,
        `A/B/C each ${near ? 8 : 6}, yes ${near ? '2/4/6' : '1/3/5'}; all respond accurately`,
      ],
      [
        'R',
        '独立非回应记录',
        'Separate nonresponse record',
        `邀请${near ? 10 : 9}；回应${near ? 6 : 5}；其中是${near ? 4 : 2}；其余未知`,
        `Invited ${near ? 10 : 9}; responded ${near ? 6 : 5}; yes ${near ? 4 : 2}; others unknown`,
      ],
      [
        'Z',
        '独立零回应',
        'Separate zero responses',
        '邀请3；回应0；已观察是0；三人回答未知',
        'Invited 3; responded 0; observed yes 0; all three answers unknown',
      ],
    ],
  );
  const records = near
    ? [
        [
          'R2-B1',
          'R1-R2',
          'R1-R3',
          'R2-B1',
          'R2-B1',
          'R3-R1',
          'B1-R1',
          'R3-B2',
          'R2-B2',
          'R3-R2',
          'R1-R3',
          'R1-B2',
        ],
        [
          'R2-B1',
          'B2-R1',
          'B1-R1',
          'B1-R2',
          'B2-B1',
          'R1-B2',
          'B1-R1',
          'B1-R1',
          'R3-B2',
          'B1-R2',
          'B1-B2',
          'B2-B1',
        ],
      ]
    : [
        [
          'R2-B1',
          'R1-R2',
          'R1-R2',
          'R2-B1',
          'R2-B2',
          'B1-R1',
          'B2-R1',
          'R2-B2',
          'R2-B2',
          'R2-B1',
          'R1-B1',
          'R1-B2',
        ],
        [
          'R2-B2',
          'B2-R1',
          'B1-R1',
          'B1-R2',
          'B2-B1',
          'R1-B2',
          'B1-R1',
          'B1-R1',
          'B1-B2',
          'B1-R2',
          'B2-B1',
          'B2-B1',
        ],
      ];
  const q3 = card(
    3,
    'probability-prefix-weighted-frequency-and-records',
    '① 表是本课程当前本地模型生成并固定下来的教学程序记录，不是实物测量。先写原袋、等机会、轮内不放回/轮间恢复、整轮异色事件和理论。对seed37从原ID亲数前10轮、追加11/12轮命中，合并次数求12轮频率；再算错误的“两批百分率直接平均”，给数值反例。比较前后离理论的精确距离。② 画最初三次累计频率点，零轮能否画频率0？第一轮会恰在理论线吗？仅显示最近10条从哪个编号起，其窗口频率能替代整批吗？前10/12轮是否保同一前缀？固定规则/种子/次数重放的含义是什么，反转显示不能改哪些记录？③ 独立核seed38全12轮，两个预先指定种子均报告；能只挑更近理论的运行或改命中数吗？连续未命中能迫使下一轮补偿吗？改变事件、球数、放回规则或种子，如何注明新模型/运行，为什么不能混接？理论预测与新频率分别何时须重算？④ 自主另选一袋至少含两色的不同编号，先列放回/不放回完整空间与RR/异色理论，再预先定两个不同种子、各100完整轮的记录模板；可用源工作台实际生成并保留两批参数/种子/完整计数/频率和比较。若尚未生成就明确“待生成”，不可伪填数据或只交较好一批；把程序输出、纸上假设和真实测量分开，人审完整理由。',
    '① The table is a FIXED teaching-program record generated by the current local course model, not physical measurements. State original IDs, equiprobability, no replacement within rounds, restoration between rounds, whole-round different-colour event and theory. Count seed37 hits in rounds 1–10 and added 11–12 directly from IDs; combine counts for all 12. Calculate the incorrect unweighted mean of the two batch percentages as a numerical counterexample. Compare exact distances from theory before/after. ② DRAW the first three cumulative frequency points. Can zero trials have a zero frequency point? Must the first point lie on theory? When displaying only the latest ten records, which ID starts the window, and may window frequency replace the whole run? Do 10/12 rounds preserve a prefix? Explain replay with fixed rules/seed/count and what reversing display must preserve. ③ Independently audit seed38’s 12 rounds and report BOTH prespecified seeds. May you select only the closer run or alter hits? Do consecutive misses force compensation next round? Specify fresh model/run records when event/counts/replacement/seed change, explaining why unlike records cannot be spliced. When must theory and frequency each be recalculated? ④ DESIGN another numbered bag containing both colours. List complete replacement/no-replacement spaces and RR/different-colour theory, then prespecify two seeds and templates for 100 complete rounds EACH. You may generate both in the source lab and preserve rules/seeds/full counts/frequencies/comparisons. Mark ungenerated data PENDING; never invent output or submit only the prettier run. Separate program output, paper assumptions and real measurements; a parent reviews the complete reasoning.',
    `原袋${r}红2蓝，轮内不放回、轮后恢复、等可能编号，异色理论${near ? '3/5' : '2/3'}。seed37前10命中${near ? 6 : 8}，后两命中${near ? 1 : 2}，累计${near ? '7/12' : '10/12=5/6'}；错均值(${near ? '3/5+1/2' : '4/5+1'})/2=${near ? '11/20' : '9/10'}，不等正确合并。距离${near ? '0→1/60' : '2/15→1/6'}更远。前三累计点(1,1),(2,1/2),(3,1/3)，不是理论点；零轮无定义不造点。末十条从#3，命中${near ? 6 : 9}，窗口${near ? '3/5' : '9/10'}不替全12轮${near ? '7/12' : '5/6'}。追加保前10条全部ID，重放需同模型/实现/种子/次数；仅反序或切窗不改原顺序身份、总数和命中。seed38共${near ? 9 : 8}/12=${near ? '3/4' : '2/3'}，两批均保，不因一次更近认证模型或选样；真实独立重置模型的下一轮机会仍${near ? '3/5' : '2/3'}，无亏欠补偿。参数/事件/放回变后重算理论另批，换种子另运行但同规则理论不变；追加同规则只更新累计频率，理论预测保留。自主方案须两色不同ID、每轮恢复、两种规则各自的完整空间/理论、预定两种子和各100完整轮记录；实际生成才记输出，待生成留空并标明，只列模板或标待生成不算该部分完成，人审须核两批实际记录；不能声称已完成实测或理论证明。`,
    `The original bag has ${r} red and two blue IDs, uniform draws, no replacement within a round and restoration between rounds. Different-colour theory=${near ? '3/5' : '2/3'}. Seed37 has ${near ? 6 : 8} hits in ten rounds and ${near ? 1 : 2} in the next two, giving ${near ? '7/12' : '10/12=5/6'}. The wrong batch-percentage mean is (${near ? '3/5+1/2' : '4/5+1'})/2=${near ? '11/20' : '9/10'}, unequal to combined frequency. Distance increases ${near ? '0→1/60' : '2/15→1/6'}. First cumulative points are (1,1),(2,1/2),(3,1/3), not forced onto theory; zero trials has no defined point. The latest ten start at #3 with ${near ? 6 : 9} hits, window frequency ${near ? '3/5' : '9/10'}, not the full ${near ? '7/12' : '5/6'}. Appending preserves every first-ten ID. Replay requires identical model/implementation/seed/count; reversing or windowing the display changes no original identities, totals or hits. Seed38 gives ${near ? 9 : 8}/12=${near ? '3/4' : '2/3'}. Preserve both, without selecting the closer run or certifying a model from one match. In the stipulated independent reset model, next-round chance remains ${near ? '3/5' : '2/3'} without probability debt. Changing parameters/event/replacement requires recalculated theory and a fresh batch; changing seed starts another run but leaves same-rule theory unchanged. Appending same-rule trials updates frequency while preserving theory. An own design needs both colours, distinct IDs, restoration, complete spaces/theory for both rules, two prespecified seeds and 100 COMPLETE-round records per run. Record output only after generation; mark ungenerated data pending. A template or pending label does not complete that part: human review checks both generated records. Never call these measurements or a proof of theory.`,
  );
  table(
    q3,
    [
      `固定教学程序原表：R1..R${r},B1,B2；轮内不放回/轮间恢复；每个ID对是一整轮，非真实装置。seed37/38各12轮，先看37前10再追加2。`,
      `Fixed teaching-program records: R1..R${r},B1,B2; no replacement within rounds, restoration between; each ID pair is one complete round, not physical-device data. Seeds37/38 each have12 rounds; inspect seed37’s first10 then append two.`,
    ],
    records.flatMap((data, k) =>
      data.map((pair, i): Row => [
        `${37 + k}-${i + 1}`,
        `种子${37 + k}第${i + 1}轮`,
        `Seed${37 + k} round${i + 1}`,
        pair,
        pair,
      ]),
    ),
  );
  return {
    id: `${unit}-MAINT-PROBABILITY-MEANING`,
    unit,
    bridge: 'J97-L03',
    bridgeByQuestion: Object.fromEntries(
      ['J97-L03', 'J97-L04', 'J97-L05'].map((l, i) => [id(i + 1), l]),
    ),
    title: t(
      '新概率之后，再核事件与完整记录',
      'After new probability, recheck events and complete records',
    ),
    intro: t(
      '三张独立卡，每次一个编号，可分次不计时/口述。保留原PROB-PROCESS强证据，只补事件边界、回应/普查与累计记录；全部人审，不把教学程序记录当家庭实测。',
      'Three independent cards, one numbered part per untimed sitting; oral work is welcome. Retain the original PROB-PROCESS arguments and supplement event boundaries, response/census scope and cumulative records. All reasoning is human-reviewed; teaching-program data are not household measurements.',
    ),
    questions: [q1, q2, q3],
  };
};
export const probabilityMeaningRetrieval = {
  H24_PROBABILITY_MEANING: makeSet('H24'),
  H33_PROBABILITY_MEANING: makeSet('H33'),
};
