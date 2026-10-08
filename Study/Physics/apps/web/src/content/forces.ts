import { t, q, type Lesson } from './schema';
export const forceLessons: Lesson[] = [
  {
    id: 'push-pull-and-shape',
    stage: 1,
    unit: 'forces',
    kind: 'force-effects',
    minutes: 17,
    title: t('推一下，究竟改变了什么？', 'What does a push actually change?'),
    subtitle: t(
      '小车改变运动，弹簧改变形状。',
      'A cart changes motion; a spring changes shape.',
    ),
    hook: t(
      '推小车，它可能加快；推弹簧，它可能变短。弹簧没跑出去，难道就没受到力？',
      'A pushed cart may speed up; a pushed spring may shorten. If the spring does not travel away, was there no force?',
    ),
    prediction: t(
      '力只能让物体“开始移动”吗？',
      'Can force only make something start moving?',
    ),
    predictions: [
      t(
        '不，还可能改变形状或运动方向',
        'No: it can change shape or motion direction',
      ),
      t('是，没移动就没力', 'Yes: no travel means no force'),
      t('只有拉才算力', 'Only pulling counts as force'),
    ],
    explore: t(
      '小车原本向右1 m/s。分别播放水平合力0 N和向右2 N的两秒事件；再切换弹簧，记录向左压和向右拉。比较运动读数和长度变化。',
      'The cart initially moves right at 1 m/s. Play two-second events with horizontal net forces 0 N and 2 N right. Switch to the spring and record compression left and stretching right. Compare motion and length.',
    ),
    concept: t(
      '力描述物体之间的相互作用，推和拉都属于力。它能改变运动状态——快慢或方向，也能使物体形变。力的大小用牛顿（N）表示，方向也必须说明。小车模型的水平合力改变速度；弹簧的固定端与外力共同使它形变。运动变化与形变有时会同时发生。',
      'Force describes interaction between objects, including pushing and pulling. It can change speed or direction, and deform an object. Force magnitude is measured in newtons (N); direction matters too. The cart’s horizontal net force changes velocity. The spring’s fixed end and external force deform it. Both effects can occur together.',
    ),
    example: t(
      '这里2 kg小车起初向右1 m/s：合力0 N时，2 s后仍向右1 m/s；合力向右2 N时，变为向右3 m/s。模型弹簧自然长20 cm，向右拉2 N后长25 cm，向左压2 N后长15 cm。这些数字来自规定模型，真实弹簧需测量。',
      'This 2 kg cart starts at 1 m/s right. After 2 s, zero net force leaves it at 1 m/s; a 2 N rightward net force gives 3 m/s right. The model spring is naturally 20 cm long: 2 N right stretches it to 25 cm, while 2 N left compresses it to 15 cm. These are prescribed model values; real springs require measurement.',
    ),
    misconception: t(
      '物体在运动，不等于它受到向前的合力。反过来，物体没整体移动，也不代表没受力：固定弹簧可以形变，桌上的书可以受到相互平衡的力。力的作用取决于所研究的物体与条件。',
      'Motion does not imply a forward net force. No overall travel does not imply no force: a fixed spring deforms and a book on a table can have balanced forces. Identify the object and conditions.',
    ),
    realWorld: t(
      '刹车能使车减速；海绵被挤压会变形；接球时球会减速，手和球也可能短暂形变。',
      'Brakes slow a vehicle; squeezing deforms a sponge; catching a ball slows it and may briefly deform the hand and ball.',
    ),
    summary: t(
      '观察力的效果，要看运动怎样改变，也要看形状怎样改变。',
      'Look for changes in motion and shape when investigating force.',
    ),
    homeExperiment: t(
      '轻压海绵，再轻推桌面玩具车。分别描述哪个物体受到谁的力、发生了什么变化。不要用力拉弹簧或把橡皮筋对准人。',
      'Gently squeeze a sponge and push a tabletop toy car. Name the object, the source of force and the change. Avoid overstretching springs or aiming elastic bands at people.',
    ),
    vocabulary: [
      t('力', 'force'),
      t('推与拉', 'push and pull'),
      t('形变', 'deformation'),
      t('牛顿', 'newton'),
    ],
    questions: [
      q(
        '海绵被压扁，主要观察到力的什么效果？',
        'A sponge is compressed. Which effect is observed?',
        [
          ['改变形状', 'Changing shape'],
          ['增加物质', 'Adding matter'],
        ],
        0,
        '形状改变是力的作用效果之一。',
        'Deformation is one effect of force.',
      ),
      q(
        '说“2 N的力”还缺哪项关键信息？',
        'What important detail is missing from “a 2 N force”?',
        [
          ['颜色', 'Colour'],
          ['方向与作用对象', 'Direction and object acted on'],
        ],
        1,
        '同样大小的力，方向和作用对象不同，结果可以不同。',
        'Equal magnitudes can have different effects with different directions or target objects.',
      ),
      q(
        '无阻力的小车匀速向右，水平合力必须向右吗？',
        'A cart moves steadily right without resistance. Must its horizontal net force point right?',
        [
          ['必须', 'Yes'],
          ['不必，合力可为零', 'No: net force can be zero'],
        ],
        1,
        '匀速直线运动不需要向前的合力维持。',
        'Constant straight-line motion does not need a forward net force.',
      ),
    ],
    exit: q(
      '有人说“没跑出去，就没有力的效果”。你会用什么证据回应？',
      'Someone says “no travel means no effect of force”. Which evidence helps?',
      [
        ['固定弹簧受压后变短', 'A fixed spring shortens when compressed'],
        ['只说力很神奇', 'Just call force magical'],
      ],
      0,
      '形变也是可观察的力的效果；应指出作用对象与实际变化。',
      'Deformation is an observable effect; identify the object and the actual change.',
    ),
  },
  {
    id: 'balanced-and-unbalanced-forces',
    stage: 1,
    unit: 'forces',
    kind: 'force-balance',
    minutes: 18,
    title: t(
      '两边都在拉，车一定停着吗？',
      'Pulled equally: must the cart be still?',
    ),
    subtitle: t(
      '同一个物体，比较所有水平力。',
      'Compare horizontal forces on the same object.',
    ),
    hook: t(
      '小车两侧各有2 N的力。它可能静止，也可能匀速前进。两个力一样，为什么结果不只有一种？',
      'A cart has opposing 2 N forces. It may remain still or move steadily. Why can equal forces accompany different motions?',
    ),
    prediction: t(
      '平衡力会让已经运动的小车立刻停下吗？',
      'Do balanced forces instantly stop an already moving cart?',
    ),
    predictions: [
      t('不会，运动状态保持不变', 'No: its motion stays unchanged'),
      t('会，合力零就速度零', 'Yes: zero net force means zero speed'),
      t('一定会加速', 'It must speed up'),
    ],
    explore: t(
      '左右各2 N，先从静止播放，再从向右1 m/s播放。最后把右拉改为4 N、左拉保持2 N，观察合力与运动变化。三次完整播放后比较。',
      'Set 2 N on each side: play from rest, then from 1 m/s right. Next use 4 N right and 2 N left; inspect net force and changing motion. Compare all three completed events.',
    ),
    concept: t(
      '先选定同一个物体。沿同一直线，反向力相减，同向力相加；向右为正时，水平合力=右拉−左拉。大小相等、方向相反且作用在同一物体上的共线力互相平衡。合力为零，物体保持静止或匀速直线运动；合力不为零，速度的大小或方向会改变。',
      'Choose one object first. Along one line, opposing forces subtract and same-direction forces add. With right positive, horizontal net force = right pull − left pull. Equal, opposite, collinear forces on the same object balance. Zero net force preserves rest or constant straight-line motion; nonzero net force changes velocity.',
    ),
    formula: t(
      'F合 = F右 − F左（仅限本例的一维水平力，向右为正）',
      'Fnet = Fright − Fleft (this one-dimensional horizontal example; right positive)',
    ),
    example: t(
      '左2 N、右2 N：合力0 N。起初静止就继续静止；起初向右1 m/s就继续匀速。右4 N、左2 N：合力向右2 N。本模型2 kg小车起初静止，2 s后向右2 m/s；起初向右1 m/s，2 s后向右3 m/s。',
      'Left 2 N, right 2 N: net 0 N. Rest stays rest; an initial 1 m/s right remains steady. Right 4 N and left 2 N: net 2 N right. This 2 kg model cart reaches 2 m/s after 2 s from rest, or 3 m/s from an initial 1 m/s.',
    ),
    misconception: t(
      '合力为零不是每个力都为零，也不是速度为零。不要把“手推车”和“车推手”当作车上的平衡力：它们作用在不同物体上。这里先比较同一辆车上的共线水平力；垂直力另行平衡。',
      'Zero net force does not mean every force is zero or velocity is zero. “Hand pushes cart” and “cart pushes hand” act on different objects, so they are not balancing forces on the cart. This station compares collinear horizontal forces on one cart; vertical forces balance separately.',
    ),
    realWorld: t(
      '一辆匀速拉动的箱子，拉力可能与阻力平衡；箱子停止时也可能有力。判断力是否平衡，要看运动状态有没有改变，而不只是看它有没有移动。',
      'A steadily pulled crate may have a pull balanced by resistance. A stationary crate can also experience forces. Look for changes in motion, not simply whether it moves.',
    ),
    summary: t(
      '平衡力保持运动状态；非平衡力改变运动状态。先看同一物体，再看大小和方向。',
      'Balanced forces preserve motion; unbalanced forces change it. Choose one object, then inspect magnitudes and directions.',
    ),
    homeExperiment: t(
      '在平桌上用两根短绳从左右轻拉玩具车，由家人协助。比较近似平衡与一边稍大时的情况。真实车有摩擦；不能把玩具停着直接当作两拉力完全相等的证明。',
      'With a helper, gently pull a toy cart left and right using short strings on a level table. Compare near balance and a stronger side. Real carts have friction; being still alone does not prove the two pulls are exactly equal.',
    ),
    vocabulary: [
      t('合力', 'net force'),
      t('平衡力', 'balanced forces'),
      t('非平衡力', 'unbalanced forces'),
      t('方向', 'direction'),
    ],
    questions: [
      q(
        '向右4 N、向左2 N的水平合力是多少？',
        'What is the net of 4 N right and 2 N left?',
        [
          ['向右2 N', '2 N right'],
          ['向右6 N', '6 N right'],
        ],
        0,
        '相反方向相减，4−2=2 N，向右。',
        'Opposite directions subtract: 4−2=2 N right.',
      ),
      q(
        '合力零的车原本向右1 m/s，会怎样？',
        'A cart starts at 1 m/s right with zero net force. What happens?',
        [
          ['立刻静止', 'Stops instantly'],
          ['保持匀速直线运动', 'Keeps constant straight-line motion'],
        ],
        1,
        '零合力意味着速度不变，不是速度为零。',
        'Zero net force means velocity is unchanged, not zero.',
      ),
      q(
        '哪一组可以直接用于判断车的水平力是否平衡？',
        'Which pair can be compared as balancing horizontal forces on a cart?',
        [
          [
            '左右两根绳对同一车的拉力',
            'The two strings’ pulls on the same cart',
          ],
          ['手推车与车推手', 'Hand on cart and cart on hand'],
        ],
        0,
        '分析平衡时，先确定同一个受力物体。',
        'Balance analysis first identifies one object acted on.',
      ),
    ],
    exit: q(
      '车向右运动，但速度越来越小。能断定它受到向右的水平合力吗？',
      'A cart moves right but slows down. Must its horizontal net force be rightward?',
      [
        [
          '是，运动方向就是合力方向',
          'Yes: motion direction equals net-force direction',
        ],
        [
          '不能；在本例水平合力向左',
          'No: in this example the net force is leftward',
        ],
      ],
      1,
      '合力决定速度怎样改变，不直接决定此刻向哪边运动；向左的合力可使向右的车减速。',
      'Net force determines change in velocity, not necessarily its current direction; a leftward net force can slow rightward motion.',
    ),
  },
  {
    id: 'friction-grip-and-slide',
    stage: 1,
    unit: 'forces',
    kind: 'grip-friction',
    minutes: 18,
    title: t(
      '推了却没动，摩擦在做什么？',
      'Pushed but still: what is friction doing?',
    ),
    subtitle: t(
      '从抓地到滑行，区分静摩擦与滑动摩擦。',
      'From grip to sliding: static versus sliding friction.',
    ),
    hook: t(
      '轻推桌上的书，它不动；再推大一点，它开始滑。可是你走路又需要摩擦。摩擦只是“让物体慢下来”吗？',
      'A gently pushed book stays still, then slides under a stronger push. Yet walking needs friction. Does friction only slow things down?',
    ),
    prediction: t(
      '书没滑动时，接触面也可能有摩擦力吗？',
      'Can there be friction while a book is not sliding?',
    ),
    predictions: [
      t('可以，静摩擦能阻止滑动', 'Yes: static friction can prevent slipping'),
      t('不可能，只有滑动才有', 'No: only sliding creates friction'),
      t('摩擦永远固定大小', 'Friction always has a fixed magnitude'),
    ],
    explore: t(
      '有摩擦时，从静止分别用向右2 N与4 N播放。再从向右1 m/s、外力0 N观察减速；最后换无摩擦理想面，以同样初速和0 N外力播放。比较四种情况。',
      'With friction, play from rest with 2 N and 4 N right. Then begin at 1 m/s right with zero applied force. Finally use the ideal frictionless surface with the same initial motion and zero applied force. Compare all four cases.',
    ),
    concept: t(
      '静摩擦可以阻止接触面发生相对滑动；在一定上限内，它会随需要改变大小。超过上限，物体可能滑动，滑动摩擦在本模型中反向于相对滑动。物体停止后不能继续把固定滑动摩擦往同一方向施加，否则会错误地让它自行倒滑。摩擦方向要看接触面的相对运动或滑动趋势。',
      'Static friction can prevent relative slipping, adjusting up to a limit. Beyond that limit sliding may begin; sliding friction opposes relative sliding in this model. Once motion stops, continuing the same fixed sliding friction would incorrectly make an unpushed object reverse. Determine friction direction from relative sliding or its tendency at the contact.',
    ),
    example: t(
      '本例2 kg方块：静摩擦上限3 N、滑动摩擦2 N。静止时向右推2 N，静摩擦向左2 N，合力0，仍静止。向右推4 N会滑动，此时向左摩擦2 N，合力向右2 N。原本向右1 m/s、撤去外力后，1 s停止，位置从2 m变为2.5 m，不会靠摩擦自行倒滑。',
      'The 2 kg model block has a 3 N static limit and 2 N sliding friction. From rest a 2 N rightward push is balanced by 2 N static friction left. A 4 N push starts sliding, with 2 N friction left and a 2 N rightward net force. Starting at 1 m/s right with no applied force, it stops in 1 s at position 2.5 m from 2 m, without reversing on its own.',
    ),
    misconception: t(
      '摩擦不总是“有害”，也不总与物体相对地面的运动相反。正常走路时，脚有向后滑的趋势，地面对脚的静摩擦可以向前。这个水平滑块模型不能代表滚轮、所有材料或所有速度；“越粗糙摩擦一定越大”也不是万能规则。',
      'Friction is not always harmful or opposite an object’s motion relative to the ground. In normal walking the foot tends to slip backward, so ground friction can act forward on it. This sliding-block model does not describe wheels, all materials or all speeds; rougher always means more friction is not universal.',
    ),
    realWorld: t(
      '鞋底抓地、手握杯子和书不滑落，都可能依赖静摩擦。润滑能减少某些接触部件的摩擦，但脚底完全无摩擦反而难以起步。',
      'Shoe grip, holding a cup and preventing a book from slipping can rely on static friction. Lubrication reduces friction in some parts, while frictionless feet would struggle to start walking.',
    ),
    summary: t(
      '摩擦关注接触面的相对滑动；静止也可有摩擦，停止后应重新判断受力。',
      'Friction concerns relative slipping at contact; it can act at rest, and forces must be reassessed after stopping.',
    ),
    homeExperiment: t(
      '在桌上轻推一本薄书，先小力、再稍大力。用自己的话区分“有推力但没滑”与“开始滑”。保持桌面干燥；不要在地面上故意滑倒来验证摩擦。',
      'Gently push a thin book on a dry table, first softly then a little harder. Distinguish pushed without sliding from beginning to slide. Use the tabletop rather than trying to slip on a floor.',
    ),
    vocabulary: [
      t('静摩擦', 'static friction'),
      t('滑动摩擦', 'sliding friction'),
      t('滑动趋势', 'tendency to slip'),
      t('抓地', 'grip'),
    ],
    questions: [
      q(
        '本模型静止方块受到向右2 N推力，摩擦怎样？',
        'A resting block in this model is pushed right with 2 N. What does friction do?',
        [
          ['向左2 N，与推力平衡', '2 N left, balancing the push'],
          ['一定向左3 N', 'Always 3 N left'],
        ],
        0,
        '3 N是静摩擦上限，不是每次都达到的大小。',
        '3 N is the static limit, not the force in every case.',
      ),
      q(
        '原本向右滑，撤去外力后摩擦使它停止；下一刻会自行向左吗？',
        'A right-sliding block stops from friction with no applied force. Will it then move left by itself?',
        [
          ['会，摩擦永远向左', 'Yes: friction always points left'],
          ['不会，停止后重新判断', 'No: reassess after stopping'],
        ],
        1,
        '没有让它滑动的外力，不能沿原滑动摩擦继续把它加速向后。',
        'Without a force tending to slide it, the old sliding friction must not keep accelerating it backward.',
      ),
      q(
        '正常起步时，地面对脚的静摩擦可以怎样？',
        'When beginning to walk normally, how can ground friction act on the foot?',
        [
          ['向前，阻止脚向后滑', 'Forward, preventing backward slip'],
          ['只能向后', 'Only backward'],
        ],
        0,
        '摩擦取决于接触面滑动趋势，而不是简单套用“与整体运动相反”。',
        'Friction depends on slipping tendency at contact, not a blanket opposite-to-body-motion rule.',
      ),
    ],
    exit: q(
      '同学看方块没动，说“根本没有推力”。这条观察能证明吗？',
      'A classmate sees the block stay still and concludes no push exists. Is that proven?',
      [
        ['能，静止表示每个力为零', 'Yes: rest means every force is zero'],
        [
          '不能，推力可能被静摩擦平衡',
          'No: static friction may balance a push',
        ],
      ],
      1,
      '静止只支持运动没有变化；还需比较同一物体受到的其他力。',
      'Rest shows unchanged motion; inspect other forces on the same object.',
    ),
  },
  {
    id: 'air-resistance-paper',
    stage: 1,
    unit: 'forces',
    kind: 'paper-drag',
    minutes: 17,
    title: t(
      '同一张纸，揉一下就落得更快？',
      'Same paper: why does crumpling change its fall?',
    ),
    subtitle: t(
      '保持质量相同，看形状怎样改变空气阻力。',
      'Keep mass the same; investigate shape and air resistance.',
    ),
    hook: t(
      '纸张摊开时飘，揉成团时落得更快。纸没有增加，可运动变了。是什么条件改变了？',
      'A flat sheet drifts while a crumpled one often falls faster. No paper was added. Which condition changed?',
    ),
    prediction: t(
      '相同质量的平纸与纸团，在理想无空气环境中同时释放会怎样？',
      'Equal-mass flat and crumpled paper are released together without air. What happens?',
    ),
    predictions: [
      t('本模型同时落地', 'They land together in this model'),
      t('纸团永远更快', 'Crumpled paper is always faster'),
      t('平纸不受重力', 'Flat paper has no gravity'),
    ],
    explore: t(
      '先在有空气模型中同时释放平纸与纸团，再在理想无空气模型中重复。两种纸质量相同、初速零、起点同高；比较落地时间。',
      'Release equal-mass flat and crumpled paper together with air, then repeat without air. Both start at rest at the same height. Compare landing times.',
    ),
    concept: t(
      '空气阻力来自物体与空气的相互作用；在静止空气中竖直下落时，它与下落方向相反。形状和迎风面积等因素会影响阻力。这里两种形状质量相同、重力相同，但平纸在模型中受到更大的阻力；速度越大，模型阻力越大。无空气时，两者重力加速度相同。',
      'Air resistance comes from interaction with air. During vertical falling through still air it opposes downward motion. Shape and projected area affect resistance. Both model shapes have the same mass and gravity, but flat paper has greater model drag; drag grows with speed. Without air, both have the same gravitational acceleration.',
    ),
    example: t(
      '演示采用两份各5 g的纸、20 m起始高度与g≈10 m/s²。有空气时，规定的阻力模型使纸团约2.14 s落地，平纸约4.50 s；无空气时均2.00 s。20 m只用于屏幕演示，家庭观察用低高度。揉纸改变形状，不会自动增加质量。',
      'The demonstration uses two 5 g papers, 20 m height and g≈10 m/s². Prescribed drag gives about 2.14 s for crumpled paper and 4.50 s for flat paper; without air both take 2.00 s. Twenty metres is screen-only; use a low height at home. Crumpling changes shape, not mass.',
    ),
    misconception: t(
      '不能由纸团落得快就断定“越重永远落得快”，也不能说空气阻力存在时物体一直以同一个加速度下落。真实平纸会摆动、翻转，阻力常不简单正比于速度；模型只展示受力比较，不预测所有真实纸张的落地时间。',
      'A faster paper ball does not establish heavier always falls faster. With drag, falling acceleration need not stay constant. Real flat paper may flutter and turn, and drag is often not simply proportional to speed. This model illustrates force comparisons, not universal paper landing times.',
    ),
    realWorld: t(
      '降落伞通过形状和较大迎风面积增大阻力；骑车迎风与低头时感受不同，也提醒我们要考虑相对空气的运动。',
      'Parachutes use shape and projected area to increase drag. Cycling into wind or changing posture feels different, reminding us to consider motion relative to air.',
    ),
    summary: t(
      '比较下落，控制质量和起始条件，再看空气与形状；落得快不是更重的证据。',
      'Control mass and starting conditions before comparing shape and air; faster falling is not evidence of greater mass.',
    ),
    homeExperiment: t(
      '用同一张纸先摊开、后揉团，从成人胸前的低高度释放，观察差别。或用两份相同纸，其中一份揉团，同时低处释放并重复。远离窗边和风扇；不用高处或楼梯。家庭结果是自己的观察，不必与模型秒数一致。',
      'Drop the same sheet flat then crumpled from a low chest-level height, or compare two matching sheets together with one crumpled. Repeat away from windows and fans; use a low clear space. Your observations need not match model times.',
    ),
    vocabulary: [
      t('空气阻力', 'air resistance'),
      t('迎风面积', 'projected area'),
      t('重力', 'gravity'),
      t('公平比较', 'fair comparison'),
    ],
    questions: [
      q(
        '同一张纸揉成团，哪项基本保持不变？',
        'When the same sheet is crumpled, what stays essentially unchanged?',
        [
          ['质量', 'Mass'],
          ['形状', 'Shape'],
        ],
        0,
        '没有增减纸张，质量基本相同。',
        'No paper is added or removed, so mass is essentially unchanged.',
      ),
      q(
        '纸在静止空气中向下落，空气阻力方向怎样？',
        'Paper falls down through still air. Which way is drag?',
        [
          ['向上', 'Upward'],
          ['与下落同向', 'Along with the fall'],
        ],
        0,
        '阻力反向于纸相对空气的运动。',
        'Drag opposes motion relative to the air.',
      ),
      q(
        '理想无空气中，本模型同高静止释放的两种纸怎样？',
        'Without air, how do the two model shapes fall from rest at equal height?',
        [
          ['纸团仍必定先到', 'Crumpled paper must still arrive first'],
          ['同时落地', 'They land together'],
        ],
        1,
        '空气阻力消失，两种形状按相同的重力加速度下落。',
        'Without drag, both fall with the same gravitational acceleration.',
      ),
    ],
    exit: q(
      '想只测试形状对下落的影响，哪种比较更公平？',
      'Which comparison better isolates shape’s effect on falling?',
      [
        [
          '相同纸与质量、同高同初速，只改变形状',
          'Same paper and mass, height and initial motion; change only shape',
        ],
        [
          '平纸从高处、纸团从低处',
          'Flat paper high up and crumpled paper lower down',
        ],
      ],
      0,
      '控制质量、高度和释放方式，才更能把差异联系到形状与空气阻力；真实观察还要重复。',
      'Control mass, height and release method to better connect differences with shape and drag; repeat real observations.',
    ),
  },
];
