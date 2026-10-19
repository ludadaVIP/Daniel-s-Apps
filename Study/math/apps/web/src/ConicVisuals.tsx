import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import { cn, conicPoint, type FocusConic, type PlaneLine } from './conicModels';
import { coordinateText, type Coordinate } from './cartesianModels';
export type ConicMark = { name: string; point: Coordinate; color?: string };
export type ConicSegment = {
  name: string;
  from: Coordinate;
  to: Coordinate;
  dashed?: boolean;
};
export function ConicFigure({
  mode,
  model,
  line,
  circle,
  points = [],
  segments = [],
  wide = false,
  caption,
}: {
  mode: LanguageMode;
  model?: FocusConic;
  line?: PlaneLine;
  circle?: { centre: Coordinate; radiusSquare: number };
  points?: ConicMark[];
  segments?: ConicSegment[];
  wide?: boolean;
  caption: LocalizedText;
}) {
  const id = useId().replace(/:/g, ''),
    bound = wide ? 20 : 10,
    scale = 500 / (2 * bound),
    px = (x: number) => 70 + (x + bound) * scale,
    py = (y: number) => 540 - (y + bound) * scale;
  const xy = (p: Coordinate) => [cn(p[0]), cn(p[1])];
  const path = (ps: number[][]) =>
    ps.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x!)} ${py(y!)}`).join(' ');
  const curves: number[][][] = [];
  if (model) {
    const h = cn(model.centre[0]),
      k = cn(model.centre[1]),
      a = cn(model.a),
      b = cn(model.b);
    const pos = (u: number, v: number) =>
      model.axis === 'horizontal' ? [h + u, k + v] : [h + v, k + u];
    if (model.kind === 'ellipse')
      curves.push(
        Array.from({ length: 241 }, (_, i) =>
          pos(
            a * Math.cos((i * Math.PI) / 120),
            b * Math.sin((i * Math.PI) / 120),
          ),
        ),
      );
    if (model.kind === 'parabola')
      curves.push(
        Array.from({ length: 241 }, (_, i) => {
          const v = -25 + (50 * i) / 240;
          return pos((v * v) / (4 * cn(model.p!)), v);
        }),
      );
    if (model.kind === 'hyperbola')
      for (const sign of [-1, 1])
        curves.push(
          Array.from({ length: 241 }, (_, i) => {
            const u = -3 + (6 * i) / 240;
            return pos(sign * a * Math.cosh(u), b * Math.sinh(u));
          }),
        );
  }
  const grouped = new Map<string, ConicMark[]>();
  points.forEach((p) => {
    const key = coordinateText(p.point),
      found = grouped.get(key) ?? [];
    found.push(p);
    grouped.set(key, found);
  });
  const outside = points.filter((p) =>
    xy(p.point).some((n) => Math.abs(n) > bound),
  );
  const occupied: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }[] = [];
  const labels = [...grouped]
    .filter(([, m]) => xy(m[0]!.point).every((v) => Math.abs(v) <= bound))
    .map(([key, marks]) => {
      const p = xy(marks[0]!.point),
        x = px(p[0]!),
        y = py(p[1]!),
        text = marks.map((m) => m.name).join('/'),
        width = text.length * 12;
      const candidates = [
        [10, -10],
        [-10, -10],
        [10, 27],
        [-10, 27],
        [10, -34],
        [-10, -34],
        [10, 51],
        [-10, 51],
      ];
      let chosen = {
        x: Math.min(580 - width, Math.max(70, x + 10)),
        y: Math.min(530, Math.max(60, y - 10)),
      };
      for (const [dx, dy] of candidates) {
        const left = x + dx! - (dx! < 0 ? width : 0),
          baseline = y + dy!,
          rect = {
            left,
            right: left + width,
            top: baseline - 21,
            bottom: baseline + 4,
          };
        if (
          rect.left < 70 ||
          rect.right > 590 ||
          rect.top < 35 ||
          rect.bottom > 540
        )
          continue;
        if (
          occupied.some(
            (b) =>
              rect.left < b.right + 4 &&
              rect.right > b.left - 4 &&
              rect.top < b.bottom + 4 &&
              rect.bottom > b.top - 4,
          )
        )
          continue;
        if (
          points.some((m) => {
            const q = xy(m.point),
              qx = px(q[0]!),
              qy = py(q[1]!);
            return (
              qx > rect.left - 5 &&
              qx < rect.right + 5 &&
              qy > rect.top - 5 &&
              qy < rect.bottom + 5
            );
          })
        )
          continue;
        chosen = { x: left, y: baseline };
        break;
      }
      occupied.push({
        left: chosen.x,
        right: chosen.x + width,
        top: chosen.y - 21,
        bottom: chosen.y + 4,
      });
      return { key, text, ...chosen };
    });
  const ticks = Array.from({ length: 11 }, (_, i) => -bound + (i * bound) / 5);
  let lineEnds: number[][] = [];
  if (line) {
    const a = cn(line.a),
      b = cn(line.b),
      c = cn(line.c);
    lineEnds =
      b !== 0
        ? [
            [-30, (-c + 30 * a) / b],
            [30, (-c - 30 * a) / b],
          ]
        : [
            [-c / a, -30],
            [-c / a, 30],
          ];
  }
  return (
    <>
      <DataFigure
        mode={mode}
        name={t(
          '解析几何图；可在图内滚动',
          'Analytic geometry diagram; scroll within the figure',
        )}
        caption={caption}
      >
        <svg
          viewBox="0 0 640 610"
          role="img"
          aria-label={
            mode === 'en'
              ? `Equal-unit coordinate plane, window ±${bound}`
              : `同单位坐标平面，视窗±${bound}`
          }
        >
          <defs>
            <clipPath id={`conic-${id}`}>
              <rect x="70" y="40" width="500" height="500" />
            </clipPath>
          </defs>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={px(v)} x2={px(v)} y1="40" y2="540" stroke="#ded9e6" />
              <line x1="70" x2="570" y1={py(v)} y2={py(v)} stroke="#ded9e6" />
              {v !== 0 && (
                <>
                  <text x={px(v)} y="568" textAnchor="middle">
                    {v}
                  </text>
                  <text x="58" y={py(v) + 5} textAnchor="end">
                    {v}
                  </text>
                </>
              )}
            </g>
          ))}
          <path
            d={`M60 ${py(0)}H590M${px(0)} 28V550`}
            stroke="#8e869c"
            fill="none"
          />
          <text x="605" y={py(0) + 19}>
            x
          </text>
          <text x={px(0) + 12} y="22">
            y
          </text>
          <text x={px(0) + 7} y={py(0) + 20}>
            0
          </text>
          <g clipPath={`url(#conic-${id})`}>
            {curves.map((ps, i) => (
              <path
                key={i}
                data-conic-branch={
                  model?.kind === 'hyperbola'
                    ? i === 0
                      ? '-1'
                      : '1'
                    : undefined
                }
                d={path(ps)}
                fill="none"
                stroke="#6652a1"
                strokeWidth="2.5"
              />
            ))}
            {line && (
              <path
                d={path(lineEnds)}
                data-plane-line="true"
                fill="none"
                stroke="#6652a1"
                strokeWidth="2.5"
              />
            )}
            {circle && circle.radiusSquare > 0 && (
              <circle
                cx={px(cn(circle.centre[0]))}
                cy={py(cn(circle.centre[1]))}
                r={Math.sqrt(circle.radiusSquare) * scale}
                fill="none"
                stroke="#6652a1"
                strokeWidth="2.5"
                data-circle-radius={Math.sqrt(circle.radiusSquare)}
              />
            )}
            {model?.directrix && (
              <line
                data-directrix-axis={model.directrix.axis}
                data-directrix-value={cn(model.directrix.value)}
                x1={
                  model.directrix.axis === 'x'
                    ? px(cn(model.directrix.value))
                    : 70
                }
                x2={
                  model.directrix.axis === 'x'
                    ? px(cn(model.directrix.value))
                    : 570
                }
                y1={
                  model.directrix.axis === 'y'
                    ? py(cn(model.directrix.value))
                    : 40
                }
                y2={
                  model.directrix.axis === 'y'
                    ? py(cn(model.directrix.value))
                    : 540
                }
                stroke="#867953"
                strokeWidth="2"
                strokeDasharray="7 5"
              />
            )}
            {segments.map((s) => {
              const a = xy(s.from),
                b = xy(s.to);
              return (
                <line
                  key={s.name}
                  data-distance-name={s.name}
                  data-from={coordinateText(s.from)}
                  data-to={coordinateText(s.to)}
                  x1={px(a[0]!)}
                  y1={py(a[1]!)}
                  x2={px(b[0]!)}
                  y2={py(b[1]!)}
                  stroke={s.dashed ? '#9a6b18' : '#50796d'}
                  strokeWidth="2"
                  strokeDasharray={s.dashed ? '6 4' : undefined}
                />
              );
            })}
            {[...grouped].map(([key, marks]) => {
              const p = xy(marks[0]!.point);
              return (
                <circle
                  key={key}
                  data-point-names={marks.map((m) => m.name).join('/')}
                  data-coordinate={key}
                  cx={px(p[0]!)}
                  cy={py(p[1]!)}
                  r="4"
                  fill={marks[0]!.color ?? '#493b74'}
                />
              );
            })}
          </g>
          {labels.map((label) => (
            <text key={label.key} x={label.x} y={label.y} textAnchor="start">
              {label.text}
            </text>
          ))}
        </svg>
      </DataFigure>
      {outside.length > 0 && (
        <p role="status">
          {mode === 'en' ? 'Outside this viewing window: ' : '超出当前图窗：'}
          {outside.map((p) => `${p.name}${coordinateText(p.point)}`).join('; ')}
        </p>
      )}
    </>
  );
}
export function FocalFigure({
  mode,
  model,
  trace = '1/2',
  branch = 1,
  wide = false,
}: {
  mode: LanguageMode;
  model: FocusConic;
  trace?: string;
  branch?: 1 | -1;
  wide?: boolean;
}) {
  const s = conicPoint(model, trace, branch),
    par = model.kind === 'parabola';
  return (
    <ConicFigure
      mode={mode}
      model={model}
      wide={wide}
      points={[
        { name: par ? 'V' : 'C', point: model.centre },
        { name: par ? 'F' : 'F1', point: model.focusMinus },
        ...(!par ? [{ name: 'F2', point: model.focusPlus }] : []),
        { name: 'P', point: s.point },
        ...(s.directrixFoot ? [{ name: 'D', point: s.directrixFoot }] : []),
      ]}
      segments={[
        { name: par ? 'PF' : 'PF1', from: s.point, to: model.focusMinus },
        {
          name: par ? 'PD' : 'PF2',
          from: s.point,
          to: s.directrixFoot ?? model.focusPlus,
          dashed: true,
        },
      ]}
      caption={t(
        '实线和虚线标识两段距离；字母与精确表对应，重合点合并名字。两轴同单位；图窗边缘只是截取范围，曲线可能继续延伸。有限描点帮助观察，普遍结论仍须由距离条件证明。',
        'Solid and dashed segments identify the two distances; letters match the exact table and coincident points share names. Axes use equal units. The viewing window clips curves that may continue beyond it. Sampled points support observation; prove general statements from the distance condition.',
      )}
    />
  );
}
