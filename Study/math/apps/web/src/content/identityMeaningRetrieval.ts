import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J95' | 'J96') => {
  const near = unit === 'J95',
    id = (n: number) => `${unit}-MAINT-IDENTITY-MEANING-Q${n}`;
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
        '先保原式和每个带符号项，画完整配对并逐对计算，再合并；具体试值只作检错。',
        'Retain the original expression and every signed term. Draw every pair, compute each product, then collect; substitutions only check examples.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时；允许口述或熟悉语言，读题协助与数学提示分开。生成自己的图和理由后再逐项人审。',
        'One numbered part or independent case per untimed sitting; oral or familiar-language responses are welcome. Separate reading help from mathematical hints. Review each part after generating your own diagrams and reasons.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '原条件：不同案例分别从原式开始；字母为实数，几何另遵正长度条件。',
        'Original conditions: restart from the original expression for each separate case. Letters are real; geometry additionally requires its stated positive lengths.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const factor = near ? '−(3/4)x' : '−(2/3)y',
    inside = near ? '2x−4y+6' : '3x−2y+5',
    result = near ? '−(3/2)x²+3xy−(9/2)x' : '−2xy+(4/3)y²−(10/3)y';
  const q1 = card(
    1,
    'monomial-every-term-product',
    '① 用F/I画外单项式连到三个完整带符号项，写三对各自的系数乘法与字母重复因子，完成并合并精确结果。特别解释负乘负、常数项中的外字母与分数系数；不同字母能合并指数吗？② 另从原I开始，把整个外因子分别改0及原F的相反数，逐项计算，再给最简结果；零因子与仅令一个变量为零有何区别？③ 本题要求展开并合并：原FI、未算系数的乘积、同底因子仍相乘、含0字母项，各在何处未完成？关系等值是否就满足形式要求？给乘法与同类项加法的各一例说明规则区别。',
    '① Use F/I to DRAW the outside monomial connected to all THREE signed terms. Write each coefficient product and repeated letter factors, then finish and collect the EXACT result. Explain negative times negative, the outside letter in the constant-term product and fractional coefficients. May different bases merge their exponents? ② Restart from original I, independently replacing the ENTIRE outside factor by zero and by the opposite of original F. Compute every term and simplify. How does a zero factor differ from setting only one variable to zero? ③ This task requests expansion AND collection. What remains unfinished in unchanged FI, unevaluated coefficient products, repeated same-base factors or zero letter terms? Does equivalence alone meet the form goal? Give a multiplication and a like-term addition example to distinguish their rules.',
    `原三对${near ? '(−3/4)×2·x·x=−(3/2)x²；(−3/4)×(−4)·x·y=3xy；(−3/4)×6·x=−(9/2)x' : '(−2/3)×3·y·x=−2xy；(−2/3)×(−2)·y·y=(4/3)y²；(−2/3)×5·y=−(10/3)y'}，合${result}。不同字母分开，同字母计因子；分数精确保留，不因负号把原常数抄回。零外因子每项都0，最简0；反F各项取反，得${near ? '(3/2)x²−3xy+(9/2)x' : '2xy−(4/3)y²+(10/3)y'}。仅令${near ? 'y=0仍余−(3/2)x²−(9/2)x，不必全0；x=0才因外x使全0' : 'x=0仍余(4/3)y²−(10/3)y，不必全0；y=0才因外y使全0'}。未展开、未乘完、未合并或未省零均可等值但未完成本题，不判作关系必错。例2x+3x=5x而(2x)(3x)=6x²，加法不连接重复因子。家长逐项核三对、分数符号、常数与字母，不按关键词或单个末值自动判理解。`,
    `Three pairs: ${near ? '(−3/4)×2·x·x=−(3/2)x²; (−3/4)×(−4)·x·y=3xy; (−3/4)×6·x=−(9/2)x' : '(−2/3)×3·y·x=−2xy; (−2/3)×(−2)·y·y=(4/3)y²; (−2/3)×5·y=−(10/3)y'}. Collect to ${result}. Count matching factors, retaining different bases and exact fractions; do not copy the original constant unchanged. Every product is zero with a zero outside factor, simplifying to 0. Opposite F negates EVERY product: ${near ? '(3/2)x²−3xy+(9/2)x' : '2xy−(4/3)y²+(10/3)y'}. Setting only ${near ? 'y=0 leaves −(3/2)x²−(9/2)x, not necessarily zero; x=0 makes the entire original product zero through its outside x' : 'x=0 leaves (4/3)y²−(10/3)y, not necessarily zero; y=0 makes the entire original product zero through its outside y'}. Unexpanded, unmultiplied, uncollected or redundant-zero forms may be equivalent yet unfinished for THIS task; do not call them necessarily false identities. For example 2x+3x=5x, while (2x)(3x)=6x²: addition does not concatenate factors. Review all three pairs, exact signs, constants and letters; keywords or a final value alone do not demonstrate reasoning.`,
  );
  table(q1, [
    ['F', '原外单项式', 'Original outside monomial', factor],
    ['I', '原三项式', 'Original trinomial', inside],
  ]);

  const product = near ? '(x+2y)(x−y+3)' : '(2a+b)(a−3b+2)',
    expanded = near ? 'x²+xy−2y²+3x+6y' : '2a²−5ab−3b²+4a+2b';
  const q2 = card(
    2,
    'all-pairs-polynomial-product',
    '① 给原式G做2行3列表，给行项、列项及六格分别编号，逐格写完整带符号乘积，再按字母部分合并。指出交叉项的不同来源、交换字母顺序为何不改变类型；只算四格或先删负项会丢什么？字母同名须同值。负项配对格能画成普通负面积砖吗？② 独立自创一幅虚构花园：任选正整数p、q≤3，长n+p米、宽n+q米，n>0。自己画四个不同位置的分块，标所有边与面积，推面积一般式及单位；再取n=2按同一长度比例画数值图，核四块和。不能只报某个n的面积代替一般式；一次吻合能证明恒等吗？不用实际测量或采购。',
    '① Make a TWO-row THREE-column table for original G. Label row terms, column terms and all SIX cells; write every signed product before collecting by variable part. Identify distinct cross-term sources and why reversing letter order yields like terms. What is lost by computing only four cells or dropping negative terms first? Every occurrence of the same letter has the same value. Can a signed cell be drawn as an ordinary negative-area tile? ② Independently DESIGN a fictional garden: choose positive integers p,q≤3, with length n+p metres, width n+q metres and n>0. DRAW four distinct regions, label all dimensions/areas, derive GENERAL area with units. At n=2 draw a numerical instance with a common length scale and check all four areas sum to the whole. A numerical area cannot replace the general relationship. Does one agreement prove identity? No physical measurement or purchase is needed.',
    `原G六对${near ? 'x²、−xy、3x；2yx、−2y²、6y，−xy+2yx=xy' : '2a²、−6ab、4a；ba、−3b²、2b，−6ab+ba=−5ab'}，合${expanded}。六格按两个来源区分，交换律使${near ? 'yx=xy' : 'ba=ab'}，不能因看见交叉项就省掉；两字母指数分别保留。带符号表是代数配对，负格不当普通负面积；分配对所有实数有效。自创接受任何给定范围内p/q及正确图，不要求照参考。四块n²、pn、qn、pq m²，面积n²+(p+q)n+pq m²；n=2块4、2p、2q、pq，外框(2+p)(2+q)。若示例p=1,q=3，面积n²+4n+3，n=2时块4/2/6/3合15m²。相同n各处同值，四区不重叠不漏，两轴同比例，量纲区分；完整分配解释一般关系，试值只检错。`,
    `G's SIX products: ${near ? 'x²,−xy,3x; 2yx,−2y²,6y, with −xy+2yx=xy' : '2a²,−6ab,4a; ba,−3b²,2b, with −6ab+ba=−5ab'}. Collect to ${expanded}. Each cell has distinct row/column provenance; commutativity gives ${near ? 'yx=xy' : 'ba=ab'}, not permission to omit cross terms. Retain separate-base exponents. Signed cells are algebraic pairings, not ordinary negative areas; distribution holds for all real assignments. Accept ANY chosen p/q in the stated range with a correct original drawing. Regions n²,pn,qn,pq m² sum to n²+(p+q)n+pq m². At n=2 the regions are 4,2p,2q,pq; outer area=(2+p)(2+q). An example p=1,q=3 gives area n²+4n+3; at two the four areas 4/2/6/3 total 15m². Every n has the same value, regions neither overlap nor leave gaps, axes use one length scale and units distinguish quantities. Complete distribution justifies the general identity; substitutions only check cases.`,
  );
  table(q2, [
    ['G', '原两项乘三项', 'Original binomial times trinomial', product],
    [
      'D',
      '自创条件',
      'Design conditions',
      '1≤p,q≤3; p,q∈ℤ; n>0; (n+p)m × (n+q)m',
    ],
  ]);

  const A = near ? '(1/2)x' : '(2/3)t',
    B = near ? 3 : 2,
    plus = near ? '(1/4)x²+3x+9' : '(4/9)t²+(8/3)t+4',
    minus = near ? '(1/4)x²−3x+9' : '(4/9)t²−(8/3)t+4',
    conjugate = near ? '(1/4)x²−9' : '(4/9)t²−4',
    different = near ? '(1/2)x²+(3/2)x−9' : '(8/9)t²+(4/3)t−4',
    mental = near ? '49×51' : '198×202';
  const q3 = card(
    3,
    'square-and-conjugate-whole-terms',
    '① 按表的完整A/B，分别从四对乘积展开P、M、C并合并，先给一般A/B推导，再代入表中整体。分数的分母、系数和字母怎样一起平方？比较两交叉项和末项符号，不能只抄两端平方。② A>0时自己画P的正方形四块，两块交叉面积相等是否代表同一块数两次？代数公式是否因此也要求A>0？③ N仅改变第二括号首项，完整配对，判断是否仍可直接套A²−B²。分别在A=0、A=1核N/C；一次吻合是否证明两式相同？保B原值，不能为凑公式改条件。④ 给整数积K找共同中心和相反偏移，用平方差算精确数值并写等号链；说明平方的是哪个完整量，不能把差的平方混进来。',
    '① With the WHOLE A/B in the table, expand and collect P,M,C from all FOUR pairs. First derive generally in A/B, then substitute the entire specified terms. How are the denominator, coefficient and letter squared together? Compare cross-term and final-term signs; do not copy only the end squares. ② For A>0 DRAW P as a square partitioned into four regions. Do the two equal cross areas count the same region twice? Does that picture also restrict the algebra to A>0? ③ N changes ONLY the second factor’s first term: fully expand it and decide whether A²−B² still applies directly. Check N/C at A=0 and A=1, retaining original B. Does one agreement prove equality? Do not alter conditions to force a formula. ④ For integer product K identify a common centre and opposite offsets, use a difference of squares for the EXACT value and show the equality chain. Which whole quantities are squared? Distinguish a squared difference.',
    `P四对A²/AB/BA/B²得A²+2AB+B²；M为A²/−AB/−BA/B²得A²−2AB+B²；C为A²/−AB/BA/−B²得A²−B²。代完整A=${A},B=${B}分别得P=${plus}，M=${minus}，C=${conjugate}；平方分母与系数一起，交叉项保2倍完整乘积。P图边A+B、两方向各分A与B，四块A²/AB/BA/B²，各不同位置；A>0且B>0正长，代数三式对所有实数A、B有效。N=2A²−AB+2AB−B²=2A²+AB−B²，代入${different}，首项不相同，不能直接套共轭。在A=0时N/C均−${B * B}，A=1时N=${2 + B - B * B}、C=${1 - B * B}，已给反例；不能据0巧合认证。K=${near ? '(50−1)(50+1)=50²−1²=2499' : '(200−2)(200+2)=200²−2²=39996'}。不是把两因子各平方，也不是(中心−偏移)²；依据完整结构/分配，而非若干代值。所有要求仍由人逐项审核。`,
    `P's four products A²,AB,BA,B² give A²+2AB+B². M's A²,−AB,−BA,B² give A²−2AB+B². C's A²,−AB,BA,−B² give A²−B². Substitute WHOLE A=${A},B=${B}: P=${plus}, M=${minus}, C=${conjugate}. Square the coefficient/denominator together, retaining twice the entire cross product. P has side A+B partitioned into A/B on BOTH axes, forming distinct regions A²,AB,BA,B². Equal cross areas occupy distinct places. The positive picture uses A>0,B>0; the three algebraic identities hold for all real A and B. N=2A²−AB+2AB−B²=2A²+AB−B², giving ${different}: its first terms differ, so the conjugate shortcut fails. At A=0 both N/C equal −${B * B}; at A=1 N=${2 + B - B * B}, C=${1 - B * B}, a counterexample. Zero agreement cannot prove equality. K=${near ? '(50−1)(50+1)=50²−1²=2499' : '(200−2)(200+2)=200²−2²=39996'}. Square the common centre and offset, not both original factors, and distinguish (centre−offset)². Complete structure/distribution justifies identities, not finite agreements. Human review checks every requested part.`,
  );
  table(q3, [
    ['A/B', '完整整体', 'Whole terms', `A=${A}; B=${B}`],
    ['P', '和的平方', 'Squared sum', '(A+B)²'],
    ['M', '差的平方', 'Squared difference', '(A−B)²'],
    ['C', '和差乘积', 'Conjugate product', '(A+B)(A−B)'],
    ['N', '独立非共轭乘积', 'Separate nonconjugate product', '(A+B)(2A−B)'],
    ['K', '独立整数积', 'Separate integer product', mental],
  ]);
  return {
    id: `${unit}-MAINT-IDENTITY-MEANING`,
    unit,
    title: t(
      '完整配对、整体平方与结构检查',
      'Every term pair, whole-term squares and structural checks',
    ),
    intro: t(
      '三张纸笔卡，一次一个编号/案例，可分次、不计时。第1卡共享单项式乘法/分配，第3卡共享完全平方/平方差；先自己生成精确式、图与理由，再逐项人审。允许口述/熟悉语言，阅读帮助与数学提示分开；花园虚构，无需实测或购买。',
      'Three paper cards, one numbered part/case per untimed sitting. Card one shares monomial multiplication/distribution; card three shares perfect squares/conjugates. Generate exact expressions, drawings and reasons before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. The fictional garden needs no measurement or purchase.',
    ),
    bridge: 'J81-L02',
    bridgeByQuestion: Object.fromEntries(
      [2, 3, 4].map((l, i) => [id(i + 1), `J81-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const identityMeaningRetrieval = {
  J95_IDENTITY_MEANING: makeSet('J95'),
  J96_IDENTITY_MEANING: makeSet('J96'),
};
