import { t } from '../model';
const data = [
  [
    'per-hundred-reference',
    '每百份与指定整体',
    'Per hundred and the specified whole',
    'J75比较9/60与21/140均15%，J76比较14/80与35/200均17.5%；都必须画同长但不同实际总量的条，说明等比例不等实际个数及百分率分母。',
    'J75 compares 9/60 with 21/140, both 15%; J76 compares 14/80 with 35/200, both 17.5%. Each requires equal-length bars representing different actual totals and an explanation of per-hundred denominators and unequal counts.',
  ],
  [
    'decimal-percent-equivalence',
    '小数与百分数保值互化',
    'Value-preserving decimal-percent conversion',
    'J75主动生成0.0625=6.25%，并区分0.0625%=0.000625；J76重建0.045=4.5%与错误0.045%=0.00045。两处都解释系数乘100与百分号除100配合，而非只添符号。',
    'J75 generates 0.0625=6.25% and distinguishes 0.0625%=0.000625. J76 reconstructs 0.045=4.5% versus 0.045%=0.00045. Both explain coefficient scaling together with division by one hundred rather than appending a sign.',
  ],
  [
    'fraction-percent-exact',
    '分数百分率的精确与近似',
    'Exact and approximate fraction percentages',
    'J75把1/6写成16又2/3%，再近似16.7%；J76把2/7写成28又4/7%，再近似28.6%。都须用除100与乘回或交叉乘说明舍入后不再精确，保留等号和约等号区别。',
    'J75 writes 1/6 as exactly 16 2/3% and approximately 16.7%; J76 writes 2/7 as exactly 28 4/7% and approximately 28.6%. Both require inverse or cross-product checks showing why rounded values are not equal to the original.',
  ],
  [
    'percent-of-amount',
    '百分率作用在具体整体',
    'Applying a percentage to a specified amount',
    'J75从80L、120L各取12.5%得10L、15L；J76从40kg、100kg各取7.5%得3kg、7.5kg。均画或说单位份、保留量纲、部分除整体核验，并核0%及不同整体。',
    'J75 takes 12.5% of 80L and 120L for 10L and 15L. J76 takes 7.5% of 40kg and 100kg for 3kg and 7.5kg. Both require unit shares, dimensions, inverse ratios and zero-percent/different-whole checks.',
  ],
  [
    'recover-percent-whole',
    '由百分部分恢复整体',
    'Recovering a whole from a percentage part',
    'J75由18L对应12.5%恢复144L，J76由3.6kg对应7.5%恢复48kg。都须建立部分率对应、乘回核验，解释乘百分率会再次取部分，以及0%导致不唯一或条件矛盾。',
    'J75 recovers 144L from 18L at 12.5%; J76 recovers 48kg from 3.6kg at 7.5%. Both establish the part-rate correspondence, multiply back, explain why multiplication takes another part and distinguish non-unique or inconsistent zero-percent cases.',
  ],
  [
    'percent-change-base',
    '变化基数与百分点',
    'Change bases and percentage points',
    'J75以120元先降再涨25%得112.50，J76以200元先涨再降10%得198；都逐步解释基数改变。另分别比较25%到40%的15个百分点/60%相对增长，与10%到15%的5个百分点/50%相对增长，保留原比例分母。',
    'J75 decreases then increases 120 dollars by 25% for 112.50; J76 increases then decreases 200 by 10% for 198, explicitly changing each base. They separately derive fifteen percentage points versus 60% growth from 25% to 40%, and five points versus 50% growth from 10% to 15%, using original-rate denominators.',
  ],
];
export const percentRecurrence = data.map(([skill, zh, en, rz, re], i) => ({
  skill: skill!,
  focus: t(zh!, en!),
  sourceLesson: `P62-L0${i + 1}`,
  sourceTask: `P62-L0${i + 1}-Q6`,
  targets: ['J75', 'J76'].map((u) => `${u}-MAINT-PERCENT-Q${i + 1}`),
  rationale: t(rz!, re!),
}));
