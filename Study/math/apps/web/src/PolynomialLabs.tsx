import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import {
  parsePolynomial,
  polynomialValue,
  substitutionText,
  monomialText,
  termBuckets,
  distribution,
  expressionPair,
  storyModel,
  type TermCard,
  type StoryKind,
} from './polynomialModels';
export type PolynomialLabKind = Extract<Lesson['lab'], `poly-${string}`>;
export const isPolynomialLab = (
  kind: Lesson['lab'],
): kind is PolynomialLabKind => kind.startsWith('poly-');
const label = (m: LanguageMode, text: LocalizedText) =>
  m === 'en' ? text.en : text.zh;
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
        aria-label={label(mode, name)}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Frame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-poly-figure">
      <div
        role="region"
        tabIndex={0}
        aria-label={label(
          mode,
          t(
            '代数关系模型，可局部滚动',
            'Algebra relationship model; scroll locally',
          ),
        )}
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [status, setStatus] = useState<'correct' | 'form' | 'wrong' | null>(null);
  return (
    <div className="math-poly-task" role="group" aria-label={label(mode, name)}>
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          aria-label={label(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setStatus(null);
          }}
        />
      </label>
      <button
        className="math-button"
        onClick={() =>
          setStatus(
            checkAnswer(input, answer) === true
              ? 'correct'
              : answer.kind === 'polynomial' &&
                  answer.collected &&
                  checkAnswer(input, { ...answer, collected: false }) === true
                ? 'form'
                : 'wrong',
          )
        }
      >
        <Text mode={mode} text={t('核对我的表达', 'Check my expression')} />
      </button>
      {status && (
        <p
          role="status"
          aria-label={label(mode, t('探索反馈', 'Workshop feedback'))}
        >
          <Text
            mode={mode}
            text={
              status === 'correct'
                ? t(
                    '关系与所求写法正确。请说明每个量和项的来源。',
                    'Relationship and requested form correct. Explain the source of every quantity and term.',
                  )
                : status === 'form'
                  ? t(
                      '代数式已等值，但还需完成去括号或合并同类项。',
                      'The expressions are equivalent, but finish distribution or collection of like terms.',
                    )
                  : answer.kind === 'number'
                    ? t(
                        '重新代入每个字母，检查负数括号、运算顺序和单位；此处要写数值。',
                        'Recheck every substitution, negative brackets, operation order and units; enter a numerical value here.',
                      )
                    : t(
                        '重新检查字母、指数、系数、括号与所求量；一个代入值不能代替一般代数式。',
                        'Recheck letters, exponents, coefficients, brackets and the requested quantity; one numerical value cannot replace a general expression.',
                      )
            }
          />
        </p>
      )}
    </div>
  );
}
const expressionAnswer = (
  value: string,
  variables = ['x'],
  collected = false,
): AnswerSpec => ({ kind: 'polynomial', value, variables, collected });
const numberAnswer = (
  value: string,
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
): AnswerSpec => ({
  kind: 'number',
  value,
  unit,
  formats: ['decimal', 'fraction'],
});
function Card({ card }: { card: TermCard }) {
  return (
    <div
      className="math-poly-card"
      data-poly-card
      data-source-id={card.id}
      data-monomial={[...card.key].sort().join('')}
    >
      <strong>
        {card.coefficient >= 0 ? '+' : ''}
        {card.coefficient}
      </strong>
      <span>× {monomialText(card.key) || '1'}</span>
    </div>
  );
}
function Cards({
  cards,
  mode,
  grouped = false,
}: {
  cards: TermCard[];
  mode: LanguageMode;
  grouped?: boolean;
}) {
  const m = termBuckets(cards);
  return (
    <Frame
      mode={mode}
      caption={t(
        '卡片只登记符号系数与字母部分，不按卡片面积度量。分组保留原卡身份；抵消后零项从结果省去。',
        'Cards record signed coefficients and variable parts, not physical areas. Grouping retains original card identities; zero terms are omitted from the result.',
      )}
    >
      <div className="math-poly-cards">
        {grouped
          ? m.groups.map((g) => (
              <div key={g.key} className="math-poly-bucket">
                <p>
                  <Text
                    mode={mode}
                    text={t('同一字母部分', 'Same variable part')}
                  />{' '}
                  {monomialText(g.key) || '1'}
                </p>
                {g.cards.map((c) => (
                  <Card key={c.id} card={c} />
                ))}
                <p>
                  Σ {g.coefficient} × {monomialText(g.key) || '1'}
                </p>
              </div>
            ))
          : cards.map((c) => <Card key={c.id} card={c} />)}
      </div>
    </Frame>
  );
}
function Substitute({ mode }: { mode: LanguageMode }) {
  const [family, setFamily] = useState('square'),
    [n, setN] = useState(-2),
    [d, setD] = useState(1),
    [y, setY] = useState(1);
  const raw =
      family === 'square' ? 'x^2+2x-3' : family === 'linear' ? '2x-3' : '2xy+x',
    vars = family === 'two' ? ['x', 'y'] : ['x'],
    values = { x: `${n}/${d}`, y: String(y) },
    result = polynomialValue(raw, vars, values)!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一个字母的每次出现都代入同一个数，负数用括号保留。表达式不带等号，代入后才得到此组数值下的结果；单次相等不证明恒等。',
            'Every occurrence of one letter receives the same value; bracket negative substitutions. An expression has no equal sign, and its numerical result depends on the assignment. One matching value does not prove identity.',
          )}
        />
      </p>
      <div className="math-poly-controls">
        <label>
          <Text mode={mode} text={t('代数式家族', 'Expression family')} />
          <select
            aria-label={label(mode, t('代数式家族', 'Expression family'))}
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="square">x²+2x−3</option>
            <option value="linear">2x−3</option>
            <option value="two">2xy+x</option>
          </select>
        </label>
        <Slider
          mode={mode}
          name={t('x 的分子', 'Numerator of x')}
          value={n}
          change={setN}
        />
        <label>
          <Text mode={mode} text={t('x 的分母', 'Denominator of x')} />
          <select
            aria-label={label(mode, t('x 的分母', 'Denominator of x'))}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
          >
            {[1, 2, 4].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        {family === 'two' && (
          <Slider
            mode={mode}
            name={t('y 的值', 'Value of y')}
            value={y}
            min={-3}
            max={3}
            change={setY}
          />
        )}
      </div>
      <p className="math-poly-formula">
        {raw} → {substitutionText(raw, vars, values)}
      </p>
      <Task
        key={`${family}/${n}/${d}/${y}`}
        mode={mode}
        name={t('我的代入值', 'My substituted value')}
        answer={numberAnswer(result)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '反例提醒：x² 与 x 在 0、1 都相等，但在 x=2 分别为四与二。恒等必须看所有系数与字母部分，不能凭几次试数。',
            'Counterexample: x² and x agree at 0 and 1, but at x=2 give four and two. Identity depends on all coefficients and variable parts, not a few trials.',
          )}
        />
      </p>
    </>
  );
}
function Like({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(3),
    [c, setC] = useState(4),
    [first, setFirst] = useState('xx'),
    [third, setThird] = useState('xx'),
    [grouped, setGrouped] = useState(false),
    cards: TermCard[] = [
      { id: 'A', coefficient: a, key: first },
      { id: 'B', coefficient: -2, key: 'x' },
      { id: 'C', coefficient: c, key: third },
      { id: 'D', coefficient: 1, key: '' },
    ],
    m = termBuckets(cards),
    change = (setter: (n: number) => void) => (n: number) => {
      setter(n);
      setGrouped(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同类项要求字母相同且对应指数相同，只合并系数。x² 与 x 不同类；xy 与 yx 先按乘法交换律整理后同类，常数另成一类。卡片的形状大小不表示代入值。',
            'Like terms have the same letters with matching exponents; combine only coefficients. x² differs from x. xy and yx match after commuting factors, while constants form another type. Card size does not represent a substituted value.',
          )}
        />
      </p>
      <div className="math-poly-controls">
        <Slider
          mode={mode}
          name={t('A 卡系数', 'Coefficient of card A')}
          value={a}
          min={-4}
          max={4}
          change={change(setA)}
        />
        <Slider
          mode={mode}
          name={t('C 卡系数', 'Coefficient of card C')}
          value={c}
          change={change(setC)}
        />
        <label>
          <Text mode={mode} text={t('A 卡字母部分', 'Variable part of A')} />
          <select
            aria-label={label(mode, t('A 卡字母部分', 'Variable part of A'))}
            value={first}
            onChange={(e) => {
              setFirst(e.target.value);
              setGrouped(false);
            }}
          >
            <option value="xx">x²</option>
            <option value="xy">xy</option>
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('C 卡字母部分', 'Variable part of C')} />
          <select
            aria-label={label(mode, t('C 卡字母部分', 'Variable part of C'))}
            value={third}
            onChange={(e) => {
              setThird(e.target.value);
              setGrouped(false);
            }}
          >
            <option value="xx">x²</option>
            <option value="yx">yx</option>
            <option value="x">x</option>
          </select>
        </label>
      </div>
      <button className="math-button" onClick={() => setGrouped(!grouped)}>
        <Text
          mode={mode}
          text={t('按字母部分分组或还原', 'Group by variable part or restore')}
        />
      </button>
      <Cards cards={cards} mode={mode} grouped={grouped} />
      {grouped && <p className="math-poly-formula">{m.result}</p>}
      <Task
        key={`${a}/${c}/${first}/${third}`}
        mode={mode}
        name={t('我合并后的式子', 'My collected expression')}
        answer={expressionAnswer(m.result, ['x', 'y'], true)}
      />
    </>
  );
}
function Distribute({ mode }: { mode: LanguageMode }) {
  const [k, setK] = useState(-2),
    [a, setA] = useState(3),
    [b, setB] = useState(-4),
    [show, setShow] = useState(false),
    m = distribution(k, a, b),
    change = (setter: (n: number) => void) => (n: number) => {
      setter(n);
      setShow(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '外部因子要乘括号内每一项；只写负号表示乘负一。先逐项分配再合并，不能只改第一项。零因子也要解释为什么全部贡献变零。',
            'The outside factor multiplies every term; a lone minus means factor negative one. Distribute term by term before collecting, rather than changing only the first term. A zero factor sends every contribution to zero.',
          )}
        />
      </p>
      <div className="math-poly-controls">
        <Slider
          mode={mode}
          name={t('外部因子 k', 'Outside factor k')}
          value={k}
          min={-3}
          max={3}
          change={change(setK)}
        />
        <Slider
          mode={mode}
          name={t('括号内 x 的系数', 'Inside coefficient of x')}
          value={a}
          min={0}
          max={4}
          change={change(setA)}
        />
        <Slider
          mode={mode}
          name={t('括号内常数', 'Inside constant')}
          value={b}
          change={change(setB)}
        />
      </div>
      <p className="math-poly-formula">{m.original} = ?</p>
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏逐项分配',
            'Show or hide term-by-term distribution',
          )}
        />
      </button>
      {show && (
        <Frame
          mode={mode}
          caption={t(
            `${k} 分别乘 ${a}x 与 ${b}，得到 ${k * a}x 与 ${k * b}，每项都保留。`,
            `${k} multiplies ${a}x and ${b} separately, giving ${k * a}x and ${k * b}. Every term is included.`,
          )}
        >
          <svg
            width="560"
            height="180"
            viewBox="0 0 560 180"
            role="img"
            aria-label={label(
              mode,
              t('因子分别连接每项', 'Factor connected to each term'),
            )}
          >
            <text x="35" y="85">
              {k}
            </text>
            <path
              d="M70 80L200 40M70 80L200 125"
              stroke="currentColor"
              fill="none"
            />
            <text x="215" y="45">
              {a}x → {k * a}x
            </text>
            <text x="215" y="130">
              ({b}) → {k * b}
            </text>
          </svg>
        </Frame>
      )}
      <Task
        key={`${k}/${a}/${b}`}
        mode={mode}
        name={t('我去括号后的式子', 'My expanded and collected expression')}
        answer={expressionAnswer(m.result, ['x'], true)}
      />
    </>
  );
}
function cardsFor(raw: string, prefix: string): TermCard[] {
  return [...parsePolynomial(raw)!].map(([key, c], i) => ({
    id: `${prefix}${i}`,
    coefficient: Number(c[0]),
    key,
  }));
}
function Sum({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(3),
    [b, setB] = useState(2),
    [subtract, setSubtract] = useState(true),
    [show, setShow] = useState(false),
    m = expressionPair(`2x^2-x+(${a})`, `x^2+${b}x-4`, subtract),
    cards = [...cardsFor(m.first, 'A'), ...cardsFor(m.signedSecond, 'B')],
    change = (setter: (n: number) => void) => (n: number) => {
      setter(n);
      setShow(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把两个整式看成完整对象。加 B 时保留 B 的各项；减 B 时给 B 的每项乘负一，再与 A 的同类项合并。A 本身不被额外取相反数。',
            'Treat each polynomial as a whole object. Adding B keeps its terms; subtracting B multiplies every B term by negative one before collecting with A. Do not also negate A.',
          )}
        />
      </p>
      <div className="math-poly-controls">
        <Slider
          mode={mode}
          name={t('A 的常数项', 'Constant term of A')}
          value={a}
          change={change(setA)}
        />
        <Slider
          mode={mode}
          name={t('B 的 x 系数', 'Coefficient of x in B')}
          value={b}
          min={-3}
          max={3}
          change={change(setB)}
        />
        <label>
          <Text
            mode={mode}
            text={t('整式之间的运算', 'Operation between expressions')}
          />
          <select
            aria-label={label(
              mode,
              t('整式之间的运算', 'Operation between expressions'),
            )}
            value={subtract ? 'subtract' : 'add'}
            onChange={(e) => {
              setSubtract(e.target.value === 'subtract');
              setShow(false);
            }}
          >
            <option value="subtract">A − B</option>
            <option value="add">A + B</option>
          </select>
        </label>
      </div>
      <p className="math-poly-formula">
        A = {m.first}
        <br />B = {m.second}
        <br />A {subtract ? '−' : '+'} B = ?
      </p>
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t(
            '展开外部符号并配同类项',
            'Apply the outside sign and match like terms',
          )}
        />
      </button>
      {show && (
        <>
          <p className="math-poly-formula">
            ({m.first}) + ({m.signedSecond})
          </p>
          <Cards mode={mode} cards={cards} grouped />
        </>
      )}
      <Task
        key={`${a}/${b}/${subtract}`}
        mode={mode}
        name={t('我的整式结果', 'My polynomial result')}
        answer={expressionAnswer(m.result, ['x'], true)}
      />
    </>
  );
}
function Story({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<StoryKind>('tickets'),
    [n, setN] = useState(3),
    [fare, setFare] = useState(4),
    [fixed, setFixed] = useState(6),
    m = storyModel(kind, n, fare, fixed);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'tickets'
              ? t(
                  `虚构组票：n 人，每人 NZ$${fare}，另加一次整组费用 NZ$${fixed}。n 为正整数，求总费用的代数式。整组费用不能重复乘 n。`,
                  `Fictional group tickets: n people at NZ$${fare} each, plus one NZ$${fixed} group fee. n is a positive integer. Model total cost; do not multiply the group fee by n.`,
                )
              : t(
                  `长方形长 n+2 cm，宽 n cm，n>0。求${kind === 'perimeter' ? '周长（cm）' : '面积（cm²）'}的一般代数式。工作台展示正整数样例，模型也适用其他正长度。`,
                  `A rectangle has length n+2 cm and width n cm, with n>0. Model ${kind === 'perimeter' ? 'perimeter (cm)' : 'area (cm²)'}. The workshop shows positive integer examples; the relation also applies to other positive lengths.`,
                )
          }
        />
      </p>
      <div className="math-poly-controls">
        <label>
          <Text mode={mode} text={t('情境与目标', 'Context and target')} />
          <select
            aria-label={label(mode, t('情境与目标', 'Context and target'))}
            value={kind}
            onChange={(e) => setKind(e.target.value as StoryKind)}
          >
            <option value="tickets">
              {label(mode, t('整组费用', 'Group cost'))}
            </option>
            <option value="perimeter">
              {label(mode, t('长方形周长', 'Rectangle perimeter'))}
            </option>
            <option value="area">
              {label(mode, t('长方形面积', 'Rectangle area'))}
            </option>
          </select>
        </label>
        <Slider
          mode={mode}
          name={t('检验用 n', 'Test value n')}
          value={n}
          min={1}
          max={8}
          change={setN}
        />
        {kind === 'tickets' && (
          <>
            <Slider
              mode={mode}
              name={t('每人价格', 'Per-person price')}
              value={fare}
              min={0}
              max={8}
              change={setFare}
            />
            <Slider
              mode={mode}
              name={t('一次组费', 'One group fee')}
              value={fixed}
              min={0}
              max={12}
              change={setFixed}
            />
          </>
        )}
      </div>
      {kind !== 'tickets' && (
        <Frame
          mode={mode}
          caption={t(
            `同一长方形：长 ${n + 2} cm，宽 ${n} cm；周长问边界，面积问覆盖。`,
            `One rectangle: length ${n + 2} cm, width ${n} cm. Perimeter measures boundary; area measures coverage.`,
          )}
        >
          <svg
            width="320"
            height="240"
            viewBox="0 0 320 240"
            role="img"
            aria-label={label(
              mode,
              t('按比例的长方形', 'Proportional rectangle'),
            )}
          >
            <rect
              x="65"
              y="40"
              width={(n + 2) * 18}
              height={n * 18}
              stroke="currentColor"
              fill={kind === 'area' ? '#e5dff6' : 'none'}
              strokeWidth={kind === 'perimeter' ? 4 : 1}
            />
            <text x="65" y="24">
              n+2 = {n + 2} cm
            </text>
            <text x="10" y="120">
              n={n}
            </text>
          </svg>
        </Frame>
      )}
      <Task
        key={`${kind}/${fare}/${fixed}`}
        mode={mode}
        name={t('我的一般代数式', 'My general expression')}
        answer={expressionAnswer(m.expression, ['n'])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `再在 n=${n} 时计算具体量，单位为 ${m.unit}。改变检验用 n 时，一般式仍保持有效，具体代入答案需要重新算。`,
            `Now calculate the quantity at n=${n}, in ${m.unit}. Changing the test n preserves a valid general expression but requires a new substituted answer.`,
          )}
        />
      </p>
      <Task
        key={`value/${kind}/${n}/${fare}/${fixed}`}
        mode={mode}
        name={t('我的具体量', 'My numerical quantity')}
        answer={numberAnswer(m.value, m.unit)}
      />
    </>
  );
}
export function PolynomialLab({
  kind,
  mode,
}: {
  kind: PolynomialLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-poly-lab">
      {kind === 'poly-substitute' ? (
        <Substitute mode={mode} />
      ) : kind === 'poly-like' ? (
        <Like mode={mode} />
      ) : kind === 'poly-distribute' ? (
        <Distribute mode={mode} />
      ) : kind === 'poly-sum' ? (
        <Sum mode={mode} />
      ) : (
        <Story mode={mode} />
      )}
    </div>
  );
}
export function PolynomialHookArt({
  kind,
  mode,
}: {
  kind: PolynomialLabKind;
  mode: LanguageMode;
}) {
  const symbols = {
    'poly-substitute': 'x²+2x−3 · x=−2 → ?',
    'poly-like': '3x²+4x² · 3x²+4x → ?',
    'poly-distribute': '−2(3x−4) = ?',
    'poly-sum': 'A − B = ?',
    'poly-story': 'n × p + f = ?',
  };
  return (
    <div className="math-poly-hook">
      <strong>{symbols[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '字母、指数、系数、关系都要保留。',
            'Retain letters, exponents, coefficients and relationships.',
          )}
        />
      </p>
    </div>
  );
}
