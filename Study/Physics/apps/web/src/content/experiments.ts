import { t, type Lesson } from './schema';
export const experiments: { id: Lesson['kind']; name: ReturnType<typeof t> }[] =
  [
    { id: 'graphs-axes', name: t('坐标轴与单位窗口', 'Axes and unit window') },
    {
      id: 'graphs-reading',
      name: t('位置图与返回故事', 'Position graph and return story'),
    },
    {
      id: 'graphs-gradient',
      name: t('带单位的斜率三角形', 'Unit-bearing gradient triangles'),
    },
    {
      id: 'graphs-area',
      name: t('速度面积与行程账', 'Velocity area and trip ledger'),
    },
    {
      id: 'graphs-linear',
      name: t('初温与升温直线', 'Initial temperature and heating lines'),
    },
    {
      id: 'graphs-curve',
      name: t('曲线与变换变量', 'Curves and transformed variables'),
    },
    {
      id: 'graphs-experiment',
      name: t('重复读数与拟合证据', 'Repeats and fitting evidence'),
    },
    {
      id: 'algebra-variables',
      name: t('机器人变量工作台', 'Robot variable bench'),
    },
    {
      id: 'algebra-substitution',
      name: t('灯的单位代入账', 'Lamp substitution ledger'),
    },
    {
      id: 'algebra-rearrange',
      name: t('等式两边一起变', 'Equal operations on both sides'),
    },
    {
      id: 'algebra-ratio',
      name: t('地图与真实路线尺', 'Map and real-route rulers'),
    },
    {
      id: 'algebra-direct',
      name: t('原长与伸长对照', 'Rest length and extension'),
    },
    {
      id: 'algebra-inverse',
      name: t('固定力的反比曲线', 'Inverse relation at fixed force'),
    },
    {
      id: 'algebra-square',
      name: t('速率平方与能量格', 'Speed squares and energy tiles'),
    },
    {
      id: 'algebra-notation',
      name: t('十的幂与单位窗口', 'Powers-of-ten and unit window'),
    },
    { id: 'space-day', name: t('自转与昼夜', 'Rotation and daylight') },
    {
      id: 'space-seasons',
      name: t('倾斜与两半球光照', 'Tilt and hemispheric sunlight'),
    },
    {
      id: 'space-moon',
      name: t('月相的两个视角', 'Two views of lunar phases'),
    },
    {
      id: 'space-system',
      name: t('太阳系共用比例尺', 'Shared solar-system rulers'),
    },
    {
      id: 'space-orbit',
      name: t('向前运动与引力', 'Forward motion and gravity'),
    },
    {
      id: 'space-stars',
      name: t('恒星输出与接收', 'Stellar output and reception'),
    },
    { id: 'space-galaxies', name: t('宇宙地址层级', 'Cosmic address levels') },
    {
      id: 'space-distance',
      name: t('光信号的旅行时间', 'Light-signal travel time'),
    },
    {
      id: 'magnetic-materials',
      name: t('磁性材料比较', 'Magnetic-material comparison'),
    },
    {
      id: 'magnetic-poles',
      name: t('相对磁极与分段', 'Facing poles and split pieces'),
    },
    { id: 'magnetic-field', name: t('磁针方向地图', 'Needle-direction map') },
    {
      id: 'magnetic-earth',
      name: t('指南针与附近干扰', 'Compass and nearby interference'),
    },
    { id: 'magnetic-wire', name: t('导线周围的磁场', 'Field around a wire') },
    {
      id: 'magnetic-coil',
      name: t('受控电流电磁铁', 'Regulated-current electromagnet'),
    },
    { id: 'magnetic-motor', name: t('电动机转动作用', 'Motor turning effect') },
    {
      id: 'magnetic-generator',
      name: t('手摇发电能量账', 'Hand-powered generator account'),
    },
    {
      id: 'electric-charge',
      name: t('电荷转移总账', 'Charge-transfer account'),
    },
    {
      id: 'electric-interaction',
      name: t('电荷符号与极化', 'Charge signs and polarization'),
    },
    {
      id: 'electric-current',
      name: t('过截面的电荷计数', 'Charge crossing a section'),
    },
    {
      id: 'electric-circuit',
      name: t('闭合路径检查', 'Closed-path inspection'),
    },
    {
      id: 'electric-battery',
      name: t('极性与电池能量', 'Polarity and cell energy'),
    },
    {
      id: 'electric-lamp',
      name: t('电荷与能量两本账', 'Separate charge and energy accounts'),
    },
    {
      id: 'electric-switch',
      name: t('不同位置的缺口', 'Gaps at different positions'),
    },
    {
      id: 'electric-materials',
      name: t('材料与接触对照', 'Material and contact comparisons'),
    },
    {
      id: 'electric-series',
      name: t('一条通路，两只灯', 'One path, two lamps'),
    },
    {
      id: 'electric-parallel',
      name: t('分叉处的电流账本', 'Current account at a junction'),
    },
    {
      id: 'electric-ammeter',
      name: t('电流表接线与量程', 'Ammeter wiring and range'),
    },
    { id: 'electric-voltage', name: t('每库仑的能量账', 'Energy per coulomb') },
    {
      id: 'electric-voltmeter',
      name: t('电压表的两个连接点', 'Two voltmeter connection points'),
    },
    {
      id: 'electric-resistance',
      name: t('导线形状公平比较', 'Fair wire-shape comparisons'),
    },
    { id: 'electric-ohm', name: t('U–I关系扫描', 'U–I relationship sweep') },
    {
      id: 'electric-power',
      name: t('瓦数与累计能量', 'Watts and accumulated energy'),
    },
    {
      id: 'electric-safety',
      name: t('电路故障侦探', 'Circuit fault detective'),
    },
    {
      id: 'energy-lamp',
      name: t('电池与灯的能量账本', 'Battery–lamp energy ledger'),
    },
    {
      id: 'energy-kinetic',
      name: t('动能公平比较台', 'Kinetic-energy comparisons'),
    },
    {
      id: 'energy-height',
      name: t('高度与零点探查台', 'Height and zero reference'),
    },
    { id: 'energy-spring', name: t('弹簧储备释放台', 'Spring-store release') },
    {
      id: 'energy-track',
      name: t('理想轨道能量巡查', 'Ideal-track energy inspection'),
    },
    {
      id: 'energy-dissipation',
      name: t('粗糙轨道与效率', 'Rough track and efficiency'),
    },
    { id: 'friction', name: t('滚动与摩擦', 'Rolling & friction') },
    { id: 'quantities', name: t('测量侦探', 'Measurement detective') },
    { id: 'units', name: t('同一根绳子', 'Same string, new unit') },
    { id: 'length', name: t('测量工作台', 'Measurement bench') },
    { id: 'time', name: t('摆动计时', 'Time the swings') },
    { id: 'mass', name: t('天平挑战', 'Balance challenge') },
    { id: 'temperature', name: t('温度谜题', 'Temperature mystery') },
    { id: 'data', name: t('实验记录台', 'Record the evidence') },
    { id: 'graph', name: t('走路故事图', 'A walking-story graph') },
    { id: 'fair-test', name: t('公平比较台', 'Fair-test bench') },
    { id: 'mirror', name: t('镜子光路室', 'Mirror ray room') },
    { id: 'static', name: t('气球电荷观察台', 'Balloon charge station') },
    { id: 'seatbelt', name: t('惯性玩具车', 'Inertia toy vehicle') },
    { id: 'floating', name: t('冰山水槽', 'Iceberg tank') },
    { id: 'boats', name: t('造船挑战', 'Build a boat') },
    { id: 'bounce', name: t('回弹观察场', 'Bounce station') },
    { id: 'echo', name: t('回声探测器', 'Echo explorer') },
    { id: 'volume', name: t('排水测量台', 'Water-displacement bench') },
    { id: 'accuracy', name: t('尺子校准台', 'Ruler calibration bench') },
    { id: 'repeats', name: t('测量证据板', 'Measurement evidence board') },
    { id: 'paper', name: t('纸张厚度工坊', 'Paper-thickness workshop') },
    { id: 'reference', name: t('车厢参考系', 'Train reference frames') },
    { id: 'journey', name: t('往返取球', 'Out-and-back walk') },
    { id: 'average', name: t('平均速率行程', 'Average-speed journey') },
    {
      id: 'motion-graph',
      name: t('运动图像对照台', 'Motion-graph comparison'),
    },
    { id: 'speed', name: t('机器人赛跑', 'Robot race') },
    { id: 'force-effects', name: t('推拉与形变工坊', 'Push, pull & shape') },
    { id: 'force-balance', name: t('平衡力小车', 'Balanced-force cart') },
    { id: 'grip-friction', name: t('摩擦抓地工作台', 'Grip & sliding bench') },
    { id: 'paper-drag', name: t('纸张下落比较', 'Paper-drop comparison') },
    { id: 'mass-weight', name: t('背包的两种测量', 'Backpack: mass & weight') },
    { id: 'moon-weight', name: t('月球背包旅行', 'Moon backpack journey') },
    { id: 'gravity-fall', name: t('无空气落球对照', 'No-air ball comparison') },
    {
      id: 'density-compare',
      name: t('同体积材料比较', 'Equal-volume material comparison'),
    },
    {
      id: 'density-block',
      name: t('规则块密度工作台', 'Regular-block density bench'),
    },
    {
      id: 'density-displacement',
      name: t('排水密度证据台', 'Displacement-density evidence'),
    },
    {
      id: 'density-float',
      name: t('密度浮沉比较槽', 'Density flotation tank'),
    },
    { id: 'observation', name: t('下落观察室', 'Falling-ball station') },
    {
      id: 'work-direction',
      name: t('力与位移箭头台', 'Force & displacement arrows'),
    },
    { id: 'work-area', name: t('功的面积比较台', 'Work-area comparisons') },
    {
      id: 'work-power',
      name: t('双升降机功率对照', 'Two-hoist power comparison'),
    },
    {
      id: 'work-human',
      name: t('上楼机械功率估算', 'Stair mechanical-power estimate'),
    },
    { id: 'work-ramp', name: t('斜坡省力与功', 'Ramp force and work') },
    {
      id: 'thermal-particles',
      name: t('温度与粒子比较室', 'Temperature–particle comparisons'),
    },
    { id: 'thermal-heating', name: t('水的升温账本', 'Water warm-up ledger') },
    {
      id: 'thermal-paths',
      name: t('三条热传递通路', 'Three thermal-transfer routes'),
    },
    {
      id: 'thermal-cups',
      name: t('冷热水保温比较', 'Insulating hot and cold water'),
    },
    {
      id: 'thermal-wet',
      name: t('湿表面蒸发账本', 'Wet-surface evaporation ledger'),
    },
    { id: 'phase-fusion', name: t('冰水相变账本', 'Ice–water phase ledger') },
    {
      id: 'phase-boiling',
      name: t('沸水汽化观察', 'Boiling-water vaporisation'),
    },
    {
      id: 'phase-condensation',
      name: t('冷杯水珠探查', 'Cold-cup droplet investigation'),
    },
    {
      id: 'phase-curve',
      name: t('冰到水加热曲线', 'Ice-to-water heating curves'),
    },
    {
      id: 'sound-source',
      name: t('振动声源与信号', 'Vibrating source and signal'),
    },
    {
      id: 'sound-medium',
      name: t('介质与局部振动', 'Medium and local oscillations'),
    },
    {
      id: 'sound-pitch',
      name: t('频率与音调工作台', 'Frequency and pitch bench'),
    },
    {
      id: 'sound-amplitude',
      name: t('振幅与响度工作台', 'Amplitude and loudness bench'),
    },
    {
      id: 'sound-ranging',
      name: t('回波与超声测距', 'Echo and ultrasonic ranging'),
    },
    { id: 'light-shadow', name: t('影子边界光路', 'Shadow boundary rays') },
    {
      id: 'light-reflection',
      name: t('镜面反射角', 'Mirror reflection angles'),
    },
    {
      id: 'light-mirror',
      name: t('平面镜虚像室', 'Plane-mirror virtual image'),
    },
    { id: 'light-refraction', name: t('空气与水折射', 'Air–water refraction') },
    { id: 'light-lens', name: t('透镜成像工作台', 'Lens image bench') },
    { id: 'light-colour', name: t('棱镜与滤光片', 'Prism and filters') },
    { id: 'light-eye', name: t('眼睛对焦模型', 'Eye focusing model') },
    {
      id: 'pressure-contact',
      name: t('书包接触分力板', 'Backpack contact-force board'),
    },
    {
      id: 'pressure-shoes',
      name: t('雪鞋承力工作台', 'Snowshoe contact bench'),
    },
    { id: 'pressure-liquid', name: t('液体深度探针', 'Liquid-depth probe') },
    {
      id: 'pressure-air',
      name: t('大气两侧力账本', 'Atmospheric opposing-force ledger'),
    },
    { id: 'pressure-straw', name: t('吸管静止液柱', 'Static straw column') },
    { id: 'pressure-syringe', name: t('封口空气注射器', 'Sealed-air syringe') },
    {
      id: 'buoyancy-release',
      name: t('浮沉受力比较', 'Floating and sinking forces'),
    },
    {
      id: 'buoyancy-pressure',
      name: t('上下压力差工作台', 'Top–bottom pressure-force bench'),
    },
    {
      id: 'buoyancy-displacement',
      name: t('受控放入与排水', 'Controlled lowering and displacement'),
    },
    {
      id: 'buoyancy-archimedes',
      name: t('排水与测力计', 'Displacement and force meter'),
    },
    { id: 'buoyancy-ship', name: t('密封船体与载荷', 'Sealed hull and cargo') },
    {
      id: 'buoyancy-submarine',
      name: t('潜艇压载工作台', 'Submarine ballast bench'),
    },
    {
      id: 'buoyancy-balloon',
      name: t('热气球质量账本', 'Hot-air balloon mass ledger'),
    },
    { id: 'machine-lever', name: t('杠杆抬升工作台', 'Lever lift bench') },
    {
      id: 'machine-turning',
      name: t('转动作用与力臂', 'Turning effect and moment arm'),
    },
    {
      id: 'machine-pulley',
      name: t('连续绳路滑轮组', 'Continuous-rope pulley blocks'),
    },
    { id: 'machine-gears', name: t('齿轮数圈与力矩', 'Gear turns and torque') },
    {
      id: 'machine-advantage',
      name: t('机械优势行程账本', 'Mechanical advantage travel ledger'),
    },
    {
      id: 'machine-real',
      name: t('真实机械能量账本', 'Real-machine energy ledger'),
    },
  ];
