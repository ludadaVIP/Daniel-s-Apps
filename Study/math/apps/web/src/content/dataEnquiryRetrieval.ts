import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H08' | 'H27') => {
  const shift = u === 'H08' ? 0 : 1;
  const qid = (i: number) => `${u}-MAINT-DATA-ENQUIRY-Q${i}`;
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
        '保留原ID、单位、同值与缺失，说明约定、比较指标和结论适用范围。',
        'Retain original IDs, units, equal values and missingness. State conventions, comparison measures and conclusion scope.',
      ),
    ]);
  const a = [2, 4, 4, 6, 8].map((x) => x + shift),
    b = [3, 4, 5, 5, 6, 7].map((x) => x + shift);
  const normal = t('原记录', 'Original record');
  const rows = [
    ...a.map((x, i) => [
      t(`A${i + 1}`, `A${i + 1}`),
      t(
        i === 1 ? `${x * 10} mm` : `${x} cm`,
        i === 1 ? `${x * 10} mm` : `${x} cm`,
      ),
      i === 1
        ? t(
            '保留原单位，分析时换成cm',
            'Retain raw units; convert to cm for analysis',
          )
        : normal,
    ]),
    [
      t('A6', 'A6'),
      t('缺失', 'Missing'),
      t('此ID未测得距离', 'No measured distance for this ID'),
    ],
    ...b.map((x, i) => [
      t(`B${i + 1}`, `B${i + 1}`),
      t(`${x} cm`, `${x} cm`),
      normal,
    ]),
    [
      t('B3（重复导入）', 'B3 (duplicate import)'),
      t(`${b[2]} cm`, `${b[2]} cm`),
      t('已核同一ID同次测量重复', 'Confirmed same ID and measurement occasion'),
    ],
  ];
  const median = 5 + shift;
  const low = -2 + shift,
    high = 30 + shift;
  const q1 = -1 + shift,
    q3 = 3.5 + shift;
  const whisker = 4 + shift;
  const originalA = [1, 4, 4, 5, 5, 5, 6, 6, 7].map((x) => x + shift);
  const originalB = [0, 1, 1, 2, 5, 8, 9, 9, 10].map((x) => x + shift);
  const tail = shift ? 41 : 30;
  return {
    id: `${u}-MAINT-DATA-ENQUIRY`,
    unit: u,
    bridge: 'J88-L01',
    bridgeByQuestion: Object.fromEntries(
      ['J88-L01', 'J88-L02', 'J88-L05', 'J88-L03'].map((l, i) => [
        qid(i + 1),
        l,
      ]),
    ),
    title: t(
      '数据之后，再核原记录与结论',
      'After data work, recheck records and conclusions',
    ),
    intro: t(
      '四题分次，每次选一题，可用纸笔画图或表格计算。数据均为原创虚构教学资料，不是孩子或家庭实测；全部解释由家长人工核验，不计时。',
      'Choose one of four tasks per sitting and use paper drawings or tables. All data are original fictional teaching records, not measurements by the child or family. A parent reviews every explanation without a timer.',
    ),
    questions: [
      task(
        1,
        'quartile-convention',
        `对${[1, 2, 3, 4, 5].map((x) => x + shift).join(',')}分别按“奇数样本排除总体中位数”和“在两半都包含总体中位数”求Q1/Q3，解释不同答案。另对${[-2, -2, 0, 1, 1, 2, 3, 4, 30].map((x) => x + shift).join(',')}按排除法画五数箱线图，再画1.5×IQR须线版，保留重复值和负号。两版须端是否同义？箱四段宽能当人数比例吗？`,
        `For ${[1, 2, 3, 4, 5].map((x) => x + shift).join(',')}, find Q1/Q3 both excluding the overall median from odd-sample halves and including it in both halves. Explain the difference. For ${[-2, -2, 0, 1, 1, 2, 3, 4, 30].map((x) => x + shift).join(',')}, use exclusion to draw a five-number box plot and a 1.5×IQR whisker version, retaining repeats and negatives. Do whisker ends mean the same thing? Do segment widths show proportions of people?`,
        `五项中位${3 + shift}；排除法Q1=${1.5 + shift}、Q3=${4.5 + shift}，包含法为${2 + shift}与${4 + shift}，约定不同而非算错。九项排序保留两条${low}和两条${1 + shift}，五数为${low},${q1},${1 + shift},${q3},${high}，IQR=9/2。围栏Q1−27/4=${shift ? '-27/4' : '−31/4'}、Q3+27/4=${shift ? '45/4' : '41/4'}；须线到围栏内实际观测${low}与${whisker}，${high}单独标候选异常点，围栏不是须端也不是删值命令。最小最大版右须到${high}，须线版到${whisker}，须声明规则。箱段宽是数值距离，重复值与有限样本不必恰四份25%人数，负值不能去号。`,
        `The five-item median is ${3 + shift}. Exclusion gives Q1=${1.5 + shift},Q3=${4.5 + shift}; inclusion gives ${2 + shift},${4 + shift}. Different conventions are not an arithmetic contradiction. Retain both ${low} values and both ${1 + shift} values in the nine-item list. Its five numbers are ${low},${q1},${1 + shift},${q3},${high}, with IQR=9/2. Fences are ${shift ? '-27/4' : '−31/4'} and ${shift ? '45/4' : '41/4'}; whiskers end at actual in-fence observations ${low},${whisker}, while ${high} is plotted separately as a potential outlier. A fence is neither a whisker endpoint nor an instruction to delete a value. The minimum/maximum plot ends at ${high}, the whisker version at ${whisker}. State the convention. Segment widths measure numerical distance, not headcounts; repeats and finite samples need not form exact 25% groups. Preserve negative signs.`,
        '先写两半分别包含哪些位置，再求中位数；须线找围栏内最后实际观测。',
        'List positions in each half before taking medians. For whiskers, find the last actual observation within each fence.',
      ),
      task(
        2,
        'spread-evidence',
        `虚构有符号温度°C记录：A=${originalA.join(',')}，B=${originalB.join(',')}。按奇数排除总体中位数的分半法，算中位数、极差、IQR并同轴比较。独立情景一只把原A最后${7 + shift}改${tail}；独立情景二重新从原A把同一个尾值改0，分别重排再算。IQR是否总不受极端改值影响？能为“更稳定”删除已核原值吗？`,
        `Fictional signed temperatures in °C: A=${originalA.join(',')},B=${originalB.join(',')}. Exclude the overall median when splitting odd samples. Calculate medians, ranges and IQRs and compare on the same axis. In scenario one replace only A’s original final ${7 + shift} by ${tail}. Independently reset to original A and replace that same value by zero in scenario two. Re-sort each. Is IQR always immune to extreme changes? May verified values be deleted to make a set look “more stable”?`,
        `原两组中位${median}；A极差6、Q1=${4 + shift}、Q3=${6 + shift}、IQR2，B极差10、Q1=${1 + shift}、Q3=${9 + shift}、IQR8。情景一A极差${tail - (1 + shift)}而IQR仍2、中位${median}，全跨度更大却中部更窄，要限定指标，保留${tail}并查来源，不删偏好值。情景二从原A重设0，排序${[0, ...originalA.slice(0, -1)].sort((x, y) => x - y).join(',')}，中位${median}、Q1=${2.5 + shift}、Q3=${5.5 + shift}、IQR3，说明较抗尾值不是永不受影响。温度有符号负值可合法；同轴同单位不外推所有未来温度。`,
        `Both original medians are ${median}. A has range six,Q1=${4 + shift},Q3=${6 + shift},IQR two; B has range ten,Q1=${1 + shift},Q3=${9 + shift},IQR eight. In scenario one A’s range becomes ${tail - (1 + shift)} but IQR remains two and median ${median}: total spread is wider while the middle is narrower, so qualify the measure. Retain ${tail} and check its source rather than deleting to preference. Independently resetting A and replacing its original tail by zero gives sorted ${[0, ...originalA.slice(0, -1)].sort((x, y) => x - y).join(',')},median ${median},Q1=${2.5 + shift},Q3=${5.5 + shift},IQR three. Resistance to tail values is not immunity. Signed negative Celsius values can be legitimate. Use a common axis and units without generalising to all future temperatures.`,
        '两次修改都从原A重新开始；每次先排序再分半，比较要报指标名称。',
        'Reset to original A for each change, re-sort before splitting and name the comparison measure.',
      ),
      {
        ...task(
          3,
          'statistical-enquiry',
          '下表为虚构纸片飞行距离原记录。A从60cm高、B从80cm高释放，未随机分配；同组测法和单位换算规则一致。用PPDAC写相连报告：限定本批问题、计划与来源、可追溯清理、已声明排除法的中位/IQR分析、结论。A6缺测、同次B3重复导入、不同ID等长分别怎样处理？给一个能答和一个不能答的问题；更多点或更直趋势足以证明折法因果吗？区分随机抽样与随机分配，并给下一轮设计改进。',
          'The table contains fictional paper-flight distances. A was released from 60 cm, B from 80 cm, without random allocation; measurement and conversion rules are consistent within groups. Write a connected PPDAC report: bounded question, plan/source, traceable cleaning, declared exclusion-method median/IQR analysis and conclusion. Treat missing A6, duplicate import of the same B3 occasion and equal lengths under different IDs separately. Give an answerable and unanswerable question. Do more points or a straighter trend prove a folding-method effect? Distinguish random sampling from random allocation and improve the next design.',
          `问题限这批两组距离及中部波动。计划需统一cm、测法、ID、释放高度并保留缺失；题设高度不同是潜在混杂，不能回填成相同。数据保原值，A2的${a[1]! * 10}mm换${a[1]}cm并记换算；仅合并已核同次重复B3，保B3/B4等长不同ID，A6不填0也不冒完整回应。有效A n5、B n6；排除法A中位${4 + shift}cm、Q1=${3 + shift}、Q3=${7 + shift}、IQR4cm，B中位${5 + shift}cm、Q1=${4 + shift}、Q3=${6 + shift}、IQR2cm。可答本批B中位更大且IQR更小；不能答所有纸片必更远或B折法导致改进。更多点/直趋势不自动排高度等混杂，按高度分组也不保证消除其他因素。下一轮固定高度/环境、随机分配折法、重复并记录ID与缺测；随机抽样侧重总体代表，随机分配侧重处理比较，两者不是同一操作，参与样本的因果也不自动推广所有纸片。`,
          `Bound the question to these groups’ distances and middle spread. Plan common cm units, methods, IDs, release heights and missingness; unequal given heights are a possible confounder, not something to rewrite. Retain raw values and log converting A2 from ${a[1]! * 10} mm to ${a[1]} cm. Merge only the confirmed duplicate B3 occasion, retaining equal B3/B4 values under different IDs. Do not replace A6 by zero or imply complete response. Effective A n=5,B n=6. Exclusion gives A median ${4 + shift} cm,Q1=${3 + shift},Q3=${7 + shift},IQR four cm; B median ${5 + shift} cm,Q1=${4 + shift},Q3=${6 + shift},IQR two cm. This batch supports a higher B median and smaller IQR, not universal superiority or a causal folding effect. More points or a straight trend do not remove height confounding; grouping by height does not guarantee removal of other factors. Next fix height/environment, randomise folding-method allocation, repeat and log IDs/missingness. Random sampling addresses population coverage; random allocation addresses treatment comparison. They differ, and effects in participating material do not automatically generalise to all paper.`,
          '让问题、清理分母、统计指标和结论范围相互对上，不能只写五个缩写。',
          'Connect the question, cleaning denominator, measures and conclusion scope, rather than merely writing five initials.',
        ),
        contextTable: {
          caption: t(
            '虚构飞行距离原记录',
            'Fictional flight-distance raw records',
          ),
          columns: [
            t('ID', 'ID'),
            t('原值含单位', 'Original with units'),
            t('来源说明', 'Source note'),
          ],
          rows,
        },
      },
      task(
        4,
        'paired-association',
        shift
          ? '虚构成对记录ID1至5依次为(−2,5),(−1,2),(0,1),(1,2),(2,5)；ID6为(3,缺失)。按原ID画散点，说明把两列分开升序再配会怎样，举新造的错误数对。能用ID顺序连成行程吗？从整体U形而非只看线性描述关系；算中心化交积和为0是否说明完全无关或因果不存在？'
          : '虚构成对记录ID1至5依次为(0,4),(1,1),(2,0),(3,1),(4,4)；ID6为(5,缺失)。按原ID画散点，说明把两列分开升序再配会怎样，举新造的错误数对。能用ID顺序连成行程吗？从整体U形而非只看线性描述关系；算中心化交积和为0是否说明完全无关或因果不存在？',
        shift
          ? 'Fictional paired records ID1..5 are (−2,5),(−1,2),(0,1),(1,2),(2,5); ID6 is (3,missing). Draw a scatter plot preserving IDs. Explain separately sorting columns and give an invented incorrect pair. May ID order be joined as a journey? Describe the overall U shape rather than only a linear trend. Does a zero centred cross-product sum mean no relationship or prove the absence of causation?'
          : 'Fictional paired records ID1..5 are (0,4),(1,1),(2,0),(3,1),(4,4); ID6 is (5,missing). Draw a scatter plot preserving IDs. Explain separately sorting columns and give an invented incorrect pair. May ID order be joined as a journey? Describe the overall U shape rather than only a linear trend. Does a zero centred cross-product sum mean no relationship or prove the absence of causation?',
        shift
          ? '完整五对原样作点，ID6的y缺失不补0，不能生成(3,0)；只在这项成对分析排除，不删其已知x。分列升序会把ID1的−2与别行1拼成(−2,1)，原点是(−2,5)，已换资料。按整行重排才保配对，ID非时间/路径不连线。x均0、y均3，中心交积−4+1+0−1+4=0，仍有明显U形：两端高、中间低。零线性关联不等于无关系、独立或无因果；观察本身也不证明因果/总体形状，需要设计与新证据。'
          : '完整五对按x先y后画，ID6的y缺失不填0，不能作(5,0)，成对分析暂不含它但保其已知x。分列升序会造(0,0)，原ID1为(0,4)，相当改资料；只整行一起排序可保原配对。ID不表时间或行程，不能随编号连路径。x均2、y均2，中心交积−4+1+0−1+4=0，仍U形两端高、中间低。无明显线性趋势不等于无关系、独立或因果不存在；五对也不证明总体形状或因果，应核来源与设计。',
        shift
          ? 'Plot the five complete pairs unchanged. Do not impute missing y for ID6 to create (3,0); omit it only from paired analysis while retaining known x. Separate sorting invents (−2,1) instead of original ID1 (−2,5), changing the data. Whole-row sorting preserves pairs; IDs are not time or a journey, so do not connect them as a path. Means are x=0,y=3; centred cross-products sum −4+1+0−1+4=0, yet the pattern is clearly U-shaped, high at both ends. Zero linear association is not absence of relationship, independence or proof of no causation. Observation alone also proves neither causation nor population shape; design and further evidence are needed.'
          : 'Plot the five complete pairs with x first. Do not fill ID6’s missing y with zero to create (5,0); exclude it only from paired analysis and retain known x. Separate sorting invents (0,0) instead of ID1 (0,4), changing the data; whole-row sorting preserves pairs. IDs denote neither time nor journey, so do not draw a numbered path. Both means are two; centred cross-products sum −4+1+0−1+4=0, but the overall U shape remains high at both ends. No clear linear trend is not absence of relationship, independence or proof of no causation. Five observations also do not prove a population pattern or cause; check source and design.',
        '每行是一个对象的两项，缺一项就没有该项完整点；先看整个点云的形状。',
        'Each row pairs two values for one object. One missing value means no complete point for that analysis. Inspect the entire cloud’s shape.',
      ),
    ],
  };
};
export const dataEnquiryRetrieval = {
  H08: makeSet('H08'),
  H27: makeSet('H27'),
};
