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
import { nf } from './newtonModels';
import {
  dynamicsReading,
  dynamicsDefault,
  dynamicsDuration,
  dynamicsLimits,
  dynamicsOptions,
  dynamicsTitles,
  dynamicsNotes,
  dynamicsRecord,
  type DynamicsKind,
} from './dynamicsModels';
import type { Pair } from './kinematicsModels';
const w = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
function Arrow({
  x,
  y,
  dx,
  dy,
  color,
  dashed = false,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  dashed?: boolean;
}) {
  const length = Math.hypot(dx, dy);
  if (length < 0.1) return <circle cx={x} cy={y} r="4" fill={color} />;
  const ux = dx / length,
    uy = dy / length,
    ex = x + dx,
    ey = y + dy,
    h = Math.min(10, length / 2);
  return (
    <g stroke={color} strokeWidth="4" fill="none">
      <path
        d={`M${x} ${y}L${ex} ${ey}`}
        strokeDasharray={dashed ? '8 6' : undefined}
      />
      <path
        d={`M${ex - h * ux - (h * uy) / 2} ${ey - h * uy + (h * ux) / 2}L${ex} ${ey}L${ex - h * ux + (h * uy) / 2} ${ey - h * uy - (h * ux) / 2}`}
      />
    </g>
  );
}
function Forces({
  kind,
  index,
  value,
  p,
  mode,
}: {
  kind: DynamicsKind;
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = dynamicsReading(kind, index, value, p),
    vertical = ['drag', 'terminal', 'elevator'].includes(kind),
    scale = kind === 'rockets' ? 3 : kind === 'cars' ? 20 : 10;
  if (vertical) {
    const up = kind === 'elevator' ? m.positive : -m.negative,
      down = kind === 'elevator' ? -m.negative : m.positive,
      s = kind === 'elevator' ? 5 : 6;
    return (
      <svg
        viewBox="0 0 620 340"
        role="img"
        aria-label={w(mode, [
          '目标受到的两股竖直力',
          'Two vertical forces on the target',
        ])}
      >
        <rect width="620" height="340" rx="18" fill="#2d3c47" />
        <text x="25" y="35">
          {w(
            mode,
            kind === 'elevator'
              ? ['向上为正', 'Upward positive']
              : ['向下为正', 'Downward positive'],
          )}
        </text>
        <rect x="260" y="145" width="85" height="65" rx="12" fill="#a98fc0" />
        <text x="271" y="185">
          {nf(m.mass)} kg
        </text>
        <Arrow x={180} y={140} dx={0} dy={down * s} color="#efd28e" />
        <Arrow x={395} y={240} dx={0} dy={-up * s} color="#b49dca" />
        <text x="35" y="115">
          W={nf(down)} N
        </text>
        <text x="335" y="310">
          {kind === 'elevator' ? 'N' : 'D'}={nf(up)} N
        </text>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 620 340"
      role="img"
      aria-label={w(mode, [
        '水平力与单独计算的合力',
        'Horizontal forces and separately calculated net force',
      ])}
    >
      <rect width="620" height="340" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {w(mode, ['水平向右为正', 'Horizontal rightward +'])}
      </text>
      {[m.positive, m.negative, m.net].map((f, i) => (
        <g key={i}>
          <text x="25" y={75 + i * 90}>
            {
              [
                kind === 'rockets' ? 'T' : kind === 'cars' ? 'Froad' : 'P',
                kind === 'rockets' ? 'Other' : kind === 'friction' ? 'f' : 'R',
                'ΣF',
              ][i]
            }
            ={nf(f)} N
          </text>
          <Arrow
            x={300}
            y={100 + i * 90}
            dx={f * scale}
            dy={0}
            color={i === 1 ? '#b49dca' : '#efd28e'}
            dashed={i === 2}
          />
        </g>
      ))}
    </svg>
  );
}
function Scene({
  kind,
  index,
  value,
  p,
  mode,
}: {
  kind: DynamicsKind;
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = dynamicsReading(kind, index, value, p),
    fall = kind === 'drag' || kind === 'terminal',
    elevator = kind === 'elevator',
    vertical = fall || elevator;
  if (vertical) {
    const py = (x: number) => (elevator ? 245 - x * 9 : 65 + x * 6),
      cy = py(m.position);
    return (
      <svg
        viewBox="0 0 620 320"
        role="img"
        aria-label={w(mode, [
          '同一模型的竖直位置',
          'Vertical position from the same model',
        ])}
      >
        <rect width="620" height="320" rx="18" fill="#334a50" />
        <text x="25" y="35">
          t={nf(m.time)} s
        </text>
        <text x="355" y="35">
          {elevator ? 'y / m ↑' : 's / m ↓'}
        </text>
        <path d={elevator ? 'M470 65V245' : 'M470 65V245'} stroke="#b5c8c2" />
        {(elevator ? [0, 10, 20] : [0, 15, 30]).map((n) => (
          <g key={n}>
            <path d={`M465 ${py(n)}h12`} stroke="#b5c8c2" />
            <text x="490" y={py(n) + 8}>
              {n}
            </text>
          </g>
        ))}
        {elevator ? (
          <>
            <rect
              x="235"
              y={cy - 35}
              width="105"
              height="70"
              rx="7"
              fill="#a98fc0"
            />
            <circle cx="290" cy={cy - 15} r="7" fill="#f0d79c" />
            <path
              d={`M290 ${cy - 8}v22m-13 0h26`}
              stroke="#f0d79c"
              strokeWidth="5"
            />
            <path d={`M250 ${cy + 25}h75`} stroke="#fff0bc" strokeWidth="5" />
          </>
        ) : (
          <>
            <path d={`M295 65V${cy}`} stroke="#b7c7c4" strokeDasharray="6 6" />
            <circle cx="295" cy={cy} r="16" fill="#efd28e" />
          </>
        )}
        <text x="25" y="307">
          {elevator ? 'y' : 's'}={nf(m.position)} m
        </text>
        <text x="355" y="307">
          v={nf(m.velocity)} m/s
        </text>
      </svg>
    );
  }
  const x = 65 + m.position * 16.5;
  return (
    <svg
      viewBox="0 0 620 260"
      role="img"
      aria-label={w(mode, ['同步水平位置', 'Linked horizontal position'])}
    >
      <rect width="620" height="260" rx="18" fill="#334a50" />
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="425" y="35">
        x / m →
      </text>
      <path d="M65 160H560" stroke="#b5c8c2" strokeWidth="3" />
      {[0, 10, 20, 30].map((n) => (
        <g key={n}>
          <path d={`M${65 + n * 16.5} 155v12`} stroke="#b5c8c2" />
          <text x={65 + n * 16.5} y="201" textAnchor="middle">
            {n}
          </text>
        </g>
      ))}
      {kind === 'rockets' ? (
        <>
          <path d={`M${x} 123l20 -14 20 14-20 14z`} fill="#b49dca" />
          {m.net > 0 && (
            <path
              d={`M${x - 8} 113l-25 10 25 10`}
              stroke="#efd28e"
              strokeWidth="4"
              fill="none"
            />
          )}
        </>
      ) : (
        <>
          <rect
            x={x - 18}
            y="130"
            width="36"
            height="25"
            rx="5"
            fill="#efd28e"
          />
          {kind === 'cars' && (
            <>
              <circle cx={x - 10} cy="156" r="6" fill="#a98fc0" />
              <circle cx={x + 10} cy="156" r="6" fill="#a98fc0" />
            </>
          )}
        </>
      )}
      <text x="25" y="243">
        x={nf(m.position)} m
      </text>
      <text x="350" y="243">
        v={nf(m.velocity)} m/s
      </text>
    </svg>
  );
}
function Velocity({
  kind,
  index,
  value,
  p,
  mode,
}: {
  kind: DynamicsKind;
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const duration = dynamicsDuration(kind),
    m = dynamicsReading(kind, index, value, p),
    px = (t: number) => 85 + (t / duration) * 470,
    py = (v: number) => 235 - ((v + 10) / 35) * 160;
  const path = (until: number) =>
    Array.from({ length: 101 }, (_, i) => {
      const t = (until * i) / 100,
        v = dynamicsReading(kind, index, value, t).velocity;
      return `${i ? 'L' : 'M'}${px(t * duration)} ${py(v)}`;
    }).join('');
  return (
    <svg
      viewBox="0 0 620 315"
      role="img"
      aria-label={w(mode, ['同步速度时间图', 'Linked velocity–time graph'])}
    >
      <rect width="620" height="315" rx="18" fill="#283d48" />
      <text x="25" y="35">
        v / m/s
      </text>
      {[-10, 0, 25].map((n) => (
        <g key={n}>
          <path d={`M85 ${py(n)}H555`} stroke="#b3c4c5" opacity=".25" />
          <text x="65" y={py(n) + 8} textAnchor="end">
            {n}
          </text>
        </g>
      ))}
      {[0, duration / 2, duration].map((t) => (
        <g key={t}>
          <path d={`M${px(t)} 75V235`} stroke="#b3c4c5" opacity=".2" />
          <text x={px(t)} y="271" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <path d="M85 75V235H555" stroke="#b3c4c5" fill="none" />
      {m.terminal !== null && (
        <>
          <path
            d={`M85 ${py(m.terminal)}H555`}
            stroke="#b49dca"
            strokeDasharray="8 6"
            fill="none"
          />
          <text x="350" y="55">
            vt={nf(m.terminal)} m/s
          </text>
        </>
      )}
      <path
        d={path(1)}
        fill="none"
        stroke="#b3c4c5"
        opacity=".4"
        strokeWidth="3"
      />
      <path d={path(p)} fill="none" stroke="#f2ce83" strokeWidth="4" />
      <circle cx={px(m.time)} cy={py(m.velocity)} r="6" fill="#f2ce83" />
      <text x="438" y="306">
        t / s
      </text>
    </svg>
  );
}
const references = {
  drag: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/falling-object-with-air-resistance/',
  terminal:
    'https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/termv.html',
  rockets:
    'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/rocket-thrust-equation/',
};
export function DynamicsLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: DynamicsKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]),
    gate = useComparisons(['0', '1', '2'], onExplore);
  const value = custom ?? dynamicsDefault(kind, index),
    canonical = Math.abs(value - dynamicsDefault(kind, index)) < 1e-9;
  const animation = useAnimation(2.4, () => {
      if (canonical) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    }),
    p = probe ?? animation.time / 2.4,
    m = dynamicsReading(kind, index, value, p),
    limits = dynamicsLimits(kind);
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const phaseLabels: Pair[] = [
    ['起步时刻', 'Starting instant'],
    ['匀速中途', 'Steady middle'],
    ['刹车时刻', 'Braking instant'],
    ['片段结束', 'Segment end'],
  ];
  const metrics: { title: Pair; value: string }[] = [
    {
      title: ['沿正方向合力', 'Net force along positive axis'],
      value: `${nf(m.net)} N`,
    },
    {
      title: ['当前加速度', 'Current acceleration'],
      value: `${nf(m.acceleration)} m/s²`,
    },
    { title: ['当前速度', 'Current velocity'], value: `${nf(m.velocity)} m/s` },
    ...(kind === 'elevator'
      ? [
          {
            title: ['秤的支持力读数', 'Scale support reading'] as Pair,
            value: `${nf(m.positive)} N`,
          },
        ]
      : kind === 'rockets'
        ? [
            {
              title: ['机上质量 / 已排出', 'Onboard mass / expelled'] as Pair,
              value: `${nf(m.mass)} / ${nf(10 - m.mass)} kg`,
            },
          ]
        : []),
  ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-dynamics-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / EVERYDAY FORCES</span>
        <B
          zh={dynamicsTitles[kind][0]}
          en={dynamicsTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={dynamicsOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
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
          aria-label={w(mode, limits.label)}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      {kind === 'elevator' && (
        <LabOptions
          mode={mode}
          name={['检查关键时刻', 'Inspect key instants']}
          values={phaseLabels.map(([zh, en], id) => ({ id, zh, en }))}
          value={[0.125, 0.5, 0.875, 1].findIndex(
            (x) => Math.abs(x - p) < 1e-6,
          )}
          disabled={animation.running}
          set={(i) => {
            animation.reset();
            setProbe([0.125, 0.5, 0.875, 1][i]!);
          }}
        />
      )}
      <p className="phy-model-note">
        <B
          zh={`${m.state[0]} · ${m.extra}`}
          en={`${m.state[1]} · ${m.extra}`}
          mode={mode}
        />
      </p>
      <div className="phy-dynamics-scenes">
        <Forces kind={kind} index={index} value={value} p={p} mode={mode} />
        <Scene kind={kind} index={index} value={value} p={p} mode={mode} />
      </div>
      {!['drag', 'terminal', 'elevator'].includes(kind) && (
        <p className="phy-model-note">
          <B
            zh="虚线合力是两项相加的结果，不是第三股力。"
            en="The dashed net force is the sum of the two terms, not a third force."
            mode={mode}
          />
        </p>
      )}
      <div className="phy-thermal-metrics">
        {metrics.map((r) => (
          <LabMetric key={r.title[1]} title={r.title} mode={mode}>
            {r.value}
          </LabMetric>
        ))}
      </div>
      <Velocity kind={kind} index={index} value={value} p={p} mode={mode} />
      <p className="phy-model-note">
        <B
          zh={dynamicsNotes[kind][0]}
          en={dynamicsNotes[kind][1]}
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <B
          zh="物理观察区间压缩为2.4秒播放；轨道与金色速度线使用同一个模型和时刻。"
          en="The physical interval is played in 2.4 seconds; position and gold velocity trace use the same model and instant."
          mode={mode}
        />
      </p>
      {(kind === 'drag' || kind === 'terminal' || kind === 'rockets') && (
        <p className="phy-model-note">
          <a href={references[kind]} target="_blank" rel="noreferrer">
            <B
              zh="原理延伸 · NASA"
              en="Explore the principle · NASA"
              mode={mode}
            />
          </a>
        </p>
      )}
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{nf(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="2.5"
          value={p * 100}
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
              {records.map((i) => {
                const row = dynamicsRecord(kind, i);
                return (
                  <tr key={i}>
                    <td>
                      <B
                        zh={dynamicsOptions[kind][i]![0]}
                        en={dynamicsOptions[kind][i]![1]}
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
