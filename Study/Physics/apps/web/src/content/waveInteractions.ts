import type { Lesson } from './schema';
import { makeWaveLesson as make } from './waveLessonFactory';
export const waveInteractionLessons: Lesson[] = [
  make({
    id: 'waves-an-end-sends-a-pulse-back',
    kind: 'wave-interactions-reflection',
    minutes: 24,
    title: [
      '绳子的尽头，怎样把一个隆起送回来？',
      'How does a rope end return a bump?',
    ],
    subtitle: [
      '只换终端：翻转、不翻转，还是吸收？',
      'Change only the termination: inverted, upright or absorbed?',
    ],
    hook: [
      '绳上一个隆起走到墙边，返回时竟成了凹陷。把尽头换成能上下滑动的小环，回来又不翻转。波没有自己决定“转身”：尽头允许怎样运动，才是线索。像回声一样有返回，但绳位移的反射规则不能直接套成空气压力的规则。',
      'A bump reaches a wall and returns as a dip. Replace the end with a freely sliding ring, and it returns upright. The wave does not decide to turn: what motion the end permits is the clue. Both this and an echo return, but string displacement and air pressure have different boundary rules.',
    ],
    prediction: [
      '固定端不能上下动。隆起返回时会怎样？',
      'The fixed end cannot move vertically. How does the bump return?',
    ],
    predictions: [
      ['仍是隆起', 'As a bump'],
      ['翻成凹陷', 'As a dip'],
      ['停止在端点', 'Stops at the end'],
    ],
    explore: [
      '完整比较固定端、自由端和无反射吸收端。先在50%检查t=3 s的相遇，再在75%看返回的形状。黄色是实际位移，蓝紫虚线是两项贡献；空白处没有隐藏的真实弦。时间图盯住x=6 m，记录来和回。自由r可以预测反射的大小和符号，但不代替规定比较。',
      'Complete fixed, free and matched-absorber comparisons. Inspect 50% at t=3 s, then 75% for the returning shape. Gold is actual displacement; blue and purple dashed lines are contributions, not extra strings beyond the end. The time record follows x=6 m for arrival and return. Predict sign and size with free r; it does not replace required comparisons.',
    ],
    concept: [
      '反射是扰动在边界处返回原介质。固定端必须始终u=0，所以到达端点的入射与反射位移相反，返回脉冲翻转。理想自由端无横向约束，端点附近弦的斜率必须为零，返回脉冲不翻转；相遇时端点可以达到两倍入射振幅。无反射端用匹配的终端吸收能量，不是把绳头松开：松开的自由端仍会反射。',
      'Reflection returns a disturbance into its original medium. A fixed end must keep u=0, requiring opposite incident and reflected displacements; the returning pulse is inverted. At an ideal free end, no transverse constraint allows a zero string slope and an upright return; during overlap, the end can reach twice the incident amplitude. A matched absorber takes energy out. It is not a loose end: a free end still reflects.',
    ],
    example: [
      '入射峰从x=2 m以2 m/s向x=8 m走，到端点需3 s。固定端的r=−1，反射峰高是−0.01 m；自由端r=+1，返回峰高仍0.01 m，但t=3 s端点为0.02 m。探针x=6 m先在2 s看见入射，4 s看见返回。r=0.5的返回振幅是原来的一半，反射能量比例却是0.25，余下0.75由本模型的耗散终端吸收。',
      'The peak starts at x=2 m and travels at 2 m/s to x=8 m, arriving after 3 s. Fixed r=−1 returns a −0.01 m dip. Free r=+1 returns a 0.01 m bump, while the end reaches 0.02 m at t=3 s. The x=6 m probe sees arrivals at 2 s and 4 s. With r=0.5, reflected amplitude is half, but reflected energy fraction is 0.25; the dissipative termination absorbs 0.75 in this model.',
    ],
    misconception: [
      '“反射一定翻转”“不翻转就是不反射”都忽略了边界。不要把位移符号当作能量符号：凹陷也携带正的能量。R=r²只适用于同一弦上返回的能量比例，不能把振幅系数直接当成功率比例。这里不模拟另一根弦中的透射。',
      '“Every reflection inverts” and “upright means unreflected” ignore the boundary. Negative displacement is not negative energy: a dip carries energy too. R=r² gives the returned energy fraction on this same string; amplitude and power ratios differ. Transmission into a second string is not simulated here.',
    ],
    realWorld: [
      '回声、琴弦端点、隔振终端，都需要先问边界让哪个量怎样变化。工程上让返回信号尽量小，常要匹配终端，而不是只把边界变“软”。本课先建立边界思维，声音与电磁波的具体边界会另学。',
      'Echoes, instrument ends and vibration absorbers all require asking what quantity a boundary constrains. Reducing a returning signal often needs a matched termination rather than merely a softer boundary. Specific acoustic and electromagnetic boundaries come later.',
    ],
    summary: [
      '反射的方向与翻转方式，由边界条件决定；位移符号和能量比例要分别记录。',
      'The boundary controls return and inversion; record displacement sign and energy fraction separately.',
    ],
    homeExperiment: [
      '两人轻握一根细绳，一端保持位置，另一端送一个小侧向脉冲。用慢动作找来波和返回波，不拉紧打到人。再用桌面上的长软弹簧轻推脉冲，比较握住末端与让末端自由移动。不要把没有看见返回当作无反射：先检查摩擦、视野和拍摄时长。',
      'Send a small sideways pulse along a thin cord while a partner holds the far end fixed. Use slow motion and keep motion gentle. With a soft tabletop spring, compare a held end and a freely moving end. An unseen return does not prove zero reflection; check friction, view and recording duration.',
    ],
    vocabulary: [
      ['入射波', 'incident wave'],
      ['反射波', 'reflected wave'],
      ['边界条件', 'boundary condition'],
      ['吸收', 'absorption'],
    ],
    formula: [
      '同一弦：返回振幅rA；反射能量比例R=r²',
      'Same string: returned amplitude rA; reflected energy fraction R=r²',
    ],
    questions: [
      [
        '固定端为什么产生翻转反射？',
        'Why does a fixed end invert the return?',
        [
          ['端点位移必须保持零', 'The end must keep zero displacement'],
          ['波速必须变负数', 'Wave speed must become negative'],
          ['能量变成负数', 'Energy becomes negative'],
        ],
        0,
        '入射与反射在端点的位移相消，才能满足固定端不动。',
        'Incident and reflected displacements cancel at the end to keep it fixed.',
      ],
      [
        '本模型r=−0.5，返回能量比例是多少？',
        'For r=−0.5, what energy fraction returns?',
        [
          ['−0.5', '−0.5'],
          ['0.5', '0.5'],
          ['0.25', '0.25'],
        ],
        2,
        '振幅翻转且减半；能量比例是平方0.25，不带负号。',
        'Amplitude inverts and halves; energy fraction is its square, 0.25.',
      ],
      [
        '自由端和匹配吸收端有何不同？',
        'How do a free end and matched absorber differ?',
        [
          ['两者都不反射', 'Neither reflects'],
          [
            '自由端会反射，吸收端不返回脉冲',
            'The free end reflects; the absorber gives no return',
          ],
          ['吸收端返回更高隆起', 'The absorber returns a taller bump'],
        ],
        1,
        '自由端的返回不翻转；匹配吸收端把能量带离弦。',
        'The free end returns an upright pulse; the matched absorber removes energy from the string.',
      ],
    ],
    exit: [
      '同一条绳、相同脉冲，想减少返回能量，应先比较什么？',
      'Same string and pulse: what should you compare to reduce returning energy?',
      [
        [
          '终端条件及反射能量比例',
          'Termination conditions and reflected energy fraction',
        ],
        ['把返回凹陷算成负能量', 'Count a returning dip as negative energy'],
        ['只比较脉冲颜色', 'Only compare pulse colour'],
      ],
      0,
      '改变终端并记录来波与回波的振幅、时刻和能量比例，才有证据。',
      'Change the termination and record incident/returned amplitudes, timing and energy fractions.',
    ],
  }),
  make({
    id: 'waves-one-rhythm-across-a-boundary',
    kind: 'wave-interactions-refraction',
    minutes: 24,
    title: [
      '跨过边界，波为什么转弯却不换节奏？',
      'Why does a wave turn at a boundary but keep its rhythm?',
    ],
    subtitle: [
      '从同一个频率，读出新的方向与波长。',
      'Use one frequency to read a new direction and wavelength.',
    ],
    hook: [
      '一排涟漪斜着走进浅水区，波面的一头先慢下来，整排方向就改变了。想象同一排队员进入一块让脚步变慢的区域：先进去的一侧落后，队列转动。这个类比只解释方向；水波还得服从源的节奏和界面相位连续。',
      'An oblique ripple enters shallower water; one side slows first and the front turns. Imagine a row of walkers entering a slower patch one side first. This analogy explains direction, while actual waves also keep the source rhythm and continuous phase along the interface.',
    ],
    prediction: [
      '波进入较慢的均匀介质，斜入射时透射方向怎样变？',
      'At oblique incidence into a slower uniform medium, how does the transmitted direction change?',
    ],
    predictions: [
      ['靠近法线', 'Toward the normal'],
      ['远离法线', 'Away from the normal'],
      ['频率一定减半', 'Its frequency must halve'],
    ],
    explore: [
      '完整比较c₂=1、2、3 m/s，保持c₁=2 m/s、f=1 Hz、入射角30°。灰蓝直线是同相位波面，黄线标出传播方向；它垂直波面。先量两角都相对竖直法线，再看蓝色波面间距。把自由入射角设成0°，预测“速度变了就一定转弯”是否成立。',
      'Complete c₂=1, 2 and 3 m/s comparisons, holding c₁=2 m/s, f=1 Hz and incidence 30°. Grey/blue lines are equal-phase fronts; gold shows the perpendicular propagation direction. Read both angles from the vertical normal and compare front spacing. Set free incidence to 0° to test whether a speed change must always turn the wave.',
    ],
    concept: [
      '折射是波跨入不同波速区域时，方向与波长的改变。稳定的波不能在界面一侧每秒来一波、另一侧却凭空每秒少来几波；这里频率由同一波源维持。沿界面的相位要对应，得到sin i/c₁=sin r/c₂。较慢时波长变短，斜入射更靠法线；较快时波长变长，方向远离法线。垂直入射时两角都为零，波速和波长仍可改变。',
      'Refraction changes direction and wavelength across regions with different wave speeds. A steady interface cannot receive one rhythm on one side and invent a different rhythm on the other: the common source sets frequency. Matching phase along the boundary gives sin i/c₁=sin r/c₂. A slower medium shortens wavelength and bends oblique propagation toward the normal; a faster one lengthens wavelength and bends away. At normal incidence both angles are zero even though speed and wavelength can change.',
    ],
    example: [
      'i=30°、c₁=2 m/s，sin i=0.5。c₂=1 m/s时sin r=0.25，r≈14.48°，λ₂=1 m；c₂=2时r=30°、λ₂=2 m；c₂=3时sin r=0.75，r≈48.59°、λ₂=3 m。三次f都为1 Hz。角不是对界面的夹角：14.48°对法线，和界面的夹角约75.52°。',
      'For i=30° and c₁=2 m/s, sin i=0.5. At c₂=1 m/s, sin r=0.25, r≈14.48° and λ₂=1 m. At c₂=2, r=30° and λ₂=2 m. At c₂=3, sin r=0.75, r≈48.59° and λ₂=3 m. All keep f=1 Hz. An angle 14.48° from the normal is about 75.52° from the interface.',
    ],
    misconception: [
      '“波面方向就是传播方向”会把角量错90°。传播方向垂直波面。“较慢所以频率降低”把介质改变和波源改变混为一谈。“一定有透射方向”也有范围限制：快速介质的某些大入射角会达到临界条件，后面的光学会讨论；本工作台限制角度，始终在透射方向存在的范围。',
      'A wavefront is perpendicular to propagation, so confusing them shifts angles by 90°. “Slower means lower frequency” confuses a medium change with changing the source. A transmitted direction also has a domain: sufficiently oblique incidence toward a faster region can reach a critical condition. Later optics explores this; our control stays within the transmission domain.',
    ],
    realWorld: [
      '水槽中水深变化、海岸附近波面转向，提供观察方向的机会。透过玻璃看见的偏折也与波速和相位连续有关，但不同介质的具体速度要用相应模型，不能把本课虚构的1–3 m/s当作光速或海浪预测。',
      'Changing water depth and turning coastal wavefronts offer real observations. Bending through glass also relates to wave speed and phase continuity, but each medium needs its own speed model. Our fictional 1–3 m/s parameters are not light speeds or a coastal forecast.',
    ],
    summary: [
      '同一波源跨界面：频率保持，波速改变时波长跟着改变；转角从法线量。',
      'Across a steady interface: keep frequency, couple wavelength to speed, and measure angles from the normal.',
    ],
    homeExperiment: [
      '找一个浅盘，装少量水，垫一块平整薄塑料板，让一半区域更浅。轻触产生小涟漪，从上方录影，先画界面与法线，再记录波面方向。两区同时数相同时间内的波数。边缘反射、深度不匀会干扰；把观察和模型预测分开写。',
      'In a shallow tray of water, place a flat thin plastic sheet under half the water to reduce depth. Make gentle ripples and film from above. Draw the boundary and normal, then record wavefront directions and count waves in both regions over the same time interval. Edge reflections and uneven depth affect observations; separate evidence from model predictions.',
    ],
    vocabulary: [
      ['折射', 'refraction'],
      ['法线', 'normal'],
      ['入射角', 'incidence angle'],
      ['相位连续', 'phase continuity'],
    ],
    formula: [
      'sin i/c₁=sin r/c₂；f相同；λ=c/f',
      'sin i/c₁=sin r/c₂; common f; λ=c/f',
    ],
    questions: [
      [
        '本工作台跨界面保持不变的是？',
        'What stays unchanged across this interface?',
        [
          ['波长', 'Wavelength'],
          ['频率', 'Frequency'],
          ['传播方向', 'Propagation direction'],
        ],
        1,
        '稳定同一波源维持频率；波速、波长和斜入射方向可以改变。',
        'A common steady source keeps frequency; speed, wavelength and oblique direction may change.',
      ],
      [
        'i=0°，换到较慢介质会怎样？',
        'At i=0°, what happens in the slower medium?',
        [
          ['不转弯，但波长变短', 'No turn, but a shorter wavelength'],
          ['转弯90°', 'Turns by 90°'],
          ['频率消失', 'Frequency disappears'],
        ],
        0,
        '两角仍为零，方向不变；c变小而f固定，所以λ变短。',
        'Both angles remain zero; smaller c at fixed f shortens λ.',
      ],
      [
        'c₁=2、c₂=3 m/s、i=30°，正确的是？',
        'For c₁=2, c₂=3 m/s and i=30°, which is correct?',
        [
          ['r=15°', 'r=15°'],
          ['r=30°', 'r=30°'],
          ['r≈48.59°', 'r≈48.59°'],
        ],
        2,
        'sin r=(3/2)sin30°=0.75，角从法线量。',
        'sin r=(3/2)sin30°=0.75, measured from the normal.',
      ],
    ],
    exit: [
      '一张波面照片显示跨界面后条纹更密。若同一频率，应怎样判断？',
      'Wavefronts become more closely spaced across a boundary at the same frequency. What follows?',
      [
        [
          '波长更短，波速更小；斜入射时检查是否靠法线',
          'Shorter wavelength, lower speed; check bending toward the normal',
        ],
        ['条纹更密证明频率更高', 'Closer fronts prove a higher frequency'],
        ['不用画法线就能读折射角', 'Read refraction angle without a normal'],
      ],
      0,
      '先确认沿传播方向的波面间距，再用c=fλ；方向判断还需法线。',
      'Confirm spacing along propagation, use c=fλ, and draw the normal to assess direction.',
    ],
  }),
  make({
    id: 'waves-an-opening-is-not-a-ray-tunnel',
    kind: 'wave-interactions-diffraction',
    minutes: 25,
    title: [
      '声音能绕过门缝，为什么光看起来更直？',
      'Why can sound spread around a doorway while light seems straight?',
    ],
    subtitle: [
      '不只问缝有多宽，还要问它有几个波长宽。',
      'Ask how many wavelengths fit across an opening.',
    ],
    hook: [
      '门外有人说话，没站在门的正前方也能听见；手电筒却常留下清楚的亮区边界。不是声音专门会“拐弯”，而是门宽与两种波长的比值差得很大。我们用一个理想单缝，先看波经过开口后朝哪些角度分布。',
      'You can hear a speaker through a doorway from off to one side, while a torch often makes a sharp bright region. Sound does not have a special turning privilege: doorway width compared with wavelength differs greatly. An ideal slit lets us first compare the angles into which a wave spreads.',
    ],
    prediction: [
      '同波长下，缝由4个波长宽变成2个波长宽，中央主瓣怎样变？',
      'At the same wavelength, narrow a slit from four wavelengths to two. What happens to the central lobe?',
    ],
    predictions: [
      ['角宽变小', 'Its angular width decreases'],
      ['角宽变大', 'Its angular width increases'],
      ['频率一定增加', 'Frequency must increase'],
    ],
    explore: [
      '完整比较a/λ=1、2、4，观察扇形与平均强度曲线；它们展示远场方向，不是粒子飞行轨迹。黄色虚线探针一直位于30°。时间图记录探针的瞬时振动，平均强度不是某一帧高度。再把自由比值设成0.5，查首暗纹读数是否真的存在；图只显示±75°，不要把视野外的暗纹当成不存在。',
      'Complete a/λ=1, 2 and 4 comparisons. The fan and mean-intensity curve show far-field angles, not particle tracks. The gold probe stays at 30°. Its time trace records instantaneous oscillation; mean intensity is not a one-frame height. Try free ratio 0.5 and check whether a first minimum exists. The plot shows only ±75°: a minimum outside that view is not absent.',
    ],
    concept: [
      '衍射是波遇到开口或障碍后展开的波动现象。开口内不同位置的波贡献在远处相加，有些方向增强，有些方向相消。对均匀照明的理想单缝，首暗纹满足a sinθ₁=λ。a越大、λ固定，θ₁越小，中央主瓣越窄；a与λ相近，展开更显著。这里用标量远场近似，先学比值和角宽，真实门外声音还含墙面反射、房间形状与不同音调。',
      'Diffraction is wave spreading at openings or obstacles. Contributions from positions across an opening add in the far field, reinforcing some directions and cancelling others. For a uniformly illuminated ideal slit, the first minimum satisfies a sinθ₁=λ. Larger a at fixed λ gives smaller θ₁ and a narrower central lobe; spreading becomes prominent when a and λ are comparable. This scalar far-field model teaches ratios and angular width; real doorway sound also involves walls, room geometry and many frequencies.',
    ],
    example: [
      'a/λ=4时θ₁=arcsin(1/4)≈14.48°，主瓣两侧首暗纹之间约28.96°。a/λ=2时θ₁=30°，主瓣宽60°。a/λ=1时首暗纹在90°边缘，超出本图±75°；a/λ=0.5时sinθ₁=2不可能，根本没有非零阶首暗纹。30°探针在比值2的首暗纹处，瞬时响应和平均强度都为零。',
      'At a/λ=4, θ₁=arcsin(1/4)≈14.48°, giving a central width about 28.96°. At a/λ=2, θ₁=30° and the width is 60°. At ratio 1, the first minimum lies at the 90° edge, beyond our ±75° plot. At ratio 0.5, sinθ₁=2 is impossible, so no nonzero-order minimum exists. The 30° probe sits at the ratio-2 first minimum: both response and mean intensity vanish.',
    ],
    misconception: [
      '“缝越小，透过能量一定越多”不由这个归一化图支持。每条曲线把自己的轴向平均强度设成1，只比较分布形状，不比较总透过能量。“暗纹在图外”和“数学上不存在暗纹”也要区分。衍射不是只有声波才有；可见光的波长很短，普通门宽包含大量光波长，明显展开需要小得多的结构。',
      '“A smaller opening passes more total energy” is not supported by this normalized plot. Each curve sets its own on-axis mean intensity to 1, comparing shape rather than total transmission. A minimum outside the view differs from one that does not exist. Light diffracts too, but its very short wavelength requires far smaller structures for prominent spreading.',
    ],
    realWorld: [
      '低沉声音波长较长，绕过障碍的效果常比尖锐声音明显。相机光圈太小会因衍射影响分辨细节；增大望远镜口径有助于分开很近的星点。这些器件的具体图样需用圆孔等对应模型，不能直接用本单缝的角宽数值代替。',
      'Longer-wavelength low notes often spread around obstacles more noticeably than high notes. A very small camera aperture can limit detail through diffraction; a larger telescope aperture helps separate close stars. Circular apertures need their own patterns, rather than the slit’s numerical width formula.',
    ],
    summary: [
      '衍射的显著程度要比较a/λ；中央主瓣、视野外暗纹和不存在暗纹分别判断。',
      'Compare a/λ, and distinguish a central lobe, an out-of-view minimum and a nonexistent minimum.',
    ],
    homeExperiment: [
      '让家人在门外用平常音量先轻哼低音，再发较高音；你在门内侧方比较，并写下距离、门宽和音量是否相同。房间反射很多，这只能提出问题，不能单独证明单缝公式。另画a/λ=2与4的角度扇形，用量角器检查首暗纹方向；不要用激光做家庭演示。',
      'Have a family member gently hum a low note and then a higher note outside a doorway. Listen from one side inside and record distance, opening and volume. Room reflections make this a question-generator, not proof of the slit formula. Draw ratio-2 and ratio-4 fans and check first-minimum directions with a protractor; no laser is needed.',
    ],
    vocabulary: [
      ['衍射', 'diffraction'],
      ['中央主瓣', 'central lobe'],
      ['暗纹', 'minimum'],
      ['归一化强度', 'normalized intensity'],
    ],
    formula: [
      '首暗纹：a sinθ₁=λ（a≥λ）；比较平均强度而非瞬时位移',
      'First minimum: a sinθ₁=λ for a≥λ; compare mean intensity, not instantaneous displacement',
    ],
    questions: [
      [
        '同λ下，a增大时中央主瓣怎样变？',
        'At fixed λ, how does a larger opening change the central lobe?',
        [
          ['变窄', 'Narrows'],
          ['变宽', 'Widens'],
          ['必须变频', 'Frequency must change'],
        ],
        0,
        'sinθ₁=λ/a变小，两侧首暗纹靠近轴向。',
        'sinθ₁=λ/a decreases, bringing the first minima closer to the axis.',
      ],
      [
        'a/λ=0.5时首暗纹角是多少？',
        'What is the first-minimum angle when a/λ=0.5?',
        [
          ['30°', '30°'],
          ['90°', '90°'],
          ['没有非零阶暗纹', 'No nonzero-order minimum'],
        ],
        2,
        'sinθ₁=2超出正弦范围，不能虚构一个角。',
        'sinθ₁=2 is outside the sine domain; do not invent an angle.',
      ],
      [
        '每条曲线的中心都是1，能说明什么？',
        'Each curve has centre value 1. What does that mean?',
        [
          ['总透过能量相同', 'Equal total transmitted energy'],
          ['各自按轴向强度归一', 'Each uses its own on-axis normalization'],
          ['没有能量损耗', 'No energy losses'],
        ],
        1,
        '归一值用于比较形状，没有提供总能量相等的证据。',
        'Normalization compares shapes without proving equal total energy.',
      ],
    ],
    exit: [
      '同门宽下，低音比高音更容易展开，应先比较什么？',
      'For the same doorway, what should you compare when low notes spread more readily?',
      [
        ['门宽与各自波长的比值', 'Opening width relative to each wavelength'],
        ['声音是否长了腿', 'Whether sound grew legs'],
        ['只比较门的颜色', 'Only the door colour'],
      ],
      0,
      '在近似相同声速下低频波长长，a/λ更小；真实房间还需检查其他影响。',
      'At approximately common sound speed, lower frequency has longer wavelength and smaller a/λ; also examine room effects.',
    ],
  }),
  make({
    id: 'waves-a-flat-string-still-has-energy',
    kind: 'wave-interactions-interference',
    minutes: 25,
    title: [
      '隆起与凹陷相遇，波和能量都消失了吗？',
      'When a bump meets a dip, do the waves and energy disappear?',
    ],
    subtitle: [
      '把位移相加，再追踪相遇后的波和完整能量。',
      'Add displacements, then follow the waves and the full energy ledger.',
    ],
    hook: [
      '从长绳两端各送一个脉冲。两个隆起相遇时更高；一个隆起与同样大的凹陷相遇，某一帧竟像绳子完全平了。暂停那一帧就判定“两个波互相毁掉”，会错过下一帧。平直只告诉我们位置，还没有告诉我们速度。',
      'Send a pulse from each end of a long string. Two bumps overlap into a taller bump; an equal bump and dip can make the whole string look flat for one frame. Calling that frame mutual destruction misses the next one. A straight string tells us positions, not velocities.',
    ],
    prediction: [
      '等大隆起与凹陷完全重叠的瞬间，之后会怎样？',
      'After an equal bump and dip overlap completely, what happens next?',
    ],
    predictions: [
      ['永远停止', 'They stop permanently'],
      ['合成一个不动的波', 'They form one stationary wave'],
      ['继续各自传播', 'Each continues travelling'],
    ],
    explore: [
      '完整观察两个隆起、隆起与等大凹陷、隆起与较小凹陷。50%对应t=2 s，两个中心都在x=5 m。先读黄色合位移，再读K与K+U；继续到100%看两个贡献穿过彼此。自由b改变第二脉冲的符号与幅度。不能因为中心标记静止，就把整条弦也判作静止。',
      'Complete two-bump, equal bump/dip and smaller-dip comparisons. At 50%, t=2 s, both centres reach x=5 m. Read gold resultant displacement, K and K+U, then continue to 100% as components pass through. Free b changes the second pulse’s sign and size. A stationary centre marker does not mean the entire string is stationary.',
    ],
    concept: [
      '在线性小振幅模型中，同一点的合位移等于两波贡献的代数和。相同符号叠加增强，相反符号可以相消；重叠结束后两个脉冲仍按原速度和方向传播，不像会互相撞停的小车。等大反向脉冲完全重叠时整条弦的位移和斜率为零，但重叠区其他位置的速度不为零，能量暂时全部在运动中。因此相消的是位移贡献，不是把能量从账本里删除。',
      'For small linear waves, resultant displacement is the algebraic sum of contributions at each point. Equal signs reinforce; opposite signs can cancel. After overlap, the pulses retain their speed and direction instead of colliding like carts. During complete equal bump/dip overlap, displacement and slope vanish, but velocities away from the centre do not. Energy is momentarily entirely kinetic. Cancellation concerns displacement, not deleting energy from the ledger.',
    ],
    example: [
      '两脉冲从x=2与8 m出发，以1.5 m/s相向，2 s后相遇。两个0.01 m隆起合成0.02 m峰；0.01 m隆起与−0.01 m凹陷合位移为零；若凹陷只有−0.005 m，合峰仍0.005 m。等大隆起与凹陷的总能量约433.72 µJ，在完全重叠时K≈433.72、U≈0；两个隆起的总能量相同，完全重叠时K≈0、U≈433.72 µJ。4 s时两者都已经穿过对方。',
      'Starting at x=2 and 8 m at opposing 1.5 m/s speeds, the pulses meet after 2 s. Two 0.01 m bumps produce a 0.02 m peak; 0.01 m and −0.01 m cancel; a −0.005 m dip leaves a 0.005 m peak. The equal bump/dip total energy is about 433.72 µJ; at complete overlap K≈433.72 and U≈0. Equal bumps have the same total energy but K≈0 and U≈433.72 µJ at overlap. At 4 s both have passed through each other.',
    ],
    misconception: [
      '“位移零，所以一切都静止”把位置当成速度；“相消所以能量消失”忽略了动能。两个隆起合峰加倍，不能再把独立行波的A²功率公式直接套在这一个瞬时反向叠加图上，否则会误报凭空多出能量。大振幅、非线性或有耗散的真实波，未必像本模型这样无改变地穿过。',
      'Zero displacement does not imply zero velocity, and cancellation does not erase kinetic energy. A doubled overlap height does not let us apply a single travelling wave’s A² power formula to this instantaneous counterpropagating sum; that would falsely create energy. Large nonlinear or dissipative waves need not pass through unchanged.',
    ],
    realWorld: [
      '同地点的音波叠加可以增强或减弱听到的响应；降噪需要在目标位置建立合适的反向声压贡献，不会让整个房间所有位置都安静。稳定声源的干涉图还要检查相位和路径差，本课用单次脉冲先建立“同点相加”的机制。',
      'Sound contributions can reinforce or reduce response at a location. Noise cancellation needs a suitable opposite pressure contribution at the target; it does not silence every point in a room. Steady-source patterns also require phase and path differences. These pulses first establish point-by-point addition.',
    ],
    summary: [
      '干涉把同点位移相加；继续看时间，并用动能加势能核对能量。',
      'Interference adds displacement at each point; follow time and check kinetic plus potential energy.',
    ],
    homeExperiment: [
      '在纸上画两个相向脉冲，依次平移到相遇前、完全重叠、相遇后；每个横坐标用带正负号的高度相加。再画下一时刻，指出完全相消的一帧为何不代表永久平静。若用软绳拍视频，轻摆并让两端远离重叠区，记录真实摩擦与反射的影响。',
      'Draw opposing pulses on paper before, during and after overlap. At each horizontal coordinate add signed heights. Draw the next instant and explain why one cancelling frame is not permanent stillness. If filming gentle cord pulses, keep ends away from overlap and note friction and reflection.',
    ],
    vocabulary: [
      ['叠加原理', 'superposition principle'],
      ['相长干涉', 'constructive interference'],
      ['相消干涉', 'destructive interference'],
      ['合位移', 'resultant displacement'],
    ],
    formula: [
      'u=u₁+u₂；能量核对K+U，而不只看某一帧高度',
      'u=u₁+u₂; check K+U instead of one-frame height',
    ],
    questions: [
      [
        '同点u₁=0.01 m、u₂=−0.005 m，合位移？',
        'At one point u₁=0.01 m and u₂=−0.005 m. Result?',
        [
          ['0.015 m', '0.015 m'],
          ['0.005 m', '0.005 m'],
          ['−0.015 m', '−0.015 m'],
        ],
        1,
        '代数相加，0.01−0.005=0.005 m。',
        'Add signed values: 0.01−0.005=0.005 m.',
      ],
      [
        '等大隆起与凹陷完全相消时，能量主要在哪？',
        'At complete equal bump/dip cancellation, where is the energy?',
        [
          ['动能中', 'In kinetic energy'],
          ['负势能中', 'In negative potential energy'],
          ['已经消失', 'It disappeared'],
        ],
        0,
        '弦平直，形变势能为零，但各段速度可不为零；中心一点是特殊的。',
        'The straight string has zero strain energy, but segments can have velocity; the centre is a special point.',
      ],
      [
        '本线性模型相遇后，两脉冲怎样？',
        'What happens after overlap in this linear model?',
        [
          ['黏在一起', 'They stick'],
          ['都反弹回原方向', 'Both rebound'],
          ['继续原来的传播', 'They continue their original propagation'],
        ],
        2,
        '重叠时贡献相加，之后仍各自传播。',
        'Contributions add while overlapping, then continue travelling.',
      ],
    ],
    exit: [
      '有人用“相消那一帧的绳很平”证明能量消失。该补什么证据？',
      'Someone claims a flat cancellation frame proves energy disappeared. What evidence is missing?',
      [
        [
          '各段速度、K+U和之后的运动',
          'Segment velocities, K+U and later motion',
        ],
        ['只放大那张静态照片', 'Only enlarge the still photo'],
        [
          '把负位移改成零能量',
          'Replace negative displacement with zero energy',
        ],
      ],
      0,
      '静态位置不足以决定能量，运动记录与完整能量账能检验判断。',
      'A static position does not determine energy; motion and a complete energy ledger test the claim.',
    ],
  }),
  make({
    id: 'waves-nodes-stay-while-the-string-moves',
    kind: 'wave-interactions-standing',
    minutes: 25,
    title: [
      '琴弦上的波节不走，弦就没有动吗？',
      'If nodes stay in place, is the string still?',
    ],
    subtitle: [
      '两列相向行波，形成固定波节与振动波腹。',
      'Opposing travelling waves make stationary nodes and moving antinodes.',
    ],
    hook: [
      '拨动琴弦，细看有些位置晃得很大，有些却几乎不动。不是弦上长了几块永远固定的山，而是相向波反复叠加，形成一张振幅地图。位置不变的是波节；波腹里的同一段弦仍会往返。这里先看慢速理想弦，再把规律带回琴弦。',
      'A plucked string moves strongly at some places and barely at others. It has not grown fixed hills: opposing waves repeatedly superpose into an amplitude map. Nodes stay in place while material at antinodes oscillates. Slow ideal-string motion lets us learn a pattern to take back to instruments.',
    ],
    prediction: [
      '两端固定、弦长和波速不变，把一个波腹换成两个，频率怎样变？',
      'With fixed ends, length and speed, change from one antinode to two. How does frequency change?',
    ],
    predictions: [
      ['变为两倍', 'Doubles'],
      ['变为一半', 'Halves'],
      ['仍不变', 'Stays unchanged'],
    ],
    explore: [
      '完整比较一个、两个、三个波腹，弦长6 m、波速3 m/s固定。蓝点是波节，灰色包络是各处最大幅度；黄线不是向右移动的单列波。跟踪L/4的黄色材料标记和它的时间图。再改变自由弦长，保持当前模态n和波速，检查节点相对位置、λ和f怎样一起变。',
      'Complete one-, two- and three-antinode comparisons at L=6 m and c=3 m/s. Blue dots are nodes; the grey envelope gives local maximum amplitude. Gold is not one right-moving wave. Follow the material marker at L/4 and its time record. Change free length while holding selected n and c, and check relative node positions, λ and f together.',
    ],
    concept: [
      '等幅、同频、同波长的相向行波可以叠成驻波。合位移u=2A sin(kx)cosωt：一个因子决定位置上的幅度，一个决定时间振动。波节对所有时刻都为零；波腹是幅度最大的固定位置，并不是某一时刻的所有零点或最高点。两端固定要求弦长容纳整数个半波长，L=nλ/2，所以f=nc/(2L)。这组允许的频率叫本征频率；并非随便一个频率都形成纯模态。',
      'Equal-amplitude waves with common frequency and wavelength travelling in opposite directions can form a standing wave. u=2A sin(kx)cosωt separates an amplitude map from time oscillation. Nodes stay zero at every instant; antinodes are fixed locations of largest amplitude, not every instantaneous zero or peak. Fixed ends require an integer number of half-wavelengths, L=nλ/2, giving f=nc/(2L). These are normal-mode frequencies; an arbitrary frequency does not produce one pure mode.',
    ],
    example: [
      'L=6 m、c=3 m/s：n=1时λ=12 m、f=0.25 Hz，两端2个波节，中间1个波腹。n=2时λ=6 m、f=0.5 Hz，波节0、3、6 m，波腹1.5、4.5 m。n=3时λ=4 m、f=0.75 Hz。把n=2的弦长减为3 m，频率升至1 Hz，波速仍3 m/s。数波节时，两端不能漏算。',
      'At L=6 m and c=3 m/s, n=1 has λ=12 m, f=0.25 Hz, two end nodes and one antinode. n=2 has λ=6 m, f=0.5 Hz, nodes at 0, 3 and 6 m, and antinodes at 1.5 and 4.5 m. n=3 has λ=4 m and f=0.75 Hz. Shorten the n=2 string to 3 m and f rises to 1 Hz while c remains 3 m/s. Include both ends when counting nodes.',
    ],
    misconception: [
      '“某一帧u=0就是波节”不对：驻波会周期性整条弦平直，此时许多位置正在快速运动；波节必须每一帧都保持零。“驻波不传任何能量”也太绝对：理想纯驻波的平均净传递功率为零，但局部瞬时能量仍可交换。本模拟直接准备纯模态，不是证明任意驱动都会产生这个形状，也不是实际的低音琴声。',
      'One zero-displacement frame does not identify a node: the whole standing wave periodically becomes straight while many points move rapidly. A node stays zero in every frame. Ideal standing waves have zero mean net transmitted power, but can exchange energy locally at an instant. This simulation prepares a pure mode; it does not show arbitrary driving creating it or synthesize an actual instrument note.',
    ],
    realWorld: [
      '吉他按弦缩短有效长度，同样张力和材料下音调通常升高；泛音对应不同模态。真实拨弦常同时包含多个模态，随后因阻尼衰减，不是永远只有本图一种形状。管中空气的端点条件不同，不能照搬“两端固定弦”的波节数与频率式。',
      'Fretting a guitar shortens effective length and usually raises pitch at the same tension and material; harmonics involve different modes. A real pluck excites several modes that decay, rather than this single eternal shape. Air columns have different end conditions, so do not copy the fixed-string node counts and frequency formula.',
    ],
    summary: [
      '波节要跨时间判断；两端条件选出模态，弦长与波速决定本征频率。',
      'Identify nodes across time; end conditions select modes, while length and wave speed set their frequencies.',
    ],
    homeExperiment: [
      '在纸上画n=1、2、3的包络，标出两端和内部波节，核对每两个相邻波节相距λ/2。若家中有弦乐器，轻拨空弦，再按住不同位置比较音调，记录哪些条件大致保持。不要把音调变化直接归因于“波跑得更快”，先检查有效弦长。',
      'Draw amplitude envelopes for n=1, 2 and 3, including end and interior nodes. Check that adjacent nodes are λ/2 apart. If you have a string instrument, gently compare open and fretted notes and record approximately held conditions. Before attributing higher pitch to faster waves, check effective length.',
    ],
    vocabulary: [
      ['驻波', 'standing wave'],
      ['波节', 'node'],
      ['波腹', 'antinode'],
      ['本征模态', 'normal mode'],
    ],
    formula: [
      '两端固定弦：L=nλ/2；fₙ=nc/(2L)；n=1,2,3…',
      'Fixed-end string: L=nλ/2; fₙ=nc/(2L); n=1,2,3…',
    ],
    questions: [
      [
        '判断波节需要什么证据？',
        'What evidence identifies a node?',
        [
          ['一张照片中位移为零', 'Zero displacement in one photo'],
          ['这一帧速度最大', 'Maximum speed in this frame'],
          ['所有时刻都在平衡位置', 'Equilibrium position at every instant'],
        ],
        2,
        '波节是空间上固定、每时刻都零位移的位置。',
        'A node is a fixed location with zero displacement at every instant.',
      ],
      [
        '两端固定的n=3模态有几个波节（含两端）？',
        'How many nodes including ends in fixed-string mode n=3?',
        [
          ['4', '4'],
          ['3', '3'],
          ['2', '2'],
        ],
        0,
        '三段半波长需要四个边界波节，其中两个在弦端。',
        'Three half-wavelength sections have four nodes, including both ends.',
      ],
      [
        '同n、同c，把L减半，f怎样变？',
        'At fixed n and c, halve L. What happens to f?',
        [
          ['减半', 'Halves'],
          ['翻倍', 'Doubles'],
          ['不变', 'Stays fixed'],
        ],
        1,
        'f=nc/(2L)与L成反比。',
        'f=nc/(2L) is inversely proportional to L.',
      ],
    ],
    exit: [
      '琴弦按住一处后有效长度变短、音调升高，如何解释更有依据？',
      'A fretted string is shorter and has higher pitch. Which explanation is supported?',
      [
        [
          '同波速下允许波长缩短，本征频率升高',
          'At held speed, allowed wavelength shortens and frequency rises',
        ],
        ['所有弦段都变成波节', 'Every segment becomes a node'],
        [
          '频率升高证明波速必定升高',
          'Higher frequency proves higher wave speed',
        ],
      ],
      0,
      '先辨认长度、张力和材料条件，再用固定端模态关系；波速不必改变。',
      'Check length, tension and material, then use fixed-end modes; wave speed need not change.',
    ],
  }),
];
