import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J95' | 'J96') => {
  const near = unit === 'J95',
    id = (n: number) => `${unit}-MAINT-FACTOR-MEANING-Q${n}`;
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
        '保全部原项与符号，先核共同数因子及每个字母的最低次数，再认结构；最后完整乘回逐类比系数。',
        'Retain every original signed term. Check numerical content and each letter’s minimum exponent before recognising patterns; expand back and compare every variable-part coefficient.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时；允许口述或熟悉语言，阅读协助与数学提示分开。先给自己的式、图与理由，再逐项人审。',
        'One numbered part or separate case per untimed sitting. Oral or familiar-language responses are welcome; separate reading assistance from mathematical hints. Generate your own expressions, drawings and reasons before human review.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '原条件：各行案例独立，保原系数与符号。代数用实数变量，分解目标为整数系数；面积另限正长度。',
        'Original conditions: rows are independent cases. Retain all coefficients and signs. Variables are real and factorisation targets integer coefficients; area models additionally require positive lengths.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原式或条件', 'Original expression or conditions'),
      ],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const original = near ? '−12x²y+18xy²−6xy' : '−20ab²+30a²b−10ab',
    g = near ? '6xy' : '10ab',
    remainder = near ? '−2x+3y−1' : '−2b+3a−1',
    negativeRemainder = near ? '2x−3y+1' : '2b−3a+1',
    small = near ? '3xy' : '5ab',
    excessive = near ? '6x²y' : '10ab²';
  const q1 = card(
    1,
    'signed-multivariable-common-factor',
    '① 对G的全部三项按“数系数/每种字母次数”列表，给最大公因式的共同性与最大性理由。分别提出数系数为正、负的最大因子，写所有余项，完整乘回；余项为−1或1能省掉吗？为什么不能只看第一项或总次数？② 对候选C、E逐项判断：有效但非最大、最大，还是不能在整数整式范围提取？指出哪个原项使E失败，不靠某次变量碰巧取1判断。③ 两个合法分解的外因子互为相反数，括号如何同时改变？只改外部号会怎样？分别令任一字母0检验恒等关系；这一步和除以可能为零的变量、或把分解交成零点列表，有何区别？',
    '① For ALL THREE G terms, tabulate coefficient and the exponent of EACH base. Justify both commonness and greatest content. Extract greatest factors with positive and negative numerical coefficients separately, write EVERY remainder and expand back. May a remainder −1 or 1 disappear? Why are the first term or total degree alone insufficient? ② Test candidates C/E term by term: common but nongreatest, greatest, or not extractable over integer polynomials? Identify a source term that makes E fail, without relying on a variable coincidentally equalling one. ③ How must the bracket change when the outside factor changes sign? What if only the outside sign changes? Separately set either letter to zero and check the identities. Contrast this with division by a possibly zero variable or submitting equation roots instead of a factorisation.',
    `G数系数绝对GCD为${near ? 6 : 10}，两个字母各项最低次数都1，数系数为正的因子${g}；正提得${g}(${remainder})，负提得−${g}(${negativeRemainder})。三余项${near ? '−2x、3y、−1' : '−2b、3a、−1'}，第三项整个因子被提出后仍有−1，不是没有这一项；负提后为1。${small}是共同非最大因子，余项仍公有2；${excessive}超过某项共同次数，${near ? '18xy²与−6xy缺第二个x' : '30a²b与−10ab缺第二个b'}，会出现变量分母，不是本题整式分解。两个合法式须内外一起改号，每项乘回原G；只改外号给−G。原两变量任何一个为0两边均0，未用变量除法，不排零。完整乘积不是一列变量根；字母的最低次数逐种核，不拿总次数代替。`,
    `The absolute coefficient GCD is ${near ? 6 : 10}; EACH letter has minimum shared exponent one. The positive-coefficient factor ${g} gives ${g}(${remainder}); its negative gives −${g}(${negativeRemainder}). Remainders are ${near ? '−2x,3y,−1' : '−2b,3a,−1'}. The final term still contributes −1, or +1 with the negative extraction; extracting the entire term does not delete it. ${small} is common but leaves numerical factor two. ${excessive} overextracts: ${near ? '18xy² and −6xy have no second x' : '30a²b and −10ab have no second b'}, introducing a variable denominator outside polynomial form. Changing both outside and inside signs preserves every original term; changing only the outside gives −G. Either original letter zero makes both sides zero. No variable division occurred, so zero is retained. Supply a complete product rather than a root list; check each base separately rather than its total degree.`,
  );
  table(q1, [
    ['G', '原三项式', 'Original trinomial', original],
    ['C', '候选共同因子', 'Candidate common factor', small],
    ['E', '候选过提因子', 'Candidate excessive factor', excessive],
  ]);

  const D = near ? '8x²−18y²' : '12a²−27b²',
    S = near ? '8x²−24xy+18y²' : '12a²+36ab+27b²',
    c = near ? 2 : 3,
    A = near ? '2x' : '2a',
    B = near ? '3y' : '3b',
    middle = near ? '−24xy' : '36ab',
    sign = near ? '−' : '+',
    opposite = near ? '+' : '−',
    sum = near ? 'x²+9' : 'a²+16',
    constant = near ? 9 : 16;
  const q2 = card(
    2,
    'whole-square-factor-patterns',
    '① D、S各先提数公因子，再识别完整A/B和中项，写整数范围完整因式并展开回原式。为什么平方根的系数不是原平方项系数？D和S能用同一乘积吗，S末项正就一定取加号吗？② 独立只把原S的中项改相反数，重新分解。把两种平方各写成重复因子和幂两种形式；把每个重复因子同时改号，乘积如何？对D另交换因式顺序、再把两个因式同时改号，最后说明只改一个因式的错误。③ 对独立P，证明它不能写成两个整数一次因式：先由首项系数1把符号归一为(w+r)(w+s)，列和/积要求，用s=−r说明矛盾。不能只说“平方和不套公式”；这个整数范围结论能推广所有数域吗？几何面积的正边条件是否限制一般代数恒等？',
    '① For EACH D/S extract common numerical content, identify WHOLE A/B and check the middle, then give complete integer factors and expand back. Why is a square-root coefficient not the squared-term coefficient? Can D/S use the same product? Does S’s positive final term force a plus inside its square? ② Independently negate ONLY original S’s middle term and factor again. Write both squares as repeated products and powers; negate BOTH repeated factors and explain the product. For D reorder its factors, then negate BOTH, and explain the error of negating only one. ③ For separate P PROVE it has no two integer linear factors. Use leading coefficient one to normalise signs to (w+r)(w+s), derive sum/product conditions, then contradict them using s=−r. Saying only “the sum-of-squares formula fails” is insufficient. Does this integer-scope conclusion apply to every number domain? Do positive geometric lengths restrict the general algebraic identities?',
    `D=${c}(${A}−${B})(${A}+${B})；S=${c}(${A}${sign}${B})²，中项${middle}=${near ? '−' : ''}2·${c}·(${A})·(${B})。两个完整平方根项分别是${A}、${B}，须连系数一起平方，不能把8/12直接当根系数。S中项取反后为${c}(${A}${opposite}${B})²；末项两式都正，号由中项控制。平方是同一个因式两次；(${A}${sign}${B})与其整体相反数的平方相同，因两负号相乘正。D因式交换或两个同时改号保乘积；只改一个给−D。所有数公因子${c}保外，每个系数/交叉项/末项乘回核全。P若有整数一次分解，首项系数乘1只有同为1或−1，平衡两负可归一；需r+s=0且rs=${constant}，s=−r却rs=−r²≤0，与正${constant}矛盾。故P无这种整数一次分解，不能把结论扩大到所有数域。图只在各边正时解释面积；上述恒等对所有原实数变量成立，包含零和负值。`,
    `D=${c}(${A}−${B})(${A}+${B}); S=${c}(${A}${sign}${B})², with middle ${middle}=${near ? '−' : ''}2·${c}·(${A})·(${B}). Whole roots are ${A} and ${B}; square their coefficients too, rather than using eight/twelve as a root coefficient. Reversing ONLY S’s middle gives ${c}(${A}${opposite}${B})². Both final terms remain positive; the middle decides the sign. A square is a product of the same factor twice. Negating both repeated factors preserves it. Reordering D’s factors or negating BOTH preserves its product; negating one gives −D. Keep outside content ${c} and expand every coefficient, cross term and constant back. If P had integer linear factors, leading coefficients multiply to one and hence are both +1 or both −1; balancing the negatives normalises them. Then r+s=0 and rs=${constant}, but s=−r implies rs=−r²≤0, contradicting positive ${constant}. This rules out those integer linear factors, without a claim about every number domain. Pictures need positive sides; the algebraic identities retain ALL original real assignments, including zero and negative values.`,
  );
  table(q2, [
    ['D', '原平方差', 'Original difference of squares', D],
    ['S', '原三项式', 'Original trinomial', S],
    ['P', '独立平方和', 'Separate sum of squares', sum],
  ]);

  const variable = near ? 'x' : 't',
    q = near ? 12 : 10,
    positive = near ? [3, 4] : [2, 5],
    nonmonic = near ? '2x²+7x+3' : '3t²+7t+2',
    exampleProduct = near ? '(2x+1)(x+3)' : '(3t+1)(t+2)',
    pairText = near
      ? '(−12,−1):−13; (−6,−2):−8; (−4,−3):−7; (1,12):13; (2,6):8; (3,4):7'
      : '(−10,−1):−11; (−5,−2):−7; (1,10):11; (2,5):7';
  const q3 = card(
    3,
    'integer-pairs-and-independent-design',
    '① 对R的正常数亲列所有无序整数乘积对，逐对写和，解释怎样保证不漏负对/不重次序；分别为R+和R−选同时满足两条件的对，完整分解并乘回。对独立Z给重复因子乘积，不列根。② N的首项系数不是1，原monic积和规则能照搬吗？直接展开表中给定候选C，核所有系数，说明这是核特定因式，未由此建立任意非monic式的通用算法。③ U的常数1，穷尽整数乘积对并核和，给本题整数一次因式范围的结论；不能用只试几个变量值来证明。④ 另自创三幅虚构花园：自己选整数k∈{2,3}及1≤u<v≤3，亲写G=kw²+kuw、S=w²+2uw+u²、T=w²+(u+v)w+uv三种面积和式，分解找边长，画正长分块并全部展开回查；图取w>0，代数域另说。针对自己T设计一个在w=0吻合却非恒等的错误乘积，给别处反例及系数理由；另写一个等值未完成G分解，解释下一步。一次一案例，不需实测/购买。',
    '① For R’s positive constant LIST EVERY unordered integer product pair and its sum. Explain completeness, negative pairs and reversed-order duplicates. Select pairs meeting BOTH constraints for R+ and R−, factor fully and expand back. Give a repeated-factor PRODUCT for separate Z, not roots. ② N is nonmonic: may the original monic offset rule be copied unchanged? Expand supplied candidate C and check every coefficient. Explain that verifying these specific factors does not establish a universal algorithm for nonmonic polynomials. ③ For U’s constant one, exhaust integer product pairs and check their sums. Conclude within the stated integer-linear-factor scope; trying a few variable values cannot prove it. ④ Independently DESIGN three fictional gardens. Choose integers k∈{2,3},1≤u<v≤3, write area sums G=kw²+kuw, S=w²+2uw+u² and T=w²+(u+v)w+uv. Factor to identify sides, DRAW positive-length partitions and expand ALL terms back. Use w>0 for the pictures and state the algebraic domain separately. Create a false PRODUCT agreeing with YOUR T at w=0 but not identically; give another-input counterexample and a coefficient reason. Also show an equivalent unfinished G factorisation and explain the next step. One case per sitting; no measurement or purchase.',
    `R完整无序整数对及和：${pairText}；正积两数同号，按常数${q}的正因数成对列并保两种符号、次序不重，有限表才穷尽。R+选${positive[0]},${positive[1]}，R−选−${positive[0]},−${positive[1]}，分别(${variable}+${positive[0]})(${variable}+${positive[1]})与(${variable}−${positive[0]})(${variable}−${positive[1]})；两类系数全匹配。Z=${variable}·${variable}=${variable}²，偏移0/0，不必列无穷积零对或交根0。C全展开回${nonmonic}，首项${near ? 2 : 3}非1；(w+r)(w+s)的首项恒为w²，不能直接用原monic规则代替此式核验。U积1仅(−1,−1)与(1,1)，和−2/2都非${near ? 1 : '−1'}，无两个整数一次因式；不是有限试变量，更不泛称所有数域。自创接受任何给定范围的k/u/v，三个完整乘积kw(w+u)、(w+u)²、(w+u)(w+v)。图边均正且分块不重不漏，面积单位平方，代数恒等所有实w。可示例k2/u2/v3：G=2w²+4w=2w(w+2)，S w²+4w+4=(w+2)²，T w²+5w+6=(w+2)(w+3)。错乘积(2w+2)(w+3)在0同6，1给16而原12；一般差w²+3w非零。G写2(w²+2w)等值但括号仍共w，须继续。其他正确自主构造、反例与未完成例均接受，不要求照抄示例。`,
    `ALL unordered R pairs/sums: ${pairText}. A positive product needs equal signs; pair positive divisors of the constant ${q} and retain both sign choices without reversed duplicates. R+ selects ${positive[0]},${positive[1]}; R− selects −${positive[0]},−${positive[1]}, giving (${variable}+${positive[0]})(${variable}+${positive[1]}) and (${variable}−${positive[0]})(${variable}−${positive[1]}). Expand every coefficient back. Z=${variable}·${variable}=${variable}², offsets zero/zero, without an infinite product-zero list or a root answer. Expanding C restores ${nonmonic}, whose leading coefficient ${near ? 2 : 3} is not one. (w+r)(w+s) always has leading term w²; do not copy its monic rule over this check. U’s product-one pairs are ONLY (−1,−1),(1,1), with sums −2/two, neither ${near ? 'one' : 'negative one'}. Thus there are no two integer linear factors in this setting, not a proof by sampled variable values or a claim about all number domains. Accept ANY permitted original k/u/v construction. Complete products: kw(w+u),(w+u)²,(w+u)(w+v). Positive-side partitions neither overlap nor leave gaps; areas use square units, while the identities hold for all real w. Example k=2,u=2,v=3: G=2w²+4w=2w(w+2), S=w²+4w+4=(w+2)², T=w²+5w+6=(w+2)(w+3). False product (2w+2)(w+3) agrees at zero with six, but at one gives sixteen rather than twelve; its general difference w²+3w is not zero. Unfinished G=2(w²+2w) retains common w. Other valid constructions, counterexamples and unfinished examples count; copying this example is not required.`,
  );
  table(q3, [
    [
      'R+',
      '原正中项二次式',
      'Original positive-middle quadratic',
      `${variable}²+7${variable}+${q}`,
    ],
    [
      'R−',
      '独立负中项二次式',
      'Separate negative-middle quadratic',
      `${variable}²−7${variable}+${q}`,
    ],
    ['Z', '独立纯平方', 'Separate pure square', `${variable}²`],
    ['N', '独立非monic原式', 'Separate nonmonic source', nonmonic],
    ['C', 'N的待核候选', 'Candidate for N', exampleProduct],
    [
      'U',
      '独立无整数配对案例',
      'Separate no-integer-pair case',
      `${variable}²${near ? '+' : '−'}${variable}+1`,
    ],
    [
      'D',
      '自主构造条件',
      'Design conditions',
      'k∈{2,3}; 1≤u<v≤3; k,u,v∈ℤ; w>0',
    ],
  ]);
  return {
    id: `${unit}-MAINT-FACTOR-MEANING`,
    unit,
    title: t(
      '原项、整数因式与自主结构',
      'Original terms, integer factors and independent structure',
    ),
    intro: t(
      '三张纸笔卡，一次一个编号或案例，可分次、不计时。第2卡共享平方差/完全平方，第3卡共享积和/完整回查。保原式、先自己列因式和图，再逐项人审；允许口述/熟悉语言，阅读协助与数学提示分开。花园虚构，无须实测或采购。',
      'Three paper cards, one numbered part/case per untimed sitting. Card two shares difference/perfect-square patterns; card three shares integer-pair search and complete checking. Retain originals and generate factors/drawings before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Fictional gardens need no measurement or purchase.',
    ),
    bridge: 'J82-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 3, 4].map((l, i) => [id(i + 1), `J82-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const factorMeaningRetrieval = {
  J95_FACTOR_MEANING: makeSet('J95'),
  J96_FACTOR_MEANING: makeSet('J96'),
};
