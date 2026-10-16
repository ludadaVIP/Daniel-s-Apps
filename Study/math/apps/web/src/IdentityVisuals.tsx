import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  partitionGrid,
  squareRemoval,
  differencePieces,
  type AreaSegment,
} from './identityModels';
const colours = ['#b4addc', '#efd9a8', '#a4cec6', '#d6b6c4'];
function Frame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: ReturnType<typeof t>;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-identity-figure">
      <div
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Area construction; scroll locally'
            : '面积构造，可在图内滚动'
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
export function ProductArea({
  rows,
  columns,
  mode,
}: {
  rows: AreaSegment[];
  columns: AreaSegment[];
  mode: LanguageMode;
}) {
  const m = partitionGrid(rows, columns),
    scale = 240 / Math.max(m.width, m.height),
    ox = 100,
    oy = 55;
  return (
    <Frame
      mode={mode}
      caption={t(
        `仅按给定正长度画图；${m.width}×${m.height}=${m.area} 平方单位。面积图支持正长度实例，一般有符号恒等关系另用分配律证明。`,
        `A supplied positive-length example: ${m.width}×${m.height}=${m.area} square units. Prove the general signed identity separately by distribution.`,
      )}
    >
      <svg
        viewBox="0 0 500 350"
        role="img"
        aria-label={
          mode === 'en'
            ? `Partitioned rectangle, width ${m.width}, height ${m.height}`
            : `分割长方形，宽 ${m.width}、高 ${m.height}`
        }
      >
        {m.cells
          .filter((c) => c.area > 0)
          .map((c, i) => (
            <g key={c.id} data-area-cell={c.id} data-area-value={c.area}>
              <rect
                x={ox + c.x * scale}
                y={oy + c.y * scale}
                width={c.width * scale}
                height={c.height * scale}
                fill={colours[i % 4]}
                stroke="#514c5e"
              />
              <text
                x={ox + (c.x + c.width / 2) * scale}
                y={oy + (c.y + c.height / 2) * scale}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {c.area}
              </text>
            </g>
          ))}
        {m.columns.map((c, i) => (
          <text
            key={i}
            x={
              ox +
              (m.columns.slice(0, i).reduce((s, p) => s + p.value, 0) +
                c.value / 2) *
                scale
            }
            y="35"
            textAnchor="middle"
          >
            {c.label} = {c.value}
          </text>
        ))}
        {m.rows.map((r, i) => (
          <text
            key={i}
            x="90"
            y={
              oy +
              (m.rows.slice(0, i).reduce((s, p) => s + p.value, 0) +
                r.value / 2) *
                scale
            }
            textAnchor="end"
          >
            {r.label} = {r.value}
          </text>
        ))}
        <text x={ox} y="325">
          {mode === 'en'
            ? 'Partition pieces retain their actual area.'
            : '各部分按真实面积比例绘制。'}
        </text>
      </svg>
    </Frame>
  );
}
export function SquareRemoval({
  x,
  b,
  mode,
}: {
  x: number;
  b: number;
  mode: LanguageMode;
}) {
  const m = squareRemoval(x, b),
    s = 240 / x,
    ox = 100,
    oy = 45;
  return (
    <Frame
      mode={mode}
      caption={t(
        `x=${x}，b=${b}，且 x>b>0。整块 ${m.whole}，减两条各 ${m.strip}，角块 ${m.overlap} 被重减一次须补回，余 ${m.remaining}。`,
        `x=${x}, b=${b}, with x>b>0. Start ${m.whole}; subtract two strips of ${m.strip}; restore overlap ${m.overlap} once, leaving ${m.remaining}.`,
      )}
    >
      <svg
        viewBox="0 0 500 350"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two removed strips overlap in one corner'
            : '减去的两条在角块重叠'
        }
      >
        <rect
          x={ox}
          y={oy}
          width="240"
          height="240"
          fill="#b4addc"
          stroke="#514c5e"
        />
        <rect
          data-removal-strip="right"
          x={ox + (x - b) * s}
          y={oy}
          width={b * s}
          height="240"
          fill="#e5bda6"
          opacity=".72"
        />
        <rect
          data-removal-strip="bottom"
          x={ox}
          y={oy + (x - b) * s}
          width="240"
          height={b * s}
          fill="#e5bda6"
          opacity=".72"
        />
        <rect
          data-restored-overlap
          x={ox + (x - b) * s}
          y={oy + (x - b) * s}
          width={b * s}
          height={b * s}
          fill="none"
          stroke="#725132"
          strokeWidth="3"
          strokeDasharray="5 3"
        />
        <text
          x={ox + ((x - b) * s) / 2}
          y={oy + ((x - b) * s) / 2}
          textAnchor="middle"
        >
          (x−b)²
        </text>
        <text x={ox + 120} y="30" textAnchor="middle">
          x = {x}
        </text>
        <text x="90" y={oy + 120} textAnchor="end">
          x = {x}
        </text>
        <text
          x={ox + (x - b / 2) * s}
          y={oy + (x - b / 2) * s}
          textAnchor="middle"
        >
          b²
        </text>
        <text x="70" y="325">
          x² − xb − xb + b² = (x−b)²
        </text>
      </svg>
    </Frame>
  );
}
export function DifferencePieces({
  x,
  b,
  rearranged,
  mode,
}: {
  x: number;
  b: number;
  rearranged: boolean;
  mode: LanguageMode;
}) {
  const m = differencePieces(x, b),
    s = 260 / (x + b),
    pieces = rearranged ? m.after : m.before,
    ox = 95,
    oy = 55;
  return (
    <Frame
      mode={mode}
      caption={t(
        `x=${x}>b=${b}>0。A 面积 ${m.pieceAreas[0]}、B 面积 ${m.pieceAreas[1]}；B 只旋转，未拉伸。合计 ${m.area}，等于 (${x}+${b})(${x}−${b})。`,
        `x=${x}>b=${b}>0. Piece A has area ${m.pieceAreas[0]}, B has ${m.pieceAreas[1]}. B rotates without stretching. Total ${m.area} equals (${x}+${b})(${x}−${b}).`,
      )}
    >
      <svg
        viewBox="0 0 500 350"
        role="img"
        aria-label={
          mode === 'en'
            ? rearranged
              ? 'Same two pieces rearranged into a rectangle'
              : 'Square with a corner square removed'
            : rearranged
              ? '同两块重排成长方形'
              : '大正方形去掉角上小正方形'
        }
      >
        {!rearranged && (
          <rect
            data-removed-square
            x={ox + m.removed.x * s}
            y={oy + m.removed.y * s}
            width={b * s}
            height={b * s}
            fill="none"
            stroke="#85594d"
            strokeDasharray="5 4"
          />
        )}
        {pieces.map((p, i) => (
          <g
            key={p.id}
            data-preserved-piece={p.id}
            data-piece-area={p.width * p.height}
          >
            <rect
              x={ox + p.x * s}
              y={oy + p.y * s}
              width={p.width * s}
              height={p.height * s}
              fill={colours[i]}
              stroke="#514c5e"
            />
            <text
              x={ox + (p.x + p.width / 2) * s}
              y={oy + (p.y + p.height / 2) * s}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {p.id}
            </text>
          </g>
        ))}
        <text
          x={ox + ((rearranged ? x + b : x) * s) / 2}
          y="30"
          textAnchor="middle"
        >
          {rearranged ? 'x+b' : 'x'} = {rearranged ? x + b : x}
        </text>
        <text
          x="85"
          y={oy + ((rearranged ? x - b : x) * s) / 2}
          textAnchor="end"
        >
          {rearranged ? 'x−b' : 'x'} = {rearranged ? x - b : x}
        </text>
        <text x="60" y="325">
          {rearranged ? '(x+b)(x−b)' : 'x² − b²'} ·{' '}
          {mode === 'en' ? 'same two pieces' : '同样两块'}
        </text>
      </svg>
    </Frame>
  );
}
