import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  complex,
  complexText,
  powerI,
  squareEquationRoots,
  realOrNonreal,
  pureImaginary,
  conjugateComplex,
  squareModulus,
  applyComplexOperation,
  transformComplex,
  type ComplexCode,
} from '../complexModels';
import { textR } from '../algebraModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'number', value }, step, wrong);
const Z = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'complex', value, standard: true }, step, wrong);
const S = (stem: Pair, values: string[], step: Pair, wrong: string[]) =>
  I(
    stem,
    {
      kind: 'complex-set',
      values,
      value: values.length ? `{${values.join(',')}}` : '∅',
    },
    step,
    wrong,
  );
const C = (stem: Pair, value: ComplexCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'complex-code', value }, step, wrong);
const R = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'radical', value }, step, wrong);
const P = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'coordinate', value }, step, wrong);
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  skill: string;
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['为什么需要虚数单位i', 'Why the imaginary unit i exists'],
    objective: [
      '声明数域，用i²=−1检验平方方程的全部根和i的整数幂。',
      'State the number domain and use i²=−1 to check every root of square equations and integer powers of i.',
    ],
    hook: [
      '实数平方非负，那么z²=−4该说无解，还是先问允许在哪个数域？',
      'Real squares are nonnegative. For z²=−4, should we say no solution or first ask which number domain is allowed?',
    ],
    prerequisites: ['J91-L01', 'J92-L01', 'J81-L01'],
    keywords: [
      ['虚数单位', 'imaginary unit'],
      ['数域', 'number domain'],
      ['全部根', 'all roots'],
    ],
    lab: 'complex-roots',
    skill: 'complex-domain-square-cycle',
    hints: [
      [
        '实数域内平方非负；复数域引入固定的i满足i²=−1。i本身不是±i这个解集。',
        'Real squares are nonnegative; complex arithmetic introduces a fixed i with i²=−1. The number i is not the set ±i.',
      ],
      [
        '把候选根逐个平方代回；非零相反根都要保留，i的幂按四步循环。',
        'Square each candidate to check the original equation, retaining opposite nonzero roots. Powers of i follow a four-step cycle.',
      ],
    ],
    items: [
      S(
        [
          '在复数域求z²=−4的全部根。',
          'Find every root of z²=−4 in the complex numbers.',
        ],
        ['2i', '-2i'],
        [
          '(2i)²=(−2i)²=−4，两个不同根为±2i。',
          'Both (2i)² and (−2i)² equal −4, so the two distinct roots are ±2i.',
        ],
        ['2i', '-2i', '2,-2', '∅'],
      ),
      Z(
        [
          '化简i⁷，答案不要保留未算的幂。',
          'Simplify i⁷, leaving no unevaluated power.',
        ],
        '-i',
        ['i⁷=i⁴i³=1×(−i)=−i。', 'i⁷=i⁴i³=1×(−i)=−i.'],
        ['i', '-1', 'i^7'],
      ),
      Z(
        ['求i⁰的化简值。', 'Give the simplified value of i⁰.'],
        '1',
        [
          'i非零，所以i⁰=1；指数0不是把底数变0。',
          'Since i is nonzero, i⁰=1; exponent zero does not make the base zero.',
        ],
        ['0', 'i', 'i^0'],
      ),
      S(
        [
          '只允许实数时，x²=−9的解集是什么？',
          'What is the solution set of x²=−9 when only real numbers are allowed?',
        ],
        [],
        [
          '任意实数平方非负，故在实数域无解；复数域的结论不同。',
          'Every real square is nonnegative, so the real solution set is empty; complex solutions are a different-domain question.',
        ],
        ['3i,-3i', '3,-3', '0'],
      ),
      S(
        [
          '在复数域求z²=0的全部不同根。',
          'Find all distinct complex roots of z²=0.',
        ],
        ['0'],
        [
          '只有z=0；写±0并不产生两个不同根。',
          'Only z=0 works; ±0 does not create two distinct roots.',
        ],
        ['∅', 'i,-i', '1,-1'],
      ),
      E(
        [
          '采用主平方根约定sqrt(−1)=i、sqrt(1)=1，有人写sqrt(−1)·sqrt(−1)=sqrt(1)=1。核对两边，指出搬用了什么不满足前提的法则。',
          'Using principal-square-root conventions sqrt(−1)=i and sqrt(1)=1, someone writes sqrt(−1)·sqrt(−1)=sqrt(1)=1. Check both sides and identify the unjustified rule.',
        ],
        [
          '左边i·i=i²=−1，右边sqrt(1)=1，不相等。实数根式乘法sqrt(a)sqrt(b)=sqrt(ab)在a,b≥0时有效，不能不查条件直接延到两个负数的主平方根；这不推翻分配律或i²=−1。',
          'The left side is i²=−1, while the right side is one. The real identity sqrt(a)sqrt(b)=sqrt(ab) applies to nonnegative real a,b and cannot be transferred indiscriminately to principal roots of negative numbers. This does not invalidate distributive arithmetic or i²=−1.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于i与方程z²=−1，哪句正确？',
        'Which statement correctly distinguishes i from z²=−1?',
      ],
      options: [
        [
          'i这个数会在每次计算时自由选正负',
          'The number i freely changes its sign between calculations',
        ],
        [
          'i是固定虚数单位，方程另有−i这个根',
          'i is a fixed imaginary unit and the equation also has root −i',
        ],
        [
          '复数域中该方程只有i一个根',
          'The equation has only root i over the complex numbers',
        ],
      ],
      feedback: [
        [
          '选定i后运算一致，不能中途把它换成−i。',
          'Once i is chosen, use it consistently rather than changing it during arithmetic.',
        ],
        [
          'i²=(−i)²=−1，但i与−i是两个不同的数。',
          'i²=(−i)²=−1, with two distinct numbers.',
        ],
        [
          '漏掉−i；求全部根与选定主平方根不同。',
          'This omits −i; finding all roots differs from choosing a principal root.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '“x²+1=0在实数域无解”与“z²+1=0在复数域有根”矛盾吗？',
      'Do no real solutions to x²+1=0 contradict complex solutions to z²+1=0?',
    ],
    rubric: [
      '不矛盾，允许的数域不同。实数平方非负，所以x²+1≥1；复数域中i²+1=0且(−i)²+1=0。扩大数域增加可用元素，不把某个实数平方改成负数。',
      'There is no contradiction because the domains differ. For real x, x²+1≥1. In complex arithmetic both i and −i square to −1. Extending the domain adds elements; it does not make any real square negative.',
    ],
    prompts: [
      [
        '你求的是一个选定的数，还是方程的全部根？',
        'Are you identifying one chosen number or every equation root?',
      ],
      [
        '“无解”这句话省略了哪个数域？',
        'Which number domain is missing from the phrase no solution?',
      ],
    ],
    misconception: [
      '把i当±i、漏负根或无条件套用实数根式乘法。',
      'Treating i as ±i, omitting the opposite root or extending real root laws without their conditions.',
    ],
  },
  {
    title: ['复数的实部与虚部', 'Real and imaginary parts'],
    objective: [
      '从唯一的a+bi表示读实部a、虚部系数b，并按两部分判断相等。',
      'Read real part a and imaginary coefficient b from a unique a+bi representation, comparing both parts for equality.',
    ],
    hook: [
      '3−2i的虚部是−2，还是−2i？没有写出的实部是否等于0？',
      'Is the imaginary part of 3−2i equal to −2 or −2i? What is an unwritten real part?',
    ],
    prerequisites: ['H21-L01', 'J75-L01', 'J73-L01'],
    keywords: [
      ['实部', 'real part'],
      ['虚部', 'imaginary part'],
      ['两部分相等', 'equality of components'],
    ],
    lab: 'complex-components',
    skill: 'complex-coefficients-equality',
    hints: [
      [
        '先写成a+bi，a与b都是实数；Im(z)=b，不是bi。省略的部分补0。',
        'Write a+bi with real a,b. Im(z)=b, not bi; insert zero for an omitted component.',
      ],
      [
        '两个复数相等须实部与虚部系数分别相等；b=0为实数，纯虚数另要求a=0且b≠0。',
        'Equality requires both components to match. b=0 makes a real number; purely imaginary additionally requires a=0,b≠0.',
      ],
    ],
    items: [
      N(
        [
          '求Im(3−2i)，只填实系数。',
          'Find Im(3−2i), giving only its real coefficient.',
        ],
        '-2',
        [
          '3−2i=3+(−2)i，所以虚部为−2。',
          '3−2i=3+(−2)i, so the imaginary part is −2.',
        ],
        ['-2i', '2', '3'],
      ),
      N(
        ['求Re(1/2+3i)。', 'Find Re(1/2+3i).'],
        '1/2',
        ['实部是不带i的实系数1/2。', 'The real coefficient is 1/2.'],
        ['3', '1/2+3i'],
      ),
      N(
        ['求Re(−4i)。', 'Find Re(−4i).'],
        '0',
        ['−4i=0+(−4)i，实部0。', '−4i=0+(−4)i, giving real part zero.'],
        ['-4', '4'],
      ),
      N(
        [
          '把5视为复数，求Im(5)。',
          'Treat five as a complex number and find Im(5).',
        ],
        '0',
        [
          '5=5+0i，虚部0；实数包含在复数中。',
          '5=5+0i, so its imaginary part is zero; real numbers are included among complex numbers.',
        ],
        ['5', 'i'],
      ),
      P(
        [
          'x,y为实数，(x+1)+(2y)i=3−4i。求有序数对(x,y)。',
          'For real x,y, (x+1)+(2y)i=3−4i. Find the ordered pair (x,y).',
        ],
        '(2,-2)',
        [
          'x+1=3、2y=−4，所以x=2、y=−2；代回原式核对。',
          'Matching components gives x+1=3 and 2y=−4, so (x,y)=(2,−2); substitute back.',
        ],
        ['(3,-4)', '(2,-4)', '(-2,2)'],
      ),
      E(
        [
          'x,y为实数，2x+(y−1)i=6+3i。解释如何求x,y并代回；为什么只核实部不够？',
          'For real x,y, 2x+(y−1)i=6+3i. Explain how to find and verify x,y, and why matching only the real parts is insufficient.',
        ],
        [
          '分别比较得2x=6、y−1=3，所以x=3、y=4；代回6+3i完全一致。若只核实部，x=3但任意y都会通过，无法保证虚部3，因此不是完整复数相等的证据。',
          'Match 2x=6 and y−1=3, giving x=3,y=4. Substitution yields 6+3i. Matching only the real parts would leave arbitrary y and would not guarantee imaginary coefficient three, so it would not prove complex equality.',
        ],
      ),
    ],
    pick: {
      stem: [
        '本单元纯虚数要求实部0、虚部非0。关于0，哪句正确？',
        'Here purely imaginary means real part zero and nonzero imaginary coefficient. Which statement about zero is correct?',
      ],
      options: [
        ['0不是复数', 'Zero is not complex'],
        [
          '0是纯虚数，因为实部0',
          'Zero is purely imaginary because its real part is zero',
        ],
        [
          '0=0+0i是实数，也属于复数，但不是本定义的纯虚数',
          '0=0+0i is real and complex, but not purely imaginary under this definition',
        ],
      ],
      feedback: [
        [
          '0有合法a+bi表示，实数包含在复数中。',
          'Zero has an a+bi representation; real numbers are complex numbers too.',
        ],
        [
          '还须虚部非0，不能只查一个条件。',
          'The imaginary coefficient must also be nonzero.',
        ],
        [
          '实数允许b=0，纯虚数按本单元约定排除0。',
          'Real numbers have b=0; the stated purely imaginary convention excludes zero.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '有人说“虚轴上的点坐标不是实数，所以不能写(0,2)”。这对吗？',
      'Someone claims that coordinates on the imaginary axis are not real numbers, so (0,2) is invalid. Is that correct?',
    ],
    rubric: [
      '不对。复数2i对应点(0,2)，两坐标都是实数，第二坐标是虚部系数2；数值2与虚数项2i有不同角色。虚轴刻度标的是这个实系数，不把坐标写成(0,2i)。',
      'No. The complex number 2i corresponds to point (0,2), whose coordinates are real numbers. The second is imaginary coefficient two, distinct from the term 2i. Axis coordinates use the coefficient, not (0,2i).',
    ],
    prompts: [
      [
        'Im(z)是一个实数系数，还是含i的一整项？',
        'Is Im(z) a real coefficient or the full term containing i?',
      ],
      [
        '两边实部相同后，虚部是否也相同？',
        'After matching real parts, do the imaginary coefficients match too?',
      ],
    ],
    misconception: [
      '把bi当虚部，把未写部分当不存在，或只比一部分就判相等。',
      'Calling bi the imaginary part, ignoring implicit zeros or comparing only one component.',
    ],
  },
  {
    title: ['复数加减乘', 'Complex addition, subtraction and multiplication'],
    objective: [
      '用分配律与i²=−1完成复数加减乘，再合并为a+bi。',
      'Use distribution and i²=−1 to add, subtract and multiply complex numbers, collecting into a+bi.',
    ],
    hook: [
      '(2+i)(3−2i)中两项含i的乘积会贡献实数吗？',
      'Does the product of the two imaginary terms in (2+i)(3−2i) contribute a real value?',
    ],
    prerequisites: ['H21-L02', 'J81-L03', 'J81-L04'],
    keywords: [
      ['分配律', 'distributive law'],
      ['i的平方', 'square of i'],
      ['合并', 'collecting terms'],
    ],
    lab: 'complex-operations',
    skill: 'complex-distribution-collection',
    hints: [
      [
        '加减按实部/虚部合并，减号作用于整个括号；乘法每项都与另一括号每项相乘。',
        'Combine components for addition/subtraction, distributing the minus over the whole bracket; multiply every term across both brackets.',
      ],
      [
        'bi·di=bd i²=−bd，再收集实部与虚部；不要按坐标逐项相乘。',
        'bi·di=bd i²=−bd. Then collect the two components rather than multiplying coordinates componentwise.',
      ],
    ],
    items: [
      Z(
        [
          '化简(2+i)(3−2i)，写a+bi形式。',
          'Simplify (2+i)(3−2i) into a+bi form.',
        ],
        '8-i',
        [
          '分配得6−4i+3i−2i²=6−i+2=8−i。',
          'Distribution gives 6−4i+3i−2i²=6−i+2=8−i.',
        ],
        ['4-i', '6-i', '(2+i)(3-2i)'],
      ),
      Z(
        ['化简(3−2i)+(−1+4i)。', 'Simplify (3−2i)+(−1+4i).'],
        '2+2i',
        [
          '实部3−1=2，虚部−2+4=2。',
          'The real coefficients give 3−1=2 and imaginary coefficients −2+4=2.',
        ],
        ['2+6i', '4+2i'],
      ),
      Z(
        ['化简(3−2i)−(1+3i)。', 'Simplify (3−2i)−(1+3i).'],
        '2-5i',
        ['去括号得3−2i−1−3i=2−5i。', 'Distribute subtraction: 3−2i−1−3i=2−5i.'],
        ['2+i', '4+i'],
      ),
      Z(
        ['化简(1+i)²。', 'Simplify (1+i)².'],
        '2i',
        [
          '1+2i+i²=1+2i−1=2i，中间交叉项不能省。',
          '1+2i+i²=1+2i−1=2i; retain the cross terms.',
        ],
        ['0', '1+i', '(1+i)^2'],
      ),
      Z(
        ['求i·i的化简值。', 'Give the simplified value of i·i.'],
        '-1',
        [
          'i·i=i²=−1，不能只保留两个虚部相乘的系数1。',
          'i·i=i²=−1, not merely coefficient one.',
        ],
        ['1', 'i', 'i^2'],
      ),
      E(
        [
          'a,b,c,d均为实数。用分配律推导(a+bi)(c+di)的实部与虚部，不跳过i²项。',
          'For real a,b,c,d, use distribution to derive the real and imaginary components of (a+bi)(c+di), explicitly retaining the i² term.',
        ],
        [
          '四项为ac+adi+bci+bd i²，用i²=−1得(ac−bd)+(ad+bc)i。因此实部ac−bd、虚部ad+bc；不是(ac)+(bd)i，也不丢两个交叉项。',
          'The four terms are ac+adi+bci+bd i². With i²=−1 this is (ac−bd)+(ad+bc)i: real part ac−bd and imaginary coefficient ad+bc. It is not ac+(bd)i, and both cross terms remain.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪条是正确的复数乘法公式？',
        'Which complex multiplication rule is correct?',
      ],
      options: [
        ['(a+bi)(c+di)=(ac−bd)+(ad+bc)i', '(a+bi)(c+di)=(ac−bd)+(ad+bc)i'],
        ['(a+bi)(c+di)=ac+bd i', '(a+bi)(c+di)=ac+bd i'],
        ['(a+bi)(c+di)=(ac+bd)+(ad+bc)i', '(a+bi)(c+di)=(ac+bd)+(ad+bc)i'],
      ],
      feedback: [
        [
          '分配四项，并用i²=−1得到实部减bd。',
          'Four distributed terms and i²=−1 give the −bd contribution.',
        ],
        [
          '不是按实虚坐标逐项相乘；漏交叉项和i²。',
          'Componentwise multiplication omits cross terms and i².',
        ],
        ['bd i²贡献−bd，不是+bd。', 'bd i² contributes −bd, not +bd.'],
      ],
      correct: 0,
    },
    reason: [
      '有人写(1+i)²=1+i²=0。用展开与代回检查，指出遗漏。',
      'Someone writes (1+i)²=1+i²=0. Expand and check the product to locate the omission.',
    ],
    rubric: [
      '平方和不等于和的平方。两份(1+i)相乘产生1、i、i、i²，两个交叉项合2i，实部1−1抵消后剩2i，不是0；也说明复数乘法不是分量分别平方。',
      'A square of a sum is not a sum of squares. Multiplying the two copies produces 1,i,i,i²; the cross terms total 2i. Real contributions cancel, leaving 2i rather than zero. Complex multiplication is not componentwise squaring.',
    ],
    prompts: [
      [
        '两个含i的项相乘后，i²去了哪里？',
        'What happened to i² when the imaginary terms multiplied?',
      ],
      [
        '减号是否作用于括号里的两项？',
        'Did subtraction apply to both terms inside the bracket?',
      ],
    ],
    misconception: [
      '漏交叉项、i²当1、减号只改第一项或把原乘积当已化简。',
      'Missing cross terms, treating i² as one, partial subtraction or leaving an unexpanded product as a finished answer.',
    ],
  },
  {
    title: ['共轭复数与模', 'Conjugate and modulus'],
    objective: [
      '用共轭的实轴反射与z·conj(z)解释非负实数模。',
      'Use real-axis reflection and z·conj(z) to explain the nonnegative real modulus.',
    ],
    hook: [
      '3−4i的共轭与负数相同吗？|3−4i|应是5还是25？',
      'Is the conjugate of 3−4i its negative? Should its modulus be five or twenty-five?',
    ],
    prerequisites: ['H21-L03', 'J87-L04', 'J91-L03'],
    keywords: [
      ['共轭', 'conjugate'],
      ['模', 'modulus'],
      ['实轴反射', 'real-axis reflection'],
    ],
    lab: 'complex-conjugate',
    skill: 'complex-conjugate-norm',
    hints: [
      [
        '共轭a−bi只把虚部系数取反，实部保留；不是−a−bi。',
        'The conjugate a−bi negates only the imaginary coefficient, retaining the real part; it is not −a−bi.',
      ],
      [
        'z·conj(z)=a²+b²=|z|²，模还要取非负根，单位是实距离，不附i。',
        'z·conj(z)=a²+b²=|z|²; modulus takes the nonnegative square root and is a real distance, without i.',
      ],
    ],
    items: [
      Z(
        [
          '求3−4i的共轭，完成化简。',
          'Find the conjugate of 3−4i in simplified form.',
        ],
        '3+4i',
        [
          '实部3不变，虚部−4取相反数4。',
          'Retain real part three and change imaginary coefficient −4 to four.',
        ],
        ['-3+4i', '-3-4i'],
      ),
      N(
        ['对z=3−4i，求|z|²。', 'For z=3−4i, find |z|².'],
        '25',
        ['3²+(−4)²=9+16=25，是平方模。', '3²+(−4)²=25 is the squared modulus.'],
        ['5', '-7'],
      ),
      R(
        ['求|1+i|的精确值。', 'Find the exact value of |1+i|.'],
        'sqrt(2)',
        [
          '平方模1²+1²=2，所以模为非负√2。',
          'The squared modulus is two, giving nonnegative modulus √2.',
        ],
        ['2', '-sqrt(2)', '1+i'],
      ),
      Z(
        ['求−2+3i的共轭。', 'Find the conjugate of −2+3i.'],
        '-2-3i',
        [
          '实部仍−2，虚部3变−3。',
          'Retain real part −2 and change imaginary coefficient three to −3.',
        ],
        ['2-3i', '2+3i'],
      ),
      R(
        ['求零复数的模|0|。', 'Find the modulus of the zero complex number.'],
        '0',
        [
          '原点到自身距离0；模为非负，不要求严格正。',
          'The origin is zero distance from itself; a modulus is nonnegative, not necessarily positive.',
        ],
        ['1', 'i'],
      ),
      E(
        [
          '对实数a,b及z=a+bi，证明z·conj(z)=|z|²；解释|z|=0与z=0的关系及共轭为何保模。',
          'For real a,b and z=a+bi, prove z·conj(z)=|z|². Explain the zero-modulus condition and why conjugation preserves modulus.',
        ],
        [
          '(a+bi)(a−bi)=a²−b²i²=a²+b²=|z|²。因为a²,b²非负，和0当且仅当a=b=0，即z=0。共轭只把b换−b，平方和不变，非负根也不变，故|conj(z)|=|z|。',
          '(a+bi)(a−bi)=a²−b²i²=a²+b²=|z|². The nonnegative squares sum to zero exactly when a=b=0, or z=0. Conjugation replaces b by −b, leaving the sum of squares and its nonnegative root unchanged.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对任意复数z，哪句话始终成立？',
        'Which statement holds for every complex z?',
      ],
      options: [
        ['conj(z)=−z', 'conj(z)=−z'],
        ['|conj(z)|=|z|', '|conj(z)|=|z|'],
        ['|z|²=|z|', '|z|²=|z|'],
      ],
      feedback: [
        [
          '共轭保实部，负数改两部分；仅实部0时两者相等。',
          'Conjugation retains the real part; negation reverses both. They coincide only when the real part is zero.',
        ],
        [
          '两者的a²+b²相同，非负距离相同。',
          'Both have the same a²+b² and the same nonnegative distance.',
        ],
        [
          '模与平方模一般不同，如3−4i给5与25。',
          'Modulus and its square generally differ: 3−4i gives five and twenty-five.',
        ],
      ],
      correct: 1,
    },
    reason: [
      'conj(z)=−z对所有复数都对吗？用3−4i反驳，并给出成立的实部条件。',
      'Does conj(z)=−z hold for all complex numbers? Use 3−4i as a counterexample and find the real-part condition for equality.',
    ],
    rubric: [
      '对3−4i，共轭3+4i，负数−3+4i，不相等。一般a−bi=−a−bi要求a=−a，所以a=0；虚部条件自动一致，包括0。不能把共轭与取负当同一操作。',
      'For 3−4i, the conjugate is 3+4i while the negative is −3+4i. In general a−bi=−a−bi requires a=−a, hence a=0; imaginary parts then agree, including zero. Conjugation and negation are different operations.',
    ],
    prompts: [
      [
        '你算到的是模还是平方模？',
        'Did you calculate a modulus or its square?',
      ],
      [
        '反射时哪个坐标保留，哪个坐标变号？',
        'Which coordinate stays fixed under reflection and which changes sign?',
      ],
    ],
    misconception: [
      '共轭改两部分、模当复数或忘记开根、零模被误判不存在。',
      'Negating both components for conjugation, using a complex or squared modulus, or rejecting zero modulus.',
    ],
  },
  {
    title: ['复平面中的几何意义', 'Complex numbers on the plane'],
    objective: [
      '把复数操作连接到同单位复平面的点与位移，明确旋转中心和零位移边界。',
      'Connect complex operations to points and displacements on an equal-unit plane, stating rotation centres and zero-displacement boundaries.',
    ],
    hook: [
      '乘i和加i都“含i”，为何一个转动、一个平移？把旋转中心改成c还能直接写iz吗？',
      'Why does multiplying by i turn a point while adding i translates it? Can a turn about c still be written simply as iz?',
    ],
    prerequisites: ['H21-L02', 'H21-L03', 'H21-L04', 'H05-L03', 'J87-L01'],
    keywords: [
      ['复平面', 'complex plane'],
      ['原点旋转', 'rotation about the origin'],
      ['相对位移', 'relative displacement'],
    ],
    lab: 'complex-geometry',
    skill: 'complex-plane-centre-transform',
    hints: [
      [
        'a+bi对应(a,b)；i(a+bi)=−b+ai，正实轴转向正虚轴，中心是原点。',
        'a+bi corresponds to (a,b). i(a+bi)=−b+ai turns positive Re toward positive Im about the origin.',
      ],
      [
        '绕c先减中心，用i转z−c，再加回c：w=c+i(z−c)。零相对位移没有夹角，但像点仍存在。',
        'For a turn about c, subtract c, turn z−c by i, then add c: w=c+i(z−c). Zero displacement has no angle, but the image still exists.',
      ],
    ],
    items: [
      Z(
        [
          'z=2+i，求绕原点乘i得到的像w=iz，完成化简。',
          'For z=2+i, simplify its image w=iz under multiplication by i about the origin.',
        ],
        '-1+2i',
        [
          'i(2+i)=2i+i²=−1+2i，即(2,1)转到(−1,2)。',
          'i(2+i)=2i+i²=−1+2i, mapping (2,1) to (−1,2).',
        ],
        ['1+2i', '2+2i', 'i(2+i)'],
      ),
      P(
        [
          '复数−1+2i对应哪个点？按(Re,Im)填写。',
          'Give the point corresponding to −1+2i, in (Re,Im) order.',
        ],
        '(-1,2)',
        [
          '横坐标−1、纵坐标2，纵坐标不是2i。',
          'The horizontal coordinate is −1 and vertical coordinate two, not 2i.',
        ],
        ['(2,-1)', '(1,2)'],
      ),
      Z(
        [
          '将z=2+i平移1+i，求w=z+(1+i)。',
          'Translate z=2+i by 1+i. Find w=z+(1+i).',
        ],
        '3+2i',
        [
          '两部分分别相加，得到3+2i，不是乘i。',
          'Adding the two components gives 3+2i; this is not multiplication by i.',
        ],
        ['-1+2i', '2+2i'],
      ),
      Z(
        [
          'z=2+i，绕中心c=1+i逆时针90°，求w=c+i(z−c)。',
          'For z=2+i, turn 90° anticlockwise about c=1+i and find w=c+i(z−c).',
        ],
        '1+2i',
        [
          'z−c=1，乘i得i，加回1+i得1+2i；直接iz会给另一个点。',
          'z−c=1, which turns to i. Adding 1+i back gives 1+2i, a different point from iz.',
        ],
        ['-1+2i', 'i', '3+2i'],
      ),
      R(
        [
          'z=2+i，像w=iz=−1+2i。求像到原点的精确距离。',
          'For z=2+i and image w=iz=−1+2i, find the exact distance of the image from the origin.',
        ],
        'sqrt(5)',
        [
          '|w|=sqrt((−1)²+2²)=√5=|z|，乘i保原点距离。',
          '|w|=sqrt((−1)²+2²)=√5=|z|, preserving distance from the origin.',
        ],
        ['5', '-sqrt(5)', '3'],
      ),
      E(
        [
          '纸上给z=2+i、中心c=2−i。分别求A=iz与B=c+i(z−c)及点坐标，核对各自对应中心的距离，解释为何不是同一旋转。',
          'On paper take z=2+i and c=2−i. Find A=iz and B=c+i(z−c), give their coordinates and check distances from their respective centres. Explain why these are different turns.',
        ],
        [
          'A=−1+2i，坐标(−1,2)，|A|=√5=|z|，是绕原点逆时针90°。z−c=2i，i(z−c)=−2，B=(2−i)−2=−i，坐标(0,−1)；|B−c|=2=|z−c|，是绕c。两像不同，绕c必须先减再加回中心；B的原点距离1也不同于|z|，不能把非原点中心省略。',
          'A=−1+2i corresponds to (−1,2) and has |A|=√5=|z|, a quarter-turn about the origin. Since z−c=2i, its turned displacement is −2, giving B=−i at (0,−1). Here |B−c|=2=|z−c|, a turn about c. The images differ; subtract and restore the chosen centre. B has origin-distance one, so the centre cannot be omitted.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于映射w=iz，哪句话准确？',
        'Which statement accurately describes the map w=iz?',
      ],
      options: [
        ['所有点都平移同一个i', 'Every point translates by the same i'],
        [
          '它绕任意选定中心都直接转90°',
          'It directly turns 90° about any chosen centre',
        ],
        [
          '它绕原点逆时针90°；0固定，但零箭头之间无夹角',
          'It turns 90° anticlockwise about the origin; zero stays fixed but zero arrows have no angle',
        ],
      ],
      feedback: [
        [
          '加i是平移；乘i的位移依原位置而变。',
          'Adding i translates; multiplication by i has position-dependent displacement.',
        ],
        [
          '绕其他中心须c+i(z−c)，不能省c。',
          'A different centre requires c+i(z−c).',
        ],
        [
          '(a,b)变(−b,a)；0有像0，但不能给零向量捏造方向。',
          '(a,b) becomes (−b,a). Zero maps to zero without acquiring an invented direction.',
        ],
      ],
      correct: 2,
    },
    reason: [
      'z=0乘i仍为0。是否说明“乘i未定义”，或两个零箭头之间有90°夹角？',
      'Multiplying z=0 by i gives zero. Does that make the multiplication undefined, or give a 90° angle between two zero arrows?',
    ],
    rubric: [
      '两种说法都不对。i·0=0运算定义清楚，映射也有像点原点；零向量没有方向，夹角无定义。整张平面的旋转映射有90°描述，与某个零向量对之间不存在夹角不冲突。',
      'Both claims are wrong. i·0=0 is defined and has an image at the origin. A zero vector has no direction, so an angle between zero arrows is undefined. A 90° rotation of the whole plane can fix the centre without defining an angle between those zero vectors.',
    ],
    prompts: [
      [
        '旋转是绕谁？写出减中心和加回中心两步了吗？',
        'Which centre is used, and did you subtract it and add it back?',
      ],
      [
        '零点有像吗？有像与有方向是否同一件事？',
        'Does zero have an image, and is that the same as having a direction?',
      ],
    ],
    misconception: [
      '把加i当乘i、顺逆时针弄反、省旋转中心或给零箭头造夹角。',
      'Confusing adding with multiplying by i, reversing the turn, omitting the centre or inventing an angle for zero arrows.',
    ],
  },
];
function q(id: string, i: number, item: Item): Question {
  const s = specs[i]!;
  if (item.answer.kind === 'explain')
    return reasoning(
      id,
      T(item.stem),
      s.skill,
      item.answer.rubric,
      s.hints.map(T),
    );
  const value = 'value' in item.answer ? String(item.answer.value) : '',
    result = numeric(
      id,
      T(item.stem),
      value,
      s.skill,
      s.hints.map(T),
      [T(s.hints[0]!), T(item.step)],
      { accepted: [value], rejected: item.wrong },
    );
  result.answer = item.answer;
  return result;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h21Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H21-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H11',
    unit: 'H21',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [s.skill],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((item, j) => q(`${id}-Q${j + 2}`, i, item)),
      reasoning(`${id}-Q6`, T(s.reason), s.skill, T(s.rubric), s.hints.map(T)),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h21ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H21-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H21 retrieval');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24;
  let item: Item;
  if (i === 0) {
    if (k < 12) {
      const rhs = [-9, -4, -1, 0, 4, 9][k % 6]!,
        domain = k < 6 ? 'real' : 'complex',
        roots = squareEquationRoots(rhs, domain);
      item = S(
        [
          `只在${domain === 'real' ? '实数' : '复数'}域求z²=${rhs}的全部不同根。`,
          `Find every distinct root of z²=${rhs} over the ${domain} numbers.`,
        ],
        roots.map(complexText),
        [
          '先核数域，再平方代回，完整保留两个非零相反根。',
          'Check the domain, square candidates and retain both opposite nonzero roots.',
        ],
        ['999', '1+i'],
      );
    } else {
      const n = k - 12;
      item = Z(
        [
          `化简i^${n}，不能保留幂。`,
          `Simplify i^${n}, leaving no unevaluated power.`,
        ],
        complexText(powerI(n)),
        [
          'i的整数幂按1,i,−1,−i循环。',
          'Integer powers of i cycle through 1,i,−1,−i.',
        ],
        ['999', '2i'],
      );
    }
  } else if (i === 1) {
    const a = -2 + (k % 6),
      b = -2 + Math.floor(k / 6),
      z = complex(String(a), String(b)),
      kind = k % 4,
      stem: Pair = [
        `z=${complexText(z)}，${kind === 0 ? '求Re(z)' : kind === 1 ? '求Im(z)实系数' : kind === 2 ? '判断real/nonreal' : '判断pure-imaginary/not-pure-imaginary（纯虚数排除0）'}。`,
        `For z=${complexText(z)}, ${kind === 0 ? 'find Re(z)' : kind === 1 ? 'find its real coefficient Im(z)' : kind === 2 ? 'classify real/nonreal' : 'classify pure-imaginary/not-pure-imaginary, excluding zero from purely imaginary numbers'}.`,
      ];
    item =
      kind < 2
        ? N(
            stem,
            String(kind === 0 ? a : b),
            [
              '省略的部分补0，虚部不带i。',
              'Supply implicit zeros; the imaginary part has no i.',
            ],
            ['999', 'i'],
          )
        : C(
            stem,
            kind === 2 ? realOrNonreal(z) : pureImaginary(z),
            [
              '按a,b两个实系数和明确的0边界分类。',
              'Use the two real coefficients and the stated zero boundary.',
            ],
            ['999', 'undefined'],
          );
  } else if (i === 2) {
    const u = complex(String(-2 + (k % 6)), String(1 + Math.floor(k / 12))),
      v = complex(
        String(1 + Math.floor((k % 12) / 6)),
        k % 2 === 0 ? '-1' : '1',
      ),
      op = (['add', 'subtract', 'multiply'] as const)[k % 3]!,
      symbol = op === 'add' ? '+' : op === 'subtract' ? '−' : '×',
      result = applyComplexOperation(u, v, op);
    item = Z(
      [
        `化简(${complexText(u)})${symbol}(${complexText(v)})。`,
        `Simplify (${complexText(u)})${symbol}(${complexText(v)}).`,
      ],
      complexText(result),
      [
        '按运算分配符号或四项，并用i²=−1收集。',
        'Distribute signs or all four products, then collect using i²=−1.',
      ],
      ['999', '999i'],
    );
  } else if (i === 3) {
    const a = -2 + (k % 6),
      b = Math.floor(k / 6) - 1,
      z = complex(String(a), String(b)),
      kind = k % 3,
      stem: Pair = [
        `z=${complexText(z)}，${kind === 0 ? '求共轭的化简式' : kind === 1 ? '求精确模|z|' : '求平方模|z|²'}。`,
        `For z=${complexText(z)}, ${kind === 0 ? 'give its simplified conjugate' : kind === 1 ? 'find exact modulus |z|' : 'find squared modulus |z|²'}.`,
      ];
    item =
      kind === 0
        ? Z(
            stem,
            complexText(conjugateComplex(z)),
            [
              '共轭保实部，虚部取反。',
              'Retain the real part and reverse the imaginary coefficient.',
            ],
            ['999', '999i'],
          )
        : kind === 1
          ? R(
              stem,
              `sqrt(${textR(squareModulus(z))})`,
              [
                '对两系数平方和开非负根。',
                'Take the nonnegative root of the squared coefficients sum.',
              ],
              ['999', '-999'],
            )
          : N(
              stem,
              textR(squareModulus(z)),
              [
                '平方模a²+b²还没有开根。',
                'Squared modulus a²+b² has not yet taken a square root.',
              ],
              ['999', '-999'],
            );
  } else {
    const z = complex(String(-2 + (k % 6)), String(1 + Math.floor(k / 12))),
      kind = (
        ['times-i', 'times-minus-i', 'conjugate', 'turn-centre'] as const
      )[k % 4]!,
      centre = complex('1', '1'),
      w = transformComplex(z, kind, centre),
      rule: Record<typeof kind, Pair> = {
        'times-i': [
          'w=iz，绕原点逆时针90°',
          'w=iz, an anticlockwise 90° turn about the origin',
        ],
        'times-minus-i': [
          'w=−iz，绕原点顺时针90°',
          'w=−iz, a clockwise 90° turn about the origin',
        ],
        conjugate: [
          'w=conj(z)，实轴反射',
          'w=conj(z), reflection in the real axis',
        ],
        'turn-centre': ['c=1+i，w=c+i(z−c)', 'c=1+i, w=c+i(z−c)'],
      },
      stem: Pair = [
        `z=${complexText(z)}，${rule[kind][0]}，${k % 3 === 0 ? '求像点坐标(Re,Im)' : '求w的化简式'}。`,
        `For z=${complexText(z)}, ${rule[kind][1]}; ${k % 3 === 0 ? 'give image coordinates (Re,Im)' : 'give the simplified complex image w'}.`,
      ];
    item =
      k % 3 === 0
        ? P(
            stem,
            `(${textR(w[0])},${textR(w[1])})`,
            [
              '先按指定中心算像，再读实部与虚部系数。',
              'Compute the image with the stated centre, then read its two real coordinates.',
            ],
            ['(999,999)', '(-999,999)'],
          )
        : Z(
            stem,
            complexText(w),
            [
              '加法、共轭与乘i的作用不同，非原点旋转保留c。',
              'Distinguish addition, conjugation and multiplication by i; retain a nonzero centre.',
            ],
            ['999', '999i'],
          );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h21CheckQuestions: Question[] = [
  q('H21-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('H21-CHECK-Q2', 1, specs[1]!.items[0]!),
  q('H21-CHECK-Q3', 2, specs[2]!.items[0]!),
  q('H21-CHECK-Q4', 3, specs[3]!.items[2]!),
  q('H21-CHECK-Q5', 4, specs[4]!.items[3]!),
  pick('H21-CHECK-Q6', 4),
  q('H21-CHECK-Q7', 0, specs[0]!.items[5]!),
  q('H21-CHECK-Q8', 4, specs[4]!.items[5]!),
];
