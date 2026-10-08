import { t, type Lesson } from './schema';
export const experiments: { id: Lesson['kind']; name: ReturnType<typeof t> }[] =
  [
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
  ];
