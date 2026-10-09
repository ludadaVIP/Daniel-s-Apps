import { t, q, type Lesson } from './schema';
export const electricQuantLessons: Lesson[] = [
  {
    id: 'electric-ammeter-reading',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-ammeter',
    minutes: 19,
    title: t(
      '指针换了位置，电流真的变了吗？',
      'A different scale position: did the current change?',
    ),
    subtitle: t(
      '先接对通路，再把格数换成安培。',
      'Connect the right path, then turn divisions into amperes.',
    ),
    hook: t(
      '同一盏电池灯，换量程后读数板上的标记移动了。是电流改变，还是每一格代表的数量改变？',
      'The marker moves when the range changes for the same battery lamp. Did current change, or did each division acquire a different value?',
    ),
    prediction: t(
      '同为0.3 A，0–3 A和0–0.6 A的30格刻度，标记的位置会相同吗？',
      'For 0.3 A, will the marker occupy the same position on thirty-division 0–3 A and 0–0.6 A scales?',
    ),
    predictions: [
      t('相同，电流没变', 'Same, because current is unchanged'),
      t('不同，格值不同', 'Different, because division values differ'),
      t('小量程一定让电流变大', 'A smaller range always increases current'),
    ],
    explore: t(
      '完整检查串联3 A量程、串联0.6 A量程和错误跨电池接法。最后一项会被阻止送电：检查接线本身也是证据。',
      'Inspect series wiring on 3 A and 0.6 A ranges, then the incorrect across-cell connection. The last is blocked from energising: inspecting a connection is evidence too.',
    ),
    concept: t(
      '电流表串入要测的通路，让该处电流通过它。看单位和量程，再用满量程÷总格数求格值。未知电流先用适当的大量程；在允许的范围内换小量程，才能更细地读。实际表的电阻也会影响电路，本台理想表忽略这一影响。',
      'An ammeter goes in series so the current at the chosen location passes through it. Check units and range; full scale divided by division count gives the value per division. Start unknown currents on an appropriate broad range, then use a finer permitted range. A real meter can alter the circuit; the ideal meter here omits that effect.',
    ),
    example: t(
      '3 A÷30格=0.1 A/格，3格是0.3 A；0.6 A÷30格=0.02 A/格，15格还是0.3 A。量程改变了分辨率，没把这只恒定10 Ω模型灯的电流改变。',
      '3 A/30 divisions = 0.1 A per division, so three divisions mean 0.3 A. At 0.6 A/30 = 0.02 A per division, fifteen divisions also mean 0.3 A. Resolution changed; the ideal 10 Ω lamp current did not.',
    ),
    misconception: t(
      '不能像电压表那样把电流表直接跨电池两端：低电阻通路可能造成短路并损坏表或电池。数字表出现负号通常与表笔方向有关；普通指针表反偏应停止、断开并由成人检查。',
      'Never put a current meter straight across cell terminals like a voltage meter: its low-resistance path can short the source and damage equipment. A negative digital reading often reflects lead order; a reversed ordinary pointer meter should be disconnected and checked by an adult.',
    ),
    realWorld: t(
      '玩具电流、电池充电电流，都要明确测的是哪条通路。同一电流在不同量程上可以有不同刻度位置；测量前的接线检查比盯数字更重要。',
      'A toy or charging-current measurement needs a clearly identified path. One current can occupy different scale positions; checking wiring matters before reading a number.',
    ),
    summary: t(
      '电流表串联；读格数之前，先确定每格多少安培。',
      'Connect an ammeter in series; determine amperes per division before reading the scale.',
    ),
    homeExperiment: t(
      '画两张30格纸刻度，分别标0–3 A和0–0.6 A，再标出同一个0.3 A。只做纸上练习；不要把家用插座或充电器当作接线练习台。',
      'Draw two thirty-division paper scales, label 0–3 A and 0–0.6 A, then mark 0.3 A on both. This is a paper activity; household outlets and chargers are not wiring practice equipment.',
    ),
    formula: t(
      '格值=满量程÷格数；读数=格值×格数。',
      'Division value = full scale / division count; reading = division value × divisions.',
    ),
    vocabulary: [
      t('电流表', 'ammeter'),
      t('串联', 'series'),
      t('量程', 'range'),
      t('分辨率', 'resolution'),
    ],
    questions: [
      q(
        '0.6 A量程有30格，每格多少？',
        'Thirty divisions on a 0.6 A range: value per division?',
        [
          ['0.2 A', '0.2 A'],
          ['0.02 A', '0.02 A'],
          ['0.6 A', '0.6 A'],
        ],
        1,
        '0.6÷30=0.02 A，别漏掉小数点。',
        '0.6/30 = 0.02 A; keep the decimal place.',
      ),
      q(
        '3 A量程指3格，0.6 A量程指15格，哪个电流更大？',
        'Three divisions on 3 A and fifteen on 0.6 A: which current is greater?',
        [
          ['相同，都是0.3 A', 'Equal, both 0.3 A'],
          ['15格的更大', 'The fifteen-division reading'],
        ],
        0,
        '不能只比格数，要先统一单位和格值。',
        'Compare physical readings after applying each scale, not division counts alone.',
      ),
      q(
        '为什么跨电池的电流表接法被阻止？',
        'Why is the across-cell current-meter connection blocked?',
        [
          ['电池没有电荷', 'The cell has no charge'],
          ['任何电表都不能碰电池', 'No meter can measure a cell'],
          [
            '低电阻通路可能形成短路',
            'Its low-resistance path can create a short',
          ],
        ],
        2,
        '电流测量要串入负载通路；不能让电流表旁路负载。',
        'Current measurement belongs in the load path; do not bypass the load with the ammeter.',
      ),
    ],
    exit: q(
      '两次测量的刻度位置不同，先检查什么？',
      'Two readings occupy different scale positions. Check first?',
      [
        ['单位、量程和接线条件', 'Units, range and connection conditions'],
        ['断言电流一定改变', 'Declare that current changed'],
      ],
      0,
      '格数是表示方式，安培读数才是可比较的量。',
      'Divisions are a representation; readings in amperes are comparable quantities.',
    ),
  },
  {
    id: 'electric-voltage-per-charge',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-voltage',
    minutes: 18,
    title: t(
      '电池上的3 V，到底在说什么？',
      'What is a cell’s 3 V label telling us?',
    ),
    subtitle: t(
      '把每库仑对应的能量，和每秒通过的电荷分开。',
      'Separate energy per coulomb from charge per second.',
    ),
    hook: t(
      '3 V、0.3 A、6 J都能出现在电池灯的记录里，却回答三个不同问题。先从“每一份电荷对应多少能量”理解电压。',
      '3 V, 0.3 A and 6 J can all appear in a lamp record, but answer different questions. Begin with energy transferred per amount of charge.',
    ),
    prediction: t(
      '1 C对应3 J，2 C对应6 J，电压一定不同吗？',
      'If 1 C corresponds to 3 J and 2 C to 6 J, must voltage differ?',
    ),
    predictions: [
      t('相同，都是3 J/C', 'Same: both 3 J/C'),
      t('6 J那次电压一定翻倍', 'The 6 J case must have twice the voltage'),
      t(
        '无法把电荷和能量一起看',
        'Charge and energy cannot be considered together',
      ),
    ],
    explore: t(
      '检查1 C/3 J、2 C/6 J和1 C/6 J三本账。两条累计条分别有C和J刻度，别把它们的长度直接当作同一种量。',
      'Inspect accounts for 1 C/3 J, 2 C/6 J and 1 C/6 J. The cumulative bars have separate C and J scales; lengths are not directly comparable quantities.',
    ),
    concept: t(
      '电压，也叫电势差，关联两点之间每单位电荷对应的电势能变化。电源对外转移的能量账可写成U=E/Q，1 V=1 J/C。电流则是每秒过截面的电荷量。电压存在不保证回路闭合，也不保证有持续电流。',
      'Voltage, or potential difference, relates the potential-energy change per unit charge between two points. For this source’s outgoing account, U=E/Q and 1 V=1 J/C. Current is charge crossing a section per second. Voltage can exist without a closed path or sustained current.',
    ),
    example: t(
      '3 J÷1 C=3 V；6 J÷2 C仍是3 V；6 J÷1 C=6 V。完整账本开始前，累计E和Q都为0，不能用0÷0算电压；模型规定的电压仍可显示。',
      '3 J/1 C = 3 V; 6 J/2 C is still 3 V; 6 J/1 C = 6 V. Before transfer starts, both cumulative totals are zero: 0/0 cannot determine voltage. The specified voltage can still be shown.',
    ),
    misconception: t(
      '不能说“3 V是3 A”，也不能凭电压算出电池能用多久。能转移多少总电荷、负载条件与电源限制都重要。条形图是能量和电荷的记账，不是电子背着一袋光沿导线运输。',
      '3 V is not 3 A, and voltage alone does not determine battery life. Transferable charge, load conditions and source limits matter. The bars are accounting diagrams, not electrons carrying bags of light along wires.',
    ),
    realWorld: t(
      '遥控器、玩具和充电设备会注明额定电压，因为电势差影响元件的工作条件。匹配电压之外，还要匹配设备规定的电源类型与极性，不能只挑数字大的。',
      'Devices state rated voltages because potential difference affects operating conditions. Source type and polarity also need to match the device specification; a larger number is not automatically better.',
    ),
    summary: t(
      '伏特回答每库仑对应多少能量，安培回答每秒通过多少电荷。',
      'Volts concern energy per coulomb; amperes concern charge per second.',
    ),
    homeExperiment: t(
      '在纸上画两个电荷/能量账本：1 C/3 J和2 C/6 J。解释为什么总能量不同，电压相同。和成人一起阅读一个电池玩具的额定电压标签，不拆设备。',
      'Draw paper accounts for 1 C/3 J and 2 C/6 J. Explain different total energies but equal voltage. Read a battery toy’s rated voltage with an adult without opening it.',
    ),
    formula: t(
      'U=E/Q；1 V=1 J/C（本电源转移账）。',
      'U=E/Q; 1 V=1 J/C for this source-transfer account.',
    ),
    vocabulary: [
      t('电压', 'voltage'),
      t('电势差', 'potential difference'),
      t('伏特', 'volt'),
      t('库仑', 'coulomb'),
    ],
    questions: [
      q(
        '6 J对应2 C，电压是多少？',
        '6 J corresponds to 2 C. Voltage?',
        [
          ['3 V', '3 V'],
          ['12 V', '12 V'],
          ['0.3 V', '0.3 V'],
        ],
        0,
        '每库仑6÷2=3 J，即3 V。',
        '6/2 = 3 J per coulomb, or 3 V.',
      ),
      q(
        '同一个电压下，转移电荷量翻倍，转移能量？',
        'At the same voltage, double the transferred charge. Energy?',
        [
          ['必定不变', 'Must stay unchanged'],
          ['翻倍', 'Doubles'],
        ],
        1,
        'E=UQ，但这是总能量，不是功率。',
        'E=UQ; this is total energy, not power.',
      ),
      q(
        '有电压但没有持续电流，可能吗？',
        'Can voltage exist without sustained current?',
        [
          ['不可能，电压就是电流', 'No; voltage is current'],
          ['可能，例如回路断开', 'Yes, for example an open loop'],
          ['只有电压表坏了才会', 'Only if the meter is broken'],
        ],
        1,
        '驱动条件和完整通路要分别检查。',
        'Distinguish a driving potential difference from a complete path.',
      ),
    ],
    exit: q(
      '电池写3 V，能否直接算它给玩具的电流？',
      'A cell says 3 V. Can you directly determine toy current?',
      [
        ['能，就是3 A', 'Yes, 3 A'],
        [
          '不能，还需负载与回路条件',
          'No; load and circuit conditions are needed',
        ],
      ],
      1,
      '相同电压可以对应不同负载电流。',
      'One voltage can correspond to different load currents.',
    ),
  },
  {
    id: 'electric-voltmeter-two-points',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-voltmeter',
    minutes: 19,
    title: t(
      '测电压，要把两根表笔放在哪里？',
      'Where should two probes go to measure voltage?',
    ),
    subtitle: t(
      '跨两点测差值，把表笔顺序也记下来。',
      'Measure a difference across two points, recording probe order.',
    ),
    hook: t(
      '两盏串联灯分别读1 V和2 V，电源却是3 V。为什么电压表要跨接，而不是挤进原来的通路？',
      'Two series loads read 1 V and 2 V while the source reads 3 V. Why connect a voltage meter across points rather than insert it into the path?',
    ),
    prediction: t(
      '3 V电源串联10 Ω和20 Ω，两元件电压一定各1.5 V吗？',
      'A 3 V source supplies series 10 Ω and 20 Ω loads. Must each have 1.5 V?',
    ),
    predictions: [
      t('一定平均分', 'Always equal shares'),
      t('不一定，两个元件条件不同', 'Not necessarily; the loads differ'),
      t('两者各3 V', 'Both must have 3 V'),
    ],
    explore: t(
      '完整比较跨10 Ω、跨20 Ω和跨电源。再交换表笔或选15 V量程，看符号和刻度变化；自由设置不替代三项规定检查。',
      'Compare connections across 10 Ω, 20 Ω and the source. Then reverse probes or select 15 V range to inspect signs and scale; free settings do not replace the three prescribed checks.',
    ),
    concept: t(
      '电压表并联在被测元件两端，读的是红表笔所在点相对黑表笔所在点的电势差。理想表电阻无限大，不改变原通路电流；真实表有限电阻可能改变测量条件。两点差值和一个点的“绝对电压”不是同一说法。',
      'A voltmeter connects in parallel across a component and reads the red-probe point relative to the black-probe point. An ideal infinite-resistance meter does not alter the loop current; a real finite-resistance meter can load it. A difference between two points is distinct from an unspecified point’s “absolute voltage”.',
    ),
    example: t(
      '总电阻30 Ω，电流3÷30=0.1 A。10 Ω上U=0.1×10=1 V，20 Ω上为2 V，合计3 V。跨20 Ω反接表笔会读−2 V，大小仍为2 V。',
      'Total resistance is 30 Ω, giving 3/30 = 0.1 A. The 10 Ω load has 1 V; 20 Ω has 2 V; the sum is 3 V. Reversing probes across 20 Ω gives −2 V, with the same magnitude.',
    ),
    misconception: t(
      '负电压不是“少于没有电”，它依赖选的两点顺序。测得两个点差值为0，也不表示它们相对其他点都无电压。教学刻度显示大小，带符号读数显示表笔顺序；不是普通指针表反偏的模拟。',
      'Negative voltage depends on point order; it is not “less than no electricity”. Zero difference between two points does not mean zero voltage relative to every other point. The teaching scale shows magnitude and a separate signed reading shows lead order; it does not simulate reverse deflection of an ordinary pointer meter.',
    ),
    realWorld: t(
      '低压电池测试读的是两端差值，红黑表笔和V单位都要看。电压表模式和电流表模式的接法不同，不能只换一个数字标签就沿用接法。',
      'A low-voltage cell test compares its terminals; inspect probe order and the V unit. Voltage and current modes require different connections, not merely a different display label.',
    ),
    summary: t(
      '电压表跨两点；接法、量程和表笔顺序共同解释读数。',
      'A voltage meter spans two points; wiring, range and probe order explain its reading.',
    ),
    homeExperiment: t(
      '画10 Ω、20 Ω串联电路，用彩笔标出测各元件电压的两处连接。把红黑颜色交换，注明大小不变而符号相反。只做纸上接线。',
      'Draw the series 10 Ω/20 Ω circuit and colour the two probe points for each voltage. Swap red and black, noting unchanged magnitude and reversed sign. Keep this a paper wiring task.',
    ),
    formula: t(
      '串联稳定电路：U电源=U₁+U₂；表笔对调使读数反号。',
      'Steady series circuit: Usource=U₁+U₂; exchanging probes reverses the reading sign.',
    ),
    vocabulary: [
      t('电压表', 'voltmeter'),
      t('并联', 'parallel'),
      t('表笔', 'probe'),
      t('电势差', 'potential difference'),
    ],
    questions: [
      q(
        '测一只元件的电压，理想表接在哪里？',
        'To measure a component voltage, connect the ideal meter?',
        [
          ['串入唯一通路', 'In series in the only path'],
          ['只接一根表笔', 'With only one probe'],
          ['跨元件两端', 'Across its two terminals'],
        ],
        2,
        '两点差值需要两根表笔，并联跨接。',
        'A two-point difference requires two probes connected across the component.',
      ),
      q(
        '串联元件分别1 V和2 V，电源？',
        'Series drops are 1 V and 2 V. Source voltage?',
        [
          ['3 V', '3 V'],
          ['0.5 V', '0.5 V'],
        ],
        0,
        '按同一回路方向把两个电压变化相加。',
        'Sum the changes consistently around the loop.',
      ),
      q(
        '跨20 Ω读−2 V，交换表笔后？',
        'Across 20 Ω the reading is −2 V. After swapping probes?',
        [
          ['+2 V', '+2 V'],
          ['0 V', '0 V'],
          ['−4 V', '−4 V'],
        ],
        0,
        '相同两点，顺序反了，所以符号反转。',
        'The same two points in reverse order give the opposite sign.',
      ),
    ],
    exit: q(
      '两点之间读0 V，能否断言整个设备安全无电？',
      'A reading is 0 V between two points. Does that prove the whole device safe?',
      [
        [
          '不能；还涉及其他点、接法和条件',
          'No; other points, connections and conditions matter',
        ],
        ['能，任何地方都没电压', 'Yes; no voltage can exist anywhere'],
      ],
      0,
      '这是两点差值，不是整个设备的安全认证。',
      'It is one potential difference, not a safety certification.',
    ),
  },
  {
    id: 'electric-resistance-wire-shape',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-resistance',
    minutes: 18,
    title: t(
      '同一种金属，长一点或粗一点会怎样？',
      'Same metal: what changes when it is longer or thicker?',
    ),
    subtitle: t(
      '保持电源、材料和温度，单独比较导线形状。',
      'Keep source, material and temperature fixed while comparing wire shape.',
    ),
    hook: t(
      '电线是导体，却不是完全没有电阻。把它变长和变粗，会给同一电压下的电流带来相反变化吗？',
      'A wire conducts, yet does not have zero resistance. Will making it longer versus thicker have opposite effects on current at the same voltage?',
    ),
    prediction: t(
      '同材料同温度，长度相同而截面积翻倍，电阻怎样？',
      'Same material, temperature and length, with doubled cross-section. Resistance?',
    ),
    predictions: ['减半', '翻倍', '一定不变'].map((zh, i) =>
      t(zh, ['Halves', 'Doubles', 'Must stay unchanged'][i]!),
    ),
    explore: t(
      '比较基准线、长度翻倍和截面积翻倍。之后自由改变相对长度；每次都保持材料、温度和3 V电源。',
      'Compare reference wire, double length and double cross-section. Then vary relative length freely while retaining material, temperature and the 3 V source.',
    ),
    concept: t(
      '电阻表示在给定条件下，元件对电流的阻碍程度，单位Ω。均匀导线同材料同温度时，越长电阻越大，截面积越大电阻越小。不是“导体没有电阻”，也不是电流流过就把电荷磨掉。',
      'Resistance describes how a component opposes current under specified conditions, in ohms. For a uniform wire at the same material and temperature, longer means more resistance and larger cross-section means less. Conductors need not have zero resistance; resistance does not grind away charge.',
    ),
    example: t(
      '基准线定为10 Ω。长度翻倍而截面不变是20 Ω；长度不变而截面翻倍是5 Ω。3 V下，三者电流依次为0.3、0.15、0.6 A。图形宽度只示意截面，不给真实毫米尺寸。',
      'Assign the reference wire 10 Ω. Double length at fixed cross-section gives 20 Ω; double cross-section at fixed length gives 5 Ω. At 3 V the currents are 0.3, 0.15 and 0.6 A. Drawing thickness is schematic, not a measured millimetre size.',
    ),
    misconception: t(
      '“粗一点”必须说清截面积，不是把直径翻倍也当作截面积翻倍；圆截面面积与直径平方成正比。温度、材料或接触变化会让比较失去原条件。',
      '“Thicker” needs a defined cross-section: doubling diameter is not doubling area. Circular area scales with diameter squared. Changes in temperature, material or contact would change the comparison conditions.',
    ),
    realWorld: t(
      '细长导线的电阻会影响压降和发热。但选真实家用线规格还涉及载流、绝缘和安装条件，不能把本台相对尺寸直接当作安装方案。',
      'Thin long wires can affect voltage drop and heating. Real cable selection also involves ratings, insulation and installation conditions; these relative schematic dimensions are not installation specifications.',
    ),
    summary: t(
      '同材料同温度：长增加电阻，截面积增大减小电阻。',
      'Same material and temperature: length increases resistance; larger cross-section reduces it.',
    ),
    homeExperiment: t(
      '画一条基准线，再画两条公平比较线：只加长、只增加截面。在旁边列出要保持不变的条件，用模型验证猜想，不拆任何电线。',
      'Draw reference, longer-only and larger-cross-section-only wires. List the conditions kept fixed and check your prediction in the model without dismantling wires.',
    ),
    formula: t(
      '同材料同温度的均匀导线：R与L成正比、与A成反比。',
      'Uniform wire at fixed material/temperature: R is proportional to L and inversely proportional to area A.',
    ),
    vocabulary: [
      t('电阻', 'resistance'),
      t('欧姆', 'ohm'),
      t('截面积', 'cross-sectional area'),
      t('控制变量', 'controlled variables'),
    ],
    questions: [
      q(
        '基准10 Ω，长度翻倍，其他不变？',
        'Reference 10 Ω; double length, everything else fixed?',
        [
          ['20 Ω', '20 Ω'],
          ['5 Ω', '5 Ω'],
          ['10 Ω', '10 Ω'],
        ],
        0,
        '相同截面积下，电阻随长度成比例。',
        'At the same cross-section, resistance scales with length.',
      ),
      q(
        '基准10 Ω，截面积翻倍而长度不变？',
        'Reference 10 Ω; double area at fixed length?',
        [
          ['20 Ω', '20 Ω'],
          ['5 Ω', '5 Ω'],
        ],
        1,
        '面积翻倍使电阻减半。',
        'Double area halves resistance.',
      ),
      q(
        '比较形状对电阻的影响，哪组条件合理？',
        'Which conditions fairly compare geometry effects?',
        [
          ['同时换材料和温度', 'Change material and temperature too'],
          [
            '固定材料、温度和连接条件',
            'Keep material, temperature and contacts fixed',
          ],
          ['只要求颜色相同', 'Only keep colour the same'],
        ],
        1,
        '改变多个条件就不能单独归因于形状。',
        'Changing several conditions prevents isolating geometry.',
      ),
    ],
    exit: q(
      '两条线长度不同、电阻不同，已经证明长度是唯一原因吗？',
      'Different lengths and resistances: is length proved the only cause?',
      [
        ['是，看到差异就够了', 'Yes, any difference proves it'],
        [
          '否，还要核对材料、截面、温度与接触',
          'No; also check material, area, temperature and contact',
        ],
      ],
      1,
      '对照条件决定证据能支持什么结论。',
      'Control conditions determine the conclusions supported by evidence.',
    ),
  },
  {
    id: 'electric-ohm-conditions',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-ohm',
    minutes: 21,
    title: t(
      '电压翻倍，电流什么时候才翻倍？',
      'When does doubling voltage double current?',
    ),
    subtitle: t(
      '从一组U–I数据判断关系，也检查公式的条件。',
      'Use a set of U–I data and check the equation’s conditions.',
    ),
    hook: t(
      '“电压翻倍，电流翻倍”听起来简单。恒温电阻符合，受热灯丝却可能不符合。我们让三组数据来回答。',
      'Doubling voltage seems as though it should double current. A constant-temperature resistor can comply; a warming filament may not. Compare three data sets.',
    ),
    prediction: t(
      '所有元件的U÷I，都必须是同一个不变数吗？',
      'Must U/I remain one constant for every component?',
    ),
    predictions: [
      t('一定，公式永远无条件成立', 'Yes; the rule is unconditional'),
      t('只看元件颜色', 'It depends only on colour'),
      t('不一定，要看元件和条件', 'No; component and conditions matter'),
    ],
    explore: t(
      '完整扫描恒定10 Ω、恒定20 Ω和规定的受热灯丝曲线。看三个电压点的U/I；横轴电压、纵轴电流。自由光标只查一个点，不能代替整组扫描。',
      'Sweep constant 10 Ω, constant 20 Ω and the assigned warming-filament curve. Compare U/I at three voltages on voltage-horizontal/current-vertical axes. A free cursor checks one point; it cannot replace a full sweep.',
    ),
    concept: t(
      '对满足欧姆定律、温度等条件保持不变的元件，I=U/R，U与I成正比。电阻值R是这个关系的比例常量。U/I可以给出某工作点的比值，但比值随电压变化时，不能把它叫作全程不变的电阻。',
      'For an ohmic component under unchanged conditions such as temperature, I=U/R and voltage is proportional to current. R is the constant of that relationship. U/I gives a ratio at an operating point, but if it varies with voltage it is not one constant over the entire sweep.',
    ),
    example: t(
      '10 Ω的1、2、3 V分别对应0.1、0.2、0.3 A，每次U/I都为10 Ω。20 Ω是0.05、0.1、0.15 A。规定灯丝曲线给0.1、约0.167、约0.214 A，比值是10、12、14 Ω，不是一条过原点的直线。',
      'For 10 Ω, 1/2/3 V gives 0.1/0.2/0.3 A and U/I remains 10 Ω. For 20 Ω the currents are 0.05/0.1/0.15 A. The assigned filament curve gives 0.1/about 0.167/about 0.214 A, with ratios 10/12/14 Ω rather than a straight line through the origin.',
    ),
    misconception: t(
      '一组比例数据比单个点更有说服力；0 V、0 A点不能用0/0求电阻。灯丝曲线是解释非欧姆行为的规定模型，不是某个真实灯泡的测量，也没有求解完整升温过程。',
      'Several proportional readings are stronger evidence than one point; 0 V and 0 A do not permit dividing 0/0 to find resistance. The filament curve is an assigned non-ohmic illustration, not measurements of a real bulb or a solved heating transient.',
    ),
    realWorld: t(
      '普通电阻、受热灯丝和LED可能有不同U–I关系。排查小电路时，要先确认模型适不适用；不要把LED直接套成恒定电阻接在电池上。',
      'A resistor, warming filament and LED can have different U–I relations. Check a model’s suitability before using it; an LED is not simply a constant resistor to place directly across a cell.',
    ),
    summary: t(
      '欧姆定律要带着条件用；用多组U–I数据检查比例是否恒定。',
      'Use Ohm’s law with its conditions; check proportionality across several U–I readings.',
    ),
    homeExperiment: t(
      '在纸上画10 Ω的三个数据点，再画规定灯丝的三个点。写下哪组支持恒定R，哪组不支持，以及为何一个点不够。只使用本台模型数据。',
      'Plot the three 10 Ω data points and three assigned filament points on paper. Explain which support constant R and why one point is insufficient. Use these model data only.',
    ),
    formula: t(
      '欧姆元件、条件不变：I=U/R；1 Ω=1 V/A。',
      'Ohmic component, unchanged conditions: I=U/R; 1 Ω=1 V/A.',
    ),
    vocabulary: [
      t('欧姆定律', 'Ohm’s law'),
      t('正比', 'proportional'),
      t('工作点', 'operating point'),
      t('非欧姆', 'non-ohmic'),
    ],
    questions: [
      q(
        '恒定10 Ω上2 V，电流？',
        '2 V across constant 10 Ω. Current?',
        [
          ['5 A', '5 A'],
          ['0.2 A', '0.2 A'],
          ['20 A', '20 A'],
        ],
        1,
        'I=2÷10=0.2 A。',
        'I=2/10=0.2 A.',
      ),
      q(
        'U/I依次为10、12、14 Ω，能用一个恒定R概括吗？',
        'U/I is 10, 12, 14 Ω. Can one constant R describe all?',
        [
          ['能，只取中间12 Ω就行', 'Yes; simply take 12 Ω'],
          ['不能，这组比值在变', 'No; the ratios change'],
        ],
        1,
        '平均一个数不能把变化关系变成恒定比例。',
        'An average cannot make a varying relationship proportional.',
      ),
      q(
        '比较同一个电阻的欧姆关系，应重点控制？',
        'When examining a resistor’s ohmic relation, control?',
        [
          [
            '温度等会改变电阻的条件',
            'Temperature and other conditions affecting resistance',
          ],
          ['只控制照片角度', 'Only photograph angle'],
          ['只控制电压表颜色', 'Only meter colour'],
        ],
        0,
        '元件条件改变后，不应强行沿用原来R。',
        'Do not force the old R onto changed component conditions.',
      ),
    ],
    exit: q(
      '一个点为1 V、0.1 A，能证明所有电压下都是10 Ω吗？',
      'One point is 1 V, 0.1 A. Does it prove 10 Ω at all voltages?',
      [
        ['能，算出一次就够', 'Yes; one calculation is enough'],
        [
          '不能，需要更多数据和条件检查',
          'No; more data and condition checks are needed',
        ],
      ],
      1,
      '一个工作点的比值，不证明全程规律。',
      'One operating-point ratio does not establish a complete relationship.',
    ),
  },
  {
    id: 'electric-power-energy-time',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-power',
    minutes: 20,
    title: t(
      '瓦数相同，用掉的能量也相同吗？',
      'Same watts: must the transferred energy be the same?',
    ),
    subtitle: t(
      '把功率、时间和能量写在三栏里。',
      'Keep power, time and energy in separate columns.',
    ),
    hook: t(
      '灯上标的W和电费记录的kWh，看起来都是“用电”，其实一个是快慢，一个是累计。先用小电池模型看清。',
      'Lamp watts and billing kilowatt-hours both concern electricity, but one is a rate and the other an accumulated energy. Begin with a small DC model.',
    ),
    prediction: t(
      '同样0.9 W，一个工作10 s，一个20 s，转移能量相同吗？',
      'At 0.9 W, do ten seconds and twenty seconds transfer equal energy?',
    ),
    predictions: [
      t('相同，瓦数一样', 'Same, because watts match'),
      t('20 s转移两倍', 'Twenty seconds transfers twice as much'),
      t('10 s必定更多', 'Ten seconds must transfer more'),
    ],
    explore: t(
      '比较3 V/10 s、6 V/10 s、3 V/20 s，负载始终10 Ω。看能量随规定物理时间累计；播放压缩成2.4 s，不把动画秒数当测量。',
      'Compare 3 V/10 s, 6 V/10 s and 3 V/20 s with the same constant 10 Ω load. Energy accumulates over the assigned physical time; 2.4 s playback is not measured time.',
    ),
    concept: t(
      '电功率是电能转移的速率。稳定直流负载P=UI，1 W=1 J/s；条件恒定时E=Pt。瓦特不是总能量，瓦时与千瓦时才是能量单位。对于交流设备不能不分条件把铭牌数字相乘；本台只算理想稳定直流电阻。',
      'Electrical power is the rate of electrical energy transfer. A steady DC load has P=UI, with 1 W=1 J/s; at constant power E=Pt. Watts are not total energy; watt-hours and kilowatt-hours are energy units. This bench calculates steady ideal DC resistive loads, not an unconditional multiplication rule for AC ratings.',
    ),
    example: t(
      '3 V、0.3 A时P=0.9 W，10 s累计9 J，20 s累计18 J。6 V、0.6 A时P=3.6 W，10 s是36 J。15 W灯按此功率用1小时是15 Wh=0.015 kWh；1小时=3600秒。',
      '3 V and 0.3 A gives 0.9 W: 9 J in 10 s and 18 J in 20 s. At 6 V and 0.6 A, power is 3.6 W and ten seconds transfers 36 J. A 15 W lamp at that power for one hour uses 15 Wh=0.015 kWh; one hour is 3600 seconds.',
    ),
    misconception: t(
      '电压翻倍，恒定电阻下电流也翻倍，功率因此变四倍；但不能推广到所有真实灯泡。节省总能量可以减少功率或减少时间，照明效果也要公平比较。',
      'Doubling voltage across a constant resistance doubles current and quadruples power; this is not universal for real lamps. Lower power or shorter operation can reduce energy, but useful lighting also needs a fair comparison.',
    ),
    realWorld: t(
      '读设备标签时区分输入功率、输出功率和最大额定值。充电器写的最大输出不是手机每一刻的实际消耗；先确认标签含义再估计能量。',
      'Distinguish input power, output power and maximum ratings on equipment. A charger’s maximum output is not a phone’s actual draw at every moment; identify the rating before estimating energy.',
    ),
    summary: t(
      'W说转移多快，J、Wh和kWh说累计多少；时间不能漏。',
      'W describes transfer rate; J, Wh and kWh describe totals. Do not omit time.',
    ),
    homeExperiment: t(
      '和成人读一只灯的W标签，不接线、不拆灯。用标称功率分别估计工作1小时和2小时的Wh，注明“假定功率恒定的估计”，再讨论照明是否真的需要一直开。',
      'Read a lamp’s W label with an adult without opening or wiring it. Estimate Wh for one and two hours, labelled “estimate assuming constant stated power”, then discuss when illumination is actually needed.',
    ),
    formula: t(
      '稳定直流：P=UI；恒定功率：E=Pt；1 Wh=3600 J。',
      'Steady DC: P=UI; constant power: E=Pt; 1 Wh=3600 J.',
    ),
    vocabulary: [
      t('电功率', 'electrical power'),
      t('瓦特', 'watt'),
      t('瓦时', 'watt-hour'),
      t('电能', 'electrical energy'),
    ],
    questions: [
      q(
        '3 V×0.3 A的功率？',
        'Power at 3 V × 0.3 A?',
        [
          ['10 W', '10 W'],
          ['9 W', '9 W'],
          ['0.9 W', '0.9 W'],
        ],
        2,
        '乘积是0.9 W，即每秒0.9 J。',
        'The product is 0.9 W, or 0.9 J each second.',
      ),
      q(
        '0.9 W持续20 s，能量？',
        '0.9 W for 20 s. Energy?',
        [
          ['0.045 J', '0.045 J'],
          ['18 J', '18 J'],
        ],
        1,
        'E=Pt=0.9×20=18 J。',
        'E=Pt=0.9×20=18 J.',
      ),
      q(
        '哪一个是能量单位？',
        'Which is an energy unit?',
        [
          ['A', 'A'],
          ['kWh', 'kWh'],
          ['W', 'W'],
        ],
        1,
        'kWh是功率乘时间；W单独是速率。',
        'kWh is power multiplied by time; W alone is a rate.',
      ),
    ],
    exit: q(
      '两只相同瓦数的灯，怎样比较总电能？',
      'Two lamps have the same power. How compare total energy?',
      [
        [
          '还要知道实际工作时间和条件',
          'Also know actual operating time and conditions',
        ],
        ['只比瓦数就足够', 'Watts alone are sufficient'],
      ],
      0,
      '累计能量需要速率和时间。',
      'Accumulated energy needs both rate and time.',
    ),
  },
  {
    id: 'electric-safety-fault-detective',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-safety',
    minutes: 20,
    title: t(
      '灯都灭了，是正常开关还是故障保护？',
      'All lamps went off: switching or fault protection?',
    ),
    subtitle: t(
      '识别过载与短路，理解保护不能代替安全习惯。',
      'Recognise overload and shorts; protection does not replace safe habits.',
    ),
    hook: t(
      '新增负载、破损电线搭到一起，都可能让保护断开，却不是同一种故障。我们只检查3 V模型图，不把真实危险当实验。',
      'Extra loads and an unintended low-resistance connection can both cause isolation, but are different faults. Inspect a 3 V model diagram without making real hazards an experiment.',
    ),
    prediction: t(
      '四条正常负载支路和一条低电阻旁路，故障原因一定相同吗？',
      'Are four normal load branches and one low-resistance bypass the same fault?',
    ),
    predictions: [
      t('相同，只要灯灭就一样', 'Yes; a dark lamp always means the same fault'),
      t('电荷一定被用光', 'Charge must have been used up'),
      t(
        '不同：过载与短路路径不同',
        'No: overload and short-circuit paths differ',
      ),
    ],
    explore: t(
      '完整检查两负载、四负载过载和0.2 Ω错误旁路。图中保护对故障保持断开；“未保护电流”是推算值，不是让故障实际运行的读数。',
      'Inspect two loads, four-load overload and an unintended 0.2 Ω bypass. Fault cases remain isolated in the diagram; “unprotected current” is a prospective calculation, not an energised fault reading.',
    ),
    concept: t(
      '过载是正常负载总电流超过线路或设备允许条件；短路是不希望的低电阻路径旁路负载。过流会增加发热风险。熔断器与断路器主要处理过流，漏电保护装置针对某些漏电风险；任何保护都不能允许触碰带电部件或使用破损设备。',
      'Overload means ordinary loads demand current beyond permitted conditions. A short is an unintended low-resistance path bypassing loads. Overcurrent raises heating risk. Fuses and circuit breakers address overcurrent; RCDs address certain leakage risks. No protective device permits touching live parts or using damaged equipment.',
    ),
    example: t(
      '规定电源3 V、内部0.5 Ω，保护阈值0.8 A。两只10 Ω并联时约0.545 A；四只时1 A；加入0.2 Ω旁路时约4.333 A。后两者模型保护断开，实际保护后的电流为0。这些数值不代表家庭保护器的额定或动作时间。',
      'Assign a 3 V source, 0.5 Ω internal resistance and a 0.8 A isolation threshold. Two parallel 10 Ω loads demand about 0.545 A; four demand 1 A; adding a 0.2 Ω bypass gives about 4.333 A. The last two are isolated, with zero protected current. These values do not specify household protection ratings or trip times.',
    ),
    misconception: t(
      '没有跳闸不等于没有触电危险，低电压电池也可能因短路发热。保护动作后不能不停复位或换更大保险丝。干燥外观也不能认证设备安全；明显损坏、焦痕或异常应停止使用并告诉成人。',
      'No trip does not prove absence of shock risk; even a low-voltage cell can heat during a short. Do not repeatedly reset protection or substitute a larger fuse. A dry appearance does not certify safety; visible damage, scorch marks or unusual behaviour require stopping use and telling an adult.',
    ),
    realWorld: t(
      '插排提供更多插孔，不意味着供电与线路允许值增加。湿手、液体附近和破损绝缘会增加风险。家庭线路问题交给成人与合格专业人员，不由本模型指导维修。',
      'Extra powerboard sockets do not increase supply or wiring ratings. Wet hands, nearby liquids and damaged insulation increase risks. Adults and qualified professionals handle household wiring problems; this model does not guide repairs.',
    ),
    summary: t(
      '辨认路径，停止不安全使用，交给成人；保护装置不是“永远安全”的保证。',
      'Recognise the path, stop unsafe use and involve an adult. Protection is not an unconditional guarantee.',
    ),
    homeExperiment: t(
      '请成人一起从外部观察一件正常、干燥、未接电的设备，记录完整外壳、清楚标签等两项观察。若看到破损或焦痕，不触碰或继续检查，让成人处理。不打开插座、插排或设备。',
      'With an adult, observe the exterior of a normal dry unplugged device and record two features such as intact casing and a clear label. If damage or scorch marks appear, do not touch or continue inspecting; let the adult handle it. Do not open outlets, powerboards or devices.',
    ),
    vocabulary: [
      t('过载', 'overload'),
      t('短路', 'short circuit'),
      t('过流保护', 'overcurrent protection'),
      t('漏电保护', 'RCD protection'),
    ],
    questions: [
      q(
        '加了许多正常负载，总电流超过规定条件，称为？',
        'Many ordinary loads exceed the assigned current condition. Called?',
        [
          ['过载', 'Overload'],
          ['短路一定发生', 'A short must have occurred'],
          ['没有电荷', 'No charge'],
        ],
        0,
        '正常支路过多与低电阻旁路是不同原因。',
        'Too many ordinary branches differs from a low-resistance bypass.',
      ),
      q(
        '低电阻通路绕过负载，更符合？',
        'An unintended low-resistance path bypasses loads. Called?',
        [
          ['短路', 'Short circuit'],
          ['正常节能模式', 'Normal energy-saving mode'],
        ],
        0,
        '总电阻可能大幅下降，电流与发热风险增加。',
        'Effective resistance can fall sharply, increasing current and heating risk.',
      ),
      q(
        '看见电源线外皮破损，应怎样？',
        'A power cord has damaged insulation. What should you do?',
        [
          ['摸一下试试有没有电', 'Touch it to test'],
          [
            '停止使用，告诉成人，由合格人员处理',
            'Stop use, tell an adult and have qualified help handle it',
          ],
          ['反复开关试运行', 'Repeatedly switch it on'],
        ],
        1,
        '不要用接触身体或试通电去验证危险。',
        'Do not use your body or energising trials to test a hazard.',
      ),
    ],
    exit: q(
      '保护没有动作，能证明任何带电部件都可以摸吗？',
      'Protection has not operated. Does that mean live parts can be touched?',
      [
        ['能，保护器会负责一切', 'Yes; protection handles everything'],
        [
          '不能，保护有用途与条件，仍要避免接触',
          'No; protection has specific purposes and limits',
        ],
      ],
      1,
      '保护装置降低某些风险，不能代替正确使用与避免接触。',
      'Protection reduces certain risks without replacing correct use and avoiding contact.',
    ),
  },
];
