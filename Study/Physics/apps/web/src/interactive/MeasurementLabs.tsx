import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B, Icon, Text } from '../ui';
import { t, type Lesson } from '../content/schema';
import { useAnimation } from './useSimulation';
import {
  lengthReading,
  timingEstimate,
  rollingSamples,
  mean,
  walkingDistance,
  walkingSamples,
  type Walk,
  type LengthUnit,
} from './measurement';
type Props = { mode: LanguageMode; onExplore?: () => void };
function ModelNote({
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
function LabTitle({
  name,
  mode,
  zh,
  en,
}: {
  name: string;
  mode: LanguageMode;
  zh: string;
  en: string;
}) {
  return (
    <div className="phy-lab-toolbar">
      <span className="phy-lab-label">{name}</span>
      <B zh={zh} en={en} mode={mode} />
    </div>
  );
}
export function QuantitiesLab({ mode, onExplore }: Props) {
  const tasks = [
    {
      name: t('铅笔有多长？', 'How long is the pencil?'),
      tool: 0,
      read: t('长度 14 cm', 'Length: 14 cm'),
    },
    {
      name: t('这首歌播多久？', 'How long does the song last?'),
      tool: 1,
      read: t('时长 180 s', 'Duration: 180 s'),
    },
    {
      name: t('书包质量是多少？', 'What is the bag’s mass?'),
      tool: 2,
      read: t('质量 3 kg', 'Mass: 3 kg'),
    },
  ];
  const tools = [
    t('尺子', 'Ruler'),
    t('计时器', 'Timer'),
    t('天平', 'Balance'),
  ];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  return (
    <div className="phy-lab">
      <LabTitle
        name="05 / MEASUREMENT DETECTIVE"
        zh="给问题选工具"
        en="Match a tool to a question"
        mode={mode}
      />
      <div className="phy-tool-tasks">
        {tasks.map((task, i) => (
          <section key={task.name.en}>
            <h3>
              <span>0{i + 1}</span>
              <Text value={task.name} mode={mode} />
            </h3>
            <div className="phy-tool-buttons">
              {tools.map((tool, j) => (
                <button
                  key={tool.en}
                  aria-pressed={answers[i] === j}
                  className={answers[i] === j ? 'selected' : ''}
                  onClick={() => {
                    const next = { ...answers, [i]: j };
                    setAnswers(next);
                    if (tasks.every((task, index) => next[index] === task.tool))
                      onExplore?.();
                  }}
                >
                  <Text value={tool} mode={mode} />
                </button>
              ))}
            </div>
            {answers[i] !== undefined && (
              <p
                className={
                  answers[i] === task.tool
                    ? 'phy-good-reading'
                    : 'phy-retry-reading'
                }
                role="status"
              >
                {answers[i] === task.tool ? (
                  <Text value={task.read} mode={mode} />
                ) : (
                  <B
                    zh="这个工具测的量不同，再试一次。"
                    en="This tool measures a different quantity. Try again."
                    mode={mode}
                  />
                )}
              </p>
            )}
          </section>
        ))}
      </div>
      <ModelNote
        zh="读数是教学示例，不是对你家物品的实测。先说明量，再选工具。"
        en="Readings are teaching examples, not measurements of your own belongings. Identify the quantity before choosing a tool."
        mode={mode}
      />
    </div>
  );
}
export function UnitsLab({ mode, onExplore }: Props) {
  const [unit, setUnit] = useState<LengthUnit>('cm');
  const [visited, setVisited] = useState<LengthUnit[]>(['cm']);
  const value = lengthReading(0.24, unit);
  const shown = unit === 'm' ? value.toFixed(2) : value.toFixed(0);
  return (
    <div className="phy-lab">
      <LabTitle
        name="06 / SAME STRING, NEW UNIT"
        zh="同一根绳子"
        en="The very same string"
        mode={mode}
      />
      <svg
        viewBox="0 0 600 180"
        role="img"
        aria-label={`${shown} ${unit}`}
        className="phy-simulation"
      >
        <path
          d="M80 85q35-5 70 0t70 0 70 0 70 0 70 0 70 0"
          stroke="#b3a080"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M80 109v26m420-26v26M80 125h420"
          stroke="#9e80b2"
          strokeWidth="2"
        />
        <text x="300" y="47" fontSize="25" textAnchor="middle">
          {shown} {unit}
        </text>
        <text x="80" y="157" fontSize="12" textAnchor="middle">
          0
        </text>
        <text x="500" y="157" fontSize="12" textAnchor="middle">
          {shown} {unit}
        </text>
      </svg>
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Length unit' : '长度单位'}
        >
          {(['m', 'cm', 'mm'] as const).map((u) => (
            <button
              key={u}
              className={unit === u ? 'selected' : ''}
              aria-pressed={unit === u}
              onClick={() => {
                setUnit(u);
                const next = [...new Set([...visited, u])];
                setVisited(next);
                if (next.length >= 2) onExplore?.();
              }}
            >
              {u}
            </button>
          ))}
        </div>
        <strong className="phy-unit-equivalence">
          0.24 m = 24 cm = 240 mm
        </strong>
      </div>
      <ModelNote
        zh="绳子的两端一直不变。数字与单位一起描述长度，不能只比较数字。"
        en="The ends never move. A number and unit together describe length; do not compare the numbers alone."
        mode={mode}
      />
    </div>
  );
}
export function TimingLab({ mode, onExplore }: Props) {
  const [count, setCount] = useState(1);
  const [delay, setDelay] = useState(0.2);
  const [records, setRecords] = useState<
    { count: number; delay: number; total: number; perCycle: number }[]
  >([]);
  const result = timingEstimate(count, delay);
  const duration = count * 0.2;
  const animation = useAnimation(duration, () => {
    const next = [
      ...records.slice(-7),
      { count, delay, total: result.total, perCycle: result.perCycle },
    ];
    setRecords(next);
    if (
      next.some(
        (r) =>
          r.count === 1 &&
          next.some((other) => other.count === 10 && other.delay === r.delay),
      )
    )
      onExplore?.();
  });
  const angle = Math.sin(animation.time * 10 * Math.PI) * 24;
  const running = animation.running;
  const finished = animation.time >= duration;
  return (
    <div className="phy-lab">
      <LabTitle
        name="07 / COUNT THE SWINGS"
        zh="同一个摆，多数几次"
        en="Same pendulum, more repetitions"
        mode={mode}
      />
      <svg
        viewBox="0 0 600 215"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en' ? 'Pendulum and simulated stopwatch' : '摆与模拟秒表'
        }
      >
        <path d="M105 40h160" stroke="#c9b9d4" strokeWidth="4" />
        <g transform={`rotate(${angle} 185 40)`}>
          <path d="M185 40v119" stroke="#8c769e" strokeWidth="2" />
          <circle cx="185" cy="160" r="19" fill="#ae98c5" />
        </g>
        <circle cx="185" cy="40" r="4" fill="#8b749d" />
        <rect x="350" y="60" width="147" height="86" rx="12" fill="#eee4f6" />
        <text x="424" y="111" textAnchor="middle" fontSize="26">
          {(finished ? result.total : animation.time * 10).toFixed(2)} s
        </text>
        <text x="424" y="137" textAnchor="middle" fontSize="11">
          {count} × 2.00 s + {delay.toFixed(2)} s
        </text>
      </svg>
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Swing count' : '摆动次数'}
        >
          {[1, 10].map((n) => (
            <button
              key={n}
              disabled={running}
              className={count === n ? 'selected' : ''}
              aria-pressed={count === n}
              onClick={() => {
                setCount(n);
                animation.reset();
              }}
            >
              <B
                zh={`${n} 次`}
                en={`${n} swing${n === 1 ? '' : 's'}`}
                mode={mode}
              />
            </button>
          ))}
        </div>
        <button
          className="phy-button"
          disabled={running}
          onClick={animation.start}
        >
          <B
            zh={running ? '计时中…' : '开始计时'}
            en={running ? 'Timing…' : 'Start timing'}
            mode={mode}
          />
          <Icon name="clock" />
        </button>
      </div>
      <div className="phy-slider-row">
        <label>
          <B zh="停止按键的延迟" en="Stop-button delay" mode={mode} />
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.1"
            value={delay}
            disabled={running}
            onChange={(e) => {
              setDelay(Number(e.target.value));
              animation.reset();
            }}
          />
          <strong>{delay.toFixed(1)} s</strong>
        </label>
      </div>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <thead>
              <tr>
                <th>
                  <B zh="次数" en="Count" mode={mode} />
                </th>
                <th>
                  <B zh="总读数（s）" en="Total (s)" mode={mode} />
                </th>
                <th>
                  <B zh="每次用时（s）" en="Per swing (s)" mode={mode} />
                </th>
                <th>
                  <B zh="按键延迟（s）" en="Delay (s)" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{r.count}</td>
                  <td>{r.total.toFixed(2)}</td>
                  <td>{r.perCycle.toFixed(2)}</td>
                  <td>{r.delay.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModelNote
        zh="模型每个完整周期为 2.00 s，开始计时准确，停止有指定延迟。动画以 10 倍速度播放，秒表显示模型时间。用相同延迟比较 1 次与 10 次。"
        en="Each model cycle is 2.00 s. Timing starts correctly and stops with the selected delay. Animation runs at 10× speed; the timer displays model time. Compare one and ten swings at the same delay."
        mode={mode}
      />
    </div>
  );
}
export function MassLab({ mode, onExplore }: Props) {
  const objects = [
    { id: 'apple', name: t('苹果', 'Apple'), mass: 150, size: 25 },
    { id: 'sponge', name: t('大海绵', 'Large sponge'), mass: 30, size: 35 },
    {
      id: 'metal',
      name: t('小金属块', 'Small metal block'),
      mass: 100,
      size: 15,
    },
  ];
  const [objectId, setObjectId] = useState('apple');
  const [weights, setWeights] = useState<Record<number, number>>({});
  const object = objects.find((o) => o.id === objectId)!;
  const total = Object.entries(weights).reduce(
    (s, [value, count]) => s + Number(value) * count,
    0,
  );
  const balanced = total === object.mass;
  const angle = Math.max(
    -12,
    Math.min(12, ((total - object.mass) / object.mass) * 12),
  );
  function change(value: number, delta: number) {
    const next = {
      ...weights,
      [value]: Math.max(0, (weights[value] ?? 0) + delta),
    };
    const sum = Object.entries(next).reduce(
      (s, [v, c]) => s + Number(v) * c,
      0,
    );
    if (sum > 500) return;
    setWeights(next);
    if (sum === object.mass) onExplore?.();
  }
  return (
    <div className="phy-lab">
      <LabTitle
        name="08 / BALANCE THE EVIDENCE"
        zh="天平：未知物体与已知砝码"
        en="Balance: an unknown mass and known weights"
        mode={mode}
      />
      <svg
        viewBox="0 0 600 235"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? `Balance with ${total} grams of known weights`
            : `天平右盘有 ${total} 克砝码`
        }
      >
        <path d="M300 89v120m-36 0h72" stroke="#8a759a" strokeWidth="5" />
        <g transform={`rotate(${angle} 300 90)`} className="phy-balance-beam">
          <path d="M130 90h340" stroke="#8a759a" strokeWidth="5" />
          <path
            d="m140 92-25 73h50Zm320 0-25 73h50Z"
            stroke="#b9a6c7"
            fill="none"
          />
          <path
            d="M103 166q37 34 74 0M423 166q37 34 74 0"
            fill="#ece3f2"
            stroke="#b9a6c7"
            strokeWidth="2"
          />
          {object.id === 'apple' ? (
            <>
              <circle cx="140" cy="145" r="21" fill="#bd8d88" />
              <path
                d="m140 124 5-9 8 4"
                stroke="#909b79"
                strokeWidth="3"
                fill="none"
              />
            </>
          ) : (
            <rect
              x={140 - object.size / 2}
              y={160 - object.size}
              width={object.size}
              height={object.size}
              rx="3"
              fill={object.id === 'sponge' ? '#d9bc79' : '#a7abb9'}
            />
          )}
          <rect
            x="443"
            y={total ? 135 : 158}
            width="34"
            height={total ? 29 : 6}
            rx="4"
            fill="#a58aba"
          />
        </g>
        <circle cx="300" cy="90" r="8" fill="#9a80af" />
        <text x="140" y="36" textAnchor="middle" fontSize="15">
          {balanced ? `${total} g` : '? g'}
        </text>
        <text x="460" y="36" textAnchor="middle" fontSize="15">
          {total} g
        </text>
      </svg>
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Object' : '物体'}
        >
          {objects.map((o) => (
            <button
              key={o.id}
              aria-pressed={objectId === o.id}
              className={objectId === o.id ? 'selected' : ''}
              onClick={() => {
                setObjectId(o.id);
                setWeights({});
              }}
            >
              <Text value={o.name} mode={mode} />
            </button>
          ))}
        </div>
        <span
          className={balanced ? 'phy-good-reading' : 'phy-retry-reading'}
          role="status"
        >
          <B
            zh={
              balanced
                ? `平衡了！质量 ${total} g`
                : total < object.mass
                  ? '左盘较重，再加一点砝码'
                  : '右盘较重，减一点砝码'
            }
            en={
              balanced
                ? `Balanced! Mass: ${total} g`
                : total < object.mass
                  ? 'Left is heavier. Add a weight.'
                  : 'Right is heavier. Remove a weight.'
            }
            mode={mode}
          />
        </span>
      </div>
      <div className="phy-weight-controls">
        {[50, 10, 5, 1].map((v) => (
          <div key={v}>
            <strong>{v} g</strong>
            <span>× {weights[v] ?? 0}</span>
            <div>
              <button
                aria-label={
                  mode === 'en' ? `Remove ${v} g weight` : `减少 ${v} g 砝码`
                }
                disabled={!weights[v]}
                onClick={() => change(v, -1)}
              >
                −
              </button>
              <button
                aria-label={
                  mode === 'en' ? `Add ${v} g weight` : `增加 ${v} g 砝码`
                }
                disabled={total + v > 500}
                onClick={() => change(v, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModelNote
        zh="理想等臂天平，同一地点比较质量。绘图大小是示意，倾斜只提示哪边更重；物品质量是模型设定，不是所有真实苹果或海绵的质量。"
        en="Ideal equal-arm balance at one location. Sizes are illustrative; tilt only indicates the heavier side. Object masses are model values, not the masses of all real apples or sponges."
        mode={mode}
      />
    </div>
  );
}
export function TemperatureLab({ mode, onExplore }: Props) {
  const [touched, setTouched] = useState(false);
  const [readings, setReadings] = useState<string[]>([]);
  return (
    <div className="phy-lab">
      <LabTitle
        name="09 / TRUST THE THERMOMETER"
        zh="房间 20°C · 已充分放置"
        en="Room: 20°C · Both left long enough"
        mode={mode}
      />
      <div className="phy-temperature-cards">
        {[
          { id: 'wood', title: t('木块', 'Wood') },
          { id: 'metal', title: t('金属块', 'Metal') },
        ].map((o) => (
          <section key={o.id}>
            <div className={`phy-material-block ${o.id}`} aria-hidden="true" />
            <h3>
              <Text value={o.title} mode={mode} />
            </h3>
            {touched && (
              <p>
                <B
                  zh={
                    o.id === 'wood'
                      ? '较不冷：从手传走热量较慢'
                      : '更冷：从手传走热量较快'
                  }
                  en={
                    o.id === 'wood'
                      ? 'Feels less cold: slower heat transfer from the hand'
                      : 'Feels colder: faster heat transfer from the hand'
                  }
                  mode={mode}
                />
              </p>
            )}
            <button
              className="phy-button phy-button-light"
              onClick={() => {
                const next = [...new Set([...readings, o.id])];
                setReadings(next);
                if (next.length === 2) onExplore?.();
              }}
            >
              <B zh="测量温度" en="Measure temperature" mode={mode} />
            </button>
            <output aria-live="polite">
              {readings.includes(o.id) ? '20°C' : '— °C'}
            </output>
          </section>
        ))}
      </div>
      <div className="phy-lab-controls">
        <button className="phy-button" onClick={() => setTouched(true)}>
          <B zh="摸一摸（模型）" en="Try the touch model" mode={mode} />
        </button>
        <B
          zh={
            readings.length === 2
              ? '感觉不同，温度读数相同。'
              : '先猜温度，再分别测量。'
          }
          en={
            readings.length === 2
              ? 'Different sensations. Equal temperature readings.'
              : 'Predict, then measure each object.'
          }
          mode={mode}
        />
      </div>
      <ModelNote
        zh="室温平衡模型：皮肤比物体暖，金属导热更快。示意感觉不能代替真实表面温度测量，也不适用于刚从冰箱或热源拿出的物体。"
        en="Room-temperature equilibrium model: skin is warmer and metal transfers heat faster. The sensation model is not a real surface measurement and does not describe objects just removed from a fridge or heat source."
        mode={mode}
      />
    </div>
  );
}
export function DataLab({ mode, onExplore }: Props) {
  const [records, setRecords] = useState<{ smooth: number[]; rough: number[] }>(
    { smooth: [], rough: [] },
  );
  const names = {
    smooth: t('光滑地面', 'Smooth surface'),
    rough: t('粗糙地面', 'Rough surface'),
  };
  function record(surface: 'smooth' | 'rough') {
    const sample = rollingSamples[surface][records[surface].length];
    if (sample === undefined) return;
    const next = { ...records, [surface]: [...records[surface], sample] };
    setRecords(next);
    if (next.smooth.length === 3 && next.rough.length === 3) onExplore?.();
  }
  return (
    <div className="phy-lab">
      <LabTitle
        name="10 / KEEP EVERY READING"
        zh="同一个球 · 同样起始速率"
        en="Same ball · Same starting speed"
        mode={mode}
      />
      <div className="phy-data-table-wrap">
        <table className="phy-data-table">
          <caption>
            <B
              zh="停止距离的示例记录（m）"
              en="Example stopping-distance records (m)"
              mode={mode}
            />
          </caption>
          <thead>
            <tr>
              <th>
                <B zh="地面" en="Surface" mode={mode} />
              </th>
              {[1, 2, 3].map((i) => (
                <th key={i}>
                  <B zh={`第 ${i} 次`} en={`Trial ${i}`} mode={mode} />
                </th>
              ))}
              <th>
                <B zh="平均（m）" en="Mean (m)" mode={mode} />
              </th>
            </tr>
          </thead>
          <tbody>
            {(['smooth', 'rough'] as const).map((surface) => (
              <tr key={surface}>
                <th scope="row">
                  <Text value={names[surface]} mode={mode} />
                </th>
                {[0, 1, 2].map((i) => (
                  <td key={i}>{records[surface][i]?.toFixed(1) ?? '—'}</td>
                ))}
                <td>
                  {records[surface].length === 3
                    ? mean(records[surface])?.toFixed(1)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="phy-lab-controls">
        {(['smooth', 'rough'] as const).map((surface) => (
          <button
            className="phy-button phy-button-light"
            disabled={records[surface].length === 3}
            key={surface}
            onClick={() => record(surface)}
          >
            <Text
              value={
                surface === 'smooth'
                  ? t('记录光滑地面一次', 'Record a smooth-surface trial')
                  : t('记录粗糙地面一次', 'Record a rough-surface trial')
              }
              mode={mode}
            />
            <span>{records[surface].length}/3</span>
          </button>
        ))}
      </div>
      {records.smooth.length === 3 && records.rough.length === 3 && (
        <p className="phy-lab-result">
          <B
            zh="两组都有一点变化，但这组光滑地面数据整体更大。平均值概括了结果，原始读数也要保留。"
            en="Both groups vary a little, but this smooth-surface dataset is consistently larger. The mean summarises the results; keep the original readings too."
            mode={mode}
          />
        </p>
      )}
      <ModelNote
        zh="预设示例数据模拟真实实验的小差异。它们不是实时模拟计算或你家的实测结果。完成每组的三次记录后再比较。"
        en="Preset teaching data illustrate variation in real experiments. They are not live simulation calculations or measurements from your home. Record all three trials in each group before comparing."
        mode={mode}
      />
    </div>
  );
}
export function GraphLab({ mode, onExplore }: Props) {
  const [walk, setWalk] = useState<Walk>('pause');
  const [time, setTime] = useState(0);
  const [seen, setSeen] = useState<Walk[]>([]);
  const data = walkingSamples[walk];
  const distance = walkingDistance(walk, time);
  const name =
    walk === 'pause'
      ? t('走走停停', 'Walk and pause')
      : t('匀速前进', 'Steady walking');
  function explore(nextTime: number, nextWalk: Walk) {
    setTime(nextTime);
    if (nextTime >= 2) {
      const next = [...new Set([...seen, nextWalk])];
      setSeen(next);
      if (next.includes('steady') && next.includes('pause')) onExplore?.();
    }
  }
  return (
    <div className="phy-lab">
      <LabTitle
        name="11 / READ A WALKING STORY"
        zh="一对数据：时间与路程"
        en="A data pair: time and distance"
        mode={mode}
      />
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Walking pattern' : '走路方式'}
        >
          {(['pause', 'steady'] as const).map((w) => (
            <button
              key={w}
              aria-pressed={walk === w}
              className={walk === w ? 'selected' : ''}
              onClick={() => {
                setWalk(w);
                explore(time, w);
              }}
            >
              <Text
                value={
                  w === 'pause'
                    ? t('走走停停', 'Walk and pause')
                    : t('匀速前进', 'Steady walking')
                }
                mode={mode}
              />
            </button>
          ))}
        </div>
        <Text value={name} mode={mode} />
      </div>
      <div className="phy-graph-pair">
        <div>
          <p>
            <B zh="累计路程（m）" en="Total distance (m)" mode={mode} />
          </p>
          <svg
            viewBox="0 0 360 230"
            className="phy-walk-graph"
            role="img"
            aria-label={
              mode === 'en'
                ? `Distance–time graph: ${time} seconds, ${distance} metres`
                : `路程—时间图：${time} 秒、${distance} 米`
            }
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <path
                  d={`M45 ${190 - i * 39}h268M${45 + i * 67} 34v156`}
                  stroke="#e0d4e9"
                />
                <text
                  x="32"
                  y={194 - i * 39}
                  textAnchor="end"
                  fontSize="11"
                  fill="#85708f"
                >
                  {i}
                </text>
                <text
                  x={45 + i * 67}
                  y="209"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#85708f"
                >
                  {i}
                </text>
              </g>
            ))}
            <path d="M45 29v161h273" stroke="#ae94c0" fill="none" />
            <polyline
              points={data
                .map((d, i) => `${45 + i * 67},${190 - d * 39}`)
                .join(' ')}
              fill="none"
              stroke="#a084ba"
              strokeWidth="3"
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={45 + i * 67}
                cy={190 - d * 39}
                r="4"
                fill="#b89bce"
              />
            ))}
            <path
              d={`M${45 + time * 67} 190V${190 - distance * 39}h${-time * 67}`}
              fill="none"
              stroke="#d3a771"
              strokeDasharray="4 4"
            />
            <circle
              cx={45 + time * 67}
              cy={190 - distance * 39}
              r="7"
              fill="#d7aa71"
            />
          </svg>
          <p className="phy-graph-x-axis">
            <B zh="时间（s）" en="Time (s)" mode={mode} />
          </p>
        </div>
        <div className="phy-graph-track">
          <p>
            <B
              zh="真实运动的俯视示意"
              en="Top view of the motion"
              mode={mode}
            />
          </p>
          <svg
            viewBox="0 0 330 120"
            role="img"
            aria-label={
              mode === 'en'
                ? `Forward distance: ${distance} m`
                : `向前运动的路程：${distance} m`
            }
          >
            <path d="M30 60h270" stroke="#d6c7e1" strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <path d={`M${30 + i * 67.5} 60v8`} stroke="#ab91bb" />
                <text
                  x={30 + i * 67.5}
                  y="90"
                  textAnchor="middle"
                  fill="#887093"
                  fontSize="11"
                >
                  {i} m
                </text>
              </g>
            ))}
            <circle cx={30 + distance * 67.5} cy="42" r="13" fill="#ad91c3" />
          </svg>
          <strong>
            {time} s → {distance.toFixed(1)} m
          </strong>
          <div className="phy-mini-table">
            {data.map((d, i) => (
              <span key={i} className={time === i ? 'selected' : ''}>
                {i} s<br />
                {d} m
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="phy-slider-row">
        <label>
          <B zh="把时间拨到…" en="Move time to…" mode={mode} />
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={time}
            onChange={(e) => explore(Number(e.target.value), walk)}
          />
          <strong>{time} s</strong>
        </label>
      </div>
      <p className="phy-lab-result">
        <B
          zh={
            walk === 'pause' && time >= 1 && time <= 3
              ? '时间在走，路程仍是 2 m：机器人正在停留。'
              : '看图上的点、表格和跑道，三个位置显示的是同一组数据。'
          }
          en={
            walk === 'pause' && time >= 1 && time <= 3
              ? 'Time passes while distance stays at 2 m: the robot is paused.'
              : 'The plotted point, table and track all describe the same data.'
          }
          mode={mode}
        />
      </p>
      <ModelNote
        zh="预设直线前进模型，没有倒退；图线不是道路形状。把两种走法都拨到至少 2 s，再比较。"
        en="Preset forward, straight-line model with no reversing. The plotted line is not the road’s shape. Move both patterns to at least 2 s and compare."
        mode={mode}
      />
    </div>
  );
}
export function FoundationLab({
  kind,
  ...props
}: Props & { kind: Lesson['kind'] }) {
  switch (kind) {
    case 'quantities':
      return <QuantitiesLab {...props} />;
    case 'units':
      return <UnitsLab {...props} />;
    case 'time':
      return <TimingLab {...props} />;
    case 'mass':
      return <MassLab {...props} />;
    case 'temperature':
      return <TemperatureLab {...props} />;
    case 'data':
      return <DataLab {...props} />;
    case 'graph':
      return <GraphLab {...props} />;
    default:
      throw new Error(`Unsupported foundation experiment: ${kind}`);
  }
}
