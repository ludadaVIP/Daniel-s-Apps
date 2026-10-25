import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  EquationBoard,
  AlgebraBalance,
  GrowingPatternView,
} from './EquationVisuals';
import {
  equationWorking,
  equationCases,
  equationStories,
  equationSides,
  equationText,
  solveEarlyEquation,
  rationalText,
  balanceValues,
  changeBalance,
  patternPieces,
  patternRule,
  type EarlyEquation,
  type BalanceState,
  type BalanceAction,
  type GrowingPattern,
} from './equationModels';
export type EquationLabKind =
  | 'equation-box'
  | 'equation-balance'
  | 'equation-pattern'
  | 'equation-one-step'
  | 'equation-story';
export const isEquationLab = (kind: Lesson['lab']): kind is EquationLabKind =>
  [
    'equation-box',
    'equation-balance',
    'equation-pattern',
    'equation-one-step',
    'equation-story',
  ].includes(kind);
const name = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'en' ? text.en : text.zh;
function Range({
  label,
  value,
  min = 0,
  max,
  mode,
  onChange,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  mode: LanguageMode;
  onChange: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={name(label, mode)}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const inverseLabels = {
  zero: t('零因数：判断所有值或无解', 'Zero factor: all or none'),
  add: t('两边减同一个已知加数', 'Both sides − known addend'),
  subtract: t('两边加同一个已知减数', 'Both sides + removed amount'),
  'subtract-from': t('从原量减去剩余，找去掉量', 'Original − remainder'),
  multiply: t('两边除以同一个非零因数', 'Both sides ÷ nonzero factor'),
  divide: t('两边乘同一个非零除数', 'Both sides × nonzero divisor'),
};
function Trial({
  eq,
  mode,
  symbol = 'x',
  solving = false,
}: {
  eq: EarlyEquation;
  mode: LanguageMode;
  symbol?: 'x' | '□';
  solving?: boolean;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    [invalid, setInvalid] = useState(false),
    [rule, setRule] = useState(''),
    [ruleChecked, setRuleChecked] = useState(false),
    [reveal, setReveal] = useState(false);
  const solution = solveEarlyEquation(eq);
  let sides: ReturnType<typeof equationSides> | null = null;
  if (checked && !invalid) {
    try {
      sides = equationSides(eq, input);
    } catch {
      sides = null;
    }
  }
  const checkTrial = () => {
    try {
      equationSides(eq, input);
      setInvalid(false);
    } catch {
      setInvalid(true);
    }
    setChecked(true);
  };
  const goodRule = rule === (solution.status === 'one' ? eq.kind : 'zero');
  return (
    <>
      <EquationBoard equation={eq} mode={mode} symbol={symbol} />
      <label>
        <Text
          mode={mode}
          text={t(
            '试代的候选值（可写分数或小数）',
            'Trial candidate (a fraction or decimal is allowed)',
          )}
        />
        <input
          type="text"
          aria-label={mode === 'en' ? 'Trial candidate' : '试代候选值'}
          value={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) checkTrial();
          }}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
            setInvalid(false);
          }}
        />
      </label>
      <button
        className="math-button secondary"
        type="button"
        disabled={!input.trim()}
        onClick={checkTrial}
      >
        <Text
          mode={mode}
          text={t(
            '代入原式，核对两边',
            'Substitute into the original; compare sides',
          )}
        />
      </button>
      {checked && (
        <p role="status">
          <Text
            mode={mode}
            text={
              invalid || !sides
                ? t(
                    '请用有效的精确数值，分母不能为零；这里不把百分数当作所求数量。',
                    'Use a valid exact number with a nonzero denominator; this model does not treat a percentage as the requested quantity.',
                  )
                : sides.equal
                  ? t(
                      `代回后两边都是 ${rationalText(sides.left)}，相等。候选 ${input} 满足这个原式；还要说明关系。`,
                      `Substitution gives ${rationalText(sides.left)} on both sides. Candidate ${input} satisfies the original; explain the relationship as well.`,
                    )
                  : t(
                      `左边 ${rationalText(sides.left)}，右边 ${rationalText(sides.right)}，不相等。核对未知量的位置与逆运算。`,
                      `Left ${rationalText(sides.left)}, right ${rationalText(sides.right)}: unequal. Recheck the unknown’s position and the inverse operation.`,
                    )
            }
          />
        </p>
      )}
      {solving && (
        <>
          <label>
            <Text
              mode={mode}
              text={t('选择有依据的处理', 'Choose a justified operation')}
            />
            <select
              aria-label={mode === 'en' ? 'Inverse operation' : '逆运算'}
              value={rule}
              onChange={(e) => {
                setRule(e.target.value);
                setRuleChecked(false);
                setReveal(false);
              }}
            >
              <option value="">{mode === 'en' ? 'Choose…' : '请选择…'}</option>
              {Object.entries(inverseLabels).map(([key, text]) => (
                <option key={key} value={key}>
                  {name(text, mode)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="math-button secondary"
            type="button"
            disabled={!rule}
            onClick={() => setRuleChecked(true)}
          >
            <Text
              mode={mode}
              text={t('核对处理方法', 'Check the operation choice')}
            />
          </button>
          {ruleChecked && (
            <p role="status">
              <Text
                mode={mode}
                text={
                  goodRule
                    ? solution.status === 'one'
                      ? t(
                          '处理关系正确。先在纸上做同一操作，再展开解与代回核查。',
                          'The operation fits. Apply it on paper, then reveal the solution and substitution check.',
                        )
                      : t(
                          '零因数需要另行分类，不能除以零；先判断是每个数都满足，还是没有数满足。',
                          'A zero factor needs separate classification; never divide by zero. Decide whether every value works or no value works.',
                        )
                    : t(
                        '再辨别未知量与已知量的关系。去掉加数用减法，恢复被减量用加法；乘除的逆运算要求非零。',
                        'Recheck the relationship. Undo an added amount by subtraction, restore an original after subtraction by addition; inverse multiplication/division requires a nonzero quantity.',
                      )
                }
              />
            </p>
          )}
          {ruleChecked && goodRule && !reveal && (
            <button
              className="math-button"
              type="button"
              onClick={() => setReveal(true)}
            >
              <Text
                mode={mode}
                text={t(
                  '我已列步骤，核查解与代回',
                  'I wrote the steps; check the solution and substitution',
                )}
              />
            </button>
          )}
          {reveal && (
            <div className="math-equation-solution" role="status">
              {solution.status === 'one' ? (
                <>
                  <ol>
                    {equationWorking(eq, symbol).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p>
                    <Text
                      mode={mode}
                      text={t(
                        `代回原式 ${equationText(eq, symbol)}，两边都为 ${eq.b}。解是未知量的值，而不是整条等式的总数。`,
                        `Substitute into ${equationText(eq, symbol)}; both sides equal ${eq.b}. A solution is the unknown’s value, not a total of the entire equation.`,
                      )}
                    />
                  </p>
                </>
              ) : (
                <Text
                  mode={mode}
                  text={
                    solution.status === 'all'
                      ? t(
                          '0×x=0：每个允许试代的数都满足，不能确定唯一的 x。',
                          '0×x=0: every allowed trial value works; there is no unique x.',
                        )
                      : t(
                          '0×x=5：没有数能满足，因为零乘任何数都为零。',
                          '0×x=5: no value works, because zero times any number is zero.',
                        )
                  }
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
function BoxesOrSolve({
  mode,
  solving,
}: {
  mode: LanguageMode;
  solving: boolean;
}) {
  const [index, setIndex] = useState(0);
  const indices = solving ? [0, 1, 3, 4, 5, 6, 7, 8, 9] : [0, 2, 3, 4];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            solving
              ? t(
                  '先认清未知量经历了什么运算，再用有依据的逆运算，并代回原式。零因数不能套用除法。',
                  'Identify the operation involving the unknown, choose a valid inverse, and substitute into the original. Zero factors cannot be undone by division.',
                )
              : t(
                  '方框是一个暂时不知道的数，不是零或运算按钮。先说它代表什么，再试代；本题重复的方框表示同一个数。',
                  'A box is a number not yet known, not zero or an operation button. State what it represents before trying a value. Repeated boxes in this equation represent the same number.',
                )
          }
        />
      </p>
      {solving ? (
        <label>
          <Text
            mode={mode}
            text={t('选择要探索的方程', 'Choose an equation to explore')}
          />
          <select
            aria-label={mode === 'en' ? 'Equation to explore' : '要探索的方程'}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
          >
            {indices.map((i) => (
              <option key={i} value={i}>
                {equationText(equationCases[i]!)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="math-equation-presets">
          {indices.map((i) => (
            <button
              key={i}
              type="button"
              className="math-button secondary"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {equationText(equationCases[i]!, '□')}
            </button>
          ))}
        </div>
      )}
      <Trial
        key={index}
        eq={equationCases[index]!}
        mode={mode}
        symbol={solving ? 'x' : '□'}
        solving={solving}
      />
    </>
  );
}
const initialBalance: BalanceState = {
  left: { boxes: 1, known: 3 },
  right: { boxes: 0, known: 11 },
};
function BalanceWorkshop({ mode }: { mode: LanguageMode }) {
  const [state, setState] = useState(initialBalance),
    [candidate, setCandidate] = useState(4),
    [checked, setChecked] = useState(false),
    [target, setTarget] = useState<'both' | 'left'>('both'),
    [action, setAction] = useState<BalanceAction>('remove-unit'),
    [message, setMessage] = useState<LocalizedText | null>(null);
  const v = balanceValues(state, candidate);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '比较 □+3 与 11。先预测一次操作是否对所有候选值保留两边的差，再试代核查。两边同时改与只改左边不同。',
            'Compare □+3 with 11. Predict whether an operation preserves the difference for every candidate, then check a trial. Changing both sides differs from changing only the left.',
          )}
        />
      </p>
      <AlgebraBalance
        state={state}
        candidate={candidate}
        mode={mode}
        checked={checked}
      />
      <Range
        label={t('方框候选值', 'Candidate box value')}
        value={candidate}
        max={20}
        mode={mode}
        onChange={(n) => {
          setCandidate(n);
          setChecked(false);
        }}
      />
      <button
        type="button"
        className="math-button secondary"
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对候选值下的两边', 'Compare sides for this candidate')}
        />
      </button>
      {checked && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `候选 ${candidate}：左边 ${v.left}，右边 ${v.right}，${v.relation === 'equal' ? '相等' : v.relation === 'left-more' ? '左边更大' : '右边更大'}。`,
              `Candidate ${candidate}: left ${v.left}, right ${v.right}; ${v.relation === 'equal' ? 'equal' : v.relation === 'left-more' ? 'left is greater' : 'right is greater'}.`,
            )}
          />
        </p>
      )}
      <div className="math-equation-controls">
        <label>
          <Text mode={mode} text={t('操作哪边', 'Which sides?')} />
          <select
            aria-label={mode === 'en' ? 'Operation target' : '操作哪边'}
            value={target}
            onChange={(e) => {
              setTarget(e.target.value as 'both' | 'left');
              setMessage(null);
            }}
          >
            <option value="both">
              {mode === 'en' ? 'Both sides' : '两边同时'}
            </option>
            <option value="left">
              {mode === 'en' ? 'Left only' : '只改左边'}
            </option>
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('每次一个', 'One at a time')} />
          <select
            aria-label={mode === 'en' ? 'Balance action' : '天平操作'}
            value={action}
            onChange={(e) => {
              setAction(e.target.value as BalanceAction);
              setMessage(null);
            }}
          >
            <option value="remove-unit">
              {mode === 'en' ? 'Remove one unit counter' : '拿掉一个单位点'}
            </option>
            <option value="add-unit">
              {mode === 'en' ? 'Add one unit counter' : '加一个单位点'}
            </option>
            <option value="remove-box">
              {mode === 'en' ? 'Remove one identical box' : '拿掉一个相同方框'}
            </option>
            <option value="add-box">
              {mode === 'en' ? 'Add one identical box' : '加一个相同方框'}
            </option>
          </select>
        </label>
      </div>
      <div className="math-equation-presets">
        <button
          type="button"
          className="math-button"
          onClick={() => {
            try {
              setState(changeBalance(state, action, target));
              setChecked(false);
              setMessage(
                target === 'both'
                  ? t(
                      '两边作相同加减，两边的差保留；原来相等则仍相等。原来不相等不会因此变相等。',
                      'Identical addition/subtraction preserves the difference: equality remains equality; an unequal pair does not become equal.',
                    )
                  : t(
                      '只改左边不保证保留原等量关系。一个候选值下偶然相等，不证明操作对所有值都等价。',
                      'Changing only the left does not preserve the relationship in general. An accidental equality for one candidate does not prove equivalence for all values.',
                    ),
              );
            } catch {
              setMessage(
                t(
                  '没有足够的同类对象可拿走，或超过当前图形范围；原图保留，不生成负的实物数。',
                  'There are not enough matching objects to remove, or the drawing bound is exceeded. Keep the original; do not draw negative object counts.',
                ),
              );
            }
          }}
        >
          <Text
            mode={mode}
            text={t('我已预测，执行操作', 'I predicted; apply the operation')}
          />
        </button>
        <button
          type="button"
          className="math-button secondary"
          onClick={() => {
            setState(initialBalance);
            setChecked(false);
            setMessage(null);
          }}
        >
          <Text mode={mode} text={t('恢复 □+3 与 11', 'Restore □+3 and 11')} />
        </button>
      </div>
      {message && (
        <p role="status">
          <Text mode={mode} text={message} />
        </p>
      )}
    </>
  );
}
function Patterns({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<GrowingPattern>('squares'),
    [n, setN] = useState(3),
    [rule, setRule] = useState(''),
    [checked, setChecked] = useState(false),
    [revealed, setRevealed] = useState(false);
  const good = patternRule(kind, rule),
    m = patternPieces(kind, n);
  const choices =
    kind === 'squares'
      ? ['3n+1', '1+3n', '4n', '3n', 'n+3']
      : ['2n+1', '1+2n', '2n', 'n+2', '3n'];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '式子必须描述每一步的构造，不只碰巧符合当前第一幅图。n 是方形个数或计数点列数，不能把编号当小棒总数。',
            'An expression must describe every construction step, not merely fit the first picture. n counts squares or counter columns; it is not the piece total.',
          )}
        />
      </p>
      <div className="math-equation-presets">
        {(['squares', 'counters'] as const).map((k) => (
          <button
            key={k}
            type="button"
            className="math-button secondary"
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              setRule('');
              setChecked(false);
              setRevealed(false);
            }}
          >
            <Text
              mode={mode}
              text={
                k === 'squares'
                  ? t('共边正方形小棒', 'Joined-square sticks')
                  : t('两行点加一个', 'Two rows plus one')
              }
            />
          </button>
        ))}
      </div>
      <Range
        label={t('构造步数 n', 'Construction step n')}
        value={n}
        min={1}
        max={8}
        mode={mode}
        onChange={(v) => {
          setN(v);
          setChecked(false);
          setRevealed(false);
        }}
      />
      <GrowingPatternView pattern={kind} n={n} mode={mode} reveal={revealed} />
      <label>
        <Text
          mode={mode}
          text={t(
            '选择适用于每一步的式子',
            'Choose an expression for every step',
          )}
        />
        <select
          aria-label={mode === 'en' ? 'Pattern expression' : '规律算式'}
          value={rule}
          onChange={(e) => {
            setRule(e.target.value);
            setChecked(false);
            setRevealed(false);
          }}
        >
          <option value="">{mode === 'en' ? 'Choose…' : '请选择…'}</option>
          {choices.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="math-button secondary"
        disabled={!rule}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对构造依据', 'Check the construction rule')}
        />
      </button>
      {checked && (
        <p role="status">
          <Text
            mode={mode}
            text={
              good
                ? kind === 'squares'
                  ? t(
                      '有效：第一幅四根，之后每多一个共边正方形只添三根；也可看上 n、下 n、竖 n+1。',
                      'Valid: four sticks first, then three per added joined square; alternatively n top, n bottom and n+1 vertical.',
                    )
                  : t(
                      '有效：两行各 n 个点，再加独立的一个点。',
                      'Valid: two rows of n counters, then one separate extra counter.',
                    )
                : t(
                    '这个式子没有描述每一步的构造。检查共边是否重复计数、额外的一根或一个点是否遗漏；第一项碰巧相同不够。',
                    'This does not describe every construction. Check shared-edge double counting or a missing extra piece. Accidentally fitting the first term is insufficient.',
                  )
            }
          />
        </p>
      )}
      {checked && good && !revealed && (
        <button
          type="button"
          className="math-button"
          onClick={() => setRevealed(true)}
        >
          <Text
            mode={mode}
            text={t('我已算好，核对这一项', 'I calculated; check this term')}
          />
        </button>
      )}
      {revealed && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `当 n=${n}，${kind === 'squares' ? '3' : '2'}×${n}+1=${m.count}。代入 n 的值计算数量，但式子本身不是方程；没有等号也没有指定一个待解的值。`,
              `For n=${n}, ${kind === 'squares' ? '3' : '2'}×${n}+1=${m.count}. Substituting n calculates a quantity. The expression itself is not an equation; it has no equal sign or specified value to solve for.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Stories({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [choice, setChoice] = useState(''),
    [checked, setChecked] = useState(false);
  const story = equationStories[index]!,
    option = story.options.find((o) => o.id === choice);
  return (
    <>
      <div className="math-equation-story-options">
        {equationStories.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="math-button secondary"
            aria-pressed={index === i}
            onClick={() => {
              setIndex(i);
              setChoice('');
              setChecked(false);
            }}
          >
            <Text mode={mode} text={s.title} />
          </button>
        ))}
      </div>
      <p>
        <Text mode={mode} text={story.stem} />
      </p>
      <p className="math-muted">
        <Text mode={mode} text={story.unknown} />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('先选等量关系', 'Choose the equality relationship first')}
        />
        <select
          aria-label={mode === 'en' ? 'Story equation' : '情境方程'}
          value={choice}
          onChange={(e) => {
            setChoice(e.target.value);
            setChecked(false);
          }}
        >
          <option value="">{mode === 'en' ? 'Choose…' : '请选择…'}</option>
          {story.options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.text}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="math-button secondary"
        disabled={!choice}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对所求对象与关系', 'Check the unknown and relationship')}
        />
      </button>
      {checked && (
        <p role="status">
          <Text
            mode={mode}
            text={
              option?.valid
                ? t(
                    `等量关系成立，x 的单位是 ${story.unit}。等号反向或加数交换仍可表示同一关系；解后代回题意。`,
                    `Relationship checked; x uses unit ${story.unit}. Reversing equality or swapping addends can retain the relationship; verify the solution in the story.`,
                  )
                : t(
                    '再检查：原量加收到量是总量；原量减花去量是剩余；相等组数乘每组量是总量。未知量的对象不能改变。',
                    'Recheck: original plus received equals total; original minus spent equals remaining; equal-group count times each amount equals total. Retain the object represented by the unknown.',
                  )
            }
          />
        </p>
      )}
      {checked && option?.valid && (
        <Trial
          key={`${index}-${choice}`}
          eq={{ ...story.eq, reversed: choice === 'b' && index !== 0 }}
          mode={mode}
          solving
        />
      )}
    </>
  );
}
export function EquationLab({
  kind,
  mode,
}: {
  kind: EquationLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-equation-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '动手数学 · 关系、预测与代回',
              'HANDS-ON MATHS · RELATE, PREDICT, SUBSTITUTE',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('精确等量模型', 'EXACT EQUALITY MODEL')} />
        </span>
      </div>
      {kind === 'equation-balance' ? (
        <BalanceWorkshop mode={mode} />
      ) : kind === 'equation-pattern' ? (
        <Patterns mode={mode} />
      ) : kind === 'equation-story' ? (
        <Stories mode={mode} />
      ) : (
        <BoxesOrSolve mode={mode} solving={kind === 'equation-one-step'} />
      )}
    </section>
  );
}
export function EquationHookArt({
  kind,
  mode,
}: {
  kind: EquationLabKind;
  mode: LanguageMode;
}) {
  return kind === 'equation-pattern' ? (
    <GrowingPatternView pattern="squares" n={3} mode={mode} />
  ) : kind === 'equation-balance' ? (
    <AlgebraBalance state={initialBalance} candidate={0} mode={mode} />
  ) : (
    <EquationBoard
      equation={equationCases[0]!}
      symbol={kind === 'equation-box' ? '□' : 'x'}
      mode={mode}
    />
  );
}
