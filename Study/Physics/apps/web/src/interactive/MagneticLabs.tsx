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
  materialCase,
  poleCase,
  fieldProbe,
  fieldAngles,
  dipoleLine,
  earthCompass,
  earthDistances,
  wireCompass,
  coilField,
  coilCases,
  motorReading,
  motorSupplies,
  generatorReading,
  generatorCases,
  type MagneticKind,
} from './magneticModels';
type Pair = [string, string];
const ink = '#846592',
  red = '#ba8175',
  blue = '#80a6b6',
  gold = '#ba9764',
  green = '#809984';
const w = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const fmt = (n: number) => String(Number(n.toFixed(4)));
const titles: Record<MagneticKind, Pair> = {
  materials: ['磁性材料比较', 'Magnetic-material comparison'],
  poles: ['相对磁极与分段', 'Facing poles and split pieces'],
  field: ['磁针方向地图', 'Needle-direction map'],
  earth: ['指南针与附近干扰', 'Compass and nearby interference'],
  wire: ['导线周围的磁场', 'Field around a wire'],
  coil: ['受控电流电磁铁', 'Regulated-current electromagnet'],
  motor: ['电动机转动作用', 'Motor turning effect'],
  generator: ['手摇发电能量账', 'Hand-powered generator account'],
};
const options: Record<MagneticKind, Pair[]> = {
  materials: [
    ['普通钢片', 'Plain steel'],
    ['铝片', 'Aluminium'],
    ['木片', 'Wood'],
  ],
  poles: [
    ['异极相对', 'Opposite facing poles'],
    ['同极相对', 'Like facing poles'],
    ['想象分成两段', 'Imagined split'],
  ],
  field: [
    ['正上方', 'Above'],
    ['右侧', 'Right side'],
    ['斜上方', 'Diagonal'],
  ],
  earth: [
    ['只有背景', 'Background only'],
    ['干扰源近处', 'Nearby disturbance'],
    ['移到3倍距离', 'Three times farther'],
  ],
  wire: [
    ['无导线电流', 'No wire current'],
    ['⊙ 出纸面', '⊙ Out of page'],
    ['⊗ 入纸面', '⊗ Into page'],
  ],
  coil: [
    ['断电铁芯', 'Unpowered iron core'],
    ['通电空芯', 'Powered air core'],
    ['同电流铁芯', 'Matched-current iron core'],
  ],
  motor: [
    ['正向供电', 'Forward supply'],
    ['无供电', 'No supply'],
    ['反向供电', 'Reverse supply'],
  ],
  generator: [
    ['静止 · 闭合', 'Still · closed'],
    ['转动 · 闭合', 'Turning · closed'],
    ['转动 · 开路', 'Turning · open'],
  ],
};
const notes: Record<MagneticKind, Pair> = {
  materials: [
    '规定样品、同一磁铁与距离；只判断明显吸引。弱磁性、真实力大小、材料成分与运动均不预测。样品固定；金点检查条件，不是样品运动。',
    'Prescribed samples with matching magnet and distance; noticeable attraction only. Weak responses, force size, composition and motion are not predicted. Samples are held; the gold marker checks conditions.',
  ],
  poles: [
    '理想固定条形磁铁；箭头只表示吸引/排斥，不代表力值或运动。分段为想象图示，每段仍有两极；不要切割真实磁铁。',
    'Held ideal bar magnets; arrows show attraction/repulsion rather than force magnitude or motion. The imagined pieces each retain two poles; do not cut real magnets.',
  ],
  field: [
    '外部采用归一化点偶极近似，探针半径相同。曲线与磁针采用同一方向场；灰区不计算真实内部场，只提示S→N返回。图只画外部的一部分磁感线，完整线是闭合的。金点是查图，不是电荷轨迹。',
    'Exterior normalized point-dipole approximation at matching probe radius. Curves and needle share one direction field. Shaded interior is not calculated; S→N return is indicated. Only exterior parts of complete closed field lines are drawn. The gold marker inspects the map, not a charge trajectory.',
  ],
  earth: [
    '规定水平背景(北向1)，东向偶极干扰2/r³，r是相对距离。背景不变；图中源位置仅示意，不校准真实磁偏角、场强或导航。',
    'Assigned horizontal background (northward 1) and eastward dipole disturbance 2/r³, with relative distance r. Background stays fixed; source placement is schematic, not a calibration of real declination, strength or navigation.',
  ],
  wire: [
    '长直导线截面，传统电流±1为相对值。导线场按1/r比较，固定背景北向1。圆线只画导线场；磁针与向量看合成场。不接真实导线，金点不是绕线电子。',
    'Long-wire cross-section with relative conventional current ±1; its field varies as 1/r with a fixed northward background of 1. Circles show the wire field; the needle follows the sum. No real wiring; gold markers are not electrons orbiting the wire.',
  ],
  coil: [
    '理想受控电流、同线圈几何；空芯20匝/0.2 A指标为1，软铁规定增强系数3。线性模型不含饱和与剩磁，不预测提起物品个数。图中的环是匝数示意，不是接线说明。',
    'Ideal regulated current and matching coil geometry; air core at 20 turns/0.2 A is indicator 1; soft iron has assigned factor 3. Linear model excludes saturation/remanence and predicts no lifted-object count. Winding illustration is not wiring instructions.',
  ],
  motor: [
    '俯视两侧导线；均匀场0.4 T，20匝、边长0.1 m、供电电流0.2 A。理想换向在死点短暂断流；转矩来自同一两侧力模型。2.4秒巡查规定一圈，不求加速度、转速或滑转；无供电不是瞬间制停。',
    'Top view of active sides; uniform 0.4 T, 20 turns, 0.1 m sides and 0.2 A supply. Ideal commutation briefly opens at dead points; torque uses the same side-force geometry. A 2.4 s prescribed-turn inspection does not solve acceleration, RPM or coasting; no supply is not instant braking.',
  ],
  generator: [
    '理想滑环交流机：20匝、0.4 T、0.01 m²，闭合负载10 Ω，无线圈损耗。完整窗口1.25圈，物理时间按设定转速计算，压缩为2.4秒播放。机械输入=负载电能；开路不含负载传能。真实装置有损耗与可能的整流/储能。',
    'Ideal slip-ring AC generator: 20 turns, 0.4 T, 0.01 m² and a closed 10 Ω load, without coil losses. Full window is 1.25 turns; physical time follows assigned speed, compressed into 2.4 s. Mechanical input equals load energy; an open path transfers none to the load. Real devices have losses and possible rectification/storage.',
  ],
};
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = ink,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1),
    length = Math.hypot(x2 - x1, y2 - y1);
  if (length < 0.1) return null;
  const a = 8;
  return (
    <g stroke={color} fill={color} strokeWidth="2.5">
      <path d={`M${x1} ${y1}L${x2} ${y2}`} fill="none" />
      <path
        d={`M${x2} ${y2}L${x2 - a * Math.cos(angle - 0.45)} ${y2 - a * Math.sin(angle - 0.45)}L${x2 - a * Math.cos(angle + 0.45)} ${y2 - a * Math.sin(angle + 0.45)}Z`}
        stroke="none"
      />
    </g>
  );
}
function Bar({
  x,
  y,
  width = 120,
  reverse = false,
}: {
  x: number;
  y: number;
  width?: number;
  reverse?: boolean;
}) {
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 20}
        width={width}
        height="40"
        rx="6"
        fill={reverse ? red : blue}
      />
      <path
        d={`M${x} ${y - 20}h${width / 2 - 6}q6 0 6 6v28q0 6-6 6H${x}Z`}
        fill={reverse ? blue : red}
      />
      <text x={x - width / 4} y={y + 8} textAnchor="middle" fill="white">
        {reverse ? 'N' : 'S'}
      </text>
      <text x={x + width / 4} y={y + 8} textAnchor="middle" fill="white">
        {reverse ? 'S' : 'N'}
      </text>
    </g>
  );
}
function Compass({
  x,
  y,
  heading,
  r = 27,
}: {
  x: number;
  y: number;
  heading: number;
  r?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fdfaf5" stroke={ink} strokeWidth="1.5" />
      <g transform={`rotate(${heading})`}>
        <path d={`M0 ${-r + 5}L8 0H-8Z`} fill={red} />
        <path d={`M0 ${r - 5}L8 0H-8Z`} fill={blue} />
        <text y={-r - 7} textAnchor="middle" fill={red}>
          N
        </text>
      </g>
      <circle r="3" fill={gold} />
    </g>
  );
}
function MaterialScene({
  index,
  progress,
  mode,
}: {
  index: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = materialCase(index);
  return (
    <g>
      <text x="310" y="42" textAnchor="middle">
        {w(mode, '同一磁铁 · 同一距离', 'Same magnet · same distance')}
      </text>
      <Bar x={155} y={170} />
      <rect
        x="400"
        y="140"
        width="95"
        height="60"
        rx="6"
        fill={index === 2 ? '#eadfc9' : index === 1 ? '#e2ebed' : '#d6d1df'}
        stroke={ink}
      />
      <path
        d="M155 195v65h-50m340-55v55h50"
        fill="none"
        stroke={ink}
        strokeWidth="2"
      />
      <text x="445" y="120" textAnchor="middle">
        {w(mode, m.zh, m.en)}
      </text>
      {m.attracted && (
        <Arrow x1={365} y1={170} x2={260} y2={170} color={gold} />
      )}
      <text x="310" y="310" textAnchor="middle">
        {w(
          mode,
          m.attracted ? '明显吸引' : '没有明显吸引',
          m.attracted ? 'Noticeable attraction' : 'No noticeable attraction',
        )}
      </text>
      <circle cx={110 + progress * 380} cy="355" r="7" fill={gold} />
      <path d="M110 355h380" stroke={ink} strokeDasharray="3 5" />
    </g>
  );
}
function PoleScene({
  index,
  progress,
  mode,
}: {
  index: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = poleCase(index);
  return (
    <g>
      <text x="310" y="45" textAnchor="middle">
        {w(mode, '固定磁铁，比较相对端', 'Held bars: compare facing ends')}
      </text>
      <Bar x={165} y={155} />
      <Bar x={455} y={155} reverse={index === 1} />
      <Arrow
        x1={m.attraction ? 255 : 295}
        y1={155}
        x2={m.attraction ? 295 : 255}
        y2={155}
        color={gold}
      />
      <Arrow
        x1={m.attraction ? 365 : 325}
        y1={155}
        x2={m.attraction ? 325 : 365}
        y2={155}
        color={gold}
      />
      <text x="310" y="220" textAnchor="middle">
        {m.facing} ·{' '}
        {w(
          mode,
          m.attraction ? '吸引' : '排斥',
          m.attraction ? 'Attraction' : 'Repulsion',
        )}
      </text>
      {m.split && (
        <>
          <Bar x={230} y={295} width={90} />
          <Bar x={390} y={295} width={90} />
          <path d="M310 270v50" stroke={ink} strokeDasharray="4 5" />
          <text x="310" y="365" textAnchor="middle">
            {w(mode, '每段都有S与N', 'Each piece retains S and N')}
          </text>
        </>
      )}
      <circle
        cx={m.attraction ? 255 + progress * 40 : 295 - progress * 40}
        cy={155}
        r="6"
        fill={green}
      />
    </g>
  );
}
function FieldScene({
  angle,
  polarity,
  progress,
  mode,
}: {
  angle: number;
  polarity: number;
  progress: number;
  mode: LanguageMode;
}) {
  const p = fieldProbe(angle, polarity),
    scale = 54,
    cx = 310,
    cy = 185;
  const point = (v: { x: number; y: number }) => ({
    x: cx + v.x * scale,
    y: cy - v.y * scale,
  });
  return (
    <g>
      {[1.2, 1.9, 2.6].flatMap((k) =>
        [true, false].map((upper) => {
          const line = dipoleLine(k, upper),
            ps = line.map(point),
            a = ps[49]!,
            b = ps[53]!;
          return (
            <g key={`${k}-${upper}`}>
              <polyline
                points={ps.map((v) => `${v.x},${v.y}`).join(' ')}
                stroke={blue}
                fill="none"
                strokeWidth="1.8"
              />
              <Arrow
                x1={polarity > 0 ? a.x : b.x}
                y1={polarity > 0 ? a.y : b.y}
                x2={polarity > 0 ? b.x : a.x}
                y2={polarity > 0 ? b.y : a.y}
                color={blue}
              />
            </g>
          );
        }),
      )}
      <circle
        cx={cx}
        cy={cy}
        r={0.9 * scale}
        fill="#eee8f1"
        stroke={ink}
        strokeDasharray="3 5"
      />
      <Bar x={cx} y={cy} width={70} reverse={polarity < 0} />
      <Arrow
        x1={cx - polarity * 30}
        y1={cy + 30}
        x2={cx + polarity * 30}
        y2={cy + 30}
        color={green}
      />
      <circle
        cx={cx}
        cy={cy}
        r={1.5 * scale}
        fill="none"
        stroke={ink}
        opacity=".35"
        strokeDasharray="2 5"
      />
      <Compass x={cx + p.x * scale} y={cy - p.y * scale} heading={p.heading} />
      <circle
        cx={
          cx +
          1.5 * scale * Math.cos(((angle + progress * 360) * Math.PI) / 180)
        }
        cy={
          cy -
          1.5 * scale * Math.sin(((angle + progress * 360) * Math.PI) / 180)
        }
        r="5"
        fill={gold}
      />
      <text x="310" y="367" textAnchor="middle">
        {w(
          mode,
          '外部方向图 · 灰区：内部示意',
          'Exterior map · shaded: interior schematic',
        )}
      </text>
    </g>
  );
}
function EarthScene({
  distance,
  progress,
  mode,
}: {
  distance: number | null;
  progress: number;
  mode: LanguageMode;
}) {
  const m = earthCompass(distance),
    cx = 245,
    cy = 205;
  return (
    <g>
      <text x="310" y="35" textAnchor="middle">
        {w(
          mode,
          '地图北 = 本图规定背景方向',
          'Map north = assigned background',
        )}
      </text>
      <Arrow x1={cx} y1={cy} x2={cx} y2={cy - 60} color={green} />
      <Arrow
        x1={cx}
        y1={cy - 60}
        x2={cx + m.east * 60}
        y2={cy - 60}
        color={blue}
      />
      <Arrow x1={cx} y1={cy} x2={cx + m.east * 60} y2={cy - 60} color={gold} />
      <text x={cx} y={85} textAnchor="middle">
        N
      </text>
      <Compass x={cx} y={cy} heading={m.heading} r={34} />
      {distance !== null && (
        <>
          <Bar x={245 + 75 * distance} y={205} width={60} />
          <text x={245 + 75 * distance} y={270} textAnchor="middle">
            r={distance}
          </text>
        </>
      )}
      <circle
        cx={cx + m.east * 60 * progress}
        cy={cy - 60 * progress}
        r="6"
        fill={gold}
      />
      <text x="310" y="352" textAnchor="middle">
        {w(
          mode,
          '同一背景，加上附近磁源',
          'Same background plus a nearby source',
        )}
      </text>
    </g>
  );
}
function WireScene({
  current,
  distance,
  progress,
  mode,
}: {
  current: number;
  distance: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = wireCompass(current, distance),
    cx = 310,
    cy = 245;
  return (
    <g>
      <text x="310" y="32" textAnchor="middle">
        {w(
          mode,
          '导线截面：磁针看总场',
          'Wire cross-section: needle sees total field',
        )}
      </text>
      <Arrow x1={80} y1={285} x2={80} y2={130} color={green} />
      <text x="80" y="90" textAnchor="middle">
        {w(mode, '背景', 'Background')}
      </text>
      {current !== 0 &&
        [48, 78, 110].map((r) => (
          <g key={r}>
            <circle cx={cx} cy={cy} r={r} stroke={blue} fill="none" />
            <Arrow
              x1={cx + r}
              y1={cy + current * 15}
              x2={cx + r}
              y2={cy - current * 15}
              color={blue}
            />
          </g>
        ))}
      <circle
        cx={cx}
        cy={cy}
        r="17"
        fill="#f6f1eb"
        stroke={ink}
        strokeWidth="2"
      />
      {current > 0 ? (
        <circle cx={cx} cy={cy} r="5" fill={ink} />
      ) : current < 0 ? (
        <path
          d={`M${cx - 7} ${cy - 7}l14 14m-14 0l14-14`}
          stroke={ink}
          strokeWidth="3"
        />
      ) : (
        <text x={cx} y={cy + 8} textAnchor="middle">
          0
        </text>
      )}
      <Compass x={cx} y={cy - distance * 60} heading={m.heading} r={23} />
      <circle
        cx={cx + 78 * Math.cos(progress * 2 * Math.PI)}
        cy={cy - current * 78 * Math.sin(progress * 2 * Math.PI)}
        r="5"
        fill={gold}
        opacity={current === 0 ? 0 : 1}
      />
      <text x="500" y="205" textAnchor="middle">
        {current === 0
          ? w(mode, '无导线场', 'No wire field')
          : current > 0
            ? '⊙'
            : '⊗'}
      </text>
      <text x="310" y="375" textAnchor="middle">
        {w(
          mode,
          '圆线：导线场；N端：合成方向',
          'Circles: wire field; N tip: total direction',
        )}
      </text>
    </g>
  );
}
function CoilScene({
  turns,
  current,
  iron,
  polarity,
  progress,
  mode,
}: {
  turns: number;
  current: number;
  iron: boolean;
  polarity: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = coilField(turns, current, iron, polarity);
  return (
    <g>
      <text x="310" y="35" textAnchor="middle">
        {w(
          mode,
          '电流独立控制，几何保持相同',
          'Current regulated; geometry matched',
        )}
      </text>
      <rect
        x="175"
        y="125"
        width="235"
        height="60"
        rx="16"
        fill={iron ? '#c9c2d4' : '#f8f5fa'}
        stroke={ink}
        strokeDasharray={iron ? undefined : '5 4'}
      />
      {Array.from({ length: turns }, (_, i) => (
        <ellipse
          key={i}
          cx={185 + (i * 215) / (turns - 1)}
          cy="155"
          rx="5"
          ry="47"
          fill="none"
          stroke={gold}
          strokeWidth="1.6"
        />
      ))}
      {current > 0 && (
        <Arrow
          x1={polarity > 0 ? 215 : 370}
          y1={155}
          x2={polarity > 0 ? 370 : 215}
          y2={155}
          color={green}
        />
      )}
      <text x="290" y="235" textAnchor="middle">
        {turns} {w(mode, '匝', 'turns')} · {fmt(current)} A
      </text>
      <circle
        cx="495"
        cy="155"
        r="31"
        stroke={ink}
        fill={current === 0 ? '#ece8ee' : m.rightPole === 'N' ? red : blue}
      />
      <text x="495" y="164" textAnchor="middle" fill="white">
        {m.rightPole ?? '—'}
      </text>
      <text x="495" y="85" textAnchor="middle">
        {w(mode, '右端看', 'Right-end view')}
      </text>
      {current > 0 && (
        <Arrow
          x1={532}
          y1={155 + polarity * 17}
          x2={532}
          y2={155 - polarity * 17}
          color={gold}
        />
      )}
      <rect x="110" y="285" width="400" height="16" rx="5" fill="#eee7f1" />
      <rect
        x="110"
        y="285"
        width={(400 * m.relative) / 12}
        height="16"
        rx="5"
        fill={blue}
      />
      {[0, 3, 6, 9, 12].map((v) => (
        <text key={v} x={110 + (400 * v) / 12} y="330" textAnchor="middle">
          {v}
        </text>
      ))}
      <circle
        cx={110 + ((400 * m.relative) / 12) * progress}
        cy="293"
        r="6"
        fill={gold}
      />
      <text x="310" y="372" textAnchor="middle">
        {w(
          mode,
          '相对场指标，不是物品个数',
          'Relative field indicator, not lifted-object count',
        )}
      </text>
    </g>
  );
}
function MotorScene({
  supply,
  angle,
  mode,
}: {
  supply: number;
  angle: number;
  mode: LanguageMode;
}) {
  const m = motorReading(supply, angle),
    cx = 310,
    cy = 180,
    sx = 1500 * m.x,
    sz = 1500 * m.z;
  const points = [
    { x: cx + sx, y: cy + sz, dir: 1 },
    { x: cx - sx, y: cy - sz, dir: -1 },
  ];
  return (
    <g>
      <text x="310" y="30" textAnchor="middle">
        {w(mode, '轴向俯视：两侧导线', 'Top view along shaft: active sides')}
      </text>
      <rect x="55" y="120" width="55" height="125" rx="8" fill={red} />
      <text x="82" y="190" textAnchor="middle" fill="white">
        N
      </text>
      <rect x="510" y="120" width="55" height="125" rx="8" fill={blue} />
      <text x="537" y="190" textAnchor="middle" fill="white">
        S
      </text>
      {[105, 180, 255].map((y) => (
        <Arrow key={y} x1={135} y1={y} x2={485} y2={y} color="#c8b9d0" />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r="80"
        stroke={ink}
        fill="none"
        strokeDasharray="3 5"
      />
      <path
        d={`M${cx - sx} ${cy - sz}L${cx + sx} ${cy + sz}`}
        stroke={gold}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="13" fill="#f5f0e9" stroke={ink} />
      {points.map((p) => (
        <g key={p.dir}>
          <circle cx={p.x} cy={p.y} r="13" fill="#faf7fc" stroke={ink} />
          {m.current === 0 ? (
            <path d={`M${p.x - 5} ${p.y}h10`} stroke={ink} strokeWidth="2" />
          ) : m.current * p.dir > 0 ? (
            <circle cx={p.x} cy={p.y} r="4" fill={ink} />
          ) : (
            <path
              d={`M${p.x - 5} ${p.y - 5}l10 10m-10 0l10-10`}
              stroke={ink}
              strokeWidth="2"
            />
          )}
          {m.current !== 0 && (
            <Arrow
              x1={p.x + p.dir * 22}
              y1={p.y}
              x2={p.x + p.dir * 22}
              y2={p.y + Math.sign(m.forceZ) * p.dir * 48}
              color={green}
            />
          )}
        </g>
      ))}
      <text x="310" y="318" textAnchor="middle">
        {w(
          mode,
          supply === 0
            ? '无电磁驱动'
            : supply > 0
              ? '驱动方向：逆时针'
              : '驱动方向：顺时针',
          supply === 0
            ? 'No electromagnetic drive'
            : supply > 0
              ? 'Drive: counterclockwise'
              : 'Drive: clockwise',
        )}
      </text>
      <text x="310" y="365" textAnchor="middle">
        {w(
          mode,
          '电输入 → 机械输出 + 其他',
          'Electrical input → motion + other transfers',
        )}
      </text>
    </g>
  );
}
function GeneratorScene({
  speed,
  closed,
  progress,
  mode,
}: {
  speed: number;
  closed: boolean;
  progress: number;
  mode: LanguageMode;
}) {
  const m = generatorReading(speed, closed, progress),
    cx = 150,
    cy = 170,
    sx = 65 * Math.sin(m.phase),
    sz = 65 * Math.cos(m.phase);
  const x = (t: number) => 345 + (230 * t) / 2.5,
    y = (v: number) => 170 - (90 * v) / 1.1;
  const samples = Array.from({ length: 101 }, (_, i) =>
    generatorReading(speed, closed, (progress * i) / 100),
  );
  return (
    <g>
      <text x="310" y="30" textAnchor="middle">
        {w(mode, '转动线圈；滑环输出交流', 'Turned coil; slip rings retain AC')}
      </text>
      <Arrow x1={50} y1={170} x2={255} y2={170} color="#c8b9d0" />
      <circle
        cx={cx}
        cy={cy}
        r="74"
        fill="none"
        stroke={ink}
        strokeDasharray="3 5"
      />
      <path
        d={`M${cx - sx} ${cy - sz}L${cx + sx} ${cy + sz}`}
        stroke={gold}
        strokeWidth="7"
      />
      <Arrow
        x1={cx}
        y1={cy}
        x2={cx + 47 * Math.cos(m.phase)}
        y2={cy - 47 * Math.sin(m.phase)}
        color={green}
      />
      <circle cx={cx} cy={cy} r="10" fill="none" stroke={ink} />
      <circle cx={cx} cy={cy} r="17" fill="none" stroke={ink} />
      <text x={cx} y="280" textAnchor="middle">
        {w(mode, '两滑环示意', 'Two slip rings')}
      </text>
      <path d="M345 70V270H575M345 170H575" stroke={ink} fill="none" />
      <text x="324" y="65" textAnchor="middle">
        V
      </text>
      {[-1, 0, 1].map((v) => (
        <text key={v} x="327" y={y(v) + 7} textAnchor="end">
          {v}
        </text>
      ))}
      {[0, 1, 2.5].map((t) => (
        <text key={t} x={x(t)} y="300" textAnchor="middle">
          {t}
        </text>
      ))}
      <text x="555" y="334" textAnchor="middle">
        t (s)
      </text>
      <polyline
        points={samples.map((s) => `${x(s.seconds)},${y(s.voltage)}`).join(' ')}
        stroke={blue}
        fill="none"
        strokeWidth="2.5"
      />
      <circle cx={x(m.seconds)} cy={y(m.voltage)} r="5" fill={gold} />
      <text x="310" y="375" textAnchor="middle">
        {w(
          mode,
          closed ? '机械输入 → 负载电能' : '开路：有电压，没有负载电流',
          closed
            ? 'Mechanical input → load energy'
            : 'Open path: voltage without load current',
        )}
      </text>
    </g>
  );
}
function MagneticBench({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: MagneticKind }) {
  const [choice, setChoice] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [turns, setTurns] = useState(20),
    [polarity, setPolarity] = useState(1),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const defaults =
    kind === 'field'
      ? fieldAngles[choice]!
      : kind === 'earth'
        ? (earthDistances[choice] ?? 1)
        : kind === 'wire'
          ? 1
          : kind === 'coil'
            ? coilCases[choice]!.current
            : kind === 'motor'
              ? 30
              : kind === 'generator'
                ? generatorCases[choice]!.speed
                : 1;
  const value = custom ?? defaults,
    canonical =
      Math.abs(value - defaults) < 1e-9 && turns === 20 && polarity === 1;
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
  };
  const choose = (i: number) => {
    reset();
    setChoice(i);
    setCustom(null);
    setTurns(20);
    setPolarity(1);
  };
  let scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[],
    slider: {
      name: Pair;
      min: number;
      max: number;
      step: number;
      unit: string;
      disabled?: boolean;
    } | null = null;
  if (kind === 'materials') {
    const m = materialCase(choice);
    scene = <MaterialScene index={choice} progress={progress} mode={mode} />;
    metrics = [
      {
        title: ['样品', 'Sample'],
        value: <B mode={mode} zh={m.zh} en={m.en} />,
      },
      {
        title: ['观察判断', 'Observation'],
        value: (
          <B
            mode={mode}
            zh={m.attracted ? '明显吸引' : '没有明显吸引'}
            en={m.attracted ? 'Attracted' : 'Not noticeably attracted'}
          />
        ),
      },
      {
        title: ['比较条件', 'Comparison condition'],
        value: (
          <B mode={mode} zh="磁铁与距离相同" en="Same magnet and distance" />
        ),
      },
    ];
    columns = [
      ['规定样品', 'Sample'],
      ['明显吸引', 'Noticeable attraction'],
    ];
    row = (i) => [
      options.materials[i]!,
      materialCase(i).attracted
        ? ['是', 'Yes']
        : ['未明显吸引', 'Not noticeable'],
    ];
  } else if (kind === 'poles') {
    const m = poleCase(choice);
    scene = <PoleScene index={choice} progress={progress} mode={mode} />;
    metrics = [
      { title: ['相对磁极', 'Facing poles'], value: m.facing },
      {
        title: ['作用方向', 'Interaction'],
        value: (
          <B
            mode={mode}
            zh={m.attraction ? '吸引' : '排斥'}
            en={m.attraction ? 'Attraction' : 'Repulsion'}
          />
        ),
      },
      { title: ['每段磁极', 'Poles per piece'], value: 'S + N' },
    ];
    columns = [
      ['条件', 'Condition'],
      ['相对端', 'Facing ends'],
      ['作用', 'Interaction'],
    ];
    row = (i) => {
      const p = poleCase(i);
      return [
        options.poles[i]!,
        p.facing,
        p.attraction ? ['吸引', 'Attraction'] : ['排斥', 'Repulsion'],
      ];
    };
  } else if (kind === 'field') {
    const m = fieldProbe(value, polarity);
    scene = (
      <FieldScene
        angle={value}
        polarity={polarity}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      {
        title: ['探针位置角(从右方逆时针)', 'Probe angle (CCW from right)'],
        value: `${fmt(value)}°`,
      },
      {
        title: [
          'N端方向(北0°，东为正)',
          'N-tip bearing (north 0°, east positive)',
        ],
        value: `${fmt(m.heading)}°`,
      },
      { title: ['探针半径', 'Probe radius'], value: '1.5 r₀' },
    ];
    columns = [
      ['位置', 'Location'],
      ['N端朝向角', 'N-tip bearing'],
      ['半径', 'Radius'],
    ];
    row = (i) => [
      options.field[i]!,
      `${fmt(fieldProbe(fieldAngles[i]!).heading)}°`,
      '1.5 r₀',
    ];
    slider = {
      name: ['自由探针位置角', 'Free probe position angle'],
      min: 0,
      max: 360,
      step: 15,
      unit: '°',
    };
  } else if (kind === 'earth') {
    const distance = choice === 0 ? null : value,
      m = earthCompass(distance);
    scene = <EarthScene distance={distance} progress={progress} mode={mode} />;
    metrics = [
      {
        title: ['北向背景(相对)', 'Northward background (relative)'],
        value: '1',
      },
      {
        title: ['东向干扰(相对)', 'Eastward disturbance (relative)'],
        value: fmt(m.east),
      },
      {
        title: ['偏东朝向角', 'Heading east of north'],
        value: `${fmt(m.heading)}°`,
      },
    ];
    columns = [
      ['条件', 'Condition'],
      ['东向干扰', 'Eastward disturbance'],
      ['朝向角', 'Heading'],
    ];
    row = (i) => {
      const p = earthCompass(earthDistances[i]!);
      return [options.earth[i]!, fmt(p.east), `${fmt(p.heading)}°`];
    };
    slider = {
      name: ['自由干扰源距离', 'Free disturbance distance'],
      min: 1,
      max: 4,
      step: 0.25,
      unit: 'r₀',
      disabled: choice === 0,
    };
  } else if (kind === 'wire') {
    const current = [0, 1, -1][choice]!,
      m = wireCompass(current, value);
    scene = (
      <WireScene
        current={current}
        distance={value}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      {
        title: ['传统电流(相对)', 'Conventional current (relative)'],
        value: current === 0 ? '0' : current > 0 ? '⊙ +1' : '⊗ −1',
      },
      {
        title: ['导线场向右分量(相对)', 'Wire eastward component (relative)'],
        value: fmt(m.wire.x),
      },
      { title: ['合成朝向角', 'Total heading'], value: `${fmt(m.heading)}°` },
    ];
    columns = [
      ['导线条件', 'Wire condition'],
      ['向右场分量', 'Eastward wire field'],
      ['合成朝向', 'Total heading'],
    ];
    row = (i) => {
      const p = wireCompass([0, 1, -1][i]!, 1);
      return [options.wire[i]!, fmt(p.wire.x), `${fmt(p.heading)}°`];
    };
    slider = {
      name: ['自由探针到导线距离', 'Free needle-wire distance'],
      min: 0.75,
      max: 3,
      step: 0.25,
      unit: 'r₀',
    };
  } else if (kind === 'coil') {
    const iron = coilCases[choice]!.iron,
      m = coilField(turns, value, iron, polarity);
    scene = (
      <CoilScene
        turns={turns}
        current={value}
        iron={iron}
        polarity={polarity}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      {
        title: ['匝数×电流', 'Turns × current'],
        value: `${fmt(m.ampereTurns)} A·turn`,
      },
      {
        title: ['相对场指标', 'Relative field indicator'],
        value: fmt(m.relative),
      },
      { title: ['右端磁极', 'Right-end pole'], value: m.rightPole ?? '—' },
    ];
    columns = [
      ['条件', 'Condition'],
      ['匝数×电流', 'Turns × current'],
      ['相对场指标', 'Field indicator'],
    ];
    row = (i) => {
      const c = coilCases[i]!,
        p = coilField(20, c.current, c.iron);
      return [
        options.coil[i]!,
        `${fmt(p.ampereTurns)} A·turn`,
        fmt(p.relative),
      ];
    };
    slider = {
      name: ['自由受控电流', 'Free regulated current'],
      min: 0,
      max: 0.4,
      step: 0.1,
      unit: 'A',
      disabled: choice === 0,
    };
  } else if (kind === 'motor') {
    const supply = motorSupplies[choice]!,
      angle = value + supply * 360 * progress,
      m = motorReading(supply, angle);
    scene = <MotorScene supply={supply} angle={angle} mode={mode} />;
    metrics = [
      {
        title: ['规定位置角', 'Prescribed shaft angle'],
        value: `${fmt(angle)}°`,
      },
      {
        title: ['线圈电流(换向后)', 'Coil current (after commutation)'],
        value: `${fmt(m.current)} A`,
      },
      {
        title: ['轴转矩(逆时针为正)', 'Shaft torque (CCW positive)'],
        value: `${fmt(m.torque)} N·m`,
      },
    ];
    columns = [
      ['供电', 'Supply'],
      ['30°线圈电流', 'Coil current at 30°'],
      ['30°转矩', 'Torque at 30°'],
    ];
    row = (i) => {
      const p = motorReading(motorSupplies[i]!, 30);
      return [options.motor[i]!, `${fmt(p.current)} A`, `${fmt(p.torque)} N·m`];
    };
    slider = {
      name: ['自由起始位置角', 'Free starting shaft angle'],
      min: 0,
      max: 330,
      step: 30,
      unit: '°',
    };
  } else {
    const closed = generatorCases[choice]!.closed,
      m = generatorReading(value, closed, progress);
    scene = (
      <GeneratorScene
        speed={value}
        closed={closed}
        progress={progress}
        mode={mode}
      />
    );
    metrics = [
      { title: ['电压峰值', 'Peak voltage'], value: `${fmt(m.peak)} V` },
      {
        title: ['负载电流峰值', 'Peak load current'],
        value: `${fmt(m.currentPeak)} A`,
      },
      {
        title: ['已转移负载能量', 'Energy transferred to load'],
        value: `${fmt(m.energy)} J`,
      },
    ];
    columns = [
      ['条件', 'Condition'],
      ['电压峰值', 'Peak voltage'],
      ['负载电能', 'Load energy'],
    ];
    row = (i) => {
      const c = generatorCases[i]!,
        p = generatorReading(c.speed, c.closed, 1);
      return [options.generator[i]!, `${fmt(p.peak)} V`, `${fmt(p.energy)} J`];
    };
    slider = {
      name: ['自由规定转速', 'Free assigned rotation rate'],
      min: 0,
      max: 2,
      step: 0.5,
      unit: 'turn/s',
      disabled: choice === 0,
    };
  }
  const cell = (v: ReactNode) =>
    Array.isArray(v) ? (
      <B mode={mode} zh={String(v[0])} en={String(v[1])} />
    ) : (
      v
    );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-magnetic-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">MAGNETISM / FOLLOW THE CLUES</span>
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
            disabled={animation.running || slider.disabled}
            onChange={(e) => {
              reset();
              setCustom(Number(e.target.value));
            }}
          />
        </label>
      )}
      {(kind === 'field' || kind === 'coil') && (
        <div className="phy-lab-controls">
          {kind === 'coil' && (
            <label>
              <B mode={mode} zh="自由匝数" en="Free turns" /> · {turns}
              <input
                type="range"
                aria-label={mode === 'en' ? 'Free turns' : '自由匝数'}
                min="10"
                max="40"
                step="10"
                value={turns}
                disabled={animation.running}
                onChange={(e) => {
                  reset();
                  setTurns(Number(e.target.value));
                }}
              />
            </label>
          )}
          <button
            className="phy-button secondary"
            disabled={animation.running}
            aria-pressed={polarity === -1}
            onClick={() => {
              reset();
              setPolarity(-polarity);
            }}
          >
            <B
              mode={mode}
              zh={
                polarity === 1
                  ? kind === 'field'
                    ? '翻转磁铁'
                    : '反转线圈电流'
                  : '恢复原方向'
              }
              en={
                polarity === 1
                  ? kind === 'field'
                    ? 'Reverse magnet'
                    : 'Reverse coil current'
                  : 'Restore direction'
              }
            />
          </button>
        </div>
      )}
      <svg
        viewBox="0 0 620 390"
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
          <B mode={mode} zh="完整巡查并记录" en="Inspect fully and record" />
        </button>
        <button className="phy-button secondary" onClick={reset}>
          <B mode={mode} zh="回到起点" en="Back to start" />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          mode={mode}
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整巡查。`}
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
export const MagneticMaterialsLab = (p: LabProps) => (
  <MagneticBench {...p} kind="materials" />
);
export const MagneticPolesLab = (p: LabProps) => (
  <MagneticBench {...p} kind="poles" />
);
export const MagneticFieldLab = (p: LabProps) => (
  <MagneticBench {...p} kind="field" />
);
export const EarthCompassLab = (p: LabProps) => (
  <MagneticBench {...p} kind="earth" />
);
export const WireFieldLab = (p: LabProps) => (
  <MagneticBench {...p} kind="wire" />
);
export const ElectromagnetLab = (p: LabProps) => (
  <MagneticBench {...p} kind="coil" />
);
export const MotorLab = (p: LabProps) => <MagneticBench {...p} kind="motor" />;
export const GeneratorLab = (p: LabProps) => (
  <MagneticBench {...p} kind="generator" />
);
