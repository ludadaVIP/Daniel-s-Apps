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
import { ShortTone } from './ShortTone';
import { nf } from './newtonModels';
import { waveNumber } from './waveModels';
import {
  acousticParameters,
  acousticReading,
  acousticRecord,
  acousticTitles,
  acousticOptions,
  acousticLimits,
  acousticDefault,
  acousticConditions,
  acousticSources,
  soundPacket,
  forcedResponse,
  columnSample,
  dopplerReading,
  echoReading,
  echoEnvelope,
  ultrasoundReading,
  ultrasoundEnvelope,
  pressureLevel,
  type AcousticKind,
  type Pair,
} from './acousticModels';
type Reading = ReturnType<typeof acousticReading>;
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
  samples = 400,
) =>
  path(
    Array.from({ length: samples + 1 }, (_, i) => {
      const x = min + ((max - min) * i) / samples;
      return [X(x), Y(fn(x))];
    }),
  );
function Scene({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const X = (x: number) => 70 + 160 * x;
  const label: Pair =
    m.kind === 'propagation'
      ? ['点是介质；颜色是声压正负', 'Dots: medium; colour: pressure sign']
      : m.kind === 'columns'
        ? ['空气沿管运动；开端声压为零', 'Air moves along tube; open-end p′=0']
        : m.kind === 'doppler'
          ? [
              '圆心在每个波峰发出的旧位置',
              'Each centre stays at its emission position',
            ]
          : m.kind === 'echo'
            ? ['黄点是脉冲前沿，不是空气', 'Gold dot: pulse front, not air']
            : m.kind === 'imaging'
              ? [
                  '虚构界面；下图记录回波包络',
                  'Fictional interfaces; echo envelopes below',
                ]
              : m.kind === 'resonance'
                ? [
                    '从静止出发的受迫阻尼振子',
                    'Driven damped oscillator, initially at rest',
                  ]
                : [
                    '瞬时声压随位置；不是空气轨迹',
                    'Pressure by position; not air trajectories',
                  ];
  return (
    <svg viewBox="0 0 620 400" role="img" aria-label={word(mode, label)}>
      <text x="25" y="35">
        t=
        {nf(
          m.time *
            (m.kind === 'resonance' ? 1 : m.kind === 'imaging' ? 1e6 : 1000),
        )}{' '}
        {m.kind === 'resonance' ? 's' : m.kind === 'imaging' ? 'µs' : 'ms'}
      </text>
      <text x="310" y="65" textAnchor="middle">
        {word(mode, label)}
      </text>
      {m.kind === 'propagation' ? (
        <>
          <path d="M70 210H550" stroke={grey} strokeDasharray="4 4" />
          {m.active ? (
            Array.from({ length: 41 }, (_, i) => {
              const x = i * 0.075,
                s = soundPacket(m, x, m.time);
              return (
                <circle
                  key={i}
                  cx={X(x + s.displacement * 200000)}
                  cy="210"
                  r="4"
                  fill={
                    Math.abs(s.pressure) < 1e-9
                      ? grey
                      : s.pressure > 0
                        ? purple
                        : blue
                  }
                />
              );
            })
          ) : (
            <text x="310" y="210" textAnchor="middle">
              {word(mode, [
                '真空：没有介质振动',
                'Vacuum: no medium oscillation',
              ])}
            </text>
          )}
          <path
            d={'M' + X(m.distance) + ' 165V255'}
            stroke={gold}
            strokeDasharray="4 4"
          />
          <text x="70" y="300">
            0
          </text>
          <text x="550" y="300" textAnchor="end">
            3 m
          </text>
          <text x="310" y="350" textAnchor="middle">
            {word(mode, [
              '位移×200000；探针位置固定',
              'Displacement ×200000; fixed probe',
            ])}
          </text>
          <text x="310" y="385" textAnchor="middle">
            d={nf(m.distance)} m · {m.active ? 'p′=ρc ∂u/∂t' : 'p′=0'}
          </text>
        </>
      ) : m.kind === 'columns' ? (
        <>
          <path
            d={'M70 155H550M70 265H550' + (m.closed ? 'M70 155V265' : '')}
            fill="none"
            stroke={purple}
            strokeWidth="4"
          />
          {Array.from({ length: 31 }, (_, i) => {
            const x = (m.length * i) / 30,
              s = columnSample(m, x, m.time);
            return (
              <circle
                key={i}
                cx={70 + (480 * x) / m.length + 6 * s.displacement}
                cy="210"
                r="4"
                fill={s.pressure > 0 ? purple : blue}
              />
            );
          })}
          {[...(m.closed ? [] : [70]), 550].map((x) => (
            <circle
              key={x}
              cx={x}
              cy="210"
              r="10"
              fill="none"
              stroke={blue}
              strokeWidth="2"
            />
          ))}
          <path d="M190 170V250" stroke={gold} strokeDasharray="4 4" />
          <text x="70" y="305">
            0
          </text>
          <text x="550" y="305" textAnchor="end">
            L={nf(m.length)} m
          </text>
          <text x="310" y="350" textAnchor="middle">
            {word(mode, [
              '蓝空圈：声压波节；黄：L/4探针',
              'Blue rings: pressure nodes; gold: L/4',
            ])}
          </text>
          <text x="310" y="385" textAnchor="middle">
            {m.closed ? 'u(0)=0 · p′(L)=0' : 'p′(0)=p′(L)=0'}
          </text>
        </>
      ) : m.kind === 'doppler' ? (
        <>
          {m.doppler!.fronts.map((f) => (
            <circle
              key={f.emitted}
              cx={310 + 20 * f.centre}
              cy="210"
              r={20 * f.radius}
              stroke={blue}
              strokeWidth="2"
              fill="none"
            />
          ))}
          <circle
            cx={310 + 20 * m.doppler!.sourcePosition}
            cy="210"
            r="6"
            fill={gold}
          />
          <circle cx="410" cy="210" r="6" fill={purple} />
          <text x="100" y="350">
            {word(mode, ['黄：移动波源', 'Gold: moving source'])}
          </text>
          <text x="100" y="385">
            {word(mode, ['紫：固定接收点5 m', 'Purple: fixed receiver at 5 m'])}
          </text>
        </>
      ) : m.kind === 'echo' ? (
        <>
          <rect x="45" y="180" width="25" height="60" rx="5" fill={blue} />
          <path
            d={'M' + X(m.distance) + ' 140V280'}
            stroke={purple}
            strokeWidth="5"
          />
          <path
            d={'M70 210H' + X(m.distance)}
            stroke={grey}
            strokeDasharray="4 4"
          />
          <circle cx={X(m.echo!.front)} cy="210" r="6" fill={gold} />
          <text x="70" y="310">
            0
          </text>
          <text x="550" y="310" textAnchor="end">
            3 m
          </text>
          <text x="310" y="350" textAnchor="middle">
            d={nf(m.distance)} m · Δt=2d/c
          </text>
          <text x="310" y="385" textAnchor="middle">
            {word(
              mode,
              m.echo!.detectable
                ? ['回波在盲窗之后到达', 'Echo starts after the blind interval']
                : [
                    '回波落入盲窗：不能测距',
                    'Echo starts in blind interval: no range',
                  ],
            )}
          </text>
        </>
      ) : m.kind === 'imaging' ? (
        <>
          <rect x="45" y="180" width="25" height="60" rx="5" fill={blue} />
          <path d="M70 210H550" stroke={grey} strokeDasharray="4 4" />
          {m.ultrasound!.echoes.map((e, i) => (
            <path
              key={i}
              d={'M' + (70 + 12000 * e.depth) + ' 170V250'}
              stroke={i ? purple : gold}
              strokeWidth="4"
            />
          ))}
          <text x="310" y="130" textAnchor="middle">
            z₁=30 mm
          </text>
          <text x="310" y="285" textAnchor="middle">
            z₂={nf(30 + m.separationMM)} mm
          </text>
          <text x="70" y="325">
            0
          </text>
          <text x="550" y="325" textAnchor="end">
            40 mm
          </text>
          <text x="310" y="370" textAnchor="middle">
            {word(mode, [
              '相同弱反射；固定增益',
              'Equal weak reflectivities; fixed gain',
            ])}
          </text>
        </>
      ) : m.kind === 'resonance' ? (
        <>
          <path d="M95 120V290M95 210H155" stroke={purple} strokeWidth="4" />
          <path
            d={path(
              Array.from({ length: 15 }, (_, i) => [
                155 + ((145 + 30000 * m.response!.displacement) * i) / 14,
                210 + (i === 0 || i === 14 ? 0 : i % 2 ? 18 : -18),
              ]),
            )}
            stroke={blue}
            fill="none"
            strokeWidth="3"
          />
          <rect
            x={300 + 30000 * m.response!.displacement}
            y="175"
            width="60"
            height="70"
            rx="6"
            fill={gold}
          />
          <path d="M330 120V290" stroke={grey} strokeDasharray="4 4" />
          <text x="310" y="335" textAnchor="middle">
            x={nf(m.response!.displacement * 1000)} mm
          </text>
          <text x="310" y="375" textAnchor="middle">
            {word(mode, [
              '位移尺：1 mm=30 px',
              'Displacement scale: 1 mm=30 px',
            ])}
          </text>
        </>
      ) : (
        <>
          <path d="M70 210H550" stroke={grey} strokeDasharray="4 4" />
          <path
            d={curve(
              (x) =>
                Math.SQRT2 *
                m.rms *
                1000 *
                Math.cos(
                  2 * Math.PI * (m.frequency * m.time - x / m.wavelength),
                ),
              0,
              2,
              (x) => 70 + 240 * x,
              (y) => 210 - y * (m.kind === 'level' ? 7 : 32),
            )}
            stroke={gold}
            fill="none"
            strokeWidth="3"
          />
          <text x="70" y="325">
            0
          </text>
          <text x="550" y="325" textAnchor="end">
            2 m
          </text>
          <text x="310" y="370" textAnchor="middle">
            {word(mode, [
              '高度：声压；传播方向→',
              'Height: pressure; propagation →',
            ])}
          </text>
        </>
      )}
    </svg>
  );
}
function TimeTrace({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const positive = ['doppler', 'echo', 'imaging'].includes(m.kind);
  const max =
    m.kind === 'level'
      ? 15
      : m.kind === 'pitch' || m.kind === 'resonance'
        ? 3
        : m.kind === 'doppler'
          ? 5
          : 1.25;
  const fn = (t: number) =>
    m.kind === 'propagation'
      ? soundPacket(m, m.distance, t).pressure /
        (m.density * m.c * 1e-7 * 2 * Math.PI * m.frequency)
      : m.kind === 'resonance'
        ? forcedResponse(m.frequency, t).displacement * 1000
        : m.kind === 'columns'
          ? columnSample(m, m.length / 4, t).pressure
          : m.kind === 'doppler'
            ? dopplerReading(m, t).arrivals
            : m.kind === 'echo'
              ? echoReading(m, t).detectable
                ? echoEnvelope(t, m.echo!.roundTrip, m.echo!.pulseDuration)
                : 0
              : m.kind === 'imaging'
                ? ultrasoundEnvelope(m.frequency / 1e6, m.separationMM, t)
                : Math.SQRT2 *
                  m.rms *
                  1000 *
                  Math.cos(2 * Math.PI * m.frequency * t);
  const X = (t: number) => 80 + (460 * t) / m.duration,
    Y = (y: number) =>
      (positive ? 290 : 200) - ((positive ? 185 : 90) * y) / max;
  const title: Pair =
    m.kind === 'imaging'
      ? ['A线：两次回波的包络', 'A-line: two echo envelopes']
      : m.kind === 'echo'
        ? ['可接收回波；紫色为发射', 'Received echo; purple is transmission']
        : m.kind === 'doppler'
          ? ['固定点收到的波峰数', 'Crests reaching the fixed receiver']
          : ['固定位置的时间记录', 'Time record at a fixed position'];
  const unit =
    m.kind === 'level' || m.kind === 'pitch'
      ? 'p′ / mPa'
      : m.kind === 'resonance'
        ? 'x / mm'
        : m.kind === 'doppler'
          ? 'N'
          : m.kind === 'propagation'
            ? 'p′ / (ρcU₀ω)'
            : m.kind === 'columns'
              ? 'p′ / p̂'
              : 'A / A₀';
  return (
    <svg viewBox="0 0 620 400" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="70">
        {unit}
      </text>
      <path
        d={'M80 90V300H540M80 ' + Y(0) + 'H540'}
        stroke={grey}
        fill="none"
      />
      <text x="65" y="108" textAnchor="end">
        {max}
      </text>
      <text x="65" y={positive ? 295 : 205} textAnchor="end">
        0
      </text>
      {!positive && (
        <text x="65" y="298" textAnchor="end">
          {nf(-max)}
        </text>
      )}
      {m.kind === 'echo' && (
        <>
          <rect
            x="80"
            y="90"
            width={(460 * m.echo!.blanking) / m.duration}
            height="200"
            fill={purple}
            opacity=".2"
          />
          <path
            d={curve(
              (t) => echoEnvelope(t, 0, m.echo!.pulseDuration),
              0,
              m.duration,
              X,
              Y,
              1600,
            )}
            stroke={purple}
            fill="none"
            strokeWidth="2"
          />
        </>
      )}
      <path
        d={curve(fn, 0, m.duration, X, Y, 2000)}
        stroke={grey}
        fill="none"
        strokeWidth="2"
      />
      <path
        d={curve(fn, 0, m.time, X, Y, 2000)}
        stroke={gold}
        fill="none"
        strokeWidth="3"
      />
      <circle cx={X(m.time)} cy={Y(fn(m.time))} r="5" fill={gold} />
      <text x="80" y="325">
        0
      </text>
      <text x="540" y="325" textAnchor="end">
        {nf(
          m.duration *
            (m.kind === 'resonance' ? 1 : m.kind === 'imaging' ? 1e6 : 1000),
        )}{' '}
        {m.kind === 'resonance' ? 's' : m.kind === 'imaging' ? 'µs' : 'ms'}
      </text>
      <text x="310" y="370" textAnchor="middle">
        {word(
          mode,
          m.kind === 'columns'
            ? [
                '探针x=L/4；不是空气上下运动',
                'Probe x=L/4; not vertical air motion',
              ]
            : m.kind === 'echo'
              ? [
                  '前0.5 ms盲窗；只显示可接收回波',
                  'First 0.5 ms blanked; accepted echo only',
                ]
              : m.kind === 'imaging'
                ? [
                    '叠加包络，不是载波声压',
                    'Sum of envelopes, not carrier pressure',
                  ]
                : [
                    '灰：全窗；黄：已检查部分',
                    'Grey: full window; gold: inspected portion',
                  ],
        )}
      </text>
    </svg>
  );
}
function Relation({ m, mode }: { m: Reading; mode: LanguageMode }) {
  const lim = acousticLimits[m.kind],
    min = m.kind === 'imaging' ? 2 : lim.min,
    max = m.kind === 'imaging' ? 10 : lim.max;
  const ymax =
    m.kind === 'propagation'
      ? 9
      : m.kind === 'pitch'
        ? 5
        : m.kind === 'level'
          ? 55
          : m.kind === 'resonance'
            ? 3
            : m.kind === 'columns'
              ? 900
              : m.kind === 'doppler'
                ? 700
                : m.kind === 'echo'
                  ? 18
                  : 2;
  const fn = (x: number) =>
    m.kind === 'propagation'
      ? (1000 * x) / (m.index === 1 ? 1480 : 343)
      : m.kind === 'pitch'
        ? 1000 / x
        : m.kind === 'level'
          ? pressureLevel(x * 0.001)
          : m.kind === 'resonance'
            ? forcedResponse(x, 8).steadyAmplitude * 1000
            : m.kind === 'columns'
              ? 343 / ((m.closed ? 4 : 2) * x)
              : m.kind === 'doppler'
                ? 400 / (1 - x)
                : m.kind === 'echo'
                  ? (2000 * x) / 343
                  : ultrasoundReading(x, m.separationMM).axialFWHM * 1000;
  const X = (x: number) => 80 + (460 * (x - min)) / (max - min),
    Y = (y: number) => 250 - (160 * y) / ymax;
  const title: Pair =
    m.kind === 'propagation'
      ? ['探针距离与起始到达时刻', 'Probe distance and first arrival']
      : m.kind === 'pitch'
        ? ['更快频率，更短周期', 'Higher frequency, shorter period']
        : m.kind === 'level'
          ? ['声压级是一把对数尺', 'SPL is a logarithmic ruler']
          : m.kind === 'resonance'
            ? ['稳态幅度与推动频率', 'Steady amplitude by drive frequency']
            : m.kind === 'columns'
              ? [
                  '同波速，比较有效管长',
                  'Same sound speed; compare effective length',
                ]
              : m.kind === 'doppler'
                ? [
                    '源400 Hz；接收频率会改变',
                    'Source 400 Hz; received frequency changes',
                  ]
                : m.kind === 'echo'
                  ? ['量程从往返时间推回', 'Infer range from round-trip time']
                  : ['轴向模糊与载频', 'Axial blur by carrier frequency'];
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="65">
        {m.kind === 'propagation' || m.kind === 'pitch' || m.kind === 'echo'
          ? 't / ms'
          : m.kind === 'level'
            ? 'Lₚ / dB'
            : m.kind === 'resonance'
              ? 'A / mm'
              : m.kind === 'columns' || m.kind === 'doppler'
                ? 'f / Hz'
                : 'FWHM / mm'}
      </text>
      <path d="M80 85V250H540" stroke={grey} fill="none" />
      <text x="65" y="100" textAnchor="end">
        {ymax}
      </text>
      <text x="65" y="255" textAnchor="end">
        0
      </text>
      <text x="80" y="280">
        {min}
      </text>
      <text x="540" y="280" textAnchor="end">
        {max}
      </text>
      {m.kind === 'echo' && (
        <rect
          x="80"
          y="85"
          width={X(m.echo!.minimumRange) - 80}
          height="165"
          fill={purple}
          opacity=".2"
        />
      )}
      {m.kind === 'columns' && (
        <path
          d={curve((x) => 343 / ((m.closed ? 2 : 4) * x), min, max, X, Y)}
          stroke={grey}
          fill="none"
          strokeWidth="2"
        />
      )}
      {m.kind === 'doppler' && (
        <path
          d={'M80 ' + Y(400) + 'H540'}
          stroke={grey}
          fill="none"
          strokeDasharray="4 4"
        />
      )}
      {(m.kind !== 'propagation' || m.active) && (
        <path
          d={curve(fn, min, max, X, Y)}
          stroke={purple}
          fill="none"
          strokeWidth="2"
        />
      )}
      {(m.kind !== 'propagation' || m.active) && (
        <circle
          cx={X(m.kind === 'imaging' ? m.frequency / 1e6 : m.value)}
          cy={Y(fn(m.kind === 'imaging' ? m.frequency / 1e6 : m.value))}
          r="5"
          fill={m.kind === 'echo' && !m.echo!.detectable ? grey : gold}
        />
      )}
      <text x="540" y="315" textAnchor="end">
        {m.kind === 'propagation' || m.kind === 'echo'
          ? 'd / m'
          : m.kind === 'pitch' || m.kind === 'resonance'
            ? 'f / Hz'
            : m.kind === 'level'
              ? 'p_RMS / mPa'
              : m.kind === 'columns'
                ? 'L / m'
                : m.kind === 'doppler'
                  ? 'vₛ / c'
                  : 'f / MHz'}
      </text>
    </svg>
  );
}
export function AcousticLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: AcousticKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<{ index: number; reading: string }[]>([]);
  const p = acousticParameters(kind, index, custom),
    canonical = custom === null,
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (!canonical) return;
    gate.record(String(index));
    setRecords((old) =>
      [
        ...old.filter((r) => r.index !== index),
        { index, reading: acousticRecord(p) },
      ].sort((a, b) => a.index - b.index),
    );
  });
  const progress = probe ?? animation.time / 2.4,
    m = acousticReading(p, progress),
    lim = acousticLimits[kind];
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: [Pair, string][] =
    kind === 'propagation'
      ? [
          [['介质声速c', 'Sound speed c'], m.active ? p.c + ' m/s' : '—'],
          [
            ['起始到达', 'First arrival'],
            m.active ? nf((p.distance / p.c) * 1000) + ' ms' : '—',
          ],
          [['波长λ', 'Wavelength λ'], m.active ? nf(m.wavelength) + ' m' : '—'],
          [
            ['探针位移u', 'Probe displacement u'],
            nf(m.packet!.displacement * 1e9) + ' nm',
          ],
        ]
      : kind === 'pitch'
        ? [
            [['源频率f', 'Source frequency f'], p.frequency + ' Hz'],
            [['周期T', 'Period T'], nf(1000 / p.frequency) + ' ms'],
            [['波长λ', 'Wavelength λ'], nf(m.wavelength) + ' m'],
            [['有效声压', 'RMS pressure'], '2 mPa'],
          ]
        : kind === 'level'
          ? [
              [['有效声压', 'RMS pressure'], nf(p.rms * 1000) + ' mPa'],
              [['声压级', 'Sound pressure level'], nf(m.level) + ' dB'],
              [['声强I', 'Intensity I'], waveNumber(m.intensity) + ' W/m²'],
              [['源频率f', 'Source frequency f'], '400 Hz'],
            ]
          : kind === 'resonance'
            ? [
                [['推动频率', 'Drive frequency'], nf(p.frequency) + ' Hz'],
                [['固有频率f₀', 'Natural frequency f₀'], '2 Hz'],
                [
                  ['稳态幅度', 'Steady amplitude'],
                  nf(m.response!.steadyAmplitude * 1000) + ' mm',
                ],
                [
                  ['瞬时位移x', 'Instant displacement x'],
                  nf(m.response!.displacement * 1000) + ' mm',
                ],
              ]
            : kind === 'columns'
              ? [
                  [['有效管长L', 'Effective length L'], nf(p.length) + ' m'],
                  [['基频f₁', 'Fundamental f₁'], nf(p.frequency) + ' Hz'],
                  [['波长λ', 'Wavelength λ'], nf(m.wavelength) + ' m'],
                  [
                    ['左端条件', 'Left-end condition'],
                    p.closed ? 'u=0' : 'p′=0',
                  ],
                ]
              : kind === 'doppler'
                ? [
                    [['源频率', 'Source frequency'], '400 Hz'],
                    [
                      ['波源速度vₛ', 'Source velocity vₛ'],
                      nf(p.sourceVelocity) + ' m/s',
                    ],
                    [
                      ['接收频率', 'Received frequency'],
                      nf(m.doppler!.observedFrequency) + ' Hz',
                    ],
                    [
                      ['前方波峰间距', 'Crest spacing ahead'],
                      nf(m.doppler!.spacingAhead) + ' m',
                    ],
                  ]
                : kind === 'echo'
                  ? [
                      [['载频', 'Carrier frequency'], '40 kHz'],
                      [
                        ['往返时间', 'Round-trip time'],
                        nf(m.echo!.roundTrip * 1000) + ' ms',
                      ],
                      [
                        ['实测量程', 'Measured range'],
                        m.echo!.inferredDistance === null
                          ? '—'
                          : nf(m.echo!.inferredDistance) + ' m',
                      ],
                      [
                        ['最小量程', 'Minimum range'],
                        nf(m.echo!.minimumRange * 1000) + ' mm',
                      ],
                    ]
                  : [
                      [
                        ['载频', 'Carrier frequency'],
                        nf(p.frequency / 1e6) + ' MHz',
                      ],
                      [
                        ['轴向模糊FWHM', 'Axial blur FWHM'],
                        nf(m.ultrasound!.axialFWHM * 1000) + ' mm',
                      ],
                      [
                        ['首回波时刻', 'First echo time'],
                        nf(m.ultrasound!.echoes[0]!.time * 1e6) + ' µs',
                      ],
                      [
                        ['首回波幅度比', 'First-echo amplitude ratio'],
                        nf(m.ultrasound!.echoes[0]!.amplitude * 100) + '%',
                      ],
                    ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
      <div className="phy-lab-toolbar">
        <span>SOUND / ACOUSTICS</span>
        <B
          zh={acousticTitles[kind][0]}
          en={acousticTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={acousticOptions[kind].map(([zh, en], id) => ({
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
          {nf(custom ?? acousticDefault(kind, index))} {lim.unit}
        </output>
        <input
          type="range"
          min={lim.min}
          max={lim.max}
          step={lim.step}
          value={custom ?? acousticDefault(kind, index)}
          aria-label={word(mode, lim.label)}
          disabled={animation.running}
          onChange={(e) => {
            setCustom(Number(e.target.value));
            reset();
          }}
        />
      </label>
      {kind === 'pitch' && (
        <ShortTone mode={mode} frequency={p.frequency} amplitude={0.5} />
      )}
      <div className="phy-circular-scenes">
        <Scene m={m} mode={mode} />
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
            zh={acousticConditions[kind][0]}
            en={acousticConditions[kind][1]}
            mode={mode}
          />
        </p>
        <a href={acousticSources[kind]} target="_blank" rel="noreferrer">
          <B
            zh={
              kind === 'imaging'
                ? '原理延伸 · NIH / NIBIB'
                : '原理延伸 · OpenStax'
            }
            en={
              kind === 'imaging'
                ? 'Explore the principle · NIH / NIBIB'
                : 'Explore the principle · OpenStax'
            }
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
                    {acousticOptions[kind][r.index]![0] ===
                    acousticOptions[kind][r.index]![1] ? (
                      acousticOptions[kind][r.index]![0]
                    ) : (
                      <B
                        zh={acousticOptions[kind][r.index]![0]}
                        en={acousticOptions[kind][r.index]![1]}
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
