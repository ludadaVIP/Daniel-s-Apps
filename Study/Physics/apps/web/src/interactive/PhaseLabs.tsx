import { useId, useState, type ReactNode } from 'react';
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
  fusion,
  fusionCases,
  fusionTransfer,
  boiling,
  boilingCases,
  condensation,
  condensationCases,
  warmingCases,
  warmingPlan,
  warmingSnapshot,
  warmingPoints,
} from './phaseModels';
type Label = [string, string];
const purple = '#a38bbb',
  blue = '#98bfc6',
  gold = '#c5a16f',
  green = '#98b7a8';
const n = (v: number) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(2);
const kj = (v: number) => n(v / 1000) + ' kJ';
const words = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
function Shell({
  mode,
  title,
  conditions,
  children,
}: LabProps & { title: Label; conditions: Label; children: ReactNode }) {
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-phase-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">PHASE / FOLLOW THE CHANGE</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学模型 · 温度、状态与能量一起读；示意播放不是实际等待时间。"
          en="Teaching model · Read temperature, state and energy together. Playback is not the actual waiting time."
          mode={mode}
        />
      </p>
      {children}
      <details className="phy-energy-assumptions">
        <summary>
          <B zh="这份模型的条件" en="Conditions of this model" mode={mode} />
        </summary>
        <p className="phy-model-note">
          <B zh={conditions[0]} en={conditions[1]} mode={mode} />
        </p>
      </details>
    </div>
  );
}
function useObservation(
  choice: number,
  total: number,
  onExplore: LabProps['onExplore'],
  onEnd?: () => void,
) {
  const [done, setDone] = useState(false),
    [records, setRecords] = useState<number[]>([]),
    gate = useComparisons(
      Array.from({ length: total }, (_, i) => String(i)),
      onExplore,
    );
  const a = useAnimation(2.5, () => {
    setDone(true);
    setRecords((old) => [...new Set([...old, choice])]);
    gate.record(String(choice));
    onEnd?.();
  });
  return {
    a,
    records,
    count: gate.count,
    total,
    fraction: a.running ? a.time / 2.5 : done ? 1 : 0,
    start: () => {
      setDone(false);
      a.start();
    },
    reset: () => {
      setDone(false);
      a.reset();
    },
  };
}
function Observe({
  mode,
  run,
}: {
  mode: LanguageMode;
  run: ReturnType<typeof useObservation>;
}) {
  return (
    <>
      <button
        className="phy-button"
        disabled={run.a.running}
        onClick={run.start}
      >
        <B
          zh={run.a.running ? '观察中…' : '完整观察这组变化'}
          en={run.a.running ? 'Observing…' : 'Observe this complete change'}
          mode={mode}
        />
      </button>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${run.count}/${run.total}：完整观察所有条件，再带着证据继续。`}
          en={`Compared ${run.count}/${run.total}: complete every case, then continue with evidence.`}
          mode={mode}
        />
      </p>
    </>
  );
}
function Table({
  mode,
  columns,
  rows,
}: {
  mode: LanguageMode;
  columns: Label[];
  rows: ReactNode[][];
}) {
  if (!rows.length) return null;
  return (
    <div className="phy-data-table-wrap">
      <table className="phy-data-table">
        <caption>
          <B
            zh="保留比较 · 这是规定模型的结果"
            en="Retain comparisons · Results from the prescribed model"
            mode={mode}
          />
        </caption>
        <thead>
          <tr>
            {columns.map(([zh, en]) => (
              <th key={en} scope="col">
                <B zh={zh} en={en} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {v}
                  </th>
                ) : (
                  <td key={j}>{v}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const fusionLabels: Label[] = [
  ['50 g冰 · 吸收', '50 g ice · absorbs'],
  ['100 g冰 · 吸收', '100 g ice · absorbs'],
  ['50 g水 · 放出', '50 g water · releases'],
  ['100 g水 · 放出', '100 g water · releases'],
];
export function FusionLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    run = useObservation(choice, 4, onExplore),
    c = fusionCases[choice]!,
    s = fusion(c.mass, fusionTransfer * run.fraction, c.direction),
    pattern = useId();
  return (
    <Shell
      mode={mode}
      title={['温度不变，状态在变', 'Steady temperature, changing state']}
      conditions={[
        '约标准大气压下的纯水、均匀平衡相变，初态为0℃冰或0℃水。无过冷、杂质、容器蓄能或散失；冰取L≈334 J/g。只到相变区间终点，不继续升温或降温。传递能量并非内能变化的精确等式，忽略微小体积做功。2.5 s是示意；份量条表示质量比例，不表示体积。',
        'Pure water near normal atmospheric pressure, uniform equilibrium phase change, initially ice or water at 0°C. No supercooling, impurities, container storage or losses; L≈334 J/g. Stops within/at the transition endpoint, without later warming/cooling. Transfer is not an exact internal-energy equation; small volume work is omitted. Playback is schematic; the strip shows mass, not volume.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['初始质量与传递方向', 'Initial mass and transfer direction']}
        values={fusionLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={run.a.running}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
      />
      <div className="phy-phase-legend">
        <span style={{ color: blue }}>
          <B zh="冰（固态）" en="Ice (solid)" mode={mode} />
        </span>
        <span style={{ color: purple }}>
          <B zh="水（液态）" en="Water (liquid)" mode={mode} />
        </span>
      </div>
      <svg
        viewBox="0 0 620 290"
        className="phy-simulation phy-thermal-svg"
        role="img"
        aria-label={words(
          mode,
          '0℃熔化或凝固的质量份额与能量传递',
          'Mass fractions and energy transfer during melting or freezing at 0 Celsius',
        )}
      >
        <defs>
          <pattern
            id={pattern}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 14h28M14 0v28m-14-14 28 28m0-28L0 28"
              stroke="#eff6f8"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <text x="310" y="35" textAnchor="middle" fill={purple} fontSize="24">
          0°C · {c.mass} g
        </text>
        <rect
          x="80"
          y="68"
          width="460"
          height="95"
          rx="10"
          fill="#f1eaf5"
          stroke="#b8a5c8"
        />
        <rect
          x="83"
          y="71"
          width={454 * s.iceFraction}
          height="89"
          fill={blue}
        />
        <rect
          x="83"
          y="71"
          width={454 * s.iceFraction}
          height="89"
          fill={`url(#${pattern})`}
        />
        <rect
          x={83 + 454 * s.iceFraction}
          y="71"
          width={454 * (1 - s.iceFraction)}
          height="89"
          fill="#cfbddc"
        />
        <text x="85" y="199" fill={blue} fontSize="23">
          {words(mode, '冰', 'Ice')} {n(s.iceG)} g
        </text>
        <text x="535" y="199" textAnchor="end" fill={purple} fontSize="23">
          {words(mode, '液水', 'Liquid')} {n(s.liquidG)} g
        </text>
        <path
          d={
            c.direction === 'melting'
              ? 'M170 267h280m-12-8 12 8-12 8'
              : 'M450 267H170m12-8-12 8 12 8'
          }
          fill="none"
          stroke={c.direction === 'melting' ? gold : green}
          strokeWidth="4"
        />
        <text
          x="310"
          y="239"
          textAnchor="middle"
          fill={c.direction === 'melting' ? gold : green}
          fontSize="22"
        >
          {words(
            mode,
            c.direction === 'melting' ? '能量传入' : '能量传出',
            c.direction === 'melting' ? 'Energy enters' : 'Energy leaves',
          )}
        </text>
      </svg>
      <div className="phy-thermal-metrics">
        <LabMetric
          mode={mode}
          title={['传入样品为正', 'Into sample is positive']}
        >
          {s.transferToSample < 0 ? '−' : '+'}
          {kj(Math.abs(s.transferToSample))}
        </LabMetric>
        <LabMetric mode={mode} title={['原样品总质量', 'Original sample mass']}>
          {n(s.iceG + s.liquidG)} g
        </LabMetric>
      </div>
      <p className="phy-thermal-note">
        <B
          zh={
            c.direction === 'melting'
              ? '能量传入，冰变水；同样16.70 kJ能融化50 g，较大样品可能还有冰。'
              : '能量向周围传出，水变冰；凝固不是加入一种“冷量”。'
          }
          en={
            c.direction === 'melting'
              ? 'Energy enters as ice becomes liquid. The same 16.70 kJ melts 50 g; a larger sample can retain ice.'
              : 'Energy leaves to surroundings as liquid freezes. Freezing does not add a substance called cold.'
          }
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['初态', 'Initial'],
          ['冰', 'Ice'],
          ['液水', 'Liquid'],
          ['传入', 'Into sample'],
        ]}
        rows={run.records.map((id) => {
          const c = fusionCases[id]!,
            s = fusion(c.mass, fusionTransfer, c.direction);
          return [
            <B
              key={id}
              zh={fusionLabels[id]![0]}
              en={fusionLabels[id]![1]}
              mode={mode}
            />,
            n(s.iceG) + ' g',
            n(s.liquidG) + ' g',
            (s.transferToSample < 0 ? '−' : '+') +
              kj(Math.abs(s.transferToSample)),
          ];
        })}
      />
    </Shell>
  );
}
const boilLabels: Label[] = [
  ['20 g · 11.30 kJ', '20 g · 11.30 kJ'],
  ['20 g · 22.60 kJ', '20 g · 22.60 kJ'],
  ['40 g · 22.60 kJ', '40 g · 22.60 kJ'],
];
export function BoilingLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    run = useObservation(choice, 3, onExplore),
    c = boilingCases[choice]!,
    s = boiling(c.mass, c.input * run.fraction),
    h = (180 * s.liquidG) / 40,
    clip = useId();
  return (
    <Shell
      mode={mode}
      title={[
        '继续供热，更多水变气',
        'Keep supplying energy; more water vaporises',
      ]}
      conditions={[
        '约标准大气压、100℃纯水平衡沸腾；输入指已被水吸收的能量。L≈2260 J/g。容器蓄能、散失、体积做功及水蒸气继续升温省略；气泡只表示汽化，不表示空气。图中粒子点是不可见水蒸气的符号，密度与大小不按比例；不模拟白雾液滴。液面高度仅随剩余液水质量示意，2.5 s不是实际时间。',
        'Pure water boiling in equilibrium at 100°C near normal atmospheric pressure; input is absorbed by water. L≈2260 J/g. Container storage, losses, volume work and later vapour heating are omitted; bubbles represent vaporisation, not air. Dots symbolise invisible vapour; density/size are schematic, and mist droplets are not modelled. Liquid height illustrates remaining mass; 2.5 s is not actual time.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={[
          '初始沸水与吸收能量',
          'Initial boiling water and absorbed energy',
        ]}
        values={boilLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={run.a.running}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
      />
      <svg
        viewBox="0 0 620 325"
        className="phy-simulation phy-thermal-svg"
        role="img"
        aria-label={words(
          mode,
          '沸水剩余液体与离开杯子的水蒸气',
          'Boiling liquid remaining and vapour leaving the cup',
        )}
      >
        <defs>
          <clipPath id={clip}>
            <rect x="100" y={240 - h} width="190" height={h} />
          </clipPath>
        </defs>
        <path
          d="M97 48v195h196V48"
          fill="none"
          stroke="#b8a3c7"
          strokeWidth="3"
        />
        <rect x="100" y={240 - h} width="190" height={h} fill="#c5dce1" />
        <g clipPath={`url(#${clip})`} opacity={run.fraction > 0 ? 1 : 0}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={122 + i * 33}
              cy={
                235 - ((run.fraction * 4 + i * 0.19) % 1) * Math.max(0, h - 10)
              }
              r="6"
              fill="#eff7f8"
              stroke={blue}
            />
          ))}
        </g>
        <text x="195" y="280" textAnchor="middle" fill={purple} fontSize="24">
          100°C
        </text>
        <path
          d="M308 110h180m-12-9 12 9-12 9"
          fill="none"
          stroke={purple}
          strokeWidth="3"
          opacity={run.fraction}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={347 + (i % 3) * 55}
            cy={48 + Math.floor(i / 3) * 35}
            r="4"
            fill={purple}
            opacity={run.fraction * 0.6}
          />
        ))}
        <text x="450" y="155" textAnchor="middle" fill={purple} fontSize="21">
          {words(mode, '离开的水蒸气', 'Vapour leaving')}
        </text>
        <text x="450" y="191" textAnchor="middle" fill={purple} fontSize="25">
          {n(s.vapourG)} g
        </text>
        <path
          d="M148 309h95m-47 0v-17m-7 7 7-7 7 7"
          fill="none"
          stroke={gold}
          strokeWidth="4"
        />
      </svg>
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['杯内液水剩余', 'Liquid remaining']}>
          {n(s.liquidG)} g
        </LabMetric>
        <LabMetric mode={mode} title={['累计吸收能量', 'Energy absorbed']}>
          {kj(c.input * run.fraction)}
        </LabMetric>
      </div>
      <p className="phy-phase-balance">
        {n(s.liquidG)} g + {n(s.vapourG)} g = {c.mass} g{' '}
        <B
          zh="· 液水＋离开的蒸气；质量没消失。"
          en="· Liquid + escaped vapour; no missing mass."
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['初始 / 输入', 'Initial / input'],
          ['液水剩余', 'Liquid left'],
          ['已汽化', 'Vaporised'],
          ['温度', 'Temperature'],
        ]}
        rows={run.records.map((id) => {
          const c = boilingCases[id]!,
            s = boiling(c.mass, c.input);
          return [
            boilLabels[id]![0],
            n(s.liquidG) + ' g',
            n(s.vapourG) + ' g',
            '100 °C',
          ];
        })}
      />
    </Shell>
  );
}
const condenseLabels: Label[] = [
  ['杯壁8℃ · 露点15℃', 'Surface 8°C · dew point 15°C'],
  ['杯壁8℃ · 露点5℃', 'Surface 8°C · dew point 5°C'],
  ['杯壁22℃ · 露点15℃', 'Surface 22°C · dew point 15°C'],
];
export function CondensationLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    run = useObservation(choice, 3, onExplore),
    c = condensationCases[choice]!,
    s = condensation(c.surface, c.dewPoint);
  return (
    <Shell
      mode={mode}
      title={[
        '杯内没漏，空气留下水珠',
        'No leak inside; air supplies droplets',
      ]}
      conditions={[
        '密封不漏、原先干燥的杯壁；空气固定25℃，露点给定为15/5℃，不是用相对湿度计算。杯壁温度规定且保持不变，均高于0℃。只示意低于露点的新净凝结趋势；不预测水珠质量、耗时、成核或真实杯壁变温。空气点表示水蒸气，不是空气所有分子；液滴数与2.5 s播放均为示意。',
        'Leak-free sealed cup with an initially dry surface. Air is fixed at 25°C; dew point 15/5°C is prescribed, not calculated from relative humidity. Surface temperatures are fixed and above freezing. Illustrates onset of new net condensation below dew point, not mass, duration, nucleation or actual surface warming. Air dots symbolise vapour, not all air molecules; drop count and 2.5 s playback are schematic.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['杯壁温度与空气条件', 'Surface temperature and air condition']}
        values={condenseLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={run.a.running}
        set={(id) => {
          run.reset();
          setChoice(id);
        }}
      />
      <svg
        viewBox="0 0 620 300"
        className="phy-simulation phy-thermal-svg"
        role="img"
        aria-label={words(
          mode,
          '密封冷杯外的凝结与空气水蒸气条件',
          'Condensation outside a sealed cup under different vapour conditions',
        )}
      >
        <text x="310" y="31" textAnchor="middle" fill={purple} fontSize="24">
          {words(mode, '空气25℃', 'Air 25°C')}
        </text>
        <path
          d="M203 88l18 164h143l18-164"
          fill="#f1eaf5"
          stroke="#b8a3c7"
          strokeWidth="3"
        />
        <path d="M215 152h155l-10 94H225Z" fill="#cdb9dc" />
        <rect x="193" y="77" width="199" height="14" rx="6" fill="#b5a0c5" />
        <text x="291" y="125" textAnchor="middle" fontSize="23" fill={purple}>
          {words(mode, '密封', 'Sealed')}
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <circle
              cx={438 + (i % 3) * 48 - (s.condenses ? run.fraction * 25 : 0)}
              cy={79 + Math.floor(i / 3) * 58}
              r="4"
              fill={blue}
            />
            <circle
              cx={88 + (i % 2) * 45}
              cy={97 + Math.floor(i / 2) * 40}
              r="4"
              fill={blue}
            />
          </g>
        ))}
        {s.condenses && (
          <g opacity={run.fraction}>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M${i < 2 ? 195 : 393} ${140 + (i % 2) * 57}q-14 20 0 20q14 0 0-20Z`}
                fill={blue}
              />
            ))}
          </g>
        )}
        <text
          x="310"
          y="285"
          textAnchor="middle"
          fill={s.condenses ? green : purple}
          fontSize="24"
        >
          {words(
            mode,
            s.condenses ? '气态 → 液态；释放能量' : '没有新净凝结',
            s.condenses
              ? 'Gas → liquid; releases energy'
              : 'No new net condensation',
          )}
        </text>
      </svg>
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['规定杯壁温度', 'Prescribed surface']}>
          {c.surface} °C
        </LabMetric>
        <LabMetric mode={mode} title={['给定空气露点', 'Prescribed dew point']}>
          {c.dewPoint} °C
        </LabMetric>
      </div>
      <p className="phy-phase-balance">
        <B
          zh={
            s.condenses
              ? '8℃ < 15℃：低于露点，模型出现新净凝结；不是杯内饮料渗出。'
              : '杯壁高于露点：这份模型没有新净凝结；并不表示空气没有水蒸气。'
          }
          en={
            s.condenses
              ? '8°C < 15°C: below dew point, new net model condensation; not leaking drink.'
              : 'Surface above dew point: no new net model condensation; not proof of no vapour in air.'
          }
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['杯壁', 'Surface'],
          ['空气露点', 'Air dew point'],
          ['新凝结', 'New condensation'],
        ]}
        rows={run.records.map((id) => {
          const c = condensationCases[id]!,
            s = condensation(c.surface, c.dewPoint);
          return [
            c.surface + ' °C',
            c.dewPoint + ' °C',
            <B
              key={id}
              zh={s.condenses ? '有' : '无'}
              en={s.condenses ? 'Yes' : 'No'}
              mode={mode}
            />,
          ];
        })}
      />
    </Shell>
  );
}
const curveLabels: Label[] = [
  ['20 g · 50 W', '20 g · 50 W'],
  ['20 g · 100 W', '20 g · 100 W'],
  ['40 g · 50 W', '40 g · 50 W'],
];
const stateLabels: Record<string, Label> = {
  ice: ['冰升温', 'Ice warming'],
  melting: ['冰水共存', 'Ice + water'],
  water: ['液水升温', 'Water warming'],
};
export function HeatingCurveLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    [probe, setProbe] = useState(0),
    c = warmingCases[choice]!,
    plan = warmingPlan(c.mass, c.power),
    run = useObservation(choice, 3, onExplore, () => setProbe(plan.duration)),
    seconds = run.a.running ? run.fraction * plan.duration : probe,
    s = warmingSnapshot(c.mass, c.power, seconds),
    points = warmingPoints(c.mass, c.power, seconds),
    x = (t: number) => 78 + (t / 360) * 462,
    y = (t: number) => 252 - ((t + 10) / 30) * 198;
  const path = points
      .map((p, i) => `${i ? 'L' : 'M'}${x(p.time)} ${y(p.temperature)}`)
      .join(' '),
    state = stateLabels[s.state]!;
  return (
    <Shell
      mode={mode}
      title={[
        '曲线平着走，能量继续进',
        'Flat temperature; energy keeps entering',
      ]}
      conditions={[
        '纯水、约标准大气压、均匀平衡过程，全部从−10℃冰到20℃水。冰比热取2.1 J/(g·℃)，水4.2 J/(g·℃)，熔化潜热334 J/g；恒定功率是样品净吸收功率，不是插座标牌值。无容器蓄能、散失、体积做功或过冷。三组共用0–360 s与−10–20℃轴；只画已观察曲线，到20℃停止。2.5 s压缩完整模型时间（各组倍率不同）；探查时间不算完整观察。',
        'Pure water, normal atmospheric pressure and uniform equilibrium, from −10°C ice to 20°C liquid. Ice c=2.1 J/(g·°C), liquid c=4.2, fusion latent heat 334 J/g. Constant power is net sample absorption, not the appliance rating. No container storage, losses, volume work or supercooling. Shared 0–360 s and −10–20°C axes; only elapsed curve appears and stops at 20°C. Each full duration is compressed to 2.5 s at a case-specific speed. Seeking is not complete observation.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['质量与净吸收功率', 'Mass and net absorbed power']}
        values={curveLabels.map(([zh, en], id) => ({ id, zh, en }))}
        value={choice}
        disabled={run.a.running}
        set={(id) => {
          run.reset();
          setChoice(id);
          setProbe(0);
        }}
      />
      <svg
        viewBox="0 0 620 315"
        className="phy-simulation phy-thermal-svg phy-phase-curve"
        role="img"
        aria-label={words(
          mode,
          '固定共同时间轴的冰到水加热曲线；仅显示已观察部分',
          'Ice-to-water heating curve on a fixed shared time axis; elapsed portion only',
        )}
      >
        {[-10, 0, 10, 20].map((t) => (
          <g key={t}>
            <path
              d={`M78 ${y(t)}H540`}
              stroke="#dfd4e7"
              strokeDasharray="5 5"
            />
            <text
              x="61"
              y={y(t) + 7}
              textAnchor="end"
              fontSize="23"
              fill={purple}
            >
              {t}
            </text>
          </g>
        ))}
        {[0, 180, 360].map((t) => (
          <g key={t}>
            <path d={`M${x(t)} 252v6`} stroke={purple} />
            <text
              x={x(t)}
              y="285"
              textAnchor="middle"
              fontSize="23"
              fill={purple}
            >
              {t}
            </text>
          </g>
        ))}
        <path d="M78 43v209H548" fill="none" stroke="#b9a4c9" strokeWidth="2" />
        <text x="25" y="26" fill={purple} fontSize="23">
          T/°C
        </text>
        <text x="540" y="310" textAnchor="end" fill={purple} fontSize="23">
          t/s
        </text>
        <path d={path} stroke={purple} strokeWidth="5" fill="none" />
        {s.elapsed >= plan.iceSeconds && (
          <path
            d={`M${x(plan.iceSeconds)} ${y(0)}H${x(Math.min(s.elapsed, plan.endMeltingSeconds))}`}
            stroke={gold}
            strokeWidth="6"
          />
        )}
        <circle cx={x(s.elapsed)} cy={y(s.temperature)} r="7" fill={purple} />
      </svg>
      <label className="phy-energy-probe">
        <span>
          <B zh="模型累计时间" en="Elapsed model time" mode={mode} /> ·{' '}
          {s.elapsed.toFixed(1)} s
        </span>
        <input
          type="range"
          aria-label={words(mode, '模型累计时间', 'Elapsed model time')}
          min="0"
          max={plan.duration}
          step="0.1"
          value={s.elapsed}
          disabled={run.a.running}
          onChange={(e) => setProbe(Number(e.target.value))}
        />
      </label>
      <div className="phy-phase-stages">
        {(['ice', 'melting', 'water'] as const).map((id) => (
          <span key={id} className={s.state === id ? 'active' : ''}>
            <B zh={stateLabels[id]![0]} en={stateLabels[id]![1]} mode={mode} />
          </span>
        ))}
      </div>
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['当前温度', 'Current temperature']}>
          {n(s.temperature)} °C
        </LabMetric>
        <LabMetric mode={mode} title={['当前累计吸收', 'Absorbed so far']}>
          {kj(s.energyJ)}
        </LabMetric>
      </div>
      <p className="phy-phase-balance">
        <B
          zh={`当前：${state[0]}。完整熔化平段时长${plan.meltingSeconds.toFixed(1)} s；全程${plan.duration.toFixed(1)} s，需${kj(plan.totalJ)}。`}
          en={`Now: ${state[1]}. Full melting plateau ${plan.meltingSeconds.toFixed(1)} s; entire process ${plan.duration.toFixed(1)} s requires ${kj(plan.totalJ)}.`}
          mode={mode}
        />
      </p>
      <p className="phy-thermal-note">
        <B
          zh="三段已吸收账本：冰升温 / 熔化 / 水升温。温度–时间图下的面积不是能量。"
          en="Absorbed ledger: ice warming / melting / water warming. Area under this temperature–time graph is not energy."
          mode={mode}
        />
      </p>
      <div className="phy-phase-ledger">
        {[s.iceUsed, s.fusionUsed, s.liquidUsed].map((v, i) => (
          <div key={i}>
            <span>
              <B
                zh={['冰升温', '熔化', '水升温'][i]!}
                en={['Ice warming', 'Melting', 'Water warming'][i]!}
                mode={mode}
              />
            </span>
            <div className="phy-phase-energy-track">
              <i
                style={{
                  width: `${(v / 17560) * 100}%`,
                  background: [blue, gold, purple][i],
                }}
              />
            </div>
            <strong>{kj(v)}</strong>
          </div>
        ))}
      </div>
      <p className="phy-thermal-note">
        <B
          zh="能量条共用0–17.56 kJ刻度。"
          en="Energy bars share the 0–17.56 kJ scale."
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Table
        mode={mode}
        columns={[
          ['质量 / 功率', 'Mass / power'],
          ['总吸收', 'Total input'],
          ['平段时长', 'Plateau length'],
          ['总时间', 'Total time'],
        ]}
        rows={run.records.map((id) => {
          const c = warmingCases[id]!,
            p = warmingPlan(c.mass, c.power);
          return [
            curveLabels[id]![0],
            kj(p.totalJ),
            p.meltingSeconds.toFixed(1) + ' s',
            p.duration.toFixed(1) + ' s',
          ];
        })}
      />
    </Shell>
  );
}
