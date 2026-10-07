import { t, q, type Lesson } from './schema';
export const causeLesson: Lesson = {
  id: 'cause-and-effect',
  stage: 0,
  unit: 'patterns',
  kind: 'fair-test',
  minutes: 15,
  title: t(
    '改了两件事，能找到原因吗？',
    'Two changes: can we identify the cause?',
  ),
  subtitle: t(
    '把“同时发生”变成值得相信的比较。',
    'Turn “happened together” into a fair comparison.',
  ),
  hook: t(
    '朋友说地毯让球滚得更远，可他在地毯上也推得更用力。这次比赛能证明地毯的效果吗？',
    'Your friend says carpet makes a ball travel farther, but also pushes it harder on the carpet. Does that prove the effect of carpet?',
  ),
  prediction: t(
    '起始速度和地面都变了，停止距离不同。能单独判断地面的影响吗？',
    'Both starting speed and surface changed. Can a different stopping distance isolate the surface’s effect?',
  ),
  predictions: [
    t(
      '能，结果不同就说明地面是原因',
      'Yes; a difference proves the surface caused it',
    ),
    t('不能，需要更公平的对比', 'No; we need a fairer comparison'),
  ],
  explore: t(
    '先记录光滑地面 2 m/s 与粗糙地面 3 m/s，再补粗糙地面 2 m/s。看表格，找出只改变地面的一对记录。每次释放同一颗模型球。',
    'Record smooth at 2 m/s and rough at 3 m/s, then add rough at 2 m/s. Find the pair that changes only the surface. Release the same model ball each time.',
  ),
  concept: t(
    '两个现象一起出现，叫有联系，但不一定是一方造成另一方。研究地面时，保持同一个球与同样起始速度，只改地面，比较停止距离。这样更能把结果联系到改变的条件。真实实验还要重复测量，注意坡度、推法等额外因素；一个模型能帮我们练方法，不能自动证明所有真实材料。',
    'Events occurring together are associated, but one need not cause the other. To investigate the surface, keep the ball and starting speed fixed, change the surface and compare stopping distance. Repeated real measurements and checks for slopes or release differences make the evidence stronger. A model practices the method; it does not prove claims about all real materials.',
  ),
  example: t(
    '模型记录：光滑 2 m/s 滚 4 m；粗糙 3 m/s 滚 2.25 m。这对改变了两个条件。补做粗糙 2 m/s，滚 1 m，才能与第一条比较地面影响。光滑地面 2 与 3 m/s 的对比，则研究起始速度。',
    'Model records: smooth at 2 m/s travels 4 m; rough at 3 m/s travels 2.25 m. That pair changes two conditions. Rough at 2 m/s travels 1 m, allowing a surface comparison with the first record. Smooth at 2 and 3 m/s instead investigates starting speed.',
  ),
  misconception: t(
    '“只改一个条件”不是让结果也保持一样。停止距离就是要观察的结果。也不要把相关性直接当因果：热天冰淇淋卖得多，人也更爱游泳，不代表冰淇淋让人游泳。',
    'Changing one condition does not mean keeping the outcome fixed. Stopping distance is the outcome to observe. Association is not automatically causation: hot weather may increase both ice-cream sales and swimming, without ice cream causing people to swim.',
  ),
  realWorld: t(
    '比较运动鞋抓地、纸飞机或保温杯，都先写清要改什么、保持什么、测什么。生活里的数据常受许多因素影响；先找一个小而可测试的问题。',
    'To compare shoe grip, paper planes or insulated cups, write what to change, keep and measure. Everyday data have many influences; start with a small testable question.',
  ),
  summary: t(
    '把条件与结果分开。公平比较和重复记录，比“碰巧一起发生”更能支持解释。',
    'Separate conditions from outcomes. Fair comparisons and repeated records support explanations better than coincidence.',
  ),
  homeExperiment: t(
    '选同一颗小球，比较平坦硬桌面与铺在同一桌面的毛巾。先想办法尽量保持释放位置与起始速度一致，重复三次；记录距离，不要挑选最喜欢的一次。也写下控制不好的条件。',
    'Compare the same small ball on a level table and a towel on that table. Plan how to keep release position and starting speed consistent; repeat three times. Keep every distance and record conditions you could not control well.',
  ),
  vocabulary: [
    t('条件', 'condition'),
    t('结果', 'outcome'),
    t('公平比较', 'fair comparison'),
    t('因果', 'cause and effect'),
  ],
  questions: [
    q(
      '研究地面，哪一对记录最合适？',
      'Which pair best investigates the surface?',
      [
        ['光滑 2 m/s 与粗糙 2 m/s', 'Smooth 2 m/s and rough 2 m/s'],
        ['光滑 2 m/s 与粗糙 3 m/s', 'Smooth 2 m/s and rough 3 m/s'],
      ],
      0,
      '第一对只改变地面；第二对同时改变了地面与起始速度。',
      'The first changes only surface; the second changes surface and starting speed.',
    ),
    q(
      '停止距离在这项实验中是什么？',
      'What is stopping distance in this investigation?',
      [
        ['要保持相同的条件', 'A condition to keep fixed'],
        ['要测量的结果', 'The outcome to measure'],
      ],
      1,
      '结果可以变化，正是这种变化帮助我们比较。',
      'The outcome may change; that is what the comparison examines.',
    ),
    q(
      '热天冰淇淋销量和游泳人数一起增加，先考虑什么？',
      'Ice-cream sales and swimming both rise on hot days. What should you consider first?',
      [
        ['可能有共同因素：天气', 'A shared factor such as weather'],
        ['冰淇淋一定使人游泳', 'Ice cream must cause swimming'],
      ],
      0,
      '共同因素能造成两个量相关，不能仅据此认定因果。',
      'A shared influence can create association without proving causation.',
    ),
  ],
  exit: q(
    '一次结果支持猜想后，下一步怎样做更好？',
    'What is a better next step after one result supports your prediction?',
    [
      [
        '重复并记录全部结果，检查其他影响',
        'Repeat, keep all results and check other influences',
      ],
      ['停止检查，因为已经证明永远如此', 'Stop checking; it is proved forever'],
    ],
    0,
    '解释需要证据累积，也要留意不支持它的结果。',
    'Build evidence and attend to results that do not support the explanation.',
  ),
};
export const discoveryLessons: Lesson[] = [
  {
    id: 'why-mirrors-show-us',
    stage: 0,
    unit: 'mysteries',
    kind: 'mirror',
    minutes: 15,
    title: t(
      '镜子后面真有另一个你吗？',
      'Is another you really behind the mirror?',
    ),
    subtitle: t(
      '跟随真正的光，看懂“像”的位置。',
      'Follow real light to locate the image.',
    ),
    hook: t(
      '向镜子走近一步，镜子里的你也走近了。可光真的穿过镜子，去了那个房间吗？',
      'Step toward a mirror and your image approaches too. Did the light really travel into a room behind it?',
    ),
    prediction: t(
      '你离平面镜 40 cm，像看起来在镜子后多远？',
      'You are 40 cm from a plane mirror. How far behind it does the image appear?',
    ),
    predictions: [
      t('20 cm', '20 cm'),
      t('40 cm', '40 cm'),
      t('80 cm', '80 cm'),
    ],
    explore: t(
      '把物体距离从 40 cm 调到 60 cm 或更远。实线表示物体 → 镜面 → 眼睛的真实光路；虚线是眼睛把反射光向后追溯的方向。比较像与物体到镜面的距离。',
      'Move the object from 40 cm to 60 cm or farther. Solid lines show object → mirror → eye. Dashed lines trace the reflected light backward to its apparent origin. Compare object and image distances from the mirror.',
    ),
    concept: t(
      '光从物体出发，到镜面反射，再进入眼睛。眼睛把进入的光沿直线向后追溯，好像它来自镜子后方，于是看见虚像。理想平面镜的像与物体到镜面距离相同，大小相同，保持上下方向。虚线不是镜子后方真实存在的光线。',
      'Light travels from the object to the mirror, reflects and reaches the eye. Tracing the arriving light backward makes it appear to originate behind the mirror: a virtual image. An ideal plane mirror gives equal object and image distances, equal size and unchanged up/down orientation. Dashed extensions are not actual rays behind the mirror.',
    ),
    example: t(
      '物体离镜面 40 cm，像在后方 40 cm，物体与像相隔 80 cm。把物体移到 60 cm，像也在后方 60 cm。把“离镜面”与“物体到像”分开，才不会把距离算错。',
      'An object 40 cm in front has its image 40 cm behind; object and image are 80 cm apart. At 60 cm in front, the image is 60 cm behind. Keep “distance to mirror” distinct from “object to image.”',
    ),
    misconception: t(
      '镜子不是选择把左边换成右边。对于竖直平面镜，更准确的几何变化是垂直于镜面的前后方向反转；上还是上，镜面平行方向保持不变。我们常拿镜像与“转过身的人”比较，才觉得左右互换。',
      'A mirror does not select left and swap it with right. For a vertical plane mirror, the geometric reversal is front/back perpendicular to the surface; up stays up and directions parallel to it remain unchanged. Comparing the image with a person turned around creates the familiar left/right impression.',
    ),
    realWorld: t(
      '洗手间镜子让你看见来自脸部的反射光；理发时两面镜子让光改变多次方向。曲面镜会改变像的大小和位置，这一课的等距离规则只针对平面镜。',
      'A bathroom mirror redirects light from your face. Two mirrors at a hairdresser redirect light more than once. Curved mirrors can change size and position; this equal-distance rule applies to plane mirrors.',
    ),
    summary: t(
      '像在后方，是因为我们把反射光向后追溯；真实光在镜前完成反射。',
      'The image appears behind because we trace reflected light backward; the actual reflection takes place in front.',
    ),
    homeExperiment: t(
      '用完整且固定好的平面镜，拿一支有颜色标记的笔靠近、远离镜面。画出真实笔与像的位置，比较上方和朝向镜面的标记。不要拆镜子，也不要用镜子或强光观察太阳。',
      'Use an intact, secured plane mirror and a pen with a colored marker. Move it closer and farther, sketch object/image positions and compare top and mirror-facing markers. Keep the mirror intact and use ordinary indoor light.',
    ),
    vocabulary: [
      t('反射', 'reflection'),
      t('虚像', 'virtual image'),
      t('镜面', 'mirror surface'),
      t('光路', 'light path'),
    ],
    questions: [
      q(
        '物体离平面镜 30 cm，像到镜面的距离是多少？',
        'An object is 30 cm from a plane mirror. What is the image distance from the mirror?',
        [
          ['30 cm', '30 cm'],
          ['60 cm', '60 cm'],
          ['15 cm', '15 cm'],
        ],
        0,
        '理想平面镜像距等于物距；60 cm 是物体与像之间的距离。',
        'Image and object distances are equal; 60 cm is the object–image separation.',
      ),
      q(
        '图中的虚线表示什么？',
        'What do the dashed lines represent?',
        [
          [
            '光真的穿过镜子进入后面',
            'Light actually entering the space behind',
          ],
          ['反射光的向后延长线', 'Backward extensions of reflected rays'],
        ],
        1,
        '这是定位像的几何线，不是镜后实际传播的光。',
        'They locate the apparent image, not actual light behind the mirror.',
      ),
      q(
        '把笔的上端画成红色，理想竖直平面镜的像怎样？',
        'The top of a pen is red. What happens in an ideal vertical plane mirror?',
        [
          ['红色还在上端', 'Red remains at the top'],
          ['红色到下端', 'Red moves to the bottom'],
        ],
        0,
        '镜子没有颠倒上下；平行于镜面的方向保持不变。',
        'Up/down is not reversed; directions parallel to the mirror stay unchanged.',
      ),
    ],
    exit: q(
      '凹面镜把物体放大，可以直接用这一课的“像距等于物距”吗？',
      'A concave mirror enlarges an object. Can you directly use equal object/image distance?',
      [
        [
          '不能，这是平面镜模型的规则',
          'No; that rule belongs to the plane-mirror model',
        ],
        ['能，所有镜子都一样', 'Yes; all mirrors behave identically'],
      ],
      0,
      '规则有适用条件。之后学习曲面镜时，我们会用新的光路模型。',
      'Rules have conditions; curved mirrors need a different ray model.',
    ),
  },
  {
    id: 'why-balloons-attract',
    stage: 0,
    unit: 'mysteries',
    kind: 'static',
    minutes: 15,
    title: t(
      '墙没带电，气球怎么还靠过来？',
      'Why does a balloon approach a neutral wall?',
    ),
    subtitle: t(
      '不接触，也能有作用；中性也不是没有电荷。',
      'An interaction without contact; neutral is not charge-free.',
    ),
    hook: t(
      '摩擦过的气球有时能贴在墙上。墙没有额外净电荷，为什么还可能吸引气球？',
      'A rubbed balloon may cling to a wall. Why can a wall with no added net charge attract it?',
    ),
    prediction: t(
      '带负电气球靠近中性墙面，墙靠近气球的一侧会呈现什么倾向？',
      'A negatively charged balloon approaches a neutral wall. What happens on the nearer side?',
    ),
    predictions: [
      t('局部更偏正电', 'A local positive tendency'),
      t('局部更偏负电', 'A local negative tendency'),
      t('中性意味着没有任何电荷', 'Neutral means no charges exist'),
    ],
    explore: t(
      '先观察近处未带电的气球，再用“摩擦模型”使它带负电，比较近处与远处。还可以换成正电，看墙两侧的正负偏差如何交换。前三种比较各按一次“记录观察”。',
      'Observe the uncharged balloon nearby, then use the rubbing model to make it negative. Compare near and far, recording each of these three cases. You can also try positive charge and see the wall regions swap.',
    ),
    concept: t(
      '物质中有正负电荷。中性表示总量平衡，不是没有电荷。带电气球靠近时，会让墙面内部的电荷分布或微小正负位移发生变化，叫极化。靠近气球的一侧呈现相反电性的偏差，较远处呈现同种偏差；近处的吸引可强于远处的排斥，产生净吸引。墙的总电荷仍可保持零。',
      'Matter contains positive and negative charges. Neutral means a balanced total, not no charges. A charged balloon can alter charge distribution or tiny positive/negative shifts inside the wall: polarization. The nearer region has an opposite-charge tendency and the farther region a like-charge tendency. Nearer attraction can outweigh farther repulsion, creating net attraction while the wall remains neutral overall.',
    ),
    example: t(
      '负电气球靠近：墙近处偏正、远处偏负，总体仍中性。正电气球靠近：近处偏负、远处偏正，也可吸引。模型的符号是区域偏差示意，不是每个正离子都能在墙里自由移动。',
      'With a negative balloon, the near wall region tends positive and the far region negative; the total stays neutral. A positive balloon reverses those tendencies and can also attract. Signs indicate regional tendencies, not freely moving positive ions in the wall.',
    ),
    misconception: t(
      '摩擦不是凭空创造电荷，通常是电荷在材料之间转移。能否实际贴住还取决于电荷量、表面、湿度与重量；吸向竖直墙面的电作用主要是横向的，接触后的摩擦等作用才能帮助支撑向下的重力。',
      'Rubbing does not create charge from nothing; charge typically transfers between materials. Real clinging depends on charge amount, surface, humidity and weight. Electric attraction toward a vertical wall is mainly horizontal; contact friction and other forces can help support downward weight.',
    ),
    realWorld: t(
      '脱毛衣时的细小噼啪声、塑料梳子吸引纸屑，都与电荷有关。纸屑本来中性也可被吸引；这与普通磁铁的磁作用是不同机制。',
      'Small crackles when removing a sweater and a plastic comb attracting paper scraps involve electric charge. Neutral paper can be attracted too; this differs from an ordinary magnet’s magnetic interaction.',
    ),
    summary: t(
      '中性物体也能极化并被带电物体吸引，总电荷不必改变。',
      'A neutral object can polarize and be attracted without changing its total charge.',
    ),
    homeExperiment: t(
      '用塑料梳子在干燥布上摩擦，再靠近几片纸屑，比较摩擦前后。记录没有明显吸引的情况，并考虑湿度或材料。不要靠近插座或电子设备，也不需要用气球来完成实验。',
      'Rub a plastic comb on a dry cloth and bring it near small paper scraps. Compare before and after. Record weak or absent attraction too and consider humidity or materials. Keep away from sockets and electronic devices; a balloon is not required.',
    ),
    vocabulary: [
      t('电荷', 'electric charge'),
      t('中性', 'neutral'),
      t('极化', 'polarization'),
      t('吸引', 'attraction'),
    ],
    questions: [
      q(
        '中性墙面意味着什么？',
        'What does a neutral wall mean?',
        [
          ['没有任何正负电荷', 'No positive or negative charges'],
          ['总正负电荷平衡', 'Positive and negative charges balance overall'],
        ],
        1,
        '中性说的是净电荷，内部仍有电荷。',
        'Neutral describes net charge; charges still exist inside.',
      ),
      q(
        '正电气球靠近，中性墙面的近处偏向什么？',
        'A positive balloon approaches. What is the near wall region’s tendency?',
        [
          ['偏负电', 'Negative'],
          ['偏正电', 'Positive'],
        ],
        0,
        '局部相反电性靠近，整体仍可保持中性。',
        'The opposite tendency is nearer while the overall wall can stay neutral.',
      ),
      q(
        '模型显示吸引，家里却没贴住。怎么记录更科学？',
        'The model shows attraction, but it does not cling at home. What is a scientific response?',
        [
          [
            '写“贴住了”，让结果和模型一样',
            'Write that it clung to match the model',
          ],
          [
            '如实记录，检查湿度、材料、电荷和重量',
            'Record honestly; examine humidity, materials, charge and weight',
          ],
        ],
        1,
        '模型有条件，真实结果是证据，不能为了符合预期而修改。',
        'Models have conditions. Real results are evidence and must not be altered to match expectations.',
      ),
    ],
    exit: q(
      '为什么这张横向吸引示意图不能直接保证气球留在竖直墙面？',
      'Why can this horizontal-attraction diagram not guarantee clinging to a vertical wall?',
      [
        [
          '还要考虑向下的重力与接触摩擦等作用',
          'Downward weight and contact friction also matter',
        ],
        ['它一定没有质量', 'The balloon must have no mass'],
      ],
      0,
      '贴住需要多方向的作用共同配合，图里只探索电荷造成的横向吸引。',
      'Clinging involves forces in multiple directions; the diagram explores only charge-related horizontal attraction.',
    ),
  },
  {
    id: 'why-seatbelts-matter',
    stage: 0,
    unit: 'mysteries',
    kind: 'seatbelt',
    minutes: 15,
    title: t(
      '车停了，身体为什么还想向前？',
      'Why does your body keep moving when the car stops?',
    ),
    subtitle: t(
      '用玩具模型认识惯性与减速作用。',
      'Explore inertia and slowing with a toy model.',
    ),
    hook: t(
      '乘车时突然减速，身体会有向前的趋势。是有一种“向前的神秘力”突然把你推出去了吗？',
      'When a vehicle slows suddenly, your body tends forward. Did a mysterious forward force suddenly appear?',
    ),
    prediction: t(
      '模型车开始刹车，未固定且忽略水平摩擦的乘客会怎样？',
      'A model vehicle starts braking. What happens to an unsecured passenger with horizontal friction neglected?',
    ),
    predictions: [
      t('自动和车一起减速', 'Automatically slows with the vehicle'),
      t(
        '继续原来的向前运动，直到受到作用',
        'Keeps moving forward until an interaction changes it',
      ),
      t('重力把人水平推出', 'Gravity pushes the person horizontally'),
    ],
    explore: t(
      '比较系带与未系带两次减速。看车与乘客的速率、相对位置。未系带模型在碰到车前端时停止观察，不模拟伤害或碰撞过程。',
      'Compare braking with and without the belt. Watch speeds and relative positions. The unsecured model stops observation at front contact; injury and collision are not simulated.',
    ),
    concept: t(
      '物体倾向于保持原来的静止或匀速直线运动状态，这叫惯性。车通过刹车等作用减速，不代表乘客也自动受到同样作用。安全带可给乘客向后的作用，让其与车一起减速。相对车看，未受水平减速作用的人继续向前，这不是额外向前力创造了运动。',
      'An object tends to retain rest or uniform straight-line motion: inertia. Braking slows the vehicle but does not automatically apply the same interaction to its passenger. A belt can exert a backward force, slowing the passenger with the vehicle. Relative to the slowing vehicle, an unsecured passenger moves forward; this motion is not created by an extra forward force.',
    ),
    example: t(
      '玩具模型开始都以 2 m/s 前进，车在 0.4 s 内减速到零。理想系带乘客也减速到零；忽略座椅摩擦的未系带乘客仍以 2 m/s 前进，最终接触前端。真实安全带会有伸长，车内也有其他接触作用，不能照搬模型距离。',
      'The toy model begins at 2 m/s and the vehicle stops in 0.4 s. An ideally restrained passenger also slows to zero. An unrestrained passenger with seat friction omitted keeps 2 m/s until reaching the front. Real belts stretch and other contacts matter; model distances are not real safety predictions.',
    ),
    misconception: t(
      '惯性不是一种额外的力，也不是刹车时才出现。匀速乘车时它也存在，只是不容易从相对位置看出来。安全带不是让人没有惯性，而是提供改变运动所需的作用。',
      'Inertia is not an additional force and does not appear only during braking. It also exists in steady travel, when relative position hides it. A belt does not remove inertia; it supplies an interaction that changes motion.',
    ),
    realWorld: t(
      '车内人和车一起运动时不容易察觉速度。减速、转弯时，改变运动需要作用。正常乘车使用合适且正确佩戴的约束装置；这一模型帮助解释原理，不给出安全速度或真实伤害计算。',
      'Shared motion can hide speed inside a vehicle. Slowing and turning require interactions to change motion. Use an appropriate, correctly worn restraint during ordinary travel. This model explains a principle and does not calculate real safe speeds or injuries.',
    ),
    summary: t(
      '车减速，人不会自动跟着减速；安全带提供改变乘客运动的作用。',
      'A slowing vehicle does not automatically slow its passenger; the belt provides an interaction to change passenger motion.',
    ),
    homeExperiment: t(
      '只用玩具：在低而平的桌面上，把小积木松放在玩具车上，轻轻推行，再让车遇到书本边缘。观察积木是否相对车移动。若没移动也记录，考虑摩擦或是否卡住。真人乘车只观察正常过程，不做突然刹车实验。',
      'Use toys only: loosely place a small block on a toy car on a low, level table, gently roll it toward a book edge and observe relative movement. If the block stays, record that and consider friction or trapping. In real vehicles, observe normal travel; do not conduct sudden-braking experiments.',
    ),
    vocabulary: [
      t('惯性', 'inertia'),
      t('减速', 'slowing down'),
      t('相对运动', 'relative motion'),
      t('约束', 'restraint'),
    ],
    questions: [
      q(
        '车减速而人继续向前，最关键的解释是？',
        'What best explains a person continuing forward while a vehicle slows?',
        [
          [
            '保持原运动，需要作用才能改变',
            'Motion persists unless an interaction changes it',
          ],
          ['突然出现神秘向前力', 'A mysterious forward force appears'],
        ],
        0,
        '在地面参考系中，原来的运动继续；相对车看才显得向前移动。',
        'In the ground frame, the original motion continues; it appears as forward relative motion inside the vehicle.',
      ),
      q(
        '安全带对减速乘客提供的主要水平作用朝哪里？',
        'Which way is the belt’s main horizontal interaction on a slowing passenger?',
        [
          ['向后，帮助减速', 'Backward, helping slow down'],
          ['向前，增加速率', 'Forward, increasing speed'],
        ],
        0,
        '乘客向前运动，要减速需向后的合力。这里先观察作用方向。',
        'Slowing forward motion requires a backward net force; here we observe its direction.',
      ),
      q(
        '真实玩具积木没滑动，是否证明模型原理错了？',
        'If a real toy block does not slide, does that disprove the principle?',
        [
          [
            '是，所有条件都一定与模型相同',
            'Yes; conditions must exactly match',
          ],
          [
            '不一定，摩擦或接触可能已经改变它的运动',
            'Not necessarily; friction or contact may already change its motion',
          ],
        ],
        1,
        '模型省略了水平摩擦；真实接触可能让积木与车一起减速。',
        'The model omits horizontal friction; real contact may slow the block with the vehicle.',
      ),
    ],
    exit: q(
      '匀速行驶时，乘客有没有惯性？',
      'Does a passenger have inertia during steady travel?',
      [
        ['有，惯性不是刹车才产生', 'Yes; inertia is not created by braking'],
        ['没有，刹车才出现', 'No; it appears only during braking'],
      ],
      0,
      '保持原运动状态的倾向一直存在，改变运动才让现象更明显。',
      'The tendency to retain motion is always present; changing motion makes it more visible.',
    ),
  },
];
