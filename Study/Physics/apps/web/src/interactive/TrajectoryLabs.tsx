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
  trajectoryTitles,
  trajectoryOptions,
  trajectoryDefault,
  trajectoryLimits,
  trajectoryReading,
  trajectoryMotion,
  trajectoryRecord,
  uniformMotion,
  equationCase,
  equationChoices,
  checkEquation,
  fmt,
  type TrajectoryKind,
} from './trajectoryModels';
import type { Pair } from './kinematicsModels';
type Plot = 'x' | 'v' | 'a';
const w = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const notes: Record<TrajectoryKind, Pair> = {
  position: [
    '直轨运动x=3+4t−½t²，向右为正。蓝割线读选窗平均，金切线读当前瞬时；图线不是空间轨迹。',
    'Straight-track x=3+4t−½t², right positive. Blue secant reads interval mean, gold tangent the current instant; the graph is not a spatial path.',
  ],
  velocity: [
    '同一平滑往返v=4−t。金色正面积与紫色负面积给位移；各块大小相加给路程。',
    'Same smooth return v=4−t. Positive gold and negative purple area give displacement; magnitudes add to distance.',
  ],
  acceleration: [
    'u=1 m/s，0–2/2–4/4–6 s的a为+1/0/−1。2、4 s理想切换，位置速度连续；边界读数采用下一段，前段面积仍有效。',
    'u=1 m/s; a=+1/0/−1 over 0–2/2–4/4–6 s. Ideal switches at 2 and 4 s preserve position and velocity; boundary readings use the next stage, without changing preceding area.',
  ],
  uniform: [
    'u=1；a=1、a=0或a=t/2（SI）。等时Δv是检验，不是只看初末；a=0是恒定模型的匀速极限。',
    'u=1; a=1, a=0 or a=t/2 (SI). Equal-time Δv tests constancy beyond endpoints; a=0 is the constant-velocity limiting case.',
  ],
  equations: [
    '三个工作单全区间a恒定，向右为正；s是位移。公式选择要求直接使用给定量，计算核对与完整观察分别完成。',
    'All worksheets keep a constant throughout, right positive; s is displacement. Choose a direct equation from given quantities; calculation checking and full observation are separate requirements.',
  ],
  fall: [
    '从静止释放，向下为正，忽略空气，恒定g=10或1.6 m/s²。质量不改变模型轨迹。停在接触前；未模拟碰撞与反弹。',
    'Release from rest, downward positive, no air, constant g=10 or 1.6 m/s². Mass does not change this model trajectory. Stop just before contact; collisions and bounces are excluded.',
  ],
  projectile: [
    '20 m高，水平发射uᵧ=0，g=10，无空气；x向右、y向下为正。白色空心球直接释放，始终与彩色球同高。',
    '20 m height, horizontal launch uᵧ=0, g=10, no air; rightward x and downward y positive. The white outlined reference is directly released and always matches the coloured ball’s height.',
  ],
};
function Track({
  kind,
  index,
  value,
  progress,
  mode,
}: {
  kind: TrajectoryKind;
  index: number;
  value: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = trajectoryReading(kind, index, value, progress),
    c = m.config;
  if (kind === 'fall' || kind === 'projectile') {
    const project = kind === 'projectile',
      l = 90,
      top = 85,
      scale = 18,
      ground = top + 20 * scale,
      px = (x: number) => l + x * scale,
      py = (y: number) => top + y * scale;
    return (
      <svg
        viewBox="0 0 620 550"
        role="img"
        aria-label={w(mode, [
          project ? '水平与竖直共用时钟' : '落距与等时位置',
          'Shared clock and physical trajectory',
        ])}
      >
        <rect width="620" height="550" rx="18" fill="#283d48" />
        <g fill="#eeece0" stroke="none">
          <text x="25" y="35">
            {project ? 'x→ / y↓ (m)' : 'y↓ (m)'}
          </text>
          <text x="25" y="530">
            t = {fmt(m.time)} s
          </text>
        </g>
        <path
          d={`M${l} ${top}V${ground}H${px(20)}`}
          stroke="#8ba0a5"
          fill="none"
        />
        {[0, 5, 10, 15, 20].map((n) => (
          <g key={n}>
            <path
              d={`M${l - 5} ${py(n)}H${px(20)}`}
              stroke="#8ba0a5"
              opacity=".18"
            />
            <text x="65" y={py(n) + 8} textAnchor="end" fill="#eeece0">
              {n}
            </text>
            {project && (
              <text x={px(n)} y="485" textAnchor="middle" fill="#eeece0">
                {n}
              </text>
            )}
          </g>
        ))}
        <path
          d={`M${px(0)} ${py(c.height)}H${px(20)}`}
          stroke="#f2ce83"
          strokeWidth="3"
        />
        {Array.from({ length: 9 }, (_, j) => {
          const t = (c.end * j) / 8,
            y = 0.5 * c.g * t * t,
            x = c.horizontal * t;
          return (
            <circle
              key={j}
              cx={px(x)}
              cy={py(y)}
              r="4"
              fill="#a7c8c1"
              opacity={t <= m.time + 1e-8 ? 0.9 : 0.2}
            />
          );
        })}
        <path
          d={`M${l} ${top} ${Array.from({ length: 51 }, (_, j) => {
            const t = (m.time * j) / 50;
            return `L${px(c.horizontal * t)} ${py(0.5 * c.g * t * t)}`;
          }).join(' ')}`}
          fill="none"
          stroke="#f2ce83"
          strokeWidth="3"
        />
        {project && (
          <>
            <path
              d={`M${l} ${py(m.position)}H${px(m.x)}`}
              stroke="#c6dad2"
              strokeDasharray="6 6"
            />
            <circle
              cx={l}
              cy={py(m.position)}
              r="12"
              fill="#283d48"
              stroke="#fff"
              strokeWidth="3"
            />
          </>
        )}
        <circle cx={px(m.x)} cy={py(m.position)} r="8" fill="#f2ce83" />
        <text x="265" y="35" fill="#eeece0">
          {project ? `vₓ=${fmt(m.vx)} m/s` : `m=${c.mass} kg`}
        </text>
      </svg>
    );
  }
  const pos = m.position,
    gx = (x: number) => 55 + (x / 20) * 510,
    first = trajectoryMotion(kind, index, c.start);
  return (
    <svg
      viewBox="0 0 620 185"
      role="img"
      aria-label={w(mode, [
        '直轨小车与当前时刻',
        'Straight-track cart and current instant',
      ])}
    >
      <rect width="620" height="185" rx="18" fill="#283d48" />
      <text x="25" y="35" fill="#eeece0">
        t={fmt(m.time)} s
      </text>
      <text x="340" y="35" fill="#eeece0">
        x={fmt(pos)} m
      </text>
      <path d="M55 105H565" stroke="#afc2c3" strokeWidth="3" />
      {[0, 5, 10, 15, 20].map((n) => (
        <g key={n}>
          <path d={`M${gx(n)} 100v10`} stroke="#afc2c3" />
          <text x={gx(n)} y="153" fill="#eeece0" textAnchor="middle">
            {n}
          </text>
        </g>
      ))}
      <path
        d={`M${gx(first.position)} 105H${gx(pos)}`}
        stroke="#f2ce83"
        strokeWidth="4"
      />
      <circle
        cx={gx(first.position)}
        cy="88"
        r="8"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
      />
      <rect
        x={gx(pos) - 15}
        y="75"
        width="30"
        height="19"
        rx="5"
        fill="#f2ce83"
      />
      <circle cx={gx(pos) - 9} cy="99" r="5" fill="#f2ce83" />
      <circle cx={gx(pos) + 9} cy="99" r="5" fill="#f2ce83" />
      {Math.abs(m.velocity) > 1e-8 && (
        <path
          d={
            m.velocity > 0
              ? `M${gx(pos) - 10} 58h35l-7 -5m7 5l-7 5`
              : `M${gx(pos) + 10} 58h-35l7 -5m-7 5l7 5`
          }
          stroke="#a7c8c1"
          fill="none"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
function Graph({
  kind,
  index,
  value,
  progress,
  plot,
  mode,
}: {
  kind: TrajectoryKind;
  index: number;
  value: number;
  progress: number;
  plot: Plot;
  mode: LanguageMode;
}) {
  const m = trajectoryReading(kind, index, value, progress),
    c = m.config,
    fall = kind === 'fall' || kind === 'projectile',
    maxT = fall
      ? kind === 'fall'
        ? 5
        : 2
      : kind === 'acceleration'
        ? 6
        : kind === 'uniform' || kind === 'equations'
          ? 4
          : 8;
  const minY =
    plot === 'x'
      ? 0
      : plot === 'v'
        ? kind === 'position' || kind === 'velocity'
          ? -4
          : 0
        : kind === 'acceleration' || kind === 'position' || kind === 'velocity'
          ? -1
          : 0;
  const maxY =
    plot === 'x' ? 20 : plot === 'v' ? (fall ? 25 : 6) : fall ? 12 : 2;
  const px = (t: number) => 85 + (t / maxT) * 470,
    py = (n: number) => 250 - ((n - minY) / (maxY - minY)) * 170;
  const quantity = (t: number) => {
    if (fall) {
      const y = 0.5 * c.g * t * t;
      return plot === 'x' ? y : plot === 'v' ? c.g * t : c.g;
    }
    const q = trajectoryMotion(kind, index, t);
    return plot === 'x'
      ? q.position
      : plot === 'v'
        ? q.velocity
        : q.acceleration;
  };
  const line = (start: number, end: number) => {
    if (kind === 'acceleration' && plot === 'a') {
      let path = `M${px(start)} ${py(quantity(start))}`;
      for (const boundary of [2, 4]) {
        if (boundary > start && boundary <= end) {
          path += `L${px(boundary)} ${py(quantity(boundary - 1e-8))}L${px(boundary)} ${py(quantity(boundary))}`;
        }
      }
      return path + `L${px(end)} ${py(quantity(end))}`;
    }
    return Array.from({ length: 101 }, (_, j) => {
      const t = start + ((end - start) * j) / 100;
      return `${j ? 'L' : 'M'}${px(t)} ${py(quantity(t))}`;
    }).join(' ');
  };
  const end = fall ? c.end : maxT,
    now = quantity(m.time),
    unit = plot === 'x' ? 'm' : plot === 'v' ? 'm/s' : 'm/s²';
  // Split signed area at a velocity zero, so both ledgers have independently coloured regions.
  const sections: number[] = [
    c.start,
    ...(kind === 'velocity' && plot === 'v' && c.start < 4 && m.time > 4
      ? [4]
      : []),
    m.time,
  ];
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={w(mode, [
        `${fall && plot === 'x' ? '竖直位置' : plot}–t图`,
        `${fall && plot === 'x' ? 'Vertical position' : plot}–t graph`,
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#283d48" />
      <text x="25" y="35" fill="#eeece0">
        {fall && plot === 'x' ? 'y↓' : plot} / {unit}
      </text>
      {[minY, (minY + maxY) / 2, maxY].map((n) => (
        <g key={n}>
          <path d={`M85 ${py(n)}H555`} stroke="#8ba0a5" opacity=".25" />
          <text x="67" y={py(n) + 8} fill="#eeece0" textAnchor="end">
            {fmt(n)}
          </text>
        </g>
      ))}
      {[0, maxT / 2, maxT].map((t) => (
        <g key={t}>
          <path d={`M${px(t)} 80V250`} stroke="#8ba0a5" opacity=".2" />
          <text x={px(t)} y="286" fill="#eeece0" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <text x="438" y="320" fill="#eeece0">
        t / s
      </text>
      <path d={`M85 80V250H555M85 ${py(0)}H555`} fill="none" stroke="#afc2c3" />
      {((kind === 'velocity' && plot === 'v') ||
        (kind === 'acceleration' && plot === 'a')) &&
        sections.slice(1).map((end, j) => {
          const start = sections[j]!,
            mid = (start + end) / 2;
          return (
            <path
              key={j}
              d={`M${px(start)} ${py(0)} ${line(start, end).replace(/^M/, 'L')} L${px(end)} ${py(0)} Z`}
              fill={quantity(mid) < 0 ? '#bb9fcc' : '#f2ce83'}
              opacity=".35"
            />
          );
        })}
      {kind === 'acceleration' && plot === 'a' ? (
        <path
          d={`M${px(0)} ${py(1)}H${px(2)}V${py(0)}H${px(4)}V${py(-1)}H${px(6)}`}
          fill="none"
          stroke="#b6c4c7"
          strokeWidth="3"
        />
      ) : (
        <path
          d={line(0, end)}
          fill="none"
          stroke="#b6c4c7"
          opacity=".5"
          strokeWidth="3"
        />
      )}
      <path
        d={line(c.start, m.time)}
        fill="none"
        stroke="#f2ce83"
        strokeWidth="4"
      />
      <path
        d={`M${px(m.time)} 80V250`}
        stroke="#eeece0"
        opacity=".4"
        strokeDasharray="5 5"
      />
      {kind === 'position' && plot === 'x' && (
        <>
          <path
            d={`M${px(c.start)} ${py(quantity(c.start))}L${px(c.end)} ${py(quantity(c.end))}`}
            stroke="#83c2cf"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <path
            d={`M${px(Math.max(0, m.time - 0.5))} ${py(now + m.velocity * (Math.max(0, m.time - 0.5) - m.time))}L${px(Math.min(maxT, m.time + 0.5))} ${py(now + m.velocity * (Math.min(maxT, m.time + 0.5) - m.time))}`}
            stroke="#f2ce83"
            strokeWidth="5"
          />
        </>
      )}
      <circle cx={px(m.time)} cy={py(now)} r="6" fill="#f2ce83" />
    </svg>
  );
}
export function TrajectoryLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: TrajectoryKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]),
    [plot, setPlot] = useState<Plot>(
      kind === 'position' || kind === 'fall'
        ? 'x'
        : kind === 'acceleration'
          ? 'a'
          : 'v',
    );
  const [equation, setEquation] = useState(-1),
    [answer, setAnswer] = useState(''),
    [checked, setChecked] = useState<boolean | null>(null);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    value = custom ?? trajectoryDefault(kind, index),
    canonical = Math.abs(value - trajectoryDefault(kind, index)) < 1e-9,
    validEquation =
      kind !== 'equations' ||
      (checked === true && checkEquation(index, equation, answer));
  const animation = useAnimation(2.4, () => {
      if (canonical && validEquation) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    }),
    p = probe ?? animation.time / 2.4,
    m = trajectoryReading(kind, index, value, p),
    limit = trajectoryLimits(kind, index);
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: { title: Pair; value: string }[] =
    kind === 'position'
      ? [
          {
            title: ['当前位置', 'Current position'],
            value: `${fmt(m.position)} m`,
          },
          {
            title: ['选窗割线斜率', 'Selected-window secant slope'],
            value: `${fmt(trajectoryReading(kind, index, value).mean!)} m/s`,
          },
          {
            title: ['当前切线斜率', 'Current tangent slope'],
            value: `${fmt(m.velocity)} m/s`,
          },
        ]
      : kind === 'velocity'
        ? [
            {
              title: ['已累计带符号面积', 'Accumulated signed area'],
              value: `${fmt(m.displacement)} m`,
            },
            {
              title: ['已累计绝对面积', 'Accumulated absolute area'],
              value: `${fmt(m.distance)} m`,
            },
            {
              title: ['当前速度', 'Current velocity'],
              value: `${fmt(m.velocity)} m/s`,
            },
          ]
        : kind === 'acceleration'
          ? [
              {
                title: ['已累计a图面积', 'Accumulated a-graph area'],
                value: `${fmt(m.deltaV)} m/s`,
              },
              {
                title: ['当前速度', 'Current velocity'],
                value: `${fmt(m.velocity)} m/s`,
              },
              {
                title: ['当前位移', 'Current displacement'],
                value: `${fmt(m.displacement)} m`,
              },
            ]
          : kind === 'fall' || kind === 'projectile'
            ? [
                {
                  title: ['已用真实时间', 'Elapsed physical time'],
                  value: `${fmt(m.time)} s`,
                },
                {
                  title: [
                    kind === 'fall' ? '下落距离' : '水平位置',
                    kind === 'fall' ? 'Vertical drop' : 'Horizontal position',
                  ],
                  value: `${fmt(kind === 'fall' ? m.position : m.x)} m`,
                },
                {
                  title: [
                    '竖直速度 · 向下为正',
                    'Vertical velocity · down positive',
                  ],
                  value: `${fmt(m.vy)} m/s`,
                },
              ]
            : [
                {
                  title: ['当前速度', 'Current velocity'],
                  value: `${fmt(m.velocity)} m/s`,
                },
                {
                  title: ['当前加速度', 'Current acceleration'],
                  value: `${fmt(m.acceleration)} m/s²`,
                },
                {
                  title: ['当前位移', 'Current displacement'],
                  value: `${fmt(m.displacement)} m`,
                },
              ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-trajectory-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / READ THE MOTION</span>
        <B
          zh={trajectoryTitles[kind][0]}
          en={trajectoryTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={trajectoryOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          reset();
          setIndex(i);
          setCustom(null);
          setEquation(-1);
          setAnswer('');
          setChecked(null);
        }}
      />
      {kind === 'equations' ? (
        <fieldset className="phy-trajectory-work">
          <legend>
            <B zh="计算工作单" en="Calculation worksheet" mode={mode} />
          </legend>
          <p>
            <B
              zh={equationCase(index).known[0]}
              en={equationCase(index).known[1]}
              mode={mode}
            />
          </p>
          <LabOptions
            mode={mode}
            name={['直接公式', 'Direct equation']}
            values={equationChoices.map((s, id) => ({ id, zh: s, en: s }))}
            value={equation}
            disabled={animation.running}
            set={(n) => {
              reset();
              setEquation(n);
              setChecked(null);
            }}
          />
          <label>
            <B zh="你的计算结果" en="Your calculated result" mode={mode} />
            <span>{equationCase(index).unit}</span>
            <input
              inputMode="decimal"
              type="text"
              value={answer}
              disabled={animation.running}
              aria-label={w(mode, ['你的计算结果', 'Your calculated result'])}
              onChange={(e) => {
                reset();
                setAnswer(e.target.value);
                setChecked(null);
              }}
            />
          </label>
          <button
            className="phy-button secondary"
            disabled={animation.running}
            onClick={() => setChecked(checkEquation(index, equation, answer))}
          >
            <B zh="核对计算" en="Check calculation" mode={mode} />
          </button>
          {checked !== null && (
            <p role="status">
              <B
                zh={
                  checked
                    ? '计算与直接公式匹配。完整观察，核对图形面积与速度。'
                    : '再检查：直接公式应只用给定量，并匹配所求量；别漏初速度、½或负号。结果需要数字，单位在框旁。'
                }
                en={
                  checked
                    ? 'Calculation and direct equation match. Observe fully to check area and velocity.'
                    : 'Check: use a direct equation from the given quantities for the requested unknown; keep initial velocity, ½ and signs. Enter a number; the unit is beside the field.'
                }
                mode={mode}
              />
            </p>
          )}
        </fieldset>
      ) : (
        <label className="phy-algebra-free">
          <B zh={limit.label[0]} en={limit.label[1]} mode={mode} />
          <output>
            {fmt(value)} {limit.unit}
          </output>
          <input
            type="range"
            min={limit.min}
            max={limit.max}
            step={limit.step}
            value={value}
            disabled={animation.running}
            aria-label={w(mode, limit.label)}
            onChange={(e) => {
              reset();
              setCustom(Number(e.target.value));
            }}
          />
        </label>
      )}
      <Track kind={kind} index={index} value={value} progress={p} mode={mode} />
      <div className="phy-thermal-metrics">
        {metrics.map((r) => (
          <LabMetric key={r.title[1]} title={r.title} mode={mode}>
            {r.value}
          </LabMetric>
        ))}
      </div>
      {kind !== 'projectile' && (
        <>
          <LabOptions
            mode={mode}
            name={['同步图像', 'Linked graph']}
            values={[
              ['位置', 'Position'],
              ['速度', 'Velocity'],
              ['加速度', 'Acceleration'],
            ].map(([zh, en], id) => ({ id, zh: zh!, en: en! }))}
            value={['x', 'v', 'a'].indexOf(plot)}
            set={(i) => setPlot((['x', 'v', 'a'] as Plot[])[i]!)}
          />
          <Graph
            kind={kind}
            index={index}
            value={value}
            progress={p}
            plot={plot}
            mode={mode}
          />
        </>
      )}
      {kind === 'uniform' && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                zh="等时检查点（播放后显示）"
                en="Equal-time checkpoints (revealed by playback)"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>t / s</th>
                <th>v / m/s</th>
                <th>Δv / m/s</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((t) => (
                <tr key={t}>
                  <td>{t}</td>
                  <td>
                    {t <= m.time + 1e-8
                      ? fmt(uniformMotion(index, t).velocity)
                      : '—'}
                  </td>
                  <td>
                    {t > 0 && t <= m.time + 1e-8
                      ? fmt(
                          uniformMotion(index, t).velocity -
                            uniformMotion(index, t - 1).velocity,
                        )
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="phy-model-note">
        <B
          zh={`${notes[kind][0]} 物理时间压缩为2.4秒播放；浅线或浅点预览模型，金色标当前观察。${kind === 'projectile' ? '图中水平与竖直比例尺相同。' : '轨道箭头只标方向，不代表力或速度大小。'}`}
          en={`${notes[kind][1]} Physical time compresses to 2.4 seconds; faint lines or dots preview the model and gold marks current observation. ${kind === 'projectile' ? 'Horizontal and vertical spatial scales match.' : 'Track arrows indicate direction, not force or velocity magnitude.'}`}
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
          disabled={animation.running || !validEquation}
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
          zh={`已完成 ${gate.count}/3 个规定比较；拖动和自由设置不替代完整观察。${kind === 'equations' ? '先核对计算，才能播放记录。' : ''}`}
          en={`${gate.count}/3 required comparisons complete; seeking and free settings do not replace full observation.${kind === 'equations' ? ' Check calculation before recording playback.' : ''}`}
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
                const r = trajectoryRecord(kind, i);
                return (
                  <tr key={i}>
                    <td>
                      <B
                        zh={trajectoryOptions[kind][i]![0]}
                        en={trajectoryOptions[kind][i]![1]}
                        mode={mode}
                      />
                    </td>
                    <td>
                      <B zh={r[0]} en={r[1]} mode={mode} />
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
