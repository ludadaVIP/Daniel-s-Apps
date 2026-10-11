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
  momentumReading,
  momentumDefault,
  momentumDuration,
  momentumLimits,
  momentumNotes,
  momentumOptions,
  momentumTitles,
  momentumRecord,
  type MomentumKind,
  type MomentumReading,
} from './momentumModels';
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
function Arrow({ p, y, color }: { p: number; y: number; color: string }) {
  const end = 300 + p * 10,
    direction = Math.sign(p);
  return p === 0 ? (
    <circle cx="300" cy={y} r="4" fill={color} />
  ) : (
    <g fill="none" stroke={color} strokeWidth="4">
      <path d={`M300 ${y}H${end}`} />
      <path
        d={`M${end - direction * 9} ${y - 6}L${end} ${y}L${end - direction * 9} ${y + 6}`}
      />
    </g>
  );
}
function Scene({
  m,
  mode,
  kind,
}: {
  m: MomentumReading;
  mode: LanguageMode;
  kind: MomentumKind;
}) {
  const cart = (
    x: number,
    v: number,
    name: string,
    color: string,
    y: number,
  ) => (
    <g key={name}>
      <text x="25" y={y - 30}>
        {name} · v={nf(v)} m/s
      </text>
      <path d={`M45 ${y + 20}H565`} stroke="#78959a" />
      {kind === 'impulse' ? (
        <circle cx={45 + x * 20} cy={y} r="17" fill={color} />
      ) : (
        <rect
          x={45 + x * 20 - 23}
          y={y - 16}
          width="46"
          height="30"
          rx="6"
          fill={color}
        />
      )}
      {kind !== 'impulse' && kind !== 'restraints' && (
        <>
          <circle cx={45 + x * 20 - 14} cy={y + 16} r="5" fill="#f5ecd4" />
          <circle cx={45 + x * 20 + 14} cy={y + 16} r="5" fill="#f5ecd4" />
        </>
      )}
    </g>
  );
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={word(mode, [
        '同一坐标轴上的位置与速度',
        'Positions and velocities on one coordinate axis',
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#334a50" />
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="380" y="35">
        x / m →
      </text>
      {cart(m.xA, m.vA, 'A', '#efd28e', m.pair ? 100 : 150)}
      {m.pair && cart(m.xB, m.vB, 'B', '#b49dca', 200)}
      <path d="M45 280H525" stroke="#b7c8c2" />
      {[0, 12, 24].map((x) => (
        <g key={x}>
          <path d={`M${45 + x * 20} 275v10`} stroke="#b7c8c2" />
          <text x={35 + x * 20} y="312">
            {x}
          </text>
        </g>
      ))}
    </svg>
  );
}
function Ledger({ m, mode }: { m: MomentumReading; mode: LanguageMode }) {
  const rows = m.pair
    ? ([
        ['pA', m.pA],
        ['pB', m.pB],
        ['Σp', m.total],
      ] as const)
    : ([
        ['p初', m.initial],
        ['Δp', m.total - m.initial],
        ['p', m.total],
      ] as const);
  return (
    <svg
      viewBox="0 0 620 330"
      role="img"
      aria-label={word(mode, [
        '带符号的动量账；箭头不是力',
        'Signed momentum ledger; arrows are not force',
      ])}
    >
      <rect width="620" height="330" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        {word(mode, ['p / kg·m/s · 向右为正', 'p / kg·m/s · rightward +'])}
      </text>
      <path d="M300 60V305" stroke="#9bb1b4" strokeDasharray="4 6" />
      {rows.map(([label, p], i) => (
        <g key={i}>
          <text x="25" y={75 + i * 85}>
            {mode === 'en' && label === 'p初' ? 'p initial' : label}={nf(p)}
          </text>
          <Arrow
            p={p}
            y={95 + i * 85}
            color={i === 1 ? '#b49dca' : '#efd28e'}
          />
        </g>
      ))}
    </svg>
  );
}
function Energy({ m, mode }: { m: MomentumReading; mode: LanguageMode }) {
  const items: [Pair, number, string][] = [
    [['初始', 'Initial'], m.initialEnergy, '#b49dca'],
    [['当前', 'Now'], m.energy, '#efd28e'],
    [['最终', 'Final'], m.finalEnergy, '#9abcb0'],
  ];
  return (
    <svg
      viewBox="0 0 620 315"
      role="img"
      aria-label={word(mode, [
        '初始当前与最终总动能，共同量尺',
        'Initial, current and final total kinetic energy on a common scale',
      ])}
    >
      <rect width="620" height="315" rx="18" fill="#2d3c47" />
      <text x="25" y="35">
        K / J
      </text>
      <path d="M65 65V240H565" stroke="#b4c7c2" />
      {[0, 30, 60].map((n) => (
        <text key={n} x="15" y={248 - n * 2.8}>
          {n}
        </text>
      ))}
      {items.map(([label, n, color], i) => (
        <g key={i}>
          <rect
            x={105 + i * 170}
            y={240 - n * 2.8}
            width="75"
            height={n * 2.8}
            fill={color}
          />
          <text x={105 + i * 170} y={220 - n * 2.8}>
            {nf(n)}
          </text>
          <text x={105 + i * 170} y="283">
            {word(mode, label)}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ForceCurve({
  kind,
  index,
  value,
  m,
  mode,
}: {
  kind: MomentumKind;
  index: number;
  value: number;
  m: MomentumReading;
  mode: LanguageMode;
}) {
  const triangle = kind === 'impulse' && index !== 0,
    T = value,
    points = triangle
      ? [
          [0, 0],
          [T / 2, -m.peak],
          [T, 0],
          [1, 0],
        ]
      : [
          [0, m.average],
          [T, m.average],
          [T, 0],
          [1, 0],
        ];
  const px = (t: number) => 80 + t * 460,
    py = (f: number) => 60 - f * 3.6;
  const past = points.filter(([t]) => t! <= m.time);
  past.push([m.time, m.force]);
  const path = (a: number[][]) =>
    a.map(([t, f], i) => `${i ? 'L' : 'M'}${px(t!)} ${py(f!)}`).join('');
  return (
    <svg
      viewBox="0 0 620 320"
      role="img"
      aria-label={word(mode, [
        '净力时间图，着色面积是已发生的冲量',
        'Net force versus time; shaded elapsed area is delivered impulse',
      ])}
    >
      <rect width="620" height="320" rx="18" fill="#2d3c47" />
      <text x="100" y="35">
        Fnet / N
      </text>
      <path d="M80 60V245M80 60H540" stroke="#b5c8c2" />
      {[0, -25, -50].map((f) => (
        <text key={f} x="20" y={py(f) + 8}>
          {f}
        </text>
      ))}
      {[0, 0.5, 1].map((t) => (
        <text key={t} x={px(t) - 5} y="273">
          {t}
        </text>
      ))}
      <text x="465" y="308">
        t / s
      </text>
      <path
        d={`M80 60${path(past).replace(/^M/, 'L')}L${px(m.time)} 60Z`}
        fill="#efd28e"
        opacity=".2"
      />
      <path d={path(points)} stroke="#91abae" fill="none" strokeWidth="3" />
      <path d={path(past)} stroke="#efd28e" fill="none" strokeWidth="4" />
      <circle cx={px(m.time)} cy={py(m.force)} r="6" fill="#efd28e" />
      <text x="330" y="35">
        J={nf(m.impulse)} N·s
      </text>
    </svg>
  );
}
export function MomentumLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: MomentumKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    value = custom ?? momentumDefault(kind, index),
    canonical = custom === null,
    limits = momentumLimits[kind];
  const animation = useAnimation(2.4, () => {
    if (canonical) {
      gate.record(String(index));
      setRecords((old) => [...new Set([...old, index])].sort());
    }
  });
  const progress = probe ?? animation.time / 2.4,
    m = momentumReading(kind, index, value, progress),
    pair = m.pair;
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: { title: Pair; value: string }[] = pair
    ? [
        { title: ['A动量', 'A momentum'], value: `${nf(m.pA)} kg·m/s` },
        { title: ['B动量', 'B momentum'], value: `${nf(m.pB)} kg·m/s` },
        {
          title: ['系统总动量', 'System total momentum'],
          value: `${nf(m.total)} kg·m/s`,
        },
        {
          title: ['外冲量', 'External impulse'],
          value: `${nf(m.externalImpulse)} N·s`,
        },
      ]
    : kind === 'quantity'
      ? [
          { title: ['质量', 'Mass'], value: `${nf(m.mA)} kg` },
          { title: ['速度', 'Velocity'], value: `${nf(m.vA)} m/s` },
          { title: ['动量', 'Momentum'], value: `${nf(m.pA)} kg·m/s` },
          { title: ['动能', 'Kinetic energy'], value: `${nf(m.energy)} J` },
        ]
      : [
          {
            title: ['当前动量', 'Current momentum'],
            value: `${nf(m.pA)} kg·m/s`,
          },
          {
            title: ['已发生冲量', 'Delivered impulse'],
            value: `${nf(m.impulse)} N·s`,
          },
          {
            title: ['全过程平均净力', 'Full-stop mean net force'],
            value: `${nf(m.average)} N`,
          },
          {
            title: ['全过程峰值大小', 'Full-stop peak magnitude'],
            value: `${nf(m.peak)} N`,
          },
        ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-momentum-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / MOMENTUM</span>
        <B
          zh={momentumTitles[kind][0]}
          en={momentumTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={momentumOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
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
      <p className="phy-model-note">
        <B zh={m.phase[0]} en={m.phase[1]} mode={mode} />
      </p>
      <div className="phy-momentum-scenes">
        <Scene m={m} mode={mode} kind={kind} />
        <Ledger m={m} mode={mode} />
      </div>
      {pair && (
        <p className="phy-model-note">
          <B
            zh="A、B分行显示以便阅读，但使用同一位置坐标；图形尺寸不表示真实接触形变。动量箭头不是受力图。"
            en="A and B appear on separate rows for readability but share one position coordinate; drawing sizes do not represent actual contact deformation. Momentum arrows are not force diagrams."
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
      {pair ? (
        <>
          <Energy m={m} mode={mode} />
          <p className="phy-model-note">
            <B
              zh={`初始/当前/最终K用同一0–60 J量尺。Σp−Σp初=${nf(m.total - m.initial)} kg·m/s；J外=${nf(m.externalImpulse)} N·s；内部JA=${nf(m.impulse)}、JB=${nf(-m.impulse)} N·s。`}
              en={`Initial/current/final K use one 0–60 J scale. Σp−Σpinitial=${nf(m.total - m.initial)} kg·m/s; Jexternal=${nf(m.externalImpulse)} N·s; internal JA=${nf(m.impulse)}, JB=${nf(-m.impulse)} N·s.`}
              mode={mode}
            />
          </p>
        </>
      ) : kind !== 'quantity' ? (
        <>
          <ForceCurve
            kind={kind}
            index={index}
            value={value}
            m={m}
            mode={mode}
          />
          <p className="phy-model-note">
            <B
              zh={`当前净力=${nf(m.force)} N；完整停止需${nf(m.stopDistance)} m。着色表示已发生的带符号面积；整条灰线是规定全过程。`}
              en={`Current net force=${nf(m.force)} N; the full stop requires ${nf(m.stopDistance)} m. Shading shows delivered signed area; the grey line is the prescribed full event.`}
              mode={mode}
            />
          </p>
        </>
      ) : null}
      <p className="phy-model-note">
        <B
          zh={momentumNotes[kind][0]}
          en={momentumNotes[kind][1]}
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <B
          zh={`${momentumDuration(kind)} s物理区间压缩为2.4秒播放；位置、动量、力和能量来自同一模型时刻。`}
          en={`The ${momentumDuration(kind)} s physical interval plays in 2.4 seconds; position, momentum, force and energy use the same model instant.`}
          mode={mode}
        />
      </p>
      <p className="phy-model-note">
        <a
          href={`https://openstax.org/books/university-physics-volume-1/pages/${kind === 'impulse' || kind === 'restraints' ? '9-2-impulse-and-collisions' : '9-3-conservation-of-linear-momentum'}`}
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
              {records.map((i) => {
                const row = momentumRecord(kind, i);
                return (
                  <tr key={i}>
                    <td>
                      <B
                        zh={momentumOptions[kind][i]![0]}
                        en={momentumOptions[kind][i]![1]}
                        mode={mode}
                      />
                    </td>
                    <td>
                      <span>{row[1]}</span>
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
