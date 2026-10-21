import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import { MassFigure } from './DistributionVisuals';
import {
  PopulationFigure,
  CoverageFigure,
  NullTailFigure,
  EvidenceFigure,
} from './StatisticalInferenceVisuals';
import { rational, textR } from './algebraModels';
import { probability4 } from './distributionModels';
import {
  finiteInference,
  finiteInferenceSimulation,
  knownSigmaInterval,
  coverageSimulation,
  exactBinomialTest,
  practicalEvidence,
  practicalCases,
  type InferenceFrame,
  type TestAlternative,
  type PracticalCase,
  type InferenceCode,
} from './statisticalInferenceModels';
type Kind = Extract<Lesson['lab'], `stat-inference-${string}`>;
export const isStatisticalInferenceLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('stat-inference-');
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
                    '预测符合。请解释抽样设计、区间、事件与模型条件。',
                    'The prediction matches. Explain sampling design, intervals, events and model conditions.',
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
  '核对统计量、事件或区间及其模型条件；近似量按要求舍入。',
  'Audit the statistic, event or interval and its model conditions; round approximate quantities as requested.',
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
      headers={[t('量', 'Quantity'), t('结果与标记', 'Result and label')]}
      rows={rows.map(([p, v]) => [word(mode, p), v])}
    />
  );
}

