import { t, type Question, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H36' | 'H38') => {
  const first = unit === 'H36',
    id = (i: number) => `${unit}-MAINT-ADVANCED-EQUATION-Q${i}`;
  const a = first ? 2 : 1;
  const sourcePlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: { xMin: -3, xMax: 3, yMin: -1, yMax: 9, xStep: 1, yStep: 1 },
    points: [
      { x: 2, y: 4, label: 'P' },
      { x: -2, y: 4, label: 'Q' },
    ],
    curves: [
      {
        name: 'SOURCE f(u)=u², not the transformed graph',
        color: '#5850a1',
        points: Array.from({ length: 81 }, (_, i) => {
          const x = -3 + (6 * i) / 80;
          return { x, y: x * x };
        }),
      },
    ],
    xLabel: 'source u',
    yLabel: 'f(u)',
    caption: t(
      '这里只给源函数f(u)=u²的有限图窗及源点P(2,4)、Q(−2,4)；源域R。需要自己生成变换后的图与点，未画出目标答案。曲线是近似显示，点坐标是给定的精确值。',
      'Only the SOURCE f(u)=u² in a finite window and exact source points P(2,4), Q(−2,4) are given; the source domain is R. Generate the transformed graph and points yourself; target answers are not drawn. The curve is approximate; the stated point coordinates are exact.',
    ),
  };
  const questions: Question[] = [
    reasoning(
      id(1),
      t(
        `设f₊(u)=u²但只收u≥${a}，另f₋(u)=u²只收u≤−${a}；g(x)=${first ? 'x−1' : 'x+2'}。分别给H₊=f₊∘g与H₋=f₋∘g的原定义域、值域及反函数（含反函数输入域），并双向验回。为什么不能把化简后的平方多项式在x=${first ? '2' : '−2'}的数值当H₊值？若不限制平方的域为何无反函数？说明逆复合的先后、分支符号、反函数与倒数的差别；a改0时交界端点如何处理？`,
        `Let f₊(u)=u² accept ONLY u≥${a}, while f₋(u)=u² accepts ONLY u≤−${a}; g(x)=${first ? 'x−1' : 'x+2'}. For H₊=f₊∘g and H₋=f₋∘g, give ORIGINAL domains, ranges and inverse functions with inverse-input domains; check both compositions. Why is the simplified square polynomial’s value at x=${first ? '2' : '−2'} not an H₊ value? Why is the unrestricted square not invertible? Explain reverse composition order, branch signs, inverse versus reciprocal, and endpoints if a becomes zero.`,
      ),
      'advanced-equation-1',
      t(
        `${first ? 'H₊域[3,∞)，H₋域(−∞,−1]，两值域[4,∞)。反函数分别H₊⁻¹(y)=1+√y、H₋⁻¹(y)=1−√y，均只收y≥4。x=2内值1<2，故H₊未定义，即使多项式值1。' : 'H₊域[−1,∞)，H₋域(−∞,−3]，两值域[1,∞)。反函数分别H₊⁻¹(y)=−2+√y、H₋⁻¹(y)=−2−√y，均只收y≥1。x=−2内值0<1，故H₊未定义，即使多项式值0。'} 一般先要求x−c≥a或x−c≤−a，平方在各支严格单调，故对应一对一；y≥a²时±√y落在正确支。H(H⁻¹(y))=(±√y)²=y；逆向√((x−c)²)=|x−c|，按原域选符号才恢复x。先撤平方分支再撤平移，H⁻¹=g⁻¹∘f⁻¹。全R平方使c+u和c−u（u>0）同像，交换得到两支关系而不是单值反函数；1/H(x)只是输出倒数，未撤销输入映射。a=0时两支均含u=0，对应x=c、y=0；各自逆仍单值且含端点，合并两支才失去全域一对一。`,
        `${first ? 'H₊ domain[3,∞), H₋ domain(−∞,−1]; both ranges[4,∞). Inverses H₊⁻¹(y)=1+√y and H₋⁻¹(y)=1−√y both require y≥4. At x=2, the inner value 1<2, so H₊ is undefined although the polynomial gives one.' : 'H₊ domain[−1,∞), H₋ domain(−∞,−3]; both ranges[1,∞). Inverses H₊⁻¹(y)=−2+√y and H₋⁻¹(y)=−2−√y both require y≥1. At x=−2, the inner value 0<1, so H₊ is undefined although the polynomial gives zero.'} In general require x−c≥a or x−c≤−a BEFORE squaring. Squaring is strictly monotone on each branch, so one-to-one. For y≥a², the chosen ±√y is in its branch. H(H⁻¹(y))=(±√y)²=y; in the other direction √((x−c)²)=|x−c| needs the original branch sign to recover x. Undo the square branch then the shift:H⁻¹=g⁻¹∘f⁻¹. Unrestricted squaring maps c+u and c−u to the same value for u>0; swapping gives a two-branch RELATION, not a single-valued inverse. 1/H(x) reciprocates the output rather than undoing the map. If a=0, both branches include u=0, x=c, y=0; each inverse still has its endpoint and is single-valued, but merging the branches loses one-to-one behaviour.`,
      ),
      [
        t(
          '先给中间值u=x−c设门槛，再平方；先前输入限制不能丢。',
          'Put the restriction on the intermediate u=x−c before squaring; retain it after simplification.',
        ),
        t(
          '逆向先按原分支选√y的正负，再撤平移。',
          'Choose the root sign from the original branch, then undo the shift.',
        ),
      ],
    ),
    reasoning(
      id(2),
      t(
        `解log_(1/2)(x−${first ? 2 : 3})+log_(1/2)(x+${first ? 2 : 3})=${first ? '−5' : '−4'}，列原域、所有代数候选、逐项去留和完整解集。另解${first ? '(1/2)^(2x−1)=(1/2)^(x+2)' : '(1/2)^(3x+1)=(1/2)^(x−3)'}，再将等号改为${first ? '≤' : '≥'}求完整不等式解集。为何递减不妨碍等式比较指数、却改变不等号方向？底改1、0、负数时各能保留哪些结论，log底1有定义吗？`,
        `Solve log_(1/2)(x−${first ? 2 : 3})+log_(1/2)(x+${first ? 2 : 3})=${first ? '−5' : '−4'}, stating original domain, ALL algebraic candidates, validation and full solution set. Separately solve ${first ? '(1/2)^(2x−1)=(1/2)^(x+2)' : '(1/2)^(3x+1)=(1/2)^(x−3)'}, then replace equality with ${first ? '≤' : '≥'} and solve the inequality. Why does decreasing behaviour preserve exponent equality but reverse an inequality? What changes at bases one, zero or negative values, and is log base one defined?`,
      ),
      'advanced-equation-2',
      t(
        `${first ? '原域x>2；合并后x²−4=(1/2)^(−5)=32，候选−6、6。−6使两对数真数负，舍去；6给真数4和8，log_(1/2)4=−2、log_(1/2)8=−3，和−5，完整解{6}。指数等式2x−1=x+2给{3}；≤对应2x−1≥x+2，故[3,∞)。' : '原域x>3；合并后x²−9=(1/2)^(−4)=16，候选−5、5。−5使两真数负，舍去；5给真数2和8，对数−1、−3和−4，完整解{5}。指数等式3x+1=x−3给{−2}；≥对应3x+1≤x−3，故(−∞,−2]。'} 合并是原域内等价，乘积为正不保证各因子为正；负候选虽满足乘积式仍不是原式解。合法指数底b>0且b≠1时严格单调从而一对一；0<b<1时递减，等式仍u=v，不等式反向。b=1时本题任意实指数两侧均1，等式全R，改后的非严格不等式也全R，但不能再由相等推出指数相等；对数底1无逆。b≤0不属于本题全实指数函数模型，不能把整数幂局部合法当全实域合法。`,
        `${first ? 'Original domain x>2. Combining there gives x²−4=(1/2)^(−5)=32, candidates −6,6. At−6 both log arguments are negative:reject. At six the arguments four/eight give logs −2/−3, total −5, so the complete set is{6}. Exponent equality 2x−1=x+2 gives{3};≤ means 2x−1≥x+2, so[3,∞).' : 'Original domain x>3. Combining there gives x²−9=(1/2)^(−4)=16, candidates −5,5. At−5 both log arguments are negative:reject. At five the arguments two/eight give logs −1/−3, total −4, so the complete set is{5}. Exponent equality 3x+1=x−3 gives{−2};≥ means 3x+1≤x−3, so(−∞,−2].'} Combining is equivalent only on the ORIGINAL domain; a positive product does not ensure positive individual arguments. Negative candidates satisfy the product equation but not the original one. For b>0, b≠1, the exponential is strictly monotone and one-to-one. A base between zero and one decreases:equal outputs still give equal exponents, but inequalities reverse. At b=1, both sides are one for every real x; these equalities AND the non-strict inequalities hold on all R, but exponent equality no longer follows. Log base one has no inverse. Nonpositive bases are outside this all-real-exponent model; some legal integer powers do not create an all-real domain.`,
      ),
      [
        t(
          '两项对数的真数必须分别正；先写原域。',
          'Each original logarithm needs its OWN positive argument; write the domain first.',
        ),
        t(
          '等式用一对一，不等式用单调方向；把合法候选代回两项。',
          'Use injectivity for equality and monotonic direction for inequalities; substitute into BOTH original logs.',
        ),
      ],
    ),
    reasoning(
      id(3),
      t(
        first
          ? 'θ为实弧度。审查cos²θ/(1+sinθ)=1−sinθ：从sin²θ+cos²θ=1给合法分解与约分，列全部原域排除角。孔处化简式值是多少，原式能算这个值吗？有人试图把分子、分母各减1来“约掉”，或以几个角/有限图窗吻合证明恒等，怎样反驳？'
          : 'θ为实弧度；给定cos 2θ=1−2sin²θ。审查(1−cos 2θ)/sinθ=2sinθ：先代给定式再因式约分，列完整原域排除角。孔处化简式值是多少，原式能算这个值吗？为何不能直接约去加减项，或把几个角/有限图窗吻合当全域恒等证明？',
        first
          ? 'For real radian θ, audit cos²θ/(1+sinθ)=1−sinθ. Factor using sin²θ+cos²θ=1 before legal cancellation; list ALL excluded angles. What value does the simplified extension have at a hole, and is that an original value? Refute subtracting one from numerator and denominator to cancel, and using a few matching angles or a finite plot as proof of an identity.'
          : 'For real radian θ, you are GIVEN cos 2θ=1−2sin²θ. Audit (1−cos 2θ)/sinθ=2sinθ by substitution then factor cancellation. List ALL excluded angles and the extension value there. Can the original take that value at a hole? Explain why cancelling additive terms or matching a few angles/a finite plot does not prove an all-domain identity.',
      ),
      'advanced-equation-3',
      t(
        `${first ? '令s=sinθ、c=cosθ，c²=1−s²=(1−s)(1+s)。原域1+s≠0；才能约得1−s。sinθ=−1的全部角为θ=−π/2+2kπ，k∈Z，均排除；延拓式在此为2，原式仍0/0未定义。' : '令s=sinθ，给定二倍角式使1−cos 2θ=2s²=2s·s。原域s≠0；才能约得2s。全部排除θ=kπ，k∈Z；延拓式在此为0，原式仍0/0未定义。'} 等式是在共同原域的全体角上成立，扩大定义域得到的是另一个延拓函数。约分是同除一个非零公共因子，不是从两侧各减某个数或约掉加减项。有限试角可发现反例，不能证明所有角；这里先给符号因式恒等式，再保非零条件才是证明。周期排除式覆盖所有整数k，不能仅列图窗中的孔。`,
        `${first ? 'Write s=sinθ, c=cosθ. Then c²=1−s²=(1−s)(1+s). The original domain requires 1+s≠0; ONLY there cancel to 1−s. All sinθ=−1 angles θ=−π/2+2kπ, k∈Z, are excluded. The extension equals two there; the original remains undefined 0/0.' : 'Write s=sinθ. The given double-angle identity gives 1−cos 2θ=2s²=2s·s. The original domain requires s≠0; ONLY there cancel to 2s. ALL θ=kπ, k∈Z, are excluded. The extension equals zero there; the original remains undefined 0/0.'} The identity holds for EVERY angle in the common ORIGINAL domain; extending that domain defines a different function. Cancellation divides a shared NONZERO FACTOR, not subtracts a number from numerator/denominator or cancels additive terms. Finite angles can refute a claim but cannot prove it for all angles. The symbolic factor identity with its nonzero premise is the proof. Integer-period exclusions include all holes, not merely those visible in a window.`,
      ),
      [
        t(
          '先把分子写成含分母的乘积，保留分母不为0。',
          'Factor the numerator to contain the denominator, retaining its nonzero condition.',
        ),
        t(
          '用完整周期族列孔；把延拓值与原式值分开。',
          'List holes as full periodic families; separate extension values from original values.',
        ),
      ],
    ),
    reasoning(
      id(4),
      t(
        `图给源f(u)=u²、源点P/Q。令G(x)=${first ? '−2 f(−2(x−1))+3' : '3 f((−1/2)(x+2))−4'}。从u=b(x−h)推所有点映射，亲算P/Q目标坐标、水平长度倍率、反射、平移和G的多项式，画在纸上。只把b换相反数，点的身份及最终图集各怎样？再分别讨论f域R时a=0/b=0；若改为f(u)=1/u，b=0甚至a=0能恢复原本未定义的输入吗？给一般原域表达式，不借化简补孔。`,
        `The graph gives SOURCE f(u)=u² and P/Q. Let G(x)=${first ? '−2 f(−2(x−1))+3' : '3 f((−1/2)(x+2))−4'}. Derive the point map from u=b(x−h). Compute target coordinates of P/Q, horizontal length factor, reflections, shifts and the polynomial for G; sketch on paper. If only the sign of b changes, what happens to point identities and the final graph SET? Discuss a=0/b=0 for source domain R. If instead f(u)=1/u, can b=0, or even a=0, restore undefined inner inputs? Give the general original domain and retain holes after simplification.`,
      ),
      'advanced-equation-4',
      t(
        `${first ? 'a=−2, b=−2, h=1, k=3；点(u, v)→(1−u/2,−2v+3)，P→(0,−5)、Q→(2,−5)；水平倍率1/2且输入反射，纵反射并拉长2倍，再平移。G(x)=−8(x−1)²+3。' : 'a=3, b=−1/2, h=−2, k=−4；点(u, v)→(−2−2u,3v−4)，P→(−6,8)、Q→(2,8)；水平倍率2且输入反射，纵拉长3倍、无纵反射，再平移。G(x)=3/4(x+2)²−4。'} 一般b≠0有x=h+u/b，输出av+k，水平倍率1/|b|不是|b|。把b反号会互换此处P/Q目标，逐点输入反射确实发生；因为源f偶对称，整体图集却重合，外观不能唯一反推参数。f=u²域R，b=0时内值恒0、G=k，u=0对应所有x而其他u无对应；a=0也恒k。一般原域D_G={x∈R:b(x−h)∈D_f}，即使a=0也先核此条件。若f=1/u且b=0，则内值0全不合法，D_G为空，a=0也不能把0·未定义当0；b≠0时域R排h，a=0只在这个穿孔域恒k，不自动填x=h。`,
        `${first ? 'a=−2, b=−2, h=1, k=3. Map(u, v)→(1−u/2,−2v+3):P→(0,−5), Q→(2,−5). Horizontal factor 1/2 with input reflection; vertical reflection and factor two, then shifts. G(x)=−8(x−1)²+3.' : 'a=3, b=−1/2, h=−2, k=−4. Map(u, v)→(−2−2u,3v−4):P→(−6,8), Q→(2,8). Horizontal factor two with input reflection; vertical factor three without reflection, then shifts. G(x)=3/4(x+2)²−4.'} For b≠0, x=h+u/b and output av+k, horizontal length factor 1/|b|, not|b|. Reversing b exchanges these P/Q targets:the input reflection really occurs pointwise, but EVEN f makes the final graph sets coincide. Appearance alone does not identify every parameter. For f=u² on R, b=0 makes inner input zero and G=k; u=0 corresponds to every x, other u to none. a=0 also gives k. IN GENERAL the original domain is D_G={x∈R:b(x−h)∈D_f}; check it even at a=0. For f=1/u, b=0 makes every inner input invalid, so D_G is empty even if a=0; zero times undefined is not zero. For b≠0, the domain excludes h, and a=0 gives k ONLY on that punctured domain, without filling x=h.`,
      ),
      [
        t(
          '先解u=b(x−h)求x，再变纵值，别把b直接当水平倍率。',
          'Solve u=b(x−h) for x before changing the vertical value; do not use |b| as the horizontal factor.',
        ),
        t(
          '图集重合不等于每个源点没移动；先验内值合法，再谈a=0。',
          'Coincident graph sets do not mean unchanged point identities; validate the inner input before using a=0.',
        ),
      ],
    ),
    reasoning(
      id(5),
      t(
        `分开审查四式：①${first ? '√(x+6)=x' : '√(2x+3)=x'}；②${first ? '(x²−9)/(x−3)=6' : '(x²−16)/(x−4)=8'}；③${first ? 'x(x+4)=0' : 'x(2x−3)=0'}；④${first ? '|x−2|=3' : '|2x+1|=3'}。每式列原域、变形方向、所有候选、原式两侧及完整解集，并解释为什么未漏解。哪些候选是域内增根，哪些在原域外？为何除以x会丢根，合法空集与“没找到”不同？当前图窗或有限数值采样能认证完整性吗？`,
        `Audit FOUR separate equations:(1)${first ? '√(x+6)=x' : '√(2x+3)=x'};(2)${first ? '(x²−9)/(x−3)=6' : '(x²−16)/(x−4)=8'};(3)${first ? 'x(x+4)=0' : 'x(2x−3)=0'};(4)${first ? '|x−2|=3' : '|2x+1|=3'}. For each, state the original domain, transformation direction, ALL candidates, original sides and full solution set; justify completeness. Which rejected candidate is inside the domain but extraneous, and which is outside? Why can division by x lose a root? Distinguish a proved empty set from failing to find a root, and explain why finite windows/samples do not certify completeness.`,
      ),
      'advanced-equation-5',
      t(
        `${first ? '①域[−6,∞)，还需右侧x≥0；原解平方必在x²−x−6=(x−3)(x+2)=0候选{−2,3}中。−2域内但左2右−2失败，3左3右3，故{3}。②原域R排3，合法域约得x+3=6的唯一候选3却在域外，原式不能取值，故∅。③域R，零乘积给{−4,0}，代回两侧均0；若除x会丢0。④域R，两支x−2=3或−3给{−1,5}，代回绝对值均3。' : '①域[−3/2,∞)，还需右侧x≥0；原解平方必在x²−2x−3=(x−3)(x+1)=0候选{−1,3}中。−1域内但左1右−1失败，3左3右3，故{3}。②原域R排4，合法域约得x+4=8的唯一候选4却在域外，原式不能取值，故∅。③域R，零乘积给{0,3/2}，代回两侧均0；若除x会丢0。④域R，两支2x+1=3或−3给{−2,1}，代回绝对值均3。'} ①平方只先保证原解包含于候选集，再用原域与符号、原式回代取等价解。②非零分母处因式约分等价，所有候选均不合法才证明无解。③零乘积穷尽任一因子为0，不假设x非零。④|u|=3等价u=±3，两支齐全。代回只筛已列候选，不自动证明候选齐全；完整性来自前述包含/等价推导。有限图窗可能漏远处或近切交点，不替代证明。`,
        `${first ? '(1)Domain[−6,∞), with x≥0 also required by the nonnegative square root. Squaring puts every original solution among roots of x²−x−6=(x−3)(x+2), candidates{−2,3}. At−2 the original sides are 2 and −2, so reject despite domain membership; at 3 both sides are three, so{3}. (2)Original domain excludes three. Legal cancellation gives x+3=6; its only candidate three is outside the domain, so the original has no value there and the solution set is∅. (3)On R, zero product gives{−4,0}, both with sides zero; dividing by x loses zero. (4)On R, x−2=±3 gives{−1,5}; each original absolute value is three.' : '(1)Domain[−3/2,∞), with x≥0 required by the nonnegative square root. Squaring puts every original solution among roots of x²−2x−3=(x−3)(x+1), candidates{−1,3}. At−1 the original sides are 1 and −1, so reject despite domain membership; at 3 both sides are three, so{3}. (2)Original domain excludes four. Legal cancellation gives x+4=8; its only candidate four is outside the domain, so the original has no value there and the solution set is∅. (3)On R, zero product gives{0,3/2}, both with sides zero; dividing by x loses zero. (4)On R,2x+1=±3 gives{−2,1}; each original absolute value is three.'} Squaring first gives candidate INCLUSION; original domain, sign and substitution then filter it. Rational cancellation is equivalent only at nonzero denominators; rejecting every exhaustive candidate proves emptiness. A zero product exhausts either factor being zero without assuming x≠0. |u|=3 is equivalent to BOTH u=±3 branches. Back-substitution checks candidates, but does not by itself prove their list exhaustive; the preceding inclusions/equivalences do. Finite windows may miss distant or near-tangent intersections and do not replace this proof.`,
      ),
      [
        t(
          '先写每式原域，平方前另核右侧符号；零乘积先分支。',
          'Write original domains and the radical equation’s right-side sign; split zero-product branches before division.',
        ),
        t(
          '先证明候选集包含全部原解，再逐一回原式过滤。',
          'Prove that candidates include EVERY original solution, then filter by the original equation.',
        ),
      ],
    ),
  ];
  questions[3]!.diagram = sourcePlot;
  return {
    id: `${unit}-MAINT-ADVANCED-EQUATION`,
    unit,
    title: t(
      '轨迹与项目之后，保留函数的原始条件',
      'After loci and projects, retain original function conditions',
    ),
    bridge: 'H35-L01',
    bridgeByQuestion: Object.fromEntries(
      questions.map((q, i) => [q.id, `H35-L0${i + 1}`]),
    ),
    intro: t(
      '五题各自独立，可分多次，每次一个小问。先在纸上列域、候选或画图，再讲理由；全部小问核齐后才确认整题。源图不是待求图，有限试值不代替完整性证明。',
      'Five independent tasks can span several sittings, one subpart at a time. List domains/candidates or sketch on paper before explaining; confirm a whole task only after EVERY part is reviewed. A source plot is not the requested image, and finite trials do not replace completeness proofs.',
    ),
    questions,
  };
};
export const advancedEquationRecurrenceRetrieval = {
  H36_ADVANCED_EQUATION: makeSet('H36'),
  H38_ADVANCED_EQUATION: makeSet('H38'),
};
