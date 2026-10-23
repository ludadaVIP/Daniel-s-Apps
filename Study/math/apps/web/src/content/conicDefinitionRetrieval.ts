import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H36' | 'H38') => {
  const first = unit === 'H36',
    id = (i: number) => `${unit}-MAINT-CONIC-DEFINITION-Q${i}`;
  const q = (
    i: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `analytic-${i}`, t(sz, se), [
      t(hz, he),
      t(
        '把必要性与充分性分开；保留实坐标、非零方向、距离非负和参数范围，数值核查不能代替完整轨迹论证。',
        'Separate necessity from sufficiency. Retain real coordinates,nonzero directions,nonnegative distances and parameter ranges;numeric checks do not replace a complete locus argument.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-CONIC-DEFINITION`,
    unit,
    bridge: 'H22-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((i) => [id(i), `H22-L0${i}`]),
    ),
    title: t(
      '交点与项目之后，重建圆锥曲线定义',
      'After intersections and projects,rebuild conic definitions',
    ),
    intro: t(
      '六题分次，每次选一题，可纸笔画焦点、准线和垂足。全为人工核验；定义、方程、边界与反向可达性一起检查，不计时。',
      'Choose one of six tasks per sitting. Sketch foci,directrices and perpendicular feet on paper. Every task is human-reviewed without a timer;check definitions,equations,boundaries and converse reachability together.',
    ),
    questions: [
      q(
        1,
        first
          ? '直线经过P(2,−1)，方向d=(0,3)。给参数式和一般式，说明为何不能写有限斜率；再给经过Q(1,2)、方向(2,−1)的直线一般式和斜率。从任意非零方向(u,v)证明点向式v(x−h)−u(y−k)=0恰好表示整条直线，审查u=v=0及A=B=0的一般式。'
          : '直线经过P(−2,3)，方向d=(3,2)。给参数式、一般式和斜率，再写经过Q(4,−1)的水平线与竖直线，分别说明斜率。从任意非零方向(u,v)证明v(x−h)−u(y−k)=0覆盖整条直线；若方向为零或一般式A=B=0，会发生什么？',
        first
          ? 'A line passes through P(2,−1) with direction(0,3). Give its parametric/general forms and explain the absence of finite slope. Then find the general form and slope through Q(1,2) with direction(2,−1). For arbitrary nonzero(u,v),prove v(x−h)−u(y−k)=0 represents exactly the entire line. Audit zero direction and general forms with A=B=0.'
          : 'Through P(−2,3),direction(3,2),give parametric/general forms and slope. Also give horizontal and vertical lines through Q(4,−1),with slope status. For arbitrary nonzero(u,v),prove v(x−h)−u(y−k)=0 covers exactly the whole line. What changes for zero direction or A=B=0?',
        `${first ? '(x,y)=(2,−1)+t(0,3)，t∈R，x=2，斜率无定义；第二条(x,y)=(1,2)+t(2,−1)，x+2y−5=0，斜率−1/2。' : '(x,y)=(−2,3)+t(3,2)，t∈R，2x−3y+13=0，斜率2/3。Q的水平线y=−1斜率0，竖直线x=4无有限斜率。'}一般代参数后vtu−utv=0，反向若u≠0取t=(x−h)/u便得y−k=tv；若u=0则v≠0，方程逼x=h，取t=(y−k)/v。故双向覆盖，非只检若干点。d=0参数像仅一个点，点向式却0=0，不能当直线。Ax+By+C=0须(A,B)≠(0,0)；两者零时C=0是全平面，C≠0是空集。`,
        `${first ? 'The first is(2,−1)+t(0,3),t∈R,or x=2,without finite slope. The second is(1,2)+t(2,−1),or x+2y−5=0,slope−1/2.' : 'The first is(−2,3)+t(3,2),t∈R,or2x−3y+13=0,slope2/3. Through Q,the horizontal y=−1 has slope zero;vertical x=4 has no finite slope.'} Substitution gives vtu−utv=0. Conversely,if u≠0 set t=(x−h)/u and recover y−k=tv. If u=0,v≠0,the equation forces x=h and t=(y−k)/v recovers every point. Zero direction parametrises one point while the determinant equation becomes0=0. A general line requires(A,B)≠(0,0);otherwise C=0 gives the whole plane and C≠0 gives the empty set.`,
        '方向与法向量垂直；逆向用一个非零分量恢复参数，别除以可能为零的u。',
        'Direction is perpendicular to the normal. Recover the parameter through a nonzero component;do not divide by a possibly zero u.',
      ),
      q(
        2,
        `给P${first ? '(3,4)' : '(1,2)'}与直线${first ? '3x+4y−5=0' : '4x−3y+7=0'}，求垂足H与最短距离，逐项核H在线上、PH垂直直线。为何将方程乘−3不改距离？对一般非零法向量推垂足公式，再用任意线上点Q的勾股分解证明最短，别只验一个垂足。P在线上或法向量零时怎样处理？`,
        `Given P${first ? '(3,4)' : '(1,2)'} and line${first ? '3x+4y−5=0' : '4x−3y+7=0'},find perpendicular foot H and minimum distance. Check membership and perpendicularity. Why does multiplying the equation by−3 preserve distance? Derive the general foot formula for nonzero normal,and prove minimality for every line point Q by Pythagoras. Handle P on the line and zero normal.`,
        `${first ? '代入余量20，法向量(3,4)平方长25，H=(3,4)−(20/25)(3,4)=(3/5,4/5)，线式值9/5+16/5−5=0，距离20/5=4。' : '余量5，法向量(4,−3)平方长25，H=(1,2)−(5/25)(4,−3)=(1/5,13/5)，线式值4/5−39/5+7=0，距离5/5=1。'}一般r=AxP+ByP+C，H=P−r(A,B)/(A²+B²)，代入余量消零，P−H平行法向量。任意Q在线上，H−Q与法向量垂直，因此|PQ|²=|PH|²+|HQ|²≥|PH|²，仅Q=H取等。距|r|/√(A²+B²)，方程非零倍λ使分子分母都乘|λ|，即使负倍也不变。r=0则H=P、距离0；零法向量不是直线，不能除以0或套最短距离公式。`,
        `${first ? 'Residual20 and squared normal25 give H=(3/5,4/5). Its line residual is9/5+16/5−5=0,and distance20/5=4.' : 'Residual five and squared normal25 give H=(1/5,13/5). Its residual is4/5−39/5+7=0,and distance5/5=1.'} Generally r=AxP+ByP+C and H=P−r(A,B)/(A²+B²). Substitution gives membership;P−H is parallel to the normal. For every Q on the line,H−Q is perpendicular to that normal,so |PQ|²=|PH|²+|HQ|²,with equality only at Q=H. Distance is |r|/√(A²+B²). Scaling the equation by nonzero λ scales both numerator and denominator by |λ|. If r=0,H=P and distance zero. Zero normal does not define a line and cannot enter this formula.`,
        '先算余量再减法向投影；距离的分母随方程缩放也必须缩放。',
        'Compute the residual and subtract the normal projection. Equation scaling changes the distance denominator as well.',
      ),
      q(
        3,
        `将${first ? 'x²+y²−4x+2y−4=0' : 'x²+y²+6x−4y−3=0'}配方，给中心C、半径r及r²；核P${first ? '(5,−1)' : '(−3,6)'}和C是否在圆周。将标准式右端分别改0与−1，在实平面是什么集合？从距离定义解释充要性，区别圆周、闭圆盘与仅一个点，给相应不等式及边界。`,
        `Complete squares in${first ? 'x²+y²−4x+2y−4=0' : 'x²+y²+6x−4y−3=0'}. Give centre C,radius r and r². Check P${first ? '(5,−1)' : '(−3,6)'} and C for circle membership. Replace the standard-form RHS by zero and−1:what real sets result? Use the distance definition in both directions,and distinguish circumference,closed disk and a singleton,including inequalities and boundaries.`,
        `${first ? '(x−2)²+(y+1)²=9，C(2,−1)、r=3、r²=9；P距离平方9在圆周，C距离0不在半径3圆周。' : '(x+3)²+(y−2)²=16，C(−3,2)、r=4、r²=16；P距离平方16在圆周，C距0不在半径4圆周。'}对r>0，距离r等价两坐标差平方和r²，因距离非负可平方并逆向取非负根；圆盘则平方和≤r²，圆周为其等号边界。右端0要求两差都0，仅C，不能仍报正半径圆；负右端因实平方和非负而空集。圆心属于闭圆盘而非正半径圆周。`,
        `${first ? 'The form is(x−2)²+(y+1)²=9,centre(2,−1),radius three,squared radius nine. P has squared distance nine;C has zero and is not on the circumference.' : 'The form is(x+3)²+(y−2)²=16,centre(−3,2),radius four,squared radius sixteen. P has squared distance sixteen;C has zero and is not on the circumference.'} For r>0,distance r is equivalent to squared coordinate differences summing to r²,because distance is nonnegative. A closed disk uses ≤r²;the circumference is its equality boundary. RHS zero forces both differences zero,a singleton C. Negative RHS gives no real point. The centre belongs to the disk but not its positive-radius circumference.`,
        '配方时两边同时补常数；取半径要开非负平方根。',
        'Complete squares on both sides;radius is the nonnegative square root.',
      ),
      q(
        4,
        `对${first ? '(y−2)²=−8(x−1)' : '(y−1)²=12(x+2)'}写顶点、p、焦点和准线、开口，并核P${first ? '(−1,6)' : '(1,7)'}到两者等距，准线距必须取垂直距离。对一般(y−k)²=4p(x−h)，从焦点/准线等距双向推方程；p=0时原距离定义和方程各给什么集合，为何不叫非退化抛物线？`,
        `For${first ? '(y−2)²=−8(x−1)' : '(y−1)²=12(x+2)'},give vertex,p,focus,directrix and opening. Check P${first ? '(−1,6)' : '(1,7)'} for equal focus/directrix distances,using perpendicular distance. Derive(y−k)²=4p(x−h) in both directions from equidistance. What do the distance definition and equation give when p=0,and why is it degenerate?`,
        `${first ? '顶点(1,2)，4p=−8所以p=−2，F(−1,2)、准线x=3，向左。P到F距离4，到准线|−1−3|=4。' : '顶点(−2,1)，p=3，F(1,1)、准线x=−5，向右。P到F距离6，到准线|1+5|=6。'}设X=x−h、Y=y−k，F相对(p,0)，准线X=−p。等距√((X−p)²+Y²)=|X+p|；两边非负，平方等价且消去得Y²=4pX，反向平方相等再取非负根亦成立。p=0时Y²=0且距离式√(X²+Y²)=|X|，两者都给整条Y=0；焦点落在准线上，不是非退化抛物线。4p不是p，p有符号不等于正距离。`,
        `${first ? 'Vertex(1,2),p=−2,focus(−1,2),directrix x=3,opening left. P has focus distance four and directrix distance|−1−3|=4.' : 'Vertex(−2,1),p=3,focus(1,1),directrix x=−5,opening right. P has focus distance six and directrix distance|1+5|=6.'} Put X=x−h,Y=y−k. Equidistance is√((X−p)²+Y²)=|X+p|. Both sides are nonnegative,so squaring is reversible and simplifies to Y²=4pX. Conversely the equation gives equal squared distances,hence equal nonnegative distances. At p=0,both forms yield the full line Y=0;the focus lies on the directrix. This is degenerate. The signed p differs from4p and from an unsigned distance.`,
        '先平移到顶点，用|X+p|作点到竖准线的距离；平方前后核非负。',
        'Translate to the vertex and use |X+p| for distance to the vertical directrix. Retain nonnegativity when reversing squaring.',
      ),
      q(
        5,
        `焦点F1${first ? '(−1,−1)' : '(−3,−2)'}、F2${first ? '(5,−1)' : '(−3,6)'}，距离和为${first ? 10 : 12}。给中心、轴方向、a,c,b²与椭圆方程，并用一长轴顶点核距离和。保持焦点不动，把距离和改为${first ? '4、6' : '6、8'}时各是什么集合？说明三角不等式取等，c=0时为何为圆，距离和与焦距不能混作半轴。再用中心化坐标解释该方程与距离和定义为何双向等价。`,
        `Foci are F1${first ? '(−1,−1)' : '(−3,−2)'},F2${first ? '(5,−1)' : '(−3,6)'},with distance sum${first ? 10 : 12}. Find centre,major-axis direction,a,c,b² and equation,and check a major vertex against the sum. Keeping foci fixed,replace the sum by${first ? 'four and six' : 'six and eight'}:describe each locus and the triangle-equality case. What if c=0? Distinguish total distance sum and focal separation from semiaxes. Use centred coordinates to justify equivalence with the focal-sum definition in both directions.`,
        (first
          ? '中心(2,−1)，水平长轴，2c=6所以c=3，2a=10所以a=5，b²=25−9=16；(x−2)²/25+(y+1)²/16=1。右顶点(7,−1)距8与2，和10。任意点距和≥焦距6；和4空，和6恰焦点间闭线段，不能仍画椭圆。和10>6才非退化椭圆。一般c=0两焦点重合时2|PC|=2a，a>0给圆半径a；若a=0是单点而非正半径圆。'
          : '中心(−3,2)，竖长轴，c=4、a=6、b²=36−16=20；(y−2)²/36+(x+3)²/20=1。上顶点(−3,8)距10与2，和12。任意距离和≥焦距8；和6空，和8恰两焦点闭线段，和12>8非退化椭圆。一般焦点重合c=0时2|PC|=2a，a>0给半径a圆，a=0仅中心。轴方向不能只靠哪个坐标先写，长轴对应较大分母。') +
          '取X沿长轴、Y垂直长轴，两焦点相对为(−c,0)、(c,0)。由d1+d2=2a及d1²−d2²=4cX得d1=a+cX/a、d2=a−cX/a，消元得X²/a²+Y²/(a²−c²)=1。反向方程给|X|≤a且a>c，使两候选距离≥a−c>0，平方恒等可取非负根还原d1+d2=2a，故无额外支。',
        (first
          ? 'Centre(2,−1),horizontal major axis,c=3,a=5,b²=16 give(x−2)²/25+(y+1)²/16=1. Right vertex(7,−1) has distances eight and two,sum ten. Every sum is at least focal separation six. Sum four is empty;six is precisely the closed segment between foci,by triangle equality;ten gives a nondegenerate ellipse. If c=0,2|PC|=2a gives a circle of radius a for a>0,and a singleton for a=0.'
          : 'Centre(−3,2),vertical major axis,c=4,a=6,b²=20 give(y−2)²/36+(x+3)²/20=1. Top vertex(−3,8) has distances ten and two,sum twelve. Every sum is at least focal separation eight. Sum six is empty;eight is the closed focal segment;twelve gives a nondegenerate ellipse. Coincident foci give2|PC|=2a,a circle for a>0 or a singleton for a=0. The larger denominator identifies the major axis.') +
          ' Let X run along the major axis and Y perpendicular,with foci(−c,0),(c,0). From d1+d2=2a and d1²−d2²=4cX,obtain d1=a+cX/a,d2=a−cX/a. Elimination yields X²/a²+Y²/(a²−c²)=1. Conversely |X|≤a and a>c keep both proposed distances at least a−c>0;the squared identities therefore restore the nonnegative distances and sum2a without an extra branch.',
        '2a是距离和，2c是焦距；三角不等式取等需要点在两焦点之间，含端点。',
        'The sum is2a and focal separation2c. Triangle equality requires the point between the foci,including endpoints.',
      ),
      q(
        6,
        `焦点F1${first ? '(−3,2)' : '(1,−4)'}、F2${first ? '(7,2)' : '(1,6)'}，绝对距离差为6。给中心、轴向、a,c,b²、方程与两顶点，按固定标签核两点的有向距离差。去绝对值只保哪支？绝对差改为0、10、12时完整轨迹各是什么（10时不是整条焦轴）？用反三角不等式和取等情形解释。对0<a<c，用中心化坐标说明双曲线方程双向等价于绝对距离差定义。`,
        `Foci are F1${first ? '(−3,2)' : '(1,−4)'},F2${first ? '(7,2)' : '(1,6)'},with absolute distance difference six. Give centre,transverse axis,a,c,b²,equation and both vertices. Check SIGNED differences at both vertices with fixed focal labels. Which branch survives removal of the absolute value? Describe complete loci for differences zero,ten and twelve;ten does not give the whole focal axis. Explain reverse-triangle equality. For0<a<c,use centred coordinates to justify equivalence of the hyperbola equation and absolute-difference definition in both directions.`,
        (first
          ? '中心(2,2)，水平实轴，a=3、c=5、b²=25−9=16；(x−2)²/9−(y−2)²/16=1。右顶点(5,2)距8、2有向差6，左(−1,2)距2、8差−6；仅PF1−PF2=6留右支。差0是中垂线x=2。绝对差≤焦距10；差10为焦轴y=2上x≤−3或x≥7的两闭射线，含焦点，焦点间内部差小于10。差12空。'
          : '中心(1,1)，竖实轴，a=3、c=5、b²=16；(y−1)²/9−(x−1)²/16=1。上顶点(1,4)距8、2差6，下(1,−2)距2、8差−6；仅PF1−PF2=6留上支。差0为中垂线y=1。最大绝对差为焦距10，取等仅焦轴x=1上y≤−4或y≥6的两闭射线含焦点，非整轴。差12空。') +
          '一般X沿实轴、Y垂直实轴。正支d1−d2=2a，差平方4cX给d1+d2=2cX/a，消元得X²/a²−Y²/(c²−a²)=1。反向该式强制|X|≥a；X≥a时cX/a±a均正，恢复两距离且差2a，X≤−a由对称给差−2a，故绝对值恰保两支且无多余点。',
        (first
          ? 'Centre(2,2),horizontal transverse axis,a=3,c=5,b²=16 give(x−2)²/9−(y−2)²/16=1. Right vertex(5,2) has distances eight,two and signed difference six;left(−1,2) has two,eight and difference−6. A positive signed equation retains only the right branch. Difference zero gives perpendicular bisector x=2. Reverse triangle inequality bounds the absolute difference by ten. Equality gives y=2 with x≤−3 or x≥7,two closed exterior rays including the foci,not the interior segment. Twelve is impossible.'
          : 'Centre(1,1),vertical transverse axis,a=3,c=5,b²=16 give(y−1)²/9−(x−1)²/16=1. Top vertex(1,4) has distances eight,two and signed difference six;bottom(1,−2) has two,eight and−6. A positive signed equation retains the upper branch. Zero difference gives y=1. Reverse triangle inequality bounds the absolute difference by ten. Equality gives x=1 with y≤−4 or y≥6,two closed exterior rays including foci,not the whole axis. Twelve is impossible.') +
          ' Generally let X run along the transverse axis. On the positive branch,d1−d2=2a and d1²−d2²=4cX imply d1+d2=2cX/a. Eliminating distances gives X²/a²−Y²/(c²−a²)=1. Conversely the equation forces |X|≥a. For X≥a,the values cX/a±a are positive and restore the actual distances with difference2a. Reflection gives difference−2a on X≤−a,so the absolute value retains exactly both branches.',
        '固定焦点标签，分别算两顶点；反三角取等时点在焦点连线的外侧，含焦点。',
        'Keep focal labels fixed and check both vertices. Reverse-triangle equality places the point outside the focal segment,including its endpoints.',
      ),
    ],
  };
};
export const conicDefinitionRetrieval = {
  H36_CONIC: makeSet('H36'),
  H38_CONIC: makeSet('H38'),
};
