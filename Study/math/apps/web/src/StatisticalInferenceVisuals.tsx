import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import { textR, rational } from './algebraModels';
import { probability4 } from './distributionModels';
import {
  inferencePopulation,
  inferenceNumber as num,
  type finiteInference,
  type coverageSimulation,
  type exactBinomialTest,
  type practicalEvidence,
} from './statisticalInferenceModels';
export function PopulationFigure({
  mode,
  m,
  index = 0,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof finiteInference>;
  index?: number;
}) {
  const selected = m.samples[index]!,
    name = t('六编号总体与抽样框', 'Six-ID population and sampling frame');
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        '每张卡代表一个不同编号，不因相同数值合并。紫色为本次样本，虚线为框外单位。演示公开全体真值供核验；真实研究参数通常未知。',
        'Each card is a distinct ID, even when values agree. Purple marks the selected sample; dashed cards are outside the frame. Truth is revealed for demonstration, whereas real parameters are usually unknown.',
      )}
    >
      <svg
        viewBox="0 0 640 230"
        width="640"
        role="img"
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        {inferencePopulation.map((p, j) => {
          const inside = m.frameIndices.includes(j),
            chosen = selected.indices.includes(j),
            x = 24 + j * 98;
          return (
            <g
              key={p.id}
              data-unit={p.id}
              data-selected={chosen}
              data-in-frame={inside}
            >
              <rect
                x={x}
                y="35"
                width="88"
                height="140"
                rx="10"
                fill={chosen ? '#ede7ff' : inside ? '#f9fbfc' : '#e8edf0'}
                stroke={chosen ? '#5c4e9c' : '#728a95'}
                strokeWidth={chosen ? 3 : 1}
                strokeDasharray={inside ? undefined : '5 4'}
              />
              <text x={x + 44} y="68" textAnchor="middle" fontSize="16">
                {p.id}
              </text>
              <text x={x + 44} y="114" textAnchor="middle" fontSize="25">
                {p.value}
              </text>
              <text x={x + 44} y="150" textAnchor="middle" fontSize="12">
                {mode === 'en'
                  ? chosen
                    ? 'selected'
                    : inside
                      ? 'in frame'
                      : 'excluded'
                  : chosen
                    ? '已选'
                    : inside
                      ? '框内'
                      : '框外'}
              </text>
            </g>
          );
        })}
        <text x="24" y="208" fontSize="13">
          {mode === 'en' ? 'Recorded value (min)' : '观测值（分钟）'}
        </text>
      </svg>
    </DataFigure>
  );
}
export function CoverageFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof coverageSimulation>;
}) {
  const rows = m.intervals.slice(0, 12),
    xs = [m.truth - 2, m.truth + 2, ...rows.flatMap((r) => [r.lower, r.upper])],
    lo = 2 * Math.floor(Math.min(...xs) / 2) - 2,
    hi = 2 * Math.ceil(Math.max(...xs) / 2) + 2,
    px = (x: number) => 60 + ((x - lo) / (hi - lo)) * 540,
    name = t(
      '重复区间覆盖固定参数',
      'Repeated intervals covering a fixed parameter',
    );
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        `n=${m.method.n}，已知σ=${textR(m.method.sigma)}，z*=${num(m.method.critical)}，理论覆盖约${probability4(m.method.coverage)}。蓝色竖线为固定真均值；每条水平线来自一组新iid正态观测。实线覆盖、虚线未覆盖。横轴按当前范围调整，跨图比较请读取分钟刻度。仅画前12组，覆盖计数使用所有R组；有限命中率不强制等于理论值，零组时未定义。`,
        `n=${m.method.n}, known σ=${textR(m.method.sigma)}, z*=${num(m.method.critical)}, theoretical coverage≈${probability4(m.method.coverage)}. The blue vertical line is fixed truth. Each horizontal interval uses a new iid normal sample. Solid lines cover; dashed lines miss. The axis fits the current range; compare minute tick values across plots. Only the first twelve are drawn; coverage counts all R groups. Finite hit rates are not forced to theory and are undefined at zero repetitions.`,
      )}
    >
      <svg
        viewBox="0 0 640 360"
        width="640"
        role="img"
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const x = lo + ((hi - lo) * i) / 4;
          return (
            <g key={i}>
              <line x1={px(x)} x2={px(x)} y1="40" y2="286" stroke="#dbe5ea" />
              <text x={px(x)} y="310" textAnchor="middle" fontSize="12">
                {x}
              </text>
            </g>
          );
        })}
        <line
          x1={px(m.truth)}
          x2={px(m.truth)}
          y1="40"
          y2="286"
          stroke="#3578a5"
          strokeWidth="2"
        />
        <text
          x="60"
          y="25"
          fill="#3578a5"
          fontSize="13"
        >{`${mode === 'en' ? 'fixed μ' : '固定μ'}=${m.truth}`}</text>
        {rows.length === 0 && (
          <text x="320" y="160" textAnchor="middle" fontSize="15">
            {mode === 'en' ? 'No simulated intervals yet' : '尚无模拟区间'}
          </text>
        )}
        {rows.map((r, i) => {
          const y = 54 + i * 19;
          return (
            <g
              key={r.round}
              data-interval-round={r.round}
              data-contains={r.contains}
              data-lower={r.lower}
              data-upper={r.upper}
            >
              <title>{`${r.round}: [${r.lower},${r.upper}]`}</title>
              <text x="42" y={y + 4} textAnchor="end" fontSize="12">
                {r.round}
              </text>
              <line
                x1={px(r.lower)}
                x2={px(r.upper)}
                y1={y}
                y2={y}
                stroke={r.contains ? '#26887c' : '#c07642'}
                strokeWidth="3"
                strokeDasharray={r.contains ? undefined : '5 4'}
              />
              <circle cx={px(r.mean)} cy={y} r="3" fill="#5c4e9c" />
            </g>
          );
        })}
        <text x="600" y="342" textAnchor="end" fontSize="13">
          {mode === 'en' ? 'Mean interval (min)' : '均值区间（分钟）'}
        </text>
      </svg>
    </DataFigure>
  );
}
export function NullTailFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof exactBinomialTest>;
}) {
  const px = (k: number) => 60 + ((k + 1) / (m.n + 2)) * 540,
    py = (p: number) => 310 - 240 * p,
    name = t('零假设下的极端结果', 'Extreme outcomes under the null');
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        '每柱高度是公平H0下该次数的概率质量。橙柱表示所选预设统计量下至少同样极端（包含观察值）；黑点为观察值，红边标预设α下的拒绝域。颜色不表示H0为真的概率。',
        'Bar height is null probability mass under fairness. Orange marks outcomes at least as extreme for the planned statistic, including the observation. A black dot marks the observed count; red outlines mark the rejection set at the declared α. Colours do not give the probability that H0 is true.',
      )}
    >
      <svg
        viewBox="0 0 640 380"
        width="640"
        role="img"
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line
              x1="60"
              x2="600"
              y1={py(i / 4)}
              y2={py(i / 4)}
              stroke="#dbe5ea"
            />
            <text x="48" y={py(i / 4) + 4} textAnchor="end" fontSize="12">
              {textR(rational(BigInt(i), 4n))}
            </text>
          </g>
        ))}
        {m.m.rows.map((r, k) => (
          <g
            key={k}
            data-null-count={k}
            data-extreme={m.extreme.includes(k)}
            data-reject={m.critical.includes(k)}
          >
            <rect
              x={px(k) - 12}
              y={py(num(r.p))}
              width="24"
              height={240 * num(r.p)}
              fill={m.extreme.includes(k) ? '#dd995e' : '#8d80b4'}
              stroke={m.critical.includes(k) ? '#af4053' : 'none'}
              strokeWidth="3"
            />
            {k === m.observed && (
              <circle cx={px(k)} cy={py(num(r.p))} r="4" fill="#263c4c" />
            )}
            <text x={px(k)} y="334" textAnchor="middle" fontSize="12">
              {k}
            </text>
          </g>
        ))}
        <text x="60" y="36" fontSize="14">
          P_H0(X=k)
        </text>
        <text
          x="600"
          y="36"
          textAnchor="end"
          fontSize="13"
        >{`${mode === 'en' ? 'observed k' : '观察k'}=${m.observed}`}</text>
        <text x="600" y="365" textAnchor="end" fontSize="13">
          k
        </text>
      </svg>
    </DataFigure>
  );
}
export function EvidenceFigure({
  mode,
  rows,
}: {
  mode: LanguageMode;
  rows: ReturnType<typeof practicalEvidence>[];
}) {
  const px = (x: number) => 60 + ((x + 6) / 14) * 540,
    delta = num(rows[0]!.threshold),
    name = t('效应区间与实际目标', 'Effect intervals and the practical target');
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        `${rows.map((r, i) => `第${i + 1}行：估计${r.effect}分钟，n=${r.n}`).join('；')}。横轴为平均改善分钟，负向可能有害。蓝线0对应无差异，绿线为事先目标Δ；点是估计、水平线为已知σ正态方法的约95%区间（z*=1.96）。统计显著性针对0，目标比较针对Δ；区间位置不赋固定参数后验概率。`,
        `${rows.map((r, i) => `Row ${i + 1}: estimate ${r.effect} min, n=${r.n}`).join('; ')}. Horizontal values are mean improvement in minutes; negatives may indicate harm. Blue marks zero and green the prespecified target Δ. Dots are estimates and lines approximate 95% known-σ normal intervals using z*=1.96. Significance concerns zero; the practical comparison concerns Δ. Interval position does not assign a posterior probability to a fixed parameter.`,
      )}
    >
      <svg
        viewBox="0 0 640 360"
        width="640"
        role="img"
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const x = -6 + (14 * i) / 4;
          return (
            <g key={i}>
              <line x1={px(x)} x2={px(x)} y1="55" y2="285" stroke="#dbe5ea" />
              <text x={px(x)} y="309" textAnchor="middle" fontSize="12">
                {x}
              </text>
            </g>
          );
        })}
        <line x1={px(0)} x2={px(0)} y1="55" y2="285" stroke="#3578a5" />
        <line
          x1={px(delta)}
          x2={px(delta)}
          y1="55"
          y2="285"
          stroke="#26887c"
          strokeWidth="2"
        />
        <text x={px(0)} y="43" textAnchor="middle" fontSize="12">
          0
        </text>
        <text
          x={px(delta)}
          y="27"
          textAnchor="middle"
          fontSize="12"
        >{`Δ=${textR(rows[0]!.threshold)}`}</text>
        {rows.map((r, i) => {
          const y = 84 + i * 40;
          return (
            <g key={r.kind} data-evidence-case={r.kind}>
              <text x="42" y={y + 4} textAnchor="end" fontSize="12">
                {i + 1}
              </text>
              <line
                x1={px(num(r.interval.lower))}
                x2={px(num(r.interval.upper))}
                y1={y}
                y2={y}
                stroke={
                  r.meaning === 'meets-target'
                    ? '#26887c'
                    : r.meaning === 'below-target'
                      ? '#c07642'
                      : '#5c4e9c'
                }
                strokeWidth="4"
              />
              <circle
                cx={px(num(r.interval.mean))}
                cy={y}
                r="5"
                fill="#263c4c"
              />
              <title>{`${r.kind}: ${r.interval.value}`}</title>
            </g>
          );
        })}
        <text x="600" y="342" textAnchor="end" fontSize="13">
          {mode === 'en' ? 'Mean improvement (min)' : '平均改善（分钟）'}
        </text>
      </svg>
    </DataFigure>
  );
}
