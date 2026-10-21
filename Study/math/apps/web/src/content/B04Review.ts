import { t, type Question } from '../model';
import { numeric, reasoning } from './builders';
const hints = [
  t(
    '先确认整体、等份数或小数点后的数位。',
    'Identify the whole, equal parts or decimal places first.',
  ),
  t(
    '用同一整体的图或元分位值核验，解释0占着哪一位。',
    'Check a common-whole diagram or dollar-and-cent places, including what a zero holds.',
  ),
];
const n = (
  i: number,
  zh: string,
  en: string,
  value: string,
  skill: string,
  zs: string,
  es: string,
  accepted: string[],
  rejected: string[],
): Question =>
  numeric(`B04-CHECK-Q${i}`, t(zh, en), value, skill, hints, [t(zs, es)], {
    accepted,
    rejected,
  });
export const b04CheckQuestions: Question[] = [
  n(
    1,
    '一张同样大小的纸平均分成8份，涂3份。涂了整体的几分之几？',
    'One sheet is divided into eight equal parts and three are shaded. What fraction is shaded?',
    '3/8',
    'fraction',
    '分母8记录整体的等份，分子3记录涂色份数。',
    'Eight records equal parts of the whole; three records shaded parts.',
    ['3/8', '6/16', '0.375'],
    ['3/5', '8/3', '3'],
  ),
  n(
    2,
    '同一张纸平均分成4份，取1份。写所取分数。',
    'Divide one sheet into four equal parts and take one. Write the fraction.',
    '1/4',
    'unit-fraction',
    '四等份中的一份是1/4，不是1/3。',
    'One of four equal parts is 1/4, not 1/3.',
    ['1/4', '2/8', '0.25'],
    ['1/3', '4', '3/4'],
  ),
  {
    ...n(
      3,
      '数轴0到1平均分10段，P在从0起第6个分点。P表示几分之几？',
      'The interval from zero to one has ten equal sections. P is at the sixth division from zero. What fraction is P?',
      '3/5',
      'fraction-axis',
      '先数6段，每段1/10，得6/10=3/5；点的位置不因写法变化。',
      'Six sections of 1/10 give 6/10=3/5; equivalent notation keeps the same point.',
      ['3/5', '6/10', '0.6'],
      ['6', '1/6', '6/9'],
    ),
    diagram: {
      kind: 'axis',
      start: 0,
      end: 1,
      divisions: 10,
      point: 0.6,
      label: 'P',
    },
  },
  {
    ...n(
      4,
      '百格图涂38格，把涂色部分写成小数。',
      'A hundred grid has 38 shaded squares. Write the shaded part as a decimal.',
      '0.38',
      'decimal',
      '38个百分之一是0.38；0.038是38个千分之一。',
      'Thirty-eight hundredths is 0.38; 0.038 is thirty-eight thousandths.',
      ['0.38', '0.380'],
      ['38', '0.038', '38/100'],
    ),
    answer: { kind: 'number', value: '0.38', formats: ['decimal'] },
  },
  n(
    5,
    '价格NZ$2.07中，小数部分是多少分？只填分数值。',
    'In price NZ$2.07, how many cents are in the fractional-dollar part? Enter the number of cents.',
    '7',
    'money',
    '0.07元是7分，十分位0占位；不是70分，也不是总价207分。',
    '0.07 dollars is seven cents; zero holds the tenths place. This is neither seventy cents nor total price 207 cents.',
    ['7', '07', '7.0'],
    ['70', '207', '0.07'],
  ),
  {
    ...n(
      6,
      '虚构购物：价格NZ$4.80，付NZ$10.00，应找零多少NZD？',
      'Fictional shopping: the price is NZ$4.80 and payment NZ$10.00. What change is due in NZD?',
      '5.20',
      'money',
      '10.00−4.80=5.20元，可用4.80+5.20=10.00核验。',
      '10.00−4.80=5.20 dollars; check 4.80+5.20=10.00.',
      ['5.2', '5.20', 'NZ$5.20'],
      ['520', '5.02', '4.80'],
    ),
    answer: { kind: 'number', value: '5.20', unit: 'NZD' },
  },
  reasoning(
    'B04-CHECK-Q7',
    t(
      '用图解释同一整体的1/2为什么大于1/4；若两块纸原来大小不同，还能只比分母吗？',
      'Explain with a diagram why 1/2 exceeds 1/4 of the same whole. Can denominators alone compare pieces from differently sized sheets?',
    ),
    'unit-fraction',
    t(
      '先画同样大的整体，一半可再平分成两个四分之一，因此1/2=2/4>1/4。分数比较依赖相同参照整体；原纸大小不同时，仅比分母不能比较实际面积，应先统一整体或给出原面积。',
      'Use equal-sized wholes. Splitting one half again makes two quarters, so 1/2=2/4>1/4. Comparing the actual shaded areas requires a shared reference whole. With different sheet sizes, denominators alone are insufficient; establish a common whole or the original areas.',
    ),
    hints,
  ),
  reasoning(
    'B04-CHECK-Q8',
    t(
      '用元与分解释NZ$2.07与NZ$2.70为什么不同，并说明NZ$2.7与NZ$2.70是否相等。',
      'Use dollars and cents to distinguish NZ$2.07 from NZ$2.70, and explain whether NZ$2.7 equals NZ$2.70.',
    ),
    'money',
    t(
      '两者都有2元，后面分别7分与70分，差63分。2.07的0保持十分位，不能删除成2.7；2.7=2.70是7个十分之一即70分，末尾补0不改值。理由应说明位值，而不是说小数位越多越大。',
      'Both have two dollars, followed by seven cents and seventy cents, differing by 63 cents. The internal zero in 2.07 holds the tenths place and cannot be deleted. 2.7=2.70 because seven tenths equals seventy hundredths; an appended trailing zero preserves value. Explain place value rather than comparing digit counts.',
    ),
    hints,
  ),
];
