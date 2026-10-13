import { t, q, term, type Lesson } from '../schema';
const revisit = t(
  '回看模型中的记录、比较与局限。',
  'Revisit the records, comparisons and limits in the model.',
);
const science = {
  title: 'OpenStax Biology 2e · The science of biology',
  url: 'https://openstax.org/books/biology-2e/pages/1-1-the-science-of-biology',
};
export const inquiryLessons: Lesson[] = [
  {
    id: 'L021',
    title: t('观察与猜想有什么不同？', 'Observation or inference?'),
    icon: '⌕',
    minutes: 15,
    summary: t(
      '“幼苗高了7厘米”和“它更健康了”，一样吗？',
      'Is “7 cm taller” the same as “healthier”?',
    ),
    hook: t(
      '窗台幼苗一周长高了，叶片却变浅。小林说：“长得高，一定更健康！”哪些是看见或量到的，哪些是解释？先把侦探笔记分开。',
      'A windowsill seedling grows taller in a week, but its leaves look paler. Lin says, “Taller must mean healthier!” Which statements are observations, and which are interpretations? Sort the detective notes.',
    ),
    reference: science,
    objectives: [
      t(
        '区分带有时间和方法的观察与可检验的解释。',
        'Distinguish observations with time and method from testable interpretations.',
      ),
      t(
        '用现象提出问题，不把一个线索当成确定原因。',
        'Turn a phenomenon into a question without treating one clue as a definite cause.',
      ),
    ],
    prediction: [
      t('量到高度，就已经证明健康程度', 'Measuring height proves health'),
      t(
        '先记录现象，再检验可能解释',
        'Record the phenomenon, then test possible explanations',
      ),
      t('猜想没有用，应当只抄数字', 'Ideas are useless; only copy numbers'),
    ],
    terms: [
      term(
        '观察',
        'observation',
        '用感官或工具取得并记录的信息。',
        'Information obtained and recorded with senses or instruments.',
      ),
      term(
        '推断',
        'inference',
        '结合证据与已有知识作出的解释或判断。',
        'An interpretation or judgement using evidence and prior knowledge.',
      ),
      term(
        '假说',
        'hypothesis',
        '可以用进一步证据检验的可能解释。',
        'A possible explanation that further evidence can test.',
      ),
      term(
        '预测',
        'prediction',
        '在某个解释成立时，预计可观察到什么。',
        'An expected observation if an explanation holds.',
      ),
    ],
    questions: [
      q(
        'L021-q1',
        'concept',
        t(
          '哪一句是带测量方法的观察？',
          'Which is an observation with a measurement method?',
        ),
        [
          t(
            '同一尺子从土面量到茎顶，第7天为11 cm',
            'The same ruler measured soil to stem tip: 11 cm on day 7',
          ),
          t('它想快点找到太阳', 'It wants to find the sun quickly'),
          t(
            '它一定比矮苗更健康',
            'It must be healthier than shorter seedlings',
          ),
        ],
        0,
        t(
          '记录说清了工具、起终点、时间和读数。健康与动机不是尺子直接测到的。',
          'The record names a tool, endpoints, time and reading. A ruler does not directly measure health or motives.',
        ),
        revisit,
      ),
      q(
        'L021-q2',
        'concept',
        t(
          '“低光可能使茎伸长”属于什么？',
          'What is “Low light may cause stem elongation”?',
        ),
        [
          t('无需检验的事实', 'A fact needing no test'),
          t('可检验的可能解释', 'A possible explanation to test'),
          t('尺子直接读出的数', 'A number read directly from a ruler'),
        ],
        1,
        t(
          '这是可能机制，需要公平比较等进一步证据。带有“可能”也要说出怎样检验。',
          'It proposes a mechanism needing further evidence such as a fair comparison. “May” should come with a way to test the idea.',
        ),
        revisit,
      ),
      q(
        'L021-q3',
        'reasoning',
        t(
          '一张淡色叶片照片能证明缺光吗？',
          'Does one photograph of pale leaves prove low light?',
        ),
        [
          t('能，叶色只受光影响', 'Yes; only light affects colour'),
          t('不能，所以照片毫无价值', 'No, so the photograph has no value'),
          t(
            '不能单独证明；记录光、水等条件，再比较',
            'Not alone; record light, water and other conditions, then compare',
          ),
        ],
        2,
        t(
          '照片提供叶色线索，但水分、营养、测光与拍摄条件等也需核对。观察有价值，原因仍可不确定。',
          'The photograph offers a colour clue. Water, nutrients, light records and photographing conditions also need checking. Useful observations can leave causes uncertain.',
        ),
        revisit,
      ),
      q(
        'L021-q4',
        'vocabulary',
        t(
          '“可以检验的可能解释”对应哪个词？',
          'Which term means a testable possible explanation?',
        ),
        [
          t('habitat · 栖息地', 'habitat'),
          t('hypothesis · 假说', 'hypothesis'),
          t('consumer · 消费者', 'consumer'),
        ],
        1,
        t(
          'Hypothesis 是假说；它不是随口猜，也不是永远正确的答案。',
          'A hypothesis is a testable explanation, neither an unsupported guess nor an answer guaranteed forever.',
        ),
        revisit,
      ),
    ],
    mission: t(
      '观察一株现有植物或课程图，写一句带时间的记录，再写一个“可能…还需要…”的解释。',
      'Observe an existing plant or the lesson image. Write a timed observation and an explanation using “may … we still need …”.',
    ),
  },
  {
    id: 'L022',
    title: t('怎样公平地做比较？', 'What makes a fair test?'),
    icon: '⚖',
    minutes: 20,
    summary: t(
      '比较光照时，为什么水和温度也要检查？',
      'Why check water and temperature when comparing light?',
    ),
    hook: t(
      'A组幼苗光较弱、浇水少；B组光较强、浇水多，品种与温度也不同。结果不同能归因于光吗？修理这份混乱的试验方案。',
      'Group A gets weaker light and less water; B gets stronger light and more water, with different varieties and temperatures too. Can different results be attributed to light? Repair this tangled test plan.',
    ),
    reference: {
      title: 'Science Buddies · Variables for beginners',
      url: 'https://www.sciencebuddies.org/science-fair-projects/science-fair/doing-a-fair-test-variables-for-beginners',
    },
    objectives: [
      t(
        '指出改变的光照、测量的高度增量和需要控制的其他因素。',
        'Identify changed light, measured height gain and other factors to control.',
      ),
      t(
        '修正混杂因素，并说明重复和一致测量为何重要。',
        'Repair confounding factors and explain replication and consistent measurement.',
      ),
    ],
    prediction: [
      t('结果差别全是光造成的', 'Light caused the whole difference'),
      t(
        '一起改更多因素，更容易找到原因',
        'Changing more factors together makes causes clearer',
      ),
      t(
        '先让其他重要条件尽量一致',
        'First make other important conditions as similar as possible',
      ),
    ],
    terms: [
      term(
        '自变量',
        'independent variable',
        '本次试验有意改变的目标因素。',
        'The target factor deliberately changed in a test.',
      ),
      term(
        '因变量',
        'dependent variable',
        '试验中测量的结果。',
        'The measured outcome of a test.',
      ),
      term(
        '控制变量',
        'controlled variable',
        '为了比较而保持尽量一致的条件。',
        'A condition kept as similar as possible for comparison.',
      ),
      term(
        '混杂因素',
        'confounding factor',
        '也随组别改变、使目标原因难以分离的因素。',
        'Another factor changing with groups that makes the target cause hard to isolate.',
      ),
    ],
    questions: [
      q(
        'L022-q1',
        'concept',
        t(
          '比较两种光照强度对幼苗高度增量的影响，目标改变什么？',
          'In a test of light intensity and seedling height gain, what is deliberately changed?',
        ),
        [
          t('每组使用的植物品种', 'Plant variety in each group'),
          t('光照强度', 'Light intensity'),
          t('测量的厘米单位', 'The centimetre unit'),
        ],
        1,
        t(
          '光照强度是本次自变量。照射时长应一致；高度增量是测量结果，不能预先规定。',
          'Light intensity is the independent variable here. Keep exposure duration consistent; height gain is measured, not prescribed.',
        ),
        revisit,
      ),
      q(
        'L022-q2',
        'concept',
        t(
          '光和浇水量都随组别改变，主要问题是什么？',
          'What is the main problem if both light and watering differ by group?',
        ),
        [
          t(
            '两个因素混在一起，难以分离光的影响',
            'Their effects are mixed, making the light effect hard to isolate',
          ),
          t('组别名字必须更好听', 'Group names must be nicer'),
          t('只要量尺够长就没问题', 'A long enough ruler fixes it'),
        ],
        0,
        t(
          '水也能影响植物。两组都不同，不能仅凭结果把原因全归给光。',
          'Water can also affect plants. When it changes with light, results cannot be attributed wholly to light.',
        ),
        revisit,
      ),
      q(
        'L022-q3',
        'reasoning',
        t(
          '为什么每组用多株相近幼苗，并随机分组？',
          'Why use several similar seedlings per group and assign them randomly?',
        ),
        [
          t('保证每株一定长成相同高度', 'Guarantee equal final heights'),
          t('完全消除所有测量误差', 'Remove every measurement error'),
          t(
            '减少单株偶然差异与挑选偏差的影响',
            'Reduce the influence of individual chance differences and selection bias',
          ),
        ],
        2,
        t(
          '重复让我们看见差异；随机分组减少刻意把强苗放一组的偏差。都不能保证完美，3株只是小样本示例。',
          'Replication reveals variation; random assignment reduces bias from selecting stronger seedlings for one group. Neither guarantees perfection; three plants are a small illustrative sample.',
        ),
        revisit,
      ),
      q(
        'L022-q4',
        'vocabulary',
        t(
          '为隔离光的影响而保持一致的条件叫什么？',
          'What do we call a condition kept similar to isolate light’s effect?',
        ),
        [
          t('controlled variable · 控制变量', 'controlled variable'),
          t('food web · 食物网', 'food web'),
          t('population · 种群', 'population'),
        ],
        0,
        t(
          'Controlled variable 是控制变量。它不是“任何条件都不能变”，而是其他重要因素尽量一致。',
          'A controlled variable is held similar while the target factor changes.',
        ),
        revisit,
      ),
    ],
    mission: t(
      '只设计一份光照与幼苗比较方案：改变什么、测什么、保持什么、用几株、何时测。无需让真实植物缺光。',
      'Design a light–seedling comparison: what changes, what is measured, what stays similar, how many plants and when to measure. No real light deprivation is needed.',
    ),
  },
  {
    id: 'L023',
    title: t('把发现画成图表', 'Tell a story with data'),
    icon: '▥',
    minutes: 20,
    summary: t(
      '六株幼苗，平均数藏起了什么？',
      'What can an average hide about six seedlings?',
    ),
    hook: t(
      '同样比较7天，弱光组高度增量为6、7、8 cm，较强光组为3、4、5 cm。只报7和4，会丢掉什么？把原始记录变成图，再看看每株的差异。',
      'Over the same seven days, height gains are 6, 7 and 8 cm under weaker light, and 3, 4 and 5 cm under stronger light. What is lost if we report only 7 and 4? Turn raw records into a graph and inspect individual differences.',
    ),
    reference: science,
    objectives: [
      t(
        '按相同单位和零起点刻度读取高度增量图。',
        'Read height-gain data with common units and a zero baseline.',
      ),
      t(
        '计算组平均并保留个体记录，指出图未测量的东西。',
        'Calculate a group mean while retaining individual records and identify unmeasured outcomes.',
      ),
    ],
    prediction: [
      t(
        '平均7 cm，表示三株都增加7 cm',
        'A 7 cm mean means all three gained 7 cm',
      ),
      t(
        '平均可概括，但要保留每株记录',
        'A mean summarises, but individual records matter',
      ),
      t('柱越高，植物一定越健康', 'A taller bar means a healthier plant'),
    ],
    terms: [
      term(
        '数据',
        'data',
        '按方法收集并记录的信息。',
        'Information collected and recorded using a method.',
      ),
      term(
        '平均数',
        'mean',
        '这些数相加，再除以数的个数。',
        'The sum of the values divided by the number of values.',
      ),
      term(
        '单位',
        'unit',
        '说明数字量的是什么和量的尺度。',
        'A label identifying what a number measures and its scale.',
      ),
      term(
        '变异',
        'variation',
        '记录或个体之间的差异。',
        'Differences among records or individuals.',
      ),
    ],
    questions: [
      q(
        'L023-q1',
        'concept',
        t(
          '弱光组6、7、8 cm的平均高度增量是多少？',
          'What is the mean height gain for 6, 7 and 8 cm?',
        ),
        [t('21 cm', '21 cm'), t('7 cm', '7 cm'), t('3 cm', '3 cm')],
        1,
        t(
          '(6+7+8)÷3=7 cm。21是合计，不是平均；单位仍为cm。',
          '(6+7+8)÷3=7 cm. 21 is the sum, not the mean; the unit remains cm.',
        ),
        revisit,
      ),
      q(
        'L023-q2',
        'concept',
        t('图的纵轴测量什么？', 'What does the vertical axis measure?'),
        [
          t('7天内的高度增量，单位cm', 'Height gain over seven days, in cm'),
          t('植物健康分数', 'A plant-health score'),
          t('叶片的总能量', 'Total leaf energy'),
        ],
        0,
        t(
          '高度增量是末次高度减初始高度。这个图没有测健康、质量或光合作用速率。',
          'Height gain is final minus initial height. This graph measures neither health, mass nor photosynthesis rate.',
        ),
        revisit,
      ),
      q(
        'L023-q3',
        'reasoning',
        t(
          '只留下每组平均柱，会丢掉什么重要线索？',
          'What important clue is lost if only group-mean bars remain?',
        ),
        [
          t('图表颜色一定不够好看', 'The colours will be unattractive'),
          t('所有数据必须作废', 'All data become invalid'),
          t(
            '每株的差异和原始测量',
            'Variation among seedlings and their raw measurements',
          ),
        ],
        2,
        t(
          '平均是一种概括，不是每株的实际值。保留原始记录能检查差异、读数和样本数。',
          'A mean summarises; it is not every plant’s actual value. Raw records let us examine variation, readings and sample size.',
        ),
        revisit,
      ),
      q(
        'L023-q4',
        'vocabulary',
        t(
          '“把数相加后除以个数”得到什么？',
          'What is the sum divided by the number of values?',
        ),
        [
          t('mean · 平均数', 'mean'),
          t('membrane · 膜', 'membrane'),
          t('habitat · 栖息地', 'habitat'),
        ],
        0,
        t(
          'Mean 是平均数。它应和单位、样本数、个体差异一起解释。',
          'The mean should be interpreted with units, sample size and individual variation.',
        ),
        revisit,
      ),
    ],
    mission: t(
      '在纸上画两组平均柱并标0、cm和7天；旁边保留六个原始值。写一句图能说、图不能说的事。',
      'Draw two mean bars on paper, with 0, cm and seven days labelled. Keep all six raw values beside them. State one thing the graph says and one it does not.',
    ),
  },
  {
    id: 'L024',
    title: t('证据能支持什么结论？', 'Evidence and explanations'),
    icon: '∴',
    minutes: 20,
    summary: t(
      '弱光组更高，能说“弱光更好”吗？',
      'If weaker-light seedlings are taller, is weaker light better?',
    ),
    hook: t(
      '只看高度，小林想宣布“弱光让植物长得更好”。再打开叶片颜色记录，解释还站得住吗？练习让结论跟着证据改变，而不跟着愿望走。',
      'From height alone, Lin wants to declare “Weaker light grows better plants.” Open the leaf-colour records. Does the explanation still hold? Let conclusions follow evidence rather than wishes.',
    ),
    reference: {
      title: 'RHS · Grow to eat · Seedling light and leggy growth',
      url: 'https://www.rhs.org.uk/get-involved/grow-with-it/pdfs/grow-to-eat-zine',
    },
    objectives: [
      t(
        '用主张、证据、推理写有范围的解释。',
        'Write a scoped claim with evidence and reasoning.',
      ),
      t(
        '用新线索修正“更高等于更健康”，提出下一次测量。',
        'Revise “taller equals healthier” using new clues and propose a further measurement.',
      ),
    ],
    prediction: [
      t(
        '较高一定更健康，不必看其他记录',
        'Taller always means healthier; other records are unnecessary',
      ),
      t('数字不合想法就删除', 'Delete values that disagree with an idea'),
      t(
        '区分高度与健康，再核对更多线索',
        'Distinguish height from health, then inspect further clues',
      ),
    ],
    terms: [
      term(
        '主张',
        'claim',
        '依据证据提出、说明适用范围的判断。',
        'A judgement based on evidence with its scope stated.',
      ),
      term(
        '证据',
        'evidence',
        '用来检验或支持主张的相关记录。',
        'Relevant records used to test or support a claim.',
      ),
      term(
        '推理',
        'reasoning',
        '说明证据为什么与主张有关。',
        'An explanation of why evidence relates to a claim.',
      ),
      term(
        '局限',
        'limitation',
        '方法或记录尚不能回答的部分。',
        'Something the method or records cannot yet answer.',
      ),
    ],
    questions: [
      q(
        'L024-q1',
        'concept',
        t(
          '这六株虚拟幼苗的高度记录支持哪句？',
          'Which statement is supported by the height records of these six virtual seedlings?',
        ),
        [
          t(
            '所有植物在弱光下都更健康',
            'All plants are healthier in weaker light',
          ),
          t(
            '本例7天内，弱光组平均高度增量较大',
            'In this example over seven days, the weaker-light group had greater mean height gain',
          ),
          t(
            '弱光组一定制造了更多糖',
            'The weaker-light group must have made more sugar',
          ),
        ],
        1,
        t(
          '结论限定了样本、时间和测量指标。高度不直接测健康或制糖。',
          'The conclusion names the sample, period and measured outcome. Height does not directly measure health or sugar production.',
        ),
        revisit,
      ),
      q(
        'L024-q2',
        'concept',
        t(
          '弱光组叶片较浅的新记录，怎样影响“更高就是更健康”？',
          'How do paler leaf records affect “taller means healthier”?',
        ),
        [
          t(
            '提示高度不能单独代表整体状态',
            'They suggest height alone cannot represent overall condition',
          ),
          t(
            '证明所有淡色叶都一定缺光',
            'They prove every pale leaf lacks light',
          ),
          t(
            '没有用，颜色不能以cm记录',
            'They are useless because colour is not recorded in cm',
          ),
        ],
        0,
        t(
          '定性记录也有价值。弱光可使部分幼苗伸长、颜色变浅，但叶色还有其他原因，需要结合比较条件。',
          'Qualitative records are useful too. Low light can make some seedlings elongated and pale, but colour has other causes; consider comparison conditions.',
        ),
        revisit,
      ),
      q(
        'L024-q3',
        'reasoning',
        t(
          '怎样进一步检查“弱光组更健康”？',
          'How could we investigate “The weaker-light group is healthier”?',
        ),
        [
          t(
            '只挑最高的一株当全部证据',
            'Use only the tallest plant as all evidence',
          ),
          t('把原数字改成自己喜欢的', 'Change values to preferred numbers'),
          t(
            '定义健康指标，增加重复并继续记录叶色、叶数或存活',
            'Define health indicators, add replicates and keep records such as leaf colour, leaf number or survival',
          ),
        ],
        2,
        t(
          '先说清“更健康”指什么，再用相关指标、多株和更长观察检验；任何一个指标也未必代表所有状态。',
          'Define what “healthier” means, then test it using relevant indicators, multiple plants and longer observation. One indicator may still not capture every aspect.',
        ),
        revisit,
      ),
      q(
        'L024-q4',
        'vocabulary',
        t(
          '“这组证据还不能回答什么”对应哪个词？',
          'Which term describes what the evidence cannot yet answer?',
        ),
        [
          t('producer · 生产者', 'producer'),
          t('limitation · 局限', 'limitation'),
          t('capsid · 衣壳', 'capsid'),
        ],
        1,
        t(
          'Limitation 是局限。说清局限能帮助下一步研究，不表示本次观察没有价值。',
          'Stating a limitation guides further investigation without making current observations worthless.',
        ),
        revisit,
      ),
    ],
    mission: t(
      '写三句：本例支持什么；证据是什么；仍不能说明什么。然后设计U06任务，并开启生命侦探野外笔记。',
      'Write what this example supports, what the evidence is and what remains uncertain. Then design the U06 mission and begin the Life Detective field notebook.',
    ),
  },
];
