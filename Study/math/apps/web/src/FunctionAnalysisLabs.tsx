import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import {
  ConceptPlot,
  type ConceptCurve,
  type GraphPoint,
} from './FunctionConceptVisuals';
import { DataTable } from './DataModellingVisuals';
import { rational, textR, type Rational } from './algebraModels';
import { polynomialText, type Polynomial } from './polynomialModels';
import { asNumber, valueAt } from './calculusModels';
import {
  shapeModel,
  closedExtrema,
  productModel,
  chainModel,
  appliedRateModel,
  type AnalysisFamily,
  type RateScenario,
} from './functionAnalysisModels';
type Kind = Extract<Lesson['lab'], `analysis-${string}`>;
export const isAnalysisLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('analysis-');
const word = (m: LanguageMode, p: LocalizedText) => (m === 'en' ? p.en : p.zh);
const number = (r: Rational | null): AnswerSpec =>
  r
    ? { kind: 'number', value: textR(r) }
    : { kind: 'calculus-code', value: 'undefined' };
const show = (r: Rational | null) => (r ? textR(r) : 'undefined');
function Select({
  mode,
  name,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: [string, LocalizedText][];
  change: (v: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map(([v, p]) => (
          <option key={v} value={v}>
            {word(mode, p)}
          </option>
        ))}
      </select>
    </label>
  );
}
const opts = (vs: string[]): [string, LocalizedText][] =>
  vs.map((v) => [v, t(v, v)]);
