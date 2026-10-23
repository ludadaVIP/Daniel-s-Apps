import { t } from '../model';
const pair = (i: number) =>
  ['H31', 'H38'].map((u) => `${u}-MAINT-SEQUENCE-Q${i}`);
const e = (
  skill: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H07-L0${i}`,
  sourceTask: `H07-L0${i}-Q6`,
  targets: pair(i),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const sequenceRecurrenceEvidence = [
  e(
    'sequence-index-rule-evidence',
    1,
    '有限前缀、多规则与序号域',
    'Finite prefixes,multiple rules and index domains',
    'H31以前缀2/5/8、H38以前缀1/4/9，各构完整原式及加(n−1)(n−2)(n−3)的另一规则，前三同而第四11/17或16/22。精确反例证明不唯一而非常见预测错误；n0虽可代式仍在声明正整数序号外。',
    'Each constructs two complete rules sharing the observed three terms but giving fourth terms11/17 or16/22. The added cubic vanishes at every observed index. This proves non-identification,not that the familiar prediction is wrong. Formula evaluation at zero does not expand the declared positive-integer domain.',
  ),
  e(
    'arithmetic-index-gaps',
    2,
    '不同序号恢复与重复条件不足',
    'Distinct-index recovery versus repeated conditions',
    'H31由a2=5/a7=20恢复d3/a1=2/a10=29；H38由a3=8/a9=−4得d−2/a1=12/a6=2。一般差=(序号差)d，保序号不等；另只重复同一项各给d0和d1完整反例，不用0/0擅定公差。',
    'H31 recovers d3,a₁2,a₁₀29 from indices2/7; H38 recovers d−2,a₁12,a₆2 from3/9. Both derive the index-gap identity with distinct indices required. Repeating one observation admits explicit d0/d1 sequences rather than assigning a difference through0/0.',
  ),
  e(
    'arithmetic-sum-two-copies',
    3,
    '双份配对、相邻和与空和',
    'Two-copy pairing,consecutive sums and empty sums',
    '两处亲写正倒两份证明2Sn=n(a1+an)。H31 S10/S9=155/126差29，H38 S8/S7=40/42差−2；均区分Sn/n平均与末项，一般消去前n−1项并定义S0=0核n1，负项可使部分和下降。',
    'Both derive2Sₙ=n(a₁+aₙ) by pairing forward and reverse copies. Consecutive sums155/126 recover29,while40/42 recover−2. They distinguish averages from final terms,prove cancellation generally,and retain S₀=0 at n1. Negative terms may reduce a partial sum.',
  ),
  e(
    'geometric-ratio-sign-zero',
    4,
    '负公比、首项指数与零递推约定',
    'Negative ratios,first-index exponents and zero recurrences',
    'H31 8乘−1/2生成五项，H38 −3乘−2生成五项，逐个相邻商和通项保n−1奇偶。零倍率递推虽唯一可算，后续0/0不满足本课非零项/非零公比定义；全零也不由未定义商认证公比1。',
    'Both generate five alternating terms,check every ratio,and retain n−1 in the nth-term rule. Zero-multiplier recurrences remain computable but later0/0 ratios fail the explicitly stated nonzero-term/nonzero-ratio convention. An all-zero sequence cannot acquire ratio one from an undefined quotient.',
  ),
  e(
    'finite-geometric-tail-and-unit-ratio',
    5,
    '错位消项保尾与q1原和',
    'Shifted cancellation retaining tails and the q1 branch',
    'H31首项3、公比1/2的四项和45/8，与丢尾候选6差3/8；H38首−2倍率−1/2五项和−11/8，与丢尾候选−4/3差1/24。一般(1−q)Sn=a1−a1q^n保最后尾项，q1回原重复和12/−10，不拿未论证无限和替有限项或除0。',
    'Shifted subtraction retains the exact final term in(1−q)Sₙ=a₁−a₁qⁿ. Finite sums45/8 and−11/8 differ from discarded-tail candidates by3/8 and1/24. With q1,the original repeated sums give12 and−10 rather than dividing by zero or replacing finite tasks with an unproved infinite process.',
  ),
  e(
    'savings-affine-recurrence-and-timing',
    6,
    '每笔时序、仿射余额与有限贡献',
    'Per-deposit timing,affine balances and finite contributions',
    'H31理想80/q3/2/c4，期末124、190，期初126、195；H38 60/q1/2/c6，期末36、24，期初33、39/2。分别写qB+c与q(B+c)，用时间线数每笔剩余期数，闭式保初值与有限和、q1和n0边界。给两个相邻余额比不同，不能把新增常数忽略当余额等比。',
    'Growth and decay models compare end balances124 then190,or36 then24,with start balances126 then195,or33 then39/2. Both derive qB+c versus q(B+c),count each deposit’s remaining periods,and retain initial balance,finite sums,q1 and n0. Unequal adjacent balance ratios reject calling these affine balances geometric; no fees or rounding are silently added.',
  ),
];
