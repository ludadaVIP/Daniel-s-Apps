import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H25' | 'H26') => {
  const first = u === 'H25',
    qid = (i: number) => `${u}-MAINT-LOGIC-FUNCTION-Q${i}`;
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(qid(i), t(z, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '把对象、定义域、量词和每一步方向写明；具体反例、完整集合与一般证明承担不同作用。',
        'State objects,domain,quantifiers and each implication direction. A concrete counterexample,a complete set and a general proof have distinct roles.',
      ),
    ]);
  const universe = first ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7, 8];
  const raw = first ? [1, 1, 2, 4] : [2, 2, 4, 6],
    a = [...new Set(raw)],
    b = first ? [2, 3, 4] : [1, 4, 7];
  const complement = universe.filter((x) => !a.includes(x)),
    intersection = a.filter((x) => b.includes(x)),
    union = [...new Set([...a, ...b])].sort((x, y) => x - y);
  const p = first ? 3 : 4,
    centre = first ? 3 : -1,
    radius = first ? 2 : 4,
    lo = centre - radius,
    hi = centre + radius;
  return {
    id: `${u}-MAINT-LOGIC-FUNCTION`,
    unit: u,
    bridge: 'H01-L02',
    bridgeByQuestion: Object.fromEntries(
      [
        'H01-L02',
        'H01-L03',
        'H01-L04',
        'H01-L05',
        'H02-L05',
        'H02-L03',
        'H02-L04',
        'H02-L06',
      ].map((l, i) => [qid(i + 1), l]),
    ),
    title: t(
      '求导与分析之后，再核逻辑和函数前提',
      'After calculus and analysis,recheck logic and function premises',
    ),
    intro: t(
      '八题分次，每次一题；长题可先画对应或区间、下次再写理由。可用纸笔，全部人工核验，不计时。数据和计费方案均为题设虚构资料。',
      'Choose one of eight tasks per sitting. For a longer task,draw mappings or intervals first and write reasons next time. Paper is welcome and every argument is human-reviewed without a timer. Records and tariff rules are fictional teaching givens.',
    ),
    questions: [
      task(
        1,
        'set-boolean-operations',
        `全集U={${universe.join(',')}}。四个不同ID各测一次的清单为${raw.join(',')}，令A为其不同数值的集合，B={${b.join(',')}}。列A、A∩B、A∪B、U中Aᶜ并解释清单次数与集合元素数的区别。判断${a[0]}∈A、{${a[0]}}⊆A、{${a[0]}}∈A、∅⊆A、∅∈A。再逐元素核A∩Aᶜ与A∪Aᶜ；只把U扩大加入${first ? '7和8' : '9和10'}，补集会怎样？`,
        `Let U={${universe.join(',')}}. A list from four distinct IDs,each measured once,is ${raw.join(',')}; let A be its set of distinct values and B={${b.join(',')}}. List A,A∩B,A∪B and A’s complement in U,distinguishing record multiplicity from set size. Decide ${a[0]}∈A,{${a[0]}}⊆A,{${a[0]}}∈A,∅⊆A,∅∈A. Check A∩Aᶜ and A∪Aᶜ elementwise. What changes if only U expands by adding ${first ? 'seven and eight' : 'nine and ten'}?`,
        `A={${a.join(',')}}有3元素，原清单4条不同ID仍保留同值，不能因集合去重删原观测；顺序和重复不改集合。交={${intersection.join(',')}}，并={${union.join(',')}}，补={${complement.join(',')}}。${a[0]}是数值元素，{${a[0]}}是含该数的集合，故∈/⊆两真，而{${a[0]}}∈A假；空集对任意A为子集，因为没有违例元素，但不是本题纯数集合的元素。逐元素“既在又不在A”无，所以A∩Aᶜ=∅；U每元素在A或不在，A∪Aᶜ=U。扩大U只使补集增${first ? '7、8' : '9、10'}，A未变，补集必须指明全集。`,
        `A={${a.join(',')}} has three elements; the original four distinct-ID records still retain equal measurements. Set deduplication does not authorise deleting observations. Order/repetition do not change the set. Intersection={${intersection.join(',')}},union={${union.join(',')}},complement={${complement.join(',')}}. The number ${a[0]} is an element and {${a[0]}} a subset,so both first claims hold,but the singleton set itself is not an element of this numerical A. Empty is a subset because it has no counterexample member,not an element of this A. No element is both inside/outside A,so intersection with its complement is empty; every U element is one or the other,so their union is U. Expanding only U adds ${first ? 'seven and eight' : 'nine and ten'} to the complement. A is unchanged and the universe must be declared.`,
        '先区别“一个数”和“装这个数的集合”，再把U每元素分成在A或不在A。',
        'Distinguish a number from the set containing it,then partition each U element by membership in A.',
      ),
      task(
        2,
        'logic-domain-counterexample',
        `审查“${first ? 'x²≥x' : '(x−2)²≥x−2'}对所有x成立”：先取整数域，再取实数域，给一般理由或精确反例；分别写全称命题的正确否定。再否定“存在整数n使n²=${first ? 2 : 3}”，说明为何不是“存在一个n使不等于${first ? 2 : 3}”，并判断原存在命题真假。`,
        `Audit “${first ? 'x²≥x' : '(x−2)²≥x−2'} for every x” first over integers,then reals,using a general reason or exact counterexample. Write the correct negation of the universal claim. Negate “there exists an integer n with n²=${first ? 2 : 3}”,explain why “some n has a different square” is not its negation,and decide the original existence claim.`,
        `${first ? '令m=x' : '令m=x−2'}，整数时m≤0或m≥1，无整数在(0,1)，两种均m(m−1)≥0，故原式对所有整数真。实数取x=${first ? '1/2' : '5/2'}，相应m1/2，m²=1/4<1/2，反例使实数全称假。否定∀x∈D P(x)为∃x∈D使P不成立，此处不等式为<而非对所有x都<，域D保留。存在整数平方${first ? 2 : 3}的否定为∀n∈Z,n²≠${first ? 2 : 3}；整数|n|≤1平方≤1，或|n|≥2平方≥4，故原存在假、其全称否定真。“存在不等于”不是否定：比如存在n²=4和存在n²≠4可由2与0同时成立。`,
        `${first ? 'Set m=x' : 'Set m=x−2'}. For integer m,either m≤0 or m≥1; no integer lies between zero and one,so m(m−1)≥0 in both cases. Thus the integer universal is true. Real x=${first ? '1/2' : '5/2'} gives m=1/2 and m²=1/4<1/2,refuting the real universal. Negating ∀x∈D P(x) gives ∃x∈D with P false,using < here,not a claim that every x satisfies <; retain D. The existence claim’s negation is ∀n∈Z,n²≠${first ? 2 : 3}. Integer |n|≤1 gives square≤1,and |n|≥2 gives square≥4,so the existence claim is false and its universal negation true. “Some different square” is not the negation: existence of square four and of a square different from four are simultaneously witnessed by two and zero.`,
        '证明所有整数要覆盖所有情况；反驳实数全称只需一个域内反例，否定时换量词并保范围。',
        'Cover every integer case for a universal proof. One real-domain witness refutes its universal. Negation changes the quantifier while retaining the domain.',
      ),
      task(
        3,
        'logic-two-directions',
        `在实数域给P:x=${p}，Q:x²=${p * p}。分别审P⇒Q与Q⇒P，写反例和“P对Q”“Q对P”的必要/充分身份，不能只写一个“充分”。再审¬Q⇒¬P与¬P⇒¬Q；若另限x≥0，哪些方向改变？`,
        `Over the reals let P:x=${p} and Q:x²=${p * p}. Audit P⇒Q and Q⇒P with a counterexample,and explicitly name necessity/sufficiency of P FOR Q and Q FOR P. Also audit not-Q⇒not-P and not-P⇒not-Q. What changes under the additional domain restriction x≥0?`,
        `P⇒Q真，${p}²=${p * p}；Q⇒P在x=−${p}失败。故P对Q充分不必要，Q对P必要不充分，必须保“谁对谁”。¬Q⇒¬P为原真蕴含的逆否：若x²≠${p * p}则x不能${p}，真；¬P⇒¬Q在−${p}仍失败，不能把否定两边当等价逆否。加x≥0后Q的两候选±${p}只余${p}，两方向都真，P/Q在该域互为充要，不能拿域外负值继续作反例。原条件一改须重新核方向与允许反例。`,
        `P⇒Q holds since ${p}²=${p * p}; Q⇒P fails at x=−${p}. Thus P is sufficient but not necessary FOR Q,and Q necessary but not sufficient FOR P. The contrapositive not-Q⇒not-P holds: x²≠${p * p} excludes x=${p}. The inverse not-P⇒not-Q fails again at −${p}; negating both sides without reversing is not the contrapositive. With x≥0,only positive ${p} remains from Q’s ± roots,so both directions hold and P/Q are equivalent in that domain. A negative value can no longer be a valid counterexample there. Recheck direction and admissible witnesses when premises change.`,
        '为两个箭头各写一句“如果…那么…”，再检查负根是否仍在当前域内。',
        'Write an if–then sentence for each arrow and check whether the negative root belongs to the current domain.',
      ),
      task(
        4,
        'absolute-complete-real-set',
        `在全实数域，对${first ? '|x−3|' : '|x+1|'}与${radius}分别用<、≤、>、≥列四个完整解集并亲画数轴，解释哪组为“且”、哪组为“或”，核${lo}、${centre}、${hi}。再把右边改0及−2，各列四种比较的解集；能只背“内侧外侧”而不核非负性吗？`,
        `Over all reals compare ${first ? '|x−3|' : '|x+1|'} with ${radius} using <,≤,>,≥. Give all four complete sets and draw number lines,explaining AND versus OR. Check ${lo},${centre},${hi}. Replace the right side by zero and then −2,giving all four sets each time. Is an inside/outside mnemonic enough without nonnegativity?`,
        `距离中心${centre}：<给(${lo},${hi})，≤给[${lo},${hi}]，两端约束同时成立为交集；>给x<${lo}或x>${hi}，≥给x≤${lo}或x≥${hi}，两侧择一为并集。${lo}与${hi}距离${radius}，中心距0，分别核开闭。右边0时，<为空、≤为{${centre}}、>为ℝ∖{${centre}}、≥为ℝ。右边−2时绝对值始终≥0，<和≤都空、>和≥都为ℝ，不是再造“负半径”图。必须保全实域、端点与“且/或”，有限整数样例不代表这些集合。`,
        `Distance from ${centre} gives < as (${lo},${hi}) and ≤ as [${lo},${hi}],an intersection requiring both bounds. For > use x<${lo} OR x>${hi}; for ≥ use x≤${lo} OR x≥${hi},unions of the outside rays. Endpoints ${lo},${hi} have distance ${radius}; the centre has zero,checking inclusion. With right side zero,< is empty,≤ is {${centre}},> is ℝ excluding ${centre},and ≥ is all ℝ. With right side −2,nonnegative absolute values make < and ≤ empty,> and ≥ all ℝ. Do not draw a negative-radius inside/outside picture. Preserve the full real domain,endpoints and AND/OR rather than finite integer examples.`,
        '把绝对值读成到中心的非负距离；先核右侧半径是否正、零或负。',
        'Read absolute value as a nonnegative distance from the centre,and classify the right side as positive,zero or negative first.',
      ),
      task(
        5,
        'function-inverse-correspondence',
        `给定f(x)=${first ? 'x²' : '(x−1)²'}、D=${first ? '[−2,2]' : '[−1,3]'}、目标集合C=[0,9]。画有效多对一对应及函数图，求实际像集；另造同输入两输出和漏一个域内输入的无效关系。输出0只有一个原像能证明可逆吗？用输出4、水平线与交换坐标核验。只把D限为${first ? '[0,2]' : '[1,3]'}后写反函数及其完整域/像，原C中未达到的9能直接当反函数输入吗？`,
        `Given f(x)=${first ? 'x²' : '(x−1)²'},D=${first ? '[−2,2]' : '[−1,3]'} and codomain C=[0,9],draw a valid many-to-one mapping and its graph,then find the actual image. Construct invalid relations with one input/two outputs and with a missing domain input. Does output zero having one preimage prove invertibility? Check output four,a horizontal line and coordinate swapping. Restrict D to ${first ? '[0,2]' : '[1,3]'} and give the inverse with its full domain/image. May unused codomain value nine automatically be an inverse input?`,
        `${first ? '−1与1都到1，0到0，±2到4' : '0与2都到1，1到0，−1与3到4'}，每个D输入由式恰一个输出，故多对一仍函数。平方在0..4且每个y可取${first ? 'x=√y' : 'x=1+√y'}，实际像[0,4]，不是目标集合[0,9]都被达到。若同一个x=1另连4同时连${first ? 1 : 0}，或删除x=${first ? 0 : 1}的输出而仍声称域为D，就不满足每输入恰一个。0仅原像${first ? 0 : 1}不够：4原像${first ? '−2与2' : '−1与3'}，水平y4两交，交换后输入4有两输出，逆非函数。右半域限制后严格增且一一，反函数g(y)=${first ? '√y' : '1+√y'}，域[0,4]、像${first ? '[0,2]' : '[1,3]'}；9不在实际像，不能因属于原C就给逆输入。`,
        `${first ? 'Inputs negative one and one both map to one,zero to zero and ±2 to four' : 'Inputs zero and two both map to one,one to zero and negative one and three to four'}. Every domain input has exactly one output,so many-to-one is valid. Squares stay in[0,4],and each such y is attained at ${first ? 'x=√y' : 'x=1+√y'},so the image is[0,4],not the whole codomain[0,9]. Sending the same input one additionally to four while retaining its original ${first ? 'one' : 'zero'},or omitting input ${first ? 'zero' : 'one'} while still declaring D,violates total single-valuedness. A unique preimage of zero alone is insufficient:four has ${first ? 'negative two and two' : 'negative one and three'},a horizontal line crosses twice,and swapping coordinates gives inverse input four two outputs. On the restricted right half,the rule is strictly increasing and one-to-one. Its inverse g(y)=${first ? '√y' : '1+√y'} has domain[0,4],image${first ? '[0,2]' : '[1,3]'}. Nine is not an attained output and cannot become an inverse input merely by belonging to C.`,
        '函数要每个输入恰一输出，反函数要每个实际输出恰一原像；这两个“唯一”方向不同。',
        'A function needs exactly one output for every input; its inverse needs exactly one preimage for every attained output. These uniqueness directions differ.',
      ),
      task(
        6,
        'function-domain-properties',
        `审查${first ? 'f=x²在[−3,3]' : 'f=(x−1)²在[−2,4]'}“整个域严格递增”的主张，给反例，并用一般差式证明左右两侧各自严格增减。按本课奇偶先要求D关于0对称的约定，判断该f的奇偶；图轴对称一定是偶函数吗？再比较零函数在${first ? '[−3,3]' : '[−2,2]'}的奇、偶、严格与非严格单调性。${first ? '公式x在[0,3]能因原式像奇函数就称奇吗？' : '关于x=1对称能代替关于0的定义域条件吗？'}`,
        `Audit the claim that ${first ? 'f=x² on[−3,3]' : 'f=(x−1)² on[−2,4]'} is strictly increasing over its entire domain. Give a counterexample and prove its separate increasing/decreasing sides by a general difference. Under the course convention requiring D symmetric about zero for parity,classify f. Does any symmetry axis make a function even? Compare the zero function on${first ? '[−3,3]' : '[−2,2]'} for oddness,evenness and strict/non-strict monotonicity. ${first ? 'Can formula x on[0,3] be called odd just by appearance?' : 'May symmetry about x=1 replace the zero-centred domain condition?'}`,
        first
          ? '−2<−1而4>1反驳全域严格增。对x1<x2≤0，差x2²−x1²=(x2−x1)(x2+x1)<0，故左半[−3,0]严格减；0≤x1<x2差>0，右半[0,3]严格增。域对称且f(−x)=f(x)，所以偶；非奇，x1给正负两侧都1而非相反。零函数在非退化对称域满足f(−x)=f(x)=−f(x)=0，既奇又偶；任意两不同输入输出相等，非严格增也非严格减，但非递减且非递增。g=x仅在[0,3]给定时域不关于0对称，按本课定义不能因公式外观称奇，必须先核域。'
          : '0<1而f0=1>f1=0，反驳全域严格增。令u=x−1，左半[−2,1]对应u≤0，两不同u的平方差=(u2−u1)(u2+u1)<0；右半[1,4]对应u≥0差>0，故先严格减再严格增。域[−2,4]不关于0对称，按本课定义既非奇也非偶，且f(−1)=4≠f1=0，不是偶；围绕x1的图对称不是偶函数的零轴条件。零函数在[−2,2]域对称，既奇又偶；在非退化域非严格增/减，但非递减且非递增。不能用一边趋势、常数图或公式外观替代全域与严格性检查。',
        first
          ? '−2<−1 but four>one refutes whole-domain strict increase. For x1<x2≤0,the difference x2²−x1²=(x2−x1)(x2+x1)<0,so[−3,0] is strictly decreasing. For0≤x1<x2 it is positive,so[0,3] is strictly increasing. The domain is symmetric and f(−x)=f(x),hence even,not odd since ±1 both give one. On a nondegenerate symmetric domain,the zero function satisfies both parity equations. Equal outputs at distinct inputs rule out strict increase/decrease,while nondecreasing and nonincreasing both hold. Formula g=x given only on[0,3] has a nonsymmetric domain and is not classified odd under this convention merely from its formula.'
          : 'Zero<one but f0=one>f1=zero refutes strict increase over the whole domain. With u=x−1,the left interval[−2,1] has u≤0 and difference(u2−u1)(u2+u1)<0; the right[1,4] has u≥0 and positive difference. Thus it decreases then increases. Domain[−2,4] is not symmetric about zero,so it is neither odd nor even under this convention,and f(−1)=four differs from f1=zero; it is not even. Symmetry about x=1 is not evenness about the zero axis. The zero function on[−2,2] is both odd and even,neither strictly increasing nor strictly decreasing on that nondegenerate interval,but both nondecreasing and nonincreasing. Audit full domains and strictness rather than a partial trend or formula appearance.',
        '严格单调要任意两不同有序输入都符合；奇偶先查域，再查函数等式。',
        'Strict monotonicity concerns every ordered pair of distinct inputs. For parity,check domain symmetry before the function equation.',
      ),
      task(
        7,
        'function-point-transform',
        `先对g(x)=a f(b(x−h))+k、b≠0推原图点(u,f(u))的新坐标与新域条件。再给f(u)=${first ? '√u' : 'u²'}仅在D=${first ? '[1,9]' : '[−2,1]'}定义，g(x)=${first ? '−2 f(−2(x−3))+5' : '3 f(−3(x+1))−2'}，求精确域并变换u=${first ? '1,4,9' : '−2,0,1'}三个点。说明负b的方向和横向倍率。仅改外系数a=0时能擅自扩域吗？另改b=0必须回原复合式查什么，能仍除b吗？`,
        `For g(x)=a f(b(x−h))+k with b≠0,derive the new coordinates of (u,f(u)) and the transformed-domain condition. Then f(u)=${first ? '√u' : 'u²'} is defined ONLY on D=${first ? '[1,9]' : '[−2,1]'},and g(x)=${first ? '−2 f(−2(x−3))+5' : '3 f(−3(x+1))−2'}. Find its exact domain and transform points u=${first ? '1,4,9' : '−2,0,1'}. Explain negative b’s direction and horizontal factor. If only outer a changes to zero,may the domain expand? If b becomes zero,what must be checked in the original composition instead of dividing by b?`,
        first
          ? '令b(x−h)=u得x=h+u/b，新y=k+a f(u)，新域为{x:b(x−h)∈D}。此处−2(x−3)∈[1,9]等价x∈[−3/2,5/2]；点依次(5/2,3)、(1,1)、(−3/2,−1)。b−2为水平反射并缩至1/2，不是拉2倍；a−2为竖直反射伸2倍，再平移h3/k5。仅a0时给定复合域仍[−3/2,5/2]，输出恒5；不能把0乘未定义当0而把x3等添入，因为f只在[1,9]给定。另b0时内输入恒0而0不在D，所有实x均无允许输出，不能当全实数常函数；x=h+u/b也已非法。若0在某另一D才可由a f0+k重新定义常值，须先核来源域。'
          : '由u=b(x−h)解x=h+u/b，新y=k+a f(u)，域{x:b(x−h)∈D}。−3(x+1)∈[−2,1]给x∈[−4/3,−1/3]。u分别取−2、0、1时变(−1/3,10)、(−1,−2)、(−4/3,1)；b−3水平反射且缩1/3，a3竖伸3，h−1/k−2平移。仅a0输出恒−2但仍保此给定复合域，不擅拓全实数。另b0内输入恒0且0∈D，原式重算f0=0，g恒−2对所有实x有定义；这与仅改a0的域不同。除b点对应公式此时不可用，不是让横向倍率写“无穷”就算完。',
        first
          ? 'Set u=b(x−h),so x=h+u/b and new y=k+a f(u). The domain is {x:b(x−h)∈D}. Here −2(x−3)∈[1,9] gives[−3/2,5/2]; the points become(5/2,3),(1,1),(−3/2,−1). Negative b=−2 reflects horizontally with factor1/2,not a twofold stretch. Negative a=−2 reflects vertically and stretches by two,then h3/k5 translate. Changing only a to zero gives constant five on the SAME supplied composite domain. Zero times an undefined value does not admit x3,whose inner zero is outside D. If b becomes zero,the inner input is always zero,outside D,so no real input has an allowed output; do not assert a constant defined for all real inputs. The formula dividing by b is invalid. Another D containing zero would require recomputing a f0+k first.'
          : 'Solving u=b(x−h) gives x=h+u/b and new y=k+a f(u),with domain{x:b(x−h)∈D}. Here −3(x+1)∈[−2,1] gives[−4/3,−1/3]. Points for u=−2,0,1 become(−1/3,10),(−1,−2),(−4/3,1). Negative b=−3 reflects horizontally with factor1/3;a3 stretches vertically by three,then h−1/k−2 translate. Changing only a to zero gives constant−2 on the same supplied composite domain,not an automatic extension. If b becomes zero,inner input zero belongs to D; recomputing f0=0 makes g=−2 for ALL real inputs. This differs from changing only a. The point formula dividing by b no longer applies,and calling horizontal scale infinite is insufficient.',
        '先把原输入u解成新x，再将u∈D整体搬成x的条件；系数0要回定义查可算性。',
        'Solve original input u for new x,then transfer the whole u∈D condition. For zero coefficients,return to the definition and admissibility.',
      ),
      {
        ...task(
          8,
          'function-piecewise-boundaries',
          `下表给连续可分重量x kg的两个虚构方案，允许0≤x≤${first ? 6 : 8}，不加其他费。C为逐段累计，T为整件按档：T第二档单价作用于整件全部x，不保第一段价。画两费用图并标端点，核每允许输入恰一适用段。预算均至多${first ? 5 : 10}NZD，逐段解费用≤预算、交本段域、再并成完整集合，不能只试样点。为什么T的允许集可能有断开，阈值${first ? 2 : 3}属于哪段？`,
          `The table gives two fictional plans for continuously divisible weight x kg,domain0≤x≤${first ? 6 : 8},with no other fees. C accumulates by segment; T applies its selected tier rate to the ENTIRE shipment x,not retaining the earlier rate. Draw both cost graphs with endpoint ownership and check exactly one rule per allowed input. Both budgets are at most ${first ? 5 : 10} NZD. Solve each segment’s inequality,intersect its domain,then union the complete results rather than sampling queries. Why can T’s feasible set be disconnected,and who owns threshold${first ? 2 : 3}?`,
          first
            ? '各方案[0,2]与(2,6]无叠无漏，阈值2只属第一段。C在2为4，第二段x+2接同值，累计保前2kg的4NZD。预算第一段2x≤5交[0,2]为[0,2]；第二段x+2≤5交(2,6]为(2,3]，合[0,3]。T第一段3x≤5交[0,2]得[0,5/3]；第二段2x≤5交(2,6]得(2,5/2]，合[0,5/3]∪(2,5/2]。x2按第一价为6>5不许，稍大于2改全件低价可允许，故中间断开不是漏算；不能假设所有费用图连续或先凸补间隙。x0两方案0，边界5/3、5/2含等，负重量与6外不许。'
            : '每方案[0,3]与(3,8]恰分全域，x3只属第一段。累计C保首3kg费用9，后为2x+3，阈值连续。预算C第一段3x≤10交[0,3]全保；第二段2x+3≤10交(3,8]为(3,7/2]，合[0,7/2]。整件T第一段4x≤10交[0,3]为[0,5/2]；第二段2x≤10交(3,8]为(3,5]，合[0,5/2]∪(3,5]。x3价12超10但稍大于3整件单价2可又允许，断开来自给定跳价，不能平滑连线或补预算空档。预算端点7/2、5/2、5都含，阈值3只按第一档；x0为0、域外无规则。',
          first
            ? 'For each plan,[0,2] and(2,6] partition the domain without overlap/gap;two belongs only to the first. C costs four at two and second rule x+2 joins it,retaining the first two kg’s four NZD. Under budget five,the first segment allows[0,2];the second x+2≤5 intersected with(2,6] gives(2,3],union[0,3]. For T,the first gives[0,5/3],the second(2,5/2],so the complete set is[0,5/3]∪(2,5/2]. At two,T charges six and fails;just above two the lower whole-shipment rate can pass. The gap is real under the given tariff,not a missed calculation;do not assume continuity or fill it in. Zero costs zero,budget endpoints5/3 and5/2 are included,and weights outside[0,6] are not allowed.'
            : 'Each plan’s[0,3] and(3,8] partition the domain;three belongs only to the first. C retains the first three kg’s nine NZD and continues as2x+3. Its budget-ten sets are[0,3] and(3,7/2],union[0,7/2]. T gives[0,5/2] from4x≤10 and(3,5] from2x≤10,union[0,5/2]∪(3,5]. At three,T costs twelve and fails,but just above three the whole-shipment rate two may pass. Disconnection follows from the given price jump;do not smooth the graph or fill the budget gap. Endpoints7/2,5/2,five are included,threshold three uses only its first rule,zero costs zero and outside-domain inputs have no given rule.',
          '每段先解不等式再交“这一段的域”，最后取并；整件档价与累计费用的来源不同。',
          'Solve each segment then intersect THAT segment’s domain before unioning. Whole-shipment tier cost and accumulated cost have different sources.',
        ),
        contextTable: {
          caption: t(
            '给定虚构重量计费规则',
            'Given fictional weight-cost rules',
          ),
          columns: [
            t('方案与分段', 'Plan and segment'),
            t('允许重量x（kg）', 'Allowed weight x (kg)'),
            t('费用（NZD）', 'Cost (NZD)'),
          ],
          rows: [
            [
              t('C1 累计首段', 'C1 cumulative first'),
              t(`0≤x≤${first ? 2 : 3}`, `0≤x≤${first ? 2 : 3}`),
              t(first ? '2x' : '3x', first ? '2x' : '3x'),
            ],
            [
              t('C2 累计后段', 'C2 cumulative later'),
              t(
                `${first ? 2 : 3}<x≤${first ? 6 : 8}`,
                `${first ? 2 : 3}<x≤${first ? 6 : 8}`,
              ),
              t(first ? '4+(x−2)' : '9+2(x−3)', first ? '4+(x−2)' : '9+2(x−3)'),
            ],
            [
              t('T1 整件首档', 'T1 whole-shipment first'),
              t(`0≤x≤${first ? 2 : 3}`, `0≤x≤${first ? 2 : 3}`),
              t(first ? '3x' : '4x', first ? '3x' : '4x'),
            ],
            [
              t('T2 整件后档', 'T2 whole-shipment later'),
              t(
                `${first ? 2 : 3}<x≤${first ? 6 : 8}`,
                `${first ? 2 : 3}<x≤${first ? 6 : 8}`,
              ),
              t('2x', '2x'),
            ],
          ],
        },
      },
    ],
  };
};
export const logicFunctionRetrieval = {
  H25: makeSet('H25'),
  H26: makeSet('H26'),
};
