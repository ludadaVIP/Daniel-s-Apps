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
  questions: Check[];
  exit: Check;
};
const make = (d: Draft): Lesson => ({
  ...d,
  stage: 3,
  unit: 'space',
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
  questions: d.questions.map((c) => q(...c)),
  exit: q(...d.exit),
});
export const spaceLessons: Lesson[] = [
  make({
    id: 'space-turning-day',
    kind: 'space-day',
    minutes: 17,
    title: [
      '太阳每天走过天空，是谁在转？',
      'The Sun crosses the sky each day. What is turning?',
    ],
    subtitle: [
      '把自己放在转动的地球上，追踪光照。',
      'Put yourself on a rotating Earth and follow sunlight.',
    ],
    hook: [
      '晚饭时天黑了，另一个国家的孩子可能正在吃早餐。太阳没有关灯，为什么我们看不见它？',
      'While you eat dinner in darkness, a child elsewhere may be having breakfast. The Sun has not switched off. Why can you no longer see it?',
    ],
    prediction: [
      '固定太阳方向，只转动地球上的一个地点，会发生什么？',
      'Keep the Sun’s direction fixed and rotate one place on Earth. What happens?',
    ],
    predictions: [
      [
        '地点交替进入受光面和背光面',
        'The place enters the lit and unlit sides in turn',
      ],
      ['整个地球同时变黑', 'All of Earth becomes dark at once'],
      ['太阳必须绕地球跑一圈', 'The Sun must orbit Earth once'],
    ],
    explore: [
      '比较正午、午夜和日出边界。每次完整播放一个简化太阳日，留意地点标记和不动的太阳方向。拖动时刻可以找日落，但不替代三次完整观察。',
      'Compare noon, midnight and the sunrise boundary. Inspect one simplified solar day each time. Watch the place marker and the fixed Sun direction. Seek sunset freely; seeking does not replace complete observations.',
    ],
    concept: [
      '地球绕自己的轴自转。面向太阳的一侧受光，另一侧背向太阳；同一个地点随自转交替进入这两侧，形成昼夜。站在地面上，我们看到太阳在天空中的视运动。一天约24小时；模型以太阳为参照，简化为赤道、春秋分附近，不表示所有纬度每天都有12小时白昼。',
      'Earth rotates about its axis. One side faces sunlight and the other faces away; a place rotates between them, producing day and night. From the ground we see the Sun’s apparent daily motion. A solar day is about 24 hours. This equatorial equinox model does not give every latitude twelve daylight hours on every day.',
    ],
    example: [
      '模型正午地点朝向太阳；12小时后到背光面。日出在6时附近的边界，日落在18时附近。这里是当地太阳时，不是手机时区或夏令时。',
      'Model noon faces the Sun; twelve hours later the place faces away. Sunrise lies near the 6-hour boundary and sunset near 18 hours. These are local solar hours, not phone time zones or daylight-saving clocks.',
    ],
    misconception: [
      '夜晚不是太阳停止发光，也不是地球绕太阳走到“后面”。自转回答每天的昼夜；公转回答一年的循环，别把两个运动混在一起。',
      'Night does not mean the Sun stopped shining or Earth moved behind something in its yearly orbit. Rotation explains daily alternation; revolution concerns the year. Keep those motions distinct.',
    ],
    realWorld: [
      '约定跨国视频时间前，先判断两地可能处在一天的不同部分。时区还包含人为划分，不能只拿本图给城市精确报时。',
      'Before arranging a call abroad, consider that places may be at different parts of the day. Time zones include human choices, so this diagram is not a precise city-clock service.',
    ],
    summary: [
      '地球自转改变地点对太阳的朝向，形成昼夜；观察者的视角很重要。',
      'Earth’s rotation changes a place’s orientation to the Sun, producing day and night. The observer’s viewpoint matters.',
    ],
    homeExperiment: [
      '用球和普通灯做模型，贴一个地点标记，保持灯不动、缓慢转球。分别画标记受光和背光的位置。不要直视太阳，也不要用激光或强光照眼睛。',
      'Use a ball and ordinary lamp. Mark a place, keep the lamp still and rotate the ball slowly. Sketch lit and unlit positions. Do not stare at the Sun or use lasers or intense light near eyes.',
    ],
    vocabulary: [
      ['自转', 'rotation'],
      ['地轴', 'axis'],
      ['太阳日', 'solar day'],
      ['视运动', 'apparent motion'],
    ],
    questions: [
      [
        '地点为什么从白昼进入黑夜？',
        'Why does a place go from day to night?',
        [
          ['太阳关灯', 'The Sun switches off'],
          ['地球自转使地点背向太阳', 'Rotation carries it away from sunlight'],
          ['月球每天挡住太阳', 'The Moon blocks the Sun daily'],
        ],
        1,
        '跟踪同一地点的朝向变化。',
        'Follow the changing orientation of one place.',
      ],
      [
        '每天的昼夜主要对应哪个运动？',
        'Which motion chiefly explains daily day and night?',
        [
          ['自转', 'Rotation'],
          ['一年一次公转', 'Yearly revolution'],
        ],
        0,
        '每天变化与自转相连。',
        'Daily alternation is linked to rotation.',
      ],
      [
        '模型6时一定是每个城市今天的日出吗？',
        'Is model hour 6 today’s sunrise in every city?',
        [
          ['是，所有纬度相同', 'Yes, every latitude is identical'],
          [
            '不是，日期、纬度和钟表制度有影响',
            'No; date, latitude and clock rules matter',
          ],
        ],
        1,
        '简化条件不能自动推广到所有城市。',
        'Do not extend simplified conditions to every city.',
      ],
    ],
    exit: [
      '另一个地点此时白天，我们这里夜晚，合理解释？',
      'Another place has daylight while yours is dark. Explain.',
      [
        ['地球各地点朝向太阳不同', 'Places face the Sun differently'],
        ['那里的太阳比这里更强', 'Their Sun is stronger'],
      ],
      0,
      '同一太阳，不同地点的朝向。',
      'One Sun, different place orientations.',
    ],
  }),
  make({
    id: 'space-tilted-seasons',
    kind: 'space-seasons',
    minutes: 21,
    title: [
      '同一个六月，为什么两边季节相反？',
      'The same June: why are the hemispheres in opposite seasons?',
    ],
    subtitle: [
      '保持距离，改变倾斜地轴与太阳的关系。',
      'Hold distance fixed and compare the tilted axis relative to the Sun.',
    ],
    hook: [
      '六月，北半球常进入夏季，南半球却进入冬季。它们几乎在同一个地球上，距离太阳几乎相同。“夏天更靠近太阳”够解释吗？',
      'June often brings northern summer and southern winter. Both hemispheres are on the same Earth, almost equally far from the Sun. Can being closer explain the contrast?',
    ],
    prediction: [
      '保持圆形公转距离不变，地轴倾斜能否造成两半球的光照差异？',
      'Can a tilted axis produce opposite sunlight patterns with orbital distance held fixed?',
    ],
    predictions: [
      ['不能，必须改变距离', 'No; distance must change'],
      [
        '能，白昼长度和太阳高度会改变',
        'Yes; daylight duration and Sun altitude change',
      ],
      ['两半球始终完全相同', 'Both hemispheres always remain identical'],
    ],
    explore: [
      '检查春分附近、六月位置和十二月位置。比较±45°纬度的白昼时数与当地正午太阳高度。自由换纬度，再用“取消倾斜”看哪些差异消失。金点是巡查，不是实际公转计时。',
      'Inspect the March-equinox, June and December positions. Compare daylight and local-noon Sun altitude at ±45°. Change latitude freely, then remove tilt to see what differences vanish. The gold marker inspects the diagram, rather than timing an orbit.',
    ],
    concept: [
      '地球公转时，地轴在一年尺度上大致保持同一空间方向，并相对公转轨道的垂直方向倾斜约23.5°。一半球朝向太阳更多时，白昼通常更长，太阳更高，同样光束分布到地面的面积更小；另一半球相反。这些光照条件推动四季，天气还受海洋、大气和地点影响。',
      'Over one orbit, Earth’s axis keeps roughly the same spatial direction and tilts about 23.5° from the orbital perpendicular. When a hemisphere leans toward the Sun, days are generally longer and the Sun higher, concentrating a beam over less ground area. The other hemisphere has opposite conditions. These drive seasons, while oceans, atmosphere and place affect weather.',
    ],
    example: [
      '规定圆轨道一直为1 AU。六月位置，45°N白昼约15.44小时，45°S约8.56小时；正午太阳高度分别68.5°和21.5°。十二月对调；取消倾斜则两边都是12小时。',
      'The assigned circular orbit stays at 1 AU. At the June position, 45°N has about 15.44 daylight hours and 45°S about 8.56; noon altitudes are 68.5° and 21.5°. December swaps them. Removing tilt gives twelve hours on both sides.',
    ],
    misconception: [
      '真实轨道稍有椭圆，北半球冬季附近反而更靠近太阳。四季主要不是地日距离变化。图中的季节标签也不能预测某天温度，热的响应可能滞后。',
      'Earth’s real orbit is slightly elliptical, and it is closer to the Sun near northern winter. Distance change is not the main cause of seasons. Seasonal geometry does not predict a day’s temperature; thermal response can lag.',
    ],
    realWorld: [
      '太阳高度和日照时数影响遮阳、光伏板和户外安排。住在南半球，就不要直接照搬北半球月份与季节的配对。',
      'Sun altitude and daylight influence shading, solar panels and outdoor plans. Southern-hemisphere seasons should not be assigned northern month labels.',
    ],
    summary: [
      '倾斜地轴在公转中保持方向，改变光照角度和时长，使两半球季节相反。',
      'A tilted, consistently oriented axis changes sunlight angle and duration through the orbit, giving opposite hemispheric seasons.',
    ],
    homeExperiment: [
      '用普通灯、球和一支代表地轴的纸箭头；让倾斜箭头始终朝房间同一方向，把球移到灯两侧。记录哪个半球更朝向灯。不要边公转边把轴自动转向灯。',
      'Use an ordinary lamp, ball and paper axis arrow. Keep the tilted arrow aimed in one room direction as you move the ball to opposite sides of the lamp. Note which hemisphere leans toward it; do not turn the axis toward the lamp each time.',
    ],
    vocabulary: [
      ['公转', 'revolution'],
      ['地轴倾斜', 'axial tilt'],
      ['太阳高度', 'Sun altitude'],
      ['白昼时数', 'daylight duration'],
    ],
    questions: [
      [
        '模型距离没变，六月与十二月光照仍不同，关键是什么？',
        'Distance is unchanged but June/December sunlight differs. What matters?',
        [
          ['太阳开关', 'A solar switch'],
          ['月亮形状', 'Moon shape'],
          ['倾斜轴与太阳的相对朝向', 'Tilted axis relative to the Sun'],
        ],
        2,
        '控制距离后仍能比较倾斜的效果。',
        'Controlling distance reveals the effect of tilt.',
      ],
      [
        '北半球六月较长白昼，南半球通常怎样？',
        'With longer northern June days, what is usual in the south?',
        [
          ['较短白昼', 'Shorter days'],
          ['完全一样长', 'Exactly the same length'],
        ],
        0,
        '两半球的倾斜朝向相反。',
        'Hemispheres lean oppositely relative to sunlight.',
      ],
      [
        '光照条件能精确给出明天温度吗？',
        'Does sunlight geometry exactly give tomorrow’s temperature?',
        [
          ['可以，几何就是天气', 'Yes; geometry is weather'],
          [
            '不能，还需天气与热响应等信息',
            'No; weather and thermal response also matter',
          ],
        ],
        1,
        '模型计算光照，不计算大气天气。',
        'The model calculates illumination, not atmospheric weather.',
      ],
    ],
    exit: [
      '把球移到灯另一边，轴仍指房间同一方向。应该观察什么？',
      'Move the ball across the lamp while keeping its axis direction. Observe what?',
      [
        [
          '哪半球更朝向灯，光照是否互换',
          'Which hemisphere leans toward the lamp and whether illumination swaps',
        ],
        ['一定整球同时变暖', 'The whole ball must warm equally'],
      ],
      0,
      '保持方向才能公平显示两边差别。',
      'A fixed axis orientation reveals the opposite-side difference.',
    ],
  }),
  make({
    id: 'space-moon-views',
    kind: 'space-moon',
    minutes: 19,
    title: [
      '月亮变成弯弯的一片，是谁遮住了它？',
      'A crescent Moon: what made the bright part shrink?',
    ],
    subtitle: [
      '同时看空间位置和从地球看到的亮面。',
      'Compare space positions with the illuminated face seen from Earth.',
    ],
    hook: [
      '几天前是弯月，后来越来越圆。月球并没有变形，也不是每晚被地球影子吃掉一点。我们究竟看见了哪个部分？',
      'A crescent grows rounder over several nights. The Moon has not changed shape, and Earth’s shadow is not eating a piece every night. Which part are we seeing?',
    ],
    prediction: [
      '月球始终约一半受太阳照亮；地球上看到的亮面比例会怎样？',
      'About half the Moon is lit by the Sun. How can the visible bright fraction change?',
    ],
    predictions: [
      ['始终看见整个月球发光', 'The whole disc is always bright'],
      ['太阳每天改变形状', 'The Sun changes shape daily'],
      [
        '我们看到受光半球的不同部分',
        'We see different portions of its lit hemisphere',
      ],
    ],
    explore: [
      '比较新月、上弦和满月。左图看绕地球的位置，右图看地球观察者的月面。自由转角找弯月和下弦；模型固定一种北方朝上的画面，真实月面方向会随观察地点和时间改变。',
      'Compare new, first-quarter and full Moon. The left panel shows position around Earth; the right shows the Earth-facing disc. Seek crescent and last-quarter views. The fixed northern-up convention differs from orientations at other places and times.',
    ],
    concept: [
      '月球主要反射太阳光，并绕地球运动。从地球看，太阳、地球和月球的相对位置改变，使我们看到的受光部分改变，形成月相。新月时亮面主要背向我们；满月时主要朝向我们；弦月看到约半个亮圆盘。月相周期平均约29.53天，和相对恒星的一次公转约27.3天不同。',
      'The Moon mostly reflects sunlight and orbits Earth. Changing Sun–Earth–Moon geometry changes how much of the illuminated hemisphere we see. At new Moon it faces mostly away; at full Moon it faces mostly toward us; quarter phases show about half a bright disc. The mean phase cycle is about 29.53 days, distinct from the roughly 27.3-day orbit relative to stars.',
    ],
    example: [
      '这个平行光近似中，位置角0°、90°、180°对应可见亮面0%、50%、100%。90°是月相周期走过四分之一，却看见半个亮圆盘，两个“分数”指的量不同。',
      'In this parallel-light approximation, position angles 0°, 90° and 180° give visible bright fractions 0%, 50% and 100%. First quarter means one quarter of the cycle, while half the visible disc is bright: the fractions describe different things.',
    ],
    misconception: [
      '月相通常不是地球影子。月食才是月球进入地球影子的特殊情况；月球轨道有倾斜，所以不会每次满月都月食，也不会每次新月都日食。平面位置图不计算食的发生。',
      'Ordinary phases are not Earth’s shadow. A lunar eclipse is the special passage through that shadow. The Moon’s inclined orbit prevents an eclipse at every full or new Moon; this planar diagram does not calculate eclipses.',
    ],
    realWorld: [
      '月相帮助安排月面观察，也解释农历月份与月球周期的联系。真正观察时记录日期、时刻、方向和形状，不能只凭一张示意图判断今天月相。',
      'Phases help plan lunar viewing and connect lunar-calendar months to the Moon’s cycle. Record date, time, direction and shape; a generic diagram does not report today’s phase.',
    ],
    summary: [
      '月球反射太阳光；月相是观察视角改变了可见亮面，不是月球变形。',
      'The Moon reflects sunlight. Phases change the visible illuminated portion, not the Moon’s shape.',
    ],
    homeExperiment: [
      '连续几天在安全地点记录月亮的日期、时刻和轮廓；看不见也记下云、遮挡或时段，别填猜测。只用肉眼观察月亮，不寻找太阳旁的新月，不对太阳使用望远镜。',
      'Over several days, record the Moon’s date, time and outline from a safe place. If unseen, note clouds, obstruction or timing rather than guessing. Observe the Moon with unaided eyes; do not search beside the Sun or point optics at it.',
    ],
    vocabulary: [
      ['月相', 'lunar phase'],
      ['新月', 'new Moon'],
      ['弦月', 'quarter Moon'],
      ['反射光', 'reflected light'],
    ],
    questions: [
      [
        '月亮主要靠什么让我们看见？',
        'What chiefly makes the Moon visible?',
        [
          ['反射太阳光', 'Reflected sunlight'],
          ['自己像太阳一样持续核聚变', 'Fusion like the Sun'],
        ],
        0,
        '月球不是一颗恒星。',
        'The Moon is not a star.',
      ],
      [
        '上弦的“四分之一”指什么？',
        'What does “quarter” in first quarter refer to?',
        [
          ['亮圆盘只能有四分之一', 'Exactly a quarter-bright visible disc'],
          ['月相周期的位置', 'Position in the phase cycle'],
          ['地球影子覆盖四分之一', 'A quarter covered by Earth’s shadow'],
        ],
        1,
        '周期走过四分之一，亮圆盘约一半。',
        'A quarter through the cycle gives about half a bright disc.',
      ],
      [
        '满月就一定月食吗？',
        'Does every full Moon give an eclipse?',
        [
          ['一定', 'Always'],
          ['月球变黑就是月食', 'Any dark portion is an eclipse'],
          [
            '不一定，轨道倾斜通常使它避开影子',
            'No; orbit inclination usually avoids the shadow',
          ],
        ],
        2,
        '月相与食需要区分。',
        'Distinguish phases from eclipses.',
      ],
    ],
    exit: [
      '弯月变大时，最合理的解释？',
      'As a crescent grows, what best explains it?',
      [
        [
          '可见受光部分随相对位置改变',
          'Visible illumination changes with relative position',
        ],
        ['月球长出新材料', 'The Moon grows new material'],
      ],
      0,
      '变化的是视角下的亮面比例。',
      'The visible illuminated fraction changes.',
    ],
  }),
  make({
    id: 'space-solar-ruler',
    kind: 'space-system',
    minutes: 18,
    title: [
      '把地日距离缩成10厘米，海王星放在哪里？',
      'If Earth’s solar distance is 10 cm, where does Neptune go?',
    ],
    subtitle: [
      '一把共用尺，把太阳系从名单变成空间。',
      'Use one shared ruler to turn a list into a spatial system.',
    ],
    hook: [
      '课本常把八颗行星均匀排开。如果地球离太阳只有模型中的10厘米，最远的大行星也只需放在旁边一点吗？',
      'Books often space the eight planets evenly. If Earth is just 10 cm from the model Sun, is the outermost planet only a little farther?',
    ],
    prediction: [
      '同一比例下，海王星相对太阳的平均轨道尺度约30 AU，应放多远？',
      'At one scale, Neptune’s mean orbital scale is about 30 AU. How far from the Sun?',
    ],
    predictions: [
      ['约30厘米', 'About 30 cm'],
      ['约3米', 'About 3 m'],
      ['和地球一样10厘米', 'The same 10 cm as Earth'],
    ],
    explore: [
      '比较地球、木星和海王星。所有行共用0–31 AU尺；数字是近似平均轨道尺度，不是今天的位置或与地球的距离。改变1 AU模型长度，观察模型距离一起按比例改变。',
      'Compare Earth, Jupiter and Neptune on shared 0–31 AU rulers. Values are approximate mean orbital scales, not today’s positions or Earth-to-planet separations. Change the model length of 1 AU and watch distances scale together.',
    ],
    concept: [
      '太阳系包括太阳以及受它引力联系的行星、卫星、小行星、彗星等。八颗大行星依次为水星、金星、地球、火星、木星、土星、天王星、海王星。1 AU是约1.496亿千米的距离单位，接近平均地日距离。尺上的轨道尺度是近似半长轴，真实轨道和位置会变化。',
      'The solar system includes the Sun and gravitationally associated planets, moons, asteroids, comets and more. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune. One AU is about 149.6 million km, near the mean Earth–Sun distance. Ruler values approximate semimajor axes; real orbits and positions vary.',
    ],
    example: [
      '1 AU=10厘米时，地球1 AU→0.10米，木星5.203 AU→0.5203米，海王星30.07 AU→3.007米。太阳系还延伸到更远天体，海王星不是系统边界。',
      'At 10 cm per AU, Earth is at 0.10 m, Jupiter at 0.5203 m and Neptune at 3.007 m. Solar-system objects extend farther; Neptune is not the system’s boundary.',
    ],
    misconception: [
      '行星名字按顺序排列不代表等间距。图中点的大小也没有和距离共用比例；若同时真实缩小直径，许多行星会小得难看见。',
      'Planet order does not imply equal gaps. Dot sizes do not share the distance scale: scaling diameters honestly would make many planets very hard to see.',
    ],
    realWorld: [
      '做校园模型时先选一个共同尺度，再换算每个位置。照片和海报如果没标比例，就不能拿画面间隔推真实距离。',
      'For a school model, choose one scale before converting every position. Unscaled photographs and posters do not let you infer real distances from picture gaps.',
    ],
    summary: [
      '太阳系是引力联系的天体系统；比较大小和距离都要先问比例尺。',
      'The solar system is a gravitationally connected system. Ask for the scale before comparing sizes or distances.',
    ],
    homeExperiment: [
      '用纸带标出太阳、地球、木星和海王星。空间不够就把1 AU改成5厘米，所有距离一同减半；不要只压缩最远一段。标明行星直径未按此尺度画。',
      'Mark the Sun, Earth, Jupiter and Neptune on a paper strip. If space is limited, use 5 cm per AU and halve every distance together. Do not compress just the outer gap. Label planet diameters as unscaled.',
    ],
    vocabulary: [
      ['太阳系', 'solar system'],
      ['天文单位', 'astronomical unit'],
      ['比例尺', 'scale'],
      ['半长轴', 'semimajor axis'],
    ],
    questions: [
      [
        '八行尺的0点都代表什么？',
        'What does zero represent on every ruler?',
        [
          ['各自不同的地球位置', 'Different Earth locations'],
          ['宇宙边缘', 'The universe’s edge'],
          ['同一个太阳参考点', 'The same solar reference'],
        ],
        2,
        '先统一参考点才能比较轨道尺度。',
        'Use a common reference to compare orbital scales.',
      ],
      [
        '1 AU模型长度翻倍，海王星模型距离怎样？',
        'Double the model length of 1 AU. What happens to Neptune’s distance?',
        [
          ['翻倍', 'Doubles'],
          ['不变', 'Unchanged'],
        ],
        0,
        '同一比例换算作用于所有天体。',
        'A common scale applies to every object.',
      ],
      [
        '海王星是太阳系最外边界吗？',
        'Is Neptune the outer boundary of the solar system?',
        [
          ['是', 'Yes'],
          ['不是，还有更远的天体', 'No; objects extend farther'],
        ],
        1,
        '最外大行星不是全部系统的边界。',
        'The outermost planet is not the whole system’s limit.',
      ],
    ],
    exit: [
      '海报上行星一样间隔，能用来算距离吗？',
      'Can equally spaced planets on a poster give real distances?',
      [
        ['当然，名字顺序足够', 'Yes; order is enough'],
        ['先检查它是否按距离尺度画', 'First check its distance scale'],
      ],
      1,
      '示意顺序和定量尺度是不同用途。',
      'Schematic order and quantitative scaling serve different purposes.',
    ],
  }),
  make({
    id: 'space-falling-around',
    kind: 'space-orbit',
    minutes: 20,
    title: [
      '卫星没掉下来，是因为那里没有重力？',
      'A satellite stays up. Is gravity absent there?',
    ],
    subtitle: [
      '比较向前运动与向中心的引力。',
      'Compare forward motion with attraction toward the centre.',
    ],
    hook: [
      '球松手会落下，卫星却一次次绕回来。它不是被天空托着，也不是重力消失了。怎样“不断落向地球”，却绕过地面？',
      'A released ball falls while a satellite repeatedly circles back. The sky is not holding it up and gravity has not vanished. How can falling toward Earth keep missing the surface?',
    ],
    prediction: [
      '在圆形轨道上想象突然取消引力，原有速度会怎样带它走？',
      'Imagine gravity removed from a circular orbit. Where does the existing velocity take it?',
    ],
    predictions: [
      ['继续绕同一个圆', 'Around the same circle'],
      ['立即静止', 'It stops immediately'],
      ['沿当时的切线直行', 'Straight along the current tangent'],
    ],
    explore: [
      '从同一初始距离比较圆轨道、相同初速但无引力的想象情况、无横向初速的下落。看金色速度箭头与绿色引力箭头；完整窗口共4个模型时间单位，首次触碰表面后不再计算碰撞。',
      'Compare a circular orbit, an imagined no-gravity path with the same initial speed, and a drop with no sideways start. Compare gold velocity and green attraction arrows. Each window spans four model time units; calculation ends at first surface contact, without an impact model.',
    ],
    concept: [
      '物体原有速度使它继续向前；引力朝向中心，持续改变速度方向。合适的横向速度使物体在下落过程中绕过地面，形成轨道。在圆轨道上速度方向不断改变，所以合力并不是零。“向前惯性”不是一个向外的真实力；引力提供向心加速度。',
      'Existing velocity carries an object forward while inward gravity continually changes its velocity direction. A suitable sideways speed allows a falling object to miss the surface and orbit. Circular motion changes direction continuously, so the net force is not zero. Forward inertia is not an extra outward force; gravity supplies centripetal acceleration.',
    ],
    example: [
      '模型半径从中心量，表面半径为1，初始半径2。圆轨道速度约0.707，引力加速度大小0.25；移除引力就沿切线走。没有横向初速时，约2.571个模型时间单位首次触碰表面。数值是归一化单位，不是卫星的米或秒。',
      'Model radius is measured from the centre: surface radius 1, starting radius 2. Circular speed is about 0.707 and gravitational acceleration 0.25. Removing gravity gives a tangent line. With no sideways start, first contact occurs near 2.571 model time units. Values are normalized, not a satellite’s metres or seconds.',
    ],
    misconception: [
      '“没有掉到地面”不等于“没有引力”；“一直同样快”不等于“速度没变”，方向也是速度的一部分。真实轨道还可能是椭圆；高处与有合适轨道速度也是两件事。',
      'Not reaching the surface does not mean no gravity. Unchanged speed does not mean unchanged velocity, because direction matters. Real orbits can be elliptical; altitude and suitable orbital speed are separate requirements.',
    ],
    realWorld: [
      '通信、定位和天气卫星都依赖轨道。正式计算还要使用天体质量、半径、空气阻力和其他扰动，本图不用于实际发射设计。',
      'Communication, navigation and weather satellites depend on orbits. Real calculations use body mass, size, drag and perturbations; this diagram is not a launch design.',
    ],
    summary: [
      '轨道中的引力持续改变运动方向；向前速度与向内加速度共同形成绕行。',
      'Gravity continually changes orbital direction. Forward velocity and inward acceleration together produce orbiting motion.',
    ],
    homeExperiment: [
      '在纸上画地球、一个卫星位置，再画切线速度和朝中心的引力箭头。分别去掉引力或去掉横向初速，预测轨迹。不需要投掷、绳子甩物或高处实验。',
      'Draw Earth and one satellite position. Add tangent velocity and inward gravity arrows. Predict the path if gravity or sideways starting speed is removed. No throwing, swinging objects or height experiment is needed.',
    ],
    vocabulary: [
      ['轨道', 'orbit'],
      ['切线', 'tangent'],
      ['向心加速度', 'centripetal acceleration'],
      ['速度方向', 'velocity direction'],
    ],
    questions: [
      [
        '圆轨道中引力指向哪里？',
        'Where does orbital gravity point?',
        [
          ['沿运动切线', 'Along the tangent'],
          ['朝中心', 'Toward the centre'],
          ['远离中心', 'Away from the centre'],
        ],
        1,
        '引力方向和当前速度方向不同。',
        'Attraction and current velocity have different directions.',
      ],
      [
        '维持圆轨道时合力为零吗？',
        'Is net force zero in a maintained circular orbit?',
        [
          ['不是，方向不断改变', 'No; direction continually changes'],
          ['是，速度大小不变', 'Yes; speed is constant'],
        ],
        0,
        '方向变化需要加速度。',
        'Direction changes require acceleration.',
      ],
      [
        '仅把物体放到很高处，够保证轨道吗？',
        'Does placing an object high up guarantee an orbit?',
        [
          ['够，高就没有引力', 'Yes; high altitude removes gravity'],
          ['不够，还要合适的运动条件', 'No; suitable motion is also needed'],
        ],
        1,
        '高度不是初始速度。',
        'Altitude is not initial velocity.',
      ],
    ],
    exit: [
      '想象没有引力，卫星还绕圈。这个图错在哪里？',
      'A drawing removes gravity but keeps the satellite circling. What is missing?',
      [
        [
          '没有改变方向所需的向内加速度',
          'The inward acceleration needed to change direction',
        ],
        ['卫星必须自行发光', 'The satellite must shine'],
      ],
      0,
      '没有相应作用，原有速度不会自行拐弯。',
      'Without the appropriate interaction, velocity does not turn itself.',
    ],
  }),
  make({
    id: 'space-star-brightness',
    kind: 'space-stars',
    minutes: 18,
    title: [
      '看起来更亮，恒星就一定更会发光？',
      'A brighter-looking star: must it emit more light?',
    ],
    subtitle: [
      '把恒星输出与接收到的光分开。',
      'Separate stellar output from light received.',
    ],
    hook: [
      '远处的大灯可能和近处的小灯一样亮。天空两个亮点也如此：只凭眼睛看到的亮度，能断定哪颗恒星每秒发出更多光吗？',
      'A strong distant lamp may look like a weak nearby one. The same ambiguity affects stars. Can appearance alone tell which emits more light per second?',
    ],
    prediction: [
      '同一恒星移到2倍距离，固定接收面积收到的光强怎样比较？',
      'Move the same ideal star to twice the distance. How does light on a fixed detector compare?',
    ],
    predictions: [
      ['约原来的四分之一', 'About one quarter'],
      ['约原来的一半', 'About one half'],
      ['一定完全相同', 'Always identical'],
    ],
    explore: [
      '比较相对输出1、距离1；输出1、距离2；输出4、距离2。保持接收面积、谱段和透明条件相同，再自由改距离。图中的球面表示光向各方向扩散，标记不是某颗恒星的真实尺寸。',
      'Compare output/distance pairs 1/1, 1/2 and 4/2. Keep detector area, spectral band and transparency fixed, then change distance freely. The wavefront sphere illustrates spreading, not a star’s actual size.',
    ],
    concept: [
      '恒星是自身向外辐射能量的天体，太阳也是恒星。像太阳这样的主序星，核心核聚变提供主要能量来源，并不是依赖空气中氧气的普通火焰。接收到的亮度同时受源输出和距离影响：在理想透明空间，各向均匀发光的球面面积随距离平方增大，单位接收面积收到的光随之减小。',
      'Stars radiate their own energy; the Sun is a star. In main-sequence stars like the Sun, core nuclear fusion is the main source, rather than an ordinary flame using atmospheric oxygen. Received brightness depends on both output and distance. In ideal transparent space, isotropic radiation spreads over an area growing with distance squared.',
    ],
    example: [
      '同一输出1，在距离1时指标为1，距离2时为1/4。另一个输出4的源放在距离2，指标又为1。因此看起来一样亮的源，真实输出可以不同。',
      'Output 1 gives brightness indicator 1 at distance 1 and 1/4 at distance 2. Output 4 at distance 2 gives 1 again. Equal apparent brightness can conceal different intrinsic outputs.',
    ],
    misconception: [
      '图里的相对亮度不是眼睛感受、相机曝光或实际星等。尘埃、颜色和仪器也会影响观察；夜空方向相近的恒星，实际距离未必相近。',
      'Relative irradiance is not perceived brightness, camera exposure or stellar magnitude. Dust, colour and instruments affect observations; stars close in sky direction need not be close in space.',
    ],
    realWorld: [
      '摄影和照明需要区分灯的输出、距离和曝光。天文学家会结合更多证据估计恒星性质，不能把“暗”直接译成“小或弱”。',
      'Photography and lighting distinguish source output, distance and exposure. Astronomers combine additional evidence to infer stellar properties; faint appearance does not by itself mean a small or weak star.',
    ],
    summary: [
      '恒星自己辐射能量；观察到的亮度同时取决于源和传播条件。',
      'Stars radiate their own energy. Observed brightness depends on both the source and the path.',
    ],
    homeExperiment: [
      '用纸画一个发光点与半径1、2的球面示意，比较面积比例。也可观察同一普通灯在不同安全距离的表现，但别把眼睛或手机读数当成校准光强仪。不要直视太阳。',
      'Draw one source and spheres of radii 1 and 2; compare surface-area ratios. You may observe an ordinary lamp from safe distances, but eyes or phone readings are not calibrated irradiance instruments. Never stare at the Sun.',
    ],
    vocabulary: [
      ['恒星', 'star'],
      ['光度', 'luminosity'],
      ['核聚变', 'nuclear fusion'],
      ['接收光强', 'received irradiance'],
    ],
    questions: [
      [
        '太阳属于哪类天体？',
        'What kind of object is the Sun?',
        [
          ['反射光的行星', 'A reflecting planet'],
          ['地球的卫星', 'Earth’s moon'],
          ['自身辐射能量的恒星', 'An energy-radiating star'],
        ],
        2,
        '太阳不是太阳系之外的另一类对象。',
        'The Sun is a star within the solar system.',
      ],
      [
        '同一源距离翻倍，传播球面面积怎样？',
        'Double distance from one source. How does spreading area change?',
        [
          ['4倍', 'Fourfold'],
          ['2倍', 'Twofold'],
        ],
        0,
        '球面面积与半径平方成正比。',
        'Sphere area is proportional to radius squared.',
      ],
      [
        '一样的接收指标能保证源输出一样吗？',
        'Does equal received brightness guarantee equal output?',
        [
          ['能', 'Yes'],
          [
            '不能，还要比较距离等条件',
            'No; distance and other conditions matter',
          ],
        ],
        1,
        '把输出与接收分开。',
        'Separate emitted output from received light.',
      ],
    ],
    exit: [
      '一颗恒星看起来暗，最稳妥的判断？',
      'A star looks faint. What is justified?',
      [
        ['它必定输出很低', 'Its output must be low'],
        [
          '还需距离和传播条件才能判断源',
          'Distance and propagation are needed to infer the source',
        ],
      ],
      1,
      '单一观察不能排除其他原因。',
      'One observation does not rule out other causes.',
    ],
  }),
  make({
    id: 'space-cosmic-address',
    kind: 'space-galaxies',
    minutes: 17,
    title: [
      '给地球写地址，太阳系之后该写什么？',
      'Write Earth’s address. What comes after the solar system?',
    ],
    subtitle: [
      '区分行星系统、星系和更大的宇宙。',
      'Distinguish a planetary system, a galaxy and the wider universe.',
    ],
    hook: [
      '“地球，太阳系，银河系”像从街道写到城市。银河系是一条发光的云吗？太阳系和星系只是两个说法，还是尺度完全不同？',
      'Earth, solar system, Milky Way resembles an address growing from street to city. Is the Milky Way just a glowing cloud? Are a solar system and a galaxy the same thing?',
    ],
    prediction: [
      '太阳系和银河系在空间层级上是什么关系？',
      'How are the solar system and Milky Way related?',
    ],
    predictions: [
      ['银河系是太阳的一颗行星', 'The Milky Way is a planet of the Sun'],
      ['太阳系属于银河系', 'The solar system lies within the Milky Way'],
      ['两个名字是同一个大小的对象', 'They name the same-sized object'],
    ],
    explore: [
      '检查太阳系、银河系、多个星系三个层级。每次先看组成成员，再定位前一个层级的位置。点和旋臂是教学符号，既不按真实比例，也不统计真实数量。',
      'Inspect the solar system, Milky Way and multiple galaxies. Identify members, then locate the previous level. Points and spiral arms are teaching symbols, neither a scale map nor an object census.',
    ],
    concept: [
      '太阳系是一颗恒星及与它引力联系的天体系统。星系则包含大量恒星系统、气体、尘埃等，也有暗物质，并由引力联系在一起。我们的太阳系在银河系中，太阳并不在银河中心。宇宙包含银河系和大量其他星系；图中几个星系只表示更大层级的一小部分。',
      'A solar system consists of a star and gravitationally associated bodies. A galaxy contains vast numbers of stellar systems, gas, dust and dark matter, linked by gravity. Our system lies within the Milky Way; the Sun is not its centre. The universe contains the Milky Way and many other galaxies. The few drawn galaxies represent only a small part of that wider level.',
    ],
    example: [
      '地址链是：地球→太阳系→银河系→宇宙。月球属于地球的自然卫星，也在这个地址链内。把八颗行星改称八个星系，就把成员类型和层级都弄错了。',
      'The chain is Earth → solar system → Milky Way → universe. The Moon is Earth’s natural satellite within that chain. Calling the eight planets eight galaxies confuses both member type and hierarchy.',
    ],
    misconception: [
      '星座是从地球看出的天空图案，不自动表示恒星彼此很近或组成同一小系统。银河系也不是整个宇宙；示意图边框不是宇宙边界。',
      'A constellation is a sky pattern from Earth, not proof that its stars are neighbours or a small shared system. The Milky Way is not the entire universe; a diagram frame is not a cosmic boundary.',
    ],
    realWorld: [
      '望远镜照片可能拍行星、星云或整个星系。先辨认对象类别与尺度，才知道照片在告诉你哪一层的事情。',
      'A telescope image may show a planet, nebula or galaxy. Identify object type and scale before deciding what level the image describes.',
    ],
    summary: [
      '地球属于太阳系，太阳系属于银河系；星系与行星是不同层级。',
      'Earth belongs to the solar system within the Milky Way. Galaxies and planets are different levels.',
    ],
    homeExperiment: [
      '画四层地址框，把地球、月球、太阳、其他恒星和另一个星系放到恰当层级。注明大小不按比例；若画一个星座，用虚线表示“观察图案”，不要当作真实连接。',
      'Draw four address frames and place Earth, Moon, Sun, other stars and another galaxy appropriately. Label sizes as unscaled. Use dashed lines for a constellation’s observed pattern, not physical connections.',
    ],
    vocabulary: [
      ['星系', 'galaxy'],
      ['银河系', 'Milky Way'],
      ['星座', 'constellation'],
      ['宇宙', 'universe'],
    ],
    questions: [
      [
        '八颗行星组成八个星系吗？',
        'Are the eight planets eight galaxies?',
        [
          [
            '不是，行星与星系属于不同层级',
            'No; planets and galaxies are different levels',
          ],
          ['是，只是名字不同', 'Yes; only the name differs'],
        ],
        0,
        '区分成员和包含成员的系统。',
        'Distinguish members from the systems containing them.',
      ],
      [
        '太阳位于银河系中心吗？',
        'Is the Sun at the Milky Way’s centre?',
        [
          ['是', 'Yes'],
          [
            '不是，位于银河系中的一个区域',
            'No; it lies in a region of the galaxy',
          ],
        ],
        1,
        '图中太阳系位置只是示意，但并非中心。',
        'The schematic address does not place our system at the centre.',
      ],
      [
        '一个星座图案足以证明恒星相邻吗？',
        'Does a constellation pattern prove neighbouring stars?',
        [
          ['足够', 'Yes'],
          ['所有星座距离相同', 'All constellation stars have equal distances'],
          [
            '不够，方向相近不等于空间相近',
            'No; nearby sky directions need not mean nearby space',
          ],
        ],
        2,
        '还需要距离等证据。',
        'Distance evidence is also needed.',
      ],
    ],
    exit: [
      '照片标“银河系全景”，能说拍到了整个宇宙吗？',
      'A panorama is labelled Milky Way. Is it the whole universe?',
      [
        [
          '不能，银河系只是宇宙中的一个星系',
          'No; it is one galaxy within the universe',
        ],
        [
          '能，所有星星都属于太阳系',
          'Yes; all stars belong to the solar system',
        ],
      ],
      0,
      '地址的层级不能跳过。',
      'Keep the address levels distinct.',
    ],
  }),
  make({
    id: 'space-light-message',
    kind: 'space-distance',
    minutes: 20,
    title: [
      '星光走了几年，我们看到的是哪一刻？',
      'Starlight travels for years. Which moment do we see?',
    ],
    subtitle: [
      '用光的旅行时间理解距离与过去。',
      'Use light-travel time to understand distance and the past.',
    ],
    hook: [
      '朋友的消息隔几秒才到，远方发来的光也会迟到。如果一颗星离我们4.25光年，今天收到的一束光描述的是今天的那颗星吗？',
      'A friend’s message can arrive seconds later; distant light is delayed too. If a star is 4.25 light-years away, does today’s incoming light describe that star today?',
    ],
    prediction: [
      '“4.25光年”最直接表示什么？',
      'What does “4.25 light-years” directly describe?',
    ],
    predictions: [
      ['这颗星年龄4.25年', 'The star is 4.25 years old'],
      ['飞船一定要飞4.25年', 'Any spacecraft takes 4.25 years'],
      ['光走4.25年对应的距离', 'The distance light travels in 4.25 years'],
    ],
    explore: [
      '比较1 AU地日尺度、4.25光年附近恒星尺度、10万光年星系直径尺度。播放的是一束新发出信号在静态路径上的传播，每例都重新缩放图；2.4秒播放不是真实旅行时间。',
      'Compare a 1-AU solar distance, a 4.25-light-year nearby-star distance and a 100,000-light-year galactic diameter. Follow a newly emitted signal along a static path. Every diagram rescales; the 2.4-second animation is not actual travel time.',
    ],
    concept: [
      '光在真空中以有限速度传播，约每秒30万千米。光年是光在一年中走过的距离，约9.46万亿千米，是距离单位。“看见”需要光到达，所以远方天体的图像带来过去的信息。这里用静态路径近似，不讨论宇宙膨胀造成的复杂距离定义。',
      'Vacuum light travels at finite speed, about 300,000 km per second. A light-year is the distance it travels in a year, about 9.46 trillion km: a length unit. Seeing requires arrival, so distant images carry past information. This static-path approximation does not handle the different cosmological distances caused by expansion.',
    ],
    example: [
      '1 AU光程约499秒，也就是8.32分钟；4.25光年光程约4.25年。跨约10万光年的路径则约需10万年。这里一年按365.25天定义；恒星距离和银河直径只是近似教学尺度。',
      'A 1-AU path takes about 499 seconds or 8.32 minutes; 4.25 light-years takes about 4.25 years. A roughly 100,000-light-year path takes about 100,000 years. The year is defined as 365.25 days here; star distance and galactic diameter are approximate teaching scales.',
    ],
    misconception: [
      '光年不是天体年龄，也不是任何飞船的飞行时间。看到过去不意味着能直接看到未来，更不能用星光延迟断言一颗星现在已消失。',
      'A light-year is neither an object’s age nor any spacecraft’s travel time. Seeing past information does not reveal the future or establish that a star has since disappeared.',
    ],
    realWorld: [
      '与远方探测器通信需要等待往返信号，不能像近距离遥控玩具一样即时修正。发送延迟、处理延迟和单程光程也应分开。',
      'Communication with distant probes needs outbound and return travel, unlike immediate toy control. Separate one-way light time from processing and other delays.',
    ],
    summary: [
      '光年量距离；光的有限速度让远方影像成为过去的信息。',
      'Light-years measure distance. Finite light speed makes distant images information from the past.',
    ],
    homeExperiment: [
      '画“发出→途中→收到”的消息线。给单程标8.32分钟，再计算1 AU静态路径的立即回复往返约16.64分钟。写明忽略处理、移动等条件，别把它当作所有航天器的延迟。',
      'Draw emitted → travelling → received. Mark 8.32 minutes one way, then estimate 16.64 minutes for an immediate round-trip reply across a static 1-AU path. State that processing and motion are omitted; this is not every spacecraft’s delay.',
    ],
    vocabulary: [
      ['光年', 'light-year'],
      ['光行时间', 'light-travel time'],
      ['真空光速', 'vacuum light speed'],
      ['单程与往返', 'one-way and round trip'],
    ],
    questions: [
      [
        '光年是什么单位？',
        'What kind of unit is a light-year?',
        [
          ['时间', 'Time'],
          ['温度', 'Temperature'],
          ['距离', 'Distance'],
        ],
        2,
        '名字里有“年”，定义的量仍是距离。',
        'The word year is in the definition, but the quantity is length.',
      ],
      [
        '4.25光年静态路径，光大约走多久？',
        'How long does light take across a static 4.25-light-year path?',
        [
          ['4.25年', '4.25 years'],
          ['4.25秒', '4.25 seconds'],
        ],
        0,
        '用距离除以真空光速。',
        'Divide path length by vacuum light speed.',
      ],
      [
        '1 AU单程8.32分钟，立即回复的往返约多少？',
        'At 8.32 minutes one way over 1 AU, an immediate round trip is about?',
        [
          ['8.32分钟', '8.32 minutes'],
          ['16.64分钟', '16.64 minutes'],
          ['0分钟', 'Zero minutes'],
        ],
        1,
        '往返包括两段光程。',
        'A round trip contains two light paths.',
      ],
    ],
    exit: [
      '收到4.25光年远方的星光，可以直接知道什么？',
      'What does incoming light from 4.25 light-years away directly tell you?',
      [
        [
          '光发出时的过去信息，而非实时画面',
          'Past information from emission, rather than a live view',
        ],
        ['这颗星现在一定已消失', 'The star must have disappeared now'],
      ],
      0,
      '传播延迟不证明现在发生了哪种变化。',
      'Propagation delay does not prove a particular current change.',
    ],
  }),
];
