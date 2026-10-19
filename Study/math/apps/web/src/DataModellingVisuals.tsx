import { useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import { textR, type Rational } from './algebraModels';
import {
  dataValue,
  dataNumber,
  dataSummary,
  histogram,
  leastSquares,
  candidateFit,
  type DataPair,
} from './dataModellingModels';
export function DataFigure({
  mode,
  name,
  children,
  caption,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  children: ReactNode;
  caption: LocalizedText;
}) {
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? name.en : name.zh}
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function DataTable({
  mode,
  headers,
  rows,
  name = t('精确数据核验表', 'Exact data audit table'),
}: {
  mode: LanguageMode;
  headers: LocalizedText[];
  rows: (string | number)[][];
  name?: LocalizedText;
}) {
  return (
    <div
      className="math-concept-table"
      role="region"
      tabIndex={0}
      aria-label={mode === 'en' ? name.en : name.zh}
    >
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                <Text mode={mode} text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ShapeFigure({
  mode,
  values,
  width,
  reveal,
}: {
  mode: LanguageMode;
  values: string[];
  width: number;
  reveal: boolean;
}) {
  const s = dataSummary(values),
    bins = histogram(values, width),
    stacks = new Map<string, number>(),
    x = (v: number) => 55 + v * 34;
  return (
    <DataFigure
      mode={mode}
      name={t(
        '逐点分布与等宽直方图',
        'Individual observations and equal-width histogram',
      )}
      caption={t(
        '点保留每条观测；柱表示区间频数，柱间没有类别间隙。区间左闭右开，最后一组包含16；分组改变外观，不改变原数据。',
        'Dots retain every observation. Touching bars show interval frequencies. Bins are left-closed/right-open except the final bin includes 16; grouping changes appearance, not the data.',
      )}
    >
      <svg
        viewBox="0 0 640 500"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Stacked observations above an equal-width histogram'
            : '上方逐点、下方等宽直方图'
        }
      >
        <text x="32" y="28">
          {mode === 'en' ? 'Every observation' : '每条观测'}
        </text>
        <line x1="55" x2="599" y1="150" y2="150" stroke="#746d82" />
        {s.values.map((r, i) => {
          const key = textR(r),
            level = (stacks.get(key) ?? 0) + 1;
          stacks.set(key, level);
          return (
            <circle
              key={i}
              data-observation={i}
              data-value={key}
              cx={x(dataNumber(r))}
              cy={145 - level * 20}
              r="6"
              fill="#6652a1"
            />
          );
        })}
        {reveal && (
          <>
            <line
              x1={x(dataNumber(s.mean))}
              x2={x(dataNumber(s.mean))}
              y1="45"
              y2="155"
              stroke="#248577"
              strokeDasharray="5 4"
            />
            <text x="32" y="190">
              {mode === 'en' ? 'Mean' : '均值'}={textR(s.mean)}
            </text>
            <text x="330" y="190">
              {mode === 'en' ? 'Median' : '中位数'}={textR(s.median)}
            </text>
          </>
        )}
        <text x="32" y="230">
          {mode === 'en'
            ? `Frequency · bin width ${width}`
            : `频数 · 组距${width}`}
        </text>
        {[0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line
              x1="55"
              x2="599"
              y1={420 - v * 24}
              y2={420 - v * 24}
              stroke="#ddd8e5"
            />
            <text x="35" y={425 - v * 24} textAnchor="end" fontSize="12">
              {v}
            </text>
          </g>
        ))}
        {bins.map((b, i) => (
          <g
            key={i}
            data-bin-low={b.low}
            data-bin-high={b.high}
            data-bin-count={b.count}
          >
            <rect
              x={x(b.low)}
              y={420 - b.count * 24}
              width={width * 34}
              height={b.count * 24}
              fill="#d7cce9"
              stroke="#6652a1"
            />
            {b.count > 0 && (
              <text
                x={x((b.low + b.high) / 2)}
                y={412 - b.count * 24}
                textAnchor="middle"
                fontSize="12"
              >
                {b.count}
              </text>
            )}
          </g>
        ))}
        {Array.from({ length: 9 }, (_, i) => i * 2).map((v) => (
          <g key={v}>
            <text x={x(v)} y="175" fontSize="12" textAnchor="middle">
              {v}
            </text>
            <text x={x(v)} y="446" fontSize="12" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        <text x="320" y="481" textAnchor="middle">
          {mode === 'en'
            ? 'Value · same horizontal scale'
            : '数值 · 上下同一横向标尺'}
        </text>
      </svg>
    </DataFigure>
  );
}
export function DeviationFigure({
  mode,
  values,
  reveal,
}: {
  mode: LanguageMode;
  values: string[];
  reveal: boolean;
}) {
  const s = dataSummary(values);
  return (
    <DataFigure
      mode={mode}
      name={t('离均差与平方贡献', 'Deviations and square contributions')}
      caption={t(
        '上方线段从均值出发保留正负方向；下方每个正方形边长为离均差的绝对值，面积为平方。所有方块共用同一长度标尺，负离差不画成负面积。',
        'Segments retain the sign of each deviation. Each square has side |x−mean| and area (x−mean)². Squares share one length scale, preserving their area ratios; negative deviations do not create negative areas.',
      )}
    >
      <svg
        viewBox="0 0 640 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Signed deviations and true square areas'
            : '带符号离均差与真实平方面积'
        }
      >
        <text x="30" y="25">
          {mode === 'en' ? 'From the mean' : '从均值出发'} · {textR(s.mean)}
        </text>
        <line
          x1="320"
          x2="320"
          y1="35"
          y2="220"
          stroke="#a99abd"
          strokeDasharray="4 4"
        />
        {s.deviations.map((d, i) => (
          <g key={i} data-deviation={textR(d)}>
            <text x="20" y={60 + i * 42}>
              x{i + 1}
            </text>
            <line
              x1="320"
              x2={320 + dataNumber(d) * 12}
              y1={55 + i * 42}
              y2={55 + i * 42}
              stroke="#6652a1"
              strokeWidth="3"
            />
            <circle
              cx={320 + dataNumber(d) * 12}
              cy={55 + i * 42}
              r="5"
              fill="#6652a1"
            />
            {reveal && (
              <text x="555" y={60 + i * 42} textAnchor="end">
                {textR(d)}
              </text>
            )}
          </g>
        ))}
        <text x="30" y="250">
          {mode === 'en' ? 'Squared contributions' : '平方贡献'}
        </text>
        {s.deviations.map((d, i) => {
          const side = Math.abs(dataNumber(d)) * 8;
          return (
            <g key={i} data-square={textR(s.squares[i]!)}>
              <rect
                x={35 + i * 145}
                y={400 - side}
                width={side}
                height={side}
                fill="#d7cce9"
                stroke="#6652a1"
              />
              {side === 0 && (
                <circle cx={35 + i * 145} cy="400" r="3" fill="#6652a1" />
              )}
              <text x={45 + i * 145} y="426" fontSize="13">
                {reveal ? textR(s.squares[i]!) : `x${i + 1}`}
              </text>
            </g>
          );
        })}
      </svg>
    </DataFigure>
  );
}
export function StandardFigure({
  mode,
  a,
  b,
}: {
  mode: LanguageMode;
  a: Rational | null;
  b: Rational | null;
}) {
  const x = (v: number) => 70 + ((v + 3) * 500) / 6;
  return (
    <DataFigure
      mode={mode}
      name={t(
        '以标准差为单位的共同标尺',
        'A common scale in standard deviation units',
      )}
      caption={t(
        '这里只比较离各自均值几个标准差，不把标准分数变成百分位、概率或价值判断；标准差为零时不放置伪造的零点。',
        'Compare distances from each reference mean in standard deviation units. A z-score alone is not a percentile, probability or value judgment. Zero spread does not create an artificial z=0.',
      )}
    >
      <svg
        viewBox="0 0 640 270"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two signed standard scores on a common scale'
            : '两个带符号标准分数的共同标尺'
        }
      >
        {[a, b].map((z, i) => (
          <g key={i}>
            <text x="25" y={72 + i * 110}>
              {i === 0 ? 'A' : 'B'}
            </text>
            <line
              x1="70"
              x2="570"
              y1={80 + i * 110}
              y2={80 + i * 110}
              stroke="#746d82"
            />
            {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
              <g key={v}>
                <line
                  x1={x(v)}
                  x2={x(v)}
                  y1={75 + i * 110}
                  y2={85 + i * 110}
                  stroke="#746d82"
                />
                <text
                  x={x(v)}
                  y={105 + i * 110}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {v}
                </text>
              </g>
            ))}
            {z === null ? (
              <text x="320" y={55 + i * 110} textAnchor="middle">
                {mode === 'en' ? 'Undefined: zero SD' : '无定义：标准差为零'}
              </text>
            ) : (
              <circle
                data-z-group={i === 0 ? 'A' : 'B'}
                data-z={textR(z)}
                cx={x(dataNumber(z))}
                cy={80 + i * 110}
                r="8"
                fill={i === 0 ? '#6652a1' : '#248577'}
              />
            )}
          </g>
        ))}
        <text x="320" y="252" textAnchor="middle">
          z = (x−μ)/σ
        </text>
      </svg>
    </DataFigure>
  );
}
export function RegressionFigure({
  mode,
  rows,
  intercept,
  slope,
  reveal,
  residuals,
}: {
  mode: LanguageMode;
  rows: DataPair[];
  intercept: string;
  slope: string;
  reveal: boolean;
  residuals: boolean;
}) {
  const clip = useId().replace(/:/g, ''),
    fit = leastSquares(rows),
    candidate = candidateFit(rows, intercept, slope),
    x = (v: number) => 60 + v * 75,
    y = (v: number) => 340 - (v + 2) * 21,
    line = (a: number, b: number, l: number, r: number) =>
      `M${x(l)} ${y(a + b * l)}L${x(r)} ${y(a + b * r)}`;
  return (
    <DataFigure
      mode={mode}
      name={t(
        '回归线、观测点与竖直残差',
        'Regression lines, observations and vertical residuals',
      )}
      caption={t(
        '紫线为候选，绿线为核验后的最小二乘线；后者在观测x范围内实线、范围外虚线。残差是同一x处y−ŷ的竖直差，非到线的最短距离；超出图窗的线段截去，精确表保留。',
        'Purple shows the candidate, green the audited least-squares line: solid over observed x values and dashed beyond. Residuals are vertical y−ŷ at the same x, not shortest distances. Lines are clipped to this window; exact tables retain values.',
      )}
    >
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Paired points with candidate and optional least-squares lines'
            : '成对观测、候选线与可揭示最小二乘线'
        }
      >
        <defs>
          <clipPath id={clip}>
            <rect x="52" y="38" width="541" height="310" />
          </clipPath>
        </defs>
        {[0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1="46" y2="340" stroke="#e0dce7" />
            <text x={x(v)} y="365" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        {[-2, 0, 4, 8, 12].map((v) => (
          <g key={v}>
            <line x1="60" x2="585" y1={y(v)} y2={y(v)} stroke="#e0dce7" />
            <text x="47" y={y(v) + 5} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <g clipPath={`url(#${clip})`}>
          <path
            d={line(
              dataNumber(dataValue(intercept)),
              dataNumber(dataValue(slope)),
              0,
              7,
            )}
            fill="none"
            stroke="#6652a1"
            strokeWidth="2"
          />
          {residuals &&
            candidate.rows.map((r) => (
              <line
                key={r.id}
                data-residual-id={r.id}
                data-residual={textR(r.residual)}
                x1={x(dataNumber(r.px))}
                x2={x(dataNumber(r.px))}
                y1={y(dataNumber(r.py))}
                y2={y(dataNumber(r.predicted))}
                stroke="#b67a24"
                strokeWidth="3"
              />
            ))}
          {reveal && fit.slope !== null && (
            <>
              <path
                d={line(
                  dataNumber(fit.intercept!),
                  dataNumber(fit.slope),
                  0,
                  7,
                )}
                fill="none"
                stroke="#248577"
                strokeDasharray="5 5"
                strokeWidth="2"
              />
              <path
                d={line(
                  dataNumber(fit.intercept!),
                  dataNumber(fit.slope),
                  fit.minX,
                  fit.maxX,
                )}
                fill="none"
                stroke="#248577"
                strokeWidth="3"
              />
            </>
          )}
          {rows.map((r) => (
            <g key={r.id}>
              <circle
                data-pair-id={r.id}
                cx={x(dataNumber(dataValue(r.x)))}
                cy={y(dataNumber(dataValue(r.y)))}
                r="6"
                fill="#332846"
              />
              <text
                x={x(dataNumber(dataValue(r.x))) + 9}
                y={y(dataNumber(dataValue(r.y))) - 9}
                fontSize="12"
              >
                {r.id}
              </text>
            </g>
          ))}
        </g>
        <text x="600" y="365">
          x
        </text>
        <text x="28" y="28">
          y
        </text>
        <text x="320" y="402" textAnchor="middle">
          {mode === 'en'
            ? 'Fictional paired observations · keep pair identity'
            : '虚构成对观测 · 保留配对身份'}
        </text>
      </svg>
    </DataFigure>
  );
}
