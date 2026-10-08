import { EnergyBars as Bars } from './EnergyBars';
import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabOptions as Options,
  LabMetric as Metric,
  useComparisons,
  type LabProps as Props,
} from './LabControls';
import { useAnimation } from './useSimulation';
import {
  kineticEnergy,
  gravitationalEnergy,
  elasticEnergy,
  springRelease,
  lampLedger,
  trackLedger,
  trackRecovery,
} from './energyModels';

type Label = [string, string];
const gold = '#ccaa78',
  purple = '#a28abc',
  green = '#99b7ab';
const num = (value: number) => (Math.abs(value) < 1e-9 ? 0 : value).toFixed(2);
const j = (value: number) => num(value) + ' J';
function Shell({
  mode,
  title,
  note,
  children,
}: Props & { title: Label; note: Label; children: ReactNode }) {
  return (
    <div className="phy-lab phy-forces-lab phy-energy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">ENERGY / FOLLOW THE CHANGES</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学模型 · 数值用于比较，具体条件见下方。"
          en="Teaching model · Values illustrate comparisons; conditions below."
          mode={mode}
        />
      </p>
      {children}
      <details className="phy-energy-assumptions">
        <summary>
          <B
            zh="这份教学模型的条件"
            en="Conditions of this teaching model"
            mode={mode}
          />
        </summary>
        <p className="phy-model-note">
          <B zh={note[0]} en={note[1]} mode={mode} />
        </p>
      </details>
    </div>
  );
}
function Progress({
  mode,
  count,
  total,
  hint,
}: Props & { count: number; total: number; hint: Label }) {
  return (
    <p className="phy-force-record" role="status">
      <B
        zh={'已比较 ' + count + '/' + total + '：' + hint[0]}
        en={'Compared ' + count + '/' + total + ': ' + hint[1]}
        mode={mode}
      />
    </p>
  );
}
function Table({
  mode,
  columns,
  rows,
}: {
  mode: LanguageMode;
  columns: Label[];
  rows: { id: string; cells: ReactNode[] }[];
}) {
  if (!rows.length) return null;
  return (
    <div className="phy-data-table-wrap">
      <table className="phy-data-table">
        <caption>
          <B
            zh="保留教学对照，比较一次只改一个条件"
            en="Teaching comparisons: change one condition at a time"
            mode={mode}
          />
        </caption>
        <thead>
          <tr>
            {columns.map(([zh, en]) => (
              <th scope="col" key={en}>
                <B zh={zh} en={en} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) =>
                index === 0 ? (
                  <th scope="row" key={index}>
                    {cell}
                  </th>
                ) : (
                  <td key={index}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Probe({
  mode,
  phase,
  set,
  disabled,
}: {
  mode: LanguageMode;
  phase: number;
  set: (n: number) => void;
  disabled: boolean;
}) {
  return (
    <label className="phy-energy-probe">
      <span>
        <B
          zh="巡查进度（不是物理时间）"
          en="Inspection progress (not physical time)"
          mode={mode}
        />{' '}
        · {Math.round(phase * 100)}%
      </span>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(phase * 100)}
        disabled={disabled}
        aria-label={mode === 'en' ? 'Inspection progress' : '巡查进度'}
        onChange={(e) => set(Number(e.target.value) / 100)}
      />
    </label>
  );
}
export function EnergyLampLab({ mode, onExplore }: Props) {
  const [on, setOn] = useState(0),
    [phase, setPhase] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const cases = useComparisons(['0', '1'], onExplore);
  const a = useAnimation(2, () => {
    setPhase(1);
    setRecords((old) => [...new Set([...old, on])]);
    cases.record(String(on));
  });
  const p = a.running ? a.time / 2 : phase,
    state = lampLedger(Boolean(on), p),
    shining = Boolean(on) && p > 0 && p < 1;
  return (
    <Shell
      mode={mode}
      title={['不是制造，是转移', 'Transfers, not creation']}
      note={[
        '虚拟电池的一份12 J教学储备，不是实际电池完整容量；开灯后规定25%随光向外传递、75%增加灯与周围内能，忽略其他去向。账本是剩余储备+累计光传出+内能增加，不把光传出量当作灯内储能。两秒巡查不代表真实放电用时；关灯时无自放电。',
        'A virtual 12 J portion, not a real battery’s full capacity. The prescribed on-state carries 25% outward as light and puts 75% into internal-energy increase; other destinations are omitted. The ledger combines remaining energy, cumulative light out and internal-energy increase, not light stored in the lamp. The two-second scan is not a discharge-time prediction; self-discharge is omitted.',
      ]}
    >
      <Options
        mode={mode}
        name={['开关', 'Switch']}
        values={[
          { id: 0, zh: '关闭', en: 'Off' },
          { id: 1, zh: '打开', en: 'On' },
        ]}
        value={on}
        disabled={a.running}
        set={(n) => {
          setOn(n);
          setPhase(0);
          a.reset();
        }}
      />
      <svg
        className="phy-simulation phy-energy-svg"
        viewBox="0 0 600 205"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Battery portion, lamp and outward transfers'
            : '电池储备、灯与向外的能量传递'
        }
      >
        <path
          d="M95 88V45h325v16M95 137v34h325v-39"
          stroke="#b4a1c0"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="62"
          y="85"
          width="65"
          height="55"
          rx="8"
          fill="#e7d8be"
          stroke={gold}
          strokeWidth="2"
        />
        <rect
          x="69"
          y="92"
          width={(51 * state.remaining) / 12}
          height="41"
          rx="3"
          fill={gold}
        />
        <text x="94" y="113" fill="#725d4c" fontSize="20" textAnchor="middle">
          +
        </text>
        <text x="95" y="201" fill="#8c729d" fontSize="19" textAnchor="middle">
          {j(state.remaining)}
        </text>
        <path
          d={on ? 'M217 45h57' : 'M217 45l57-22'}
          stroke={gold}
          strokeWidth="4"
        />
        <circle
          cx="420"
          cy="95"
          r="38"
          fill={shining ? '#f1dba8' : '#e4dce9'}
          stroke="#b7a2c6"
          strokeWidth="2"
        />
        <path
          d="M403 128h34v16h-34m7-16V98l10 9 10-9v30"
          fill="none"
          stroke="#b7a2c6"
          strokeWidth="3"
        />
        {shining && (
          <>
            <path
              d="M465 71l27-14m-19 39h32m-39 25 26 16"
              stroke={gold}
              strokeWidth="3"
            />
            <path
              d="M410 178q-8 8 0 16m20-16q-8 8 0 16"
              fill="none"
              stroke={green}
              strokeWidth="3"
            />
          </>
        )}
        <text x="254" y="115" fill="#8c729d" textAnchor="middle" fontSize="19">
          12 J
        </text>
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={a.running}
          onClick={() => a.start()}
        >
          <B
            zh={a.running ? '正在观察…' : '完整观察这次开关'}
            en={a.running ? 'Observing…' : 'Observe this switch state'}
            mode={mode}
          />
        </button>
      </div>
      <Probe mode={mode} phase={p} disabled={a.running} set={setPhase} />
      <Bars
        mode={mode}
        scale={12}
        rows={[
          {
            label: ['电池剩余储备', 'Battery store remaining'],
            value: state.remaining,
            color: gold,
          },
          {
            label: ['累计光向外传出', 'Cumulative light carried out'],
            value: state.lightOut,
            color: purple,
          },
          {
            label: ['灯与周围内能增加', 'Internal-energy increase'],
            value: state.thermal,
            color: green,
          },
        ]}
      />
      <p className="phy-energy-total">
        <B
          zh="剩余 + 累计传出 + 内能增加"
          en="Remaining + cumulative out + internal-energy increase"
          mode={mode}
        />{' '}
        = {j(state.remaining + state.lightOut + state.thermal)}
      </p>
      <Table
        mode={mode}
        columns={[
          ['开关', 'Switch'],
          ['剩余', 'Remaining'],
          ['光向外', 'Light out'],
          ['内能增加', 'Internal Δ'],
        ]}
        rows={records.map((r) => {
          const s = lampLedger(Boolean(r), 1);
          return {
            id: String(r),
            cells: [
              <B zh={r ? '打开' : '关闭'} en={r ? 'On' : 'Off'} mode={mode} />,
              j(s.remaining),
              j(s.lightOut),
              j(s.thermal),
            ],
          };
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={2}
        hint={[
          '关灯与开灯都完整观察；拖动不能代替。',
          'Complete both off and on observations; seeking does not replace them.',
        ]}
      />
    </Shell>
  );
}
const masses = [0.5, 1],
  speeds = [0, 2, 4];
export function KineticEnergyLab({ mode, onExplore }: Props) {
  const [mi, setMI] = useState(0),
    [vi, setVI] = useState(1),
    [records, setRecords] = useState<string[]>([]);
  const cases = useComparisons(['0-1', '1-1', '0-2'], onExplore),
    a = useAnimation(2);
  const m = masses[mi]!,
    v = speeds[vi]!,
    energy = kineticEnergy(m, v),
    x = 70 + v * a.time * 50;
  const change = (set: (n: number) => void, n: number) => {
    a.reset();
    set(n);
  };
  return (
    <Shell
      mode={mode}
      title={['一次只改质量或速率', 'Change mass or speed, one at a time']}
      note={[
        '理想小车只平移，不计算车轮转动；所有速度都相对地面。m=0.5/1 kg，v=0/2/4 m/s，Ek=½mv²。运动片段保持匀速，以图中比例取样两秒，末帧冻结不表示真实停车。能量条使用共同8 J标尺，读数是模型值。',
        'An ideal translating cart, with wheel rotation omitted. All velocities use the ground frame. m=0.5/1 kg, v=0/2/4 m/s, Ek=½mv². The two-second sample stays at constant speed; freezing the last frame is not a physical stop. Energy bars share an 8 J scale; readings are model values.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['质量', 'Mass']}
          values={masses.map((m, id) => ({ id, zh: m + ' kg', en: m + ' kg' }))}
          value={mi}
          disabled={a.running}
          set={(n) => change(setMI, n)}
        />
        <Options
          mode={mode}
          name={['速率（地面参考系）', 'Speed (ground frame)']}
          values={speeds.map((v, id) => ({
            id,
            zh: v + ' m/s',
            en: v + ' m/s',
          }))}
          value={vi}
          disabled={a.running}
          set={(n) => change(setVI, n)}
        />
      </div>
      <svg
        className="phy-simulation phy-energy-svg"
        viewBox="0 0 600 180"
        role="img"
        aria-label={
          mode === 'en'
            ? 'A translating constant-speed cart'
            : '只平移的匀速小车'
        }
      >
        <path d="M45 141h510" stroke="#c8bbd2" strokeWidth="2" />
        <g transform={'translate(' + x + ' 0)'}>
          <rect x="0" y="95" width="62" height="30" rx="6" fill={purple} />
          <circle cx="13" cy="132" r="9" fill="#b9a6ca" />
          <circle cx="49" cy="132" r="9" fill="#b9a6ca" />
          <text x="31" y="83" textAnchor="middle" fontSize="19" fill="#8c729d">
            {m} kg
          </text>
          {v > 0 && (
            <path
              d="M0 49h60m-9-6 9 6-9 6"
              stroke={gold}
              strokeWidth="3"
              fill="none"
            />
          )}
        </g>
        <text x="300" y="32" textAnchor="middle" fontSize="20" fill="#8c729d">
          {v} m/s · {j(energy)}
        </text>
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button secondary"
          disabled={a.running}
          onClick={a.start}
        >
          <B
            zh="看一段匀速取样"
            en="Watch a constant-speed sample"
            mode={mode}
          />
        </button>
        <button
          className="phy-button"
          disabled={a.running}
          onClick={() => {
            const key = mi + '-' + vi;
            cases.record(key);
            setRecords((old) => [...new Set([...old, key])]);
          }}
        >
          <B
            zh="记录质量、速率与动能"
            en="Record mass, speed and kinetic energy"
            mode={mode}
          />
        </button>
      </div>
      <Bars
        mode={mode}
        scale={8}
        rows={[
          {
            label: ['动能Ek', 'Kinetic energy Ek'],
            value: energy,
            color: gold,
          },
        ]}
      />
      <Table
        mode={mode}
        columns={[
          ['质量', 'Mass'],
          ['速率', 'Speed'],
          ['动能', 'Kinetic'],
        ]}
        rows={records.map((key) => {
          const [mi, vi] = key.split('-').map(Number),
            m = masses[mi!]!,
            v = speeds[vi!]!;
          return {
            id: key,
            cells: [m + ' kg', v + ' m/s', j(kineticEnergy(m, v))],
          };
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        hint={[
          '0.5 kg/2 m/s、1 kg/2 m/s、0.5 kg/4 m/s。',
          '0.5 kg/2 m/s, 1 kg/2 m/s, 0.5 kg/4 m/s.',
        ]}
      />
    </Shell>
  );
}
const heights = [0.5, 1],
  references = [0, 0.5];
export function GravitationalEnergyLab({ mode, onExplore }: Props) {
  const [mi, setMI] = useState(0),
    [hi, setHI] = useState(1),
    [ri, setRI] = useState(0),
    [records, setRecords] = useState<string[]>([]);
  const cases = useComparisons(['0-1-0', '1-1-0', '0-0-0', '0-1-1'], onExplore);
  const m = masses[mi]!,
    h = heights[hi]!,
    ref = references[ri]!,
    start = gravitationalEnergy(m, h, ref),
    end = gravitationalEnergy(m, 0, ref),
    drop = start - end;
  const zeroLabel: Label[] = [
    ['地板0 m', 'Floor 0 m'],
    ['架子0.5 m', 'Shelf 0.5 m'],
  ];
  return (
    <Shell
      mode={mode}
      title={[
        '书—地球体系，高度差与零点',
        'Book–Earth system, height changes and zero',
      ]}
      note={[
        '近地面g固定10 N/kg；书质量0.5/1 kg，实际高度0.5/1 m。Eg=mg(h−h₀)，两端采用相同零点。能量条显示下降至地板的Eg减少量，不是单个端点可能为负的Eg；图不模拟自由落体、手降低过程或落地碰撞。',
        'Near-surface g is fixed at 10 N/kg; mass=0.5/1 kg, physical height=0.5/1 m. Eg=mg(h−h₀), using the same reference at both endpoints. The bar shows the decrease available down to the floor, not a single endpoint’s possibly negative Eg. Free fall, lowering by hand and impact are not simulated.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['质量', 'Mass']}
          values={masses.map((m, id) => ({ id, zh: m + ' kg', en: m + ' kg' }))}
          value={mi}
          set={setMI}
        />
        <Options
          mode={mode}
          name={['实际起点高度', 'Physical start height']}
          values={heights.map((h, id) => ({ id, zh: h + ' m', en: h + ' m' }))}
          value={hi}
          set={setHI}
        />
        <Options
          mode={mode}
          name={['约定零点', 'Chosen zero']}
          values={zeroLabel.map(([zh, en], id) => ({ id, zh, en }))}
          value={ri}
          set={setRI}
        />
      </div>
      <svg
        className="phy-simulation phy-energy-svg"
        viewBox="0 0 600 270"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Book endpoints and independently chosen zero height'
            : '书的实际起终点与独立选择的零高度'
        }
      >
        <path d="M120 230h360M130 70v160" stroke="#c8bbd2" strokeWidth="2" />
        {[0, 0.5, 1].map((height) => (
          <g key={height}>
            <path d={'M125 ' + (230 - 160 * height) + 'h10'} stroke="#b6a0c6" />
            <text
              x="108"
              y={237 - 160 * height}
              textAnchor="end"
              fontSize="19"
              fill="#8c729d"
            >
              {height} m
            </text>
          </g>
        ))}
        <rect
          x="225"
          y={210 - 160 * h}
          width="100"
          height="20"
          rx="3"
          fill={purple}
        />
        <text
          x="275"
          y={195 - 160 * h}
          textAnchor="middle"
          fill="#8c729d"
          fontSize="20"
        >
          {m} kg
        </text>
        <rect
          x="225"
          y="210"
          width="100"
          height="20"
          rx="3"
          fill={purple}
          opacity=".2"
        />
        <path
          d={'M170 ' + (230 - 160 * ref) + 'h290'}
          stroke={gold}
          strokeDasharray="7 5"
          strokeWidth="2"
        />
        <text x="475" y={237 - 160 * ref} fill="#a38151" fontSize="18">
          Eg = 0
        </text>
        <path
          d={'M365 ' + (230 - 160 * h) + 'V224m-6-9 6 9 6-9'}
          stroke={green}
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['起点Eg', 'Start Eg']}>
          {j(start)}
        </Metric>
        <Metric mode={mode} title={['地板Eg', 'Floor Eg']}>
          {j(end)}
        </Metric>
        <Metric
          mode={mode}
          title={['同一次下降的减少量', 'Decrease in the same descent']}
        >
          {j(drop)}
        </Metric>
      </div>
      <Bars
        mode={mode}
        scale={10}
        rows={[
          {
            label: [
              '下降至地板可转出的能量',
              'Decrease available down to floor',
            ],
            value: drop,
            color: gold,
          },
        ]}
      />
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          onClick={() => {
            const key = mi + '-' + hi + '-' + ri;
            cases.record(key);
            setRecords((old) => [...new Set([...old, key])]);
          }}
        >
          <B
            zh="记录起点、终点与零点"
            en="Record endpoints and zero"
            mode={mode}
          />
        </button>
      </div>
      <Table
        mode={mode}
        columns={[
          ['质量/高度', 'Mass/height'],
          ['零点', 'Zero'],
          ['起点Eg', 'Start Eg'],
          ['地板Eg', 'Floor Eg'],
          ['减少量', 'Decrease'],
        ]}
        rows={records.map((key) => {
          const [mi, hi, ri] = key.split('-').map(Number),
            m = masses[mi!]!,
            h = heights[hi!]!,
            ref = references[ri!]!,
            start = gravitationalEnergy(m, h, ref),
            end = gravitationalEnergy(m, 0, ref);
          return {
            id: key,
            cells: [
              m + ' kg / ' + h + ' m',
              ref + ' m',
              j(start),
              j(end),
              j(start - end),
            ],
          };
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        hint={[
          '基线、只改质量、只改高度、只改零点。',
          'Baseline, change mass, change height, change zero.',
        ]}
      />
    </Shell>
  );
}
const extensions = [-0.1, 0, 0.1, 0.2],
  stiffnesses = [100, 200];
export function ElasticEnergyLab({ mode, onExplore }: Props) {
  const [ki, setKI] = useState(0),
    [xi, setXI] = useState(2),
    [phase, setPhase] = useState(0),
    [records, setRecords] = useState<string[]>([]);
  const k = stiffnesses[ki]!,
    initialX = extensions[xi]!,
    initial = springRelease(k, initialX, 0);
  const cases = useComparisons(['0-2', '0-3', '0-0', '1-2'], onExplore);
  const a = useAnimation(initial.duration * 10, () => {
    setPhase(1);
    const key = ki + '-' + xi;
    cases.record(key);
    setRecords((old) => [...new Set([...old, key])]);
  });
  const p = a.running ? a.time / (initial.duration * 10) : phase,
    state = springRelease(k, initialX, p * initial.duration),
    endX = 260 + 300 * state.extension;
  const points = Array.from(
    { length: 13 },
    (_, i) =>
      80 +
      ((endX - 80) * i) / 12 +
      ',' +
      (i === 0 || i === 12 ? 126 : i % 2 ? 114 : 138),
  ).join(' ');
  const change = (set: (n: number) => void, n: number) => {
    a.reset();
    setPhase(0);
    set(n);
  };
  return (
    <Shell
      mode={mode}
      title={[
        '弹性储备→运动；观察第一次原长',
        'Elastic store → motion; inspect the first crossing',
      ]}
      note={[
        '水平理想线性、无质量弹簧，k=100/200 N/m；附着小车质量0.5 kg，无摩擦。x相对原长，负值压缩、正值拉伸。释放后x=x₀cos(√(k/m)t)，速度是其时间变化；Ee=½kx²，Ek=½mv²。以真实模型时间的十分之一速播放，在第一次原长停止取样，遗漏之后振荡和任何损耗。',
        'An ideal horizontal massless linear spring at k=100/200 N/m, attached to a frictionless 0.5 kg cart. x is relative to natural length: negative compression, positive stretch. After release x=x₀cos(√(k/m)t), with velocity from its time derivative; Ee=½kx² and Ek=½mv². Played ten times slower than model time, ending at the first natural-length crossing; later oscillations and all losses are omitted.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['劲度k', 'Stiffness k']}
          values={stiffnesses.map((k, id) => ({
            id,
            zh: k + ' N/m',
            en: k + ' N/m',
          }))}
          value={ki}
          disabled={a.running}
          set={(n) => change(setKI, n)}
        />
        <Options
          mode={mode}
          name={[
            '初始形变（相对原长）',
            'Initial deformation (from natural length)',
          ]}
          values={[
            { id: 0, zh: '压缩10 cm', en: 'Compress 10 cm' },
            { id: 1, zh: '原长', en: 'Natural length' },
            { id: 2, zh: '拉伸10 cm', en: 'Stretch 10 cm' },
            { id: 3, zh: '拉伸20 cm', en: 'Stretch 20 cm' },
          ]}
          value={xi}
          disabled={a.running}
          set={(n) => change(setXI, n)}
        />
      </div>
      <svg
        className="phy-simulation phy-energy-svg"
        viewBox="0 0 600 215"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Spring deformation, natural-length marker and moving cart'
            : '弹簧形变、原长标记与运动小车'
        }
      >
        <path d="M80 80v75M70 155h450" stroke="#b6a0c6" strokeWidth="3" />
        <path d="M260 56v112" stroke={gold} strokeDasharray="5 5" />
        <polyline points={points} fill="none" stroke={purple} strokeWidth="3" />
        <g transform={'translate(' + endX + ' 0)'}>
          <rect y="100" width="60" height="38" rx="6" fill="#c5b3d4" />
          <circle cx="12" cy="145" r="8" fill={purple} />
          <circle cx="48" cy="145" r="8" fill={purple} />
          <text x="30" y="88" textAnchor="middle" fontSize="19" fill="#8c729d">
            0.5 kg
          </text>
        </g>
        <text x="260" y="43" textAnchor="middle" fontSize="18" fill="#a38151">
          x = 0
        </text>
        <text x="300" y="194" textAnchor="middle" fontSize="19" fill="#8c729d">
          x = {num(state.extension)} m · |v| = {num(Math.abs(state.velocity))}{' '}
          m/s
        </text>
        {Math.abs(state.velocity) > 1e-8 && (
          <path
            d={
              state.velocity > 0
                ? 'M410 103h70m-9-6 9 6-9 6'
                : 'M480 103h-70m9-6-9 6 9 6'
            }
            fill="none"
            stroke={gold}
            strokeWidth="3"
          />
        )}
      </svg>
      <div className="phy-lab-controls">
        <button className="phy-button" disabled={a.running} onClick={a.start}>
          <B
            zh={a.running ? '正在释放…' : '完整释放到第一次原长'}
            en={
              a.running ? 'Releasing…' : 'Release to the first natural length'
            }
            mode={mode}
          />
        </button>
      </div>
      <Probe mode={mode} phase={p} set={setPhase} disabled={a.running} />
      <Bars
        mode={mode}
        scale={4}
        rows={[
          {
            label: ['弹性势能Ee', 'Elastic potential Ee'],
            value: state.elastic,
            color: purple,
          },
          {
            label: ['小车动能Ek', 'Cart kinetic Ek'],
            value: state.kinetic,
            color: gold,
          },
        ]}
      />
      <p className="phy-energy-total">
        Ee + Ek = {j(state.total)} ·{' '}
        <B zh="初始储备" en="Initial store" mode={mode} /> {j(state.initial)}
      </p>
      <Table
        mode={mode}
        columns={[
          ['k', 'k'],
          ['初始x', 'Initial x'],
          ['初始Ee', 'Initial Ee'],
          ['原长处Ek', 'Crossing Ek'],
          ['原长处速率', 'Crossing speed'],
        ]}
        rows={records.map((key) => {
          const [ki, xi] = key.split('-').map(Number),
            k = stiffnesses[ki!]!,
            x = extensions[xi!]!,
            end = springRelease(k, x, 100);
          return {
            id: key,
            cells: [
              k + ' N/m',
              num(x) + ' m',
              j(elasticEnergy(k, x)),
              j(end.kinetic),
              num(Math.abs(end.velocity)) + ' m/s',
            ],
          };
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        hint={[
          '100 N/m拉10、拉20、压10 cm；200 N/m拉10 cm。拖动不计完整释放。',
          '100 N/m: stretch 10, stretch 20, compress 10 cm; 200 N/m: stretch 10 cm. Seeking does not count as a release.',
        ]}
      />
    </Shell>
  );
}
const positions: Label[] = [
  ['出发', 'Departure'],
  ['最低点', 'Bottom'],
  ['最高返回点', 'Highest return'],
];
function TrackLab({
  mode,
  onExplore,
  dissipating,
}: Props & { dissipating: boolean }) {
  const [rough, setRough] = useState(0),
    [position, setPosition] = useState(0),
    [records, setRecords] = useState<string[]>([]);
  const stateAtRest = trackLedger(Boolean(rough), position);
  const cases = useComparisons(
    dissipating ? ['0-2', '1-1', '1-2'] : ['0-0', '0-1', '0-2'],
    onExplore,
  );
  const a = useAnimation(3, () => setPosition(stateAtRest.turn));
  const state = trackLedger(
      Boolean(rough),
      a.running ? (a.time / 3) * stateAtRest.turn : position,
    ),
    recovery = trackRecovery(Boolean(rough));
  const targets = [0, 0.5, state.turn],
    selected = targets.findIndex((u) => Math.abs(u - state.position) < 1e-8);
  const x = 80 + 440 * state.position,
    y = 205 - 145 * state.height;
  const roughLabel = (n: number) => (
    <B
      zh={n ? '粗糙模型' : '理想光滑'}
      en={n ? 'Rough model' : 'Ideal smooth'}
      mode={mode}
    />
  );
  return (
    <Shell
      mode={mode}
      title={
        dissipating
          ? [
              '减少的机械能，留下新的去向',
              'Reduced mechanical energy gains other destinations',
            ]
          : [
              '巡查高度、动能与完整账本',
              'Inspect height, kinetic energy and the whole ledger',
            ]
      }
      note={[
        '1 kg非转动滑块与地球，起点1 m静止，地板零点，g=10 N/kg，初始10 J。位置u从左0到右1，高度规定h=(1−2u)² m。理想轨道无损耗；粗糙教学账本规定内能增加D=4u J，不是实测摩擦系数。Ek=10−mgh−D，在第一次Ek=0的返回点停止，粗糙u=0.90、h=0.64 m、D=3.60 J。图的探针与三秒巡查只索引位置，不预测运动用时；实际转动、声音和轨道误差未计算。效率只对“再次抬高”任务计算。',
        'A 1 kg non-rotating slider with Earth starts at rest at 1 m; floor zero, g=10 N/kg, initial 10 J. Position u runs left 0 to right 1 with prescribed h=(1−2u)² m. Ideal track has no losses. The rough teaching ledger prescribes internal-energy increase D=4u J, not a measured friction coefficient. Ek=10−mgh−D; stop at the first return with Ek=0: rough u=0.90, h=0.64 m, D=3.60 J. The probe and three-second scan index position, not travel time. Rotation, sound and track errors are omitted. Efficiency is calculated only for raising the cart again.',
      ]}
    >
      {dissipating && (
        <Options
          mode={mode}
          name={['轨道条件', 'Track condition']}
          values={[
            { id: 0, zh: '理想光滑', en: 'Ideal smooth' },
            { id: 1, zh: '粗糙模型', en: 'Rough model' },
          ]}
          value={rough}
          disabled={a.running}
          set={(n) => {
            a.reset();
            setRough(n);
            setPosition(0);
          }}
        />
      )}
      <svg
        className="phy-simulation phy-energy-svg"
        viewBox="0 0 600 255"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Position inspection probe on a teaching energy track'
            : '教学能量轨道上的位置巡查探针'
        }
      >
        <path
          d="M80 60Q300 350 520 60"
          fill="none"
          stroke="#c0b0cc"
          strokeWidth="4"
        />
        {rough === 1 && (
          <path
            d="M134 123l12 9m28 25 12 7m25 16 12 6m29 10 12 3m30 5h12m29-3 12-3m29-10 12-6"
            stroke={green}
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}
        <path d="M61 205h478" stroke="#d4c9dc" strokeDasharray="4 5" />
        <path
          d={'M' + x + ' ' + (y - 18) + 'V205'}
          stroke={gold}
          strokeDasharray="5 5"
        />
        <circle
          cx={x}
          cy={y}
          r="14"
          fill="#fbf8fd"
          stroke={gold}
          strokeWidth="4"
        />
        <path
          d={'M' + (x + 10) + ' ' + (y + 10) + 'l12 12'}
          stroke={gold}
          strokeWidth="4"
        />
        <text x="300" y="30" textAnchor="middle" fontSize="20" fill="#8c729d">
          h = {num(state.height)} m · |v| = {num(state.speed)} m/s
        </text>
        <text x="70" y="241" fontSize="19" fill="#8c729d">
          u = 0
        </text>
        <text x="463" y="241" fontSize="19" fill="#8c729d">
          u = 1
        </text>
      </svg>
      <p className="phy-force-legend">
        <B
          zh="圆圈是巡查探针，不是运动计时；虚线高度以地板为零点。"
          en="The circle is an inspection probe, not a motion timer; dashed height uses floor zero."
          mode={mode}
        />
      </p>
      <Options
        mode={mode}
        name={['关键位置', 'Key position']}
        values={positions.map(([zh, en], id) => ({ id, zh, en }))}
        value={selected}
        disabled={a.running}
        set={(n) => {
          a.reset();
          setPosition(targets[n]!);
        }}
      />
      <label className="phy-energy-probe">
        <span>
          <B
            zh="位置索引u（不是时间）"
            en="Position index u (not time)"
            mode={mode}
          />{' '}
          = {num(state.position)}
        </span>
        <input
          type="range"
          min="0"
          max={Math.round(state.turn * 100)}
          step="1"
          value={Math.round(state.position * 100)}
          disabled={a.running}
          aria-label={mode === 'en' ? 'Position index' : '位置索引'}
          onChange={(e) => setPosition(Number(e.target.value) / 100)}
        />
      </label>
      <div className="phy-lab-controls">
        <button
          className="phy-button secondary"
          disabled={a.running}
          onClick={a.start}
        >
          <B zh="巡查这段能量账本" en="Scan this energy ledger" mode={mode} />
        </button>
        <button
          className="phy-button"
          disabled={a.running || selected < 0}
          onClick={() => {
            const key = rough + '-' + selected;
            cases.record(key);
            setRecords((old) => [...new Set([...old, key])]);
          }}
        >
          <B zh="记录这个关键位置" en="Record this key position" mode={mode} />
        </button>
      </div>
      <Bars
        mode={mode}
        scale={10}
        rows={[
          {
            label: ['重力势能Eg', 'Gravitational Eg'],
            value: state.potential,
            color: purple,
          },
          {
            label: ['动能Ek', 'Kinetic Ek'],
            value: state.kinetic,
            color: gold,
          },
          ...(dissipating
            ? [
                {
                  label: ['内能增加', 'Internal-energy increase'] as Label,
                  value: state.thermal,
                  color: green,
                },
              ]
            : []),
        ]}
      />
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['机械能Eg+Ek', 'Mechanical Eg+Ek']}>
          {j(state.mechanical)}
        </Metric>
        <Metric
          mode={mode}
          title={['包含全部去向的账本', 'Ledger including all destinations']}
        >
          {j(state.total)}
        </Metric>
      </div>
      {dissipating && (
        <div className="phy-energy-task">
          <strong>
            <B
              zh="任务：再次把小车抬高"
              en="Task: raise the cart again"
              mode={mode}
            />
          </strong>
          <p>
            <B
              zh="最高返回点的有用输出"
              en="Useful output at highest return"
              mode={mode}
            />{' '}
            {j(recovery.useful)} / 10.00 J ={' '}
            {(recovery.efficiency * 100).toFixed(0)}%
          </p>
          <B
            zh="这是本任务的完整结果，不是当前位置的效率。内能增加在暖手任务中可能是目标输出。"
            en="This is the completed task result, not efficiency at the current probe position. Internal-energy increase can be the desired output when warming hands."
            mode={mode}
          />
        </div>
      )}
      <Table
        mode={mode}
        columns={[
          ['条件/位置', 'Condition/position'],
          ['h', 'h'],
          ['Eg', 'Eg'],
          ['Ek', 'Ek'],
          ['内能增加', 'Internal Δ'],
        ]}
        rows={records.map((key) => {
          const [r, id] = key.split('-').map(Number),
            s = trackLedger(Boolean(r), [0, 0.5, r ? 0.9 : 1][id!]!);
          return {
            id: key,
            cells: [
              <>
                {roughLabel(r!)} ·{' '}
                <B
                  zh={positions[id!]![0]}
                  en={positions[id!]![1]}
                  mode={mode}
                />
              </>,
              num(s.height) + ' m',
              j(s.potential),
              j(s.kinetic),
              j(s.thermal),
            ],
          };
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        hint={
          dissipating
            ? [
                '光滑返回点、粗糙最低点、粗糙返回点；在关键位置点击记录。',
                'Smooth return, rough bottom, rough return; click record at each key position.',
              ]
            : [
                '出发、最低点与最高返回点；在关键位置点击记录。',
                'Departure, bottom and highest return; click record at each key position.',
              ]
        }
      />
    </Shell>
  );
}
export function ConservationTrackLab(props: Props) {
  return <TrackLab {...props} dissipating={false} />;
}
export function DissipationTrackLab(props: Props) {
  return <TrackLab {...props} dissipating />;
}
