import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H03' | 'H04') => {
  const near = unit === 'H03',
    id = (n: number) => `${unit}-MAINT-PARABOLA-MEANING-Q${n}`;
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
        '先保原函数、输入范围和单位。用完整展开、平方距离或穷尽允许整数证明；图窗、有限试点和相同根集不能代替恒等或最优依据。',
        'Retain the original function,domain and units. Prove with full expansion,square distances or exhaustive permitted integers. Windows,finite trials and equal zero sets do not replace identity or optimality.',
      ),
      t(
        '一次一个编号/独立案例，可分次不计时、口述或熟悉语言。先生成自己的数、图和理由再逐项人审；读题帮助与数学提示分开，自创例不要求抄作者。',
        'One numbered part/independent case per untimed sitting. Oral/familiar-language work is welcome. Generate your own numbers,diagrams and reasons before human review. Separate reading help from mathematical hints; original designs need not copy the author.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '独立虚构纸上条件；未另限时输入全实数。图标清函数身份、横纵标尺及单位；显示窗不替代定义域，作者示例不冒实测。',
        'Independent fictional paper conditions; inputs are all real unless restricted. Label function identities,both axis scales and units. A window does not replace a domain,and author examples are not measurements.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const f = near ? '(1/2)(x−1)²−2' : '−(3/2)(x+2)²+1',
    base = near ? '(x−1)²−2' : '−(x+2)²+1',
    opposite = near ? '−(1/2)(x−1)²−2' : '(3/2)(x+2)²+1';
  const q1 = card(
    1,
    'parabola-scale-and-collected-type',
    '① S的F/B/N在同一均匀横纵标尺上亲列离轴距离d=0,1,2时的输出，再画图；比较的是离顶点高度还是绝对y？算同d时F与B高度差的倍率，用平方解释开口。F/N关于哪条水平线反射？不能因平移仍说一定关于横轴。把截图横向拉长或换窗口会改系数吗？原十题第7题的任意d对称与非恒斜率证明继续用。② L/C各完整整理、判次数/开口或非二次，说明有无唯一抛物线顶点和唯一竖直对称轴；L取两不同输入作反例，C说明每条竖直线为何都可对称。0系数或相消不自动无函数，也不能硬报唯一顶点。③ 分别只改F的a、h、k说明什么改变；d/窗口只是观察设置。',
    '① For S,tabulate F/B/N at axis distances d=0,1,2 and DRAW them on common uniform scales. Compare displacement from the vertex,not absolute y. Calculate the F/B displacement ratio and explain opening from a square. Across WHICH horizontal line do F/N reflect? Translation need not preserve reflection across the x-axis. Does stretching a screenshot or changing the window alter coefficients? Keep original task seven’s general-d symmetry and nonconstant-rate proof. ② Collect L/C completely,classify actual degree/opening or nonquadratic status,and decide whether a unique parabola vertex or unique VERTICAL axis exists. Use two distinct L inputs to refute symmetry; explain why every vertical line works for C. Cancellation does not mean no function or licence a unique vertex. ③ Change only F’s a,h,k separately and explain what changes; d/window are observation settings.',
    near
      ? 'S的h=1,k=−2；F在d0/1/2输出−2,−3/2,0，B为−2,−1,2，N为−2,−5/2,−4。F−k=(1/2)d²，B−k=d²，d非零时倍率1/2（d0时不除0）；F向上，N向下，F+N=−4故关于y=−2反射，不是横轴。L整理2x+1，一次；例如x=0与x=2分别输出1与5，不关于x=1对称，且任何轴r的等距r±1输出差4，故无竖直轴/抛物线顶点。C整理常数3，所有r±d同值3，任意竖直线均可对称，无唯一轴或唯一抛物线顶点。改a改变离轴高度/开口（过0退化）；改h水平移位、改k竖移，均须重新预测；d/图窗不改原函数。'
      : 'S的h=−2,k=1；F在d0/1/2输出1,−1/2,−5，B为1,0,−3，N为1,5/2,7。F−k=−(3/2)d²，B−k=−d²，d非零时倍率3/2（d0不除0）；F向下、N向上，F+N=2所以关于y=1反射。L整理−3x+4，一次；x=−1与x=1分别输出7与1，任意r±1输出差−6，故无竖直轴或抛物线顶点。C整理常数−2，任意r±d均同值−2，每条竖直线都可对称，无唯一轴/抛物线顶点。改a改变离轴高度/开口、过0退化，改h横移、k竖移；d/图窗不改原函数。',
    near
      ? 'Here h=1,k=−2. At d=0,1,2,F outputs −2,−3/2,0;B outputs −2,−1,2;N outputs −2,−5/2,−4. Displacements are (1/2)d² versus d²,ratio1/2 for NONZERO d;do not divide at zero. F opens up,N down,and F+N=−4 proves reflection across y=−2. L collects to 2x+1,a line:at zero/two outputs one/five. Generally outputs at r±1 differ by four,so no vertical symmetry axis or parabola vertex exists. C is constant three;all r±d give three,so every vertical line is an axis and none is unique. Changing a alters displacement/opening and degenerates at zero;h shifts horizontally,k vertically. Re-predict for changed functions. Illustration d/window leave the function unchanged.'
      : 'Here h=−2,k=1. At d=0,1,2,F outputs1,−1/2,−5;B outputs1,0,−3;N outputs1,5/2,7. Displacements are −(3/2)d² versus −d²,ratio3/2 for NONZERO d. F opens down,N up,and F+N=2 proves reflection across y=1. L collects to −3x+4:outputs at −1/one are seven/one. Generally r±1 outputs differ by −6,so no vertical symmetry axis or parabola vertex exists. C is constant −2;every vertical line gives equal symmetric outputs,so there is no unique axis/vertex. Changing a alters displacement/opening and degenerates at zero;h/k shift horizontally/vertically. Illustration d/window leave the function unchanged.',
  );
  table(q1, [
    [
      'S',
      '三条待比较函数',
      'Three comparison functions',
      `F=${f}; B=${base}; N=${opposite}`,
      `F=${f}; B=${base}; N=${opposite}`,
    ],
    [
      'L',
      '独立抵消成一次',
      'Separate linear cancellation',
      near ? 'x²+2x−x²+1' : '2x²−3x−2x²+4',
      near ? 'x²+2x−x²+1' : '2x²−3x−2x²+4',
    ],
    [
      'C',
      '独立抵消成常数',
      'Separate constant cancellation',
      near ? 'x²−x²+3' : '2x²−2x²−2',
      near ? 'x²−x²+3' : '2x²−2x²−2',
    ],
  ]);
  const g = near ? '2x²+3x−2' : '−3x²+2x+1',
    wrong = near ? '2(x+3/4)²−2' : '−3(x−1/3)²+1',
    z = near ? '−2x²' : '3(x+1)²',
    d = near ? 'x²−2' : 'x²−3',
    m = near ? 'x²+1' : '−2x²−1';
  const q2 = card(
    2,
    'fractional-parabola-forms-and-factor-domains',
    '① G从一般式亲配方，写外系数倍乘补偿的每一步、精确顶点/竖轴、纵截距点及全实数最值；再分解为完整因式形式、列全部零点，展开核三个系数。顶点高为何不等c？一般推c=ah²+k，a≠0时何时才相等？② W待审式与G恒等吗？展开给一般差和一个输入反例。若题目要顶点式，原G是否函数不同还是等值未完成？若要一般式/因式形式，各应保留什么结构？交换因子或两个因子同时改号怎样核，不只按固定字符串。③ Z写一般/顶点/因式形式及不同零点数，零根因子x或重复因子能丢吗？④ 对D/M分别判断实一次因式存在，D亲写精确实因子并展开、说明整数搜索不代表实数范围；M用全实数符号或Δ证明。输入框语法受限是否等于数学上没有实因子？一次一独立案例。',
    '① Complete G yourself from standard form,showing compensation multiplied by the outside coefficient. Give its exact vertex,vertical axis,y-intercept POINT and unrestricted extremum. Factor completely,list all zeros,and expand every coefficient back. Why does vertex height differ from c? Derive c=ah²+k and,for a≠0,WHEN they coincide. ② Is proposed W identical to G? Expand to give a general difference and one-input counterexample. If vertex form is requested,is unchanged G a different function or equivalent but unfinished? What structures complete standard/factored requests? Audit reordered or doubly negated factors rather than fixed text. ③ Give Z in three forms and count DISTINCT zeros. Retain a zero factor x or repeated factors. ④ Decide existence of REAL linear factors for D/M separately. Write and expand D’s exact real factors,distinguishing integer search from real scope. Prove M using its sign for ALL real inputs or Δ. Does restricted field syntax imply mathematical absence of real factors? One independent case at a time.',
    near
      ? 'G=2[x²+(3/2)x]−2=2[(x+3/4)²−9/16]−2=2(x+3/4)²−25/8=(2x−1)(x+2)。顶点(−3/4,−25/8)、轴x=−3/4、截距(0,−2)，最小−25/8仅在−3/4，零点−2,1/2；三系数2,3,−2。外2使补偿9/8，不能只补9/16。W展开2x²+3x−7/8，W−G=9/8，x=0为−7/8非−2。一般c=ah²+k，a非零时c=k当且仅当h=0。原G等值却未完成顶点结构；一般式展开合并、顶点式单个移位平方、因式形式完整一次因子乘积。交换因子/同改两号仍展开同系数，一处改号变负函数。Z=−2x²=−2(x−0)²=−2·x·x，唯一零点0，两个重复因子不删一条。D=(x−√2)(x+√2)，零点±√2，展开x²−2；无整数一次因子不排实因子。M=x²+1≥1，Δ−4，无实零点/两实一次因子。受限有理输入不等于D无实因子。'
      : 'G=−3[x²−(2/3)x]+1=−3[(x−1/3)²−1/9]+1=−3(x−1/3)²+4/3=−(3x+1)(x−1)。顶点(1/3,4/3)、轴x=1/3、截距(0,1)，最大4/3仅在1/3，零点−1/3,1；三系数−3,2,1。外−3使补偿+1/3。W展开−3x²+2x+2/3，W−G=−1/3，x=0为2/3非1。一般c=ah²+k，a非零时c=k恰h=0。原G等值但未完成顶点结构；一般展开合并、顶点留一个移位平方、因式留完整一次因子乘积。换因子次序/两因子同改号不改函数，仅一因子反号会改。Z=3x²+6x+3=3(x−(−1))²=3(x+1)(x+1)，唯一零点−1，重复因子仍两条。D=(x−√3)(x+√3)，零点±√3，展开x²−3；无整数因式不等无实因式。M=−2x²−1≤−1，Δ−8，无实零点/两实一次因子。D的精确实因子超有理语法但数学存在。',
    near
      ? 'G=2[x²+(3/2)x]−2=2[(x+3/4)²−9/16]−2=2(x+3/4)²−25/8=(2x−1)(x+2). Vertex(−3/4,−25/8),axis x=−3/4,intercept(0,−2);minimum−25/8 only at−3/4,zeros−2,1/2. Expanded coefficients2,3,−2. Outside two makes compensation9/8. W expands to2x²+3x−7/8,so W−G=9/8;at zero−7/8 differs from−2. Generally c=ah²+k;with a≠0,c=k iff h=0. Unchanged G is equivalent but unfinished as vertex form. Standard form collects;vertex form retains one shifted square;factored form retains the complete linear-factor product. Factor order/double sign changes preserve coefficients;one sign changes the function. Z=−2x²=−2(x−0)²=−2·x·x has sole zero0,with BOTH repeated factors retained. D=(x−√2)(x+√2) expands to x²−2 and has zeros±√2 despite lacking integer linear factors. M=x²+1≥1,Δ=−4,has no real zeros/two real linear factors. A rational-only field does not deny D’s mathematical factors.'
      : 'G=−3[x²−(2/3)x]+1=−3[(x−1/3)²−1/9]+1=−3(x−1/3)²+4/3=−(3x+1)(x−1). Vertex(1/3,4/3),axis x=1/3,intercept(0,1);maximum4/3 only at1/3,zeros−1/3,1. Expanded coefficients−3,2,1. Outside−3 turns compensation into+1/3. W expands to−3x²+2x+2/3,so W−G=−1/3;at zero2/3 differs from1. Generally c=ah²+k;for a≠0,c=k iff h=0. Unchanged G is equivalent but unfinished as vertex form;collect standard form,retain a single shifted square or complete linear-factor product respectively. Factor reorder/double negation preserves the function;one negation does not. Z=3x²+6x+3=3(x−(−1))²=3(x+1)(x+1),sole zero−1 with BOTH repeated factors. D=(x−√3)(x+√3) expands to x²−3,zeros±√3 despite no integer linear factors. M=−2x²−1≤−1,Δ=−8,has no real zeros/two real linear factors. D’s exact real factors exist outside rational field syntax.',
  );
  table(q2, [
    ['G', '待改写函数', 'Function to rewrite', g, g],
    ['W', '待审错误补偿', 'Proposed compensation', wrong, wrong],
    ['Z', '独立重复零点', 'Separate repeated zero', z, z],
    ['D', '独立分解范围', 'Separate factor domain', d, d],
    ['M', '独立实因子存在性', 'Separate real-factor existence', m, m],
  ]);
  const h = near ? '(x−9)²−1' : '−2(x+8)²+3',
    levels = near ? '3,−1,−2' : '1,3,4';
  const q3 = card(
    3,
    'shifted-horizontal-targets-and-window-proof',
    '① 对H逐一使用表内三个独立水平目标q，亲解原f(x)=q，列全部不同横坐标、原交点有序点、另画差图f(x)−q的零点有序点，并逐根代回。分别解释两点/相切一位置/无交点，不机械数两个±或把无交点当x0。为何负a时目标在顶点上方反而无交？② 在小窗及宽窗分别判断哪些交点可见，原两轴标尺不能省。没看见能断无根吗，能把窗外点挪到边界吗？图窗和游标C为何不改原解？原十题第9题继续要求无理根/小数精确残差，不能拿像素代根。③ 为H的一处两根目标写逐x等价的差函数说明，清楚区分原高度q、未知输入和差图输出0；只给一个代回通过值能证完整吗？',
    '① For H,use EACH of the three independent levels q. Solve ORIGINAL f(x)=q,listing every distinct input,ordered original intersections and ordered zeros of the SEPARATE difference graph f(x)−q. Substitute each root. Explain two points,one tangent position,or none,without counting printed ± twice or replacing none by x=0. For negative a,why can a target ABOVE the vertex give none? ② Audit visibility in both windows with labelled axes. Does invisibility prove no roots,or permit moving points to a border? Why do window/cursor C changes preserve solutions? Keep original task nine’s irrational roots and exact decimal residuals;pixels are not exact roots. ③ Explain pointwise equivalence using H’s two-root target,distinguishing given height q,unknown inputs and zero difference output. Does one successful substitution prove completeness?',
    near
      ? 'H在q=3得(x−9)²=4，完整x=7,11，原图交点(7,3),(11,3)，差点(7,0),(11,0)。q=−1给平方0仅x=9、原图交点(9,−1)、差点(9,0)，相切一位置。q=−2给平方−1无实数，原最小−1所以更低目标无交。三目标的原f(0)=80，均不是把无交当0。平方正/零/负与穷尽分支说明完整，不只是代回。小窗x[−4,6]三处真实交点全在外，宽窗x[−8,12]、y[−10,30]内全能见（无交案仍无）；不夹点到边界。对每x，H(x)=3 iff H(x)−3=0，两图同输入而纵3/0不同。游标是试探点，改窗/游标不改原H或q。'
      : 'H在q=1得(x+8)²=1，完整x=−9,−7，原图交点(−9,1),(−7,1)，差点(−9,0),(−7,0)。q=3给平方0仅x=−8、原图交点(−8,3)、差点(−8,0)，相切一位置。q=4给平方−1/2无实数，原最大3故更高目标无交。f(0)=−125，不把无交写0。正/零/负平方目标和穷尽分支说明完整，不只核一个候选。小窗x[−4,6]三个真实交点都窗外；宽窗x[−8,12]只见−7与边界真实−8，不见−9，放宽也不自动全见。宽窗纵[−10,30]包含两高度，不能把−9挪到边界。逐x,H(x)=1 iff H(x)−1=0，纵1/0不同；游标或窗口不改H、q或根。',
    near
      ? 'At q=3,(x−9)²=4 gives ALL inputs7,11,original points(7,3),(11,3),difference zeros(7,0),(11,0). At q=−1,the square is zero,sole input9,original point(9,−1),difference point(9,0). At q=−2,the square is−1,impossible because H has minimum−1. Original f(0)=80 meets none of these targets. Positive/zero/negative square targets prove completeness beyond substitution. All three actual intersection positions lie outside small x[−4,6];wide x[−8,12],y[−10,30] shows all real intersections,while the empty case stays empty. Never clamp a point to the border. For EACH x,H(x)=3 iff H(x)−3=0;inputs agree but ordinates3/0 differ. Cursor trials and windows do not alter H or q.'
      : 'At q=1,(x+8)²=1 gives ALL inputs−9,−7,original points(−9,1),(−7,1),difference zeros(−9,0),(−7,0). At q=3,the square is zero,sole input−8,original point(−8,3),difference point(−8,0). At q=4,the square is−1/2,impossible since H has maximum3. Original f(0)=−125 meets none of these targets. Exhaustive square branches,not one substitution,prove completeness. All actual intersection positions are outside small x[−4,6]. Wide x[−8,12] shows−7 and true border point−8,but STILL hides−9. Its y[−10,30] contains the target heights;do not clamp−9 to a border. For EACH x,H(x)=1 iff H(x)−1=0,giving ordinates1/0. Cursor/window changes leave H,q and roots unchanged.',
  );
  table(q3, [
    ['H', '原函数', 'Original function', h, h],
    [
      'Q',
      '三个独立目标',
      'Three independent levels',
      `q=${levels}`,
      `q=${levels}`,
    ],
    [
      'V',
      '仅显示范围',
      'Display windows only',
      '小窗x[−4,6],y[−6,10]；宽窗x[−8,12],y[−10,30]',
      'Small x[−4,6],y[−6,10]; wide x[−8,12],y[−10,30]',
    ],
  ]);
  const perimeter = near ? 16 : 24,
    half = perimeter / 2,
    centre = half / 2,
    lo = near ? 1 : 2,
    upper = centre - 1,
    score = near ? '−x²+3x−1' : '−x²+5x+2';
  const q4 = card(
    4,
    'quadratic-minima-attainment-and-own-models',
    '① R在纸上自己画标牌、定义宽长和单位，保周长来源，生成面积一般/顶点/因式三形式并全展开核同函数。在D1/D2分别求最大和最小面积及所有达到宽度/长度，用平方距离说明候选完整；原正长域与另给闭区间分别写。两种范围改了什么？② 先核给定水平面积q的全部代数交点，再按D1筛宽度；原图/差图各标正确纵坐标。自己再选不同于给定q的正目标面积，求全部点并作范围双核，不只抄作者。③ S只允许表内整数，完整列每个允许输入/得分，求最高/最低及全部并列输入，和连续顶点比较；只画整数点不连线，不能舍入后漏一个。再自创m∈{1,2,3}、整数v的S=−x²+(2m+1)x+v，整数0≤x≤2m+1，必须与本卡给定S不同；证明所有并列最高/最低及单位。后续围栏维护题另核开端点无最小与整数并列最大，不把高阶求导当本课必需。④ 所有设计是虚构纸上方案，不是已实际试用。一次一个模型或编号。',
    '① DRAW your paper sign,define width/length/units and derive area from R’s perimeter. Generate standard,vertex and factored forms,expanding all coefficients. For D1/D2 separately find BOTH extrema and EVERY attaining width/length,proving complete candidates by square distance. State original positive-length and extra closed domains separately. What changed between domains? ② Solve the GIVEN target area for ALL algebraic intersections before D1 filtering;label original/difference ordinates correctly. Independently CHOOSE another positive target area,not the given q,and solve all points with separate equation/domain checks. Do not merely copy an author example. ③ For integer-only S,tabulate EVERY allowed score and ALL tied maxima/minima,contrasting the continuous vertex. Plot only integer points without joins. DESIGN m∈{1,2,3},integer v in S=−x²+(2m+1)x+v on integer0≤x≤2m+1,different from this supplied S,and prove every tied maximum/minimum with units. The existing fence retrieval task separately covers unattained open-endpoint minima/tied integer maxima;derivatives are not required for this lesson. ④ All designs are fictional paper plans,not actual household trials. One model or numbered part per sitting.',
    near
      ? 'R由2(x+长)=16得长8−x，正长0<x<8，A=x(8−x)=−x²+8x=16−(x−4)² cm²。D1[1,4]最大16在x4长4，最小7在x1长7；D2[1,3]最大15在x3长5，最小仍7在x1长7。允许x到4最近/最远距离穷尽全域，端点需包含，不能只试数。给定A=12得x=2,6，原图交点(2,12),(6,12)，差点纵0；两数都回面积12，只2在D1。自选示例q=15得3,5，仅3合D1；任何自己合法正q与完整核验均接受，目标大于16可证明无根。S在0,1,2,3的得分−1,1,1,−1；最高1在1、2两整数输入，最低−1在0、3，连续顶点3/2输出5/4不可用。自主一般配方S=(m²+m+v+1/4)−(x−m−1/2)²，最近整数m,m+1给最高m²+m+v，最远0,2m+1给最低v。另选示例m=2,v=0，整数0…5的得分0,4,6,6,4,0，最高6在2,3，最低0在0,5，和给定S不同。原图单位为cm/cm²，得分模型为张/分；作者例非唯一，不声称已测量或已试用。'
      : 'R由2(x+长)=24得长12−x，正长0<x<12，A=x(12−x)=−x²+12x=36−(x−6)² cm²。D1[2,6]最大36在x6长6，最小20在x2长10；D2[2,5]最大35在x5长7，最小20在x2长10。最近/最远中心6的平方距离覆盖全域；不能省端点或只试数。给定A=27得x=3,9，原图交点(3,27),(9,27)，差点纵0；两者代回27，只有3在D1。自选例q=32得4,8，仅4合D1；接受其他自主正q与完整分支证明，q>36可证无根。S在0…5的得分2,6,8,8,6,2，最高8在2,3，最低2在0,5，连续顶点5/2输出33/4不可用。自主一般S=(m²+m+v+1/4)−(x−m−1/2)²，最近整数m,m+1给最高m²+m+v，最远0,2m+1给最低v。另选例m=1,v=0，0…3得0,2,2,0，最高2在1,2，最低0在0,3，与给定S不同。报告cm/cm²及张/分，读孩子自己的图/数/证明，虚构不冒实测或试用。',
    near
      ? 'From2(x+length)=16,length8−x and original0<x<8. A=x(8−x)=−x²+8x=16−(x−4)² cm². D1[1,4]:maximum16 at width4,length4;minimum7 at width1,length7. D2[1,3]:maximum15 at width3,length5;minimum7 at width1,length7. Nearest/farthest square distance from4 covers EVERY allowed input;check included endpoints. Target12 gives inputs2,6,original points(2,12),(6,12),difference ordinates0;both restore12,but only2 is in D1. An independently selected example q15 gives3,5,only3 allowed. Accept other positive chosen targets with full checks;targets above16 have no roots. Supplied integer S scores−1,1,1,−1 at0…3:maximum1 at BOTH inputs1,2;minimum−1 at0,3. Continuous vertex3/2 gives5/4 and is inadmissible. Generally S=(m²+m+v+1/4)−(x−m−1/2)². Nearest integers m,m+1 attain maximum m²+m+v;farthest endpoints0,2m+1 attain minimum v. A DIFFERENT design example m2,v0 gives0,4,6,6,4,0 on0…5,maximum6 at2,3,minimum0 at0,5. Report cm/cm² and cards/points. Author examples are not unique or actual household trials.'
      : 'From2(x+length)=24,length12−x,original0<x<12. A=x(12−x)=−x²+12x=36−(x−6)² cm². D1[2,6]:maximum36 at width6,length6;minimum20 at width2,length10. D2[2,5]:maximum35 at width5,length7;minimum20 at width2,length10. Nearest/farthest square distance from6 covers the full domain. Target27 gives inputs3,9,original points(3,27),(9,27),difference ordinates0;both restore27,but only3 is allowed in D1. Chosen example q32 gives4,8,only4 allowed;accept other independently selected positive targets with exhaustive branches. Above36 there are no roots. Integer S on0…5 gives2,6,8,8,6,2:maximum8 at2,3,minimum2 at0,5. Continuous vertex5/2 gives33/4 and is inadmissible. Generally S=(m²+m+v+1/4)−(x−m−1/2)²;nearest integers m,m+1 give maximum m²+m+v,and farthest endpoints0,2m+1 give minimum v. A DIFFERENT example m1,v0 gives0,2,2,0 on0…3,maximum2 at1,2 and minimum0 at0,3. Use cm/cm² and cards/points. Review the learner’s own diagrams,numbers and proof;fictional plans are not measurements/trials.',
  );
  table(q4, [
    [
      'R',
      '自主画纸上矩形',
      'Draw a paper rectangle',
      `周长${perimeter}cm，宽x cm，长正`,
      `Perimeter${perimeter}cm,width x cm,positive length`,
    ],
    [
      'D1',
      '原题额外闭范围',
      'First extra closed domain',
      `${lo}≤x≤${centre} cm`,
      `${lo}≤x≤${centre} cm`,
    ],
    [
      'D2',
      '同函数第二范围',
      'Same function,second domain',
      `${lo}≤x≤${upper} cm`,
      `${lo}≤x≤${upper} cm`,
    ],
    [
      'Q',
      '先核给定面积',
      'Given target area',
      near ? '12cm²' : '27cm²',
      near ? '12cm²' : '27cm²',
    ],
    [
      'S',
      '独立整数得分',
      'Separate integer score',
      `${score}，整数0≤x≤${near ? 3 : 5}张，输出分`,
      `${score};integer0≤x≤${near ? 3 : 5}cards,output points`,
    ],
    [
      'D',
      '另作自己的模型',
      'Another original design',
      '另选正目标面积；自创m∈{1,2,3}、整数v的不同整数得分模型',
      'Choose another positive area target;design a different integer-score model with m∈{1,2,3},integer v',
    ],
  ]);
  return {
    id: `${unit}-MAINT-PARABOLA-MEANING`,
    unit,
    bridge: 'J93-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 4, 5].map((n, i) => [id(i + 1), `J93-L0${n}`]),
    ),
    title: t(
      '共同标尺、分数顶点与最值达到',
      'Common scales,fractional vertices and attained extrema',
    ),
    intro: t(
      '四张独立纸笔卡，每次一个编号/案例，可分次不计时、口述或熟悉语言。亲画/推导后逐项人审，读题帮助与数学提示分开。原十题、前批根式/方程卡保留独立记录；全部虚构，不需购买、实测或上传。',
      'Four independent paper cards,one numbered part/case per untimed sitting. Oral/familiar-language work is welcome. Draw/derive before human review;separate reading help from mathematical hints. Original ten tasks and earlier radical/equation cards keep independent records. Fictional work needs no purchases,measurements or uploads.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const parabolaMeaningRetrieval = {
  H03_PARABOLA_MEANING: makeSet('H03'),
  H04_PARABOLA_MEANING: makeSet('H04'),
};
