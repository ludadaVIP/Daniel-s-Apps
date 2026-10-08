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
  contactPressure,
  contactCases,
  contactTiles,
  shoeCases,
  footprintPair,
  liquidPressure,
  liquidCases,
  pressureDifference,
  atmosphereCases,
  strawColumn,
  strawCases,
  gasSyringe,
  syringeCases,
  prescribedContact,
  prescribedLiquid,
} from './pressureModels';
type Kind = 'contact' | 'shoes' | 'liquid' | 'air' | 'straw' | 'syringe';
type Pair = [string, string];
const gold = '#bd9155',
  blue = '#82b5c6',
  ink = '#a68ab7';
const fmt = (value: number) => String(Number(value.toFixed(2)));
const words = (mode: LanguageMode, pair: Pair) =>
  mode === 'en' ? pair[1] : pair[0];
const labels: Record<Kind, Pair> = {
  contact: ['把同样的力分给接触面', 'Share force across a contact patch'],
  shoes: ['同一个人，三种接触', 'Same person, three contact areas'],
  liquid: ['从水面往下量', 'Measure depth from the surface'],
  air: ['两边都在推', 'Both sides push'],
  straw: ['比较水面与管口', 'Compare surface and tube-top pressure'],
  syringe: ['体积变化，压力怎样回应？', 'How does pressure respond to volume?'],
};
const notes: Record<Kind, Pair> = {
  contact: [
    '接触区域俯视图；每格1 cm²，均匀分力。格内箭头长度只表示分力大小，不代表俯视平面中的力方向；条形是平均压强，都不是压入深度。真实肩带接触可能不均匀。',
    'Plan view of the contact region: each square is 1 cm², uniformly loaded. Arrow length encodes force per square, not force direction within the plan-view plane; the bar shows average pressure. Neither is indentation. Real straps may load unevenly.',
  ],
  shoes: [
    '两个等效矩形合起来是总接触面积，各承受300 N，尺寸共用比例。三组总力都是600 N；条形共用0–300 kPa，不预测雪地形变。',
    'Two equivalent rectangles make the total area and each carries 300 N, at one length scale. Total force stays 600 N. Bars share 0–300 kPa; snow deformation is not predicted.',
  ],
  liquid: [
    '静止均匀液体；水面压力101 kPa，g≈10 N/kg。1200 kg/m³是规定的较密液体。小探针代表同一个位置：转向改变受力方向，不改变该点压强。模型不计算喷水距离。',
    'Uniform liquid at rest; surface pressure 101 kPa, g≈10 N/kg. 1200 kg/m³ is a prescribed denser liquid. The tiny probe represents one position: orientation changes force direction, not pressure there. Jet distance is not calculated.',
  ],
  air: [
    '两侧压力是给定条件，外侧101 kPa只是近海平面的教学近似。理想平活塞忽略摩擦，箭头共用力的比例；合力是两侧力的结果，不是第三个施力者。',
    'Pressures are assigned; outside 101 kPa is a near-sea-level teaching approximation. An ideal flat piston ignores friction. Force arrows share one scale. Net force is the result of the two forces, not a third agent.',
  ],
  straw: [
    '淡水静止液柱，g≈10 N/kg；高度从杯中水面量起，不是流速。“密封后同压”是后来杯内气体与管口都为99 kPa的状态，不表示刚封杯就不能出水。忽略毛细作用。',
    'Static freshwater column, g≈10 N/kg; height is above the cup surface, not flow rate. “Later sealed balance” assigns 99 kPa to both headspace and tube top; it does not claim a freshly sealed cup cannot initially release water. Capillarity is omitted.',
  ],
  syringe: [
    '缓慢、等温；封口保持同一份空气，初始20 mL、101 kPa，活塞2 cm²。pV用绝对压强。开口时空气可进出。理想额外保持力忽略摩擦；不是让孩子挑战的用力值。',
    'Slow and isothermal; a sealed tip keeps the same air, initially 20 mL at 101 kPa, piston 2 cm². pV uses absolute pressure. Air can enter or leave an open tip. Ideal extra holding force ignores friction; it is not a force challenge for children.',
  ],
};
function Arrow({
  x,
  y,
  dx,
  dy = 0,
  colour = gold,
  head = 7,
}: {
  x: number;
  y: number;
  dx: number;
  dy?: number;
  colour?: string;
  head?: number;
}) {
  if (dx === 0 && dy === 0) return null;
  const turn = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g stroke={colour} strokeWidth={head < 7 ? 1.5 : 3} fill="none">
      <path d={`M${x} ${y}l${dx} ${dy}`} />
      <path
        d={`M${-head} ${-head * 0.7} 0 0 ${-head} ${head * 0.7}`}
        transform={`translate(${x + dx} ${y + dy}) rotate(${turn})`}
      />
    </g>
  );
}
function Bar({ value, max }: { value: number; max: number }) {
  return (
    <g>
      <rect x="350" y="170" width="220" height="26" rx="5" fill="#eee5f3" />
      <rect
        x="350"
        y="170"
        width={(220 * value) / max}
        height="26"
        rx="5"
        fill={gold}
      />
      <text x="350" y="145">
        {fmt(value)} kPa
      </text>
      <text x="350" y="230" fontSize="23">
        0 → {max} kPa
      </text>
    </g>
  );
}
function PressureLab({ kind, mode, onExplore }: LabProps & { kind: Kind }) {
  const [choice, setChoice] = useState(0),
    [force, setForce] = useState(60),
    [area, setArea] = useState(30),
    [depth, setDepth] = useState(0.1),
    [density, setDensity] = useState(1000),
    [width, setWidth] = useState(160),
    [orientation, setOrientation] = useState(0),
    [inside, setInside] = useState(101000),
    [pistonArea, setPistonArea] = useState(10),
    [volume, setVolume] = useState(20),
    [vented, setVented] = useState(false),
    [records, setRecords] = useState<number[]>([]),
    [probe, setProbe] = useState(0);
  const preset =
    kind === 'contact'
      ? prescribedContact(force, area)
      : kind === 'liquid'
        ? prescribedLiquid(depth, density)
        : kind === 'air'
          ? pistonArea === 10
            ? atmosphereCases.findIndex((p) => p === inside)
            : -1
          : kind === 'syringe'
            ? vented
              ? -1
              : syringeCases.findIndex((v) => v === volume)
            : choice;
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.2, () => {
      setProbe(1);
      if (preset >= 0) {
        setRecords((prev) => [...new Set([...prev, preset])]);
        gate.record(String(preset));
      }
    });
  const progress = animation.running ? animation.time / 2.2 : probe;
  const reset = () => {
    animation.reset();
    setProbe(0);
  };
  const choose = (i: number) => {
    reset();
    setChoice(i);
    if (kind === 'contact') {
      setForce(contactCases[i]!.force);
      setArea(contactCases[i]!.area);
    }
    if (kind === 'liquid') {
      setDepth(liquidCases[i]!.depth);
      setDensity(liquidCases[i]!.density);
    }
    if (kind === 'air') {
      setInside(atmosphereCases[i]!);
      setPistonArea(10);
    }
    if (kind === 'syringe') {
      setVolume(syringeCases[i]!);
      setVented(false);
    }
  };
  let options: Pair[],
    scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[];
  if (kind === 'contact') {
    const m = contactPressure(force, area);
    options = contactCases.map((c) => [
      `${c.force} N / ${c.area} cm²`,
      `${c.force} N / ${c.area} cm²`,
    ]);
    scene = (
      <>
        <text x="55" y="45">
          {force} N / {area} cm²
        </text>
        {contactTiles(force, area).map((t, i) => (
          <g key={i}>
            <rect
              x={55 + t.column * 23}
              y={65 + t.row * 23}
              width="23"
              height="23"
              fill="#eee5f3"
              stroke={ink}
              strokeWidth="1"
            />
            <Arrow
              x={66.5 + t.column * 23}
              y={69 + t.row * 23}
              dx={0}
              dy={t.force * 4}
              head={1.5}
            />
          </g>
        ))}
        <Bar value={m.kPa} max={40} />
      </>
    );
    metrics = [
      { title: ['总垂直力', 'Total normal force'], value: `${force} N` },
      {
        title: ['每1 cm²分到的力', 'Force per 1 cm²'],
        value: `${fmt(m.forcePerCm2)} N`,
      },
      { title: ['平均压强', 'Average pressure'], value: `${fmt(m.kPa)} kPa` },
    ];
    columns = [
      ['力', 'Force'],
      ['面积', 'Area'],
      ['平均压强', 'Average pressure'],
    ];
    row = (i) => {
      const c = contactCases[i]!;
      return [
        `${c.force} N`,
        `${c.area} cm²`,
        `${contactPressure(c.force, c.area).kPa} kPa`,
      ];
    };
  } else if (kind === 'shoes') {
    const m = footprintPair(shoeCases[choice]!.area),
      w = m.widthCm * 4,
      h = m.lengthCm * 4;
    options = shoeCases.map((c) => [c.zh, c.en]);
    scene = (
      <>
        <text x="45" y="30">
          600 N · {m.areaCm2} cm²
        </text>
        {[120, 240].map((x) => (
          <g key={x}>
            <rect
              x={x - w / 2}
              y={255 - h}
              width={w}
              height={h}
              rx="2"
              stroke={blue}
              fill="#e3f1f7"
              strokeWidth="2"
            />
            <Arrow x={x} y={82} dx={0} dy={16} />
            <text x={x - 38} y="72" fontSize="22">
              300 N
            </text>
          </g>
        ))}
        <Bar value={m.kPa} max={300} />
      </>
    );
    metrics = [
      { title: ['两脚总力', 'Both-feet force'], value: '600 N' },
      { title: ['两脚总面积', 'Both-feet area'], value: `${m.areaCm2} cm²` },
      { title: ['平均压强', 'Average pressure'], value: `${fmt(m.kPa)} kPa` },
    ];
    columns = [
      ['总面积', 'Total area'],
      ['总力', 'Total force'],
      ['平均压强', 'Average pressure'],
    ];
    row = (i) => {
      const m = footprintPair(shoeCases[i]!.area);
      return [`${m.areaCm2} cm²`, '600 N', `${m.kPa} kPa`];
    };
  } else if (kind === 'liquid') {
    const m = liquidPressure(density, depth),
      left = 220 - width / 2,
      y = 60 + depth * 450;
    options = [
      ['水 · 0.10 m', 'Water · 0.10 m'],
      ['水 · 0.30 m', 'Water · 0.30 m'],
      ['较密液体 · 0.30 m', 'Denser liquid · 0.30 m'],
    ];
    const directions = [
      { dx: 0, dy: 24, x: 220, y: y - 28 },
      { dx: 24, dy: 0, x: 192, y },
      { dx: 0, dy: -24, x: 220, y: y + 28 },
    ];
    scene = (
      <>
        <path
          d={`M${left} 35V250h${width}V35`}
          stroke={ink}
          strokeWidth="3"
          fill="none"
        />
        <rect
          x={left + 2}
          y="60"
          width={width - 4}
          height="188"
          fill="#dfeef6"
          opacity={density === 1000 ? 0.75 : 1}
        />
        <path d={`M${left} 60h${width}`} stroke={blue} strokeWidth="2" />
        <path d={`M${left - 20} 60V${y}`} stroke={gold} strokeWidth="2" />
        <circle cx="220" cy={y} r="4" fill={gold} />
        <Arrow {...directions[orientation]!} />
        <text x="370" y="95">
          h = {fmt(depth)} m
        </text>
        <text x="370" y="155">
          +{fmt(m.incrementKPa)} kPa
        </text>
        <text x="370" y="215">
          {fmt(m.absoluteKPa)} kPa
        </text>
      </>
    );
    metrics = [
      {
        title: ['水面以下深度', 'Depth below surface'],
        value: `${fmt(depth)} m`,
      },
      {
        title: ['液体增加的压强', 'Liquid pressure increment'],
        value: `${fmt(m.incrementKPa)} kPa`,
      },
      {
        title: ['该点绝对压强', 'Absolute pressure at point'],
        value: `${fmt(m.absoluteKPa)} kPa`,
      },
    ];
    columns = [
      ['深度 / 密度', 'Depth / density'],
      ['增加量', 'Increment'],
      ['绝对压强', 'Absolute pressure'],
    ];
    row = (i) => {
      const c = liquidCases[i]!,
        m = liquidPressure(c.density, c.depth);
      return [
        `${fmt(c.depth)} m · ${c.density} kg/m³`,
        `${fmt(m.incrementKPa)} kPa`,
        `${fmt(m.absoluteKPa)} kPa`,
      ];
    };
  } else if (kind === 'air') {
    const m = pressureDifference(101000, inside, pistonArea);
    options = atmosphereCases.map((p) => [
      `${p / 1000} kPa 内侧`,
      `${p / 1000} kPa inside`,
    ]);
    scene = (
      <>
        <rect
          x="260"
          y="75"
          width="270"
          height="135"
          rx="6"
          stroke={ink}
          strokeWidth="3"
          fill="#eee5f3"
        />
        <path d="M260 65v155" stroke={ink} strokeWidth="8" />
        <Arrow
          x={250 - m.outsideForce * 0.9}
          y={130}
          dx={m.outsideForce * 0.9}
        />
        <Arrow
          x={270 + m.insideForce * 0.9}
          y={165}
          dx={-m.insideForce * 0.9}
          colour={blue}
        />
        <text x="40" y="52">
          101 kPa
        </text>
        <text x="335" y="52">
          {inside / 1000} kPa
        </text>
        <text x="40" y="245">
          → {fmt(m.outsideForce)} N
        </text>
        <text x="335" y="245">
          {fmt(m.insideForce)} N ←
        </text>
      </>
    );
    metrics = [
      {
        title: ['外侧向内力', 'Outside inward force'],
        value: `${fmt(m.outsideForce)} N`,
      },
      {
        title: ['内侧向外力', 'Inside outward force'],
        value: `${fmt(m.insideForce)} N`,
      },
      {
        title: ['合力向内', 'Net force inward'],
        value: `${fmt(m.netInward)} N`,
      },
    ];
    columns = [
      ['内侧压强', 'Inside pressure'],
      ['压强差', 'Pressure difference'],
      ['合力向内', 'Net inward force'],
    ];
    row = (i) => {
      const m = pressureDifference(101000, atmosphereCases[i]!, 10);
      return [
        `${m.inside / 1000} kPa`,
        `${m.difference / 1000} kPa`,
        `${fmt(m.netInward)} N`,
      ];
    };
  } else if (kind === 'straw') {
    const c = strawCases[choice]!,
      m = strawColumn(c.surface, c.mouth),
      top = 210 - m.aboveSurface * 400;
    options = [
      ['通气杯', 'Vented cup'],
      ['不降管口', 'No top reduction'],
      ['密封后同压', 'Later sealed balance'],
    ];
    scene = (
      <>
        <path
          d="M90 150l10 110h220l10-110"
          fill="none"
          stroke={ink}
          strokeWidth="3"
        />
        <path d="M97 210h226l-6 47H103Z" fill="#dfeef6" stroke={blue} />
        <path
          d="M220 250V90h55"
          stroke="#e3d7eb"
          strokeWidth="20"
          fill="none"
        />
        <path
          d={`M220 248V${top}`}
          stroke={blue}
          strokeWidth="10"
          fill="none"
        />
        {!c.vented && (
          <path d="M90 150H210M230 150H330" stroke={ink} strokeWidth="6" />
        )}
        <path d={`M350 210V${top}`} stroke={gold} strokeWidth="3" />
        <text x="370" y="190">
          {fmt(m.aboveSurface * 100)} cm
        </text>
        <text x="50" y="60">
          {c.surface / 1000} kPa
        </text>
        <text x="335" y="100">
          {c.mouth / 1000} kPa
        </text>
      </>
    );
    metrics = [
      {
        title: ['杯中水面压力', 'Cup surface pressure'],
        value: `${c.surface / 1000} kPa`,
      },
      {
        title: ['管口气体压力', 'Tube-top gas pressure'],
        value: `${c.mouth / 1000} kPa`,
      },
      {
        title: ['静止液柱高于水面', 'Static column above surface'],
        value: `${fmt(m.aboveSurface * 100)} cm`,
      },
    ];
    columns = [
      ['水面 / 管口', 'Surface / top'],
      ['压强差', 'Pressure difference'],
      ['高于水面', 'Above surface'],
    ];
    row = (i) => {
      const c = strawCases[i]!,
        m = strawColumn(c.surface, c.mouth);
      return [
        `${c.surface / 1000} / ${c.mouth / 1000} kPa`,
        `${m.difference / 1000} kPa`,
        `${fmt(m.aboveSurface * 100)} cm`,
      ];
    };
  } else {
    const m = gasSyringe(volume, vented),
      x = 500 - volume * 12;
    options = syringeCases.map((v) => [`${v} mL · 封口`, `${v} mL · Sealed`]);
    scene = (
      <>
        <rect
          x="250"
          y="85"
          width="250"
          height="115"
          rx="5"
          stroke={ink}
          strokeWidth="3"
          fill="#f9f5fc"
        />
        <rect x={x} y="88" width={500 - x - 2} height="109" fill="#e5dced" />
        <path
          d={`M${x} 78v128M${x} 143H${x - 115}M${x - 115} 117v52`}
          stroke={ink}
          strokeWidth="6"
        />
        {[5, 10, 15, 20].map((v) => (
          <g key={v}>
            <path d={`M${500 - v * 12} 87v17`} stroke={ink} />
            <text x={500 - v * 12 - 8} y="74" fontSize="23">
              {v}
            </text>
          </g>
        ))}
        <path d="M500 143h40" stroke={ink} strokeWidth="5" />
        {!vented && <path d="M540 133v20" stroke={gold} strokeWidth="7" />}
        <text x="35" y="45">
          101 kPa
        </text>
        <text x="330" y="245">
          {fmt(m.kPa)} kPa
        </text>
        <Arrow x={x - 85} y={225} dx={m.holdingForce} />
        <text x="35" y="270">
          {fmt(m.holdingForce)} N →
        </text>
      </>
    );
    metrics = [
      { title: ['空气体积', 'Air volume'], value: `${volume} mL` },
      { title: ['绝对压强', 'Absolute pressure'], value: `${fmt(m.kPa)} kPa` },
      {
        title: ['理想额外保持力', 'Ideal extra holding force'],
        value: `${fmt(m.holdingForce)} N`,
      },
    ];
    columns = [
      ['封口体积', 'Sealed volume'],
      ['绝对压强', 'Absolute pressure'],
      ['额外保持力', 'Extra holding force'],
    ];
    row = (i) => {
      const m = gasSyringe(syringeCases[i]!);
      return [
        `${m.volumeMl} mL`,
        `${fmt(m.kPa)} kPa`,
        `${fmt(m.holdingForce)} N`,
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
        disabled={animation.running}
        onChange={(ev) => {
          reset();
          set(Number(ev.target.value));
        }}
      />
    </label>
  );
  const extraOptions = (
    title: Pair,
    choices: Pair[],
    value: number,
    set: (v: number) => void,
  ) => (
    <LabOptions
      mode={mode}
      name={title}
      values={choices.map(([zh, en], id) => ({ id, zh, en }))}
      value={value}
      disabled={animation.running}
      set={(v) => {
        reset();
        set(v);
      }}
    />
  );
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">PRESSURE / EVERYDAY PUZZLES</span>
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
      {kind === 'contact' && (
        <>
          {slider(
            ['总垂直力', 'Total normal force'],
            force,
            30,
            120,
            10,
            'N',
            setForce,
          )}
          {slider(
            ['实际接触面积', 'Actual contact area'],
            area,
            30,
            60,
            10,
            'cm²',
            setArea,
          )}
        </>
      )}
      {kind === 'liquid' && (
        <>
          {slider(
            ['探针深度', 'Probe depth'],
            depth,
            0.05,
            0.4,
            0.05,
            'm',
            setDepth,
          )}
          {extraOptions(
            ['液体密度', 'Liquid density'],
            [
              ['1000 kg/m³', '1000 kg/m³'],
              ['1200 kg/m³', '1200 kg/m³'],
            ],
            density === 1000 ? 0 : 1,
            (i) => setDensity(i === 0 ? 1000 : 1200),
          )}
          {extraOptions(
            ['容器宽度', 'Vessel width'],
            [
              ['窄', 'Narrow'],
              ['宽', 'Wide'],
            ],
            width === 160 ? 0 : 1,
            (i) => setWidth(i === 0 ? 160 : 280),
          )}
          {extraOptions(
            ['同点探针朝向', 'Probe orientation at same point'],
            [
              ['上', 'Up'],
              ['侧', 'Side'],
              ['下', 'Down'],
            ],
            orientation,
            setOrientation,
          )}
        </>
      )}
      {kind === 'air' && (
        <>
          {slider(
            ['内侧压强', 'Inside pressure'],
            inside / 1000,
            61,
            101,
            1,
            'kPa',
            (v) => setInside(v * 1000),
          )}
          {slider(
            ['平活塞面积', 'Flat piston area'],
            pistonArea,
            5,
            20,
            1,
            'cm²',
            setPistonArea,
          )}
        </>
      )}
      {kind === 'syringe' && (
        <>
          {slider(
            ['空气体积', 'Air volume'],
            volume,
            5,
            20,
            1,
            'mL',
            setVolume,
          )}
          {extraOptions(
            ['管口状态', 'Tip state'],
            [
              ['封口', 'Sealed'],
              ['开口', 'Open'],
            ],
            vented ? 1 : 0,
            (i) => setVented(i === 1),
          )}
        </>
      )}
      <svg
        viewBox="0 0 620 300"
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
      <p className="phy-model-note">
        <B zh={notes[kind][0]} en={notes[kind][1]} mode={mode} />
      </p>
      <div className="phy-pressure-inspection" aria-hidden="true">
        <span style={{ left: `${4 + 92 * progress}%` }} />
        <i />
        <i />
        <i />
      </div>
      <p className="phy-model-note">
        <B
          zh="绿点按条件→比较→结果的顺序检查，不代表水、空气或活塞运动，也不是物理计时。"
          en="The green marker checks conditions → comparison → result. It is not motion of water, air or a piston, or a physical clock."
          mode={mode}
        />
      </p>
      {slider(
        ['检查进度', 'Inspection progress'],
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
          zh={animation.running ? '检查中…' : '完整检查这组条件'}
          en={animation.running ? 'Inspecting…' : 'Inspect this complete case'}
          mode={mode}
        />
      </button>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${gate.count}/3：三组规定条件都要完整检查。拖动进度和自由设置不代替规定比较。`}
          en={`Compared ${gate.count}/3: inspect all three prescribed cases completely. Seeking and custom settings do not replace these comparisons.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="保留比较 · 规定模型结果"
                en="Retained comparisons · Prescribed model results"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th scope="col" key={c[1]}>
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
export const PressureContactLab = (p: LabProps) => (
  <PressureLab {...p} kind="contact" />
);
export const PressureShoesLab = (p: LabProps) => (
  <PressureLab {...p} kind="shoes" />
);
export const PressureLiquidLab = (p: LabProps) => (
  <PressureLab {...p} kind="liquid" />
);
export const PressureAirLab = (p: LabProps) => (
  <PressureLab {...p} kind="air" />
);
export const PressureStrawLab = (p: LabProps) => (
  <PressureLab {...p} kind="straw" />
);
export const PressureSyringeLab = (p: LabProps) => (
  <PressureLab {...p} kind="syringe" />
);
