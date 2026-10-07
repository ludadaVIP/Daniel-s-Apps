import type { Lesson } from './lessons';

export const level18Lessons: Lesson[] = [
  {
    id: 'chromatography-colour-detective',
    levelId: 'analysis',
    order: 65,
    title: {
      zh: '色谱法：把一滴颜色拆成证据',
      en: 'Chromatography: turn one colour spot into evidence',
    },
    eyebrow: {
      zh: '第 65 课 · 像化学侦探一样分开混合物',
      en: 'Lesson 65 · Separate a mixture like a chemistry detective',
    },
    hook: {
      zh: '黑色水笔写下的一条线，真的只含一种黑色物质吗？当一滴墨水被带着向上移动，隐藏的蓝、紫、黄可能陆续出现。化学家如何把“看起来一样”的东西变成可比较的证据？',
      en: 'Does a black pen line truly contain one black substance? As a spot of ink travels upward, hidden blue, purple and yellow can appear. How do chemists turn things that look alike into comparable evidence?',
    },
    hookHint: {
      zh: '纸色谱法让溶剂沿纸移动。混合物中的成分因为更愿意跟着溶剂走、或更愿意停在纸上，而移动不同距离，于是被分开。',
      en: 'Paper chromatography lets a solvent move along paper. Components travel different distances because some prefer moving with the solvent while others prefer staying on the paper.',
    },
    bigIdea: {
      zh: '色谱法不是“把颜色变魔术”，而是利用成分与两种环境的不同相互作用来分离混合物。图样是证据，需要和对照、公平条件一起解释。',
      en: 'Chromatography is not colour magic. It separates a mixture using components’ different interactions with two environments. The pattern is evidence and must be interpreted with controls and fair conditions.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🖊️',
        title: { zh: '墨水不一定是单一染料', en: 'Ink need not be one dye' },
        body: {
          zh: '两支笔写出的线看起来同为黑色，内部的染料组合却可能不同。色谱图能让“看不见的差异”变成分开的色点。',
          en: 'Two black-looking pen lines can have different dye mixtures. A chromatogram turns invisible differences into separated spots.',
        },
      },
      {
        icon: '🌿',
        title: {
          zh: '植物颜色也是混合物线索',
          en: 'Plant colours are mixture clues',
        },
        body: {
          zh: '绿叶里不只有叶绿素，常还有其他色素。研究人员可用分离方法观察这些成分；真实实验需要合适材料、通风和成人或实验室规范。',
          en: 'Leaves contain more than chlorophyll; other pigments are often present. Researchers use separation methods to study them; real experiments need suitable materials, ventilation and adult or laboratory procedures.',
        },
      },
      {
        icon: '🔍',
        title: {
          zh: '图样需要对照才有意义',
          en: 'Patterns need comparisons to mean something',
        },
        body: {
          zh: '一张色谱纸上的点不能自动“指认来源”。只有在同样溶剂、纸张和条件下，与已知样品并列比较，图样才成为更有力的线索。',
          en: 'Spots on one chromatogram cannot automatically identify a source. Patterns become stronger clues only when compared beside known samples under the same solvent, paper and conditions.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '一张纸，两种“停靠点”',
          en: 'One paper, two places to settle',
        },
        body: {
          zh: '纸是固定相：成分可以暂时停靠。上升的溶剂是流动相：成分也可以跟着它移动。每一种成分都在这两种倾向之间“做选择”。',
          en: 'Paper is the stationary phase where components can pause. The rising solvent is the mobile phase that carries components. Each component has a different balance between these two tendencies.',
        },
      },
      {
        title: {
          zh: '跑得远不等于“更好”',
          en: 'Travelling farther is not “better”',
        },
        body: {
          zh: '某个色点走得远，只说明在这套纸和溶剂条件下，它更愿意随流动相移动。换一种溶剂，次序甚至可能改变，所以要说清实验条件。',
          en: 'A spot travelling farther only means it preferred the mobile phase more in this paper-and-solvent system. With a different solvent, even the order can change, so conditions must be stated.',
        },
      },
      {
        title: {
          zh: '比较前，先让条件公平',
          en: 'Make conditions fair before comparing',
        },
        body: {
          zh: '比较未知样品和对照样品时，应使用同一张纸、同一溶剂，并让起点在同一高度。观察到相同图样是线索，不等于单独就能证明来源。',
          en: 'When comparing an unknown with a reference, use the same paper and solvent, with starting spots at the same height. A matching pattern is a clue, not standalone proof of origin.',
        },
      },
    ],
    misconception: {
      zh: '“色谱图上只有一个点，就一定是纯净物”不一定对。在给定条件下只出现一个可见点，最多说明没有分离出更多可见成分；有些成分可能无色、重叠或没有在该条件下分开。',
      en: '“One spot on a chromatogram proves a pure substance” is not necessarily true. Under those conditions it only means no more visible separated components appeared; some may be colourless, overlap or fail to separate in that system.',
    },
    mission: {
      zh: '证据设计师：看互动模型中的两条色谱“指纹”。写下你要公平比较它们，必须固定的两项条件（例如纸张与溶剂）；再写下一个你还需要的额外证据，避免匆忙下结论。',
      en: 'Evidence designer: inspect the two chromatogram “fingerprints” in the model. Write two conditions you must keep fixed for a fair comparison, such as paper and solvent; then name one extra piece of evidence you would need before jumping to a conclusion.',
    },
    vocabulary: [
      { en: 'chromatography', zh: '色谱法' },
      { en: 'mixture', zh: '混合物' },
      { en: 'stationary phase', zh: '固定相' },
      { en: 'mobile phase', zh: '流动相' },
      { en: 'reference sample', zh: '对照样品' },
    ],
    interactive: 'chromatography-lab',
    questions: [
      {
        id: 'chromatography-q1',
        prompt: {
          zh: '纸色谱法主要利用什么来分离混合物成分？',
          en: 'What does paper chromatography mainly use to separate mixture components?',
        },
        options: [
          {
            zh: '成分在纸和溶剂之间有不同的移动倾向',
            en: 'Components have different movement tendencies between paper and solvent',
          },
          { zh: '把原子变成新元素', en: 'It changes atoms into new elements' },
          { zh: '只靠把颜色晒干', en: 'It only dries colours in sunlight' },
        ],
        answer: 0,
        explanation: {
          zh: '各成分与固定相、流动相的相互作用不同，所以会在同一段时间内移动不同距离。',
          en: 'Components interact differently with stationary and mobile phases, so they travel different distances in the same time.',
        },
      },
      {
        id: 'chromatography-q2',
        prompt: {
          zh: '在同一纸张和溶剂条件下，哪个色点更愿意跟随流动相？',
          en: 'Under the same paper and solvent conditions, which spot prefers the mobile phase more?',
        },
        options: [
          { zh: '移动距离更远的色点', en: 'The spot that travelled farther' },
          {
            zh: '留在起点的色点一定更愿意移动',
            en: 'A spot at the start must prefer moving',
          },
          {
            zh: '不能从图样获得任何线索',
            en: 'No clue can ever come from a pattern',
          },
        ],
        answer: 0,
        explanation: {
          zh: '在相同条件下，走得更远的成分相对更愿意随着溶剂前进。',
          en: 'Under matching conditions, the farther-travelling component relatively prefers moving with the solvent.',
        },
      },
      {
        id: 'chromatography-q3',
        prompt: {
          zh: '比较未知墨水与已知墨水时，怎样做才公平？',
          en: 'What makes comparing an unknown ink with a known ink fair?',
        },
        options: [
          {
            zh: '把它们放在同一张纸、同一种溶剂并保持相同起点高度',
            en: 'Run them on the same paper with the same solvent and start height',
          },
          {
            zh: '每个样品使用不同溶剂',
            en: 'Use a different solvent for each sample',
          },
          {
            zh: '只比较哪支笔看起来更黑',
            en: 'Only compare which pen looks darker',
          },
        ],
        answer: 0,
        explanation: {
          zh: '固定条件才能让图样差异更可能来自样品本身，而不是实验设置。',
          en: 'Keeping conditions fixed makes pattern differences more likely to come from samples rather than the setup.',
        },
      },
      {
        id: 'chromatography-q4',
        prompt: {
          zh: '色谱图上只有一个可见点，最稳妥的结论是什么？',
          en: 'What is the most careful conclusion from one visible chromatogram spot?',
        },
        options: [
          {
            zh: '在这些条件下没有分离出更多可见成分，但仍需要更多证据',
            en: 'No more visible components separated under these conditions, but more evidence is needed',
          },
          { zh: '它绝对是纯净物', en: 'It is certainly pure' },
          {
            zh: '它一定和所有对照样品相同',
            en: 'It must be identical to every reference sample',
          },
        ],
        answer: 0,
        explanation: {
          zh: '一个可见点是有限证据；无色、重叠或未分开的成分都可能存在。',
          en: 'One visible spot is limited evidence; colourless, overlapping or unseparated components may still exist.',
        },
      },
    ],
  },
  {
    id: 'calibration-colour-quantity',
    levelId: 'analysis',
    order: 66,
    title: {
      zh: '校准曲线：颜色深浅怎样变成“有多少”',
      en: 'Calibration curves: turn colour strength into “how much”',
    },
    eyebrow: {
      zh: '第 66 课 · 给眼睛一把可量化的尺子',
      en: 'Lesson 66 · Give your eyes a measurable ruler',
    },
    hook: {
      zh: '两杯蓝色饮料，哪一杯染料更多？只靠肉眼常会受杯子厚度、光线和个人感觉影响。化学家会先准备“已知浓度”的颜色标准，再用它们做一把校准尺。',
      en: 'Two blue drinks: which has more dye? Eyes alone are affected by cup thickness, lighting and perception. Chemists first prepare colour standards with known concentrations, then make a calibration ruler.',
    },
    hookHint: {
      zh: '若同一种有色物质、相同容器和相同测量方式都保持不变，颜色吸收或深浅常能随浓度稳定改变。未知样品再放到这把尺上比较。',
      en: 'When the same coloured substance, container and measurement method are kept constant, colour absorption or intensity can often change reliably with concentration. An unknown is then compared against that ruler.',
    },
    bigIdea: {
      zh: '定量分析不是“看起来更深就一定更多”。它需要已知标准、稳定条件和适用范围，才能把仪器读数或颜色强度换成可信的浓度估计。',
      en: 'Quantitative analysis is not “darker must mean more.” It needs known standards, stable conditions and a valid range before colour strength or an instrument reading becomes a trustworthy concentration estimate.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '💧',
        title: {
          zh: '水质试纸是颜色比较的起点',
          en: 'Water-test strips begin with colour comparison',
        },
        body: {
          zh: '一些水质检测会给出颜色卡。颜色卡能提供范围判断，但不同品牌、光线和读法可能影响结果；真实饮用水安全应依靠当地官方检测与建议。',
          en: 'Some water tests use colour charts. They can give range estimates, but brand, lighting and reading method matter; real drinking-water safety relies on official local testing and guidance.',
        },
      },
      {
        icon: '🧪',
        title: {
          zh: '医学与环境检测会用校准',
          en: 'Medical and environmental tests use calibration',
        },
        body: {
          zh: '实验室会用已知标准检查仪器读数是否合理，再报告未知样品的结果。数字不是凭空出现的，它背后有一串对照和误差检查。',
          en: 'Laboratories use known standards to check that instrument readings make sense before reporting an unknown. A number does not appear from nowhere; it rests on comparisons and error checks.',
        },
      },
      {
        icon: '📏',
        title: {
          zh: '超出刻度，估计会变差',
          en: 'Beyond the scale, estimates weaken',
        },
        body: {
          zh: '如果未知样品比所有标准都深，不能自信地“把线往外拉”得到准确数字。通常要稀释到校准范围内，再重新测量和换算。',
          en: 'If an unknown is darker than every standard, confidently extending the line outward may not give an accurate number. It is usually diluted into the calibration range, then measured and converted again.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先造一把已知的尺', en: 'First make a known ruler' },
        body: {
          zh: '准备一组已知浓度的标准样品，并用相同容器、相同光程和相同仪器模式测量。每一个标准点都把“读数”和“浓度”连起来。',
          en: 'Prepare standards with known concentrations, then measure them with the same container, light path and instrument mode. Each standard point links a reading to a concentration.',
        },
      },
      {
        title: { zh: '再把未知样品放上去', en: 'Then place the unknown on it' },
        body: {
          zh: '未知样品得到一个读数后，在标准点形成的关系中寻找对应位置。得到的是估计值，所以要报告合适的精度，而不是假装小数点越多越准确。',
          en: 'After the unknown gives a reading, find its matching place in the relationship made by standard points. The result is an estimate, so report sensible precision rather than pretending more decimals mean more accuracy.',
        },
      },
      {
        title: {
          zh: '要先问：它还在可用范围吗？',
          en: 'Ask first: is it still in range?',
        },
        body: {
          zh: '校准线只在实验验证过的范围内最可靠。读数超出最高或最低标准时，先调整样品或重新设计测量，而不是把猜测当成数据。',
          en: 'A calibration line is most reliable only in the range that was tested. When a reading falls beyond the highest or lowest standard, adjust the sample or redesign the measurement instead of treating a guess as data.',
        },
      },
    ],
    misconception: {
      zh: '“颜色越深，浓度一定按同样比例增加”不一定对。只有在特定物质、固定条件和验证过的范围内，关系才可能近似线性；浑浊、光线和仪器范围都会干扰判断。',
      en: '“Darker colour always means concentration rises in the same proportion” is not always true. A near-linear relationship may hold only for a particular substance, fixed conditions and tested range; cloudiness, lighting and instrument range can interfere.',
    },
    mission: {
      zh: '生活测量批判家：找一个带有颜色刻度或数字刻度的家用物品说明（例如温度计图片、测量杯或公开水质色卡）。写下它的“0”和一个已知刻度分别代表什么，并说明为什么不能把刻度外的数值当成同样可靠。',
      en: 'Everyday measurement critic: find instructions for a household item with a colour or number scale, such as a thermometer image, measuring cup or public water-test chart. Explain what its zero and one known mark represent, then why values outside the scale are not equally reliable.',
    },
    vocabulary: [
      { en: 'calibration', zh: '校准' },
      { en: 'standard solution', zh: '标准溶液' },
      { en: 'concentration', zh: '浓度' },
      { en: 'unknown sample', zh: '未知样品' },
      { en: 'measurement range', zh: '测量范围' },
    ],
    interactive: 'calibration-colour-lab',
    questions: [
      {
        id: 'calibration-q1',
        prompt: {
          zh: '校准曲线中的标准样品最重要的特点是什么？',
          en: 'What is most important about standard samples in a calibration curve?',
        },
        options: [
          {
            zh: '它们的浓度已知，并在相同条件下测量',
            en: 'Their concentrations are known and they are measured under the same conditions',
          },
          {
            zh: '它们必须颜色最漂亮',
            en: 'They must have the prettiest colour',
          },
          {
            zh: '它们都来自未知样品',
            en: 'They all come from the unknown sample',
          },
        ],
        answer: 0,
        explanation: {
          zh: '已知浓度把读数和真实数量连起来；相同条件让比较有意义。',
          en: 'Known concentrations link readings to actual amounts; matching conditions make comparison meaningful.',
        },
      },
      {
        id: 'calibration-q2',
        prompt: {
          zh: '未知样品比最高标准的读数还大，最合理的下一步是什么？',
          en: 'An unknown reads higher than the highest standard. What is the best next step?',
        },
        options: [
          {
            zh: '把样品调整到校准范围内后重新测量',
            en: 'Adjust the sample into the calibration range and measure again',
          },
          {
            zh: '把曲线无限延长并当作精确值',
            en: 'Extend the curve forever and treat it as exact',
          },
          { zh: '忽略所有标准点', en: 'Ignore every standard point' },
        ],
        answer: 0,
        explanation: {
          zh: '超出已验证范围时，外推会更不可靠；先回到可靠范围。',
          en: 'Beyond the tested range, extrapolation is less reliable; first return to a trustworthy range.',
        },
      },
      {
        id: 'calibration-q3',
        prompt: {
          zh: '为什么测量未知样品与标准样品时要使用同一容器和模式？',
          en: 'Why use the same container and mode for unknown and standards?',
        },
        options: [
          {
            zh: '减少测量设置造成的差异，让读数可比较',
            en: 'Reduce differences from the setup so readings can be compared',
          },
          { zh: '让颜色变得更好看', en: 'Make colours look prettier' },
          {
            zh: '因为未知样品没有浓度',
            en: 'Because unknown samples have no concentration',
          },
        ],
        answer: 0,
        explanation: {
          zh: '改变容器、光程或仪器模式也可能改变读数，会混入非样品本身的差异。',
          en: 'Changing containers, light paths or instrument modes can change readings and mix in differences not caused by the sample.',
        },
      },
      {
        id: 'calibration-q4',
        prompt: {
          zh: '哪句话最能体现可靠的定量分析？',
          en: 'Which statement best describes reliable quantitative analysis?',
        },
        options: [
          {
            zh: '用已知标准建立关系，并报告适合证据的估计精度',
            en: 'Use known standards to build a relationship and report precision suited to the evidence',
          },
          {
            zh: '凭肉眼一次判断就给出很多小数位',
            en: 'Give many decimals from one visual guess',
          },
          {
            zh: '只要颜色相同就一定浓度相同',
            en: 'Matching colour always means matching concentration',
          },
        ],
        answer: 0,
        explanation: {
          zh: '可靠数字来自校准、控制条件和合理的不确定性表达，而不是看起来很精细的格式。',
          en: 'Reliable numbers come from calibration, controlled conditions and sensible uncertainty, not from a format that merely looks precise.',
        },
      },
    ],
  },
  {
    id: 'titration-drop-by-drop-measurement',
    levelId: 'analysis',
    order: 67,
    title: {
      zh: '滴定：一滴一滴，测出看不见的浓度',
      en: 'Titration: measure an invisible concentration drop by drop',
    },
    eyebrow: {
      zh: '第 67 课 · 用已知溶液找到未知答案',
      en: 'Lesson 67 · Use a known solution to find an unknown answer',
    },
    hook: {
      zh: '如果一瓶透明液体没有标签，怎样判断它含有多少酸？化学家不会凭尝味道或闻气味猜测，而会用浓度已知的溶液，一滴一滴地找到一个清晰的“刚好”信号。',
      en: 'If a clear liquid has no label, how can we tell how much acid it contains? Chemists do not taste or smell it. They use a solution of known concentration and add it drop by drop until a clear “just right” signal appears.',
    },
    hookHint: {
      zh: '这叫滴定。已知浓度的溶液叫滴定剂；它被慢慢加入未知样品。指示剂颜色变化提示终点附近，然后用体积和反应比例算出未知浓度。',
      en: 'This is titration. The solution with known concentration is the titrant; it is slowly added to an unknown sample. An indicator colour change signals the endpoint, then volume and reaction ratio are used to calculate the unknown concentration.',
    },
    bigIdea: {
      zh: '滴定把“已知多少”与“刚好反应完所需体积”连接起来。终点颜色是测量信号，需要缓慢、重复和公平读取；它不是让人用眼睛猜液体安全性的游戏。',
      en: 'Titration links what is known to the volume needed to react just enough. Endpoint colour is a measurement signal that needs slow, repeated, fair reading; it is not a game for guessing whether liquids are safe by eye.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🧴',
        title: {
          zh: '产品标签的酸度背后是测量',
          en: 'Product acidity labels rest on measurement',
        },
        body: {
          zh: '食品、饮料和工业液体的酸度或成分控制常需要定量分析。标签数字不是凭颜色或气味得出的，而依赖经过验证的方法和质量控制。',
          en: 'Controlling acidity or ingredients in foods, drinks and industrial liquids often needs quantitative analysis. Label numbers do not come from colour or smell; they rely on validated methods and quality checks.',
        },
      },
      {
        icon: '💊',
        title: {
          zh: '药品浓度不能凭感觉',
          en: 'Medicine concentration cannot be guessed',
        },
        body: {
          zh: '药物与清洁品的浓度关系到效果和风险，必须由专业流程控制。家里的未知液体应保留原包装、远离儿童，并按当地指导处理。',
          en: 'Concentrations in medicines and cleaning products affect both effect and risk, so they need professional control. Keep unknown household liquids in original packaging, away from children, and follow local disposal guidance.',
        },
      },
      {
        icon: '🔁',
        title: {
          zh: '一次终点不等于一次真相',
          en: 'One endpoint is not one truth',
        },
        body: {
          zh: '真实滴定常重复多次，并比较彼此接近的读数。若某一次差得很远，不是硬把它平均进去，而是检查操作、记录和可能的原因。',
          en: 'Real titrations are often repeated, then closely agreeing readings are compared. If one result is far away, do not blindly average it in; check the operation, record and possible causes.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '准备两种角色：已知与未知',
          en: 'Prepare two roles: known and unknown',
        },
        body: {
          zh: '取一份体积已知的未知样品，准备浓度已知的滴定剂。只有其中一方真正“已知”，体积读数和反应方程式才能把另一方推出来。',
          en: 'Take a known volume of the unknown sample and prepare a titrant of known concentration. Only when one side is genuinely known can volume readings and an equation work out the other side.',
        },
      },
      {
        title: { zh: '接近终点时要放慢', en: 'Slow down near the endpoint' },
        body: {
          zh: '指示剂颜色突然稳定变化前，少量滴定剂可能就足以跨过终点。前面可以较快加入，接近时要逐滴加入并混匀，减少一滴加过头造成的误差。',
          en: 'Near the moment an indicator colour changes permanently, a small amount of titrant can cross the endpoint. Addition may be quicker earlier, but near the end it becomes dropwise and mixed to reduce overshooting error.',
        },
      },
      {
        title: {
          zh: '读数加上比例，才是答案',
          en: 'Reading plus ratio makes the answer',
        },
        body: {
          zh: '终点时的滴定剂体积只是数据的一部分。还要结合已知浓度、未知样品体积和方程式中的化学计量比例，才能得到未知浓度。',
          en: 'The titrant volume at the endpoint is only part of the data. Combine it with known concentration, unknown-sample volume and the equation’s stoichiometric ratio to get the unknown concentration.',
        },
      },
    ],
    misconception: {
      zh: '“指示剂一变色就等于反应在每个微观瞬间完全中和”不准确。颜色变化是设定条件下帮助定位终点的可见信号；终点与理论等当点非常接近，但概念上并不完全相同。',
      en: '“The instant an indicator changes colour, every microscopic particle is perfectly neutralised” is not accurate. Colour change is a visible signal used to locate an endpoint under set conditions; the endpoint is close to, but conceptually not identical with, the theoretical equivalence point.',
    },
    mission: {
      zh: '流程设计师：看虚拟滴定模型，列出为什么“接近终点改为逐滴加入”和“重复多次”都能提高结果可信度。只分析模型，不用家中液体模仿滴定。',
      en: 'Process designer: use the virtual titration model to explain why “add drop by drop near the endpoint” and “repeat several times” both improve trustworthiness. Analyse only the model; do not imitate titration with household liquids.',
    },
    vocabulary: [
      { en: 'titration', zh: '滴定' },
      { en: 'titrant', zh: '滴定剂' },
      { en: 'indicator', zh: '指示剂' },
      { en: 'endpoint', zh: '终点' },
      { en: 'equivalence point', zh: '等当点' },
    ],
    interactive: 'titration-endpoint-lab',
    questions: [
      {
        id: 'titration-q1',
        prompt: {
          zh: '滴定中，滴定剂（titrant）最关键的已知信息是什么？',
          en: 'In titration, what is the most important known information about the titrant?',
        },
        options: [
          { zh: '它的浓度已知', en: 'Its concentration is known' },
          { zh: '它一定是蓝色', en: 'It must be blue' },
          { zh: '它不需要体积读数', en: 'It does not need a volume reading' },
        ],
        answer: 0,
        explanation: {
          zh: '已知浓度的滴定剂与终点体积一起，才能连接到未知样品中物质的量。',
          en: 'A titrant of known concentration, together with endpoint volume, connects to the amount in the unknown sample.',
        },
      },
      {
        id: 'titration-q2',
        prompt: {
          zh: '为什么接近终点时要逐滴加入？',
          en: 'Why add drop by drop near the endpoint?',
        },
        options: [
          {
            zh: '很少的滴定剂就可能跨过终点，逐滴能减少加过头',
            en: 'A tiny amount can cross the endpoint, so dropwise addition reduces overshooting',
          },
          { zh: '这样颜色会永远不变', en: 'This makes colour never change' },
          {
            zh: '因为前面的体积读数不重要',
            en: 'Because earlier volume readings do not matter',
          },
        ],
        answer: 0,
        explanation: {
          zh: '终点附近反应已经很接近完成，一滴过量的滴定剂也会让测得体积偏大。',
          en: 'Near the endpoint the reaction is almost complete, so one excess drop can make the measured volume too large.',
        },
      },
      {
        id: 'titration-q3',
        prompt: {
          zh: '终点的体积读数本身足以算出未知浓度吗？',
          en: 'Is endpoint volume alone enough to calculate an unknown concentration?',
        },
        options: [
          {
            zh: '不够，还需要已知浓度、样品体积和反应比例',
            en: 'No; known concentration, sample volume and reaction ratio are also needed',
          },
          { zh: '够，因为颜色已经改变', en: 'Yes, because the colour changed' },
          {
            zh: '够，因为所有反应都使用相同体积',
            en: 'Yes, because all reactions use the same volume',
          },
        ],
        answer: 0,
        explanation: {
          zh: '滴定是把多个量用化学计量关系连接起来；只知道一个体积没有足够信息。',
          en: 'Titration connects several quantities through stoichiometry; one volume alone is not enough information.',
        },
      },
      {
        id: 'titration-q4',
        prompt: {
          zh: '为什么真实滴定要重复多次？',
          en: 'Why are real titrations repeated?',
        },
        options: [
          {
            zh: '检查读数是否彼此接近，并发现可能的偶然误差',
            en: 'To check whether readings agree and spot possible random error',
          },
          {
            zh: '让未知液体自动变安全',
            en: 'To make unknown liquid automatically safe',
          },
          {
            zh: '因为第一次的化学反应不是真的',
            en: 'Because the first chemical reaction is not real',
          },
        ],
        answer: 0,
        explanation: {
          zh: '重复能显示结果是否稳定，也给我们机会发现一次加过头、读数看错等偶然问题。',
          en: 'Repeats show whether results are stable and give a chance to notice one-off overshoots, misreadings and similar issues.',
        },
      },
    ],
  },
  {
    id: 'titration-mole-bridge',
    levelId: 'analysis',
    order: 72,
    title: {
      zh: '滴定计算：用一份已知，读出一份未知',
      en: 'Titration maths: from known to unknown',
    },
    eyebrow: {
      zh: '第 72 课 · 体积 → mol → 浓度',
      en: 'Lesson 72 · Volume → moles → concentration',
    },
    hook: {
      zh: '两瓶无色盐酸看起来一模一样，浓度却可能不同。把已知浓度的碱慢慢加进去，为什么“用了多少毫升”能告诉你原来有多少酸？',
      en: 'Two colourless hydrochloric acid samples may look identical but have different concentrations. Why can the volume of a known base reveal how much acid was present?',
    },
    hookHint: {
      zh: '接上第 67 课的滴定终点与第 71 课的 mol/L。这里不是凭颜色猜浓度：颜色提示我们何时读数，再用反应比例把读数连到 mol。',
      en: 'Build on the endpoint in Lesson 67 and mol/L in Lesson 71. Colour does not guess concentration: it tells us when to read the volume; the reaction ratio connects that reading to moles.',
    },
    bigIdea: {
      zh: '滴定的桥梁是反应比例：已知液体的 cV 给出 mol，再换成未知样品的 mol，最后除以样品体积。',
      en: 'The reaction ratio is the bridge: known cV gives moles, which gives sample moles, then divide by sample volume.',
    },
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '🔎',
        title: {
          zh: '透明不等于一样浓',
          en: 'Clear does not mean equally concentrated',
        },
        body: {
          zh: '盐酸溶液通常无色，眼睛看不出浓度。滴定用能测量的反应来比较，避免把外观当证据。',
          en: 'Hydrochloric acid solutions are usually colourless. Titration compares them through a measurable reaction instead of treating appearance as evidence.',
        },
      },
      {
        icon: '🧃',
        title: {
          zh: '饮料酸度怎样检查？',
          en: 'How is drink acidity checked?',
        },
        body: {
          zh: '食品实验室可用滴定比较酸度。但果汁往往有多种酸，不能直接套本课盐酸的 1∶1 模型；需要说明测量的是哪一种酸度指标。',
          en: 'Food labs can use titration to compare acidity. Juice often contains several acids, so our 1:1 hydrochloric-acid model cannot be copied directly; the acidity measure must be defined.',
        },
      },
      {
        icon: '📏',
        title: {
          zh: '刻度读数是一段差值',
          en: 'A scale reading is a difference',
        },
        body: {
          zh: '滴定管开始在 2.00 mL，结束在 22.00 mL，实际送出的是 20.00 mL。它不像量杯，只看最后一个数字就够了。',
          en: 'A burette starts at 2.00 mL and ends at 22.00 mL: it delivered 20.00 mL. Unlike a measuring cup, the final reading alone is not enough.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '读条件，找配对关系',
          en: 'Read the conditions and find the ratio',
        },
        body: {
          zh: '例题：25.0 mL 未知盐酸，需要 20.0 mL 的 0.100 mol/L NaOH 才恰好中和。HCl + NaOH → NaCl + H₂O，系数 1∶1：每 1 mol HCl 对应 1 mol NaOH。',
          en: 'Worked example: 25.0 mL unknown HCl needs 20.0 mL of 0.100 mol/L NaOH for exact neutralisation. HCl + NaOH → NaCl + H₂O has a 1:1 ratio: each mole of HCl needs one mole of NaOH.',
        },
      },
      {
        title: {
          zh: '用已知液体的体积算 mol',
          en: 'Use the known solution to find moles',
        },
        body: {
          zh: '20.0 mL = 0.0200 L。n(NaOH) = cV = 0.100 × 0.0200 = 0.00200 mol。反应比例是 1∶1，所以样品原有 n(HCl) = 0.00200 mol。',
          en: '20.0 mL = 0.0200 L. n(NaOH) = cV = 0.100 × 0.0200 = 0.00200 mol. With the 1:1 ratio, the sample originally held 0.00200 mol HCl.',
        },
      },
      {
        title: {
          zh: '回到原样品，算每升多少 mol',
          en: 'Return to the original sample: moles per litre',
        },
        body: {
          zh: '25.0 mL = 0.0250 L。c(HCl) = 0.00200 ÷ 0.0250 = 0.0800 mol/L。分母是原盐酸样品体积，不是加碱后的总体积：我们在问原来那瓶酸有多浓。',
          en: '25.0 mL = 0.0250 L. c(HCl) = 0.00200 ÷ 0.0250 = 0.0800 mol/L. Divide by the original acid sample volume, not the combined acid-and-base volume: we want the original bottle concentration.',
        },
      },
    ],
    misconception: {
      zh: '不能把所有滴定都当作 1∶1，也不能把终点当成绝对精确的等量点。本课用理想读数学习计算；真实实验要看方程式、选择合适指示剂并重复得到相近读数，不能靠尝味辨认酸碱。',
      en: 'Not every titration is 1:1, and an observed endpoint is not an exact equivalence point. Here ideal readings teach the calculation; real work needs the equation, a suitable indicator and agreeing repeats, never taste-testing acids or bases.',
    },
    mission: {
      zh: '在虚拟实验记录里选择一份样品，先估计酸比 0.100 mol/L 的碱更浓还是更稀，再选择计算结果。查看三步账本，然后换一份记录，解释为什么同体积的酸用碱越多，酸就越浓。',
      en: 'Choose a virtual sample record. Predict whether the acid is more or less concentrated than the 0.100 mol/L base, then choose a result. Inspect the three-step ledger, switch records and explain why equal-volume acid samples need more base when more concentrated.',
    },
    vocabulary: [
      { en: 'titrant', zh: '滴定剂' },
      { en: 'delivered volume', zh: '送出体积' },
      { en: 'stoichiometric ratio', zh: '化学计量比' },
      { en: 'equivalence point', zh: '等量点' },
    ],
    interactive: 'titration-calculation-lab',
    questions: [
      {
        id: 'titration-calculation-q1',
        prompt: {
          zh: '滴定管初读数 2.00 mL，末读数 22.00 mL，送出了多少液体？',
          en: 'A burette starts at 2.00 mL and ends at 22.00 mL. How much was delivered?',
        },
        options: [
          { zh: '22.00 mL', en: '22.00 mL' },
          { zh: '24.00 mL', en: '24.00 mL' },
          { zh: '20.00 mL', en: '20.00 mL' },
        ],
        answer: 2,
        explanation: {
          zh: '送出体积 = 末读数 − 初读数 = 22.00 − 2.00 = 20.00 mL。末读数不等于使用量，除非初读数恰好为零。',
          en: 'Delivered volume = final minus initial = 22.00 − 2.00 = 20.00 mL. The final reading equals the volume used only when the initial reading is zero.',
        },
      },
      {
        id: 'titration-calculation-q2',
        prompt: {
          zh: '20.0 mL、0.100 mol/L 的 NaOH 含多少 mol？',
          en: 'How many moles are in 20.0 mL of 0.100 mol/L NaOH?',
        },
        options: [
          { zh: '0.00200 mol', en: '0.00200 mol' },
          { zh: '2.00 mol', en: '2.00 mol' },
          { zh: '0.00500 mol', en: '0.00500 mol' },
        ],
        answer: 0,
        explanation: {
          zh: 'n = cV = 0.100 mol/L × 0.0200 L = 0.00200 mol。L 相消后才得到 mol；不能直接把 20.0 mL 当作 20.0 L。',
          en: 'n = cV = 0.100 mol/L × 0.0200 L = 0.00200 mol. Litres cancel to leave moles; 20.0 mL must not be treated as 20.0 L.',
        },
      },
      {
        id: 'titration-calculation-q3',
        prompt: {
          zh: '25.0 mL HCl 恰好消耗 0.00200 mol NaOH。HCl∶NaOH = 1∶1，原盐酸浓度是多少？',
          en: '25.0 mL HCl uses exactly 0.00200 mol NaOH. HCl:NaOH = 1:1. What was the acid concentration?',
        },
        options: [
          {
            zh: '0.0444 mol/L（除以加碱后 45.0 mL）',
            en: '0.0444 mol/L (divide by 45.0 mL after adding base)',
          },
          { zh: '0.0800 mol/L', en: '0.0800 mol/L' },
          { zh: '0.0000800 mol/L', en: '0.0000800 mol/L' },
        ],
        answer: 1,
        explanation: {
          zh: '先由 1∶1 得 n(HCl) = 0.00200 mol，再除以原样品 0.0250 L，得到 0.0800 mol/L。要找原瓶浓度，不要用反应后的混合体积。',
          en: 'The 1:1 ratio gives n(HCl) = 0.00200 mol. Divide by the original 0.0250 L sample to get 0.0800 mol/L. We want the original bottle concentration, not the reacted mixture.',
        },
      },
      {
        id: 'titration-calculation-q4',
        prompt: {
          zh: '同样取 25.0 mL HCl，用同浓度 NaOH 滴定。A 需 10.0 mL，B 需 20.0 mL，哪条推理正确？',
          en: 'Equal 25.0 mL HCl samples are titrated with the same NaOH concentration. A needs 10.0 mL; B needs 20.0 mL. Which reasoning is correct?',
        },
        options: [
          {
            zh: 'B 原来的 HCl 浓度是 A 的两倍',
            en: 'B originally has twice the HCl concentration of A',
          },
          {
            zh: 'A 更浓，因为用碱少',
            en: 'A is more concentrated because it needs less base',
          },
          {
            zh: '两瓶都透明，所以浓度相同',
            en: 'Both are clear, so their concentrations match',
          },
        ],
        answer: 0,
        explanation: {
          zh: '相同 c(NaOH) 下，V 加倍表示 NaOH 的 mol 数加倍；1∶1 对应的 HCl 也加倍。原酸样品体积相同，所以 B 浓度加倍。',
          en: 'At the same NaOH concentration, double its volume means double its moles. The 1:1 ratio doubles HCl moles too; equal acid sample volumes mean B has double the concentration.',
        },
      },
      {
        id: 'titration-calculation-q5',
        prompt: {
          zh: '若改用 H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O，0.00400 mol NaOH 恰好中和多少 mol H₂SO₄？',
          en: 'For H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O, how many moles of H₂SO₄ are exactly neutralised by 0.00400 mol NaOH?',
        },
        options: [
          { zh: '0.00400 mol', en: '0.00400 mol' },
          { zh: '0.00800 mol', en: '0.00800 mol' },
          { zh: '0.00200 mol', en: '0.00200 mol' },
        ],
        answer: 2,
        explanation: {
          zh: '每 1 mol H₂SO₄ 需要 2 mol NaOH，所以酸的 mol 数 = 0.00400 ÷ 2 = 0.00200 mol。先看系数，不能把盐酸的 1∶1 机械照搬。',
          en: 'Each mole of H₂SO₄ needs two moles of NaOH, so acid moles = 0.00400 ÷ 2 = 0.00200 mol. Read the coefficients first; do not mechanically copy the HCl 1:1 ratio.',
        },
      },
      {
        id: 'titration-calculation-q6',
        prompt: {
          zh: '在本课 HCl 滴定中，超过恰好中和点还多加了碱，却用偏大的体积计算，酸浓度会怎样？',
          en: 'In this HCl titration, extra base is added beyond exact neutralisation and the larger volume is used. What happens to the calculated acid concentration?',
        },
        options: [
          { zh: '偏低', en: 'Too low' },
          { zh: '偏高', en: 'Too high' },
          {
            zh: '不变，因为溶液仍透明',
            en: 'Unchanged because the solution stays clear',
          },
        ],
        answer: 1,
        explanation: {
          zh: 'c(NaOH) 不变，偏大的 V 让算出的 n(NaOH) 偏大，进而把 n(HCl) 和原酸浓度都算高了。这也是终点附近要慢加、真实滴定要重复的原因。',
          en: 'Fixed c(NaOH) and an overlarge V overestimate NaOH moles, then HCl moles and acid concentration. This is why additions slow near the endpoint and real titrations are repeated.',
        },
      },
    ],
  },
];
