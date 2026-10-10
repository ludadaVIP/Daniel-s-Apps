import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabOptions,
  LabMetric,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import {
  constantMotion,
  coordinate,
  kinematicsConfig,
  kinematicsDefault,
  kinematicsReading,
  kinematicsRecord,
  type KinematicsKind,
  type Pair,
} from './kinematicsModels';
const w = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]),
  f = (n: number) => String(Number(n.toFixed(4)));
export const kinematicsTitles: Record<KinematicsKind, Pair> = {
  position: [
    '同一轨道，三个坐标约定',
    'One track, three coordinate conventions',
  ],
  journey: ['平滑往返的两本行程账', 'Two ledgers for a smooth return trip'],
  velocity: ['一个时刻，速率与速度', 'One instant, speed and velocity'],
  average: ['改变区间，改变平均量', 'Change the interval, change the averages'],
  acceleration: ['速度箭头怎样改变', 'How the velocity arrow changes'],
  rate: [
    '同一速度变化，不同所需时间',
    'Same velocity change, different durations',
  ],
};
const options: Record<KinematicsKind, Pair[]> = {
  position: [
    ['原点0 · 向右为正', 'Origin 0 · right positive'],
    ['原点10 · 向右为正', 'Origin 10 · right positive'],
    ['原点10 · 向左为正', 'Origin 10 · left positive'],
  ],
  journey: [
    ['观察到2 s', 'Observe to 2 s'],
    ['观察到4 s', 'Observe to 4 s'],
    ['观察到8 s', 'Observe to 8 s'],
  ],
  velocity: [
    ['2 s · 去程', '2 s · outward'],
    ['4 s · 转向点', '4 s · turning point'],
    ['6 s · 回程', '6 s · return'],
  ],
  average: [
    ['0→4 s', '0→4 s'],
    ['4→8 s', '4→8 s'],
    ['0→8 s', '0→8 s'],
  ],
  acceleration: [
    ['向右越来越快', 'Rightward, speeding up'],
    ['向右越来越慢', 'Rightward, slowing down'],
    ['向左越来越快', 'Leftward, speeding up'],
  ],
  rate: [
    ['2→6 m/s · 2 s', '2→6 m/s · 2 s'],
    ['2→6 m/s · 4 s', '2→6 m/s · 4 s'],
    ['6→2 m/s · 2 s', '6→2 m/s · 2 s'],
  ],
};
const notes: Record<KinematicsKind, Pair> = {
  position: [
    '世界轨道上的小车从3 m向右匀速2 m/s，观察6 s。原点是轨道上的固定点，不随车移动；换正方向会改变坐标与速度的符号。',
    'In world track coordinates, the cart starts at 3 m and moves right at 2 m/s for 6 s. Each origin is fixed on the track, not moving with the cart; changing positive direction changes coordinate and velocity signs.',
  ],
  journey: [
    '直线教学运动x=3+4t−½t²（SI），0–8 s，v=4−t、a=−1 m/s²；4 s平滑转向。图线和轨道共用模型，路程累计|v|，不把每段位移当正数相加。',
    'Teaching straight-line motion x=3+4t−½t² (SI) over 0–8 s, with v=4−t and a=−1 m/s²; the turn at 4 s is smooth. Graph and track share one model; distance accumulates |v|, while displacement remains signed.',
  ],
  velocity: [
    '同一平滑往返模型x=3+4t−½t²，向右为正。v=4−t，速率=|v|；4 s仅在一个瞬间速度为零，不是停留一段时间。小车旁箭头只标方向，非按大小比例。',
    'Same smooth return model x=3+4t−½t², right positive. v=4−t and speed=|v|; zero velocity at 4 s is one instant, not a waiting interval. The cart arrow indicates direction only, not magnitude.',
  ],
  average: [
    '同一0–8 s往返模型；金色段只累计选定区间。从区间起点的同一时刻开始时Δt=0，平均量暂不定义，不填0。完整区间平均值不能当作每一时刻的速度。',
    'Same 0–8 s return model; the gold section accumulates only the selected interval. At its exact start Δt=0, averages are undefined, not zero. An interval average is not the velocity at every instant.',
  ],
  acceleration: [
    '给定匀加速度模型，观察6 s；三种规定情况u=+1/+4/−1 m/s，a=+0.5/−0.5/−0.5 m/s²。自由改变a可出现平滑转向。运动学描述变化，尚不从这些数值推算受力。',
    'Prescribed constant-acceleration models for 6 s: initial velocities +1/+4/−1 m/s with a=+0.5/−0.5/−0.5 m/s². Free a can produce a smooth turn. Kinematics describes change; these values do not yet determine forces.',
  ],
  rate: [
    '从位置3 m开始，给定初末速度和时间，以恒定a=(v−u)/Δt连接两端。改变时间保留同一初末速度，不保留同一位移；该结果是区间平均加速度，因模型恒定而也等于瞬时加速度。',
    'Start at position 3 m with prescribed initial/final velocities and duration, joined by constant a=(v−u)/Δt. Changing duration retains endpoint velocities, not displacement. This is interval mean acceleration, also instantaneous here because the model keeps it constant.',
  ],
};
const sliderName = (kind: KinematicsKind): Pair =>
  kind === 'position'
    ? ['自由坐标原点（世界轨道m）', 'Free coordinate origin (world-track m)']
    : kind === 'acceleration'
      ? ['自由加速度', 'Free acceleration']
      : ['自由区间终点', 'Free interval endpoint'];
