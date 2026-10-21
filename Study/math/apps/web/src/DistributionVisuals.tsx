import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import { rational, textR } from './algebraModels';
import {
  distributionNumber as num,
  standardDensity,
  type distribution,
} from './distributionModels';
export function MassFigure({
  mode,
  m,
  name = t('离散概率质量图', 'Discrete probability masses'),
  variable = 'X',
}: {
  mode: LanguageMode;
  m: ReturnType<typeof distribution>;
  name?: LocalizedText;
  variable?: 'X' | 'Y' | 'X̄';
}) {
  const xs = m.rows.map((r) => num(r.value)),
    lo = Math.min(...xs) - 1,
    hi = Math.max(...xs) + 1,
    px = (x: number) => 60 + ((x - lo) / (hi - lo)) * 540,
    py = (p: number) => 320 - p * 250,
    width = Math.min(26, 350 / m.rows.length);
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        '横轴为随机变量的实际数值，纵轴为概率质量0..1。分离柱的高度表示各点概率，不把间隙连成连续密度；同一取值应先合并。',
        'The horizontal axis uses actual values; the vertical axis is probability mass 0..1. Separated bar heights give point probabilities. Gaps are not a continuous density; merge equal values first.',
      )}
    >
      <svg
        viewBox="0 0 640 390"
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
        {m.rows.map((r, i) => (
          <g key={i}>
            <rect
              data-value={textR(r.value)}
              data-mass={textR(r.p)}
              x={px(num(r.value)) - width / 2}
              y={py(num(r.p))}
              width={width}
              height={250 * num(r.p)}
              fill="#5c4e9c"
            />
            <circle
              cx={px(num(r.value))}
              cy={py(num(r.p))}
              r="3"
              fill="#dc7d27"
            />
            <text
              x={px(num(r.value))}
              y="343"
              textAnchor="middle"
              fontSize="12"
            >
              {textR(r.value)}
            </text>
          </g>
        ))}
        <text x="60" y="40" fontSize="14">
          {`P(${variable}=${variable.toLowerCase()})`}
        </text>
        <text x="600" y="371" textAnchor="end" fontSize="14">
          {variable.toLowerCase()}
        </text>
      </svg>
    </DataFigure>
  );
}
export function DensityFigure({
  mode,
  mean,
  sd,
  lo,
  hi,
  span = 12,
  heightScale = 1,
  unit = 'cm',
}: {
  mode: LanguageMode;
  mean: number;
  sd: number;
  lo?: number;
  hi?: number;
  span?: number;
  heightScale?: number;
  unit?: string;
}) {
  const id = useId(),
    xmin = mean - span,
    xmax = mean + span,
    ymax = 0.5 / heightScale,
    px = (x: number) => 60 + ((x - xmin) / (xmax - xmin)) * 540,
    py = (y: number) => 320 - (y / ymax) * 250,
    f = (x: number) => standardDensity((x - mean) / sd) / sd,
    curve = (a: number, b: number) =>
      Array.from({ length: 401 }, (_, i) => {
        const x = a + ((b - a) * i) / 400;
        return `${px(x)},${py(f(x))}`;
      }).join(' '),
    a = Math.max(xmin, lo ?? xmin),
    b = Math.min(xmax, hi ?? xmax),
    name = t('正态密度与区间面积', 'Normal density and interval area');
  return (
    <DataFigure
      mode={mode}
      name={name}
      caption={t(
        `横轴${unit === 'z' ? 'z无单位' : `原量（${unit}）`}，纵轴密度${unit === 'z' ? '' : `（1/${unit}）`}；概率由面积给出，单点宽度0。横轴视窗为中心±${span}，${unit === 'cm' ? '当前视图横纵尺度固定，可比较σ变化。' : '切换标准化视图会改变坐标尺度，保持概率面积。'}图窗外尾部仍存在，左/右尾概率包含未画出的部分。`,
        `Horizontal: ${unit === 'z' ? 'unitless z' : `original value (${unit})`}; vertical: density${unit === 'z' ? '' : ` (1/${unit})`}. Probability is area; a point has zero width. The window is centre±${span}. ${unit === 'cm' ? 'Both axis scales stay fixed in this view when σ changes.' : 'Standardisation changes coordinates while preserving probability area.'} Infinite tails remain outside the window, and tail probabilities include them.`,
      )}
    >
      <svg
        viewBox="0 0 640 390"
        width="640"
        role="img"
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        <defs>
          <clipPath id={id}>
            <rect x="60" y="70" width="540" height="250" />
          </clipPath>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line
              x1="60"
              x2="600"
              y1={py((ymax * i) / 4)}
              y2={py((ymax * i) / 4)}
              stroke="#dbe5ea"
            />
            <text
              x="48"
              y={py((ymax * i) / 4) + 4}
              textAnchor="end"
              fontSize="12"
            >
              {textR(rational(BigInt(i), 8n * BigInt(heightScale)))}
            </text>
            <text
              x={px(xmin + ((xmax - xmin) * i) / 4)}
              y="343"
              textAnchor="middle"
              fontSize="12"
            >
              {xmin + ((xmax - xmin) * i) / 4}
            </text>
          </g>
        ))}
        <g clipPath={`url(#${id})`}>
          {a <= b && (
            <polygon
              data-bounds={`${lo ?? '-inf'},${hi ?? 'inf'}`}
              points={`${px(a)},320 ${curve(a, b)} ${px(b)},320`}
              fill="#56aaa080"
            />
          )}
          <polyline
            points={curve(xmin, xmax)}
            fill="none"
            stroke="#5c4e9c"
            strokeWidth="2.5"
          />
          {lo !== undefined && lo === hi && (
            <line
              x1={px(lo)}
              x2={px(lo)}
              y1="320"
              y2={py(f(lo))}
              stroke="#dc7d27"
              strokeDasharray="5 4"
            />
          )}
        </g>
        <text x="60" y="40" fontSize="14">
          {unit === 'z' ? 'φ(z)' : `density (1/${unit})`}
        </text>
        <text x="600" y="371" textAnchor="end" fontSize="14">
          {unit === 'z' ? 'z' : `x (${unit})`}
        </text>
      </svg>
    </DataFigure>
  );
}
