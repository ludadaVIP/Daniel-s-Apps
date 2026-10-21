import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import {
  StatisticsScatter,
  SamplingFigure,
  ResponseFigure,
} from './StatisticsVisuals';
import { textR } from './algebraModels';
import { subData } from './dataModellingModels';
import {
  correlationModel,
  statisticsCases,
  transformPairs,
  regressionAudit,
  samplingSimulation,
  responseBounds,
  type StatisticsCase,
  type SamplingDesign,
} from './statisticsModels';
type Kind = Extract<Lesson['lab'], `stats-${string}`>;
export const isStatisticsLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('stats-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const numeric = (value: string): AnswerSpec => ({ kind: 'number', value });
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
const opts = (values: string[]): [string, LocalizedText][] =>
  values.map((v) => [v, t(v, v)]);
const labels: Record<StatisticsCase, LocalizedText> = {
  noisy: t('三对配对记录', 'Three paired records'),
  perfect: t('成对上升记录', 'Rising pairs'),
  negative: t('成对下降记录', 'Falling pairs'),
  curve: t('对称弯曲记录', 'Symmetric curved pairs'),
  flat: t('y列不变', 'Unchanged y column'),
  vertical: t('x列不变', 'Unchanged x column'),
  influence: t('保留第五条记录', 'Retain the fifth observation'),
  fan: t('三组配对记录', 'Three groups of pairs'),
};
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
                    '预测符合。请用精确表、设计和适用范围解释；有限图形或一次模拟不是证明。',
                    'The prediction matches. Justify with exact tables, design and scope; a picture or one simulation is not a proof.',
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
const correlationHint = t(
  '先求中心化交积和，再除两列平方和乘积的平方根；常数列填undefined，不能填0。',
  'Divide centred cross-products by the square root of both square sums. Enter undefined for a constant column, not zero.',
);
function Correlation({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<StatisticsCase>('noisy'),
    [conversion, setConversion] = useState('identity'),
    [omit, setOmit] = useState(false),
    base = statisticsCases[kind],
    used = kind === 'influence' && omit ? base.slice(0, 4) : base,
    rows =
      conversion === 'identity'
        ? used
        : conversion === 'units'
          ? transformPairs(used, '2', '0', '1', '0')
          : transformPairs(used, '1', '0', '-1', '6'),
    m = correlationModel(rows),
    answer: AnswerSpec = m.defined
      ? { kind: 'radical', value: m.text }
      : { kind: 'data-code', value: 'undefined' },
    squared = m.squared
      ? numeric(textR(m.squared))
      : { kind: 'data-code' as const, value: 'undefined' as const };
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={t(
            'r描述这些配对的线性方向与强度，不是斜率、因果或总体参数。保留ID；单位转换只改数值表示，不能拆散配对。',
            'Correlation describes sample linear direction and strength, not slope, causation or a population parameter. Preserve IDs; unit conversion must not break pairs.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('配对数据', 'Paired data')}
        value={kind}
        options={(
          [
            'noisy',
            'perfect',
            'negative',
            'curve',
            'flat',
            'vertical',
            'influence',
          ] as StatisticsCase[]
        ).map((v) => [v, labels[v]])}
        change={(v) => {
          setKind(v as StatisticsCase);
          setOmit(false);
        }}
      />
      <Select
        mode={mode}
        name={t('数值转换', 'Numerical conversion')}
        value={conversion}
        options={[
          ['identity', t('原始值', 'Original values')],
          [
            'units',
            t('x变为2x：正向单位转换', 'x becomes 2x: positive unit change'),
          ],
          ['reflect', t('y变为6−y：反向变换', 'y becomes 6−y: reflection')],
        ]}
        change={setConversion}
      />
      {kind === 'influence' && (
        <button
          className="math-button secondary"
          aria-pressed={omit}
          onClick={() => setOmit(!omit)}
        >
          <Text
            mode={mode}
            text={t(
              '比较保留/暂时排除第五点（不判定它错误）',
              'Compare with/without point five (not a claim of error)',
            )}
          />
        </button>
      )}
      <Predict
        key={`r-${m.text}`}
        mode={mode}
        name={t('预测相关系数r', 'Predict correlation r')}
        answer={answer}
        hint={correlationHint}
      />
      <Predict
        key={`r2-${m.squared ? textR(m.squared) : 'undefined'}`}
        mode={mode}
        name={t('预测r²', 'Predict r squared')}
        answer={squared}
        hint={t(
          '先判r是否有定义，再平方；r²失去方向。',
          'First check whether r is defined, then square; r² loses direction.',
        )}
      />
      <StatisticsScatter mode={mode} rows={rows} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('配对中心化核验', 'Centred-pair audit')}
          headers={[
            t('ID', 'ID'),
            t('x', 'x'),
            t('y', 'y'),
            t('x−x̄', 'x−x̄'),
            t('y−ȳ', 'y−ȳ'),
          ]}
          rows={m.fit.rows.map((r) => [
            r.id,
            r.x,
            r.y,
            textR(subData(r.px, m.fit.mx)),
            textR(subData(r.py, m.fit.my)),
          ])}
        />
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确结果', 'Exact result')]}
          rows={[
            ['Sxx', textR(m.fit.sxx)],
            ['Syy', textR(m.syy)],
            ['Sxy', textR(m.fit.sxy)],
            ['r', m.text],
            ['r²', m.squared ? textR(m.squared) : 'undefined'],
            ['b', m.fit.slope ? textR(m.fit.slope) : 'not-identified'],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              'r=Sxy/√(SxxSyy)。两列任一无变异时r未定义；U形可r=0。移除点只是敏感性对比，是否更正/排除必须另查来源，不能为了更大r删点。',
              'r=Sxy/√(SxxSyy). A constant column makes r undefined; a U shape can give zero. Omitting a point here is a sensitivity comparison; any actual correction or exclusion needs source evidence, not a wish for larger r.',
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
function Fit({
  mode,
  residual = false,
}: {
  mode: LanguageMode;
  residual?: boolean;
}) {
  const [kind, setKind] = useState<StatisticsCase>(
      residual ? 'curve' : 'noisy',
    ),
    [a, setA] = useState('1'),
    [b, setB] = useState('1/2'),
    [point, setPoint] = useState('0'),
    [showResidual, setShowResidual] = useState(true),
    [plot, setPlot] = useState(true),
    rows = statisticsCases[kind],
    best = correlationModel(rows).fit,
    aa = residual && best.intercept ? textR(best.intercept) : a,
    bb = residual && best.slope ? textR(best.slope) : b,
    m = regressionAudit(rows, aa, bb),
    index = Math.min(Number(point), rows.length - 1),
    r = m.candidate.rows[index]!;
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={
            residual
              ? t(
                  '本页使用含截距OLS；即使残差平均为0，也要检查弯曲与变化散布。切换图形只换表示，保留计算答案。',
                  'This page uses intercept OLS. Zero mean residual still requires inspection of curvature and spread. Changing representation preserves answers.',
                )
              : t(
                  '候选目标为Σ(y−a−bx)²，残差沿竖直方向。菜单比较只是探索，下面的非负平方恒等式才核验所有实参数。',
                  'The candidate objective is Σ(y−a−bx)² using vertical residuals. Menu comparisons explore; the nonnegative-square identity below audits every real parameter.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('拟合数据', 'Fitting data')}
        value={kind}
        options={(residual
          ? (['curve', 'fan', 'noisy'] as StatisticsCase[])
          : (['noisy', 'perfect', 'flat', 'vertical'] as StatisticsCase[])
        ).map((v) => [v, labels[v]])}
        change={(v) => {
          setKind(v as StatisticsCase);
          setPoint('0');
        }}
      />
      {residual ? (
        <Select
          mode={mode}
          name={t('观察记录', 'Observed record')}
          value={String(index)}
          options={rows.map((r, i) => [String(i), t(r.id, r.id)])}
          change={setPoint}
        />
      ) : (
        <>
          <Select
            mode={mode}
            name={t('候选截距a', 'Candidate intercept a')}
            value={a}
            options={opts(['0', '1', '2'])}
            change={setA}
          />
          <Select
            mode={mode}
            name={t('候选斜率b', 'Candidate slope b')}
            value={b}
            options={opts(['0', '1/2', '1', '2'])}
            change={setB}
          />
        </>
      )}
      {residual ? (
        <>
          <Predict
            key={`res-${textR(r.residual)}`}
            mode={mode}
            name={t('预测该点有符号残差', 'Predict selected signed residual')}
            answer={numeric(textR(r.residual))}
            hint={t(
              '同一x处e=y−ŷ，不是ŷ−y。',
              'At the same x, e=y−ŷ rather than ŷ−y.',
            )}
          />
          <Predict
            key={`sum-${textR(m.sumResidual)}`}
            mode={mode}
            name={t('预测残差代数和', 'Predict signed residual sum')}
            answer={numeric(textR(m.sumResidual))}
            hint={t(
              '含截距OLS残差和0，但这不代表没有形状或误差。',
              'Intercept OLS has residual sum zero; this does not remove patterns or errors.',
            )}
          />
          <button
            className="math-button secondary"
            onClick={() => setPlot(!plot)}
          >
            <Text
              mode={mode}
              text={t('切换原散点/残差图', 'Switch scatter / residual plot')}
            />
          </button>
        </>
      ) : (
        <>
          <Predict
            key={`sse-${textR(m.candidate.sse)}`}
            mode={mode}
            name={t('预测候选SSE', 'Predict candidate SSE')}
            answer={numeric(textR(m.candidate.sse))}
            hint={t(
              '逐点计算(y−ŷ)²再相加。',
              'Calculate each (y−ŷ)², then add.',
            )}
          />
          <Predict
            key={`slope-${best.slope ? textR(best.slope) : 'not-identified'}`}
            mode={mode}
            name={t('预测最优斜率', 'Predict optimal slope')}
            answer={
              best.slope
                ? numeric(textR(best.slope))
                : { kind: 'data-code', value: 'not-identified' }
            }
            hint={t(
              'b*=Sxy/Sxx；Sxx=0时填not-identified，而不是强制斜率0。',
              'Use b*=Sxy/Sxx. For Sxx=0 enter not-identified, not an arbitrarily forced zero.',
            )}
          />
          <button
            className="math-button secondary"
            aria-pressed={showResidual}
            onClick={() => setShowResidual(!showResidual)}
          >
            <Text
              mode={mode}
              text={t('显示/隐藏竖直残差', 'Show/hide vertical residuals')}
            />
          </button>
        </>
      )}
      <StatisticsScatter
        mode={mode}
        rows={rows}
        intercept={aa}
        slope={bb}
        line
        residuals={showResidual}
        residualPlot={residual && plot}
      />
      <p>
        ŷ = {aa} + ({bb})x
      </p>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('逐点残差核验', 'Per-point residual audit')}
          headers={[
            t('ID', 'ID'),
            t('x', 'x'),
            t('y', 'y'),
            t('ŷ', 'ŷ'),
            t('e=y−ŷ', 'e=y−ŷ'),
            t('e²', 'e²'),
          ]}
          rows={m.candidate.rows.map((r) => [
            r.id,
            r.x,
            r.y,
            textR(r.predicted),
            textR(r.residual),
            textR(r.square),
          ])}
        />
        <DataTable
          mode={mode}
          headers={[t('核验量', 'Audit quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['Σe', textR(m.sumResidual)],
            ['Σxe', textR(m.sumXResidual)],
            ['SSE', textR(m.candidate.sse)],
            ['SSEmin', textR(best.sse)],
            ['n(a+bx̄−ȳ)²', textR(m.levelCost)],
            ['Sxx(b−b*)²', textR(m.slopeCost)],
            ['SSE−SSEmin', textR(m.gap)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={
              residual
                ? t(
                    'U形残差两端正、中间负，提示遗漏曲线；扇形提示检查变化散布。均值0不是充分诊断，没有明显图案也不能证明误差条件成立。',
                    'U-shaped residuals have positive ends and negative middle, suggesting missed curvature. A fan prompts checks of changing spread. Mean zero is insufficient, and no obvious pattern does not prove error assumptions.',
                  )
                : t(
                    'SSE=SSEmin+n(a+bx̄−ȳ)²+Sxx(b−b*)²。Sxx>0时两个非负项同时为0唯一确定含截距最优线；Sxx=0时仅确定a+bx̄=ȳ，无唯一斜率。',
                    'SSE=SSEmin+n(a+bx̄−ȳ)²+Sxx(b−b*)². If Sxx>0, both nonnegative terms vanish only at the unique intercept-OLS line. If Sxx=0, only a+bx̄=ȳ is identified; slope is not unique.',
                  )
            }
          />
        </p>
      </Audit>
    </section>
  );
}
function Sampling({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState('2'),
    [repetitions, setRepetitions] = useState('48'),
    [seed, setSeed] = useState('7'),
    [design, setDesign] = useState<SamplingDesign>('srs'),
    m = samplingSimulation(
      Number(n),
      Number(repetitions),
      Number(seed),
      design,
    ),
    d = m.exact;
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={t(
            '有限总体A=0、B=0、C=4、D=4，四个身份不能合并。每轮内部不放回，下轮恢复总体；固定32位种子生成可重现伪随机模拟，精确枚举不依赖种子。',
            'The finite population is A=0, B=0, C=4, D=4, with four distinct identities. Sample without replacement within each round and restore the population between rounds. A fixed 32-bit seed gives reproducible pseudorandom simulation; exact enumeration does not depend on the seed.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('每轮样本量n', 'Sample size per round n')}
        value={n}
        options={opts(['1', '2', '3', '4'])}
        change={setN}
      />
      <Select
        mode={mode}
        name={t('重复轮数', 'Repetitions')}
        value={repetitions}
        options={opts(['12', '48', '192'])}
        change={setRepetitions}
      />
      <Select
        mode={mode}
        name={t('随机种子', 'Random seed')}
        value={seed}
        options={opts(['1', '7', '31'])}
        change={setSeed}
      />
      <Select
        mode={mode}
        name={t('选择设计', 'Selection design')}
        value={design}
        options={[
          [
            'srs',
            t('所有n元子集等可能', 'All n-member subsets equally likely'),
          ],
          ['convenience', t('固定前n个身份', 'Always the first n identities')],
        ]}
        change={(v) => setDesign(v as SamplingDesign)}
      />
      <Predict
        key="population-mean"
        mode={mode}
        name={t('预测总体均值', 'Predict population mean')}
        answer={numeric('2')}
        hint={t(
          '四成员值0,0,4,4合计8，除4。',
          'The four values sum to eight; divide by four.',
        )}
      />
      <Predict
        key={`variance-${textR(d.variance)}`}
        mode={mode}
        name={t('预测精确抽样方差', 'Predict exact sampling variance')}
        answer={numeric(textR(d.variance))}
        hint={t(
          '按当前设计所有可能样本的均值分布计算总体方差；分母是可能样本数，不用减1。',
          'Compute variance across all sample means under this design, dividing by the number of possible samples without subtracting one.',
        )}
      />
      <Predict
        key={`last-${textR(m.last.mean)}`}
        mode={mode}
        name={t('预测本轮最后样本均值', 'Predict latest sample mean')}
        answer={numeric(textR(m.last.mean))}
        hint={t(
          `最后样本身份${m.last.ids.join(',')}，按成员值平均。`,
          `The latest identities are ${m.last.ids.join(',')}; average their values.`,
        )}
      />
      <SamplingFigure mode={mode} simulation={m} />
      <p>
        <Text
          mode={mode}
          text={t(
            `当前最后样本：${m.last.ids.join(', ')}；完成${repetitions}轮，每轮n=${n}。`,
            `Latest sample: ${m.last.ids.join(', ')}; ${repetitions} rounds with n=${n} per round.`,
          )}
        />
      </p>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('全部可能样本', 'Every possible sample')}
          headers={[t('样本身份', 'Sample IDs'), t('均值', 'Mean')]}
          rows={d.samples.map((s) => [s.ids.join(', '), textR(s.mean)])}
        />
        <DataTable
          mode={mode}
          name={t('理论与经验分开', 'Theory and empirical results')}
          headers={[
            t('均值', 'Mean'),
            t('精确概率', 'Exact probability'),
            t('模拟次数', 'Simulated count'),
            t('经验频率', 'Frequency'),
          ]}
          rows={m.empirical.map((r) => [
            r.value,
            textR(r.probability),
            r.observed,
            textR(r.frequency),
          ])}
        />
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['E(sample mean)', textR(d.mean)],
            ['Var(sample mean)', textR(d.variance)],
            ['bias', textR(d.bias)],
            [
              word(mode, t('本次模拟平均', 'Average of this simulation')),
              textR(m.average),
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '简单随机n=1,2,3,4的方差依次4、4/3、4/9、0；这是有限总体不放回结果，不能直接套独立有放回的σ²/n。固定选A、B时方差0却偏差−2。更多重复不改变设计偏差，也不是逐次更接近的保证。',
              'For simple random n=1,2,3,4, variances are 4,4/3,4/9,0. These are finite-population results without replacement, not the independent with-replacement σ²/n formula. Always selecting A,B gives variance zero but bias−2. More repetitions neither remove design bias nor guarantee a closer run.',
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
const designNotes = [
  t(
    '独立设计卡：自愿回应只能直接描述回应者；选择机制和未回应可能有偏差，扩大相同便利渠道不保证修复。',
    'Independent design card: voluntary response directly describes respondents. Selection and nonresponse may bias it; enlarging the same convenience channel is no guaranteed repair.',
  ),
  t(
    '独立设计卡：恰当随机抽样且完整回应可支持带不确定性的总体估计；一次样本比例仍不是总体真值，观察性相关仍非因果。',
    'Independent design card: proper random sampling with complete response supports population estimation with uncertainty. A realised proportion is not population truth, and observational correlation remains noncausal.',
  ),
  t(
    '独立设计卡：志愿者随机分配处理，在依从、无干扰、可靠测量等条件下支持参与者效果比较；不自动代表全体。只给总计结果还不足以计算组间效果，需各组信息。',
    'Independent design card: random treatment assignment among volunteers supports participant comparisons under adherence, no interference and reliable measurement, without automatic generalisation. Aggregate totals alone cannot calculate a treatment contrast; group data are needed.',
  ),
];
function Limits({ mode }: { mode: LanguageMode }) {
  const [observed, setObserved] = useState('20'),
    [card, setCard] = useState('0'),
    n = Number(observed),
    m = responseBounds(200, n, (3 * n) / 4);
  return (
    <section className="math-concept-lab">
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构200名不同成员，各有固定是/否结果；已知部分成员结果，其余未知。下面是逻辑极端界，不是置信区间，也不假定未知者随机缺失。',
            'Two hundred fictional distinct members have fixed binary outcomes. Some are known and others unknown. The extreme bounds are logical, not confidence intervals, with no assumption of random missingness.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('已知结果人数', 'Members with known outcomes')}
        value={observed}
        options={opts(['20', '40', '200'])}
        change={setObserved}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `已知${n}人中${m.yes}是、${n - m.yes}否，其余${m.missing}未知。`,
            `Among ${n} known outcomes, ${m.yes} are yes and ${n - m.yes} no; ${m.missing} remain unknown.`,
          )}
        />
      </p>
      <Predict
        key={`rate-${textR(m.sampleRate)}`}
        mode={mode}
        name={t('预测已观察的是比例', 'Predict observed yes proportion')}
        answer={numeric(textR(m.sampleRate))}
        hint={t(
          '分母只取有明确结果的人数。',
          'Use the number of known outcomes as denominator.',
        )}
      />
      <Predict
        key={`lower-${textR(m.lower)}`}
        mode={mode}
        name={t('预测总体比例最小值', 'Predict minimum population proportion')}
        answer={numeric(textR(m.lower))}
        hint={t(
          '把未知全部设否；已知是人数除200。',
          'Set all unknowns to no; divide known yes by 200.',
        )}
      />
      <Predict
        key={`upper-${textR(m.upper)}`}
        mode={mode}
        name={t('预测总体比例最大值', 'Predict maximum population proportion')}
        answer={numeric(textR(m.upper))}
        hint={t(
          '把未知全部设是；已知是加未知人数，再除200。',
          'Set all unknowns to yes; divide known yes plus unknowns by 200.',
        )}
      />
      <ResponseFigure mode={mode} bounds={m} />
      <Select
        mode={mode}
        name={t(
          '独立研究设计卡（不改变上方资料）',
          'Independent design card (does not alter data above)',
        )}
        value={card}
        options={[
          ['0', t('自愿回应', 'Voluntary response')],
          ['1', t('完整随机样本', 'Complete random sample')],
          [
            '2',
            t(
              '志愿者随机分配处理',
              'Random treatment assignment among volunteers',
            ),
          ],
        ]}
        change={setCard}
      />
      <p>
        <Text mode={mode} text={designNotes[Number(card)]!} />
      </p>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('结论', 'Conclusion'), t('数值或界', 'Value or bound')]}
          rows={[
            [
              word(mode, t('已观察比例', 'Observed proportion')),
              textR(m.sampleRate),
            ],
            [
              word(mode, t('总体逻辑下界', 'Logical population lower bound')),
              textR(m.lower),
            ],
            [
              word(mode, t('总体逻辑上界', 'Logical population upper bound')),
              textR(m.upper),
            ],
            [word(mode, t('未知人数', 'Unknown count')), m.missing],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '本页界只利用已知二元结果与总人数；不能把区间宽度解读成某个置信水平。随机抽样用于推广，随机分配用于处理比较；高r、小训练SSE都不能替代这些设计条件或担保外推。',
              'These bounds use only known binary outcomes and population size; their width has no confidence level attached. Sampling supports generalisation and assignment supports treatment comparison. High r or small training SSE cannot replace design conditions or guarantee extrapolation.',
            )}
          />
        </p>
      </Audit>
    </section>
  );
}
export function StatisticsLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'stats-correlation') return <Correlation mode={mode} />;
  if (kind === 'stats-least-squares' || kind === 'stats-residuals')
    return <Fit key={kind} mode={mode} residual={kind === 'stats-residuals'} />;
  if (kind === 'stats-sampling') return <Sampling mode={mode} />;
  return <Limits mode={mode} />;
}
export function StatisticsHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'stats-sampling')
    return (
      <SamplingFigure mode={mode} simulation={samplingSimulation(2, 48, 7)} />
    );
  if (kind === 'stats-limits')
    return <ResponseFigure mode={mode} bounds={responseBounds(200, 20, 15)} />;
  if (kind === 'stats-residuals')
    return (
      <StatisticsScatter
        mode={mode}
        rows={statisticsCases.curve}
        intercept="2"
        slope="0"
        residualPlot
      />
    );
  return (
    <StatisticsScatter
      mode={mode}
      rows={statisticsCases.noisy}
      intercept="1"
      slope="1/2"
      line={kind === 'stats-least-squares'}
      residuals={kind === 'stats-least-squares'}
    />
  );
}
