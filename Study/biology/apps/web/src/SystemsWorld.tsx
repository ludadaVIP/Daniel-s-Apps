import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  digestiveState,
  gasPressure,
  sphereSurface,
  bloodPaths,
  deliveryLinks,
  newDelivery,
  type FoodMaterial,
  type Gas,
  type PressureCase,
  type Cargo,
  type HiddenLink,
  type BloodStation,
} from './systemsModel';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const w = (mode: LanguageMode, value: LocalizedText) =>
  mode === 'en' ? value.en : value.zh;
const blue = '#568998',
  gold = '#b59548',
  red = '#b97770',
  green = '#6e855a';
function Choices<T extends string | number>({
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
      className="bio-choice-row bio-systems-choices"
      role="group"
      aria-label={w(mode, label)}
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
  height = 340,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  children: ReactNode;
  height?: number;
}) {
  return (
    <svg viewBox={`0 0 420 ${height}`} role="img" aria-label={w(mode, title)}>
      <title>{w(mode, title)}</title>
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
    <text x={x} y={y} textAnchor="middle" fill="#55664c" fontSize={size}>
      {w(mode, text)}
    </text>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = blue,
  active = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  active?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1),
    d = 8;
  return (
    <g
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      opacity={active ? 1 : 0.25}
      strokeDasharray={active ? undefined : '4 5'}
    >
      <path d={`M${x1} ${y1}L${x2} ${y2}`} />
      <path
        d={`M${x2 - d * Math.cos(angle - 0.5)} ${y2 - d * Math.sin(angle - 0.5)}L${x2} ${y2}L${x2 - d * Math.cos(angle + 0.5)} ${y2 - d * Math.sin(angle + 0.5)}`}
      />
    </g>
  );
}
const foodNames = [
  { value: 'starch', name: t('淀粉 · 米饭', 'Starch · rice') },
  { value: 'protein', name: t('蛋白质 · 豆腐', 'Protein · tofu') },
  { value: 'fibre', name: t('纤维示例 · 蔬菜', 'Fibre example · vegetables') },
] as const;
const digestiveStages = [
  t('口：咀嚼和唾液', 'Mouth: chewing and saliva'),
  t('食管：推进', 'Oesophagus: propulsion'),
  t('胃：混合与消化', 'Stomach: mixing and digestion'),
  t('小肠：继续分解', 'Small intestine: further breakdown'),
  t('跨壁吸收或继续入大肠', 'Absorption or onward to colon'),
  t('肝的入口或大肠内容', 'Liver entrance or colon contents'),
];
const productNames = {
  glucose: t('葡萄糖', 'Glucose'),
  'amino-acids': t('氨基酸', 'Amino acids'),
  fibre: t('本例纤维', 'Example fibre'),
};
function DigestCanvas({
  mode,
  material,
  frame,
}: {
  mode: LanguageMode;
  material: FoodMaterial;
  frame: number;
}) {
  const state = digestiveState(material, frame);
  const positions = [
    [76, 58],
    [76, 98],
    [100, 151],
    [98, 228],
    [98, 228],
    [98, 285],
  ];
  const pos = positions[state.stage]!;
  return (
    <Scene
      mode={mode}
      title={t(
        '消化道与小肠壁示意',
        'Digestive tract and intestinal wall schematic',
      )}
      height={360}
    >
      <path
        d="M76 56v65q65-16 53 40q-4 25-34 26v17"
        stroke={red}
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M65 215h66q14 0 14 12t-14 12H65q-14 0-14 12t14 12h66"
        stroke={gold}
        strokeWidth="10"
        fill="none"
      />
      <path
        d="M43 201v85h110v-80M99 286v27"
        stroke={green}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={pos[0]}
        cy={pos[1]}
        r="9"
        fill={gold}
        stroke="white"
        strokeWidth="3"
      />
      <Label mode={mode} text={t('食物通道', 'Gut passage')} x={92} y={337} />
      <Label mode={mode} text={t('小肠内', 'Gut lumen')} x={224} y={40} />
      <Label mode={mode} text={t('肠壁', 'Gut wall')} x={301} y={40} />
      <Label mode={mode} text={t('血管', 'Vessel')} x={370} y={40} />
      <path
        d="M286 75v208q0 13 14 13t14-13V75"
        fill="#dfdfb8"
        stroke={green}
        strokeWidth="2"
      />
      <rect
        x="344"
        y="70"
        width="52"
        height="225"
        rx="22"
        fill="#ecd2cb"
        stroke={red}
        strokeWidth="2"
      />
      <path
        d="M352 93v176"
        stroke={red}
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = state.absorbed ? 368 : 225 + (i % 2) * 24,
          y = 120 + Math.floor(i / 2) * 29;
        return (
          <g key={i}>
            {(state.form === 'chain' ||
              (state.form === 'fragments' && i % 2 === 0)) &&
              i < 5 && (
                <line
                  x1={x}
                  y1={y}
                  x2={i % 2 === 0 ? x + 24 : x - 24}
                  y2={i % 2 === 0 ? y : y + 29}
                  stroke={gold}
                  strokeWidth="3"
                />
              )}
            <circle data-material-marker={i} cx={x} cy={y} r="8" fill={gold} />
          </g>
        );
      })}
      {material !== 'fibre' ? (
        <Arrow
          x1={253}
          y1={226}
          x2={358}
          y2={226}
          color={gold}
          active={state.absorbed}
        />
      ) : (
        <>
          <Arrow
            x1={234}
            y1={219}
            x2={234}
            y2={275}
            color={green}
            active={frame >= 4}
          />
          <Label
            mode={mode}
            text={t('继续入大肠', 'Onward to colon')}
            x={231}
            y={311}
          />
        </>
      )}
      <Label
        mode={mode}
        text={
          state.form === 'units' || material === 'fibre'
            ? productNames[state.product]
            : material === 'starch'
              ? t('淀粉片段', 'Starch fragments')
              : state.form === 'chain'
                ? t('蛋白质', 'Protein')
                : t('肽片段', 'Peptide fragments')
        }
        x={state.absorbed ? 370 : 226}
        y={state.absorbed ? 318 : 89}
      />
      <Label
        mode={mode}
        text={t('分子与器官不按比例', 'Not to anatomical / molecular scale')}
        x={252}
        y={340}
        size={10}
      />
    </Scene>
  );
}
function DigestLab({ id, mode, onExplore }: Props) {
  const [material, setMaterial] = useState<FoodMaterial>('starch');
  const flow = useFrames(5, onExplore),
    state = digestiveState(material, flow.frame);
  const messages =
    material === 'fibre'
      ? [
          t(
            '人的酶不能消化本例纤维；它不沿葡萄糖支路进入血。',
            'Human enzymes cannot digest this example fibre; it does not take the glucose-to-blood branch.',
          ),
          t(
            '纤维随食物通道推进，不是整条进入血。',
            'Fibre moves along the gut passage rather than entering blood as a chain.',
          ),
          t(
            '胃的混合不等于把所有纤维化学分解。',
            'Stomach mixing does not chemically digest all fibre.',
          ),
          t(
            '本例纤维没有被人的酶变成可吸收单体。',
            'The example fibre has not become absorbable units through human enzymes.',
          ),
          t(
            '继续入大肠，不画完整纤维跨进血管。',
            'The route continues to the colon, not intact fibre crossing into vessels.',
          ),
          t(
            '部分膳食纤维可由微生物发酵；水等物质吸收与粪便去向另有过程。',
            'Some dietary fibre is fermented by microbes; water absorption and faecal elimination involve other processes.',
          ),
        ]
      : material === 'starch'
        ? [
            t(
              '咀嚼改变碎块，唾液淀粉酶开始分解；不是全部已变葡萄糖。',
              'Chewing changes pieces; salivary amylase starts breakdown, not complete glucose production.',
            ),
            t(
              '食管推进食团，运输不等于吸收。',
              'The oesophagus propels a bolus; movement is not absorption.',
            ),
            t(
              '胃混合食物；酸性条件限制唾液淀粉酶，糖消化还未完成。',
              'The stomach mixes food; acid limits salivary amylase and carbohydrate digestion is not complete.',
            ),
            t(
              '小肠多种酶继续分解，最终提供葡萄糖等可吸收产物。',
              'Several intestinal enzymes continue breakdown to absorbable products including glucose.',
            ),
            t(
              '葡萄糖经上皮转运进入毛细血管。箭头跨肠壁才是吸收。',
              'Glucose crosses epithelium into capillaries; wall crossing is absorption.',
            ),
            t(
              '本例进入血的葡萄糖先沿门静脉到肝；图内血管代表小肠侧，肝未按比例画出。',
              'Absorbed glucose first travels via portal blood to liver; the drawn vessel is intestinal and liver anatomy is omitted.',
            ),
          ]
        : [
            t(
              '咀嚼使食物碎块变小；不代表蛋白质链已经成为氨基酸。',
              'Chewing makes smaller food pieces, not necessarily amino-acid units.',
            ),
            t(
              '食管推进，不把蛋白质整链送入血。',
              'Oesophageal propulsion does not send intact protein chains into blood.',
            ),
            t(
              '胃内酸与酶参与蛋白质处理，产生较小片段。',
              'Stomach acid and enzymes process proteins into smaller fragments.',
            ),
            t(
              '小肠继续分解并提供氨基酸；珠子数量只是示意。',
              'Intestinal breakdown provides amino acids; bead numbers are schematic.',
            ),
            t(
              '氨基酸经肠壁进入血液，供组装与其他用途。',
              'Amino acids cross the wall into blood for assembly and other uses.',
            ),
            t(
              '血液先把吸收的氨基酸带到肝，再分配；不是直接变成肌肉。',
              'Absorbed amino acids first reach liver in blood before distribution, rather than becoming muscle directly.',
            ),
          ];
  return (
    <div className="bio-systems-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '分子旅程：在通道内，还是跨壁？',
            'Molecule journey: passage or wall crossing?',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('追踪材料', 'Material to follow')}
        value={material}
        items={foodNames}
        choose={(v) => {
          setMaterial(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-systems-window">
        <DigestCanvas mode={mode} material={material} frame={flow.frame} />
      </div>
      <p className="bio-systems-stage">
        <Text mode={mode} text={digestiveStages[flow.frame]!} />
      </p>
      <p className="bio-frame-caption" aria-live="polite">
        <Text mode={mode} text={messages[flow.frame]!} />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          `六个金珠是示意材料，不是一个饭粒的真实分子数。当前去向：${state.destination === 'lumen' ? '食物通道' : state.destination === 'blood' ? '小肠侧血管' : state.destination === 'liver' ? '肝的入口' : '大肠'}。模型压缩分解，省略真实时间、产量、肠壁转运机制与肝处理。纤维的微生物发酵不画在人的酶支路；脂类常先入淋巴，不能套用本例路线。`,
          `Six gold beads are schematic, not molecule counts. Current destination: ${state.destination}. Breakdown is compressed; time, yield, epithelial transport details and liver processing are omitted. Microbial fibre fermentation is distinct from human enzymes; many lipids enter lymph first.`,
        )}
      />
    </div>
  );
}
const surfaceItems = [
  { value: 1, name: t('一个大球', 'One large sphere') },
  { value: 8, name: t('八个小球', 'Eight small spheres') },
] as const;
const gasItems = [
  { value: 'oxygen', name: t('氧 O₂', 'Oxygen O₂') },
  { value: 'carbon', name: t('二氧化碳 CO₂', 'Carbon dioxide CO₂') },
] as const;
const pressureItems = [
  { value: 'usual', name: t('通常方向', 'Usual direction') },
  { value: 'equal', name: t('分压相同', 'Equal pressures') },
  { value: 'reversed', name: t('假设反向', 'Hypothetical reversal') },
] as const;
function ExchangeCanvas({
  mode,
  gas,
  scenario,
  frame,
}: {
  mode: LanguageMode;
  gas: Gas;
  scenario: PressureCase;
  frame: number;
}) {
  const p = gasPressure(gas, scenario);
  const forward = p.net === 'air-to-blood',
    balanced = p.net === 'balanced';
  const source = forward ? 105 : 314,
    dest = forward ? 314 : 105;
  return (
    <Scene
      mode={mode}
      title={t(
        '肺泡空气与血之间的分压与交换',
        'Partial pressure and exchange between alveolar air and blood',
      )}
    >
      <rect
        x="45"
        y="60"
        width="135"
        height="180"
        rx="55"
        fill="#d5e3e4"
        stroke={blue}
        strokeWidth="2"
      />
      <rect
        x="250"
        y="60"
        width="125"
        height="180"
        rx="24"
        fill="#ecd2cb"
        stroke={red}
        strokeWidth="2"
      />
      <path d="M202 55v191M211 55v191" stroke={green} strokeWidth="3" />
      <Label mode={mode} text={t('肺泡空气', 'Alveolar air')} x={111} y={40} />
      <Label
        mode={mode}
        text={t('流入肺的血', 'Incoming lung blood')}
        x={313}
        y={40}
      />
      <text x="111" y="98" textAnchor="middle" fill={blue} fontSize="22">
        {p.air} p
      </text>
      <text x="313" y="98" textAnchor="middle" fill={red} fontSize="22">
        {p.blood} p
      </text>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={balanced ? 105 + i * 104 : source + (dest - source) * (frame / 3)}
          cy={132 + i * 27}
          r="8"
          fill={gas === 'oxygen' ? blue : gold}
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {!balanced && (
        <Arrow
          x1={forward ? 145 : 275}
          y1={215}
          x2={forward ? 275 : 145}
          y2={215}
          color={gas === 'oxygen' ? blue : gold}
          active={frame > 0}
        />
      )}
      <Label
        mode={mode}
        text={t(
          '薄屏障：肺泡壁 + 毛细血管壁',
          'Thin barrier: alveolar + capillary walls',
        )}
        x={210}
        y={271}
        size={11}
      />
      <Label
        mode={mode}
        text={t(
          'p为虚构分压单位；只示净趋势',
          'p is an invented pressure unit; net tendency only',
        )}
        x={210}
        y={300}
        size={10}
      />
    </Scene>
  );
}
function LungLab({ id, mode, onExplore }: Props) {
  const [count, setCount] = useState<1 | 8>(8),
    [gas, setGas] = useState<Gas>('oxygen'),
    [scenario, setScenario] = useState<PressureCase>('usual');
  const flow = useFrames(3, onExplore),
    shape = sphereSurface(count),
    p = gasPressure(gas, scenario);
  const result =
    p.net === 'balanced'
      ? t(
          '净交换为零；分子仍在随机运动。',
          'Zero net exchange; molecules still move randomly.',
        )
      : p.net === 'air-to-blood'
        ? t('净趋势：肺泡空气 → 血液', 'Net tendency: alveolar air → blood')
        : t('净趋势：血液 → 肺泡空气', 'Net tendency: blood → alveolar air');
  return (
    <div className="bio-systems-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '同样体积，比较交换表面',
            'Same volume: compare exchange surface',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('球模型', 'Sphere model')}
        value={count}
        items={surfaceItems}
        choose={(v) => {
          setCount(v);
          onExplore();
        }}
      />
      <div className="bio-systems-spheres">
        <svg
          viewBox="0 0 420 140"
          role="img"
          aria-label={w(
            mode,
            t(
              '同体积三维球的二维示意',
              'Two-dimensional drawings of equal-volume 3D spheres',
            ),
          )}
        >
          {count === 1 ? (
            <circle
              cx="210"
              cy="65"
              r="44"
              fill="#d5e3e4"
              stroke={blue}
              strokeWidth="2"
            />
          ) : (
            Array.from({ length: 8 }, (_, i) => (
              <circle
                key={i}
                cx={110 + (i % 4) * 67}
                cy={36 + Math.floor(i / 4) * 56}
                r="22"
                fill="#d5e3e4"
                stroke={blue}
                strokeWidth="2"
              />
            ))
          )}
          <Label
            mode={mode}
            text={t(
              '画的是球，不是独立完整肺泡',
              'Spheres, not separate complete alveoli',
            )}
            x={210}
            y={130}
            size={10}
          />
        </svg>
        <p>
          <Text
            mode={mode}
            text={t(
              `总体积 1× · 总表面 ${shape.areaRatio}× · 半径 ${shape.radius} r`,
              `Total volume 1× · surface ${shape.areaRatio}× · radius ${shape.radius} r`,
            )}
          />
        </p>
      </div>
      <h3>
        <Text
          mode={mode}
          text={t(
            '同一薄壁，两种气体各有方向',
            'One thin wall: each gas has its own direction',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('气体', 'Gas')}
        value={gas}
        items={gasItems}
        choose={(v) => {
          setGas(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('分压比较', 'Pressure comparison')}
        value={scenario}
        items={pressureItems}
        choose={(v) => {
          setScenario(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-systems-window">
        <ExchangeCanvas
          mode={mode}
          gas={gas}
          scenario={scenario}
          frame={flow.frame}
        />
      </div>
      <p className="bio-systems-stage" aria-live="polite">
        <Text mode={mode} text={result} />
      </p>
      <p className="bio-frame-caption">
        <Text
          mode={mode}
          text={
            [
              t(
                '看同一种气体两侧的分压差。数值不是身体测量。',
                'Compare one gas’s partial pressures; values are not body measurements.',
              ),
              t(
                '气体跨薄屏障，而不是空气整团进入血。',
                'Gas crosses the thin barrier, rather than a whole air pocket entering blood.',
              ),
              t(
                '通气更新空气，血流更新血侧；动画不计算速度。',
                'Ventilation renews air and blood flow renews the blood side; speed is not calculated.',
              ),
              t(
                '净箭头不是每个分子的轨迹；面积不能单独给出实际交换速率。',
                'A net arrow is not every molecule’s trace; surface alone gives no real exchange rate.',
              ),
            ][flow.frame]!
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '单球半径2r，八球各r：体积同为32πr³/3，表面从16πr²到32πr²。只比较球几何，省略真实肺泡形状。虚构p不代表浓度、人体值或疾病。两侧分压固定，只示方向，不计算随交换均衡。平衡时三点为物质存在的示意，不是静止轨迹。',
          'One 2r sphere and eight r spheres each total 32πr³/3 volume; area changes from 16πr² to 32πr². This is sphere geometry, omitting actual alveolar shape. Invented p represents neither concentration, personal values nor disease. Pressures remain fixed; equilibration is not calculated. At balance, dots indicate presence rather than stationary particle trajectories.',
        )}
      />
    </div>
  );
}
const cargoItems = [
  { value: 'oxygen', name: t('氧的旅程', 'Oxygen journey') },
  { value: 'glucose', name: t('葡萄糖的旅程', 'Glucose journey') },
  { value: 'carbon', name: t('CO₂碳的回程', 'CO₂ carbon return') },
] as const;
const stationNames: Record<BloodStation, LocalizedText> = {
  air: t('肺泡空气', 'Alveolar air'),
  lung: t('肺毛细血管', 'Lung capillaries'),
  'pulmonary-vein': t('肺静脉', 'Pulmonary vein'),
  'left-heart': t('左心', 'Left heart'),
  'systemic-artery': t('体动脉', 'Systemic arteries'),
  tissue: t('组织毛细血管', 'Tissue capillaries'),
  cell: t('身体细胞', 'Body cell'),
  gut: t('小肠毛细血管', 'Gut capillaries'),
  portal: t('门静脉', 'Portal vein'),
  liver: t('肝', 'Liver'),
  'systemic-vein': t('体静脉', 'Systemic veins'),
  'right-heart': t('右心', 'Right heart'),
  'pulmonary-artery': t('肺动脉', 'Pulmonary artery'),
};
const stationShort: Record<BloodStation, LocalizedText> = {
  ...stationNames,
  lung: t('肺血管', 'Lung cap.'),
  tissue: t('组织血管', 'Tissue cap.'),
  gut: t('肠血管', 'Gut cap.'),
  'systemic-artery': t('体动脉', 'Body art.'),
  'systemic-vein': t('体静脉', 'Body veins'),
  'pulmonary-artery': t('肺动脉', 'Lung art.'),
  'pulmonary-vein': t('肺静脉', 'Lung vein'),
};
function RouteCanvas({
  mode,
  cargo,
  frame,
}: {
  mode: LanguageMode;
  cargo: Cargo;
  frame: number;
}) {
  const path = bloodPaths[cargo];
  const cols = 3,
    rows = Math.ceil(path.length / cols),
    height = rows * 82 + 48;
  function pos(i: number) {
    const row = Math.floor(i / cols),
      col = i % cols;
    return [70 + (row % 2 === 0 ? col : 2 - col) * 140, 52 + row * 82] as const;
  }
  return (
    <Scene
      mode={mode}
      height={height}
      title={t(
        '按序列站点追踪血液中的物质',
        'Track material through ordered circulation stations',
      )}
    >
      {path.slice(1).map((_, i) => {
        const a = pos(i),
          b = pos(i + 1);
        const horizontal = a[1] === b[1];
        return (
          <Arrow
            key={i}
            x1={a[0] + (horizontal ? (b[0] > a[0] ? 29 : -29) : 0)}
            y1={a[1] + (horizontal ? 0 : 20)}
            x2={b[0] + (horizontal ? (b[0] > a[0] ? -29 : 29) : 0)}
            y2={b[1] - (horizontal ? 0 : 20)}
            color={cargo === 'oxygen' ? blue : cargo === 'glucose' ? gold : red}
            active={i < frame}
          />
        );
      })}
      {path.map((station, i) => {
        const [x, y] = pos(i);
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="21"
              fill={frame === i ? '#dce5c7' : '#fffdf5'}
              stroke={frame === i ? green : '#b9c3a7'}
              strokeWidth={frame === i ? 3 : 1}
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fill="#415538"
              fontSize="16"
            >
              {i + 1}
            </text>
            <Label
              mode={mode}
              text={stationShort[station]}
              x={x}
              y={y + 37}
              size={10}
            />
          </g>
        );
      })}
      <Label
        mode={mode}
        text={t(
          '站点排序图 · 不是解剖比例图',
          'Ordered stations · not anatomical positions',
        )}
        x={210}
        y={height - 15}
        size={10}
      />
    </Scene>
  );
}
function carrier(cargo: Cargo, station: BloodStation): LocalizedText {
  if (cargo === 'glucose')
    return station === 'cell'
      ? t(
          '葡萄糖跨组织间液与细胞膜到细胞；只追踪经肝后继续的一部分。',
          'Glucose crosses tissue fluid and membrane into cells; only a portion continuing after liver is followed.',
        )
      : station === 'liver'
        ? t(
            '肝可以处理或储存材料；本例跟随继续循环的葡萄糖。',
            'The liver can process or store materials; this example follows glucose continuing in circulation.',
          )
        : t(
            '葡萄糖主要溶解在血浆；经过肺血管不等于进入肺泡空气。',
            'Glucose mainly dissolves in plasma; passing lung vessels does not imply entering alveolar air.',
          );
  if (cargo === 'oxygen')
    return station === 'air'
      ? t(
          '氧在肺泡空气中，尚需跨薄屏障进入血。',
          'Oxygen in alveolar air still needs to cross the thin barrier.',
        )
      : station === 'cell'
        ? t(
            '氧从组织毛细血管经组织间液进入细胞；红细胞留在血管中。',
            'Oxygen passes from tissue capillaries through tissue fluid into cells; red cells remain in vessels.',
          )
        : t(
            '血中大部分氧可逆结合红细胞内血红蛋白，少部分溶解。',
            'Most blood oxygen binds haemoglobin in red cells reversibly; a smaller portion dissolves.',
          );
  return station === 'air'
    ? t(
        '碳以CO₂进入肺泡空气，可随呼气离开；不是氧变成碳。',
        'Carbon in CO₂ enters alveolar air for exhalation; oxygen has not turned into carbon.',
      )
    : station === 'cell'
      ? t(
          '细胞反应可产生CO₂，碳来自有机物；这里追踪碳的去向。',
          'Cellular reactions can produce CO₂ with carbon from organic compounds; we track carbon’s destination.',
        )
      : station === 'lung'
        ? t(
            '碳酸氢根可重新形成CO₂，再跨向肺泡空气。',
            'Bicarbonate can reform CO₂, which crosses toward alveolar air.',
          )
        : t(
            '多数CO₂碳转换为碳酸氢根，主要随血浆运输；也有溶解和蛋白结合形式。',
            'Much CO₂ carbon becomes bicarbonate transported mainly in plasma; dissolved and protein-bound forms also occur.',
          );
}
function BloodLab({ id, mode, onExplore }: Props) {
  const [cargo, setCargo] = useState<Cargo>('oxygen');
  const path = bloodPaths[cargo],
    flow = useFrames(path.length - 1, onExplore);
  const station = path[flow.frame]!;
  return (
    <div className="bio-systems-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '随血流，换一位乘客',
            'Follow blood with a different passenger',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('运输对象', 'Cargo')}
        value={cargo}
        items={cargoItems}
        choose={(v) => {
          setCargo(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-systems-window">
        <RouteCanvas mode={mode} cargo={cargo} frame={flow.frame} />
      </div>
      <p className="bio-systems-stage">
        <Text mode={mode} text={stationNames[station]} />
      </p>
      <div className="bio-systems-carrier">
        <svg
          viewBox="0 0 130 90"
          role="img"
          aria-label={w(
            mode,
            t(
              '红细胞与血浆运输方式示意',
              'Red-cell and plasma carrier schematic',
            ),
          )}
        >
          <rect x="8" y="8" width="114" height="74" rx="20" fill="#efdfb1" />
          {cargo === 'oxygen' && station !== 'air' && station !== 'cell' ? (
            <>
              <ellipse
                cx="65"
                cy="44"
                rx="31"
                ry="20"
                fill="#d3a29a"
                stroke={red}
                strokeWidth="2"
              />
              <ellipse cx="65" cy="44" rx="14" ry="9" fill="#e4c0b8" />
              <text
                x="65"
                y="49"
                textAnchor="middle"
                fontSize="13"
                fill="#774d46"
              >
                Hb · O₂
              </text>
            </>
          ) : (
            <text
              x="65"
              y="49"
              textAnchor="middle"
              fontSize={cargo === 'carbon' && station !== 'lung' ? 18 : 13}
              fill={cargo === 'carbon' ? red : gold}
            >
              {cargo === 'oxygen'
                ? 'O₂'
                : cargo === 'carbon'
                  ? station === 'air' || station === 'cell'
                    ? 'CO₂'
                    : station === 'lung'
                      ? 'CO₂ ⇄ HCO₃⁻'
                      : 'HCO₃⁻'
                  : 'Glucose'}
            </text>
          )}
        </svg>
        <p aria-live="polite">
          <Text mode={mode} text={carrier(cargo, station)} />
        </p>
      </div>
      <Playback mode={mode} flow={flow} />
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t(
              '按站名选择 / 查看完整路线',
              'Choose a station / full route',
            )}
          />
        </summary>
        <ol className="bio-systems-stations">
          {path.map((s, i) => (
            <li key={i}>
              <button
                aria-pressed={i === flow.frame}
                onClick={() => flow.choose(i)}
              >
                <Text mode={mode} text={stationNames[s]} />
              </button>
            </li>
          ))}
        </ol>
      </details>
      <Notes
        mode={mode}
        text={t(
          '氧：肺泡→肺毛细血管→肺静脉→左心→体动脉→组织毛细血管→细胞。CO₂碳：细胞→组织血管→体静脉→右心→肺动脉→肺血管→空气。葡萄糖：肠血管→门静脉→肝→体静脉→右心→肺动脉→肺血管→肺静脉→左心→体动脉→组织→细胞。每侧心脏两腔合并；省略时间、真实分支、交换份额与肝储存量。蓝线不是蓝色血。',
          'Oxygen: alveolus → lung capillary → pulmonary vein → left heart → systemic artery → tissue capillary → cell. Carbon returns via tissue veins, right heart and pulmonary artery to lungs. Glucose passes gut capillaries, portal vein, liver, systemic veins, right heart, pulmonary circuit, left heart and systemic arteries to cells. Each heart side combines two chambers; timing, actual branches, exchange fractions and liver storage are omitted. Blue does not mean blue blood.',
        )}
      />
    </div>
  );
}
const hiddenItems = [
  { value: 'none', name: t('全部连接', 'All links') },
  { value: 'absorption', name: t('隐藏新吸收连接', 'Hide new absorption') },
  { value: 'exchange', name: t('隐藏肺交换连接', 'Hide lung exchange') },
  { value: 'transport', name: t('隐藏血液运输连接', 'Hide blood transport') },
] as const;
function TeamCanvas({
  mode,
  cargo,
  hidden,
  frame,
}: {
  mode: LanguageMode;
  cargo: Cargo;
  hidden: HiddenLink;
  frame: number;
}) {
  const links = deliveryLinks(hidden);
  return (
    <Scene
      mode={mode}
      title={t(
        '消化、肺交换、循环与细胞协作图',
        'Gut, lung exchange, circulation and cell cooperation',
      )}
      height={350}
    >
      {[
        [80, 80],
        [340, 80],
        [210, 175],
        [210, 285],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x! - 47}
            y={y! - 30}
            width="94"
            height="60"
            rx="16"
            fill={i === 3 ? '#dce5c7' : i === 2 ? '#ecd2cb' : '#d5e3e4'}
            stroke={i === 2 ? red : green}
            strokeWidth="2"
          />
          <Label
            mode={mode}
            text={
              [
                t('小肠来源', 'Gut source'),
                t('肺泡交换', 'Lung exchange'),
                t('心脏 + 血管', 'Heart + vessels'),
                t('细胞反应', 'Cell reactions'),
              ][i]!
            }
            x={x!}
            y={y! + 4}
            size={11}
          />
        </g>
      ))}
      <Arrow
        x1={111}
        y1={107}
        x2={177}
        y2={147}
        color={gold}
        active={cargo === 'glucose' && links.absorption && frame > 0}
      />
      <Arrow
        x1={308}
        y1={107}
        x2={244}
        y2={147}
        color={blue}
        active={cargo === 'oxygen' && links.exchange && frame > 0}
      />
      <Arrow
        x1={cargo === 'carbon' ? 230 : 195}
        y1={cargo === 'carbon' ? 253 : 207}
        x2={cargo === 'carbon' ? 230 : 195}
        y2={cargo === 'carbon' ? 207 : 253}
        color={cargo === 'oxygen' ? blue : cargo === 'glucose' ? gold : red}
        active={
          links.transport &&
          frame > 1 &&
          (cargo === 'carbon' ||
            (cargo === 'oxygen' ? links.exchange : links.absorption))
        }
      />
      {cargo === 'carbon' && (
        <Arrow
          x1={245}
          y1={148}
          x2={308}
          y2={107}
          color={red}
          active={links.exchange && links.transport && frame > 1}
        />
      )}
      <Label
        mode={mode}
        text={t(
          '只比较一条新路线；不计算储备与ATP速率',
          'One new route only; reserves and ATP rates omitted',
        )}
        x={210}
        y={336}
        size={10}
      />
    </Scene>
  );
}
function TeamLab({ id, mode, onExplore }: Props) {
  const [cargo, setCargo] = useState<Cargo>('oxygen'),
    [hidden, setHidden] = useState<HiddenLink>('none');
  const flow = useFrames(3, onExplore),
    possible = newDelivery(cargo, hidden);
  const status = possible
    ? t('所选新路线具备图中连接', 'Selected new route has its required links')
    : t(
        '所选新路线无法完整完成；不是所有材料/能量归零',
        'Selected new route is incomplete; materials/energy are not all zero',
      );
  return (
    <div className="bio-systems-lab" data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '会合与回程：检查一个连接',
            'Meeting and return: inspect one link',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('追踪对象', 'Tracer')}
        value={cargo}
        items={cargoItems}
        choose={(v) => {
          setCargo(v);
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('模型连接对照', 'Model link comparison')}
        value={hidden}
        items={hiddenItems}
        choose={(v) => {
          setHidden(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-systems-window">
        <TeamCanvas
          mode={mode}
          cargo={cargo}
          hidden={hidden}
          frame={flow.frame}
        />
      </div>
      <p className="bio-systems-stage" aria-live="polite">
        <Text mode={mode} text={status} />
      </p>
      <p className="bio-frame-caption">
        <Text
          mode={mode}
          text={
            [
              t(
                '先看来源：氧来自肺泡空气，葡萄糖来自吸收；CO₂碳从细胞回程。',
                'Start with sources: oxygen from alveolar air, glucose from absorption; CO₂ carbon returns from cells.',
              ),
              t(
                '跨交换边界与运输是两种工作；先判断所选路线需要哪条连接。',
                'Crossing an exchange barrier and transport are different tasks; identify the selected route’s required links.',
              ),
              t(
                '循环需要心脏与血管；氧到身体通常经左心，CO₂碳返回肺经右心。',
                'Circulation needs heart and vessels; oxygen delivery usually passes left heart, carbon’s return to lung right heart.',
              ),
              possible
                ? t(
                    '这条新路线连通。细胞还需内部反应；模型没有由此计算ATP产量。',
                    'This new route connects. Cells still need internal reactions; ATP yield is not calculated.',
                  )
                : t(
                    '这条新路线不连通；已有养分、储备和其他途径不在图中计算，不能推断健康或时间。',
                    'This new route is incomplete. Existing nutrients, stores and alternatives are not calculated; no health or timing inference follows.',
                  ),
            ][flow.frame]!
          }
        />
      </p>
      <Playback mode={mode} flow={flow} />
      <Notes
        mode={mode}
        text={t(
          '隐藏的是一条教学连接，不是实际身体操作。葡萄糖新来源需吸收+运输；氧新递送与CO₂碳完整回程需交换+运输。图中省略肝与双循环具体站名，详细见L039；已有养分、储备、无氧供ATP过程、神经与激素调节未计算。不做屏气、饮食或运动实验。',
          'A hidden teaching link is not a real bodily action. New glucose supply requires absorption + transport; oxygen delivery and carbon’s complete return require exchange + transport. Liver and double-circulation stations are detailed in L039. Existing nutrients, stores, anaerobic ATP supply and neural/hormonal regulation are omitted. No breath-holding, diet or exercise experiment.',
        )}
      />
    </div>
  );
}
export function SystemsExplore(props: Props) {
  switch (props.id) {
    case 'L037':
      return <DigestLab {...props} />;
    case 'L038':
      return <LungLab {...props} />;
    case 'L039':
      return <BloodLab {...props} />;
    default:
      return <TeamLab {...props} />;
  }
}
export function SystemsHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return id === 'L037' ? (
    <DigestCanvas mode={mode} material="starch" frame={4} />
  ) : id === 'L038' ? (
    <ExchangeCanvas mode={mode} gas="oxygen" scenario="usual" frame={3} />
  ) : id === 'L039' ? (
    <RouteCanvas mode={mode} cargo="oxygen" frame={6} />
  ) : (
    <TeamCanvas mode={mode} cargo="oxygen" hidden="none" frame={3} />
  );
}
const clues: Record<string, LocalizedText[]> = {
  L037: [
    t(
      '食物通道与血管分开，吸收要跨肠壁。',
      'Gut passage and blood vessels are separate; absorption crosses a wall.',
    ),
    t(
      '淀粉与蛋白质的分解步骤不同，最终提供不同材料。',
      'Starch and protein have different breakdown steps and products.',
    ),
    t(
      '纤维支路与脂类路线不能套用全部葡萄糖箭头。',
      'Fibre and lipid routes do not simply copy every glucose arrow.',
    ),
  ],
  L038: [
    t(
      '肺泡薄壁邻近毛细血管；氧净入血，CO₂净入空气。',
      'Thin alveolar walls adjoin capillaries; usual oxygen goes into blood, CO₂ into air.',
    ),
    t(
      '同体积八个半径减半的球，总表面加倍。',
      'Eight half-radius spheres have equal total volume and double surface.',
    ),
    t(
      '表面不单独决定速率；通气与血流维持交换条件。',
      'Surface alone does not determine rate; ventilation and flow maintain conditions.',
    ),
  ],
  L039: [
    t(
      '氧经肺静脉、左心、体动脉到组织。',
      'Oxygen passes pulmonary vein, left heart and systemic arteries to tissue.',
    ),
    t(
      '动脉离心，静脉回心；肺循环是氧多寡规则的反例。',
      'Arteries lead away and veins toward the heart; the pulmonary circuit challenges oxygen-based naming.',
    ),
    t(
      '氧主要结合红细胞内Hb，葡萄糖主要在血浆，CO₂碳形式会变。',
      'Oxygen mostly binds red-cell Hb, glucose travels in plasma and CO₂ carbon changes form.',
    ),
  ],
  L040: [
    t(
      '肺交换与循环不同；细胞还需内部反应。',
      'Lung exchange differs from circulation; cells also need internal reactions.',
    ),
    t(
      '葡萄糖和氧来源不同，在组织递送后会合。',
      'Glucose and oxygen have different sources and meet after tissue delivery.',
    ),
    t(
      '隐藏新递送不表示已有储备瞬间消失。',
      'Hiding new delivery does not instantly erase reserves.',
    ),
  ],
};
export function SystemsDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0);
  const unique = useId();
  return (
    <figure
      className="bio-diagram bio-systems-diagram"
      data-resource-id={`${id}-D01`}
      aria-describedby={unique}
    >
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('身体接力地图', 'BODY RELAY MAP')} />
      </span>
      <SystemsHookArt id={id} mode={mode} />
      <div
        className="bio-choice-row bio-systems-choices"
        role="group"
        aria-label={w(mode, t('图解线索', 'Diagram clues'))}
      >
        {[0, 1, 2].map((i) => (
          <button key={i} aria-pressed={clue === i} onClick={() => setClue(i)}>
            <Text mode={mode} text={t(`线索${i + 1}`, `Clue ${i + 1}`)} />
          </button>
        ))}
      </div>
      <figcaption id={unique} aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
      </figcaption>
      <small>
        <Text
          mode={mode}
          text={t(
            '原创示意，非实测或真实时间；完整比较在动手模型中。',
            'Original schematic, not measurements or real timing; explore the model for comparisons.',
          )}
        />
      </small>
    </figure>
  );
}
