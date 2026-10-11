import { useState } from 'react';
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
  newtonTitles,
  newtonOptions,
  newtonDefault,
  newtonLimits,
  newtonReading,
  newtonRecord,
  forceCards,
  checkForceDiagram,
  nf,
  type NewtonKind,
} from './newtonModels';
import type { Pair } from './kinematicsModels';
const w = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const notes: Record<NewtonKind, Pair> = {
  inertia: [
    '固定轨道惯性系，水平阻力忽略，竖直力平衡。惯性不是额外施力；零合力保留给定初速度。',
    'Fixed-track inertial frame, horizontal resistance omitted, vertical forces balanced. Inertia is not an additional force; zero net force retains the given initial velocity.',
  ],
  net: [
    '质量2 kg，u=+1 m/s；同车上右拉与左拉合成。虚线ΣF是计算结果，不作为第三股作用相加。',
    'Mass 2 kg, u=+1 m/s; combine right and left pulls on one cart. Dashed ΣF is a resultant, not a third interaction to add.',
  ],
  force: [
    '质量固定2 kg、从静止出发；给定恒定水平合力0/2/4 N，其他水平作用忽略，竖直力平衡。',
    'Mass fixed at 2 kg, initially at rest; constant horizontal net force 0/2/4 N, other horizontal interactions omitted, vertical forces balanced.',
  ],
  mass: [
    '水平合力固定4 N、从静止出发；质量1/2/4 kg。载荷改变质量，给定合力保持不变；重力与支持竖直平衡。',
    'Fixed horizontal net force 4 N, initially at rest; mass 1/2/4 kg. Loading changes mass while imposed net force remains fixed; weight and support balance vertically.',
  ],
  diagram: [
    'g=10 m/s²；目标为小车或车与载荷整体。粗糙面规定已在以2 m/s滑动，动摩擦6 N；不据此推算静摩擦。箭头在同一图内同比例，跨图请比较N读数。',
    'g=10 m/s²; target is cart or combined cart/load. The rough cart is already sliding at 2 m/s with 6 N kinetic friction; no static friction is inferred. Arrows share a scale within each diagram; compare N readings across diagrams.',
  ],
  pairs: [
    '两车从静止出发，理想轻型伸缩推杆持续保持相互作用2 s，忽略装置质量与水平外力。不是分开后仍有接触力的一次短促推人实验；单体与整体边界各自记账。',
    'Both carts start at rest; an ideal light telescoping actuator sustains the interaction for 2 s, with device mass and external horizontal forces omitted. This is not a brief human push continuing after contact ends; keep separate body and combined-system ledgers.',
  ],
};
function Arrow({
  x,
  y,
  value,
  axis = 'x',
  color = '#f2ce83',
  scale = 16,
  dashed = false,
}: {
  x: number;
  y: number;
  value: number;
  axis?: 'x' | 'y';
  color?: string;
  scale?: number;
  dashed?: boolean;
}) {
  if (!value) return null;
  const sign = Math.sign(value),
    endX = x + (axis === 'x' ? value * scale : 0),
    endY = y - (axis === 'y' ? value * scale : 0);
  return (
    <path
      d={
        axis === 'x'
          ? `M${x} ${y}H${endX}m${-sign * 7} -5 ${sign * 7} 5 ${-sign * 7} 5`
          : `M${x} ${y}V${endY}m-5 ${sign * 7} 5 ${-sign * 7} 5 ${sign * 7}`
      }
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeDasharray={dashed ? '6 5' : undefined}
    />
  );
}
function ForceScene({
  kind,
  index,
  value,
  mode,
  checked,
}: {
  kind: NewtonKind;
  index: number;
  value: number;
  mode: LanguageMode;
  checked: boolean;
}) {
  const m = newtonReading(kind, index, value, 0),
    c = m.config;
  if (kind === 'diagram') {
    const cards = forceCards(index).filter((f) => f.external),
      scale = 100 / (c.mass * 10);
    return (
      <svg
        viewBox="0 0 620 340"
        role="img"
        aria-label={w(mode, ['核对后的受力图', 'Checked free-body diagram'])}
      >
        <rect width="620" height="340" rx="18" fill="#283d48" />
        <text x="25" y="35" fill="#eeece0">
          {w(
            mode,
            checked
              ? ['外力 / N', 'External forces / N']
              : ['先筛选并核对力卡', 'Select and check force cards first'],
          )}
        </text>
        {checked && (
          <>
            <circle cx="310" cy="175" r="13" fill="#b3d0c6" />
            {cards.map((card) => (
              <Arrow
                key={card.id}
                x={310}
                y={175}
                value={card.value}
                axis={card.axis}
                scale={scale}
              />
            ))}
            <text x="385" y="82">
              N = {c.mass * 10} N
            </text>
            <text x="385" y="290">
              W = {c.mass * 10} N
            </text>
            <text x="430" y="180">
              P = 6 N
            </text>
            {index === 1 && (
              <text x="70" y="180">
                f = 6 N
              </text>
            )}
          </>
        )}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={w(mode, [
        '单车水平力与计算结果',
        'Horizontal forces on one cart and resultant',
      ])}
    >
      <rect width="620" height="300" rx="18" fill="#283d48" />
      <text x="25" y="35">
        {w(mode, ['单车水平作用 / N', 'Horizontal interactions / N'])}
      </text>
      <circle cx="310" cy="90" r="8" fill="#b3d0c6" />
      <Arrow x={310} y={90} value={c.right} />
      <text x="55" y="98">
        F_R = {c.right} N
      </text>
      <circle cx="310" cy="150" r="8" fill="#b3d0c6" />
      <Arrow x={310} y={150} value={c.left} color="#bb9fcc" />
      <text x="55" y="158">
        F_L = {c.left} N
      </text>
      <Arrow x={310} y={215} value={c.net} dashed />
      <text x="55" y="223">
        ΣF = {c.net} N
      </text>
      <text x="165" y="280">
        {w(mode, ['ΣF为结果，不是新作用', 'ΣF is a result, not a new force'])}
      </text>
    </svg>
  );
}
function MotionScene({
  kind,
  index,
  value,
  progress,
  mode,
}: {
  kind: NewtonKind;
  index: number;
  value: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = newtonReading(kind, index, value, progress),
    px = (x: number) => 55 + x * 25.5,
    pair = m.pair;
  return (
    <svg
      viewBox={pair ? '0 0 620 330' : '0 0 620 185'}
      role="img"
      aria-label={w(
        mode,
        pair
          ? ['持续相互作用的两车', 'Two carts under sustained interaction']
          : ['小车的真实运动', 'Cart motion'],
      )}
    >
      <rect width="620" height={pair ? 330 : 185} rx="18" fill="#283d48" />
      <text x="25" y="35">
        t = {nf(m.time)} s
      </text>
      <text x="400" y="35">
        x / m →
      </text>
      <path
        d={`M55 ${pair ? 220 : 105}H565`}
        stroke="#b3c4c5"
        strokeWidth="3"
      />
      {[0, 5, 10, 15, 20].map((n) => (
        <g key={n}>
          <path d={`M${px(n)} ${pair ? 215 : 100}v10`} stroke="#b3c4c5" />
          <text x={px(n)} y={pair ? 255 : 153} textAnchor="middle">
            {n}
          </text>
        </g>
      ))}
      {pair ? (
        <>
          <path
            d={`M${px(pair.A.position)} 195H${px(pair.B.position)}`}
            stroke="#d1d9cb"
            strokeWidth="4"
            strokeDasharray="7 4"
          />
          {[pair.A.position, pair.B.position].map((x, i) => (
            <g key={i}>
              <rect
                x={px(x) - 14}
                y="192"
                width="28"
                height="22"
                rx="4"
                fill={i === 0 ? '#f2ce83' : '#bb9fcc'}
              />
              <circle cx={px(x) - 8} cy="219" r="5" fill="#b3c4c5" />
              <circle cx={px(x) + 8} cy="219" r="5" fill="#b3c4c5" />
            </g>
          ))}
          <Arrow
            x={px(pair.A.position)}
            y={130}
            value={pair.forceA}
            scale={8}
          />
          <Arrow
            x={px(pair.B.position)}
            y={130}
            value={pair.forceB}
            scale={8}
            color="#bb9fcc"
          />
          <text
            x={Math.max(60, px(pair.A.position) - 45)}
            y="95"
            textAnchor="middle"
          >
            A: {pair.forceA} N
          </text>
          <text x={px(pair.B.position) + 45} y="95" textAnchor="middle">
            B: +{pair.forceB} N
          </text>
          <path
            d={`M${px(pair.center)} 172V235`}
            stroke="#fff"
            strokeDasharray="4 4"
          />
          <text x="25" y="315">
            A={pair.mA} kg · B={pair.mB} kg ·{' '}
            {w(mode, ['白线为质心', 'white line: center'])}
          </text>
        </>
      ) : (
        <>
          <circle
            cx={px(m.config.x0)}
            cy="88"
            r="8"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x={px(m.position) - 15}
            y="75"
            width="30"
            height="20"
            rx="4"
            fill="#f2ce83"
          />
          <circle cx={px(m.position) - 9} cy="100" r="5" fill="#f2ce83" />
          <circle cx={px(m.position) + 9} cy="100" r="5" fill="#f2ce83" />
          {Math.abs(m.velocity) > 1e-8 && (
            <path
              d={
                m.velocity > 0
                  ? `M${px(m.position) - 10} 58h35l-7 -5m7 5l-7 5`
                  : `M${px(m.position) + 10} 58h-35l7 -5m-7 5l7 5`
              }
              fill="none"
              stroke="#b3d0c6"
              strokeWidth="2"
            />
          )}
        </>
      )}
    </svg>
  );
}
function VelocityGraph({
  kind,
  index,
  value,
  progress,
  boundary,
  mode,
}: {
  kind: NewtonKind;
  index: number;
  value: number;
  progress: number;
  boundary: number;
  mode: LanguageMode;
}) {
  const m = newtonReading(kind, index, value, progress),
    c = m.config,
    px = (t: number) => 85 + (t / c.duration) * 470,
    py = (v: number) => 235 - ((v + 8) / 16) * 160;
  const v = (t: number) => {
    const q = newtonReading(kind, index, value, t / c.duration);
    return q.pair
      ? boundary === 0
        ? q.pair.A.velocity
        : boundary === 1
          ? q.pair.B.velocity
          : 0
      : q.velocity;
  };
  return (
    <svg
      viewBox="0 0 620 315"
      role="img"
      aria-label={w(mode, ['同步速度时间图', 'Linked velocity–time graph'])}
    >
      <rect width="620" height="315" rx="18" fill="#283d48" />
      <text x="25" y="35">
        {m.pair ? (boundary === 0 ? 'vA' : boundary === 1 ? 'vB' : 'vCM') : 'v'}{' '}
        / m/s
      </text>
      {[-8, 0, 8].map((n) => (
        <g key={n}>
          <path d={`M85 ${py(n)}H555`} stroke="#b3c4c5" opacity=".25" />
          <text x="65" y={py(n) + 8} textAnchor="end">
            {n}
          </text>
        </g>
      ))}
      {[0, c.duration / 2, c.duration].map((t) => (
        <g key={t}>
          <path d={`M${px(t)} 75V235`} stroke="#b3c4c5" opacity=".2" />
          <text x={px(t)} y="271" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <text x="438" y="306">
        t / s
      </text>
      <path d={`M85 75V235H555M85 ${py(0)}H555`} fill="none" stroke="#b3c4c5" />
      <path
        d={`M${px(0)} ${py(v(0))}L${px(c.duration)} ${py(v(c.duration))}`}
        stroke="#b3c4c5"
        opacity=".5"
        fill="none"
        strokeWidth="3"
      />
      <path
        d={`M${px(0)} ${py(v(0))}L${px(m.time)} ${py(v(m.time))}`}
        stroke="#f2ce83"
        fill="none"
        strokeWidth="4"
      />
      <circle cx={px(m.time)} cy={py(v(m.time))} r="6" fill="#f2ce83" />
    </svg>
  );
}
export function NewtonLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: NewtonKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<number[]>([]),
    [selected, setSelected] = useState<string[]>([]),
    [checked, setChecked] = useState<boolean | null>(null),
    [boundary, setBoundary] = useState(0);
  const value = custom ?? newtonDefault(kind, index),
    canonical = Math.abs(value - newtonDefault(kind, index)) < 1e-9,
    diagramValid =
      kind !== 'diagram' ||
      (checked === true && checkForceDiagram(index, selected)),
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
      if (canonical && diagramValid) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    }),
    p = probe ?? animation.time / 2.4,
    m = newtonReading(kind, index, value, p),
    limit = newtonLimits(kind),
    pair = m.pair;
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const pairForce = pair
      ? boundary === 0
        ? pair.forceA
        : boundary === 1
          ? pair.forceB
          : 0
      : 0,
    pairAcceleration = pair
      ? boundary === 0
        ? pair.forceA / pair.mA
        : boundary === 1
          ? pair.forceB / pair.mB
          : 0
      : 0,
    pairVelocity = pair
      ? boundary === 0
        ? pair.A.velocity
        : boundary === 1
          ? pair.B.velocity
          : 0
      : 0;
  const metrics: { title: Pair; value: string }[] = pair
    ? [
        {
          title: [
            '选定对象外部水平合力',
            'External horizontal net force on target',
          ],
          value: `${pairForce} N`,
        },
        {
          title: [
            boundary === 2 ? '质心加速度' : '单车加速度',
            boundary === 2 ? 'Center acceleration' : 'Cart acceleration',
          ],
          value: `${nf(pairAcceleration)} m/s²`,
        },
        {
          title: [
            boundary === 2 ? '质心速度' : '单车速度',
            boundary === 2 ? 'Center velocity' : 'Cart velocity',
          ],
          value: `${nf(pairVelocity)} m/s`,
        },
      ]
    : [
        { title: ['水平合力', 'Horizontal net force'], value: `${m.net} N` },
        {
          title: ['加速度', 'Acceleration'],
          value: `${nf(m.acceleration)} m/s²`,
        },
        {
          title: ['当前速度', 'Current velocity'],
          value: `${nf(m.velocity)} m/s`,
        },
      ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-newton-lab">
      <div className="phy-lab-toolbar">
        <span>MECHANICS / WHO ACTS ON WHOM</span>
        <B zh={newtonTitles[kind][0]} en={newtonTitles[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={newtonOptions[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          reset();
          setIndex(i);
          setCustom(null);
          setSelected([]);
          setChecked(null);
        }}
      />
      {kind === 'diagram' ? (
        <fieldset className="phy-trajectory-work phy-newton-work">
          <legend>
            <B
              zh={index === 2 ? '目标：车与载荷整体' : '目标：小车'}
              en={index === 2 ? 'Target: cart + load system' : 'Target: cart'}
              mode={mode}
            />
          </legend>
          <p>
            <B
              zh="筛选目标受到的外力。每张卡写明谁作用在谁上。"
              en="Select external forces received by the target. Each card names agent and receiver."
              mode={mode}
            />
          </p>
          <div
            className="phy-newton-cards"
            role="group"
            aria-label={w(mode, ['力卡筛选', 'Force-card selection'])}
          >
            {forceCards(index).map((card) => (
              <button
                key={card.id}
                aria-pressed={selected.includes(card.id)}
                disabled={animation.running}
                onClick={() => {
                  reset();
                  setChecked(null);
                  setSelected((s) =>
                    s.includes(card.id)
                      ? s.filter((id) => id !== card.id)
                      : [...s, card.id],
                  );
                }}
              >
                <span aria-hidden="true">
                  {selected.includes(card.id) ? '✓' : '○'}
                </span>
                <B zh={card.label[0]} en={card.label[1]} mode={mode} />
              </button>
            ))}
          </div>
          <button
            className="phy-button secondary"
            disabled={animation.running}
            onClick={() => setChecked(checkForceDiagram(index, selected))}
          >
            <B zh="核对受力图" en="Check force diagram" mode={mode} />
          </button>
          {checked !== null && (
            <p role="status">
              <B
                zh={
                  checked
                    ? '外力归属正确。合成各方向后，完整观察运动。'
                    : '再看受力者和系统边界：目标对外施力、系统内部作用与“ma额外力”不应混入；也别漏真实外力。'
                }
                en={
                  checked
                    ? 'External-force assignment is correct. Sum each direction, then observe fully.'
                    : 'Recheck receiver and boundary: exclude forces exerted by the target, internal interactions and an extra “ma force”; keep every real external force.'
                }
                mode={mode}
              />
            </p>
          )}
        </fieldset>
      ) : (
        <label className="phy-algebra-free">
          <B zh={limit.label[0]} en={limit.label[1]} mode={mode} />
          <output>
            {nf(value)} {limit.unit}
          </output>
          <input
            type="range"
            min={limit.min}
            max={limit.max}
            step={limit.step}
            value={value}
            disabled={animation.running}
            aria-label={w(mode, limit.label)}
            onChange={(e) => {
              reset();
              setCustom(Number(e.target.value));
            }}
          />
        </label>
      )}
      {pair && (
        <>
          <LabOptions
            mode={mode}
            name={['研究对象', 'Target boundary']}
            values={[
              ['只看A', 'A only'],
              ['只看B', 'B only'],
              ['A+B整体', 'A+B system'],
            ].map(([zh, en], id) => ({ id, zh: zh!, en: en! }))}
            value={boundary}
            set={setBoundary}
          />
          <p className="phy-model-note">
            <B
              zh={
                boundary === 2
                  ? '同一对力在整体内部相消；单车仍可各自加速。质心x=Σ(mx)/Σm，不是简单位置平均。'
                  : '只把作用在选定车上的力放进它的合力账；另一股力作用在另一辆车上。'
              }
              en={
                boundary === 2
                  ? 'The pair cancels internally for the combined sum; each cart can still accelerate. Center x=Σ(mx)/Σm, not a simple position average.'
                  : 'Include only forces received by the selected cart; its partner force acts on the other cart.'
              }
              mode={mode}
            />
          </p>
        </>
      )}
      {kind !== 'pairs' && (
        <ForceScene
          kind={kind}
          index={index}
          value={value}
          mode={mode}
          checked={diagramValid}
        />
      )}
      <MotionScene
        kind={kind}
        index={index}
        value={value}
        progress={p}
        mode={mode}
      />
      <div className="phy-thermal-metrics">
        {metrics.map((r) => (
          <LabMetric key={r.title[1]} title={r.title} mode={mode}>
            {diagramValid
              ? r.value
              : w(mode, ['等待受力图核对', 'Awaiting diagram check'])}
          </LabMetric>
        ))}
      </div>
      {(kind !== 'diagram' || diagramValid) && (
        <VelocityGraph
          kind={kind}
          index={index}
          value={value}
          progress={p}
          boundary={boundary}
          mode={mode}
        />
      )}
      <p className="phy-model-note">
        <B
          zh={`${notes[kind][0]} 真实观察时间压缩为2.4秒播放；金线读速度变化，轨道旁短箭头只标运动方向，不代表力。`}
          en={`${notes[kind][1]} Physical duration compresses to 2.4 seconds; gold traces velocity change. Short arrows beside the cart mark motion direction, not force.`}
          mode={mode}
        />
      </p>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{Math.round(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
          disabled={animation.running}
          aria-label={w(mode, ['检查进度', 'Inspection progress'])}
          onChange={(e) => {
            animation.reset();
            setProbe(Number(e.target.value) / 100);
          }}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          className="phy-button"
          disabled={animation.running || !diagramValid}
          onClick={() => {
            setProbe(null);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe motion and record" mode={mode} />
        </button>
        <button
          className="phy-button secondary"
          disabled={animation.running}
          onClick={reset}
        >
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；拖动和自由设置不代替完整观察。${kind === 'diagram' ? '先核对每张受力图。' : ''}`}
          en={`${gate.count}/3 required comparisons complete; seeking and free settings do not replace full observation.${kind === 'diagram' ? ' Check each force diagram first.' : ''}`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
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
              {records.map((i) => {
                const row = newtonRecord(kind, i);
                return (
                  <tr key={i}>
                    <td>
                      <B
                        zh={newtonOptions[kind][i]![0]}
                        en={newtonOptions[kind][i]![1]}
                        mode={mode}
                      />
                    </td>
                    <td>
                      <B zh={row[0]} en={row[1]} mode={mode} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
