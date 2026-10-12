import { useId, useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  gardenFeeding,
  gardenLinks,
  gardenConsumers,
  type GardenOrganism,
  type FeedingLink,
} from './models';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const green = '#708a58',
  blue = '#608b9b',
  gold = '#b59a52',
  coral = '#b87c6e';
const names: Record<GardenOrganism, LocalizedText> = {
  plant: t('植物', 'Plant'),
  aphid: t('蚜虫', 'Aphid'),
  caterpillar: t('毛虫', 'Caterpillar'),
  ladybird: t('瓢虫', 'Ladybird'),
  bird: t('食虫小鸟', 'Insect-eating bird'),
};
function Leaf({ dry = false }: { dry?: boolean }) {
  return (
    <g>
      <path
        d="M-28 15Q-42-27 26-25Q40 23-28 15Z"
        fill={dry ? '#e3c690' : '#bad197'}
        stroke={dry ? gold : green}
        strokeWidth="2"
      />
      <path
        d="M-31 26 20-20m-35 28-3-15M0-7 15 0"
        fill="none"
        stroke={dry ? gold : green}
        strokeWidth="2"
      />
    </g>
  );
}
function Creature({ kind }: { kind: GardenOrganism }) {
  return kind === 'plant' ? (
    <g>
      <path d="M0 26V-25" stroke={green} strokeWidth="3" />
      <path
        d="M0 3Q-39 6-30-22Q-6-21 0 3ZM0 15Q32 15 33-11Q10-10 0 15Z"
        fill="#bad197"
        stroke={green}
        strokeWidth="2"
      />
    </g>
  ) : kind === 'aphid' ? (
    <g stroke={green} strokeWidth="2">
      <path
        d="M-11-1-24-13m13 16-17 7m39-11 17-12m-14 16 16 9m-11-28 9-9m-13 3 3-11"
        fill="none"
      />
      <ellipse rx="17" ry="22" fill="#b4ca8b" />
      <circle cy="-19" r="9" fill="#c8dba8" />
    </g>
  ) : kind === 'caterpillar' ? (
    <g stroke={green} strokeWidth="2">
      {[-25, -13, 0, 13, 25].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? -4 : 0} r="10" fill="#c3d79f" />
      ))}
      <path d="m-22 9-2 6m15-9-2 6m15-6-2 6m15-5-2 6m14-19 8-8" fill="none" />
      <circle cx="29" cy="-4" r="2" fill="#385842" />
    </g>
  ) : kind === 'ladybird' ? (
    <g stroke="#886457" strokeWidth="2">
      <ellipse rx="22" ry="24" fill="#d9a294" />
      <path
        d="M0-23v46m-18-7-10 5m8-20-10-4m49 0 10-4m-9 23 10 5"
        fill="none"
      />
      <circle cy="-23" r="10" fill="#826e59" />
      {[
        [-10, -8],
        [11, 5],
        [-9, 12],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#826e59" />
      ))}
    </g>
  ) : (
    <g stroke={green} strokeWidth="2">
      <ellipse cx="-2" cy="3" rx="28" ry="20" fill="#c6d4a7" />
      <circle cx="19" cy="-14" r="14" fill="#c6d4a7" />
      <path
        d="m32-15 13 5-13 3m-56 3-17-7 13 22m21 8v10m14-11v11"
        fill="none"
      />
      <path d="M-20-2q22-10 25 14" fill="none" />
      <circle
        cx="21"
        cy="-17"
        r="4"
        fill="#385842"
        stroke="#fff"
        strokeWidth="2"
      />
    </g>
  );
}
function Snail() {
  return (
    <g stroke={gold} strokeWidth="2">
      <path d="M-38 22q31-14 62-7l8-21m-3 10 12-10" fill="none" />
      <ellipse cx="-7" cy="3" rx="23" ry="20" fill="#e0cba0" />
      <path d="M3 2q-8-15-21-4q-13 15 5 19q14 2 12-9q-3-9-10-2" fill="none" />
    </g>
  );
}
function Garden({
  sunny = false,
  focus = 0,
}: {
  sunny?: boolean;
  focus?: number;
}) {
  return (
    <g>
      <rect
        x="30"
        y="40"
        width="360"
        height="228"
        rx="20"
        fill={sunny ? '#f3ebd5' : '#e8efdd'}
      />
      <circle cx="337" cy="77" r="21" fill="#e7cd83" />
      {sunny ? (
        <g stroke="#d8c494" strokeWidth="2">
          <path d="M30 206h360M30 241h360M114 190v78m111-78v78m108-78v78" />
        </g>
      ) : (
        <g>
          <path
            d="M70 189V87m0 25 28-22m-28 49-29-19"
            fill="none"
            stroke="#8a9471"
            strokeWidth="9"
          />
          <path
            d="M33 81q4-35 30-21q24-27 47-2q25-2 29 28q-7 25-40 20q-40 24-66-25Z"
            fill="#b1c893"
          />
          <path d="M39 204q122-36 250 0" fill="#c2cfa5" opacity=".6" />
          {[95, 150, 209].map((x, i) => (
            <g
              key={x}
              transform={`translate(${x} ${230 - (i % 2) * 18}) scale(.56)`}
            >
              <Leaf dry />
            </g>
          ))}
          <g transform="translate(284 202) scale(.7)">
            <Creature kind="plant" />
          </g>
        </g>
      )}
      <g transform={`translate(${sunny ? 182 : 205} 196)`}>
        <Snail />
      </g>
      {focus === 1 && (
        <g fill={blue}>
          {[82, 130, 297].map((x) => (
            <path
              key={x}
              d={`M${x} 117q-15 24 0 24q15 0 0-24Z`}
              opacity={sunny ? 0.2 : 0.85}
            />
          ))}
        </g>
      )}
      {focus === 2 && (
        <path
          d="M312 100 284 150"
          stroke={gold}
          strokeWidth={sunny ? 5 : 2}
          strokeDasharray="6 5"
        />
      )}
      {focus === 3 && !sunny && (
        <g transform="translate(302 240) scale(.6)">
          <Creature kind="aphid" />
        </g>
      )}
    </g>
  );
}
const positions: Record<GardenOrganism, [number, number]> = {
  plant: [240, 271],
  aphid: [105, 160],
  caterpillar: [375, 160],
  ladybird: [105, 60],
  bird: [375, 60],
};
function edgeCoordinates(link: FeedingLink) {
  const a = positions[link.food],
    b = positions[link.consumer],
    d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return {
    x1: a[0] + ((b[0] - a[0]) * 38) / d,
    y1: a[1] + ((b[1] - a[1]) * 38) / d,
    x2: b[0] - ((b[0] - a[0]) * 42) / d,
    y2: b[1] - ((b[1] - a[1]) * 42) / d,
  };
}
function WebGraph({
  mode,
  links = gardenFeeding,
  absent = false,
  lost = false,
  possible = false,
}: {
  mode: LanguageMode;
  links?: readonly FeedingLink[];
  absent?: boolean;
  lost?: boolean;
  possible?: boolean;
}) {
  const arrow = useId();
  return (
    <>
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
          <path d="m0 0 10 5-10 5Z" fill={blue} />
        </marker>
      </defs>
      {links.map((link) => (
        <line
          key={link.food + link.consumer}
          {...edgeCoordinates(link)}
          stroke={blue}
          strokeWidth="2.5"
          markerEnd={`url(#${arrow})`}
        />
      ))}
      {lost && (
        <g>
          <line
            {...edgeCoordinates({ food: 'aphid', consumer: 'ladybird' })}
            stroke={coral}
            strokeWidth="2"
            strokeDasharray="4 5"
          />
          <text x="105" y="111" textAnchor="middle" fill={coral} fontSize="25">
            ×
          </text>
        </g>
      )}
      {(Object.keys(positions) as GardenOrganism[]).map((kind) => {
        const [x, y] = positions[kind],
          off = kind === 'ladybird' && absent;
        return (
          <g
            key={kind}
            transform={`translate(${x} ${y})`}
            opacity={off ? 0.4 : 1}
          >
            <circle
              r="35"
              fill={kind === 'plant' ? '#e8efdb' : '#f8f6ed'}
              stroke={kind === 'aphid' && possible ? gold : '#d7ddc9'}
              strokeWidth={kind === 'aphid' && possible ? 3 : 1}
            />
            <g transform="scale(.68)">
              <Creature kind={kind} />
            </g>
            <text
              y={kind === 'ladybird' || kind === 'bird' ? -42 : 55}
              textAnchor="middle"
              fontSize="15"
              fill="#385842"
            >
              {word(mode, names[kind])}
            </text>
            {off && (
              <text x="43" y="7" textAnchor="start" fontSize="12" fill={coral}>
                {word(mode, t('本地不在', 'Absent here'))}
              </text>
            )}
            {kind === 'aphid' && possible && (
              <text x="45" y="4" fontSize="16" fill={gold}>
                ?
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
const clues: Record<string, LocalizedText[]> = {
  L017: [
    t(
      '水分：这是非生物条件。情境中落叶处较湿，真实情况要观察，不能只凭图预测。',
      'Moisture is abiotic. The virtual leaf patch is damper; real conditions need observation.',
    ),
    t(
      '光照与遮荫：植物的叶能改变附近非生物条件。不是每个生物都喜欢同样的光。',
      'Light and shade: leaves can change abiotic conditions nearby. Organisms do not all share the same light needs.',
    ),
    t(
      '生物关系：植物、蜗牛和其他生物利用资源，也相互影响。栖息地不是只有一间巢。',
      'Living links: plants, snails and other organisms use resources and affect one another. A habitat is more than a nest.',
    ),
  ],
  L018: [
    t(
      '生产者：这里的植物借助光合作用制造有机物，也进行细胞呼吸。',
      'Producer: this plant makes organic substances through photosynthesis and also respires.',
    ),
    t(
      '消费者：蚜虫取食植物，选定的食蚜瓢虫取食蚜虫。其他瓢虫可能有不同食谱。',
      'Consumers: aphids feed on plants and this selected ladybird eats aphids. Other ladybirds can have different diets.',
    ),
    t(
      '箭头：食物→取食者，表示能量等的传递方向，不是追捕方向。',
      'Arrows: food → feeder shows transfers including energy, not pursuit direction.',
    ),
  ],
  L019: [
    t(
      '落叶：含有来自原植物的有机物和矿质元素。碎裂不一定都来自微生物。',
      'Litter contains organic material and mineral elements from the plant. Fragmentation is not always microbial.',
    ),
    t(
      '分解者：部分真菌和细菌取得物质与能量，并参与分解、利用和物质释放。',
      'Decomposers: some fungi and bacteria obtain matter and energy through breakdown, use and release processes.',
    ),
    t(
      '再利用：一些元素可成为土壤无机营养，被根吸收；矿质营养不是现成糖或光能。',
      'Reuse: some elements become inorganic soil nutrients for root uptake. Minerals are not ready-made sugar or light energy.',
    ),
  ],
  L020: [
    t(
      '直接关系：瓢虫取食蚜虫；改变这个种群首先影响这条捕食联系。',
      'Direct link: the ladybird eats aphids; changing that population first affects this predation link.',
    ),
    t(
      '间接路线：蚜虫取食植物；蚜虫变化可能把影响传到植物。',
      'Indirect route: aphids feed on plants, so aphid changes may carry effects to plants.',
    ),
    t(
      '另一条联系：图中的鸟也吃蚜虫，但一条箭头不能给出捕食量或保证补偿。',
      'Another link: the model bird also eats aphids, but an arrow does not quantify predation or guarantee compensation.',
    ),
  ],
};
function Microbes() {
  return (
    <g>
      <path
        d="M-30 26v-26m0 7-17-10m17 20 20-12m-20 13-16 9m16-3 14 7"
        stroke={green}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M-56 0q26-36 51 0Z"
        fill="#d3ba97"
        stroke={gold}
        strokeWidth="2"
      />
      {[
        [27, 0],
        [45, 22],
        [15, 30],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="17"
          height="8"
          rx="4"
          fill="#9ebdb3"
          stroke={blue}
          transform={`rotate(${i * 30} ${x} ${y})`}
        />
      ))}
    </g>
  );
}
function RecyclePicture({
  frame = 3,
  energy = false,
  mode,
}: {
  frame?: number;
  energy?: boolean;
  mode: LanguageMode;
}) {
  const arrow = useId();
  const labels = energy
    ? [
        t('落叶化学能', 'Leaf chemical energy'),
        t('微生物利用', 'Microbial use'),
        t('生命活动', 'Life processes'),
        t('散为热', 'Heat dispersal'),
      ]
    : [
        t('落叶中的元素', 'Element in litter'),
        t('分解与利用', 'Breakdown & use'),
        t('土壤无机营养', 'Soil nutrients'),
        t('根吸收再利用', 'Root uptake'),
      ];
  const pts = [
    [110, 80],
    [370, 80],
    [370, 225],
    [110, 225],
  ];
  return (
    <>
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
          <path d="m0 0 10 5-10 5Z" fill={energy ? gold : blue} />
        </marker>
      </defs>
      {['M190 80h96', 'M370 139v29', 'M290 225h-96'].map((d, i) => (
        <path
          key={d}
          d={d}
          stroke={energy ? gold : blue}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#${arrow})`}
        />
      ))}
      {!energy && (
        <g>
          <path
            d="M110 162v-25"
            stroke={blue}
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
            markerEnd={`url(#${arrow})`}
          />
          <text x="30" y="154" fontSize="10" fill={green}>
            {word(mode, t('生长与落叶', 'Growth & litter'))}
          </text>
        </g>
      )}
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect
            x="-78"
            y="-54"
            width="156"
            height="110"
            rx="15"
            fill={i === frame ? '#edf3e6' : '#faf8f3'}
            stroke={i === frame ? green : '#d9ddcf'}
            strokeWidth={i === frame ? 3 : 1}
          />
          <g transform="translate(0 -8) scale(.68)">
            {i === 0 ? (
              <Leaf dry />
            ) : i === 1 ? (
              <Microbes />
            ) : i === 2 ? (
              energy ? (
                <g fill="none" stroke={gold} strokeWidth="4">
                  <path d="m-25 14 15-37 10 22 15-9-8 29m-5-5 15 2" />
                </g>
              ) : (
                <g fill={blue}>
                  {[-24, 0, 24].map((x, j) => (
                    <circle key={x} cx={x} cy={j % 2 ? -9 : 8} r="8" />
                  ))}
                </g>
              )
            ) : energy ? (
              <g stroke={gold} strokeWidth="3" fill="none">
                <path d="M-28 22q-13-15 0-28t0-26m28 54q-13-15 0-28t0-26m28 54q-13-15 0-28t0-26" />
              </g>
            ) : (
              <Creature kind="plant" />
            )}
          </g>
          <text x="-62" y="-34" fontSize="13" fill={green}>
            {i + 1}
          </text>
          <text y="42" textAnchor="middle" fontSize="14" fill="#385842">
            {word(mode, labels[i]!)}
          </text>
        </g>
      ))}
    </>
  );
}
export function EcoDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const [clue, setClue] = useState(0),
    caption = useId();
  const labels =
    id === 'L017'
      ? [
          t('水分', 'Moisture'),
          t('光与遮荫', 'Light & shade'),
          t('生物关系', 'Living links'),
        ]
      : id === 'L019'
        ? [
            t('落叶', 'Litter'),
            t('分解者', 'Decomposers'),
            t('再利用', 'Reuse'),
          ]
        : [
            t('来源', 'Source'),
            t('取食关系', 'Feeding links'),
            t('箭头与局限', 'Arrows & limits'),
          ];
  return (
    <figure
      className="bio-diagram bio-eco-diagram"
      data-resource-id={`${id}-D01`}
      aria-labelledby={caption}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('后院观察站', 'GARDEN OBSERVATORY')} />
      </span>
      <svg
        viewBox={id === 'L017' ? '0 0 420 300' : '0 0 480 350'}
        role="img"
        aria-label={word(
          mode,
          t(
            '栖息地、取食与循环示意图',
            'Habitat, feeding or recycling schematic',
          ),
        )}
      >
        {id === 'L017' ? (
          <Garden focus={clue + 1} />
        ) : id === 'L019' ? (
          <RecyclePicture
            frame={clue === 0 ? 0 : clue === 1 ? 1 : 3}
            mode={mode}
          />
        ) : id === 'L018' ? (
          <g>
            <path
              d="M147 149h47m-7-5 7 5-7 5M278 149h52m-7-5 7 5-7 5"
              fill="none"
              stroke={blue}
              strokeWidth="3"
            />
            {(['plant', 'aphid', 'ladybird'] as GardenOrganism[]).map(
              (kind, i) => (
                <g key={kind} transform={`translate(${110 + i * 130} 145)`}>
                  <Creature kind={kind} />
                  <text y="58" textAnchor="middle" fontSize="16" fill={green}>
                    {word(mode, names[kind])}
                  </text>
                </g>
              ),
            )}
            <text x="240" y="260" textAnchor="middle" fontSize="16" fill={blue}>
              {word(mode, t('食物 → 取食者', 'Food → feeder'))}
            </text>
          </g>
        ) : (
          <WebGraph mode={mode} />
        )}
      </svg>
      <div className="bio-choice-row bio-eco-choice">
        {labels.map((label, i) => (
          <button
            key={label.en}
            aria-pressed={clue === i}
            onClick={() => setClue(i)}
          >
            <Text mode={mode} text={label} />
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
        <small>
          <Text
            mode={mode}
            text={t(
              '原创教学示意，非按比例。虚拟情境与选定关系不能代替实际观察。',
              'Original schematic, not to scale. Virtual scenarios and selected links do not replace observations.',
            )}
          />
        </small>
      </figcaption>
    </figure>
  );
}
export function EcoHookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={word(
        mode,
        t('后院生命探索插图', 'Garden life exploration illustration'),
      )}
    >
      {id === 'L017' ? (
        <Garden />
      ) : id === 'L019' ? (
        <>
          <g transform="translate(131 173) scale(1.5)">
            <Leaf dry />
          </g>
          <g transform="translate(295 188) scale(1.2)">
            <Microbes />
          </g>
        </>
      ) : (
        <>
          <g transform="translate(100 181) scale(1.5)">
            <Creature kind="plant" />
          </g>
          <g transform="translate(305 102) scale(1.5)">
            <Creature kind="bird" />
          </g>
          <g transform="translate(276 232) scale(1.1)">
            <Creature kind="ladybird" />
          </g>
          <g transform="translate(155 112)">
            <Creature kind="aphid" />
          </g>
        </>
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
function FrameText({
  mode,
  text,
}: {
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <p className="bio-eco-result" aria-live="polite">
      <Text mode={mode} text={text} />
    </p>
  );
}
export function EcoExplore(props: Props) {
  return (
    <div data-resource-id={`${props.id}-I01`}>
      {props.id === 'L017' ? (
        <HabitatLab {...props} />
      ) : props.id === 'L018' ? (
        <WebLab {...props} />
      ) : props.id === 'L019' ? (
        <RecycleLab {...props} />
      ) : (
        <CascadeLab {...props} />
      )}
    </div>
  );
}
function HabitatLab({ mode, onExplore }: Props) {
  const [sunny, setSunny] = useState(false),
    flow = useFrames(3, onExplore);
  const frames = [
    sunny
      ? t(
          '地点：同一后院的铺路。这里只设置一处阳光下、较干的虚拟角落。',
          'Site: paving in the same garden, set here as a sunny, drier virtual corner.',
        )
      : t(
          '地点：同一后院的树荫落叶处。场景设置为较湿、有遮蔽，不是测得的真实数据。',
          'Site: a shaded leaf patch, set here as damp and sheltered rather than measured real data.',
        ),
    sunny
      ? t(
          '物理条件：阳光较多，图中设置较干。非生物条件要通过观察或测量核对，不能仅凭铺路材质判断。',
          'Physical conditions: more sunlight and a drier setting. Observation or measurement is needed; paving material alone does not establish conditions.',
        )
      : t(
          '物理条件：植物遮荫与落叶覆盖能影响附近水分和温度。叶子是生物形成的结构，光与水是非生物条件。',
          'Physical conditions: shade and litter cover can influence nearby moisture and temperature. Leaves are organism-made structures; light and water are nonliving conditions.',
        ),
    sunny
      ? t(
          '资源与生物：课中铺路的植物食物和遮蔽较少，但不是“绝对没有生命”。缝隙也可能有生物。',
          'Resources and organisms: the model paving has less plant food and cover, not an absolute absence of life. Cracks may contain organisms.',
        )
      : t(
          '资源与生物：植物、遮蔽与其他生物共同影响生活。食物来源、竞争与捕食都可改变这里的生物关系。',
          'Resources and organisms: plants, cover and other organisms affect life. Food sources, competition and predation can change relationships here.',
        ),
    t(
      '有限解释：这些线索可帮助提出某种蜗牛为何出现在这里的假说。一次出现不证明原因；没有看到，也不证明不存在。',
      'Limited explanation: clues help propose why a particular snail occurs here. One sighting does not establish a cause, and non-detection does not establish absence.',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '隔几步，也是不同的世界',
            'A different world a few steps away',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-eco-choice">
        {[
          t('树荫落叶处', 'Shaded leaf patch'),
          t('阳光铺路', 'Sunny paving'),
        ].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={sunny === Boolean(i)}
            onClick={() => {
              setSunny(Boolean(i));
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
          viewBox="0 0 420 300"
          role="img"
          aria-label={word(
            mode,
            t('两个虚拟栖息角落的线索', 'Clues in two virtual habitat corners'),
          )}
        >
          <Garden sunny={sunny} focus={flow.frame} />
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '地点→非生物条件→资源与生物→有限解释。课中假设阴影落叶处较湿、铺路较干。蜗牛图标不是数量记录或存活预测；不对所有蜗牛或你家后院作判断，也无需改变真实环境。',
          'Site → abiotic conditions → resources and organisms → limited explanation. Shade is set as damper and paving as drier. The snail icon is not a count or survival prediction. No universal snail or personal-garden claim is made, and no real habitat changes are needed.',
        )}
      />
    </>
  );
}
function WebLab({ mode, onExplore }: Props) {
  const flow = useFrames(3, onExplore),
    links = gardenFeeding.slice(0, 2 + flow.frame);
  const evidence = [
    t('① 毛虫取食叶', '① Caterpillar eats leaves'),
    t('② 鸟取食毛虫', '② Bird eats caterpillars'),
    t('③ 鸟取食蚜虫', '③ Bird eats aphids'),
  ];
  const frames = [
    t(
      '起始证据：蚜虫取食植物，选定瓢虫取食蚜虫。两条箭头组成一条链；箭头从食物指向取食者。',
      'Starting evidence: aphids feed on plants and the selected ladybird eats aphids. Two food-to-feeder arrows form a chain.',
    ),
    t(
      '加入一条：毛虫取食叶，所以画植物→毛虫。植物成为两条取食路线的来源。',
      'Add one link: a caterpillar eats leaves, giving plant → caterpillar. The plant supplies two routes.',
    ),
    t(
      '再加入：鸟取食毛虫，所以画毛虫→鸟。一条新的链与原来的路线共用植物。',
      'Add bird feeding on caterpillars: caterpillar → bird. The new chain shares the plant with the earlier route.',
    ),
    t(
      '连成网：鸟也取食蚜虫，加入蚜虫→鸟。路线相互连接；图中只有选定关系，不含全部物种与分解路线。',
      'A web: the bird also eats aphids, adding aphid → bird. Connected routes show selected feeding links, not all species or decomposition routes.',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '用观察证据搭一张食物网',
            'Build a web from feeding evidence',
          )}
        />
      </h3>
      <p>
        <Text
          mode={mode}
          text={t(
            '按序加入三张虚拟证据；点任意一张可回看那一步。',
            'Add three virtual observations in order; select a card to revisit that step.',
          )}
        />
      </p>
      <div className="bio-choice-row bio-eco-choice bio-eco-evidence">
        {evidence.map((v, i) => (
          <button
            key={v.en}
            aria-pressed={flow.frame === i + 1}
            onClick={() => flow.choose(i + 1)}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 480 350"
          role="img"
          aria-label={word(
            mode,
            t(
              '逐条添加证据的后院食物网',
              'Garden food web built one evidence link at a time',
            ),
          )}
        >
          <WebGraph mode={mode} links={links} />
        </svg>
      </div>
      <div className="bio-eco-legend">
        <Text
          mode={mode}
          text={t(
            '蓝箭头：食物 → 取食者；节点大小不表示真实大小或数量。',
            'Blue arrows: food → feeder; node size is neither real size nor abundance.',
          )}
        />
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '初始植物→蚜虫→瓢虫；再加入植物→毛虫、毛虫→鸟、蚜虫→鸟。卡片是虚拟取食观察，不是对你家后院的调查。只画选定食性，不表示所有鸟与瓢虫的食谱，也不显示转移比例和种群数量。',
          'Start with plant → aphid → ladybird; add plant → caterpillar, caterpillar → bird and aphid → bird. Cards are virtual observations, not your garden’s survey. Selected diets do not describe all birds or ladybirds. Transfer proportions and abundance are not shown.',
        )}
      />
    </>
  );
}
function RecycleLab({ mode, onExplore }: Props) {
  const [energy, setEnergy] = useState(false),
    flow = useFrames(3, onExplore);
  const frames = energy
    ? [
        t(
          '起点：落叶中的有机物储存化学能。这次只追踪其中一部分能量，而非整片叶子的全部。',
          'Start: organic material in litter stores chemical energy. We track a portion, not all the energy in a leaf.',
        ),
        t(
          '利用：分解者取得有机物，用它支持细胞呼吸。它们是有生命的，需要物质和能量。',
          'Use: decomposers obtain organic material that supports cellular respiration. They are living and need matter and energy.',
        ),
        t(
          '活动：可用能量支持生长、维持与其他活动，过程中也有能量散为热。能量不是新的原料原子。',
          'Activities: usable energy supports growth, maintenance and other processes while some disperses as heat. Energy is not newly created material atoms.',
        ),
        t(
          '最终去向：跟踪的这部分能量逐渐散为环境中的热，不是消失，也不会沿矿质营养路线原样回到叶里。',
          'Destination: this tracked portion gradually disperses as environmental heat. It neither vanishes nor returns unchanged along the mineral route to a leaf.',
        ),
      ]
    : [
        t(
          '起点：跟踪落叶中一种矿质元素。叶还含碳等其他成分，它们有另外的路线，本图省略。',
          'Start: follow one mineral element in litter. Carbon and other components have additional routes omitted here.',
        ),
        t(
          '分解与利用：部分真菌和细菌参与有机物分解，并吸收材料。图中微生物被放大；不是所有细菌或真菌都做同样工作。',
          'Breakdown and use: some fungi and bacteria decompose organic material and absorb substances. Microbes are enlarged; not every bacterium or fungus has this role.',
        ),
        t(
          '释放与土壤：经过分解、利用和后续释放，一些元素可进入土壤中的无机营养形式。没有设定真实用时。',
          'Release and soil: decomposition, use and subsequent release can return some elements to inorganic soil nutrient forms. No real timing is assigned.',
        ),
        t(
          '再利用：根吸收这些矿质营养，植物可以利用其中元素。经生长与落叶，元素可能再次进入落叶。矿质营养不是现成糖；植物制糖仍需要光、水和二氧化碳。',
          'Reuse: roots absorb mineral nutrients for plant use. Through growth and leaf fall, an element may enter litter again. Minerals are not ready-made sugar; photosynthesis still needs light, water and carbon dioxide.',
        ),
      ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '落叶之后：两种不同旅程',
            'After the leaf: two different journeys',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-eco-choice">
        {[
          t('矿质元素路线', 'Mineral-element route'),
          t('能量路线', 'Energy route'),
        ].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={energy === Boolean(i)}
            onClick={() => {
              setEnergy(Boolean(i));
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
          viewBox="0 0 480 330"
          role="img"
          aria-label={word(
            mode,
            t(
              '落叶物质再利用或能量散热的四帧路线',
              'Four-stage matter reuse or energy dispersal route',
            ),
          )}
        >
          <RecyclePicture frame={flow.frame} energy={energy} mode={mode} />
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '矿质元素：落叶→微生物分解/利用→释放为土壤无机营养→根吸收；碳和二氧化碳等其他路线省略。能量：落叶化学能→分解者利用→活动→跟踪的一部分逐渐散为热。物质可换形式再利用，能量并非沿同一条路线循环。帧数不是天数，图不预测分解速度。',
          'Mineral element: litter → microbial breakdown/use → inorganic soil nutrients → root uptake; carbon/CO2 and other routes are omitted. Energy: leaf chemical energy → decomposer use → activities → gradual heat dispersal of the tracked portion. Matter can change form and be reused; energy does not cycle along this same route. Frames are not days and do not predict decomposition rates.',
        )}
      />
    </>
  );
}
function CascadeLab({ mode, onExplore }: Props) {
  const [ladybird, setLadybird] = useState(true),
    [birdLink, setBirdLink] = useState(true),
    flow = useFrames(3, onExplore);
  const links = gardenLinks(ladybird, birdLink),
    remaining = gardenConsumers('aphid', links);
  const list = t(
    remaining.map((v) => names[v].zh).join('、') || '图中没有保留的蚜虫捕食者',
    remaining.map((v) => names[v].en).join(', ') ||
      'No aphid predator remains in this graph',
  );
  const frames = [
    t(
      '先读初始网：植物供给植食者，瓢虫与鸟按图中关系取食。可切换本地瓢虫是否存在，或鸟是否也吃蚜虫。',
      'Read the initial web: plants supply feeders and ladybirds and birds feed along selected links. Toggle local ladybird presence or the bird–aphid link.',
    ),
    ladybird
      ? t(
          '直接联系保留：蚜虫→瓢虫仍在。没有人为改变数量；有箭头也不代表捕食量始终相同。',
          'Direct link retained: aphid → ladybird remains. No real abundance is changed; an arrow does not mean constant predation amount.',
        )
      : t(
          '直接变化：本地少了选定食蚜瓢虫，蚜虫失去这一种捕食联系。虚线和×是失去的旧关系。',
          'Direct change: the selected ladybird is locally absent, removing one aphid predation link. A dashed line and × show the lost relationship.',
        ),
    ladybird
      ? t(
          '继续检查：当前图没有移除瓢虫；仍需取食强度、繁殖和天气等信息，才能讨论数量变化。',
          'Keep checking: the ladybird has not been removed here. Feeding strength, reproduction and weather still matter for abundance changes.',
        )
      : birdLink
        ? t(
            '可能连锁：蚜虫失去一种捕食者，但仍有鸟的捕食路线。蚜虫可能变化，进而影响植物；鸟不一定完全补偿。',
            'Possible cascade: aphids lose one predator but retain the bird route. Aphids may change and affect plants; birds need not fully compensate.',
          )
        : t(
            '可能连锁：本图不再保留蚜虫捕食联系，其他条件合适时蚜虫可能增多、增加植物取食压力。但图没有包含全部真实捕食者。',
            'Possible cascade: this graph retains no aphid predator. Under suitable conditions, aphids may increase and exert more feeding pressure, but not all real predators are included.',
          ),
    t(
      '证据与局限：这是条件推理，不是数量预测。还需记录蚜虫与捕食者数量、取食、植物状态和天气；本地不见不等于全球灭绝。',
      'Evidence and limits: this is conditional reasoning, not an abundance forecast. Counts, feeding, plant condition and weather matter. Local absence does not imply global extinction.',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '改变一条关系，再检查整张网',
            'Change a link, then inspect the web',
          )}
        />
      </h3>
      <div
        className="bio-choice-row bio-eco-choice"
        aria-label={word(mode, t('瓢虫是否在本地', 'Local ladybird presence'))}
      >
        {[
          t('瓢虫在', 'Ladybird present'),
          t('瓢虫不在', 'Ladybird absent'),
        ].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={ladybird === !Boolean(i)}
            onClick={() => {
              setLadybird(!Boolean(i));
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
      <div
        className="bio-choice-row bio-eco-choice"
        aria-label={word(mode, t('另一条捕食关系', 'Another predation link'))}
      >
        {[
          t('鸟也吃蚜虫', 'Bird also eats aphids'),
          t('没有这条关系', 'No such bird link'),
        ].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={birdLink === !Boolean(i)}
            onClick={() => {
              setBirdLink(!Boolean(i));
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
          viewBox="0 0 480 350"
          role="img"
          aria-label={word(
            mode,
            t(
              '本地缺少瓢虫时剩余的取食关系',
              'Remaining feeding links when a local ladybird is absent',
            ),
          )}
        >
          <WebGraph
            mode={mode}
            links={links}
            absent={!ladybird}
            lost={!ladybird}
            possible={!ladybird && flow.frame >= 2}
          />
        </svg>
      </div>
      <div className="bio-eco-legend">
        <Text
          mode={mode}
          text={t(
            '蓝箭头：食物→取食者。×与虚线：失去的旧联系。问号：结果仍待证据。',
            'Blue: food → feeder. × and dashed line: lost link. ?: outcome needs evidence.',
          )}
        />
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            '图中蚜虫仍有的捕食者：',
            'Remaining aphid predators in the graph:',
          )}
        />{' '}
        <Text mode={mode} text={list} />
      </p>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={frames[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '移除选定瓢虫会删除蚜虫→瓢虫；鸟吃蚜虫这条关系可保留或省略。减少捕食可能改变蚜虫，并经蚜虫影响植物，但天气、繁殖、资源与其他关系仍重要。节点不是数量，模型没有保证增减或补偿，不用于真实移除或引入生物。',
          'Removing the selected ladybird deletes aphid → ladybird; bird feeding on aphids may remain or be omitted. Reduced predation may change aphids and then plants, alongside weather, reproduction, resources and other links. Nodes are not counts and the model guarantees neither population changes nor compensation. It is not a real species-removal or introduction activity.',
        )}
      />
    </>
  );
}
