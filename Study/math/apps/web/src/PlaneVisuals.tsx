import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  turnPoint,
  triangleFromAngles,
  intersectionAngles,
  transversalAngles,
  type PlanePoint,
} from './planeModels';
const P = (p: PlanePoint) => `${p.x},${p.y}`;
function Arc({
  origin,
  start,
  sweep,
  r = 28,
  name,
}: {
  origin: PlanePoint;
  start: number;
  sweep: number;
  r?: number;
  name: string;
}) {
  const a = turnPoint(origin, start, r),
    b = turnPoint(origin, start + sweep, r),
    label = turnPoint(origin, start + sweep / 2, r + 15);
  return (
    <g data-angle-name={name} data-angle-sweep={sweep}>
      <path
        d={`M${P(a)} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 0 ${P(b)}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text x={label.x} y={label.y + 4} textAnchor="middle">
        {name}
      </text>
    </g>
  );
}
function Frame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-plane-figure">
      <div
        className="math-plane-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Geometry diagram; scroll within when needed'
            : '几何图；需要时在图内滚动'
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
export function ObjectView({
  kind,
  mode,
}: {
  kind: 'point' | 'line' | 'ray' | 'segment';
  mode: LanguageMode;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <Frame
      mode={mode}
      caption={t(
        '点的位置没有大小；画出的圆点、箭头与屏幕边界是表示方法。直线两端无限延伸，射线一端无限延伸，线段有两个端点。',
        'A point has position without size. Dots, arrows and screen edges are drawing conventions. A line extends indefinitely both ways, a ray one way, and a segment has two endpoints.',
      )}
    >
      <svg
        viewBox="0 0 440 130"
        role="img"
        aria-label={
          mode === 'en'
            ? {
                point: 'One marked position A',
                line: 'A and B marked between two extension arrows',
                ray: 'Endpoint A, marked B and one extension arrow',
                segment: 'Two endpoints A and B without extension arrows',
              }[kind]
            : {
                point: '一个标记位置 A',
                line: 'A、B 标记在两端延伸箭头之间',
                ray: '端点 A、标记 B 和一个延伸箭头',
                segment: '两端点 A、B，无延伸箭头',
              }[kind]
        }
      >
        <defs>
          <marker
            id={id}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" />
          </marker>
        </defs>
        {kind !== 'point' && (
          <line
            x1="65"
            y1="65"
            x2="375"
            y2="65"
            stroke="currentColor"
            strokeWidth="3"
            markerStart={kind === 'line' ? `url(#${id})` : undefined}
            markerEnd={
              kind === 'line' || kind === 'ray' ? `url(#${id})` : undefined
            }
          />
        )}
        <circle
          cx={kind === 'point' ? 220 : kind === 'line' ? 140 : 65}
          cy="65"
          r="4"
        />
        <text
          x={kind === 'point' ? 220 : kind === 'line' ? 140 : 65}
          y="94"
          textAnchor="middle"
        >
          A
        </text>
        {kind !== 'point' && (
          <>
            <circle cx={kind === 'segment' ? 375 : 300} cy="65" r="4" />
            <text x={kind === 'segment' ? 375 : 300} y="94" textAnchor="middle">
              B
            </text>
          </>
        )}
      </svg>
    </Frame>
  );
}
export function AngleView({
  angle,
  rotation,
  length,
  mode,
}: {
  angle: number;
  rotation: number;
  length: number;
  mode: LanguageMode;
}) {
  const id = useId().replace(/:/g, ''),
    o = { x: 220, y: 160 },
    a = turnPoint(o, rotation, length),
    b = turnPoint(o, rotation + angle, length),
    al = turnPoint(o, rotation, length + 17),
    bl = turnPoint(o, rotation + angle, length + 17);
  return (
    <Frame
      mode={mode}
      caption={t(
        '两条射线共同端点 O 是顶点，∠AOB 的 O 必须在中间。本图只讨论 0°–180° 的指定转角；改变画出的边长或整体转向不改变这个夹角。',
        'The common endpoint O is the vertex; O is the middle letter of ∠AOB. This model uses the specified turn from 0° to 180°. Changing drawn arm lengths or rotating the whole figure does not change that angle.',
      )}
    >
      <svg
        viewBox="0 0 440 320"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Rays OA and OB with vertex O'
            : '顶点为 O 的射线 OA 与 OB'
        }
      >
        <defs>
          <marker
            id={id}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" />
          </marker>
        </defs>
        {[a, b].map((p, i) => (
          <line
            key={i}
            data-ray
            x1={o.x}
            y1={o.y}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            strokeWidth="3"
            markerEnd={`url(#${id})`}
          />
        ))}
        <circle cx={o.x} cy={o.y} r="4" />
        <text x={o.x - 14} y={o.y + 16}>
          O
        </text>
        <text x={al.x} y={al.y + 4}>
          A
        </text>
        <text x={bl.x} y={bl.y + 4}>
          B
        </text>
        {angle > 0 && (
          <Arc origin={o} start={rotation} sweep={angle} r={32} name="?" />
        )}
      </svg>
    </Frame>
  );
}
export function IntersectionView({
  angle,
  rotation = 0,
  mode,
}: {
  angle: number;
  rotation?: number;
  mode: LanguageMode;
}) {
  const o = { x: 220, y: 160 },
    values = intersectionAngles(angle),
    starts = [
      rotation,
      rotation + angle,
      rotation + 180,
      rotation + 180 + angle,
    ];
  return (
    <Frame
      mode={mode}
      caption={t(
        '两条直线确实交于 O。A/C 没有公共边，是对顶角；A/B 共享一边，另两边是反向射线，构成邻补角。图中只给 A 的度数，其余先推理。',
        'Two straight lines intersect at O. A/C share no arm and are vertically opposite. A/B share an arm and their other arms are opposite rays, forming a straight angle. Only A is supplied numerically; infer the rest.',
      )}
    >
      <svg
        viewBox="0 0 440 320"
        role="img"
        aria-label={
          mode === 'en'
            ? `Intersecting lines, angle A is ${angle} degrees`
            : `相交直线，角 A 为 ${angle} 度`
        }
      >
        {[rotation, rotation + angle].map((r, i) => {
          const a = turnPoint(o, r, 145),
            b = turnPoint(o, r + 180, 145);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeWidth="2.5"
            />
          );
        })}
        {starts.map((start, i) => (
          <Arc
            key={i}
            origin={o}
            start={start}
            sweep={values[i]!}
            name={String.fromCharCode(65 + i)}
          />
        ))}
        <circle cx={o.x} cy={o.y} r="3" />
        <text x="228" y="180">
          O
        </text>
        <text x="18" y="28">
          A = {angle}°
        </text>
      </svg>
    </Frame>
  );
}
export function ParallelView({
  top,
  bottom,
  parallel,
  mode,
}: {
  top: number;
  bottom: number;
  parallel: boolean;
  mode: LanguageMode;
}) {
  const m = transversalAngles(top, bottom, parallel),
    p = { x: 240, y: 85 },
    q = turnPoint(p, top + 180, 145),
    r = turnPoint(p, top, 65),
    s = turnPoint(q, top + 180, 65),
    ends = (o: PlanePoint, tilt: number) => [
      turnPoint(o, tilt + 180, 105),
      turnPoint(o, tilt, 105),
    ];
  return (
    <Frame
      mode={mode}
      caption={
        parallel
          ? t(
              '已知 ℓ∥m，双箭形记号标出平行条件。A/E 是同位角，C/E 是内错角，D/E 是同旁内角；字母按角所在区域定义，不按图形外观猜。',
              'Given ℓ∥m, matching chevrons mark the condition. A/E correspond, C/E alternate inside, and D/E are co-interior. Regions define the pairs; appearance does not establish parallelism.',
            )
          : t(
              '未给平行条件；此处 m 的方向可改变。A 的度数不能单独确定 E，不能从屏幕上“差不多平行”套用同位角相等。',
              'Parallelism is not given; m may change direction here. A alone does not determine E, and looking nearly parallel does not justify corresponding-angle equality.',
            )
      }
    >
      <svg
        viewBox="0 0 480 320"
        role="img"
        aria-label={
          mode === 'en'
            ? `Transversal of ${parallel ? 'given parallel' : 'not given parallel'} lines; A=${top}°`
            : `截线穿过${parallel ? '已知平行' : '未给平行'}的两线，A=${top}°`
        }
      >
        {[
          { o: p, tilt: 0, name: 'ℓ' },
          { o: q, tilt: m.tilt, name: 'm' },
        ].map(({ o, tilt, name }) => {
          const [a, b] = ends(o, tilt),
            text = turnPoint(o, tilt, 120);
          return (
            <g key={name} data-line-tilt={tilt}>
              <line
                x1={a!.x}
                y1={a!.y}
                x2={b!.x}
                y2={b!.y}
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <text x={text.x} y={text.y + 4}>
                {name}
              </text>
              {parallel && (
                <g
                  data-parallel-mark
                  transform={`translate(${o.x + 65},${o.y}) rotate(${-tilt})`}
                >
                  <path
                    d="M-5 -6 L4 0 L-5 6 M1 -6 L10 0 L1 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </g>
              )}
            </g>
          );
        })}
        <line
          x1={r.x}
          y1={r.y}
          x2={s.x}
          y2={s.y}
          stroke="#5954a3"
          strokeWidth="3"
        />
        {[p, q].flatMap((o, j) => {
          const a = j === 0 ? top : bottom,
            start = j === 0 ? 0 : m.tilt;
          return [start, start + a, start + 180, start + 180 + a].map(
            (v, i) => (
              <Arc
                key={`${j}/${i}`}
                origin={o}
                start={v}
                sweep={m.angles[j * 4 + i]!}
                r={22}
                name={String.fromCharCode(65 + j * 4 + i)}
              />
            ),
          );
        })}
        <text x="16" y="26">
          A = {top}° · {parallel ? 'ℓ ∥ m' : 'ℓ ∥ m ?'}
        </text>
      </svg>
    </Frame>
  );
}
function fit(points: readonly PlanePoint[]) {
  const xs = points.map((p) => p.x),
    ys = points.map((p) => p.y),
    loX = Math.min(...xs),
    loY = Math.min(...ys),
    w = Math.max(...xs) - loX,
    h = Math.max(...ys) - loY,
    scale = Math.min(320 / w, 205 / h),
    offsetX = (440 - w * scale) / 2;
  return points.map((p) => ({
    x: offsetX + (p.x - loX) * scale,
    y: 265 - (p.y - loY) * scale,
  }));
}
export function TriangleView({
  a,
  b,
  proof = false,
  mode,
  sides,
}: {
  a: number;
  b: number;
  proof?: boolean;
  mode: LanguageMode;
  sides?: readonly number[];
}) {
  const m = triangleFromAngles(a, b),
    points = fit(m.points),
    [A, B, C] = points as [PlanePoint, PlanePoint, PlanePoint];
  return (
    <Frame
      mode={mode}
      caption={
        sides
          ? t(
              '图形由给定三边构造，统一缩放保持边长比例与真实角度。这里只标边长，按边分类不需要把计算出的近似角度当成新的已知条件。',
              'The supplied sides construct the figure; one scale preserves length ratios and actual angles. Only side lengths are labelled. Side classification does not need computed approximate angles as extra givens.',
            )
          : proof
            ? t(
                '过 C 作与 AB 平行的直线。两组内错角把 A、B 的角度搬到 C 的两侧，与 C 的内角共同组成平角；平行条件是理由，移动图示帮助观察。',
                'Draw a line through C parallel to AB. Alternate interior angles transfer A and B to the sides of C, and the three form a straight angle. Parallelism supplies the reason; the moving representation supports observation.',
              )
            : t(
                '同一缩放比例保留真实角度，图形可旋转或改变形状而定理不变。只标已知角，C 先留问号；测量与剪拼是探索，完整理由需要几何关系。',
                'One scale preserves actual angles. The theorem survives changed shapes or orientation. Only given angles are marked; C stays a question. Measuring or rearranging supports exploration, while justification needs geometry.',
              )
      }
    >
      <svg
        viewBox="0 0 440 320"
        role="img"
        aria-label={
          sides
            ? mode === 'en'
              ? `Triangle ABC with supplied sides ${sides.join(', ')} cm`
              : `三角形 ABC，给定边长 ${sides.join('、')} cm`
            : mode === 'en'
              ? `Triangle ABC with angles A=${a}°, B=${b}°`
              : `三角形 ABC，A=${a}°，B=${b}°`
        }
      >
        <polygon
          data-triangle-points
          points={points.map(P).join(' ')}
          fill="#eeeaf8"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {proof && (
          <line
            data-proof-parallel
            x1="20"
            y1={C.y}
            x2="420"
            y2={C.y}
            stroke="#5954a3"
            strokeWidth="2"
            strokeDasharray="7 4"
          />
        )}
        {points.map((p, i) => {
          const others = points.filter((_, j) => j !== i),
            v = others.map((q) => ({ x: q.x - p.x, y: q.y - p.y })),
            u = v.map((q) => {
              const n = Math.hypot(q.x, q.y);
              return { x: q.x / n, y: q.y / n };
            }),
            bis = { x: u[0]!.x + u[1]!.x, y: u[0]!.y + u[1]!.y },
            n = Math.hypot(bis.x, bis.y),
            x = bis.x / n,
            y = bis.y / n;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" />
              <text x={p.x - x * 17} y={p.y - y * 17 + 4} textAnchor="middle">
                {String.fromCharCode(65 + i)}
              </text>
              {!sides && (
                <text x={p.x + x * 35} y={p.y + y * 35 + 4} textAnchor="middle">
                  {i === 2 ? '?' : `${m.angles[i]}°`}
                </text>
              )}
            </g>
          );
        })}
        {sides &&
          [
            [B, C],
            [A, C],
            [A, B],
          ].map(([p, q], i) => (
            <text
              key={i}
              data-side-label
              x={(p!.x + q!.x) / 2 + 8}
              y={(p!.y + q!.y) / 2 - 8}
            >
              {sides[i]}
            </text>
          ))}
      </svg>
      {proof && (
        <svg
          viewBox="0 0 440 125"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Three angle copies form a straight angle'
              : '三个角的副本拼成平角'
          }
        >
          {[a, m.angles[2], b].map((angle, i) => {
            const start = i === 0 ? 0 : i === 1 ? a : a + m.angles[2];
            return (
              <Arc
                key={i}
                origin={{ x: 220, y: 105 }}
                start={start}
                sweep={angle}
                r={55}
                name={['A', 'C', 'B'][i]!}
              />
            );
          })}
          <line
            x1="90"
            y1="105"
            x2="350"
            y2="105"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      )}
    </Frame>
  );
}
