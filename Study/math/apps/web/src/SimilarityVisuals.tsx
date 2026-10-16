import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  sssTriangle,
  type GeoPoint,
  type Vertex,
  type TriangleSide,
} from './congruenceModels';
import {
  rectangleScale,
  projectivePhotoPoint,
  type PhotoMode,
} from './similarityModels';
import { textR } from './algebraModels';
const pts = (p: GeoPoint[]) => p.map((p) => `${p.x},${p.y}`).join(' ');
export function SimilarityFrame({
  mode,
  children,
  caption,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
  caption?: LocalizedText;
}) {
  return (
    <figure className="math-similarity-figure">
      <div
        className="math-similarity-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Similarity diagram; scroll locally'
            : '相似关系图；需要时在图内滚动'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={
            caption ??
            t(
              '同图横纵方向、两组图形使用相同单位长度；共同缩放、旋转、反射不改变对应标签。使用标记和列出的已知条件，不以像素测量或外观代替判定。',
              'Both directions and both figures share one unit scale. Common zoom, rotation and reflection preserve vertex identities. Use marks and listed givens, not pixel measurements or appearance, to establish similarity.',
            )
          }
        />
      </figcaption>
    </figure>
  );
}
export function similarityScreenPoints(
  points: GeoPoint[],
  origin: GeoPoint,
  unit: number,
  turns = 0,
  mirror = false,
) {
  const center = {
    x: points.reduce((s, p) => s + p.x, 0) / 3,
    y: points.reduce((s, p) => s + p.y, 0) / 3,
  };
  return points.map((p) => {
    let x = (p.x - center.x) * (mirror ? -1 : 1),
      y = p.y - center.y;
    for (let i = 0; i < turns; i++) {
      const old = x;
      x = -y;
      y = old;
    }
    return { x: origin.x + x * unit, y: origin.y - y * unit };
  });
}
function Triangle({
  points,
  origin,
  unit,
  labels,
  color,
  turns = 0,
  mirror = false,
  lengths = {},
  angles = {},
}: {
  points: GeoPoint[];
  origin: GeoPoint;
  unit: number;
  labels: string;
  color: string;
  turns?: number;
  mirror?: boolean;
  lengths?: Partial<Record<TriangleSide, string>>;
  angles?: Partial<Record<Vertex, number>>;
}) {
  const p = similarityScreenPoints(points, origin, unit, turns, mirror);
  return (
    <g data-similarity-triangle={labels}>
      <polygon
        data-similarity-polygon
        points={pts(p)}
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      {p.map((v, i) => {
        const dx = v.x - origin.x,
          dy = v.y - origin.y,
          len = Math.hypot(dx, dy) || 1;
        return (
          <text
            key={i}
            data-similarity-vertex={labels[i]}
            x={v.x + (dx / len) * 18}
            y={v.y + (dy / len) * 18 + 5}
            textAnchor="middle"
          >
            {labels[i]}
          </text>
        );
      })}
      {(['AB', 'BC', 'CA'] as const).map((side, i) => {
        if (!lengths[side]) return null;
        const a = p[i]!,
          b = p[(i + 1) % 3]!,
          mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
          dx = mid.x - origin.x,
          dy = mid.y - origin.y,
          len = Math.hypot(dx, dy) || 1;
        return (
          <text
            key={side}
            data-similarity-side={`${labels[i]}${labels[(i + 1) % 3]}`}
            x={mid.x + (dx / len) * 24}
            y={mid.y + (dy / len) * 24 + 5}
            textAnchor="middle"
            fontSize="13"
          >
            {lengths[side]}
          </text>
        );
      })}
      {Object.entries(angles).map(([name, value]) => {
        const i = 'ABC'.indexOf(name),
          v = p[i]!,
          a = p[(i + 1) % 3]!,
          b = p[(i + 2) % 3]!,
          start = Math.atan2(a.y - v.y, a.x - v.x);
        let sweep = Math.atan2(b.y - v.y, b.x - v.x) - start;
        while (sweep > Math.PI) sweep -= 2 * Math.PI;
        while (sweep < -Math.PI) sweep += 2 * Math.PI;
        const arc = Array.from({ length: 17 }, (_, j) => ({
          x: v.x + 17 * Math.cos(start + (sweep * j) / 16),
          y: v.y + 17 * Math.sin(start + (sweep * j) / 16),
        }));
        return (
          <g key={name} data-similarity-angle={labels[i]}>
            <polyline points={pts(arc)} stroke={color} fill="none" />
            <text
              x={v.x + 35 * Math.cos(start + sweep / 2)}
              y={v.y + 35 * Math.sin(start + sweep / 2) + 4}
              textAnchor="middle"
              fontSize="12"
            >
              {value}°
            </text>
          </g>
        );
      })}
    </g>
  );
}
export function SimilarityPair({
  mode,
  source = sssTriangle(4, 5, 3)!,
  target = sssTriangle(6, 7.5, 4.5)!,
  turns = 1,
  mirror = true,
  zoom = 1,
  sourceLengths = {},
  targetLengths = {},
  angles = {},
}: {
  mode: LanguageMode;
  source?: GeoPoint[];
  target?: GeoPoint[];
  turns?: number;
  mirror?: boolean;
  zoom?: number;
  sourceLengths?: Partial<Record<TriangleSide, string>>;
  targetLengths?: Partial<Record<TriangleSide, string>>;
  angles?: Partial<Record<Vertex, number>>;
}) {
  return (
    <SimilarityFrame mode={mode}>
      <svg
        viewBox="0 0 680 420"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two labelled triangles on a common scale'
            : '同一单位下的两个带标签三角形'
        }
      >
        <Triangle
          points={source}
          origin={{ x: 165, y: 200 }}
          unit={17 * zoom}
          labels="ABC"
          color="#5954a3"
          lengths={sourceLengths}
          angles={angles}
        />
        <Triangle
          points={target}
          origin={{ x: 515, y: 200 }}
          unit={17 * zoom}
          labels="DEF"
          color="#a14532"
          turns={turns}
          mirror={mirror}
          lengths={targetLengths}
          angles={angles}
        />
        <text x="165" y="360" textAnchor="middle">
          △ABC
        </text>
        <text x="515" y="360" textAnchor="middle">
          △DEF
        </text>
        <text x="340" y="393" textAnchor="middle" fontSize="13">
          <Text
            mode={mode}
            text={t(
              '标注尺寸是已知；未标的边角不增加条件。',
              'Only marked sizes are givens; unmarked sides and angles add no evidence.',
            )}
          />
        </text>
      </svg>
    </SimilarityFrame>
  );
}
export function NestedSimilarity({
  mode,
  shown = false,
}: {
  mode: LanguageMode;
  shown?: boolean;
}) {
  const outer = sssTriangle(6, 12, 9)!,
    p = outer.map((p) => ({ x: 290 + p.x * 25, y: 315 - p.y * 25 })),
    [a, b, c] = p as [GeoPoint, GeoPoint, GeoPoint],
    d = { x: a.x + ((b.x - a.x) * 2) / 3, y: a.y + ((b.y - a.y) * 2) / 3 },
    e = { x: a.x + ((c.x - a.x) * 2) / 3, y: a.y + ((c.y - a.y) * 2) / 3 };
  return (
    <SimilarityFrame
      mode={mode}
      caption={t(
        'DE∥BC是题设，D、E分别在AB、AC上；两三角形共享A。小/大应比AD/AB，不是AD/DB；图用同一长度单位。',
        'DE∥BC is given, with D on AB and E on AC; the triangles share A. Small/large uses AD/AB, not AD/DB. The drawing uses a common length unit.',
      )}
    >
      <svg
        viewBox="0 0 680 410"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Nested triangles with a given parallel segment'
            : '给定平行截线的嵌套三角形'
        }
      >
        <polygon points={pts(p)} fill="none" stroke="#5954a3" strokeWidth="3" />
        <path
          data-similarity-parallel
          d={`M${d.x} ${d.y}L${e.x} ${e.y}`}
          stroke="#a14532"
          strokeWidth="3"
        />
        {[a, b, c, d, e].map((v, i) => (
          <text
            key={i}
            x={v.x + (i === 2 || i === 4 ? -17 : 9)}
            y={v.y + (i === 0 || i === 1 ? 23 : -10)}
          >
            {'ABCDE'[i]}
          </text>
        ))}
        <text x={(a.x + b.x) / 2} y="370" textAnchor="middle">
          AB=6 cm
        </text>
        <text x={(a.x + d.x) / 2} y="297" textAnchor="middle">
          AD=4
        </text>
        <text x={(a.x + c.x) / 2 - 63} y={(a.y + c.y) / 2}>
          AC=9
        </text>
        <text x={(b.x + c.x) / 2 + 18} y={(b.y + c.y) / 2}>
          BC=12
        </text>
        <text x={(d.x + e.x) / 2 - 8} y={(d.y + e.y) / 2 - 16}>
          DE={shown ? '8' : 'x'}
        </text>
        <text x="30" y="35">
          DE ∥ BC
        </text>
        {shown && (
          <text x="30" y="65">
            AD/AB=AE/AC=DE/BC=2/3
          </text>
        )}
      </svg>
    </SimilarityFrame>
  );
}
export function ScaleAreaView({
  mode,
  sx = 2,
  sy = sx,
  shown = false,
}: {
  mode: LanguageMode;
  sx?: number;
  sy?: number;
  shown?: boolean;
}) {
  if (![sx, sy].every((v) => Number.isInteger(v) && v >= 1 && v <= 3))
    throw new RangeError(
      'Area grid factors must be integers from one to three',
    );
  const m = rectangleScale('3', '2', String(sx), String(sy)),
    unit = 22,
    w = 3 * sx,
    h = 2 * sy,
    top = 300 - h * unit;
  return (
    <SimilarityFrame
      mode={mode}
      caption={t(
        '每个小格面积1，横纵方向和两图单位相同。只有统一倍率k时，目标可分为k×k个原面积块；单向拉伸的面积倍率是横倍率×纵倍率，不能直接套一个k²。',
        'Each small cell has area one, on common scales in both directions and figures. A uniform factor k gives k×k copies of the original area. A directional stretch has area factor horizontal×vertical, so a single k² is not justified.',
      )}
    >
      <svg
        viewBox="0 0 680 390"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Area cells and uniform scale blocks'
            : '面积小格与统一倍率分块'
        }
      >
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={`a${i}`}
            x={100 + (i % 3) * unit}
            y={256 + Math.floor(i / 3) * unit}
            width={unit}
            height={unit}
            fill="#ece7f6"
            stroke="#9e92ba"
          />
        ))}
        {Array.from({ length: w * h }, (_, i) => (
          <rect
            data-similarity-cell
            key={`b${i}`}
            x={380 + (i % w) * unit}
            y={top + Math.floor(i / w) * unit}
            width={unit}
            height={unit}
            fill="#f3e7dd"
            stroke="#bfa28e"
          />
        ))}
        <rect
          x="100"
          y="256"
          width={3 * unit}
          height={2 * unit}
          fill="none"
          stroke="#5954a3"
          strokeWidth="3"
        />
        <rect
          x="380"
          y={top}
          width={w * unit}
          height={h * unit}
          fill="none"
          stroke="#a14532"
          strokeWidth="3"
        />
        {shown &&
          sx === sy &&
          Array.from({ length: sx * sy }, (_, i) => (
            <rect
              data-similarity-area-block
              key={i}
              x={380 + (i % sx) * 3 * unit}
              y={top + Math.floor(i / sx) * 2 * unit}
              width={3 * unit}
              height={2 * unit}
              fill="none"
              stroke="#5954a3"
              strokeWidth="2"
            />
          ))}
        <text x="133" y="330" textAnchor="middle">
          3 × 2; A=6
        </text>
        <text x={380 + (w * unit) / 2} y="330" textAnchor="middle">
          {w} × {h}
          {shown ? `; A=${textR(m.targetArea)}` : ''}
        </text>
        <text x="30" y="40">
          <Text
            mode={mode}
            text={t(
              `横倍率${sx}，纵倍率${sy}`,
              `Horizontal factor ${sx}, vertical factor ${sy}`,
            )}
          />
        </text>
      </svg>
    </SimilarityFrame>
  );
}
export function SimilarityMap({
  mode,
  zoom = 1,
}: {
  mode: LanguageMode;
  zoom?: number;
}) {
  const unit = 120 * zoom;
  return (
    <SimilarityFrame
      mode={mode}
      caption={t(
        '虚构地图：原参考图AB=3 cm、比例1:50000。屏幕缩放让AB和1 km比例尺同倍变化，实际距离不变；参考比例不声称是当前屏幕的物理厘米。',
        'Fictional map: AB is 3 cm on the reference copy at 1:50000. Screen zoom scales AB and the 1 km bar together, preserving real distance. The reference ratio is not a claim about physical centimetres on this screen.',
      )}
    >
      <svg
        viewBox="0 0 680 370"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Fictional map and zoom-consistent scale bar'
            : '虚构地图与随缩放同步的比例尺'
        }
      >
        <rect
          x="60"
          y="55"
          width="540"
          height="205"
          fill="#edf1e9"
          stroke="#a4b59a"
        />
        {[0, 0.5, 1, 1.5, 2].map((v) => (
          <path key={v} d={`M${100 + v * unit} 65V250`} stroke="#d2dcca" />
        ))}
        <path
          data-map-route
          d={`M100 155H${100 + 1.5 * unit}`}
          stroke="#5954a3"
          strokeWidth="4"
        />
        <circle cx="100" cy="155" r="5" fill="#5954a3" />
        <circle cx={100 + 1.5 * unit} cy="155" r="5" fill="#a14532" />
        <text x="90" y="135">
          A
        </text>
        <text x={95 + 1.5 * unit} y="135">
          B
        </text>
        <text x="95" y="230">
          <Text
            mode={mode}
            text={t(
              '原参考图3 cm；实际距离待求',
              'Reference length 3 cm; find real distance',
            )}
          />
        </text>
        <path
          data-map-scale
          d={`M100 290H${100 + unit}M100 283V297M${100 + unit} 283V297`}
          stroke="currentColor"
          strokeWidth="3"
        />
        <text x={100 + unit / 2} y="323" textAnchor="middle">
          1 km
        </text>
        <text x="350" y="320">
          zoom={zoom}
        </text>
      </svg>
    </SimilarityFrame>
  );
}
export function SimilarityPhoto({
  mode,
  operation = 'uniform',
}: {
  mode: LanguageMode;
  operation?: PhotoMode;
}) {
  const id = useId().replace(/:/g, ''),
    unit = 20,
    origin = { x: 380, y: 100 },
    height =
      operation === 'uniform'
        ? 7.5
        : operation === 'stretch'
          ? 6
          : operation === 'crop'
            ? 5
            : 6,
    transform = (u: number, v: number) =>
      operation === 'perspective'
        ? projectivePhotoPoint(u / 4, v / 3)
        : { x: u * 2.5, y: v * (operation === 'stretch' ? 2 : 2.5) },
    screen = (p: GeoPoint) => ({
      x: origin.x + p.x * unit,
      y: origin.y + p.y * unit,
    }),
    corners =
      operation === 'perspective'
        ? [
            [0, 0],
            [4, 0],
            [4, 3],
            [0, 3],
          ].map(([u, v]) => screen(transform(u!, v!)))
        : [
            { x: 380, y: 100 },
            { x: 580, y: 100 },
            { x: 580, y: 100 + height * unit },
            { x: 380, y: 100 + height * unit },
          ],
    motif = Array.from({ length: 49 }, (_, i) => {
      const r = (i / 48) * 2 * Math.PI;
      return screen(transform(2 + 0.8 * Math.cos(r), 1.5 + 0.8 * Math.sin(r)));
    }),
    line = [screen(transform(0.4, 0.4)), screen(transform(3.6, 2.6))];
  return (
    <SimilarityFrame
      mode={mode}
      caption={t(
        '虚构4×3图框与内部圆形标记。等比缩放保形；单向拉伸把圆变椭圆；裁切真实剪掉内容，保留部分未因此被拉伸；透视示例为投影关系，不能只用一个参照长度推出统一倍率。',
        'A fictional 4×3 frame contains a circular mark. Uniform resizing preserves shape; stretching makes an ellipse. Cropping actually removes content without stretching what remains. The perspective example is projective; one reference length does not establish a uniform scale.',
      )}
    >
      <svg
        viewBox="0 0 680 370"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Uniform resize, stretch, crop or perspective comparison'
            : '等比缩放、拉伸、裁切或透视比较'
        }
      >
        <rect
          x="90"
          y="130"
          width="80"
          height="60"
          fill="#ece7f6"
          stroke="#5954a3"
        />
        <circle
          cx="130"
          cy="160"
          r="16"
          fill="none"
          stroke="#5954a3"
          strokeWidth="2"
        />
        <path d="M98 138L162 182" stroke="#5954a3" />
        {operation === 'crop' && (
          <rect
            x="90"
            y="130"
            width="80"
            height="40"
            fill="none"
            stroke="#a14532"
            strokeDasharray="4 3"
          />
        )}
        <defs>
          <clipPath id={id}>
            <polygon points={pts(corners)} />
          </clipPath>
        </defs>
        <polygon
          points={pts(corners)}
          fill="#f3e7dd"
          stroke="#a14532"
          strokeWidth="2"
        />
        <g clipPath={`url(#${id})`}>
          <polyline
            data-photo-motif
            points={pts(motif)}
            fill="none"
            stroke="#5954a3"
            strokeWidth="2"
          />
          <polyline points={pts(line)} stroke="#5954a3" strokeWidth="2" />
        </g>
        <text x="130" y="225" textAnchor="middle">
          4 cm × 3 cm
        </text>
        <text x="480" y="295" textAnchor="middle">
          {operation === 'perspective' ? 'perspective' : `10 cm × ${height} cm`}
        </text>
        <text x="340" y="340" textAnchor="middle">
          {operation}
        </text>
      </svg>
    </SimilarityFrame>
  );
}
export function SimilarityShadow({
  mode,
  conditions = true,
}: {
  mode: LanguageMode;
  conditions?: boolean;
}) {
  if (!conditions)
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            '共同光线方向或平地直立条件缺失，先不画成已证明相似的直角三角形，也不输出唯一高度。可有不同高度与同样影长。',
            'With a common light direction or level-ground/upright premises missing, do not draw the triangles as proven similar or report a unique height. Different heights can have the same shadow length.',
          )}
        />
      </p>
    );
  const u = 37,
    a = { x: 100, y: 300 },
    b = { x: 400, y: 300 };
  return (
    <SimilarityFrame
      mode={mode}
      caption={t(
        '虚构条件：同时同地、光线平行、同一水平地面、两物体直立。两直角及光线夹角相等可用AA；高度/影长比相同，单位先统一。',
        'Fictional givens: simultaneous parallel light, the same level ground and upright objects. Right angles plus equal light angles establish AA. Height/shadow ratios agree after unifying units.',
      )}
    >
      <svg
        viewBox="0 0 680 380"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Shadow triangles under explicit similarity premises'
            : '有明确相似前提的影长三角形'
        }
      >
        <path d="M60 300H600" stroke="currentColor" />
        {[
          [a, 1.2, 0.8],
          [b, 4.5, 3],
        ].map(([p, h, s], i) => {
          const q = p as GeoPoint,
            height = h as number,
            shadow = s as number;
          return (
            <g key={i}>
              <path
                d={`M${q.x} ${q.y}V${q.y - height * u}L${q.x + shadow * u} ${q.y}`}
                stroke={i ? '#a14532' : '#5954a3'}
                strokeWidth="3"
                fill="none"
              />
              <path
                d={`M${q.x + 9} ${q.y}V${q.y - 9}H${q.x}`}
                stroke="currentColor"
                fill="none"
              />
              <text x={q.x - 13} y={q.y - (height * u) / 2} textAnchor="end">
                {i ? 'x' : '1.2 m'}
              </text>
              <text x={q.x + (shadow * u) / 2} y="327" textAnchor="middle">
                {i ? '3 m' : '0.8 m'}
              </text>
            </g>
          );
        })}
      </svg>
    </SimilarityFrame>
  );
}
