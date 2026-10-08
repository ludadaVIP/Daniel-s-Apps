import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  LabOptions as Options,
  LabMetric as Metric,
  useComparisons as useCases,
  type LabProps as Props,
} from './LabControls';
import { B } from '../ui';
import { useAnimation } from './useSimulation';
import {
  forceCart,
  springResponse,
  frictionBlock,
  paperDrop,
} from './forceModels';
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
    <div className="phy-lab phy-forces-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">FORCES / EVERYDAY INTERACTIONS</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      {children}
      <p className="phy-model-note">
        <B zh={note[0]} en={note[1]} mode={mode} />
      </p>
    </div>
  );
}
function Signed({
  value,
  unit,
  mode,
}: {
  value: number;
  unit: string;
  mode: LanguageMode;
}) {
  return Math.abs(value) < 1e-8 ? (
    <B zh={`0 ${unit}`} en={`0 ${unit}`} mode={mode} />
  ) : (
    <B
      zh={`${value > 0 ? '向右' : '向左'} ${Math.abs(value).toFixed(1)} ${unit}`}
      en={`${value > 0 ? 'Right' : 'Left'} ${Math.abs(value).toFixed(1)} ${unit}`}
      mode={mode}
    />
  );
}
function Arrow({
  x,
  y,
  value,
  colour = '#9875ad',
}: {
  x: number;
  y: number;
  value: number;
  colour?: string;
}) {
  if (!value) return null;
  const end = x + Math.sign(value) * Math.min(125, Math.abs(value) * 25),
    sign = Math.sign(value);
  return (
    <g>
      <path
        d={`M${x} ${y}H${end}m${-sign * 9} -6 ${sign * 9} 6 ${-sign * 9} 6`}
        fill="none"
        stroke={colour}
        strokeWidth="3"
      />
      <text
        x={(x + end) / 2}
        y={y - 12}
        textAnchor="middle"
        fill={colour}
        fontSize="16"
      >
        {Math.abs(value)} N
      </text>
    </g>
  );
}
const coordinate = (position: number) => 80 + (position + 2) * 40;
function Track({
  position,
  block = false,
}: {
  position: number;
  block?: boolean;
}) {
  return (
    <g>
      <path d="M60 222h530" stroke="#beaccd" strokeWidth="3" />
      {[-2, 0, 2, 4, 6, 8, 10].map((n) => (
        <g key={n}>
          <path d={`M${coordinate(n)} 222v8`} stroke="#aa93b9" />
          <text
            x={coordinate(n)}
            y="254"
            textAnchor="middle"
            fill="#836492"
            fontSize="16"
          >
            {n} m
          </text>
        </g>
      ))}
      <g transform={`translate(${coordinate(position)},190)`}>
        <rect
          x="-27"
          y="-15"
          width="54"
          height={block ? 44 : 26}
          rx="5"
          fill={block ? '#d4b080' : '#baa0ce'}
        />
        {!block && (
          <>
            <circle cx="-17" cy="23" r="9" fill="#8d739d" />
            <circle cx="17" cy="23" r="9" fill="#8d739d" />
          </>
        )}
        <text y="4" textAnchor="middle" fill="#fffaf3" fontSize="13">
          2 kg
        </text>
      </g>
      <text x="540" y="285" textAnchor="end" fill="#947ba0" fontSize="15">
        x (m) · → +
      </text>
    </g>
  );
}
const forceChoices = [-2, 0, 2].map((n) => ({
  id: n,
  zh: n ? `${n > 0 ? '向右' : '向左'} ${Math.abs(n)} N` : '0 N',
  en: n ? `${n > 0 ? 'Right' : 'Left'} ${Math.abs(n)} N` : '0 N',
}));
export function ForceEffectsLab({ mode, onExplore }: Props) {
  const [tab, setTab] = useState(0),
    [force, setForce] = useState(0),
    [spring, setSpring] = useState(0);
  const cases = useCases(['cart0', 'cart2', 'spring-2', 'spring2'], onExplore);
  const animation = useAnimation(1, () => cases.record(`cart${force}`));
  const cart = forceCart(force, animation.time * 2),
    coil = springResponse(spring),
    coilEnd = 155 + coil.lengthCm * 13;
  return (
    <Shell
      mode={mode}
      title={['看运动变化，也看形状变化', 'Inspect motion and deformation']}
      note={[
        '小车模型：水平合力由按钮规定，m=2 kg，初速向右1 m/s，x起点2 m；F=ma，观察2 s，以2倍速度播放，忽略阻力，垂直力平衡。弹簧为静态线性模型，自然长20 cm、k=40 N/m，仅在±2 N范围内；固定端与外力平衡，不模拟振动。',
        'Cart: prescribed horizontal net force, m=2 kg, initial velocity 1 m/s right, start x=2 m; F=ma, observe 2 s at 2× playback, resistance omitted and vertical forces balanced. Spring: static linear model, natural length 20 cm, k=40 N/m, limited to ±2 N; fixed support balances the external force. Oscillation omitted.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['观察对象', 'Object']}
          values={[
            { id: 0, zh: '小车运动', en: 'Cart motion' },
            { id: 1, zh: '弹簧形变', en: 'Spring shape' },
          ]}
          value={tab}
          disabled={animation.running}
          set={setTab}
        />
      </div>
      {tab === 0 ? (
        <>
          <div className="phy-lab-controls">
            <Options
              mode={mode}
              name={['水平合力', 'Horizontal net force']}
              values={forceChoices}
              value={force}
              disabled={animation.running}
              set={(n) => {
                setForce(n);
                animation.reset();
              }}
            />
          </div>
          <svg
            viewBox="-60 0 760 310"
            className="phy-simulation phy-force-svg"
            role="img"
            aria-label={
              mode === 'en' ? 'Net force and moving cart' : '水平合力与运动小车'
            }
          >
            <text x="70" y="48" fill="#836492" fontSize="17">
              t = {(animation.time * 2).toFixed(1)} s
            </text>
            <Arrow x={coordinate(cart.position)} y={110} value={force} />
            <Track position={cart.position} />
          </svg>
          <div className="phy-lab-controls">
            <button
              className="phy-button"
              disabled={animation.running}
              onClick={animation.start}
            >
              <B
                zh={animation.running ? '观察中…' : '播放2秒事件'}
                en={animation.running ? 'Observing…' : 'Play 2-second event'}
                mode={mode}
              />
            </button>
          </div>
          <div className="phy-skill-readouts">
            <Metric mode={mode} title={['位置', 'Position']}>
              {cart.position.toFixed(1)} m
            </Metric>
            <Metric mode={mode} title={['当前运动', 'Current motion']}>
              <Signed value={cart.velocity} unit="m/s" mode={mode} />
            </Metric>
            <Metric mode={mode} title={['水平合力', 'Net force']}>
              <Signed value={force} unit="N" mode={mode} />
            </Metric>
          </div>
        </>
      ) : (
        <>
          <div className="phy-lab-controls">
            <Options
              mode={mode}
              name={['施加在弹簧右端的力', 'Force on spring right end']}
              values={[
                { id: -2, zh: '向左压 2 N', en: 'Compress left 2 N' },
                { id: 0, zh: '无外力', en: 'No external force' },
                { id: 2, zh: '向右拉 2 N', en: 'Stretch right 2 N' },
              ]}
              value={spring}
              disabled={false}
              set={setSpring}
            />
          </div>
          <svg
            viewBox="0 0 640 280"
            className="phy-simulation phy-force-svg"
            role="img"
            aria-label={
              mode === 'en'
                ? 'Fixed spring with changed length'
                : '固定弹簧的长度变化'
            }
          >
            <rect x="125" y="85" width="30" height="100" fill="#d9c9e4" />
            <path
              d={
                'M155 135 ' +
                Array.from(
                  { length: 20 },
                  (_, i) =>
                    `L${155 + ((coilEnd - 155) * (i + 1)) / 20} ${i === 19 ? 135 : i % 2 ? 115 : 155}`,
                ).join(' ')
              }
              fill="none"
              stroke="#9570aa"
              strokeWidth="4"
            />
            <rect x={coilEnd} y="113" width="14" height="44" fill="#cfad7f" />
            <Arrow x={coilEnd + 7} y={70} value={spring} />
            <path d={`M155 200H${coilEnd}`} stroke="#b69fc7" />
            <text
              x={(155 + coilEnd) / 2}
              y="230"
              textAnchor="middle"
              fill="#836492"
              fontSize="21"
            >
              {coil.lengthCm} cm
            </text>
          </svg>
          <div className="phy-lab-controls">
            <button
              className="phy-button"
              onClick={() => cases.record(`spring${spring}`)}
            >
              <B zh="记录弹簧形变" en="Record spring shape" mode={mode} />
            </button>
          </div>
          <div className="phy-skill-readouts">
            <Metric mode={mode} title={['自然长', 'Natural length']}>
              20 cm
            </Metric>
            <Metric mode={mode} title={['现在长', 'Current length']}>
              {coil.lengthCm} cm
            </Metric>
            <Metric mode={mode} title={['长度变化', 'Length change']}>
              {coil.changeCm > 0 ? '+' : ''}
              {coil.changeCm} cm
            </Metric>
          </div>
        </>
      )}
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${cases.count}/4：小车零合力、右合力，弹簧压缩、拉伸。`}
          en={`Compared ${cases.count}/4: cart zero/right net force, spring compression/stretching.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
export function ForceBalanceLab({ mode, onExplore }: Props) {
  const [left, setLeft] = useState(2),
    [right, setRight] = useState(2),
    [moving, setMoving] = useState(0);
  const cases = useCases(
      ['balanced-rest', 'balanced-moving', 'unbalanced'],
      onExplore,
    ),
    net = right - left;
  const animation = useAnimation(1, () =>
    cases.record(
      net === 0 && left > 0
        ? moving
          ? 'balanced-moving'
          : 'balanced-rest'
        : net !== 0
          ? 'unbalanced'
          : 'zero',
    ),
  );
  const state = forceCart(net, animation.time * 2, moving);
  const choices = [0, 2, 4].map((n) => ({ id: n, zh: `${n} N`, en: `${n} N` }));
  return (
    <Shell
      mode={mode}
      title={[
        '同一辆车，合力决定运动的变化',
        'One cart: net force changes motion',
      ]}
      note={[
        '一维水平模型：m=2 kg，初始位置2 m，初速0或向右1 m/s；两绳共线，不产生转动，竖直力平衡，忽略接触阻力。F合=F右−F左，F=ma，观察2 s、2倍播放。箭头表示车所受的两拉力，不表示车对绳的力。',
        'One-dimensional horizontal model: m=2 kg, x starts at 2 m, initial velocity 0 or 1 m/s right; collinear strings, no rotation, balanced vertical forces, contact resistance omitted. Fnet=Fright−Fleft and F=ma; 2 s at 2× playback. Arrows are forces on the cart, not the cart’s forces on strings.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['左侧拉力', 'Left pull']}
          values={choices}
          value={left}
          disabled={animation.running}
          set={(n) => {
            setLeft(n);
            animation.reset();
          }}
        />
        <Options
          mode={mode}
          name={['右侧拉力', 'Right pull']}
          values={choices}
          value={right}
          disabled={animation.running}
          set={(n) => {
            setRight(n);
            animation.reset();
          }}
        />
        <Options
          mode={mode}
          name={['初始运动', 'Initial motion']}
          values={[
            { id: 0, zh: '静止', en: 'At rest' },
            { id: 1, zh: '向右1 m/s', en: 'Right 1 m/s' },
          ]}
          value={moving}
          disabled={animation.running}
          set={(n) => {
            setMoving(n);
            animation.reset();
          }}
        />
      </div>
      <svg
        viewBox="-60 0 760 310"
        className="phy-simulation phy-force-svg"
        role="img"
        aria-label={
          mode === 'en' ? 'Opposing forces on one cart' : '同一辆车上的相反拉力'
        }
      >
        <text x="70" y="45" fill="#836492" fontSize="17">
          t = {(animation.time * 2).toFixed(1)} s
        </text>
        <Arrow
          x={coordinate(state.position)}
          y={120}
          value={-left}
          colour="#bd9768"
        />
        <Arrow x={coordinate(state.position)} y={120} value={right} />
        <Track position={state.position} />
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <B
            zh={animation.running ? '观察中…' : '比较两秒运动'}
            en={animation.running ? 'Observing…' : 'Compare 2-second motion'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['水平合力', 'Horizontal net force']}>
          <Signed value={net} unit="N" mode={mode} />
        </Metric>
        <Metric mode={mode} title={['当前运动', 'Current motion']}>
          <Signed value={state.velocity} unit="m/s" mode={mode} />
        </Metric>
        <Metric mode={mode} title={['位置', 'Position']}>
          {state.position.toFixed(1)} m
        </Metric>
      </div>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${cases.count}/3：非零平衡力下静止、匀速运动，再比较非平衡力。`}
          en={`Compared ${cases.count}/3: nonzero balanced forces from rest and motion, then unbalanced forces.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
export function GripFrictionLab({ mode, onExplore }: Props) {
  const [rough, setRough] = useState(1),
    [moving, setMoving] = useState(0),
    [force, setForce] = useState(2);
  const cases = useCases(
    ['rough-rest2', 'rough-rest4', 'rough-moving0', 'smooth-moving0'],
    onExplore,
  );
  const animation = useAnimation(1, () =>
      cases.record(
        `${rough ? 'rough' : 'smooth'}-${moving ? 'moving' : 'rest'}${force}`,
      ),
    ),
    state = frictionBlock(force, animation.time * 2, !!moving, !!rough);
  const pulls = [-4, 0, 2, 4, 6].map((n) => ({
    id: n,
    zh: n === 0 ? '0 N' : `${n > 0 ? '向右' : '向左'}${Math.abs(n)} N`,
    en: n === 0 ? '0 N' : `${n > 0 ? 'Right' : 'Left'} ${Math.abs(n)} N`,
  }));
  return (
    <Shell
      mode={mode}
      title={[
        '摩擦反向于滑动或滑动趋势',
        'Friction opposes sliding or its tendency',
      ]}
      note={[
        '水平滑块模型：m=2 kg，x起点2 m，垂直力平衡。摩擦面静摩擦上限3 N，滑动摩擦2 N；静摩擦随需要调整，停止时重新判断。无摩擦面为理想对照。用F=ma分段计算2 s，2倍播放；非滚动模型，常数只用于教学。',
        'Horizontal sliding block: m=2 kg, x starts at 2 m, vertical forces balance. Static limit 3 N, sliding friction 2 N; static friction adjusts and is reassessed at stopping. Frictionless surface is an ideal control. Piecewise F=ma over 2 s at 2× playback. Not a rolling model; constants are prescribed for teaching.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['接触面', 'Contact surface']}
          values={[
            { id: 1, zh: '有摩擦', en: 'With friction' },
            { id: 0, zh: '理想无摩擦', en: 'Ideal frictionless' },
          ]}
          value={rough}
          disabled={animation.running}
          set={(n) => {
            setRough(n);
            animation.reset();
          }}
        />
        <Options
          mode={mode}
          name={['起始状态', 'Starting state']}
          values={[
            { id: 0, zh: '静止', en: 'At rest' },
            { id: 1, zh: '向右1 m/s', en: 'Right 1 m/s' },
          ]}
          value={moving}
          disabled={animation.running}
          set={(n) => {
            setMoving(n);
            animation.reset();
          }}
        />
        <Options
          mode={mode}
          name={['施加的外力', 'Applied force']}
          values={pulls}
          value={force}
          disabled={animation.running}
          set={(n) => {
            setForce(n);
            animation.reset();
          }}
        />
      </div>
      <svg
        viewBox="-60 0 760 310"
        className="phy-simulation phy-force-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Sliding block with applied force and friction'
            : '滑块的外力与摩擦力'
        }
      >
        <text x="65" y="45" fill="#836492" fontSize="17">
          t = {(animation.time * 2).toFixed(1)} s
        </text>
        <Arrow x={coordinate(state.position)} y={105} value={force} />
        <Arrow
          x={coordinate(state.position)}
          y={152}
          value={state.friction}
          colour="#bd9768"
        />
        {rough && (
          <path
            d="m60 235 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9m8 9 12-9"
            stroke="#d0b68f"
          />
        )}
        <Track position={state.position} block />
      </svg>
      <p className="phy-force-legend">
        <B
          zh="紫色：施加的外力 · 金色：摩擦力。位置坐标向右为正。"
          en="Purple: applied force · Gold: friction. Position is positive rightward."
          mode={mode}
        />
      </p>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <B
            zh={animation.running ? '观察中…' : '播放滑块运动'}
            en={animation.running ? 'Observing…' : 'Play block motion'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['摩擦力', 'Friction']}>
          <Signed value={state.friction} unit="N" mode={mode} />
        </Metric>
        <Metric mode={mode} title={['水平合力', 'Net force']}>
          <Signed value={state.netForce} unit="N" mode={mode} />
        </Metric>
        <Metric mode={mode} title={['当前运动', 'Current motion']}>
          <Signed value={state.velocity} unit="m/s" mode={mode} />
        </Metric>
        <Metric mode={mode} title={['位置', 'Position']}>
          {state.position.toFixed(2)} m
        </Metric>
      </div>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${cases.count}/4：静止时2/4 N、有摩擦滑行、无摩擦滑行。`}
          en={`Compared ${cases.count}/4: from rest at 2/4 N, frictional coast, frictionless coast.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
export function PaperDragLab({ mode, onExplore }: Props) {
  const [air, setAir] = useState(1),
    cases = useCases(['air', 'vacuum'], onExplore),
    duration = paperDrop('flat', !!air, 0).landingTime;
  const animation = useAnimation(duration / 2, () =>
      cases.record(air ? 'air' : 'vacuum'),
    ),
    time = animation.time * 2,
    flat = paperDrop('flat', !!air, time),
    ball = paperDrop('crumpled', !!air, time);
  return (
    <Shell
      mode={mode}
      title={[
        '相同质量 · 同高 · 同时释放',
        'Same mass · Same height · Same release',
      ]}
      note={[
        '定性阻力演示：两份纸各5 g，从20 m静止释放；g取10 m/s²。静止空气中线性阻力F阻=c·v，平纸c=0.010、纸团0.001 kg/s，无空气时c=0；真实纸可能翻转，真实阻力不一定线性。只模拟到首次落地，落地后显示静止，不计算碰撞与支撑力。2倍播放，20 m仅为屏幕模型。',
        'Qualitative drag demonstration: two 5 g papers released from rest at 20 m; g=10 m/s². Still-air linear drag Fdrag=c·v, with c=0.010 for flat paper and 0.001 kg/s for crumpled paper, or 0 without air. Real paper can turn; real drag need not be linear. First landing only; post-landing icons rest, with impact/support forces omitted. Playback 2×; 20 m is screen-only.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['空气条件', 'Air condition']}
          values={[
            { id: 1, zh: '有空气', en: 'With air' },
            { id: 0, zh: '理想无空气', en: 'Ideal no air' },
          ]}
          value={air}
          disabled={animation.running}
          set={(n) => {
            setAir(n);
            animation.reset();
          }}
        />
      </div>
      <svg
        viewBox="0 0 640 330"
        className="phy-simulation phy-force-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Equal-mass flat and crumpled paper falling together'
            : '同质量平纸与纸团同时下落'
        }
      >
        <text x="320" y="20" textAnchor="middle" fill="#836492" fontSize="16">
          t = {time.toFixed(2)} s
        </text>
        <text x="215" y="48" textAnchor="middle" fill="#836492" fontSize="16">
          {mode === 'en' ? 'Flat · 5 g' : '平纸 · 5 g'}
        </text>
        <text x="445" y="48" textAnchor="middle" fill="#836492" fontSize="16">
          {mode === 'en' ? 'Crumpled · 5 g' : '纸团 · 5 g'}
        </text>
        {[0, 10, 20].map((d) => (
          <g key={d}>
            <path
              d={`M90 ${60 + d * 10}H550`}
              stroke="#e4dbea"
              strokeDasharray="4 5"
            />
            <text x="70" y={65 + d * 10} fill="#957ca1" fontSize="15">
              {d}
            </text>
          </g>
        ))}
        <text x="55" y="295" fill="#957ca1" fontSize="15">
          s (m) ↓
        </text>
        <path d="M120 274h435" stroke="#beaccd" strokeWidth="3" />
        {[flat, ball].map((drop, i) => {
          const x = i ? 445 : 215,
            y = 60 + drop.distance * 10;
          return (
            <g key={i}>
              {i ? (
                <circle cx={x} cy={y} r="11" fill="#cfb18b" />
              ) : (
                <path d={`M${x - 42} ${y - 4}h84l-7 8h-84Z`} fill="#c2afd6" />
              )}
              {!drop.landed && (
                <>
                  <path
                    d={`M${x + 55} ${y}v${drop.gravity * 700}m-5-7 5 7 5-7`}
                    fill="none"
                    stroke="#a280b7"
                    strokeWidth="2"
                  />
                  {drop.drag > 0 && (
                    <path
                      d={`M${x - 60} ${y}v${-drop.drag * 700}m-5 7 5-7 5 7`}
                      fill="none"
                      stroke="#bd9768"
                      strokeWidth="2"
                    />
                  )}
                </>
              )}
              {drop.landed && (
                <text
                  x={x}
                  y="313"
                  textAnchor="middle"
                  fill="#836492"
                  fontSize="16"
                >
                  {mode === 'en' ? 'Landed' : '已着地'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="phy-force-legend">
        <B
          zh="向下紫色箭头：重力 · 向上金色箭头：空气阻力。纵向标尺显示已下落的路程。"
          en="Downward purple: gravity · Upward gold: air resistance. Vertical scale shows distance already fallen."
          mode={mode}
        />
      </p>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <B
            zh={animation.running ? '下落中…' : '同时释放两种纸'}
            en={animation.running ? 'Falling…' : 'Release both papers'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['平纸下落路程', 'Flat-paper fall']}>
          {flat.distance.toFixed(2)} m
        </Metric>
        <Metric mode={mode} title={['纸团下落路程', 'Crumpled-paper fall']}>
          {ball.distance.toFixed(2)} m
        </Metric>
        <Metric mode={mode} title={['平纸当前阻力', 'Flat-paper drag']}>
          {flat.drag.toFixed(3)} N
        </Metric>
        <Metric mode={mode} title={['纸团当前阻力', 'Crumpled-paper drag']}>
          {ball.drag.toFixed(3)} N
        </Metric>
      </div>
      {!animation.running && time > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="本模型的首次落地时间"
                en="First-landing times in this model"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="形状" en="Shape" mode={mode} />
                </th>
                <th>
                  <B zh="质量" en="Mass" mode={mode} />
                </th>
                <th>
                  <B zh="时间" en="Time" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <B zh="平纸" en="Flat" mode={mode} />
                </th>
                <td>5 g</td>
                <td>{flat.landingTime.toFixed(2)} s</td>
              </tr>
              <tr>
                <th>
                  <B zh="纸团" en="Crumpled" mode={mode} />
                </th>
                <td>5 g</td>
                <td>{ball.landingTime.toFixed(2)} s</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${cases.count}/2：有空气与无空气。模型数字不是家庭实测结果。`}
          en={`Compared ${cases.count}/2: with and without air. Model numbers are not home measurements.`}
          mode={mode}
        />
      </p>
    </Shell>
  );
}
