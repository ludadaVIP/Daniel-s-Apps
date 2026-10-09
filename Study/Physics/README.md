# Physics Lab · 物理探索室

A local bilingual physics learning app for ages 10–15, integrated into Study. The current version has a compact interface, 138 complete bilingual lessons, 137 exploration stations and seven field projects: Physics Detective, Walking Investigation, Mystery Materials, Stair Power, Two-cup Insulation, Periscope and Lifting Design. The nine-stage roadmap follows [Plan.md](Plan.md); future stages are clearly marked as planned.

## Use

Double-click Study's `start.command` (macOS) or `start.bat` (Windows), then choose Physics. The existing launcher installs the pinned workspace dependencies when needed.

- Study entry: http://localhost:3456/physics
- Independent development: `corepack pnpm --filter @study/physics-web dev` → http://localhost:3458/physics
- The app needs no API, account, or database. Chemistry's API remains part of the existing Study launcher.

## Available courses

The foundation path follows Appendix A of the plan:

1. Physics is everywhere / 物理无处不在
2. Ask like a physicist / 像物理学家一样提问
3. Observation or explanation? / 观察，还是解释？
4. What can we measure? / 什么可以测量？
5. Different numbers, same string? / 数字换了，绳子变了吗？
6. A ruler for the world / 给世界一把尺
7. Time one swing or ten? / 测一次，还是十次？
8. Which object has more mass? / 大块头一定更重吗？
9. Is colder to touch really colder? / 摸起来更冷，温度就更低吗？
10. Keep every reading / 让每次读数都有位置
11. Read a walking story / 用一条线讲走路的故事
12. Two changes: can we identify the cause? / 改了两件事，能找到原因吗？
13. How much of an iceberg is hidden? / 冰山藏起了多少？
14. Can the same clay become a boat? / 同一团泥，能变成船吗？
15. How does the ball come back up? / 球怎么又回来了？
16. How far does an echo travel? / 声音走了多远才回来？
17. Is another you really behind the mirror? / 镜子后面真有另一个你吗？
18. Why does a balloon approach a neutral wall? / 墙没带电，气球怎么还靠过来？
19. Why does your body keep moving when the car stops? / 车停了，身体为什么还想向前？
20. No straight edges: how big is the stone? / 石头没有直边，怎么量大小？
21. Always the same: always correct? / 每次都一样，就一定量对了吗？
22. Three different readings: which counts? / 三次不一样，哪个才算数？
23. Too thin? Let a hundred sheets help. / 一张纸太薄？让一百张帮忙。
24. Not walking, yet moving? / 你没走，为什么也在移动？
25. Back at the start: no walking? / 回到原点，真的没走路吗？
26. Who is faster? / 谁跑得更快？
27. Fast out, slow back: what is the average? / 去得快，回来慢，平均怎么算？
28. A line slopes down: walking underground? / 线往下走，是人往地下走吗？
29. What does a push actually change? / 推一下，究竟改变了什么？
30. Pulled equally: must the cart be still? / 两边都在拉，车一定停着吗？
31. Pushed but still: what is friction doing? / 推了却没动，摩擦在做什么？
32. Same paper: why does crumpling change its fall? / 同一张纸，揉一下就落得更快？
33. One backpack: do 1 kg and 10 N mean the same thing? / 背包的1 kg，和10 N说的是一回事吗？
34. On the Moon, does your backpack contain less? / 去月球，背包真的“变少”了吗？
35. More gravity on the heavy ball: why no head start? / 重球的重力更大，为什么没先到？
36. Same size: why do they feel different? / 一样大，为什么拿起来不一样？
37. How does a 54 g block become a material clue? / 54 g的积木，怎样变成一个材料线索？
38. An irregular shape: can you still find its material clue? / 形状不规则，材料线索还能量出来吗？
39. Same solid: new water, new outcome? / 同一块材料，换水就不沉了？
40. The lamp lights up. Where does battery energy go? / 灯亮起来，电池里的能量去哪了？
41. Double the cart’s speed. Only double its energy? / 小车速度翻倍，动能也只翻倍吗？
42. A book rests on a shelf. Where is its energy clue? / 书在架子上没动，为什么也有能量线索？
43. The spring reaches its natural length. Why is the cart moving? / 弹簧回到原长，小车为什么还在动？
44. At the bottom, what has the lost height become? / 滑到最低处，少掉的高度变成了什么？
45. A rough patch lowers the return. Where did the energy go? / 加了粗糙垫，没回到原高的能量去哪了？

46. Holding a bag is tiring. Does the lifting force do work on it? / 提着书包很累，提力一定对它做功了吗？
47. Double the force or extend the distance: how does work change? / 推力翻倍，还是距离加长：功怎样比较？
48. Two hoists do the same work. Which has greater power? / 两台升降机做同样的功，谁的功率更大？
49. How can you estimate your mechanical power on stairs? / 上楼的你，怎样估算机械功率？
50. A ramp needs less force. Does it also need less work? / 斜坡让搬货省力，也会省功吗？

51. Both at 20°C: must a larger gas sample have the same internal energy? / 同样20℃，大盒气体的内能一定和小盒一样吗？
52. Same energy: why does the smaller water sample warm more? / 同样的能量，为什么小杯水升温更多？
53. Can you warm without touching the heat source? / 没有碰到热源，也能变暖吗？
54. Does an insulated cup create warmth or slow change? / 保温杯会制造温暖，还是减慢变化？
55. Without boiling, why can a wet cloth cool? / 水没有沸腾，湿布为什么也会变凉？

56. The ice is melting. Why is its temperature not rising? / 冰在融化，温度怎么没升？
57. The water is boiling. What does more heating change? / 水已经沸腾，再供热会发生什么？
58. The cup is not leaking. Where do outside droplets come from? / 杯子没漏，外壁水珠从哪里来？
59. Does a flat heating curve mean energy input has paused? / 加热曲线的平段，能量暂停了吗？

60. What is a rubber band doing when it sounds? / 橡皮筋出声时，它在做什么？
61. Sound reaches your ear. Did the air travel all the way? / 声音到了耳边，空气也一路跑来了吗？
62. Two gentle tones. Why is one higher? / 同样轻的两个音，为什么一个更尖？
63. How can the same tone become more noticeable? / 同一个音，怎样变得更明显？
64. How can a returning sound tell us distance? / 回来的声音，怎样告诉我们距离？

65. Same hand. Why a bigger shadow? / 手没变大，影子为什么变大？
66. Where do you aim to turn a light ray? / 把光“转弯”，该瞄准哪里？
67. Is there really another you behind the mirror? / 镜子后面，真的有另一个你？
68. Where did the straw in water “break”? / 水里的吸管，在哪里“折断”了？
69. Why does a magnifier sometimes enlarge and sometimes invert? / 放大镜，为什么有时放大、有时倒过来？
70. Where were the rainbow colours hiding? / 彩虹的颜色，原本藏在哪里？
71. Look from far away back to a book. What adjusts? / 从远处看回书本，眼睛调了哪里？
72. Same backpack. Why might a wider strap help? / 同一个书包，为什么宽带更舒服？
73. Why are snowshoes so large? / 雪鞋为什么做得那么大？
74. Why does a lower bottle hole have more push? / 水瓶低处的小孔，为什么更有劲？
75. How can invisible air push? / 看不见的空气，为什么能推？
76. Who pushes water up a straw? / 吸管里，是谁把水送上来？
77. Why is a sealed syringe harder to push? / 封住管口，活塞为什么更难推？
78. With buoyancy, why can an object still sink? / 有浮力，为什么还会下沉？
79. Why does water push more from below? / 水为什么从下面托得更多？
80. Which part does a rising water level measure? / 水位升高，究竟量到哪一部分？
81. Can displaced water tell us the supporting force? / 排开的水，能告诉我们托力吗？
82. Same 300 g: why can a box-shaped hull float? / 同样300 g，为什么盒形船体能浮？
83. How can a submarine rise or dive without growing? / 潜水艇不变大，怎样上浮或下潜？
84. Can air support a balloon too? / 空气也能托起一个气球吗？
85. Same box: why does a longer handle need less force? / 同一个盒子，长把手为什么更省力？
86. Same force: why does pulling along a handle give no turning effect? / 同样的力，为什么沿把手拉不动转轴？
87. Does adding a pulley always halve the force? / 多一个滑轮，就一定省一半力吗？
88. Small gear drives big gear: how do speed and torque trade? / 小齿轮带大齿轮，快慢与转动作用怎样交换？
89. Why does saving three quarters of the force not save work? / 省了四分之三的力，为什么没有省功？
90. Why does a real pulley need more effort than the ideal model? / 真实滑轮，为什么比理想模型更费力？
91. Clinging clothes: was new charge created? / 衣服粘在一起，电荷是新造出来的吗？
92. Attraction: must the charges be opposite? / 吸过来，就一定带相反电荷吗？
93. Same charge: does passing slowly or quickly matter? / 同样的电荷，慢慢通过和快速通过一样吗？
94. Connected to a battery: why is the lamp still off? / 灯泡接到电池，为什么还不亮？
95. Reverse a cell: are the charges still there? / 电池换个方向，电荷还是原来的那些吗？
96. Does a lamp eat current, or transfer energy? / 灯泡吃掉的是电流，还是转移能量？
97. A switch before or after the lamp: does it matter? / 开关在灯前或灯后，真的有区别吗？
98. A bridge is there: why can current still not pass? / 有一根“桥”，为什么电流还是过不去？
99. Two lamps in one path: who takes the current? / 两盏灯排成一条路，谁拿走了电流？
100. Switch one lamp off: why can the other stay on? / 关掉一盏灯，另一盏为什么还亮？

