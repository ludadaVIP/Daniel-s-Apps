import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H05' | 'H06') => {
  const near = unit === 'H05',
    id = (n: number) => `${unit}-MAINT-PYTHAGOREAN-MEANING-Q${n}`;
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
        '逐个案例画图、标参照与原条件，保留精确分数。连续变换沿上一步的像继续，独立案例才重新从原图出发；平方值、长度与单位分别写。',
        'Draw each case with references and original premises, retaining exact fractions. A composition continues from the preceding image; only independent cases restart from the original. Distinguish squared values, lengths and units.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时，允许口述或熟悉语言。先生成自己的图和理由再人审；读题帮助与数学提示分开。',
        'One numbered part or independent case per untimed sitting; oral or familiar-language work is welcome. Generate your own diagram and reasons before review; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件：不同编号独立，只有题目明确的变换链按顺序连续。坐标轴垂直且同长度单位；虚构纸笔模型不是实际观察。',
        'Original conditions: labelled cases are independent; only the explicitly stated transformation chain is sequential. Coordinate axes are perpendicular with equal length units. Fictional paper models are not observations.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve)]),
    };
  };
  const points = near
    ? 'A(1/2,1/2), B(−3/2,2), C(2,−3/2)'
    : 'A(−1/2,−1/2), B(3/2,−3/2), C(2,1/2)';
  const diagonal = near
    ? 'A′(1/2,1/2), B′(2,−3/2), C′(−3/2,2)'
    : 'A′(−1/2,−1/2), B′(−3/2,3/2), C′(1/2,2)';
  const vertical = near
    ? 'A′(−1/2,1/2), B′(3/2,2), C′(−2,−3/2)'
    : 'A′(1/2,−1/2), B′(−3/2,−3/2), C′(−2,1/2)';
  const q1 = card(
    1,
    'fractional-reflections-and-own-composition',
    '① G的两个分支都从原三角形出发：分别关于y=x、关于y轴反射，亲算两组三点并画带身份标签的图。哪一个原顶点在y=x上固定？同位置的两个名字是否自动是固定点？比较两条轴的规则，符号怎样随数值保留？② 对原AB及两种反射像，算精确差向量、距离平方与长度，说明保长保角及朝向。对一般P(x,y)，证明y=x的交换规则：点像中点在哪、连线为何垂直于轴、何时点不动？不能只说中点在线上便当完整反射证明。给一个y轴上非原点的固定点，并求它关于y=x的像作对照。只改显示窗口会改坐标或答案吗？③ 自画一个非共线三点的虚构标志，至少一个坐标是非整数分数、至少一个点在y=x上。按C连续做平移→y=x反射→指定中心半转；每阶段列全部三点，画四幅对应图并核一条边保长。不能把每一步都重新作用到原图。用原图的点名追踪各像；作者示例不是唯一设计。',
    '① BOTH branches of G restart from the ORIGINAL triangle: reflect separately in y=x and the y-axis. Calculate both sets of three images and draw identity-labelled figures. Which original vertex is fixed on y=x? Do two different names occupying the same position automatically mean a fixed point? Compare the two mirror rules and track the signs of values. ② For original AB and both reflected copies calculate exact displacement, squared distance and length, explaining preserved lengths/angles and orientation. For general P(x,y), justify the swap rule for y=x: locate the point-image midpoint, prove perpendicularity to the mirror and determine the fixed points. Midpoint-on-mirror alone is insufficient. Give a non-origin y-axis fixed point and its y=x image for contrast. Does changing only the display window change coordinates/answers? ③ DESIGN a noncollinear three-point fictional sign, including a noninteger fractional coordinate and a point on y=x. Apply C SEQUENTIALLY: translation→y=x reflection→half-turn about the supplied centre. List ALL three points at each stage, draw the four corresponding figures and check one preserved edge. Do not restart every stage from the original. Track your own point names; author examples are not unique designs.',
    `G的y=x像为${diagonal}，y轴像为${vertical}。原A在y=x不动；${near ? 'B′与原C重合、C′与原B重合，是交换位置而非B/C各自固定。' : '其他点不在y=x，不固定。'}原AB差${near ? '(−2,3/2)' : '(2,−1)'}、平方${near ? '25/4' : '5'}、长度${near ? '5/2' : '√5'}；y=x像的差交换分量、y轴像只反横分量，平方和不变；两反射均反朝向保角，不把角改补角。一般P′=(y,x)，中点((x+y)/2,(x+y)/2)在轴；非固定时连线位移(y−x,x−y)沿斜率−1方向，与y=x垂直，且中点等分，故等垂距。固定当且仅当x=y。y轴点(0,1)固定但y=x像(1,0)，两轴不同；显示窗口不改数值。自创合条件图均可。例原A(0,0),B(1/2,0),C(0,${near ? 1 : 2})；指定链的一般最终式${near ? '(3−y,1−x)' : '(−4−y,3−x)'}，依次像为${near ? '平移(1,−1),(3/2,−1),(1,0)；反射(−1,1),(−1,3/2),(0,1)；半转(3,1),(3,1/2),(2,1)' : '平移(−1,2),(−1/2,2),(−1,4)；反射(2,−1),(2,−1/2),(4,−1)；半转(−4,3),(−4,5/2),(−6,3)'}。图须非共线，各步采用上一像并保对应边平方；接受其他自创合法点。`,
    `The y=x images are ${diagonal}; y-axis images are ${vertical}. Original A is fixed on y=x.${near ? ' B′ coincides with original C and C′ with original B: exchanged positions do not make B or C individually fixed.' : ' The other vertices are off y=x and not fixed.'} Original AB displacement is ${near ? '(−2,3/2)' : '(2,−1)'}, squared length ${near ? '25/4' : 'five'} and length ${near ? '5/2' : '√5'}. Swapping components for y=x or negating only the horizontal component for the y-axis retains the square sum. Both reflections reverse orientation while retaining angles, not replacing them by supplements. Generally P′=(y,x). The midpoint is ((x+y)/2,(x+y)/2), on the mirror. For a nonfixed point, displacement(y−x,x−y) has slope−1, perpendicular to y=x; the bisected segment gives equal perpendicular distances. Fixed points satisfy x=y. Point(0,1) is fixed on the y-axis but maps to(1,0) in y=x. A display window changes no values. Accept ANY permitted independent sign. Example original A(0,0),B(1/2,0),C(0,${near ? 1 : 2}) has final rule ${near ? '(3−y,1−x)' : '(−4−y,3−x)'}. Stages are ${near ? 'translation(1,−1),(3/2,−1),(1,0);reflection(−1,1),(−1,3/2),(0,1);half-turn(3,1),(3,1/2),(2,1)' : 'translation(−1,2),(−1/2,2),(−1,4);reflection(2,−1),(2,−1/2),(4,−1);half-turn(−4,3),(−4,5/2),(−6,3)'}. Check noncollinearity, preceding-stage inputs and a preserved squared edge; other valid self-chosen points count equally.`,
  );
  table(q1, [
    ['G', '独立原三角形', 'Independent original triangle', points, points],
    [
      'C',
      '仅此链连续',
      'Only this chain is sequential',
      near
        ? '平移(1,−1)→y=x反射→绕O(1,1)半转'
        : '平移(−1,2)→y=x反射→绕O(−1,1)半转',
      near
        ? 'Translate(1,−1)→reflect in y=x→half-turn about O(1,1)'
        : 'Translate(−1,2)→reflect in y=x→half-turn about O(−1,1)',
    ],
  ]);
  const hp = near ? '(−1/2,3)' : '(−3,1/2)',
    hi = near ? '(7/2,−1)' : '(1,7/2)',
    center = near ? '(3/2,1)' : '(−1,2)';
  const q2 = card(
    2,
    'inverse-half-turn-and-fixed-set',
    '① H给变换前的点P和一次半转像P′，亲推未知中心O，写由P′=2O−P到中点的两分量式并核OP=OP′。不能把O默认原点。② 从同一原P分别绕求得O逆时针90°和顺时针90°，逐步写减中心、转位移、加中心，画两种结果；两种半径相同就能判断方向吗？再给第二次半转回P的计算，中心本身怎样？③ 与过O的竖直轴反射作独立比较：自取该轴上异于O的K，分别算反射像和半转像，用固定点说明两个变换为何不同。④ 独立S的一次180°变换前后恰为同一个点，中心仍能任意选吗？求所有可能中心，说明不等于说“任何旋转都只有一个固定点”。',
    '① H supplies original P and its FIRST half-turn image P′. Derive unknown centre O component by component from P′=2O−P to the midpoint and check OP=OP′; do not assume the origin. ② Restart from the SAME original P for 90° anticlockwise and clockwise rotations about your derived O. Show subtract-centre, rotate-displacement and add-centre, drawing both images. Do equal radii determine direction? Calculate a second half-turn returning to P, and state what happens to the centre itself. ③ SEPARATELY compare reflection in the vertical mirror through O. CHOOSE K on that line with K≠O, calculate its reflection and half-turn images, and use fixed points to distinguish the transformations. ④ Separate S is unchanged by ONE 180° rotation. May its centre be arbitrary? Find ALL possible centres, without claiming that every possible rotation has only one fixed point.',
    `H中心O=${center}，由2Ox=Px+P′x、2Oy=Py+P′y取平均；点P相对中心O的位移${near ? '(−2,2)' : '(−2,−3/2)'}，半径平方${near ? 8 : '25/4'}。逆90像${near ? '(−1/2,−1)' : '(1/2,0)'}，顺90像${near ? '(7/2,3)' : '(−5/2,4)'}，半径同而方向/像不同，距离保持不足以定方向。半转像为原P′，再用2O−P′回${hp}，一般2O−(2O−P)=P；O位移零始终固定。取K=(Ox,Oy+1)，竖直轴反射仍K，半转得(Ox,Oy−1)≠K；非零半转固定点解2O−X=X仅X=O，反射固定整轴。独立S中P′=P=K₀，2O=2K₀，唯一O=K₀=${near ? '(1/3,−2/3)' : '(−2/3,4/3)'}，不是任意中心；此结论针对180°，不把0°恒等旋转混进来。`,
    `H gives centre O=${center} from 2Ox=Px+P′x,2Oy=Py+P′y. Relative P displacement is ${near ? '(−2,2)' : '(−2,−3/2)'}, with radius squared ${near ? 'eight' : '25/4'}. The anticlockwise image is ${near ? '(−1/2,−1)' : '(1/2,0)'}, clockwise ${near ? '(7/2,3)' : '(−5/2,4)'}. Equal radii allow different directions/images; distance alone is insufficient. The first half-turn gives supplied P′ and the second gives 2O−P′=${hp}; generally 2O−(2O−P)=P. O has zero relative displacement and stays fixed. Choose K=(Ox,Oy+1): vertical-mirror reflection fixes K, while its half-turn is(Ox,Oy−1)≠K. Fixed points of a nontrivial half-turn satisfy 2O−X=X, hence only X=O; reflection fixes the whole mirror. In separate S, P′=P=K₀ gives 2O=2K₀, so the unique centre is O=K₀=${near ? '(1/3,−2/3)' : '(−2/3,4/3)'}, not arbitrary. This is specifically 180°, not the identity rotation through zero degrees.`,
  );
  table(q2, [
    [
      'H',
      '半转反求中心',
      'Recover a half-turn centre',
      `P=${hp}，一次180°像P′=${hi}`,
      `P=${hp}; FIRST 180° image P′=${hi}`,
    ],
    [
      'S',
      '独立重合点像',
      'Separate coincident point and image',
      near
        ? 'P=P′=(1/3,−2/3)；变换仍明确180°'
        : 'P=P′=(−2/3,4/3)；变换仍明确180°',
      near
        ? 'P=P′=(1/3,−2/3); still explicitly 180°'
        : 'P=P′=(−2/3,4/3); still explicitly 180°',
    ],
  ]);
  const leg = near ? '5/12' : '8/15',
    hyp = near ? '13/12' : '17/15',
    rootSquare = near ? '5/4' : '13/9';
  const q3 = card(
    3,
    'fractional-lengths-and-exact-side-audit',
    '每个字母独立。① R有明确直角，先找斜边并求其平方和非负精确长度；M则给斜边和一腿，用差平方求另一腿，代原式核。分数分母平方与开方怎样对应，单位何时为cm²/何时回cm？② S的三个根式是否同一非负长度？分别平方证明，给负值为何仍不是长度；小数D是否精确相等，算其平方与S的精确差作证，不能凭显示接近。③ K是题设精确三边，先验正长/严格存在再取最长边，算精确平方差，判类型并说明锐钝比较的额外边角性质。若把最长边先四舍五入到两位小数，会错误变成什么结论？Z虽满足平方等式却能成三角形吗？④ 自创一个至少一边为非整数正分数的虚构矩形，亲画对角线、求精确长度、回代平方核验，并说明直角来源；另自创三个都为正却不能成非退化三角形的边长，列不等式失败。自创数值不当真实测量，接受所有合条件方案。',
    'Each letter is independent. ① R has a GIVEN right angle: identify the hypotenuse, find its square and nonnegative exact length. M instead supplies hypotenuse and a leg: subtract squares for the other leg and substitute into the original relation. Explain squared fractional denominators and their roots, including cm² versus cm. ② Do S’s three radical expressions denote the same nonnegative length? Prove by squaring each. Why is its negative not a length? Is decimal D EXACTLY equal? Calculate its squared difference from S exactly; visual closeness is insufficient. ③ K supplies EXACT side values. Check positivity/strict existence, take the longest, calculate the exact square difference and classify with the additional side/angle comparison property for acute/obtuse. What false conclusion results from FIRST rounding the longest to two decimal places? Z satisfies a square equality: does it form a triangle? ④ DESIGN a fictional rectangle with at least one noninteger positive fractional side. Draw its diagonal, find the exact length and verify its square, naming the right-angle premise. Independently design three POSITIVE side lengths failing nondegenerate triangle existence and show the failed inequality. Self-designed values are not measurements; accept every permitted design.',
    `R有c²=1+(${leg})²=${near ? '169/144' : '289/225'}cm²，c=${hyp}cm；分母${near ? 144 : 225}开方为${near ? 12 : 15}，不是照抄平方分母。M另一腿平方(${hyp})²−1=${near ? '25/144' : '64/225'}cm²，正长${leg}cm；两例都按原平方和核，不能直接减长度。S三式平方同${rootSquare}cm²，均非负故同长；负根即使同平方也非长度。D²−S²=${near ? '1.12²−5/4=11/2500' : '1.20²−13/9=−1/225'}cm²非0，所以小数非精确等值。K最长${near ? '125001' : '124999'}/100000，另两边3/4、1均正且和7/4更大；最长平方减短边平方和=${near ? '250001' : '−249999'}/10000000000，${near ? '正，配合夹角与对边比较得钝角' : '负，配合边角比较得最大角锐、全三角锐'}。若先舍入最长为1.25，会伪造0差而误称直角；精确值不被UI近似改变。Z含0边，且两短和等最长，不是三角形，虽0²+${near ? 4 : 9}=${near ? 4 : 9}也不能用逆定理。自创例矩形${near ? '1/2、1cm，斜边√5/2cm，平方5/4cm²' : '2/3、1cm，斜边√13/3cm，平方13/9cm²'}，矩形给直角，核原式；正边失败例${near ? '2、4、6' : '3、5、8'}两短和等最长。其他合条件原创均可，需自己的图、精确数与前提；长度不强制唯一根式写法。`,
    `R has c²=1+(${leg})²=${near ? '169/144' : '289/225'} cm² and c=${hyp} cm. Rooting denominator ${near ? 144 : 225} gives ${near ? 12 : 15}, not the squared denominator. In M the other leg square is(${hyp})²−1=${near ? '25/144' : '64/225'} cm², giving positive ${leg} cm. Check original square sums rather than subtracting lengths. All three S expressions are nonnegative and square to ${rootSquare} cm², so are equal lengths; their negative shares the square but is not a length. D²−S²=${near ? '1.12²−5/4=11/2500' : '1.20²−13/9=−1/225'} cm² is nonzero, so D is not exact. K has positive longest ${near ? '125001' : '124999'}/100000 and other sides 3/4,one, whose sum 7/4 exceeds it. The exact longest-square difference is ${near ? '250001' : '−249999'}/10000000000, ${near ? 'positive, giving an obtuse angle with the side/angle comparison property' : 'negative, giving an acute largest angle and thus an acute triangle with the comparison property'}. Rounding the longest first to1.25 fabricates zero difference and a false right-angle verdict. Display rounding does not alter exact values. Z has a zero side and equality in the short-side sum, so no triangle exists despite0²+${near ? 4 : 9}=${near ? 4 : 9}; the converse cannot apply. Independent rectangle examples:${near ? '1/2 and one cm,diagonal√5/2 cm,square5/4 cm²' : '2/3 and one cm,diagonal√13/3 cm,square13/9 cm²'}, with rightness from the rectangle and an original-equation check. Positive impossible triples can be ${near ? 'two,four,six' : 'three,five,eight'} at equality. Other permitted original designs count equally; require the learner’s own diagram,exact numbers and premises. Equivalent exact radical forms are welcome.`,
  );
  table(q3, [
    [
      'R',
      '已知直角的两腿',
      'Two legs with a given right angle',
      `a=${leg}cm，b=1cm`,
      `a=${leg}cm, b=1cm`,
    ],
    [
      'M',
      '另一已知直角三角形',
      'Another given right triangle',
      `斜边c=${hyp}cm，已知腿1cm`,
      `Hypotenuse c=${hyp}cm; known leg1cm`,
    ],
    [
      'S/D',
      '独立根式与小数候选',
      'Separate radicals and decimal candidate',
      near
        ? '√(5/4)cm、√5/2cm、√20/4cm；D=1.12cm'
        : '√(13/9)cm、√13/3cm、√52/6cm；D=1.20cm',
      near
        ? '√(5/4)cm,√5/2cm,√20/4cm; D=1.12cm'
        : '√(13/9)cm,√13/3cm,√52/6cm; D=1.20cm',
    ],
    [
      'K',
      '独立精确三边',
      'Separate exact sides',
      `3/4cm、1cm、${near ? '125001' : '124999'}/100000cm`,
      `3/4cm,1cm,${near ? '125001' : '124999'}/100000cm`,
    ],
    [
      'Z',
      '独立退化数据',
      'Separate degenerate data',
      near ? '0cm、2cm、2cm' : '0cm、3cm、3cm',
      near ? '0cm,2cm,2cm' : '0cm,3cm,3cm',
    ],
  ]);
  return {
    id: `${unit}-MAINT-PYTHAGOREAN-MEANING`,
    unit,
    title: t(
      '分数坐标、反求中心与精确几何条件',
      'Fractional coordinates, recovered centres and exact geometric premises',
    ),
    intro: t(
      '三张纸笔卡，每次一个编号或独立案例，可分次、不计时。亲画图、写中间步骤和原条件，再逐项人审；允许口述/熟悉语言，读题协助与数学提示分开。虚构标志和矩形不要求购买或真实测量。',
      'Three paper cards,one numbered part or independent case per untimed sitting. Draw,write intermediate steps and retain original premises before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Fictional signs and rectangles require no purchases or measurements.',
    ),
    bridge: 'J87-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 4].map((l, i) => [id(i + 1), `J87-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const pythagoreanMeaningRetrieval = {
  H05_PYTHAGOREAN_MEANING: makeSet('H05'),
  H06_PYTHAGOREAN_MEANING: makeSet('H06'),
};