const code = (value: InferenceCode): AnswerSpec => ({
  kind: 'inference-code',
  value,
});
function Population({ mode }: { mode: LanguageMode }) {
  const [frame, setFrame] = useState<InferenceFrame>('all'),
    [n, setN] = useState('2'),
    [index, setIndex] = useState('0'),
    size = Math.min(Number(n), frame === 'all' ? 6 : 3),
    m = finiteInference(size, frame),
    at = Math.min(Number(index), m.samples.length - 1),
    sample = m.samples[at]!;
  return (
    <>
      <Select
        mode={mode}
        name={t('抽样框', 'Sampling frame')}
        value={frame}
        options={[
          ['all', t('全体六编号', 'All six IDs')],
          ['near', t('只含A组三编号', 'Only the three A IDs')],
        ]}
        change={(v) => {
          setFrame(v as InferenceFrame);
          setIndex('0');
        }}
      />
      <Select
        mode={mode}
        name={t('每次样本量n', 'Sample size n')}
        value={String(size)}
        options={opts(frame === 'all' ? [1, 2, 3, 6] : [1, 2, 3])}
        change={(v) => {
          setN(v);
          setIndex('0');
        }}
      />
      <Select
        mode={mode}
        name={t('本次样本编号', 'Selected sample IDs')}
        value={String(at)}
        options={m.samples.map((s, i) => [
          String(i),
          t(s.ids.join(', '), s.ids.join(', ')),
        ])}
        change={setIndex}
      />
      <PopulationFigure mode={mode} m={m} index={at} />
      <Value
        mode={mode}
        id={`mu-${textR(m.populationMean)}`}
        name={t('目标总体均值', 'Target population mean')}
        value={fraction(m.populationMean)}
      />
      <Value
        mode={mode}
        id={`mean-${textR(sample.mean)}`}
        name={t('本次样本均值', 'Selected sample mean')}
        value={fraction(sample.mean)}
      />
      <Value
        mode={mode}
        id={`err-${textR(sample.error)}`}
        name={t('带符号抽样误差', 'Signed sampling error')}
        value={fraction(sample.error)}
      />
      <Audit mode={mode}>
        <Summary
          mode={mode}
          rows={[
            [
              t('本次均值 / 误差', 'Selected mean / error'),
              `${textR(sample.mean)} / ${textR(sample.error)} min`,
            ],
            [
              t('设计期望 / 偏差', 'Design expectation / bias'),
              `${textR(m.m.mean)} / ${textR(m.bias)} min`,
            ],
            [
              t('设计方差 / 均方误差', 'Design variance / MSE'),
              `${textR(m.m.variance)} / ${textR(m.mse)} min²`,
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '目标始终为六个编号，A框普查不等于目标总体普查。误差是本次结果，偏差是重复设计的期望偏移。',
              'The target stays all six IDs. An A-frame census is not a target census. Error is realised; bias concerns the design expectation.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Sampling({ mode }: { mode: LanguageMode }) {
  const [frame, setFrame] = useState<InferenceFrame>('all'),
    [n, setN] = useState('2'),
    [seed, setSeed] = useState('42'),
    [count, setCount] = useState(0),
    size = Math.min(Number(n), frame === 'all' ? 6 : 3),
    sim = finiteInferenceSimulation(size, frame, count, Number(seed)),
    m = sim.exact;
  return (
    <>
      <Select
        mode={mode}
        name={t('抽样框', 'Sampling frame')}
        value={frame}
        options={[
          ['all', t('全体六编号', 'All six IDs')],
          ['near', t('只含A组三编号', 'Only the three A IDs')],
        ]}
        change={(v) => {
          setFrame(v as InferenceFrame);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('每次样本量n', 'Sample size n')}
        value={String(size)}
        options={opts(frame === 'all' ? [1, 2, 3, 6] : [1, 2, 3])}
        change={(v) => {
          setN(v);
          setCount(0);
        }}
      />
      <MassFigure
        mode={mode}
        m={m.m}
        variable="X̄"
        name={t('样本均值的理论质量', 'Theoretical masses of sample means')}
      />
      <Value
        mode={mode}
        id={`e-${textR(m.m.mean)}`}
        name={t('预测样本均值的期望', 'Predict expected sample mean')}
        value={fraction(m.m.mean)}
      />
      <Value
        mode={mode}
        id={`v-${textR(m.m.variance)}`}
        name={t('预测样本均值的方差', 'Predict sampling variance')}
        value={fraction(m.m.variance)}
      />
      <Value
        mode={mode}
        id={`se-${textR(m.m.variance)}`}
        name={t(
          '预测标准误（支持sqrt）',
          'Predict standard error (sqrt supported)',
        )}
        value={{ kind: 'radical', value: m.m.sd }}
      />
      <Select
        mode={mode}
        name={t('伪随机种子', 'Pseudorandom seed')}
        value={seed}
        options={opts([42, 1234])}
        change={(v) => {
          setSeed(v);
          setCount(0);
        }}
      />
      <button
        className="math-button"
        disabled={count >= 500}
        onClick={() => setCount(Math.min(500, count + 10))}
      >
        <Text mode={mode} text={t('再抽10组', 'Draw ten more samples')} />
      </button>
      <button className="math-button secondary" onClick={() => setCount(0)}>
        <Text mode={mode} text={t('重置模拟次数', 'Reset repetitions')} />
      </button>
      <p role="status">
        <Text
          mode={mode}
          text={t(
            `伪随机演示：每组n=${size}，R=${count}，均值的模拟平均${sim.average ? textR(sim.average) : '未定义'}。每组内部不放回，组与组之间重置总体；R不是n。`,
            `Pseudorandom demonstration: n=${size} per sample, R=${count}, average of means ${sim.average ? textR(sim.average) : 'undefined'}. Draw without replacement within a group, resetting the population between groups. R is not n.`,
          )}
        />
      </p>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('均值', 'Mean'),
            t('理论概率', 'Theoretical mass'),
            t('模拟计数', 'Simulated count'),
            t('模拟频率', 'Simulated frequency'),
          ]}
          rows={sim.empirical.map((r) => [
            textR(r.value),
            textR(r.p),
            r.count,
            r.frequency
              ? textR(r.frequency)
              : word(mode, t('未定义', 'undefined')),
          ])}
        />
        <Summary
          mode={mode}
          rows={[
            [
              t('理论均值 / 方差 / 标准误', 'Theoretical mean / variance / SE'),
              `${textR(m.m.mean)} / ${textR(m.m.variance)} / ${m.m.sd}`,
            ],
            [
              t('目标均值 / 设计偏差', 'Target mean / design bias'),
              `${textR(m.populationMean)} / ${textR(m.bias)}`,
            ],
          ]}
        />
        <DataTable
          mode={mode}
          name={t('前10组实际抽取轨迹', 'First ten sampled ID groups')}
          headers={[
            t('组', 'Round'),
            t('不同编号', 'Distinct IDs'),
            t('均值', 'Mean'),
          ]}
          rows={sim.draws
            .slice(0, 10)
            .map((d) => [d.round, d.ids.join(', '), textR(d.mean)])}
        />
      </Audit>
    </>
  );
}
function Confidence({ mode }: { mode: LanguageMode }) {
  const [observed, setObserved] = useState('10'),
    [sigma, setSigma] = useState('4'),
    [n, setN] = useState('16'),
    [critical, setCritical] = useState('2'),
    [truth, setTruth] = useState('10'),
    [seed, setSeed] = useState('42'),
    [count, setCount] = useState(0),
    method = knownSigmaInterval(observed, sigma, Number(n), critical),
    sim = coverageSimulation(
      Number(truth),
      sigma,
      Number(n),
      critical,
      count,
      Number(seed),
    );
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '单个区间：另设iid正态、总体σ已知。给定观测均值，不使用演示真μ来算区间。',
            'One interval: use a separate iid normal model with known population σ. Build from the given observed mean, without using demonstration truth.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('给定观测均值', 'Given observed mean')}
        value={observed}
        options={opts([8, 10, 12])}
        change={setObserved}
      />
      <Select
        mode={mode}
        name={t('已知总体σ', 'Known population σ')}
        value={sigma}
        options={opts([4, 10])}
        change={(v) => {
          setSigma(v);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('样本量n', 'Sample size n')}
        value={n}
        options={opts([4, 16, 25])}
        change={(v) => {
          setN(v);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('预设临界值z*', 'Prespecified critical z*')}
        value={critical}
        options={[
          ['1', t('1：覆盖约68.27%', '1: about 68.27% coverage')],
          ['1.96', t('1.96：覆盖约95%', '1.96: about 95% coverage')],
          ['2', t('2：覆盖约95.45%', '2: about 95.45% coverage')],
        ]}
        change={(v) => {
          setCritical(v);
          setCount(0);
        }}
      />
      <Value
        mode={mode}
        id={`se-${textR(method.se)}`}
        name={t('预测标准误', 'Predict standard error')}
        value={fraction(method.se)}
      />
      <Value
        mode={mode}
        id={`ci-${method.value}`}
        name={t(
          '构造闭置信区间[a,b]',
          'Construct the closed confidence interval [a,b]',
        )}
        value={{ kind: 'real-union', value: method.value }}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '重复覆盖演示：仅为核查方法公开固定真μ，每组生成n条正态观测再求均值。',
            'Repeated coverage demonstration: fixed truth is revealed only to audit the method. Each repetition generates n normal observations before averaging.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('演示固定真μ', 'Demonstration fixed true μ')}
        value={truth}
        options={opts([10, 20])}
        change={(v) => {
          setTruth(v);
          setCount(0);
        }}
      />
      <Select
        mode={mode}
        name={t('伪随机种子', 'Pseudorandom seed')}
        value={seed}
        options={opts([42, 1234])}
        change={(v) => {
          setSeed(v);
          setCount(0);
        }}
      />
      <button
        className="math-button"
        disabled={count >= 200}
        onClick={() => setCount(Math.min(200, count + 10))}
      >
        <Text
          mode={mode}
          text={t('再构造10个区间', 'Construct ten more intervals')}
        />
      </button>
      <button className="math-button secondary" onClick={() => setCount(0)}>
        <Text mode={mode} text={t('重置重复覆盖', 'Reset repeated coverage')} />
      </button>
      <CoverageFigure mode={mode} m={sim} />
      <p role="status">
        <Text
          mode={mode}
          text={t(
            `R=${count}，覆盖${sim.hits}组，命中率${sim.frequency ? textR(sim.frequency) : '未定义'}；理论覆盖约${probability4(method.coverage)}。图示不是参数后验概率。`,
            `R=${count}, ${sim.hits} intervals cover; hit rate ${sim.frequency ? textR(sim.frequency) : 'undefined'}. Theoretical coverage≈${probability4(method.coverage)}. This is not a posterior probability for the parameter.`,
          )}
        />
      </p>
      <Audit mode={mode}>
        <Summary
          mode={mode}
          rows={[
            [
              t('SE / 误差界', 'SE / margin'),
              `${textR(method.se)} / ${textR(method.margin)}`,
            ],
            [t('给定观测区间', 'Given-observation interval'), method.value],
            [
              t('理论覆盖（近似）', 'Theoretical coverage (approximate)'),
              probability4(method.coverage),
            ],
          ]}
        />
        <DataTable
          mode={mode}
          name={t(
            '第一组原始观测（显示值近似）',
            'First raw sample (display values approximate)',
          )}
          headers={[
            t('编号', 'Observation'),
            t(
              '分钟（显示到三位小数）',
              'Minutes (displayed to three decimals)',
            ),
          ]}
          rows={(sim.intervals[0]?.observations ?? []).map((v, i) => [
            i + 1,
            v.toFixed(3),
          ])}
        />
        <DataTable
          mode={mode}
          name={t('全部重复区间核验表', 'All repeated intervals audit')}
          headers={[
            t('组', 'Round'),
            t('均值（数值近似）', 'Mean (numerical)'),
            t('下界（数值近似）', 'Lower (numerical)'),
            t('上界（数值近似）', 'Upper (numerical)'),
            t('覆盖固定μ', 'Covers fixed μ'),
          ]}
          rows={sim.intervals.map((r) => [
            r.round,
            r.mean,
            r.lower,
            r.upper,
            word(
              mode,
              r.contains ? t('覆盖', 'covers') : t('未覆盖', 'misses'),
            ),
          ])}
        />
      </Audit>
    </>
  );
}
function Test({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState('4'),
    [observed, setObserved] = useState('4'),
    [alternative, setAlternative] = useState<TestAlternative>('upper'),
    [alpha, setAlpha] = useState('1/10'),
    [validity, setValidity] = useState('planned'),
    k = Math.min(Number(observed), Number(n)),
    m = exactBinomialTest(Number(n), k, alternative, alpha);
  return (
    <>
      <Select
        mode={mode}
        name={t('分析计划', 'Analysis plan')}
        value={validity}
        options={[
          [
            'planned',
            t('固定n与事先预设方案', 'Fixed n and prespecified plan'),
          ],
          ['peek', t('一直窥看到显著就停止', 'Peek and stop when significant')],
          [
            'switch',
            t('看完结果再换尾方向', 'Choose tail after seeing results'),
          ],
        ]}
        change={setValidity}
      />
      {validity !== 'planned' ? (
        <>
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '该规则不再是原来的固定方案，不能沿用其错误率解释。须重新设计并校准程序，而不是照抄名义p阈值。',
                'This is no longer the original fixed plan. Its error-control interpretation cannot simply be retained. Redesign and calibrate the procedure instead of copying its nominal threshold.',
              )}
            />
          </p>
          <Value
            mode={mode}
            id="not-justified"
            name={t('判断程序条件', 'Assess procedure conditions')}
            value={code('not-justified')}
          />
        </>
      ) : (
        <>
          <Select
            mode={mode}
            name={t('固定试验次数n', 'Fixed trial count n')}
            value={n}
            options={opts([4, 8])}
            change={setN}
          />
          <Select
            mode={mode}
            name={t('观察成功次数', 'Observed success count')}
            value={String(k)}
            options={opts(Array.from({ length: Number(n) + 1 }, (_, i) => i))}
            change={setObserved}
          />
          <Select
            mode={mode}
            name={t('事先备择方向', 'Planned alternative')}
            value={alternative}
            options={[
              ['upper', t('上侧：成功率>1/2', 'Upper: success rate>1/2')],
              ['lower', t('下侧：成功率<1/2', 'Lower: success rate<1/2')],
              ['two-sided', t('双侧：|X−n/2|', 'Two-sided: |X−n/2|')],
            ]}
            change={(v) => setAlternative(v as TestAlternative)}
          />
          <Select
            mode={mode}
            name={t('事先α', 'Prespecified α')}
            value={alpha}
            options={opts(['1/20', '1/10', '1/5'])}
            change={setAlpha}
          />
          <p>
            <Text
              mode={mode}
              text={t(
                'H0为独立公平试验。本工作台比较不同预设计划，不是在真实分析中看结果挑尾。规则p≤α拒绝。',
                'H0 specifies independent fair trials. Compare different prespecified plans here; do not choose a real analysis tail after viewing data. Reject when p≤α.',
              )}
            />
          </p>
          <NullTailFigure mode={mode} m={m} />
          <Value
            mode={mode}
            id={`p-${textR(m.p)}`}
            name={t('预测精确p值', 'Predict exact p-value')}
            value={fraction(m.p)}
          />
          <Value
            mode={mode}
            id={`d-${m.decision}`}
            name={t(
              '判断reject或do-not-reject',
              'Decide reject or do-not-reject',
            )}
            value={code(m.decision)}
          />
          <Audit mode={mode}>
            <Summary
              mode={mode}
              rows={[
                [
                  t('至少同样极端的计数', 'At-least-as-extreme counts'),
                  m.extreme.join(', '),
                ],
                [t('精确p', 'Exact p'), textR(m.p)],
                [
                  t('拒绝域', 'Rejection set'),
                  m.critical.length
                    ? m.critical.join(', ')
                    : word(mode, t('空集', 'empty set')),
                ],
                [
                  t('H0真时实际I类错误率', 'Actual type-I rate under true H0'),
                  textR(m.falsePositive),
                ],
                [t('预设α', 'Declared α'), textR(m.alpha)],
              ]}
            />
          </Audit>
        </>
      )}
    </>
  );
}
const practicalNames: Record<PracticalCase, LocalizedText> = {
  tinyPrecise: t('微小估计、大样本', 'Tiny estimate, large sample'),
  tinyNoisy: t('微小估计、小样本', 'Tiny estimate, small sample'),
  largeNoisy: t('大估计、小样本', 'Large estimate, small sample'),
  largePrecise: t('大估计、较大样本', 'Large estimate, larger sample'),
  harmful: t('负向估计、较大样本', 'Negative estimate, larger sample'),
};
function Importance({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<PracticalCase>('tinyPrecise'),
    [threshold, setThreshold] = useState('1'),
    [all, setAll] = useState(false),
    m = practicalEvidence(kind, threshold),
    rows = all
      ? (Object.keys(practicalCases) as PracticalCase[]).map((k) =>
          practicalEvidence(k, threshold),
        )
      : [m];
  return (
    <>
      <Select
        mode={mode}
        name={t('证据情形', 'Evidence scenario')}
        value={kind}
        options={(Object.keys(practicalCases) as PracticalCase[]).map((k) => [
          k,
          practicalNames[k],
        ])}
        change={(v) => setKind(v as PracticalCase)}
      />
      <Select
        mode={mode}
        name={t(
          '事先实际改善目标Δ（分钟）',
          'Prespecified improvement target Δ (min)',
        )}
        value={threshold}
        options={opts(['1/2', '1', '3/2', '3'])}
        change={setThreshold}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `正数为节省分钟；估计${m.effect}，已知σ4，n=${m.n}，模型为iid正态。实际目标为至少${threshold}分钟。阈值比较是方案演示，不是事后挑阈值。`,
            `Positive means minutes saved. Estimate ${m.effect}, known σ4, n=${m.n}, iid normal model. Target at least ${threshold} minutes. Threshold comparisons illustrate plans, not post-hoc target selection.`,
          )}
        />
      </p>
      <button className="math-button secondary" onClick={() => setAll(!all)}>
        <Text
          mode={mode}
          text={t('切换单例/全部对照', 'Toggle single/all comparisons')}
        />
      </button>
      <EvidenceFigure mode={mode} rows={rows} />
      <Value
        mode={mode}
        id={`s-${m.decision}`}
        name={t('对零差异的检验决定', 'Test decision against zero')}
        value={code(m.decision)}
      />
      <Value
        mode={mode}
        id={`m-${m.meaning}`}
        name={t(
          '按区间比较实际目标',
          'Compare the interval with the practical target',
        )}
        value={code(m.meaning)}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('图行/情形', 'Plot row / case'),
            t('估计/分钟', 'Estimate/min'),
            t('n', 'n'),
            t('约95%区间', 'Approximate 95% interval'),
            t('双侧p近似四位', 'Two-sided p, four decimals'),
          ]}
          rows={rows.map((r, i) => [
            `${i + 1}. ${word(mode, practicalNames[r.kind])}`,
            r.effect,
            r.n,
            r.interval.value,
            probability4(r.p),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `显示p=${probability4(m.p)}为四位近似，舍入0.0000不表示真概率0。α=0.05；区间用z*=1.96，覆盖约95%。${m.harm ? '本例区间全为负，可能表明有害方向，不能叫无影响。' : ''}小p不衡量效应大小、价值或因果性；不显著也不证明无效。`,
              `Displayed p=${probability4(m.p)} is rounded; 0.0000 does not mean exact zero. α=0.05; intervals use z*=1.96 with approximately 95% coverage. ${m.harm ? 'This interval is wholly negative, potentially indicating harm rather than no effect.' : ''} A small p measures neither size, value nor causality; non-significance does not prove no effect.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function StatisticalInferenceLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'stat-inference-population' ? (
        <Population mode={mode} />
      ) : kind === 'stat-inference-sampling' ? (
        <Sampling mode={mode} />
      ) : kind === 'stat-inference-confidence' ? (
        <Confidence mode={mode} />
      ) : kind === 'stat-inference-test' ? (
        <Test mode={mode} />
      ) : (
        <Importance mode={mode} />
      )}
    </section>
  );
}
export function StatisticalInferenceHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'stat-inference-population')
    return <PopulationFigure mode={mode} m={finiteInference(2)} />;
  if (kind === 'stat-inference-sampling')
    return (
      <MassFigure
        mode={mode}
        m={finiteInference(2).m}
        variable="X̄"
        name={t('样本均值的理论质量', 'Theoretical masses of sample means')}
      />
    );
  if (kind === 'stat-inference-confidence')
    return (
      <CoverageFigure
        mode={mode}
        m={coverageSimulation(10, '4', 16, '1.96', 10, 42)}
      />
    );
  if (kind === 'stat-inference-test')
    return <NullTailFigure mode={mode} m={exactBinomialTest(4, 4)} />;
  return (
    <EvidenceFigure
      mode={mode}
      rows={['tinyPrecise', 'largeNoisy', 'largePrecise'].map((k) =>
        practicalEvidence(k as PracticalCase),
      )}
    />
  );
}
