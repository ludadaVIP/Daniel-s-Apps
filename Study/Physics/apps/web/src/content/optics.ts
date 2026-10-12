import type { Lesson } from './schema';
import { makeWaveLesson } from './waveLessonFactory';
const make = (draft: Parameters<typeof makeWaveLesson>[0]) =>
  makeWaveLesson(draft, 'optics');
export const opticsLessons: Lesson[] = [
  make({
    id: 'optics-a-small-mirror-turn-a-large-ray-turn',
    kind: 'optics-reflection',
    minutes: 24,
    title: [
      '镜子只转一点，反射光为什么转得更多？',
      'Why does a small mirror turn swing the reflected ray farther?',
    ],
    subtitle: [
      '入射方向保持，用转动法线追踪出射方向。',
      'Hold the incoming direction and follow the rotating normal.',
    ],
    hook: [
      '你想把手电筒的光通过一面镜子送到墙上的记号。镜子稍稍转动，亮点却移了很远。不是镜子给光“加速”：它改变了方向。先把法线画出来，看看两侧的角怎样一起变化。',
      'You aim a torch via a mirror at a wall mark. A small mirror turn moves the spot a long way, because direction changes. Draw the normal first and watch both angles change with it.',
    ],
    prediction: [
      '入射方向固定，镜面转5°，反射方向的方位角改变量是多少？',
      'With a fixed incoming direction, a 5° mirror turn changes outgoing bearing by how much?',
    ],
    predictions: [
      ['5°', '5°'],
      ['10°', '10°'],
      ['0°', '0°'],
    ],
    explore: [
      '完整比较基准入射0°、30°、60°。法线为蓝虚线，镜面为紫线；两角都相对当前法线量。再自由把镜子从0°转到5°，同时读入射角、反射角和出射方位角。关系图保持各自基准入射方向，检验斜率是否为2。',
      'Complete base incidences 0°, 30° and 60°. Blue dashed is the normal, purple is the mirror; measure both angles from the current normal. Turn the mirror freely from 0° to 5°, reading incidence, reflection and outgoing bearing separately. At held incoming direction the bearing plot tests slope two.',
    ],
    concept: [
      '反射定律说入射角等于反射角，两个角都从入射点的法线量。镜面转动，法线跟着转；入射方向虽然固定，入射角已经改变，出射方向也要在新法线另一侧满足相同角。结果镜面转φ，出射方位转2φ。光线表示传播方向，动画是放慢的路径追踪，不是照相机拍到的光子。',
      'The reflection law equates angles measured from the local normal. Turning the mirror also turns that normal: fixed incoming direction does not mean fixed incidence angle. The outgoing direction must match the new angle on the other side. A mirror turn φ changes outgoing bearing by 2φ. Rays represent propagation directions; slowed cursors are not photographed photons.',
    ],
    example: [
      '基准30°、镜子不转：i=r=30°，出射方位30°。转φ=5°后，i=r=35°，出射方位40°，改了10°。与镜面的夹角原为60°，此时为55°；把它当入射角就会写错定律。负的方位角仅说明落在所选参考方向另一侧，不能读成负能量。',
      'At base 30° with no rotation: i=r=30°, outgoing bearing 30°. Rotate φ=5°: i=r=35° and bearing 40°, a 10° change. The angle to the surface changes from 60° to 55°; using it as incidence misstates the law. A negative bearing denotes the other side of a reference, not negative energy.',
    ],
    misconception: [
      '“光沿镜面反射”和“镜子转5°光也只转5°”都忽略了法线。粗糙白纸把光散向多种方向，但每个微小表面的局部反射仍按自己的法线；本台只用平整镜面，不把散射画成同一法线的随机反射。',
      'Light does not reflect along the mirror, nor does it turn by only the mirror’s rotation. White paper scatters into many directions because tiny surface regions have different normals; local reflection still follows each normal. This bench uses one smooth mirror.',
    ],
    realWorld: [
      '潜望镜、望远镜反光镜和扫描光束都靠方向控制。想移动接收点，先预测角度与距离怎样共同决定位置；没有必要把光束想成弹性绳。',
      'Periscopes, reflecting telescopes and beam scanners control direction. Predict how angle and receiver distance determine position without imagining light as an elastic cord.',
    ],
    summary: [
      '先随镜面重画法线；角相等，出射方位的变化却是镜面转角的两倍。',
      'Redraw the normal as the mirror turns; equal angles produce twice the mirror turn in outgoing bearing.',
    ],
    homeExperiment: [
      '把小镜子放在桌面，用普通手电筒把光反到纸上。轻转镜子，记录亮点移动趋势；不要照眼睛。再在纸上画固定入射方向、0°和5°两条法线，用量角器构造出射线。实际光斑较宽，别把斑宽当角度误差的唯一来源。',
      'Use a small tabletop mirror and ordinary torch to send light onto paper. Turn gently and record the spot trend, aiming away from eyes. Draw a fixed incoming direction with normals at 0° and 5° and construct outgoing rays. A broad spot is not the only source of measurement uncertainty.',
    ],
    vocabulary: [
      ['法线', 'normal'],
      ['入射角', 'incidence angle'],
      ['反射角', 'reflection angle'],
      ['方位角', 'bearing'],
    ],
    formula: [
      'i=r；固定入射方向时Δ方位=2Δφ',
      'i=r; fixed incoming direction gives Δbearing=2Δφ',
    ],
    questions: [
      [
        '反射角从哪里量？',
        'Where is reflection angle measured from?',
        [
          ['镜面', 'The mirror surface'],
          ['当前法线', 'The current normal'],
          ['屏幕左边', 'The screen’s left edge'],
        ],
        1,
        '法线垂直于入射点的镜面。',
        'The normal is perpendicular to the mirror at incidence.',
      ],
      [
        '固定入射方向，镜子转3°，出射转多少？',
        'Fixed incoming direction: mirror turns 3°. How far does outgoing bearing turn?',
        [
          ['6°', '6°'],
          ['3°', '3°'],
          ['1.5°', '1.5°'],
        ],
        0,
        '新法线和新反射角共同给出两倍变化。',
        'The changed normal and reflected angle give twice the rotation.',
      ],
      [
        '光图中的慢速圆点表示什么？',
        'What does the slow cursor represent?',
        [
          ['空气被光推着跑', 'Air running with the light'],
          [
            '真实光速只有几米每秒',
            'Actual light speed is a few metres per second',
          ],
          ['按模型放慢检查光路', 'A slowed model inspection of a ray'],
        ],
        2,
        '纳秒量级行程被拉长播放。',
        'Nanosecond travel is slowed for inspection.',
      ],
    ],
    exit: [
      '镜子转动后解释亮点位置，第一步是什么？',
      'After turning a mirror, what is the first step to explain the spot?',
      [
        [
          '重画镜面和法线，再量两角',
          'Redraw mirror and normal, then measure angles',
        ],
        ['保持旧法线不动', 'Keep the old normal'],
        ['把亮点移远说成光变快', 'Call a farther spot faster light'],
      ],
      0,
      '方向变化与传播速率分开。',
      'Separate direction changes from propagation speed.',
    ],
  }),
  make({
    id: 'optics-two-observers-one-virtual-image',
    kind: 'optics-mirror',
    minutes: 24,
    title: [
      '你换个位置，镜子里的物体也换地方了吗？',
      'Does a mirror image move when you change viewpoint?',
    ],
    subtitle: [
      '用两条真实反射光路，定位同一个虚像。',
      'Use two real reflected paths to locate one virtual image.',
    ],
    hook: [
      '你往上挪眼睛，还能在镜子里看见同一支笔。进入眼睛的光路变了，可那支镜后“笔”并没有任意跳到新位置。把到达不同观察点的光向后延长，它们为何指向同一个地方？',
      'Move your eye upward and you can still see the same pen in a mirror. Different rays enter your eye, yet the apparent pen does not jump arbitrarily. Why do backward extensions from different observers point to one place?',
    ],
    prediction: [
      '竖直平面镜和物体固定，只把观察点上下移动，理想虚像位置怎样？',
      'For a fixed object and vertical plane mirror, moving the observer up or down changes the ideal image position how?',
    ],
    predictions: [
      ['始终跟着眼睛走', 'Always follows the eye'],
      ['保持原位置', 'Stays fixed'],
      ['跑到镜面上', 'Moves onto the mirror'],
    ],
    explore: [
      '完整比较0.5、1、1.5 m物距。金色是物体，紫色是像，蓝点是两个观察点；实线从物体到镜子再到观察点，紫虚线只是向后延长。自由改变观察点高度，比较反射点移动与像点不动。任何追踪点都不应走到镜后。',
      'Complete object distances 0.5, 1 and 1.5 m. Gold is object, purple is image, blue are two observers. Solid rays go object→mirror→observer; purple dashed extensions point backward. Move observer height freely and compare changing reflection points with a stationary image. No tracing cursor travels behind the mirror.',
    ],
    concept: [
      '平面镜虚像位于物体关于镜面的对称位置：垂直像距等于垂直物距，尺寸保持。眼睛收到的是镜前实际反射光；把这些光的到达方向向后延长，才得到像的位置。虚像可以被眼睛或相机看到，但不能在像点放屏幕直接接到会聚光。观察点变了，需要另一处镜面反射，虚像位置仍由镜面与物体决定。',
      'A plane-mirror image is the object’s reflection across the mirror: perpendicular image and object distances are equal, with equal size. Eyes receive real reflected light in front. Backward direction extensions locate the apparent source. Eyes and cameras can see a virtual image, but a screen at that apparent point cannot collect converging rays. Viewpoint changes select other reflection points without moving the image.',
    ],
    example: [
      '物点在镜前1 m，像在镜后1 m，物与像间距2 m。本台物点高度0.4 m，观察点在镜前1.8 m、高度0 m，反射点约0.2571 m。观察点升到0.5 m，反射点约0.4357 m；像仍在镜后1 m、高0.4 m。两次真实行程约9.435与9.346 ns，不沿虚线再多走一段。',
      'With the object 1 m in front, the image is 1 m behind, separated by 2 m. Object height is 0.4 m and observer distance 1.8 m. At observer height 0, reflection occurs near 0.2571 m; at 0.5 m, near 0.4357 m. The image stays 1 m behind at height 0.4 m. Real journeys are about 9.435 and 9.346 ns; dashed extensions add no extra travel.',
    ],
    misconception: [
      '“虚像就是看不见的像”和“镜子里面真有光会聚”都不对。平面镜做的是前后方向的空间映射，常说的左右颠倒还涉及你怎样把自己转过去比较；本台不把所有方向都一律倒转。',
      'A virtual image is visible, and light does not actually converge behind this mirror. A plane mirror reverses the coordinate perpendicular to its surface; apparent left/right reversal also depends on how you turn yourself for comparison. It does not reverse every coordinate.',
    ],
    realWorld: [
      '浴室镜子、后视镜里的距离感和镜子照片，需要分清光路与像点。后视镜若是曲面镜，位置与大小规律会改变，不能拿本平面镜的等距关系直接预测。',
      'Bathroom mirrors, reflected photographs and distance perception require separating real paths from image points. Curved vehicle mirrors obey different image-distance and size rules from this plane mirror.',
    ],
    summary: [
      '物和镜子决定像；观察点选择真实光路。虚线定位，不传光。',
      'Object and mirror determine the image; observers select real paths. Dashed extensions locate, not carry light.',
    ],
    homeExperiment: [
      '把一个小物体放在平面镜前，分别从两个高度观察。画出物、镜和对称像点，再从两个眼睛位置连到像点，找镜面交点并画回物点。核对反射角；不要把镜后虚线算进光的行程。',
      'Observe a small object in a plane mirror from two heights. Draw object, mirror and symmetric image. Join each eye to the image to find mirror intersections, then connect those points to the object. Check reflection angles and exclude dashed extensions from travel distance.',
    ],
    vocabulary: [
      ['虚像', 'virtual image'],
      ['物距', 'object distance'],
      ['像距', 'image distance'],
      ['方向延长线', 'backward extension'],
    ],
    formula: [
      '平面镜dᵢ=d；像点为镜面对称点',
      'Plane mirror dᵢ=d; image is the mirror-symmetric point',
    ],
    questions: [
      [
        '物距1.5 m，物与像间距多少？',
        'At object distance 1.5 m, what is object–image separation?',
        [
          ['3 m', '3 m'],
          ['1.5 m', '1.5 m'],
          ['0 m', '0 m'],
        ],
        0,
        '物和像各在镜面两侧1.5 m。',
        'Object and image are each 1.5 m from opposite sides.',
      ],
      [
        '虚线后延长部分携带了光吗？',
        'Does the dashed backward extension carry light?',
        [
          ['携带全部光', 'It carries all light'],
          ['只携带一半', 'It carries half'],
          ['不，它表示看来的方向', 'No; it represents an apparent direction'],
        ],
        2,
        '真实光只走物→镜→观察点。',
        'Real light follows object→mirror→observer.',
      ],
      [
        '只移动观察点，什么可以改变？',
        'Moving only the observer can change what?',
        [
          ['像点由眼睛重新创造', 'The eye creates a new image point'],
          ['实际反射点和收到的光路', 'Reflection point and received path'],
          ['物距自动归零', 'Object distance becomes zero'],
        ],
        1,
        '固定镜面与物体的像不随观察点变。',
        'The image of a fixed object/mirror stays fixed.',
      ],
    ],
    exit: [
      '想判断镜后位置有没有真实会聚光，怎样推理？',
      'How can you tell whether real light converges behind the mirror?',
      [
        ['把虚线也当真实路线', 'Treat dashed lines as real routes'],
        ['只说虚像是幻想', 'Call a virtual image imaginary'],
        ['只追踪带方向的真实反射光', 'Trace only actual reflected rays'],
      ],
      2,
      '可见不代表光实际经过像点。',
      'Visibility does not mean light passes through the image point.',
    ],
  }),
  make({
    id: 'optics-a-boundary-changes-direction-and-speed',
    kind: 'optics-refraction',
    minutes: 24,
    title: [
      '同一束光进出玻璃，为什么转弯方向不同？',
      'Why does the same ray bend differently entering and leaving glass?',
    ],
    subtitle: [
      '从哪种介质到哪种介质，必须先说清楚。',
      'Name the incident and transmitting media first.',
    ],
    hook: [
      '水里的铅笔看起来折了一下，玻璃后的图案也会偏移。光不是在边界撞出了折痕，而是不同区域里的传播速度和相位条件改变了。把界面和法线画在图上，再比较进与出。',
      'A pencil in water looks bent, and patterns behind glass can shift. Light does not acquire a physical crease: speed and phase conditions differ between regions. Draw the interface and normal, then compare entering and leaving.',
    ],
    prediction: [
      '空气进入玻璃，斜入射时透射光向哪边转？',
      'At oblique entry from air into glass, how does the transmitted ray bend?',
    ],
    predictions: [
      ['靠近法线', 'Toward the normal'],
      ['远离法线', 'Away from the normal'],
      ['频率一定减半', 'Frequency must halve'],
    ],
    explore: [
      '完整比较空气→玻璃、玻璃→空气、空气→水，保持入射角30°。上方是介质1，下方是2；角相对竖直法线量。自由设0°，检查方向没转时是否仍有速度改变。工作台只追踪透射方向，没有把省略的反射分支算成零能量。',
      'Complete air→glass, glass→air and air→water at incidence 30°. Medium 1 is above and 2 below; angles use the vertical normal. Set free incidence to 0° and ask whether speed can change without bending. Only the transmitted direction is traced; omitted reflection is not zero reflected energy.',
    ],
    concept: [
      '折射率n=c₀/v描述相速度相对真空的变化。在本无色散模型里，脉冲速度也等于v。进入更高n区域，斜入射向法线靠近；进入更低n区域，远离法线。频率由同一稳定光源保持，波长随v改变。折射需要同时考虑原介质与新介质，不能只记一句“玻璃会让光靠法线”。',
      'Refractive index n=c₀/v compares phase speed with vacuum. Here nondispersive pulse speed also equals v. Oblique entry into higher n bends toward the normal; entry into lower n bends away. A common steady source maintains frequency while wavelength changes with speed. Refraction depends on both media, not merely on the name glass.',
    ],
    example: [
      '空气1→玻璃1.5，i=30°给r≈19.471°；玻璃1.5→空气1给r≈48.590°；空气1→水1.333给r≈22.030°。三个i都是30°。垂直入射i=0时r=0，方向不转，但n=1.5材料中速度仍是真空的2/3。',
      'Air 1→glass 1.5 at i=30° gives r≈19.471°. Glass 1.5→air 1 gives r≈48.590°; air 1→water 1.333 gives r≈22.030°. Incidence is 30° in every case. At normal incidence i=r=0, direction stays straight but speed in n=1.5 remains two-thirds of vacuum speed.',
    ],
    misconception: [
      '“看到铅笔弯了，铅笔真的弯了”把像与物混了。“速度变一定方向变”忘了垂直入射。“从玻璃出来永远有折射线”也有边界：大角度会达到临界条件，下一课组继续检验。',
      'A bent-looking pencil need not be physically bent. A speed change need not turn the ray at normal incidence. Light leaving glass does not always have a propagating transmitted direction: sufficiently large angles reach a critical condition explored next.',
    ],
    realWorld: [
      '透明容器、眼镜镜片和水下观看都受折射影响。看到的方向是到眼睛的光向后延长的方向；想夹住水里的物体，要分清真实位置和看来位置，具体深度关系还依赖视角。',
      'Transparent containers, spectacle lenses and underwater viewing involve refraction. Apparent direction comes from backward extensions of rays reaching the eye. Real and apparent positions differ, with depth relations depending on viewing angle.',
    ],
    summary: [
      '先写n₁→n₂，再从法线比较i与r；方向、速率和频率分开。',
      'Write n₁→n₂ first, then compare i and r from the normal; separate direction, speed and frequency.',
    ],
    homeExperiment: [
      '把铅笔放进透明杯水中，从侧上方观察看来的折点，换一个视角再看。画界面、法线和一条到眼睛的光路。不要仅凭折点位置给真实深度下精确结论；杯壁也会折射，记录这个额外条件。',
      'Observe a pencil in a clear cup of water from two oblique views. Draw interface, normal and a ray to the eye. Do not infer exact depth from the apparent bend alone; record cup-wall refraction as an extra condition.',
    ],
    vocabulary: [
      ['折射', 'refraction'],
      ['折射率', 'refractive index'],
      ['相速度', 'phase speed'],
      ['垂直入射', 'normal incidence'],
    ],
    formula: ['n₁sin i=n₂sin r；v=c₀/n', 'n₁sin i=n₂sin r; v=c₀/n'],
    questions: [
      [
        '玻璃到空气且存在透射，斜光向哪转？',
        'From glass to air with transmission, how does an oblique ray bend?',
        [
          ['靠近法线', 'Toward the normal'],
          ['固定向左', 'Always left'],
          ['远离法线', 'Away from the normal'],
        ],
        2,
        '从更高n到更低n，r大于i。',
        'From higher to lower n, r exceeds i.',
      ],
      [
        '垂直进入更高n，哪个量可变？',
        'On normal entry into higher n, which can change?',
        [
          ['入射角必须变90°', 'Incidence must become 90°'],
          ['传播速度与波长', 'Speed and wavelength'],
          ['光源频率自动归零', 'Source frequency becomes zero'],
        ],
        1,
        '方向不转不意味着介质速度相同。',
        'An unchanged direction does not mean unchanged speed.',
      ],
      [
        '为什么不能只说“玻璃让光靠法线”？',
        'Why not simply say “glass bends light toward normal”?',
        [
          [
            '还要说明从哪种介质进入哪种介质',
            'Both incident and transmitting media matter',
          ],
          ['角不能测量', 'Angles cannot be measured'],
          ['法线一定是水平', 'The normal is always horizontal'],
        ],
        0,
        '进玻璃与出玻璃的比较不同。',
        'Entering and leaving glass differ.',
      ],
    ],
    exit: [
      '看见水中铅笔“折了”，解释时优先追踪什么？',
      'For a bent-looking pencil in water, trace what first?',
      [
        ['铅笔凭空多出一段', 'A newly created pencil segment'],
        [
          '界面两侧到眼睛的真实光路',
          'The actual ray across the boundary to the eye',
        ],
        ['眼睛发出的探测光', 'Sight rays emitted by the eye'],
      ],
      1,
      '光路改变解释看来的方向。',
      'A changed ray path explains the apparent direction.',
    ],
  }),
  make({
    id: 'optics-sines-reveal-the-rule',
    kind: 'optics-snell',
    minutes: 24,
    title: [
      '角度不成正比，怎样从折射数据找规律？',
      'How can refraction reveal a rule when angles are not proportional?',
    ],
    subtitle: [
      '把角换成正弦，再让一条直线说话。',
      'Transform angles to sines and let a straight line reveal the relation.',
    ],
    hook: [
      '把入射角加大一倍，折射角不一定正好加倍。数据似乎不听话，可换一种表达，规律就清楚了。你已经用过把速度平方画成直线；这次用直角三角形里的正弦，把折射角变成可比较的比值。',
      'Doubling incidence need not exactly double refraction. Changing how the data are expressed reveals a cleaner rule, much like earlier squared-variable graphs. Use the sine from a right triangle to compare refracted directions.',
    ],
    prediction: [
      '空气进入材料，哪组比值在固定材料下应保持？',
      'For air entering a fixed material, which ratio stays constant?',
    ],
    predictions: [
      ['i/r永远等于n₂', 'i/r always equals n₂'],
      [
        'sin i/sin r等于n₂（非零角）',
        'sin i/sin r equals n₂ at nonzero angles',
      ],
      ['i+r永远90°', 'i+r always equals 90°'],
    ],
    explore: [
      '完整比较n₂=1.333、1.5、2，n₁=1、i=45°固定。读两角和反推出的n₂。再自由改变i，看sin r对sin i的图线是不是经过原点、斜率怎样变化。设i=0时，两角都0，反推读数留空：别把0/0写成1。',
      'Complete n₂=1.333, 1.5 and 2 with n₁=1 and i=45°. Read angles and the inferred n₂. Vary i freely and inspect the origin-passing sin r versus sin i line and its slope. At i=0, both angles are zero and inferred index stays empty; 0/0 is not one.',
    ],
    concept: [
      '平面界面两侧，稳定波的频率保持，沿界面的相位要连续，给出n₁sin i=n₂sin r。若n₁已知、两角非零，就可由n₂=n₁sin i/sin r反推材料的折射率。在空气进入固定材料的正弦图里，sin r=(1/n₂)sin i；更高n₂的斜率更小。这个变换比把角度当成线性比例更可靠。',
      'A steady wave keeps frequency across a planar boundary, and tangential phase continuity gives n₁sin i=n₂sin r. Known n₁ and nonzero measured angles allow n₂=n₁sin i/sin r. For air into a fixed material, sin r=(1/n₂)sin i: higher n₂ means smaller slope. This transformation is more reliable than assuming proportional angles.',
    ],
    example: [
      'i=45°时sin i≈0.7071。n₂=1.5给sin r≈0.4714，r≈28.126°，正弦比恰是1.5；直接45/28.126≈1.600，并不是折射率。n₂=2时r≈20.705°，正弦比是2，角度比却约2.173。',
      'At i=45°, sin i≈0.7071. For n₂=1.5, sin r≈0.4714 and r≈28.126°. The sine ratio is 1.5, while 45/28.126≈1.600 is not the index. For n₂=2, r≈20.705° and sine ratio two, while angle ratio is about 2.173.',
    ],
    misconception: [
      '“公式写了sin，可以省掉sin”改变了关系。小角度近似也要说明范围，不能拿它替代所有角。只在垂直方向看见一条直线，不足以测出n；需要非零角或独立的速度/行时信息。',
      'Removing sine changes the law. Small-angle approximations need a stated domain and cannot replace all angles. A straight normal-incidence direction alone cannot identify n; use nonzero angles or independent speed/transit information.',
    ],
    realWorld: [
      '设计棱镜、测透明材料和制作镜片时，要用有条件的关系预测方向。多次实验的角读数、介质与光颜色都应记录；真实材料的n还会随频率变化。',
      'Prism design, material measurement and lenses use conditional direction rules. Record repeated angles, media and light colour; actual material indices can vary with frequency.',
    ],
    summary: [
      '规律藏在n sinθ，不是裸角度比；垂直入射不给角度反推n的证据。',
      'The rule uses n sinθ, not bare angle ratios; normal incidence cannot infer n from angles alone.',
    ],
    homeExperiment: [
      '在纸上列i=15°、30°、45°，选n₁=1、n₂=1.5算r。用计算器分别算sin i和sin r，把数据画在正弦坐标图。检查比值与斜率，另记量角器可能有的读数误差。',
      'Make a table for i=15°, 30° and 45° with n₁=1, n₂=1.5. Calculate r and both sines, then plot sine coordinates. Check ratio and slope and note possible protractor reading errors.',
    ],
    vocabulary: [
      ['斯涅尔定律', 'Snell’s law'],
      ['正弦', 'sine'],
      ['反推', 'inference'],
      ['斜率', 'gradient'],
    ],
    formula: [
      'n₂=n₁ sin i/sin r（非零角）；sin r图线斜率n₁/n₂',
      'n₂=n₁ sin i/sin r at nonzero angles; sine-plot slope n₁/n₂',
    ],
    questions: [
      [
        'n₁=1、sin i=0.6、sin r=0.4，n₂是多少？',
        'n₁=1, sin i=0.6 and sin r=0.4. What is n₂?',
        [
          ['0.24', '0.24'],
          ['1.5', '1.5'],
          ['0.2', '0.2'],
        ],
        1,
        '比值0.6/0.4=1.5。',
        'The ratio is 0.6/0.4=1.5.',
      ],
      [
        'i=r=0，能只靠两角反推n₂吗？',
        'At i=r=0, can these angles alone infer n₂?',
        [
          ['能，0/0=1', 'Yes: 0/0=1'],
          ['能，n₂=0', 'Yes: n₂=0'],
          ['不能，比值未定义', 'No; the ratio is undefined'],
        ],
        2,
        '许多折射率在垂直入射时都不转向。',
        'Many different indices produce straight normal entry.',
      ],
      [
        '固定n₁=1，提高n₂，正弦图斜率怎样？',
        'At fixed n₁=1, raising n₂ changes the sine-plot slope how?',
        [
          ['减小', 'Decreases'],
          ['增大', 'Increases'],
          ['永远等于角度比', 'Always equals the angle ratio'],
        ],
        0,
        '斜率是1/n₂。',
        'The slope is 1/n₂.',
      ],
    ],
    exit: [
      '一组角度数据不在直线上，先怎样寻找折射规律？',
      'Angle data are not on a straight line. How should you seek the refraction rule?',
      [
        ['把所有角改成一样', 'Change every angle to the same number'],
        ['删掉非线性数据', 'Delete nonlinear data'],
        [
          '保留原角，换成正弦坐标检验',
          'Keep original angles and test sine coordinates',
        ],
      ],
      2,
      '变量变换应保留证据和物理条件。',
      'Transform variables while retaining evidence and conditions.',
    ],
  }),
  make({
    id: 'optics-a-straight-path-can-still-take-longer',
    kind: 'optics-index',
    minutes: 24,
    title: [
      '光路没有转弯，穿过玻璃也会多用时间吗？',
      'Can a straight ray still take longer through glass?',
    ],
    subtitle: [
      '方向不变时，用行时与波长认识折射率。',
      'Use transit time and wavelength when direction stays fixed.',
    ],
    hook: [
      '一束光正对着玻璃进去，出来方向还是直的。没有“折”一下，难道折射率没有作用？方向只是一个读数；同样长度里需要多久、同一节奏在空间里有多密，也能留下介质的线索。',
      'A ray enters glass normally and leaves straight. Does no visible bend mean index has no effect? Direction is only one reading. Transit through the same length and spatial repetition at one frequency also reveal the medium.',
    ],
    prediction: [
      '相同长度、法向进入n=1.5材料，比真空段用时怎样？',
      'For equal length at normal entry, how does transit through n=1.5 compare with vacuum?',
    ],
    predictions: [
      ['相同', 'The same'],
      ['更短', 'Shorter'],
      ['1.5倍', '1.5 times as long'],
    ],
    explore: [
      '完整比较n=1、1.333、1.5，材料长度0.3 m固定。路径尺用米，波长条用纳米，两种尺不能混。读速度、波长和额外延迟，再自由改变L。源的真空波长600 nm不变，材料内频率保持；看见光点变慢是经过放慢的模型，不是直接观测真实光速。',
      'Complete n=1, 1.333 and 1.5 with slab length 0.3 m. Ray space uses metres and wavelength bars nanometres: do not mix scales. Read speed, wavelength and extra delay, then vary L. Vacuum source wavelength stays 600 nm and frequency is unchanged. Slower cursor motion is a model, not direct observation of actual light speed.',
    ],
    concept: [
      'n=c₀/v，所以同一长度L的材料行时为nL/c₀，比同长真空多(n−1)L/c₀。源频率保持，v=fλ给λ=λ₀/n。折射率不是密度的另一种单位，不能从材料“比较重”直接算n。这里假定没有色散与吸收，因此脉冲行时可用同一速度；实际频率相关材料需要分清相速度与群速度。',
      'n=c₀/v gives slab transit nL/c₀ and extra delay (n−1)L/c₀ over equal vacuum length. With held source frequency, v=fλ gives λ=λ₀/n. Index is not a density unit and cannot be calculated simply from heavier material. This model is nondispersive and lossless, so one speed describes pulse timing; real dispersive materials distinguish phase and group speeds.',
    ],
    example: [
      'L=0.3 m，真空段约1.0007 ns；n=1.333段约1.3339 ns；n=1.5段约1.5010 ns。n=1.5的额外延迟约0.5003 ns，波长从600缩到400 nm，频率仍约4.997×10¹⁴ Hz。此台忽略界面反射；改变时长不等于光能被“吃掉”。',
      'At L=0.3 m, vacuum transit is about 1.0007 ns, n=1.333 about 1.3339 ns and n=1.5 about 1.5010 ns. For n=1.5, extra delay is about 0.5003 ns and wavelength shrinks from 600 to 400 nm, with frequency near 4.997×10¹⁴ Hz. Boundary reflections are omitted; a delay is not absorbed energy.',
    ],
    misconception: [
      '“进材料频率变小，所以慢了”把波源与介质混淆。“光在材料里比真空慢，所以出了材料仍慢”也不对：到新的均匀区域要用那里的传播条件。0.5 ns需要专门仪器，不用本动画当秒表测出来。',
      'A slower material speed does not come from lowering source frequency. Leaving that material requires the new medium’s propagation conditions. Measuring a 0.5 ns delay requires suitable equipment; this animation is not a real stopwatch measurement.',
    ],
    realWorld: [
      '光学延迟、干涉仪与透明材料测试都关心光程nL。手机镜片与光纤也依赖折射率，但几何和波动的具体用途不同；下一步继续用n来判断界面有没有透射方向。',
      'Optical delays, interferometers and material tests use optical path nL. Phone lenses and fibres also depend on index through different geometries and wave effects. Next use n to judge whether a transmitting direction exists.',
    ],
    summary: [
      '直着走也能有速度和波长变化；折射率把同长行时与源节奏连起来。',
      'Straight travel can still change speed and wavelength; index connects equal-length timing with source frequency.',
    ],
    homeExperiment: [
      '在纸上画一条0.3 m真空段与同长n=1.5材料段，分别写v、t、λ和f。把长度改成0.6 m，预测哪些量翻倍、哪些不变。无需尝试用手机录像测光速。',
      'Draw equal 0.3 m vacuum and n=1.5 segments, labelling v, t, λ and f. Change length to 0.6 m and predict which double and which stay fixed. No phone video speed-of-light measurement is needed.',
    ],
    vocabulary: [
      ['光程', 'optical path length'],
      ['纳秒', 'nanosecond'],
      ['源频率', 'source frequency'],
      ['色散', 'dispersion'],
    ],
    formula: ['v=c₀/n；λ=λ₀/n；Δt=(n−1)L/c₀', 'v=c₀/n; λ=λ₀/n; Δt=(n−1)L/c₀'],
    questions: [
      [
        'n=1.5、λ₀=600 nm，材料波长是多少？',
        'At n=1.5 and λ₀=600 nm, what is material wavelength?',
        [
          ['400 nm', '400 nm'],
          ['900 nm', '900 nm'],
          ['600 nm', '600 nm'],
        ],
        0,
        '同频率下速度与波长都为真空的2/3。',
        'At held frequency, speed and wavelength are two-thirds of vacuum values.',
      ],
      [
        '只把材料段加长一倍，哪项翻倍？',
        'Doubling only slab length doubles what?',
        [
          ['源频率', 'Source frequency'],
          ['材料段行时与额外延迟', 'Slab transit time and extra delay'],
          ['材料n', 'Material n'],
        ],
        1,
        '同材料行时与长度成正比。',
        'Transit is proportional to length in the same material.',
      ],
      [
        '本模型跨界面保持哪个量？',
        'Which remains fixed across boundaries here?',
        [
          ['波长', 'Wavelength'],
          ['每段速度', 'Speed in every segment'],
          ['光源频率', 'Source frequency'],
        ],
        2,
        '空间重复间隔调整，时间节奏保持。',
        'Spatial repetition changes while temporal rhythm stays fixed.',
      ],
    ],
    exit: [
      '光线没有转弯，怎样继续寻找材料线索？',
      'If a ray stays straight, how can you still investigate the material?',
      [
        [
          '比较同长行时与波长，说明模型条件',
          'Compare equal-length timing and wavelength with model conditions',
        ],
        ['断言折射率为1', 'Conclude n=1'],
        ['把图上像素当纳米', 'Treat ray pixels as nanometres'],
      ],
      0,
      '方向不变并不排除速度变化。',
      'An unchanged direction does not exclude a speed change.',
    ],
  }),
  make({
    id: 'optics-the-last-transmitted-direction',
    kind: 'optics-critical',
    minutes: 24,
    title: [
      '从水下向上看，什么时候界面像一面镜子？',
      'When can a surface look like a mirror from underwater?',
    ],
    subtitle: [
      '临界角是边界；超过它才没有传播折射线。',
      'The critical angle is a boundary beyond which no transmitted ray propagates.',
    ],
    hook: [
      '你在水里向不同方向看水面，某些方向看见外面，另一些更像镜面。不是水突然镀了银，而是从高折射率向低折射率去的光，到某个角后没有可用的传播折射方向。先用玻璃→空气的清楚数字观察这个边界。',
      'From underwater, some views through the surface reveal the outside and others look mirror-like. No silver coating appeared: beyond an angle from higher to lower index, no propagating transmitted direction remains. Glass→air gives clear numbers for studying this boundary.',
    ],
    prediction: [
      'n₁=1.5→n₂=1，大于临界角时，会有怎样的传播光路？',
      'For n₁=1.5→n₂=1 above critical angle, what propagating path remains?',
    ],
    predictions: [
      ['继续向第二介质折射', 'Continues refracting into medium 2'],
      ['只留下反射传播光路', 'Only the reflected propagating path'],
      ['全部光能消失', 'All light energy disappears'],
    ],
    explore: [
      '完整比较30°、精确临界角、60°。第二图只到r=90°，大角度时不要把一个90°点假装成折射读数。第三图比较R与T，检查R+T=1；临界方向用虚线，法向透射能量为零。自由角滑块允许精确临界值，避免把41.8103°悄悄取整成40°。',
      'Complete 30°, the exact critical angle and 60°. The direction plot ends at r=90°; above criticality do not invent a 90° transmitted reading. Compare R and T with R+T=1. The critical grazing construction is dashed and normal transmitted energy is zero. The free slider accepts the exact critical value rather than rounding 41.8103° to 40°.',
    ],
    concept: [
      '当n₁>n₂，sin r=(n₁/n₂)sin i会随i增加。r达到90°时定义θ_c=asin(n₂/n₁)；再增加i，公式要求sin r>1，没有实数传播方向，于是全反射。小于临界角通常同时有反射与透射，不是“尚未反射”。临界点是掠射极限；全反射时仍有界面附近的倏逝场，几何光线模型没有把它画成远处传播线。',
      'For n₁>n₂, sin r=(n₁/n₂)sin i increases with i. At r=90° the boundary is θ_c=asin(n₂/n₁). Above it, sin r would exceed one, so no real transmitting direction exists: total internal reflection. Below criticality reflection and transmission generally coexist. Equality is the grazing limit; TIR still has a near-boundary evanescent field, absent from this geometric ray model.',
    ],
    example: [
      '玻璃1.5→空气1的临界角约41.8103°。30°给r≈48.590°，无偏振反射能量比例约0.0552，其余透射；临界点r=90°，法向T→0；60°大于临界角，没有传播r，R=1。空气→玻璃不会出现同样的临界条件，因为n₁不比n₂大。',
      'For glass 1.5→air 1, θ_c≈41.8103°. At 30°, r≈48.590° and unpolarized reflected fraction is about 0.0552, with the remainder transmitted. At criticality r=90° and normal T tends to zero. At 60°, no propagating r exists and R=1. Air→glass lacks this critical condition because n₁ is not greater than n₂.',
    ],
    misconception: [
      '“全反射把能量吸收了”与R=1矛盾；反射回去仍有能量。“任何介质、任何方向的大角都全反射”也不对，要先确认n₁>n₂。动画省略倏逝场，不等于边界外电磁场处处为零。',
      'TIR is not absorption: R=1 returns energy. Large angles do not guarantee TIR in every medium/direction; first check n₁>n₂. Omitting evanescent fields does not say the electromagnetic field outside is zero everywhere.',
    ],
    realWorld: [
      '棱镜转光、透明液体表面的镜面效果和光导都用到全反射。真实材料若吸收、表面粗糙或外部物体靠得很近，简单无损界面模型会有不同限制。',
      'Prisms redirecting light, mirror-like liquid surfaces and light guides use TIR. Absorption, roughness and a very close external object introduce limits beyond this ideal lossless interface.',
    ],
    summary: [
      '先检查高n→低n，再比较i与θ_c；消失的是传播折射方向，不是能量。',
      'Check higher→lower n, then compare i with θ_c; the transmitted propagation direction vanishes, not the energy.',
    ],
    homeExperiment: [
      '在纸上给玻璃→空气画30°、θ_c和60°三组图，标R、T与法线。再把介质顺序反过来，解释为什么没有同样的临界角。可用透明水杯观察侧面某些反光变化；杯壁会增加界面，不当精确角度验证。',
      'Draw glass→air at 30°, θ_c and 60°, labelling normal, R and T. Reverse the media and explain the missing critical condition. Observe changing reflections on a clear water cup, recording its extra wall boundaries rather than claiming exact angle verification.',
    ],
    vocabulary: [
      ['临界角', 'critical angle'],
      ['全反射', 'total internal reflection'],
      ['掠射', 'grazing'],
      ['倏逝场', 'evanescent field'],
    ],
    formula: [
      'n₁>n₂：sinθ_c=n₂/n₁；i>θ_c全反射',
      'For n₁>n₂: sinθ_c=n₂/n₁; TIR when i>θ_c',
    ],
    questions: [
      [
        '哪种顺序可能有全反射？',
        'Which order can allow TIR?',
        [
          ['高n→低n', 'Higher n→lower n'],
          ['低n→高n总是', 'Lower→higher always'],
          ['只看颜色', 'Only colour matters'],
        ],
        0,
        '先满足折射率顺序，再检查角。',
        'Check index order before angle.',
      ],
      [
        '本模型60°时传播r应怎样显示？',
        'At 60° here, how should propagating r be shown?',
        [
          ['90°', '90°'],
          ['不存在，用空读数', 'Absent, with no reading'],
          ['0°', '0°'],
        ],
        1,
        '大于临界角，不是继续沿界面传播。',
        'Above criticality does not mean continued propagation along the surface.',
      ],
      [
        '无损全反射时能量去哪了？',
        'Where does energy go during lossless TIR?',
        [
          ['被界面全部吸收', 'All absorbed by the interface'],
          ['变成负值', 'Becomes negative'],
          ['返回原介质，R=1', 'Returns to the incident medium, R=1'],
        ],
        2,
        '反射与吸收分开记账。',
        'Reflection and absorption are separate transfers.',
      ],
    ],
    exit: [
      '要解释某透明界面为何“像镜子”，应先查什么？',
      'To explain why a transparent boundary looks mirror-like, what should you check?',
      [
        ['直接认为镀银', 'Assume silver coating'],
        ['把无透射算成无能量', 'Treat no transmission as no energy'],
        [
          '介质顺序、入射角和临界条件',
          'Media order, incidence and critical condition',
        ],
      ],
      2,
      '条件与能量账共同支持解释。',
      'Conditions and the energy ledger support the explanation.',
    ],
  }),
  make({
    id: 'optics-keep-the-core-and-leakage-in-one-ledger',
    kind: 'optics-fibre',
    minutes: 24,
    title: [
      '透明光纤怎样把光留在芯里？',
      'How does a transparent fibre keep light in its core?',
    ],
    subtitle: [
      '从芯内角度到包层漏光，把每次分流记完整。',
      'Connect internal angles with cladding leakage and account for every split.',
    ],
    hook: [
      '网线旁有些细线用光传信号。它们不是里面镀满小镜子的水管：透明芯与透明包层的折射率差，就能让某些方向的光不断返回芯内。换个角度，光又会漏进包层。',
      'Some communication lines carry light. They are not tubes lined with tiny silver mirrors: transparent core and cladding indices can return certain directions to the core repeatedly. Other directions leak into the cladding.',
    ],
    prediction: [
      '侧壁同样透明，哪种条件更能让光在芯内传播？',
      'With transparent side walls, which condition best keeps light in the core?',
    ],
    predictions: [
      ['任意方向都会被银镜反回', 'Every direction meets a silver mirror'],
      [
        '芯内每次碰壁都满足全反射',
        'Each core-wall hit meets the TIR condition',
      ],
      ['包层必须是真空', 'Cladding must be vacuum'],
    ],
    explore: [
      '完整比较芯内轴向角0°、12°、30°，芯1.5、包层1.45保持。0°不碰壁；12°碰壁并全反射；30°每次会分出漏光。紫支路进入包层，第三图把仍在芯内和已离开的能量加到1。自由改变α，注意它从光导轴量，壁入射角却从法线量。',
      'Complete internal axial angles 0°, 12° and 30° with core 1.5 and cladding 1.45. At 0° no wall is hit; 12° reflects totally; 30° splits off leakage. Purple branches enter cladding; the ledger adds energy in the core and escaped energy to one. Free α is from the guide axis, while wall incidence is from the normal.',
    ],
    concept: [
      '芯的n比包层略高，从芯到包层存在临界角。侧壁入射i=90°−α；i足够大时全反射，所以较小芯内α能导光。包层可以也是玻璃，不需要是空气。本台用直的二维放大截面演示，不预测真实光纤尺寸、模态、弯曲损耗或外部接受角。漏出的能量进入包层，不算作消失；后续反射保留量还受偏振影响，模型分别记账。',
      'A slightly higher core index creates a critical angle toward cladding. Wall incidence i=90°−α: sufficiently large i gives TIR, so smaller internal α can guide light. Cladding can also be glass. This enlarged straight 2D model does not predict real dimensions, modes, bending loss or the external acceptance angle. Leakage enters cladding rather than vanishing; later retained fractions also depend on polarization, which the model tracks separately.',
    ],
    example: [
      '芯1.5、包层1.45，侧壁临界角约75.165°，内部轴向限角约14.835°。12°给i=78°，本4 cm芯中碰壁一次，能量全部保留。30°给i=60°，碰壁四次，有很小一部分到芯末端，主要进入包层。0°保留全部但没有反射，不能据此声称它已经满足了四次全反射。',
      'For core 1.5 and cladding 1.45, the wall critical angle is about 75.165° and internal axial limit about 14.835°. At 12°, i=78° and one wall hit in this 4 cm core retains all energy. At 30°, i=60° and four hits leave a tiny core-exit fraction, with most energy entering cladding. At 0°, all is retained without reflection; it does not demonstrate four TIR events.',
    ],
    misconception: [
      '“不漏光就一定发生了反射”忽略了没有碰壁的路径。“内部轴向角等于外部入射角”忽略了入口折射。“看不见某条很弱的支路，能量就没了”也不对；图中亮度和线宽不校准功率，要读能量账。',
      'Retaining all light does not prove reflection if no wall is hit. Internal axial angle differs from external launch angle because entry refracts. An invisible weak branch is not missing energy; line width and brightness are not calibrated power readings, so use the ledger.',
    ],
    realWorld: [
      '光纤通信、照明导光和内窥镜的光学传输，需要匹配材料与入射条件。真实光纤弯得太急会改变传播条件，本台没有模拟弯曲，不能把直光导的角限制当成真实设备弯曲规格。',
      'Fibre communication, light guides and optical transmission in endoscopes require matched materials and launch conditions. Tight bends change propagation; this straight guide does not provide real-device bend specifications.',
    ],
    summary: [
      '导光来自折射率和角条件；芯内保留与包层漏出共同守恒。',
      'Guidance depends on indices and angles; core retention plus cladding leakage conserves energy.',
    ],
    homeExperiment: [
      '在纸上画一个透明芯截面，用0°、12°、30°三条线找到第一处侧壁交点。画法线，换算i=90°−α，再与75.165°比较。用不同颜色记返回与漏出；无需拆解通信光纤或用激光照眼睛。',
      'Draw a transparent core and launch rays at 0°, 12° and 30°. Locate the first wall hit, draw its normal and compare i=90°−α with 75.165°. Use different colours for retained and escaped energy. No fibre dismantling or eye-directed laser is needed.',
    ],
    vocabulary: [
      ['纤芯', 'core'],
      ['包层', 'cladding'],
      ['轴向角', 'axial angle'],
      ['漏光', 'leakage'],
    ],
    formula: [
      '侧壁i=90°−α；芯内限角α<90°−asin(n_clad/n_core)',
      'Wall i=90°−α; internal TIR range α<90°−asin(n_clad/n_core)',
    ],
    questions: [
      [
        '本芯内α=12°，侧壁入射角多少？',
        'At internal α=12°, what is wall incidence?',
        [
          ['12°', '12°'],
          ['90°', '90°'],
          ['78°', '78°'],
        ],
        2,
        '轴向与侧壁法线垂直。',
        'The axis is perpendicular to the wall normal.',
      ],
      [
        '0°轴向直行保留全部能量，说明什么？',
        'All energy stays for a 0° axial ray. What does this demonstrate?',
        [
          [
            '本路径不碰壁，不需要反射',
            'This path hits no wall and needs no reflection',
          ],
          ['已发生无限次反射', 'Infinite reflections occurred'],
          ['包层是银镜', 'Cladding is silver'],
        ],
        0,
        '区分没有分流与发生全反射。',
        'Distinguish no splitting from TIR.',
      ],
      [
        '漏进包层的光应算在哪里？',
        'How should light leaking into cladding be counted?',
        [
          ['从总账删掉', 'Delete it from the total'],
          ['计入离开芯的能量', 'Count energy escaped from the core'],
          ['算成负能量', 'Count negative energy'],
        ],
        1,
        '芯内减少与包层增加一起记。',
        'Record core decrease and cladding increase together.',
      ],
    ],
    exit: [
      '光导传输变弱时，该怎样先检查模型解释？',
      'When guide transmission weakens, how should you investigate the mechanism?',
      [
        ['把所有弱光直接算吸收', 'Call every weak signal absorption'],
        ['只数画了几条线', 'Only count drawn lines'],
        [
          '检查角、折射率与各去向能量',
          'Check angle, indices and energy destinations',
        ],
      ],
      2,
      '条件决定分流，不能把漏光与吸收混为一谈。',
      'Conditions determine splitting; leakage differs from absorption.',
    ],
  }),
];
