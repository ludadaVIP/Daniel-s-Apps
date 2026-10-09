import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import {
  ammeterCase,
  voltageCases,
  voltageAccount,
  voltmeterCase,
  wireCases,
  wireResistance,
  ohmReading,
  ohmSweep,
  powerCases,
  electricPower,
  faultCircuit,
  type QuantKind,
} from './electricQuantModels';
type Pair = [string, string];
const ink = '#a58cb4',
  blue = '#82adbd',
  gold = '#bc996a',
  red = '#bf8d85';
const fmt = (n: number) => String(Number(n.toFixed(3)));
const w = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const titles: Record<QuantKind, Pair> = {
  ammeter: ['电流表接线与量程', 'Ammeter wiring and range'],
  voltage: ['每库仑的能量账', 'Energy per coulomb'],
  voltmeter: ['电压表的两个连接点', 'Two voltmeter connection points'],
  resistance: ['导线形状公平比较', 'Fair wire-shape comparisons'],
  ohm: ['U–I关系扫描', 'U–I relationship sweep'],
  power: ['瓦数与累计能量', 'Watts and accumulated energy'],
  safety: ['电路故障侦探', 'Circuit fault detective'],
};
const options: Record<QuantKind, Pair[]> = {
  ammeter: [
    ['串联 · 3 A', 'Series · 3 A'],
    ['串联 · 0.6 A', 'Series · 0.6 A'],
    ['错误跨电池', 'Incorrect across cell'],
  ],
  voltage: [
    ['1 C / 3 J', '1 C / 3 J'],
    ['2 C / 6 J', '2 C / 6 J'],
    ['1 C / 6 J', '1 C / 6 J'],
  ],
  voltmeter: [
    ['跨10 Ω', 'Across 10 Ω'],
    ['跨20 Ω', 'Across 20 Ω'],
    ['跨电源', 'Across source'],
  ],
  resistance: [
    ['基准线', 'Reference wire'],
    ['长度×2', 'Length ×2'],
    ['截面积×2', 'Area ×2'],
  ],
  ohm: [
    ['恒定10 Ω', 'Constant 10 Ω'],
    ['恒定20 Ω', 'Constant 20 Ω'],
    ['规定灯丝曲线', 'Assigned filament curve'],
  ],
  power: [
    ['3 V · 10 s', '3 V · 10 s'],
    ['6 V · 10 s', '6 V · 10 s'],
    ['3 V · 20 s', '3 V · 20 s'],
  ],
  safety: [
    ['两负载', 'Two loads'],
    ['四负载过载', 'Four-load overload'],
    ['错误低阻旁路', 'Unintended low-R bypass'],
  ],
};
const notes: Record<QuantKind, Pair> = {
  ammeter: [
    '理想3 V电源、恒定10 Ω负载与零电阻电流表。30格是教学刻度，金点检查刻度而非表示电荷运动，不是真实测量误差模型。错误跨电池接法不送电，不生成假短路读数。',
    'Ideal 3 V source, constant 10 Ω load and zero-resistance ammeter. Thirty divisions are a teaching scale; the gold marker inspects it without representing charge motion or measurement error. Across-cell current wiring is not energised and receives no fictional short reading.',
  ],
  voltage: [
    '规定每库仑能量的累计账；C与J各自有标尺。起点累计0/0不用于求电压；显示的是完整账本规定值。标记是检查顺序，不是带着能量包的真实电子。',
    'Cumulative accounting at specified energy per coulomb, with separate C/J scales. Initial 0/0 does not calculate voltage; the specified full-account ratio is displayed. Markers show inspection order, not real electrons carrying energy packages.',
  ],
  voltmeter: [
    '理想3 V源、10 Ω＋20 Ω串联与无限电阻电压表；忽略导线和表的加载影响。教学刻度显示大小，金点是检查标记；带符号读数显示表笔顺序，不模拟普通指针表的反偏。',
    'Ideal 3 V source, 10 Ω + 20 Ω series loads and infinite-resistance voltage meter. Wire and meter loading effects are omitted. The teaching scale shows magnitude with a gold inspection marker; a signed reading shows probe order, not reverse pointer deflection.',
  ],
  resistance: [
    '同材料、同温度，基准线10 Ω，电源固定3 V。长度与截面积是相对量；图形粗细只是示意，没有给出实际直径。高亮点检查几何，不表示电荷速度。',
    'Same material and temperature; reference wire 10 Ω, source fixed at 3 V. Length and area are relative quantities; schematic thickness is not an actual diameter. The highlight inspects geometry, not charge speed.',
  ],
  ohm: [
    '每次完整扫描1、2、3 V。两条直线是固定电阻；规定灯丝I=U/(8+2U)仅在0–3 V使用，不是实测或热动力学解。U=I=0时不以0/0求R。',
    'Every full sweep inspects 1, 2, 3 V. Straight lines are fixed resistors; assigned filament I=U/(8+2U) is used only at 0–3 V, not as measured data or a thermal solution. At U=I=0, R is not obtained from 0/0.',
  ],
  power: [
    '理想稳定直流与恒定10 Ω负载。P恒定、E=Pt；2.4 s播放压缩规定物理时间。图的公共范围为0–20 s、0–80 J，不预测真实灯丝或交流设备功率。',
    'Ideal steady DC, constant 10 Ω load and P; E=Pt. A 2.4 s playback compresses the assigned physical interval. Shared plot limits are 0–20 s and 0–80 J; real filament or AC power is not predicted.',
  ],
  safety: [
    '只检查模型：源3 V、内部0.5 Ω，规定0.8 A阈值。故障图保持保护断开；旁路0.2 Ω不是理想零电阻。推算未保护电流与保护后电流分开，不模拟故障送电、触电或保护动作时间，也不提供家庭安装定值。',
    'Diagram inspection only: source 3 V, internal 0.5 Ω, assigned 0.8 A threshold. Fault diagrams remain isolated; bypass resistance is 0.2 Ω, not ideal zero. Prospective and protected currents are separate; no energised fault, shock or trip time is simulated, and no household installation rating is provided.',
  ],
};
function Battery() {
  return (
    <g stroke={gold} strokeWidth="3">
      <path d="M55 135h50m-39 40h28" />
      <text x="38" y="141" textAnchor="middle">
        +
      </text>
      <text x="38" y="181" textAnchor="middle">
        −
      </text>
      <text x="35" y="225" textAnchor="middle">
        3 V
      </text>
    </g>
  );
}
function Load({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 25}
        y={y - 14}
        width="50"
        height="28"
        rx="5"
        stroke={gold}
        strokeWidth="2"
        fill="#eee1c7"
      />
      <text x={x} y={y + 43} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
function Scale({
  range,
  value,
  unit,
  blocked,
  mode,
  progress,
}: {
  range: number;
  value: number | null;
  unit: string;
  blocked?: boolean;
  mode: LanguageMode;
  progress: number;
}) {
  return (
    <g>
      <path d="M110 290h400" stroke={ink} strokeWidth="2" />
      {Array.from({ length: 31 }, (_, i) => (
        <path
          key={i}
          d={`M${110 + (i * 400) / 30} 290v${i % 5 === 0 ? 12 : 6}`}
          stroke={ink}
        />
      ))}
      {[0, 10, 20, 30].map((i) => (
        <text key={i} x={110 + (i * 400) / 30} y="328" textAnchor="middle">
          {i}
        </text>
      ))}
      {value !== null && !blocked && (
        <path
          d={`M${110 + Math.min(1, Math.abs(value) / range) * 400} 265v23m-7-8 7 8 7-8`}
          stroke={blue}
          strokeWidth="3"
          fill="none"
        />
      )}
      {value !== null && !blocked && (
        <circle
          cx={110 + Math.min(1, Math.abs(value) / range) * 400 * progress}
          cy="290"
          r="6"
          fill={gold}
          stroke="white"
        />
      )}
      <text x="310" y="363" textAnchor="middle">
        {w(mode, '30格', '30 divisions')} · {fmt(range / 30)} {unit}/
        {w(mode, '格', 'div')}
      </text>
    </g>
  );
}
function AmmeterScene({
  index,
  mode,
  progress,
}: {
  index: number;
  mode: LanguageMode;
  progress: number;
}) {
  const m = ammeterCase(index);
  return (
    <g>
      <Battery />
      <path
        d={
          m.blocked
            ? 'M80 120V65H345m50 0h135v60m0 50v70H80V190'
            : 'M80 135V65H345m50 0h135v60m0 50v70H80V175'
        }
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <Load x={370} y={65} label="10 Ω" />
      {m.blocked ? (
        <>
          <path d="M530 125v50" stroke={ink} strokeWidth="3" />
          <path
            d="M80 120H155v35M80 190H130v5"
            fill="none"
            stroke={red}
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <circle cx="155" cy="180" r="25" fill="#f3e4df" stroke={red} />
          <text x="155" y="188" textAnchor="middle">
            A
          </text>
          <path d="M130 195h5" stroke={red} />
          <circle cx="80" cy="120" r="3" fill={red} />
          <circle cx="80" cy="190" r="3" fill={red} />
          <text x="370" y="175" textAnchor="middle">
            {w(
              mode,
              '不送电：错误并接',
              'Not energised: wrong parallel wiring',
            )}
          </text>
        </>
      ) : (
        <>
          <circle
            cx="530"
            cy="150"
            r="25"
            fill="#e2ecf0"
            stroke={blue}
            strokeWidth="2"
          />
          <text x="530" y="158" textAnchor="middle">
            A
          </text>
          <text x="310" y="185" textAnchor="middle">
            {w(mode, '量程', 'Range')} 0–{m.range} A
          </text>
        </>
      )}
      <Scale
        range={m.range}
        value={m.reading}
        blocked={m.blocked}
        unit="A"
        mode={mode}
        progress={progress}
      />
    </g>
  );
}
function VoltmeterScene({
  index,
  reversed,
  range,
  mode,
  progress,
}: {
  index: number;
  reversed: boolean;
  range: number;
  mode: LanguageMode;
  progress: number;
}) {
  const m = voltmeterCase(index, reversed, range),
    pairs = [
      [
        [200, 65],
        [330, 65],
      ],
      [
        [330, 65],
        [490, 65],
      ],
      [
        [80, 135],
        [80, 175],
      ],
    ] as const;
  const points = pairs[index]!,
    first = points[reversed ? 1 : 0],
    second = points[reversed ? 0 : 1];
  return (
    <g>
      <Battery />
      <path
        d="M80 135V65H230m50 0h115m50 0h85v180H80V175"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <Load x={255} y={65} label="10 Ω" />
      <Load x={420} y={65} label="20 Ω" />
      {[first, second].map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="5" fill={i === 0 ? red : ink} />
          <path
            d={`M${p[0]} ${p[1]}V${i === 0 ? 145 : 165}H${i === 0 ? 305 : 355}V215`}
            fill="none"
            stroke={i === 0 ? red : ink}
            strokeWidth="2"
            strokeDasharray="6 5"
          />
        </g>
      ))}
      <circle cx="330" cy="215" r="25" stroke={blue} fill="#e2ecf0" />
      <text x="330" y="223" textAnchor="middle">
        V
      </text>
      <text x="490" y="200" textAnchor="middle">
        {m.reading > 0 ? '+' : ''}
        {fmt(m.reading)} V
      </text>
      <Scale
        range={range}
        value={m.reading}
        unit="V"
        mode={mode}
        progress={progress}
      />
    </g>
  );
}
function AccountScene({
  energy,
  charge,
  progress,
}: {
  energy: number;
  charge: number;
  progress: number;
}) {
  const m = voltageAccount(energy, charge, progress);
  return (
    <g>
      {[
        [m.transferredCharge, 2, 'C', 110, blue],
        [m.transferredEnergy, 12, 'J', 245, gold],
      ].map(([v, max, unit, y, color]) => (
        <g key={String(unit)}>
          <text x="310" y={Number(y) - 30} textAnchor="middle">
            {fmt(Number(v))} {String(unit)} · 0–{String(max)} {String(unit)}
          </text>
          <rect
            x="120"
            y={Number(y)}
            width="380"
            height="28"
            rx="8"
            fill="#eee7f3"
          />
          <rect
            x="120"
            y={Number(y)}
            width={(380 * Number(v)) / Number(max)}
            height="28"
            rx="8"
            fill={String(color)}
          />
        </g>
      ))}
      <text x="310" y="345" textAnchor="middle">
        {fmt(m.voltage)} J/C = {fmt(m.voltage)} V
      </text>
    </g>
  );
}
function WireScene({
  length,
  area,
  progress,
  mode,
}: {
  length: number;
  area: number;
  progress: number;
  mode: LanguageMode;
}) {
  const width = 200 * length,
    height = 14 * Math.sqrt(area);
  return (
    <g>
      <text x="310" y="50" textAnchor="middle">
        {w(mode, '同材料、同温度', 'Same material, same temperature')}
      </text>
      <rect
        x="130"
        y="108"
        width="200"
        height="14"
        rx="7"
        fill={ink}
        opacity=".35"
      />
      <text x="310" y="158" textAnchor="middle">
        L₀ · A₀ · 10 Ω
      </text>
      <rect
        x="130"
        y={225 - height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill={blue}
      />
      <circle
        cx={130 + width * progress}
        cy="225"
        r="8"
        fill={gold}
        stroke="white"
      />
      <text x="310" y="278" textAnchor="middle">
        L={fmt(length)} L₀ · A={fmt(area)} A₀
      </text>
      <text x="310" y="345" textAnchor="middle">
        {w(
          mode,
          '形状检查，不是电荷流动',
          'Geometry inspection, not charge flow',
        )}
      </text>
    </g>
  );
}
function GraphScene({
  kind,
  index,
  voltage,
  seconds,
  progress,
  mode,
}: {
  kind: 'ohm' | 'power';
  index: number;
  voltage: number;
  seconds: number;
  progress: number;
  mode: LanguageMode;
}) {
  const ohm = kind === 'ohm',
    xmax = ohm ? 3 : 20,
    ymax = ohm ? 0.3 : 80,
    x = (v: number) => 110 + (420 * v) / xmax,
    y = (v: number) => 290 - (220 * v) / ymax;
  const activeVoltage = 3 * progress;
  const points = ohm
    ? Array.from({ length: 61 }, (_, i) => {
        const u = (3 * i) / 60;
        return [x(u), y(ohmReading(index, u).current)];
      })
    : [
        [110, 290],
        [x(seconds), y(electricPower(voltage, seconds).fullEnergy)],
      ];
  const active = ohm
    ? { x: x(activeVoltage), y: y(ohmReading(index, activeVoltage).current) }
    : {
        x: x(seconds * progress),
        y: y(electricPower(voltage, seconds, progress).energy),
      };
  return (
    <g>
      <path d="M110 60v230h420" stroke={ink} strokeWidth="2" fill="none" />
      {(ohm ? [0, 1, 2, 3] : [0, 5, 10, 15, 20]).map((v) => (
        <g key={v}>
          <path d={`M${x(v)} 290v6`} stroke={ink} />
          <text x={x(v)} y="325" textAnchor="middle">
            {v}
          </text>
        </g>
      ))}
      {(ohm ? [0, 0.1, 0.2, 0.3] : [0, 20, 40, 60, 80]).map((v) => (
        <g key={v}>
          <path
            d={`M110 ${y(v)}H530`}
            stroke={ink}
            strokeDasharray="3 7"
            opacity=".25"
          />
          <text x="92" y={y(v) + 7} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <text x="85" y="32" textAnchor="middle">
        {ohm ? 'I (A)' : 'E (J)'}
      </text>
      <text x="540" y="355" textAnchor="end">
        {ohm ? 'U (V)' : 't (s)'}
      </text>
      <polyline
        points={points.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke={blue}
        strokeWidth="3"
      />
      <circle cx={active.x} cy={active.y} r="7" fill={gold} />
      {ohm && (
        <circle
          cx={x(voltage)}
          cy={y(ohmReading(index, voltage).current)}
          r="10"
          fill="none"
          stroke={ink}
          strokeWidth="2"
        />
      )}
      <text x="330" y="30" textAnchor="middle">
        {w(
          mode,
          ohm ? '实心点：扫描；空心：自由查点' : '累计能量随规定时间变化',
          ohm
            ? 'Solid: sweep; ring: cursor'
            : 'Energy over assigned physical time',
        )}
      </text>
    </g>
  );
}
function FaultScene({
  index,
  progress,
  mode,
}: {
  index: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = faultCircuit(index),
    ys =
      m.resistances.length === 4
        ? [65, 125, 185, 245]
        : m.resistances.length === 3
          ? [80, 165, 250]
          : [90, 230];
  return (
    <g>
      <Battery />
      <path
        d="M80 135V40H110m50 0h30v245M80 175V310H540V40"
        stroke={ink}
        fill="none"
        strokeWidth="3"
      />
      <circle cx="110" cy="40" r="4" fill={ink} />
      <circle cx="160" cy="40" r="4" fill={ink} />
      <path
        d={m.isolated ? 'M114 40l35-23' : 'M114 40h42'}
        stroke={m.isolated ? red : blue}
        strokeWidth="3"
      />
      <text x="355" y="28" textAnchor="middle">
        {w(
          mode,
          m.isolated ? '保护保持断开' : '正常闭合',
          m.isolated ? 'Protection stays open' : 'Normal closed path',
        )}
      </text>
      {m.resistances.map((r, i) => (
        <g key={i}>
          <path
            d={`M190 ${ys[i]}H395m50 0h95`}
            stroke={r < 1 ? red : ink}
            strokeWidth="2"
            strokeDasharray={r < 1 ? '6 5' : undefined}
          />
          <Load x={420} y={ys[i]!} label={`${r} Ω`} />
          <circle cx="190" cy={ys[i]} r="4" fill={ink} />
          <circle cx="540" cy={ys[i]} r="4" fill={ink} />
        </g>
      ))}
      <circle cx="190" cy={40 + 245 * progress} r="8" fill={gold} />
      <text x="310" y="359" textAnchor="middle">
        {w(
          mode,
          '源内部0.5 Ω · 图示检查',
          'Source internal 0.5 Ω · diagram inspection',
        )}
      </text>
    </g>
  );
}
function QuantBench({ kind, mode, onExplore }: LabProps & { kind: QuantKind }) {
  const [choice, setChoice] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [reversed, setReversed] = useState(false),
    [range, setRange] = useState(3),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const defaults =
    kind === 'voltage'
      ? voltageCases[choice]!.charge
      : kind === 'resistance'
        ? wireCases[choice]!.length
        : kind === 'power'
          ? powerCases[choice]!.seconds
          : 3;
  const value = custom ?? defaults,
    canonical = Math.abs(value - defaults) < 1e-9 && !reversed && range === 3;
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      setProbe(1);
      if (canonical) {
        setRecords((old) => [...new Set([...old, choice])]);
        gate.record(String(choice));
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
      setReversed(false);
      setRange(3);
    };
  let scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[],
    slider: {
      name: Pair;
      unit: string;
      min: number;
      max: number;
      step: number;
    } | null = null;
  if (kind === 'ammeter') {
    const m = ammeterCase(choice);
    scene = <AmmeterScene index={choice} mode={mode} progress={progress} />;
    metrics = [
      {
        title: ['是否允许送电', 'Energising allowed'],
        value: (
          <B
            mode={mode}
            zh={m.blocked ? '阻止：错误并接' : '是：理想串联'}
            en={
              m.blocked
                ? 'Blocked: wrong parallel path'
                : 'Yes: ideal series path'
            }
          />
        ),
      },
      {
        title: ['电流表读数', 'Current-meter reading'],
        value: m.reading === null ? '—' : `${fmt(m.reading)} A`,
      },
      {
        title: ['每格数值', 'Value per division'],
        value: `${fmt(m.range / 30)} A`,
      },
    ];
    columns = [
      ['接法与量程', 'Wiring and range'],
      ['读数', 'Reading'],
      ['格数', 'Divisions'],
    ];
    row = (i) => {
      const a = ammeterCase(i);
      return [
        options.ammeter[i]!,
        a.reading === null
          ? ['未送电，无读数', 'Not energised; no reading']
          : `${fmt(a.reading)} A`,
        a.scale === null ? '—' : fmt(a.scale.divisions),
      ];
    };
  } else if (kind === 'voltage') {
    const c = voltageCases[choice]!,
      u = c.energy / c.charge,
      m = voltageAccount(u * value, value, progress);
    scene = (
      <AccountScene energy={m.energy} charge={m.charge} progress={progress} />
    );
    metrics = [
      {
        title: ['累计电荷', 'Cumulative charge'],
        value: `${fmt(m.transferredCharge)} C`,
      },
      {
        title: ['累计转移能量', 'Cumulative energy'],
        value: `${fmt(m.transferredEnergy)} J`,
      },
      {
        title: ['规定电压', 'Specified voltage'],
        value: `${fmt(m.voltage)} V`,
      },
    ];
    columns = [
      ['完整电荷', 'Full charge'],
      ['完整能量', 'Full energy'],
      ['电压', 'Voltage'],
    ];
    row = (i) => {
      const a = voltageCases[i]!;
      return [`${a.charge} C`, `${a.energy} J`, `${a.energy / a.charge} V`];
    };
    slider = {
      name: ['自由设置完整电荷', 'Free full-charge setting'],
      unit: 'C',
      min: 0.5,
      max: 2,
      step: 0.5,
    };
  } else if (kind === 'voltmeter') {
    const m = voltmeterCase(choice, reversed, range);
    scene = (
      <VoltmeterScene
        index={choice}
        reversed={reversed}
        range={range}
        mode={mode}
        progress={progress}
      />
    );
    metrics = [
      {
        title: ['带符号电压读数', 'Signed voltage reading'],
        value: `${m.reading > 0 ? '+' : ''}${fmt(m.reading)} V`,
      },
      {
        title: ['原串联通路电流', 'Original loop current'],
        value: `${fmt(m.circuit.sourceCurrent)} A`,
      },
      {
        title: ['每格数值', 'Value per division'],
        value: `${fmt(range / 30)} V`,
      },
    ];
    columns = [
      ['跨接位置', 'Probe connection'],
      ['正接读数', 'Forward reading'],
      ['原通路电流', 'Original loop current'],
    ];
    row = (i) => {
      const a = voltmeterCase(i);
      return [
        options.voltmeter[i]!,
        `${fmt(a.reading)} V`,
        `${fmt(a.circuit.sourceCurrent)} A`,
      ];
    };
  } else if (kind === 'resistance') {
    const area = wireCases[choice]!.area,
      m = wireResistance(value, area);
    scene = (
      <WireScene length={value} area={area} progress={progress} mode={mode} />
    );
    metrics = [
      { title: ['相对截面积', 'Relative area'], value: `${area} A₀` },
      { title: ['电阻', 'Resistance'], value: `${fmt(m.resistance)} Ω` },
      {
        title: ['同为3 V时的电流', 'Current at the same 3 V'],
        value: `${fmt(m.current)} A`,
      },
    ];
    columns = [
      ['线的条件', 'Wire condition'],
      ['电阻', 'Resistance'],
      ['3 V电流', '3 V current'],
    ];
    row = (i) => {
      const c = wireCases[i]!,
        a = wireResistance(c.length, c.area);
      return [
        options.resistance[i]!,
        `${fmt(a.resistance)} Ω`,
        `${fmt(a.current)} A`,
      ];
    };
    slider = {
      name: ['自由设置相对长度', 'Free relative length'],
      unit: 'L₀',
      min: 0.5,
      max: 2,
      step: 0.25,
    };
  } else if (kind === 'ohm') {
    const m = ohmReading(choice, value);
    scene = (
      <GraphScene
        kind="ohm"
        index={choice}
        voltage={value}
        seconds={0}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      { title: ['自由光标电压', 'Cursor voltage'], value: `${fmt(value)} V` },
      {
        title: ['该点电流', 'Current at cursor'],
        value: `${fmt(m.current)} A`,
      },
      {
        title: ['该点U/I', 'U/I at cursor'],
        value: m.resistance === null ? '—' : `${fmt(m.resistance)} Ω`,
      },
    ];
    columns = [
      ['扫描条件', 'Sweep condition'],
      ['1/2/3 V的电流(A)', 'Current at 1/2/3 V (A)'],
      ['对应U/I(Ω)', 'Corresponding U/I (Ω)'],
    ];
    row = (i) => {
      const a = ohmSweep(i);
      return [
        options.ohm[i]!,
        a.map((v) => fmt(v.current)).join(' / '),
        a.map((v) => fmt(v.resistance!)).join(' / '),
      ];
    };
    slider = {
      name: ['自由光标电压', 'Free cursor voltage'],
      unit: 'V',
      min: 0.5,
      max: 3,
      step: 0.5,
    };
  } else if (kind === 'power') {
    const voltage = powerCases[choice]!.voltage,
      m = electricPower(voltage, value, progress);
    scene = (
      <GraphScene
        kind="power"
        index={choice}
        voltage={voltage}
        seconds={value}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      {
        title: ['稳定电功率', 'Steady electrical power'],
        value: `${fmt(m.power)} W`,
      },
      {
        title: ['已累计物理时间', 'Elapsed physical time'],
        value: `${fmt(m.elapsed)} s`,
      },
      {
        title: ['已转移电能', 'Transferred energy'],
        value: `${fmt(m.energy)} J`,
      },
    ];
    columns = [
      ['规定条件', 'Assigned condition'],
      ['功率', 'Power'],
      ['完整能量', 'Full energy'],
    ];
    row = (i) => {
      const c = powerCases[i]!,
        a = electricPower(c.voltage, c.seconds);
      return [options.power[i]!, `${fmt(a.power)} W`, `${fmt(a.fullEnergy)} J`];
    };
    slider = {
      name: ['自由设置工作时间', 'Free operating interval'],
      unit: 's',
      min: 5,
      max: 20,
      step: 5,
    };
  } else {
    const m = faultCircuit(choice);
    scene = <FaultScene index={choice} progress={progress} mode={mode} />;
    metrics = [
      {
        title: ['未保护时推算电流', 'Prospective unprotected current'],
        value: `${fmt(m.prospectiveCurrent)} A`,
      },
      {
        title: ['规定保护阈值', 'Assigned isolation threshold'],
        value: `${m.threshold} A`,
      },
      {
        title: ['保护条件下的电流', 'Current with protection'],
        value: `${fmt(m.protectedCurrent)} A`,
      },
    ];
    columns = [
      ['检查条件', 'Inspection condition'],
      ['未保护推算(A)', 'Prospective current (A)'],
      ['保护后(A)', 'Protected current (A)'],
    ];
    row = (i) => {
      const a = faultCircuit(i);
      return [
        options.safety[i]!,
        fmt(a.prospectiveCurrent),
        fmt(a.protectedCurrent),
      ];
    };
  }
  const cell = (v: ReactNode) =>
    Array.isArray(v) ? (
      <B mode={mode} zh={String(v[0])} en={String(v[1])} />
    ) : (
      v
    );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-quant-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">ELECTRICITY / READ THE EVIDENCE</span>
        <B mode={mode} zh={titles[kind][0]} en={titles[kind][1]} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options[kind].map(([zh, en], id) => ({ zh, en, id }))}
        value={canonical ? choice : -1}
        set={choose}
        disabled={animation.running}
      />
      {slider && (
        <label className="phy-energy-probe">
          <B mode={mode} zh={slider.name[0]} en={slider.name[1]} /> ·{' '}
          {fmt(value)} {slider.unit}
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
      {kind === 'voltmeter' && (
        <div className="phy-lab-controls">
          <button
            className="phy-button secondary"
            disabled={animation.running}
            aria-pressed={reversed}
            onClick={() => {
              reset();
              setReversed(!reversed);
            }}
          >
            <B
              mode={mode}
              zh={reversed ? '恢复红黑顺序' : '交换红黑表笔'}
              en={reversed ? 'Restore probe order' : 'Swap red/black probes'}
            />
          </button>
          <button
            className="phy-button secondary"
            disabled={animation.running}
            onClick={() => {
              reset();
              setRange(range === 3 ? 15 : 3);
            }}
          >
            <B
              mode={mode}
              zh={`切到${range === 3 ? 15 : 3} V量程`}
              en={`Switch to ${range === 3 ? 15 : 3} V range`}
            />
          </button>
        </div>
      )}
      <svg
        viewBox="0 0 620 380"
        role="img"
        aria-label={mode === 'en' ? titles[kind][1] : titles[kind][0]}
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
      <p className="phy-model-note">
        <B mode={mode} zh={notes[kind][0]} en={notes[kind][1]} />
      </p>
      <label className="phy-energy-probe">
        <B mode={mode} zh="检查进度" en="Inspection progress" /> ·{' '}
        {Math.round(progress * 100)}%
        <input
          type="range"
          aria-label={mode === 'en' ? 'Inspection progress' : '检查进度'}
          min="0"
          max="100"
          step="5"
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
          <B mode={mode} zh="完整检查并记录" en="Inspect fully and record" />
        </button>
        <button className="phy-button secondary" onClick={reset}>
          <B mode={mode} zh="回到起点" en="Back to start" />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          mode={mode}
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整检查。`}
          en={`${gate.count}/3 required comparisons complete; seeking or free settings do not replace full inspection.`}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                mode={mode}
                zh="保留的模型比较（不是自己的实测）"
                en="Retained model comparisons (not your measurements)"
              />
            </caption>
            <thead>
              <tr>
                {columns.map(([zh, en]) => (
                  <th key={en}>
                    <B mode={mode} zh={zh} en={en} />
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
export const AmmeterLab = (p: LabProps) => <QuantBench {...p} kind="ammeter" />;
export const VoltageAccountLab = (p: LabProps) => (
  <QuantBench {...p} kind="voltage" />
);
export const VoltmeterLab = (p: LabProps) => (
  <QuantBench {...p} kind="voltmeter" />
);
export const ResistanceWireLab = (p: LabProps) => (
  <QuantBench {...p} kind="resistance" />
);
export const OhmSweepLab = (p: LabProps) => <QuantBench {...p} kind="ohm" />;
export const ElectricPowerLab = (p: LabProps) => (
  <QuantBench {...p} kind="power" />
);
export const ElectricSafetyLab = (p: LabProps) => (
  <QuantBench {...p} kind="safety" />
);
