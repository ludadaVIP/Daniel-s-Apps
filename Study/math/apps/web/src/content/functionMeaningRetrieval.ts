import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H01' | 'H02') => {
  const near = unit === 'H01',
    id = (n: number) => `${unit}-MAINT-FUNCTION-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(
        '先保原条件与量的单位，区分改输入、改参数、改显示和真换单位。各用自己的完整一般式、表、图与原条件核验。',
        'Retain original conditions and quantity units. Separate changed input, parameters, display and measurement units. Generate your own full rules, tables, plots and original-condition checks.',
      ),
      t(
        '一次一个编号/独立案例，可分次、不计时；允许口述或熟悉语言。阅读帮助与数学提示分开，全部分问生成后再逐项人审。',
        'One numbered part/separate case per untimed sitting. Oral or familiar-language work is welcome. Separate reading assistance from mathematical hints; generate and review each required part explicitly.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件：编号案例独立。代数关系取实数；虚构情境另给数量、单位与允许域。作者示例不是唯一方案或真实观察。',
        'Original conditions: labelled cases are independent. Algebraic rules use real inputs; fictional contexts separately specify quantities, units and domains. Author examples are neither unique designs nor real observations.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const m = near ? '−1/2' : '−2/3',
    b = near ? 6 : -6,
    original = near ? '−x/2+6' : '−2x/3−6',
    shifted = near ? '−x/2+8' : '−2x/3−4',
    tilted = near ? 'x/2+6' : 'x/3−6';
  const q1 = card(
    1,
    'changed-parameters-and-intercepts',
    '① 从F参数写完整y=mx+b，再算x=0、3、6的输出、写三个有序数对并描点。哪个量固定、哪个量随输入变？一次输出能替代一般式么？x=6在小窗外便不允许了吗？② 每次独立从原F出发：G只把b加2，H只把m加1，K只把m改0。分别写完整新规则、各算x=0和3。用对任意实数x的差G(x)−F(x)、H(x)−F(x)证明哪一个竖直平移、哪一个在零输入保持同一点但改变率，不能只凭两次试算证明全体。K仍是函数吗，按本课m≠0约定怎样分类？③ 对原F分别写截距数值b、y轴交点与x轴交点，计算时哪一坐标置0？亲画原F、G、H、K并标各轴单位刻度；小窗与宽窗分别能看见原F哪个轴交点，改窗会改参数或点吗？本题为给定代数规则，别把图或作者计算当实际观测初值。',
    '① Use F’s parameters to write the FULL y=mx+b rule. Evaluate x=0,3,6, give three ordered pairs and plot them. Which quantities stay fixed and which change with input? Can one output replace the rule? Is x=6 disallowed because it is off the small window? ② Restart SEPARATELY from F: G increases only b by two, H increases only m by one, and K replaces only m with zero. Write each whole rule and evaluate at x=0 and three. For arbitrary real x calculate G(x)−F(x) and H(x)−F(x): prove which is a vertical translation and which retains the zero-input point but changes the rate. Two trial inputs alone do not establish a general claim. Is K still a function, and how is it classified under m≠0? ③ For ORIGINAL F distinguish the NUMBER b, y-axis point and x-axis point. Which coordinate is set to zero for each? Draw F,G,H,K with labelled axis scales. Which original F intercepts are visible in the small and wide windows? Does widening alter any parameter or point? These are supplied algebraic rules, not observed starting values.',
    `F(x)=${original}，m=${m}、b=${b}固定；x=0、3、6给${near ? '6、9/2、3' : '−6、−8、−10'}，点按先x后y；一次输出非整条式，所有实数包括6均在代数域。G(x)=${shifted}，H(x)=${tilted}，K(x)=${b}。在0时G=${b + 2}、H=K=${b}；在3时G=${near ? '13/2' : '−6'}、H=${near ? '15/2' : '−5'}、K=${b}。一般G−F=2对所有x，故同输入竖直增2、率不变；H−F=x，零输入差0但斜率增1，非固定平移；K零斜率水平常函数，仍单值函数，非本课一次/正比例。原F数值b=${b}，y交点(0,${b})，x交点${near ? '(12,0)' : '(−9,0)'}由y=0求；不能交换坐标或把b当点。原两轴交点均在[−5,5]²外、在[−16,16]²内，窗变只变显示，所有参数/坐标保持。G/H/K各按自己的原式画，区分一般代数关系与真实起点的变量定义/域和观察证据。`,
    `F(x)=${original}, with fixed m=${m},b=${b}. Inputs zero,three,six give ${near ? 'six,9/2,three' : '−6,−8,−10'}; retain x-then-y pairs. A single output is not the rule, and all real inputs including six remain allowed. G(x)=${shifted}, H(x)=${tilted}, K(x)=${b}. At zero:G=${b + 2},H=K=${b};at three:G=${near ? '13/2' : '−6'},H=${near ? '15/2' : '−5'},K=${b}. Generally G−F=2 for EVERY x, so this is a vertical translation with unchanged rate. H−F=x, zero at input zero but not constant:the slope rises by one, not a fixed translation. K is a horizontal constant, still a single-valued function but neither first-degree nor direct under this convention. Original b is the NUMBER ${b}; the y-axis point is (0,${b}), and setting y=0 gives x-axis point ${near ? '(12,0)' : '(−9,0)'}. Do not exchange coordinates or submit b as a point. Both original intercepts are outside [−5,5]² and inside [−16,16]². A window changes display only, retaining every parameter and coordinate. Draw G/H/K under their own rules; real starting-value claims additionally need quantity definitions, domains and observations.`,
  );
  table(q1, [
    [
      'F',
      '原代数参数',
      'Original algebraic parameters',
      `m=${m}; b=${b}；x取全体实数`,
      `m=${m}; b=${b}; x ranges over all reals`,
    ],
    [
      'G/H/K',
      '分别从F独立改变',
      'Independent changes from F',
      'G: b→b+2；H: m→m+1；K: m→0；其他参数保留',
      'G: b→b+2; H: m→m+1; K: m→0; other parameters retained',
    ],
    ['W', '独立显示窗口', 'Separate display windows', '[−5,5]² → [−16,16]²'],
  ]);
  const prices = near ? '{1/3,2/3}' : '{2/3,4/3}',
    fees = near ? '{1,2}' : '{2,3}',
    counts = near ? '{2,3}' : '{3,4}';
  const q2 = card(
    2,
    'unit-conversion-and-own-affine-models',
    '① 从C允许范围亲选p、f、T，编完整虚构已启动连续服务情境，定义t分钟/C费用NZD、参数单位和域。写原一般式，列t=0、T/2、T三行，并标两轴实际每格数值画线段。先只用两个非零时刻T/2与T回求斜率、截距，再以零时刻独立核第三行；在图上画有向变化三角形，写两条实际单位变化及每分钟率，不能只数格数或报总变化。② 同一服务真换输入单位：s为小时、t=60s，推完整费用规则和新输入域。再把输出改为d NZ cents（d=100C），推d关于s的规则，解释斜率与固定项各为何改变。核同一中点事件在三种单位下的数对/费用一致；若只换轴的显示每格值而单位不变，原p和坐标会改吗？给“换小时却保旧p”在中点的实际错值作对照，不只说不能。③ 另亲选K允许q、c、N，编已有c张、每整包q张、最多N包的卡片总张数情境。定义n与A及域，写完整一般式，列n=0、1、N三行，从两非零输入回求q/c并核零行；画所有允许点且不连线，给半包与N+1两种不同无效输入及代数输出。即使半包输出恰整数，能因此允许吗？两模型各给自己的图、原参数单位和完整域，不冒充实测；一次一案例，接受任何合条件独立方案。',
    '① CHOOSE allowed p,f,T in C and DESIGN a complete fictional activated continuous service. Define t minutes,C cost NZD, parameter units and domain. Write the original rule and rows t=0,T/2,T; draw the segment using labelled actual tick values. Recover slope/intercept using ONLY the two NONZERO inputs T/2,T, then independently check the zero row. Draw an oriented change triangle with both actual changes and the per-minute rate, rather than only cell counts or total output change. ② For the SAME service change input measurement to s hours with t=60s: derive the FULL cost rule and transformed domain. Then use d NZ cents with d=100C and derive d as a function of s. Explain changes to slope and fixed term. Check the SAME midpoint event in all three unit systems. If only displayed tick spacing changes while units stay fixed, do p or coordinates change? Actually calculate the wrong midpoint value from retaining old p after relabelling minutes as hours. ③ Independently CHOOSE permitted q,c,N in K and DESIGN a card-count model: c existing cards,q per whole pack,at most N packs. Define n,A and domains, write the full rule and rows n=0,1,N. Recover q,c from the two nonzero inputs and verify zero. Plot ALL allowed points without joining them. Give half a pack and N+1 as two different invalid inputs with algebraic outputs. Is a coincidentally integer half-pack output enough to allow it? Give separate unit-labelled plots and full domains; fictional premises are not measurements. One case per sitting; accept ANY permitted independent design.',
    `任何合条件自选均可。连续C(t)=pt+f，p单位NZD/min、f为NZD，0≤t≤T；三行C为f、f+pT/2、f+pT。由后两点Δt=T/2、ΔC=pT/2，商p，再f=C(T/2)−pT/2，核C(0)=f；三角形边长按单位，不是无单位格数。小时s有C(s)=60ps+f，0≤s≤T/60；改NZ cents为d(s)=6000ps+100f，单位率NZ cents/h，固定项只随输出换单位乘100，不再乘输入。中点s=T/120，三种费用对应f+pT/2 NZD和100f+50pT NZ cents；错误保p得f+pT/120，与原差59pT/120非0。只改显示不改原单位数值。卡片A(n)=qn+c，q单位cards/pack、c为cards，n∈{0,…,N}，三行c、q+c、qN+c；由n=1与n=N的变化比q(N−1)/(N−1)=q，再c=A(1)−q，核零；所有N+1点不连。n=1/2代数q/2+c但输入非整包，无论输出整数与否都拒；n=N+1代数q(N+1)+c超过最大包域，理由不同。连续例${near ? 'p=1/3、f=1、T=6：三行分别1、2、3 NZD；小时C=20s+1，域[0,1/10]，分币d=2000s+100，中点s=1/20给2NZD/200分；旧p错给61/60NZD' : 'p=2/3、f=2、T=3：三行分别2、3、4 NZD；小时C=40s+2，域[0,1/20]，分币d=4000s+200，中点s=1/40给3NZD/300分；旧p错给121/60NZD'}。卡片例${near ? 'q=2,c=1,N=3：点(0,1),(1,3),(2,5),(3,7)，半包输出2仍非法' : 'q=4,c=2,N=3：点(0,2),(1,6),(2,10),(3,14)，半包输出4仍非法'}；其他允许方案同样接受。`,
    `Accept ANY permitted independent design. C(t)=pt+f has p in NZD/min,f in NZD and 0≤t≤T. Its rows are f,f+pT/2,f+pT. The latter two give Δt=T/2,ΔC=pT/2, hence slope p and intercept f=C(T/2)−pT/2; check C(0)=f. Use unit changes on the triangle rather than unlabelled cells. With s hours,C(s)=60ps+f on [0,T/60]. In NZ cents,d(s)=6000ps+100f; slope units are NZ cents/h. The fixed term changes only with output conversion, not input scaling. At s=T/120 the same midpoint costs f+pT/2 NZD or 100f+50pT NZ cents. Keeping old p gives wrong f+pT/120, differing by nonzero 59pT/120. Display-only scaling changes neither units nor numerical coordinates. Cards have A(n)=qn+c, q cards/pack,c cards,n∈{0,…,N}; rows c,q+c,qN+c. The nonzero rows give q(N−1)/(N−1)=q, then c=A(1)−q; check zero and plot all N+1 points without connecting. Half a pack evaluates to q/2+c but violates integrality regardless of its output; N+1 evaluates to q(N+1)+c but violates the upper domain, a different reason. A continuous example is ${near ? 'p=1/3,f=1,T=6:rows one,two,three NZD;C(s)=20s+1 on[0,1/10],d(s)=2000s+100. Midpoint s=1/20 costs two NZD or 200 cents;old p wrongly gives 61/60 NZD' : 'p=2/3,f=2,T=3:rows two,three,four NZD;C(s)=40s+2 on[0,1/20],d(s)=4000s+200. Midpoint s=1/40 costs three NZD or 300 cents;old p wrongly gives 121/60 NZD'}. A card example is ${near ? 'q=2,c=1,N=3:points(0,1),(1,3),(2,5),(3,7);half a pack gives integer two but remains invalid' : 'q=4,c=2,N=3:points(0,2),(1,6),(2,10),(3,14);half a pack gives integer four but remains invalid'}. Other permitted designs count equally.`,
  );
  table(q2, [
    [
      'C',
      '自主连续服务参数',
      'Independent continuous-service parameters',
      `p∈${prices} NZD/min; f∈${fees} NZD; T∈{3,6} min；服务已启动，0≤t≤T连续`,
      `p∈${prices} NZD/min; f∈${fees} NZD; T∈{3,6} min; activated service,continuous 0≤t≤T`,
    ],
    [
      'U',
      '独立真单位转换',
      'Separate measurement-unit conversion',
      't=60s；s为小时；d=100C，d为NZ cents',
      't=60s; s is hours; d=100C, d is NZ cents',
    ],
    [
      'D',
      '原单位图的每格值',
      'Tick values on the original-unit plot',
      near ? '横轴2min/格；纵轴1/2 NZD/格' : '横轴1/2min/格；纵轴2NZD/格',
      near
        ? 'Horizontal 2min/cell; vertical 1/2 NZD/cell'
        : 'Horizontal 1/2min/cell; vertical 2NZD/cell',
    ],
    [
      'K',
      '自主卡片数量参数',
      'Independent card-count parameters',
      `q∈${counts} cards/pack; c∈${fees} cards; N∈{3,4}；n为0…N整数，A为总张数`,
      `q∈${counts} cards/pack; c∈${fees} cards; N∈{3,4}; n is an integer 0…N,A is total cards`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-FUNCTION-MEANING`,
    unit,
    title: t(
      '改参数、真换单位与自主线性模型',
      'Parameter changes, measurement units and independent linear models',
    ),
    intro: t(
      '两张纸笔卡，一次一个编号或独立案例，可分次、不计时。先生成完整式、表、图与理由，再人审；可口述/熟悉语言，阅读帮助与数学提示分开。全为虚构给定模型，无需购买、实测或个人资料。',
      'Two paper cards,one numbered part or separate case per untimed sitting. Generate full rules,tables,plots and reasons before human review. Oral/familiar-language work is welcome; separate reading assistance from mathematical hints. Models are fictional and require no purchases,measurements or personal data.',
    ),
    bridge: 'J85-L03',
    bridgeByQuestion: Object.fromEntries(
      [3, 6].map((l, i) => [id(i + 1), `J85-L0${l}`]),
    ),
    questions: [q1, q2],
  };
};
export const functionMeaningRetrieval = {
  H01_FUNCTION_MEANING: makeSet('H01'),
  H02_FUNCTION_MEANING: makeSet('H02'),
};
