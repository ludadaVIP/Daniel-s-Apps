import { t, type AnswerSpec } from '../model';
import { reasoning, numeric } from './builders';

type Unit = NonNullable<Extract<AnswerSpec, { kind: 'number' }>['unit']>;
const simplest = (
  id: string,
  zh: string,
  en: string,
  value: string,
  unit: Unit,
  solutionZh: string,
  solutionEn: string,
  rejected: string[],
) => {
  const q = numeric(
    id,
    t(zh, en),
    value,
    'simplest-fraction',
    [
      t(
        '找分子分母共同的正因数；约分不能只改一边。',
        'Find a shared positive factor; reducing cannot change only one part.',
      ),
      t(
        '约完后检查两数是否还可以同除大于1的整数，再核实际量与单位。',
        'After reducing, check whether both numbers still share an integer factor greater than one, and check amount and unit.',
      ),
    ],
    [t(solutionZh, solutionEn)],
    { accepted: [value, `${value} ${unit}`], rejected },
  );
  q.answer = {
    kind: 'number',
    value,
    unit,
    formats: ['fraction', 'decimal'],
    fractionRule: 'simplest',
  };
  q.type = 'fraction';
  return q;
};
const bridges = (unit: string) =>
  Object.fromEntries(
    ['P53-L02', 'P53-L03', 'P53-L05', 'P53-L06'].map((l, i) => [
      `${unit}-MAINT-P53-Q${i + 1}`,
      l,
    ]),
  );

