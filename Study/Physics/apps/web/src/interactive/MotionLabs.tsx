import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { useAnimation } from './useSimulation';
import {
  trainView,
  returnJourney,
  averageTrip,
  averageTripState,
  type Reference,
  type Walking,
} from './motionModels';
type Props = { mode: LanguageMode; onExplore?: () => void };
function Frame({
  mode,
  zh,
  en,
  noteZh,
  noteEn,
  children,
}: Props & {
  zh: string;
  en: string;
  noteZh: string;
  noteEn: string;
  children: ReactNode;
}) {
  return (
    <div className="phy-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">MOTION / EVERYDAY JOURNEYS</span>
        <B zh={zh} en={en} mode={mode} />
      </div>
      {children}
      <p className="phy-model-note">
        <B zh={noteZh} en={noteEn} mode={mode} />
      </p>
    </div>
  );
}
function Choice({
  selected,
  disabled = false,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      aria-pressed={selected}
      className={selected ? 'selected' : ''}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function useCases(required: string[], onExplore?: () => void) {
  const [seen, setSeen] = useState<string[]>([]);
  return {
    count: required.filter((key) => seen.includes(key)).length,
    record: (key: string) => {
      const next = [...new Set([...seen, key])];
      setSeen(next);
      if (required.every((key) => next.includes(key))) onExplore?.();
    },
  };
}
function Readout({
  mode,
  zh,
  en,
  value,
}: {
  mode: LanguageMode;
  zh: string;
  en: string;
  value: ReactNode;
}) {
  return (
    <div>
      <B zh={zh} en={en} mode={mode} />
      <strong>{value}</strong>
    </div>
  );
}
function Track({ position, mode }: { position: number; mode: LanguageMode }) {
  return (
    <g>
      <path d="M90 310h400" stroke="#c7b6d3" strokeWidth="3" />
      <rect x="73" y="268" width="34" height="23" rx="3" fill="#d6ba8d" />
      <path d="M73 291v14m34-14v14" stroke="#ac8b5c" />
      <rect x="474" y="268" width="32" height="30" fill="#c5b1d6" />
      <circle cx="490" cy="261" r="8" fill="#c9a06b" />
      {[0, 1, 2, 3, 4, 5, 6].map((n) => (
        <g key={n}>
          <path d={`M${90 + (n * 400) / 6} 310v7`} stroke="#ab93be" />
          <text
            x={90 + (n * 400) / 6}
            y="337"
            textAnchor="middle"
            fontSize="15"
            fill="#7e658d"
          >
            {n} m
          </text>
        </g>
      ))}
      <g transform={`translate(${90 + (position * 400) / 6},292)`}>
        <circle cy="-18" r="8" fill="#b393c8" />
        <path
          d="M0-9v17m0-10-10 8m10-8 10 8m-10 2-7 8m7-8 7 8"
          fill="none"
          stroke="#9c7bb2"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <text x="90" y="360" textAnchor="middle" fontSize="14" fill="#8f7958">
        {mode === 'en' ? 'Desk' : '书桌'}
      </text>
      <text x="490" y="360" textAnchor="middle" fontSize="14" fill="#8f6fa5">
        {mode === 'en' ? 'Shelf' : '球架'}
      </text>
    </g>
  );
}
export function ReferenceLab({ mode, onExplore }: Props) {
  const [frame, setFrame] = useState<Reference>('ground'),
    [walk, setWalk] = useState<Walking>(0),
    [done, setDone] = useState(false);
  const cases = useCases(
    ['ground-still', 'train-still', 'train-walk'],
    onExplore,
  );
  const animation = useAnimation(2, () => {
    setDone(true);
    cases.record(
      walk === 0
        ? `${frame}-still`
        : frame === 'train'
          ? 'train-walk'
          : 'ground-walk',
    );
  });
  const view = trainView(animation.time * 2, frame, walk),
    trainX = 90 + view.trainPosition * 18,
    personX = 90 + view.passengerPosition * 18;
  const reset = () => {
    animation.reset();
    setDone(false);
  };
  return (
    <Frame
      mode={mode}
      zh="同一个事件 · 两种参考系"
      en="One event · Two reference frames"
      noteZh="日常直线模型：车相对地面匀速2 m/s，乘客起始在车厢左端右侧5 m。行走速率相对车厢为1 m/s；车厢长10 m，观察4 s，以2倍速度播放。忽略加减速与转弯，车与人的图标尺寸仅示意。换参考系后，坐标原点随所选参考系改变。"
      noteEn="Everyday straight-line model: train speed 2 m/s relative to ground, passenger initially 5 m right of its left end. Walking speed relative to train: 1 m/s; train length 10 m. Observe 4 s at 2× playback. Acceleration and turns omitted; icons illustrative. The coordinate origin follows the chosen frame."
    >
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Reference frame' : '参考系'}
        >
          <Choice
            selected={frame === 'ground'}
            disabled={animation.running}
            onClick={() => {
              setFrame('ground');
              reset();
            }}
          >
            <B zh="地面参考系" en="Ground frame" mode={mode} />
          </Choice>
          <Choice
            selected={frame === 'train'}
            disabled={animation.running}
            onClick={() => {
              setFrame('train');
              reset();
            }}
          >
            <B zh="车厢参考系" en="Train frame" mode={mode} />
          </Choice>
        </div>
        <div
          className="phy-segment"
          role="group"
          aria-label={
            mode === 'en'
              ? 'Passenger action relative to train'
              : '乘客相对车厢的动作'
          }
        >
          {([-1, 0, 1] as const).map((n) => (
            <Choice
              key={n}
              selected={walk === n}
              disabled={animation.running}
              onClick={() => {
                setWalk(n);
                reset();
              }}
            >
              <B
                zh={n < 0 ? '向后走' : n > 0 ? '向前走' : '站立'}
                en={n < 0 ? 'Walk backward' : n > 0 ? 'Walk forward' : 'Stand'}
                mode={mode}
              />
            </Choice>
          ))}
        </div>
      </div>
      <svg
        viewBox="0 0 640 265"
        className="phy-simulation phy-motion-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Passenger and train viewed in the chosen reference frame'
            : '所选参考系中的车厢与乘客'
        }
      >
        <path d="M20 212h600" stroke="#c9cbb6" />
        {[0, 5, 10, 15, 20, 25].map((n) => (
          <g key={n} transform={`translate(${90 + (n - view.origin) * 18},0)`}>
            <path d="M0 204v-60" stroke="#b2b69e" strokeWidth="3" />
            <circle cy="139" r="13" fill="#c3c9b1" />
          </g>
        ))}
        <g transform={`translate(${trainX},0)`}>
          <rect y="110" width="180" height="80" rx="10" fill="#d3c2df" />
          <rect x="8" y="118" width="164" height="54" rx="5" fill="#f7f2fb" />
          <circle cx="30" cy="200" r="12" fill="#a389b8" />
          <circle cx="150" cy="200" r="12" fill="#a389b8" />
          <path d="M0 103v100" stroke="#ae94bf" strokeDasharray="3 5" />
        </g>
        <g transform={`translate(${personX},150)`}>
          <circle cy="-15" r="9" fill="#cda570" />
          <path
            d="M0-5v19m-10-9 10-10 10 10m-10 9-8 9m8-9 8 9"
            stroke="#9f7db4"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        {[0, 5, 10, 15, 20, 25].map((n) => (
          <g key={n}>
            <path d={`M${90 + n * 18} 222v7`} stroke="#c4b4d0" />
            <text
              x={90 + n * 18}
              y="251"
              fontSize="15"
              textAnchor="middle"
              fill="#7e658d"
            >
              {n} m
            </text>
          </g>
        ))}
        <text x="90" y="35" fontSize="17" fill="#7e658d">
          {frame === 'ground'
            ? mode === 'en'
              ? 'Origin: platform'
              : '原点：站台起点'
            : mode === 'en'
              ? 'Origin: train left end'
              : '原点：车厢左端'}
        </text>
        <text x="540" y="35" fontSize="22" textAnchor="end" fill="#9372ac">
          {view.time.toFixed(1)} s
        </text>
      </svg>
      <div className="phy-lab-controls">
        <B
          zh={`已比较 ${cases.count}/3：站立的两种参考系、车厢内走动。`}
          en={`Compared ${cases.count}/3: standing in both frames and walking in the train frame.`}
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setDone(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '观察中…' : '播放4秒事件'}
            en={animation.running ? 'Observing…' : 'Play 4-second event'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts" aria-live="polite">
        <Readout
          mode={mode}
          zh="车厢左端位置"
          en="Train left-end position"
          value={`${view.trainPosition.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="乘客位置"
          en="Passenger position"
          value={`${view.passengerPosition.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="相对运动"
          en="Relative motion"
          value={
            <B
              zh={
                view.passengerVelocity === 0
                  ? '静止'
                  : `${view.passengerVelocity < 0 ? '向左' : '向右'} ${Math.abs(view.passengerVelocity)} m/s`
              }
              en={
                view.passengerVelocity === 0
                  ? 'At rest'
                  : `${view.passengerVelocity < 0 ? 'Left' : 'Right'} ${Math.abs(view.passengerVelocity)} m/s`
              }
              mode={mode}
            />
          }
        />
      </div>
      {done && (
        <p className="phy-skill-check">
          <B
            zh="记录的是相同4秒事件。换参考系，再比较一次。"
            en="The same four-second event is recorded. Compare it in another frame."
            mode={mode}
          />
        </p>
      )}
    </Frame>
  );
}
export function JourneyLab({ mode, onExplore }: Props) {
  const [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false),
    [records, setRecords] = useState<ReturnType<typeof returnJourney>[]>([]);
  const cases = useCases(['shelf', 'home'], onExplore),
    animation = useAnimation(3, () => {
      setTime(6);
      setPlaying(false);
    }),
    state = returnJourney(playing ? animation.time * 2 : time);
  const jump = (n: number) => {
    animation.reset();
    setPlaying(false);
    setTime(n);
  };
  const record = () => {
    setRecords((old) => [...old.slice(-5), state]);
    cases.record(
      state.time === 3 ? 'shelf' : state.time === 6 ? 'home' : 'other',
    );
  };
  return (
    <Frame
      mode={mode}
      zh="书桌 → 球架 → 书桌"
      en="Desk → Shelf → Desk"
      noteZh="一维往返模型：起点0 m，球架6 m，两段速率均2 m/s，无停留；理想化为瞬时转向。整趟6 s，以2倍速度播放。向右为正方向。图上人物仅示意，位移不等于累计路程。"
      noteEn="One-dimensional trip: start 0 m, shelf 6 m, both segments at 2 m/s, no pause; reversal idealized as instantaneous. Six-second trip at 2× playback. Right is positive. Person icon illustrative; displacement is not accumulated distance."
    >
      <svg
        viewBox="0 210 640 170"
        className="phy-simulation phy-motion-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Out-and-back walk between desk and shelf'
            : '书桌与球架之间的往返路径'
        }
      >
        <path
          d="M90 231h390m-8-6 8 6-8 6"
          stroke="#b79ccc"
          fill="none"
          strokeWidth="2"
        />
        <path
          d="M490 248H100m8-6-8 6 8 6"
          stroke="#c9a06b"
          fill="none"
          strokeWidth="2"
        />
        <Track position={state.position} mode={mode} />
      </svg>
      <div className="phy-lab-controls">
        <div className="phy-segment">
          <button disabled={animation.running} onClick={() => jump(3)}>
            <B zh="到球架：3 s" en="At shelf: 3 s" mode={mode} />
          </button>
          <button disabled={animation.running} onClick={() => jump(6)}>
            <B zh="回起点：6 s" en="Home: 6 s" mode={mode} />
          </button>
        </div>
        <button
          className="phy-button secondary"
          disabled={animation.running}
          onClick={() => {
            setTime(0);
            setPlaying(true);
            animation.start();
          }}
        >
          <B zh="播放往返" en="Play trip" mode={mode} />
        </button>
      </div>
      <label className="phy-motion-time">
        <B zh="观察时刻" en="Observation time" mode={mode} />
        <input
          type="range"
          min="0"
          max="6"
          step="0.5"
          value={state.time}
          disabled={animation.running}
          onChange={(e) => jump(Number(e.target.value))}
        />
        <strong>{state.time.toFixed(1)} s</strong>
      </label>
      <div className="phy-skill-readouts" aria-live="polite">
        <Readout
          mode={mode}
          zh="位置 x"
          en="Position x"
          value={`${state.position.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="累计路程 s"
          en="Accumulated distance s"
          value={`${state.distance.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="位移 Δx（右为正）"
          en="Displacement Δx (right positive)"
          value={`${state.displacement > 0 ? '+' : ''}${state.displacement.toFixed(1)} m`}
        />
      </div>
      <div className="phy-lab-controls">
        <B
          zh={`已记录 ${cases.count}/2：到球架、回到起点。`}
          en={`Recorded ${cases.count}/2: at shelf and back home.`}
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={record}
        >
          <B zh="记录当前位置" en="Record this position" mode={mode} />
        </button>
      </div>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="同一趟往返的观察"
                en="Observations from one trip"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>t (s)</th>
                <th>
                  <B zh="位置（m）" en="Position (m)" mode={mode} />
                </th>
                <th>
                  <B zh="路程（m）" en="Distance (m)" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{r.time.toFixed(1)}</td>
                  <td>{r.position.toFixed(1)}</td>
                  <td>{r.distance.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Frame>
  );
}
export function AverageLab({ mode, onExplore }: Props) {
  const [pause, setPause] = useState(0),
    [finished, setFinished] = useState(false);
  const cases = useCases(['0', '3'], onExplore),
    trip = averageTrip(pause),
    animation = useAnimation(trip.totalTime / 2, () => {
      setFinished(true);
      cases.record(String(pause));
    }),
    state = averageTripState(animation.time * 2, pause);
  return (
    <Frame
      mode={mode}
      zh="去程2 m/s · 回程1 m/s"
      en="Outward 2 m/s · Return 1 m/s"
      noteZh="指定直线行程：两段各6 m，去程3 s、回程6 s，可选停留3 s。每段匀速，转向及起停理想化为瞬时，以2倍速度播放。全程平均速率包含停留；表中是规定的模型数据，不是你的真实步行测量。"
      noteEn="Specified straight-line trip: each segment 6 m, outward 3 s, return 6 s; optional 3 s pause. Constant speed per segment; turning and starts/stops idealized as instantaneous. Playback 2×. Whole-trip average includes the pause; these are prescribed model data, not your real walking measurements."
    >
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Pause at shelf' : '球架处停留'}
        >
          {[0, 3].map((n) => (
            <Choice
              key={n}
              selected={pause === n}
              disabled={animation.running}
              onClick={() => {
                setPause(n);
                setFinished(false);
                animation.reset();
              }}
            >
              <B
                zh={n ? '停留3 s' : '不停留'}
                en={n ? 'Pause 3 s' : 'No pause'}
                mode={mode}
              />
            </Choice>
          ))}
        </div>
        <span>
          {state.time.toFixed(1)} / {trip.totalTime} s
        </span>
      </div>
      <svg
        viewBox="0 210 640 170"
        className="phy-simulation phy-motion-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Journey with two speeds and an optional pause'
            : '两段速率与可选停留的往返行程'
        }
      >
        <text x="90" y="240" fontSize="19" fill="#9f7ab7">
          {state.phase === 'pause'
            ? mode === 'en'
              ? 'Waiting at the shelf'
              : '在球架处停留'
            : state.phase === 'return'
              ? '← 1 m/s'
              : state.phase === 'finished'
                ? mode === 'en'
                  ? 'Trip complete'
                  : '行程结束'
                : '2 m/s →'}
        </text>
        <Track position={state.position} mode={mode} />
      </svg>
      <div className="phy-lab-controls">
        <B
          zh={`已比较 ${cases.count}/2：含停留与不停留。`}
          en={`Compared ${cases.count}/2: with and without a pause.`}
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setFinished(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '行程中…' : '开始完整行程'}
            en={animation.running ? 'Travelling…' : 'Start complete trip'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-data-table-wrap">
        <table className="phy-data-table">
          <caption>
            <B
              zh="先合并路程和时间"
              en="Combine distance and time first"
              mode={mode}
            />
          </caption>
          <thead>
            <tr>
              <th>
                <B zh="部分" en="Part" mode={mode} />
              </th>
              <th>
                <B zh="路程（m）" en="Distance (m)" mode={mode} />
              </th>
              <th>
                <B zh="时间（s）" en="Time (s)" mode={mode} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <B zh="去程" en="Outward" mode={mode} />
              </td>
              <td>6</td>
              <td>3</td>
            </tr>
            <tr>
              <td>
                <B zh="停留" en="Pause" mode={mode} />
              </td>
              <td>0</td>
              <td>{pause}</td>
            </tr>
            <tr>
              <td>
                <B zh="回程" en="Return" mode={mode} />
              </td>
              <td>6</td>
              <td>6</td>
            </tr>
          </tbody>
        </table>
      </div>
      {finished && (
        <div className="phy-skill-readouts" aria-live="polite">
          <Readout
            mode={mode}
            zh="总路程 / 总时间"
            en="Distance / elapsed time"
            value={`12 m / ${trip.totalTime} s`}
          />
          <Readout
            mode={mode}
            zh="全程平均速率"
            en="Whole-trip average speed"
            value={`${trip.averageSpeed.toFixed(2)} m/s`}
          />
          <Readout
            mode={mode}
            zh="全程平均速度"
            en="Whole-trip average velocity"
            value="0 m/s"
          />
        </div>
      )}
    </Frame>
  );
}
export function MotionGraphLab({ mode, onExplore }: Props) {
  const [time, setTime] = useState(0),
    [kind, setKind] = useState<'position' | 'distance'>('position');
  const cases = useCases(
      ['pause', 'position-return', 'distance-return'],
      onExplore,
    ),
    state = returnJourney(time, 2),
    value = kind === 'position' ? state.position : state.distance,
    px = (t: number) => 90 + t * 50,
    py = (v: number) => 240 - v * 15,
    points = [0, 3, 5, 8]
      .map((t) => {
        const r = returnJourney(t, 2);
        return `${px(t)},${py(kind === 'position' ? r.position : r.distance)}`;
      })
      .join(' ');
  const record = () =>
    cases.record(
      time > 3 && time < 5
        ? 'pause'
        : time > 5 && time < 8
          ? `${kind}-return`
          : 'other',
    );
  return (
    <Frame
      mode={mode}
      zh="同一趟行程，先看纵轴"
      en="One trip: inspect the vertical axis"
      noteZh="与上一站不同，本行程两段均2 m/s，在球架处停留2 s，总时间8 s。直线运动、瞬时起停与转向的简化模型。两图采用相同时间与米尺度；下方是位置轨道，不是图线所代表的地形。"
      noteEn="Unlike the previous station, both segments here are 2 m/s, with a 2 s pause at the shelf: total 8 s. Simplified straight-line motion with instantaneous starts/stops and reversal. Both graphs share time and metre scales. The lower strip shows position, not terrain represented by the graph line."
    >
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Graph variable' : '图像变量'}
        >
          <Choice
            selected={kind === 'position'}
            onClick={() => setKind('position')}
          >
            <B zh="位置—时间" en="Position–time" mode={mode} />
          </Choice>
          <Choice
            selected={kind === 'distance'}
            onClick={() => setKind('distance')}
          >
            <B zh="累计路程—时间" en="Distance–time" mode={mode} />
          </Choice>
        </div>
        <strong>{kind === 'position' ? 'x (m)' : 's (m)'}</strong>
      </div>
      <svg
        viewBox="0 0 640 415"
        className="phy-simulation phy-motion-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Motion graph, current point and linked position track'
            : '运动图、当前读数点与对应位置轨道'
        }
      >
        {[0, 3, 6, 9, 12].map((n) => (
          <g key={n}>
            <path d={`M90 ${py(n)}h400`} stroke="#e4dae9" />
            <text
              x="73"
              y={py(n) + 5}
              textAnchor="end"
              fontSize="15"
              fill="#7e658d"
            >
              {n}
            </text>
          </g>
        ))}
        <path d="M90 42v198h400" stroke="#b29dc1" fill="none" />
        {[0, 2, 4, 6, 8].map((n) => (
          <g key={n}>
            <path d={`M${px(n)} 240v7`} stroke="#b29dc1" />
            <text
              x={px(n)}
              y="263"
              textAnchor="middle"
              fontSize="15"
              fill="#7e658d"
            >
              {n}
            </text>
          </g>
        ))}
        <text x="57" y="32" fontSize="19" fill="#7e658d">
          {kind === 'position' ? 'x (m)' : 's (m)'}
        </text>
        <text x="512" y="253" fontSize="17" fill="#7e658d">
          t (s)
        </text>
        <polyline
          points={points}
          stroke={kind === 'position' ? '#ab87c2' : '#bc9b6c'}
          strokeWidth="4"
          fill="none"
        />
        <path
          d={`M${px(time)} 44V240`}
          stroke="#c7b5d4"
          strokeDasharray="4 5"
        />
        <circle
          cx={px(time)}
          cy={py(value)}
          r="8"
          fill="#9973b4"
          stroke="#faf6fd"
          strokeWidth="2"
        />
        <g transform="translate(0,35)">
          <Track position={state.position} mode={mode} />
        </g>
      </svg>
      <div className="phy-lab-controls">
        <div className="phy-segment">
          {[4, 7, 8].map((n) => (
            <button key={n} onClick={() => setTime(n)}>
              <B
                zh={`${n === 4 ? '停留' : n === 7 ? '回程' : '终点'} ${n} s`}
                en={`${n === 4 ? 'Pause' : n === 7 ? 'Return' : 'End'} ${n} s`}
                mode={mode}
              />
            </button>
          ))}
        </div>
      </div>
      <label className="phy-motion-time">
        <B zh="观察时刻" en="Observation time" mode={mode} />
        <input
          type="range"
          min="0"
          max="8"
          step="0.5"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
        <strong>{time.toFixed(1)} s</strong>
      </label>
      <div className="phy-skill-readouts" aria-live="polite">
        <Readout
          mode={mode}
          zh="位置"
          en="Position"
          value={`${state.position.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="累计路程"
          en="Accumulated distance"
          value={`${state.distance.toFixed(1)} m`}
        />
        <Readout
          mode={mode}
          zh="图上当前读数"
          en="Current graph reading"
          value={`${kind === 'position' ? 'x' : 's'} = ${value.toFixed(1)} m`}
        />
      </div>
      <div className="phy-lab-controls">
        <B
          zh={`已记录 ${cases.count}/3：停留、回程位置图、回程路程图。`}
          en={`Recorded ${cases.count}/3: pause, return-position and return-distance graphs.`}
          mode={mode}
        />
        <button className="phy-button" onClick={record}>
          <B zh="记录图像观察" en="Record graph observation" mode={mode} />
        </button>
      </div>
    </Frame>
  );
}
