import { useState, type ReactNode } from 'react';
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
  axisReading,
  walkingReading,
  straightGradient,
  velocityArea,
  heatingLine,
  acceleratingReading,
  curveInterval,
  graphExperiment,
  graphDefault,
  type GraphKind,
} from './graphModels';
type Pair = [string, string];
const w = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const f = (n: number) => String(Number(n.toFixed(4)));
const ink = '#283d48',
  white = '#eeece0',
  blue = '#93c5cf',
  gold = '#e3c68d',
  red = '#ce9292',
  muted = '#657881';
const titles: Record<GraphKind, Pair> = {
  axes: ['读轴与单位窗口', 'Axes and unit window'],
  reading: ['位置图与返回故事', 'Position graph and return story'],
  gradient: ['有单位的斜率三角形', 'Unit-bearing gradient triangles'],
  area: ['速度面积与行程账', 'Velocity area and trip ledger'],
  linear: ['初温与升温直线', 'Initial temperature and heating lines'],
  curve: ['曲线与变量变换', 'Curves and transformed variables'],
  experiment: ['重复读数与拟合证据', 'Repeats and fitting evidence'],
};
const options: Record<GraphKind, Pair[]> = {
  axes: [
    ['s · m', 's · m'],
    ['s · cm', 's · cm'],
    ['min · m', 'min · m'],
  ],
  reading: [
    ['看到2 s', 'Observe to 2 s'],
    ['看到3 s', 'Observe to 3 s'],
    ['看到5 s', 'Observe to 5 s'],
  ],
  gradient: [
    ['+1 m/s', '+1 m/s'],
    ['+2 m/s', '+2 m/s'],
    ['−1 m/s', '−1 m/s'],
  ],
  area: [
    ['匀速向右', 'Steady right'],
    ['等时往返', 'Equal-time return'],
    ['线性增速', 'Linear velocity ramp'],
  ],
  linear: [
    ['20°C · 100 W', '20°C · 100 W'],
    ['30°C · 100 W', '30°C · 100 W'],
    ['20°C · 200 W', '20°C · 200 W'],
  ],
  curve: [
    ['1→2 s · x–t', '1→2 s · x–t'],
    ['4→5 s · x–t', '4→5 s · x–t'],
    ['4→5 s · x–t²', '4→5 s · x–t²'],
  ],
  experiment: [
    ['细刻度未校零', 'Fine, uncorrected'],
    ['细刻度校零', 'Fine, zero-corrected'],
    ['粗刻度未校零', 'Coarse, uncorrected'],
  ],
};
const notes: Record<GraphKind, Pair> = {
  axes: [
    '从位置2 m开始，向右匀速1 m/s，观察0–6 s。换单位保留同一过程；图形重标刻度，地面尺仍0–8 m。所选观察时长压缩成2.4秒；本图不是坡度照片。',
    'Start at 2 m, moving steadily right at 1 m/s over 0–6 s. Unit changes preserve the event; the graph relabels ticks while the ground ruler remains 0–8 m. Selected observation duration compresses to 2.4 seconds; this is not a photograph of a slope.',
  ],
  reading: [
    '分段指令：0–2 s向右2 m/s，2–4 s停留，4–6 s向左2 m/s，从位置1 m开始。忽略瞬间启停过渡；不是受力求出的真实转弯。全程图线与0–8 m地面尺共用位置模型。',
    'Piecewise instructions: right at 2 m/s for 0–2 s, wait 2–4 s, left at 2 m/s for 4–6 s, starting at 1 m. Instant start/turn transitions are omitted; this is not a force-derived turn. Graph and 0–8 m ground ruler share one position model.',
  ],
  gradient: [
    '三条匀速位置线从6 m开始，共用0–4 s及0–16 m刻度。每次读2秒区间；高/扁图只改变排版。金点巡查区间，不表示2.4秒真实行进；斜率仍由读数差求得。',
    'Three steady position lines start at 6 m and share 0–4 s/0–16 m scales. Each reading interval lasts two seconds; tall/flat only changes layout. Gold markers inspect the interval, not a physical 2.4-second trip. Gradient uses reading differences.',
  ],
  area: [
    '指令模型，共用0–6 s和−3至5 m/s图框，位置尺0–12 m。往返例理想化瞬间换向，不求转弯力；增速例a=2/3 m/s²。所选时长压缩为2.4秒；正负面积按速度积分，路程按速率累计。',
    'Instruction model sharing 0–6 s/−3 to 5 m/s graph and 0–12 m position ruler. Return uses an ideal instant reversal without turn forces; ramp uses a=2/3 m/s². Selected duration compresses to 2.4 seconds. Signed velocity area gives displacement and speed area accumulates distance.',
  ],
  linear: [
    '完美隔热、恒定输入功率、热容100 J/K、不相变的教学金属块，窗口0–6 s。温差1 K等于1°C温差。三线共用0–50°C尺；时长压缩2.4秒，不预测真实材料散热或温度精度。',
    'Teaching metal block with ideal insulation, constant power and heat capacity 100 J/K, without phase change, for 0–6 s. A 1 K change equals a 1°C change. Lines share 0–50°C; duration compresses to 2.4 seconds. Real losses and measurement precision are not predicted.',
  ],
  curve: [
    '初速0、x初=0、恒定加速度1 m/s²，x=½t²、v=t（SI）。每次比较宽度1 s。x–t用0–6 s，x–t²用0–36 s²，同一运动。金点沿模型时刻巡查；两点比是区间斜率，不是任意时刻切线。',
    'Zero initial position/velocity with constant a=1 m/s²: x=½t² and v=t in SI. Compare one-second intervals. x–t spans 0–6 s; x–t² spans 0–36 s² for the same event. Gold markers inspect model times; two-point ratios are interval slopes, not arbitrary local tangents.',
  ],
  experiment: [
    '五个力值各三次合成教学读数；细分辨率0.1 cm，粗读数按1 cm四舍五入。拟合使用五个均值的最小二乘直线。竖线为重复读数最小–最大，不是置信区间；金点读拟合线。校零保留原始值；强制原点是可比较的额外假设。',
    'Five forces with three synthetic readings each. Fine resolution 0.1 cm; coarse readings round to 1 cm. A least-squares line uses five means. Vertical spans are repeat min/max, not confidence intervals; gold markers read the fit. Correction retains originals; an origin constraint is an extra comparison assumption.',
  ],
};
const sliders: Record<
  GraphKind,
  { title: Pair; min: number; max: number; step: number; unit: string }
