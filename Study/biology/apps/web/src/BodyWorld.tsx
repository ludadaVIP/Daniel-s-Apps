import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import { armGeometry, gasRoutes } from './models';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const blue = '#568998',
  gold = '#b59548',
  coral = '#bd7e75',
  green = '#66835c';
const organs = [
  t('脑', 'Brain'),
  t('肺', 'Lungs'),
  t('心脏', 'Heart'),
  t('小肠', 'Intestine'),
  t('肌肉', 'Muscle'),
];
const organRoles = [
  t(
    '脑处理感官信息、参与协调行动，也依赖血液提供氧和养分。它不是独立的指挥盒。',
    'The brain processes sensory information and helps coordinate action. It also needs oxygen and nutrients from blood.',
  ),
  t(
    '肺让气体在空气与血液之间交换。氧进入血液后，还需要心脏和血管把它送向身体。',
    'Lungs exchange gases between air and blood. Oxygen delivery beyond lungs needs the heart and vessels.',
  ),
  t(
    '心脏推动血液。血液在肺与身体之间循环，运送氧、养分和二氧化碳等物质。',
    'The heart pumps blood between lungs and body, supporting transport of oxygen, nutrients and carbon dioxide.',
  ),
  t(
    '小肠继续消化并吸收多数营养物质。图中葡萄糖和氨基酸进入血液，再被运到细胞。',
    'The small intestine continues digestion and absorbs most nutrients. Here glucose and amino acids enter blood for delivery to cells.',
  ),
  t(
    '骨骼肌牵拉骨，帮助在关节处运动。神经协调动作；循环供应氧和养分，细胞提供可用能量。',
    'Skeletal muscles pull bones to move joints. Nerves coordinate them, circulation supplies oxygen and nutrients, and cells provide usable energy.',
  ),
];
function Body({
  active = -1,
  select,
}: {
  active?: number;
  select?: (i: number) => void;
}) {
  const spots = [
    [210, 52],
    [172, 149],
    [226, 181],
    [211, 227],
    [296, 160],
  ];
  function part(i: number, drawing: ReactNode) {
    return (
      <g
        key={i}
        opacity={active < 0 || active === i ? 1 : 0.42}
        className={select ? 'bio-organ-target' : undefined}
        role={select ? 'button' : undefined}
        tabIndex={select ? 0 : undefined}
        aria-label={select ? `${organs[i]!.zh} / ${organs[i]!.en}` : undefined}
        aria-pressed={select ? active === i : undefined}
        onClick={select ? () => select(i) : undefined}
        onKeyDown={
          select
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  select(i);
                }
              }
            : undefined
        }
      >
        {drawing}
        {select && (
          <>
            <circle
              className="bio-organ-focus-ring"
              cx={spots[i]![0]}
              cy={spots[i]![1]}
              r="23"
              fill="none"
              stroke="#244d36"
              strokeWidth="3"
            />
            <circle
              cx={spots[i]![0]}
              cy={spots[i]![1]}
              r="16"
              fill="#fff9"
              stroke={green}
            />
            <text
              x={spots[i]![0]}
              y={spots[i]![1]! + 5}
              textAnchor="middle"
              fontSize="15"
              fill="#385842"
            >
              {i + 1}
            </text>
          </>
        )}
      </g>
    );
  }
  return (
    <g strokeWidth="2" strokeLinejoin="round">
      <path
        d="M210 93v17m-21-8q-30 2-43 22l-34 122q-4 18 10 19q12 1 17-17l25-85v76l-12 96q-1 15 14 16q13 0 17-16l19-89h16l19 89q4 16 17 16q15-1 14-16l-12-96v-76l25 85q5 18 17 17q14-1 10-19l-34-122q-13-20-43-22"
        fill="#f3e9dc"
        stroke="#bea98e"
      />
      <circle cx="210" cy="55" r="37" fill="#f3e9dc" stroke="#bea98e" />
      {part(
        0,
        <>
          <path
            d="M184 51q-8-15 7-19q5-10 18-5q16-7 23 7q16 5 10 19q6 13-9 18q-13 5-22-3q-12 8-22-1q-12-3-5-16"
            fill="#d7c4d8"
            stroke="#9f84a3"
          />
          <path d="m210 30-2 35m-13-18 8 6m16-14-3 12" stroke="#9f84a3" />
        </>,
      )}
      {part(
        1,
        <>
          <path
            d="M195 123q-26-11-29 42q0 20 29 17ZM225 123q26-11 29 42q0 20-29 17Z"
            fill="#c7dce0"
            stroke={blue}
          />
          <path
            d="M210 110v30m0-9-27 21m27-21 27 21"
            fill="none"
            stroke={blue}
          />
        </>,
      )}
      {part(
        2,
        <path
          d="M224 165q-13-12-20 2q-8 13 22 34q28-23 19-35q-10-9-21-1Z"
          fill="#e5beb8"
          stroke={coral}
        />,
      )}
      {part(
        3,
        <>
          <rect
            x="179"
            y="202"
            width="62"
            height="45"
            rx="10"
            fill="#efdfb1"
            stroke={gold}
          />
          <path
            d="M190 212h40q8 0 8 5t-8 5h-37q-8 0-8 5t8 5h37q8 0 8 5t-8 5"
            fill="none"
            stroke={gold}
          />
        </>,
      )}
      {part(
        4,
        <ellipse
          cx="296"
          cy="160"
          rx="11"
          ry="27"
          transform="rotate(-16 296 160)"
          fill="#d7a6a0"
          stroke={coral}
        />,
      )}
    </g>
  );
}
export function BodyDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const [active, setActive] = useState(
    id === 'L013' ? 3 : id === 'L014' ? 4 : id === 'L016' ? 0 : 1,
  );
  const caption = useId();
  return (
    <figure
      className="bio-diagram bio-body-diagram"
      data-resource-id={`${id}-D01`}
      aria-labelledby={caption}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('身体的合作地图', 'BODY PARTNERSHIP MAP')} />
      </span>
      <svg
        viewBox="0 0 420 360"
        role="group"
        aria-label={word(
          mode,
          '可点击的器官合作图',
          'Clickable organ partnership map',
        )}
      >
        <Body active={active} select={setActive} />
      </svg>
      <div
        className="bio-choice-row bio-body-choice"
        aria-label={word(mode, '选择器官', 'Choose an organ')}
      >
        {organs.map((name, i) => (
          <button
            key={name.en}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <Text
              mode={mode}
              text={t(`${i + 1} ${name.zh}`, `${i + 1} ${name.en}`)}
            />
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={organRoles[active]!} />
        <small>
          <Text
            mode={mode}
            text={t(
              '位置和形状为简化示意，非按比例。点击器官或下方名称。',
              'Positions and shapes are schematic, not to scale. Select an organ or its name below.',
            )}
          />
        </small>
      </figcaption>
    </figure>
  );
}
export function BodyHookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-label={word(
        mode,
        id === 'L013'
          ? '米饭与啄食种子的鸟'
          : id === 'L016'
            ? '窗帘与声音线索'
            : '身体探索示意',
        id === 'L013'
          ? 'Rice bowl and a seed-pecking bird'
          : id === 'L016'
            ? 'Curtain and sound clues'
            : 'Body exploration illustration',
      )}
    >
      {id === 'L013' ? (
        <g strokeWidth="3" strokeLinejoin="round">
          <ellipse cx="113" cy="258" rx="70" ry="10" fill="#dfdac8" />
          <path d="M42 210q71 97 142 0Z" fill="#e8ddba" stroke={gold} />
          <ellipse
            cx="113"
            cy="210"
            rx="70"
            ry="14"
            fill="#f5efd9"
            stroke={gold}
          />
          <path
            d="m77 199 8-3m19 3 8-3m17 5 8-3m-45 14 8-3m18 3 8-3"
            stroke="#cbb988"
            strokeLinecap="round"
          />
          <path d="M178 165 202 96m-8 18 16 5" fill="none" stroke={green} />
          <ellipse
            cx="302"
            cy="206"
            rx="42"
            ry="31"
            fill="#b8cfa5"
            stroke={green}
          />
          <circle cx="276" cy="169" r="26" fill="#c4d8b5" stroke={green} />
          <path d="m250 166-26 7 27 8" fill="#e3c780" stroke={gold} />
          <circle cx="270" cy="162" r="4" fill="#385842" />
          <path
            d="m327 194 36-16-17 32m-53 25v22m24-22v22m-31 0h14m10 0h14"
            fill="none"
            stroke={green}
          />
          <path d="M291 196q33 5 29 26" fill="none" stroke={green} />
          <ellipse
            cx="216"
            cy="187"
            rx="7"
            ry="4"
            fill={gold}
            transform="rotate(-15 216 187)"
          />
        </g>
      ) : id === 'L016' ? (
        <g strokeWidth="3">
          <rect
            x="77"
            y="63"
            width="170"
            height="218"
            rx="5"
            fill="#e4efeb"
            stroke={blue}
          />
          <path d="M162 63v218M77 172h170" stroke={blue} />
          <path
            d="M74 54h176"
            stroke={gold}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M81 64q90 32 10 137l61 82H81Z"
            fill="#dfd1ad"
            stroke={gold}
          />
          <path
            d="m270 142 16 15-16 15m20-46 27 31-27 31"
            fill="none"
            stroke={gold}
            strokeLinecap="round"
          />
          <circle cx="311" cy="248" r="36" fill="#e6ecd9" />
          <text x="311" y="262" fontSize="47" textAnchor="middle" fill={green}>
            ?
          </text>
        </g>
      ) : id === 'L014' ? (
        <Arm angle={40} mode={mode} labels={false} />
      ) : (
        <Body />
      )}
    </svg>
  );
}
function Notes({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字版与模型说明', 'Text version & model notes')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
const centres = [
  [105, 90],
  [315, 90],
  [315, 235],
  [105, 235],
];
function Journey({
  frame,
  labels,
  mode,
  children,
  color = blue,
}: {
  frame: number;
  labels: LocalizedText[];
  mode: LanguageMode;
  children?: ReactNode[];
  color?: string;
}) {
  const arrow = useId();
  return (
    <svg
      viewBox="0 0 420 320"
      role="img"
      aria-label={word(
        mode,
        '四站路线，文字说明在图下',
        'Four-stop route; text explanation below',
      )}
    >
      <defs>
        <marker
          id={arrow}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="m0 0 10 5-10 5Z" fill={color} />
        </marker>
      </defs>
      {['M315 151v24', 'M245 235h-65'].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          markerEnd={`url(#${arrow})`}
        />
      ))}
      <path
        d="M175 90h65"
        fill="none"
        stroke={color}
        strokeWidth="2"
        markerEnd={`url(#${arrow})`}
      />
      {centres.map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x! - 67}
            y={y! - 52}
            width="134"
            height="110"
            rx="16"
            fill={frame === i ? '#edf3e6' : '#faf8f3'}
            stroke={frame === i ? green : '#d9ddcf'}
            strokeWidth={frame === i ? 3 : 1}
          />
          <text x={x! - 51} y={y! - 31} fontSize="13" fill={green}>
            {i + 1}
          </text>
          <g transform={`translate(${x} ${y! - 6})`}>
            {children?.[i] ?? <circle r="18" fill={color} opacity=".35" />}
          </g>
          <text
            x={x}
            y={y! + 42}
            fontSize="16"
            textAnchor="middle"
            fill="#385842"
          >
            {mode === 'en' ? labels[i]!.en : labels[i]!.zh}
          </text>
        </g>
      ))}
    </svg>
  );
}
function FrameText({
  frame,
  mode,
  text,
}: {
  frame: number;
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <div className="bio-result" aria-live="polite" data-step={frame + 1}>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </div>
  );
}
export function BodyExplore(props: Props) {
  return (
    <div data-resource-id={`${props.id}-I01`}>
      {props.id === 'L013' ? (
        <FoodLab {...props} />
      ) : props.id === 'L014' ? (
        <ArmLab {...props} />
      ) : props.id === 'L015' ? (
        <GasLab {...props} />
      ) : (
        <SensesLab {...props} />
      )}
    </div>
  );
}
function FoodLab({ mode, onExplore }: Props) {
  const [protein, setProtein] = useState(false),
    flow = useFrames(3, onExplore);
  const choices = [
    t('米饭中的淀粉', 'Starch in rice'),
    t('豆腐中的蛋白质', 'Protein in tofu'),
  ];
  const labels = [
    t('取食', 'Feeding'),
    t('消化', 'Digestion'),
    t('吸收', 'Absorption'),
    t('细胞利用', 'Cell use'),
  ];
  const frames = [
    t(
      '入口：咀嚼把食物处理成小块。真实米饭和豆腐都有多种成分，这次只跟踪其中一种。',
      'Mouth: chewing processes food into pieces. Rice and tofu contain many components; this route tracks just one.',
    ),
    protein
      ? t(
          '消化：蛋白质主要从胃开始被分解，再在小肠继续，得到可吸收产物，包括氨基酸。',
          'Digestion: protein breakdown begins mainly in the stomach and continues in the small intestine, yielding absorbable products including amino acids.',
        )
      : t(
          '消化：淀粉从口腔开始被酶分解，在小肠继续，最终可得到葡萄糖。不是只有胃在工作。',
          'Digestion: enzymes begin starch breakdown in the mouth; it continues in the small intestine, eventually yielding glucose. The stomach is not the only worker.',
        ),
    t(
      '吸收：小分子穿过小肠壁进入血液。图中的竖线是肠壁边界，圆点是营养物质示意，不是米粒。',
      'Absorption: small molecules cross the intestinal wall into blood. The vertical boundary is the gut wall; dots represent nutrients, not rice grains.',
    ),
    protein
      ? t(
          '细胞利用：血液运输氨基酸等材料，细胞可以用它们制造自己的蛋白质。不是直接拼入豆腐块。',
          'Cell use: blood carries amino acids and other materials; cells can use them to build their own proteins, rather than adding tofu chunks.',
        )
      : t(
          '细胞利用：血液运输葡萄糖；细胞可以通过细胞呼吸从中获得可用能量。还需要器官与其他物质配合。',
          'Cell use: blood transports glucose, which cells can use in cellular respiration for usable energy. Other organs and substances cooperate too.',
        ),
  ];
  const molecules = (split = false) => (
    <g fill={gold}>
      {(split ? [-28, 0, 28] : [-15, 0, 15]).map((x, i) => (
        <circle key={i} cx={x} cy={split ? [-9, 10, -9][i] : 0} r="8" />
      ))}
      {!split && <path d="M-15 0H15" stroke={gold} strokeWidth="4" />}
    </g>
  );
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('午饭的四站旅程', 'Lunch: a four-stop journey')}
        />
      </h3>
      <div className="bio-choice-row bio-body-choice">
        {choices.map((choice, i) => (
          <button
            key={choice.en}
            aria-pressed={protein === Boolean(i)}
            onClick={() => {
              setProtein(Boolean(i));
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={choice} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <Journey frame={flow.frame} labels={labels} mode={mode} color={gold}>
          {[
            <g key="food">
              <path d="M-29-8q29 42 58 0" fill="#e5dec5" stroke={gold} />
              {protein ? (
                <rect
                  x="-18"
                  y="-20"
                  width="36"
                  height="20"
                  rx="4"
                  fill="#f3edce"
                  stroke={gold}
                />
              ) : (
                <g stroke="#f5f0de" strokeWidth="7">
                  <path d="m-14-12 3-3m11 3 3-3m9 7 3-3" />
                </g>
              )}
            </g>,
            <g key="digest">
              {molecules(flow.frame >= 1)}
              <path
                d="m-7-28 14 12m0-12-14 12"
                stroke={coral}
                strokeWidth="2"
              />
            </g>,
            <g key="absorb">
              <path d="M0-28v52" stroke={green} strokeWidth="5" />
              <path d="M7-22v44" stroke={coral} strokeWidth="4" />
              {[-30, -17, 22, 36].map((x, i) => (
                <circle
                  key={x}
                  cx={flow.frame >= 2 ? x : x - 12}
                  cy={i % 2 ? 10 : -8}
                  r="5"
                  fill={gold}
                />
              ))}
              <path
                d="M-20-28h42m-6-5 6 5-6 5"
                fill="none"
                stroke={gold}
                strokeWidth="2"
              />
            </g>,
            <g key="cell">
              <ellipse rx="36" ry="24" fill="#d9e7c7" stroke={green} />
              <circle cx="11" r="10" fill="#bdcfa7" />
              {molecules(true)}
            </g>,
          ]}
        </Journey>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText frame={flow.frame} mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '取食→消化→吸收→运输和细胞利用。颗粒大小与分子大小不同。图中只示葡萄糖或氨基酸的血液路线，省略肝脏等环节；许多脂肪产物先进入淋巴。帧数不代表真实速度。',
          'Feeding → digestion → absorption → transport and cell use. Piece size differs from molecule size. Only glucose or amino-acid blood routes are shown, omitting liver and other steps; many fat products first enter lymph. Frames do not represent real timing.',
        )}
      />
    </>
  );
}
function Arm({
  angle,
  mode,
  labels = true,
  extending = false,
}: {
  angle: number;
  mode: LanguageMode;
  labels?: boolean;
  extending?: boolean;
}) {
  const g = armGeometry(angle),
    fraction = angle / 90;
  const attachment = {
    x: g.elbow.x + (g.hand.x - g.elbow.x) * 0.23,
    y: g.elbow.y + (g.hand.y - g.elbow.y) * 0.23,
  };
  const bicepsX = 213 + fraction * 4,
    bicepsY = 103 - fraction * 8;
  return (
    <g>
      <path
        d="M190 45V155"
        stroke="#c7bda0"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <path
        d={`M190 155L${g.hand.x} ${g.hand.y}`}
        stroke="#c7bda0"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M190 45V155"
        stroke="#f2ead0"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M190 155L${g.hand.x} ${g.hand.y}`}
        stroke="#f2ead0"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={`M193 46Q${bicepsX} 59 ${bicepsX} ${bicepsY - 17}M${bicepsX} ${bicepsY + 20}L${attachment.x} ${attachment.y}`}
        fill="none"
        stroke={coral}
        strokeWidth="3"
        strokeDasharray="5 3"
      />
      <ellipse
        cx={bicepsX}
        cy={bicepsY}
        rx={12 + fraction * 8}
        ry={36 - fraction * 14}
        fill={extending ? '#dfc3bc' : coral}
        stroke={coral}
      />
      <path
        d={`M187 47 160 ${109 - (24 + fraction * 11)}M160 ${109 + (24 + fraction * 11)}L188 163`}
        fill="none"
        stroke={blue}
        strokeWidth="3"
        strokeDasharray="5 3"
      />
      <ellipse
        cx="160"
        cy="109"
        rx={20 - fraction * 8}
        ry={24 + fraction * 11}
        fill={extending ? blue : '#c6dade'}
        stroke={blue}
      />
      <circle
        cx="190"
        cy="155"
        r="11"
        fill="#f9f6e9"
        stroke={green}
        strokeWidth="3"
      />
      <circle
        cx={g.hand.x}
        cy={g.hand.y}
        r="10"
        fill="#ead6bf"
        stroke="#bea98e"
      />
      {labels && (
        <g fontSize="15" fill="#385842">
          <path d={`M${bicepsX + 20} ${bicepsY}H304`} stroke={coral} />
          <text x="311" y={bicepsY + 5}>
            {word(mode, '屈肌', 'Flexor')}
          </text>
          <path d="M148 109H70" stroke={blue} />
          <text x="20" y="114">
            {word(mode, '伸肌', 'Extensor')}
          </text>
          <path d="M179 155H70" stroke={green} />
          <text x="20" y="160">
            {word(mode, '肘关节', 'Elbow')}
          </text>
          <text x="210" y="298" textAnchor="middle">
            {word(
              mode,
              '骨长度固定 · 关节角度改变',
              'Fixed bones · changing joint angle',
            )}
          </text>
        </g>
      )}
    </g>
  );
}
function ArmLab({ mode, onExplore }: Props) {
  const [extending, setExtending] = useState(false),
    flow = useFrames(3, onExplore);
  const angle = extending
    ? [90, 60, 30, 0][flow.frame]!
    : [0, 30, 60, 90][flow.frame]!;
  const frames = [
    t(
      '准备：骨长固定，肘关节是转动处。粉色为屈肌、蓝色为伸肌；颜色用于识别，虚线为简化肌腱。',
      'Start: bone lengths are fixed and the elbow is the pivot. Coral marks a flexor, blue an extensor; dashed lines are simplified tendons.',
    ),
    extending
      ? t(
          '伸臂：伸肌牵拉，帮助前臂向伸直方向转动。不是屈肌主动“推回去”。',
          'Straightening: the extensor pulls to turn the forearm towards straight. The flexor does not actively push it back.',
        )
      : t(
          '弯臂：屈肌牵拉，经肌腱作用到骨，让前臂在肘处转动。',
          'Bending: a flexor pulls through its tendon, turning the forearm at the elbow.',
        ),
    t(
      '继续转动：前臂的位置变了，骨长没有变。真实动作还有其他肌肉与神经参与，模型只突出相反方向的牵拉。',
      'The forearm changes position without changing bone length. Other muscles and nerves participate in real movement; this model emphasises opposing pulls.',
    ),
    extending
      ? t(
          '到达伸直示意位置：伸肌与屈肌产生不同方向动作。静止时也可能需要肌肉稳定关节。',
          'The model reaches straight: extensor and flexor produce opposing actions. Holding still can also require muscles to stabilise joints.',
        )
      : t(
          '到达弯曲示意位置：角度改变，不是骨缩短。切换伸臂，再找相反方向的牵拉。',
          'The model reaches bent: the angle changed, not bone length. Switch to straightening and identify the opposing pull.',
        ),
  ];
  return (
    <>
      <h3>
        <Text mode={mode} text={t('谁在拉动手臂？', 'What pulls the arm?')} />
      </h3>
      <div className="bio-choice-row bio-body-choice">
        {[t('弯臂', 'Bend'), t('伸臂', 'Straighten')].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={extending === Boolean(i)}
            onClick={() => {
              setExtending(Boolean(i));
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 320"
          role="img"
          aria-label={word(
            mode,
            '骨与两块肌肉的手臂模型',
            'Arm model with bones and opposing muscles',
          )}
        >
          <Arm angle={angle} extending={extending} mode={mode} />
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText frame={flow.frame} mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '骨长固定；屈肌牵拉使弯曲，伸肌牵拉使伸直。肌腱连接到骨，关节允许转动。模型省略精确附着、多块肌肉和共同稳定，角度、形状与时间不代表个人活动范围或肌肉力量。',
          'Bone lengths stay fixed. Flexors pull to bend; extensors pull to straighten. Tendons attach to bones and joints permit turning. Detailed attachments, other muscles and co-stabilisation are omitted. Angles, shapes and timing do not measure personal range or strength.',
        )}
      />
    </>
  );
}
const gasLabels: Record<string, LocalizedText> = {
  air: t('外界空气', 'Air'),
  lungs: t('肺部交换', 'Lungs'),
  leftHeart: t('左心泵血', 'Left heart'),
  rightHeart: t('右心泵血', 'Right heart'),
  cells: t('身体细胞', 'Body cells'),
};
function GasLab({ mode, onExplore }: Props) {
  const [carbon, setCarbon] = useState(false),
    flow = useFrames(3, onExplore);
  const route = gasRoutes[carbon ? 'carbon' : 'oxygen'];
  const frames = carbon
    ? [
        t(
          '细胞产生二氧化碳，它进入组织中的血液。这里从肌肉细胞开始跟踪回程。',
          'Cells produce carbon dioxide, which enters tissue blood. We begin the return route at muscle cells.',
        ),
        t(
          '血液从身体返回右心，右心把血液泵向肺。回程也需要心脏，而不是细胞直接把气体吹到肺。',
          'Blood returns from the body to the right heart, which pumps it towards lungs. The return needs the heart too; cells do not blow gas straight into lungs.',
        ),
        t(
          '肺部交换：二氧化碳从血液跨过交换表面进入肺泡中的气体。',
          'Lung exchange: carbon dioxide crosses from blood into alveolar air.',
        ),
        t(
          '呼气：含二氧化碳的气体排向外界。血液则从肺回左心、再向身体继续循环。',
          'Exhalation sends carbon-dioxide-containing air outside. Blood continues from lungs to the left heart and then towards the body.',
        ),
      ]
    : [
        t(
          '空气原本含有氧。吸气把空气带向肺，肺不制造氧。',
          'Air already contains oxygen. Inhalation brings air towards lungs; lungs do not make oxygen.',
        ),
        t(
          '肺部交换：氧从肺泡气体跨过薄的交换表面进入血液。不是整团空气进入血管。',
          'Lung exchange: oxygen crosses thin surfaces from alveolar air into blood, rather than intact air bubbles entering vessels.',
        ),
        t(
          '来自肺的富氧血到达左心，左心把血液泵向身体。图中的“左”指人的左侧，不是屏幕位置。',
          'Oxygen-rich blood from lungs reaches the left heart, which pumps it towards the body. Left means the person’s left, not a screen position.',
        ),
        t(
          '组织交换：氧进入身体细胞，参与有氧细胞呼吸。血液随后回右心再到肺，形成连续循环。',
          'Tissue exchange: oxygen reaches body cells and participates in aerobic respiration. Blood then returns through the right heart to lungs in a continuous circulation.',
        ),
      ];
  const color = carbon ? coral : blue;
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '到达与返回：两条气体路线',
            'Delivery and return: two gas routes',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-body-choice">
        {[
          t('氧的到达', 'Oxygen delivery'),
          t('二氧化碳回程', 'Carbon dioxide return'),
        ].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={carbon === Boolean(i)}
            onClick={() => {
              setCarbon(Boolean(i));
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <Journey
          frame={flow.frame}
          labels={route.map((v) => gasLabels[v]!)}
          mode={mode}
          color={color}
        >
          {route.map((key, i) => (
            <g key={i} fill={color} stroke={color}>
              {key === 'air' ? (
                <g fill="none" strokeWidth="3">
                  <path d="M-35-12h52q14-15 18 0q1 10-14 10H-30M-25 10H17q15 14 20-1" />
                </g>
              ) : key === 'lungs' ? (
                <g>
                  <path
                    d="M-6-20q-23-5-25 28q0 14 25 8ZM6-20q23-5 25 28q0 14-25 8Z"
                    opacity=".35"
                  />
                  <path
                    d="M0-26v20m0-4-14 12m14-12 14 12"
                    fill="none"
                    strokeWidth="3"
                  />
                </g>
              ) : key === 'cells' ? (
                <g>
                  <ellipse rx="32" ry="24" fill="#e0e9d1" stroke={green} />
                  <circle cx="9" cy="-3" r="10" fill="#c2d5ad" stroke={green} />
                </g>
              ) : (
                <path
                  d="M0-13q-23-20-29 3q-3 14 29 34q32-21 29-34q-6-23-29-3Z"
                  opacity=".6"
                />
              )}
              {flow.frame === i && (
                <circle cx="-5" cy="2" r="6" stroke="#fff" strokeWidth="2" />
              )}
            </g>
          ))}
        </Journey>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText frame={flow.frame} mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '氧：空气→肺部交换→血液经左心→细胞。二氧化碳：细胞→血液经右心→肺部交换→呼出。完整血流为身体→右心→肺→左心→身体；图中省略腔室和血管细节。颜色区别气体路线，真实血液不是蓝色。帧数不代表速度或心率。',
          'Oxygen: air → lung exchange → blood via left heart → cells. Carbon dioxide: cells → blood via right heart → lung exchange → exhalation. Connected blood flow is body → right heart → lungs → left heart → body. Chambers and detailed vessels are omitted. Colours distinguish gas routes; blood is not blue. Frames do not indicate speed or heart rate.',
        )}
      />
    </>
  );
}
function SensesLab({ mode, onExplore }: Props) {
  const [look, setLook] = useState(false),
    flow = useFrames(3, onExplore);
  const labels = [
    t('刺激', 'Stimulus'),
    t('感受器', 'Receptor'),
    t('神经信号', 'Nerve signal'),
    t('脑的解释', 'Interpretation'),
  ];
  const frames = [
    look
      ? t(
          '两条线索：听到沙沙声，又看见窗帘在动。这是文字情境，没有播放声音。',
          'Two clues: a rustle is heard and the curtain is seen moving. This is a written scenario; no sound is played.',
        )
      : t(
          '一条线索：听到沙沙声。声音的振动是刺激，但这一条线索尚不能唯一确定声源。这里不播放声音。',
          'One clue: a rustle is heard. Sound vibrations are a stimulus, but this clue cannot uniquely identify the source. No sound is played.',
        ),
    t(
      '感受器：耳内的感受细胞响应振动，参与把它转为神经系统的信号；若再看一眼，眼内感受器也提供光的信息。',
      'Receptors: sensory cells in the ear respond to vibration and help convert it into nervous-system signals. Looking also supplies light information through eye receptors.',
    ),
    t(
      '传递：信息沿神经通路到脑。点和箭头表示信号传播，不是空气颗粒直接穿进脑。真实通路还有许多细胞和中继。',
      'Transmission: information travels along nerve pathways towards the brain. Dots and arrows represent signal propagation, not air entering the brain. Real routes include many cells and relays.',
    ),
    look
      ? t(
          '解释：窗帘可能是沙沙声的来源。看见它动支持这个解释，却不排除其他声源；可以继续寻找证据。',
          'Interpretation: the curtain may be the rustle’s source. Its movement supports this explanation without excluding other sources. Further evidence can help.',
        )
      : t(
          '解释：猫、纸袋或窗帘，都可能造成沙沙声。不要把“我听见”直接变成“我已经确定”。再加一条视觉线索试试。',
          'Interpretation: a cat, paper bag or curtain could rustle. “I heard” does not mean “I identified the cause”. Try adding a visual clue.',
        ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '窗边的沙沙声：线索还是结论？',
            'The window rustle: clue or conclusion?',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-body-choice">
        {[t('只有声音', 'Sound only'), t('再看一眼', 'Another look')].map(
          (v, i) => (
            <button
              key={v.en}
              aria-pressed={look === Boolean(i)}
              onClick={() => {
                setLook(Boolean(i));
                flow.reset();
                onExplore();
              }}
            >
              <Text mode={mode} text={v} />
            </button>
          ),
        )}
      </div>
      <div className="bio-micro-window">
        <Journey frame={flow.frame} labels={labels} mode={mode} color={gold}>
          {[
            <g key="window">
              <rect
                x="-26"
                y="-27"
                width="52"
                height="48"
                fill="#dbe9e7"
                stroke={blue}
              />
              <path d="M0-27v48m-26-24h52" stroke={blue} />
              <path
                d={
                  look ? 'M-24-27q31 14 4 35l22 13H-26Z' : 'M-24-27h14v48h-14Z'
                }
                fill="#dccca4"
                stroke={gold}
              />
              <path d="m32-5 5 4-5 4m8-13 8 9-8 9" fill="none" stroke={gold} />
            </g>,
            <g key="ear" fill="none" stroke={coral} strokeWidth="3">
              <path d="M-13 13q-25-42 5-42q32 0 20 30q-3 9-12 8q-4 1-4 12q-10 13-19-2M-10-6q-9-13 2-16q17-3 13 11l-8 5" />
            </g>,
            <g key="nerve">
              <path
                d="M-38 0q15-21 29 0t29 0t18 0"
                fill="none"
                stroke={gold}
                strokeWidth="4"
              />
              {[-27, 0, 27].map((x) => (
                <circle
                  key={x}
                  cx={x}
                  cy="0"
                  r="5"
                  fill={flow.frame >= 2 ? gold : '#d6d6bb'}
                />
              ))}
            </g>,
            <g key="brain">
              <path
                d="M-29 0q-13-22 7-26q10-12 24-5q21-9 26 13q14 17-4 31q-15 13-26 4q-20 11-27-6Z"
                fill="#d7c4d8"
                stroke="#9f84a3"
              />
              <path
                d="M0-25v37m-15-21 9 4m22-17-8 13"
                stroke="#9f84a3"
                fill="none"
              />
              <text x="41" y="11" fill={gold} fontSize="30">
                ?
              </text>
            </g>,
          ]}
        </Journey>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText frame={flow.frame} mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '刺激→感受器的信号转换→神经传递→脑参与解释。声音用文字提示，视觉线索为教学情境。窗帘运动支持一种可能解释，却不能证明唯一原因。路线不测感知能力，也省略真实神经中继与时间。',
          'Stimulus → receptor signal conversion → nerve transmission → brain interpretation. The sound is a written cue and the visual clue is a teaching scenario. Curtain movement supports a possible explanation without proving a unique cause. The route omits neural relays and timing and does not measure perception.',
        )}
      />
    </>
  );
}
