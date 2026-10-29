import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H03' | 'H04') => {
  const near = unit === 'H03',
    p = near ? 2 : 3,
    fraction = near ? '9/16' : '25/36',
    root = near ? '3/4' : '5/6',
    id = (n: number) => `${unit}-MAINT-RADICAL-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, en), skill, t(rz, re), [
      t(
        '先确认原式、实数域、符号与所问对象；写自己的精确计算或构造，再逐项解释。平方相同还要核符号，变形不能救回原本无定义的式子。',
        'Identify the original expression, real domain, signs and requested object. Generate exact calculations or constructions and explain each part. Equal squares still require sign checks; transformations cannot repair an originally undefined expression.',
      ),
      t(
        '每次一个编号或独立案例，可分次、不计时，允许口述或熟悉语言。读题帮助与数学提示分开，作者示例不是唯一许可设计。',
        'One numbered part or separate case per untimed sitting; oral or familiar-language reasoning is welcome. Separate reading help from mathematical hints. Author examples are not the only permitted designs.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '虚构纸上原条件；编号案例独立，全部在实数范围。图标均匀刻度、精确标签与相应单位；像素或显示小数不当证明。',
        'Fictional paper conditions. Labelled cases are independent and all use the real domain. Draw uniform scales, exact labels and appropriate units; pixels or displayed decimals are not proofs.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([key, z, en, v, ve]) => [
        t(key, key),
        t(z, en),
        t(v, ve),
      ]),
    };
  };
  const prefix = near ? '0.12' : '0.23',
    literal = near ? '1.414' : '1.732',
    recurring = near ? '27' : '18';
  const q1 = card(
    1,
    'fractional-root-sets-and-exact-real-objects',
    '① A–E分别先判实数中是否有意义，再完整给方程根集或符号值并代回；A与B为何不同？C/D都出现负号为何结果不同？E可把平方与根号先“消掉”吗？A若换为面积，几何边长与方程全部根分别是什么，不能把负的几何边长写出来或漏纯方程负根。② 对F各个明确精确对象逐项分类并给整数比或理由；亲由100x−x求循环小数的比。负无理数仍实在数轴上，负被开方数无实数值，二者能混成一类吗？沿用旧卡的正根无理证明，说明外负号为何不能使它变有理。画同一均匀数轴上的−√p、0、√p及±r，标精确名字和严格整数界；窗口变化会改数吗？③ P仅给两位小数前缀。自己给一个有理和一个无理完整延续，证明都以该前缀开始并证明所属类别；不能只写两个省略号。给定有限字面与某个根的屏显近似，能当作同一个精确对象吗？',
    '① For EACH A–E, first decide real-domain meaning, then give the complete equation set or single symbol value and substitute back. Why do A/B differ? Why do the minus signs in C/D give different results? May E cancel square and root before checking meaning? If A instead describes area, distinguish geometric side from ALL equation roots: neither a negative geometric length nor a lost algebraic root is acceptable. ② Classify EVERY exact object in F, giving integer ratios or reasons. Derive the recurring decimal ratio using 100x−x. Distinguish a negative irrational real from a negative-radicand expression without a real value. Use the existing positive-root irrationality proof to explain why an outside minus cannot make it rational. Plot −√p,0,√p and ±r on ONE uniform real line, with exact labels and strict integer brackets. Does a changed window change the numbers? ③ P supplies ONLY a two-place decimal prefix. DESIGN one complete rational and one complete irrational continuation, proving the prefix and each class; two unspecified ellipses are insufficient. Is a finite literal identical to an original root whose screen approximation resembles it?',
    `A根集{−${root},${root}}，B=${root}，C=−${root}，D=${root}=|−${root}|；每个分母平方也须代回${fraction}。E的内层√(−${fraction})已无实数值，外平方不能救回；与D先平方负有理数不同。面积若为${fraction}cm²，边长只${root}cm，纯方程仍两根。F中${literal}是有限整数比${near ? '707/500' : '433/250'}，0.(${recurring})由100x−x=${recurring}得${near ? '3/11' : '2/11'}；√(${fraction})=${root}有理，−√${p}若有理其相反数√${p}亦有理，与旧卡证明矛盾，故为无理实数。√(−${p})无实数轴点，不叫无理数。1<√${p}<2由1<${p}<4及非负平方保序，负根−2<−√${p}<−1；±r各在(−1,0)/(0,1)，0单点，负号反转界限，视窗不变精确数。P允许任意合条件完整延续：例如有理${prefix}000…=${prefix}，无理${prefix}+√${p}/1000。后者减有理前缀再乘1000若有理就使√${p}有理，矛盾；1<√${p}<2使增量在0.001与0.002之间，仍以${prefix}开头。有限字面数与原无理根不能精确等同，近似应标≈。`,
    `A has roots {−${root},${root}}; B=${root}, C=−${root}, D=${root}=|−${root}|. Squaring the denominator also restores ${fraction}. E contains undefined real √(−${fraction}); a later square cannot repair it, unlike D's square of a real negative rational. For area ${fraction}cm², side=${root}cm, while the pure equation retains both signs. In F, literal ${literal} is ratio ${near ? '707/500' : '433/250'}. For 0.(${recurring}), 100x−x=${recurring}, hence ${near ? '3/11' : '2/11'}. √(${fraction})=${root} is rational. If −√${p} were rational, its opposite √${p} would be rational, contradicting the existing proof. Thus it is an irrational REAL. √(−${p}) has no real point and is not irrational. Since 1<${p}<4, nonnegative square order gives 1<√${p}<2 and −2<−√${p}<−1; ±r lie in (−1,0)/(0,1), and zero is one point. Windows preserve exact numbers. Accept ANY valid complete continuations of P. Examples: rational ${prefix}000…=${prefix}; irrational ${prefix}+√${p}/1000. Rationality of the latter would make √${p} rational after subtracting the rational prefix and multiplying by 1000. The increment lies strictly between 0.001 and 0.002, preserving prefix ${prefix}. A finite literal is not the original irrational root; mark approximations with ≈.`,
  );
  table(q1, [
    [
      'A',
      '实数方程全部根',
      'All real equation roots',
      `x²=${fraction}`,
      `x²=${fraction}`,
    ],
    [
      'B',
      '单主根',
      'Single principal root',
      `√(${fraction})`,
      `√(${fraction})`,
    ],
    ['C', '外部负号', 'Outside minus', `−√(${fraction})`, `−√(${fraction})`],
    [
      'D',
      '先平方实数',
      'Square the real input first',
      `√((−${root})²)`,
      `√((−${root})²)`,
    ],
    [
      'E',
      '先对负数开方',
      'Root a negative first',
      `(√(−${fraction}))²`,
      `(√(−${fraction}))²`,
    ],
    [
      'F',
      '独立精确对象及图标记',
      'Separate exact objects and plot labels',
      `${literal}; 0.(${recurring}); √(${fraction}); −√${p}; √(−${p}); p=${p}, r=${root}`,
      `${literal}; 0.(${recurring}); √(${fraction}); −√${p}; √(−${p}); p=${p}, r=${root}`,
    ],
    [
      'P',
      '仅知前两位，后续未知',
      'Only the first two decimal digits known',
      `${prefix}…，未规定之后的规律`,
      `${prefix}…; no continuation rule specified`,
    ],
  ]);
  const a = near ? '12/25' : '20/49',
    b = near ? '27/25' : '45/49',
    prime = near ? 3 : 5,
    denom = near ? 5 : 7,
    other = near ? 2 : 3,
    divisor = near ? '3/4' : '5/9';
  const q2 = card(
    2,
    'fractional-radical-form-domain-and-own-area',
    '① G四种写法逐一判数值是否等于原主根、是否完成本课最简形式，说明每个未完成原因并整理；不固定项序或强求唯一写法。再给候选负值平方虽相同，为何不等原主根？② 独立算B差、C和、D商，列原根式/分母条件、精确完成结果并回查；C异类能只因都带根号就合并吗，B差为何可负？③ E的零/一和F原分母化简后为零分别如何处理，写原式定义与值；不能把原零分母式“有理化”成合法数或统称零。④ 自选a≥2的整数与无非平凡平方因子的整数b>1，设计面积a²b cm²的虚构正方形；亲画a×a小方格，给每块面积/边长、总块数/外面积/外边长与平方检查，不能以图上像素比较不同案例。另把代数−√(a²b)写完成，解释其负号不代表负几何边。一次一个独立案例，作者例子不唯一。',
    '① For EACH of G’s four forms, assess equality to the original principal root AND finished form, explaining and repairing every unfinished form. Do not require one term order or unique spelling. Why does the supplied negative candidate fail despite the same square? ② Independently evaluate difference B,sum C,quotient D. State original real/denominator conditions,finish exactly and check back. Must C combine merely because both terms have radicals? Why may B be negative? ③ Evaluate E’s zero/one cases and diagnose F’s denominator after simplification, distinguishing a defined value from an undefined original. Rationalisation cannot repair zero division or turn every case into zero. ④ CHOOSE an integer a≥2 and a square-free integer b>1 for a fictional square of area a²b cm². Draw the actual a×a array; give each tile’s area/side,total count,outer area/side and a square check. Pixel sizes across cases do not compare actual lengths. Separately simplify algebraic −√(a²b),explaining why its negative is not a geometric side. One independent case at a time; author examples are not unique.',
    `G四式数值都等${`2√${prime}/${denom}`}，只有已提尽平方因子、整数根内、无根式分母、系数算完/无零项者完成；原√(${a})根内分数，√${near ? 12 : 20}/${denom}仍有平方因子，末+0有零项，均须整理。负候选−2√${prime}/${denom}为负而原主根正，平方同不足。B=(2−3)√${prime}/${denom}=−√${prime}/${denom}；C=2√${prime}/${denom}+√${other}/${denom}两异类保留；D=${near ? '4/5' : '6/7'}，分母√(${divisor})>0，乘回原分母得到原分子。各给定非负被开方数合法，不能把C合成一根。E:√0=0，√1=1，√0/√(1/4)=0，因分母1/2非零；1/√0无定义。F原分母√${near ? 12 : 20}−2√${prime}=0，原倒数无定义，任何后续同乘/约分都不救回。自主设计示例a=${near ? 2 : 3},b=${near ? 5 : 3}：${near ? 4 : 9}小块每面积${near ? 5 : 3}cm²/边√${near ? 5 : 3}cm，总面积${near ? 20 : 27}cm²、外边${near ? '2√5' : '3√3'}cm，边平方核原面积；外负的代数式为${near ? '−2√5' : '−3√3'}，非几何边。需核所有自选a,b、实际阵列/单位与平方，而非照抄例子；允许任意合条件选择。`,
    `All four G forms equal 2√${prime}/${denom}. A finished form has extracted square factors,integer radicands,rational denominators,evaluated coefficients and no zero terms. Original √(${a}) has a fractional radicand; √${near ? 12 : 20}/${denom} retains a square factor; the +0 form retains a zero term. Repair each. The negative candidate −2√${prime}/${denom} is negative while the original root is positive,so equal squares do not establish equality. B=(2−3)√${prime}/${denom}=−√${prime}/${denom}; C=2√${prime}/${denom}+√${other}/${denom} keeps unlike terms; D=${near ? '4/5' : '6/7'},with positive denominator √(${divisor}),and multiplication back restores the original numerator. All supplied radicands are nonnegative; C cannot become one root by adding radicands. E gives √0=0,√1=1,√0/√(1/4)=0 because its denominator is 1/2,while 1/√0 is undefined. F has √${near ? 12 : 20}−2√${prime}=0,so its original reciprocal is undefined and cannot be rescued by later multiplication/cancellation. A permitted own design is a=${near ? 2 : 3},b=${near ? 5 : 3}: ${near ? 4 : 9} tiles each of area ${near ? 5 : 3}cm² and side √${near ? 5 : 3}cm give outer area ${near ? 20 : 27}cm² and side ${near ? '2√5' : '3√3'}cm. Square the outer side to check. Separate algebraic −√(a²b)=${near ? '−2√5' : '−3√3'} is not a geometric side. Review the learner’s own a,b,array,units and squared relation; accept every permitted choice.`,
  );
  table(q2, [
    [
      'G',
      '同一原主根的四形式及另给负候选',
      'Four forms of one principal root plus a negative candidate',
      `√(${a}); 2√${prime}/${denom}; √${near ? 12 : 20}/${denom}; 2√${prime}/${denom}+0。另负候选−2√${prime}/${denom}`,
      `√(${a}); 2√${prime}/${denom}; √${near ? 12 : 20}/${denom}; 2√${prime}/${denom}+0. Separate negative candidate: −2√${prime}/${denom}`,
    ],
    [
      'B',
      '独立差',
      'Independent difference',
      `√(${a})−√(${b})`,
      `√(${a})−√(${b})`,
    ],
    [
      'C',
      '独立和',
      'Independent sum',
      `√(${a})+√(${other}/${denom * denom})`,
      `√(${a})+√(${other}/${denom * denom})`,
    ],
    [
      'D',
      '独立商',
      'Independent quotient',
      `√(${a})/√(${divisor})`,
      `√(${a})/√(${divisor})`,
    ],
    [
      'E',
      '独立零与一边界',
      'Separate zero/one boundaries',
      '√0; √1; √0/√(1/4); 1/√0',
      '√0; √1; √0/√(1/4); 1/√0',
    ],
    [
      'F',
      '原倒数',
      'Original reciprocal',
      `1/(√${near ? 12 : 20}−2√${prime})`,
      `1/(√${near ? 12 : 20}−2√${prime})`,
    ],
  ]);
  const tie = near ? '25/16' : '49/16',
    mid = near ? '1.25' : '1.75',
    lo = near ? '1.2' : '1.7',
    hi = near ? '1.3' : '1.8',
    cross = near ? '999/1000' : '3999/1000',
    error = near ? '9801/1000000' : '39601/1000000';
  const q3 = card(
    3,
    'midpoint-ties-carry-and-actual-error',
    '① T亲算非负主根、相邻十分位端点的平方、中点平方与一位舍入；恰落中点按本课非负四舍五入怎么办？能对精确根写严格夹在中点一侧吗？② C亲以相邻百分位平方及中点平方决定两位舍入，标≈/＝与尾零；原根是否被改成了那个整数？Z完全平方/零在两位形式怎样，能伪写严格界吗？③ X求精确非负根，用相邻百分位平方/中点核下界截断和最近舍入，算这两种输出各自的实际绝对误差。有人给下界也保证≤0.005，用本例反驳；说明整格界与半格界分别适用哪种规则，不能只背半格。④ 在T同一对十分位端点之间，自选两个有理被开方数，要求它们的主根都严格在两端之间，却在中点两侧；给完整数、平方依据、一位舍入与半格误差界，证明仅有同一对端点不能选舍入方向。另自给两个负数，展示平方保序为何不能直接推广整条实轴。',
    '① For T, calculate the nonnegative exact root,adjacent tenth-endpoint squares,midpoint square and one-place rounding. Apply this course’s nonnegative halfway-up rule at equality. May an exact midpoint be placed strictly on one side? ② For C, calculate adjacent hundredth squares and midpoint square to decide two-place rounding,keeping ≈ versus = and trailing zeros. Has the original root become that integer? Give Z’s perfect-square/zero results in two-place form without fabricated strict bounds. ③ Find X’s exact nonnegative root. Check adjacent hundredth squares/midpoint for lower-bound truncation versus nearest rounding,then calculate BOTH actual absolute errors. Refute a claimed ≤0.005 guarantee for the lower bound with this case; explain which rule supports a full-grid or half-grid bound. ④ DESIGN two rational radicands whose roots lie strictly within T’s SAME tenth endpoints but on opposite midpoint sides. Give complete numbers,squared evidence,one-place rounding and half-grid error bounds,proving why those shared endpoints alone cannot decide direction. Separately choose two negative numbers to refute square order over the whole real line.',
    `T根精确${mid}，在${lo}/${hi}间，中点就是${mid}，平方=${tie}相等，按中点向上取${hi}；精确根可写等号，不能伪称在中点左右。C以${near ? '0.99²=0.9801<0.999<1²，中点0.995²=0.990025<0.999' : '1.99²=3.9601<3.999<2²，中点1.995²=3.980025<3.999'}得根≈${near ? '1.00' : '2.00'}，非精确等于该整数。Z的√${near ? 4 : 9}=${near ? 2 : 3}、√0=0精确，两位写${near ? '2.00' : '3.00'}和0.00，不伪严格界。X根精确${near ? '99/1000=0.099' : '199/1000=0.199'}，在${near ? '0.09/0.10' : '0.19/0.20'}间；中点${near ? '0.095²=0.009025<0.009801' : '0.195²=0.038025<0.039601'}，最近两位${near ? '0.10' : '0.20'}。下界截断${near ? '0.09' : '0.19'}误差9/1000=0.009>0.005；最近输出误差1/1000=0.001≤0.005。非负相邻百分位下界截断误差<0.01，最近舍入≤0.005，恰中点达半格；不能错套。自主例可取根${near ? '1.24、1.26' : '1.74、1.76'}，被开方数${near ? '961/625、3969/2500' : '7569/2500、1936/625'}；两根都在${lo}/${hi}间，中点${mid}两侧，一位分别${lo}/${hi}，实际误差均0.04≤0.05。须以平方/非负根核自己的两个有理数，不需唯一例子。负数反例−3<−2但9>4，说明先限定非负平方保序；改变视窗/显示点不改这些精确关系。`,
    `T’s exact root is ${mid}; its tenth neighbours are ${lo}/${hi} and its midpoint is ${mid},whose square equals ${tie}. Halfway-up gives ${hi}; use equality for the exact midpoint,not a false strict side claim. For C, ${near ? '0.99²=0.9801<0.999<1² and 0.995²=0.990025<0.999' : '1.99²=3.9601<3.999<2² and 1.995²=3.980025<3.999'} give √C≈${near ? '1.00' : '2.00'},not exact equality to that integer. Z has exact √${near ? 4 : 9}=${near ? 2 : 3} and √0=0,with two-place forms ${near ? '2.00' : '3.00'}/0.00 and no false strict bracket. X has exact root ${near ? '99/1000=0.099' : '199/1000=0.199'},between ${near ? '0.09/0.10' : '0.19/0.20'}. Midpoint ${near ? '0.095²=0.009025<0.009801' : '0.195²=0.038025<0.039601'} selects ${near ? '0.10' : '0.20'}. Truncation to ${near ? '0.09' : '0.19'} has error 9/1000=0.009>0.005; nearest rounding has error 1/1000=0.001≤0.005. An adjacent hundredth lower bound has error <0.01; nearest rounding has error ≤0.005,reached at a midpoint. They are different guarantees. Own examples may use roots ${near ? '1.24,1.26' : '1.74,1.76'},radicands ${near ? '961/625,3969/2500' : '7569/2500,1936/625'}. Both lie within ${lo}/${hi} but on opposite sides of ${mid},rounding to ${lo}/${hi} with actual errors 0.04≤0.05. Verify the learner’s own rational choices by squares and nonnegative roots; these are not unique designs. For negative numbers,−3<−2 but 9>4 refutes unrestricted square order. Windows and displayed dots change none of these exact relations.`,
  );
  table(q3, [
    [
      'T',
      '独立精确半格，保留一位',
      'Exact halfway case,one decimal place',
      `√(${tie})；相邻十分位${lo}/${hi}`,
      `√(${tie}); adjacent tenths ${lo}/${hi}`,
    ],
    [
      'C',
      '独立跨整数，保留两位',
      'Separate integer carry,two decimal places',
      `√(${cross})`,
      `√(${cross})`,
    ],
    [
      'Z',
      '独立完全平方与零',
      'Separate perfect square and zero',
      `√${near ? 4 : 9}; √0；均保留两位`,
      `√${near ? 4 : 9}; √0; two decimal places each`,
    ],
    [
      'X',
      '独立误差审查，保留两位',
      'Separate error audit,two decimal places',
      `√(${error})`,
      `√(${error})`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-RADICAL-MEANING`,
    unit,
    bridge: 'J91-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 3, 5].map((l, i) => [id(i + 1), `J91-L0${l}`]),
    ),
    title: t(
      '分数根、完成形式与舍入误差',
      'Fractional roots,finished forms and rounding error',
    ),
    intro: t(
      '三张纸笔卡，每次一个编号/独立案例，可分次不计时、口述或熟悉语言。先自行计算/构造再逐项人审；读题帮助与数学提示分开。保留原十题与原记录；全部虚构，无需测量、购买或上传。',
      'Three paper cards,one numbered part/independent case per untimed sitting. Oral/familiar-language work is welcome. Calculate/design before human review; separate reading help from mathematical hints. The original ten tasks and records remain. Fictional work requires no measurements,purchases or uploads.',
    ),
    questions: [q1, q2, q3],
  };
};
export const radicalMeaningRetrieval = {
  H03_RADICAL_MEANING: makeSet('H03'),
  H04_RADICAL_MEANING: makeSet('H04'),
};
