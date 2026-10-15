import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  orderedSummary,
  spinnerModel,
  frequencySummary,
  type SpinnerModel,
} from './chanceModels';
export function ChanceFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-chance-figure">
      <div
        className="math-chance-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Statistics or chance model; scroll locally'
            : '统计与概率模型；可在图内滚动'
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
export function OrderedCards({
  values,
  sorted = false,
  highlight = false,
  mode,
}: {
  values: number[];
  sorted?: boolean;
  highlight?: boolean;
  mode: LanguageMode;
}) {
  const m = orderedSummary(values),
    rows = sorted ? m.sorted : values.map((value, id) => ({ value, id }));
  return (
    <ChanceFrame
      mode={mode}
      caption={t(
        '每张卡是一条记录，重复数值也不能删掉。中位数看排序后的位置；偶数条时取中间两数的平均，不是取最大与最小的平均。',
        'Each card is one observation; do not discard repeated values. Median uses ordered positions. With an even count, average the middle two, not the minimum and maximum.',
      )}
    >
      <ol
        className="math-chance-cards"
        aria-label={
          mode === 'en'
            ? sorted
              ? 'Ordered observations'
              : 'Original observations'
            : sorted
              ? '已排序记录'
              : '原始记录'
        }
      >
        {rows.map((row, index) => (
          <li
            key={row.id}
            data-observation-id={row.id}
            data-middle={
              sorted && highlight && m.middle.includes(index) ? 'true' : 'false'
            }
          >
            <small>{index + 1}</small>
            <strong>{row.value}</strong>
          </li>
        ))}
      </ol>
    </ChanceFrame>
  );
}
const palette = [
  '#bca8de',
  '#edce94',
  '#9fcad2',
  '#e6b0ba',
  '#c2d29d',
  '#c7bfae',
  '#b7bee6',
  '#d5b6d7',
];
export function Spinner({
  labels,
  weights,
  angle,
  mode,
}: {
  labels: string[];
  weights: number[];
  angle?: number;
  mode: LanguageMode;
}) {
  const m = spinnerModel(labels, weights),
    R = 100,
    cx = 150,
    cy = 140,
    point = (f: number) => [
      cx + R * Math.sin(2 * Math.PI * f),
      cy - R * Math.cos(2 * Math.PI * f),
    ];
  return (
    <ChanceFrame
      mode={mode}
      caption={t(
        '理想模型按均匀角度抽取，机会与扇区角度成比例；字母和编号共同标识。等扇区不保证不同字母等可能，重复字母要合并。边界按固定规则归入下一扇区。',
        'The ideal model samples a uniform angle, so chance is proportional to sector angle. Letters and identifiers label outcomes. Equal sectors need not make distinct letters equally likely: combine repeated letters. Boundaries consistently belong to the next sector.',
      )}
    >
      <svg
        viewBox="0 0 310 290"
        style={{ width: 310, height: 290 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Spinner: ${m.sectors.map((s) => `${s.label}, weight ${s.weight}`).join('; ')}`
            : `转盘：${m.sectors.map((s) => `${s.label} 权重 ${s.weight}`).join('；')}`
        }
      >
        {m.sectors.map((s) => {
          const a = point(s.start),
            b = point(s.end),
            mid = (s.start + s.end) / 2,
            pos = [
              cx + 65 * Math.sin(2 * Math.PI * mid),
              cy - 65 * Math.cos(2 * Math.PI * mid),
            ];
          return (
            <g key={s.id} data-chance-sector={s.id}>
              {s.end - s.start === 1 ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={R}
                  fill={palette[s.id]}
                  className="chance-sector"
                />
              ) : (
                <path
                  d={`M ${cx} ${cy} L ${a[0]} ${a[1]} A ${R} ${R} 0 ${s.end - s.start > 0.5 ? 1 : 0} 1 ${b[0]} ${b[1]} Z`}
                  fill={palette[s.id]}
                  className="chance-sector"
                />
              )}
              <text x={pos[0]} y={pos[1]} textAnchor="middle">
                {s.label}
              </text>
              <text
                x={pos[0]}
                y={pos[1]! + 18}
                textAnchor="middle"
                className="chance-id"
              >
                S{s.id + 1}
              </text>
            </g>
          );
        })}
        {angle !== undefined && (
          <line
            data-chance-pointer
            x1={cx}
            y1={cy}
            x2={point(angle)[0]}
            y2={point(angle)[1]}
            className="chance-pointer"
          />
        )}
        <circle cx={cx} cy={cy} r="5" fill="#423354" />
      </svg>
    </ChanceFrame>
  );
}
export function ChanceTokens({
  counts,
  selected,
  mode,
}: {
  counts: number[];
  selected: number[];
  mode: LanguageMode;
}) {
  return (
    <ChanceFrame
      mode={mode}
      caption={t(
        '每枚圆片代表一个同样大小、混匀后等可能抽到的对象，字母重复仍是不同圆片。圈选表示事件，不是把圈内对象变成更容易抽到；抽后放回才能重复同一模型。',
        'Each token is an equally likely same-sized object after mixing. Repeated letters remain separate tokens. Highlighting marks an event rather than changing selection chances; replace the token before repeating this model.',
      )}
    >
      <div className="math-chance-tokens">
        {counts.flatMap((n, label) =>
          Array.from({ length: n }, (_, i) => (
            <span
              key={`${label}-${i}`}
              data-chance-token={`${label}-${i}`}
              data-selected={selected.includes(label) ? 'true' : 'false'}
            >
              <b>{String.fromCharCode(65 + label)}</b>
              <small>{i + 1}</small>
            </span>
          )),
        )}
      </div>
    </ChanceFrame>
  );
}
export function FrequencyPlot({
  outcomes,
  event,
  model,
  mode,
}: {
  outcomes: string[];
  event: string[];
  model: SpinnerModel;
  mode: LanguageMode;
}) {
  const m = frequencySummary(outcomes, event),
    weight = model.sectors
      .filter((s) => event.includes(s.label))
      .reduce((a, s) => a + s.weight, 0),
    p = weight / model.total,
    max = Math.max(m.trials, 1),
    point = (v: { trials: number; value: number }) => [
      50 + (v.trials / max) * 390,
      230 - v.value * 170,
    ];
  return (
    <ChanceFrame
      mode={mode}
      caption={t(
        '横轴是累计试验次数，纵轴为累计频率（零到一）；虚线是理想理论值。频率轨迹可能来回偏离，增加一次不保证更接近，观察记录不能决定下一次。',
        'The horizontal axis is cumulative trial count; vertical frequency runs from zero to one. The dashed line is the ideal theoretical value. Frequencies can move away as well as closer; another trial need not improve agreement or determine the next result.',
      )}
    >
      <svg
        viewBox="0 0 490 290"
        style={{ width: 490, height: 290 }}
        role="img"
        aria-label={
          mode === 'en'
            ? 'Cumulative frequency and theoretical probability'
            : '累计频率与理论概率'
        }
      >
        <path d="M 50 45 V 230 H 445" className="chance-axis" />
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <text x="10" y={235 - v * 170}>
              {v}
            </text>
            <line
              x1="48"
              x2="445"
              y1={230 - v * 170}
              y2={230 - v * 170}
              className="chance-grid"
            />
          </g>
        ))}
        <line
          data-theoretical-line
          x1="50"
          x2="445"
          y1={230 - p * 170}
          y2={230 - p * 170}
          className="chance-theory"
        />
        {m.trace.length > 1 && (
          <polyline
            data-frequency-trace
            points={m.trace.map((v) => point(v).join(',')).join(' ')}
            className="chance-trace"
          />
        )}
        {m.trace.length > 0 && (
          <circle
            data-frequency-point
            cx={point(m.trace[m.trace.length - 1]!)[0]}
            cy={point(m.trace[m.trace.length - 1]!)[1]}
            r="4"
            fill="#59448d"
          />
        )}
        <text x="45" y="258">
          0
        </text>
        {m.trials > 1 && (
          <text
            x={50 + (Math.floor(m.trials / 2) / m.trials) * 390}
            y="258"
            textAnchor="middle"
          >
            {Math.floor(m.trials / 2)}
          </text>
        )}
        {m.trials > 0 && (
          <text x="440" y="258" textAnchor="middle">
            {m.trials}
          </text>
        )}
        {!m.trials && (
          <text x="75" y="110">
            {mode === 'en'
              ? 'No trials: frequency undefined'
              : '尚无试验：频率未定义'}
          </text>
        )}
      </svg>
    </ChanceFrame>
  );
}
