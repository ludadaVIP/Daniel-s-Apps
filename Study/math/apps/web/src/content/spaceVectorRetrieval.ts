import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H36' | 'H38') => {
  const first = unit === 'H36',
    id = (i: number) => `${unit}-MAINT-SPACE-VECTOR-Q${i}`;
  const q = (
    i: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `space-vector-${i}`, t(sz, se), [
      t(hz, he),
      t(
        '始终保三维分量、原坐标系与非零方向/法向量；图仅是投影，归属、垂直与最短性须分别论证。',
        'Keep all three components,the original coordinate system and nonzero directions/normals. A picture is a projection;membership,perpendicularity and minimality need separate arguments.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-SPACE-VECTOR`,
    unit,
    bridge: 'H23-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), `H23-L0${i}`]),
    ),
    title: t(
      '轨迹与项目之后，再核三维向量',
      'After loci and projects,recheck three-dimensional vectors',
    ),
    intro: t(
      '五题分次，每次一题，可把构造与证明分两次。坐标为虚构数学数据；允许纸笔，全部人工核验，不计时。画xy投影时仍保留z条件。',
      'Choose one of five tasks per sitting,splitting construction and proof if useful. Coordinates are fictional mathematical givens. Use paper;every task is human-reviewed without a timer. Retain z conditions even when sketching an xy projection.',
    ),
    questions: [
      q(
        1,
        `固定坐标系给A${first ? '(1,−2,4)' : '(−2,1,3)'}、B${first ? '(−2,2,1)' : '(2,−2,5)'}。求AB、BA、长度与中点，再将两端同时平移${first ? '(2,1,−1)' : '(−1,2,4)'}，求新端点、中点、位移。用一般分量解释哪些不变。xy正投影的长度平方是多少，能否代替原长度？两端重合时方向怎样处理，B坐标何时才等于AB？`,
        `In a fixed coordinate system let A${first ? '(1,−2,4)' : '(−2,1,3)'},B${first ? '(−2,2,1)' : '(2,−2,5)'}. Find AB,BA,length and midpoint. Translate both ends by${first ? '(2,1,−1)' : '(−1,2,4)'} and find new endpoints,midpoint and displacement. Prove the invariants using general components. What is squared length in the xy orthographic projection,and may it replace actual length? Handle coincident endpoints and explain when B equals AB.`,
        `${first ? 'AB=(−3,4,−3)、BA=(3,−4,3)，长度√34，中点(−1/2,0,5/2)。新A(3,−1,3)、B(0,3,0)，中点(3/2,1,3/2)，位移不变。' : 'AB=(4,−3,2)、BA=(−4,3,−2)，长度√29，中点(0,−1/2,4)。新A(−3,3,7)、B(1,0,9)，中点(−1,3/2,8)，位移不变。'}一般(B+w)−(A+w)=B−A，平均端点则中点增加w，原点未移动。xy投影位移平方25，漏掉z平方${first ? 9 : 4}，不等于三维平方${first ? 34 : 29}；任意屏幕线长更不能认证空间长度。AB与BA同长但反向不相等，重合时零位移无方向。B位置坐标只有A为所选原点时等于AB。`,
        `${first ? 'AB=(−3,4,−3),BA=(3,−4,3),length√34,midpoint(−1/2,0,5/2). New A=(3,−1,3),B=(0,3,0),midpoint(3/2,1,3/2);displacement is unchanged.' : 'AB=(4,−3,2),BA=(−4,3,−2),length√29,midpoint(0,−1/2,4). New A=(−3,3,7),B=(1,0,9),midpoint(−1,3/2,8);displacement is unchanged.'} Generally(B+w)−(A+w)=B−A,while the midpoint increases by w in the fixed frame. The xy projected squared length25 omits z²=${first ? 9 : 4},so differs from actual squared length${first ? 34 : 29}. Screen lengths cannot certify space lengths. AB and BA have equal length but opposite directions. Coincident ends give zero with no direction. Position B equals displacement AB only when A is the chosen origin.`,
        '先终点减起点，三项都保；平移改点位置，中点也随之移动。',
        'Subtract start from end in all three components. Translation changes positions and moves the midpoint too.',
      ),
      q(
        2,
        `给u=${first ? '(2,−1,3)' : '(−1,3,2)'}、v=${first ? '(−1,2,1)' : '(2,1,−2)'}，求w=${first ? '2u−3v' : '−2u+v'}，用逆运算核回。写任意三分量的通式，解释数乘的负号怎样影响方向与长度；源向量为零时能否谈反向？再用e1=(1,0,0)、e3=(0,0,1)反驳|u+v|总等于|u|+|v|，并说明非零向量何时取等。`,
        `For u=${first ? '(2,−1,3)' : '(−1,3,2)'},v=${first ? '(−1,2,1)' : '(2,1,−2)'},find w=${first ? '2u−3v' : '−2u+v'} and verify by inverse operations. Write the arbitrary three-component formula. Explain negative scalar effects on direction/length and the zero-source exception. Use e1=(1,0,0),e3=(0,0,1) to refute universal length additivity,and state equality conditions for nonzero vectors.`,
        `${first ? 'w=(7,−8,3)，加3v=(−3,6,3)得(4,−2,6)=2u。一般2u−3v的第j分量2uj−3vj，j=1,2,3全部要算。' : 'w=(4,−5,−6)，减v得(2,−6,−4)=−2u。一般−2u+v的第j分量−2uj+vj，j=1,2,3均保留。'}一般|ku|²=k²|u|²，所以|ku|=|k||u|；k<0且u非零时反向，k=0或u=0所得零向量无方向。e1+e3=(1,0,1)，长度√2≠2，数值相加不等于向量长度相加。两向量非零时三角不等式取等当且仅当同向共线；若某向量零，等号也成立但不能给它方向。`,
        `${first ? 'w=(7,−8,3);adding3v=(−3,6,3) recovers(4,−2,6)=2u. Generally component j is2uj−3vj for every j=1,2,3.' : 'w=(4,−5,−6);subtracting v recovers(2,−6,−4)=−2u. Generally component j is−2uj+vj for every j=1,2,3.'} The identity |ku|²=k²|u|² gives |ku|=|k||u|. Negative k reverses nonzero u;zero k or zero u gives no direction. Vector e1+e3=(1,0,1) has length√2,not=2. For two nonzero vectors,triangle equality requires the same direction and collinearity. A zero vector also gives equality without acquiring a direction.`,
        '数乘作用全部三分量；长度倍率取绝对值，不能把零向量叫反向。',
        'Scale all three components. Length uses the absolute multiplier;zero has no opposite direction.',
      ),
      q(
        3,
        `给非零u=${first ? '(1,0,1)' : '(1,1,0)'}、v=${first ? '(−1,1,−1)' : '(−1,−1,1)'}。算点积、两模平方及向量夹角的精确余弦，判断锐/钝。若作两相交直线方向，其较小线角余弦为何不同？构造与u垂直的非零向量并核三项点积，再以零向量说明点积0不足以定义直角；结果是向量还是标量？`,
        `For nonzero u=${first ? '(1,0,1)' : '(1,1,0)'},v=${first ? '(−1,1,−1)' : '(−1,−1,1)'},find dot product,squared norms and exact cosine of their vector angle;classify acute/obtuse. If they direct intersecting lines,why does the smaller line angle have a different cosine? Construct a nonzero perpendicular vector. Use zero to explain why dot product zero alone does not define a right angle. Is a dot product a vector or scalar?`,
        `点积${first ? '−1+0−1' : '−1−1+0'}=−2，是实标量；模平方2、3，cosθ=−2/√6=−√6/3，向量角为钝角。直线可将v换−v不改集合，较小线角用|u·v|/(|u||v|)=√6/3为锐角；不是保留原有向余弦。w=${first ? '(1,0,−1)' : '(1,−1,0)'}非零且u·w=0，故有直角。零与u点积0却无角度，因长度乘积为0；正确条件必须两向量均非零。点积为负时也须查非共线才能称一般钝角，反向共线是180°平角。`,
        `Dot product is the real scalar−2;the squared norms are two and three. Cosθ=−2/√6=−√6/3,an obtuse vector angle. Reversing v preserves its line,so the smaller line angle uses |u·v|/(|u||v|)=√6/3 and is acute. Vector w=${first ? '(1,0,−1)' : '(1,−1,0)'} is nonzero with u·w=0,hence a right angle. Zero also has dot product zero with u,but the cosine denominator vanishes and no angle exists. Both vectors must be nonzero. A negative dot product additionally needs noncollinearity for a general obtuse angle;opposite collinear vectors make a straight angle.`,
        '先查两模非零，再用三项点积；线角允许反向重选方向。',
        'Check nonzero norms before the three-term dot product. A line permits reversing its chosen direction.',
      ),
      q(
        4,
        `对平面${first ? 'x+2y−z=2' : '2x−y+2z=3'}，分别判断三条线的关系并在唯一相交时给交点：${first ? '①(2,0,0)+t(2,−1,0)；②(3,0,0)+t(2,−1,0)；③(0,0,0)+t(1,0,0)' : '①(0,−3,0)+t(1,2,0)；②(0,−4,0)+t(1,2,0)；③(0,0,0)+t(0,1,0)'}。从n·A+t(n·u)=d推全部分类；线面垂直用什么条件？另核l=(t,0,0)、m=(0,s,${first ? 1 : 2})为何方向点积0却异面，不能凭xy投影判相交。`,
        `For plane${first ? 'x+2y−z=2' : '2x−y+2z=3'},classify three lines and give any unique intersection:${first ? '(1)(2,0,0)+t(2,−1,0);(2)(3,0,0)+t(2,−1,0);(3)(0,0,0)+t(1,0,0)' : '(1)(0,−3,0)+t(1,2,0);(2)(0,−4,0)+t(1,2,0);(3)(0,0,0)+t(0,1,0)'}. Derive all cases from n·A+t(n·u)=d. What condition gives line–plane perpendicularity? Audit l=(t,0,0),m=(0,s,${first ? 1 : 2}):why are they skew despite zero direction dot product and an intersecting xy projection?`,
        `${first ? '法向n=(1,2,−1)。①n·u=0且n·A=2=d，全线在内；②n·u=0而n·A=3≠2，严格平行；③n·u=1，t=2，交点(2,0,0)。' : '法向n=(2,−1,2)。①n·u=0且n·A=3=d，全线在内；②n·u=0而n·A=4≠3，严格平行；③n·u=−1，t=−3，交点(0,−3,0)。'}一般u,n都非零；n·u≠0给唯一t=(d−n·A)/(n·u)，点积0则由基点归属分在内或严格平行。线面垂直要求u为n的非零倍数，不是点积0。另两直线方向(1,0,0)、(0,1,0)点积0且不平行，第一条z=0、第二条z=${first ? 1 : 2}永不交，故异面；投影删z才出现交点，不可移作空间归属证据。`,
        `${first ? 'Normal n=(1,2,−1). Line1 has n·u=0 and n·A=2=d,so is contained. Line2 has n·A=3≠2,so is strictly parallel. Line3 has n·u=1,t=2,intersection(2,0,0).' : 'Normal n=(2,−1,2). Line1 has n·u=0 and n·A=3=d,so is contained. Line2 has n·A=4≠3,so is strictly parallel. Line3 has n·u=−1,t=−3,intersection(0,−3,0).'} Generally nonzero u,n give unique t=(d−n·A)/(n·u) when n·u≠0. If the dot is zero,base-point membership separates containment from strict parallelism. Perpendicularity requires u a nonzero multiple of n,not zero dot product. The extra lines have perpendicular nonparallel directions but incompatible z=0 versus z=${first ? 1 : 2};they are skew. Dropping z in projection creates no space intersection.`,
        '线面代入会成为一个关于t的一次方程；零系数还要查常数，方向垂直不等于两线相交。',
        'Substitution gives one linear equation in t. A zero coefficient still requires checking the constant;perpendicular directions do not imply intersecting lines.',
      ),
      q(
        5,
        `P${first ? '(3,2,4)' : '(4,3,3)'}到平面${first ? 'x+2y+2z=6' : '2x−y+2z=2'}以及直线${first ? '(1,0,2)+t(1,1,0)' : '(0,1,1)+t(2,0,1)'}各求H、参数（若有）与距离。核H属于原对象及残余垂直，再对任意对象点Q证明最短。法向和右端同乘−2或直线方向乘−2为何不改H与距？单独改右端或令方向/法向零仍可照套吗？P本在对象上时呢？`,
        `For P${first ? '(3,2,4)' : '(4,3,3)'},find foot H,parameter where applicable,and distance to plane${first ? 'x+2y+2z=6' : '2x−y+2z=2'} and line${first ? '(1,0,2)+t(1,1,0)' : '(0,1,1)+t(2,0,1)'}. Check membership and perpendicular residual,then prove minimality for every Q on the object. Why do scaling both plane normal/RHS by−2 or the line direction by−2 preserve H and distance? Audit changing only the RHS,zero normal/direction,and P already on the object.`,
        `${first ? '平面余量9、|n|²=9，H=P−n=(2,0,2)，残余n，距离3。直线w=P−A=(2,2,2)，t=(w·u)/|u|²=4/2=2，H=(3,2,2)，残余(0,0,2)，距离2。' : '平面余量9、|n|²=9，H=P−n=(2,4,1)，残余n，距离3。直线w=(4,2,2)，t=10/5=2，H=(4,1,3)，残余(0,2,0)，距离2。'}H代平面/参数式均归属，残余分别平行n或与u点积0。对任意Q，(P−H)·(Q−H)=0，所以|PQ|²=|PH|²+|HQ|²，等号仅Q=H，证明全体最短。平面n,d都乘−2使投影比抵消；直线方向乘−2后t变−1而H不变。只改d通常移平面，不能称同对象。零n/u不定义原平面/直线，不可套除法。P在对象上则残余0、H=P、距离0，最短性仍成立。`,
        `${first ? 'Plane residual nine and |n|²=9 give H=P−n=(2,0,2),residual vector n,distance three. For the line,w=(2,2,2),t=4/2=2,H=(3,2,2),residual(0,0,2),distance two.' : 'Plane residual nine and |n|²=9 give H=P−n=(2,4,1),residual vector n,distance three. For the line,w=(4,2,2),t=10/5=2,H=(4,1,3),residual(0,2,0),distance two.'} Check H in the original plane/line;the residual is parallel to n or orthogonal to u. For every object point Q,(P−H)·(Q−H)=0,so |PQ|²=|PH|²+|HQ|²,equal only for Q=H. Scaling both n,d by−2 cancels in projection. Scaling line direction by−2 changes t to−1 while preserving H. Changing only d generally moves the plane. Zero n/u invalidates the plane/line and division. If P is already on the object,H=P and distance zero;minimality still holds.`,
        '先验证垂足归属与残余方向，再说最短；平面缩放要连右端，直线参数随方向倍率反向变化。',
        'Check membership and residual direction before minimality. Scale the plane RHS with its normal;line parameters change inversely with direction scaling.',
      ),
    ],
  };
};
export const spaceVectorRetrieval = {
  H36_SPACE: makeSet('H36'),
  H38_SPACE: makeSet('H38'),
};
