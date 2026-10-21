import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import {
  dataValue,
  dataNumber,
  candidateFit,
  type DataPair,
} from './dataModellingModels';
import { textR } from './algebraModels';
import type { samplingSimulation, responseBounds } from './statisticsModels';
export function StatisticsScatter({
  mode,
  rows,
  intercept = '0',
  slope = '0',
  line = false,
  residuals = false,
  residualPlot = false,
}: {
  mode: LanguageMode;
  rows: DataPair[];
  intercept?: string;
  slope?: string;
  line?: boolean;
  residuals?: boolean;
  residualPlot?: boolean;
}) {
  const clip = useId().replace(/:/g, ''),
    fit = candidateFit(rows, intercept, slope),
    bound = Math.max(
      6,
      Math.ceil(Math.max(...rows.map((r) => dataNumber(dataValue(r.x)))) / 2) *
        2,
    ),
    x = (v: number) => 70 + (480 * v) / bound,
    y = (v: number) => (residualPlot ? 200 - 30 * v : 304 - 22 * v),
    ticks = residualPlot ? [-4, -2, 0, 2, 4] : [-2, 0, 4, 8, 12];
  return (
    <DataFigure
      mode={mode}
      name={
        residualPlot
          ? t('有符号残差图', 'Signed residual plot')
          : t('保留身份的配对散点图', 'Paired scatterplot with identities')
      }
      caption={
        residualPlot
          ? t(
              '横坐标保留原x，纵坐标为y−ŷ，蓝色水平线为0。弯曲或变散布是诊断线索；小样本图形不能证明误差独立、正态或恒方差。',
              'Keep original x; the vertical coordinate is y−ŷ, with blue zero line. Curvature or changing spread offers diagnostic clues; a small plot cannot prove independent, normal or constant-variance errors.',
            )
          : !line
            ? t(
                '每个散点保留同一对象的配对。正向单位转换可改变坐标刻度，但不改变r；散点形状与研究设计仍需独立检查。',
                'Each point preserves its pair identity. Positive unit changes can alter axis scales while preserving r; inspect shape and study design separately.',
              )
            : t(
                '每个点保留同一对象的配对；紫线是当前候选预测，橙段是同一x处竖直残差，不是最短距离。坐标按真实数值绘制，显示不改变数据；仅观察图形不能证明全局最优或因果。',
                'Each point retains its pair identity. Purple is the current candidate and orange segments are vertical residuals at the same x, not shortest distances. Coordinates retain actual values; a picture alone proves neither global optimality nor causation.',
              )
      }
    >
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label={
          mode === 'en'
            ? residualPlot
              ? 'Residuals against original x'
              : 'Paired observations and optional prediction line'
            : residualPlot
              ? '残差对原x'
              : '配对观测及可选预测线'
        }
      >
        <defs>
          <clipPath id={clip}>
            <rect x="58" y="35" width="510" height="320" />
          </clipPath>
        </defs>
        {Array.from(
          { length: bound / (bound > 6 ? 2 : 1) + 1 },
          (_, i) => i * (bound > 6 ? 2 : 1),
        ).map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1="40" y2="350" stroke="#e1dce7" />
            <text x={x(v)} y="376" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        {ticks.map((v) => (
          <g key={v}>
            <line
              x1="60"
              x2="565"
              y1={y(v)}
              y2={y(v)}
              stroke={v === 0 ? '#4787a8' : '#e1dce7'}
              strokeWidth={v === 0 ? 2 : 1}
            />
            <text x="48" y={y(v) + 5} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <g clipPath={`url(#${clip})`}>
          {line && !residualPlot && (
            <path
              data-stat-line="candidate"
              d={`M${x(0)} ${y(dataNumber(dataValue(intercept)))}L${x(bound)} ${y(dataNumber(dataValue(intercept)) + bound * dataNumber(dataValue(slope)))}`}
              stroke="#6652a1"
              strokeWidth="3"
              fill="none"
            />
          )}
          {fit.rows.map((r) => (
            <g key={r.id}>
              {residuals && !residualPlot && (
                <line
                  data-stat-residual={r.id}
                  data-value={textR(r.residual)}
                  x1={x(dataNumber(r.px))}
                  x2={x(dataNumber(r.px))}
                  y1={y(dataNumber(r.py))}
                  y2={y(dataNumber(r.predicted))}
                  stroke="#bd8029"
                  strokeWidth="3"
                />
              )}
              <circle
                data-stat-point={r.id}
                data-coordinate={`${textR(r.px)},${textR(residualPlot ? r.residual : r.py)}`}
                cx={x(dataNumber(r.px))}
                cy={y(dataNumber(residualPlot ? r.residual : r.py))}
                r="6"
                fill="#493b72"
              />
              <text
                x={x(dataNumber(r.px)) + (dataNumber(r.px) >= bound ? -8 : 8)}
                textAnchor={dataNumber(r.px) >= bound ? 'end' : 'start'}
                y={y(dataNumber(residualPlot ? r.residual : r.py)) - 8}
                fontSize="12"
              >
                {r.id}
              </text>
            </g>
          ))}
        </g>
        <text x="595" y="376">
          x
        </text>
        <text x="28" y="25">
          {residualPlot ? 'e' : 'y'}
        </text>
        <text x="320" y="406" textAnchor="middle" fontSize="12">
          {mode === 'en'
            ? 'Fictional observations · paired identities preserved'
            : '虚构观测 · 配对身份保留'}
        </text>
      </svg>
    </DataFigure>
  );
}
export function SamplingFigure({
  mode,
  simulation,
}: {
  mode: LanguageMode;
  simulation: ReturnType<typeof samplingSimulation>;
}) {
  const { empirical, repetitions } = simulation,
    x = (v: number) => 75 + 115 * v,
    y = (v: number) => 340 - 280 * v;
  return (
    <DataFigure
      mode={mode}
      name={t(
        '精确分布与模拟频率',
        'Exact distribution and simulated frequencies',
      )}
      caption={t(
        '紫色为全部等可能样本计算的精确概率，绿色为当前种子模拟的频率；同一均值两柱并列。横位置保留精确分数，不四舍五入成整数。重复数不同于每轮n，也不保证每次更贴近理论。',
        'Purple is exact probability from all equally likely samples; green is frequency for this seed, paired at the same mean. Fractional mean locations remain exact. Repetitions differ from n and do not guarantee a closer realised run.',
      )}
    >
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Sample mean probability and frequency'
            : '样本均值的概率与频率'
        }
      >
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1="64" x2="570" y1={y(v)} y2={y(v)} stroke="#e1dce7" />
            <text x="54" y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((v) => (
          <text key={v} x={x(v)} y="366" textAnchor="middle">
            {v}
          </text>
        ))}
        {empirical.map((d) => (
          <g key={d.value}>
            <rect
              data-sampling-exact={d.value}
              data-probability={textR(d.probability)}
              x={x(dataNumber(dataValue(d.value))) - 13}
              y={y(dataNumber(d.probability))}
              width="11"
              height={280 * dataNumber(d.probability)}
              fill="#6652a1"
            />
            <rect
              data-sampling-observed={d.value}
              data-count={d.observed}
              x={x(dataNumber(dataValue(d.value))) + 2}
              y={y(d.observed / repetitions)}
              width="11"
              height={(280 * d.observed) / repetitions}
              fill="#248577"
            />
          </g>
        ))}
        <text x="320" y="395" textAnchor="middle">
          {mode === 'en'
            ? 'Sample mean · probability / frequency'
            : '样本均值 · 概率 / 频率'}
        </text>
      </svg>
    </DataFigure>
  );
}
export function ResponseFigure({
  mode,
  bounds,
}: {
  mode: LanguageMode;
  bounds: ReturnType<typeof responseBounds>;
}) {
  return (
    <DataFigure
      mode={mode}
      name={t('已知与未知成员', 'Known and unknown members')}
      caption={t(
        '每格代表一名不同成员；绿=已知是、橙=已知否、灰=未知。排列只是核对数量，不表示空间、时间排序或随机选择。未知不能自动填否。',
        'Each tile is one distinct member: green known yes, orange known no, grey unknown. Layout audits counts and does not encode place, time or random selection. Unknown does not mean no.',
      )}
    >
      <svg
        viewBox="0 0 640 350"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two hundred members with observed and unknown outcomes'
            : '200名成员的已知与未知结果'
        }
      >
        {Array.from({ length: bounds.population }, (_, i) => {
          const state =
            i < bounds.yes ? 'yes' : i < bounds.respondents ? 'no' : 'unknown';
          return (
            <rect
              key={i}
              data-response-state={state}
              x={35 + (i % 20) * 28}
              y={32 + Math.floor(i / 20) * 25}
              width="21"
              height="18"
              rx="3"
              fill={
                state === 'yes'
                  ? '#248577'
                  : state === 'no'
                    ? '#c78b38'
                    : '#d6d0e1'
              }
            />
          );
        })}
        <text x="320" y="315" textAnchor="middle">
          {mode === 'en'
            ? `${bounds.respondents} observed · ${bounds.missing} unknown`
            : `已知${bounds.respondents} · 未知${bounds.missing}`}
        </text>
      </svg>
    </DataFigure>
  );
}
