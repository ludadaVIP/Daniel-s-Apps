import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H03' | 'H04') => {
  const near = unit === 'H03',
    id = (n: number) => `${unit}-MAINT-QUADRATIC-MEANING-Q${n}`;
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
        '先保原左右两边、实数域和情境限制。整理、因式乘积、完整根集、原式代回和范围筛选分别写；同加/同乘须可逆，不能除以可能为零的未知量。',
        'Retain both original sides, the real domain and contextual restrictions. Separate collection, factor product, complete root set, substitution and filtering. Use reversible operations and do not divide by a possibly zero unknown.',
      ),
      t(
        '每次一个编号或独立案例，可分次、不计时、口述或熟悉语言。先生成自己的推导/图，再逐项人审；读题帮助与数学提示分开，作者设计例子不唯一。',
        'One numbered part or independent case per untimed sitting; oral/familiar-language work is welcome. Generate your derivation/diagram before human review. Separate reading help from mathematical hints; author designs are not unique.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '原条件：编号案例独立，代数在实数域；只有题设明确的情境才另限范围。纸上虚构图不作实际测量，图例正长度不偷加到原方程。',
        'Original conditions: labelled cases are independent and algebra uses real inputs. Impose contextual restrictions only where stated. Fictional paper diagrams are not measurements; positive illustrative lengths do not restrict the original equation.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const linear = near ? 'x²+2x=x²+6' : 'x²−3x=x²+6',
    higher = near ? 'x³+x²=0' : 'x³−2x²=0',
    nonzero = near ? 'x(x−2)=3' : 'x(x+2)=3',
    nonmonic = near ? '6x²+x−2=0' : '6x²−x−2=0',
    repeated = near ? '5(x−2)²=0' : '−7(x+3)²=0',
    irr = near ? 2 : 3;
  const q1 = card(
    1,
    'collected-degree-nonzero-product-and-factor-scope',
    '① L/H各先写原左减原右、合并后最高非零次数/系数及类型；L再求完整解并列原左右值，H只判是否可用二次公式，不要求高次通法。看到x²或a=0就能说二次/无解吗？原旧卡的恒等与矛盾继续用。② A先算直接把原乘积两因子置零所得候选在原左右是否相等；再整体移项、写完成因式乘积、完整根集、每根代回和穷尽理由。乘积不为0为什么不能先套零积？分解题与根集题交的形式相同吗？③ B完整分解并逐因子求根，常数和一次项都展开回查，不能照抄因子数字作根；算原系数的Δ和不同实根数，Δ为平方就保证整数根吗？C给重复因子，亲算根值/个数，常数因子给新分支吗？两个相同因子在根处同时为0与“所有题都必须两因子同时0”是否一回事？④ D穷尽整数乘积对及和，说明无整数一次因式的范围结论；再给完整实根，不能把暂时分不出或整数范围不可分当无实根。',
    '① For L/H, collect ORIGINAL left minus right and identify the highest surviving degree/coefficient and type. Solve L completely and give its original side values. For H only decide applicability of the quadratic formula; no general higher-degree method is requested. Does seeing x² or a=0 imply quadratic/no solution? Keep the old identity/contradiction cases. ② For A, first audit candidates obtained by setting its ORIGINAL product factors to zero, giving original side values. Then move the whole equation, factor completely, list ALL roots, substitute each and justify completeness. Why is a nonzero product different? Are a factor product and a root-set answer interchangeable? ③ Factor B completely and solve each linear branch, expanding every coefficient back rather than copying factor constants as roots. Calculate Δ from the original coefficients and count distinct real roots: does a square Δ guarantee integral roots? For repeated-factor C find the value/count. Does a nonzero constant supply a branch? Distinguish two equal factors vanishing together from requiring BOTH factors to vanish in every zero-product problem. ④ Exhaust integer product pairs/sums for D, stating the integer-linear-factor scope. Then give all REAL roots: failure to find integer factors is not proof of no real roots.',
    `L差${near ? '2x−6' : '−3x−6'}，一次、最高系数${near ? 2 : -3}，解${near ? 3 : -2}，原左右均${near ? 15 : 10}。H差仍${near ? 'x³+x²' : 'x³−2x²'}，最高三次系数1，非二次，不能只抽熟悉三项套公式；a0还可一次/恒等/矛盾。A错候选${near ? '0、2' : '0、−2'}均给原左0≠右3。移项${near ? 'x²−2x−3=(x−3)(x+1)' : 'x²+2x−3=(x−1)(x+3)'}=0，完整${near ? '{−1,3}' : '{−3,1}'}，代原式两边各3。因式乘积不是根列表，零积至少一因子0、若首因子非0可除得到另一因子0，故分支穷尽。B=${near ? '(3x+2)(2x−1)' : '(3x−2)(2x+1)'}=0，展开中项${near ? '−3x+4x=x' : '3x−4x=−x'}，完整根${near ? '{−2/3,1/2}' : '{−1/2,2/3}'}，逐根代回原左右0。Δ=1+48=49>0有两不同根，但两根均非整数；本题为整数系数且Δ为平方，根有理但还须核分母2a能否整除。C非零常数${near ? 5 : -7}不为0，重复因子仅${near ? 2 : -3}一个值，在该值两个相同因子同时0，或允许同时但不强制所有例都同时。D整数积−${irr}对只有${near ? '(1,−2)、(−1,2)，和−1、1' : '(1,−3)、(−1,3)，和−2、2'}，无和0配对，故无两个整数一次因式；实数仍有±√${irr}，两符号平方均${irr}且非负/负半轴各一，或实数因子(x−√${irr})(x+√${irr})穷尽。`,
    `L has difference ${near ? '2x−6' : '−3x−6'},linear leading coefficient ${near ? 2 : -3},root ${near ? 3 : -2} and equal original sides ${near ? 15 : 10}. H retains degree three with coefficient one in ${near ? 'x³+x²' : 'x³−2x²'},so the quadratic formula does not apply. At a=0,linear/identity/contradiction cases remain possible. A’s tempting ${near ? 'zero/two' : 'zero/−two'} each gives original left zero versus right three. Moving gives ${near ? 'x²−2x−3=(x−3)(x+1)' : 'x²+2x−3=(x−1)(x+3)'}=0,complete roots ${near ? '{−1,3}' : '{−3,1}'},each with original sides three. A product is not a root list. A real zero product has at least one zero factor: if the first is nonzero,divide to prove the second zero. B factors as ${near ? '(3x+2)(2x−1)' : '(3x−2)(2x+1)'},with middle term ${near ? '−3x+4x=x' : '3x−4x=−x'}. Roots ${near ? '{−2/3,1/2}' : '{−1/2,2/3}'} all substitute to original sides zero. Δ=1+48=49>0 gives two distinct roots,but neither is integral; inspect denominator 2a. C’s nonzero constant ${near ? 5 : -7} supplies no zero branch. Its repeated factor gives only ${near ? 2 : -3}; both identical factors vanish there. OR permits both without requiring both in every example. For D,the only unordered integer product pairs for −${irr} are ${near ? '(1,−2),(−1,2),with sums −1/one' : '(1,−3),(−1,3),with sums −2/two'}. None has sum zero,so no two INTEGER linear factors exist. Over the reals there are still ±√${irr},verified by squares and exhaustive factors (x−√${irr})(x+√${irr}).`,
  );
  table(q1, [
    [
      'L',
      '独立抵消二次项',
      'Separate cancelled quadratic terms',
      linear,
      linear,
    ],
    ['H', '独立判最高次数', 'Separate highest-degree audit', higher, higher],
    [
      'A',
      '独立非零原乘积',
      'Separate nonzero original product',
      nonzero,
      nonzero,
    ],
    ['B', '独立非首一方程', 'Separate nonmonic equation', nonmonic, nonmonic],
    ['C', '独立重复因子', 'Separate repeated factor', repeated, repeated],
    [
      'D',
      '独立整数因式范围',
      'Separate integer-factor scope',
      `x²−${irr}=0`,
      `x²−${irr}=0`,
    ],
  ]);
  const g = near ? '2x²+3x=1' : '3x²−2x=2',
    f = near ? '−4x²−6x=−2' : '−6x²+4x=−4',
    z = near ? 'x²+x=−1/4' : 'x²+3x=−9/4',
    m = near ? 'x²−x=−1' : 'x²+2x=−2',
    p = near ? '3/4' : '−1/3',
    added = near ? '9/16' : '1/9',
    completed = near ? '17/16' : '7/9',
    roots = near ? '(−3±√17)/4' : '(1±√7)/3',
    bad = near ? '−3±√17/4' : '1±√7/3';
  const q2 = card(
    2,
    'fractional-completing-and-grouped-formula',
    '① G先除明确非零二次系数，写每一步同做操作、带符号半系数p、p²、完成平方右值、完整精确根及原式代回；再独立用公式求同一完整集，核负b与整个分子/分母。W是待审错误根集，指出中心或括号哪里变了，并选其中一个值精确代回证错，不能仅凭外观。② F从原G两边同乘哪个常数得到，为什么根集仍同？写F原a/b/c/Δ与两个公式分支，与G逐根配对；负分母是改根集还是交换分支？旧一般公式证明继续用，不把|a|写a。③ Z/M各从原式独立配方，写p/p²/平方目标和全部不同实根；目标为0/负时还能机械写两不同±分支吗？④ 只取正数图例x=2，为Z的恒等结构亲画一个x²方块、两不重叠px长条和p×p角，标长度/面积与统一比例，核补角面积。图是恒等结构示意，不是把负的原右值画正面积或给Z添加x>0；原解在图域外仍须代回。遇G或M负半系数时解释为何不画负宽正面积块。换图例或撤一步会改变原方程和根集吗？一次一案例。',
    '① For G,divide by its explicitly nonzero quadratic coefficient. Write EVERY equal action,the signed half-coefficient p,p²,completed square target,ALL exact roots and original substitutions. Independently use the formula for the same set,checking negative b and grouping of the WHOLE numerator/denominator. W is a proposed incorrect set: diagnose its changed centre/grouping and substitute one candidate EXACTLY to refute it. ② Which nonzero multiplier on BOTH G sides gives F,and why is the set unchanged? Give F’s original a,b,c,Δ and both formula branches,matching them to G. Does a negative denominator change the set or exchange branches? Retain the existing general proof; do not claim |a|=a. ③ Restart independently for Z/M: give p,p²,square target and every distinct real root. Must a zero/negative target give two different ± branches? ④ Using ONLY illustrative x=2,draw Z’s identity as one x² square,two nonoverlapping px strips and a p×p corner. Label lengths/areas on one scale and check corner area. This is an identity illustration,not a positive-area rendering of a negative original right side or a new x>0 restriction. Substitute roots outside the picture’s domain. Explain why a negative half-coefficient in G or M is not a negative-width positive-area tile. Do changing illustration size or undoing a step change the original equation/roots? One case at a time.',
    `G归一${near ? 'x²+(3/2)x=1/2' : 'x²−(2/3)x=2/3'}，p=${p}，p²=${added}，同加得(x+(${p}))²=${completed}，根${roots}。原零式系数${near ? 'a2,b3,c−1，Δ17' : 'a3,b−2,c−2，Δ28'}，公式整个分子除${near ? 4 : 6}，化简给同集。W的中心${near ? '−3而非−3/4' : '1而非1/3'}，不同集；选W正号支${near ? '−3+√17/4' : '1+√7/3'}代回原左右不等，精确余差${near ? '81/8−9√17/4' : '4/3+4√7/3'}≠0，不能只改分子一部分。F=−2G两边，非零可逆，系数${near ? '−4,−6,2，Δ68' : '−6,4,4，Δ112'}；公式${near ? '(6±2√17)/(−8)' : '(−4±4√7)/(−12)'}，正/负支与G反向配对，完整集仍${roots}。Z半系数${near ? '1/2' : '3/2'}、同加${near ? '1/4' : '9/4'}后平方目标0，唯一${near ? '−1/2' : '−3/2'}；原左右同${near ? '−1/4' : '−9/4'}。M p=${near ? '−1/2' : '1'}、p²=${near ? '1/4' : '1'}，目标${near ? '−3/4' : '−1'}，无实根不等零根。Z图例x2、p=${near ? '1/2' : '3/2'}：x²块面积4，两条px各${near ? 1 : 3}，角${near ? '1/4' : '9/4'}，外边${near ? '5/2' : '7/2'}、面积${near ? '25/4' : '49/4'}，无重叠/缺口。此图核恒等式，不声称正x满足原Z，也不删除唯一负解；负p改用带符号代数。显示/撤依据不改原式；若撤同加步骤，就不能无依据保后续平方行，重走须两边同做。`,
    `Normalising G gives ${near ? 'x²+(3/2)x=1/2' : 'x²−(2/3)x=2/3'},p=${p},p²=${added},and (x+(${p}))²=${completed},hence ${roots}. Original zero-form coefficients are ${near ? 'a2,b3,c−1,Δ17' : 'a3,b−2,c−2,Δ28'}. Divide the WHOLE formula numerator by ${near ? 4 : 6},then simplify to the same set. W changes the centre from ${near ? '−3/4 to −3' : '1/3 to one'}. Its plus candidate ${near ? '−3+√17/4' : '1+√7/3'} has exact original left-minus-right ${near ? '81/8−9√17/4' : '4/3+4√7/3'}≠0. F multiplies BOTH G sides by −2,a reversible operation. Its coefficients ${near ? '−4,−6,2 give Δ68' : '−6,4,4 give Δ112'},and formula ${near ? '(6±2√17)/(−8)' : '(−4±4√7)/(−12)'} exchanges branch matches without changing set ${roots}. Z has p=${near ? '1/2' : '3/2'},added square ${near ? '1/4' : '9/4'},target zero and sole root ${near ? '−1/2' : '−3/2'},with original sides ${near ? '−1/4' : '−9/4'}. M has p=${near ? '−1/2' : 'one'},p²=${near ? '1/4' : 'one'},target ${near ? '−3/4' : '−1'},and no real roots rather than a zero root. For Z’s separate identity picture,x=2,p=${near ? '1/2' : '3/2'} gives square area four,two strip areas ${near ? 'one' : 'three'} each,and corner ${near ? '1/4' : '9/4'}. Outer side ${near ? '5/2' : '7/2'} squares to area ${near ? '25/4' : '49/4'},without overlap/gaps. The picture verifies an identity; it neither makes positive x solve original Z nor deletes its sole negative root. Use signed algebra for negative p. Display/undo actions do not change the original equation; once an adding premise is withdrawn,the later square line cannot stand without rebuilding the equal actions.`,
  );
  table(q2, [
    ['G', '独立非首一配方与公式', 'Separate nonmonic completing/formula', g, g],
    ['W', 'G的待审根集', 'Candidate root set for G', bad, bad],
    ['F', '独立负倍原式', 'Separate negative multiple', f, f],
    ['Z', '独立零平方目标', 'Separate zero square target', z, z],
    ['M', '独立实数分支审查', 'Separate real-branch audit', m, m],
    [
      'P',
      '仅为Z恒等式选正图例',
      'Positive illustration of Z’s identity only',
      'x=2，图例不加到原Z的定义域',
      'x=2; this illustration does not restrict original Z',
    ],
  ]);
  const gap = near ? 2 : 1,
    area = near ? 15 : 12,
    time = near ? 'x²−3x=0' : 'x²−4x=0',
    end = near ? 'x²−3x+2=0' : 'x²−(5/2)x+1=0';
  const q3 = card(
    3,
    'original-model-domains-and-own-design',
    '① R先定义宽x和单位/允许域，画标明宽长的矩形，用宽×长与已知面积两种原数量列等式；再用两种方法求全部代数根、算Δ/不同实根数，并分别给每根原左右值和范围判断。不能把正确根或零式当原数量模型，也不能说负根失败于代回。② T/U为两个独立虚构信号；x是开始后时间的数值/min。分别列原方程全部根、Δ和不同实根数，再按给定闭区间筛选。画均匀带标尺的零点图并标原区间/端点，解释0或2被包含就自动是根吗？T里0能保留而R的非正边不行，为什么不能见非正就一概删除？显示窗能替代原时间范围吗？③ 自创纸上虚构矩形标牌，选长比宽多d∈{1,2,3}cm及正面积，写原模型/正长域，自己用两种方法求完整根集、逐根双核/单位，不只抄作者例子。再自创c≥2个相同整卡x×x阵、正整数总N，使有实根却无非负整数x；画来源、写原卡数等式，以整除或相邻整数平方证明无可行值，不用舍入补救。说明两种自创资料都非实测。',
    '① Define R’s width x,units and domain,draw labelled width/length,and equate original width×length to the given area. Use TWO methods for ALL algebraic roots,calculate Δ/distinct real count,and give EACH original side value and domain verdict. A correct final root or zero form does not replace the original quantity model; do not claim the negative root fails substitution. ② T/U are SEPARATE fictional signals; x is the numerical time in minutes after starting. For each,give all original equation roots,Δ and distinct count before filtering by the CLOSED interval. Plot a uniform labelled zero graph with the original interval/endpoints. Do included zero/two automatically become roots? Why can T retain zero while R rejects nonpositive sides? Is a display window the original time domain? ③ DESIGN a fictional paper sign: choose a positive area and length d∈{1,2,3}cm greater than width. Write your original model/positive-length domain,solve by TWO methods,and audit all roots/units. Do not just copy the author example. Independently design c≥2 identical x×x whole-card arrays with positive integer total N,so real roots exist but no nonnegative integer x does. Draw quantity sources,write the original count equation,and prove infeasibility by divisibility or neighbouring integer squares rather than rounding. Both designs are fictional,not measurements.',
    `R模型x(x+${gap})=${area}cm²且x>0，零式${near ? 'x²+2x−15=(x−3)(x+5)' : 'x²+x−12=(x−3)(x+4)'}=0，完整${near ? '{3,−5}' : '{3,−4}'}。配方${near ? '(x+1)²=16' : '(x+1/2)²=49/4'}或公式Δ=${near ? 64 : 49}>0核两不同根；两根代原式左右均${area}，只正根3作宽，长${3 + gap}cm；负根违反正长而非等式。T根0与${near ? 3 : 4}、Δ=${near ? 9 : 16}>0，原闭区间[0,2]仅接受0min；2代原左${near ? -2 : -4}≠0。U根${near ? '1、2' : '1/2、2'}、Δ=${near ? '1' : '9/4'}>0，两根均在[0,2]，0代原左${near ? 2 : 1}≠0，2是已代回合格的右端根。T的0是合法时刻，R正宽域不收0；先按各题原域，不凭符号删，也不凭图窗/端点包含造根。自创矩形可任选正有理宽w、d∈{1,2,3}，取面积w(w+d)；原x(x+d)=w(w+d)、x>0，因式(x−w)(x+w+d)=0，配方(x+d/2)²=(w+d/2)²，两根w与−w−d都代回面积，只w正。示例${near ? 'w=2,d=1,面积6，根{2,−3}、尺寸2×3' : 'w=1,d=3,面积4，根{1,−4}、尺寸1×4'}；其他合条件设计同样接受。自创卡阵例如${near ? 'c2,N3，x²=3/2在1²与2²间' : 'c3,N6，x²=2在1²与2²间'}，有正负实根但无非负整数x，必须保原${near ? '2x²=3' : '3x²=6'}的每阵/总数来源；舍入到1或2均不保原等式。需核孩子自己的数/图/两方法与证明，不把虚构方案记成已试用。`,
    `R has model x(x+${gap})=${area} in cm² with x>0. Its zero form factors ${near ? 'x²+2x−15=(x−3)(x+5)' : 'x²+x−12=(x−3)(x+4)'},giving ${near ? '{3,−5}' : '{3,−4}'}. Completing ${near ? '(x+1)²=16' : '(x+1/2)²=49/4'} or the formula with Δ=${near ? 64 : 49}>0 verifies two distinct roots. BOTH original side values equal ${area}; only positive width three gives length ${3 + gap}cm. The negative root fails positive lengths,not the equation. T has roots zero/${near ? 3 : 4},Δ=${near ? 9 : 16}>0; only zero minutes lies in [0,2]. Endpoint two gives original left ${near ? -2 : -4}≠0. U has roots ${near ? 'one/two' : '1/2,two'},Δ=${near ? 'one' : '9/4'}>0,both accepted. Zero gives original left ${near ? 2 : 1}≠0; two is a checked right-endpoint root. T permits time zero while R’s strict positive width does not. Use each original domain,not signs,display windows or endpoint membership alone. For ANY chosen rational width w>0 and d∈{1,2,3},area w(w+d) yields original model x(x+d)=w(w+d),x>0. Factor (x−w)(x+w+d)=0 and complete (x+d/2)²=(w+d/2)²; roots w and −w−d both restore the area,but only w is positive. Example ${near ? 'w=2,d=1,area six,roots {2,−3},dimensions2×3' : 'w=1,d=3,area four,roots {1,−4},dimensions1×4'}; accept every permitted original design. A card example is ${near ? 'c2,N3,with x²=3/2 strictly between 1² and 2²' : 'c3,N6,with x²=two strictly between 1² and 2²'}. Opposite real roots exist but no nonnegative integer x does. Preserve ${near ? '2x²=3' : '3x²=6'} as array count versus total; rounding to one/two breaks it. Review the learner’s own quantities,diagrams,two methods and proof,without recording a fictional design as an actual household trial.`,
  );
  table(q3, [
    [
      'R',
      '虚构矩形原资料',
      'Fictional rectangle source',
      `宽x cm，长x+${gap} cm，面积${area}cm²；正边长`,
      `Width x cm,length x+${gap} cm,area ${area}cm²; positive sides`,
    ],
    [
      'T',
      '独立起点信号',
      'Separate start-time signal',
      `${time}；0≤x≤2 min`,
      `${time}; 0≤x≤2 min`,
    ],
    [
      'U',
      '独立右端信号',
      'Separate right-endpoint signal',
      `${end}；0≤x≤2 min`,
      `${end}; 0≤x≤2 min`,
    ],
    [
      'D',
      '自主两模型条件',
      'Two independent own designs',
      '矩形d∈{1,2,3}cm、面积正；卡阵c≥2、N>0均整数，边卡数x非负整数',
      'Rectangle d∈{1,2,3}cm,positive area; arrays c≥2,N>0 integers,edge count x a nonnegative integer',
    ],
  ]);
  return {
    id: `${unit}-MAINT-QUADRATIC-MEANING`,
    unit,
    bridge: 'J92-L02',
    bridgeByQuestion: Object.fromEntries(
      [2, 3, 6].map((l, i) => [id(i + 1), `J92-L0${l}`]),
    ),
    title: t(
      '零积前提、分数配方与原域双核',
      'Zero-product premises,fractional completing and original domains',
    ),
    intro: t(
      '三张纸笔卡，每次一个编号/独立案例，可分次不计时，口述或熟悉语言均可。先生成推导/图再逐项人审，读题帮助与数学提示分开。原十题和前批根式卡保留，各自记录；无需购买、实测或上传。',
      'Three paper cards,one numbered part/independent case per untimed sitting. Oral/familiar-language reasoning is welcome. Generate derivations/diagrams before human review; separate reading help from mathematical hints. Original ten tasks and earlier radical cards keep their own records. No purchases,measurements or uploads are required.',
    ),
    questions: [q1, q2, q3],
  };
};
export const quadraticMeaningRetrieval = {
  H03_QUADRATIC_MEANING: makeSet('H03'),
  H04_QUADRATIC_MEANING: makeSet('H04'),
};
