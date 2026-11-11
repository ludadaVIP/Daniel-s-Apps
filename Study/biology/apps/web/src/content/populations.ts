import type { Lesson } from '../schema';
export const populationLessons: Lesson[] = [
  {
    id: 'L065',
    title: {
      zh: '种群是什么？',
      en: 'What is a population?',
    },
    hook: {
      zh: '池塘里有20只同种青蛙，也有蜗牛和水草。调查青蛙种群，与调查所有生命是同一个问题吗？',
      en: 'A pond has 20 frogs of one species, plus snails and plants. Is studying the frog population the same as studying all life?',
    },
    summary: {
      zh: '池塘里有20只同种青蛙，也有蜗牛和水草。调查青蛙种群，与调查所有生命是同一个问题吗？',
      en: 'A pond has 20 frogs of one species, plus snails and plants. Is studying the frog population the same as studying all life?',
    },
    minutes: 25,
    icon: '◌',
    objectives: [
      {
        zh: '用物种、区域与时期界定种群。',
        en: 'Define a population by species, area and time.',
      },
      {
        zh: '用出生、死亡、迁入与迁出核对数量变化。',
        en: 'Account for changes through births, deaths, immigration and emigration.',
      },
    ],
    prediction: [
      {
        zh: '首尾都是20只，期间可能仍有出生和死亡',
        en: 'A start and end count of 20 can conceal births and deaths',
      },
      {
        zh: '首尾都是20只，就一定没有个体更替',
        en: 'A start and end count of 20 proves no turnover',
      },
      {
        zh: '迁入2只与本地出生2只属于同一事件',
        en: 'Two immigrants are the same event as two local births',
      },
    ],
    terms: [
      {
        word: {
          zh: '种群',
          en: 'population',
        },
        meaning: {
          zh: '一定区域与时期的同种生物个体集合。',
          en: 'Individuals of one species in a defined area and period.',
        },
      },
      {
        word: {
          zh: '群落',
          en: 'community',
        },
        meaning: {
          zh: '同一区域不同物种的种群集合。',
          en: 'Populations of different species sharing an area.',
        },
      },
      {
        word: {
          zh: '密度',
          en: 'density',
        },
        meaning: {
          zh: '单位面积或体积内的个体数。',
          en: 'Individuals per unit area or volume.',
        },
      },
      {
        word: {
          zh: '迁入',
          en: 'immigration',
        },
        meaning: {
          zh: '个体进入研究区域。',
          en: 'Movement into the study area.',
        },
      },
      {
        word: {
          zh: '迁出',
          en: 'emigration',
        },
        meaning: {
          zh: '个体离开研究区域。',
          en: 'Movement out of the study area.',
        },
      },
    ],
    questions: [
      {
        id: 'L065-q1',
        skill: 'concept',
        prompt: {
          zh: '种群需要界定什么？',
          en: 'What defines a population?',
        },
        options: [
          {
            zh: '同种、区域与时期',
            en: 'Species, area and time',
          },
          {
            zh: '池塘里全部物种的个体',
            en: 'Individuals of every species in the pond',
          },
          {
            zh: '不同地点所有外形相似的个体',
            en: 'All similar-looking individuals across different areas',
          },
        ],
        correct: 0,
        feedback: {
          zh: '种群由同种、区域、时期共同界定；同色可能跨物种，蛙、蜗牛与水草属于不同种群，不因都在池塘而成为一种群。',
          en: 'Species, area and time define a population. Similar colours can cross species, and pond frogs, snails and plants belong to different populations.',
        },
        revisit: {
          zh: '回看蛙种群边界。',
          en: 'Revisit the frog-population boundary.',
        },
      },
      {
        id: 'L065-q2',
        skill: 'concept',
        prompt: {
          zh: '20只，出生5、死亡3、迁入2、迁出4，末值多少？',
          en: 'Start at 20; births 5, deaths 3, immigration 2, emigration 4. End count?',
        },
        options: [
          {
            zh: '28',
            en: '28',
          },
          {
            zh: '20',
            en: '20',
          },
          {
            zh: '16',
            en: '16',
          },
        ],
        correct: 1,
        feedback: {
          zh: '20+5−3+2−4=20。出生和迁入加上，死亡和迁出减去；得到28漏算了损失，16则把迁入2误当作减少。',
          en: '20+5−3+2−4=20. Add births and immigration, subtract deaths and emigration. Twenty-eight omits losses; sixteen subtracts the two immigrants instead of adding them.',
        },
        revisit: {
          zh: '逐步核对四项账目。',
          en: 'Step through the four entries.',
        },
      },
      {
        id: 'L065-q3',
        skill: 'reasoning',
        prompt: {
          zh: '两次都20只，可以断言没有出生吗？',
          en: 'Two counts are both 20. Can births be ruled out?',
        },
        options: [
          {
            zh: '可以',
            en: 'Yes',
          },
          {
            zh: '证明没有死亡',
            en: 'It proves no deaths',
          },
          {
            zh: '不可以，流入可能抵消流出',
            en: 'No; inputs can balance losses',
          },
        ],
        correct: 2,
        feedback: {
          zh: '首尾相同只说明净变化为零。例子中出生5、迁入2恰好抵消死亡3、迁出4；需要事件记录才能判断有没有出生或死亡。',
          en: 'Equal endpoints mean zero net change. Five births and two immigrants balance three deaths and four emigrants; event records are needed to establish turnover.',
        },
        revisit: {
          zh: '保留模型中间事件再比较首尾。',
          en: 'Retain intermediate events when comparing start and end.',
        },
      },
      {
        id: 'L065-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'density是什么？',
          en: 'What does density mean?',
        },
        options: [
          {
            zh: '单位面积或体积的个体数',
            en: 'Individuals per area or volume',
          },
          {
            zh: '所有物种集合',
            en: 'All species together',
          },
          {
            zh: '迁出事件',
            en: 'Emigration events',
          },
        ],
        correct: 0,
        feedback: {
          zh: '密度以个体数除以面积或体积，例如20只÷10平方米=2只/平方米。只给总数或所有物种清单，都没有给出密度。',
          en: 'Density divides individuals by area or volume: 20 frogs ÷ 10 m² = 2 frogs/m². A total count or species list does not supply density.',
        },
        revisit: {
          zh: '回看2只/平方米的例子。',
          en: 'Revisit the 2 per m² example.',
        },
      },
    ],
    mission: {
      zh: '为虚构池塘写物种、范围、时期和四项数量账；说明相同总数为何仍可能有更替。',
      en: 'Define species, area, time and four flows for the invented pond; explain turnover despite equal totals.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Population demography',
      url: 'https://openstax.org/books/biology-2e/pages/45-1-population-demography',
    },
  },
  {
    id: 'L066',
    title: {
      zh: '环境中的资源限制',
      en: 'Limited resources',
    },
    hook: {
      zh: '更多水一定支持更多植物吗？补水之后，限制可能换成光或矿质元素。',
      en: 'Does more water always support more plants? Light or minerals may become limiting after watering.',
    },
    summary: {
      zh: '更多水一定支持更多植物吗？补水之后，限制可能换成光或矿质元素。',
      en: 'Does more water always support more plants? Light or minerals may become limiting after watering.',
    },
    minutes: 25,
    icon: '◌',
    objectives: [
      {
        zh: '比较资源条件，解释限制因素的改变。',
        en: 'Explain changing limitation by comparing resources.',
      },
      {
        zh: '区分人为容量类比与真实种群预测。',
        en: 'Distinguish an invented capacity analogy from a population forecast.',
      },
    ],
    prediction: [
      {
        zh: '水容量从3升到7，光8、矿质6时，共同容量会变7',
        en: 'Raising water capacity from 3 to 7 with light 8 and minerals 6 gives capacity 7',
      },
      {
        zh: '补水后矿质可能成为新的限制',
        en: 'Minerals may become limiting after watering',
      },
      {
        zh: '三种资源容量相加就是共同容量',
        en: 'Adding the three resource capacities gives the combined capacity',
      },
    ],
    terms: [
      {
        word: {
          zh: '资源',
          en: 'resource',
        },
        meaning: {
          zh: '生命活动使用的环境供给。',
          en: 'An environmental supply used by organisms.',
        },
      },
      {
        word: {
          zh: '限制因素',
          en: 'limiting factor',
        },
        meaning: {
          zh: '当前条件下约束过程的因素。',
          en: 'A factor constraining a process under current conditions.',
        },
      },
      {
        word: {
          zh: '竞争',
          en: 'competition',
        },
        meaning: {
          zh: '共享有限资源时产生的关系。',
          en: 'An interaction over shared limited resources.',
        },
      },
      {
        word: {
          zh: '环境容纳量',
          en: 'carrying capacity',
        },
        meaning: {
          zh: '特定环境在一定时期可持续支持的种群规模。',
          en: 'Population size an environment can sustain over a period.',
        },
      },
      {
        word: {
          zh: '非生物因素',
          en: 'abiotic factor',
        },
        meaning: {
          zh: '水、光、温度等非生命条件。',
          en: 'A non-living condition such as water, light or temperature.',
        },
      },
    ],
    questions: [
      {
        id: 'L066-q1',
        skill: 'concept',
        prompt: {
          zh: '容量3、8、6时，模型容量多少？',
          en: 'For capacities 3, 8, 6, what is the model capacity?',
        },
        options: [
          {
            zh: '17',
            en: '17',
          },
          {
            zh: '3',
            en: '3',
          },
          {
            zh: '8',
            en: '8',
          },
        ],
        correct: 1,
        feedback: {
          zh: '每种资源都必须够用，所以共同容量不能超过最低的3。17把资源容量错误相加，8忽略了水只能支持3个幼苗单位。',
          en: 'All resources must suffice, so combined capacity cannot exceed the lowest, 3. Seventeen adds capacities incorrectly; eight ignores the water limit of three seedling-units.',
        },
        revisit: {
          zh: '回看最低虚线。',
          en: 'See the minimum line.',
        },
      },
      {
        id: 'L066-q2',
        skill: 'concept',
        prompt: {
          zh: '水7、光8、矿质6，谁限制？',
          en: 'Water 7, light 8, minerals 6: which limits?',
        },
        options: [
          {
            zh: '水',
            en: 'Water',
          },
          {
            zh: '光',
            en: 'Light',
          },
          {
            zh: '矿质',
            en: 'Minerals',
          },
        ],
        correct: 2,
        feedback: {
          zh: '补水后水可支持7、光8、矿质6，最低6成为新限制。最初缺水不代表补水后仍由水限制；这是相同单位的容量类比。',
          en: 'After watering, water supports 7, light 8 and minerals 6, making minerals the new limit. The original water limit need not persist. These capacities share invented units.',
        },
        revisit: {
          zh: '切换补水条件。',
          en: 'Choose watered conditions.',
        },
      },
      {
        id: 'L066-q3',
        skill: 'reasoning',
        prompt: {
          zh: '真实补水未增数量，合理下一步？',
          en: 'Real watering gives no increase. What next?',
        },
        options: [
          {
            zh: '检查其他限制与时间滞后',
            en: 'Check other limits and time delays',
          },
          {
            zh: '断言水永远无关',
            en: 'Water never matters',
          },
          {
            zh: '断言植物不需光',
            en: 'Plants need no light',
          },
        ],
        correct: 0,
        feedback: {
          zh: '补水未增数量可能因为其他资源限制，也可能尚未完成萌发或有其他损失。一次结果不能证明水永远无关；比较光、种子到达与观察时间等证据。',
          en: 'No increase after watering may reflect another limit, delayed germination or losses. One result does not make water irrelevant; compare light, seed arrival and observation timing.',
        },
        revisit: {
          zh: '回看未模拟的过程。',
          en: 'Revisit omitted processes.',
        },
      },
      {
        id: 'L066-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'limiting factor是什么？',
          en: 'What is a limiting factor?',
        },
        options: [
          {
            zh: '任何时候供应最少的那一种资源',
            en: 'Whichever resource is supplied in the smallest raw amount',
          },
          {
            zh: '当前约束过程的因素',
            en: 'A factor currently constraining a process',
          },
          {
            zh: '补充越多就永远增加数量的因素',
            en: 'A factor whose addition always increases abundance',
          },
        ],
        correct: 1,
        feedback: {
          zh: '限制因素是在当前条件下约束过程的因素，不一定最少也不永远固定。本容量类比用共同单位的最小值；真实限制还须对照和机制证据。',
          en: 'A limiting factor constrains a process under current conditions and can change. This capacity analogy uses a common-unit minimum; real limits require comparisons and mechanism evidence.',
        },
        revisit: {
          zh: '比较三种情境标签。',
          en: 'Compare all three scenario labels.',
        },
      },
    ],
    mission: {
      zh: '用补水与遮光两次比较解释限制因素怎样换位，并注明模型遗漏。',
      en: 'Explain the switch in limiting resources between watered and shaded scenarios and state an omission.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Population demography',
      url: 'https://openstax.org/books/biology-2e/pages/45-1-population-demography',
    },
  },
  {
    id: 'L067',
    title: {
      zh: '怎样估计植物数量？',
      en: 'Sampling plants',
    },
    hook: {
      zh: '36平方米的草地，抽6格能估计什么？只在路边挑方便的格子会怎样？',
      en: 'What can six quadrats estimate about a 36 m² meadow? What happens if convenient roadside cells are chosen?',
    },
    summary: {
      zh: '36平方米的草地，抽6格能估计什么？只在路边挑方便的格子会怎样？',
      en: 'What can six quadrats estimate about a 36 m² meadow? What happens if convenient roadside cells are chosen?',
    },
    minutes: 25,
    icon: '◌',
    objectives: [
      {
        zh: '使用计数÷抽样面积×总面积计算估计。',
        en: 'Calculate count ÷ sampled area × total area.',
      },
      {
        zh: '比较随机、便利抽样与普查，解释偏差和波动。',
        en: 'Compare random sampling, convenience sampling and a census, explaining bias and variation.',
      },
    ],
    prediction: [
      {
        zh: '路边六格能保证代表整片草地',
        en: 'Six roadside cells are guaranteed to represent the whole meadow',
      },
      {
        zh: '随机抽六格每次都一定得到同一估计',
        en: 'Every random six-cell sample gives the same estimate',
      },
      {
        zh: '路边方案可能偏低，随机方案也会波动',
        en: 'Roadside sampling may underestimate, while random estimates still vary',
      },
    ],
    terms: [
      {
        word: {
          zh: '样方',
          en: 'quadrat',
        },
        meaning: {
          zh: '定义固定调查面积的框格。',
          en: 'A frame defining a fixed survey area.',
        },
      },
      {
        word: {
          zh: '随机抽样',
          en: 'random sampling',
        },
        meaning: {
          zh: '随机选择位置以减少人为挑选偏差。',
          en: 'Random position selection reducing deliberate selection bias.',
        },
      },
      {
        word: {
          zh: '样本',
          en: 'sample',
        },
        meaning: {
          zh: '用来推断更大范围的部分观察。',
          en: 'A subset of observations used to infer a wider area.',
        },
      },
      {
        word: {
          zh: '估计',
          en: 'estimate',
        },
        meaning: {
          zh: '依样本和假设推断的数值。',
          en: 'A value inferred from samples and assumptions.',
        },
      },
      {
        word: {
          zh: '偏差',
          en: 'bias',
        },
        meaning: {
          zh: '方法使结果系统地偏向某方向。',
          en: 'A method systematically favouring one direction of error.',
        },
      },
      {
        word: {
          zh: '普查',
          en: 'census',
        },
        meaning: {
          zh: '完整调查明确范围的全部对象。',
          en: 'A complete count within a defined scope.',
        },
      },
    ],
    questions: [
      {
        id: 'L067-q1',
        skill: 'concept',
        prompt: {
          zh: '6格各1平方米共18株，36平方米估计多少？',
          en: 'Six 1 m² quadrats contain 18 plants. Estimate for 36 m²?',
        },
        options: [
          {
            zh: '18',
            en: '18',
          },
          {
            zh: '108',
            en: '108',
          },
          {
            zh: '3',
            en: '3',
          },
        ],
        correct: 1,
        feedback: {
          zh: '18株÷6平方米=3株/平方米，再乘36平方米得108株。18是样本计数，3是密度；108依赖样本代表性，是估计而非普查值。',
          en: '18 plants ÷ 6 m² = 3 plants/m²; multiplying by 36 m² gives 108. Eighteen is the sample count and three the density. The total is an estimate dependent on representativeness.',
        },
        revisit: {
          zh: '核对密度和总面积两步。',
          en: 'Check density and total-area steps.',
        },
      },
      {
        id: 'L067-q2',
        skill: 'concept',
        prompt: {
          zh: '为什么先随机选位置，再看计数？',
          en: 'Why choose random positions before looking at counts?',
        },
        options: [
          {
            zh: '减少挑密或挑稀的偏差',
            en: 'Reduce dense/sparse selection bias',
          },
          {
            zh: '保证绝对准确',
            en: 'Guarantee exactness',
          },
          {
            zh: '保证所选格子均匀分散在每一行',
            en: 'Guarantee an evenly spaced selection in every row',
          },
        ],
        correct: 0,
        feedback: {
          zh: '先选位置避免看见丰度后专挑密集或稀疏格。随机不保证一次精确，也不改变每格1平方米；它减少位置选择偏差，抽样波动仍存在。',
          en: 'Choosing positions first avoids selecting cells for their abundance. Random selection neither guarantees exactness nor changes the 1 m² area; it reduces selection bias while sampling variation remains.',
        },
        revisit: {
          zh: '比较路边与随机边框。',
          en: 'Compare roadside and random borders.',
        },
      },
      {
        id: 'L067-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一次12格估计比6格更偏，能推出大样本总更差吗？',
          en: 'One 12-cell estimate is worse than one 6-cell estimate. Are larger samples always worse?',
        },
        options: [
          {
            zh: '能',
            en: 'Yes',
          },
          {
            zh: '说明那次6格没有任何抽样误差',
            en: 'The six-cell estimate must have had no sampling error',
          },
          {
            zh: '不能，需比较重复抽样的分布',
            en: 'No; compare repeated-sample distributions',
          },
        ],
        correct: 2,
        feedback: {
          zh: '较大随机样本通常减少波动，但不能保证每次更接近普查。应以同一规则重复抽6格和12格，比较多次估计的误差分布，而非只挑一次结果。',
          en: 'Larger random samples usually reduce variation, without improving every draw. Repeat six- and twelve-cell sampling under the same rules and compare error distributions rather than one chosen pair.',
        },
        revisit: {
          zh: '换多个种子保留结果。',
          en: 'Retain estimates from several seeds.',
        },
      },
      {
        id: 'L067-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'quadrat指什么？',
          en: 'What is a quadrat?',
        },
        options: [
          {
            zh: '样本内植物的总计数',
            en: 'The total plant count in the sample',
          },
          {
            zh: '固定面积调查格',
            en: 'A fixed-area survey frame',
          },
          {
            zh: '估计要外推到的整片研究区',
            en: 'The entire study area being estimated',
          },
        ],
        correct: 1,
        feedback: {
          zh: '样方定义固定调查面积，使计数能换算为密度；它不是样本内的植物总数，也不是用于外推的整片研究区。',
          en: 'A quadrat defines a fixed survey area for converting counts into density. It is neither the number of plants counted nor the entire study area used for extrapolation.',
        },
        revisit: {
          zh: '看每格1平方米标签。',
          en: 'See the 1 m² label.',
        },
      },
    ],
    mission: {
      zh: '记录6格随机位置、逐格计数、抽样面积、密度和估计；与路边方案比较，写一条不确定性。',
      en: 'Record six random positions, counts, sampled area, density and estimate; compare roadside sampling and state an uncertainty.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Population demography',
      url: 'https://openstax.org/books/biology-2e/pages/45-1-population-demography',
    },
  },
  {
    id: 'L068',
    title: {
      zh: '看懂生态数据',
      en: 'Reading ecological data',
    },
    hook: {
      zh: '雨多时记录到的植物也多，这就证明雨是唯一原因了吗？',
      en: 'More plants were recorded on wetter visits. Does that prove rainfall was the only cause?',
    },
    summary: {
      zh: '雨多时记录到的植物也多，这就证明雨是唯一原因了吗？',
      en: 'More plants were recorded on wetter visits. Does that prove rainfall was the only cause?',
    },
    minutes: 25,
    icon: '◌',
    objectives: [
      {
        zh: '保留原始重复记录并核对均值。',
        en: 'Retain replicate records and verify means.',
      },
      {
        zh: '区分趋势、相关与因果，提出补充证据。',
        en: 'Distinguish trend, association and cause, proposing extra evidence.',
      },
    ],
    prediction: [
      {
        zh: '雨量与计数共同变化，只能先支持相关',
        en: 'Rainfall and counts changing together initially support association',
      },
      {
        zh: '均值从3升到4说明每株植物都长高',
        en: 'A mean count rising from 3 to 4 means every plant grew taller',
      },
      {
        zh: '四次记录足以证明雨量是唯一原因',
        en: 'Four visits establish rainfall as the sole cause',
      },
    ],
    terms: [
      {
        word: {
          zh: '重复样本',
          en: 'replicate',
        },
        meaning: {
          zh: '按同一规则取得的独立观察单位。',
          en: 'An independent observational unit under a common procedure.',
        },
      },
      {
        word: {
          zh: '平均数',
          en: 'mean',
        },
        meaning: {
          zh: '数值总和除以记录数量。',
          en: 'The sum divided by the record count.',
        },
      },
      {
        word: {
          zh: '趋势',
          en: 'trend',
        },
        meaning: {
          zh: '数据总体变化的模式。',
          en: 'An overall pattern of change.',
        },
      },
      {
        word: {
          zh: '相关',
          en: 'correlation',
        },
        meaning: {
          zh: '变量共同变化，不单独证明因果。',
          en: 'Variables varying together, not alone proving cause.',
        },
      },
      {
        word: {
          zh: '混杂因素',
          en: 'confounding factor',
        },
        meaning: {
          zh: '与研究因素一起变化并影响解释的因素。',
          en: 'Another varying factor complicating interpretation.',
        },
      },
    ],
    questions: [
      {
        id: 'L068-q1',
        skill: 'concept',
        prompt: {
          zh: '2、3、4平均多少？',
          en: 'What is the mean of 2,3,4?',
        },
        options: [
          {
            zh: '9',
            en: '9',
          },
          {
            zh: '4',
            en: '4',
          },
          {
            zh: '3',
            en: '3',
          },
        ],
        correct: 2,
        feedback: {
          zh: '2+3+4=9，再除以3个样方得均值3株/平方米。9是总计数，4是最大记录；均值不代表每个样方恰有3株。',
          en: '2+3+4=9; divide by three quadrats to get 3 plants/m². Nine is the total and four the maximum. The mean does not mean every quadrat held three plants.',
        },
        revisit: {
          zh: '展开第一次原始数据。',
          en: 'Open visit-one records.',
        },
      },
      {
        id: 'L068-q2',
        skill: 'concept',
        prompt: {
          zh: '3、4、5、4表现什么？',
          en: 'What do 3,4,5,4 show?',
        },
        options: [
          {
            zh: '每次都增加',
            en: 'An increase every time',
          },
          {
            zh: '先升后回落',
            en: 'An increase then decline',
          },
          {
            zh: '完全不变',
            en: 'No change',
          },
        ],
        correct: 1,
        feedback: {
          zh: '3→4→5先升，5→4再回落，所以不能说每次增加。描述整体模式时要保留最后的下降，也不能把计数变化说成每株长高。',
          en: '3→4→5 rises, then 5→4 falls. Retain the final decline instead of claiming an increase every visit; changing counts also do not measure each plant growing taller.',
        },
        revisit: {
          zh: '对比最后两柱。',
          en: 'Compare final bars.',
        },
      },
      {
        id: 'L068-q3',
        skill: 'reasoning',
        prompt: {
          zh: '雨量和计数一起变，合理说法？',
          en: 'Rain and counts vary together. Best claim?',
        },
        options: [
          {
            zh: '有相关，仍需检验其他解释',
            en: 'Association, with alternatives still to test',
          },
          {
            zh: '雨是唯一原因已被证明',
            en: 'Rain is proved the sole cause',
          },
          {
            zh: '每株一定长高',
            en: 'Every plant grew taller',
          },
        ],
        correct: 0,
        feedback: {
          zh: '雨量与计数共同变化支持相关，但温度、季节与探测方式也可能变化。计数不是体长；下一步需比较可比地点并控制或记录其他因素。',
          en: 'Joint change supports association, while temperature, season and detection may also vary. Counts are not lengths. Compare comparable sites and control or record other factors.',
        },
        revisit: {
          zh: '回看观察数据局限。',
          en: 'Revisit observational limits.',
        },
      },
      {
        id: 'L068-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'correlation是？',
          en: 'What is correlation?',
        },
        options: [
          {
            zh: '一个变量引起另一个变化的证明',
            en: 'Proof that one variable causes another to change',
          },
          {
            zh: '变量间相关',
            en: 'Association between variables',
          },
          {
            zh: '只改变一个条件的实验方法',
            en: 'A method changing just one experimental condition',
          },
        ],
        correct: 1,
        feedback: {
          zh: '相关描述变量共同变化。它既不证明一个变量必然导致另一个，也不是通过实验只改变一个因素的方法；本课数据仍是观察性记录。',
          en: 'Correlation describes variables varying together. It neither establishes that one causes the other nor names a one-factor experimental method; these records remain observational.',
        },
        revisit: {
          zh: '比较两种结论。',
          en: 'Compare the two claims.',
        },
      },
    ],
    mission: {
      zh: '选两次访问，列原始数与均值变化，以“支持……但不能单独证明……”写结论。',
      en: 'Choose two visits, record raw values and mean change, then conclude “supports … but does not alone prove …”.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Population demography',
      url: 'https://openstax.org/books/biology-2e/pages/45-1-population-demography',
    },
  },
  {
    id: 'L069',
    title: {
      zh: '遗传与环境的影响',
      en: 'Genes and environment',
    },
    hook: {
      zh: '两株虚构植物的叶片一样长，能推出它们的基因型相同吗？用同一组合换环境试一试。',
      en: 'Two fictional plants have equally long leaves. Must their genotypes match? Try one genotype in different environments.',
    },
    summary: {
      zh: '两株虚构植物的叶片一样长，能推出它们的基因型相同吗？用同一组合换环境试一试。',
      en: 'Two fictional plants have equally long leaves. Must their genotypes match? Try one genotype in different environments.',
    },
    minutes: 25,
    icon: '⌘',
    objectives: [
      {
        zh: '区分基因型与可观察表型。',
        en: 'Distinguish genotype from observable phenotype.',
      },
      {
        zh: '用控制一种因素的比较分离模型中的遗传与环境作用。',
        en: 'Separate model genetic and environmental effects with one-factor comparisons.',
      },
    ],
    prediction: [
      {
        zh: '相同叶长必定意味着相同基因型',
        en: 'Equal leaf lengths require equal genotypes',
      },
      {
        zh: '同一Aa换环境可改变叶长而保留Aa',
        en: 'Changing the environment can change leaf length while retaining Aa',
      },
      {
        zh: '遮护条件会把a直接改写成A',
        en: 'Shelter directly rewrites a into A',
      },
    ],
    terms: [
      {
        word: {
          zh: '遗传',
          en: 'heredity',
        },
        meaning: {
          zh: '亲代向后代传递遗传信息。',
          en: 'Transmission of hereditary information from parents to offspring.',
        },
      },
      {
        word: {
          zh: '基因型',
          en: 'genotype',
        },
        meaning: {
          zh: '所讨论基因位置的等位基因组合。',
          en: 'The allele combination at the loci under discussion.',
        },
      },
      {
        word: {
          zh: '表型',
          en: 'phenotype',
        },
        meaning: {
          zh: '一定条件下可观察或测量的特征。',
          en: 'An observable or measurable characteristic under given conditions.',
        },
      },
      {
        word: {
          zh: '环境',
          en: 'environment',
        },
        meaning: {
          zh: '影响生命活动的条件。',
          en: 'Conditions affecting an organism.',
        },
      },
      {
        word: {
          zh: '控制变量',
          en: 'controlled variable',
        },
        meaning: {
          zh: '比较时保持一致以分离作用的因素。',
          en: 'A factor held consistent to help isolate an effect.',
        },
      },
    ],
    questions: [
      {
        id: 'L069-q1',
        skill: 'concept',
        prompt: {
          zh: 'Aa从暴露到遮护，本模型什么改变？',
          en: 'Aa moves from exposure to shelter. What changes?',
        },
        options: [
          {
            zh: '表型改变，基因型仍Aa',
            en: 'Phenotype changes; genotype stays Aa',
          },
          {
            zh: '环境把a直接变成A',
            en: 'Environment directly changes a to A',
          },
          {
            zh: '基因型与表型必须同时改变',
            en: 'Genotype and phenotype must both change',
          },
        ],
        correct: 0,
        feedback: {
          zh: '固定Aa，由暴露16变为遮护20，表型变而字母组合不变。环境能影响表现，不必先把a突变成A；本规则没有模拟突变。',
          en: 'With Aa fixed, exposure gives 16 and shelter 20: phenotype changes without an allele change. An environmental effect does not require mutation; mutation is not simulated here.',
        },
        revisit: {
          zh: '固定Aa比较两个环境。',
          en: 'Compare both environments with Aa fixed.',
        },
      },
      {
        id: 'L069-q2',
        skill: 'concept',
        prompt: {
          zh: '如何比较基因型作用？',
          en: 'How should genotype effects be compared?',
        },
        options: [
          {
            zh: '同时换环境与基因型',
            en: 'Change environment and genotype together',
          },
          {
            zh: '固定环境比较三种基因型',
            en: 'Compare genotypes in one environment',
          },
          {
            zh: '只选最长个体',
            en: 'Select the longest individual',
          },
        ],
        correct: 1,
        feedback: {
          zh: '固定环境再改变AA/Aa/aa，差异才能归于本模型的基因型规则。同时换环境会混淆两种作用，只选最长个体则没有可比对照。',
          en: 'Hold environment fixed while comparing AA/Aa/aa to isolate genotype under this rule. Changing both factors confounds effects; selecting only the longest individual supplies no comparison.',
        },
        revisit: {
          zh: '固定环境再换AA/Aa/aa。',
          en: 'Fix environment before switching genotype.',
        },
      },
      {
        id: 'L069-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只测得18，能唯一认定AA吗？',
          en: 'Does length 18 uniquely identify AA?',
        },
        options: [
          {
            zh: '能，18是AA基础值',
            en: 'Yes; 18 is the AA baseline',
          },
          {
            zh: '能，只看表型足够',
            en: 'Yes; phenotype is sufficient',
          },
          {
            zh: '不能，暴露AA与遮护aa都得18',
            en: 'No; exposed AA and sheltered aa both yield 18',
          },
        ],
        correct: 2,
        feedback: {
          zh: '暴露AA=18，遮护aa=14+4=18，两条路径得到同一表型。知道AA的基础值不能排除环境贡献，需更多环境或遗传证据。',
          en: 'Exposed AA=18 and sheltered aa=14+4=18. Knowing the AA baseline does not exclude an environmental contribution; environmental or genetic evidence is needed.',
        },
        revisit: {
          zh: '比较AA暴露与aa遮护。',
          en: 'Compare exposed AA and sheltered aa.',
        },
      },
      {
        id: 'L069-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'phenotype指什么？',
          en: 'What is phenotype?',
        },
        options: [
          {
            zh: '可观察或测量的特征',
            en: 'An observable or measured trait',
          },
          {
            zh: '只指等位基因组合',
            en: 'Only an allele combination',
          },
          {
            zh: '只指外部条件',
            en: 'Only external conditions',
          },
        ],
        correct: 0,
        feedback: {
          zh: '叶长是可测表型；AA/Aa/aa是该位置的基因型，遮护或暴露是环境。三者有关联，但不能把表现、组合与条件当作同一名词。',
          en: 'Length is a measurable phenotype; AA/Aa/aa is genotype at this locus and shelter/exposure is environment. They relate to one another but name different things.',
        },
        revisit: {
          zh: '对照叶长与AA标签。',
          en: 'Compare leaf length and the AA label.',
        },
      },
    ],
    mission: {
      zh: '设计同基因型换环境、同环境换基因型两组比较。举两种组合都得18的例子，说明反推局限。',
      en: 'Design comparisons across environments and genotypes. Find two routes to 18 and explain the reverse-inference limit.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Inheritance and variation',
      url: 'https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability',
    },
  },
  {
    id: 'L070',
    title: {
      zh: '染色体与DNA初识',
      en: 'Chromosomes and DNA',
    },
    hook: {
      zh: '细胞核、染色体、DNA、基因是四个独立小盒子，还是相互包含的层次？',
      en: 'Are nucleus, chromosome, DNA and gene independent boxes or related structural levels?',
    },
    summary: {
      zh: '细胞核、染色体、DNA、基因是四个独立小盒子，还是相互包含的层次？',
      en: 'Are nucleus, chromosome, DNA and gene independent boxes or related structural levels?',
    },
    minutes: 25,
    icon: '⌘',
    objectives: [
      {
        zh: '说明细胞核、染色体、DNA与基因的组成关系。',
        en: 'Explain structural relationships among nucleus, chromosome, DNA and gene.',
      },
      {
        zh: '区分DNA序列信息与示意图形状、颜色。',
        en: 'Distinguish sequence information from drawing shape and colour.',
      },
    ],
    prediction: [
      {
        zh: '每条染色体只含一个基因',
        en: 'Each chromosome contains only one gene',
      },
      {
        zh: '染色体在所有时期都是X形',
        en: 'A chromosome is X-shaped at every stage',
      },
      {
        zh: '基因是DNA区段，图的颜色只是标记',
        en: 'A gene is a DNA region; drawing colour is only a marker',
      },
    ],
    terms: [
      {
        word: {
          zh: '染色体',
          en: 'chromosome',
        },
        meaning: {
          zh: '由长DNA分子与相关蛋白质组成的结构。',
          en: 'A long DNA molecule organised with associated proteins.',
        },
      },
      {
        word: {
          zh: 'DNA',
          en: 'DNA',
        },
        meaning: {
          zh: '以碱基序列储存遗传信息的分子。',
          en: 'A molecule storing hereditary information in base sequence.',
        },
      },
      {
        word: {
          zh: '基因',
          en: 'gene',
        },
        meaning: {
          zh: '具有功能作用的DNA区段。',
          en: 'A functional region of DNA.',
        },
      },
      {
        word: {
          zh: '碱基',
          en: 'base',
        },
        meaning: {
          zh: 'DNA中的组分，常以A/T/C/G表示。',
          en: 'A DNA component represented by A/T/C/G.',
        },
      },
      {
        word: {
          zh: '等位基因',
          en: 'allele',
        },
        meaning: {
          zh: '同一基因位置的序列版本。',
          en: 'A sequence version at a gene locus.',
        },
      },
      {
        word: {
          zh: '细胞核',
          en: 'nucleus',
        },
        meaning: {
          zh: '典型真核细胞含大部分DNA的有膜结构。',
          en: 'A membrane-bound structure containing most DNA in typical eukaryotic cells.',
        },
      },
    ],
    questions: [
      {
        id: 'L070-q1',
        skill: 'concept',
        prompt: {
          zh: '基因与DNA怎样联系？',
          en: 'How does a gene relate to DNA?',
        },
        options: [
          {
            zh: '基因是功能DNA区段',
            en: 'A gene is a functional DNA region',
          },
          {
            zh: '每条DNA恰有一个基因',
            en: 'Each DNA has exactly one gene',
          },
          {
            zh: '基因包住整条染色体',
            en: 'A gene encloses a chromosome',
          },
        ],
        correct: 0,
        feedback: {
          zh: '基因是DNA上的功能区段，一条染色体的长DNA可含多个基因和其他区段。不能把“局部”与“整体”倒过来，也不能一条DNA只配一个基因。',
          en: 'A gene is a functional DNA region. A chromosome can contain many genes and other regions; do not reverse part and whole or assume exactly one gene per DNA molecule.',
        },
        revisit: {
          zh: '比较局部高亮与长链。',
          en: 'Compare highlighted region and long strand.',
        },
      },
      {
        id: 'L070-q2',
        skill: 'concept',
        prompt: {
          zh: '常见DNA配对是？',
          en: 'Which pairing is typical for DNA?',
        },
        options: [
          {
            zh: 'A–G、T–C',
            en: 'A–G and T–C',
          },
          {
            zh: 'A–T、C–G',
            en: 'A–T and C–G',
          },
          {
            zh: '每个A都配A',
            en: 'Each A pairs with A',
          },
        ],
        correct: 1,
        feedback: {
          zh: '常见双链DNA中A配T、C配G。两链的互补关系约束对应字母，不要求两个字母相同；画图颜色只是帮助追踪。',
          en: 'In typical double-stranded DNA, A pairs with T and C with G. Complementarity constrains opposite letters rather than making them identical; colours merely help tracing.',
        },
        revisit: {
          zh: '查看局部双链字母。',
          en: 'Inspect double-strand letters.',
        },
      },
      {
        id: 'L070-q3',
        skill: 'reasoning',
        prompt: {
          zh: '无细胞核能否推出无DNA？',
          en: 'Does no nucleus imply no DNA?',
        },
        options: [
          {
            zh: '能，因为DNA只在核内',
            en: 'Yes; DNA exists only in nuclei',
          },
          {
            zh: '能，因为核外都是细胞质',
            en: 'Yes; outside the nucleus is cytoplasm',
          },
          {
            zh: '不能，细菌和核外细胞器是反例',
            en: 'No; bacteria and organelles are counterexamples',
          },
        ],
        correct: 2,
        feedback: {
          zh: '没有细胞核不等于没有DNA：细菌是反例，线粒体与叶绿体也含DNA。核是包围遗传物质的结构，不能把容器当成分子本身。',
          en: 'Bacteria have DNA without nuclei, and mitochondria and chloroplasts also contain DNA. A nucleus encloses genetic material; the container is not the molecule itself.',
        },
        revisit: {
          zh: '回看细菌与线粒体反例。',
          en: 'Revisit bacterial and mitochondrial counterexamples.',
        },
      },
      {
        id: 'L070-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'allele指什么？',
          en: 'What is an allele?',
        },
        options: [
          {
            zh: '同一基因位置的版本',
            en: 'A version at a gene locus',
          },
          {
            zh: '包含许多不同基因的整条染色体',
            en: 'An entire chromosome containing many different genes',
          },
          {
            zh: '每个碱基的统称',
            en: 'A synonym for each base',
          },
        ],
        correct: 0,
        feedback: {
          zh: '等位基因是同一基因位置的序列版本；一个版本通常涉及一段序列，而不是把每个碱基都叫等位基因，也不是整条染色体。',
          en: 'An allele is a sequence version at the same gene locus. It refers to a sequence region, not each individual base or the entire chromosome.',
        },
        revisit: {
          zh: '切换两个序列版本。',
          en: 'Switch the local sequence versions.',
        },
      },
    ],
    mission: {
      zh: '画四层关系，注明基因是DNA区段、染色体还有蛋白质；给出核外DNA或细菌反例。',
      en: 'Draw four levels, noting genes as DNA regions and chromosome proteins; give an example of DNA outside a nucleus.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Inheritance and variation',
      url: 'https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability',
    },
  },
  {
    id: 'L071',
    title: {
      zh: '性状与变异',
      en: 'Traits and variation',
    },
    hook: {
      zh: '虚构叶虫的体长和完整斑点数都不同，为什么不能用完全相同的分组方式？',
      en: 'Fictional leafbugs vary in length and whole-spot count. Why should their graphs use different grouping rules?',
    },
    summary: {
      zh: '虚构叶虫的体长和完整斑点数都不同，为什么不能用完全相同的分组方式？',
      en: 'Fictional leafbugs vary in length and whole-spot count. Why should their graphs use different grouping rules?',
    },
    minutes: 25,
    icon: '⌘',
    objectives: [
      {
        zh: '区分连续测量、离散计数与类别。',
        en: 'Distinguish continuous measurements, discrete counts and categories.',
      },
      {
        zh: '用不重叠分组描述变异，避免从分布武断推因。',
        en: 'Describe variation with non-overlapping bins without assuming causes.',
      },
    ],
    prediction: [
      {
        zh: '整数记录的长度仍可来自连续测量',
        en: 'Lengths recorded as integers can still be continuous measurements',
      },
      {
        zh: '斑点数与体长都能取任意小数',
        en: 'Whole-spot counts and length both allow arbitrary fractions',
      },
      {
        zh: '连续体长分布能独自证明差异全由环境造成',
        en: 'A continuous length distribution alone proves all differences are environmental',
      },
    ],
    terms: [
      {
        word: {
          zh: '性状',
          en: 'trait',
        },
        meaning: {
          zh: '生物可描述的特征。',
          en: 'A describable characteristic.',
        },
      },
      {
        word: {
          zh: '变异',
          en: 'variation',
        },
        meaning: {
          zh: '个体间的特征差异。',
          en: 'Differences among individuals.',
        },
      },
      {
        word: {
          zh: '连续变异',
          en: 'continuous variation',
        },
        meaning: {
          zh: '特征可取许多中间值。',
          en: 'A trait can have many intermediate values.',
        },
      },
      {
        word: {
          zh: '离散',
          en: 'discrete',
        },
        meaning: {
          zh: '分开的数值或类别，没有任意中间值。',
          en: 'Separate values or categories without arbitrary intermediate values.',
        },
      },
      {
        word: {
          zh: '频数',
          en: 'frequency',
        },
        meaning: {
          zh: '某类别或区间内的记录数。',
          en: 'Number of records within a category or interval.',
        },
      },
    ],
    questions: [
      {
        id: 'L071-q1',
        skill: 'concept',
        prompt: {
          zh: '哪种适合看作连续测量？',
          en: 'Which is a continuous measurement?',
        },
        options: [
          {
            zh: '完整斑点数',
            en: 'Whole spots',
          },
          {
            zh: '体长',
            en: 'Body length',
          },
          {
            zh: '样方编号',
            en: 'Quadrat ID',
          },
        ],
        correct: 1,
        feedback: {
          zh: '体长可取12与13之间的值，记录时取整也仍是连续测量。完整斑点只能整数计数，样方编号只是标识，不能拿编号大小当生物性状。',
          en: 'Length allows values between 12 and 13 even when rounded. Whole spots are integer counts, while a quadrat ID is a label rather than a measured biological trait.',
        },
        revisit: {
          zh: '对比两种轴。',
          en: 'Compare the two axes.',
        },
      },
      {
        id: 'L071-q2',
        skill: 'concept',
        prompt: {
          zh: '18进入哪组？',
          en: 'Which bin contains 18?',
        },
        options: [
          {
            zh: '12–<15',
            en: '12–<15',
          },
          {
            zh: '15–<18',
            en: '15–<18',
          },
          {
            zh: '18–<21',
            en: '18–<21',
          },
        ],
        correct: 2,
        feedback: {
          zh: '15–<18排除18，18–<21包含18，所以归第三组。区间须不重叠，每条记录只计一次，否则总频数会超过样本量12。',
          en: '15–<18 excludes 18, while 18–<21 includes it. Non-overlapping bins count each record once; double-counting would inflate the total beyond twelve.',
        },
        revisit: {
          zh: '核对18原始值。',
          en: 'Check the raw value 18.',
        },
      },
      {
        id: 'L071-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一张连续体长图能证明环境是唯一原因吗？',
          en: 'Can one continuous length graph prove environment the only cause?',
        },
        options: [
          {
            zh: '不能，还需遗传与环境证据',
            en: 'No; genetic and condition evidence is needed',
          },
          {
            zh: '能，连续都只受环境影响',
            en: 'Yes; continuous traits are purely environmental',
          },
          {
            zh: '能，只要图平滑',
            en: 'Yes; if the plot is smooth',
          },
        ],
        correct: 0,
        feedback: {
          zh: '连续分布描述表型差异，不能独自分离遗传、环境和测量误差。平滑与否也不是因果检验；应比较遗传背景和受控环境等证据。',
          en: 'A continuous distribution describes phenotypic differences, not the separate effects of genes, environment and measurement error. Smoothness is not a causal test; compare genetic backgrounds and controlled conditions.',
        },
        revisit: {
          zh: '回看原始记录与未测因素。',
          en: 'Revisit raw records and unmeasured factors.',
        },
      },
      {
        id: 'L071-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'frequency表示什么？',
          en: 'What does frequency mean?',
        },
        options: [
          {
            zh: '某组占总样本的比例',
            en: 'The fraction of the sample within a group',
          },
          {
            zh: '每组记录数',
            en: 'Records in a group',
          },
          {
            zh: '该组个体的平均体长',
            en: 'Mean body length of individuals in a group',
          },
        ],
        correct: 1,
        feedback: {
          zh: '频数是落入一组的记录数，本图三组频数之和为12。它不是体长平均值，也不是记录数占总样本的比例；后者是相对频率。',
          en: 'Frequency is the count in a group, with all groups summing to twelve. It is neither mean length nor the fraction of the sample in a group; that fraction is relative frequency.',
        },
        revisit: {
          zh: '对应柱高与原始值。',
          en: 'Match heights to records.',
        },
      },
    ],
    mission: {
      zh: '选一组原始值，写不重叠分组并核对总频数12；提出一个仍不能从图判断的原因。',
      en: 'Group one raw dataset without overlap, check total frequency twelve and identify a cause not established by the graph.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Inheritance and variation',
      url: 'https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability',
    },
  },
  {
    id: 'L072',
    title: {
      zh: '从亲代到子代',
      en: 'Inheritance basics',
    },
    hook: {
      zh: '两个亲代都是Aa，子代必定一样吗？四个可能格是四个孩子的顺序表吗？',
      en: 'Both parents are Aa. Must offspring match? Are four possibility boxes a birth-order schedule?',
    },
    summary: {
      zh: '两个亲代都是Aa，子代必定一样吗？四个可能格是四个孩子的顺序表吗？',
      en: 'Both parents are Aa. Must offspring match? Are four possibility boxes a birth-order schedule?',
    },
    minutes: 25,
    icon: '⌘',
    objectives: [
      {
        zh: '追踪每个亲代的一个等位基因进入子代。',
        en: 'Trace one allele from each parent into offspring.',
      },
      {
        zh: '区分可能组合、概率与保证发生的结果。',
        en: 'Distinguish possibilities, probability and guaranteed outcomes.',
      },
    ],
    prediction: [
      {
        zh: 'Aa与Aa的每个子代都必定为Aa',
        en: 'Every offspring of Aa and Aa must be Aa',
      },
      {
        zh: '四格表示可能路线，不保证四个子代各占一格',
        en: 'Four boxes show possible routes, not one guaranteed outcome per child',
      },
      {
        zh: '第一个子代为aa会用完下一次aa的机会',
        en: 'One aa offspring uses up the chance of aa next time',
      },
    ],
    terms: [
      {
        word: {
          zh: '亲代',
          en: 'parent generation',
        },
        meaning: {
          zh: '传递遗传信息的上一代个体。',
          en: 'Individuals contributing hereditary information.',
        },
      },
      {
        word: {
          zh: '子代',
          en: 'offspring',
        },
        meaning: {
          zh: '亲代产生的下一代。',
          en: 'Next-generation individuals produced by parents.',
        },
      },
      {
        word: {
          zh: '配子',
          en: 'gamete',
        },
        meaning: {
          zh: '此二倍体模型中携带每对一个版本的生殖细胞。',
          en: 'A reproductive cell carrying one allele per pair in this diploid model.',
        },
      },
      {
        word: {
          zh: '受精',
          en: 'fertilisation',
        },
        meaning: {
          zh: '配子融合以组合遗传信息。',
          en: 'Gamete fusion combining hereditary information.',
        },
      },
      {
        word: {
          zh: '概率',
          en: 'probability',
        },
        meaning: {
          zh: '给定条件下结果发生的可能程度。',
          en: 'Likelihood under stated conditions.',
        },
      },
      {
        word: {
          zh: '等位基因',
          en: 'allele',
        },
        meaning: {
          zh: '某基因位置的序列版本。',
          en: 'A sequence version at a gene locus.',
        },
      },
    ],
    questions: [
      {
        id: 'L072-q1',
        skill: 'concept',
        prompt: {
          zh: '本模型Aa亲代的一个配子得到什么？',
          en: 'What does one gamete from Aa receive here?',
        },
        options: [
          {
            zh: 'A或a一个',
            en: 'One of A or a',
          },
          {
            zh: '整个Aa对',
            en: 'The whole Aa pair',
          },
          {
            zh: '总是A',
            en: 'Always A',
          },
        ],
        correct: 0,
        feedback: {
          zh: '此二倍体单位置模型中，Aa形成的每个配子只带A或a，机会各半。受精才重新组合两方版本，不是把整对Aa都放进每个配子。',
          en: 'At this diploid locus, each Aa gamete carries A or a, each with probability one half. Fertilisation combines parental versions; a gamete does not carry the whole Aa pair.',
        },
        revisit: {
          zh: '查看亲代到配子箭头。',
          en: 'Follow parent-to-gamete arrows.',
        },
      },
      {
        id: 'L072-q2',
        skill: 'concept',
        prompt: {
          zh: 'AA×aa的组合是？',
          en: 'What combination results from AA×aa?',
        },
        options: [
          {
            zh: '只AA',
            en: 'Only AA',
          },
          {
            zh: '只aa',
            en: 'Only aa',
          },
          {
            zh: '只Aa',
            en: 'Only Aa',
          },
        ],
        correct: 2,
        feedback: {
          zh: 'AA只能提供A，aa只能提供a，所以每条路线均为Aa。子代同时保留两方贡献，不能只复制其中一个亲代的整个组合。',
          en: 'AA supplies only A and aa only a, so every route gives Aa. Offspring combine both contributions rather than copying one parental genotype wholesale.',
        },
        revisit: {
          zh: '选择AA与aa并看四格。',
          en: 'Set AA and aa and inspect all boxes.',
        },
      },
      {
        id: 'L072-q3',
        skill: 'reasoning',
        prompt: {
          zh: '四格保证四个子代恰有一个aa吗？',
          en: 'Do four boxes guarantee exactly one aa in four offspring?',
        },
        options: [
          {
            zh: '保证，格子各用一次',
            en: 'Yes; each box is used once',
          },
          {
            zh: '不保证，格子表示可能路线',
            en: 'No; boxes are possible routes',
          },
          {
            zh: 'aa只可能第四个出生',
            en: 'aa must be born fourth',
          },
        ],
        correct: 1,
        feedback: {
          zh: '在Aa×Aa且配子等机会、随机结合的前提下，每次aa概率为1/4。四格不是依次用完的名额：前次结果不改变下一次机会，小家庭不保证精确比例。',
          en: 'With equally likely gametes and random union in Aa×Aa, aa has probability 1/4 each time. Boxes are not slots used in sequence; prior outcomes do not alter the next chance or force a small-family ratio.',
        },
        revisit: {
          zh: '回看四条来源与随机结合条件。',
          en: 'Revisit origins and random-union assumptions.',
        },
      },
      {
        id: 'L072-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'gamete是什么？',
          en: 'What is a gamete?',
        },
        options: [
          {
            zh: '配子',
            en: 'A reproductive cell',
          },
          {
            zh: '带整对等位基因的所有体细胞',
            en: 'Any somatic cell with a pair',
          },
          {
            zh: '受精后子代整体',
            en: 'The complete offspring after fertilisation',
          },
        ],
        correct: 0,
        feedback: {
          zh: '配子是参与受精的生殖细胞，在本模型该位置只有一个等位基因。带一对的典型体细胞和受精后的完整子代，都不是配子的同义词。',
          en: 'A gamete is a reproductive cell participating in fertilisation, carrying one allele at this locus. A typical paired somatic cell and the whole offspring are not synonyms for gamete.',
        },
        revisit: {
          zh: '查看配子框。',
          en: 'Inspect gamete boxes.',
        },
      },
    ],
    mission: {
      zh: '给虚构物种选亲代，列可能组合与来源，写一条关于环境或复杂性状的预测边界。',
      en: 'Choose fictional parents, list combinations and origins, and state a prediction limit involving environment or complex traits.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Inheritance and variation',
      url: 'https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability',
    },
  },
];
