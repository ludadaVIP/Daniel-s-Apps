import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J93' | 'J94') => {
  const near = unit === 'J93',
    id = (n: number) => `${unit}-MAINT-CARTESIAN-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(
        '先逐行抄原条件、区分位置与变化量；同一行的两个量一起保留。每个结论都给计算或自己的图。',
        'Copy each original row first, separating positions from changes and keeping each pair together. Support conclusions with calculations or your own labelled diagram.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时；允许口述或熟悉语言。先生成自己的解释，再逐项人审，读题协助和数学提示分开。',
        'One numbered part or independent case per untimed sitting; oral or familiar-language responses are welcome. Generate your own explanation before reviewing every part; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件表：按题目指定的行组合；独立案例不混用，保留ID、配对、单位和模型前提。',
        'Original conditions: combine rows only as specified in the question. Keep independent cases separate and retain IDs, pairing, units and model premises.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const p = near ? '(−6,3/2)' : '(−3/2,6)',
    delta = near ? '(5/2,−1/2)' : '(1/2,−5/2)',
    end = near ? '(−7/2,1)' : '(−1,7/2)',
    reflect = near ? '(−6,−3/2)' : '(−3/2,−6)';
  const q1 = card(
    1,
    'coordinate-plot-and-scale',
    '① 按P/T从原P出发，分别画“先横移再纵移”和“先纵移再横移”的两条路，求终点，用投影读回。移动量能直接当终点吗？两种走法是否交换数对中x、y的位置？② R另从原P出发，关于x轴反射，画像点并再反射一次；逐个说明哪个坐标保持、哪个变号。不要先平移再反射。③ U中同一实际位置从两轴都用m改成两轴都用cm，写新数对和单位；D则计量单位仍m，只扩大横轴显示范围。分别说明实际位置、数值和显示格数哪些改变，画带单位的投影。',
    '① Using P/T, start at ORIGINAL P and draw both routes: horizontal then vertical, and vertical then horizontal. Find the endpoint and recover it by projection. Is the displacement the endpoint? Do the routes swap the x/y slots? ② R starts SEPARATELY from original P: reflect in the x-axis, draw the image, then reflect again. State which coordinate stays and which changes sign. Do not translate first. ③ U changes BOTH axes from metres to centimetres for the same physical location: give its new pair and units. D instead keeps metres and only widens the displayed horizontal range. Distinguish changes in physical location, numbers and displayed cell counts; draw labelled projections.',
    `P加位移${delta}得终点${end}，两个分量各自相加；两路同终点，坐标槽始终横x纵y，不因走法交换。位移从原P量起，不是从原点量起，故不直接等于终点。独立R的像${reflect}，再反射回${p}；x保留，y变相反数。U原(2,3)m变(200,300)cm，数值各乘100而实际位置相同；D仍(2,3)m，仅显示格数/像素间距改变，不能把显示缩放当真实单位换算。必须有自己标原点、轴单位和投影的图。`,
    `Adding displacement ${delta} to P gives endpoint ${end}, component by component. Both routes end there; slots remain horizontal x then vertical y regardless of route. Displacement is measured from P, not the origin, so it is not automatically the endpoint. Separate R gives ${reflect}; reflecting again restores ${p}, preserving x and negating y each time. U converts (2,3)m to (200,300)cm: both numerical values multiply by 100 while the physical location stays. D remains (2,3)m, changing only displayed cell/pixel spacing. A display rescale is not a measurement-unit conversion. Require the learner’s own origin, axis units and projections.`,
  );
  table(q1, [
    [
      'P/T',
      '起点与平移',
      'Start and translation',
      `原P=${p}；位移${delta}，正x向右、正y向上`,
      `Original P=${p}; displacement ${delta}, positive x right and positive y up`,
    ],
    [
      'R',
      '独立反射',
      'Separate reflection',
      `原P=${p}；关于x轴反射两次`,
      `Original P=${p}; reflect in the x-axis twice`,
    ],
    [
      'U',
      '实际单位换算',
      'Measurement-unit conversion',
      '位置(2m,3m)，两轴改用cm；1m=100cm',
      'Location (2m,3m); change both axes to cm, 1m=100cm',
    ],
    [
      'D',
      '只改显示',
      'Display change only',
      '原(2,3)，两轴单位仍m；横轴每格1m改2m，纵轴不改',
      'Original (2,3), both units stay m; x intervals change from 1m to 2m, y unchanged',
    ],
  ]);
  const points = near ? '(−1,5/2)、(3,1/2)' : '(−2,4)、(2,2)',
    b = near ? 2 : 3,
    constant = near ? 3 : -2,
    constantPoints = near ? '(−1,3)、(2,3)' : '(−2,−2)、(3,−2)',
    ys = [b, b - 0.5, b - 1];
  const q2 = card(
    2,
    'affine-rate-and-intercept',
    '各行独立。① A已知形式y=kx+b，按两非零横坐标点求精确k、b，写完整规则，代回两点。把点的顺序同时倒过来再算差商，为什么不变？② 用自己求的规则补x=0、1、2的三行表，逐步比较“y减少1/2”与“把y折半”；给实际不同结果。x增加3时求Δy；只知道这个变化而未给起始x或y，能报最终y吗？③ C与Z各已知仿射形式，求规则、率和截距，说明不必强留x；按J75广义和J85严格一次的约定分别命名。④ D只有两个重复记录、E有同输入冲突输出，各能否确定唯一仿射模型或成为单值函数？明确Δx=0不能除，不能把“重复不足”说成“没有任何模型”。',
    'Rows are independent. ① A is KNOWN to have form y=kx+b. Derive exact k,b from the two nonzero-x points, state the full rule and substitute both points. Reverse BOTH point orders and recompute the quotient: why is it unchanged? ② Tabulate x=0,1,2 under your rule and compare decreasing y by 1/2 with halving y, giving numerically different results. Find Δy when x increases by three. Without a starting x or y, does this change give the final y? ③ C and Z are each known affine models: derive rule, rate and intercept without forcing an x term; name them under J75’s broad and J85’s strictly first-degree conventions. ④ D has duplicate records and E conflicting outputs at one input: can each determine a unique affine rule or be a single-valued function? Explain why division by Δx=0 is invalid and why insufficient duplicate evidence is not absence of every model.',
    `A由同序差商k=−1/2，b=${b}，y=−x/2+${b}；两点均代回，反序分子分母同时变号所以商不变。x0/1/2对应y${ys.join('、')}，每步减1/2；若从y=${b}错误折半，下步${b / 2}而非${b - 0.5}，不是同规则。Δx=3给Δy=−3/2，没有起始量不能说最终y=−3/2。C为y=${constant}，k0、b${constant}；Z为y=0，k0、b0；均是函数、属J75广义仿射常数，非J85要求k≠0的一次函数。D的(1,2)重复只给k+b=2，例如y=2和y=x+1都合，不能唯一，但可成单值函数；E的(1,2)/(1,3)不可能属于同一单值函数。两者Δx均0，不算0/0或非零除0，不扩大未约定的零正比例定义。`,
    `The consistently ordered difference quotient gives k=−1/2, b=${b}, y=−x/2+${b}; check both supplied points. Reversal negates numerator AND denominator, preserving the quotient. At x=0,1,2, outputs are ${ys.join(',')}, decreasing by 1/2 each step. Incorrectly halving initial ${b} instead gives ${b / 2}, not ${b - 0.5}. Δx=3 gives Δy=−3/2, not a determined final output without a starting value. C is y=${constant}, k=0,b=${constant}; Z is y=0,k=0,b=0. Both are functions and broad affine constants in J75 but not J85 first-degree functions requiring k≠0. Duplicate D gives only k+b=2, fitting both y=2 and y=x+1: possible but not unique. E’s (1,2)/(1,3) cannot belong to one single-valued function. Both have Δx=0, so neither 0/0 nor a nonzero division by zero is allowed. Do not extend an unspecified convention about zero direct proportion.`,
  );
  table(q2, [
    [
      'A',
      '已知仿射两点',
      'Known affine pair',
      `y=kx+b；点${points}`,
      `y=kx+b; points ${points.replace('、', ', ')}`,
    ],
    [
      'C',
      '独立常数案例',
      'Separate constant case',
      `y=kx+b；点${constantPoints}`,
      `y=kx+b; points ${constantPoints.replace('、', ', ')}`,
    ],
    [
      'Z',
      '独立零输出案例',
      'Separate zero-output case',
      'y=kx+b；(−1,0)、(2,0)',
      'y=kx+b; (−1,0), (2,0)',
    ],
    [
      'D',
      '独立重复记录',
      'Separate duplicate records',
      '(1,2)、(1,2)',
      '(1,2), (1,2)',
    ],
    [
      'E',
      '独立冲突记录',
      'Separate conflicting records',
      '(1,2)、(1,3)',
      '(1,2), (1,3)',
    ],
  ]);
  const xs = near ? [-2, 0, 3] : [-1, 1, 4],
    vals = near ? [-3, 1, 7] : [3, 1, -2],
    test = near ? 1 : 2,
    base = near ? '2x+1' : '−x+2',
    extra = near ? '(x+2)x(x−3)' : '(x+1)(x−1)(x−4)',
    ftest = near ? 3 : 0,
    gtest = near ? -3 : -6;
  const q3 = card(
    3,
    'same-row-table-points',
    '① A/B/C是假想记录，原表故意乱序。抄每个ID的同行数对，在横轴x、纵轴y描三点；按x排序时整行连ID一起移动，再与把两列各自从小到大排序比较：是否破坏原配对？横轴每格1，观测间隔是否相等？不能把三次观测画成等间距三格。② F是另外明确给定的全实数规则，求x=−1的输出并写点；不要把记录擅称F已被证明。③ 亲算F/G在三个原记录输入及新输入的值，画这些比较点。它们都符合原记录吗，新输入是否不同？说明为何三个吻合点不能保证一般规则，反例计算不是对真实过程的预测。对比F、G以及另给P，哪个明确是非零正比例，不能仅凭过原点或看起来直判断。④ 记录本身只画已知点；若另明确规定F只在原最小至最大x之间连续有效，怎样画且怎样标端点？新给整数卡片模型C=2n+3 NZD，n∈{0,1,2,3}则列全部点，不连半张；给一个域外例并说明机械代入不等于有效费用。',
    '① A/B/C are fictional observations, deliberately out of order. Copy each ID’s same-row pair and plot x horizontally and y vertically. Sort by x while moving WHOLE rows with IDs, then compare with separately sorting both columns ascending: is pairing preserved? With one x-unit per cell, are observation gaps equal? Do not place successive observations one cell apart. ② F is a SEPARATELY SUPPLIED rule on all real inputs. Compute its output and point at x=−1 without claiming the observations proved F. ③ Calculate BOTH F/G at all three recorded inputs and at the new input; plot the comparison points. Do both fit the observations yet differ at the new input? Explain why three matches cannot guarantee a rule and why the counterexample is not a prediction of a real process. Compare F,G and supplied P: which is explicitly nonzero direct proportion, rather than merely passing through the origin or looking straight? ④ Observations alone justify known points only. If F is instead explicitly restricted to a continuous model between the smallest and largest original x, what segment and endpoints are justified? A new card model C=2n+3 NZD permits n∈{0,1,2,3}: list ALL points without connecting half cards. Give an out-of-domain input and distinguish mechanical substitution from an admissible cost.',
    `按ID A(${xs[0]},${vals[0]})、B(${xs[1]},${vals[1]})、C(${xs[2]},${vals[2]})保配对，原C/A/B顺序可整行排序，不能分列重配；间隔${xs[1]! - xs[0]!}与${xs[2]! - xs[1]!}不等，应按实际x放点。${near ? '本例两列原本同向有序，独立排序数值碰巧不改三对，但身份不能靠此保证；例如只把A/B的y互换便不是原记录。' : '独立升序把原A的正输出配给最大输入等，实际破坏三对；如最小x配最小y不再是原A。'}F(−1)=${near ? -1 : 3}，点(−1,${near ? -1 : 3})。G额外乘积在三个记录x各有一个零因子，故同给${vals.join('、')}；新x=${test}时F=${ftest}，额外项−6，G=${gtest}，不同，所以有限吻合不证一般关系。F截距${near ? 1 : 2}非零，G有非零三次项，均非正比例；P=${near ? '2x' : '−3x'}才是明确非零正比例。另给连续限制时只画F在[${xs[0]},${xs[2]}]的线段，端点(${xs[0]},${vals[0]})与(${xs[2]},${vals[2]})；不能从原三记录推连续。卡片点(0,3),(1,5),(2,7),(3,9)，固定费只加一次，n=1/2虽机械算4却域外，不是可用半张费用；也不许无界外推。`,
    `Retain A(${xs[0]},${vals[0]}), B(${xs[1]},${vals[1]}), C(${xs[2]},${vals[2]}). Reorder original C/A/B only as whole ID rows. Input gaps ${xs[1]! - xs[0]!} and ${xs[2]! - xs[1]!} differ, so plot actual x positions. ${near ? 'In this particular example both columns already increase together: independent sorting accidentally preserves numerical pairs, but it does not guarantee identity. Swapping just A/B outputs gives an explicit wrong pairing.' : 'Separate ascending sorts actually destroy these pairs: matching the smallest x to smallest y is no longer original A.'} F(−1)=${near ? -1 : 3}, giving (−1,${near ? -1 : 3}). G’s extra product has a zero factor at each recorded input, so both give ${vals.join(',')}. At new x=${test}, F=${ftest}, extra term=−6 and G=${gtest}; the discrepancy refutes identity without predicting a real process. F has nonzero intercept ${near ? 1 : 2} and G has a nonzero cubic term, so neither is direct proportion; P=${near ? '2x' : '−3x'} explicitly is. Under the separately supplied continuous restriction draw only F on [${xs[0]},${xs[2]}], with endpoints (${xs[0]},${vals[0]}) and (${xs[2]},${vals[2]}). Observations alone do not establish continuity. Cards give (0,3),(1,5),(2,7),(3,9), adding the fixed fee once. n=1/2 mechanically yields four but is outside the domain, not an admissible half-card fee; unbounded extrapolation is also unjustified.`,
  );
  table(q3, [
    ['C', '原记录', 'Original observation', `x=${xs[2]}, y=${vals[2]}`],
    ['A', '原记录', 'Original observation', `x=${xs[0]}, y=${vals[0]}`],
    ['B', '原记录', 'Original observation', `x=${xs[1]}, y=${vals[1]}`],
    [
      'F',
      '另给全实数规则',
      'Separately supplied real-input rule',
      `F(x)=${base}`,
    ],
    [
      'G',
      '另给比较规则',
      'Separately supplied comparison rule',
      `G(x)=${base}+${extra}`,
    ],
    ['N', '新测试输入', 'New test input', `x=${test}`],
    [
      'P',
      '独立非零比例规则',
      'Separate nonzero proportional rule',
      near ? 'y=2x' : 'y=−3x',
    ],
    [
      'K',
      '独立整数卡片规则',
      'Separate whole-card rule',
      'C=2n+3 NZD；n∈{0,1,2,3}',
      'C=2n+3 NZD; n∈{0,1,2,3}',
    ],
  ]);
  q3.stem = t(
    `${q3.stem.zh} 另一次独立创作：自拟一条有限时段匀速排水规则和一条整张卡片费用规则，不照抄上表系数。定义数量/单位、率/初值、连续或整数允许域；各生成三行、标轴画图、给一个域外输入及理由。排水终点须恰好空箱，卡片固定费只收一次；说明哪些是你设定的假想条件，不能称为实测。`,
    `${q3.stem.en} In a separate creative sitting, invent a finite-time constant-draining rule and a whole-card cost rule with coefficients different from the table. Define quantities, units, rates, intercepts and continuous/integer domains. Generate three rows and a labelled graph for each, plus one invalid input with a reason. End draining at empty and add the card fee once. Identify your fictional assumptions rather than claiming measurements.`,
  );
  q3.solution = t(
    `${q3.solution.zh} 自创以满足全部条件为准，不要求唯一式：排水V=a−rt，a,r>0，0≤t≤a/r连续，三行代回且末点V0；卡片C=pn+b，p>0、b≥0，声明有限非负整数域，三行皆域内且不连分数输入，固定b一次。须两套自选不同系数、带单位表图与各自域外理由；假想规则不冒充真实记录。`,
    `${q3.solution.en} Accept any self-created rules meeting every condition, not a unique formula: draining V=a−rt with a,r>0 on continuous 0≤t≤a/r, three checked rows and final V=0; cards C=pn+b with p>0,b≥0 on a declared finite nonnegative integer domain, three admissible rows and no fractional connections, adding b once. Require two chosen rules with different coefficients, unit-labelled tables/plots and separate invalid-input reasons. Fictional premises are not measured records.`,
  );
  if (near) {
    q3.stem = t(
      `${q3.stem.zh} ⑤ 独立温度案例H：求一小时读数，标轴与单位、连续有效范围和端点，给一个域外时刻。这里负摄氏读数为何可以有效，而原水量题的负升数不能？`,
      `${q3.stem.en} ⑤ Separate temperature case H: calculate the one-hour reading, label axes and units, the continuous domain and endpoints, and give one out-of-domain time. Why is a negative Celsius reading valid here while a negative tank volume in the original water task is not?`,
    );
    q3.solution = t(
      `${q3.solution.zh} H在t=1h为−5+2=−3°C，允许负摄氏；率2°C/h、初值−5°C，连续域[0,3]，端点(0,−5)/(3,1)，如t4h域外。摄氏零不是最低温度，水量须非负且原排水模型到空箱停止；有效性来自各数量与已给条件，不来自单独的负号。`,
      `${q3.solution.en} H at t=1h gives −5+2=−3°C, a valid negative Celsius reading; rate 2°C/h and initial −5°C on continuous [0,3], with endpoints (0,−5)/(3,1). Time four hours is outside. Celsius zero is not a lowest possible temperature; volume is nonnegative and the supplied draining model stops at empty. Validity depends on each quantity and its premises, not the minus sign alone.`,
    );
    q3.contextTable!.rows.push([
      t('H', 'H'),
      t('独立摄氏模型', 'Separate Celsius model'),
      t(
        'T=−5+2t °C；t为小时，0≤t≤3连续',
        'T=−5+2t °C; t in hours, continuous 0≤t≤3',
      ),
    ]);
  }
  q3.answer = { kind: 'explain', rubric: q3.solution };
  q3.solutionSteps = [q3.solution];
  return {
    id: `${unit}-MAINT-CARTESIAN-MEANING`,
    unit,
    bridge: 'J75-L02',
    bridgeByQuestion: Object.fromEntries(
      [2, 4, 3].map((l, i) => [id(i + 1), `J75-L0${l}`]),
    ),
    title: t(
      '坐标变换、半单位变化与记录配对',
      'Coordinate transformations, half-unit changes and paired records',
    ),
    intro: t(
      '三张独立纸笔卡，每次一个编号或案例，可分次、不计时。原九题继续保留，新要求另存记录。画自己的图、保原ID/单位与模型前提，再逐项人审；允许口述或熟悉语言，读题协助与数学提示分开。全为虚构条件，无需实测或购买。',
      'Three independent paper cards, one numbered part or case per untimed sitting. The original nine tasks remain; these new requirements keep separate records. Draw your own plots, retain IDs, units and model premises, then review every part. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. All conditions are fictional; no measurement or purchase is needed.',
    ),
    questions: [q1, q2, q3],
  };
};
export const cartesianMeaningRetrieval = {
  J93_CARTESIAN_MEANING: makeSet('J93'),
  J94_CARTESIAN_MEANING: makeSet('J94'),
};
