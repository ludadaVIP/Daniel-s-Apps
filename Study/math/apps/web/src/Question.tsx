import type { LanguageMode } from '@study/shared';
import {
  checkAnswer,
  t,
  type Attempt,
  type AnswerSpec,
  type Question as QuestionData,
} from './model';
import { Strip, Text } from './ui';
import { NumberDiagramView } from './NumberVisuals';
import { equalPolynomial } from './polynomialModels';
import { parseLinearSystem, sameSystemSolutions } from './systemModels';
import { trigQuantityMatches } from './trigModels';
function answerHint(spec: AnswerSpec, lessonId?: string) {
  if (spec.kind === 'inference-code')
    return t(
      '检验填reject（拒绝）、do-not-reject（不拒绝）或not-justified（条件不足）；区间比较填meets-target（全达目标）、below-target（全低于目标）、uncertain（跨阈值）。不拒绝不是证明H0真。',
      'For tests use reject, do-not-reject or not-justified. For interval comparisons use meets-target, below-target or uncertain. Non-rejection does not establish H0.',
    );
  if (spec.kind === 'distribution-table')
    return t(
      '填完整分布表：取值:概率；取值:概率。取值可重排行，但不能重复、漏行；概率须非负且总和1。',
      'Enter the full table as value:probability;value:probability. Row order may vary; do not repeat or omit values. Masses must be nonnegative and sum to one.',
    );
  if (spec.kind === 'distribution-rounded')
    return t(
      '这是近似概率，请填四位小数，如0.1234；不填百分号或分数。先算完整表达式，再舍入。',
      'Enter this approximate probability with four decimal places, such as0.1234, without a percent sign or fraction. Round after the full calculation.',
    );
  if (spec.kind === 'integral-primitive')
    return t(
      spec.family
        ? '输入完整原函数族，含任意实常数C；支持有理系数、多项式与非零一次C。只填表达式。'
        : '输入一个多项式原函数；有初值时须同时满足初值，不填未定常数C。只填表达式。',
      spec.family
        ? 'Enter the full primitive family, including arbitrary real C. Rational coefficients, polynomials and nonzero affine C are supported. Enter only the expression.'
        : 'Enter one polynomial primitive, satisfying the initial condition if supplied. Use a numerical constant, without undetermined C. Enter only the expression.',
    );
  if (spec.kind === 'advanced-derivative')
    return t(
      '输入导函数表达式；支持有理系数与括号，用e^(2x)、exp(2x)、sin(2x)、cos(2x)、ln(2)*2^x等规范写法，保留题中参数；不填f′(x)=或近似小数。',
      'Enter the derivative expression with rational coefficients and brackets, using e^(2x), exp(2x), sin(2x), cos(2x) or ln(2)*2^x with the stated parameters. Omit f′(x)= and rounded approximations.',
    );
  if (spec.kind === 'advanced-code')
    return t(
      '按题意用vertical（竖直）、singular（奇点）、off-curve（不在曲线）、not-attained（未取到）、empty-domain（无可行解），或运动代码speeding-up、slowing-down、instant-rest、neither。',
      'Use the requested code: vertical, singular, off-curve, not-attained, empty-domain, or motion codes speeding-up, slowing-down, instant-rest, neither.',
    );
  if (spec.kind === 'problem-witness')
    return t(
      '自行构造：平方和及同周长题填(a,b)，约分题与有限表题填一个x。每个有理分量绝对值≤20、分母≤100；反例必须满足前提并推翻结论，不只匹配示例。',
      'Construct your own witness: enter (a,b) for square-sum and equal-perimeter claims, or one x for cancellation and finite-table claims. Rational components need magnitude ≤20 and denominator ≤100. A counterexample must satisfy the premise and falsify the conclusion.',
    );
  if (spec.kind === 'analysis-code')
    return t(
      '增减填increasing、decreasing、constant；严格局部极值填local-max、local-min或neither。先说明区间和两侧符号。',
      'Enter increasing, decreasing or constant for behaviour; local-max, local-min or neither for strict local extrema. Check the interval and signs on both sides.',
    );
  if (spec.kind === 'calculus-code')
    return t(
      '值或有限导数未定义写undefined/未定义；双侧极限不存在写does-not-exist/DNE/不存在。左右极限、点值和导数分别检查。',
      'Enter undefined for an undefined value or finite derivative; use does-not-exist or DNE for a missing two-sided limit. Check one-sided limits, point value and derivative separately.',
    );
  if (spec.kind === 'coordinate3')
    return t(
      '按(x,y,z)顺序填三个有理分量，如(1,−2,3/2)；不要漏掉z，也不要填写向量长度代替坐标。',
      'Enter three rational components in (x,y,z) order, such as (1,−2,3/2). Retain z and do not substitute a vector length for coordinates.',
    );
  if (spec.kind === 'plane-equation')
    return t(
      '用x、y写一个等号的方程；允许只含一个变量，如x=2。接受移项、展开、分数和非零常数倍。幂可用^2或²；除数仅限非零常数，不写变量分母或sqrt。',
      'Enter an equation using x and y with one equals sign; a single-variable form such as x=2 is allowed. Rearrangement, expansion, fractions and nonzero constant multiples are accepted. Use ^2 or ²; divisors must be nonzero constants, without variable denominators or sqrt.',
    );
  if (spec.kind === 'conic-code')
    return spec.value === 'undefined'
      ? t(
          '竖直线斜率无定义，写undefined或无定义；它仍是有效直线。',
          'A vertical line has undefined slope; enter undefined. It is still a valid line.',
        )
      : ['circle', 'point', 'empty'].includes(spec.value)
        ? t(
            '按正半径圆、单点或空集写circle、point、empty。',
            'Use circle, point or empty for a positive-radius circle, a singleton or no real points.',
          )
        : t(
            '用on、inside、outside或empty表示在曲线上、内部、外部或无实轨迹。',
            'Use on, inside, outside or empty for on the locus, inside, outside or no real locus.',
          );
  if (spec.kind === 'complex')
    return spec.standard
      ? t(
          '只填a+bi形式的结果，如3−2i、i、−i或实数0，不写z=；实部和虚部系数可用分数。乘积、未合并的同类项或i²尚未完成化简。',
          'Enter only the a+bi result, such as 3−2i, i, −i or the real number zero, without z=. Rational coefficients are accepted; an unexpanded product, repeated terms or i² is unfinished.',
        )
      : t(
          '输入用i表示的复数表达式；支持有理系数、括号和加减乘除，除数须非零。',
          'Enter a complex expression using i, rational coefficients, parentheses and arithmetic; divisors must be nonzero.',
        );
  if (spec.kind === 'complex-set')
    return t(
      '写全部不同的根，如{i,−i}、i,−i或±i；零只有一个根，无解写∅或{}。先检查本题允许的数域。',
      'Give all distinct roots, for example {i,−i}, i,−i or ±i. Zero is one root; use ∅ or {} for no solutions. Check the stated number domain.',
    );
  if (spec.kind === 'complex-code') {
    if (spec.value === 'undefined')
      return t(
        '零相对位移没有方向或夹角，写undefined或无定义；变换本身仍可有定义。',
        'For zero relative displacement the direction or angle is undefined; the transformation itself can still be defined.',
      );
    if (spec.value === 'pure-imaginary' || spec.value === 'not-pure-imaginary')
      return t(
        '写pure-imaginary或not-pure-imaginary；本单元纯虚数要求实部0、虚部非0，零不算纯虚数。',
        'Use pure-imaginary or not-pure-imaginary. Here purely imaginary requires real part zero and imaginary coefficient nonzero; zero is excluded.',
      );
    return t(
      '按虚部系数是否为0写real（实数）或nonreal（非实数），不能只看实部。',
      'Use real or nonreal according to whether the imaginary coefficient is zero; the real part alone does not decide.',
    );
  }
  if (spec.kind === 'data-code') {
    if (['nominal', 'ordinal', 'discrete', 'continuous'].includes(spec.value))
      return t(
        '写nominal（无序类别）、ordinal（有序类别）、discrete（离散数值）或continuous（连续数值）。编码数字不自动变成数值变量。',
        'Use nominal, ordinal, discrete or continuous. Numerical category codes do not turn labels into numerical quantities.',
      );
    if (
      ['right-skew', 'left-skew', 'symmetric', 'asymmetric'].includes(
        spec.value,
      )
    )
      return t(
        '按原始点的尾部与镜像写right-skew、left-skew、symmetric或asymmetric。不要仅凭均值与中位数相等判断对称。',
        'Use right-skew, left-skew, symmetric or asymmetric from tails and mirror pairs. Equal mean and median alone do not prove symmetry.',
      );
    if (spec.value === 'undefined')
      return t(
        '分母为0时写undefined或无定义，不把0/0规定为0。',
        'With a zero denominator, enter undefined or 无定义; 0/0 is not zero.',
      );
    if (spec.value === 'not-identified')
      return t(
        '条件不能唯一确定所求模型参数或预测时写not-identified或不能唯一确定。',
        'Use not-identified when the conditions do not uniquely determine the requested parameter or prediction.',
      );
    return t(
      '查询x在观测x的最小至最大范围内写interpolation（内插），范围外写extrapolation（外推）；这不保证模型可靠。',
      'Use interpolation within the observed x range and extrapolation beyond it; neither label guarantees reliability.',
    );
  }
  if (spec.kind === 'sequence-code') {
    if (['outside-domain', 'insufficient', 'inconsistent'].includes(spec.value))
      return t(
        '按条件区分域外outside-domain、条件不足insufficient与条件矛盾inconsistent。先核序号是否允许，再核是否给了完整规则及一致的初始条件。',
        'Distinguish outside-domain, insufficient and inconsistent. Check allowed indices, a complete rule and consistent initial conditions.',
      );
    if (spec.value === 'undefined')
      return t(
        '先检查所求比值的分母；若分母为0，写无定义或undefined，不能给0/0指定公比。',
        'Check the requested denominator. If it is zero, enter undefined or 无定义; do not assign a ratio to0/0.',
      );
    if (spec.value === 'not-reached')
      return t(
        '只在题目指定的整期范围内核对。范围内未达到写not-reached，不表示永远无法达到。',
        'Check only the stated whole-period window. Use not-reached for a bounded miss; it does not mean never.',
      );
    return t(
      '按题意写等差arithmetic、等比geometric、两者都是both、两者都不是neither或非等比not-geometric；等比分类采用本单元各项非零的定义。',
      'Use arithmetic, geometric, both, neither or not-geometric as requested. Geometric classification here uses the unit’s nonzero-term definition.',
    );
  }
  if (spec.kind === 'solid-code')
    return spec.value === 'valid-net' || spec.value === 'invalid-net'
      ? t(
          '写有效展开图 / 无效展开图，或valid-net / invalid-net；保留每块面的身份，检查折后是否重叠。',
          'Enter valid-net or invalid-net, or the Chinese equivalent. Track face identity and check for overlapping folded faces.',
        )
      : t(
          '按题意写相交、平行、异面、重合或在平面内，也可用intersecting / parallel / skew / coincident / contained。先核对完整直线、平面与共面条件。',
          'Use intersecting, parallel, skew, coincident or contained as requested; Chinese equivalents are accepted. Check full lines, planes and coplanarity first.',
        );
  if (spec.kind === 'function-code')
    return t(
      '按题意写function/not-function、outside-domain/undetermined、increasing/decreasing/neither-strict、even/odd/both/neither，或invertible/not-invertible。递增/递减在本题指严格，奇偶性须核定义域。',
      'Use the requested code: function/not-function, outside-domain/undetermined, increasing/decreasing/neither-strict, even/odd/both/neither, or invertible/not-invertible. Increase/decrease here are strict; parity requires the domain check.',
    );
  if (spec.kind === 'finite-set')
    return t(
      '写有理数集合，如{1,2,3}或1,2,3；空集写∅或{}。顺序和重复不改变集合，{0}不等于∅。',
      'Enter a rational-number set such as {1,2,3} or 1,2,3; use ∅ or {} for empty. Order and repetition do not change a set; {0} is not ∅.',
    );
  if (spec.kind === 'logic-code')
    return t(
      '按题意输入∈/∉、⊆/⊈；真/假/不是命题；或充分不必要/必要不充分/充要/既不充分也不必要。也可用题中英文代码。',
      'Use in/out, subset/not-subset, true/false/not-statement, or sufficient-only/necessary-only/both/neither as requested.',
    );
  if (spec.kind === 'real-union')
    return t(
      '写完整实数解集，如−1<x<5、[-1,5]、x<−1 or x>5；也接受∪、或、∅、ℝ。且用and/且/分号，或用or/或/∪。',
      'Enter the complete real set: −1<x<5, [-1,5], or x<−1 or x>5. ∪, ∅ and ℝ are accepted. Use and or a semicolon for simultaneous bounds; use or/∪ for union.',
    );
  if (spec.kind === 'integration-verdict')
    return t(
      '按题意写valid/已核验、invalid/错误、insufficient/证据不足，或outside-domain/不在定义域；证据不足不是必假，输入域外不是规则未知。',
      'Enter valid, invalid, insufficient or outside-domain as requested. Insufficient evidence does not mean false; domain exclusion differs from an unknown rule.',
    );
  if (spec.kind === 'independence')
    return t(
      '写独立/不独立，或independent/dependent；比较交集概率与边际概率的乘积，互斥不是独立的同义词。',
      'Enter independent or dependent; compare intersection probability with the product of marginals. Disjointness does not mean independence.',
    );
  if (lessonId?.startsWith('J97-') && spec.kind === 'proof-verdict')
    return t(
      '按条件是否足够或量是否有定义写充分/条件不足，或sufficient/insufficient；核覆盖、未回答和零分母。',
      'Enter sufficient or insufficient as requested, checking coverage, missing responses and zero denominators.',
    );

  if (spec.kind === 'trig-function')
    return t(
      '写sin/正弦、cos/余弦或tan/正切；先按参照锐角匹配边。',
      'Enter sin, cos or tan after matching sides to the reference acute angle.',
    );
  if (spec.kind === 'trig-rounded')
    return t(
      `按题目用${spec.unit ?? '无单位比值'}，四舍五入为恰好${spec.places}位小数，保留尾零；近似题按此格式，不交分数或根式。`,
      `Use ${spec.unit ?? 'a dimensionless ratio'} and round to exactly ${spec.places} decimal places, retaining trailing zeros; this approximation task requires a decimal, rather than a fraction or radical.`,
    );
  if (lessonId?.startsWith('J96-') && spec.kind === 'proof-verdict')
    return t(
      '写充分/条件不足，或sufficient/insufficient；核直角、锐角定义域、零分母及测量模型前提。',
      'Enter sufficient or insufficient, checking the right-angle premise, acute domain, zero denominators and measurement-model premises.',
    );
  if (spec.kind === 'circle-line')
    return t(
      '把整条直线分类为割线/切线/不相交，或secant/tangent/disjoint；先比较圆心垂距与半径。',
      'Classify the infinite line as secant, tangent or disjoint by comparing perpendicular centre distance with radius.',
    );
  if (lessonId?.startsWith('J95-') && spec.kind === 'proof-verdict')
    return t(
      '写充分/条件不足，或sufficient/insufficient；核同圆、顶点在圆上、直径或切点前提。',
      'Enter sufficient or insufficient; check the common circle, on-circle vertex, diameter or contact premises.',
    );
  if (spec.kind === 'similarity-class')
    return t(
      '写相似/不相似，或 similar / not similar；旋转和反射不改变相似性。',
      'Enter similar or not similar; rotation and reflection preserve similarity.',
    );
  if (spec.kind === 'similarity-rule')
    return t(
      '写 AA / SAS / SSS 或条件不足；SAS须夹角，SSS须三对边同倍率，理由另核。',
      'Enter AA, SAS, SSS or insufficient. SAS needs the included angle; SSS needs three equal corresponding-side ratios. Explain the evidence separately.',
    );
  if (lessonId?.startsWith('J94-') && spec.kind === 'proof-verdict')
    return t(
      '写充分/条件不足，或 sufficient / insufficient；只用明确给定的相似、比例或建模前提。',
      'Enter sufficient or insufficient, using only supplied similarity, ratio or modelling premises.',
    );
  if (spec.kind === 'parabola-class')
    return t(
      '按a的符号写向上/向下/非二次函数，或 up / down / not-quadratic；先确认a≠0。',
      'Use up, down or not-quadratic according to a; check a≠0 first.',
    );
  if (spec.kind === 'quadratic-form')
    return t(
      '只写y右侧，用x及有理系数；函数须完全等价，还须完成指定形式。一般式合并同类项，顶点式保留单个移位平方，因式形式保留两个一次因子的乘积或重因子的平方。',
      'Enter only the right side in x with rational coefficients. Match the entire function and requested form: collected standard terms, one shifted square for vertex form, or a product of two linear factors (possibly repeated).',
    );
  if (lessonId?.startsWith('J93-L05') && spec.kind === 'quadratic-roots')
    return t(
      '写全部达到指定最值的允许输入，多个用逗号分隔、不重复、不附单位；不要把最大/最小输出当作输入。',
      'List every allowed input attaining the specified extremum, comma-separated, without duplicates or units. Do not submit the maximum/minimum output as an input.',
    );
  if (spec.kind === 'quadratic-roots')
    return t(
      '写全部不同精确根，用逗号分隔或 (3±√5)/2；重根只写一次。没有符合题意的解写 ∅、无实数解或 no real solutions；应用题须按题设范围筛选，无可行值可写 ∅ 或 no feasible solutions。',
      'Enter every distinct exact root, comma-separated or as (3±√5)/2. List a repeated root once. Use ∅ or no real solutions when none meet the question; apply its stated domain and use ∅ or no feasible solutions if none remain.',
    );
  if (spec.kind === 'quadratic-kind')
    return t(
      '先合并，再写二次方程/一次方程/恒等式/矛盾/高次方程，或 quadratic / linear / identity / contradiction / higher。',
      'Collect first, then enter quadratic, linear, identity, contradiction or higher.',
    );
  if (spec.kind === 'quadratic-equation')
    return t(
      '用 x 保留两种原数量在等号两边；可展开或交换两边。不要先移到零边或只写根。',
      'Write the two original quantities on opposite sides using x. Expansion and swapping sides are allowed; do not transpose to zero or submit only roots.',
    );
  if (spec.kind === 'root-set')
    return t(
      '写全部实数平方根，逗号分隔，可写 -3,3 或 ±3；零只需 0，没有写“无实数根”或 no real roots。只给正根不算完整。',
      'Enter every real square root separated by commas, such as -3,3 or ±3. Zero needs only 0; for none use no real roots. A positive root alone is incomplete.',
    );
  if (spec.kind === 'radical')
    return t(
      spec.simplified
        ? '写已化简的精确数值式，例 3√2、√2/2、√3−√2；提出平方因子，根号内无分母，分母无根号，同类项合并并省零项。'
        : '写精确数值根式，可用 √ 或 sqrt(...)，保留符号，不以近似小数或 ± 代替单值。',
      'Write an exact numerical radical using √ or sqrt(...), retaining signs. ' +
        (spec.simplified
          ? 'Extract square factors, remove fractional radicands and radical denominators, collect like terms and omit zero terms. '
          : 'Do not replace it by an approximation or ± for a single value. ') +
        'Letters and denominators with more than two terms are unsupported.',
    );
  if (spec.kind === 'real-class')
    return t(
      '写有理数 / 无理数 / 非实数，或 rational / irrational / not-real；不只根据屏幕小数外观判断。',
      'Enter rational, irrational or not-real; do not infer the class from a finite decimal display alone.',
    );
  if (spec.kind === 'root-rounded')
    return t(
      `按题目四舍五入为恰好 ${spec.places} 位小数，保留所需尾零；零位只写整数，不写分数或根式。`,
      `Round to exactly ${spec.places} decimal places, keeping required trailing zeros. At zero places enter an integer, not a fraction or radical.`,
    );
  if (lessonId?.startsWith('J91-') && spec.kind === 'proof-verdict')
    return t(
      '按题意写条件充分或条件不足，或 sufficient / insufficient；负被开方数与零分母要分别说明。',
      'Enter sufficient or insufficient as requested, explaining negative radicands and zero denominators separately.',
    );
  if (spec.kind === 'association')
    return t(
      '写正相关、负相关、无明显线性关联或弯曲关联；可用 positive / negative / no-clear-linear / curved。只描述此图，不由相关推因果。',
      'Enter positive, negative, no-clear-linear or curved. Describe this plot; association alone does not establish causation.',
    );
  if (lessonId?.startsWith('J88-') && spec.kind === 'proof-verdict')
    return t(
      '按题意判断证据是否充分：充分 / 条件不足，或 sufficient / insufficient；理由另由家长核验。',
      'Judge whether the supplied evidence is sufficient: sufficient or insufficient. A parent reviews the reasoning separately.',
    );
  if (spec.kind === 'root-length')
    return t(
      '只填非负精确长度，不附单位。可写 √13、2√2、sqrt(13)、√(1/2)、√8/2 或 5/4；支持一个根式的有理数倍。根号内先算成数值，截断小数不能代替精确根式；负根不是长度。',
      'Enter a nonnegative exact length without units, such as √13, 2√2, sqrt(13), √(1/2), √8/2 or 5/4. One root times a rational factor is supported. Evaluate the radicand first; truncated decimals and negative roots do not give the exact length.',
    );
  if (spec.kind === 'geometry-code')
    return t(
      '只写所求字母：顶点、边或对应三角形。边端点可反写；三角形须按题设顺序对应，可附 △，不写整条等式。',
      'Enter only the requested vertex, side or corresponding triangle letters, optionally with △. A side may reverse its endpoints; a triangle must retain the supplied correspondence order. Omit the full equality.',
    );
  if (spec.kind === 'congruence-rule')
    return t(
      '用 SSS、SAS、ASA、AAS 或条件不足。只用已给及有依据推导的条件；两个对应角可用内角和推出第三角，换用 ASA/AAS 时须解释。名称判对不代替证明。',
      'Enter SSS, SAS, ASA, AAS or insufficient. Use givens and justified deductions; two corresponding angles determine the third, allowing ASA/AAS conversion with an explanation. A criterion name does not replace a proof.',
    );
  if (spec.kind === 'proof-verdict')
    return t(
      '按题意写全等/不全等，或充分/条件不足；可用 congruent / not congruent / sufficient / insufficient。实际大小相同与已知条件保证结论是两种问题，理由另由家长核对。',
      'Enter congruent/not congruent or sufficient/insufficient as requested. Actual shapes and the sufficiency of givens are different questions; a parent reviews the reason.',
    );
  if (spec.kind === 'function-class')
    return t(
      '按本单元 m≠0 约定，写题目要求的分类：正比例、一次但非正比例、常函数、非线性函数、竖直线或无法唯一确定；可用对应英文 direct proportion / linear but not direct / constant / nonlinear / vertical line / undetermined。',
      'Under this unit’s m≠0 convention, enter the requested class: direct proportion, linear but not direct, constant, nonlinear, vertical line or undetermined. Explain the conditions separately.',
    );
  if (spec.kind === 'real-set')
    return t(
      '写完整实数解集，如 x<2、−1≤x<4、x=2、无解或所有实数。两条件可用分号表示且；也支持区间 (−inf,2]、[−1,4) 与单点 {2}。方向和端点都要准确；保留精确分数，不只写边界或有限样本。',
      'Write the complete real set, such as x<2, -1≤x<4, x=2, no solution or all reals. A semicolon means AND. Interval forms (-inf,2], [-1,4) and singletons {2} are also supported. Keep exact direction, endpoints and fractions; a boundary or finite sample list is insufficient.',
    );
  if (spec.kind === 'linear-system')
    return t(
      '用 x、y 写两条原数量关系，中间用分号或换行，如 x+y=8;3x+y=14。方程次序、换边及两边同乘非零常数可变；不要直接用最后的 x、y 解替代两条原关系。',
      'Write both original quantity relationships in x,y, separated by a semicolon or newline, such as x+y=8;3x+y=14. Reorder equations, rearrange sides or scale each by a nonzero constant. Do not replace the original relationships with the solved values.',
    );
  if (spec.kind === 'system-class')
    return t(
      '按题目范围写“无解”或“无穷多解”，可用 no solution / infinitely many solutions。重合直线的无穷多解不等于所有数对；实际情境还需另外核条件。',
      'Enter no solution or infinitely many solutions within the stated scope. Infinitely many points on a coincident line do not mean every ordered pair; context restrictions need a separate check.',
    );
  if (spec.kind === 'factorisation')
    return t(
      `在整数系数范围内分解完整，数公因子提出，各非恒定因式系数不再有整数公因数。只用 ${spec.variables.join('、')}，写乘积或因式幂；可交换因式次序、成对改号。不写等号、零点或数值代入答案。`,
      `Factor completely over integer coefficients: extract numerical content and leave primitive nonconstant factors. Use ${spec.variables.join(', ')} and a product or powers of factors. Factor order and balanced signs may vary. Omit equal signs, roots and substituted values.`,
    );
  if (spec.kind === 'outcome-set')
    return t(
      '用题设结果代码、逗号分隔，可加大括号，如 {HH,HT,TH,TT}。条目次序可变，不重复、不遗漏；HT 与 TH 是不同有序结果。编号球用 R1-B1 这种先后代码。',
      'Use the supplied outcome codes separated by commas, optionally in braces, such as {HH,HT,TH,TT}. Entry order may vary; omit nothing and repeat nothing. HT and TH differ. Use codes such as R1-B1 for ordered numbered-token draws.',
    );
  if (
    (lessonId?.startsWith('J75-') || lessonId?.startsWith('J85-')) &&
    spec.kind === 'expression'
  )
    return t(
      '只写 y 或总量等号右侧的一般式，用 x；不附 y=。精确等值形式、常数和零均可，某次代入数值不代替一般关系。',
      'Write only the general right-side expression in x, without y=. Exact equivalent forms, constants and zero are allowed; a value at one input cannot replace a general relationship.',
    );
  if (spec.kind === 'coordinate')
    return t(
      '按先 x 后 y 写有序数对，如 (−2,3)；两数用逗号分隔，可用分数或精确小数。不要附单位、交换坐标或只写一个数。',
      'Write the ordered pair (x,y), such as (−2,3), with a comma. Fractions and exact decimals are accepted. Do not add units, swap coordinates or give only one number.',
    );
  if (spec.kind === 'geometry-class')
    return t(
      '按题意写几何对象、分类或“无法确定”；可用中文或对应英文名称。名称判对不代替理由，解释仍由家长核对。',
      'Enter the requested object, classification or “undetermined”, using a Chinese or English name. Matching a name does not replace a reason; explanations need parent review.',
    );
  if (lessonId?.startsWith('J74-') && spec.kind === 'number')
    return t(
      '写题目所求数值，角度可附 °；先核对图中字母与条件，再说明依据。',
      'Enter the requested value, optionally using ° for angles. Check labels and givens, then explain the reason.',
    );
  if (spec.kind === 'linear-equation')
    return t(
      '用 x 写一个等式，只用一个等号；按题干把两种原数量分别保留在两边，可展开或交换左右。不要先移项或只写最后的解。',
      'Write an equation in x with one equal sign. Retain the two original quantities on opposite sides; expansion or swapping sides is allowed. Do not transpose first or submit only the solved equation.',
    );
  if (spec.kind === 'solution-class')
    return t(
      '无解写“无解”（或 no solution）；恒成立写“任意有理数”（或 all）。零若是唯一解，应在数值题写 0，不能当作无解。',
      'Write “no solution” for none or “all” for all rational numbers. A unique zero solution belongs as 0 in a numerical question; zero does not mean no solution.',
    );
  if (lessonId?.startsWith('J73-') && spec.kind === 'number')
    return t(
      '写 x 的精确值，保留负号和分数；代回原方程并核对情境条件。不要把近似值当精确解。',
      'Enter the exact value of x, keeping its sign or fraction. Substitute into the original equation and check context conditions. A rounded approximation is not an exact solution.',
    );
  if (spec.kind === 'polynomial' && spec.finishedProduct)
    return t(
      `用 ${spec.variables.join('、')} 写展开合并式：系数写前，每个字母用一个幂表示，如 6x^3 或 (1/4)x²。完成数与数、字母与字母的乘积，省略零项；不附等号或单位。`,
      `Write an expanded and collected expression in ${spec.variables.join(', ')}: coefficient first, each letter as one power, such as 6x^3 or (1/4)x². Finish numerical and letter products, omit zero terms, and omit equal signs and units.`,
    );
  if (spec.kind === 'polynomial')
    return t(
      `可用字母 ${spec.variables.join('、')} 写代数式，结果也可为常数，全部抵消写 0；平方可写 x^2 或 x²。不写等号、单位或当前代入数值。${spec.collected ? '完成去括号和合并，每种字母部分只保留一个非零项。' : '接受展开或因式形式的等值写法。'}`,
      `Allowed letters: ${spec.variables.join(', ')}. The result may be constant; write 0 if all terms cancel. Use x^2 or x² for squares. Omit equal signs, units and the current numerical value. ${spec.collected ? 'Finish distribution and collection, retaining one nonzero term per variable part.' : 'Equivalent expanded or factored forms are accepted.'}`,
    );
  if (lessonId?.startsWith('J71-') && spec.kind === 'number')
    return t(
      '写所求的有理数，保留必要负号；可用 -3/2 或 -1.5。不用算式、近似值或百分数代替结果。',
      'Enter the requested rational number, keeping its sign; use -3/2 or -1.5. Do not replace the result with an expression, approximation or percentage.',
    );
  if (lessonId?.startsWith('P68-') && spec.kind === 'number')
    return t(
      '写所求数量，核对单位、时间范围和百分比基数。金额用 NZD，不填百分比；精确分数可保留。',
      'Enter the requested quantity. Check units, included time and percentage base. Money is in NZD, not a percentage; exact fractions are allowed.',
    );
  if (spec.kind === 'number-set')
    return t(
      '写全部众数，多个用逗号或顿号分隔，不重复、不用千位逗号；没有时写“无众数”。',
      'Enter all modes separated by commas, without duplicates or grouping commas. If none, write “no mode”.',
    );
  if (lessonId?.startsWith('P67-') && spec.kind === 'number')
    return t(
      '写题目所求的统计量或比例；可用精确分数，概率和频率不能填成次数。',
      'Enter the requested summary or proportion. Exact fractions are allowed; do not replace a probability or frequency by a count.',
    );
  if (spec.kind === 'pi-multiple')
    return t(
      '保留 π 的精确倍数，可用 π 或 pi，接受等值分数系数；单位可省略，不写等号。',
      'Keep an exact multiple of π, written π or pi. Equivalent fractional coefficients are accepted; units are optional. Omit an equal sign.',
    );
  if (lessonId?.startsWith('P66-') && spec.kind === 'number')
    return t(
      '按题目要求写数值，核对半径、直径、近似约定与单位。',
      'Enter the requested value; check radius versus diameter, the approximation convention and units.',
    );
  if (spec.kind === 'expression')
    return t(
      `用字母 ${spec.variable} 写一次式；可用加减、乘除常数与括号。接受等值写法，不写等号。`,
      `Write a linear expression in ${spec.variable}, using sums, constant factors or divisors, and brackets. Equivalent forms are accepted; omit an equal sign.`,
    );
  if (lessonId?.startsWith('P65-') && spec.kind === 'number')
    return t(
      '写所求的数；保留负号，分数可用 -1/3。',
      'Enter the requested number; keep any minus sign. Fractions can use -1/3.',
    );
  if (lessonId?.startsWith('P64-') && spec.kind === 'number')
    return spec.unit === '°C'
      ? t(
          '读数保留所需负号；可写 −4°C 或 −4℃，单位可省略',
          'Keep any required minus sign; for example −4°C or −4℃. Units are optional.',
        )
      : t(
          '写题目所求的数并保留所需负号；可用 −4、-4、0 或 +3',
          'Keep any required minus sign; for example −4, -4, 0 or +3. Enter the requested number.',
        );
  if (spec.kind === 'ratio')
    return spec.simplest
      ? t(
          '统一单位后写最简整数比，如 2:3；可用全角冒号',
          'Use a simplest integer ratio after matching units, such as 2:3',
        )
      : t(
          '按题目顺序写比，如 2:3；分数或小数项也可以',
          'Write the ratio in the requested order, such as 2:3; fractional or decimal terms are allowed',
        );
  if (spec.kind === 'number') {
    if (spec.formats?.length === 1 && spec.formats[0] === 'percent')
      return t(
        '请用百分数作答，包含 %；如 37.5% 或 33 1/3%',
        'Use a percentage including %; for example 37.5% or 33 1/3%',
      );
    if (
      lessonId?.startsWith('P62-') &&
      spec.formats?.length === 1 &&
      spec.formats[0] === 'decimal'
    )
      return t(
        '请写小数或整数，不加百分号',
        'Use a decimal or whole number without a percent sign',
      );
    if (spec.fractionRule === 'unit')
      return t(
        '请写单位分数，分子为 1',
        'Use a unit fraction with numerator one',
      );
    if (spec.fractionRule === 'mixed')
      return t(
        '请写带分数，如 2 1/3；整数结果直接写整数',
        'Use a mixed number such as 2 1/3; an integer result can use an integer',
      );
    if (spec.fractionRule === 'simplest')
      return t(
        '请写最简分数；整数结果可直接写整数',
        'Use a simplest fraction; an integer result can use an integer',
      );
    if (spec.requiredDenominator)
      return t(
        `请写分母为 ${spec.requiredDenominator} 的${spec.fractionRule === 'improper' ? '假' : ''}分数`,
        `Use ${spec.fractionRule === 'improper' ? 'an improper fraction' : 'a fraction'} with denominator ${spec.requiredDenominator}`,
      );
    if (spec.fractionRule === 'improper')
      return t('请写假分数', 'Use an improper fraction');
  }
  if (lessonId?.startsWith('B01-'))
    return t(
      '你的答案（千位逗号可省略）',
      'Your answer (grouping commas are optional)',
    );
  if (
    lessonId?.startsWith('B02-') ||
    lessonId?.startsWith('B03-') ||
    lessonId?.startsWith('B05-') ||
    lessonId?.startsWith('B06-') ||
    lessonId?.startsWith('P51-') ||
    lessonId?.startsWith('P55-') ||
    lessonId?.startsWith('P56-') ||
    lessonId?.startsWith('P57-') ||
    lessonId?.startsWith('P61-') ||
    lessonId?.startsWith('P62-') ||
    lessonId?.startsWith('P63-')
  )
    return t(
      '你的答案（填写数量，注意题目单位）',
      'Your answer (enter the quantity and check units)',
    );
  if (lessonId?.startsWith('J96-'))
    return t(
      '你的答案（核对边比、单位及指定精度）',
      'Your answer (check ratios, units and requested precision)',
    );
  if (lessonId?.startsWith('P52-'))
    return t(
      '你的答案（写小数或整数，单位可省略）',
      'Your answer (use a decimal or whole number; units are optional)',
    );
  return t('你的答案（分数可用 3/8）', 'Your answer (fractions can use 3/8)');
}
export function Question({
  question: q,
  mode,
  attempt,
  onChange,
  exit = false,
}: {
  question: QuestionData;
  mode: LanguageMode;
  attempt?: Attempt;
  onChange: (a: Attempt) => void;
  exit?: boolean;
}) {
  const a = attempt ?? {
    input: '',
    tries: 0,
    hints: 0,
    correct: false,
    independent: false,
  };
  const edit = (input: string) =>
    onChange({
      ...a,
      input,
      checked: false,
      correct: false,
      independent: false,
    });
  const check = () => {
    const correct = checkAnswer(a.input, q.answer);
    if (correct === null) return;
    onChange({
      ...a,
      tries: a.tries + 1,
      checked: true,
      correct,
      independent: correct && a.tries === 0 && a.hints === 0,
    });
  };
  const formMismatch =
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'complex' &&
      q.answer.standard &&
      checkAnswer(a.input, { ...q.answer, standard: false }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'quadratic-form' &&
      checkAnswer(a.input, { ...q.answer, form: undefined }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'radical' &&
      q.answer.simplified &&
      checkAnswer(a.input, { ...q.answer, simplified: false }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'trig-rounded' &&
      trigQuantityMatches(a.input, q.answer.value, q.answer.unit)) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'root-rounded' &&
      checkAnswer(a.input, { kind: 'number', value: q.answer.value }) ===
        true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'linear-system' &&
      !!parseLinearSystem(a.input) &&
      sameSystemSolutions(
        parseLinearSystem(a.input)!,
        parseLinearSystem(q.answer.value)!,
      )) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'factorisation' &&
      equalPolynomial(a.input, q.answer.value, q.answer.variables)) ||
    (a.checked &&
      !a.correct &&
      (q.answer.kind === 'linear-equation' ||
        q.answer.kind === 'quadratic-equation') &&
      q.answer.model !== false &&
      checkAnswer(a.input, { ...q.answer, model: false }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'polynomial' &&
      q.answer.collected &&
      checkAnswer(a.input, {
        ...q.answer,
        collected: false,
        finishedProduct: false,
      }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'ratio' &&
      q.answer.simplest &&
      checkAnswer(a.input, { ...q.answer, simplest: false }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'number' &&
      checkAnswer(a.input, {
        ...q.answer,
        fractionRule: undefined,
        requiredDenominator: undefined,
        formats: undefined,
      }) === true);
  return (
    <div className="math-question">
      <span className="math-eyebrow">
        {q.id} ·{' '}
        <Text
          mode={mode}
          text={t(
            q.answer.kind === 'explain'
              ? '说说你的理由'
              : exit
                ? '换一个情境，独立试试'
                : '试着自己作答',
            q.answer.kind === 'explain'
              ? 'EXPLAIN YOUR THINKING'
              : exit
                ? 'A NEW CONTEXT · TRY INDEPENDENTLY'
                : 'MAKE YOUR OWN ANSWER',
          )}
        />
      </span>
      <h3>
        <Text mode={mode} text={q.stem} />
      </h3>
      {q.visual && <Strip n={q.visual.n} d={q.visual.d} />}
      {q.diagram && <NumberDiagramView diagram={q.diagram} mode={mode} />}
      {q.answer.kind === 'choice' ? (
        <div
          className="math-options"
          role="group"
          aria-label={mode === 'en' ? 'Answer choices' : '答案选项'}
        >
          {q.options?.map((o, i) => (
            <button
              key={o.id}
              type="button"
              disabled={a.checked && a.correct}
              aria-pressed={a.input === o.id}
              onClick={() => edit(o.id)}
            >
              <b>{String.fromCharCode(65 + i)}</b>
              <Text mode={mode} text={o.text} />
            </button>
          ))}
        </div>
      ) : q.answer.kind === 'explain' ? (
        <label className="math-answer">
          <span>
            <Text
              mode={mode}
              text={t(
                '写下自己的想法，也可以先画在纸上。',
                'Write your thinking, or draw it on paper first.',
              )}
            />
          </span>
          <textarea
            aria-label={mode === 'en' ? 'Your reasoning' : '我的解释'}
            rows={3}
            value={a.input}
            onChange={(e) => edit(e.target.value)}
            disabled={a.checked && a.correct}
          />
        </label>
      ) : (
        <label className="math-answer">
          <span>
            <Text mode={mode} text={answerHint(q.answer, q.lessonId)} />
          </span>
          <div className="math-input-row">
            <input
              aria-label={mode === 'en' ? 'Your answer' : '我的答案'}
              autoComplete="off"
              type="text"
              value={a.input}
              onChange={(e) => edit(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  a.input.trim() &&
                  !(a.checked && a.correct)
                )
                  check();
              }}
              disabled={a.checked && a.correct}
            />
            {(q.answer.kind === 'number' || q.answer.kind === 'pi-multiple') &&
              q.answer.unit && (
                <span>
                  {q.answer.unit === 'people' ? (
                    <Text mode={mode} text={t('人', 'people')} />
                  ) : q.answer.unit === 'cards' ? (
                    <Text mode={mode} text={t('张卡', 'cards')} />
                  ) : q.answer.unit === 'bags' ? (
                    <Text mode={mode} text={t('袋', 'bags')} />
                  ) : q.answer.unit === 'pencils' ? (
                    <Text mode={mode} text={t('支铅笔', 'pencils')} />
                  ) : q.answer.unit === 'sticks' ? (
                    <Text mode={mode} text={t('根小棒', 'sticks')} />
                  ) : q.answer.unit === 'min' ? (
                    <Text mode={mode} text={t('分钟', 'min')} />
                  ) : (
                    q.answer.unit
                  )}
                </span>
              )}
          </div>
        </label>
      )}
      <div className="math-row math-question-actions">
        {q.answer.kind !== 'explain' && (
          <button
            className="math-button"
            disabled={!a.input.trim() || (a.checked && a.correct)}
            onClick={check}
          >
            <Text mode={mode} text={t('检查答案', 'Check answer')} />
            <span>→</span>
          </button>
        )}
        {!exit && (
          <button
            className="math-button secondary"
            disabled={a.hints >= q.hints.length || (a.checked && a.correct)}
            onClick={() => onChange({ ...a, hints: a.hints + 1 })}
          >
            <Text mode={mode} text={t('给我一点提示', 'A little hint')} />
          </button>
        )}
      </div>
      {a.hints > 0 && (
        <div className="math-hint">
          {q.hints.slice(0, a.hints).map((hint, i) => (
            <p key={i}>
              <Text mode={mode} text={hint} />
            </p>
          ))}
        </div>
      )}
      {a.checked && q.answer.kind !== 'explain' && (
        <div
          className={`math-feedback ${a.correct ? 'correct' : 'try-again'}`}
          role="status"
        >
          <strong>
            <Text
              mode={mode}
              text={
                a.correct
                  ? t(
                      a.independent
                        ? '✓ 独立完成，你找到了。'
                        : '✓ 提示或重试后完成，理解在进步。',
                      a.independent
                        ? '✓ You found it independently.'
                        : '✓ Completed with support. Your understanding is growing.',
                    )
                  : formMismatch
                    ? q.answer.kind === 'linear-system'
                      ? t(
                          '↳ 解集相同；本题需保留两条原数量关系。',
                          '↳ The solution set matches; retain both original quantity relationships.',
                        )
                      : q.answer.kind === 'linear-equation' ||
                          q.answer.kind === 'quadratic-equation'
                        ? t(
                            '↳ 解集相同；本题还需保留题干两种原数量的建模关系。',
                            '↳ The solution set matches; retain the two original quantities in the modelling equation.',
                          )
                        : t(
                            '↳ 数量已等值，还需按题目要求完成写法。',
                            '↳ The value matches; finish the requested form.',
                          )
                    : t(
                        '↳ 还差一点，换个角度试试。',
                        '↳ Nearly there. Try another perspective.',
                      )
              }
            />
          </strong>
          {(a.correct || a.tries >= 3) && q.solutionSteps ? (
            <ol className="math-solution-steps">
              {q.solutionSteps.map((step, i) => (
                <li key={i}>
                  <Text mode={mode} text={step} />
                </li>
              ))}
            </ol>
          ) : (
            <p>
              <Text
                mode={mode}
                text={
                  a.correct || a.tries >= 3
                    ? q.solution
                    : (q.options?.find((o) => o.id === a.input)?.feedback ??
                      q.hints[Math.min(a.tries - 1, q.hints.length - 1)]!)
                }
              />
            </p>
          )}
        </div>
      )}
      {q.answer.kind === 'explain' && (
        <details className="math-parent-card">
          <summary>
            <Text
              mode={mode}
              text={t(
                '家长复核 · 看解释，不只看关键词',
                'Parent review · look at the reasoning',
              )}
            />
          </summary>
          <p>
            <Text mode={mode} text={q.answer.rubric} />
          </p>
          <button
            className="math-button secondary"
            disabled={!a.input.trim() || (a.checked && a.correct)}
            onClick={() =>
              onChange({
                ...a,
                checked: true,
                correct: true,
                independent: a.hints === 0,
                tries: a.tries + 1,
              })
            }
          >
            <Text
              mode={mode}
              text={t(
                '家长确认：解释合理',
                'Parent confirms: reasoning makes sense',
              )}
            />
          </button>
          {a.checked && a.correct && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '✓ 家长已核对解释。',
                  '✓ Reasoning reviewed by a parent.',
                )}
              />
            </p>
          )}
        </details>
      )}
    </div>
  );
}
