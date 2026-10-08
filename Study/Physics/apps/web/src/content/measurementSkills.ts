import { t, q, type Lesson } from './schema';
export const measurementSkillsLessons: Lesson[] = [
  {
    id: 'measure-volume',
    stage: 1,
    unit: 'measurement',
    kind: 'volume',
    minutes: 16,
    title: t(
      '石头没有直边，怎么量大小？',
      'No straight edges: how big is the stone?',
    ),
    subtitle: t(
      '让水帮你量出占据的空间。',
      'Let water reveal the space it occupies.',
    ),
    hook: t(
      '一个长方体可以量边长，可一颗弯弯曲曲的小石头怎么办？不把它切开，也能知道它占多少空间吗？',
      'You can measure a block’s edges. But how could you measure the space occupied by a crooked stone without cutting it up?',
    ),
    prediction: t(
      '石头完全没入水中，水面升高。前后读数之差代表什么？',
      'A stone is fully submerged and the water rises. What does the change in reading represent?',
    ),
    predictions: [
      t('石头占据的体积', 'Volume occupied by the stone'),
      t('石头的质量', 'Mass of the stone'),
      t('水变多了', 'New water appeared'),
    ],
    explore: t(
      '先读水面，再把石头完全放入水中。记录前后读数。换成长方体再测一次，并把单位切换成 cm³：数字变了吗？',
      'Read the water level, fully submerge the stone and record both readings. Try the block, then switch to cm³. Does the number change?',
    ),
    concept: t(
      '体积是物体占据的空间。长方体体积等于长×宽×高；1 cm³ 是边长 1 cm 的小立方体占据的空间。1 mL 与 1 cm³ 表示同样大小的体积。物体完全浸没、没有气泡、没有溶解吸水、也没有水洒出时，量筒读数增加量就是物体体积。',
      'Volume is occupied space. A rectangular block has volume length × width × height. One cm³ is the space of a cube with 1 cm edges; 1 mL equals 1 cm³. If the object is fully submerged without bubbles, dissolving, absorption or spilled water, the increase in cylinder reading equals its volume.',
    ),
    example: t(
      '水先是 40 mL，放入石头后是 58 mL：石头体积为 18 mL，也就是 18 cm³。模型长方体为 2×3×4 cm，体积 24 cm³；放入后读数为 64 mL。这是两种方法的交叉检查。',
      'Water starts at 40 mL and rises to 58 mL with the stone: 18 mL = 18 cm³. The model block measures 2 × 3 × 4 cm: 24 cm³. Its cylinder reading becomes 64 mL, cross-checking the two methods.',
    ),
    misconception: t(
      '体积不是质量。相同体积的木块和金属块可以有不同质量。漂浮物直接放进水里时，只浸没部分排水；不能把增加量当成整个物体体积。海绵吸水，也不适合直接套用这个方法。',
      'Volume is not mass: equal-sized wood and metal blocks can have different masses. A floating object displaces water only with its submerged part; that increase does not give its full volume. Absorbent sponges also need another method.',
    ),
    realWorld: t(
      '食谱用 mL 量牛奶，收纳盒关心内部容积，设计船时则关心排开多少水。先明确自己量的是哪一种空间。',
      'Recipes measure milk in mL, storage boxes have internal capacity, and boat design uses displaced-water volume. Identify which space you are measuring.',
    ),
    summary: t(
      '规则物体量边长；合适的不规则物体可以完全浸水，看读数增加量。',
      'Measure edges for regular shapes; fully submerge suitable irregular objects and measure the increase.',
    ),
    formula: t(
      '物体体积 = 浸入后的读数 − 浸入前的读数；1 mL = 1 cm³',
      'Object volume = final reading − initial reading; 1 mL = 1 cm³',
    ),
    homeExperiment: t(
      '用塑料带刻度的量杯和一颗干净、不吸水、能完全浸没的小石头，由家长帮忙，比较水面前后的读数。杯子的刻度可能较粗，只记录它能支持的读数；水下气泡会影响结果。不要用怕水的物品。',
      'With a parent, use a graduated plastic cup and a clean, non-absorbent stone that can be fully submerged. Compare readings before and after. Coarse cup markings limit your reading; trapped bubbles affect the result. Keep water-sensitive items dry.',
    ),
    vocabulary: [
      t('体积', 'volume'),
      t('排水法', 'water displacement'),
      t('完全浸没', 'fully submerged'),
      t('立方厘米', 'cubic centimetre'),
    ],
    questions: [
      q(
        '水从 35 mL 升到 47 mL，完全浸没的石头体积是多少？',
        'Water rises from 35 to 47 mL. What is the fully submerged stone’s volume?',
        [
          ['12 cm³', '12 cm³'],
          ['47 cm³', '47 cm³'],
          ['82 cm³', '82 cm³'],
        ],
        0,
        '取增加量：47 − 35 = 12 mL = 12 cm³。',
        'Use the increase: 47 − 35 = 12 mL = 12 cm³.',
      ),
      q(
        '长方体的三条边为 2、3、5 cm，体积是多少？',
        'A block has edges 2, 3 and 5 cm. What is its volume?',
        [
          ['10 cm³', '10 cm³'],
          ['30 cm³', '30 cm³'],
          ['30 cm', '30 cm'],
        ],
        1,
        '2×3×5 = 30；三个长度相乘，单位是 cm³。',
        '2 × 3 × 5 = 30; three lengths multiply to give cm³.',
      ),
      q(
        '一块木头浮在水上，增加 8 mL，能说整个木块体积是 8 cm³ 吗？',
        'A floating wooden block raises the reading by 8 mL. Is its full volume 8 cm³?',
        [
          ['能，任何物体都这样', 'Yes, for every object'],
          [
            '不能，只测到浸没部分排开的水',
            'No, that is displacement by the submerged part',
          ],
        ],
        1,
        '需要整个物体完全浸没，才能直接用增加量量整个体积。',
        'The whole object must be submerged to use the increase for its entire volume.',
      ),
    ],
    exit: q(
      '一个不吸水的物体完全浸没后，读数由 50 变 65 mL。若还夹着气泡，15 cm³ 会怎样？',
      'A non-absorbent object raises water from 50 to 65 mL. What if air bubbles are trapped?',
      [
        [
          '可能偏大，气泡也排开了水',
          'It may be too large; bubbles also displace water',
        ],
        ['必然完全准确', 'It must be exactly accurate'],
      ],
      0,
      '15 cm³ 包含物体和气泡排水；检查条件比只套公式更重要。',
      'The 15 cm³ includes object and bubble displacement. Check the conditions as well as the calculation.',
    ),
  },
  {
    id: 'accuracy-and-resolution',
    stage: 1,
    unit: 'measurement',
    kind: 'accuracy',
    minutes: 16,
    title: t(
      '每次都一样，就一定量对了吗？',
      'Always the same: always correct?',
    ),
    subtitle: t(
      '把稳定、接近参考值和小刻度分开看。',
      'Separate consistency, closeness and fine markings.',
    ),
    hook: t(
      '朋友用坏尺子连测三次，每次都是 11 cm。他说：“一模一样，肯定很准确！”可是物体的可靠参考长度是 10 cm。',
      'A friend’s faulty ruler reads 11 cm three times. “Identical! It must be accurate!” Yet the object has a reliable 10 cm reference length.',
    ),
    prediction: t(
      '三次都读到 11 cm，参考值是 10 cm，说明什么？',
      'Three readings are 11 cm, against a 10 cm reference. What does this show?',
    ),
    predictions: [
      t('结果稳定，但可能有共同偏差', 'Consistent results, but a shared bias'),
      t('一定没有误差', 'Definitely no error'),
      t('测得越多，尺子自动修好', 'More repeats repair the ruler'),
    ],
    explore: t(
      '记录偏移尺子的小刻度读数，再修正偏移，用粗刻度和细刻度分别记录。参考长度没有改变；比较三个读数的位置和平均值。',
      'Record the biased fine ruler, then correct the offset and record both coarse and fine divisions. The reference length stays fixed. Compare the positions and means.',
    ),
    concept: t(
      '准确度关注结果与可靠参考值有多接近；重复测量的一致性关注结果彼此有多接近。最小刻度是工具能直接分辨的尺度，它限制读数，但不保证准确。零点偏移会让读数一起偏离；需要用可靠参考检查、校准，或用两个正确读数的差来避免把零点错当起点。',
      'Accuracy concerns closeness to a reliable reference; repeatability concerns how closely readings agree. The smallest division sets the tool’s direct reading scale, but does not guarantee accuracy. A zero offset can shift readings together. Check against a reliable reference, calibrate, or use the difference between two valid readings.',
    ),
    example: t(
      '模型参考为 10.0 cm。偏移 1 cm 的细尺给出 10.9、11.0、11.1 cm，平均 11.0 cm；修正后为 9.9、10.0、10.1 cm，平均 10.0 cm。粗刻度会把后三个读数都显示为 10 cm，却隐藏了细小差异。',
      'The model reference is 10.0 cm. A fine ruler with a 1 cm offset reads 10.9, 11.0 and 11.1 cm: mean 11.0. After correction: 9.9, 10.0 and 10.1 cm: mean 10.0. Coarse divisions show all three as 10 cm, concealing the small variation.',
    ),
    misconception: t(
      '更多小数位不等于更准确；读数整齐也不等于没有误差。真实参考值通常也有不确定度。本模型把参考值当作已知来帮助识别偏差，不表示现实中能无限精确地知道真值。',
      'More decimal places do not mean greater accuracy, and neat readings do not mean no error. Real references also have uncertainty. This model treats the reference as known to illustrate bias; real true values are not known with unlimited precision.',
    ),
    realWorld: t(
      '称食物前检查天平是否归零，量身高时拿掉鞋子并保持尺子竖直。先找方法和工具的共同偏差，再增加次数。',
      'Check a scale’s zero before weighing food; remove shoes and keep the ruler vertical when measuring height. Look for method and instrument bias as well as repeating.',
    ),
    summary: t(
      '重复能检查稳定性；校准与正确方法帮助检查共同偏差。细刻度提供细节，不自动保证准确。',
      'Repeats check consistency; calibration and sound methods check shared bias. Fine divisions reveal detail but do not guarantee accuracy.',
    ),
    homeExperiment: t(
      '找一个包装标有尺寸的普通物品，把标注作为比较线索，用尺子量三次。检查起点和尺子角度；如果不一致，先想是包装标注、测法还是尺子的问题。包装数字也不一定是精密参考值。',
      'Measure an everyday item with a labelled size three times. Use the label as a comparison clue and check alignment and the start mark. If readings differ, consider the label, method and ruler; package dimensions are not necessarily precision references.',
    ),
    vocabulary: [
      t('准确度', 'accuracy'),
      t('重复性', 'repeatability'),
      t('最小刻度', 'smallest division'),
      t('校准', 'calibration'),
    ],
    questions: [
      q(
        '三次结果一致，却都比参考值大 1 cm，先检查什么？',
        'Identical readings are all 1 cm above the reference. What should you check?',
        [
          ['只再测一百次', 'Only repeat a hundred times'],
          ['零点与测量方法', 'Zero and measurement method'],
        ],
        1,
        '共同偏差不一定靠重复消失。',
        'Repeating does not necessarily remove a shared bias.',
      ),
      q(
        '最小刻度为 1 mm，屏幕写成 10.00000 cm 会让工具变准吗？',
        'A ruler has 1 mm divisions. Does writing 10.00000 cm improve it?',
        [
          ['会，小数越多越准', 'Yes, more decimals are more accurate'],
          [
            '不会，不能靠补零创造信息',
            'No, added zeros create no new information',
          ],
        ],
        1,
        '报告的细节应由工具和方法支持。',
        'The tool and method must support the detail you report.',
      ),
      q(
        '为什么模型中粗尺三次相同，细尺反而有差异？',
        'Why do coarse readings match while fine readings vary in the model?',
        [
          [
            '细尺显示了粗尺看不到的小变化',
            'The fine ruler reveals small changes hidden by the coarse one',
          ],
          ['有差异一定代表更差', 'Any variation means a worse tool'],
        ],
        0,
        '显示相同可能只是分辨不出差异，不能据此比较准确度。',
        'Identical displays may simply hide variation; that alone cannot rank accuracy.',
      ),
    ],
    exit: q(
      '朋友认为“细刻度 + 测三次”就不必检查零点。你怎么回应？',
      'A friend says a fine ruler and three repeats make a zero check unnecessary. What do you say?',
      [
        [
          '仍需检查；共同偏差会留在平均值里',
          'Still check: a shared bias remains in the mean',
        ],
        ['同意，平均值自动去掉所有误差', 'Agree: a mean removes every error'],
      ],
      0,
      '工具细节、重复性与共同偏差是不同的问题。',
      'Resolution, repeatability and shared bias are different issues.',
    ),
  },
  {
    id: 'repeated-measurements',
    stage: 1,
    unit: 'measurement',
    kind: 'repeats',
    minutes: 16,
    title: t(
      '三次不一样，哪个才算数？',
      'Three different readings: which counts?',
    ),
    subtitle: t(
      '保留证据，再让平均值讲故事。',
      'Keep the evidence and let the mean tell its story.',
    ),
    hook: t(
      '计时同一段动作，三次为 10.2、9.8、10.0 s。能只选最漂亮的 10.0 吗？如果第四次是 1.0 s，又怎么办？',
      'The same action takes 10.2, 9.8 and 10.0 s in three trials. Can you keep only the neat 10.0? What if a fourth trial reads 1.0 s?',
    ),
    prediction: t(
      '面对三次略有不同的有效读数，哪种办法更有说服力？',
      'How should you handle three slightly different valid readings?',
    ),
    predictions: [
      t('保留全部，再计算平均值', 'Keep all and calculate the mean'),
      t('选最接近自己猜想的', 'Choose the one nearest my prediction'),
      t('修改数字让它们相同', 'Change them to match'),
    ],
    explore: t(
      '逐次记录三条教学示例，再观察第四次。查看操作记录后，给提前停表的那次标记原因；比较“全部读数平均值”和“有效读数平均值”。原读数始终保留。',
      'Record three teaching trials, then inspect the fourth. Read its procedure log before flagging the early stop. Compare the mean of all readings with the valid-reading mean. Every original reading stays visible.',
    ),
    concept: t(
      '同一条件下重复测量，能发现差异与操作问题。有效读数的总和除以次数得到平均值；它常能减弱随机变化的影响，但不能消除共同偏差。还要看最大与最小读数的差，也就是这里的“极差”。异常读数先调查，只有明确的方法问题才有理由不纳入这次估计，并保留原值与原因。',
      'Repeating under the same conditions reveals variation and procedural problems. Add valid readings and divide by their count to get a mean. This can reduce random variation but cannot remove a shared bias. Also inspect the range: largest minus smallest. Investigate unusual readings; exclude one from this estimate only with a justified procedural reason, retaining its value and that reason.',
    ),
    example: t(
      '三次有效示例：(10.2+9.8+10.0)÷3 = 10.0 s；极差 0.4 s。加上 1.0 s 后，全部平均值为 7.75 s。操作记录明确第四次在动作完成前就停表，所以标记后有效平均值仍是 10.0 s；不是因为数字不好看才排除。',
      'Valid examples: (10.2 + 9.8 + 10.0) ÷ 3 = 10.0 s, range 0.4 s. Including 1.0 s gives a raw mean of 7.75 s. The procedure log confirms the fourth timer stopped before the action finished, so flagging it leaves a valid mean of 10.0 s. Its exclusion is not about making numbers look nice.',
    ),
    misconception: t(
      '“离其他数远”本身不能证明测错了；它也可能是新现象。不要先删掉再解释。平均值也不是必然的真值；重复偏慢按表，平均值仍可能偏大。模型展示的是预设示例，不是现场测量。',
      'An unusual value alone does not prove a mistake; it might reveal a new phenomenon. Do not delete first and explain later. A mean is not necessarily the true value: consistently late button presses still bias it. These are preset examples, not live measurements.',
    ),
    realWorld: t(
      '想知道步行一段路要多久，可以保持同一路线和走法，测几次并记录。如果有一次中途停下来聊天，写明原因，另算“正常走路”的估计。',
      'To estimate walking time, repeat the same route and walking method. Record every trial. If one includes a chat halfway, note it and distinguish that from your estimate of uninterrupted walking.',
    ),
    summary: t(
      '记录全部读数，用平均值与差异一起看证据；排除必须有方法上的理由。',
      'Keep every reading, use the mean alongside variation, and justify exclusions through the procedure.',
    ),
    formula: t(
      '平均值 = 有效读数的总和 ÷ 有效次数；极差 = 最大值 − 最小值',
      'Mean = sum of valid readings ÷ valid count; range = maximum − minimum',
    ),
    homeExperiment: t(
      '在平坦室内沿同一段路线正常走三次，计时并保留全部读数，计算平均值。先确定什么时候开始和停止，避免冲刺。如果某次被打断，记下过程，不要悄悄改数。',
      'Walk the same clear, level indoor route normally three times. Time each and keep all readings, then calculate the mean. Define start and finish consistently; no sprinting. Note interruptions rather than silently changing numbers.',
    ),
    vocabulary: [
      t('平均值', 'mean'),
      t('极差', 'range'),
      t('随机变化', 'random variation'),
      t('操作记录', 'procedure log'),
    ],
    questions: [
      q(
        '三次有效读数为 8、9、10 s，平均值是多少？',
        'Valid readings are 8, 9 and 10 s. What is the mean?',
        [
          ['9 s', '9 s'],
          ['27 s', '27 s'],
          ['10 s', '10 s'],
        ],
        0,
        '总和 27，除以 3 次得 9 s。',
        'The sum is 27; divide by 3 trials to get 9 s.',
      ),
      q(
        '10.2、9.8、10.0 s 的极差是多少？',
        'What is the range of 10.2, 9.8 and 10.0 s?',
        [
          ['10.0 s', '10.0 s'],
          ['0.4 s', '0.4 s'],
          ['0.2 s', '0.2 s'],
        ],
        1,
        '最大减最小：10.2 − 9.8 = 0.4 s。',
        'Maximum minus minimum: 10.2 − 9.8 = 0.4 s.',
      ),
      q(
        '一个读数很特别，但没有发现操作问题，怎么办？',
        'A reading is unusual, with no known procedural issue. What next?',
        [
          ['删掉，让数据整齐', 'Delete it to tidy the data'],
          ['保留并调查、重复比较', 'Keep it, investigate and repeat'],
        ],
        1,
        '先保留证据，再找原因；特别不等于错误。',
        'Keep evidence before investigating; unusual does not mean incorrect.',
      ),
    ],
    exit: q(
      '天平每次都多显示 20 g，把十次取平均能修正吗？',
      'A balance adds 20 g to every reading. Will averaging ten readings correct it?',
      [
        ['能，任何误差都能平均掉', 'Yes, a mean removes any error'],
        ['不能，仍需检查归零或校准', 'No, check zero or calibration'],
      ],
      1,
      '相同的偏差随每个读数进入平均值，不会自动抵消。',
      'The shared offset enters every reading and remains in the mean.',
    ),
  },
  {
    id: 'paper-thickness',
    stage: 1,
    unit: 'measurement',
    kind: 'paper',
    minutes: 16,
    title: t(
      '一张纸太薄？让一百张帮忙。',
      'Too thin? Let a hundred sheets help.',
    ),
    subtitle: t(
      '从整叠到一张，第一次间接测量。',
      'From a stack to one sheet: indirect measurement.',
    ),
    hook: t(
      '普通尺子的两条小刻度之间有 1 mm，可一张打印纸远薄于这个距离。真的完全没办法量吗？',
      'A ruler’s small divisions are 1 mm apart, but a sheet of printer paper is much thinner. Is there another way to measure it?',
    ),
    prediction: t(
      '要估计单张厚度，哪种办法更可行？',
      'Which approach can estimate one sheet’s thickness?',
    ),
    predictions: [
      t(
        '量同种纸的一整叠，再除以张数',
        'Measure a stack of identical paper and divide by count',
      ),
      t('直接把一张读成 0 mm', 'Read one sheet as exactly 0 mm'),
      t('凭颜色猜', 'Guess from colour'),
    ],
    explore: t(
      '记录一张与一百张的读数，再给一百张加入 1 mm 的整叠读数偏差并记录。比较单张估计；也可以试二十张。注意：屏幕图是放大的侧视示意。',
      'Record one sheet and a hundred sheets, then add a 1 mm stack-reading error to the hundred-sheet case and record again. Compare per-sheet estimates; try twenty too. The side-view drawing is enlarged.',
    ),
    concept: t(
      '把同种、平整的纸叠起来，可以先量总厚度，再除以张数，估计平均单张厚度，这叫间接测量。薄到读不出的单张不是零厚度。方法假设纸张相近、计数正确、没有封面、空隙和明显压缩；测到的是这叠纸在该条件下的平均厚度。',
      'Stack similar, flat sheets, measure the total thickness and divide by their count to estimate average sheet thickness: indirect measurement. An unresolved thin sheet is not zero thickness. The method assumes similar sheets, correct counting, no covers, gaps or significant compression; it estimates this stack’s mean sheet thickness under those conditions.',
    ),
    example: t(
      '一百张纸量到 10 mm：10÷100 = 0.10 mm/张。若整叠读数误差为 +1 mm，就估成 11÷100 = 0.11 mm/张，贡献 +0.01 mm/张。二十张的同样 +1 mm 则贡献 +0.05 mm/张。',
      'A hundred sheets read 10 mm: 10 ÷ 100 = 0.10 mm per sheet. A +1 mm stack-reading error gives 0.11 mm per sheet, contributing +0.01 mm per sheet. The same +1 mm error over twenty sheets contributes +0.05 mm per sheet.',
    ),
    misconception: t(
      '多叠纸能减小固定整叠读数误差对每张的影响，但不是消除所有误差。每张都被压薄、每张间有空气、张数错了，都会影响结果。书的封面与纸张不同，不能把整本厚度直接除以页码；两页通常只是一张纸的两面。',
      'More sheets reduce a fixed stack-reading error’s contribution per sheet, but not every error. Compression, air gaps and miscounting matter. A book’s covers are different, and page numbers are not sheet counts: two pages usually share one sheet.',
    ),
    realWorld: t(
      '同样的“合起来再分”还能估小物品的平均质量：天平先量许多相同物品，再除以个数。方法是否适合，取决于你能保持哪些条件。',
      'The same combine-then-divide idea can estimate small objects’ mean mass: weigh many similar objects and divide by count. Suitability depends on the conditions you can control.',
    ),
    summary: t(
      '让太小的量先变大，再除回去；同时检查计数、空隙与工具的限制。',
      'Combine a tiny quantity into a measurable total, divide back, and check counting, gaps and tool limits.',
    ),
    formula: t(
      '平均单张厚度 = 整叠厚度 ÷ 张数',
      'Mean sheet thickness = stack thickness ÷ sheet count',
    ),
    homeExperiment: t(
      '由家长帮忙取同一包纸中准确数出的 100 张，平整叠好，用毫米尺量整叠厚度，再除以 100。重复放置并测量，保留读数。不要用力压紧，不用锋利工具；如果只能拿到少量纸，诚实说明工具可能不够细。',
      'With a parent, count 100 sheets from the same paper pack, align them, measure stack thickness with a millimetre ruler and divide by 100. Reposition and repeat, retaining readings. Avoid squeezing or sharp tools. With fewer sheets, state that your tool may be too coarse.',
    ),
    vocabulary: [
      t('间接测量', 'indirect measurement'),
      t('平均厚度', 'mean thickness'),
      t('张数', 'sheet count'),
      t('读数限制', 'reading limit'),
    ],
    questions: [
      q(
        '50 张同种纸量到 5 mm，平均单张厚度是多少？',
        'Fifty similar sheets read 5 mm. What is mean sheet thickness?',
        [
          ['0.10 mm', '0.10 mm'],
          ['250 mm', '250 mm'],
          ['10 mm', '10 mm'],
        ],
        0,
        '5÷50 = 0.10 mm。',
        '5 ÷ 50 = 0.10 mm.',
      ),
      q(
        '一张纸在 1 mm 刻度上读不出厚度，意味着什么？',
        'One sheet is unresolved with 1 mm divisions. What does that mean?',
        [
          ['纸完全没有厚度', 'It has no thickness'],
          [
            '需要更细工具或合并测量',
            'Use a finer tool or combine measurements',
          ],
        ],
        1,
        '读不出与量为零是不同的。',
        'Unable to resolve does not mean zero.',
      ),
      q(
        '100 张总厚度多读 1 mm，单张估计多多少？',
        'A hundred-sheet stack is read 1 mm too large. How much is the per-sheet estimate too large?',
        [
          ['1 mm', '1 mm'],
          ['0.01 mm', '0.01 mm'],
          ['100 mm', '100 mm'],
        ],
        1,
        '固定整叠偏差也要除以 100。',
        'Divide the fixed stack error by 100 too.',
      ),
    ],
    exit: q(
      '一本书标 200 页，含硬封面，能把整本厚度除以 200 来估单张纸吗？',
      'A hardback has 200 numbered pages. Can its whole thickness divided by 200 estimate one sheet?',
      [
        [
          '不能，要排除封面，并数纸张而非页码',
          'No: exclude covers and count sheets, not page numbers',
        ],
        ['能，数字越大就越准确', 'Yes: larger numbers are always better'],
      ],
      0,
      '方法需要正确的组成与计数；通常一张纸有正反两页。',
      'Use the right components and count; one sheet usually has two pages.',
    ),
  },
];
