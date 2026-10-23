import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H27' | 'H34') => {
  const first = unit === 'H27',
    id = (i: number) => `${unit}-MAINT-DATA-LANGUAGE-Q${i}`;
  const ids = first ? ['A', 'B', 'C', 'D', 'E'] : ['F', 'G', 'H', 'I', 'J'];
  const colours = first
    ? [t('蓝', 'Blue'), t('绿', 'Green'), t('蓝', 'Blue'), t('红', 'Red')]
    : [t('红', 'Red'), t('绿', 'Green'), t('红', 'Red'), t('蓝', 'Blue')];
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), skill, t(sz, se), [
      t(hz, he),
      t(
        '先核观察单位、原始身份、分母与模型前提。数据内结论、样本外推和因果解释需要不同依据。',
        'Check observational units,original identities,divisors and model premises first. Data descriptions,generalisation and causal explanations require different evidence.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-DATA-LANGUAGE`,
    unit,
    bridge: 'H08-L01',
    bridgeByQuestion: Object.fromEntries(
      ['H08-L01', 'H08-L02', 'H08-L04', 'H08-L05'].map((l, i) => [
        id(i + 1),
        l,
      ]),
    ),
    title: t(
      '回归与推断之后，再核数据的含义',
      'After regression and inference,recheck what the data mean',
    ),
    intro: t(
      '四题分次，每次一题；标准差与标准分数题可分两次写。全部人工核验、不计时。表格与观测均为虚构演示，不是真实家庭数据。',
      'Choose one of four tasks per sitting;split the spread/standardisation task across two sittings if useful. Every argument is human-reviewed without a timer. Tables and observations are fictional demonstrations,not real family data.',
    ),
    questions: [
      {
        ...task(
          1,
          'data-type-identity-source',
          `原表列五个不同成员${ids.join(',')}在同一时刻的一次颜色类别，类别只许蓝/绿/红。r5已核为r1的同ID同次复制，r6未记录；保原表另作分析清单，哪些行进入有效颜色比例？求已记录者中${first ? '蓝' : '红'}比例，说明对五成员总体能确定什么。再把蓝/绿/红编码1/2/3与10/20/90，各求代码均值；这能叫平均颜色吗，重复颜色与重复ID有何不同？`,
          `The raw table concerns five distinct members ${ids.join(',')} at one occasion,each colour limited to blue/green/red. Row r5 is confirmed as a copy of r1 for the SAME ID and occasion;r6 is unrecorded. Retain the raw table and make an analysis list. Which rows enter the observed colour proportion? Find the observed ${first ? 'blue' : 'red'} proportion and state what is known for all five members. Code blue/green/red as1/2/3 and then10/20/90,compute both code means,and explain why they are not average colours. Distinguish repeated colours from repeated identities.`,
          `有效分析r1–r4四个不同ID，r5仅作已核复制标记不再多算，r6保缺失身份而非记“否”或颜色0。${first ? '蓝' : '红'}2/4=1/2，只是已记录者；全五人该色可能2或3人，比例2/5至3/5且只有这两个离散值，未知者未自动归任何色。不同ID同色的两条都保留。代码均值${first ? '7/4与65/2' : '9/4与105/2'}，重编码不改原颜色却改均值，故无序类别的标签算术不是平均颜色，应报频数/比例与分母。原资料和处理痕迹都保留，不为漂亮结论删行。`,
          `Analyse r1–r4 as four distinct IDs;flag the confirmed copy r5 without counting it twice,and retain r6 as missing,not “no” or colour zero. The observed ${first ? 'blue' : 'red'} proportion is2/4=1/2. In all five members that colour may count two or three,so the only possible proportions are2/5 or3/5;the missing member has no assigned colour. Equal colours at different IDs both remain. Code means are${first ? '7/4 and65/2' : '9/4 and105/2'}. Relabelling changes the arithmetic mean without changing any colour,so a nominal code mean is not an average colour. Report frequencies/proportions with denominators and preserve raw records plus processing provenance.`,
          '只有已核同ID同次复制可以从分析计数中去重；未记录不等于不属于某色。',
          'Deduplicate only the confirmed same-ID/same-occasion copy in the analysis count. Missing does not mean absence of a colour.',
        ),
        contextTable: {
          caption: t(
            '给定虚构原始颜色记录；同一时刻',
            'Given fictional raw colour records;one occasion',
          ),
          columns: [
            t('原表行', 'Raw row'),
            t('成员ID', 'Member ID'),
            t('颜色', 'Colour'),
            t('来源状态', 'Source status'),
          ],
          rows: [
            ...ids
              .slice(0, 4)
              .map((member, i) => [
                t(`r${i + 1}`, `r${i + 1}`),
                t(member, member),
                colours[i]!,
                t('原记录', 'Original'),
              ]),
            [
              t('r5', 'r5'),
              t(ids[0]!, ids[0]!),
              colours[0]!,
              t('已核同ID同次复制', 'Confirmed same-ID/occasion copy'),
            ],
            [
              t('r6', 'r6'),
              t(ids[4]!, ids[4]!),
              t('未记录', 'Missing'),
              t('保留缺失身份', 'Retain missing identity'),
            ],
          ],
        },
      },
      {
        ...task(
          2,
          'data-shape-tail-evidence',
          `图中四个不同编号的完整演示总体值为${first ? '0,0,4,4' : '1,1,7,7'}cm。用镜像配对说明对称中心和两个峰；对称就足以称正态吗？另给总体μ=${first ? 2 : 4}cm、σ=${first ? 2 : 3}cm，直接数闭区间[μ−σ,μ+σ]与开区间(μ−σ,μ+σ)的实际比例并保分母。能拿68%经验规则替代计数，或据此证明真实总体正态吗？`,
          `The plot gives a COMPLETE four-ID demonstration population with values ${first ? '0,0,4,4' : '1,1,7,7'}cm. Explain its symmetry centre and two peaks by reflection. Does symmetry establish normality? Given population μ=${first ? 2 : 4}cm,σ=${first ? 2 : 3}cm,count the actual proportions in closed[μ−σ,μ+σ] and open(μ−σ,μ+σ),retaining the denominator. May a68% rule replace counting or establish a real normal population?`,
          first
            ? '围绕2，0与4互镜且各2个，故对称但双峰，中间没有观测，不是正态钟形假设的依据。闭区间[0,4]四个全含，4/4=100%；开区间(0,4)四个全在被排端点，0/4=0%。这是完整四编号演示的精确比例，不由均值、σ或对称自动变成68%。正态模型另需依据；此离散分布不是连续正态，也不能把演示图当实际总体机制已证。'
            : '围绕4，1和7互镜、各2个峰，故对称而非由此正态。闭区间[1,7]含4/4=100%，开区间(1,7)含0/4=0%，端点是否包含在离散数据中重要。每个相同值仍属于不同编号，不能去重成两个观测再换分母。68%来自另有条件的正态模型近似，不能替本题直接计数或从对称认证现实正态。',
          first
            ? 'Reflection about two exchanges zero/four with equal counts,giving symmetry but two peaks and no central observations. Closed[0,4] contains4/4=100%;open(0,4)contains0/4=0%,since every observation is at an excluded endpoint. These are exact proportions for the complete four-ID demonstration,not68% inferred from mean,SD or symmetry. A normal model needs separate premises;this discrete distribution is not continuous normality or proof of a real mechanism.'
            : 'Reflection about four exchanges one/seven with two observations each. It is symmetric but bimodal. Closed[1,7] contains4/4=100%,open(1,7)contains0/4=0%;endpoint ownership matters for discrete data. Equal values retain different IDs and cannot be deduplicated into two observations. A normal68% approximation requires a separately justified model and cannot replace this exact count or certify real normality.',
          '先数每个编号是否落在指定区间；镜像性质、峰形和概率模型不是同一条件。',
          'Count each ID’s membership in the specified interval. Reflection symmetry,modality and a probability model are different conditions.',
        ),
        diagram: {
          kind: 'dot-distribution' as const,
          values: first ? [0, 0, 4, 4] : [1, 1, 7, 7],
          max: 8,
          step: 1,
          name: '给定完整演示总体 / Given complete demonstration population',
        },
      },
      task(
        3,
        'data-z-reference-boundary',
        `四个不同编号的完整演示总体值为${first ? '3,5,5,7' : '2,5,5,8'}cm。先逐项求均值、离均差平方、除n的总体方差及精确σ；若这四值改作为抽样资料、采用n−1样本方差，数值怎样，不能默换哪个分母？取首个值，求z，再将每值改x′=${first ? '10−2x' : '20−3x'}，连μ′和σ′一起核z′。用一般x′=c x+d、c≠0推标准差与z怎样变，并与正向x″=5+2x比较。全相同数据或c0时z还有定义吗，z正负自动代表优劣或概率吗？`,
        `A complete four-ID demonstration population has values ${first ? '3,5,5,7' : '2,5,5,8'}cm. Compute the mean,each squared deviation,population variance using n,and exact σ. If these four values instead form sample data using n−1,what changes,and why must the divisor be stated? For the first value compute z,then transform every value by x′=${first ? '10−2x' : '20−3x'},recomputing μ′,σ′ and z′. Derive the general effects of x′=c x+d,c≠0 on SD and z,comparing positive transform x″=5+2x. Are z values defined for constant data or c0? Do signs automatically mean quality or probability?`,
        first
          ? '均值5，离差−2,0,0,2，平方4,0,0,4、和8；总体方差8/4=2cm²、σ√2cm。n−1样本方差8/3、样本标准差2√6/3，约定要明写。首x3的z=(3−5)/√2=−√2。反向x′=10−2x后均值0、σ′2√2，首值4给z′√2=−z；不是把σ也乘成负数。一般离差乘c、平方和乘c²，故σ′=|c|σ；σ>0时z′=(c/|c|)z，正向5+2x保持z，负向反号。全同或c0使σ′0，标准分数无定义；符号只表相对所选均值位置，不能独自推好坏或正态概率。'
          : '均值5，离差−3,0,0,3，平方9,0,0,9和18；总体方差18/4=9/2cm²，σ3√2/2cm。采用样本n−1得方差6、标准差√6，不可无声换分母。首x2给z=−√2；反向20−3x后均值5、σ′9√2/2、首值14，z′√2，故反号。一般离差c倍、平方和c²倍，σ′=|c|σ非负，z′=(c/|c|)z，正向5+2x保z。σ0的常数数据或c0后的常数不能除σ定义z；正负只针对参考分布，非自动优劣或概率。',
        first
          ? 'Mean five gives deviations−2,0,0,2 and squares4,0,0,4,sum eight. Population variance is2cm² and SD√2cm;the n−1 sample convention gives variance8/3 and SD2√6/3. First x3 has z=−√2. Under10−2x,the new mean is zero,SD2√2 and first value four,so z′=√2=−z. SD does not become negative. Generally deviations scale by c,squares by c²,so σ′=|c|σ and,when σ>0,z′=(c/|c|)z. Positive5+2x preserves z;negative c reverses it. Constant data or c0 gives zero SD,so z is undefined. Its sign only locates a value relative to the chosen reference mean,not quality or a normal probability.'
          : 'Mean five gives deviations−3,0,0,3 and squared sum eighteen. Population variance is9/2cm²,SD3√2/2cm;the n−1 sample convention instead gives variance six,SD√6. First x2 has z=−√2. Under20−3x,the mean is five,SD9√2/2 and first value fourteen,so z′=√2. Generally deviations multiply by c and squared sum by c²,hence nonnegative σ′=|c|σ and z′=(c/|c|)z when σ>0. Positive5+2x preserves z. Constant data or c0 has zero SD and no z. Signs refer to a declared reference distribution,not automatic merit or probability.',
        '不能先把有正负的离差相加代替平方；反向变换时均值和σ也必须一起更新。',
        'Do not cancel signed deviations before squaring. Under reflection,recompute both the mean and the nonnegative SD.',
      ),
      task(
        4,
        'data-paired-residual-model',
        `三个不同ID的配对为${first ? '(2,1),(2,4),(2,7)' : '(3,2),(3,5),(3,8)'}。在含截距直线ŷ=a+bx中，用同一原x求竖直残差y−ŷ及SSE，推SSE关于a,b的一般平方恒等式，找全部最优参数。原x=${first ? 2 : 3}处的最佳预测值能唯一吗，斜率能唯一吗？给两条同样最优直线，在x=${first ? 3 : 4}处预测不同；为何不能把同x记录去重，或把残差当点到线最短距离？`,
        `Three distinct-ID pairs are ${first ? '(2,1),(2,4),(2,7)' : '(3,2),(3,5),(3,8)'}. For the intercept model ŷ=a+bx,compute vertical residuals y−ŷ at each original x and derive a general squared identity for SSE. Find ALL optimal parameters. Is the best prediction at original x=${first ? 2 : 3} unique,and is the slope unique? Give two equally optimal lines that predict differently at x=${first ? 3 : 4}. Why cannot repeated-x records be deduplicated or residuals replaced by shortest point-to-line distances?`,
        first
          ? '令m=a+2b，三残差1−m,4−m,7−m，SSE=18+3(m−4)²，故全体最优a+2b=4、最小18。原x2处预测4唯一，斜率b任意实数，不能除Sxx0。ŷ=4与ŷ=2+x都最优，在x3预测4和5不同，原范围外不唯一。三点为不同ID，不是录入复制；去重会丢观测身份和权重。残差保持原x的竖直差，斜线最短距离是另一优化目标。一般平方恒等式覆盖全部参数，不只是比较两条候选。'
          : '令m=a+3b，残差2−m,5−m,8−m，SSE=18+3(m−5)²。全部最优a+3b=5、最小18；原x3预测5唯一而b不唯一，Sxx0不能算唯一斜率。ŷ=5与ŷ=−1+2x都最优，在x4分别5和7。相同x不是同一ID的复制，三条观测都保权重。竖直残差y−ŷ与最短距离不同；一般平方恒等式说明完整最优族，不能从一个最优参数误称识别了斜率或外部预测。',
        first
          ? 'Set m=a+2b. Residuals are1−m,4−m,7−m,and SSE=18+3(m−4)². Thus ALL optima satisfy a+2b=4,with minimum eighteen. Prediction four at x2 is unique but b is any real number;Sxx=0 cannot be divided into a unique slope. Lines ŷ=4 and ŷ=2+x are equally optimal yet predict four/five at x3. Distinct IDs with equal x are not duplicate records;removing them changes identity and weight. Residuals are vertical differences at the original x;shortest distances define a different fitting problem. The general identity covers every real parameter pair.'
          : 'Set m=a+3b. Residuals2−m,5−m,8−m give SSE=18+3(m−5)². ALL optima satisfy a+3b=5,with minimum eighteen. Prediction five at x3 is unique but b is not;Sxx=0 does not identify a slope. Equally optimal lines ŷ=5 and ŷ=−1+2x predict five/seven at x4. Equal x at distinct IDs is not a duplicate recording. Keep every observation’s weight and distinguish vertical residuals from shortest distances. The general identity proves the entire optimal family rather than extrapolation from one chosen fit.',
        '所有x相同先把共同预测记成m；展开平方差可看出什么唯一、什么仍自由。',
        'With all x equal,call their common prediction m. Expand squared errors to see what is identified and what remains free.',
      ),
    ],
  };
};
export const dataLanguageRetrieval = {
  H27_DATA: makeSet('H27'),
  H34: makeSet('H34'),
};
