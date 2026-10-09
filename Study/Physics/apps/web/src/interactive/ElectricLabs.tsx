import { useState, type ReactNode } from 'react';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import { EnergyBars } from './EnergyBars';
import {
  chargeCases,
  chargeTransfer,
  interactionCases,
  chargeInteraction,
  currentCases,
  currentWindow,
  dcCircuit,
  electricCircuitCase,
  lampTransfers,
  type ElectricKind,
} from './electricModels';
import {
  ChargeScene,
  InteractionScene,
  CurrentScene,
  CircuitScene,
} from './ElectricScenes';
type Pair = [string, string];
const fmt = (n: number) =>
  String(Number((Math.abs(n) < 1e-9 ? 0 : n).toFixed(3)));
export const electricTitles: Record<ElectricKind, Pair> = {
  charge: ['电荷转移总账', 'Charge-transfer account'],
  interaction: ['电荷符号与极化', 'Charge signs and polarization'],
  current: ['过截面的电荷计数', 'Charge crossing a section'],
  circuit: ['闭合路径检查', 'Closed-path inspection'],
  battery: ['极性与电池能量', 'Polarity and cell energy'],
  lamp: ['电荷与能量两本账', 'Separate charge and energy accounts'],
  switch: ['不同位置的缺口', 'Gaps at different positions'],
  materials: ['材料与接触对照', 'Material and contact comparisons'],
  series: ['一条通路，两只灯', 'One path, two lamps'],
  parallel: ['分叉处的电流账本', 'Current account at a junction'],
};
export const electricOptions: Record<ElectricKind, Pair[]> = {
  charge: [
    ['不转移', 'No transfer'],
    ['B → A 4e', 'B → A 4e'],
    ['A → B 4e', 'A → B 4e'],
  ],
  interaction: [
    ['同号 − / −', 'Like − / −'],
    ['异号 − / +', 'Unlike − / +'],
    ['负电 / 中性', 'Negative / neutral'],
  ],
  current: [
    ['1 C / 2 s', '1 C / 2 s'],
    ['2 C / 2 s', '2 C / 2 s'],
    ['2 C / 4 s', '2 C / 4 s'],
  ],
  circuit: [
    ['完整回路', 'Complete loop'],
    ['开关断开', 'Open switch'],
    ['缺一段回线', 'Missing return'],
  ],
  battery: [
    ['单节正接', 'One forward cell'],
    ['两节同向', 'Two aligned cells'],
    ['单节反接', 'One reversed cell'],
  ],
  lamp: [
    ['光占10%', '10% light'],
    ['光占30%', '30% light'],
    ['光占60%', '60% light'],
  ],
  switch: [
    ['闭合', 'Closed'],
    ['供电侧断开', 'Supply-side open'],
    ['回线侧断开', 'Return-side open'],
  ],
  materials: [
    ['金属接好', 'Metal connected'],
    ['干塑料接好', 'Dry plastic connected'],
    ['金属一端缺口', 'Gap at metal end'],
  ],
  series: [
    ['一只灯', 'One lamp'],
    ['两只串联', 'Two in series'],
    ['第二只断开', 'Second lamp open'],
  ],
  parallel: [
    ['两支路闭合', 'Both branches closed'],
    ['B支路断开', 'B branch open'],
    ['B换20 Ω', 'B changed to 20 Ω'],
  ],
};
const specificNotes: Record<ElectricKind, Pair> = {
  charge: [
    '每个物体先有8个正单位和8个电子；最多转移4个示意电子。只改变电子归属，正单位固定；途中电子也计入总量。材料的真实转移方向和数量未预测。',
    'Each object starts with eight positive units and eight electrons; up to four schematic electrons transfer. Positive units stay fixed, and electrons in transit count in the total. Actual material transfer direction and quantity are not predicted.',
  ],
  interaction: [
    '左边固定−4e，右边符号可调；中性伙伴可极化但不接触、不转移净电荷。箭头仅表示相吸/相斥方向；物体保持固定，不计算库仑力、速度或位移。',
    'Left is fixed at −4e; right is adjustable. The neutral partner polarizes without contact or net transfer. Arrows indicate attraction/repulsion only; objects stay held, with no Coulomb force, speed or displacement calculation.',
  ],
  current: [
    '每个＋包代表0.25 C的许多电荷，按约定正方向计数，不是金属里的单个粒子。平均电流按完整规定窗口计算。播放2.4秒压缩物理窗口，不表示真实电子漂移速度。',
    'Each + packet represents 0.25 C of many charges counted in the conventional positive direction, not one metal particle. Average current uses the full assigned window. A 2.4 s playback compresses it and does not give actual electron drift speed.',
  ],
  circuit: [
    '理想3 V直流电源、理想导线、10 Ω恒定电阻灯；忽略接通瞬间、内阻与灯丝升温。本图没有短接电源的路线；只比较完整通路、开关缺口和回线缺口。',
    'Ideal 3 V DC source, ideal wires and a constant 10 Ω resistive lamp. Transients, internal resistance and filament heating are omitted. There is no short-circuit route; compare a complete loop, switch gap and return gap.',
  ],
  battery: [
    '每节标称1.5 V；理想电池、10 Ω恒定电阻灯，忽略内阻、容量耗尽与接通瞬间。电流正负相对于正接参考方向。反接只用于虚拟电阻灯，不能推广为电子设备使用方法。',
    'Each cell is nominally 1.5 V; ideal cells and a constant 10 Ω lamp, omitting internal resistance, depletion and switching transients. Current sign follows the forward reference direction. Reversal is virtual and applies only to this resistive lamp, not electronic-device use.',
  ],
  lamp: [
    '理想3 V电源与10 Ω恒定电阻灯；2 s窗口，输入1.8 J。光/热占比是指定教学参数，未预测材料效率。电荷与能量分别记账；图中黄色不是照度读数。',
    'Ideal 3 V source and constant 10 Ω lamp over 2 s, with 1.8 J input. Light/thermal shares are assigned, not material-efficiency predictions. Charge and energy have separate accounts; yellow is not an illuminance reading.',
  ],
  switch: [
    '理想3 V电池单回路、10 Ω模型灯；只比较接通后的稳定状态。开关闭合时导通，断开时不导通；未模拟火花和瞬间传播。不是市电开关接线指导。',
    'Ideal 3 V battery single loop with a 10 Ω model lamp; steady states only. Closed contacts conduct; open contacts do not. Sparks and transient propagation are omitted. This is not mains switch-wiring guidance.',
  ],
  materials: [
    '同一3 V/10 Ω灯回路，金属接好当理想连接，干塑料或接触缺口当不导通。未给真实材料电阻测量值，也不描述潮湿、高压或击穿条件。',
    'Same 3 V/10 Ω lamp loop: connected metal is ideal, dry plastic or a contact gap does not conduct. No actual material resistance is measured; moisture, high voltage and breakdown are outside the model.',
  ],
  series: [
    '理想3 V电源、每只灯10 Ω且恒定，只有一条回路。功率用于比较能量转移率，不等同于实测亮度；真实灯丝电阻随温度改变。',
    'Ideal 3 V source, each lamp fixed at 10 Ω, one loop. Power compares energy-transfer rate, not measured brightness; real filament resistance changes with temperature.',
  ],
  parallel: [
    '理想3 V电源维持共同节点电势差，A=10 Ω，B可变。所有闭合支路是恒定电阻；忽略源内阻和导线电阻。真实电池与线路不能无限供电。',
    'An ideal 3 V source holds the shared node potential difference; A=10 Ω and B varies. Closed branches are fixed resistances, omitting source/wire resistance. Real batteries and wiring have supply limits.',
  ],
};
function ElectricBench({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: ElectricKind }) {
  const [choice, setChoice] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const defaults =
    kind === 'charge'
      ? chargeCases[choice]!
      : kind === 'interaction'
        ? interactionCases[choice]!
        : kind === 'current'
          ? currentCases[choice]!.seconds
          : kind === 'lamp'
            ? [0.1, 0.3, 0.6][choice]!
            : kind === 'parallel'
              ? choice === 2
                ? 20
                : 10
              : 3;
  const value = custom ?? defaults,
    preset = Math.abs(value - defaults) < 1e-9 ? choice : -1;
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      setProbe(1);
      if (preset >= 0) {
        setRecords((old) => [...new Set([...old, preset])]);
        gate.record(String(preset));
      }
    });
  const progress = animation.running ? animation.time / 2.4 : probe;
  const reset = () => {
      animation.reset();
      setProbe(0);
    },
    choose = (i: number) => {
      reset();
      setChoice(i);
      setCustom(null);
    };
  const config = (i: number, override?: number) => {
    const c = electricCircuitCase(kind, i);
    if (override !== undefined) {
      if (kind === 'lamp') c.lightFraction = override;
      if (kind === 'series') c.voltage = override;
      if (kind === 'parallel') c.resistance[1] = override;
    }
    return c;
  };
  let scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[],
    extra: ReactNode = null;
  if (kind === 'charge') {
    const m = chargeTransfer(value, progress);
    scene = <ChargeScene transfer={value} progress={progress} mode={mode} />;
    metrics = [
      {
        title: ['A净电荷', 'A net charge'],
        value: `${m.chargeA > 0 ? '+' : ''}${m.chargeA}e`,
      },
      {
        title: ['B净电荷', 'B net charge'],
        value: `${m.chargeB > 0 ? '+' : ''}${m.chargeB}e`,
      },
      {
        title: ['含途中电荷的总量', 'Total including transit'],
        value: `${m.totalCharge}e`,
      },
    ];
    columns = [
      ['转移', 'Transfer'],
      ['A / B净电荷', 'A / B net charge'],
      ['含途中总量', 'Total with transit'],
    ];
    row = (i) => {
      const a = chargeTransfer(chargeCases[i]!);
      return [
        electricOptions.charge[i]!,
        `${a.chargeA} / ${a.chargeB} e`,
        `${a.totalCharge}e`,
      ];
    };
  } else if (kind === 'interaction') {
    const m = chargeInteraction(value);
    scene = (
      <InteractionScene partner={value} progress={progress} mode={mode} />
    );
    metrics = [
      { title: ['左边净电荷', 'Left net charge'], value: '−4e' },
      {
        title: ['右边净电荷', 'Right net charge'],
        value: `${value > 0 ? '+' : ''}${value}e`,
      },
      {
        title: ['作用方向', 'Interaction direction'],
        value: (
          <B
            mode={mode}
            zh={m.action === 'repel' ? '相斥' : '相吸'}
            en={m.action === 'repel' ? 'Repel' : 'Attract'}
          />
        ),
      },
    ];
    columns = [
      ['右边情况', 'Right condition'],
      ['净电荷', 'Net charge'],
      ['作用方向', 'Interaction'],
    ];
    row = (i) => {
      const a = chargeInteraction(interactionCases[i]!);
      return [
        electricOptions.interaction[i]!,
        `${a.chargeB}e`,
        a.action === 'repel' ? ['相斥', 'Repel'] : ['相吸', 'Attract'],
      ];
    };
  } else if (kind === 'current') {
    const m = currentWindow(currentCases[choice]!.charge, value, progress);
    scene = (
      <CurrentScene
        charge={m.charge}
        seconds={value}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      {
        title: ['已通过示意电荷', 'Schematic charge counted'],
        value: `${fmt(m.countedCharge)} C`,
      },
      { title: ['完整物理窗口', 'Full physical window'], value: `${value} s` },
      {
        title: ['完整窗口平均电流', 'Full-window average current'],
        value: `${fmt(m.current)} A`,
      },
    ];
    columns = [
      ['完整电荷量', 'Full charge'],
      ['物理窗口', 'Physical window'],
      ['平均电流', 'Average current'],
    ];
    row = (i) => {
      const a = currentWindow(
        currentCases[i]!.charge,
        currentCases[i]!.seconds,
      );
      return [`${a.charge} C`, `${a.seconds} s`, `${fmt(a.current)} A`];
    };
  } else {
    const c = config(choice, value),
      m = dcCircuit(c);
    scene = <CircuitScene config={c} progress={progress} mode={mode} />;
    if (kind === 'lamp') {
      const energy = lampTransfers(m.energy * progress, value);
      metrics = [
        {
          title: ['灯前电流', 'Current before lamp'],
          value: `${fmt(m.sourceCurrent)} A`,
        },
        {
          title: ['灯后电流', 'Current after lamp'],
          value: `${fmt(m.currents[0]!)} A`,
        },
        {
          title: ['2 s进出电荷（各）', '2 s charge in / out (each)'],
          value: `${fmt(m.sourceCharge)} C`,
        },
      ];
      extra = (
        <EnergyBars
          mode={mode}
          rows={[
            {
              label: ['当前输入', 'Current input'],
              color: '#ad93bc',
              value: energy.total,
            },
            {
              label: ['当前光能', 'Current light energy'],
              color: '#c49d61',
              value: energy.light,
            },
            {
              label: ['当前热能', 'Current thermal energy'],
              color: '#89ad9c',
              value: energy.thermal,
            },
          ]}
          scale={1.8}
        />
      );
    } else if (kind === 'parallel')
      metrics = [
        {
          title: ['A支路电流', 'Branch A current'],
          value: `${fmt(m.currents[0]!)} A`,
        },
        {
          title: ['B支路电流', 'Branch B current'],
          value: `${fmt(m.currents[1]!)} A`,
        },
        {
          title: ['总电流', 'Total current'],
          value: `${fmt(m.sourceCurrent)} A`,
        },
      ];
    else
      metrics = [
        {
          title: ['回路稳定电流', 'Steady loop current'],
          value: `${fmt(m.sourceCurrent)} A`,
        },
        {
          title: ['灯A电功率', 'Lamp A electrical power'],
          value: `${fmt(m.powers[0]!)} W`,
        },
        {
          title:
            kind === 'series'
              ? ['灯B电功率', 'Lamp B electrical power']
              : ['2 s输入能量', 'Input energy in 2 s'],
          value:
            kind === 'series' ? (
              m.powers.length > 1 ? (
                `${fmt(m.powers[1]!)} W`
              ) : (
                <B mode={mode} zh="未接第二只" en="No second lamp" />
              )
            ) : (
              `${fmt(m.energy)} J`
            ),
        },
      ];
    columns =
      kind === 'lamp'
        ? [
            ['光能占比', 'Light share'],
            ['2 s光能', '2 s light'],
            ['2 s热能', '2 s thermal'],
          ]
        : kind === 'parallel'
          ? [
              ['支路条件', 'Branch condition'],
              ['A / B电流', 'A / B current'],
              ['总电流', 'Total current'],
            ]
          : [
              ['线路条件', 'Circuit condition'],
              ['回路电流', 'Loop current'],
              ['灯A / B功率', 'Lamp A / B power'],
            ];
    row = (i) => {
      const a = dcCircuit(config(i));
      if (kind === 'lamp') {
        const e = lampTransfers(a.energy, config(i).lightFraction!);
        return [
          electricOptions[kind][i]!,
          `${fmt(e.light)} J`,
          `${fmt(e.thermal)} J`,
        ];
      }
      return kind === 'parallel'
        ? [
            electricOptions[kind][i]!,
            `${fmt(a.currents[0]!)} / ${fmt(a.currents[1]!)} A`,
            `${fmt(a.sourceCurrent)} A`,
          ]
        : [
            electricOptions[kind][i]!,
            `${fmt(a.sourceCurrent)} A`,
            `${fmt(a.powers[0]!)} / ${a.powers.length > 1 ? fmt(a.powers[1]!) : '—'} W`,
          ];
    };
  }
  const slider =
    kind === 'charge'
      ? {
          name: [
            'B→A转移数（负数反向）',
            'B→A transfer (negative reverses)',
          ] as Pair,
          min: -4,
          max: 4,
          step: 1,
          unit: 'e',
        }
      : kind === 'interaction'
        ? {
            name: ['右边净电荷', 'Right net charge'] as Pair,
            min: -4,
            max: 4,
            step: 1,
            unit: 'e',
          }
        : kind === 'current'
          ? {
              name: ['物理计数窗口', 'Physical counting window'] as Pair,
              min: 1,
              max: 6,
              step: 1,
              unit: 's',
            }
          : kind === 'lamp'
            ? {
                name: ['规定光能占比', 'Assigned light-energy share'] as Pair,
                min: 0.1,
                max: 0.9,
                step: 0.1,
                unit: '',
              }
            : kind === 'series'
              ? {
                  name: ['模型电源电压', 'Model source voltage'] as Pair,
                  min: 1.5,
                  max: 4.5,
                  step: 0.5,
                  unit: 'V',
                }
              : kind === 'parallel'
                ? {
                    name: [
                      'B支路恒定电阻',
                      'Branch B fixed resistance',
                    ] as Pair,
                    min: 5,
                    max: 30,
                    step: 5,
                    unit: 'Ω',
                  }
                : null;
  const cell = (v: ReactNode) =>
    Array.isArray(v) ? (
      <B zh={v[0] as string} en={v[1] as string} mode={mode} />
    ) : (
      v
    );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">ELECTRICITY / FOLLOW THE PATH</span>
        <B
          zh={electricTitles[kind][0]}
          en={electricTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={electricOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={preset}
        set={choose}
        disabled={animation.running}
      />
      {slider && (
        <label className="phy-energy-probe">
          <B mode={mode} zh={slider.name[0]} en={slider.name[1]} /> ·{' '}
          {kind === 'lamp'
            ? `${Math.round(value * 100)}%`
            : `${fmt(value)} ${slider.unit}`}
          <input
            type="range"
            aria-label={mode === 'en' ? slider.name[1] : slider.name[0]}
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={value}
            disabled={animation.running}
            onChange={(e) => {
              reset();
              setCustom(Number(e.target.value));
            }}
          />
        </label>
      )}
      <svg
        viewBox="0 0 620 350"
        role="img"
        aria-label={
          mode === 'en' ? electricTitles[kind][1] : electricTitles[kind][0]
        }
      >
        {scene}
      </svg>
      <div className="phy-thermal-metrics">
        {metrics.map((m) => (
          <LabMetric key={m.title[1]} mode={mode} title={m.title}>
            {m.value}
          </LabMetric>
        ))}
      </div>
      {extra}
      <p className="phy-model-note">
        <B
          mode={mode}
          zh={specificNotes[kind][0]}
          en={specificNotes[kind][1]}
        />
      </p>
      {!['charge', 'interaction', 'current'].includes(kind) && (
        <p className="phy-model-note">
          <B
            mode={mode}
            zh="蓝点表示约定电流方向，不是单个电子、速度或可用于计算电荷量的粒子计数；金属电子反向漂移。2.4秒播放仅示意方向，读数属于稳定电路与规定2 s能量窗口。"
            en="Blue markers indicate conventional current, not individual electrons, drift speed or countable charge packets. Metal electrons drift opposite. A 2.4 s playback illustrates direction; readings describe steady circuits and a specified 2 s energy window."
          />
        </p>
      )}
      <label className="phy-energy-probe">
        <B zh="检查进度" en="Inspection progress" mode={mode} /> ·{' '}
        {Math.round(progress * 100)}%
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          aria-label={mode === 'en' ? 'Inspection progress' : '检查进度'}
          value={Math.round(progress * 100)}
          disabled={animation.running}
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
          onClick={animation.start}
        >
          <B
            mode={mode}
            zh="播放并记录这次比较"
            en="Play and record comparison"
          />
        </button>
        <button className="phy-button secondary" onClick={reset}>
          <B mode={mode} zh="回到起点" en="Back to start" />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          mode={mode}
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整播放。`}
          en={`${gate.count}/3 required comparisons complete; seeking or custom settings do not replace a full run.`}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                zh="保留的模型比较（不是自己的实测）"
                en="Retained model comparisons (not your measurements)"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {columns.map(([zh, en]) => (
                  <th key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...records]
                .sort((a, b) => a - b)
                .map((i) => (
                  <tr key={i}>
                    {row(i).map((v, j) => (
                      <td key={j}>{cell(v)}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export const ChargeTransferLab = (p: LabProps) => (
  <ElectricBench {...p} kind="charge" />
);
export const ChargeInteractionLab = (p: LabProps) => (
  <ElectricBench {...p} kind="interaction" />
);
export const ElectricCurrentLab = (p: LabProps) => (
  <ElectricBench {...p} kind="current" />
);
export const CompleteCircuitLab = (p: LabProps) => (
  <ElectricBench {...p} kind="circuit" />
);
export const BatteryPolarityLab = (p: LabProps) => (
  <ElectricBench {...p} kind="battery" />
);
export const LampChargeLab = (p: LabProps) => (
  <ElectricBench {...p} kind="lamp" />
);
export const SwitchPathLab = (p: LabProps) => (
  <ElectricBench {...p} kind="switch" />
);
export const MaterialContactLab = (p: LabProps) => (
  <ElectricBench {...p} kind="materials" />
);
export const SeriesCircuitLab = (p: LabProps) => (
  <ElectricBench {...p} kind="series" />
);
export const ParallelCircuitLab = (p: LabProps) => (
  <ElectricBench {...p} kind="parallel" />
);