101. A different scale position: did the current change? / 指针换了位置，电流真的变了吗？
102. What is a cell’s 3 V label telling us? / 电池上的3 V，到底在说什么？
103. Where should two probes go to measure voltage? / 测电压，要把两根表笔放在哪里？
104. Same metal: what changes when it is longer or thicker? / 同一种金属，长一点或粗一点会怎样？
105. When does doubling voltage double current? / 电压翻倍，电流什么时候才翻倍？
106. Same watts: must the transferred energy be the same? / 瓦数相同，用掉的能量也相同吗？
107. All lamps went off: switching or fault protection? / 灯都灭了，是正常开关还是故障保护？

108. Why does a fridge magnet not stick to every metal? / 冰箱磁贴，为什么不粘住所有金属？
109. Turn a magnet around: why does pulling become pushing? / 翻个方向，磁铁怎么从拉变成推？
110. Without touching a magnet, how does a compass find its direction? / 没有碰到磁铁，指南针怎么知道朝哪边？
111. The map stayed still. Why did the compass turn? / 地图没转，指南针为什么偏了？
112. No extra magnet: how can current turn a needle? / 没有新增磁铁，通电怎么让磁针转向？
113. A switchable magnet: how can we compare its strength fairly? / 电磁铁能开关，怎样公平比较它的强弱？
114. The battery does not spin. How does a small fan turn? / 电池没转，小风扇为什么能转？
115. A hand-powered light: where does the energy come from? / 手摇灯没装电池，能量从哪里来？

116. The Sun crosses the sky each day. What is turning? / 太阳每天走过天空，是谁在转？
117. The same June: why are the hemispheres in opposite seasons? / 同一个六月，为什么两边季节相反？
118. A crescent Moon: what made the bright part shrink? / 月亮变成弯弯的一片，是谁遮住了它？
119. If Earth’s solar distance is 10 cm, where does Neptune go? / 把地日距离缩成10厘米，海王星放在哪里？
120. A satellite stays up. Is gravity absent there? / 卫星没掉下来，是因为那里没有重力？
121. A brighter-looking star: must it emit more light? / 看起来更亮，恒星就一定更会发光？
122. Write Earth’s address. What comes after the solar system? / 给地球写地址，太阳系之后该写什么？
123. Starlight travels for years. Which moment do we see? / 星光走了几年，我们看到的是哪一刻？
124. What can letters in a robot’s instructions do for us? / 机器人说明书里的字母，能替我们做什么？
125. A lamp runs for half a minute. Why is 2×0.5 wrong? / 小灯亮了半分钟，2×0.5为什么不对？
126. You know the shelf’s distance. How can you find time? / 知道书架有多远，怎样反过来找时间？
127. How do 3 paper centimetres become 300 park metres? / 纸上3厘米，怎么变成公园里的300米？
128. A spring gets longer. Which length is proportional to force? / 弹簧变长了，哪一个长度与力成正比？
129. Double the sole area. Why does pressure halve? / 鞋底面积翻倍，压强为什么反而减半？
130. Double the speed. Why do you need four energy tiles? / 速度翻倍，为什么能量要数四格？
131. How can you write a number with many zeros clearly? / 六个零的小数，怎样写得不容易看错？

132. One robot, new axis units. Did its motion change? / 同一机器人，换了坐标单位，运动也变了吗？
133. A line rests high on a graph. Is the walker suspended? / 图线停在高处，人是在半空停着吗？
134. A steeper line on screen: always faster motion? / 屏幕上更陡，就一定走得更快吗？
135. How does an area on a velocity graph become metres? / 速度图上的一块面积，怎么变成走过的米数？
136. Two heating lines are parallel. Why can their starts differ? / 两块材料升温线平行，起点为什么可以不同？
137. Each interval lasts one second. Why does the curve grow steeper? / 同样过一秒，图线为什么越走越陡？
138. Scattered points: how can you retain a trustworthy pattern? / 散点不在直线上，怎样留下可信的规律？

Each lesson includes a non-scored prediction, interactive exploration, explanation and misconceptions, a worked example, two or three practice questions, a takeaway, an exit question, and a home experiment. Predictions can be wrong; finishing requires exploration and correct practice/exit answers, with feedback and retries. Lessons are grouped by stage and unit. Counts and next-lesson links follow the content list; stable IDs preserve earlier progress when courses are inserted.

The mini lab offers rolling resistance, tool matching, equivalent length units, ruler measurement, repeated swing timing, a balance, a temperature mystery, data records, a walking graph, an iceberg tank, a clay-boat challenge, a first-bounce station, an echo explorer, robot races, falling-ball observation, a fair-test bench, mirror ray construction, wall polarization, and an inertia toy vehicle. The junior measurement stations add water displacement, ruler calibration, repeated-reading evidence, and indirect paper-thickness measurement. No additional runtime library is needed for these SVG interactions.

Models and playback speed are labelled. Rolling uses constant deceleration (`s = v₀t − ½at²`, clamped at rest); races use constant speed; falling uses `s = ½gt²` with air resistance omitted. The timing model has a 2 s full cycle and a configurable stop-button delay, played at 10× speed. The balance is an ideal equal-arm balance with preset object masses. The temperature model assumes room-temperature equilibrium and warmer skin. Data examples are explicitly preset teaching readings, not measurements or live-model results. Walking graphs show forward travel; a horizontal distance segment represents a pause, not a flat road.

Floating compares object mass with displaced water mass. The clay boat excludes 300 cm³ while dry; after flooding, only its solid clay and steel cargo displace water. Bounce height follows the square of the preset restitution ratio; playback stops after one rebound. Echo time uses the full outward-and-return path at 343 m/s in dry air near 20°C. All four mysteries label their assumptions, approximations and animation speeds.

The fair-test bench keeps launch speed fixed to compare stopping distances. Plane-mirror construction uses equal object/image distances and equal ray angles; dashed extensions represent the virtual image. The balloon station conserves neutral wall charge and shows qualitative polarization, without predicting real clinging. The seat-belt toy uses a stated ground frame and stops before modeling collision forces.

The Physics Detective project (`/physics/project/detective`) offers ten bilingual prompts for observations, questions, predictions, a fair plan, results and an evidence-based explanation. Drafts save locally and export as bilingual Markdown. Planning/completion badges indicate filled records, not scientific correctness or proven understanding; inconclusive outcomes are welcome.

Walking Investigation (`/physics/project/walking`) follows Stage 1 Unit 1.2: compare 5, 10 and 20 m walks, with three timed trials at each distance. The child records a fair plan, every raw reading, procedure notes, a separate 10 m journey's elapsed checkpoint times, and an evidence-based explanation. Additional trials retain originals, up to twelve per distance. An exclusion requires a reason and is reversible; incomplete reasons leave readings in the summary. Each group needs at least three used readings for its record badge. Mean time, range and pooled speed are derived from the entered readings, with raw means also retained. The range is not treated as full measurement uncertainty, nor are rounded displays claims of instrument precision.

Walking graphs separate unconnected independent-trial dots from one journey's elapsed-time checkpoints. Dashed checkpoint connections are approximations, not proof of constant speed or the location of pauses. Constructed example data are read-only and do not populate the child's draft. Bilingual Markdown reports retain every reading, exclusions and derived results; a report preview is available on the page. This project is a record tool, not an automatic verification of measurements or explanations.

Junior measurement labels preset data and instrument limits. Volume requires full immersion and compares cylinder change with block geometry. Calibration distinguishes resolution, repeatability and bias. The evidence board retains every original reading even after flagging a confirmed procedure problem. The paper model divides a stack reading and fixed endpoint error by sheet count, without claiming that stacking eliminates compression or gaps.

