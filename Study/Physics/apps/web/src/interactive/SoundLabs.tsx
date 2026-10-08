import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  soundMedia,
  sourceCases,
  arrivalTime,
  pulseDisplacement,
  toneModel,
  echoCases,
  soundEcho,
} from './soundModels';
const words = (m: LanguageMode, zh: string, en: string) =>
  m === 'en' ? en : zh;
const n = (v: number) => v.toFixed(2);
type Label = [string, string];
function Shell({
  mode,
  title,
  conditions,
  children,
}: LabProps & { title: Label; conditions: Label; children: ReactNode }) {
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-sound-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">SOUND / FOLLOW THE SIGNAL</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学模型 · 画面放慢、标记放大；动画时间与声音播放时间分开。"
          en="Teaching model · Slowed motion, enlarged markers; visual and audio playback use different clocks."
          mode={mode}
        />
      </p>
      {children}
      <details className="phy-energy-assumptions">
        <summary>
          <B zh="这份模型的条件" en="Conditions of this model" mode={mode} />
        </summary>
        <p className="phy-model-note">
          <B zh={conditions[0]} en={conditions[1]} mode={mode} />
        </p>
      </details>
    </div>
  );
}
function useRun(
  choice: number,
  duration: number,
  onExplore: LabProps['onExplore'],
) {
  const [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]),
    gate = useComparisons(['0', '1', '2'], onExplore);
  const a = useAnimation(2.5, () => {
    setProbe(duration);
    if (choice >= 0) {
      setRecords((old) => [...new Set([...old, choice])]);
      gate.record(String(choice));
    }
  });
  return {
    a,
    records,
    count: gate.count,
    time: a.running ? (a.time / 2.5) * duration : probe,
    seek: setProbe,
    reset: () => {
      a.reset();
      setProbe(0);
    },
    start: () => {
      setProbe(0);
      a.start();
    },
  };
}
function Observe({
  mode,
  run,
}: {
  mode: LanguageMode;
  run: ReturnType<typeof useRun>;
}) {
  return (
    <>
      <button
        className="phy-button"
        disabled={run.a.running}
        onClick={run.start}
      >
        <B
          zh={run.a.running ? '观察中…' : '完整观察这组信号'}
          en={run.a.running ? 'Observing…' : 'Observe this complete signal'}
          mode={mode}
        />
      </button>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${run.count}/3：完整观察三组规定条件后再继续。自由调节和试听不替代这些比较。`}
          en={`Compared ${run.count}/3: observe all three required cases before continuing. Free adjustments and listening do not replace them.`}
          mode={mode}
        />
      </p>
    </>
  );
}
function Probe({
  mode,
  run,
  max,
}: {
  mode: LanguageMode;
  run: ReturnType<typeof useRun>;
  max: number;
}) {
  return (
    <label className="phy-energy-probe">
      <span>
        <B zh="模型累计时间" en="Elapsed model time" mode={mode} /> ·{' '}
        {n(run.time * 1000)} ms
      </span>
      <input
        type="range"
        min={0}
        max={max * 1000}
        step={0.1}
        value={run.time * 1000}
        disabled={run.a.running}
        aria-label={words(mode, '模型累计时间', 'Elapsed model time')}
        onChange={(e) => run.seek(Number(e.target.value) / 1000)}
      />
    </label>
  );
}
function Records({
  mode,
  columns,
  rows,
}: {
  mode: LanguageMode;
  columns: Label[];
  rows: ReactNode[][];
}) {
  return rows.length ? (
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
              <th key={c[1]} scope="col">
                <B zh={c[0]} en={c[1]} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) =>
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
  ) : null;
}
function SourceField({
  mode,
  time,
  amplitude,
  speed,
}: {
  mode: LanguageMode;
  time: number;
  amplitude: number;
  speed: number | undefined;
}) {
  const x = (m: number) => 60 + (m / 10.29) * 500,
    source = pulseDisplacement(0, time, amplitude, 343),
    front =
      speed === undefined || amplitude === 0 || time * speed > 10.29
        ? undefined
        : time * speed;
  return (
    <svg
      viewBox="0 0 620 260"
      role="img"
      aria-label={words(
        mode,
        '介质标记沿传播方向在平衡位置附近来回振动；标记位移放大',
        'Medium markers oscillate along propagation near equilibrium; displacement enlarged',
      )}
    >
      <text x="60" y="27">
        {words(mode, '声源', 'Source')}
      </text>
      <text x="560" y="27" textAnchor="end">
        {words(mode, '传播 →', 'Propagation →')}
      </text>
      <path d="M60 53h500" stroke="#ddd2e4" strokeDasharray="5 5" />
      <path
        d={`M${40 + source * 100} 85v70`}
        stroke="#a58ab8"
        strokeWidth="6"
      />
      {speed !== undefined &&
        Array.from({ length: 45 }, (_, i) => {
          const place = (i / 44) * 10.29,
            shift = pulseDisplacement(place, time, amplitude, speed) * 60;
          return (
            <g key={i}>
              <circle cx={x(place)} cy="120" r="2" fill="#ded6e4" />
              <circle
                cx={x(place) + shift}
                cy="120"
                r={i === 20 ? 7 : 4}
                fill={
                  i === 20 ? '#c69e62' : speed === 1480 ? '#92b6bb' : '#b49bc6'
                }
              />
            </g>
          );
        })}
      {speed === undefined && (
        <text x="310" y="124" textAnchor="middle">
          {words(mode, '真空：没有介质标记', 'Vacuum: no medium markers')}
        </text>
      )}
      {front !== undefined && (
        <path d={`M${x(front)} 80v80`} stroke="#a8bdac" strokeDasharray="4 4" />
      )}
      <path d={`M${x(6.86)} 77v88`} stroke="#ac96bb" strokeWidth="2" />
      <text x={x(6.86)} y="191" textAnchor="middle">
        {words(mode, '探测点', 'Detector')} 6.86 m
      </text>
      <text x="60" y="228">
        0
      </text>
      <text x="560" y="228" textAnchor="end">
        10.29 m
      </text>
    </svg>
  );
}
export function SoundSourceLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    c = sourceCases[choice]!,
    run = useRun(choice, 0.03, onExplore),
    arrived = c.amplitude > 0 && run.time >= 0.02;
  return (
    <Shell
      mode={mode}
      title={[
        '声源停了，信号还在路上',
        'Source stopped; signal still travelling',
      ]}
      conditions={[
        '一维小振幅、空气343 m/s，不计衰减与反射。声源200 Hz，在0–10 ms振动两次后停止；局部位移0.10/0.20 mm，图中大幅放大且不按距离比例。标记表示局部介质，不是单个分子；绿色线是扰动前沿。',
        'One-dimensional small-amplitude air model at 343 m/s, without loss or reflection. The 200 Hz source vibrates twice over 0–10 ms, then stops. Local displacement 0.10/0.20 mm is strongly enlarged and not to the distance scale. Markers show local medium regions, not individual molecules; green marks the leading edge.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['声源状态', 'Source state']}
        values={sourceCases.map((c, id) => ({ ...c, id }))}
        value={choice}
        disabled={run.a.running}
        set={(v) => {
          setChoice(v);
          run.reset();
        }}
      />
      <SourceField
        mode={mode}
        time={run.time}
        amplitude={c.amplitude}
        speed={343}
      />
      <Probe mode={mode} run={run} max={0.03} />
      <div className="phy-thermal-metrics">
        <LabMetric
          mode={mode}
          title={['声源振动区间', 'Source vibration interval']}
        >
          {c.amplitude ? '0–10 ms' : '—'}
        </LabMetric>
        <LabMetric
          mode={mode}
          title={['探测点已收到', 'Detector has received']}
        >
          <B
            zh={arrived ? '是' : '否'}
            en={arrived ? 'Yes' : 'No'}
            mode={mode}
          />
        </LabMetric>
      </div>
      <p className="phy-model-note">
        <B
          zh="标记左右来回，不随信号一路前进。声源在10 ms后停止；已发出的两次振动会在20–30 ms经过探测点。第三组从未发出信号。"
          en="Markers move back and forth, not all the way with the signal. The source stops after 10 ms; emitted cycles pass the detector over 20–30 ms. The third case emits nothing."
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Records
        mode={mode}
        columns={[
          ['声源', 'Source'],
          ['振动次数', 'Source cycles'],
          ['首到达', 'First arrival'],
        ]}
        rows={run.records.map((i) => [
          <B zh={sourceCases[i]!.zh} en={sourceCases[i]!.en} mode={mode} />,
          i === 2 ? 0 : 2,
          i === 2 ? '—' : '20.00 ms',
        ])}
      />
    </Shell>
  );
}
export function SoundMediumLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    c = soundMedia[choice]!,
    run = useRun(choice, 0.03, onExplore),
    arrival = arrivalTime(6.86, c.speed);
  return (
    <Shell
      mode={mode}
      title={['一个标记没有一路旅行', 'One marker does not travel all the way']}
      conditions={[
        '空气和淡水均取约20°C，声速343/1480 m/s；真空无机械传播。声源相同200 Hz、0.10 mm，持续10 ms。源与每种介质理想耦合，路径没有界面；不预测真实听感、衰减或分子热运动。放大局部位移只用于辨认方向。',
        'Air and fresh water near 20°C use 343/1480 m/s; vacuum has no mechanical propagation. Identical source: 200 Hz, 0.10 mm, 10 ms. Coupling is ideal and paths have no interfaces. No prediction of real audibility, loss or thermal molecular motion. Enlarged displacement shows direction only.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['同距离，不同路径', 'Same distance, different path']}
        values={soundMedia.map((c, id) => ({ ...c, id }))}
        value={choice}
        disabled={run.a.running}
        set={(v) => {
          setChoice(v);
          run.reset();
        }}
      />
      <SourceField
        mode={mode}
        time={run.time}
        amplitude={0.1}
        speed={c.speed}
      />
      <Probe mode={mode} run={run} max={0.03} />
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['路径声速', 'Path sound speed']}>
          {c.speed ? `${c.speed} m/s` : '—'}
        </LabMetric>
        <LabMetric mode={mode} title={['首到达时间', 'First-arrival time']}>
          {arrival === undefined ? '—' : `${n(arrival * 1000)} ms`}
        </LabMetric>
      </div>
      <p className="phy-model-note">
        <B
          zh={
            arrival === undefined
              ? '真空组声源仍动，但路径无介质，探测点没有本次机械信号。'
              : '有颜色的标记围绕原位置振动；灰点是平衡位置，不画成上下水波。'
          }
          en={
            arrival === undefined
              ? 'The source still moves in vacuum, but no medium carries this mechanical signal to the detector.'
              : 'The coloured marker oscillates about its own starting place; grey dots show equilibrium, not an up-and-down water wave.'
          }
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Records
        mode={mode}
        columns={[
          ['路径', 'Path'],
          ['c / m/s', 'c / m/s'],
          ['首到达', 'First arrival'],
        ]}
        rows={run.records.map((i) => [
          <B zh={soundMedia[i]!.zh} en={soundMedia[i]!.en} mode={mode} />,
          soundMedia[i]!.speed ?? '—',
          soundMedia[i]!.speed ? (
            `${n(arrivalTime(6.86, soundMedia[i]!.speed)! * 1000)} ms`
          ) : (
            <B zh="不传播" en="No propagation" mode={mode} />
          ),
        ])}
      />
    </Shell>
  );
}
function ShortTone({
  mode,
  frequency,
  amplitude,
}: {
  mode: LanguageMode;
  frequency: number;
  amplitude: number;
}) {
  const session = useRef<
      | {
          ctx: AudioContext;
          osc: OscillatorNode;
          gain: GainNode;
          stopAt: number;
        }
      | undefined
    >(undefined),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState(false);
  const stop = () => {
    const s = session.current;
    session.current = undefined;
    if (s) {
      s.osc.onended = null;
      try {
        s.osc.stop();
      } catch {
        /* already ended */
      }
      void s.ctx.close().catch(() => {});
    }
    setPlaying(false);
  };
  useEffect(
    () => () => {
      const s = session.current;
      session.current = undefined;
      if (s) {
        s.osc.onended = null;
        void s.ctx.close().catch(() => {});
      }
    },
    [],
  );
  useEffect(() => {
    const s = session.current;
    if (s && Number.isFinite(s.stopAt) && s.ctx.currentTime < s.stopAt - 0.04) {
      s.osc.frequency.setTargetAtTime(frequency, s.ctx.currentTime, 0.01);
      s.gain.gain.cancelScheduledValues(s.ctx.currentTime);
      s.gain.gain.setTargetAtTime(
        toneModel(frequency, amplitude).audioGain,
        s.ctx.currentTime,
        0.01,
      );
      s.gain.gain.setValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        s.stopAt - 0.04,
      );
      s.gain.gain.linearRampToValueAtTime(0, s.stopAt);
    }
  }, [frequency, amplitude]);
  const play = async () => {
    if (session.current) {
      stop();
      return;
    }
    setError(false);
    let ctx: AudioContext | undefined;
    try {
      ctx = new AudioContext();
      const osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        s = { ctx, osc, gain, stopAt: Infinity };
      session.current = s;
      await ctx.resume();
      if (session.current !== s) {
        void ctx.close().catch(() => {});
        return;
      }
      s.stopAt = ctx.currentTime + 0.7;
      osc.type = 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        ctx.currentTime + 0.02,
      );
      gain.gain.setValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        ctx.currentTime + 0.66,
      );
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        if (session.current === s) {
          session.current = undefined;
          setPlaying(false);
        }
        void s.ctx.close().catch(() => {});
      };
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
      setPlaying(true);
    } catch {
      session.current = undefined;
      if (ctx) void ctx.close().catch(() => {});
      setPlaying(false);
      setError(true);
    }
  };
  return (
    <div className="phy-sound-audio">
      <button className="phy-button secondary" onClick={() => void play()}>
        <B
          zh={playing ? '停止试听' : '试听0.7秒短音'}
          en={playing ? 'Stop listening' : 'Play a 0.7-second tone'}
          mode={mode}
        />
      </button>
      <p role="status">
        <B
          zh={
            error
              ? '当前设备无法播放，仍可用图完成比较。'
              : playing
                ? '短音播放中；调节滑块可听到变化。'
                : '先把设备音量调低。短音只是比较工具，不测分贝或听力；切走页面会停止。'
          }
          en={
            error
              ? 'Audio unavailable on this device; use the graph to complete comparisons.'
              : playing
                ? 'Brief tone playing; sliders change it while it plays.'
                : 'Start at low device volume. Tones compare changes, not decibels or hearing; leaving this page stops them.'
          }
          mode={mode}
        />
      </p>
    </div>
  );
}
function ToneLab({
  mode,
  onExplore,
  amplitudeOnly,
}: {
  mode: LanguageMode;
  onExplore?: LabProps['onExplore'];
  amplitudeOnly: boolean;
}) {
  const targets = amplitudeOnly ? [0.25, 0.5, 1] : [200, 400, 800],
    [value, setValue] = useState(targets[0]!),
    frequency = amplitudeOnly ? 400 : value,
    amplitude = amplitudeOnly ? value : 0.5,
    model = toneModel(frequency, amplitude),
    choice = targets.findIndex((v) => Math.abs(v - value) < 1e-9),
    run = useRun(choice, 0.01, onExplore),
    time = 0.01,
    steps = 320;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (time * i) / steps;
    return `${65 + (t / 0.01) * 490},${135 - toneModel(frequency, amplitude, t).pressure * 72}`;
  }).join(' ');
  const change = (v: number) => {
    setValue(v);
    run.reset();
  };
  return (
    <Shell
      mode={mode}
      title={
        amplitudeOnly
          ? ['同周期，不同波动大小', 'Same period, different variation size']
          : ['同时间，振动几次？', 'Same time: how many cycles?']
      }
      conditions={[
        '图是一固定位置的相对压力–时间图，纯正弦，小振幅空气343 m/s，无衰减、色散；不表示分子上下走或校准声压。频率课固定相对振幅0.50；振幅课固定400 Hz。声音是低输出正弦短音，与图未作设备校准；耳朵、扬声器和房间会影响听感。',
        'Graph: relative pressure versus time at one fixed location. Pure sine, small-amplitude air at 343 m/s, no loss/dispersion; not up-and-down particle motion or calibrated pressure. Pitch holds relative amplitude 0.50; amplitude holds 400 Hz. Low-output sine tones are not device-calibrated to the graph; ears, speakers and rooms affect perception.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={
          amplitudeOnly
            ? ['相对压力振幅', 'Relative pressure amplitude']
            : ['频率 / Hz', 'Frequency / Hz']
        }
        values={targets.map((v, id) => ({
          id,
          zh: amplitudeOnly ? v.toFixed(2) : `${v} Hz`,
          en: amplitudeOnly ? v.toFixed(2) : `${v} Hz`,
        }))}
        value={choice}
        disabled={run.a.running}
        set={(i) => change(targets[i]!)}
      />
      <label className="phy-energy-probe">
        <span>
          <B
            zh={amplitudeOnly ? '自由调振幅' : '自由调频率'}
            en={
              amplitudeOnly
                ? 'Adjust amplitude freely'
                : 'Adjust frequency freely'
            }
            mode={mode}
          />{' '}
          · {amplitudeOnly ? value.toFixed(2) : `${value} Hz`}
        </span>
        <input
          type="range"
          min={targets[0]}
          max={targets[2]}
          step={amplitudeOnly ? 0.05 : 50}
          value={value}
          disabled={run.a.running}
          aria-label={words(
            mode,
            amplitudeOnly ? '自由调振幅' : '自由调频率',
            amplitudeOnly
              ? 'Adjust amplitude freely'
              : 'Adjust frequency freely',
          )}
          onChange={(e) => change(Number(e.target.value))}
        />
      </label>
      <svg
        viewBox="0 0 620 275"
        role="img"
        aria-label={words(
          mode,
          '固定位置相对压力随时间变化，三组共用坐标刻度',
          'Relative pressure versus time at a fixed place, shared axes for three cases',
        )}
      >
        <text x="65" y="27">
          {words(mode, '相对压力', 'Relative pressure')}
        </text>
        <text x="555" y="27" textAnchor="end">
          ms
        </text>
        {[-1, 0, 1].map((v) => (
          <g key={v}>
            <path d={`M65 ${135 - v * 72}H555`} stroke="#dfd3e5" />
            <text x="50" y={142 - v * 72} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <path d="M65 53v155h490" stroke="#ab94b7" fill="none" />
        <polyline
          points={points}
          stroke={amplitudeOnly ? '#c09c65' : '#a284b6'}
          fill="none"
          strokeWidth="3"
        />
        <path
          d={`M${65 + (run.time / 0.01) * 490} 53v155`}
          stroke="#9eb6aa"
          strokeDasharray="5 5"
        />
        <circle
          cx={65 + (run.time / 0.01) * 490}
          cy={135 - toneModel(frequency, amplitude, run.time).pressure * 72}
          r="5"
          fill="#9eb6aa"
        />
        {[0, 5, 10].map((v) => (
          <text key={v} x={65 + (v / 10) * 490} y="242" textAnchor="middle">
            {v}
          </text>
        ))}
      </svg>
      <p className="phy-model-note">
        <B
          zh="整条曲线是规定纯音的10 ms预览，拖动频率或振幅立即更新；绿线和圆点是时间探针。完整观察仍需点击播放。"
          en="The whole curve previews 10 ms of the prescribed tone; frequency/amplitude sliders update it immediately. Green line and dot probe time. Complete observation still requires playback."
          mode={mode}
        />
      </p>
      <Probe mode={mode} run={run} max={0.01} />
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['频率', 'Frequency']}>
          {frequency} Hz
        </LabMetric>
        <LabMetric mode={mode} title={['10 ms内的次数', 'Cycles in 10 ms']}>
          {n(model.cycles)}
        </LabMetric>
        <LabMetric mode={mode} title={['周期', 'Period']}>
          {n(model.periodMs)} ms
        </LabMetric>
        <LabMetric mode={mode} title={['相对振幅', 'Relative amplitude']}>
          {n(amplitude)}
        </LabMetric>
      </div>
      <p className="phy-model-note">
        <B
          zh={
            amplitudeOnly
              ? '三组周期都2.50 ms，声速都343 m/s。振幅数值不是分贝，也不对应“几倍响”。'
              : '同空气声速343 m/s；频率变高时周期变短，波长也变短。图上下是压力数值，不是空气上下运动。'
          }
          en={
            amplitudeOnly
              ? 'All three have period 2.50 ms and speed 343 m/s. Amplitude numbers are not decibels or exact multiples of perceived loudness.'
              : 'Speed stays 343 m/s in the same air. Higher frequency shortens period and wavelength. Vertical values are pressure, not air moving up/down.'
          }
          mode={mode}
        />
      </p>
      <ShortTone mode={mode} frequency={frequency} amplitude={amplitude} />
      <Observe mode={mode} run={run} />
      <Records
        mode={mode}
        columns={
          amplitudeOnly
            ? [
                ['振幅', 'Amplitude'],
                ['次数/10 ms', 'Cycles/10 ms'],
                ['T / ms', 'T / ms'],
              ]
            : [
                ['f / Hz', 'f / Hz'],
                ['次数/10 ms', 'Cycles/10 ms'],
                ['T / ms', 'T / ms'],
              ]
        }
        rows={run.records.map((i) => {
          const v = targets[i]!,
            m = toneModel(amplitudeOnly ? 400 : v, amplitudeOnly ? v : 0.5);
          return [amplitudeOnly ? n(v) : v, n(m.cycles), n(m.periodMs)];
        })}
      />
    </Shell>
  );
}
export function SoundPitchLab(p: LabProps) {
  return <ToneLab {...p} amplitudeOnly={false} />;
}
export function SoundAmplitudeLab(p: LabProps) {
  return <ToneLab {...p} amplitudeOnly />;
}
export function SoundRangingLab({ mode, onExplore }: LabProps) {
  const [choice, setChoice] = useState(0),
    c = echoCases[choice]!,
    run = useRun(choice, 0.2, onExplore),
    state = soundEcho(c.distance, c.frequency, run.time),
    x = 80 + (state.position / 34.3) * 460,
    wall = 80 + (c.distance / 34.3) * 460;
  return (
    <Shell
      mode={mode}
      title={['一段距离，两段路程', 'One range, two travel legs']}
      conditions={[
        '约20°C干空气，规定343 m/s，直线往返、固定障碍、发送接收同位置。不计衰减、色散、反射相位和检测延迟。移动点表示短脉冲前沿，不是空气粒子或完整频率波形；超声组不播放超声。不是实际传感器量程预测。',
        'Dry air near 20°C at prescribed 343 m/s; straight out/back, fixed obstacle, emitter and receiver together. No loss, dispersion, reflection phase or detection delay. Moving dot is a pulse front, not a particle or full carrier waveform. Ultrasound is not played. No prediction of real sensor range.',
      ]}
    >
      <LabOptions
        mode={mode}
        name={['障碍距离与频率', 'Obstacle range and frequency']}
        values={echoCases.map((v, id) => ({
          id,
          zh: `${v.distance.toFixed(2)} m · ${v.frequency === 40000 ? '40 kHz' : '2 kHz'}`,
          en: `${v.distance.toFixed(2)} m · ${v.frequency === 40000 ? '40 kHz' : '2 kHz'}`,
        }))}
        value={choice}
        disabled={run.a.running}
        set={(v) => {
          setChoice(v);
          run.reset();
        }}
      />
      <svg
        viewBox="0 0 620 270"
        role="img"
        aria-label={words(
          mode,
          '脉冲前沿沿同一路径去障碍物再返回；单程距离与往返路程分开',
          'Pulse front travels to an obstacle and back along the same path; range and round-trip distance are separate',
        )}
      >
        <path d={`M80 120H${wall}`} stroke="#d5c5de" strokeWidth="3" />
        <rect x="52" y="93" width="24" height="54" rx="6" fill="#b19bc1" />
        <path d={`M${wall} 70v100`} stroke="#c5a36e" strokeWidth="7" />
        <circle
          cx={x}
          cy="120"
          r="10"
          fill={state.returning ? '#9bb8a8' : '#c2a0d2'}
        />
        <text x="80" y="42">
          {words(mode, '发出 / 接收', 'Emit / receive')}
        </text>
        <text x={wall} y="194" textAnchor="middle">
          {c.distance.toFixed(2)} m
        </text>
        <text x="310" y="236" textAnchor="middle">
          {state.arrived
            ? words(mode, '回波已到达', 'Echo has returned')
            : state.returning
              ? words(mode, '← 返回', '← Returning')
              : words(mode, '向障碍传播 →', 'Travelling outward →')}
        </text>
      </svg>
      <Probe mode={mode} run={run} max={0.2} />
      <div className="phy-thermal-metrics">
        <LabMetric mode={mode} title={['障碍单程距离', 'One-way range']}>
          {n(c.distance)} m
        </LabMetric>
        <LabMetric mode={mode} title={['完整往返时间', 'Full round-trip time']}>
          {n(state.returnTime * 1000)} ms
        </LabMetric>
        <LabMetric
          mode={mode}
          title={['前沿已走路程', 'Front distance travelled']}
        >
          {n(state.travelled)} m
        </LabMetric>
        <LabMetric mode={mode} title={['发出频率', 'Emitted frequency']}>
          {c.frequency / 1000} kHz
        </LabMetric>
      </div>
      <p className="phy-model-note">
        <B
          zh={
            state.ultrasound
              ? '40 kHz超过通常20 kHz界限，是超声；同距离仍用200 ms，不能把高频当作更快。'
              : '回波走2d；不是用图标移动速度预测实际等待。声速与温度、介质有关。'
          }
          en={
            state.ultrasound
              ? '40 kHz is above the conventional 20 kHz boundary: ultrasound. The same range still takes 200 ms; higher frequency is not higher speed.'
              : 'An echo travels 2d; icon speed does not predict real waiting. Sound speed depends on temperature and medium.'
          }
          mode={mode}
        />
      </p>
      <Observe mode={mode} run={run} />
      <Records
        mode={mode}
        columns={[
          ['d / m', 'd / m'],
          ['f / kHz', 'f / kHz'],
          ['往返 / ms', 'Round trip / ms'],
        ]}
        rows={run.records.map((i) => [
          echoCases[i]!.distance.toFixed(2),
          echoCases[i]!.frequency / 1000,
          n(
            soundEcho(echoCases[i]!.distance, echoCases[i]!.frequency, 0)
              .returnTime * 1000,
          ),
        ])}
      />
    </Shell>
  );
}
