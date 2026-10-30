import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H32' | 'H36') => {
  const near = unit === 'H32',
    id = (n: number) => `${unit}-MAINT-CIRCULAR-MEANING-Q${n}`;
  const skills = [
    'radian-arc-ratio',
    'circular-coordinate-to-wave',
    'circular-identity-with-domain',
    'circular-inner-angle-transform',
    'circular-complete-finite-roots',
  ];
  const card = (n: number, z: string, en: string, rz: string, re: string) =>
    reasoning(id(n), t(z, en), skills[n - 1]!, t(rz, re), [
      t(
        '先标原单位、点的身份、定义域与所问对象；自己生成式、图或完整集合，再代回原条件。有限样点不代全称证明。',
        'Identify original units, point roles, domains and the requested object. Generate your own expressions, graphs or complete sets, then substitute into the original conditions. Finite samples do not prove a universal claim.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时，允许纸笔、口述或熟悉语言。读题帮助与数学提示分开；完整理由由家长审核，作者假想数据不写成家庭观测。',
        'One numbered part or separate case per untimed sitting; paper, oral work or a familiar language is welcome. Separate reading help from maths hints. A parent reviews the full reasoning; author givens are not household observations.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '独立纸上原条件；请自己画图并生成待求数值',
        'Separate paper givens; draw your own graphs and generate the requested values',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const q1 = card(
    1,
    '① 对A先统一弧和半径的长度单位，由有向弧比求精确弧度、实际经过的非负弧长及精确度数，最后才把度数舍入至最近0.1°。所得弧度数要再乘π吗？② 保持这个转角而半径加倍，重新求有向弧与经过长度，用一般s/r解释角为何不变。③ 对B逆求有向弧和经过长度，并核回原角。若只留下相同的经过长度而删掉方向，角能唯一确定吗？保留原多圈角任务。',
    '① For A, first match arc/radius length units. Derive the EXACT radian measure, nonnegative travelled arc and exact degrees; only then round degrees to the nearest 0.1°. Does the radian number need another factor of π? ② Keep this rotation and double the radius. Recompute signed arc and travelled length, using the general s/r ratio to explain the unchanged angle. ③ For B reverse the calculation to signed arc and travelled length, then recover the angle. If direction is removed and only the same travelled length remains, is the angle unique? Retain the existing full-winding task.',
    near
      ? 'A：−0.36 m=−36 cm，θ=−36/24=−3/2 rad，不是−3π/2；经过36 cm，度数−270/π°≈−85.9°。半径48 cm时有向弧−72 cm、经过72 cm。B：s=24×(−3/2)=−36 cm，|s|=36 cm，再除24回−3/2。只有经过长度而无方向，顺逆的±3/2都可，不能唯一。一般(r,s)→(2r,2s)使比不变；rad是比值所定角单位，不是弧的cm。'
      : 'A：87.5 cm=7/8 m，θ=(7/8)/(7/20)=5/2 rad，不是5π/2；经过7/8 m=87.5 cm，度数450/π°≈143.2°。半径7/10 m时有向弧7/4 m、经过7/4 m。B：s=(7/20)×(5/2)=7/8 m，再除半径回5/2。仅给经过长度而无方向，±5/2均可。一般(r,s)→(2r,2s)保比；rad角与m弧长角色不同。',
    near
      ? 'A: −0.36 m=−36 cm, θ=−36/24=−3/2 rad, NOT −3π/2. Travelled arc=36 cm; degrees=−270/π°≈−85.9°. At radius48 cm, signed arc=−72 cm and travelled arc=72 cm. B: s=24×(−3/2)=−36 cm, |s|=36 cm; dividing by24 recovers −3/2. Unsigned travel without direction permits both ±3/2. In general (r,s)→(2r,2s) preserves s/r; radians describe the angle ratio, not arc centimetres.'
      : 'A: 87.5 cm=7/8 m, θ=(7/8)/(7/20)=5/2 rad, NOT 5π/2. Travelled arc=7/8 m=87.5 cm; degrees=450/π°≈143.2°. At radius7/10 m, signed and travelled arc=7/4 m. B: s=(7/20)×(5/2)=7/8 m; dividing by the radius recovers5/2. Unsigned travel without direction permits ±5/2. In general (r,s)→(2r,2s) preserves the ratio; radian angle and metre arc have different roles.',
  );
  table(q1, [
    [
      'A',
      '一次给定方向的转动',
      'One directed rotation',
      near
        ? 'r=24 cm；有向弧s=−0.36 m，顺时针'
        : 'r=0.35 m；有向弧s=87.5 cm，逆时针',
      near
        ? 'r=24 cm;s=−0.36 m clockwise'
        : 'r=0.35 m;s=87.5 cm counterclockwise',
    ],
    [
      'B',
      '独立逆向题',
      'Separate reverse problem',
      near ? 'r=24 cm；θ=−1.5 rad' : 'r=0.35 m；θ=2.5 rad',
      near ? 'r=24 cm;θ=−1.5 rad' : 'r=0.35 m;θ=2.5 rad',
    ],
  ]);
  const principal = near ? '7π/6' : '11π/6',
    swapped = near ? '4π/3' : '2π/3',
    cx = near ? '−√3/2' : '√3/2',
    sy = '−1/2';
  const q2 = card(
    2,
    '① 给定P反求[0,2π)唯一角θ，再写全部实角；交换坐标成P′后重新找角，不能只交换sin/cos名称。给两点象限和依据。② 对原P分别写圆点P、正弦图点S、余弦图点C的精确坐标，自己画三者的坐标轴，以及sin与cos各一个完整周期的波形；角θ+2π给哪一个相同点、哪两个不同点？③ 从任意圆点关于横轴反射证明sin的奇性和cos的偶性，不能只核样点。说明两函数全实定义域和完整[−1,1]像集，须解释范围约束与每值可达两部分。④ 对Z给sin/cos/tan和是否属于某象限；与原旧题的竖轴极点相比，为什么这里tan有定义？原最小正周期的一般两步证明继续完成。',
    '① Invert P to its UNIQUE angle θ on [0,2π), then give ALL real angles. Swap coordinates to P′ and find its angle again; merely renaming sine/cosine is insufficient. Justify both quadrants. ② Write exact coordinates of the circle point P, sine graph point S and cosine graph point C. Draw their axes and a full period of EACH sine and cosine wave. At θ+2π, which point is identical and which TWO are different? ③ Reflect an ARBITRARY circle point across the horizontal axis to prove sine is odd and cosine even, beyond checking samples. Explain the full real domains and COMPLETE image [−1,1], proving both bounds and attainability. ④ Give sin/cos/tan at Z and whether it lies in a quadrant. Why is tangent defined here, unlike the vertical-axis poles in the existing task? Still complete the existing general two-part least-period proof.',
    `P的θ=${principal}，全部${principal}+2kπ；交换后θ=${swapped}，全部${swapped}+2kπ，k∈Z。${near ? '两点均第三象限，但不是同角' : '原给定P在第四象限，交换点第二象限'}。P=(${cx},${sy})，S=(${principal},${sy})，C=(${principal},${cx})。加2π圆点相同，但S/C横坐标各增加2π，成为不同图点，不能按同终边合并图输入。任意圆点(c,s)反射为(c,−s)，对应−θ，故sin(−θ)=−sinθ、cos(−θ)=cosθ。任意实角都有圆点，所以定义域R；坐标绝对值≤1，圆上任意水平/竖直高度在[−1,1]均与圆相交，故完整像集[−1,1]。Z=${near ? 'π，sinθ=0、cosθ=−1、tanθ=0' : '0，sinθ=0、cosθ=1、tanθ=0'}；在横轴不属象限，cos非零，tanθ=0有定义。周期证明另保旧题，五点或零点间距不能替代。`,
    `P gives θ=${principal}, all ${principal}+2kπ; swapped P′ gives ${swapped}, all ${swapped}+2kπ, k∈Z. ${near ? 'Both are in quadrant III but are different angles' : 'P is in IV and P′ in II'}. P=(${cx},${sy}), S=(${principal},${sy}), C=(${principal},${cx}). Adding2π preserves P, but increases each graph x-coordinate by2π, creating TWO different graph points. Reflecting arbitrary (c,s) to (c,−s) corresponds to −θ, proving sin(−θ)=−sinθ and cos(−θ)=cosθ. Every real angle has a circle point, so domains are R. Coordinates are bounded by1 in magnitude; every horizontal/vertical coordinate in [−1,1] intersects the circle and is attained, so the full images are [−1,1]. Z=${near ? 'π:sinθ=0,cosθ=−1,tanθ=0' : '0:sinθ=0,cosθ=1,tanθ=0'} is on the horizontal axis, in no quadrant. Its nonzero cosine makes tangent defined. Retain the existing general least-period proof; five points or zero spacing alone are insufficient.`,
  );
  table(q2, [
    [
      'P',
      '给定单位圆点',
      'Given unit-circle point',
      `P=(${cx},${sy})；θ∈[0,2π)`,
      `P=(${cx},${sy});θ∈[0,2π)`,
    ],
    [
      'P′',
      '交换后的独立点',
      'Separate swapped point',
      `P′=(${sy},${cx})；θ′∈[0,2π)`,
      `P′=(${sy},${cx});θ′∈[0,2π)`,
    ],
    [
      'Z',
      '横轴角',
      'Horizontal-axis angle',
      near ? 'θ=π' : 'θ=0',
      near ? 'θ=π' : 'θ=0',
    ],
  ]);
  const a = near ? '5' : '8',
    hyp = near ? '13' : '17',
    other = near ? '12' : '15';
  const q3 = card(
    3,
    '① 分别解释sin²θ、sin(θ²)、2sinθ的运算次序；用θ=π/2给第一式与第三式的确切值，说明平方不是倍数。② 对K先不使用象限，列所有可能的cosθ、tanθ配对；加入所给象限后再筛，并从圆式解释另一符号为何不合。主平方根√(1−sin²θ)究竟等于cosθ还是|cosθ|？给一个全实角反例否定无条件去绝对值。③ 从单位圆恒等式逐步推出1+tan²θ=1/cos²θ，写每个除法条件和全部被排实角；在竖轴可把两侧都当0吗？另做父卡已链接的指定形式、展开交叉项和原分母题，不能靠关键词算人审通过。',
    '① Explain the operation order in sin²θ, sin(θ²) and 2sinθ. At θ=π/2 give exact values of the FIRST and THIRD, showing a square is not a double. ② For K IGNORE the quadrant first and list every possible paired cosθ/tanθ. Then apply the given quadrant and explain why the other sign fails. Is the principal square root √(1−sin²θ) equal to cosθ or |cosθ|? Give a real-angle counterexample to dropping the absolute value unconditionally. ③ Derive 1+tan²θ=1/cos²θ step by step from the unit-circle identity, stating every division condition and ALL excluded real angles. Can both sides be called zero on the vertical axis? Also complete the linked requested-form, cross-term expansion and original-denominator tasks; keywords alone do not earn human confirmation.',
    `sin²θ=(sinθ)²先求sin再平方；sin(θ²)先把弧度数平方再取sin；2sinθ是二倍。θ=π/2时第一式1、第三式2。K：sin=−${a}/${hyp}，由cos²=1−sin²=${other}²/${hyp}²，未知象限有(cos,tan)=(+${other}/${hyp},−${a}/${other})或(−${other}/${hyp},+${a}/${other})；${near ? '第三象限筛后(−12/13,+5/12)' : '第四象限筛后(+15/17,−8/15)'}。主根是${other}/${hyp}=|cosθ|；θ=π时主根1而cos=−1。一般cosθ≠0时把sin²+cos²=1每项除cos²，得到tan²+1=1/cos²；完整排θ=π/2+kπ,k∈Z。被排点tan和倒数均无定义，不是零。原分母不能由化简后的值补洞。指定形式与交叉项另用现有H35正式题。`,
    `sin²θ=(sinθ)² takes sine then squares; sin(θ²) squares the numerical radian input then takes sine; 2sinθ doubles the sine. At θ=π/2 the first is1 and third2. K: sin=−${a}/${hyp}, hence cos²=${other}²/${hyp}². Before quadrant information the pairs are (+${other}/${hyp},−${a}/${other}) or (−${other}/${hyp},+${a}/${other}). ${near ? 'Quadrant III selects (−12/13,+5/12)' : 'Quadrant IV selects (+15/17,−8/15)'}. The principal root is ${other}/${hyp}=|cosθ|. At θ=π it is1 but cosine is−1. For cosθ≠0 divide EVERY term of sin²+cos²=1 by cos², obtaining tan²+1=1/cos². Exclude ALL θ=π/2+kπ,k∈Z. At excluded inputs tangent and the reciprocal are undefined, not zero; simplification cannot fill original holes. Use the existing H35 formal tasks for requested forms and cross terms.`,
  );
  if (near) {
    q3.stem = t(
      q3.stem.zh +
        ' ④ 对F先完整展开平方，保留交叉项，再把第一式化为常数、第二式化为只含cosθ的形式，并用一般恒等式解释。只报等价但未满足指定形式的式子算完成吗？',
      q3.stem.en +
        ' ④ For F expand the square fully, preserving cross terms. Then express the FIRST as a CONSTANT and the SECOND using ONLY cosθ, with a general identity argument. Is an equivalent expression that fails the requested form finished?',
    );
    q3.solution = t(
      q3.solution.zh +
        ' F：s=sinθ,c=cosθ，(s−c)²+2sc=s²−2sc+c²+2sc=1；c²−s²=c²−(1−c²)=2c²−1。只写c²−s²虽等价却仍有s，不满足只cos要求；只举样点不证明恒等。',
      q3.solution.en +
        ' F:write s=sinθ,c=cosθ. (s−c)²+2sc=s²−2sc+c²+2sc=1; c²−s²=c²−(1−c²)=2c²−1. Leaving c²−s² is equivalent but still contains s and fails the cosine-only form. Samples do not prove the identity.',
    );
  }
  q3.solutionSteps = [q3.solution];
  q3.answer = { kind: 'explain', rubric: q3.solution };
  table(q3, [
    [
      'K',
      '分两步使用的信息',
      'Information to use in two stages',
      `sinθ=−${a}/${hyp}；随后加${near ? '第三' : '第四'}象限`,
      `sinθ=−${a}/${hyp};THEN add quadrant ${near ? 'III' : 'IV'}`,
    ],
    [
      'I',
      '任意角的出发恒等式',
      'Starting arbitrary-angle identity',
      'sin²θ+cos²θ=1',
      'sin²θ+cos²θ=1',
    ],
  ]);
  if (near)
    q3.contextTable!.rows.push([
      t('F', 'F'),
      t('独立展开与指定形式', 'Separate expansion and requested form'),
      t(
        '(sinθ−cosθ)²+2sinθcosθ→常数；cos²θ−sin²θ→只cosθ',
        '(sinθ−cosθ)²+2sinθcosθ→constant;cos²θ−sin²θ→cosine only',
      ),
    ]);
  const q4 = card(
    4,
    '① 对虚构高度模型M，把内部角写成B(t−h)，列A、D、B、h的数值与单位、非负振幅、完整高度范围及最小正周期；解释常数项相位角与水平时间位移不同。② 亲算表中每个时刻，自己画完整时间域的图，标所有最大/最小时刻和开闭端点。用内角反解全部达到中线的时刻，给整数周期范围、原式代回与单位，不能只报第一次；区间外候选要删，相同高度的不同合法时刻要保留。③ 将时间改为表中U单位，从t与新变量关系重新推公式、时间域、周期、位移和全部中线时刻；不能只改单位标签而保留旧角速度。④ 更高目标E能达到吗？用范围证明。说明理想匀速假设及纸上数据的界限，保留旧A=0/B=0与一般五源点任务。',
    '① For fictional height model M write the inner angle as B(t−h). Give A,D,B,h WITH UNITS, nonnegative amplitude, full height range and least positive period. Distinguish a constant phase ANGLE from a horizontal TIME shift. ② Compute EVERY listed time and draw the graph over the full time domain, marking ALL maxima/minima and endpoint ownership. Invert the inner angle for ALL midline times, giving integer-period bounds, original substitutions and units. Do not report only the first; delete outside candidates but preserve different allowed times with equal heights. ③ Change time to U, deriving the new formula, domain, period, shift and ALL midline times from the variable relation. Relabelling units while retaining old angular speed fails. ④ Is target E attainable? Prove by the range. State ideal uniform-motion assumptions and limits of paper givens. Retain the existing A=0/B=0 and general five-source-point tasks.',
    near
      ? '内部角(π/3)(t+1)，A=−3/2 m、D=5 m、B=π/3 rad/min、h=−1 min，振幅3/2 m，像集[7/2,13/2] m，T=6 min。时刻0,1/2,2,7/2,5,6对应17/4,5,13/2,5,7/2,17/4 m；最高t=2，最低t=5，源cos最高被负A反射为高度最低。H=5要求cos u=0，u=π/2+kπ，t=1/2+3k，0≤t≤6只k=0,1，故{1/2,7/2} min。另一最低候选t=−1在域外，t=0/6虽同高是不同端点。改s秒：t=s/60，H(s)=5−(3/2)cos((π/180)s+π/3)，0≤s≤360，T=360 s、h=−60 s，中线时刻{30,210} s。E=7 m超过13/2，空集。匀速与连续理想高度是假设，图表是推导而非家庭实测。'
      : '内部角(π/4)(t−2)，A=5/2 m、D=7 m、B=π/4 rad/s、h=2 s，振幅5/2 m，像集[9/2,19/2] m，T=8 s。时刻0,2,4,6,8对应9/2,7,19/2,7,9/2 m；最高t=4，最低t=0和8，两端虽同终边仍是不同合法时间。H=7要求sin u=0，u=kπ，t=2+4k，0≤t≤8只k=0,1，故{2,6} s。改v分钟：t=60v，H(v)=7+(5/2)sin(15πv−π/2)，0≤v≤2/15，T=2/15 min、h=1/30 min，中线时刻{1/30,1/10} min。E=10 m超过19/2，空集。匀速与连续理想高度是假设，不是实际设施预测保证或家庭实测。',
    near
      ? 'Inner angle=(π/3)(t+1). A=−3/2 m,D=5 m,B=π/3 rad/min,h=−1 min; amplitude=3/2 m,image=[7/2,13/2] m,T=6 min. Times0,1/2,2,7/2,5,6 give heights17/4,5,13/2,5,7/2,17/4 m. Maximum at2,minimum at5: negative A reverses cosine maxima into height minima. For H=5,cos u=0 implies u=π/2+kπ,t=1/2+3k;0≤t≤6 admits only k=0,1,so {1/2,7/2} min. The minimum candidate−1 is outside. Times0 and6 have equal heights but are different endpoints. With s seconds,t=s/60: H(s)=5−(3/2)cos((π/180)s+π/3),domain[0,360],T=360 s,h=−60 s,midline times{30,210} s. E=7 m exceeds13/2,so no solution. Uniform ideal continuous motion is assumed; derived paper graphs/tables are not household measurements.'
      : 'Inner angle=(π/4)(t−2). A=5/2 m,D=7 m,B=π/4 rad/s,h=2 s;amplitude=5/2 m,image=[9/2,19/2] m,T=8 s. Times0,2,4,6,8 give heights9/2,7,19/2,7,9/2 m. Maximum at4,minima at BOTH0 and8: coterminal endpoints remain different allowed times. For H=7,sin u=0 implies u=kπ,t=2+4k;0≤t≤8 admits only k=0,1,so {2,6} s. With v minutes,t=60v: H(v)=7+(5/2)sin(15πv−π/2),domain[0,2/15],T=2/15 min,h=1/30 min,midline times{1/30,1/10} min. E=10 m exceeds19/2,so no solution. Uniform ideal continuous motion is assumed; this is neither an actual facility guarantee nor household measurement.',
  );
  table(q4, [
    [
      'M',
      '虚构高度与原时间域',
      'Fictional height and original time domain',
      near
        ? 'H(t)=5−(3/2)cos((π/3)t+π/3) m；t∈[0,6] min'
        : 'H(t)=7+(5/2)sin((π/4)t−π/2) m；t∈[0,8] s',
      near
        ? 'H(t)=5−(3/2)cos((π/3)t+π/3) m;t∈[0,6] min'
        : 'H(t)=7+(5/2)sin((π/4)t−π/2) m;t∈[0,8] s',
    ],
    [
      'T',
      '须亲算的完整表输入',
      'Times to evaluate yourself',
      near ? 't=0,1/2,2,7/2,5,6 min' : 't=0,2,4,6,8 s',
      near ? 't=0,1/2,2,7/2,5,6 min' : 't=0,2,4,6,8 s',
    ],
    [
      'U',
      '新时间变量',
      'New time variable',
      near ? 's，单位秒' : 'v，单位分钟',
      near ? 's in seconds' : 'v in minutes',
    ],
    [
      'E',
      '独立目标高度',
      'Separate target height',
      near ? '7 m' : '10 m',
      near ? '7 m' : '10 m',
    ],
  ]);
  const q5 = card(
    5,
    '① 解T：先写正切全部实分支，再反解原x、给精确整数周期范围和完整有限解集。另列原域里所有正切无定义点，逐个解释为何不计为根、图为何须断开；最后代回。② 解X并解释目标为极值时两常见分支会怎样合并：不能重复计同一实数，也不能删掉不同但同终边的合法输入。③ 对P，找不到常用特殊角表就能说无解吗？用主反函数符号先定义一个角，再由圆的对称/整周写全部实分支，筛原区间并说明正好两个。此题在纸上完成，不要求精确特殊角。保留旧sin/cos倍率平移与开闭端点任务。',
    '① Solve T: give ALL real tangent branches, invert to x, give exact integer-period bounds and the COMPLETE finite set. Separately list EVERY tangent pole in the original interval, explaining why none is a root and why the graph must break there; substitute roots back. ② Solve X and explain how the two usual branches merge at an extreme target. Do not double-count the same real number or delete DIFFERENT coterminal allowed inputs. ③ For P, does absence from a common special-angle table imply no solution? Define one angle by a principal inverse, use circle symmetry/turns for ALL real branches, then filter the original interval and prove there are exactly two. Work P on paper; no exact special angle is required. Retain the existing transformed sine/cosine and endpoint tasks.',
    near
      ? 'T：内部角kπ，x=π/4−kπ/2，k∈Z；原域要求−1≤k≤1，根{−π/4,π/4,3π/4}。极点由−2(x−π/4)=π/2+jπ得x=−jπ/2，域内为{0,π/2}，内部角的余弦为0所以无定义，不是根；各真根内部角为整数π，tan值为0。X：2x=π/2+2kπ，所以x=π/4+kπ，k=0,1，{π/4,5π/4}；另一写法π−π/2就是同一支，不双算，两相隔π的x仍须保留。P：α=arcsin(1/3)∈(0,π/2)，全部α+2kπ或π−α+2kπ；[0,2π)仅k=0，{α,π−α}，两不同角。圆上高度1/3有两个点；不是常用特殊角不等于无解。'
      : 'T：内部角π/4+kπ，x=−π/12+kπ/3，原域筛k=0,1,2，根{−π/12,π/4,7π/12}。极点由3(x+π/6)=π/2+jπ得x=jπ/3，域内为{0,π/3,2π/3}，内部角的余弦为0，正切无定义而非根；真根tan值为1。X：−2x=π+2kπ，x=−π/2−kπ；原域只k=−1,0，{−π/2,π/2}。cos的±π分支相差整周、是同一族，先去重再筛；不能把不同的两个x删成同终边一个。P：β=arccos(1/3)∈(0,π/2)，全部±β+2kπ；[0,2π)给{β,2π−β}，正支k=0、负支k=1，正好两个。圆上横坐标1/3有两个点；查表没有值不构成无解证明。',
    near
      ? 'T: u=kπ gives x=π/4−kπ/2. Original bounds give −1≤k≤1;roots{−π/4,π/4,3π/4}. Poles solve −2(x−π/4)=π/2+jπ,so x=−jπ/2,within the domain{0,π/2}. Their inner cosine is zero: undefined,not roots;break the graph. Each true root has integer-π argument and tangent zero. X:2x=π/2+2kπ gives x=π/4+kπ,k=0,1;{π/4,5π/4}. The other branch π−π/2 is identical,so deduplicate the family,not different allowed inputs. P:α=arcsin(1/3)∈(0,π/2). All roots are α+2kπ or π−α+2kπ. On [0,2π) only k=0,so {α,π−α},two distinct angles. Height1/3 meets the circle twice; absence from a special-angle table does not imply no solution.'
      : 'T:u=π/4+kπ gives x=−π/12+kπ/3. Original bounds admit k=0,1,2;roots{−π/12,π/4,7π/12}. Poles solve3(x+π/6)=π/2+jπ,so x=jπ/3,within the domain{0,π/3,2π/3}. Inner cosine zero means undefined,not roots;true roots have tangent one. X:−2x=π+2kπ gives x=−π/2−kπ,k=−1,0;{−π/2,π/2}. Cosine branches ±π differ by a full turn and describe one family;deduplicate it before filtering,without deleting different allowed x values. P:β=arccos(1/3)∈(0,π/2). All roots are ±β+2kπ. On [0,2π),the positive branch has k=0 and negative branch k=1,giving {β,2π−β},exactly two. Horizontal coordinate1/3 meets the circle twice; table absence is not a no-solution proof.',
  );
  table(q5, [
    [
      'T',
      '正切原题',
      'Original tangent equation',
      near
        ? 'tan(−2(x−π/4))=0；x∈[−π/4,3π/4]'
        : 'tan(3(x+π/6))=1；x∈[−π/6,5π/6)',
      near ? 'tan(−2(x−π/4))=0;x∈[−π/4,3π/4]' : 'tan(3(x+π/6))=1;x∈[−π/6,5π/6)',
    ],
    [
      'X',
      '独立极值目标',
      'Separate extreme target',
      near ? 'sin(2x)=1；x∈[0,2π]' : 'cos(−2x)=−1；x∈[−π,π)',
      near ? 'sin(2x)=1;x∈[0,2π]' : 'cos(−2x)=−1;x∈[−π,π)',
    ],
    [
      'P',
      '独立纸上非特殊角题',
      'Separate paper non-special-angle problem',
      near ? 'sinx=1/3；x∈[0,2π)' : 'cosx=1/3；x∈[0,2π)',
      near ? 'sinx=1/3;x∈[0,2π)' : 'cosx=1/3;x∈[0,2π)',
    ],
  ]);
  return {
    id: `${unit}-MAINT-CIRCULAR-MEANING`,
    unit,
    title: t(
      '累积与几何之后，再核圆点、时间与全解',
      'After accumulation and geometry, recheck circle points, time and complete roots',
    ),
    intro: t(
      '五张独立纸笔卡，一次一个编号/案例，可分次、不计时；先生成自己的精确式、图表与集合，再逐项人工审核。',
      'Five independent paper cards,one numbered part/case per untimed sitting. Generate exact expressions,graphs,tables and sets before human review of each part.',
    ),
    bridge: 'H04-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 3, 5, 4, 6].map((n, i) => [id(i + 1), `H04-L0${n}`]),
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const circularMeaningRetrieval = {
  H32_CIRCULAR_MEANING: makeSet('H32'),
  H36_CIRCULAR_MEANING: makeSet('H36'),
};
