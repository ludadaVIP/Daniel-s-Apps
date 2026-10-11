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
  unit: 'momentum',
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
export const momentumLessons: Lesson[] = [
  make({
    id: 'momentum-same-speed-different-ledger',
    kind: 'momentum-quantity',
    minutes: 20,
    title: [
      '空购物车和满购物车：同速就一样吗？',
      'Empty and full shopping carts: does equal speed mean equal momentum?',
    ],
    subtitle: [
      '给运动记一笔带方向的质量×速度账。',
      'Keep a directional mass × velocity ledger for motion.',
    ],
    hook: [
      '你推着空购物车走，再放入几瓶水，保持同样的速度。停车所需的动量改变还是同一笔吗？今天先不比谁“更危险”，只把质量、速度和方向拆开，找出不同。',
      'Push an empty cart, then load it while keeping the same speed. Is the momentum change needed to stop it the same? Separate mass, velocity and direction before making a comparison.',
    ],
    prediction: [
      '1 kg与2 kg小车都向右2 m/s，动量关系？',
      'A 1 kg and a 2 kg cart both move right at 2 m/s. Compare momentum.',
    ],
    predictions: [
      ['相同', 'Equal'],
      ['2 kg车是两倍', 'The 2 kg cart has twice as much'],
      ['只看速度，不能比较', 'Speed alone prevents comparison'],
    ],
    explore: [
      '完整比较1 kg向右、2 kg向右和1 kg向左。三次都保持速率2 m/s。盯住箭头的方向和长度，再把自由速度调到0，看看质量仍存在时动量是否为0。',
      'Observe 1 kg rightward, 2 kg rightward and 1 kg leftward, all at speed 2 m/s. Compare arrow direction and length. Set free velocity to zero: does a mass still have momentum while at rest?',
    ],
    concept: [
      '动量p=mv，质量是标量，速度带方向，所以动量也是向量。本课固定地面参考系，以向右为正；向左写负号。单位kg·m/s，与冲量单位N·s等价。动量不是力，也不是储存在车里的“推动力”。匀速车即使合力0，仍可有非零动量。',
      'Momentum is p=mv. Mass is scalar and velocity has direction, so momentum is a vector. Use the ground frame and rightward positive; leftward values are negative. Units kg·m/s equal N·s. Momentum is not force or a stored pushing force. A coasting cart can have nonzero momentum with zero net force.',
    ],
    formula: [
      'p=mv；Δp=p后−p前；同一参考系中相加',
      'p=mv; Δp=pafter−pbefore; add values in the same reference frame',
    ],
    example: [
      '三次动量为+2、+4、−2 kg·m/s。最后一辆与第一辆大小相同、方向相反。若把2 kg车从+2 m/s停到0，Δp=0−4=−4；不是“动量改变4，没有方向”。',
      'The three momenta are +2, +4 and −2 kg·m/s. First and third have equal magnitudes and opposite directions. Stopping the 2 kg cart from +2 m/s gives Δp=0−4=−4, retaining direction.',
    ],
    misconception: [
      '“更重就一定动量更大。”静止大车动量为0；轻车速度足够大也能有更大的动量。也不能把动量p与动能K混为一谈：速度翻倍，p翻倍，而K变四倍。',
      '“Heavier always means more momentum.” A heavy cart at rest has zero momentum; a faster light cart may have more. Momentum and kinetic energy differ: doubling velocity doubles p but quadruples K.',
    ],
    realWorld: [
      '购物车、足球和自行车都能用质量与速度一起比较。说“相同动量”还要说清参考系与方向；仅凭动量不判断人体伤害或碰撞结果。',
      'Compare carts, balls and bicycles using both mass and velocity. State the frame and direction when claiming equal momentum; momentum alone does not determine injury or collision outcome.',
    ],
    summary: [
      '先定正方向，再算质量×速度；大小与方向都要保留。',
      'Choose a positive direction, multiply mass by velocity, and retain magnitude and direction.',
    ],
    homeExperiment: [
      '在纸上画三辆假想购物车：2 kg×1 m/s、1 kg×2 m/s、1 kg×−2 m/s。用同一箭头尺画p，解释哪两个动量相同，哪两个只是大小相同。不需要推重物。',
      'Sketch imaginary carts: 2 kg×1 m/s, 1 kg×2 m/s and 1 kg×−2 m/s. Draw p arrows on one scale; explain equal momentum versus equal magnitude. No heavy-object pushing is needed.',
    ],
    vocabulary: [
      ['动量', 'Momentum'],
      ['参考系', 'Reference frame'],
      ['带符号的速度', 'Signed velocity'],
      ['动量改变', 'Momentum change'],
    ],
    questions: [
      [
        '2 kg向左3 m/s，p？',
        '2 kg moves left at 3 m/s. p?',
        [
          ['−6 kg·m/s', '−6 kg·m/s'],
          ['+6 kg·m/s', '+6 kg·m/s'],
          ['−1.5 kg·m/s', '−1.5 kg·m/s'],
        ],
        0,
        '向右为正，v=−3。',
        'Rightward positive gives v=−3.',
      ],
      [
        '1 kg向右4与2 kg向右2，p？',
        '1 kg right at 4 and 2 kg right at 2: momenta?',
        [
          ['后者更大', 'The latter is larger'],
          ['相同，都是+4', 'Equal, both +4'],
          ['方向相反', 'Opposite directions'],
        ],
        1,
        '质量×速度相同，方向也相同。',
        'Equal products and the same direction.',
      ],
      [
        '匀速滑行，合力0，动量一定0？',
        'Coasting with zero net force: must momentum be zero?',
        [
          ['一定', 'Yes'],
          ['只能向左', 'Only leftward'],
          ['不一定，速度可非零', 'No; velocity can be nonzero'],
        ],
        2,
        '合力改变动量，不是维持动量的必需品。',
        'Net force changes momentum; it is not required to maintain it.',
      ],
    ],
    exit: [
      '同速满车停车时，为何需要更大动量改变？',
      'Why does stopping the fuller cart at the same velocity require a larger momentum change?',
      [
        [
          '质量更大，p前更大，停到0的差也更大',
          'Larger mass gives larger initial p and a larger change to zero',
        ],
        ['重车必然更快', 'Heavy carts must be faster'],
        ['动量就是重量', 'Momentum is weight'],
      ],
      0,
      '比较相同速度、相同停止终态。',
      'Compare the same velocity and the same final rest state.',
    ],
  }),
  make({
    id: 'momentum-boundary-before-conservation',
    kind: 'momentum-conservation',
    minutes: 20,
    title: [
      '两车黏住后，动量去哪了？',
      'Two carts stick together. Where did the momentum go?',
    ],
    subtitle: [
      '先圈系统，再检查外力冲量。',
      'Choose the system before checking external impulse.',
    ],
    hook: [
      '一辆小车追上另一辆，黏在一起变慢。第一辆失去的动量真的消失了吗？把第二辆也圈进来，你会看到同一场碰撞的另一份账。',
      'A cart catches another and they stick, moving more slowly. Did the first cart’s lost momentum vanish? Include the other cart in your boundary and read a second ledger for the same event.',
    ],
    prediction: [
      'A=2 kg以4 m/s撞静止B=2 kg并黏住，外合力0，最终共同速度？',
      'A=2 kg at 4 m/s sticks to resting B=2 kg, with zero external net force. Final common velocity?',
    ],
    predictions: [
      ['4 m/s', '4 m/s'],
      ['2 m/s', '2 m/s'],
      ['0 m/s', '0 m/s'],
    ],
    explore: [
      '先比较等质量，再把B改成4 kg，最后给等质量系统持续+2 N外合力。分别观察A、B与总动量；对照Σp−Σp初是否等于J外。',
      'Compare equal masses, a 4 kg B, then equal masses with continuous +2 N external net force. Track A, B and their total separately; compare total change with external impulse.',
    ],
    concept: [
      '对A单独看，B的接触力是外力；对A+B看，这对等大反向接触力是内力，总账中抵消。总动量变化由外合力冲量决定，J外=0时总动量守恒。不能仅凭“发生碰撞”就套守恒：地面对车、手推车等都可能跨越边界。',
      'For A alone, B’s contact force is external. For A+B, equal opposite contact forces are internal and cancel in the total ledger. Total momentum change equals external impulse; zero external impulse conserves the total. A collision alone is not enough: ground forces or a hand can cross the boundary.',
    ],
    formula: [
      'Σp后−Σp前=J外；J外=0 ⇒ Σp不变',
      'Σpafter−Σpbefore=Jexternal; Jexternal=0 ⇒ constant total momentum',
    ],
    example: [
      '初始总p=2×4=8。等质量黏住，v=8/4=2；B=4 kg时v=8/6≈1.33。等质量受+2 N外力3 s，J外=6，总p终=14，共同v=3.5。内部作用仍抵消，外力改变了总账。',
      'Initial total p=8. Equal masses stick at 8/4=2; with B=4 kg they move at 8/6≈1.33. A +2 N external force for 3 s adds 6 N·s, giving total p=14 and common v=3.5. Internal forces still cancel while external force changes the total.',
    ],
    misconception: [
      '“守恒意味着每辆车的动量都不变。”个体会交换动量。另一个误会是先把所有力删掉：只有内部力在总账中相互抵消，外力仍要记。',
      '“Conservation means each cart’s momentum stays unchanged.” Individuals exchange momentum. Do not erase all forces: only internal pairs cancel from the total; external contributions still count.',
    ],
    realWorld: [
      '台球、冰上碰撞与推车能用系统边界分析。短碰撞可在外力冲量足够小时近似守恒；近似的理由是外冲量小，不是外力永远不存在。',
      'Use system boundaries for pool balls, ice collisions and carts. A short collision can approximately conserve momentum when external impulse is small; the justification is small impulse, not a claim that external forces never exist.',
    ],
    summary: [
      '守恒先问“谁在圈里”，再问“外冲量是否为0”。',
      'Ask who is inside the boundary, then whether external impulse is zero.',
    ],
    homeExperiment: [
      '画A、B和外部手三者的示意图，分别给A及A+B画圈。把同一接触力在两个系统中标为外力/内力，再解释手为什么始终在圈外。不做人体碰撞。',
      'Sketch A, B and an external hand. Draw boundaries for A and A+B; classify the same contact force in each. Explain why the hand remains outside. Do not perform body collisions.',
    ],
    vocabulary: [
      ['系统边界', 'System boundary'],
      ['内力', 'Internal force'],
      ['外冲量', 'External impulse'],
      ['总动量守恒', 'Total momentum conservation'],
    ],
    questions: [
      [
        'B=4 kg、A初始p=8，黏住速度？',
        'B=4 kg, A starts with p=8. Common velocity?',
        [
          ['4', '4'],
          ['2', '2'],
          ['4/3 m/s', '4/3 m/s'],
        ],
        2,
        '总质量6 kg。',
        'Total mass is 6 kg.',
      ],
      [
        '对A+B，A与B的接触力？',
        'For A+B, their contact forces are?',
        [
          ['内力，成对抵消', 'Internal, cancelling as a pair'],
          ['两股外力向右', 'Two rightward external forces'],
          ['没有存在过', 'They never existed'],
        ],
        0,
        '力存在，只是在总动量变化中抵消。',
        'They exist but cancel in total momentum change.',
      ],
      [
        '外合力+2 N持续3 s，总动量改变？',
        'External net force +2 N for 3 s: total momentum change?',
        [
          ['0', '0'],
          ['+6 kg·m/s', '+6 kg·m/s'],
          ['+2/3 kg·m/s', '+2/3 kg·m/s'],
        ],
        1,
        '外冲量FΔt=+6。',
        'External impulse is FΔt=+6.',
      ],
    ],
    exit: [
      '朋友说所有碰撞都可直接用两物体动量守恒。先补什么？',
      'A friend uses two-object momentum conservation for every collision. What must be added first?',
      [
        ['系统边界与外冲量检查', 'System boundary and external-impulse check'],
        ['更大的箭头', 'Larger arrows'],
        ['只看更重的物体', 'Consider only the heavier object'],
      ],
      0,
      '守恒有条件，必须明确比较对象和区间。',
      'Conservation has conditions; name the system and interval.',
    ],
  }),
  make({
    id: 'momentum-bounce-stick-energy',
    kind: 'momentum-collisions',
    minutes: 20,
    title: [
      '弹开和黏住：动量守恒，动能也守恒吗？',
      'Bounce or stick: does conserved momentum also mean conserved kinetic energy?',
    ],
    subtitle: [
      '相同初态，比较三种碰撞终态。',
      'Compare three collision outcomes from the same initial state.',
    ],
    hook: [
      '磁性玩具车黏住，弹性碰撞车弹开。两种都可能保持总动量，结果却很不同。我们把初始质量和速度锁住，只改变回弹程度，让两份账说出区别。',
      'Magnetic toy carts stick while elastic carts bounce. Both can conserve total momentum and still end differently. Lock masses and initial velocities, then vary rebound and compare two ledgers.',
    ],
    prediction: [
      '外冲量0，碰撞后黏住，总动量守恒是否保证动能守恒？',
      'With zero external impulse, carts stick. Does conserved total momentum guarantee conserved kinetic energy?',
    ],
    predictions: [
      ['保证', 'Yes'],
      ['只要同质量就保证', 'Yes for equal masses'],
      ['不保证', 'No'],
    ],
    explore: [
      '完整比较e=1、0.5、0。在接触前和接触后比较p总与K，别用接触中暂存形变能的时刻替代终态。自由改变e，观察终速度与能量账。',
      'Observe e=1, 0.5 and 0. Compare total p and K before and after contact; energy temporarily stored in deformation during contact is not the final ledger. Adjust e and watch final velocities and energy.',
    ],
    concept: [
      '弹性碰撞的总动能在前后相同；非弹性碰撞的一部分动能进入形变、内能和声音等。完全非弹性是黏住、共同运动。动量是带方向的和，动能是½mv²的和，两条规则独立。e=1表示完全回弹，0<e<1部分回弹，e=0共同速度；本课只取0≤e≤1的被动一维模型。',
      'An elastic collision preserves total kinetic energy between before and after. Inelastic collisions transfer some kinetic energy into deformation, internal energy and sound. A perfectly inelastic collision sticks with common velocity. Momentum is a directional sum; kinetic energy sums ½mv². These are separate constraints. Our passive 1D model uses e=1 for elastic, partial rebound for 0<e<1 and common velocity for e=0.',
    ],
    formula: [
      'Σmu=Σmv；K=Σ½mv²；e=(vB−vA)/(uA−uB)',
      'Σmu=Σmv; K=Σ½mv²; e=(vB−vA)/(uA−uB)',
    ],
    example: [
      '初态2 kg×4与2 kg×0，总p=8、K=16 J。弹性终速度0与4，K=16；e=0.5终速度1与3，K=10；黏住各2，K=8。三次总p都是8，但动能分别少0、6、8 J。',
      'Initially 2 kg at 4 and 2 kg at 0 give total p=8 and K=16 J. Elastic final velocities 0 and 4 give K=16; e=0.5 gives 1 and 3, K=10; sticking gives 2 and 2, K=8. All totals p=8, but kinetic energy decreases by 0, 6 and 8 J.',
    ],
    misconception: [
      '“损失的动能就是能量消失。”总能量仍要记，只是机械动能进入其他形式。接触中的K也不等于最后K；弹性接触中可先降低，再恢复。',
      '“Lost kinetic energy means energy vanished.” Total energy still needs accounting; kinetic energy changes into other forms. During contact K can differ from final K; an elastic contact may reduce it temporarily and restore it.',
    ],
    realWorld: [
      '台球常用近似弹性模型；黏土黏住是非弹性直觉。真实材料的回弹还受速度、温度、形状等影响，本课e不是某种材料永远固定的标签。',
      'Pool balls are often approximated as elastic; sticking clay suggests inelastic behaviour. Real rebound depends on speed, temperature and geometry; e here is not a permanent material label.',
    ],
    summary: [
      '总动量相同，不代表总动能相同；把碰撞前后两份账一起看。',
      'Equal total momentum does not imply equal kinetic energy; compare both ledgers before and after.',
    ],
    homeExperiment: [
      '用纸面计算完成三种终态的p与K表，再用自己的话说明少掉的动能可能在哪。可观察一个软球低高度落到软垫的回弹，保持观察而不据此算两物体总动量。',
      'Calculate p and K for all three final states and explain where reduced kinetic energy may go. You may observe a soft ball dropped a short distance onto a cushion; that alone does not measure the two-object total momentum.',
    ],
    vocabulary: [
      ['弹性碰撞', 'Elastic collision'],
      ['非弹性碰撞', 'Inelastic collision'],
      ['回弹系数', 'Coefficient of restitution'],
      ['动能账', 'Kinetic-energy ledger'],
    ],
    questions: [
      [
        '黏住后各2 m/s，总K？',
        'Each stuck cart moves at 2 m/s. Total K?',
        [
          ['16 J', '16 J'],
          ['8 J', '8 J'],
          ['0 J', '0 J'],
        ],
        1,
        '两项½×2×2²相加。',
        'Add two terms ½×2×2².',
      ],
      [
        'e=0.5，vA=1、vB=3，总p？',
        'e=0.5, vA=1 and vB=3. Total p?',
        [
          ['8 kg·m/s', '8 kg·m/s'],
          ['10 kg·m/s', '10 kg·m/s'],
          ['4 kg·m/s', '4 kg·m/s'],
        ],
        0,
        '2×1+2×3=8。',
        '2×1+2×3=8.',
      ],
      [
        '弹性碰撞的额外条件？',
        'The additional condition for elastic collision?',
        [
          ['每个速度不变', 'Each velocity stays unchanged'],
          ['黏在一起', 'They stick'],
          ['前后总动能相同', 'Same total kinetic energy before and after'],
        ],
        2,
        '总动量与总动能都要检查。',
        'Check both total momentum and total kinetic energy.',
      ],
    ],
    exit: [
      '黏住时K从16变8 J，怎样写结论？',
      'Sticking changes K from 16 to 8 J. What is the conclusion?',
      [
        [
          '8 J进入其他形式，总动量仍为8',
          '8 J enters other forms while total momentum remains 8',
        ],
        ['动量也减少一半', 'Momentum also halves'],
        ['8 J凭空消失', '8 J vanishes'],
      ],
      0,
      '动量和能量的账分别记录。',
      'Keep momentum and energy ledgers separately.',
    ],
  }),
  make({
    id: 'momentum-spring-separates-carts',
    kind: 'momentum-separation',
    minutes: 20,
    title: [
      '放开弹簧：静止的两车怎么都动了？',
      'Release a spring: how can two resting carts both move?',
    ],
    subtitle: [
      '用内部储能释放理解爆炸模型。',
      'Use stored internal energy to understand a separation model.',
    ],
    hook: [
      '两辆玩具车中间压着弹簧，松开后向两边走。原本总动量0，为什么还能出现运动？零总动量说的是两项相加，不是每项都必须为0。',
      'A compressed spring between toy carts sends them in opposite directions. If total momentum began at zero, how can motion appear? A zero sum does not require every term to be zero.',
    ],
    prediction: [
      '2 kg与4 kg车从静止被弹簧分开，外冲量0，哪辆速度大小更大？',
      'A 2 kg and a 4 kg cart separate from rest with zero external impulse. Which has greater speed?',
    ],
    predictions: [
      ['2 kg车', 'The 2 kg cart'],
      ['4 kg车', 'The 4 kg cart'],
      ['速度必然相同', 'Speeds must match'],
    ],
    explore: [
      '比较等质量静止、不等质量静止、等质量共同向右1 m/s。追踪等大反向内部冲量、总动量和增长的动能。自由调到冲量0，检验是否凭空产生分离。',
      'Compare equal masses at rest, unequal masses at rest, and equal masses initially moving together at 1 m/s. Track opposite internal impulses, total momentum and increasing kinetic energy. Set impulse to zero to test whether separation appears without a release.',
    ],
    concept: [
      '内部作用给A和B等大反向冲量，ΔpA=−J、ΔpB=+J，总和0。因此总动量不变。相同冲量下Δv=Δp/m，轻车速度改变更大。动能增加来自弹簧原有内部储能，不能因动量守恒就说能量也不变。本模型用规定的平滑脉冲，不模拟弹簧劲度和真实形变。',
      'Internal interaction delivers equal opposite impulses: ΔpA=−J and ΔpB=+J, summing to zero. Total momentum stays constant. Since Δv=Δp/m, the lighter cart changes velocity more. Increasing kinetic energy comes from stored spring energy. The prescribed smooth pulse does not model spring stiffness or actual deformation.',
    ],
    formula: [
      'ΔpA+ΔpB=0；vA=u−J/mA；vB=u+J/mB',
      'ΔpA+ΔpB=0; vA=u−J/mA; vB=u+J/mB',
    ],
    example: [
      'J=4 N·s，2 kg与4 kg从静止分离，vA=−2、vB=+1，总p=−4+4=0，K=4+2=6 J。等质量共同u=1时，终速度−1与+3，总p=4保持不变，K从2升到10 J。',
      'With J=4 N·s, 2 kg and 4 kg initially at rest reach vA=−2 and vB=+1. Total p=−4+4=0 and K=4+2=6 J. Equal masses starting at u=1 reach −1 and +3; total p remains 4 while K rises from 2 to 10 J.',
    ],
    misconception: [
      '“零总动量意味着不能动。”反向动量可相互抵消。“放开后总动量一定0。”只有初始总动量0、外冲量0才如此；共同前进时总动量可非零。',
      '“Zero total momentum prevents motion.” Opposite momenta can cancel. “After release the total must be zero.” That requires zero initial total and zero external impulse; a moving system can retain nonzero total.',
    ],
    realWorld: [
      '弹簧玩具、分离的航天器部件和爆炸碎片都能用同一个总账思路，但系统必须包括相关物体。这里用无爆炸物的弹簧情境，重点是内部交换与能量来源。',
      'Spring toys, separating spacecraft components and explosion fragments share the system-ledger idea, provided relevant objects are included. This spring setting uses no explosive materials and focuses on internal exchange and energy source.',
    ],
    summary: [
      '反向交换动量，总量不变；新动能需要一个旧能量来源。',
      'Exchange opposite momentum without changing its total; new kinetic energy needs an existing energy source.',
    ],
    homeExperiment: [
      '画两车箭头，让每辆的m×v分别是−4和+4，再把B质量画成两倍。解释为何B速度箭头变短但动量箭头不变。用纸面完成，不制作弹射器。',
      'Draw two carts with momenta −4 and +4, then double B’s mass. Explain why its velocity arrow shortens while its momentum arrow stays the same. Work on paper rather than building a launcher.',
    ],
    vocabulary: [
      ['内部储能', 'Stored internal energy'],
      ['分离', 'Separation'],
      ['反向冲量', 'Opposite impulses'],
      ['速度改变', 'Velocity change'],
    ],
    questions: [
      [
        '2 kg车获−4 N·s冲量，从静止到？',
        'A 2 kg cart receives −4 N·s from rest. Final velocity?',
        [
          ['−8 m/s', '−8 m/s'],
          ['−2 m/s', '−2 m/s'],
          ['+2 m/s', '+2 m/s'],
        ],
        1,
        'Δv=Δp/m。',
        'Δv=Δp/m.',
      ],
      [
        '两车分别p=−4和+4，总p？',
        'Two carts have p=−4 and +4. Total?',
        [
          ['8', '8'],
          ['−8', '−8'],
          ['0', '0'],
        ],
        2,
        '带方向的和，不是大小相加。',
        'Add signed values, not magnitudes.',
      ],
      [
        '新增动能来自？',
        'Where does the added kinetic energy come from?',
        [
          ['弹簧储能', 'Stored spring energy'],
          ['动量凭空产生', 'Momentum appears from nowhere'],
          ['质量变轻', 'Mass gets lighter'],
        ],
        0,
        '能量转化，而不是总能量制造。',
        'Energy is transferred, not created.',
      ],
    ],
    exit: [
      '两车共同前进再分离，为何总p不必0？',
      'Why need total p not be zero if moving carts then separate?',
      [
        [
          '它保留原本非零总动量，内部冲量相消',
          'It retains its initially nonzero total; internal impulses cancel',
        ],
        ['运动后守恒失效', 'Conservation fails in motion'],
        ['重力必然增加水平动量', 'Gravity must add horizontal momentum'],
      ],
      0,
      '比较同一参考系下的初态和终态。',
      'Compare initial and final states in one frame.',
    ],
  }),
  make({
    id: 'momentum-catch-force-time-area',
    kind: 'momentum-impulse',
    minutes: 20,
    title: [
      '接住同一个球，峰值力可以不同吗？',
      'Catch the same ball: can peak force differ?',
    ],
    subtitle: [
      '把力—时间图的面积读成动量改变。',
      'Read force–time area as momentum change.',
    ],
    hook: [
      '接球时手往后跟一点，停球过程被拉长。另一个问题更细：同样时间内，力一直一样和先增后减，会给出相同峰值吗？我们让同一个球的初末速度相同，只换力曲线。',
      'Following a ball with your hands can lengthen its stop. A finer question: over the same duration, do a constant force and a rise-and-fall force have the same peak? Fix the ball’s initial and final velocities and vary the force curve.',
    ],
    prediction: [
      '相同冲量和时长，三角形与矩形力曲线，哪个峰值更大？',
      'Same impulse and duration: triangular or rectangular force has the greater peak?',
    ],
    predictions: [
      ['矩形', 'Rectangle'],
      ['三角形', 'Triangle'],
      ['必然相同', 'They must match'],
    ],
    explore: [
      '比较0.2 s矩形、0.2 s三角形、0.8 s三角形。看已发生的着色面积、球的当前动量和力，完整结束后比较平均力与峰值。自由延长时长，检查停止距离也变了。',
      'Compare a 0.2 s rectangle, 0.2 s triangle and 0.8 s triangle. Watch elapsed shaded area, current momentum and force. After complete runs compare means and peaks. Extend duration and check stopping distance too.',
    ],
    concept: [
      '冲量J等于净力—时间图的带符号面积，也等于Δp。恒力可用FΔt；可变力须用面积，或平均净力F平均×Δt。三角形面积½×底×高：同面积同底宽，峰值是矩形的两倍。峰值与平均值不同，且停止时间越长，保持相同Δp所需平均力大小越小。',
      'Impulse equals the signed area under the net-force–time graph and equals Δp. Constant force gives FΔt; variable force needs area or mean net force × duration. Triangle area is half base × height: at equal area and base, its peak is twice the rectangle’s. Peak and mean differ; a longer stop with the same Δp needs a smaller mean-force magnitude.',
    ],
    formula: [
      'J=Δp=力—时间带符号面积=F平均Δt；三角形|J|=½F峰值Δt',
      'J=Δp=signed force–time area=FmeanΔt; triangle |J|=½FpeakΔt',
    ],
    example: [
      '0.5 kg球从+4停到0，Δp=−2 N·s。0.2 s矩形F=−10 N；相同时长三角形平均−10、峰值大小20 N；0.8 s三角形平均−2.5、峰值5 N。三次面积都是−2，停止距离分别0.4、0.4、1.6 m。',
      'A 0.5 kg ball stops from +4 to 0, so Δp=−2 N·s. The 0.2 s rectangle is −10 N; the same-duration triangle has mean −10 and peak magnitude 20. At 0.8 s the triangle has mean −2.5 and peak 5. All areas equal −2; stopping distances are 0.4, 0.4 and 1.6 m.',
    ],
    misconception: [
      '“冲量就是最大力×时间。”只有恒力才直接乘那个力。另一个误会是力越大就冲量越大：若时间更短，总面积也可能相同或更小。',
      '“Impulse is maximum force × time.” Only a constant force can be multiplied directly that way. A larger force does not always mean larger impulse; a shorter duration can give equal or smaller area.',
    ],
    realWorld: [
      '接球、球拍碰球和包装缓冲都关乎力作用的整个时间区间。这里曲线是可比较的教学处方，不能用模拟峰值代替真实测量或个人受力判断。',
      'Catching, racket contact and packaging concern the whole force interval. These curves are teaching prescriptions; simulated peaks do not replace measurements or personal-force assessments.',
    ],
    summary: [
      '同样Δp看面积；延长时长降平均力，改变形状会改变峰值。',
      'For the same Δp compare area; duration changes the mean, while shape changes the peak.',
    ],
    homeExperiment: [
      '在方格纸画面积都为2格的矩形和三角形，再把三角形底边拉成四倍。标出平均高度和最大高度，解释二者为何不同。可用软球慢速接球体验跟随动作，不尝试猛烈撞击。',
      'Draw a rectangle and triangle with equal two-square areas, then make the triangle four times as wide. Mark mean and peak heights and explain their difference. A slow soft-ball catch can illustrate following motion; avoid hard impacts.',
    ],
    vocabulary: [
      ['冲量', 'Impulse'],
      ['平均净力', 'Mean net force'],
      ['峰值', 'Peak'],
      ['带符号面积', 'Signed area'],
    ],
    questions: [
      [
        '球从p=+2停到0，J？',
        'A ball stops from p=+2 to 0. J?',
        [
          ['−2 N·s', '−2 N·s'],
          ['+2 N·s', '+2 N·s'],
          ['0 N·s', '0 N·s'],
        ],
        0,
        '终减初：0−2。',
        'Final minus initial: 0−2.',
      ],
      [
        '0.2 s三角形峰值20 N，面积大小？',
        'A 0.2 s triangle peaks at 20 N. Area magnitude?',
        [
          ['4', '4'],
          ['2 N·s', '2 N·s'],
          ['100', '100'],
        ],
        1,
        '½×0.2×20。',
        '½×0.2×20.',
      ],
      [
        '同冲量，停止时间四倍，平均力大小？',
        'Same impulse, four times the stopping duration. Mean-force magnitude?',
        [
          ['四倍', 'Four times'],
          ['不变', 'Unchanged'],
          ['四分之一', 'One quarter'],
        ],
        2,
        '|F平均|=|Δp|/Δt。',
        '|Fmean|=|Δp|/Δt.',
      ],
    ],
    exit: [
      '朋友用三角形峰值×时长算冲量，应怎样改？',
      'A friend multiplies a triangular peak by duration. How do you correct it?',
      [
        [
          '求三角形带符号面积，或用平均力乘时间',
          'Use signed triangular area or mean force × duration',
        ],
        ['删掉时间', 'Remove time'],
        ['把峰值当质量', 'Treat peak as mass'],
      ],
      0,
      '曲线形状决定峰值与面积的关系。',
      'Shape determines how peak relates to area.',
    ],
  }),
  make({
    id: 'momentum-restraints-time-space',
    kind: 'momentum-restraints',
    minutes: 20,
    title: [
      '安全带和气囊：多一点停止时间，还需要什么？',
      'Belts and airbags: what else does a longer stop require?',
    ],
    subtitle: [
      '同一动量改变，连接平均力、距离与接触面积。',
      'Connect mean force, distance and contact area for one momentum change.',
    ],
    hook: [
      '车停了，车里的人仍有继续前进的趋势。安全带提供约束，气囊作为配合装置参与缓冲。只说“停得慢些”还不完整：若要延长停止时间，运动还需要空间。我们用教学滑块把这件事画出来。',
      'When a car stops, an occupant tends to continue moving. A belt provides restraint and an airbag works with it in cushioning. “Stop more gradually” is incomplete: a longer stop also needs room for motion. A teaching slider makes that relationship visible.',
    ],
    prediction: [
      '同初速停到0，平均力更小、停止时间更长时，本模型停止距离？',
      'Same initial velocity and final rest, with a smaller mean force and longer duration. Stopping distance in this model?',
    ],
    predictions: [
      ['更短', 'Shorter'],
      ['必然不变', 'Must stay the same'],
      ['更长', 'Longer'],
    ],
    explore: [
      '1 kg教学滑块从4 m/s停到0，比较0.1、0.4、0.8 s。同时看冲量面积、平均力和终点。自由加长时间，解释为何不可能在零空间里无限延长停止过程。',
      'A 1 kg teaching slider stops from 4 m/s. Compare 0.1, 0.4 and 0.8 s, watching impulse area, mean force and final position together. Lengthen duration and explain why an unlimited stop cannot fit into zero space.',
    ],
    concept: [
      '三次Δp相同为−4，所以平均净力分别−40、−10、−5 N。恒减速下平均速度u/2，停止距离d=uΔt/2，分别0.2、0.8、1.6 m。真实约束的力随时间变化；受力分布面积也影响局部压强，平均压强可作F/A的初步估计，但平均力、峰值、压强与伤害不能画等号。',
      'All three Δp values equal −4, giving mean net forces −40, −10 and −5 N. Constant deceleration gives mean speed u/2 and stopping distance d=uΔt/2: 0.2, 0.8 and 1.6 m. Real restraints have varying forces; distributed contact area affects local pressure. F/A is an introductory mean-pressure estimate, not an equation equating mean force, peak force, pressure or injury.',
    ],
    formula: [
      'F平均=Δp/Δt；恒减速到0：d=uΔt/2；平均接触压强≈F/A',
      'Fmean=Δp/Δt; constant deceleration to rest: d=uΔt/2; mean contact pressure≈F/A',
    ],
    example: [
      '从0.1改0.4 s，时长四倍，平均力大小从40降10，停止距离从0.2增0.8 m；冲量仍−4。若另把同一接触力分在两倍面积，平均压强减半，这没有改变冲量。',
      'Changing 0.1 to 0.4 s quadruples duration, reduces mean-force magnitude from 40 to 10 and increases distance from 0.2 to 0.8 m; impulse stays −4. Spreading the same contact force over twice the area halves mean pressure without changing impulse.',
    ],
    misconception: [
      '“有气囊就不需要安全带。”二者角色配合；本课没有给出任何车辆使用替代方案。“时间越长一定无限好。”真实系统有可用距离和约束限制，本模型也能看见距离代价。',
      '“An airbag removes the need for a belt.” They have complementary roles; this lesson offers no substitute vehicle-use arrangement. “Longer is always better without limit.” Real systems have finite space and restraint limits; the model displays the distance tradeoff.',
    ],
    realWorld: [
      '安全带、气囊和包装垫都能联系到冲量与缓冲，但人、车辆和包装的结构不同。把1 kg滑块结果用于解释规律，不能拿其数字评价实际车辆、乘员或产品。',
      'Belts, airbags and packing cushions relate to impulse and cushioning but have different structures. Use the 1 kg slider to explain relationships, not to evaluate a vehicle, occupant or product numerically.',
    ],
    summary: [
      '缓冲同时涉及时间、空间和力的分布；动量改变没有被消除。',
      'Cushioning involves time, space and force distribution; it does not erase momentum change.',
    ],
    homeExperiment: [
      '为一个想象中的易碎包裹画“更多停止时间、更多空间、分散接触面积”三种设计解释。用纸盒和柔软填充物观察空间占用即可，不做车内实验或人体冲击。',
      'Sketch three ideas for an imaginary fragile parcel: more stopping time, more room and spread contact area. Observe space used by soft packing in a paper box; no vehicle or body-impact experiments.',
    ],
    vocabulary: [
      ['约束', 'Restraint'],
      ['缓冲', 'Cushioning'],
      ['停止距离', 'Stopping distance'],
      ['接触面积', 'Contact area'],
    ],
    questions: [
      [
        '1 kg×4 m/s停到0，冲量？',
        '1 kg at 4 m/s stops. Impulse?',
        [
          ['+4', '+4'],
          ['−4 N·s', '−4 N·s'],
          ['0', '0'],
        ],
        1,
        '动量终减初。',
        'Final momentum minus initial.',
      ],
      [
        '0.4 s恒减速，停止距离？',
        'Constant deceleration for 0.4 s: stopping distance?',
        [
          ['0.8 m', '0.8 m'],
          ['1.6 m', '1.6 m'],
          ['0.4 m', '0.4 m'],
        ],
        0,
        '平均速度2，乘0.4。',
        'Mean velocity 2 times 0.4.',
      ],
      [
        '相同力分布到两倍面积，平均压强？',
        'The same force over twice the area: mean pressure?',
        [
          ['两倍', 'Twice'],
          ['不变', 'Unchanged'],
          ['一半', 'Half'],
        ],
        2,
        'F不变，A两倍。',
        'Fixed F, doubled A.',
      ],
    ],
    exit: [
      '设计更长停止时间的缓冲时，还要检查？',
      'What else must be checked when designing a longer stop?',
      [
        [
          '可用停止空间和力的分布',
          'Available stopping space and force distribution',
        ],
        ['只看平均力，其他无关', 'Only mean force matters'],
        ['是否让冲量变成0', 'Whether impulse becomes zero'],
      ],
      0,
      '延长时间不会消除Δp，还需要空间。',
      'Longer duration does not erase Δp and still needs space.',
    ],
  }),
];
