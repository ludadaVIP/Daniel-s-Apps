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
import type { Pair } from './kinematicsModels';
import {
  mechanicalEnergyDefault,
  mechanicalEnergyLimits,
  mechanicalEnergyNotes,
  mechanicalEnergyOptions,
  mechanicalEnergyReading,
  mechanicalEnergyRecord,
  mechanicalEnergyRows,
  mechanicalEnergyTitles,
  type MechanicalEnergyKind,
  type MechanicalEnergyReading,
} from './mechanicalEnergyModels';
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
function Scene({
  m,
  kind,
  mode,
}: {
  m: MechanicalEnergyReading;
  kind: MechanicalEnergyKind;
  mode: LanguageMode;
}) {
  const inclined =
      kind === 'height' || kind === 'power' || kind === 'conservation',
    spring = kind === 'spring';
  const scale = spring ? 160 : kind === 'angle' ? 120 : inclined ? 90 : 65;
  const px = (x: number) => 70 + x * scale,
    py = (h: number) => (inclined ? 250 : 230) - h * (inclined ? scale : 70);
  const endX = inclined ? Math.sqrt(m.length ** 2 - m.rise ** 2) : 6.5;
  const cartX = px(m.x),
    cartY = py(m.height);
  const uphill = kind !== 'conservation';
  const springPath = Array.from(
    { length: 13 },
    (_, i) =>
      `${i === 0 ? 'M' : 'L'}${px(0.1) + ((cartX - 25 - px(0.1)) * i) / 12} ${i === 0 || i === 12 ? 230 : 230 + (i % 2 === 0 ? -9 : 9)}`,
  ).join(' ');
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={word(mode, [
        '位置、速度与真实模型时刻',
        'Position, velocity and physical model time',
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#334a50" />
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="330" y="35">
        s={nf(m.s)} m
      </text>
      <path
        d={
          inclined
            ? `M${px(0)} ${py(uphill ? 0 : m.rise)}L${px(endX)} ${py(uphill ? m.rise : 0)}`
            : `M45 250H550`
        }
        stroke="#bbcec3"
        strokeWidth="3"
      />
      {inclined && (
        <>
          <path
            d={`M${px(endX)} ${py(0)}V${py(m.rise)}`}
            stroke="#9db5b5"
            strokeDasharray="5 6"
          />
        </>
      )}
      {spring && (
        <>
          <path d={`M${px(0.1)} 200V255`} stroke="#b49dca" strokeWidth="5" />
          <path d={springPath} fill="none" stroke="#b49dca" strokeWidth="4" />
          <path
            d={`M${px(2)} 145V250`}
            stroke="#b4c6c0"
            strokeDasharray="5 6"
          />
          <text x="25" y="80">
            c−s={nf(m.compression - m.s)} m
          </text>
          <text x="330" y="80">
            F={nf(m.force)} N
          </text>
        </>
      )}
      <rect
        x={cartX - 23}
        y={cartY - 19}
        width="46"
        height="32"
        rx="6"
        fill="#efd28e"
      />
      <circle cx={cartX - 13} cy={cartY + 16} r="5" fill="#e9e8d6" />
      <circle cx={cartX + 13} cy={cartY + 16} r="5" fill="#e9e8d6" />
      {kind === 'angle' && (
        <>
          <path
            d={`M${cartX} ${cartY - 23}l${60 * Math.cos((m.angle * Math.PI) / 180)} ${-60 * Math.sin((m.angle * Math.PI) / 180)}`}
            stroke="#b49dca"
            strokeWidth="4"
          />
          <text x="25" y="80">
            θ={nf(m.angle)}° · F=4 N
          </text>
          <text x="330" y="80">
            F∥={nf(m.force)} N
          </text>
        </>
      )}
      {kind === 'braking' && (
        <text x="25" y="80">
          Fnet={nf(m.force)} N
        </text>
      )}
      <text x="25" y="302">
        v={nf(m.v)} m/s
      </text>
      <text x="330" y="302">
        {inclined ? `h=${nf(m.height)} m` : `${spring ? '→ s' : '→ x'} / m`}
      </text>
    </svg>
  );
}
function Ledger({
  m,
  kind,
  mode,
}: {
  m: MechanicalEnergyReading;
  kind: MechanicalEnergyKind;
  mode: LanguageMode;
}) {
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={word(mode, [
        '功与能量的带符号账本；统一焦耳量尺',
        'Signed work and energy ledger on a common joule scale',
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {word(mode, ['功 / 能量 · J', 'Work / energy · J'])}
      </text>
      <path d="M260 60V315" stroke="#adc6c3" strokeDasharray="4 6" />
      {mechanicalEnergyRows(kind, m).map(([label, n], i) => (
        <g key={i}>
          <text x="25" y={75 + i * 80}>
            {word(mode, label)} = {nf(n)}
          </text>
          <rect
            x={260 + Math.min(n, 0) * 4}
            y={91 + i * 80}
            width={Math.abs(n) * 4}
            height="23"
            rx="3"
            fill={['#b49dca', '#efd28e', '#9abcb0'][i]}
          />
          {n === 0 && (
            <circle cx="260" cy={102 + i * 80} r="4" fill="#efd28e" />
          )}
        </g>
      ))}
    </svg>
  );
}
function WorkCurve({
  m,
  kind,
  mode,
}: {
  m: MechanicalEnergyReading;
  kind: MechanicalEnergyKind;
  mode: LanguageMode;
}) {
  const config = {
    angle: [3, -4, 4],
    braking: [6.5, -8, 0],
    height: [4, 0, 20],
    spring: [1.5, 0, 60],
    conservation: [4, 0, 10],
    power: [2, 0, 12],
  }[kind]!;
  const [maxX, minY, maxY] = config as [number, number, number];
  const px = (x: number) => 75 + (440 * x) / maxX,
    py = (f: number) => 260 - (190 * (f - minY)) / (maxY - minY);
  const force = (s: number) =>
    kind === 'spring' ? m.stiffness * (m.compression - s) : m.forceInitial;
  const curve = `M${px(0)} ${py(m.forceInitial)}L${px(m.length)} ${py(m.forceFinal)}`;
  const area = `M${px(0)} ${py(0)}V${py(m.forceInitial)}L${px(m.s)} ${py(force(m.s))}V${py(0)}Z`;
  const areaWork = kind === 'conservation' ? m.netWork : m.work;
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={word(mode, [
        '沿位移的力与已做功面积',
        'Force along displacement and area of work delivered',
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {kind === 'braking' || kind === 'conservation' ? 'Fnet' : 'F∥'} / N
      </text>
      <text x="310" y="35">
        {word(mode, ['面积W', 'Area W'])}={nf(areaWork)} J
      </text>
      <path d={`M75 65V260H530M75 ${py(0)}H530`} fill="none" stroke="#a6bdbb" />
      {[minY, maxY].map((f) => (
        <text key={f} x="15" y={py(f) + 8}>
          {nf(f)}
        </text>
      ))}
      <text x="70" y="305">
        0
      </text>
      <text x="450" y="305">
        {nf(maxX)}
      </text>
      <text x="540" y="305">
        s / m
      </text>
      <path d={area} fill="#efd28e" opacity="0.35" />
      <path d={curve} fill="none" stroke="#a6bdbb" strokeWidth="3" />
      <path
        d={`M${px(0)} ${py(m.forceInitial)}L${px(m.s)} ${py(force(m.s))}`}
        fill="none"
        stroke="#efd28e"
        strokeWidth="4"
      />
      <circle cx={px(m.s)} cy={py(force(m.s))} r="6" fill="#efd28e" />
    </svg>
  );
}
export function MechanicalEnergyLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: MechanicalEnergyKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    canonical = custom === null,
    value = custom ?? mechanicalEnergyDefault(kind, index),
    limits = mechanicalEnergyLimits[kind];
  const animation = useAnimation(2.4, () => {
    if (canonical) {
      gate.record(String(index));
      setRecords((old) => [...new Set([...old, index])].sort());
    }
  });
  const progress = probe ?? animation.time / 2.4,
    m = mechanicalEnergyReading(kind, index, value, progress);
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: { title: Pair; value: string }[] =
    kind === 'power'
      ? [
          { title: ['输入功率', 'Input power'], value: `${nf(m.power)} W` },
          {
            title: ['有用功率', 'Useful power'],
            value: `${nf(m.usefulPower)} W`,
          },
          {
            title: ['任务效率', 'Task efficiency'],
            value: `${nf(m.efficiency * 100)}%`,
          },
          { title: ['输入功', 'Input work'], value: `${nf(m.input)} J` },
        ]
      : kind === 'conservation' || kind === 'spring'
        ? [
            {
              title: ['机械能 K+U', 'Mechanical K+U'],
              value: `${nf(m.kinetic + m.potential)} J`,
            },
            { title: ['热能', 'Thermal energy'], value: `${nf(m.thermal)} J` },
            {
              title: ['系统总能量', 'System total energy'],
              value: `${nf(m.total)} J`,
            },
            {
              title: ['合力的功', 'Net-force work'],
              value: `${nf(m.netWork)} J`,
            },
          ]
        : kind === 'height'
          ? [
              { title: ['拉力的功', 'Pull work'], value: `${nf(m.work)} J` },
              {
                title: ['重力的功', 'Gravity work'],
                value: `${nf(m.gravityWork)} J`,
              },
              {
                title: ['势能改变', 'Potential-energy change'],
                value: `${nf(m.potential - m.initialU)} J`,
              },
              {
                title: ['动能改变', 'Kinetic-energy change'],
                value: `${nf(m.kinetic - m.initialK)} J`,
              },
            ]
          : [
              {
                title: ['合力的功', 'Net-force work'],
                value: `${nf(m.netWork)} J`,
              },
              {
                title: ['动能改变', 'Kinetic-energy change'],
                value: `${nf(m.kinetic - m.initialK)} J`,
              },
              {
                title: ['当前动能', 'Current kinetic energy'],
                value: `${nf(m.kinetic)} J`,
              },
              {
                title: ['已经移动', 'Distance travelled'],
                value: `${nf(m.s)} m`,
              },
            ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-mechanical-energy-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / WORK & ENERGY</span>
        <B
          zh={mechanicalEnergyTitles[kind][0]}
          en={mechanicalEnergyTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={mechanicalEnergyOptions[kind].map(([zh, en], id) => ({
          id,
          zh,
          en,
        }))}
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
      <div className="phy-mechanical-energy-scenes">
        <Scene m={m} kind={kind} mode={mode} />
        <Ledger m={m} kind={kind} mode={mode} />
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map((r) => (
          <LabMetric key={r.title[1]} title={r.title} mode={mode}>
            {r.value}
          </LabMetric>
        ))}
      </div>
      <WorkCurve m={m} kind={kind} mode={mode} />
      <p className="phy-model-note">
        <B
          zh="金色面积是已做的带符号功；横轴是位移，灰线展示全过程。"
          en="Gold area is signed work delivered; the axis is displacement, and grey shows the full event."
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <B
          zh={`物理时长${nf(m.duration)} s，播放2.4秒；三幅图使用同一时刻。`}
          en={`Physical duration ${nf(m.duration)} s; playback 2.4 seconds. All three figures share one instant.`}
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
            zh={mechanicalEnergyNotes[kind][0]}
            en={mechanicalEnergyNotes[kind][1]}
            mode={mode}
          />
        </p>
        <p className="phy-model-note">
          <B
            zh="图形尺寸不表示实际形变；每个实验的坐标量尺固定。"
            en="Drawing sizes do not represent actual deformation; coordinate scales stay fixed within each station."
            mode={mode}
          />
        </p>
        {kind === 'braking' && (
          <p className="phy-model-note">
            <B
              zh="终点已经停止，当前净力为0；面积图保留停止前的恒定制动力，单个终点不改变面积。"
              en="The endpoint is stopped with net force zero. The area plot retains the constant pre-stop force; one endpoint does not change its area."
              mode={mode}
            />
          </p>
        )}
        <p className="phy-model-note">
          <a
            href={`https://openstax.org/books/university-physics-volume-1/pages/${kind === 'power' ? '7-4-power' : kind === 'conservation' || kind === 'spring' ? '8-3-conservation-of-energy' : kind === 'braking' ? '7-3-work-energy-theorem' : '7-1-work'}`}
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
                    {mechanicalEnergyOptions[kind][i]![0] ===
                    mechanicalEnergyOptions[kind][i]![1] ? (
                      mechanicalEnergyOptions[kind][i]![0]
                    ) : (
                      <B
                        zh={mechanicalEnergyOptions[kind][i]![0]}
                        en={mechanicalEnergyOptions[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  <td>{mechanicalEnergyRecord(kind, i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
