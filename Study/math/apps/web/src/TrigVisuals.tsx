import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  trigTriangle,
  trigValues,
  roundTrig,
  treeHeight,
  type TrigReference,
  type TrigFunction,
} from './trigModels';
import type { GeoPoint } from './congruenceModels';
export type TrigView = { rotation?: number; mirror?: boolean; zoom?: number };
export function trigScreen(
  p: GeoPoint,
  center: GeoPoint,
  unit: number,
  rotation = 0,
  mirror = false,
  zoom = 1,
) {
  const a = (rotation * Math.PI) / 180,
    x = (p.x - center.x) * (mirror ? -1 : 1),
    y = p.y - center.y;
  return {
    x: 340 + unit * zoom * (x * Math.cos(a) - y * Math.sin(a)),
    y: 220 - unit * zoom * (x * Math.sin(a) + y * Math.cos(a)),
  };
}
const points = (ps: GeoPoint[]) => ps.map((p) => `${p.x},${p.y}`).join(' ');
function SvgWords({
  x,
  mode,
  text,
}: {
  x: number;
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <>
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="18">
          {text.en}
        </tspan>
      )}
    </>
  );
}
export function TrigFrame({
  mode,
  children,
  caption,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
  caption: LocalizedText;
}) {
  return (
    <figure className="math-trig-figure">
      <div
        className="math-trig-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Trigonometry diagram; scroll locally'
            : '三角函数图；需要时在图内滚动'
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
function Right({ a, v, b }: { a: GeoPoint; v: GeoPoint; b: GeoPoint }) {
  const d1 = Math.hypot(a.x - v.x, a.y - v.y),
    d2 = Math.hypot(b.x - v.x, b.y - v.y);
  if (!d1 || !d2) return null;
  const u = { x: ((a.x - v.x) * 11) / d1, y: ((a.y - v.y) * 11) / d1 },
    w = { x: ((b.x - v.x) * 11) / d2, y: ((b.y - v.y) * 11) / d2 };
  return (
    <polyline
      data-trig-right
      points={points([
        { x: v.x + u.x, y: v.y + u.y },
        { x: v.x + u.x + w.x, y: v.y + u.y + w.y },
        { x: v.x + w.x, y: v.y + w.y },
      ])}
      fill="none"
      stroke="currentColor"
    />
  );
}
function Angle({
  a,
  v,
  b,
  label = 'θ',
  labelPoint,
}: {
  a: GeoPoint;
  v: GeoPoint;
  b: GeoPoint;
  label?: string;
  labelPoint?: GeoPoint;
}) {
  const start = Math.atan2(a.y - v.y, a.x - v.x);
  let sweep = Math.atan2(b.y - v.y, b.x - v.x) - start;
  while (sweep > Math.PI) sweep -= 2 * Math.PI;
  while (sweep < -Math.PI) sweep += 2 * Math.PI;
  const ps = Array.from({ length: 21 }, (_, i) => ({
    x: v.x + 20 * Math.cos(start + (sweep * i) / 20),
    y: v.y + 20 * Math.sin(start + (sweep * i) / 20),
  }));
  return (
    <g data-trig-angle>
      <polyline points={points(ps)} stroke="#a14532" fill="none" />
      <text
        x={labelPoint?.x ?? v.x + 42 * Math.cos(start + sweep / 2)}
        y={labelPoint?.y ?? v.y + 42 * Math.sin(start + sweep / 2) + 4}
        textAnchor="middle"
        fontSize="14"
      >
        {label}
      </text>
    </g>
  );
}
function TrianglePicture({
  mode,
  raw,
  unit,
  reference = 'A',
  right = true,
  lengths = {},
  showRoles = false,
  angleLabel = 'θ',
  outsideLabel = false,
  rotation = 0,
  mirror = false,
  zoom = 1,
}: {
  mode: LanguageMode;
  raw: Record<'A' | 'B' | 'C', GeoPoint>;
  unit: number;
  reference?: TrigReference;
  right?: boolean;
  lengths?: Partial<Record<'AB' | 'BC' | 'AC', string>>;
  showRoles?: boolean;
  angleLabel?: string;
  outsideLabel?: boolean;
} & TrigView) {
  const center = {
      x: (raw.A.x + raw.B.x + raw.C.x) / 3,
      y: (raw.A.y + raw.B.y + raw.C.y) / 3,
    },
    p = {
      A: trigScreen(raw.A, center, unit, rotation, mirror, zoom),
      B: trigScreen(raw.B, center, unit, rotation, mirror, zoom),
      C: trigScreen(raw.C, center, unit, rotation, mirror, zoom),
    },
    roles = {
      AB: 'H',
      BC: reference === 'A' ? 'O' : 'A',
      AC: reference === 'A' ? 'A' : 'O',
    },
    colors: Record<string, string> = {
      H: '#4e514b',
      O: '#6651a2',
      A: '#237e87',
    };
  return (
    <svg
      viewBox="0 0 680 440"
      role="img"
      aria-label={
        mode === 'en'
          ? 'Labelled triangle and reference-angle side roles'
          : '带标签三角形与参照角边的身份'
      }
    >
      {(['AB', 'BC', 'AC'] as const).map((side) => {
        const a = p[side[0] as keyof typeof p],
          b = p[side[1] as keyof typeof p],
          mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
          dx = mid.x - 340,
          dy = mid.y - 220,
          n = Math.hypot(dx, dy) || 1;
        return (
          <g key={side} data-trig-side={side}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={right && showRoles ? colors[roles[side]] : '#5954a3'}
              strokeWidth="3"
            />
            {right && lengths[side] && (
              <text
                x={mid.x + (dx / n) * 28}
                y={mid.y + (dy / n) * 28 + 4}
                textAnchor="middle"
                fontSize="14"
              >
                {side}: {lengths[side]}
                {showRoles ? ` · ${roles[side]}` : ''}
              </text>
            )}
          </g>
        );
      })}
      {right && <Right a={p.A} v={p.C} b={p.B} />}
      <circle
        data-trig-reference={reference}
        cx={p[reference].x}
        cy={p[reference].y}
        r="8"
        fill="none"
        stroke="#a14532"
      />
      {(['A', 'B', 'C'] as const).map((name) => {
        const q = p[name],
          dx = q.x - 340,
          dy = q.y - 220,
          n = Math.hypot(dx, dy) || 1;
        return (
          <g key={name} data-trig-point={name}>
            <circle cx={q.x} cy={q.y} r="3" fill="currentColor" />
            <text
              x={q.x + (dx / n) * 18}
              y={q.y + (dy / n) * 18 + 5}
              textAnchor="middle"
            >
              {name}
            </text>
          </g>
        );
      })}
      {right && (
        <Angle
          a={reference === 'A' ? p.C : p.A}
          v={p[reference]}
          b={reference === 'A' ? p.B : p.C}
          label={angleLabel === 'θ' ? '' : angleLabel}
          labelPoint={
            outsideLabel
              ? { x: p[reference].x - 40, y: p[reference].y + 5 }
              : undefined
          }
        />
      )}
      <text x="30" y="35">
        <SvgWords
          x={30}
          mode={mode}
          text={t(
            `参照角${reference}；${right ? '∠C=90°为已知' : '未给直角，不能套直角三角函数'}`,
            `Reference angle ${reference}; ${right ? 'C=90° is given' : 'no right angle is given'}`,
          )}
        />
      </text>
    </svg>
  );
}
export function TrigTriangleView({
  mode,
  adjacent = '4',
  opposite = '3',
  reference = 'A',
  scale = '1',
  right = true,
  showRoles = false,
  only,
  unknown,
  ...view
}: {
  mode: LanguageMode;
  adjacent?: string;
  opposite?: string;
  reference?: TrigReference;
  scale?: string;
  right?: boolean;
  showRoles?: boolean;
  only?: ('AB' | 'BC' | 'AC')[];
  unknown?: 'AB' | 'BC' | 'AC';
} & TrigView) {
  const m = trigTriangle(adjacent, opposite, reference, scale),
    k = Number(m.scale[0]) / Number(m.scale[1]),
    unit = 90 / Math.max(m.points.C.x / k, m.points.B.y / k),
    raw = right
      ? m.points
      : { ...m.points, B: { x: m.points.C.x * 0.72, y: m.points.B.y } },
    lengths = Object.fromEntries(
      Object.entries(m.sizes)
        .filter(([name]) => !only || only.includes(name as 'AB'))
        .map(([name, value]) => [name, name === unknown ? 'x' : value]),
    );
  if (unknown) lengths[unknown] = 'x';
  return (
    <TrigFrame
      mode={mode}
      caption={
        right
          ? t(
              'A、B、C的身份随图移动，C处直角给定。H为斜边AB；O与A分别表示相对于当前参照锐角的对边和邻直角边。图中长度同单位，统一缩放不改变比值。',
              'A, B and C retain their identities as the diagram moves. The right angle at C is given. H is hypotenuse AB; O and A denote opposite and adjacent legs relative to the selected acute angle. Lengths share one unit; uniform scaling preserves ratios.',
            )
          : t(
              '这个反例未给直角或任何边长，不以示意图外观补条件。对边的几何身份仍可讨论，但直角三角函数的边比公式需要直角前提。',
              'This counterexample supplies neither a right angle nor lengths. Do not add premises from appearance. Opposite-side identity may still be discussed, but right-triangle trig ratios require a right angle.',
            )
      }
    >
      <TrianglePicture
        mode={mode}
        raw={raw}
        unit={unit}
        reference={reference}
        right={right}
        lengths={lengths}
        showRoles={showRoles}
        {...view}
      />
    </TrigFrame>
  );
}
export function TrigAngleView({
  mode,
  degrees = 30,
  shown = false,
  ...view
}: { mode: LanguageMode; degrees?: number; shown?: boolean } & TrigView) {
  const v = trigValues(degrees),
    raw = {
      A: { x: 0, y: 0 },
      C: { x: 10 * v.cos, y: 0 },
      B: { x: 10 * v.cos, y: 10 * v.sin },
    };
  if (!v.acute)
    return (
      <TrigFrame
        mode={mode}
        caption={t(
          degrees === 90
            ? '边界布局不再是普通锐角直角三角形，不能把零邻边放进正切分母。'
            : '此0°布局退化，不是本课普通锐角直角三角形。',
          degrees === 90
            ? 'At this boundary the layout is degenerate; a zero adjacent side cannot be a tangent denominator.'
            : 'The 0° layout is degenerate, outside the ordinary acute right-triangle domain.',
        )}
      >
        <svg
          viewBox="0 0 680 260"
          role="img"
          aria-label={
            mode === 'en'
              ? degrees === 90
                ? 'Degenerate boundary; tangent denominator zero'
                : 'Degenerate zero-degree boundary'
              : degrees === 90
                ? '退化边界；正切分母为零'
                : '零度退化边界'
          }
        >
          <line
            x1="340"
            y1="220"
            x2="340"
            y2="40"
            stroke="#5954a3"
            strokeWidth="3"
          />
          <text x="350" y="220">
            {degrees === 90 ? 'A=C' : 'B=C'}
          </text>
          <text x="350" y="45">
            {degrees === 90 ? 'B' : 'A'}
          </text>
          <text x="30" y="35">
            <SvgWords
              x={30}
              mode={mode}
              text={
                degrees === 90
                  ? t(
                      'θ=90°；邻边为零，正切无定义',
                      'θ=90°; adjacent=0; tan undefined',
                    )
                  : t(
                      'θ=0°；对边为零，不是普通锐角三角形',
                      'θ=0°; opposite=0; not an acute triangle',
                    )
              }
            />
          </text>
        </svg>
      </TrigFrame>
    );
  return (
    <TrigFrame
      mode={mode}
      caption={t(
        '固定斜边10，改变锐角θ。对边为10 sinθ，邻边为10 cosθ，横纵长度按同一单位绘制；近似长度带≈，不冒充精确根式。',
        'The hypotenuse stays ten while acute θ changes. Opposite=10 sinθ and adjacent=10 cosθ, on equal horizontal and vertical length scales. Approximate lengths carry ≈ rather than claiming exact radicals.',
      )}
    >
      <TrianglePicture
        mode={mode}
        raw={raw}
        unit={18}
        angleLabel={`${degrees}°`}
        lengths={{}}
        showRoles
        outsideLabel
        {...view}
      />
      <p>
        AB=10; AC=10 cosθ{shown ? `≈${roundTrig(10 * v.cos, 3)}` : ''}; BC=10
        sinθ{shown ? `≈${roundTrig(10 * v.sin, 3)}` : ''}
      </p>
    </TrigFrame>
  );
}
export function TrigGraph({
  mode,
  degrees = 30,
  active = 'sin',
}: {
  mode: LanguageMode;
  degrees?: number;
  active?: TrigFunction;
}) {
  const id = useId().replace(/:/g, ''),
    map = (a: number, y: number) => ({
      x: 80 + (a / 90) * 520,
      y: 340 - (y / 4) * 260,
    }),
    functions: TrigFunction[] = ['sin', 'cos', 'tan'],
    colors = { sin: '#6651a2', cos: '#237e87', tan: '#a14532' },
    m = trigValues(degrees),
    value = m[active],
    visible = m.acute && value !== null && value <= 4;
  return (
    <TrigFrame
      mode={mode}
      caption={t(
        '横轴是度数θ、纵轴是无单位比值，不把两种轴单位当等长坐标。曲线只用于0<θ<90°；端点空心，正切90°无定义。大于4的正切在窗外，曲线被裁切，不压成水平平台。',
        'Horizontal θ is in degrees and vertical ratios are dimensionless. The axes represent different quantities. Curves use 0<θ<90° with open endpoints; tan90° is undefined. Tangent values above four lie outside the window: curves are clipped, not flattened.',
      )}
    >
      <svg
        viewBox="0 0 680 430"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Sine cosine and tangent on the acute-angle domain'
            : '锐角范围的正弦余弦正切曲线'
        }
      >
        <defs>
          <clipPath id={id}>
            <rect x="80" y="80" width="520" height="260" />
          </clipPath>
        </defs>
        {[0, 1, 2, 3, 4].map((y) => (
          <g key={y}>
            <line
              x1="80"
              y1={map(0, y).y}
              x2="600"
              y2={map(0, y).y}
              stroke="#dedbd5"
            />
            <text x="65" y={map(0, y).y + 5} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        {[0, 30, 45, 60, 90].map((a) => (
          <g key={a}>
            <line
              x1={map(a, 0).x}
              y1="80"
              x2={map(a, 0).x}
              y2="340"
              stroke="#e7e2ed"
            />
            <text x={map(a, 0).x} y="365" textAnchor="middle">
              {a}°
            </text>
          </g>
        ))}
        <g clipPath={`url(#${id})`}>
          {functions.map((f) => {
            const ps = Array.from({ length: 181 }, (_, i) => {
              const a = i * 0.5,
                v = trigValues(a)[f];
              return v === null ? null : map(a, v);
            }).filter((p): p is GeoPoint => p !== null);
            return (
              <polyline
                key={f}
                data-trig-curve={f}
                points={points(ps)}
                stroke={colors[f]}
                strokeWidth={active === f ? 3 : 2}
                strokeDasharray={
                  f === 'cos' ? '7 4' : f === 'tan' ? '3 3' : undefined
                }
                fill="none"
              />
            );
          })}
        </g>
        {functions.flatMap((f) =>
          [0, 90]
            .filter((a) => !(f === 'tan' && a === 90))
            .map((a) => {
              const p = map(a, trigValues(a)[f]!);
              return (
                <circle
                  key={`${f}${a}`}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#faf9f5"
                  stroke={colors[f]}
                />
              );
            }),
        )}
        {visible && (
          <circle
            data-trig-sample
            cx={map(degrees, value).x}
            cy={map(degrees, value).y}
            r="5"
            fill={colors[active]}
          />
        )}
        <text x="30" y="30">
          sin ━ · cos ┄ · tan ···
        </text>
        <text x="600" y="400" textAnchor="end">
          θ (°); {active} {degrees}°
        </text>
      </svg>
      {!visible && (
        <p>
          <Text
            mode={mode}
            text={
              value === null
                ? t(
                    '正切90°无定义，不绘制伪造的有限值。',
                    'tan90° is undefined; no artificial finite point is plotted.',
                  )
                : !m.acute
                  ? t(
                      '此端点不属于本课普通锐角图域。',
                      'This endpoint is outside the ordinary acute domain.',
                    )
                  : t(
                      '当前比值在所绘窗口外；没有把它钳到边界。',
                      'The current ratio is outside the plotted window; it is not clamped to the boundary.',
                    )
            }
          />
        </p>
      )}
    </TrigFrame>
  );
}
export function HeightView({
  mode,
  distance = 12,
  degrees = 45,
  eye = 1.5,
  distanceKind = 'horizontal',
  baseElevation = 0,
  knownLevel = true,
  zoom = 1,
}: {
  mode: LanguageMode;
  distance?: number;
  degrees?: number;
  eye?: number;
  distanceKind?: 'horizontal' | 'sight';
  baseElevation?: number;
  knownLevel?: boolean;
  zoom?: number;
}) {
  const m = treeHeight(distance, degrees, eye, distanceKind, baseElevation),
    unit = Math.min(380 / (m.horizontal + 2), 260 / (m.top + 1)) * zoom,
    P = (p: GeoPoint) => ({ x: 100 + p.x * unit, y: 350 - p.y * unit }),
    a = P({ x: 0, y: eye }),
    foot = P({ x: m.horizontal, y: eye }),
    top = P({ x: m.horizontal, y: m.top }),
    base = P({ x: m.horizontal, y: baseElevation });
  return (
    <TrigFrame
      mode={mode}
      caption={
        knownLevel
          ? t(
              '虚构条件：树直立，树基与观测地面同高；仪器高明确，仰角用度数。水平距离与视线距离不能混用，先求高于仪器的部分，再加仪器高度。',
              'Fictional givens: the tree is vertical and its base shares the observer ground level. Instrument height is supplied and elevation angle is in degrees. Distinguish horizontal from sight distance; find the rise above the instrument, then add its height.',
            )
          : t(
              '未给树基与观测地面同高。两种可能基面保留同一仰角、距离和树顶位置，却给不同树高；不能擅自把基面差设为零。',
              'The tree base is not given at observer ground level. Alternative base elevations preserve the same angle, distance and treetop but give different heights; do not assume the elevation difference is zero.',
            )
      }
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Fictional height triangle and instrument level'
            : '虚构测高三角形与仪器高度'
        }
      >
        <line
          x1="65"
          y1="350"
          x2={knownLevel ? base.x + 55 : 160}
          y2="350"
          stroke="currentColor"
        />
        <line
          x1={base.x - 30}
          y1={base.y}
          x2={base.x + 35}
          y2={base.y}
          stroke="currentColor"
        />
        <line
          data-trig-tree
          x1={base.x}
          y1={base.y}
          x2={top.x}
          y2={top.y}
          stroke="#237e87"
          strokeWidth="7"
        />
        <line
          x1={a.x}
          y1={a.y}
          x2={top.x}
          y2={top.y}
          stroke="#a14532"
          strokeWidth="3"
        />
        <line
          data-trig-horizontal
          x1={a.x}
          y1={a.y}
          x2={foot.x}
          y2={foot.y}
          stroke="#6651a2"
          strokeDasharray="6 4"
        />
        <line
          x1={foot.x}
          y1={foot.y}
          x2={top.x}
          y2={top.y}
          stroke="#6651a2"
          strokeDasharray="6 4"
        />
        <Right a={a} v={foot} b={top} />
        <Angle a={foot} v={a} b={top} label={`${degrees}°`} />
        <text x="62" y={(a.y + 350) / 2}>
          e={eye} m
        </text>
        <text x={base.x + 15} y={(top.y + base.y) / 2}>
          h=?
        </text>
        <text
          x={
            distanceKind === 'horizontal'
              ? (a.x + foot.x) / 2
              : (a.x + top.x) / 2
          }
          y={distanceKind === 'horizontal' ? a.y + 28 : (a.y + top.y) / 2 - 15}
          textAnchor="middle"
        >
          <SvgWords
            x={
              distanceKind === 'horizontal'
                ? (a.x + foot.x) / 2
                : (a.x + top.x) / 2
            }
            mode={mode}
            text={
              distanceKind === 'horizontal'
                ? t(`${distance} m · 水平距离`, `${distance} m · horizontal`)
                : t(`${distance} m · 视线距离`, `${distance} m · sight`)
            }
          />
        </text>
        {!knownLevel && (
          <text x={base.x + 10} y={base.y + 25}>
            <SvgWords
              x={base.x + 10}
              mode={mode}
              text={t(`树基高程=${baseElevation} m`, `base=${baseElevation} m`)}
            />
          </text>
        )}
        <text x="30" y="35">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              '高度、仪器高和水平/视线距离分别标记。',
              'Height, instrument level and horizontal/sight distance are labelled separately.',
            )}
          />
        </text>
      </svg>
    </TrigFrame>
  );
}
export function SlopeView({
  mode,
  rise = 3,
  run = 4,
  zoom = 1,
}: {
  mode: LanguageMode;
  rise?: number;
  run?: number;
  zoom?: number;
}) {
  const unit = Math.min(350 / run, 240 / rise) * zoom,
    a = { x: 130, y: 340 },
    c = { x: 130 + run * unit, y: 340 },
    b = { x: c.x, y: 340 - rise * unit };
  return (
    <TrigFrame
      mode={mode}
      caption={t(
        '虚构坡面：坡度百分数=竖直升高/水平前进×100%，不是除以坡面长度。坡角用反正切求，百分数与角度单位不同；横纵长度使用相同标尺。',
        'Fictional slope: percentage grade=vertical rise/horizontal run×100%, not rise/slope length. Use inverse tangent for the angle. Percentage and degrees are different quantities, on equal horizontal and vertical length scales.',
      )}
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Slope rise run and inclined length'
            : '坡面的升高、水平距离与斜长'
        }
      >
        <polygon
          points={points([a, c, b])}
          fill="#ece7f6"
          stroke="#5954a3"
          strokeWidth="2"
        />
        <Right a={a} v={c} b={b} />
        <Angle a={c} v={a} b={b} label="" />
        <text x={(a.x + c.x) / 2} y="370" textAnchor="middle">
          <SvgWords
            x={(a.x + c.x) / 2}
            mode={mode}
            text={t(`水平距=${run} m`, `run=${run} m`)}
          />
        </text>
        <text x={c.x + 18} y={(c.y + b.y) / 2}>
          <SvgWords
            x={c.x + 18}
            mode={mode}
            text={t(`竖升=${rise} m`, `rise=${rise} m`)}
          />
        </text>
        <text x="30" y="35">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              '斜长不是水平距离',
              'Inclined length is not horizontal run',
            )}
          />
        </text>
      </svg>
    </TrigFrame>
  );
}
