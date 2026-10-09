import { t, q, type Lesson } from './schema';
type Pair = [string, string];
type Check = [string, string, Pair[], number, string, string];
type Draft = {
  id: string;
  kind: Lesson['kind'];
  minutes: number;
  title: Pair;
  subtitle: Pair;
  hook: Pair;
  prediction: Pair;
  predictions: Pair[];
  explore: Pair;
  concept: Pair;
  example: Pair;
  misconception: Pair;
  realWorld: Pair;
  summary: Pair;
  homeExperiment: Pair;
  vocabulary: Pair[];
  formula: Pair;
  questions: Check[];
  exit: Check;
};
const make = (d: Draft): Lesson => ({
  ...d,
  stage: 4,
  unit: 'algebra',
  title: t(...d.title),
  subtitle: t(...d.subtitle),
  hook: t(...d.hook),
  prediction: t(...d.prediction),
  predictions: d.predictions.map((p) => t(...p)),
  explore: t(...d.explore),
  concept: t(...d.concept),
  example: t(...d.example),
  misconception: t(...d.misconception),
  realWorld: t(...d.realWorld),
  summary: t(...d.summary),
  homeExperiment: t(...d.homeExperiment),
  vocabulary: d.vocabulary.map((p) => t(...p)),
  formula: t(...d.formula),
  questions: d.questions.map((c) => q(...c)),
  exit: q(...d.exit),
});
export const algebraLessons: Lesson[] = [
  make({
    id: 'algebra-robot-letters',
    kind: 'algebra-variables',
    minutes: 18,
    title: [
      '机器人说明书里的字母，能替我们做什么？',
      'What can letters in a robot’s instructions do for us?',
    ],
    subtitle: [
      '给量起名字，把一个答案变成一条可重复使用的规则。',
      'Name quantities and turn one answer into a reusable rule.',
    ],
    hook: [
      '送书机器人要沿直线走到书架。换一个速度设置，就要重新写一整页说明书吗？把速度叫v、运行时间叫t，距离叫d，试试看。',
      'A book-delivery robot travels straight to a shelf. Must its entire instruction sheet be rewritten for a new speed? Call speed v, running time t and distance d. Try using those names.',
    ],
    prediction: [
      '同一机器人匀速走4秒，速度从1 m/s变成2 m/s，距离怎样变？',
      'The same robot moves steadily for 4 s. Speed changes from 1 to 2 m/s. What happens to distance?',
    ],
    predictions: [
      ['从4 m变成8 m', 'It changes from 4 to 8 m'],
      ['仍是4 m，因为时间没变', 'It stays 4 m because time is unchanged'],
      ['字母v变了，无法计算', 'A changed v makes calculation impossible'],
    ],
    explore: [
      '完整运行三组指令：1 m/s走4 s、2 m/s走4 s、1 m/s走8 s。看同一把0–24 m尺上的机器人，并记录v、t和d。自由速度滑块允许你试别的数；说出每次保持什么不变。',
      'Run all three instructions: 1 m/s for 4 s, 2 m/s for 4 s and 1 m/s for 8 s. Follow the robot on the shared 0–24 m ruler and retain v, t and d. Try other speeds freely and name what stays fixed.',
    ],
    concept: [
      '变量是物理量的名字，数值可以随情境改变。d=vt表示在直线、速度大小不变的运动中，路程等于速率乘时间。这里v表示速率大小，机器人只向右走，所以路程也等于位置增加量。输入v和t，算出的d是输出；“输入”和“输出”是这次任务中的角色，不是字母永远的身份。',
      'A variable names a quantity whose value may change between situations. For steady straight motion, d=vt gives distance as speed times time. Here v is speed magnitude and the robot travels only right, so distance equals its position increase. Given v and t, d is the output. Input/output roles belong to this task, not permanently to the letters.',
    ],
    formula: ['d = vt；d用m，v用m/s，t用s', 'd = vt; d in m, v in m/s, t in s'],
    example: [
      'v=2 m/s，t=4 s：d=(2 m/s)×(4 s)=8 m。改成v=1 m/s、t=8 s仍得8 m。相同输出可以来自不同输入，不能只看到终点就认定速度相同。',
      'v=2 m/s and t=4 s give d=(2 m/s)×(4 s)=8 m. v=1 m/s and t=8 s also give 8 m. Different inputs can produce the same output; a shared endpoint does not prove equal speeds.',
    ],
    misconception: [
      'v不是“某一个永远固定的数字”，也不代表字母本身能推动机器人。先读定义和单位。d=vt只用于这里的匀速模型；有停顿或速度变化时，需要分段或用合适的平均速率。',
      'v is not one permanently fixed number, and a letter cannot push the robot. Read its definition and unit. This use of d=vt assumes steady motion; stops or changing speeds need segments or an appropriate average speed.',
    ],
    realWorld: [
      '写一个小游戏角色的移动规则时，速度和时间可以作为设置，位置作为结果。程序每次计算都要确认时间单位，别把毫秒直接当秒。',
      'In a game’s movement rule, speed and time can be settings and position the result. A program must check time units every time; milliseconds are not seconds.',
    ],
    summary: [
      '字母让规则可复用；每个字母都要有明确的物理量和单位。',
      'Letters make a rule reusable; each needs a defined quantity and unit.',
    ],
    homeExperiment: [
      '在纸上画一把0–12格尺，用纽扣当机器人。写三张速度/时间指令卡，每秒挪指定格数。把每张卡的输入和终点写进表，不把纸上模型当作真实机器人实测。',
      'Draw a 0–12 square ruler and use a button as the robot. Make three speed/time cards, moving the stated squares per second. Table each card’s inputs and endpoint; label it a paper model, not a real robot measurement.',
    ],
    vocabulary: [
      ['变量', 'variable'],
      ['输入量', 'input quantity'],
      ['输出量', 'output quantity'],
      ['固定条件', 'fixed condition'],
    ],
    questions: [
      [
        '本课v表示什么？',
        'What does v mean here?',
        [
          ['运行时间', 'Running time'],
          ['速率大小，单位m/s', 'Speed magnitude, in m/s'],
          ['固定为2的数', 'A number permanently equal to 2'],
        ],
        1,
        '字母的定义来自模型。',
        'The model defines the letter.',
      ],
      [
        '匀速1.5 m/s走4 s，路程？',
        'Steady motion at 1.5 m/s for 4 s: distance?',
        [
          ['6 m', '6 m'],
          ['0.375 m', '0.375 m'],
          ['5.5 m', '5.5 m'],
        ],
        0,
        '每秒1.5 m，共4秒。',
        '1.5 m each second for four seconds.',
      ],
      [
        '两次都走8 m，能确定速度相同吗？',
        'Both trips cover 8 m. Must speeds match?',
        [
          ['能，终点相同就够了', 'Yes; the shared endpoint is enough'],
          ['不能，还需要时间等信息', 'No; time or other information is needed'],
        ],
        1,
        '2×4和1×8给出同一距离。',
        '2×4 and 1×8 give the same distance.',
      ],
    ],
    exit: [
      '机器人暂停了2秒，如何改进原模型？',
      'The robot pauses for 2 s. How should you improve the model?',
      [
        [
          '区分移动时间与总时间，分段计算',
          'Distinguish moving and elapsed time; use segments',
        ],
        ['把暂停当作同速移动', 'Count the pause as steady travel'],
      ],
      0,
      '先让模型符合实际过程。',
      'Make the model fit what actually happens.',
    ],
  }),
  make({
    id: 'algebra-lamp-substitution',
    kind: 'algebra-substitution',
    minutes: 19,
    title: [
      '小灯亮了半分钟，2×0.5为什么不对？',
      'A lamp runs for half a minute. Why is 2×0.5 wrong?',
    ],
    subtitle: [
      '代入前，把数字和单位一起搬进公式。',
      'Bring both numbers and units into the equation.',
    ],
    hook: [
      '标着2 W的小灯亮30秒，你算出60 J；朋友看到“0.5分钟”却算出1 J。同一段亮灯过程，怎么有两个答案？',
      'A 2 W lamp runs for 30 seconds: you calculate 60 J. A friend reads “0.5 minutes” and gets 1 J. How can one run have two answers?',
    ],
    prediction: [
      '2 W灯亮30 s，与亮0.5 min，转移的电能怎样比较？',
      'Compare a 2 W lamp running for 30 s and for 0.5 min. How do transferred energies compare?',
    ],
    predictions: [
      ['30 s耗能大60倍', 'The 30 s run transfers 60 times more'],
      ['相同，因为时间相同', 'They match because the durations match'],
      ['0.5 min没有小数单位', '0.5 min is not a valid time'],
    ],
    explore: [
      '比较2 W·30 s、2 W·0.5 min、5 W·30 s。完整检查“原始时间→秒→代入→焦耳”。观察共用0–300 J刻度的能量条；改自由时间后，单位换算仍然生效。',
      'Compare 2 W·30 s, 2 W·0.5 min and 5 W·30 s. Inspect raw time → seconds → substitution → joules. Energy bars share 0–300 J. Free time changes still pass through the unit conversion.',
    ],
    concept: [
      '代入不是随手乘两个数。先认量：功率P用W，时间t用s，电能E用J。恒定功率下E=Pt，且1 W=1 J/s。因此分钟先乘60换成秒，s再与J/s中的s相消。单位既是标签，也是检查关系是否匹配的线索。',
      'Substitution means more than multiplying two bare numbers. Identify power P in W, time t in s and electrical energy E in J. At constant power, E=Pt and 1 W=1 J/s. Convert minutes to seconds by multiplying by 60; s then cancels the denominator in J/s. Units label quantities and help check the relationship.',
    ],
    formula: [
      'E = Pt；1 W = 1 J/s；1 min = 60 s',
      'E = Pt; 1 W = 1 J/s; 1 min = 60 s',
    ],
    example: [
      '0.5 min×60 s/min=30 s。E=(2 J/s)×30 s=60 J。改成5 W、30 s：E=150 J。这里算转移的总电能，不等于全部变成可见光。',
      '0.5 min×60 s/min=30 s. E=(2 J/s)×30 s=60 J. At 5 W for 30 s, E=150 J. This is total transferred electrical energy, not energy entirely converted to visible light.',
    ],
    misconception: [
      '2×0.5可以得到1 W·min；它不是1 J。若写焦耳，必须转换。小数时间完全正常；也别把W与J当作同一种量。',
      '2×0.5 gives 1 W·min, not 1 J. To report joules, convert. Fractional minutes are valid, and watts and joules name different quantities.',
    ],
    realWorld: [
      '设备功率和使用时间共同影响耗能。家庭电量常用kWh；也能先把kW乘h，保持单位配对。实际设备功率可能变化，本课取恒定教学值。',
      'Both device power and use time affect energy. Home bills often use kWh; kW×h is another consistent unit pairing. Real power may vary; this lesson uses assigned constant values.',
    ],
    summary: [
      '先识别量与单位，再转换、代入、保留结果单位。',
      'Identify quantities and units, convert, substitute and keep the result’s unit.',
    ],
    homeExperiment: [
      '用纸做两张同一时间卡：30 s与0.5 min。给同一虚拟2 W灯各算一次能量，把换算写全。无需触碰灯具、插座或电池接线。',
      'Make two paper cards for one duration: 30 s and 0.5 min. Calculate a virtual 2 W lamp’s energy from each card, writing the conversion. No lamp, socket or battery wiring is needed.',
    ],
    vocabulary: [
      ['代入', 'substitution'],
      ['换算因子', 'conversion factor'],
      ['功率', 'power'],
      ['量纲检查', 'dimensional check'],
    ],
    questions: [
      [
        '0.5 min是多少秒？',
        'How many seconds is 0.5 min?',
        [
          ['0.5 s', '0.5 s'],
          ['300 s', '300 s'],
          ['30 s', '30 s'],
        ],
        2,
        '一分钟60秒。',
        'A minute contains sixty seconds.',
      ],
      [
        '3 W灯亮20 s，电能？',
        'A 3 W lamp runs for 20 s. Energy?',
        [
          ['60 J', '60 J'],
          ['60 W', '60 W'],
          ['0.15 J', '0.15 J'],
        ],
        0,
        '(3 J/s)×20 s=60 J。',
        '(3 J/s)×20 s=60 J.',
      ],
      [
        '2×0.5未换算分钟，结果单位应写？',
        'Multiply 2×0.5 without converting minutes. Which unit?',
        [
          ['J', 'J'],
          ['W·min', 'W·min'],
          ['m/s', 'm/s'],
        ],
        1,
        '单位必须跟随原输入。',
        'Units must follow the original inputs.',
      ],
    ],
    exit: [
      '同一恒定4 W设备，15 s与0.25 min如何比较？',
      'A constant 4 W device: compare 15 s with 0.25 min.',
      [
        ['0.25 min耗能更少', 'The 0.25 min run transfers less'],
        [
          '均60 J，时间单位不同但量相同',
          'Both transfer 60 J; different units, same duration',
        ],
      ],
      1,
      '0.25×60=15，再乘4。',
      '0.25×60=15, then multiply by 4.',
    ],
  }),
  make({
    id: 'algebra-find-the-time',
    kind: 'algebra-rearrange',
    minutes: 20,
    title: [
      '知道书架有多远，怎样反过来找时间？',
      'You know the shelf’s distance. How can you find time?',
    ],
    subtitle: [
      '等式两边做同一件事，让未知量独立。',
      'Apply the same operation to both sides to isolate the unknown.',
    ],
    hook: [
      '机器人的公式是d=vt，但现在说明书问的是“多久到达”。有人说把v移过去，有人直接猜d×v。把等式看成一架保持平衡的天平会更清楚。',
      'The robot’s rule is d=vt, but now the question asks how long arrival takes. One person says “move v”; another guesses d×v. Treating the equation as a balanced scale makes the operation clearer.',
    ],
    prediction: [
      '距离固定120 m，匀速从2变成4 m/s，所需时间怎样变？',
      'For a fixed 120 m trip, steady speed changes from 2 to 4 m/s. What happens to time?',
    ],
    predictions: [
      ['从60 s变成120 s', 'It changes from 60 to 120 s'],
      ['时间不变', 'Time stays unchanged'],
      ['从60 s变成30 s', 'It changes from 60 to 30 s'],
    ],
    explore: [
      '检查120 m/2 m/s、120 m/4 m/s、240 m/4 m/s。完整播放每次等式变形，看两边都除以v，再看t的值。自由速度设为0，比较“不能到达”的提示与非法除零。',
      'Inspect 120 m at 2 m/s, 120 m at 4 m/s and 240 m at 4 m/s. Follow both sides divided by v before t is evaluated. Try zero speed and compare “cannot arrive” with an invalid division by zero.',
    ],
    concept: [
      '等式两边相等，对两边做同一种合法运算才保持等式。d=vt两边除以非零v，得d/v=t，即t=d/v。先做符号变形，再代入可以清楚保留未知量。v=0时不能除以v；对正距离的匀速任务，静止机器人不会到达，不能给一个有限到达时间。',
      'An equation states equality. Applying the same valid operation to both sides preserves it. Divide d=vt by nonzero v to obtain d/v=t, or t=d/v. Rearrange symbols before substituting to keep the unknown clear. At v=0 division is invalid; a stationary robot cannot cover a positive trip distance in a finite time.',
    ],
    formula: [
      'd = vt → d/v = vt/v → t = d/v（v ≠ 0）',
      'd = vt → d/v = vt/v → t = d/v (v ≠ 0)',
    ],
    example: [
      'd=120 m、v=2 m/s：t=120 m/(2 m/s)=60 s。回代：2 m/s×60 s=120 m。若误用d×v，单位会成为m²/s，不能是时间。',
      'd=120 m, v=2 m/s: t=120 m/(2 m/s)=60 s. Substitute back: 2 m/s×60 s=120 m. An incorrect d×v has units m²/s, which cannot be time.',
    ],
    misconception: [
      '“移项”不是让字母神秘换位置。这里的实质是两边同除非零v；也不能只除右边，或把vt看成v+t。',
      'A letter does not mysteriously change sides. Both sides are divided by nonzero v. Dividing only one side breaks equality, and vt means multiplication, not v+t.',
    ],
    realWorld: [
      '安排一次步行，可以从路线长度和假定平均速率估计时间。若含等车和停留，再加这些时间，并把假设写出来；匀速图不会预测真实交通。',
      'Estimate walking time from route length and an assumed average speed. Add waits or stops separately and state assumptions. A steady-motion diagram does not predict traffic.',
    ],
    summary: [
      '两边同运算，明确除数非零；用单位和回代检查答案。',
      'Use the same operation on both sides, check nonzero divisors, then verify units and substitute back.',
    ],
    homeExperiment: [
      '写一张纸卡d=vt。两边各画“÷v”，得到t=d/v。选6 m、0.5 m/s算12 s，再回代。把v=0另做一张卡，解释为什么这一步不合法。',
      'Write d=vt on paper. Draw “÷v” on both sides to get t=d/v. Use 6 m and 0.5 m/s to obtain 12 s, then substitute back. Make a separate v=0 card and explain why division fails.',
    ],
    vocabulary: [
      ['等式', 'equation'],
      ['未知量', 'unknown'],
      ['公式变形', 'rearrangement'],
      ['回代检查', 'substitution check'],
    ],
    questions: [
      [
        '从d=vt找t，合法的关键操作？',
        'To isolate t in d=vt, what is the key operation?',
        [
          ['只让左边乘v', 'Multiply only the left side by v'],
          ['两边除以非零v', 'Divide both sides by nonzero v'],
          ['两边减去t', 'Subtract t from both sides'],
        ],
        1,
        '同一种合法运算保持相等。',
        'The same valid operation preserves equality.',
      ],
      [
        '180 m以3 m/s匀速前进，需要？',
        'Travel 180 m steadily at 3 m/s. Time?',
        [
          ['60 s', '60 s'],
          ['540 s', '540 s'],
          ['183 s', '183 s'],
        ],
        0,
        't=d/v=180/3。',
        't=d/v=180/3.',
      ],
      [
        '正距离且v=0，模型应怎样处理？',
        'Positive distance and v=0: what should the model do?',
        [
          ['给0秒', 'Return zero seconds'],
          [
            '说明无法到达，不执行除零',
            'Explain no arrival and do not divide by zero',
          ],
        ],
        1,
        '零速率不能完成正距离。',
        'Zero speed cannot cover a positive distance.',
      ],
    ],
    exit: [
      '计算得t=25 s、v=4 m/s，如何检查d=100 m？',
      'You found t=25 s with v=4 m/s. How do you check d=100 m?',
      [
        ['回代4×25=100，并检查m/s×s=m', 'Substitute 4×25=100; check m/s×s=m'],
        ['只看25是不是整数', 'Check only whether 25 is an integer'],
      ],
      0,
      '数值、关系和单位一起检查。',
      'Check numbers, relation and units together.',
    ],
  }),
  make({
    id: 'algebra-paper-map',
    kind: 'algebra-ratio',
    minutes: 18,
    title: [
      '纸上3厘米，怎么变成公园里的300米？',
      'How do 3 paper centimetres become 300 park metres?',
    ],
    subtitle: [
      '先把比例两端说清楚，再决定放大多少。',
      'Define both sides of a ratio before choosing its scale factor.',
    ],
    hook: [
      '你画了一张公园路线图，每1 cm代表100 m。朋友以为“1:100”就对了。纸与真实路程的单位不同，比例尺到底是多少？',
      'On your park map, 1 cm represents 100 m. A friend labels it “1:100”. Paper and real route units differ. What is the actual scale ratio?',
    ],
    prediction: [
      '每1 cm代表100 m，纸上6 cm路线对应多长？',
      'At 100 m per 1 cm, what real distance does a 6 cm route represent?',
    ],
    predictions: [
      ['600 m', '600 m'],
      ['6 m', '6 m'],
      ['60 m', '60 m'],
    ],
    explore: [
      '比较3 cm和6 cm在100 m/cm的图上，再比较3 cm在200 m/cm的图上。图上尺共用0–8 cm、真实路程条共用0–1600 m。完整检查同单位比例1:n和路线换算，观察更换比例尺会怎样。',
      'Compare 3 and 6 cm at 100 m/cm, then 3 cm at 200 m/cm. Paper rulers share 0–8 cm and route bars share 0–1600 m. Inspect the same-unit 1:n ratio and route conversion; observe what a scale change does.',
    ],
    concept: [
      '比例表达两个量怎样相比。写无单位的图上长度:实际长度，必须先用同一单位：1 cm:100 m=1 cm:10000 cm=1:10000。也可用带单位的换算率100 m/cm：实际路程=图上厘米数×100 m/cm。前者是无量纲比，后者带单位，不要混写。',
      'A ratio compares quantities. For the unitless map-length:real-length ratio, use matching units: 1 cm:100 m=1 cm:10000 cm=1:10000. Alternatively use the unit-bearing conversion rate 100 m/cm: real route = paper length × 100 m/cm. The dimensionless ratio and the unit-bearing rate must be distinguished.',
    ],
    formula: [
      '真实路程 = 图上长度 × 每厘米代表的米数；1 cm:100 m = 1:10000',
      'Real route = paper length × metres per centimetre; 1 cm:100 m = 1:10000',
    ],
    example: [
      '3 cm×100 m/cm=300 m，6 cm对应600 m。换成200 m/cm，3 cm对应600 m；图上同样长，可以表示不同真实路程。这里尺量的是画出的路线长度，不自动是起终点直线距离。',
      '3 cm×100 m/cm=300 m; 6 cm represents 600 m. At 200 m/cm, 3 cm also represents 600 m. Equal paper lengths can mean different real routes. Measure the drawn route, which need not equal the straight separation of endpoints.',
    ],
    misconception: [
      '“1:100”要求单位相同，不能用1 cm和100 m直接去掉单位。把比例尺换了，真实公园没有因此变大；变化的是纸图如何表示它。',
      '“1:100” requires matching units; you cannot drop units from 1 cm and 100 m. A changed map scale does not enlarge the park; it changes how paper represents it.',
    ],
    realWorld: [
      '看地图先找比例尺。手机地图缩放后比例尺会变；量屏幕之前检查它。规划步行时量沿路的长度，别跨过湖直接连两点。',
      'Check a map’s scale first. Phone-map zoom changes it, so inspect it before measuring the screen. For walking, measure along the route rather than across a lake between endpoints.',
    ],
    summary: [
      '比例两端先同单位；带单位的换算率让缩放过程清楚可查。',
      'Match units before forming a ratio; a unit-bearing rate makes scaling traceable.',
    ],
    homeExperiment: [
      '画6 cm折线路线，标1 cm代表10 m。算60 m，另写1:1000。给同一路线做一张更小的图，并解释为什么路线实际长度没变。',
      'Draw a 6 cm bent route at 10 m per centimetre. Calculate 60 m and label 1:1000. Draw a smaller map of the same route and explain why its real length stays unchanged.',
    ],
    vocabulary: [
      ['比例', 'ratio'],
      ['比例尺', 'scale ratio'],
      ['换算率', 'conversion rate'],
      ['无量纲', 'dimensionless'],
    ],
    questions: [
      [
        '1 cm代表100 m，无单位比例尺？',
        '1 cm represents 100 m. Unitless scale ratio?',
        [
          ['1:100', '1:100'],
          ['1:1000', '1:1000'],
          ['1:10000', '1:10000'],
        ],
        2,
        '100 m先换10000 cm。',
        'Convert 100 m to 10000 cm first.',
      ],
      [
        '4 cm、50 m/cm，对应路线？',
        '4 cm at 50 m/cm: real route?',
        [
          ['200 m', '200 m'],
          ['12.5 m', '12.5 m'],
          ['54 m', '54 m'],
        ],
        0,
        'cm与分母cm相消。',
        'cm cancels cm in the denominator.',
      ],
      [
        '缩放手机地图后量屏幕，先检查？',
        'Before measuring a zoomed phone map, check what?',
        [
          ['屏幕是否发亮', 'Whether the screen is bright'],
          ['当前比例尺', 'The current scale'],
          ['原比例尺永远不变', 'The original scale never changes'],
        ],
        1,
        '图的缩放改变每厘米代表的长度。',
        'Zoom changes distance represented by each centimetre.',
      ],
    ],
    exit: [
      '同为2 cm，甲图100 m/cm、乙图200 m/cm，真实路线？',
      'Both routes measure 2 cm: map A is 100 m/cm; B is 200 m/cm. Real routes?',
      [
        ['甲乙均2 m', 'Both are 2 m'],
        ['甲200 m、乙400 m', 'A is 200 m; B is 400 m'],
      ],
      1,
      '图上长度必须与自己的比例尺配对。',
      'Pair each paper length with its own scale.',
    ],
  }),
  make({
    id: 'algebra-spring-proportion',
    kind: 'algebra-direct',
    minutes: 20,
    title: [
      '弹簧变长了，哪一个长度与力成正比？',
      'A spring gets longer. Which length is proportional to force?',
    ],
    subtitle: [
      '找到恒定比值，也检查图线是否经过原点。',
      'Find the constant ratio and check whether the line passes through the origin.',
    ],
    hook: [
      '原长20 cm的弹簧受2 N力后总长30 cm，受4 N力后总长40 cm。力翻倍了，为什么总长度没有翻倍？找对比较的量才看得到规律。',
      'A 20 cm spring has total length 30 cm at 2 N and 40 cm at 4 N. Force doubled. Why did total length not double? Find the right quantity to compare.',
    ],
    prediction: [
      '在这个理想弹簧模型里，力从2 N增至4 N，哪个量翻倍？',
      'In this ideal spring model, force increases from 2 to 4 N. Which quantity doubles?',
    ],
    predictions: [
      ['总长度', 'Total length'],
      ['伸长量：从10 cm到20 cm', 'Extension: from 10 to 20 cm'],
      ['原长', 'Unstretched length'],
    ],
    explore: [
      '完整检查2、4、6 N三种平衡情况。看原长的灰色段、伸长的蓝色段，以及同坐标中的伸长/总长两条线。自由滑到0 N，看看哪条线经过原点。',
      'Inspect equilibrium at 2, 4 and 6 N. Compare the grey original-length section, blue extension and two lines on shared axes: extension and total length. Seek zero force and see which line passes through the origin.',
    ],
    concept: [
      'y与x成正比是y=kx，比例常数k固定；x非零时y/x恒定，图线经过原点。在本课小范围理想弹簧中F=k_s x，k_s=20 N/m，所以伸长x=F/k_s。这里x是比原长多出来的部分。总长L=L₀+x有非零起点，因此即使L–F是直线，L也不与F成正比。',
      'Direct proportion means y=kx with a fixed proportionality constant: y/x is constant for nonzero x and the graph passes through the origin. Our bounded ideal spring uses F=k_s x with k_s=20 N/m, giving extension x=F/k_s. x is the extra length beyond rest length. Total length L=L₀+x has a nonzero intercept; a straight L–F graph is not necessarily direct proportion.',
    ],
    formula: [
      'x = F/k_s；L = L₀ + x；本模型k_s = 20 N/m，L₀ = 0.20 m',
      'x = F/k_s; L = L₀ + x; here k_s = 20 N/m, L₀ = 0.20 m',
    ],
    example: [
      '2 N时x=0.10 m，4 N时x=0.20 m；x/F均为0.05 m/N。总长却是0.30 m和0.40 m，其比值不是2。F=0时x=0但L=0.20 m。',
      'At 2 N, x=0.10 m; at 4 N, x=0.20 m. x/F=0.05 m/N in both cases. Total lengths are 0.30 and 0.40 m, not in a 2:1 ratio. At F=0, x=0 but L=0.20 m.',
    ],
    misconception: [
      '“越大越大”只说明可能一起增加，不足以证明正比；“是一条直线”也不够，还要检查原点与恒定比值。真实弹簧拉得过大可能超出弹性范围，本图不预测那一段。',
      'Increasing together does not prove direct proportion. A straight line alone is also insufficient: check the origin and ratio. Real springs may leave their elastic range under excessive load; this diagram does not model that region.',
    ],
    realWorld: [
      '校准弹簧测力计要先找零点，再看刻度关系。如果只量总长而不减原长，就会误判力与形变的比例。',
      'Calibrating a spring force meter starts with zero, then its scale relationship. Measuring total length without subtracting rest length misidentifies force–deformation proportion.',
    ],
    summary: [
      '正比要量选对、条件固定、比值恒定，并经过原点。',
      'Direct proportion needs the right quantities, fixed conditions, a constant ratio and the origin.',
    ],
    homeExperiment: [
      '用纸条画20 cm原长，再分别加10、20、30 cm伸长。写两列“伸长”和“总长”，检验2、4、6 N对应的比值。只做纸模型，不往真实弹簧挂重物。',
      'Use paper to represent a 20 cm rest length plus 10, 20 and 30 cm extensions. Table extension and total length for 2, 4 and 6 N and compare ratios. Use a paper model without hanging weights on a real spring.',
    ],
    vocabulary: [
      ['正比', 'direct proportion'],
      ['比例常数', 'proportionality constant'],
      ['伸长量', 'extension'],
      ['截距', 'intercept'],
    ],
    questions: [
      [
        '哪个条件支持y与x正比？',
        'Which condition supports y directly proportional to x?',
        [
          ['只是一起增加', 'They merely increase together'],
          ['任何直线都行', 'Any straight line works'],
          ['y/x恒定且经过原点', 'Constant y/x and passage through the origin'],
        ],
        2,
        '关系是y=kx，不含额外常量。',
        'The relation is y=kx without an added constant.',
      ],
      [
        '本模型6 N时伸长？',
        'Model extension at 6 N?',
        [
          ['0.30 m', '0.30 m'],
          ['0.50 m', '0.50 m'],
          ['120 m', '120 m'],
        ],
        0,
        'x=6/20=0.30 m，总长0.50 m。',
        'x=6/20=0.30 m; total length is 0.50 m.',
      ],
      [
        'L=0.20 m+x说明总长与力？',
        'L=0.20 m+x means total length versus force is…',
        [
          [
            '正比，因为线是直的',
            'Direct proportion because its line is straight',
          ],
          [
            '线性但非正比，有非零截距',
            'Linear but not proportional, with a nonzero intercept',
          ],
        ],
        1,
        '零力时总长不为零。',
        'Total length is nonzero at zero force.',
      ],
    ],
    exit: [
      '另一弹簧零力长15 cm，2 N长19 cm、4 N长23 cm，比较什么？',
      'Another spring is 15 cm at zero force, 19 cm at 2 N and 23 cm at 4 N. What should you compare?',
      [
        [
          '先减15 cm，比较4与8 cm伸长',
          'Subtract 15 cm first; compare 4 and 8 cm extension',
        ],
        [
          '只比较19与23 cm就判正比',
          'Judge proportionality only from 19 and 23 cm',
        ],
      ],
      0,
      '原长必须从总长中扣除。',
      'Subtract rest length from total length.',
    ],
  }),
  make({
    id: 'algebra-area-inverse',
    kind: 'algebra-inverse',
    minutes: 19,
    title: [
      '鞋底面积翻倍，压强为什么反而减半？',
      'Double the sole area. Why does pressure halve?',
    ],
    subtitle: [
      '固定总力，追踪乘积恒定的反比关系。',
      'Keep total force fixed and follow the constant product.',
    ],
    hook: [
      '同样600 N的向下力，分散在窄底和宽底上。面积变大不代表力更大，却会改变每平方米分到多少力。把以前的压强知识变成可检查的比例。',
      'The same 600 N downward force is spread over narrow and wide bases. Greater area does not mean greater force, but changes force per square metre. Turn pressure knowledge into a checkable proportion.',
    ],
    prediction: [
      '力固定，面积翻倍，平均接触压强怎样变？',
      'Force stays fixed while area doubles. What happens to average contact pressure?',
    ],
    predictions: [
      ['翻倍', 'It doubles'],
      ['保持不变', 'It stays unchanged'],
      ['减半', 'It halves'],
    ],
    explore: [
      '比较0.02、0.04、0.08 m²底面积，力均为600 N。看俯视接触面（面积按同尺度）与p–A曲线；完整检查pA乘积。自由改面积，观察曲线向下但不是直线。',
      'Compare 0.02, 0.04 and 0.08 m² bases, each bearing 600 N. Inspect shared-scale contact areas and the p–A curve, then check pA. Change area freely: the curve decreases but is not straight.',
    ],
    concept: [
      '反比可写y=C/x，非零x时xy=C固定。本课p=F/A，F固定，所以pA=600 N。面积乘2，压强除2；面积乘4，压强除4。“一个增大、另一个减小”并不自动是反比，必须检查乘积和保持条件。这里用平均压强，不表示每个微小位置都均匀。',
      'Inverse proportion has y=C/x for nonzero x, with xy=C fixed. Here p=F/A at fixed force, so pA=600 N. Multiplying area by 2 divides pressure by 2; multiplying by 4 divides it by 4. Opposite trends alone do not establish inverse proportion: check the product and fixed conditions. This is average contact pressure, not equal pressure at every tiny location.',
    ],
    formula: [
      'p = F/A；F固定时pA = F；1 Pa = 1 N/m²',
      'p = F/A; at fixed F, pA = F; 1 Pa = 1 N/m²',
    ],
    example: [
      '600/0.02=30000 Pa=30 kPa；面积0.04 m²得15 kPa，0.08 m²得7.5 kPa。30×0.02=0.6 kN；用Pa乘m²才直接得到600 N。',
      '600/0.02=30000 Pa=30 kPa. At 0.04 m², pressure is 15 kPa; at 0.08 m² it is 7.5 kPa. 30×0.02=0.6 kN: use Pa×m² to obtain 600 N directly.',
    ],
    misconception: [
      'p–A下降的曲线不说明“压强加面积是常量”。真正恒定的是乘积，而且总力必须固定。若背包加重让F变化，就不再是同一条反比曲线。',
      'The decreasing p–A curve does not mean pressure plus area is constant. The product is constant, and total force must stay fixed. Adding load changes F and puts the situation on a different curve.',
    ],
    realWorld: [
      '雪鞋把载荷分到更大面积。对同样载荷，平均压强下降；是否陷入还受雪层性质、姿势和有效接触面积影响，公式不是完整地面预测。',
      'Snowshoes spread a load over a larger area, reducing average pressure at matched load. Sinking also depends on snow, posture and effective contact area; the equation is not a complete ground prediction.',
    ],
    summary: [
      '反比看乘积；先确认被固定的量，别只看趋势。',
      'Check a constant product for inverse proportion and name what stays fixed.',
    ],
    homeExperiment: [
      '画面积分别为1、2、4格的纸底，平均分配12个纸点。每格分别分到12、6、3点。写“每格点数×格数=12”，解释与压强的相似处和模型限制。',
      'Draw paper bases of 1, 2 and 4 squares and spread twelve paper dots evenly. Each square gets 12, 6 or 3 dots. Write dots per square × squares = 12; explain the analogy to pressure and its limits.',
    ],
    vocabulary: [
      ['反比', 'inverse proportion'],
      ['恒定乘积', 'constant product'],
      ['接触面积', 'contact area'],
      ['平均压强', 'average pressure'],
    ],
    questions: [
      [
        '本课反比关系保持什么不变？',
        'What stays fixed in this inverse relation?',
        [
          ['面积', 'Area'],
          ['总接触力', 'Total contact force'],
          ['压强', 'Pressure'],
        ],
        1,
        'p=F/A中固定F。',
        'F is fixed in p=F/A.',
      ],
      [
        '面积变为3倍、力不变，压强？',
        'Area triples with unchanged force. Pressure?',
        [
          ['原来的1/3', 'One-third of the original'],
          ['原来的3倍', 'Three times the original'],
          ['减去3 Pa', 'Subtract 3 Pa'],
        ],
        0,
        '乘3的分母使结果除3。',
        'Tripling the denominator divides the result by three.',
      ],
      [
        'p–A下降就能断定反比吗？',
        'Does a decreasing p–A graph alone prove inverse proportion?',
        [
          ['能，下降就够了', 'Yes; decrease alone is enough'],
          [
            '不能，还需pA恒定且条件一致',
            'No; check constant pA and matched conditions',
          ],
        ],
        1,
        '许多下降关系并非C/x。',
        'Many decreasing relations are not C/x.',
      ],
    ],
    exit: [
      '面积和总力同时翻倍，平均压强？',
      'Area and total force both double. Average pressure?',
      [
        ['仍相同，因为两倍相消', 'Unchanged because the factors cancel'],
        ['一定减半，只看面积即可', 'Always half; area alone is enough'],
      ],
      0,
      '(2F)/(2A)=F/A。',
      '(2F)/(2A)=F/A.',
    ],
  }),
  make({
    id: 'algebra-speed-squared',
    kind: 'algebra-square',
    minutes: 20,
    title: [
      '速度翻倍，为什么能量要数四格？',
      'Double the speed. Why do you need four energy tiles?',
    ],
    subtitle: [
      '把平方关系画成方阵，再用比值推理。',
      'Draw a square array and reason with ratios.',
    ],
    hook: [
      '2 kg教学小车在1 m/s时动能1 J。到2 m/s不是2 J，而是4 J。把速度倍数放到方阵的两条边上，你能看到多出的格子来自哪里。',
      'A 2 kg teaching cart has 1 J of kinetic energy at 1 m/s. At 2 m/s it has 4 J, not 2 J. Put the speed factor on both sides of a square array to see where the extra tiles come from.',
    ],
    prediction: [
      '同质量小车速率变成3倍，动能变成几倍？',
      'For the same mass, speed triples. How many times greater is kinetic energy?',
    ],
    predictions: [
      ['3倍', 'Three times'],
      ['6倍', 'Six times'],
      ['9倍', 'Nine times'],
    ],
    explore: [
      '比较1、2、3 m/s，质量均2 kg。检查v×v方阵、相同0–9 J刻度的动能条与曲线。自由改变速率可得到小数结果；方阵是数值面积，不是小车的实际面积。',
      'Compare 1, 2 and 3 m/s at fixed 2 kg mass. Inspect the v×v square array, common 0–9 J energy bar and curve. Free speeds give fractional values; the square represents numerical area, not the cart’s physical area.',
    ],
    concept: [
      '平方是一个数乘它自己，不是乘2。动能K=½mv²，固定质量时K与速率的平方成正比。若速率变为原来的r倍，动能比K₂/K₁=r²。这个比值比较要求原速率非零。K–v图弯曲，而K–v²图在质量不变时是过原点的直线。',
      'Squaring multiplies a number by itself, not by two. Kinetic energy is K=½mv², so at fixed mass K is proportional to speed squared. If speed becomes r times its original value, K₂/K₁=r², assuming nonzero initial speed. K–v is curved; K–v² is a straight line through the origin at fixed mass.',
    ],
    formula: [
      'K = ½mv²；质量固定时K₂/K₁ = (v₂/v₁)²',
      'K = ½mv²; at fixed mass, K₂/K₁ = (v₂/v₁)²',
    ],
    example: [
      'm=2 kg时，K的J数值等于v的m/s数值的平方：1→1 J，2→4 J，3→9 J。若从2降到1 m/s，速率减半，动能为原来的1/4。',
      'For m=2 kg, the numerical K in J equals the square of numerical v in m/s: 1→1 J, 2→4 J, 3→9 J. Reducing speed from 2 to 1 m/s halves speed and leaves one-quarter the kinetic energy.',
    ],
    misconception: [
      'v²不是2v。先平方速率，再乘½m。质量若也改变，不能只平方速率倍数；能量单位仍为J，不是“平方焦耳”。',
      'v² is not 2v. Square speed, then multiply by ½m. If mass also changes, the speed ratio alone is insufficient. Energy still has units J, not “squared joules”.',
    ],
    realWorld: [
      '移动物体变快会显著增加要消散的动能。只有在相同恒定制动力等条件下，制动距离才与这份能量直接相连；真实车辆还含反应距离和路况，不靠本图给安全车距。',
      'Faster objects carry substantially more kinetic energy to dissipate. Braking distance links directly to that energy only under conditions such as matched constant braking force. Real vehicles also involve reaction distance and road conditions; this chart is not a safe-following-distance tool.',
    ],
    summary: [
      '平方看两次倍数相乘；比较前固定其他条件。',
      'For a square relationship, multiply the factor twice and hold other conditions fixed.',
    ],
    homeExperiment: [
      '画1×1、2×2、3×3方阵，分别数1、4、9格。把每格标1 J，写同质量小车的三种速率卡。只做纸推理，无需让玩具加速碰撞。',
      'Draw 1×1, 2×2 and 3×3 grids and count 1, 4 and 9 tiles. Label each tile 1 J and write three speed cards for the same mass. Use paper reasoning without accelerating toys into collisions.',
    ],
    vocabulary: [
      ['平方', 'square'],
      ['倍数', 'factor'],
      ['动能', 'kinetic energy'],
      ['非线性', 'nonlinear'],
    ],
    questions: [
      [
        '3²等于？',
        'What is 3²?',
        [
          ['6', '6'],
          ['3', '3'],
          ['9', '9'],
        ],
        2,
        '3×3，而不是3×2。',
        '3×3, not 3×2.',
      ],
      [
        '同质量速率减半，动能？',
        'Same mass, speed halves. Kinetic energy?',
        [
          ['原来的1/4', 'One-quarter'],
          ['原来的1/2', 'One-half'],
          ['不变', 'Unchanged'],
        ],
        0,
        '(1/2)²=1/4。',
        '(1/2)²=1/4.',
      ],
      [
        '质量固定时哪张图过原点且是直线？',
        'At fixed mass, which graph is straight through the origin?',
        [
          ['K对v', 'K versus v'],
          ['K对v²', 'K versus v²'],
        ],
        1,
        'K=(½m)×v²。',
        'K=(½m)×v²: at fixed mass, the coefficient of v² is constant.',
      ],
    ],
    exit: [
      '质量翻倍、速率也翻倍，动能倍数？',
      'Mass doubles and speed doubles too. Energy factor?',
      [
        ['8倍：2×2²', 'Eight: 2×2²'],
        ['4倍：只算速率', 'Four: count speed alone'],
      ],
      0,
      '质量因子与平方速率因子共同作用。',
      'Combine the mass factor with the squared speed factor.',
    ],
  }),
  make({
    id: 'algebra-powers-of-ten',
    kind: 'algebra-notation',
    minutes: 19,
    title: [
      '六个零的小数，怎样写得不容易看错？',
      'How can you write a number with many zeros clearly?',
    ],
    subtitle: [
      '十的幂负责尺度，单位负责所量的是什么。',
      'Powers of ten describe scale; units identify the quantity.',
    ],
    hook: [
      '模型卡上写着0.000004 m，另一张写4000000 m。很容易数错零。把数字写成4×10的某个幂，可以同时看清大小和数量级。',
      'One model card reads 0.000004 m; another reads 4000000 m. Counting zeros is easy to get wrong. Writing each as 4 times a power of ten makes magnitude and order clearer.',
    ],
    prediction: [
      '0.000004 m的标准科学记数法是？',
      'Which is normalized scientific notation for 0.000004 m?',
    ],
    predictions: [
      ['4×10⁶ m', '4×10⁶ m'],
      ['4×10⁻⁶ m', '4×10⁻⁶ m'],
      ['0.4×10⁻⁶ m', '0.4×10⁻⁶ m'],
    ],
    explore: [
      '完整检查4×10⁻⁶、4×10³、4×10⁶ m三例。逐步看系数、指数和普通十进制表示。自由改变整数指数，再切到mm，检查单位改变时指数怎样补偿，物理长度是否相同。',
      'Inspect 4×10⁻⁶, 4×10³ and 4×10⁶ m. Follow coefficient, exponent and decimal representation. Change the integer exponent, then switch to mm: see how the exponent compensates while physical length stays unchanged.',
    ],
    concept: [
      '标准科学记数法a×10ⁿ对非零数要求1≤|a|<10，n为整数。10³=1000，10⁻³=1/1000；负指数不等于负长度。换单位仍需换数值：1 m=1000 mm，所以4×10⁻⁶ m=4×10⁻³ mm。同一单位下，正数可先比较指数；单位不同必须先统一。',
      'Normalized scientific notation a×10ⁿ requires 1≤|a|<10 for nonzero values and integer n. 10³=1000; 10⁻³=1/1000. A negative exponent does not mean negative length. Unit changes still change the number: 1 m=1000 mm, so 4×10⁻⁶ m=4×10⁻³ mm. For positive numbers in a common unit, compare exponents first; otherwise match units first.',
    ],
    formula: [
      'a × 10ⁿ（1 ≤ |a| < 10）；10⁻ⁿ = 1/10ⁿ；1 m = 10³ mm',
      'a × 10ⁿ (1 ≤ |a| < 10); 10⁻ⁿ = 1/10ⁿ; 1 m = 10³ mm',
    ],
    example: [
      '0.000004 m=4×10⁻⁶ m；4000 m=4×10³ m；4000000 m=4×10⁶ m。4000 m与4 km是同一长度；不要直接比较“指数3”和“指数0”而忽略单位。',
      '0.000004 m=4×10⁻⁶ m; 4000 m=4×10³ m; 4000000 m=4×10⁶ m. 4000 m and 4 km are equal lengths; comparing exponents 3 and 0 while ignoring units is invalid.',
    ],
    misconception: [
      '负指数表示倒数，不是把正数变负数。40×10²等于4000，但不符合标准系数范围，应整理成4×10³。指数只整理数字，不会自动说明测量精度。',
      'A negative exponent means a reciprocal, not a negative number. 40×10² equals 4000 but is not normalized; rewrite it as 4×10³. Exponents organize numbers and do not automatically establish measurement precision.',
    ],
    realWorld: [
      '微小结构和天体距离常需要很小或很大的数字。清楚写系数、指数与单位有助于核对数据；模型例数是教学卡，不冒充某个天体或细胞的实测值。',
      'Tiny structures and cosmic distances often need very small or large numbers. Clear coefficients, exponents and units make data easier to check. Our model cards are teaching values, not measurements of a particular cell or celestial object.',
    ],
    summary: [
      '系数在标准范围内，指数管尺度，单位必须保留。',
      'Normalize the coefficient, use the exponent for scale and retain the unit.',
    ],
    homeExperiment: [
      '做三张卡：0.006 m、600 m、600000 m。背面写6×10⁻³、6×10²、6×10⁵ m。再把第一张改用mm写6 mm，解释为什么长度没变。',
      'Make cards for 0.006 m, 600 m and 600000 m. On their backs write 6×10⁻³, 6×10² and 6×10⁵ m. Convert the first to 6 mm and explain why length stays the same.',
    ],
    vocabulary: [
      ['科学记数法', 'scientific notation'],
      ['系数', 'coefficient'],
      ['指数', 'exponent'],
      ['数量级', 'order of magnitude'],
    ],
    questions: [
      [
        '0.003 m的标准表示？',
        'Normalized notation for 0.003 m?',
        [
          ['3×10³ m', '3×10³ m'],
          ['0.3×10⁻³ m', '0.3×10⁻³ m'],
          ['3×10⁻³ m', '3×10⁻³ m'],
        ],
        2,
        '10⁻³是一千分之一。',
        '10⁻³ is one thousandth.',
      ],
      [
        '4×10⁻⁶ m换成mm？',
        'Convert 4×10⁻⁶ m to mm.',
        [
          ['4×10⁻³ mm', '4×10⁻³ mm'],
          ['4×10⁻⁹ mm', '4×10⁻⁹ mm'],
          ['4×10⁻⁶ mm', '4×10⁻⁶ mm'],
        ],
        0,
        'm换mm，数字乘1000，指数加3。',
        'Converting m to mm multiplies the number by 1000, adding 3 to the exponent.',
      ],
      [
        '40×10²怎样标准化？',
        'Normalize 40×10².',
        [
          ['4×10²', '4×10²'],
          ['4×10³', '4×10³'],
          ['40×10³', '40×10³'],
        ],
        1,
        '系数除10，十的幂乘10，值不变。',
        'Divide coefficient by ten and multiply the power factor by ten.',
      ],
    ],
    exit: [
      '4×10³ m与4 km哪个更长？',
      'Which is longer: 4×10³ m or 4 km?',
      [
        ['相同，先统一单位再比较', 'Equal; match units before comparing'],
        ['前者，指数3比0大', 'The former because 3 exceeds 0'],
      ],
      0,
      '1 km=1000 m。',
      '1 km=1000 m.',
    ],
  }),
];
