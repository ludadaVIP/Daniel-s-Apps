import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  fiveNumber,
  numericR,
  pairedData,
  type QuartileConvention,
  type PairedRecord,
} from './researchModels';
export function ResearchFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-research-figure">
      <div
        className="math-research-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Data display; scroll locally'
            : '数据图；需要时在图内滚动'
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
export function ResearchBoxes({
  groups,
  mode,
  min = 0,
  max = 12,
  step = 2,
  convention = 'exclude',
  reveal = false,
}: {
  groups: { name: string; values: string[] }[];
  mode: LanguageMode;
  min?: number;
  max?: number;
  step?: number;
  convention?: QuartileConvention;
  reveal?: boolean;
}) {
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    max <= min ||
    !Number.isFinite(step) ||
    step <= 0 ||
    (max - min) / step > 100
  )
    throw new RangeError('Labelled common axis');
  const summaries = groups.map((g) => ({
    ...g,
    s: fiveNumber(g.values, convention),
  }));
  if (summaries.some((g) => numericR(g.s.min) < min || numericR(g.s.max) > max))
    throw new RangeError('Axis must show every observation');
  const rowHeight = Math.max(
      125,
      ...summaries.map((g) => {
        const counts = new Map<string, number>();
        g.s.ordered.forEach((v) => {
          const k = String(numericR(v));
          counts.set(k, (counts.get(k) ?? 0) + 1);
        });
        return 85 + 9 * Math.max(...counts.values());
      }),
    ),
    x = (v: number) => 80 + ((v - min) / (max - min)) * 440,
    height = 100 + groups.length * rowHeight,
    ticks = Array.from(
      { length: Math.floor((max - min) / step) + 1 },
      (_, i) => min + i * step,
    );
  return (
    <ResearchFrame
      mode={mode}
      caption={t(
        '共同数轴；须到最小/最大值，不使用 1.5×IQR 截须。箱从 Q1 到 Q3，中线是中位数；下方逐条点保留重复记录。箱宽不表示样本量，n 单独标注。',
        'A common axis with min–max whiskers, not 1.5×IQR whiskers. The box runs Q1 to Q3 with a median line; dots retain repeated records. Box length is not sample size: n is stated separately.',
      )}
    >
      <svg
        viewBox={`0 0 600 ${height}`}
        role="img"
        aria-label={
          mode === 'en'
            ? 'Box plots and original observations on one scale'
            : '同尺度箱线图与原始记录'
        }
      >
        {summaries.map((g, i) => {
          const y = 65 + i * rowHeight,
            v = [g.s.min, g.s.q1, g.s.median, g.s.q3, g.s.max].map(numericR),
            stacks = new Map<string, number>(),
            labels = new Map<number, string[]>();
          v.forEach((n, j) =>
            labels.set(n, [
              ...(labels.get(n) ?? []),
              ['min', 'Q1', 'median', 'Q3', 'max'][j]!,
            ]),
          );
          return (
            <g key={g.name} data-box-group={g.name}>
              <text x="8" y={y + 5}>
                {g.name}
              </text>
              <text x="8" y={y + 28} fontSize="12">
                n={g.s.n}
              </text>
              <path
                d={`M${x(v[0]!)} ${y}H${x(v[4]!)}M${x(v[0]!)} ${y - 12}v24M${x(v[4]!)} ${y - 12}v24`}
                stroke="currentColor"
                fill="none"
              />
              <rect
                data-box-body
                x={x(v[1]!)}
                y={y - 15}
                width={x(v[3]!) - x(v[1]!)}
                height="30"
                fill="#ece7f6"
                stroke="#5954a3"
                strokeWidth="2"
              />
              <path
                data-box-median
                d={`M${x(v[2]!)} ${y - 15}v30`}
                stroke="#a14532"
                strokeWidth="3"
              />
              {reveal &&
                [...labels].map(([n, names], j) => (
                  <text
                    key={j}
                    data-box-label
                    x={x(n)}
                    y={y - 23 - (j % 2) * 15}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {names.join('/')}={n}
                  </text>
                ))}
              {g.s.ordered.map((r, j) => {
                const key = String(numericR(r)),
                  level = stacks.get(key) ?? 0;
                stacks.set(key, level + 1);
                return (
                  <circle
                    key={j}
                    data-observation={key}
                    cx={x(Number(key))}
                    cy={y + 39 + level * 9}
                    r="3.5"
                    fill="#5954a3"
                  >
                    <title>
                      {g.name} #{j + 1}: {key}
                    </title>
                  </circle>
                );
              })}
            </g>
          );
        })}
        <path d={`M80 ${height - 35}H520`} stroke="currentColor" />
        {ticks.map((v) => (
          <g key={v}>
            <path d={`M${x(v)} ${height - 40}v10`} stroke="currentColor" />
            <text x={x(v)} y={height - 12} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
      </svg>
    </ResearchFrame>
  );
}
export function ResearchScatter({
  records,
  mode,
  selected,
  wide = false,
  xLabel = 'x',
  yLabel = 'y',
}: {
  records: PairedRecord[];
  mode: LanguageMode;
  selected?: string;
  wide?: boolean;
  xLabel?: string;
  yLabel?: string;
}) {
  const m = pairedData(records),
    xmax = wide ? 12 : 10,
    ymax = 10,
    x = (v: number) => 65 + (v / xmax) * 430,
    y = (v: number) => 310 - (v / ymax) * 260;
  if (
    m.complete.some((r) => r.px < 0 || r.px > xmax || r.py < 0 || r.py > ymax)
  )
    throw new RangeError('Points must be inside labelled axes');
  const positions = new Map<
    string,
    { x: number; y: number; ids: string[]; group?: string }
  >();
  m.complete.forEach((r) => {
    const k = `${r.px},${r.py}`,
      old = positions.get(k);
    if (old) old.ids.push(r.id);
    else positions.set(k, { x: r.px, y: r.py, ids: [r.id], group: r.group });
  });
  return (
    <ResearchFrame
      mode={mode}
      caption={t(
        '每一点来自同一编号的一对观察；缺任一量不补零、不绘点。只画散点，不按记录次序连线；两轴独立单位，改变视窗不改数据。形状及编号与颜色共同区分组别。',
        'Each point pairs two observations from one record. Missing values are not zero or plotted. Points are not joined in record order. Axes have their own units; windows do not change data. Shape and identity accompany colour for groups.',
      )}
    >
      <svg
        viewBox="0 0 600 380"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Paired observations without connecting lines'
            : '保留配对身份且不连线的散点图'
        }
      >
        {Array.from({ length: 6 }, (_, i) => i * 2).map((v) => (
          <g key={v}>
            <path d={`M65 ${y(v)}H495M${x(v)} 50V310`} stroke="#ddd8e7" />
            <text x="53" y={y(v) + 5} textAnchor="end">
              {v}
            </text>
            <text x={x(v)} y="331" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        {wide && (
          <>
            <path d={`M${x(12)} 50V310`} stroke="#ddd8e7" />
            <text x={x(12)} y="331" textAnchor="middle">
              12
            </text>
          </>
        )}
        <path
          d="M65 40V310H510"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="510" y="360" textAnchor="end">
          {xLabel}
        </text>
        <text x="65" y="23">
          {yLabel}
        </text>
        {[...positions.values()].map((p, i) => {
          const active = selected !== undefined && p.ids.includes(selected),
            warm = p.group === 'warm';
          return (
            <g
              key={i}
              data-scatter-point={p.ids.join('/')}
              data-selected={active ? 'true' : 'false'}
            >
              {warm ? (
                <rect
                  x={x(p.x) - 5}
                  y={y(p.y) - 5}
                  width="10"
                  height="10"
                  fill="#a14532"
                />
              ) : (
                <circle cx={x(p.x)} cy={y(p.y)} r="5" fill="#5954a3" />
              )}
              {active && (
                <circle
                  cx={x(p.x)}
                  cy={y(p.y)}
                  r="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              )}
              <text x={x(p.x) + 9} y={y(p.y) - 9} fontSize="12">
                {p.ids.join('/')}
              </text>
              <title>
                {p.ids.join('/')}: ({p.x}, {p.y})
              </title>
            </g>
          );
        })}
      </svg>
    </ResearchFrame>
  );
}
