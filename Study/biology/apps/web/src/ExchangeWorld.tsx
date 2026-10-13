import { useMemo, useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  diffusionRun,
  membraneRoute,
  osmosisTendency,
  shapeMetrics,
  exchangeShapes,
  type DiffusionSnapshot,
  type InitialLeft,
  type MembraneSubstance,
  type OutsideSolution,
  type ExchangeShape,
} from './exchangeModel';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const green = '#708a58',
  blue = '#608b9b',
  gold = '#b59a52',
  purple = '#9e85a9';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
function Choices<T extends string | number>({
  values,
  value,
  choose,
  mode,
  label,
}: {
  values: readonly (readonly [T, LocalizedText])[];
  value: T;
  choose: (value: T) => void;
  mode: LanguageMode;
  label: LocalizedText;
}) {
  return (
    <div
      className="bio-choice-row bio-exchange-choices"
      aria-label={word(mode, label)}
    >
      {values.map(([v, text]) => (
        <button key={v} aria-pressed={v === value} onClick={() => choose(v)}>
          <Text mode={mode} text={text} />
        </button>
      ))}
    </div>
  );
}
function Notes({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字路线与模型边界', 'Text route & model limits')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
function Metric({
  mode,
  label,
  value,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: string | number;
}) {
  return (
    <article>
      <span>
        <Text mode={mode} text={label} />
      </span>
      <strong>{value}</strong>
    </article>
  );
}
const substances = [
  ['oxygen', t('氧气 O₂', 'Oxygen O₂')],
  ['sodium', t('钠离子 Na⁺', 'Sodium Na⁺')],
  ['protein', t('蛋白质', 'Protein')],
] as const;
const routes = {
  lipid: t('可经过脂质内部', 'Can cross the lipid core'),
  channel: t(
    '可经过特定的开放钠通道',
    'Can cross the specific open sodium channel',
  ),
  blocked: t('不能经过这里展示的路线', 'Cannot use the routes shown here'),
};
function MembraneCanvas({
  mode,
  substance = 'oxygen',
  channel = false,
  frame = 0,
}: {
  mode: LanguageMode;
  substance?: MembraneSubstance;
  channel?: boolean;
  frame?: number;
}) {
  const route = membraneRoute(substance, channel),
    x = [
      65,
      155,
      route === 'blocked' ? 170 : 275,
      route === 'blocked' ? 150 : 340,
    ][frame]!,
    y = substance === 'oxygen' ? 93 : substance === 'sodium' ? 170 : 242;
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={word(
        mode,
        t(
          '磷脂双层与特定钠通道的路线示意',
          'Routes through a bilayer and a specific sodium channel',
        ),
      )}
    >
      <rect x="20" y="40" width="177" height="233" rx="18" fill="#edf0e5" />
      <rect x="232" y="40" width="168" height="233" rx="18" fill="#e9f0f1" />
      <text x="87" y="26" textAnchor="middle" fill={green} fontSize="14">
        {word(mode, t('细胞外', 'Outside'))}
      </text>
      <text x="330" y="26" textAnchor="middle" fill={blue} fontSize="14">
        {word(mode, t('细胞内', 'Inside'))}
      </text>
      <rect x="196" y="45" width="34" height="218" fill="#e8d7af" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <path
            d={`M201 ${52 + i * 18}l11-3m-11 3 11 4M225 ${52 + i * 18}l-10-3m10 3-10 4`}
            fill="none"
            stroke={gold}
            strokeWidth="2"
          />
          <circle cx="196" cy={52 + i * 18} r="5" fill={blue} />
          <circle cx="230" cy={52 + i * 18} r="5" fill={blue} />
        </g>
      ))}
      <rect
        x="188"
        y="152"
        width="51"
        height="36"
        rx="10"
        fill="#b7c79f"
        stroke={green}
        strokeWidth="3"
      />
      {channel ? (
        <path d="M189 170h49" stroke="#e9f0f1" strokeWidth="12" />
      ) : (
        <rect x="207" y="157" width="12" height="26" rx="4" fill={green} />
      )}
      {frame > 0 && (
        <path
          d={`M65 ${y}H${x}`}
          fill="none"
          stroke={route === 'blocked' ? purple : blue}
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      )}
      <g transform={`translate(${x} ${y})`}>
        {substance === 'oxygen' ? (
          <>
            <circle cx="-6" r="7" fill={blue} />
            <circle cx="6" r="7" fill={blue} />
          </>
        ) : substance === 'sodium' ? (
          <>
            <circle r="9" fill={gold} />
            <text y="4" textAnchor="middle" fill="#fff" fontSize="14">
              +
            </text>
          </>
        ) : (
          <path
            d="M-17-3q-7-18 8-16q15-8 20 8q19 9 5 20q-8 13-21 4q-17 4-12-16Z"
            fill={purple}
          />
        )}
      </g>
      {frame >= 2 && route === 'blocked' && (
        <path
          d={`M177 ${y - 13}l14 26m0-26-14 26`}
          stroke={purple}
          strokeWidth="3"
        />
      )}
      <text x="210" y="292" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t('图标不代表真实分子尺寸', 'Icons are not molecular sizes'),
        )}
      </text>
    </svg>
  );
}
const membraneFrames = [
  t(
    '先选一种物质：能不能通过，不只取决于大小。',
    'Choose a substance: size alone does not decide passage.',
  ),
  t(
    '靠近膜，比较脂质内部与特定运输蛋白。',
    'Approach the membrane; compare its lipid core and specific protein.',
  ),
  t(
    '检查路线：氧气走脂质，钠需要合适的开放通道。',
    'Check the route: oxygen uses lipids; sodium needs a suitable open channel.',
  ),
  t(
    '单粒可能路线不是总体方向；下一课再数双向运动。',
    'One possible route is not an overall direction; count both directions next lesson.',
  ),
];
function MembraneLab({ id, mode, onExplore }: Props) {
  const [substance, setSubstance] = useState<MembraneSubstance>('oxygen'),
    [channel, setChannel] = useState(false),
    flow = useFrames(3, onExplore);
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '这粒物质能走哪条路？',
            'Which route can this substance use?',
          )}
        />
      </h3>
      <Choices
        values={substances}
        value={substance}
        mode={mode}
        label={t('物质', 'Substance')}
        choose={(v) => {
          setSubstance(v);
          flow.reset();
          onExplore();
        }}
      />
      <button
        className="bio-exchange-toggle"
        aria-pressed={channel}
        onClick={() => {
          setChannel(!channel);
          flow.reset();
          onExplore();
        }}
      >
        <Text
          mode={mode}
          text={
            channel
              ? t('钠通道：打开', 'Sodium channel: open')
              : t('钠通道：关闭', 'Sodium channel: closed')
          }
        />
      </button>
      <div className="bio-exchange-window">
        <MembraneCanvas
          mode={mode}
          substance={substance}
          channel={channel}
          frame={flow.frame}
        />
      </div>
      <p className="bio-exchange-result" aria-live="polite">
        <Text mode={mode} text={routes[membraneRoute(substance, channel)]} />
      </p>
      <p className="bio-frame-caption">
        <Text mode={mode} text={membraneFrames[flow.frame]!} />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '文字路线：氧气→脂质内部；钠离子→合适的开放钠通道；蛋白质不能走这里的两条路线。追踪图是假定适合向内驱动力的一粒示意，不是随机运动、真实大小或速率。离子还受电荷差影响，模型不计算电压；载体、泵与内吞等省略。',
          'Text route: oxygen → lipid core; sodium → its suitable open channel; protein cannot use these two routes. The tracer illustrates one inward journey under a suitable driving condition, not random motion, molecular size or rate. Electrical differences also affect ions; voltage, carriers, pumps and endocytosis are omitted.',
        )}
      />
    </div>
  );
}
const distributions = [
  [12, t('左12 · 右4', 'Left 12 · right 4')],
  [8, t('左8 · 右8', 'Left 8 · right 8')],
  [4, t('左4 · 右12', 'Left 4 · right 12')],
] as const;
const px = (x: number) => 38 + ((x + 0.5) * 344) / 24,
  py = (y: number) => 53 + ((y + 0.5) * 190) / 12;
