import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H24' | 'H33') => {
  const first = u === 'H24',
    r = first ? 3 : 2,
    b = 2,
    n = r + b,
    qid = (i: number) => `${u}-MAINT-PROB-PROCESS-Q${i}`;
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(qid(i), t(z, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '先声明完整结果身份、等可能/独立假设与分母，再区分模型计算、有限模拟和实际测量。',
        'State outcome identity, equiprobability/independence assumptions and denominators before separating model calculations, finite simulation and real measurements.',
      ),
    ]);
  return {
    id: `${u}-MAINT-PROB-PROCESS`,
    unit: u,
    bridge: 'J97-L02',
    bridgeByQuestion: Object.fromEntries(
      ['J97-L02', 'J97-L05', 'J97-L01'].map((l, i) => [qid(i + 1), l]),
    ),
    title: t(
      '新概率模型之后，再核完整试验',
      'After new probability models, recheck the complete trial',
    ),
    intro: t(
      '三题分次每次一题，画编号格、条件树或四格表并写理由。数据均为虚构模型或标明的模拟记录，不冒充真实实验；全部人工核验，不计时。',
      'Choose one of three tasks per sitting and draw a numbered grid, conditional tree or two-way table with reasons. Data are fictional models or labelled simulation records, not real experiments. Every argument is human-reviewed without a timer.',
    ),
    questions: [
      task(
        1,
        'probability-without-ordered-pairs',
        `袋有不同编号红R1至R${r}、蓝B1至B2，各次从当时袋中等可能抽编号。两抽为一轮。分别对“第一抽放回”和“第一抽不放回”画完整编号有序对格及两层条件树，求RR、RB、BR、BB权重和异色概率。为什么不能只数四个颜色字母串均分？反向顺序是否同结果，无序分子能除有序分母吗？`,
        `A bag contains distinct red IDs R1..R${r} and blue B1,B2; each draw is equiprobable over IDs currently in the bag. One round has two draws. Draw complete ordered-ID grids and two-level conditional trees with and without replacing the first draw. Find RR,RB,BR,BB weights and different-colour probability. Why not divide equally among four colour strings? Are reverse orders the same outcome? May unordered numerators use ordered denominators?`,
        `放回有${n * n}格，四类编号数${r * r},${r * b},${b * r},${b * b}，各格1/${n * n}；不放回删同编号对角线，余${n * (n - 1)}格，四类${r * (r - 1)},${r * b},${b * r},${b * (b - 1)}，不是按颜色种类均分。第一红后剩${r - 1}红、2蓝，共${n - 1}，RR=${r}/${n}×${r - 1}/${n - 1}=${first ? '3/10' : '1/6'}；RB=${r}/${n}×2/${n - 1}=${first ? '3/10' : '1/3'}，第一蓝后BR=2/${n}×${r}/${n - 1}同值，两互斥路径相加异色${first ? '3/5' : '2/3'}。放回第二分母仍${n}、颜色数恢复，异色${first ? '12/25' : '1/2'}。${first ? '放回四类权重本已不同' : '放回四类恰相等只是本袋红蓝等数的特殊结果，不放回仍不等'}。R1R2与R2R1有序身份不同；无序可以另用一致的组合数，但不能分子无序分母有序，同编号删格不列成可能结果。`,
        `With replacement there are ${n * n} equiprobable ID cells with colour counts ${r * r},${r * b},${b * r},${b * b}. Without replacement remove the same-ID diagonal, leaving ${n * (n - 1)} cells and colour counts ${r * (r - 1)},${r * b},${b * r},${b * (b - 1)}. After red, ${r - 1} red and two blue remain among ${n - 1}: RR=${r}/${n}×${r - 1}/${n - 1}=${first ? '3/10' : '1/6'},RB=${r}/${n}×2/${n - 1}=${first ? '3/10' : '1/3'}. After blue, BR=2/${n}×${r}/${n - 1} is equal; mutually exclusive RB/BR sum to ${first ? '3/5' : '2/3'}. Replacement restores colour counts and second denominator ${n}, giving different-colour probability ${first ? '12/25' : '1/2'}. ${first ? 'Even replacement colour categories have unequal weights.' : 'Equal replacement colour weights are a special consequence of this bag’s equal counts; without replacement they differ.'} R1R2 and R2R1 are distinct ordered outcomes. An unordered method must recompute numerator and denominator consistently. Removed same-ID cells are impossible, not possible outcomes to count.`,
        '用编号作两轴，圈出删掉的对角线；再按第一次结果重新数第二次袋子。',
        'Put IDs on both axes, remove the diagonal where required, then recount the second bag after each first result.',
      ),
      task(
        2,
        'probability-simulation-theory',
        `继续上一题轮内不放回，但每轮后恢复原袋。异色理论概率为${first ? '3/5' : '2/3'}。虚构程序记录${first ? '5轮4次' : '6轮5次'}异色，下一轮再异色；算前后频率及到理论的距离，是否每增一轮都更近？0轮怎么办？如果程序一直移走球，还是同一重复模型吗？说明理论、注明种子的有限模拟与真实装置记录分别能支持什么；为什么分母不是单次抽球数？`,
        `Continue the no-replacement WITHIN-round model, restoring the original bag BETWEEN rounds. Different-colour probability is ${first ? '3/5' : '2/3'}. A fictional program records ${first ? 'four successes in five rounds' : 'five in six rounds'}, followed by another success. Compute both frequencies and distances from theory. Must every added round move closer? What about zero rounds? If balls are never restored, is it the same repeated model? Separate theory, finite seeded simulation and real-device records, and explain why individual draws are not the denominator.`,
        first
          ? '理论异色3/5来自完整等可能编号模型，不是频率反推。初4/5，差1/5；加成功后5/6，差7/30>1/5，所以这次更远，不反驳长期频率性质，也不要求下次补偿。0轮分母0未定义，不填0。每轮有两次抽取但事件是整轮异色，分母5或6轮而非10或12抽。轮内移首球才能保第二次条件变化，轮后恢复3红2蓝才能每轮同规则；一直移球会变袋组成、最终抽空，是不同过程。模拟需标程序规则、种子、轮数及虚构身份，有限伪随机轨迹不能证明模型假设或替代真实装置的测量/覆盖检查。真实频率也不证明精确理论或机制独立。'
          : '理论异色2/3来自编号空间与条件树。初5/6与2/3差1/6；再异色成6/7，差4/21>1/6，反而更远；长期趋势不要求单步单调或下一轮补偿。0轮频率未定义，不能记0。两抽成一轮，分母6/7轮不是12/14抽。每轮内不放回保条件变化，轮后恢复2红2蓝保同一重复规则；从不恢复会改变袋中组成并最终不足两抽，不是原模型。有限注明种子模拟检实现规则与理论的一致性，不证明现实等可能或独立，不替代装置资料；实际测量有覆盖、测量、抽样波动局限。理论概率、伪随机频率与真实观察必须分别报告。',
        first
          ? 'Theory 3/5 follows from the complete equiprobable-ID model. Initial frequency 4/5 differs by 1/5; after success, 5/6 differs by 7/30, greater than 1/5. Moving farther once contradicts neither long-run behaviour nor a requirement to compensate next time. Zero rounds has undefined frequency. Each event is one complete two-draw round, so denominators are five/six rounds rather than ten/twelve individual draws. Remove the first ball within a round to retain conditional changes, then restore three red/two blue between rounds. Never restoring changes composition and eventually empties the bag: another process. Label simulation rules, seed, rounds and fictional status. Finite pseudorandom paths do not prove model assumptions or replace real-device measurement/coverage checks; real frequency also proves neither an exact probability nor independence.'
          : 'Theory 2/3 comes from the ID space and conditional tree. Initial 5/6 differs by 1/6; after another success, 6/7 differs by 4/21, greater than 1/6. Long-run behaviour need not be stepwise monotone or compensate next round. Zero-round frequency is undefined, not zero. Denominators are six/seven complete rounds rather than twelve/fourteen draws. No replacement within rounds preserves conditional changes; restoring two red/two blue between rounds preserves the repeated rule. Never restoring changes composition and eventually prevents another two-draw round, so it is another process. Finite seeded simulation checks implemented rules against theory; it proves neither real equiprobability nor independence and cannot replace device evidence. Real observations have coverage, measurement and sampling limits. Report theoretical probability, pseudorandom frequency and real observation separately.',
        '先给整轮事件和分母，再用通分比较两次绝对距离；“长期”不要求每一步接近。',
        'Define the round event and denominator before comparing absolute distances by common denominators. Long-run behaviour does not require every step to approach.',
      ),
      task(
        3,
        'probability-independence-product',
        `给完整等可能${first ? 12 : 20}编号格模型，四格A∩B、A∩非B、非A∩B、非A∩非B分别${first ? '2,2,4,4' : '3,2,9,6'}。计算边缘、交集与乘积判断模型内A/B独立，说明没有假定四类别等可能。另有虚构观察样本四格${first ? '4,4,4,4' : '3,2,3,2'}恰吻合乘积，能证明真实机制独立吗？若有限样本不吻合能证明装置坏吗？区分模型全空间、观察样本与总体。`,
        `A complete model has ${first ? 12 : 20} equiprobable numbered cells with counts for A∩B,A∩not-B,not-A∩B,not-A∩not-B of ${first ? '2,2,4,4' : '3,2,9,6'}. Calculate marginals, intersection and their product to decide model independence, without assuming four categories equiprobable. A fictional observed sample has counts ${first ? '4,4,4,4' : '3,2,3,2'} and exactly matches the product. Does it prove real independence? Does a finite mismatch prove a device faulty? Separate full model space, observed sample and population.`,
        first
          ? '模型P(A)=4/12=1/3、P(B)=6/12=1/2、P(A∩B)=2/12=1/6，边缘乘积1/6相等，所以在已声明完整模型内独立；等权是12编号格，四类2/2/4/4不等权。观察表总16，边缘1/2、1/2与交1/4也吻合，但只是样本相对频率，不能证明真实总体机制独立。需核抽取、覆盖、测量与重复不确定性；一次吻合可能偶然，独立机制有限样本也可能不吻合，不能一次不合就认装置坏。'
          : '模型P(A)=5/20=1/4、P(B)=12/20=3/5、交3/20等于边缘乘积，故模型内独立；等可能20编号格而非四个类别。观察表总10，边缘A1/2、B3/5，交3/10吻合，但有限频率恰等不证明真实总体独立。观察不是全空间清单，需设计、覆盖、测量和不确定性；有偏机制可偶合，独立机制也可有限偏离，不从一次不吻合宣布装置损坏。',
        first
          ? 'The model gives P(A)=4/12=1/3,P(B)=6/12=1/2 and intersection 2/12=1/6, equal to the product, so independence holds WITHIN that declared model. Equiprobability applies to twelve IDs, not unequal category counts 2,2,4,4. In the sixteen-record observation table, marginals 1/2,1/2 and intersection 1/4 also match, but they are sample relative frequencies, not proof of real population independence. Audit sampling, coverage, measurement and repeated uncertainty. A match can occur accidentally; a finite mismatch can occur under independence and does not alone prove a faulty device.'
          : 'The model has P(A)=5/20=1/4,P(B)=12/20=3/5 and intersection 3/20 equal to their product, giving independence within the declared model. Twenty IDs, not four categories, are equiprobable. The ten-record sample has marginals A1/2,B3/5 and intersection 3/10, also matching, but finite frequency coincidence does not prove population independence. Observations are not a complete sample-space listing. Audit design, coverage, measurement and uncertainty; dependence can coincide and independence can show finite deviation, so one mismatch does not certify device damage.',
        '先分别写总数、A行和、B列和与交格；分母要来自同一张表。',
        'Write each table’s total, A row total, B column total and intersection cell separately, using a consistent denominator.',
      ),
    ],
  };
};
export const probabilityProcessRetrieval = {
  H24: makeSet('H24'),
  H33: makeSet('H33'),
};
