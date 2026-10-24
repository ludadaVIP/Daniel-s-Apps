import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H35' | 'H37') => {
  const first = unit === 'H35',
    id = (i: number) => `${unit}-MAINT-COMPLEX-Q${i}`;
  const givens = first
    ? [
        { x: 1, y: 2, label: 'C' },
        { x: 4, y: 1, label: 'Z' },
      ]
    : [
        { x: -2, y: 1, label: 'C' },
        { x: 1, y: 5, label: 'Z' },
      ];
  const picture: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: first ? -2 : -8,
      xMax: first ? 8 : 2,
      yMin: -1,
      yMax: 6,
      xStep: 1,
      yStep: 1,
    },
    points: givens,
    curves: [{ name: 'CZ', points: givens }],
    xLabel: 'Re',
    yLabel: 'Im',
    caption: t(
      `给定复平面中心与原始点：${givens.map((p) => `${p.label}(${p.x},${p.y})`).join('，')}。坐标均为实系数，两轴同尺度，线段仅标从C到Z的原位移，尚未画像点。`,
      `Given centre and original point:${givens.map((p) => `${p.label}(${p.x},${p.y})`).join(', ')}. Coordinates are real coefficients with equal axis scales. Segment CZ shows only the original displacement;the image point is not supplied.`,
    ),
  };
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
        '保留实/复数域、实系数、非零除数和旋转中心；通式说明全体，数值代回核本例，不能混用两个角色。',
        'Retain real/complex domains,real coefficients,nonzero denominators and rotation centres. General arguments establish the whole claim;substitution checks a particular example.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-COMPLEX`,
    unit,
    bridge: 'H21-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), `H21-L0${i}`]),
    ),
    title: t(
      '函数与矩阵之后，再核复数的数域和几何',
      'After functions and matrices,recheck complex domains and geometry',
    ),
    intro: t(
      '五题分次，每次一题；乘法、除法与图示可拆开写。全部人工核验、不计时，可用纸笔。几何题采用标准正向实轴与虚轴，先画再核坐标。',
      'Choose one of five tasks per sitting,splitting multiplication,division and diagrams if useful. Every argument is human-reviewed without a timer. Use paper and standard positive real/imaginary axes;draw before checking coordinates.',
    ),
    questions: [
      task(
        1,
        'complex-domain-square-cycle',
        `同一形式方程u²+${first ? 9 : 16}=0，分别写实数域与复数域的完整解集并解释为何不矛盾。在复数域用因式分解说明已找全，不只代两候选。再从i²=−1推i四次幂循环，计算${first ? 'i⁻⁷与i¹⁴' : 'i⁻⁹与i²³'}；负指数为何可以先用1/i而不等于把符号移到i前？`,
        `For u²+${first ? 9 : 16}=0,give COMPLETE solution sets over the reals and complexes,and explain why they do not contradict. Use complex factorisation to establish completeness,not just substitution of two candidates. Derive the four-power cycle from i²=−1 and calculate${first ? 'i⁻⁷ and i¹⁴' : 'i⁻⁹ and i²³'}. Why do negative exponents use 1/i rather than moving a minus sign in front of i?`,
        `实域任意u²≥0，故u²+${first ? 9 : 16}>0，无解。复域因i²=−1，有(u−${first ? 3 : 4}i)(u+${first ? 3 : 4}i)=0；复数域无零因子，故全体为{${first ? 3 : 4}i,−${first ? 3 : 4}i}，各平方核回。扩域增加可用元素，并未令某个实数平方变负。i⁰=1、i¹=i、i²=−1、i³=−i、i⁴=1，往后每4循环；i非零且1/i=−i，负整数也按倒数与四周期计算。${first ? '−7=−8+1所以i⁻⁷=i；14=12+2所以i¹⁴=−1' : '−9=−12+3所以i⁻⁹=−i；23=20+3所以i²³=−i'}，不是负号移位规则。`,
        `Every real u has u²≥0,so u²+${first ? 9 : 16}>0 and the real set is empty. In the complex field,(u−${first ? 3 : 4}i)(u+${first ? 3 : 4}i)=0. The zero-product property gives exactly{${first ? 3 : 4}i,−${first ? 3 : 4}i},and each checks by squaring. Enlarging the domain adds elements;it does not change a real square into a negative number. Powers cycle1,i,−1,−i with i⁴=1. Since i≠0 and1/i=−i,negative integer powers also follow reciprocal arithmetic and the four-cycle. ${first ? '−7=−8+1 gives i⁻⁷=i;14=12+2 gives i¹⁴=−1.' : '−9=−12+3 gives i⁻⁹=−i;23=20+3 gives i²³=−i.'} This is not moving an exponent’s minus sign onto the base.`,
        '先在每个数域内审查平方与零乘积；负幂回到非零数的倒数。',
        'Audit squares and zero products within each domain. Negative powers return to the reciprocal of a nonzero number.',
      ),
      task(
        2,
        'complex-coefficients-equality',
        `已知a,b为实数，解${first ? '(a−1)+(2b+3)i=2−5i' : '(2a+1)+(b−2)i=−3+4i'}，分别说明实部、虚部与虚数项的角色。把${first ? '−5i' : '4i'}画在复平面，坐标为何为${first ? '(0,−5)' : '(0,4)'}而第二坐标不是${first ? '−5i' : '4i'}？若允许a或b本身为复数，原实系数配对法还保证唯一吗，用另一个参数对核查。`,
        `Given REAL a,b,solve${first ? '(a−1)+(2b+3)i=2−5i' : '(2a+1)+(b−2)i=−3+4i'}. Distinguish real part,imaginary part and imaginary term. Plot${first ? '−5i' : '4i'}:why are its coordinates${first ? '(0,−5)' : '(0,4)'},with a real second coordinate rather than an imaginary term? If a or b may themselves be complex,does the same coefficient-matching argument ensure uniqueness? Check another parameter pair.`,
        first
          ? '实系数条件下a−1=2、2b+3=−5，故a=3、b=−4。复数右端实部2、虚部−5（实数），虚数项−5i；虚轴点−5i坐标(0,−5)，虚轴刻度标实系数。若b=−4+i、a=5，原左式4+(−5+2i)i=4−5i−2=2−5i也成立，与(3,−4)不同；这时“虚部系数2b+3”已不保证为实数，不能再直接与−5比较。唯一性依赖a,b实数，域改后须重审。'
          : '实系数比较2a+1=−3、b−2=4，得a=−2、b=6。右端虚部4是实数，虚数项4i；虚轴点4i坐标(0,4)，坐标轴的分量均为实数。若另允许b=6+2i、a=−1，左式−1+(4+2i)i=−3+4i，也满足原式；与实数参数对不同。由于b−2此时不是实系数，不能照搬实系数相等规则，参数域会改变唯一性。',
        first
          ? 'For real coefficients,a−1=2 and2b+3=−5,so a=3,b=−4. The imaginary PART is real coefficient−5;the imaginary TERM is−5i. The latter plots at(0,−5),with real coordinates. If complex parameters are allowed,a=5,b=−4+i also gives4+(−5+2i)i=2−5i. Now2b+3 is not a real coefficient,so directly equating it with−5 is invalid. The original uniqueness depends on the real-parameter premise.'
          : 'Matching real coefficients gives2a+1=−3,b−2=4,hence a=−2,b=6. Imaginary part four is real;imaginary term4i plots at(0,4). If complex parameters are allowed,a=−1,b=6+2i also gives−1+(4+2i)i=−3+4i. This is a different parameter pair. Since b−2 need not be real,ordinary real-coefficient matching cannot be transferred without its premise.',
        '每个“实部/虚部”都是实系数；先核参数确为实数，再将两个系数相等。',
        'Real and imaginary parts are real coefficients. Check that parameter premise before matching them.',
      ),
      task(
        3,
        'complex-distribution-collection',
        `给z=${first ? '2−3i' : '−2+i'}、w=${first ? '−1+2i' : '3−2i'}，分别求z+w、z−w、zw及z²，写每个分配乘积和i²替换。有人算平方时只平方两个分量，漏掉哪里？从(a+bi)(a+bi)对实a,b推通式，再用本例核回，不能把分量分别平方当复数乘法。`,
        `Let z=${first ? '2−3i' : '−2+i'},w=${first ? '−1+2i' : '3−2i'}. Find z+w,z−w,zw and z²,showing every distributed product and i² replacement. What is lost by squaring components separately? Derive the general square of a+bi for real a,b,then check this example rather than treating componentwise squares as complex multiplication.`,
        first
          ? '和1−i、差3−5i；乘积(2−3i)(−1+2i)=−2+4i+3i−6i²=4+7i。平方4−6i−6i+9i²=−5−12i，两个交叉项都要保，i²=−1使实部变4−9。一般(a+bi)²=(a²−b²)+2abi，取a=2、b=−3还原−5−12i。实虚两部分先分配再收集，不是(4,9)两分量独立平方。'
          : '和1−i、差−5+3i；乘积−6+4i+3i−2i²=−4+7i。平方4−2i−2i+i²=3−4i。一般(a+bi)²=a²−b²+2abi，取a=−2、b=1给3−4i；中间两项总2ab i，不能漏掉或把虚部系数的平方直接当新虚部。每次i²替换为−1后才合实部。',
        first
          ? 'The sum is1−i,difference3−5i. Product−2+4i+3i−6i² becomes4+7i. Squaring gives4−6i−6i+9i²=−5−12i:both cross terms survive,and i²=−1 changes the real part. Generally(a+bi)²=(a²−b²)+2abi. Substituting a=2,b=−3 checks the result. This is distribution followed by collection,not componentwise squaring.'
          : 'The sum is1−i,difference−5+3i. Product−6+4i+3i−2i² becomes−4+7i. Squaring gives4−2i−2i+i²=3−4i. Generally(a+bi)²=(a²−b²)+2abi;substituting a=−2,b=1 checks it. Both cross products combine to2ab i,and i² must become−1 before real terms are collected.',
        '先列四个乘积，含i²的项会进入实部，两个含单个i的项合成虚部。',
        'List all four products. The i² term contributes to the real part,and both single-i terms contribute to the imaginary part.',
      ),
      task(
        4,
        'complex-conjugate-norm',
        `给z=${first ? '3−4i' : '−5+12i'}，分别求共轭、−z、|z|与z·conj(z)，解释为何共轭不是一概取负。用共轭有理化求${first ? '(2+i)/z' : '(1−2i)/z'}并乘回核验，指出除数0时哪一步失效。再对一般a,b为实数的z=a+bi证明conj(z)=−z的充要条件和|z|=0的条件，包括z=0。`,
        `For z=${first ? '3−4i' : '−5+12i'},find its conjugate,negative,modulus and z·conj(z). Why is conjugation not generally negation? Use the conjugate to calculate${first ? '(2+i)/z' : '(1−2i)/z'},then multiply back. Which step fails at a zero denominator? For general real a,b in z=a+bi,prove necessary and sufficient conditions for conj(z)=−z and for |z|=0,including zero.`,
        first
          ? '共轭3+4i，−z=−3+4i，不相等；|z|=√(9+16)=5，z·conj(z)=25。分子分母同乘共轭，(2+i)/z=(2+i)(3+4i)/25=(2+11i)/25；乘回3−4i得2+i。一般(a+bi)(a−bi)=a²+b²，非零z才有正实分母可除；z=0时不能0/0。共轭等负数要求a−bi=−a−bi，即a=0且b任意，含0；模0因a²+b²=0且各平方非负，只在a=b=0。'
          : '共轭−5−12i，负数5−12i，不相等；模13、模平方169。共轭有理化(1−2i)/z=(-29−2i)/169，乘原z核回1−2i。一般模平方a²+b²，z非零才可除这个正数；零除数时分母0，不能给任意商。conj(z)=−z等价a=0、b任意；|z|=0等价a=b=0，两个条件不同且都含零。零仍有共轭和模，不是因不能作除数就所有运算都未定义。',
        first
          ? 'Conjugate3+4i differs from negative−3+4i. Modulus is five and z·conj(z)=25. Multiplying numerator and denominator by the conjugate gives(2+11i)/25; multiplying back by3−4i recovers2+i. Generally(a+bi)(a−bi)=a²+b²,positive for nonzero z;zero would give an illegal zero denominator. Equality a−bi=−a−bi is equivalent to a=0 with any real b,including zero. Modulus zero requires a²+b²=0,hence both a=b=0 because each real square is nonnegative.'
          : 'Conjugate−5−12i differs from negative5−12i. Modulus is thirteen and squared modulus169. Conjugate rationalisation gives(−29−2i)/169; multiplying by the original z recovers1−2i. Generally a²+b² is positive for nonzero z,and a zero denominator cannot be cancelled. Conj(z)=−z iff a=0 with arbitrary real b,while |z|=0 iff a=b=0. These conditions differ but both include zero,whose conjugate and modulus remain defined despite its being an illegal divisor.',
        '先分别写共轭与负数，再将分母乘共轭；充要条件从实系数相等和非负平方和推出。',
        'Write conjugate and negative separately,then multiply the denominator by its conjugate. Derive both iff conditions from real coefficients and nonnegative squares.',
      ),
      {
        ...task(
          5,
          'complex-plane-centre-transform',
          `图给中心c=${first ? '1+2i' : '−2+i'}与原复数z=${first ? '4+i' : '1+5i'}。给T(z)=c+i(z−c)，先画原位移w=z−c，再求T(z)与|w|，写相应圆方程。对任意w=a+bi说明坐标、方向、长度怎样变，推逆映射并核本例。T(c)=c是否令乘i未定义或令两个零箭头夹角90°？把w变换写成2×2矩阵，为什么不能漏掉中心平移后直接作用原z？用T(0)再核。`,
          `The figure gives centre c=${first ? '1+2i' : '−2+i'} and point z=${first ? '4+i' : '1+5i'}. For T(z)=c+i(z−c),draw original displacement w=z−c,find T(z),|w| and the corresponding circle equation. Explain the coordinate,direction and length effects for arbitrary w=a+bi,derive the inverse,and check this example. Does T(c)=c make multiplication by i undefined or assign a 90° angle to two zero arrows? Express the centred w map as a 2×2 matrix. Why cannot it act directly on original z without translations? Check T(0).`,
          first
            ? 'w=3−i，iw=1+3i，T(z)=2+5i，模√10；原始点和像点同在(x−1)²+(y−2)²=10。一般iw=−b+ai，对实坐标(a,b)变(−b,a)，标准正向轴下逆时针90°，模平方a²+b²不变。逆为z=c−i(v−c)，代像点回4+i。w=0仍可乘i且T(c)=c，零箭头无方向/夹角，不能说有90°夹角。矩阵[[0,−1],[1,0]]作用中心化w，再加c；若直接作用z会绕原点。T(0)=3+i非0，说明此非原点中心的整图映射是仿射而非对原坐标的线性映射。'
            : 'w=3+4i，iw=−4+3i，T(z)=−6+4i，模5，原始点与像点均满足(x+2)²+(y−1)²=25。一般iw把(a,b)变(−b,a)，正向坐标下逆时针90°且模平方不变；逆z=c−i(v−c)核回1+5i。中心w=0有合法像点c，但零位移无可识别方向，不存在零箭头间直角。矩阵[[0,−1],[1,0]]用于w而非漏平移的原z；先减c、矩阵转、再加c。T(0)=−1+3i不为0，原坐标下此为仿射映射，不因中心化后有矩阵就称全图线性。',
          first
            ? 'Here w=3−i,iw=1+3i and T(z)=2+5i,with modulus√10. Both original and image points lie on(x−1)²+(y−2)²=10. Generally iw=−b+ai maps(a,b) to(−b,a):a 90° counterclockwise rotation in standard axes,preserving a²+b². The inverse z=c−i(v−c) recovers4+i. At w=0,multiplication remains defined and T(c)=c,but zero displacement has no direction or angle. Matrix[[0,−1],[1,0]] acts on centred w before adding c;acting directly on z would rotate about zero. T(0)=3+i≠0 confirms that the full nonorigin-centred map is affine,not linear in the original coordinates.'
            : 'Here w=3+4i,iw=−4+3i and T(z)=−6+4i,with modulus five. Original and image satisfy(x+2)²+(y−1)²=25. Generally iw maps(a,b) to(−b,a),a 90° counterclockwise turn preserving squared modulus. The inverse z=c−i(v−c) recovers1+5i. At the centre,w=0 still has a defined product and image c;zero arrows have no angle. Matrix[[0,−1],[1,0]] acts on w,requiring subtract-centre,rotate,add-centre in that order. T(0)=−1+3i≠0 shows the full map is affine rather than linear in the original coordinates.',
          '先中心化，再乘i，再回原坐标；旋转映射的角度描述不等于零向量有夹角。',
          'Subtract the centre,multiply by i,then add the centre. The map’s rotation angle does not assign an angle to zero vectors.',
        ),
        diagram: picture,
      },
    ],
  };
};
export const complexRecurrenceRetrieval = {
  H35_COMPLEX: makeSet('H35'),
  H37: makeSet('H37'),
};
