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
  unit: 'solving',
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
export const solvingLessons: Lesson[] = [
  make({
    id: 'solving-before-the-door',
    kind: 'solving-arrival',
    minutes: 23,
    title: [
      '机器人几时到门口？先画路，再碰公式。',
      'When will the robot reach the door? Sketch before equations.',
    ],
    subtitle: [
      '八步解题，把已知、未知和条件连起来。',
      'Eight reasoning steps connect given quantities, unknowns and conditions.',
    ],
    hook: [
      '机器人离社团教室门120 m，以2 m/s直线朝门走。朋友立刻写120×2；另一个写2÷120。数字都有，但哪条推理真正描述这趟路？',
      'A robot is 120 m from a club-room door and travels straight toward it at 2 m/s. One friend writes 120×2, another 2÷120. Both use the numbers, but which reasoning describes this trip?',
    ],
    prediction: [
      '如果仍离门120 m，而机器人保持0 m/s，什么时候到？',
      'Still 120 m from the door, the robot remains at 0 m/s. When does it arrive?',
    ],
    predictions: [
      ['0秒，因为速度是0', 'Zero seconds because speed is zero'],
      ['120秒，因为路程是120', '120 seconds because distance is 120'],
      ['没有有限到达时间', 'There is no finite arrival time'],
    ],
    explore: [
      '依次完成120 m/2 m/s、0.24 km/4 m/s和静止三种情境的八步。先描述和选图，统一单位、定义未知量，再选模型、填计算、查单位、反查结果。草稿在本机保存；选完理由才解锁下一步。',
      'Complete all eight steps for 120 m/2 m/s, 0.24 km/4 m/s, and a stationary robot. Describe and choose a sketch, unify units, define the unknown, choose a model, calculate, check units, and test the result. Drafts save on this device; supporting a step unlocks the next.',
    ],
    concept: [
      '八步不是八句口号，而是让每项计算有来处：先确认发生了什么；画带量和方向的图；列已知量及单位；定义未知；选择有条件的模型；代入计算；检查单位；判断答案与情境是否一致。可回看前一步修正理由。这里目标在前、速率固定，才可用d=vt；v>0才可除以v。',
      'The eight steps make every calculation traceable: establish the event; sketch quantities and directions; list givens with units; define the unknown; choose a conditional model; substitute and calculate; check units; test consistency with the scenario. Revisit earlier steps to repair reasoning. Here the target is ahead and speed fixed, so d=vt applies; dividing by v requires v>0.',
    ],
    formula: [
      'd=vt；朝目标匀速且v>0时t=d/v；m÷(m/s)=s',
      'd=vt; for uniform motion toward the target with v>0, t=d/v; m÷(m/s)=s',
    ],
    example: [
      '第一种：t=120 m÷2 m/s=60 s，代回2×60=120 m。第二种先把0.24 km换成240 m，240÷4=60 s。第三种d=0×t无法等于120 m，不把除零硬写成0。三个答案都要附模型条件。',
      'First: t=120 m÷2 m/s=60 s; substitution gives 2×60=120 m. Second: convert 0.24 km to 240 m, then 240÷4=60 s. Third: d=0×t cannot equal 120 m; do not force division by zero to produce zero. Retain model conditions with all conclusions.',
    ],
    misconception: [
      '看到两个数字就相乘，不是解题。即使单位像秒，若机器人向远离门的方向走，那个时间也不描述到门口。本工作台明确朝目标；现实中的启动、停留和障碍需要另建模型。',
      'Multiplying every pair of numbers is not problem solving. Even a result with time units would not describe reaching a door if the robot moved away from it. This workbench specifies motion toward the target; real starts, pauses and obstacles require a richer model.',
    ],
    realWorld: [
      '安排机器人送书、估计短段匀速行程或读一张路程图，都需要先问路段和运动条件。计划依据应该能被别人按同一张图和量重新检查。',
      'Planning a book-delivery robot, estimating a uniform segment, or reading a distance diagram requires route and motion conditions first. Another person should be able to check the plan using the same sketch and quantities.',
    ],
    summary: [
      '先说明正在解决什么，再计算；边界情况也可以是有效结论。',
      'Define the problem before calculating; a boundary case can yield a valid conclusion.',
    ],
    homeExperiment: [
      '在纸上画到门的单程线，为120 m和2 m/s分别标单位。写八步记录，最后代回路程；再把速率改成0，写清为什么没有有限时间。',
      'On paper, sketch the one-way door route and label 120 m and 2 m/s with units. Write eight steps and back-substitute distance. Then change speed to zero and explain the lack of a finite time.',
    ],
    vocabulary: [
      ['已知量', 'given quantity'],
      ['未知量', 'unknown quantity'],
      ['模型条件', 'model condition'],
      ['代回检查', 'back-substitution'],
    ],
    questions: [
      [
        '0.24 km换成m？',
        'Convert 0.24 km to metres.',
        [
          ['0.24 m', '0.24 m'],
          ['240 m', '240 m'],
          ['24 m', '24 m'],
        ],
        1,
        '每千米1000米，先统一距离单位。',
        'One kilometre is 1000 metres; unify distance units first.',
      ],
      [
        '120 m、2 m/s的到达时间？',
        'Arrival time for 120 m at 2 m/s?',
        [
          ['60 s', '60 s'],
          ['240 s', '240 s'],
          ['0.0167 s', '0.0167 s'],
        ],
        0,
        'd/v求时间，且方向必须朝目标。',
        'd/v gives time with motion toward the target.',
      ],
      [
        '计算后最有用的检查？',
        'Most useful check after calculating?',
        [
          ['数字看起来顺眼', 'The number looks pleasing'],
          [
            '把v×t代回d，并检查条件',
            'Substitute v×t into d and check conditions',
          ],
        ],
        1,
        '结果要还原原模型，而不是只像标准答案。',
        'The result should reconstruct the model, not merely resemble a familiar answer.',
      ],
    ],
    exit: [
      '匀速背离门口，算出的d/v能直接当到达时间吗？',
      'Moving uniformly away from the door, can d/v directly be called arrival time?',
      [
        [
          '不能，先修正方向与可达性条件',
          'No; revisit direction and reachability conditions',
        ],
        ['能，只要单位是秒', 'Yes, provided its unit is seconds'],
      ],
      0,
      '单位检查不能代替情境与模型检查。',
      'Unit checking cannot replace scenario and model checking.',
    ],
  }),
  make({
    id: 'solving-the-lamp-budget',
    kind: 'solving-energy',
    minutes: 24,
    title: [
      '阅读灯能亮多久？把能量和每秒速率分开。',
      'How long can the reading lamp run? Separate energy from its rate.',
    ],
    subtitle: [
      '把功率读成每秒能量，用八步检验预算。',
      'Read power as energy per second and test a budget through eight steps.',
    ],
    hook: [
      '一个模型电源可供灯接收1200 J电能，灯以2 W固定功率工作。朋友说“1200×2能亮2400秒”。先画能量流，再用每秒消耗量检查这句话。',
      'A model source can deliver 1200 J to a lamp running at fixed power 2 W. A friend says “1200×2 gives 2400 seconds.” Sketch the energy flow, then check against energy used per second.',
    ],
    prediction: [
      '同样1200 J预算，功率从2 W变4 W，时间怎样变？',
      'At the same 1200 J budget, change power from 2 W to 4 W. What happens to duration?',
    ],
    predictions: [
      ['翻倍', 'It doubles'],
      ['减半', 'It halves'],
      ['不变', 'It stays unchanged'],
    ],
    explore: [
      '完成1200 J/2 W、1200 J/4 W、2400 J/2 W三份八步预算。数字输入先回答秒，之后检查分钟换算和Pt=E。图和记录都区分给定预算与功率，不杜撰额外电池参数。',
      'Complete eight-step budgets for 1200 J/2 W, 1200 J/4 W and 2400 J/2 W. Enter seconds first, then check minute conversion and Pt=E. Sketches and records distinguish energy budget from power without inventing battery parameters.',
    ],
    concept: [
      '功率是能量转移的速率。给定可供灯接收的电能E和固定接收功率P，用E=Pt建立能量账。未知量t不是电压、电流或能量。单位1 W=1 J/s，因此E/P留下秒。把已知、模型假设、计算和检查写成记录，比背一个孤立的t=E/P更容易迁移。',
      'Power is the rate of energy transfer. With usable delivered electrical energy E and fixed received power P, E=Pt is the energy account. Unknown t is not voltage, current or energy. Since 1 W=1 J/s, E/P leaves seconds. Recording givens, model assumptions, calculation and checks makes the reasoning transferable beyond memorizing t=E/P.',
    ],
    formula: [
      't=E/P；J÷(J/s)=s；分钟=秒÷60',
      't=E/P; J÷(J/s)=s; minutes=seconds÷60',
    ],
    example: [
      '1200÷2=600 s=10 min；1200÷4=300 s=5 min；2400÷2=1200 s=20 min。代回2 W×600 s=1200 J。功率翻倍、预算相同时，时间减半；预算翻倍、功率相同时，时间翻倍。',
      '1200÷2=600 s=10 min; 1200÷4=300 s=5 min; 2400÷2=1200 s=20 min. Back-substitution gives 2 W×600 s=1200 J. Doubling power at fixed budget halves time; doubling budget at fixed power doubles time.',
    ],
    misconception: [
      '600 s不能读成600 min；J与W不能交换。已给的是可供灯接收的能量，不应再随意扣一半损失。真实电源有电压变化和转换条件，本题没有给这些量，因此不把理想预算时间当真实电池承诺。',
      '600 s is not 600 min; J and W are not interchangeable. The given energy is already usable delivery to the lamp; do not arbitrarily deduct half again. Real sources have voltage changes and conversion conditions absent from this task, so the ideal budget is not a real-battery promise.',
    ],
    realWorld: [
      '给设备做时间预算，要分清可用能量与消耗速率。能否支持预测，取决于数据定义和条件，而不只是公式中能放进几个数字。',
      'Device duration budgets require distinguishing usable energy from its use rate. Whether the prediction is supported depends on data definitions and conditions, not merely whether numbers fit an equation.',
    ],
    summary: [
      '能量是预算，功率是每秒使用速率；时间答案带着预算定义与模型条件。',
      'Energy is the budget; power is its use rate. Duration retains the budget definition and model conditions.',
    ],
    homeExperiment: [
      '把1200 J画成12个100 J方格。2 W每50 s用一格，4 W每25 s用一格。用纸上格子检查10 min与5 min，不接电源或拆设备。',
      'Draw 1200 J as twelve 100 J squares. At 2 W, one square lasts 50 s; at 4 W, 25 s. Check 10 and 5 minutes on paper without connecting a supply or dismantling a device.',
    ],
    vocabulary: [
      ['能量预算', 'energy budget'],
      ['固定功率', 'constant power'],
      ['单位推导', 'unit derivation'],
      ['比例检查', 'proportional check'],
    ],
    questions: [
      [
        '1200 J、2 W预算能维持多久？',
        'How long for a 1200 J budget at 2 W?',
        [
          ['600 min', '600 min'],
          ['2400 s', '2400 s'],
          ['600 s', '600 s'],
        ],
        2,
        '先E/P得到秒，再除60得到10 min。',
        'E/P gives seconds first; divide by 60 to obtain 10 min.',
      ],
      [
        '哪条单位推导支持时间？',
        'Which unit derivation supports time?',
        [
          ['J÷(J/s)=s', 'J÷(J/s)=s'],
          ['J×W=s', 'J×W=s'],
          ['W÷J=s', 'W÷J=s'],
        ],
        0,
        '瓦是焦耳每秒。',
        'A watt is a joule per second.',
      ],
      [
        '未给电池损耗，能任意扣50%吗？',
        'Without a stated battery loss, can you arbitrarily deduct 50%?',
        [
          ['能，所有电池都这样', 'Yes; every battery behaves that way'],
          [
            '不能，先遵守给定的可用能量定义',
            'No; follow the given usable-energy definition',
          ],
        ],
        1,
        '模型条件需要证据，不能杜撰。',
        'Model conditions need evidence and should not be invented.',
      ],
    ],
    exit: [
      '保持功率，能量预算翻倍，理想时间？',
      'At fixed power, double the energy budget. Ideal duration?',
      [
        ['翻倍，并代回Pt=E检查', 'Doubles; check by substituting into Pt=E'],
        ['减半，因为能量更多', 'Halves because energy is greater'],
      ],
      0,
      't=E/P中P固定，t与E成正比。',
      'With fixed P in t=E/P, duration is proportional to energy.',
    ],
  }),
  make({
    id: 'solving-a-spring-with-a-reason',
    kind: 'solving-spring',
    minutes: 25,
    title: [
      '弹簧多长了？先分清重量、伸长和总长。',
      'How much longer is the spring? Separate weight, extension and total length.',
    ],
    subtitle: [
      '一张力图、两条关系和一次长度换算。',
      'One force diagram, two relations and a length conversion.',
    ],
    hook: [
      '原长20 cm的弹簧挂着1 kg物体，静止不动。有人把“1 kg”当1 N，也有人把原长20 cm当伸长。先画作用力，再让两个关系共同回答。',
      'A spring of rest length 20 cm holds a stationary 1 kg object. One answer treats 1 kg as 1 N; another treats 20 cm as extension. Draw the forces first and let two relations work together.',
    ],
    prediction: [
      '把同一质量移到月球模型，g变小，为什么伸长变小？',
      'Move the same mass to a Moon model with smaller g. Why is extension smaller?',
    ],
    predictions: [
      ['重量变小，质量不变', 'Weight decreases while mass stays unchanged'],
      ['质量消失了一部分', 'Some mass disappears'],
      ['静止时弹簧不再有力', 'The spring has no force when stationary'],
    ],
    explore: [
      '完成1 kg地球、2 kg地球、1 kg月球模型三份八步记录。固定k=100 N/m、原长20 cm；先由静止条件得到kx=mg，再求x。计算先得m，输入以cm作答，最后检查总长与平衡关系。',
      'Complete eight-step records for 1 kg Earth, 2 kg Earth and 1 kg Moon models. Keep k=100 N/m and rest length 20 cm. Static equilibrium gives kx=mg, then x. Calculate in metres, enter centimetres, and check total length and balance.',
    ],
    concept: [
      '一个问题有时需要连接两条规律：重力大小mg与线性弹簧力kx。静止给出两力方向相反且大小相同，所以kx=mg。未知x定义为超过原长的长度，不是物体的质量，也不是弹簧总长。根据题目指定的当地g计算，量纲N/(N/m)=m再换cm。反查x能否还原重力、总长是否大于原长。',
      'Some problems connect two laws: weight mg and linear spring force kx. At rest, their directions oppose and magnitudes match, giving kx=mg. Define unknown x as extra length beyond rest length, not mass or total length. Use stated local g; N/(N/m)=m, then convert to cm. Check whether x restores weight and total length exceeds rest length.',
    ],
    formula: [
      'kx=mg；x=mg/k；L=L₀+x；1 m=100 cm',
      'kx=mg; x=mg/k; L=L₀+x; 1 m=100 cm',
    ],
    example: [
      '1 kg地球模型取g=10 N/kg：mg=10 N，x=10/100=0.1 m=10 cm，总长30 cm。2 kg时x=20 cm、总长40 cm。月球g=1.6 N/kg，同一1 kg物体x=0.016 m=1.6 cm、总长21.6 cm。',
      'For the 1 kg Earth model with g=10 N/kg: weight 10 N, x=10/100=0.1 m=10 cm, total length 30 cm. At 2 kg, extension 20 cm and total length 40 cm. With lunar g=1.6 N/kg, the same 1 kg object extends 0.016 m=1.6 cm, giving total length 21.6 cm.',
    ],
    misconception: [
      '平衡不是“没有力”；两个非零力可以抵消。质量kg和重量N不同；月球质量不变。k的单位N/m不能直接与cm代入，不换单位就会使比例错100倍。线性弹簧模型只在给定范围内使用。',
      'Equilibrium is not absence of forces; two nonzero forces can cancel. Mass in kg differs from weight in N, and lunar mass stays unchanged. Stiffness in N/m cannot use an unconverted centimetre extension; that causes a factor-100 error. Use the linear spring model only within its stated range.',
    ],
    realWorld: [
      '弹簧秤、悬挂结构和校准装置都要区别原长、变化量和最终读数。先定义变化量，再把结构条件与材料关系连接，是能迁移到新问题的解题工具。',
      'Spring scales, hanging structures and calibration devices distinguish rest length, change and final reading. Defining the change and connecting structural conditions with a material relation transfers to new problems.',
    ],
    summary: [
      '未知量定义要精确；力平衡、弹簧关系和单位换算必须互相一致。',
      'Define the unknown precisely; force balance, spring relation and unit conversion must agree.',
    ],
    homeExperiment: [
      '在纸上画向上弹簧力、向下重量和原长20 cm的虚线。为10、20、1.6 cm伸长分别写总长；用k×x反查，x先用m。无需悬挂重物。',
      'On paper, draw upward spring force, downward weight and a dashed 20 cm rest length. Add extensions 10,20 and 1.6 cm and label total lengths. Check k×x with x in metres; no heavy objects need to be suspended.',
    ],
    vocabulary: [
      ['静止平衡', 'static equilibrium'],
      ['劲度系数', 'spring stiffness'],
      ['额外伸长', 'extra extension'],
      ['总长', 'total length'],
    ],
    questions: [
      [
        '原长20 cm，额外伸长10 cm，总长？',
        'Rest length 20 cm and extension 10 cm. Total length?',
        [
          ['10 cm', '10 cm'],
          ['30 cm', '30 cm'],
          ['20 cm', '20 cm'],
        ],
        1,
        '总长=原长+额外伸长。',
        'Total length is rest length plus extension.',
      ],
      [
        '1 kg地球模型g=10 N/kg，重量？',
        '1 kg Earth model at g=10 N/kg. Weight?',
        [
          ['10 N', '10 N'],
          ['1 N', '1 N'],
          ['10 kg', '10 kg'],
        ],
        0,
        '质量乘当地g得到重量，单位N。',
        'Mass times local g gives weight in newtons.',
      ],
      [
        'x=0.016 m换成cm？',
        'Convert x=0.016 m to centimetres.',
        [
          ['0.016 cm', '0.016 cm'],
          ['1.6 cm', '1.6 cm'],
          ['16 cm', '16 cm'],
        ],
        1,
        '乘100；再与原长相加。',
        'Multiply by 100, then add the rest length separately.',
      ],
    ],
    exit: [
      '题目问“伸长”，求出弹簧总长后能直接交答案吗？',
      'If the question asks for extension, can you submit total spring length directly?',
      [
        [
          '不能，按定义减去原长并检查单位',
          'No; subtract rest length by definition and check units',
        ],
        ['能，只要都是长度', 'Yes; both are lengths'],
      ],
      0,
      '同量纲不代表同一个量，未知定义决定答案。',
      'Matching dimensions do not make quantities identical; the unknown’s definition determines the answer.',
    ],
  }),
  make({
    id: 'solving-a-number-with-evidence',
    kind: 'solving-density',
    minutes: 26,
    title: [
      '密度算得出，为什么答案仍可能不成立？',
      'A density number is calculable. Why can the conclusion still fail?',
    ],
    subtitle: [
      '让操作记录进入八步，而不只检查算术。',
      'Include procedure evidence in eight steps, not just arithmetic.',
    ],
    hook: [
      '54 g小块完全浸没，水位从50升至70 mL，得到2.7 g/cm³。同一小块只浸一部分，水位升至62 mL，却得到4.5。它换了材料，还是体积读数的含义变了？',
      'A 54 g piece fully immersed raises water from 50 to 70 mL, giving 2.7 g/cm³. The same piece only partly immersed raises it to 62 mL, giving 4.5. Did its material change, or did the volume reading’s meaning change?',
    ],
    prediction: [
      '部分浸入的4.5 g/cm³算术与单位都正确，能确认是整块密度吗？',
      'The partial-immersion value 4.5 g/cm³ has correct arithmetic and units. Is it validated whole-piece density?',
    ],
    predictions: [
      ['能，单位正确就够了', 'Yes; correct units suffice'],
      ['能，数字越大越可信', 'Yes; a larger number is more credible'],
      [
        '不能，排水量不是完整体积',
        'No; displaced volume is not the whole volume',
      ],
    ],
    explore: [
      '用八步处理小块完全浸没、大块完全浸没、同一小块部分浸入三种记录。保留原始50→70、50→90、50→62 mL。第三种也算出表观比值，但最终判断必须区分“算得出”与“实验有效”。',
      'Apply eight steps to a fully immersed small piece, fully immersed large piece, and the same small piece partly immersed. Retain original 50→70, 50→90 and 50→62 mL readings. Calculate an apparent ratio for the third but distinguish calculability from experimental validity in the final judgement.',
    ],
    concept: [
      '解题的已知量不只是数字：完全浸没、无气泡、不溶解和不吸水也是体积模型成立的条件。有效情况下，物体体积等于后水位减前水位，再用ρ=m/V。部分浸入时，水位差只是浸入部分的排水体积，不能配整个物体的质量确认密度。第八步检查条件，能抓到量纲检查抓不到的错误。',
      'Givens include more than numbers: full immersion, no bubbles, no dissolution and no absorption support the volume model. In valid cases, solid volume is final minus initial level, then ρ=m/V. Partial immersion displaces only the submerged part, which cannot validate whole-solid density using total mass. Step eight checks conditions and catches errors that dimensions cannot detect.',
    ],
    formula: [
      '有效条件下V=V后−V前；ρ=m/V；1 mL=1 cm³',
      'Under valid conditions V=V_after−V_before; ρ=m/V; 1 mL=1 cm³',
    ],
    example: [
      '小块V=70−50=20 cm³，ρ=54/20=2.7 g/cm³。大块V=90−50=40 cm³，ρ=108/40=2.7。部分浸入表观比值54/(62−50)=4.5 g/cm³；保留这个数和操作记录，说明为何不能作为有效密度、需要重新完全浸没测量。',
      'Small piece: V=70−50=20 cm³, ρ=54/20=2.7 g/cm³. Large piece: V=90−50=40 cm³, ρ=108/40=2.7. Partial immersion gives apparent ratio 54/(62−50)=4.5 g/cm³. Retain that number and procedure notes, explain its invalidity as whole-solid density, and repeat with full immersion.',
    ],
    misconception: [
      '正确单位并不证明实验有效。不能用末水位直接代体积，也不能删掉不喜欢的结果或凭一个密度值唯一识别材料。先说明数值由什么读数、操作和模型得到。',
      'Correct units do not prove experimental validity. Do not use final level alone as volume, delete disliked results, or uniquely identify material from one density value. Explain which readings, procedure and model produced the number.',
    ],
    realWorld: [
      '检查实验记录、维修测量或比较材料时，要连同操作方法理解数字。保留不理想结果并解释条件不足，常比交一串漂亮数字更有科学价值。',
      'When checking experimental records, maintenance measurements or materials, interpret numbers with their procedure. Keeping imperfect results and explaining inadequate conditions can be more useful scientifically than presenting tidy numbers.',
    ],
    summary: [
      '计算正确、单位正确、模型有效，是三个需要分别检查的问题。',
      'Correct calculation, correct units and valid modelling require separate checks.',
    ],
    homeExperiment: [
      '在纸上重画三个量筒情境，保留质量和原始水位。给前两份记录写“有效条件下的密度”，第三份写“表观比值，需重测”，再列出改善操作的方法。',
      'Redraw all three cylinder scenarios on paper with masses and original levels. Label the first two “density under valid conditions”, and the third “apparent ratio; remeasurement needed”. List procedural improvements.',
    ],
    vocabulary: [
      ['操作证据', 'procedure evidence'],
      ['排水体积', 'displaced volume'],
      ['表观比值', 'apparent ratio'],
      ['有效性', 'validity'],
    ],
    questions: [
      [
        '50→70 mL，完全浸没体积？',
        '50→70 mL under full immersion. Solid volume?',
        [
          ['70 cm³', '70 cm³'],
          ['50 cm³', '50 cm³'],
          ['20 cm³', '20 cm³'],
        ],
        2,
        '后读数减前读数，mL与cm³等量。',
        'Subtract initial from final level; mL and cm³ represent equal volumes.',
      ],
      [
        '108 g、40 cm³的密度？',
        'Density for 108 g and 40 cm³?',
        [
          ['2.7 g/cm³', '2.7 g/cm³'],
          ['4320 g/cm³', '4320 g/cm³'],
          ['0.3704 g/cm³', '0.3704 g/cm³'],
        ],
        0,
        '质量除以完整体积。',
        'Divide mass by the whole volume.',
      ],
      [
        '部分浸入后算出4.5，应怎样记录？',
        'After partial immersion yields 4.5, how should it be recorded?',
        [
          ['删掉，假装没有读过', 'Delete it and pretend it was never read'],
          [
            '保留表观比值及操作，说明需要重测',
            'Retain apparent ratio and procedure, explaining remeasurement',
          ],
        ],
        1,
        '错误条件的记录也是改进证据。',
        'Records of inadequate conditions help justify improvement.',
      ],
    ],
    exit: [
      '答案有正确g/cm³单位，就能跳过最后的合理性检查吗？',
      'With correct g/cm³ units, can you skip the final validity check?',
      [
        [
          '不能，还要核对完整体积和操作条件',
          'No; verify whole volume and procedure conditions',
        ],
        ['能，单位就是有效性证明', 'Yes; units prove validity'],
      ],
      0,
      '量纲不能判定是否完全浸没、是否有气泡。',
      'Dimensions do not establish full immersion or absence of bubbles.',
    ],
  }),
];
