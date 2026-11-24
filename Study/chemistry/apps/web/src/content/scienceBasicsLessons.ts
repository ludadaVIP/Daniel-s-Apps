import type { LocalizedText } from '@study/shared';
import type { Lesson, LessonQuestion } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
function q(
  id: string,
  prompt: LocalizedText,
  options: LocalizedText[],
  answer: number,
  explanation: LocalizedText,
  conceptIds: string[],
  kind: LessonQuestion['kind'] = 'reasoning',
): LessonQuestion {
  return { id, prompt, options, answer, explanation, conceptIds, kind };
}
const scienceReading = {
  title: t(
    '拓展：化学中的问题与证据',
    'Read more: questions and evidence in chemistry',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/1-1-chemistry-in-context',
};
const measurementReading = {
  title: t(
    '拓展：测量、准确性与重复读数',
    'Read more: measurement, accuracy and repeated readings',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision',
};

export const scienceBasicsLessons: Lesson[] = [
  {
    id: 'observation-before-explanation',
    levelId: 'science-basics',
    order: 97,
    title: t(
      '看到了什么，能说明什么？',
      'What did you observe—and what does it support?',
    ),
    eyebrow: t(
      '科学基础 1/4 · 先记录，再解释',
      'Science basics 1/4 · Record first, explain next',
    ),
    hook: t(
      '一杯液体冒泡了。有人说“我看到气泡”，有人说“它一定产生了二氧化碳”。这两句话都直接来自眼睛吗？',
      'A liquid bubbles. One person says “I see bubbles”; another says “It must have made carbon dioxide”. Do both statements come directly from seeing?',
    ),
    hookHint: t(
      '把“看到、听到、仪器读到”与“认为原因或身份是什么”分开。解释可以合理，但还要接受证据检查。',
      'Separate what was seen, heard or read from an instrument from a proposed identity or cause. An explanation may be reasonable but still needs evidence.',
    ),
    bigIdea: t(
      '观察记录现象，推断提出解释；好的科学判断把两者分清，并让结论不超过证据。',
      'Observations record phenomena; inferences propose explanations. Good scientific judgments distinguish them and keep conclusions within the evidence.',
    ),
    estimatedMinutes: 12,
    everydayExamples: [
      {
        icon: '🫧',
        title: t('气泡不是气体身份证', 'Bubbles are not a gas ID'),
        body: t(
          '沸腾、释放原来溶解的气体、某些反应，都可能出现气泡。气泡本身不足以确定气体是谁。',
          'Boiling, release of dissolved gas and some reactions can all produce bubbles. Bubbles alone cannot identify a gas.',
        ),
      },
      {
        icon: '🍬',
        title: t('看不见不等于不存在', 'Invisible does not mean absent'),
        body: t(
          '糖在水中搅拌后，颗粒可能看不见了。观察是“颗粒不可见”，不是“糖被消灭”。',
          'After stirring sugar into water, grains may no longer be visible. The observation is invisible grains, not sugar being destroyed.',
        ),
      },
      {
        icon: '🌡️',
        title: t('读数与原因是两回事', 'A reading and its cause differ'),
        body: t(
          '温度计读数升高可以记录下来；是否由反应造成，还需排除环境传热等其他解释。',
          'A rising thermometer reading can be recorded. Whether a reaction caused it requires checking alternatives such as environmental heating.',
        ),
      },
    ],
    steps: [
      {
        title: t('先说清观察条件', 'State the observation conditions'),
        body: t(
          '记录对象、时间顺序、工具和单位。比起“变热了”，写“温度计从 20.0 °C 变为 23.0 °C”更便于别人检查。仪器记录也不是绝对无误。',
          'Record the object, sequence, tool and unit. “The thermometer changed from 20.0 °C to 23.0 °C” is more inspectable than “it got hot”. Instrument readings are not infallible.',
        ),
      },
      {
        title: t('圈出额外加入的解释', 'Spot an added explanation'),
        body: t(
          '“一定是二氧化碳”“糖已经不存在”都加入了身份或原因。它们属于推断，不能因为说得自信，就当成直接观察。',
          '“It must be carbon dioxide” and “the sugar no longer exists” add identity or cause. They are inferences, not direct observations made true by confident wording.',
        ),
      },
      {
        title: t('推断可以有根据', 'An inference can be supported'),
        body: t(
          '已知材料是冰，且在相应条件下变成液体，用“融化”解释就有依据。推断不是坏词；关键是能否联系记录，并接受更多检验。',
          'For known ice turning liquid under suitable conditions, melting is a supported explanation. Inference is not a bad word; connect it to records and allow further checks.',
        ),
      },
      {
        title: t(
          '把断言改成可检验问题',
          'Turn a claim into a testable question',
        ),
        body: t(
          '与其说“透明的一定是纯水”，不如问“哪些独立证据能区分纯水和含溶质的清液？”不知道身份时，不自行触碰、闻尝或混合未知液体。',
          'Instead of “clear means pure water”, ask which independent evidence could distinguish water from a clear solution. Do not touch, smell, taste or mix unknown liquids.',
        ),
      },
    ],
    misconception: t(
      '“这是推断，所以一定错误”和“这是观察，所以绝不会错”都不成立。记录需要可靠工具与方法，解释需要恰当证据。',
      'An inference is not automatically wrong, and an observation is not automatically error-free. Records need reliable methods; explanations need appropriate evidence.',
    ),
    mission: t(
      '选一段安全、熟悉的现象，例如冰在杯中逐渐变成液体；只观察，不加热。写两句记录和一句解释，用不同颜色标出，再列一条还想知道的证据。也可完全使用本课虚拟记录。',
      'Choose a familiar safe event such as ice gradually becoming liquid, without heating. Write two observations and one explanation, mark them differently, and list another piece of evidence you would like. The lesson’s virtual records can be used instead.',
    ),
    vocabulary: [
      { en: 'observation', zh: '观察' },
      { en: 'inference', zh: '推断' },
      { en: 'evidence', zh: '证据' },
      { en: 'testable question', zh: '可检验问题' },
    ],
    interactive: 'observation-inference-lab',
    resources: [scienceReading],
    learning: {
      prerequisites: [],
      objectives: [
        t(
          '区分记录与额外解释。',
          'Distinguish a record from an added explanation.',
        ),
        t(
          '识别证据不足的身份或原因断言。',
          'Recognise unsupported identity or cause claims.',
        ),
        t(
          '提出可继续检查的问题。',
          'Ask a question that can be investigated further.',
        ),
      ],
      workedExample: {
        prompt: t(
          '记录只写“混合后出现气泡”，能直接写成“产生了二氧化碳”吗？',
          'A record only says “bubbles appeared after mixing”. Can this directly become “carbon dioxide formed”?',
        ),
        steps: [
          t(
            '气泡出现属于现象记录。',
            'The appearance of bubbles is an observation.',
          ),
          t(
            '给气体命名加入了身份推断。',
            'Naming the gas adds an identity inference.',
          ),
          t(
            '其他过程也会产生气泡，需更多独立证据。',
            'Other processes can produce bubbles, so more independent evidence is needed.',
          ),
        ],
        answer: t(
          '不能直接断定。应先保留“看到气泡”，再提出如何确认气体身份的问题。',
          'No. Keep the bubble observation separate and ask what could establish the gas identity.',
        ),
      },
      anotherWay: t(
        '观察像记录员写下发生的事，推断像侦探解释为什么。侦探需要记录，却不能把自己的猜测偷偷写成已经拍到的事实。',
        'An observer records what happened; a detective explains why. The detective needs records but cannot quietly turn a guess into an already observed fact.',
      ),
      explainPrompt: t(
        '给家人各举一句观察和推断，再解释为什么一个合理推断仍不等于已经确定的事实。',
        'Give someone one observation and one inference, then explain why a reasonable inference is not yet a settled fact.',
      ),
      quickChecks: [
        q(
          'science97-check1',
          t(
            '“读数为 23.0 °C”首先是什么？',
            '“The reading is 23.0 °C” is primarily what?',
          ),
          [
            t('仪器记录', 'An instrument record'),
            t('完整原因解释', 'A complete cause explanation'),
            t('气体身份', 'A gas identity'),
          ],
          0,
          t(
            '它记录数值与单位，尚未解释原因。',
            'It records a value and unit without yet explaining its cause.',
          ),
          ['observation-inference'],
          'recall',
        ),
        q(
          'science97-check2',
          t(
            '“这杯透明液体一定是纯水”加入了什么？',
            'What does “this clear liquid must be pure water” add?',
          ),
          [
            t('已测定的组成', 'A measured composition'),
            t('未经证明的身份推断', 'An unproved identity inference'),
            t('只有颜色记录', 'Only a colour record'),
          ],
          1,
          t(
            '透明外观无法唯一确定组成。',
            'A clear appearance does not uniquely establish composition.',
          ),
          ['evidence-limits'],
        ),
        q(
          'science97-check3',
          t(
            '有依据的“冰在融化”解释属于什么？',
            'What is a supported explanation that ice is melting?',
          ),
          [
            t('一定错误', 'Necessarily wrong'),
            t('不需要记录的事实', 'A fact needing no records'),
            t('可继续检验的推断', 'An inference open to further tests'),
          ],
          2,
          t(
            '推断可以合理；应与观察区分并说明依据。',
            'An inference can be reasonable; distinguish it from observation and state its support.',
          ),
          ['supported-inference'],
        ),
      ],
    },
    questions: [
      q(
        'science97-q1',
        t(
          '哪句最直接记录观察？',
          'Which statement most directly records an observation?',
        ),
        [
          t('气体一定是 CO₂', 'The gas must be CO₂'),
          t('液体表面出现气泡', 'Bubbles appeared at the liquid surface'),
          t('反应一定完成', 'The reaction must be complete'),
        ],
        1,
        t(
          '气泡出现是现象；其身份与反应是否完成还需其他证据。',
          'Bubble appearance is a phenomenon; gas identity and completion need other evidence.',
        ),
        ['observation-inference'],
      ),
      q(
        'science97-q2',
        t(
          '颗粒看不见后，最谨慎的下一问是什么？',
          'After grains become invisible, what is a careful next question?',
        ),
        [
          t(
            '有什么证据能判断它们是否仍分散在水中？',
            'What evidence could tell whether the material remains dispersed in water?',
          ),
          t(
            '怎样证明物质必定消失？',
            'How can we prove matter must have vanished?',
          ),
          t('是否能把所有水都尝一遍？', 'Can we taste every liquid?'),
        ],
        0,
        t(
          '好问题保留可检验的不同解释，不先把结论当事实。',
          'A useful question leaves alternative explanations testable instead of assuming the conclusion.',
        ),
        ['testable-question'],
        'application',
      ),
      q(
        'science97-q3',
        t(
          '“温升全部由反应造成”为什么需要对照？',
          'Why does “the reaction caused all the warming” need a control?',
        ),
        [
          t('因为温度没有单位', 'Temperature has no unit'),
          t('因为观察都错误', 'All observations are wrong'),
          t(
            '因为环境传热等其他原因还未排除',
            'Other causes such as environmental heat transfer remain possible',
          ),
        ],
        2,
        t(
          '记录温升与确定全部原因是不同任务。',
          'Recording a rise and establishing its full cause are different tasks.',
        ),
        ['causal-evidence'],
      ),
      q(
        'science97-q4',
        t('推断是否必定错误？', 'Is an inference necessarily wrong?'),
        [
          t(
            '不是，可由证据支持并继续检验',
            'No; evidence can support it and further tests can check it',
          ),
          t('是，科学不能解释', 'Yes; science cannot explain'),
          t('是，只能背结论', 'Yes; only memorised conclusions count'),
        ],
        0,
        t(
          '科学需要解释；只是应标清解释与记录的区别。',
          'Science needs explanations, with a clear distinction from the underlying records.',
        ),
        ['supported-inference'],
      ),
      q(
        'science97-q5',
        t(
          '两杯液体都透明，能说明什么？',
          'What follows from two liquids both being clear?',
        ),
        [
          t('它们一定相同', 'They must be identical'),
          t('它们一定安全', 'They must be safe'),
          t(
            '它们共享一个外观特征，身份尚未确定',
            'They share one visible property; identity remains uncertain',
          ),
        ],
        2,
        t(
          '一个共同外观不足以唯一鉴定，也不能判断安全。',
          'One shared appearance neither uniquely identifies them nor establishes safety.',
        ),
        ['evidence-limits'],
      ),
      q(
        'science97-q6',
        t(
          '哪种记录更方便别人检查？',
          'Which record is easier for someone else to inspect?',
        ),
        [
          t('“发生了神奇反应”', '“A magical reaction happened”'),
          t(
            '“同一温度计从 20.0 °C 读到 23.0 °C”',
            '“The same thermometer changed from 20.0 °C to 23.0 °C”',
          ),
          t('“我肯定猜对了”', '“My guess must be right”'),
        ],
        1,
        t(
          '对象、工具、数值和单位帮助别人复核，也保留误差检查的可能。',
          'The tool, values and units make inspection and error checking possible.',
        ),
        ['record-quality'],
        'application',
      ),
    ],
  },
  {
    id: 'fair-comparisons-and-variables',
    levelId: 'science-basics',
    order: 98,
    title: t(
      '想知道哪个条件有用，怎样才算公平比较？',
      'Which condition matters? Build a fair comparison',
    ),
    eyebrow: t(
      '科学基础 2/4 · 改什么，测什么，保持什么',
      'Science basics 2/4 · Change, measure and control',
    ),
    hook: t(
      '一杯水更暖、糖更细、搅拌也更快，糖颗粒更早看不见了。能马上说“全是温度的作用”吗？',
      'One cup is warmer, the sugar finer and the stirring faster, and its grains disappear sooner. Can we immediately credit temperature alone?',
    ),
    hookHint: t(
      '先列出改变的条件，再看测量结果。结果不同不代表设计已经能分清原因。',
      'List changed conditions before reading the outcome. Different results do not mean the design separates the causes.',
    ),
    bigIdea: t(
      '要研究一个条件，先让它有明确变化，尽量控制其他相关条件，并用同一规则测量结果与保留重复记录。',
      'To investigate a condition, vary it clearly, control other relevant conditions, measure outcomes by a shared rule and retain repeat records.',
    ),
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '🥤',
        title: t('水温还是搅拌？', 'Temperature or stirring?'),
        body: t(
          '同时改水温和搅拌，观察到的时间差不能单独归因给其中一个。',
          'Changing temperature and stirring together prevents assigning the time difference to either one alone.',
        ),
      },
      {
        icon: '⏱️',
        title: t('终点先说清', 'Define the endpoint first'),
        body: t(
          '“从混合开始到颗粒不再可见”比“差不多好了”更一致，但仍是观察规则，不是精确到分子的终点。',
          '“From mixing until grains are no longer visible” is more consistent than “about done”, but it remains an observation rule, not a molecular endpoint.',
        ),
      },
      {
        icon: '📋',
        title: t('三次记录不只留最好一次', 'Keep every repeat'),
        body: t(
          '重复帮助看到结果波动。只保留最符合预期的一次，会扭曲证据。',
          'Repeats reveal variation. Keeping only the result that matches expectations distorts evidence.',
        ),
      },
    ],
    steps: [
      {
        title: t('确定要研究的条件', 'Identify the target condition'),
        body: t(
          '例如只研究温度：让两组温度不同。它是主动改变的条件；没有改变它，就不能检查它的影响。',
          'To investigate temperature, choose different temperatures. It is the deliberately changed condition; no change gives no test of its influence.',
        ),
      },
      {
        title: t('把其他条件列成清单', 'List other relevant conditions'),
        body: t(
          '水体积、糖质量、颗粒大小、搅拌与观察工具都可能影响结果。公平比较需要尽量一致；不能只因为两只杯子长得一样，就认定其他条件相同。',
          'Water volume, sugar mass, grain size, stirring and tools can affect the result. Keep them as consistent as practical; identical-looking cups do not establish matched conditions.',
        ),
      },
      {
        title: t('预先确定怎样测', 'Decide how to measure in advance'),
        body: t(
          '用相同的开始点、终点和单位记录时间。不能给一组用秒，另一组用“很快”，再直接比较。',
          'Use the same start, endpoint and time unit. “Seconds” for one group and “very fast” for another are not directly comparable records.',
        ),
      },
      {
        title: t('保留重复与有限结论', 'Keep repeats and limit conclusions'),
        body: t(
          '三次记录可比较平均与波动，但不能修复同时改多个条件的设计。本课虚构数据只支持所设条件的比较，不给出任何真实材料的溶解时间公式。',
          'Three repeats allow comparison of average and spread, but cannot repair changing multiple conditions. These authored data support the stated comparison, not a real-material time formula.',
        ),
      },
    ],
    misconception: t(
      '“结果不同就是目标条件的作用”忽略其他变化；“多重复几次就变公平”也不对。重复与控制变量分别解决不同问题。',
      'Different outcomes do not automatically establish the target’s effect, and more repeats do not make a confounded comparison fair. Repetition and control address different problems.',
    ),
    mission: t(
      '用本课记录为“温度是否影响观察时间”选一组比较，再换成“搅拌是否影响时间”。只在纸上设计，不配制或加热任何材料；说明为什么选的其他条件一致。',
      'Use the supplied records to choose a temperature comparison, then a stirring comparison. Design on paper without preparing or heating materials; explain which other conditions match.',
    ),
    vocabulary: [
      { en: 'independent variable', zh: '主动改变的变量' },
      { en: 'dependent variable', zh: '测量的结果变量' },
      { en: 'controlled variable', zh: '控制变量' },
      { en: 'repeat', zh: '重复记录' },
    ],
    interactive: 'fair-comparison-basics-lab',
    resources: [scienceReading, measurementReading],
    learning: {
      prerequisites: ['observation-before-explanation'],
      objectives: [
        t(
          '明确改变、测量与控制的条件。',
          'Identify what is changed, measured and controlled.',
        ),
        t(
          '拒绝多条件同时改变的因果归因。',
          'Reject single-cause claims from multiple changed conditions.',
        ),
        t(
          '保留所有重复并限制结论范围。',
          'Keep all repeats and limit the conclusion’s scope.',
        ),
      ],
      workedExample: {
        prompt: t(
          'A 为 20 °C，B 为 40 °C；水、糖、颗粒与搅拌都相同。若只研究温度，这个设计如何？',
          'A is 20 °C and B is 40 °C, with equal water, sugar, grains and stirring. How does this design address temperature?',
        ),
        steps: [
          t('目标温度确实不同。', 'The target temperature differs.'),
          t(
            '列出的其他相关条件保持相同。',
            'The listed other relevant conditions match.',
          ),
          t(
            '还要用相同终点记录全部重复，再讨论这组条件下的结果。',
            'Use one endpoint and keep every repeat before discussing these conditions.',
          ),
        ],
        answer: t(
          '在题目给定条件下可以隔离温度；不能外推为所有材料的普遍结论。',
          'Under the stated assumptions it isolates temperature, without establishing a universal claim for every material.',
        ),
      },
      anotherWay: t(
        '像比较两份只改一个配料的配方：如果同时改好几个地方，即使结果变了，也难知道是哪一个负责。先列条件，后看结果。',
        'Think of comparing recipes with one changed ingredient. If several things change, a different result does not reveal which was responsible. Check conditions before outcomes.',
      ),
      explainPrompt: t(
        '为什么“更暖、更细、搅拌更快”不能单独证明温度的作用？请重新设计只改温度的一组比较。',
        'Why does “warmer, finer and stirred faster” not isolate temperature? Redesign a comparison that changes only temperature.',
      ),
      quickChecks: [
        q(
          'science98-check1',
          t(
            '研究温度时，温度属于什么？',
            'When investigating temperature, what is temperature?',
          ),
          [
            t('永远不能变化的量', 'A quantity that must never change'),
            t('主动改变的条件', 'The deliberately changed condition'),
            t('最终测得的时间', 'The measured time'),
          ],
          1,
          t(
            '目标条件需要明确变化，才能比较其影响。',
            'The target condition must vary clearly to investigate its effect.',
          ),
          ['variables'],
          'recall',
        ),
        q(
          'science98-check2',
          t(
            '温度与搅拌同时改，能只归因给温度吗？',
            'Can a difference be attributed only to temperature when both temperature and stirring change?',
          ),
          [
            t('不能，两者混在一起', 'No; their effects are confounded'),
            t('能，只看更快的一杯', 'Yes; look only at the faster cup'),
            t('重复一次就能', 'One repeat makes it possible'),
          ],
          0,
          t(
            '多个变化使单独归因不充分。',
            'Multiple changes prevent a supported single-cause attribution.',
          ),
          ['confounding'],
        ),
        q(
          'science98-check3',
          t(
            '重复测量时应保留哪些记录？',
            'Which readings should be retained from repeats?',
          ),
          [
            t('只留最快的', 'Only the fastest'),
            t('只留最像答案的', 'Only those matching the answer'),
            t(
              '全部原始记录，异常另作核查',
              'All original records; investigate anomalies separately',
            ),
          ],
          2,
          t(
            '随意删选会改变证据。',
            'Selective deletion distorts the evidence.',
          ),
          ['repeat-records'],
        ),
      ],
    },
    questions: [
      q(
        'science98-q1',
        t(
          '研究搅拌，哪一组最能隔离目标？',
          'Which comparison best isolates stirring?',
        ),
        [
          t('温度和水量都不同', 'Different temperature and water volume'),
          t(
            '所有条件包括搅拌都相同',
            'Every condition including stirring is identical',
          ),
          t(
            '只改变搅拌，其他列相同',
            'Different stirring only, with other conditions matched',
          ),
        ],
        2,
        t(
          '需要目标变化，同时控制其他相关条件。',
          'The target must change while other relevant conditions are controlled.',
        ),
        ['controlled-comparison'],
        'application',
      ),
      q(
        'science98-q2',
        t(
          '颗粒不可见的时间属于什么？',
          'What is the time until grains become invisible?',
        ),
        [
          t('测量的结果变量', 'The measured outcome variable'),
          t(
            '必须主动改成某个答案的数',
            'A number to force to the desired answer',
          ),
          t('不需要单位的描述', 'A description needing no unit'),
        ],
        0,
        t(
          '它是按事先规则测得的结果，须记录单位。',
          'It is an outcome measured by a stated rule and needs a unit.',
        ),
        ['variables'],
      ),
      q(
        'science98-q3',
        t(
          '不公平设计重复三次，是否就排除了混杂条件？',
          'Does repeating a confounded design three times remove the confounding?',
        ),
        [
          t('是，三次总能证明原因', 'Yes; three repeats always prove a cause'),
          t(
            '否，多个条件仍同时变化',
            'No; multiple conditions still vary together',
          ),
          t('是，平均值自动修复设计', 'Yes; averaging fixes the design'),
        ],
        1,
        t(
          '重复揭示波动，不能取代条件控制。',
          'Repetition reveals variation but does not replace control.',
        ),
        ['confounding', 'repeat-records'],
      ),
      q(
        'science98-q4',
        t(
          'A 与 B 所有条件相同，能检验温度变化的作用吗？',
          'Can identical A and B conditions test the effect of changing temperature?',
        ),
        [
          t(
            '不能，目标温度没有变化',
            'No; the target temperature does not vary',
          ),
          t('能，只需给 B 改名', 'Yes; rename B'),
          t('能，因为记录很多', 'Yes; many records are sufficient'),
        ],
        0,
        t(
          '控制条件相同还不够，研究目标也必须有可比较的变化。',
          'Matching controls is insufficient if the target itself has no variation.',
        ),
        ['controlled-comparison'],
      ),
      q(
        'science98-q5',
        t(
          'A 的时间为 82、80、84 s，平均值是多少？',
          'What is the mean of 82, 80 and 84 s?',
        ),
        [t('84 s', '84 s'), t('80 s', '80 s'), t('82 s', '82 s')],
        2,
        t(
          '(82+80+84)÷3=82 s；平均值不能替代原始记录。',
          '(82+80+84)/3=82 s; the mean does not replace the original readings.',
        ),
        ['reading-summary'],
        'application',
      ),
      q(
        'science98-q6',
        t(
          '本课给定一组温度比较更快，能推出什么？',
          'A supplied temperature comparison has shorter times. What follows?',
        ),
        [
          t(
            '所有材料都按同一个时间规律变化',
            'All materials follow the same time law',
          ),
          t(
            '在题目控制条件下支持一个有限比较结论',
            'It supports a limited comparison under the stated controls',
          ),
          t('不用检查其他条件', 'Other conditions need no inspection'),
        ],
        1,
        t(
          '结论要保留材料、方法与条件范围。',
          'Keep the material, method and condition scope attached to the conclusion.',
        ),
        ['evidence-limits'],
      ),
    ],
  },
  {
    id: 'repeated-measurements-and-bias',
    levelId: 'science-basics',
    order: 99,
    title: t(
      '测得很一致，就一定测得准吗？',
      'Do consistent readings have to be accurate?',
    ),
    eyebrow: t(
      '科学基础 3/4 · 重复、参考值与分辨率',
      'Science basics 3/4 · Repeats, reference and resolution',
    ),
    hook: t(
      '同一样品连续显示 10.5 g，看起来很稳定；题目给定参考却是 10.0 g。多测几次，偏高的 0.5 g 会自己消失吗？',
      'A sample repeatedly reads 10.5 g, while the supplied reference is 10.0 g. Will the 0.5 g offset disappear merely by taking more readings?',
    ),
    hookHint: t(
      '同时问三个问题：读数彼此多接近、与参考多接近、仪器能显示多小的变化。',
      'Ask three questions: how closely readings agree, how close they are to a reference and how small a change the instrument displays.',
    ),
    bigIdea: t(
      '重复的一致程度、接近参考的程度和显示分辨率不同；平均值有用，但不能独自证明准确或消除系统偏差。',
      'Repeat agreement, closeness to a reference and display resolution differ. A mean is useful but alone proves neither accuracy nor removal of systematic bias.',
    ),
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '⚖️',
        title: t('零点可能偏移', 'A zero may be shifted'),
        body: t(
          '如果仪器始终偏高，一串接近的读数仍可离参考较远。应检查零点与校准，不能只增加次数。',
          'A consistently high instrument can give clustered readings far from a reference. Check zero and calibration instead of only repeating.',
        ),
      },
      {
        icon: '🔢',
        title: t(
          '相同显示可能隐藏变化',
          'An identical display can hide variation',
        ),
        body: t(
          '只显示整数克的仪器，可能把较小变化都显示成 10 g。不能因此断言真实质量完全不变。',
          'A whole-gram instrument can display smaller variations alike as 10 g. That does not establish exact constancy of the underlying mass.',
        ),
      },
      {
        icon: '📊',
        title: t('平均相同，波动可能不同', 'Same mean, different spread'),
        body: t(
          '9.9、10.0、10.1 g 与 9.6、10.0、10.4 g 的平均都为 10.0 g，波动却不同。',
          '9.9, 10.0, 10.1 g and 9.6, 10.0, 10.4 g both average 10.0 g but have different spread.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '把数值、单位与工具一起读',
          'Read value, unit and tool together',
        ),
        body: t(
          '10.0 g 与“约 10”传达的信息不同。读数来自仪器与方法，分辨率说明显示的细度，不自动给出完整不确定度。',
          '10.0 g and “about 10” convey different information. Readings depend on tool and method; resolution describes display fineness, not the complete uncertainty.',
        ),
      },
      {
        title: t('先看全部重复记录', 'Inspect every repeated reading'),
        body: t(
          '用相同标尺画出每个读数，比较最大值与最小值。不要因为某点不合期待就偷偷删除；先保留并检查原因。',
          'Plot every reading on the same scale and compare maximum and minimum. Do not quietly remove an unexpected point; retain it and investigate first.',
        ),
      },
      {
        title: t('再比较平均与参考', 'Compare the mean with the reference'),
        body: t(
          '题目给定参考为 10.0 g。一组平均 10.5 g，即使波动小，也仍偏离参考。重复可帮助看清偏差，却不自动修正它。',
          'With a supplied reference of 10.0 g, a mean of 10.5 g remains offset even if spread is small. Repetition can reveal the offset without automatically correcting it.',
        ),
      },
      {
        title: t('不要捏造多余精确度', 'Do not invent extra certainty'),
        body: t(
          '本课先把报告均值保留到与单次显示相同的小数位，并不估计均值的不确定度。观察范围也不是完整不确定度；真实校准还需检查参考值本身的可靠程度。',
          'For this introductory task, report the mean to the display’s decimal place without estimating uncertainty of the mean. Observed range is not the complete uncertainty; real calibration also checks reference reliability.',
        ),
      },
    ],
    misconception: t(
      '“多测几次就必定准确”“显示全一样就没有误差”“平均相同就同样可靠”都不充分。要同时查看重复、参考、分辨率和方法。',
      'More repeats do not guarantee accuracy, identical displays do not prove zero error, and equal means do not establish equal reliability. Inspect repeats, reference, resolution and method together.',
    ),
    mission: t(
      '使用本课四份虚构记录，分别标出平均、范围和分辨率。请家人遮住记录名称，只看图判断哪组稳定却偏高；不用寻找或校准家中真实仪器。',
      'Use the four authored records to mark mean, range and resolution. Hide record names and identify the tight-but-shifted group from its plot. No real instrument search or calibration is needed.',
    ),
    vocabulary: [
      { en: 'accuracy', zh: '接近参考的准确程度' },
      { en: 'precision', zh: '重复的一致程度' },
      { en: 'resolution', zh: '分辨率' },
      { en: 'systematic bias', zh: '系统偏差' },
    ],
    interactive: 'measurement-evidence-lab',
    resources: [measurementReading],
    learning: {
      prerequisites: [
        'observation-before-explanation',
        'fair-comparisons-and-variables',
      ],
      objectives: [
        t(
          '分开描述重复一致与接近参考。',
          'Describe repeat agreement separately from reference agreement.',
        ),
        t(
          '用同一标尺比较均值与波动。',
          'Compare means and spread on one scale.',
        ),
        t(
          '指出重复与平均不能自动修正的限制。',
          'Identify limits that repetition and averaging do not automatically fix.',
        ),
      ],
      workedExample: {
        prompt: t(
          '参考 10.0 g，五次读数为 10.5、10.5、10.4、10.6、10.5 g。怎样描述？',
          'The reference is 10.0 g and readings are 10.5, 10.5, 10.4, 10.6, 10.5 g. How should they be described?',
        ),
        steps: [
          t('平均为 10.5 g。', 'The mean is 10.5 g.'),
          t(
            '最小 10.4、最大 10.6 g，范围差为 0.2 g。',
            'Minimum 10.4 and maximum 10.6 g give a spread of 0.2 g.',
          ),
          t(
            '平均比参考高 0.5 g；小波动没有消除这个偏离。',
            'The mean is 0.5 g above reference; a small spread does not remove that offset.',
          ),
        ],
        answer: t(
          '读数较集中但整体偏高，需要调查原因与校准，不能仅凭重复就称准确。',
          'The readings are tight but consistently high. Investigate method and calibration instead of declaring accuracy from repetition alone.',
        ),
      },
      anotherWay: t(
        '几次落点都挤在靶心旁边同一处，说明彼此接近，却不说明接近靶心。若靶纸网格很粗，小差异还可能看不出来；类比中的靶心对应给定参考值。',
        'A cluster beside a target centre shows agreement with each other, not agreement with the centre. A coarse grid can also hide small differences. The centre represents the supplied reference.',
      ),
      explainPrompt: t(
        '解释为什么“10、10、10、10、10 g”不能单独证明比“9.9、10.0、10.1 g”更可靠；你还要知道哪些仪器信息？',
        'Why do five 10 g displays not alone prove greater reliability than 9.9, 10.0 and 10.1 g? What instrument information is still needed?',
      ),
      quickChecks: [
        q(
          'science99-check1',
          t(
            '所有读数都偏高 0.5 g，再重复一定消除偏差吗？',
            'If readings are consistently 0.5 g high, will repetition necessarily remove the offset?',
          ),
          [
            t('会，次数越多偏差越快消失', 'Yes; more repeats erase it'),
            t('会，平均自动归零', 'Yes; the mean resets to zero'),
            t(
              '不会自动，需要检查方法与校准',
              'Not automatically; inspect method and calibration',
            ),
          ],
          2,
          t(
            '系统偏差可以在每次重复中持续存在。',
            'Systematic bias can persist in every repeat.',
          ),
          ['systematic-bias'],
        ),
        q(
          'science99-check2',
          t(
            '9.9、10.0、10.1 g 的平均是多少？',
            'What is the mean of 9.9, 10.0, 10.1 g?',
          ),
          [t('10.0 g', '10.0 g'), t('10.1 g', '10.1 g'), t('9.9 g', '9.9 g')],
          0,
          t('相加 30.0 g，再除以三次。', 'Add to 30.0 g and divide by three.'),
          ['reading-summary'],
          'application',
        ),
        q(
          'science99-check3',
          t(
            '1 g 分辨率显示相同，能证明真实量完全相同吗？',
            'Do identical readings at 1 g resolution prove identical underlying quantities?',
          ),
          [
            t('能，完全精确', 'Yes; perfectly exact'),
            t('不能，较小变化可能未显示', 'No; smaller changes may be hidden'),
            t('能，不用单位', 'Yes; no unit is needed'),
          ],
          1,
          t(
            '显示步长限制可见变化，不能把显示不变当作真实无变化。',
            'Display steps limit visible changes; unchanged displays are not proof of no underlying variation.',
          ),
          ['display-resolution'],
        ),
      ],
    },
    questions: [
      q(
        'science99-q1',
        t(
          '平均接近参考，但单次读数分散，哪项正确？',
          'The mean is near reference but individual readings are spread out. Which is correct?',
        ),
        [
          t('所有单次读数都精确', 'Every individual reading is exact'),
          t(
            '仍需报告波动，不能只给平均',
            'Report variation too, rather than only the mean',
          ),
          t('可以删掉偏离平均的点', 'Delete points far from the mean'),
        ],
        1,
        t(
          '平均可掩盖单次测量的差别，原始记录仍重要。',
          'A mean can hide individual differences; original records remain important.',
        ),
        ['reading-summary'],
      ),
      q(
        'science99-q2',
        t(
          '10.4、10.5、10.6 g，最大最小差是多少？',
          'What is the maximum–minimum difference of 10.4, 10.5, 10.6 g?',
        ),
        [t('0.5 g', '0.5 g'), t('0.2 g', '0.2 g'), t('10.6 g', '10.6 g')],
        1,
        t(
          '10.6−10.4=0.2 g；这只是观察范围差，不是完整不确定度。',
          '10.6−10.4=0.2 g; this is the observed spread, not the complete uncertainty.',
        ),
        ['reading-spread'],
        'application',
      ),
      q(
        'science99-q3',
        t(
          '重复很集中，却离给定参考较远，应怎样判断？',
          'Repeats are tight but far from the supplied reference. How should they be assessed?',
        ),
        [
          t('必定最准确', 'They must be the most accurate'),
          t('没有任何问题', 'There is no issue'),
          t(
            '一致性不能代替接近参考，需调查偏差',
            'Agreement does not replace reference agreement; investigate the offset',
          ),
        ],
        2,
        t(
          '精密与接近参考是不同维度。',
          'Repeat agreement and closeness to reference are distinct dimensions.',
        ),
        ['accuracy-versus-precision'],
      ),
      q(
        'science99-q4',
        t(
          '看到一个不合期待的读数，先做什么？',
          'What should be done first with an unexpected reading?',
        ),
        [
          t('保留记录并核查条件', 'Retain it and inspect the conditions'),
          t('直接删除不留痕迹', 'Delete it without a record'),
          t('改成自己喜欢的数', 'Replace it with a preferred number'),
        ],
        0,
        t(
          '异常可能有原因，但应保留原记录与核查依据。',
          'An anomaly may have a cause; keep the original record and the basis for any investigation.',
        ),
        ['record-integrity'],
      ),
      q(
        'science99-q5',
        t(
          '下面哪个结论超过证据？',
          'Which conclusion goes beyond the evidence?',
        ),
        [
          t('记录 B 的平均偏高', 'Record B has a high mean'),
          t('记录 C 的范围较宽', 'Record C has a wider range'),
          t(
            '显示都相同，所以真实质量没有任何不确定度',
            'Identical displays prove zero uncertainty in the true mass',
          ),
        ],
        2,
        t(
          '显示分辨率与方法限制仍然存在。',
          'Resolution and method limits still exist.',
        ),
        ['display-resolution', 'model-limits'],
      ),
      q(
        'science99-q6',
        t(
          '参考 10.0 g，平均 10.5 g，均值与参考差是多少？',
          'The reference is 10.0 g and the mean 10.5 g. What is the mean-reference difference?',
        ),
        [t('+0.5 g', '+0.5 g'), t('−0.5 g', '−0.5 g'), t('0 g', '0 g')],
        0,
        t(
          '10.5−10.0=+0.5 g；知道偏差不等于已经修正它。',
          '10.5−10.0=+0.5 g; identifying an offset does not itself correct it.',
        ),
        ['reference-comparison'],
        'application',
      ),
    ],
  },
  {
    id: 'mass-conservation-and-boundaries',
    nextLessonId: 'what-is-matter',
    levelId: 'science-basics',
    order: 100,
    title: t(
      '质量去哪了？先画出称量范围',
      'Where did the mass go? Draw the weighing boundary',
    ),
    eyebrow: t(
      '科学基础 4/4 · 容器、材料与跨界气体',
      'Science basics 4/4 · Vessel, materials and gas crossing a boundary',
    ),
    hook: t(
      '糖颗粒看不见，质量会跟着消失吗？反应冒出的气体离开容器后，天平读数变小，又是否违背质量守恒？',
      'Does mass disappear when sugar grains become invisible? If gas leaves a reacting vessel and its reading falls, is mass conservation violated?',
    ),
    hookHint: t(
      '先说清称了哪些东西。离开称量范围的气体仍是物质，应该在范围外继续记账。',
      'First state what was weighed. Gas that leaves the weighing boundary is still matter and belongs in the outside ledger.',
    ),
    bigIdea: t(
      '普通化学过程的总质量守恒；容器读数取决于称量范围是否包含全部物质，物质跨界不等于消失。',
      'Total mass is conserved in ordinary chemical processes. A vessel reading depends on whether its boundary includes all matter; crossing a boundary is not disappearance.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🍬',
        title: t('糖的质量仍在', 'Sugar’s mass remains'),
        body: t(
          '如果起始水和糖都已计入，搅拌时没有洒出或外界进入，看不见颗粒并不使总质量改变。',
          'If water and sugar were both counted initially and nothing spills or enters, invisible grains do not change total mass.',
        ),
      },
      {
        icon: '💨',
        title: t('气体也有质量', 'Gas also has mass'),
        body: t(
          '水变为水蒸气仍是水。气体留在称量范围内或离开范围，会影响容器读数，却不改变总账。',
          'Water vapour is still water. Whether gas stays inside or leaves the weighing boundary changes the vessel reading, not the full ledger.',
        ),
      },
      {
        icon: '🫙',
        title: t('容器要单独记', 'Keep the vessel separate'),
        body: t(
          '总读数含容器时，要算内容物必须扣去容器。不能把不同容器的总质量差误当材料变化。',
          'If a reading includes a vessel, subtract the vessel to report its contents. Different vessel masses are not material changes.',
        ),
      },
    ],
    steps: [
      {
        title: t('定义起始总账', 'Define the initial ledger'),
        body: t(
          '本课虚拟记录每次都从 20 g 容器与 90 g 全部材料开始，共 110 g。气体也属于有质量的物质，不能因为看不见就不算。',
          'Each virtual record begins with a 20 g vessel and all 90 g of material, totalling 110 g. Gas is matter with mass and cannot be omitted because it is invisible.',
        ),
      },
      {
        title: t('把称量边界画出来', 'Draw the weighing boundary'),
        body: t(
          '封闭模型让生成或转入气相的物质留在内部，容器读数仍为 110 g。开放模型中气体可移到外部；只称容器时不再包括它。',
          'The closed model retains material entering the gas phase, keeping the vessel reading at 110 g. In the open model gas can move outside and no longer belongs to the vessel reading.',
        ),
      },
      {
        title: t('把范围外的质量记回来', 'Account for matter outside'),
        body: t(
          '若 2 g 气体移出，容器与内部读数为 108 g，外部还有 2 g，总账仍为 110 g。读数下降本身不表示原子被消灭。',
          'If 2 g gas moves out, the vessel and contents read 108 g, with 2 g outside: the full ledger is still 110 g. A lower reading does not mean atoms were destroyed.',
        ),
      },
      {
        title: t(
          '用测量知识限制结论',
          'Limit conclusions using measurement knowledge',
        ),
        body: t(
          '真实差值还可能来自洒出、漏算或仪器偏差，不能只看一个差值就唯一断定产气。其他开放过程也可能因气体进入而增重；守恒需要适当的完整范围。',
          'A real difference may also reflect spills, omissions or instrument bias, so one difference does not uniquely establish gas formation. Other open processes may gain mass from incoming gas; conservation needs a complete boundary.',
        ),
      },
    ],
    misconception: t(
      '“气体跑掉所以质量不守恒”和“守恒所以任何容器读数都必须不变”都混淆了总系统与局部称量范围。',
      '“Escaping gas violates conservation” and “conservation makes every vessel reading constant” both confuse the total system with a local weighing boundary.',
    ),
    mission: t(
      '用虚拟模型分别画封闭与开放两张账：容器、内部材料、外部气体。再说明为什么蒸发和产气反应都可能影响开放容器读数，但不能仅凭这个共同点把两者当作同一种变化。不要做家庭密封产气实验。',
      'Draw closed and open virtual ledgers for vessel, internal material and outside gas. Explain why evaporation and gas-forming reactions can both alter an open-vessel reading without being the same kind of change. Do not perform a home sealed gas-forming experiment.',
    ),
    vocabulary: [
      { en: 'system boundary', zh: '系统边界' },
      { en: 'mass conservation', zh: '质量守恒' },
      { en: 'tare', zh: '容器质量／皮重' },
      { en: 'gas phase', zh: '气相' },
    ],
    interactive: 'mass-boundary-basics-lab',
    resources: [scienceReading, measurementReading],
    learning: {
      prerequisites: [
        'repeated-measurements-and-bias',
        'fair-comparisons-and-variables',
      ],
      objectives: [
        t(
          '区分容器读数与完整物质总账。',
          'Distinguish vessel readings from a complete material ledger.',
        ),
        t(
          '计算跨界气体与扣除容器后的质量。',
          'Account for gas crossing a boundary and subtract vessel mass.',
        ),
        t(
          '用条件与测量限制检查守恒解释。',
          'Audit conservation explanations using conditions and measurement limits.',
        ),
      ],
      workedExample: {
        prompt: t(
          '起始总质量 110 g，容器 20 g。开放模型有 2 g 气体移出，最后容器读数和内部材料质量是多少？',
          'Initial total mass is 110 g, including a 20 g vessel. In the open model 2 g gas leaves. What are the vessel reading and remaining material mass?',
        ),
        steps: [
          t('容器读数为 110−2=108 g。', 'The vessel reading is 110−2=108 g.'),
          t(
            '扣去 20 g 容器，内部材料为 88 g。',
            'Subtract the 20 g vessel to obtain 88 g material inside.',
          ),
          t(
            '把外部 2 g 计回：108+2=110 g。',
            'Include the 2 g outside: 108+2=110 g.',
          ),
        ],
        answer: t(
          '读数 108 g，内部材料 88 g，完整总账仍为 110 g。',
          'The reading is 108 g, inside material 88 g, and the full ledger remains 110 g.',
        ),
      },
      anotherWay: t(
        '把称量范围想成一只书包：东西移到包外，包会轻一些，但东西并没消失。重新把包内和包外一起计入，才能比较完整总量。',
        'Think of a backpack boundary: moving something outside makes the bag lighter without destroying the item. Count inside and outside together to compare the complete inventory.',
      ),
      explainPrompt: t(
        '不用“因为守恒”四个字结束：明确说明你称了什么、气体在哪里，以及为什么 108 g 与 110 g 可以同时是正确的不同范围读数。',
        'Do more than say “because conservation”: state what was weighed, where the gas is, and why 108 g and 110 g can both be correct for different boundaries.',
      ),
      quickChecks: [
        q(
          'science100-check1',
          t(
            '110 g 起始总量，有 2 g 气体移到称量范围外，局部读数是多少？',
            'From a 110 g initial total, 2 g gas leaves the weighing boundary. What is the local reading?',
          ),
          [t('112 g', '112 g'), t('108 g', '108 g'), t('0 g', '0 g')],
          1,
          t(
            '只在局部读数中减去离开的 2 g，气体仍在外部。',
            'Subtract 2 g from the local reading; it still exists outside.',
          ),
          ['mass-boundary'],
          'application',
        ),
        q(
          'science100-check2',
          t(
            '108 g 读数含 20 g 容器，内容物多少？',
            'A 108 g reading includes a 20 g vessel. What is the contents mass?',
          ),
          [t('88 g', '88 g'), t('128 g', '128 g'), t('108 g', '108 g')],
          0,
          t(
            '内容物要扣除容器，108−20=88 g。',
            'Subtract the vessel: 108−20=88 g.',
          ),
          ['tare-accounting'],
          'application',
        ),
        q(
          'science100-check3',
          t('封闭模型的气体在哪里？', 'Where is the gas in the closed model?'),
          [
            t('消失了', 'It has disappeared'),
            t('变得没有质量', 'It has no mass'),
            t('仍在称量范围内', 'It remains inside the weighing boundary'),
          ],
          2,
          t(
            '内部转相不等于跨界，也不等于质量消失。',
            'Changing phase inside is not crossing the boundary or losing mass.',
          ),
          ['mass-conservation'],
        ),
      ],
    },
    questions: [
      q(
        'science100-q1',
        t(
          '糖看不见、没有物质跨界时，理想总质量怎样？',
          'Sugar becomes invisible with no matter crossing the boundary. What happens to ideal total mass?',
        ),
        [
          t('保持相同', 'It stays the same'),
          t('糖的质量消失', 'Sugar mass disappears'),
          t('一定增大', 'It must increase'),
        ],
        0,
        t(
          '可见颗粒消失不代表物质消失；完整库存仍计入糖。',
          'Invisible grains do not imply absent matter; sugar remains in the complete inventory.',
        ),
        ['mass-conservation'],
      ),
      q(
        'science100-q2',
        t(
          '开放产气模型的容器读数减小，哪种解释合理？',
          'An open gas-forming model has a lower vessel reading. Which explanation fits?',
        ),
        [
          t('原子被消灭了', 'Atoms were destroyed'),
          t(
            '一部分物质移出了称量范围',
            'Some matter left the weighing boundary',
          ),
          t('气体没有质量', 'Gas has no mass'),
        ],
        1,
        t(
          '外部气体仍有质量，计回后总账一致。',
          'The gas outside retains mass; adding it restores the full ledger.',
        ),
        ['mass-boundary'],
      ),
      q(
        'science100-q3',
        t(
          '封闭模型中 90 g 材料有 2 g 成为气体，内部材料总量是多少？',
          'In the closed model, 2 g of 90 g material becomes gas. What is total material mass inside?',
        ),
        [t('88 g', '88 g'), t('92 g', '92 g'), t('90 g', '90 g')],
        2,
        t(
          '88 g 非气相加 2 g 气体仍为 90 g，不含容器。',
          '88 g nongaseous material plus 2 g gas is still 90 g, excluding the vessel.',
        ),
        ['phase-accounting'],
        'application',
      ),
      q(
        'science100-q4',
        t(
          '容器 20 g、内部材料 88 g、外部气体 2 g，完整总账是多少？',
          'What is the full total for a 20 g vessel, 88 g inside material and 2 g outside gas?',
        ),
        [t('110 g', '110 g'), t('108 g', '108 g'), t('90 g', '90 g')],
        0,
        t(
          '20+88+2=110 g；需要明说所比较范围是否含容器。',
          '20+88+2=110 g; specify whether the comparison includes the vessel.',
        ),
        ['mass-boundary', 'tare-accounting'],
        'application',
      ),
      q(
        'science100-q5',
        t(
          '真实容器读数下降，能仅凭这条差值唯一证明产气吗？',
          'Does one lower real vessel reading uniquely prove gas formation?',
        ),
        [
          t('能，所有下降都产气', 'Yes; every drop means gas formation'),
          t('能，仪器永不偏差', 'Yes; instruments never err'),
          t(
            '不能，还需检查洒出、遗漏与仪器等',
            'No; inspect spills, omissions and instruments too',
          ),
        ],
        2,
        t(
          '同一差值可能有不同解释，需要独立证据。',
          'Different causes can produce the same difference; seek independent evidence.',
        ),
        ['evidence-limits'],
      ),
      q(
        'science100-q6',
        t(
          '蒸发与产气反应都可能让开放读数下降，能据此说两者一定相同吗？',
          'Evaporation and gas-forming reactions can both lower open-vessel readings. Are they therefore the same process?',
        ),
        [
          t(
            '是，读数相同就身份相同',
            'Yes; matching readings establish identical processes',
          ),
          t(
            '不是，共同读数特征不能唯一确定过程',
            'No; a shared reading pattern does not uniquely identify a process',
          ),
          t('是，任何气体都是新物质', 'Yes; any gas is a new substance'),
        ],
        1,
        t(
          '水蒸发是相态变化；产气反应可能生成新物质，需要结合其他成分与现象证据。',
          'Water evaporation changes phase; a gas-forming reaction may form new substances. Distinguish them using other composition and observation evidence.',
        ),
        ['observation-inference', 'process-evidence'],
      ),
    ],
  },
];
