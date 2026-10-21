import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import { rational, textR, addR } from './algebraModels';
import {
  integralAudit,
  riemannAudit,
  uniformPartition,
  stepAccumulation,
  ftcAudit,
  applicationAudit,
  integrationNumber as num,
  type IntegralFamily,
  type RiemannTag,
  type IntegralApplication,
  integralCases,
  integralPolynomial,
  polynomialIntegral,
} from './integralModels';
import {
  AccumulationFigure,
  RiemannFigure,
  SignedFigure,
  PrimitiveFigure,
  IntegralPlot,
  IntegrationHook,
  points,
} from './IntegralVisuals';
type Kind = Extract<Lesson['lab'], `integral-${string}`>;
export const isIntegralLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('integral-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const number = (n: string | number): AnswerSpec => ({
  kind: 'number',
  value: String(n),
});
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
  change: (s: string) => void;
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
const opts = (values: (string | number)[]): [string, LocalizedText][] =>
  values.map((v) => [String(v), t(String(v), String(v))]);
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
                    '预测符合。请解释宽度、符号、单位与定理条件。',
                    'The prediction matches. Explain widths, signs, units and the theorem conditions.',
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

const fraction = (v: ReturnType<typeof rational>) => number(textR(v));
const hint = t(
  '逐段核对宽度、高度、符号与单位；保留精确分数。',
  'Audit each width, height, sign and unit; retain exact fractions.',
);
function Value({
  mode,
  id,
  name,
  value,
}: {
  mode: LanguageMode;
  id: string;
  name: LocalizedText;
  value: AnswerSpec;
}) {
  return (
    <Predict key={id} mode={mode} name={name} answer={value} hint={hint} />
  );
}
function Summary({
  mode,
  rows,
}: {
  mode: LanguageMode;
  rows: [LocalizedText, string][];
}) {
  return (
    <DataTable
      mode={mode}
      headers={[t('量', 'Quantity'), t('精确结果', 'Exact result')]}
      rows={rows.map(([p, v]) => [word(mode, p), v])}
    />
  );
}
function Accumulate({ mode }: { mode: LanguageMode }) {
  const [time, setTime] = useState('5/2'),
    [profile, setProfile] = useState('step'),
    [initial, setInitial] = useState('0'),
    [view, setView] = useState<'rate' | 'amount'>('rate'),
    rates =
      profile === 'step'
        ? [2, 4, 1]
        : profile === 'constant'
          ? [3, 3, 3]
          : [2, 0, 5],
    m = stepAccumulation(time, rates),
    final = addR(m.amount, rational(BigInt(initial)));
  return (
    <>
      <Select
        mode={mode}
        name={t('率模型', 'Rate model')}
        value={profile}
        options={[
          ['step', t('分段流入', 'Piecewise inflow')],
          ['constant', t('恒定流入', 'Constant inflow')],
          ['pulse', t('包含停流段', 'Inflow with a pause')],
        ]}
        change={setProfile}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `分界0、1、3、4分钟；三段率${rates.join('、')}升/分钟，跳点取右侧值。`,
            `Boundaries 0,1,3,4 minutes; rates ${rates.join(', ')} L/min, right-sided values at jumps.`,
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('截止时刻', 'End time')}
        value={time}
        options={opts(['0', '1', '3/2', '5/2', '3', '4'])}
        change={setTime}
      />
      <Select
        mode={mode}
        name={t('初始升数', 'Initial litres')}
        value={initial}
        options={opts([0, 5])}
        change={setInitial}
      />
      <Select
        mode={mode}
        name={t('图形角色', 'Plot role')}
        value={view}
        options={[
          ['rate', t('率与已流入矩形', 'Rate and elapsed rectangles')],
          ['amount', t('累积量与实际量', 'Accumulated and actual amounts')],
        ]}
        change={(v) => setView(v as typeof view)}
      />
      <AccumulationFigure
        mode={mode}
        tRaw={time}
        rates={rates}
        initial={Number(initial)}
        view={view}
      />
      <Value
        mode={mode}
        id={`a-${textR(m.amount)}`}
        name={t('累积新增升数', 'Added litres')}
        value={fraction(m.amount)}
      />
      <Value
        mode={mode}
        id={`v-${textR(final)}`}
        name={t('实际升数', 'Actual litres')}
        value={fraction(final)}
      />
      <Value
        mode={mode}
        id={`avg-${m.average ? textR(m.average) : 'undefined'}`}
        name={t('平均率（升/分钟）', 'Average rate (L/min)')}
        value={
          m.average
            ? fraction(m.average)
            : { kind: 'calculus-code', value: 'undefined' }
        }
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('区间', 'Interval'),
            t('已历宽', 'Elapsed width'),
            t('率', 'Rate'),
            t('贡献升数', 'Added L'),
          ]}
          rows={m.pieces.map((p) => [
            `${textR(p.left)}..${textR(p.right)}`,
            textR(p.width),
            textR(p.rate),
            textR(p.amount),
          ])}
        />
        <Summary
          mode={mode}
          rows={[
            [t('A(t) / 升', 'A(t) / L'), textR(m.amount)],
            [t('q(t) / 升每分', 'q(t) / L/min'), textR(m.current)],
            [
              t('平均率', 'Average rate'),
              m.average ? textR(m.average) : 'undefined',
            ],
          ]}
        />
      </Audit>
    </>
  );
}
function Riemann({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<IntegralFamily>('square'),
    [n, setN] = useState('4'),
    [tag, setTag] = useState<RiemannTag>('middle'),
    [partition, setPartition] = useState('uniform'),
    edges =
      partition === 'uniform'
        ? uniformPartition('0', '2', Number(n))
        : ['0', '1/4', '1', '2'],
    m = riemannAudit(kind, edges, tag);
  return (
    <>
      <Select
        mode={mode}
        name={t('被积函数', 'Integrand')}
        value={kind}
        options={(
          ['square', 'line', 'arch', 'shiftSquare'] as IntegralFamily[]
        ).map((v) => [v, t(integralCases[v].raw, integralCases[v].raw)])}
        change={(v) => setKind(v as IntegralFamily)}
      />
      <Select
        mode={mode}
        name={t('分割', 'Partition')}
        value={partition}
        options={[
          ['uniform', t('等宽[0,2]', 'Uniform [0,2]')],
          ['custom', t('边界0,1/4,1,2', 'Edges0,1/4,1,2')],
        ]}
        change={setPartition}
      />
      {partition === 'uniform' && (
        <Select
          mode={mode}
          name={t('格数', 'Cell count')}
          value={n}
          options={opts([2, 4, 8, 16])}
          change={setN}
        />
      )}
      <Select
        mode={mode}
        name={t('采样规则', 'Tag rule')}
        value={tag}
        options={[
          ['left', t('左端点', 'Left')],
          ['middle', t('中点', 'Midpoint')],
          ['right', t('右端点', 'Right')],
        ]}
        change={(v) => setTag(v as RiemannTag)}
      />
      <RiemannFigure mode={mode} m={m} />
      <Value
        mode={mode}
        id={`sum-${textR(m.sum)}`}
        name={t('加权黎曼和', 'Weighted Riemann sum')}
        value={fraction(m.sum)}
      />
      <Value
        mode={mode}
        id={`mesh-${textR(m.mesh)}`}
        name={t('最大格宽', 'Mesh')}
        value={fraction(m.mesh)}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('格', 'Cell'),
            t('宽', 'Width'),
            t('采样点', 'Tag'),
            t('高', 'Height'),
            t('贡献', 'Product'),
          ]}
          rows={m.cells.map((c) => [
            `${textR(c.left)}..${textR(c.right)}`,
            ...[c.width, c.sample, c.height, c.product].map(textR),
          ])}
        />
        <Summary
          mode={mode}
          rows={[
            [
              t('下和 ≤ 当前和 ≤ 上和', 'Lower ≤ tagged ≤ upper'),
              `${textR(m.lower)} ≤ ${textR(m.sum)} ≤ ${textR(m.upper)}`,
            ],
            [t('精确积分', 'Exact integral'), textR(m.exact)],
            [t('和减精确值', 'Sum minus exact'), textR(m.error)],
            [t('网格宽度', 'Mesh'), textR(m.mesh)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '这些函数连续，最宽格趋0时收敛。中点对直线精确；对凹曲线可能高估。仅增加其他地方的格数不能消除一个保留的大格。',
              'These functions are continuous: convergence requires mesh tending to zero. Midpoints are exact for affine functions, and can overestimate concave curves. Extra cells elsewhere do not remove a retained large gap.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Primitive({ mode }: { mode: LanguageMode }) {
  const [raw, setRaw] = useState('3x^2-4'),
    [task, setTask] = useState('family'),
    [constant, setConstant] = useState('0'),
    answer: AnswerSpec = {
      kind: 'integral-primitive',
      integrand: raw,
      value: '',
      family: task === 'family',
      ...(task === 'initial' ? { initial: { x: '0', value: '5' } } : {}),
    };
  return (
    <>
      <Select
        mode={mode}
        name={t('被积函数', 'Integrand')}
        value={raw}
        options={opts(['3x^2-4', '2x', '4x^3', '0'])}
        change={setRaw}
      />
      <Select
        mode={mode}
        name={t('原函数任务', 'Primitive task')}
        value={task}
        options={[
          ['family', t('完整原函数族', 'Full family')],
          ['one', t('一个原函数', 'One primitive')],
          ['initial', t('满足F(0)=5', 'Satisfy F(0)=5')],
        ]}
        change={setTask}
      />
      <Select
        mode={mode}
        name={t('仅改显示常数', 'Displayed constant only')}
        value={constant}
        options={opts([-3, 0, 5])}
        change={setConstant}
      />
      <PrimitiveFigure mode={mode} raw={raw} c={Number(constant)} />
      <Predict
        key={`${raw}-${task}`}
        mode={mode}
        name={t(
          task === 'family'
            ? '完整表达式（含C）'
            : task === 'one'
              ? '一个原函数表达式'
              : '满足初值的表达式',
          task === 'family'
            ? 'Full expression (include C)'
            : task === 'one'
              ? 'One primitive expression'
              : 'Expression satisfying the initial value',
        )}
        answer={answer}
        hint={t(
          '求导后须恒等于题中被积函数。完整族需要任意实C；一个原函数填数值常数；初值还须代回。',
          'Differentiate back to the integrand identically. A full family needs arbitrary real C; one primitive uses a numerical constant. Substitute the initial condition too.',
        )}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '只填表达式，支持有理系数与括号。完整族支持非零一次C（如−C、2C+5）；C²漏掉负常数。显示常数只改图，不改完整族答案。这里自动核验多项式，eˣ与sin的逆规则见阅读材料。',
            'Enter only an expression, using rational coefficients and brackets. Full families support nonzero affine C, such as −C or2C+5. C² misses negative constants. The display constant changes only the plot. Automatic checking here covers polynomials; read the exponential and sine inverse rules in the lesson.',
          )}
        />
      </p>
      <Audit mode={mode}>
        <p>
          <Text
            mode={mode}
            text={t(
              '用两步核验：逐项求导比较全部系数；有初值时再比较F(0)与5。同导数的两个原函数在同一连通区间只差常数，依据中值定理，而非试几个点。',
              'Audit in two steps: differentiate and compare every coefficient, then check F(0)=5 when required. Equal derivatives imply a constant difference on a connected interval by the mean value theorem, rather than agreement at sampled points.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Signed({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<IntegralFamily>('crossLine'),
    [bounds, setBounds] = useState('0,3'),
    [a, b] = bounds.split(','),
    m = integralAudit(kind, a!, b!);
  return (
    <>
      <Select
        mode={mode}
        name={t('被积函数', 'Integrand')}
        value={kind}
        options={(
          [
            'crossLine',
            'descending',
            'negativeSquare',
            'arch',
          ] as IntegralFamily[]
        ).map((v) => [v, t(integralCases[v].raw, integralCases[v].raw)])}
        change={(v) => setKind(v as IntegralFamily)}
      />
      <Select
        mode={mode}
        name={t('有序上下限', 'Ordered bounds')}
        value={bounds}
        options={opts(['0,3', '3,0', '0,4', '2,2', '-2,2'])}
        change={setBounds}
      />
      <SignedFigure mode={mode} m={m} />
      <Value
        mode={mode}
        id={`signed-${textR(m.signed)}`}
        name={t('有向定积分', 'Signed definite integral')}
        value={fraction(m.signed)}
      />
      <Value
        mode={mode}
        id={`area-${textR(m.magnitude)}`}
        name={t('总几何面积', 'Total geometric area')}
        value={fraction(m.magnitude)}
      />
      <Audit mode={mode}>
        <Pieces mode={mode} m={m} />
        <Summary
          mode={mode}
          rows={[
            [t('有向积分', 'Signed integral'), textR(m.signed)],
            [t('正区域面积', 'Positive region area'), textR(m.positive)],
            [
              t('负区域面积大小', 'Negative region magnitude'),
              textR(m.negative),
            ],
            [t('总面积', 'Total area'), textR(m.magnitude)],
          ]}
        />
      </Audit>
    </>
  );
}
function Pieces({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof integralAudit>;
}) {
  return (
    <DataTable
      mode={mode}
      headers={[
        t('递增区间', 'Increasing interval'),
        t('有符号贡献', 'Signed contribution'),
        t('绝对面积', 'Absolute area'),
      ]}
      rows={m.pieces.map((p) => [
        `${textR(p.left)}..${textR(p.right)}`,
        textR(p.signed),
        textR(p.area),
      ])}
    />
  );
}
function Fundamental({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<IntegralFamily | 'step'>('square'),
    [lower, setLower] = useState('1'),
    [x, setX] = useState('1'),
    [k, setK] = useState('1'),
    m = ftcAudit(kind, lower, x, Number(k)),
    f = (z: number) =>
      kind === 'step'
        ? num(stepAccumulation((Number(k) * z).toFixed(6)).amount) -
          num(stepAccumulation(lower).amount)
        : num(
            polynomialIntegral(
              integralPolynomial(integralCases[kind].raw),
              rational(BigInt(lower)),
              rational(BigInt(Math.round(Number(k) * z * 1e6)), 1000000n),
            ),
          );
  return (
    <>
      <Select
        mode={mode}
        name={t('被积函数', 'Integrand')}
        value={kind}
        options={[
          ['square', t('t²', 't²')],
          ['line', t('t', 't')],
          ['arch', t('4−t²', '4−t²')],
          ['step', t('分段率2、4、1', 'Step rate 2,4,1')],
        ]}
        change={(v) => setKind(v as typeof kind)}
      />
      <Select
        mode={mode}
        name={t('固定下限a', 'Fixed lower bound a')}
        value={lower}
        options={opts([0, 1])}
        change={setLower}
      />
      <Select
        mode={mode}
        name={t('求导位置x', 'Derivative point x')}
        value={x}
        options={opts(['1/2', '1', '3/2'])}
        change={setX}
      />
      <Select
        mode={mode}
        name={t('上限kx的k', 'k in upper limit kx')}
        value={k}
        options={opts([1, 2])}
        change={setK}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `A(x)=∫从${lower}到${k}x f(t)dt；分段率的分界为t=1、3。`,
            `A(x)=∫ from ${lower} to ${k}x f(t)dt; step-rate jumps are at t=1,3.`,
          )}
        />
      </p>
      <IntegralPlot
        mode={mode}
        name={t('累积函数的值与局部斜率', 'Accumulation value and local slope')}
        caption={t(
          '图为A(x)，不是被积函数f。连续点有A′(x)=k f(kx)；固定下限只改变常数。分段率跳点要核左右斜率，A仍连续。',
          'This is A(x), not integrand f. At continuous points A′(x)=k f(kx). A fixed lower bound changes only a constant. At rate jumps check both slopes; A is still continuous.',
        )}
        xmin={0}
        xmax={2}
        lines={[{ name: 'A(x)', points: points(f, 0, 2) }]}
        dots={[
          {
            x: num(m.x),
            y: num(m.value),
            label: `x=${x}, kx=${textR(m.upper)}`,
          },
        ]}
        ylabel="A(x)"
      />
      <Value
        mode={mode}
        id={`val-${textR(m.value)}`}
        name={t('A(x)的值', 'Value of A(x)')}
        value={fraction(m.value)}
      />
      <Value
        mode={mode}
        id={`der-${m.derivative ? textR(m.derivative) : 'DNE'}`}
        name={t('A′(x)（不存在填DNE）', 'A′(x) (DNE if nonexistent)')}
        value={
          m.derivative
            ? fraction(m.derivative)
            : { kind: 'calculus-code', value: 'does-not-exist' }
        }
      />
      <Audit mode={mode}>
        <Summary
          mode={mode}
          rows={[
            [t('上限kx', 'Upper limit kx'), textR(m.upper)],
            [t('积分值', 'Integral value'), textR(m.value)],
            [t('左斜率', 'Left slope'), textR(m.left)],
            [t('右斜率', 'Right slope'), textR(m.right)],
            [
              t('双侧导数', 'Two-sided derivative'),
              m.derivative ? textR(m.derivative) : 'DNE',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '连续情形的小增量商是短区间平均高度再乘上限变化率。跳点两侧高度不一致，因此此处不能直接把点值当导数。用同一个原函数求F(b)−F(a)，常数会抵消。',
              'For continuous f, a small difference quotient is the average height on a shrinking interval times the upper-limit rate. At jumps the one-sided heights differ, so the point value is not automatically a derivative. Evaluate F(b)−F(a) with one primitive; its constant cancels.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Applications({ mode }: { mode: LanguageMode }) {
  const [scenario, setScenario] = useState<IntegralApplication>('motion'),
    [extended, setExtended] = useState('no'),
    [initial, setInitial] = useState('10'),
    [view, setView] = useState('curves'),
    m = applicationAudit(scenario, extended === 'yes', Number(initial)),
    unit = scenario === 'motion' ? 'm' : scenario === 'flow' ? 'L' : 'm²';
  return (
    <>
      <Select
        mode={mode}
        name={t('应用模型', 'Application model')}
        value={scenario}
        options={[
          ['motion', t('速度v=t−2（米/秒）', 'Velocity v=t−2 (m/s)')],
          ['flow', t('流入q=2t（升/分钟）', 'Inflow q=2t (L/min)')],
          ['between', t('两曲线y=2x与x²（米）', 'Curves y=2x and x² (m)')],
        ]}
        change={(v) => setScenario(v as IntegralApplication)}
      />
      <Select
        mode={mode}
        name={t('区间设置', 'Interval setting')}
        value={extended}
        options={[
          ['no', t('默认区间', 'Default interval')],
          ['yes', t('比较区间', 'Comparison interval')],
        ]}
        change={setExtended}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `当前区间[${textR(m.a)},${textR(m.b)}]。${scenario === 'motion' ? '时间秒；速度可正可负。' : scenario === 'flow' ? '时间分钟；假设无流出，无容量限制。' : '横纵坐标均为米；高度差可变号。'}`,
            `Current interval [${textR(m.a)},${textR(m.b)}]. ${scenario === 'motion' ? 'Time is seconds; velocity is signed.' : scenario === 'flow' ? 'Time is minutes; assume no outflow and no capacity constraint.' : 'Both coordinates are metres; the height difference may change sign.'}`,
          )}
        />
      </p>
      {scenario !== 'between' && (
        <Select
          mode={mode}
          name={t('初始状态', 'Initial state')}
          value={initial}
          options={opts([0, 5, 10])}
          change={setInitial}
        />
      )}
      {scenario === 'between' && (
        <Select
          mode={mode}
          name={t('面积视图', 'Area view')}
          value={view}
          options={[
            ['curves', t('实际两曲线', 'Actual two curves')],
            ['gap', t('高度差到轴', 'Difference to axis')],
          ]}
          change={setView}
        />
      )}
      <SignedFigure
        mode={mode}
        m={m}
        between={scenario === 'between' && view === 'curves'}
      />
      <Value
        mode={mode}
        id={`${scenario}-net-${textR(m.signed)}`}
        name={t(`净积分（${unit}）`, `Signed total (${unit})`)}
        value={fraction(m.signed)}
      />
      <Value
        mode={mode}
        id={`${scenario}-total-${textR(m.magnitude)}`}
        name={t(
          `${scenario === 'motion' ? '总路程' : scenario === 'flow' ? '总流入' : '几何面积'}（${unit}）`,
          `${scenario === 'motion' ? 'Total distance' : scenario === 'flow' ? 'Total inflow' : 'Geometric area'} (${unit})`,
        )}
        value={fraction(m.magnitude)}
      />
      {m.final && (
        <Value
          mode={mode}
          id={`${scenario}-final-${textR(m.final)}`}
          name={t(`最后状态（${unit}）`, `Final state (${unit})`)}
          value={fraction(m.final)}
        />
      )}
      <Audit mode={mode}>
        <Pieces mode={mode} m={m} />
        <Summary
          mode={mode}
          rows={[
            [t('净积分', 'Signed total'), `${textR(m.signed)} ${unit}`],
            [
              t('绝对贡献总和', 'Absolute contribution total'),
              `${textR(m.magnitude)} ${unit}`,
            ],
            ...(m.final
              ? [
                  [
                    t('末状态=初始+净变化', 'Final = initial + net change'),
                    `${textR(m.final)} ${unit}`,
                  ] as [LocalizedText, string],
                ]
              : []),
          ]}
        />
      </Audit>
    </>
  );
}
export function IntegralLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'integral-accumulation' ? (
        <Accumulate mode={mode} />
      ) : kind === 'integral-riemann' ? (
        <Riemann mode={mode} />
      ) : kind === 'integral-primitive' ? (
        <Primitive mode={mode} />
      ) : kind === 'integral-signed' ? (
        <Signed mode={mode} />
      ) : kind === 'integral-ftc' ? (
        <Fundamental mode={mode} />
      ) : (
        <Applications mode={mode} />
      )}
    </section>
  );
}
export function IntegralHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return <IntegrationHook kind={kind} mode={mode} />;
}
