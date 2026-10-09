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
  daylight,
  seasonReading,
  moonReading,
  moonPatch,
  planets,
  solarRuler,
  orbitReading,
  starReading,
  cosmicLevel,
  lightTravel,
  type SpaceKind,
} from './spaceModels';
type Pair = [string, string];
const w = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const fmt = (n: number) => String(Number(n.toFixed(4)));
const gold = '#dfbb79',
  blue = '#88bbc8',
  white = '#e9e6ef',
  green = '#9bb79f',
  dark = '#28334b';
const titles: Record<SpaceKind, Pair> = {
  day: ['自转与昼夜', 'Rotation and daylight'],
  seasons: ['倾斜与两半球光照', 'Tilt and hemispheric sunlight'],
  moon: ['月相的两个视角', 'Two views of lunar phases'],
  system: ['太阳系共用比例尺', 'Shared solar-system rulers'],
  orbit: ['向前运动与引力', 'Forward motion and gravity'],
  stars: ['恒星输出与接收', 'Stellar output and reception'],
  galaxies: ['宇宙地址层级', 'Cosmic address levels'],
  distance: ['光信号的旅行时间', 'Light-signal travel time'],
};
const options: Record<SpaceKind, Pair[]> = {
  day: [
    ['正午', 'Noon'],
    ['午夜', 'Midnight'],
    ['日出边界', 'Sunrise boundary'],
  ],
  seasons: [
    ['春分附近', 'March equinox'],
    ['六月位置', 'June position'],
    ['十二月位置', 'December position'],
  ],
  moon: [
    ['新月', 'New Moon'],
    ['上弦', 'First quarter'],
    ['满月', 'Full Moon'],
  ],
  system: [
    ['地球', 'Earth'],
    ['木星', 'Jupiter'],
    ['海王星', 'Neptune'],
  ],
  orbit: [
    ['圆形轨道', 'Circular orbit'],
    ['想象移除引力', 'Imagine no gravity'],
    ['无横向初速', 'No sideways start'],
  ],
  stars: [
    ['输出1 · 距离1', 'Output 1 · distance 1'],
    ['输出1 · 距离2', 'Output 1 · distance 2'],
    ['输出4 · 距离2', 'Output 4 · distance 2'],
  ],
  galaxies: [
    ['太阳系', 'Solar system'],
    ['银河系', 'Milky Way'],
    ['多个星系', 'Multiple galaxies'],
  ],
  distance: [
    ['地日尺度', 'Solar distance'],
    ['附近恒星尺度', 'Nearby-star distance'],
    ['星系直径尺度', 'Galactic diameter'],
  ],
};
const notes: Record<SpaceKind, Pair> = {
  day: [
    '赤道、春秋分附近，平行太阳光固定左方；当地太阳时简化为24小时太阳日，一圈压缩为2.4秒。地点和昼夜边界共用朝向模型，天体大小和距离是示意；不预测时区、天气或极昼。',
    'Equatorial equinox with fixed parallel sunlight from the left. A simplified 24-hour solar day is compressed into 2.4 seconds. Place and boundary share one orientation model; body sizes and separation are schematic. Time zones, weather and polar day are not predicted.',
  ],
  seasons: [
    '圆轨道固定1 AU，轴约23.5°且在一年内方向不变；比较相反纬度。白昼按几何地平线计算，无大气折射或太阳圆盘修正；不是城市日出服务。太阳和地球大小未按轨道距离缩放，金点只是巡查。',
    'Circular orbit fixed at 1 AU; axis about 23.5° with fixed yearly direction, comparing opposite latitudes. Day length uses a geometric horizon without refraction or solar-disc correction; not a city sunrise service. Body sizes are unscaled; gold markers inspect.',
  ],
  moon: [
    '平行光、圆形相位路径，约29.53天为一个月相周期；从北方朝上的示意视角看亮面。月球约一半受光，右图计算可见亮面。金点是视线巡查，不是地球发出的光。轨道倾斜未画，不计算食；距离、直径和当前日期均不由本图给出。',
    'Parallel light and a circular phase path with a 29.53-day cycle, in a fixed northern-up convention. Half the Moon is lit; the right disc calculates visible illumination. Gold markers inspect the sightline, not light emitted by Earth. Orbital inclination is omitted; eclipses, real size/distance and today’s phase are not computed.',
  ],
  system: [
    '八颗行星共用太阳参考点和0–31 AU尺。数字是近似半长轴，非当天位置或地球到行星的距离。点大小和各行间距是排版，不是物理尺度。1 AU模型长度只改变纸带换算；金点是读尺。',
    'Eight planets share a solar reference and 0–31 AU ruler. Numbers approximate semimajor axes, not current positions or Earth-to-planet distances. Dot sizes and row gaps are unscaled. Model length per AU changes paper-strip conversion; gold markers read the ruler.',
  ],
  orbit: [
    '中心引力模型μ=1、表面半径1，时间单位τ。圆轨道、无引力切线和径向下落采用解析轨迹；共同窗口4τ压缩为2.4秒。箭头长度示意，速度和加速度的大小不互比。首次触碰表面后冻结位置，不解释碰撞或支撑力。不含空气、转动或其他天体。',
    'Central attraction with μ=1, surface radius 1 and normalized time unit τ. Analytic circular, no-gravity tangent and radial-fall paths share a 4τ window compressed into 2.4 seconds. Arrow lengths are illustrative; do not compare velocity and acceleration by their lengths. First contact freezes position without impact/support physics. Air, rotation and other bodies are omitted.',
  ],
  stars: [
    '相对接收光强=输出/距离²；理想点源各向均匀、真空透明，接收面积和谱段不变。球面图用同一半径尺度，矩形接收面积不变；不是眼睛亮度、星等或仪器实测。金点巡查，不给真实传播时间。',
    'Relative irradiance = output/distance² for an isotropic point source in transparent space, with detector area and band fixed. Wavefront radius shares one scale; detector area stays fixed. Not perceived brightness, magnitude or measurement. Gold markers inspect rather than time propagation.',
  ],
  galaxies: [
    '地址与成员示意：圆点代表天体或系统，不是数量统计；旋臂、位置和直径未按真实尺度。太阳系不在银河中心，多个星系只是宇宙一部分。图案连接不证明星座恒星彼此相邻；金点只巡查。',
    'Address/member schematic, not an object census. Arms, positions and diameters are unscaled. Our system is away from the galactic centre; several galaxies are one part of the universe. A constellation pattern does not prove nearby stars. Gold markers inspect.',
  ],
  distance: [
    '真空光速299792.458 km/s；1 AU=149597870.7 km，光年用365.25天。近星4.25光年、星系直径10万光年是近似尺度。静态单程新信号，每例重设画面尺度，完整光程压缩为2.4秒；不含处理延迟、移动或宇宙膨胀。',
    'Vacuum c=299792.458 km/s; 1 AU=149597870.7 km and a light-year uses 365.25 days. 4.25 ly and 100,000 ly are approximate teaching scales. Each static one-way new signal rescales the diagram and compresses travel into 2.4 seconds; processing, motion and expansion are omitted.',
  ],
};
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = white,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  if (Math.hypot(x2 - x1, y2 - y1) < 0.01) return null;
  return (
    <g fill={color} stroke={color} strokeWidth="2">
      <path d={`M${x1} ${y1}L${x2} ${y2}`} fill="none" />
      <path
        d={`M${x2} ${y2}L${x2 - 8 * Math.cos(a - 0.4)} ${y2 - 8 * Math.sin(a - 0.4)}L${x2 - 8 * Math.cos(a + 0.4)} ${y2 - 8 * Math.sin(a + 0.4)}Z`}
        stroke="none"
      />
    </g>
  );
}
function Disc({
  x,
  y,
  r = 30,
  sun = false,
  lightDirection = 180,
}: {
  x: number;
  y: number;
  r?: number;
  sun?: boolean;
  lightDirection?: number;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={sun ? gold : blue} />
      {!sun && (
        <path
          d={`M${x} ${y - r}A${r} ${r} 0 0 1 ${x} ${y + r}Z`}
          fill="#46546b"
          transform={`rotate(${lightDirection - 180} ${x} ${y})`}
        />
      )}
    </g>
  );
}
function BrightMoon({
  x,
  y,
  angle,
  r,
}: {
  x: number;
  y: number;
  angle: number;
  r: number;
}) {
  const ps = moonPatch(angle, r);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#49516a" />
      <polygon
        points={ps.map((p) => `${x + p.x},${y + p.y}`).join(' ')}
        fill="#eee6ca"
      />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#a5a0b4" />
    </g>
  );
}
function DayScene({
  value,
  p,
  mode,
}: {
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const hour = (value + 24 * p) % 24,
    m = daylight(hour),
    cx = 310,
    cy = 175,
    r = 88;
  return (
    <g>
      <text x="310" y="30" textAnchor="middle">
        {w(
          mode,
          '从北极上方看 · 太阳方向固定',
          'Above the north pole · Sun fixed',
        )}
      </text>
      <Disc x={65} y={175} sun r={29} />
      {[135, 175, 215].map((y) => (
        <Arrow key={y} x1={103} y1={y} x2={205} y2={y} color={gold} />
      ))}
      <Disc x={cx} y={cy} r={r} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={white} />
      <text x={cx} y={cy + 7} textAnchor="middle">
        N
      </text>
      <circle
        cx={cx + m.x * r}
        cy={cy - m.y * r}
        r="8"
        fill={gold}
        stroke={white}
      />
      <text x={cx + m.x * r + 14} y={cy - m.y * r - 12}>
        {w(mode, '地点', 'Place')}
      </text>
      <Arrow x1={315} y1={75} x2={270} y2={83} />
      <rect x="70" y="320" width="480" height="13" rx="6" fill="#46546b" />
      <rect x="190" y="320" width="240" height="13" fill={blue} />
      {[0, 6, 12, 18, 24].map((h) => (
        <text key={h} x={70 + h * 20} y="363" textAnchor="middle">
          {h}
        </text>
      ))}
      <circle cx={70 + hour * 20} cy="326" r="7" fill={gold} />
      <text x="310" y="296" textAnchor="middle">
        {w(mode, '当地太阳时 (h)', 'Local solar hours (h)')}
      </text>
    </g>
  );
}
function SeasonScene({
  value,
  latitude,
  tilt,
  p,
  mode,
}: {
  value: number;
  latitude: number;
  tilt: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = seasonReading(value, latitude, tilt),
    other = seasonReading(value, -latitude, tilt),
    a = (value * Math.PI) / 180,
    ex = 160 - 95 * Math.sin(a),
    ey = 180 - 60 * Math.cos(a),
    ax = 30 * Math.sin((tilt * Math.PI) / 180),
    ay = -30 * Math.cos((tilt * Math.PI) / 180);
  return (
    <g>
      <text x="310" y="30" textAnchor="middle">
        {w(mode, '轴方向不变 · 距离1 AU', 'Axis fixed · distance 1 AU')}
      </text>
      <ellipse
        cx="160"
        cy="180"
        rx="95"
        ry="60"
        stroke="#8d94af"
        fill="none"
        strokeDasharray="4 5"
      />
      <Disc x={160} y={180} sun r={20} />
      <Arrow
        x1={160 + (ex - 160) * 0.25}
        y1={180 + (ey - 180) * 0.25}
        x2={160 + (ex - 160) * 0.7}
        y2={180 + (ey - 180) * 0.7}
        color={gold}
      />
      <Disc
        x={ex}
        y={ey}
        r={18}
        lightDirection={(Math.atan2(180 - ey, 160 - ex) * 180) / Math.PI}
      />
      <path
        d={`M${ex - ax} ${ey - ay}L${ex + ax} ${ey + ay}`}
        stroke={white}
        strokeWidth="2"
      />
      <text x={ex + ax + 8} y={ey + ay}>
        N
      </text>
      <text x="160" y="297" textAnchor="middle">
        {w(mode, '轨道斜视示意', 'Oblique orbit schematic')}
      </text>
      <text x="445" y="98" textAnchor="middle">
        {w(mode, '几何白昼 (h)', 'Geometric daylight (h)')}
      </text>
      {[m, other].map((r, i) => (
        <g key={i}>
          <text x="330" y={145 + i * 88}>
            {r.latitude}°
          </text>
          <path
            d={`M330 ${164 + i * 88}H560`}
            stroke="#46546b"
            strokeWidth="15"
          />
          <path
            d={`M330 ${164 + i * 88}h${(230 * r.daylightHours) / 24}`}
            stroke={i === 0 ? blue : green}
            strokeWidth="15"
          />
          <circle
            cx={330 + ((230 * r.daylightHours) / 24) * p}
            cy={164 + i * 88}
            r="5"
            fill={gold}
          />
          <text x="560" y={145 + i * 88} textAnchor="end">
            {fmt(r.daylightHours)}
          </text>
        </g>
      ))}
      <text x="330" y="308">
        0
      </text>
      <text x="560" y="308" textAnchor="end">
        24
      </text>
      <text x="310" y="369" textAnchor="middle">
        {w(
          mode,
          '光照条件 ≠ 每天的天气',
          'Sunlight conditions ≠ daily weather',
        )}
      </text>
    </g>
  );
}
function MoonScene({
  value,
  p,
  mode,
}: {
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = moonReading(value),
    mx = 190 + 95 * m.x,
    my = 185 - 95 * m.y;
  return (
    <g>
      <text x="310" y="30" textAnchor="middle">
        {w(
          mode,
          '位置图与月面，不是同一视角',
          'Position and disc: different views',
        )}
      </text>
      {[140, 185, 230].map((y) => (
        <Arrow key={y} x1={25} y1={y} x2={65} y2={y} color={gold} />
      ))}
      <circle
        cx="190"
        cy="185"
        r="95"
        fill="none"
        stroke="#9b94b1"
        strokeDasharray="4 5"
      />
      <text x="190" y="62" textAnchor="middle" style={{ fontSize: 20 }}>
        {w(mode, '大圆地球 · 小圆月球', 'Earth (large) · Moon (small)')}
      </text>
      <Disc x={190} y={185} r={25} />
      <Disc x={mx} y={my} r={15} />
      <path d={`M190 185L${mx} ${my}`} stroke={green} strokeDasharray="3 5" />
      <circle
        cx={190 + (mx - 190) * p}
        cy={185 + (my - 185) * p}
        r="4"
        fill={gold}
      />
      <text x="190" y="327" textAnchor="middle">
        {w(mode, '空间位置(轨道倾斜未画)', 'Position (tilt omitted)')}
      </text>
      <BrightMoon x={465} y={185} r={71} angle={value} />
      <text x="465" y="327" textAnchor="middle">
        {w(mode, '地球视角', 'View from Earth')}
      </text>
      <text x="310" y="372" textAnchor="middle">
        {w(mode, '月相不是地球影子', 'Phases are not Earth’s shadow')}
      </text>
    </g>
  );
}
function SystemScene({
  index,
  p,
  mode,
}: {
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  const selected = [2, 4, 7][index]!;
  const x = (au: number) => 195 + (360 * au) / 31;
  return (
    <g>
      <text x="310" y="29" textAnchor="middle">
        {w(
          mode,
          '同一太阳参考 · 平均轨道尺度',
          'Same solar reference · orbit scale',
        )}
      </text>
      {planets.map((o, i) => (
        <g key={o.en}>
          <text x="40" y={67 + i * 33} style={{ fontSize: 21 }}>
            {mode === 'en' ? o.en : o.zh}
          </text>
          <path
            d={`M195 ${60 + i * 33}H555`}
            stroke={i === selected ? white : '#55647d'}
          />
          <circle
            cx={x(o.au)}
            cy={60 + i * 33}
            r={i === selected ? 6 : 4}
            fill={i === selected ? gold : blue}
          />
          {i === selected && (
            <circle cx={x(o.au * p)} cy={60 + i * 33} r="3" fill={white} />
          )}
          <text
            x="585"
            y={67 + i * 33}
            textAnchor="end"
            style={{ fontSize: 20 }}
          >
            {o.au}
          </text>
        </g>
      ))}
      {[0, 10, 20, 30].map((au) => (
        <text key={au} x={x(au)} y="341" textAnchor="middle">
          {au}
        </text>
      ))}
      <text x="310" y="375" textAnchor="middle">
        {w(mode, 'AU · 点的直径未按距离尺度画', 'AU · dot sizes are unscaled')}
      </text>
    </g>
  );
}
function OrbitScene({
  index,
  value,
  p,
  mode,
}: {
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = orbitReading(index, p, value),
    cx = 310,
    cy = 202,
    s = 43;
  const pts = Array.from({ length: 81 }, (_, i) =>
    orbitReading(index, (p * i) / 80, value),
  );
  const x = cx + m.x * s,
    y = cy - m.y * s;
  return (
    <g>
      <text x="310" y="29" textAnchor="middle">
        {w(mode, '金：速度 · 绿：向内引力', 'Gold: velocity · green: gravity')}
      </text>
      <circle cx={cx} cy={cy} r={s} fill={blue} stroke={white} />
      <text x={cx} y={cy + 8} textAnchor="middle">
        r=1
      </text>
      <path
        d={`M${cx - 120} ${cy}H${cx + 160}M${cx} ${cy - 140}V${cy + 125}`}
        stroke="#5b6681"
        strokeDasharray="3 5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={value * s}
        fill="none"
        stroke="#5b6681"
        strokeDasharray="2 5"
      />
      <polyline
        points={pts.map((v) => `${cx + v.x * s},${cy - v.y * s}`).join(' ')}
        stroke={gold}
        fill="none"
        strokeWidth="2.5"
      />
      <circle cx={x} cy={y} r="7" fill={white} />
      {!m.contact && (
        <Arrow
          x1={x}
          y1={y}
          x2={x + m.vx * 50}
          y2={y - m.vy * 50}
          color={gold}
        />
      )}
      {m.gravity > 0 && (
        <Arrow
          x1={x}
          y1={y}
          x2={x - (m.x / m.r) * 38}
          y2={y + (m.y / m.r) * 38}
          color={green}
        />
      )}
      <text x="310" y="351" textAnchor="middle">
        {m.contact
          ? w(
              mode,
              '首次触碰：后续碰撞不计算',
              'First contact: impact not calculated',
            )
          : `t = ${fmt(m.elapsed)} τ`}
      </text>
      <text x="310" y="379" textAnchor="middle" style={{ fontSize: 20 }}>
        {w(
          mode,
          '模型单位 · 不是实际卫星的米和秒',
          'Model units, not satellite metres/seconds',
        )}
      </text>
    </g>
  );
}
function StarScene({
  index,
  value,
  p,
  mode,
}: {
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = starReading([1, 1, 4][index]!, value),
    r = value * 23;
  return (
    <g>
      <text x="310" y="29" textAnchor="middle">
        {w(
          mode,
          '源输出与单位面积接收分开',
          'Separate emitted and received light',
        )}
      </text>
      <Disc x={92} y={181} r={31} sun />
      <text x="92" y="251" textAnchor="middle">
        L={m.luminosity}
      </text>
      <Arrow x1={135} y1={181} x2={268} y2={181} color={gold} />
      <circle cx={135 + 133 * p} cy="181" r="5" fill={gold} />
      <circle cx="430" cy="181" r={r} stroke={blue} fill="#36445e" />
      <path d={`M430 181V${181 - r}`} stroke="#64748e" strokeDasharray="3 5" />
      <rect x="418" y="169" width="24" height="24" fill={gold} stroke={white} />
      <text x="430" y="303" textAnchor="middle">
        {w(mode, '传播球面正投影', 'Wavefront projection')}
      </text>
      <path d="M330 325H555" stroke="#46546b" strokeWidth="12" />
      <path
        d={`M330 325h${(225 * m.brightness) / 4}`}
        stroke={gold}
        strokeWidth="12"
      />
      <text x="330" y="351" style={{ fontSize: 18 }}>
        0
      </text>
      <text x="555" y="351" textAnchor="end" style={{ fontSize: 18 }}>
        4
      </text>
      <text x="310" y="371" textAnchor="middle">
        {w(
          mode,
          '同一接收面积 · 面积随距离²增大',
          'Fixed detector · area grows as distance²',
        )}
      </text>
    </g>
  );
}
function Galaxy({ x, y, r = 95 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#36425b" />
      {Array.from({ length: 65 }, (_, i) => {
        const a = i * 0.43,
          d = r * (0.1 + (0.85 * i) / 65);
        return (
          <circle
            key={i}
            cx={x + d * Math.cos(a)}
            cy={y + 0.6 * d * Math.sin(a)}
            r={i % 7 === 0 ? 2.2 : 1.2}
            fill={i % 5 === 0 ? gold : white}
          />
        );
      })}
      <circle cx={x} cy={y} r="6" fill={gold} />
    </g>
  );
}
function GalaxyScene({
  index,
  p,
  mode,
}: {
  index: number;
  p: number;
  mode: LanguageMode;
}) {
  return (
    <g>
      <text x="310" y="29" textAnchor="middle">
        {w(
          mode,
          '地址层级 · 数量和大小均示意',
          'Address levels · unscaled symbols',
        )}
      </text>
      {index === 0 ? (
        <g>
          <Disc x={310} y={179} r={26} sun />
          {Array.from({ length: 8 }, (_, i) => {
            const rx = 50 + i * 20,
              a = 0.7 + i * 0.6;
            return (
              <g key={i}>
                <ellipse
                  cx="310"
                  cy="179"
                  rx={rx}
                  ry={rx * 0.55}
                  fill="none"
                  stroke="#68718d"
                />
                <circle
                  cx={310 + rx * Math.cos(a)}
                  cy={179 + rx * 0.55 * Math.sin(a)}
                  r={i === 2 ? 6 : 3}
                  fill={i === 2 ? blue : white}
                />
              </g>
            );
          })}
          <text x="310" y="322" textAnchor="middle">
            {w(mode, '一颗太阳，多个绕行天体', 'One Sun, many orbiting bodies')}
          </text>
        </g>
      ) : index === 1 ? (
        <g>
          <Galaxy x={310} y={179} r={180} />
          <circle cx="420" cy="190" r="7" fill={blue} stroke={white} />
          <path d="M420 200V257H490" stroke={blue} fill="none" />
          <text x="490" y="280" textAnchor="middle">
            {w(mode, '太阳系(非中心)', 'Solar system')}
          </text>
          <text x="310" y="336" textAnchor="middle">
            {w(
              mode,
              '包含大量恒星系统、气体、尘埃',
              'Many stellar systems, gas and dust',
            )}
          </text>
        </g>
      ) : (
        <g>
          {[130, 310, 490].map((x, i) => (
            <Galaxy key={i} x={x} y={160 + (i % 2) * 50} r={65} />
          ))}
          <text x="310" y="327" textAnchor="middle">
            {w(
              mode,
              '每个星系里又有大量恒星',
              'Each galaxy contains many stars',
            )}
          </text>
        </g>
      )}
      <circle cx={100 + 420 * p} cy="354" r="5" fill={gold} />
      <text x="310" y="381" textAnchor="middle" style={{ fontSize: 20 }}>
        {w(mode, '边框不是宇宙边界', 'The frame is not a cosmic boundary')}
      </text>
    </g>
  );
}
const distanceCases = [
  { d: 1, u: 'AU' },
  { d: 4.25, u: 'ly' },
  { d: 100000, u: 'ly' },
] as const;
function DistanceScene({
  index,
  value,
  p,
  mode,
}: {
  index: number;
  value: number;
  p: number;
  mode: LanguageMode;
}) {
  const m = lightTravel(value, distanceCases[index]!.u, p),
    time = index === 0 ? `${fmt(m.seconds / 60)} min` : `${fmt(m.years)} yr`;
  return (
    <g>
      <text x="310" y="29" textAnchor="middle">
        {w(
          mode,
          '每例重设尺度 · 新发出的一束信号',
          'Each path rescales · one new signal',
        )}
      </text>
      <Disc x={65} y={170} r={23} sun />
      <path
        d="M99 170H521"
        stroke={blue}
        strokeWidth="2"
        strokeDasharray="4 5"
      />
      <circle cx={99 + 422 * p} cy="170" r="6" fill={gold} />
      <path d="M525 148L551 170L525 192Z" fill={blue} stroke={white} />
      <path d="M540 192V235m-18 0h36" stroke={white} />
      <text x="65" y="280" textAnchor="middle">
        {w(mode, '发出', 'Emit')}
      </text>
      <text x="535" y="280" textAnchor="middle">
        {w(mode, '接收者', 'Receiver')}
      </text>
      <text x="99" y="327">
        0
      </text>
      <text x="545" y="327" textAnchor="end">
        {time}
      </text>
      <text x="310" y="374" textAnchor="middle">
        {m.arrived
          ? w(
              mode,
              '信号到达：收到过去的信息',
              'Arrived: past information received',
            )
          : w(mode, '这束新信号尚未到达', 'This new signal has not arrived')}
      </text>
    </g>
  );
}
function defaultValue(kind: SpaceKind, index: number) {
  switch (kind) {
    case 'day':
      return [12, 0, 6][index]!;
    case 'seasons':
      return [0, 90, 270][index]!;
    case 'moon':
      return [0, 90, 180][index]!;
    case 'stars':
      return [1, 2, 2][index]!;
    case 'system':
      return 10;
    case 'orbit':
      return 2;
    case 'distance':
      return distanceCases[index]!.d;
    default:
      return 0;
  }
}
function row(kind: SpaceKind, i: number): string[] {
  const v = defaultValue(kind, i);
  switch (kind) {
    case 'day':
      return [`${v} h`, daylight(v).state];
    case 'seasons':
      return [
        `${v}°`,
        `${fmt(seasonReading(v, 45).daylightHours)} h`,
        `${fmt(seasonReading(v, -45).daylightHours)} h`,
      ];
    case 'moon':
      return [
        `${v}°`,
        `${fmt(moonReading(v).illuminated * 100)}%`,
        `${fmt(moonReading(v).day)} d`,
      ];
    case 'system': {
      const m = solarRuler([2, 4, 7][i]!);
      return [`${m.au} AU`, `${fmt(m.modelMetres)} m`];
    }
    case 'orbit': {
      const m = orbitReading(i, 1);
      return [`${fmt(m.r)}`, `${fmt(m.gravity)}`, `${fmt(m.elapsed)} τ`];
    }
    case 'stars': {
      const m = starReading([1, 1, 4][i]!, v);
      return [`${m.luminosity}`, `${m.distance}`, `${fmt(m.brightness)}`];
    }
    case 'galaxies':
      return [cosmicLevel(i).memberEn];
    case 'distance': {
      const m = lightTravel(v, distanceCases[i]!.u);
      return [
        `${v} ${m.unit}`,
        i === 0 ? `${fmt(m.seconds / 60)} min` : `${fmt(m.years)} yr`,
      ];
    }
  }
}
const headers: Record<SpaceKind, Pair[]> = {
  day: [
    ['当地太阳时', 'Local solar hour'],
    ['状态(模型)', 'State (model)'],
  ],
  seasons: [
    ['轨道位置角', 'Orbit position angle'],
    ['45°N白昼', '45°N daylight'],
    ['45°S白昼', '45°S daylight'],
  ],
  moon: [
    ['位置角', 'Position angle'],
    ['可见亮面', 'Visible illumination'],
    ['周期天数', 'Cycle day'],
  ],
  system: [
    ['轨道尺度', 'Orbit scale'],
    ['纸带距离', 'Paper-strip distance'],
  ],
  orbit: [
    ['末距中心', 'Final radius'],
    ['引力加速度', 'Attraction acceleration'],
    ['计算到的时间', 'Calculated time'],
  ],
  stars: [
    ['输出', 'Output'],
    ['距离', 'Distance'],
    ['接收指标', 'Received indicator'],
  ],
  galaxies: [['成员示意', 'Member schematic']],
  distance: [
    ['单程距离', 'One-way distance'],
    ['真空光程', 'Vacuum light time'],
  ],
};
export function SpaceLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: SpaceKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [latitude, setLatitude] = useState(45),
    [tilted, setTilted] = useState(true),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const value = custom ?? defaultValue(kind, index),
    canonical =
      Math.abs(value - defaultValue(kind, index)) < 1e-9 &&
      latitude === 45 &&
      tilted;
  const gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (canonical) {
      gate.record(String(index));
      setRecords((r) => [...new Set([...r, index])]);
    }
  });
  const p = probe || animation.time / 2.4;
  const reset = () => {
    animation.reset();
    setProbe(0);
  };
  const choose = (i: number) => {
    reset();
    setIndex(i);
    setCustom(null);
    setLatitude(45);
    setTilted(true);
  };
  let scene: ReactNode, metrics: { title: Pair; value: ReactNode }[];
  let slider: {
    title: Pair;
    min: number;
    max: number;
    step: number;
    unit: string;
    disabled?: boolean;
  } | null = null;
  const metric = (title: Pair, value: ReactNode) => ({ title, value });
  switch (kind) {
    case 'day': {
      const h = (value + 24 * p) % 24,
        m = daylight(h);
      scene = <DayScene value={value} p={p} mode={mode} />;
      slider = {
        title: ['自由当地太阳时', 'Free local solar hour'],
        min: 0,
        max: 24,
        step: 1,
        unit: 'h',
      };
      metrics = [
        metric(['模型时刻', 'Model hour'], `${fmt(h)} h`),
        metric(
          ['地点状态', 'Place state'],
          m.state === 'day'
            ? w(mode, '白昼', 'Daylight')
            : m.state === 'night'
              ? w(mode, '黑夜', 'Night')
              : w(
                  mode,
                  h < 12 ? '日出边界' : '日落边界',
                  h < 12 ? 'Sunrise boundary' : 'Sunset boundary',
                ),
        ),
        metric(['本次巡查时长', 'Inspected interval'], `${fmt(24 * p)} h`),
      ];
      break;
    }
    case 'seasons': {
      const m = seasonReading(value, latitude, tilted ? 23.5 : 0),
        o = seasonReading(value, -latitude, tilted ? 23.5 : 0);
      scene = (
        <SeasonScene
          value={value}
          latitude={latitude}
          tilt={tilted ? 23.5 : 0}
          p={p}
          mode={mode}
        />
      );
      slider = {
        title: ['自由轨道位置角', 'Free orbit position angle'],
        min: 0,
        max: 360,
        step: 15,
        unit: '°',
      };
      metrics = [
        metric(
          [`${latitude}°白昼`, `${latitude}° daylight`],
          `${fmt(m.daylightHours)} h`,
        ),
        metric(
          [`${-latitude}°白昼`, `${-latitude}° daylight`],
          `${fmt(o.daylightHours)} h`,
        ),
        metric(
          ['所选纬度正午太阳高度', 'Selected latitude noon Sun altitude'],
          `${fmt(m.noonAltitude)}°`,
        ),
      ];
      break;
    }
    case 'moon': {
      const m = moonReading(value);
      scene = <MoonScene value={value} p={p} mode={mode} />;
      slider = {
        title: ['自由月相位置角', 'Free phase position angle'],
        min: 0,
        max: 360,
        step: 15,
        unit: '°',
      };
      metrics = [
        metric(['位置角', 'Position angle'], `${value}°`),
        metric(
          ['可见亮面', 'Visible illuminated disc'],
          `${fmt(m.illuminated * 100)}%`,
        ),
        metric(
          ['平均周期中的天数', 'Day in the mean cycle'],
          `${fmt(m.day)} d`,
        ),
      ];
      break;
    }
    case 'system': {
      const m = solarRuler([2, 4, 7][index]!, value);
      scene = <SystemScene index={index} p={p} mode={mode} />;
      slider = {
        title: ['自由模型尺度', 'Free model scale'],
        min: 5,
        max: 20,
        step: 5,
        unit: 'cm/AU',
      };
      metrics = [
        metric(['近似轨道尺度', 'Approximate orbit scale'], `${m.au} AU`),
        metric(
          ['纸带模型距离', 'Paper-strip distance'],
          `${fmt(m.modelMetres)} m`,
        ),
        metric(['地日距离模型长度', 'Model length per AU'], `${value} cm`),
      ];
      break;
    }
    case 'orbit': {
      const m = orbitReading(index, p, value);
      scene = <OrbitScene index={index} value={value} p={p} mode={mode} />;
      slider = {
        title: ['自由初始中心距', 'Free initial centre radius'],
        min: 1.5,
        max: 2.5,
        step: 0.25,
        unit: 'r₀',
      };
      metrics = [
        metric(['距中心(模型)', 'Centre radius (model)'], fmt(m.r)),
        metric(['速度大小(模型)', 'Speed (model)'], fmt(m.speed)),
        metric(
          ['引力加速度(模型)', 'Attraction acceleration (model)'],
          fmt(m.gravity),
        ),
      ];
      break;
    }
    case 'stars': {
      const m = starReading([1, 1, 4][index]!, value);
      scene = <StarScene index={index} value={value} p={p} mode={mode} />;
      slider = {
        title: ['自由相对距离', 'Free relative distance'],
        min: 1,
        max: 4,
        step: 0.25,
        unit: 'r₀',
      };
      metrics = [
        metric(['源输出(相对)', 'Source output (relative)'], m.luminosity),
        metric(['传播球面面积比例', 'Wavefront area ratio'], m.areaRatio),
        metric(
          ['固定面积接收指标', 'Fixed-area reception indicator'],
          fmt(m.brightness),
        ),
      ];
      break;
    }
    case 'galaxies': {
      const m = cosmicLevel(index);
      scene = <GalaxyScene index={index} p={p} mode={mode} />;
      metrics = [
        metric(['所在层级', 'Address level'], w(mode, m.zh, m.en)),
        metric(['成员', 'Members'], w(mode, m.memberZh, m.memberEn)),
        metric(
          ['我们的地址关系', 'Our address relation'],
          w(mode, m.addressZh, m.addressEn),
        ),
      ];
      break;
    }
    case 'distance': {
      const m = lightTravel(value, distanceCases[index]!.u, p);
      scene = <DistanceScene index={index} value={value} p={p} mode={mode} />;
      if (index === 1)
        slider = {
          title: ['自由近星距离', 'Free nearby-star distance'],
          min: 0.25,
          max: 10,
          step: 0.25,
          unit: 'ly',
        };
      metrics = [
        metric(['单程距离', 'One-way distance'], `${value} ${m.unit}`),
        metric(
          ['完整真空光程', 'Full vacuum light time'],
          index === 0 ? `${fmt(m.seconds / 60)} min` : `${fmt(m.years)} yr`,
        ),
        metric(
          ['新信号状态', 'New signal state'],
          m.arrived
            ? w(mode, '已到达', 'Arrived')
            : w(mode, '途中', 'In transit'),
        ),
      ];
      break;
    }
  }
  return (
    <div
      className={`phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-space-lab phy-space-${kind}`}
    >
      <div className="phy-lab-toolbar">
        <span>EARTH & SPACE / CHANGE YOUR VIEW</span>
        <B mode={mode} zh={titles[kind][0]} en={titles[kind][1]} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        set={choose}
        disabled={animation.running}
      />
      {slider && (
        <label className="phy-energy-probe">
          <B mode={mode} zh={slider.title[0]} en={slider.title[1]} /> ·{' '}
          {fmt(value)} {slider.unit}
          <input
            type="range"
            aria-label={mode === 'en' ? slider.title[1] : slider.title[0]}
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
      {kind === 'seasons' && (
        <div className="phy-lab-controls">
          <label>
            <B mode={mode} zh="自由对照纬度" en="Free comparison latitude" /> ·{' '}
            {latitude}°
            <input
              type="range"
              aria-label={
                mode === 'en' ? 'Free comparison latitude' : '自由对照纬度'
              }
              min="-60"
              max="60"
              step="15"
              value={latitude}
              disabled={animation.running}
              onChange={(e) => {
                reset();
                setLatitude(Number(e.target.value));
              }}
            />
          </label>
          <button
            className="phy-button secondary"
            disabled={animation.running}
            aria-pressed={!tilted}
            onClick={() => {
              reset();
              setTilted(!tilted);
            }}
          >
            <B
              mode={mode}
              zh={tilted ? '取消倾斜' : '恢复23.5°倾斜'}
              en={tilted ? 'Remove tilt' : 'Restore 23.5° tilt'}
            />
          </button>
        </div>
      )}
      <svg
        viewBox="0 0 620 390"
        role="img"
        aria-label={mode === 'en' ? titles[kind][1] : titles[kind][0]}
      >
        <rect width="620" height="390" rx="18" fill={dark} />
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
        {Math.round(p * 100)}%
        <input
          type="range"
          aria-label={mode === 'en' ? 'Inspection progress' : '检查进度'}
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
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
                <th>
                  <B mode={mode} zh="条件" en="Condition" />
                </th>
                {headers[kind].map((h) => (
                  <th key={h[1]}>
                    <B mode={mode} zh={h[0]} en={h[1]} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...records]
                .sort((a, b) => a - b)
                .map((i) => (
                  <tr key={i}>
                    <td>
                      <B
                        mode={mode}
                        zh={options[kind][i]![0]}
                        en={options[kind][i]![1]}
                      />
                    </td>
                    {kind === 'galaxies' ? (
                      <td>
                        <B
                          mode={mode}
                          zh={cosmicLevel(i).memberZh}
                          en={cosmicLevel(i).memberEn}
                        />
                      </td>
                    ) : (
                      row(kind, i).map((v, j) => (
                        <td key={j}>
                          {kind === 'day' ? (
                            j === 1 ? (
                              <B
                                mode={mode}
                                zh={
                                  i === 0
                                    ? '白昼'
                                    : i === 1
                                      ? '黑夜'
                                      : '日出边界'
                                }
                                en={
                                  i === 0
                                    ? 'Daylight'
                                    : i === 1
                                      ? 'Night'
                                      : 'Sunrise boundary'
                                }
                              />
                            ) : (
                              v
                            )
                          ) : (
                            v
                          )}
                        </td>
                      ))
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
