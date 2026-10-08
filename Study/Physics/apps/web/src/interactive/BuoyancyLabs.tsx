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
  submergedRelease,
  releaseCases,
  pressureUpthrust,
  pressureBuoyancyCases,
  immersionReading,
  immersionCases,
  hangingBuoyancy,
  archimedesCases,
  sealedShip,
  shipCases,
  submarineBallast,
  submarineCases,
  hotAirBalloon,
  balloonCases,
  near,
} from './buoyancyModels';
type Kind =
  | 'release'
  | 'pressure'
  | 'displacement'
  | 'archimedes'
  | 'ship'
  | 'submarine'
  | 'balloon';
type Pair = [string, string];
const blue = '#80afc2',
  gold = '#bc9259',
  ink = '#a48ab5';
const fmt = (n: number) => String(Number(n.toFixed(2)));
const words = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const labels: Record<Kind, Pair> = {
  release: ['有浮力，不一定浮着', 'Buoyancy does not guarantee floating'],
  pressure: ['上下压力作用之差', 'Difference of pressure forces'],
  displacement: ['慢慢放入，读排水体积', 'Lower slowly and read displacement'],
  archimedes: ['排水与提力账本', 'Displacement and holding-force ledger'],
  ship: ['密封船体与载荷', 'Sealed hull and cargo'],
  submarine: ['外形不变，改变压载', 'Same exterior, different ballast'],
  balloon: ['空气与载荷的两本账', 'Air and payload ledgers'],
};
const notes: Record<Kind, Pair> = {
  release: [
    '初始都完全浸水、静止释放，体积200 cm³，淡水1000 kg/m³、g≈10 N/kg。不计算运动轨迹或碰底。升到水面后的浮力会随浸水体积减小；稳定漂浮时与重量相等。',
    'All start fully submerged, released from rest: 200 cm³, freshwater 1000 kg/m³ and g≈10 N/kg. No trajectory or bottom contact is computed. Buoyancy changes on reaching the surface and matches weight at steady floating.',
  ],
  pressure: [
    '水面101 kPa，g≈10；刚体上下水平面各10 cm²，高差0.10 m。同深度侧面作用成对抵消。所示净压力作用是浮力，不含重量与提线力；两侧箭头共用0–108 N的力比例。',
    'Surface 101 kPa, g≈10; equal horizontal faces 10 cm², height 0.10 m. Side forces at matched depths cancel. The net pressure force is buoyancy, excluding weight and string forces. Opposing arrows share a 0–108 N scale.',
  ],
  displacement: [
    '外力缓慢放入的示意，设置的是终点浸水比例；示数随当前放入进度改变。物体100 cm³，截面25 cm²、高4 cm；容器截面50 cm²，原有150 mL。无波浪、溢出、气泡或碰底。动画时长不是实测时间。',
    'Controlled lowering: the setting is the endpoint immersion fraction; readings follow current lowering progress. Body 100 cm³, cross-section 25 cm², height 4 cm; vessel section 50 cm², initially 150 mL. No waves, spill, bubbles or bottom contact. Playback duration is not measured time.',
  ],
  archimedes: [
    '300 g物体由竖直提线保持静止，不碰底，忽略空气浮力；100/200 cm³代表两个同质量、不同外部体积的规定物体。淡水1000、较密液体1200 kg/m³，g≈10。T是拉力，F_b是浮力，W是重量。',
    'A vertical string holds a 300 g body at rest, clear of the bottom; air buoyancy is omitted. 100/200 cm³ are equal-mass bodies with different external volumes. Freshwater 1000 or denser liquid 1200 kg/m³, g≈10. T is tension, F_b buoyancy and W weight.',
  ],
  ship: [
    '刚性密封盒形模型；紧凑体与过载船显示完全浸水刚释放的力，轻船显示最终漂浮平衡。盒船截面固定，浸水高度与排水体积成比例。最大能力不等于实际浮力；不计算漏水、倾覆、波浪或真实安全载荷。',
    'Rigid sealed box model. Compact/overloaded cases show fully submerged release; light hulls show final floating balance. Constant box cross-section makes submerged height proportional to displacement. Capacity is distinct from actual buoyancy. Leaks, capsizing, waves and real safe-load ratings are not computed.',
  ],
  submarine: [
    '完全浸水的刚性2 L外形，淡水1000 kg/m³、g≈10；基础质量1.6 kg，压载舱最多800 g水。忽略排出空气的少量质量、船体压缩、推进与阻力；只比较静止释放后的初始力。',
    'Fully submerged rigid 2 L exterior, freshwater 1000 kg/m³, g≈10. Base mass 1.6 kg; tank holds at most 800 g water. Small expelled-air mass, compression, propulsion and drag are omitted. Only initial forces after release from rest are compared.',
  ],
  balloon: [
    '充满、开口且内外近似同压的规定气球，体积10 m³，外部空气1.2 kg/m³，设备载荷2.5 kg，g≈10。密度是输入，不计算温度；忽略风、绳索与设备的小体积排气作用，不预测飞行高度。',
    'Prescribed fully inflated vented balloon, near matched inside/outside pressure: 10 m³, outside air 1.2 kg/m³, equipment/load 2.5 kg, g≈10. Density is assigned; temperature is not calculated. Wind, tethers and small equipment-displacement effects are omitted; flight altitude is not predicted.',
  ],
};
function Arrow({
  x,
  y,
  dy,
  colour = blue,
}: {
  x: number;
  y: number;
  dy: number;
  colour?: string;
}) {
  if (Math.abs(dy) < 1e-8) return null;
  const end = y + dy,
    d = dy > 0 ? -1 : 1;
  return (
    <g stroke={colour} strokeWidth="3" fill="none">
      <path d={`M${x} ${y}V${end}`} />
      <path d={`M${x - 6} ${end + d * 8}L${x} ${end}l6 ${d * 8}`} />
    </g>
  );
}
function ForcePair({
  up,
  down,
  max,
}: {
  up: number;
  down: number;
  max: number;
}) {
  return (
    <g>
      <Arrow x={410} y={225} dy={(-up / max) * 150} />
      <Arrow x={535} y={75} dy={(down / max) * 150} colour={gold} />
      <text x="410" y="270" textAnchor="middle">
        ↑ {fmt(up)} N
      </text>
      <text x="535" y="270" textAnchor="middle">
        ↓ {fmt(down)} N
      </text>
    </g>
  );
}
function Tank({
  children,
  surface = 90,
}: {
  children: ReactNode;
  surface?: number;
}) {
  return (
    <g>
      <path d="M45 50v210h285V50" stroke={ink} strokeWidth="3" fill="none" />
      <rect
        x="47"
        y={surface}
        width="281"
        height={258 - surface}
        fill="#e1edf5"
      />
      {children}
      <path d={`M47 ${surface}h281`} stroke={blue} strokeWidth="2" />
    </g>
  );
}
function Net({ value, mode }: { value: number; mode: LanguageMode }) {
  return (
    <B
      mode={mode}
      zh={
        Math.abs(value) < 1e-8
          ? '0 N · 平衡'
          : `${fmt(Math.abs(value))} N · ${value > 0 ? '向上' : '向下'}`
      }
      en={
        Math.abs(value) < 1e-8
          ? '0 N · Balanced'
          : `${fmt(Math.abs(value))} N · ${value > 0 ? 'Upward' : 'Downward'}`
      }
    />
  );
}
function BuoyancyLab({ kind, mode, onExplore }: LabProps & { kind: Kind }) {
  const [mass, setMass] = useState(0.12),
    [depth, setDepth] = useState(0.1),
    [density, setDensity] = useState(1000),
    [fraction, setFraction] = useState(0),
    [volume, setVolume] = useState(100),
    [box, setBox] = useState(false),
    [cargo, setCargo] = useState(0),
    [ballast, setBallast] = useState(0),
    [airDensity, setAirDensity] = useState(1.2),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const preset =
    kind === 'release'
      ? releaseCases.findIndex((v) => near(v, mass))
      : kind === 'pressure'
        ? pressureBuoyancyCases.findIndex(
            (c) => near(c.topDepth, depth) && c.density === density,
          )
        : kind === 'displacement'
          ? immersionCases.findIndex((v) => near(v, fraction))
          : kind === 'archimedes'
            ? archimedesCases.findIndex(
                (c) => c.volume === volume && c.density === density,
              )
            : kind === 'ship'
              ? shipCases.findIndex(
                  (c) => c.box === box && near(c.cargo, cargo),
                )
              : kind === 'submarine'
                ? submarineCases.findIndex((v) => near(v, ballast))
                : balloonCases.findIndex((v) => near(v, airDensity));
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
    if (kind === 'release') setMass(releaseCases[i]!);
    if (kind === 'pressure') {
      setDepth(pressureBuoyancyCases[i]!.topDepth);
      setDensity(pressureBuoyancyCases[i]!.density);
    }
    if (kind === 'displacement') setFraction(immersionCases[i]!);
    if (kind === 'archimedes') {
      setVolume(archimedesCases[i]!.volume);
      setDensity(archimedesCases[i]!.density);
    }
    if (kind === 'ship') {
      setBox(shipCases[i]!.box);
      setCargo(shipCases[i]!.cargo);
    }
    if (kind === 'submarine') setBallast(submarineCases[i]!);
    if (kind === 'balloon') setAirDensity(balloonCases[i]!);
  };
  let options: Pair[],
    scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[];
  if (kind === 'release') {
    const m = submergedRelease(mass, 200);
    options = releaseCases.map((v) => [`${v * 1000} g`, `${v * 1000} g`]);
    scene = (
      <>
        <Tank>
          <rect
            x="115"
            y="140"
            width="140"
            height="80"
            fill="#d9c2a1"
            stroke={gold}
            strokeWidth="2"
          />
          <text x="185" y="188" textAnchor="middle">
            {fmt(mass * 1000)} g
          </text>
        </Tank>
        <text x="70" y="35">
          200 cm³
        </text>
        <ForcePair up={m.buoyancy} down={m.weight} max={3.5} />
      </>
    );
    metrics = [
      {
        title: ['初始浮力向上', 'Initial buoyancy upward'],
        value: `${fmt(m.buoyancy)} N`,
      },
      { title: ['重量向下', 'Weight downward'], value: `${fmt(m.weight)} N` },
      {
        title: ['初始合力', 'Initial net force'],
        value: <Net value={m.netUp} mode={mode} />,
      },
    ];
    columns = [
      ['质量', 'Mass'],
      ['浮力 / 重量', 'Buoyancy / weight'],
      ['初始合力', 'Initial net force'],
    ];
    row = (i) => {
      const m = submergedRelease(releaseCases[i]!, 200);
      return [
        `${fmt(m.massKg * 1000)} g`,
        `${fmt(m.buoyancy)} / ${fmt(m.weight)} N`,
        <Net key={i} value={m.netUp} mode={mode} />,
      ];
    };
  } else if (kind === 'pressure') {
    const m = pressureUpthrust(depth, density),
      top = 60 + depth * 400;
    options = [
      ['水 · 上深0.10 m', 'Water · Top 0.10 m'],
      ['水 · 上深0.30 m', 'Water · Top 0.30 m'],
      ['较密液体 · 上深0.10 m', 'Denser · Top 0.10 m'],
    ];
    scene = (
      <>
        <Tank surface={60}>
          <rect
            x="145"
            y={top}
            width="125"
            height="40"
            fill="#e6dced"
            stroke={ink}
            strokeWidth="2"
          />
          <text x="207" y={top - 12} textAnchor="middle" fontSize="23">
            {fmt(m.top.absoluteKPa)} kPa
          </text>
          <text x="207" y={top + 68} textAnchor="middle" fontSize="23">
            {fmt(m.bottom.absoluteKPa)} kPa
          </text>
          <path d={`M95 60V${top}`} stroke={gold} strokeWidth="2" />
        </Tank>
        <text x="60" y="35">
          h = {fmt(depth)} m
        </text>
        <ForcePair up={m.up} down={m.down} max={108} />
      </>
    );
    metrics = [
      {
        title: ['上表面向下压力作用', 'Top downward pressure force'],
        value: `${fmt(m.down)} N`,
      },
      {
        title: ['下表面向上压力作用', 'Bottom upward pressure force'],
        value: `${fmt(m.up)} N`,
      },
      {
        title: ['压力差产生的浮力', 'Buoyancy from force difference'],
        value: `${fmt(m.net)} N ↑`,
      },
    ];
    columns = [
      ['上深 / 密度', 'Top depth / density'],
      ['上下力差', 'Force difference'],
      ['排水体积', 'Displacement'],
    ];
    row = (i) => {
      const c = pressureBuoyancyCases[i]!,
        m = pressureUpthrust(c.topDepth, c.density);
      return [
        `${fmt(c.topDepth)} m · ${c.density} kg/m³`,
        `${fmt(m.net)} N ↑`,
        `${fmt(m.volumeMl)} mL`,
      ];
    };
  } else if (kind === 'displacement') {
    const m = immersionReading(fraction * progress),
      surface = 260 - (m.after / 50) * 20,
      bodyBottom = surface + m.fraction * 80,
      bodyTop = bodyBottom - 80;
    options = immersionCases.map((v) => [
      `${v * 100}% 浸水终点`,
      `${v * 100}% immersion endpoint`,
    ]);
    scene = (
      <>
        <Tank surface={surface}>
          <path d={`M188 40V${bodyTop}`} stroke={ink} strokeWidth="2" />
          <rect
            x="120"
            y={bodyTop}
            width="135"
            height="80"
            fill="#d9c2a1"
            stroke={gold}
            strokeWidth="2"
          />
          {[150, 200, 250].map((v) => (
            <g key={v}>
              <path
                d={`M280 ${260 - (v / 50) * 20}h30l45 ${230 - (v - 150) * 0.9 - 8 - (260 - (v / 50) * 20)}h20`}
                stroke={ink}
                fill="none"
              />
              <text x="390" y={230 - (v - 150) * 0.9} fontSize="24">
                {v} mL
              </text>
            </g>
          ))}
        </Tank>
        <text x="55" y="35">
          100 cm³
        </text>
        <text x="375" y="75">
          +{fmt(m.submergedMl)} mL
        </text>
      </>
    );
    metrics = [
      { title: ['原读数', 'Before reading'], value: '150 mL' },
      { title: ['当前读数', 'Current reading'], value: `${fmt(m.after)} mL` },
      {
        title: ['当前排水体积', 'Current displacement'],
        value: `${fmt(m.submergedMl)} mL`,
      },
    ];
    columns = [
      ['浸水比例', 'Immersion'],
      ['终点读数', 'Endpoint reading'],
      ['排水', 'Displacement'],
    ];
    row = (i) => {
      const m = immersionReading(immersionCases[i]!);
      return [`${m.fraction * 100}%`, `${m.after} mL`, `${m.submergedMl} mL`];
    };
  } else if (kind === 'archimedes') {
    const m = hangingBuoyancy(volume, density);
    options = [
      ['100 mL · 水', '100 mL · Water'],
      ['200 mL · 水', '200 mL · Water'],
      ['100 mL · 较密液体', '100 mL · Denser liquid'],
    ];
    scene = (
      <>
        <Tank>
          <rect
            x="130"
            y="125"
            width="125"
            height={volume * 0.5}
            fill="#d9c2a1"
            stroke={gold}
            strokeWidth="2"
          />
          <path d="M192 62v63" stroke={ink} strokeWidth="2" />
        </Tank>
        <rect
          x="165"
          y="8"
          width="55"
          height="54"
          rx="5"
          stroke={ink}
          fill="#eee6f3"
        />
        <text x="193" y="44" fontSize="22" textAnchor="middle">
          {fmt(m.tension)} N
        </text>
        <text x="50" y="292" fontSize="23">
          {volume} mL → {fmt(m.massKg * 1000)} g
        </text>
        {[
          { x: 370, v: m.tension, name: 'T', colour: ink },
          { x: 460, v: m.buoyancy, name: 'F_b', colour: blue },
        ].map((a) => (
          <g key={a.name}>
            <Arrow x={a.x} y={215} dy={-a.v * 40} colour={a.colour} />
            <text x={a.x} y="35" textAnchor="middle" fontSize="23">
              {a.name}
            </text>
            <text x={a.x} y="260" fontSize="23" textAnchor="middle">
              ↑{fmt(a.v)} N
            </text>
          </g>
        ))}
        <Arrow x={550} y={95} dy={120} colour={gold} />
        <text x="550" y="35" textAnchor="middle" fontSize="23">
          W
        </text>
        <text x="550" y="260" textAnchor="middle" fontSize="23">
          ↓3 N
        </text>
      </>
    );
    metrics = [
      {
        title: ['排开液体质量', 'Displaced-fluid mass'],
        value: `${fmt(m.massKg * 1000)} g`,
      },
      { title: ['浮力', 'Buoyancy'], value: `${fmt(m.buoyancy)} N` },
      {
        title: ['静止测力计示数', 'Static force-meter reading'],
        value: `${fmt(m.tension)} N`,
      },
    ];
    columns = [
      ['排水 / 密度', 'Displacement / density'],
      ['浮力', 'Buoyancy'],
      ['测力计', 'Force meter'],
    ];
    row = (i) => {
      const c = archimedesCases[i]!,
        m = hangingBuoyancy(c.volume, c.density);
      return [
        `${c.volume} mL · ${c.density} kg/m³`,
        `${fmt(m.buoyancy)} N`,
        `${fmt(m.tension)} N`,
      ];
    };
  } else if (kind === 'ship') {
    const m = sealedShip(box, cargo),
      height = box ? 100 : 24,
      subHeight = (height * m.shownVolume) / m.capacityMl,
      top = m.state === 'up' ? 90 - (height - subHeight) : 130;
    options = [
      ['300 g紧凑体', '300 g compact'],
      ['300 g密封船', '300 g sealed hull'],
      ['650 g载货船', '650 g loaded hull'],
    ];
    scene = (
      <>
        <Tank>
          <rect
            x="120"
            y={top}
            width="135"
            height={height}
            fill="#e4d8ee"
            stroke={ink}
            strokeWidth="3"
          />
          {box && (
            <rect
              x="154"
              y={top + 4}
              width="67"
              height="20"
              fill={cargo > 0 ? '#cda96c' : '#f5f0f8'}
              stroke={gold}
            />
          )}
          <text x="187" y={top + height + 28} textAnchor="middle" fontSize="23">
            {fmt(m.shownVolume)} mL
          </text>
        </Tank>
        <text x="55" y="35">
          {fmt(m.massKg * 1000)} g · {m.capacityMl} mL max
        </text>
        <ForcePair up={m.shownBuoyancy} down={m.weight} max={8} />
      </>
    );
    metrics = [
      {
        title: ['系统总重量', 'Total system weight'],
        value: `${fmt(m.weight)} N`,
      },
      {
        title: ['当前实际浮力', 'Actual buoyancy shown'],
        value: `${fmt(m.shownBuoyancy)} N`,
      },
      {
        title: ['完全浸水最大浮力', 'Maximum fully submerged buoyancy'],
        value: `${fmt(m.maximumBuoyancy)} N`,
      },
    ];
    columns = [
      ['总质量', 'Total mass'],
      ['当前排水', 'Displacement shown'],
      ['实际浮力', 'Actual buoyancy'],
    ];
    row = (i) => {
      const c = shipCases[i]!,
        m = sealedShip(c.box, c.cargo);
      return [
        `${fmt(m.massKg * 1000)} g`,
        `${fmt(m.shownVolume)} mL`,
        `${fmt(m.shownBuoyancy)} N`,
      ];
    };
  } else if (kind === 'submarine') {
    const m = submarineBallast(ballast);
    options = submarineCases.map((v) => [
      `${fmt(v * 1000)} g压载水`,
      `${fmt(v * 1000)} g ballast`,
    ]);
    scene = (
      <>
        <Tank>
          <rect
            x="77"
            y="125"
            width="227"
            height="105"
            rx="48"
            fill="#e4d8ee"
            stroke={ink}
            strokeWidth="3"
          />
          <path d="M175 126v-23h32v23" fill="#eee6f3" stroke={ink} />
          <rect
            x="137"
            y="160"
            width="110"
            height="52"
            rx="4"
            stroke={blue}
            fill="#f5f0f8"
          />
          <rect
            x="140"
            y={210 - (48 * ballast) / 0.8}
            width="104"
            height={(48 * ballast) / 0.8}
            fill={blue}
          />
          <text x="190" y="278" textAnchor="middle" fontSize="23">
            {fmt(m.ballastMl)} mL
          </text>
        </Tank>
        <text x="55" y="35">
          2 L · {fmt(m.massKg)} kg
        </text>
        <ForcePair up={m.buoyancy} down={m.weight} max={24} />
      </>
    );
    metrics = [
      {
        title: ['完全浸水浮力', 'Fully submerged buoyancy'],
        value: `${fmt(m.buoyancy)} N`,
      },
      { title: ['总重量', 'Total weight'], value: `${fmt(m.weight)} N` },
      {
        title: ['初始合力', 'Initial net force'],
        value: <Net mode={mode} value={m.netUp} />,
      },
    ];
    columns = [
      ['压载水', 'Ballast water'],
      ['总重量', 'Total weight'],
      ['初始合力', 'Initial net force'],
    ];
    row = (i) => {
      const m = submarineBallast(submarineCases[i]!);
      return [
        `${fmt(m.ballastKg * 1000)} g`,
        `${fmt(m.weight)} N`,
        <Net key={i} mode={mode} value={m.netUp} />,
      ];
    };
  } else {
    const m = hotAirBalloon(airDensity);
    options = balloonCases.map((v) => [`${fmt(v)} kg/m³`, `${fmt(v)} kg/m³`]);
    scene = (
      <>
        <ellipse
          cx="190"
          cy="118"
          rx="78"
          ry="101"
          fill="#e5d6ee"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M190 17c-50 50-50 150 0 202m0-202c50 50 50 150 0 202M153 205l12 24m62-24-12 24"
          stroke={ink}
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="151"
          y="228"
          width="78"
          height="30"
          rx="5"
          fill="#d9c2a1"
          stroke={gold}
        />
        <text x="190" y="119" textAnchor="middle">
          {fmt(m.insideMass)} kg
        </text>
        <text x="190" y="150" textAnchor="middle" fontSize="23">
          10 m³
        </text>
        <text x="190" y="290" textAnchor="middle" fontSize="23">
          +2.5 kg
        </text>
        <ForcePair up={m.buoyancy} down={m.weight} max={145} />
      </>
    );
    metrics = [
      {
        title: ['排开外部空气的重量', 'Displaced outside-air weight'],
        value: `${fmt(m.buoyancy)} N`,
      },
      {
        title: ['整个系统重量', 'Whole system weight'],
        value: `${fmt(m.weight)} N`,
      },
      {
        title: ['初始合力', 'Initial net force'],
        value: <Net mode={mode} value={m.netUp} />,
      },
    ];
    columns = [
      ['内部密度', 'Inside density'],
      ['内部空气质量', 'Inside-air mass'],
      ['初始合力', 'Initial net force'],
    ];
    row = (i) => {
      const m = hotAirBalloon(balloonCases[i]!);
      return [
        `${fmt(m.insideDensity)} kg/m³`,
        `${fmt(m.insideMass)} kg`,
        <Net key={i} mode={mode} value={m.netUp} />,
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
    set: (n: number) => void,
    locked = false,
  ) => (
    <label className="phy-energy-probe">
      <span>
        <B zh={title[0]} en={title[1]} mode={mode} /> · {fmt(value)} {unit}
      </span>
      <input
        type="range"
        aria-label={words(mode, title)}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={animation.running || locked}
        onChange={(ev) => {
          reset();
          set(Number(ev.target.value));
        }}
      />
    </label>
  );
  const changeDensity = (
    <LabOptions
      mode={mode}
      name={['液体密度', 'Liquid density']}
      values={[
        { id: 0, zh: '1000 kg/m³', en: '1000 kg/m³' },
        { id: 1, zh: '1200 kg/m³', en: '1200 kg/m³' },
      ]}
      value={density === 1000 ? 0 : 1}
      disabled={animation.running}
      set={(i) => {
        reset();
        setDensity(i === 0 ? 1000 : 1200);
      }}
    />
  );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-buoyancy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">BUOYANCY / WHAT SUPPORTS IT?</span>
        <B zh={labels[kind][0]} en={labels[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options.map(([zh, en], id) => ({ id, zh, en }))}
        value={preset}
        set={choose}
        disabled={animation.running}
      />
      {kind === 'release' &&
        slider(['物体质量', 'Body mass'], mass * 1000, 50, 350, 10, 'g', (v) =>
          setMass(v / 1000),
        )}
      {kind === 'pressure' && (
        <>
          {slider(
            ['上表面深度', 'Top-face depth'],
            depth,
            0.05,
            0.35,
            0.05,
            'm',
            setDepth,
          )}
          {changeDensity}
        </>
      )}
      {kind === 'displacement' &&
        slider(
          ['终点浸水体积比例', 'Endpoint immersed-volume fraction'],
          fraction * 100,
          0,
          100,
          10,
          '%',
          (v) => {
            setFraction(v / 100);
            setProbe(1);
          },
        )}
      {kind === 'archimedes' && (
        <>
          {slider(
            ['完全浸水体积', 'Fully immersed volume'],
            volume,
            50,
            200,
            50,
            'mL',
            setVolume,
          )}
          {changeDensity}
        </>
      )}
      {kind === 'ship' && (
        <>
          <LabOptions
            mode={mode}
            name={['外部形状', 'Exterior shape']}
            values={[
              { id: 0, zh: '紧凑体', en: 'Compact' },
              { id: 1, zh: '密封盒船', en: 'Sealed box' },
            ]}
            value={box ? 1 : 0}
            disabled={animation.running}
            set={(i) => {
              reset();
              setBox(i === 1);
              if (i === 0) setCargo(0);
            }}
          />
          {slider(
            ['增加的货物质量', 'Added cargo mass'],
            cargo * 1000,
            0,
            500,
            50,
            'g',
            (v) => setCargo(v / 1000),
            !box,
          )}
        </>
      )}
      {kind === 'submarine' &&
        slider(
          ['压载水质量', 'Ballast-water mass'],
          ballast * 1000,
          0,
          800,
          50,
          'g',
          (v) => setBallast(v / 1000),
        )}
      {kind === 'balloon' &&
        slider(
          ['内部空气密度', 'Inside-air density'],
          airDensity,
          0.9,
          1.2,
          0.05,
          'kg/m³',
          setAirDensity,
        )}
      <svg
        viewBox="0 0 620 320"
        role="img"
        aria-label={words(mode, labels[kind])}
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
      {kind === 'release' && submergedRelease(mass, 200).state === 'up' && (
        <p className="phy-lab-result">
          <B
            mode={mode}
            zh={`水面漂浮平衡推演：排水${fmt(submergedRelease(mass, 200).equilibriumMl!)} mL，浮力${fmt(mass * 10)} N；初始2 N会改变。`}
            en={`Surface floating-balance prediction: ${fmt(submergedRelease(mass, 200).equilibriumMl!)} mL displacement, ${fmt(mass * 10)} N buoyancy; the initial 2 N changes.`}
          />
        </p>
      )}
      <p className="phy-model-note">
        <B zh={notes[kind][0]} en={notes[kind][1]} mode={mode} />
      </p>
      {kind !== 'displacement' && (
        <>
          <div className="phy-pressure-inspection" aria-hidden="true">
            <span style={{ left: `${4 + 92 * progress}%` }} />
            <i />
            <i />
            <i />
          </div>
          <p className="phy-model-note">
            <B
              zh="绿点只按条件→力的比较→结果检查，不代表物体轨迹或物理计时。"
              en="The green marker checks conditions → forces → result. It is not an object trajectory or a physical clock."
              mode={mode}
            />
          </p>
        </>
      )}
      {slider(
        kind === 'displacement'
          ? ['受控放入进度', 'Controlled lowering progress']
          : ['检查进度', 'Inspection progress'],
        Math.round(progress * 100),
        0,
        100,
        1,
        '%',
        (v) => setProbe(v / 100),
      )}
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
              : kind === 'displacement'
                ? '完整放入并读数'
                : '完整检查这组条件'
          }
          en={
            animation.running
              ? 'Running…'
              : kind === 'displacement'
                ? 'Lower completely and read'
                : 'Inspect this complete case'
          }
        />
      </button>
      <p className="phy-force-record" role="status">
        <B
          mode={mode}
          zh={`已比较 ${gate.count}/3：完成三组规定过程。拖动进度和其他自由设置不替代规定比较。`}
          en={`Compared ${gate.count}/3: complete all three prescribed runs. Seeking and other custom settings do not replace the required comparisons.`}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                mode={mode}
                zh="保留比较 · 规定模型结果"
                en="Retained comparisons · Prescribed model results"
              />
            </caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c[1]} scope="col">
                    <B zh={c[0]} en={c[1]} mode={mode} />
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
export const BuoyancyReleaseLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="release" />
);
export const BuoyancyPressureLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="pressure" />
);
export const BuoyancyDisplacementLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="displacement" />
);
export const BuoyancyArchimedesLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="archimedes" />
);
export const BuoyancyShipLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="ship" />
);
export const BuoyancySubmarineLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="submarine" />
);
export const BuoyancyBalloonLab = (p: LabProps) => (
  <BuoyancyLab {...p} kind="balloon" />
);
