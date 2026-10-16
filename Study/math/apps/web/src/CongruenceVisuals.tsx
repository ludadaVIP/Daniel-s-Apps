import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  sssTriangle,
  angleTriangle,
  trianglePose,
  isoscelesModel,
  parallelogramModel,
  parallelogramCounterexample,
  sideCriteriaCases,
  angleCriteriaCases,
  ssaAlternatives,
  type GeoPoint,
  type CongruenceFacts,
} from './congruenceModels';
const pts = (p: GeoPoint[]) => p.map((p) => `${p.x},${p.y}`).join(' ');
export function CongruenceFrame({
  mode,
  children,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-congruence-figure">
      <div
        className="math-congruence-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Congruence diagram; scroll locally'
            : '全等图；需要时在图内滚动'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '图中两方向使用相同单位长度。标记与列出的已知条件才是依据；旋转、反射和显示位置不增加条件，量像素不代替证明。',
            'Both directions use the same unit length. Use marks and listed givens; rotation, reflection and placement add no conditions. Pixel measurement is not a proof.',
          )}
        />
      </figcaption>
    </figure>
  );
}
function Triangle({
  points,
  labels,
  facts,
  color,
  origin,
  degree = 0,
  mirror = false,
  scale = 1,
  hideLabels = false,
}: {
  points: GeoPoint[];
  labels: string;
  facts: CongruenceFacts;
  color: string;
  origin: GeoPoint;
  degree?: number;
  mirror?: boolean;
  scale?: number;
  hideLabels?: boolean;
}) {
  const p = trianglePose(points, degree, mirror, scale).map((p) => ({
      x: origin.x + p.x * 27,
      y: origin.y - p.y * 27,
    })),
    sides = ['AB', 'BC', 'CA'] as const;
  return (
    <g data-triangle-labels={labels}>
      <polygon points={pts(p)} fill="none" stroke={color} strokeWidth="3" />
      {!hideLabels &&
        p.map((v, i) => (
          <text
            key={i}
            x={v.x + (v.x < origin.x ? -13 : 8)}
            y={v.y + (v.y < origin.y ? -10 : 20)}
          >
            {labels[i]}
          </text>
        ))}
      {sides.map((s, i) => {
        if (!facts.sides.includes(s)) return null;
        const a = p[i]!,
          b = p[(i + 1) % 3]!,
          dx = b.x - a.x,
          dy = b.y - a.y,
          len = Math.hypot(dx, dy),
          mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        return (
          <g key={s} data-equal-side={s}>
            {Array.from({ length: i + 1 }, (_, j) => {
              const shift = (j - i / 2) * 6,
                x = mid.x + (dx / len) * shift,
                y = mid.y + (dy / len) * shift;
              return (
                <path
                  key={j}
                  d={`M${x - (dy / len) * 6} ${y + (dx / len) * 6}L${x + (dy / len) * 6} ${y - (dx / len) * 6}`}
                  stroke={color}
                  strokeWidth="2"
                />
              );
            })}
          </g>
        );
      })}
      {facts.angles.map((name) => {
        const i = 'ABC'.indexOf(name),
          v = p[i]!,
          a = p[(i + 1) % 3]!,
          b = p[(i + 2) % 3]!,
          start = Math.atan2(a.y - v.y, a.x - v.x);
        let sweep = Math.atan2(b.y - v.y, b.x - v.x) - start;
        while (sweep > Math.PI) sweep -= 2 * Math.PI;
        while (sweep < -Math.PI) sweep += 2 * Math.PI;
        const arc = Array.from({ length: 13 }, (_, j) => ({
          x: v.x + 19 * Math.cos(start + (sweep * j) / 12),
          y: v.y + 19 * Math.sin(start + (sweep * j) / 12),
        }));
        return (
          <g
            key={name}
            data-equal-angle={name}
            data-angle-size={(Math.abs(sweep) * 180) / Math.PI}
          >
            {Array.from({ length: i + 1 }, (_, mark) => (
              <polyline
                key={mark}
                points={pts(
                  arc.map((pt) => ({
                    x: v.x + (pt.x - v.x) * (1 + mark * 0.2),
                    y: v.y + (pt.y - v.y) * (1 + mark * 0.2),
                  })),
                )}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            ))}
            <text
              x={v.x + 36 * Math.cos(start + sweep / 2)}
              y={v.y + 36 * Math.sin(start + sweep / 2)}
              fontSize="12"
            >
              {Math.round(((Math.abs(sweep) * 180) / Math.PI) * 10) / 10}°
            </text>
          </g>
        );
      })}
    </g>
  );
}
export function TrianglePairView({
  mode,
  points = sssTriangle(4, 5, 3)!,
  other,
  facts = { sides: [], angles: [] },
  angle = 35,
  mirror = true,
  scale = 1,
  overlay = false,
}: {
  mode: LanguageMode;
  points?: GeoPoint[];
  other?: GeoPoint[];
  facts?: CongruenceFacts;
  angle?: number;
  mirror?: boolean;
  scale?: number;
  overlay?: boolean;
}) {
  return (
    <CongruenceFrame mode={mode}>
      <svg
        viewBox="0 0 680 300"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Triangles ABC and DEF with corresponding marks'
            : '三角形 ABC 与 DEF，带对应条件标记'
        }
      >
        <Triangle
          points={points}
          labels="ABC"
          facts={facts}
          color="#5954a3"
          origin={{ x: 170, y: 150 }}
        />
        <Triangle
          points={other ?? points}
          labels="DEF"
          facts={facts}
          color="#a14532"
          origin={{ x: overlay ? 170 : 510, y: 150 }}
          degree={overlay ? 0 : angle}
          mirror={overlay ? false : mirror}
          scale={scale}
          hideLabels={overlay}
        />
      </svg>
    </CongruenceFrame>
  );
}
export type CongruenceDiagramCase =
  'SSS' | 'SAS' | 'SSA' | 'ASA' | 'AAS' | 'AAA';
