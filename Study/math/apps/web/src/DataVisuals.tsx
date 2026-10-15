import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  meanSummary,
  timeSeries,
  barScale,
  type TimeObservation,
} from './dataModels';

function Frame({
  children,
  mode,
  caption,
}: {
  children: React.ReactNode;
  mode: LanguageMode;
  caption: ReturnType<typeof t>;
}) {
  return (
    <figure className="math-data-figure">
      <div
        className="math-data-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Data diagram; scroll to inspect the labelled scale'
            : '数据图；可滚动核对标尺'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function MeanPiles({
  values,
  mode,
}: {
  values: number[];
  mode: LanguageMode;
}) {
  meanSummary(values);
  return (
    <Frame
      mode={mode}
      caption={t(
        '每点代表一张卡。这里只移动原有卡，不增加总数；平均数是每堆公平分配的数量。',
        'Each dot is one card. Moving cards preserves the total; the mean is the fair-share amount per pile.',
      )}
    >
      <div
        className="math-data-piles"
        role="img"
        aria-label={
          mode === 'en'
            ? `Card piles: ${values.join(', ')}. Count and compare before finding the mean.`
            : `卡堆各有 ${values.join('、')} 张；先数和比较，再求平均。`
        }
      >
        {values.map((v, i) => (
          <div className="math-data-pile" key={i}>
            <strong>
              {String.fromCharCode(65 + i)} · {v}
            </strong>
            <div>
              {Array.from({ length: v }, (_, j) => (
                <span className="math-data-counter" data-pile={i} key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
export function TimeLine({
  points,
  maxY,
  mode,
}: {
  points: TimeObservation[];
  maxY: number;
  mode: LanguageMode;
}) {
  const m = timeSeries(points, maxY);
  return (
    <Frame
      mode={mode}
      caption={t(
        '假想观察；横轴为从开始算的小时，纵轴为摄氏温度。时间间距按比例；缺测处不连线，线段不证明中间每一时刻的真实值。',
        'Fictional observations: horizontal axis is elapsed hours; vertical axis is temperature in °C. Time spacing is proportional. Gaps stay disconnected; lines do not prove every intervening value.',
      )}
    >
      <svg
        className="math-data-svg"
        viewBox="0 0 550 330"
        role="img"
        aria-label={
          mode === 'en'
            ? `Temperature in degrees Celsius by elapsed hour: ${points.map((p) => `${p.time}: ${p.value === null ? 'missing' : p.value}`).join('; ')}.`
            : `按经过小时记录的摄氏温度：${points.map((p) => `${p.time} 时：${p.value === null ? '缺测' : p.value + '℃'}`).join('；')}。`
        }
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const v = (i * maxY) / 4,
            y = 260 - (i * 210) / 4;
          return (
            <g key={i}>
              <line x1="60" x2="480" y1={y} y2={y} className="data-grid" />
              <text x="50" y={y + 5} textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}
        <path d="M60 40V260H490" className="data-axis" />
        <text x="15" y="27">
          °C
        </text>
        <text x="270" y="322" textAnchor="middle">
          {mode === 'en' ? 'Elapsed hours' : '经过的小时'}
        </text>
        {m.points.map((p, i) => (
          <g key={i}>
            <line className="data-axis" x1={p.x} x2={p.x} y1="260" y2="266" />
            <text x={p.x} y="287" textAnchor="middle">
              {p.time}
            </text>
            {p.y === null ? (
              <text x={p.x} y="247" textAnchor="middle">
                ?
              </text>
            ) : (
              <circle
                data-observation={i}
                cx={p.x}
                cy={p.y}
                r="5"
                className="data-dot"
              />
            )}
          </g>
        ))}
        {m.segments.map((s, i) => (
          <line
            key={i}
            data-time-segment={i}
            x1={s.from.x}
            x2={s.to.x}
            y1={s.from.y!}
            y2={s.to.y!}
            className="data-line"
          />
        ))}
      </svg>
    </Frame>
  );
}
export function ScaleBars({
  values,
  baseline,
  maximum = 50,
  mode,
}: {
  values: number[];
  baseline: number;
  maximum?: number;
  mode: LanguageMode;
}) {
  const bars = barScale(values, baseline, maximum);
  return (
    <Frame
      mode={mode}
      caption={t(
        `假想人数；柱底对应 ${baseline} 人${baseline ? '，截断纵轴会夸大相对柱高差异，比较倍数应看原数值' : '，零基线适合比较整个人数的柱高'}。`,
        `Fictional counts; bars start at ${baseline} people${baseline ? '. The truncated axis exaggerates relative bar-height differences; compare original values for ratios' : '. A zero baseline supports whole-count bar-height comparisons'}.`,
      )}
    >
      <svg
        className="math-data-svg"
        viewBox="0 0 550 330"
        role="img"
        aria-label={
          mode === 'en'
            ? `People in groups A and B: ${values.join(', ')}. Vertical scale ${baseline} to ${maximum}${baseline ? ', truncated' : ''}.`
            : `A、B 两组人数 ${values.join('、')}；纵轴 ${baseline} 到 ${maximum}${baseline ? '，已截断' : ''}。`
        }
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const v = baseline + ((maximum - baseline) * i) / 4,
            y = 260 - (i * 210) / 4;
          return (
            <g key={i}>
              <line className="data-grid" x1="60" x2="480" y1={y} y2={y} />
              <text x="50" y={y + 5} textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}
        <path d="M60 40V260H480" className="data-axis" />
        {baseline > 0 && (
          <path
            data-axis-break="true"
            d="M54 264l12-8-12-8 12-8"
            className="data-break"
          />
        )}
        {bars.map((b, i) => (
          <g key={i}>
            <rect
              data-chart-bar={i}
              x={140 + i * 180}
              y={260 - b.height}
              width="72"
              height={b.height}
              className="data-bar"
            />
            <text x={176 + i * 180} y={250 - b.height} textAnchor="middle">
              {b.value}
            </text>
            <text x={176 + i * 180} y="289" textAnchor="middle">
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        ))}
        <text x="15" y="27">
          {mode === 'en' ? 'People' : '人数'}
        </text>
      </svg>
    </Frame>
  );
}
