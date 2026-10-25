import { t, type Question } from '../model';
import { reasoning } from './builders';
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const fraction = (n: number, d: number) => `${n}/${d}`;
const simplest = (n: number, d: number) =>
  fraction(n / gcd(n, d), d / gcd(n, d));
const makeSet = (unit: 'P61' | 'P65') => {
  const first = unit === 'P61';
  const id = (n: number) => `${unit}-MAINT-FRACTION-STRUCTURE-Q${n}`;
  const task = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次只做一个小问，先生成图、数和自己的理由，再核全部小问；正确终值不自动表示理解。',
        'Do ONE subpart at a time. Generate diagrams, numbers and your own reasons before reviewing EVERY part; a correct final value does not automatically establish understanding.',
      ),
    ]);
  const table = (
    q: Question,
    zh: string,
    en: string,
    headers: [string, string][],
    rows: (string | ReturnType<typeof t>)[][],
  ) => {
    q.contextTable = {
      caption: t(zh, en),
      columns: headers.map((h) => t(...h)),
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };
  const roles = [
    ['编号', 'ID'],
    ['数量/含义', 'Quantity / meaning'],
    ['原始数据', 'Original data'],
  ] as [string, string][];
  const wa = first ? 18 : 12,
    wb = 6,
    d = first ? 6 : 4,
    k = first ? 2 : 3;
  const gridRows = first ? 3 : 4,
    gridCols = 4;
  const regions = first
    ? [
        [1, 2, 3, 4],
        [5, 6, 9, 10],
        [7, 8, 11, 12],
      ]
    : [
        [1, 2, 3, 4],
        [5, 6, 9, 13],
        [7, 8, 11, 12],
        [10, 14, 15, 16],
      ];
  const count = regions.length,
    cells = gridRows * gridCols;
  const q1 = task(
    1,
    'unit-fraction-whole',
    '① W_A/W_B为两根完整绳长，分别等分成d段并取k段。先按同一米标尺画图，写每段占各自整根的单位分数、每段实际米数、k段总米数，并乘回整根；取更多段会改变每段的分数单位吗？为什么同分数不保证同米数？② 另画G_R行、G_C列的厘米方格整体，格号按从左到右、从上到下排列；表给A等区域的格号，每格1cm²。检查有无重叠/遗漏，算各区域面积与整体比例：外形不同一定不等面积吗？③ 再只把A的第一格改归B，其余不动，重算各比例，还能把每区都叫原单位分数吗？④ 另说明1/d与2/(2d)的数量关系，为什么只有前者是所要求的单位分数写法；d=0为何不可用。',
    '① W_A/W_B are whole rope lengths; split each into d equal lengths and take k lengths. DRAW using one metre scale. Give the unit fraction per length, actual metres per length and total metres for k lengths, and multiply back to each whole. Does taking more lengths change the fractional UNIT? Why need equal fractions not give equal metres? ② Separately DRAW a G_R-by-G_C centimetre grid, numbered across each row from top to bottom. Each cell is 1 cm²; the table lists the cells belonging to each region. Check overlap and coverage, find each area and fraction, and decide whether different shapes must have different areas. ③ Then transfer ONLY the first cell of A to B, leaving everything else fixed. Recalculate fractions: may every region retain its original unit-fraction label? ④ Explain why 1/d and 2/(2d) have equal value but only the first is the requested unit-fraction form, and why d=0 is invalid.',
    `绳每段均占各自整体1/${d}；W_A每段${simplest(wa, d)}m，取${k}段${simplest(wa * k, d)}m；W_B每段${simplest(wb, d)}m，取${k}段${simplest(wb * k, d)}m。每段乘${d}还原${wa}m/${wb}m；份数与比例、实际米数分开。方格共有${cells}cm²，原${count}区无重叠无遗漏，各4cm²、各占1/${count}；条形与其他形状面积可相同。转移格1后A3cm²、B5cm²，其余各4cm²，占3/${cells}、5/${cells}及4/${cells}，不再每区都是1/${count}。绳段的1/${d}与方格单格1/${cells}不是同一整体下的小单位。1/${d}=2/${2 * d}，但单位分数写法分子须1；分母0没有合法等份意义。`,
    `Each rope length is 1/${d} of its own whole. W_A: ${simplest(wa, d)} m each, ${simplest(wa * k, d)} m for ${k} lengths. W_B: ${simplest(wb, d)} m each, ${simplest(wb * k, d)} m selected. Multiplying each share by ${d} recovers ${wa} m / ${wb} m. Part count, proportion and metres have distinct roles. Grid area=${cells} cm²: all ${count} original regions cover it without overlap or gaps; each has 4 cm² and fraction 1/${count}. A strip and other shapes can have equal areas. After moving cell 1: A has 3 cm², B has 5 cm² and the other regions have 4 cm² each: fractions 3/${cells}, 5/${cells} and 4/${cells}. They cannot all be 1/${count}. A rope share 1/${d} and a grid cell 1/${cells} have different reference wholes. 1/${d}=2/${2 * d}, but a unit-fraction representation requires numerator one. A zero denominator is invalid.`,
    '先给每根绳子标好自己的整体，再用单位方格面积而非外观核区域。',
    'Label each rope whole first. Use unit-cell areas rather than appearance to check regions.',
  );
  table(
    q1,
    '绳子与独立方格图的原始记录；区域行列出格号。',
    'Original records for ropes and a SEPARATE grid; region rows list cell IDs.',
    roles,
    [
      ['W_A', t('第一根整体/m', 'First rope whole/m'), String(wa)],
      ['W_B', t('第二根整体/m', 'Second rope whole/m'), String(wb)],
      ['d', t('每根等份数', 'Equal lengths per rope'), String(d)],
      ['k', t('所取段数', 'Selected lengths'), String(k)],
      ['G_R', t('方格行数', 'Grid rows'), String(gridRows)],
      ['G_C', t('方格列数', 'Grid columns'), String(gridCols)],
      ...regions.map((r, i) => [
        String.fromCharCode(65 + i),
        t('区域格号', 'Region cell IDs'),
        r.join(', '),
      ]),
    ],
  );

  const den = first ? 5 : 7,
    values = [den - 1, den, first ? 13 : 16, 2 * den, 0];
  const classification = (english: boolean) =>
    values
      .map((n, i) =>
        english
          ? `${['A', 'B', 'C', 'D', 'Z'][i]}:${n}/${den}; ${n === 0 ? 'zero' : n < den ? 'proper' : 'improper'}; full=${Math.floor(n / den)}; remainder=${n % den}/${den}; minimum outlines=${Math.ceil(n / den)}`
          : `${['A', 'B', 'C', 'D', 'Z'][i]}:${n}/${den}，${n === 0 ? '零' : n < den ? '真分数' : '假分数'}，完整${Math.floor(n / den)}升，余${n % den}/${den}升，最少${Math.ceil(n / den)}条轮廓`,
      )
      .join(english ? '. ' : '；');
  const q2 = task(
    2,
    'proper-improper',
    '① 固定1L为每个计量整体，逐行画同大小轮廓并涂所取小份。分类时明确本课只分类正分数；另写每行涂满整体数、余下小份和装下全部涂色最少轮廓数，解释C与D的两个计数为何不同或相同。② Z表示没有量，工作台仍显示一条空参考轮廓是否表示取了1L？③ 为什么分子等于分母也是假分数，“假”是否说量不存在？④ C跨多条后分母能否改为所有轮廓总格数？只把C分母加倍而保持分子，实际量怎样变？',
    '① Fix ONE LITRE as every measurement whole. DRAW equal whole outlines and shade the selected parts for every row. Classify POSITIVE fractions only, labelling zero separately. For each row state the filled-whole count, remaining shares and minimum outlines needed to hold all shading; explain why these two counts differ for C but match for D. ② For Z, does an empty reference outline in the workshop mean one litre was taken? ③ Why does equality of numerator and denominator count as improper, and does “improper” mean unreal? ④ May C replace its denominator with the total cells across all outlines? What happens to C if ONLY its denominator doubles?',
    `${classification(false)}。真分数表示正量不足1，假分数包含恰好1；Z不纳入本课正分数分类，实际完整升与最少所需轮廓均0，工作台的一条空轮廓只是参照。C每整条仍${den}小份，不能改为全部轮廓的总格数。C只加倍分母变${values[2]}/${2 * den}L，量减半，并不是原量的等值式；“假”不否定量真实存在。`,
    `${classification(true)}. Proper means a POSITIVE amount below one; improper includes exactly one. Z is outside this lesson's positive classification: zero filled litres and zero outlines minimally required for zero shading. The workshop's one empty guide is a reference, not a selected litre. Each C outline still has ${den} parts; do not total all cells into its denominator. Doubling ONLY C's denominator gives ${values[2]}/${2 * den} L, HALF its former amount rather than an equivalent representation. “Improper” does not mean unreal.`,
    '分清涂满了几条和至少几条才能装下全部涂色；零量的空参考框不是涂满一条。',
    'Distinguish filled strips from outlines needed for all shading. A zero-amount reference frame is not a filled strip.',
  );
  table(
    q2,
    '每行是独立的升数，1L整体始终固定。',
    'Independent litre amounts; every whole stays ONE litre.',
    [
      ['编号', 'ID'],
      ['分子：小份数', 'Numerator: part count'],
      ['分母：每升等份', 'Denominator: parts per litre'],
    ],
    values.map((n, i) => [
      ['A', 'B', 'C', 'D', 'Z'][i]!,
      String(n),
      String(den),
    ]),
  );

  const an = first ? 14 : 17,
    bn = first ? 12 : 18,
    cn = first ? 4 : 5,
    whole = first ? 2 : 3,
    rem = first ? 3 : 2,
    total = whole * 5 + rem,
    ar = an % 6;
  const q3 = task(
    3,
    'mixed-fraction',
    '① 固定1m单位条，把A/B/C/Z的分数写成规范带分数、整数或不足一的真分数；A先保原分母，再给一种等值且余下分数仍不足1的写法。本题不强制余下分数最简。每行用“分子=完整数×分母+余数”并换回核验。② D给整数部分、余下分子和分母，要求用分母5的假分数表示并画图；为什么不能把整数直接加余下分子，或把空格理解成乘号？③ E是与A同量的候选，值错了吗，还是余下部分不规范，怎样修复？④ A的余数能否改除以原分子？若D改写成两数都加倍的分数，数值虽相等是否完成指定分母5？',
    '① Use fixed ONE-METRE strips. Convert A/B/C/Z to a standard mixed number, integer or proper fraction as appropriate. For A first retain its denominator, then give another equal form with a proper remainder; this task does NOT require the remainder to be simplest. For every row write numerator=wholes×denominator+remainder and convert back. ② D supplies wholes, remainder numerator and denominator: DRAW it and give an improper fraction with denominator FIVE. Why may the whole count not be added directly to the numerator, or the mixed-number space read as multiplication? ③ E has A’s value: is its quantity wrong, or is its remainder nonstandard? Repair it. ④ May A put its original numerator below the remainder? Does doubling both numbers of D complete the requested denominator-five form?',
    `A:${an}/6=2 ${ar}/6；${an}=2×6+${ar}，可另写2 ${2 * ar}/12，余下均不足1。B:${bn}/6=${bn / 6}，${bn}=${bn / 6}×6+0；C:${cn}/6仍不足1，${cn}=0×6+${cn}；Z:0/6=0，0=0×6+0，各余数均以六分之一计，不改为${ar}/${an}。D:${whole} ${rem}/5=${total}/5m，${whole}整米含${whole * 5}个五分之一，再加${rem}；(${whole}+${rem})/5=${whole + rem}/5与${whole}×${rem}/5都不表达原量。E:1 ${an - 6}/6与A等值，但分数部分≥1，须把其中一整米并入整数部分，得A的规范写法。D的${2 * total}/10与${total}/5同值，却不是指定分母5；不能把同值误判为数量错。`,
    `A:${an}/6=2 ${ar}/6; ${an}=2×6+${ar}. Another valid form is 2 ${2 * ar}/12; both remainders are proper, whether simplified or not. B:${bn}/6=${bn / 6}; ${bn}=${bn / 6}×6+0. C:${cn}/6 stays proper; ${cn}=0×6+${cn}. Z:0/6=0; 0=0×6+0. Remainders count sixths, not ${ar}/${an}. D:${whole} ${rem}/5=${total}/5 m: ${whole} whole metres contain ${whole * 5} fifths, plus ${rem}. Neither (${whole}+${rem})/5=${whole + rem}/5 nor multiplying ${whole}×${rem}/5 gives the original amount. E:1 ${an - 6}/6 has A's VALUE but a remainder at least one; regroup one more whole into the integer part to obtain A's standard form. ${2 * total}/10 equals D's value but does not meet denominator FIVE; distinguish quantity from required form.`,
    '余数的单位由原分母决定；没有余数写整数，不足一直接写真分数。',
    'The original denominator determines the remainder unit. Write an integer for no remainder and a proper fraction below one.',
  );
  table(
    q3,
    'A/B/C/Z给原分数；D给“整体数，余下分子，分母”；E给待检查候选。',
    'A/B/C/Z give original fractions; D gives “wholes, remainder numerator, denominator”; E is a candidate.',
    roles,
    [
      ['A', t('原分数/m', 'Original fraction/m'), `${an}/6`],
      ['B', t('原分数/m', 'Original fraction/m'), `${bn}/6`],
      ['C', t('原分数/m', 'Original fraction/m'), `${cn}/6`],
      ['Z', t('原分数/m', 'Original fraction/m'), '0/6'],
      [
        'D',
        t('整体数，余下分子，分母', 'Wholes, remainder numerator, denominator'),
        `${whole}, ${rem}, 5`,
      ],
      ['E', t('候选带分数/m', 'Candidate mixed form/m'), `1 ${an - 6}/6`],
    ],
  );

  const en = first ? 3 : 2,
    ed = first ? 5 : 3,
    factor = 3,
    fillN = first ? 2 : 3,
    fillD = first ? 5 : 7,
    fillFactor = first ? 4 : 3,
    physical = first ? 10 : 9;
  const q4 = task(
    4,
    'equivalent-fraction',
    '① A给原分子、分母与细分倍数。先画同一个整体及涂色区域，再预测两数怎样变，画粗线/细线重合检查；为什么端点固定而小份数改变？② B给原分数与目标分子，求缺分母；C把A细分后的分数换回原分母，求分子。③ 若A只改分母不改分子，量变为原几分之一？倍数1与0有什么区别，反向分组的除数有什么条件？④ 再自己生成一个与A同值而不同于题中细分结果的分数并用等份解释，多种答案均可。⑤ W是实际整体升数，求A及其细分形式各对应多少L；仅把实际整体翻倍而不改分数，量仍相等吗？',
    '① A supplies numerator, denominator and refinement factor. DRAW one unchanged whole and shaded region, predict both new counts, and overlay coarse/fine cuts. Why does the endpoint stay fixed while the part count changes? ② B supplies an original fraction and target numerator: find its denominator. C reverses A’s refinement back to the original denominator: find its numerator. ③ If A changes ONLY the denominator, what fraction of its former value remains? Distinguish factors ONE and ZERO; what conditions permit inverse grouping? ④ Generate another equal fraction different from the supplied refined result and explain its equal parts; multiple answers are valid. ⑤ W is the actual whole in litres: find the litres for both representations. If only the actual whole doubles, does the actual amount stay equal?',
    `A:${en}/${ed}=${en * factor}/${ed * factor}，每原份等分${factor}份，涂色与整体同时细分且端点不动；B:${fillN}/${fillD}=${fillN * fillFactor}/${fillD * fillFactor}，缺分母${fillD * fillFactor}；C:${en * factor}/${ed * factor}=${en}/${ed}，缺分子${en}。只改A分母得${en}/${ed * factor}，是原量1/${factor}。倍数1保持两数；0导致0/0无定义，不能用于等值规则。反向须同除可整除两数的正整数。另一合法例${2 * en}/${2 * ed}，任意其他正确等值分数与解释也可。原W=${physical}L，两式均${simplest(physical * en, ed)}L；W翻倍后${simplest(2 * physical * en, ed)}L，比例相同但实际量翻倍，不是倒水或损失。`,
    `A:${en}/${ed}=${en * factor}/${ed * factor}: each original part splits ${factor} ways; both total and shaded counts change while endpoints stay fixed. B:${fillN}/${fillD}=${fillN * fillFactor}/${fillD * fillFactor}, so the missing denominator is ${fillD * fillFactor}. C:${en * factor}/${ed * factor}=${en}/${ed}, so its numerator is ${en}. Changing only A's denominator gives ${en}/${ed * factor}, ONE/${factor} of the former amount. Factor one preserves both numbers; zero produces undefined 0/0, not equivalence. Inverse grouping divides both by a common positive integer factor. Another example is ${2 * en}/${2 * ed}; accept other correct equal fractions and explanations. With W=${physical} L, both forms select ${simplest(physical * en, ed)} L. Doubling W gives ${simplest(2 * physical * en, ed)} L: the proportion stays equal but the actual amount doubles. No liquid disappears.`,
    '同一次等分必须同时改变涂色份数和每整体份数；填空先辨认缺分子还是分母。',
    'One repartitioning changes both shaded and whole counts. Identify whether a blank requests numerator or denominator.',
  );
  table(
    q4,
    'A列“分子，分母，细分倍数”；B列“原分子，原分母，目标分子”。',
    'A: “numerator, denominator, refinement factor”; B: “original numerator, original denominator, target numerator”.',
    roles,
    [
      [
        'A',
        t('原分数与细分', 'Original and refinement'),
        `${en}, ${ed}, ${factor}`,
      ],
      [
        'B',
        t('等值填空', 'Equivalent-fraction blank'),
        `${fillN}, ${fillD}, ${fillN * fillFactor}`,
      ],
      [
        'C',
        t('细分后恢复原分母', 'Undo refinement to original denominator'),
        `${en * factor}/${ed * factor} → ?/${ed}`,
      ],
      ['W', t('实际整体/L', 'Actual whole/L'), String(physical)],
    ],
  );

  const sn = first ? 18 : 20,
    sd = first ? 30 : 28,
    g = gcd(sn, sd),
    primeN = first ? 7 : 5,
    oddN = first ? 9 : 15,
    oddD = first ? 15 : 21,
    subN = first ? 4 : 5,
    subD = first ? 7 : 8,
    intN = first ? 18 : 21,
    intD = first ? 6 : 7;
  const q5 = task(
    5,
    'simplest-fraction',
    '① 把A的原小份画成同一整体的分组：先两数同除2，再继续约到最简，另找一步约尽的路径，逐步写等值式并说明原量不变；原图表示L而不是倒水。② 列B分子分母全部共同因数，B已最简必须两数相邻吗？C分子为奇数就不能约了吗，求最简并给因数证据。③ D、Z的最简写法是什么，整数能直接写吗？④ S若把分子分母同时减1，是合法约分吗，用交叉相乘或同整体图检查实际量，不仅说数字变小。⑤ 说明等值中间结果、最简分数和小数表示三种不同要求；同除0、同除不能整除两数的数为何不属于本课整数分组。',
    '① DRAW A’s original equal shares and regroup within one unchanged whole. First divide both numbers by TWO and continue to simplest form; also find a one-step route. Give every equivalent step and explain why litres stay unchanged rather than water being removed. ② List ALL common factors for B: must a simplest fraction have adjacent numbers? C has an odd numerator: can it still simplify? Find its simplest form with factor evidence. ③ Give simplest forms for D and Z; may integer results be written directly? ④ For S, subtract ONE from both numbers. Is this valid simplification? Use cross-products or a common-whole diagram, not merely smaller written numbers. ⑤ Distinguish equivalent intermediate forms, simplest fractions and decimal notation. Why are zero division or a number not dividing both excluded from this integer-grouping operation?',
    `A:${sn}/${sd}=${sn / 2}/${sd / 2}=${simplest(sn, sd)}L；第二步同除${g / 2}，一步可同除${g}。每次分组保持整体与涂色区域，不减少L。B:${primeN}/12共有因数仅1，已最简，分子分母不相邻。C:${oddN}/${oddD}=${simplest(oddN, oddD)}，可同除3，奇数不保证互质。D:${intN}/${intD}=3/1=3；Z:0/15=0/1=0。S:${subN}/${subD}≠${subN - 1}/${subD - 1}，交叉乘积${subN * (subD - 1)}≠${(subN - 1) * subD}，同减不保量。A的第一步等值但未最简；最终分子分母互质，小数即使等值也不符合指定分数写法。只能同除共同正整数因数，不能除0或让整数份数变非整数。`,
    `A:${sn}/${sd}=${sn / 2}/${sd / 2}=${simplest(sn, sd)} L. The second division is by ${g / 2}; one step divides by ${g}. Regrouping preserves the whole and shaded amount, not fewer litres. B:${primeN}/12 has only common factor one and is simplest despite non-adjacent numbers. C:${oddN}/${oddD}=${simplest(oddN, oddD)} by division by THREE: odd does not guarantee coprime. D:${intN}/${intD}=3/1=3. Z:0/15=0/1=0. S:${subN}/${subD}≠${subN - 1}/${subD - 1}; cross-products ${subN * (subD - 1)}≠${(subN - 1) * subD}. Subtracting the same number does not preserve its value. A's first step is equivalent but unfinished; the final numbers are coprime. A decimal, even when exactly equivalent, is not the requested fraction form. Integer grouping uses a common positive integer factor, never zero or a divisor failing to divide both counts.`,
    '先检查等值，再检查有无剩余共同因数；这是两个检查，不是看数字外观。',
    'Check equal value, THEN any remaining common factor. These are separate checks, not a test of digit appearance.',
  );
  table(
    q5,
    '每行分数以1L为计量整体；S只检查“同减1”的说法。',
    'Each fraction uses one litre as measurement whole; S tests the claim “subtract one from both”.',
    [
      ['编号', 'ID'],
      ['分子', 'Numerator'],
      ['分母', 'Denominator'],
    ],
    [
      ['A', String(sn), String(sd)],
      ['B', String(primeN), '12'],
      ['C', String(oddN), String(oddD)],
      ['D', String(intN), String(intD)],
      ['Z', '0', '15'],
      ['S', String(subN), String(subD)],
    ],
  );

  const left = first ? [5, 6] : [7, 8],
    right = first ? [7, 9] : [5, 6],
    lcd = (left[1]! / gcd(left[1]!, right[1]!)) * right[1]!,
    ln = (left[0]! * lcd) / left[1]!,
    rn = (right[0]! * lcd) / right[1]!;
  const bleft = first ? [1, 6] : [1, 8],
    bright = first ? [1, 9] : [1, 12],
    cleft = right,
    cright = [1, 2],
    gl = first ? '3/4' : '2/3';
  const multiples = (step: number) =>
    Array.from({ length: lcd / step }, (_, i) => (i + 1) * step).join(', ');
  const q6 = task(
    6,
    'fraction-comparison',
    '① A在相同1km单位下比较：自己列两分母正倍数到首次共同项，求最小共同分母，通分、写符号并在同尺度条上标精确差。分母乘积也能用吗，是否总最小？分母和能直接作共同分母吗？② B比较单位分数并讲每份大小；C检验“分母更大就一定更小”的泛化；E两数写法不同是否也能相等？③ F先沿用A两条各1km整体，随后只把右整体改2km，保持画图标尺并改标签，重画实际选取量，比较是否反转；仅缩放图而保1km标签能改变实际长度吗？④ G两比例分别来自两个未知大小整体，右整体只知比左大；请自己给三组大小，使左实际量分别大于、等于、小于右量，说明为何信息不足。⑤ 最后比较同数值的1/2km与1/2m，不能把单位抹掉。',
    '① Compare A on a common ONE-KILOMETRE reference. Generate positive-multiple lists up to their FIRST common value, find the least common denominator, convert both fractions, and mark the exact gap on equal-scale strips. Can the denominator product work, and is it always least? Can the denominator sum simply be used? ② For B compare unit fractions through part size. Use C to test “larger denominator always means smaller fraction”. Can E’s different notations be equal? ③ F starts with A’s two one-kilometre wholes, then changes ONLY the right whole to TWO kilometres. Retain a common drawing scale, relabel, draw the actual portions and compare again. Does zooming a drawing while keeping its one-kilometre label change actual distance? ④ G uses unknown wholes, with the right whole larger: GENERATE three pairs of sizes making the left actual portion greater, equal and smaller. Explain the missing information. ⑤ Finally compare 1/2 km and 1/2 m without dropping units.',
    `A:${left.join('/')}=${ln}/${lcd}>${rn}/${lcd}=${right.join('/')}，差1/${lcd}km；最小共同分母${lcd}，两列${multiples(left[1]!)}与${multiples(right[1]!)}首次共同项为${lcd}。乘积${left[1]! * right[1]!}也共同但非最小；和${left[1]! + right[1]!}并非两分母共同倍数。B:${bleft.join('/')}>${bright.join('/')}，固定整体等分越细每份越小。C:${cleft.join('/')}>1/2，说明分子也变时不能仅看分母；E:${left.join('/')}=${2 * left[0]!}/${2 * left[1]!}。F左仍${left.join('/')}km，右变${simplest(2 * right[0]!, right[1]!)}km，实际左<右；分数数值排序未变，改变了右参考整体，纯缩放不改实际量。G允许多解：${first ? '(4,5)、(4,6)、(4,8)m使左3m，右5/2、3、4m' : '(6,7)、(6,8)、(6,10)m使左4m，右7/2、4、5m'}，右整体都更大而三种结果皆可。1/2km=500m>1/2m，实际长度为其1000倍。全部图与步道均假想，不需出行或测屏幕。`,
    `A:${left.join('/')}=${ln}/${lcd}>${rn}/${lcd}=${right.join('/')}; gap=1/${lcd} km. The least denominator is ${lcd}; lists ${multiples(left[1]!)} and ${multiples(right[1]!)} first meet at ${lcd}. Product ${left[1]! * right[1]!} works but is not least; sum ${left[1]! + right[1]!} is not a common multiple. B:${bleft.join('/')}>${bright.join('/')}: finer equal parts of a fixed whole are smaller. C:${cleft.join('/')} > 1/2, so a changed numerator defeats the denominator-only rule. E:${left.join('/')}=${2 * left[0]!}/${2 * left[1]!}. F keeps the left at ${left.join('/')} km but the right becomes ${simplest(2 * right[0]!, right[1]!)} km; actual left < right. Fraction-number order did not change; the right whole did. Zooming alone changes no distance. G admits many examples: ${first ? 'wholes (4,5), (4,6), (4,8) m give left 3 m and right 5/2, 3, 4 m' : 'wholes (6,7), (6,8), (6,10) m give left 4 m and right 7/2, 4, 5 m'}. The right whole is larger in every case, yet all three portion orderings occur. 1/2 km=500 m > 1/2 m, one thousand times its length. All diagrams/tracks are fictional; no trip or screen measurement is required.`,
    '共同分母必须是两分母的倍数；比较分数数值与比较不同整体的实际量要分开。',
    'A common denominator must be a multiple of BOTH denominators. Separate fraction-number comparison from actual portions of different wholes.',
  );
  table(
    q6,
    'A/B/C/E给左右分数；F给改变后的左右整体km；G给左右比例并限定右整体更大。',
    'A/B/C/E: left/right fractions. F: changed left/right wholes in km. G: left/right proportions, with right whole LARGER.',
    [
      ['编号', 'ID'],
      ['左', 'Left'],
      ['右', 'Right'],
    ],
    [
      ['A', left.join('/'), right.join('/')],
      ['B', bleft.join('/'), bright.join('/')],
      ['C', cleft.join('/'), cright.join('/')],
      ['E', left.join('/'), `${2 * left[0]!}/${2 * left[1]!}`],
      ['F', '1', '2'],
      ['G', gl, '1/2'],
    ],
  );
  return {
    id: `${unit}-MAINT-FRACTION-STRUCTURE`,
    unit,
    title: t(
      '整体、小单位与同量变换',
      'Wholes, share units and conserved representations',
    ),
    intro: t(
      '六张过程卡分多次，一次只做一个小问，不计时。先画图、写原数和自己的理由，全部小问核齐才确认；读题帮助与数学提示分开，可口述或用熟悉语言。数据均假想，不是家庭实测，不需采购、出行或量屏幕。',
      'Split SIX process cards across sittings, ONE SUBPART at a time without a timer. Generate drawings, original numbers and your own reasons before reviewing EVERY part. Separate reading help from maths hints; oral explanations or a familiar language are welcome. All data are fictional, not family observations; no purchase, travel or screen measurement is required.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
    bridge: 'P53-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), `P53-L0${n}`]),
    ),
  };
};
export const fractionStructureRetrieval = {
  P61_FRACTION_STRUCTURE: makeSet('P61'),
  P65_FRACTION_STRUCTURE: makeSet('P65'),
};