function Scene({
  kind,
  index,
  value,
  progress,
  mode,
}: {
  kind: KinematicsKind;
  index: number;
  value: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = kinematicsReading(kind, index, value, progress),
    c = kinematicsConfig(kind, index, value),
    isPosition = kind === 'position',
    positionPlot = isPosition || kind === 'journey' || kind === 'average',
    groundMin = isPosition ? -4 : 0,
    ground = (x: number) =>
      55 + ((x - groundMin) / (c.trackMax - groundMin)) * 510,
    maxT = isPosition || kind === 'acceleration' || kind === 'rate' ? 6 : 8,
    minY = isPosition ? -20 : positionPlot ? 0 : -8,
    maxY = isPosition ? 20 : positionPlot ? 14 : 8,
    px = (t: number) => 75 + (t / maxT) * 480,
    py = (v: number) => 455 - ((v - minY) / (maxY - minY)) * 145,
    quantity = (t: number) => {
      const q = constantMotion(c.x0, c.u, c.a, t);
      return positionPlot
        ? coordinate(q.position, c.origin, c.positive)
        : c.positive * q.velocity;
    },
    plotEnd = kind === 'rate' ? c.end : maxT,
    path = (start: number, end: number) =>
      Array.from({ length: 81 }, (_, j) => {
        const t = start + ((end - start) * j) / 80;
        return `${j ? 'L' : 'M'}${px(t)} ${py(quantity(t))}`;
      }).join(' '),
    ticks = isPosition
      ? [-4, 0, 4, 8, 12, 18]
      : Array.from(
          {
            length:
              Math.floor(
                c.trackMax /
                  (c.trackMax === 14 ? 2 : c.trackMax === 30 ? 5 : 10),
              ) + 1,
          },
          (_, i) => i * (c.trackMax === 14 ? 2 : c.trackMax === 30 ? 5 : 10),
        ),
    cart = ground(m.last.position),
    initial = ground(m.first.position),
    velocitySign = m.last.velocity === 0 ? 0 : m.last.velocity > 0 ? 1 : -1;
  return (
    <svg
      viewBox="0 0 620 500"
      role="img"
      aria-label={w(mode, kinematicsTitles[kind])}
    >
      <rect width="620" height="500" rx="18" fill="#283d48" />
      <g fill="#eeece0" fontSize="17">
        <text x="310" y="26" textAnchor="middle" style={{ fontSize: 22 }}>
          {w(mode, [
            '一条轨道，一份共同的运动模型',
            'One track, one shared motion model',
          ])}
        </text>
        <text x="32" y="62">
          {w(mode, ['固定世界轨道 / m', 'Fixed world track / m'])}
        </text>
        <text x="588" y="62" textAnchor="end">
          t = {f(m.time)} s
        </text>
        <path d="M55 114H565" stroke="#93c5cf" strokeWidth="2" />
        {ticks.map((x) => (
          <g key={x}>
            <path d={`M${ground(x)} 110v9`} stroke="#93c5cf" />
            <text x={ground(x)} y="143" textAnchor="middle">
              {x}
            </text>
          </g>
        ))}
        <path d={`M${initial} 88v20`} stroke="#eeece0" strokeDasharray="3 3" />
        <circle cx={initial} cy="93" r="6" fill="none" stroke="#eeece0" />
        <path d={`M${initial} 153H${cart}`} stroke="#e3c68d" strokeWidth="3" />
        {isPosition && (
          <g>
            <path
              d={`M${ground(c.origin)} 83v37`}
              stroke="#ce9292"
              strokeWidth="2"
            />
            <text
              x={ground(c.origin)}
              y="184"
              textAnchor="middle"
              fill="#ce9292"
            >
              O
            </text>
            <text x="32" y="226">
              {w(
                mode,
                c.positive === 1
                  ? ['坐标正方向 →', 'Coordinate positive →']
                  : ['坐标正方向 ←', 'Coordinate positive ←'],
              )}
            </text>
          </g>
        )}
        <g transform={`translate(${cart},90)`}>
          <rect x="-15" y="-12" width="30" height="18" rx="5" fill="#e3c68d" />
          <circle cx="-9" cy="11" r="5" fill="#e3c68d" />
          <circle cx="9" cy="11" r="5" fill="#e3c68d" />
          {velocitySign !== 0 && (
            <path
              d={`M${velocitySign * 20} -4h${velocitySign * 17}l${-velocitySign * 6} -5m${velocitySign * 6} 5l${-velocitySign * 6} 5`}
              fill="none"
              stroke="#e3c68d"
              strokeWidth="2"
            />
          )}
        </g>
        {!isPosition && (
          <text x="32" y="226">
            v = {f(m.velocity)} m/s · a = {f(m.acceleration)} m/s²
          </text>
        )}
        <text x="32" y="268">
          {positionPlot ? 'x / m' : 'v / (m/s)'}
        </text>
        {[minY, (minY + maxY) / 2, maxY].map((y) => (
          <g key={y}>
            <path
              d={`M75 ${py(y)}H555`}
              stroke="#657881"
              strokeDasharray="3 4"
            />
            <text x="63" y={py(y) + 5} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        {[0, maxT / 2, maxT].map((t) => (
          <g key={t}>
            <path
              d={`M${px(t)} 310V460`}
              stroke="#657881"
              strokeDasharray="3 4"
            />
            <text x={px(t)} y="487" textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        <text x="395" y="487" textAnchor="middle">
          t / s
        </text>
        <path
          d={path(0, plotEnd)}
          stroke="#93c5cf"
          strokeWidth="2"
          fill="none"
          opacity=".6"
        />
        <path
          d={path(c.start, m.time)}
          stroke="#e3c68d"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={px(c.start)}
          cy={py(quantity(c.start))}
          r="5"
          fill="none"
          stroke="#e3c68d"
        />
        <path
          d={`M${px(m.time)} ${py(quantity(m.time))}V455`}
          stroke="#e3c68d"
          strokeDasharray="4 4"
        />
        <circle
          cx={px(m.time)}
          cy={py(quantity(m.time))}
          r="6"
          fill="#e3c68d"
        />
      </g>
    </svg>
  );
}
export function KinematicsLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: KinematicsKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]),
    value = custom ?? kinematicsDefault(kind, index),
    canonical = Math.abs(value - kinematicsDefault(kind, index)) < 1e-9,
    gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      if (canonical) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    }),
    p = probe ?? animation.time / 2.4,
    m = kinematicsReading(kind, index, value, p),
    reset = () => {
      animation.reset();
      setProbe(null);
    },
    name = sliderName(kind),
    min =
      kind === 'position'
        ? -4
        : kind === 'acceleration'
          ? -0.5
          : kind === 'rate'
            ? 1
            : kind === 'average'
              ? index === 1
                ? 4.5
                : 0.5
              : 0,
    max =
      kind === 'position'
        ? 14
        : kind === 'acceleration'
          ? 0.5
          : kind === 'rate'
            ? 6
            : 8,
    unit = kind === 'position' ? 'm' : kind === 'acceleration' ? 'm/s²' : 's',
    val = (n: number | null, unit: string) =>
      n === null
        ? w(mode, ['尚未定义（Δt=0）', 'Undefined yet (Δt=0)'])
        : `${f(n)} ${unit}`,
    metrics: { title: Pair; value: string }[] =
      kind === 'position'
        ? [
            {
              title: ['坐标位置', 'Coordinate position'],
              value: val(m.position, 'm'),
            },
            {
              title: ['坐标位移', 'Coordinate displacement'],
              value: val(m.displacement, 'm'),
            },
            {
              title: ['实际路程', 'Physical distance'],
              value: val(m.distance, 'm'),
            },
          ]
        : kind === 'journey'
          ? [
              { title: ['位置', 'Position'], value: val(m.position, 'm') },
              {
                title: ['位移', 'Displacement'],
                value: val(m.displacement, 'm'),
              },
              {
                title: ['累计路程', 'Accumulated distance'],
                value: val(m.distance, 'm'),
              },
            ]
          : kind === 'velocity'
            ? [
                {
                  title: ['当前速度', 'Current velocity'],
                  value: val(m.velocity, 'm/s'),
                },
                {
                  title: ['当前速率', 'Current speed'],
                  value: val(m.speed, 'm/s'),
                },
                {
                  title: ['当前方向', 'Current direction'],
                  value: w(
                    mode,
                    m.direction === null
                      ? [
                          '瞬时为零，无运动方向',
                          'Zero at this instant; no motion direction',
                        ]
                      : m.direction === 'positive'
                        ? ['向右', 'Rightward']
                        : ['向左', 'Leftward'],
                  ),
                },
              ]
            : kind === 'average'
              ? [
                  {
                    title: ['当前区间时间', 'Current interval time'],
                    value: val(m.elapsed, 's'),
                  },
                  {
                    title: [
                      '当前区间平均速度',
                      'Current interval mean velocity',
                    ],
                    value: val(m.averageVelocity, 'm/s'),
                  },
                  {
                    title: ['当前区间平均速率', 'Current interval mean speed'],
                    value: val(m.averageSpeed, 'm/s'),
                  },
                ]
              : [
                  {
                    title: ['当前速度变化', 'Current velocity change'],
                    value: val(m.changeVelocity, 'm/s'),
                  },
                  {
                    title: ['当前加速度', 'Current acceleration'],
                    value: val(m.acceleration, 'm/s²'),
                  },
                  {
                    title: ['当前速率', 'Current speed'],
                    value: val(m.speed, 'm/s'),
                  },
                ];
  const checks: Pair[] = [
    [
      `区间起点：t=${f(m.start)} s，x=${f(m.initial)} m；右箭头为轨道的物理向右。`,
      `Interval start: t=${f(m.start)} s, x=${f(m.initial)} m; a right arrow is physically right along the track.`,
    ],
    kind === 'average'
      ? [
          `Δx=${f(m.displacement)} m；路程=${f(m.distance)} m；Δt=${f(m.elapsed)} s。`,
          `Δx=${f(m.displacement)} m; distance=${f(m.distance)} m; Δt=${f(m.elapsed)} s.`,
        ]
      : kind === 'acceleration' || kind === 'rate'
        ? [
            `Δv=${f(m.changeVelocity)} m/s；观察区间Δt=${f(m.elapsed)} s；比较的是带方向的速度变化。`,
            `Δv=${f(m.changeVelocity)} m/s; observed Δt=${f(m.elapsed)} s; compare signed changes in velocity.`,
          ]
        : [
            `x=${f(m.position)} m；Δx=x−x起=${f(m.displacement)} m。`,
            `x=${f(m.position)} m; Δx=x−x_start=${f(m.displacement)} m.`,
          ],
    kind === 'position'
      ? [
          '换原点不改变实际运动；换正方向不改变速率。',
          'Changing origin preserves physical motion; reversing positive direction preserves speed.',
        ]
      : kind === 'average'
        ? [
            '平均速度用位移，平均速率用路程；都除以同一区间时间。',
            'Mean velocity uses displacement; mean speed uses distance; both use the same interval duration.',
          ]
        : kind === 'acceleration' || kind === 'rate'
          ? [
              '速率变化要同时看v与a；a的符号单独不能判断变快或变慢。',
              'To judge speed change, use both v and a; the sign of a alone cannot decide speeding up or slowing down.',
            ]
          : [
              '过转向点时速度连续经过零，路程仍继续累计。',
              'At the turn, velocity passes continuously through zero while distance continues accumulating.',
            ],
  ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-kinematics-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / FOLLOW THE MOTION</span>
        <B
          zh={kinematicsTitles[kind][0]}
          en={kinematicsTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          reset();
          setIndex(i);
          setCustom(null);
        }}
      />
      <label className="phy-algebra-free">
        <B zh={name[0]} en={name[1]} mode={mode} />
        <output>
          {f(value)} {unit}
        </output>
        <input
          type="range"
          min={min}
          max={max}
          step={kind === 'position' ? 1 : kind === 'acceleration' ? 0.1 : 0.5}
          value={value}
          disabled={animation.running}
          aria-label={w(mode, name)}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      <Scene kind={kind} index={index} value={value} progress={p} mode={mode} />
      <div className="phy-thermal-metrics">
        {metrics.map((m) => (
          <LabMetric key={m.title[1]} title={m.title} mode={mode}>
            {m.value}
          </LabMetric>
        ))}
      </div>
      <ol
        className="phy-algebra-steps"
        aria-label={w(mode, ['运动读数与检查', 'Motion readings and checks'])}
      >
        {checks.map((c, i) => (
          <li key={i} className={p >= (i + 1) / 3 ? 'inspected' : ''}>
            <B zh={c[0]} en={c[1]} mode={mode} />
          </li>
        ))}
      </ol>
      <p className="phy-model-note">
        <B
          zh={`${notes[kind][0]} 浅线预览完整模型，金线跟踪选窗；所选真实时间压缩为2.4秒播放。箭头是方向标记；没有加入未知阻力或从动画猜受力。`}
          en={`${notes[kind][1]} The faint line previews the model; gold tracks the selected window. Its physical duration compresses to 2.4 seconds. Arrows mark direction; no unknown drag or inferred forces are added.`}
          mode={mode}
        />
      </p>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{Math.round(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
          disabled={animation.running}
          aria-label={w(mode, ['检查进度', 'Inspection progress'])}
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
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整观察。`}
          en={`${gate.count}/3 required comparisons complete; seeking or free settings do not replace full observation.`}
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
              {records.map((i) => {
                const row = kinematicsRecord(kind, i);
                return (
                  <tr key={i}>
                    <td>
                      <B
                        zh={options[kind][i]![0]}
                        en={options[kind][i]![1]}
                        mode={mode}
                      />
                    </td>
                    <td>
                      <B zh={row[0]} en={row[1]} mode={mode} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
