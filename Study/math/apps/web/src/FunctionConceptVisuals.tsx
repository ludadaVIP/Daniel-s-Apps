import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  mappingModel,
  familyAt,
  rationalNumber,
  piecewiseModel,
  type MappingKind,
  type Family,
  type TransformParams,
  type InverseKind,
  type PieceKind,
} from './functionConceptModels';
import { readRational } from './rationalModels';
export type GraphPoint = {
  x: number;
  y: number;
  label?: string;
  closed?: boolean;
};
export type ConceptCurve = {
  name: string;
  points: GraphPoint[];
  color?: string;
  dash?: string;
};
const num = rationalNumber;
export function ConceptPlot({
  mode,
  curves = [],
  points = [],
  ends = [],
  wide = false,
  caption,
  xLabel = 'x',
  yLabel = 'y',
}: {
  mode: LanguageMode;
  curves?: ConceptCurve[];
  points?: GraphPoint[];
  ends?: GraphPoint[];
  wide?: boolean;
  caption: LocalizedText;
  xLabel?: string;
  yLabel?: string;
}) {
  const id = useId().replace(/:/g, ''),
    bound = wide ? 16 : 10,
    step = wide ? 4 : 2,
    scale = 500 / (2 * bound),
    px = (x: number) => 70 + (x + bound) * scale,
    py = (y: number) => 540 - (y + bound) * scale,
    inside = (p: GraphPoint) =>
      Math.abs(p.x) <= bound && Math.abs(p.y) <= bound;
  const grouped = [
    ...new Map(
      points.map((p) => [
        `${p.x},${p.y}`,
        {
          ...p,
          label: points
            .filter((q) => q.x === p.x && q.y === p.y)
            .map((q) => q.label ?? '')
            .filter(Boolean)
            .join('/'),
        },
      ]),
    ).values(),
  ];
  const occupied: {
    left: number;
    top: number;
    width: number;
    height: number;
  }[] = [
    {
      left: 605 - xLabel.length * 10,
      top: py(0) + 2,
      width: xLabel.length * 10,
      height: 22,
    },
  ];
  const labelBoxes = new Map<
    string,
    { left: number; top: number; width: number; height: number }
  >();
  for (const p of grouped.filter((p) => inside(p) && p.label)) {
    const width = p.label!.length * 10 + 4,
      height = 22;
    const candidates = [
      [px(p.x) + 10, py(p.y) - 28],
      [px(p.x) + 10, py(p.y) + 10],
      [px(p.x) - 10 - width, py(p.y) - 28],
      [px(p.x) - 10 - width, py(p.y) + 10],
    ].map(([left, top]) => ({
      left: Math.max(70, Math.min(570 - width, left!)),
      top: Math.max(50, Math.min(518, top!)),
      width,
      height,
    }));
    const box =
      candidates.find((a) =>
        occupied.every(
          (b) =>
            a.left >= b.left + b.width + 3 ||
            b.left >= a.left + a.width + 3 ||
            a.top >= b.top + b.height + 3 ||
            b.top >= a.top + a.height + 3,
        ),
      ) ?? candidates[0]!;
    occupied.push(box);
    labelBoxes.set(`${p.x},${p.y}`, box);
  }
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Function graph; scroll within plot'
            : '函数坐标图；需要时在图内滚动'
        }
      >
        <svg
          viewBox="0 0 640 610"
          role="img"
          aria-label={
            mode === 'en'
              ? `Function graph, equal units on both axes, window −${bound} to ${bound}`
              : `函数图，两轴单位长度相同，视窗−${bound}至${bound}`
          }
        >
          <defs>
            <clipPath id={id}>
              <rect x="70" y="40" width="500" height="500" />
            </clipPath>
          </defs>
          {Array.from(
            { length: (2 * bound) / step + 1 },
            (_, i) => -bound + i * step,
          ).map((v) => (
            <g key={v}>
              <path d={`M${px(v)} 40V540M70 ${py(v)}H570`} stroke="#e1ddea" />
              <text x={px(v)} y="577" textAnchor="middle">
                {v}
              </text>
              {v !== 0 && (
                <text x="58" y={py(v) + 5} textAnchor="end">
                  {v}
                </text>
              )}
            </g>
          ))}
          <path
            d={`M60 ${py(0)}H585m-8-5 8 5-8 5M${px(0)} 550V28m-5 8 5-8 5 8`}
            stroke="currentColor"
            fill="none"
          />
          <text x="605" y={py(0) + 20} textAnchor="end">
            {xLabel}
          </text>
          <text x={px(0) + 12} y="22">
            {yLabel}
          </text>
          <g clipPath={`url(#${id})`}>
            {curves.map((c) => (
              <polyline
                key={c.name}
                data-function-curve={c.name}
                points={c.points.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')}
                fill="none"
                stroke={c.color ?? '#6254a1'}
                strokeWidth="3"
                strokeDasharray={c.dash}
              />
            ))}
          </g>
          {ends.filter(inside).map((p, i) => (
            <circle
              key={i}
              data-function-end={`${p.x},${p.y}`}
              data-closed={p.closed !== false}
              cx={px(p.x)}
              cy={py(p.y)}
              r="6"
              fill={p.closed === false ? 'white' : '#6254a1'}
              stroke="#6254a1"
              strokeWidth="2"
            />
          ))}
          {grouped.filter(inside).map((p, i) => (
            <g
              key={i}
              data-function-point={p.label}
              data-coordinate={`${p.x},${p.y}`}
            >
              <circle cx={px(p.x)} cy={py(p.y)} r="5" fill="#a14532" />
              {p.label &&
                (() => {
                  const box = labelBoxes.get(`${p.x},${p.y}`)!;
                  return (
                    <>
                      <path
                        d={`M${px(p.x)} ${py(p.y)}L${box.left + box.width / 2} ${box.top + box.height / 2}`}
                        stroke="#b6a4a0"
                        fill="none"
                      />
                      <text x={box.left} y={box.top + 16}>
                        {p.label}
                      </text>
                    </>
                  );
                })()}
            </g>
          ))}
        </svg>
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
        <p>
          <Text
            mode={mode}
            text={t(
              `两轴同单位标尺；曲线裁在±${bound}视窗内，不压平域外图形。视窗不是定义域，画出的采样线用于观察而非证明。`,
              `Both axes use equal unit lengths. Curves are clipped at ±${bound}, never flattened into the window. A window is not a domain; sampled curves support observation, not proof.`,
            )}
          />
        </p>
        {grouped.some((p) => !inside(p)) && (
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '所选点有部分超出当前视窗；坐标数值仍按原规则，扩大视窗查看。',
                'Some selected points lie outside this window; their coordinates retain the original values. Enlarge the window to inspect them.',
              )}
            />
          </p>
        )}
      </figcaption>
    </figure>
  );
}
export const sampleCurve = (
  name: string,
  fn: (x: number) => number,
  lo: number,
  hi: number,
  color?: string,
  dash?: string,
): ConceptCurve => ({
  name,
  color,
  dash,
  points: Array.from({ length: 121 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / 120;
    return { x, y: fn(x) };
  }),
});
export function MappingView({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: MappingKind;
}) {
  const m = mappingModel(kind);
  if (kind === 'interval')
    return (
      <ConceptPlot
        mode={mode}
        curves={[sampleCurve('square-domain', (x) => x * x, -2, 3)]}
        ends={[
          { x: -2, y: 4 },
          { x: 3, y: 9 },
        ]}
        caption={t(
          '给定f(x)=x²，D=[−2,3]，陪域ℝ；实际值域[0,9]。连续规则已给，不是从这条采样折线猜出来。',
          'Given f(x)=x² on D=[−2,3], codomain ℝ; actual range [0,9]. The continuous rule is stipulated, not inferred from a sampled line.',
        )}
      />
    );
  const left = (x: string) => 75 + m.inputs.indexOf(x) * 43,
    right = (y: string) => 85 + m.codomain.indexOf(y) * 56;
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? 'Finite mapping arrows' : '有限对应箭头图'}
      >
        <svg
          viewBox="0 0 640 340"
          role="img"
          aria-label={`D={${m.inputs}}, C={${m.codomain}}; ${m.edges.map((p) => `${p.x}→${p.y}`).join('; ')}`}
        >
          <text x="130" y="30" textAnchor="middle">
            D
          </text>
          <text x="510" y="30" textAnchor="middle">
            C
          </text>
          <ellipse
            cx="130"
            cy="180"
            rx="75"
            ry="140"
            fill="#ecf3ed"
            stroke="#397c6a"
          />
          <ellipse
            cx="510"
            cy="180"
            rx="75"
            ry="140"
            fill="#f0ecf8"
            stroke="#6254a1"
          />
          {m.edges.map((p, i) => (
            <g key={i} data-mapping-edge={`${p.x},${p.y}`}>
              <path
                d={`M160 ${left(p.x)}L475 ${right(p.y)}`}
                stroke="#746a99"
                fill="none"
              />
              <path
                d={`M466 ${right(p.y) - 4}l9 4-9 4`}
                fill="none"
                stroke="#746a99"
              />
            </g>
          ))}
          {m.inputs.map((x) => (
            <text key={x} x="130" y={left(x) + 5} textAnchor="middle">
              {x}
            </text>
          ))}
          {m.codomain.map((y) => (
            <text key={y} x="510" y={right(y) + 5} textAnchor="middle">
              {y}
            </text>
          ))}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '逐个输入核“恰好一个输出”。不同输入可以共用输出，陪域里也可以有没用到的值。',
            'Audit exactly one output for each input. Different inputs may share an output; the codomain may contain unused values.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function FamilyView({
  mode,
  kind,
  lo,
  hi,
  points = [],
  wide = false,
}: {
  mode: LanguageMode;
  kind: Family;
  lo: number;
  hi: number;
  points?: GraphPoint[];
  wide?: boolean;
}) {
  return (
    <ConceptPlot
      mode={mode}
      wide={wide}
      curves={[
        sampleCurve(
          kind,
          (x) =>
            num(familyAt(kind, readRational(String(Number(x.toFixed(8)))))),
          lo,
          hi,
        ),
      ]}
      points={points}
      ends={[
        { x: lo, y: num(familyAt(kind, readRational(String(lo)))) },
        { x: hi, y: num(familyAt(kind, readRational(String(hi)))) },
      ]}
      caption={t(
        `给定函数只画${lo}≤x≤${hi}部分；严格单调性须对指定区间的任意x₁<x₂成立，奇偶性还须核原定义域。`,
        `Only the stipulated domain ${lo}≤x≤${hi} is drawn. Strict monotonicity needs every ordered pair in the study interval; parity also requires the original domain.`,
      )}
    />
  );
}
export function TransformView({
  mode,
  params,
  points = [],
  wide = false,
}: {
  mode: LanguageMode;
  params: TransformParams;
  points?: GraphPoint[];
  wide?: boolean;
}) {
  const source = (x: number) =>
      num(familyAt(params.family, readRational(String(Number(x.toFixed(8)))))),
    lo = params.restricted ? -2 : -5,
    hi = -lo;
  const transformed: ConceptCurve = {
    name: 'transformed',
    points: sampleCurve('source', source, lo, hi).points.map((p) => ({
      x: params.h + p.x / params.b,
      y: params.k + params.a * p.y,
    })),
  };
  const ends = params.restricted
    ? [
        { x: params.h - 2 / params.b, y: params.k + params.a * source(-2) },
        { x: params.h + 2 / params.b, y: params.k + params.a * source(2) },
      ]
    : [];
  return (
    <ConceptPlot
      mode={mode}
      wide={wide}
      curves={[
        {
          ...sampleCurve('source', source, lo, hi),
          color: '#3f8675',
          dash: '6 4',
        },
        transformed,
      ]}
      points={points}
      ends={ends}
      caption={t(
        '绿色虚线为原函数，紫色为变换后的函数；源点(u,f(u))对应(h+u/b,k+a f(u))。无界域时只绘源参数−5到5的示意弧，不能据弧端推定定义域。',
        'Green dashed: source; purple: transformed. A source point (u,f(u)) maps to (h+u/b,k+a f(u)). For an unbounded domain, only source parameters −5 to five are illustrated; curve ends do not define the domain.',
      )}
    />
  );
}
export function InverseView({
  mode,
  kind,
  wide = false,
}: {
  mode: LanguageMode;
  kind: InverseKind;
  wide?: boolean;
}) {
  const affine = kind === 'affine',
    lo = affine ? -2 : kind === 'square-positive' ? 0 : -3,
    hi = affine ? 4 : kind === 'square-negative' ? 0 : 3,
    curve = sampleCurve(
      'original',
      (x) => (affine ? 2 * x + 3 : x * x),
      lo,
      hi,
    ),
    swapped: ConceptCurve = {
      name: 'swapped',
      color: '#b07b2b',
      points: curve.points.map((p) => ({ x: p.y, y: p.x })),
    };
  return (
    <ConceptPlot
      mode={mode}
      wide={wide}
      curves={[
        curve,
        swapped,
        sampleCurve('y=x', (x) => x, -16, 16, '#777', '5 5'),
      ]}
      caption={t(
        '紫色为原函数，金色交换每点横纵坐标，关于y=x镜像。完整平方函数的金色图是关系而不是单值反函数；限制原定义域后才选定一支。',
        'Purple is the original; gold swaps each coordinate pair, reflecting in y=x. For the full square function, gold is a relation rather than a single-valued inverse function. Restrict the original domain to select a branch.',
      )}
    />
  );
}
export function PiecewiseView({
  mode,
  kind,
  query,
  wide = false,
}: {
  mode: LanguageMode;
  kind: PieceKind;
  query?: GraphPoint;
  wide?: boolean;
}) {
  const pieces = piecewiseModel(kind),
    ends: GraphPoint[] = [],
    curves: ConceptCurve[] = [],
    points: GraphPoint[] = query ? [query] : [];
  for (const [i, p] of pieces.entries())
    if (p.domain.kind === 'interval' && p.domain.low && p.domain.high) {
      const lo = num(p.domain.low),
        hi = num(p.domain.high),
        fn = (x: number) => Number(p.m) * x + Number(p.b);
      if (lo !== hi) curves.push(sampleCurve(`branch-${i}`, fn, lo, hi));
      ends.push(
        { x: lo, y: fn(lo), closed: p.domain.lowClosed },
        { x: hi, y: fn(hi), closed: p.domain.highClosed },
      );
    }
  // Draw excluded markers first; included values remain visible at shared points.
  ends.sort((a, b) => Number(a.closed) - Number(b.closed));
  return (
    <ConceptPlot
      mode={mode}
      wide={wide}
      curves={curves}
      points={points}
      ends={ends}
      xLabel={kind === 'parcel' ? 'm / kg' : 't / h'}
      yLabel="C / NZD"
      caption={t(
        '每条规则单独画，不跨跳跃连接。空心不含、实心包含端点；边界只归属于一条规则。此为虚构纸上费率。',
        'Each branch is drawn separately without joining jumps. Open markers exclude and filled markers include endpoints; each boundary belongs to one branch. These are fictional worksheet tariffs.',
      )}
    />
  );
}
