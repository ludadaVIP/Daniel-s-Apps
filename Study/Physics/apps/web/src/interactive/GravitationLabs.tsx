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
  gravitationDefault,
  gravitationLimits,
  gravitationNotes,
  gravitationOptions,
  gravitationReading,
  gravitationRecord,
  gravitationTitles,
  gravitationNumber as gn,
  type GravitationKind,
  type GravitationReading,
} from './gravitationModels';
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
function Arrow({
  x,
  y,
  dx,
  dy,
  color = '#efd28e',
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
}) {
  const length = Math.hypot(dx, dy);
  if (length < 1e-8) return <circle cx={x} cy={y} r="4" fill={color} />;
  const ux = dx / length,
    uy = dy / length,
    X = x + dx,
    Y = y + dy;
  return (
    <path
      d={`M${x} ${y}L${X} ${Y}M${X - 8 * ux + 5 * uy} ${Y - 8 * uy - 5 * ux}L${X} ${Y}L${X - 8 * ux - 5 * uy} ${Y - 8 * uy + 5 * ux}`}
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
  kind: GravitationKind;
  index: number;
  value: number;
  progress: number;
  m: GravitationReading;
  mode: LanguageMode;
}) {
  const escape = kind === 'escape',
    pair = kind === 'pair',
    cabin = kind === 'weightless' && index < 2,
    orbit = kind === 'orbit' || kind === 'satellite' || kind === 'weightless',
    cx = escape ? 70 : pair || orbit || kind === 'field' ? 310 : 140,
    cy = 220,
    scale = escape ? 17 : pair ? 120 : orbit ? 26 : 75;
  const px = (x: number) => cx + scale * x,
    py = (y: number) => cy - scale * y;
  const trail = (end: number) =>
    Array.from({ length: 65 }, (_, j) => {
      const q = gravitationReading(kind, index, value, (end * j) / 64);
      return `${j ? 'L' : 'M'}${px(q.x)} ${py(q.y)}`;
    }).join(' ');
  const fieldX = (-m.mu * m.x) / m.r ** 3,
    fieldY = (-m.mu * m.y) / m.r ** 3,
    fieldSize = Math.hypot(fieldX, fieldY);
  return (
    <svg
      viewBox="0 0 620 440"
      role="img"
      aria-label={word(mode, [
        '引力、取样位置或真实自由轨迹',
        'Gravity, sample positions or actual free trajectories',
      ])}
    >
      <rect width="620" height="440" rx="18" fill="#334a50" />
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="330" y="35">
        {cabin ? 'y' : 'r'}={nf(cabin ? m.y : m.r)} m
      </text>
      {pair && m.pair ? (
        <>
          <path
            d={`M${px(m.pair.xA)} 220H${px(m.pair.xB)}`}
            stroke="#819ba0"
            strokeDasharray="5 6"
          />
          <circle cx={310} cy={220} r="4" fill="#b49dca" />
          <text x="280" y="285">
            CM
          </text>
          <text x="430" y="335">
            +x →
          </text>
          <circle cx={px(m.pair.xA)} cy={220} r="12" fill="#efd28e" />
          <circle cx={px(m.pair.xB)} cy={220} r="12" fill="#b49dca" />
          <Arrow x={px(m.pair.xA)} y={220} dx={45} dy={0} />
          <Arrow x={px(m.pair.xB)} y={220} dx={-45} dy={0} color="#b49dca" />
          <text x={px(m.pair.xA) - 10} y="165">
            A
          </text>
          <text x={px(m.pair.xB) - 10} y="165">
            B
          </text>
        </>
      ) : cabin ? (
        <>
          {(() => {
            const y = 140 + 25 * (10 - m.y);
            return (
              <>
                <rect
                  x="245"
                  y={y - 65}
                  width="130"
                  height="140"
                  rx="14"
                  fill="none"
                  stroke="#92acae"
                  strokeWidth="3"
                />
                <rect
                  x="265"
                  y={y + 40}
                  width="90"
                  height="8"
                  rx="3"
                  fill="#b49dca"
                />
                <circle cx="310" cy={y - 25} r="12" fill="#f5ead0" />
                <path
                  d={`M310 ${y - 12}V${y + 20}M295 ${y + 38}L310 ${y + 20}L325 ${y + 38}`}
                  fill="none"
                  stroke="#f5ead0"
                  strokeWidth="4"
                />
                <Arrow x={365} y={y} dx={0} dy={45} />
                <Arrow
                  x={250}
                  y={y}
                  dx={0}
                  dy={m.normal ? -45 : 0}
                  color="#b49dca"
                />
              </>
            );
          })()}
        </>
      ) : (
        <>
          <circle cx={cx} cy={cy} r={scale} fill="#b49dca" />
          {kind === 'field' &&
            Array.from({ length: 8 }, (_, j) => {
              const a = (j * Math.PI) / 4;
              return (
                <Arrow
                  key={j}
                  x={cx + 150 * Math.cos(a)}
                  y={cy - 150 * Math.sin(a)}
                  dx={-30 * Math.cos(a)}
                  dy={30 * Math.sin(a)}
                  color="#78969c"
                />
              );
            })}
          <path d={trail(1)} fill="none" stroke="#78969c" strokeWidth="3" />
          <path
            d={trail(progress)}
            fill="none"
            stroke="#efd28e"
            strokeWidth="4"
          />
          {kind === 'satellite' && (
            <>
              <path
                d={`M${cx} ${cy}L${px(m.r * Math.cos(m.bodyAngle))} ${py(m.r * Math.sin(m.bodyAngle))}`}
                stroke="#b49dca"
                strokeDasharray="5 5"
              />
              <circle
                cx={px(Math.cos(m.bodyAngle))}
                cy={py(Math.sin(m.bodyAngle))}
                r="6"
                fill="#efd28e"
              />
            </>
          )}
          <Arrow
            x={px(m.x)}
            y={py(m.y)}
            dx={fieldSize ? (45 * fieldX) / fieldSize : 0}
            dy={fieldSize ? (-45 * fieldY) / fieldSize : 0}
            color="#b49dca"
          />
          {(kind === 'orbit' ||
            kind === 'satellite' ||
            kind === 'escape' ||
            kind === 'weightless') && (
            <Arrow
              x={px(m.x)}
              y={py(m.y)}
              dx={m.speed ? (40 * m.vx) / m.speed : 0}
              dy={m.speed ? (-40 * m.vy) / m.speed : 0}
            />
          )}
          <circle cx={px(m.x)} cy={py(m.y)} r="9" fill="#f5ead0" />
        </>
      )}
      <text x="25" y="410" style={{ fill: '#efd28e' }}>
        {word(
          mode,
          pair
            ? ['A受力方向', 'Force on A']
            : cabin
              ? ['引力方向', 'Gravity direction']
              : orbit || escape
                ? ['速度方向', 'Velocity direction']
                : ['装置取样位置', 'Apparatus samples'],
        )}
      </text>
      <text x="330" y="410" style={{ fill: '#b49dca' }}>
        {word(
          mode,
          pair
            ? ['B受力方向', 'Force on B']
            : cabin
              ? ['支持力方向', 'Support direction']
              : ['引力方向', 'Gravity direction'],
        )}
      </text>
    </svg>
  );
}
function Ledger({
  kind,
  m,
  mode,
}: {
  kind: GravitationKind;
  m: GravitationReading;
  mode: LanguageMode;
}) {
  const energy = kind === 'orbit' || kind === 'escape' || kind === 'satellite',
    pair = kind === 'pair';
  const actualNet = m.mass * Math.hypot(m.ax, m.ay),
    external =
      kind === 'weightless'
        ? m.normal
        : kind === 'inverse' || kind === 'g'
          ? m.force
          : kind === 'field'
            ? m.force - actualNet
            : 0;
  const rows: [Pair, number][] = energy
    ? [
        [['动能K', 'Kinetic K'], m.kinetic],
        [['势能U', 'Potential U'], m.potential],
        [['总能量E', 'Total E'], m.total],
      ]
    : pair
      ? [
          [['A受到的力', 'Force on A'], m.force * 1e6],
          [['B受到的力', 'Force on B'], -m.force * 1e6],
          [['两球合力', 'Net on pair'], 0],
        ]
      : [
          [['引力大小', 'Gravity magnitude'], m.force],
          [['向外支持大小', 'Outward support'], external],
          [['合力大小', 'Net magnitude'], actualNet],
        ];
  const scale = energy ? 20 : pair ? 2 : 10,
    origin = energy || pair ? 310 : 80;
  return (
    <svg
      viewBox="0 0 620 440"
      role="img"
      aria-label={word(
        mode,
        energy
          ? [
              '同一零点的动能、势能与总能量账',
              'Kinetic, potential and total energy at one zero',
            ]
          : [
              '引力与真实支持作用的力账',
              'Gravity and actual support-force ledger',
            ],
      )}
    >
      <rect width="620" height="440" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {energy ? 'E / J' : pair ? 'F / μN' : 'F / N'}
      </text>
      {rows.map(([label, v], i) => (
        <g key={i}>
          <text x="25" y={80 + 100 * i}>
            {word(mode, label)}={nf(v)}
          </text>
          <path
            d={`M70 ${120 + 100 * i}H550M${origin} ${95 + 100 * i}V${140 + 100 * i}`}
            stroke="#728a92"
          />
          <rect
            x={Math.min(origin, origin + v * scale)}
            y={100 + 100 * i}
            width={Math.abs(v) * scale}
            height="28"
            rx="4"
            fill={['#efd28e', '#b49dca', '#9abcb0'][i]}
          />
        </g>
      ))}
      <text x="25" y="410">
        {energy ? '1 J = 20 px' : pair ? '1 μN = 2 px' : '1 N = 10 px'}
      </text>
    </svg>
  );
}
function Plot({
  kind,
  index,
  value,
  m,
  mode,
}: {
  kind: GravitationKind;
  index: number;
  value: number;
  m: GravitationReading;
  mode: LanguageMode;
}) {
  let minX = 0,
    maxX = 4,
    maxY = 4,
    xUnit = 't / s',
    yUnit = 'F / N',
    name: Pair = ['引力大小', 'Gravity magnitude'],
    timePlot = true;
  let f: (p: number) => [number, number], current: [number, number];
  if (kind === 'pair') {
    maxX = 2000;
    maxY = 100;
    yUnit = 'F / μN';
    f = (p) => {
      const q = gravitationReading(kind, index, value, p);
      return [q.time, q.force * 1e6];
    };
    current = [m.time, m.force * 1e6];
  } else if (kind === 'inverse') {
    minX = 2;
    maxX = 4;
    xUnit = 'r / m';
    timePlot = false;
    f = (p) => [2 + 2 * p, m.mu / (2 + 2 * p) ** 2];
    current = [m.r, m.force];
  } else if (kind === 'field') {
    maxX = 3;
    maxY = 12;
    xUnit = 'm / kg';
    timePlot = false;
    f = (p) => [3 * p, 3 * p * m.g];
    current = [m.mass, m.force];
  } else if (kind === 'g') {
    maxX = 3;
    maxY = 16;
    xUnit = 'h / m';
    yUnit = 'g / N/kg';
    name = ['场强g', 'Field strength g'];
    timePlot = false;
    f = (p) => [3 * p, m.mu / (1 + 3 * p) ** 2];
    current = [m.r - 1, m.g];
  } else if (kind === 'orbit') {
    maxY = 8;
    yUnit = 'r / m';
    name = ['中心距', 'Centre distance'];
    f = (p) => {
      const q = gravitationReading(kind, index, value, p);
      return [q.time, q.r];
    };
    current = [m.time, m.r];
  } else if (kind === 'satellite') {
    minX = 1.5;
    maxX = 3;
    maxY = 12;
    xUnit = 'r / m';
    yUnit = 'T / s';
    name = ['卫星周期', 'Satellite period'];
    timePlot = false;
    f = (p) => {
      const r = 1.5 + 1.5 * p;
      return [r, 2 * Math.PI * Math.sqrt(r ** 3 / 8)];
    };
    current = [m.r, m.period];
  } else if (kind === 'escape') {
    maxX = 8;
    maxY = 30;
    yUnit = 'r / m';
    name = ['中心距', 'Centre distance'];
    f = (p) => {
      const q = gravitationReading(kind, index, value, p);
      return [q.time, q.r];
    };
    current = [m.time, m.r];
  } else {
    maxX = 2;
    maxY = 40;
    name = ['秤支持力N', 'Scale normal N'];
    f = (p) => [m.duration * p, m.normal];
    current = [m.time, m.normal];
  }
  const points = Array.from({ length: 81 }, (_, j) => f(j / 80)),
    px = (x: number) => 75 + (450 * (x - minX)) / (maxX - minX),
    py = (y: number) => 265 - (195 * y) / maxY,
    path = (points: [number, number][]) =>
      points.map(([x, y], j) => `${j ? 'L' : 'M'}${px(x)} ${py(y)}`).join(' ');
  return (
    <>
      <svg
        viewBox="0 0 620 330"
        role="img"
        aria-label={word(mode, [
          '引力关系或轨迹读数图',
          'Gravity relation or trajectory readings',
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
        <path d={path(points)} fill="none" stroke="#78939a" strokeWidth="2" />
        <path
          d={path(
            timePlot
              ? [...points.filter(([x]) => x < m.time), current]
              : points,
          )}
          fill="none"
          stroke="#efd28e"
          strokeWidth="3"
        />
        <circle cx={px(current[0])} cy={py(current[1])} r="6" fill="#efd28e" />
        {kind === 'satellite' && (
          <path
            d={`M75 ${py(2 * Math.PI)}H525`}
            stroke="#b49dca"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
        )}
      </svg>
      <div className="phy-circular-legend">
        <span>
          <i style={{ background: '#efd28e' }} />
          <B zh={name[0]} en={name[1]} mode={mode} />
        </span>
        {kind === 'satellite' && (
          <span>
            <i style={{ background: '#b49dca' }} />
            <B zh="中心体自转周期" en="Body rotation period" mode={mode} />
          </span>
        )}
      </div>
    </>
  );
}
export function GravitationLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: GravitationKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]),
    gate = useComparisons(['0', '1', '2'], onExplore),
    canonical = custom === null;
  const animation = useAnimation(2.4, () => {
      if (canonical) {
        gate.record(String(index));
        setRecords((old) => [...new Set([...old, index])].sort());
      }
    }),
    value = custom ?? gravitationDefault(kind, index),
    limits = gravitationLimits[kind],
    progress = probe ?? animation.time / 2.4,
    m = gravitationReading(kind, index, value, progress);
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: [Pair, string][] =
    kind === 'pair'
      ? [
          [['A引力大小', 'Gravity magnitude on A'], `${gn(m.force)} N`],
          [['B引力大小', 'Gravity magnitude on B'], `${gn(m.force)} N`],
          [['A的加速度', 'A acceleration'], `${gn(m.pair!.aA)} m/s²`],
          [['B的加速度', 'B acceleration'], `${gn(m.pair!.aB)} m/s²`],
        ]
      : kind === 'orbit'
        ? [
            [['中心距r', 'Centre distance r'], `${nf(m.r)} m`],
            [['速率', 'Speed'], `${nf(m.speed)} m/s`],
            [['近心点距离', 'Periapsis distance'], `${nf(m.ellipse!.peri)} m`],
            [['总能量E', 'Total E'], `${nf(m.total)} J`],
          ]
        : kind === 'satellite'
          ? [
              [['卫星周期', 'Satellite period'], `${nf(m.period)} s`],
              [['中心体周期', 'Body period'], `${nf(2 * Math.PI)} s`],
              [
                ['相对地面转角', 'Relative ground angle'],
                `${nf((m.relativeAngle * 180) / Math.PI)}°`,
              ],
              [['引力加速度', 'Gravity acceleration'], `${nf(m.g)} m/s²`],
            ]
          : kind === 'escape'
            ? [
                [['径向速度', 'Radial velocity'], `${nf(m.vx)} m/s`],
                [
                  ['发射处逃逸门槛', 'Launch escape threshold'],
                  `${nf(m.launch!.escapeSpeed)} m/s`,
                ],
                [['总能量E', 'Total E'], `${nf(m.total)} J`],
                [
                  ['远处趋近速率', 'Asymptotic speed'],
                  m.launch!.energy < -1e-10
                    ? word(mode, ['不适用：会回返', 'Not applicable: returns'])
                    : `${nf(m.launch!.asymptoticSpeed)} m/s`,
                ],
              ]
            : kind === 'weightless'
              ? [
                  [['乘客质量', 'Passenger mass'], `${nf(m.mass)} kg`],
                  [['引力大小', 'Gravity magnitude'], `${nf(m.force)} N`],
                  [['秤支持力N', 'Scale normal N'], `${nf(m.normal)} N`],
                  [
                    ['实际加速度大小', 'Actual acceleration'],
                    `${nf(Math.hypot(m.ax, m.ay))} m/s²`,
                  ],
                ]
              : [
                  [['中心距r', 'Centre distance r'], `${nf(m.r)} m`],
                  [['场强g', 'Field strength g'], `${nf(m.g)} N/kg`],
                  [['探测质量', 'Test mass'], `${nf(m.mass)} kg`],
                  [['引力大小', 'Gravity magnitude'], `${nf(m.force)} N`],
                ];
  const link =
    kind === 'pair' || kind === 'inverse'
      ? '13-1-newtons-law-of-universal-gravitation'
      : kind === 'field' || kind === 'g' || kind === 'weightless'
        ? '13-2-gravitation-near-earths-surface'
        : kind === 'escape'
          ? '13-3-gravitational-potential-energy-and-total-energy'
          : '13-4-satellite-orbits-and-energy';
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-gravitation-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / GRAVITATION</span>
        <B
          zh={gravitationTitles[kind][0]}
          en={gravitationTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={gravitationOptions[kind].map(([zh, en], id) => ({
          zh,
          en,
          id,
        }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          setIndex(i);
          setCustom(null);
          reset();
        }}
      />
      <label className="phy-electric-slider">
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
            setCustom(Number(e.target.value));
            reset();
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
        <Ledger kind={kind} m={m} mode={mode} />
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map(([title, v], i) => (
          <LabMetric key={i} mode={mode} title={title}>
            {v}
          </LabMetric>
        ))}
      </div>
      <Plot kind={kind} index={index} value={value} m={m} mode={mode} />
      <p className="phy-model-note">
        <B
          zh="场景箭头只比方向；力与能量账有共同量尺。灰色给模型窗口，彩色点是当前读数。取样装置的运动不代表自由落体。"
          en="Scene arrows compare direction; force/energy ledgers declare shared scales. Grey covers the model window; coloured dots show current readings. Apparatus sampling is not free fall."
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <B
          zh={`模型时长${nf(m.duration)} s，播放2.4秒。`}
          en={`Model duration ${nf(m.duration)} s; playback 2.4 seconds.`}
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
            zh={gravitationNotes[kind][0]}
            en={gravitationNotes[kind][1]}
            mode={mode}
          />
        </p>
        <p className="phy-model-note">
          <a
            href={`https://openstax.org/books/university-physics-volume-1/pages/${link}`}
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
      <label className="phy-electric-slider">
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
          onChange={(e) => setProbe(Number(e.target.value) / 100)}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          disabled={animation.running}
          onClick={() => {
            setProbe(null);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe motion and record" mode={mode} />
        </button>
        <button disabled={animation.running} onClick={reset}>
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；检查时刻与自由设置不代替完整观察。`}
          en={`${gate.count}/3 required comparisons complete; inspection and free settings do not replace full observation.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table">
          <table>
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
                    {gravitationOptions[kind][i]![0] ===
                    gravitationOptions[kind][i]![1] ? (
                      gravitationOptions[kind][i]![0]
                    ) : (
                      <B
                        zh={gravitationOptions[kind][i]![0]}
                        en={gravitationOptions[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  <td>{gravitationRecord(kind, i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
