import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  orderedRatio,
  allocateRatio,
  mapScale,
  costCurve,
  graphCoordinates,
  type CurveKind,
} from './ratioModels';
import { decimalText, ratioText } from './percentModels';
export function RatioFrame({
  children,
  mode,
  caption,
}: {
  children: React.ReactNode;
  mode: LanguageMode;
  caption: ReturnType<typeof t>;
}) {
  return (
    <figure className="math-ratio-figure">
      <div
        className="math-ratio-scroll"
        tabIndex={0}
        role="region"
        aria-label={
          mode === 'en'
            ? 'Ratio model; scroll within the figure'
            : '比的模型；在图内滚动'
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
export function RatioCounters({
  a,
  b,
  mode,
  group = 0,
}: {
  a: number;
  b: number;
  mode: LanguageMode;
  group?: number;
}) {
  orderedRatio(a, b);
  if (
    a > 48 ||
    b > 48 ||
    !Number.isInteger(group) ||
    group < 0 ||
    (group > 0 && (a % group || b % group))
  )
    throw new RangeError('Use complete equal counter groups');
  const width = Math.max(a, b) * 22 + 100;
  return (
    <RatioFrame
      mode={mode}
      caption={t(
        'A 用圆点、B 用方块并标字母，颜色不是唯一线索。每个小符号表示同样一份；括框只把原符号分组，不拿走数量。',
        'A uses circles and B uses squares, both lettered; colour is not the only cue. Each symbol represents one equal unit. Brackets group the original symbols without removing quantities.',
      )}
    >
      <svg
        viewBox={`0 0 ${width} 170`}
        style={{ minWidth: width, height: 170 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `A has ${a} equal units; B has ${b} equal units`
            : `A 有 ${a} 个同样小份，B 有 ${b} 个同样小份`
        }
      >
        {[a, b].map((count, row) => (
          <g key={row}>
            <text x="12" y={42 + row * 75}>
              {row ? 'B' : 'A'}
            </text>
            {Array.from({ length: count }, (_, i) => (
              <g key={i} data-ratio-counter={`${row}-${i}`}>
                {row ? (
                  <rect
                    x={52 + i * 22}
                    y={23 + row * 75}
                    width="18"
                    height="22"
                    className="ratio-b"
                  />
                ) : (
                  <circle
                    cx={61 + i * 22}
                    cy={34 + row * 75}
                    r="10"
                    className="ratio-a"
                  />
                )}
                <text
                  x={61 + i * 22}
                  y={38 + row * 75}
                  textAnchor="middle"
                  className="ratio-counter-letter"
                >
                  {row ? 'B' : 'A'}
                </text>
              </g>
            ))}
            {group > 0 &&
              Array.from({ length: count / group }, (_, i) => (
                <rect
                  key={i}
                  data-ratio-group={`${row}-${i}`}
                  x={50 + i * group * 22}
                  y={17 + row * 75}
                  width={group * 22}
                  height="35"
                  className="ratio-group-outline"
                />
              ))}
            <text x="52" y={66 + row * 75}>
              {mode === 'en' ? 'Count' : '个数'}: {count}
            </text>
          </g>
        ))}
      </svg>
    </RatioFrame>
  );
}
export function RatioShares({
  total,
  a,
  b,
  mode,
}: {
  total: number;
  a: number;
  b: number;
  mode: LanguageMode;
}) {
  const m = allocateRatio(total, a, b),
    width = m.parts * 40 + 90;
  return (
    <RatioFrame
      mode={mode}
      caption={t(
        '整条代表待分总量，等宽格标记分配权重，每格的实际升数要由总量除总份数。总量零时格子为空，不表示新增水。',
        'The bar represents the total; equal-width cells mark allocation weights. Actual litres per cell come from total divided by all parts. With a zero total the cells are empty, adding no water.',
      )}
    >
      <svg
        viewBox={`0 0 ${width} 150`}
        style={{ minWidth: width, height: 150 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Total ${total} L; A gets ${a} weight parts and B gets ${b} weight parts`
            : `总量 ${total} L，A 分 ${a} 个权重份，B 分 ${b} 个权重份`
        }
      >
        {Array.from({ length: m.parts }, (_, i) => (
          <g key={i}>
            <rect
              data-ratio-share={i}
              data-recipient={i < a ? 'A' : 'B'}
              x={30 + i * 40}
              y="35"
              width="40"
              height="42"
              className={
                total === 0 ? 'ratio-empty' : i < a ? 'ratio-a' : 'ratio-b'
              }
            />
            <text x={50 + i * 40} y="62" textAnchor="middle">
              {i < a ? 'A' : 'B'}
            </text>
          </g>
        ))}
        <text x="30" y="22">
          {mode === 'en' ? 'Total' : '总量'}: {total} L
        </text>
        <text x="30" y="116">
          {a}+{b}={m.parts} {mode === 'en' ? 'equal weight parts' : '等权重份'}
        </text>
      </svg>
    </RatioFrame>
  );
}
export function RatioMap({
  horizontal = 3,
  vertical = 2,
  scale = 50000,
  zoom = 1,
  mode,
}: {
  horizontal?: number;
  vertical?: number;
  scale?: number;
  zoom?: number;
  mode: LanguageMode;
}) {
  const m = mapScale(horizontal, vertical, scale, zoom),
    u = m.pixelsPerOriginalCm,
    w = horizontal * u + 180,
    h = vertical * u + 170;
  return (
    <RatioFrame
      mode={mode}
      caption={t(
        '假想路线示意图。厘米标签是原地图坐标，不是屏幕尺量；沿 A→B→C 两段走。缩放时路径与线段比例尺一起缩放，原坐标和真实路程不变。',
        'A fictional route diagram. Centimetre labels refer to original-map coordinates, not a ruler on the screen. Follow both legs A→B→C. Zoom changes the path and graphic scale bar together, preserving original coordinates and ground distance.',
      )}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ minWidth: w, height: h }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Original map 1:${scale}; route legs ${horizontal} cm and ${vertical} cm; display zoom ${zoom}`
            : `原地图比例 1:${scale}，路线两段 ${horizontal} cm 与 ${vertical} cm；显示放大 ${zoom} 倍`
        }
      >
        <polyline
          data-map-route
          points={`50,40 ${50 + horizontal * u},40 ${50 + horizontal * u},${40 + vertical * u}`}
          className="ratio-route"
        />
        <line
          x1="50"
          y1="40"
          x2={50 + horizontal * u}
          y2={40 + vertical * u}
          className="ratio-straight"
        />
        {[
          [50, 40, 'A'],
          [50 + horizontal * u, 40, 'B'],
          [50 + horizontal * u, 40 + vertical * u, 'C'],
        ].map(([x, y, label]) => (
          <g key={String(label)}>
            <circle
              cx={Number(x)}
              cy={Number(y)}
              r="5"
              className="ratio-point"
            />
            <text x={Number(x) - 18} y={Number(y) - 12}>
              {label}
            </text>
          </g>
        ))}
        <text x={60 + (horizontal * u) / 2} y="25" textAnchor="middle">
          {horizontal} cm
        </text>
        <text x={64 + horizontal * u} y={50 + (vertical * u) / 2}>
          {vertical} cm
        </text>
        <line
          data-map-scale-bar
          x1="50"
          y1={h - 65}
          x2={50 + 2 * u}
          y2={h - 65}
          className="ratio-scale-bar"
        />
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={50 + i * u}
            x2={50 + i * u}
            y1={h - 72}
            y2={h - 58}
            className="ratio-axis"
          />
        ))}
        <text x="50" y={h - 33}>
          0
        </text>
        <text x={50 + 2 * u} y={h - 33} textAnchor="middle">
          {decimalText(m.barKm) ?? ratioText(m.barKm)} km
        </text>
        <text x="50" y={h - 9}>
          {mode === 'en' ? 'Original map scale' : '原地图比例'} 1:{scale}
        </text>
      </svg>
    </RatioFrame>
  );
}
export function ProportionGraph({
  kind = 'direct',
  rate = 3,
  wide = false,
  mode,
}: {
  kind?: CurveKind;
  rate?: number;
  wide?: boolean;
  mode: LanguageMode;
}) {
  const m = costCurve(kind, rate),
    maxY = m.minimumY * (wide ? 2 : 1),
    points = graphCoordinates(m.points, maxY);
  return (
    <RatioFrame
      mode={mode}
      caption={t(
        '假想价格规则已经给定，图线表示该规则在 0–8 L 连续量上的结果；不是仅凭几个点猜通用规律。横轴为升，纵轴为新西兰元；换纵轴范围不改变数值或关系。',
        'The fictional price rule is given. Its graph represents that rule for continuous quantities from 0–8 L; a few points alone do not establish a universal law. The horizontal axis is litres and the vertical axis NZ dollars. Changing the displayed range preserves all values and relationships.',
      )}
    >
      <svg
        viewBox="0 0 580 370"
        style={{ minWidth: 580, height: 370 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Given rule ${kind === 'square' ? 'y=x×x' : `y=${rate}x${kind === 'fee' ? '+4' : ''}`}; horizontal litres, vertical NZ dollars`
            : `给定规则 ${kind === 'square' ? 'y=x×x' : `y=${rate}x${kind === 'fee' ? '+4' : ''}`}，横轴升，纵轴新西兰元`
        }
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line
              x1="60"
              x2="500"
              y1={300 - i * 60}
              y2={300 - i * 60}
              className="ratio-grid-line"
            />
            <text x="45" y={305 - i * 60} textAnchor="end">
              {(maxY * i) / 4}
            </text>
          </g>
        ))}
        <line x1="60" y1="300" x2="510" y2="300" className="ratio-axis" />
        <line x1="60" y1="300" x2="60" y2="50" className="ratio-axis" />
        {[0, 2, 4, 6, 8].map((x) => (
          <text key={x} x={60 + x * 55} y="323" textAnchor="middle">
            {x}
          </text>
        ))}
        {kind === 'square' ? (
          <path
            data-proportion-line
            d={`M60,300 Q280,300 500,${points[points.length - 1]!.py}`}
            className="ratio-curve"
          />
        ) : (
          <polyline
            data-proportion-line
            points={points.map((p) => `${p.px},${p.py}`).join(' ')}
            className="ratio-curve"
          />
        )}
        {points
          .filter((_, i) => i % 2 === 0)
          .map((p) => (
            <circle
              key={p.x}
              data-graph-x={p.x}
              data-graph-y={p.y}
              cx={p.px}
              cy={p.py}
              r="4"
              className="ratio-point"
            />
          ))}
        <text x="18" y="28">
          NZ$
        </text>
        <text x="490" y="350">
          x (L)
        </text>
      </svg>
    </RatioFrame>
  );
}