The four new motion stations compare train/ground reference frames, distance versus displacement, whole-trip average speed with a pause, and position–time versus accumulated-distance–time graphs. Coordinates, units and the positive direction are labelled. The train moves at 2 m/s; walking is ±1 m/s relative to its carriage. The average-speed trip uses unequal segment speeds, while the graph trip explicitly uses 2 m/s in both directions with a 2 s pause. These prescribed models idealize starts, stops and reversal; they are not the child's real walking measurements. Average speed includes pause time; zero displacement does not imply zero distance or speed.

The force stations compare cart motion and spring deformation, opposing collinear pulls on one cart, static/sliding friction, and equal-mass paper drops with/without air. Cart and block mass is 2 kg; events span 2 s at 2× playback. Static friction adjusts up to 3 N; sliding friction is 2 N, with motion reassessed at stopping rather than continuing backwards under friction alone. The spring uses a static linear model, natural length 20 cm and stiffness 40 N/m. Paper drops use the same 5 g mass and 20 m virtual height, with g≈10 m/s² and prescribed linear drag coefficients; real flutter is not modeled. Playback ends at first contact, omitting impact. The height is for screen comparison; home investigations use a low release. Zero net force preserves motion and is not confused with zero velocity.

The gravity stations cover the six introductory topics in Unit 1.4 through three connected investigations. Compare an equal-arm balance with a stationary hanging force meter; move matching backpacks between Earth and Moon; compare 0.1/1 kg balls in ideal no-air falls. Local g is prescribed as 10 N/kg on Earth and 1.6 N/kg on the Moon (equivalently m/s² for free-fall acceleration). A separate example Earth-calibrated spring scale converts force using Earth g, clearly separating its labelled kg reading from actual mass. Falling is from 5 m at rest, with 1× playback ending at first contact; a time slider does not count as completing a release. Ball sizes are schematic; collision and support forces after landing are omitted. Home observations use low heights and are not vacuum experiments.

The four density stations compare equal-volume materials, calculate regular-block density in two unit systems, preserve displacement readings under valid and invalid conditions, and compare solid/liquid densities. Prescribed samples use wood 0.6, aluminium 2.7 and steel 7.8 g/cm³. Regular volume reuses the three-edge geometry model; irregular volume reuses water displacement. A 54 g specimen has full volume 20 cm³, with partial immersion displacing only 12 mL and an attached bubble adding 4 mL. Apparent density is distinguished from a valid specimen measurement. The floating model reuses static displacement balance for 20 cm³ solids in fresh water 1.00 and salt water 1.05 g/cm³. Equal density permits full neutral immersion at an illustrative depth. The one-second animation shows a transition to the final state, not a prediction of fluid motion. Mystery Materials now connects these comparisons to the learner’s own measurements.

Mystery Materials (`/physics/project/materials`) follows Unit 1.5 through four compact steps: prepare, readings, clues and explanation. Up to four specimens each retain two to six mass/volume trials. Volume comes from three edges or water-level change using the existing geometry/displacement models. Changing method keeps old fields but requires checking volume conditions again. Only checked, unexcluded paired readings enter the used summary; reasoned exclusions retain originals. Summary density is mean mass / mean volume, not the mean of trial densities. Each specimen needs a name, at least two usable readings, observations, a judgment and uncertainty; shared planning is also required for the whole-project record badge.

Four prescribed teaching samples provide comparison densities, not natural-material ranges or an automatic identity result. Relative differences have no identification-success threshold. The learner may conclude that identity remains uncertain. Read-only examples never populate drafts. Bilingual report exports and previews retain all raw fields, procedure checks, exclusions and explanations; report UI is shared with Walking Investigation. Native file delivery remains unverified in the in-app browser, while the report payload and preview have been checked.

The six energy stations connect battery transfers, kinetic energy, gravitational reference height, elastic release, ideal conservation and dissipation/efficiency. Bars use a fixed shared joule scale. Battery values track a prescribed 12 J portion, including cumulative light carried out rather than light stored in the lamp. Mass/speed comparisons use Ek=½mv². Book–Earth values use g=10 N/kg and Eg=mg(h−h₀), allowing negative reference labels while keeping descent differences unchanged. Spring release uses a 0.5 kg cart and linear spring, stopping inspection at the first natural-length crossing with nonzero velocity; playback is 10× slower than model time. Full lamp observations and spring releases are required; slider seeking does not count.

Track circles are position probes, and inspection scans are not predictions of travel time. A nonrotating 1 kg slider starts from 1 m with 10 J. Ideal mechanical energy remains 10 J. The prescribed rough teaching ledger adds 4u J to internal energy along position index u and reaches its first return at u=0.9, height 0.64 m: 6.4 J mechanical plus 3.6 J internal-energy increase. It does not infer a real friction coefficient. Efficiency is 64% for the explicitly defined task of raising the cart again; warming can be useful for other tasks. Conditions are available in each lab, with a visible teaching-model label.

The five work/power stations start with tired arms, pushing boxes, hoists, stairs and ramps. Named constant forces and ground-frame displacement distinguish positive, zero and negative work. The constant-force rectangle uses displacement rather than time; an explicitly prescribed balancing sliding resistance keeps the steady box’s net work zero. Two hoists share an observation clock but each task’s average mechanical power uses its own duration, including when the faster hoist subsequently waits. Seeking on the clock does not count as a complete observation.

Stair power estimates use prescribed total mass, vertical rise and same-ascent time at g=10 N/kg. Mechanical output is not bodily chemical-energy consumption, health or fitness scoring. The separate Stair Power field project records the learner’s own measurements. Ramp comparisons use a nonrotating 2 kg load rising 1 m: direct, short and long ideal paths all require 20 J. Prescribed 2 N friction over 4 m changes input to 28 J, useful rise to 20 J, internal increase to 8 J and defined-task efficiency to 71.4%. Animation illustrates paths, not task duration; readouts explicitly describe complete tasks. Energy and work labs share the same joule-bar rendering without adding libraries.

Stair Power (`/physics/project/power`) follows Unit 2.2 through four steps: prepare, rise/mass, ascent times, and explanation/report. Count vertical risers, retain at least two height readings at different positions on an approximately equal-riser flight, enter the same total mass in kg and record at least three checked ascent times. The project uses g≈10 N/kg and h≈count×mean riser cm/100. Ordinary walking with a helper provides evidence without a fastest-time competition. Unequal flights require a different measurement procedure; the app does not silently treat a sloping path as vertical height.

Up to twelve height and twelve time records retain notes, checked conditions and reversible exclusions. Pending reasons leave valid checked readings in the summary but prevent the complete-record badge. Raw numeric means include unchecked and excluded values; used means do not. Summary mechanical power is summed mgh for identical tasks / summed used times, equal to mgh / mean used time, not an arithmetic mean of individual powers. Changing mass, riser count or height readings resets ascent confirmations without erasing original times; changing route or timing procedure also requests reconfirmation. Independent-ascent bars keep excluded/unchecked values visible and do not imply one continuous journey. Reports and previews retain all originals, reasons, means and model limitations. This estimates gravitational mechanical output, not chemical-energy consumption, fitness or health. The record badge indicates completed fields, not verified measurements or mastery.

Five thermal stations introduce Unit 2.3 through gas particles, water heating, transfer paths, insulated cups and a wet cloth. The same ideal monatomic gas compares temperature and quantity using absolute temperature; doubling Celsius does not double kinetic energy. Gas dots depict relative particle number and thermal motion, with animation time explicitly schematic. Water uses c≈4200 J/(kg·°C), starts at 20°C and remains liquid; input is energy absorbed by water, not plug electricity. Q and the water’s internal-energy increase describe the same transfer here and must not be added.

Conduction, convection and radiation diagrams explain different mechanisms without claiming quantitative heating rates. Convection markers represent moving fluid parcels; radiation includes emission and absorption in both directions with net transfer from hotter to cooler. Real situations can combine pathways. The cup model uses the same water heat capacity of 420 J/°C, prescribed conductances 0.70/0.14 W/°C, a constant-temperature room and a shared 0–10 min clock. Only the elapsed parts of curves appear; seeking does not count as a complete comparison. Insulation slows both cooling and warming. The 2.5-second animation represents ten model minutes, not a real warming time.

The wet-surface model prescribes net rates 0/0.10/0.20 g/min for five minutes, with 2 g starting water, 20°C room, fixed effective heat capacity 200 J/°C, conductance 0.5 W/°C and approximate vaporisation energy 2400 J/g. It tracks remaining water, surface temperature, cumulative evaporation energy and signed internal-energy change. Room input equals evaporation energy plus the signed surface change. Rates are not predictions of wind/humidity; real air movement can also change convection. The model ends while wet and is not a bodily cooling or drying-time model. Melting, boiling and phase-change curves are extended by the four stations below. All five courses include three practice questions, a transfer exit and a home observation.