> = {
  axes: {
    title: ['自由观察时长', 'Free observation duration'],
    min: 0,
    max: 6,
    step: 0.5,
    unit: 's',
  },
  reading: {
    title: ['自由观察时长', 'Free observation duration'],
    min: 0,
    max: 6,
    step: 0.5,
    unit: 's',
  },
  gradient: {
    title: ['自由区间起点', 'Free interval start'],
    min: 0,
    max: 2,
    step: 0.5,
    unit: 's',
  },
  area: {
    title: ['自由观察时长', 'Free observation duration'],
    min: 0,
    max: 6,
    step: 0.5,
    unit: 's',
  },
  linear: {
    title: ['自由输入功率', 'Free input power'],
    min: 50,
    max: 200,
    step: 50,
    unit: 'W',
  },
  curve: {
    title: ['自由区间起点', 'Free interval start'],
    min: 0,
    max: 5,
    step: 0.5,
    unit: 's',
  },
  experiment: {
    title: ['自由零点校正量', 'Free zero correction'],
    min: 0,
    max: 3,
    step: 0.5,
    unit: 'cm',
  },
};
const title = (mode: LanguageMode, zh: string, en: string) => (
  <text x="310" y="32" textAnchor="middle" style={{ fontSize: 21 }}>
    {w(mode, zh, en)}
  </text>
);
type Point = { x: number; y: number };
function Plot({
  maxX,
  minY = 0,
  maxY,
  xLabel,
  yLabel,
  children,
  height = 205,
}: {
  maxX: number;
  minY?: number;
  maxY: number;
  xLabel: string;
  yLabel: string;
  children: (pos: (x: number, y: number) => Point) => ReactNode;
  height?: number;
}) {
  const pos = (x: number, y: number) => ({
    x: 75 + (470 * x) / maxX,
    y: 290 - (height * (y - minY)) / (maxY - minY),
  });
  return (
    <g>
      <path d={`M75 ${290 - height - 10}V290H562`} stroke={white} fill="none" />
      {[0, 0.5, 1].map((n) => {
        const y = minY + (maxY - minY) * n;
        return (
          <g key={n}>
            <path
              d={`M75 ${pos(0, y).y}H545`}
              stroke={muted}
              strokeDasharray="3 5"
            />
            <text
              x="64"
              y={pos(0, y).y + 5}
              textAnchor="end"
              style={{ fontSize: 18 }}
            >
              {f(y)}
            </text>
            <path d={`M${pos(maxX * n, minY).x} 290v6`} stroke={white} />
            <text
              x={pos(maxX * n, minY).x}
              y="315"
              textAnchor="middle"
              style={{ fontSize: 18 }}
            >
              {f(maxX * n)}
            </text>
          </g>
        );
      })}
      <text x="75" y={290 - height - 20} style={{ fontSize: 21 }}>
        {yLabel}
      </text>
      <text x="555" y="340" textAnchor="end" style={{ fontSize: 21 }}>
        {xLabel}
      </text>
      {children(pos)}
    </g>
  );
}
function line(points: Point[]) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
}
function sample(
  fn: (t: number) => number,
  to: number,
  pos: (x: number, y: number) => Point,
  xTransform = (t: number) => t,
) {
  return line(
    Array.from({ length: 81 }, (_, i) => {
      const t = (to * i) / 80;
      return pos(xTransform(t), fn(t));
    }),
  );
}
function Pointer({ point, baseY = 290 }: { point: Point; baseY?: number }) {
  return (
    <g>
      <path
        d={`M75 ${point.y}H${point.x}V${baseY}`}
        stroke={gold}
        fill="none"
        strokeDasharray="5 4"
      />
      <circle cx={point.x} cy={point.y} r="6" fill={gold} />
    </g>
  );
}
function Track({ position, max = 8 }: { position: number; max?: number }) {
  const x = 75 + (470 * position) / max;
  return (
    <g>
      <path d="M75 363H545" stroke={muted} />
      <text x="75" y="395" textAnchor="middle" style={{ fontSize: 18 }}>
        0
      </text>
      <text x="545" y="395" textAnchor="middle" style={{ fontSize: 18 }}>
        {max} m
      </text>
      <g transform={`translate(${x},350)`}>
        <rect x="-14" y="-13" width="28" height="18" rx="4" fill={blue} />
        <circle cx="-8" cy="9" r="5" fill={white} />
        <circle cx="8" cy="9" r="5" fill={white} />
      </g>
    </g>
  );
}
function Triangle({ a, b }: { a: Point; b: Point }) {
  return (
    <g>
      <path
        d={`M${a.x} ${a.y}H${b.x}V${b.y}Z`}
        fill="none"
        stroke={gold}
        strokeDasharray="5 4"
      />
      <circle cx={a.x} cy={a.y} r="5" fill={blue} />
      <circle cx={b.x} cy={b.y} r="5" fill={blue} />
    </g>
  );
}
type GraphData = {
  scene: ReactNode;
  metrics: { title: Pair; value: ReactNode }[];
  row: string[];
  steps: Pair[];
};
function data(
  kind: GraphKind,
  index: number,
  value: number,
  p: number,
  extra: boolean,
  mode: LanguageMode,
): GraphData {
  const metrics: GraphData['metrics'] = [];
  const metric = (title: Pair, value: ReactNode) =>
    metrics.push({ title, value });
  let scene: ReactNode, row: string[], steps: Pair[];
  switch (kind) {
    case 'axes': {
      const m = axisReading(index, value * p),
        full = axisReading(index, value),
        max = axisReading(index, 6);
      scene = (
        <>
          {title(
            mode,
            '两个轴，两份有单位的读数',
            'Two axes, two unit-bearing readings',
          )}
          <Plot
            maxX={max.horizontal || 0.1}
            maxY={8 * (index === 1 ? 100 : 1)}
            xLabel={`t / ${m.timeUnit}`}
            yLabel={`x / ${m.positionUnit}`}
          >
            {(pos) => (
              <>
                <path
                  d={line([
                    pos(0, 2 * (index === 1 ? 100 : 1)),
                    pos(max.horizontal, max.vertical),
                  ])}
                  stroke={blue}
                  fill="none"
                  strokeWidth="3"
                />
                <Pointer point={pos(m.horizontal, m.vertical)} />
              </>
            )}
          </Plot>
          <Track position={m.position} />
        </>
      );
      metric(['图上时间', 'Graph time'], `${f(m.horizontal)} ${m.timeUnit}`);
      metric(
        ['图上位置', 'Graph position'],
        `${f(m.vertical)} ${m.positionUnit}`,
      );
      metric(['当前实际路程', 'Current distance'], `${f(m.position - 2)} m`);
      row = [
        `${f(full.horizontal)} ${full.timeUnit}`,
        `${f(full.vertical)} ${full.positionUnit}`,
        `${f(full.position - 2)} m`,
      ];
      steps = [
        [
          '先读t的时间单位与x的位置单位',
          'Read time unit of t and position unit of x',
        ],
        [
          `t = ${f(full.horizontal)} ${full.timeUnit}，x = ${f(full.vertical)} ${full.positionUnit}`,
          `t = ${f(full.horizontal)} ${full.timeUnit}, x = ${f(full.vertical)} ${full.positionUnit}`,
        ],
        [
          '换单位不改变运动，也不改变起点2 m',
          'Changing units leaves the event and 2 m start unchanged',
        ],
      ];
      break;
    }
    case 'reading': {
      const m = walkingReading(value * p),
        full = walkingReading(value);
      scene = (
        <>
          {title(
            mode,
            '位置线与同一地面尺',
            'Position line and the same ground ruler',
          )}
          <Plot maxX={6} maxY={8} xLabel="t / s" yLabel="x / m">
            {(pos) => (
              <>
                <path
                  d={line([pos(0, 1), pos(2, 5), pos(4, 5), pos(6, 1)])}
                  stroke={blue}
                  fill="none"
                  strokeWidth="3"
                />
                <Pointer point={pos(m.seconds, m.position)} />
              </>
            )}
          </Plot>
          <Track position={m.position} />
        </>
      );
      metric(['当前时刻', 'Current time'], `${f(m.seconds)} s`);
      metric(['当前位移', 'Current displacement'], `${f(m.displacement)} m`);
      metric(['当前累积路程', 'Current distance'], `${f(m.distance)} m`);
      row = [
        `${value} s`,
        `${f(full.position)} m`,
        `${f(full.displacement)} m`,
        `${f(full.distance)} m`,
      ];
      steps = [
        [
          `t = ${value} s → x = ${f(full.position)} m`,
          `t = ${value} s → x = ${f(full.position)} m`,
        ],
        [
          `Δx = ${f(full.position)} − 1 = ${f(full.displacement)} m`,
          `Δx = ${f(full.position)} − 1 = ${f(full.displacement)} m`,
        ],
        [
          `累积各段路程 = ${f(full.distance)} m`,
          `Sum of path lengths = ${f(full.distance)} m`,
        ],
      ];
      break;
    }
    case 'gradient': {
      const m = straightGradient(index, value),
        time = m.a + 2 * p;
      scene = (
        <>
          {title(
            mode,
            '读数比不受图框形状影响',
            'Reading ratios do not depend on frame shape',
          )}
          <Plot
            maxX={4}
            maxY={16}
            height={extra ? 115 : 205}
            xLabel="t / s"
            yLabel="x / m"
          >
            {(pos) => (
              <>
                <path
                  d={line([pos(0, 6), pos(4, 6 + 4 * m.velocity)])}
                  stroke={blue}
                  fill="none"
                  strokeWidth="3"
                />
                <Triangle a={pos(m.a, m.ya)} b={pos(m.b, m.yb)} />
                <Pointer point={pos(time, 6 + m.velocity * time)} />
              </>
            )}
          </Plot>
          <text x="310" y="381" textAnchor="middle" style={{ fontSize: 23 }}>
            Δx/Δt = {f(m.rise)} m / {f(m.run)} s = {f(m.gradient)} m/s
          </text>
        </>
      );
      metric(['纵向位置差', 'Position rise'], `${f(m.rise)} m`);
      metric(['横向时间差', 'Time run'], `${f(m.run)} s`);
      metric(['有单位斜率', 'Unit-bearing gradient'], `${f(m.gradient)} m/s`);
      row = [`${f(m.ya)}→${f(m.yb)} m`, `${m.a}→${m.b} s`, `${m.gradient} m/s`];
      steps = [
        [
          `Δx = ${f(m.yb)} − ${f(m.ya)} = ${f(m.rise)} m`,
          `Δx = ${f(m.yb)} − ${f(m.ya)} = ${f(m.rise)} m`,
        ],
        [`Δt = ${m.b} − ${m.a} = 2 s`, `Δt = ${m.b} − ${m.a} = 2 s`],
        [
          `斜率 = ${f(m.gradient)} m/s；画面高矮不改变读数`,
          `Gradient = ${f(m.gradient)} m/s; display shape leaves readings unchanged`,
        ],
      ];
      break;
    }
    case 'area': {
      const m = velocityArea(index, value * p),
        full = velocityArea(index, value);
      scene = (
        <>
          {title(
            mode,
            '正负面积：先看速度的符号',
            'Signed areas: read velocity signs first',
          )}
          <Plot maxX={6} minY={-3} maxY={5} xLabel="t / s" yLabel="v / (m/s)">
            {(pos) => {
              const zero = pos(0, 0).y;
              const curve =
                index === 0
                  ? line([pos(0, 2), pos(6, 2)])
                  : index === 1
                    ? line([pos(0, 2), pos(3, 2), pos(3, -2), pos(6, -2)])
                    : line([pos(0, 0), pos(6, 4)]);
              const upEnd = index === 1 ? Math.min(m.seconds, 3) : m.seconds;
              const up =
                index === 2
                  ? [pos(0, 0), pos(m.seconds, m.velocity), pos(m.seconds, 0)]
                  : [pos(0, 0), pos(0, 2), pos(upEnd, 2), pos(upEnd, 0)];
              const down = [
                pos(3, 0),
                pos(3, -2),
                pos(m.seconds, -2),
                pos(m.seconds, 0),
              ];
              return (
                <>
                  <path d={`M75 ${zero}H545`} stroke={white} />
                  <text
                    x="64"
                    y={zero + 6}
                    textAnchor="end"
                    style={{ fontSize: 18 }}
                  >
                    0
                  </text>
                  <polygon
                    points={up.map((a) => `${a.x},${a.y}`).join(' ')}
                    fill={blue}
                    opacity="0.35"
                  />
                  {index === 1 && m.seconds > 3 && (
                    <polygon
                      points={down.map((a) => `${a.x},${a.y}`).join(' ')}
                      fill={red}
                      opacity="0.5"
                    />
                  )}
                  <path d={curve} stroke={blue} fill="none" strokeWidth="3" />
                  <Pointer point={pos(m.seconds, m.velocity)} baseY={zero} />
                </>
              );
            }}
          </Plot>
          <Track position={m.displacement} max={12} />
        </>
      );
      metric(['正区域面积', 'Positive area'], `${f(m.positive)} m`);
      metric(
        ['负区域带符号面积', 'Signed negative area'],
        `${f(m.negative)} m`,
      );
      metric(
        ['当前位移 / 路程', 'Current displacement / distance'],
        `${f(m.displacement)} / ${f(m.distance)} m`,
      );
      row = [
        `${f(full.positive)} m`,
        `${f(full.negative)} m`,
        `${f(full.displacement)} m`,
        `${f(full.distance)} m`,
      ];
      steps = [
        [
          '(m/s) × s = m：速度图面积的单位',
          '(m/s) × s = m: units of velocity-graph area',
        ],
        [
          `净位移 = ${f(full.positive)} + (${f(full.negative)}) = ${f(full.displacement)} m`,
          `Net displacement = ${f(full.positive)} + (${f(full.negative)}) = ${f(full.displacement)} m`,
        ],
        [
          `路程 = 正负面积大小相加 = ${f(full.distance)} m`,
          `Distance = sum of area magnitudes = ${f(full.distance)} m`,
        ],
      ];
      break;
    }
    case 'linear': {
      const m = heatingLine(index, value, 6 * p),
        full = heatingLine(index, value, 6);
      scene = (
        <>
          {title(
            mode,
            '同一温度尺 · 截距与斜率分开读',
            'One temperature scale · intercept and gradient',
          )}
          <Plot maxX={6} maxY={50} xLabel="t / s" yLabel="T / °C">
            {(pos) => (
              <>
                {[0, 1, 2].map((i) => (
                  <path
                    key={i}
                    d={line([
                      pos(0, i === 1 ? 30 : 20),
                      pos(
                        6,
                        heatingLine(i, i === 2 ? 200 : 100, 6).temperature,
                      ),
                    ])}
                    stroke={muted}
                    fill="none"
                    strokeWidth="2"
                  />
                ))}
                <path
                  d={line([pos(0, m.initial), pos(6, full.temperature)])}
                  stroke={blue}
                  fill="none"
                  strokeWidth="3"
                />
                <Pointer point={pos(m.seconds, m.temperature)} />
              </>
            )}
          </Plot>
          <text x="310" y="381" textAnchor="middle" style={{ fontSize: 24 }}>
            T = {m.initial} + {f(m.gradient)}t (°C, s)
          </text>
        </>
      );
      metric(
        ['截距 / 初温', 'Intercept / initial temperature'],
        `${m.initial}°C`,
      );
      metric(['温度变化率', 'Temperature gradient'], `${f(m.gradient)} K/s`);
      metric(['当前温度', 'Current temperature'], `${f(m.temperature)}°C`);
      row = [
        `${m.initial}°C`,
        `${f(m.gradient)} K/s`,
        `${f(full.temperature)}°C`,
      ];
      steps = [
        [
          `P/C = ${value} W / (100 J/K) = ${f(m.gradient)} K/s`,
          `P/C = ${value} W / (100 J/K) = ${f(m.gradient)} K/s`,
        ],
        [
          `T(6 s) = ${m.initial} + ${f(m.gradient)} × 6 = ${f(full.temperature)}°C`,
          `T(6 s) = ${m.initial} + ${f(m.gradient)} × 6 = ${f(full.temperature)}°C`,
        ],
        [
          '平移起点不改变斜率；加常量不等于正比',
          'Shifting the start leaves gradient unchanged; an added constant is not direct proportion',
        ],
      ];
      break;
    }
    case 'curve': {
      const m = curveInterval(value, extra),
        time = m.a.seconds + (m.b.seconds - m.a.seconds) * p,
        reading = acceleratingReading(time);
      scene = (
        <>
          {title(
            mode,
            extra
              ? '横轴t²：同一运动，新的斜率单位'
              : '曲线两点：一个区间的平均斜率',
            extra
              ? 'Horizontal t²: new gradient units'
              : 'Two curve points: one interval-average gradient',
          )}
          <Plot
            maxX={extra ? 36 : 6}
            maxY={18}
            xLabel={extra ? 't² / s²' : 't / s'}
            yLabel="x / m"
          >
            {(pos) => (
              <>
                <path
                  d={sample(
                    (t) => acceleratingReading(t).position,
                    6,
                    pos,
                    extra ? (t) => t * t : undefined,
                  )}
                  stroke={blue}
                  fill="none"
                  strokeWidth="3"
                />
                <Triangle
                  a={pos(extra ? m.a.timeSquared : m.a.seconds, m.a.position)}
                  b={pos(extra ? m.b.timeSquared : m.b.seconds, m.b.position)}
                />
                <Pointer
                  point={pos(
                    extra ? reading.timeSquared : time,
                    reading.position,
                  )}
                />
              </>
            )}
          </Plot>
          <text x="310" y="381" textAnchor="middle" style={{ fontSize: 23 }}>
            Δx/Δ{extra ? '(t²)' : 't'} = {f(m.rise)}/{f(m.run)} ={' '}
            {f(m.gradient)} {m.unit}
          </text>
        </>
      );
      metric(['同一位置差', 'Same position change'], `${f(m.rise)} m`);
      metric(
        ['当前图横轴差', 'Current horizontal change'],
        `${f(m.run)} ${extra ? 's²' : 's'}`,
      );
      metric(
        ['当前图斜率', 'Current graph gradient'],
        `${f(m.gradient)} ${m.unit}`,
      );
      row = [
        `${value}→${value + 1} s`,
        extra ? 'x–t²' : 'x–t',
        `${f(m.gradient)} ${m.unit}`,
      ];
      steps = [
        [
          `x(${value}) = ${f(m.a.position)} m，x(${value + 1}) = ${f(m.b.position)} m`,
          `x(${value}) = ${f(m.a.position)} m, x(${value + 1}) = ${f(m.b.position)} m`,
        ],
        [
          `图斜率 = ${f(m.rise)} m / ${f(m.run)} ${extra ? 's²' : 's'} = ${f(m.gradient)} ${m.unit}`,
          `Graph gradient = ${f(m.rise)} m / ${f(m.run)} ${extra ? 's²' : 's'} = ${f(m.gradient)} ${m.unit}`,
        ],
        extra
          ? [
              '横轴平方后，斜率是½a，不是速度',
              'With squared time, gradient is ½a, not velocity',
            ]
          : [
              '两点斜率是区间平均速度，不代表所有局部速度',
              'Two-point slope is interval mean velocity, not every local velocity',
            ],
      ];
      break;
    }
    case 'experiment': {
      const m = graphExperiment(index, value, extra);
      scene = (
        <>
          {title(
            mode,
            '保留每次读数 · 用模型概括趋势',
            'Retain every reading · summarize with a model',
          )}
          <Plot
            maxX={4}
            minY={-2}
            maxY={24}
            xLabel="F / N"
            yLabel={w(mode, '长度读数 / cm', 'Length reading / cm')}
          >
            {(pos) => (
              <>
                {m.rows.map((r) => (
                  <g key={r.force}>
                    <path
                      d={line([pos(r.force, r.min), pos(r.force, r.max)])}
                      stroke={white}
                      strokeWidth="2"
                    />
                    {r.values.map((v, j) => (
                      <circle
                        key={j}
                        cx={pos(r.force, v).x}
                        cy={pos(r.force, v).y}
                        r="3"
                        fill={blue}
                      />
                    ))}
                    <path
                      d={`M${pos(r.force, r.mean).x - 5} ${pos(r.force, r.mean).y}h10`}
                      stroke={gold}
                      strokeWidth="2"
                    />
                  </g>
                ))}
                <path
                  d={line([
                    pos(0, m.fit.intercept),
                    pos(4, m.fit.intercept + 4 * m.fit.slope),
                  ])}
                  fill="none"
                  stroke={gold}
                  strokeWidth="2"
                />
                <circle
                  cx={pos(4 * p, m.fit.intercept + 4 * p * m.fit.slope).x}
                  cy={pos(4 * p, m.fit.intercept + 4 * p * m.fit.slope).y}
                  r="5"
                  fill={gold}
                />
              </>
            )}
          </Plot>
          <text x="310" y="381" textAnchor="middle" style={{ fontSize: 22 }}>
            y ≈ {f(m.fit.intercept)} cm + ({f(m.fit.slope)} cm/N) F
          </text>
        </>
      );
      metric(['拟合截距', 'Fit intercept'], `${f(m.fit.intercept)} cm`);
      metric(['拟合斜率', 'Fit gradient'], `${f(m.fit.slope)} cm/N`);
      metric(['读数分辨率', 'Reading resolution'], `${m.resolution} cm`);
      row = [
        `${value} cm`,
        `${f(m.fit.intercept)} cm`,
        `${f(m.fit.slope)} cm/N`,
      ];
      steps = [
        [
          '原始15次读数保留，分别算每个力下的均值',
          'Retain all fifteen originals and average at each force',
        ],
        [
          `校正量 ${value} cm；重复范围宽度不因此缩小`,
          `Correction ${value} cm; repeat-range widths do not shrink`,
        ],
        extra
          ? [
              '过原点是额外假设；检查零力读数与残差',
              'An origin constraint is an added assumption; check zero readings and residuals',
            ]
          : [
              '选择含截距的直线拟合，并保留处理理由',
              'Fit a line with an intercept and retain the processing reason',
            ],
      ];
      break;
    }
  }
  return { scene, metrics, row, steps };
}
const headers: Record<GraphKind, Pair[]> = {
  axes: [
    ['时间读数', 'Time reading'],
    ['位置读数', 'Position reading'],
    ['实际路程', 'Distance'],
  ],
  reading: [
    ['时刻', 'Time'],
    ['位置', 'Position'],
    ['位移', 'Displacement'],
    ['路程', 'Distance'],
  ],
  gradient: [
    ['位置变化', 'Position readings'],
    ['时间区间', 'Time interval'],
    ['斜率', 'Gradient'],
  ],
  area: [
    ['正面积', 'Positive area'],
    ['负面积', 'Negative area'],
    ['位移', 'Displacement'],
    ['路程', 'Distance'],
  ],
  linear: [
    ['初温', 'Start temperature'],
    ['斜率', 'Gradient'],
    ['6 s温度', 'Temperature at 6 s'],
  ],
  curve: [
    ['真实时间区间', 'Physical time interval'],
    ['轴量', 'Axes'],
    ['图斜率', 'Graph gradient'],
  ],
  experiment: [
    ['零点校正', 'Zero correction'],
    ['拟合截距', 'Fit intercept'],
    ['拟合斜率', 'Fit gradient'],
  ],
};
export function GraphLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: GraphKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [extra, setExtra] = useState(false),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const value = custom ?? graphDefault(kind, index),
    canonical =
      Math.abs(value - graphDefault(kind, index)) < 1e-9 &&
      extra === (kind === 'curve' && index === 2);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      if (canonical) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    });
  const reset = () => {
      animation.reset();
      setProbe(0);
    },
    choose = (i: number) => {
      reset();
      setIndex(i);
      setCustom(null);
      setExtra(kind === 'curve' && i === 2);
    };
  const p = probe || animation.time / 2.4,
    m = data(kind, index, value, p, extra, mode),
    slider = sliders[kind],
    experiment =
      kind === 'experiment' ? graphExperiment(index, value, extra) : null;
  return (
    <div
      className={`phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-graph-lab phy-graph-${kind}`}
    >
      <div className="phy-lab-toolbar">
        <span>PHYSICS BRIDGE / READ THE STORY</span>
        <B zh={titles[kind][0]} en={titles[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        set={choose}
        disabled={animation.running}
      />
      <label className="phy-algebra-free">
        <B zh={slider.title[0]} en={slider.title[1]} mode={mode} />
        <output>
          {f(value)} {slider.unit}
        </output>
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={value}
          aria-label={w(mode, ...slider.title)}
          disabled={animation.running}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      {['gradient', 'curve', 'experiment'].includes(kind) && (
        <button
          className="phy-button secondary phy-graph-extra"
          aria-pressed={extra}
          disabled={animation.running}
          onClick={() => {
            reset();
            setExtra(!extra);
          }}
        >
          <B
            mode={mode}
            zh={
              kind === 'gradient'
                ? extra
                  ? '恢复高图框'
                  : '切换扁图框'
                : kind === 'curve'
                  ? extra
                    ? '改用横轴t'
                    : '改用横轴t²'
                  : extra
                    ? '恢复含截距拟合'
                    : '尝试强制过原点'
            }
            en={
              kind === 'gradient'
                ? extra
                  ? 'Restore tall frame'
                  : 'Use flat frame'
                : kind === 'curve'
                  ? extra
                    ? 'Use horizontal t'
                    : 'Use horizontal t²'
                  : extra
                    ? 'Restore intercept fit'
                    : 'Try forcing the origin'
            }
          />
        </button>
      )}
      <svg
        viewBox="0 0 620 410"
        role="img"
        aria-label={w(mode, ...titles[kind])}
      >
        <rect width="620" height="410" rx="18" fill={ink} />
        <g fill={white} style={{ fontSize: 22 }}>
          {m.scene}
        </g>
      </svg>
      <div className="phy-thermal-metrics">
        {m.metrics.map((x) => (
          <LabMetric key={x.title[1]} mode={mode} title={x.title}>
            {x.value}
          </LabMetric>
        ))}
      </div>
      <ol
        className="phy-algebra-steps"
        aria-label={w(mode, '图像读数与检查', 'Graph readings and checks')}
      >
        {m.steps.map((s, i) => (
          <li key={i} className={p >= (i + 1) / 3 ? 'inspected' : ''}>
            {s[0] === s[1] ? s[0] : <B zh={s[0]} en={s[1]} mode={mode} />}
          </li>
        ))}
      </ol>
      {experiment && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                zh="原始教学读数与当前处理（cm）"
                en="Original teaching readings and current processing (cm)"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {[
                  ['力 / N', 'Force / N'],
                  ['原始三次', 'Three originals'],
                  ['处理后三次', 'Three processed'],
                  ['均值', 'Mean'],
                  ['重复范围', 'Repeat range'],
                ].map((h) => (
                  <th key={h[1]}>
                    <B zh={h[0]!} en={h[1]!} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiment.rows.map((r) => (
                <tr key={r.force}>
                  <td>{r.force}</td>
                  <td>{r.raw.map(f).join(' / ')}</td>
                  <td>{r.values.map(f).join(' / ')}</td>
                  <td>{f(r.mean)}</td>
                  <td>
                    {f(r.min)}–{f(r.max)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="phy-model-note">
        <B zh={notes[kind][0]} en={notes[kind][1]} mode={mode} />
      </p>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{Math.round(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
          aria-label={w(mode, '检查进度', 'Inspection progress')}
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
          onClick={() => {
            setProbe(0);
            animation.start();
          }}
        >
          <B zh="完整读图并记录" en="Inspect graph and record" mode={mode} />
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
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整读图。`}
          en={`${gate.count}/3 required comparisons complete; seeking or free settings do not replace full inspection.`}
          mode={mode}
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
                <th>
                  <B zh="条件" en="Condition" mode={mode} />
                </th>
                {headers[kind].map((h) => (
                  <th key={h[1]}>
                    <B zh={h[0]} en={h[1]} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...records].sort().map((i) => (
                <tr key={i}>
                  <td>
                    {options[kind][i]![0] === options[kind][i]![1] ? (
                      options[kind][i]![0]
                    ) : (
                      <B
                        zh={options[kind][i]![0]}
                        en={options[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  {data(
                    kind,
                    i,
                    graphDefault(kind, i),
                    1,
                    kind === 'curve' && i === 2,
                    mode,
                  ).row.map((s, j) => (
                    <td key={j}>{s}</td>
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
