import type { Lesson } from './schema';
import { makeWaveLesson } from './waveLessonFactory';
const make = (draft: Parameters<typeof makeWaveLesson>[0]) =>
  makeWaveLesson(draft, 'acoustics');
export const acousticLessons: Lesson[] = [
  make({
    id: 'acoustics-air-stays-sound-arrives',
    kind: 'acoustics-propagation',
    minutes: 24,
    title: [
      '隔着房间听见拍手，空气跟着跑过来了吗？',
      'When a clap crosses the room, does the air follow?',
    ],
    subtitle: [
      '跟住一小团介质，再跟住一段扰动。',
      'Follow a small parcel of medium, then a travelling disturbance.',
    ],
    hook: [
      '房间另一头拍一下手，你很快听见了，却没有一阵从手掌吹来的风扑到脸上。传来的到底是什么？给一小团空气贴上想象中的标签，看它在原位置附近运动，再看变化怎样到达远处。',
      'Someone claps across the room. You hear it without a gust travelling from their hands to your face. What arrived? Imagine tagging a small parcel of air: follow its local motion and the change reaching farther parcels.',
    ],
    prediction: [
      '声音通过空气传播时，标记的一小团空气怎样运动？',
      'As sound travels through air, what does a tagged parcel do?',
    ],
    predictions: [
      ['一路跑到耳朵', 'Runs all the way to the ear'],
      ['在原位置附近来回振动', 'Oscillates near its original position'],
      ['沿竖直方向画出正弦轨迹', 'Draws a vertical sine trajectory'],
    ],
    explore: [
      '在相同1 m探针距离完整比较空气、淡水、真空。彩色点是介质，黄竖线是固定探针；颜色只表示声压正负。检查10%与30%的时刻，比较扰动到达和粒子运动。再自由改变距离，预测到达时间。点的位移大幅放大，不能把画出的间距直接读成真实密度。',
      'Complete air, fresh-water and vacuum comparisons at the same 1 m probe distance. Dots are medium; the gold line is a fixed probe; colour shows pressure sign only. Inspect at 10% and 30%, separating arrival from parcel motion. Change distance freely to predict arrival time. Enlarged displacements make drawn spacing unsuitable for actual density measurements.',
    ],
    concept: [
      '在流体中，小幅声音通常是纵波：局部运动方向与传播方向平行。相邻部分通过压力作用传递扰动，形成声压和密度的变化；声压p′是相对平衡值的变化，不是整个大气压。局部速度与位移是不同的量，本向右传播模型满足p′=ρcv。声波需要介质，真空没有这种机械传递。',
      'Small fluid sound waves are normally longitudinal: local motion is parallel to propagation. Neighbouring parcels transmit disturbances through pressure, changing pressure and density. Acoustic pressure p′ is a departure from equilibrium pressure. Parcel velocity and displacement differ; this right-going model obeys p′=ρcv. Mechanical sound needs a medium and cannot cross a vacuum.',
    ],
    example: [
      '空气c=343 m/s，1 m探针约2.915 ms开始响应；淡水c=1480 m/s，约0.676 ms。源频率同为400 Hz，波长分别约0.8575 m与3.7 m。本窗里的位移仅约百纳米量级；不是空气以343 m/s整体流动。真空中到达时间和机械声波波长都不填数。',
      'At c=343 m/s, a 1 m air probe starts responding after about 2.915 ms. In fresh water at 1480 m/s, it starts after about 0.676 ms. Both sources are 400 Hz, but wavelengths are about 0.8575 m and 3.7 m. Local displacement is only around a hundred nanometres, not a bulk flow at 343 m/s. Vacuum has no arrival time or mechanical sound wavelength.',
    ],
    misconception: [
      '时间图上下起伏的是声压读数，不表示空气上下运动。位移最大的时刻也不一定声压最大。不能从“水里传播快”推断任何真实场景都会听得更清楚：界面耦合、衰减和接收器也会影响信号。',
      'An up/down pressure trace does not show vertical air motion. Maximum displacement need not coincide with maximum pressure. Faster sound in water does not guarantee clearer hearing: coupling, loss and the receiver also matter.',
    ],
    realWorld: [
      '扬声器膜片推动邻近空气；耳膜响应到达的压力变化。隔声结构、液体探测和航天通信都要先识别传播介质。宇航员用无线电跨真空通信，耳机里的声音仍由局部空气或接触振动传递。',
      'A loudspeaker diaphragm pushes nearby air; an eardrum responds to arriving pressure changes. Sound insulation, liquid sensing and spacecraft communication all require identifying the medium. Astronauts use radio across vacuum, then local sound or contact vibration in their headsets.',
    ],
    summary: [
      '介质局部振动，扰动向外传播；声速、局部速度、声压分别记录。',
      'Medium oscillates locally while disturbances propagate; distinguish sound speed, parcel velocity and pressure.',
    ],
    homeExperiment: [
      '用桌上的软弹簧轻轻沿长度方向压松一小段，让伙伴盯住一个标记圈。记录压缩区走过哪里、标记圈去了哪里。再在普通房间听一次轻拍手，画出“手掌—邻近空气—耳膜”传递链，不用大音量。',
      'Gently compress and release part of a soft tabletop spring along its length. Follow one marked coil and the compression region separately. Hear a gentle clap in a normal room and draw the hands → nearby air → eardrum chain.',
    ],
    vocabulary: [
      ['声压', 'acoustic pressure'],
      ['纵波', 'longitudinal wave'],
      ['介质', 'medium'],
      ['局部速度', 'particle velocity'],
    ],
    formula: [
      '起始到达t=d/c；向右线性声波p′=ρcv',
      'First arrival t=d/c; right-going linear sound p′=ρcv',
    ],
    questions: [
      [
        '哪个量以声速跨过房间？',
        'What crosses the room at sound speed?',
        [
          ['一团空气', 'One parcel of air'],
          ['扰动的传播', 'The travelling disturbance'],
          ['大气压整体', 'The whole atmosphere'],
        ],
        1,
        '标记介质只在原位置附近运动。',
        'Tagged medium moves near its original position.',
      ],
      [
        '同源400 Hz，在水中声速更大，哪个量更大？',
        'Same 400 Hz source: which increases with speed in water?',
        [
          ['波长', 'Wavelength'],
          ['源频率', 'Source frequency'],
          ['每秒源周期数不确定', 'Source cycles per second become undefined'],
        ],
        0,
        'λ=c/f，源节奏保持。',
        'λ=c/f while the source rhythm stays fixed.',
      ],
      [
        '真空比较为什么没有到达时间？',
        'Why is there no arrival time in vacuum?',
        [
          ['声音只慢了一些', 'Sound is merely slower'],
          ['探针距离变成零', 'Probe distance becomes zero'],
          ['没有传机械声的介质', 'There is no medium for mechanical sound'],
        ],
        2,
        '本模型不把无线电或光算成机械声波。',
        'Radio and light are not mechanical sound waves.',
      ],
    ],
    exit: [
      '解释隔屋听见拍手，首先要追踪什么？',
      'What should you track to explain hearing a distant clap?',
      [
        [
          '局部振动与传播的压力变化',
          'Local vibration and travelling pressure changes',
        ],
        ['空气跑到耳朵的全程', 'Air running all the way to the ear'],
        ['把声压图当作竖直轨迹', 'The pressure graph as a vertical path'],
      ],
      0,
      '从介质的局部变化连到接收器响应。',
      'Connect local medium changes to the receiver response.',
    ],
  }),
  make({
    id: 'acoustics-one-window-count-the-cycles',
    kind: 'acoustics-pitch',
    minutes: 24,
    title: [
      '同样长的一声，为什么有的听起来更尖？',
      'Why can equally long tones sound higher?',
    ],
    subtitle: [
      '共同时间窗里，周期、频率和波长一起读。',
      'Read period, frequency and wavelength in a common window.',
    ],
    hook: [
      '把一段口哨声拉长不会自动让它变低；把节奏变快，却会改变音调。这里用只有一种频率的纯音，把“持续多久”和“每秒振动多少次”拆开。你可以听0.7秒短音，也可以完全靠图找到证据。',
      'Holding a whistle longer does not automatically lower its pitch. Changing its oscillation rate does. Pure tones separate duration from cycles per second. Optional 0.7-second sounds supplement evidence that you can find entirely in the plots.',
    ],
    prediction: [
      '同样10 ms时间窗里，800 Hz比200 Hz出现多少个周期？',
      'In the same 10 ms window, how many cycles does 800 Hz have compared with 200 Hz?',
    ],
    predictions: [
      ['一样多', 'The same'],
      ['四倍', 'Four times as many'],
      ['四分之一', 'One quarter'],
    ],
    explore: [
      '完整比较200、400、800 Hz，空气声速和有效声压保持相同。先数时间图的周期，再比较空间图的间距。灰线总窗始终10 ms；动画播放放慢到2.4秒。试听使用真实频率，不是图中校准的声压，不计入规定观察。',
      'Complete 200, 400 and 800 Hz comparisons at held sound speed and RMS pressure. Count time cycles and compare spatial spacing. The grey time window stays 10 ms, played slowly over 2.4 seconds. Optional tones use real frequencies but are not calibrated to plotted pressure and do not count as observations.',
    ],
    concept: [
      '频率f是每秒周期数，周期T是一周期所需时间，T=1/f。在同一非色散介质中，波速保持，λ=c/f；频率越高，周期越短、波长越短。纯音的音调通常随频率上升；复杂乐器声还含多个频率，音色不能只用一个f描述。',
      'Frequency f counts cycles per second; period T is time per cycle, T=1/f. In this same nondispersive medium, c stays fixed and λ=c/f: higher frequency means shorter period and wavelength. Pure-tone pitch generally rises with frequency. Instruments contain multiple frequencies; timbre is not captured by one f.',
    ],
    example: [
      '200 Hz：T=5 ms、λ=1.715 m，10 ms内2周期；400 Hz：2.5 ms、0.8575 m、4周期；800 Hz：1.25 ms、0.42875 m、8周期。三次p_RMS都为2 mPa，声速都343 m/s。波形更密，不能说它跑得更快。',
      '200 Hz gives T=5 ms, λ=1.715 m and two cycles in 10 ms. At 400 Hz: 2.5 ms, 0.8575 m and four cycles. At 800 Hz: 1.25 ms, 0.42875 m and eight cycles. All hold p_RMS=2 mPa and c=343 m/s. Crowded waves do not mean faster propagation.',
    ],
    misconception: [
      '“高音就是大声”“音长就是周期长”把不同量混在一起。实际设备和耳朵对各频率响应不同，固定输出也不保证听感响度相同；这不会改变模型固定声压的条件。',
      'High pitch is not high loudness, and long tone duration is not a long oscillation period. Devices and ears respond differently by frequency, so fixed output does not guarantee equal perceived loudness; that does not alter held model pressure.',
    ],
    realWorld: [
      '调弦、乐器音高和语音都依赖振动节奏。给吉他缩短有效弦长通常能升高基频；听到变化后，可以进一步问弦长、张力和波速分别有没有变。',
      'Tuning, musical notes and speech depend on vibration rhythm. Shortening a guitar string usually raises its fundamental; investigate which of length, tension and wave speed changed.',
    ],
    summary: [
      '先数周期确定f，再分开比较T、λ和持续时间。',
      'Count cycles to find f; compare T, λ and tone duration separately.',
    ],
    homeExperiment: [
      '画三个等宽10 ms时间框，分别放入2、4、8个完整周期。保持曲线高度相同，标注频率与周期。若试听，先把设备音量调低，只比较短音的音高，不把听感当声压测量。',
      'Draw three equal 10 ms frames containing two, four and eight full cycles. Hold height fixed and label f and T. If listening, start at low device volume and compare pitch rather than treating perception as a pressure measurement.',
    ],
    vocabulary: [
      ['音调', 'pitch'],
      ['频率', 'frequency'],
      ['周期', 'period'],
      ['纯音', 'pure tone'],
    ],
    formula: ['T=1/f；固定c时λ=c/f', 'T=1/f; at fixed c, λ=c/f'],
    questions: [
      [
        '400 Hz的一周期多长？',
        'How long is one 400 Hz cycle?',
        [
          ['400 ms', '400 ms'],
          ['2.5 ms', '2.5 ms'],
          ['0.4 ms', '0.4 ms'],
        ],
        1,
        '1/400 s=0.0025 s。',
        '1/400 s=0.0025 s.',
      ],
      [
        '同空气中频率翻倍，声速保持，波长怎样变？',
        'Frequency doubles at fixed air sound speed. What happens to wavelength?',
        [
          ['减半', 'Halves'],
          ['翻倍', 'Doubles'],
          ['不变', 'Stays fixed'],
        ],
        0,
        '更短的空间重复间隔对应更快的源节奏。',
        'A shorter spatial interval accompanies a faster source rhythm.',
      ],
      [
        '把400 Hz短音播放两倍久，会怎样？',
        'Playing a 400 Hz tone twice as long changes what?',
        [
          ['频率翻倍', 'Frequency doubles'],
          ['周期翻倍', 'Period doubles'],
          ['持续时间翻倍，频率不变', 'Duration doubles; frequency stays fixed'],
        ],
        2,
        '时长与每秒振动数是不同量。',
        'Duration differs from oscillations per second.',
      ],
    ],
    exit: [
      '空间曲线变密，怎样判断音调变化？',
      'A spatial waveform gets more crowded. How should you judge pitch?',
      [
        [
          '同时检查声速、频率与时间周期',
          'Check sound speed, frequency and time period',
        ],
        ['只看曲线高度', 'Only look at height'],
        ['直接断言传播加快', 'Assume faster propagation'],
      ],
      0,
      '在已知固定c时，较短λ对应更高f。',
      'At known fixed c, shorter λ corresponds to higher f.',
    ],
  }),
  make({
    id: 'acoustics-pressure-intensity-and-decibels',
    kind: 'acoustics-level',
    minutes: 24,
    title: [
      '振幅翻倍，分贝也翻倍吗？',
      'Does doubling amplitude double decibels?',
    ],
    subtitle: [
      '用一把对数尺，比较同频率的声压与能量。',
      'Use a logarithmic ruler for same-frequency pressure and energy.',
    ],
    hook: [
      '你把音量旋钮往上推，屏幕上的分贝增加几个单位。这几格不是“声压又多几格”的直线尺。这里先用很小的模型声压，看看声压、每秒每平方米的能量和分贝怎样各自变化。',
      'Turning a volume control may add a few decibels, but those units are not a linear pressure ruler. Small model pressures reveal how pressure, energy per second per area and decibels change differently.',
    ],
    prediction: [
      '同介质有效声压从2变4 mPa，声强怎样变？',
      'In the same medium, RMS pressure rises from 2 to 4 mPa. How does intensity change?',
    ],
    predictions: [
      ['两倍', 'Twice'],
      ['四倍', 'Four times'],
      ['不变', 'Unchanged'],
    ],
    explore: [
      '完整比较2、4、8 mPa RMS，频率都400 Hz。时间图共用±15 mPa刻度，不自动缩放。读声压级与声强的独立数值，比较每次翻倍；自由设1–10 mPa，找出分贝曲线为何逐渐变平。这里不播放或测量设备分贝。',
      'Complete 2, 4 and 8 mPa RMS comparisons at 400 Hz. Time traces share ±15 mPa scales without rescaling. Read SPL and intensity separately for each doubling. Explore 1–10 mPa to see why the decibel curve flattens. This bench does not play or measure calibrated device decibels.',
    ],
    concept: [
      '有效声压p_RMS是声压平方先平均、再开方；正负振动不会互相抵消。纯正弦峰值是√2 p_RMS。平面行波声强I=p_RMS²/(ρc)，声压翻倍时强度四倍。空气声压级L_p=20log₁₀(p_RMS/20 µPa)，相同比值产生相同分贝差。响度则是听觉感受，还受频率、时长和听者影响。',
      'RMS pressure averages squared pressure, then takes its square root, so positive and negative parts do not cancel. A sine has peak √2 p_RMS. Plane travelling-wave intensity I=p_RMS²/(ρc) quadruples when pressure doubles. Air SPL L_p=20log₁₀(p_RMS/20 µPa): equal ratios give equal decibel differences. Perceived loudness also depends on frequency, duration and the listener.',
    ],
    example: [
      '2 mPa是参考20 µPa的100倍，得到40 dB。4 mPa得到46.02 dB，8 mPa得到52.04 dB；每次增加约6.02 dB。对应声强约9.718×10⁻⁹、3.887×10⁻⁸、1.555×10⁻⁷ W/m²。这里的dB明确是声压级，不把别的参考定义混入。',
      '2 mPa is 100 times the 20 µPa reference, giving 40 dB. 4 and 8 mPa give 46.02 and 52.04 dB, each adding about 6.02 dB. Intensities are about 9.718×10⁻⁹, 3.887×10⁻⁸ and 1.555×10⁻⁷ W/m². These decibels explicitly denote SPL, not a silently different reference definition.',
    ],
    misconception: [
      '“增加10 dB一定听起来十倍响”把测量和感受混淆。+10 dB声压级对应声强十倍，不给所有人一个固定听感倍率。0 dB也不是零声压；它是等于参考声压。负的相对声压瞬时值，不是负声强。',
      'A +10 dB SPL change corresponds to tenfold intensity, not a universal loudness multiplier. 0 dB means reference pressure, not zero pressure. Negative instantaneous acoustic pressure does not mean negative intensity.',
    ],
    realWorld: [
      '隔声材料、噪声记录和扬声器规格会使用dB。先问“相对哪个参考、测什么量”，再比较数字；不同频率加权、测量位置和时间窗需要一致。',
      'Insulation, noise records and loudspeaker specifications use decibels. Ask which reference and quantity are used, then compare numbers under consistent frequency weighting, position and time window.',
    ],
    summary: [
      '压力看幅度，强度看平方，分贝看比值的对数；响度另谈。',
      'Pressure follows amplitude, intensity follows its square, decibels log the ratio; loudness is perception.',
    ],
    homeExperiment: [
      '不制造大音量：在纸上写2、4、8 mPa，分别算压力比、强度比和分贝差。画同高10 ms框中的三条400 Hz曲线，保持横向周期相同，仅改变纵向高度。',
      'Use paper rather than loud sound: compare 2, 4 and 8 mPa by pressure ratios, intensity ratios and decibel differences. Draw three 400 Hz waves in equal 10 ms frames, changing height only.',
    ],
    vocabulary: [
      ['有效值', 'RMS'],
      ['声强', 'sound intensity'],
      ['声压级', 'sound pressure level'],
      ['响度', 'loudness'],
    ],
    formula: [
      'I=p_RMS²/(ρc)；L_p=20log₁₀(p_RMS/20µPa)',
      'I=p_RMS²/(ρc); L_p=20log₁₀(p_RMS/20µPa)',
    ],
    questions: [
      [
        '有效声压翻倍，声压级差约多少？',
        'Doubling RMS pressure adds approximately what SPL?',
        [
          ['两倍原dB', 'Twice the original dB'],
          ['6.02 dB', '6.02 dB'],
          ['0 dB', '0 dB'],
        ],
        1,
        '20log₁₀2≈6.02。',
        '20log₁₀2≈6.02.',
      ],
      [
        '0 dB声压级代表什么？',
        'What does 0 dB SPL represent?',
        [
          [
            '有效声压等于参考20 µPa',
            'RMS pressure equals the 20 µPa reference',
          ],
          ['没有任何压力', 'No pressure at all'],
          ['所有人完全听不见', 'Nobody can hear it'],
        ],
        0,
        '对数比值为零说明比值为1。',
        'A zero logarithm means ratio one.',
      ],
      [
        '哪句话把本模型条件写对了？',
        'Which states the model correctly?',
        [
          ['音调一定随声压升高', 'Pitch must rise with pressure'],
          ['每组曲线重新缩放', 'Every curve rescales'],
          [
            '同400 Hz、同刻度，只改有效声压',
            'Same 400 Hz and scales; only RMS pressure changes',
          ],
        ],
        2,
        '共同刻度才显出幅度变化。',
        'Shared scales reveal amplitude changes.',
      ],
    ],
    exit: [
      '看到“降低6 dB”，首先确认什么？',
      'When reading “6 dB lower,” what should you confirm first?',
      [
        [
          '测量量、参考和比较条件',
          'Quantity, reference and comparison conditions',
        ],
        ['一定声压降为零', 'Pressure must fall to zero'],
        ['一定音调降低', 'Pitch must fall'],
      ],
      0,
      '比值测量需要明确基准。',
      'Ratio measurements require an explicit reference.',
    ],
  }),
  make({
    id: 'acoustics-a-rhythm-that-builds-motion',
    kind: 'acoustics-resonance',
    minutes: 24,
    title: [
      '轻推秋千，为什么节奏比力气更关键？',
      'Why can timing matter more than strength when pushing a swing?',
    ],
    subtitle: [
      '相同推力，观察暂态建立和稳态幅度。',
      'Hold force fixed; observe build-up and steady amplitude.',
    ],
    hook: [
      '乱推几下和顺着节奏推几下，秋千的响应很不一样。你没有突然变强，是每次能量传递的时机改变了。实验把秋千换成有阻尼的慢速弹簧振子，让节奏和幅度有清楚的读数。',
      'Random pushes and rhythmic pushes produce different swing responses without you becoming stronger. Timing changes energy transfer. A slow damped spring oscillator gives clearer rhythm and amplitude measurements.',
    ],
    prediction: [
      '固有频率2 Hz，相同推力下，1、2、3 Hz哪组稳态幅度最大？',
      'At natural frequency 2 Hz and equal forcing, which preset gives the largest steady amplitude?',
    ],
    predictions: [
      ['1 Hz', '1 Hz'],
      ['2 Hz', '2 Hz'],
      ['3 Hz', '3 Hz'],
    ],
    explore: [
      '三组都从静止开始，推力幅度0.1 N、质量1 kg、阻尼比0.15保持。完整观察1、2、3 Hz；时间图包含8 s建立过程，第三图是稳态响应曲线。自由找1.5或2.5 Hz，再比较瞬时位移和稳态幅度是否相同。',
      'All cases start from rest with fixed 0.1 N forcing amplitude, 1 kg mass and damping ratio 0.15. Complete 1, 2 and 3 Hz observations. The time trace includes eight seconds of build-up; the third plot shows steady response. Try 1.5 or 2.5 Hz and distinguish instantaneous displacement from steady amplitude.',
    ],
    concept: [
      '受迫振动由外力持续推动，阻尼把机械能传给环境。驱动接近系统响应较强的频率时，能量输入的节奏有利，稳态幅度较大，叫共振。暂态取决于初始状态，不能只看第一帧就判断最终响应。阻尼限制幅度，也使位移响应的峰频略低于无阻尼固有频率。',
      'External forcing sustains driven motion while damping transfers mechanical energy to the surroundings. Near a strong-response frequency, the timing of energy input produces a larger steady amplitude: resonance. Initial conditions affect transients, so the first frame does not determine steady response. Damping limits amplitude and shifts the displacement-response peak slightly below the undamped natural frequency.',
    ],
    example: [
      '三组稳态幅度约0.828、2.111、0.477 mm。2 Hz在规定三组里最大，完整曲线的位移峰在约1.954 Hz。本课驱动2 Hz的机械运动太慢，不把它当作能听见的纯音；声音系统中的共振机制相似，但频率和结构另设。',
      'Preset steady amplitudes are about 0.828, 2.111 and 0.477 mm. The 2 Hz preset is largest, while the full displacement curve peaks near 1.954 Hz. This 2 Hz mechanical motion is too slow to be an audible pure tone; acoustic resonance uses related mechanisms with different frequencies and structures.',
    ],
    misconception: [
      '“频率一样振幅就无限大”忽略了阻尼。“当下位移零就是没有振动”也不对，振子穿过平衡位置时可以速度很大。本图没有把振幅自动归一化，所以三组能用同一尺比较。',
      'Equal frequencies do not imply unlimited amplitude when damping exists. Zero displacement can occur during fast motion through equilibrium. The common displacement scale allows real amplitude comparisons.',
    ],
    realWorld: [
      '乐器共鸣箱、车身振动和建筑减振都需要研究频率响应。更大的响应有时有用，有时会造成不适；调整结构或阻尼，能改变响应峰和能量耗散。',
      'Instrument bodies, vehicle vibrations and building damping depend on frequency response. A stronger response may be useful or unwanted; changing structure or damping changes response peaks and energy dissipation.',
    ],
    summary: [
      '相同推力不保证相同响应；比较驱动频率、建立过程和阻尼。',
      'Equal force need not give equal response; compare drive frequency, build-up and damping.',
    ],
    homeExperiment: [
      '把一枚小物体挂在短绳上，轻轻从上端左右移动，比较慢于、接近和快于它自然摆动的节奏。幅度保持很小，记录十次推动后变化。不要把真实摆的非线性大角度运动当成本课精确模型。',
      'Suspend a small object on a short string and gently move the top slower than, near and faster than its natural swing rhythm. Keep motion small and compare after ten pushes. Large-angle real swings are not the exact linear model here.',
    ],
    vocabulary: [
      ['共振', 'resonance'],
      ['驱动', 'forcing'],
      ['阻尼', 'damping'],
      ['稳态', 'steady state'],
    ],
    formula: [
      '相同F₀：幅度由驱动频率和阻尼共同决定',
      'At fixed F₀, drive frequency and damping determine amplitude',
    ],
    questions: [
      [
        '规定三组为何2 Hz响应最大？',
        'Why is the 2 Hz preset strongest?',
        [
          ['质量突然减小', 'Mass suddenly decreases'],
          ['接近系统强响应频率', 'It is near a strong-response frequency'],
          ['推力增加三倍', 'Force triples'],
        ],
        1,
        '质量、推力和阻尼都保持不变。',
        'Mass, force and damping stay fixed.',
      ],
      [
        '为什么不能只读t=0？',
        'Why not compare only t=0?',
        [
          [
            '三组都从静止出发，响应尚未建立',
            'All start from rest before response builds',
          ],
          ['稳态已无限大', 'Steady amplitude is infinite'],
          ['时间与响应无关', 'Time does not affect response'],
        ],
        0,
        '初始状态与稳态响应要区分。',
        'Distinguish initial conditions from steady response.',
      ],
      [
        '有阻尼时，本位移响应峰在哪里？',
        'Where is this damped displacement-response peak?',
        [
          ['严格3 Hz', 'Exactly 3 Hz'],
          ['严格0 Hz', 'Exactly 0 Hz'],
          ['约1.954 Hz，略低于2 Hz', 'About 1.954 Hz, slightly below 2 Hz'],
        ],
        2,
        '阻尼会使位移峰频略低。',
        'Damping shifts the displacement peak slightly lower.',
      ],
    ],
    exit: [
      '要让某个结构在已知节奏下少振动，先调查什么？',
      'To reduce vibration under known rhythmic forcing, investigate what first?',
      [
        [
          '驱动频率、结构响应和阻尼',
          'Drive frequency, structural response and damping',
        ],
        ['只把零位移帧截下来', 'Only capture a zero-displacement frame'],
        ['只比较振子的颜色', 'Only compare oscillator colour'],
      ],
      0,
      '频率响应比单个瞬间更有解释力。',
      'Frequency response explains more than a single instant.',
    ],
  }),
  make({
    id: 'acoustics-two-ends-two-constraints',
    kind: 'acoustics-columns',
    minutes: 24,
    title: [
      '同样长的管，堵住一端为什么改变音高？',
      'Why does closing one end change a tube’s pitch?',
    ],
    subtitle: [
      '声压波节与空气位移波节，不在同一处。',
      'Pressure nodes and air-displacement nodes differ.',
    ],
    hook: [
      '一根管子里的空气并不是一整团来回飞出管口。反射形成的驻波，要同时满足两端的要求。开口允许空气运动，却把声压变化约束为零；堵住的端点又约束了另一种量。',
      'Air in a tube does not shuttle out as one whole lump. Reflections form standing patterns compatible with both ends. An open end allows air motion but constrains pressure change to zero; a closed end constrains a different quantity.',
    ],
    prediction: [
      '理想0.5 m空气柱，一端从开变闭，基频怎样变？',
      'Closing one end of an ideal 0.5 m open/open air column does what to its fundamental?',
    ],
    predictions: [
      ['翻倍', 'Doubles it'],
      ['减半', 'Halves it'],
      ['完全不变', 'Leaves it unchanged'],
    ],
    explore: [
      '完整比较两开端0.5 m、一闭一开0.5 m、一闭一开0.25 m。看左端的点是否运动，再看时间图L/4探针的声压。蓝色空圈标声压波节；别把它当位移波节。自由改变有效管长时，比较同一条曲线上的基频。',
      'Complete open/open 0.5 m, closed/open 0.5 m and closed/open 0.25 m comparisons. Follow the left-end dot and pressure at the L/4 probe. Blue rings mark pressure nodes, not displacement nodes. Change effective length freely and compare fundamental frequencies on one response curve.',
    ],
    concept: [
      '开端与外部压力近似相接，p′≈0，是声压波节、位移波腹；刚性闭端空气不能沿管运动，u=0，是位移波节、声压波腹。两开端基频装下半个波长，L=λ/2；一闭一开装下四分之一波长，L=λ/4。空气依旧沿管振动，即使画成上下声压曲线。',
      'An open end approximately matches ambient pressure: p′≈0, a pressure node and displacement antinode. A rigid closed end prevents longitudinal displacement: u=0, a displacement node and pressure antinode. The open/open fundamental fits half a wavelength; closed/open fits a quarter. Air motion remains along the tube even when pressure is drawn vertically.',
    ],
    example: [
      'c=343 m/s，两开端0.5 m给λ=1 m、f₁=343 Hz。一闭一开0.5 m给λ=2 m、f₁=171.5 Hz。把闭开管缩到0.25 m，又得到λ=1 m、343 Hz。相同频率不说明边界相同；不同有效长度可以补偿边界变化。',
      'At c=343 m/s, open/open 0.5 m gives λ=1 m and f₁=343 Hz. Closed/open 0.5 m gives λ=2 m and f₁=171.5 Hz. Shortening the closed/open tube to 0.25 m restores λ=1 m and 343 Hz. Equal frequencies need not mean equal boundaries; length can compensate.',
    ],
    misconception: [
      '声压图在某时刻全为零，不表示处处都是波节：波节要在所有时刻保持零。本课忽略管口修正，用的是有效长度。真实瓶口和瓶腔常是另一类共振器，不能拿瓶高直接代入c/(4L)。',
      'An all-zero pressure frame does not make every point a node; nodes stay zero at all times. This model neglects end corrections and uses effective length. Bottle necks and cavities often form a different resonator; bottle height cannot simply be inserted into c/(4L).',
    ],
    realWorld: [
      '长笛、单簧管和风琴管通过长度与边界选择振动模态。实际音色还受更高模态、激励方式和损耗影响；本课先读基频与两端条件。',
      'Flutes, clarinets and organ pipes use effective length and boundaries to select modes. Timbre also depends on higher modes, excitation and loss; here we study the fundamental and end constraints.',
    ],
    summary: [
      '先说明约束的是声压还是位移，再决定能装下哪一段波长。',
      'Name whether pressure or displacement is constrained, then find which fraction of a wavelength fits.',
    ],
    homeExperiment: [
      '在纸上画两开端与闭开端的位移包络，另用颜色画声压包络。标清每个端点的波节与波腹，检查两图相互补充。若用纸管比较开闭端的短声，只做轻声尝试，不把纸管几何长度当精确有效长度。',
      'Draw displacement envelopes for open/open and closed/open tubes, then pressure envelopes in another colour. Label end nodes and antinodes and check the complementary patterns. A gentle paper-tube comparison uses approximate rather than exact effective length.',
    ],
    vocabulary: [
      ['空气柱', 'air column'],
      ['声压波节', 'pressure node'],
      ['位移波腹', 'displacement antinode'],
      ['基频', 'fundamental'],
    ],
    formula: [
      '两开端f₁=c/(2L)；闭开端f₁=c/(4L)',
      'Open/open f₁=c/(2L); closed/open f₁=c/(4L)',
    ],
    questions: [
      [
        '刚性闭端约束哪个量为零？',
        'Which quantity is zero at a rigid closed end?',
        [
          ['声速c', 'Sound speed c'],
          ['空气位移u', 'Air displacement u'],
          ['源频率f', 'Source frequency f'],
        ],
        1,
        '闭端阻止空气沿管移动。',
        'The closed end prevents air displacement along the tube.',
      ],
      [
        '理想开端的声压变化怎样？',
        'What happens to pressure change at an ideal open end?',
        [
          ['保持零，形成声压波节', 'It stays zero: a pressure node'],
          ['始终最大', 'It is always maximal'],
          ['无穷大', 'It is infinite'],
        ],
        0,
        '开端接近外界压力，不约束位移为零。',
        'The end matches ambient pressure rather than imposing zero displacement.',
      ],
      [
        '同边界下管长减半，基频怎样？',
        'At held boundaries, halving length does what to the fundamental?',
        [
          ['减半', 'Halves it'],
          ['不变', 'Leaves it unchanged'],
          ['翻倍', 'Doubles it'],
        ],
        2,
        '基频与有效长度成反比。',
        'The fundamental is inversely proportional to effective length.',
      ],
    ],
    exit: [
      '比较两个管子的音高，先记录哪些条件？',
      'To compare tube pitches, record which conditions first?',
      [
        [
          '有效长度、端点条件、介质声速',
          'Effective length, end conditions and sound speed',
        ],
        ['只记录颜色', 'Only colour'],
        ['只看某一帧是否为零', 'Only whether one frame is zero'],
      ],
      0,
      '边界和长度一起选择模态。',
      'Length and boundaries jointly select modes.',
    ],
  }),
  make({
    id: 'acoustics-a-moving-source-changes-arrivals',
    kind: 'acoustics-doppler',
    minutes: 24,
    title: [
      '驶过的警笛，换了音符还是换了到达节奏？',
      'Does a passing siren change its note or the arrival rhythm?',
    ],
    subtitle: [
      '源仍400 Hz，固定接收点却数到不同节奏。',
      'The source stays 400 Hz; a fixed receiver counts a different rhythm.',
    ],
    hook: [
      '一辆鸣笛的车靠近又离开，听到的音高会变化。并不一定有人在车里调音：每次波峰从不同位置发出，后一个可能追着前一个发出的波峰。先只研究移动波源，接收点不动。',
      'An approaching then departing siren changes heard pitch without anyone retuning it. Each crest starts from a different place; later crests may be emitted closer to earlier ones. Study a moving source while the receiver stays fixed.',
    ],
    prediction: [
      '波源朝固定接收点移动，源频率不变，接收频率怎样？',
      'A source moves toward a fixed receiver at unchanged source frequency. What happens to received frequency?',
    ],
    predictions: [
      ['降低', 'Decreases'],
      ['升高', 'Increases'],
      ['永远不变', 'Always stays fixed'],
    ],
    explore: [
      '完整比较源靠近、静止、远离；源400 Hz、空气343 m/s、接收点x=5 m保持。圆圈是波峰的平面截面，圆心留在各自发出时的位置。观察首波约14.58 ms后，接收计数怎样跳变。自由设vₛ/c时，只改源速度，不让声速跟着变。',
      'Complete approaching, stationary and receding cases with source 400 Hz, air 343 m/s and receiver x=5 m. Circles are crest cross-sections centred at each emission position. After the first arrival near 14.58 ms, watch received counts jump. Free vₛ/c changes source speed, not sound speed.',
    ],
    concept: [
      '源靠近时，两次发波之间也向接收点移动，所以前方波峰间距变短；介质中波峰仍以c传播，接收间隔缩短。源远离则相反。固定接收者、静止空气、亚声速源沿连线移动时，f_recv=f_src/(1−vₛ/c)，vₛ正号取朝向接收者。这个公式不直接包含移动接收者或风。',
      'As the source approaches, it moves closer between emissions, shortening crest spacing ahead. Crests still travel at c through the medium, so received intervals shorten. Receding does the reverse. For a fixed receiver, still air and a subsonic source moving along the line, f_recv=f_src/(1−vₛ/c), with positive vₛ toward the receiver. Moving receivers and wind require other conditions.',
    ],
    example: [
      'vₛ/c=+0.2，vₛ=68.6 m/s，前方间距0.686 m，接收500 Hz；静止0.8575 m、400 Hz；−0.2时1.029 m、约333.33 Hz。三组源每2.5 ms发一个波峰，首波起点相同，首到达时间相同。不要把后续间隔变化说成首波速度变化。',
      'At vₛ/c=+0.2, source speed is 68.6 m/s, spacing ahead 0.686 m and received frequency 500 Hz. Stationary gives 0.8575 m and 400 Hz; −0.2 gives 1.029 m and about 333.33 Hz. All sources emit every 2.5 ms. The first crest starts at the same place and arrives at the same time; later intervals change without changing its speed.',
    ],
    misconception: [
      '圆圈不是以波源当前位置为共同圆心。“接收更高频，所以空气声速加快”也不成立。计数变化说明到达节奏，不说明响度或能量；本图没有距离衰减。',
      'The circles do not share the current source position as their centre. A higher received frequency does not mean faster sound in air. Counts describe arrival rhythm rather than loudness or energy; distance attenuation is not simulated.',
    ],
    realWorld: [
      '警笛音调变化提供运动线索。雷达、天文光谱和医疗多普勒也比较频移，但电磁波、移动血液散射与本课单程声源有不同条件，不能照搬一个公式。',
      'Siren pitch offers motion clues. Radar, astronomical spectra and medical Doppler also use frequency shifts, but electromagnetic waves and moving scatterers differ from this one-way moving acoustic source.',
    ],
    summary: [
      '发出节奏与接收节奏分开；改变的是波峰间距，不是本介质声速。',
      'Separate emission and reception rhythms; crest spacing changes while this medium’s speed stays fixed.',
    ],
    homeExperiment: [
      '画一列每隔相同时刻从右移位置发出的圆，所有圆半径按各自传播时间增加。在前方画固定接收点，比较圆边间距。这个纸上实验就能解释趋势，不需要靠近行驶车辆。',
      'Draw circles emitted at equal times from progressively rightward positions. Increase each radius according to its own travel time and mark a fixed receiver ahead. Compare crest spacing on paper.',
    ],
    vocabulary: [
      ['多普勒效应', 'Doppler effect'],
      ['发出频率', 'emitted frequency'],
      ['接收频率', 'received frequency'],
      ['波面', 'wavefront'],
    ],
    formula: [
      '固定接收点：f_recv=f_src/(1−vₛ/c)',
      'Fixed receiver: f_recv=f_src/(1−vₛ/c)',
    ],
    questions: [
      [
        '靠近时，前方间距为什么变短？',
        'Why does spacing ahead shorten for approach?',
        [
          ['声速变小', 'Sound speed falls'],
          ['后一次发波位置更靠前', 'Later emission starts farther forward'],
          ['源停止发声', 'The source stops emitting'],
        ],
        1,
        '源在两次发出之间移动。',
        'The source moves between emissions.',
      ],
      [
        'vₛ=0.2c、源400 Hz，接收多少？',
        'At vₛ=0.2c and source 400 Hz, what is received?',
        [
          ['500 Hz', '500 Hz'],
          ['320 Hz', '320 Hz'],
          ['400 Hz', '400 Hz'],
        ],
        0,
        '400/(1−0.2)=500。',
        '400/(1−0.2)=500.',
      ],
      [
        '本比较中哪个量一直保持？',
        'Which remains fixed in these comparisons?',
        [
          ['接收频率', 'Received frequency'],
          ['前方间距', 'Spacing ahead'],
          ['源频率与空气声速', 'Source frequency and air sound speed'],
        ],
        2,
        '只改变波源速度。',
        'Only source velocity changes.',
      ],
    ],
    exit: [
      '解释靠近警笛的音高变化，应分开追踪什么？',
      'To explain an approaching siren’s pitch, track what separately?',
      [
        [
          '发出时刻、发出位置与到达间隔',
          'Emission times, emission positions and arrival intervals',
        ],
        ['只看源的颜色', 'Only source colour'],
        ['让所有旧波面跟着源移动', 'Move all old fronts with the source'],
      ],
      0,
      '旧波面从各自发出位置扩展。',
      'Each old front expands from its own emission position.',
    ],
  }),
  make({
    id: 'acoustics-a-return-time-and-a-blind-window',
    kind: 'acoustics-echo',
    minutes: 24,
    title: [
      '机器人离墙很近，为什么反而测不到？',
      'Why might a robot fail to measure a very close wall?',
    ],
    subtitle: [
      '超声往返测距，加上发射后的接收盲窗。',
      'Combine ultrasonic round-trip ranging with receiver blanking.',
    ],
    hook: [
      '停车探头或小机器人发一声你听不见的“问候”，等墙返回回波。远一点要等更久，太近却可能在接收器准备好之前就回来了。这不是墙消失，而是测量装置错过了时刻。',
      'A parking probe or robot sends an inaudible greeting and waits for its echo. Farther targets take longer; a very close echo may return before the receiver is ready. The wall remains, but the measurement misses its timing.',
    ],
    prediction: [
      '同声速下，墙的距离翻倍，往返时间怎样变？',
      'At fixed sound speed, doubling wall distance does what to round-trip time?',
    ],
    predictions: [
      ['减半', 'Halves it'],
      ['翻倍', 'Doubles it'],
      ['不变', 'Leaves it fixed'],
    ],
    explore: [
      '完整比较0.5、1、2 m目标。紫色小峰是发射，灰黄是可接收回波；第一段紫色阴影为0.5 ms盲窗。先检查回波到达之前，实测量程应为空；再检查末帧。自由把目标设0.02 m，区分模型知道的距离与接收器能测出的距离。',
      'Complete 0.5, 1 and 2 m targets. Purple is transmission; grey/gold show accepted echoes; the first shaded 0.5 ms is blanking. Before arrival the measured range stays empty. Then inspect the end. Set a free 0.02 m target to separate known model geometry from a range the receiver can measure.',
    ],
    concept: [
      '超声频率超过20 kHz，本探头载频40 kHz，不用耳朵监听。一次脉冲到墙再返回，同点发收的路程是2d，所以d=cΔt/2。发射后接收器可能暂时不能有效监听；这里规定起始在0.5 ms内的回波整次丢弃，得到一个明确的盲区模型。',
      'Ultrasound is above 20 kHz; our carrier is 40 kHz and is not played through audio. A pulse travels to the wall and back, so colocated transmission/reception gives d=cΔt/2. Receivers may be unavailable briefly after transmission; this model discards an entire echo whose leading edge returns within 0.5 ms.',
    ],
    example: [
      '0.5、1、2 m的往返时间约2.915、5.831、11.662 ms。最小量程为343×0.0005/2=0.08575 m。0.02 m目标仅0.1166 ms就返回，落在盲窗，实测量程保持“—”；不是凭已知几何距离直接填0.02 m。',
      'Targets at 0.5, 1 and 2 m return after about 2.915, 5.831 and 11.662 ms. Minimum range is 343×0.0005/2=0.08575 m. A 0.02 m target returns after 0.1166 ms, inside blanking, so measured range remains “—” rather than copying known geometry.',
    ],
    misconception: [
      '“超声就是声速特别快”混淆了频率与速度。“没有读数等于没有目标”忽略了盲区、方向、噪声和反射。灰图已经画出未来完整窗，不代表接收器在t=0就收到了回波。',
      'Ultrasound means high frequency rather than unusually fast sound. No reading does not prove no target: blanking, direction, noise and reflection matter. The grey complete window previews future data rather than saying the receiver already heard it at t=0.',
    ],
    realWorld: [
      '机器人的避障和距离传感器，要先认识量程、发收几何和延迟。真实装置还受温度、反射面角度与软材料吸收影响；本模型盲窗是教学设定，不是所有传感器的规格。',
      'Robot ranging requires knowing range limits, geometry and delays. Real sensors also depend on temperature, reflector angle and absorption. This blanking duration is a teaching parameter, not a universal specification.',
    ],
    summary: [
      '时间必须算往返，读数必须来自收到的信号；盲区不是空无一物。',
      'Use round-trip time and received signals; a blind region is not empty space.',
    ],
    homeExperiment: [
      '在纸上画“发射—到墙—返回”的路径，另画0.5 ms不能接收的时间窗。给0.02、0.5、1 m算时间，判断是否进入盲窗。若手边有机器人传感器，用它自己的规格与记录比较，不把本参数套成实测保证。',
      'Draw the outward/return path and a separate 0.5 ms unavailable interval. Calculate 0.02, 0.5 and 1 m return times and classify them. If you have a robot sensor, compare its own specifications and records rather than assuming these teaching parameters.',
    ],
    vocabulary: [
      ['超声', 'ultrasound'],
      ['回波', 'echo'],
      ['往返时间', 'round-trip time'],
      ['盲区', 'blind region'],
    ],
    formula: [
      'd=cΔt/2；本盲区d_min=c t_blank/2',
      'd=cΔt/2; this blind region d_min=c t_blank/2',
    ],
    questions: [
      [
        '测距为什么除以2？',
        'Why divide by two for range?',
        [
          ['声速减半', 'Sound speed halves'],
          ['时间包含去与回', 'Time includes outward and return travel'],
          ['有两个墙', 'There are two walls'],
        ],
        1,
        '单程距离只占总路程一半。',
        'One-way range is half the travelled distance.',
      ],
      [
        '0.02 m目标在本模型能测到吗？',
        'Is a 0.02 m target measurable here?',
        [
          ['不能，起始回波在盲窗', 'No; the echo starts during blanking'],
          ['一定能，几何距离已知', 'Yes; its geometry is known'],
          ['能，超声穿过时间', 'Yes; ultrasound bypasses time'],
        ],
        0,
        '模型知道位置不等于传感器收到证据。',
        'Knowing model geometry is not receiving measurement evidence.',
      ],
      [
        '40 kHz的“超”表示什么？',
        'What makes 40 kHz ultrasonic?',
        [
          ['声速超过光速', 'Sound exceeds light speed'],
          ['无需介质', 'No medium is needed'],
          [
            '频率超过通常听觉上限',
            'Frequency is above the usual hearing range',
          ],
        ],
        2,
        '这是频率类别。',
        'It is a frequency category.',
      ],
    ],
    exit: [
      '机器人没有读数，下一步应查什么？',
      'A robot gives no range reading. What should you inspect?',
      [
        [
          '量程、盲窗、方向和回波条件',
          'Range, blanking, direction and echo conditions',
        ],
        ['立刻断定墙不存在', 'Immediately conclude no wall exists'],
        ['直接把设计距离填成实测', 'Copy design distance as a measurement'],
      ],
      0,
      '先检查测量链是否有证据。',
      'Check whether the measurement chain received evidence.',
    ],
  }),
  make({
    id: 'acoustics-depth-detail-and-a-weaker-return',
    kind: 'acoustics-imaging',
    minutes: 24,
    title: [
      '超声图像想看得更细，为什么回波可能更弱？',
      'Why can finer ultrasound detail come with weaker echoes?',
    ],
    subtitle: [
      '用虚构两层界面，连接时间、深度和分辨率。',
      'Use two fictional interfaces to connect time, depth and resolution.',
    ],
    hook: [
      '医生的超声探头发送短脉冲，再按回波到达时间判断不同深度。本课不造一张假人体图：先把两层界面放到同一条线上，看短脉冲能否把两个回波分开，再看提高载频付出的衰减代价。',
      'An ultrasound probe sends short pulses and uses echo times to locate depths. Rather than inventing a patient image, place two fictional interfaces on one line: ask whether shorter pulses separate the echoes and how higher frequency affects attenuation.',
    ],
    prediction: [
      '固定等效4周期脉冲，载频升高，脉冲持续时间怎样变？',
      'At fixed effective four-cycle pulses, higher carrier frequency changes pulse duration how?',
    ],
    predictions: [
      ['变长', 'Longer'],
      ['变短', 'Shorter'],
      ['与频率无关', 'Unrelated to frequency'],
    ],
    explore: [
      '完整比较2、5、10 MHz，同样30与31 mm界面、声速1540 m/s、同反射和增益。检查65%附近的回波；灰线是完整A线包络，不是原始高频压力。比较峰的分开程度与高度。自由缩小界面间距，预测哪组先合并成难区分的一团。',
      'Complete 2, 5 and 10 MHz comparisons at 30 and 31 mm, c=1540 m/s, equal weak reflectivities and fixed gain. Inspect near 65% for the echoes. Grey is the complete A-line envelope rather than raw high-frequency pressure. Compare separation and height. Reduce boundary spacing freely and predict which case becomes harder to distinguish first.',
    ],
    concept: [
      '回波中心时间t=2z/c把时间映射到深度。两个界面太近时，有限时长的回波重叠，不能像无限细线那样分开。固定周期数，频率越高脉冲越短，轴向模糊宽度约cτ/2更小；但本设定中衰减随频率和路程增大，使深处返回幅度更弱。实际成像还依赖聚焦、带宽、散射与处理。',
      'Echo-centre time t=2z/c maps time to depth. Nearby interfaces produce overlapping finite-duration echoes. At fixed effective cycle count, higher frequency shortens the pulse and reduces axial blur cτ/2. In this prescribed model attenuation grows with frequency and path length, weakening deep echoes. Real imaging also depends on focusing, bandwidth, scattering and processing.',
    ],
    example: [
      '首界面30 mm的回波中心约38.961 µs。2、5、10 MHz脉冲FWHM是2、0.8、0.4 µs，轴向模糊约1.54、0.616、0.308 mm。首回波往返衰减6、15、30 dB，幅度比约50.12%、17.78%、3.16%。曲线共用增益，不能放大每组让它们看似同样强。',
      'At 30 mm, the first echo centre is about 38.961 µs. Pulse FWHM at 2, 5 and 10 MHz is 2, 0.8 and 0.4 µs, giving axial blur 1.54, 0.616 and 0.308 mm. First-return loss is 6, 15 and 30 dB, leaving amplitudes 50.12%, 17.78% and 3.16%. Shared gain prevents rescaling every echo to look equally strong.',
    ],
    misconception: [
      '“越高频永远越好”只看细节，忽略返回信号。“图上两个峰就是两个诊断结论”更不成立，本课只有虚构界面的弱反射包络。高斯包络的数学尾巴不是物理传播前沿；检查线只是逐步揭示数据。',
      'Higher frequency is not universally better: detail trades against signal strength. Two plotted peaks are not diagnostic conclusions; this is a fictional weak-interface envelope model. Gaussian mathematical tails are not physical wavefronts; inspection reveals data progressively.',
    ],
    realWorld: [
      '探头表面的耦合凝胶减少空气间隙，使声能更容易进入身体；脉冲回波可用于成像，医学多普勒还利用运动引起的频移研究流动。这里只学习测量机制，不从图形推断人体状况。',
      'Coupling gel reduces air gaps so sound couples into the body. Pulse echoes support imaging; medical Doppler uses motion-related shifts to study flow. Here we learn measurement mechanisms without inferring a person’s condition from the plots.',
    ],
    summary: [
      '回波时刻定位深度，脉冲宽度限制细节，衰减限制返回信号。',
      'Echo time locates depth; pulse width limits detail; attenuation limits return strength.',
    ],
    homeExperiment: [
      '在纸上画两个相近界面的回波，先用宽峰，再用窄峰，保持横坐标。把高频组峰高减小，解释“更细”与“更弱”可以同时出现。再读NIH/NIBIB来源中的成像原理，不需要任何医学设备。',
      'Draw two nearby-interface echoes with wide peaks, then narrow peaks on the same time axis. Reduce high-frequency peak heights and explain why finer and weaker can coexist. Read the linked NIH/NIBIB imaging explanation; no medical equipment is needed.',
    ],
    vocabulary: [
      ['A线', 'A-line'],
      ['轴向分辨率', 'axial resolution'],
      ['衰减', 'attenuation'],
      ['耦合', 'coupling'],
    ],
    formula: ['t=2z/c；轴向模糊FWHM=cτ/2', 't=2z/c; axial blur FWHM=cτ/2'],
    questions: [
      [
        '本模型回波时刻主要告诉你什么？',
        'What does echo time primarily indicate here?',
        [
          ['界面颜色', 'Interface colour'],
          ['界面深度', 'Interface depth'],
          ['人体诊断', 'A patient diagnosis'],
        ],
        1,
        '往返时间通过已知声速映射深度。',
        'Round-trip time maps to depth using known speed.',
      ],
      [
        '固定有效周期数，提高频率如何改善轴向细节？',
        'How does higher frequency improve axial detail at fixed effective cycle count?',
        [
          ['脉冲更短，回波模糊更窄', 'Shorter pulses give narrower echo blur'],
          ['声速无限增大', 'Sound speed becomes infinite'],
          ['去掉所有衰减', 'It removes all attenuation'],
        ],
        0,
        'τ=4/f，模糊宽度随τ减小。',
        'τ=4/f, so blur shrinks with pulse width.',
      ],
      [
        '本比较中10 MHz首回波为什么更弱？',
        'Why is the 10 MHz first echo weaker here?',
        [
          ['界面消失', 'The interface disappears'],
          ['增益自动归零', 'Gain becomes zero'],
          ['规定衰减随频率增大', 'Prescribed attenuation grows with frequency'],
        ],
        2,
        '同反射和固定增益下，往返损耗更大。',
        'At equal reflectivity and fixed gain, round-trip loss is larger.',
      ],
    ],
    exit: [
      '选择载频时，应同时考虑什么？',
      'When choosing a carrier frequency, consider what together?',
      [
        [
          '脉冲宽度、界面间距与返回强度',
          'Pulse width, interface spacing and return strength',
        ],
        ['只选择最大数字', 'Only choose the largest number'],
        [
          '把虚构波峰当人体结论',
          'Treat fictional peaks as patient conclusions',
        ],
      ],
      0,
      '更窄的模糊不保证每个深度都有足够信号。',
      'Narrower blur does not guarantee adequate signal at every depth.',
    ],
  }),
];
