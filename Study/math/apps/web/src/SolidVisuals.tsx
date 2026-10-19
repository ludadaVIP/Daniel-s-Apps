import { useId } from 'react';
import type { LocalizedText, LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  add3,
  cubeEdges,
  cubeNames,
  cuboidVertices,
  foldCubeNet,
  solidNets,
  type SpacePoint,
  type NetCell,
} from './solidModels';
export type SpaceSegment = {
  a: SpacePoint;
  b: SpacePoint;
  name?: string;
  color?: string;
  dashed?: boolean;
  arrow?: boolean;
};
export function projectSpace(
  p: SpacePoint,
  view = 0,
): readonly [number, number] {
  const angle = ((view ? 130 : 35) * Math.PI) / 180,
    tilt = (28 * Math.PI) / 180;
  return [
    Math.cos(angle) * p[0] - Math.sin(angle) * p[1],
    Math.sin(tilt) * (Math.sin(angle) * p[0] + Math.cos(angle) * p[1]) -
      Math.cos(tilt) * p[2],
  ];
}
export function SolidScene({
  mode,
  points = [],
  segments = [],
  faces = [],
  curves = [],
  view = 0,
  reveal = false,
  caption,
}: {
  mode: LanguageMode;
  points?: { name: string; point: SpacePoint }[];
  segments?: SpaceSegment[];
  faces?: { vertices: SpacePoint[]; color?: string; name?: string }[];
  curves?: SpacePoint[][];
  view?: number;
  reveal?: boolean;
  caption: LocalizedText;
}) {
  const markerId = useId().replace(/:/g, '');
  const all = [
      ...points.map((p) => p.point),
      ...segments.flatMap((s) => [s.a, s.b]),
      ...faces.flatMap((f) => f.vertices),
      ...curves.flat(),
    ],
    projected = all.map((p) => projectSpace(p, view)),
    xs = projected.map((p) => p[0]),
    ys = projected.map((p) => p[1]),
    minX = Math.min(...xs, 0),
    maxX = Math.max(...xs, 1),
    minY = Math.min(...ys, 0),
    maxY = Math.max(...ys, 1),
    scale = Math.min(
      490 / Math.max(maxX - minX, 1),
      285 / Math.max(maxY - minY, 1),
    ),
    xy = (p: SpacePoint) => {
      const q = projectSpace(p, view);
      return [
        320 + (q[0] - (minX + maxX) / 2) * scale,
        215 + (q[1] - (minY + maxY) / 2) * scale,
      ] as const;
    },
    line = (a: SpacePoint, b: SpacePoint) =>
      `M${xy(a).join(' ')}L${xy(b).join(' ')}`;
  const occupied: { x: number; y: number; width: number }[] = [],
    grouped = new Map<string, { names: string[]; p: SpacePoint }>();
  for (const p of points) {
    const q = xy(p.point),
      key = q.map((n) => n.toFixed(5)).join(',');
    const old = grouped.get(key);
    if (old) old.names.push(p.name);
    else grouped.set(key, { names: [p.name], p: p.point });
  }
  const labels = [...grouped.values()].map((g) => {
    const p = xy(g.p),
      name = g.names.join('/'),
      width = name.length * 10 + 8,
      candidates = [
        [p[0] + 9, p[1] - 12],
        [p[0] + 9, p[1] + 26],
        [p[0] - width - 9, p[1] - 12],
        [p[0] - width - 9, p[1] + 26],
        [p[0] - width / 2, p[1] - 34],
      ].map(([x, y]) => ({
        x: Math.max(22, Math.min(616 - width, x!)),
        y: Math.max(25, Math.min(390, y!)),
        width,
      })),
      box =
        candidates.find((a) =>
          occupied.every(
            (b) =>
              a.x > b.x + b.width + 3 ||
              b.x > a.x + a.width + 3 ||
              Math.abs(a.y - b.y) > 23,
          ),
        ) ?? candidates[0]!;
    occupied.push(box);
    return { ...box, name, p: g.p };
  });
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Spatial model; scroll within diagram'
            : '空间模型；需要时在图内滚动'
        }
      >
        <svg
          viewBox="0 0 640 430"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Orthographic spatial model; projected lengths and angles are not measurements'
              : '空间正投影模型；投影长度与角不能直接量读'
          }
        >
          <defs>
            <marker
              id={`spatial-arrow-${markerId}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
            </marker>
          </defs>
          {faces.map((f, i) => (
            <polygon
              key={i}
              data-solid-face={f.name ?? String(i)}
              points={f.vertices.map((p) => xy(p).join(',')).join(' ')}
              fill={f.color ?? '#ddd5ee'}
              fillOpacity="0.32"
              stroke={f.color ?? '#a69abd'}
              strokeWidth="1.5"
            />
          ))}
          {curves.map((c, i) => (
            <polyline
              key={i}
              data-sphere-guide="true"
              points={c.map((p) => xy(p).join(',')).join(' ')}
              stroke="#9987b8"
              strokeWidth="2"
              fill="none"
            />
          ))}
          {segments.map((s, i) => (
            <path
              key={i}
              data-space-segment={s.name ?? String(i)}
              data-space-start={s.a.join(',')}
              data-space-end={s.b.join(',')}
              data-space-arrow={s.arrow ? 'true' : undefined}
              d={line(s.a, s.b)}
              stroke={s.color ?? '#70677e'}
              strokeWidth={s.color ? 4 : 1.8}
              strokeDasharray={s.dashed ? '7 5' : undefined}
              fill="none"
              markerEnd={
                s.arrow && s.a.some((n, i) => n !== s.b[i])
                  ? `url(#spatial-arrow-${markerId})`
                  : undefined
              }
            />
          ))}
          {labels.map((p) => {
            const q = xy(p.p);
            return (
              <g
                key={p.name}
                data-space-point={p.name}
                data-space-coordinate={p.p.join(',')}
              >
                <circle cx={q[0]} cy={q[1]} r="3.5" fill="#4c3f60" />
                <path
                  d={`M${q.join(' ')}L${p.x + 4} ${p.y - 7}`}
                  stroke="#b4a7bd"
                />
                <text x={p.x} y={p.y}>
                  {p.name}
                </text>
              </g>
            );
          })}
          <text x="320" y="414" textAnchor="middle">
            {mode === 'en'
              ? '3D → 2D · projection is not measurement'
              : '三维 → 二维 · 投影图不是量角尺'}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
        <p>
          <Text
            mode={mode}
            text={t(
              '透明线框保留空间数据；换视角只改变投影。投影中重合的字母不代表空间中的点相同。先用前提或坐标核验，再解释图形。',
              'The transparent wireframe retains spatial data. A camera change alters only projection. Labels overlapping in projection need not be coincident in space. Audit premises or coordinates before interpreting the picture.',
            )}
          />
        </p>
      </figcaption>
      {reveal && points.length > 0 && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={
            mode === 'en' ? 'Spatial coordinate audit' : '空间坐标核验表'
          }
        >
          <table>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('点', 'Point')} />
                </th>
                <th>(x,y,z)</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>({p.point.join(', ')})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