export const fractionRetrieval = {
  P61: {
    id: 'P61-MAINT-P53',
    unit: 'P61',
    bridge: 'P53-L02',
    bridgeByQuestion: bridges('P61'),
    title: t(
      '分数运算之后，再看整体与表示',
      'After fraction operations, revisit wholes and representations',
    ),
    intro: t(
      '完成P61后，每次选一两题，四题可以分两次做。用固定标尺画图、说理由；解释由家长核验，数值题须满足题目要求的表示形式。',
      'After P61, choose one or two tasks per sitting and split the four tasks if useful. Draw using a fixed reference and explain. A parent reviews reasoning; numerical entries must meet the requested form.',
    ),
    questions: [
      reasoning(
        'P61-MAINT-P53-Q1',
        t(
          '把1 L作为固定整体，画出3/4 L、4/4 L、5/4 L的量；容器足够大。分别按本课正分数约定分类真分数或假分数，并说各有几个完整的1 L。为什么4/4也是假分数？',
          'Using one litre as a fixed whole and containers with enough capacity, draw 3/4 L, 4/4 L and 5/4 L. Classify each positive fraction as proper or improper and state the number of complete litres. Why is 4/4 also improper?',
        ),
        'proper-improper',
        t(
          '3/4分子小于分母，为真分数，0个完整升；4/4=1，分子等于分母，也是假分数，1个完整升；5/4>1是假分数，1个完整升另余1/4 L。每个完整标尺都仍为1 L，不能把五个四分之一挤成一个新整体；“假”不表示量不存在，也不要求严格大于1。',
          '3/4 has a smaller numerator and is proper, with zero complete litres. 4/4 equals one and is improper at the equality boundary, with one complete litre. 5/4 is improper, with one complete litre and 1/4 L left. Every full reference remains one litre; do not redefine the whole to fit five quarters. Improper does not mean unreal or strictly greater than one.',
        ),
        [
          t(
            '每四个四分之一才合成一个固定的1 L。',
            'Every four quarters form one fixed litre.',
          ),
          t(
            '把分子与分母比较时，也检查恰好相等的边界。',
            'Include equality when comparing numerator and denominator.',
          ),
        ],
      ),
      reasoning(
        'P61-MAINT-P53-Q2',
        t(
          '把17/5 L写成带分数，再把2 3/7 L写成假分数。画固定1 L的分数条，解释整数部分怎样换成相应小份，并把两个结果换回核验。',
          'Write 17/5 L as a mixed number and 2 3/7 L as an improper fraction. Draw fraction strips using one-litre wholes, explain how whole-number parts become small shares, and convert both results back as checks.',
        ),
        'mixed-fraction',
        t(
          '17=3×5+2，所以17/5=3 2/5 L；三整升是十五个五分之一，另两份。2 3/7 L中两整升是十四个七分之一，加三份得17/7 L；17=2×7+3换回2 3/7。分母表示同一升内的等份单位，不能把2 3/7写成(2+3)/7。',
          '17=3×5+2, so 17/5=3 2/5 L: three whole litres contain fifteen fifths, with two fifths left. In 2 3/7 L the two whole litres contain fourteen sevenths; add three more for 17/7 L. Since 17=2×7+3, converting back gives 2 3/7. Denominators name equal shares of one litre; 2 3/7 is not (2+3)/7.',
        ),
        [
          t(
            '先问一个整升包含几个五分之一或七分之一。',
            'How many fifths or sevenths make one whole litre?',
          ),
          t(
            '除法的商给完整整体个数，余数给剩余小份数。',
            'The quotient counts complete wholes; the remainder counts small shares left.',
          ),
        ],
      ),
      simplest(
        'P61-MAINT-P53-Q3',
        '量杯里有18/24 L水。只换表示、不倒水，用最简分数写出升数。',
        'A jug contains 18/24 L. Without pouring any away, express the same number of litres as a fraction in simplest form.',
        '3/4',
        'L',
        '18与24同除最大公因数6得3/4 L，3和4无大于1的共同因数。6/8等值却未最简；0.75等值，但本题要求最简分数表示。总量没有变化。',
        'Divide eighteen and twenty-four by their greatest common factor six to obtain 3/4 L. Three and four share no factor greater than one. 6/8 is equivalent but not simplest; 0.75 is equivalent but does not meet the requested fraction form. No liquid was removed.',
        ['18/24', '6/8', '0.75', '3/8', '3/4 m'],
      ),
      reasoning(
        'P61-MAINT-P53-Q4',
        t(
          '同一米标尺下，7/12 m与5/8 m哪个长？用共同小份比较，不只报答案。另一个问题改为取12 m的7/12与8 m的5/8，哪份实际长？解释为什么前面的分数排序不能直接决定后面的实际长度。',
          'On the same one-metre reference, which is longer: 7/12 m or 5/8 m? Compare common-size shares. In a different problem, compare 7/12 of twelve metres with 5/8 of eight metres. Explain why the earlier fraction ordering does not decide these actual lengths.',
        ),
        'fraction-comparison',
        t(
          '同一米下7/12=14/24 m，5/8=15/24 m，所以5/8 m较长，差1/24 m。换整体后12×7/12=7 m，8×5/8=5 m，第一份实际更长。分数数值仍7/12<5/8，改变的是参考整体；未知整体时不能单凭比例判断实际量。',
          'On the common metre, 7/12=14/24 m and 5/8=15/24 m, so 5/8 m is longer by 1/24 m. With changed wholes, twelve times 7/12 is seven metres and eight times 5/8 is five metres; the first actual amount is now longer. The fraction values still satisfy 7/12<5/8. The reference wholes changed; unknown wholes cannot be ignored.',
        ),
        [
          t(
            '先找到12与8的共同分母，再数同大小的小份。',
            'Use a common denominator for twelve and eight, then compare equal-sized shares.',
          ),
          t(
            '后半问先把两份都还原成米，再比较。',
            'For the second problem, recover both measured lengths in metres first.',
          ),
        ],
      ),
    ],
  },
  P65: {
    id: 'P65-MAINT-P53',
    unit: 'P65',
    bridge: 'P53-L02',
    bridgeByQuestion: bridges('P65'),
    title: t(
      '字母情境中的分数表示',
      'Fraction representations in letter contexts',
    ),
    intro: t(
      '学完P65后，分次选择四题中的一两题。字母只给量起名字，分数的整体与等份意义仍需解释；可以用纸笔，家长核验解释，不计时。',
      'After P65, choose one or two of these four tasks in separate sittings. Letters name quantities; wholes and equal shares still need explanation. Paper is welcome, a parent reviews reasoning, and there is no timer.',
    ),
    questions: [
      reasoning(
        'P65-MAINT-P53-Q1',
        t(
          '用固定1 m单位条表示a=2/3 m、b=3/3 m、c=7/3 m。分别将分数分类为真分数或假分数，标完整米数和剩余量，并说明字母c不允许把原单位改成7/3 m。',
          'Using fixed one-metre strips, represent a=2/3 m, b=3/3 m and c=7/3 m. Classify each fraction as proper or improper, mark complete metres and leftovers, and explain why naming c does not redefine a whole as 7/3 m.',
        ),
        'proper-improper',
        t(
          '2/3是真分数，0个完整米另2/3 m；3/3=1是假分数，1个完整米无剩余；7/3是假分数，2个完整米另1/3 m。字母是长度的名字，每根完整条仍为1 m；分子等于分母已属于假分数，改单位会改变原题的数值含义。',
          '2/3 is proper, with zero complete metres and 2/3 m left. 3/3 equals one and is improper, with one complete metre. 7/3 is improper, with two complete metres and 1/3 m left. A letter names a length; each complete strip remains one metre. Equality of numerator and denominator belongs to the improper boundary; redefining the unit changes the original quantities.',
        ),
        [
          t(
            '把三份相同的三分之一合成一整米。',
            'Group three equal thirds into each complete metre.',
          ),
          t(
            '字母改变了量的写法，是否改变了米这个单位？',
            'Does naming a quantity with a letter change the metre unit?',
          ),
        ],
      ),
      reasoning(
        'P65-MAINT-P53-Q2',
        t(
          '给定x=10/3 m，把x写成带分数；另有y=4 1/5 m，把y写成假分数。用单位条说明完整米和剩余小份，再逆向换回。为什么不能把4 1/5写成5/5？',
          'Given x=10/3 m, write x as a mixed number. Given y=4 1/5 m, write y as an improper fraction. Use unit strips to explain whole metres and leftover shares, then convert back. Why is 4 1/5 not 5/5?',
        ),
        'mixed-fraction',
        t(
          '10=3×3+1，所以x=3 1/3 m；四整米含20个五分之一，另1份得y=21/5 m，21=4×5+1换回4 1/5。4是四个整米，不是四个五分之一；5/5只有1 m。两次转换都保持原长度和单位。',
          '10=3×3+1, giving x=3 1/3 m. Four whole metres contain twenty fifths; one more gives y=21/5 m, and 21=4×5+1 converts back to 4 1/5. Four counts whole metres, not four fifths. 5/5 is only one metre. Both conversions preserve length and unit.',
        ),
        [
          t(
            '整数部分要乘每整米包含的小份数。',
            'Multiply the whole-number part by the number of shares in each metre.',
          ),
          t(
            '用分母×整数商+余数恢复原分子。',
            'Recover the original numerator using denominator times whole quotient plus remainder.',
          ),
        ],
      ),
      simplest(
        'P65-MAINT-P53-Q3',
        '给定5x=3，x是某条彩带的米数。有人给出等值候选x=21/35。把x写成最简分数，单位m。',
        'In 5x=3, x is a ribbon length measured in metres. An equivalent candidate is x=21/35. Write x as a fraction in simplest form, in metres.',
        '3/5',
        'm',
        '21与35同除7得3/5 m，3与5互质。核5×3/5=3，符合原关系；6/10或21/35虽等值仍未最简，0.6不符合本题指定分数形式。',
        'Divide twenty-one and thirty-five by seven to get 3/5 m, whose numerator and denominator are coprime. Check 5×3/5=3 in the original relationship. 6/10 and 21/35 are equivalent but not simplest; 0.6 does not meet the requested fraction form.',
        ['21/35', '6/10', '0.6', '3/7', '3/5 L'],
      ),
      reasoning(
        'P65-MAINT-P53-Q4',
        t(
          '同一米单位下u=5/9 m、v=7/12 m，用共同小份判断哪个更长。另一个问题把u改为18 m的5/9、v改为12 m的7/12，实际量的大小是否仍相同排序？写出两次比较的依据。',
          'On the same metre reference, compare u=5/9 m and v=7/12 m using common shares. In another problem, redefine u as 5/9 of eighteen metres and v as 7/12 of twelve metres. Does the ordering of actual amounts stay the same? Justify both comparisons.',
        ),
        'fraction-comparison',
        t(
          '共同分母36：5/9=20/36 m，7/12=21/36 m，故原v较长，差1/36 m。换整体后u=18×5/9=10 m，v=12×7/12=7 m，故u实际较长。分数数值5/9<7/12没有改变，但分数对应的整体改变；不能按分母、分子单独大小或字母名字判长度。',
          'Using thirty-sixths, 5/9=20/36 m and 7/12=21/36 m, so v is initially longer by 1/36 m. With changed wholes, u=18×5/9=10 m and v=12×7/12=7 m, so u is now longer. The number ordering 5/9<7/12 remains fixed; reference wholes changed. Neither denominator size, numerator size nor letter name alone decides length.',
        ),
        [
          t(
            '同整体比较先把分子分母同步通分。',
            'For the same whole, rescale numerator and denominator together.',
          ),
          t(
            '分数的大小与取某个整体后得到的实际量是两次不同的比较。',
            'Comparing fraction values and comparing shares of specified wholes are different tasks.',
          ),
        ],
      ),
    ],
  },
};
