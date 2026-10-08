import { useState, type ReactNode } from 'react';
import { B } from '../ui';
import { useAnimation } from './useSimulation';
import {
  LabOptions as Options,
  LabMetric as Metric,
  useComparisons,
  type LabProps as Props,
} from './LabControls';
import {
  gravityMeasurement,
  balanceTilt,
  gravityFall,
  type GravityLocation,
} from './gravityModels';
const masses = [0.5, 1, 2].map((id) => ({
  id,
  zh: `${id} kg`,
  en: `${id} kg`,
}));
const locations = [
  { id: 0, zh: '地球', en: 'Earth' },
  { id: 1, zh: '月球', en: 'Moon' },
];
const locationName = (where: GravityLocation): [string, string] =>
  where === 'earth' ? ['地球', 'Earth'] : ['月球', 'Moon'];
function Shell({
  mode,
  title,
  note,
  children,
}: Props & {
  title: [string, string];
  note: [string, string];
  children: ReactNode;
}) {
  return (
    <div className="phy-lab phy-forces-lab phy-gravity-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">GRAVITY / A BACKPACK’S JOURNEY</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      {children}
      <p className="phy-model-note">
        <B zh={note[0]} en={note[1]} mode={mode} />
      </p>
    </div>
  );
}
function Backpack({ x, y, mass }: { x: number; y: number; mass: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path
        d="M-12 5V0c0-10 24-10 24 0v5"
        stroke="#9f82b4"
        fill="none"
        strokeWidth="4"
      />
      <rect x="-26" y="4" width="52" height="54" rx="10" fill="#b89dca" />
      <path d="M-20 40h40" stroke="#8f6da3" strokeWidth="2" />
      <text x="0" y="28" textAnchor="middle" fill="#fffaf4" fontSize="16">
        {mass} kg
      </text>
    </g>
  );
}
type Measurement = { mass: number; location: GravityLocation; weight: number };
function Records({
  mode,
  records,
  caption,
}: Props & { records: Measurement[]; caption: [string, string] }) {
  return (
    <div className="phy-data-table-wrap">
      <table className="phy-data-table">
        <caption>
          <B zh={caption[0]} en={caption[1]} mode={mode} />
        </caption>
        <thead>
          <tr>
            {(
              [
                ['地点', 'Place'],
                ['质量', 'Mass'],
                ['重力', 'Weight'],
              ] as const
            ).map(([zh, en]) => (
              <th key={en} scope="col">
                <B zh={zh} en={en} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={`${r.location}-${r.mass}`}>
              <th scope="row">
                <B
                  zh={locationName(r.location)[0]}
                  en={locationName(r.location)[1]}
                  mode={mode}
                />
              </th>
              <td>{r.mass} kg</td>
              <td>{r.weight.toFixed(1)} N</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function useRecords() {
  const [records, setRecords] = useState<Measurement[]>([]);
  return {
    records,
    record: (mass: number, location: GravityLocation) => {
      const m = gravityMeasurement(mass, location);
      setRecords((old) =>
        [
          ...old.filter((r) => r.mass !== mass || r.location !== location),
          { mass, location, weight: m.weight },
        ].slice(-6),
      );
    },
  };
}
export function MassWeightLab({ mode, onExplore }: Props) {
  const [mass, setMass] = useState(1),
    [reference, setReference] = useState(0.5);
  const state = gravityMeasurement(mass, 'earth'),
    tilt = balanceTilt(mass, reference),
    balanced = mass === reference;
  const cases = useComparisons(['1', '2'], onExplore),
    history = useRecords();
  const angle = (tilt * Math.PI) / 180;
  const left = { x: 180 - 90 * Math.cos(angle), y: 133 - 90 * Math.sin(angle) },
    right = { x: 180 + 90 * Math.cos(angle), y: 133 + 90 * Math.sin(angle) };
  const springEnd = 106 + state.weight * 4;
  return (
    <Shell
      mode={mode}
      title={['同一背包的两次测量', 'Two measurements of one backpack']}
      note={[
        '理想等臂天平比较已知参考质量，平衡时两边质量相等。静止悬挂测力计显示拉力，在本例等于重力；地球g取10 N/kg。弹簧k=50 N/m，图中伸长正比于拉力，只画静态形变，不模拟振动。两幅图表示分别测量，非两件仪器同时支撑同一个背包。',
        'An ideal equal-arm balance compares reference masses; equal masses balance. The stationary hanging force meter reads tension, equal to weight here; Earth g=10 N/kg. Spring k=50 N/m; extension is proportional to force, with static deformation only. The drawings represent separate measurements, not two instruments jointly supporting one backpack.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['模型背包质量', 'Model backpack mass']}
          values={masses}
          value={mass}
          set={setMass}
        />
        <Options
          mode={mode}
          name={['参考砝码', 'Reference masses']}
          values={masses}
          value={reference}
          set={setReference}
        />
      </div>
      <svg
        viewBox="0 0 680 320"
        className="phy-simulation phy-gravity-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Balance and force meter compare the same backpack'
            : '天平与测力计分别测量同一背包'
        }
      >
        <text x="180" y="40" textAnchor="middle" fill="#876394" fontSize="17">
          {mode === 'en' ? 'Mass · kg' : '质量 · kg'}
        </text>
        <text x="515" y="40" textAnchor="middle" fill="#876394" fontSize="17">
          {mode === 'en' ? 'Force · N' : '力 · N'}
        </text>
        <path d="M150 278h60l-30-137Z" fill="#dfd2e6" />
        <path
          d={`M${left.x} ${left.y}L${right.x} ${right.y}`}
          stroke="#8b699c"
          strokeWidth="5"
        />
        <circle cx="180" cy="133" r="6" fill="#b79569" />
        {[left, right].map((point, i) => (
          <g key={i}>
            <path
              d={`M${point.x} ${point.y}v91m-45 0h90`}
              stroke="#bba3c9"
              fill="none"
              strokeWidth="2"
            />
            {i ? (
              <>
                <rect
                  x={point.x - 29}
                  y={point.y + 51}
                  width="58"
                  height="40"
                  rx="5"
                  fill="#d0b183"
                />
                <text
                  x={point.x}
                  y={point.y + 78}
                  textAnchor="middle"
                  fill="#69513e"
                  fontSize="16"
                >
                  {reference} kg
                </text>
              </>
            ) : (
              <Backpack x={point.x} y={point.y + 33} mass={mass} />
            )}
          </g>
        ))}
        <text x="180" y="304" textAnchor="middle" fill="#876394" fontSize="16">
          {mode === 'en'
            ? balanced
              ? 'Balanced'
              : 'Adjust reference'
            : balanced
              ? '已平衡'
              : '调整参考砝码'}
        </text>
        <path d="M490 63h50" stroke="#a58bb6" strokeWidth="5" />
        <path
          d={`M515 63v15 ${Array.from({ length: 8 }, (_, i) => `L${i % 2 ? 527 : 503} ${82 + ((springEnd - 82) * i) / 7}`).join(' ')}L515 ${springEnd + 8}`}
          fill="none"
          stroke="#9570a8"
          strokeWidth="3"
        />
        <Backpack x={515} y={springEnd + 8} mass={mass} />
        <rect x="465" y="264" width="100" height="38" rx="8" fill="#efe6f5" />
        <text x="515" y="290" textAnchor="middle" fill="#866295" fontSize="22">
          {state.weight.toFixed(1)} N
        </text>
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={!balanced}
          onClick={() => {
            history.record(mass, 'earth');
            cases.record(String(mass));
          }}
        >
          <B zh="记录两种读数" en="Record both readings" mode={mode} />
        </button>
        <span className="phy-gravity-status">
          <B
            zh={balanced ? '现在可比较质量与重力。' : '先让天平平衡，再记录。'}
            en={
              balanced
                ? 'Compare mass and weight now.'
                : 'Balance the reference masses before recording.'
            }
            mode={mode}
          />
        </span>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['背包质量', 'Backpack mass']}>
          {mass} kg
        </Metric>
        <Metric mode={mode} title={['测力计读数', 'Force-meter reading']}>
          {state.weight.toFixed(1)} N
        </Metric>
        <Metric mode={mode} title={['当地g', 'Local g']}>
          {state.gravity} N/kg
        </Metric>
      </div>
      {history.records.length > 0 && (
        <Records
          mode={mode}
          records={history.records}
          caption={['已记录的地球模型比较', 'Recorded Earth-model comparisons']}
        />
      )}
      <p className="phy-force-record" role="status">
        <B
          zh={`已完成 ${cases.count}/2：让1 kg和2 kg背包分别平衡并记录。`}
          en={`Compared ${cases.count}/2: balance and record the 1 kg and 2 kg backpacks.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
export function MoonWeightLab({ mode, onExplore }: Props) {
  const [mass, setMass] = useState(1),
    [place, setPlace] = useState(0);
  const location: GravityLocation = place ? 'moon' : 'earth',
    state = gravityMeasurement(mass, location);
  const cases = useComparisons(['earth-1', 'moon-1', 'moon-2'], onExplore),
    history = useRecords();
  return (
    <Shell
      mode={mode}
      title={['带着同一背包，换一个世界', 'Same backpack, another world']}
      note={[
        '近表面静止模型：地球g≈10 N/kg，月球g≈1.6 N/kg，质量由按钮规定。紫箭头只画重力，平衡的支撑力未画；箭头按同一力比例绘制，天体大小不按比例。示例弹簧秤把测到的力固定除以地球g=10，得到标在kg刻度上的数；不代表所有秤。此处没有电梯、轨道失重或空气浮力。',
        'Stationary near-surface model: Earth g≈10 N/kg, Moon g≈1.6 N/kg, prescribed mass. Purple arrows show gravity; balancing support is omitted. Arrows use one force scale; celestial bodies are not to scale. The example spring scale divides force by Earth g=10 to label its kg scale; not all scales work this way. Elevators, orbital weightlessness and air buoyancy are outside this model.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['测量地点', 'Measurement location']}
          values={locations}
          value={place}
          set={setPlace}
        />
        <Options
          mode={mode}
          name={['背包质量', 'Backpack mass']}
          values={masses}
          value={mass}
          set={setMass}
        />
      </div>
      <svg
        viewBox="0 0 680 330"
        className="phy-simulation phy-gravity-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Matching backpacks on Earth and the Moon'
            : '相同背包在地球与月球的重力对照'
        }
      >
        {(['earth', 'moon'] as const).map((where, i) => {
          const x = i ? 510 : 170,
            weight = gravityMeasurement(mass, where).weight,
            len = weight * 5,
            head = Math.min(6, len / 3);
          return (
            <g key={where}>
              <rect
                x={x - 148}
                y="14"
                width="296"
                height="303"
                rx="18"
                fill={location === where ? '#f0e7f6' : '#faf7fc'}
                stroke={location === where ? '#cab4d9' : '#ebe2f1'}
              />
              <text
                x={x}
                y="45"
                textAnchor="middle"
                fill="#876394"
                fontSize="19"
              >
                {mode === 'en'
                  ? locationName(where)[1]
                  : locationName(where)[0]}
              </text>
              <circle cx={x} cy="245" r="75" fill={i ? '#d1c5d8' : '#b7cfc7'} />
              {i ? (
                <g fill="#b8a8c2">
                  <circle cx={x - 25} cy="219" r="12" />
                  <circle cx={x + 25} cy="259" r="19" />
                  <circle cx={x - 31} cy="275" r="8" />
                </g>
              ) : (
                <path
                  d={`M${x - 51} 211l33-15 21 21 35-6 21 36-19 31-32-12-20-31-34-1Z`}
                  fill="#94b5a7"
                />
              )}
              <Backpack x={x} y={112} mass={mass} />
              <path
                d={`M${x + 65} 92v${len}m${-head} ${-head} ${head} ${head} ${head} ${-head}`}
                fill="none"
                stroke="#a17bb4"
                strokeWidth="3"
              />
              <text x={x + 75} y="152" fill="#876394" fontSize="16">
                {weight.toFixed(1)} N
              </text>
              <text
                x={x}
                y="306"
                textAnchor="middle"
                fill="#876394"
                fontSize="16"
              >
                g = {i ? 1.6 : 10} N/kg
              </text>
            </g>
          );
        })}
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          onClick={() => {
            history.record(mass, location);
            cases.record(`${location}-${mass}`);
          }}
        >
          <B zh="记录此处读数" en="Record this location" mode={mode} />
        </button>
        <B
          zh="同质量比较时，只换地点。加物另作一次比较。"
          en="Keep mass fixed to compare places; add matter as a separate comparison."
          mode={mode}
        />
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['真实模型质量', 'Actual model mass']}>
          {state.mass} kg
        </Metric>
        <Metric mode={mode} title={['此处重力', 'Weight here']}>
          {state.weight.toFixed(1)} N
        </Metric>
        <Metric mode={mode} title={['当地g', 'Local g']}>
          {state.gravity} N/kg
        </Metric>
      </div>
      <div className="phy-gravity-calibration">
        <span>
          <B
            zh="如果把地球标定弹簧秤带来…"
            en="If an Earth-calibrated spring scale came along…"
            mode={mode}
          />
        </span>
        <strong>{state.earthCalibratedReading.toFixed(2)} kg</strong>
        <p>
          <B
            zh={`示数 = ${state.weight.toFixed(1)} N ÷ 10 N/kg。它固定用地球g换算，月球示数不能当作真实质量。`}
            en={`Labelled reading = ${state.weight.toFixed(1)} N / 10 N/kg. It always uses Earth’s g; the Moon label is not the actual mass.`}
            mode={mode}
          />
        </p>
      </div>
      {history.records.length > 0 && (
        <Records
          mode={mode}
          records={history.records}
          caption={[
            '保留质量与地点，再比较重力',
            'Keep mass and location alongside weight',
          ]}
        />
      )}
      <p className="phy-force-record" role="status">
        <B
          zh={`已完成 ${cases.count}/3：1 kg地球、1 kg月球、2 kg月球。`}
          en={`Compared ${cases.count}/3: 1 kg Earth, 1 kg Moon, 2 kg Moon.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
export function GravityFallLab({ mode, onExplore }: Props) {
  const [place, setPlace] = useState(0),
    [scrub, setScrub] = useState<number | null>(null),
    [records, setRecords] = useState<
      { location: GravityLocation; time: number; speed: number }[]
    >([]);
  const location: GravityLocation = place ? 'moon' : 'earth',
    preset = gravityFall(0.1, location, 5, 0),
    cases = useComparisons(['earth', 'moon'], onExplore);
  const animation = useAnimation(preset.landingTime, () => {
    setRecords((old) => [
      ...old.filter((r) => r.location !== location),
      { location, time: preset.landingTime, speed: preset.impactSpeed },
    ]);
    cases.record(location);
  });
  const time = scrub ?? animation.time,
    light = gravityFall(0.1, location, 5, time),
    heavy = gravityFall(1, location, 5, time);
  return (
    <Shell
      mode={mode}
      title={[
        '质量不同，同地点的加速度相同',
        'Different masses, same local acceleration',
      ]}
      note={[
        '无空气竖直下落：两球同高5 m、初速0，同时释放；地球g=10、月球g=1.6 m/s²，各自全程恒定。s=½gt²，v=gt，首次落地时间由5=½gt²求得。球的尺寸只是示意；灰点为本模型相等时间间隔的位置，非实测。按真实模型时间1倍播放，只到首次接触；落地后图标静止，碰撞和支撑力不计算。5 m只用于屏幕，家庭用低处。',
        'Vertical no-air fall: both start at rest at 5 m and release together. Constant g=10 on Earth or 1.6 m/s² on the Moon. s=½gt², v=gt; first landing solves 5=½gt². Ball sizes are schematic; grey dots are equal-time model positions, not measurements. Playback 1× model time, ending at first contact; resting icons afterwards omit impact/support physics. 5 m is screen-only; use low heights at home.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['下落地点', 'Fall location']}
          values={locations}
          value={place}
          disabled={animation.running}
          set={(n) => {
            setPlace(n);
            setScrub(null);
            animation.reset();
          }}
        />
        <span className="phy-gravity-status">
          <B
            zh="两球初速0 · 没有空气"
            en="Both start at rest · No air"
            mode={mode}
          />
        </span>
      </div>
      <svg
        viewBox="0 0 680 340"
        className="phy-simulation phy-gravity-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two different masses falling together without air'
            : '不同质量的两球在无空气模型中同时下落'
        }
      >
        <text x="340" y="20" textAnchor="middle" fill="#876394" fontSize="16">
          t = {time.toFixed(2)} s
        </text>
        <text x="225" y="49" textAnchor="middle" fill="#876394" fontSize="16">
          0.1 kg
        </text>
        <text x="455" y="49" textAnchor="middle" fill="#876394" fontSize="16">
          1 kg
        </text>
        {[5, 2.5, 0].map((height) => (
          <g key={height}>
            <path
              d={`M95 ${72 + (5 - height) * 40}H580`}
              stroke="#e4dbea"
              strokeDasharray="4 5"
            />
            <text
              x="62"
              y={78 + (5 - height) * 40}
              fill="#957ba2"
              fontSize="16"
            >
              {height}
            </text>
          </g>
        ))}
        <text x="43" y="316" fill="#957ba2" fontSize="16">
          h (m)
        </text>
        <path d="M125 289h425" stroke="#bfaaca" strokeWidth="3" />
        {[light, heavy].map((ball, i) => (
          <g key={i}>
            {[0, 0.25, 0.5, 0.75].map((fraction) => {
              const t = preset.landingTime * fraction;
              return (
                t <= time && (
                  <circle
                    key={fraction}
                    cx={i ? 455 : 225}
                    cy={
                      72 +
                      gravityFall(i ? 1 : 0.1, location, 5, t).distance * 40
                    }
                    r="10"
                    fill="#c6b8d0"
                    opacity=".35"
                  />
                )
              );
            })}
            <circle
              cx={i ? 455 : 225}
              cy={72 + ball.distance * 40}
              r="16"
              fill={i ? '#cfb183' : '#ad90c1'}
            />
            {ball.landed && (
              <text
                x={i ? 455 : 225}
                y="325"
                textAnchor="middle"
                fill="#876394"
                fontSize="16"
              >
                {mode === 'en' ? 'Landed' : '已着地'}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setScrub(null);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '下落中…' : '同时释放两球'}
            en={animation.running ? 'Falling…' : 'Release both balls'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-slider-row phy-gravity-scrub">
        <label>
          <B
            zh="暂停观察时刻（不计作完整释放）"
            en="Inspect a time (does not count as a completed release)"
            mode={mode}
          />
          <input
            type="range"
            aria-label={mode === 'en' ? 'Observation time' : '观察时刻'}
            min="0"
            max={preset.landingTime}
            step="0.01"
            value={time}
            disabled={animation.running}
            onChange={(e) => setScrub(Number(e.target.value))}
          />
          <strong>{time.toFixed(2)} s</strong>
        </label>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['两球下落路程', 'Both falling distances']}>
          {light.distance.toFixed(2)} m
        </Metric>
        <Metric mode={mode} title={['轻球重力', 'Light-ball weight']}>
          {light.weight.toFixed(2)} N
        </Metric>
        <Metric mode={mode} title={['重球重力', 'Heavy-ball weight']}>
          {heavy.weight.toFixed(2)} N
        </Metric>
      </div>
      <p className="phy-force-legend">
        <B
          zh={`两球下落加速度均为 ${preset.gravity} m/s²。${light.landed ? '已首次接触地面。' : `此刻下落速率均为 ${light.speed.toFixed(2)} m/s。`}`}
          en={`Both falling accelerations are ${preset.gravity} m/s². ${light.landed ? 'First ground contact reached.' : `Both speeds now are ${light.speed.toFixed(2)} m/s.`}`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="两球首次落地时间相同；速率取触地前"
                en="Matching first-landing times; speed is just before contact"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['地点', 'Place'],
                    ['两球时间', 'Both times'],
                    ['两球触地前速率', 'Both contact speeds'],
                  ] as const
                ).map(([zh, en]) => (
                  <th scope="col" key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.location}>
                  <th scope="row">
                    <B
                      zh={locationName(r.location)[0]}
                      en={locationName(r.location)[1]}
                      mode={mode}
                    />
                  </th>
                  <td>{r.time.toFixed(2)} s</td>
                  <td>{r.speed.toFixed(2)} m/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="phy-force-record" role="status">
        <B
          zh={`已完整比较 ${cases.count}/2：地球与月球。拖时间滑杆不能替代释放观察。`}
          en={`Completed ${cases.count}/2: Earth and Moon. Moving the time slider does not replace a complete release.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
