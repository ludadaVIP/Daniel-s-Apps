import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import { nf } from './newtonModels';
import { waveNumber } from './waveModels';
import {
  heatParameters,
  heatReading,
  heatRecord,
  heatTitles,
  heatOptions,
  heatLimits,
  heatDefault,
  heatConditions,
  heatSources,
  gasParticles,
  contactState,
  iceHeating,
  type HeatKind,
  type Pair,
} from './heatModels';
type Reading = ReturnType<typeof heatReading>;
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const gold = '#efd28e',
  blue = '#a2bec3',
  purple = '#bba4cf',
  grey = '#91a1a7';
const colors = [gold, blue, purple, '#bf9292'];
function Scene({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const g = m.gas,
    c = m.contact,
    h = m.heating,
    s = m.phase,
    l = m.latent;
  const title: Pair = g
    ? ['三维热运动的平面投影', 'Planar view of 3D thermal motion']
    : c
      ? ['热传递方向由温差决定', 'Temperature difference sets heat flow']
      : h
        ? ['进入样品的净功率', 'Net power entering the sample']
        : ['面积记质量，不记体积', 'Area represents mass, not volume'];
  const first = s ? s.solid : (l?.remaining ?? 0),
    second = s ? s.liquid : (l?.converted ?? 0),
    total = s ? s.mass : (l?.mass ?? 1);
  return (
    <svg viewBox="0 0 620 410" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      {g ? (
        <>
          <rect
            x="200"
            y="100"
            width="220"
            height="220"
            fill="none"
            stroke={grey}
          />
          {m.particles.map((q, j) => (
            <circle
              key={j}
              cx={200 + (220 * q.x) / 1e-6}
              cy={320 - (220 * q.y) / 1e-6}
              r="3"
              fill={colors[q.group]}
            />
          ))}
          <text x="310" y="75" textAnchor="middle">
            {nf(m.time * 1e9)} ns · {m.particles.length}{' '}
            {word(mode, ['代表点', 'representative dots'])}
          </text>
          <text x="310" y="355" textAnchor="middle">
            x: 0 → 1 μm · y: 0 → 1 μm
          </text>
          <text x="310" y="390" textAnchor="middle">
            {word(mode, [
              '平均速度=0；速率仍非零',
              'Mean velocity = 0; speeds remain nonzero',
            ])}
          </text>
        </>
      ) : c ? (
        <>
          {[c.A, c.B].map((T, j) => (
            <g key={j}>
              <rect
                x={80 + 260 * j}
                y="115"
                width="200"
                height="200"
                fill={T > 350 ? gold : blue}
                fillOpacity=".13"
                stroke={j ? purple : blue}
              />
              {Array.from({ length: (j ? c.Cb : c.Ca) * 2 }, (_, i) => (
                <circle
                  key={i}
                  cx={95 + 260 * j + (i % 8) * 23}
                  cy={155 + Math.floor(i / 8) * 27}
                  r="3"
                  fill={j ? purple : blue}
                />
              ))}
              <text x={180 + 260 * j} y="90" textAnchor="middle">
                {j ? 'B' : 'A'}: {nf(T)} K
              </text>
              <text x={180 + 260 * j} y="350" textAnchor="middle">
                C={j ? c.Cb : c.Ca} J/K
              </text>
            </g>
          ))}
          {Math.abs(c.powerIntoA) > 1e-9 && (
            <path
              d={
                c.powerIntoA < 0
                  ? 'M290 225H330l-7-6m7 6l-7 6'
                  : 'M330 225H290l7-6m-7 6l7 6'
              }
              fill="none"
              stroke={gold}
              strokeWidth="3"
            />
          )}
          <text x="310" y="390" textAnchor="middle">
            {word(mode, [
              '外界隔热；内部可以传热',
              'Insulated exterior; internal heat transfer',
            ])}
          </text>
        </>
      ) : h ? (
        <>
          <rect
            x="180"
            y="120"
            width="260"
            height="190"
            fill={m.index === 2 ? purple : blue}
            fillOpacity=".18"
            stroke={blue}
          />
          <text x="310" y="95" textAnchor="middle">
            {nf(h.temperature)} °C
          </text>
          <text x="310" y="180" textAnchor="middle">
            m={nf(h.mass * 1000)} g
          </text>
          <text x="310" y="220" textAnchor="middle">
            c={h.c} J/(kg K)
          </text>
          <text x="310" y="265" textAnchor="middle">
            Q={nf(h.Q)} J
          </text>
          {h.absorbedPower > 0 && (
            <path
              d="M310 360V320l-7 7m7-7l7 7"
              stroke={gold}
              strokeWidth="3"
              fill="none"
            />
          )}
          <text x="310" y="390" textAnchor="middle">
            P_abs={nf(h.absorbedPower)} W · t={nf(m.time)} s
          </text>
        </>
      ) : (
        <>
          <text x="310" y="90" textAnchor="middle">
            T={nf(s?.temperature ?? l!.temperature)} °C
          </text>
          <rect
            x="85"
            y="145"
            width={(450 * first) / total}
            height="140"
            fill={blue}
            fillOpacity=".35"
          />
          <rect
            x={85 + (450 * first) / total}
            y="145"
            width={(450 * second) / total}
            height="140"
            fill={purple}
            fillOpacity=".55"
          />
          <rect
            x="85"
            y="145"
            width="450"
            height="140"
            stroke={grey}
            fill="none"
          />
          <text x="85" y="325">
            {word(
              mode,
              s
                ? ['冰', 'Ice']
                : m.index === 2
                  ? ['水', 'Water']
                  : m.index === 1
                    ? ['水', 'Water']
                    : ['冰', 'Ice'],
            )}
            : {nf(first * 1000)} g
          </text>
          <text x="535" y="355" textAnchor="end">
            {word(
              mode,
              s
                ? ['水', 'Water']
                : m.index === 2
                  ? ['冰', 'Ice']
                  : m.index === 1
                    ? ['水蒸气', 'Vapor']
                    : ['水', 'Water'],
            )}
            : {nf(second * 1000)} g
          </text>
          <text x="310" y="390" textAnchor="middle">
            Q={nf((s?.Q ?? l!.Q) / 1000)} kJ · t={nf(m.time)} s
          </text>
        </>
      )}
    </svg>
  );
}
function Relation({ m, mode }: { m: Reading; mode: LanguageMode }) {
  let xmax = 600,
    ymin = 0,
    ymax = 4,
    xlabel = 'T / K',
    ylabel = 'v_rms² / 10⁶ m² s⁻²',
    cx = m.value,
    cy = 0,
    title: Pair = ['温度关联平均能量', 'Temperature tracks mean energy'];
  let fns: ((x: number) => number)[] = [
    (x) => (3 * 1.380649e-23 * x) / (m.massU * 1.66054e-27) / 1e6,
  ];
  cy = m.gas ? m.gas.rms ** 2 / 1e6 : 0;
  if (m.kind === 'internal') {
    ymax = 15;
    ylabel = 'U / J';
    fns = [(x) => 1.5 * m.moles * 8.31446261815324 * x];
    cy = m.gas!.U;
    title = ['粒子更多，总能量更多', 'More particles, more total energy'];
  }
  if (m.contact) {
    xmax = 30;
    ymin = 250;
    ymax = 450;
    xlabel = 't / s';
    ylabel = 'T / K';
    cx = m.time;
    cy = m.contact.A;
    fns = [
      (x) => contactState(m.Ca, m.Cb, m.Ta, m.value, 1, x).A,
      (x) => contactState(m.Ca, m.Cb, m.Ta, m.value, 1, x).B,
    ];
    title = [
      '趋近平衡，不强制跳到终值',
      'Approach equilibrium without snapping',
    ];
  }
  if (m.heating) {
    xmax = 840;
    ymin = 20;
    ymax = 30;
    xlabel = 'Q / J';
    ylabel = 'T / °C';
    cx = m.heating.Q;
    cy = m.heating.temperature;
    fns = [(x) => 20 + x / (m.mass * m.c)];
    title = ['同样热量，温升由mc决定', 'For given heat, mc sets the rise'];
  }
  if (m.phase) {
    xmax = 50;
    ymin = -10;
    ymax = 35;
    xlabel = 'Q / kJ';
    ylabel = 'T / °C';
    cx = m.phase.Q / 1000;
    cy = m.phase.temperature;
    fns = [(x) => iceHeating(x * 1000).temperature];
    title = ['融化平台：吸热但不升温', 'Melting plateau: heat without warming'];
  }
  if (m.latent) {
    xmax = 20;
    ymax = 0.2;
    xlabel = '|Q| / kJ';
    ylabel = 'changed mass / kg';
    cx = Math.abs(m.latent.Q) / 1000;
    cy = m.latent.converted;
    fns = [
      (x) =>
        x * 1000 <= m.latent!.target + 1e-8 ? (x * 1000) / m.latent!.L : NaN,
    ];
    title = ['相变完成，热源随即停止', 'At completion, the heat source stops'];
  }
  const X = (x: number) => 80 + (460 * x) / xmax,
    Y = (y: number) => 325 - (225 * (y - ymin)) / (ymax - ymin);
  const curve = (fn: (x: number) => number) =>
    Array.from({ length: 201 }, (_, i) => {
      const x = (xmax * i) / 200,
        y = fn(x);
      return Number.isFinite(y) && y >= ymin - 1e-8 && y <= ymax + 1e-8
        ? (i ? 'L' : 'M') + X(x) + ' ' + Y(y)
        : '';
    }).join(' ');
  return (
    <svg viewBox="0 0 620 410" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="80">
        {ylabel}
      </text>
      <path d="M80 100V325H540" stroke={grey} fill="none" />
      <text x="65" y="110" textAnchor="end">
        {nf(ymax)}
      </text>
      <text x="65" y="325" textAnchor="end">
        {nf(ymin)}
      </text>
      <text x="80" y="355" textAnchor="middle">
        0
      </text>
      <text x="540" y="355" textAnchor="middle">
        {nf(xmax)}
      </text>
      <text x="540" y="390" textAnchor="end">
        {xlabel}
      </text>
      {fns.map((fn, j) => (
        <path
          key={j}
          d={curve(fn)}
          fill="none"
          stroke={j ? purple : blue}
          strokeWidth="2"
        />
      ))}
      <circle cx={X(cx)} cy={Y(cy)} r="4" fill={gold} />
      {m.contact && (
        <circle cx={X(cx)} cy={Y(m.contact.B)} r="4" fill={purple} />
      )}
    </svg>
  );
}
function Ledger({ m, mode }: { m: Reading; mode: LanguageMode }) {
  let title: Pair = ['同刻的速率档位', 'Speed groups at the same instant'],
    max = 3500,
    values = gasParticles(300, 4, 0)
      .filter((_, i) => i % 12 === 0)
      .map((q) => q.speed),
    labels = ['v₁ / m/s', 'v₂ / m/s', 'v₃ / m/s', 'v₄ / m/s'],
    signed = false,
    caption: Pair = [
      '四档各12点；不是完整速率分布',
      '12 points per group; not a full speed distribution',
    ];
  if (m.gas)
    values = m.particles
      .filter((_, i) => i % 12 === 0)
      .slice(0, 4)
      .map((q) => q.speed);
  if (m.kind === 'internal') {
    title = ['三维平动能量之和', 'Sum of 3D translational energy'];
    max = 15;
    values = [m.gas!.U / 3, m.gas!.U / 3, m.gas!.U / 3, m.gas!.U];
    labels = ['Uₓ / J', 'Uᵧ / J', 'U_z / J', 'U / J'];
    caption = ['各方向均分；Uₓ+Uᵧ+U_z=U', 'Equal components; Uₓ+Uᵧ+U_z=U'];
  }
  if (m.contact) {
    title = ['一方得热，另一方失热', 'One gains heat, the other loses it'];
    max = 1000;
    values = [m.contact.Qa, m.contact.Qb];
    labels = ['Q_A / J', 'Q_B / J'];
    signed = true;
    caption = [
      'Q_A+Q_B=0；对外没有热交换',
      'Q_A+Q_B=0; no exterior heat exchange',
    ];
  }
  if (m.heating) {
    title = [
      '吸收热量与升高1 K所需热量',
      'Absorbed heat and heat for a 1 K rise',
    ];
    max = 1000;
    values = [m.heating.Q, m.heating.C];
    labels = ['Q_abs / J', 'Q_for_1K / J'];
    caption = ['两条都以J计；第二条=mc × 1 K', 'Both in J; second = mc × 1 K'];
  }
  if (m.phase) {
    title = ['把吸收热量分到账上', 'Account for the absorbed heat'];
    max = 50;
    values = [m.phase.Qice / 1000, m.phase.Qmelt / 1000, m.phase.Qwater / 1000];
    labels = ['Q_ice / kJ', 'Q_melt / kJ', 'Q_water / kJ'];
    caption = ['Q_ice+Q_melt+Q_water=Q', 'Q_ice+Q_melt+Q_water=Q'];
  }
  if (m.latent) {
    title = [
      '质量账：转变前后都在系统内',
      'Mass ledger: all matter stays inside',
    ];
    max = 0.2;
    values = [m.latent.remaining, m.latent.converted];
    labels = ['remaining / kg', 'converted / kg'];
    caption = [
      '未转变+已转变=总质量；Q可为负',
      'Remaining + converted = total mass; Q may be negative',
    ];
  }
  const zero = signed ? 310 : 80,
    span = signed ? 220 : 460;
  return (
    <svg viewBox="0 0 620 410" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      {values.map((v, j) => {
        const y = 95 + j * 66,
          w = (span * Math.abs(v)) / max;
        return (
          <g key={j}>
            <text x="25" y={y - 10}>
              {labels[j]} = {nf(v)}
            </text>
            <path d={`M${zero} ${y - 2}v24`} stroke={grey} />
            <rect
              x={v < 0 ? zero - w : zero}
              y={y}
              width={w}
              height="18"
              fill={colors[j]}
            />
          </g>
        );
      })}
      <text x="310" y="365" textAnchor="middle">
        {word(mode, ['固定共用刻度上限', 'Fixed shared scale maximum'])}:{' '}
        {nf(max)}
      </text>
      <text x="310" y="395" textAnchor="middle">
        {word(mode, caption)}
      </text>
    </svg>
  );
}
export function HeatLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: HeatKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<{ index: number; reading: string }[]>([]);
  const p = heatParameters(kind, index, custom),
    canonical = custom === null,
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (!canonical) return;
    gate.record(String(index));
    setRecords((old) =>
      [
        ...old.filter((r) => r.index !== index),
        { index, reading: heatRecord(p) },
      ].sort((a, b) => a.index - b.index),
    );
  });
  const progress = probe ?? animation.time / 2.4,
    lim = heatLimits[kind];
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const m = heatReading(p, progress);
  const metrics: [Pair, string][] = m.gas
    ? [
        [['绝对温度', 'Absolute temperature'], nf(m.gas.T) + ' K'],
        [
          ['平均平动动能', 'Mean translational energy'],
          waveNumber(m.gas.meanK) + ' J',
        ],
        [['热运动均方根速率', 'Thermal RMS speed'], nf(m.gas.rms) + ' m/s'],
        [
          kind === 'particles'
            ? ['平均速度', 'Mean velocity']
            : ['模型内能', 'Model internal energy'],
          kind === 'particles' ? '0 m/s' : nf(m.gas.U) + ' J',
        ],
      ]
    : m.contact
      ? [
          [['A温度', 'Temperature A'], nf(m.contact.A) + ' K'],
          [['B温度', 'Temperature B'], nf(m.contact.B) + ' K'],
          [
            ['平衡温度', 'Equilibrium temperature'],
            nf(m.contact.equilibrium) + ' K',
          ],
          [['进入A的功率', 'Power into A'], nf(m.contact.powerIntoA) + ' W'],
        ]
      : m.heating
        ? [
            [['已吸收热量', 'Absorbed heat'], nf(m.heating.Q) + ' J'],
            [['样品热容量', 'Sample heat capacity'], nf(m.heating.C) + ' J/K'],
            [['温升', 'Temperature rise'], nf(m.heating.rise) + ' K'],
            [
              ['当前温度', 'Current temperature'],
              nf(m.heating.temperature) + ' °C',
            ],
          ]
        : m.phase
          ? [
              [
                ['当前温度', 'Current temperature'],
                nf(m.phase.temperature) + ' °C',
              ],
              [['冰的质量', 'Ice mass'], nf(m.phase.solid * 1000) + ' g'],
              [['水的质量', 'Water mass'], nf(m.phase.liquid * 1000) + ' g'],
              [['已吸收热量', 'Absorbed heat'], nf(m.phase.Q / 1000) + ' kJ'],
            ]
          : [
              [
                ['相变温度', 'Transition temperature'],
                nf(m.latent!.temperature) + ' °C',
              ],
              [['带符号热量', 'Signed heat'], nf(m.latent!.Q / 1000) + ' kJ'],
              [
                ['已转变质量', 'Converted mass'],
                nf(m.latent!.converted * 1000) + ' g',
              ],
              [
                ['未转变质量', 'Remaining mass'],
                nf(m.latent!.remaining * 1000) + ' g',
              ],
            ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
      <div className="phy-lab-toolbar">
        <span>THERMAL / PARTICLES & HEAT</span>
        <B zh={heatTitles[kind][0]} en={heatTitles[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={heatOptions[kind].map(([zh, en], id) => ({
          zh,
          en,
          id,
        }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          setIndex(i);
          setCustom(null);
          reset();
        }}
      />
      <label className="phy-electric-slider">
        <B zh={lim.label[0]} en={lim.label[1]} mode={mode} />
        <output>
          {nf(custom ?? heatDefault(kind, index))} {lim.unit}
        </output>
        <input
          type="range"
          min={lim.min}
          max={lim.max}
          step={lim.step}
          value={custom ?? heatDefault(kind, index)}
          aria-label={word(mode, lim.label)}
          disabled={animation.running}
          onChange={(e) => {
            setCustom(Number(e.target.value));
            reset();
          }}
        />
      </label>
      <div className="phy-circular-scenes">
        <Scene m={m} mode={mode} />
        <Relation m={m} mode={mode} />
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map(([title, value]) => (
          <LabMetric key={title[1]} mode={mode} title={title}>
            {value}
          </LabMetric>
        ))}
      </div>
      <Ledger m={m} mode={mode} />
      <p className="phy-model-note">
        <B
          zh={`物理时刻：${nf(m.time * (m.gas ? 1e9 : 1))} ${m.gas ? 'ns' : 's'}。完整过程用2.4秒展示；图中时刻与热量按当前参数计算。面积代表质量比例；粒子点是代表点，不是真实数量。`}
          en={`Physical time: ${nf(m.time * (m.gas ? 1e9 : 1))} ${m.gas ? 'ns' : 's'}. The full process is shown over 2.4 seconds. Time and heat follow current parameters. Areas encode mass; dots represent particles rather than literal counts.`}
          mode={mode}
        />
      </p>
      <details className="phy-model-note">
        <summary>
          <B
            zh="模型条件与原理来源"
            en="Model conditions and sources"
            mode={mode}
          />
        </summary>
        <p>
          <B
            zh={heatConditions[kind][0]}
            en={heatConditions[kind][1]}
            mode={mode}
          />
        </p>
        <a href={heatSources[kind]} target="_blank" rel="noreferrer">
          <B
            zh="原理延伸 · OpenStax"
            en="Explore the principle · OpenStax"
            mode={mode}
          />
        </a>
      </details>
      <label className="phy-electric-slider">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{nf(progress * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="2.5"
          value={progress * 100}
          aria-label={word(mode, ['检查进度', 'Inspection progress'])}
          disabled={animation.running}
          onChange={(e) => setProbe(Number(e.target.value) / 100)}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          disabled={animation.running}
          onClick={() => {
            setProbe(null);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe motion and record" mode={mode} />
        </button>
        <button disabled={animation.running} onClick={reset}>
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；检查时刻与自由设置不代替完整观察。`}
          en={`${gate.count}/3 required comparisons complete; inspection and free settings do not replace full observation.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table">
          <table>
            <caption>
              <B
                zh="完整观察的模型记录"
                en="Fully observed model records"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="规定比较" en="Required comparison" mode={mode} />
                </th>
                <th>
                  <B zh="读数与检查" en="Readings and checks" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.index}>
                  <td>
                    {heatOptions[kind][r.index]![0] ===
                    heatOptions[kind][r.index]![1] ? (
                      heatOptions[kind][r.index]![0]
                    ) : (
                      <B
                        zh={heatOptions[kind][r.index]![0]}
                        en={heatOptions[kind][r.index]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  <td>{r.reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
