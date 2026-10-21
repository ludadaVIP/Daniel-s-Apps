import { useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import { valueAt } from './calculusModels';
import { rational, textR } from './algebraModels';
import {
  integralAudit,
  riemannAudit,
  stepAccumulation,
  integralPolynomial,
  antiderivativePolynomial,
  integrationNumber as num,
  type IntegralFamily,
} from './integralModels';
export type PlotLine = {
  name: string;
  color?: string;
  points: [number, number][];
};
export type PlotBand = {
  lo: number;
  hi: number;
  top: (x: number) => number;
  bottom?: (x: number) => number;
  positive: boolean;
};
export const points = (
  f: (x: number) => number,
  a: number,
  b: number,
): [number, number][] =>
  Array.from({ length: 101 }, (_, i) => {
    const x = a + ((b - a) * i) / 100;
    return [x, f(x)];
  });
export function IntegralPlot({
  mode,
  name,
  caption,
  lines,
  bands = [],
  dots = [],
  xmin = 0,
  xmax = 4,
  xlabel = 'x',
  ylabel = 'y',
}: {
  mode: LanguageMode;
  name: LocalizedText;
  caption: LocalizedText;
  lines: PlotLine[];
  bands?: PlotBand[];
  dots?: { x: number; y: number; label: string; open?: boolean }[];
  xmin?: number;
  xmax?: number;
  xlabel?: string;
  ylabel?: string;
}) {
  const id = useId(),
    ys = [
      0,
      ...lines.flatMap((l) => l.points.map((p) => p[1])),
      ...bands.flatMap((b) =>
        [
          ...points(b.top, b.lo, b.hi),
          ...points(b.bottom ?? (() => 0), b.lo, b.hi),
        ].map((p) => p[1]),
      ),
      ...dots.map((d) => d.y),
    ],
    lo = 4 * Math.floor(Math.min(...ys) / 4),
    hi = 4 * Math.ceil(Math.max(...ys) / 4),
    ymin = lo === hi ? lo - 4 : lo,
    ymax = lo === hi ? hi + 4 : hi,
    span = xmax - xmin || 2,
    left = xmax === xmin ? xmin - 1 : xmin,
    right = xmax === xmin ? xmax + 1 : xmax,
    px = (x: number) => 60 + ((x - left) / (right - left)) * 540,
    py = (y: number) => 320 - ((y - ymin) / (ymax - ymin)) * 250;
  const path = (ps: [number, number][]) =>
    ps.map(([x, y]) => `${px(x)},${py(y)}`).join(' ');
  return (
    <DataFigure mode={mode} name={name} caption={caption}>
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
              y1={py(ymin + ((ymax - ymin) * i) / 4)}
              y2={py(ymin + ((ymax - ymin) * i) / 4)}
              stroke="#dbe5ea"
            />
            <text
              x="49"
              y={py(ymin + ((ymax - ymin) * i) / 4) + 4}
              textAnchor="end"
              fontSize="12"
            >
              {ymin + ((ymax - ymin) * i) / 4}
            </text>
            <text
              x={px(left + ((right - left) * i) / 4)}
              y="343"
              textAnchor="middle"
              fontSize="12"
            >
              {left + ((right - left) * i) / 4}
            </text>
          </g>
        ))}
        <line x1="60" x2="600" y1={py(0)} y2={py(0)} stroke="#34576a" />
        <line
          x1={px(Math.min(right, Math.max(left, 0)))}
          x2={px(Math.min(right, Math.max(left, 0)))}
          y1="70"
          y2="320"
          stroke="#34576a"
        />
        <g clipPath={`url(#${id})`}>
          {bands.map((b, i) => (
            <polygon
              key={i}
              data-interval={`${b.lo},${b.hi}`}
              fill={b.positive ? '#56aaa080' : '#e89d6880'}
              points={path([
                ...points(b.top, b.lo, b.hi),
                ...points(b.bottom ?? (() => 0), b.lo, b.hi).reverse(),
              ])}
              stroke={b.positive ? '#26887c' : '#c07642'}
            />
          ))}
          {lines.map((l, i) => (
            <polyline
              key={i}
              data-function={l.name}
              points={path(l.points)}
              fill="none"
              stroke={l.color ?? '#5c4e9c'}
              strokeWidth="2.5"
            />
          ))}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={px(d.x)}
              cy={py(d.y)}
              r="5"
              fill={d.open ? 'white' : '#dc7d27'}
              stroke="#dc7d27"
              strokeWidth="2"
            />
          ))}
        </g>
        <text x="62" y="40" fontSize="14">
          {ylabel}
        </text>
        <text x="600" y="371" textAnchor="end" fontSize="14">
          {xlabel}
        </text>
        {lines
          .filter((l, i, ls) => ls.findIndex((x) => x.name === l.name) === i)
          .slice(0, 3)
          .map((l, i) => (
            <text
              key={i}
              x={200 + i * 130}
              y="40"
              fill={l.color ?? '#5c4e9c'}
              fontSize="12"
            >
              {l.name}
            </text>
          ))}
        {dots
          .filter((d) => d.label)
          .slice(0, 2)
          .map((d, i) => (
            <text key={i} x="64" y={365 + i * 16} fontSize="11">
              {d.label}
            </text>
          ))}
        <title>
          {span === 2 && xmax === xmin
            ? 'Zero-length integration interval'
            : mode === 'en'
              ? name.en
              : name.zh}
        </title>
      </svg>
    </DataFigure>
  );
}
export function AccumulationFigure({
  mode,
  tRaw,
  rates,
  initial = 0,
  view = 'rate',
}: {
  mode: LanguageMode;
  tRaw: string;
  rates: number[];
  initial?: number;
  view?: 'rate' | 'amount';
}) {
  const m = stepAccumulation(tRaw, rates),
    edges = [0, 1, 3, 4],
    a = (x: number) =>
      rates.reduce(
        (s, q, i) =>
          s + q * Math.max(0, Math.min(x, edges[i + 1]!) - edges[i]!),
        0,
      ),
    isRate = view === 'rate';
  const lines: PlotLine[] = isRate
    ? rates.map((q, i) => ({
        name: 'q(t)',
        points: [
          [edges[i]!, q],
          [edges[i + 1]!, q],
        ],
      }))
    : [
        { name: 'A(t)', points: edges.map((x) => [x, a(x)]) },
        {
          name: 'V(t)',
          color: '#26887c',
          points: edges.map((x) => [x, initial + a(x)]),
        },
      ];
  const dots = isRate
    ? rates.flatMap((q, i) => [
        { x: edges[i]!, y: q, label: '' },
        ...(i < 2
          ? [{ x: edges[i + 1]!, y: q, label: '', open: true }]
          : [{ x: 4, y: q, label: '' }]),
      ])
    : [
        {
          x: num(m.t),
          y: num(m.amount),
          label: `A(${tRaw})=${textR(m.amount)} L`,
        },
      ];
  return (
    <IntegralPlot
      mode={mode}
      name={t('分段率与累积图', 'Piecewise rate and accumulation')}
      caption={t(
        isRate
          ? '时间为分钟，率为升/分钟，着色矩形按实际已经历宽度计算，面积单位升。跳点实心为右侧定义值，空心为左极限；单点不贡献面积。'
          : 'A计新增量，V计初始量加新增量，单位升。斜率来自原率；跳点处A连续，但两侧斜率可能不同。',
        isRate
          ? 'Time is minutes, rate L/min. Shaded rectangles use actual elapsed widths and represent litres. At jumps a filled point is the right-sided value and an open point the left limit. A single point contributes no area.'
          : 'A measures added litres; V adds initial litres. Slopes come from rates. A stays continuous at rate jumps, though its one-sided slopes may differ.',
      )}
      lines={lines}
      bands={
        isRate
          ? m.pieces
              .filter((p) => p.width[0] > 0n)
              .map((p) => ({
                lo: num(p.left),
                hi: num(p.until),
                top: () => num(p.rate),
                positive: true,
              }))
          : []
      }
      dots={dots}
      xlabel="t (min)"
      ylabel={isRate ? 'q (L/min)' : 'A, V (L)'}
    />
  );
}
export function RiemannFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof riemannAudit>;
}) {
  const f = (x: number) =>
    num(valueAt(m.p, rational(BigInt(Math.round(x * 1e6)), 1000000n)));
  return (
    <IntegralPlot
      mode={mode}
      name={t('实际宽度的黎曼矩形', 'Riemann rectangles with actual widths')}
      caption={t(
        `f=${m.raw}。每格用真实宽Δx与采样高度相乘；着色是近似矩形，紫线为曲线。横轴x，纵轴f(x)；当前分割不等于极限证明。`,
        `f=${m.raw}. Each rectangle uses its actual width and tagged height. Shading is the approximate sum and purple the curve. Axes are x and f(x); this finite partition is not a limit proof.`,
      )}
      xmin={num(m.edges[0]!)}
      xmax={num(m.edges.at(-1)!)}
      lines={[
        {
          name: 'f(x)',
          points: points(f, num(m.edges[0]!), num(m.edges.at(-1)!)),
        },
      ]}
      bands={m.cells.map((c) => ({
        lo: num(c.left),
        hi: num(c.right),
        top: () => num(c.height),
        positive: c.height[0] >= 0n,
      }))}
      dots={m.cells.map((c) => ({
        x: num(c.sample),
        y: num(c.height),
        label: '',
      }))}
    />
  );
}
export function SignedFigure({
  mode,
  m,
  between = false,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof integralAudit>;
  between?: boolean;
}) {
  const a = num(m.lo),
    b = num(m.hi),
    f = (x: number) =>
      num(valueAt(m.p, rational(BigInt(Math.round(x * 1e6)), 1000000n))),
    upper = between ? (x: number) => 2 * x : f,
    bottom = between ? (x: number) => x * x : () => 0;
  return (
    <IntegralPlot
      mode={mode}
      name={t(
        between ? '交点分段的两曲线面积' : '有向积分与几何面积',
        between
          ? 'Between-curve areas split at crossings'
          : 'Signed integral and geometric area',
      )}
      caption={t(
        `f=${m.raw}，积分从${textR(m.a)}到${textR(m.b)}。绿色为高度差≥0，橙色为负；图形按从小到大横坐标分块。${m.orientation === 0 ? '上下限相同，区间长度零、积分与面积均零。' : '交换上下限只反转积分方向，几何区域不变。'}${between ? '两轴单位米，面积平方米；曲线过交点后须交换上/下。' : '面积是每段绝对贡献相加；积分保留符号与方向。'}`,
        `f=${m.raw}, integrate from ${textR(m.a)} to ${textR(m.b)}. Green is nonnegative height difference, orange negative; pieces use increasing coordinates. ${m.orientation === 0 ? 'Equal endpoints give zero interval length, integral and area.' : 'Reversing bounds reverses the integral, preserving the geometric region.'} ${between ? 'Both axes are metres and area m²; upper/lower order changes at crossings.' : 'Area sums absolute contributions; the integral retains signs and orientation.'}`,
      )}
      xmin={a}
      xmax={b}
      xlabel={between ? 'x (m)' : 'x / t'}
      ylabel={between ? 'y (m)' : 'f(x) / rate'}
      lines={
        between
          ? [
              { name: 'y=2x', points: points(upper, a, b) },
              { name: 'y=x²', color: '#26887c', points: points(bottom, a, b) },
            ]
          : [{ name: `f=${m.raw}`, points: points(f, a, b) }]
      }
      bands={m.pieces.map((p) => ({
        lo: num(p.left),
        hi: num(p.right),
        top: upper,
        bottom,
        positive: p.positive,
      }))}
      dots={
        m.orientation === 0
          ? [{ x: a, y: f(a), label: `a=b=${textR(m.a)}` }]
          : []
      }
    />
  );
}
export function PrimitiveFigure({
  mode,
  raw,
  c,
}: {
  mode: LanguageMode;
  raw: string;
  c: number;
}) {
  const p = integralPolynomial(raw),
    F = antiderivativePolynomial(p),
    f = (x: number) =>
      num(valueAt(F, rational(BigInt(Math.round(x * 1e6)), 1000000n)));
  return (
    <IntegralPlot
      mode={mode}
      name={t('相同导数的原函数族', 'Primitives sharing the same derivative')}
      caption={t(
        `被积函数f=${raw}。三条线是F₀−3、F₀+${c}、F₀+5，均以f为导数；垂直平移改函数值，不改斜率。重复的常数会使曲线重合，未减少完整族。`,
        `Integrand f=${raw}. Curves F₀−3, F₀+${c}, F₀+5 all differentiate to f. Vertical translation changes values, preserving slopes. Equal constants cause coinciding curves, without reducing the full family.`,
      )}
      xmin={-2}
      xmax={2}
      lines={[-3, c, 5].map((v, i) => ({
        name: `F₀${v < 0 ? '' : '+'}${v}`,
        color: ['#5c4e9c', '#dc7d27', '#26887c'][i],
        points: points((x) => f(x) + v, -2, 2),
      }))}
    />
  );
}
export function IntegrationHook({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: string;
}): ReactNode {
  if (kind === 'integral-accumulation')
    return <AccumulationFigure mode={mode} tRaw="5/2" rates={[2, 4, 1]} />;
  if (kind === 'integral-riemann')
    return (
      <RiemannFigure
        mode={mode}
        m={riemannAudit('square', ['0', '1/2', '1', '3/2', '2'], 'middle')}
      />
    );
  if (kind === 'integral-primitive')
    return <PrimitiveFigure mode={mode} raw="3x^2-4" c={0} />;
  const family: IntegralFamily =
    kind === 'integral-applications'
      ? 'gap'
      : kind === 'integral-ftc'
        ? 'square'
        : 'crossLine';
  return (
    <SignedFigure
      mode={mode}
      m={integralAudit(family, '0', family === 'crossLine' ? '3' : '2')}
      between={kind === 'integral-applications'}
    />
  );
}
