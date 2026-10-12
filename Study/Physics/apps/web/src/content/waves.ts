import type { Lesson } from './schema';
import { makeWaveLesson as make } from './waveLessonFactory';
export const waveLessons: Lesson[] = [
  make({
    id: 'waves-a-pulse-without-a-passenger',
    kind: 'waves-pulse',
    minutes: 21,
    title: [
      '绳上的小山走了，标记也走了吗？',
      'A bump travels along a rope. Does its marker travel too?',
    ],
    subtitle: [
      '跟踪一个标记，把介质运动与扰动传播分开。',
      'Track one marker to separate medium motion from a travelling disturbance.',
    ],
    hook: [
      '体育场的人浪绕场一周，观众需要跑一圈吗？绳上的一个小隆起也会前进。给绳子贴一个黄色标记：它是隆起的乘客，还是在自己的位置完成一次起落？先盯住标记，再看波峰。',
      'A stadium wave circles the stands. Do spectators run around them? A bump also travels along a rope. Give the rope a gold marker: is it a passenger on the bump, or does it rise and fall near its own place? Watch the marker before the peak.',
    ],
    prediction: [
      '脉冲向右通过后，这个理想绳标记的水平位置会怎样？',
      'After the pulse passes rightward, what happens to the ideal-string marker’s horizontal position?',
    ],
    predictions: [
      ['随波峰向右跑', 'Runs right with the peak'],
      ['停在波峰最高处', 'Stays at the peak height'],
      ['仍在原平衡位置', 'Remains at its original equilibrium position'],
    ],
    explore: [
      '完整比较小脉冲、大脉冲、快脉冲。黄色实点是同一段绳，空心点是同一脉冲峰；时间图始终记录x=4 m。拖动到50%与75%看标记何时偏离、何时返回，再用自由波速预测到达时间。',
      'Observe small, large and fast pulses. The solid gold point is one piece of string; the ring is the pulse peak. The time graph always records x=4 m. Inspect 50% and 75% for displacement and return, then predict arrival with free wave speed.',
    ],
    concept: [
      '波是扰动从一处传到另一处。理想绳的各段受相邻段作用，局部运动依次发生，形成传播的形状；某一段绳并不一路坐在波峰上。这里标记横坐标固定，只作一次上下运动。传播可以转移能量，和整条绳平移是不同的过程。体育场人浪帮助想象“动作传播”，但观众主动响应，不能当成绳张力的真实动力学。',
      'A wave is a disturbance propagating between places. Neighbouring string segments interact, and successive local motions make a travelling shape; one segment does not ride the peak throughout. This marker keeps its horizontal coordinate and makes one up-and-down excursion. Propagation can transfer energy, a different process from translating the whole string. A stadium wave illustrates spreading action, but spectators respond actively rather than through string tension.',
    ],
    example: [
      '小脉冲峰从x=1 m出发，波速1 m/s，到x=4 m需3 s。此刻标记位移达到0.01 m，但它仍在x=4 m；4 s时脉冲已经离开，标记回到平衡位置。把脉冲振幅改成0.02 m，峰到达仍需3 s；把波速改成2 m/s才会变成1.5 s。',
      'The small pulse peak starts at x=1 m and travels at 1 m/s, reaching x=4 m after 3 s. The marker then reaches displacement 0.01 m but remains at x=4 m; by 4 s the pulse has passed and it returns to equilibrium. Raising amplitude to 0.02 m keeps arrival at 3 s; increasing wave speed to 2 m/s changes arrival to 1.5 s.',
    ],
    misconception: [
      '“波峰是同一小块物质。”波峰是相同扰动状态的位置，经过不同的物质标记。也别给单次脉冲硬安一个频率：没有重复序列，就不能从一次起落定义重复频率。真实水面可能有漂流，不能把本理想绳的固定横坐标直接套给所有海浪。',
      '“A peak is one piece of material.” It is a location of a disturbance state, successively occupied by different markers. Do not assign a repetition frequency to one isolated pulse. Real water can drift; this ideal string’s fixed horizontal coordinates do not describe every ocean wave.',
    ],
    realWorld: [
      '传声时，耳边的空气不需要从说话者嘴边一路跑过来。各处局部响应把信号传下去。下一课会比较局部响应的方向；声音也并不是这条上下振动的绳。',
      'Air at your ear need not travel all the way from a speaker’s mouth. Local responses pass a signal along. Next we compare their directions; sound is not this vertically moving string.',
    ],
    summary: [
      '分别追踪物质标记和扰动位置，才看得懂波。',
      'Track material and disturbance separately to understand a wave.',
    ],
    homeExperiment: [
      '给一根松弛细绳中间贴纸标记，两人轻握两端，发送一个小侧向脉冲。录短视频，逐帧记录标记和隆起的位置。不要只记录峰：写出哪条证据支持“标记没有跟着峰一路前进”；真实绳的摩擦与端点会让结果偏离理想模型。',
      'Put a paper marker on a loose thin cord held gently at both ends and send a small sideways pulse. Record a short video and compare marker and bump frame by frame. Write evidence for the marker not travelling with the peak. Friction and ends make a real cord differ from the ideal model.',
    ],
    vocabulary: [
      ['扰动', 'disturbance'],
      ['脉冲', 'pulse'],
      ['介质', 'medium'],
      ['传播', 'propagation'],
    ],
    formula: [
      '波形行程Δx=ct；局部标记位移u另记',
      'Pattern distance Δx=ct; record local displacement u separately',
    ],
    questions: [
      [
        '脉冲峰从1 m以1 m/s到4 m，用时？',
        'Time for the peak from 1 m to 4 m at 1 m/s?',
        [
          ['4 s', '4 s'],
          ['3 s', '3 s'],
          ['1 s', '1 s'],
        ],
        1,
        '用位置差4−1=3 m除以1 m/s；不是把终点坐标直接当行程。',
        'Divide the position change 4−1=3 m by 1 m/s, rather than using the final coordinate as distance.',
      ],
      [
        '哪条记录最能区分介质与波形？',
        'Which record best distinguishes medium from pattern?',
        [
          [
            '同时追踪黄色标记与空心峰',
            'Track the gold marker and ringed peak together',
          ],
          ['只截一张绳照片', 'One photograph of the cord'],
          ['只量绳总质量', 'Only total cord mass'],
        ],
        0,
        '同一时钟下两条不同位置记录，能显示波形前进而标记横坐标保持。',
        'Two simultaneous position records show the pattern travelling while the marker keeps its horizontal coordinate.',
      ],
      [
        '单个孤立脉冲，能从这一次起落定出重复频率吗？',
        'Can this single isolated pulse define a repetition frequency?',
        [
          ['能，波峰速度就是频率', 'Yes: peak speed is frequency'],
          ['能，振幅就是频率', 'Yes: amplitude is frequency'],
          [
            '不能，没有重复周期序列',
            'No: there is no repeated periodic sequence',
          ],
        ],
        2,
        '一次扰动有持续时间和传播速率，但没有给出重复的周期序列。',
        'One disturbance has duration and propagation speed, but provides no repeated periodic sequence.',
      ],
    ],
    exit: [
      '说话声到了远处，最合理的解释？',
      'A voice reaches a distant listener. Best explanation?',
      [
        [
          '各处介质局部响应，信号传播',
          'Local medium responses pass the signal',
        ],
        ['同一团空气跑完整段距离', 'One air parcel runs the whole distance'],
        ['传播不需要任何局部变化', 'Propagation needs no local changes'],
      ],
      0,
      '先区分传播和物质整体搬运；声学会进一步说明空气的纵向振动。',
      'Separate propagation from bulk material transport; sound will add longitudinal air motion.',
    ],
  }),
  make({
    id: 'waves-two-directions-on-one-string',
    kind: 'waves-transverse',
    minutes: 22,
    title: [
      '波向右走，绳为什么上下动？',
      'The wave travels right. Why does the string move up and down?',
    ],
    subtitle: [
      '用两条方向线认识横波，不把“横”当屏幕横向。',
      'Read transverse waves through two directions, not the screen’s horizontal edge.',
    ],
    hook: [
      '甩一下跳绳，弯曲向远处跑，手却上下动。现在把动画里的传播反过来：黄色标记会改成沿绳跑吗？如果把屏幕转90°，这种波还算横波吗？',
      'Flick a rope: the bend travels away while your hand moves up and down. Reverse propagation in the animation. Will the gold marker start running along the rope? Rotate the screen 90°. Is the wave still transverse?',
    ],
    prediction: [
      '把传播从向右换成向左，标记的振动方向相对传播方向？',
      'Reverse propagation from right to left. Marker oscillation relative to propagation?',
    ],
    predictions: [
      ['变成平行', 'Becomes parallel'],
      ['仍然垂直', 'Remains perpendicular'],
      ['标记停止振动', 'Marker stops oscillating'],
    ],
    explore: [
      '完整观察向右、向左、更快向右三组。看水平传播箭头与黄色标记的竖直运动。用检查进度找标记转向的时刻：此时局部速度可以为0，但波峰仍在前进。自由波速变化时，比较波长与固定0.5 Hz。',
      'Observe rightward, leftward and faster rightward patterns. Compare the horizontal propagation arrow with vertical marker motion. Find a marker turning point: its instantaneous velocity can be zero while the crest still travels. Change free wave speed and compare wavelength at fixed 0.5 Hz.',
    ],
    concept: [
      '横波的局部振动方向垂直于传播方向。“横”是两个方向的关系，和屏幕横竖没有固定联系。波速c是形状沿介质移动的速率，标记速度是它上下位移随时间的变化，两者不在同一方向，也不必相等。理想弦上周期性波形持续通过，标记绕自己的平衡位置来回。',
      'Transverse means local oscillation is perpendicular to propagation. It is a relationship between directions, independent of how you rotate a screen. Wave speed c describes travel of the shape along the medium; marker velocity describes change of its vertical displacement. They have different directions and need not match. A periodic pattern passes along the ideal string while its marker oscillates around equilibrium.',
    ],
    example: [
      '向右组c=1 m/s、f=0.5 Hz、λ=2 m，4 s内指定波峰前进4 m，标记横坐标仍为4 m。向左组指定峰从8 m移到4 m，标记仍只上下动。更快组c=2 m/s而f不变，波长变成4 m，不是标记水平跑得更快。',
      'Rightward c=1 m/s, f=0.5 Hz, λ=2 m: the tracked crest travels 4 m in 4 s while the marker keeps x=4 m. The leftward tracked crest moves from 8 m to 4 m, yet the marker remains vertically moving. At c=2 m/s with unchanged frequency, wavelength becomes 4 m, rather than the marker running horizontally faster.',
    ],
    misconception: [
      '“波向上就是纵波，向右就是横波。”必须同时指出振动方向和传播方向。也不能看到波峰速度1 m/s，就给黄色标记贴上同一个速度：在最大位移处，标记瞬时速度为0。',
      '“Upward waves are longitudinal; rightward waves are transverse.” Specify both oscillation and propagation. A crest speed of 1 m/s does not give the marker the same velocity; its instantaneous velocity is zero at maximum displacement.',
    ],
    realWorld: [
      '琴弦与拉紧绳子的横向振动提供横波例子；琴弦传给空气的声音则主要是纵波。相邻介质可以有不同振动方式，不能从看见琴弦上下动就断言空气也上下动。',
      'Guitar strings and stretched ropes provide transverse examples; sound they transmit into air is mainly longitudinal. Different media can support different motion, so an up-and-down string does not mean air moves up and down.',
    ],
    summary: [
      '横波：比较方向，不比较屏幕朝向；分开波速与局部速度。',
      'Transverse: compare directions, not screen orientation; separate wave speed from local velocity.',
    ],
    homeExperiment: [
      '画一段绳和两条箭头，一条表示波向右，一条表示标记上下。把整张纸转90°再解释为什么依旧垂直。最后写一条“标记速度0、波速不为0”的可能情境。',
      'Draw a string with propagation and marker-motion arrows. Rotate the paper 90° and explain why they remain perpendicular. Describe a possible instant with zero marker velocity and nonzero wave speed.',
    ],
    vocabulary: [
      ['横波', 'transverse wave'],
      ['垂直', 'perpendicular'],
      ['局部速度', 'local velocity'],
      ['波峰', 'crest'],
    ],
    formula: [
      '横波：局部振动 ⟂ 传播；c与∂u/∂t分开',
      'Transverse: oscillation ⟂ propagation; separate c and ∂u/∂t',
    ],
    questions: [
      [
        '波向左传播，绳标记上下振动，这是？',
        'A wave travels left; string markers move vertically. This is?',
        [
          ['纵波', 'Longitudinal'],
          ['横波', 'Transverse'],
          ['无法有波', 'No wave is possible'],
        ],
        1,
        '上下与向左仍垂直，传播的正负方向不会改变这一关系。',
        'Vertical motion remains perpendicular to leftward propagation; reversing its sign does not change the relationship.',
      ],
      [
        '标记到达最大位移时，哪种情况可以成立？',
        'At maximum marker displacement, what can occur?',
        [
          [
            '标记速度0，波形仍传播',
            'Zero marker velocity; pattern still travels',
          ],
          ['波形必然停住', 'Pattern must stop'],
          ['整条绳停止运动', 'Whole string stops moving'],
        ],
        0,
        '转向时标记的瞬时局部速度为0，不影响不同位置的相继变化。',
        'The marker’s instantaneous velocity is zero as it reverses, without stopping successive changes elsewhere.',
      ],
      [
        '把整张图转90°，波的分类？',
        'Rotate the whole diagram 90°. Classification?',
        [
          ['变成纵波', 'Becomes longitudinal'],
          ['不能分类', 'Cannot classify'],
          [
            '仍是横波，方向关系没变',
            'Still transverse; directions remain perpendicular',
          ],
        ],
        2,
        '分类由两个物理方向的相对关系决定，不由纸张的方向决定。',
        'Classification uses relative physical directions rather than paper orientation.',
      ],
    ],
    exit: [
      '琴弦上下振动产生空气中的声音，可以直接认定空气也作横向振动吗？',
      'Can a vertically vibrating string prove that its sound in air is transverse?',
      [
        [
          '不能，需查看空气自身的振动与传播方向',
          'No: examine air motion relative to propagation',
        ],
        ['能，所有波都同方向振动', 'Yes: all waves oscillate the same way'],
        [
          '能，横波不能转移给其他介质',
          'Yes: transverse waves cannot couple to another medium',
        ],
      ],
      0,
      '看清当前研究的介质；琴弦与空气可以采用不同的振动方式。',
      'Identify the medium under study; string and air can have different oscillation modes.',
    ],
  }),
  make({
    id: 'waves-a-compression-not-a-courier',
    kind: 'waves-longitudinal',
    minutes: 24,
    title: [
      '挤密的地方向前走，弹簧圈也一路向前吗？',
      'Compressions travel. Do the spring coils travel all the way?',
    ],
    subtitle: [
      '从相邻间距看纵波，正确读懂位移图。',
      'Read longitudinal waves through neighbour spacing and displacement graphs.',
    ],
    hook: [
      '把长弹簧轻轻压一下再放开，挤密的那一段会向远处走。给其中一圈涂颜色：它会随挤密区域走到终点吗？动画下方又画了一条上下起伏的曲线，那真的表示弹簧圈上下动吗？',
      'Compress a long spring gently and release. The crowded region travels away. Mark one coil: does it follow that region to the end? A wavy graph appears below. Does that mean the coils actually move up and down?',
    ],
    prediction: [
      '疏密区域向右传播，黄色标记的实际运动方向？',
      'Spacing variations propagate rightward. Actual gold-marker motion?',
    ],
    predictions: [
      ['上下往返', 'Up and down'],
      ['水平往返', 'Horizontal back and forth'],
      ['只向右，不返回', 'Only rightward, never returning'],
    ],
    explore: [
      '完整比较两种波长与较大振幅。紫色点表示压缩区域，浅蓝点表示稀疏区域；黄色是同一个材料标记。检查不同时间，读局部密度比与水平位移。自由振幅改变疏密程度；时间图的纵坐标u是水平位移，小窗声明放大显示比例。',
      'Observe both wavelengths and the larger amplitude. Purple marks compressed regions, blue expanded regions; gold remains one material marker. Inspect times and read density ratio and horizontal displacement. Free amplitude changes spacing contrast. Graph height u means horizontal displacement; the inset declares its display scale.',
    ],
    concept: [
      '纵波的局部振动方向平行于传播方向，但不意味着物质只往传播方向跑。各标记绕平衡位置水平往返，相邻标记的位移差使一段变密或变疏。本模型从平衡坐标x给粒子实际位置X=x+u；局部间距比例是1+∂u/∂x，密度与它成反比。位移最大的标记不一定处在最密区：疏密取决于相邻位移的变化，不只取决于某一个标记偏得多远。',
      'Longitudinal means oscillation is parallel to propagation, not that material only runs forward. Markers move back and forth around equilibrium; differences between neighbours’ displacements change their spacing. The model maps equilibrium x to actual X=x+u. Local spacing scales with 1+∂u/∂x and density inversely with that factor. A maximally displaced marker need not lie in a compression: spacing depends on displacement differences, not one marker’s displacement alone.',
    ],
    example: [
      '第一组A=0.08 m、λ=2 m、c=1 m/s。x=4 m的标记在t=0位移+0.08 m，瞬时速度0，局部密度比1；此时偏得最远却没有局部压缩。在t=0.5 s，标记位移0，局部密度比约0.7992。图的上下高度只是记录这段水平位移，不是实际运动轨迹。',
      'First comparison A=0.08 m, λ=2 m, c=1 m/s. At x=4 m and t=0, displacement is+0.08 m, instantaneous velocity zero and density ratio 1: maximum displacement without local compression. At 0.5 s, displacement is zero and density ratio about 0.7992. Graph height records horizontal displacement rather than an actual upward path.',
    ],
    misconception: [
      '“纵波曲线有波峰，所以空气会上下跑。”曲线横轴是平衡位置或时间，纵轴是带符号的水平位移。另一个常见误读是“位移峰就是最密区”：请比较相邻粒子间距，而不是只看一个粒子。',
      '“A longitudinal graph has peaks, so air moves up and down.” Its horizontal axis is equilibrium position or time, and height is signed horizontal displacement. Another error is calling a displacement peak the densest region: compare neighbour spacing rather than one particle.',
    ],
    realWorld: [
      '空气中的声波传播压缩与稀疏，空气分子作局部运动。这里用放大的连续介质示意让间距可见，没有求解真实空气压力、分子碰撞或精确声能。声学单元会进一步连接频率、音调与响度。',
      'Sound in air propagates compression and rarefaction through local molecular motion. This enlarged continuum illustration makes spacing visible; it does not solve real-air pressure, molecular collisions or exact acoustic energy. The sound unit will connect frequency, pitch and loudness.',
    ],
    summary: [
      '纵波看平行方向，疏密看相邻间距，曲线高度看坐标含义。',
      'Longitudinal: parallel directions; compression: neighbour spacing; graph height: read its coordinate meaning.',
    ],
    homeExperiment: [
      '在纸上画9个等距点，代表弹簧圈的平衡位置。给每点画一段不同的水平位移，得到新位置，圈出挤密与稀疏处。再把位移大小画成曲线，解释曲线上“高”为什么不代表圈向上走。',
      'Draw 9 equally spaced equilibrium points. Assign different horizontal displacements, mark their new positions and circle crowded and expanded regions. Graph those displacements and explain why a high graph value does not mean upward coil motion.',
    ],
    vocabulary: [
      ['纵波', 'longitudinal wave'],
      ['压缩', 'compression'],
      ['稀疏', 'rarefaction'],
      ['应变', 'strain'],
    ],
    formula: [
      '纵向位置X=x+u；疏密由相邻位移差决定',
      'Longitudinal position X=x+u; spacing follows neighbour displacement differences',
    ],
    questions: [
      [
        '纵波标记的振动方向与传播方向？',
        'Longitudinal oscillation relative to propagation?',
        [
          ['平行', 'Parallel'],
          ['垂直', 'Perpendicular'],
          ['一定没有振动', 'No oscillation'],
        ],
        0,
        '平行允许标记向前与向后往返，不表示它只向前搬运。',
        'Parallel permits forward and backward oscillation rather than one-way transport.',
      ],
      [
        '纵波位移图的纵坐标u表示？',
        'Vertical coordinate u on this longitudinal graph means?',
        [
          ['真实竖直高度', 'Actual vertical height'],
          ['波的传播距离', 'Wave travel distance'],
          ['带符号的水平位移', 'Signed horizontal displacement'],
        ],
        2,
        '先读图的变量定义，图形高度不是实际运动方向。',
        'Read the variable definition; graph height is not the physical direction of motion.',
      ],
      [
        '判断哪处更密，最有用的证据？',
        'Best evidence for a more compressed region?',
        [
          ['一个标记偏得多远', 'How far one marker moves'],
          [
            '相邻材料标记的间距',
            'Spacing between neighbouring material markers',
          ],
          ['屏幕上曲线颜色', 'Graph colour alone'],
        ],
        1,
        '相邻位移差改变间距；一个点的位移极值不能独自判定密度极值。',
        'Neighbour displacement differences change spacing; one displacement extreme does not determine a density extreme.',
      ],
    ],
    exit: [
      '弹簧压缩区走过3 m，能推断同一圈弹簧也净前进3 m吗？',
      'A spring compression travels 3 m. Does one coil also move 3 m forward overall?',
      [
        ['不能，要独立追踪材料标记', 'No: track material independently'],
        ['能，压缩区就是这圈', 'Yes: that compression is this coil'],
        [
          '能，纵波必定只向前运动',
          'Yes: longitudinal motion is always forward',
        ],
      ],
      0,
      '扰动的传播行程与同一物质标记的位移是不同记录。',
      'Disturbance travel and displacement of one material marker are different records.',
    ],
  }),
  make({
    id: 'waves-a-ruler-for-the-same-phase',
    kind: 'waves-wavelength',
    minutes: 22,
    title: [
      '两个波峰之间，尺子量的是什么？',
      'What does a ruler between two crests measure?',
    ],
    subtitle: [
      '冻结同一时刻，分清波长、振幅和峰谷间距。',
      'Freeze one instant to distinguish wavelength, amplitude and crest–trough separation.',
    ],
    hook: [
      '一张绳波照片里有好多重复小山。选哪两个点才算一个完整重复？从山顶到谷底只跨了半个形状。现在换一把尺：沿绳量，还是从平衡线向上量？',
      'A rope-wave photograph has repeated hills. Which two points enclose one full repeat? Crest to trough covers half the shape. Where should your ruler run: along the rope or upward from equilibrium?',
    ],
    prediction: [
      '同一时刻，从一个波峰到相邻波谷的水平距离是？',
      'At one instant, horizontal distance from a crest to its adjacent trough?',
    ],
    predictions: [
      ['一个波长λ', 'One wavelength λ'],
      ['半个波长λ/2', 'Half a wavelength λ/2'],
      ['振幅A', 'Amplitude A'],
    ],
    explore: [
      '完整观察λ=1、2、3 m。上方横尺始终连接两个相邻波峰。拖动检查时间，注意这两个峰在走，但它们的相邻间隔不变。自由波长变为0.5 m与3 m，比较10 m视窗里的重复数量以及自动变化的源频率。',
      'Observe λ=1,2,3 m. The horizontal ruler always connects adjacent crests. Inspect time: the crests move while their separation stays fixed. Set free wavelength to 0.5 and 3 m and compare repeats in the 10 m window and the automatically adjusted source frequency.',
    ],
    concept: [
      '波长λ是同一时刻沿传播方向的一个空间重复长度；相邻同相点之间隔一个λ。相邻波峰与相邻波谷都可以量；不能随便找两个同高点，因为它们可能处在相反变化方向。从峰到相邻谷是λ/2。振幅则是局部最大位移，方向与本横波的波长尺不同。固定无色散介质c=1 m/s时，设定波长会同时要求源频率f=c/λ变化。',
      'Wavelength λ is one spatial repeat along propagation at one instant; adjacent same-phase points are separated byλ. Adjacent crests or troughs work, but two equal heights can correspond to opposite phases. Crest to adjacent trough spansλ/2. Amplitude is maximum local displacement, measured in a different direction for this transverse wave. With fixed nondispersive c=1 m/s, selecting wavelength also requires source frequency f=c/λ to change.',
    ],
    example: [
      'λ=2 m时，峰到相邻峰2 m，峰到相邻谷1 m；振幅仍0.01 m。改成λ=1 m，这两个水平距离分别变成1与0.5 m，源频率从0.5变为1 Hz。波速仍1 m/s。不是绳的波长更短就会自己跑得更快。',
      'At λ=2 m, adjacent crests are 2 m apart and crest–trough spacing is 1 m; amplitude remains 0.01 m. Selecting λ=1 m gives 1 and 0.5 m, while source frequency rises from 0.5 to 1 Hz. Wave speed stays 1 m/s: a shorter wavelength does not make this string wave travel faster.',
    ],
    misconception: [
      '“任意两个同高度的点间距就是波长。”平衡线上的上行与下行交点同高，却常相隔半波长。找完整形状的重复，或找相邻波峰；也别把波峰在几秒内走的路程叫波长，除非明确时间恰好一个周期。',
      '“Any two equal heights are one wavelength apart.” Rising and falling equilibrium crossings have equal height but can be half a wavelength apart. Look for a full repeated shape or adjacent crests. Crest travel over an arbitrary time is not wavelength unless that time is exactly one period.',
    ],
    realWorld: [
      '观察水面照片时，波纹间隔能提供空间尺度线索；但真实水波可能色散，不必像这根理想弦一样恒定波速。天线与光栅也依赖波长，后续会把这个空间尺用于电磁波与衍射。',
      'Ripple spacing in a water photograph gives spatial clues, although real water waves may disperse rather than share this ideal string’s constant speed. Antennas and gratings also depend on wavelength; later we use this spatial ruler for electromagnetic waves and diffraction.',
    ],
    summary: [
      '同一时刻，量完整空间重复；λ、λ/2和A各有自己的尺。',
      'At one instant, measure a full spatial repeat; λ, λ/2 and A have distinct rulers.',
    ],
    homeExperiment: [
      '画三段相同大小的重复波形，标出相邻峰、相邻谷和两次相反方向的平衡交点。给每段距离写λ或λ/2，再用另一颜色从平衡线量A。解释为什么两种尺不能混用。',
      'Draw three repeated waves. Mark adjacent crests, adjacent troughs and opposite-direction equilibrium crossings. Label intervals λ orλ/2, then measure A from equilibrium in another colour. Explain why the two rulers cannot be mixed.',
    ],
    vocabulary: [
      ['波长', 'wavelength'],
      ['同相', 'same phase'],
      ['波谷', 'trough'],
      ['空间重复', 'spatial repeat'],
    ],
    formula: [
      'λ=相邻同相点的空间间隔；峰到相邻谷λ/2',
      'λ=spatial spacing of adjacent same-phase points; crest–trough λ/2',
    ],
    questions: [
      [
        'λ=3 m，峰到相邻谷的水平距离？',
        'λ=3 m. Horizontal crest–adjacent-trough spacing?',
        [
          ['3 m', '3 m'],
          ['0.25 m', '0.25 m'],
          ['1.5 m', '1.5 m'],
        ],
        2,
        '一个完整空间重复有一个峰和一个谷，峰谷间隔是3/2=1.5 m。',
        'One spatial repeat contains a crest and trough; their spacing is 3/2=1.5 m.',
      ],
      [
        '量波长时，应先固定什么？',
        'What should be held fixed when measuring wavelength?',
        [
          ['同一时刻', 'One instant'],
          ['同一材料标记', 'One material marker'],
          ['任意不同时间的峰', 'Peaks at arbitrary different times'],
        ],
        0,
        '波长是空间比较，要在同一时刻比较两个不同位置的同相点。',
        'Wavelength compares space: compare same-phase positions at one instant.',
      ],
      [
        'c=1 m/s，波长从2 m变1 m，频率会？',
        'At c=1 m/s, λ changes 2 m→1 m. Frequency?',
        [
          ['减半', 'Halves'],
          ['翻倍', 'Doubles'],
          ['必定不变', 'Must stay fixed'],
        ],
        1,
        '同波速c=fλ，波长减半时频率从0.5变1 Hz。',
        'At fixed c=fλ, halving wavelength changes frequency from 0.5 to 1 Hz.',
      ],
    ],
    exit: [
      '照片里同高的两点，能不检查方向就认定相隔一个λ吗？',
      'Can two equal heights in a photograph prove one-λ separation without checking phase?',
      [
        ['不能，还要检查完整重复与相位', 'No: check full repetition and phase'],
        ['能，同高就同相', 'Yes: equal height means equal phase'],
        ['能，高度就是波长', 'Yes: height is wavelength'],
      ],
      0,
      '同高可能对应相反相位关系。相邻同相点才隔一个完整波长。',
      'Equal height can correspond to different phase; adjacent same-phase points enclose one full wavelength.',
    ],
  }),
  make({
    id: 'waves-one-marker-two-clocks',
    kind: 'waves-clock',
    minutes: 22,
    title: [
      '一秒两次，和一次两秒，是一回事吗？',
      'Two cycles per second, or two seconds per cycle?',
    ],
    subtitle: [
      '同一个标记，把频率与周期放在两本时间账里。',
      'One marker, two time ledgers: frequency and period.',
    ],
    hook: [
      '你拍手的节奏可以说“每秒两下”，也可以说“每一下隔多久”。看绳上标记完成一个完整往返：从最高处到最低处算一次吗？把频率调高，为什么一个周期反而更短？',
      'A clapping rhythm can mean two claps per second or a time interval per clap. Watch a string marker complete one cycle. Is a trip from top to bottom one full cycle? Why does a higher frequency give a shorter period?',
    ],
    prediction: [
      '标记频率从0.5 Hz改为2 Hz，它的周期？',
      'Marker frequency changes 0.5 Hz→2 Hz. Its period?',
    ],
    predictions: [
      ['变长四倍', 'Four times longer'],
      ['不变', 'Unchanged'],
      ['变为四分之一', 'One quarter as long'],
    ],
    explore: [
      '完整观察0.5、1、2 Hz，模型用时都4 s。对照频率、周期、完整次数与n=ft。检查中途时刻，看不足一个完整周期的部分如何保留为小数，而完整次数只记完成的往返。自由频率试0.75 Hz，先预测4 s能完成几次。',
      'Observe 0.5,1,2 Hz over the same 4 s. Compare frequency, period, completed cycles and n=ft. Inspect a partial cycle: the cycle count retains a fraction while completed cycles count only full returns. Try free 0.75 Hz and predict the number in 4 s.',
    ],
    concept: [
      '频率f是单位时间的完整周期次数，单位Hz=s⁻¹；周期T是一次完整重复用的时间，单位s。它们是同一节奏的互为倒数描述：f=1/T。完整振动要回到相同位置和相同运动状态，从最高到最低只过了半周期。时间图跟踪同一标记，空间图在同一时刻看多个位置，两种图不能把横轴混读。',
      'Frequency f counts complete cycles per unit time, measured in Hz=s⁻¹. Period T measures time per complete repeat, in seconds. They describe the same rhythm reciprocally: f=1/T. A full oscillation returns to the same position and motion state; top to bottom is half a period. A time graph follows one marker; a spatial graph compares places at one instant. Their horizontal axes differ.',
    ],
    example: [
      '4 s内，0.5 Hz完成2周期，T=2 s；1 Hz完成4周期，T=1 s；2 Hz完成8周期，T=0.5 s。自由0.75 Hz时T=4/3 s，4 s恰好3周期；检查到1 s时n=0.75，完整周期数仍0，而不是没有发生运动。',
      'In 4 s,0.5 Hz completes 2 cycles with T=2 s;1 Hz completes 4 with T=1 s;2 Hz completes 8 with T=0.5 s. At 0.75 Hz, T=4/3 s and 4 s contains 3 cycles. At 1 s, n=0.75 and completed cycles remain zero, although motion has occurred.',
    ],
    misconception: [
      '“频率越大，周期越大。”一个问每秒几次，另一个问每次几秒，变化相反。“最高到最低算一次”也会把次数算成两倍。初始位置不同不改变周期，完整往返要同时核对位置与运动状态。',
      '“Higher frequency means a longer period.” One asks cycles per second, the other seconds per cycle, so they change oppositely. Counting top-to-bottom as a full cycle doubles the count. A different starting position does not change period; check both position and motion state for a full return.',
    ],
    realWorld: [
      '乐器弦、摆与重复机械动作都可以用这两本时间账描述。音乐中的每分钟拍数要先除以60才能得到每秒拍数；每拍也不一定就是声波的一次振动，节拍频率和声音频率是不同层次。',
      'Strings, pendulums and repetitive mechanisms can use these two ledgers. Beats per minute must be divided by 60 to give beats per second; a musical beat is not necessarily one sound-wave oscillation. Rhythm and acoustic frequency describe different scales.',
    ],
    summary: [
      'f问每秒几次；T问每次几秒；完整周期要回到相同状态。',
      'f asks cycles per second; T asks seconds per cycle; a full cycle returns to the same state.',
    ],
    homeExperiment: [
      '轻摆一个小物体，计10个完整往返的总时间，除以10得到T，再算1/T。重做一次并保留两次记录。写明你从哪个状态开始与结束计数；别把单程算完整往返。',
      'Gently swing a small object, time 10 complete cycles, divide by 10 for T, then calculate 1/T. Repeat and keep both records. State the starting and ending motion state; do not count a one-way trip as a full cycle.',
    ],
    vocabulary: [
      ['频率', 'frequency'],
      ['周期', 'period'],
      ['赫兹', 'hertz'],
      ['完整周期', 'complete cycle'],
    ],
    formula: [
      'f=1/T；n=ft（周期数可含小数）',
      'f=1/T; n=ft (cycle count may include a fraction)',
    ],
    questions: [
      [
        'f=2 Hz，一个完整周期多久？',
        'f=2 Hz. Time for one full cycle?',
        [
          ['2 s', '2 s'],
          ['1 s', '1 s'],
          ['0.5 s', '0.5 s'],
        ],
        2,
        'T=1/f=1/2 s；频率的单位是每秒次数，不是秒。',
        'T=1/f=1/2 s. Frequency counts cycles per second rather than seconds.',
      ],
      [
        '从最高处到最低处，经历多少周期？',
        'Top to bottom spans how many cycles?',
        [
          ['半个周期', 'Half a cycle'],
          ['一个周期', 'One cycle'],
          ['两个周期', 'Two cycles'],
        ],
        0,
        '还需要回到最高处才完成同一状态的完整重复。',
        'It must return to the top to complete a full repeat of that state.',
      ],
      [
        '0.75 Hz观察4 s，周期数？',
        '0.75 Hz over 4 s gives how many cycles?',
        [
          ['0.1875', '0.1875'],
          ['3', '3'],
          ['5.3333', '5.3333'],
        ],
        1,
        'n=ft=0.75×4=3。先确认相乘后的单位无量纲。',
        'n=ft=0.75×4=3; cycles per second times seconds gives a dimensionless count.',
      ],
    ],
    exit: [
      '同一摆10个完整周期用了15 s，周期是多少？',
      'Ten complete pendulum cycles take 15 s. Period?',
      [
        ['1.5 s', '1.5 s'],
        ['15 s', '15 s'],
        ['0.6667 s', '0.6667 s'],
      ],
      0,
      '总时间除以次数给每次时间15/10=1.5 s；0.6667对应频率Hz。',
      'Divide total time by cycles:15/10=1.5 s per cycle;0.6667 is the frequency in Hz.',
    ],
  }),
  make({
    id: 'waves-a-bigger-motion-not-a-faster-clock',
    kind: 'waves-amplitude',
    minutes: 23,
    title: [
      '甩得更高，波就更快了吗？',
      'A bigger flick: does the wave travel faster?',
    ],
    subtitle: [
      '只改振幅，对照峰谷差与理想弦的能量传递。',
      'Change only amplitude; compare peak-to-trough span and ideal-string power.',
    ],
    hook: [
      '轻轻甩绳和用更大的动作甩绳，波看起来很不一样。区别是高低、节奏，还是传播快慢？把介质条件和节奏固定，只让动作变大，看看哪些读数真的会变。',
      'Small and large rope flicks look different. Is the difference height, rhythm or propagation speed? Hold medium conditions and rhythm fixed, enlarge only the motion, and see which readings actually change.',
    ],
    prediction: [
      '同理想弦、同频率，振幅翻倍，波速会？',
      'Same ideal string and frequency: double amplitude. Wave speed?',
    ],
    predictions: [
      ['翻倍', 'Doubles'],
      ['保持不变', 'Remains unchanged'],
      ['减半', 'Halves'],
    ],
    explore: [
      '完整比较A=0.005、0.01、0.02 m。从平衡线到最大位移读A，从波峰到波谷读2A。对照相同的频率、到达时刻与平均传递功率。自由振幅变化时，查看功率—振幅曲线，检验翻倍是两倍还是四倍。',
      'Compare A=0.005,0.01,0.02 m. Read A from equilibrium to maximum displacement and 2 A from peak to trough. Compare unchanged frequency and arrival with mean transmitted power. Change free amplitude and test whether doubling gives two or four times the power.',
    ],
    concept: [
      '振幅A是局部离开平衡位置的最大距离，不是当前位移，也不是峰谷总跨度。在线性理想弦上，波速由张力与线密度决定，固定这些条件和源频率时，改A不改c、f、λ或T。更大的振幅需要更多能量传递；正弦弦波平均功率P̄=½μc(2πf)²A²。在这一公平比较里功率与A²成正比，不是与A成正比。',
      'Amplitude A is the greatest local distance from equilibrium, not current displacement or total peak-to-trough span. On a linear ideal string, speed depends on tension and linear density. With those and source frequency fixed, changing A leaves c,f,λ,T unchanged. Larger amplitude requires more energy transfer: sinusoidal-string mean power P̄=½μc(2πf)²A². In this controlled comparison, power scales with A² rather than A.',
    ],
    example: [
      'μ=0.25 kg/m、c=1 m/s、f=0.5 Hz时，A=0.005 m的平均功率约30.84 μW，A=0.01 m为123.37 μW，A=0.02 m为493.48 μW。每次振幅翻倍，平均功率四倍；但周期始终2 s，波长始终2 m。',
      'With μ=0.25 kg/m, c=1 m/s, f=0.5 Hz, mean power is about 30.84 μW at A=0.005 m,123.37 μW at 0.01 m and 493.48 μW at 0.02 m. Each doubling quadruples mean power while period stays 2 s and wavelength 2 m.',
    ],
    misconception: [
      '“波高就是振幅。”如果量的是峰到谷，要除以2才得到本对称波形的A。“能量更多所以一定传播更快”在这个固定介质的线性模型里也不成立。真实很大振幅会使线性近似失效，不能把平方关系无限外推。',
      '“Wave height is amplitude.” A peak-to-trough measurement must be halved for A in this symmetric wave. More energy does not make propagation faster in this fixed-medium linear model. Very large real amplitudes can invalidate linear assumptions, so do not extend the square law without limit.',
    ],
    realWorld: [
      '弹拨琴弦动作大小可以改变振动幅度，但实际声音响度还受频率、距离、空气耦合与听觉影响。这里先学会控制条件，不把弦上的平均功率直接换成“听起来几倍响”。',
      'A larger string pluck can change vibration amplitude, but perceived loudness also depends on frequency, distance, coupling to air and hearing. Learn to control conditions rather than translating string power directly into perceived loudness multiples.',
    ],
    summary: [
      'A量最大偏离；2A量峰谷差；同介质同频率下振幅改能量，不改波速。',
      'A is maximum deviation;2 A is peak-to-trough span. At fixed medium and frequency, amplitude changes energy transfer, not speed.',
    ],
    homeExperiment: [
      '画两列同波长的波形，第二列振幅为第一列两倍，标出各自A与2A。列一张公平比较表：哪些条件固定，哪些量改变？预测平均功率比后，用实验室核对。',
      'Draw two waves with equal wavelength and a twofold amplitude ratio. Mark A and 2 A on both. List held conditions and changed quantities, predict mean-power ratio, then verify in the laboratory.',
    ],
    vocabulary: [
      ['振幅', 'amplitude'],
      ['平衡位置', 'equilibrium position'],
      ['峰谷差', 'peak-to-trough span'],
      ['平均功率', 'mean power'],
    ],
    formula: [
      '峰谷差=2A；同μ、c、f下P̄∝A²',
      'Peak-to-trough span=2 A; at fixed μ,c,f, P̄∝A²',
    ],
    questions: [
      [
        '峰谷差1 m，本对称波的振幅？',
        'Peak-to-trough span 1 m. Amplitude of this symmetric wave?',
        [
          ['1 m', '1 m'],
          ['0.5 m', '0.5 m'],
          ['2 m', '2 m'],
        ],
        1,
        '最大偏离是总峰谷跨度的一半，不是整个跨度。',
        'Maximum deviation is half the full peak-to-trough span.',
      ],
      [
        '只把A翻倍，平均传递功率比例？',
        'Only double A. Mean transmitted-power ratio?',
        [
          ['4', '4'],
          ['2', '2'],
          ['1', '1'],
        ],
        0,
        '固定μ、c、f时P̄含A²，(2A)²/A²=4。',
        'At fixed μ,c,f, power contains A²; (2 A)²/A²=4.',
      ],
      [
        '这组公平比较中哪组量都不变？',
        'Which quantities all stay fixed here?',
        [
          ['振幅与平均功率', 'Amplitude and mean power'],
          ['振幅与峰谷差', 'Amplitude and peak-to-trough span'],
          ['波速、频率与波长', 'Speed, frequency and wavelength'],
        ],
        2,
        '源频率与介质条件固定，所以c、f、λ都不随A变化。',
        'Source frequency and medium conditions stay fixed, leaving c,f,λ independent of A here.',
      ],
    ],
    exit: [
      '想验证振幅对理想弦波功率的影响，优先怎样比较？',
      'How best to test amplitude’s effect on ideal-string power?',
      [
        ['固定介质与频率，只改A', 'Fix medium and frequency; change only A'],
        ['同时改张力、频率与A', 'Change tension, frequency and A together'],
        ['只凭波看起来更高判断快慢', 'Judge speed from apparent height alone'],
      ],
      0,
      '固定公式里其他量，才能把功率变化归因于振幅变化。',
      'Hold the other formula quantities fixed to attribute power changes to amplitude.',
    ],
  }),
  make({
    id: 'waves-the-medium-sets-the-speed',
    kind: 'waves-speed',
    minutes: 24,
    title: [
      '同样的节奏，换一根弦，波速会一样吗？',
      'Same rhythm, different string: same wave speed?',
    ],
    subtitle: [
      '控制张力与每米质量，从传播证据找波速。',
      'Control tension and mass per metre to investigate propagation speed.',
    ],
    hook: [
      '把同一个振动源接到不同的理想弦上，节奏没变，波峰却可以走得更快。是手的节奏规定了速度，还是弦的条件也有份？先让张力改变，再把每米质量改变，看看哪条比较支持你的解释。',
      'Connect one source to different ideal strings. The rhythm stays the same but crests can travel faster. Does source rhythm set speed, or do string conditions matter? Change tension, then mass per metre, and examine the evidence.',
    ],
    prediction: [
      '同线密度，张力从0.25 N变1 N，理想弦波速？',
      'Same linear density: tension 0.25 N→1 N. Ideal-string speed?',
    ],
    predictions: [
      ['四倍', 'Four times'],
      ['两倍', 'Twice'],
      ['不变', 'Unchanged'],
    ],
    explore: [
      '完整观察两组同线密度、不同张力，再看张力相同但线密度四倍的第三组。4 s内指定波峰走了多远？比较c、λ与固定的0.5 Hz。自由张力到两端，留意平方根曲线不是直线。',
      'Observe equal linear density with different tension, then equal tension with fourfold density. How far does the tracked crest travel in 4 s? Compare c,λ and fixed 0.5 Hz. Try both free-tension extremes and see the square-root curve rather than a straight line.',
    ],
    concept: [
      '理想柔弦的波速c=√(F/μ)，F是弦张力，μ是每米质量，不是整根弦总质量。更大的张力提供更强的恢复作用，更大的线密度增加需要改变运动的惯性。因为有平方根，张力四倍使波速两倍；线密度四倍使波速减半。源频率在这组比较中保持不变，波长随c/f调整。各设置是不同稳定介质，不模拟拉弦时复杂的瞬态。',
      'An ideal flexible string has c=√(F/μ), where F is tension and μ is mass per metre rather than total string mass. Greater tension provides stronger restoring action; greater linear density adds inertia. The square root means fourfold tension doubles speed, while fourfold linear density halves it. Source frequency stays fixed, so wavelength adjusts as c/f. Settings represent separate steady media, not complex retensioning transients.',
    ],
    example: [
      'F=0.25 N、μ=0.25 kg/m给c=1 m/s、λ=2 m。F改成1 N、μ不变，c=2 m/s、λ=4 m。再固定F=1 N、μ改成1 kg/m，c回到1 m/s、λ回到2 m。三组源频率都0.5 Hz，不是更快的波一定每秒振动更多。',
      'F=0.25 N and μ=0.25 kg/m give c=1 m/s, λ=2 m. At F=1 N with unchanged μ, c=2 m/s, λ=4 m. Keeping F=1 N but changing μ to 1 kg/m returns c to 1 m/s, λ to 2 m. All sources remain 0.5 Hz; a faster wave need not oscillate more often each second.',
    ],
    misconception: [
      '“张力四倍，波速也四倍。”先看平方根。“频率越高波速一定越大”则忽略了介质。弦、空气、水和光的速度条件并不相同，不能把√(F/μ)当成所有波通用的公式。',
      '“Fourfold tension gives fourfold speed.” Read the square root. “Higher frequency always gives higher speed” overlooks the medium. Strings, air, water and light have different speed conditions; √(F/μ) is not a universal wave-speed formula.',
    ],
    realWorld: [
      '调琴弦张力会影响波速，固定长度的乐器还牵涉端点条件与驻波频率，这会在后续课程展开。今天先把“介质决定速率”与“驱动决定节奏”分开；这里数值不是具体乐器的预测。',
      'Tuning string tension changes wave speed. A fixed-length instrument also involves endpoint conditions and standing-wave frequencies, covered later. Separate medium-controlled speed from source rhythm here; these values are not predictions for a particular instrument.',
    ],
    summary: [
      '同源可以不同波速；先查介质条件，再连接波长。',
      'One source can give different speeds; inspect medium conditions before wavelength.',
    ],
    homeExperiment: [
      '用纸上两张条件卡做预测：①F四倍、μ不变；②F不变、μ四倍。分别画波峰4 s能走的距离与同频率下λ的相对长度。用实验室核对后，说明为什么总质量还需结合弦长度才可得到μ。',
      'Make two condition cards: fourfold F at fixed μ; fourfold μ at fixed F. Predict crest travel in 4 s and relative wavelengths at the same frequency. Verify in the lab, then explain why total mass also requires length to find μ.',
    ],
    vocabulary: [
      ['张力', 'tension'],
      ['线密度', 'linear density'],
      ['波速', 'wave speed'],
      ['无色散', 'nondispersive'],
    ],
    formula: [
      '理想柔弦c=√(F/μ)；μ=m/L',
      'Ideal flexible string c=√(F/μ); μ=m/L',
    ],
    questions: [
      [
        '固定μ，张力四倍，c的比例？',
        'Fixed μ, fourfold tension. Speed ratio?',
        [
          ['2', '2'],
          ['4', '4'],
          ['0.5', '0.5'],
        ],
        0,
        'c与√F成正比，√4=2。',
        'Speed scales with√F and√4=2.',
      ],
      [
        '固定F，线密度四倍，c的比例？',
        'Fixed F, fourfold linear density. Speed ratio?',
        [
          ['4', '4'],
          ['2', '2'],
          ['0.5', '0.5'],
        ],
        2,
        'c与1/√μ成正比，线密度四倍使速率减半。',
        'Speed scales with 1/√μ, so fourfold density halves it.',
      ],
      [
        '0.5 kg均匀弦长2 m，μ是多少？',
        'A uniform 0.5 kg string is 2 m long. Its μ?',
        [
          ['1 kg/m', '1 kg/m'],
          ['0.25 kg/m', '0.25 kg/m'],
          ['0.5 kg', '0.5 kg'],
        ],
        1,
        '每米质量μ=m/L=0.5/2=0.25 kg/m，不能直接把总质量当线密度。',
        'Mass per metre μ=m/L=0.5/2=0.25 kg/m, rather than total mass alone.',
      ],
    ],
    exit: [
      '同源频率0.5 Hz，c从1变2 m/s，波长？',
      'At fixed source 0.5 Hz, c changes 1→2 m/s. Wavelength?',
      [
        ['2 m变4 m', '2 m→4 m'],
        ['始终2 m', 'Always 2 m'],
        ['2 m变1 m', '2 m→1 m'],
      ],
      0,
      'λ=c/f，同频率下波速翻倍，波长也翻倍。',
      'λ=c/f: doubling speed at fixed frequency doubles wavelength.',
    ],
  }),
  make({
    id: 'waves-one-period-one-wavelength',
    kind: 'waves-relation',
    minutes: 24,
    title: [
      '每秒振动更多，波就一定跑更快吗？',
      'More cycles each second: must the wave travel faster?',
    ],
    subtitle: [
      '同一介质，把一个周期与一个波长接起来。',
      'One medium: connect one period with one wavelength.',
    ],
    hook: [
      '同一根理想弦上，慢节奏换成快节奏，波形变得更密。看起来像“赶得更急”，但指定波峰4 s走的距离变了吗？如果它在一个周期里走过一个波长，三个量到底怎样互相约束？',
      'A quicker source makes waves look more crowded on the same ideal string. It may look hurried, but does a tracked crest travel farther in 4 s? If it moves one wavelength in one period, how do the three quantities constrain one another?',
    ],
    prediction: [
      '同无色散介质c固定，源频率翻倍，λ会？',
      'Fixed c in one nondispersive medium: double source frequency. Wavelength?',
    ],
    predictions: [
      ['减半', 'Halves'],
      ['翻倍', 'Doubles'],
      ['一定不变', 'Must stay fixed'],
    ],
    explore: [
      '完整比较0.5、1、1.5 Hz，观察每个指定波峰都以1 m/s传播。对照f、λ、c与乘积fλ。检查一个周期内波峰的位移，再用自由驱动频率2 Hz预测λ。先固定哪个量，再判断另外两者；不要只看公式相乘就说f越大c越大。',
      'Compare 0.5,1,1.5 Hz: each tracked crest travels at 1 m/s. Read f,λ,c and fλ. Inspect crest travel over one period, then predict λ at free 2 Hz. State what is fixed before predicting changes; multiplication alone does not imply higher f means higher c.',
    ],
    concept: [
      '周期T后，波形的相同状态向前移一个λ，所以c=λ/T=fλ。单位检查：Hz×m=(1/s)×m=m/s。公式连接三个量，却不指定哪个独立可调；本课同一理想无色散介质固定c，源改f，λ就相应变化。在改变介质的上一课，f固定，c与λ一起改变。会算比例之前，先说清条件。',
      'After one period T, the same pattern state advances one wavelength λ, so c=λ/T=fλ. Units check: Hz×m=(1/s)×m=m/s. The equation connects three quantities but does not specify which is independently controlled. This lesson fixes c in one nondispersive medium, changes source f and adjusts λ. In the previous medium comparison f stayed fixed while c and λ changed together. State conditions before ratios.',
    ],
    example: [
      'c=1 m/s时，f=0.5 Hz对应T=2 s、λ=2 m；f=1 Hz对应1 s、1 m；f=1.5 Hz对应2/3 s、2/3 m。每组fλ都1 m/s。4 s内频率较高的标记完成更多振动，但每个指定波峰的传播距离都4 m。',
      'At c=1 m/s, f=0.5 Hz gives T=2 s, λ=2 m;1 Hz gives 1 s,1 m;1.5 Hz gives 2/3 s,2/3 m. Every fλ equals 1 m/s. Higher frequency produces more marker oscillations in 4 s while each tracked crest still travels 4 m.',
    ],
    misconception: [
      '“c=fλ，所以提高f一定提高c。”只有λ也固定时才可这样比较；本课介质固定c，λ会缩短。还要分清波形行程ct与波长：4 s不一定一个周期，走过的距离可以是几个波长。色散介质的相速度可能随频率改变，不能把本课固定c当成所有波的绝对规律。',
      '“c=fλ, so raising f must raise c.” That inference also requires fixedλ. Here c is fixed and λ shortens. Distinguish pattern distance ct from wavelength:4 s may contain several periods. Phase speed can depend on frequency in dispersive media; this constant-c model is not an absolute rule for all waves.',
    ],
    realWorld: [
      '声音从一种介质进入另一种介质时，传播条件变化，频率与波长的关系需要重新核对。后续折射课会用同样的“先固定条件”思路，不靠死背“哪一个变大”。',
      'When sound enters another medium, propagation conditions change and frequency–wavelength relations need rechecking. Refraction lessons will reuse the habit of identifying held conditions instead of memorising which quantity gets larger.',
    ],
    summary: [
      '一个周期前进一个波长；先说固定条件，再使用c=fλ。',
      'One period advances one wavelength; state fixed conditions before using c=fλ.',
    ],
    homeExperiment: [
      '做三张“同弦频率”卡，写f=0.5、1、2 Hz和c=1 m/s，算T与λ，画4 s内波峰行程。再做一张“换介质”卡：f不变、c翻倍。用两种卡解释同一个公式为什么给出不同的变化关系。',
      'Make same-string cards for f=0.5,1,2 Hz at c=1 m/s. Calculate T,λ and crest travel in 4 s. Add a new-medium card with fixed f and doubled c. Explain why one equation gives different change relationships under different conditions.',
    ],
    vocabulary: [
      ['驱动频率', 'driving frequency'],
      ['相速度', 'phase speed'],
      ['波长关系', 'wavelength relation'],
      ['固定条件', 'held conditions'],
    ],
    formula: ['c=λ/T=fλ；固定c时λ=c/f', 'c=λ/T=fλ; at fixed c, λ=c/f'],
    questions: [
      [
        'c=1 m/s、f=2 Hz，λ是多少？',
        'c=1 m/s, f=2 Hz. Wavelength?',
        [
          ['2 m', '2 m'],
          ['1 m', '1 m'],
          ['0.5 m', '0.5 m'],
        ],
        2,
        'λ=c/f=1/2 m，频率高不表示本介质的波速更高。',
        'λ=c/f=1/2 m; a higher frequency does not give this medium a higher speed.',
      ],
      [
        '一个周期内，相同波形状态走多远？',
        'How far does the same pattern state travel in one period?',
        [
          ['一个波长', 'One wavelength'],
          ['一个振幅', 'One amplitude'],
          ['半个波长', 'Half a wavelength'],
        ],
        0,
        'cT=λ，这是将空间重复和时间重复连起来的关系。',
        'cT=λ connects spatial repetition with temporal repetition.',
      ],
      [
        'c=fλ里，Hz×m得到什么单位？',
        'What unit does Hz×m give in c=fλ?',
        [
          ['m²', 'm²'],
          ['m/s', 'm/s'],
          ['s/m', 's/m'],
        ],
        1,
        'Hz=s⁻¹，与m相乘得到m/s，符合速率单位。',
        'Hz=s⁻¹, so multiplying by m gives m/s, the unit of speed.',
      ],
    ],
    exit: [
      '同一无色散弦上f翻倍，如何解释波形更密而传播距离不变？',
      'Same nondispersive string: f doubles. Why more crowded waves but unchanged travel distance?',
      [
        [
          'c固定，λ减半；同时间ct不变',
          'Fixed c halves λ; ct stays fixed over equal time',
        ],
        [
          '材料必须水平跑两倍快',
          'Material must run horizontally twice as fast',
        ],
        ['更密必然表示c翻倍', 'Crowding necessarily doubles c'],
      ],
      0,
      '同时追踪频率、波长与指定峰行程，让公式对应真实比较条件。',
      'Track frequency, wavelength and a chosen crest’s travel under the actual held conditions.',
    ],
  }),
];
