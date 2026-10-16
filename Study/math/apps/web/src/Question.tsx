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
function answerHint(spec: AnswerSpec, lessonId?: string) {
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
      q.answer.kind === 'quadratic-form' &&
      checkAnswer(a.input, { ...q.answer, form: undefined }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'radical' &&
      q.answer.simplified &&
      checkAnswer(a.input, { ...q.answer, simplified: false }) === true) ||
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
