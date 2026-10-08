import { useState, type ReactNode } from 'react';
import { B } from '../ui';
import {
  LabOptions as Options,
  LabMetric as Metric,
  useComparisons,
  type LabProps as Props,
} from './LabControls';
import { EnergyBars } from './EnergyBars';
import { useAnimation } from './useSimulation';
import {
  forceWork,
  workScenarios,
  pushLedger,
  liftingTask,
  liftingSnapshot,
  rampTask,
} from './workModels';
type Label = [string, string];
const purple = '#a58aba',
  gold = '#c9a774',
  green = '#98b6a9';
const num = (v: number) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(2);
const j = (v: number) => num(v) + ' J';

function Shell({
  mode,
  title,
  note,
  children,
}: Props & { title: Label; note: Label; children: ReactNode }) {
  return (
    <div className="phy-lab phy-forces-lab phy-work-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">WORK / MAKE A CHANGE</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学模型 · 比较物体、指定力和任务区间。"
          en="Teaching model · Compare the object, specified force and task interval."
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
    <p role="status" className="phy-force-record">
      <B
        zh={`已比较 ${count}/${total}：${hint[0]}`}
        en={`Compared ${count}/${total}: ${hint[1]}`}
        mode={mode}
      />
    </p>
  );
}
function Table({
  mode,
  columns,
  rows,
}: Props & { columns: Label[]; rows: ReactNode[][] }) {
  if (!rows.length) return null;
  return (
    <div className="phy-work-table">
      <table className="phy-data-table">
        <caption>
          <B
            zh="保留教学对照 · 一次只改变一个条件"
            en="Retain teaching comparisons · Change one condition at a time"
            mode={mode}
          />
        </caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c[1]}>
                {c[0] === c[1] ? c[0] : <B zh={c[0]} en={c[1]} mode={mode} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, k) =>
                k === 0 ? (
                  <th scope="row" key={k}>
                    {cell}
                  </th>
                ) : (
                  <td key={k}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Action({
  mode,
  zh,
  en,
  running,
  onClick,
}: {
  mode: Props['mode'];
  zh: string;
  en: string;
  running?: boolean;
  onClick: () => void;
}) {
  return (
    <button className="phy-button" disabled={running} onClick={onClick}>
      <B
        zh={running ? '观察中…' : zh}
        en={running ? 'Observing…' : en}
        mode={mode}
      />
    </button>
  );
}
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
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g>
      <path
        d={`M${x} ${y}l${dx} ${dy}`}
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="m-9-6 9 6-9 6"
        transform={`translate(${x + dx},${y + dy}) rotate(${angle})`}
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}
const sceneNames: Label[] = [
  ['推着走', 'Push'],
  ['原地提', 'Hold still'],
  ['水平搬', 'Carry level'],
  ['往上抬', 'Lift'],
  ['慢慢放下', 'Lower slowly'],
];
export function WorkDirectionLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    [finished, setFinished] = useState(false),
    [records, setRecords] = useState<number[]>([]);
  const cases = useComparisons(['0', '1', '2', '3'], onExplore),
    scene = workScenarios[choice]!;
  const work = forceWork(
    scene.force[0],
    scene.force[1],
    scene.displacement[0],
    scene.displacement[1],
  );
  const a = useAnimation(2, () => {
    setFinished(true);
    cases.record(String(choice));
    setRecords((old) => [...new Set([...old, choice])]);
  });
  const p = a.running ? a.time / 2 : finished ? 1 : 0;
  const vertical = choice >= 3,
    startX = vertical ? 265 : choice === 1 ? 265 : 130,
    startY = choice === 3 ? 205 : choice === 4 ? 100 : 160;
  const x = startX + scene.displacement[0] * 65 * p,
    y = startY - scene.displacement[1] * 105 * p;
  return (
    <Shell
      mode={mode}
      title={['力箭头与位移箭头', 'Force and displacement arrows']}
      note={[
        '地面参考，力恒定，忽略晃动与形变。推箱时另有平衡阻力；提起或放下按匀速区间比较，提力20 N与重力平衡。图只画指定力，不是全部受力图。2 s播放只是示意，不由力预测速度，也不计算人的能量消耗。',
        'Ground frame; constant forces, no bobbing or deformation. A balancing resistance acts during pushing; steady raising/lowering uses 20 N support balanced by gravity. Only the specified force is drawn. Two-second playback is illustrative, not a force-based motion or bodily-energy prediction.',
      ]}
    >
      <Options
        mode={mode}
        name={['情景', 'Scenario']}
        values={sceneNames.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={a.running}
        set={(n) => {
          a.reset();
          setFinished(false);
          setChoice(n);
        }}
      />
      <div className="phy-work-grid">
        <svg
          className="phy-simulation phy-work-svg"
          viewBox="0 0 600 280"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Specified force and object displacement in the ground frame'
              : '地面参考下的指定力与物体位移'
          }
        >
          <path d="M50 240h500" stroke="#d1c5db" strokeWidth="2" />
          <rect
            x={startX - 24}
            y={startY - 30}
            width="48"
            height="30"
            rx="5"
            fill={purple}
            opacity=".18"
          />
          <rect
            x={x - 24}
            y={y - 30}
            width="48"
            height="30"
            rx="5"
            fill={purple}
          />
          <Arrow
            x={x}
            y={y - 40}
            dx={scene.force[0] ? 65 : 0}
            dy={scene.force[1] ? -55 : 0}
            color={purple}
          />
          <text x="300" y="37" textAnchor="middle" fill="#8d729f" fontSize="22">
            F = {Math.hypot(...scene.force)} N
          </text>
          {scene.displacement[0] !== 0 ? (
            <Arrow x={startX} y={startY + 35} dx={130} dy={0} color={gold} />
          ) : scene.displacement[1] !== 0 ? (
            <Arrow
              x={410}
              y={startY}
              dx={0}
              dy={-scene.displacement[1] * 105}
              color={gold}
            />
          ) : (
            <circle cx="420" cy="170" r="5" fill={gold} />
          )}
          <text
            x="300"
            y="273"
            textAnchor="middle"
            fill="#a68b60"
            fontSize="21"
          >
            Δx = {scene.displacement[0]} m · Δy = {scene.displacement[1]} m
          </text>
        </svg>
        <div className="phy-work-result">
          <Metric
            mode={mode}
            title={[
              '完整位移后，这个力的功',
              'Work by this force over the full displacement',
            ]}
          >
            {j(work)}
          </Metric>
          <p>
            <B
              zh={
                choice === 1
                  ? '物体没移动。人仍可能消耗体内能量。'
                  : choice === 2
                    ? '向上提力与水平位移垂直。'
                    : choice === 4
                      ? '提力向上、位移向下：负功。'
                      : '指定力与位移同向：正功。'
              }
              en={
                choice === 1
                  ? 'The object stays still. The person may still use chemical energy.'
                  : choice === 2
                    ? 'Upward support is perpendicular to horizontal displacement.'
                    : choice === 4
                      ? 'Upward support opposes downward displacement: negative work.'
                      : 'This force and displacement align: positive work.'
              }
              mode={mode}
            />
          </p>
          <p className="phy-model-note">
            <B
              zh="数字描述完整位移；圆点/影子标记起点。"
              en="Values describe the full displacement; the ghost marks its start."
              mode={mode}
            />
          </p>
        </div>
      </div>
      <Action
        mode={mode}
        zh="完整观察这个情景"
        en="Watch this complete case"
        running={a.running}
        onClick={() => {
          setFinished(false);
          a.start();
        }}
      />
      <Table
        mode={mode}
        columns={[
          ['情景', 'Case'],
          ['指定力', 'Force'],
          ['Δx，Δy', 'Δx, Δy'],
          ['这个力的功', 'Force work'],
        ]}
        rows={records.map((n) => {
          const s = workScenarios[n]!;
          return [
            <B zh={sceneNames[n]![0]} en={sceneNames[n]![1]} mode={mode} />,
            Math.hypot(...s.force) + ' N',
            `${s.displacement[0]}, ${s.displacement[1]} m`,
            j(
              forceWork(
                s.force[0],
                s.force[1],
                s.displacement[0],
                s.displacement[1],
              ),
            ),
          ];
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        hint={[
          '推、原地提、水平搬、往上抬；完整观察才记录。',
          'Push, hold, carry and lift; record after full observation.',
        ]}
      />
    </Shell>
  );
}

export function WorkAreaLab({ mode, onExplore }: Props) {
  const [fi, setFi] = useState(0),
    [di, setDi] = useState(1),
    [records, setRecords] = useState<string[]>([]);
  const forces = [4, 8],
    distances = [1, 2, 3],
    f = forces[fi]!,
    d = distances[di]!,
    ledger = pushLedger(f, d);
  const cases = useComparisons(['0-1', '1-1', '0-2'], onExplore);
  const record = () => {
    const key = fi + '-' + di;
    cases.record(key);
    setRecords((old) => [...new Set([...old, key])]);
  };
  return (
    <Shell
      mode={mode}
      title={[
        '力×距离，就是长方形面积',
        'Force × distance is a rectangle area',
      ]}
      note={[
        '恒定水平推力，位移同向；另有大小相等的滑动阻力，让箱子保持原有匀速。更大推力同时规定更大的平衡阻力，不代表同一地板的实测摩擦。忽略声音等，推力输入全部成为箱子和地板内能增加，动能不变。',
        'Constant aligned horizontal force; equal sliding resistance preserves initial steady motion. Increasing applied force also prescribes greater balancing resistance, not measured friction on one floor. Sound and other transfers are omitted; input becomes box-plus-floor internal energy with unchanged kinetic energy.',
      ]}
    >
      <div className="phy-work-controls">
        <Options
          mode={mode}
          name={['推力F', 'Applied force F']}
          values={forces.map((v, id) => ({ id, zh: v + ' N', en: v + ' N' }))}
          value={fi}
          set={setFi}
        />
        <Options
          mode={mode}
          name={['沿力方向的位移s', 'Aligned displacement s']}
          values={distances.map((v, id) => ({
            id,
            zh: v + ' m',
            en: v + ' m',
          }))}
          value={di}
          set={setDi}
        />
      </div>
      <div className="phy-work-grid">
        <svg
          className="phy-simulation phy-work-svg"
          viewBox="0 0 600 280"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Constant applied force versus displacement; rectangle area is work'
              : '恒定推力—位移图，长方形面积表示功'
          }
        >
          <path
            d="M70 35v180h480"
            fill="none"
            stroke="#b4a0c4"
            strokeWidth="2"
          />
          {[0, 4, 8].map((n) => (
            <g key={n}>
              <path d={`M65 ${215 - 18 * n}h5`} stroke={purple} />
              <text
                x="53"
                y={222 - 18 * n}
                textAnchor="end"
                fontSize="20"
                fill="#8d729f"
              >
                {n}
              </text>
            </g>
          ))}
          {[1, 2, 3].map((n) => (
            <text
              key={n}
              x={70 + 150 * n}
              y="241"
              textAnchor="middle"
              fontSize="20"
              fill="#8d729f"
            >
              {n}
            </text>
          ))}
          <rect
            x="70"
            y={215 - 18 * f}
            width={150 * d}
            height={18 * f}
            fill={gold}
            opacity=".24"
          />
          <path
            d={`M70 ${215 - 18 * f}h${150 * d}`}
            stroke={gold}
            strokeWidth="4"
          />
          <text
            x={70 + 75 * d}
            y={220 - 9 * f}
            textAnchor="middle"
            fill="#9b7d50"
            fontSize="25"
          >
            {f} × {d} = {ledger.applied} J
          </text>
          <text x="35" y="28" fill="#8d729f" fontSize="21">
            F / N
          </text>
          <text x="530" y="272" textAnchor="end" fill="#8d729f" fontSize="21">
            s / m
          </text>
        </svg>
        <div>
          <EnergyBars
            mode={mode}
            scale={24}
            rows={[
              {
                label: ['推力输入的功', 'Applied input work'],
                value: ledger.applied,
                color: gold,
              },
              {
                label: ['箱子+地板内能增加', 'Box + floor internal increase'],
                value: ledger.thermal,
                color: green,
              },
            ]}
          />
          <div className="phy-work-small-metrics">
            <Metric mode={mode} title={['摩擦功', 'Frictional work']}>
              {j(ledger.friction)}
            </Metric>
            <Metric
              mode={mode}
              title={['合力功/动能变化', 'Net work / kinetic change']}
            >
              {j(ledger.net)}
            </Metric>
          </div>
        </div>
      </div>
      <Action
        mode={mode}
        zh="记录力、距离与功"
        en="Record force, distance and work"
        onClick={record}
      />
      <Table
        mode={mode}
        columns={[
          ['F', 'F'],
          ['s', 's'],
          ['推力功', 'Applied work'],
          ['摩擦功', 'Friction work'],
          ['内能增加', 'Internal Δ'],
        ]}
        rows={records.map((key) => {
          const [a, b] = key.split('-').map(Number),
            ff = forces[a!]!,
            dd = distances[b!]!,
            s = pushLedger(ff, dd);
          return [
            ff + ' N',
            dd + ' m',
            j(s.applied),
            j(s.friction),
            j(s.thermal),
          ];
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        hint={['4 N/2 m、8 N/2 m、4 N/3 m。', '4 N/2 m, 8 N/2 m, 4 N/3 m.']}
      />
    </Shell>
  );
}

export function WorkPowerLab({ mode, onExplore }: Props) {
  const [mi, setMi] = useState(0),
    [ti, setTi] = useState(0),
    [finished, setFinished] = useState(false),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<string[]>([]);
  const masses = [2, 4],
    times = [4, 8],
    mass = masses[mi]!,
    duration = times[ti]!,
    cases = useComparisons(['0-0', '0-1', '1-0'], onExplore);
  const a = useAnimation(4, () => {
    setFinished(true);
    setProbe(8);
    const key = mi + '-' + ti;
    cases.record(key);
    setRecords((old) => [...new Set([...old, key])]);
  });
  const time = a.running ? a.time * 2 : finished ? 8 : probe,
    A = liftingSnapshot(2, 1, 8, time),
    Btask = liftingSnapshot(mass, 1, duration, time);
  const reset = () => {
    a.reset();
    setFinished(false);
    setProbe(0);
  };
  return (
    <Shell
      mode={mode}
      title={['同一个时钟，每台自己的任务', 'One clock, each hoist’s own task']}
      note={[
        '货物在抬升区间内匀速，g=10 N/kg，高度1 m；忽略启动、停止与损耗。画面以2倍速度播放，共观察8 s。完成后等待不计入该次抬升任务时间。功率是货物机械输出的任务平均值，不是电机输入或此刻瞬时功率。',
        'Steady lift intervals, g=10 N/kg, 1 m rise; start/stop transients and losses omitted. Two-times playback covers 8 s. Waiting after completion is excluded from each lift task. Displayed power is task-average mechanical output, not motor input or current instantaneous power.',
      ]}
    >
      <p className="phy-work-fixed">
        <B
          zh="A固定：2 kg · 1 m · 8 s · 20 J · 2.50 W"
          en="A fixed: 2 kg · 1 m · 8 s · 20 J · 2.50 W"
          mode={mode}
        />
      </p>
      <div className="phy-work-controls">
        <Options
          mode={mode}
          name={['B的质量', 'B mass']}
          values={masses.map((v, id) => ({ id, zh: v + ' kg', en: v + ' kg' }))}
          value={mi}
          disabled={a.running}
          set={(n) => {
            reset();
            setMi(n);
          }}
        />
        <Options
          mode={mode}
          name={['B的抬升用时', 'B lift duration']}
          values={times.map((v, id) => ({ id, zh: v + ' s', en: v + ' s' }))}
          value={ti}
          disabled={a.running}
          set={(n) => {
            reset();
            setTi(n);
          }}
        />
      </div>
      <div className="phy-work-grid">
        <svg
          className="phy-simulation phy-work-svg"
          viewBox="0 0 600 300"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Two hoists on one clock, stopping at their own completion'
              : '同一时钟下的两台升降机，各自完工后等待'
          }
        >
          <text x="300" y="22" textAnchor="middle" fontSize="23" fill="#8d729f">
            t = {num(time)} s
          </text>
          {[A, Btask].map((s, i) => (
            <g key={i}>
              <path
                d={`M${155 + i * 280} 65v175m-55 0h110m-110-175h110`}
                stroke="#d0c2db"
                strokeWidth="2"
              />
              <path
                d={`M${155 + i * 280} 65V${215 - 150 * s.raised}`}
                stroke={gold}
                strokeWidth="3"
              />
              <rect
                x={120 + i * 280}
                y={215 - 150 * s.raised}
                width="70"
                height="25"
                rx="5"
                fill={i ? gold : purple}
              />
              <text
                x={155 + i * 280}
                y={204 - 150 * s.raised}
                textAnchor="middle"
                fontSize="22"
                fill="#8d729f"
              >
                {s.mass} kg
              </text>
              <text
                x={155 + i * 280}
                y="278"
                textAnchor="middle"
                fontSize="22"
                fill="#8d729f"
              >
                {i ? 'B' : 'A'} · {j(s.doneWork)}
              </text>
            </g>
          ))}
        </svg>
        <div className="phy-work-power-cards">
          {[A, Btask].map((s, i) => (
            <div key={i}>
              <span className="phy-work-hoist-id">{i ? 'B' : 'A'}</span>
              <B
                zh="任务平均机械功率"
                en="Task-average mechanical power"
                mode={mode}
              />
              <strong>{num(s.power)} W</strong>
              <p>
                {j(s.work)} / {s.duration} s
              </p>
              <B
                zh={
                  s.finished ? '已完工；之后等待不属于抬升' : '该任务尚未完工'
                }
                en={
                  s.finished
                    ? 'Finished; later waiting is outside the lift'
                    : 'This task is not finished yet'
                }
                mode={mode}
              />
            </div>
          ))}
        </div>
      </div>
      <label className="phy-energy-probe">
        <span>
          <B zh="共同观察时钟" en="Shared observation clock" mode={mode} /> ·{' '}
          {num(time)} s
        </span>
        <input
          type="range"
          min="0"
          max="8"
          step="0.5"
          aria-label={mode === 'en' ? 'Observation time' : '观察时间'}
          disabled={a.running}
          value={time}
          onChange={(e) => {
            setFinished(false);
            setProbe(Number(e.target.value));
          }}
        />
      </label>
      <Action
        mode={mode}
        zh="完整比较两台升降机"
        en="Watch both complete lifts"
        running={a.running}
        onClick={() => {
          setFinished(false);
          setProbe(0);
          a.start();
        }}
      />
      <Table
        mode={mode}
        columns={[
          ['B质量', 'B mass'],
          ['B任务用时', 'B duration'],
          ['B完整功', 'B work'],
          ['B平均功率', 'B power'],
        ]}
        rows={records.map((key) => {
          const [m, t] = key.split('-').map(Number),
            s = liftingTask(masses[m!]!, 1, times[t!]!);
          return [
            s.mass + ' kg',
            s.duration + ' s',
            j(s.work),
            num(s.power) + ' W',
          ];
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        hint={[
          'B的2 kg/4 s、2 kg/8 s、4 kg/4 s；拖时钟不代替完整观察。',
          'B: 2 kg/4 s, 2 kg/8 s, 4 kg/4 s; seeking does not replace full observation.',
        ]}
      />
    </Shell>
  );
}

export function HumanPowerLab({ mode, onExplore }: Props) {
  const [mi, setMi] = useState(0),
    [hi, setHi] = useState(1),
    [ti, setTi] = useState(0),
    [records, setRecords] = useState<string[]>([]);
  const masses = [50, 60],
    heights = [2, 3],
    times = [10, 20],
    mass = masses[mi]!,
    height = heights[hi]!,
    time = times[ti]!,
    s = liftingTask(mass, height, time);
  const cases = useComparisons(['0-1-0', '0-1-1', '1-1-0', '0-0-0'], onExplore),
    top = 220 - (height / 3) * 135;
  return (
    <Shell
      mode={mode}
      title={[
        '用预设人物，练习mgh/t',
        'Practise mgh/t with a prescribed person',
      ]}
      note={[
        '这些是构造的教学数据，楼梯画法示意，不代表真实台阶数。g=10 N/kg，总质量包括携带物；高度是竖直起终点差，用时属于同一上升。忽略起终点动能差，估算上升机械输出，不计算化学能消耗或健康/体能评分。自己的重复读数可在探索路线的上楼功率调查中记录。',
        'Constructed teaching data; schematic stairs do not specify real step count. g=10 N/kg, total mass includes carried items; height is vertical endpoint difference and time belongs to that ascent. Endpoint kinetic differences are omitted. This estimates rising mechanical output, not chemical consumption or fitness. Record your repeated readings in the Stair Power investigation on the learning path.',
      ]}
    >
      <p className="phy-work-fixed">
        <B
          zh="预设数据 · 不是你的测量，也不是速度比赛。"
          en="Prescribed data · Not your measurements or a race."
          mode={mode}
        />
      </p>
      <div className="phy-work-controls">
        <Options
          mode={mode}
          name={['人物总质量', 'Total person mass']}
          values={masses.map((v, id) => ({ id, zh: v + ' kg', en: v + ' kg' }))}
          value={mi}
          set={setMi}
        />
        <Options
          mode={mode}
          name={['竖直升高', 'Vertical rise']}
          values={heights.map((v, id) => ({ id, zh: v + ' m', en: v + ' m' }))}
          value={hi}
          set={setHi}
        />
        <Options
          mode={mode}
          name={['同次上升用时', 'Same-ascent duration']}
          values={times.map((v, id) => ({ id, zh: v + ' s', en: v + ' s' }))}
          value={ti}
          set={setTi}
        />
      </div>
      <div className="phy-work-grid">
        <svg
          className="phy-simulation phy-work-svg"
          viewBox="0 0 600 280"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Schematic stairs; vertical height differs from sloping path'
              : '楼梯示意，竖直高度与斜向路程不同'
          }
        >
          <path
            d={
              'M60 220' +
              Array.from({ length: 6 }, () => `h65v${-(220 - top) / 6}`).join(
                '',
              ) +
              'h40'
            }
            fill="none"
            stroke={purple}
            strokeWidth="3"
          />
          <path
            d={`M60 220L450 ${top}`}
            stroke={gold}
            strokeDasharray="7 6"
            strokeWidth="2"
          />
          <Arrow x={535} y={220} dx={0} dy={top - 220} color={green} />
          <text x="490" y="25" textAnchor="middle" fontSize="23" fill="#74998b">
            h={height} m
          </text>
          <circle cx="472" cy={top - 50} r="11" fill={gold} />
          <path
            d={`M472 ${top - 39}v23m0-9-17 10m17-10 17 10m-17 9-12 16m12-16 12 16`}
            stroke={gold}
            strokeWidth="4"
            fill="none"
          />
          <text
            x="270"
            y="267"
            textAnchor="middle"
            fontSize="22"
            fill="#8d729f"
          >
            m = {mass} kg · t = {time} s
          </text>
        </svg>
        <div className="phy-work-result">
          <Metric
            mode={mode}
            title={['上升机械功率估算', 'Rise-mechanical power estimate']}
          >
            {num(s.power)} W
          </Metric>
          <div className="phy-work-calculation">
            <span>
              {mass} × 10 × {height}
            </span>
            <strong>{j(s.work)}</strong>
            <span>÷ {time} s</span>
            <strong>{num(s.power)} W</strong>
          </div>
          <p>
            <B
              zh="先得出能量，再除以同一次的时间。竖直高度不是楼梯斜长。"
              en="Find energy, then divide by this ascent’s time. Vertical rise is not sloping stair length."
              mode={mode}
            />
          </p>
        </div>
      </div>
      <Action
        mode={mode}
        zh="记录这组教学估算"
        en="Record this teaching estimate"
        onClick={() => {
          const key = mi + '-' + hi + '-' + ti;
          cases.record(key);
          setRecords((old) => [...new Set([...old, key])]);
        }}
      />
      <Table
        mode={mode}
        columns={[
          ['m', 'm'],
          ['h', 'h'],
          ['t', 't'],
          ['势能增加', 'Energy Δ'],
          ['功率估算', 'Power estimate'],
        ]}
        rows={records.map((key) => {
          const [m, h, t] = key.split('-').map(Number),
            v = liftingTask(masses[m!]!, heights[h!]!, times[t!]!);
          return [
            v.mass + ' kg',
            v.height + ' m',
            v.duration + ' s',
            j(v.work),
            num(v.power) + ' W',
          ];
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        hint={[
          '基线，只改时间，只改质量，只改高度。',
          'Baseline, change only time, only mass, only rise.',
        ]}
      />
    </Shell>
  );
}

const rampNames: Label[] = [
  ['理想直提', 'Ideal direct lift'],
  ['理想短坡', 'Ideal short ramp'],
  ['理想长坡', 'Ideal long ramp'],
  ['粗糙长坡', 'Rough long ramp'],
];
export function RampMachineLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    [finished, setFinished] = useState(false),
    [records, setRecords] = useState<number[]>([]);
  const s = rampTask(2, 1, [1, 2, 4, 4][choice]!, choice === 3 ? 2 : 0),
    cases = useComparisons(['0', '1', '2', '3'], onExplore);
  const a = useAnimation(2, () => {
    setFinished(true);
    cases.record(String(choice));
    setRecords((old) => [...new Set([...old, choice])]);
  });
  const p = a.running ? a.time / 2 : finished ? 1 : 0,
    run = s.horizontal * 95,
    rise = 95,
    x = 100 + run * p,
    y = 225 - rise * p,
    angle = (-Math.atan2(rise, run) * 180) / Math.PI;
  return (
    <Shell
      mode={mode}
      title={['省力与多走距离的交换', 'Trade force for more travel']}
      note={[
        '2 kg非转动货物，g=10 N/kg，升高1 m。沿路径匀速，省略启动、停止；拉力平行路径，另有重力与斜面支持力。粗糙例规定恒定2 N摩擦，并非相同材料随坡度的实测阻力。多余输入成为货物和坡道内能增加，忽略其他去向。2 s播放只是示意，不能据此算功率。',
        'Nonrotating 2 kg load, g=10 N/kg, 1 m rise. Steady along-path motion with start/stop omitted; pulling aligns with the path, alongside gravity and ramp support. Rough case prescribes constant 2 N friction, not measured resistance for a material at different slopes. Extra input becomes load-plus-ramp internal increase; other transfers omitted. Two-second playback is illustrative and cannot determine power.',
      ]}
    >
      <Options
        mode={mode}
        name={['路径与阻力', 'Path and resistance']}
        values={rampNames.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={a.running}
        set={(n) => {
          a.reset();
          setFinished(false);
          setChoice(n);
        }}
      />
      <div className="phy-work-grid">
        <svg
          className="phy-simulation phy-work-svg"
          viewBox="0 0 600 290"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Same load and rise, changed path length and along-path force'
              : '相同货物与升高，不同路径长度和沿路径拉力'
          }
        >
          <path d="M50 225h500" stroke="#d1c5db" strokeWidth="2" />
          {choice !== 0 && (
            <path
              d={`M100 225L${100 + run} 130V225Z`}
              fill={choice === 3 ? '#e2ebe5' : '#eee5d6'}
              stroke="#c6b3d1"
              strokeWidth="3"
            />
          )}
          {choice === 0 && (
            <path
              d="M100 225V130"
              stroke={gold}
              strokeWidth="3"
              strokeDasharray="6 5"
            />
          )}
          {choice === 3 && (
            <path
              d={`M100 225L${100 + run} 130`}
              stroke={green}
              strokeWidth="5"
              strokeDasharray="9 10"
            />
          )}
          <g
            transform={`translate(${x},${y}) rotate(${choice === 0 ? 0 : angle})`}
          >
            <rect x="-17" y="-27" width="34" height="27" rx="4" fill={purple} />
          </g>
          <Arrow
            x={x + 15}
            y={y - 42}
            dx={Math.cos((angle * Math.PI) / 180) * 65}
            dy={Math.sin((angle * Math.PI) / 180) * 65}
            color={gold}
          />
          <Arrow x={540} y={225} dx={0} dy={-95} color={green} />
          <text
            x="515"
            y="110"
            textAnchor="middle"
            fill="#74998b"
            fontSize="22"
          >
            h=1 m
          </text>
          <text x="300" y="32" textAnchor="middle" fill="#8d729f" fontSize="24">
            F={num(s.force)} N · m=2 kg
          </text>
          <text
            x="300"
            y="275"
            textAnchor="middle"
            fill="#a68b60"
            fontSize="23"
          >
            L={s.length} m · FL={num(s.input)} J
          </text>
        </svg>
        <EnergyBars
          mode={mode}
          scale={28}
          rows={[
            { label: ['输入功', 'Input work'], value: s.input, color: gold },
            {
              label: ['有用势能增加', 'Useful gravitational increase'],
              value: s.useful,
              color: purple,
            },
            {
              label: ['货物+坡道内能增加', 'Load + ramp internal increase'],
              value: s.thermal,
              color: green,
            },
          ]}
        />
      </div>
      <p className="phy-energy-total">
        <B
          zh="输入=有用势能增加+内能增加"
          en="Input = useful gravitational increase + internal increase"
          mode={mode}
        />{' '}
        · {j(s.input)} = {j(s.useful)} + {j(s.thermal)}
      </p>
      <p className="phy-work-fixed">
        <B
          zh="同一升高任务的效率"
          en="Efficiency for the same rise task"
          mode={mode}
        />{' '}
        · {(s.efficiency * 100).toFixed(1)}%
      </p>
      <p className="phy-work-fixed">
        <B
          zh="数值描述完整搬运任务；播放只示意路径。"
          en="Values describe the complete task; playback illustrates the path."
          mode={mode}
        />
      </p>
      <Action
        mode={mode}
        zh="完整观察这条路径"
        en="Watch this complete path"
        running={a.running}
        onClick={() => {
          setFinished(false);
          a.start();
        }}
      />
      <Table
        mode={mode}
        columns={[
          ['路径', 'Path'],
          ['F', 'F'],
          ['L', 'L'],
          ['输入功', 'Input work'],
          ['内能增加', 'Internal Δ'],
        ]}
        rows={records.map((n) => {
          const r = rampTask(2, 1, [1, 2, 4, 4][n]!, n === 3 ? 2 : 0);
          return [
            <B zh={rampNames[n]![0]} en={rampNames[n]![1]} mode={mode} />,
            num(r.force) + ' N',
            r.length + ' m',
            j(r.input),
            j(r.thermal),
          ];
        })}
      />
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        hint={[
          '理想直提、短坡、长坡，再比较粗糙长坡。',
          'Ideal direct, short, long; then rough long ramp.',
        ]}
      />
    </Shell>
  );
}
