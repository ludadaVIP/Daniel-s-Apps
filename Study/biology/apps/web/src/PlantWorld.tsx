import { useId, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import { plantSugar } from './models';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const green = '#78935f',
  blue = '#679bab',
  gold = '#b89b55';
function Plant({ glow = '' }: { glow?: string }) {
  return (
    <g
      stroke={green}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M210 54V238" fill="none" strokeWidth={glow === 'stem' ? 7 : 4} />
      <path
        d="m210 222-35 45m35-39 35 39m-51-24-28 7m58-1 29 5m-44-20-2 40"
        fill="none"
        stroke={glow === 'root' ? gold : green}
      />
      <path
        d="M209 126Q117 128 132 72Q190 75 209 126ZM212 165Q281 164 300 103Q247 101 212 165Z"
        fill={glow === 'leaf' ? '#bddb87' : '#cbdcb0'}
      />
      <path d="m135 78 70 47m11 36 77-52" fill="none" strokeWidth="1.5" />
      <path
        d="M209 57q-23-31-13-38q25 5 16 37q18-27 29-21q1 18-29 22"
        fill="#b4ca96"
      />
    </g>
  );
}
function Flower({ frame = 0 }: { frame?: number }) {
  return frame === 3 ? (
    <g>
      <path
        d="M117 147q79-91 202-26q-44 112-181 91q-22-23-21-65Z"
        fill="#c5d9a2"
        stroke={green}
        strokeWidth="3"
      />
      {[166, 216, 266].map((x) => (
        <circle
          key={x}
          cx={x}
          cy={161 - (x - 166) / 10}
          r="20"
          fill="#8caa66"
          stroke={green}
          strokeWidth="2"
        />
      ))}
    </g>
  ) : (
    <g stroke="#899667" strokeWidth="2.5" fill="none">
      <path d="M211 240v-39" />
      <path
        d="M185 166Q122 93 161 67Q198 65 211 112Q234 56 272 75Q295 110 237 169"
        fill="#e7d8d8"
        stroke="#b89aaf"
      />
      <ellipse cx="211" cy="181" rx="26" ry="30" fill="#d4dfbd" />
      <path d="M211 157v-53m-12 0h24m-43 52v-40m-7 0h14" />
      <circle cx="180" cy="110" r="7" fill={gold} stroke={gold} />
      <circle
        cx={frame === 0 ? 180 : 211}
        cy={frame === 0 ? 91 : 97}
        r="5"
        fill={gold}
        stroke={gold}
      />
      {[165, 183, 199].map((y) => (
        <circle key={y} cx="211" cy={y} r="6" fill="#f7f5e5" />
      ))}
      {frame === 2 && (
        <>
          <path d="M211 105q-17 22 0 45t0 33" stroke={gold} strokeWidth="3" />
          <circle cx="211" cy="183" r="5" fill={gold} />
        </>
      )}
    </g>
  );
}
function Cactus() {
  return (
    <g>
      <path
        d="M181 254V88q0-28 26-28t26 28v79h20v-47q0-17 15-17t15 17v54q0 20-22 20h-28v60Z"
        fill="#acc58b"
        stroke={green}
        strokeWidth="3"
      />
      <path
        d="m190 78-8-6m50 5 10-8m-48 53-13-1m51 8 11-5m-51 40-13 4m52 18 10 4m-49 45-13 4m54-1 12 5m26-119 10-5"
        stroke="#807956"
        strokeWidth="2"
      />
      <path d="M209 88v150" stroke={green} fill="none" opacity=".5" />
    </g>
  );
}
function Lily() {
  return (
    <g stroke={green} strokeWidth="3">
      <path d="M209 153q-5 57-20 100m24-103q27 45 43 80" fill="none" />
      <path
        d="M211 142q-108-74-107-9q7 70 107 9q103 75 103-2q-7-60-103 2Z"
        fill="#b6cf92"
      />
      <path d="m114 134 96 8 89 2" fill="none" strokeWidth="1.5" />
    </g>
  );
}
const clues: Record<string, ReturnType<typeof t>[]> = {
  L009: [
    t(
      '光：提供能量，不是制造糖的物质原料。',
      'Light: supplies energy, not material for building sugar.',
    ),
    t(
      '根：吸收水与矿质营养；土不是现成的糖。',
      'Roots: take up water and minerals; soil is not ready-made sugar.',
    ),
    t(
      '叶片：二氧化碳和水参与制造糖，并释放氧气。',
      'Leaves: carbon dioxide and water help make sugars; oxygen is released.',
    ),
    t(
      '糖：可用于建造、储存，或供细胞呼吸。',
      'Sugars: can support growth, storage or cellular respiration.',
    ),
  ],
  L010: [
    t(
      '根：吸收水与矿质营养，也需要糖供能。',
      'Roots: take up water and minerals, and need sugars for energy.',
    ),
    t(
      '茎：支持、连接，并含运输组织。',
      'Stem: supports, connects and contains transport tissues.',
    ),
    t(
      '叶：常是主要光合器官，糖可送往其他部位。',
      'Leaf: often a major photosynthetic organ; sugars can reach other parts.',
    ),
    t(
      '新芽：即使在叶片上方，也可以得到运来的糖。',
      'Growing bud: can receive transported sugars even above a source leaf.',
    ),
  ],
  L011: [
    t(
      '传粉：花粉到达柱头，不等于种子已经形成。',
      'Pollination: pollen reaches a stigma; a seed has not yet formed.',
    ),
    t(
      '受精：生殖细胞结合；这里简化花粉管路线。',
      'Fertilisation: reproductive cells fuse; the pollen-tube route is simplified.',
    ),
    t(
      '果实：豌豆荚由花的子房发育；不必是甜的。',
      'Fruit: the pea pod develops from the ovary; it need not be sweet.',
    ),
    t(
      '种子：胚珠发育而来；荚内的豌豆是种子。',
      'Seed: develops from an ovule; peas inside the pod are seeds.',
    ),
  ],
  L012: [
    t(
      '刺叶：减少暴露叶面积，也可防御取食。',
      'Spine-like leaves: reduce exposed leaf area and can deter herbivores.',
    ),
    t(
      '绿色厚茎：储水并可光合作用，仍会失水。',
      'Thick green stem: stores water and can photosynthesise, but still loses water.',
    ),
    t(
      '浮叶：宽叶在水面接收光；不是所有宽叶都水生。',
      'Floating leaves: broad leaves intercept light at the surface; not all broad leaves are aquatic.',
    ),
    t(
      '环境：结构的帮助与限制随条件而变。',
      'Habitat: benefits and limitations depend on conditions.',
    ),
  ],
};
export function PlantHookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={word(
        mode,
        '植物探索示意，非按比例',
        'Plant exploration schematic, not to scale',
      )}
    >
      {id === 'L011' ? <Flower /> : id === 'L012' ? <Cactus /> : <Plant />}
      <text x="325" y="80" fontSize="36" fill={gold}>
        ?
      </text>
    </svg>
  );
}
export function PlantDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const [clue, setClue] = useState(0);
  const caption = useId();
  return (
    <figure
      className="bio-diagram bio-plant-diagram"
      aria-labelledby={caption}
      data-resource-id={id + '-D01'}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('看图找线索', 'LOOK FOR CLUES')} />
      </span>
      <svg
        viewBox="0 0 420 300"
        role="img"
        aria-label={word(
          mode,
          '植物结构与功能图解',
          'Plant structures and functions diagram',
        )}
      >
        {id === 'L011' ? (
          <>
            <g transform="translate(-25 -10) scale(.85)">
              <Flower frame={clue < 2 ? clue + 1 : 3} />
            </g>
            {clue < 2 ? (
              <>
                <path d="M163 80h79m-82 65h82" stroke={green} fill="none" />
                <text x="250" y="85" fontSize="14" fill={green}>
                  {word(mode, '柱头', 'Stigma')}
                </text>
                <text x="250" y="150" fontSize="14" fill={green}>
                  {word(mode, '胚珠', 'Ovules')}
                </text>
                <path d="M129 66 93 40H32" stroke={gold} fill="none" />
                <text x="25" y="32" fontSize="14" fill={gold}>
                  {word(mode, '花粉', 'Pollen')}
                </text>
                <text x="46" y="257" fontSize="14" fill={green}>
                  {word(mode, '子房内有胚珠', 'Ovules inside ovary')}
                </text>
              </>
            ) : (
              <>
                <path
                  d="M151 92 235 65h43m-76 53h76"
                  stroke={green}
                  fill="none"
                />
                <text x="287" y="69" fontSize="14" fill={green}>
                  {word(mode, '果荚壁', 'Pod wall')}
                </text>
                <text x="287" y="123" fontSize="14" fill={green}>
                  {word(mode, '种子', 'Seeds')}
                </text>
              </>
            )}
          </>
        ) : id === 'L012' ? (
          <>
            <g transform="translate(-55 5) scale(.8)">
              <Cactus />
            </g>
            <g transform="translate(140 15) scale(.65)">
              <Lily />
            </g>
            <path d="M247 114h132" stroke={blue} strokeWidth="2" />
            <text x="80" y="248" fontSize="13" fill={green}>
              {word(mode, '仙人掌', 'Cactus')}
            </text>
            <text x="270" y="205" fontSize="13" fill={green}>
              {word(mode, '睡莲', 'Water lily')}
            </text>
          </>
        ) : (
          <>
            <Plant
              glow={id === 'L010' ? ['root', 'stem', 'leaf', ''][clue] : ''}
            />
            {id === 'L009' ? (
              <>
                <circle cx="73" cy="59" r="24" fill="#ead6a1" />
                <path d="m96 80 67 34" stroke={gold} strokeWidth="3" />
                <text x="24" y="105" fontSize="14" fill={gold}>
                  {word(mode, '光能', 'Light energy')}
                </text>
                <text x="309" y="70" fontSize="15" fill={blue}>
                  CO₂ →
                </text>
                <text x="295" y="205" fontSize="14" fill={gold}>
                  {word(mode, '糖 + O₂', 'Sugars + O₂')}
                </text>
                <text x="33" y="254" fontSize="14" fill={blue}>
                  {word(mode, '水与矿质', 'Water + minerals')}
                </text>
              </>
            ) : (
              <>
                <text x="110" y="287" fontSize="14" fill={green}>
                  {word(mode, '根', 'Root')}
                </text>
                <text x="240" y="216" fontSize="14" fill={green}>
                  {word(mode, '茎', 'Stem')}
                </text>
                <text x="311" y="130" fontSize="14" fill={green}>
                  {word(mode, '叶', 'Leaf')}
                </text>
                <text x="252" y="42" fontSize="14" fill={green}>
                  {word(mode, '新芽', 'Bud')}
                </text>
              </>
            )}
          </>
        )}
      </svg>
      <div className="bio-hotspots">
        {clues[id]!.map((c, i) => (
          <button
            key={i}
            aria-pressed={clue === i}
            aria-label={word(
              mode,
              '查看线索' + (i + 1) + '：' + c.zh,
              'Inspect clue ' + (i + 1) + ': ' + c.en,
            )}
            onClick={() => setClue(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
      </figcaption>
      <p className="bio-caption">
        <Text
          mode={mode}
          text={t(
            '原创教学示意 · 非按比例，颜色用于解释',
            'Original schematic · Not to scale; colours explain functions',
          )}
        />
      </p>
    </figure>
  );
}
function Static({
  mode,
  zh,
  en,
}: {
  mode: LanguageMode;
  zh: string;
  en: string;
}) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字版与模型说明', 'Text version & model notes')}
        />
      </summary>
      <p>
        <Text mode={mode} text={t(zh, en)} />
      </p>
    </details>
  );
}
export function PlantExplore(props: Props) {
  return (
    <div data-resource-id={props.id + '-I01'}>
      {props.id === 'L009' ? (
        <NeedsLab {...props} />
      ) : props.id === 'L010' ? (
        <TransportLab {...props} />
      ) : props.id === 'L011' ? (
        <SeedJourney {...props} />
      ) : (
        <HabitatLab {...props} />
      )}
    </div>
  );
}
function NeedsLab({ mode, onExplore }: Props) {
  const [light, setLight] = useState(true),
    [water, setWater] = useState(true),
    [carbon, setCarbon] = useState(true);
  const flow = useFrames(3, onExplore),
    result = plantSugar(light, water, carbon);
  const states = [
    t(
      '先找原料和能量：水、二氧化碳、光。',
      'Find materials and energy: water, carbon dioxide and light.',
    ),
    t(
      '有合适条件时，光能支持制造糖。',
      'Suitable conditions allow light energy to support sugar production.',
    ),
    t(
      '本模型表示新糖制造与氧气释放，不计算产量。',
      'The model shows sugar production and oxygen release, without calculating yield.',
    ),
    t(
      '植物用糖建造或储存，细胞呼吸释放可用能量。',
      'Sugars support growth or storage; respiration releases usable energy.',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '帮窗边植物找齐条件。',
            'Find conditions for a windowsill plant.',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-plant-choice">
        {[
          [light, setLight, t('光可用', 'Light available')],
          [water, setWater, t('水可用', 'Water available')],
          [carbon, setCarbon, t('CO₂可用', 'CO₂ available')],
        ].map(([v, set, label], i) => (
          <button
            key={i}
            aria-pressed={v as boolean}
            onClick={() => {
              (set as (v: boolean) => void)(!v);
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={label as ReturnType<typeof t>} />
            <span aria-hidden="true"> {v ? '✓' : '—'}</span>
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 300"
          role="img"
          aria-label={word(
            mode,
            '光合作用条件与糖的用途模型',
            'Photosynthesis conditions and sugar-use model',
          )}
        >
          <rect width="420" height="300" fill={light ? '#faf7ea' : '#e5e9eb'} />
          <Plant />
          {light && (
            <>
              <circle cx="62" cy="49" r="23" fill="#ead6a1" />
              <path d="m86 70 66 42" stroke={gold} strokeWidth="3" />
            </>
          )}
          {water && (
            <>
              <circle cx="123" cy="242" r="8" fill={blue} />
              <path d="M137 242h29" stroke={blue} strokeWidth="3" />
            </>
          )}
          <text x="305" y="68" fontSize="16" fill={carbon ? blue : '#a4a4a4'}>
            {carbon ? 'CO₂ →' : 'CO₂ —'}
          </text>
          {result.canMakeSugar && flow.frame >= 1 && (
            <>
              <rect
                x="288"
                y="182"
                width="100"
                height="35"
                rx="8"
                fill="#eadcae"
              />
              <text x="297" y="204" fontSize="14" fill="#6a684c">
                {word(mode, '新糖', 'New sugars')}
              </text>
            </>
          )}
          {result.canMakeSugar && flow.frame >= 2 && (
            <text x="310" y="143" fontSize="16" fill={blue}>
              O₂ →
            </text>
          )}
          {flow.frame === 3 && (
            <>
              <path d="M34 159h108v45H34Z" fill="#eee5c5" />
              <text x="42" y="186" fontSize="13" fill="#796b43">
                {word(mode, '储存糖', 'Stored sugars')}
              </text>
              <path d="M142 181h36" stroke={gold} strokeWidth="3" />
              <text x="23" y="223" fontSize="12" fill={gold}>
                {word(mode, '细胞呼吸 → 能量', 'Respiration → energy')}
              </text>
            </>
          )}
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            !result.canMakeSugar && flow.frame > 0
              ? t(
                  '当前缺少' +
                    result.missing
                      .map((x) =>
                        x === 'light' ? '光' : x === 'water' ? '可用水' : 'CO₂',
                      )
                      .join('、') +
                    '，模型不展示新糖制造。仍假设有储存糖与氧气，末帧可进行细胞呼吸。',
                  'Missing ' +
                    result.missing
                      .map((x) => (x === 'carbon' ? 'CO₂' : x))
                      .join(', ') +
                    ': no new sugar production is shown. Stored sugars and oxygen are assumed; respiration is shown in the final frame.',
                )
              : states[flow.frame]!
          }
        />
      </p>
      <Static
        mode={mode}
        zh="光、水、二氧化碳→制造糖与释放氧气；糖→建造、储存或细胞呼吸。假设健康的绿色植物、有矿质营养、适宜温度、氧气和储存糖。无光或缺原料不画新糖，仍可利用储存糖。条件只有有/无，不预测生长、萎蔫、速率或寿命。图中箭头不是化学方程，帧数不是小时。"
        en="Light, water and carbon dioxide support sugars and oxygen; sugars support growth, storage or respiration. Assume a healthy green plant, mineral nutrients, suitable temperature, oxygen and stored sugars. Missing light or materials prevents new sugars in this model, but reserves remain usable. Binary conditions do not predict growth, wilting, rates or lifespan. Arrows are not a chemical equation and frames are not hours."
      />
    </>
  );
}
function TransportLab({ mode, onExplore }: Props) {
  const [sugar, setSugar] = useState(false);
  const flow = useFrames(3, onExplore);
  const marker = useId();
  const waterPos = [
      [149, 257],
      [205, 223],
      [205, 162],
      [270, 123],
    ],
    sugarPos = [
      [270, 123],
      [220, 153],
      [218, 196],
      [159, 256],
    ];
  const pos = (sugar ? sugarPos : waterPos)[flow.frame]!;
  const states = sugar
    ? [
        t(
          '叶片制造糖，是本次路线的来源。',
          'A leaf makes sugars and is the source for this route.',
        ),
        t(
          '糖进入连接器官的运输组织。',
          'Sugars enter transport tissues linking organs.',
        ),
        t(
          '糖运向需要使用或储存它的部位。',
          'Sugars move towards parts that use or store them.',
        ),
        t(
          '根与新芽都可接收糖；不是永远只向下。',
          'Roots and buds can receive sugars; transport is not always downward.',
        ),
      ]
    : [
        t(
          '根从环境吸收水；蓝点不是一滴水的真实尺寸。',
          'Roots take up water; the blue dot is not a real droplet size.',
        ),
        t(
          '水进入运输组织，经过茎。',
          'Water enters transport tissues and passes through the stem.',
        ),
        t('运输把根与叶连接起来。', 'Transport links roots with leaves.'),
        t(
          '叶片得到水；部分用于光合作用，也会经蒸腾失去。',
          'Leaves receive water; some supports photosynthesis and some is lost through transpiration.',
        ),
      ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('追踪一条植物里的路线。', 'Trace a route through a plant.')}
        />
      </h3>
      <div className="bio-choice-row bio-plant-choice">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            aria-pressed={sugar === v}
            onClick={() => {
              setSugar(v);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                v ? t('追踪糖', 'Trace sugars') : t('追踪水', 'Trace water')
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 300"
          role="img"
          aria-label={word(
            mode,
            sugar ? '叶片到根和新芽的糖路线' : '根经茎到叶的水路线',
            sugar
              ? 'Sugar routes from leaf to roots and bud'
              : 'Water route from root through stem to leaf',
          )}
        >
          <defs>
            <marker
              id={marker}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="m0 0 6 3-6 3" fill={sugar ? gold : blue} />
            </marker>
          </defs>
          <Plant />
          <path
            d={
              sugar
                ? 'M279 129 226 160V229L159 258'
                : 'M147 259 202 225V166L268 124'
            }
            fill="none"
            stroke={sugar ? gold : blue}
            strokeWidth="3"
            strokeDasharray="6 5"
            markerEnd={'url(#' + marker + ')'}
          />
          {sugar && flow.frame >= 2 && (
            <path
              d="M226 180V52"
              stroke={gold}
              strokeWidth="3"
              fill="none"
              strokeDasharray="6 5"
              markerEnd={'url(#' + marker + ')'}
            />
          )}
          <circle
            cx={pos[0]}
            cy={pos[1]}
            r="8"
            fill={sugar ? gold : blue}
            stroke="#fff"
            strokeWidth="2"
          />
          {sugar && flow.frame === 3 && (
            <circle
              cx="225"
              cy="52"
              r="8"
              fill={gold}
              stroke="#fff"
              strokeWidth="2"
            />
          )}
          <text x="27" y="105" fontSize="14" fill={sugar ? gold : blue}>
            {word(
              mode,
              sugar ? '叶片 → 需要处' : '根 → 茎 → 叶',
              sugar ? 'Leaf → destinations' : 'Root → stem → leaf',
            )}
          </text>
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={states[flow.frame]!} />
      </p>
      <Static
        mode={mode}
        zh="蓝色：根→茎→叶。金色：叶→运输组织→根或新芽。颜色区分功能，不代表真实管道颜色；点和箭头不按比例，不计算速度或推动运输的力。糖路线会随来源和需求改变；这是一株幼小植物的示意，不代表每种植物的所有路线。"
        en="Blue: root → stem → leaf. Gold: leaf → transport tissues → root or bud. Colours distinguish functions, not real vessels. Dots and arrows are not to scale; speeds and driving forces are omitted. Sugar routes depend on sources and sinks. This schematic young plant does not represent every route in every species."
      />
    </>
  );
}
function SeedJourney({ mode, onExplore }: Props) {
  const [route, setRoute] = useState(0);
  const flow = useFrames(3, onExplore);
  const names = [
    t('花到豌豆荚', 'Flower to pea pod'),
    t('风的旅行', 'Wind dispersal'),
    t('动物的旅行', 'Animal dispersal'),
  ];
  const descriptions = [
    [
      t(
        '花中有生殖结构，胚珠还不是种子。',
        'Flowers contain reproductive structures; ovules are not yet seeds.',
      ),
      t(
        '传粉：花粉到达柱头；尚不能说已经形成种子。',
        'Pollination: pollen reaches a stigma; no seed has yet formed.',
      ),
      t(
        '花粉管路线简化显示受精：生殖细胞结合。',
        'A simplified pollen-tube route leads to fertilisation: reproductive cells fuse.',
      ),
      t(
        '成功发育后，子房成果荚、胚珠成种子；不是每朵花都成功。',
        'Successful development produces a pod from the ovary and seeds from ovules; not every flower succeeds.',
      ),
    ],
    [
      t(
        '蒲公英的绒毛结构连着一个含种子的小果实。',
        'Dandelion hairs are attached to a small seed-containing fruit.',
      ),
      t(
        '气流作用于绒毛结构，可能带动它离开母株。',
        'Air acts on the hairs and may carry the fruit away.',
      ),
      t(
        '传播路径受风、湿度与障碍物影响。',
        'Wind, moisture and obstacles influence the route.',
      ),
      t(
        '到达不代表萌发成功，还需合适条件。',
        'Arrival does not guarantee germination; suitable conditions are still needed.',
      ),
    ],
    [
      t(
        '带钩的果实可以挂在动物皮毛上。',
        'A hooked fruit can attach to animal fur.',
      ),
      t(
        '动物移动，带着果实离开原处。',
        'The animal moves, carrying the fruit elsewhere.',
      ),
      t(
        '果实可能在别处脱落，种子随之到达。',
        'The fruit may detach elsewhere, carrying its seeds.',
      ),
      t(
        '这是传播，不是动物帮植物完成受精。',
        'This is dispersal, not the animal fertilising the plant.',
      ),
    ],
  ];
  const x = route === 1 ? 80 + flow.frame * 65 : 75 + flow.frame * 65;
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('先形成，再旅行。', 'Develop first, then travel.')}
        />
      </h3>
      <div className="bio-choice-row bio-plant-choice">
        {names.map((name, i) => (
          <button
            key={i}
            aria-pressed={route === i}
            onClick={() => {
              setRoute(i);
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={name} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 300"
          role="img"
          aria-label={word(
            mode,
            names[route]!.zh + '教学序列',
            names[route]!.en + ' teaching sequence',
          )}
        >
          {route === 0 ? (
            <>
              <Flower frame={flow.frame} />
              <text x="25" y="275" fontSize="14" fill={green}>
                {word(
                  mode,
                  ['花', '传粉', '受精', '果荚 + 种子'][flow.frame]!,
                  ['Flower', 'Pollination', 'Fertilisation', 'Pod + seeds'][
                    flow.frame
                  ]!,
                )}
              </text>
            </>
          ) : route === 1 ? (
            <>
              <path
                d="M70 280V210m0 15-20-18m20 3 17-17"
                stroke={green}
                fill="none"
                strokeWidth="3"
              />
              <path
                d="M40 74h280m-30-7 30 7-30 7"
                stroke={blue}
                fill="none"
                strokeWidth="2"
              />
              <g
                transform={
                  'translate(' + x + ' ' + (185 - flow.frame * 20) + ')'
                }
              >
                <path
                  d="M0 0v-34m0 0-26-15m26 15 26-15m-26 15-17-23m17 23 17-23m-17 23v-28"
                  stroke="#9b9b7b"
                  strokeWidth="2"
                />
                <ellipse cy="7" rx="5" ry="10" fill={gold} />
              </g>
              <text x="30" y="41" fontSize="14" fill={blue}>
                {word(mode, '风 → 示意路径', 'Wind → schematic route')}
              </text>
            </>
          ) : (
            <>
              <g transform={'translate(' + x + ' 162)'}>
                <ellipse rx="53" ry="35" fill="#d5c5ac" />
                <circle cx="54" cy="-10" r="22" fill="#d5c5ac" />
                <path
                  d="m-35 26-6 45m48-45 4 45"
                  stroke="#ad987c"
                  strokeWidth="7"
                />
                <g
                  transform={
                    flow.frame === 3 ? 'translate(0 74)' : 'translate(0 -24)'
                  }
                >
                  <circle r="10" fill={gold} />
                  <path
                    d="m-8-6-8-9q-5-5-8 0m31 9 9-9q5-5 8 0m-12 23 5 12"
                    fill="none"
                    stroke={gold}
                    strokeWidth="2"
                  />
                </g>
              </g>
              <path d="M27 252h358" stroke="#b6bfa2" strokeWidth="3" />
              <text x="28" y="57" fontSize="14" fill={green}>
                {word(mode, '钩子 + 皮毛 → 移动', 'Hooks + fur → movement')}
              </text>
            </>
          )}
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={descriptions[route]![flow.frame]!} />
      </p>
      <Static
        mode={mode}
        zh="花→传粉→受精→果荚与种子。花图画三枚胚珠，成熟荚画三颗种子；受精只追踪中央一枚，并假设其余也成功发育，不表示固定产量。传粉不保证受精、受精也不保证成功结实。风传播与动物携带展示不同植物的独立例子，不是豌豆突然变成蒲公英或钩状果实。帧数压缩时间，移动路径不预测距离；真实传播受环境影响。"
        en="Flower → pollination → fertilisation → pod and seeds. Three ovules and three illustrated seeds are schematic, not a fixed yield. Fertilisation tracks the central ovule only, assuming the others also develop successfully. Pollination need not lead to fertilisation or successful fruit development. Wind and hooked-fruit examples belong to different plants; peas do not turn into dandelions or hooked fruits. Frames compress time, routes do not predict distances, and real dispersal depends on conditions."
      />
    </>
  );
}
function HabitatLab({ mode, onExplore }: Props) {
  const [wet, setWet] = useState(false),
    [lily, setLily] = useState(false);
  const flow = useFrames(3, onExplore);
  const benefit = lily
    ? wet
      ? t(
          '浮叶在水面接收光，水下部分与叶片相连。',
          'Floating leaves intercept light and connect to submerged parts.',
        )
      : t(
          '宽叶可接收光，但离开适合的水环境会遇到限制。',
          'Broad leaves intercept light, but this aquatic form is constrained away from its water habitat.',
        )
    : wet
      ? t(
          '厚茎仍能储水，但储水优势不表示根适合长期积水。',
          'A thick stem still stores water, but that does not imply tolerance of persistent waterlogging.',
        )
      : t(
          '刺叶减少暴露叶面积，厚茎储水，有助应对干燥。',
          'Reduced leaf area and stem storage can help in dry conditions.',
        );
  const limit = lily
    ? t(
        '不是所有宽叶都适合水生；浮叶植物也需要水和适宜温度等条件。',
        'Not all broad leaves are aquatic adaptations; floating-leaved plants still need water and suitable temperature.',
      )
    : t(
        '仙人掌仍会失水、仍需要水；许多种类的根不适合长期缺氧积水。',
        'Cacti still lose and need water; roots of many species do not tolerate prolonged oxygen-poor waterlogging.',
      );
  const captions = [
    lily
      ? t(
          '观察：宽叶浮在水面，细长叶柄连接水下部分。',
          'Observation: broad leaves float above stalks linking submerged parts.',
        )
      : t(
          '观察：刺叶与绿色厚茎，各有不同作用。',
          'Observation: spines and a thick green stem serve different roles.',
        ),
    lily
      ? t(
          '作用：宽叶接收光；不表示所有宽叶都会浮。',
          'Function: broad leaves intercept light; not all broad leaves float.',
        )
      : t(
          '作用：减少叶面积有助限制失水，绿色茎可光合作用并储水。',
          'Function: reduced leaves help limit water loss; green stems photosynthesise and store water.',
        ),
    benefit,
    limit,
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '结构的好处，要放进环境看。',
            'Assess a structure in its habitat.',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-plant-choice">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            aria-pressed={wet === v}
            onClick={() => {
              setWet(v);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                v
                  ? t('水面环境', 'Water surface')
                  : t('干燥开阔地', 'Dry open land')
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-choice-row bio-plant-choice">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            aria-pressed={lily === v}
            onClick={() => {
              setLily(v);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                v
                  ? t('睡莲结构', 'Water-lily form')
                  : t('仙人掌结构', 'Cactus form')
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 300"
          role="img"
          aria-label={word(
            mode,
            '相同结构在不同环境中的帮助与限制',
            'Benefits and limitations of a form in different habitats',
          )}
        >
          <rect
            y={wet ? 150 : 257}
            width="420"
            height={wet ? 150 : 43}
            fill={wet ? '#c5dde0' : '#e9dcc0'}
          />
          {wet ? (
            <path
              d="M0 150q25-8 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0"
              fill="none"
              stroke={blue}
              strokeWidth="2"
            />
          ) : (
            <circle cx="64" cy="55" r="24" fill="#ead6a1" />
          )}
          {lily ? <Lily /> : <Cactus />}
          {flow.frame >= 1 && (
            <path
              d={
                lily ? 'M112 128q41-43 98 14' : 'M168 92v146m-14-16 14 16 14-16'
              }
              fill="none"
              stroke={gold}
              strokeWidth="3"
            />
          )}
          <text x="30" y="286" fontSize="13" fill={green}>
            {word(
              mode,
              '比较环境，不改变物种',
              'Compare habitats, not species transformation',
            )}
          </text>
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={captions[flow.frame]!} />
      </p>
      <Static
        mode={mode}
        zh="结构→作用→条件中的帮助→限制。切换环境只改变比较情境，切换植物是另一个例子，不是瞬间演化。图中仙人掌和睡莲代表常见结构，不是所有种类；不计算存活概率或失水量，不模拟真实植物移栽。适应涉及可遗传差异与多代变化；个体也可有生理反应，两者不同。"
        en="Structure → function → benefit in context → limitation. Habitat controls change the comparison; plant controls choose another example, not instant evolution. Common cactus and water-lily forms do not represent every species. No survival probabilities, water-loss quantities or real transplant outcomes are simulated. Adaptation involves inherited variation and changes across generations, distinct from an individual’s physiological responses."
      />
    </>
  );
}
