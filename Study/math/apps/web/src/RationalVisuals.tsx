import type { LanguageMode } from '@study/shared';
import { SignedFrame } from './SignedVisuals';
import { t } from './model';
import { rationalLine, valueR } from './rationalModels';
export function RationalLine({
  points,
  mode,
  segment,
}: {
  points: { value: string; label: string }[];
  mode: LanguageMode;
  segment?: { from: string; to: string };
}) {
  const m = rationalLine(points),
    xs = m.points.map((p) => p.x),
    left = Math.min(m.zero, ...xs),
    right = Math.max(m.zero, ...xs),
    to = segment ? m.x(valueR(segment.to)) : 0,
    from = segment ? m.x(valueR(segment.from)) : 0;
  return (
    <SignedFrame
      mode={mode}
      caption={t(
        `每一单位等分 ${m.grid} 格；${points.map((p) => `${p.label}=${p.value}`).join('，')}。重合位置合并标记，距离和方向分开说明。`,
        `${m.grid === 1 ? 'Each original unit is shown without further subdivision' : `Each unit has ${m.grid} equal subdivisions`}; ${points.map((p) => `${p.label}=${p.value}`).join(', ')}. Coincident positions share a marker; distinguish distance from direction.`,
      )}
      focus={{ min: left, max: right, point: right }}
    >
      <svg
        width={m.width}
        height="250"
        viewBox={`0 0 ${m.width} 250`}
        role="img"
        aria-label={
          mode === 'en' ? 'Equal-unit rational number line' : '有理数等单位数轴'
        }
      >
        <path d={`M24 130H${m.width - 24}`} stroke="currentColor" />
        {m.ticks.map((tick, i) => (
          <g key={i}>
            <path
              data-rational-tick
              d={`M${tick.x} ${tick.whole ? 120 : 125}V${tick.whole ? 140 : 135}`}
              stroke="currentColor"
            />
            {tick.whole && (
              <text x={tick.x} y="165" textAnchor="middle">
                {tick.label}
              </text>
            )}
          </g>
        ))}
        {segment && (
          <>
            <path
              data-rational-segment
              d={`M${from} 85H${to}`}
              stroke="#5954a3"
              strokeWidth="3"
            />
            {from !== to && (
              <path
                d={
                  to > from
                    ? `M${to - 8} 79L${to} 85L${to - 8} 91`
                    : `M${to + 8} 79L${to} 85L${to + 8} 91`
                }
                fill="none"
                stroke="#5954a3"
                strokeWidth="3"
              />
            )}
          </>
        )}
        {m.points.map((p, i) => (
          <g key={p.value} data-rational-value={p.value}>
            <circle cx={p.x} cy="130" r="6" fill="#5954a3" />
            <path
              d={`M${p.x} 140V${185 + i * 14}`}
              stroke="currentColor"
              strokeDasharray="3 3"
            />
            <text x={p.x} y={200 + i * 14} textAnchor="middle">
              {p.labels.join('=')}: {p.value}
            </text>
          </g>
        ))}
      </svg>
    </SignedFrame>
  );
}
