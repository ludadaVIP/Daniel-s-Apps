import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  addV,
  isZeroV,
  vectorText,
  vectorNumber,
  vectorZero,
  type Vector,
} from './vectorModels';
export type VectorArrow = {
  name: string;
  tail: Vector;
  value: Vector;
  color?: string;
};
export type VectorPoint = { name: string; position: Vector };
export function VectorPlot({
  mode,
  arrows = [],
  points = [],
  segments = [],
  polygon,
  wide = false,
  reveal = false,
  complexPlane = false,
  caption,
}: {
  mode: LanguageMode;
  arrows?: VectorArrow[];
  points?: VectorPoint[];
  segments?: { a: Vector; b: Vector }[];
  polygon?: Vector[];
  wide?: boolean;
  reveal?: boolean;
  complexPlane?: boolean;
  caption: LocalizedText;
}) {
  const id = useId().replace(/:/g, ''),
    bound = complexPlane ? (wide ? 10 : 5) : wide ? 16 : 10,
    step = complexPlane ? (wide ? 2 : 1) : wide ? 4 : 2,
    scale = 500 / (2 * bound),
    px = (x: number) => 70 + (x + bound) * scale,
    py = (y: number) => 540 - (y + bound) * scale;
  const xy = (p: Vector) => [vectorNumber(p[0]), vectorNumber(p[1])] as const,
    where = (p: Vector) => {
      const [x, y] = xy(p);
      return `${px(x)},${py(y)}`;
    },
    inside = (p: Vector) => xy(p).every((x) => Math.abs(x) <= bound);
  const grouped = [
    ...new Map(
      points.map((p) => [
        vectorText(p.position),
        {
          ...p,
          name: points
            .filter((q) => vectorText(q.position) === vectorText(p.position))
            .map((q) => q.name)
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
    }[] = [],
    labels = new Map<
      string,
      { left: number; top: number; width: number; height: number }
    >();
  for (const p of grouped.filter((p) => inside(p.position))) {
    const [x, y] = xy(p.position),
      width = p.name.length * 10 + 4,
      height = 22,
      candidates = [
        [px(x) + 10, py(y) - 28],
        [px(x) + 10, py(y) + 10],
        [px(x) - width - 10, py(y) - 28],
        [px(x) - width - 10, py(y) + 10],
        [px(x) - width / 2, py(y) - 52],
      ].map(([left, top]) => ({
        left: Math.max(72, Math.min(568 - width, left!)),
        top: Math.max(42, Math.min(516, top!)),
        width,
        height,
      })),
      box =
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
    labels.set(vectorText(p.position), box);
  }
  const colors = ['#6254a1', '#b46c15', '#278b80', '#ac4c3d'];
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          complexPlane
            ? mode === 'en'
              ? 'Complex plane; scroll within plot'
              : '复平面；需要时在图内滚动'
            : mode === 'en'
              ? 'Vector grid; scroll within plot'
              : '向量网格；需要时在图内滚动'
        }
      >
        <svg
          viewBox="0 0 640 610"
          role="img"
          aria-label={
            complexPlane
              ? mode === 'en'
                ? `Complex plane, Re and Im axes use equal units, window ±${bound}`
                : `复平面，实轴和虚轴同单位标尺，视窗±${bound}`
              : mode === 'en'
                ? `Vector grid, equal axis units, window ±${bound}`
                : `向量网格，两轴同单位标尺，视窗±${bound}`
          }
        >
          <defs>
            <clipPath id={`clip-${id}`}>
              <rect x="70" y="40" width="500" height="500" />
            </clipPath>
            {arrows.map((a, i) => (
              <marker
                key={i}
                id={`arrow-${id}-${i}`}
                markerWidth="5"
                markerHeight="5"
                refX="9"
                refY="5"
                orient="auto"
                viewBox="0 0 10 10"
              >
                <path d="M0 0L10 5L0 10Z" fill={a.color ?? colors[i % 4]} />
              </marker>
            ))}
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
            d={`M60 ${py(0)}H590M${px(0)} 550V28`}
            stroke="#82798e"
            fill="none"
          />
          <text x="610" y={py(0) + 20}>
            {complexPlane ? 'Re' : 'x'}
          </text>
          <text x={px(0) + 12} y="22">
            {complexPlane ? 'Im' : 'y'}
          </text>
          <g clipPath={`url(#clip-${id})`}>
            {polygon && (
              <polygon
                points={polygon.map(where).join(' ')}
                fill="#e9e3f3"
                stroke="#7f759d"
                strokeWidth="2"
                data-vector-polygon="true"
              />
            )}
            {segments.map((s, i) => (
              <path
                key={i}
                d={`M${where(s.a)}L${where(s.b)}`}
                stroke="#a59086"
                strokeDasharray="6 4"
                fill="none"
              />
            ))}
            {arrows.map((a, i) => {
              const color = a.color ?? colors[i % 4],
                head = addV(a.tail, a.value),
                [x, y] = xy(a.tail);
              return isZeroV(a.value) ? (
                <circle
                  key={i}
                  data-zero-vector={a.name}
                  data-vector-tail={vectorText(a.tail)}
                  cx={px(x)}
                  cy={py(y)}
                  r={6 + i * 1.5}
                  stroke={color}
                  strokeWidth="2"
                  fill="white"
                />
              ) : (
                <path
                  key={i}
                  data-vector-arrow={a.name}
                  data-vector-tail={vectorText(a.tail)}
                  data-vector-value={vectorText(a.value)}
                  data-vector-head={vectorText(head)}
                  d={`M${where(a.tail)}L${where(head)}`}
                  stroke={color}
                  strokeWidth={i === 0 ? 4 : 3}
                  fill="none"
                  markerEnd={`url(#arrow-${id}-${i})`}
                />
              );
            })}
          </g>
          {grouped
            .filter((p) => inside(p.position))
            .map((p) => {
              const [x, y] = xy(p.position),
                box = labels.get(vectorText(p.position))!;
              return (
                <g
                  key={p.name}
                  data-vector-point={p.name}
                  data-coordinate={vectorText(p.position)}
                >
                  <circle cx={px(x)} cy={py(y)} r="4" fill="#483c51" />
                  <path
                    d={`M${px(x)} ${py(y)}L${box.left + box.width / 2} ${box.top + box.height / 2}`}
                    stroke="#b8adb8"
                  />
                  <text x={box.left} y={box.top + 16}>
                    {p.name}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
        <p>
          <Text
            mode={mode}
            text={t(
              `两轴同单位，当前±${bound}只是图窗。箭头可平移，分量仍按终点减起点；零向量画圆点，不捏造箭头方向。`,
              `Axes use equal unit lengths; ±${bound} is only the viewing window. Translating arrows preserves components. Zero vectors use dots rather than invented arrow directions.`,
            )}
          />
        </p>
        {arrows.length > 0 && (
          <p>
            <Text
              mode={mode}
              text={t(
                '箭头按下列名称对应；重合箭头不人为错开。',
                'Names below identify arrows; coincident arrows are not displaced artificially.',
              )}
            />
            {arrows.map((a, i) => (
              <span
                key={i}
                style={{
                  color: a.color ?? colors[i % 4],
                  marginInlineEnd: '1rem',
                }}
              >
                {a.name}
              </span>
            ))}
          </p>
        )}
        {[
          ...points.map((p) => p.position),
          ...arrows.flatMap((a) => [a.tail, addV(a.tail, a.value)]),
        ].some((p) => !inside(p)) && (
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '部分点超出视窗；扩大视窗或查看精确表，不把图边当成数学边界。',
                'Some points lie outside the window. Enlarge it or read the exact table; the frame is not a mathematical boundary.',
              )}
            />
          </p>
        )}
      </figcaption>
      {reveal && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={mode === 'en' ? 'Exact vector audit' : '精确向量核验表'}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('箭头', 'Arrow')} />
                </th>
                <th>
                  <Text mode={mode} text={t('起点', 'Tail')} />
                </th>
                <th>
                  <Text mode={mode} text={t('分量', 'Components')} />
                </th>
                <th>
                  <Text mode={mode} text={t('终点', 'Head')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {arrows.map((a, i) => (
                <tr key={i}>
                  <td>{a.name}</td>
                  <td>{vectorText(a.tail)}</td>
                  <td>{vectorText(a.value)}</td>
                  <td>{vectorText(addV(a.tail, a.value))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
export const originPoint: VectorPoint = { name: 'O', position: vectorZero };
