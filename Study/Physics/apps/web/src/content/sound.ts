import { t, q, type Lesson } from './schema';
export const soundLessons: Lesson[] = [
  {
    id: 'sound-vibrating-source',
    stage: 2,
    unit: 'sound',
    kind: 'sound-source',
    minutes: 17,
    title: t(
      '橡皮筋出声时，它在做什么？',
      'What is a rubber band doing when it sounds?',
    ),
    subtitle: t(
      '从来回运动找到声源，再追踪一小段信号。',
      'Find the vibrating source, then follow a brief signal.',
    ),
    hook: t(
      '轻拨一根橡皮筋，既能听到声音，又能看到它的影子变宽。轻轻按住后，声音消失。不是橡皮筋跑向耳朵，是什么到达了耳朵？',
      'Pluck a rubber band: you hear a sound and see a blurred edge. Gently hold it and the sound fades. The band does not travel to your ear. What reaches it?',
    ),
    prediction: t(
      '同一声源从未开始振动，周围空气原来安静，会发出这次声音吗？',
      'A source never starts vibrating in initially quiet air. Will it produce this sound?',
    ),
    predictions: [
      t('不会，缺少这次扰动', 'No: this disturbance was not made'),
      t('会，空气自己完成这次声音', 'Yes: air makes this sound itself'),
      t('只要有耳朵就会', 'Yes, whenever an ear exists'),
    ],
    explore: t(
      '完整观察0.10 mm、0.20 mm与从未启动三组。声源在最初10 ms振动两次，之后停止；检查6.86 m处最早何时收到信号。滑动时间探针看看：声源停了，已发出的信号还可以在路上。',
      'Observe 0.10 mm, 0.20 mm and never-started cases. The source vibrates twice in the first 10 ms, then stops. Check when the signal first reaches 6.86 m. Probe the timeline: a signal can still be travelling after its source stops.',
    ),
    concept: t(
      '振动是在平衡位置两侧的来回运动。许多声源通过振动扰动周围介质，再把扰动传开。鼓面、扬声器膜片、声带都能提供这种起点。空气中声波的传播不是声源移动到你面前。停止振动后，已经发出的声音不会在整个空间同时消失。',
      'Vibration is back-and-forth motion about an equilibrium position. Many sound sources disturb a medium by vibrating, and that disturbance spreads. A drumhead, speaker cone or vocal folds can provide the start. Sound propagation does not carry the source to you. Stopping the source does not erase an already emitted sound everywhere at once.',
    ),
    example: t(
      '模型最初10 ms有200 Hz的两次振动；声速规定为343 m/s。6.86÷343=0.020 s=20 ms才开始到达探测点，此时声源已停止。较大振幅不会让最早到达时间改变。',
      'The model emits two 200 Hz cycles in 10 ms at prescribed 343 m/s. The first arrival at 6.86 m is 6.86/343=0.020 s=20 ms, after the source stops. Larger amplitude does not change this first-arrival time.',
    ),
    misconception: t(
      '“声源停止，远处声音立刻消失”忽略传播所需的时间。第三组是从未启动，不是把途中声音删除。图上的标记和振幅被放大，不是空气分子的真实大小或速度。',
      '“Stop the source and distant sound instantly vanishes” misses travel time. The third case never starts; it does not delete a travelling signal. Markers and displacement are enlarged, not real molecular sizes or speeds.',
    ),
    realWorld: t(
      '隔着一段距离看击鼓，鼓面先动，声音后到。说话时声带振动，但不要靠摸或按喉咙控制声音；用普通轻声观察就可以。',
      'At a distance a drum moves before its sound reaches you. Vocal folds vibrate during speech; ordinary quiet speaking is enough to explore, without pressing your throat.',
    ),
    summary: t(
      '振动产生扰动；声源停下后，已发出的声波仍能传播。',
      'Vibration creates a disturbance; an emitted sound can travel after the source stops.',
    ),
    homeExperiment: t(
      '和家人用橡皮筋套住空纸盒，轻拨一次，观察模糊边缘；轻轻接触橡皮筋让它停下，比较声音。不要把橡皮筋拉得很紧或对着脸。写“看见的”与“推测的”。',
      'With a helper, put a rubber band around an empty cardboard box. Gently pluck and observe its blurred edge; lightly touch it to stop it and compare the sound. Keep it loosely stretched and away from faces. Separate observations from explanations.',
    ),
    vocabulary: [
      t('振动', 'vibration'),
      t('声源', 'sound source'),
      t('平衡位置', 'equilibrium position'),
      t('扰动', 'disturbance'),
    ],
    questions: [
      q(
        '扬声器的膜片主要怎样运动？',
        'How does a speaker cone mainly move?',
        [
          ['来回振动', 'Back and forth'],
          ['一直飞向听者', 'Flies to the listener'],
        ],
        0,
        '膜片在原位置附近振动。',
        'It vibrates near its original position.',
      ),
      q(
        '最早到达6.86 m处的模型时间？',
        'First model arrival at 6.86 m?',
        [
          ['10 ms', '10 ms'],
          ['20 ms', '20 ms'],
        ],
        1,
        '6.86 m÷343 m/s=20 ms。',
        '6.86 m / 343 m/s = 20 ms.',
      ),
      q(
        '增大模型振幅，最早到达时间？',
        'Larger model amplitude changes first arrival how?',
        [
          ['不变', 'Unchanged'],
          ['减半', 'Halved'],
        ],
        0,
        '介质和距离保持相同，线性模型声速不变。',
        'Same medium and distance keep the linear-model speed unchanged.',
      ),
    ],
    exit: q(
      '远处有人拍一次手，手已经停下，你才听到。矛盾吗？',
      'Someone far away claps, stops, then you hear it. A contradiction?',
      [
        ['不，声音传播需要时间', 'No: sound needs travel time'],
        ['是，停止就不能再听见', 'Yes: stopping erases sound'],
      ],
      0,
      '已发出的扰动可以继续传播。',
      'An already emitted disturbance can continue travelling.',
    ),
  },
  {
    id: 'sound-medium-local-motion',
    stage: 2,
    unit: 'sound',
    kind: 'sound-medium',
    minutes: 19,
    title: t(
      '声音到了耳边，空气也一路跑来了吗？',
      'Sound reaches your ear. Did the air travel all the way?',
    ),
    subtitle: t(
      '追踪一个有颜色的标记，比较空气、水与真空。',
      'Track a coloured marker in air, water and vacuum.',
    ),
    hook: t(
      '邻居敲一下桌面，扰动能通过空气，也能通过桌子传来。若声波传开是空气一路飞过来，为什么说话不需要持续吹风？',
      'A tap can reach you through air or a table. If sound requires air to fly all the way over, why does talking not require a sustained breeze?',
    ),
    prediction: t(
      '在没有任何物质的真空路径里，这个机械声波能传播吗？',
      'Can this mechanical sound wave cross a path containing no matter?',
    ),
    predictions: [
      t('不能，缺少传播的介质', 'No: the medium is missing'),
      t('能，与空气完全一样', 'Yes, exactly like air'),
      t('会变得更响', 'It becomes louder'),
    ],
    explore: t(
      '完整观察空气、淡水与真空。距离都是6.86 m、声源都是两次200 Hz振动；有颜色的标记只在原位置附近左右移动。虚点表示平衡位置，传播方向向右。真空组的声源照样动，路径没有标记也没有到达信号。',
      'Observe air, fresh water and vacuum over the same 6.86 m path with the same two 200 Hz source cycles. The coloured marker moves around its own starting position. Grey dots mark equilibrium positions; propagation is rightward. In vacuum the source still moves, but the path has no markers or arrival.',
    ),
    concept: t(
      '机械声波需要介质：气体、液体和固体都可能传声。流体中的声波是纵波，局部振动方向与传播方向平行。介质把扰动向邻近处传递，不需要同一团空气从声源走到耳朵。标记代表一小部分介质的有组织振动，省略分子的随机热运动。',
      'Mechanical sound requires a medium; gases, liquids and solids can carry it. Sound in a fluid is longitudinal: local oscillation is parallel to propagation. Neighbouring regions pass on the disturbance; one parcel need not travel from source to ear. Markers represent organised local motion, omitting random thermal molecular motion.',
    ),
    formula: t(
      '单程传播时间 t=d/c；c取决于介质及条件。',
      'One-way travel time t=d/c; c depends on the medium and conditions.',
    ),
    example: t(
      '约20°C空气取343 m/s，淡水取1480 m/s。6.86 m单程分别约20.00 ms与4.64 ms。真空不填0 ms或“无限快”，而是本声波无法传播。',
      'Use 343 m/s in air and 1480 m/s in fresh water near 20°C: 6.86 m takes about 20.00 ms and 4.64 ms. Vacuum means this wave cannot propagate, not zero travel time or infinite speed.',
    ),
    misconception: t(
      '波传播不等于物质整体远行。空气声波不能画成空气上下翻波浪；后面压力–时间图的上下高度代表数值，也不是分子运动路线。真空不能传机械声波，但无线电不是这种波。',
      'Wave propagation is not bulk transport of matter. Air sound is not air moving up and down like a water surface. A later pressure–time graph’s vertical values are not molecular paths. Vacuum cannot carry mechanical sound, but radio is a different wave.',
    ),
    realWorld: t(
      '隔墙能听见敲击，说明声波可以经过固体和空气的路径。宇航员隔着真空用无线电通信；不是声音直接穿过真空。真实界面的反射和能量损失会影响听见多少。',
      'Hearing a knock through a wall shows paths through solids and air. Astronauts communicate across vacuum by radio, not direct sound. Reflection and losses at real interfaces affect how much is heard.',
    ),
    summary: t(
      '介质传递扰动；流体局部来回振动，真空路径不传机械声波。',
      'A medium passes on disturbance; fluid regions oscillate locally, while vacuum carries no mechanical sound.',
    ),
    homeExperiment: t(
      '家人轻轻敲桌面，你先正常听，再把耳朵靠近桌面听；不要用力敲，也不需压住耳朵。写出可能经过桌面与空气的路径，不把听感直接算成声速。',
      'Ask a helper to gently tap a table; listen normally and then with an ear near its surface. Keep taps gentle and do not press your ear. Sketch possible table and air paths; do not calculate speed from a subjective impression.',
    ),
    vocabulary: [
      t('介质', 'medium'),
      t('纵波', 'longitudinal wave'),
      t('真空', 'vacuum'),
      t('传播', 'propagation'),
    ],
    questions: [
      q(
        '标记在声波经过后，是否必须一路到探测点？',
        'Must the marker travel all the way to the detector?',
        [
          ['必须', 'Yes'],
          ['不，围绕原位置振动', 'No, it oscillates locally'],
        ],
        1,
        '传递的是扰动，不是整个标记团远行。',
        'The disturbance travels, not the whole marked parcel.',
      ),
      q(
        '同一距离，本模型哪个先到？',
        'Which arrives first over the same model distance?',
        [
          ['淡水', 'Fresh water'],
          ['空气', 'Air'],
        ],
        0,
        '1480 m/s大于343 m/s；水声源与界面理想化。',
        '1480 m/s exceeds 343 m/s; source and interfaces are idealised.',
      ),
      q(
        '真空组声源还在振动，接收端为什么没有声波？',
        'The source moves in vacuum. Why no received sound?',
        [
          ['缺少传播介质', 'No medium along the path'],
          ['距离变为0', 'Distance becomes zero'],
        ],
        0,
        '路径没有支持这次机械扰动的物质。',
        'There is no matter to support this mechanical disturbance.',
      ),
    ],
    exit: q(
      '太空电影里飞船外的真空直接传来爆炸声，符合这个模型吗？',
      'Does an explosion heard directly through space vacuum fit this model?',
      [
        [
          '不；要有介质路径或转换成无线电信号',
          'No: a medium path or a radio conversion is needed',
        ],
        ['符合，声音不需要介质', 'Yes, sound needs no medium'],
      ],
      0,
      '声波是机械扰动；电影音效不是物理证据。',
      'Sound is a mechanical disturbance; a soundtrack is not physical evidence.',
    ),
  },
  {
    id: 'sound-frequency-and-pitch',
    stage: 2,
    unit: 'sound',
    kind: 'sound-pitch',
    minutes: 18,
    title: t(
      '同样轻的两个音，为什么一个更尖？',
      'Two gentle tones. Why is one higher?',
    ),
    subtitle: t(
      '在相同时间里数振动次数，调整频率并试听。',
      'Count cycles over equal time, adjust frequency and listen.',
    ),
    hook: t(
      '钢琴的高音与低音都可以轻轻弹。高低和大声小声不是同一个旋钮：先只改振动有多快。',
      'Both high and low piano notes can be played softly. Pitch and loudness are different controls. First change only how fast the vibration repeats.',
    ),
    prediction: t(
      '同样的相对压力振幅，200 Hz改成400 Hz，哪种改变更直接？',
      'With the same relative pressure amplitude, 200 Hz changes to 400 Hz. What changes most directly?',
    ),
    predictions: [
      t('音调更高', 'Higher pitch'),
      t('声速加倍', 'Double the sound speed'),
      t('必定响度加倍', 'Exactly double the loudness'),
    ],
    explore: t(
      '完整观察200、400与800 Hz，图的横轴都是0–10 ms、纵轴都是相对压力。拖动频率可自由比较，点一下可试听短音；试听本身不代替完整观察三组。设备音量保持低且不变，不要求听力好坏的判断。',
      'Observe 200, 400 and 800 Hz on shared 0–10 ms and relative-pressure axes. Drag frequency for more comparisons and optionally play a brief tone; listening alone does not replace the three full observations. Keep device volume low and fixed; this is not a hearing assessment.',
    ),
    concept: t(
      '频率是每秒重复的次数，单位Hz。纯音频率通常越高，听到的音调越高；200、400、800 Hz在同样10 ms里分别振动2、4、8次。曲线是一个固定位置的压力变化，不是空气粒子上下走的轨迹。同一空气条件下，小振幅声速近似不随频率改变。',
      'Frequency counts repeats per second in hertz. A higher pure-tone frequency usually gives higher pitch. Over 10 ms, 200/400/800 Hz give 2/4/8 cycles. The curve is pressure at one fixed place, not an up-and-down particle path. Small-amplitude sound speed is approximately independent of frequency in fixed air conditions.',
    ),
    formula: t(
      'f=次数/时间；T=1/f；同一介质中波长λ=c/f。',
      'f=cycles/time; T=1/f; wavelength λ=c/f in a given medium.',
    ),
    example: t(
      '400 Hz每次振动用1/400 s=2.5 ms，10 ms里有4次。空气取343 m/s，波长约0.858 m。改成800 Hz后次数加倍、周期和波长减半，声速仍343 m/s。',
      'At 400 Hz one cycle takes 1/400 s=2.5 ms, giving four in 10 ms. At 343 m/s the wavelength is about 0.858 m. At 800 Hz cycles double and period/wavelength halve; speed stays 343 m/s.',
    ),
    misconception: t(
      '“更尖就是更响”不成立。这里保持相对压力振幅，但耳朵与设备对不同频率的敏感程度可能不同，所以不承诺试听主观响度完全相同。图越密是周期更短，不是传播更快。',
      'Higher pitch does not mean louder. Relative pressure amplitude is held, but ears and devices respond differently to frequency; perceived loudness need not match exactly. A denser time graph means a shorter period, not faster propagation.',
    ),
    realWorld: t(
      '调音器把声音的重复快慢转换成频率，帮助判断音高。真正乐器通常含多个频率，纯音只是起步模型；音色与共振留到后面的波动课程。',
      'A tuner converts repetition rate into frequency to help identify pitch. Real instruments contain several frequencies; a pure tone is a starting model. Timbre and resonance come later.',
    ),
    summary: t(
      '音调联系频率；同一时间振动越多，周期越短，通常音调越高。',
      'Pitch relates to frequency: more cycles in the same time mean shorter periods and usually higher pitch.',
    ),
    homeExperiment: t(
      '用本页短音功能，保持设备音量不变，比较200、400、800 Hz。不能或不想试听时只数图上周期也可以；写下图的证据与自己的听感，别把听感当成分贝测量。',
      'Use the brief tones at fixed device volume to compare 200/400/800 Hz. Counting plotted cycles is enough if listening is unavailable or unwanted. Separate graphical evidence from perception; perception is not a decibel measurement.',
    ),
    vocabulary: [
      t('频率', 'frequency'),
      t('音调', 'pitch'),
      t('周期', 'period'),
      t('波长', 'wavelength'),
    ],
    questions: [
      q(
        '10 ms内振动4次，频率是多少？',
        'Four cycles in 10 ms: what frequency?',
        [
          ['40 Hz', '40 Hz'],
          ['400 Hz', '400 Hz'],
        ],
        1,
        '10 ms=0.010 s；4÷0.010=400 Hz。',
        '10 ms=0.010 s; 4/0.010=400 Hz.',
      ),
      q(
        '200变800 Hz，同空气中声速？',
        '200 becomes 800 Hz in the same air. Sound speed?',
        [
          ['仍近似343 m/s', 'Still about 343 m/s'],
          ['变1372 m/s', 'Becomes 1372 m/s'],
        ],
        0,
        '更高音调不表示声波更快。',
        'Higher pitch does not mean a faster sound wave.',
      ),
      q(
        '图的上下方向代表什么？',
        'What does the graph’s vertical direction represent?',
        [
          ['相对压力变化', 'Relative pressure variation'],
          ['空气上下移动的路线', 'Air moving up and down'],
        ],
        0,
        '横轴为时间，在固定位置读压力。',
        'Time is horizontal; pressure is read at a fixed location.',
      ),
    ],
    exit: q(
      '同一音符轻轻弹或稍重弹，是否必须换成更高音符？',
      'Play the same note gently or somewhat harder. Must it become a higher note?',
      [
        ['不；音调与振幅要分别比较', 'No: pitch and amplitude are separate'],
        ['必须，更响一定更高', 'Yes: louder always means higher'],
      ],
      0,
      '改变响度并不要求改变重复频率。',
      'Changing loudness does not require changing repetition frequency.',
    ),
  },
  {
    id: 'sound-amplitude-and-loudness',
    stage: 2,
    unit: 'sound',
    kind: 'sound-amplitude',
    minutes: 18,
    title: t(
      '同一个音，怎样变得更明显？',
      'How can the same tone become more noticeable?',
    ),
    subtitle: t(
      '固定频率，只改振幅；把音调和响度分开。',
      'Keep frequency fixed and change amplitude; separate pitch and loudness.',
    ),
    hook: t(
      '音量按钮让同一句话更明显，却不会把每个词变成更高的音。模型里只改变压力波动的幅度，会看到什么保持不变？',
      'A volume button makes the same speech more noticeable without turning every word into a higher note. What stays unchanged when only pressure variation grows?',
    ),
    prediction: t(
      '同为400 Hz，相对压力振幅增大，图上什么不变？',
      'At 400 Hz, relative pressure amplitude increases. What stays the same?',
    ),
    predictions: [
      t('10 ms内的4次振动', 'Four cycles in 10 ms'),
      t('曲线高度', 'Curve height'),
      t('音调必定升高', 'Pitch must rise'),
    ],
    explore: t(
      '完整观察相对振幅0.25、0.50与1.00。保持400 Hz、同一时间轴与纵轴，记录次数和波动大小。可拖动振幅并试听短音；音量从低开始，耳朵与设备的反应不作为精确数值。',
      'Observe relative amplitudes 0.25, 0.50 and 1.00 at fixed 400 Hz on shared axes. Retain cycle count and variation size. Optionally drag amplitude and play a brief tone, beginning at low device volume; ears and devices are not precise numerical meters.',
    ),
    concept: t(
      '振幅描述相对平衡值的最大偏离。压力振幅更大，在同介质、同频率、同接收条件下通常听起来更响；响度是听觉感受，也受频率、距离和听者影响。本图的振幅没有Pa或dB标定，不测实际声压级。',
      'Amplitude is maximum deviation from equilibrium. Larger pressure amplitude usually sounds louder at matched medium, frequency and receiving conditions. Loudness is perception, also affected by frequency, distance and the listener. This graph has no Pa or dB calibration and does not measure actual sound level.',
    ),
    example: t(
      '三组都在10 ms振动4次、周期2.5 ms。相对振幅从0.25到0.50翻倍，曲线峰值翻倍；这不等于人感觉“正好两倍响”。归一化示意只适合相同条件比较。',
      'Every case gives four cycles in 10 ms and a 2.5 ms period. Doubling relative amplitude from 0.25 to 0.50 doubles graph peaks, not necessarily perceived loudness. This normalised diagram supports only matched-condition comparisons.',
    ),
    misconception: t(
      '“振幅大，频率也大”混淆了波动大小与重复快慢。增大设备音量不能用于测人的听力；显示的相对振幅与扬声器实际声压之间没有校准。',
      'Greater amplitude does not require greater frequency: variation size and repetition rate differ. Device volume is not a hearing test, and relative plotted amplitude is not calibrated speaker pressure.',
    ),
    realWorld: t(
      '轻敲和普通敲同一鼓面，音色和复杂振动也可能变化；纯音模型先帮我们分开两个因素。控制扬声器输入幅度可以改变声音强弱，房间和距离仍会影响实际听感。',
      'A gentle or ordinary tap on a drum may also change timbre and complex vibration. The pure-tone model first separates two factors. Changing speaker input amplitude can alter sound strength, while room and distance affect perception.',
    ),
    summary: t(
      '振幅描述波动大小，频率描述重复快慢；同条件下，较大压力振幅通常更响。',
      'Amplitude describes variation size; frequency describes repetition rate. Larger pressure amplitude usually sounds louder under matched conditions.',
    ),
    homeExperiment: t(
      '在本页固定400 Hz，低音量比较三个相对振幅；也可以不试听，只画出相同周期、不同高度的图。用文字说明什么改变、什么保持，不能由设备音量估出真实分贝。',
      'At fixed 400 Hz and low device volume, compare the three amplitudes, or simply sketch equal periods with different heights. Explain what changes and stays fixed. Device volume cannot give real decibels.',
    ),
    vocabulary: [
      t('振幅', 'amplitude'),
      t('响度', 'loudness'),
      t('声压', 'sound pressure'),
      t('相同条件', 'matched conditions'),
    ],
    questions: [
      q(
        '400 Hz固定，相对振幅加倍，10 ms次数？',
        'At fixed 400 Hz, amplitude doubles. Cycles in 10 ms?',
        [
          ['8次', '8'],
          ['仍4次', 'Still 4'],
        ],
        1,
        '只改大小，不改重复速度。',
        'Only size changes, not repetition rate.',
      ),
      q(
        '图峰值从0.25变0.50，能说主观响度刚好加倍吗？',
        'Peaks grow 0.25 to 0.50. Exactly double perceived loudness?',
        [
          ['不能', 'No'],
          ['一定', 'Always'],
        ],
        0,
        '听觉感受不是振幅的直接线性读数。',
        'Perception is not a direct linear amplitude reading.',
      ),
      q(
        '比较振幅与响度时，哪个条件应保持？',
        'Which should stay fixed when comparing amplitude and loudness?',
        [
          ['同一频率与接收位置', 'Frequency and receiving location'],
          ['每次改变距离', 'Change distance each time'],
        ],
        0,
        '多因素一起改会使解释不清楚。',
        'Changing several factors confounds interpretation.',
      ),
    ],
    exit: q(
      '两个声音，一个更尖、一个更响。只用一个词“更大”够吗？',
      'One sound is higher, another louder. Is just “bigger” enough?',
      [
        [
          '不，应分开描述音调与响度',
          'No: describe pitch and loudness separately',
        ],
        ['够，它们是同一件事', 'Yes: they are the same'],
      ],
      0,
      '清楚描述有助于设计可比较的证据。',
      'Clear descriptions help design comparable evidence.',
    ),
  },
  {
    id: 'sound-echo-distance-ultrasound',
    stage: 2,
    unit: 'sound',
    kind: 'sound-ranging',
    minutes: 20,
    title: t(
      '回来的声音，怎样告诉我们距离？',
      'How can a returning sound tell us distance?',
    ),
    subtitle: t(
      '追踪往返路径，比较远近与超声脉冲。',
      'Follow the round trip; compare distance and an ultrasonic pulse.',
    ),
    hook: t(
      '停车传感器不用看见障碍物，也能测距离。它不是听声音有多响，而是在一次发出后等回来的信号：等待时间对应单程，还是往返？',
      'A parking sensor can range to an obstacle without seeing it. Rather than judging loudness, it emits and waits for a returning signal. Does the delay represent one trip or two?',
    ),
    prediction: t(
      '障碍物距离加倍，同样空气中的回波时间怎样？',
      'Double obstacle distance in the same air. What happens to echo delay?',
    ),
    predictions: [
      t('加倍', 'Doubles'),
      t('不变', 'Unchanged'),
      t('减半', 'Halves'),
    ],
    explore: t(
      '完整观察17.15 m与34.30 m的2000 Hz信号，再观察同样34.30 m的40000 Hz超声信号。标记是短脉冲的前沿，不是一个空气粒子；滑动时间不替代完整播放。',
      'Observe 2000 Hz signals at 17.15 and 34.30 m, then 40000 Hz ultrasound at the same 34.30 m. The marker is a short pulse’s leading edge, not an air particle. Seeking does not replace full playback.',
    ),
    concept: t(
      '声音遇到边界可能反射；发出与收到回波之间包含去与回两段路。本模型发送与接收在同一位置，障碍物固定、路径直线、空气20°C，声速取343 m/s。超过20000 Hz通常称超声波，人通常听不到，但它仍是需要介质的机械声波。',
      'Sound can reflect at boundaries. Echo delay includes outgoing and returning paths. This model places emitter and receiver together, with a fixed obstacle, straight path and 20°C air at 343 m/s. Above 20000 Hz is conventionally ultrasound, usually beyond human hearing, but still a mechanical wave needing a medium.',
    ),
    formula: t(
      '往返：2d=ct，所以d=ct/2。先把ms换成s。',
      'Round trip: 2d=ct, so d=ct/2. Convert ms to seconds first.',
    ),
    example: t(
      '回波200 ms=0.200 s，路程343×0.200=68.6 m；障碍物单程距离为34.3 m。同距离超声组也用200 ms：在这个不计色散的模型中，频率升高不会把声速放大20倍。',
      'A 200 ms echo is 0.200 s, giving 343×0.200=68.6 m of travel and 34.3 m one-way range. The ultrasonic case also takes 200 ms: frequency does not multiply speed by 20 in this nondispersive model.',
    ),
    misconception: t(
      '“声速×回波时间就是障碍物距离”漏掉返程；“超声就是超级快”混淆频率与速度。真实传感器还受温度、角度、反射强弱和脉冲识别影响，这里不预测是否能测到34 m。',
      'Speed times echo delay misses the return trip. Ultrasound means high frequency, not super speed. Real sensors depend on temperature, angle, reflection strength and pulse detection; this model does not predict detection at 34 m.',
    ),
    realWorld: t(
      '倒车测距、蝙蝠回声定位和水中声呐都利用回波，但介质不同，不能都用343 m/s。医学超声还有组织边界、成像和专业操作，本课只解释往返计时思想。',
      'Parking ranging, bat echolocation and sonar use echoes, but differing media cannot all use 343 m/s. Medical ultrasound also involves tissue interfaces, imaging and professional operation; this lesson explains only round-trip timing.',
    ),
    summary: t(
      '回波走往返两段路；超声是高频声音，测距必须配合介质声速。',
      'Echoes travel out and back; ultrasound is high-frequency sound, and ranging needs the medium’s speed.',
    ),
    homeExperiment: t(
      '看家里的停车传感器外观或生活图片，画出发出—障碍物—返回的路径；无需开动车辆。解释为何除以2，写出真实装置还需要哪些条件。不要自行制作超声发射器。',
      'Look at a household parking sensor or an everyday picture and draw emitter–obstacle–return, without moving a vehicle. Explain division by two and list real-device conditions. No homemade ultrasonic emitter is needed.',
    ),
    vocabulary: [
      t('回波', 'echo'),
      t('反射', 'reflection'),
      t('超声波', 'ultrasound'),
      t('往返时间', 'round-trip time'),
    ],
    questions: [
      q(
        '回波0.100 s，模型障碍物距离？',
        'Echo delay 0.100 s: model distance?',
        [
          ['34.30 m', '34.30 m'],
          ['17.15 m', '17.15 m'],
        ],
        1,
        '343×0.100÷2=17.15 m。',
        '343×0.100/2=17.15 m.',
      ),
      q(
        '哪个是超声？',
        'Which is ultrasound?',
        [
          ['40000 Hz', '40000 Hz'],
          ['2000 Hz', '2000 Hz'],
        ],
        0,
        '40000 Hz超过通常的20000 Hz界限；不是听力测试。',
        '40000 Hz exceeds the conventional 20000 Hz boundary; this is not a hearing test.',
      ),
      q(
        '同空气同距离，模型2000变40000 Hz，回波时间？',
        'Same air and distance: 2000 becomes 40000 Hz. Model echo time?',
        [
          ['不变', 'Unchanged'],
          ['缩短到1/20', 'One twentieth'],
        ],
        0,
        '这里声速由介质和条件决定，忽略色散。',
        'Speed depends on medium and conditions here; dispersion is omitted.',
      ),
    ],
    exit: q(
      '水下声呐回波能直接套空气343 m/s测距吗？',
      'Can underwater sonar use 343 m/s air speed directly?',
      [
        ['不能，需要该水中声速', 'No: use the speed in that water'],
        ['能，所有声音一样快', 'Yes: all sound travels equally fast'],
      ],
      0,
      '公式相同，条件和声速需要适配介质。',
      'The formula is shared; conditions and speed must match the medium.',
    ),
  },
];
