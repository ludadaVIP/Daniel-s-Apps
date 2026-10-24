import { t, type Question, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'R01' | 'R02') => {
  const first = unit === 'R01',
    id = (i: number) => `${unit}-MAINT-EXTENSION-Q${i}`;
  const edges = first
    ? [
        ['S', 'A', '1'],
        ['S', 'B', '3'],
        ['S', 'C', '2'],
        ['A', 'T', '9'],
        ['B', 'T', '1'],
        ['C', 'B', '1'],
        ['C', 'A', '0'],
      ]
    : [
        ['P', 'J', '2'],
        ['P', 'K', '2'],
        ['J', 'K', '0'],
        ['K', 'J', '0'],
        ['J', 'Q', '3'],
        ['K', 'Q', '3'],
        ['P', 'Q', '8'],
      ];
  const graphTable = {
    caption: t(
      first
        ? '完整有向边表；顶点S, A, B, C, T, U，起S终T，U孤立。成本是给定非负数，不按图上长度。'
        : '完整有向边表；顶点P, J, K, Q, Z，起P终Q，Z孤立。只列不重复顶点的简单路；零权环允许存在。',
      first
        ? 'COMPLETE directed edge table; vertices S, A, B, C, T, U, start S, goal T, U isolated. Costs are given nonnegative numbers, not drawn lengths.'
        : 'COMPLETE directed edge table; vertices P, J, K, Q, Z, start P, goal Q, Z isolated. Report SIMPLE paths without repeated vertices; zero-cost cycles may exist.',
    ),
    columns: [t('从', 'From'), t('到', 'To'), t('成本', 'Cost')],
    rows: edges.map((row) => row.map((s) => t(s, s))),
  };
  const matrixTable = {
    caption: t(
      first
        ? '列向量约定；给A、B、投影P，检验向量v=(2,−1)。矩阵行在表中按a11, a12, a21, a22列出。'
        : '列向量约定；给A、B、压缩P，检验v=(1,3)。矩阵行在表中按a11, a12, a21, a22列出。',
      first
        ? 'COLUMN-vector convention; given A, B, projection P and probe v=(2,−1). Each row lists a11, a12, a21, a22.'
        : 'COLUMN-vector convention; given A, B, collapse P and probe v=(1,3). Each row lists a11, a12, a21, a22.',
    ),
    columns: [
      t('矩阵', 'Matrix'),
      t('a11', 'a11'),
      t('a12', 'a12'),
      t('a21', 'a21'),
      t('a22', 'a22'),
    ],
    rows: (first
      ? [
          ['A', '3', '0', '0', '1'],
          ['B', '0', '1', '−1', '0'],
          ['P', '0', '0', '0', '1'],
        ]
      : [
          ['A', '1', '2', '0', '1'],
          ['B', '−1', '0', '0', '1'],
          ['P', '1', '1', '0', '0'],
        ]
    ).map((row) => row.map((s) => t(s, s))),
  };
  const f = (x: number) => (first ? x * x - 3 : x * x * x - 2);
  const numericPlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: 0,
      xMax: 2.5,
      yMin: first ? -4 : -2,
      yMax: first ? 4 : 14,
      xStep: 0.5,
      yStep: first ? 1 : 2,
    },
    points: [
      { x: 1, y: f(1), label: 'L' },
      { x: 2, y: f(2), label: 'R' },
    ],
    curves: [
      {
        name: 'given polynomial, not a root marker',
        color: '#5850a1',
        points: Array.from({ length: 81 }, (_, i) => {
          const x = (2.5 * i) / 80;
          return { x, y: f(x) };
        }),
      },
    ],
    xLabel: 'x',
    yLabel: 'f(x)',
    caption: t(
      `给定f(x)=${first ? 'x²−3' : 'x³−2'}，初始包围区间[1,2]；L/R是原端点，未标所求根或更新后中点。函数原域R，图窗与近似曲线不作为横向误差保证。`,
      `Given f(x)=${first ? 'x²−3' : 'x³−2'} and starting bracket[1,2]. L/R are the ORIGINAL endpoints, not the root or updated midpoint. The polynomial domain is R; the finite window and approximate curve do not supply horizontal error guarantees.`,
    ),
  };
  const questions: Question[] = [
    reasoning(
      id(1),
      t(
        first
          ? '对所有整数n≥1，完整证明∑(j=1…n)2j=n(n+1)。写P(n)、基例、任意k的临时假设、明确下一项和传递。为何假设P(k)不是直接假设全称结论？只有可传递的“总和=n(n+1)+1”、只有基例成立的“总和=2n”、检查前100项，各缺什么？若传递只从k到k+2却只验n=1，会覆盖所有n吗？'
          : '对所有整数n≥1，完整证明∑(j=1…n)(5j−2)=n(5n+1)/2。写基例与任意k的传递，不能把P(k+1)写成“显然”。解释临时假设与循环论证。只把右式加1为什么可能保传递却基例失败？只验前100项够吗？只证k到k+2且仅验n=1遗漏什么？',
        first
          ? 'For ALL integers n≥1,prove ∑(j=1…n)2j=n(n+1). State P(n),the base,an ARBITRARY k hypothesis,the exact next term and step. Why is assuming P(k) not assuming the universal conclusion? Contrast the propagating claim sum=n(n+1)+1,the base-only claim sum=2n,and checking the first100 terms. Does a k→k+2 step with ONLY base n=1 reach all n?'
          : 'For ALL integers n≥1,prove ∑(j=1…n)(5j−2)=n(5n+1)/2. Give the base and ARBITRARY k step,not “P(k+1) is obvious”. Explain a temporary hypothesis versus circular reasoning. Why can adding one to the formula preserve increments but fail the base? Do one hundred checks suffice? What does a k→k+2 step with only n=1 omit?',
      ),
      'extension-1',
      t(
        `${first ? 'P(n)是所给等式。n=1左2右2。任取k≥1，暂设前k项=k(k+1)，第k+1项2(k+1)，合计k(k+1)+2(k+1)=(k+1)(k+2)，即P(k+1)。右式加1时仍有同样增量，但基例右3不等左2；总和=2n虽n=1真，n=2左6右4假。' : 'P(n)是所给等式。n=1左3右3。任取k≥1暂设前k项=k(5k+1)/2，第k+1项5k+3；合计[k(5k+1)+2(5k+3)]/2=(k+1)(5k+6)/2，正是下一式。加1的常数仍保增量，却n=1右4不等左3。'} 临时假设只用于证明条件句P(k)⇒P(k+1)，没有假设所有n都真；真基例启动、任意k传递共同覆盖每个有限整数。有限100项不能保证第101项或一般n。仅k→k+2与n=1只覆盖奇数；命题“n为奇数”就是基例真且跳2可传递、却n=2假的反例。若使用跳2，必须另有偶数基例并证明相应链，或改为逐1传递。`,
        `${first ? 'P(n) is the stated equality. At n=1, both sides are two. For ARBITRARY k≥1, temporarily assume sum k(k+1); the NEXT term is 2(k+1), so the new sum is k(k+1)+2(k+1)=(k+1)(k+2), which is P(k+1). Adding one to the claimed formula preserves its increments but gives base three versus two. The claim sum=2n has a true base but fails at n=2:actual six versus four.' : 'P(n) is the stated equality. At n=1, both sides are three. For ARBITRARY k≥1, assume sum k(5k+1)/2. The NEXT term is 5k+3, so [k(5k+1)+2(5k+3)]/2=(k+1)(5k+6)/2, the required next formula. Adding one preserves increments but gives base four versus three.'} This temporary hypothesis proves only the CONDITIONAL P(k)⇒P(k+1), not the universal claim. A true base and arbitrary step together reach every finite integer. Checking 100 cases leaves 101 and the general case unproved. A k→k+2 step from base one reaches only odd integers; the false universal claim “n is odd” supplies a true base/preserved jump yet fails at two. A jump-two proof needs an even base and its chain too, or a one-step induction.`,
      ),
      [
        t(
          '先写范围和基例，再明确第k+1项；别跳过加这一项。',
          'State the range/base, then write the EXACT next summand rather than skipping it.',
        ),
        t(
          '基例负责启动，任意k传递负责覆盖；有限检查不能代替后者。',
          'The base starts the chain; the arbitrary step covers it. Finite checks cannot replace that step.',
        ),
      ],
    ),
    reasoning(
      id(2),
      t(
        first
          ? '独立模型u(n+1)=3u(n)+2，u(0)=1，n为非负整数。亲算u0…u5，求通项并核初值和任意k递推。若只见前五项、不声明规则，v(n)=u(n)+∏(j=0…4)(n−j)为何能同前缀却不同u5？它还必须服从原递推吗？另二阶w(n+2)=w(n+1)+2w(n)，只给w0=0，分别取w1=1或2列到w4，说明缺什么而非无解。'
          : '独立模型u(n+1)=2u(n)−3，u(0)=5，n≥0整数。亲算u0…u5，求通项并核初值和任意k。仅给前五项但未声明规则时，另v(n)=u(n)+∏(j=0…4)(n−j)怎样改变第六项？解释这不是同一已声明递推的另一个解。另w(n+2)=2w(n+1)−w(n)，只给w0=1，分别令w1=1或3列到w4，说明唯一性条件。',
        first
          ? 'A SEPARATE model has u(n+1)=3u(n)+2,u(0)=1 for nonnegative integer n. Compute u0…u5,derive a closed form,and verify the initial value and ARBITRARY step. If only the first FIVE terms are shown WITHOUT a rule,why does v(n)=u(n)+∏(j=0…4)(n−j) share the prefix but change u5? Must it obey the stated original recurrence? Separately,w(n+2)=w(n+1)+2w(n),w0=0:use w1=1 or2 to list through w4 and explain missing information rather than no solution.'
          : 'A SEPARATE model has u(n+1)=2u(n)−3,u(0)=5 for integer n≥0. Compute u0…u5,derive a closed form and verify the initial value and arbitrary step. Without a declared rule,how does v(n)=u(n)+∏(j=0…4)(n−j) alter the sixth term while sharing five terms? Explain why this is not a second solution of the FULLY specified original recurrence. For w(n+2)=2w(n+1)−w(n),w0=1,use w1=1 or3 through w4 to explain uniqueness conditions.',
      ),
      'extension-2',
      t(
        `${first ? 'u0…u5为1,5,17,53,161,485。令z(n)=u(n)+1，则z(n+1)=3z(n)，z0=2，故u(n)=2·3^n−1；n=0为1，下一项3(2·3^k−1)+2=2·3^(k+1)−1。二阶两种初值给0,1,1,3,5与0,2,2,6,10。' : 'u0…u5为5,7,11,19,35,67。令z(n)=u(n)−3，则z(n+1)=2z(n)，z0=2，故u(n)=2^(n+1)+3；n=0为5，2(2^(k+1)+3)−3=2^(k+2)+3。二阶两初值给1,1,1,1,1与1,3,5,7,9。'} 乘积附加项在n=0…4全为0，n=5为5!=120，所以未声明规则的前缀不唯一决定第六项。v一般不满足已经声明的原递推；给定一阶规则及u0后可逐项唯一确定，不能把“只给前缀”与“给规则及初值”混同。二阶例需第二初值，当前是资料不足且有多解，不是无解。索引从0开始，公式n=0必须先验，任意k核验而不是只算前六项。`,
        `${first ? 'u0…u5 are 1,5,17,53,161,485. Set z(n)=u(n)+1, so z(n+1)=3z(n), z0=2 and u(n)=2·3^n−1. At n=0 it is one; the arbitrary next step is 3(2·3^k−1)+2=2·3^(k+1)−1. The second-order choices give 0,1,1,3,5 and 0,2,2,6,10.' : 'u0…u5 are 5,7,11,19,35,67. Set z(n)=u(n)−3, so z(n+1)=2z(n), z0=2 and u(n)=2^(n+1)+3. At n=0 it is five;2(2^(k+1)+3)−3=2^(k+2)+3 verifies the arbitrary next step. The second-order choices give 1,1,1,1,1 and 1,3,5,7,9.'} The added product vanishes at n=0…4 but is 5!=120 at n=5, so an UNDECLARED rule’s prefix does not determine its next value. v generally DOES NOT satisfy the declared original recurrence. A stated first-order rule with u0 determines successive terms uniquely; that is different information from a prefix alone. The second-order examples need a second seed:the issue is underdetermination with multiple solutions, not no solution. Retain zero-based indexing, check n=0, and verify an arbitrary step rather than six finite cases.`,
      ),
      [
        t(
          '找平移后的等比量，先核n=0，不猜索引。',
          'Find a shifted geometric quantity and check n=0 before guessing the index.',
        ),
        t(
          '前缀与规则是不同资料；二阶缺第二初值可构造两个不同序列。',
          'A prefix and a rule are different data; two second seeds can demonstrate second-order ambiguity.',
        ),
      ],
    ),
    reasoning(
      id(3),
      t(
        first
          ? '按完整有向边表画图，从S到T求最短成本及全部最优简单路，逐轮记录全局最小暂定距离，另判U可达性及T到S是否能倒走。解释非负边权、零边与并列。局部总选下一条最便宜边会怎样？另把C→A的0改为−10，原“确定后不再改”的证明哪一步失效，给真实更短路反例；不要把负边当原模型仍合法。'
          : '按表画有向图，求P到Q最短成本及全部最优简单路，记录暂定距离与并列处理，判Z及Q到P可达性。J/K零权环会不会制造无限多条最优游走？为何题目限定简单路？证明非负前提为何允许确定全局最小暂定点；负边为何破坏该理由？另独立陷阱图P→J:1、P→K:3、J→Q:9、K→Q:1，比较局部贪心与完整最短路。',
        first
          ? 'Draw the COMPLETE directed edge table. From S to T,find the shortest cost and ALL optimal SIMPLE routes,recording globally minimum tentative labels each round. Determine U reachability and whether T→S may reverse arrows. Explain nonnegative weights,zero edges and ties. What does choosing the cheapest NEXT edge do? In a SEPARATE variant replace C→A weight zero by−10:which settled-distance premise fails,and what truly shorter route refutes the old answer? The negative variant is outside the original model.'
          : 'Draw the directed table and find P→Q cost and ALL optimal SIMPLE routes,with tentative labels and ties. Determine Z and Q→P reachability. Does the zero J/K cycle create infinitely many optimal WALKS,and why are simple paths specified? Prove why nonnegative weights justify settling the globally minimum tentative label and why negative weights break the argument. In a SEPARATE trap graph P→J:1,P→K:3,J→Q:9,K→Q:1,compare local-edge choice with the true shortest route.',
      ),
      'extension-3',
      t(
        `${first ? 'S后d(A)=1,d(B)=3,d(C)=2；定A后d(T)=10；定C后d(B)仍3、d(A)仍1；定B后d(T)=4，定T。U为∞。全部最优简单路S→B→T、S→C→B→T，成本各4；T无出边，反向不可达。局部先走S→A成本1再A→T成本9得10，错过4。C→A若变−10，S→C→A→T成本2−10+9=1；A原先按距离1已确定会错，负边模型不能沿用该证明。' : 'P后d(J)=2,d(K)=2,d(Q)=8；并列可任选J/K，随后另一点仍2，Q降5；Z为∞。全部最优简单路P→J→Q、P→K→Q、P→J→K→Q、P→K→J→Q均5。J↔K零环可反复插入而制造无限最优游走，但不再是简单路；Q无出边，反向不可达。独立陷阱图局部P→J→Q为10，P→K→Q为4，说明局部最便宜边不同于全局最小暂定距离。'} 非负权下，经其他未确定点的路径前缀不能低于当前全局最小暂定值，后续非负边不能把它再降低，因此可确定该点；零权也符合非负。负边使最后一句失效，即使某次碰巧正确也不获通用保证。箭头、并列与不可达都依原边表，画出的欧氏长度不是成本。全部路径须枚举/验证，不能只给一条就声称唯一。`,
        `${first ? 'After S:d(A)=1,d(B)=3,d(C)=2. Settling A gives d(T)=10; settling C leaves d(B)=3,d(A)=1; settling B gives d(T)=4, then settle T. U stays∞. ALL optimal SIMPLE routes are S→B→T and S→C→B→T, cost four each. T has no outgoing edge, so the reverse is unreachable. Local choice S→A with cost1 then A→T with cost9 costs ten, missing four. Changing C→A to −10 gives S→C→A→T cost 2−10+9=1:the previously settled A-distance one is wrong and the nonnegative proof cannot be reused.' : 'After P:d(J)=2,d(K)=2,d(Q)=8. Either tied J/K may be settled first, the other remains two, and Q falls to five; Z stays∞. ALL optimal SIMPLE routes are P→J→Q, P→K→Q, P→J→K→Q, P→K→J→Q, cost five each. The zero J↔K cycle can be inserted repeatedly to make infinitely many optimal WALKS, not simple paths. Q has no outgoing edge. In the SEPARATE trap graph, local P→J→Q costs ten but P→K→Q costs four:cheapest next edge differs from globally smallest tentative distance.'} With nonnegative weights, a path prefix through another unsettled point cannot beat the global smallest tentative value; subsequent nonnegative edges cannot lower it, so that point is safe to settle. Zero weights satisfy this premise. Negative edges destroy the last step; one lucky correct run gives no general guarantee. Directions, ties and reachability come from the original edge table, not Euclidean drawn lengths. Verify every claimed path; one optimum does not prove uniqueness.`,
      ),
      [
        t(
          '先列全部出边更新，再从所有未确定点中选暂定最小者。',
          'Relax all outgoing edges, then choose the smallest tentative label among ALL unsettled vertices.',
        ),
        t(
          '相同成本要保多条路；不可达保∞，箭头不能反走。',
          'Retain tied routes, leave unreachable labels at∞ and follow arrow direction.',
        ),
      ],
    ),
    reasoning(
      id(4),
      t(
        '采用列向量。由表中A、B的两列解释两基向量的像，推任意(x, y)的像；求AB、BA及各自作用于给定v，再给(AB)的逆并双向核验。为什么右侧矩阵先作用？用表中P构造两个不同原向量同像，求det并判断可逆性；仅知道T(e1), T(e2)何时足够？若加固定平移(1,2)，能仍用同一2×2线性矩阵表示吗？',
        'Use COLUMN vectors. Interpret the two columns of A/B as basis-vector images and derive a general(x, y) image. Compute AB, BA, their actions on the given v, and an inverse of AB checked BOTH ways. Why does the right-hand matrix act first? For P, give two distinct preimages with one image, its determinant and invertibility. When do two basis images determine the whole map? Can adding a fixed translation(1,2) still be represented by the same 2×2 linear-matrix convention?',
      ),
      'extension-4',
      t(
        `${first ? 'A水平伸长3倍，B顺时针90°。AB=[0,3;−1,0]，BA=[0,1;−3,0]；对v(2,−1)，分别(−3,−2)、(−1,−6)。AB逆=[0,−1;1/3,0]，左右相乘均I，能恢复v。P把(2,5)、(−3,5)同送(0,5)，det 0，无唯一逆；det A=3、det B=1、det(AB)=3。' : 'A水平剪切(x, y)→(x+2y, y)，B关于y轴反射。AB=[−1,2;0,1]，BA=[−1,−2;0,1]；对v(1,3)分别(5,3)、(−7,3)。AB的逆是其自身，平方I可恢复v；det A=1、det B=−1、det(AB)=−1。P把(1,2)、(3,0)同送(3,0)，det 0，无唯一逆。'} 对线性T，(x, y)=x e1+y e2，保加法/数乘给T(x, y)=xT(e1)+yT(e2)，所以两像按列放；此处依赖线性，不是只凭两个试点猜全函数。ABv=A(Bv)，先B再A；一般不交换，逆按B⁻¹A⁻¹。P的列相关、面积坍缩，存在不同原像才反驳唯一逆。加平移后原点像(1,2)≠0，是仿射而非本坐标约定下的2×2线性变换。`,
        `${first ? 'A stretches horizontally by three; B rotates clockwise 90°. AB=[0,3;−1,0], BA=[0,1;−3,0]. On v=(2,−1), they give(−3,−2) and(−1,−6). The inverse of AB is[0,−1;1/3,0]; both products are I and recover v. P sends(2,5) and(−3,5) to(0,5), det zero, no unique inverse. det A=3,det B=1,det(AB)=3.' : 'A shears(x, y)→(x+2y, y); B reflects across the y-axis. AB=[−1,2;0,1], BA=[−1,−2;0,1]; on v=(1,3), images are(5,3) and(−7,3). AB is its own inverse and squares to I, recovering v. det A=1,det B=−1,det(AB)=−1. P sends(1,2) and(3,0) to(3,0), det zero, no unique inverse.'} For LINEAR T,(x, y)=x e1+y e2 and preservation of addition/scaling imply T(x, y)=xT(e1)+yT(e2), so the images are COLUMNS. Linearity is essential; two probes do not identify an arbitrary function. ABv=A(Bv), right side first; order need not commute, and undoing uses B⁻¹A⁻¹. P has dependent columns/area collapse and distinct preimages, refuting unique invertibility. Adding translation(1,2) sends zero to a nonzero point, an AFFINE map rather than a2×2 linear map in this convention.`,
      ),
      [
        t(
          '先写每一列对应哪根基向量，再以任意x、y线性组合。',
          'Identify each basis image by COLUMN, then use an arbitrary linear combination.',
        ),
        t(
          'AB先算Bv；逆必须乘回两侧为I，压缩先找不同同像点。',
          'For AB compute Bv first; check the inverse on BOTH sides and find collapsed distinct preimages.',
        ),
      ],
    ),
    reasoning(
      id(5),
      t(
        `给f(x)=${first ? 'x²−3' : 'x³−2'}与[1,2]。亲做前三次二分，记录“本次试点、符号、保留区间”；第三次试点是当前更新后中点吗？求该新中点、绝对根位置误差上界及其残差。保持的存在性条件是什么？另1/(x−1)在[0,2]异号、(x−1)²在[0,2]同号、${first ? 'x²−4在[2,3]端点为根' : 'x−1在[1,2]端点为根'}分别怎样处理？把f乘${first ? '1/1000' : '1/100'}能把残差直接当横向误差吗？${first ? '原f的负根是否也被这个正区间找到' : 'h=x(x−1)(x+1)在[−2,2]命中0，能据此说全部根只有0吗'}？`,
        `For f(x)=${first ? 'x²−3' : 'x³−2'} on[1,2], perform THREE bisection trials, recording tested midpoint, sign and RETAINED bracket. Is the third trial the CURRENT updated midpoint? Find that new midpoint, an absolute root-position bound and its residual. What existence invariant is retained? Contrast 1/(x−1) on[0,2] with opposite signs,(x−1)² on[0,2] with same signs, and ${first ? 'x²−4 on[2,3] with an endpoint root' : 'x−1 on[1,2] with an endpoint root'}. If f is scaled by ${first ? '1/1000' : '1/100'}, is the residual a horizontal error? ${first ? 'Does this positive bracket find the original f’s negative root too' : 'If h=x(x−1)(x+1) hits zero on[−2,2], does that prove its whole root set is just zero'}?`,
      ),
      'extension-5',
      t(
        `${first ? '试3/2，f=−3/4，保[3/2,2]；试7/4，f=1/16，保[3/2,7/4]；试13/8，f=−23/64，保[13/8,7/4]。当前中点27/16，不是第三试点13/8；宽1/8，根误差≤1/16，f(27/16)=−39/256，残差39/256。负根−√3不在此正区间中。端点例x=2已精确命中，立即停。' : '试3/2，f=11/8，保[1,3/2]；试5/4，f=−3/64，保[5/4,3/2]；试11/8，f=307/512，保[5/4,11/8]。当前中点21/16而非第三试点11/8；宽1/8，根误差≤1/16，f(21/16)=1069/4096，残差1069/4096。比较h有−1,0,1三根，命中0不排其余。端点例x=1精确命中应停。'} 多项式连续且初始异号，中间值定理保根存在；每轮留连续异号半区间或精确端点根，宽至多初宽/2^n，当前中点误差≤半宽。1/(x−1)中点无定义且不连续，异号不能保根；(x−1)²虽有根1但端点同号，判据不适用不等于无根。端点或中点精确为0时停止，不强制做满三轮。正因子缩放不改根位置/包围宽，却任意缩小纵向残差；无额外导数下界等条件不能将残差当横向误差。多个根时二分仅对保留根作保证，不能宣称全域完备。`,
        `${first ? 'Trial 3/2 has f=−3/4, retain[3/2,2]. Trial 7/4 has f=1/16, retain[3/2,7/4]. Trial 13/8 has f=−23/64, retain[13/8,7/4]. The CURRENT midpoint is 27/16, not the third trial 13/8; width 1/8 gives root error≤1/16. f(27/16)=−39/256, residual 39/256. The negative root −√3 is outside this bracket. In the endpoint example, x=2 is an exact root:stop.' : 'Trial 3/2 has f=11/8, retain[1,3/2]. Trial 5/4 has f=−3/64, retain[5/4,3/2]. Trial 11/8 has f=307/512, retain[5/4,11/8]. The CURRENT midpoint is 21/16, not the third trial 11/8; width 1/8 gives root error≤1/16. f(21/16)=1069/4096, residual 1069/4096. The comparison h has roots −1,0,1; hitting zero does not exclude the others. In the endpoint example, x=1 is exact:stop.'} The polynomial is continuous with initially opposite signs, so the intermediate-value theorem guarantees a root. Each step retains a continuous sign-changing bracket or an exact endpoint root. Width is at most initial width/2^n and current-midpoint error at most half-width.1/(x−1) is undefined/discontinuous at the middle, so its endpoint signs do not ensure a root. The even-root(x−1)² has root one despite equal endpoint signs; an inapplicable criterion does not mean no root. Stop on exact endpoint/midpoint zeros rather than forcing three iterations. Positive scaling preserves roots/bracket widths but can shrink VERTICAL residuals arbitrarily. Without additional conditions such as a derivative lower bound, residual is not horizontal error. Bisection protects a retained root, not an exhaustive all-real root set.`,
      ),
      [
        t(
          '每试一次先更新区间，再另算“当前中点”；两者有时间先后。',
          'Update the bracket AFTER each trial, then compute the NEW midpoint; these are different stages.',
        ),
        t(
          '误差界来自包围根的宽度，不是图像像素或f值。',
          'The error bound comes from a bracket KNOWN to contain a root, not pixels or f values.',
        ),
      ],
    ),
  ];
  questions[2]!.contextTable = graphTable;
  questions[3]!.contextTable = matrixTable;
  questions[4]!.diagram = numericPlot;
  return {
    id: `${unit}-MAINT-EXTENSION`,
    unit,
    title: t(
      first ? '重建归纳、递推与算法的条件' : '换例检验拓展方法的边界',
      first
        ? 'Rebuild the premises of induction, recurrences and algorithms'
        : 'Test extension methods against changed examples',
    ),
    bridge: 'H37-L01',
    bridgeByQuestion: Object.fromEntries(
      questions.map((q, i) => [q.id, `H37-L0${i + 1}`]),
    ),
    intro: t(
      '本组承接H37，放到终章之后的另一次学习时段；可一次做一个小问，不计时、不锁课。先纸上生成证明、路径、矩阵或区间，再解释。整题全部核齐后家长确认；数字均为教学给定，不是用户试用表现。',
      'Revisit H37 in another sitting after the capstone; one subpart at a time, without a timer or lesson locks. Generate proofs, routes, matrices or brackets on paper before explaining. Confirm only after EVERY part is reviewed. Numbers are teaching givens, not user trial performance.',
    ),
    questions,
  };
};
export const postRouteExtensionRetrieval = {
  R01_EXTENSION: makeSet('R01'),
  R02_EXTENSION: makeSet('R02'),
};
