import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson } from './model';
import { Text } from './ui';
import {
  monomialProduct,
  singleProduct,
  binomialProduct,
  squareIdentity,
  conjugateIdentity,
  identityProbe,
  type productGrid,
} from './identityModels';
import {
  ProductArea,
  SquareRemoval,
  DifferencePieces,
} from './IdentityVisuals';
export type IdentityLabKind = Extract<Lesson['lab'], `identity-${string}`>;
export const isIdentityLab = (kind: Lesson['lab']): kind is IdentityLabKind =>
  kind.startsWith('identity-');
const label = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  mode,
  name,
  value,
  min = -4,
  max = 4,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min?: number;
  max?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Task({
  mode,
  value,
  variables = ['x'],
}: {
  mode: LanguageMode;
  value: string;
  variables?: string[];
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    answer = {
      kind: 'polynomial' as const,
      value,
      variables,
      collected: true,
      finishedProduct: true,
    };
  const correct = checkAnswer(input, answer),
    equivalent = checkAnswer(input, {
      ...answer,
      collected: false,
      finishedProduct: false,
    });
  return (
    <div
      className="math-identity-task"
      role="group"
      aria-label={label(
        mode,
        t('我展开并合并的结果', 'My expanded and collected result'),
      )}
    >
      <label>
        <Text
          mode={mode}
          text={t('我展开并合并的结果', 'My expanded and collected result')}
        />
        <input
          type="text"
          aria-label={label(
            mode,
            t('我展开并合并的结果', 'My expanded and collected result'),
          )}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '只写表达式，不写等号；完成每项乘积并合并，省略零项。可用 x^2 或 x²。',
            'Enter only the expression, without an equal sign. Finish all products and collect, omitting zero terms. Use x^2 or x².',
          )}
        />
      </p>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的展开', 'Check my expansion')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('乘法反馈', 'Multiplication feedback'))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '结果正确。说明每一项来自哪一对因子。',
                    'The result matches. Explain which factor pair supplies each term.',
                  )
                : equivalent
                  ? t(
                      '已经等值；还需完成乘积、去括号与同类项合并。',
                      'Already equivalent; finish products, expansion and collection.',
                    )
                  : t(
                      '核对系数相乘、同底指数相加、每项配对与符号；一个代入值不能代替一般式。',
                      'Recheck coefficient products, same-base exponent addition, every term pair and signs; one substituted number cannot replace the general expression.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Grid({
  model,
  mode,
}: {
  model: ReturnType<typeof productGrid>;
  mode: LanguageMode;
}) {
  const [revealed, setRevealed] = useState<string[]>([]);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测，再点每一格核对一对乘积；格子是代数配对，不是负面积。',
            'Predict, then reveal each term pair. These cells record algebraic products, not negative areas.',
          )}
        />
      </p>
      <table className="math-identity-table">
        <caption>
          <Text mode={mode} text={t('逐项乘积表', 'Every term-pair product')} />
        </caption>
        <thead>
          <tr>
            <th>×</th>
            {model.columns.map((s, i) => (
              <th key={i} scope="col">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {model.rows.map((s, i) => (
            <tr key={i}>
              <th scope="row">{s}</th>
              {model.columns.map((_, j) => {
                const c = model.cells.find(
                  (c) => c.row === i && c.column === j,
                )!;
                return (
                  <td key={j}>
                    <button
                      className="math-button secondary"
                      aria-label={label(
                        mode,
                        t(
                          `核对配对 ${i + 1},${j + 1}`,
                          `Reveal pair ${i + 1},${j + 1}`,
                        ),
                      )}
                      aria-pressed={revealed.includes(c.id)}
                      data-product-cell={c.id}
                      onClick={() =>
                        setRevealed((old) =>
                          old.includes(c.id) ? old : old.concat(c.id),
                        )
                      }
                    >
                      {revealed.includes(c.id) ? c.text : '?'}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Text
          mode={mode}
          text={t(
            `已核 ${revealed.length}/${model.cells.length} 对；每一对都需要，之后才合并同类项。`,
            `Checked ${revealed.length}/${model.cells.length} pairs. Include every pair before collecting like terms.`,
          )}
        />
      </p>
    </>
  );
}
function Monomials({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(-2),
    [b, setB] = useState(3),
    [m, setM] = useState(2),
    [n, setN] = useState(1),
    [different, setDifferent] = useState(false),
    [shown, setShown] = useState(false),
    model = monomialProduct(a, b, m, n, different),
    key = `${a}/${b}/${m}/${n}/${different}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先乘系数，再连接字母因子。相同底数的乘法把重复因子个数相加；不同字母不能合并指数。零系数使整个乘积为零。',
            'Multiply coefficients, then concatenate letter factors. Add exponents only for products with the same base; keep different letters separate. A zero coefficient makes the product zero.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('第一系数', 'First coefficient')}
        value={a}
        change={(v) => {
          setA(v);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('第二系数', 'Second coefficient')}
        value={b}
        change={(v) => {
          setB(v);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('第一指数', 'First exponent')}
        value={m}
        min={1}
        max={2}
        change={(v) => {
          setM(v);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('第二指数', 'Second exponent')}
        value={n}
        min={1}
        max={2}
        change={(v) => {
          setN(v);
          setShown(false);
        }}
      />
      <label>
        <input
          type="checkbox"
          checked={different}
          onChange={(e) => {
            setDifferent(e.target.checked);
            setShown(false);
          }}
        />
        <Text
          mode={mode}
          text={t('第二因子改用 y', 'Use y in the second factor')}
        />
      </label>
      <p className="math-identity-expression">
        ({model.rows[0]}) × ({model.columns[0]})
      </p>
      <Task key={key} mode={mode} value={model.result} variables={['x', 'y']} />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('展开或收起重复因子', 'Show or hide repeated factors')}
        />
      </button>
      {shown && (
        <p data-repeated-factors>
          {a} × {b} × {model.factors.join(' × ')}
        </p>
      )}
    </>
  );
}
function Single({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    m = singleProduct(index);
  return (
    <>
      <label>
        <Text mode={mode} text={t('外因子实验', 'Outside-factor experiment')} />
        <select
          aria-label={label(mode, t('外因子实验', 'Outside-factor experiment'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {['2x(x+3)', '−x(2x+5)', '(1/2)x(4x−6)', '0(x²−x+2)'].map((v, i) => (
            <option key={i} value={i}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <Grid key={index} model={m} mode={mode} />
      {m.area ? (
        <ProductArea
          mode={mode}
          rows={[{ label: '2x', value: 6 }]}
          columns={[
            { label: 'x', value: 3 },
            { label: '3', value: 3 },
          ]}
        />
      ) : (
        <p>
          <Text
            mode={mode}
            text={t(
              '此例保留符号配对，不把负项画成负长度。零乘积也要由每项乘零解释。',
              'Use signed algebraic pairs here, not negative lengths. Explain a zero product through zero times every term.',
            )}
          />
        </p>
      )}
      <Task key={`task/${index}`} mode={mode} value={m.result} />
    </>
  );
}
function Binomials({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(2),
    [b, setB] = useState(3),
    key = `${a}/${b}`,
    m = binomialProduct(a, b);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '调查 (x+a)(x+b)：第一括号每项都乘第二括号每项。两项乘两项有四对，不能只保留首尾；中间两对可能合并或相消。',
            'Investigate (x+a)(x+b). Each term in the first factor meets each in the second: four pairs, not just the ends. Middle pairs may combine or cancel.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('偏移 a', 'Offset a')}
        value={a}
        change={setA}
      />
      <Slider
        mode={mode}
        name={t('偏移 b', 'Offset b')}
        value={b}
        change={setB}
      />
      <Grid key={key} model={m} mode={mode} />
      {a >= 0 && b >= 0 ? (
        <ProductArea
          mode={mode}
          rows={[
            { label: 'x', value: 4 },
            { label: 'a', value: a },
          ]}
          columns={[
            { label: 'x', value: 4 },
            { label: 'b', value: b },
          ]}
        />
      ) : (
        <p>
          <Text
            mode={mode}
            text={t(
              '偏移含负数，改用有符号乘积表；不把负数作为分块长度。一般代数关系不受面积图正长度限制。',
              'A negative offset calls for the signed product table, not negative partition lengths. The general algebraic identity extends beyond this positive-length picture.',
            )}
          />
        </p>
      )}
      <Task key={`task/${key}`} mode={mode} value={m.result} />
    </>
  );
}
function Squares({ mode }: { mode: LanguageMode }) {
  const [b, setB] = useState(2),
    [minus, setMinus] = useState(false),
    [probe, setProbe] = useState<number | null>(null),
    key = `${b}/${minus}`,
    m = squareIdentity(b, minus),
    p = probe === null ? null : identityProbe(b, minus, probe);
  return (
    <>
      <label>
        <Text mode={mode} text={t('平方的符号', 'Square sign')} />
        <select
          aria-label={label(mode, t('平方的符号', 'Square sign'))}
          value={minus ? 'minus' : 'plus'}
          onChange={(e) => {
            setMinus(e.target.value === 'minus');
            setProbe(null);
          }}
        >
          <option value="plus">(x+b)²</option>
          <option value="minus">(x−b)²</option>
        </select>
      </label>
      <Slider
        mode={mode}
        name={t('常数 b', 'Constant b')}
        value={b}
        min={1}
        max={3}
        change={(v) => {
          setB(v);
          setProbe(null);
        }}
      />
      <Grid key={key} model={m} mode={mode} />
      {minus ? (
        <SquareRemoval x={5} b={b} mode={mode} />
      ) : (
        <ProductArea
          mode={mode}
          rows={[
            { label: 'x', value: 5 },
            { label: 'b', value: b },
          ]}
          columns={[
            { label: 'x', value: 5 },
            { label: 'b', value: b },
          ]}
        />
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '两块交叉项来自不同配对，不是同一块数两次。减号平方的常数项仍为正。',
            'The two cross terms come from different pairs, not double-counting one piece. The constant square remains positive in (x−b)².',
          )}
        />
      </p>
      <Task key={`task/${key}`} mode={mode} value={m.result} />
      <p>
        <Text
          mode={mode}
          text={t(
            '检错主张：(x±b)²=x²+b²。试数可否证，少数吻合不能证明恒等。',
            'Test the claim (x±b)²=x²+b². A counterexample disproves it; a few agreements do not prove an identity.',
          )}
        />
      </p>
      {[0, 1].map((x) => (
        <button
          key={x}
          className="math-button secondary"
          onClick={() => setProbe(x)}
        >
          <Text mode={mode} text={t(`检验 x=${x}`, `Test x=${x}`)} />
        </button>
      ))}
      {p && (
        <p
          role="status"
          aria-label={label(mode, t('反例观察', 'Counterexample observation'))}
        >
          <Text
            mode={mode}
            text={t(
              `x=${p.x}，原平方 ${p.actual}，漏中项式 ${p.missingMiddle}；${p.actual === p.missingMiddle ? '这次吻合不能证明恒等。' : '结果不同，原主张被否证。'} 此为代数代入，非负长度图的延伸。`,
              `At x=${p.x}, the square is ${p.actual}, the missing-middle expression ${p.missingMiddle}. ${p.actual === p.missingMiddle ? 'This agreement does not prove an identity.' : 'The difference disproves the claim.'} This is algebraic substitution, beyond the positive-length picture.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Differences({ mode }: { mode: LanguageMode }) {
  const [b, setB] = useState(2),
    [x, setX] = useState(5),
    [moved, setMoved] = useState(false),
    m = conjugateIdentity(b);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一首项、互为相反数的次项：(x+b)(x−b)。先列四对，看中间项为什么相消；它不是 (x−b)²。',
            'The factors share a first term and have opposite second terms: (x+b)(x−b). List four pairs to explain cancellation. This differs from (x−b)².',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('常数 b', 'Constant b')}
        value={b}
        min={1}
        max={3}
        change={(v) => {
          setB(v);
          setMoved(false);
        }}
      />
      <Grid key={b} model={m} mode={mode} />
      <Task key={`task/${b}`} mode={mode} value={m.result} />
      <Slider
        mode={mode}
        name={t('仅用于图的 x', 'Illustration x only')}
        value={x}
        min={4}
        max={8}
        change={setX}
      />
      <DifferencePieces x={x} b={b} rearranged={moved} mode={mode} />
      <button className="math-button" onClick={() => setMoved(!moved)}>
        <Text
          mode={mode}
          text={
            moved
              ? t('还原同两块', 'Restore the same two pieces')
              : t('重排同两块', 'Rearrange the same two pieces')
          }
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            '图取 x>b>0；代数分配证明对任意实数 x、b 成立。只改图中 x 不改变符号任务，也不会把有限次试数当证明。',
            'The picture uses x>b>0. Distribution proves the algebraic identity for all real x,b. Changing illustration x preserves the symbolic task; finite numerical checks are not a proof.',
          )}
        />
      </p>
    </>
  );
}
export function IdentityLab({
  kind,
  mode,
}: {
  kind: IdentityLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-identity-lab">
      {kind === 'identity-monomial' ? (
        <Monomials mode={mode} />
      ) : kind === 'identity-distribute' ? (
        <Single mode={mode} />
      ) : kind === 'identity-binomial' ? (
        <Binomials mode={mode} />
      ) : kind === 'identity-square' ? (
        <Squares mode={mode} />
      ) : (
        <Differences mode={mode} />
      )}
    </div>
  );
}
export function IdentityHookArt({
  kind,
  mode,
}: {
  kind: IdentityLabKind;
  mode: LanguageMode;
}) {
  const hooks = {
    'identity-monomial': 'GROUPS OF x FACTORS → HOW MANY ?',
    'identity-distribute': 'ONE TERM × EVERY TERM ?',
    'identity-binomial': '2 TERMS × 2 TERMS → HOW MANY PAIRS ?',
    'identity-square': '(x+b)² → WHERE ARE THE CROSS TERMS ?',
    'identity-difference': '(x+b)(x−b) → WHY CANCEL ?',
  };
  return (
    <div className="math-identity-hook">
      <strong>{hooks[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '因子 → 全部配对 → 合并 → 结构解释',
            'Factors → all pairs → collection → structural explanation',
          )}
        />
      </p>
    </div>
  );
}
