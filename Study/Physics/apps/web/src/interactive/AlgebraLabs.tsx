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
  algebraDefault,
  robotTrip,
  lampEnergy,
  tripTime,
  mapScale,
  linearSpring,
  contactPressure,
  cartEnergy,
  notationReading,
  type AlgebraKind,
} from './algebraModels';
type Pair = [string, string];
const text = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const f = (n: number) => String(Number(n.toFixed(5)));
const ink = '#263b39',
  blue = '#91c7ce',
  gold = '#e8c783',
  cream = '#ecebdc',
  muted = '#a0aaa0';
export const algebraTitles: Record<AlgebraKind, Pair> = {
  variables: ['机器人变量工作台', 'Robot variable bench'],
  substitution: ['灯的单位代入账', 'Lamp substitution ledger'],
  rearrange: ['等式两边一起变', 'Equal operations on both sides'],
  ratio: ['地图与真实路线尺', 'Map and real-route rulers'],
  direct: ['原长与伸长对照', 'Rest length and extension'],
  inverse: ['固定力的反比曲线', 'Inverse relation at fixed force'],
  square: ['速率平方与能量格', 'Speed squares and energy tiles'],
  notation: ['十的幂与单位窗口', 'Powers-of-ten and unit window'],
};
const cases: Record<AlgebraKind, Pair[]> = {
  variables: [
    ['1 m/s · 4 s', '1 m/s · 4 s'],
    ['2 m/s · 4 s', '2 m/s · 4 s'],
    ['1 m/s · 8 s', '1 m/s · 8 s'],
  ],
  substitution: [
    ['2 W · 30 s', '2 W · 30 s'],
    ['2 W · 0.5 min', '2 W · 0.5 min'],
    ['5 W · 30 s', '5 W · 30 s'],
  ],
  rearrange: [
    ['120 m · 2 m/s', '120 m · 2 m/s'],
    ['120 m · 4 m/s', '120 m · 4 m/s'],
    ['240 m · 4 m/s', '240 m · 4 m/s'],
  ],
  ratio: [
    ['3 cm · 100 m/cm', '3 cm · 100 m/cm'],
    ['6 cm · 100 m/cm', '6 cm · 100 m/cm'],
    ['3 cm · 200 m/cm', '3 cm · 200 m/cm'],
  ],
  direct: [
    ['2 N', '2 N'],
    ['4 N', '4 N'],
    ['6 N', '6 N'],
  ],
  inverse: [
    ['0.02 m²', '0.02 m²'],
    ['0.04 m²', '0.04 m²'],
    ['0.08 m²', '0.08 m²'],
  ],
  square: [
    ['1 m/s', '1 m/s'],
    ['2 m/s', '2 m/s'],
    ['3 m/s', '3 m/s'],
  ],
  notation: [
    ['微小尺度', 'Tiny scale'],
    ['公园尺度', 'Park scale'],
    ['大尺度', 'Large scale'],
  ],
};
const notes: Record<AlgebraKind, Pair> = {
  variables: [
    '从位置0开始，向右匀速，无停顿。0–24 m共用比例尺；一次行程的模型时间压缩为2.4秒。字母对应速率、移动时间和路程，不模拟电机或真实障碍。',
    'Start at position zero, moving steadily right without stops. All trips share 0–24 m; each model trip is compressed into 2.4 seconds. Letters name speed, moving time and distance; motors and obstacles are omitted.',
  ],
  substitution: [
    '恒定教学功率，E=Pt。时间先换秒，再得焦耳；0–300 J条共用尺度。播放是在检查计算步骤，不是灯的真实运行时间。电能含所有输出去向，不表示全部成为光。',
    'Assigned constant power with E=Pt. Convert time to seconds before obtaining joules; bars share 0–300 J. Playback inspects calculation steps, not physical lamp time. Energy includes all output destinations, not only light.',
  ],
  rearrange: [
    '匀速单向行程；两边同除非零速率。播放逐步揭示代数操作，不表示路程随播放增长。自由零速率时，正距离任务没有有限到达时间；不执行除零。',
    'Steady one-way travel; divide both sides by nonzero speed. Playback reveals algebra, not growing trip distance. At zero free speed, a positive-distance task has no finite arrival time; division by zero is not performed.',
  ],
  ratio: [
    '上尺0–8 cm，下条0–1600 m；各自共用尺度，二者不是同一空间长度。无单位比例尺先统一cm；路线长度不一定等于起終点间隔。播放检查换算，不模拟步行。',
    'Upper ruler 0–8 cm; lower bar 0–1600 m. Each has a shared scale; they are not the same spatial length. Match cm before forming a unitless ratio. Route length need not equal endpoint separation. Playback inspects conversion, not walking.',
  ],
  direct: [
    '理想线性弹簧的静态平衡，k_s=20 N/m、原长20 cm，限定0–6 N。灰段原长、蓝段伸长。图线共用坐标，金点读线；不模拟振动，也不预测超出弹性范围。',
    'Static equilibrium of an ideal linear spring: k_s=20 N/m, rest length 20 cm, limited to 0–6 N. Grey is rest length; blue is extension. Lines share axes and gold markers read them. Oscillations and behavior outside the elastic range are omitted.',
  ],
  inverse: [
    '总接触力固定600 N，p=F/A为平均值。俯视正方形接触面共用面积尺度；有效面积0.01–0.08 m²。图中金点读曲线，不表示物体移动或雪地陷入量。',
    'Fixed total contact force 600 N; p=F/A is an average. Top-view square contacts share an area scale for 0.01–0.08 m². Gold markers read the curve; movement and sinking into snow are not modeled.',
  ],
  square: [
    '平动小车质量固定2 kg，K=½mv²，限定0–3 m/s。方阵表示(v/1 m/s)²，每整格对应本模型1 J；不是实际接触面积。能量条0–9 J。金点读曲线，不模拟碰撞或制动。',
    'Fixed 2 kg translating cart, K=½mv², limited to 0–3 m/s. The square shows (v/1 m/s)², one full tile corresponding to 1 J here; it is not contact area. Energy bar 0–9 J. Gold markers read the curve; collisions and braking are omitted.',
  ],
  notation: [
    '正长度教学卡，系数4、整数指数−6至6；1 m=1000 mm。单位切换重写同一长度，字框和小数点是数字排版，不是物体缩放。检查播放不表示时间演化或测量精度。',
    'Positive teaching lengths with coefficient 4 and integer exponents −6 to 6; 1 m=1000 mm. Unit switches rewrite the same length. Digits and decimal points are number layout, not object scaling. Playback is not physical evolution or measurement precision.',
  ],
};
const sliders: Record<
  AlgebraKind,
  { title: Pair; min: number; max: number; step: number; unit: string }
