import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { useFrames, Playback } from './LabPlayback';
import {
  photosynthesisConditions,
  respirationProfile,
  carbonTracers,
  foodEnergyBudget,
  type LightCue,
  type EnergyCell,
  type CellEnvironment,
  type TransferPercent,
} from './energyModel';
const green = '#708a58',
  blue = '#608b9b',
  gold = '#b59a52',
  purple = '#9e85a9';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
type Lens = 'energy' | 'carbon';
const lenses = [
  ['energy', t('追踪能量', 'Follow energy')],
  ['carbon', t('追踪碳物质', 'Follow carbon matter')],
] as const;
function Choices<T extends string | number>({
  values,
  value,
  choose,
  mode,
  label,
}: {
  values: readonly (readonly [T, LocalizedText])[];
  value: T;
  choose: (v: T) => void;
  mode: LanguageMode;
  label: LocalizedText;
}) {
  return (
    <div
      className="bio-choice-row bio-energy-choices"
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
function Scene({
  mode,
  title,
  children,
  height = 330,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  children: ReactNode;
  height?: number;
}) {
  return (
    <svg
      viewBox={`0 0 420 ${height}`}
      role="img"
      aria-label={word(mode, title)}
    >
      <rect
        x="10"
        y="12"
        width="400"
        height={height - 24}
        rx="24"
        fill="#f0f2e7"
      />
      {children}
    </svg>
  );
}
function Arrow({
  from,
  to,
  energy = false,
  active = true,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  energy?: boolean;
  active?: boolean;
}) {
  const [x1, y1] = from,
    [x2, y2] = to,
    dx = x2 - x1,
    dy = y2 - y1,
    length = Math.hypot(dx, dy),
    points = Array.from({ length: 25 }, (_, i) => {
      const n = i / 24,
        w = energy ? Math.sin(n * Math.PI * 6) * 3 : 0;
      return `${x1 + n * dx - (w * dy) / length},${y1 + n * dy + (w * dx) / length}`;
    }).join(' '),
    color = active ? (energy ? gold : blue) : '#c6ceb9';
  return (
    <g
      fill="none"
      stroke={color}
      strokeWidth={active ? 2.5 : 1.5}
      strokeLinejoin="round"
    >
      <polyline points={points} strokeDasharray={active ? undefined : '4 4'} />
      <path
        d="M-9-5 0 0-9 5"
        transform={`translate(${x2} ${y2}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})`}
      />
    </g>
  );
}
function Icon({
  kind,
  x,
  y,
  scale = 1,
}: {
  kind: string;
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      strokeWidth="2"
      strokeLinejoin="round"
    >
      {kind === 'sun' ? (
        <g stroke={gold} fill="#e8d7af">
          <circle r="19" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M0-27v-9" transform={`rotate(${i * 45})`} />
          ))}
        </g>
      ) : kind === 'leaf' ? (
        <g stroke={green}>
          <path d="M-31 25Q-43-24 33-28Q42 21-31 25Z" fill="#b5c99a" />
          <path d="M-37 32 26-21M-12 9l-3-20m4 20 23 1" fill="none" />
        </g>
      ) : kind === 'toast' ? (
        <g stroke={gold} fill="#ead6b2">
          <path d="M-24 24v-27q-15-32 24-32t24 32v27Z" />
          <path d="M-15 15V-4q-9-20 15-20t15 20v19Z" fill="#f3e5c8" />
        </g>
      ) : kind === 'cell' ? (
        <g stroke={blue}>
          <ellipse rx="33" ry="27" fill="#d8e6e5" />
          <circle cx="-10" cy="3" r="10" fill="#c5b4ce" stroke={purple} />
          <ellipse
            cx="16"
            cy="-6"
            rx="10"
            ry="6"
            fill="#d9bb90"
            stroke={gold}
          />
        </g>
      ) : kind === 'caterpillar' ? (
        <g stroke={green} fill="#b5c99a">
          {[-22, -8, 6, 20].map((v, i) => (
            <circle key={v} cx={v} cy={i % 2 ? 0 : 4} r="11" />
          ))}
          <circle cx="23" cy="-3" r="2" fill={green} />
          <path d="M-22 16v5m15-7v7m15-7v7m15-9v9" />
        </g>
      ) : kind === 'bird' ? (
        <g stroke={blue} fill="#b6cbd0">
          <ellipse rx="25" ry="17" />
          <circle cx="19" cy="-14" r="12" />
          <path d="m29-17 15 5-15 3m-49 10-26-13 8 19m29 11v15m12-15v15" />
          <path d="M-16-5q-4 24 21 15" fill="none" />
        </g>
      ) : kind === 'work' ? (
        <g stroke={purple} fill="none">
          <circle cx="-1" cy="-25" r="8" fill="#c5b4ce" />
          <path
            d="m-1-16 5 25m-5-17-16 14m16-14 21 6M4 9-14 28M4 9l21 19"
            strokeWidth="4"
          />
        </g>
      ) : kind === 'root' ? (
        <g stroke={gold} fill="none">
          <path
            d="M0-30v37m0-5-25 22m25-22 24 22m-24-8v24m-12-28-14 1m38-1 13 2"
            strokeWidth="3"
          />
        </g>
      ) : kind === 'detritus' ? (
        <g stroke={gold}>
          <path d="M-31 17q18-18 38-8q24-16 28 12h-66Z" fill="#dbc8a3" />
          <path d="M-16 3q-8-22 20-25q7 21-20 25Z" fill="#c5b99a" />
          <circle cx="15" cy="11" r="7" fill="#b7b09d" />
        </g>
      ) : (
        <g stroke={gold} fill="none">
          {[-14, 0, 14].map((v) => (
            <path key={v} d={`M${v} 24q-12-12 0-24t0-24`} />
          ))}
        </g>
      )}
    </g>
  );
}
function SvgLabel({
  mode,
  text,
  x,
  y,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  x: number;
  y: number;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={green} fontSize="13">
      {word(mode, text)}
    </text>
  );
}
function CarbonDot({ x, y, id }: { x: number; y: number; id: number }) {
  return (
    <g data-carbon-id={id}>
      <circle cx={x} cy={y} r="7" fill={blue} />
      <text x={x} y={y + 3.5} fontSize="9" textAnchor="middle" fill="#fff">
        {id + 1}
      </text>
    </g>
  );
}
const relaySources = [
  ['toast', t('吐司与人体', 'Toast & body')],
  ['leaf', t('叶片与植物', 'Leaf & plant')],
] as const;
const relayEnergyFrames = [
  t(
    '光提供能量，不提供糖的碳原子。',
    'Light supplies energy, not sugar carbon atoms.',
  ),
  t(
    '植物利用光制得有机物；吐司淀粉也来自植物。',
    'Plants make organic matter using light; toast starch also comes from plants.',
  ),
  t(
    '已有有机物支持细胞反应与ATP再生成；食物先经消化、吸收与运输。',
    'Organic compounds support reactions and ATP regeneration; food first undergoes digestion, absorption and transport.',
  ),
  t(
    'ATP反应与维持、制造或运动等细胞工作耦联；植物也需要。',
    'ATP reactions couple to maintenance, assembly or movement; plants need these too.',
  ),
  t(
    '部分能量最终散为热；没有凭空消失，也不会沿同一食物路线变回阳光。',
    'Some energy ultimately dissipates as heat; it neither vanishes nor returns as sunlight along this food route.',
  ),
];
const relayCarbonFrames = [
  t(
    '碳起点：空气中的CO₂，而不是光。',
    'Carbon starts in atmospheric CO₂, not light.',
  ),
  t(
    '光合作用把碳组装进植物有机物。',
    'Photosynthesis incorporates carbon into plant organic compounds.',
  ),
  t(
    '部分有机物可到其他细胞或动物；碳也能保留为身体材料。',
    'Some organic compounds reach other cells or animals; carbon can also remain in body materials.',
  ),
  t(
    '这里追踪被呼吸的一部分碳：它可进入CO₂。不是每个碳立即返回。',
    'We follow a respired fraction of carbon into CO₂; not every atom returns immediately.',
  ),
  t(
    'CO₂中的碳可再利用；新制糖仍需新的供能。',
    'Carbon in CO₂ can be reused; new sugar-making still needs new energy input.',
  ),
];
function RelayCanvas({
  mode,
  source = 'toast',
  lens = 'energy',
  frame = 0,
}: {
  mode: LanguageMode;
  source?: 'toast' | 'leaf';
  lens?: Lens;
  frame?: number;
}) {
  const e = lens === 'energy',
    positions = [
      [58, 100],
      [161, 146],
      [272, 177],
      [358, 250],
    ] as const;
  return (
    <Scene
      mode={mode}
      title={t(
        '光、食物、细胞工作与碳的两种路线',
        'Two routes through light, food and cellular work',
      )}
    >
      {e ? (
        <>
          <Icon kind="sun" x={58} y={100} scale={0.8} />
          <Arrow from={[86, 113]} to={[133, 136]} energy active={frame >= 1} />
        </>
      ) : (
        <>
          <rect x="18" y="56" width="78" height="35" rx="12" fill="#d8e6e5" />
          <text x="57" y="79" textAnchor="middle" fill={blue} fontSize="14">
            CO₂
          </text>
          <Arrow from={[83, 87]} to={[135, 127]} active={frame >= 1} />
        </>
      )}
      <Icon kind={source === 'toast' ? 'toast' : 'leaf'} x={161} y={146} />
      <Icon kind="cell" x={272} y={177} />
      {e && <Icon kind="work" x={358} y={250} scale={0.85} />}
      <Arrow from={[193, 151]} to={[234, 165]} energy={e} active={frame >= 2} />
      <Arrow from={[299, 192]} to={[337, 224]} energy={e} active={frame >= 3} />
      {e ? (
        <>
          <Icon kind="heat" x={199} y={264} scale={0.75} />
          <Arrow from={[257, 202]} to={[218, 241]} energy active={frame >= 4} />
          <SvgLabel mode={mode} text={t('散为热', 'Heat')} x={199} y={308} />
        </>
      ) : (
        <>
          <text x="358" y="253" textAnchor="middle" fill={blue} fontSize="14">
            CO₂
          </text>
          {frame >= 4 && (
            <path
              d="M365 221Q418 37 83 68"
              stroke={blue}
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />
          )}
          <SvgLabel
            mode={mode}
            text={t('一部分返回空气', 'A fraction returns to air')}
            x={300}
            y={307}
          />
        </>
      )}
      {positions.slice(0, 3).map(([x, y], i) => (
        <SvgLabel
          key={i}
          mode={mode}
          text={
            i === 0
              ? e
                ? t('光能', 'Light energy')
                : t('空气中的碳', 'Carbon in air')
              : i === 1
                ? source === 'toast'
                  ? t('植物→吐司', 'Plant → toast')
                  : t('叶片有机物', 'Leaf organic matter')
                : e
                  ? t('细胞 · ATP', 'Cell · ATP')
                  : t('细胞中的碳', 'Carbon in cells')
          }
          x={x}
          y={y + 48}
        />
      ))}
      <SvgLabel
        mode={mode}
        text={
          e
            ? t('细胞工作', 'Cellular work')
            : t('呼吸产物', 'Respiration product')
        }
        x={358}
        y={293}
      />
      {!e && (
        <circle
          cx={
            (
              [
                [58, 74],
                [161, 112],
                [272, 143],
                [358, 229],
                [58, 74],
              ] as const
            )[frame]![0]
          }
          cy={
            (
              [
                [58, 74],
                [161, 112],
                [272, 143],
                [358, 229],
                [58, 74],
              ] as const
            )[frame]![1]
          }
          r="6"
          fill={blue}
        />
      )}
    </Scene>
  );
}
function EnergyRelay({ id, mode, onExplore }: Props) {
  const [source, setSource] = useState<'toast' | 'leaf'>('toast'),
    [lens, setLens] = useState<Lens>('energy'),
    flow = useFrames(4, onExplore);
  return (
    <div className="bio-energy-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '早餐里藏着怎样的接力？',
            'What relay is hidden in breakfast?',
          )}
        />
      </h3>
      <Choices
        values={relaySources}
        value={source}
        mode={mode}
        label={t('生活路线', 'Everyday route')}
        choose={(v) => {
          setSource(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        values={lenses}
        value={lens}
        mode={mode}
        label={t('追踪视角', 'Tracing view')}
        choose={(v) => {
          setLens(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-energy-window">
        <RelayCanvas
          mode={mode}
          source={source}
          lens={lens}
          frame={flow.frame}
        />
      </div>
      <p className="bio-energy-key">
        <Text
          mode={mode}
          text={
            lens === 'energy'
              ? t(
                  '金色波线 = 能量转移，不是原子',
                  'Gold waves = energy transfer, not atoms',
                )
              : t(
                  '蓝色 = 含碳物质；图示一种可能路线',
                  'Blue = carbon matter; one possible route',
                )
          }
        />
      </p>
      <p className="bio-frame-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            (lens === 'energy' ? relayEnergyFrames : relayCarbonFrames)[
              flow.frame
            ]!
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '能量：光→植物有机物→细胞反应/ATP→工作→部分散热。物质：CO₂碳→植物有机物→细胞或动物→一部分经呼吸回CO₂。吐司先消化、吸收并运输；植物自身细胞也呼吸。部分碳留在身体或其他库中，不是每粒都马上回空气。图无原子真实颜色、ATP产量、餐食热量或个人体能计算；ATP不是能量本身，导览不是严格反应时序。',
          'Energy: light → plant organic matter → reactions/ATP → work → some heat. Matter: CO₂ carbon → plant organic matter → cells or animals → a respired fraction returns to CO₂. Toast undergoes digestion, absorption and transport; plants also respire. Carbon can remain in bodies or other pools. No real atom colours, ATP yield, calories or personal performance; ATP is not energy itself and the tour is not strict reaction timing.',
        )}
      />
    </div>
  );
}
const lightNames = [
  t('无光', 'No light'),
  t('较弱的光', 'Dimmer light'),
  t('较亮的光', 'Brighter light'),
];
function PhotosynthesisCanvas({
  mode,
  frame = 0,
  light = 1,
  water = true,
  carbon = true,
}: {
  mode: LanguageMode;
  frame?: number;
  light?: LightCue;
  water?: boolean;
  carbon?: boolean;
}) {
  const state = photosynthesisConditions(light, water, carbon),
    points = carbonTracers(frame, state.canMakeSugar, carbon),
    output = state.canMakeSugar && frame >= 3;
  return (
    <Scene
      mode={mode}
      title={t(
        'CO₂中的碳进入糖，光提供能量',
        'Carbon from CO₂ enters sugar; light supplies energy',
      )}
    >
      <SvgLabel
        mode={mode}
        text={t('CO₂ · 供碳', 'CO₂ · carbon supply')}
        x={72}
        y={47}
      />
      <SvgLabel mode={mode} text={t('叶绿体', 'Chloroplast')} x={210} y={48} />
      <SvgLabel
        mode={mode}
        text={t('糖中的碳', 'Carbon in sugar')}
        x={344}
        y={48}
      />
      <ellipse
        cx="210"
        cy="141"
        rx="58"
        ry="74"
        fill="#dbe5c8"
        stroke={green}
        strokeWidth="3"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M181 ${102 + i * 32}h58m-58 7h58m-58 7h58`}
          stroke="#9eb77b"
          strokeWidth="5"
        />
      ))}
      <Arrow from={[103, 136]} to={[148, 136]} active={carbon && frame >= 1} />
      <Arrow from={[271, 136]} to={[310, 136]} active={output} />
      {light > 0 && (
        <>
          <Icon kind="sun" x={210} y={267} scale={0.65} />
          <Arrow from={[210, 235]} to={[210, 217]} energy active={frame >= 1} />
        </>
      )}
      {points.map((p) => {
        const pos =
          p.pool === 'input'
            ? [52 + (p.id % 2) * 31, 101 + Math.floor(p.id / 2) * 37]
            : p.pool === 'processing'
              ? [190 + (p.id % 3) * 20, 126 + Math.floor(p.id / 3) * 27]
              : [
                  344 + Math.cos((p.id * Math.PI) / 3) * 26,
                  136 + Math.sin((p.id * Math.PI) / 3) * 26,
                ];
        return <CarbonDot key={p.id} id={p.id} x={pos[0]!} y={pos[1]!} />;
      })}
      {output && (
        <rect
          x="310"
          y="102"
          width="69"
          height="69"
          rx="18"
          stroke={blue}
          fill="none"
          strokeWidth="2"
        />
      )}
      <SvgLabel
        mode={mode}
        text={
          carbon
            ? t('6个示踪碳', '6 carbon tracers')
            : t('无可用CO₂', 'No usable CO₂')
        }
        x={72}
        y={216}
      />
      <SvgLabel
        mode={mode}
        text={
          output
            ? t('同样的6个碳', 'Same 6 carbon atoms')
            : t('尚未形成', 'Not formed here')
        }
        x={344}
        y={216}
      />
      <text x="72" y="274" textAnchor="middle" fill={blue} fontSize="13">
        {word(
          mode,
          water
            ? t('可用水', 'Usable water')
            : t('缺可用水', 'No usable water'),
        )}
      </text>
      {water && (
        <path d="M72 230q-24 27 0 28q24-1 0-28Z" fill="#b7d2d7" stroke={blue} />
      )}
      <text x="344" y="273" textAnchor="middle" fill={blue} fontSize="13">
        {output ? 'O₂' : '—'}
      </text>
      <SvgLabel
        mode={mode}
        text={t(
          '只追踪碳；水/氧图标不计数量',
          'Carbon only; water/O₂ icons are not counts',
        )}
        x={210}
        y={314}
      />
    </Scene>
  );
}
const photoFrames = [
  t(
    '找原料：CO₂中的碳、水，以及光提供的能量。',
    'Find inputs: carbon in CO₂, water, and light energy.',
  ),
  t(
    '叶绿体中的供能过程与碳组装配合；模型固定温度和酶适宜。',
    'Energy-supplying processes cooperate with carbon assembly; suitable temperature and enzymes are fixed.',
  ),
  t(
    '追踪同一组碳，化学组合改变；光不是新原子。',
    'Follow the same carbon tracers through changed chemical arrangement; light is not new atoms.',
  ),
  t(
    '总体结果可代表为糖与氧；实际过程多步，不是一瞬间直接造葡萄糖。',
    'Overall products are represented as sugar and oxygen; real production involves many steps.',
  ),
];
function PhotosynthesisLab({ id, mode, onExplore }: Props) {
  const [light, setLight] = useState<LightCue>(1),
    [water, setWater] = useState(true),
    [carbon, setCarbon] = useState(true),
    flow = useFrames(3, onExplore),
    state = photosynthesisConditions(light, water, carbon);
  const missing = [
    light === 0 && t('光', 'light'),
    !water && t('可用水', 'usable water'),
    !carbon && t('可用CO₂', 'usable CO₂'),
  ].filter(Boolean) as LocalizedText[];
  return (
    <div className="bio-energy-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '光和原料，谁提供什么？',
            'Light and materials: who supplies what?',
          )}
        />
      </h3>
      <label className="bio-energy-light">
        <span>
          <Text mode={mode} text={t('光照线索', 'Light cue')} />
        </span>
        <input
          type="range"
          min="0"
          max="2"
          step="1"
          value={light}
          aria-valuetext={word(mode, lightNames[light]!)}
          onChange={(e) => {
            setLight(Number(e.target.value) as LightCue);
            flow.reset();
            onExplore();
          }}
        />
        <output>
          <Text mode={mode} text={lightNames[light]!} />
        </output>
      </label>
      <div className="bio-choice-row bio-energy-choices">
        <button
          aria-pressed={water}
          onClick={() => {
            setWater(!water);
            flow.reset();
            onExplore();
          }}
        >
          <Text
            mode={mode}
            text={
              water
                ? t('可用水：有', 'Usable water: present')
                : t('可用水：无', 'Usable water: absent')
            }
          />
        </button>
        <button
          aria-pressed={carbon}
          onClick={() => {
            setCarbon(!carbon);
            flow.reset();
            onExplore();
          }}
        >
          <Text
            mode={mode}
            text={
              carbon
                ? t('可用CO₂：有', 'Usable CO₂: present')
                : t('可用CO₂：无', 'Usable CO₂: absent')
            }
          />
        </button>
      </div>
      <div className="bio-energy-window">
        <PhotosynthesisCanvas
          mode={mode}
          frame={flow.frame}
          light={light}
          water={water}
          carbon={carbon}
        />
      </div>
      <p className="bio-energy-key" aria-live="polite">
        <Text
          mode={mode}
          text={
            state.canMakeSugar
              ? t(
                  '这条制糖路线具备条件；速率未计算',
                  'Prerequisites available for this route; rate not calculated',
                )
              : t(
                  `本路线缺：${missing.map((v) => v.zh).join('、')}；不能按此计算真实叶片停工时间`,
                  `This route lacks ${missing.map((v) => v.en).join(', ')}; real stop time is not calculated`,
                )
          }
        />
      </p>
      <p className="bio-frame-caption">
        <Text
          mode={mode}
          text={
            state.canMakeSugar
              ? photoFrames[flow.frame]!
              : t(
                  '供能或可用原料不足，这条示范路线没有产物；已有储备与真实调节不在模型中。',
                  'With missing energy supply or usable materials, this depicted route has no product; reserves and real regulation are omitted.',
                )
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '光供能，CO₂供碳，水参与反应；六个蓝点只追踪碳，糖点组不是结构式。缺可用CO₂时无供给碳点，缺水或光时碳留在原料侧。固定叶肉有叶绿体、适宜温度/酶与其他条件，缺条件时没有可用储备支撑这条示范制糖路线。无光/较弱/较亮不计算真实速率或产量，也不算制糖减去呼吸后的净量。不是照料建议，去掉水不等于一天没浇水。',
          'Light supplies energy, CO₂ carbon, and water participates. Six blue dots trace carbon only, not sugar structural geometry. No usable CO₂ means no supplied carbon tracers; missing water/light retains carbon on the input side. Mesophyll chloroplasts, suitable temperature/enzymes and other conditions are fixed, without reserves sustaining this depicted route when prerequisites are absent. Light settings compute no real rate, yield or photosynthesis-minus-respiration quantity. This is not care advice; missing water is not a day without watering.',
        )}
      />
    </div>
  );
}
const cellChoices = [
  ['leaf', t('绿色叶肉', 'Green mesophyll')],
  ['root', t('典型根细胞', 'Typical root cell')],
  ['muscle', t('典型肌肉细胞', 'Typical muscle cell')],
] as const;
const environments = [
  ['day', t('白天 · 有氧', 'Day · oxygen')],
  ['night', t('夜晚 · 有氧', 'Night · oxygen')],
  ['noOxygen', t('夜晚 · 缺氧', 'Night · no oxygen')],
] as const;
function RespirationCanvas({
  mode,
  cell = 'leaf',
  environment = 'night',
  frame = 0,
}: {
  mode: LanguageMode;
  cell?: EnergyCell;
  environment?: CellEnvironment;
  frame?: number;
}) {
  const state = respirationProfile(cell, environment),
    points = carbonTracers(frame, state.aerobic),
    done = state.aerobic && frame >= 3;
  return (
    <Scene
      mode={mode}
      title={t(
        '糖的碳到CO₂，能量转移到ATP支持与热',
        'Sugar carbon to CO₂; energy to ATP support and heat',
      )}
    >
      <SvgLabel
        mode={mode}
        text={t('已有糖', 'Available sugar')}
        x={68}
        y={45}
      />
      <SvgLabel
        mode={mode}
        text={t('细胞内反应', 'Cellular reactions')}
        x={210}
        y={45}
      />
      <SvgLabel
        mode={mode}
        text={t('CO₂中的碳', 'Carbon in CO₂')}
        x={346}
        y={45}
      />
      <rect
        x="138"
        y="65"
        width="143"
        height="157"
        rx={cell === 'muscle' ? 48 : 20}
        fill="#dae6e5"
        stroke={blue}
        strokeWidth="3"
      />
      <ellipse
        cx="210"
        cy="159"
        rx="47"
        ry="28"
        fill="#e3cdaa"
        stroke={gold}
        strokeWidth="2"
      />
      <path
        d="M182 157q12-24 19 0t18 0t20 0"
        fill="none"
        stroke={gold}
        strokeWidth="2"
      />
      {cell === 'leaf' && (
        <ellipse
          cx="169"
          cy="89"
          rx="15"
          ry="9"
          fill="#b5c99a"
          stroke={green}
        />
      )}
      <Arrow
        from={[104, 128]}
        to={[135, 128]}
        active={frame >= 1 && state.aerobic}
      />
      <Arrow from={[285, 129]} to={[312, 129]} active={done} />
      {points.map((p) => {
        const pos =
          p.pool === 'input'
            ? [
                68 + Math.cos((p.id * Math.PI) / 3) * 25,
                130 + Math.sin((p.id * Math.PI) / 3) * 25,
              ]
            : p.pool === 'processing'
              ? [
                  189 + (p.id % 3) * 21,
                  (frame === 1 ? 109 : 148) + Math.floor(p.id / 3) * 20,
                ]
              : [333 + (p.id % 2) * 26, 96 + Math.floor(p.id / 2) * 32];
        return <CarbonDot key={p.id} id={p.id} x={pos[0]!} y={pos[1]!} />;
      })}
      <SvgLabel
        mode={mode}
        text={t('细胞质 + 线粒体', 'Cytoplasm + mitochondria')}
        x={210}
        y={241}
      />
      <text x="65" y="249" fill={blue} textAnchor="middle" fontSize="13">
        {state.aerobic ? 'O₂' : word(mode, t('缺氧', 'No oxygen'))}
      </text>
      <rect
        x="267"
        y="258"
        width="54"
        height="30"
        rx="8"
        fill={done ? '#e8d7af' : '#e8eadf'}
        stroke={gold}
      />
      <text x="294" y="278" textAnchor="middle" fill={green} fontSize="13">
        ATP
      </text>
      <Icon kind="heat" x={365} y={274} scale={0.6} />
      <Arrow from={[242, 215]} to={[281, 253]} energy active={done} />
      <Arrow from={[264, 212]} to={[354, 258]} energy active={done} />
      <SvgLabel
        mode={mode}
        text={t('工作支持 / 热', 'Work support / heat')}
        x={320}
        y={315}
      />
    </Scene>
  );
}
const respirationFrames = [
  t(
    '已有糖是起点；呼吸不是只有吸气，植物也需要用能量。',
    'Existing sugar is the start; respiration is not just inhaling and plants need energy too.',
  ),
  t(
    '一些糖分解开始步骤在细胞质；此处只示意碳的路线。',
    'Some initial sugar-breakdown steps occur in cytoplasm; only carbon is traced here.',
  ),
  t(
    '后续许多有氧步骤在这类真核细胞的线粒体；光不作为呼吸开关。',
    'Many later aerobic steps occur in these eukaryotic mitochondria; light is not a respiration switch.',
  ),
  t(
    '碳可进入CO₂；能量转移支持ATP再生成与工作，并散为热。',
    'Carbon can enter CO₂; energy transfer supports ATP regeneration and work, ultimately dissipating as heat.',
  ),
];
function Status({
  mode,
  label,
  yes,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  yes: boolean;
}) {
  return (
    <article className={yes ? 'active' : ''}>
      <strong>
        <Text mode={mode} text={label} />
      </strong>
      <p>
        <Text
          mode={mode}
          text={
            yes
              ? t('本模型条件下可发生', 'Possible under model conditions')
              : t('此路线条件不具备', 'Prerequisites absent for this route')
          }
        />
      </p>
    </article>
  );
}
function RespirationLab({ id, mode, onExplore }: Props) {
  const [cell, setCell] = useState<EnergyCell>('leaf'),
    [environment, setEnvironment] = useState<CellEnvironment>('night'),
    flow = useFrames(3, onExplore),
    state = respirationProfile(cell, environment);
  return (
    <div className="bio-energy-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t('植物夜晚，也能用糖吗？', 'Can plants use sugar at night?')}
        />
      </h3>
      <Choices
        values={cellChoices}
        value={cell}
        mode={mode}
        label={t('细胞类型', 'Cell profile')}
        choose={(v) => {
          setCell(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        values={environments}
        value={environment}
        mode={mode}
        label={t('昼夜与氧', 'Day/night and oxygen')}
        choose={(v) => {
          setEnvironment(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-energy-status">
        <Status
          mode={mode}
          label={t('光合作用', 'Photosynthesis')}
          yes={state.photosynthesis}
        />
        <Status
          mode={mode}
          label={t('有氧细胞呼吸', 'Aerobic cellular respiration')}
          yes={state.aerobic}
        />
      </div>
      <div className="bio-energy-window">
        <RespirationCanvas
          mode={mode}
          cell={cell}
          environment={environment}
          frame={flow.frame}
        />
      </div>
      <p className="bio-frame-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            state.aerobic
              ? respirationFrames[flow.frame]!
              : t(
                  '本课有氧路线缺氧；不代表ATP立刻归零。储备与其他供ATP途径不在模型计算中。',
                  'Oxygen is absent for the depicted aerobic route; ATP is not thereby instantly zero. Reserves and alternative ATP pathways are not calculated.',
                )
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '已知条件：三类代表细胞活着、有可用糖且其他条件适宜。叶肉白天可同时光合作用与呼吸；根/肌肉不按本课叶肉方式光合作用。夜晚有氧仍可呼吸；缺氧只关闭示范有氧路线，不预测所有ATP、速率或死亡时间。六个碳点保留，不把碳变成热。初始步骤在细胞质，许多后续有氧步骤在线粒体；ATP卡是作用线索，不是产量计数。',
          'All three viable profiles have usable sugar and suitable other conditions. Mesophyll can photosynthesise and respire by day; root/muscle do not follow that photosynthetic profile. Oxygenated night permits respiration. Missing oxygen disables only the illustrated aerobic route, not all ATP, rates or survival. Six carbon tracers remain carbon, not heat. Initial steps are cytoplasmic, many later aerobic steps mitochondrial; the ATP card indicates a role, not yield.',
        )}
      />
    </div>
  );
}
const levelNames = {
  plant: t('植物', 'Plants'),
  herbivore: t('毛虫', 'Caterpillars'),
  predator: t('鸟', 'Birds'),
};
function FoodCanvas({
  mode,
  lens = 'energy',
  frame = 0,
}: {
  mode: LanguageMode;
  lens?: Lens;
  frame?: number;
}) {
  const e = lens === 'energy';
  return (
    <Scene
      mode={mode}
      title={t(
        '食物能量流与碳循环比较',
        'Food energy flow versus carbon cycling',
      )}
      height={370}
    >
      {e ? (
        <>
          <Icon kind="sun" x={67} y={54} scale={0.65} />
          <Arrow from={[67, 80]} to={[72, 111]} energy />
          <SvgLabel
            mode={mode}
            text={t('新光能输入', 'New light input')}
            x={170}
            y={43}
          />
        </>
      ) : (
        <>
          <rect x="159" y="27" width="102" height="32" rx="12" fill="#d8e6e5" />
          <text x="210" y="48" textAnchor="middle" fill={blue} fontSize="14">
            CO₂
          </text>
          <Arrow from={[165, 59]} to={[93, 117]} />
        </>
      )}
      {(['leaf', 'caterpillar', 'bird'] as const).map((kind, i) => (
        <g key={kind}>
          <Icon kind={kind} x={75 + i * 135} y={148} />
          <SvgLabel
            mode={mode}
            text={Object.values(levelNames)[i]!}
            x={75 + i * 135}
            y={201}
          />
        </g>
      ))}
      <Arrow from={[112, 147]} to={[170, 147]} energy={e} active={frame >= 1} />
      <Arrow from={[246, 147]} to={[306, 147]} energy={e} active={frame >= 2} />
      <Icon kind="detritus" x={210} y={285} />
      <SvgLabel
        mode={mode}
        text={t('枯落物 / 分解者', 'Detritus / decomposers')}
        x={210}
        y={331}
      />
      {[75, 210, 345].map((x) => (
        <Arrow
          key={x}
          from={[x, 211]}
          to={[210 + (x - 210) * 0.12, 256]}
          energy={e}
          active={frame >= 3}
        />
      ))}
      {e ? (
        <>
          <Icon kind="heat" x={351} y={287} scale={0.65} />
          <Arrow from={[311, 214]} to={[343, 259]} energy active={frame >= 4} />
          <SvgLabel
            mode={mode}
            text={t('各层都散热', 'Heat at every level')}
            x={335}
            y={345}
          />
        </>
      ) : (
        <>
          {frame >= 4 && (
            <g stroke={blue} fill="none" strokeWidth="2">
              <path d="M231 268Q412 265 386 98Q377 43 262 43M69 119Q20 39 157 43" />
              <path d="m272 38-10 5 10 5m-125-10 10 5-10 5" />
            </g>
          )}
          <SvgLabel
            mode={mode}
            text={t('呼吸可回CO₂', 'Respiration → CO₂')}
            x={319}
            y={80}
          />
        </>
      )}
      <SvgLabel
        mode={mode}
        text={
          e
            ? t(
                '枯落物仍有化学能；热不回到阳光',
                'Detritus retains energy; heat does not return to sunlight',
              )
            : t(
                '碳可再利用，新制糖还需供能',
                'Carbon can be reused; new sugar still needs energy',
              )
        }
        x={210}
        y={362}
      />
    </Scene>
  );
}
const foodEnergyFrames = [
  t(
    '起点1000E是植物有机物化学能，不是全部照射太阳能。',
    'Initial 1000E is plant organic chemical energy, not all incident sunlight.',
  ),
  t(
    '一部分能量通过取食到毛虫；假设比例不等于实测效率。',
    'Some energy reaches caterpillars through feeding; assumed fractions are not measured efficiencies.',
  ),
  t(
    '再一部分到鸟；同一尺度的柱表示能量，不表示生物数量。',
    'A further fraction reaches birds; common-scale bars show energy, not organism counts.',
  ),
  t(
    '多个层的有机物进入枯落物，仍可供分解者利用。未转移不等于全是热。',
    'Organic matter from multiple levels enters detritus for decomposers; not all non-transfer is heat.',
  ),
  t(
    '每层都会呼吸并散热；账本保留枯落物化学能，不计算分解时间。',
    'Every level respires and dissipates heat; the account retains detrital chemical energy without calculating decay time.',
  ),
];
const foodCarbonFrames = [
  t(
    'CO₂中的碳进入植物有机物；这里需要新的光供能。',
    'CO₂ carbon enters plant organic matter with new light energy.',
  ),
  t(
    '取食把一部分含碳物质送到毛虫。',
    'Feeding transfers some carbon-containing matter to caterpillars.',
  ),
  t(
    '再通过取食到鸟；部分碳可保留为身体材料。',
    'Further feeding carries carbon to birds, with some retained in body materials.',
  ),
  t(
    '死亡与废物把含碳物质送到分解者。',
    'Death and waste deliver carbon-containing matter to decomposers.',
  ),
  t(
    '植物、动物和分解者的呼吸可让碳回CO₂。热没有沿这条圈返回。',
    'Plant, animal and decomposer respiration can return carbon to CO₂; heat does not return along this loop.',
  ),
];
function FoodEnergyLab({ id, mode, onExplore }: Props) {
  const [lens, setLens] = useState<Lens>('energy'),
    [percent, setPercent] = useState<TransferPercent>(10),
    flow = useFrames(4, onExplore),
    rows = foodEnergyBudget(percent);
  return (
    <div className="bio-energy-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '没传下去的部分，去了哪里？',
            'Where does the non-transferred part go?',
          )}
        />
      </h3>
      <Choices
        values={lenses}
        value={lens}
        mode={mode}
        label={t('追踪视角', 'Tracing view')}
        choose={(v) => {
          setLens(v);
          flow.reset();
          onExplore();
        }}
      />
      {lens === 'energy' && (
        <>
          <p className="bio-frame-caption">
            <Text
              mode={mode}
              text={t(
                '假设转移比例；两条取食环节相同，不是自然定律',
                'Assumed transfer fraction: same on both feeding links, not a natural law',
              )}
            />
          </p>
          <Choices
            values={([5, 10, 20] as const).map(
              (v) => [v, t(`${v}%情境`, `${v}% scenario`)] as const,
            )}
            value={percent}
            mode={mode}
            label={t('假设转移比例', 'Assumed transfer fraction')}
            choose={(v) => {
              setPercent(v);
              flow.reset();
              onExplore();
            }}
          />
        </>
      )}
      <div className="bio-energy-window">
        <FoodCanvas mode={mode} lens={lens} frame={flow.frame} />
      </div>
      <p className="bio-energy-key">
        <Text
          mode={mode}
          text={
            lens === 'energy'
              ? t(
                  '波线是能量；每层都有热，也有含化学能的枯落物',
                  'Waves show energy; each level has heat and energy-containing detritus',
                )
              : t(
                  '蓝线是碳物质；循环需要新的供能，不把热变回光',
                  'Blue tracks carbon; cycling needs new energy input, not heat turned back into light',
                )
          }
        />
      </p>
      {lens === 'energy' && (
        <div
          className="bio-energy-bars"
          aria-label={word(
            mode,
            t(
              '共同零起点的假设能量账本',
              'Assumed energy account with a shared zero scale',
            ),
          )}
        >
          {rows.map((row) => (
            <div key={row.level}>
              <strong>
                <Text mode={mode} text={levelNames[row.level]} />
              </strong>
              <div className="bio-energy-bar-track">
                <div style={{ width: `${row.incoming / 10}%` }} />
              </div>
              <span>{row.incoming} E</span>
            </div>
          ))}
          <p>
            <Text
              mode={mode}
              text={t(
                '共同尺度0–1000E · E为虚构单位 · 不是生物数量',
                'Shared scale 0–1000E · E is invented · not organism counts',
              )}
            />
          </p>
        </div>
      )}
      <p className="bio-frame-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            (lens === 'energy' ? foodEnergyFrames : foodCarbonFrames)[
              flow.frame
            ]!
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      {lens === 'energy' && (
        <details className="bio-static">
          <summary>
            <Text
              mode={mode}
              text={t('展开能量去向账本', 'Open energy-fate account')}
            />
          </summary>
          <div className="bio-energy-table">
            <table>
              <caption>
                <Text
                  mode={mode}
                  text={t(
                    '每层输入=下一层+枯落物+热；固定20%入枯落物',
                    'Input = onward + detritus + heat; fixed 20% detritus',
                  )}
                />
              </caption>
              <thead>
                <tr>
                  {[
                    t('层', 'Level'),
                    t('输入', 'Input'),
                    t('下一层', 'Onward'),
                    t('枯落物', 'Detritus'),
                    t('热', 'Heat'),
                  ].map((v) => (
                    <th key={v.en}>
                      <Text mode={mode} text={v} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.level}>
                    <th>
                      <Text mode={mode} text={levelNames[row.level]} />
                    </th>
                    <td>{row.incoming}</td>
                    <td>{row.next}</td>
                    <td>{row.detritus}</td>
                    <td>{row.heat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <Text
              mode={mode}
              text={t(
                '枯落物仍保有化学能；分解者后续利用和散热未计算。末层未设置下一取食者。',
                'Detritus retains chemical energy; later decomposer use and heat are not calculated. No onward feeder is set for the terminal level.',
              )}
            />
          </p>
        </details>
      )}
      <Notes
        mode={mode}
        text={t(
          '教学账本起始植物有机物1000E，不计算太阳输入或捕获率。两条取食环节用同一5/10/20%假设，每层20%进枯落物，余量为呼吸/工作后最终的热；末层无下一取食者。柱同为0–1000尺度，各层输入=传下一层+枯落物+热，总热与保留枯落物合计1000E。真实比例会变化，不能预测种群。碳图只是可能路线，省略储存与许多库；不是每个碳马上回空气。分解者连接多个层，不能把热变回阳光。',
          'The account starts with 1000E plant organic energy without calculating sunlight input or capture. Both feeding links use one assumed 5/10/20% fraction, each level assigns 20% detritus and the remainder to eventual heat after respiration/work; no onward feeder from the terminal level. All bars use 0–1000. Input = onward + detritus + heat; summed heat plus retained detritus equals 1000E. Real fractions vary and populations are not predicted. Carbon shows possible routes, omitting storage and other pools, without every atom instantly returning. Decomposers connect several levels and do not turn heat into sunlight.',
        )}
      />
    </div>
  );
}
export function EnergyExplore(props: Props) {
  return props.id === 'L034' ? (
    <PhotosynthesisLab {...props} />
  ) : props.id === 'L035' ? (
    <RespirationLab {...props} />
  ) : props.id === 'L036' ? (
    <FoodEnergyLab {...props} />
  ) : (
    <EnergyRelay {...props} />
  );
}
export function EnergyHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return id === 'L034' ? (
    <PhotosynthesisCanvas mode={mode} frame={3} />
  ) : id === 'L035' ? (
    <RespirationCanvas mode={mode} frame={3} />
  ) : id === 'L036' ? (
    <FoodCanvas mode={mode} frame={4} />
  ) : (
    <RelayCanvas mode={mode} frame={4} />
  );
}
const diagramClues = {
  L033: [
    t(
      '光供能，CO₂供碳；食物经过消化、吸收和运输再联系细胞。',
      'Light supplies energy, CO₂ carbon; food connects to cells after digestion, absorption and transport.',
    ),
    t(
      'ATP反应与细胞工作耦联；植物和动物都需要供能。',
      'ATP reactions couple to cellular work; plants and animals both need energy supply.',
    ),
    t(
      '不移动也需要能量；碳路线不能当作能量路线。',
      'Still cells need energy; carbon routes are not energy routes.',
    ),
  ],
  L034: [
    t(
      '同样六个碳从CO₂进入糖，不是由光创造。',
      'The same six carbon atoms enter sugar from CO₂, not from light.',
    ),
    t(
      '光、水与CO₂是不同条件；可用性不等于速率。',
      'Light, water and CO₂ are distinct prerequisites; availability is not rate.',
    ),
    t(
      '本图只追踪碳；实际制糖分多步，叶片也可同时呼吸。',
      'Only carbon is traced; real sugar-making is multi-step and leaves can also respire.',
    ),
  ],
  L035: [
    t(
      '植物也可昼夜呼吸；根不需叶绿体来呼吸。',
      'Plants can respire by day and night; roots do not need chloroplasts for respiration.',
    ),
    t(
      '糖的碳可到CO₂，能量支持ATP和工作并散为热。',
      'Sugar carbon can reach CO₂; energy supports ATP/work and dissipates as heat.',
    ),
    t(
      '缺氧只限制这里的有氧路线，不等于所有ATP立即归零。',
      'Missing oxygen limits this aerobic route without making all ATP instantly zero.',
    ),
  ],
  L036: [
    t(
      '箭头食物→取食者；能量不全部传给下一层。',
      'Arrows point food → feeder; not all energy transfers onward.',
    ),
    t(
      '枯落物仍含化学能，分解者也呼吸与散热。',
      'Detritus retains chemical energy and decomposers also respire and release heat.',
    ),
    t(
      '碳可循环，能量转移并散热；新制糖需要新的供能。',
      'Carbon can cycle, while energy transfers and dissipates; new sugar-making needs new energy input.',
    ),
  ],
};
export function EnergyDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    list = diagramClues[id as keyof typeof diagramClues] ?? diagramClues.L033;
  return (
    <figure
      className="bio-diagram bio-energy-diagram"
      data-resource-id={`${id}-D01`}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('物质与能量地图', 'MATTER & ENERGY MAP')} />
      </span>
      <EnergyHookArt id={id} mode={mode} />
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
            '原创示意，非实测或真实反应时间。完整条件与数据在动手模型中。',
            'Original schematic, not measurements or reaction timing. Explore the model for conditions and records.',
          )}
        />
      </small>
    </figure>
  );
}
