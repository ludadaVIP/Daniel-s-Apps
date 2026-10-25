import { t } from '../model';

// Feedback follows the stable option IDs of the original B04 questions.
// A wrong option identifies a particular quantity/representation error.
export const b04ChoiceFeedback: Record<string, ReturnType<typeof t>[]> = {
  'L01-Q1': [
    t(
      '选中的等份数由分子记录；分母记录原整体一共被分成多少等份，不能把两者调换。',
      'The numerator counts selected equal parts; the denominator counts all equal parts in the original whole. Do not swap their roles.',
    ),
    t(
      '分母记录一个整体的等份总数；还须确认各份大小相等，不只是数出几块。',
      'The denominator counts all EQUAL parts in one whole. Check equal size as well as the number of pieces.',
    ),
    t(
      '人数不直接定义分母；即使每人恰好分一份，也要先规定整体并确认等分。',
      'The number of people does not define a denominator. Even with one share per person, first identify the whole and check equal shares.',
    ),
  ],
  'L02-G': [
    t(
      '同一整体的一半可分成两个四分之一；2/4>1/4，所以1/2更大。',
      'A half of the same whole contains two quarters: 2/4>1/4, so 1/2 is greater.',
    ),
    t(
      '分成四份会让每份更小。1/4只有一份，1/2相当于两份四分之一，不能按4>2反推。',
      'Four equal shares make each smaller. 1/4 is one quarter, while 1/2 is two quarters; denominator order does not reverse this.',
    ),
  ],
  'L02-Q3': [
    t(
      '1/2=3/6，包含三个六分之一；题目要最小，一份1/6更小。',
      '1/2=3/6 contains three sixths. The task asks for the smallest, and one sixth is smaller.',
    ),
    t(
      '1/3=2/6，仍比一份1/6大。先保同一个整体，再统一成六分之一比较。',
      '1/3=2/6 is still greater than one sixth. Keep the same whole and compare in sixths.',
    ),
    t(
      '同一整体分成六等份，一份1/6小于1/3=2/6与1/2=3/6。',
      'For the same whole, one sixth is smaller than 1/3=2/6 and 1/2=3/6.',
    ),
  ],
  'L03-Q3': [
    t(
      '1/4<1/2=2/4，所以1/4在一半左边，题目要右边的数。',
      '1/4<1/2=2/4, so one quarter lies LEFT of one half; the task asks for a point on the right.',
    ),
    t(
      '3/4>1/2=2/4；同一数轴向右增大，因此3/4在右边。',
      '3/4>1/2=2/4. Numbers increase to the right on the same axis, so three quarters lies on the right.',
    ),
    t(
      '1/3=2/6，而1/2=3/6；三分之一在一半左边，不因分母3比2大就向右。',
      '1/3=2/6, while 1/2=3/6. One third is LEFT of one half; a larger denominator does not put it farther right.',
    ),
  ],
  'L04-Q3': [
    t(
      '0.5=0.50=50/100，比0.45的45/100多5/100，所以0.5更大。',
      '0.5=0.50=50/100 exceeds 0.45=45/100 by 5/100, so 0.5 is greater.',
    ),
    t(
      '两位小数不一定较大；0.45是45个百分之一，0.5是50个百分之一。',
      'More decimal places do not mean greater value: 0.45 is forty-five hundredths, while 0.5 is fifty hundredths.',
    ),
    t(
      '0.50−0.45=0.05，不是0。补尾零保值，不会把45格变成50格。',
      '0.50−0.45=0.05, not zero. A final zero preserves value; it cannot turn forty-five cells into fifty.',
    ),
  ],
  'L05-Q3': [
    t(
      'NZ$2.05是2元5分；题目给50分，对应0.50元，不能漏掉十分位的5。',
      'NZ$2.05 is two dollars and five cents. Fifty cents means 0.50 dollar, so the five belongs in tenths.',
    ),
    t(
      '50分=50/100元=0.50元，2元加0.50元就是NZ$2.50。',
      'Fifty cents=50/100 dollar=0.50 dollar, so two dollars plus 0.50 dollar gives NZ$2.50.',
    ),
    t(
      '0.005元=0.5分，不是50分；NZ$2.005代表200.5分，题目要求250分。小数位值必须保留。',
      '0.005 dollar is 0.5 cent, not fifty cents. NZ$2.005 means 200.5 cents, while the task asks for 250 cents. Preserve place value.',
    ),
  ],
};