export function cuboidScene(a: number, b: number, h: number) {
  const v = cuboidVertices(a, b, h);
  return {
    vertices: v,
    points: v.map((point, i) => ({ name: cubeNames[i]!, point })),
    segments: cubeEdges.map(([i, j]) => ({ a: v[i]!, b: v[j]! })),
    base: [v[0]!, v[1]!, v[2]!, v[3]!],
  };
}
export function PolyhedronScene({
  mode,
  kind,
  n,
  height,
  shift = 0,
  radius = 3,
  view = 0,
  reveal = false,
}: {
  mode: LanguageMode;
  kind: 'prism' | 'pyramid' | 'sphere';
  n: number;
  height: number;
  shift?: number;
  radius?: number;
  view?: number;
  reveal?: boolean;
}) {
  if (kind === 'sphere') {
    const curves = [0, 1, 2].map((axis) =>
      Array.from({ length: 73 }, (_, i) => {
        const p: number[] = [0, 0, 0];
        p[(axis + 1) % 3] = radius * Math.cos((i * Math.PI) / 36);
        p[(axis + 2) % 3] = radius * Math.sin((i * Math.PI) / 36);
        return p as unknown as SpacePoint;
      }),
    );
    return (
      <SolidScene
        mode={mode}
        curves={curves}
        points={[
          { name: 'O', point: [0, 0, 0] },
          { name: 'R', point: [radius, 0, 0] },
        ]}
        segments={[
          { a: [0, 0, 0], b: [radius, 0, 0], name: 'radius', color: '#ae7521' },
        ]}
        view={view}
        reveal={reveal}
        caption={t(
          '球面上的三条圆是定位辅助线，不是棱；半径OR=' +
            radius +
            ' cm。球有一个曲面边界，没有平面多边形面。',
          'The three circles are guides on a sphere, not edges. Radius OR=' +
            radius +
            ' cm. The sphere has one curved boundary and no flat polygonal faces.',
        )}
      />
    );
  }
  const r = Math.sqrt(24 / (n * Math.sin((2 * Math.PI) / n))),
    base = Array.from({ length: n }, (_, i): SpacePoint => [
      r * Math.cos((2 * Math.PI * i) / n),
      r * Math.sin((2 * Math.PI * i) / n),
      0,
    ]),
    top = base.map((p) => add3(p, [shift, 0, height])),
    apex: SpacePoint = [shift, 0, height],
    foot: SpacePoint = [shift, 0, 0],
    faces: { vertices: SpacePoint[]; color?: string }[] = [{ vertices: base }],
    segments: SpaceSegment[] = [];
  if (kind === 'prism') faces.push({ vertices: top });
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    faces.push({
      vertices:
        kind === 'prism'
          ? [base[i]!, base[j]!, top[j]!, top[i]!]
          : [base[i]!, base[j]!, apex],
    });
    segments.push(
      { a: base[i]!, b: base[j]! },
      { a: base[i]!, b: kind === 'prism' ? top[i]! : apex },
    );
    if (kind === 'prism') segments.push({ a: top[i]!, b: top[j]! });
  }
  segments.push({
    a: foot,
    b: apex,
    color: '#b87619',
    dashed: true,
    name: 'perpendicular-height',
  });
  return (
    <SolidScene
      mode={mode}
      faces={faces}
      segments={segments}
      points={[
        { name: 'Q', point: foot },
        { name: 'S', point: apex },
      ]}
      view={view}
      reveal={reveal}
      caption={t(
        `底面积B=12 cm²，垂直高SQ=${height} cm；n=${n}。底面按12面积绘制，斜移不改变垂直高，侧棱不能直接当高。`,
        `Base area B=12 cm² and perpendicular height SQ=${height} cm; n=${n}. The regular base has area twelve. Shear preserves perpendicular height; a sloping edge is not automatically the height.`,
      )}
    />
  );
}
export function NetScene({
  mode,
  cells,
  folded,
  view = 0,
  reveal = false,
}: {
  mode: LanguageMode;
  cells: readonly NetCell[];
  folded: boolean;
  view?: number;
  reveal?: boolean;
}) {
  const m = foldCubeNet(cells),
    colors = ['#a089ca', '#d5a34b', '#78afa5', '#cc9199', '#8d9ec6', '#b8a77b'];
  if (folded) {
    const faces = m.frames.flatMap((f, i) =>
        !f
          ? []
          : [
              {
                name: String(i + 1),
                color: colors[i],
                vertices: [
                  [-1, -1],
                  [1, -1],
                  [1, 1],
                  [-1, 1],
                ].map(
                  ([a, b]) =>
                    f.n.map(
                      (x, k) => 2 * x + 2 * a! * f.r[k]! + 2 * b! * f.u[k]!,
                    ) as unknown as SpacePoint,
                ),
              },
            ],
      ),
      points = m.frames.flatMap((f, i) =>
        f
          ? [
              {
                name: String(i + 1),
                point: f.n.map((x) => 2 * x) as unknown as SpacePoint,
              },
            ]
          : [],
      );
    return (
      <SolidScene
        mode={mode}
        faces={faces}
        points={points}
        view={view}
        reveal={reveal}
        caption={t(
          `折面方向核验：${m.uniqueNormals}个不同法向。${m.valid ? '六面方向各不相同，可形成正方体。' : '方向重复、连接或折向不一致时不能形成六个不同面；重叠编号保留。'}`,
          `Fold-direction audit: ${m.uniqueNormals} distinct normals. ${m.valid ? 'All six face directions are distinct and form a cube.' : 'Repeated directions, disconnected faces or inconsistent folds fail to make six distinct faces. Overlapping labels are retained.'}`,
        )}
      />
    );
  }
  const xs = cells.map((c) => c[0]),
    ys = cells.map((c) => c[1]),
    minX = Math.min(...xs),
    minY = Math.min(...ys),
    width = Math.max(...xs) - minX + 1,
    height = Math.max(...ys) - minY + 1,
    scale = Math.min(510 / width, 280 / height),
    left = (640 - width * scale) / 2,
    top = (380 - height * scale) / 2;
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? 'Six labelled squares' : '六个有编号正方形'}
      >
        <svg
          viewBox="0 0 640 420"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Unit-square net with persistent face numbers'
              : '保留面编号的单位正方形展开图'
          }
        >
          {cells.map(([x, y], i) => (
            <g key={i} data-net-face={i + 1}>
              <rect
                x={left + (x - minX) * scale}
                y={top + (y - minY) * scale}
                width={scale}
                height={scale}
                fill={colors[i]}
                fillOpacity="0.45"
                stroke="#665875"
                strokeWidth="2"
              />
              <text
                x={left + (x - minX + 0.5) * scale}
                y={top + (y - minY + 0.5) * scale + 7}
                textAnchor="middle"
              >
                {i + 1}
              </text>
            </g>
          ))}
          <text x="320" y="405" textAnchor="middle">
            {mode === 'en'
              ? 'Six squares ≠ a guaranteed cube net'
              : '六个正方形 ≠ 一定能折成正方体'}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '沿共边折90°，保留编号；先预测，再切换折面方向核验。看是否有面占用同一方向，不能只数六块。',
            'Fold 90° at shared edges without changing face IDs. Predict before checking folded directions; count distinct face directions, not merely six tiles.',
          )}
        />
      </figcaption>
      {reveal && (
        <p>
          <Text
            mode={mode}
            text={t(
              `连通：${m.connected ? '是' : '否'}；折向一致：${m.consistent ? '是' : '否'}；不同法向：${m.uniqueNormals}。`,
              `Connected: ${m.connected}; consistent folds: ${m.consistent}; distinct normals: ${m.uniqueNormals}.`,
            )}
          />
        </p>
      )}
    </figure>
  );
}
export const netChoices = Object.keys(solidNets) as (keyof typeof solidNets)[];
