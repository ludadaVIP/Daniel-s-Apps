import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import { nf } from './newtonModels';
import type { Pair } from './kinematicsModels';
import {
  circularDefault,
  circularLimits,
  circularNotes,
  circularOptions,
  circularReading,
  circularRecord,
  circularTitles,
  loopEvent,
  type CircularKind,
  type CircularReading,
} from './circularModels';
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
function Arrow({
  x,
  y,
  dx,
  dy,
  color,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}) {
  const length = Math.hypot(dx, dy);
  if (length < 1e-8) return <circle cx={x} cy={y} r="4" fill={color} />;
  const ux = dx / length,
    uy = dy / length,
    endX = x + dx,
    endY = y + dy;
  return (
    <path
      d={`M${x} ${y}L${endX} ${endY}M${endX - 8 * ux + 5 * uy} ${endY - 8 * uy - 5 * ux}L${endX} ${endY}L${endX - 8 * ux - 5 * uy} ${endY - 8 * uy + 5 * ux}`}
      fill="none"
      stroke={color}
      strokeWidth="3"
    />
  );
}
function Scene({
  kind,
  index,
  value,
  progress,
  m,
  mode,
}: {
  kind: CircularKind;
  index: number;
  value: number;
  progress: number;
  m: CircularReading;
  mode: LanguageMode;
}) {
  const cx = kind === 'tangent' ? 410 : 310,
    cy = kind === 'turning' ? 250 : 220,
    scale =
      kind === 'loop'
        ? 105
        : kind === 'orbit'
          ? 32
          : kind === 'tangent'
            ? 42
            : kind === 'turning'
              ? 45
              : 50;
  const px = (x: number) => cx + x * scale,
    py = (y: number) => cy - y * scale;
  const trail = (end: number) =>
    Array.from({ length: 65 }, (_, i) => {
      const p = circularReading(kind, index, value, (end * i) / 64);
      return `${i ? 'L' : 'M'}${px(p.x)} ${py(p.y)}`;
    }).join(' ');
  const speed = Math.hypot(m.vx, m.vy),
    a = Math.hypot(m.ax, m.ay),
    alength = m.released ? 45 : Math.min(45, m.radius * scale * 0.7);
  return (
    <svg
      viewBox="0 0 620 440"
      role="img"
      aria-label={word(mode, [
        '同一时刻的位置、速度方向与加速度方向',
        'Position, velocity direction and acceleration direction at one instant',
      ])}
    >
      <rect width="620" height="440" rx="18" fill="#334a50" />
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="330" y="35">
        v={nf(m.speed)} m/s
      </text>
      <circle
        cx={cx}
        cy={cy}
        r={m.radius * scale}
        fill="none"
        stroke="#9bb4b7"
        strokeDasharray="5 6"
        strokeWidth="2"
      />
      {kind === 'orbit' ? (
        <circle cx={cx} cy={cy} r={scale} fill="#b49dca" />
      ) : (
        <circle cx={cx} cy={cy} r="4" fill="#b49dca" />
      )}
      {kind === 'force' && (
        <path
          d={`M${cx} ${cy}L${px(m.x)} ${py(m.y)}`}
          stroke="#c5c1ba"
          strokeWidth="2"
        />
      )}
      {kind === 'loop' && (
        <path d={`M45 ${py(-1)}H575`} stroke="#b3c2bd" strokeDasharray="4 6" />
      )}
      <path d={trail(1)} fill="none" stroke="#78969c" strokeWidth="3" />
      <path d={trail(progress)} fill="none" stroke="#efd28e" strokeWidth="4" />
      <Arrow
        x={px(m.x)}
        y={py(m.y)}
        dx={(45 * m.vx) / speed}
        dy={(-45 * m.vy) / speed}
        color="#efd28e"
      />
      <Arrow
        x={px(m.x)}
        y={py(m.y)}
        dx={a ? (alength * m.ax) / a : 0}
        dy={a ? (-alength * m.ay) / a : 0}
        color="#b49dca"
      />
      <circle cx={px(m.x)} cy={py(m.y)} r="10" fill="#f5ead0" />
      <text x="25" y="410" style={{ fill: '#efd28e' }}>
        {word(mode, ['v：速度方向', 'v direction'])}
      </text>
      <text x="330" y="410" style={{ fill: '#b49dca' }}>
        {word(mode, ['a：加速度方向', 'a direction'])}
      </text>
    </svg>
  );
}
function VectorBoard({
  m,
  kind,
  mode,
}: {
  m: CircularReading;
  kind: CircularKind;
  mode: LanguageMode;
}) {
  const loop = kind === 'loop',
    scale = loop ? 1.1 : 25;
  const rows = loop
    ? ([
        ['Fg', 0, -10, '#9abcb0'],
        ['N', m.normalX, m.normalY, '#b49dca'],
        ['ΣF', m.ax, m.ay, '#efd28e'],
      ] as const)
    : ([
        ['v₀', m.initialVx, m.initialVy, '#9abcb0'],
        ['v', m.vx, m.vy, '#efd28e'],
        ['Δv', m.vx - m.initialVx, m.vy - m.initialVy, '#b49dca'],
      ] as const);
  return (
    <svg
      viewBox="0 0 620 440"
      role="img"
      aria-label={word(
        mode,
        loop
          ? [
              '真实重力、支持力与合力向量',
              'Actual gravity, support and net-force vectors',
            ]
          : [
              '初始速度、当前速度与速度变化；共同分量尺',
              'Initial, current and changed velocity on a common component scale',
            ],
      )}
    >
      <rect width="620" height="440" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {loop ? 'Fx, Fy / N' : 'vx, vy / m/s'}
      </text>
      {rows.map(([label, x, y, color], i) => {
        const cx = 110 + 200 * i;
        return (
          <g key={label}>
            <text x={cx - 25} y="80">
              {label}
            </text>
            <path
              d={`M${cx - 80} 220H${cx + 80}M${cx} 140V300`}
              stroke="#728a92"
            />
            <Arrow
              x={cx}
              y={220}
              dx={x * scale}
              dy={-y * scale}
              color={color}
            />
            <text x={cx - 60} y="330">
              x={nf(x)}
            </text>
            <text x={cx - 60} y="370">
              y={nf(y)}
            </text>
          </g>
        );
      })}
      <text x="25" y="410">
        {loop ? '1 N = 1.1 px' : '1 m/s = 25 px'}
      </text>
    </svg>
  );
}
function ForceLedger({
  m,
  kind,
  mode,
}: {
  m: CircularReading;
  kind: CircularKind;
  mode: LanguageMode;
}) {
  const source: Pair =
    kind === 'force'
      ? ['绳拉力', 'Tension']
      : kind === 'orbit'
        ? ['引力', 'Gravity']
        : ['横向力', 'Lateral force'];
  const rows: [Pair, number][] = [
    [['所需合力', 'Required net'], m.demand],
    [source, m.force],
    [
      kind === 'turning'
        ? ['可用上限', 'Available limit']
        : ['实际合力', 'Actual net'],
      kind === 'turning' ? m.capacity : m.force,
    ],
  ];
  return (
    <svg
      viewBox="0 0 620 440"
      role="img"
      aria-label={word(mode, [
        '力的需求、真实来源与合力比较，不是额外相加',
        'Compare force requirement, actual source and result; do not add an extra force',
      ])}
    >
      <rect width="620" height="440" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        F / N
      </text>
      {rows.map(([label, n], i) => (
        <g key={i}>
          <text x="25" y={80 + i * 100}>
            {word(mode, label)}={nf(n)} N
          </text>
          <path d={`M80 ${120 + i * 100}H550`} stroke="#728a92" />
          <rect
            x="80"
            y={100 + i * 100}
            width={n * 36}
            height="28"
            rx="4"
            fill={['#b49dca', '#efd28e', '#9abcb0'][i]}
          />
        </g>
      ))}
      <text x="75" y="405">
        0
      </text>
      <text x="490" y="405">
        12.5 N
      </text>
    </svg>
  );
}
type PlotSeries = {
  name: Pair;
  points: [number, number][];
  color: string;
  current: [number, number];
};
function Plot({
  kind,
  index,
  value,
  m,
  mode,
}: {
  kind: CircularKind;
  index: number;
  value: number;
  m: CircularReading;
  mode: LanguageMode;
}) {
  let minX = 0,
    maxX = 7,
    maxY = 13,
    yUnit = 'm',
    xUnit = 't / s',
    timePlot = true;
  const sample = (f: (p: number) => [number, number]) =>
    Array.from({ length: 81 }, (_, i) => f(i / 80));
  let series: PlotSeries[] = [];
  if (kind === 'path')
    series = [
      {
        name: ['路程s', 'Distance s'],
        color: '#efd28e',
        points: sample((p) => {
          const r = circularReading(kind, index, value, p);
          return [r.time, r.distance];
        }),
        current: [m.time, m.distance],
      },
      {
        name: ['位移大小', 'Displacement magnitude'],
        color: '#b49dca',
        points: sample((p) => {
          const r = circularReading(kind, index, value, p);
          return [r.time, r.displacement];
        }),
        current: [m.time, m.displacement],
      },
    ];
  else if (kind === 'tangent') {
    maxX = 13;
    maxY = 1.2;
    yUnit = 'a / m/s²';
    const a = (value * value) / 2;
    series = [
      {
        name: ['加速度大小', 'Acceleration magnitude'],
        color: '#efd28e',
        points:
          index === 2
            ? [
                [0, a],
                [m.releaseTime, a],
                [m.releaseTime, 0],
                [m.duration, 0],
              ]
            : [
                [0, a],
                [m.duration, a],
              ],
        current: [m.time, m.ac],
      },
    ];
  } else if (kind === 'acceleration') {
    maxY = 9;
    yUnit = 'a / m/s²';
    series = [
      {
        name: ['瞬时大小', 'Instantaneous magnitude'],
        color: '#efd28e',
        points: [
          [0, m.ac],
          [m.duration, m.ac],
        ],
        current: [m.time, m.ac],
      },
      {
        name: ['区间平均大小', 'Interval-average magnitude'],
        color: '#b49dca',
        points: sample((p) => {
          const r = circularReading(kind, index, value, p);
          return [r.time, r.averageA];
        }),
        current: [m.time, m.averageA],
      },
    ];
  } else if (kind === 'force') {
    maxX = 3;
    maxY = 27;
    yUnit = 'F / N';
    xUnit = 'v / m/s';
    timePlot = false;
    series = [
      {
        name: ['所需合力', 'Required net force'],
        color: '#efd28e',
        points: sample((p) => [3 * p, (m.mass * (3 * p) ** 2) / m.radius]),
        current: [m.speed, m.demand],
      },
    ];
  } else if (kind === 'turning') {
    maxX = 3.5;
    maxY = 12.5;
    yUnit = 'F / N';
    xUnit = 'v / m/s';
    timePlot = false;
    series = [
      {
        name: ['计划弯道需求', 'Planned-bend demand'],
        color: '#b49dca',
        points: sample((p) => [3.5 * p, (3.5 * p) ** 2 / m.radius]),
        current: [m.speed, m.demand],
      },
      {
        name: ['实际横向力', 'Actual lateral force'],
        color: '#efd28e',
        points: sample((p) => [
          3.5 * p,
          Math.min(4, (3.5 * p) ** 2 / m.radius),
        ]),
        current: [m.speed, m.force],
      },
    ];
  } else if (kind === 'orbit') {
    minX = 2;
    maxX = 4;
    maxY = 4;
    yUnit = 'Fg / N';
    xUnit = 'r / m';
    timePlot = false;
    series = [
      {
        name: ['引力大小', 'Gravity magnitude'],
        color: '#efd28e',
        points: sample((p) => [2 + 2 * p, (8 * m.mass) / (2 + 2 * p) ** 2]),
        current: [m.radius, m.force],
      },
    ];
  } else {
    maxX = 2.5;
    maxY = 85;
    yUnit = 'N / N';
    const points = sample((p) => {
      const r = circularReading(kind, index, value, p);
      return [r.time, r.normal];
    });
    const event = loopEvent(value);
    if (event.release) {
      points.push([event.trackTime, 0]);
      points.sort((a, b) => a[0] - b[0]);
    }
    series = [
      {
        name: ['轨道支持力', 'Track normal force'],
        color: '#efd28e',
        points,
        current: [m.time, m.normal],
      },
    ];
  }
  const px = (x: number) => 75 + (450 * (x - minX)) / (maxX - minX),
    py = (y: number) => 265 - (195 * y) / maxY;
  const path = (points: [number, number][]) =>
    points.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x)} ${py(y)}`).join(' ');
  return (
    <>
      <svg
        viewBox="0 0 620 330"
        role="img"
        aria-label={word(mode, [
          '当前量与模型关系图；按轴标注读单位',
          'Current reading and model relationship; read units on axes',
        ])}
      >
        <rect width="620" height="330" rx="18" fill="#2d3c47" />
        <text x="25" y="35">
          {yUnit}
        </text>
        <text x="370" y="35">
          {xUnit}
        </text>
        <path d="M75 65V265H545" fill="none" stroke="#b4c7c2" />
        <text x="15" y="273">
          0
        </text>
        <text x="15" y="78">
          {nf(maxY)}
        </text>
        <text x="70" y="308">
          {nf(minX)}
        </text>
        <text x="480" y="308">
          {nf(maxX)}
        </text>
        {series.map((s, i) => (
          <g key={i}>
            <path
              d={path(s.points)}
              fill="none"
              stroke="#78939a"
              strokeWidth="2"
            />
            <path
              d={path(
                timePlot
                  ? [...s.points.filter(([x]) => x < m.time), s.current]
                  : s.points,
              )}
              fill="none"
              stroke={s.color}
              strokeWidth="3"
            />
            <circle
              cx={px(s.current[0])}
              cy={py(s.current[1])}
              r="6"
              fill={s.color}
            />
          </g>
        ))}
      </svg>
      <div className="phy-circular-legend">
        {series.map((s, i) => (
          <span key={i}>
            <i style={{ background: s.color }} />
            <B zh={s.name[0]} en={s.name[1]} mode={mode} />
          </span>
        ))}
      </div>
    </>
  );
}
export function CircularLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: CircularKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]);
  const canonical = custom === null,
    value = custom ?? circularDefault(kind, index),
    limits = circularLimits[kind],
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (canonical) {
      gate.record(String(index));
      setRecords((old) => [...new Set([...old, index])].sort());
    }
  });
  const progress = probe ?? animation.time / 2.4,
    m = circularReading(kind, index, value, progress);
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: { title: Pair; value: string }[] =
    kind === 'path'
      ? [
          {
            title: ['累计路程', 'Distance travelled'],
            value: `${nf(m.distance)} m`,
          },
          {
            title: ['位移大小', 'Displacement magnitude'],
            value: `${nf(m.displacement)} m`,
          },
          { title: ['周期T', 'Period T'], value: `${nf(m.period)} s` },
          { title: ['频率f', 'Frequency f'], value: `${nf(1 / m.period)} Hz` },
        ]
      : kind === 'loop'
        ? [
            {
              title: ['轨道支持力', 'Track normal force'],
              value: `${nf(m.normal)} N`,
            },
            { title: ['动能K', 'Kinetic K'], value: `${nf(m.kinetic)} J` },
            { title: ['势能U', 'Potential U'], value: `${nf(m.potential)} J` },
            {
              title: ['总机械能', 'Total mechanical energy'],
              value: `${nf(m.total)} J`,
            },
          ]
        : kind === 'turning'
          ? [
              {
                title: ['所需合力', 'Required net force'],
                value: `${nf(m.demand)} N`,
              },
              {
                title: ['实际横向力', 'Actual lateral force'],
                value: `${nf(m.force)} N`,
              },
              {
                title: ['可用上限', 'Available limit'],
                value: `${nf(m.capacity)} N`,
              },
              {
                title: ['实际曲率半径', 'Actual curvature radius'],
                value: `${nf(m.actualRadius)} m`,
              },
            ]
          : kind === 'orbit'
            ? [
                {
                  title: ['轨道速率', 'Orbital speed'],
                  value: `${nf(m.speed)} m/s`,
                },
                {
                  title: ['向心加速度', 'Centripetal acceleration'],
                  value: `${nf(m.ac)} m/s²`,
                },
                {
                  title: ['引力大小', 'Gravity magnitude'],
                  value: `${nf(m.force)} N`,
                },
                { title: ['周期T', 'Period T'], value: `${nf(m.period)} s` },
              ]
            : kind === 'force'
              ? [
                  { title: ['质量', 'Mass'], value: `${nf(m.mass)} kg` },
                  { title: ['半径', 'Radius'], value: `${nf(m.radius)} m` },
                  { title: ['绳拉力', 'Tension'], value: `${nf(m.force)} N` },
                  {
                    title: ['水平合力', 'Horizontal net force'],
                    value: `${nf(m.force)} N`,
                  },
                ]
              : [
                  { title: ['速率', 'Speed'], value: `${nf(m.speed)} m/s` },
                  {
                    title: ['瞬时加速度大小', 'Instantaneous acceleration'],
                    value: `${nf(Math.hypot(m.ax, m.ay))} m/s²`,
                  },
                  {
                    title: ['速度变化大小', 'Velocity-change magnitude'],
                    value: `${nf(m.deltaV)} m/s`,
                  },
                  {
                    title: [
                      '区间平均加速度大小',
                      'Interval-average acceleration',
                    ],
                    value: `${nf(m.averageA)} m/s²`,
                  },
                ];
  const vector =
    kind === 'path' ||
    kind === 'tangent' ||
    kind === 'acceleration' ||
    kind === 'loop';
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / CIRCULAR MOTION</span>
        <B
          zh={circularTitles[kind][0]}
          en={circularTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={circularOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          reset();
          setIndex(i);
          setCustom(null);
        }}
      />
      <label className="phy-algebra-free">
        <B zh={limits.label[0]} en={limits.label[1]} mode={mode} />
        <output>
          {nf(value)} {limits.unit}
        </output>
        <input
          type="range"
          min={limits.min}
          max={limits.max}
          step={limits.step}
          value={value}
          disabled={animation.running}
          aria-label={word(mode, limits.label)}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      <p className="phy-circular-phase">
        <B zh={m.phase[0]} en={m.phase[1]} mode={mode} />
      </p>
      <div className="phy-circular-scenes">
        <Scene
          kind={kind}
          index={index}
          value={value}
          progress={progress}
          m={m}
          mode={mode}
        />
        {vector ? (
          <VectorBoard m={m} kind={kind} mode={mode} />
        ) : (
          <ForceLedger m={m} kind={kind} mode={mode} />
        )}
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map((r) => (
          <LabMetric key={r.title[1]} title={r.title} mode={mode}>
            {r.value}
          </LabMetric>
        ))}
      </div>
      <Plot kind={kind} index={index} value={value} m={m} mode={mode} />
      <p className="phy-model-note">
        <B
          zh="场景箭头只比较方向；分量图与力账使用共同量尺比较大小。灰色展示完整模型关系，彩色点是当前读数。"
          en="Scene arrows compare direction; component diagrams and force ledgers use common scales for magnitude. Grey shows the full model relation; coloured dots are current readings."
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <B
          zh={`物理时长${nf(m.duration)} s，播放2.4秒；各图使用同一模型时刻。`}
          en={`Physical duration ${nf(m.duration)} s; playback 2.4 seconds. Figures share one model instant.`}
          mode={mode}
        />
      </p>
      <details className="phy-energy-details">
        <summary>
          <B
            zh="模型条件与原理来源"
            en="Model conditions and sources"
            mode={mode}
          />
        </summary>
        <p className="phy-model-note">
          <B
            zh={circularNotes[kind][0]}
            en={circularNotes[kind][1]}
            mode={mode}
          />
        </p>
        <p className="phy-model-note">
          <a
            href={`https://openstax.org/books/university-physics-volume-1/pages/${kind === 'orbit' ? '13-4-satellite-orbits-and-energy' : kind === 'force' || kind === 'turning' || kind === 'loop' ? '6-3-centripetal-force' : '4-4-uniform-and-nonuniform-circular-motion'}`}
            target="_blank"
            rel="noreferrer"
          >
            <B
              zh="原理延伸 · OpenStax"
              en="Explore the principle · OpenStax"
              mode={mode}
            />
          </a>
        </p>
      </details>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{nf(progress * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="2.5"
          value={progress * 100}
          disabled={animation.running}
          aria-label={word(mode, ['检查进度', 'Inspection progress'])}
          onChange={(e) => {
            animation.reset();
            setProbe(Number(e.target.value) / 100);
          }}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setProbe(null);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe motion and record" mode={mode} />
        </button>
        <button
          className="phy-button secondary"
          disabled={animation.running}
          onClick={reset}
        >
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；检查时刻和自由设置不代替完整观察。`}
          en={`${gate.count}/3 required comparisons complete; inspection and free settings do not replace full observation.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                zh="完整观察的模型记录"
                en="Fully observed model records"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="规定比较" en="Required comparison" mode={mode} />
                </th>
                <th>
                  <B zh="读数与检查" en="Readings and checks" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((i) => (
                <tr key={i}>
                  <td>
                    {circularOptions[kind][i]![0] ===
                    circularOptions[kind][i]![1] ? (
                      circularOptions[kind][i]![0]
                    ) : (
                      <B
                        zh={circularOptions[kind][i]![0]}
                        en={circularOptions[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  <td>{circularRecord(kind, i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
