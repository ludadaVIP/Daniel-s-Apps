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
  stage: 5,
  unit: 'mechanicalEnergy',
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
export const mechanicalEnergyLessons: Lesson[] = [
  make({
    id: 'energy-angle-luggage-handle',
    kind: 'mechanical-energy-angle',
    minutes: 20,
    title: [
      '拉杆越竖，箱子就走得越快吗？',
      'Does a more upright handle move the case faster?',
    ],
    subtitle: [
      '把拉力投影到位移方向，再算它做的功。',
      'Project the pull onto displacement before calculating its work.',
    ],
    hook: [
      '机场里你把箱子的拉杆提高了，手仍用同样大的力。箱子更容易前进了吗？先画水平位移，再看拉力有多少沿着它。今天的光滑箱子帮我们把角度这一件事单独看清。',
      'At the airport you raise the handle while pulling just as hard. Does the case gain more speed? Draw its horizontal displacement and find the pull component along it. Our smooth-track case isolates the effect of angle.',
    ],
    prediction: [
      '同样4 N力，箱子水平移动；哪个夹角使拉力的功为0？',
      'The same 4 N force acts while the case moves horizontally. Which angle gives zero pull work?',
    ],
    predictions: [
      ['0°', '0°'],
      ['60°', '60°'],
      ['90°', '90°'],
    ],
    explore: [
      '比较0°、60°、90°的完整1 s运动。先比水平分力，再读W净与ΔK；位移也会随加速度变化，不能假设三次走同样远。自由夹角试180°，观察仍向右的箱子怎样减速。',
      'Observe the full 1 s motion at 0°, 60° and 90°. Compare horizontal force, then Wnet and ΔK. Acceleration changes displacement too; do not assume equal distances. Try 180° freely and watch the rightward-moving case slow down.',
    ],
    concept: [
      '恒力的功W=Fs cosθ，θ是力与位移之间的夹角，不是随便一条线的角度。水平位移时W=Fx·Δx；竖直分力没有竖直位移，做功0。功是标量，可正、负或0。合力的功等于所有力的功之和；本模型光滑，重力、支持力做功0，所以拉力的功就是合力的功。',
      'For a constant force, W=Fs cosθ; θ is between force and displacement. With horizontal displacement, W=Fx·Δx. The vertical component has no vertical displacement and does zero work. Work is scalar and may be positive, negative or zero. Net work sums the work of all forces. Here gravity and support do zero work, so pull work equals net work.',
    ],
    formula: ['W=Fs cosθ=FxΔx+FyΔy；W净=ΔK', 'W=Fs cosθ=FxΔx+FyΔy; Wnet=ΔK'],
    example: [
      '2 kg箱子初速2 m/s。0°时Fx=4 N，1 s走3 m，W=12 J，K由4变16 J。60°时Fx=2 N，走2.5 m，W=5 J。90°时Fx=0，走2 m却W=0，K仍4 J。180°时走1 m，W=−4 J，恰好停止。',
      'A 2 kg case starts at 2 m/s. At 0°, Fx=4 N and it travels 3 m in 1 s: W=12 J, raising K from 4 to 16 J. At 60°, Fx=2 N, distance 2.5 m and W=5 J. At 90°, it travels 2 m but W=0 and K stays 4 J. At 180°, it travels 1 m and W=−4 J, just stopping.',
    ],
    misconception: [
      '“有力、又有位移，就一定做正功。”垂直为0，反向为负；也不能对变化的力直接套一个固定F乘总位移。现实拉杆角度还改变支持力与滚动阻力，本课把这些因素省略以检验投影。',
      '“Force plus displacement always means positive work.” Perpendicular gives zero; opposite gives negative. A varying force also requires more than one fixed F times total displacement. Real handle angles affect support and rolling resistance; these are omitted here to test projection.',
    ],
    realWorld: [
      '水平匀速端着托盘，手的竖直支持力对托盘做功为0；你的身体仍消耗能量。分析功时先说“哪个力对哪个物体”，不把身体的能量消耗和托盘的机械功混在一起。',
      'While carrying a tray steadily and horizontally, the upward support force does zero work on the tray, although your body uses energy. State which force acts on which object before calculating work.',
    ],
    summary: [
      '沿位移的力分量决定功；用ΔK检查合力的功。',
      'The force component along displacement determines work; check net work against ΔK.',
    ],
    homeExperiment: [
      '拿空盒画拉力与位移箭头：向前推、水平端着、原地托住。给指定力的功标正、0或负，并写明物体。不需要拖重物。',
      'Sketch force and displacement for an empty box: push forward, carry level, hold still. Label the work of the specified force positive, zero or negative and name the object.',
    ],
    vocabulary: [
      ['功', 'Work'],
      ['力的投影', 'Force projection'],
      ['正功与负功', 'Positive and negative work'],
      ['合力的功', 'Net work'],
    ],
    questions: [
      [
        '4 N力与2 m位移夹60°，该力做功？',
        'A 4 N force makes 60° with a 2 m displacement. Its work?',
        [
          ['8 J', '8 J'],
          ['4 J', '4 J'],
          ['0 J', '0 J'],
        ],
        1,
        'cos60°=1/2，所以4×2×1/2=4 J。',
        'cos60°=1/2, so 4×2×1/2=4 J.',
      ],
      [
        '一个向左的力作用在向右移动的物体上，功的符号？',
        'A leftward force acts on an object moving right. Sign of work?',
        [
          ['负', 'Negative'],
          ['正', 'Positive'],
          ['总是0', 'Always zero'],
        ],
        0,
        '力的沿位移分量为负。',
        'The force component along displacement is negative.',
      ],
      [
        '箱子水平走2 m，竖直支持力对它做功？',
        'The case moves 2 m horizontally. Work by vertical support?',
        [
          ['等于支持力乘2', 'Support force times 2'],
          ['由质量决定', 'Determined by mass'],
          ['0，力与位移垂直', 'Zero; force is perpendicular to displacement'],
        ],
        2,
        'Δy=0，支持力没有沿位移分量。',
        'Δy=0 and support has no component along displacement.',
      ],
    ],
    exit: [
      '拉杆提到竖直，箱子仍滑行，为何拉力没有增加动能？',
      'The handle is vertical while the case keeps sliding. Why does the pull not increase K?',
      [
        [
          '拉力与位移垂直，W拉=0；光滑模型W净=0',
          'Pull is perpendicular to displacement; Wpull=0 and smooth-model Wnet=0',
        ],
        ['滑行不需要任何能量', 'Sliding involves no energy'],
        ['竖直力总是不存在', 'Vertical force never exists'],
      ],
      0,
      '运动不等于每个力都在做功。',
      'Motion does not mean every force does work.',
    ],
  }),
  make({
    id: 'energy-braking-speed-squared',
    kind: 'mechanical-energy-braking',
    minutes: 22,
    title: [
      '快一倍，刹车只多一倍距离吗？',
      'Twice the speed: only twice the braking distance?',
    ],
    subtitle: [
      '把速度平方变成一段能量必须转移的距离。',
      'Turn speed squared into the distance needed to transfer energy.',
    ],
    hook: [
      '想象两块同样重的滑块滑向一段制动轨道，一块快一倍。用相同反向力停住它们，地上的停止标记会在哪里？这次先不算时间，用功把开始和结束连起来。',
      'Imagine identical sliders entering a braking track, one twice as fast. Where will equal opposing forces stop them? Connect start and finish through work before calculating time.',
    ],
    prediction: [
      '同质量、同制动力，初速由2变4 m/s，制动距离？',
      'Same mass and braking force: initial speed rises from 2 to 4 m/s. Braking distance?',
    ],
    predictions: [
      ['两倍', 'Doubles'],
      ['不变', 'Unchanged'],
      ['四倍', 'Quadruples'],
    ],
    explore: [
      '比较2 m/s·4 N、4 m/s·4 N、4 m/s·8 N。盯住初始K、负功面积和停止距离。把检查进度停在一半，验证此时K仍非零；自由初速试1与5 m/s。',
      'Compare 2 m/s·4 N, 4 m/s·4 N and 4 m/s·8 N. Watch initial K, negative work area and stopping distance. Inspect halfway: K is still nonzero. Try free speeds of 1 and 5 m/s.',
    ],
    concept: [
      '动能K=½mv²，是标量，不随速度正负而变号。功—能定理W净=K后−K前；它比较同一参考系中的动能，不要求合力恒定。这里只用恒定反向净力，W净=−fs；停止K后=0，因此s=mv₀²/(2f)。这说的是制动阶段，不含人看见障碍后的反应距离。',
      'Kinetic energy K=½mv² is scalar and does not change sign with velocity. The work–energy theorem Wnet=Kafter−Kbefore compares kinetic energies in the same frame and does not require constant force. Here a constant opposing net force gives Wnet=−fs. With final K=0, s=mv₀²/(2f). This is braking distance, excluding reaction distance.',
    ],
    formula: [
      'K=½mv²；W净=ΔK；停止距离s=mv₀²/(2f)',
      'K=½mv²; Wnet=ΔK; stopping distance s=mv₀²/(2f)',
    ],
    example: [
      '2 kg、2 m/s有4 J动能，4 N制动力走1 m做−4 J功。速度翻倍到4 m/s，动能16 J，同力需要4 m。第三次制动力翻倍为8 N，16 J仍需全部转移，但距离缩为2 m。',
      'At 2 kg and 2 m/s, K=4 J; a 4 N braking force does −4 J over 1 m. Doubling speed to 4 m/s gives 16 J and requires 4 m at the same force. Doubling force to 8 N transfers the same 16 J over 2 m.',
    ],
    misconception: [
      '“负功就是负能量。”负号描述动能减少；当前K仍≥0。“力翻倍与速度翻倍互相抵消”也不对：距离正比v²、反比f。真实骑行还有坡度、轮胎与路面，不能用这组滑块数值预测道路停车。',
      '“Negative work means negative energy.” The sign describes decreasing K; current K remains nonnegative. Doubling force does not cancel doubling speed: distance scales with v² and inversely with force. Slopes, tyres and surfaces make actual road stopping more complex.',
    ],
    realWorld: [
      '骑车靠近转角前先降低速度，进入制动阶段的动能会显著减少。用能量解释“先慢下来”比只记一条规则更有用；本课数值只属于理想滑块。',
      'Reducing speed before a bicycle turn greatly reduces the kinetic energy entering braking. Energy explains why slowing early matters; these numbers apply only to the ideal slider.',
    ],
    summary: [
      '停止需要转移全部初始动能；速度的平方决定这笔能量。',
      'Stopping transfers all initial kinetic energy; speed squared determines that amount.',
    ],
    homeExperiment: [
      '纸上画速度1、2、3倍的三辆假想同质量小车，给它们画1、4、9格动能。制动力相同时，画对应距离，不做真实快速刹车实验。',
      'Draw imaginary equal-mass carts at speeds 1, 2 and 3 times a reference. Give them 1, 4 and 9 energy squares, then matching braking distances at equal force.',
    ],
    vocabulary: [
      ['动能', 'Kinetic energy'],
      ['功—能定理', 'Work–energy theorem'],
      ['制动距离', 'Braking distance'],
      ['反向净力', 'Opposing net force'],
    ],
    questions: [
      [
        '2 kg、4 m/s的动能？',
        'K for 2 kg at 4 m/s?',
        [
          ['16 J', '16 J'],
          ['8 J', '8 J'],
          ['4 J', '4 J'],
        ],
        0,
        '½×2×4²=16。',
        '½×2×4²=16.',
      ],
      [
        '初始K=16 J，合力已做−6 J功，当前K？',
        'Initial K=16 J; net work is −6 J. Current K?',
        [
          ['−6 J', '−6 J'],
          ['22 J', '22 J'],
          ['10 J', '10 J'],
        ],
        2,
        'K=16−6=10 J。',
        'K=16−6=10 J.',
      ],
      [
        '初速相同，恒定制动力翻倍，停止距离？',
        'Same initial speed; constant braking force doubles. Distance?',
        [
          ['四倍', 'Quadruples'],
          ['减半', 'Halves'],
          ['不变', 'Unchanged'],
        ],
        1,
        '待转移动能相同，每米转移能量翻倍。',
        'Same energy to transfer, twice the transfer per metre.',
      ],
    ],
    exit: [
      '为什么初速翻倍、制动力翻倍后，停止距离仍是原来的两倍？',
      'Why does doubling both speed and force still double stopping distance?',
      [
        [
          '动能变四倍，每米负功变两倍，距离变两倍',
          'K quadruples; negative work per metre doubles; distance doubles',
        ],
        ['动量一定守恒', 'Momentum must be conserved'],
        ['负功不能改变动能', 'Negative work cannot change K'],
      ],
      0,
      's正比v²/f。',
      's scales with v²/f.',
    ],
  }),
  make({
    id: 'energy-summit-path-zero',
    kind: 'mechanical-energy-height',
    minutes: 21,
    title: [
      '走斜坡更省力，也更省功吗？',
      'Does a gentler path save work as well as force?',
    ],
    subtitle: [
      '同一山顶，换路线与势能零点，哪些量会变？',
      'Same summit: what changes with path and potential-energy zero?',
    ],
    hook: [
      '把一箱书搬到同一层楼，直接提升还是走长斜坡？再把“高度0”改写在楼上，书的重力势能可以从负值开始吗？我们用同一箱书做两种改变，看看物理会不会跟着数字标签变。',
      'Lift a box of books directly or take a long ramp to the same floor. Then label the upper floor height zero: can gravitational potential energy start negative? Separate physical changes from changing the numerical reference.',
    ],
    prediction: [
      '光滑、匀速，斜坡长为上升高度的2倍；拉力的总功与竖直提升相比？',
      'Smooth steady lift: ramp length is twice its rise. Pull work compared with vertical lifting?',
    ],
    predictions: [
      ['减半', 'Half'],
      ['相同', 'Equal'],
      ['两倍', 'Double'],
    ],
    explore: [
      '完整比较竖直/地面零、斜坡/地面零、斜坡/山顶零。前两次比力与距离；后两次比U初、U和ΔU。注意三次动能都恒定，但匀速不同不意味着动能相同。',
      'Observe vertical/ground zero, ramp/ground zero and ramp/summit zero. Compare force and distance in the first pair; compare initial U, U and ΔU in the second. Each K is constant, but different steady speeds need not give equal K.',
    ],
    concept: [
      '近地面匀强重力场中U=mg(h−h零)，势能属于物体与地球的相互作用。重力的功W重=−ΔU，只由高度改变决定；光滑匀速提升时，拉力做+mgΔh，重力做−mgΔh，合力功0，所以ΔK=0。斜坡以更多距离交换更小拉力，不减少理想提升的总功。',
      'Near Earth in uniform gravity, U=mg(h−hzero), associated with the object–Earth interaction. Gravity work Wgravity=−ΔU depends only on height change. In a smooth steady lift, pull does +mgΔh and gravity does −mgΔh; net work and ΔK are zero. A ramp trades greater distance for smaller force without reducing ideal lifting work.',
    ],
    formula: [
      'U=mg(h−h零)；W重=−ΔU；匀速时W拉+W重=0',
      'U=mg(h−hzero); Wgravity=−ΔU; steady motion: Wpull+Wgravity=0',
    ],
    example: [
      '2 kg上升1 m，g=10。竖直20 N×1 m=20 J；斜坡10 N×2 m=20 J。地面为零，U由0到20 J；山顶为零，U由−20到0 J。两次ΔU都+20 J，重力的功都−20 J。',
      'A 2 kg load rises 1 m with g=10. Vertical: 20 N×1 m=20 J. Ramp: 10 N×2 m=20 J. Ground zero gives U from 0 to 20 J; summit zero gives −20 to 0 J. Both ΔU are +20 J and gravity work is −20 J.',
    ],
    misconception: [
      '“U为负，物体就没有能量或无法上升。”零点是选定的参考，真正比较的是变化。“合力功0就没有任何力做功”也错：拉力与重力的功相互抵消，势能仍增加。',
      '“Negative U means no energy or inability to rise.” The zero is a chosen reference; compare changes. Zero net work does not mean each force does zero work: pull and gravity work cancel while potential energy increases.',
    ],
    realWorld: [
      '无障碍坡道让推车更省力；实际摩擦可能让总输入功增加。设计时同时问：力够不够小、路够不够长、能量损失有多少，不能只凭坡度判断效率。',
      'Access ramps reduce the force needed for a cart. Real friction can increase total input work. Consider force, path length and energy losses together.',
    ],
    summary: [
      '重力势能的绝对值依赖零点；高度差决定ΔU与重力的功。',
      'The zero level changes absolute U; height difference determines ΔU and gravity work.',
    ],
    homeExperiment: [
      '画桌面与地面两个势能零点，给同一本书标U。用箭头标“从地面到桌面”的ΔU，解释为何两个零点算出相同变化。',
      'Draw desk-zero and floor-zero energy scales for one book. Mark ΔU for moving from floor to desk and explain why both give the same change.',
    ],
    vocabulary: [
      ['重力势能', 'Gravitational potential energy'],
      ['参考零点', 'Reference zero'],
      ['路径无关', 'Path independence'],
      ['势能改变', 'Potential-energy change'],
    ],
    questions: [
      [
        '2 kg上升1 m，重力的功？g=10。',
        '2 kg rises 1 m. Gravity work, g=10?',
        [
          ['+20 J', '+20 J'],
          ['0 J', '0 J'],
          ['−20 J', '−20 J'],
        ],
        2,
        '重力向下，位移向上。',
        'Gravity points down while displacement is upward.',
      ],
      [
        '把零点上移1 m，势能变化ΔU会怎样？',
        'Move the zero level up 1 m. What happens to ΔU?',
        [
          ['不变', 'Unchanged'],
          ['减20 J', 'Falls by 20 J'],
          ['总变成0', 'Always becomes zero'],
        ],
        0,
        '初末U同减mg×1 m，差值不变。',
        'Initial and final U shift equally; their difference stays the same.',
      ],
      [
        '光滑匀速提升，ΔK=0，ΔU可否增加？',
        'Smooth steady lifting: ΔK=0. Can ΔU increase?',
        [
          ['不能，能量都为0', 'No; all energy is zero'],
          ['可以，拉力与重力的功抵消', 'Yes; pull and gravity work cancel'],
          ['只能减少', 'It can only decrease'],
        ],
        1,
        '净功决定ΔK，不是单独某个力的功。',
        'Net work determines ΔK, not the work of one force alone.',
      ],
    ],
    exit: [
      '长光滑坡道为何省力却不省理想提升功？',
      'Why does a long smooth ramp save force but not ideal lifting work?',
      [
        [
          '距离增大补偿拉力减小，同一高度ΔU相同',
          'Greater distance compensates smaller force; the same rise gives the same ΔU',
        ],
        ['坡道使g变小', 'The ramp reduces g'],
        ['势能与高度无关', 'Potential energy ignores height'],
      ],
      0,
      '拉力×沿坡距离仍为mgΔh。',
      'Pull force times ramp distance remains mgΔh.',
    ],
  }),
  make({
    id: 'energy-spring-changing-force',
    kind: 'mechanical-energy-spring',
    minutes: 23,
    title: [
      '弹簧压两倍，藏进两倍能量吗？',
      'Twice the compression: twice the stored energy?',
    ],
    subtitle: [
      '从力—位移图的三角形，追踪弹簧把能量交给小车。',
      'Follow the force–displacement triangle as a spring transfers energy to a cart.',
    ],
    hook: [
      '玩具车靠压缩弹簧发车。你越压越费力：最后那一点力不能代表整个压缩过程。放手后，弹簧的力又会逐渐变小。让图下面积告诉我们，究竟存了多少、交出了多少。',
      'A toy cart launches from a compressed spring. Each extra compression takes more force, so the final force cannot represent the whole loading process. After release the force decreases. Use the area under the curve to track energy stored and delivered.',
    ],
    prediction: [
      '同一理想弹簧，压缩量由0.5变1 m，初始弹性势能？',
      'Same ideal spring: compression rises from 0.5 to 1 m. Initial elastic energy?',
    ],
    predictions: [
      ['两倍', 'Double'],
      ['四倍', 'Quadruple'],
      ['不变', 'Unchanged'],
    ],
    explore: [
      '比较20 N/m·0.5 m、20 N/m·1 m、40 N/m·1 m。看初始力、三角形总面积与到原长时的K。检查一半时间：位移不必一半，力也不恒定；图横轴是位移。',
      'Compare 20 N/m·0.5 m, 20 N/m·1 m and 40 N/m·1 m. Watch initial force, triangular total area and K at natural length. Half the time need not mean half the displacement; force varies and the plot axis is displacement.',
    ],
    concept: [
      '理想弹簧在胡克定律范围内，力大小k|x|，弹性势能U=½kx²。从0缓慢压到c，力—压缩量图是三角形，面积½×c×kc。释放时以朝原长为正，走了s后F=k(c−s)；金色面积W弹=½kc²−½k(c−s)²=ΔK。光滑水平面上弹簧与小车的U+K不变。',
      'Within Hooke’s-law limits, spring force magnitude is k|x| and elastic energy is U=½kx². Slow compression from 0 to c traces a triangle of area ½×c×kc. During release, take motion toward natural length as positive. After distance s, F=k(c−s); the gold area Wspring=½kc²−½k(c−s)² equals ΔK. On a smooth horizontal surface, spring plus cart keeps U+K constant.',
    ],
    formula: [
      'U弹=½kx²；W弹=U初−U；K+U弹=常量',
      'Uelastic=½kx²; Wspring=Uinitial−U; K+Uelastic=constant',
    ],
    example: [
      'k=20 N/m，压0.5 m存2.5 J；压1 m存10 J，四倍。k=40、压1 m存20 J。1 kg小车到原长时对应速率√5、√20、√40 m/s；原长时弹簧力0，但速度最大，不是停止。',
      'With k=20 N/m, compression 0.5 m stores 2.5 J; 1 m stores 10 J, four times as much. With k=40 and 1 m, storage is 20 J. A 1 kg cart reaches natural length at speeds √5, √20 and √40 m/s. Spring force is zero there but speed is maximal, not zero.',
    ],
    misconception: [
      '“用最大力kc乘压缩量c就是能量。”力不是一直这么大，真实三角形面积是其一半。“恢复原长便没有运动”也错：车已获得动能，连着弹簧会继续运动，本课只展示第一次到原长。',
      '“Maximum force kc times compression c gives the energy.” Force is not constant at its maximum; triangular area is half that rectangle. Natural length does not end motion: the cart has acquired K and, while attached, continues moving. We show only its first natural-length crossing.',
    ],
    realWorld: [
      '弹簧玩具、缓冲器与机械储能都把形变和运动联系起来。真实弹簧有质量、阻尼与弹性限度；拉得更远不能无限套用½kx²。',
      'Spring toys, buffers and mechanical energy storage connect deformation and motion. Real springs have mass, damping and elastic limits; ½kx² does not apply indefinitely.',
    ],
    summary: [
      '变化的力要读面积；弹簧储能随形变量平方增长。',
      'Read area for a varying force; spring energy scales with deformation squared.',
    ],
    homeExperiment: [
      '画k=20 N/m弹簧的力—压缩量直线，标0.5与1 m；剪两张对应三角形，用面积说明四倍关系。用纸完成，不拆弹簧玩具。',
      'Draw a k=20 N/m force–compression line and mark 0.5 and 1 m. Cut out the two triangles and explain their fourfold area ratio on paper.',
    ],
    vocabulary: [
      ['弹性势能', 'Elastic potential energy'],
      ['劲度系数', 'Spring stiffness'],
      ['胡克定律', 'Hooke’s law'],
      ['变力做功', 'Work by a varying force'],
    ],
    questions: [
      [
        'k=20 N/m、x=1 m，U？',
        'k=20 N/m, x=1 m. U?',
        [
          ['20 J', '20 J'],
          ['40 J', '40 J'],
          ['10 J', '10 J'],
        ],
        2,
        '½×20×1²=10 J。',
        '½×20×1²=10 J.',
      ],
      [
        '弹簧总能10 J，当前U=4 J，光滑释放时K？',
        'Spring–cart total 10 J, current U=4 J. K on a smooth track?',
        [
          ['6 J', '6 J'],
          ['14 J', '14 J'],
          ['4 J', '4 J'],
        ],
        0,
        'K+U=10，所以K=6。',
        'K+U=10, so K=6.',
      ],
      [
        '到原长时F=0，小车为什么仍在动？',
        'At natural length F=0. Why is the cart moving?',
        [
          ['合力0必速度0', 'Zero net force requires zero velocity'],
          [
            '势能已转为动能，力0不表示速度0',
            'U has become K; zero force does not mean zero velocity',
          ],
          ['小车仍储存推动力', 'The cart stores pushing force'],
        ],
        1,
        '此时加速度0，速度可非零。',
        'Acceleration is zero then; velocity can be nonzero.',
      ],
    ],
    exit: [
      '为什么用初始最大力乘释放距离，会把弹簧做功算成两倍？',
      'Why does initial maximum force times release distance overestimate spring work by a factor of two?',
      [
        [
          '力从最大值降到0，真实面积是三角形而非矩形',
          'Force falls from maximum to zero; actual area is a triangle, not a rectangle',
        ],
        ['能量不守恒', 'Energy is not conserved'],
        ['位移没有方向', 'Displacement has no direction'],
      ],
      0,
      'W=½kc²，不能套恒力矩形。',
      'W=½kc², not the constant-force rectangle.',
    ],
  }),
  make({
    id: 'energy-downhill-complete-ledger',
    kind: 'mechanical-energy-conservation',
    minutes: 23,
    title: [
      '滑到底更慢，能量去了哪里？',
      'Slower at the bottom: where did the energy go?',
    ],
    subtitle: [
      '给系统画边界，把机械能减少和总能量守恒放在一起。',
      'Choose a system boundary and reconcile mechanical-energy loss with total conservation.',
    ],
    hook: [
      '同一滑块从同一个坡顶放手，粗糙轨道让它到坡底更慢。是重力少给了能量，还是能量换了去处？今天把滑块、地球和轨道圈成一个系统，为少掉的动能找一笔对应的账。',
      'Release the same slider from the same summit. A rough track makes its bottom speed lower. Did gravity provide less energy, or did energy go elsewhere? Circle slider, Earth and track as one system and find the matching entry.',
    ],
    prediction: [
      '同一高度释放，轨道阻力更大；含地球与轨道的模型系统总能量？',
      'Same release height, greater track resistance. Total model energy including Earth and track?',
    ],
    predictions: [
      ['减少', 'Decreases'],
      ['增加', 'Increases'],
      ['不变，只改变分配', 'Unchanged; distribution changes'],
    ],
    explore: [
      '完整比较阻力0、2、4 N。读坡底U、K、Q；再停在同一检查百分比，看滑块走相同路程却花不同时间。自由阻力8 N时，它仍能到坡底，但更慢、热能更多。',
      'Observe resistance 0, 2 and 4 N. Read bottom U, K and Q. At the same inspection percentage the slider covers the same distance but takes different physical time. At free resistance 8 N it still reaches the bottom, slower and with more thermal energy.',
    ],
    concept: [
      '机械能E机=K+U；只有本模型的保守力做功时，它守恒。阻力把机械能转成滑块与轨道的内能增加Q，所以K+U会下降，而扩大的封闭系统K+U+Q仍等于初始40 J。功—能定理也一直成立：W重+W阻=ΔK。能量守恒不等于动能守恒，也不等于机械能在每个过程都守恒。',
      'Mechanical energy is K+U and is conserved here when only conservative forces do work. Resistance converts mechanical energy to increased internal energy Q in slider and track. K+U decreases, but the enlarged closed system retains K+U+Q=40 J. The work–energy theorem still holds: Wgravity+Wresistance=ΔK. Conservation of energy does not require constant K or constant mechanical energy in every process.',
    ],
    formula: [
      'K+U+Q=40 J；Q=fs；W重+W阻=ΔK',
      'K+U+Q=40 J; Q=fs; Wgravity+Wresistance=ΔK',
    ],
    example: [
      '2 kg从高2 m、长4 m坡顶释放，初始U=40 J。坡底U=0；阻力0时K=40、Q=0；2 N时Q=8、K=32；4 N时Q=16、K=24 J。三次重力均做40 J功，差别是阻力做0、−8、−16 J功。',
      'A 2 kg slider starts 2 m high on a 4 m ramp with U=40 J. At the bottom U=0. Resistance 0 gives K=40,Q=0; 2 N gives Q=8,K=32; 4 N gives Q=16,K=24 J. Gravity does 40 J in all three; resistance does 0, −8 and −16 J.',
    ],
    misconception: [
      '“摩擦让能量消失。”少的是这部分机械能，热能账增加。“把Q加进滑块的动能就好”也不对：先选含轨道的系统，Q才包含所有耗散；若热又传到外界，还需要记跨边界传递。',
      '“Friction destroys energy.” Mechanical energy decreases while thermal energy increases. Do not simply add all Q to the slider: choose a system including the track to count the dissipation. If heat leaves that boundary, record the transfer too.',
    ],
    realWorld: [
      '游乐场滑梯、运输斜槽与自行车下坡都在换能量形式。是否需要阻力取决于目标：想更快，想限制速度，还是想控制热量；效率不是忽略能量去向的口号。',
      'Slides, delivery chutes and downhill bicycles change energy forms. Resistance may be useful for speed control, even while it reduces mechanical energy. Decide what the task needs and track where energy goes.',
    ],
    summary: [
      '先圈系统，再分K、U、Q；机械能可以下降，总能量账仍平。',
      'Choose the system, separate K, U and Q; mechanical energy may fall while the total ledger balances.',
    ],
    homeExperiment: [
      '用40个纸上能量格，分别给坡底K与Q分配40/0、32/8、24/16。解释每米2 N阻力为什么多出2 J热能，不需要实际发热。',
      'Draw 40 energy squares and divide them into bottom K/Q as 40/0, 32/8 and 24/16. Explain why a 2 N resistance produces 2 J of thermal energy per metre.',
    ],
    vocabulary: [
      ['机械能', 'Mechanical energy'],
      ['保守力', 'Conservative force'],
      ['系统边界', 'System boundary'],
      ['耗散', 'Dissipation'],
    ],
    questions: [
      [
        '初始40 J，坡底热能16 J，动能？',
        'Initial 40 J; bottom thermal energy 16 J. K?',
        [
          ['24 J', '24 J'],
          ['40 J', '40 J'],
          ['56 J', '56 J'],
        ],
        0,
        '坡底U=0，K+Q=40。',
        'Bottom U=0, so K+Q=40.',
      ],
      [
        '有阻力，哪个账在本系统仍守恒？',
        'With resistance, which ledger remains conserved here?',
        [
          ['K单独', 'K alone'],
          ['K+U单独', 'K+U alone'],
          ['K+U+Q', 'K+U+Q'],
        ],
        2,
        'Q计入滑块与轨道增加的内能。',
        'Q counts increased internal energy of slider and track.',
      ],
      [
        '阻力4 N走4 m，阻力功与热能增加？',
        'Resistance 4 N over 4 m: resistance work and thermal gain?',
        [
          ['+16、−16 J', '+16, −16 J'],
          ['−16、+16 J', '−16, +16 J'],
          ['都是0', 'Both zero'],
        ],
        1,
        '负功与正的热能增加描述不同账项。',
        'Negative work and positive thermal gain are different entries.',
      ],
    ],
    exit: [
      '粗糙坡底动能减少，为何仍可说能量守恒？',
      'Why is energy conserved even when bottom K decreases on a rough ramp?',
      [
        [
          '把地球与轨道纳入系统，减少的机械能对应热能增加',
          'Include Earth and track; lost mechanical energy matches thermal gain',
        ],
        ['负功不算功', 'Negative work does not count'],
        ['重力因此变小', 'Gravity becomes smaller'],
      ],
      0,
      '同一初始U，去向改变，总额不变。',
      'Same initial U, changed destinations, unchanged total.',
    ],
  }),
  make({
    id: 'energy-power-efficiency-delivery',
    kind: 'mechanical-energy-power',
    minutes: 22,
    title: [
      '更快的搬运机，一定更省电吗？',
      'Does a faster lifting machine necessarily use less energy?',
    ],
    subtitle: [
      '同一提升任务，分别比较输入功、功率与效率。',
      'Compare input work, power and efficiency for one lifting task.',
    ],
    hook: [
      '两台机器把同一箱货送到同一高度，一台只用一半时间。再给快机器加一点轨道阻力：它仍快，但能量账变了吗？用这三次搬运给“速度快”和“损失少”各找一个准确的指标。',
      'Two machines move the same load to the same height; one takes half the time. Add track resistance to the fast machine. It is still fast, but does its energy ledger change? Give speed of transfer and low loss separate measures.',
    ],
    prediction: [
      '光滑同一任务，搬运时间减半，输入功与功率？',
      'Same smooth task, half the time. Input work and power?',
    ],
    predictions: [
      ['功减半，功率不变', 'Work halves, power unchanged'],
      ['功不变，功率翻倍', 'Work unchanged, power doubles'],
      ['功翻倍，功率减半', 'Work doubles, power halves'],
    ],
    explore: [
      '比较光滑4 s、光滑2 s、2 N阻力2 s。完成后读输入功、有用ΔU、输入功率与效率。自由时间改变时，检查哪些数值随之变化；不要把尚未搬完时的累计功当整个任务的功。',
      'Compare smooth 4 s, smooth 2 s and 2 N resistance over 2 s. At completion read input work, useful ΔU, input power and efficiency. Change free task time and see which values change. Work accumulated during a partial task is not its full-task work.',
    ],
    concept: [
      '平均功率P=W/Δt，描述能量转移有多快；瞬时功率P=F·v。本课力与速度恒定，两者相同。任务效率η=有用输出能量/输入能量，不是有用功率除时间。光滑提升理想效率100%；有阻力时输入功=mgΔh+fL，而有用提升仍mgΔh。这里只比较机械搬运，未建模电机、电源或人体代谢。',
      'Average power P=W/Δt measures energy-transfer rate; instantaneous power is P=F·v. Constant force and velocity make them equal here. Task efficiency η=useful output energy/input energy. A smooth ideal lift has 100% efficiency; with resistance, input work is mgΔh+fL while useful lifting remains mgΔh. This models mechanical transport, not motors, supplies or metabolism.',
    ],
    formula: [
      'P平均=W/Δt；P瞬时=F·v；η=E有用/E输入',
      'Paverage=W/Δt; Pinstantaneous=F·v; η=Euseful/Einput',
    ],
    example: [
      '2 kg上升1 m需要有用20 J。光滑4 s输入20 J、5 W；光滑2 s仍20 J、10 W，两次η=100%。2 N阻力走2 m多耗4 J，输入24 J、12 W，有用功率10 W，η=20/24≈83.3%。',
      'Raising 2 kg by 1 m gives 20 J useful energy. Smooth 4 s: 20 J input, 5 W. Smooth 2 s: still 20 J, 10 W; both η=100%. A 2 N resistance over 2 m dissipates 4 J: input 24 J at 12 W, useful power 10 W and η=20/24≈83.3%.',
    ],
    misconception: [
      '“功率大就必定能耗多或效率高。”还要看持续时间、任务与损失。相同20 J任务用更短时间，平均功率更大但输入能量不变。现实更快可能增加空气阻力或电机损失；本模型的固定阻力不包含那些变化。',
      '“Greater power always means more energy use or higher efficiency.” Duration, task and losses matter. The same 20 J task completed sooner has greater power but unchanged input energy. Real speed can change drag or motor losses; this fixed-resistance model omits those effects.',
    ],
    realWorld: [
      '选起重机看功率能否按时完成任务，算用电还要看输入能量与电机效率。手机充电器标W，电池容量常标Wh：前者是速率，后者是能量；1 Wh=3600 J。',
      'Crane power determines how quickly a task can be done; energy use also depends on input energy and motor efficiency. Chargers use W, batteries often use Wh: rate versus energy. One Wh is 3600 J.',
    ],
    summary: [
      '功回答多少能量，功率回答多快，效率回答有多少成为目标输出。',
      'Work tells how much energy, power how quickly, efficiency how much becomes the intended output.',
    ],
    homeExperiment: [
      '给一台假想搬运机列任务账：有用20 J、损失5 J、时间5 s。算输入功、输入功率与效率，再只把时间改为2.5 s，标出不变的量。',
      'List an imaginary lift: useful 20 J, loss 5 J, time 5 s. Calculate input work, input power and efficiency. Change only time to 2.5 s and mark unchanged quantities.',
    ],
    vocabulary: [
      ['平均功率', 'Average power'],
      ['瞬时功率', 'Instantaneous power'],
      ['有用输出', 'Useful output'],
      ['效率', 'Efficiency'],
    ],
    questions: [
      [
        '20 J在2 s内转移，平均功率？',
        '20 J transferred in 2 s. Mean power?',
        [
          ['40 W', '40 W'],
          ['10 W', '10 W'],
          ['20 W', '20 W'],
        ],
        1,
        'P=20/2=10 W。',
        'P=20/2=10 W.',
      ],
      [
        '输入25 J、有用20 J，效率？',
        'Input 25 J, useful 20 J. Efficiency?',
        [
          ['80%', '80%'],
          ['125%', '125%'],
          ['5%', '5%'],
        ],
        0,
        'η=20/25=0.8。',
        'η=20/25=0.8.',
      ],
      [
        '恒力12 N沿运动方向，速度1 m/s，瞬时功率？',
        'Constant 12 N along motion at 1 m/s. Instantaneous power?',
        [
          ['1/12 W', '1/12 W'],
          ['13 W', '13 W'],
          ['12 W', '12 W'],
        ],
        2,
        'P=Fv=12 W。',
        'P=Fv=12 W.',
      ],
    ],
    exit: [
      '光滑20 J搬运从4 s缩到2 s，为何不是“省了一半能量”？',
      'Why does shortening a smooth 20 J lift from 4 s to 2 s not save half the energy?',
      [
        [
          '同一提升仍需20 J，只是功率从5变10 W',
          'The same lift still needs 20 J; power changes from 5 to 10 W',
        ],
        ['时间不影响功率', 'Time never affects power'],
        ['效率必定超过100%', 'Efficiency must exceed 100%'],
      ],
      0,
      '任务能量与转移速率要分别比较。',
      'Compare task energy separately from transfer rate.',
    ],
  }),
];
