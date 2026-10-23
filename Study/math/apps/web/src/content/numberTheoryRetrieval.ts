import { t } from '../model';
import { reasoning } from './builders';

export const numberTheoryRetrieval = {
  P53: {
    id: 'P53-MAINT-P51',
    unit: 'P53',
    bridge: 'P51-L04',
    bridgeByQuestion: {
      'P53-MAINT-P51-Q1': 'P51-L04',
      'P53-MAINT-P51-Q2': 'P51-L05',
    },
    title: t(
      '分数之后，再看整数结构',
      'After fractions, revisit integer structure',
    ),
    intro: t(
      '分次选择这两道整数维护题。先列因数或画等组，再向家长解释分类与最大、最小的依据；不计时，可以看提示。',
      'Choose these two integer retrieval tasks across separate sittings if useful. List factors or draw groups first, then explain classifications and greatest or least choices to a parent. There is no timer; hints are available.',
    ),
    questions: [
      reasoning(
        'P53-MAINT-P51-Q1',
        t(
          '将0、1、2、15、17分别分类为质数、合数或两者都不是。用不同正因数解释，至少完整列出15与17的正因数，并纠正“奇数一定是质数”。',
          'Classify 0, 1, 2, 15 and 17 as prime, composite or neither. Explain using distinct positive factors. List all positive factors of at least fifteen and seventeen, and correct the claim that every odd number is prime.',
        ),
        'prime-composite',
        t(
          '质数要求大于1且恰有两个不同正因数；合数大于1且有两个以上。0、1都不是；2的正因数1、2，是唯一偶质数；15的1、3、5、15共四个，是奇合数；17仅1、17，是奇质数。可按因数对逐个试到小因子4：2、3、4均不整除17，5及以上与自身配对会超过17，故无新因数对。不能把0作除数，也不能把1算质数。',
          'A prime is greater than one with exactly two distinct positive factors; a composite is greater than one with more than two. Zero and one are neither. Two has factors one and two and is the only even prime. Fifteen has factors one, three, five and fifteen and is an odd composite. Seventeen has only one and seventeen and is prime. Check factor pairs with smaller entry up to four: two, three and four do not divide seventeen; a pair with both entries at least five would exceed seventeen. Zero is not a divisor, and one is not prime.',
        ),
        [
          t(
            '先应用“大于1”的条件，再数不同正因数。',
            'Apply the greater-than-one condition before counting distinct positive factors.',
          ),
          t(
            '成对列因数；奇偶本身不决定分类。',
            'List factor pairs; parity alone does not determine classification.',
          ),
        ],
      ),
      reasoning(
        'P53-MAINT-P51-Q2',
        t(
          '虚构材料有36张红卡、48张蓝卡，平均装成相同的若干袋，每袋两种卡的数量各自相同且不剩，最多几袋？另有两个纸上信号从零同起，每6分钟和10分钟一次，下次同现何时？列36的所有不同正因数及需要的另一列，证明最大与最小；解释为什么零不是所求时间。',
          'There are thirty-six red cards and forty-eight blue cards. Make as many identical bags as possible, with equal red counts in every bag and equal blue counts in every bag, leaving none. How many bags? Separately, two paper signals start together at zero and repeat every six and ten minutes. When do they next coincide? List all distinct positive factors of thirty-six and the other needed lists, justify greatest and least, and explain why zero is not the requested time.',
        ),
        'common-factors-multiples',
        t(
          '36的正因数1、2、3、4、6、9、12、18、36，共9个，6×6只列一次；48为1、2、3、4、6、8、12、16、24、48。共同为1、2、3、4、6、12，最大12袋，每袋3红4蓝。信号正时点6、12、18、24、30…与10、20、30…首次共同30min，30=6×5=10×3。零虽是共同倍数，却是已发生的起点，不是下次；最大公因数回答共同整除，最小正公倍数回答共同出现，不能交换。',
          'The positive factors of thirty-six are 1,2,3,4,6,9,12,18,36: nine distinct factors, counting six once. Those of forty-eight are 1,2,3,4,6,8,12,16,24,48. Common factors are 1,2,3,4,6,12, so twelve bags is greatest, each with three red and four blue cards. Positive signal times 6,12,18,24,30,… and 10,20,30,… first coincide at thirty minutes: 30=6×5=10×3. Zero is a common multiple but is the starting time, not the next event. Greatest common factors concern shared divisors; least positive common multiples concern recurrence.',
        ),
        [
          t(
            '装袋数须同时整除两种卡总数；信号时刻须同时在两列倍数里。',
            'Bag count must divide both card totals; signal time must belong to both multiple lists.',
          ),
          t(
            '成对列因数时避免重复平方根；倍数从第一个正时点开始。',
            'Avoid repeating the square-root factor; begin recurrence lists with positive times.',
          ),
        ],
      ),
    ],
  },
  P63: {
    id: 'P63-MAINT-P51',
    unit: 'P63',
    bridge: 'P51-L04',
    bridgeByQuestion: {
      'P63-MAINT-P51-Q1': 'P51-L04',
      'P63-MAINT-P51-Q2': 'P51-L05',
    },
    title: t(
      '比与比例之后，再看整数结构',
      'After ratios, revisit integer structure',
    ),
    intro: t(
      '另选一次回看整数分类和分组，两个任务可以分开做。说明为什么，不只报答案；解释仍由家长核验，不影响原单元回顾。',
      'Revisit integer classification and grouping in another sitting. Split the two tasks if useful. Give reasons rather than final answers alone; a parent reviews explanations separately from the unit check.',
    ),
    questions: [
      reasoning(
        'P63-MAINT-P51-Q1',
        t(
          '一份分类卡写0、1、2、19、21。用不同正因数把它们分成质数、合数、两者都不是，完整列出19和21的正因数。一个人说“偶数一定合数，奇数一定质数”，给反例并解释。',
          'Sort cards labelled 0,1,2,19,21 into prime, composite and neither, using distinct positive factors. List all positive factors of nineteen and twenty-one. Refute both claims that every even number is composite and every odd number is prime.',
        ),
        'prime-composite',
        t(
          '0、1两者都不是，因为定义先要求大于1；2的因数仅1、2，是偶质数。19的因数1、19，为质数；试小因子2、3、4均不整除，若一对因子均至少5乘积会超过19，故无遗漏。21的因数1、3、7、21，为奇合数。2与21分别反驳两条全称说法，奇偶不能代替因数定义。',
          'Zero and one are neither because both definitions require a number greater than one. Two has only factors one and two and is an even prime. Nineteen has factors one and nineteen: smaller candidates two, three and four do not divide it, while a pair both at least five would exceed nineteen. Twenty-one has factors one, three, seven and twenty-one and is an odd composite. Two and twenty-one refute the respective universal claims; parity cannot replace the factor definition.',
        ),
        [
          t(
            '先把0与1按定义处理，不把它们硬塞到两类之一。',
            'Handle zero and one from the definitions before sorting the other numbers.',
          ),
          t(
            '反例须满足原说法的条件，却不满足其结论。',
            'A counterexample must meet the premise but fail the conclusion.',
          ),
        ],
      ),
      reasoning(
        'P63-MAINT-P51-Q2',
        t(
          '36枚圆片与54张贴纸，做相同的完整礼袋，每袋两类数量各自相同、两类都不剩，最多几袋？另有两个纸上节拍从零同起，每9秒与12秒一次，下次同拍何时？列因数和正倍数证明答案，并说明36的平方因数为什么不能重复计。',
          'Make the greatest number of identical gift bags from thirty-six counters and fifty-four stickers, with equal counts of each type in every bag and none left. Separately, two paper beats start together at zero, repeating every nine and twelve seconds. When do they next coincide? Justify with factor and positive-multiple lists, and explain why the square factor of thirty-six is counted once.',
        ),
        'common-factors-multiples',
        t(
          '36因数1、2、3、4、6、9、12、18、36；54因数1、2、3、6、9、18、27、54。共同最大18袋，每袋2枚圆片、3张贴纸；6×6中6是同一个不同因数，36有9个不同正因数。9的正倍数9、18、27、36…，12的为12、24、36…，首次共同36s，36=9×4=12×3。0是共同零倍，但不是下一次正时点；18不能同时成为9与12的倍数，不能混用装袋数。',
          'Factors of thirty-six are 1,2,3,4,6,9,12,18,36; factors of fifty-four are 1,2,3,6,9,18,27,54. Their greatest common factor is eighteen, giving two counters and three stickers per bag. In 6×6, six is one distinct factor, so thirty-six has nine positive factors. Positive multiples 9,18,27,36,… and 12,24,36,… first coincide at thirty-six seconds, with 36=9×4=12×3. Zero is the shared starting time. Eighteen is not a multiple of twelve, so the bag answer cannot replace the beat answer.',
        ),
        [
          t(
            '把共同整除与共同出现分开列，不凭数字大小选运算。',
            'List shared divisors separately from shared occurrences.',
          ),
          t(
            '最大或最小需要比较完整所需列表，不只检验一个候选能用。',
            'Greatest or least requires comparing the necessary lists, not just finding one usable candidate.',
          ),
        ],
      ),
    ],
  },
};
