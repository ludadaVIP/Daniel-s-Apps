import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { useAnimation } from './useSimulation';
import {
  mirrorRay,
  polarizedWall,
  brakingState,
  fairTestResult,
  type Charge,
} from './discoveryModels';
type Props = { mode: LanguageMode; onExplore?: () => void };
function Title({
  zh,
  en,
  mode,
}: {
  zh: string;
  en: string;
  mode: LanguageMode;
}) {
  return (
    <div className="phy-lab-toolbar">
      <span className="phy-lab-label">EVERYDAY / DISCOVERY</span>
      <B zh={zh} en={en} mode={mode} />
    </div>
  );
}
function Note({
  zh,
  en,
  mode,
}: {
  zh: string;
  en: string;
  mode: LanguageMode;
}) {
  return (
    <p className="phy-model-note">
      <B zh={zh} en={en} mode={mode} />
    </p>
  );
}
export function MirrorLab({ mode, onExplore }: Props) {
  const [distance, setDistance] = useState(40),
    [seen, setSeen] = useState<number[]>([40]);
  const object = { x: 350 - distance * 2, y: 220 },
    eye = { x: 85, y: 95 },
    ray = mirrorRay(object, eye, 350);
  return (
    <div className="phy-lab">
      <Title
        zh="镜前真实光路 · 镜后虚线延长"
        en="Real rays in front · Dashed extensions behind"
        mode={mode}
      />
      <svg
        viewBox="0 0 650 310"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Object, plane mirror, eye and virtual image'
            : '物体、平面镜、眼睛与虚像'
        }
        className="phy-simulation"
      >
        <rect
          x="350"
          y="35"
          width="270"
          height="235"
          fill="#ede6f3"
          opacity=".45"
        />
        <path d="M350 30v245" stroke="#aa93bd" strokeWidth="6" />
        <path
          d={`M${object.x} ${object.y}L350 ${ray.reflection.y}L85 95`}
          fill="none"
          stroke="#bc9868"
          strokeWidth="3"
        />
        <path
          d={`M350 ${ray.reflection.y}L${ray.image.x} 220`}
          fill="none"
          stroke="#b6a0c8"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
        <path
          d={`M310 ${ray.reflection.y}h80`}
          stroke="#c8bacf"
          strokeDasharray="3 5"
        />
        <rect
          x={object.x - 10}
          y="185"
          width="20"
          height="65"
          rx="4"
          fill="#a2bbae"
        />
        <rect x={object.x + 3} y="185" width="7" height="25" fill="#d0a473" />
        <rect
          x={ray.image.x - 10}
          y="185"
          width="20"
          height="65"
          rx="4"
          fill="#a2bbae"
          opacity=".6"
        />
        <rect
          x={ray.image.x - 10}
          y="185"
          width="7"
          height="25"
          fill="#d0a473"
          opacity=".6"
        />
        <circle cx="85" cy="95" r="11" fill="#b19ac8" />
        <circle cx="85" cy="95" r="4" fill="#705786" />
        <text x="85" y="75" fontSize="14" textAnchor="middle" fill="#997fab">
          {mode === 'en' ? 'Eye' : '眼睛'}
        </text>
        <path d={`M${object.x} 272H350H${ray.image.x}`} stroke="#c8bacf" />
        <text
          x={(object.x + 350) / 2}
          y="294"
          fontSize="15"
          textAnchor="middle"
          fill="#a080b2"
        >
          {distance} cm
        </text>
        <text
          x={(ray.image.x + 350) / 2}
          y="294"
          fontSize="15"
          textAnchor="middle"
          fill="#a080b2"
        >
          {distance} cm
        </text>
      </svg>
      <div className="phy-slider-row">
        <label>
          <B
            zh="物体到镜面的距离"
            en="Object distance from mirror"
            mode={mode}
          />
          <input
            type="range"
            min="20"
            max="100"
            step="20"
            value={distance}
            onChange={(e) => {
              const d = Number(e.target.value);
              setDistance(d);
              const next = [...new Set([...seen, d])];
              setSeen(next);
              if (next.some((v) => v <= 40) && next.some((v) => v >= 60))
                onExplore?.();
            }}
          />
          <strong>{distance} cm</strong>
        </label>
      </div>
      <p className="phy-lab-result" role="status">
        <B
          zh={`像距 ${distance} cm；物体与像相隔 ${distance * 2} cm。上下保持一致，朝镜面的标记在像中朝另一侧。`}
          en={`Image distance: ${distance} cm; object–image separation: ${distance * 2} cm. Up/down is unchanged; the mirror-facing marker reverses across the surface.`}
          mode={mode}
        />
      </p>
      <Note
        zh="理想平面镜的侧视光路图，只画一个物点到眼睛的光线。实线路径顺序为物体到镜面再到眼睛；虚线为向后延长。物体及像的图标尺寸是示意。镜后没有画出的真实透射光；模型不适用于曲面镜。"
        en="Side-view ray construction for an ideal plane mirror, using one object point and one eye. The solid path runs object to mirror to eye; dashed extensions run backward. Object/image icon sizes are illustrative. No real transmitted ray is shown behind the mirror; this model does not apply to curved mirrors."
        mode={mode}
      />
    </div>
  );
}
export function StaticLab({ mode, onExplore }: Props) {
  const [charge, setCharge] = useState<Charge>(0),
    [near, setNear] = useState(true),
    [records, setRecords] = useState<string[]>([]);
  const wall = polarizedWall(charge),
    x = near ? 310 : 160;
  const record = () => {
    const next = [...new Set([...records, `${charge}:${near}`])];
    setRecords(next);
    if (
      next.includes('0:true') &&
      next.includes('-1:true') &&
      next.includes('-1:false')
    )
      onExplore?.();
  };
  const sign = (v: number) => (v > 0 ? '+' : '−');
  return (
    <div className="phy-lab">
      <Title
        zh="中性墙面：总电荷不变"
        en="Neutral wall: unchanged total charge"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Charge state' : '电荷状态'}
        >
          {([0, -1, 1] as const).map((v) => (
            <button
              key={v}
              aria-pressed={charge === v}
              className={charge === v ? 'selected' : ''}
              onClick={() => setCharge(v)}
            >
              <B
                zh={v === 0 ? '未带电' : v === -1 ? '负电' : '正电'}
                en={v === 0 ? 'Uncharged' : v === -1 ? 'Negative' : 'Positive'}
                mode={mode}
              />
            </button>
          ))}
        </div>
        <button className="phy-text-button" onClick={() => setCharge(-1)}>
          <B zh="摩擦模型 → 负电" en="Rubbing model → negative" mode={mode} />
        </button>
      </div>
      <svg
        viewBox="0 0 600 280"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Balloon and local charge tendencies in a neutral wall'
            : '气球与中性墙面局部电性偏差'
        }
      >
        <rect x="435" y="30" width="105" height="212" rx="7" fill="#eee6f1" />
        <ellipse cx={x} cy="125" rx="47" ry="59" fill="#c1a7d8" />
        <path d={`M${x} 184q-12 20 5 33t-4 28`} stroke="#c9b9d2" fill="none" />
        {charge !== 0 &&
          [-1, 0, 1].map((n) => (
            <text
              key={n}
              x={x + n * 18}
              y="129"
              textAnchor="middle"
              fontSize="22"
              fill="#846495"
            >
              {sign(charge)}
            </text>
          ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <text
              x="460"
              y={65 + i * 34}
              textAnchor="middle"
              fontSize="21"
              fill="#bc9879"
            >
              {charge === 0 ? (i % 2 ? '+' : '−') : sign(wall.near)}
            </text>
            <text
              x="505"
              y={65 + i * 34}
              textAnchor="middle"
              fontSize="21"
              fill="#9478ae"
            >
              {charge === 0 ? (i % 2 ? '−' : '+') : sign(wall.far)}
            </text>
          </g>
        ))}
        {charge !== 0 && (
          <path
            d={`M${x + 55} 126h40m-10-6 10 6-10 6`}
            stroke="#c59e6e"
            strokeWidth={near ? 3 : 1}
            fill="none"
          />
        )}
        <text x="488" y="265" textAnchor="middle" fontSize="15" fill="#a086b3">
          {mode === 'en' ? 'Net charge: 0' : '总电荷：0'}
        </text>
      </svg>
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Distance' : '距离'}
        >
          {[true, false].map((v) => (
            <button
              key={String(v)}
              aria-pressed={near === v}
              className={near === v ? 'selected' : ''}
              onClick={() => setNear(v)}
            >
              <B zh={v ? '靠近' : '远离'} en={v ? 'Near' : 'Far'} mode={mode} />
            </button>
          ))}
        </div>
        <button className="phy-button" onClick={record}>
          <B zh="记录观察" en="Record observation" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-result" role="status">
        <B
          zh={
            charge === 0
              ? '未增加净电荷：本图不显示带电气球造成的极化趋势。'
              : near
                ? '近处更容易看到局部正负分布的影响；墙仍总体中性。'
                : '远处吸引通常更弱；图中保留放大的区域符号帮助比较。'
          }
          en={
            charge === 0
              ? 'No added net charge: this diagram does not show charged-balloon polarization.'
              : near
                ? 'Nearby charge makes local positive/negative tendencies easier to see; the wall stays neutral overall.'
                : 'Attraction is generally weaker farther away; enlarged region signs remain visible for comparison.'
          }
          mode={mode}
        />
      </p>
      <p className="phy-discovery-checklist">
        <B
          zh={`已记录 ${['0:true', '-1:true', '-1:false'].filter((r) => records.includes(r)).length}/3：近处未带电、近处负电、远处负电。`}
          en={`Recorded ${['0:true', '-1:true', '-1:false'].filter((r) => records.includes(r)).length}/3: uncharged near, negative near, negative far.`}
          mode={mode}
        />
      </p>
      <Note
        zh="定性极化示意，不计算真实电荷量、力或能否贴住。正负符号表示局部偏差，数量与位移都被放大；不是正离子自由穿行。摩擦带负电是所选材料模型，真实电性与材料有关。吸引方向是横向的；贴住还需要考虑重力与接触摩擦。"
        en="Qualitative polarization diagram, not a calculation of charge, force or clinging. Signs show local tendencies with enlarged amounts and shifts, not freely traveling positive ions. Negative charging is the selected rubbing model; real polarity depends on materials. Attraction is horizontal; clinging also involves weight and contact friction."
        mode={mode}
      />
    </div>
  );
}
export function SeatbeltLab({ mode, onExplore }: Props) {
  const [belt, setBelt] = useState(true),
    [done, setDone] = useState(false),
    [records, setRecords] = useState<boolean[]>([]);
  const end = brakingState(0, false).contactTime;
  const animation = useAnimation(end / 0.5, () => {
    setDone(true);
    const next = [...new Set([...records, belt])];
    setRecords(next);
    if (next.length === 2) onExplore?.();
  });
  const model = brakingState(animation.time * 0.5, belt);
  const carX = 80 + model.vehicleDistance * 110,
    personX = 260 + model.passengerDistance * 110;
  return (
    <div className="phy-lab">
      <Title
        zh="玩具模型 · 初始速率 2 m/s"
        en="Toy model · Initial speed 2 m/s"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Restraint' : '是否固定'}
        >
          {[true, false].map((v) => (
            <button
              key={String(v)}
              disabled={animation.running}
              className={belt === v ? 'selected' : ''}
              aria-pressed={belt === v}
              onClick={() => {
                setBelt(v);
                setDone(false);
                animation.reset();
              }}
            >
              <B
                zh={v ? '已系带' : '未系带'}
                en={v ? 'Belt on' : 'Belt off'}
                mode={mode}
              />
            </button>
          ))}
        </div>
        <B zh="观察相对位置" en="Watch relative positions" mode={mode} />
      </div>
      <svg
        viewBox="0 0 600 280"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Toy passenger and vehicle slowing down'
            : '玩具乘客与车辆减速的示意'
        }
      >
        <path d="M35 227h530" stroke="#d5c6df" strokeWidth="3" />
        <g transform={`translate(${carX} 0)`}>
          <rect y="80" width="340" height="120" rx="17" fill="#ded3e9" />
          <rect x="20" y="90" width="270" height="87" rx="8" fill="#faf7fd" />
          <path d="M290 90v87" stroke="#bca4cf" strokeWidth="4" />
          <path
            d="M160 125v53h45"
            fill="none"
            stroke="#c7b7d3"
            strokeWidth="8"
          />
          <circle cx="55" cy="208" r="18" fill="#a18bb3" />
          <circle cx="285" cy="208" r="18" fill="#a18bb3" />
        </g>
        <g transform={`translate(${personX} 0)`}>
          <circle cy="116" r="13" fill="#c7a274" />
          <rect x="-11" y="133" width="22" height="38" rx="5" fill="#b099c8" />
          {belt && <path d="M-14 133l28 32" stroke="#775a94" strokeWidth="5" />}
        </g>
        {!belt && !model.contact && (
          <path
            d={`M${personX + 20} 143h35m-8-6 8 6-8 6`}
            fill="none"
            stroke="#c8a171"
            strokeWidth="3"
          />
        )}
        <text x="120" y="255" fontSize="15" fill="#a184b7">
          {mode === 'en' ? 'Vehicle' : '车'}: {model.vehicleSpeed.toFixed(1)}{' '}
          m/s
        </text>
        <text x="390" y="255" fontSize="15" textAnchor="middle" fill="#a184b7">
          {mode === 'en' ? 'Passenger' : '乘客'}:{' '}
          {model.passengerSpeed === null
            ? '—'
            : model.passengerSpeed.toFixed(1) + ' m/s'}
        </text>
      </svg>
      <div className="phy-lab-controls">
        <B
          zh={`已比较 ${records.length}/2：系带与未系带。`}
          en={`Compared ${records.length}/2: belt on and off.`}
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
            zh={animation.running ? '减速中…' : '开始减速'}
            en={animation.running ? 'Slowing…' : 'Start braking'}
            mode={mode}
          />
        </button>
      </div>
      {done && (
        <p className="phy-lab-result" role="status">
          <B
            zh={
              belt
                ? '车与乘客一起减速到零，相对位置保持不变。'
                : '车已停止，乘客继续向前到车前端；接触前速率仍为 2 m/s。接触时结束观察，不计算碰撞后速率。'
            }
            en={
              belt
                ? 'Vehicle and passenger slow to zero together, keeping relative position.'
                : 'The stopped vehicle does not stop the passenger, who reaches the front at 2 m/s just before contact. Observation ends at contact; post-collision speed is not calculated.'
            }
            mode={mode}
          />
        </p>
      )}
      <Note
        zh="地面参考系中的直线模型：车以 5 m/s² 减速，理想系带乘客跟随车；未系带时省略水平摩擦。前端间距 1 m，以 0.5 倍速度播放。只讨论运动与作用，车和人的图标尺寸不按比例；不模拟真实安全带伸长、碰撞力或伤害。"
        en="Straight-line ground-frame model: vehicle deceleration 5 m/s²; ideal belt makes the passenger follow it. Horizontal friction is omitted when unrestrained. Front gap: 1 m; playback: 0.5× speed. Icons are not to scale. Real belt stretch, collision forces and injuries are not simulated."
        mode={mode}
      />
    </div>
  );
}
export function FairTestLab({ mode, onExplore }: Props) {
  const [speed, setSpeed] = useState(2),
    [rough, setRough] = useState(false),
    [records, setRecords] = useState<
      { speed: number; rough: boolean; distance: number }[]
    >([]);
  const model = fairTestResult(speed, rough),
    duration = speed / model.deceleration;
  const animation = useAnimation(duration / 2, () => {
    const next = [...records.slice(-7), model];
    setRecords(next);
    if (
      next.some((r) => !r.rough && r.speed === 2) &&
      next.some((r) => r.rough && r.speed === 3) &&
      next.some((r) => r.rough && r.speed === 2)
    )
      onExplore?.();
  });
  const t = Math.min(duration, animation.time * 2),
    distance = speed * t - 0.5 * model.deceleration * t * t;
  return (
    <div className="phy-lab">
      <Title
        zh="两种条件，四种组合"
        en="Two conditions, four combinations"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Starting speed' : '起始速率'}
        >
          {[2, 3].map((v) => (
            <button
              key={v}
              disabled={animation.running}
              className={v === speed ? 'selected' : ''}
              aria-pressed={v === speed}
              onClick={() => {
                setSpeed(v);
                animation.reset();
              }}
            >
              {v} m/s
            </button>
          ))}
        </div>
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Surface' : '地面'}
        >
          {[false, true].map((v) => (
            <button
              key={String(v)}
              disabled={animation.running}
              className={v === rough ? 'selected' : ''}
              aria-pressed={v === rough}
              onClick={() => {
                setRough(v);
                animation.reset();
              }}
            >
              <B
                zh={v ? '粗糙' : '光滑'}
                en={v ? 'Rough' : 'Smooth'}
                mode={mode}
              />
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox="0 0 600 170"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Ball stopping with controlled speed and surface'
            : '控制起始速率与地面的小球停止示意'
        }
      >
        <rect
          x="50"
          y="100"
          width="490"
          height="25"
          rx="5"
          fill={rough ? '#dcc2a2' : '#dfd3ec'}
        />
        {rough &&
          Array.from({ length: 25 }, (_, i) => (
            <path
              key={i}
              d={`m${55 + i * 19} 112 8-5 8 5`}
              stroke="#ba9972"
              fill="none"
            />
          ))}
        <circle cx={50 + distance * 49} cy="82" r="17" fill="#a990bf" />
        <text x="300" y="47" textAnchor="middle" fontSize="20" fill="#9c80b2">
          {distance.toFixed(2)} m
        </text>
        <text x="50" y="148" fontSize="12" fill="#ab94bb">
          0 m
        </text>
        <text x="540" y="148" textAnchor="end" fontSize="12" fill="#ab94bb">
          10 m
        </text>
      </svg>
      <div className="phy-lab-controls">
        <B
          zh="需要记录：光滑 2、粗糙 3、粗糙 2 m/s。"
          en="Record: smooth 2, rough 3, rough 2 m/s."
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <B zh="释放并记录" en="Release and record" mode={mode} />
        </button>
      </div>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="找出只改变一个条件的记录"
                en="Find records changing just one condition"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="地面" en="Surface" mode={mode} />
                </th>
                <th>
                  <B zh="起始（m/s）" en="Start (m/s)" mode={mode} />
                </th>
                <th>
                  <B zh="停止距离（m）" en="Stop distance (m)" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>
                    <B
                      zh={r.rough ? '粗糙' : '光滑'}
                      en={r.rough ? 'Rough' : 'Smooth'}
                      mode={mode}
                    />
                  </td>
                  <td>{r.speed}</td>
                  <td>{r.distance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Note
        zh="同一颗球在水平面上恒定减速：光滑 0.5、粗糙 2 m/s²。以 2 倍速度播放，停止距离为 v₀²/(2a)。这些是指定条件的模型结果，不是你家地板的测量；真实实验应重复，并检查推法与坡度。"
        en="Same ball with constant horizontal deceleration: smooth 0.5, rough 2 m/s². Playback 2×; stopping distance v₀²/(2a). These are model results for specified conditions, not measurements of your floor. Repeat real trials and check release method and slopes."
        mode={mode}
      />
    </div>
  );
}
