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
import {
  interactionParameters,
  interactionReading,
  interactionSample,
  interactionRecord,
  interactionTitles,
  interactionOptions,
  interactionLimits,
  interactionDefault,
  interactionConditions,
  interactionSources,
  diffractionAmplitude,
  type InteractionKind,
  type Pair,
} from './waveInteractionModels';
type Reading = ReturnType<typeof interactionReading>;
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const path = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
const palette = ['#a2bec3', '#bba4cf', '#efd28e'];
const curve = (
  fn: (x: number) => number,
  min: number,
  max: number,
  X: (x: number) => number,
  Y: (y: number) => number,
) =>
  path(
    Array.from({ length: 241 }, (_, i) => {
      const x = min + ((max - min) * i) / 240;
      return [X(x), Y(fn(x))];
    }),
  );
// Intersections of an infinite phase front a*x+b*y=d with a rectangular window.
function phaseLine(
  a: number,
  b: number,
  d: number,
  ymin: number,
  ymax: number,
) {
  const candidates: [number, number][] = [];
  for (const x of [-4.6, 4.6])
    if (Math.abs(b) > 1e-9) {
      const y = (d - a * x) / b;
      if (y >= ymin - 1e-9 && y <= ymax + 1e-9) candidates.push([x, y]);
    }
  for (const y of [ymin, ymax])
    if (Math.abs(a) > 1e-9) {
      const x = (d - b * y) / a;
      if (x >= -4.6 - 1e-9 && x <= 4.6 + 1e-9) candidates.push([x, y]);
    }
  return candidates.length < 2
    ? null
    : `M${310 + 48 * candidates[0]![0]} ${200 + 48 * candidates[0]![1]}L${310 + 48 * candidates[1]![0]} ${200 + 48 * candidates[1]![1]}`;
}
function Pattern({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const X = (x: number) => 70 + (480 * x) / m.length,
    Y = (u: number) => 210 - 3000 * u,
    response = m.probeAmplitude * Math.cos(2 * Math.PI * m.time);
  return (
    <svg
      viewBox="0 0 620 400"
      role="img"
      aria-label={word(mode, [
        '波的边界与叠加场景',
        'Wave boundary and superposition scene',
      ])}
    >
      <text x="25" y="35">
        t={nf(m.time)} s
      </text>
      <text x="310" y="65" textAnchor="middle">
        {word(
          mode,
          m.kind === 'refraction'
            ? [
                '灰：入射；蓝：透射波面',
                'Grey: incident; blue: transmitted fronts',
              ]
            : m.kind === 'diffraction'
              ? [
                  '远场角度分布，不是空间轨迹',
                  'Far-field angles, not spatial paths',
                ]
              : [
                  '蓝+紫=黄；虚线为分量',
                  'Blue + purple = gold; dashed components',
                ],
        )}
      </text>
      {m.kind === 'refraction' ? (
        <>
          {[0, 1].map((side) =>
            Array.from({ length: 17 }, (_, j) => {
              const angle = side ? m.refraction : m.incidence,
                speed = side ? 2 * m.ratio : 2,
                d = speed * (m.time + j - 8),
                line = phaseLine(
                  Math.sin(angle),
                  Math.cos(angle),
                  d,
                  side ? 0 : -2.2,
                  side ? 2.2 : 0,
                );
              return line ? (
                <path
                  key={`${side}-${j}`}
                  d={line}
                  fill="none"
                  stroke={side ? palette[0] : '#91a1a7'}
                  strokeWidth="2"
                />
              ) : null;
            }),
          )}
          <path
            d="M85 200H535M310 80V320"
            stroke="#bba4cf"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d={`M${310 - 100 * Math.sin(m.incidence)} ${200 - 100 * Math.cos(m.incidence)}L310 200L${310 + 100 * Math.sin(m.refraction)} ${200 + 100 * Math.cos(m.refraction)}`}
            stroke={palette[2]}
            strokeWidth="3"
            fill="none"
          />
          <g
            transform={
              'translate(' +
              (310 + 100 * Math.sin(m.refraction)) +
              ' ' +
              (200 + 100 * Math.cos(m.refraction)) +
              ') rotate(' +
              (-m.refraction * 180) / Math.PI +
              ')'
            }
          >
            <path
              d="M-5 -8L0 0L5 -8"
              fill="none"
              stroke={palette[2]}
              strokeWidth="3"
            />
          </g>
          <text x="30" y="350">
            i={nf(m.value)}°
          </text>
          <text x="260" y="350">
            r={nf((m.refraction * 180) / Math.PI)}°
          </text>
          <text x="310" y="385" textAnchor="middle">
            {word(mode, [
              '两角都从法线量；法线为竖直虚线',
              'Both angles from the vertical normal',
            ])}
          </text>
        </>
      ) : m.kind === 'diffraction' ? (
        <>
          <path
            d={`M130 95V${200 - 8 * m.ratio}M130 ${200 + 8 * m.ratio}V305`}
            stroke="#bba4cf"
            strokeWidth="8"
          />
          {Array.from({ length: 31 }, (_, i) => {
            const deg = -75 + 5 * i,
              angle = (deg * Math.PI) / 180,
              I = diffractionAmplitude(m.ratio, deg) ** 2;
            return (
              <path
                key={deg}
                d={`M150 200L${150 + 145 * Math.cos(angle)} ${200 + 145 * Math.sin(angle)}`}
                stroke={palette[0]}
                opacity={I}
                strokeWidth="3"
              />
            );
          })}
          <path
            d={`M150 200L${150 + 145 * Math.cos(Math.PI / 6)} ${200 + 145 * Math.sin(Math.PI / 6)}`}
            stroke={palette[2]}
            strokeDasharray="4 4"
            fill="none"
          />
          <circle
            cx="410"
            cy="200"
            r={2 + 12 * Math.abs(response)}
            fill={
              Math.abs(response) < 1e-8
                ? '#91a1a7'
                : response > 0
                  ? palette[2]
                  : palette[1]
            }
          />
          <text x="410" y="245" textAnchor="middle">
            u/A={nf(response)}
          </text>
          <text x="310" y="350" textAnchor="middle">
            {word(mode, ['黄虚线：30°探针', 'Gold dashed ray: 30° probe'])}
          </text>
          <text x="310" y="385" textAnchor="middle">
            a/λ={nf(m.ratio)} ·{' '}
            {word(mode, ['圆点：瞬时响应', 'Dot: instantaneous response'])}
          </text>
        </>
      ) : (
        <>
          <path d="M70 210H550" stroke="#91a1a7" strokeDasharray="4 4" />
          {[0, 1, 2].map((j) => (
            <path
              key={j}
              d={curve(
                (x) => {
                  const s = interactionSample(m, x, m.time);
                  return j === 0 ? s.first : j === 1 ? s.second : s.u;
                },
                0,
                m.length,
                X,
                Y,
              )}
              fill="none"
              stroke={palette[j]}
              strokeWidth={j === 2 ? 3 : 2}
              strokeDasharray={j < 2 ? '6 4' : undefined}
            />
          ))}
          {m.kind === 'standing' ? (
            <>
              {[1, -1].map((sign) => (
                <path
                  key={sign}
                  d={curve(
                    (x) =>
                      sign *
                      2 *
                      m.amplitude *
                      Math.abs(Math.sin((m.mode * Math.PI * x) / m.length)),
                    0,
                    m.length,
                    X,
                    Y,
                  )}
                  fill="none"
                  stroke="#91a1a7"
                  strokeDasharray="2 5"
                />
              ))}
              {Array.from({ length: m.mode + 1 }, (_, i) => (
                <circle
                  key={i}
                  cx={X((i * m.length) / m.mode)}
                  cy="210"
                  r="5"
                  fill={palette[0]}
                />
              ))}
              <path
                d="M70 155V265M550 155V265"
                stroke="#bba4cf"
                strokeWidth="5"
              />
            </>
          ) : m.kind === 'reflection' ? (
            <path d="M550 145V275" stroke="#bba4cf" strokeWidth="5" />
          ) : null}
          <circle cx={X(m.probe)} cy={Y(m.sample!.u)} r="6" fill={palette[2]} />
          <text x="70" y="305">
            0
          </text>
          <text x="550" y="305" textAnchor="end">
            {nf(m.length)} m
          </text>
          <text x="310" y="350" textAnchor="middle">
            {word(
              mode,
              m.kind === 'standing'
                ? ['蓝点：始终为零的波节', 'Blue dots: nodes are always zero']
                : m.kind === 'reflection'
                  ? [
                      '终端x=8 m；只绘制真实弦',
                      'Termination x=8 m; physical string only',
                    ]
                  : [
                      '相遇后继续传播；不是小车碰撞',
                      'Waves pass through; not cart collisions',
                    ],
            )}
          </text>
          <text x="310" y="385" textAnchor="middle">
            {word(mode, [
              '位移放大：1 m = 3000 px',
              'Displacement scale: 1 m = 3000 px',
            ])}
          </text>
        </>
      )}
    </svg>
  );
}
function TimeTrace({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const normalized = m.kind === 'refraction' || m.kind === 'diffraction',
    max = normalized ? 1.1 : 0.022;
  const X = (t: number) => 80 + (460 * t) / m.duration,
    Y = (u: number) => 200 - (100 * u) / max;
  const fn = (t: number) =>
    m.kind === 'refraction'
      ? Math.cos(2 * Math.PI * t)
      : m.kind === 'diffraction'
        ? m.probeAmplitude * Math.cos(2 * Math.PI * t)
        : interactionSample(m, m.probe, t).u;
  return (
    <svg
      viewBox="0 0 620 400"
      role="img"
      aria-label={word(mode, [
        '固定探针的时间记录',
        'Time record at a fixed probe',
      ])}
    >
      <text x="310" y="35" textAnchor="middle">
        {word(mode, ['固定探针的时间记录', 'Time record at a fixed probe'])}
      </text>
      <text x="25" y="70">
        {normalized ? 'u/A' : 'u / m'}
      </text>
      <path d="M80 90V300H540M80 200H540" stroke="#91a1a7" fill="none" />
      <text x="65" y="108" textAnchor="end">
        {nf(max)}
      </text>
      <text x="65" y="205" textAnchor="end">
        0
      </text>
      <text x="65" y="298" textAnchor="end">
        {nf(-max)}
      </text>
      <path
        d={curve(fn, 0, m.duration, X, Y)}
        fill="none"
        stroke="#91a1a7"
        strokeWidth="2"
      />
      <path
        d={curve(fn, 0, m.time, X, Y)}
        fill="none"
        stroke={palette[2]}
        strokeWidth="3"
      />
      <circle cx={X(m.time)} cy={Y(fn(m.time))} r="5" fill={palette[2]} />
      <text x="80" y="325">
        0
      </text>
      <text x="540" y="325" textAnchor="end">
        {m.duration} s
      </text>
      <text x="310" y="370" textAnchor="middle">
        {m.kind === 'diffraction'
          ? 'θ=30°'
          : m.kind === 'refraction'
            ? word(mode, ['界面处：同一频率', 'At interface: one frequency'])
            : `x=${nf(m.probe)} m`}
      </text>
    </svg>
  );
}
function Relation({ m, mode }: { m: Reading; mode: LanguageMode }) {
  if (m.kind === 'interference')
    return (
      <svg
        viewBox="0 0 620 330"
        role="img"
        aria-label={word(mode, [
          '相遇时的完整能量账',
          'Complete energy ledger during overlap',
        ])}
      >
        <text x="310" y="35" textAnchor="middle">
          {word(mode, [
            '此刻：动能与弹性势能',
            'This moment: kinetic and strain energy',
          ])}
        </text>
        {[
          ['K', m.energy!.kinetic, 100],
          ['U', m.energy!.potential, 195],
        ].map(([label, value, y]) => (
          <g key={label}>
            <text x="80" y={Number(y) - 15}>
              {label}={nf(Number(value) * 1e6)} µJ
            </text>
            <rect
              x="80"
              y={y}
              width={(460 * Number(value) * 1e6) / 600}
              height="24"
              rx="5"
              fill={label === 'K' ? palette[2] : palette[1]}
            />
          </g>
        ))}
        <text x="80" y="280">
          K+U={nf(m.energy!.total * 1e6)} µJ
        </text>
        <text x="540" y="315" textAnchor="end">
          {word(mode, [
            '共用尺：600 µJ = 460 px',
            'Shared scale: 600 µJ = 460 px',
          ])}
        </text>
      </svg>
    );
  const title: Pair =
    m.kind === 'reflection'
      ? ['反射的能量比例', 'Reflected energy fraction']
      : m.kind === 'refraction'
        ? ['两角从法线量', 'Both angles from the normal']
        : m.kind === 'diffraction'
          ? ['平均强度与观察角', 'Mean intensity by observation angle']
          : ['同波速，改变弦长', 'Same wave speed; change length'];
  const xmin =
    m.kind === 'reflection'
      ? -1
      : m.kind === 'diffraction'
        ? -75
        : m.kind === 'standing'
          ? 3
          : 0;
  const xmax =
    m.kind === 'reflection'
      ? 1
      : m.kind === 'diffraction'
        ? 75
        : m.kind === 'standing'
          ? 9
          : 35;
  const ymax = m.kind === 'refraction' ? 65 : m.kind === 'standing' ? 1.5 : 1;
  const X = (x: number) => 80 + (460 * (x - xmin)) / (xmax - xmin),
    Y = (y: number) => 250 - (160 * y) / ymax;
  const fn = (x: number) =>
    m.kind === 'reflection'
      ? x * x
      : m.kind === 'refraction'
        ? (Math.asin(m.ratio * Math.sin((x * Math.PI) / 180)) * 180) / Math.PI
        : m.kind === 'diffraction'
          ? diffractionAmplitude(m.ratio, x) ** 2
          : (m.mode * 3) / (2 * x);
  const selected =
    m.kind === 'reflection'
      ? m.ratio
      : m.kind === 'refraction'
        ? m.value
        : m.kind === 'diffraction'
          ? 30
          : m.length;
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="65">
        {m.kind === 'reflection'
          ? 'R'
          : m.kind === 'refraction'
            ? 'r / °'
            : m.kind === 'diffraction'
              ? 'I/I₀'
              : 'f / Hz'}
      </text>
      <path d="M80 85V250H540" stroke="#91a1a7" fill="none" />
      <text x="65" y="100" textAnchor="end">
        {ymax}
      </text>
      <text x="65" y="255" textAnchor="end">
        0
      </text>
      <text x="80" y="280">
        {xmin}
      </text>
      <text x="540" y="280" textAnchor="end">
        {xmax}
      </text>
      {m.kind === 'standing' ? (
        [1, 2, 3].map((n) => (
          <path
            key={n}
            d={curve((x) => (n * 3) / (2 * x), xmin, xmax, X, Y)}
            fill="none"
            stroke={n === m.mode ? palette[2] : '#91a1a7'}
            strokeWidth="2"
          />
        ))
      ) : (
        <path
          d={curve(fn, xmin, xmax, X, Y)}
          fill="none"
          stroke={palette[1]}
          strokeWidth="2"
        />
      )}
      <circle cx={X(selected)} cy={Y(fn(selected))} r="5" fill={palette[2]} />
      <text x="540" y="315" textAnchor="end">
        {m.kind === 'reflection'
          ? 'r'
          : m.kind === 'refraction'
            ? 'i / °'
            : m.kind === 'diffraction'
              ? 'θ / °'
              : 'L / m'}
      </text>
    </svg>
  );
}
export function WaveInteractionLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: InteractionKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<{ index: number; reading: string }[]>([]);
  const p = interactionParameters(kind, index, custom),
    canonical = custom === null,
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (!canonical) return;
    gate.record(String(index));
    setRecords((old) =>
      [
        ...old.filter((r) => r.index !== index),
        { index, reading: interactionRecord(p) },
      ].sort((a, b) => a.index - b.index),
    );
  });
  const progress = probe ?? animation.time / 2.4,
    m = interactionReading(p, progress),
    lim = interactionLimits[kind];
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: [Pair, string][] =
    kind === 'reflection'
      ? [
          [['反射系数r', 'Reflection coefficient r'], nf(p.ratio)],
          [['反射能量比例R', 'Reflected energy fraction R'], nf(p.ratio ** 2)],
          [['终端吸收比例', 'Absorbed fraction'], nf(1 - p.ratio ** 2)],
          [['探针位移u₆', 'Probe displacement u₆'], `${nf(m.sample!.u)} m`],
        ]
      : kind === 'refraction'
        ? [
            [['入射角i', 'Incidence angle i'], `${nf(p.value)}°`],
            [
              ['折射角r', 'Refraction angle r'],
              `${nf((p.refraction * 180) / Math.PI)}°`,
            ],
            [['源频率f', 'Source frequency f'], '1 Hz'],
            [['透射波长λ₂', 'Transmitted wavelength λ₂'], `${p.index + 1} m`],
          ]
        : kind === 'diffraction'
          ? [
              [['缝宽比a/λ', 'Opening ratio a/λ'], nf(p.ratio)],
              [
                ['首暗纹角θ₁', 'First-minimum angle θ₁'],
                m.minimum === null
                  ? word(mode, ['不存在', 'None'])
                  : `${nf(m.minimum)}°`,
              ],
              [
                ['30°平均强度比', 'Mean intensity ratio at 30°'],
                nf(m.probeIntensity),
              ],
              [['缝宽a', 'Opening width a'], `${nf(p.ratio * 0.5)} m`],
            ]
          : kind === 'interference'
            ? [
                [['第二脉冲比b', 'Second-pulse ratio b'], nf(p.ratio)],
                [
                  ['中心位移u₅', 'Centre displacement u₅'],
                  `${nf(m.sample!.u)} m`,
                ],
                [
                  ['动能K', 'Kinetic energy K'],
                  `${nf(m.energy!.kinetic * 1e6)} µJ`,
                ],
                [
                  ['总能量K+U', 'Total energy K+U'],
                  `${nf(m.energy!.total * 1e6)} µJ`,
                ],
              ]
            : [
                [
                  ['本征频率f', 'Normal-mode frequency f'],
                  `${nf(p.frequency)} Hz`,
                ],
                [['波长λ', 'Wavelength λ'], `${nf(p.wavelength)} m`],
                [
                  ['波节总数（含两端）', 'Nodes including both ends'],
                  String(p.mode + 1),
                ],
                [['波腹数', 'Antinodes'], String(p.mode)],
              ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
      <div className="phy-lab-toolbar">
        <span>WAVES / INTERACTIONS</span>
        <B
          zh={interactionTitles[kind][0]}
          en={interactionTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={interactionOptions[kind].map(([zh, en], id) => ({
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
          {nf(custom ?? interactionDefault(kind, index))} {lim.unit}
        </output>
        <input
          type="range"
          min={lim.min}
          max={lim.max}
          step={lim.step}
          value={custom ?? interactionDefault(kind, index)}
          aria-label={word(mode, lim.label)}
          disabled={animation.running}
          onChange={(e) => {
            setCustom(Number(e.target.value));
            reset();
          }}
        />
      </label>
      <div className="phy-circular-scenes">
        <Pattern m={m} mode={mode} />
        <TimeTrace m={m} mode={mode} />
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map(([title, value]) => (
          <LabMetric key={title[1]} mode={mode} title={title}>
            {value}
          </LabMetric>
        ))}
      </div>
      <Relation m={m} mode={mode} />
      <p className="phy-model-note">
        <B
          zh={`模型时长${p.duration} s，播放2.4秒。灰线显示完整时间窗；黄线记录已播放部分。空间图与时间图的坐标不能互换。`}
          en={`Model duration ${p.duration} s; playback 2.4 seconds. Grey shows the full time window; gold shows elapsed time. Spatial and temporal coordinates differ.`}
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
            zh={interactionConditions[kind][0]}
            en={interactionConditions[kind][1]}
            mode={mode}
          />
        </p>
        <a href={interactionSources[kind]} target="_blank" rel="noreferrer">
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
                    {interactionOptions[kind][r.index]![0] ===
                    interactionOptions[kind][r.index]![1] ? (
                      interactionOptions[kind][r.index]![0]
                    ) : (
                      <B
                        zh={interactionOptions[kind][r.index]![0]}
                        en={interactionOptions[kind][r.index]![1]}
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
