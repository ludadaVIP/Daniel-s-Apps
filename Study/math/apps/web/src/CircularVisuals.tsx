import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  circularNumber,
  angleText,
  type CircularFamily,
} from './circularModels';
import { readRational } from './rationalModels';
export function CircularArt({
  mode,
  theta,
  radius = 1,
  arc = false,
}: {
  mode: LanguageMode;
  theta: number;
  radius?: number;
  arc?: boolean;
}) {
  const markerId = useId().replace(/:/g, '');
  const c = 210,
    scale = arc ? 45 : 130,
    r = radius * scale,
    x = c + r * Math.cos(theta),
    y = c - r * Math.sin(theta);
  const traceRadius = arc ? r : r * 0.85;
  const sweep = Array.from({ length: 241 }, (_, i) => {
    const u = (theta * i) / 240;
    return `${c + traceRadius * Math.cos(u)},${c - traceRadius * Math.sin(u)}`;
  }).join(' ');
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? 'Directed circle diagram' : '有向圆图'}
      >
        <svg
          viewBox="0 0 440 420"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Circle with signed horizontal and vertical projections'
              : '圆上的带符号横纵投影'
          }
        >
          <defs>
            <marker
              id={`turn-${markerId}`}
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10Z" fill="#b46716" />
            </marker>
          </defs>
          <path d={`M35 ${c}H400M${c} 30V390`} stroke="#9994a9" fill="none" />
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="#6254a1"
            strokeWidth="3"
          />
          <polyline
            points={sweep}
            markerEnd={theta === 0 ? undefined : `url(#turn-${markerId})`}
            fill="none"
            stroke="#b46716"
            strokeWidth="4"
          />
          <path
            d={`M${c} ${c}L${x} ${y}M${c} ${c}H${c + r}`}
            stroke="#6254a1"
            fill="none"
            strokeWidth="2"
          />
          <path
            d={`M${x} ${y}V${c}M${x} ${y}H${c}`}
            stroke="#329083"
            strokeDasharray="6 4"
            fill="none"
          />
          <circle cx={x} cy={y} r="6" fill="#a14532" />
          <text x="402" y={c - 10}>
            x
          </text>
          <text x={c + 10} y="25">
            y
          </text>
          <text x={c + 9} y={c + 20}>
            O
          </text>
          <text
            x={Math.min(395, Math.max(20, x + 12))}
            y={Math.min(390, Math.max(25, y - 12))}
          >
            P
          </text>
          <text x="24" y="405">
            {arc ? `r=${radius}` : 'r=1; P=(cos θ, sin θ)'}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={
            arc
              ? t(
                  '同单位长度标尺，半径变化会实际改变圆大小。曲线沿有向角扫过；多周可能重合，完整转动量仍由θ标签保留。弧长为r|θ|，有向弧量为rθ。',
                  'One length scale: changing radius changes the drawn circle. The trace follows the directed angle; multiple turns can overlap, so the θ label retains full winding. Arc length is r|θ|, while the directed arc measure is rθ.',
                )
              : t(
                  '单位圆两轴同单位标尺；点坐标带符号。虚线投影只帮助读取坐标，不把负坐标当负长度；完整角度不因终点相同而改变。',
                  'The unit circle has equal scales on both axes and signed coordinates. Dashed projections help read coordinates without making lengths negative. Coincident endpoints do not change the original directed angle.',
                )
          }
        />
      </figcaption>
    </figure>
  );
}
export function WavePlot({
  mode,
  family = 'sin',
  a = 1,
  b = 1,
  h = 0,
  d = 0,
  query,
  compare = false,
  target,
  roots = [],
  domain,
  wide = false,
}: {
  mode: LanguageMode;
  family?: CircularFamily;
  a?: number;
  b?: number;
  h?: number;
  d?: number;
  query?: number;
  compare?: boolean;
  target?: number;
  roots?: number[];
  domain?: {
    low: number;
    high: number;
    lowClosed: boolean;
    highClosed: boolean;
  };
  wide?: boolean;
}) {
  const id = useId().replace(/:/g, ''),
    bound = wide ? 8 : 4,
    px = (x: number) => 70 + (x + 2) * 125,
    py = (y: number) => 400 - ((y + bound) * 360) / (2 * bound);
  const fn = (x: number, f: CircularFamily = family) =>
    d + a * Math[f](b * (x - h) * Math.PI);
  const inside = (x: number) =>
    !domain || (x >= domain.low && x <= domain.high);
  const path = (f: CircularFamily) => {
    let out = '',
      previousBucket: number | null = null;
    for (let i = 0; i <= 1000; i++) {
      const x = -2 + (4 * i) / 1000,
        u = b * (x - h) * Math.PI,
        bucket = Math.floor((u + Math.PI / 2) / Math.PI),
        y = fn(x, f);
      if (
        !inside(x) ||
        !Number.isFinite(y) ||
        (f === 'tan' && Math.abs(Math.cos(u)) < 1e-8)
      ) {
        previousBucket = null;
        continue;
      }
      const move =
        previousBucket === null || (f === 'tan' && bucket !== previousBucket);
      out += `${move ? 'M' : 'L'}${px(x).toFixed(3)} ${py(y).toFixed(3)}`;
      previousBucket = bucket;
    }
    return out;
  };
  const ends = domain
    ? [
        { x: domain.low, closed: domain.lowClosed },
        { x: domain.high, closed: domain.highClosed },
      ]
    : [];
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? 'Radian function graph' : '弧度函数图'}
      >
        <svg
          viewBox="0 0 640 470"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Wave graph; horizontal axis in radians'
              : '波形图；横轴单位为弧度'
          }
        >
          <defs>
            <clipPath id={id}>
              <rect x="70" y="40" width="500" height="360" />
            </clipPath>
          </defs>
          {[-2, -1, 0, 1, 2].map((x) => (
            <g key={x}>
              <path d={`M${px(x)} 40V400`} stroke="#e0dce8" />
              <text x={px(x)} y="430" textAnchor="middle">
                {x === 0
                  ? '0'
                  : angleText(readRational(String(x))).replace('pi', 'π')}
              </text>
            </g>
          ))}
          {Array.from({ length: 9 }, (_, i) => -bound + (i * bound) / 4).map(
            (y) => (
              <g key={y}>
                <path d={`M70 ${py(y)}H570`} stroke="#e0dce8" />
                <text x="58" y={py(y) + 5} textAnchor="end">
                  {y}
                </text>
              </g>
            ),
          )}
          <path
            d={`M60 ${py(0)}H590M${px(0)} 410V25`}
            stroke="#777184"
            fill="none"
          />
          <text x="625" y={py(0) + 20} textAnchor="end">
            x/rad
          </text>
          <text x={px(0) + 12} y="24">
            y
          </text>
          <g clipPath={`url(#${id})`}>
            <path
              d={path(family)}
              data-circular-curve={family}
              stroke="#6254a1"
              strokeWidth="3"
              fill="none"
            />
            {compare && (
              <path
                d={path(family === 'sin' ? 'cos' : 'sin')}
                data-circular-curve={family === 'sin' ? 'cos' : 'sin'}
                stroke="#ac6017"
                strokeWidth="2.5"
                strokeDasharray="8 4"
                fill="none"
              />
            )}
            {target !== undefined && (
              <path
                d={`M70 ${py(target)}H570`}
                data-circular-target={target}
                stroke="#27887d"
                strokeDasharray="5 4"
              />
            )}
            {query !== undefined &&
              inside(query) &&
              Math.abs(fn(query)) <= bound && (
                <circle
                  data-circular-query={query}
                  cx={px(query)}
                  cy={py(fn(query))}
                  r="6"
                  fill="#a14532"
                />
              )}
            {roots
              .filter((x) => x >= -2 && x <= 2)
              .map((x) => (
                <circle
                  key={x}
                  data-circular-root={x}
                  cx={px(x)}
                  cy={py(fn(x))}
                  r="6"
                  stroke="#7b3423"
                  fill="#b36548"
                />
              ))}
          </g>
          {ends
            .filter(
              (p) =>
                p.x >= -2 &&
                p.x <= 2 &&
                Math.abs(fn(p.x)) <= bound &&
                (family !== 'tan' ||
                  Math.abs(Math.cos(b * (p.x - h) * Math.PI)) > 1e-8),
            )
            .map((p, i) => (
              <circle
                key={i}
                data-circular-end={p.x}
                data-closed={p.closed}
                cx={px(p.x)}
                cy={py(fn(p.x))}
                r="6"
                stroke="#6254a1"
                fill={p.closed ? '#6254a1' : 'white'}
              />
            ))}
        </svg>
      </div>
      <figcaption>
        {query !== undefined && Math.abs(fn(query)) > bound && (
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '当前查询点超出纵向图窗，数学输出仍按原规则；扩大窗口查看。',
                'The queried point is outside the vertical window. Its mathematical value is unchanged; enlarge the window to view it.',
              )}
            />
          </p>
        )}
        <Text
          mode={mode}
          text={t(
            `横轴明确按弧度，标π而不是度数；纵窗±${bound}只裁切、不压平。紫实线为${family}模型${compare ? '，金虚线为另一基本函数' : ''}${target !== undefined ? '；青虚线为目标高度' : ''}。采样图用于观察，完整解由精确分支与原区间决定；正切不跨无定义点连线。`,
            `The horizontal axis is in radians with π ticks, not degrees; the ±${bound} vertical window clips rather than flattens. Purple solid: ${family} model${compare ? '; gold dashed: the other basic function' : ''}${target !== undefined ? '; teal dashed: target level' : ''}. Sampling supports observation; exact branches and the original interval decide complete roots. Tangent segments are not joined across poles.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
export const numericPi = (value: string) => circularNumber(readRational(value));
