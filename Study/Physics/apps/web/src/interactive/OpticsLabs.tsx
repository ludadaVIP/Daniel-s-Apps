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
  opticsParameters,
  opticsReading,
  opticsRecord,
  opticsTitles,
  opticsOptions,
  opticsLimits,
  opticsDefault,
  opticsConditions,
  opticsSources,
  lightSpeed,
  lightInterface,
  reflectedDirection,
  mirrorRays,
  fibreRay,
  type OpticsKind,
  type Pair,
  type OpticalSegment,
} from './opticsModels';
type Reading = ReturnType<typeof opticsReading>;
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const gold = '#efd28e',
  blue = '#a2bec3',
  purple = '#bba4cf',
  grey = '#91a1a7';
const path = (points: [number, number][]) =>
  points.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ');
const curve = (
  fn: (x: number) => number,
  min: number,
  max: number,
  X: (x: number) => number,
  Y: (y: number) => number,
) =>
  path(
    Array.from({ length: 401 }, (_, i) => {
      const x = min + ((max - min) * i) / 400;
      return [X(x), Y(fn(x))];
    }),
  );
function Scene({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const fibre = m.kind === 'fibre',
    index = m.kind === 'index',
    scale = fibre ? 125 : m.kind === 'mirror' ? 90 : 85;
  const X = (x: number) =>
      fibre ? 60 + 125 * x : index ? 150 + 240 * x : 310 + scale * x,
    Y = (y: number) => 210 - scale * y;
  const line = (s: OpticalSegment) =>
    'M' + X(s.from.x) + ' ' + Y(s.from.y) + 'L' + X(s.to.x) + ' ' + Y(s.to.y);
  const title: Pair =
    m.kind === 'mirror'
      ? [
          '实线传光；虚线只延长方向',
          'Solid rays carry light; dashed extensions do not',
        ]
      : fibre
        ? [
            '灰线标方向；能量读数另记',
            'Grey marks direction; energy is read separately',
          ]
        : index
          ? [
              '法向入射：不转弯，也能变慢',
              'Normal entry: slower without turning',
            ]
          : [
              '角从法线量，不从界面量',
              'Angles from the normal, not the surface',
            ];
  return (
    <svg viewBox="0 0 620 400" role="img" aria-label={word(mode, title)}>
      <text x="25" y="35">
        t={nf(m.timeNS)} ns
      </text>
      <text x="310" y="65" textAnchor="middle">
        {word(mode, title)}
      </text>
      {fibre ? (
        <>
          <rect
            x="60"
            y="97.5"
            width="500"
            height="225"
            fill={purple}
            opacity=".08"
          />
          <rect
            x="60"
            y="172.5"
            width="500"
            height="75"
            fill={blue}
            opacity=".18"
          />
          <path
            d="M60 172.5H560M60 247.5H560"
            stroke={purple}
            strokeWidth="2"
          />
          <text x="80" y="135">
            n_clad=1.45
          </text>
          <text x="80" y="285">
            n_core=1.5
          </text>
        </>
      ) : index ? (
        <>
          <rect
            x="150"
            y="140"
            width={240 * m.value}
            height="140"
            fill={purple}
            opacity=".2"
          />
          <path
            d={'M150 140V280M' + X(m.value) + ' 140V280'}
            stroke={purple}
            strokeWidth="2"
          />
          <text x="310" y="115" textAnchor="middle">
            n={m.n2} · L={nf(m.value)} m
          </text>
        </>
      ) : m.kind === 'mirror' ? (
        <>
          <path d="M310 129V291" stroke={purple} strokeWidth="5" />
          {m.mirror!.rays.map((r, i) => (
            <path
              key={i}
              d={
                'M' +
                X(r.q.x) +
                ' ' +
                Y(r.q.y) +
                'L' +
                X(m.mirror!.image.x) +
                ' ' +
                Y(m.mirror!.image.y)
              }
              fill="none"
              stroke={purple}
              strokeDasharray="5 5"
            />
          ))}
          {[m.mirror!.object, m.mirror!.image].map((p, i) => (
            <path
              key={i}
              d={'M' + X(p.x) + ' ' + Y(0) + 'V' + Y(p.y) + 'l-5 7m5-7l5 7'}
              stroke={i ? purple : gold}
              strokeWidth="3"
              fill="none"
              strokeDasharray={i ? '5 4' : undefined}
            />
          ))}
          {m.mirror!.rays.map((r, i) => (
            <circle key={i} cx={X(r.eye.x)} cy={Y(r.eye.y)} r="5" fill={blue} />
          ))}
        </>
      ) : m.kind === 'reflection' ? (
        <>
          <path
            d={
              'M' +
              X(-1.7 * m.reflection!.normal.y) +
              ' ' +
              Y(1.7 * m.reflection!.normal.x) +
              'L' +
              X(1.7 * m.reflection!.normal.y) +
              ' ' +
              Y(-1.7 * m.reflection!.normal.x)
            }
            stroke={purple}
            strokeWidth="4"
          />
          <path
            d={
              'M' +
              X(-1.5 * m.reflection!.normal.x) +
              ' ' +
              Y(-1.5 * m.reflection!.normal.y) +
              'L' +
              X(1.5 * m.reflection!.normal.x) +
              ' ' +
              Y(1.5 * m.reflection!.normal.y)
            }
            stroke={blue}
            strokeDasharray="4 4"
          />
        </>
      ) : (
        <>
          <rect
            x="75"
            y="90"
            width="470"
            height="120"
            fill={blue}
            opacity=".08"
          />
          <rect
            x="75"
            y="210"
            width="470"
            height="120"
            fill={purple}
            opacity=".12"
          />
          <path
            d="M75 210H545M310 80V330"
            stroke={grey}
            strokeDasharray="4 4"
          />
          <text x="85" y="120">
            n₁={m.n1}
          </text>
          <text x="85" y="305">
            n₂={m.n2}
          </text>
          {m.interfaceReading!.state === 'critical' && (
            <path d="M310 210H420" stroke={purple} strokeDasharray="4 4" />
          )}
        </>
      )}
      {m.paths.map((segments, j) => (
        <g key={j}>
          {segments.map((s, k) => {
            const f = Math.min(
                1,
                Math.max(0, (m.timeNS - s.startNS) / (s.endNS - s.startNS)),
              ),
              tx = s.from.x + (s.to.x - s.from.x) * f,
              ty = s.from.y + (s.to.y - s.from.y) * f;
            return (
              <g key={k}>
                <path d={line(s)} fill="none" stroke={grey} strokeWidth="1.5" />
                {f > 0 && (
                  <path
                    d={
                      'M' +
                      X(s.from.x) +
                      ' ' +
                      Y(s.from.y) +
                      'L' +
                      X(tx) +
                      ' ' +
                      Y(ty)
                    }
                    fill="none"
                    stroke={fibre && j > 0 ? purple : j > 0 ? blue : gold}
                    strokeWidth="2.5"
                  />
                )}
                <g
                  transform={
                    'translate(' +
                    X(s.to.x) +
                    ' ' +
                    Y(s.to.y) +
                    ') rotate(' +
                    (Math.atan2(
                      Y(s.to.y) - Y(s.from.y),
                      X(s.to.x) - X(s.from.x),
                    ) *
                      180) /
                      Math.PI +
                    ')'
                  }
                >
                  <path
                    d="M-7 -4L0 0L-7 4"
                    stroke={grey}
                    fill="none"
                    strokeWidth="1.5"
                  />
                </g>
              </g>
            );
          })}
          {m.cursors[j] &&
            !(fibre && j > 0 && m.cursors[j]!.arrived) &&
            !(
              m.kind === 'critical' &&
              j > 0 &&
              m.timeNS <= segments[0]!.endNS
            ) && (
              <circle
                cx={X(m.cursors[j]!.x)}
                cy={Y(m.cursors[j]!.y)}
                r="4"
                fill={fibre && j > 0 ? purple : j > 0 ? blue : gold}
              />
            )}
        </g>
      ))}
      <text x="310" y="350" textAnchor="middle">
        {word(
          mode,
          m.kind === 'mirror'
            ? [
                '黄：物；紫：虚像；蓝：观察点',
                'Gold: object; purple: image; blue: observers',
              ]
            : fibre
              ? [
                  '光导芯长4 cm；包层也可为玻璃',
                  'Core 4 cm long; cladding can also be glass',
                ]
              : index
                ? [
                    '材料内速度c₀/n；频率保持',
                    'Material speed c₀/n; frequency stays fixed',
                  ]
                : m.kind === 'reflection'
                  ? [
                      '蓝虚线：随镜面转动的法线',
                      'Blue dashed line: rotating normal',
                    ]
                  : [
                      '从介质1到2；光点是路径检查标记',
                      'Medium 1 to 2; dots inspect the ray path',
                    ],
        )}
      </text>
      <text x="310" y="385" textAnchor="middle">
        {word(
          mode,
          m.kind === 'mirror'
            ? [
                '虚像位置不随观察点上下改变',
                'Image position stays fixed as observer moves',
              ]
            : fibre
              ? [
                  '紫支路离开芯；窗口边缘不吸光',
                  'Purple exits core; window edge is not absorption',
                ]
              : m.kind === 'critical'
                ? [
                    '临界掠射方向虚画，不传法向功率',
                    'Dashed grazing limit: no normal transmitted power',
                  ]
                : [
                    '光路放慢到2.4秒；不是拍摄的光子',
                    'Ray tracing slowed to 2.4 s; not filmed photons',
                  ],
        )}
      </text>
    </svg>
  );
}
function Relation({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const min =
      m.kind === 'reflection'
        ? -10
        : m.kind === 'mirror'
          ? 0.5
          : m.kind === 'index'
            ? 0.1
            : 0,
    max =
      m.kind === 'reflection'
        ? 10
        : m.kind === 'mirror'
          ? 1.5
          : m.kind === 'index'
            ? 1
            : m.kind === 'snell'
              ? 1
              : m.kind === 'refraction'
                ? 40
                : m.kind === 'fibre'
                  ? 40
                  : 70;
  const yMin = m.kind === 'reflection' ? -20 : 0,
    yMax =
      m.kind === 'reflection'
        ? 80
        : m.kind === 'mirror'
          ? 12
          : m.kind === 'index'
            ? 5.1
            : m.kind === 'snell' || m.kind === 'fibre'
              ? 1
              : 90;
  const X = (x: number) => 80 + (460 * (x - min)) / (max - min),
    Y = (y: number) => 250 - (160 * (y - yMin)) / (yMax - yMin);
  const fn = (x: number) =>
    m.kind === 'reflection'
      ? reflectedDirection([0, 30, 60][m.index]!, x).bearing
      : m.kind === 'mirror'
        ? mirrorRays(x, m.value).rays[0]!.arrivalNS
        : m.kind === 'index'
          ? ((m.n2 * x) / lightSpeed) * 1e9
          : m.kind === 'snell'
            ? x / m.n2
            : m.kind === 'fibre'
              ? fibreRay(x).retained
              : (lightInterface(m.n1, m.n2, x).transmitted ?? 90);
  const chosen =
    m.kind === 'mirror'
      ? -m.mirror!.object.x
      : m.kind === 'snell'
        ? m.interfaceReading!.sinIncident
        : m.value;
  const title: Pair =
    m.kind === 'reflection'
      ? ['镜子转1°，出射转2°', 'Mirror turns 1°; outgoing ray turns 2°']
      : m.kind === 'mirror'
        ? ['真实到达时间与物距', 'Real arrival time by object distance']
        : m.kind === 'index'
          ? ['材料段行时与长度', 'Slab transit time by length']
          : m.kind === 'snell'
            ? [
                '正弦图是直线，角度图不一定',
                'Sines form a line; angles need not',
              ]
            : m.kind === 'fibre'
              ? [
                  '芯末端能量比例与轴向角',
                  'Core-exit energy fraction by axial angle',
                ]
              : ['折射方向与入射角', 'Transmitted direction by incidence'];
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="65">
        {m.kind === 'reflection'
          ? 'bearing / °'
          : m.kind === 'mirror' || m.kind === 'index'
            ? 't / ns'
            : m.kind === 'snell'
              ? 'sin r'
              : m.kind === 'fibre'
                ? 'E_core/E₀'
                : 'r / °'}
      </text>
      <path d="M80 85V250H540" stroke={grey} fill="none" />
      <text x="65" y="100" textAnchor="end">
        {yMax}
      </text>
      <text x="65" y="255" textAnchor="end">
        {yMin}
      </text>
      <text x="80" y="280">
        {min}
      </text>
      <text x="540" y="280" textAnchor="end">
        {max}
      </text>
      {m.kind === 'critical' && (
        <path
          d={'M' + X(m.interfaceReading!.critical!) + ' 85V250'}
          stroke={blue}
          strokeDasharray="4 4"
        />
      )}
      {m.kind === 'fibre' && (
        <path
          d={'M' + X(m.fibre!.criticalAxial) + ' 85V250'}
          stroke={blue}
          strokeDasharray="4 4"
        />
      )}
      <path
        d={curve(
          fn,
          min,
          m.kind === 'critical' ? m.interfaceReading!.critical! : max,
          X,
          Y,
        )}
        stroke={purple}
        strokeWidth="2"
        fill="none"
      />
      {(m.kind !== 'critical' || m.interfaceReading!.transmitted !== null) && (
        <circle cx={X(chosen)} cy={Y(fn(chosen))} r="5" fill={gold} />
      )}
      <text x="540" y="315" textAnchor="end">
        {m.kind === 'reflection'
          ? 'φ / °'
          : m.kind === 'mirror'
            ? 'd / m'
            : m.kind === 'index'
              ? 'L / m'
              : m.kind === 'snell'
                ? 'sin i'
                : m.kind === 'fibre'
                  ? 'α / °'
                  : 'i / °'}
      </text>
    </svg>
  );
}
function Ledger({ m, mode }: { m: Reading; mode: LanguageMode }) {
  if (m.kind === 'critical') {
    const X = (i: number) => 80 + (460 * i) / 70,
      Y = (R: number) => 250 - 160 * R;
    return (
      <svg
        viewBox="0 0 620 330"
        role="img"
        aria-label={word(mode, [
          '反射与透射能量比例',
          'Reflection and transmission energy fractions',
        ])}
      >
        <text x="310" y="35" textAnchor="middle">
          {word(mode, ['无损界面：R+T=1', 'Lossless boundary: R+T=1'])}
        </text>
        <text x="25" y="65">
          R, T
        </text>
        <path d="M80 85V250H540" stroke={grey} fill="none" />
        <text x="65" y="100" textAnchor="end">
          1
        </text>
        <text x="65" y="255" textAnchor="end">
          0
        </text>
        <text x="80" y="280">
          0
        </text>
        <text x="540" y="280" textAnchor="end">
          70
        </text>
        {[true, false].map((reflect) => (
          <path
            key={String(reflect)}
            d={curve(
              (i) => {
                const s = lightInterface(1.5, 1, i);
                return reflect ? s.R : s.T;
              },
              0,
              70,
              X,
              Y,
            )}
            stroke={reflect ? purple : blue}
            fill="none"
            strokeWidth="2"
          />
        ))}
        <circle
          cx={X(m.value)}
          cy={Y(m.interfaceReading!.R)}
          r="5"
          fill={gold}
        />
        <text x="80" y="315">
          {word(mode, ['紫R；蓝T', 'Purple R; blue T'])}
        </text>
        <text x="540" y="315" textAnchor="end">
          i / °
        </text>
      </svg>
    );
  }
  const labels: Pair[] =
    m.kind === 'reflection'
      ? [
          ['入射角i', 'Incidence i'],
          ['反射角r', 'Reflection r'],
        ]
      : m.kind === 'mirror'
        ? [
            ['物距d', 'Object distance d'],
            ['像距dᵢ', 'Image distance dᵢ'],
          ]
        : m.kind === 'index'
          ? [
              ['真空波长λ₀', 'Vacuum wavelength λ₀'],
              ['材料波长λ', 'Material wavelength λ'],
            ]
          : m.kind === 'fibre'
            ? [
                ['此刻仍在芯中', 'Currently in core'],
                ['已离开芯的总量', 'Total escaped from core'],
              ]
            : [
                ['n₁ sin i', 'n₁ sin i'],
                ['n₂ sin r', 'n₂ sin r'],
              ];
  const values =
    m.kind === 'reflection'
      ? [m.reflection!.incidence, m.reflection!.incidence]
      : m.kind === 'mirror'
        ? [-m.mirror!.object.x, m.mirror!.image.x]
        : m.kind === 'index'
          ? [600, m.wavelengthNM]
          : m.kind === 'fibre'
            ? [m.retained, m.escaped]
            : [
                m.n1 * m.interfaceReading!.sinIncident,
                m.n2 * m.interfaceReading!.sinTransmitted!,
              ];
  const max =
      m.kind === 'reflection'
        ? 70
        : m.kind === 'mirror'
          ? 1.5
          : m.kind === 'index'
            ? 600
            : 1,
    unit =
      m.kind === 'reflection'
        ? '°'
        : m.kind === 'mirror'
          ? 'm'
          : m.kind === 'index'
            ? 'nm'
            : '';
  const title: Pair =
    m.kind === 'fibre'
      ? ['分流后，完整记能量账', 'Keep the full energy ledger after splitting']
      : m.kind === 'index'
        ? ['同一频率，换一把波长尺', 'One frequency; compare wavelength rulers']
        : ['在同一把尺上核对', 'Check quantities on one shared ruler'];
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      {values.map((v, i) => (
        <g key={i}>
          <text x="80" y={95 + i * 100}>
            {word(mode, labels[i]!)}=
            {m.kind === 'fibre' ? waveNumber(v) : nf(v)} {unit}
          </text>
          <rect
            x="80"
            y={110 + i * 100}
            width={(460 * v) / max}
            height="24"
            rx="4"
            fill={i ? purple : gold}
          />
        </g>
      ))}
      <text x="310" y="295" textAnchor="middle">
        {word(
          mode,
          m.kind === 'fibre'
            ? ['未算成吸收；芯+漏出=1', 'Not absorption; core + escaped = 1']
            : m.kind === 'index'
              ? [
                  '波长尺用nm；空间光路尺用m',
                  'Wavelength ruler: nm; ray-space ruler: m',
                ]
              : [
                  '两行共用刻度，不自动缩放',
                  'Both rows share one scale without rescaling',
                ],
        )}
      </text>
    </svg>
  );
}
export function OpticsLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: OpticsKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<{ index: number; reading: string }[]>([]);
  const p = opticsParameters(kind, index, custom),
    canonical = custom === null,
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (!canonical) return;
    gate.record(String(index));
    setRecords((old) =>
      [
        ...old.filter((r) => r.index !== index),
        { index, reading: opticsRecord(p) },
      ].sort((a, b) => a.index - b.index),
    );
  });
  const progress = probe ?? animation.time / 2.4,
    m = opticsReading(p, progress),
    lim = opticsLimits[kind];
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: [Pair, string][] =
    kind === 'reflection'
      ? [
          [['入射角i', 'Incidence i'], nf(m.reflection!.incidence) + '°'],
          [['反射角r', 'Reflection r'], nf(m.reflection!.incidence) + '°'],
          [['镜面转角φ', 'Mirror rotation φ'], nf(p.value) + '°'],
          [['出射方位角', 'Outgoing bearing'], nf(m.reflection!.bearing) + '°'],
        ]
      : kind === 'mirror'
        ? [
            [['物距d', 'Object distance d'], nf(-m.mirror!.object.x) + ' m'],
            [['像距dᵢ', 'Image distance dᵢ'], nf(m.mirror!.image.x) + ' m'],
            [
              ['物与像间距', 'Object–image separation'],
              nf(2 * m.mirror!.image.x) + ' m',
            ],
            [
              ['首观察点到达', 'First observer arrival'],
              nf(m.mirror!.rays[0]!.arrivalNS) + ' ns',
            ],
          ]
        : kind === 'refraction'
          ? [
              [['入射介质n₁', 'Incident medium n₁'], String(p.n1)],
              [['透射介质n₂', 'Transmitting medium n₂'], String(p.n2)],
              [['入射角i', 'Incidence i'], nf(p.incidence) + '°'],
              [
                ['折射角r', 'Refraction r'],
                nf(m.interfaceReading!.transmitted!) + '°',
              ],
            ]
          : kind === 'snell'
            ? [
                [['入射角i', 'Incidence i'], nf(p.incidence) + '°'],
                [
                  ['折射角r', 'Refraction r'],
                  nf(m.interfaceReading!.transmitted!) + '°',
                ],
                [
                  ['由角推回n₂', 'Index n₂ inferred from angles'],
                  m.inferredIndex === null ? '—' : nf(m.inferredIndex),
                ],
                [['已知入射n₁', 'Known incident n₁'], '1'],
              ]
            : kind === 'index'
              ? [
                  [['材料折射率n', 'Material index n'], String(p.n2)],
                  [
                    ['材料中速度v', 'Speed v in material'],
                    waveNumber(lightSpeed / p.n2) + ' m/s',
                  ],
                  [
                    ['材料波长λ', 'Material wavelength λ'],
                    nf(m.wavelengthNM) + ' nm',
                  ],
                  [
                    ['比同长真空多用', 'Extra time over equal vacuum length'],
                    nf(m.extraDelayNS!) + ' ns',
                  ],
                ]
              : kind === 'critical'
                ? [
                    [['入射角i', 'Incidence i'], nf(p.incidence) + '°'],
                    [
                      ['临界角θ_c', 'Critical angle θ_c'],
                      nf(m.interfaceReading!.critical!) + '°',
                    ],
                    [
                      ['传播折射角r', 'Propagating refraction r'],
                      m.interfaceReading!.transmitted === null
                        ? '—'
                        : nf(m.interfaceReading!.transmitted) + '°',
                    ],
                    [
                      ['法向透射比例T', 'Normal transmitted fraction T'],
                      nf(m.interfaceReading!.T),
                    ],
                  ]
                : [
                    [
                      ['芯内轴向角α', 'Internal axial angle α'],
                      nf(p.value) + '°',
                    ],
                    [
                      ['侧壁入射角i', 'Side-wall incidence i'],
                      p.value === 0 ? '—' : nf(90 - p.value) + '°',
                    ],
                    [
                      ['已到达侧壁次数', 'Wall hits reached'],
                      String(m.bounces),
                    ],
                    [
                      ['此刻芯内能量比例', 'Current core energy fraction'],
                      waveNumber(m.retained),
                    ],
                  ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
      <div className="phy-lab-toolbar">
        <span>LIGHT / GEOMETRIC OPTICS</span>
        <B zh={opticsTitles[kind][0]} en={opticsTitles[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={opticsOptions[kind].map(([zh, en], id) => ({
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
          {nf(custom ?? opticsDefault(kind, index))} {lim.unit}
        </output>
        <input
          type="range"
          min={lim.min}
          max={lim.max}
          step={lim.step}
          value={custom ?? opticsDefault(kind, index)}
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
          zh={`光路时长${nf(p.durationNS)} ns，放慢为2.4秒。灰线给出完整方向，彩色线追踪已走部分；线宽与光点亮度不校准能量。关系图是完整模型的预测，瞬时能量账随进度改变。`}
          en={`Ray duration ${nf(p.durationNS)} ns, slowed to 2.4 seconds. Grey gives full directions; colour traces elapsed travel. Width and cursor brightness do not calibrate energy. Relation curves predict the full model; instantaneous energy follows progress.`}
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
            zh={opticsConditions[kind][0]}
            en={opticsConditions[kind][1]}
            mode={mode}
          />
        </p>
        <a href={opticsSources[kind]} target="_blank" rel="noreferrer">
          <B
            zh="原理延伸 · OpenStax"
            en="Explore the principle · OpenStax"
            mode={mode}
          />
        </a>
        {(kind === 'critical' || kind === 'fibre') && (
          <p>
            <a
              href="https://ocw.mit.edu/courses/6-007-electromagnetic-energy-from-motors-to-lasers-spring-2011/resources/mit6_007s11_lec33/"
              target="_blank"
              rel="noreferrer"
            >
              <B
                zh="能量系数延伸 · MIT OCW"
                en="Energy coefficients · MIT OCW"
                mode={mode}
              />
            </a>
          </p>
        )}
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
                    {opticsOptions[kind][r.index]![0] ===
                    opticsOptions[kind][r.index]![1] ? (
                      opticsOptions[kind][r.index]![0]
                    ) : (
                      <B
                        zh={opticsOptions[kind][r.index]![0]}
                        en={opticsOptions[kind][r.index]![1]}
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
