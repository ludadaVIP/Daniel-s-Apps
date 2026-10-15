import type { LanguageMode, LocalizedText } from '@study/shared';
import { useEffect, useRef } from 'react';
import { t } from './model';
import { Text } from './ui';
import {
  circleParts,
  circleMeasures,
  sectorRearrangement,
  cylinderMeasures,
  piTerm,
} from './circleModels';
export function CircleFrame({
  children,
  mode,
  caption,
  focus,
}: {
  children: React.ReactNode;
  mode: LanguageMode;
  caption: LocalizedText;
  focus?: { min: number; max: number };
}) {
  const region = useRef<HTMLDivElement>(null),
    low = focus?.min,
    high = focus?.max;
  useEffect(() => {
    const el = region.current;
    if (!el || low === undefined || high === undefined) return;
    const follow = () => {
      if (!el.clientWidth) return;
      let next = el.scrollLeft;
      if (high - low > el.clientWidth - 24)
        next = (low + high) / 2 + 12 - el.clientWidth / 2;
      else {
        if (low + 12 < next + 12) next = low;
        if (high + 12 > next + el.clientWidth - 12)
          next = high + 24 - el.clientWidth;
      }
      el.scrollLeft = Math.max(
        0,
        Math.min(el.scrollWidth - el.clientWidth, next),
      );
    };
    follow();
    if (typeof ResizeObserver === 'undefined') return;
    let previous = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== previous) {
        previous = el.clientWidth;
        follow();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [low, high]);
  return (
    <figure className="math-circle-figure">
      <div
        ref={region}
        className="math-circle-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Circle model; scroll within the figure'
            : '圆与测量模型；可在图内滚动'
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
export function CircleParts({
  r = 3,
  angle = 0,
  offset = 0.5,
  mode,
}: {
  r?: number;
  angle?: number;
  offset?: number;
  mode: LanguageMode;
}) {
  const m = circleParts(r, angle, offset),
    scale = 22,
    xy = (p: number[]) => [180 + p[0]! * scale, 175 + p[1]! * scale],
    radius = xy(m.radius),
    ends = m.diameter.map(xy),
    chord = m.chord.map(xy);
  return (
    <CircleFrame
      mode={mode}
      caption={t(
        'O 是圆心。OA 从圆心到圆周；AB 两端在圆周且经过 O；CD 两端在圆周，只有经过 O 才也是直径。长度按同一比例绘制，旋转不改变长度。',
        'O is the centre. OA joins centre to boundary; AB joins two boundary points through O. CD is a chord and is also a diameter only when it passes through O. One scale is used; rotation preserves lengths.',
      )}
    >
      <svg
        viewBox="0 0 400 350"
        style={{ width: 400, height: 350 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Circle radius ${r} cm; chord ${m.isDiameter ? 'through' : 'away from'} centre`
            : `半径 ${r} cm；弦${m.isDiameter ? '经过' : '不经过'}圆心`
        }
      >
        <circle cx="180" cy="175" r={r * scale} className="circle-boundary" />
        <line
          data-circle-diameter
          x1={ends[0]![0]}
          y1={ends[0]![1]}
          x2={ends[1]![0]}
          y2={ends[1]![1]}
          className="circle-diameter"
        />
        <line
          data-circle-radius
          x1="180"
          y1="175"
          x2={radius[0]}
          y2={radius[1]}
          className="circle-radius"
        />
        <line
          data-circle-chord
          x1={chord[0]![0]}
          y1={chord[0]![1]}
          x2={chord[1]![0]}
          y2={chord[1]![1]}
          className="circle-chord"
        />
        <circle cx="180" cy="175" r="4" className="circle-centre" />
        <text x="187" y="166">
          O
        </text>
        <text x={radius[0]! + 8} y={radius[1]! + 18}>
          {m.isDiameter ? 'A=D' : 'A'}
        </text>
        <text x={ends[0]![0]! - 17} y={ends[0]![1]! - 6}>
          {m.isDiameter ? 'B=C' : 'B'}
        </text>
        {!m.isDiameter && (
          <>
            <text x={chord[0]![0]! - 15} y={chord[0]![1]! + 18}>
              C
            </text>
            <text x={chord[1]![0]! + 8} y={chord[1]![1]! + 18}>
              D
            </text>
          </>
        )}
      </svg>
    </CircleFrame>
  );
}
export function RollingCircle({
  r,
  progress,
  mode,
}: {
  r: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = circleMeasures(r),
    scale = 18;
  if (!Number.isFinite(progress) || progress < 0 || progress > 1)
    throw new RangeError('Use a fraction of one turn');
  const origin = r * scale + 40,
    x = origin + progress * m.c * scale,
    cy = 40 + r * scale,
    theta = progress * 2 * Math.PI,
    mark = [x - r * scale * Math.sin(theta), cy + r * scale * Math.cos(theta)];
  return (
    <CircleFrame
      mode={mode}
      focus={{ min: x - r * scale, max: x + r * scale }}
      caption={t(
        '同一理想圆无滑动滚一周，标记回到接触点，前进距离等于整条圆周长。下方直径线与路程使用同一厘米比例；图形由几何值绘制，表中另显示按精度取近似的模拟读数。',
        'An ideal circle rolls without slipping. After one turn the mark returns to contact and travel equals its circumference. Diameter and travel use the same centimetre scale; the geometry is ideal while the table separately rounds simulated readings to the chosen precision.',
      )}
    >
      <svg
        viewBox={`0 0 ${m.c * scale + 2 * r * scale + 90} ${2 * r * scale + 110}`}
        style={{
          width: m.c * scale + 2 * r * scale + 90,
          height: 2 * r * scale + 110,
        }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Rolling ${Math.round(progress * 100)} percent of a turn`
            : `滚动一周的 ${Math.round(progress * 100)}%`
        }
      >
        <line
          x1={origin}
          y1={40 + 2 * r * scale}
          x2={origin + m.c * scale}
          y2={40 + 2 * r * scale}
          className="circle-guide"
        />
        <line
          data-roll-travel
          x1={origin}
          y1={40 + 2 * r * scale}
          x2={x}
          y2={40 + 2 * r * scale}
          className="circle-radius"
        />
        <circle cx={x} cy={cy} r={r * scale} className="circle-boundary" />
        <line
          x1={x}
          y1={cy}
          x2={mark[0]}
          y2={mark[1]}
          className="circle-diameter"
        />
        <circle
          data-roll-mark
          cx={mark[0]}
          cy={mark[1]}
          r="5"
          className="circle-centre"
        />
        <line
          data-roll-diameter
          x1={origin}
          y1={70 + 2 * r * scale}
          x2={origin + m.d * scale}
          y2={70 + 2 * r * scale}
          className="circle-chord"
        />
        <text x={origin} y={95 + 2 * r * scale}>
          d = {m.d} cm
        </text>
      </svg>
    </CircleFrame>
  );
}
export function CircleSectors({
  r = 3,
  count = 8,
  rearranged = false,
  mode,
}: {
  r?: number;
  count?: number;
  rearranged?: boolean;
  mode: LanguageMode;
}) {
  const m = sectorRearrangement(r, count),
    scale = 22,
    R = r * scale,
    s = m.s * scale,
    H = m.height * scale,
    width = Math.max(360, (m.base + 2 * m.s) * scale + 80),
    cx = width / 2,
    cy = R + 35,
    top = 45 + m.sag * scale;
  const point = (angle: number) => [
    cx + R * Math.cos(angle),
    cy + R * Math.sin(angle),
  ];
  return (
    <CircleFrame
      mode={mode}
      caption={t(
        `原圆与重排都保留 ${count} 个同样的扇形，面积不增减。有限份数的上下边仍是弧线，虚线只作辅助，不冒充精确长方形。份数增多时，直线底趋近半周弧长 πr，高趋近 r；有限图的直线底为 ${m.base.toFixed(3)} cm，高为 ${m.height.toFixed(3)} cm。`,
        `Both arrangements retain the same ${count} sectors with no area added or lost. Finite upper and lower edges are still arcs; dashed guides are not an exact rectangle. With finer sectors, the straight guide base approaches half-circumference πr and height approaches r. This finite straight guide base is ${m.base.toFixed(3)} cm, with height ${m.height.toFixed(3)} cm.`,
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${2 * R + 100}`}
        style={{ width, height: 2 * R + 100 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `${count} equal sectors ${rearranged ? 'rearranged with curved edges' : 'in the original circle'}`
            : `${count} 个等扇形${rearranged ? '重排，保留弧边' : '组成原圆'}`
        }
      >
        {m.pieces.map((p) => {
          const a0 = (p.id * 2 * Math.PI) / count,
            a1 = ((p.id + 1) * 2 * Math.PI) / count,
            start = point(a0),
            end = point(a1);
          const x = 40 + s + p.apex[0] * scale,
            y = top + p.apex[1] * scale;
          const path = rearranged
            ? p.up
              ? `M ${x} ${y} L ${x - s} ${top} A ${R} ${R} 0 0 1 ${x + s} ${top} Z`
              : `M ${x} ${y} L ${x + s} ${top + H} A ${R} ${R} 0 0 1 ${x - s} ${top + H} Z`
            : `M ${cx} ${cy} L ${start[0]} ${start[1]} A ${R} ${R} 0 0 1 ${end[0]} ${end[1]} Z`;
          return (
            <path
              key={p.id}
              data-circle-sector={p.id}
              d={path}
              className={p.id % 2 ? 'circle-sector-b' : 'circle-sector-a'}
            />
          );
        })}
        {rearranged && (
          <>
            <path
              data-sector-guide
              d={`M 40 ${top} h ${m.base * scale} l ${s} ${H} h ${-m.base * scale} Z`}
              className="circle-guide"
            />
            <text x="40" y={top + H + 38}>
              N = {count} · r = {r} cm
            </text>
          </>
        )}
        {!rearranged && (
          <text x="30" y={2 * R + 80}>
            N = {count} · r = {r} cm
          </text>
        )}
      </svg>
    </CircleFrame>
  );
}
export function CylinderNet({
  r = 2,
  h = 5,
  lids = 2,
  mode,
}: {
  r?: number;
  h?: number;
  lids?: 0 | 1 | 2;
  mode: LanguageMode;
}) {
  const m = cylinderMeasures(r, h, lids),
    scale = 18,
    W = m.netWidth * scale,
    H = h * scale,
    R = r * scale,
    cx = 50 + W / 2,
    top = 2 * R + 60,
    width = Math.max(360, W + 110),
    height = H + 4 * R + 140;
  return (
    <CircleFrame
      mode={mode}
      caption={t(
        '侧面完全展开是长方形，长等于底圆周长 2πr，宽等于高 h；圆底直径 2r 与侧面长不可混用。所有边用同一厘米比例，圆与侧面不重叠。此图只算面片，不含粘贴舌、接缝或材料浪费。体积使用完整理想圆柱的内部 r、h，与是否显示盖片分开。',
        'The fully unwrapped side is a rectangle of length 2πr and width h. Its length is not the base diameter 2r. All edges share one centimetre scale; circles do not overlap the side. This is face area without tabs, seams or waste. Volume uses internal dimensions of the full ideal cylinder, separately from displayed end faces.',
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Cylinder net: radius ${r}, height ${h}, ${lids} circular ends`
            : `圆柱展开：半径 ${r}，高 ${h}，${lids} 个圆面`
        }
      >
        <rect
          data-cylinder-side
          x="50"
          y={top}
          width={W}
          height={H}
          className="circle-net-side"
        />
        {lids >= 1 && (
          <circle
            data-cylinder-end
            cx={cx}
            cy={top - R}
            r={R}
            className="circle-boundary"
          />
        )}
        {lids === 2 && (
          <circle
            data-cylinder-end
            cx={cx}
            cy={top + H + R}
            r={R}
            className="circle-boundary"
          />
        )}
        <text x="55" y={top + H / 2 + 6}>
          h = {h} cm
        </text>
        <text x="50" y={top + H + 2 * R + 40}>
          2πr = {piTerm(2 * r)} cm
        </text>
        <line
          x1={cx}
          y1={top - R}
          x2={cx + R}
          y2={top - R}
          className="circle-radius"
          visibility={lids ? 'visible' : 'hidden'}
        />
        {lids >= 1 && (
          <text x={cx + 5} y={top - R - 8}>
            r = {r}
          </text>
        )}
      </svg>
    </CircleFrame>
  );
}
