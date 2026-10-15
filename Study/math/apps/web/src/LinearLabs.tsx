import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { AlgebraBoard } from './AlgebraVisuals';
import { readRational } from './rationalModels';
import {
  solveAlgebra,
  sameSolutions,
  textR,
  type AlgebraEquation,
} from './algebraModels';
import {
  sourceText,
  linearSource,
  linearText,
  candidateAudit,
  linearTransform,
  linearTrace,
  fractionTrace,
  bracketCases,
  fractionCases,
  wordEquation,
  contextCases,
  contextSolution,
  type LinearSource,
  type ContextRule,
  type LinearOperation,
  type LinearStep,
  type WordKind,
} from './linearModels';
export type LinearLabKind = Extract<Lesson['lab'], `linear-${string}`>;
export const isLinearLab = (kind: Lesson['lab']): kind is LinearLabKind =>
  kind.startsWith('linear-');
const label = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const solutionSpec = (s: ReturnType<typeof solveAlgebra>): AnswerSpec =>
  s.kind === 'one'
    ? {
        kind: 'number',
        value: textR(s.value),
        formats: ['decimal', 'fraction'],
      }
    : { kind: 'solution-class', value: s.kind };
function Slider({
  mode,
  name,
  value,
  min,
  max,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        value={value}
        min={min}
        max={max}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Task({
  mode,
  name,
  answer,
  source,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  source?: LinearSource;
}) {
  const [input, setInput] = useState(''),
    [state, setState] = useState<'correct' | 'form' | 'wrong' | null>(null),
    audit = state && source ? candidateAudit(source, input) : null;
  return (
    <div
      className="math-linear-task"
      role="group"
      aria-label={label(mode, name)}
    >
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          aria-label={label(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setState(null);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={
            answer.kind === 'solution-class'
              ? t(
                  '无解写“无解”，恒成立写“任意有理数”；零不是无解。',
                  'Write “no solution” for none or “all” for an identity; zero is not no solution.',
                )
              : answer.kind === 'linear-equation'
                ? t(
                    '按两种原数量写等号两边，可交换左右；先不移项，不把 x=解 代替建模。',
                    'Put the two original quantities on opposite sides, in either order. Do not transpose or replace the model by x=the solution.',
                  )
                : t(
                    '写精确数值或分数，最后代回原方程。',
                    'Enter an exact number or fraction, then check the original equation.',
                  )
          }
        />
      </p>
      <button
        className="math-button"
        onClick={() =>
          setState(
            checkAnswer(input, answer) === true
              ? 'correct'
              : answer.kind === 'linear-equation' &&
                  checkAnswer(input, { ...answer, model: false }) === true
                ? 'form'
                : 'wrong',
          )
        }
      >
        <Text
          mode={mode}
          text={t('核对我的推理结果', 'Check my reasoning result')}
        />
      </button>
      {state && (
        <p
          role="status"
          aria-label={label(mode, t('解题反馈', 'Solution feedback'))}
        >
          <Text
            mode={mode}
            text={
              state === 'correct'
                ? t(
                    '符合所问关系。再说明这一步的理由和适用条件。',
                    'Matches the requested relationship. Explain the reason and its conditions.',
                  )
                : state === 'form'
                  ? t(
                      '解集相同，但请先保留题干两种原数量的关系，不先移项或只写解。',
                      'The solution set matches, but retain the two original quantities rather than transpose or give only the solution.',
                    )
                  : t(
                      '重新核对原方程、两边同做的操作和所求对象；无解、任意数与零要分清。',
                      'Recheck the original equation, operations on both sides and the requested object. Distinguish no solution, all values and zero.',
                    )
            }
          />
        </p>
      )}
      {audit && (
        <p data-original-check>
          <Text mode={mode} text={t('代回原式', 'Back in the original')} />：
          {audit.left} {audit.equationPass ? '=' : '≠'} {audit.right}
        </p>
      )}
    </div>
  );
}
function Candidate({
  mode,
  source,
  rule = 'rational',
}: {
  mode: LanguageMode;
  source: LinearSource;
  rule?: ContextRule;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    audit = checked ? candidateAudit(source, input, rule) : null;
  let candidate = null;
  try {
    if (audit) candidate = readRational(input);
  } catch {
    /* The audit already rejects invalid scalars. */
  }
  return (
    <div className="math-linear-candidate">
      <p className="math-linear-formula">
        <Text mode={mode} text={t('原方程', 'Original equation')} />：
        {sourceText(source)}
      </p>
      <label>
        <Text mode={mode} text={t('候选 x（只写数值）', 'My candidate x')} />
        <input
          type="text"
          aria-label={label(mode, t('候选 x（只写数值）', 'My candidate x'))}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t(
            '代回原方程并查条件',
            'Check original equation and conditions',
          )}
        />
      </button>
      <AlgebraBoard
        equation={linearSource(source)}
        candidate={candidate}
        mode={mode}
      />
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('候选检验', 'Candidate audit'))}
        >
          <Text
            mode={mode}
            text={
              !audit
                ? t(
                    '请输入一个精确数值或分数，不附单位或等号。',
                    'Enter an exact number or fraction without units or an equal sign.',
                  )
                : t(
                    `原方程：${audit.equationPass ? '成立' : '不成立'}；情境条件：${audit.contextPass ? '符合' : '不符合'}；${audit.accepted ? '候选可接受' : '不能接受此候选'}。左边 ${audit.left}，右边 ${audit.right}。`,
                    `Original equation: ${audit.equationPass ? 'met' : 'not met'}; context conditions: ${audit.contextPass ? 'met' : 'not met'}; candidate ${audit.accepted ? 'accepted' : 'rejected'}. Left ${audit.left}, right ${audit.right}.`,
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
const checkingCases: LinearSource[] = [
  { left: '2x+3', right: '11' },
  { left: '3x-2', right: '-3' },
  { left: '3x+1', right: '1' },
  { left: '2(x+1)', right: '2x+2' },
  { left: '2(x+1)', right: '2x+3' },
];
function Checking({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    s = checkingCases[index]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '解是让原方程两边数值相等的允许值。不能只算左边，也不能拿变形后的错式冒充原式。若 x 系数抵消，需区分恒成立与矛盾，而不是除零。',
            'A solution is an allowed value making both original sides equal. Do not check one side only or replace the original by a mistaken transformation. If x coefficients cancel, distinguish identity from contradiction without dividing by zero.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('原方程选择', 'Choose original equation')} />
        <select
          aria-label={label(mode, t('原方程选择', 'Choose original equation'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {checkingCases.map((s, i) => (
            <option key={i} value={i}>
              {sourceText(s)}
            </option>
          ))}
        </select>
      </label>
      <Candidate key={index} mode={mode} source={s} />
      <p>
        <Text
          mode={mode}
          text={t(
            '检验一个候选通过，只能证明它是一个解；不能由一次代入证明所有值都满足。',
            'A successful candidate check proves that value is a solution, not that every value works.',
          )}
        />
      </p>
      <Task
        key={`solution/${index}`}
        mode={mode}
        name={t('我的完整解集', 'My complete solution set')}
        answer={solutionSpec(solveAlgebra(linearSource(s)))}
        source={s}
      />
    </>
  );
}
const transformReasons = {
  invalid: t(
    '操作量不是有效的一次式。',
    'The operation amount is not a valid affine expression.',
  ),
  'variable-factor': t(
    '本课保解乘除只用已知非零常数；含 x 的因子可能为零，还可能改变次数，不能按此通用规则操作。',
    'Use a known nonzero constant for reversible multiplication/division here. A variable factor may be zero and may change degree.',
  ),
  'zero-divisor': t(
    '不能除以零，当前方程保持。',
    'Cannot divide by zero; the current equation is retained.',
  ),
  'zero-factor': t(
    '乘零不可逆，不能作为通用保解步骤；0=0 会丢失原限制。',
    'Multiplication by zero is not reversible or a general solution-preserving rule; 0=0 loses the original restriction.',
  ),
  'one-sided': t(
    '单侧操作不是通用保解规则；即使这个特例碰巧同解，也不能推广。',
    'A one-sided operation is not a general reversible rule, even if this special equation happens to keep its solution.',
  ),
  reversible: t(
    '两边同做定义良好且可逆的操作，保留解集。',
    'The same well-defined reversible operation on both sides preserves the solution set.',
  ),
};
function Balance({ mode }: { mode: LanguageMode }) {
  const original = { left: '5x+2', right: '2x+11' },
    base = linearSource(original),
    [current, setCurrent] = useState<AlgebraEquation>(base),
    [op, setOp] = useState<LinearOperation>('−'),
    [amount, setAmount] = useState('2x'),
    [side, setSide] = useState<'both' | 'left'>('both'),
    [rows, setRows] = useState<
      { before: string; after: string; safe: boolean }[]
    >([]),
    [status, setStatus] = useState<LocalizedText | null>(null);
  const apply = () => {
    const m = linearTransform(current, op, amount, side);
    setStatus(
      t(
        `${transformReasons[m.reason].zh}${m.next ? ` 与上一步解集${m.preserves ? '相同' : '不同'}。` : ''}`,
        `${transformReasons[m.reason].en}${m.next ? ` Solution set ${m.preserves ? 'matches' : 'differs from'} the preceding step.` : ''}`,
      ),
    );
    if (m.next) {
      setRows([
        ...rows,
        {
          before: linearText(current),
          after: linearText(m.next),
          safe: m.safeRule,
        },
      ]);
      setCurrent(m.next);
    }
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '“移项变号”应还原成两边同加或同减一个式子；乘除需已知非零常数。每次保留完整等式，检查是否与原方程同解。原式：',
            'Explain transposition as adding or subtracting the same expression on both sides. Multiplication/division needs a known nonzero constant. Retain the whole equation and compare its solution set with the original:',
          )}
        />{' '}
        {sourceText(original)}
      </p>
      <div className="math-linear-controls">
        <label>
          <Text mode={mode} text={t('操作', 'Operation')} />
          <select
            aria-label={label(mode, t('操作', 'Operation'))}
            value={op}
            onChange={(e) => {
              setOp(e.target.value as LinearOperation);
              setStatus(null);
            }}
          >
            {['+', '−', '×', '÷'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          <Text
            mode={mode}
            text={t('同做的项或常数', 'Term or constant to apply')}
          />
          <input
            type="text"
            aria-label={label(
              mode,
              t('同做的项或常数', 'Term or constant to apply'),
            )}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setStatus(null);
            }}
          />
        </label>
        <label>
          <Text mode={mode} text={t('操作范围', 'Operation scope')} />
          <select
            aria-label={label(mode, t('操作范围', 'Operation scope'))}
            value={side}
            onChange={(e) => {
              setSide(e.target.value as 'both' | 'left');
              setStatus(null);
            }}
          >
            <option value="both">{label(mode, t('两边', 'Both sides'))}</option>
            <option value="left">
              {label(mode, t('只左边（反例）', 'Left only (counterexample)'))}
            </option>
          </select>
        </label>
      </div>
      <p className="math-linear-formula" data-current-equation>
        {linearText(current)}
      </p>
      <button
        className="math-button"
        onClick={apply}
        disabled={rows.length >= 8}
      >
        <Text
          mode={mode}
          text={t('执行并记录一步', 'Apply and record one step')}
        />
      </button>
      <button
        className="math-button ghost"
        onClick={() => {
          setCurrent(base);
          setRows([]);
          setStatus(null);
        }}
      >
        <Text
          mode={mode}
          text={t('回到原方程', 'Return to original equation')}
        />
      </button>
      {status && (
        <p
          role="status"
          aria-label={label(mode, t('变形反馈', 'Transformation feedback'))}
        >
          <Text mode={mode} text={status} />
        </p>
      )}
      <ol className="math-linear-steps">
        {rows.map((r, i) => (
          <li key={i} data-transform-step data-safe={r.safe}>
            {r.before} → {r.after}
          </li>
        ))}
      </ol>
      <p>
        <Text
          mode={mode}
          text={t(
            `当前与原方程解集${sameSolutions(base, current) ? '相同' : '不同'}。最多记录八步，可重置重试。`,
            `Current solution set ${sameSolutions(base, current) ? 'matches' : 'differs from'} the original. Record up to eight steps, then reset to try again.`,
          )}
        />
      </p>
      <Task
        mode={mode}
        name={t('我对原方程求得的解', 'My solution of the original')}
        answer={solutionSpec(solveAlgebra(base))}
        source={original}
      />
    </>
  );
}
const stepReasons: Record<LinearStep['reason'], LocalizedText> = {
  collect: t('展开并合并各边', 'Expand and collect each side'),
  'gather-x': t(
    '两边同减右侧含 x 的项',
    'Subtract the right-side x term from both sides',
  ),
  'gather-constants': t(
    '两边同减左侧常数',
    'Subtract the left constant from both sides',
  ),
  divide: t(
    '两边同除已知非零系数',
    'Divide both sides by the known nonzero coefficient',
  ),
  'multiply-lcd': t(
    '两边整体乘非零公倍数',
    'Multiply both whole sides by the nonzero common denominator',
  ),
  'distribute-lcd': t(
    '公倍数分配到每一项',
    'Distribute the common denominator to every term',
  ),
};
function Steps({ mode, fraction }: { mode: LanguageMode; fraction: boolean }) {
  const [index, setIndex] = useState(0),
    [stage, setStage] = useState(0),
    cases = fraction ? fractionCases : bracketCases,
    s = cases[index]!,
    trace = fraction ? fractionTrace(index) : linearTrace(s);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            fraction
              ? t(
                  '本课的分母都是已知非零常数，不是含未知数的分式方程。去分母要给等号两边每一项乘同一个非零公倍数，包括整数项和括号中的整组。',
                  'Denominators here are known nonzero constants, not variable denominators. Clearing them multiplies every term on both sides by one nonzero common multiple, including integer terms and complete brackets.',
                )
              : t(
                  '先逐项展开括号，再用两边同做的操作求解。若未知数系数相消，应解释剩下的恒等或矛盾，不强行除以零。',
                  'Expand every bracket term first, then use equal operations on both sides. If variable coefficients cancel, interpret the identity or contradiction instead of dividing by zero.',
                )
          }
        />
      </p>
      <label>
        <Text mode={mode} text={t('方程案例', 'Equation case')} />
        <select
          aria-label={label(mode, t('方程案例', 'Equation case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setStage(0);
          }}
        >
          {cases.map((s, i) => (
            <option key={s.id} value={i}>
              {sourceText(s)}
            </option>
          ))}
        </select>
      </label>
      <p className="math-linear-formula">
        <Text mode={mode} text={t('原方程', 'Original equation')} />：
        {sourceText(s)}
      </p>
      {fraction && (
        <p>
          <Text
            mode={mode}
            text={t(
              `原分母的最小公倍数为 ${fractionTrace(index).lcd}；它非零，所以这一步可逆。`,
              `The original denominators have least common multiple ${fractionTrace(index).lcd}; it is nonzero, so this step is reversible.`,
            )}
          />
        </p>
      )}
      <button
        className="math-button"
        disabled={stage >= trace.steps.length}
        onClick={() => setStage(stage + 1)}
      >
        <Text
          mode={mode}
          text={t('展开下一步并看理由', 'Reveal next step and reason')}
        />
      </button>
      <ol className="math-linear-steps">
        {trace.steps.slice(0, stage).map((step, i) => (
          <li key={i} data-linear-step>
            <Text mode={mode} text={stepReasons[step.reason]} />
            <p className="math-linear-formula">{step.text}</p>
          </li>
        ))}
      </ol>
      {stage === trace.steps.length && trace.solution.kind !== 'one' && (
        <p>
          <Text
            mode={mode}
            text={
              trace.solution.kind === 'all'
                ? t(
                    '含 x 的项抵消后恒成立，所有允许有理数都满足；不是唯一解零。',
                    'After x terms cancel, an identity remains: all permitted rational values satisfy it, rather than a unique zero solution.',
                  )
                : t(
                    '含 x 的项抵消后得到矛盾，没有解；不能再除零。',
                    'After x terms cancel, a contradiction remains: no solution. Do not divide by zero.',
                  )
            }
          />
        </p>
      )}
      <Task
        key={`${fraction}/${index}`}
        mode={mode}
        name={t('我的精确解或解集', 'My exact solution or solution set')}
        answer={solutionSpec(trace.solution)}
        source={s}
      />
    </>
  );
}
function Modelling({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<WordKind>('ages'),
    [a, setA] = useState(8),
    [total, setTotal] = useState(30),
    m = wordEquation(kind, a, total),
    key = `${kind}/${a}/${total}`;
  return (
    <>
      <label>
        <Text mode={mode} text={t('虚构情境', 'Fictional context')} />
        <select
          aria-label={label(mode, t('虚构情境', 'Fictional context'))}
          value={kind}
          onChange={(e) => {
            const k = e.target.value as WordKind;
            setKind(k);
            setA(k === 'ages' ? 8 : 3);
            setTotal(k === 'ages' ? 30 : 20);
          }}
        >
          <option value="ages">
            {label(mode, t('年龄和与年龄差', 'Age sum and difference'))}
          </option>
          <option value="groups">
            {label(
              mode,
              t('完整袋数与固定余量', 'Whole bags and fixed extras'),
            )}
          </option>
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'ages'
              ? t(
                  `设 x 为较小年龄的精确年数，两人相差 ${a} 年、年龄和 ${total} 年。两人年龄须非负，允许精确分数年数；不是把两人年龄都设为 x。`,
                  `Let x be the younger exact age in years. The gap is ${a} years and the sum ${total}. Both ages must be non-negative; exact fractional years are allowed. The two ages are not both x.`,
                )
              : t(
                  `已有两支，另有 x 个完整袋，每袋 ${a} 支，共 ${total} 支。x 是非负整数袋数；固定两支不随袋数重复。`,
                  `There are two fixed pencils plus x whole bags of ${a} pencils each, total ${total}. x is a non-negative integer bag count; the two extras do not repeat per bag.`,
                )
          }
        />
      </p>
      <div className="math-linear-controls">
        <Slider
          mode={mode}
          name={
            kind === 'ages'
              ? t('年龄差', 'Age difference')
              : t('每袋支数', 'Pencils per bag')
          }
          value={a}
          min={2}
          max={kind === 'ages' ? 12 : 5}
          change={setA}
        />
        <Slider
          mode={mode}
          name={
            kind === 'ages'
              ? t('年龄和', 'Age sum')
              : t('总支数', 'Total pencils')
          }
          value={total}
          min={0}
          max={kind === 'ages' ? 40 : 30}
          change={setTotal}
        />
      </div>
      <Task
        key={`model/${key}`}
        mode={mode}
        name={t('我的原数量关系方程', 'My original-quantity equation')}
        answer={{
          kind: 'linear-equation',
          value: sourceText(m.source),
          model: true,
        }}
      />
      <Candidate
        key={`audit/${key}`}
        mode={mode}
        source={m.source}
        rule={m.rule}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '先建模，再求解、代回、核条件；滑块可故意给出不可能情境，不能擅改原条件凑答案。',
            'Model first, then solve, substitute and check conditions. Controls may deliberately create an impossible scenario; do not alter the supplied conditions to force an answer.',
          )}
        />
      </p>
    </>
  );
}
const contextNames: Record<string, LocalizedText> = {
  people: t(
    'x 为每组三人的完整组数，共八人；x 必须非负整数。',
    'x counts complete groups of three among eight people; x must be a non-negative integer.',
  ),
  price: t(
    '虚构每件单价 x，买两件加固定五元却共三元；单价不得负。',
    'A fictional unit price x, two items plus a fixed five cost three; the unit price cannot be negative.',
  ),
  length: t(
    'x 为三等段中每段的厘米数，总长一厘米；x>0，分数长度允许。',
    'x is each of three equal lengths totalling one centimetre; x>0, and fractional lengths are allowed.',
  ),
  temperature: t(
    '假想摄氏起始读数 x，增加五度后为二度；起始可负。',
    'A fictional Celsius reading x rises five degrees to two; a negative starting reading is allowed.',
  ),
  'zero-count': t(
    '四个相同袋各 x 支，合计零支；x 为非负整数，零允许。',
    'Four identical bags hold x pencils each, total zero; x is a non-negative integer and zero is allowed.',
  ),
};
function Context({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    s = contextCases[index]!,
    solution = contextSolution(s, s.rule);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '分两关：候选是否满足原方程，以及是否满足本题的取值条件。负数或分数不能一概拒绝，人数、长度、温度的范围各不相同。',
            'Use two gates: the original equation and the context domain. Do not reject every negative or fractional value; counts, lengths and temperatures have different domains.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('检验情境', 'Audit context')} />
        <select
          aria-label={label(mode, t('检验情境', 'Audit context'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {contextCases.map((s, i) => (
            <option key={s.id} value={i}>
              {label(mode, contextNames[s.id]!)}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={contextNames[s.id]!} />
      </p>
      <Candidate key={index} mode={mode} source={s} rule={s.rule} />
      <Task
        key={`final/${index}`}
        mode={mode}
        name={t('我在条件内的最终解', 'My final allowed solution')}
        answer={solutionSpec(solution)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '如果唯一代数解违反条件，本情境就无符合条件的解；不要四舍五入一个人数，再假装仍满足原等式。',
            'If the unique algebraic solution violates the domain, no allowed solution exists in this context. Do not round a count and pretend the original equality still holds.',
          )}
        />
      </p>
    </>
  );
}
export function LinearLab({
  kind,
  mode,
}: {
  kind: LinearLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-linear-lab">
      {kind === 'linear-check' ? (
        <Checking mode={mode} />
      ) : kind === 'linear-balance' ? (
        <Balance mode={mode} />
      ) : kind === 'linear-brackets' ? (
        <Steps mode={mode} fraction={false} />
      ) : kind === 'linear-fractions' ? (
        <Steps mode={mode} fraction />
      ) : kind === 'linear-model' ? (
        <Modelling mode={mode} />
      ) : (
        <Context mode={mode} />
      )}
    </div>
  );
}
export function LinearHookArt({
  kind,
  mode,
}: {
  kind: LinearLabKind;
  mode: LanguageMode;
}) {
  const symbols = {
    'linear-check': '2x + 3 = 11 · x = ?',
    'linear-balance': '5x + 2 = 2x + 11 → ?',
    'linear-brackets': '2(x − 3) = x + 1 → ?',
    'linear-fractions': '(x−1)/2 − (x+2)/3 = 1/6 → ?',
    'linear-model': 'x + (x+8) = 30 → ?',
    'linear-context': '3x = 8 · x ∈ {0,1,2,…} ?',
  };
  return (
    <div className="math-linear-hook">
      <strong>{symbols[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '原式检验 → 保解理由 → 情境条件',
            'Original check → reversible reasoning → context domain',
          )}
        />
      </p>
    </div>
  );
}
