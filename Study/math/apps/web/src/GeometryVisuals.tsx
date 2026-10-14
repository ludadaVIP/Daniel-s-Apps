import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { boundedWhole } from './measurementModels';
import { t, type NumberDiagram } from './model';
import {
  rectangleArea,
  triangleRearrangement,
  parallelogramCut,
  trapezoidRearrangement,
  polygonArea,
  cuboid,
  isoPoint,
  cuboidNet,
  unitTiling,
  type Point,
  type NetFaceId,
} from './geometryModels';
export const faceLetters: Record<NetFaceId, string> = {
  left: 'A',
  front: 'B',
  right: 'C',
  back: 'D',
  top: 'E',
  bottom: 'F',
};
export const faceNames: Record<NetFaceId, LocalizedText> = {
  left: t('左面', 'Left'),
  front: t('前面', 'Front'),
  right: t('右面', 'Right'),
  back: t('后面', 'Back'),
  top: t('顶面', 'Top'),
  bottom: t('底面', 'Bottom'),
};
function ScrollFigure({
  children,
  caption,
  mode,
}: {
  children: React.ReactNode;
  caption: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <figure className="math-geometry-figure">
      <div
        className="math-geometry-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Accurate geometry; scroll inside the diagram when needed'
            : '准确几何图；需要时在图内滚动'
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
export function RectangleGrid({
  w,
  h,
  mode,
}: {
  w: number;
  h: number;
  mode: LanguageMode;
}) {
  const m = rectangleArea(w, h),
    width = w * 28 + 80,
    height = h * 28 + 80;
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        '每格确实是边长 1 cm 的单位正方形；格子覆盖面积，外边界测周长。',
        'Each cell is a true 1 cm square. Cells cover area; the outside boundary measures perimeter.',
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Rectangle ${w} cm by ${h} cm, covered with 1 cm squares. Count the cells.`
            : `长方形长 ${w} cm、宽 ${h} cm，用边长 1 cm 的方格覆盖；数格子。`
        }
      >
        {m.cells.map((c, i) => (
          <rect
            key={i}
            data-area-cell={i}
            className="geometry-unit-cell"
            x={40 + c.x * 28}
            y={24 + c.y * 28}
            width="28"
            height="28"
          />
        ))}
        <text x={40 + w * 14} y={h * 28 + 52} textAnchor="middle">
          {w} cm
        </text>
        <text x="4" y={24 + h * 14}>
          {h} cm
        </text>
      </svg>
    </ScrollFigure>
  );
}
export type RearrangementStage =
  'original' | 'mirror' | 'pair' | 'cut' | 'move';
export function AreaRearrangement({
  shape,
  b,
  h,
  apex = 2,
  a = 3,
  stage = 'original',
  mode,
}: {
  shape: 'triangle' | 'parallel' | 'trapezoid';
  b: number;
  h: number;
  apex?: number;
  a?: number;
  stage?: RearrangementStage;
  mode: LanguageMode;
}) {
  const tri = shape === 'triangle' ? triangleRearrangement(b, h, apex) : null;
  const trap =
    shape === 'trapezoid' ? trapezoidRearrangement(a, b, h, apex) : null;
  const pair = tri?.pair ?? trap?.pair ?? parallelogramCut(b, h, apex);
  const original = tri?.original ?? trap?.first ?? pair.original;
  const all = [
    ...original,
    ...pair.original,
    ...pair.rectangle,
    ...pair.cut,
    ...pair.moved,
  ];
  const minX = Math.floor(Math.min(...all.map((p) => p[0]))) - 1,
    maxX = Math.ceil(Math.max(...all.map((p) => p[0]))) + 1;
  const width = (maxX - minX) * 26 + 70,
    height = h * 26 + 100;
  const x = (v: number) => 35 + (v - minX) * 26,
    y = (v: number) => 30 + (h - v) * 26;
  const points = (p: Point[]) =>
    p.map(([px, py]) => `${x(px)},${y(py)}`).join(' ');
  const poly = (p: Point[], role: string, cls: string) =>
    polygonArea(p) > 0 ? (
      <polygon data-piece={role} className={cls} points={points(p)} />
    ) : null;
  const paired = stage === 'pair' || stage === 'cut' || stage === 'move';
  const mainBase = shape === 'trapezoid' && paired ? a + b : b;
  const start = stage === 'move' ? pair.rectangle[0]![0] : 0,
    foot =
      stage === 'original'
        ? tri
          ? apex
          : apex
        : stage === 'move'
          ? start
          : pair.shift;
  const label =
    shape === 'triangle'
      ? t(
          `三角形底 ${b} cm，垂直高 ${h} cm，顶点横坐标 ${apex} cm。`,
          `Triangle base ${b} cm, perpendicular height ${h} cm, apex coordinate ${apex} cm.`,
        )
      : shape === 'trapezoid'
        ? t(
            `${a === b ? '上下底相等的平行四边形' : '梯形'}上底 ${a} cm、下底 ${b} cm、垂直高 ${h} cm。`,
            `${a === b ? 'Parallelogram with equal parallel' : 'Trapezoid parallel'} bases ${a} cm and ${b} cm, perpendicular height ${h} cm.`,
          )
        : t(
            `平行四边形底 ${b} cm、垂直高 ${h} cm、水平错移 ${apex} cm。`,
            `Parallelogram base ${b} cm, perpendicular height ${h} cm, horizontal shear ${apex} cm.`,
          );
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        '网格每格 1 cm²；虚线是垂直高，不是斜边。切块只作平移，空白或虚线旧位置不重复计面积。',
        'Each grid cell is 1 cm². The dashed height is perpendicular, not a slanted side. Cut pieces translate; do not recount the empty ghost position.',
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={`${mode === 'en' ? label.en : label.zh} ${mode === 'en' ? `Rearrangement stage: ${stage}; each grid interval is 1 cm.` : `当前步骤 ${stage}，每格间距 1 cm。`}`}
      >
        {Array.from({ length: maxX - minX + 1 }, (_, i) => (
          <line
            key={`v${i}`}
            className="geometry-grid-line"
            x1={x(minX + i)}
            x2={x(minX + i)}
            y1={y(0)}
            y2={y(h)}
          />
        ))}
        {Array.from({ length: h + 1 }, (_, i) => (
          <line
            key={`h${i}`}
            className="geometry-grid-line"
            x1={x(minX)}
            x2={x(maxX)}
            y1={y(i)}
            y2={y(i)}
          />
        ))}
        {stage === 'original' ? (
          poly(original, 'original', 'geometry-area-a')
        ) : stage === 'mirror' ? (
          poly(tri!.first, 'reflected', 'geometry-area-a')
        ) : stage === 'pair' ? (
          <>
            {poly(
              tri?.first ?? trap?.first ?? pair.original,
              'first',
              'geometry-area-a',
            )}
            {(tri || trap) &&
              poly(tri?.second ?? trap!.second, 'second', 'geometry-area-b')}
          </>
        ) : stage === 'cut' ? (
          <>
            {poly(pair.remaining, 'remaining', 'geometry-area-a')}
            {poly(pair.cut, 'cut', 'geometry-area-b')}
            <line
              className="geometry-cut-line"
              x1={x(pair.shift >= 0 ? pair.shift : 0)}
              x2={x(pair.shift >= 0 ? pair.shift : 0)}
              y1={y(0)}
              y2={y(h)}
            />
          </>
        ) : (
          <>
            {poly(pair.remaining, 'remaining', 'geometry-area-a')}
            {poly(pair.moved, 'moved', 'geometry-area-b')}
            {polygonArea(pair.cut) > 0 && (
              <polygon className="geometry-ghost" points={points(pair.cut)} />
            )}
            <polygon
              className="geometry-result-border"
              points={points(pair.rectangle)}
            />
          </>
        )}
        <line
          className="geometry-height"
          x1={x(foot)}
          x2={x(foot)}
          y1={y(0)}
          y2={y(h)}
        />
        <path
          className="geometry-right-angle"
          d={`M${x(foot)} ${y(0) - 7}h7v7`}
        />
        <text x={x(foot) + 8} y={y(h / 2)}>
          {h} cm
        </text>
        <line
          className="geometry-dimension"
          x1={x(start)}
          x2={x(start + mainBase)}
          y1={y(0) + 25}
          y2={y(0) + 25}
        />
        <text x={x(start + mainBase / 2)} y={y(0) + 47} textAnchor="middle">
          {mainBase} cm
        </text>
        {shape === 'trapezoid' && stage === 'original' && (
          <text x={x(apex + a / 2)} y={y(h) - 8} textAnchor="middle">
            {a} cm
          </text>
        )}
        {tri && stage === 'original' && (apex < 0 || apex > b) && (
          <line
            className="geometry-extension"
            x1={x(Math.min(0, apex))}
            x2={x(Math.max(b, apex))}
            y1={y(0)}
            y2={y(0)}
          />
        )}
      </svg>
    </ScrollFigure>
  );
}
function cubeFaces(x: number, y: number, z: number): Point[][] {
  const p = (a: number, b: number, c: number) => isoPoint(a, b, c);
  return [
    [
      p(x, y, z + 1),
      p(x + 1, y, z + 1),
      p(x + 1, y + 1, z + 1),
      p(x, y + 1, z + 1),
    ],
    [
      p(x, y + 1, z),
      p(x + 1, y + 1, z),
      p(x + 1, y + 1, z + 1),
      p(x, y + 1, z + 1),
    ],
    [
      p(x + 1, y, z),
      p(x + 1, y + 1, z),
      p(x + 1, y + 1, z + 1),
      p(x + 1, y, z + 1),
    ],
  ];
}
export function CuboidView({
  w,
  d,
  h,
  mode,
  unit = 'cm',
}: {
  w: number;
  d: number;
  h: number;
  mode: LanguageMode;
  unit?: 'cm' | 'dm';
}) {
  const m = cuboid(w, d, h),
    corners = [0, w].flatMap((x) =>
      [0, d].flatMap((y) => [0, h].map((z) => isoPoint(x, y, z))),
    );
  const minX = Math.min(...corners.map((p) => p[0])),
    maxX = Math.max(...corners.map((p) => p[0])),
    minY = Math.min(...corners.map((p) => p[1])),
    maxY = Math.max(...corners.map((p) => p[1]));
  const width = maxX - minX + 100,
    height = maxY - minY + 90;
  const points = (ps: Point[]) =>
    ps.map((p) => `${p[0] - minX + 40},${p[1] - minY + 30}`).join(' ');
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        `每小正方体边长 1 ${unit}，代表 1 ${unit}³。立体图有遮挡，切换层图逐层数；不能用二维投影面积代替体积。`,
        `Each small cube has 1 ${unit} edges and represents 1 ${unit}³. Some are occluded; inspect layers to count. A projection’s area is not volume.`,
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: Math.max(280, width), height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Rectangular prism ${w} by ${d} by ${h} ${unit}, made from unit cubes; some are hidden by others.`
            : `长方体长 ${w}、宽 ${d}、高 ${h} ${unit}，由单位正方体组成，部分被其他块遮挡。`
        }
      >
        {m.cubes.map((c) => (
          <g
            key={`${c.x}-${c.y}-${c.z}`}
            data-unit-cube={`${c.x},${c.y},${c.z}`}
            data-layer={c.z + 1}
          >
            {cubeFaces(c.x, c.y, c.z).map((face, i) => (
              <polygon
                key={i}
                className={`geometry-cube-face face-${i}`}
                points={points(face)}
              />
            ))}
          </g>
        ))}
        <text x="20" y={height - 18}>
          {w} {unit} · {d} {unit} · {h} {unit}
        </text>
      </svg>
    </ScrollFigure>
  );
}
export function CubeLayer({
  w,
  d,
  layer,
  total,
  mode,
  unit = 'cm',
}: {
  w: number;
  d: number;
  layer: number;
  total: number;
  mode: LanguageMode;
  unit?: 'cm' | 'dm';
}) {
  boundedWhole(w, 10, 1);
  boundedWhole(d, 10, 1);
  boundedWhole(total, 10, 1);
  if (!Number.isInteger(layer) || layer < 1 || layer > total)
    throw new RangeError('Choose an existing layer');
  const cells = Array.from({ length: w * d }, (_, i) => ({
      x: i % w,
      y: Math.floor(i / w),
    })),
    width = w * 24 + 70,
    height = d * 24 + 70;
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        `第 ${layer}/${total} 层的位置图；每格标记该层一颗 1 ${unit}³ 小正方体。其余层另查看，不把单层当整块。`,
        `Position map for layer ${layer}/${total}; each tile marks one 1 ${unit}³ cube in this layer. Inspect other layers; one layer is not the whole prism.`,
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: Math.max(280, width), height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Layer ${layer} of ${total}, ${w} columns and ${d} rows of unit cubes.`
            : `共 ${total} 层中的第 ${layer} 层，${w} 列、${d} 行单位小正方体。`
        }
      >
        {cells.map((c, i) => (
          <rect
            data-layer-cube={i}
            className="geometry-unit-cell"
            key={i}
            x={35 + c.x * 24}
            y={20 + c.y * 24}
            width="24"
            height="24"
          />
        ))}
        <text x="20" y={height - 16}>
          {mode === 'en' ? 'Layer' : '层'} {layer}/{total}
        </text>
      </svg>
    </ScrollFigure>
  );
}
export function SurfaceNet({
  w,
  d,
  h,
  lid,
  mode,
  selected = 'front',
}: {
  w: number;
  d: number;
  h: number;
  lid: boolean;
  mode: LanguageMode;
  selected?: NetFaceId;
}) {
  const m = cuboidNet(w, d, h, lid),
    width = m.width * 22 + 90,
    height = m.height * 22 + 100;
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        `可折成长方体的展开图，${lid ? '六个面' : '五个面，缺顶面'}；每格 1 cm²。只计理想面片，不计接缝、重叠与裁切损耗。A 左、B 前、C 右、D 后、E 顶、F 底。`,
        `A foldable rectangular-prism net with ${lid ? 'six faces' : 'five faces, without the top'}. Each cell is 1 cm². Ideal panels exclude seams, overlap and cutting waste. A left, B front, C right, D back, E top, F bottom.`,
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Box net for ${w} by ${d} by ${h} cm, ${lid ? 'closed' : 'open-top'}, selected face ${selected}.`
            : `${w}×${d}×${h} cm 盒的展开图，${lid ? '有盖' : '无盖'}，当前选中${faceNames[selected].zh}。`
        }
      >
        {m.faces.map((f) => (
          <g key={f.id} data-net-face={f.id}>
            {Array.from({ length: f.w * f.h }, (_, i) => (
              <rect
                key={i}
                data-face-cell={`${f.id}-${i}`}
                className={`geometry-net-cell ${selected === f.id ? 'selected' : ''}`}
                x={40 + (f.x + (i % f.w)) * 22}
                y={25 + (f.y + Math.floor(i / f.w)) * 22}
                width="22"
                height="22"
              />
            ))}
            <rect
              className="geometry-result-border"
              x={40 + f.x * 22}
              y={25 + f.y * 22}
              width={f.w * 22}
              height={f.h * 22}
            />
            <text
              className="geometry-face-label"
              x={40 + (f.x + f.w / 2) * 22}
              y={25 + (f.y + f.h / 2) * 22}
              textAnchor="middle"
            >
              {faceLetters[f.id]}
            </text>
          </g>
        ))}
        {!lid && (
          <rect
            className="geometry-ghost"
            x={40 + d * 22}
            y="25"
            width={w * 22}
            height={d * 22}
          />
        )}
        <text x="15" y={height - 18}>
          {w} cm · {d} cm · {h} cm
        </text>
      </svg>
    </ScrollFigure>
  );
}
export function UnitTilingView({
  dimension,
  large,
  level = 0,
  layer = 1,
  mode,
}: {
  dimension: 1 | 2 | 3;
  large: 'm' | 'dm';
  level?: number;
  layer?: number;
  mode: LanguageMode;
}) {
  const m = unitTiling(dimension),
    small = large === 'm' && level === 0 ? 'dm' : 'cm',
    big = small === 'dm' ? 'm' : 'dm',
    suffix = dimension === 1 ? '' : dimension === 2 ? '²' : '³';
  if (dimension === 3)
    return (
      <CubeLayer
        w={10}
        d={10}
        layer={layer}
        total={10}
        mode={mode}
        unit={small}
      />
    );
  const width = 340,
    height = dimension === 1 ? 112 : 340;
  return (
    <ScrollFigure
      mode={mode}
      caption={t(
        `这一个 ${big}${suffix} 中，每小${dimension === 1 ? '段' : '格'}为 1 ${small}${suffix}，${dimension === 1 ? '十段排成一行' : '每行十格，共十行'}；单位变小，实际量不变。`,
        `Within this one ${big}${suffix}, each ${dimension === 1 ? 'segment' : 'cell'} is 1 ${small}${suffix}; ${dimension === 1 ? 'ten segments form one row' : 'ten rows each contain ten cells'}. Smaller units retain the actual quantity.`,
      )}
    >
      <svg
        className="math-geometry-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `One ${big}${suffix}, partitioned into ${dimension === 1 ? 'a row' : 'ten rows'} of ten ${small}${suffix} units.`
            : `1 ${big}${suffix}，${dimension === 1 ? '一行' : '十行'}各十个 ${small}${suffix} 单位。`
        }
      >
        {Array.from({ length: m.visible }, (_, i) => (
          <rect
            key={i}
            data-conversion-cell={i}
            className="geometry-unit-cell"
            x={40 + (i % 10) * 26}
            y={20 + Math.floor(i / 10) * 26}
            width="26"
            height={dimension === 1 ? 36 : 26}
          />
        ))}
        <text x="20" y={height - 18}>
          1 {big}
          {suffix}
        </text>
      </svg>
    </ScrollFigure>
  );
}
export function GeometryDiagram({
  diagram,
  mode,
}: {
  diagram: Extract<NumberDiagram, { kind: `geo-${string}` }>;
  mode: LanguageMode;
}) {
  return diagram.kind === 'geo-rectangle' ? (
    <RectangleGrid {...diagram} mode={mode} />
  ) : diagram.kind === 'geo-triangle' ? (
    <AreaRearrangement shape="triangle" {...diagram} mode={mode} />
  ) : diagram.kind === 'geo-parallel' ? (
    <AreaRearrangement
      shape="parallel"
      b={diagram.b}
      h={diagram.h}
      apex={diagram.shift}
      mode={mode}
    />
  ) : diagram.kind === 'geo-trapezoid' ? (
    <AreaRearrangement
      shape="trapezoid"
      a={diagram.a}
      b={diagram.b}
      h={diagram.h}
      apex={diagram.shift}
      mode={mode}
    />
  ) : diagram.kind === 'geo-prism' ? (
    <CuboidView {...diagram} mode={mode} />
  ) : (
    <SurfaceNet {...diagram} mode={mode} />
  );
}
