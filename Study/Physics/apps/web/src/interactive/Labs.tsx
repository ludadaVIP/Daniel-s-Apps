import { useState } from 'react';
import { useAnimation } from './useSimulation';
import { VolumeLab, AccuracyLab, RepeatsLab, PaperLab } from './MeasurementSkillsLabs';
import { FoundationLab } from './MeasurementLabs';
import {
  MirrorLab,
  StaticLab,
  SeatbeltLab,
  FairTestLab,
} from './DiscoveryLabs';
import { FloatingLab, BoatLab, BounceLab, EchoLab } from './MysteryLabs';
import type { LanguageMode } from '@study/shared';
import { B, Icon } from '../ui';
import { rollingMotion, raceTime } from './physics';
import type { Lesson } from '../content/lessons';
export function RollingLab({
  mode,
  onExplore,
}: {
  mode: LanguageMode;
  onExplore?: () => void;
}) {
  const [rough, setRough] = useState(false);
  const [records, setRecords] = useState<
    { rough: boolean; distance: number }[]
  >([]);
  const a = rough ? 1.5 : 0.5;
  const motion = rollingMotion(3, a, 0);
  const animation = useAnimation(motion.stopTime / 2, () => {
    setRecords((old) => [
      ...old.slice(-5),
      { rough, distance: motion.stopDistance },
    ]);
    onExplore?.();
  });
  const current = rollingMotion(3, a, animation.time * 2);
  return (
    <div className="phy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">01 / ROLLING BALL</span>
        <span>
          <B
            zh="固定起始速率 3 m/s"
            en="Starting speed fixed at 3 m/s"
            mode={mode}
          />
        </span>
      </div>
      <svg
        viewBox="0 0 600 190"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Ball rolling on a horizontal surface'
            : '球在水平地面上滚动'
        }
        className="phy-simulation"
      >
        <defs>
          <pattern
            id="phy-ground"
            width="12"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path d="m0 8 8-8" stroke="#b5a8c8" strokeWidth="1" />
          </pattern>
        </defs>
        <path d="M40 130h510" stroke="#8b80a3" strokeWidth="2" />
        <rect
          x="40"
          y="131"
          width="510"
          height="14"
          fill={rough ? 'url(#phy-ground)' : '#ece8f2'}
        />
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <path d={`M${40 + i * 51} 149v5`} stroke="#aaa1b7" />
            <text
              x={40 + i * 51}
              y="173"
              textAnchor="middle"
              fill="#7e758b"
              fontSize="11"
            >
              {i} m
            </text>
          </g>
        ))}
        <g
          transform={`translate(${40 + Math.min(current.distance, 10) * 51},109)`}
        >
          <circle r="20" fill="#9c88cc" />
          <g transform={`rotate(${current.distance * 140})`}>
            <path d="m-6-17 16 5 4 15-15 10-15-10Z" fill="#6e559d" />
            <path d="m-20 0 5 4m29 11 2-5" stroke="#6e559d" strokeWidth="3" />
          </g>
        </g>
        <path d="M56 58h38m-8-6 8 6-8 6" stroke="#8d74b5" strokeWidth="2" />
        <text x="106" y="62" fill="#7e758b" fontSize="13">
          {current.speed.toFixed(1)} m/s
        </text>
        <text x="540" y="53" fill="#6e559d" fontSize="24" textAnchor="end">
          {current.distance.toFixed(1)} m
        </text>
      </svg>
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Surface' : '地面'}
        >
          <button
            disabled={animation.running}
            aria-pressed={!rough}
            className={!rough ? 'selected' : ''}
            onClick={() => {
              setRough(false);
              animation.reset();
            }}
          >
            <B zh="光滑地面" en="Smooth" mode={mode} />
          </button>
          <button
            disabled={animation.running}
            aria-pressed={rough}
            className={rough ? 'selected' : ''}
            onClick={() => {
              setRough(true);
              animation.reset();
            }}
          >
            <B zh="粗糙地面" en="Rough" mode={mode} />
          </button>
        </div>
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <Icon name="arrow" />
          <B
            zh={animation.running ? '观察中…' : '释放小球'}
            en={animation.running ? 'Observing…' : 'Release ball'}
            mode={mode}
          />
        </button>
      </div>
      {records.length > 0 && (
        <div className="phy-trials" aria-live="polite">
          {records.map((r, i) => (
            <span key={i}>
              <B
                zh={r.rough ? '粗糙' : '光滑'}
                en={r.rough ? 'Rough' : 'Smooth'}
                mode={mode}
              />{' '}
              <strong>{r.distance.toFixed(1)} m</strong>
            </span>
          ))}
        </div>
      )}
      <p className="phy-model-note">
        <B
          zh="简化模型：水平运动、恒定阻力，以 2 倍速度播放。距离用于比较，不代表所有真实地面。"
          en="Simplified model: horizontal motion with constant resistance, played at 2× speed. Distances illustrate a comparison, not all real surfaces."
          mode={mode}
        />
      </p>
    </div>
  );
}
export function RulerLab({
  mode,
  onExplore,
}: {
  mode: LanguageMode;
  onExplore?: () => void;
}) {
  const [start, setStart] = useState(2);
  const [end, setEnd] = useState(8);
  return (
    <div className="phy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">02 / MEASUREMENT</span>
        <strong>{end - start} cm</strong>
      </div>
      <svg
        viewBox="0 0 600 190"
        className="phy-simulation"
        role="img"
        aria-label={`${start} cm → ${end} cm`}
      >
        <rect x="40" y="108" width="520" height="45" rx="5" fill="#e9cc92" />
        {Array.from({ length: 51 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${40 + i * 10.4} 108v${i % 5 === 0 ? 22 : 11}`}
              stroke="#967744"
            />
            {i % 5 === 0 && (
              <text
                x={40 + i * 10.4}
                y="144"
                textAnchor="middle"
                fontSize="12"
                fill="#71582f"
              >
                {i / 5}
              </text>
            )}
          </g>
        ))}
        <rect
          x={40 + start * 52}
          y="63"
          width={(end - start) * 52}
          height="20"
          rx="3"
          fill="#a38ac9"
        />
        <path
          d={`M${40 + start * 52} 55v50M${40 + end * 52} 55v50`}
          stroke="#796099"
          strokeDasharray="3 3"
        />
        <text x="300" y="35" textAnchor="middle" fill="#796099" fontSize="18">
          {end} − {start} = {end - start} cm
        </text>
      </svg>
      <div className="phy-slider-row">
        <label>
          <B zh="起点" en="Start" mode={mode} />
          <input
            type="range"
            min="0"
            max="5"
            value={start}
            onChange={(e) => {
              const n = Number(e.target.value);
              setStart(n);
              setEnd(Math.max(end, n + 1));
              onExplore?.();
            }}
          />
          <strong>{start} cm</strong>
        </label>
        <label>
          <B zh="终点" en="End" mode={mode} />
          <input
            type="range"
            min={start + 1}
            max="10"
            value={end}
            onChange={(e) => {
              setEnd(Number(e.target.value));
              onExplore?.();
            }}
          />
          <strong>{end} cm</strong>
        </label>
      </div>
      <p className="phy-model-note">
        <B
          zh="试一试：把起点移到 3 cm、终点移到 9 cm，长度是多少？"
          en="Try a start of 3 cm and an end of 9 cm. What is the length?"
          mode={mode}
        />
      </p>
    </div>
  );
}
export function SpeedLab({
  mode,
  onExplore,
}: {
  mode: LanguageMode;
  onExplore?: () => void;
}) {
  const [speed, setSpeed] = useState(2);
  const [finished, setFinished] = useState(false);
  const a = useAnimation(Math.max(raceTime(12, speed), 6) / 2, () => {
    setFinished(true);
    onExplore?.();
  });
  return (
    <div className="phy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">03 / ROBOT RACE</span>
        <span>12 m · {(a.time * 2).toFixed(1)} s</span>
      </div>
      <svg
        viewBox="0 0 600 190"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two robots race over 12 metres'
            : '两个机器人跑 12 米'
        }
      >
        {[0, 1].map((r) => (
          <g key={r}>
            <path
              d={`M40 ${92 + r * 65}h520`}
              stroke="#dad4e4"
              strokeDasharray="5 5"
            />
            <g
              transform={`translate(${55 + (Math.min(a.time * 2 * (r ? 2 : speed), 12) / 12) * 460},${67 + r * 65})`}
            >
              <rect
                x="-16"
                y="-18"
                width="32"
                height="25"
                rx="7"
                fill={r ? '#dbab72' : '#947cc0'}
              />
              <circle cx="-6" cy="-7" r="2" fill="white" />
              <circle cx="6" cy="-7" r="2" fill="white" />
              <circle cx="-9" cy="12" r="6" fill="#534663" />
              <circle cx="9" cy="12" r="6" fill="#534663" />
            </g>
            <text
              x="40"
              y={31 + r * 65}
              fill={r ? '#ab7845' : '#78619e'}
              fontSize="13"
            >
              {r ? 'B · 2 m/s' : `A · ${speed} m/s`}
            </text>
          </g>
        ))}
        <path d="M529 37v127" stroke="#817489" strokeWidth="2" />
        <path d="M529 37h24v18h-24" fill="#817489" />
      </svg>
      <div className="phy-lab-controls">
        <label className="phy-speed-slider">
          <B zh="A 的速率" en="A’s speed" mode={mode} />
          <input
            aria-label={mode === 'en' ? 'Robot A speed' : '机器人 A 的速率'}
            type="range"
            min="1"
            max="4"
            step=".5"
            value={speed}
            disabled={a.running}
            onChange={(e) => {
              setSpeed(Number(e.target.value));
              setFinished(false);
              a.reset();
            }}
          />
          <strong>{speed} m/s</strong>
        </label>
        <button
          className="phy-button"
          disabled={a.running}
          onClick={() => {
            setFinished(false);
            a.start();
          }}
        >
          <Icon name="arrow" />
          <B
            zh={a.running ? '比赛中…' : '开始比赛'}
            en={a.running ? 'Racing…' : 'Start race'}
            mode={mode}
          />
        </button>
      </div>
      {finished && (
        <p className="phy-lab-result" aria-live="polite">
          A: 12 ÷ {speed} = {raceTime(12, speed).toFixed(1)} s / B: 12 ÷ 2 = 6.0
          s
        </p>
      )}
      <p className="phy-model-note">
        <B
          zh="匀速直线运动模型，以 2 倍速度播放。两条跑道长度相同。"
          en="Constant-speed, straight-line motion, played at 2× speed. Both tracks have equal length."
          mode={mode}
        />
      </p>
    </div>
  );
}
export function FallingLab({
  mode,
  onExplore,
}: {
  mode: LanguageMode;
  onExplore?: () => void;
}) {
  const [done, setDone] = useState(false);
  const duration = Math.sqrt(4 / 9.8);
  const a = useAnimation(duration * 3, () => {
    setDone(true);
    onExplore?.();
  });
  const drop = Math.min(2, 4.9 * (a.time / 3) ** 2);
  return (
    <div className="phy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">04 / WATCH & WONDER</span>
        <span>{drop.toFixed(2)} m</span>
      </div>
      <svg
        viewBox="0 0 600 220"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'A falling ball with positions at equal time intervals'
            : '下落小球及相等时间间隔的位置'
        }
      >
        <path d="M180 185h270M180 35v150" stroke="#d1c5de" />
        <text x="163" y="40" textAnchor="end" fontSize="12" fill="#8f7a9c">
          2 m
        </text>
        <text x="163" y="187" textAnchor="end" fontSize="12" fill="#8f7a9c">
          0 m
        </text>
        {[0, 0.16, 0.32, 0.48, 0.64].map((time, i) => (
          <circle
            key={i}
            cx="315"
            cy={35 + Math.min(2, 4.9 * time * time) * 66}
            r="12"
            fill="#c5b4d9"
            opacity=".35"
          />
        ))}
        <circle cx="315" cy={35 + drop * 66} r="16" fill="#9980bc" />
        <path d="M366 58v70m-6-8 6 8 6-8" stroke="#a58bbd" strokeWidth="2" />
      </svg>
      <div className="phy-lab-controls">
        <B
          zh="浅色圆点：相等时间间隔的位置"
          en="Pale dots: positions at equal time intervals"
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={a.running}
          onClick={() => {
            setDone(false);
            a.start();
          }}
        >
          <B zh="释放小球" en="Release ball" mode={mode} />
          <Icon name="arrow" />
        </button>
      </div>
      {done && (
        <p className="phy-lab-result">
          <B
            zh="观察：越往后，相等时间内下落的距离越大。"
            en="Observation: the ball travels farther during each later equal time interval."
            mode={mode}
          />
        </p>
      )}
      <p className="phy-model-note">
        <B
          zh="模型忽略空气阻力，g = 9.8 m/s²，以三分之一速度播放。"
          en="Model neglects air resistance; g = 9.8 m/s². Played at one-third speed."
          mode={mode}
        />
      </p>
    </div>
  );
}
export function LessonLab({
  kind,
  mode,
  onExplore,
}: {
  kind: Lesson['kind'];
  mode: LanguageMode;
  onExplore?: () => void;
}) {
  if (kind === 'volume') return <VolumeLab mode={mode} onExplore={onExplore} />;
  if (kind === 'accuracy') return <AccuracyLab mode={mode} onExplore={onExplore} />;
  if (kind === 'repeats') return <RepeatsLab mode={mode} onExplore={onExplore} />;
  if (kind === 'paper') return <PaperLab mode={mode} onExplore={onExplore} />;
  if (kind === 'mirror') return <MirrorLab mode={mode} onExplore={onExplore} />;
  if (kind === 'static') return <StaticLab mode={mode} onExplore={onExplore} />;
  if (kind === 'seatbelt')
    return <SeatbeltLab mode={mode} onExplore={onExplore} />;
  if (kind === 'fair-test')
    return <FairTestLab mode={mode} onExplore={onExplore} />;
  if (kind === 'length') return <RulerLab mode={mode} onExplore={onExplore} />;
  if (kind === 'speed') return <SpeedLab mode={mode} onExplore={onExplore} />;
  if (kind === 'observation')
    return <FallingLab mode={mode} onExplore={onExplore} />;
  if (kind === 'friction' || kind === 'variables')
    return <RollingLab mode={mode} onExplore={onExplore} />;
  if (kind === 'floating')
    return <FloatingLab mode={mode} onExplore={onExplore} />;
  if (kind === 'boats') return <BoatLab mode={mode} onExplore={onExplore} />;
  if (kind === 'bounce') return <BounceLab mode={mode} onExplore={onExplore} />;
  if (kind === 'echo') return <EchoLab mode={mode} onExplore={onExplore} />;
  return <FoundationLab kind={kind} mode={mode} onExplore={onExplore} />;
}
