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
import { hoistDrawing } from './machineGeometry';
import {
  leverLift,
  leverCases,
  turningEffect,
  turningCases,
  ropeHoist,
  pulleyCases,
  externalGears,
  gearCases,
  efficiencyCases,
} from './machineModels';
type Kind = 'lever' | 'turning' | 'pulley' | 'gears' | 'advantage' | 'real';
type Pair = [string, string];
const ink = '#a68ab7',
  blue = '#82adbd',
  gold = '#bb9361';
const fmt = (v: number) =>
  String(Number((Math.abs(v) < 1e-9 ? 0 : v).toFixed(2)));
const titles: Record<Kind, Pair> = {
  lever: ['支点两侧的距离交换', 'Distance trades across a pivot'],
  turning: ['力的作用线与力臂', 'Force line and moment arm'],
  pulley: ['沿绳路数承重段', 'Trace the rope and count support'],
  gears: ['一输入圈，几输出圈？', 'One input turn: how many output turns?'],
  advantage: ['省力与行程账本', 'Force and travel ledger'],
  real: ['有用输出与其他转移', 'Useful output and other transfers'],
};
const notes: Record<Kind, Pair> = {
  lever: [
    '30 N点载荷，轻刚杆、无摩擦铰链，两侧力始终竖直；人为控制缓慢0–15°抬升，忽略加速。图中两距离是沿杆量的r；真正力臂同时乘cosθ。支点反力向上F+W，图未画齐全部力。',
    '30 N point load, light rigid bar and frictionless hinge; both forces stay vertical. Operator-controlled slow 0–15° stroke, neglecting acceleration. Marked r distances run along the bar; both moment arms include cosθ. Pivot reaction is upward F+W; not all forces are drawn.',
  ],
  turning: [
    '50 N，指定轴与固定瞬时姿态；角度从支点到接触点的r量向F。虚线是作用线，蓝色短线是垂直力臂，不预测旋转速度或克服摩擦后的运动。',
    '50 N about a specified axis in one fixed instantaneous pose. Angle is from pivot-to-contact r toward F. Dashed line is the force line; blue segment is the perpendicular moment arm. Rotation rate or motion against friction is not predicted.',
  ],
  pulley: [
    '40 N载荷抬0.25 m，固定端在天花板；轻绳、轻轮、无摩擦、无伸长，承重段竖直。活动轮横杆连接同一载荷；固定轮只转向。图未画齐固定点/轮轴反力与各绳段张力。',
    '40 N load lifts 0.25 m, rope anchored to ceiling; light rope/wheels, no friction or stretch, vertical support strands. The moving wheels share one load through a connector; fixed wheels redirect. Individual tensions and anchor/axle reactions are not all drawn.',
  ],
  gears: [
    '两只固定轴外啮合轮、同齿距、不跳齿；输入12齿、2 N·m，转速可调。数圈演示始终是一输入圈，2.4秒播放不是标示rpm的真实时间。力矩/功率读数属于无损稳定传动；齿形不是制造图。',
    'Two fixed-axis external gears, matched tooth pitch, no skipped teeth. Input 12 teeth and 2 N·m, adjustable rpm. Each count demonstration is one input turn; 2.4 s playback is not the labelled rpm time scale. Torque/power readings assume lossless steady transfer; teeth are not manufacturing geometry.',
  ],
  advantage: [
    '40 N载荷，1/2/4段理想竖直承重绳；默认抬0.25 m，目标高度可改。自由端与载荷移动比为n，输入功=输出功；能量条和读数随当前行程变化。绳路图位置比例用于演示，不是设备尺寸图。',
    '40 N load with 1/2/4 ideal vertical support strands. Default lift 0.25 m, adjustable target height. Free-end/load travel ratio is n and input work equals output; bars and readings follow current travel. Rope geometry illustrates motion, not device dimensions.',
  ],
  real: [
    '同一两段绳路线、40 N载荷、抬0.25 m，效率是规定输入，不是由材料预测。忽略加速、轮/绳重量和伸长；把损耗合并到能量账本，不假设摩擦下各段张力相等。图只标手力与载荷重量，不是完整受力图。',
    'Same two-strand route, 40 N load and 0.25 m lift. Efficiency is assigned, not inferred from materials. Acceleration, wheel/rope weight and stretch are omitted; losses are aggregated in the energy ledger without assuming equal frictional tensions. Effort/weight labels are not a complete force diagram.',
  ],
};
function Arrow({
  x,
  y,
  dx = 0,
  dy,
  colour = blue,
}: {
  x: number;
  y: number;
  dx?: number;
  dy: number;
  colour?: string;
}) {
  const size = Math.hypot(dx, dy);
  if (size < 1e-9) return null;
  const ux = dx / size,
    uy = dy / size,
    ex = x + dx,
    ey = y + dy;
  return (
    <g stroke={colour} strokeWidth="3" fill="none">
      <path d={`M${x} ${y}l${dx} ${dy}`} />
      <path
        d={`M${ex - ux * 8 - uy * 6} ${ey - uy * 8 + ux * 6}L${ex} ${ey}l${-ux * 8 + uy * 6} ${-uy * 8 - ux * 6}`}
      />
    </g>
  );
}
function Wheel({
  x,
  y,
  r = 25,
  moving = false,
}: {
  x: number;
  y: number;
  r?: number;
  moving?: boolean;
}) {
  return (
    <g
      fill={moving ? '#e9def0' : '#f1ece5'}
      stroke={moving ? ink : gold}
      strokeWidth="2.5"
    >
      <circle cx={x} cy={y} r={r} />
      <circle cx={x} cy={y} r="4" fill={moving ? ink : gold} />
    </g>
  );
}
/** One continuous rope: top arcs on fixed redirectors, bottom arcs on moving wheels. */
function HoistScene({
  strands,
  lift,
  pull,
  force,
  weight,
  height,
}: {
  strands: number;
  lift: number;
  pull: number;
  force: number;
  weight: number;
  height: number;
}) {
  const { cy, endX, endY, loadX, loadY, rope } = hoistDrawing(
    strands,
    height,
    lift / height,
  );
  const wheels =
    strands === 1 ? (
      <>
        <Wheel x={210} y={70} r={22} />
        <path d="M210 45V28" />
      </>
    ) : strands === 2 ? (
      <>
        <Wheel x={215} y={cy} moving />
        <Wheel x={265} y={70} />
        <path d={`M215 ${cy}V${loadY}M265 45V28`} />
      </>
    ) : (
      <>
        <Wheel x={195} y={cy} moving />
        <Wheel x={295} y={cy} moving />
        <Wheel x={245} y={70} />
        <Wheel x={345} y={70} />
        <path d={`M195 ${cy}H295M245 ${cy}V${loadY}M245 45V28M345 45V28`} />
      </>
    );
  return (
    <g>
      <g stroke={ink} strokeWidth="3" fill="none">
        <path d="M145 28H405" />
        {wheels}
      </g>
      <path d={rope} fill="none" stroke={blue} strokeWidth="4" />
      <rect
        x={loadX - 36}
        y={loadY}
        width="72"
        height="39"
        rx="5"
        fill="#e4cfb0"
        stroke={gold}
      />
      <text x={loadX} y={loadY + 28} textAnchor="middle">
        {weight} N
      </text>
      <Arrow x={endX} y={endY} dy={(force / 40) * 35} />
      <text x={endX + 28} y={endY + 19}>
        {fmt(force)} N
      </text>
      <text x="435" y="62">
        n = {strands}
      </text>
      <text x="435" y="115">
        h {fmt(lift)} m
      </text>
      <text x="435" y="168">
        s {fmt(pull)} m
      </text>
    </g>
  );
}
function Gear({
  x,
  y,
  teeth,
  rotation,
  colour,
}: {
  x: number;
  y: number;
  teeth: number;
  rotation: number;
  colour: string;
}) {
  const r = teeth * 3,
    points: number[][] = [];
  for (let i = 0; i < teeth; i++)
    for (const [phase, rad] of [
      [-0.45, r - 3],
      [-0.2, r + 3],
      [0.2, r + 3],
      [0.45, r - 3],
    ]) {
      const a = ((i + phase!) * 2 * Math.PI) / teeth;
      points.push([x + rad! * Math.cos(a), y + rad! * Math.sin(a)]);
    }
  return (
    <g>
      <g transform={`rotate(${rotation} ${x} ${y})`}>
        <polygon
          points={points.map((p) => p.join(',')).join(' ')}
          fill={colour}
          stroke={ink}
          strokeWidth="1.6"
        />
        <circle cx={x + r * 0.55} cy={y} r="5" fill={ink} />
      </g>
      <circle cx={x} cy={y} r="5" fill={ink} />
      <text x={x} y="290" textAnchor="middle">
        {teeth}
      </text>
    </g>
  );
}
function MachineLab({ mode, onExplore, kind }: LabProps & { kind: Kind }) {
  const [arm, setArm] = useState(0.1),
    [loadArm, setLoadArm] = useState(0.1),
    [radius, setRadius] = useState(0.2),
    [angle, setAngle] = useState(90),
    [strands, setStrands] = useState(1),
    [teeth, setTeeth] = useState(12),
    [rpm, setRpm] = useState(6),
    [height, setHeight] = useState(0.25),
    [efficiency, setEfficiency] = useState(1),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-8;
  const preset =
    kind === 'lever'
      ? near(loadArm, 0.1)
        ? leverCases.findIndex((v) => near(v, arm))
        : -1
      : kind === 'turning'
        ? turningCases.findIndex(
            (v) => near(v.radius, radius) && near(v.angle, angle),
          )
        : kind === 'gears'
          ? rpm === 6
            ? gearCases.findIndex((v) => v === teeth)
            : -1
          : kind === 'real'
            ? efficiencyCases.findIndex((v) => near(v, efficiency))
            : kind === 'advantage' && !near(height, 0.25)
              ? -1
              : pulleyCases.findIndex((v) => v === strands);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      setProbe(1);
      if (preset >= 0) {
        setRecords((prev) => [...new Set([...prev, preset])]);
        gate.record(String(preset));
      }
    });
  const progress = animation.running ? animation.time / 2.4 : probe;
  const reset = () => {
    animation.reset();
    setProbe(0);
  };
  const choose = (i: number) => {
    reset();
    if (kind === 'lever') {
      setArm(leverCases[i]!);
      setLoadArm(0.1);
    }
    if (kind === 'turning') {
      setRadius(turningCases[i]!.radius);
      setAngle(turningCases[i]!.angle);
    }
    if (kind === 'gears') {
      setTeeth(gearCases[i]!);
      setRpm(6);
    }
    if (kind === 'real') setEfficiency(efficiencyCases[i]!);
    if (kind === 'pulley' || kind === 'advantage') {
      setStrands(pulleyCases[i]!);
      setHeight(0.25);
    }
  };
  let scene: ReactNode,
    options: Pair[],
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[],
    extra: ReactNode;
  if (kind === 'lever') {
    const m = leverLift(arm, loadArm, 30, progress),
      scale = 700,
      px = 350,
      py = 160,
      ex = px - arm * scale * Math.cos(m.angle),
      ey = py + arm * scale * Math.sin(m.angle),
      lx = px + loadArm * scale * Math.cos(m.angle),
      ly = py - loadArm * scale * Math.sin(m.angle);
    options = leverCases.map((v) => [
      `${v * 100} cm 动力侧`,
      `${v * 100} cm effort arm`,
    ]);
    scene = (
      <g>
        <path
          d={`M${px - arm * scale} ${py}H${px + loadArm * scale}`}
          stroke={ink}
          strokeDasharray="5 5"
          fill="none"
        />
        <path d={`M${ex} ${ey}L${lx} ${ly}`} stroke={ink} strokeWidth="9" />
        <path d={`M${px} ${py}l-25 55h50Z`} fill="#ece2f1" stroke={ink} />
        <rect
          x={lx - 28}
          y={ly - 42}
          width="56"
          height="40"
          fill="#dfc7a6"
          stroke={gold}
        />
        <Arrow x={ex} y={ey - (m.force / 60) * 70} dy={(m.force / 60) * 70} />
        <Arrow x={lx + 38} y={ly} dy={35} colour={gold} />
        <text x={ex} y={Math.max(35, ey - 65)} textAnchor="middle">
          {fmt(m.force)} N
        </text>
        <text x={lx + 40} y={ly + 69}>
          30 N
        </text>
        <text x="95" y="287">
          r {fmt(arm)} m
        </text>
        <text x="400" y="287">
          r {fmt(loadArm)} m
        </text>
      </g>
    );
    metrics = [
      {
        title: ['所需向下手力', 'Required downward effort'],
        value: `${fmt(m.force)} N`,
      },
      {
        title: ['当前手的下降', 'Current hand descent'],
        value: `${fmt(m.effortTravel * 100)} cm`,
      },
      {
        title: ['当前盒子升高', 'Current box rise'],
        value: `${fmt(m.loadRise * 100)} cm`,
      },
    ];
    extra = (
      <p className="phy-model-note">
        <B
          mode={mode}
          zh={`支点向上反力${fmt(m.support)} N；两侧力矩都${fmt(m.loadMoment)} N·m。当前输入/输出功${fmt(m.inputWork)}/${fmt(m.outputWork)} J。`}
          en={`Upward pivot reaction ${fmt(m.support)} N; each opposing moment ${fmt(m.loadMoment)} N·m. Current input/output work ${fmt(m.inputWork)}/${fmt(m.outputWork)} J.`}
        />
      </p>
    );
    columns = [
      ['动力侧', 'Effort arm'],
      ['手力', 'Effort'],
      ['手下降 / 盒升高', 'Hand descent / box rise'],
    ];
    row = (i) => {
      const a = leverLift(leverCases[i]!, 0.1);
      return [
        `${a.effortArm * 100} cm`,
        `${fmt(a.force)} N`,
        `${fmt(a.effortTravel * 100)} / ${fmt(a.loadRise * 100)} cm`,
      ];
    };
  } else if (kind === 'turning') {
    const m = turningEffect(radius, 50, angle),
      cx = 110,
      cy = 150,
      s = 900,
      x = cx + radius * s,
      fx = cx + m.footX * s,
      fy = cy - m.footY * s,
      ux = Math.cos(m.radians),
      uy = -Math.sin(m.radians);
    options = turningCases.map((c) => [
      `${c.radius * 100} cm · ${c.angle}°`,
      `${c.radius * 100} cm · ${c.angle}°`,
    ]);
    scene = (
      <g>
        <path d={`M${cx} ${cy}H${x}`} stroke={ink} strokeWidth="10" />
        <circle cx={cx} cy={cy} r="10" fill="#e7ddee" stroke={ink} />
        <path
          d={`M${x - ux * 240} ${cy - uy * 240}l${ux * 330} ${uy * 330}`}
          stroke={gold}
          strokeDasharray="5 5"
          fill="none"
        />
        <path
          d={`M${cx} ${cy}L${fx} ${fy}`}
          stroke={blue}
          strokeWidth="4"
          fill="none"
        />
        <Arrow x={x} y={cy} dx={ux * 90} dy={uy * 90} colour={gold} />
        <circle cx={x} cy={cy} r="5" fill={gold} />
        <text x="420" y="86">
          F 50 N
        </text>
        <text x="420" y="145">
          θ {angle}°
        </text>
        <text x="420" y="204">
          {fmt(m.signedMoment)} N·m
        </text>
        <text x="90" y="298">
          r {fmt(radius)} m
        </text>
      </g>
    );
    metrics = [
      {
        title: ['接触点离轴', 'Pivot-to-contact r'],
        value: `${fmt(radius)} m`,
      },
      {
        title: ['垂直力臂', 'Perpendicular moment arm'],
        value: `${fmt(m.perpendicularArm)} m`,
      },
      {
        title: ['转动作用大小', 'Torque magnitude'],
        value: `${fmt(m.signedMoment)} N·m`,
      },
    ];
    columns = [
      ['r / 角度', 'r / angle'],
      ['垂直力臂', 'Moment arm'],
      ['力矩', 'Torque'],
    ];
    row = (i) => {
      const c = turningCases[i]!,
        a = turningEffect(c.radius, 50, c.angle);
      return [
        `${c.radius * 100} cm · ${c.angle}°`,
        `${fmt(a.perpendicularArm)} m`,
        `${fmt(a.signedMoment)} N·m`,
      ];
    };
  } else if (kind === 'gears') {
    const m = externalGears(12, teeth, rpm, 2, progress),
      ox = 150 + 36 + teeth * 3;
    options = gearCases.map((v) => [`${v}齿输出`, `${v}-tooth output`]);
    scene = (
      <g>
        <Gear
          x={150}
          y={135}
          teeth={12}
          rotation={progress * 360}
          colour="#eadff0"
        />
        <Gear
          x={ox}
          y={135}
          teeth={teeth}
          rotation={180 + 180 / teeth + m.outputTurns * 360}
          colour="#e1eef3"
        />
        <text x="420" y="70">
          ↻ {rpm} rpm
        </text>
        <text x="420" y="126">
          ↺ {fmt(Math.abs(m.outputRpm))} rpm
        </text>
        <text x="420" y="185">
          {fmt(m.outputTorque)} N·m
        </text>
      </g>
    );
    metrics = [
      { title: ['当前输入圈数', 'Current input turns'], value: fmt(progress) },
      {
        title: ['当前反向输出圈数', 'Current opposite output turns'],
        value: fmt(Math.abs(m.outputTurns)),
      },
      {
        title: ['理想输出力矩', 'Ideal output torque'],
        value: `${fmt(m.outputTorque)} N·m`,
      },
    ];
    extra = (
      <p className="phy-model-note">
        <B
          mode={mode}
          zh={`理想输入/输出功率${fmt(m.powerIn)}/${fmt(m.powerOut)} W。方向箭头表示转向；N·m读数是力矩，不是直接的J功读数。`}
          en={`Ideal input/output power ${fmt(m.powerIn)}/${fmt(m.powerOut)} W. Direction arrows indicate rotation; N·m measures torque rather than directly reporting joules of work.`}
        />
      </p>
    );
    columns = [
      ['输入 / 输出齿数', 'Input / output teeth'],
      ['输出转速大小', 'Output speed magnitude'],
      ['一输入圈的输出', 'Output per input turn'],
    ];
    row = (i) => {
      const a = externalGears(12, gearCases[i]!);
      return [
        `12 / ${a.outputTeeth}`,
        `${fmt(Math.abs(a.outputRpm))} rpm`,
        <B
          key={i}
          mode={mode}
          zh={`反向${fmt(Math.abs(a.outputTurns))}圈`}
          en={`${fmt(Math.abs(a.outputTurns))} opposite turns`}
        />,
      ];
    };
  } else {
    const n = kind === 'real' ? 2 : strands,
      eta = kind === 'real' ? efficiency : 1,
      h = kind === 'advantage' ? height : 0.25,
      m = ropeHoist(n, 40, h, eta, progress);
    options =
      kind === 'real'
        ? efficiencyCases.map((v) => [
            `${v * 100}% 效率`,
            `${v * 100}% efficiency`,
          ])
        : pulleyCases.map((v) => [`${v}段承重绳`, `${v} support strands`]);
    scene = (
      <HoistScene
        strands={n}
        lift={m.lift}
        pull={m.pull}
        force={m.force}
        weight={40}
        height={h}
      />
    );
    metrics = [
      { title: ['所需手力', 'Required effort'], value: `${fmt(m.force)} N` },
      {
        title: ['当前拉绳距离', 'Current rope pull'],
        value: `${fmt(m.pull)} m`,
      },
      {
        title: ['当前载荷升高', 'Current load rise'],
        value: `${fmt(m.lift)} m`,
      },
    ];
    if (kind !== 'pulley')
      extra = (
        <>
          <p className="phy-model-note">
            <B
              mode={mode}
              zh={`几何拉距比${n}；实际力优势${fmt(m.advantage)}，效率${fmt(eta * 100)}%。当前能量账本：`}
              en={`Geometric travel ratio ${n}; actual force advantage ${fmt(m.advantage)}, efficiency ${fmt(eta * 100)}%. Current energy ledger:`}
            />
          </p>
          <EnergyBars
            mode={mode}
            scale={20}
            rows={[
              {
                label: ['输入功', 'Input work'],
                value: m.inputWork,
                color: ink,
              },
              {
                label: ['载荷升高所得', 'Load-rise gain'],
                value: m.outputWork,
                color: blue,
              },
              {
                label: ['其他转移', 'Other transfers'],
                value: m.loss,
                color: gold,
              },
            ]}
          />
        </>
      );
    columns =
      kind === 'real'
        ? [
            ['效率', 'Efficiency'],
            ['手力 / 实际力优势', 'Effort / actual advantage'],
            ['输入 / 输出 / 差额', 'Input / output / difference'],
          ]
        : [
            ['承重段数', 'Support strands'],
            ['手力 / 拉距', 'Effort / pull'],
            ['输入 / 输出功', 'Input / output work'],
          ];
    row = (i) => {
      const a =
        kind === 'real'
          ? ropeHoist(2, 40, 0.25, efficiencyCases[i]!)
          : ropeHoist(pulleyCases[i]!);
      return kind === 'real'
        ? [
            `${a.efficiency * 100}%`,
            `${fmt(a.force)} N / ${fmt(a.advantage)}`,
            `${fmt(a.inputWork)} / ${fmt(a.outputWork)} / ${fmt(a.loss)} J`,
          ]
        : [
            a.strands,
            `${fmt(a.force)} N / ${fmt(a.pull)} m`,
            `${fmt(a.inputWork)} / ${fmt(a.outputWork)} J`,
          ];
    };
  }
  const slider = (
    title: Pair,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    set: (v: number) => void,
  ) => (
    <label className="phy-energy-probe">
      <B mode={mode} zh={title[0]} en={title[1]} /> · {fmt(value)} {unit}
      <input
        type="range"
        aria-label={mode === 'en' ? title[1] : title[0]}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={animation.running}
        onChange={(e) => {
          reset();
          set(Number(e.target.value));
        }}
      />
    </label>
  );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-machine-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">MACHINES / A FAIR TRADE</span>
        <B mode={mode} zh={titles[kind][0]} en={titles[kind][1]} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options.map(([zh, en], id) => ({ id, zh, en }))}
        value={preset}
        set={choose}
        disabled={animation.running}
      />
      {kind === 'lever' && (
        <>
          {slider(
            ['动力侧沿杆距离', 'Effort-side distance along bar'],
            arm * 100,
            10,
            40,
            5,
            'cm',
            (v) => setArm(v / 100),
          )}
          {slider(
            ['载荷侧沿杆距离', 'Load-side distance along bar'],
            loadArm * 100,
            5,
            20,
            5,
            'cm',
            (v) => setLoadArm(v / 100),
          )}
        </>
      )}
      {kind === 'turning' && (
        <>
          {slider(
            ['支点到接触点距离', 'Pivot-to-contact distance'],
            radius * 100,
            5,
            25,
            5,
            'cm',
            (v) => setRadius(v / 100),
          )}
          {slider(
            ['力与把手夹角', 'Force-to-handle angle'],
            angle,
            0,
            90,
            15,
            '°',
            setAngle,
          )}
        </>
      )}
      {kind === 'gears' &&
        slider(
          ['输入转速', 'Input rotation rate'],
          rpm,
          3,
          12,
          1,
          'rpm',
          setRpm,
        )}
      {kind === 'advantage' &&
        slider(
          ['目标抬升高度', 'Target lift height'],
          height,
          0.1,
          0.5,
          0.05,
          'm',
          setHeight,
        )}
      {kind === 'real' &&
        slider(
          ['规定效率', 'Assigned efficiency'],
          efficiency * 100,
          50,
          100,
          5,
          '%',
          (v) => setEfficiency(v / 100),
        )}
      <svg
        viewBox="0 0 620 340"
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
      {extra}
      <p className="phy-model-note">
        <B mode={mode} zh={notes[kind][0]} en={notes[kind][1]} />
      </p>
      {kind === 'turning' ? (
        <>
          <div className="phy-pressure-inspection" aria-hidden="true">
            <span style={{ left: `${4 + 92 * progress}%` }} />
            <i />
            <i />
            <i />
          </div>
          <p className="phy-model-note">
            <B
              mode={mode}
              zh="绿点是检查顺序，不表示扳手的运动。"
              en="The green marker shows inspection order, not wrench motion."
            />
          </p>
        </>
      ) : (
        <p className="phy-model-note">
          <B
            mode={mode}
            zh="受控动作/数圈示意，不计算自由加速；播放时长不是实验计时。"
            en="Controlled movement/turn counting, without free-acceleration calculation; playback duration is not experiment timing."
          />
        </p>
      )}
      <label className="phy-energy-probe">
        <B
          mode={mode}
          zh={kind === 'turning' ? '检查进度' : '动作进度'}
          en={kind === 'turning' ? 'Inspection progress' : 'Movement progress'}
        />{' '}
        · {Math.round(progress * 100)} %
        <input
          type="range"
          aria-label={
            mode === 'en'
              ? kind === 'turning'
                ? 'Inspection progress'
                : 'Movement progress'
              : kind === 'turning'
                ? '检查进度'
                : '动作进度'
          }
          min="0"
          max="100"
          step="1"
          value={Math.round(progress * 100)}
          disabled={animation.running}
          onChange={(e) => setProbe(Number(e.target.value) / 100)}
        />
      </label>
      <button
        className="phy-button"
        disabled={animation.running}
        onClick={() => {
          setProbe(0);
          animation.start();
        }}
      >
        <B
          mode={mode}
          zh={
            animation.running
              ? '进行中…'
              : kind === 'turning'
                ? '完整检查作用线'
                : '完成一次演示'
          }
          en={
            animation.running
              ? 'Running…'
              : kind === 'turning'
                ? 'Inspect the complete force line'
                : 'Complete one demonstration'
          }
        />
      </button>
      <p role="status" className="phy-force-record">
        <B
          mode={mode}
          zh={`已比较 ${gate.count}/3：完成三组规定过程。拖动与其他自由条件不会替代它们。`}
          en={`Compared ${gate.count}/3: complete three prescribed runs. Seeking and other custom conditions do not replace them.`}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                mode={mode}
                zh="保留比较 · 完整终点模型结果"
                en="Retained comparisons · Complete endpoint model results"
              />
            </caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c[1]} scope="col">
                    <B mode={mode} zh={c[0]} en={c[1]} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((i) => (
                <tr key={i}>
                  {row(i).map((v, j) =>
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
      )}
    </div>
  );
}
export const LeverLab = (p: LabProps) => <MachineLab {...p} kind="lever" />;
export const TurningLab = (p: LabProps) => <MachineLab {...p} kind="turning" />;
export const PulleyLab = (p: LabProps) => <MachineLab {...p} kind="pulley" />;
export const GearsLab = (p: LabProps) => <MachineLab {...p} kind="gears" />;
export const AdvantageLab = (p: LabProps) => (
  <MachineLab {...p} kind="advantage" />
);
export const RealMachineLab = (p: LabProps) => (
  <MachineLab {...p} kind="real" />
);
