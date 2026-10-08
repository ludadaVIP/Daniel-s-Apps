import { t, q, type Lesson } from './schema';
export const phaseLessons: Lesson[] = [
  {
    id: 'phase-ice-melts-and-freezes',
    stage: 2,
    unit: 'thermal',
    kind: 'phase-fusion',
    minutes: 19,
    title: t(
      '冰在融化，温度怎么没升？',
      'The ice is melting. Why is its temperature not rising?',
    ),
    subtitle: t(
      '在0℃观察熔化与凝固，追踪能量和状态。',
      'Follow energy and state during melting and freezing at 0°C.',
    ),
    hook: t(
      '杯里还有冰时，继续有能量传入，冰却一点点变成水。温度不变，是能量没进来，还是在做另一件事？反过来，冰格里的水变成冰时，能量又去哪里？',
      'While ice remains, energy can enter as ice gradually becomes water. Does constant temperature mean no transfer, or a different change? When water in an ice tray freezes, where does energy go?',
    ),
    prediction: t(
      '纯冰和水在约0℃共存，吸收一份能量后，一部分冰融化。哪个判断合理？',
      'Pure ice and water coexist near 0°C. Some ice melts after energy enters. Which is reasonable?',
    ),
    predictions: [
      t(
        '状态改变，温度可以近似不变',
        'State changes while temperature can remain nearly constant',
      ),
      t('温度一定越来越高', 'Temperature must keep rising'),
      t('0℃没有能量交换', 'At 0°C there is no energy exchange'),
    ],
    explore: t(
      '完整观察四组，传递能量的大小均16.70 kJ：50/100 g冰吸收，50/100 g水放出。均在0℃相变区间开始；比较冰、水的质量、温度和传递方向。份量图是质量比例，不是冰水体积相等的断言。',
      'Observe all four cases with transfer magnitude 16.70 kJ: 50/100 g ice absorbs, 50/100 g water releases. Each starts in the 0°C transition interval. Compare ice/liquid masses, temperature and transfer direction. The diagram represents mass fractions, not equal ice/water volumes.',
    ),
    concept: t(
      '熔化是固态变液态，凝固是液态变固态。在约标准大气压下，纯冰与水缓慢、均匀地达到平衡时，相变可以近似保持0℃。传入能量用于改变微观排列与相互作用；不是把水分子拆成原子。反向凝固要把能量传给周围，即使温度暂时没降。真实冰块可能先从负温升到0℃，融完后水才能继续升温；盐、杂质、压力和不均匀温度会改变观察。',
      'Melting changes solid to liquid; freezing reverses it. Near normal atmospheric pressure, pure ice/water changing slowly and uniformly in equilibrium can stay near 0°C. Input changes microscopic arrangement and interactions, not water molecules into atoms. Freezing transfers energy to surroundings even while temperature stays steady. Real ice may first warm from below zero, and water can warm after melting finishes. Salt, impurities, pressure and uneven temperatures affect observations.',
    ),
    formula: t(
      '相变区间：Q≈mL；冰的熔化潜热L≈334 J/g。1 kJ=1000 J。',
      'During the transition: Q≈mL; ice fusion latent heat L≈334 J/g. 1 kJ=1000 J.',
    ),
    example: t(
      '16.70 kJ=16700 J，可使16700÷334=50 g冰在0℃融化。50 g样品全部变水；100 g样品只融50 g，还剩50 g冰。反过来，从0℃水移走同样能量，可凝固50 g水。这里Q是传递的能量大小，不是“物体里面存着的热”。',
      '16.70 kJ=16700 J can melt 16700/334=50 g ice at 0°C. A 50 g sample becomes liquid; a 100 g sample retains 50 g ice. Removing the same energy from water at 0°C freezes 50 g. Q is the magnitude of transferred energy, not heat stored inside an object.',
    ),
    misconception: t(
      '“温度没变，所以没有能量变化”不成立；要同时观察状态。冻结也不是给水加入一种“冷量”。模型只覆盖相变区间，不能把Q=mL用于冰从−10℃升到0℃的过程，也不能把0℃套给所有物质。',
      'Constant temperature does not prove no energy change: inspect state too. Freezing does not add a substance called cold. Q=mL applies here to the transition, not warming ice from −10°C to zero. Other materials do not all melt at 0°C.',
    ),
    realWorld: t(
      '冰袋在冰融化时能持续吸收能量；冷冻室让水结冰时，必须把能量搬到别处，冰箱背面可以向房间放出能量。状态改变给能量账本增加了温度计看不到的一页。',
      'An ice pack absorbs energy as its ice melts. A freezer must move energy elsewhere to freeze water; the appliance can release it into the room. State changes add a page to the ledger that the thermometer alone misses.',
    ),
    summary: t(
      '相变期间，温度可以不变，能量仍在传递；熔化吸收，凝固放出。',
      'During a phase change temperature can stay constant while energy transfers: melting absorbs, freezing releases.',
    ),
    homeExperiment: t(
      '和家人把少量冰与融水放在盘里，隔一会画出冰还剩多少。有合适温度计可记录混合物读数，但不要把一次局部读数当作理想0℃证明。只用室温自然融化，不加热、不加盐；保留未知条件。',
      'With a helper, place a little ice and meltwater in a dish and sketch remaining ice at intervals. With a suitable thermometer, retain mixture readings without treating one local reading as proof of ideal 0°C. Let it melt at room temperature without heating or salt; keep unknown conditions.',
    ),
    vocabulary: [
      t('熔化', 'melting'),
      t('凝固', 'freezing'),
      t('潜热', 'latent heat'),
      t('相变', 'phase change'),
    ],
    questions: [
      q(
        '模型中还有冰，继续吸收能量，0℃不变。能量去哪了？',
        'The model still has ice and absorbs energy at 0°C. What changes?',
        [
          ['更多冰变水', 'More ice becomes water'],
          ['能量消失了', 'Energy disappears'],
        ],
        0,
        '状态和微观相互作用改变，温度不是唯一线索。',
        'State and microscopic interactions change; temperature is not the only clue.',
      ),
      q(
        '100 g冰在0℃吸收16.70 kJ，模型融化多少？',
        '100 g ice at 0°C absorbs 16.70 kJ. How much melts?',
        [
          ['100 g', '100 g'],
          ['50 g', '50 g'],
        ],
        1,
        '16700 J÷334 J/g=50 g；余下50 g仍是冰。',
        '16700 J/(334 J/g)=50 g, with 50 g ice remaining.',
      ),
      q(
        '0℃水凝固成冰，能量怎样传递？',
        'Water at 0°C freezes. Which energy direction?',
        [
          ['从水传向周围', 'From water to surroundings'],
          ['从周围传向水', 'From surroundings to water'],
        ],
        0,
        '凝固放出能量，温度可在相变期间暂时不变。',
        'Freezing releases energy while the transition temperature can stay steady.',
      ),
    ],
    exit: q(
      '冰袋仍有冰，温度计几乎没变。能否断定它没吸收能量？',
      'An ice pack still has ice and nearly steady temperature. Can you conclude no energy entered?',
      [
        ['不能；还要观察冰融化的状态变化', 'No; inspect melting as well'],
        ['能；只看温度就够', 'Yes; temperature alone is enough'],
      ],
      0,
      '温度与状态要一起读；真实读数还要结合条件。',
      'Read temperature and state together, with the conditions of real readings.',
    ),
  },
  {
    id: 'phase-boiling-not-hotter',
    stage: 2,
    unit: 'thermal',
    kind: 'phase-boiling',
    minutes: 19,
    title: t(
      '水已经沸腾，再供热会发生什么？',
      'The water is boiling. What does more heating change?',
    ),
    subtitle: t(
      '看液体质量和气泡，把沸腾与蒸发区分开。',
      'Inspect liquid mass and bubbles; distinguish boiling from evaporation.',
    ),
    hook: t(
      '锅里水已经沸腾，还持续需要能量。若温度没明显增加，这些能量去了哪里？要看温度计，也要看水剩下多少。',
      'Boiling water still needs energy. If its temperature barely rises, where does the input go? Read the thermometer and the remaining liquid.',
    ),
    prediction: t(
      '纯水在稳定的约标准大气压下沸腾，继续吸收能量，哪个变化更合理？',
      'Pure water boils at stable normal atmospheric pressure and absorbs more energy. Which change is reasonable?',
    ),
    predictions: [
      t('更多液态水变成水蒸气', 'More liquid becomes water vapour'),
      t(
        '有液体时温度必定一直超过100℃',
        'With liquid present, temperature must keep rising above 100°C',
      ),
      t('水分子分解成氢和氧', 'Water molecules split into hydrogen and oxygen'),
    ],
    explore: t(
      '三组都从100℃纯水开始：20 g吸收11.30/22.60 kJ，40 g吸收22.60 kJ。记录液态水剩余质量、离开的水蒸气质量和温度；沸腾气泡在液体内部，粒子点只示意看不见的水蒸气。播放不是实际煮水时间。',
      'All three start with pure water at 100°C: 20 g absorbs 11.30/22.60 kJ; 40 g absorbs 22.60 kJ. Retain liquid remaining, vapour leaving and temperature. Boiling bubbles occur within liquid; dots symbolise invisible vapour. Playback is not an actual boiling-time prediction.',
    ),
    concept: t(
      '汽化包括蒸发和沸腾。蒸发可在液面、低于沸点时发生；沸腾是在特定压力下，液体内部也能持续形成水蒸气气泡的汽化。此平衡模型有液水时近似100℃，供入能量改变状态。蒸气离开敞口杯，杯内液体质量减少，但把离开的蒸气也算上，原样品的质量没消失。水蒸气还是水分子，气泡也不是模型中的空气。',
      'Vaporisation includes evaporation and boiling. Evaporation occurs at the surface below boiling; boiling permits sustained vapour bubbles inside liquid at a pressure-dependent boiling point. This equilibrium model stays near 100°C while liquid remains; input changes state. Vapour leaves the open cup, so liquid mass falls. Count the escaped vapour and original mass is conserved. Vapour remains water molecules; the model bubbles are not air.',
    ),
    formula: t(
      '沸腾相变：Q≈m汽化L；100℃水取L≈2260 J/g。',
      'Boiling transition: Q≈m_vaporised L; at 100°C use L≈2260 J/g.',
    ),
    example: t(
      '22.60 kJ=22600 J，可汽化22600÷2260=10 g水。20 g样品剩10 g液水；40 g样品剩30 g。两杯都可保持100℃。11.30 kJ只能汽化5 g，不能直接用Q=mcΔT把这份相变能量算成升温。',
      '22.60 kJ=22600 J vaporises 22600/2260=10 g. A 20 g sample retains 10 g liquid; a 40 g sample retains 30 g. Both can remain at 100°C. 11.30 kJ vaporises 5 g. Do not turn phase-change energy into temperature rise using Q=mcΔT.',
    ),
    misconception: t(
      '100℃不是所有地点、所有液体的通用沸点：压力和成分会影响沸腾条件。水壶上方看到的白雾通常是微小液滴，并非水蒸气本身。初加热时释放的溶解气体小泡，也不能单凭“有泡”就判定稳定沸腾。液水蒸干之后，不再属于这份模型。',
      '100°C is not a universal boiling point for every place or liquid: pressure and composition matter. A visible white kettle plume is usually tiny liquid droplets, not vapour itself. Dissolved-gas bubbles early in heating alone do not prove sustained boiling. Heating after the liquid has gone is outside this model.',
    ),
    realWorld: t(
      '锅里的水会越煮越少；节能不能只看“最高温度”，还要看需要汽化多少水与向周围散失多少能量。高山上的沸腾温度可低于海边，烹饪条件也会变化。',
      'A pot loses liquid as it boils. Energy use depends on the amount vaporised and losses, not just the highest temperature. Boiling temperature can be lower at altitude, changing cooking conditions.',
    ),
    summary: t(
      '稳定压力下，沸腾时的能量可用于汽化；蒸发不必先沸腾。',
      'At stable pressure, input during boiling can drive vaporisation; evaporation need not wait for boiling.',
    ),
    homeExperiment: t(
      '这课在屏幕上比较，不实际烧水或靠近热蒸气。用一张纸画出“杯内液水＋离开的水蒸气”的质量账本，与上一课室温湿布的蒸发比较位置和条件。',
      'Use the screen rather than boiling water or approaching hot vapour. Sketch a mass ledger of liquid in the cup plus escaped vapour, and compare locations/conditions with the room-temperature wet-cloth lesson.',
    ),
    vocabulary: [
      t('汽化', 'vaporisation'),
      t('沸腾', 'boiling'),
      t('沸点', 'boiling point'),
      t('水蒸气', 'water vapour'),
    ],
    questions: [
      q(
        '模型中20 g沸水吸收22.60 kJ，剩多少液水？',
        '20 g boiling water absorbs 22.60 kJ. Liquid remaining?',
        [
          ['10 g', '10 g'],
          ['0 g', '0 g'],
        ],
        0,
        '汽化10 g，原来20 g还剩10 g液水。',
        '10 g vaporises, leaving 10 g of the original 20 g.',
      ),
      q(
        '室温水蒸发，必须先到100℃吗？',
        'Must room-temperature water reach 100°C before evaporating?',
        [
          ['必须', 'Yes'],
          [
            '不必；蒸发可在低于沸点时发生',
            'No; evaporation can occur below boiling',
          ],
        ],
        1,
        '汽化的两种方式，位置和发生条件不同。',
        'The two forms of vaporisation have different locations and conditions.',
      ),
      q(
        '白色“蒸汽”一定就是看得见的气态水吗？',
        'Is a white plume necessarily visible gas-phase water?',
        [
          [
            '不是；白雾通常是液滴，水蒸气本身看不见',
            'No; the mist is usually droplets, while vapour is invisible',
          ],
          ['是；水蒸气是白色的', 'Yes; vapour is white'],
        ],
        0,
        '图中粒子点是示意，不是水蒸气真的可见。',
        'The diagram dots are symbols, not proof that vapour is visible.',
      ),
    ],
    exit: q(
      '山上水在低于100℃时沸腾，能因此说温度计必定坏了吗？',
      'Water boils below 100°C on a mountain. Must the thermometer be broken?',
      [
        [
          '不能；先检查气压、成分与测量条件',
          'No; examine pressure, composition and measurement conditions',
        ],
        ['能；所有水都只能100℃沸腾', 'Yes; all water must boil at 100°C'],
      ],
      0,
      '模型有压力条件；真实环境要把条件带进解释。',
      'The model specifies pressure; real explanations must include conditions.',
    ),
  },
  {
    id: 'phase-drops-outside-cold-cup',
    stage: 2,
    unit: 'thermal',
    kind: 'phase-condensation',
    minutes: 18,
    title: t(
      '杯子没漏，外壁水珠从哪里来？',
      'The cup is not leaking. Where do outside droplets come from?',
    ),
    subtitle: t(
      '比较杯壁与空气，让看不见的水蒸气留下线索。',
      'Compare surface and air; find evidence of invisible water vapour.',
    ),
    hook: t(
      '密封的冷饮杯外也能出现小水珠。杯里有颜色的饮料，外面水珠却可能是无色的。这些线索支持“漏出来”，还是“空气中的水变成了液滴”？',
      'Even a sealed cold-drink cup can acquire outside droplets. Coloured drink inside and clear droplets outside provide clues: leaking drink, or water from the air changing state?',
    ),
    prediction: t(
      '密封、外壁原先擦干的冷杯放在较潮湿的空气中，外壁出现水珠，哪个来源值得检验？',
      'A sealed, initially dry cold cup gets outside droplets in humid air. Which source should be investigated?',
    ),
    predictions: [
      t(
        '空气中水蒸气在冷表面凝结',
        'Airborne water vapour condenses on the cool surface',
      ),
      t('所有冷杯都漏水', 'Every cold cup leaks'),
      t('杯壁创造了水分子', 'The wall creates water molecules'),
    ],
    explore: t(
      '空气均25℃。比较杯壁8℃/露点15℃，杯壁8℃/露点5℃，杯壁22℃/露点15℃。露点是给定的空气条件，不是由动画计算湿度；比较有无新凝结，不能用水珠数量估算时间。',
      'Air is 25°C in all cases. Compare surface 8°C/dew point 15°C, surface 8°C/dew point 5°C, and surface 22°C/dew point 15°C. Dew point is a prescribed air condition, not humidity calculated by animation. Compare the onset of new condensation, not droplet amount or time.',
    ),
    concept: t(
      '凝结（液化）是气态水变成液态水。空气即使看起来透明，也可能含水蒸气。空气的露点是按当前水蒸气含量和压力冷却到饱和时的温度；杯壁低于露点时，附近水蒸气可在表面净凝结。模型只判断起始趋势，表面均高于0℃。凝结向杯壁和周围释放能量，是汽化的反向；“变成水珠”不是凭空造水。',
      'Condensation changes water vapour to liquid. Clear air can contain water vapour. Dew point is the saturation temperature when air with its current vapour content and pressure is cooled. A surface below dew point can support net condensation nearby. This model only judges onset and stays above freezing. Condensation releases energy to the surface/surroundings, reversing vaporisation; droplets are not newly created water.',
    ),
    example: t(
      '8℃杯壁低于15℃露点，出现净凝结；同样8℃杯壁换到露点5℃的较干空气中，模型没有新凝结。22℃杯壁低于25℃空气，却高于15℃露点，仍没有新凝结。因此“比空气冷”并不是充分证据。',
      'An 8°C surface is below a 15°C dew point: net condensation occurs. The same 8°C surface in drier air with dew point 5°C has no new model condensation. A 22°C surface is cooler than 25°C air but above dew point 15°C, so it also has none. Cooler than air alone is insufficient.',
    ),
    misconception: t(
      '没出现新水珠，不代表空气完全没有水蒸气。已有水珠也不能自动证明当前仍在凝结。图中空气小点只是水蒸气分子的示意，实际水蒸气看不见；成滴的量与时间、气流、表面和供给有关，这里不预测。',
      'No new droplets does not mean air has no water vapour. Existing drops do not automatically prove current condensation. Air dots symbolise invisible water-vapour molecules. Amount depends on time, airflow, surface and supply; this model does not predict it.',
    ),
    realWorld: t(
      '浴室镜子起雾、冷窗上的水珠和早晨的露水，都需要把表面温度和空气水分一起考虑。通风与加温会改变条件，但不能只凭一个冷字就断定原因。',
      'Bathroom mirrors, cool-window droplets and dew involve both surface temperature and airborne moisture. Ventilation and warming change conditions; the word cold alone does not explain the outcome.',
    ),
    summary: t(
      '冷杯外的新水珠可来自空气凝结；判断要同时看表面温度和空气条件。',
      'New outside droplets can come from air condensation; inspect surface temperature and air conditions together.',
    ),
    homeExperiment: t(
      '和家人将少量冰水装入不漏的密封容器，擦干外面，放在干盘上观察。可用室温密封容器作对照，记录气温、外壁变化与渗漏等替代解释。水珠少也保留结果，不实际制造热蒸气。',
      'With a helper, put a little ice water in a leak-free sealed container, dry the outside and observe on a dry dish. Compare a sealed room-temperature container; record air conditions, surface changes and alternatives such as leakage. Retain a small/no-droplet outcome without making hot vapour.',
    ),
    vocabulary: [
      t('凝结（液化）', 'condensation'),
      t('露点', 'dew point'),
      t('饱和', 'saturation'),
      t('表面', 'surface'),
    ],
    questions: [
      q(
        '密封冷杯外的新水珠，可以来自哪里？',
        'Where can new outside droplets on a sealed cold cup come from?',
        [
          ['空气中的水蒸气', 'Water vapour in the air'],
          ['只有杯内液体', 'Only liquid inside'],
        ],
        0,
        '密封和外壁原先擦干提供来源线索，还应检查渗漏等条件。',
        'Sealing and initial dryness provide clues; check leakage and other conditions too.',
      ),
      q(
        '杯壁8℃、露点5℃，这份模型会出现新净凝结吗？',
        'Surface 8°C, dew point 5°C. New net model condensation?',
        [
          ['会；比25℃空气冷就够', 'Yes; cooler than 25°C air is enough'],
          ['不会；杯壁还高于露点', 'No; surface is above dew point'],
        ],
        1,
        '空气条件也重要；冷于空气不等于冷于露点。',
        'Air conditions matter; cooler than air does not mean below dew point.',
      ),
      q(
        '水蒸气凝结时，相变能量怎样传递？',
        'Which energy direction accompanies condensation?',
        [
          ['释放给表面与周围', 'Released to surface and surroundings'],
          ['由杯壁创造能量', 'Created by the cup wall'],
        ],
        0,
        '凝结是汽化的反向状态改变。',
        'Condensation reverses vaporisation.',
      ),
    ],
    exit: q(
      '两只同样冷的密封杯，一只有新水珠，一只没有。第一步怎样查？',
      'Two equally cool sealed cups differ in new droplets. What should you examine first?',
      [
        [
          '空气水分、露点、表面与原先是否擦干',
          'Air moisture/dew point, surfaces and initial dryness',
        ],
        ['没有水珠那只一定更热', 'The dry one must be warmer'],
      ],
      0,
      '控制杯壁温度后，仍有其他变量影响凝结；未知条件应记录。',
      'Other variables remain after matching surface temperature; retain unknown conditions.',
    ),
  },
  {
    id: 'phase-read-a-heating-curve',
    stage: 2,
    unit: 'thermal',
    kind: 'phase-curve',
    minutes: 20,
    title: t(
      '加热曲线的平段，能量暂停了吗？',
      'Does a flat heating curve mean energy input has paused?',
    ),
    subtitle: t(
      '从−10℃冰到20℃水，把温度、状态与功率连起来。',
      'Link temperature, state and power from −10°C ice to 20°C water.',
    ),
    hook: t(
      '加热器一直工作，温度曲线却先上升、再平着走、然后又上升。猜一猜：是加热器偷懒，还是样品正在完成温度计看不见的变化？',
      'The heater keeps working, but temperature rises, levels off and rises again. Is the heater resting, or is the sample changing in a way the thermometer misses?',
    ),
    prediction: t(
      '理想恒定吸收功率下，纯冰在0℃融化，温度曲线出现平段。能量输入怎样？',
      'At constant absorbed power, pure ice melts at 0°C and the temperature curve is flat. What happens to energy input?',
    ),
    predictions: [
      t('继续输入，状态在改变', 'Input continues while state changes'),
      t('平段时功率必定为零', 'Power must be zero during the plateau'),
      t('冰的质量消失了', 'Ice mass disappears'),
    ],
    explore: t(
      '完整播放三组：20 g/50 W、20 g/100 W、40 g/50 W，均从−10℃冰到20℃水。共用0–360 s与−10–20℃刻度；拖动时间只作探查，不代替完整观察。记录熔化平段时长、总时间与吸收能量，并探查到0℃的时刻。',
      'Play all three complete cases: 20 g/50 W, 20 g/100 W and 40 g/50 W, each from −10°C ice to 20°C water. Shared axes span 0–360 s and −10–20°C; seeking inspects but does not replace playback. Retain melting-plateau duration, total time and absorbed energy; inspect the time to reach zero.',
    ),
    concept: t(
      '这条曲线的纵轴是温度，横轴是从开始起累计的时间。第一段全是冰，吸收能量升温；平段冰水共存，能量用于熔化；第三段冰已融完，液水升温。吸收功率P恒定时，Q=Pt，所以平段的能量仍在增加。相同样品和初末状态，功率加倍能缩短模型时间，但所需总能量不变。质量加倍、功率相同，三个阶段都变长。',
      'The vertical axis is temperature and the horizontal axis is elapsed time from the start. Ice first absorbs energy and warms; during the plateau ice/water coexist and energy drives melting; after melting, liquid warms. With constant absorbed power P, Q=Pt, so input still grows during the plateau. The same sample and endpoints need the same total energy at doubled power but less model time. Doubling mass at fixed power lengthens all three stages.',
    ),
    formula: t(
      '升温段Q=mcΔT；熔化段Q=mL；全过程Q总=P×t总。',
      'Warming segments Q=mcΔT; melting Q=mL; whole process Q_total=P×t_total.',
    ),
    example: t(
      '20 g冰从−10℃到0℃需20×2.1×10=420 J；熔化需6680 J；水从0℃到20℃需1680 J。合计8780 J。吸收功率50 W时，总时间175.6 s，平段133.6 s；100 W时总时间87.8 s，能量仍8780 J。40 g/50 W则需17560 J与351.2 s。',
      '20 g ice warming −10 to 0°C needs 20×2.1×10=420 J; melting needs 6680 J; water warming 0 to 20°C needs 1680 J. Total 8780 J. At absorbed power 50 W, total time is 175.6 s with plateau 133.6 s. At 100 W, total is 87.8 s with the same 8780 J. At 40 g/50 W it is 17560 J and 351.2 s.',
    ),
    misconception: t(
      '平段不是停止计时或停止供热，温度–时间曲线下的面积也不是Q。这里的P是样品净吸收功率，不是插座标牌功率。真实冰块温度不均、容器蓄能、散失和杂质会让曲线偏离；不能拿175.6 s预测家里一杯冰多久融完。',
      'The plateau does not stop time or input. Area under a temperature–time curve is not Q. P is net power absorbed by the sample, not the appliance rating. Uneven temperatures, container storage, losses and impurities distort real curves; 175.6 s is not a prediction for a household cup.',
    ),
    realWorld: t(
      '解冻食物和加热含冰饮料时，温度的变化不必与吸收能量同步上升。先认清样品、状态和吸收功率，再读曲线；混合物不一定有这份纯水的清晰平段。',
      'When thawing food or warming an icy drink, absorbed energy and temperature need not rise together. Identify sample, state and absorbed power before reading a curve. Mixtures need not show pure water’s sharp plateau.',
    ),
    summary: t(
      '曲线平段可记录持续相变；功率影响时间，总能量还要看质量与初末状态。',
      'A flat segment can record ongoing phase change. Power affects time; energy also depends on mass and endpoints.',
    ),
    homeExperiment: t(
      '用纸画出“冷冰→0℃冰水→水升温”三个阶段，写上各段能量用途。用实验室两档功率找“时间减半、能量不变”的证据，不实际使用加热器。若记录自然融冰，保留原始时间和温度，允许没有理想平段。',
      'Sketch cold ice → ice/water at 0°C → warming liquid and label each energy use. Find evidence for half the time but unchanged energy using the two model powers, without using a heater. If recording natural melting, preserve raw time/temperature readings even without an ideal plateau.',
    ),
    vocabulary: [
      t('加热曲线', 'heating curve'),
      t('平段', 'plateau'),
      t('吸收功率', 'absorbed power'),
      t('累计时间', 'elapsed time'),
    ],
    questions: [
      q(
        '0℃平段内，模型样品正在做什么？',
        'What happens during the 0°C plateau?',
        [
          [
            '冰持续融化，继续吸收能量',
            'Ice keeps melting and absorbing energy',
          ],
          ['停止所有微观运动', 'All microscopic motion stops'],
        ],
        0,
        '相变能量改变状态，温度可保持不变。',
        'Phase-change energy changes state while temperature can stay constant.',
      ),
      q(
        '同样20 g、同样初末状态，吸收功率50→100 W，总能量怎样？',
        'Same 20 g sample/endpoints, absorbed power 50→100 W. Total energy?',
        [
          ['加倍到17560 J', 'Doubles to 17560 J'],
          ['仍8780 J，时间减半', 'Still 8780 J, with half the time'],
        ],
        1,
        'Q由样品和初末状态决定，这份理想模型没有新增散失。',
        'Sample/endpoints set Q here; the ideal model has no added losses.',
      ),
      q(
        '温度–时间图下的面积，可以直接当作焦耳吗？',
        'Can area under this temperature–time graph directly give joules?',
        [
          [
            '不能；纵轴不是功率，单位也不同',
            'No; the vertical axis is not power and units differ',
          ],
          ['可以；所有图下面积都是能量', 'Yes; all graph areas are energy'],
        ],
        0,
        '要先读轴：这里面积单位是℃·s，不是J。',
        'Read the axes: the area has units °C·s, not J.',
      ),
    ],
    exit: q(
      '家里冰融得比模型慢，能直接断定Q=mL错了吗？',
      'Household ice melts slower than the model. Does that prove Q=mL is wrong?',
      [
        [
          '不能；先看初温、杂质、吸收功率和散失等条件',
          'No; examine initial temperature, impurities, absorbed power and losses',
        ],
        ['能；动画时间就是真实时间', 'Yes; animation time is actual time'],
      ],
      0,
      '理想阶段与真实过程之间要比较条件，不能只比较秒数。',
      'Compare conditions between ideal stages and real processes, not seconds alone.',
    ),
  },
];
