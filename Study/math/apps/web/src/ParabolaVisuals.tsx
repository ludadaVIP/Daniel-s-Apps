import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { readRational } from './rationalModels';
import { textR } from './algebraModels';
import { numericQ } from './quadraticModels';
import { radicalText } from './radicalModels';
import { approximateRoot, QuadraticFrame } from './QuadraticVisuals';
import {
  parabolaModel,
  parabolaAt,
  horizontalIntersections,
} from './parabolaModels';
export type ParabolaDomain = { lower: string; upper: string; whole?: boolean };
export type ParabolaWindow = 'area' | 'score' | 'signal';
export function parabolaCurve(
  source: string,
  wide = false,
  domain?: ParabolaDomain,
  window?: ParabolaWindow,
) {
  const m = parabolaModel(source),
    xmin = window ? (window === 'area' ? 0 : -1) : wide ? -8 : -4,
    xmax = window ? (window === 'signal' ? 3 : 6) : wide ? 12 : 6,
    ymin = window ? 0 : wide ? -10 : -6,
    ymax = window
      ? window === 'area'
        ? 30
        : window === 'score'
          ? 10
          : 12
      : wide
        ? 30
        : 10,
    xStep = window ? 1 : wide ? 2 : 1,
    yStep = window
      ? window === 'area'
        ? 5
        : window === 'score'
          ? 2
          : 2
      : wide
        ? 5
        : 2,
    lo = domain ? Math.max(xmin, numericQ(readRational(domain.lower))) : xmin,
    hi = domain ? Math.min(xmax, numericQ(readRational(domain.upper))) : xmax,
    a = numericQ(m.a),
    b = numericQ(m.b),
    c = numericQ(m.c),
    f = (x: number) => a * x * x + b * x + c,
    span = hi - lo;
  return {
    m,
    xmin,
    xmax,
    ymin,
    ymax,
    xStep,
    yStep,
    lo,
    hi,
    control: [
      { x: lo, y: f(lo) },
      { x: lo + span / 2, y: f(lo) + ((2 * a * lo + b) * span) / 2 },
      { x: hi, y: f(hi) },
    ],
    f,
  };
}
export function ParabolaGraph({
  source,
  mode,
  wide = false,
  shown = false,
  level,
  domain,
  mirrorDistance,
  reference = false,
  cursor,
  xUnit = '',
  yUnit = '',
  window,
}: {
  source: string;
  mode: LanguageMode;
  wide?: boolean;
  shown?: boolean;
  level?: string;
  domain?: ParabolaDomain;
  mirrorDistance?: number;
  reference?: boolean;
  cursor?: string;
  xUnit?: string;
  yUnit?: string;
  window?: ParabolaWindow;
}) {
  const id = useId().replace(/:/g, ''),
    g = parabolaCurve(source, wide, domain, window),
    x = (v: number) => 60 + ((v - g.xmin) / (g.xmax - g.xmin)) * 480,
    y = (v: number) => 300 - ((v - g.ymin) / (g.ymax - g.ymin)) * 270,
    inside = (px: number, py: number) =>
      px >= g.xmin && px <= g.xmax && py >= g.ymin && py <= g.ymax,
    allowed = (px: number) =>
      !domain ||
      (px >= numericQ(readRational(domain.lower)) &&
        px <= numericQ(readRational(domain.upper)) &&
        (!domain.whole || Number.isInteger(px))),
    v = g.m.vertex,
    vertex = v ? { x: numericQ(v.x), y: numericQ(v.y) } : null,
    target = level === undefined ? null : numericQ(readRational(level)),
    solutions =
      level === undefined ? null : horizontalIntersections(source, level),
    roots =
      solutions?.roots?.map((r) => ({
        x: approximateRoot(r),
        value: radicalText(r),
      })) ?? [],
    p = g.control,
    xticks = Array.from(
      { length: Math.round((g.xmax - g.xmin) / g.xStep) + 1 },
      (_, i) => g.xmin + i * g.xStep,
    ),
    yticks = Array.from(
      { length: Math.round((g.ymax - g.ymin) / g.yStep) + 1 },
      (_, i) => g.ymin + i * g.yStep,
    ),
    dots = domain?.whole
      ? Array.from(
          { length: Math.max(0, Math.floor(g.hi) - Math.ceil(g.lo) + 1) },
          (_, i) => {
            const px = Math.ceil(g.lo) + i;
            return { x: px, y: g.f(px) };
          },
        )
      : [],
    mirror =
      shown && vertex && mirrorDistance !== undefined
        ? [vertex.x - mirrorDistance, vertex.x + mirrorDistance]
            .filter((px, i, a) => a.indexOf(px) === i)
            .map((px, i) => ({ x: px, y: g.f(px), name: i ? 'Q' : 'P' }))
        : [],
    cursorPoint =
      cursor === undefined
        ? null
        : {
            x: numericQ(readRational(cursor)),
            y: numericQ(parabolaAt(source, readRational(cursor))),
          };
  const path = (points: { x: number; y: number }[]) =>
    `M${x(points[0]!.x)} ${y(points[0]!.y)} Q${x(points[1]!.x)} ${y(points[1]!.y)} ${x(points[2]!.x)} ${y(points[2]!.y)}`;
  return (
    <QuadraticFrame
      mode={mode}
      caption={t(
        `画原函数y=f(x)，横纵轴按各自标尺。${domain?.whole ? '只画全部允许的整数输入点，不连成连续曲线。' : domain ? '实线仅画题设闭区间，端点包含。' : '曲线裁在有标尺窗口中。'}${level !== undefined ? '目标为水平线y=' + level + '，交点纵坐标不一定为零。' : ''}根式标记位置为像素近似，文字与核验保留精确值。`,
        `This is the original y=f(x), with separately labelled axis scales. ${domain?.whole ? 'Only all allowed integer-input points are drawn, without a continuous join.' : domain ? 'The solid curve is restricted to the stated closed interval, including endpoints.' : 'The curve is clipped to the labelled window.'}${level !== undefined ? ' The target is horizontal y=' + level + '; intersection ordinates need not be zero.' : ''} Radical pixels are approximate; labels and audits retain exact values.`,
      )}
    >
      <svg
        viewBox="0 0 600 370"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Parabola with labelled axes and stated domain'
            : '标明坐标轴与范围的抛物线图'
        }
      >
        <defs>
          <clipPath id={id}>
            <rect x="60" y="30" width="480" height="270" />
          </clipPath>
        </defs>
        {xticks.map((n) => (
          <g key={`x${n}`}>
            <path d={`M${x(n)} 30V300`} stroke="#e0dbe8" />
            <text x={x(n)} y={y(0) + 18} fontSize="11" textAnchor="middle">
              {n}
            </text>
          </g>
        ))}
        {yticks.map((n) => (
          <g key={`y${n}`}>
            <path d={`M60 ${y(n)}H540`} stroke="#e0dbe8" />
            {n !== 0 && (
              <text x={x(0) - 8} y={y(n) + 4} fontSize="11" textAnchor="end">
                {n}
              </text>
            )}
          </g>
        ))}
        <path
          d={`M50 ${y(0)}H550M${x(0)} 310V20`}
          stroke="currentColor"
          fill="none"
        />
        <text x="548" y={y(0) - 8}>
          x
        </text>
        <text x={x(0) + 9} y="21">
          y
        </text>
        <g clipPath={`url(#${id})`}>
          {reference && (
            <path
              data-parabola-reference
              d={path([
                { x: g.xmin, y: g.xmin * g.xmin },
                {
                  x: (g.xmin + g.xmax) / 2,
                  y: g.xmin * g.xmin + (2 * g.xmin * (g.xmax - g.xmin)) / 2,
                },
                { x: g.xmax, y: g.xmax * g.xmax },
              ])}
              fill="none"
              stroke="#7d8f9f"
              strokeDasharray="5 4"
              strokeWidth="2"
            />
          )}
          {!domain?.whole && g.lo <= g.hi && (
            <path
              data-parabola-curve
              d={path(p)}
              fill="none"
              stroke="#5954a3"
              strokeWidth="3"
            />
          )}
          {dots.map((p) => (
            <circle
              key={p.x}
              data-parabola-integer={p.x}
              cx={x(p.x)}
              cy={y(p.y)}
              r="5"
              fill="#5954a3"
            />
          ))}
          {domain &&
            !domain.whole &&
            [
              numericQ(readRational(domain.lower)),
              numericQ(readRational(domain.upper)),
            ]
              .filter((px) => inside(px, g.f(px)))
              .map((px, i) => (
                <circle
                  key={i}
                  data-parabola-endpoint={px}
                  cx={x(px)}
                  cy={y(g.f(px))}
                  r="4"
                  fill="#5954a3"
                />
              ))}
          {target !== null && (
            <path
              data-parabola-target={level}
              d={`M60 ${y(target)}H540`}
              stroke="#a14532"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
          {shown && level === undefined && vertex && allowed(vertex.x) && (
            <path
              data-parabola-axis
              d={`M${x(vertex.x)} 30V300`}
              stroke="#a14532"
              strokeDasharray="3 4"
            />
          )}
          {shown &&
            level === undefined &&
            vertex &&
            inside(vertex.x, vertex.y) &&
            allowed(vertex.x) && (
              <g data-parabola-vertex>
                <circle
                  cx={x(vertex.x)}
                  cy={y(vertex.y)}
                  r="6"
                  fill="#a14532"
                />
                <text x={x(vertex.x) + 8} y={y(vertex.y) - 10} fontSize="12">
                  V
                </text>
              </g>
            )}
          {mirror
            .filter((p) => inside(p.x, p.y) && allowed(p.x))
            .map((p, i) => (
              <g key={i} data-parabola-mirror={p.name}>
                <circle cx={x(p.x)} cy={y(p.y)} r="5" fill="#357b71" />
                <text x={x(p.x) + 6} y={y(p.y) - 10} fontSize="12">
                  {p.name}
                </text>
              </g>
            ))}
          {shown &&
            target !== null &&
            roots
              .filter((r) => inside(r.x, target) && allowed(r.x))
              .map((r, i) => (
                <g key={i} data-parabola-intersection={r.value}>
                  <circle cx={x(r.x)} cy={y(target)} r="5" fill="#a14532" />
                  <text
                    x={x(r.x) + 6}
                    y={y(target) - 12 - (i % 2) * 17}
                    fontSize="12"
                  >
                    I{i + 1}
                  </text>
                </g>
              ))}
          {cursorPoint &&
            inside(cursorPoint.x, cursorPoint.y) &&
            allowed(cursorPoint.x) && (
              <g data-parabola-cursor>
                <circle
                  cx={x(cursorPoint.x)}
                  cy={y(cursorPoint.y)}
                  r="5"
                  fill="#357b71"
                />
                <text
                  x={x(cursorPoint.x) + 7}
                  y={y(cursorPoint.y) + 17}
                  fontSize="12"
                >
                  C
                </text>
              </g>
            )}
        </g>
        <text x="60" y="342" fontSize="12">
          x{xUnit ? ` (${xUnit})` : ''}: [{g.xmin},{g.xmax}]; y
          {yUnit ? ` (${yUnit})` : ''}: [{g.ymin},{g.ymax}]
        </text>
      </svg>
      {shown && (
        <div className="math-quadratic-legend">
          {v && level === undefined && (
            <p>
              V=({textR(v.x)}, {textR(v.y)});{' '}
              <Text mode={mode} text={t('对称轴', 'axis')} /> x={textR(v.x)}
              {domain && !allowed(numericQ(v.x)) && (
                <Text
                  mode={mode}
                  text={t(
                    '（连续延伸顶点不在允许输入中）',
                    ' (the continuous extension vertex is not an allowed input)',
                  )}
                />
              )}
            </p>
          )}
          {solutions && (
            <p>
              <Text
                mode={mode}
                text={t('全实数交点横坐标', 'All real intersection x-values')}
              />
              :{' '}
              {solutions.roots === null
                ? mode === 'en'
                  ? 'all real inputs'
                  : '所有实数输入'
                : roots.map((r) => r.value).join(', ') ||
                  (mode === 'en' ? 'none' : '没有')}
              ; y={level}
            </p>
          )}
          {mirror.length > 0 && v && (
            <p>
              {mirror.length === 1 ? 'P=Q' : 'P,Q'}: x=
              {mirror.map((p) => p.x).join(', ')};{' '}
              <Text
                mode={mode}
                text={t(
                  '等距于对称轴，函数值相同。',
                  'equal distances from the axis give equal outputs.',
                )}
              />
            </p>
          )}
          {reference && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '虚线参照y=x²；相同坐标窗口下比较同一离轴距离的高度差。',
                  'Dashed reference y=x²: compare output displacement at the same distance from the axis on the same scales.',
                )}
              />
            </p>
          )}
        </div>
      )}
    </QuadraticFrame>
  );
}
