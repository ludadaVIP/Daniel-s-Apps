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
function answerHint(spec: AnswerSpec, lessonId?: string) {
  if (spec.kind === 'outcome-set')
    return t(
      '用题设结果代码、逗号分隔，可加大括号，如 {HH,HT,TH,TT}。条目次序可变，不重复、不遗漏；HT 与 TH 是不同有序结果。编号球用 R1-B1 这种先后代码。',
      'Use the supplied outcome codes separated by commas, optionally in braces, such as {HH,HT,TH,TT}. Entry order may vary; omit nothing and repeat nothing. HT and TH differ. Use codes such as R1-B1 for ordered numbered-token draws.',
    );
  if (lessonId?.startsWith('J75-') && spec.kind === 'expression')
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
      q.answer.kind === 'linear-equation' &&
      q.answer.model !== false &&
      checkAnswer(a.input, { ...q.answer, model: false }) === true) ||
    (a.checked &&
      !a.correct &&
      q.answer.kind === 'polynomial' &&
      q.answer.collected &&
      checkAnswer(a.input, { ...q.answer, collected: false }) === true) ||
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
                    ? q.answer.kind === 'linear-equation'
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
