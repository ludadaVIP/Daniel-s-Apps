import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import type { GeoPoint } from './congruenceModels';
import {
  circlePoint,
  lineCircle,
  inscribedModel,
  tangentModel,
  tangentAngleGeometry,
  diameterAltitude,
} from './circleGeometryModels';
type View = { rotation?: number; zoom?: number };
export const circleScreen = (
  p: GeoPoint,
  unit: number,
  rotation = 0,
  zoom = 1,
) => {
  const a = (rotation * Math.PI) / 180;
  return {
    x: 340 + unit * zoom * (p.x * Math.cos(a) - p.y * Math.sin(a)),
    y: 220 - unit * zoom * (p.x * Math.sin(a) + p.y * Math.cos(a)),
  };
};
const pairs = (ps: GeoPoint[]) => ps.map((p) => `${p.x},${p.y}`).join(' ');
function Line({
  a,
  b,
  ...props
}: {
  a: GeoPoint;
  b: GeoPoint;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}) {
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    />
  );
}
function Dot({
  p,
  name,
  dx = 10,
  dy = -9,
}: {
  p: GeoPoint;
  name: string;
  dx?: number;
  dy?: number;
}) {
  return (
    <g data-cyclic-point={name}>
      <circle cx={p.x} cy={p.y} r="3.5" fill="currentColor" />
      <text x={p.x + dx} y={p.y + dy} fontSize="15">
        {name}
      </text>
    </g>
  );
}
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
export function CircleGeometryFrame({
  mode,
  children,
  caption,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
  caption: LocalizedText;
}) {
  return (
    <figure className="math-cyclic-figure">
      <div
        className="math-cyclic-scroll"
        tabIndex={0}
        role="region"
        aria-label={
          mode === 'en'
            ? 'Circle geometry diagram; scroll locally'
            : '圆的几何图；需要时在图内滚动'
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
export function circleArcPath(
  start: number,
  sweep: number,
  r: number,
  unit: number,
  rotation = 0,
  zoom = 1,
) {
  if (sweep <= 0 || sweep > 360)
    throw new RangeError('Positive sweep through at most one turn');
  const a = circleScreen(circlePoint(start, r), unit, rotation, zoom),
    size = r * unit * zoom;
  if (sweep === 360) {
    const mid = circleScreen(circlePoint(start + 180, r), unit, rotation, zoom);
    return `M${a.x} ${a.y}A${size} ${size} 0 0 0 ${mid.x} ${mid.y}A${size} ${size} 0 0 0 ${a.x} ${a.y}`;
  }
  const b = circleScreen(circlePoint(start + sweep, r), unit, rotation, zoom);
  return `M${a.x} ${a.y}A${size} ${size} 0 ${sweep > 180 ? 1 : 0} 0 ${b.x} ${b.y}`;
}
function Angle({
  a,
  v,
  b,
  label = '?',
}: {
  a: GeoPoint;
  v: GeoPoint;
  b: GeoPoint;
  label?: string;
}) {
  const start = Math.atan2(a.y - v.y, a.x - v.x);
  let delta = Math.atan2(b.y - v.y, b.x - v.x) - start;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const ps = Array.from({ length: 25 }, (_, i) => ({
    x: v.x + 21 * Math.cos(start + (delta * i) / 24),
    y: v.y + 21 * Math.sin(start + (delta * i) / 24),
  }));
  return (
    <g data-cyclic-angle>
      <polyline
        points={pairs(ps)}
        stroke="#a14532"
        strokeWidth="2"
        fill="none"
      />
      <text
        x={v.x + 43 * Math.cos(start + delta / 2)}
        y={v.y + 43 * Math.sin(start + delta / 2) + 5}
        textAnchor="middle"
        fontSize="14"
      >
        {label}
      </text>
    </g>
  );
}
function RightAngle({ a, v, b }: { a: GeoPoint; v: GeoPoint; b: GeoPoint }) {
  const d1 = Math.hypot(a.x - v.x, a.y - v.y),
    d2 = Math.hypot(b.x - v.x, b.y - v.y);
  if (!d1 || !d2) return null;
  const u = { x: ((a.x - v.x) / d1) * 11, y: ((a.y - v.y) / d1) * 11 },
    w = { x: ((b.x - v.x) / d2) * 11, y: ((b.y - v.y) / d2) * 11 };
  return (
    <polyline
      data-cyclic-right
      points={pairs([
        { x: v.x + u.x, y: v.y + u.y },
        { x: v.x + u.x + w.x, y: v.y + u.y + w.y },
        { x: v.x + w.x, y: v.y + w.y },
      ])}
      fill="none"
      stroke="currentColor"
    />
  );
}
const O = { x: 0, y: 0 };
export function ChordLineView({
  mode,
  radius = 5,
  distance = 3,
  rotation = 0,
  zoom = 1,
  shown = false,
}: {
  mode: LanguageMode;
  radius?: number;
  distance?: number;
  shown?: boolean;
} & View) {
  const m = lineCircle(String(radius), String(distance)),
    unit = 95 / radius,
    P = (p: GeoPoint) => circleScreen(p, unit, rotation, zoom),
    o = P(O),
    foot = P({ x: 0, y: distance }),
    half = Math.sqrt(Math.max(0, radius * radius - distance * distance)),
    a = P({ x: -half, y: distance }),
    b = P({ x: half, y: distance });
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={t(
        '直线到圆心的距离是垂直距离OM，圆半径r；d<r割线、d=r切线、d>r无交点。只有两交点时AB是弦；d=0时弦经过圆心成为直径。显示旋转缩放不增加条件。',
        'OM is the perpendicular distance from the centre to the infinite line. For radius r: d<r gives a secant, d=r a tangent, d>r no intersection. Two intersections define chord AB; at d=0 it is a diameter. Display transforms add no premises.',
      )}
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Centre distance, chord and line-circle intersections'
            : '圆心距、弦与直线交点'
        }
      >
        <circle
          cx={o.x}
          cy={o.y}
          r={radius * unit * zoom}
          fill="none"
          stroke="#5954a3"
          strokeWidth="2"
        />
        <Line
          a={P({ x: -1.7 * radius, y: distance })}
          b={P({ x: 1.7 * radius, y: distance })}
          stroke="#a14532"
        />
        <Line a={o} b={foot} strokeDasharray="5 4" />
        {distance > 0 && (
          <RightAngle a={o} v={foot} b={P({ x: radius, y: distance })} />
        )}
        <Dot p={o} name="O" dx={-20} dy={20} />
        {distance > 0 && (
          <Dot p={foot} name={m.kind === 'tangent' ? 'T=M' : 'M'} />
        )}
        {m.kind === 'secant' ? (
          <>
            <Line a={o} b={b} stroke="#5954a3" />
            <Line a={a} b={b} stroke="#a14532" strokeWidth={4} />
            <Dot p={a} name="A" dx={-19} />
            <Dot p={b} name="B" />
            <text x="35" y="360">
              AB = {shown ? m.chord : '?'} cm
            </text>
          </>
        ) : null}
        <text x="30" y="35">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              `已知r=${radius} cm，垂距d=${distance} cm`,
              `Given r=${radius} cm, perpendicular d=${distance} cm`,
            )}
          />
        </text>
      </svg>
    </CircleGeometryFrame>
  );
}
export function CentralAngleView({
  mode,
  sweep = 120,
  rotation = 0,
  zoom = 1,
  shown = false,
}: { mode: LanguageMode; sweep?: number; shown?: boolean } & View) {
  if (sweep <= 0 || sweep > 180)
    throw new RangeError('Use the minor central angle through 180°');
  const P = (p: GeoPoint) => circleScreen(p, 125, rotation, zoom),
    a = P(circlePoint(0)),
    b = P(circlePoint(sweep)),
    o = P(O);
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={t(
        'A、B在同一圆上，OA=OB为半径；中心小弧和中心角采用同一个0<θ≤180°的扫角。θ<180°时OAB是等腰三角形；θ=180°时O、A、B共线，不再套三角形底角。',
        'A and B lie on one circle, with equal radii OA=OB. The marked minor arc and central sweep use 0<θ≤180°. OAB is isosceles for θ<180°; at 180° the three points are collinear, so triangle base-angle reasoning no longer applies.',
      )}
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en' ? 'Central angle and equal radii' : '圆心角与两条等半径'
        }
      >
        <circle cx="340" cy="220" r={125 * zoom} stroke="#c3bcd0" fill="none" />
        <path
          data-cyclic-arc
          d={circleArcPath(0, sweep, 1, 125, rotation, zoom)}
          fill="none"
          stroke="#a14532"
          strokeWidth="4"
        />
        <Line a={o} b={a} />
        <Line a={o} b={b} />
        <Line a={a} b={b} stroke="#5954a3" />
        <path
          d={circleArcPath(0, sweep, 0.24, 125, rotation, zoom)}
          fill="none"
          stroke="#a14532"
        />
        <Dot p={o} name="O" />
        <Dot p={a} name="A" />
        <Dot p={b} name="B" />
        <text x="30" y="35">
          θ = {sweep}°; OA = OB
        </text>
        {sweep < 180 && (
          <>
            <Angle
              a={o}
              v={a}
              b={b}
              label={shown ? `${(180 - sweep) / 2}°` : '?'}
            />
          </>
        )}
      </svg>
    </CircleGeometryFrame>
  );
}
export function InscribedView({
  mode,
  sweep = 80,
  side = 'other',
  rotation = 0,
  zoom = 1,
  shown = false,
}: {
  mode: LanguageMode;
  sweep?: number;
  side?: 'selected' | 'other';
  shown?: boolean;
} & View) {
  const m = inscribedModel(sweep, side),
    P = (p: GeoPoint) => circleScreen(p, 125, rotation, zoom),
    a = P(m.A),
    b = P(m.B),
    p = P(m.P),
    start = side === 'selected' ? sweep : 0;
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={t(
        '已知A、B、P在同一圆上，P不同于端点。彩色弧是AB之间不含P的弧；圆周角等于这条弧度数的一半。同弦另一侧的P所对弧会换边，两侧圆周角通常互补。',
        'A, B and P are given on one circle, with P distinct from the endpoints. The coloured intercepted arc AB excludes P. The inscribed angle is half that arc measure. Moving P to the other side of the chord changes the intercepted arc; the two angles are generally supplementary.',
      )}
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Inscribed angle and the arc excluding its vertex'
            : '圆周角与不含顶点的弧'
        }
      >
        <circle cx="340" cy="220" r={125 * zoom} stroke="#c3bcd0" fill="none" />
        <path
          data-cyclic-intercepted
          d={circleArcPath(start, m.intercepted, 1, 125, rotation, zoom)}
          stroke="#a14532"
          strokeWidth="5"
          fill="none"
        />
        <Line a={a} b={b} strokeDasharray="5 4" />
        <Line a={p} b={a} stroke="#5954a3" />
        <Line a={p} b={b} stroke="#5954a3" />
        <Line a={P(O)} b={a} strokeDasharray="4 4" />
        <Line a={P(O)} b={b} strokeDasharray="4 4" />
        <Dot p={P(O)} name="O" />
        <Dot p={a} name="A" />
        <Dot p={b} name="B" />
        <Dot p={p} name="P" />
        <Angle a={a} v={p} b={b} label={shown ? `${m.angle}°` : '?'} />
        <text x="30" y="35">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              `逆时针A→B选定扫角${sweep}°；P在${side === 'selected' ? '此弧上' : '另一弧上'}`,
              `Selected counterclockwise A→B sweep ${sweep}°; P lies on the ${side === 'selected' ? 'selected' : 'other'} arc`,
            )}
          />
        </text>
        <text x="30" y="395">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              `不含P的弧=${m.intercepted}°${shown ? `；∠APB=${m.angle}°` : ''}`,
              `Arc excluding P=${m.intercepted}°${shown ? `; ∠APB=${m.angle}°` : ''}`,
            )}
          />
        </text>
      </svg>
    </CircleGeometryFrame>
  );
}
export function TangentsView({
  mode,
  radius = 3,
  distance = 5,
  given = true,
  central,
  rotation = 0,
  zoom = 1,
  shown = false,
}: {
  mode: LanguageMode;
  radius?: number;
  distance?: number;
  given?: boolean;
  central?: number;
  shown?: boolean;
} & View) {
  const m =
      central === undefined
        ? tangentModel(String(radius), String(distance))
        : tangentAngleGeometry(radius, central),
    unit = Math.min(125 / radius, 180 / m.P.x),
    P = (p: GeoPoint) => circleScreen(p, unit, rotation, zoom),
    o = P(O),
    p = P(m.P),
    t1 = given ? m.T : circlePoint(60, radius),
    s1 = given ? m.S : circlePoint(220, radius),
    a = P(t1),
    b = P(s1);
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={
        given
          ? t(
              '已知P在圆外，PT、PS分别在T、S处相切；只有这两处半径垂直切线，右角标记才有依据。同一外点、同一圆的两切线段相等；虚线OP不是半径。',
              'P is given outside the circle; PT and PS are tangent at T and S. Tangency justifies the two right-angle marks. Tangent segments from one external point to one circle have equal lengths; dashed OP is not a radius.',
            )
          : t(
              '这里不再给PT、PS相切，也不画垂直或等长标记。两条到圆上点的线段本身不能保证是切线，不能从外观补前提。',
              'Tangency is no longer supplied, so no perpendicular or equal-length marks are shown. Two segments to points on a circle need not be tangents; appearance supplies no missing premise.',
            )
      }
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'External-point segments and tangent premises'
            : '圆外点线段与相切前提'
        }
      >
        <circle
          cx="340"
          cy="220"
          r={radius * unit * zoom}
          fill="none"
          stroke="#5954a3"
        />
        <Line a={o} b={p} strokeDasharray="5 4" />
        <Line a={o} b={a} />
        <Line a={o} b={b} />
        <Line a={p} b={a} stroke="#a14532" />
        <Line a={p} b={b} stroke="#a14532" />
        {given && (
          <>
            <RightAngle a={o} v={a} b={p} />
            <RightAngle a={o} v={b} b={p} />
          </>
        )}
        <Dot p={o} name="O" dx={-20} />
        <Dot p={p} name="P" />
        <Dot p={a} name="T" />
        <Dot p={b} name="S" />
        {central !== undefined && given ? (
          <>
            <Angle a={a} v={o} b={b} label={`${central}°`} />
            <Angle
              a={a}
              v={p}
              b={b}
              label={shown ? `${180 - central}°` : '?'}
            />
          </>
        ) : (
          <text x="30" y="375">
            r={radius} cm; OP={distance} cm; PT=
            {shown && given ? m.length : '?'} cm
          </text>
        )}
      </svg>
    </CircleGeometryFrame>
  );
}
export function SectorGeometryView({
  mode,
  radius = 6,
  sweep = 60,
  rotation = 0,
  zoom = 1,
}: { mode: LanguageMode; radius?: number; sweep?: number } & View) {
  const arc = circleArcPath(0, sweep, 1, 125, rotation, zoom),
    a = circleScreen(circlePoint(0), 125, rotation, zoom),
    end = circleScreen(circlePoint(sweep), 125, rotation, zoom);
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={t(
        '彩色区域取明确选定的逆时针扫角θ，可大于180°。弧长是曲线长度，扇形面积是区域面积，不是弦长或弓形面积；0<θ<360°的扇形边界另含两条半径。',
        'The shaded sector uses the stated counterclockwise sweep θ, which may exceed 180°. Arc length measures the curve and sector area the region, not a chord or circular segment. For 0<θ<360°, its boundary also contains two radii.',
      )}
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Selected arc and sector on a circle'
            : '圆上选定的弧与扇形'
        }
      >
        <circle cx="340" cy="220" r={125 * zoom} fill="none" stroke="#c3bcd0" />
        <path
          data-cyclic-sector
          d={
            sweep === 360
              ? `${arc}Z`
              : `M340 220L${a.x} ${a.y}${arc.replace(/^M[^A]+/, '')}L340 220Z`
          }
          fill="#ece7f6"
          stroke="#5954a3"
        />
        <path
          data-cyclic-arc
          d={arc}
          fill="none"
          stroke="#a14532"
          strokeWidth="5"
        />
        {sweep < 360 && (
          <>
            <Line a={{ x: 340, y: 220 }} b={a} />
            <Line a={{ x: 340, y: 220 }} b={end} />
          </>
        )}
        <path
          d={circleArcPath(0, sweep, 0.25, 125, rotation, zoom)}
          fill="none"
          stroke="#a14532"
        />
        <Dot p={{ x: 340, y: 220 }} name="O" />
        <Dot p={a} name="A" />
        <Dot p={end} name="B" />
        <text x="30" y="35">
          r={radius} cm; θ={sweep}°
        </text>
      </svg>
    </CircleGeometryFrame>
  );
}
export function CircleProofView({
  mode,
  index = 0,
  rotation = 0,
  zoom = 1,
  shown = false,
}: { mode: LanguageMode; index?: number; shown?: boolean } & View) {
  if (index === 1) {
    const m = diameterAltitude('25', '9'),
      P = (p: GeoPoint) =>
        circleScreen({ x: p.x - 12.5, y: p.y }, 10, rotation, zoom),
      o = circleScreen(O, 10, rotation, zoom),
      a = P(m.A),
      b = P(m.B),
      c = P(m.C),
      d = P(m.D);
    return (
      <CircleGeometryFrame
        mode={mode}
        caption={t(
          '已知AC是直径、B在圆上、BD⊥AC且D在AC内，AC=25、AD=9 cm。先用直径角，再用AA和对应整边，才可写AB²=AD·AC。',
          'Given diameter AC, B on the circle and BD perpendicular to AC with D inside AC; AC=25, AD=9 cm. Use the diameter angle, then AA and corresponding whole sides before writing AB²=AD·AC.',
        )}
      >
        <svg
          viewBox="0 0 680 440"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Diameter triangle with perpendicular altitude'
              : '直径三角形与垂直高'
          }
        >
          <circle
            cx={o.x}
            cy={o.y}
            r={125 * zoom}
            fill="none"
            stroke="#c3bcd0"
          />
          <polygon
            points={pairs([a, b, c])}
            fill="none"
            stroke="#5954a3"
            strokeWidth="2"
          />
          <Line a={b} b={d} stroke="#a14532" />
          <RightAngle a={b} v={d} b={c} />
          {shown && <RightAngle a={a} v={b} b={c} />}
          <Dot p={a} name="A" dx={-20} />
          <Dot p={b} name="B" />
          <Dot p={c} name="C" />
          <Dot p={d} name="D" dy={22} />
          <text x="30" y="35">
            AC=25 cm; AD=9 cm; AB={shown ? '15' : '?'} cm
          </text>
        </svg>
      </CircleGeometryFrame>
    );
  }
  const math = [
      circlePoint(0),
      circlePoint(80),
      index === 2 ? { x: -1.3, y: 0.4 } : circlePoint(180),
      circlePoint(220),
    ],
    ps = math.map((p) => circleScreen(p, 125, rotation, zoom));
  return (
    <CircleGeometryFrame
      mode={mode}
      caption={
        index === 2
          ? t(
              '保留A角70°，但C不在由A、B、D确定的圆上，也未给四点共圆，不能使用圆内接四边形对角互补。',
              'Angle A stays 70°, but C is off the circle determined by A, B and D, and concyclicity is not given. The cyclic opposite-angle theorem cannot be applied.',
            )
          : t(
              '已知A、B、C、D依次在同一圆上，∠DAB=70°。两个对角各等于各自不含顶点弧的一半，这两弧合成360°。',
              'A, B, C and D are given in order on one circle, with ∠DAB=70°. Opposite angles halve their respective intercepted arcs, which partition 360°.',
            )
      }
    >
      <svg
        viewBox="0 0 680 440"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Quadrilateral and the concyclicity premise'
            : '四边形与四点共圆前提'
        }
      >
        <circle cx="340" cy="220" r={125 * zoom} fill="none" stroke="#c3bcd0" />
        <polygon
          points={pairs(ps)}
          fill="none"
          stroke="#5954a3"
          strokeWidth="2"
        />
        {ps.map((p, i) => (
          <Dot key={i} p={p} name={'ABCD'[i]!} />
        ))}
        <Angle a={ps[3]!} v={ps[0]!} b={ps[1]!} label="70°" />
        <Angle
          a={ps[1]!}
          v={ps[2]!}
          b={ps[3]!}
          label={shown && index === 0 ? '110°' : '?'}
        />
      </svg>
    </CircleGeometryFrame>
  );
}
