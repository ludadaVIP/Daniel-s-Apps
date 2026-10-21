import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import { MassFigure, DensityFigure } from './DistributionVisuals';
import { rational, textR, addR, mulR, negR } from './algebraModels';
import {
  distribution,
  distributionCases,
  affineDistribution,
  tableText,
  distributionSimulation,
  binomialDistribution,
  binomialEvent,
  normalAudit,
  normalCdf,
  standardScore,
  probability4,
  type DistributionCase,
} from './distributionModels';
type Kind = Extract<Lesson['lab'], `distribution-${string}`>;
export const isDistributionLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('distribution-');
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
                    '预测符合。请解释权重、事件、单位与模型条件。',
                    'The prediction matches. Explain weights, events, units and model conditions.',
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
  '核对概率权重、事件边界与单位；近似概率按要求舍入。',
  'Audit probability weights, event boundaries and units; round approximate probabilities as requested.',
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

const probability = (p: number): AnswerSpec => ({
  kind: 'distribution-rounded',
  value: probability4(p),
});
const names: Record<DistributionCase, LocalizedText> = {
  heads: t('两枚公平硬币正面数', 'Two fair coins: head count'),
  twoPoint: t('0或3，各半', 'Zero or three, each one-half'),
  spread: t('−1或3，各半', 'Minus one or three, each one-half'),
  symmetric: t('0或2，各半', 'Zero or two, each one-half'),
  fixed: t('恒定取2', 'Constant two'),
  rare: t('0占九成，10占一成', 'Zero with nine-tenths, ten with one-tenth'),
};
function MassTable({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof distribution>;
}) {
  return (
    <DataTable
      mode={mode}
      headers={[
        t('取值', 'Value'),
        t('概率', 'Probability'),
        t('取值乘概率', 'Value times mass'),
      ]}
      rows={m.rows.map((r) => [
        textR(r.value),
        textR(r.p),
        textR(mulR(r.value, r.p)),
      ])}
    />
  );
}
function TableLab({ mode }: { mode: LanguageMode }) {
  const [mapping, setMapping] = useState('heads'),
    outcomes = ['TT', 'HT', 'TH', 'HH'],
    values =
      mapping === 'heads'
        ? [0, 1, 1, 2]
        : mapping === 'same'
          ? [1, 0, 0, 1]
          : [-1, 1, 1, 3],
    weights = new Map<number, number>();
  values.forEach((v) => weights.set(v, (weights.get(v) ?? 0) + 1));
  const m = distribution([...weights].map(([v, n]) => [String(v), `${n}/4`]));
  return (
    <>
      <Select
        mode={mode}
        name={t('数值映射', 'Numerical map')}
        value={mapping}
        options={[
          ['heads', t('正面个数', 'Number of heads')],
          ['same', t('相同记1，不同记0', 'Same faces→1, different→0')],
          ['gain', t('正面数的2倍减1', 'Twice head count minus one')],
        ]}
        change={setMapping}
      />
      <DataTable
        mode={mode}
        name={t('样本结果到数值', 'Outcomes mapped to values')}
        headers={[
          t('样本结果', 'Outcome'),
          t('概率', 'Probability'),
          t('X值', 'X value'),
        ]}
        rows={outcomes.map((s, i) => [s, '1/4', values[i]!])}
      />
      <Predict
        key={mapping}
        mode={mode}
        name={t('构造完整分布表', 'Construct the complete distribution table')}
        answer={{ kind: 'distribution-table', value: tableText(m) }}
        hint={t(
          '按数值合并互斥结果，格式0:1/4;1:1/2;2:1/4；每个不同值只写一行，使用当前映射。',
          'Merge disjoint outcomes by value, using value:probability;value:probability. Include each distinct value exactly once and use the current map.',
        )}
      />
      <Audit mode={mode}>
        <MassFigure mode={mode} m={m} />
        <MassTable mode={mode} m={m} />
        <p>
          <Text
            mode={mode}
            text={t(
              '四个结果等可能不表示数值等可能；合并不丢概率。非负且总和1两个条件同时需要。',
              'Four equally likely outcomes do not imply equiprobable values. Merging preserves mass. Both nonnegativity and total one are required.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Expectation({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<DistributionCase>('twoPoint'),
    [a, setA] = useState('1'),
    [b, setB] = useState('0'),
    [seed, setSeed] = useState('42'),
    [count, setCount] = useState(0),
    m = distribution(distributionCases[kind]),
    y = affineDistribution(m, a, b),
    sim = distributionSimulation(y, Number(seed), count);
  return (
    <>
      <Select
        mode={mode}
        name={t('原分布', 'Original distribution')}
        value={kind}
        options={(['twoPoint', 'rare', 'heads'] as DistributionCase[]).map(
          (v) => [v, names[v]],
        )}
        change={(v) => {
          setKind(v as DistributionCase);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('Y=aX+b的a', 'a in Y=aX+b')}
        value={a}
        options={opts([-1, 1, 2])}
        change={(v) => {
          setA(v);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('Y=aX+b的b', 'b in Y=aX+b')}
        value={b}
        options={opts([0, 1, 5])}
        change={(v) => {
          setB(v);
          setCount(0);
        }}
      />
      <MassFigure mode={mode} m={y} variable="Y" />
      <Value
        mode={mode}
        id={`mean-${textR(y.mean)}`}
        name={t('预测E(Y)', 'Predict E(Y)')}
        value={fraction(y.mean)}
      />
      <Select
        mode={mode}
        name={t('模拟种子', 'Simulation seed')}
        value={seed}
        options={opts([42, 1234])}
        change={(v) => {
          setSeed(v);
          setCount(0);
        }}
      />
      <button
        className="math-button"
        disabled={count >= 2000}
        onClick={() => setCount(Math.min(2000, count + 10))}
      >
        <Text mode={mode} text={t('再模拟10次', 'Simulate ten more')} />
      </button>
      <button className="math-button secondary" onClick={() => setCount(0)}>
        <Text mode={mode} text={t('清空本次模拟', 'Reset this simulation')} />
      </button>
      <p role="status">
        <Text
          mode={mode}
          text={t(
            `伪随机演示，种子${seed}；${count}次，样本均值${sim.average ? textR(sim.average) : '未定义（零次）'}。不是下一次保证，也不保证每步更接近期望。`,
            `Pseudorandom illustration, seed ${seed}; ${count} draws, sample mean ${sim.average ? textR(sim.average) : 'undefined (zero draws)'}. This neither guarantees the next outcome nor monotone convergence.`,
          )}
        />
      </p>
      <Audit mode={mode}>
        <MassTable mode={mode} m={y} />
        <Summary
          mode={mode}
          rows={[
            [t('理论E(X)', 'Theoretical E(X)'), textR(m.mean)],
            [t('理论E(Y)', 'Theoretical E(Y)'), textR(y.mean)],
          ]}
        />
        <DataTable
          mode={mode}
          headers={[t('取值', 'Value'), t('模拟次数', 'Simulated count')]}
          rows={y.rows.map((r, i) => [textR(r.value), sim.counts[i]!])}
        />
        <DataTable
          mode={mode}
          name={t('前12次伪随机轨迹', 'First twelve pseudorandom draws')}
          headers={[t('状态', 'State'), t('值', 'Value')]}
          rows={sim.trace.map((r) => [r.state, r.value])}
        />
      </Audit>
    </>
  );
}
function Spread({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<DistributionCase>('symmetric'),
    [a, setA] = useState('1'),
    [b, setB] = useState('0'),
    m = distribution(distributionCases[kind]),
    y = affineDistribution(m, a, b);
  return (
    <>
      <Select
        mode={mode}
        name={t('原分布', 'Original distribution')}
        value={kind}
        options={(
          ['symmetric', 'spread', 'heads', 'fixed'] as DistributionCase[]
        ).map((v) => [v, names[v]])}
        change={(v) => setKind(v as DistributionCase)}
      />
      <Select
        mode={mode}
        name={t('缩放a', 'Scale a')}
        value={a}
        options={opts([-3, 0, 1, 2])}
        change={setA}
      />
      <Select
        mode={mode}
        name={t('平移b', 'Translation b')}
        value={b}
        options={opts([-2, 0, 5])}
        change={setB}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '原量X以米计，Y=aX+b仍以米计；a无单位，b以米计。这里计算理论分布方差，不用样本n−1。',
            'X and Y=aX+b are measured in metres; a is unitless and b metres. Compute a theoretical distribution variance, without an n−1 sample divisor.',
          )}
        />
      </p>
      <MassFigure mode={mode} m={y} variable="Y" />
      <Value
        mode={mode}
        id={`var-${textR(y.variance)}`}
        name={t('预测Var(Y)（平方米）', 'Predict Var(Y) (m²)')}
        value={fraction(y.variance)}
      />
      <Value
        mode={mode}
        id={`sd-${textR(y.variance)}`}
        name={t(
          '预测SD(Y)（米，支持sqrt）',
          'Predict SD(Y) (m, sqrt supported)',
        )}
        value={{ kind: 'radical', value: y.sd }}
      />
      <Value
        mode={mode}
        id={`mu-${textR(y.mean)}`}
        name={t('预测E(Y)（米）', 'Predict E(Y) (m)')}
        value={fraction(y.mean)}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('Y值', 'Y value'),
            t('概率', 'Mass'),
            t('偏差', 'Deviation'),
            t('平方偏差加权', 'Weighted square'),
          ]}
          rows={y.rows.map((r) => {
            const d = addR(r.value, negR(y.mean));
            return [
              textR(r.value),
              textR(r.p),
              textR(d),
              textR(mulR(mulR(d, d), r.p)),
            ];
          })}
        />
        <Summary
          mode={mode}
          rows={[
            [
              t('原均值 / 方差', 'Original mean / variance'),
              `${textR(m.mean)} / ${textR(m.variance)}`,
            ],
            [
              t('Y均值 / 方差 / 标准差', 'Y mean / variance / SD'),
              `${textR(y.mean)} / ${textR(y.variance)} / ${y.sd}`,
            ],
          ]}
        />
      </Audit>
    </>
  );
}
function Binomial({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState('4'),
    [p, setP] = useState('1/2'),
    [k, setK] = useState('2'),
    [event, setEvent] = useState<'exact' | 'at-least' | 'at-most'>('exact'),
    [setting, setSetting] = useState('iid'),
    m = binomialDistribution(Number(n), p),
    kNow = Math.min(Number(k), Number(n)),
    mass = binomialEvent(m, kNow, event);
  return (
    <>
      <Select
        mode={mode}
        name={t('实验条件', 'Experiment conditions')}
        value={setting}
        options={[
          ['iid', t('固定独立、同成功率', 'Fixed independent trials, same p')],
          ['bag', t('有限袋不放回', 'Finite bag without replacement')],
          ['stop', t('首次成功就停止', 'Stop at the first success')],
        ]}
        change={setSetting}
      />
      {setting !== 'iid' ? (
        <p role="status">
          <Text
            mode={mode}
            text={
              setting === 'bag'
                ? t(
                    '这里通常相依且条件成功率变化，不能把二项公式当作本情形的结果。请先重建抽取模型。',
                    'Draws are generally dependent with changing conditional success rates. The binomial formula is not a result for this setting; rebuild the draw model.',
                  )
                : t(
                    '停止规则使试验次数随机，不是固定n的二项计数。请先明确随机变量。',
                    'The stopping rule makes trial count random, not a fixed-n binomial count. Define the random variable first.',
                  )
            }
          />
        </p>
      ) : (
        <>
          <Select
            mode={mode}
            name={t('固定次数n', 'Fixed trials n')}
            value={n}
            options={opts([0, 1, 4, 6])}
            change={setN}
          />
          <Select
            mode={mode}
            name={t('每次成功率p', 'Success probability p')}
            value={p}
            options={opts(['0', '1/3', '1/2', '1'])}
            change={setP}
          />
          <Select
            mode={mode}
            name={t('成功数界k', 'Count boundary k')}
            value={String(kNow)}
            options={opts(Array.from({ length: Number(n) + 1 }, (_, i) => i))}
            change={setK}
          />
          <Select
            mode={mode}
            name={t('事件', 'Event')}
            value={event}
            options={[
              ['exact', t('恰好k', 'Exactly k')],
              ['at-least', t('至少k', 'At least k')],
              ['at-most', t('至多k', 'At most k')],
            ]}
            change={(v) => setEvent(v as typeof event)}
          />
          <MassFigure mode={mode} m={m} />
          <Value
            mode={mode}
            id={`p-${textR(mass)}`}
            name={t('预测事件概率', 'Predict event probability')}
            value={fraction(mass)}
          />
          <Value
            mode={mode}
            id={`m-${textR(m.mean)}`}
            name={t('预测成功数期望', 'Predict expected success count')}
            value={fraction(m.mean)}
          />
          <Value
            mode={mode}
            id={`v-${textR(m.variance)}`}
            name={t('预测成功数方差', 'Predict success-count variance')}
            value={fraction(m.variance)}
          />
          <Audit mode={mode}>
            <MassTable mode={mode} m={m} />
            <p>
              <Text
                mode={mode}
                text={t(
                  `表保留0..${n}全部计数槽。支持集只包含非零概率取值：{${m.support.map(textR).join(',')}}；退化情形标准差可为0。`,
                  `All count slots0..${n} remain in the table. The support contains only positive-mass values: {${m.support.map(textR).join(',')}}. Degenerate cases may have zero SD.`,
                )}
              />
            </p>
            <Summary
              mode={mode}
              rows={[
                [t('所选事件概率', 'Selected event probability'), textR(mass)],
                [
                  t('均值 / 方差', 'Mean / variance'),
                  `${textR(m.mean)} / ${textR(m.variance)}`,
                ],
              ]}
            />
          </Audit>
        </>
      )}
    </>
  );
}
function Normal({ mode }: { mode: LanguageMode }) {
  const [mu, setMu] = useState('50'),
    [sigma, setSigma] = useState('2'),
    [event, setEvent] = useState('one'),
    mean = Number(mu),
    sd = Number(sigma),
    lo =
      event === 'one'
        ? mean - sd
        : event === 'two'
          ? mean - 2 * sd
          : event === 'point'
            ? mean
            : undefined,
    hi = event === 'one' ? mean + sd : event === 'two' ? mean + 2 * sd : mean,
    m = normalAudit(mu, sigma, String(lo ?? mean), String(hi)),
    prob = event === 'left' ? 0.5 : m.probability;
  return (
    <>
      <Select
        mode={mode}
        name={t('均值μ（厘米）', 'Mean μ (cm)')}
        value={mu}
        options={opts([10, 50])}
        change={setMu}
      />
      <Select
        mode={mode}
        name={t('标准差σ（厘米）', 'SD σ (cm)')}
        value={sigma}
        options={opts([1, 2, 3])}
        change={setSigma}
      />
      <Select
        mode={mode}
        name={t('概率区间', 'Probability interval')}
        value={event}
        options={[
          ['one', t('均值±一个标准差', 'Mean±one SD')],
          ['two', t('均值±两个标准差', 'Mean±two SD')],
          ['left', t('均值左侧全部', 'All values left of mean')],
          ['point', t('恰等于均值', 'Exactly equal to mean')],
        ]}
        change={setEvent}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `假设X~N(${mu},${sigma}²)，不是由外观证明正态。当前事件${lo ?? '−∞'}≤X≤${hi}。`,
            `Assume X~N(${mu},${sigma}²), rather than inferring normality from appearance. Current event: ${lo ?? '−∞'}≤X≤${hi}.`,
          )}
        />
      </p>
      <DensityFigure mode={mode} mean={mean} sd={sd} lo={lo} hi={hi} />
      <Value
        mode={mode}
        id={`prob-${probability4(prob)}`}
        name={t('预测概率（四位小数）', 'Predict probability (four decimals)')}
        value={probability(prob)}
      />
      <Audit mode={mode}>
        <Summary
          mode={mode}
          rows={[
            [
              t(
                '区间概率（数值近似）',
                'Interval probability (numerical approximation)',
              ),
              probability4(prob),
            ],
            [t('单点概率（精确）', 'Point probability (exact)'), '0'],
            [
              t('标准差 / 方差', 'SD / variance'),
              `${sigma} cm / ${sd * sd} cm²`,
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '面积数值由标准密度数值积分再舍入；单点概率0并非把低高度舍入为0。密度高度不能当概率。',
              'Areas are numerical integrals of the standard density, rounded afterwards. Zero point probability is exact, not a rounded small height. Density height is not probability.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Standard({ mode }: { mode: LanguageMode }) {
  const [mu, setMu] = useState('100'),
    [sigma, setSigma] = useState('10'),
    [offset, setOffset] = useState('-1.5'),
    [event, setEvent] = useState('left'),
    [view, setView] = useState('original'),
    mean = Number(mu),
    sd = Number(sigma),
    z = Number(offset),
    x = mean + sd * z,
    score = standardScore(String(x), mu, sigma),
    p =
      event === 'left'
        ? normalCdf(z)
        : event === 'right'
          ? 1 - normalCdf(z)
          : normalCdf(Math.abs(z)) - normalCdf(-Math.abs(z)),
    standard = view === 'standard',
    centre = standard ? 0 : mean,
    scale = standard ? 1 : sd,
    lo =
      event === 'left'
        ? undefined
        : event === 'right'
          ? centre + scale * z
          : centre - scale * Math.abs(z),
    hi =
      event === 'right'
        ? undefined
        : event === 'left'
          ? centre + scale * z
          : centre + scale * Math.abs(z);
  return (
    <>
      <Select
        mode={mode}
        name={t('均值μ', 'Mean μ')}
        value={mu}
        options={opts([50, 100])}
        change={setMu}
      />
      <Select
        mode={mode}
        name={t('正标准差σ', 'Positive SD σ')}
        value={sigma}
        options={opts([5, 10])}
        change={setSigma}
      />
      <Select
        mode={mode}
        name={t('原值x', 'Original value x')}
        value={offset}
        options={[-2, -1.5, 0, 1, 1.5, 2].map((v) => [
          String(v),
          t(String(mean + sd * v), String(mean + sd * v)),
        ])}
        change={setOffset}
      />
      <Select
        mode={mode}
        name={t('尾部事件', 'Tail event')}
        value={event}
        options={[
          ['left', t('P(X≤x)', 'P(X≤x)')],
          ['right', t('P(X>x)', 'P(X>x)')],
          ['between', t('均值左右等距区间', 'Symmetric interval about mean')],
        ]}
        change={setEvent}
      />
      <Select
        mode={mode}
        name={t('坐标视图', 'Coordinate view')}
        value={view}
        options={[
          ['original', t('原坐标', 'Original coordinates')],
          ['standard', t('标准正态坐标', 'Standard normal coordinates')],
        ]}
        change={setView}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `假设X~N(${mu},${sigma}²)，选中原值${x}。先算有方向的z，再核表与尾部。`,
            `Assume X~N(${mu},${sigma}²); selected original value ${x}. Compute signed z, then check table convention and tail direction.`,
          )}
        />
      </p>
      <DensityFigure
        mode={mode}
        mean={centre}
        sd={scale}
        lo={lo}
        hi={hi}
        span={standard ? 4 : 40}
        heightScale={standard ? 1 : 5}
        unit={standard ? 'z' : 'score'}
      />
      <Value
        mode={mode}
        id={`z-${textR(score)}`}
        name={t('预测z分数', 'Predict z-score')}
        value={fraction(score)}
      />
      <Value
        mode={mode}
        id={`p-${probability4(p)}`}
        name={t(
          '预测事件概率（四位小数）',
          'Predict event probability (four decimals)',
        )}
        value={probability(p)}
      />
      <Audit mode={mode}>
        <Summary
          mode={mode}
          rows={[
            [
              t('z=(x−μ)/σ', 'z=(x−μ)/σ'),
              `(${x}−${mu})/${sigma}=${textR(score)}`,
            ],
            [
              t('左尾Φ(z)近似', 'Left-tail Φ(z), approximate'),
              probability4(normalCdf(z)),
            ],
            [
              t('当前事件概率近似', 'Selected event probability, approximate'),
              probability4(p),
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '本表Φ给左尾；若另表给0到z面积，需先转换。z无单位但不是概率。正σ允许代数标准化，正态概率还需正态假设；σ0不可除。',
              'This Φ gives left-tail mass. Convert first if another table gives area from zero to z. z is unitless but not a probability. Positive SD allows algebraic standardisation; normal probabilities additionally require normality. Division by zero SD is invalid.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function DistributionLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'distribution-table' ? (
        <TableLab mode={mode} />
      ) : kind === 'distribution-expectation' ? (
        <Expectation mode={mode} />
      ) : kind === 'distribution-spread' ? (
        <Spread mode={mode} />
      ) : kind === 'distribution-binomial' ? (
        <Binomial mode={mode} />
      ) : kind === 'distribution-normal' ? (
        <Normal mode={mode} />
      ) : (
        <Standard mode={mode} />
      )}
    </section>
  );
}
export function DistributionHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'distribution-binomial')
    return <MassFigure mode={mode} m={binomialDistribution(4, '1/2')} />;
  return kind === 'distribution-normal' || kind === 'distribution-standard' ? (
    <DensityFigure
      mode={mode}
      mean={0}
      sd={1}
      lo={-1}
      hi={1}
      span={4}
      unit="z"
    />
  ) : (
    <MassFigure
      mode={mode}
      m={distribution(
        distributionCases[
          kind === 'distribution-expectation'
            ? 'twoPoint'
            : kind === 'distribution-spread'
              ? 'spread'
              : 'heads'
        ],
      )}
    />
  );
}