export function CongruenceDiagram({
  source,
  mode,
}: {
  source: CongruenceDiagramCase;
  mode: LanguageMode;
}) {
  const f =
      source === 'SSS'
        ? sideCriteriaCases[0]!
        : source === 'SAS'
          ? sideCriteriaCases[1]!
          : source === 'SSA'
            ? sideCriteriaCases[2]!
            : source === 'ASA'
              ? angleCriteriaCases[0]!
              : source === 'AAS'
                ? angleCriteriaCases[1]!
                : angleCriteriaCases[2]!,
    p =
      source === 'ASA' || source === 'AAS' || source === 'AAA'
        ? angleTriangle(50, 60, 6)
        : source === 'SSA'
          ? ssaAlternatives()[0]!
          : sssTriangle(4, 5, 3)!;
  return (
    <TrianglePairView
      mode={mode}
      points={p}
      other={source === 'SSA' ? ssaAlternatives()[1] : undefined}
      facts={f}
      scale={source === 'AAA' ? 1.4 : 1}
    />
  );
}
export function IsoscelesView({
  apex,
  mode,
  helper = false,
  reveal = false,
}: {
  apex: number;
  mode: LanguageMode;
  helper?: boolean;
  reveal?: boolean;
}) {
  const m = isoscelesModel(apex),
    p = m.points.map((p) => ({ x: 300 + p.x * 34, y: 235 - p.y * 34 })),
    d = { x: 300, y: 235 };
  return (
    <CongruenceFrame mode={mode}>
      <svg
        viewBox="0 0 600 290"
        role="img"
        aria-label={
          mode === 'en'
            ? `Isosceles ABC with AB=AC and apex ${apex} degrees`
            : `等腰三角形 ABC，AB=AC，顶角 ${apex} 度`
        }
      >
        <polygon points={pts(p)} fill="none" stroke="#5954a3" strokeWidth="3" />
        {p.map((v, i) => (
          <text
            key={i}
            x={v.x + (i === 1 ? -20 : 8)}
            y={v.y + (i === 0 ? -12 : 23)}
          >
            {'ABC'[i]}
          </text>
        ))}
        <text x="315" y={p[0]!.y + 35}>
          {apex}°
        </text>
        <text x="190" y="140">
          AB=AC
        </text>
        {helper && (
          <g data-angle-bisector>
            <path
              d={`M${p[0]!.x} ${p[0]!.y}L${d.x} ${d.y}`}
              stroke="#a14532"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text x="307" y="260">
              D
            </text>
            {[
              [p[1]!, d],
              [d, p[2]!],
            ].map(([from, to], i) => {
              const vertex = p[0]!,
                start = Math.atan2(from!.y - vertex.y, from!.x - vertex.x),
                end = Math.atan2(to!.y - vertex.y, to!.x - vertex.x);
              return (
                <path
                  key={i}
                  data-bisector-half={i}
                  d={`M${vertex.x + 18 * Math.cos(start)} ${vertex.y + 18 * Math.sin(start)} A18 18 0 0 0 ${vertex.x + 18 * Math.cos(end)} ${vertex.y + 18 * Math.sin(end)}`}
                  fill="none"
                  stroke="#a14532"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        )}
        {reveal && (
          <g data-base-angles>
            <text x={p[1]!.x - 8} y="220" textAnchor="end">
              {m.base}°
            </text>
            <text x={p[2]!.x + 8} y="220" textAnchor="start">
              {m.base}°
            </text>
          </g>
        )}
      </svg>
    </CongruenceFrame>
  );
}
export function QuadrilateralView({
  mode,
  shear = 1,
  height = 3,
  counter,
  diagonal = false,
}: {
  mode: LanguageMode;
  shear?: number;
  height?: number;
  counter?: string;
  diagonal?: boolean;
}) {
  const m = counter
      ? { points: parallelogramCounterexample(counter), o: null }
      : parallelogramModel(shear, height),
    p = m.points.map((p) => ({ x: 170 + p.x * 30, y: 250 - p.y * 30 }));
  return (
    <CongruenceFrame mode={mode}>
      <svg
        viewBox="0 0 600 300"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Simple quadrilateral ABCD, with givens stated separately'
            : '简单四边形 ABCD，已知条件另列'
        }
      >
        <polygon points={pts(p)} fill="none" stroke="#5954a3" strokeWidth="3" />
        {p.map((v, i) => (
          <text
            key={i}
            x={v.x + (i === 0 || i === 3 ? -18 : 8)}
            y={v.y + (i < 2 ? 22 : -10)}
          >
            {'ABCD'[i]}
          </text>
        ))}
        {diagonal && (
          <g data-diagonals>
            <path
              d={`M${p[0]!.x} ${p[0]!.y}L${p[2]!.x} ${p[2]!.y}M${p[1]!.x} ${p[1]!.y}L${p[3]!.x} ${p[3]!.y}`}
              fill="none"
              stroke="#a14532"
              strokeDasharray="6 4"
            />
            {m.o && (
              <text x={170 + m.o.x * 30 + 8} y={250 - m.o.y * 30}>
                O
              </text>
            )}
          </g>
        )}
      </svg>
    </CongruenceFrame>
  );
}
