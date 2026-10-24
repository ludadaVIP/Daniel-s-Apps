import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H23' | 'H36') => {
  const first = unit === 'H23',
    id = (i: number) => `${unit}-MAINT-VECTOR-LANGUAGE-Q${i}`;
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
        '把点、向量和标量分开；写清起点终点、非零与非退化前提，再用原坐标和逆关系核查。',
        'Distinguish points, vectors and scalars. State endpoint order, nonzero and nondegeneracy premises, then check original coordinates and inverse relations.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-VECTOR-LANGUAGE`,
    unit,
    bridge: 'H05-L01',
    bridgeByQuestion: Object.fromEntries(
      ['H05-L04', 'H05-L02', 'H05-L03', 'H05-L06'].map((l, i) => [
        id(i + 1),
        l,
      ]),
    ),
    title: t(
      '空间与解析几何之后，再核向量语言',
      'After spatial and analytic geometry, recheck vector language',
    ),
    intro: t(
      '四题分次，每次一题；箭头图、坐标和理由可在纸上写。全部人工核验，不计时；空间图的投影不能代替真实分量。',
      'Choose one of four tasks per sitting. Draw arrows and write coordinates and reasons on paper. Every argument is human-reviewed without a timer; a spatial projection cannot replace actual components.',
    ),
    questions: [
      task(
        1,
        'vector-value-not-position',
        `在固定坐标系给${first ? 'A=(2,−1,4),B=(5,3,2)' : 'A=(−2,3),B=(4,1)'}。求AB和BA、精确长度，再将两端同时平移${first ? '(−1,2,3)' : '(3,−4)'}，写新端点、位移并解释何者不变。用AB和BA说明“同长即相等”为什么不对；再把终点移到起点，能给零位移指定向北吗？为何B的点坐标通常不是AB？`,
        `In a fixed coordinate system let ${first ? 'A=(2,−1,4),B=(5,3,2)' : 'A=(−2,3),B=(4,1)'}. Find AB,BA and exact length. Translate both endpoints by ${first ? '(−1,2,3)' : '(3,−4)'},give new endpoints and displacement,and explain invariants. Use AB versus BA to audit “equal lengths imply equal vectors”. If the endpoint moves to the start,may zero displacement be assigned north? Why is point B usually not vector AB?`,
        first
          ? 'AB=B−A=(3,4,−2)，BA=(−3,−4,2)，长度均√29但非零反向，故不相等。共同平移后A′=(1,1,7)、B′=(4,5,5)，差仍(3,4,−2)，位置变而向量值和长度不变，一般(B+w)−(A+w)=B−A。终点等起点给(0,0,0)，没有可识别方向，不能称向北。B坐标是从原点到B的位置，只有A为原点时才等于AB；分量必须终点减起点。'
          : 'AB=B−A=(6,−2)，BA=(−6,2)，长度√40=2√10但两向量反向不相等。平移后A′=(1,−1)、B′=(7,−3)，差仍(6,−2)；一般同加w相减抵消，点位置变而位移不变。终点重合给零向量，无确定方向。B=(4,1)是位置而非AB，除非A在所选原点；不得只抄终点坐标。',
        first
          ? 'AB=B−A=(3,4,−2),BA=(−3,−4,2),each length√29 but nonzero and opposite,so not equal. Translation gives A′=(1,1,7),B′=(4,5,5),with unchanged difference(3,4,−2). In general(B+w)−(A+w)=B−A: positions change,vector value and length do not. Coincident endpoints give(0,0,0),with no identifiable direction,so north cannot be assigned. B is a position from the origin and equals AB only if A is that origin. Components require end minus start.'
          : 'AB=B−A=(6,−2),BA=(−6,2),both length√40=2√10 but opposite and unequal. Translation gives A′=(1,−1),B′=(7,−3),retaining difference(6,−2). Adding w to both endpoints cancels in their difference: positions change,displacement does not. Coincident endpoints give zero with no defined direction. B=(4,1) is a position,not AB unless A is the chosen origin; do not copy only the endpoint coordinates.',
        '先把箭头AB读成从A到B，再同时移动两端；长度相同不保方向。',
        'Read AB as from A to B before translating both ends. Equal length does not preserve direction.',
      ),
      task(
        2,
        'vector-head-tail-and-difference',
        `给同尾u=${first ? '(1,2,−1)' : '(2,−1)'}、v=${first ? '(−2,1,3)' : '(−1,3)'}。亲画首尾平移求u+v，标从哪里连到哪里；再画v头到u头和u头到v头，分别算其向量。用(u−v)+v核逆关系，说明“直接连接同尾两箭头的头就得和”错在哪。`,
        `Let common-tail u = ${first ? '(1,2,−1)' : '(2,−1)'} and v = ${first ? '(−2,1,3)' : '(−1,3)'}. Draw a head-to-tail translation for u+v,identifying the start and end. Draw the vector from v’s head to u’s head and its reverse,compute both,and check(u−v)+v=u. Audit “joining the two original heads gives the sum”.`,
        first
          ? '先将v尾平移到u头，保持v分量；由原共同尾到新v头为和(−1,3,2)。原v头到u头是u−v=(3,1,−4)，反向是v−u=(−3,−1,4)，不是和。将(3,1,−4)+(−2,1,3)得(1,2,−1)=u。一般同尾两头差是终点u减起点v，换向所有分量变号；图的投影看似连接不能删起终点。'
          : '把v尾搬到u头，由最初共同尾连到新v头给和(1,2)。原v头到u头为u−v=(3,−4)，反向为(−3,4)；不能把任一差叫和。加回v得(3,−4)+(−1,3)=(2,−1)=u。首尾连接与同尾两头连接的起终点不同，平移保向量，不授权换箭头方向。',
        first
          ? 'Translate v so its tail meets u’s head without changing components. From the original common tail to the translated head gives sum(−1,3,2). Between the original heads,v to u gives u−v=(3,1,−4); the reverse gives(−3,−1,4),not the sum. Adding v back gives(1,2,−1)=u. Head order determines the difference; a projection cannot erase start/end identities.'
          : 'Move v’s tail to u’s head. The arrow from the initial common tail to the new head is sum(1,2). Between original heads,v to u gives difference(3,−4); the reverse gives(−3,4). Adding v back yields(2,−1)=u. Head-to-tail addition and common-tail head joining have different endpoints; translation preserves a vector but reversing it changes its sign.',
        '画三支箭头分别标尾与头，先看要的连接属于和还是哪一方向的差。',
        'Label tails and heads on three arrows before deciding whether the connection is a sum or an ordered difference.',
      ),
      task(
        3,
        'vector-scalar-sign-and-size',
        `给非零u=${first ? '(2,−4,2)' : '(−3,6)'}，求${first ? '−3/2' : '−2/3'}u，解释方向与长度倍率。解ku=0，以及k0=0和k0=${first ? '(1,0,0)' : '(0,1)'}的全部实标量集合；为什么从ku=0直接说k=0缺条件？用一个非零分量给一般证明。`,
        `For nonzero u = ${first ? '(2,−4,2)' : '(−3,6)'},find ${first ? '−3/2' : '−2/3'}u and explain direction and length scale. Give ALL real scalar solutions of ku=0,k0=0 and k0=${first ? '(1,0,0)' : '(0,1)'}. Why does “ku=0 implies k=0” need a premise? Prove the valid statement using a nonzero component.`,
        first
          ? '(−3/2)u=(−3,6,−3)，负号反向，长度乘3/2非负倍率；u模√24=2√6，新模3√6。此给定非零u有分量2，所以2k=0仅k0，解{0}。k0=0对所有实k成立，解ℝ；k0=(1,0,0)无解，因左侧每分量0。一般u≠0至少一个uj≠0，kuj=0除uj得k0；若u0不能除它，也不能恢复唯一倍数。'
          : '(−2/3)u=(2,−4)，方向反转、长度乘2/3；原模3√5，新模2√5。由非零分量−3得−3k=0仅k0，ku0解{0}。k0=0解全ℝ；k0=(0,1)无解，零源不可能产生非零目标。一般u≠0有某非零分量uj，kuj=0才可除uj得k0；不先核u≠0就报唯一k0会漏全体或无解分支。',
        first
          ? 'The result is(−3,6,−3). A negative scalar reverses direction and multiplies length by3/2,from2√6 to3√6. Since u has nonzero component two,2k=0 forces k=0,so ku=0 has set{0}. Every real k solves k0=0; no real k solves k0=(1,0,0). Generally nonzero u has some component uj≠0,and kuj=0 may be divided by uj. A zero source cannot support that division or unique scalar recovery.'
          : 'The result is(2,−4),opposite in direction with length multiplied by2/3,from3√5 to2√5. Component−3 forces k=0 in ku=0,so its set is{0}. Equation k0=0 has every real scalar,while k0=(0,1) has none. Generally a nonzero component uj permits division in kuj=0. Without checking u≠0,claiming a unique zero scalar misses the all-scalars and no-scalar branches.',
        '数乘作用每个分量；求倍数先查源是否零，再分全体、唯一或无解。',
        'Scale every component. Before recovering a scalar,check for a zero source and distinguish all,unique or no solutions.',
      ),
      task(
        4,
        'vector-geometry-with-premises',
        `审查“对角线等长的四边形一定为矩形”。先给题设已知非退化平行四边形的相邻边向量u,v，用|u+v|²−|u−v|²证明正确结论；再核反例${first ? 'A=(−3,0,1),B=(3,0,1),C=(2,2,1),D=(−2,2,1)' : 'A=(−4,0),B=(4,0),C=(1,3),D=(−1,3)'}。算两对角线平方与两底长，解释反例否定哪个缺前提主张；不能把结论当成原已知。`,
        `Audit “a quadrilateral with equal diagonals must be a rectangle”. First,for a GIVEN nondegenerate parallelogram with adjacent vectors u,v,use |u+v|²−|u−v|² to prove the valid conclusion. Then check counterexample ${first ? 'A=(−3,0,1),B=(3,0,1),C=(2,2,1),D=(−2,2,1)' : 'A=(−4,0),B=(4,0),C=(1,3),D=(−1,3)'}. Compute both squared diagonals and base lengths. State which missing-premise claim is refuted; do not assume the desired conclusion.`,
        first
          ? '已有非退化平行四边形时，对角线可取u+v与v−u，其平方差4u·v。等长给点积0，邻边均非零故垂直，再由平行四边形性质为矩形，前提没有从图猜。反例AC=(5,2,0)、BD=(−5,2,0)，平方均29；AB长6、CD长4，平行底不等，故非平行四边形也非矩形。等对角线单独不够，反例不否定带平行四边形前提的定理。'
          : '已有非退化平行四边形时，两对角线u+v与v−u的平方差4u·v；等长推出u·v0，两非零邻边夹直角，故为矩形。反例AC=(5,3)、BD=(−5,3)，平方均34；平行底AB长8、CD长2，不是平行四边形/矩形。它否定的是漏前提的所有四边形主张，不是正确的平行四边形定理。证据链要先有结构再用等长，不能循环假定矩形。',
        first
          ? 'For a stipulated nondegenerate parallelogram,the diagonals may be u+v and v−u. Their squared-length difference is4u·v. Equality gives dot product zero; both adjacent sides are nonzero,so they are perpendicular and the parallelogram is a rectangle. In the counterexample,AC=(5,2,0),BD=(−5,2,0),each square29,but the parallel bases have lengths six and four. It is neither a parallelogram nor a rectangle. This refutes the missing-premise claim,not the valid conditional theorem.'
          : 'For a GIVEN nondegenerate parallelogram,diagonals u+v and v−u have squared-length difference4u·v. Equal lengths force perpendicular nonzero adjacent sides and hence a rectangle. In the counterexample,AC=(5,3),BD=(−5,3),both square34,but parallel bases have lengths eight and two. It is not a parallelogram or rectangle. The counterexample refutes the unrestricted quadrilateral claim,not the theorem with its structural premise. Do not assume rectangular structure to prove it.',
        '先展开一般平方差，再明确点积0何时给直角；反例核对同一顺序的四个顶点。',
        'Expand the general squared difference,then state when dot product zero gives a right angle. Check the counterexample in the declared vertex order.',
      ),
    ],
  };
};
export const vectorLanguageRetrieval = {
  H23_VECTOR: makeSet('H23'),
  H36_VECTOR: makeSet('H36'),
};
