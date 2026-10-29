import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H25' | 'H26') => {
  const near = unit === 'H25',
    id = (n: number) => `${unit}-MAINT-FUNCTION-CONCEPT-MEANING-Q${n}`;
  const skills = [
    'function-linked-representations',
    'function-domain-properties',
    'function-point-transform',
    'function-inverse-correspondence',
    'function-piecewise-boundaries',
  ];
  const card = (n: number, z: string, en: string, rz: string, re: string) =>
    reasoning(id(n), t(z, en), skills[n - 1]!, t(rz, re), [
      t(
        '先标原函数、允许输入与所问对象。函数值、全部原像、完整集合和一个例子是不同任务；证明保全称范围，反例须合域。',
        'Identify the original function, allowed inputs and requested object. A value, all preimages, a complete set and one example are different tasks. Retain universal domains in proofs and admissibility in counterexamples.',
      ),
      t(
        '一次一个编号/独立案例，可分次不计时，允许纸笔、口述或熟悉语言。读题帮助与数学提示分开；自主模型接受不同合法结果，完整理由人审。纸上参数不受源滑块限制；回看源模型按源自己的条件，不代填家庭记录。',
        'One numbered part/separate case per untimed sitting; paper, oral work or a familiar language is welcome. Separate reading help from maths hints. Accept different valid own models after human review. Paper parameters need not fit source sliders; use the source model’s own premises when revisiting, without substituted household records.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '给定纸上函数与独立案例；不是实际观测',
        'Stipulated paper functions and separate cases, not actual observations',
      ),
      columns: [
        t('编号', 'ID'),
        t('案例', 'Case'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const lo = near ? -1 : -2,
    hi = near ? 2 : 1,
    offset = near ? 1 : 2,
    inputs = near ? '-1,0,1,2' : '-2,-1,0,1',
    query = near ? '3/2' : '-3/2',
    target = near ? 0 : 2;
  const q1 = card(
    1,
    '① C/D只改变给定域，公式相同。分别列完整实际值域、说明连续值域每个值为何可达，有限域为什么用花括号而非整段区间？求C的f(X)，用整负数括号写计算、同一行数表与有序点；f(X)是函数输出、f乘X，还是图上第X个点？求D在同一X的状态，能因公式可算就补入吗？② 分别找C/D全部满足f(x)=Y的输入，列所有数学候选再筛原域；与只求f(X)有什么不同？画连续曲线和离散点，交换两坐标会保持原来的输入/输出身份吗？同一C域上H(x)=0是函数吗、像集是什么，所有输入同像会违反哪条定义吗？只改表示视图或图窗能改这些函数的值/域吗？③ 自主选整数r、非零有理数a及有理数b，定义f(x)=ax+b先只在{r,r+1,r+2}：写规则语言、三行表、三个未连接的点与完整像集。再明确将域改成[r,r+2]，画线并给完整像集及可达性理由。自主参数不同也可，不能用未声明的连线悄改原函数。④ M是独立根式函数，先求按式有意义的最大实定义域，解释零根号边界；再与另给区间E取交，不能用自然域替换给定限制。继续使用原有两观测非唯一、完整水量图与函数资格任务。',
    '① C/D change ONLY the stipulated domain, retaining the formula. Give each COMPLETE actual range, explaining attainability of EVERY interval value and braces versus intervals. Evaluate C at X with brackets around negative inputs; give the SAME table row and ordered point. Is f(X) an output, f times X, or the Xth graph point? Classify D at the SAME X: does computability admit it? ② Find ALL inputs satisfying f(x)=Y for C and D, listing all algebraic candidates before domain filtering. Distinguish this from evaluating f(X). Draw the continuous curve and unjoined discrete points. Does coordinate swapping preserve input/output identities? Is H(x)=0 on C’s SAME domain a function,and what is its image? Does a single shared output violate the function definition? Can a display-view/window change alter these functions’ values/domains? ③ CHOOSE integer r, nonzero rational a and rational b. Define f(x)=ax+b FIRST on {r,r+1,r+2}; give a verbal rule, three rows, three unjoined points and complete image. Explicitly CHANGE the domain to [r,r+2], draw the line, give its full image and justify attainability. Accept different parameters; an undeclared joining must not silently change the original function. ④ M is a SEPARATE radical function. Find its maximal natural real domain,explain the zero-radicand boundary,then intersect the separately stipulated interval E. A natural domain must not replace the given restriction. Retain existing observation,water-rule and function-status tasks.',
    `C公式x²−${offset}，域[${lo},${hi}]，像[−${offset},${near ? 3 : 2}]；任意像内y取${near ? 'x=√(y+1)∈[0,2]' : 'x=−√(y+2)∈[−2,0]'}均可达，最小在输入0处而非仅查端点。D像${near ? '{−1,0,3}' : '{−2,−1,2}'}，四个整数输入不生成整段。X=${query}时平方9/4，C输出${near ? '5/4' : '1/4'}，同一行/点(${query},${near ? '5/4' : '1/4'})；负输入须整体平方。f(X)是输出，不是乘法或点序号；D排X为域外，不是规则未知。Y=${target}时数学候选${near ? '−1,1' : '−2,2'}，C/D均只保${near ? '{−1,1}' : '{−2}'}；${near ? '两根皆在域' : '正2虽满足公式却域外'}。交换坐标改变角色，不能冒充原点。H为函数，每个允许输入恰一输出0，像{0}，不要求不同输入有不同输出；图窗/表示不改数学函数。自主例${near ? 'r=0,a=1/2,b=−1：输入0,1,2到−1,−1/2,0；连续像[−1,0]' : 'r=−1,a=−1/2,b=2：输入−1,0,1到5/2,2,3/2；连续像[3/2,5/2]'}。一般连续像为两端ar+b与a(r+2)+b之间闭区间，任意像内y有x=(y−b)/a落原区间，有限像只三值；须先宣布域改变才连线。任何合条件自主方案均可。M根号内非负给${near ? '3/2−2x≥0，即x≤3/4' : '5/3−2x/3≥0，即x≤5/2'}，边界根号0合法；最大自然域为该左射线，另交E得${near ? '[−1,3/4]' : '[−2,5/2]'}。`,
    `C has rule x²−${offset},domain[${lo},${hi}],image[−${offset},${near ? 3 : 2}]. Every image y is attained at ${near ? 'x=√(y+1)∈[0,2]' : 'x=−√(y+2)∈[−2,0]'},so endpoint checks alone miss the interior minimum zero of the square. D’s image is ${near ? '{−1,0,3}' : '{−2,−1,2}'},not an interval from four integer inputs. At X=${query},square9/4 gives C output${near ? '5/4' : '1/4'} and ordered point(${query},${near ? '5/4' : '1/4'}). Square the ENTIRE negative input. f(X) is an output,not multiplication or point numbering. X is outside D,not an unknown-rule case. For Y=${target},algebraic candidates${near ? '−1,1' : '−2,2'} filter to ${near ? '{−1,1}' : '{−2}'} in BOTH C/D: ${near ? 'both roots are admissible' : 'positive two satisfies the formula but is outside the domain'}. Swapping coordinates changes roles. H IS a function: every allowed input has exactly one output zero,with image{0}; different inputs need not have different outputs. Changing views/windows redefines none of these functions. An own example is ${near ? 'r=0,a=1/2,b=−1:inputs0,1,2 give−1,−1/2,0;continuous image[−1,0]' : 'r=−1,a=−1/2,b=2:inputs−1,0,1 give5/2,2,3/2;continuous image[3/2,5/2]'}. Generally the interval image is the CLOSED interval between ar+b and a(r+2)+b: every y there recovers x=(y−b)/a in the input interval. The finite image has three values. Announce the domain change before joining; accept other valid own choices. M needs a nonnegative radicand:${near ? '3/2−2x≥0 gives x≤3/4' : '5/3−2x/3≥0 gives x≤5/2'},including the defined zero root. This left ray is the maximal natural domain; intersecting E gives${near ? '[−1,3/4]' : '[−2,5/2]'}.`,
  );
  table(q1, [
    [
      'C',
      '完整连续规则',
      'Complete continuous rule',
      `f(x)=x²−${offset};D=[${lo},${hi}];陪域=ℝ`,
      `f(x)=x²−${offset};D=[${lo},${hi}];codomain=ℝ`,
    ],
    [
      'D',
      '仅改为有限域',
      'Finite-domain change only',
      `同式;D={${inputs}};陪域=ℝ`,
      `Same formula;D={${inputs}};codomain=ℝ`,
    ],
    [
      'M',
      '独立最大域与给定域',
      'Separate natural and stipulated domains',
      near ? 'm(x)=√(3/2−2x);另给E=[−1,1]' : 'm(x)=√(5/3−2x/3);另给E=[−2,3]',
      near
        ? 'm(x)=√(3/2−2x);separately E=[−1,1]'
        : 'm(x)=√(5/3−2x/3);separately E=[−2,3]',
    ],
    [
      'X/Y',
      '两个不同查询',
      'Two different queries',
      `X=${query};Y=${target}`,
      `X=${query};Y=${target}`,
    ],
  ]);
  const d = near ? '2' : '3/2',
    small = near ? '1/2' : '3/4',
    outside = near ? '-3' : '-2',
    plus = near ? 1 : 2;
  const q2 = card(
    2,
    '① C给完整对称域，证明立方严格递增及奇性，不只试表中一对。可用两点立方差，并解释第二因子为何对x₁<x₂为正。P四候选对分别先核在研究区间内且x₁<x₂，只有合法对才比较；正向一对符合能代一般证明吗？② A求原全域/左半/右半严格单调性及原奇偶性，给全域失败见证和两侧一般理由。仅切右半作研究区间，原函数还偶吗？若真正把原域限制为右半，奇偶性又怎样？③ E判奇偶并核f(0)，与原有平方/零函数任务比较：f(0)=0是否足够奇、非零是否排偶？写任意奇函数在0有定义时必须f(0)=0的一般推导，并给平方反例说明反向失败。④ R判奇偶并说明0处是否有定义；“奇函数必须在0有值”对吗？原有平方分半证明、零函数既奇又偶和严格/非严格约定继续用。',
    '① Prove C’s strict increase and oddness on its FULL symmetric domain, not only a table pair. You may use the difference of cubes, justifying positivity of its second factor for x1<x2. For EACH P pair first check domain membership AND ordering before comparing outputs. Does one successful pair replace proof? ② For A classify strict monotonicity on its whole/left/right intervals and original parity, with a whole-domain refutation and general side arguments. Does selecting only the right STUDY interval change original evenness? What if the ORIGINAL domain really becomes that half? ③ Classify E’s parity and f(0), comparing existing square/zero tasks. Is f(0)=0 sufficient for oddness; does a nonzero value exclude evenness? Derive the zero-value necessity for ANY odd function DEFINED at zero, then refute its converse using a square. ④ Classify R and its status at zero. Must every odd function be defined at zero? Retain the existing square-side proofs, zero’s two parities and strict/weak convention tasks.',
    `C对x₁<x₂差=(x₂−x₁)(x₂²+x₁x₂+x₁²)>0：第二因子=(x₂+x₁/2)²+3x₁²/4，仅两输入同0才为0，而有序对排除；故全域严格增。(−x)³=−x³且域对称，奇、非偶。P首对合法，输出${near ? '−1/8,1/8' : '−27/64,27/64'}；反序不满足x₁<x₂，同值对也不满足，${outside}在域外，都不是该定义的合格测试。A左半|x|=−x严格减、右半=x严格增；−${small}<${small}输出相等，反驳全域任一严格方向；原完整函数偶且非奇。只选右研究区间不改原奇偶；真正改原域为[0,${d}]则不对称，既非奇也非偶。E的(−x)²+${plus}=x²+${plus}，偶；f(0)=${plus}非0所以非奇，非零不排偶。若奇且0在域，f(0)=−f(0)迫2f(0)=0，所以f(0)=0；平方f(0)=0却在±1/2同1/4而非相反，反向不成立。R域ℝ去0仍对称，1/(−x)=−1/x对每个非零x成立，奇、非偶；0未定义，不违背带“若在0有定义”的结论。`,
    `For C and x1<x2,the output difference is (x2−x1)(x2²+x1x2+x1²)>0. The second factor=(x2+x1/2)²+3x1²/4 vanishes only when BOTH inputs are zero,excluded by strict ordering. Thus C strictly increases on the whole domain. Its symmetric domain and (−x)³=−x³ establish oddness,not evenness. Only the first P pair is admissible AND ordered,with outputs${near ? '−1/8,1/8' : '−27/64,27/64'}. The reverse and equal pairs fail ordering; ${outside} is outside the domain. A equals −x on its left half and x on its right,hence strictly decreases/increases there. Inputs±${small} have equal outputs,refuting BOTH whole-domain strict directions. The full function is even,not odd. Choosing a right study interval preserves original parity; actually restricting the original to[0,${d}] destroys domain symmetry,so neither. E satisfies (−x)²+${plus}=x²+${plus},so even; f(0)=${plus} excludes oddness,not evenness. Any odd function defined at zero has f(0)=−f(0),hence zero. The converse fails for square:±1/2 both give1/4 rather than opposites,although f(0)=0. R’s domain ℝ excluding zero IS symmetric,and 1/(−x)=−1/x for EVERY nonzero x makes it odd,not even. Undefined zero does not violate the CONDITIONAL zero-value result.`,
  );
  table(q2, [
    [
      'C/A/E',
      '分别给定完整函数',
      'Separate complete functions',
      `C=x³;A=|x|;E=x²+${plus};各D=[−${d},${d}]`,
      `C=x³;A=|x|;E=x²+${plus};each D=[−${d},${d}]`,
    ],
    [
      'P',
      'C全域研究的候选对',
      'Candidate pairs for C on its full domain',
      `(−${small},${small});(${small},−${small});(0,0);(${outside},0)`,
      `(−${small},${small});(${small},−${small});(0,0);(${outside},0)`,
    ],
    [
      'R',
      '独立倒数函数',
      'Separate reciprocal function',
      'r(x)=1/x;D=ℝ∖{0}',
      'r(x)=1/x;D=ℝ∖{0}',
    ],
  ]);
  const q3 = card(
    3,
    '① G从受限立方f的源点出发：由b(x−h)=u推一般点对应及新域，亲算三个指定u的完整像点，给两方向倍率/反射及位移。把G完整展开合并为三次多项式，保括号与常数，再用一个像点回验；未展开形式虽然等值，能答“展开合并”吗？② “源点输入u=1”与“新输入x=1”是同一查询吗？分别给像点与G(1)的状态/精确值，先查变换后的给定域，不能拿域外多项式延拓值冒充原函数值。只换源点、表示或图窗分别会不会改变函数、固定x的查询？未画到的弧端等于定义域端点吗？③ R是另一个全实域立方，追踪同一P分别经内部反号r(−x)和外部反号−r(x)，画两像点、写全式。最终两图集相同就能说这个源点没有移动或两种点对应相同吗？原有零倍率复合域与平方变换任务继续使用，不重复创作。',
    '① For G built from the RESTRICTED cube f, derive the general point map and new domain from b(x−h)=u. Calculate all THREE given source images and explain horizontal/vertical factors, reflections and shifts. EXPAND AND COLLECT the full cubic polynomial, retaining brackets/constants; check a mapped point. Is an equivalent unexpanded expression a completed expansion? ② Is source input u=1 the same query as transformed input x=1? Give the mapped point AND G(1)’s admissibility/exact value, checking the transformed stipulated domain first. A polynomial extension outside that domain is not an original function value. What do changing only a source point, display view or window do to the function and a fixed-x query? Do illustrated arc ends define the full domain? ③ R is a SEPARATE cube on ALL reals. Track the SAME source P through inner negation r(−x) and outer negation −r(x),draw both images and write both full rules. Does coincidence of graph SETS mean the source point stayed fixed or that both point maps agree? Retain existing zero-coefficient/domain and square-transformation tasks.',
    `一般(u,v)→(h+u/b,k+av)，域{x:b(x−h)∈D_f}。G新域${near ? '[−1/2,1]' : '[−7/6,5/6]'}；u=−1/2,0,1依次像点${near ? '(3/4,13/16),(1/2,3/4),(0,1/4)' : '(−1/6,−1/3),(−1/2,−1/4),(−7/6,5/12)'}。横向反射、倍率${near ? '1/2' : '2/3'}，纵向${near ? '反射并缩1/2' : '缩2/3不反射'}，h/k分别${near ? '1/2和3/4' : '−1/2和−1/4'}。展开${near ? '4x³−6x²+3x+1/4' : '−9x³/4−27x²/8−27x/16−17/32'}；如u=0的像点代回得${near ? 'G(1/2)=3/4' : 'G(−1/2)=−1/4'}。u=1的像${near ? '(0,1/4)' : '(−7/6,5/12)'}不是x=1查询；G(1)${near ? '在域内且为5/4' : '域外，即使展开多项式在1有−251/32的延拓值'}。改源点仅改所追对象，不改G或固定x查询；视图/图窗也不改域/值，示意弧端非无界域端点。R的P=(${near ? '1/2,1/8' : '3/2,27/8'})，内部反号像${near ? '(−1/2,1/8)' : '(−3/2,27/8)'}，外部反号像${near ? '(1/2,−1/8)' : '(3/2,−27/8)'}，点不同；两全式均−x³，因r奇且全域对称，最终图集相同但对应身份不能互换。`,
    `The map is(u,v)→(h+u/b,k+av),domain{x:b(x−h)∈D_f}. G’s domain is${near ? '[−1/2,1]' : '[−7/6,5/6]'};u=−1/2,0,1 map respectively to${near ? '(3/4,13/16),(1/2,3/4),(0,1/4)' : '(−1/6,−1/3),(−1/2,−1/4),(−7/6,5/12)'}. Horizontal reflection has factor${near ? '1/2' : '2/3'};vertical${near ? 'reflection and factor1/2' : 'factor2/3 without reflection'},then h/k shifts${near ? '1/2 and3/4' : '−1/2 and−1/4'}. The COLLECTED polynomial is${near ? '4x³−6x²+3x+1/4' : '−9x³/4−27x²/8−27x/16−17/32'}. The u=0 image checks${near ? 'G(1/2)=3/4' : 'G(−1/2)=−1/4'}. The image of u=1 is${near ? '(0,1/4)' : '(−7/6,5/12)'},not the query x=1. G(1)${near ? 'is admissible and equals5/4' : 'is OUTSIDE the domain,although its polynomial extension gives−251/32'}. Moving only a source point changes the tracked object,not G or its fixed-x query;views/windows change neither values nor domains. Sampled arc ends do not bound an unbounded domain. In separate R,P=${near ? '(1/2,1/8)' : '(3/2,27/8)'} maps under inner negation to${near ? '(−1/2,1/8)' : '(−3/2,27/8)'},and under outer negation to${near ? '(1/2,−1/8)' : '(3/2,−27/8)'}. The points differ although both full rules equal−x³ on ℝ. Oddness and domain symmetry make graph sets coincide,not the maps of the SAME source point.`,
  );
  table(q3, [
    [
      'G',
      '受限原函数的复合',
      'Composition of a restricted source',
      near
        ? 'f(u)=u³,D_f=[−1,2];G=a f(b(x−h))+k;a=−1/2;b=−2;h=1/2;k=3/4'
        : 'f(u)=u³,D_f=[−2,1];G=a f(b(x−h))+k;a=2/3;b=−3/2;h=−1/2;k=−1/4',
      near
        ? 'f(u)=u³,D_f=[−1,2];G=a f(b(x−h))+k;a=−1/2;b=−2;h=1/2;k=3/4'
        : 'f(u)=u³,D_f=[−2,1];G=a f(b(x−h))+k;a=2/3;b=−3/2;h=−1/2;k=−1/4',
    ],
    [
      'U/X',
      '三个源点与另一个查询',
      'Three source inputs and a separate query',
      'u=−1/2,0,1；另查新输入x=1',
      'u=−1/2,0,1; separately query new x=1',
    ],
    [
      'R',
      '独立全域奇函数',
      'Separate all-real odd function',
      `r(u)=u³,D=ℝ;P源输入u=${near ? '1/2' : '3/2'};分别r(−x)和−r(x)`,
      `r(u)=u³,D=ℝ;source P at u=${near ? '1/2' : '3/2'};compare r(−x) and −r(x)`,
    ],
  ]);
  const y = near ? '4/3' : '4/9',
    rounded = near ? '-0.56' : '-1.17',
    zero = near ? '1/3' : '-1/2';
  const q4 = card(
    4,
    '① A是给定有界区间域上的负斜率一次函数。求实际像集、给一般逆式/逆域/逆值域并说明每个输出恰一原像，画原图与交换图，保相同单位标尺。两端顺序如何随负斜率改变？求f⁻¹(Y)并往返核；C中未达到的Z能因为逆式可代就变成逆输入吗？② 比较f⁻¹(Y)与1/f(Y)，分别说原输出回原输入和原函数在同一数Y处取输出倒数的角色。1/f的原输入域要排什么？f⁻¹(0)是否因此也无定义？将X~代原f，给与Y的精确差，显示到小数相近能答精确原像吗？③ R只核既有右平方支的输出2：写精确原像、把候选J代原式精确平方并与2比较。候选虽在域内就一定恢复输出吗？原有全局可逆性/两支及双向复合任务继续用，本题不重做那些证明。',
    '① A is a negative-slope affine function on a STIPULATED bounded interval. Find the actual image, inverse rule/domain/range and reason EVERY output has exactly one preimage. Draw original and swapped graphs with equal axis units. How does a negative slope affect endpoint ordering? Find f⁻¹(Y),checking both directions. May unused codomain value Z become an inverse input merely because its algebraic formula can be evaluated? ② Compare f⁻¹(Y) and 1/f(Y): recovering an input differs from reciprocating the original output at numerical input Y. What must the ORIGINAL input domain of 1/f exclude? Does this make f⁻¹(0) undefined too? Substitute X~ into original f and give the EXACT difference from Y. Does close decimal display answer an exact-preimage task? ③ R concerns ONLY output two on the existing right square branch. Give the EXACT preimage, square proposed J in the original rule and compare with two. Does candidate-domain membership guarantee recovery? Retain existing global-invertibility, two-branch and two-composition tasks rather than repeating their proofs.',
    `A像${near ? '[−4,2]' : '[−1,1]'}，负斜率非零保证一对一，原域两端的输出倒序。逆式${near ? 'g(y)=1/3−2y/3' : 'g(y)=−1/2−3y/2'}，逆域为实际像、逆值域${near ? '[−1,3]' : '[−2,1]'}；分别代f(g(y))=y与g(f(x))=x且保各自域。Y=${y}原像${near ? '−5/9' : '−7/6'}，代回Y；Z=${near ? 3 : 2}未被达到，逆式给${near ? '−5/3' : '−7/2'}在原域外，不能拓逆域。1/f(Y)=${near ? '−2/3' : '−27/17'}，不是逆值。原f零点x=${zero}，1/f域为原D去此点；逆函数在输出0有原像${zero}，仍合法，变量角色不可混。X~=${rounded}代f得${near ? '67/50' : '67/150'}，减Y=${near ? '1/150' : '1/450'}非0，近似不作精确原像。R精确原像${near ? '√2' : '1+√2'}；J=${near ? '1.41' : '2.41'}在该域内，但原式均得(141/100)²=19881/10000=1.9881，比2小119/10000，不是精确逆值。平方分支符号和域需保留，图像/小数显示不替双向验证。`,
    `A’s image is${near ? '[−4,2]' : '[−1,1]'}; nonzero negative slope ensures injectivity and reverses endpoint-output order. Inverse g(y)=${near ? '1/3−2y/3' : '−1/2−3y/2'},domain=actual image,range=${near ? '[−1,3]' : '[−2,1]'}. Verify f(g(y))=y and g(f(x))=x on their RESPECTIVE domains. Y=${y} recovers${near ? '−5/9' : '−7/6'} and returns to Y. Z=${near ? 3 : 2} was not attained: the inverse expression yields${near ? '−5/3' : '−7/2'},outside original D,not an admitted inverse input. Reciprocal 1/f(Y)=${near ? '−2/3' : '−27/17'} differs from the inverse value. Original f vanishes at x=${zero},so 1/f has original D excluding that input. Inverse input ZERO instead legitimately recovers${zero}; do not exchange these roles. X~=${rounded} gives original f=${near ? '67/50' : '67/150'},differing from Y by${near ? '1/150' : '1/450'},not zero. R’s exact preimage is${near ? '√2' : '1+√2'}. Candidate J=${near ? '1.41' : '2.41'} is in its domain,but the original rule gives(141/100)²=19881/10000=1.9881,below two by119/10000. It is not the exact inverse value. Retain branch signs/domains and distinguish visual/decimal agreement from two-way recovery.`,
  );
  table(q4, [
    [
      'A',
      '负斜率且给定域',
      'Negative slope with stipulated domain',
      near
        ? 'f(x)=−3x/2+1/2;D=[−1,3];C=[−5,3]'
        : 'f(x)=−2x/3−1/3;D=[−2,1];C=[−2,2]',
      near
        ? 'f(x)=−3x/2+1/2;D=[−1,3];codomain=[−5,3]'
        : 'f(x)=−2x/3−1/3;D=[−2,1];codomain=[−2,2]',
    ],
    [
      'Y/Z/X~',
      '原输出与待审候选',
      'Original outputs and proposed candidate',
      `Y=${y};Z=${near ? 3 : 2};X~=${rounded}`,
      `Y=${y};Z=${near ? 3 : 2};X~=${rounded}`,
    ],
    [
      'R',
      '独立右平方支精度',
      'Separate right-square-branch precision',
      near
        ? 'f(x)=x²;D=[0,2];输出2;候选J=1.41'
        : 'f(x)=(x−1)²;D=[1,3];输出2;候选J=2.41',
      near
        ? 'f(x)=x²;D=[0,2];output2;candidate J=1.41'
        : 'f(x)=(x−1)²;D=[1,3];output2;candidate J=2.41',
    ],
  ]);
  const end = near ? 3 : 4,
    rate = near ? '5/2' : '7/3',
    budget = near ? 6 : 8;
  const q5 = card(
    5,
    '① S为独立纸上计时规则：先按“已开始的小时”写出全部互斥穷尽分支及费用，0单独列。求Q1/Q2/Q3三次费用，说明整数时刻与刚超过时刻的归属；每开始一小时为何不同于连续按小时比例收费？画分段图，跳跃间能连线补收费吗？负时刻和超过给定终时刻的输入怎样判断，终时刻本身是否允许？② 求费用不超过B的完整时间集合，逐段判断/取交/并，保0和闭终点；与错用比例收费所得集合比较，给一个实际误纳输入。改变当前查询会改变整个预算集合吗？③ 自主另选T>k>0、正有理费率p≠q及预算b≥0，给同一重量域[0,T]上的两种虚构方案（x、T、k用kg，p和q用NZD/kg，b用NZD）：M累计先p后q，W按所在档将整个重量乘该档费率。k只归首段。自己写两完整规则，至少三行表含k及刚超过k、两图/端点、每种完整预算集合与逐段证明，解释两个模型差异及局限。接受不同合法参数/空区间边界，不要求照抄作者例子；无需真实购买、采集或把作者数值写入家庭便签。原有断开整件预算集任务继续用。',
    '① S is a SEPARATE paper timing rule. Write ALL disjoint exhaustive started-hour branches and charges,listing zero separately. Evaluate Q1/Q2/Q3 and explain exact-integer versus just-after ownership. Why is a started-hour rule not proportional continuous charging? Draw separate branches without inventing charges across jumps. Classify negative/after-final inputs and the final endpoint itself. ② Derive the COMPLETE charge≤B time set by branchwise checks,intersection and union,retaining zero and included endpoints. Compare the incorrect proportional-charge set and supply an actually misadmitted input. Does moving the current query change this whole budget set? ③ CHOOSE T>k>0,positive rational p≠q and budget b≥0. Use kg for x,T,k;NZD/kg for p,q and NZD for b. On SAME fictional mass domain[0,T],define M with marginal rate p then q,and W charging the ENTIRE mass at its applicable tier rate. Only the first tier owns k. Give BOTH full rules,at least three rows including k and just after it,two graphs/endpoints,complete feasible sets and branchwise proofs. Explain the models’ difference and limits. Accept other valid choices and degenerate feasible intervals,not only author examples; no real purchase,collection or copying author data into household notes is needed. Retain the existing disconnected whole-tier feasible-set task.',
    `S域[0,${end}]，0费用0；每整数j=1,…,${end}在j−1<t≤j收费(${rate})×j。Q1=${near ? '3/2时5' : '5/2时7'}，Q2=${near ? '2时5' : '3时7'}，Q3=${near ? '9/4时15/2' : '13/4时28/3'}NZD。整数端点归已开始的本小时而非下一小时；0与任何小正时刻不同，终点${end}包含，负值及${near ? '7/2' : '9/2'}域外无给定费用。B=${budget}保整段到${near ? 2 : 3}，完整[0,${near ? 2 : 3}]；下一小时费用${near ? '15/2>6' : '28/3>8'}，不漏任何可行片段。误用比例给[0,${near ? '12/5' : '24/7'}]，错误纳入${near ? '9/4' : '13/4'}；一次当前费用与全部时间集合分开，换查询不改B的集合。一般M=px于[0,k]、pk+q(x−k)于(k,T]，W=px于[0,k]、qx于(k,T]，仅首段含k；第二段两式差(p−q)k≠0。自主例${near ? 'T=4,k=1,p=3,q=1,b=4：M首段3x、后x+2，预算[0,2]；W首3x、后x，预算[0,4]，在x=2费用分别4和2' : 'T=5,k=2,p=2,q=3,b=7：M首2x、后3x−2，预算[0,3]；W首2x、后3x，预算[0,7/3]，在x=3费用分别7和9'}。图/表须含自选边界和其右侧，逐段解再交本段域并集合，可行集仅{0}也可如实报告。虚构完整费率、连续重量且无额外费是模型前提，不声明现实商家或仪器规则。`,
    `S has domain[0,${end}],charge zero at t=0,and charge(${rate})j on j−1<t≤j for each integer j=1,…,${end}. Q1 gives${near ? 'five at3/2' : 'seven at5/2'},Q2 gives${near ? 'five at two' : 'seven at three'},Q3 gives${near ? '15/2 at9/4' : '28/3 at13/4'} NZD. Integer endpoints belong to the hour ALREADY started,not the next. Zero differs from every small positive time. Final${end} is included;negative and${near ? '7/2' : '9/2'} inputs have no specified charge. B=${budget} retains all branches through${near ? 2 : 3},giving COMPLETE[0,${near ? 2 : 3}];the next charge${near ? '15/2 exceeds six' : '28/3 exceeds eight'}. The incorrect proportional set[0,${near ? '12/5' : '24/7'}]misadmits${near ? '9/4' : '13/4'}. A query value differs from the full budget set;changing the query leaves it unchanged. Generally M=px on[0,k],pk+q(x−k) on(k,T];W=px on[0,k],qx on(k,T]. Only the first owns k;second rules differ by(p−q)k≠0. One own example:${near ? 'T=4,k=1,p=3,q=1,b=4. M uses3x then x+2,feasible[0,2];W uses3x then x,feasible[0,4]. At x=2,costs four and two' : 'T=5,k=2,p=2,q=3,b=7. M uses2x then3x−2,feasible[0,3];W uses2x then3x,feasible[0,7/3]. At x=3,costs seven and nine'}. Supply own table/graphs at k and to its right,solve in EACH branch and intersect BEFORE unioning;even feasible set{0} may be reported honestly. Complete fictional rates,continuously divisible mass and no other charges are model premises,not claims about real merchants or instruments.`,
  );
  table(q5, [
    [
      'S',
      '每开始一小时',
      'Per started hour',
      `t=0费用0；0<t≤${end}h，每开始1h收${rate}NZD，无其他费`,
      `t=0 costs0;0<t≤${end}h,${rate}NZD per started hour,no other fees`,
    ],
    [
      'Q1/Q2/Q3',
      '分别查询',
      'Separate queries',
      near ? 't=3/2,2,9/4 h' : 't=5/2,3,13/4 h',
      near ? 't=3/2,2,9/4 h' : 't=5/2,3,13/4 h',
    ],
    [
      'B/O',
      '独立预算及域外值',
      'Budget and outside input',
      `B=${budget}NZD;另查t=${near ? '7/2' : '9/2'}h`,
      `B=${budget}NZD;separate t=${near ? '7/2' : '9/2'}h`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-FUNCTION-CONCEPT-MEANING`,
    unit,
    bridge: 'H02-L02',
    bridgeByQuestion: Object.fromEntries(
      [2, 3, 4, 5, 6].map((l, i) => [id(i + 1), `H02-L0${l}`]),
    ),
    title: t(
      '求导与分析之后，再核函数的输入、图点和反向',
      'After calculus and analysis, recheck function inputs, points and reversal',
    ),
    intro: t(
      '五张独立纸笔卡，每次一个编号/案例，可分次、不计时、口述。先生成自己的集合、点或规则，再用另一表示核对；所有理由人工审核，自主方案可有不同正确结果。',
      'Five independent paper cards,one numbered part/case per untimed sitting;oral work is welcome. Generate your own sets,points or rules before checking another representation. All reasoning is human-reviewed and own models may have different valid answers.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const functionConceptMeaningRetrieval = {
  H25_FUNCTION_CONCEPT_MEANING: makeSet('H25'),
  H26_FUNCTION_CONCEPT_MEANING: makeSet('H26'),
};
