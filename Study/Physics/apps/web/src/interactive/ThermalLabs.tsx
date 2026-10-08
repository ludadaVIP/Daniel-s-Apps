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
import { EnergyBars } from './EnergyBars';
import {
  gasComparison,
  gasDots,
  waterHeating,
  cupCases,
  cupSnapshot,
  wetSurface,
  transferPaths,
} from './thermalModels';
type Label = [string, string];
const gold = '#c7a375',
  purple = '#a38bbb',
  green = '#98b7a8';
const n = (v: number) => (Math.abs(v) < 1e-8 ? 0 : v).toFixed(2);
const j = (v: number) => n(v) + ' J';
function Shell({
  mode,
  title,
  note,
  children,
}: Props & { title: Label; note: Label; children: ReactNode }) {
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">THERMAL / FOLLOW THE TRANSFER</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学模型 · 条件、尺度与能量去向都要一起看。"
          en="Teaching model · Read conditions, scales and energy destinations together."
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
function Table({
  mode,
  columns,
  rows,
}: {
  mode: LanguageMode;
  columns: Label[];
  rows: { id: number; cells: ReactNode[] }[];
}) {
  if (!rows.length) return null;
  return (
    <div className="phy-data-table-wrap">
      <table className="phy-data-table">
        <caption>
          <B
            zh="保留教学比较 · 原因要结合条件解释"
            en="Retain teaching comparisons · Explain with their conditions"
            mode={mode}
          />
        </caption>
        <thead>
          <tr>
            {columns.map(([zh, en]) => (
              <th key={en} scope="col">
                {zh === en ? zh : <B zh={zh} en={en} mode={mode} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {r.cells.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={i}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function useRun(
  choice: number,
  onExplore: Props['onExplore'],
  duration = 2,
  onEnd?: () => void,
) {
  const [finished, setFinished] = useState(false),
    [records, setRecords] = useState<number[]>([]),
    gate = useComparisons(['0', '1', '2'], onExplore);
  const a = useAnimation(duration, () => {
    setFinished(true);
    setRecords((old) => [...new Set([...old, choice])]);
    gate.record(String(choice));
    onEnd?.();
  });
  return {
    a,
    records,
    count: gate.count,
    phase: a.running ? a.time / duration : finished ? 1 : 0,
    start: () => {
      setFinished(false);
      a.start();
    },
    reset: () => {
      setFinished(false);
      a.reset();
    },
  };
}
function Action({
  mode,
  run,
}: {
  mode: LanguageMode;
  run: ReturnType<typeof useRun>;
}) {
  return (
    <button className="phy-button" disabled={run.a.running} onClick={run.start}>
      <B
        zh={run.a.running ? '观察中…' : '完整观察这组条件'}
        en={run.a.running ? 'Observing…' : 'Observe this complete case'}
        mode={mode}
      />
    </button>
  );
}
function Progress({ mode, count }: Props & { count: number }) {
  return (
    <p className="phy-force-record" role="status">
      <B
        zh={`已比较 ${count}/3：三组完整观察后，带着证据继续。`}
        en={`Compared ${count}/3: complete all three cases, then continue with evidence.`}
        mode={mode}
      />
    </p>
  );
}
const gasCases = [
  { temperature: 20, amount: 1 as const },
  { temperature: 60, amount: 1 as const },
  { temperature: 20, amount: 2 as const },
];
const gasLabels: Label[] = [
  ['小份20℃', 'Small, 20°C'],
  ['小份60℃', 'Small, 60°C'],
  ['两倍份量20℃', 'Double amount, 20°C'],
];
export function ThermalParticlesLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    c = gasCases[choice]!,
    value = gasComparison(c.temperature, c.amount),
    run = useRun(choice, onExplore);
  return (
    <Shell
      mode={mode}
      title={['同温与同内能，是两件事', 'Same temperature, different energy']}
      note={[
        '同种理想单原子气体，只追踪微观动能，忽略粒子相互作用。温度均匀；点数仅示意份量，轨迹、大小与播放时间不是真实微观尺度。各份使用相同的初始速度分布，升温按绝对温度缩放。相对内能以小份20℃为1，没有焦耳单位，不用于真实水或金属。',
        'Same ideal monatomic gas; microscopic kinetic energy only, no interactions. Uniform temperature; dot count illustrates amount, and trajectories, sizes and playback are not physical microscopic scales. Portions share an initial velocity distribution scaled by absolute temperature. Relative internal energy sets small 20°C to 1; it has no joule unit and does not predict real water/metals.',
      ]}
    >
      <Options
        mode={mode}
        name={['温度与份量', 'Temperature and amount']}
        values={gasLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
        disabled={run.a.running}
      />
      <div className="phy-thermal-grid">
        <svg
          className="phy-simulation phy-thermal-svg"
          viewBox="0 0 600 280"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Schematic random gas motion at a given temperature and amount'
              : '规定温度和份量的气体微观运动示意'
          }
        >
          <rect
            x="75"
            y="45"
            width="450"
            height="185"
            rx="14"
            fill="#f5f0f8"
            stroke="#c7b7d3"
            strokeWidth="2"
          />
          {gasDots(c.temperature, c.amount, run.phase).map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="8"
              fill={c.temperature === 60 ? gold : purple}
            />
          ))}
          <text x="300" y="28" textAnchor="middle" fill="#8e76a0" fontSize="24">
            {c.temperature}°C · ×{c.amount}
          </text>
          <text
            x="300"
            y="268"
            textAnchor="middle"
            fill="#a48b66"
            fontSize="23"
          >
            {value.kelvin.toFixed(2)} K
          </text>
        </svg>
        <div className="phy-thermal-readout">
          <Metric mode={mode} title={['温度', 'Temperature']}>
            {c.temperature} °C
          </Metric>
          <Metric
            mode={mode}
            title={[
              '相对内能（无单位）',
              'Relative internal energy (unitless)',
            ]}
          >
            {n(value.relativeInternal)}
          </Metric>
          <p>
            <B
              zh="基准：小份20℃的相对内能为1。不是摄氏读数直接相乘。"
              en="Baseline: small 20°C has relative energy 1. Do not multiply Celsius readings directly."
              mode={mode}
            />
          </p>
        </div>
      </div>
      <Action mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['条件', 'Case'],
          ['温度', 'Temperature'],
          ['份量', 'Amount'],
          ['相对内能', 'Relative energy'],
        ]}
        rows={run.records.map((id) => ({
          id,
          cells: [
            <B
              key="name"
              zh={gasLabels[id]![0]}
              en={gasLabels[id]![1]}
              mode={mode}
            />,
            gasCases[id]!.temperature + ' °C',
            '×' + gasCases[id]!.amount,
            n(
              gasComparison(gasCases[id]!.temperature, gasCases[id]!.amount)
                .relativeInternal,
            ),
          ],
        }))}
      />
      <Progress mode={mode} count={run.count} />
    </Shell>
  );
}
const heatingCases = [
  { mass: 0.1, input: 840 },
  { mass: 0.2, input: 840 },
  { mass: 0.1, input: 1680 },
];
export function ThermalHeatingLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    c = heatingCases[choice]!,
    run = useRun(choice, onExplore),
    v = waterHeating(c.mass, c.input * run.phase);
  return (
    <Shell
      mode={mode}
      title={['同一份能量，升温多少？', 'One energy input, how much rise?']}
      note={[
        '同种液态水，均匀温度，初温20℃，c=4200 J/(kg·℃)。输入已是被水吸收的能量；无杯体储能、向外散失、蒸发、相变或机械做功。播放2 s只示意输入进度，不是实际加热时间。输入和内能增加是同一能量的两种描述，不能相加。',
        'Same liquid water, uniform temperature, initially 20°C, c=4200 J/(kg·°C). Input means absorbed energy; container storage, outward loss, evaporation, phase change and mechanical work are omitted. Two-second playback illustrates input progress, not actual heating time. Input and internal increase describe the same energy; do not add them.',
      ]}
    >
      <Options
        mode={mode}
        name={['只改一个量', 'Change one quantity']}
        values={heatingCases.map((v, id) => ({
          id,
          zh: `${v.mass * 1000} g · ${v.input} J`,
          en: `${v.mass * 1000} g · ${v.input} J`,
        }))}
        value={choice}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
        disabled={run.a.running}
      />
      <div className="phy-thermal-grid">
        <svg
          className="phy-simulation phy-thermal-svg"
          viewBox="0 0 600 280"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Water sample and thermometer on a fixed 20 to 26 Celsius scale'
              : '水样与固定20至26℃刻度温度计'
          }
        >
          <path
            d="M90 45v185h170V45"
            fill="none"
            stroke="#b4a0c1"
            strokeWidth="3"
          />
          <rect
            x="94"
            y={228 - c.mass * 700}
            width="162"
            height={c.mass * 700}
            fill="#c4d9dd"
          />
          <text x="175" y="30" textAnchor="middle" fill="#8e76a0" fontSize="24">
            {c.mass * 1000} g
          </text>
          <path
            d="M120 250h110m-55 0v-25m-6 7 6-7 6 7"
            stroke={gold}
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="405"
            y="45"
            width="20"
            height="185"
            rx="9"
            fill="#e8dee8"
            stroke="#b8a3be"
          />
          <rect
            x="409"
            y={225 - (v.rise / 6) * 170}
            width="12"
            height={(v.rise / 6) * 170 + 8}
            rx="5"
            fill={gold}
          />
          <circle cx="415" cy="245" r="17" fill={gold} />
          {[20, 22, 24, 26].map((t) => (
            <g key={t}>
              <path
                d={`M430 ${225 - ((t - 20) / 6) * 170}h10`}
                stroke="#b6a0c0"
              />
              <text
                x="447"
                y={232 - ((t - 20) / 6) * 170}
                fontSize="23"
                fill="#8e76a0"
              >
                {t}°C
              </text>
            </g>
          ))}
        </svg>
        <EnergyBars
          mode={mode}
          scale={1680}
          rows={[
            {
              label: ['已吸收输入', 'Absorbed input'],
              value: v.internalIncrease,
              color: gold,
            },
            {
              label: ['水的内能增加', 'Water internal increase'],
              value: v.internalIncrease,
              color: purple,
            },
          ]}
        />
      </div>
      <div className="phy-thermal-metrics">
        <Metric mode={mode} title={['当前温度', 'Current temperature']}>
          {n(v.temperature)} °C
        </Metric>
        <Metric mode={mode} title={['温度增加ΔT', 'Temperature rise ΔT']}>
          {n(v.rise)} °C
        </Metric>
      </div>
      <p className="phy-thermal-note">
        <B
          zh="输入进度只是示意；能量条两行描述同一份能量，不能相加。"
          en="Input progress is illustrative; the two bars describe the same energy and must not be added."
          mode={mode}
        />
      </p>
      <Action mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['质量', 'Mass'],
          ['吸收Q', 'Absorbed Q'],
          ['温升', 'Rise'],
          ['末温', 'Final temperature'],
        ]}
        rows={run.records.map((id) => {
          const c = heatingCases[id]!,
            v = waterHeating(c.mass, c.input);
          return {
            id,
            cells: [
              c.mass * 1000 + ' g',
              c.input + ' J',
              n(v.rise) + ' °C',
              n(v.temperature) + ' °C',
            ],
          };
        })}
      />
      <Progress mode={mode} count={run.count} />
    </Shell>
  );
}
const pathLabels: Label[] = [
  ['传导', 'Conduction'],
  ['对流', 'Convection'],
  ['辐射', 'Radiation'],
];
export function ThermalPathsLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    run = useRun(choice, onExplore),
    path = transferPaths[choice]!,
    p = run.phase;
  const loop = [
    [220, 210],
    [220, 85],
    [375, 85],
    [375, 210],
  ];
  return (
    <Shell
      mode={mode}
      title={['能量怎样来到这里？', 'How does energy get here?']}
      note={[
        '定性路径图，不预测功率或真实升温时间；2 s巡查只帮助观察。传导图是静止固体，局部粒子运动而没有整体迁移。对流图在重力下从下方加热，圆点代表流体团块，不是放大的分子；其他加热位置可形成不同流动。辐射图有真空间隙，两物体都发射与吸收，净传递从较热到较冷。箭头长度不表示功率；真实系统常同时有多条通路。',
        'Qualitative pathways, not power or real warm-up predictions; two-second inspection aids observation. Conduction has stationary solid material with local particle motion. Convection heats from below under gravity; dots are fluid parcels, not enlarged molecules, and other heating positions can change flow. Radiation crosses vacuum; both objects emit/absorb with hotter-to-colder net transfer. Arrow length is not power; real systems often combine routes.',
      ]}
    >
      <Options
        mode={mode}
        name={['寻找传递通路', 'Find a transfer route']}
        values={pathLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
        disabled={run.a.running}
      />
      <svg
        className="phy-simulation phy-thermal-svg phy-thermal-path-svg"
        viewBox="0 0 600 280"
        role="img"
        aria-label={
          mode === 'en'
            ? `${pathLabels[choice]![1]} schematic energy pathway`
            : `${pathLabels[choice]![0]}的能量传递示意`
        }
      >
        {choice === 0 ? (
          <g>
            <rect
              x="75"
              y="75"
              width="450"
              height="120"
              rx="18"
              fill="#e2d6e9"
            />
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={100 + (i % 6) * 80 + Math.sin(p * 18 + i) * 3}
                cy={110 + Math.floor(i / 6) * 50 + Math.cos(p * 18 + i) * 3}
                r="11"
                fill={i % 6 < 3 ? gold : purple}
              />
            ))}
            <path
              d={`M95 225h${390 * p}`}
              stroke={gold}
              strokeWidth="4"
              fill="none"
            />
            <text
              x="125"
              y="45"
              textAnchor="middle"
              fill="#a08660"
              fontSize="24"
            >
              {mode === 'en' ? 'Hotter' : '较热端'}
            </text>
            <text
              x="470"
              y="45"
              textAnchor="middle"
              fill="#8e76a0"
              fontSize="24"
            >
              {mode === 'en' ? 'Cooler' : '较冷端'}
            </text>
            <text
              x="300"
              y="268"
              textAnchor="middle"
              fill="#8e76a0"
              fontSize="23"
            >
              {mode === 'en' ? 'No bulk solid movement' : '固体没有整体迁移'}
            </text>
          </g>
        ) : choice === 1 ? (
          <g>
            <rect
              x="180"
              y="45"
              width="240"
              height="185"
              rx="10"
              fill="#d9e6e7"
              stroke="#b5cad0"
            />
            <path
              d="M220 210V85h155v125H220"
              fill="none"
              stroke="#b6cbd2"
              strokeDasharray="5 6"
              strokeWidth="3"
            />
            <path
              d="m212 105 8-12 8 12m139 79 8 12 8-12"
              stroke={gold}
              strokeWidth="4"
              fill="none"
            />
            {[0, 0.25, 0.5, 0.75].map((offset, i) => {
              const t = ((p + offset) % 1) * 4,
                from = loop[Math.floor(t)]!,
                to = loop[(Math.floor(t) + 1) % 4]!,
                f = t % 1;
              return (
                <circle
                  key={i}
                  cx={from[0]! + (to[0]! - from[0]!) * f}
                  cy={from[1]! + (to[1]! - from[1]!) * f}
                  r="12"
                  fill={from[0] === 220 ? gold : purple}
                />
              );
            })}
            <path
              d="M195 250h55m-27 0v-16m-7 8 7-8 7 8"
              fill="none"
              stroke={gold}
              strokeWidth="4"
            />
            <text
              x="95"
              y="90"
              textAnchor="middle"
              fontSize="22"
              fill="#a08660"
            >
              {mode === 'en' ? 'Warmer ↑' : '较暖 ↑'}
            </text>
            <text
              x="500"
              y="202"
              textAnchor="middle"
              fontSize="22"
              fill="#8e76a0"
            >
              {mode === 'en' ? 'Cooler ↓' : '较冷 ↓'}
            </text>
          </g>
        ) : (
          <g>
            <circle cx="95" cy="145" r="48" fill="#e5cd9f" />
            <circle cx="505" cy="145" r="48" fill="#d5c7df" />
            <path
              d="M155 112h280m-12-9 12 9-12 9"
              fill="none"
              stroke={gold}
              strokeWidth="5"
              strokeDasharray="10 6"
              opacity={0.4 + 0.6 * p}
            />
            <path
              d="M450 177H168m12-8-12 8 12 8"
              fill="none"
              stroke={purple}
              strokeWidth="3"
              strokeDasharray="10 6"
            />
            <text
              x="300"
              y="68"
              textAnchor="middle"
              fill="#8e76a0"
              fontSize="24"
            >
              {mode === 'en' ? 'Vacuum gap' : '真空间隙'}
            </text>
            <text
              x="95"
              y="230"
              textAnchor="middle"
              fill="#a08660"
              fontSize="24"
            >
              {mode === 'en' ? 'Hotter' : '较热'}
            </text>
            <text
              x="505"
              y="230"
              textAnchor="middle"
              fill="#8e76a0"
              fontSize="24"
            >
              {mode === 'en' ? 'Cooler' : '较冷'}
            </text>
          </g>
        )}
      </svg>
      <div className="phy-thermal-metrics">
        <Metric
          mode={mode}
          title={['物质整体流动携能', 'Bulk matter flow carrying energy']}
        >
          <B
            zh={path.movingMatter ? '有' : '不要求'}
            en={path.movingMatter ? 'Yes' : 'Not required'}
            mode={mode}
          />
        </Metric>
        <Metric
          mode={mode}
          title={['这条通路需要物质', 'This route requires matter']}
        >
          <B
            zh={path.requiresMatter ? '是' : '否，可跨真空'}
            en={path.requiresMatter ? 'Yes' : 'No, crosses vacuum'}
            mode={mode}
          />
        </Metric>
      </div>
      <p className="phy-thermal-note">
        <B
          zh="箭头表示通路，长度不是功率；辐射图两物体都在发射和吸收。"
          en="Arrows show routes, not power magnitudes; both radiation bodies emit and absorb."
          mode={mode}
        />
      </p>
      <Action mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['通路', 'Route'],
          ['整体流动', 'Bulk flow'],
          ['需要介质', 'Needs matter'],
        ]}
        rows={run.records.map((id) => ({
          id,
          cells: [
            <B
              key="name"
              zh={pathLabels[id]![0]}
              en={pathLabels[id]![1]}
              mode={mode}
            />,
            <B
              key="flow"
              zh={transferPaths[id]!.movingMatter ? '有' : '不要求'}
              en={transferPaths[id]!.movingMatter ? 'Yes' : 'Not required'}
              mode={mode}
            />,
            <B
              key="medium"
              zh={transferPaths[id]!.requiresMatter ? '是' : '否'}
              en={transferPaths[id]!.requiresMatter ? 'Yes' : 'No'}
              mode={mode}
            />,
          ],
        }))}
      />
      <Progress mode={mode} count={run.count} />
    </Shell>
  );
}
const cupLabels: Label[] = [
  ['热水/冷房', 'Hot water/cool room'],
  ['热水/暖房', 'Hot water/warm room'],
  ['冷水/暖房', 'Cold water/warm room'],
];
export function ThermalCupsLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    [probe, setProbe] = useState(0),
    run = useRun(choice, onExplore, 2.5, () => setProbe(600)),
    seconds = run.a.running ? run.phase * 600 : probe,
    c = cupCases[choice]!,
    v = cupSnapshot(choice, seconds);
  const points = (wrapped: boolean) =>
    Array.from({ length: Math.max(2, Math.ceil(seconds / 10) + 1) }, (_, i) => {
      const t = (seconds * i) / (Math.max(2, Math.ceil(seconds / 10) + 1) - 1),
        v = cupSnapshot(choice, t);
      return `${60 + (t / 600) * 480},${250 - ((wrapped ? v.wrapped.temperature : v.bare.temperature) / 60) * 210}`;
    }).join(' ');
  return (
    <Shell
      mode={mode}
      title={['减慢交换，不制造能量', 'Slower exchange, no created energy']}
      note={[
        '100 g水，热容量420 J/℃，均匀温度。房间温度固定，无杯体储能、蒸发或相变；规定综合传热参数裸杯0.70、包裹0.14 W/℃，是教学参数，不是某材料或真实杯子的测量。10 min模型在2.5 s播放（240倍）；图固定0–60℃和0–10 min。滑块巡查不算完整观察。',
        '100 g water, capacity 420 J/°C, uniform temperature. Fixed-temperature room; container storage, evaporation and phase changes omitted. Prescribed overall conductance is 0.70 bare and 0.14 wrapped W/°C, not a measured material/cup property. Ten model minutes play in 2.5 s (240×); fixed axes 0–60°C and 0–10 min. Seeking does not complete observation.',
      ]}
    >
      <Options
        mode={mode}
        name={['水与房间的初始条件', 'Water and room conditions']}
        values={cupCases.map((c, id) => ({
          id,
          zh: `${c.initial}℃水 · ${c.ambient}℃房间`,
          en: `Water ${c.initial}°C · room ${c.ambient}°C`,
        }))}
        value={choice}
        set={(id) => {
          run.reset();
          setProbe(0);
          setChoice(id);
        }}
        disabled={run.a.running}
      />
      <div className="phy-thermal-legend">
        <span style={{ color: gold }}>
          <B zh="裸杯" en="Bare cup" mode={mode} />
        </span>
        <span style={{ color: purple }}>
          <B zh="包裹杯" en="Wrapped cup" mode={mode} />
        </span>
        <span style={{ color: green }}>
          <B zh="房间温度" en="Room temperature" mode={mode} />
        </span>
      </div>
      <svg
        className="phy-simulation phy-thermal-svg"
        viewBox="0 0 600 305"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Water temperature versus elapsed model time; fixed shared axes'
            : '固定共同刻度的水温随模型时间变化图'
        }
      >
        <path d="M60 40V250H540" fill="none" stroke="#b3a1be" strokeWidth="2" />
        {[0, 20, 40, 60].map((t) => (
          <g key={t}>
            <path
              d={`M60 ${250 - (t / 60) * 210}H540`}
              stroke="#e1d7e7"
              strokeDasharray="4 6"
            />
            <text
              x="50"
              y={257 - (t / 60) * 210}
              textAnchor="end"
              fontSize="23"
              fill="#8e76a0"
            >
              {t}
            </text>
          </g>
        ))}
        {[0, 5, 10].map((t) => (
          <text
            key={t}
            x={60 + t * 48}
            y="277"
            textAnchor="middle"
            fontSize="23"
            fill="#8e76a0"
          >
            {t}
          </text>
        ))}
        <text x="14" y="24" fontSize="23" fill="#8e76a0">
          T/°C
        </text>
        <text x="350" y="302" fontSize="23" fill="#8e76a0">
          t/min
        </text>
        <path
          d={`M60 ${250 - (c.ambient / 60) * 210}H540`}
          stroke={green}
          strokeDasharray="9 5"
          strokeWidth="3"
        />
        <polyline
          points={points(false)}
          stroke={gold}
          strokeWidth="4"
          fill="none"
        />
        <polyline
          points={points(true)}
          stroke={purple}
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={60 + (seconds / 600) * 480}
          cy={250 - (v.bare.temperature / 60) * 210}
          r="6"
          fill={gold}
        />
        <circle
          cx={60 + (seconds / 600) * 480}
          cy={250 - (v.wrapped.temperature / 60) * 210}
          r="6"
          fill={purple}
        />
      </svg>
      <label className="phy-energy-probe">
        <span>
          <B zh="模型经过时间" en="Elapsed model time" mode={mode} /> ·{' '}
          {n(seconds / 60)} min
        </span>
        <input
          type="range"
          min="0"
          max="600"
          step="10"
          aria-label={mode === 'en' ? 'Elapsed model time' : '模型经过时间'}
          value={seconds}
          disabled={run.a.running}
          onChange={(e) => setProbe(Number(e.target.value))}
        />
      </label>
      <div className="phy-thermal-metrics">
        <Metric mode={mode} title={['裸杯水温', 'Bare water temperature']}>
          {n(v.bare.temperature)} °C
        </Metric>
        <Metric mode={mode} title={['包裹杯水温', 'Wrapped water temperature']}>
          {n(v.wrapped.temperature)} °C
        </Metric>
        <Metric
          mode={mode}
          title={['裸杯水内能变化', 'Bare water internal change']}
        >
          {j(v.bare.internalChange)}
        </Metric>
        <Metric
          mode={mode}
          title={['包裹杯水内能变化', 'Wrapped water internal change']}
        >
          {j(v.wrapped.internalChange)}
        </Metric>
      </div>
      <p className="phy-thermal-note">
        <B
          zh="负值表示水内能减少，正值表示增加；周围的净变化与水相反。"
          en="Negative means water internal energy decreases; positive means it increases. The surroundings have the opposite net change."
          mode={mode}
        />
      </p>
      <button
        className="phy-button"
        disabled={run.a.running}
        onClick={() => {
          setProbe(0);
          run.start();
        }}
      >
        <B
          zh={run.a.running ? '观察中…' : '完整观察这组10 min过程'}
          en={
            run.a.running
              ? 'Observing…'
              : 'Observe this complete ten-minute case'
          }
          mode={mode}
        />
      </button>
      <Table
        mode={mode}
        columns={[
          ['初始条件', 'Initial case'],
          ['裸杯末温', 'Bare final'],
          ['包裹末温', 'Wrapped final'],
        ]}
        rows={run.records.map((id) => {
          const v = cupSnapshot(id, 600);
          return {
            id,
            cells: [
              <B
                key="name"
                zh={cupLabels[id]![0]}
                en={cupLabels[id]![1]}
                mode={mode}
              />,
              n(v.bare.temperature) + ' °C',
              n(v.wrapped.temperature) + ' °C',
            ],
          };
        })}
      />
      <Progress mode={mode} count={run.count} />
    </Shell>
  );
}
const wetRates = [0, 0.1, 0.2];
export function ThermalWetLab({ mode, onExplore }: Props) {
  const [choice, setChoice] = useState(0),
    run = useRun(choice, onExplore, 2.5),
    v = wetSurface(wetRates[choice]!, run.phase * 300);
  return (
    <Shell
      mode={mode}
      title={[
        '蒸发与补充，可以同时发生',
        'Evaporation and replenishment coexist',
      ]}
      note={[
        '5 min内始终湿润，初水2 g、初温和房间20℃。规定净蒸发率0/0.10/0.20 g/min；表面等效热容量固定200 J/℃，室内传热参数固定0.50 W/℃，汽化所需能量近似2400 J/g，忽略少量失水对热容量的改变。速率不是风速或湿度模型；真实气流也改变对流。零值表示净平衡，不表示无单个粒子离开。播放2.5 s（120倍），粒子与箭头只示意过程，不预测人体或干燥阶段。',
        'Surface stays wet for five minutes, initially 2 g water at room/surface 20°C. Prescribed net rate 0/0.10/0.20 g/min; fixed effective capacity 200 J/°C, room conductance 0.50 W/°C and approximate vaporisation energy 2400 J/g, neglecting the capacity change from small water loss. This is not a wind/humidity model; real airflow changes convection too. Zero denotes net equilibrium, not no individual escape. Playback is 2.5 s (120×); dots/arrows illustrate processes, not personal cooling or the dry stage.',
      ]}
    >
      <Options
        mode={mode}
        name={[
          '规定净蒸发率，其余参数相同',
          'Prescribed net rate, other parameters matched',
        ]}
        values={wetRates.map((v, id) => ({
          id,
          zh: v.toFixed(2) + ' g/min',
          en: v.toFixed(2) + ' g/min',
        }))}
        value={choice}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
        disabled={run.a.running}
      />
      <svg
        className="phy-simulation phy-thermal-svg"
        viewBox="0 0 600 285"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Wet surface loses energy to vaporisation while receiving energy from warmer room'
            : '湿表面汽化需要能量，同时较暖房间补充能量'
        }
      >
        <rect x="70" y="45" width="210" height="55" rx="10" fill="#eee7f3" />
        <text x="175" y="79" textAnchor="middle" fontSize="24" fill="#8e76a0">
          {mode === 'en' ? 'Vapour' : '水蒸气'}
        </text>
        <rect x="350" y="45" width="210" height="55" rx="10" fill="#eee6d5" />
        <text x="455" y="79" textAnchor="middle" fontSize="24" fill="#a48b66">
          {mode === 'en' ? 'Room 20°C' : '房间20℃'}
        </text>
        <path
          d="M215 198V110m-7 10 7-10 7 10"
          stroke={purple}
          strokeWidth="4"
          fill="none"
          opacity={choice === 0 ? 0.2 : 0.6 + 0.4 * run.phase}
        />
        <path
          d="M425 110v88m-7-10 7 10 7-10"
          stroke={gold}
          strokeWidth="4"
          fill="none"
          opacity={v.roomIn > 0 ? 1 : 0.2}
        />
        <rect x="140" y="205" width="320" height="35" rx="7" fill="#bcd5d8" />
        {Array.from({ length: Math.round(v.waterRemaining * 6) }, (_, i) => (
          <circle key={i} cx={157 + i * 25} cy="221" r="5" fill="#8faeb5" />
        ))}
        <text x="300" y="276" textAnchor="middle" fontSize="24" fill="#8e76a0">
          {n(v.temperature)}°C · {n(v.waterRemaining)} g
        </text>
        <text x="212" y="163" textAnchor="end" fontSize="22" fill="#8e76a0">
          {j(v.latent)}
        </text>
        <text x="434" y="163" fontSize="22" fill="#a48b66">
          {j(v.roomIn)}
        </text>
      </svg>
      <div className="phy-thermal-metrics">
        <Metric
          mode={mode}
          title={['蒸发所需累计能量', 'Cumulative evaporation energy']}
        >
          {j(v.latent)}
        </Metric>
        <Metric mode={mode} title={['表面内能变化', 'Surface internal change']}>
          {j(v.internalChange)}
        </Metric>
      </div>
      <p className="phy-energy-total">
        <B
          zh="房间净传入=蒸发所需+表面内能变化"
          en="Net room input = evaporation energy + surface internal change"
          mode={mode}
        />{' '}
        · {j(v.roomIn)} = {j(v.latent)} + ({j(v.internalChange)})
      </p>
      <p className="phy-thermal-note">
        <B
          zh="数值随5 min模型进度变化；表面变凉不代表房间没有能量传入。"
          en="Values track the five-minute model; surface cooling does not mean no energy enters from the room."
          mode={mode}
        />
      </p>
      <Action mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['净速率', 'Net rate'],
          ['剩余水', 'Water left'],
          ['末温', 'Final T'],
          ['蒸发所需', 'Evaporation energy'],
        ]}
        rows={run.records.map((id) => {
          const v = wetSurface(wetRates[id]!, 300);
          return {
            id,
            cells: [
              wetRates[id]!.toFixed(2) + ' g/min',
              n(v.waterRemaining) + ' g',
              n(v.temperature) + ' °C',
              j(v.latent),
            ],
          };
        })}
      />
      <Progress mode={mode} count={run.count} />
    </Shell>
  );
}
