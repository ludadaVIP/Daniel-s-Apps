import { useId, useLayoutEffect, useRef } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  plotBounds,
  plotPosition,
  ticks,
  type PlotBounds,
  type PlotPoint,
} from './cartesianModels';
export type PlotCurve = { points: PlotPoint[]; name: string; color?: string };
export function CartesianPlot({
  bounds,
  points = [],
  curves = [],
  mode,
  xLabel = 'x',
  yLabel = 'y',
  caption,
  onPick,
  selected,
}: {
  bounds: PlotBounds;
  points?: PlotPoint[];
  curves?: PlotCurve[];
  mode: LanguageMode;
  xLabel?: string;
  yLabel?: string;
  caption?: LocalizedText;
  onPick?: (p: PlotPoint) => void;
  selected?: PlotPoint;
}) {
  const b = plotBounds(bounds),
    origin = plotPosition({ x: 0, y: 0 }, b),
    xs = ticks(b.xMin, b.xMax, b.xStep),
    ys = ticks(b.yMin, b.yMax, b.yStep),
    id = useId().replace(/:/g, ''),
    candidateRef = useRef<SVGGElement>(null),
    firstRender = useRef(true),
    interactive = !!onPick;
  useLayoutEffect(() => {
    if (!firstRender.current && interactive)
      candidateRef.current?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    firstRender.current = false;
  }, [interactive, selected?.x, selected?.y, b.xMin, b.xMax, b.yMin, b.yMax]);
  const key = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const p = selected ?? { x: 0, y: 0 };
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      event.preventDefault();
      const dx =
          event.key === 'ArrowLeft'
            ? -b.xStep
            : event.key === 'ArrowRight'
              ? b.xStep
              : 0,
        dy =
          event.key === 'ArrowUp'
            ? b.yStep
            : event.key === 'ArrowDown'
              ? -b.yStep
              : 0;
      onPick({
        x: Number(Math.max(b.xMin, Math.min(b.xMax, p.x + dx)).toFixed(8)),
        y: Number(Math.max(b.yMin, Math.min(b.yMax, p.y + dy)).toFixed(8)),
      });
    }
  };
  return (
    <figure className="math-cart-figure">
      <div
        className="math-cart-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Coordinate plot; scroll within the graph'
            : '坐标图；需要时在图内滚动'
        }
      >
        <svg
          viewBox="0 0 520 370"
          role={onPick ? 'group' : 'img'}
          tabIndex={onPick ? 0 : undefined}
          aria-label={
            onPick
              ? mode === 'en'
                ? 'Plotting board: arrow keys move the candidate'
                : '描点板：方向键移动候选点'
              : mode === 'en'
                ? 'Points on labelled Cartesian axes'
                : '带标记坐标轴上的点'
          }
          onKeyDown={key}
        >
          <defs>
            <marker
              id={id}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" />
            </marker>
          </defs>
          {xs.map((x) => {
            const p = plotPosition({ x, y: 0 }, b);
            return (
              <g key={`x/${x}`} data-x-tick={x}>
                <line x1={p.x} y1="30" x2={p.x} y2="310" stroke="#d9d5e3" />
                <text x={p.x} y={origin.y + 20} textAnchor="middle">
                  {x}
                </text>
              </g>
            );
          })}
          {ys.map((y) => {
            const p = plotPosition({ x: 0, y }, b);
            return (
              <g key={`y/${y}`} data-y-tick={y}>
                <line x1="64" y1={p.y} x2="464" y2={p.y} stroke="#d9d5e3" />
                {y !== 0 && (
                  <text x={origin.x - 10} y={p.y + 5} textAnchor="end">
                    {y}
                  </text>
                )}
              </g>
            );
          })}
          <line
            x1="56"
            y1={origin.y}
            x2="478"
            y2={origin.y}
            stroke="currentColor"
            strokeWidth="2"
            markerEnd={`url(#${id})`}
          />
          <line
            x1={origin.x}
            y1="318"
            x2={origin.x}
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            markerEnd={`url(#${id})`}
          />
          <text x="478" y={Math.min(350, origin.y + 38)} textAnchor="end">
            {xLabel}
          </text>
          <text x={origin.x + 12} y="18">
            {yLabel}
          </text>
          {curves.map((curve, i) => (
            <polyline
              key={i}
              data-curve={curve.name}
              points={curve.points
                .map((p) => {
                  const s = plotPosition(p, b);
                  return `${s.x},${s.y}`;
                })
                .join(' ')}
              fill="none"
              stroke={curve.color ?? '#5954a3'}
              strokeWidth="2.5"
            />
          ))}
          {onPick &&
            xs.flatMap((x) =>
              ys.map((y) => {
                const p = plotPosition({ x, y }, b);
                return (
                  <circle
                    key={`${x}/${y}`}
                    role="button"
                    tabIndex={-1}
                    aria-label={
                      mode === 'en'
                        ? `Plot at (${x}, ${y})`
                        : `描在 (${x}, ${y})`
                    }
                    cx={p.x}
                    cy={p.y}
                    r="10"
                    fill="transparent"
                    onClick={() => onPick({ x, y })}
                  />
                );
              }),
            )}
          {points.map((p, i) => {
            const s = plotPosition(p, b);
            return (
              <g
                key={i}
                data-plot-label={p.label ?? ''}
                data-coordinate={`${p.x},${p.y}`}
              >
                <path
                  d={`M${s.x},${origin.y} V${s.y} H${origin.x}`}
                  fill="none"
                  stroke="#9a6f26"
                  strokeDasharray="4 4"
                />
                <circle cx={s.x} cy={s.y} r="5" fill="#a14532" />
                <text x={s.x + 9} y={s.y - 9}>
                  {p.label ?? 'P'}
                </text>
              </g>
            );
          })}
          {selected &&
            (() => {
              const s = plotPosition(selected, b);
              return (
                <g
                  ref={candidateRef}
                  data-candidate-coordinate={`${selected.x},${selected.y}`}
                >
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="8"
                    fill="none"
                    stroke="#a14532"
                    strokeWidth="3"
                  />
                  <text x={s.x + 12} y={s.y + 18}>
                    P
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={
            caption ??
            t(
              '先读轴名、单位与每一格刻度，再按先 x 后 y 定位。两轴每格数值可以不同；改变显示范围不改变数据坐标，图上倾斜角度不代替变化率。',
              'Read axis names, units and tick intervals, then locate x before y. Axes may use different intervals. Rescaling does not change data coordinates; visual steepness does not replace a numerical rate.',
            )
          }
        />
      </figcaption>
    </figure>
  );
}