> = {
  variables: {
    title: ['自由速率', 'Free speed'],
    min: 0,
    max: 3,
    step: 0.25,
    unit: 'm/s',
  },
  substitution: {
    title: ['自由时间数值', 'Free time value'],
    min: 0,
    max: 60,
    step: 0.5,
    unit: '',
  },
  rearrange: {
    title: ['自由速率（可为0）', 'Free speed (including zero)'],
    min: 0,
    max: 6,
    step: 0.5,
    unit: 'm/s',
  },
  ratio: {
    title: ['自由图上路线长度', 'Free paper-route length'],
    min: 0,
    max: 8,
    step: 0.5,
    unit: 'cm',
  },
  direct: {
    title: ['自由拉力', 'Free pull'],
    min: 0,
    max: 6,
    step: 0.5,
    unit: 'N',
  },
  inverse: {
    title: ['自由接触面积', 'Free contact area'],
    min: 0.01,
    max: 0.08,
    step: 0.01,
    unit: 'm²',
  },
  square: {
    title: ['自由速率', 'Free speed'],
    min: 0,
    max: 3,
    step: 0.25,
    unit: 'm/s',
  },
  notation: {
    title: ['自由十的幂指数', 'Free power-of-ten exponent'],
    min: -6,
    max: 6,
    step: 1,
    unit: '',
  },
};
function Label({
  mode,
  zh,
  en,
  y = 34,
}: {
  mode: LanguageMode;
  zh: string;
  en: string;
  y?: number;
}) {
  return (
    <text x="310" y={y} textAnchor="middle" style={{ fontSize: 21 }}>
      {text(mode, zh, en)}
    </text>
  );
}
function Bar({
  x = 80,
  y,
  width,
  max,
  value,
  color = blue,
}: {
  x?: number;
  y: number;
  width: number;
  max: number;
  value: number;
  color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="23" rx="4" fill="#41544d" />
      <rect
        x={x}
        y={y}
        width={width * Math.max(0, Math.min(1, value / max))}
        height="23"
        rx="4"
        fill={color}
      />
    </g>
  );
}
function Curve({
  maxX,
  maxY,
  fn,
  value,
  p,
  xLabel,
  yLabel,
  second,
}: {
  maxX: number;
  maxY: number;
  fn: (x: number) => number;
  value: number;
  p: number;
  xLabel: string;
  yLabel: string;
  second?: (x: number) => number;
}) {
  const x0 = 305,
    y0 = 270,
    width = 260,
    height = 160;
  const point = (x: number, y: number) =>
    `${x0 + (width * x) / maxX} ${y0 - (height * y) / maxY}`;
  const path = (func: (x: number) => number) =>
    Array.from({ length: 81 }, (_, i) => {
      const x = (maxX * i) / 80,
        y = func(x);
      return y >= 0 && y <= maxY ? `${i === 0 ? 'M' : 'L'}${point(x, y)}` : '';
    })
      .filter(Boolean)
      .join(' ')
      .replace(/^L/, 'M');
  const readX = value * p,
    readY = fn(readX);
  return (
    <g>
      <path d={`M${x0} 96V${y0}H580`} stroke={cream} fill="none" />
      {[0, 0.5, 1].map((n) => (
        <g key={n}>
          <path
            d={`M${x0} ${y0 - height * n}H565`}
            stroke="#53645b"
            strokeDasharray="3 5"
          />
          <text
            x={x0 - 10}
            y={y0 - height * n + 6}
            textAnchor="end"
            style={{ fontSize: 17 }}
          >
            {f(maxY * n)}
          </text>
          <text
            x={x0 + width * n}
            y={y0 + 24}
            textAnchor="middle"
            style={{ fontSize: 17 }}
          >
            {f(maxX * n)}
          </text>
        </g>
      ))}
      <text x={x0} y="77" style={{ fontSize: 19 }}>
        {yLabel}
      </text>
      <text x="565" y="324" textAnchor="end" style={{ fontSize: 19 }}>
        {xLabel}
      </text>
      {second && (
        <path d={path(second)} stroke={muted} fill="none" strokeWidth="2" />
      )}
      <path d={path(fn)} stroke={blue} fill="none" strokeWidth="3" />
      {Number.isFinite(readY) && readY <= maxY && (
        <circle
          cx={x0 + (width * readX) / maxX}
          cy={y0 - (height * readY) / maxY}
          r="5"
          fill={gold}
        />
      )}
      <circle
        cx={x0 + (width * value) / maxX}
        cy={y0 - (height * fn(value)) / maxY}
        r="6"
        fill={blue}
        stroke={cream}
      />
    </g>
  );
}
function Robot({
  value,
  index,
  p,
  mode,
}: {
  value: number;
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = robotTrip(value, index === 2 ? 8 : 4, p),
    x = 70 + (480 * m.position) / 24;
  return (
    <g>
      <Label
        mode={mode}
        zh="同一把尺 · 从0向右匀速"
        en="One ruler · steady travel right from zero"
      />
      <text x="80" y="98" style={{ fontSize: 24 }}>
        v = {f(m.speed)} m/s
      </text>
      <text x="350" y="98" style={{ fontSize: 24 }}>
        t = {m.seconds} s
      </text>
      <path d="M70 210H550" stroke={muted} />
      {[0, 4, 8, 12, 16, 20, 24].map((n) => (
        <g key={n}>
          <path d={`M${70 + n * 20} 203V220`} stroke={cream} />
          <text
            x={70 + n * 20}
            y="246"
            textAnchor="middle"
            style={{ fontSize: 20 }}
          >
            {n}
          </text>
        </g>
      ))}
      <path d={`M70 210H${x}`} stroke={blue} strokeWidth="5" />
      <g transform={`translate(${x},180)`}>
        <rect x="-19" y="-26" width="38" height="29" rx="6" fill={blue} />
        <circle cx="-10" cy="10" r="8" fill={cream} />
        <circle cx="10" cy="10" r="8" fill={cream} />
        <circle cx="-6" cy="-14" r="3" fill={ink} />
        <circle cx="6" cy="-14" r="3" fill={ink} />
      </g>
      <text x="550" y="280" textAnchor="end" style={{ fontSize: 20 }}>
        d / m
      </text>
      <Label
        mode={mode}
        zh={`已走${f(m.elapsed)} s · 位置${f(m.position)} m`}
        en={`${f(m.elapsed)} s elapsed · position ${f(m.position)} m`}
        y={323}
      />
    </g>
  );
}
function Lamp({
  value,
  index,
  p,
  mode,
}: {
  value: number;
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = lampEnergy(index === 2 ? 5 : 2, value, index === 1 ? 'min' : 's');
  return (
    <g>
      <Label
        mode={mode}
        zh="先换秒，再代入 · 共用能量尺"
        en="Convert to seconds · then substitute"
      />
      <circle cx="95" cy="105" r="27" fill={gold} />
      <path d="M80 131H110m-25 7h20m-18 7h16" stroke={cream} strokeWidth="3" />
      <text x="155" y="102" style={{ fontSize: 24 }}>
        P = {m.watts} J/s
      </text>
      <text x="155" y="139" style={{ fontSize: 23 }}>
        t = {f(value)} {m.unit}
      </text>
      <text
        x="80"
        y="200"
        style={{ fontSize: 25 }}
        opacity={p >= 0.3 ? 1 : 0.35}
      >
        {f(value)} {m.unit} → {f(m.seconds)} s
      </text>
      <text
        x="80"
        y="242"
        style={{ fontSize: 25 }}
        opacity={p >= 0.65 ? 1 : 0.35}
      >
        E = {m.watts} × {f(m.seconds)} = {f(m.joules)} J
      </text>
      <Bar y={275} width={460} max={300} value={m.joules} />
      <text x="80" y="326" style={{ fontSize: 20 }}>
        0
      </text>
      <text x="540" y="326" textAnchor="end" style={{ fontSize: 20 }}>
        300 J
      </text>
      {m.joules > 300 && (
        <text x="310" y="357" textAnchor="middle" style={{ fontSize: 19 }}>
          {text(
            mode,
            '条已达上限 · 精确值见上',
            'Bar capped · see exact value above',
          )}
        </text>
      )}
    </g>
  );
}
function Balance({
  value,
  index,
  p,
  mode,
}: {
  value: number;
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = tripTime(index === 2 ? 240 : 120, value);
  return (
    <g>
      <Label
        mode={mode}
        zh="对两边做同一种合法运算"
        en="The same valid operation on both sides"
      />
      <path
        d="M110 145H510m-200 0v50m-20 0h40"
        stroke={muted}
        strokeWidth="3"
      />
      <text x="175" y="124" textAnchor="middle" style={{ fontSize: 30 }}>
        d
      </text>
      <text x="445" y="124" textAnchor="middle" style={{ fontSize: 30 }}>
        vt
      </text>
      <text x="310" y="129" textAnchor="middle" style={{ fontSize: 29 }}>
        =
      </text>
      {value !== 0 ? (
        <g>
          <text
            x="175"
            y="184"
            textAnchor="middle"
            fill={gold}
            style={{ fontSize: 24 }}
          >
            ÷ v
          </text>
          <text
            x="445"
            y="184"
            textAnchor="middle"
            fill={gold}
            style={{ fontSize: 24 }}
          >
            ÷ v
          </text>
          <text
            x="310"
            y="251"
            textAnchor="middle"
            style={{ fontSize: 28 }}
            opacity={p >= 0.35 ? 1 : 0.35}
          >
            d/v = vt/v → t = d/v
          </text>
          <text
            x="310"
            y="315"
            textAnchor="middle"
            style={{ fontSize: 27 }}
            opacity={p >= 0.7 ? 1 : 0.35}
          >
            t = {m.distance}/{f(value)} = {f(m.seconds!)} s
          </text>
        </g>
      ) : (
        <g>
          <Label
            mode={mode}
            zh="v = 0：不能除以0"
            en="v = 0: cannot divide by zero"
            y={248}
          />
          <Label
            mode={mode}
            zh="静止机器人无法完成正距离"
            en="A stationary robot cannot cover the trip"
            y={311}
          />
        </g>
      )}
    </g>
  );
}
function MapScene({
  value,
  index,
  p,
  mode,
}: {
  value: number;
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = mapScale(value, index === 2 ? 200 : 100);
  return (
    <g>
      <Label
        mode={mode}
        zh="两把不同单位的尺，各自共用尺度"
        en="Two unit rulers, each at a shared scale"
      />
      <text x="80" y="86" style={{ fontSize: 23 }}>
        1 cm : {m.metresPerCm * 100} cm = 1:{m.denominator}
      </text>
      <text x="80" y="137" style={{ fontSize: 20 }}>
        {text(mode, '图上路线 / cm', 'Paper route / cm')}
      </text>
      <Bar y={152} width={460} max={8} value={value} />
      <text x="80" y="202" style={{ fontSize: 20 }}>
        0
      </text>
      <text x="540" y="202" textAnchor="end" style={{ fontSize: 20 }}>
        8 cm
      </text>
      <text x="80" y="248" style={{ fontSize: 20 }}>
        {text(mode, '真实路线 / m', 'Real route / m')}
      </text>
      <Bar y={263} width={460} max={1600} value={m.realMetres} color={gold} />
      <text x="80" y="314" style={{ fontSize: 20 }}>
        0
      </text>
      <text x="540" y="314" textAnchor="end" style={{ fontSize: 20 }}>
        1600 m
      </text>
      <circle cx={80 + ((460 * value) / 8) * p} cy="163" r="5" fill={cream} />
      <Label
        mode={mode}
        zh={`${f(value)} cm × ${m.metresPerCm} m/cm = ${f(m.realMetres)} m`}
        en={`${f(value)} cm × ${m.metresPerCm} m/cm = ${f(m.realMetres)} m`}
        y={363}
      />
    </g>
  );
}
function SpringScene({
  value,
  p,
  mode,
}: {
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = linearSpring(value),
    bottom = 90 + 400 * m.length;
  const ps = Array.from(
    { length: 25 },
    (_, i) =>
      `${125 + (i % 2 === 0 ? -14 : 14)} ${90 + ((bottom - 90) * i) / 24}`,
  ).join(' ');
  return (
    <g>
      <Label
        mode={mode}
        zh="伸长：蓝 · 总长：灰线（含原长）"
        en="Extension: blue · total length: grey line"
      />
      <path d="M90 81H160" stroke={cream} strokeWidth="4" />
      <polyline points={ps} fill="none" stroke={cream} strokeWidth="3" />
      <path d="M180 90V170" stroke={muted} strokeWidth="12" />
      <path d={`M180 170V${bottom}`} stroke={blue} strokeWidth="12" />
      <path
        d={`M125 ${bottom}v25m-5-8l5 8 5-8`}
        stroke={gold}
        strokeWidth="3"
      />
      <text x="65" y="337" style={{ fontSize: 21 }}>
        F = {f(value)} N
      </text>
      <Curve
        maxX={6}
        maxY={60}
        fn={(x) => linearSpring(x).extension * 100}
        second={(x) => linearSpring(x).length * 100}
        value={value}
        p={p}
        xLabel="F / N"
        yLabel={text(mode, '长度 / cm', 'Length / cm')}
      />
      <text x="65" y="370" style={{ fontSize: 20 }}>
        L₀ = 20 cm · x = {f(m.extension * 100)} cm
      </text>
    </g>
  );
}
function PressureScene({
  value,
  p,
  mode,
}: {
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = contactPressure(value),
    side = 155 * Math.sqrt(value / 0.08);
  return (
    <g>
      <Label
        mode={mode}
        zh="同一总力 · 接触面俯视"
        en="Fixed total force · top-view contact area"
      />
      <rect
        x={140 - side / 2}
        y={195 - side / 2}
        width={side}
        height={side}
        fill={blue}
      />
      <text x="140" y="94" textAnchor="middle" style={{ fontSize: 23 }}>
        F = 600 N
      </text>
      <text x="140" y="303" textAnchor="middle" style={{ fontSize: 21 }}>
        A = {f(value)} m²
      </text>
      <Curve
        maxX={0.08}
        maxY={60}
        fn={(x) => (x < 0.01 ? Infinity : contactPressure(x).kilopascals)}
        value={value}
        p={p}
        xLabel="A / m²"
        yLabel="p / kPa"
      />
      <Label
        mode={mode}
        zh={`pA = ${f(m.pascals)} Pa × ${f(value)} m² = 600 N`}
        en={`pA = ${f(m.pascals)} Pa × ${f(value)} m² = 600 N`}
        y={367}
      />
    </g>
  );
}
function SquareScene({
  value,
  p,
  mode,
}: {
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = cartEnergy(value),
    unit = 43;
  return (
    <g>
      <Label
        mode={mode}
        zh="质量2 kg · 数值方阵，不是物体面积"
        en="Mass 2 kg · number tiles, not object area"
      />
      <rect
        x="75"
        y="122"
        width={unit * value}
        height={unit * value}
        fill={blue}
      />
      {[0, 1, 2, 3].map((n) => (
        <g key={n}>
          <path
            d={`M75 ${122 + unit * n}H204M${75 + unit * n} 122V251`}
            stroke={muted}
          />
        </g>
      ))}
      <text x="75" y="96" style={{ fontSize: 23 }}>
        v² = {f(value)} × {f(value)}
      </text>
      <text x="75" y="287" style={{ fontSize: 23 }}>
        {f(value * value)} {text(mode, '格', 'tiles')}
      </text>
      <Curve
        maxX={3}
        maxY={9}
        fn={(x) => cartEnergy(x).joules}
        value={value}
        p={p}
        xLabel="v / (m/s)"
        yLabel="K / J"
      />
      <Bar x={75} y={337} width={480} max={9} value={m.joules} />
      <text x="75" y="385" style={{ fontSize: 19 }}>
        0
      </text>
      <text x="555" y="385" textAnchor="end" style={{ fontSize: 19 }}>
        9 J
      </text>
    </g>
  );
}
function NotationScene({
  value,
  unit,
  p,
  mode,
}: {
  value: number;
  unit: 'm' | 'mm';
  p: number;
  mode: LanguageMode;
}) {
  const m = notationReading(value, unit),
    decimal = m.displayed.toFixed(Math.max(0, -m.exponent));
  return (
    <g>
      <Label
        mode={mode}
        zh="同一长度 · 数字和单位一起变化"
        en="One length · rewrite the number and unit"
      />
      <text x="310" y="130" textAnchor="middle" style={{ fontSize: 40 }}>
        4 × 10
        <tspan dy="-20" style={{ fontSize: 25 }}>
          {m.exponent}
        </tspan>
        <tspan dy="20"> {unit}</tspan>
      </text>
      <text
        x="310"
        y="203"
        textAnchor="middle"
        style={{ fontSize: 30 }}
        opacity={p >= 0.3 ? 1 : 0.35}
      >
        {decimal} {unit}
      </text>
      <path d="M85 250H535" stroke={muted} />
      {[-6, -3, 0, 3, 6].map((n) => (
        <g key={n}>
          <path d={`M${310 + n * 33} 245v12`} stroke={cream} />
          <text
            x={310 + n * 33}
            y="286"
            textAnchor="middle"
            style={{ fontSize: 20 }}
          >
            {n}
          </text>
        </g>
      ))}
      <circle cx={310 + value * 33} cy="250" r="7" fill={gold} />
      <Label
        mode={mode}
        zh="下尺：原m数值的指数"
        en="Lower ruler: exponent of the original m value"
        y={331}
      />
      <Label
        mode={mode}
        zh={`${m.metres.toFixed(Math.max(0, -value))} m = ${(m.metres * 1000).toFixed(Math.max(0, -value - 3))} mm`}
        en={`${m.metres.toFixed(Math.max(0, -value))} m = ${(m.metres * 1000).toFixed(Math.max(0, -value - 3))} mm`}
        y={371}
      />
    </g>
  );
}
type Data = {
  scene: ReactNode;
  metrics: { title: Pair; value: ReactNode }[];
  steps: Pair[];
  row: string[];
};
function data(
  kind: AlgebraKind,
  index: number,
  value: number,
  p: number,
  mode: LanguageMode,
  unit: 'm' | 'mm',
): Data {
  const metrics: Data['metrics'] = [];
  const add = (title: Pair, value: ReactNode) => metrics.push({ title, value });
  let scene: ReactNode, steps: Pair[], row: string[];
  switch (kind) {
    case 'variables': {
      const m = robotTrip(value, index === 2 ? 8 : 4, p);
      scene = <Robot {...{ value, index, p, mode }} />;
      add(['输入速率', 'Input speed'], `${f(value)} m/s`);
      add(['输入时间', 'Input duration'], `${m.seconds} s`);
      add(['完整路程', 'Full-trip distance'], `${f(m.distance)} m`);
      steps = [
        [
          '确认匀速、向右、没有停顿',
          'Check steady speed, rightward travel and no stops',
        ],
        [
          `d = (${f(value)} m/s) × (${m.seconds} s)`,
          `d = (${f(value)} m/s) × (${m.seconds} s)`,
        ],
        [
          `d = ${f(m.distance)} m；m/s × s = m`,
          `d = ${f(m.distance)} m; m/s × s = m`,
        ],
      ];
      row = [`${f(value)} m/s`, `${m.seconds} s`, `${f(m.distance)} m`];
      break;
    }
    case 'substitution': {
      const m = lampEnergy(
        index === 2 ? 5 : 2,
        value,
        index === 1 ? 'min' : 's',
      );
      scene = <Lamp {...{ value, index, p, mode }} />;
      add(['输入时间', 'Entered duration'], `${f(value)} ${m.unit}`);
      add(['换成秒', 'Time in seconds'], `${f(m.seconds)} s`);
      add(['完整电能', 'Full electrical energy'], `${f(m.joules)} J`);
      steps = [
        [
          `${f(value)} ${m.unit} = ${f(m.seconds)} s`,
          `${f(value)} ${m.unit} = ${f(m.seconds)} s`,
        ],
        [
          `E = (${m.watts} J/s) × (${f(m.seconds)} s)`,
          `E = (${m.watts} J/s) × (${f(m.seconds)} s)`,
        ],
        [
          `E = ${f(m.joules)} J；单位中的s相消`,
          `E = ${f(m.joules)} J; s cancels in the units`,
        ],
      ];
      row = [
        `${m.watts} W`,
        `${f(value)} ${m.unit} = ${f(m.seconds)} s`,
        `${f(m.joules)} J`,
      ];
      break;
    }
    case 'rearrange': {
      const m = tripTime(index === 2 ? 240 : 120, value);
      scene = <Balance {...{ value, index, p, mode }} />;
      add(['已知路程', 'Known distance'], `${m.distance} m`);
      add(['已知速率', 'Known speed'], `${f(value)} m/s`);
      add(
        ['求时间', 'Solve for time'],
        m.seconds === null ? (
          <B zh="无法到达" en="No arrival" mode={mode} />
        ) : (
          `${f(m.seconds)} s`
        ),
      );
      steps =
        m.seconds === null
          ? [
              [
                'v=0，不能用两边除以v',
                'v=0: dividing both sides by v is invalid',
              ],
              [
                '机器人静止，不能完成正距离',
                'The stationary robot cannot cover a positive distance',
              ],
              [
                '模型不返回有限到达时间',
                'The model returns no finite arrival time',
              ],
            ]
          : [
              ['d=vt，两边同除非零v', 'd=vt: divide both sides by nonzero v'],
              [
                `t = d/v = ${m.distance}/${f(value)} = ${f(m.seconds)} s`,
                `t = d/v = ${m.distance}/${f(value)} = ${f(m.seconds)} s`,
              ],
              [
                `回代：${f(value)} m/s × ${f(m.seconds)} s = ${m.distance} m`,
                `Check: ${f(value)} m/s × ${f(m.seconds)} s = ${m.distance} m`,
              ],
            ];
      row = [
        `${m.distance} m`,
        `${f(value)} m/s`,
        m.seconds === null ? '—' : `${f(m.seconds)} s`,
      ];
      break;
    }
    case 'ratio': {
      const m = mapScale(value, index === 2 ? 200 : 100);
      scene = <MapScene {...{ value, index, p, mode }} />;
      add(['图上长度', 'Paper length'], `${f(value)} cm`);
      add(['同单位比例尺', 'Same-unit ratio'], `1:${m.denominator}`);
      add(['真实路线', 'Real route'], `${f(m.realMetres)} m`);
      steps = [
        [
          `1 cm : ${m.metresPerCm} m = 1 cm : ${m.denominator} cm`,
          `1 cm : ${m.metresPerCm} m = 1 cm : ${m.denominator} cm`,
        ],
        [
          `d = ${f(value)} cm × ${m.metresPerCm} m/cm`,
          `d = ${f(value)} cm × ${m.metresPerCm} m/cm`,
        ],
        [`${f(m.realMetres)} m；cm相消`, ` ${f(m.realMetres)} m; cm cancels`],
      ];
      row = [`${f(value)} cm`, `1:${m.denominator}`, `${f(m.realMetres)} m`];
      break;
    }
    case 'direct': {
      const m = linearSpring(value);
      scene = <SpringScene {...{ value, p, mode }} />;
      add(['伸长', 'Extension'], `${f(m.extension * 100)} cm`);
      add(['总长', 'Total length'], `${f(m.length * 100)} cm`);
      add(['固定伸长/力常数', 'Fixed extension/force constant'], '0.05 m/N');
      steps = [
        [
          '先量原长L₀=20 cm，再求额外伸长',
          'Find rest length L₀=20 cm, then extra extension',
        ],
        [
          `x = ${f(value)} N / (20 N/m) = ${f(m.extension)} m`,
          `x = ${f(value)} N / (20 N/m) = ${f(m.extension)} m`,
        ],
        [
          `L = 0.20 m + ${f(m.extension)} m = ${f(m.length)} m`,
          `L = 0.20 m + ${f(m.extension)} m = ${f(m.length)} m`,
        ],
      ];
      row = [
        `${f(value)} N`,
        `${f(m.extension * 100)} cm`,
        `${f(m.length * 100)} cm`,
      ];
      break;
    }
    case 'inverse': {
      const m = contactPressure(value);
      scene = <PressureScene {...{ value, p, mode }} />;
      add(['面积', 'Area'], `${f(value)} m²`);
      add(['平均压强', 'Average pressure'], `${f(m.kilopascals)} kPa`);
      add(['检查乘积pA', 'Product check pA'], '600 N');
      steps = [
        ['固定总力600 N，改变面积', 'Fix total force at 600 N; vary area'],
        [
          `p = 600 N / ${f(value)} m² = ${f(m.pascals)} Pa`,
          `p = 600 N / ${f(value)} m² = ${f(m.pascals)} Pa`,
        ],
        [
          `pA = ${f(m.pascals)} Pa × ${f(value)} m² = 600 N`,
          `pA = ${f(m.pascals)} Pa × ${f(value)} m² = 600 N`,
        ],
      ];
      row = [`${f(value)} m²`, `${f(m.kilopascals)} kPa`, '600 N'];
      break;
    }
    case 'square': {
      const m = cartEnergy(value);
      scene = <SquareScene {...{ value, p, mode }} />;
      add(['速率', 'Speed'], `${f(value)} m/s`);
      add(['数值平方', 'Numerical square'], f(value * value));
      add(['动能', 'Kinetic energy'], `${f(m.joules)} J`);
      steps = [
        ['质量固定2 kg；先平方速率', 'Keep mass at 2 kg; square speed first'],
        [
          `K = ½ × 2 kg × (${f(value)} m/s)²`,
          `K = ½ × 2 kg × (${f(value)} m/s)²`,
        ],
        [
          `K = ${f(m.joules)} J；kg·m²/s² = J`,
          `K = ${f(m.joules)} J; kg·m²/s² = J`,
        ],
      ];
      row = [`${f(value)} m/s`, f(value * value), `${f(m.joules)} J`];
      break;
    }
    case 'notation': {
      const m = notationReading(value, unit);
      scene = <NotationScene {...{ value, unit, p, mode }} />;
      add(
        ['科学记数', 'Scientific form'],
        <>
          4 × 10<sup>{m.exponent}</sup> {unit}
        </>,
      );
      add(
        ['原米制长度', 'Original metre value'],
        `${m.metres.toFixed(Math.max(0, -value))} m`,
      );
      add(['当前单位', 'Current unit'], unit);
      steps = [
        [
          '标准系数4，在1与10之间',
          'Normalized coefficient 4 lies from 1 up to 10',
        ],
        [
          `4 × 10^${m.exponent} ${unit} = ${m.displayed.toFixed(Math.max(0, -m.exponent))} ${unit}`,
          `4 × 10^${m.exponent} ${unit} = ${m.displayed.toFixed(Math.max(0, -m.exponent))} ${unit}`,
        ],
        [
          'm换mm，数字乘1000；物理长度相同',
          'm to mm multiplies the number by 1000; length is unchanged',
        ],
      ];
      row = [
        `4 × 10^${m.exponent} ${unit}`,
        `${m.displayed.toFixed(Math.max(0, -m.exponent))} ${unit}`,
        '1 m = 1000 mm',
      ];
      break;
    }
  }
  return { scene, metrics, steps, row };
}
const headers: Record<AlgebraKind, Pair[]> = {
  variables: [
    ['速率', 'Speed'],
    ['时间', 'Duration'],
    ['路程', 'Distance'],
  ],
  substitution: [
    ['功率', 'Power'],
    ['时间换算', 'Time conversion'],
    ['电能', 'Electrical energy'],
  ],
  rearrange: [
    ['路程', 'Distance'],
    ['速率', 'Speed'],
    ['时间', 'Time'],
  ],
  ratio: [
    ['图上路线', 'Paper route'],
    ['比例尺', 'Scale ratio'],
    ['真实路线', 'Real route'],
  ],
  direct: [
    ['力', 'Force'],
    ['伸长', 'Extension'],
    ['总长', 'Total length'],
  ],
  inverse: [
    ['面积', 'Area'],
    ['平均压强', 'Average pressure'],
    ['乘积pA', 'Product pA'],
  ],
  square: [
    ['速率', 'Speed'],
    ['数值平方', 'Numerical square'],
    ['动能', 'Kinetic energy'],
  ],
  notation: [
    ['科学记数', 'Scientific form'],
    ['十进制', 'Decimal form'],
    ['单位关系', 'Unit relation'],
  ],
};
export function AlgebraLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: AlgebraKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [unit, setUnit] = useState<'m' | 'mm'>('m'),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const value = custom ?? algebraDefault(kind, index),
    canonical =
      Math.abs(value - algebraDefault(kind, index)) < 1e-9 && unit === 'm';
  const gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (canonical) {
      gate.record(String(index));
      setRecords((r) => [...new Set([...r, index])]);
    }
  });
  const p = probe || animation.time / 2.4,
    model = data(kind, index, value, p, mode, unit),
    slider = sliders[kind];
  const reset = () => {
    animation.reset();
    setProbe(0);
  };
  const choose = (i: number) => {
    reset();
    setIndex(i);
    setCustom(null);
    setUnit('m');
  };
  return (
    <div
      className={`phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-algebra-lab phy-algebra-${kind}`}
    >
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">
          PHYSICS BRIDGE / LET THE NUMBERS EXPLAIN
        </span>
        <B
          zh={algebraTitles[kind][0]}
          en={algebraTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={cases[kind].map((a, id) => ({ id, zh: a[0], en: a[1] }))}
        value={canonical ? index : -1}
        set={choose}
        disabled={animation.running}
      />
      <label className="phy-algebra-free">
        <B zh={slider.title[0]} en={slider.title[1]} mode={mode} />
        <output>
          {f(value)}{' '}
          {kind === 'substitution' ? (index === 1 ? 'min' : 's') : slider.unit}
        </output>
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={value}
          disabled={animation.running}
          aria-label={text(mode, ...slider.title)}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      {kind === 'notation' && (
        <LabOptions
          mode={mode}
          name={['同一长度，换单位', 'Same length, different unit']}
          values={[
            { id: 0, zh: 'm', en: 'm' },
            { id: 1, zh: 'mm', en: 'mm' },
          ]}
          value={unit === 'm' ? 0 : 1}
          set={(n) => {
            reset();
            setUnit(n === 0 ? 'm' : 'mm');
          }}
          disabled={animation.running}
        />
      )}
      <svg
        viewBox="0 0 620 400"
        role="img"
        aria-label={text(mode, ...algebraTitles[kind])}
      >
        <rect width="620" height="400" rx="18" fill={ink} />
        <g fill={cream} style={{ fontSize: 22 }}>
          {model.scene}
        </g>
      </svg>
      <div className="phy-thermal-metrics">
        {model.metrics.map((m) => (
          <LabMetric key={m.title[1]} mode={mode} title={m.title}>
            {m.value}
          </LabMetric>
        ))}
      </div>
      <ol
        className="phy-algebra-steps"
        aria-label={text(
          mode,
          '计算与检查步骤',
          'Calculation and checking steps',
        )}
      >
        {model.steps.map((s, i) => (
          <li key={i} className={p >= (i + 1) / 3 ? 'inspected' : ''}>
            {s[0] === s[1] ? s[0] : <B zh={s[0]} en={s[1]} mode={mode} />}
          </li>
        ))}
      </ol>
      <p className="phy-model-note">
        <B zh={notes[kind][0]} en={notes[kind][1]} mode={mode} />
      </p>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{f(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
          disabled={animation.running}
          aria-label={text(mode, '检查进度', 'Inspection progress')}
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
          <B zh="完整检查并记录" en="Inspect steps and record" mode={mode} />
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
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整检查。`}
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
                    {cases[kind][i]![0] === cases[kind][i]![1] ? (
                      cases[kind][i]![0]
                    ) : (
                      <B
                        zh={cases[kind][i]![0]}
                        en={cases[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  {data(kind, i, algebraDefault(kind, i), 1, mode, 'm').row.map(
                    (s, j) => (
                      <td key={j}>{s}</td>
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