Four phase-change stations extend Unit 2.3. The fusion ledger compares 50/100 g ice absorbing 16.70 kJ and 50/100 g water releasing it, all at 0°C. Pure water, near normal atmospheric pressure and uniform equilibrium are prescribed; supercooling, impurities, container storage and small volume work are omitted. L≈334 J/g gives 50 g changed in each case. The strip depicts mass fractions rather than volumes. Signed transfer is distinguished from an exact internal-energy change.

The boiling station starts at 100°C and uses L≈2260 J/g: 20 g receiving 11.30/22.60 kJ vaporises 5/10 g; 40 g receiving 22.60 kJ vaporises 10 g. Remaining liquid plus escaped vapour retains the original mass. Bubbles represent vapour, not air; dots symbolise invisible gas, not white mist droplets. Pressure-dependent boiling conditions, evaporation below boiling, and state change without molecular decomposition are explained. Home work uses sketches and screen comparisons without boiling water.

The sealed-cup station prescribes 25°C air and compares surface/dew-point pairs 8/15, 8/5 and 22/15°C. Only the first supports new net condensation. Dew point is an input, not calculated humidity; initially dry surfaces remain above freezing. Droplet count, animation time and vapour dots are schematic. No amount or condensation time is predicted, and pre-existing droplets are distinguished from new condensation.

Heating curves follow pure ice at −10°C through a 0°C melting plateau to water at 20°C. The 20 g/50 W, 20 g/100 W and 40 g/50 W cases share fixed 0–360 s and −10–20°C axes. Only elapsed curve vertices are drawn; seeking does not replace complete playback. Net absorbed power is prescribed and each model duration is compressed into 2.5 seconds. Three separate energy uses retain a shared 0–17.56 kJ bar scale. Ice/water heat capacities are 2.1/4.2 J/(g·°C). Same-mass doubled power halves all stage times without changing 8.78 kJ total; doubled mass needs 17.56 kJ. These are ideal sample times, not appliance or thawing predictions. A temperature–time area is not treated as energy. All four courses include three practice questions, a transfer exit and a home activity. Two-cup Insulation now connects these thermal ideas to the learner’s own measurements.

Lesson bodies and assessments load in eighteen content groups only when opening a course or review card. Home, path and progress use a generated lightweight catalog with titles, order and assessment bounds/answer keys, without importing the bilingual bodies. Completed records are validated before any body loads. Content is cached by group, concurrent readers share a request, and mismatched catalog/content is rejected. Loading/failure states retain saved work; the retry button reopens the current page, allowing browser module failures to recover. Tests enforce catalog/body parity and existing progress invariants.

Two-cup Insulation (`/physics/project/insulation`) follows Unit 2.3 with four steps: prepare, starting point, shared clock, and explanation/report. Record each cup’s water mass and initial temperature plus room temperature; later pairs share an elapsed-time clock (minutes). At least three checked later time points, a checked baseline, a plan, resolved entered records and explanations support the complete-record badge. Labels fix A as bare and B as wrapped. The child’s data start empty; the constructed example is read-only. Comfortably warm water and a helper keep the project practical without heating or boiling.

Up to twelve original paired readings retain values, optional later room temperatures, checks and procedure notes. Reasoned exclusions are reversible; pending exclusions remain used when valid/checked and block completeness. Used times must strictly increase in original entry order. Duplicate or reversed used times suppress connections and latest-drop summaries. Temperature reversals are retained rather than forced into a model cooling curve. Both cups share a 0–60°C plot; solid dots show checked used data and hollow dots show plottable unused originals. Dashed connections approximate between measured points, not a fitted or continuous measurement.

Each temperature drop is its own T₀−T at the latest used time; negative drops mean warming. Unequal starting masses/temperatures and non-warm starts produce comparison cautions without deleting evidence or pretending to verify the experiment. Changing starting quantities, conditions or procedure clears confirmations and preserves originals. Different times are not averaged as repeat trials; no winner, heat-transfer parameter or energy is inferred from temperature alone. The bilingual report retains original invalid/excluded entries and limitations, with the existing shared export and preview controls. Path, notebook and the insulation lesson link to the saved project.

Five sound courses connect Unit 2.4’s ten introductory topics through one core question each: vibrating sources; medium/local longitudinal motion; frequency/pitch; amplitude/loudness; and echo/ultrasound ranging. A finite source pulse vibrates twice at 200 Hz over 0–10 ms; at 6.86 m in air the first arrival is 20 ms, after the source has stopped. Source amplitudes 0.10/0.20 mm have the same arrival. A never-started source produces no signal, rather than deleting a previously emitted wave. Enlarged markers represent local organised medium motion about grey equilibrium points, not molecular thermal motion or bulk transport. Air and fresh water near 20°C use prescribed 343/1480 m/s, giving 20.00/4.64 ms for the same 6.86 m; vacuum has no mechanical propagation, rather than zero travel time.

Pitch/amplitude workbenches (`sound-pitch`, `sound-amplitude`) show full 0–10 ms previews of ideal relative pressure at a fixed place, with a green time probe. Sliders update the curve immediately. Required frequencies 200/400/800 Hz retain 2/4/8 cycles and 5/2.5/1.25 ms periods at fixed amplitude 0.50; amplitude cases 0.25/0.50/1.00 retain four cycles and 2.5 ms at 400 Hz. Frequency can be adjusted in 50 Hz steps and relative amplitude in 0.05 steps. Three complete 2.5-second visual observations are required per station; previewing, seeking, listening and custom intermediate settings do not count as the prescribed comparisons.

Optional explicit-button Web Audio playback generates 0.7-second sine tones with smoothed starts/ends and live slider changes. Output gain is bounded at 0.015; nothing autoplays, and contexts close after playback or unmounting. Device volume begins low; actual output is not calibrated to plotted pressure or decibels. Different ears, frequencies, speakers and rooms can produce different perceived loudness. Unsupported/failed audio shows a bilingual fallback and does not block graphical learning. This is not a hearing test.

Ranging follows a pulse front, not an air particle or complete carrier waveform: 17.15/34.30 m at 2 kHz give 100/200 ms echoes, and 34.30 m at 40 kHz retains 200 ms. Emitter/receiver share a position, obstacles are fixed, air speed is 343 m/s and loss/dispersion/detection delay are omitted. Ultrasound conventionally exceeds 20 kHz; no ultrasonic tone is played, and these paths do not predict a real sensor’s range. Pressure–time graphs are not particle paths, and greater amplitude/frequency does not imply higher sound speed. All five courses include three practice questions, a transfer exit and a practical home observation.

