import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  rootExchange,
  plantRoutes,
  leafExchange,
  flowerState,
  type RootCase,
  type PlantCargo,
  type Aperture,
  type AirMoisture,
  type PollenCase,
} from './vascularModel';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const blue = '#568998',
  green = '#6e855a',
  gold = '#b59548',
  pink = '#b97770';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Choices<T extends string>({
  mode,
  label,
  value,
  items,
  choose,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: T;
  items: readonly { value: T; name: LocalizedText }[];
  choose: (v: T) => void;
}) {
  return (
    <div
      className="bio-choice-row bio-vascular-choices"
      role="group"
      aria-label={word(mode, label)}
    >
      {items.map((item) => (
        <button
          key={item.value}
          aria-pressed={value === item.value}
          onClick={() => choose(item.value)}
        >
          <Text mode={mode} text={item.name} />
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
  height = 350,
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
      <title>{word(mode, title)}</title>
      <rect
        x="10"
        y="10"
        width="400"
        height={height - 20}
        rx="23"
        fill="#eff1e6"
      />
      {children}
    </svg>
  );
}
function Label({
  mode,
  text,
  x,
  y,
  size = 12,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill="#354832">
      {word(mode, text)}
    </text>
  );
}
function Arrow({
  from,
  to,
  color = blue,
  active = true,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  color?: string;
  active?: boolean;
}) {
  const dx = to[0] - from[0],
    dy = to[1] - from[1],
    a = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g opacity={active ? 1 : 0.22}>
      <path
        d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`}
        stroke={color}
        strokeWidth="3"
        strokeDasharray={active ? undefined : '4 5'}
        fill="none"
      />
      <path
        d="M0 0-10-5-10 5Z"
        fill={color}
        transform={`translate(${to[0]} ${to[1]}) rotate(${a})`}
      />
    </g>
  );
}
function Seedling() {
  return (
    <>
      <path d="M0 268h420v72H0Z" fill="#e6dcc7" />
      <path d="M210 265V52" stroke={green} strokeWidth="13" />
      <path
        d="M213 135Q240 70 331 82Q298 145 213 135Z"
        fill="#9eae80"
        stroke={green}
        strokeWidth="2"
      />
      <path
        d="M208 188Q177 124 91 139Q113 199 208 188Z"
        fill="#b4bf96"
        stroke={green}
        strokeWidth="2"
      />
      <path
        d="M215 128 316 90m-108 93-103-38"
        stroke="#e3edcf"
        strokeWidth="2"
      />
      <path
        d="M210 259v44m0-26-53 24m53-18 54 22m-58-16-22 38m24-36 26 34"
        fill="none"
        stroke={green}
        strokeWidth="5"
      />
      <path d="M210 63Q187 38 201 24Q223 39 210 63Z" fill="#abc391" />
      <path d="M210 63Q235 34 223 24Q208 36 210 63Z" fill="#b9cba1" />
    </>
  );
}
const rootCases = [
  { value: 'inward', name: t('土壤水势较高', 'Higher soil potential') },
  { value: 'equal', name: t('两侧相同', 'Equal potentials') },
  { value: 'outward', name: t('外侧水势较低', 'Lower outside potential') },
] as const;
function RootPicture({
  mode,
  condition,
  hair,
  frame,
}: {
  mode: LanguageMode;
  condition: RootCase;
  hair: boolean;
  frame: number;
}) {
  const state = rootExchange(condition),
    path = hair
      ? 'M110 82H205V280H110V205H42Q30 189 42 174H110Z'
      : 'M110 82H205V280H110Z';
  const membrane = hair
    ? 'M119 91H196V271H119V196H47Q40 189 47 183H119Z'
    : 'M119 91H196V271H119Z';
  const points = [
    [52, 189],
    [156, 189],
    [242, 189],
    [359, 189],
  ] as const;
  const dot =
    condition === 'inward'
      ? points[frame]!
      : condition === 'outward'
        ? ([frame === 0 ? 156 : 52, 189] as const)
        : ([93, 235] as const);
  return (
    <Scene
      mode={mode}
      title={t(
        '土壤到根中央的一条局部路线，非完整截面',
        'A local soil-to-central-root route, not a complete cross-section',
      )}
    >
      <rect x="19" y="62" width="88" height="238" rx="10" fill="#e6dcc7" />
      {[
        [38, 99],
        [64, 145],
        [77, 273],
        [35, 246],
      ].map((p, i) => (
        <ellipse key={i} cx={p[0]} cy={p[1]} rx="10" ry="7" fill="#c9b99d" />
      ))}
      <path d={path} fill="#dfe8cf" stroke={green} strokeWidth="4" />
      <path d={membrane} fill="none" stroke={pink} strokeWidth="2" />
      <rect
        x="215"
        y="83"
        width="51"
        height="196"
        rx="13"
        fill="#dce5c9"
        stroke={green}
      />
      <path d="M217 147h45m-45 84h45" stroke={green} />
      <rect
        x="282"
        y="83"
        width="32"
        height="196"
        rx="12"
        fill="#bdc99f"
        stroke={green}
      />
      <path d="M283 121h31m-31 125h31" stroke={gold} strokeWidth="7" />
      <rect
        x="338"
        y="83"
        width="41"
        height="196"
        rx="4"
        fill="#c5dce0"
        stroke={blue}
        strokeWidth="3"
      />
      <path
        d="M340 112h37m-37 42h37m-37 80h37m-37 24h37"
        stroke={blue}
        strokeWidth="2"
      />
      <Label mode={mode} text={t('土壤', 'Soil')} x={62} y={46} />
      <Label
        mode={mode}
        text={
          hair ? t('根毛细胞', 'Hair cell') : t('表皮细胞', 'Epidermal cell')
        }
        x={156}
        y={46}
      />
      <Label mode={mode} text={t('皮层', 'Cortex')} x={240} y={62} />
      <Label
        mode={mode}
        text={t('内皮层', 'Endodermis')}
        x={298}
        y={46}
        size={11}
      />
      <Label mode={mode} text={t('木质部', 'Xylem')} x={360} y={62} />
      {condition === 'inward' ? (
        <>
          <Arrow from={[55, 189]} to={[151, 189]} active={frame >= 1} />
          <Arrow from={[161, 189]} to={[242, 189]} active={frame >= 2} />
          <Arrow from={[250, 189]} to={[359, 189]} active={frame >= 3} />
        </>
      ) : condition === 'outward' ? (
        <Arrow from={[157, 189]} to={[53, 189]} active={frame >= 1} />
      ) : (
        <>
          <Arrow from={[54, 223]} to={[155, 223]} />
          <Arrow from={[155, 243]} to={[54, 243]} />
        </>
      )}
      <circle
        cx={dot[0]}
        cy={dot[1]}
        r="7"
        fill={blue}
        stroke="#fff"
        strokeWidth="2"
      />
      <path d="M119 260 141 298m-31-30-11 30" stroke={pink} />
      <Label
        mode={mode}
        text={t('壁 / 膜', 'Wall / membrane')}
        x={145}
        y={320}
      />
      <Label
        mode={mode}
        text={t(
          '净方向 ≠ 分子全部同向',
          'Net direction ≠ every molecule’s direction',
        )}
        x={263}
        y={304}
        size={11}
      />
      <desc>
        {word(
          mode,
          t(`净方向：${state.direction}`, `Net direction: ${state.direction}`),
        )}
      </desc>
    </Scene>
  );
}
function RootLab({ mode, onExplore }: Props) {
  const [condition, setCondition] = useState<RootCase>('inward'),
    [surface, setSurface] = useState<'hair' | 'smooth'>('hair');
  const flow = useFrames(3, onExplore);
  const cap =
    condition === 'inward'
      ? [
          t(
            '土壤总水势较高。图中水先在根外；不是根“吃土”。',
            'Soil total water potential is higher. Water starts outside the root; the root is not eating soil.',
          ),
          surface === 'hair'
            ? t(
                '水跨过根毛细胞膜净进入。根毛是细胞突起；细胞壁不替代膜。',
                'Net water movement crosses the root-hair membrane inward. The hair is a cell extension; the wall does not replace its membrane.',
              )
            : t(
                '水跨过表皮细胞膜净进入。无突起只是结构对照；细胞壁仍不替代膜。',
                'Net water movement crosses the epidermal-cell membrane inward. The smooth surface is a structural comparison; the wall still does not replace its membrane.',
              ),
          t(
            '水继续穿过皮层。真实根还有壁间与细胞内等并行路线，本图只跟一条。',
            'Water continues through cortex. Real roots have parallel wall-space and cell-interior routes; this diagram follows one.',
          ),
          t(
            '内皮层限制壁间绕行，进入中央运输区需经过膜的选择性环节，接入木质部。',
            'The endodermis restricts wall-space bypass. Entry into central transport tissues requires a selective membrane crossing and joins xylem.',
          ),
        ][flow.frame]!
      : condition === 'equal'
        ? t(
            '两侧总水势相同：没有水的净方向，但分子仍运动。此情境不展示向内的后续运输，也不计算实际整株的状态。',
            'Equal total potentials: no net water direction, while molecules still move. This case does not show onward inward transport or calculate a whole-plant state.',
          )
        : t(
            '外侧总水势较低：局部水可净流出根细胞。本情境不把它继续送入木质部；更大表面也不能反转差异。',
            'Outside total potential is lower: local net movement can be outward. This case does not send water onward into xylem; extra contact area cannot reverse the gradient.',
          );
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('小根毛，也有边界。', 'A tiny root hair has boundaries.')}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('水势情境', 'Water-potential case')}
        value={condition}
        items={rootCases}
        choose={(v) => {
          setCondition(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('接触表面对照', 'Contact-surface comparison')}
        value={surface}
        items={[
          { value: 'hair', name: t('有根毛', 'With root hair') },
          { value: 'smooth', name: t('无突起对照', 'Smooth comparison') },
        ]}
        choose={(v) => {
          setSurface(v);
          onExplore();
        }}
      />
      <div className="bio-vascular-window">
        <RootPicture
          mode={mode}
          condition={condition}
          hair={surface === 'hair'}
          frame={flow.frame}
        />
      </div>
      <div className="bio-vascular-readouts">
        <p>
          <Text
            mode={mode}
            text={
              condition === 'inward'
                ? t(
                    '总水势：土壤 > 根细胞',
                    'Total potential: soil > root cell',
                  )
                : condition === 'equal'
                  ? t(
                      '总水势：土壤 = 根细胞',
                      'Total potential: soil = root cell',
                    )
                  : t(
                      '总水势：外侧 < 根细胞',
                      'Total potential: outside < root cell',
                    )
            }
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={
              surface === 'hair'
                ? t(
                    '根毛增加接触表面；方向仍看条件。',
                    'A hair adds contact; direction still depends on conditions.',
                  )
                : t(
                    '结构对照：面积较少，不推算实际吸水量。',
                    'Structural comparison: less contact; no actual uptake quantity inferred.',
                  )
            }
          />
        </p>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={cap} />
      </p>
      <Notes
        mode={mode}
        text={t(
          '向内示例：土壤→根表皮细胞→皮层→内皮层→木质部。比较的是总水势，不是仅溶质浓度或表土湿度。均等箭头展示两侧仍可运动，不是逐分子计算。外侧较低只展示局部净流出。根毛/无突起是结构对照，不能预测速率或健康；内皮层只画一格，省略周鞘、完整截面与并行路线。四格不是实际时间，不需要改动盆栽照料。',
          'Inward example: soil → epidermal cell → cortex → endodermis → xylem. Cases compare total water potential, not solute concentration or visible surface moisture alone. Equal arrows indicate ongoing motion, not individual-molecule calculations. Lower outside potential shows local net outward movement only. Hair/smooth comparisons do not predict rates or health. One endodermal cell is shown; pericycle, full cross-section and parallel routes are omitted. Four views are not real time and require no changed plant care.',
        )}
      />
    </>
  );
}
const cargoChoices = [
  { value: 'water', name: t('水：根到叶', 'Water: root to leaf') },
  { value: 'leaf-sugar', name: t('糖：成熟叶到根', 'Sugar: leaf to root') },
  { value: 'store-sugar', name: t('糖：储存根到新芽', 'Sugar: store to bud') },
] as const;
const cargoPoints = {
  water: [
    [96, 295],
    [195, 259],
    [195, 183],
    [292, 111],
    [344, 49],
  ],
  'leaf-sugar': [
    [292, 111],
    [226, 147],
    [226, 209],
    [226, 272],
    [159, 306],
  ],
  'store-sugar': [
    [159, 306],
    [226, 271],
    [226, 195],
    [226, 75],
    [211, 42],
  ],
} as const;
function StemPicture({
  mode,
  cargo,
  frame,
}: {
  mode: LanguageMode;
  cargo: PlantCargo;
  frame: number;
}) {
  const p = cargoPoints[cargo],
    color = cargo === 'water' ? blue : gold,
    point = p[frame]!;
  return (
    <Scene
      mode={mode}
      title={t(
        '水与两种源库的独立运输路线',
        'Water and two separate source–sink routes',
      )}
    >
      <Seedling />
      <rect
        x="181"
        y="71"
        width="23"
        height="198"
        fill="#c5dce0"
        stroke={blue}
        strokeWidth="2"
      />
      <rect
        x="218"
        y="71"
        width="21"
        height="198"
        fill="#e7d8ae"
        stroke={gold}
        strokeWidth="2"
      />
      {[106, 150, 194, 238].map((y) => (
        <g key={y}>
          <path d={`M182 ${y}h21`} stroke={blue} />
          <path d={`M220 ${y}h16`} stroke={gold} strokeDasharray="2 3" />
        </g>
      ))}
      {p.slice(1).map((to, i) => (
        <Arrow key={i} from={p[i]!} to={to} color={color} active={frame > i} />
      ))}
      {cargo === 'water' && frame === 4 ? (
        <circle
          cx={point[0]}
          cy={point[1]}
          r="7"
          fill="none"
          stroke={blue}
          strokeWidth="2"
        />
      ) : (
        <circle
          cx={point[0]}
          cy={point[1]}
          r="7"
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
      )}
      <Label mode={mode} text={t('木质部', 'Xylem')} x={145} y={85} />
      <path d="M154 89 183 99" stroke={blue} />
      <Label mode={mode} text={t('韧皮部', 'Phloem')} x={277} y={204} />
      <path d="M247 201 233 191" stroke={gold} />
      <Label mode={mode} text={t('新芽', 'Bud')} x={153} y={42} />
      <Label mode={mode} text={t('成熟叶', 'Mature leaf')} x={335} y={155} />
      <Label
        mode={mode}
        text={t('根 / 储存部位', 'Root / store')}
        x={294}
        y={321}
      />
    </Scene>
  );
}
const stemCaptions: Record<PlantCargo, LocalizedText[]> = {
  water: [
    t(
      '土壤水是来源；本图追踪常见的根到叶路线。',
      'Soil water is the supply; this follows a common root-to-leaf route.',
    ),
    t(
      '水经根进入木质部，也可带着溶解矿质元素。',
      'Root water joins xylem and can carry dissolved minerals.',
    ),
    t(
      '木质部把根、茎与叶连接。水柱的内聚力帮助传递叶端蒸发产生的张力。',
      'Xylem links roots, stems and leaves. Cohesion helps transmit tension from leaf-end evaporation.',
    ),
    t(
      '水抵达叶脉并供给叶肉。不是所有水都只用来造糖。',
      'Water reaches leaf veins and mesophyll; sugar-making is not its only use.',
    ),
    t(
      '部分液态水在叶内蒸发，水蒸气离开叶片。空心圈表示气态，不是液滴挤过孔。',
      'Some liquid water evaporates inside leaves and vapour escapes. A hollow ring denotes vapour, not a drop squeezing through a pore.',
    ),
  ],
  'leaf-sugar': [
    t(
      '成熟叶在此情境是输出糖的源。图中糖代表以蔗糖等形式运输的有机物。',
      'The mature leaf is a source here. The marker represents organic material transported as sucrose and other forms.',
    ),
    t(
      '糖在源处装载进韧皮部。运输液也含水；金线不表示纯糖管。',
      'Sugars load into phloem at the source. Sap also contains water; this is not a pipe of pure sugar.',
    ),
    t(
      '此条筛管路线主流从源向根这个库。其他路线可同时去别处。',
      'This sieve-tube route has bulk flow from source toward the root sink; separate routes may serve other destinations.',
    ),
    t(
      '库处卸载，材料用于生长、呼吸或储存。',
      'Unloading at the sink supplies growth, respiration or storage.',
    ),
    t(
      '根是本情境的库；并非永远只接收糖。',
      'The root is a sink in this case, not permanently a sugar receiver.',
    ),
  ],
  'store-sugar': [
    t(
      '释放地下储备时，储存根可成为源；不是从土壤吸到糖。',
      'When mobilising underground reserves, a storage root can be a source; sugars are not absorbed from soil.',
    ),
    t(
      '储备转成可运输的糖，在源处进入韧皮部。',
      'Reserves are converted into transportable sugars and loaded into phloem.',
    ),
    t(
      '这条路线向上到新芽，仍然是源→库。与向下情境是不同的筛管路线。',
      'This route is upward toward a bud, still source → sink. It is a different sieve-tube route from the downward case.',
    ),
    t(
      '新芽处卸载材料，支持生长等细胞活动。',
      'Materials unload at the bud, supporting growth and other cellular activities.',
    ),
    t(
      '新芽是库。它以后形成成熟光合叶时，角色可能改变。',
      'The bud is a sink. Its role can later change as mature photosynthetic leaves form.',
    ),
  ],
};
function StemLab({ mode, onExplore }: Props) {
  const [cargo, setCargo] = useState<PlantCargo>('water');
  const flow = useFrames(4, onExplore),
    route = plantRoutes[cargo];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('先找货物，再找路线。', 'Find the cargo, then its route.')}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('运输情境', 'Transport case')}
        value={cargo}
        items={cargoChoices}
        choose={(v) => {
          setCargo(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-vascular-window">
        <StemPicture mode={mode} cargo={cargo} frame={flow.frame} />
      </div>
      <div className="bio-vascular-readouts">
        <p>
          <Text
            mode={mode}
            text={
              route.tissue === 'xylem'
                ? t('木质部：水与矿质元素', 'Xylem: water and minerals')
                : t('韧皮部：源 → 库', 'Phloem: source → sink')
            }
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={
              cargo === 'water'
                ? t(
                    '叶端蒸发与连续水柱相联系',
                    'Leaf evaporation connects to a continuous water column',
                  )
                : cargo === 'leaf-sugar'
                  ? t('源：成熟叶 · 库：根', 'Source: mature leaf · sink: root')
                  : t(
                      '源：储存根 · 库：新芽',
                      'Source: storage root · sink: bud',
                    )
            }
          />
        </p>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={stemCaptions[cargo][flow.frame]!} />
      </p>
      <Notes
        mode={mode}
        text={t(
          '水：土壤→根→木质部/茎→叶→部分变水蒸气到空气。糖：成熟叶→装载→韧皮部→卸载→根；另一情境为储存根→装载→韧皮部→卸载→新芽。两个糖情境选择独立的源库路线，不是同一根管里主流同时双向。中央双列为功能示意，不代表真实茎截面、颜色、速度或压力。省略源库多个分支、装载细节与木质部/韧皮部间水交换；不计算数量、树高或生长。',
          'Water: soil → root → xylem/stem → leaf → some vapour to air. Sugars: mature leaf → loading → phloem → unloading → root; another case is storage root → loading → phloem → unloading → bud. Sugar cases select independent source–sink routes, not simultaneous opposing bulk flow in one tube. The central lanes show functions rather than actual cross-section, colour, speed or pressure. Multiple sinks, loading details and water exchange between tissues are omitted; no amounts, tree heights or growth are calculated.',
        )}
      />
    </>
  );
}
function LeafPicture({
  mode,
  aperture,
  frame,
}: {
  mode: LanguageMode;
  aperture: Aperture;
  frame: number;
}) {
  const gap = aperture === 'open' ? 44 : 10;
  const waterX = aperture === 'open' ? 204 : 208,
    carbonX = aperture === 'open' ? 216 : 212;
  const vapour = [
      [140, 147],
      [155, 194],
      [waterX, 232],
      [waterX, 302],
    ] as const,
    carbon = [
      [carbonX, 306],
      [carbonX, 265],
      [carbonX, 205],
      [274, 142],
    ] as const,
    p = vapour[frame]!,
    c = carbon[frame]!;
  return (
    <Scene
      mode={mode}
      title={t(
        '叶片下表面局部截面：液态水、气隙与气孔',
        'Local lower-leaf cross-section: liquid water, air space and stoma',
      )}
    >
      <rect x="25" y="55" width="370" height="184" rx="12" fill="#dfe8cf" />
      <rect x="25" y="239" width="370" height="86" rx="12" fill="#e0ecec" />
      <path d="M40 147h86" stroke={blue} strokeWidth="15" />
      <path d="M40 137h86m-86 20h86" stroke={blue} strokeWidth="2" />
      <rect
        x="122"
        y="94"
        width="71"
        height="73"
        rx="20"
        fill="#b8c993"
        stroke={green}
        strokeWidth="3"
      />
      <rect
        x="231"
        y="88"
        width="101"
        height="83"
        rx="23"
        fill="#b8c993"
        stroke={green}
        strokeWidth="3"
      />
      <path d="M35 234H188m44 0h154" stroke={gold} strokeWidth="5" />
      <rect
        x="25"
        y="216"
        width={185 - gap / 2}
        height="24"
        fill="#a6b88a"
        stroke={green}
      />
      <rect
        x={210 + gap / 2}
        y="216"
        width={185 - gap / 2}
        height="24"
        fill="#a6b88a"
        stroke={green}
      />
      <ellipse
        cx={210 - gap / 2 - 15}
        cy="228"
        rx="15"
        ry="26"
        fill="#8da977"
        stroke={green}
        strokeWidth="2"
      />
      <ellipse
        cx={210 + gap / 2 + 15}
        cy="228"
        rx="15"
        ry="26"
        fill="#8da977"
        stroke={green}
        strokeWidth="2"
      />
      <Arrow from={[waterX, 181]} to={[waterX, 310]} active={frame >= 2} />
      <Arrow
        from={[carbonX, 310]}
        to={[carbonX, 183]}
        color={gold}
        active={frame >= 2}
      />
      <circle
        cx={p[0]}
        cy={p[1]}
        r="6"
        fill={frame === 0 ? blue : '#eff1e6'}
        stroke={blue}
        strokeWidth="2"
      />
      <circle cx={c[0]} cy={c[1]} r="6" fill={gold} stroke="#fff" />
      <Label mode={mode} text={t('叶内', 'Inside leaf')} x={58} y={40} />
      <Label
        mode={mode}
        text={t('细胞壁 / 液态水', 'Cell wall / liquid water')}
        x={256}
        y={68}
      />
      <Label
        mode={mode}
        text={t('叶内气隙', 'Internal air space')}
        x={303}
        y={198}
      />
      <Label mode={mode} text={t('叶脉', 'Vein')} x={70} y={121} />
      <Label mode={mode} text={t('保卫细胞', 'Guard cells')} x={86} y={269} />
      <Label mode={mode} text={t('外界空气', 'Outside air')} x={319} y={282} />
      <text x="160" y="323" fontSize="13" fill={blue}>
        H₂O ↓
      </text>
      <text x="235" y="323" fontSize="13" fill={gold}>
        CO₂ ↑
      </text>
    </Scene>
  );
}
function LeafLab({ mode, onExplore }: Props) {
  const [aperture, setAperture] = useState<Aperture>('open'),
    [air, setAir] = useState<AirMoisture>('drier');
  const flow = useFrames(3, onExplore),
    state = leafExchange(aperture, air);
  const caps = [
    t(
      '叶脉供水，细胞壁上的水是液体。外界CO₂是叶片制糖的碳来源。',
      'Veins supply water; cell-wall water is liquid. Air CO₂ supplies carbon for sugar-making.',
    ),
    t(
      '液态水蒸发到叶内气隙，蓝色标记变成空心的水蒸气圈；CO₂可穿孔进入。',
      'Water evaporates into internal air spaces, changing the blue marker to a hollow vapour ring. CO₂ can enter through the pore.',
    ),
    t(
      '本例水蒸气净向外、CO₂净向内。箭头是净趋势，不是每个分子的固定路线。',
      'Here vapour has net outward movement and CO₂ net inward movement. Arrows are net trends, not every molecule’s fixed path.',
    ),
    aperture === 'narrow'
      ? t(
          '较窄孔限制气孔通路：有助少失水，也限制CO₂进入。不是完全密封，模型不算速率。',
          'A narrower pore restricts access: it helps limit water loss and also restricts CO₂ entry. It is not a complete seal; no rates are calculated.',
        )
      : t(
          '较开孔提供较大气体通路；CO₂进入的同时也有水分取舍。真实开度还受多种信号调节。',
          'A wider pore offers greater gas access, with a water trade-off alongside CO₂ entry. Real opening responds to multiple signals.',
        ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '一扇小门，两种净方向。',
            'One small opening, two net directions.',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('设定孔隙', 'Imposed pore opening')}
        value={aperture}
        items={[
          { value: 'open', name: t('较开孔隙', 'Wider pore') },
          { value: 'narrow', name: t('较窄孔隙', 'Narrower pore') },
        ]}
        choose={(v) => {
          setAperture(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('同温空气对照', 'Same-temperature air comparison')}
        value={air}
        items={[
          { value: 'drier', name: t('较干空气', 'Drier air') },
          { value: 'humid', name: t('较湿空气', 'Humid air') },
        ]}
        choose={(v) => {
          setAir(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-vascular-window">
        <LeafPicture mode={mode} aperture={aperture} frame={flow.frame} />
      </div>
      <div className="bio-vascular-readouts">
        <p>
          <Text
            mode={mode}
            text={
              state.poreAccess === 'greater'
                ? t('气孔通路：较大', 'Pore access: greater')
                : t('气孔通路：受限', 'Pore access: restricted')
            }
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={
              state.vapourDifference === 'greater'
                ? t(
                    '叶内外水蒸气差：较大',
                    'Inside/outside vapour difference: greater',
                  )
                : t(
                    '叶内外水蒸气差：较小，仍向外',
                    'Inside/outside vapour difference: smaller, still outward',
                  )
            }
          />
        </p>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={caps[flow.frame]!} />
      </p>
      <Notes
        mode={mode}
        text={t(
          '水：叶脉→液态水在叶肉壁表面→蒸发→叶内气隙→气孔→空气。CO₂：空气→气孔→叶内→光合细胞。本例固定光、温度、风和叶内湿度，假设叶片净吸收CO₂；两种外界都比叶内水蒸气条件低。孔隙由按钮设定，不模拟自动调节；箭头和相同步数不代表通量。较湿空气减少差异，较窄孔限制通路，两个因素不可合并成实测排序。图示下表面只是一个例子；角质层及其他失水路线未画，缩小不意味失水归零。光合释放O₂及细胞呼吸未逐分子追踪。',
          'Water: vein → liquid at mesophyll walls → evaporation → internal air space → stoma → air. CO₂: air → stoma → interior → photosynthetic cells. Light, temperature, wind and internal humidity are fixed; the leaf is assumed to be a net CO₂ assimilator, with both outside cases below internal vapour conditions. Buttons impose openings rather than predict regulation. Arrows and equal steps do not measure flux. Humid air reduces the difference and a narrow pore restricts access; these are not combined into a measured ranking. The lower-surface example is not universal. Cuticle and other loss routes are omitted; narrowing is not zero loss. O₂ release and respiration are not traced molecule by molecule.',
        )}
      />
    </>
  );
}
function FlowerPicture({
  mode,
  pollen,
  frame,
}: {
  mode: LanguageMode;
  pollen: PollenCase;
  frame: number;
}) {
  const state = flowerState(pollen, frame),
    pollenX = frame === 0 ? 97 : 210,
    pollenY = frame === 0 ? 100 : 74;
  return (
    <Scene
      mode={mode}
      title={t(
        '花粉留在柱头，管递送精细胞，胚珠形成种子',
        'Pollen stays at stigma; tube delivers sperm; ovule develops into seed',
      )}
    >
      <path d="M210 320V275" stroke={green} strokeWidth="8" />
      {state.fruit ? (
        <>
          <path
            d="M157 165Q118 220 159 278Q258 300 297 176Q230 133 157 165Z"
            fill="#9eae80"
            stroke={green}
            strokeWidth="3"
          />
          <ellipse
            cx="211"
            cy="228"
            rx="29"
            ry="35"
            fill="#ddcf97"
            stroke={gold}
            strokeWidth="3"
          />
          <path d="M212 246q-24-20-8-40q24 3 8 40Z" fill={green} />
          <Label
            mode={mode}
            text={t('果荚 / 果实', 'Pod / fruit')}
            x={94}
            y={199}
          />
          <Label
            mode={mode}
            text={t('种子 / 胚', 'Seed / embryo')}
            x={326}
            y={268}
          />
        </>
      ) : (
        <>
          <path
            d="M160 168Q58 148 110 62Q191 62 209 170Q225 40 303 59Q371 141 264 179Q307 285 223 285Q148 298 160 168Z"
            fill="#e7ced5"
            opacity="0.7"
          />
          <ellipse
            cx="210"
            cy="232"
            rx="57"
            ry="57"
            fill="#d2dfb8"
            stroke={green}
            strokeWidth="3"
          />
          <rect
            x="198"
            y="87"
            width="24"
            height="96"
            rx="11"
            fill="#d2dfb8"
            stroke={green}
            strokeWidth="2"
          />
          <ellipse
            cx="210"
            cy="83"
            rx="31"
            ry="10"
            fill="#95aa7c"
            stroke={green}
          />
          <path d="M97 174V111m226 58V110" stroke={green} strokeWidth="4" />
          <ellipse cx="97" cy="103" rx="15" ry="10" fill={gold} />
          <ellipse cx="323" cy="103" rx="15" ry="10" fill={gold} />
          <ellipse
            cx="211"
            cy="237"
            rx="22"
            ry="29"
            fill="#f0ecd4"
            stroke={gold}
            strokeWidth="2"
          />
          <circle
            cx="211"
            cy="244"
            r={state.eggFusion ? 8 : 6}
            fill={state.eggFusion ? green : pink}
          />
          {state.tube && (
            <path
              d="M210 79Q202 119 210 170Q238 203 221 218L211 237"
              stroke={gold}
              strokeWidth="5"
              fill="none"
            />
          )}
          {state.spermInTube && (
            <circle cx="220" cy="217" r="5" fill={pink} stroke="#fff" />
          )}
          <circle
            cx={pollenX}
            cy={pollenY}
            r="7"
            fill={pollen === 'compatible' ? gold : '#ad98b7'}
            stroke="#fff"
          />
          {frame === 0 && (
            <Arrow from={[113, 91]} to={[196, 75]} color={gold} />
          )}
          {pollen === 'incompatible' && frame >= 2 && (
            <>
              <path
                d="m247 62 14 14m-14 0 14-14"
                stroke={pink}
                strokeWidth="3"
              />
              <Label mode={mode} text={t('未长管', 'No tube')} x={305} y={64} />
            </>
          )}
          <Label mode={mode} text={t('花药', 'Anther')} x={75} y={140} />
          <Label mode={mode} text={t('柱头', 'Stigma')} x={210} y={46} />
          <Label mode={mode} text={t('花柱', 'Style')} x={265} y={141} />
          <Label mode={mode} text={t('子房', 'Ovary')} x={124} y={266} />
          <Label mode={mode} text={t('胚珠', 'Ovule')} x={289} y={241} />
          <Label
            mode={mode}
            text={state.eggFusion ? t('受精卵', 'Zygote') : t('卵', 'Egg')}
            x={293}
            y={268}
          />
        </>
      )}
      <Label
        mode={mode}
        text={t(
          '一枚胚珠的示例；其余省略',
          'One ovule tracked; others omitted',
        )}
        x={210}
        y={337}
        size={11}
      />
    </Scene>
  );
}
function FlowerLab({ mode, onExplore }: Props) {
  const [pollen, setPollen] = useState<PollenCase>('compatible');
  const flow = useFrames(5, onExplore);
  const stages = [
    t(
      '花药产生花粉；花粉粒不是种子。',
      'Anthers produce pollen; the grain is not a seed.',
    ),
    t(
      '花粉到达柱头：这是传粉。相容性与后续过程还需要确认。',
      'Pollen reaches the stigma: pollination. Compatibility and later processes still need checking.',
    ),
    t(
      '成功情境中，相容花粉萌发长出花粉管，经花柱向胚珠。花粉粒留在柱头。',
      'In the successful case, compatible pollen germinates a tube through the style toward the ovule. The grain stays at the stigma.',
    ),
    t(
      '管递送精细胞到胚珠。粉粒、管与精细胞是不同结构；图中小红点只追踪一个精细胞。',
      'The tube delivers sperm to the ovule. Grain, tube and sperm are different structures; the small red marker tracks one sperm.',
    ),
    t(
      '一个精细胞与卵融合成受精卵。另一个与中央细胞融合的双受精环节见进阶说明。',
      'One sperm fuses with the egg to form a zygote. See Depth for the other fusion with the central cell.',
    ),
    t(
      '假设后续成功发育：胚珠成为种子，子房成为果实；受精卵发展成胚。不是花粉整粒变成种子。',
      'Assuming successful development: ovule → seed, ovary → fruit, zygote → embryo. The whole pollen grain does not become a seed.',
    ),
  ];
  const cap =
    pollen === 'incompatible' && flow.frame >= 2
      ? t(
          '本例不相容花粉虽到达柱头，却没有成功长管，所以没有递送、融合与种子分支。停留不等于成功。',
          'In this incompatible case, deposited pollen does not grow a successful tube. There is no delivery, fusion or seed branch. Landing is not success.',
        )
      : stages[flow.frame]!;
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '到达之后，还有几道关。',
            'After arrival, more stages remain.',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('花粉情境', 'Pollen case')}
        value={pollen}
        items={[
          {
            value: 'compatible',
            name: t('相容并成功情境', 'Compatible successful case'),
          },
          { value: 'incompatible', name: t('不相容情境', 'Incompatible case') },
        ]}
        choose={(v) => {
          setPollen(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-vascular-window">
        <FlowerPicture mode={mode} pollen={pollen} frame={flow.frame} />
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={cap} />
      </p>
      <Notes
        mode={mode}
        text={t(
          '花药→花粉到柱头（传粉）→相容条件下管生长→精细胞递送→与卵融合→后续种子/果实发育。相容分支假设后续条件适宜，不表示现实必然成功；不相容分支停在柱头。花粉粒留在柱头，精细胞沿管递送；主图只跟双受精中的精–卵融合，中央细胞与另一个精细胞省略。一个胚珠/种子是局部追踪，不预测种子数。豌豆常可自花传粉；访花动物不是本课必需步骤。帧数不代表时间、产量或活力概率。',
          'Anther → pollen reaches stigma (pollination) → compatible tube growth → sperm delivery → egg fusion → later seed/fruit development. The compatible branch assumes suitable subsequent conditions rather than guaranteed real success; the incompatible branch stops at the stigma. The grain stays while sperm travels along its tube. Only sperm–egg fusion is tracked; the central cell and other sperm are omitted. One ovule/seed does not predict yield. Peas commonly self-pollinate; an animal visitor is not a necessary model stage. Frames do not measure time, yield or viability probability.',
        )}
      />
    </>
  );
}
export function VascularExplore(props: Props) {
  return (
    <div className="bio-vascular-lab">
      {props.id === 'L041' ? (
        <RootLab {...props} />
      ) : props.id === 'L042' ? (
        <StemLab {...props} />
      ) : props.id === 'L043' ? (
        <LeafLab {...props} />
      ) : (
        <FlowerLab {...props} />
      )}
    </div>
  );
}
export function VascularHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  if (id === 'L043')
    return <LeafPicture mode={mode} aperture="open" frame={2} />;
  if (id === 'L044')
    return <FlowerPicture mode={mode} pollen="compatible" frame={1} />;
  if (id === 'L042') return <StemPicture mode={mode} cargo="water" frame={3} />;
  return (
    <Scene
      mode={mode}
      title={t('根、茎、叶与土壤水的联系', 'Roots, stem, leaf and soil water')}
    >
      <Seedling />
      <Arrow from={[125, 294]} to={[202, 270]} />
      <Arrow from={[198, 253]} to={[198, 157]} />
      <Arrow from={[218, 129]} to={[292, 105]} />
      <Label
        mode={mode}
        text={t('水从哪里来？', 'Where does water come from?')}
        x={125}
        y={78}
      />
      <Label
        mode={mode}
        text={t('根毛是细胞的一部分', 'A root hair is part of a cell')}
        x={210}
        y={333}
      />
    </Scene>
  );
}
const clueTexts: Record<string, LocalizedText[]> = {
  L041: [
    t(
      '根毛：表皮细胞的突起，增加接触表面。',
      'Root hair: an epidermal-cell extension adding contact surface.',
    ),
    t(
      '膜：水跨过的选择性边界；方向看两侧总水势。',
      'Membrane: a selective boundary; direction depends on total potentials.',
    ),
    t(
      '木质部：接入茎与叶的水运输路线。',
      'Xylem: joins water routes toward stems and leaves.',
    ),
  ],
  L042: [
    t(
      '木质部：水与溶解矿质元素的常见向上路线。',
      'Xylem: a common upward route for water and dissolved minerals.',
    ),
    t(
      '韧皮部：蔗糖等有机物从源到库。',
      'Phloem: sucrose and other organic materials from source to sink.',
    ),
    t(
      '源/库是功能：成熟叶、根和芽可随条件改变角色。',
      'Source/sink are roles; leaves, roots and buds can change with conditions.',
    ),
  ],
  L043: [
    t(
      '叶脉供液态水，部分在细胞壁表面蒸发。',
      'Veins supply liquid water; some evaporates at cell walls.',
    ),
    t(
      '保卫细胞调节孔隙，连接叶内气隙与空气。',
      'Guard cells regulate the pore connecting internal air spaces to outside.',
    ),
    t(
      '净吸收CO₂的叶：CO₂进、水蒸气出；并非每时刻都如此。',
      'A net CO₂-assimilating leaf: CO₂ in, vapour out; not every moment is identical.',
    ),
  ],
  L044: [
    t(
      '花药产生花粉；柱头是花粉到达处。',
      'Anthers produce pollen; the stigma receives it.',
    ),
    t(
      '管递送精细胞；卵在胚珠内，花粉粒不是卵。',
      'A tube delivers sperm; the egg is in the ovule, not a pollen grain.',
    ),
    t(
      '成功发育：胚珠→种子、子房→果实。',
      'Successful development: ovule → seed; ovary → fruit.',
    ),
  ],
};
export function VascularDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    caption = useId();
  return (
    <figure className="bio-vascular-diagram" aria-describedby={caption}>
      <VascularHookArt id={id} mode={mode} />
      <div className="bio-choice-row bio-vascular-choices">
        {(clueTexts[id] ?? clueTexts.L041!).map((_, i) => (
          <button key={i} aria-pressed={clue === i} onClick={() => setClue(i)}>
            <Text mode={mode} text={t(`线索 ${i + 1}`, `Clue ${i + 1}`)} />
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={(clueTexts[id] ?? clueTexts.L041!)[clue]!} />
      </figcaption>
    </figure>
  );
}
