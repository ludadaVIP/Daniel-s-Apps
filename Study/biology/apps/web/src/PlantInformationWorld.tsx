import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  complement,
  divisionCheckpoint,
  photosynthesis,
  plantTrait,
  traitDistribution,
  transpiration,
  type TransportSeason,
} from './plantInformationModel';
import './plantInformation.css';
type ViewProps = { id: string; mode: LanguageMode };
type Props = ViewProps & { onExplore: () => void };
const label = (mode: LanguageMode, value: LocalizedText) =>
  mode === 'en' ? value.en : value.zh;
function Scene({
  mode,
  title,
  children,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  children: ReactNode;
}) {
  const uid = useId();
  return (
    <div
      className="pi-scroll"
      role="region"
      tabIndex={0}
      aria-label={label(
        mode,
        t('可横向滚动的科学图', 'Scrollable science diagram'),
      )}
    >
      <svg viewBox="0 0 600 340" role="img" aria-labelledby={uid}>
        <title id={uid}>{label(mode, title)}</title>
        <rect width="600" height="340" rx="18" fill="#f2f5eb" />
        {children}
      </svg>
    </div>
  );
}
function L({
  x,
  y,
  text,
  mode,
  small = false,
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
  small?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="#223f37"
      fontSize={small ? 12 : 15}
    >
      {mode !== 'en' && <tspan x={x}>{text.zh}</tspan>}
      {mode !== 'zh' && (
        <tspan x={x} dy={mode === 'bilingual' ? 17 : 0}>
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Arrow({
  x,
  y,
  down = false,
  color = '#27768b',
}: {
  x: number;
  y: number;
  down?: boolean;
  color?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${down ? 180 : 0})`}
      stroke={color}
      strokeWidth="5"
      fill="none"
    >
      <path d="M0 28V-28m-9 10 9-10 9 10" />
    </g>
  );
}
function Notes({
  mode,
  items,
  limits,
}: {
  mode: LanguageMode;
  items: LocalizedText[];
  limits: LocalizedText;
}) {
  return (
    <details className="pi-static">
      <summary>
        <Text
          mode={mode}
          text={t(
            '完整静态步骤、读图与模型边界',
            'Complete static steps, evidence and limits',
          )}
        />
      </summary>
      <ol>
        {items.map((a, i) => (
          <li key={i}>
            <Text mode={mode} text={a} />
          </li>
        ))}
      </ol>
      <p>
        <Text mode={mode} text={limits} />
      </p>
    </details>
  );
}
function Select({
  mode,
  title,
  value,
  items,
  change,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  value: string;
  items: [string, LocalizedText][];
  change: (value: string) => void;
}) {
  return (
    <label className="pi-control">
      <Text mode={mode} text={title} />
      <select value={value} onChange={(e) => change(e.target.value)}>
        {items.map(([v, name]) => (
          <option key={v} value={v}>
            {mode === 'bilingual'
              ? `${name.zh} / ${name.en}`
              : label(mode, name)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Slider({
  mode,
  title,
  value,
  min = 0,
  max = 100,
  change,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  value: number;
  min?: number;
  max?: number;
  change: (value: number) => void;
}) {
  return (
    <label className="pi-control">
      <Text mode={mode} text={title} />
      <output>{value}</output>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
    </label>
  );
}
const transportSteps = [
  t(
    '成熟叶作为源：蔗糖经不同筛管输往根和生长点；两条管可在同一时刻方向相反。',
    'A mature source leaf exports sucrose to roots and a growing shoot through different tubes, which can carry opposite flows simultaneously.',
  ),
  t(
    '储藏器官可在萌芽时变为源，向新梢输出糖；源和库是角色，不是固定器官名称。',
    'A storage organ can become a source during sprouting and export sugar to a shoot. Source and sink are roles, not permanent organ names.',
  ),
  t(
    '常见蒸腾条件下，根→木质部→叶输送水及矿质；成熟导管为死的、木质化的空腔。',
    'Under usual transpiring conditions, root → xylem → leaf carries water and minerals. Mature vessel elements are dead, lignified conduits.',
  ),
  t(
    '装载糖可消耗能量，水因渗透进入，压力差驱动筛管中的整体流动；不是沿途每段主动泵糖。',
    'Loading can use energy; water enters by osmosis and a pressure difference drives bulk flow, rather than active pumping along every part of the tube.',
  ),
];
function Transport({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [season, setSeason] = useState<TransportSeason>('leaf-source');
  return (
    <>
      {interactive && (
        <Select
          mode={mode}
          title={t('比较源–库条件', 'Compare source–sink conditions')}
          value={season}
          items={[
            ['leaf-source', t('成熟叶供糖', 'Mature leaf supplies sugar')],
            ['store-source', t('储藏器官动员', 'Storage reserves mobilised')],
          ]}
          change={(v) => {
            setSeason(v as TransportSeason);
            onExplore();
          }}
        />
      )}
      <Scene
        mode={mode}
        title={t(
          '三条独立运输通路：木质部和两条筛管',
          'Three independent routes: xylem and two phloem tubes',
        )}
      >
        <path
          d="M105 270V85M285 270V85M465 270V85"
          stroke="#d7b66c"
          strokeWidth="38"
        />
        <path d="M105 270V85" stroke="#afd6df" strokeWidth="31" />
        {[110, 170, 230].map((y) => (
          <path
            key={y}
            d={`M267 ${y}h 36m 144 0h 36`}
            stroke="#766744"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        ))}
        <Arrow x={105} y={185} />
        <Arrow
          x={285}
          y={185}
          down={season === 'leaf-source'}
          color="#9a6331"
        />
        <Arrow x={465} y={185} color="#9a6331" />
        <L
          mode={mode}
          x={105}
          y={38}
          text={t('木质部：水＋矿质', 'Xylem: water + minerals')}
          small
        />
        <L
          mode={mode}
          x={285}
          y={38}
          text={t('筛管 A：蔗糖', 'Sieve tube A: sucrose')}
          small
        />
        <L
          mode={mode}
          x={465}
          y={38}
          text={t('筛管 B：蔗糖', 'Sieve tube B: sucrose')}
          small
        />
        <L mode={mode} x={105} y={78} text={t('叶', 'Leaf')} />
        <L
          mode={mode}
          x={285}
          y={78}
          text={
            season === 'leaf-source'
              ? t('叶：源', 'Leaf: source')
              : t('新梢：库', 'Shoot: sink')
          }
        />
        <L mode={mode} x={465} y={78} text={t('新梢：库', 'Shoot: sink')} />
        <L mode={mode} x={105} y={295} text={t('根', 'Root')} />
        <L
          mode={mode}
          x={285}
          y={295}
          text={
            season === 'leaf-source'
              ? t('根：库', 'Root: sink')
              : t('储藏器官：源', 'Store: source')
          }
        />
        <L
          mode={mode}
          x={465}
          y={295}
          text={t('另一成熟叶：源', 'Another leaf: source')}
          small
        />
      </Scene>
      <Notes
        mode={mode}
        items={transportSteps}
        limits={t(
          '原创通路示意，非按比例；省略分支和水交换。蓝色代表物质类别，箭头与文字才表示方向。不同筛管可相反，不代表一条筛管同时双向流。',
          'Original schematic, not to scale; branches and water exchange omitted. Arrows and labels encode direction. Opposite flows occur in different tubes, not simultaneous opposing bulk flow in one tube.',
        )}
      />
    </>
  );
}
function Transpiration({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [h, H] = useState(50),
    [w, W] = useState(0),
    [temp, T] = useState(20),
    [light, B] = useState(100),
    [closed, C] = useState(false);
  const out = transpiration(h, w, temp, light, closed);
  const update = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    onExplore();
  };
  return (
    <>
      {interactive && (
        <>
          <div className="pi-controls">
            <Slider
              mode={mode}
              title={t('相对湿度 / %', 'Relative humidity / %')}
              value={h}
              change={update(H)}
            />
            <Slider
              mode={mode}
              title={t('风级（模型0–3）', 'Wind level (model 0–3)')}
              value={w}
              max={3}
              change={update(W)}
            />
            <Slider
              mode={mode}
              title={t('温度 / °C', 'Temperature / °C')}
              value={temp}
              min={10}
              max={40}
              change={update(T)}
            />
            <Slider
              mode={mode}
              title={t('光照（相对）', 'Light (relative)')}
              value={light}
              change={update(B)}
            />
          </div>
          <button
            aria-pressed={closed}
            onClick={() => {
              C(!closed);
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                closed
                  ? t('水分胁迫：气孔关闭', 'Water stress: stomata closed')
                  : t(
                      '水分足够：气孔响应光',
                      'Water available: stomata respond to light',
                    )
              }
            />
          </button>
        </>
      )}
      <Scene
        mode={mode}
        title={t(
          '蒸发—扩散及吸水计代理读数',
          'Evaporation, diffusion and a potometer proxy',
        )}
      >
        <rect x="40" y="105" width="310" height="90" fill="#b6d29e" />
        <ellipse cx="175" cy="220" rx="54" ry="20" fill="#6e9a63" />
        <ellipse cx="260" cy="220" rx="54" ry="20" fill="#6e9a63" />
        <rect
          x="205"
          y="207"
          width={closed ? 3 : 10 + light / 8}
          height="27"
          fill="#f2f5eb"
        />
        {[95, 155, 215, 275].map((x) => (
          <circle key={x} cx={x} cy="155" r="7" fill="#3489a2" />
        ))}
        <path
          d="M218 185v-35m0 94v30l65 30"
          stroke="#27768b"
          strokeWidth="3"
          fill="none"
        />
        <L
          mode={mode}
          x={185}
          y={35}
          text={t('细胞壁水 → 叶内水蒸气', 'Wall water → leaf water vapour')}
          small
        />
        <L
          mode={mode}
          x={190}
          y={75}
          text={t(
            '水蒸气经气孔向外扩散',
            'Vapour diffuses out through stomata',
          )}
          small
        />
        <L
          mode={mode}
          x={185}
          y={311}
          text={t(
            `蒸腾：${out.rate} 相对单位`,
            `Loss: ${out.rate} relative units`,
          )}
          small
        />
        <path
          d="M420 100v135h115v-25"
          fill="none"
          stroke="#7698a7"
          strokeWidth="15"
        />
        <circle
          cx={445 + out.uptake * 4}
          cy="235"
          r="7"
          fill="#fff"
          stroke="#2e6373"
        />
        <L mode={mode} x={468} y={55} text={t('吸水计', 'Potometer')} />
        <L
          mode={mode}
          x={468}
          y={115}
          text={t(`吸水：${out.uptake}`, `Uptake: ${out.uptake}`)}
        />
        <L
          mode={mode}
          x={468}
          y={300}
          text={t('吸水 ≠ 精确蒸腾', 'Uptake ≠ exact loss')}
          small
        />
      </Scene>
      <Notes
        mode={mode}
        items={[
          t(
            '叶肉细胞壁表面的水先蒸发；水蒸气主要经气孔沿梯度扩散到外界。',
            'Water first evaporates from mesophyll cell walls; vapour diffuses mainly through stomata down a gradient.',
          ),
          t(
            '固定20°C、光100、风0，湿度50→80%，相对蒸腾5→2；固定湿度50%，风0→3，5→10。',
            'At 20°C, light 100 and wind 0, humidity 50→80% changes relative loss 5→2; at humidity 50%, wind 0→3 changes 5→10.',
          ),
          t(
            '光通常促进气孔开启；干旱关闭可压过温度与风的作用。控制一项再比较，不能把所有作用简单相加。',
            'Light often promotes opening; drought closure can outweigh warming or wind. Change one variable per comparison rather than simply adding effects.',
          ),
          t(
            '吸水计跟踪吸水，不直接测叶水损失；部分水用于储存、生长，漏气也会干扰。',
            'A potometer tracks uptake, not direct leaf water loss. Storage, growth and leaks can affect readings.',
          ),
        ]}
        limits={t(
          '原创定性公式：E=10(1−H/100)[1+(T−20)/40](1+W/3)A；A关闭0.05，否则0.2+0.8L/100；吸水=E+0.4。单位相对，+0.4仅示储存用水；无真实物种校准，不可预测照料。',
          'Original qualitative formula: E=10(1−H/100)[1+(T−20)/40](1+W/3)A; A=0.05 if closed, otherwise 0.2+0.8L/100; uptake=E+0.4. Relative units; +0.4 illustrates retained water, not a universal correction. No species calibration.',
        )}
      />
    </>
  );
}
function Photo({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [light, B] = useState(60),
    [carbon, C] = useState(40);
  return (
    <>
      {interactive && (
        <div className="pi-controls">
          <Slider
            mode={mode}
            title={t('光照 / 相对单位', 'Light / relative units')}
            value={light}
            change={(v) => {
              B(v);
              onExplore();
            }}
          />
          <Select
            mode={mode}
            title={t('CO₂供应 / 相对单位', 'CO₂ supply / relative units')}
            value={String(carbon)}
            items={[
              ['40', t('40：低供应', '40: lower supply')],
              ['70', t('70：高供应', '70: higher supply')],
            ]}
            change={(v) => {
              C(Number(v));
              onExplore();
            }}
          />
        </div>
      )}
      <Scene
        mode={mode}
        title={t(
          '光合限制因素的两条控制曲线',
          'Two controlled curves for photosynthesis limitation',
        )}
      >
        <path d="M70 45v220h460" fill="none" stroke="#234d43" strokeWidth="2" />
        {[0, 20, 40, 60, 80, 100].map((n) => (
          <g key={n}>
            <text x={70 + n * 4.3} y="285" textAnchor="middle" fontSize="12">
              {n}
            </text>
            <text x="52" y={268 - n * 2.1} textAnchor="end" fontSize="12">
              {n}
            </text>
          </g>
        ))}
        {[40, 70].map((c) => (
          <polyline
            key={c}
            points={Array.from(
              { length: 11 },
              (_, i) =>
                `${70 + i * 43},${265 - photosynthesis(i * 10, c) * 2.1}`,
            ).join(' ')}
            fill="none"
            stroke={c === 40 ? '#a15e40' : '#347c65'}
            strokeWidth={carbon === c ? 5 : 2}
            strokeDasharray={c === 40 ? '8 4' : undefined}
          />
        ))}
        <circle
          cx={70 + light * 4.3}
          cy={265 - photosynthesis(light, carbon) * 2.1}
          r="7"
          fill="#0e415d"
        />
        <L
          mode={mode}
          x={300}
          y={20}
          text={t(
            '光合速率 / 相对单位',
            'Photosynthetic rate / relative units',
          )}
          small
        />
        <L
          mode={mode}
          x={295}
          y={310}
          text={t('光照 / 相对单位', 'Light / relative units')}
          small
        />
        <L
          mode={mode}
          x={300}
          y={65}
          text={t('实线 CO₂70', 'Solid: CO₂70')}
          small
        />
        <L
          mode={mode}
          x={445}
          y={65}
          text={t('虚线 CO₂40', 'Dashed: CO₂40')}
          small
        />
      </Scene>
      <p className="pi-result">
        <Text
          mode={mode}
          text={t(
            `当前速率 ${photosynthesis(light, carbon)}；温度、水和叶面积固定。`,
            `Current rate ${photosynthesis(light, carbon)}; temperature, water and leaf area held constant.`,
          )}
        />
      </p>
      <Notes
        mode={mode}
        items={[
          t(
            '横轴为光照，纵轴为相对光合速率；每条曲线固定一种CO₂供应，其他条件相同。',
            'Light is on x, relative photosynthetic rate on y; each curve fixes CO₂ supply and holds other conditions equal.',
          ),
          t(
            '低CO₂时光20→60，速率20→40；再把光60→90，仍为40。平台只能说明继续加光在此条件无效。',
            'At lower CO₂, light 20→60 raises rate 20→40; light 60→90 leaves rate 40. The plateau shows extra light is ineffective under these conditions.',
          ),
          t(
            '固定光90把CO₂40→70，速率40→70，支持此处CO₂限制；光20时同样加CO₂仍为20。',
            'At light 90, CO₂40→70 raises rate 40→70, supporting carbon limitation here; at light 20 the same CO₂ change leaves rate 20.',
          ),
          t(
            '计水草气泡只能估计净产气趋势，需控制时间、温度、气泡体积和溶解气体；不能把每个气泡当等体积纯氧的精确总光合测量。',
            'Bubble counts estimate net gas-production trends; duration, temperature, bubble volume and dissolved gas matter. Bubbles are not a precise measurement of total photosynthesis.',
          ),
        ]}
        limits={t(
          '原创理想化速率P=min(光,CO₂供应,80)，均为相对单位；刻意用折线突出比较逻辑，真实曲线通常平滑，多因素可能共同限制。',
          'Original idealisation P=min(light, CO₂ supply,80), all relative units. Corners expose comparison logic; real curves are usually smooth and factors may co-limit.',
        )}
      />
    </>
  );
}
const flowerSteps = [
  t(
    '授粉：花粉从花药转移到柱头；不相容花粉也可到达，但后续萌发或受精可能失败。花粉不是种子。',
    'Pollination: pollen transfers from anther to stigma. Incompatible pollen can arrive, but germination or fertilisation may fail. Pollen is not a seed.',
  ),
  t(
    '花粉管向胚珠生长，输送雄配子；授粉不保证管成功到达。',
    'A pollen tube grows towards an ovule and delivers male gametes; pollination does not guarantee successful delivery.',
  ),
  t(
    '受精：雄、雌配子核结合形成合子；与花粉落到柱头是两个事件。',
    'Fertilisation: male and female gamete nuclei unite to form a zygote, a different event from pollen landing.',
  ),
  t(
    '受精后胚发育，胚珠可发育为种子。N用于氨基酸等，Mg是叶绿素成分；糖的碳仍主要来自CO₂。',
    'An embryo develops after fertilisation and an ovule may become a seed. N supports amino acids; Mg is part of chlorophyll. Sugar carbon still comes mainly from CO₂.',
  ),
];
function Flower({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const flow = useFrames(3, onExplore),
    [mineral, M] = useState('complete');
  const frame = interactive ? flow.frame : 3;
  return (
    <>
      {interactive && (
        <>
          <Playback flow={flow} mode={mode} />
          <Select
            mode={mode}
            title={t(
              '另做矿质对照（不预测结籽数）',
              'Separate mineral comparison (not seed-count prediction)',
            )}
            value={mineral}
            items={[
              ['complete', t('完整营养', 'Complete nutrients')],
              [
                'N',
                t('缺氮：蛋白合成受限', 'Low N: protein synthesis limited'),
              ],
              ['Mg', t('缺镁：叶绿素受影响', 'Low Mg: chlorophyll affected')],
            ]}
            change={(v) => {
              M(v);
              onExplore();
            }}
          />
        </>
      )}
      <Scene
        mode={mode}
        title={t(
          '花粉管到胚珠的繁殖路线与矿质功能',
          'Reproductive route to an ovule and mineral functions',
        )}
      >
        <path
          d="M130 85q70-40 140 0M200 85v120"
          stroke="#8d7a94"
          strokeWidth="14"
          fill="none"
        />
        <ellipse cx="200" cy="245" rx="75" ry="52" fill="#d7c4d9" />
        <ellipse
          cx="200"
          cy="245"
          rx="28"
          ry="20"
          fill={frame >= 3 ? '#8ba764' : '#faf2d5'}
          stroke="#675145"
        />
        <circle cx="171" cy="60" r="9" fill="#b98728" />
        {frame >= 1 && (
          <path
            d="M171 67Q200 100 197 215L200 240"
            fill="none"
            stroke="#ba7e2e"
            strokeWidth="5"
          />
        )}
        {frame >= 2 && <circle cx="200" cy="245" r="8" fill="#8f4941" />}
        <L mode={mode} x={82} y={52} text={t('花粉', 'Pollen')} />
        <L mode={mode} x={285} y={108} text={t('柱头', 'Stigma')} />
        <L mode={mode} x={95} y={270} text={t('胚珠', 'Ovule')} />
        <L
          mode={mode}
          x={200}
          y={318}
          text={t(`步骤 ${frame + 1} / 4`, `Step ${frame + 1} / 4`)}
        />
        <path
          d="M425 265V135q-85-55-90 0 70 35 90 0 80-55 90 0-75 35-90 0"
          stroke="#63834a"
          strokeWidth="7"
          fill={mineral === 'complete' ? '#91b871' : '#dfca7b'}
        />
        <L
          mode={mode}
          x={430}
          y={43}
          text={t('矿质不是糖的碳源', 'Minerals ≠ sugar carbon')}
          small
        />
        <L
          mode={mode}
          x={430}
          y={207}
          text={t('N → 氨基酸等', 'N → amino acids, etc.')}
          small
        />
        <L
          mode={mode}
          x={430}
          y={248}
          text={t('Mg → 叶绿素', 'Mg → chlorophyll')}
          small
        />
        <L
          mode={mode}
          x={430}
          y={301}
          text={t('症状不能单独诊断', 'Symptoms alone do not diagnose')}
          small
        />
      </Scene>
      <p>
        <Text mode={mode} text={flowerSteps[frame]!} />
      </p>
      <Notes
        mode={mode}
        items={flowerSteps}
        limits={t(
          '原创花的局部示意，非按比例，省略双受精另一融合和果实发育。缺素颜色仅作功能提示；营养、授粉、水温均影响繁殖，模型不保证授粉后结籽，不用于诊断。',
          'Original partial flower schematic, not to scale; the second fusion of double fertilisation and fruit development are omitted. Colour only prompts mineral function. Nutrition, pollination and conditions affect reproduction; seed set is not guaranteed and symptoms do not diagnose deficiency.',
        )}
      />
    </>
  );
}
function DNA({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [sequence, S] = useState('ATGCAT');
  return (
    <>
      {interactive && (
        <div
          className="pi-bases"
          role="group"
          aria-label={label(
            mode,
            t('点选位置循环改变碱基', 'Select a position to cycle its base'),
          )}
        >
          {sequence.split('').map((base, i) => (
            <button
              key={i}
              aria-label={`${label(mode, t('位置', 'Position'))} ${i + 1}: ${base}`}
              onClick={() => {
                S(
                  sequence.slice(0, i) +
                    'ATGC'[('ATGC'.indexOf(base) + 1) % 4] +
                    sequence.slice(i + 1),
                );
                onExplore();
              }}
            >
              {i + 1}: {base} ↻
            </button>
          ))}
        </div>
      )}
      <Scene
        mode={mode}
        title={t(
          '反平行DNA片段及互补配对',
          'Antiparallel DNA fragment and complementary pairing',
        )}
      >
        <path d="M110 100H490M110 225H490" stroke="#687967" strokeWidth="12" />
        {sequence.split('').map((base, i) => (
          <g key={i}>
            <path
              d={`M${130 + i * 67} 100v 125`}
              stroke="#b99056"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            <rect
              x={112 + i * 67}
              y="115"
              width="36"
              height="35"
              rx="5"
              fill="#f7ead3"
            />
            <rect
              x={112 + i * 67}
              y="174"
              width="36"
              height="35"
              rx="5"
              fill="#d6e7ed"
            />
            <text x={130 + i * 67} y="140" textAnchor="middle" fontSize="23">
              {base}
            </text>
            <text x={130 + i * 67} y="199" textAnchor="middle" fontSize="23">
              {complement(base)}
            </text>
          </g>
        ))}
        <text x="65" y="106" fontSize="23">
          5′
        </text>
        <text x="515" y="106" fontSize="23">
          3′
        </text>
        <text x="65" y="231" fontSize="23">
          3′
        </text>
        <text x="515" y="231" fontSize="23">
          5′
        </text>
        <L
          mode={mode}
          x={300}
          y={35}
          text={t(
            '糖–磷酸骨架在外，碱基在内',
            'Sugar–phosphate outside; bases inside',
          )}
          small
        />
        <L
          mode={mode}
          x={300}
          y={280}
          text={t(
            'A–T；G–C；字母次序承载信息',
            'A–T; G–C; letter order carries information',
          )}
          small
        />
        <L
          mode={mode}
          x={300}
          y={320}
          text={t(
            '6对碱基 ≠ 一个完整基因组',
            '6 base pairs ≠ a complete genome',
          )}
          small
        />
      </Scene>
      <Notes
        mode={mode}
        items={[
          t(
            '上链5′→3′为ATGCAT时，下链按图左→右是3′–TACGTA–5′。',
            'For upper 5′–ATGCAT–3′, the lower strand read left→right is 3′–TACGTA–5′.',
          ),
          t(
            '若要求把下链也写成5′→3′，必须从图右向左读，得到5′–ATGCAT–3′；非回文片段不能照抄。',
            'To report the lower strand 5′→3′, read right→left. This example happens to be palindromic; a non-palindromic fragment cannot simply be copied.',
          ),
          t(
            '改一个上链碱基，互补链随配对规则重建。比较两个都含同量A/T/G/C但顺序不同的片段，信息仍可不同。',
            'Changing one upper base rebuilds its complement by pairing rules. Two sequences with equal base totals may still encode different information.',
          ),
          t(
            '核苷酸含糖、磷酸和碱基；双螺旋展平为梯形，只便于读方向。颜色与字母不同，颜色不是遗传信息。',
            'A nucleotide includes sugar, phosphate and a base. A flattened ladder makes orientation readable; colour is not genetic information.',
          ),
        ]}
        limits={t(
          '原创6对碱基结构示意，非按比例；点选是编辑模型，不是在生物体中操作。未显示全染色体、蛋白结合或复制机制。',
          'Original six-base-pair schematic, not to scale. Clicking edits a model, not an organism. Full chromosomes, bound proteins and replication mechanisms are not shown.',
        )}
      />
    </>
  );
}
const expressionSteps = [
  t(
    '细胞核内：选择DNA上的一段基因作为信息来源，DNA本身留在核内。',
    'In the nucleus: a gene region supplies information while DNA remains in the nucleus.',
  ),
  t(
    '转录：根据DNA信息形成RNA；这是信息复制到另一种分子，不是DNA变成RNA。',
    'Transcription produces RNA using DNA information; DNA does not turn into RNA.',
  ),
  t(
    '蛋白编码路径：mRNA到细胞质核糖体。RNA基因路径：RNA本身加工后发挥功能。',
    'Protein-coding route: mRNA reaches cytoplasmic ribosomes. RNA-gene route: processed RNA itself performs a function.',
  ),
  t(
    '核糖体翻译mRNA信息，连接氨基酸；蛋白质折叠后可参与运输、结构或催化。功能RNA不需经过翻译。',
    'Ribosomes translate mRNA information and join amino acids. Folded proteins may transport, support or catalyse. Functional RNA does not require translation.',
  ),
];
function Expression({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const flow = useFrames(3, onExplore),
    [route, R] = useState('protein');
  const frame = interactive ? flow.frame : 3;
  return (
    <>
      {interactive && (
        <>
          <Select
            mode={mode}
            title={t('比较基因产物', 'Compare gene products')}
            value={route}
            items={[
              ['protein', t('蛋白编码基因', 'Protein-coding gene')],
              ['rna', t('功能RNA基因', 'Functional RNA gene')],
            ]}
            change={(v) => {
              R(v);
              onExplore();
            }}
          />
          <Playback flow={flow} mode={mode} />
        </>
      )}
      <Scene
        mode={mode}
        title={t(
          '核内转录与核外翻译分层图',
          'Nuclear transcription and cytoplasmic translation',
        )}
      >
        <ellipse
          cx="170"
          cy="165"
          rx="140"
          ry="125"
          fill="#ddd5e6"
          stroke="#8b7796"
          strokeWidth="3"
        />
        <L mode={mode} x={160} y={35} text={t('细胞核', 'Nucleus')} />
        <L mode={mode} x={460} y={35} text={t('细胞质', 'Cytoplasm')} />
        <path
          d="M85 108q30-25 60 0t60 0M85 125q30 25 60 0t60 0"
          stroke="#477d78"
          strokeWidth="6"
          fill="none"
        />
        <text x="135" y="155" fontSize="18">
          DNA
        </text>
        {frame >= 1 && (
          <>
            <path
              d="M150 185l60 20 40-10"
              stroke="#b78b3e"
              strokeWidth="6"
              fill="none"
            />
            <L
              mode={mode}
              x={170}
              y={250}
              text={t('RNA：转录产物', 'RNA: transcription product')}
              small
            />
          </>
        )}
        {frame >= 2 && (
          <>
            <path d="M270 185h80" stroke="#b78b3e" strokeWidth="4" />
            <text x="340" y="175" fontSize="25">
              →
            </text>
            <path
              d="M380 185l50 12 35-10"
              stroke="#b78b3e"
              strokeWidth="6"
              fill="none"
            />
          </>
        )}
        {frame >= 3 &&
          (route === 'protein' ? (
            <>
              <ellipse cx="420" cy="193" rx="32" ry="22" fill="#8b9eb2" />
              <path
                d="M425 216q15 30 30 0t30 0"
                stroke="#a66659"
                strokeWidth="8"
                fill="none"
              />
              <L
                mode={mode}
                x={430}
                y={280}
                text={t('核糖体 → 蛋白质', 'Ribosome → protein')}
                small
              />
            </>
          ) : (
            <>
              <path
                d="M400 155q60 30 0 60t50 30"
                stroke="#b78b3e"
                strokeWidth="7"
                fill="none"
              />
              <L
                mode={mode}
                x={435}
                y={280}
                text={t(
                  '功能RNA；无翻译步骤',
                  'Functional RNA; no translation',
                )}
                small
              />
            </>
          ))}
        <L
          mode={mode}
          x={300}
          y={310}
          text={t(
            '信息传递 ≠ 分子直接变身',
            'Information transfer ≠ molecule conversion',
          )}
          small
        />
      </Scene>
      <p>
        <Text mode={mode} text={expressionSteps[frame]!} />
      </p>
      <Notes
        mode={mode}
        items={expressionSteps}
        limits={t(
          '真核细胞的原创分层简图，非按比例；省略RNA加工及调控细节。两路径是概念对照，RNA也可在核内起作用。蛋白量受许多条件影响，不能从一个箭头推断一个基因决定一个性状。',
          'Original eukaryotic overview, not to scale; RNA processing and regulation are omitted. The routes are conceptual; functional RNA may act inside the nucleus too. Protein amounts depend on many factors; arrows do not imply one gene determines one trait.',
        )}
      />
    </>
  );
}
const divisionSteps = [
  t(
    '起点：虚构2n=4细胞，2套、4条染色体、4条染色单体、2C DNA。n表示一套有2条，C表示一套未复制DNA量。',
    'Start: a fictional 2n=4 cell has 2 sets, 4 chromosomes, 4 chromatids and 2C DNA. n is 2 chromosomes per set; C is unreplicated haploid DNA amount.',
  ),
  t(
    '分裂前复制一次：仍2套、4条染色体，但8条染色单体、4C DNA；每个X是一条已复制染色体。',
    'One replication before division: still 2 sets and 4 chromosomes, but 8 chromatids and 4C DNA; each X is one replicated chromosome.',
  ),
  t(
    '有丝分裂：姐妹染色单体分离，两子细胞各2n=4、2C。减I：同源染色体分离，两子细胞各n=2、4条染色单体、2C。',
    'Mitosis separates sisters: two cells each 2n=4,2C. Meiosis I separates homologues: two cells each n=2,4 chromatids,2C.',
  ),
  t(
    '减I与减II之间不再复制；减II分离姐妹，四子细胞各n=2、2条染色单体、1C。有丝路线已结束。',
    'No replication occurs between meiosis I and II. Meiosis II separates sisters: four cells each n=2,2 chromatids,1C. The mitotic route has already ended.',
  ),
];
function Division({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [kind, K] = useState<'mitosis' | 'meiosis'>('meiosis'),
    flow = useFrames(3, onExplore),
    frame = interactive ? flow.frame : 3,
    state = divisionCheckpoint(kind, frame);
  return (
    <>
      {interactive && (
        <>
          <Select
            mode={mode}
            title={t('分裂路线', 'Division route')}
            value={kind}
            items={[
              ['mitosis', t('有丝分裂', 'Mitosis')],
              ['meiosis', t('减数分裂', 'Meiosis')],
            ]}
            change={(v) => {
              K(v as typeof kind);
              onExplore();
            }}
          />
          <Playback flow={flow} mode={mode} />
        </>
      )}
      <Scene
        mode={mode}
        title={t(
          '按完成检查点计数的染色体账本',
          'Chromosome accounting at completed checkpoints',
        )}
      >
        {Array.from({ length: state.cells }, (_, cell) => {
          const x =
            state.cells === 1
              ? 300
              : 100 + cell * (400 / Math.max(1, state.cells - 1));
          return (
            <g key={cell}>
              <ellipse
                cx={x}
                cy="160"
                rx={state.cells === 1 ? 115 : 54}
                ry="90"
                fill="#e1e6ef"
                stroke="#85949f"
                strokeWidth="2"
              />
              {Array.from({ length: state.chromosomes }, (_, j) => {
                const xx = x - (state.chromosomes - 1) * 10 + j * 20;
                const replicated = state.chromatids > state.chromosomes;
                const half = (state.sets === 2 ? j < 2 : j === 0) ? 34 : 22;
                return (
                  <g
                    key={j}
                    stroke={
                      (state.sets === 2 ? j % 2 : cell % 2)
                        ? '#a15c4d'
                        : '#407e94'
                    }
                    strokeWidth="6"
                  >
                    <path
                      d={
                        replicated
                          ? `M${xx - 6} ${160 - half}l12 ${half * 2}m0-${half * 2}-12 ${half * 2}`
                          : `M${xx} ${160 - half}v${half * 2}`
                      }
                    />
                    <circle
                      cx={xx}
                      cy="160"
                      r="3"
                      fill="#26352c"
                      stroke="none"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
        <L
          mode={mode}
          x={300}
          y={30}
          text={t(
            '计数：每个完成分裂后的细胞',
            'Counts: per cell at completed checkpoints',
          )}
          small
        />
        <L
          mode={mode}
          x={300}
          y={279}
          text={t(
            `${state.cells}细胞；每个${state.sets}套；${state.chromosomes}条染色体`,
            `${state.cells} cell(s); ${state.sets} sets and ${state.chromosomes} chromosomes each`,
          )}
          small
        />
        <L
          mode={mode}
          x={300}
          y={319}
          text={t(
            `每个${state.chromatids}条染色单体；${state.dna}C DNA`,
            `${state.chromatids} chromatids; ${state.dna}C DNA each`,
          )}
          small
        />
      </Scene>
      <p>
        <Text mode={mode} text={divisionSteps[frame]!} />
      </p>
      <Notes
        mode={mode}
        items={divisionSteps}
        limits={t(
          '原创2n=4账本，非按比例；只画完成检查点，不用于后期单细胞瞬间计数。颜色区分示意同源来源，不代表基因身份；未画交叉互换，真实减数分裂可通过重组与独立分配产生变异，不是因“需要”而挑选。',
          'Original 2n=4 accounting, not to scale; completed checkpoints only, not transient anaphase counts. Colours distinguish illustrative homologues, not gene identity. Crossing over is omitted; recombination and independent assortment generate variation without choosing what is needed.',
        )}
      />
    </>
  );
}
function Variation({
  mode,
  onExplore,
  interactive = true,
}: Props & { interactive?: boolean }) {
  const [environment, E] = useState(0),
    [g, G] = useState(3);
  return (
    <>
      {interactive && (
        <div className="pi-controls">
          <Slider
            mode={mode}
            title={t(
              '环境指数（虚构0–2）',
              'Environment index (fictional 0–2)',
            )}
            value={environment}
            max={2}
            change={(v) => {
              E(v);
              onExplore();
            }}
          />
          <Slider
            mode={mode}
            title={t(
              '三个基因座的贡献等位基因数',
              'Contributing alleles across three loci',
            )}
            value={g}
            max={6}
            change={(v) => {
              G(v);
              onExplore();
            }}
          />
        </div>
      )}
      <Scene
        mode={mode}
        title={t(
          '虚构植物性状分布和环境响应',
          'Fictional plant trait distribution and environmental response',
        )}
      >
        <path d="M55 45v210h500" fill="none" stroke="#35544b" strokeWidth="2" />
        {traitDistribution(environment).map((b, i) => (
          <g key={i}>
            <rect
              x={65 + i * 70}
              y={255 - b.count * 8}
              width="40"
              height={b.count * 8}
              fill={g === i ? '#ac7542' : '#719d88'}
            />
            <text
              x={85 + i * 70}
              y={245 - b.count * 8}
              textAnchor="middle"
              fontSize="14"
            >
              {b.count}
            </text>
            <text x={85 + i * 70} y="276" textAnchor="middle" fontSize="13">
              {b.size}
            </text>
          </g>
        ))}
        <L
          mode={mode}
          x={300}
          y={25}
          text={t(
            '数量 / 株（固定64株的期望分布）',
            'Count / plants (expected distribution of 64)',
          )}
          small
        />
        <L
          mode={mode}
          x={300}
          y={309}
          text={t(
            '株高 / 虚构单位；不是真实品种',
            'Height / invented units; not a real cultivar',
          )}
          small
        />
      </Scene>
      <p className="pi-result">
        <Text
          mode={mode}
          text={t(
            `选择G=${g}：环境0→2，性状${plantTrait(g, 0)}→${plantTrait(g, 2)}；当前${plantTrait(g, environment)}。`,
            `For G=${g}: environment 0→2 changes trait ${plantTrait(g, 0)}→${plantTrait(g, 2)}; current ${plantTrait(g, environment)}.`,
          )}
        />
      </p>
      <Notes
        mode={mode}
        items={[
          t(
            '三对独立基因座，各贡献0、1、2个等位基因单位；G总数0–6。期望组数1、6、15、20、15、6、1，总计64。',
            'Three independent loci each contribute 0,1 or 2 allele units; total G=0–6. Expected group counts are 1,6,15,20,15,6,1, summing to 64.',
          ),
          t(
            '固定G=3，环境0→2使性状16→28：同基因型也可有不同表现。',
            'At G=3, environment 0→2 changes size 16→28: the same genotype may have different phenotypes.',
          ),
          t(
            '环境0时G=0→6使性状10→22；环境2时同一比较为16→40。环境作用随G而变，属于交互。',
            'At environment 0, G=0→6 gives size 10→22; at environment 2 the comparison is 16→40. Environmental effects depend on G: an interaction.',
          ),
          t(
            '多个基因加上环境常形成连续变化；连续分布不证明纯遗传，离散类别也不证明单基因。只看直方图不能分离两者贡献。',
            'Multiple genes plus environment often produce continuous variation. Continuity does not establish purely genetic control; discrete categories do not prove one gene. A histogram alone cannot separate causes.',
          ),
        ]}
        limits={t(
          '原创虚构模型Y=10+2G+3E+GE；固定独立基因座与等概率组合，无噪声，所以仅7组，并非真实连续样本。不是人类能力或健康风险模型；不能从该图估计遗传率。',
          'Original fictional model Y=10+2G+3E+GE; independent loci, equal combinations and no noise give only seven groups, not a real continuous sample. No model of human ability or health; heritability cannot be estimated from this graph.',
        )}
      />
    </>
  );
}
const views = {
  L105: Transport,
  L106: Transpiration,
  L107: Photo,
  L108: Flower,
  L109: DNA,
  L110: Expression,
  L111: Division,
  L112: Variation,
};
export function PlantInformationExplore(props: Props) {
  const View = views[props.id.slice(0, 4) as keyof typeof views];
  return View ? (
    <div className="bio-s5-lab pi-lab">
      <p className="pi-hint">
        <Text
          mode={props.mode}
          text={t(
            '图可用Tab聚焦后用左右方向键滚动；参数为原创教学模型。',
            'Focus the diagram with Tab and use arrow keys to scroll; parameters belong to an original teaching model.',
          )}
        />
      </p>
      <View {...props} />
    </div>
  ) : null;
}
export function PlantInformationDiagram(props: ViewProps) {
  const View = views[props.id.slice(0, 4) as keyof typeof views];
  return View ? (
    <div className="bio-s5-lab pi-lab">
      <View {...props} onExplore={() => {}} interactive={false} />
    </div>
  ) : null;
}
export function PlantInformationHookArt(props: ViewProps) {
  return <PlantInformationDiagram {...props} />;
}
