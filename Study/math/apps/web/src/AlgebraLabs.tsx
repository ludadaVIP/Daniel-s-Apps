import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { exactRational, t, type Lesson } from './model';
import { Text } from './ui';
import { AlgebraGroups, AlgebraBoard } from './AlgebraVisuals';
import {
  algebraEquation,
  equivalentExpression,
  growingRows,
  solveAlgebra,
  sameSolutions,
  sameR,
  textR,
  evaluateAffine,
  transformEquation,
  type AlgebraEquation,
} from './algebraModels';
export type AlgebraLabKind = Extract<Lesson['lab'], `algebra-${string}`>;
export const isAlgebraLab = (kind: Lesson['lab']): kind is AlgebraLabKind =>
  kind.startsWith('algebra-');
const primary = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  label,
  value,
  min,
  max,
  mode,
  change,
}: {
  label: LocalizedText;
  value: number;
  min: number;
  max: number;
  mode: LanguageMode;
  change: (v: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={primary(mode, label)}
        value={value}
        min={min}
        max={max}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Action({
  text,
  mode,
  click,
}: {
  text: LocalizedText;
  mode: LanguageMode;
  click: () => void;
}) {
  return (
    <button className="math-button" onClick={click}>
      <Text mode={mode} text={text} />
    </button>
  );
}
function Letters({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(4),
    [show, setShow] = useState(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一个式子中，重复出现的 n 取同一个数。这里 n 是纯数，可为零或负数；不是把字母当物品名称。先代入括号，再计算。',
            'Repeated n in one expression has the same value. Here n is a pure number that may be zero or negative, rather than an object label. Substitute in brackets before calculating.',
          )}
        />
      </p>
      <Slider
        label={t('字母 n 的值', 'Value of n')}
        value={n}
        min={-4}
        max={8}
        mode={mode}
        change={(v) => {
          setN(v);
          setShow(false);
        }}
      />
      <div className="math-algebra-substitution">
        <span>n + n + 3</span>
        <b>↓ n = {n}</b>
        <span>
          ({n}) + ({n}) + 3
        </span>
      </div>
      <Action
        text={t('核对代入和简写', 'Check substitution and shorthand')}
        mode={mode}
        click={() => setShow(true)}
      />
      {show && (
        <p
          role="status"
          aria-label={mode === 'en' ? 'Workshop feedback' : '探索反馈'}
        >
          <Text
            mode={mode}
            text={t(
              `n+n+3 = 2n+3 = ${2 * n + 3}。2n 是 2×n，不是 2+n；同一行两个 n 都取 ${n}。`,
              `n+n+3 = 2n+3 = ${2 * n + 3}. 2n means 2×n, not 2+n; both n values in this row are ${n}.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Nth({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(4),
    [formula, setFormula] = useState('n+3'),
    [show, setShow] = useState(false),
    m = growingRows(n);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '第 n 幅严格按“三行各 n 个圆点，另有两个固定方块”构造，n 从一开始。不要把每次增加三误当总数 3n；也不能只凭前几项猜出唯一规则。',
            'Stage n is defined by three rows of n circles plus two fixed squares, starting at n=1. Growing by three does not make the total 3n. A few observed terms alone do not determine a unique rule.',
          )}
        />
      </p>
      <Slider
        label={t('构造的图号 n', 'Constructed stage n')}
        value={n}
        min={1}
        max={10}
        mode={mode}
        change={(v) => {
          setN(v);
          setShow(false);
        }}
      />
      <AlgebraGroups n={n} inside={false} mode={mode} />
      <p>
        {n} + {n} + {n} + 2 = {m.total}
      </p>
      <label>
        <Text mode={mode} text={t('选择通用规则', 'Choose the general rule')} />
        <select
          aria-label={primary(
            mode,
            t('选择通用规则', 'Choose the general rule'),
          )}
          value={formula}
          onChange={(e) => {
            setFormula(e.target.value);
            setShow(false);
          }}
        >
          {['n+3', '3n', '3n+2', '3(n+2)'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <Action
        text={t('用构造核对第 n 项', 'Check the nth term against construction')}
        mode={mode}
        click={() => setShow(true)}
      />
      {show && (
        <p
          role="status"
          aria-label={mode === 'en' ? 'Workshop feedback' : '探索反馈'}
        >
          <Text
            mode={mode}
            text={
              formula === '3n+2'
                ? t(
                    '成立：三行各 n 个加两个固定量，总数 3n+2。第 20 幅为 62，不必画完二十幅。n 是图号，3n+2 是总数。',
                    'Correct: three rows of n plus two fixed pieces give 3n+2. Stage 20 has 62; drawing every earlier stage is unnecessary. n is the stage index; 3n+2 is the total.',
                  )
                : t(
                    '与给定构造不同。第 1 幅五个、第 2 幅八个；请把三行和两个固定方块分别对应到式子。单次巧合不能代替结构解释。',
                    'That differs from the defined construction. Stages 1 and 2 contain five and eight. Match the three rows and two fixed squares to the expression. One coinciding value is insufficient.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function Expressions({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(3),
    [inside, setInside] = useState(true),
    [input, setInput] = useState(''),
    [show, setShow] = useState(false);
  const expected = inside ? '3(n+2)' : '3n+2';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            inside
              ? t(
                  '三袋，每袋有 n 个圆点和两个方块。请写总数的式子，n 为每袋圆点数，可取非负整数。',
                  'There are three bags, each with n circles and two squares. Write the total as an expression. n is the nonnegative whole-number circle count per bag.',
                )
              : t(
                  '三袋各有 n 个圆点，袋外总共另放两个方块。写出总数式子。',
                  'Three bags each contain n circles, with two additional squares outside all bags. Write the total.',
                )
          }
        />
      </p>
      <button
        className="math-quiet"
        onClick={() => {
          setInside(!inside);
          setInput('');
          setShow(false);
        }}
      >
        <Text
          mode={mode}
          text={t(
            '切换固定量在袋内或袋外',
            'Switch extras inside or outside the bags',
          )}
        />
      </button>
      <Slider
        label={t('每袋圆点数 n', 'Circles per bag n')}
        value={n}
        min={0}
        max={8}
        mode={mode}
        change={(v) => {
          setN(v);
          setShow(false);
        }}
      />
      <AlgebraGroups n={n} inside={inside} mode={mode} />
      <label>
        <Text mode={mode} text={t('我的通用代数式', 'My general expression')} />
        <input
          aria-label={primary(
            mode,
            t('我的通用代数式', 'My general expression'),
          )}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShow(false);
          }}
          autoComplete="off"
        />
      </label>
      <Action
        text={t(
          '核对所有允许 n 的结构',
          'Check the structure for every allowed n',
        )}
        mode={mode}
        click={() => setShow(true)}
      />
      {show && (
        <p
          role="status"
          aria-label={mode === 'en' ? 'Workshop feedback' : '探索反馈'}
        >
          <Text
            mode={mode}
            text={
              equivalentExpression(input, expected)
                ? t(
                    `等值式成立：${expected}，当前总数 ${inside ? 3 * (n + 2) : 3 * n + 2}。核对的是 n 的系数和固定量，不是只在当前 n 试出相同答案。`,
                    `Equivalent expression: ${expected}; the current total is ${inside ? 3 * (n + 2) : 3 * n + 2}. The coefficient and fixed term agree, rather than merely matching at the current n.`,
                  )
                : t(
                    `还不成立。${inside ? '两个方块每袋都有，固定量共有六个' : '两个方块只额外加一次'}。写含 n 的通用式，不能只填当前总数；比较 n=0 和 n=1，再对照分组。`,
                    `Not equivalent yet. ${inside ? 'The two squares occur in every bag, giving six fixed pieces' : 'The two squares are added once overall'}. Write a general expression in n, not just the current total. Compare n=0 and n=1, then match the groups.`,
                  )
            }
          />
        </p>
      )}
    </>
  );
}
const presets = [
  { label: '2x = 10', left: '2x', right: '10' },
  { label: 'x + 5 = 2', left: 'x+5', right: '2' },
  { label: '3(x + 2) = 15', left: '3(x+2)', right: '15' },
  { label: '(x − 4)/2 = 3', left: '(x-4)/2', right: '3' },
  { label: '3(x + 2) = 5', left: '3(x+2)', right: '5' },
];
function Balance({
  mode,
  brackets,
}: {
  mode: LanguageMode;
  brackets: boolean;
}) {
  const [preset, setPreset] = useState(brackets ? 2 : 0),
    [equation, setEquation] = useState<AlgebraEquation>(() =>
      algebraEquation(
        presets[brackets ? 2 : 0]!.left,
        presets[brackets ? 2 : 0]!.right,
      ),
    ),
    [candidate, setCandidate] = useState('4'),
    [operation, setOperation] = useState<'+' | '−' | '×' | '÷'>('÷'),
    [amount, setAmount] = useState(brackets ? '3' : '2'),
    [side, setSide] = useState<'both' | 'left'>('both'),
    [history, setHistory] = useState<LocalizedText[]>([]),
    [status, setStatus] = useState<LocalizedText | null>(null);
  const original = algebraEquation(
      presets[preset]!.left,
      presets[preset]!.right,
    ),
    value = exactRational(candidate);
  const reset = (next = preset) => {
    setPreset(next);
    setEquation(algebraEquation(presets[next]!.left, presets[next]!.right));
    setHistory([]);
    setStatus(null);
  };
  const perform = () => {
    const k = exactRational(amount);
    if (!k || amount.includes('%')) {
      setStatus(
        t(
          '请填精确数值，如 2 或 1/2。',
          'Enter an exact number, such as 2 or 1/2.',
        ),
      );
      return;
    }
    if (history.length >= 8) {
      setStatus(
        t(
          '这轮已记录八步；恢复原式后重新探索较短路径。',
          'Eight steps are recorded. Restore the original to explore a shorter path.',
        ),
      );
      return;
    }
    try {
      const next = transformEquation(equation, operation, k, side);
      setEquation(next);
      setHistory([
        ...history,
        t(
          `${side === 'both' ? '两边同做' : '只改左边'} ${operation} (${textR(k)})`,
          `${side === 'both' ? 'Both sides' : 'Left only'} ${operation} (${textR(k)})`,
        ),
      ]);
      setStatus(
        sameSolutions(original, next)
          ? t(
              '解集保持相同。继续使一边只剩 x，最后代回原式核查；当前候选是否相等是另一项检查。',
              'The solution set is preserved. Isolate x and then check the original equation; whether the current candidate balances is a separate check.',
            )
          : t(
              '解集已改变：只改一边通常破坏原关系。即使某个候选碰巧满足新式，也不能当作原式的解。恢复原式再同做两边。',
              'The solution set changed: changing only one side generally breaks the original relationship. A candidate satisfying the new equation need not solve the original. Restore it, then act on both sides.',
            ),
      );
    } catch {
      setStatus(
        t(
          '乘零会丢失解的信息，除零没有定义；解方程时这里要求非零乘除数。',
          'Multiplying by zero loses solution information; division by zero is undefined. Use a nonzero factor or divisor when solving here.',
        ),
      );
    }
  };
  const verify = () => {
    if (!value || candidate.includes('%')) {
      setStatus(
        t(
          '候选值需为整数、小数或分数。',
          'Use an integer, decimal or fraction for the candidate.',
        ),
      );
      return;
    }
    const l = evaluateAffine(original.left, value),
      r = evaluateAffine(original.right, value),
      answer = solveAlgebra(original);
    setStatus(
      sameR(l, r)
        ? t(
            `代回原式：左 ${textR(l)} = 右 ${textR(r)}，所以 x=${textR(value)} 是原式的解。当前变形式${sameSolutions(original, equation) ? '仍等价' : '已不等价，应恢复'}。`,
            `Original substitution: left ${textR(l)} = right ${textR(r)}, so x=${textR(value)} solves the original. The current transformed equation ${sameSolutions(original, equation) ? 'is still equivalent' : 'is not equivalent; restore it'}.`,
          )
        : t(
            `代回原式：左 ${textR(l)}，右 ${textR(r)}，不相等。候选 ${textR(value)} 还不是解。${answer.kind === 'one' ? '请用逆运算求解，再代回。' : ''}`,
            `Original substitution: left ${textR(l)}, right ${textR(r)}; unequal. Candidate ${textR(value)} is not a solution. Use inverse operations, then substitute again.`,
          ),
    );
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            brackets
              ? t(
                  '括号把一整份括起来。3(x+2)=15 可先两边除三，再两边减二；不是只除 x 或只给一边做运算。允许有理数解，不四舍五入。',
                  'Brackets group one whole quantity. For 3(x+2)=15, divide both sides by three, then subtract two from both. Do not divide only x or act on only one side. Rational solutions stay exact.',
                )
              : t(
                  '等号表示两边值相同。用相同可逆运算保持解，再代入原式核查。试故意只改左边，区分“新式看似平衡”和“仍是原关系”。',
                  'Equality states that both values agree. Apply the same reversible operation to preserve solutions, then check the original. Try changing only the left side to distinguish a new balance from preservation of the original relationship.',
                )
          }
        />
      </p>
      <label>
        <Text mode={mode} text={t('原方程', 'Original equation')} />
        <select
          aria-label={primary(mode, t('原方程', 'Original equation'))}
          value={preset}
          onChange={(e) => reset(Number(e.target.value))}
        >
          {presets.map(
            (p, i) =>
              (brackets ? i >= 2 : i < 2) && (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ),
          )}
        </select>
      </label>
      <p>
        <Text mode={mode} text={t('始终核回：', 'Always check:')} />{' '}
        {presets[preset]!.label}
      </p>
      <AlgebraBoard equation={equation} candidate={value} mode={mode} />
      <div className="math-algebra-controls">
        <label>
          <Text mode={mode} text={t('变形运算', 'Transformation')} />
          <select
            aria-label={primary(mode, t('变形运算', 'Transformation'))}
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value as typeof operation);
              setStatus(null);
            }}
          >
            {['+', '−', '×', '÷'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('同做的数', 'Operation amount')} />
          <input
            aria-label={primary(mode, t('同做的数', 'Operation amount'))}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setStatus(null);
            }}
          />
        </label>
        <label>
          <Text
            mode={mode}
            text={t('作用两边或只左边', 'Apply to both or left only')}
          />
          <select
            aria-label={primary(
              mode,
              t('作用两边或只左边', 'Apply to both or left only'),
            )}
            value={side}
            onChange={(e) => {
              setSide(e.target.value as typeof side);
              setStatus(null);
            }}
          >
            <option value="both">
              {primary(mode, t('两边同做', 'Both sides'))}
            </option>
            <option value="left">
              {primary(
                mode,
                t('只改左边（查错）', 'Left only (error investigation)'),
              )}
            </option>
          </select>
        </label>
      </div>
      <Action
        text={t('执行并检查解集', 'Apply and inspect the solution set')}
        mode={mode}
        click={perform}
      />
      <ol
        className="math-algebra-history"
        aria-label={primary(mode, t('变形记录', 'Transformation record'))}
      >
        {history.map((s, i) => (
          <li key={i}>
            <Text mode={mode} text={s} />
          </li>
        ))}
      </ol>
      <button className="math-quiet" onClick={() => reset()}>
        <Text mode={mode} text={t('恢复原方程', 'Restore original equation')} />
      </button>
      <label>
        <Text
          mode={mode}
          text={t('候选 x（整数或分数）', 'Candidate x (integer or fraction)')}
        />
        <input
          aria-label={primary(
            mode,
            t('候选 x（整数或分数）', 'Candidate x (integer or fraction)'),
          )}
          value={candidate}
          onChange={(e) => {
            setCandidate(e.target.value);
            setStatus(null);
          }}
        />
      </label>
      <Action
        text={t('代回原方程核查', 'Check in the original equation')}
        mode={mode}
        click={verify}
      />
      {status && (
        <p
          role="status"
          aria-label={mode === 'en' ? 'Workshop feedback' : '探索反馈'}
        >
          <Text mode={mode} text={status} />
        </p>
      )}
    </>
  );
}
export function AlgebraLab({
  kind,
  mode,
}: {
  kind: AlgebraLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-algebra-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 字母、结构与等价',
            'HANDS-ON MATHS · LETTERS, STRUCTURE AND EQUIVALENCE',
          )}
        />
      </span>
      {kind === 'algebra-letter' ? (
        <Letters mode={mode} />
      ) : kind === 'algebra-nth' ? (
        <Nth mode={mode} />
      ) : kind === 'algebra-expression' ? (
        <Expressions mode={mode} />
      ) : (
        <Balance
          key={kind}
          mode={mode}
          brackets={kind === 'algebra-brackets'}
        />
      )}
    </section>
  );
}
export function AlgebraHookArt({
  kind,
  mode,
}: {
  kind: AlgebraLabKind;
  mode: LanguageMode;
}) {
  const formula = {
    'algebra-letter': 'n = −2 → n + n + 3 = ?',
    'algebra-nth': 'n → ?',
    'algebra-expression': '3 × [ ? ]',
    'algebra-balance': '2x = 10 → x = ?',
    'algebra-brackets': '3(x + 2) = 5 → x = ?',
  }[kind];
  return (
    <div className="math-algebra-hook">
      <b>{formula}</b>
      <Text
        mode={mode}
        text={t(
          '先说明字母表示什么，再用结构或相等关系解释理由。',
          'Define the letter, then explain using structure or equality.',
        )}
      />
    </div>
  );
}