function DiffusionCanvas({
  mode,
  snapshot,
}: {
  mode: LanguageMode;
  snapshot: DiffusionSnapshot;
}) {
  return (
    <svg
      viewBox="0 0 420 290"
      role="img"
      aria-label={word(
        mode,
        t(
          `随机运动：左${snapshot.left}粒，右${snapshot.right}粒，金色折线是一粒的路线`,
          `Random motion: ${snapshot.left} particles left, ${snapshot.right} right; gold shows one particle's route`,
        ),
      )}
    >
      <rect
        x="30"
        y="44"
        width="360"
        height="209"
        rx="18"
        fill="#edf0e5"
        stroke={green}
      />
      <path d="M210 45v207" stroke={green} strokeDasharray="6 6" />
      <text x="120" y="29" textAnchor="middle" fill={green} fontSize="15">
        {word(mode, t(`左 ${snapshot.left}`, `Left ${snapshot.left}`))}
      </text>
      <text x="300" y="29" textAnchor="middle" fill={green} fontSize="15">
        {word(mode, t(`右 ${snapshot.right}`, `Right ${snapshot.right}`))}
      </text>
      <polyline
        points={snapshot.trail.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')}
        stroke={gold}
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      {snapshot.particles
        .filter((p) => p.id !== 0)
        .map((p) => (
          <circle
            key={p.id}
            cx={px(p.x)}
            cy={py(p.y)}
            r="5"
            fill={purple}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
      <circle
        cx={px(snapshot.particles[0]!.x)}
        cy={py(snapshot.particles[0]!.y)}
        r="7"
        fill={gold}
        stroke="#fff"
        strokeWidth="2"
      />
      <text x="210" y="277" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t('等体积 · 中线不是膜', 'Equal volumes · midline is not a membrane'),
        )}
      </text>
    </svg>
  );
}
function DiffusionLab({ id, mode, onExplore }: Props) {
  const [initial, setInitial] = useState<InitialLeft>(12),
    [seed, setSeed] = useState(12345),
    flow = useFrames(6, onExplore),
    run = useMemo(() => diffusionRun(initial, seed), [initial, seed]),
    s = run[flow.frame]!,
    net = s.leftToRight - s.rightToLeft;
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t('追踪一粒，再数整群', 'Track one, count the group')}
        />
      </h3>
      <Choices
        values={distributions}
        value={initial}
        mode={mode}
        label={t('起始分布', 'Initial distribution')}
        choose={(v) => {
          setInitial(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-exchange-window">
        <DiffusionCanvas mode={mode} snapshot={s} />
      </div>
      <div className="bio-exchange-metrics">
        <Metric
          mode={mode}
          label={t('左侧数量', 'Left count')}
          value={s.left}
        />
        <Metric
          mode={mode}
          label={t('右侧数量', 'Right count')}
          value={s.right}
        />
        <Metric
          mode={mode}
          label={t('本段 左→右', 'This interval L→R')}
          value={s.leftToRight}
        />
        <Metric
          mode={mode}
          label={t('本段 右→左', 'This interval R→L')}
          value={s.rightToLeft}
        />
      </div>
      <p className="bio-exchange-result" aria-live="polite">
        <Text
          mode={mode}
          text={
            flow.frame === 0
              ? t(
                  '起始帧：还没有穿越记录',
                  'Initial snapshot: no crossing events yet',
                )
              : t(
                  `本段净向右 ${net}（负数表示净向左）`,
                  `Net rightward this interval: ${net} (negative means leftward)`,
                )
          }
        />
      </p>
      <p className="bio-frame-caption">
        <Text
          mode={mode}
          text={t(
            `模型步 ${s.tick}：金点随机往返；数量可以波动，不要求每帧更均匀。`,
            `Model step ${s.tick}: gold moves randomly; counts can fluctuate rather than becoming more even in every snapshot.`,
          )}
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <button
        className="bio-exchange-toggle"
        onClick={() => {
          setSeed((v) => v + 1);
          flow.reset();
          onExplore();
        }}
      >
        <Text mode={mode} text={t('换一段轨迹', 'Another trace')} />
      </button>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('展开七帧记录表', 'Open seven-snapshot record')}
          />
        </summary>
        <div className="bio-exchange-table">
          <table>
            <caption>
              <Text
                mode={mode}
                text={t(
                  '模型记录：事件可含同一粒往返，步数不是真实秒',
                  'Model record: events can include returns; steps are not seconds',
                )}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('模型步', 'Step')} />
                </th>
                <th>
                  <Text mode={mode} text={t('左', 'Left')} />
                </th>
                <th>
                  <Text mode={mode} text={t('右', 'Right')} />
                </th>
                <th>L→R</th>
                <th>R→L</th>
                <th>
                  <Text mode={mode} text={t('净右', 'Net right')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {run.map((r) => (
                <tr
                  key={r.tick}
                  aria-current={r.tick === s.tick ? 'step' : undefined}
                >
                  <td>{r.tick}</td>
                  <td>{r.left}</td>
                  <td>{r.right}</td>
                  <td>{r.leftToRight}</td>
                  <td>{r.rightToLeft}</td>
                  <td>{r.leftToRight - r.rightToLeft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Notes
        mode={mode}
        text={t(
          '16粒独立点在二维网格随机走，方向不读取浓度；中线仅用于计数。边缘封闭，点可重叠，数量保持16。每32步截一帧，折线是金点上一段路线；起始帧没有事件。两方向次数含重复穿越，差值等于左侧减少数。高到低是多次运行的整体趋势，不保证每段单调。省略溶剂流动、碰撞细节与温度变化，不能计算真实速率。',
          'Sixteen independent points walk randomly on a 2D grid without consulting concentration. The midline only counts crossings; outer edges are closed and points may overlap. Counts remain 16. Snapshots are 32 steps apart; gold shows its previous interval. Directional counts include repeated crossings; their difference equals the left decrease. High-to-low is a repeated-run trend, not guaranteed interval monotonicity. Solvent flow, collision details and temperature changes are omitted; no real rate is calculated.',
        )}
      />
    </div>
  );
}
const solutions = [
  ['dilute', t('外液稀 · 1', 'Dilute outside · 1')],
  ['same', t('外液相同 · 4', 'Matching outside · 4')],
  ['concentrated', t('外液浓 · 8', 'Concentrated outside · 8')],
] as const;
const waterResult = {
  into: t(
    '起始净向内；壁的支持可限制后续入水',
    'Initial net inward; wall support can limit later entry',
  ),
  out: t(
    '起始净向外；内容物可能缩离壁',
    'Initial net outward; contents may shrink from the wall',
  ),
  balanced: t(
    '没有起始净偏向；水仍可双向运动',
    'No initial net preference; water can still move both ways',
  ),
  blocked: t(
    '本模型膜不让水通过：没有跨膜水移动',
    'No water passage in this model: no transmembrane water movement',
  ),
};
function OsmosisCanvas({
  mode,
  outside = 'same',
  passes = true,
  frame = 0,
}: {
  mode: LanguageMode;
  outside?: OutsideSolution;
  passes?: boolean;
  frame?: number;
}) {
  const trend = osmosisTendency(outside, passes),
    change = frame >= 2 ? (trend === 'into' ? 1 : trend === 'out' ? -1 : 0) : 0,
    w = 140 + change * 24,
    h = 148 + change * 24,
    x = 110 - w / 2,
    y = 164 - h / 2;
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={word(
        mode,
        t(
          '固定细胞壁、内部膜与水的起始双向趋势',
          'Fixed wall, inner membrane and initial two-way water tendency',
        ),
      )}
    >
      <rect x="15" y="42" width="390" height="236" rx="18" fill="#e9f0f1" />
      <rect
        x="20"
        y="60"
        width="180"
        height="208"
        rx="16"
        fill="#dce5c7"
        stroke={green}
        strokeWidth="7"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="20"
        fill="#f2f1df"
        stroke={blue}
        strokeWidth="3"
      />
      <rect
        x={x + 20}
        y={y + 21}
        width={w - 40}
        height={h - 42}
        rx="17"
        fill="#d2e4e7"
      />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={x + 24 + (i % 2) * (w - 48)}
          cy={y + 28 + Math.floor(i / 2) * (h - 56)}
          r="5"
          fill={gold}
        />
      ))}
      {Array.from(
        { length: outside === 'dilute' ? 1 : outside === 'same' ? 4 : 8 },
        (_, i) => (
          <circle
            key={i}
            cx={253 + (i % 3) * 43}
            cy={100 + Math.floor(i / 3) * 35}
            r="5"
            fill={gold}
          />
        ),
      )}
      {frame > 0 && passes && (
        <g fill="none" stroke={blue} strokeLinecap="round">
          <path
            d="M319 216H177m0 0 12-8m-12 8 12 8"
            strokeWidth={trend === 'into' ? 5 : 2}
          />
          <path
            d="M177 247H319m0 0-12-8m12 8-12 8"
            strokeWidth={trend === 'out' ? 5 : 2}
          />
        </g>
      )}
      <text x="110" y="29" textAnchor="middle" fill={green} fontSize="13">
        {word(mode, t('内侧起始 · 4', 'Inside starts · 4'))}
      </text>
      <text x="301" y="29" textAnchor="middle" fill={blue} fontSize="13">
        {word(mode, t('外侧溶液', 'Outside solution'))}
      </text>
      <text x="210" y="295" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t(
            '形状是示意，不是计算的终点',
            'Shapes illustrate, not calculate an endpoint',
          ),
        )}
      </text>
    </svg>
  );
}
const waterFrames = [
  t(
    '起始：内侧相对溶质浓度4，温度/压力相同；溶质不穿膜。',
    'Start: inside relative solute concentration 4; equal temperature/pressure; solute does not cross.',
  ),
  t(
    '水若能通过，可向两个方向移动；比较起始净趋势。',
    'If water can pass, it can move both ways; compare initial net tendencies.',
  ),
  t(
    '示意内容物的可能变化：壁仍在，膜不等于壁。',
    'Illustrate a possible change in contents: the wall remains and differs from the membrane.',
  ),
  t(
    '回到条件：压力变化可改变后续趋势。图不预测最终体积或浓度。',
    'Recheck conditions: pressure changes can alter later tendencies. No final volume or concentration is predicted.',
  ),
];
function OsmosisLab({ id, mode, onExplore }: Props) {
  const [outside, setOutside] = useState<OutsideSolution>('same'),
    [passes, setPasses] = useState(true),
    flow = useFrames(3, onExplore);
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '换外液，追踪水',
            'Change the outside solution, follow water',
          )}
        />
      </h3>
      <Choices
        values={solutions}
        value={outside}
        mode={mode}
        label={t('外侧溶液', 'Outside solution')}
        choose={(v) => {
          setOutside(v);
          flow.reset();
          onExplore();
        }}
      />
      <button
        className="bio-exchange-toggle"
        aria-pressed={passes}
        onClick={() => {
          setPasses(!passes);
          flow.reset();
          onExplore();
        }}
      >
        <Text
          mode={mode}
          text={
            passes
              ? t('膜：水可通过', 'Membrane: water can pass')
              : t('膜：水不能通过', 'Membrane: water cannot pass')
          }
        />
      </button>
      <div className="bio-exchange-window">
        <OsmosisCanvas
          mode={mode}
          outside={outside}
          passes={passes}
          frame={flow.frame}
        />
      </div>
      <p className="bio-exchange-result" aria-live="polite">
        <Text
          mode={mode}
          text={waterResult[osmosisTendency(outside, passes)]}
        />
      </p>
      <p className="bio-frame-caption">
        <Text mode={mode} text={waterFrames[flow.frame]!} />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '文字路线：初始压力/温度相同，内侧溶质4，外侧1→起始水净向内，外侧4→无起始净偏向，外侧8→起始净向外。膜不透水则无跨膜水运动；溶质在本图不穿膜。绿色是壁、蓝色边界是膜、金色是溶质。双向箭头示意起始趋势，不是持续流速；点和体积不用于算最终浓度。壁与膨压可限制后续入水；最终状态还受压力、水势和真实细胞调节影响。',
          'Text route: equal starting pressure/temperature, inside solute 4; outside 1 → initial net inward, 4 → no initial net preference, 8 → initial net outward. An impermeable membrane blocks water; solute does not cross in this model. Green is wall, blue boundary membrane, gold solute. Two-way arrows show initial tendency, not sustained rates; dots and volume do not calculate final concentration. Wall support and turgor can limit later entry; endpoints depend on pressure, water potential and real regulation.',
        )}
      />
    </div>
  );
}
const shapeChoices = [
  ['large', t('一个大立方体', 'One large cube')],
  ['small', t('八个分离小块', 'Eight separate cubes')],
  ['flat', t('一个薄盒', 'One thin box')],
] as const;
function Box({
  x,
  y,
  dimensions,
  scale,
  highlight,
}: {
  x: number;
  y: number;
  dimensions: readonly [number, number, number];
  scale: number;
  highlight: boolean;
}) {
  const [a, b, c] = dimensions,
    w = a * scale,
    d = b * scale * 0.6,
    r = b * scale * 0.45,
    h = c * scale;
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={green}
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d={`M0 0h${w}v${-h}H0Z`} fill="#dce5c7" />
      <path d={`M0 ${-h}l${d} ${-r}h${w}l${-d} ${r}Z`} fill="#edf0df" />
      <path d={`M${w} 0l${d} ${-r}v${-h}l${-d} ${r}Z`} fill="#b5c99a" />
      {highlight && (
        <g stroke={blue} strokeWidth="3">
          <path d={`M${w / 2 + d / 2} ${-h / 2 - r / 2}v${-h / 2}`} />
          <circle cx={w / 2 + d / 2} cy={-h / 2 - r / 2} r="4" fill={blue} />
        </g>
      )}
    </g>
  );
}
function ShapeCanvas({
  mode,
  shape = 'large',
  frame = 0,
}: {
  mode: LanguageMode;
  shape?: ExchangeShape;
  frame?: number;
}) {
  return (
    <svg
      viewBox="0 0 420 310"
      role="img"
      aria-label={word(mode, shapeChoices.find(([k]) => k === shape)![1])}
    >
      <rect x="15" y="40" width="390" height="250" rx="18" fill="#f0f2e7" />
      <text x="210" y="26" textAnchor="middle" fill={green} fontSize="14">
        {word(mode, t('相同总体积：8 u³', 'Same total volume: 8 u³'))}
      </text>
      {shape === 'small' ? (
        Array.from({ length: 8 }, (_, i) => (
          <Box
            key={i}
            x={37 + (i % 4) * 90}
            y={136 + Math.floor(i / 4) * 115}
            dimensions={exchangeShapes.small.dimensions}
            scale={32}
            highlight={frame === 2}
          />
        ))
      ) : (
        <Box
          x={shape === 'flat' ? 98 : 128}
          y={233}
          dimensions={exchangeShapes[shape].dimensions}
          scale={shape === 'flat' ? 42 : 53}
          highlight={frame === 2}
        />
      )}
      <text x="210" y="308" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t(
            '数值含全部六面；蓝线是最近中心距离',
            'Values count all six faces; blue = nearest centre distance',
          ),
        )}
      </text>
    </svg>
  );
}
const shapeFrames = [
  t(
    '先核对总量：三种配置体积都是8u³。',
    'Check amount first: all three configurations total 8u³.',
  ),
  t(
    '比较全部外露面积：图中看不见的面也要计入，接触面除外。',
    'Compare all exposed faces, including unseen ones, excluding touching faces.',
  ),
  t(
    '蓝线表示中心到最近表面的距离；不是所有分子的路径。',
    'Blue marks centre-to-nearest-face distance, not every molecule’s path.',
  ),
  t(
    '面积与距离是交换线索；还需通透性、驱动力和环境等条件。',
    'Area and distance are clues; permeability, driving conditions and environment also matter.',
  ),
];
function ShapeLab({ id, mode, onExplore }: Props) {
  const [shape, setShape] = useState<ExchangeShape>('large'),
    flow = useFrames(3, onExplore),
    m = shapeMetrics(shape);
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '一样多，怎样改变接触面？',
            'Same amount, different contact area?',
          )}
        />
      </h3>
      <Choices
        values={shapeChoices}
        value={shape}
        mode={mode}
        label={t('形状配置', 'Shape configuration')}
        choose={(v) => {
          setShape(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-exchange-window">
        <ShapeCanvas mode={mode} shape={shape} frame={flow.frame} />
      </div>
      <div className="bio-exchange-metrics">
        <Metric
          mode={mode}
          label={t('总体积', 'Total volume')}
          value={`${m.volume} u³`}
        />
        <Metric
          mode={mode}
          label={t('总外露面积', 'Total exposed area')}
          value={`${m.area} u²`}
        />
        <Metric
          mode={mode}
          label={t('面积 / 体积', 'Area / volume')}
          value={`${m.areaPerVolume} /u`}
        />
        <Metric
          mode={mode}
          label={t('中心最近距离', 'Nearest centre distance')}
          value={`${m.centreDistance} u`}
        />
      </div>
      <p className="bio-frame-caption" aria-live="polite">
        <Text mode={mode} text={shapeFrames[flow.frame]!} />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '文字比较：大立方体2×2×2，面积24、体积8、中心最近距离1。八个1×1×1分离小块，总面积48、总体积8、距离0.5。薄盒4×2×1，面积28、体积8、距离0.5。单位u为虚构长度；图不按真实细胞尺寸，透视只露三个面，算全部六面。小块没有相接隐藏面。中心最近距离只是几何线索，导览不计算交换时间、速率、存活率或所有粒子路径。',
          'Text comparison: large 2×2×2 cube has area 24, volume 8, nearest centre distance 1. Eight separate 1×1×1 cubes total area 48, volume 8, distance 0.5. Thin 4×2×1 box has area 28, volume 8, distance 0.5. Unit u is invented; this is not real cell scale. Perspective shows three faces but counts all six; small cubes have no hidden touching faces. Centre distance is one geometric clue, not exchange time, rate, survival or every particle’s path.',
        )}
      />
    </div>
  );
}
export function ExchangeExplore(props: Props) {
  return props.id === 'L030' ? (
    <DiffusionLab {...props} />
  ) : props.id === 'L031' ? (
    <OsmosisLab {...props} />
  ) : props.id === 'L032' ? (
    <ShapeLab {...props} />
  ) : (
    <MembraneLab {...props} />
  );
}
const clues = {
  L029: [
    t(
      '脂质双层形成边界，特定蛋白提供不同路线。',
      'A bilayer forms the boundary; specific proteins provide routes.',
    ),
    t(
      '不带电氧气可经过脂质，带电钠需要合适路线。',
      'Uncharged oxygen can cross lipids; charged sodium needs a suitable route.',
    ),
    t(
      '选择性不是思考，也不只按大小。壁不代替膜。',
      'Selectivity is not thought or size alone. A wall does not replace a membrane.',
    ),
  ],
  L030: [
    t(
      '金色折线：一粒随机移动，不读取浓度。',
      'Gold trail: an individual moves randomly without reading concentration.',
    ),
    t(
      '两方向都可穿越；相减得到净变化。',
      'Crossings occur both ways; subtract for net change.',
    ),
    t(
      '相同体积才能在这里用数量比较浓度；均匀不等于停止。',
      'Equal volumes allow concentration comparison by count; uniform is not motionless.',
    ),
  ],
  L031: [
    t(
      '绿色是壁，蓝色内边界是膜，金色点是溶质。',
      'Green is wall, blue boundary membrane, gold dots solute.',
    ),
    t(
      '初始压力相同、溶质不穿膜；浓外液使水起始净外移。',
      'Equal initial pressure and retained solute: concentrated outside gives initial net outward water movement.',
    ),
    t(
      '水可双向移动；压力与壁会影响后续，图不计算终点。',
      'Water moves both ways; pressure and wall affect later changes. No endpoint is calculated.',
    ),
  ],
  L032: [
    t(
      '总体积一样，外露面积可不同。',
      'Equal total volume can expose different areas.',
    ),
    t(
      '小块分开放，六面都计入；薄形缩短某些距离。',
      'Separated cubes expose all six faces; thinness shortens some distances.',
    ),
    t(
      '几何有帮助，真实交换还需膜性质、驱动力与供给。',
      'Geometry helps; real exchange also needs permeability, driving conditions and supply.',
    ),
  ],
};
export function ExchangeHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return id === 'L030' ? (
    <DiffusionCanvas mode={mode} snapshot={diffusionRun(12)[1]!} />
  ) : id === 'L031' ? (
    <OsmosisCanvas mode={mode} outside="concentrated" frame={2} />
  ) : id === 'L032' ? (
    <ShapeCanvas mode={mode} shape="small" />
  ) : (
    <MembraneCanvas mode={mode} channel frame={2} substance="sodium" />
  );
}
export function ExchangeDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    list = clues[id as keyof typeof clues] ?? clues.L029;
  return (
    <figure
      className="bio-diagram bio-exchange-diagram"
      data-resource-id={`${id}-D01`}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('交换线索地图', 'EXCHANGE CLUE MAP')} />
      </span>
      <ExchangeHookArt id={id} mode={mode} />
      <Choices
        values={list.map(
          (_, i) => [i, t(`线索${i + 1}`, `Clue ${i + 1}`)] as const,
        )}
        value={clue}
        choose={setClue}
        mode={mode}
        label={t('图解线索', 'Diagram clues')}
      />
      <figcaption aria-live="polite">
        <Text mode={mode} text={list[clue]!} />
      </figcaption>
      <small>
        <Text
          mode={mode}
          text={t(
            '原创教学示意，不是真实细胞测量。完整条件与数据在动手模型中。',
            'Original schematic, not a cell measurement. Explore the model for conditions and records.',
          )}
        />
      </small>
    </figure>
  );
}