Sound reference checks: [OpenStax sound waves](https://openstax.org/books/college-physics-2e/pages/17-1-sound), [speed/frequency/wavelength and medium table](https://openstax.org/books/college-physics-2e/pages/17-2-speed-of-sound-frequency-and-wavelength), and [sound intensity/level](https://openstax.org/books/college-physics-2e/pages/17-3-sound-intensity-and-sound-level). The app uses original SVGs and original bilingual explanations, without downloaded illustrations or new runtime dependencies.

Seven light courses connect Unit 2.5’s twelve introductory topics through shadows, reflection angles, plane mirrors, air–water refraction, lens images, colour/dispersion and eye focusing. Each includes three required path traces, three practice questions, a transfer exit and a home observation. The saved periscope field project is available below; deeper optical/wave treatment remains in Stage 6. New labs reuse comparison controls, metrics, animation, bilingual text and lesson flow, without added runtime dependencies.

Point-source shadows share a fixed screen at 6 m; 1 m at 2 m, 1 m at 3 m and 2 m at 3 m give shadow heights 3/2/4 m. Reflection angles 20/45/60° are measured from a perpendicular normal, with complementary surface angles shown separately. Plane mirrors retain 0.4/0.6/0.8 m object and image distances and 0.8/1.2/1.6 m separations. Real reflected paths stay in front; backward dashed extensions locate virtual images. Ray arrows show direction, and moving green markers are construction guides rather than photons or measured flight times.

Refraction uses one flat interface, air n=1 and water n=1.333: normal entry keeps direction; 45° air→water gives 32.04°, and 30° water→air gives 41.80°. Free incident-angle adjustment includes total internal reflection above about 48.61° water→air, with no fabricated transmitted ray. Medium speed ratios describe material properties, even when transmission is absent; faint reflected lines do not predict intensity.

Converging thin-lens cases at f=1 use dₒ=3/2/0.75, giving signed dᵢ=1.5/2/−3 and magnifications −0.5/−1/+4. Principal-ray paths and image arrows share one coordinate scale. The eye model keeps its intercepting retina at 1.5: changing dₒ=3→2 at f=1 shifts the ideal lens image behind it; f=6/7 restores focus. Actual tracing stops at the retina, while dashed forward constructions indicate where rays would meet without an intercepting screen. An enlarged cue compares the same point’s two retinal intersections; this is not a measured blur diameter or vision test. Cornea/lens anatomy and brain processing are explained separately from the single-lens approximation.

The dispersion station traces a single 60° prism at 45° incidence, using prescribed three-band RGB indices 1.51/1.52/1.53 and two Snell refractions. The three represented paths share entry point, incoming direction and actual prism geometry, with a larger blue deviation. White light is explicitly a broad spectrum, not literally three rays. Ideal red/blue filters only transmit present bands; red-only through blue gives no transmitted band. Additive light and pigment mixing are distinguished. A natural rainbow includes droplet refraction, internal reflection and dispersion; the prism drawing does not claim to trace a whole raindrop. Required unfiltered source comparisons remain separate from custom filter explorations.

Light reference checks: [OpenStax ray model](https://openstax.org/books/college-physics-2e/pages/25-1-the-ray-aspect-of-light), [reflection](https://openstax.org/books/college-physics-2e/pages/25-2-the-law-of-reflection), [refraction](https://openstax.org/books/college-physics-2e/pages/25-3-the-law-of-refraction), [dispersion](https://openstax.org/books/college-physics-2e/pages/25-5-dispersion-the-rainbow-and-prisms), [thin lenses](https://openstax.org/books/college-physics-2e/pages/25-6-image-formation-by-lenses), and [eye accommodation](https://openstax.org/books/college-physics-2e/pages/26-1-physics-of-the-eye). Course wording, cases, SVG art and assessments are original.

Periscope (`/physics/project/periscope`) completes Unit 2.5’s build project through prepare → build/trace → own trials → explanation/report. Use cardboard, two small plastic craft mirrors, tape and an ordinary room-lit paper target, with a helper for openings. Start with parallel 45° mirror planes and inward facing reflective surfaces. Compare lower tilt while holding the upper mirror, target, viewpoint and lighting fixed; revisit the starting setting. Children’s fields begin empty, and model settings are never copied into observations.

The original SVG preview applies vector reflection twice. Upper tilt stays 45°; lower tilt is 30–60° from horizontal. At lower 35°/45°/55°, a representative ray exits at −20°/0°/+20° and misses/reaches/misses the fixed eye aperture. The barrier blocks the direct target-to-eye line. Mirrors have distinct reflective faces/backing; rays pass through the specified tube openings. The moving green marker indicates construction order, not light speed. One ideal point ray reaching an aperture does not establish a clear full image or a successful real build.

Three blank trial cards can grow to eight retained originals. Each records a setting, optional decimal tilt (0–90° from horizontal), visible/partly visible/not visible outcome and specific observation. Only valid checked records without a reasoned exclusion are used. Pending exclusion reasons block completeness; justified exclusions are reversible and preserve originals. Changes to materials, procedure or construction clear build/condition and trial confirmations. Evidence edits clear only that trial’s confirmation. Completion requires a plan, checked build/conditions, at least three used trials across two setting labels, resolved entered records and explanations; it certifies record completeness rather than scientific correctness, fairness, device success or understanding. No score, visibility average or automatic success rate is calculated. Path, notebook and the reflection/plane-mirror takeaway link to the project; the shared report preview/export retains original invalid and excluded evidence.

Build references: [Science Museum Group activity](https://www.sciencemuseumgroup.org.uk/sites/default/files/2025-12/SMG-Learning-Activities-360-Periscope.pdf), [Science Foundation Ireland guide](https://www.sfi.ie/site-files/primary-science/media/pdfs/col/make_a_periscope.pdf). Instructions, examples and SVG graphics are original; no activity templates or images were copied.

Course bodies load in twenty groups. The electric foundation and quantitative bodies and their seventeen experiment exports load on demand; the lightweight catalog keeps progress validation synchronous. Build sizes are recorded for each verified batch in CONTENT_PROGRESS.md; they are not measurements of device loading time.

Interactive station groups and the field projects also load on demand; the hub separately lazy-loads Physics. Bilingual preparation states appear while content is loading.

For completed content, plan mapping, and remaining work, see [CONTENT_PROGRESS.md](CONTENT_PROGRESS.md).

## Electricity foundation

Ten courses cover Unit 3.4 topics 1–13 through clothes/comb charge, torch contacts, remote-cell polarity and independent room lighting. The lessons preserve prediction → three full model comparisons → explanation → practice → transfer exit. Seeking and free settings do not count as required comparisons. Retained tables are clearly labelled model results, separate from the child’s measurements.

The charge animation counts electrons in transit in the conserved total. A held neutral partner can polarize while remaining net neutral; qualitative arrows do not predict motion. Current uses Q/Δt over the assigned physical window, independent of the 2.4 s display. Circuit models use an ideal fixed DC source, ideal wires and constant resistive loads. Negative current indicates reversal of the reference direction. Series carries the same current; parallel branch currents sum. The lamp separates conserved charge from light/thermal energy transfer. No real filament, LED, switching transient, battery internal resistance or household installation is simulated.

References used to check concepts: [OpenStax charge conservation](https://openstax.org/books/college-physics-2e/pages/18-1-static-electricity-and-charge-conservation-of-charge), [conductors and insulators](https://openstax.org/books/college-physics-2e/pages/18-2-conductors-and-insulators), [current](https://openstax.org/books/college-physics-2e/pages/20-1-current), [resistance and simple circuits](https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits), [power and energy](https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy), [series and parallel](https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel). Text, examples, diagrams and activities are original. Seven further courses now cover topics 14–20, described below.

## Electrical measurement, relationships and safety

Seven original bilingual courses complete Unit 3.4’s twenty introductory topics across seventeen courses. Thirty-division scales compare unchanged 0.3 A on two current ranges; wrong across-cell current-meter wiring is blocked and has no fabricated zero reading. Ideal voltmeters compare 1/2/3 V across series loads/source without changing the 0.1 A loop current. Red/black order changes signed readings; scale magnitude and range resolution remain separate.

An energy/charge ledger establishes voltage as J/C, including an empty inspection start without dividing 0/0. Fixed-material, fixed-temperature wire cases isolate length and area (10/20/5 Ω). U–I sweeps compare two constant resistors with an explicitly assigned changing-resistance curve; the latter illustrates why Ohm’s law needs conditions and does not claim a measured filament response. Electrical power compares steady watts with accumulated joules over assigned physical intervals, independently of animation speed.

The fault detective distinguishes added-load overload from a low-resistance bypass. Its 3 V model includes 0.5 Ω source internal resistance and a prescribed 0.8 A isolation threshold. Prospective unprotected currents and protected currents are separate; fault diagrams remain open with zero protected current. These numbers are model conditions rather than household ratings, and the station does not energise faults or simulate shock/trip time. Home activities use paper, labels or adult-assisted external observation of unplugged equipment.

Reference checks: OpenStax [potential difference](https://openstax.org/books/college-physics-2e/pages/19-1-electric-potential-energy-potential-difference), [DC voltmeters and ammeters](https://openstax.org/books/college-physics-2e/pages/21-4-dc-voltmeters-and-ammeters), [resistance and resistivity](https://openstax.org/books/college-physics-2e/pages/20-3-resistance-and-resistivity), [electric hazards](https://openstax.org/books/college-physics-2e/pages/20-6-electric-hazards-and-the-human-body), and WorkSafe NZ [cords and leads](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-electricity/cords-and-leads/) and [electrical equipment and appliances](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-electricity/electrical-equipment-and-appliances/). Wording, cases, SVG diagrams and assessments are original. Magnetism and the remaining full curriculum are still planned.

## Shared infrastructure

Reuses Chemistry's existing React 19, React Router, TypeScript, Vite and Vitest versions. Uses `@study/shared` for bilingual types and `@study/ui` for the language preference/switcher and bilingual text rendering. No new third-party libraries were added. Physics has its own package, content, styles, progress key and simulations; Chemistry-specific lessons and progress are separate. Physics is lazy-loaded from the Study hub.

## Local data

`study-physics-progress-v1` stores course position, prediction, exploration, answers, completion/review times, up to 100 notebook entries, the Physics Detective draft, the bounded Walking Investigation draft, the bounded Mystery Materials draft, the bounded Stair Power draft, the bounded Two-cup Insulation draft, and the bounded Periscope draft. `study-language` is the shared language preference. Storage is validated on loading, and unavailable storage produces a visible message. Data stays in the browser profile; clearing site data removes it, and it does not sync to another device/browser. Wrong answers remain in the review queue until reviewed; completed lessons become due 24 hours after completion or the last review.

## Extend

- `apps/web/src/content/schema.ts`: typed bilingual lesson and assessment schema.
- `apps/web/src/content/lessons.ts`: full ordered collection for catalog generation and content tests; runtime pages must not import it.
- `apps/web/src/content/foundations.ts`: original five course bodies with stable IDs.
- `apps/web/src/content/catalog.ts` and `catalogEntry.ts`: generated lightweight catalog and assessment metadata schema.
- `apps/web/src/content/curriculum.ts`: unit labels and nine-stage roadmap.
- `apps/web/src/content/packs.ts` and `loadLesson.ts`: on-demand group imports, shared request cache and catalog/content checks.
- `apps/web/src/LessonContentGate.tsx`: loading/failure/recovery interface for lessons and review cards.
- `apps/web/scripts/update-catalog.mjs`: deterministic catalog generation from full source content.
- `apps/web/src/content/measurement.ts`: measurement and data lesson content.
- `apps/web/src/content/measurementSkills.ts`: Stage 1 volume, accuracy, repeats and indirect measurement.
- `apps/web/src/content/motion.ts`: reference frames, distance/displacement, average speed and motion graphs.
- `apps/web/src/content/forces.ts`: force effects, balanced/unbalanced forces, friction and air resistance.
- `apps/web/src/content/gravity.ts`: mass/weight, Earth/Moon gravity, instrument calibration and free-fall intuition.
- `apps/web/src/content/energy.ts`: Stage 2 energy stores/transfers, kinetic/gravitational/elastic energy, conservation, dissipation and task-specific efficiency.
- `apps/web/src/interactive/EnergyLabs.tsx`, `EnergyArt.tsx` and `energyModels.ts`: six SVG stations, course art and validated energy calculations.
- `apps/web/src/content/work.ts`: Stage 2 work, constant-force displacement area, task-average power, stair estimates and ramp force–distance trade-offs.
- `apps/web/src/interactive/WorkLabs.tsx`, `WorkArt.tsx` and `workModels.ts`: five SVG stations, course art and validated work/power calculations.
- `apps/web/src/content/thermal.ts`: Stage 2 temperature, internal energy, heating, transfer paths, insulation and evaporation.
- `apps/web/src/interactive/ThermalLabs.tsx`, `ThermalArt.tsx` and `thermalModels.ts`: five SVG stations, card art and validated thermal calculations.
- `apps/web/src/content/light.ts`: seven optical investigations from shadow boundaries to eye accommodation.
- `apps/web/src/interactive/LightLabs.tsx`, `LightArt.tsx` and `lightModels.ts`: shared-scale ray constructions, Snell/prism geometry, thin-lens images and fixed-retina focusing.
- `apps/web/src/content/machines.ts`: six Stage 3 simple-machine investigations.
- `apps/web/src/interactive/MachineLabs.tsx`, `MachineArt.tsx`, `machineModels.ts` and `machineGeometry.ts`: controlled levers, perpendicular moment arms, continuous ropes, external gears and ideal/lossy energy ledgers.
- `apps/web/src/LiftingProject.tsx`, `lifting.ts`, `liftingDesign.ts`, `liftingReport.ts` and `LiftingCard.tsx`: saved four-step lever design, bounded physical evidence and bilingual report; the full project and machine calculations load on demand.
- `apps/web/src/content/buoyancy.ts`: seven complete Stage 3 buoyancy investigations.
- `apps/web/src/interactive/BuoyancyLabs.tsx`, `BuoyancyArt.tsx` and `buoyancyModels.ts`: displaced-fluid forces, controlled immersion, force-meter accounting, sealed hulls, ballast and vented-air mass budgets.
- `apps/web/src/content/sound.ts`: five sound courses from vibrating sources to echo/ultrasound transfer.
- `apps/web/src/interactive/SoundLabs.tsx`, `SoundArt.tsx` and `soundModels.ts`: finite local pulses, medium arrivals, live pressure previews, explicit short-tone playback and round-trip ranging.
- `apps/web/src/content/phase.ts`: melting/freezing, boiling, condensation and complete heating curves.
- `apps/web/src/interactive/PhaseLabs.tsx`, `PhaseArt.tsx` and `phaseModels.ts`: four phase-change stations, distinct card art, latent-transfer calculations and exact elapsed curve vertices.
- `apps/web/src/interactive/EnergyBars.tsx`: common fixed-scale joule bars for energy, work and water heating.
- `apps/web/src/content/density.ts`: equal-volume comparisons, m/V with consistent units, displacement conditions and solid/liquid density.
- `apps/web/src/interactive/LabControls.tsx`: shared comparison controls, readouts and observation gates for force/gravity/density labs.
- `apps/web/src/content/mysteries.ts`: everyday floating, boats, bounce and echo lessons.
- `apps/web/src/content/discoveries.ts`: fair comparison, mirror, polarization and inertia lessons.
- `apps/web/src/ProjectPage.tsx` and `projects.ts`: field-project interface, validation and export.
- `apps/web/src/WalkingProject.tsx`, `WalkingCard.tsx` and `walking.ts`: walking records, summaries, checkpoint graphs, validation and bilingual reports.
- `apps/web/src/MaterialsProject.tsx`, `MaterialsCard.tsx` and `materials.ts`: specimen records, paired mass/volume summaries, condition checks, validation and bilingual reports.
- `apps/web/src/PowerProject.tsx`, `PowerCard.tsx` and `power.ts`: own stair rise/mass/time records, raw/used summaries, bounded persistence, independent-ascent bars and bilingual reports.
- `apps/web/src/InsulationProject.tsx`, `InsulationCard.tsx` and `insulation.ts`: matched-time cup records, own baselines, retained exclusions, strictly ordered measured curves, bounded persistence and bilingual reports.
- `apps/web/src/PeriscopeProject.tsx`, `PeriscopeCard.tsx`, `periscope.ts`, `periscopeReport.ts` and `interactive/periscopeModel.ts`: own build/observations, two-reflection preview, retained exclusions, bounded persistence and lazy bilingual report copy.
- `apps/web/src/ProjectReport.tsx`: shared local Markdown report link and read-only preview.
- `apps/web/src/content/magnetism.ts`: eight Stage 3 magnetic investigations representing all ten Unit 3.5 topics.
- `apps/web/src/interactive/MagneticLabs.tsx`, `MagneticArt.tsx` and `magneticModels.ts`: direction maps, field superposition, controlled coil comparisons, motor torque and AC generation.
- `apps/web/src/content/space.ts`: eight Earth/space investigations covering all twelve Unit 3.6 topics.
- `apps/web/src/interactive/SpaceLabs.tsx`, `SpaceArt.tsx` and `spaceModels.ts`: solar orientation, tilted-season geometry, spherical moon phases, shared rulers, analytic orbit paths and light travel.
- `apps/web/src/content/experiments.ts`: exploration-station catalog.
- `apps/web/src/interactive/`: physical models and interactive SVG labs.
- `apps/web/src/progress.ts`: validated persistence and review scheduling.
- `apps/web/src/LessonPage.tsx`: common five-step lesson template.
- `apps/web/src/App.tsx`: dashboard, path, lab, notebook and review.
- `apps/web/src/styles.css`: scoped visual system and responsive layouts.

Add content using the same schema and reuse the common lesson template. Register a new content group in `LessonPack`, `lessonPacks` and `lessonCollections`, add its courses to the ordered collection, then run `corepack pnpm --filter @study/physics-web catalog:update` from Study. Catalog generation formats the file automatically. Edit lesson source rather than hand-editing the generated catalog; the integrity test rejects stale titles, order, bounds and answer keys. Avoid duplicating the interface per course. V1 uses plain text for simple formulas; introduce a shared math renderer when later courses need complex notation.

## Checks

From Study:

```sh
corepack pnpm -r --if-present typecheck
corepack pnpm exec vitest run
corepack pnpm -r --if-present build
npm run lint
npm run format:check
```

Physics tests cover corrupted storage, mastery gates, review timing, model calculations, equivalent units, repeated timing, consistent graph/table/track data, course ordering, preserved V1 completions, and bilingual content integrity. The interface also supports reduced motion and keyboard controls.

Six pressure courses open Stage 3 Unit 3.1, covering its eight foundation topics by pairing force/area with the pressure formula and liquid pressure with depth. Backpack straps, snowshoe patches, a bottle-depth probe, atmospheric opposing forces, static straw columns and trapped-air syringes each have three prescribed comparisons, retained model tables, free exploration where meaningful, three practice questions, a transfer exit and a home observation. Original SVG cards and diagrams use existing React, localization, lab controls and progress infrastructure; no runtime dependencies were added.

Contact pressure converts cm² to m². Equal 1 cm² cells conserve force; both-foot rectangle areas and forces stay matched. Uniform stationary liquid uses Δp=ρgh with g≈10 N/kg and a 101 kPa prescribed surface pressure; probe orientation and vessel width do not change the same-depth reading. Total pressure is distinct from the liquid increment. A flat atmospheric piston compares both nonzero opposing forces, with net force (p_out−p_in)A. Straw comparisons show stationary height relative to the cup surface and distinguish a later sealed-headspace balance from initial outflow. The syringe uses absolute pV at fixed gas amount and temperature, and separates vented gas from sealed gas and ideal extra holding force from friction. Inspection markers indicate reading order, not fluid motion, piston travel or physical time. Seeking or arbitrary settings do not replace the three prescribed inspections.

Pressure reference checks: OpenStax [force per area](https://openstax.org/books/college-physics-2e/pages/11-3-pressure), [pressure with depth](https://openstax.org/books/college-physics-2e/pages/11-4-variation-of-pressure-with-depth-in-a-fluid), [absolute and gauge pressure](https://openstax.org/books/college-physics-2e/pages/11-6-gauge-pressure-absolute-pressure-and-pressure-measurement), and [constant-temperature gas relations](https://openstax.org/books/college-physics-2e/pages/13-3-the-ideal-gas-law). Wording, diagrams and cases are original. Stage 3 magnetism and Earth/space are now available; the mathematics bridge and high-school stages remain in progress.

## Buoyancy investigations

Seven courses follow Stage 3 Unit 3.2 in plan order: buoyancy versus floating, the pressure-force origin, displaced volume, Archimedes’ principle, ships, submarines and hot-air balloons. Each has three prescribed comparisons, retained results, three practice questions, a transfer exit and a home observation. Models reuse the pressure calculations and existing React/SVG, bilingual controls, animation, progress and lazy-loading infrastructure. No new runtime dependency was added.

Initial fully submerged release compares upward buoyancy with downward weight; it does not animate a calculated trajectory. Surface floating reduces actual displacement until buoyancy matches weight. The pressure model uses equal horizontal faces and matched-depth cancelling side forces; increased depth changes both large opposing forces, while their difference stays fixed in a uniform liquid for a rigid fully submerged body. Controlled lowering is the animated exception: a held block and rising waterline agree with the instantaneous submerged volume, preserving vessel/body geometry. Animation duration is illustrative, not a measurement.

The force-meter ledger uses equal-mass prescribed bodies with different volumes, and balances tension plus buoyancy against weight. A rigid sealed box distinguishes actual floating support from maximum fully submerged capacity and retains its excluded volume when overloaded; this is not a flooding model or safe-load rating. The rigid submarine changes internal ballast mass while preserving external displacement. The vented balloon counts inside-air mass and equipment together: reducing internal density can leave the total weight greater than buoyancy. Its assigned densities do not compute temperatures or flight heights. Six static inspection markers show reading order, not physical motion; seeking/custom cases do not count as prescribed runs.

Reference checks: OpenStax [Archimedes’ principle](https://openstax.org/books/college-physics-2e/pages/11-7-archimedes-principle), [density](https://openstax.org/books/college-physics-2e/pages/11-2-density) and [gas state relations](https://openstax.org/books/college-physics-2e/pages/13-3-the-ideal-gas-law). Wording, examples and SVG diagrams are original.

## Simple-machine investigations

Six complete bilingual courses follow every lesson in Stage 3 Unit 3.3: levers, turning effect, pulleys, gears, mechanical advantage and real machines. Each includes three prescribed comparisons, retained endpoint results, three practice questions, a transfer exit and home observations. The saved design project named in the plan is now available alongside the six previous field projects.

The hinged lever animates an operator-controlled 0–15° quasistatic stroke with opposed vertical forces on a light bar. Both moment arms include cosθ, so force balance, support reaction and input/output work remain consistent through the stroke. The turning bench is an instantaneous fixed pose: torque depends on the perpendicular distance to the line of action, with no inferred motion rate. Its green marker indicates inspection order.

Continuous rope diagrams show fixed redirectors and one or two moving wheels as a shared assembly. One, two and four vertical supporting strands conserve illustrated total rope length as the free end descends n times the load rise. Target height changes actual distances/work while the illustration retains its framing; diagrams are not dimensional device drawings. Direct external gears show opposite rotations at the tooth-count ratio; ideal steady torque and power are separate from the illustrated one-input-turn count, whose playback is not the displayed rpm’s real clock. Teeth are illustrative and not manufacturing profiles.

Mechanical advantage compares force, while efficiency compares useful output energy with input. The ideal force/distance bench conserves work; the real-machine bench uses an assigned aggregate efficiency with fixed travel ratio and explicitly separates load-rise gain from other energy transfers. It does not infer individual frictional strand tensions, heating temperatures or safe-load ratings. Models, art and labs reuse React, SVG, the shared energy bars, bilingual controls, animation, progress and lazy loading without new runtime dependencies.

Reference checks: OpenStax [turning equilibrium and torque](https://openstax.org/books/college-physics-2e/pages/9-2-the-second-condition-for-equilibrium), [force equilibrium](https://openstax.org/books/college-physics-2e/pages/9-1-the-first-condition-for-equilibrium), and [simple machines](https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines). Text, examples and SVG illustrations are original.

## Saved lifting design · Unit 3.3

Lifting Design (`/physics/project/lifting`) adds four steps: design goal, small physical build, own trials, and explanation/report. Compare 10/20/40 cm hand marks around a fixed 10 cm load mark. The preview assumes a light lever, vertical forces, slow motion and one 0–15° stroke; assigned efficiency combines losses. Force, available hand travel and maximum stroke must all fit before playback is enabled. The default 40 N virtual load rising 2 cm at 80% efficiency needs 12.5 N and 8 cm hand travel in the 40 cm design, with 1 J input, 0.8 J useful output and 0.2 J other transfers. Model changes are saved separately from physical evidence and never fill the child's readings.

The original build sketch uses a stiff ruler, fixed eraser, small cup and a few coins, at most 200 g including the cup. A low tabletop and cloth keep the lift small. Mark two hand positions, keep the pivot, cup and load mark fixed, and repeat one setting. Force, mass and travel readings are optional and fold away; children without instruments can complete a qualitative investigation. No measured force ratio or efficiency is inferred. Ruler weight, force direction, friction and subjective effort belong in the child's uncertainty explanation.

Three blank trials can grow to eight. Completion needs a plan, checked physical construction and comparison conditions, at least three checked used trials at one numerically normalized load mark with two hand settings and a repeat, resolved entered rows, and the child's explanations. Failed lifts are valid evidence. Pending exclusions need reasons; reasoned exclusions preserve originals and are reversible. Editing measurements clears that trial's check; changing materials, procedure or construction clears build and all trial checks. Model redesign does not erase physical evidence. Bilingual report preview/export retain the model plan, missing readings, invalid originals, exclusions and own explanations. Empty default drafts cannot export. Path, notebook and lever/real-machine takeaway links open the project; no runtime dependency was added.

Activity references: [NASA Tiny Levers](https://www.grc.nasa.gov/WWW/K-12/Summer_Training/KaeAvenueES/Tiny_Lever.html) and [Science Buddies' lever activity](https://www.sciencebuddies.org/stem-activities/give-it-a-lift-with-a-lever). Instructions, drawings and the saved evidence workflow are original. Introductory electricity in Unit 3.4 is now available; the full junior/high-school roadmap is still in progress.

## Magnetism investigations

Eight original bilingual courses represent Unit 3.5’s ten topics: magnetic materials; poles and attraction/repulsion; fields and field lines; Earth’s field; current-generated fields; electromagnets; motors; generators. Fridge magnets, compasses, powered coils, fans and hand-powered lights connect the ideas to everyday observations. Each has three complete required inspections, retained model comparisons, three practice questions, a transfer exit and a home observation. Existing React/SVG, Chemistry language controls, Physics progress, animation and lazy-loading infrastructure are reused without a new runtime dependency.

Materials are prescribed qualitative samples rather than composition tests or force predictions. Splitting a magnet leaves poles on both pieces. The direction map uses an exterior normalized point dipole at a fixed probe radius; curves and compass needles share the same vector field. The shaded interior is schematic and represents the S→N return, rather than extending a point-source calculation inside a bar. Field lines form closed paths; the gold inspection marker is not a moving charge. Earth/nearby-field and wire-field benches show the needle responding to the vector sum, with north at zero bearing and east positive. Nearby-source position is schematic, while the distance dependence is prescribed. Geographic north and north-seeking magnetic names are distinguished.

Coil comparisons regulate current and keep geometry matched; relative field follows turns × current with an assigned soft-iron multiplier of three. The model omits saturation and remanence and predicts no lifted-object count. Free changes and endpoint seeking do not satisfy required comparisons. The motor shows a controlled coil pose, opposed conductor currents and forces, ideal half-turn commutation and moment arms. Dead-point contact breaks give zero instantaneous torque; the model does not solve speed or predict an immediate stop when supply is removed.

The generator uses a changing flux linkage with 20 turns, 0.4 T field, 0.01 m² area and a 10 Ω ideal closed load. Slip rings preserve alternating voltage. The 1.25-turn assigned window uses physical-time axes but is inspected in 2.4 seconds. Voltage, current, load power and integrated energy share the same model. Open circuit retains voltage with zero ideal load current/energy; mechanical input supplies closed-load output. These numbers do not rate a real hand-powered product, which may rectify and store energy. Home activities use paper reasoning, an ordinary covered magnet or existing intact devices rather than building battery-powered bare coils.

Reference checks: OpenStax [magnets and poles](https://openstax.org/books/college-physics-2e/pages/22-1-magnets), [ferromagnets and electromagnets](https://openstax.org/books/college-physics-2e/pages/22-2-ferromagnets-and-electromagnets), [field directions and lines](https://openstax.org/books/college-physics-2e/pages/22-3-magnetic-fields-and-magnetic-field-lines), [fields produced by currents](https://openstax.org/books/college-physics-2e/pages/22-9-magnetic-fields-produced-by-currents-amperes-law), [motor torque](https://openstax.org/books/college-physics-2e/pages/22-8-torque-on-a-current-loop-motors-and-meters), and [AC generators](https://openstax.org/books/college-physics-2e/pages/23-5-electric-generators). Wording, diagrams and cases are original; no source images or activity templates were copied.

## Earth and space investigations

Eight original bilingual courses represent all twelve Unit 3.6 topics: rotation/day and night; revolution/seasons; Moon/phases; solar system; gravity/orbits; stars; galaxies; cosmic scales/light-year. Questions start with dinner in different countries, opposite June seasons, crescent Moon observations, a paper-strip solar system, satellites, faint stars, a cosmic address and delayed messages. Each includes three required observations, retained model comparisons, three practice questions, a transfer exit and a home activity. Native planetarium diagrams and distinct card art reuse React/SVG, bilingual controls, progress, animation and lazy loading without new runtime dependencies.

Daily orientation uses a simplified equatorial equinox solar day, with fixed parallel sunlight and local solar hours. It does not predict clock time zones or every latitude’s day length. Seasonal geometry uses a circular 1-AU orbit, a fixed spatial axis with 23.5° tilt and paired opposite latitudes. Day duration uses the geometric horizon without refraction or solar-disc corrections; local-noon altitude and ground projection follow the same declination. Removing tilt gives twelve-hour days but retains latitude-dependent noon altitude. Body sizes and the oblique orbit drawing are schematic; illumination rotates to face the Sun at every position. Seasons are not weather forecasts.

Moon position and the bright spherical-disc patch share one parallel-light geometry. The mean 29.53-day phase cycle differs from the roughly 27.3-day sidereal orbit. Bright-patch area matches visible illumination; first quarter means a quarter of the cycle and approximately half a bright disc. A chosen northern-up convention is labelled rather than assumed for every observer. Orbital inclination is omitted; phases do not calculate eclipses. Sightline inspection markers are not light emitted by Earth.

All eight planets use one solar reference and linear 0–31 AU rulers. Approximate semimajor axes are not current aligned positions or Earth-to-planet separation. A single cm/AU scale controls paper-strip distances while symbol diameters remain unscaled. Neptune is not the system’s boundary. The orbit bench uses central μ=1 and surface radius=1 in normalized units. Circular and imagined no-gravity paths share the same initial tangent speed; radial fall starts without sideways velocity. Analytic paths share a 4τ observation window, ending radial motion at first contact. No impact, support, atmosphere or multi-body trajectory is inferred; velocity and inward acceleration are distinct, not balanced forces.

The star bench separates relative isotropic luminosity from fixed-area irradiance using L/r², with common wavefront-radius and reception-indicator scales. It is not perceived brightness, exposure or stellar magnitude. The galaxy bench separates planetary systems, the Milky Way and several other galaxies; symbols are neither a census nor a scale map, and the frame is not a universe boundary.

Light travel uses vacuum c=299792.458 km/s, AU=149597870.7 km and a Julian year of 365.25 days. Distances of 4.25 light-years and a 100,000-light-year galactic diameter are approximate teaching scales. A new signal follows a static one-way path, rescaled for each case; full travel is compressed into 2.4 seconds. Arrival differs from emission, processing and round-trip delays. Moving-spacecraft paths and cosmological distance definitions are not calculated. Home activities use lamps/balls, paper reasoning and safe unaided Moon observations; they never require looking at the Sun.

Reference checks: NASA [seasons](https://spaceplace.nasa.gov/seasons/en/), [Moon phases](https://science.nasa.gov/moon/moon-phases/), [solar-system reference distances](https://science.nasa.gov/learn/basics-of-space-flight/chapter1-1/), [orbits](https://spaceplace.nasa.gov/orbits/en/), [stars](https://science.nasa.gov/universe/stars/), [inverse-square light](https://www.nasa.gov/stem-content/the-inverse-square-law-of-light/), [galaxies](https://science.nasa.gov/universe/galaxies/) and [cosmic distances](https://science.nasa.gov/universe/cosmic-distances/). Text, examples, diagrams and interactions are original; no NASA image or activity template was copied.

## Algebra bridge investigations

Stage 4 Unit 4.1 now has eight original bilingual courses, in the plan’s order: variables, substitution, rearrangement, ratios, direct proportion, inverse proportion, squares and scientific notation. Robot instructions, a lamp energy account, arrival planning, paper maps, spring calibration, contact areas and energy tiles make each mathematical operation visible. All eight stations retain three completed prescribed comparisons and provide free controls; seeking or changed conditions cannot stand in for the prescribed checks.

The pure models are in `apps/web/src/interactive/algebraModels.ts`, SVG stations in `AlgebraLabs.tsx`, card art in `AlgebraArt.tsx` and the lazy body pack in `apps/web/src/content/algebra.ts`. Each station includes units, substitution/checking steps and its assumptions. Unit-bearing map conversion rates are distinct from dimensionless ratios; total spring length is distinct from extension; zero speed is handled without dividing by zero. m/mm notation switches preserve length. Only the robot station animates a physical journey; other playbacks inspect calculations or graph readings and are labeled accordingly. Vectors and the full problem-solving bridge remain planned.


## Graph bridge investigations

Stage 4 Unit 4.2 has seven original bilingual courses following all seven plan topics: axes, graph reading, gradients, area, linear relations, curves and experimental graphs. Linked ground rulers and position plots distinguish coordinates, displacement and distance. Gradient triangles use quantity differences and units, with a freely changeable frame showing why screen angle is not a physical rate. Signed velocity areas distinguish net displacement from accumulated distance. Heating lines separate initial temperature from the gradient P/C under constant heat capacity and ideal insulation.

Accelerated motion uses x = ½t² with a = 1 m/s². The 1–2 s and 4–5 s secants give 1.5 and 4.5 m/s; plotting the same positions against t² gives 0.5 m/s², equal to ½a rather than velocity. The experimental station retains fifteen supplied teaching readings, three per force, plus raw/processed tables, means and repeat ranges. Least-squares fits to the five means give 2.0333 cm intercept and 4.9967 cm/N gradient; a documented 2 cm zero correction shifts the intercept without shrinking scatter. Rounding to 1 cm can conceal scatter while keeping zero bias. Free origin constraints are labeled added assumptions; range bars are not statistical confidence intervals.

Models live in `apps/web/src/interactive/graphModels.ts`, stations in `GraphLabs.tsx`, card illustrations in `GraphArt.tsx` and lazy course bodies in `apps/web/src/content/graphs.ts`. Each station has three prescribed comparisons, a free quantity control, units, checking steps and retained model records. Motion/heating clocks compress selected model durations into 2.4 seconds; gradient, curve and fitting playbacks inspect readings rather than simulate a new physical clock. Seeking and altered conditions do not satisfy prescribed observation gates. Stage 4 now offers fifteen courses; vectors, problem solving and later high-school stages remain under construction.
