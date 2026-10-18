import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { rational, textR, mulR, addR, divR } from './algebraModels';
import {
  integerPower,
  rationalPower,
  exactLog,
  readPositive,
  exponentialAt,
  firstWholeStep,
  asNumber,
} from './exponentialModels';
import { ConceptPlot, sampleCurve } from './FunctionConceptVisuals';
export type ExponentialLabKind = Extract<Lesson['lab'], `exp-${string}`>;
export const isExponentialLab = (
  kind: Lesson['lab'],
): kind is ExponentialLabKind => kind.startsWith('exp-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
function Select({
  mode,
  label,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: string;
  options: [string, LocalizedText][];
  change: (v: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <select
        aria-label={word(mode, label)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {word(mode, name)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Task({
  mode,
  name,
  answer,
  hint,
  solution,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
  solution: LocalizedText;
}) {
  const [input, setInput] = useState(''),
    [attempts, setAttempts] = useState(0),
    [reveal, setReveal] = useState(false);
  const correct = checkAnswer(input, answer);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setAttempts(0);
            setReveal(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setAttempts(attempts + 1)}>
        <Text mode={mode} text={t('核对预测', 'Check prediction')} />
      </button>
      {attempts > 0 && (
        <p role="status">
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '预测符合。再用逆运算或原模型解释。',
                    'The prediction matches. Explain using the inverse operation or original model.',
                  )
                : hint
            }
          />
        </p>
      )}
      {attempts > 0 && !correct && (
        <button className="math-button" onClick={() => setReveal(true)}>
          <Text mode={mode} text={t('查看推导', 'Reveal derivation')} />
        </button>
      )}
      {reveal && (
        <p>
          <Text mode={mode} text={solution} />
        </p>
      )}
    </div>
  );
}
const numericAnswer = (
  value: string,
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
): AnswerSpec => ({
  kind: 'number',
  value,
  unit,
});
function PowerLab({
  mode,
  fractional = false,
}: {
  mode: LanguageMode;
  fractional?: boolean;
}) {
  const [base, setBase] = useState(fractional ? '16' : '2'),
    [exponent, setExponent] = useState(fractional ? '3/4' : '-3'),
    [show, setShow] = useState(false);
  const b = readPositive(base),
    e = readPositive(
      exponent.startsWith('-')
        ? exponent.slice(1)
        : exponent === '0'
          ? '1'
          : exponent,
    );
  const signed =
    exponent === '0'
      ? rational(0n)
      : rational(exponent.startsWith('-') ? -e[0] : e[0], e[1]);
  const value = fractional
    ? rationalPower(b, signed)
    : integerPower(b, Number(signed[0]));
  const principalRoot = fractional
    ? rationalPower(b, rational(1n, signed[1]))
    : null;
  const positivePower = fractional
    ? rationalPower(
        b,
        rational(signed[0] < 0n ? -signed[0] : signed[0], signed[1]),
      )
    : null;
  // Every selected root is rational except the deliberate sqrt(2) contrast.
  const answer: AnswerSpec = value
    ? numericAnswer(textR(value))
    : { kind: 'radical', value: 'sqrt(2)' };
  const reset = () => setShow(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            fractional
              ? t(
                  '正底数约定：先取约分指数的分母次主根，再做分子次幂；负指数取倒数。',
                  'Positive-base convention: take the principal root from the reduced denominator, then the numerator power; reciprocate for a negative exponent.',
                )
              : t(
                  '每向右一格指数加1，值乘底数；向左除以底数。零底数不能取零次或负次幂。',
                  'Each step right adds one to the exponent and multiplies the value by the base; going left divides. Zero cannot have a zero or negative exponent here.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        label={t('底数', 'Base')}
        value={base}
        change={(v) => {
          setBase(v);
          if (fractional && v === '2') setExponent('1/2');
          reset();
        }}
        options={(fractional
          ? ['16', '81', '1/16', '2']
          : ['2', '3', '1/2']
        ).map((v) => [v, t(v, v)])}
      />
      <Select
        mode={mode}
        label={t('指数', 'Exponent')}
        value={exponent}
        change={(v) => {
          setExponent(v);
          reset();
        }}
        options={(fractional
          ? base === '2'
            ? ['1/2']
            : ['1/2', '3/4', '-1/2', '-3/4']
          : ['-3', '-2', '-1', '0', '1', '2', '3']
        ).map((v) => [v, t(v, v)])}
      />
      {fractional && !value && !(base === '2' && exponent === '1/2') ? (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '这是精确无理值，本工作台只自动核验√2这一无理数示例；可换底数16或1/16继续操作。并非无定义。',
              'This is an exact irrational value. This workbench automatically checks only the √2 irrational example; choose base 16 or 1/16 for other tasks. It is not undefined.',
            )}
          />
        </p>
      ) : (
        <Task
          key={`${base}/${exponent}`}
          mode={mode}
          name={t(
            `预测(${base})^(${exponent})`,
            `Predict (${base})^(${exponent})`,
          )}
          answer={answer}
          hint={t(
            '先看完整底数和指数；负指数取倒数，主根不写±。可输入分数或sqrt(2)。',
            'Check the entire base and exponent; reciprocate for negative powers and omit ± for principal roots. Enter a fraction or sqrt(2).',
          )}
          solution={t(
            `结果为${value ? textR(value) : '√2'}。先用根或倒数结构，再乘回去检验。`,
            `The result is ${value ? textR(value) : '√2'}. Use roots or reciprocals, then audit by reversing the operation.`,
          )}
        />
      )}
      <button
        className="math-button"
        onClick={() => setShow(!show)}
        aria-expanded={show}
      >
        <Text
          mode={mode}
          text={
            fractional
              ? t('显示/隐藏根式步骤', 'Show/hide root steps')
              : t('显示/隐藏幂数表', 'Show/hide power table')
          }
        />
      </button>
      {show && fractional && (
        <div
          className="math-concept-table"
          tabIndex={0}
          role="region"
          aria-label={word(mode, t('根式步骤', 'Root steps'))}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <Text
                    mode={mode}
                    text={t(
                      `① ${signed[1]}次主根`,
                      `① Principal root of degree ${signed[1]}`,
                    )}
                  />
                </th>
                <th>
                  <Text
                    mode={mode}
                    text={t(
                      `② 取${signed[0] < 0n ? -signed[0] : signed[0]}次幂`,
                      `② Power ${signed[0] < 0n ? -signed[0] : signed[0]}`,
                    )}
                  />
                </th>
                <th>
                  <Text
                    mode={mode}
                    text={
                      signed[0] < 0n
                        ? t('③ 取倒数', '③ Take reciprocal')
                        : t('③ 保持原值', '③ Keep the value')
                    }
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{principalRoot ? textR(principalRoot) : '√2'}</td>
                <td>{positivePower ? textR(positivePower) : '√2'}</td>
                <td>{value ? textR(value) : '√2'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {show && !fractional && (
        <div
          className="math-concept-table"
          tabIndex={0}
          role="region"
          aria-label={word(mode, t('幂数表', 'Power table'))}
        >
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>({base})ⁿ</th>
                <th>
                  <Text
                    mode={mode}
                    text={t('向右倍率', 'Multiplier to right')}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{textR(integerPower(b, n))}</td>
                  <td>× {base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
function GrowthLab({ mode }: { mode: LanguageMode }) {
  const [base, setBase] = useState('2'),
    [domain, setDomain] = useState('integer'),
    [query, setQuery] = useState('3'),
    [wide, setWide] = useState(false),
    [show, setShow] = useState(false);
  const b = readPositive(base),
    x = Number(query),
    value = 3 * asNumber(b) ** x,
    allowed = domain === 'continuous' || Number.isInteger(x);
  const answer: AnswerSpec = allowed
    ? Number.isInteger(x)
      ? numericAnswer(textR(exponentialAt(rational(3n), b, x)))
      : {
          kind: 'radical',
          value:
            base === '2'
              ? '3sqrt(2)'
              : base === '1/2'
                ? '3sqrt(2)/2'
                : '3sqrt(3/2)',
        }
    : { kind: 'function-code', value: 'outside-domain' };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            `给定y=3×(${base})ˣ，域为${domain === 'integer' ? '{0,1,…,6}' : '[0,6]'}。倍率恒定是给定模型；图窗不决定定义域。`,
            `Given y=3×(${base})ˣ on ${domain === 'integer' ? '{0,1,…,6}' : '[0,6]'}. A constant multiplier is a stipulated model; the window does not define the domain.`,
          )}
        />
      </p>
      <Select
        mode={mode}
        label={t('每步倍率', 'Step multiplier')}
        value={base}
        change={(v) => {
          setBase(v);
          setShow(false);
        }}
        options={['2', '1/2'].map((v) => [v, t(v, v)])}
      />
      <Select
        mode={mode}
        label={t('时间域', 'Time domain')}
        value={domain}
        change={setDomain}
        options={[
          ['integer', t('整数步', 'Whole steps')],
          ['continuous', t('连续时间', 'Continuous time')],
        ]}
      />
      <Select
        mode={mode}
        label={t('查询输入', 'Query input')}
        value={query}
        change={setQuery}
        options={['0', '0.5', '1', '2', '3', '4', '5', '6'].map((v) => [
          v,
          t(v, v),
        ])}
      />
      <Task
        key={`${base}/${domain}/${query}`}
        mode={mode}
        name={t(
          '预测输出（域外写outside-domain）',
          'Predict output (use outside-domain if excluded)',
        )}
        answer={answer}
        hint={t(
          '先核域；整数域不接受半步。合法输入按初量乘倍率的幂；根式可写sqrt(2)。',
          'Check the domain first; whole-step domains exclude half steps. Otherwise multiply the initial value by the multiplier power; use sqrt(2) for radicals.',
        )}
        solution={t(
          allowed
            ? `输出${Number.isInteger(x) ? textR(exponentialAt(rational(3n), b, x)) : base === '2' ? '3√2' : '3√2/2'}。`
            : '半步不在给定整数域。',
          allowed
            ? `Output ${Number.isInteger(x) ? textR(exponentialAt(rational(3n), b, x)) : base === '2' ? '3√2' : '3√2/2'}.`
            : 'A half step is outside the stipulated integer domain.',
        )}
      />
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏图表', 'Show/hide graph and table')}
        />
      </button>
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换图窗', 'Change window')} />
      </button>
      {show && (
        <>
          <ConceptPlot
            mode={mode}
            wide={wide}
            curves={
              domain === 'continuous'
                ? [sampleCurve('y', (v) => 3 * asNumber(b) ** v, 0, 6)]
                : []
            }
            points={
              domain === 'integer'
                ? Array.from({ length: 7 }, (_, n) => ({
                    x: n,
                    y: 3 * asNumber(b) ** n,
                  }))
                : allowed
                  ? [{ x, y: value }]
                  : []
            }
            caption={t(
              '整数域只画散点，连续域才连曲线；正输出超窗仍为正，未贴到窗边。模型可在表中核验。',
              'Whole-step domains use unjoined points; only the continuous domain has a curve. Positive outputs outside the window remain positive and are not clamped. Audit them in the table.',
            )}
          />
          <div
            className="math-concept-table"
            tabIndex={0}
            role="region"
            aria-label={word(mode, t('增长数表', 'Growth table'))}
          >
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>y</th>
                  <th>y(x+1)/y(x)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }, (_, n) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{textR(exponentialAt(rational(3n), b, n))}</td>
                    <td>{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
function LogLab({ mode }: { mode: LanguageMode }) {
  const [base, setBase] = useState('2'),
    [argument, setArgument] = useState('8'),
    [wide, setWide] = useState(false),
    [show, setShow] = useState(false);
  const legal = base !== '1' && Number(argument) > 0,
    b = readPositive(base);
  const exact = legal ? exactLog(b, readPositive(argument)) : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'logₐb是满足aˣ=b的唯一实指数。要求a>0、a≠1、b>0。合法时指数域ℝ、值域(0,∞)与对数域值域交换。',
            'logₐb is the unique real exponent satisfying aˣ=b. Require a>0, a≠1, b>0. For valid bases the exponential domain ℝ and range (0,∞) swap for its logarithmic inverse.',
          )}
        />
      </p>
      <Select
        mode={mode}
        label={t('对数底数', 'Log base')}
        value={base}
        change={(v) => {
          setBase(v);
          setShow(false);
        }}
        options={['2', '1/2', '4', '1'].map((v) => [v, t(v, v)])}
      />
      <Select
        mode={mode}
        label={t('真数', 'Argument')}
        value={argument}
        change={(v) => {
          setArgument(v);
          setShow(false);
        }}
        options={['8', '4', '1', '0.125', '0', '-4'].map((v) => [v, t(v, v)])}
      />
      {legal ? (
        <Task
          key={`${base}/${argument}`}
          mode={mode}
          name={t('预测对数值', 'Predict logarithm')}
          answer={numericAnswer(textR(exact!))}
          hint={t(
            '把问题改为“底数的几次方等于真数”；小于1的底数也可以。',
            'Ask “base to what power equals the argument?” A base below one is valid too.',
          )}
          solution={t(
            `${base}^(${textR(exact!)})=${argument}，故对数为${textR(exact!)}。`,
            `${base}^(${textR(exact!)})=${argument}, so the logarithm is ${textR(exact!)}.`,
          )}
        />
      ) : (
        <p role="status">
          <Text
            mode={mode}
            text={
              base === '1'
                ? t(
                    '底数1不合法：真数1有无穷多指数，其余真数无解，不能构成唯一逆运算。',
                    'Base one is invalid: argument one has infinitely many exponents and other arguments have none, so no unique inverse exists.',
                  )
                : t(
                    '真数必须大于0：正底数的实数次幂不可能为0或负数。',
                    'The argument must be positive: real powers of a positive base cannot be zero or negative.',
                  )
            }
          />
        </p>
      )}
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏逆函数图', 'Show/hide inverse graph')}
        />
      </button>
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换图窗', 'Change window')} />
      </button>
      {show && legal && (
        <ConceptPlot
          mode={mode}
          wide={wide}
          curves={[
            sampleCurve('a^x', (x) => asNumber(b) ** x, -5, 5, '#6254a1'),
            sampleCurve(
              'log_a(x)',
              (x) => Math.log(x) / Math.log(asNumber(b)),
              0.01,
              12,
              '#a65e12',
            ),
            sampleCurve('y=x', (x) => x, -10, 10, '#53606d', '7 5'),
          ]}
          points={[
            { x: asNumber(exact!), y: Number(argument), label: 'P' },
            { x: Number(argument), y: asNumber(exact!), label: 'Q' },
          ]}
          caption={t(
            '紫色为指数aˣ，金色为对数logₐx，灰虚线为y=x。P在指数图，交换坐标的Q在对数图；两轴同单位标尺。曲线只采样局部，弧端不是定义域端点。底数小于1时两图都递减。',
            'Purple: exponential aˣ; gold: logarithm logₐx; grey dashed: y=x. P is on the exponential and its coordinate swap Q is on the logarithm. Axes share one unit scale. Arcs sample local windows, not domain endpoints. Bases below one make both curves decrease.',
          )}
        />
      )}
    </>
  );
}
function LawsLab({ mode }: { mode: LanguageMode }) {
  const [operation, setOperation] = useState('product'),
    [p, setP] = useState('2'),
    [q, setQ] = useState('2'),
    [show, setShow] = useState(false);
  const a = integerPower(rational(2n), Number(p)),
    b = integerPower(rational(2n), Number(q));
  const combined =
    operation === 'product'
      ? mulR(a, b)
      : operation === 'quotient'
        ? divR(a, b)
        : addR(a, b);
  const log = exactLog(rational(2n), combined),
    exact = log !== null;
  const answer = exact ? textR(log) : Math.log2(asNumber(combined)).toFixed(3);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '令u=2ᵖ、v=2ᑫ，均为正。改变真数内的运算，检查哪些结构可用指数法则。',
            'Set u=2ᵖ and v=2ᑫ, both positive. Change the operation inside the argument and audit which structure follows exponent laws.',
          )}
        />
      </p>
      <Select
        mode={mode}
        label={t('真数运算', 'Argument operation')}
        value={operation}
        change={(v) => {
          setOperation(v);
          setShow(false);
        }}
        options={[
          ['product', t('乘积uv', 'Product uv')],
          ['quotient', t('商u/v', 'Quotient u/v')],
          ['sum', t('和u+v', 'Sum u+v')],
        ]}
      />
      <Select
        mode={mode}
        label={t('指数p', 'Exponent p')}
        value={p}
        change={(v) => {
          setP(v);
          setShow(false);
        }}
        options={['-1', '0', '1', '2', '3'].map((v) => [v, t(v, v)])}
      />
      <Select
        mode={mode}
        label={t('指数q', 'Exponent q')}
        value={q}
        change={(v) => {
          setQ(v);
          setShow(false);
        }}
        options={['-1', '0', '1', '2', '3'].map((v) => [v, t(v, v)])}
      />
      <p>
        u={textR(a)}, v={textR(b)}; log₂({textR(combined)})
      </p>
      <Task
        key={`${operation}/${p}/${q}`}
        mode={mode}
        name={
          exact
            ? t('预测确切对数', 'Predict exact logarithm')
            : t(
                '预测对数（保留3位小数）',
                'Predict logarithm (3 decimal places)',
              )
        }
        answer={numericAnswer(answer)}
        hint={t(
          '乘积对应p+q，商对应p−q；和无此通用规则，先算真数再用计算器。',
          'Products give p+q and quotients give p−q. Sums have no such general law: add the arguments first, then use a calculator.',
        )}
        solution={t(
          `结果${exact ? '=' : '≈'}${answer}；${operation === 'sum' ? '和不能一般拆成对数的和。' : '依据同底数乘除与唯一逆指数。'}`,
          `Result ${exact ? '=' : '≈'}${answer}; ${operation === 'sum' ? 'a sum cannot generally be split into a sum of logarithms.' : 'use same-base multiplication/division and unique inverse exponents.'}`,
        )}
      />
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏结构对照', 'Show/hide structure comparison')}
        />
      </button>
      {show && (
        <p>
          <Text
            mode={mode}
            text={t(
              `乘积：log₂(uv)=p+q=${Number(p) + Number(q)}；商：log₂(u/v)=p−q=${Number(p) - Number(q)}。当前${operation === 'sum' ? '和' : '真数'}的结果${exact ? '=' : '≈'}${answer}。偶然数值相同也不能证明“和法则”。`,
              `Product: log₂(uv)=p+q=${Number(p) + Number(q)}; quotient: log₂(u/v)=p−q=${Number(p) - Number(q)}. The current ${operation === 'sum' ? 'sum' : 'argument'} gives ${exact ? '=' : '≈'}${answer}. An accidental numerical match cannot prove a sum law.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function ModelLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('growth'),
    [target, setTarget] = useState('35'),
    [show, setShow] = useState(false);
  const growth = kind === 'growth',
    initial = rational(growth ? 5n : 80n),
    multiplier = rational(growth ? 2n : 1n, growth ? 1n : 2n),
    goal = readPositive(target);
  const crossing =
    Math.log(asNumber(goal) / asNumber(initial)) /
    Math.log(asNumber(multiplier));
  const first = firstWholeStep(initial, multiplier, goal)!;
  const crossingAnswer = String(Math.max(0, crossing).toFixed(1));
  return (
    <>
      <Select
        mode={mode}
        label={t('纸上模型', 'Paper model')}
        value={kind}
        change={(v) => {
          setKind(v);
          setTarget(v === 'growth' ? '35' : '11');
          setShow(false);
        }}
        options={[
          ['growth', t('增长5×2ᵗ', 'Growth 5×2ᵗ')],
          ['decay', t('衰减80×(1/2)ᵗ', 'Decay 80×(1/2)ᵗ')],
        ]}
      />
      <Select
        mode={mode}
        label={t('目标数量', 'Target quantity')}
        value={target}
        change={(v) => {
          setTarget(v);
          setShow(false);
        }}
        options={(growth
          ? ['5', '20', '35', '40']
          : ['80', '20', '11', '10']
        ).map((v) => [v, t(v, v)])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `假定每天恒定倍率${textR(multiplier)}，初量${textR(initial)}单位，t≥0以天计。增长求至少目标，衰减求不超过目标；这是虚构课堂模型。`,
            `Assume a constant daily multiplier ${textR(multiplier)}, initial quantity ${textR(initial)} units, and t≥0 in days. Growth asks for at least the target; decay asks for at most the target. This is a fictional classroom model.`,
          )}
        />
      </p>
      <Task
        key={`real/${kind}/${target}`}
        mode={mode}
        name={t(
          '连续达到时间（最近0.1天）',
          'Continuous crossing (nearest 0.1 day)',
        )}
        answer={numericAnswer(crossingAnswer, 'days')}
        hint={t(
          '先除去初量，再用log(目标/初量)/log(倍率)；这是近似时间。',
          'Divide by the initial quantity, then use log(target/initial)/log(multiplier); this is an approximate time.',
        )}
        solution={t(
          `连续交点约${crossingAnswer}天。整步首次还须另核。`,
          `The continuous crossing is about ${crossingAnswer} days. Audit a first whole step separately.`,
        )}
      />
      <Task
        key={`whole/${kind}/${target}`}
        mode={mode}
        name={t('首次整天', 'First whole day')}
        answer={numericAnswer(String(first), 'days')}
        hint={t(
          '不要四舍五入到最近整数；比较前一整天和当前整天的原模型值。',
          'Do not round to the nearest integer. Compare original-model values on the preceding and current whole day.',
        )}
        solution={t(
          `首次第${first}天，数量${textR(exponentialAt(initial, multiplier, first))}。${first > 0 ? `前一天为${textR(exponentialAt(initial, multiplier, first - 1))}，尚未满足。` : '初始时已满足。'}`,
          `First day ${first}, quantity ${textR(exponentialAt(initial, multiplier, first))}. ${first > 0 ? `The previous day has ${textR(exponentialAt(initial, multiplier, first - 1))}, which fails.` : 'The initial value already meets the target.'}`,
        )}
      />
      <button className="math-button" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏相邻核验', 'Show/hide adjacent checks')}
        />
      </button>
      {show && (
        <div
          className="math-concept-table"
          tabIndex={0}
          role="region"
          aria-label={word(mode, t('阈值数表', 'Threshold table'))}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('天数', 'Days')} />
                </th>
                <th>N(n)</th>
                <th>
                  <Text mode={mode} text={t('满足目标？', 'Meets target?')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, n) => {
                const value = exponentialAt(initial, multiplier, n),
                  delta = value[0] * goal[1] - goal[0] * value[1],
                  pass = growth ? delta >= 0n : delta <= 0n;
                return (
                  <tr key={n} data-selected={n === first}>
                    <td>{n}</td>
                    <td>{textR(value)}</td>
                    <td>
                      <Text
                        mode={mode}
                        text={pass ? t('是', 'Yes') : t('否', 'No')}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
export function ExponentialLab({
  kind,
  mode,
}: {
  kind: ExponentialLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'exp-integers' ? (
        <PowerLab mode={mode} />
      ) : kind === 'exp-rational' ? (
        <PowerLab mode={mode} fractional />
      ) : kind === 'exp-growth' ? (
        <GrowthLab mode={mode} />
      ) : kind === 'exp-log' ? (
        <LogLab mode={mode} />
      ) : kind === 'exp-laws' ? (
        <LawsLab mode={mode} />
      ) : (
        <ModelLab mode={mode} />
      )}
    </div>
  );
}
export function ExponentialHookArt({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: ExponentialLabKind;
}) {
  const labels =
    kind === 'exp-log'
      ? t(
          '指数→输出，交换角色→对数',
          'Exponent → output; reverse roles → logarithm',
        )
      : kind === 'exp-model'
        ? t(
            '预测→相邻核验→解释模型',
            'Predict → audit adjacent steps → interpret the model',
          )
        : kind === 'exp-laws'
          ? t(
              '乘积↔和，商↔差；检查条件',
              'Product ↔ sum; quotient ↔ difference; audit conditions',
            )
          : kind === 'exp-rational'
            ? t(
                '主根→幂→倒数（负指数时）',
                'Principal root → power → reciprocal for negative exponents',
              )
            : t(
                '每向右一步×底数，每向左一步÷底数',
                'Each step right × base; each step left ÷ base',
              );
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-table"
        tabIndex={0}
        role="region"
        aria-label={word(mode, labels)}
      >
        <table>
          <thead>
            <tr>
              <th>x</th>
              <th>−2</th>
              <th>−1</th>
              <th>0</th>
              <th>1</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>2ˣ</th>
              <td>1/4</td>
              <td>1/2</td>
              <td>1</td>
              <td>2</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption>
        <Text mode={mode} text={labels} />
      </figcaption>
    </figure>
  );
}
