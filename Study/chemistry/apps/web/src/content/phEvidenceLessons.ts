import type { LocalizedText } from '@study/shared';
import type { Lesson, LessonQuestion } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
function q(
  id: string,
  prompt: LocalizedText,
  options: LocalizedText[],
  answer: number,
  explanation: LocalizedText,
  concept: string,
  kind: LessonQuestion['kind'] = 'reasoning',
): LessonQuestion {
  return {
    id,
    prompt,
    options,
    answer,
    explanation,
    conceptIds: [concept],
    kind,
  };
}
const phReading = {
  title: t(
    '拓展：pH 与水溶液中的离子',
    'Read more: pH and ions in aqueous solutions',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh',
};
export const phEvidenceLessons: Lesson[] = [
  {
    id: 'indicator-colours-give-ranges',
    levelId: 'acids',
    order: 115,
    nextLessonId: 'acidic-is-not-positively-charged',
    title: t(
      '颜色会说话，但能说出精确 pH 吗？',
      'Colour gives clues—but does it give an exact pH?',
    ),
    eyebrow: t(
      '酸碱入门衔接 1/2 · 工具色卡与范围交集',
      'Acid–base bridge 1/2 · Tool-specific charts and overlapping ranges',
    ),
    hook: t(
      '同一份水样，两份取样分别加甲基橙和 BTB，结果都呈黄色。是不是两个工具读出了同一个 pH 数字？',
      'Separate portions of one water sample look yellow with methyl orange and BTB. Have both tools reported the same exact pH number?',
    ),
    hookHint: t(
      '同样的颜色在不同工具上可能代表不同范围。先读各自色卡，再找共同允许的部分。',
      'The same colour can mean different ranges on different tools. Read each chart before finding what both allow.',
    ),
    bigIdea: t(
      '指示剂读数先给范围；同一样品的多条读数要找交集，不能凭一种颜色或随意平均报精确 pH。',
      'Indicator readings give ranges; combine records from the same sample by overlap, not a single colour or an arbitrary average.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🎨',
        title: t('黄色不只有一种含义', 'Yellow has no universal pH meaning'),
        body: t(
          '按本题色卡，甲基橙黄色表示 pH>4.4，BTB 黄色表示 pH<6。两条可同时成立，但不是在说 pH 等于某个固定数。',
          'On these supplied charts, yellow methyl orange means pH>4.4 while yellow BTB means pH<6. Both can hold without selecting one exact value.',
        ),
      },
      {
        icon: '📏',
        title: t('范围不是精确读数', 'A range is not an exact reading'),
        body: t(
          '本题把 BTB 过渡区简化为 6≤pH≤7.6。它含酸性、中性和碱性可能，不能把绿色系一律叫作 pH 7。',
          'The BTB transition category is simplified to 6≤pH≤7.6. It includes acidic, neutral and basic possibilities, not a universal green=pH 7 rule.',
        ),
      },
      {
        icon: '🔎',
        title: t('两条线索也可能互相矛盾', 'Two records can conflict'),
        body: t(
          '若同一样品的记录同时要求 pH<3.1 与 pH>7.6，本题条件下没有共同范围。先复核记录，不随便取平均或猜一个污染原因。',
          'If records from the same sample require pH<3.1 and pH>7.6, no overlap exists under the exercise conditions. Recheck the record instead of averaging or guessing a contamination cause.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先确认是哪一种工具与色卡',
          'Identify the tool and its own chart',
        ),
        body: t(
          '本题给甲基橙和溴百里酚蓝 BTB 的简化色卡，且已知水样 pH 在 0–14、温度 25 °C。同一颜色在两种工具上不必对应同一范围；数字按这张给定色卡读，不凭印象猜。',
          'This exercise supplies simplified methyl-orange and BTB charts for a sample known to be at 25 °C within pH 0–14. One colour need not mean one range across tools; use the given chart rather than memory.',
        ),
      },
      {
        title: t(
          '把颜色翻译为允许的范围',
          'Translate colour into an allowed range',
        ),
        body: t(
          '甲基橙低端色对应 pH<3.1，过渡区为 3.1–4.4，高端色对应 pH>4.4；BTB 则以 6 与 7.6 分区。端点是否包含按本题规则处理，真实颜色连续变化，不是突然跳档。',
          'Methyl orange uses boundaries 3.1 and 4.4; BTB uses six and 7.6. Low and high categories lie outside each transition interval. Endpoint inclusion follows the exercise rules; real colours change continuously rather than jumping between bins.',
        ),
      },
      {
        title: t(
          '同一样品要同时满足两条记录',
          'One sample must satisfy both records',
        ),
        body: t(
          '分别取同一水样的两份，用不同指示剂获得给定读数。甲基橙黄与 BTB 黄要求 pH 同时大于 4.4 且小于 6，共同范围是 4.4<pH<6，在 25 °C 可确定酸性；仍不是一个精确值。',
          'Separate portions of the same sample give the supplied readings. Yellow methyl orange and yellow BTB require pH above 4.4 and below six: 4.4<pH<6. This is acidic at 25 °C, but still not one exact value.',
        ),
      },
      {
        title: t(
          '没有交集，就保留矛盾并复核',
          'Keep a conflict visible and recheck it',
        ),
        body: t(
          '没有共同范围时，先检查是否拿错样品、色卡是否对应、记录是否正确。这些是待查可能，不是已证实的原因。0–14 也是本题的已知条件，不是 pH 在所有情况下的绝对极限。',
          'With no overlap, check sample labels, matching charts and recorded readings. These are possibilities to investigate, not established causes. The domain 0–14 is a supplied condition here, not an absolute limit for every pH.',
        ),
      },
    ],
    misconception: t(
      '颜色不是一个通用数字密码，过渡色也不是精确 pH。多条读数要同时符合；矛盾不能用平均值抹掉，更不能由一种颜色推断样品一定纯净或可饮用。',
      'Colour is not a universal number code, and transition colour is not exact pH. Multiple readings must be compatible; averaging does not repair a contradiction or prove purity or drinkability.',
    ),
    mission: t(
      '在模型里先组合“两种都黄”，写出共同范围并解释为什么不是精确 pH。再试甲基橙高端与 BTB 过渡区，说明为何不能直接判中性；最后找到一组无交集读数。只用屏幕和给定色卡。',
      'Try both yellow readings and state the overlap without claiming an exact pH. Then pair high methyl orange with transition BTB and explain why neutrality is not established. Find an incompatible pair using only the screen and supplied charts.',
    ),
    vocabulary: [
      { en: 'acid–base indicator', zh: '酸碱指示剂' },
      { en: 'transition interval', zh: '变色范围' },
      { en: 'common range', zh: '共同范围' },
      { en: 'compatible readings', zh: '兼容的读数' },
      { en: 'boundary', zh: '边界' },
    ],
    interactive: 'indicator-range-evidence-lab',
    resources: [
      {
        title: t(
          '拓展：指示剂与变色范围',
          'Read more: indicators and colour-change intervals',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations',
      },
    ],
    learning: {
      prerequisites: ['acids-bases-and-ph', 'repeated-measurements-and-bias'],
      objectives: [
        t(
          '根据指定工具色卡，把读数写成范围。',
          'Translate readings into ranges using the specified charts.',
        ),
        t(
          '找两条读数的共同范围，并识别不兼容记录。',
          'Find the overlap and recognise incompatible records.',
        ),
        t(
          '区分能确定酸碱类别与能报精确 pH。',
          'Distinguish establishing acid/base class from reporting exact pH.',
        ),
      ],
      workedExample: {
        prompt: t(
          '甲基橙与 BTB 都是本题的高/低端黄色，能支持什么？',
          'What follows when methyl orange and BTB both show their supplied yellow categories?',
        ),
        steps: [
          t(
            '甲基橙黄色是高端类别：pH>4.4。',
            'Methyl-orange yellow is the high category: pH>4.4.',
          ),
          t(
            'BTB 黄色是低端类别：pH<6。',
            'BTB yellow is the low category: pH<6.',
          ),
          t(
            '两条同时成立，得 4.4<pH<6；整个范围在 7 以下。',
            'Together they give 4.4<pH<6; the whole range is below seven.',
          ),
        ],
        answer: t(
          '25 °C 下可确定酸性；不能仅凭这两种颜色确定精确 pH。',
          'Acidic at 25 °C, without an exact pH from these colours alone.',
        ),
      },
      quickChecks: [
        q(
          'ph-range-check-1',
          t(
            '相同黄色出现在两种指示剂中，先做什么？',
            'What comes first when two indicators both look yellow?',
          ),
          [
            t('直接说 pH 相同且精确', 'Report the same exact pH'),
            t('分别读各自工具色卡', 'Read each tool’s own chart'),
            t('把两个颜色平均', 'Average the colours'),
          ],
          1,
          t(
            '工具不同，颜色对应范围也可不同。',
            'Different tools can map colour to different ranges.',
          ),
          'tool-specific-chart',
        ),
        q(
          'ph-range-check-2',
          t(
            '共同范围 6≤pH≤7.6 能确定中性吗？',
            'Does a common range 6≤pH≤7.6 establish neutrality?',
          ),
          [
            t('能，因为范围里有 7', 'Yes, because seven is included'),
            t(
              '能，过渡色都表示 7',
              'Yes, transition colour always means seven',
            ),
            t(
              '不能，范围也含 7 两侧的值',
              'No, values on both sides of seven remain possible',
            ),
          ],
          2,
          t(
            '包含一个可能值，不等于只剩这个值。',
            'Including a possible value is not isolating it.',
          ),
          'range-not-exact',
        ),
        q(
          'ph-range-check-3',
          t(
            '同一样品要求 pH<3.1 又要求 pH>7.6，该怎样处理？',
            'How should pH<3.1 and pH>7.6 for one sample be handled?',
          ),
          [
            t(
              '记录不兼容，复核色卡和样品记录',
              'The records conflict; recheck charts and sample records',
            ),
            t('取平均得到答案', 'Average them for an answer'),
            t('断言一定有人污染样品', 'Claim contamination is certain'),
          ],
          0,
          t(
            '交集为空说明本题条件下不能同时成立，不自动确定错误原因。',
            'An empty overlap means the conditions cannot all hold, without identifying the cause.',
          ),
          'incompatible-indicators',
        ),
      ],
      anotherWay: t(
        '像两条找位置的线索：“在 4.4 右边”和“在 6 左边”。同时满足的部分才保留；它是一段位置，不是一个点。色卡也不是相机色值公式，真实读色还受工具与条件影响。',
        'Think of two location clues: “right of 4.4” and “left of six”. Keep only what satisfies both—a stretch, not a point. A colour chart is not a camera-colour formula; actual reading depends on tools and conditions.',
      ),
      explainPrompt: t(
        '不看选项，说明“两种都黄”为什么可兼容而不是相同精确读数，再解释为什么“范围含 7”不能证明 pH 恰好为 7。',
        'Without options, explain why two yellow readings can overlap without being identical exact readings, and why a range containing seven does not prove pH equals seven.',
      ),
    },
    questions: [
      q(
        'ph-range-q1',
        t(
          '甲基橙黄：pH>4.4；BTB 黄：pH<6。共同范围是什么？',
          'Methyl-orange yellow gives pH>4.4; BTB yellow gives pH<6. What is the overlap?',
        ),
        [t('pH=7', 'pH=7'), t('pH<4.4', 'pH<4.4'), t('4.4<pH<6', '4.4<pH<6')],
        2,
        t('要同时满足两条不等式。', 'Both inequalities must hold.'),
        'intersect-indicator-ranges',
        'application',
      ),
      q(
        'ph-range-q2',
        t(
          '为什么不能把 BTB 过渡区都写成精确 pH 7？',
          'Why can the whole BTB transition category not be reported as exact pH seven?',
        ),
        [
          t(
            '给定类别覆盖 6–7.6，不只一个值',
            'The supplied category covers 6–7.6, not a single value',
          ),
          t('因为所有水样 pH 都是 6', 'Every water sample has pH six'),
          t('因为 BTB 永不变色', 'BTB never changes colour'),
        ],
        0,
        t(
          '简化类别丢失了区间内的细节，不能凭空补回精度。',
          'A coarse category cannot supply missing precision.',
        ),
        'range-not-exact',
      ),
      q(
        'ph-range-q3',
        t(
          '甲基橙红与 BTB 蓝能在本题同一样品中同时成立吗？',
          'Can red methyl orange and blue BTB both fit this exercise’s same sample?',
        ),
        [
          t('能，取两个边界平均即可', 'Yes, average the boundaries'),
          t(
            '不能，pH<3.1 与 pH>7.6 无交集',
            'No, pH<3.1 and pH>7.6 do not overlap',
          ),
          t('能，因为两者都是颜色', 'Yes, both are colours'),
        ],
        1,
        t(
          '先保持不兼容记录，再复核来源。',
          'Keep the conflict visible and recheck its sources.',
        ),
        'incompatible-indicators',
        'application',
      ),
      q(
        'ph-range-q4',
        t(
          '共同范围 7.6<pH≤14 在 25 °C 支持什么？',
          'What does 7.6<pH≤14 support at 25 °C?',
        ),
        [
          t('精确 pH=14', 'Exactly pH fourteen'),
          t(
            '中性，因为 14 是 7 的两倍',
            'Neutral because fourteen is twice seven',
          ),
          t(
            '可确定碱性，精确值仍未确定',
            'Basic class, with exact pH unresolved',
          ),
        ],
        2,
        t(
          '整个允许范围都大于 7，但不只剩一个 pH。',
          'The entire allowed range is above seven without isolating one pH.',
        ),
        'range-versus-class',
        'application',
      ),
      q(
        'ph-range-q5',
        t(
          '本题只画 0–14，说明什么？',
          'What does this exercise’s 0–14 display mean?',
        ),
        [
          t('自然界任何 pH 都绝不越界', 'No pH in nature can exceed it'),
          t(
            '这是给定练习窗口，不是所有情况的极限',
            'It is the given exercise window, not a universal limit',
          ),
          t('pH 只能取整数', 'pH values must be integers'),
        ],
        1,
        t(
          '显示范围和物理定义不能混为一谈。',
          'A display domain is not the full definition.',
        ),
        'ph-model-domain',
      ),
      q(
        'ph-range-q6',
        t(
          '为什么不同指示剂的相同黄色仍要分别查色卡？',
          'Why must the same yellow on different indicators be read against separate charts?',
        ),
        [
          t(
            '各工具的变色范围不同',
            'Tools have different colour-change ranges',
          ),
          t(
            '相同颜色保证相同精确 pH',
            'Equal colour guarantees equal exact pH',
          ),
          t('所有黄色都代表中性', 'Every yellow means neutral'),
        ],
        0,
        t(
          '工具名称与对应色卡是读数的一部分。',
          'Tool identity and its matching chart are part of the reading.',
        ),
        'tool-specific-chart',
      ),
    ],
  },
  {
    id: 'acidic-is-not-positively-charged',
    levelId: 'acids',
    order: 116,
    nextLessonId: 'neutralisation-the-right-amount',
    title: t(
      '酸性水溶液，整杯就带正电吗？',
      'Does an acidic solution have a positive whole-sample charge?',
    ),
    eyebrow: t(
      '酸碱入门衔接 2/2 · H₃O⁺/OH⁻ 与全部电荷分开查',
      'Acid–base bridge 2/2 · Separate H₃O⁺/OH⁻ from whole charge',
    ),
    hook: t(
      '一张完整示意清单有 9 份 H₃O⁺、1 份 OH⁻ 和 8 份 Cl⁻。H₃O⁺ 比 OH⁻ 多，这份溶液的净电荷就一定为正吗？',
      'A complete schematic inventory has nine H₃O⁺, one OH⁻ and eight Cl⁻ relative units. More H₃O⁺ than OH⁻—does that force a positive net charge?',
    ),
    hookHint: t(
      '判断酸碱性比较 H₃O⁺ 与 OH⁻ 浓度；清点总电荷还要把 Cl⁻ 等其他离子算进去。',
      'Acid/base class compares H₃O⁺ with OH⁻ concentrations; whole-charge accounting also includes Cl⁻ and other ions.',
    ),
    bigIdea: t(
      'pH 中性比较 H₃O⁺ 与 OH⁻ 浓度，电中性清点全部带电粒子；这是两个不同的问题。',
      'Neutral pH compares H₃O⁺ and OH⁻ concentrations; electrical neutrality totals all charged particles. They are different questions.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '📋',
        title: t(
          '酸性也可整体电中性',
          'Acidic can still be electrically neutral',
        ),
        body: t(
          '9 份 H₃O⁺ 与 1 份 OH⁻ 支持酸性；加入清单中 8 份 Cl⁻ 后，总电荷为 +9−1−8=0。不能只挑两种离子算整杯电荷。',
          'Nine H₃O⁺ versus one OH⁻ unit supports acidity. Include eight Cl⁻ units and charge is +9−1−8=0. Two selected ion types cannot stand in for the whole charge.',
        ),
      },
      {
        icon: '💧',
        title: t('中性不是离子清零', 'Neutral does not mean no ions'),
        body: t(
          '本题纯水卡也保留 H₃O⁺ 与 OH⁻，相对浓度相等。大量 H₂O 没画出，不表示水只由这些离子组成。',
          'The supplied pure-water card retains H₃O⁺ and OH⁻ at equal relative concentrations. Omitted abundant H₂O does not mean water consists only of these ions.',
        ),
      },
      {
        icon: '🧂',
        title: t(
          '同为 pH 中性，组成可不同',
          'Neutral pH does not fix a unique composition',
        ),
        body: t(
          '本题另一张卡还含 Na⁺ 与 Cl⁻，同时 H₃O⁺ 与 OH⁻ 相等。因此 pH 中性不证明样品只有水；也不能推广说所有盐溶液都中性。',
          'Another supplied card includes Na⁺ and Cl⁻ with equal H₃O⁺ and OH⁻. Neutral pH does not prove pure water, nor that every salt solution is neutral.',
        ),
      },
    ],
    steps: [
      {
        title: t('先认清各离子的整体电荷', 'Identify each ion’s whole charge'),
        body: t(
          'H₃O⁺ 是水合质子的一种常用表示，整个离子带 +1；OH⁻ 整体带 −1。Na⁺ 为 +1，Cl⁻ 为 −1。下标 3 不是电荷 +3，不能把离子内部原子数拿来代替电荷。',
          'H₃O⁺ is a common hydrated-proton representation with whole-ion charge +1; OH⁻ has −1, Na⁺ +1 and Cl⁻ −1. Subscript three is not charge +3; internal atom counts are not ion charges.',
        ),
      },
      {
        title: t(
          '同体积内，比较两种离子的相对浓度',
          'Compare relative concentrations within the same volume',
        ),
        body: t(
          '在本课 25 °C 水溶液模型中，H₃O⁺ 比 OH⁻ 浓度大为酸性，相等为中性，小为碱性。两种离子都可存在；酸性不表示 OH⁻ 完全没有，碱性也不表示 H₃O⁺ 消失。',
          'In this aqueous model at 25 °C, more concentrated H₃O⁺ than OH⁻ is acidic, equal is neutral, and less is basic. Both can exist: acidity does not require zero OH⁻ or basicity zero H₃O⁺.',
        ),
      },
      {
        title: t(
          '总电荷要加上清单中的所有离子',
          'Include every listed ion in whole charge',
        ),
        body: t(
          '9 H₃O⁺、1 OH⁻、8 Cl⁻ 的相对清单，总正电荷为 9，总负电荷绝对值为 1+8=9，净电荷 0，却仍是酸性。本题三类样品都可电中性；电中性不是 pH 7 的另一种说法。',
          'For nine H₃O⁺, one OH⁻ and eight Cl⁻ units, positive charge is nine and negative magnitude 1+8=9, giving net zero while still acidic. All three classes here can be electrically neutral; that is not another name for pH seven.',
        ),
      },
      {
        title: t(
          '取样体积加倍，不等于浓度加倍',
          'Doubling sampling volume does not double concentration',
        ),
        body: t(
          '从同一均匀溶液清点两份体积时，每种离子相对数都加倍，但除以体积后不变；温度和组成不变，所以 pH 不因取样更多而改变。这与往样品加水稀释是不同操作。',
          'Counting twice the volume of one homogeneous solution doubles each relative ion count, but counts per volume stay fixed. With unchanged temperature and composition, pH is unchanged. This differs from adding water to dilute the sample.',
        ),
      },
    ],
    misconception: t(
      '酸性不是整杯带正电，pH 中性也不是没有离子。总粒子数、单位体积的浓度与净电荷各回答不同问题；中性 pH 不能鉴定样品纯净、组成唯一或可饮用。',
      'Acidity is not whole-sample positive charge; neutral pH is not absence of ions. Total counts, concentration and net charge answer different questions. Neutral pH does not identify purity, a unique composition or drinkability.',
    ),
    mission: t(
      '先算酸性卡的全部正负电荷，再用 H₃O⁺/OH⁻ 解释分类。换到含 Na⁺/Cl⁻ 的中性卡，解释它为何不是纯水清单。最后把取样体积从 1 份变 2 份，说明哪些数变了、哪些关系没有变。',
      'Total all charges for an acidic card, then classify using H₃O⁺/OH⁻. Compare a neutral card containing Na⁺/Cl⁻ with pure water. Double sampling volume and explain which counts change and which relations stay fixed.',
    ),
    vocabulary: [
      { en: 'hydronium ion', zh: '水合氢离子' },
      { en: 'hydroxide ion', zh: '氢氧根离子' },
      { en: 'electrical neutrality', zh: '电中性' },
      { en: 'neutral pH', zh: 'pH 中性' },
      { en: 'concentration', zh: '浓度' },
    ],
    interactive: 'aqueous-charge-versus-ph-lab',
    resources: [phReading],
    learning: {
      prerequisites: [
        'indicator-colours-give-ranges',
        'what-is-an-ion',
        'polyatomic-ions-parentheses',
      ],
      objectives: [
        t(
          '由同一体积的 H₃O⁺/OH⁻ 相对数判断酸碱类别。',
          'Classify using relative H₃O⁺/OH⁻ counts in one volume.',
        ),
        t(
          '完整清点所有给定离子的正负电荷。',
          'Audit all supplied ions’ positive and negative charges.',
        ),
        t(
          '区分取样数量改变与浓度、pH 改变。',
          'Separate sampling-count changes from concentration and pH changes.',
        ),
      ],
      workedExample: {
        prompt: t(
          '相对清单：9 H₃O⁺、1 OH⁻、0 Na⁺、8 Cl⁻。它的酸碱类别和净电荷分别是什么？',
          'Relative inventory: nine H₃O⁺, one OH⁻, zero Na⁺, eight Cl⁻. What are its acid/base class and net charge?',
        ),
        steps: [
          t(
            '同一体积中 H₃O⁺>OH⁻，支持酸性。',
            'Within one volume H₃O⁺ exceeds OH⁻, supporting acidity.',
          ),
          t(
            '总正电荷相对份数为 9+0=9；总负电荷绝对值为 1+8=9。',
            'Positive-charge units total 9+0=9; negative magnitude totals 1+8=9.',
          ),
          t(
            '净电荷 9−9=0。若清点两倍体积，所有数加倍，每体积浓度关系仍相同。',
            'Net charge is 9−9=0. Twice the counted volume doubles all counts while preserving concentrations.',
          ),
        ],
        answer: t(
          '酸性，整体电中性。酸碱性与净电荷不能互相替代。',
          'Acidic and electrically neutral. Acid/base class and net charge are not interchangeable.',
        ),
      },
      quickChecks: [
        q(
          'ph-charge-check-1',
          t(
            '判断本题酸碱性，应比较哪项？',
            'What should determine acid/base class here?',
          ),
          [
            t('只看所有阳离子总数', 'Only total cations'),
            t('只看 Cl⁻ 是否存在', 'Only whether Cl⁻ exists'),
            t(
              '同体积 H₃O⁺ 与 OH⁻ 的浓度关系',
              'H₃O⁺/OH⁻ concentrations in the same volume',
            ),
          ],
          2,
          t(
            '其他离子仍影响总电荷，但不是本题这个分类比较的对象。',
            'Other ions remain in whole charge but are not this classification comparison.',
          ),
          'ph-vs-whole-charge',
        ),
        q(
          'ph-charge-check-2',
          t(
            '酸性清单中 OH⁻ 相对数为 1，能成立吗？',
            'Can an acidic inventory contain a nonzero OH⁻ unit?',
          ),
          [
            t(
              '能，酸性不要求 OH⁻ 为零',
              'Yes, acidity does not require zero OH⁻',
            ),
            t('不能，酸里只能有 H₃O⁺', 'No, acids contain only H₃O⁺'),
            t('不能，所有阴离子都消失', 'No, every anion vanishes'),
          ],
          0,
          t(
            '分类比较浓度大小，不是要求另一种离子完全不存在。',
            'Classification compares concentrations, not complete absence of the other ion.',
          ),
          'both-water-ions-present',
        ),
        q(
          'ph-charge-check-3',
          t(
            '取同一均匀溶液两倍体积，温度不变，pH 会怎样？',
            'What happens to pH when twice the volume of the same homogeneous solution is sampled at fixed temperature?',
          ),
          [
            t('一定加倍', 'It doubles'),
            t(
              '保持不变，浓度没有改变',
              'Unchanged, because concentration is unchanged',
            ),
            t('变成 7', 'It becomes seven'),
          ],
          1,
          t(
            '粒子数与体积同倍增加，不是稀释或浓缩。',
            'Counts and volume scale together; this is neither dilution nor concentration.',
          ),
          'volume-vs-concentration',
        ),
      ],
      anotherWay: t(
        '给清单做两种检查：一份只比较 H₃O⁺/OH⁻ 的每体积关系，另一份把所有正负电荷加总。像比较两类人的密度和统计全体人的总账，问的问题不同，不能把一个答案搬给另一个。',
        'Run two audits: one compares H₃O⁺/OH⁻ per volume, the other totals every charge. Comparing two groups’ densities differs from auditing a complete inventory; do not transfer one answer to the other question.',
      ),
      explainPrompt: t(
        '不看选项，解释一份酸性但净电荷为 0 的清单，再说明为什么取两倍体积不会把它变成更低 pH。',
        'Without options, explain an acidic inventory with net zero charge, then explain why sampling twice the volume does not lower its pH.',
      ),
    },
    questions: [
      q(
        'ph-charge-q1',
        t(
          '9 H₃O⁺、1 OH⁻、8 Cl⁻ 的净电荷相对份数是？',
          'What is the net charge of nine H₃O⁺, one OH⁻ and eight Cl⁻ relative units?',
        ),
        [t('+8', '+8'), t('+9', '+9'), t('0', '0')],
        2,
        t(
          '+9−1−8=0；漏记 Cl⁻ 会把部分清单错当整体。',
          '+9−1−8=0; omitting chloride mistakes a partial inventory for the whole.',
        ),
        'complete-aqueous-charge',
        'application',
      ),
      q(
        'ph-charge-q2',
        t(
          '上面这份清单同体积 H₃O⁺ 多于 OH⁻，支持什么？',
          'With H₃O⁺ exceeding OH⁻ in the same volume, what does that inventory support?',
        ),
        [
          t('酸性，仍可整体电中性', 'Acidic while electrically neutral'),
          t('pH 中性，因为净电荷 0', 'Neutral pH because net charge is zero'),
          t('不含阴离子', 'No anions'),
        ],
        0,
        t(
          '酸碱比较与全部电荷是不同账本。',
          'Acid/base comparison and whole charge are separate audits.',
        ),
        'ph-vs-whole-charge',
        'application',
      ),
      q(
        'ph-charge-q3',
        t(
          'H₃O⁺ 的下标 3 表示什么？',
          'What does the subscript three in H₃O⁺ mean?',
        ),
        [
          t('整个离子电荷 +3', 'Whole-ion charge +3'),
          t(
            '一个该离子内部有 3 个 H，整体电荷由右上角 + 给出',
            'Three H within one ion; the superscript + gives its whole charge',
          ),
          t('水溶液 pH=3', 'Solution pH is three'),
        ],
        1,
        t(
          '内部原子数与整体电荷不能混用。',
          'Internal atom count is not whole-ion charge.',
        ),
        'ion-charge-vs-subscript',
      ),
      q(
        'ph-charge-q4',
        t(
          '本题两份记录都 pH 中性，其中一份还有 Na⁺/Cl⁻。哪项正确？',
          'Two supplied records have neutral pH, one also containing Na⁺/Cl⁻. Which is correct?',
        ),
        [
          t('两份一定都只有纯水', 'Both must be pure water'),
          t('有盐就一定碱性', 'Salt always makes a solution basic'),
          t(
            'pH 中性不能唯一确定组成；本题也未证明所有盐都中性',
            'Neutral pH does not uniquely identify composition or prove all salts neutral',
          ),
        ],
        2,
        t(
          'H₃O⁺/OH⁻ 相等不能抹去其他给定离子。',
          'Equal H₃O⁺/OH⁻ does not erase other supplied ions.',
        ),
        'neutral-not-pure',
        'application',
      ),
      q(
        'ph-charge-q5',
        t(
          '从同一溶液清点 1 份改为 3 份体积，哪项不变？',
          'What stays fixed when counting three volume portions instead of one from the same solution?',
        ),
        [
          t('H₃O⁺ 相对总数', 'The relative H₃O⁺ total'),
          t(
            '每体积相对浓度与该溶液 pH',
            'Relative concentration per volume and the solution pH',
          ),
          t('所取体积', 'The volume counted'),
        ],
        1,
        t(
          '所有相对数与体积同倍改变，比例不变。',
          'All counts and volume scale together, preserving concentration.',
        ),
        'volume-vs-concentration',
        'application',
      ),
      q(
        'ph-charge-q6',
        t(
          '“中性水没有任何离子”这句话为什么不对？',
          'Why is “neutral water has no ions” incorrect?',
        ),
        [
          t(
            '本题中性水仍有 H₃O⁺ 与 OH⁻，浓度相等',
            'Neutral water retains H₃O⁺ and OH⁻ at equal concentrations',
          ),
          t(
            '中性水一定带净正电',
            'Neutral water must have net positive charge',
          ),
          t('水没有任何粒子', 'Water has no particles'),
        ],
        0,
        t(
          '中性是两者浓度相等，不是都为零。',
          'Neutrality means equal concentrations, not both zero.',
        ),
        'both-water-ions-present',
      ),
    ],
  },
];