function Predict({
  mode,
  name,
  answer,
  hint,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={word(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('核对预测', 'Check prediction')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={word(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '预测符合。请继续用因子符号、代数法则、定义域和单位解释；图表不是证明。',
                    'The prediction matches. Justify using factor signs, algebraic rules, domain and units; the picture is not proof.',
                  )
                : hint
            }
          />
        </p>
      )}
    </div>
  );
}
function Audit({
  mode,
  children,
}: {
  mode: LanguageMode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="math-button secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
      {open && children}
    </>
  );
}
const graphCurve = (
  p: Polynomial,
  name: string,
  color: string,
): ConceptCurve => ({
  name,
  color,
  points: Array.from({ length: 641 }, (_, i) => {
    const x = rational(BigInt(i - 320), 20n);
    return { x: asNumber(x), y: asNumber(valueAt(p, x)) };
  }),
});
const behaviourHint = t(
  '填increasing、decreasing或constant；从整段导数的符号判断，不能用函数值的正负。',
  'Enter increasing, decreasing or constant, using derivative signs throughout the interval rather than signs of function values.',
);
const algebraHint = t(
  '每项只求一个因子的导数，复合时保留内导；可先展开再核验。',
  'Differentiate one factor per term, and retain the inner rate for composition. Expand independently to check.',
);
const familyOpts: [string, LocalizedText][] = [
  ['cubic-turn', t('x³−3x：两个转折', 'x³−3x: two turns')],
  ['cubic-flat', t('x³：零斜率但穿过', 'x³: zero slope but passes through')],
  ['square', t('x²：谷底', 'x²: valley')],
  ['negative-square', t('−x²：山顶', '−x²: peak')],
  ['constant', t('2：恒定', '2: constant')],
  ['corner', t('|x|：尖点', '|x|: corner')],
];
function Shape({
  mode,
  extrema = false,
}: {
  mode: LanguageMode;
  extrema?: boolean;
}) {
  const [kind, setKind] = useState<AnalysisFamily>('cubic-turn'),
    [selected, setSelected] = useState('0'),
    [point, setPoint] = useState('-1'),
    [end, setEnd] = useState('3'),
    [wide, setWide] = useState(false),
    m = shapeModel(kind),
    index = Math.min(Number(selected), m.intervals.length - 1),
    row = m.intervals[index]!,
    a = rational(BigInt(point)),
    slope = m.slope(a),
    classification = m.classification(Number(point)),
    closed = closedExtrema(kind, '-2', end);
  const curves: ConceptCurve[] =
    kind === 'corner'
      ? [
          {
            name: 'f',
            color: '#6254a1',
            points: [
              { x: -16, y: 16 },
              { x: 0, y: 0 },
              { x: 16, y: 16 },
            ],
          },
        ]
      : [
          graphCurve(m.p, 'f', '#6254a1'),
          graphCurve(m.derivative, 'f-prime', '#147d67'),
        ];
  const points: GraphPoint[] = [
    { x: Number(point), y: asNumber(m.value(a)), label: 'A' },
  ];
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={
            extrema
              ? t(
                  '局部分类针对原函数定义域ℝ；下面闭区间只用于绝对最大最小值比较。local指双侧内点的严格局部极值。恒定函数每点都是非严格极大与极小，但没有严格极值。',
                  'Local classification uses the original domain ℝ; the closed interval below is only for absolute extrema. Here local means strict two-sided interior extrema. Every point of a constant is a non-strict maximum and minimum, but none is strict.',
                )
              : t(
                  '紫色是f，绿色是f′（尖点另用左右斜率表）；选择完整区间后，再判断单点斜率与整段增减。',
                  'Purple is f, green is f′ (the corner uses one-sided slopes in the table). Choose an interval, then distinguish one slope from behaviour throughout it.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('函数族', 'Function family')}
        value={kind}
        options={familyOpts}
        change={(v) => {
          setKind(v as AnalysisFamily);
          setSelected('0');
          setPoint(v === 'cubic-turn' ? '-1' : '0');
        }}
      />
      {extrema ? (
        <Select
          mode={mode}
          name={t(
            '闭区间右端点，左端固定−2',
            'Closed right endpoint, left fixed at −2',
          )}
          value={end}
          options={opts(['1', '2', '3'])}
          change={setEnd}
        />
      ) : (
        <Select
          mode={mode}
          name={t('待判定区间', 'Interval to classify')}
          value={String(index)}
          options={m.intervals.map((r, i) => [String(i), t(r[0], r[0])])}
          change={setSelected}
        />
      )}
      <Select
        mode={mode}
        name={t('观察输入a', 'Observed input a')}
        value={point}
        options={opts(['-1', '0', '1', '2'])}
        change={setPoint}
      />
      {extrema ? (
        <>
          <Predict
            key={`local-${kind}-${point}`}
            mode={mode}
            name={t('预测严格局部分类', 'Predict strict local classification')}
            answer={{ kind: 'analysis-code', value: classification }}
            hint={t(
              '填local-max、local-min或neither；用两侧增减。恒定时按严格约定填neither。',
              'Enter local-max, local-min or neither. Check both sides; for a constant use neither under the strict convention.',
            )}
          />
          <Predict
            key={`global-${textR(closed.max)}`}
            mode={mode}
            name={t(
              '预测闭区间最大值',
              'Predict closed-interval maximum value',
            )}
            answer={number(closed.max)}
            hint={t(
              '比较所有域内驻点、不可导点和两个端点的函数值，不要只比局部极大值。',
              'Compare values at all in-domain stationary points, corners and both endpoints, rather than only the local maximum.',
            )}
          />
        </>
      ) : (
        <Predict
          key={`behaviour-${row[2]}`}
          mode={mode}
          name={t('预测区间增减', 'Predict interval behaviour')}
          answer={{ kind: 'analysis-code', value: row[2] }}
          hint={behaviourHint}
        />
      )}
      <Predict
        key={`slope-${show(slope)}`}
        mode={mode}
        name={t('预测a处导数值', 'Predict derivative value at a')}
        answer={number(slope)}
        hint={t(
          '代入f′而不是f；|x|在0左右导数不同，填undefined。',
          'Evaluate f′, not f. For |x| at zero the one-sided slopes differ; enter undefined.',
        )}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换显示视窗', 'Change display window')} />
      </button>
      <ConceptPlot
        mode={mode}
        wide={wide}
        curves={curves}
        points={points}
        caption={t(
          '同单位坐标，绿色高度表示紫色斜率；显示裁剪不改变定义域。符号表来自因式分解（或|x|分段规则），不是从有限样点推断。',
          'Equal axis units: green height represents purple slope. Clipping does not alter the domain. Sign intervals come from factorisation or the piecewise |x| rule, not finite sampling.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('区间符号核验', 'Interval sign audit')}
          headers={[
            t('区间', 'Interval'),
            t('f′符号', 'Sign of f′'),
            t('增减', 'Behaviour'),
          ]}
          rows={m.intervals.map((r) => [
            r[0],
            r[1],
            word(
              mode,
              t(
                r[2] === 'increasing'
                  ? '递增'
                  : r[2] === 'decreasing'
                    ? '递减'
                    : '恒定',
                r[2],
              ),
            ),
          ])}
        />
        <DataTable
          mode={mode}
          headers={[t('对象', 'Object'), t('精确值', 'Exact value')]}
          rows={[
            [`a=${point}`, show(m.value(a))],
            ['f′(a)', show(slope)],
            [
              word(mode, t('严格局部分类', 'Strict local classification')),
              classification,
            ],
          ]}
        />
        {extrema && (
          <>
            <DataTable
              mode={mode}
              name={t('闭区间候选比较', 'Closed-interval candidate comparison')}
              headers={[t('候选位置x', 'Candidate x'), t('f(x)', 'f(x)')]}
              rows={closed.candidates.map((c) => [textR(c.x), textR(c.y)])}
            />
            <p>
              <Text
                mode={mode}
                text={t(
                  `最小值${textR(closed.min)}，位置${closed.allMin ? '整个闭区间' : closed.minAt.join(', ')}；最大值${textR(closed.max)}，位置${closed.allMax ? '整个闭区间' : closed.maxAt.join(', ')}。`,
                  `Minimum ${textR(closed.min)} at ${closed.allMin ? 'every point of the closed interval' : closed.minAt.join(', ')}; maximum ${textR(closed.max)} at ${closed.allMax ? 'every point of the closed interval' : closed.maxAt.join(', ')}.`,
                )}
              />
            </p>
          </>
        )}
        <p>
          <Text
            mode={mode}
            text={t(
              '三次转折：f′=3(x−1)(x+1)；x³：f′=3x²，0两侧均正；±x²：f′=±2x；常数：f′=0；|x|左导数−1、右导数1，0处不可导。恒定函数每个输入都是驻点，候选表只列端点代表相同值。',
              'Turning cubic: f′=3(x−1)(x+1); flat cubic: f′=3x², positive on both sides of zero; ±x²: f′=±2x; constant: f′=0; |x| has slope −1 to the left, one to the right, and no derivative at zero. Every input of a constant is stationary; endpoints represent its equal values in the candidate table.',
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
const products: [string, string][] = [
  ['x^2+1', 'x-2'],
  ['2x+1', 'x+3'],
  ['5', 'x^2+1'],
  ['x^2', 'x^2'],
];
const chains: [string, number][] = [
  ['2x+1', 3],
  ['x^2+1', 2],
  ['1-x', 3],
  ['2', 3],
];
function Rules({
  mode,
  chain = false,
}: {
  mode: LanguageMode;
  chain?: boolean;
}) {
  const [index, setIndex] = useState('0'),
    [a, setA] = useState('1'),
    [wide, setWide] = useState(false),
    i = Number(index),
    pair = products[i]!,
    nested = chains[i]!,
    product = productModel(pair[0], pair[1], a),
    composite = chainModel(nested[0], nested[1], a),
    m = chain ? composite : product,
    p = polynomialText(m.p),
    d = polynomialText(m.derivative),
    rate = textR(m.rate);
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={
            chain
              ? t(
                  '先让x进入内机器g，再把g(x)送入外机器F。外导在g(x)处求值，然后乘内导；不要把F′(x)误当F′(g(x))。',
                  'Feed x into g, then feed g(x) into F. Evaluate the outer derivative at g(x), then multiply by the inner rate; F′(x) is generally not F′(g(x)).',
                )
              : t(
                  '把两个变化贡献分别保留：u′v与uv′。先预测完整表达式，展开原乘积再求导作独立核验。',
                  'Keep both contributions, u′v and uv′. Predict the complete expression, then independently check by expanding the original product.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t(
          chain ? '复合规则' : '乘积规则',
          chain ? 'Composite rule' : 'Product rule',
        )}
        value={index}
        options={(chain
          ? chains.map(([g, n]) => `(${g})^${n}`)
          : products.map(([u, v]) => `(${u})(${v})`)
        ).map((v, j) => [String(j), t(v, v)])}
        change={setIndex}
      />
      <Select
        mode={mode}
        name={t('求值输入a', 'Evaluation input a')}
        value={a}
        options={opts(['-1', '0', '1', '2'])}
        change={setA}
      />
      <ol aria-label={word(mode, t('变化结构', 'Change structure'))}>
        {chain ? (
          <>
            <li>
              x → g(x)={nested[0]} → F(g(x))=({nested[0]})^{nested[1]}
            </li>
            <li>
              F′(g(x))={polynomialText(composite.outer)}; g′(x)=
              {polynomialText(composite.innerDerivative)}
            </li>
          </>
        ) : (
          <>
            <li>
              u(x)={pair[0]}; v(x)={pair[1]}
            </li>
            <li>u′v + uv′</li>
          </>
        )}
      </ol>
      <Predict
        key={`expression-${d}`}
        mode={mode}
        name={t('预测完整导数', 'Predict full derivative')}
        answer={{ kind: 'polynomial', value: d, variables: ['x'] }}
        hint={algebraHint}
      />
      <Predict
        key={`rate-${rate}`}
        mode={mode}
        name={t('预测a处变化率', 'Predict rate at a')}
        answer={number(m.rate)}
        hint={t(
          '先写完整导数再代a；不要把原函数值或两个导数的错误组合代入。',
          'Differentiate fully before evaluating at a; do not substitute the original value or an incorrect combination of derivatives.',
        )}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换显示视窗', 'Change display window')} />
      </button>
      <ConceptPlot
        mode={mode}
        wide={wide}
        curves={[
          graphCurve(m.p, 'f', '#6254a1'),
          graphCurve(m.derivative, 'f-prime', '#147d67'),
        ]}
        points={[{ x: Number(a), y: asNumber(m.rate), label: 'D' }]}
        caption={t(
          '紫色原函数，绿色导数函数。D的高度是f在a处的斜率。图窗外数值保留在精确表；系数恒等核验才证明两种导数写法相同。',
          'Purple is f and green is f′. D’s height is the slope of f at a. Exact values outside the window remain in the table; coefficient identities verify equality of derivative expressions.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('求导结构核验', 'Differentiation structure audit')}
          headers={[
            t('对象', 'Object'),
            t('精确式或值', 'Exact expression or value'),
          ]}
          rows={
            chain
              ? [
                  [`g(${a})`, textR(composite.innerValue)],
                  [`F′(g(${a}))`, textR(composite.outerValue)],
                  [`g′(${a})`, textR(composite.innerRate)],
                  ['F′(g(x))g′(x)', d],
                  [`f′(${a})`, rate],
                  ['f(x)', p],
                ]
              : [
                  ['u′v', polynomialText(product.first)],
                  ['uv′', polynomialText(product.second)],
                  ['u′v + uv′', d],
                  [`f′(${a})`, rate],
                  [`u′(${a})v′(${a})`, textR(product.wrong)],
                  ['f(x)', p],
                ]
          }
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `原式展开为${p}；逐项求导得${d}。这与结构法在所有x上等价，不是只碰巧在a处相等。自动工具限定有理系数、总次数不超过4；法则本身的可导条件另行核验。`,
              `Expanding the source gives ${p}; termwise differentiation gives ${d}. This agrees with the structural rule for all x, not just at a. The tool is bounded to rational coefficients and total degree at most four; the general rules require differentiability.`,
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
function Rates({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<RateScenario>('position'),
    [time, setTime] = useState('1'),
    [wide, setWide] = useState(false),
    m = appliedRateModel(kind, time),
    points: GraphPoint[] = m.value
      ? [{ x: Number(time), y: asNumber(m.value), label: 'A' }]
      : [];
  const plot: ConceptCurve = {
    name: 'model-domain',
    color: '#6254a1',
    points: Array.from({ length: m.end * 40 + 1 }, (_, i) => {
      const x = rational(BigInt(i), 40n);
      return { x: asNumber(x), y: asNumber(valueAt(m.p, x)) };
    }),
  };
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={
            kind === 'position'
              ? t(
                  '虚构位移s(t)=t²−4t+3米，0≤t≤4秒。有向速度s′=2t−4米/秒，速率=|s′|。图像只画有效时间范围，单位按坐标标签分别解释。',
                  'Fictional position s(t)=t²−4t+3 metres, 0≤t≤4 seconds. Signed velocity is 2t−4 m/s and speed is its absolute value. Only the valid time range is drawn; axes carry distinct physical units.',
                )
              : t(
                  '虚构正方形边长ℓ=1+2t米，0≤t≤3秒。面积A=(1+2t)²平方米，A′=2ℓ·ℓ′。代数延长线不代表情境仍适用。',
                  'A fictional square has side ℓ=1+2t metres for 0≤t≤3 seconds. Area A=(1+2t)² m² has rate A′=2ℓℓ′. Extending a formula algebraically does not extend the contextual model.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('虚构模型', 'Fictional model')}
        value={kind}
        options={[
          ['position', t('位移与速度', 'Position and velocity')],
          ['area', t('边长与面积', 'Side length and area')],
        ]}
        change={(v) => setKind(v as RateScenario)}
      />
      <Select
        mode={mode}
        name={t('时间t（秒）', 'Time t (seconds)')}
        value={time}
        options={opts(['-1', '0', '1', '2', '3', '4', '10'])}
        change={setTime}
      />
      <Predict
        key={`physical-${kind}-${show(m.rate)}`}
        mode={mode}
        name={t(
          `预测模型内变化率（${m.unit}）`,
          `Predict in-domain rate (${m.unit})`,
        )}
        answer={number(m.rate)}
        hint={t(
          `先检查0≤t≤${m.end}；范围外情境预测填undefined。范围内先求导再代入，保留符号。`,
          `Check 0≤t≤${m.end}; enter undefined for a contextual rate outside the range. Within it, differentiate first, evaluate and retain sign.`,
        )}
      />
      {kind === 'position' && (
        <Predict
          key={`speed-${show(m.speed)}`}
          mode={mode}
          name={t('预测速率（米/秒）', 'Predict speed (m/s)')}
          answer={number(m.speed)}
          hint={t(
            '范围内取有向速度的绝对值；范围外填undefined。',
            'Inside the range use absolute signed velocity; outside it enter undefined.',
          )}
        />
      )}
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换显示视窗', 'Change display window')} />
      </button>
      <ConceptPlot
        mode={mode}
        wide={wide}
        curves={[plot]}
        points={points}
        ends={[
          { x: 0, y: asNumber(valueAt(m.p, rational(0n))), closed: true },
          {
            x: m.end,
            y: asNumber(valueAt(m.p, rational(BigInt(m.end)))),
            closed: true,
          },
        ]}
        xLabel="t (s)"
        yLabel={kind === 'position' ? 's (m)' : 'A (m²)'}
        caption={t(
          '曲线只显示有效时间，实端点包含在域中；物理坐标单位不同，不把视觉角度当速度。范围端点的变化率按给定光滑公式的延拓/域内单侧率解释，不假定有范围外观测。',
          'The curve shows valid times only, with included endpoints. Physical axes have different units; visual angles are not velocities. At endpoints, rates use the smooth formula’s extension or its inward one-sided rate, without claiming outside observations.',
        )}
      />
      {!m.inside && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '当前时间超出模型范围：代数公式仍可算，但情境中的量与变化率未获支持，不画假观察点。',
              'Time is outside the model domain. The algebraic formula is evaluable, but contextual quantities and rates are unsupported; no observation point is drawn.',
            )}
          />
        </p>
      )}
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('对象', 'Object'), t('精确结果', 'Exact result')]}
          rows={[
            [
              `0≤t≤${m.end}`,
              m.inside
                ? word(mode, t('域内', 'in domain'))
                : word(mode, t('域外', 'outside domain')),
            ],
            [kind === 'position' ? 's(t) (m)' : 'A(t) (m²)', show(m.value)],
            [`rate (${m.unit})`, show(m.rate)],
            ...(kind === 'position' ? [['speed (m/s)', show(m.speed)]] : []),
            [
              word(
                mode,
                t(
                  '代数延拓导数（非范围外情境结论）',
                  'Algebraic extension derivative (no contextual extrapolation)',
                ),
              ),
              textR(m.algebraicRate),
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '先用单位核验：位置/时间给米/秒；2ℓ（米）乘ℓ′（米/秒）给平方米/秒。一个时刻速度0不表示整段静止，负位置不等于负速率。',
              'Check units: position/time is m/s; 2ℓ in metres times ℓ′ in m/s is m²/s. Zero velocity at one instant does not mean rest throughout an interval; negative position is not negative speed.',
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
export function AnalysisLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'analysis-sign' || kind === 'analysis-extrema')
    return (
      <Shape key={kind} mode={mode} extrema={kind === 'analysis-extrema'} />
    );
  if (kind === 'analysis-product' || kind === 'analysis-chain')
    return <Rules key={kind} mode={mode} chain={kind === 'analysis-chain'} />;
  return <Rates mode={mode} />;
}
export function AnalysisHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  const turning = kind === 'analysis-sign' || kind === 'analysis-extrema',
    m = shapeModel(turning ? 'cubic-turn' : 'square');
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        graphCurve(m.p, 'hook-f', '#6254a1'),
        graphCurve(m.derivative, 'hook-derivative', '#147d67'),
      ]}
      points={
        turning
          ? [
              { x: -1, y: 2, label: 'A' },
              { x: 1, y: -2, label: 'B' },
            ]
          : []
      }
      caption={
        kind === 'analysis-sign'
          ? t(
              '先看斜率符号，再谈整段增减。',
              'Inspect slope signs before describing intervals.',
            )
          : kind === 'analysis-extrema'
            ? t(
                '局部转折与完整区间极值要分开核验。',
                'Audit local turns separately from whole-interval extrema.',
              )
            : kind === 'analysis-product'
              ? t(
                  'x·x=x²；导数x+x=2x，而不是1·1。',
                  'x·x=x² has derivative x+x=2x, not 1·1.',
                )
              : kind === 'analysis-chain'
                ? t(
                    '先输入x再平方；内层若加速，外层变化率还须乘内导。',
                    'Feed x into the square; a faster inner input requires multiplication by its rate.',
                  )
                : t(
                    'x²与2x分别表示量与每输入单位变化；物理单位由情境给定。',
                    'x² and 2x represent quantity and change per input unit; context supplies physical units.',
                  )
      }
    />
  );
}
