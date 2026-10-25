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
const details = [
  [
    '新P65/P68-Q1亲画3.75/7.5格中的部分面积、200/400张中一张的低于1%对照，改整体而保标记、逆求同率新张数，并核零/全/空集合及125%的对象范围。',
    'New P65/P68 Q1s draw partial cells within 3.75/7.5 and one-card rates below 1% in 200/400-card sets, change whole at fixed marked count, recover counts at a fixed rate and distinguish zero/all/empty collections and contexts for 125%.',
  ],
  [
    '新两组Q2补小于1%与超过100%的等值图、反向小数、十分之一位值链及0=0%例外。',
    'New Q2s add below-one-percent and above-100% equivalent diagrams, reverse decimal forms, tenths chains and the zero exception.',
  ],
  [
    '新两组Q3重画终止与循环结果的部分格、跨整体与0/200%，用等值扩分反驳只改分母，并检完整百分数系数。',
    'New Q3s draw terminating/recurring partial cells, extended frames and zero/200%, reject denominator-only conversion and check the complete percent coefficient.',
  ],
  [
    '新两组Q4保精确非整数连续量与余量，核125%需求、零整体不可反查占比及不可分卡的限制。',
    'New Q4s conserve exact nonintegral amounts and remainders, check 125% requirements, reject reverse ratios to zero wholes and respect indivisible cards.',
  ],
  [
    '新两组Q5反求125/150%时更小的正参考、40%的非整数整体，并用自编双见证区分零率/零量三个分支。',
    'New Q5s recover smaller positive references at 125/150%, nonintegral wholes at 40% and classify three zero cases with two generated positive witnesses.',
  ],
  [
    '新两组Q6补八折/七五折的保留率与减少率、精确恢复25%/33又1/3%的新基数以及0%和全额降价边界。',
    'New Q6s distinguish retained 80/75% from reductions, recover exact new-base restoration rates of 25%/33 1/3% and check zero-rate/full-discount boundaries.',
  ],
];
export const percentRecurrence = data.map(([skill, zh, en, rz, re], i) => ({
  skill: skill!,
  focus: t(zh!, en!),
  sourceLesson: `P62-L0${i + 1}`,
  sourceTask: `P62-L0${i + 1}-Q6`,
  targets: [
    ...['J75', 'J76'].map((u) => `${u}-MAINT-PERCENT-Q${i + 1}`),
    ...['P65', 'P68'].map((u) => `${u}-MAINT-PERCENT-MEANING-Q${i + 1}`),
  ],
  rationale: t(`${rz!} ${details[i]![0]}`, `${re!} ${details[i]![1]}`),
}));
