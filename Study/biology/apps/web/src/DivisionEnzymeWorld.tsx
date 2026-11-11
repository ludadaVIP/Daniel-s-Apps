import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { Playback, useFrames } from './LabPlayback';
import {
  cellGeometry,
  cycleInventory,
  cycleStages,
  mitosisStages,
  orderMitosis,
  segregateSisters,
  expressionProfile,
  reactionEnergy,
  enzymeRate,
  enzymeCurve,
  defaultEnzymeConditions,
  enzymeEvidencePairs,
  catalyticTurnover,
  digestionRoute,
  type CellShape,
  type CellFate,
  type MitosisStage,
  type EnzymeConditions,
  type FoodSubstrate,
  type DigestiveAgent,
} from './divisionEnzymeModel';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const green = '#668454',
  blue = '#437d95',
  gold = '#b18837',
  red = '#ac6257';
const titles: Record<string, LocalizedText> = {
  L073: t('面积与体积的竞赛', 'Surface area versus volume'),
  L074: t('复制、检查、分配', 'Copy, check, distribute'),
  L075: t('追踪每一条姐妹染色单体', 'Trace each sister chromatid'),
  L076: t('同一套基因，不同的表达', 'Shared genes, different expression'),
  L077: t('比较同一起点与终点', 'Compare identical energy endpoints'),
  L078: t('结合、调整、反应、释放', 'Bind, adjust, react, release'),
  L079: t(
    '相同检测条件，不同处理历史',
    'Same assay, different treatment history',
  ),
  L080: t('大分子走哪条消化路线？', 'Which digestive route fits?'),
};
const stages = [
  t('前期', 'Prophase'),
  t('中期', 'Metaphase'),
  t('后期', 'Anaphase'),
  t('末期', 'Telophase'),
  t('胞质分裂', 'Cytokinesis'),
];
function Label({
  mode,
  text,
  x,
  y,
  size = 16,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#30422e" fontSize={size}>
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="20" fontSize={size - 1}>
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Scene({
  mode,
  id,
  children,
}: {
  mode: LanguageMode;
  id: string;
  children: ReactNode;
}) {
  const title = titles[id] ?? titles.L073!;
  return (
    <svg
      viewBox="0 0 600 380"
      role="img"
      aria-label={mode === 'en' ? title.en : `${title.zh} / ${title.en}`}
      style={{ width: '100%', display: 'block' }}
    >
      <title>
        {mode === 'en'
          ? title.en
          : mode === 'zh'
            ? title.zh
            : `${title.zh} / ${title.en}`}
      </title>
      <rect x="3" y="3" width="594" height="374" rx="22" fill="#f0f3e6" />
      {children}
    </svg>
  );
}
function Note({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <p aria-live="polite">
      <Text mode={mode} text={text} />
    </p>
  );
}
function Choice<T extends string>({
  mode,
  label,
  value,
  options,
  onChange,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: T;
  options: readonly { value: T; label: LocalizedText }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="bio-playback">
        {options.map((o) => (
          <button
            style={{ minHeight: 44, minWidth: 44 }}
            key={o.value}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            <Text mode={mode} text={o.label} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
type Figure = {
  id: string;
  mode: LanguageMode;
  frame?: number;
  side?: number;
  shape?: CellShape;
  fault?: boolean;
  fate?: CellFate;
  progenitors?: boolean;
  catalyst?: boolean;
  match?: boolean;
  substrate?: number;
  conditions?: EnzymeConditions;
  axis?: 'temperature' | 'pH';
  food?: FoodSubstrate;
  agent?: DigestiveAgent;
};
function Figure({
  id,
  mode,
  frame = 0,
  side = 2,
  shape = 'cube',
  fault = false,
  fate = 'skin',
  progenitors = true,
  catalyst = true,
  match = true,
  substrate = 4,
  conditions = defaultEnzymeConditions,
  axis = 'temperature',
  food = 'starch',
  agent = 'amylase',
}: Figure) {
  if (id === 'L073') {
    const g = cellGeometry(side, shape);
    return (
      <Scene mode={mode} id={id}>
        <Label
          mode={mode}
          x={300}
          y={35}
          text={t(
            '相同体积：立方体与扁平形',
            'Equal volume: cube and flattened shape',
          )}
        />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${i ? 355 : 100},120)`}>
            <rect
              width={i ? 180 : 110}
              height={i ? 40 : 110}
              fill={i && shape === 'flat' ? gold : blue}
              opacity=".45"
              stroke={green}
              strokeWidth="4"
            />
            <path
              d={
                i
                  ? 'M0,0 l25,-20 h180 v40 l-25,20 M180,0 l25,-20'
                  : 'M0,0 l25,-20 h110 v110 l-25,20 M110,0 l25,-20'
              }
              fill="none"
              stroke={green}
              strokeWidth="3"
            />
            <Label
              mode={mode}
              x={i ? 90 : 55}
              y={i ? 90 : 150}
              text={i ? t('扁平形', 'Flattened') : t('立方体', 'Cube')}
            />
          </g>
        ))}
        <Label
          mode={mode}
          x={300}
          y={310}
          text={t(
            `所选：A=${g.area.toFixed(1)} µm²；V=${g.volume.toFixed(1)} µm³`,
            `Selected: A=${g.area.toFixed(1)} µm²; V=${g.volume.toFixed(1)} µm³`,
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={355}
          text={t(
            `A/V=${g.ratio.toFixed(2)} µm⁻¹`,
            `A/V=${g.ratio.toFixed(2)} µm⁻¹`,
          )}
        />
      </Scene>
    );
  }
  if (id === 'L074') {
    const s = cycleStages[frame] ?? 'G1',
      v = cycleInventory(s);
    return (
      <Scene mode={mode} id={id}>
        {cycleStages.map((s, i) => (
          <g key={s}>
            <circle
              cx={70 + i * 115}
              cy="135"
              r="40"
              fill={i === frame ? gold : '#d8e0cc'}
              stroke={green}
              strokeWidth="3"
            />
            <text x={70 + i * 115} y="141" textAnchor="middle" fontSize="21">
              {s === 'daughter' ? '2×G1' : s}
            </text>
            {i < 4 && (
              <text x={128 + i * 115} y="141" textAnchor="middle">
                →
              </text>
            )}
          </g>
        ))}
        <Label
          mode={mode}
          x={300}
          y={65}
          text={t(
            'G1 → S → G2 → M → 两个子细胞',
            'G1 → S → G2 → M → two daughters',
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={235}
          text={t(
            `${v.ploidy}；染色体 ${v.chromosomes}；DNA ${v.dnaC}C`,
            `${v.ploidy}; chromosomes ${v.chromosomes}; DNA ${v.dnaC}C`,
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={300}
          text={t(
            frame === 1
              ? '显示S期结束；DNA逐渐复制，并非瞬间跳变'
              : frame === 3
                ? '显示中期；后期整细胞计数将短暂改变'
                : '计数为一个细胞或每个子细胞',
            frame === 1
              ? 'End of S shown; DNA replicates progressively'
              : frame === 3
                ? 'Metaphase shown; whole-anaphase count differs'
                : 'Counts per cell or per daughter',
          )}
        />
      </Scene>
    );
  }
  if (id === 'L075') {
    const separated = frame >= 2,
      r = segregateSisters(fault);
    return (
      <Scene mode={mode} id={id}>
        <Label mode={mode} x={300} y={40} text={stages[frame]!} />
        {frame < 4 ? (
          <ellipse
            cx="300"
            cy="200"
            rx="260"
            ry="125"
            fill="#dce6d6"
            stroke={green}
            strokeWidth="3"
          />
        ) : (
          [170, 430].map((x) => (
            <ellipse
              key={x}
              cx={x}
              cy="200"
              rx="124"
              ry="122"
              fill="#dce6d6"
              stroke={green}
              strokeWidth="3"
            />
          ))
        )}
        {frame > 0 &&
          frame < 3 &&
          [0, 1, 2, 3].map((i) => (
            <g key={i} opacity=".4">
              <path
                d={`M65,200 L${separated ? 160 : 300},${110 + i * 45} M535,200 L${separated ? 420 : 300},${110 + i * 45}`}
                stroke={gold}
                fill="none"
                strokeWidth="2"
              />
            </g>
          ))}
        {frame >= 3 &&
          [170, 430].map((x) => (
            <ellipse
              key={x}
              cx={x}
              cy="200"
              rx="95"
              ry="100"
              fill="#e9eef2"
              stroke={blue}
              strokeWidth="2"
            />
          ))}
        {!separated
          ? ['A', 'a', 'B', 'b'].map((h, i) => (
              <g
                key={h}
                transform={`translate(${frame === 1 ? 300 : 160 + i * 85},${frame === 1 ? 120 + i * 48 : 175})`}
              >
                <path
                  d="M-12,-18 L12,18 M12,-18 L-12,18"
                  stroke={i % 2 ? red : blue}
                  strokeWidth="7"
                />
                <text x="25" y="5" fontSize="17">
                  {h}1/{h}2
                </text>
              </g>
            ))
          : [r.left, r.right].map((copy, j) =>
              copy.map((h, i) => (
                <g
                  key={h}
                  transform={`translate(${j ? 420 : 160},${120 + i * 40})`}
                >
                  <path
                    d="M-5,-13 L5,13"
                    stroke={
                      h.charAt(0) === h.charAt(0).toUpperCase() ? blue : red
                    }
                    strokeWidth="7"
                  />
                  <text x="20" y="5" fontSize="17">
                    {h}
                  </text>
                </g>
              )),
            )}
        <Label
          mode={mode}
          x={300}
          y={350}
          text={t(
            separated
              ? `每端 ${r.left.length} / ${r.right.length} 条子染色体`
              : 'A与a是同源染色体；A1与A2是姐妹',
            separated
              ? `Daughter chromosomes per pole: ${r.left.length} / ${r.right.length}`
              : 'A and a: homologues; A1 and A2: sisters',
          )}
        />
      </Scene>
    );
  }
  if (id === 'L076') {
    const p = expressionProfile(fate, progenitors);
    return (
      <Scene mode={mode} id={id}>
        <Label
          mode={mode}
          x={300}
          y={40}
          text={t('相同DNA：K、M、N、H', 'Same DNA: K, M, N, H')}
        />
        <circle
          cx="110"
          cy="175"
          r="55"
          fill="#d3dfc9"
          stroke={green}
          strokeWidth="3"
        />
        <text x="110" y="180" textAnchor="middle" fontSize="20">
          DNA
        </text>
        <path
          d="M170,175 H260 M250,165 L260,175 L250,185"
          fill="none"
          stroke={blue}
          strokeWidth="4"
        />
        {p.genes.map((g, i) => (
          <g key={g}>
            <rect
              x={290 + i * 62}
              y="110"
              width="42"
              height="100"
              fill={p.active.includes(g) ? gold : '#d3d8cd'}
              stroke={green}
            />
            <text x={311 + i * 62} y="240" textAnchor="middle" fontSize="20">
              {g}
            </text>
            <text x={311 + i * 62} y="175" textAnchor="middle" fontSize="16">
              {p.active.includes(g) ? 'ON' : 'low'}
            </text>
          </g>
        ))}
        <Label
          mode={mode}
          x={300}
          y={300}
          text={t(
            '信号改变表达 → 蛋白质组合 → 细胞功能',
            'Signals → expression → proteins → cell function',
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={345}
          text={t(
            fate === 'nerve'
              ? '神经示例只比较表达，不预测修复'
              : progenitors
                ? '有可分裂的祖细胞：可补充相应细胞'
                : '缺少相应祖细胞：这条修复路线受限',
            fate === 'nerve'
              ? 'Neuronal profile: expression only, no repair prediction'
              : progenitors
                ? 'Dividing progenitors can supply suitable cells'
                : 'Without suitable progenitors, this repair route is limited',
          )}
        />
      </Scene>
    );
  }
  if (id === 'L077') {
    const e = reactionEnergy(catalyst);
    return (
      <Scene mode={mode} id={id}>
        <path d="M70,65 V300 H545" stroke={green} strokeWidth="3" fill="none" />
        <path
          d="M85,240 C170,240 200,65 290,65 S400,285 530,285"
          fill="none"
          stroke={red}
          strokeWidth="3"
          strokeDasharray="7 5"
        />
        {catalyst && (
          <path
            d="M85,240 C170,240 200,170 290,170 S400,285 530,285"
            fill="none"
            stroke={blue}
            strokeWidth="5"
          />
        )}
        <Label
          mode={mode}
          x={300}
          y={35}
          text={t(
            '纵轴：相对自由能（模型单位）',
            'Vertical: relative free energy (model units)',
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={340}
          text={t(
            '横轴：反应进程，不是时间',
            'Horizontal: reaction progress, not time',
          )}
        />
        <Label
          mode={mode}
          x={160}
          y={120}
          text={t('无酶的能垒', 'Uncatalysed barrier')}
        />
        <Label
          mode={mode}
          x={405}
          y={210}
          text={t(
            `活化能 ${e.activation}`,
            `Activation energy ${e.activation}`,
          )}
        />
        <text x="100" y="270" fontSize="18">
          R:20
        </text>
        <text x="465" y="267" fontSize="18">
          P:5
        </text>
      </Scene>
    );
  }
  if (id === 'L078') {
    const result = catalyticTurnover(substrate, 1, frame >= 3 ? 1 : 0, match);
    return (
      <Scene mode={mode} id={id}>
        <Label
          mode={mode}
          x={300}
          y={40}
          text={
            [
              t('相遇', 'Encounter'),
              t('结合与诱导契合', 'Binding and induced fit'),
              t('促进反应', 'Catalysis'),
              t('释放，再次使用', 'Release and reuse'),
            ][frame]!
          }
        />
        <path
          d={
            frame === 1 && match
              ? 'M130,230 V130 Q180,70 230,130 L205,160 L180,143 L155,160 L130,130 Z'
              : 'M130,230 V130 Q180,70 230,130 L205,175 L180,150 L155,175 L130,130 Z'
          }
          fill={blue}
          stroke={green}
          strokeWidth="3"
        />
        <Label
          mode={mode}
          x={180}
          y={275}
          text={t('酶E（保留）', 'Enzyme E (retained)')}
        />
        {substrate === 0 ? (
          <Label
            mode={mode}
            x={400}
            y={155}
            text={t('无底物，无新产物', 'No substrate, no new product')}
          />
        ) : frame < 3 || !match ? (
          <g
            transform={`translate(${frame > 0 && match ? 180 : 400},${frame > 0 && match ? 138 : 155})`}
          >
            <path
              d={
                match
                  ? 'M-23,0 L0,-23 L23,0 L0,23 Z'
                  : 'M-23,-20 H23 V20 H-23 Z'
              }
              fill={gold}
            />
          </g>
        ) : (
          <g>
            <circle cx="370" cy="140" r="20" fill={gold} />
            <circle cx="430" cy="180" r="20" fill={red} />
          </g>
        )}
        <Label
          mode={mode}
          x={400}
          y={245}
          text={t(
            match ? '底物A → 产物' : '底物B：本模型不催化',
            match ? 'Substrate A → products' : 'Substrate B: no catalysis here',
          )}
        />
        <Label
          mode={mode}
          x={300}
          y={335}
          text={t(
            `剩余底物 ${result.substrate}；转换 ${result.product}；酶 ${result.enzyme}`,
            `Substrate left ${result.substrate}; converted ${result.product}; enzyme ${result.enzyme}`,
          )}
        />
      </Scene>
    );
  }
  if (id === 'L079') {
    const curve = enzymeCurve(axis, conditions),
      max = axis === 'temperature' ? 80 : 14;
    const line = curve
      .map(
        (p, i) =>
          `${i ? 'L' : 'M'}${80 + (p.x / max) * 450},${290 - p.rate * 2.4}`,
      )
      .join(' ');
    const x = axis === 'temperature' ? conditions.temperatureC : conditions.pH;
    return (
      <Scene mode={mode} id={id}>
        <Label
          mode={mode}
          x={300}
          y={35}
          text={t(
            '初始速率：任意单位（非实测数据）',
            'Initial rate: arbitrary units (fictional data)',
          )}
        />
        <path d="M80,70 V290 H545" fill="none" stroke={green} strokeWidth="3" />
        {[0, 40, 80].map((y) => (
          <g key={y}>
            <text x="65" y={295 - y * 2.4} textAnchor="end" fontSize="15">
              {y}
            </text>
            <path d={`M80,${290 - y * 2.4} H530`} stroke="#d3ddcb" />
          </g>
        ))}
        <path d={line} fill="none" stroke={blue} strokeWidth="4" />
        <circle
          cx={80 + (x / max) * 450}
          cy={290 - enzymeRate(conditions) * 2.4}
          r="7"
          fill={red}
        />
        {[0, max / 2, max].map((v) => (
          <text
            key={v}
            x={80 + (v / max) * 450}
            y="315"
            textAnchor="middle"
            fontSize="16"
          >
            {v}
          </text>
        ))}
        <Label
          mode={mode}
          x={300}
          y={345}
          text={
            axis === 'temperature'
              ? t('温度 / °C', 'Temperature / °C')
              : t('pH（无单位）', 'pH (dimensionless)')
          }
        />
      </Scene>
    );
  }
  const r = digestionRoute(food, agent);
  return (
    <Scene mode={mode} id={id}>
      <Label
        mode={mode}
        x={300}
        y={35}
        text={t(
          '食物种类 → 合适作用 → 后续路线',
          'Food type → suitable action → later steps',
        )}
      />
      {food === 'fat' && !(frame >= 2 && r.matched) ? (
        <circle
          cx="185"
          cy="150"
          r="67"
          fill={red}
          opacity=".7"
          stroke={green}
          strokeWidth="3"
        />
      ) : (
        <>
          {food !== 'fat' &&
            Array.from(
              { length: 7 },
              (_, i) =>
                !(frame >= 2 && r.chemical && r.matched && i % 2 === 1) && (
                  <line
                    key={`bond${i}`}
                    x1={90 + i * 24}
                    y1={
                      130 +
                      (frame >= 2 && r.matched ? Math.floor(i / 2) * 25 : 0)
                    }
                    x2={114 + i * 24}
                    y2={
                      130 +
                      (frame >= 2 && r.matched
                        ? Math.floor((i + 1) / 2) * 25
                        : 0)
                    }
                    stroke={green}
                    strokeWidth="5"
                  />
                ),
            )}
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={90 + i * 24}
              cy={130 + (frame >= 2 && r.matched ? Math.floor(i / 2) * 25 : 0)}
              r="16"
              fill={food === 'starch' ? gold : food === 'protein' ? blue : red}
              stroke={green}
              strokeWidth="2"
            />
          ))}
        </>
      )}
      <path
        d="M310,150 H390 l-12,-10 M390,150 l-12,10"
        fill="none"
        stroke={green}
        strokeWidth="4"
      />
      <rect x="410" y="110" width="140" height="95" rx="15" fill="#d2dec5" />
      <Label
        mode={mode}
        x={480}
        y={145}
        text={t(
          agent === 'bile' ? '乳化' : '酶作用',
          agent === 'bile' ? 'Emulsification' : 'Enzyme action',
        )}
      />
      <Label
        mode={mode}
        x={300}
        y={260}
        text={t(
          frame === 0
            ? '选择底物与作用物'
            : !r.matched
              ? '这条路线不匹配'
              : frame === 1
                ? agent === 'bile'
                  ? '胆盐接触脂滴界面'
                  : '合适酶与底物接触、结合'
                : agent === 'bile'
                  ? '小液滴，脂肪分子仍相同'
                  : frame < 3
                    ? '特定化学键被水解'
                    : '产物还需正确的后续处理',
          frame === 0
            ? 'Choose substrate and agent'
            : !r.matched
              ? 'Selected route does not match'
              : frame === 1
                ? agent === 'bile'
                  ? 'Bile salts contact the droplet interface'
                  : 'Suitable enzyme contacts and binds substrate'
                : agent === 'bile'
                  ? 'Smaller droplets; same fat molecules'
                  : frame < 3
                    ? 'Specific bonds undergo hydrolysis'
                    : 'Products need appropriate later processing',
        )}
      />
      <Label
        mode={mode}
        x={300}
        y={325}
        text={t(
          '示意图不表示分子的真实数量与比例',
          'Symbols do not show molecular counts or scale',
        )}
      />
    </Scene>
  );
}
export function DivisionEnzymeDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return (
    <Figure
      id={id}
      mode={mode}
      frame={id === 'L075' ? 2 : id === 'L074' ? 1 : id === 'L078' ? 1 : 0}
    />
  );
}
export function DivisionEnzymeHookArt({
  id,
  mode = 'bilingual',
}: {
  id: string;
  mode?: LanguageMode;
}) {
  return <DivisionEnzymeDiagram id={id} mode={mode} />;
}
export function DivisionEnzymeExplore({ id, mode, onExplore }: Props) {
  const flow = useFrames(id === 'L074' || id === 'L075' ? 4 : 3, onExplore);
  const [side, setSide] = useState(2),
    [shape, setShape] = useState<CellShape>('cube'),
    [damage, setDamage] = useState(false),
    [fault, setFault] = useState(false),
    [fate, setFate] = useState<CellFate>('skin'),
    [progenitors, setProgenitors] = useState(true),
    [catalyst, setCatalyst] = useState(true),
    [match, setMatch] = useState(true),
    [substrate, setSubstrate] = useState(4),
    [conditions, setConditions] = useState<EnzymeConditions>(
      defaultEnzymeConditions,
    ),
    [axis, setAxis] = useState<'temperature' | 'pH'>('temperature'),
    [food, setFood] = useState<FoodSubstrate>('starch'),
    [agent, setAgent] = useState<DigestiveAgent>('amylase'),
    [cards, setCards] = useState<MitosisStage[]>([
      'metaphase',
      'prophase',
      'telophase',
      'anaphase',
      'cytokinesis',
    ]),
    [selected, setSelected] = useState(0);
  const act = (fn: () => void) => {
    fn();
    onExplore();
  };
  const change = (patch: Partial<EnzymeConditions>) =>
    act(() => setConditions((c) => ({ ...c, ...patch })));
  const figureFrame = id === 'L074' && damage ? 2 : flow.frame;
  const inventory = cycleInventory(cycleStages[figureFrame] ?? 'G1');
  const rate = enzymeRate(conditions),
    digestion = digestionRoute(food, agent);
  const booleanOptions = [
    { value: 'yes', label: t('是', 'Yes') },
    { value: 'no', label: t('否', 'No') },
  ] as const;
  return (
    <div className="bio-lab bio-s3-lab">
      <h3>
        <Text mode={mode} text={titles[id] ?? titles.L073!} />
      </h3>
      {id === 'L073' && (
        <>
          <label>
            <Text
              mode={mode}
              text={t(`基准边长 l=${side} µm`, `Reference length l=${side} µm`)}
            />
            <input
              type="range"
              min="1"
              max="8"
              value={side}
              onChange={(e) => act(() => setSide(+e.target.value))}
            />
          </label>
          <Choice
            mode={mode}
            label={t('保持体积，改变形状', 'Hold volume; change shape')}
            value={shape}
            onChange={(v) => act(() => setShape(v))}
            options={[
              { value: 'cube', label: t('立方体', 'Cube') },
              { value: 'flat', label: t('扁平形', 'Flattened') },
            ]}
          />
        </>
      )}
      {id === 'L074' && (
        <Choice
          mode={mode}
          label={t(
            'G2检查时仍有未修复的DNA损伤？',
            'Unrepaired DNA damage at G2 check?',
          )}
          value={damage ? 'yes' : 'no'}
          options={booleanOptions}
          onChange={(v) =>
            act(() => {
              setDamage(v === 'yes');
              flow.reset();
            })
          }
        />
      )}
      {id === 'L075' && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '先把阶段卡排序。选一张卡，再用前移/后移；全部操作可用键盘。',
                'Order the stage cards first. Select a card, then move earlier/later; all actions work with the keyboard.',
              )}
            />
          </p>
          <div className="bio-playback">
            {cards.map((c, i) => (
              <button
                style={{ minHeight: 44, minWidth: 44 }}
                key={c}
                aria-pressed={selected === i}
                onClick={() => act(() => setSelected(i))}
              >
                {i + 1}.{' '}
                <Text mode={mode} text={stages[mitosisStages.indexOf(c)]!} />
              </button>
            ))}
          </div>
          <div className="bio-playback">
            {[-1, 1].map((direction) => (
              <button
                style={{ minHeight: 44, minWidth: 44 }}
                key={direction}
                disabled={selected + direction < 0 || selected + direction > 4}
                onClick={() =>
                  act(() => {
                    const next = [...cards];
                    [next[selected], next[selected + direction]] = [
                      next[selected + direction]!,
                      next[selected]!,
                    ];
                    setCards(next);
                    setSelected(selected + direction);
                  })
                }
              >
                <Text
                  mode={mode}
                  text={
                    direction < 0
                      ? t('前移', 'Move earlier')
                      : t('后移', 'Move later')
                  }
                />
              </button>
            ))}
          </div>
          <Note
            mode={mode}
            text={
              orderMitosis(cards)
                ? t(
                    '顺序正确。现在逐步追踪姐妹分离；A和a不在这里彼此配对分离。',
                    'Order correct. Trace sister separation; A and a are not paired and segregated from each other here.',
                  )
                : t(
                    '还需修正：先凝缩，再排列，姐妹随后分离；核重建后分开胞质。',
                    'Revise: condensation precedes alignment and sister separation; nuclei reform before the final cytoplasmic split.',
                  )
            }
          />
          <Choice
            mode={mode}
            label={t(
              '比较一次假设的错误分离',
              'Compare a hypothetical segregation error',
            )}
            value={fault ? 'yes' : 'no'}
            options={booleanOptions}
            onChange={(v) =>
              act(() => {
                setFault(v === 'yes');
                flow.reset();
              })
            }
          />
        </>
      )}
      {id === 'L076' && (
        <>
          <Choice
            mode={mode}
            label={t(
              '局部信号指定的示例细胞',
              'Example cell identity specified by signals',
            )}
            value={fate}
            onChange={(v) => act(() => setFate(v))}
            options={[
              {
                value: 'skin',
                label: t(
                  '有核的已分化表皮细胞',
                  'Living differentiated epidermal cell',
                ),
              },
              { value: 'muscle', label: t('肌肉', 'Muscle') },
              { value: 'nerve', label: t('神经', 'Neuronal') },
            ]}
          />
          {fate !== 'nerve' && (
            <Choice
              mode={mode}
              label={t(
                '组织中有合适且可分裂的祖细胞？',
                'Suitable dividing progenitors present?',
              )}
              value={progenitors ? 'yes' : 'no'}
              options={booleanOptions}
              onChange={(v) => act(() => setProgenitors(v === 'yes'))}
            />
          )}
        </>
      )}
      {id === 'L077' && (
        <Choice
          mode={mode}
          label={t(
            '加入催化酶，比较同一反应',
            'Add an enzyme to the same reaction',
          )}
          value={catalyst ? 'yes' : 'no'}
          options={booleanOptions}
          onChange={(v) => act(() => setCatalyst(v === 'yes'))}
        />
      )}
      {id === 'L078' && (
        <>
          <Choice
            mode={mode}
            label={t(
              '选择底物，保持酶E不变',
              'Select substrate; keep enzyme E fixed',
            )}
            value={match ? 'A' : 'B'}
            options={[
              { value: 'A', label: t('匹配的底物A', 'Matching substrate A') },
              {
                value: 'B',
                label: t('本模型不匹配的B', 'Non-matching B here'),
              },
            ]}
            onChange={(v) =>
              act(() => {
                setMatch(v === 'A');
                flow.reset();
              })
            }
          />
          <label>
            <Text
              mode={mode}
              text={t(
                `初始底物：${substrate} 个模型单位`,
                `Starting substrate: ${substrate} model units`,
              )}
            />
            <input
              type="range"
              min="0"
              max="8"
              value={substrate}
              onChange={(e) =>
                act(() => {
                  setSubstrate(+e.target.value);
                  flow.reset();
                })
              }
            />
          </label>
        </>
      )}
      {id === 'L079' && (
        <>
          <Choice
            mode={mode}
            label={t(
              '曲线横轴（改变一种因素）',
              'Curve axis (vary one factor)',
            )}
            value={axis}
            options={[
              { value: 'temperature', label: t('温度', 'Temperature') },
              { value: 'pH', label: t('pH', 'pH') },
            ]}
            onChange={(v) => act(() => setAxis(v))}
          />
          <label>
            <Text
              mode={mode}
              text={t(
                `检测温度：${conditions.temperatureC} °C`,
                `Assay temperature: ${conditions.temperatureC} °C`,
              )}
            />
            <input
              type="range"
              min="0"
              max="80"
              value={conditions.temperatureC}
              onChange={(e) => change({ temperatureC: +e.target.value })}
            />
          </label>
          <label>
            pH: {conditions.pH}
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={conditions.pH}
              onChange={(e) => change({ pH: +e.target.value })}
            />
          </label>
          <Choice
            mode={mode}
            label={t(
              '独立制备样品的处理历史',
              'Treatment history of separately prepared samples',
            )}
            value={conditions.history}
            options={[
              { value: 'fresh', label: t('新鲜样品', 'Fresh') },
              {
                value: 'cooled',
                label: t('曾冷藏，结构保持', 'Previously chilled, intact'),
              },
              {
                value: 'heated',
                label: t('曾75°C处理10分钟', 'Previously 75°C for 10 min'),
              },
            ]}
            onChange={(v) => change({ history: v })}
          />
          <div className="bio-playback">
            {enzymeEvidencePairs.map((pair) => (
              <button
                style={{ minHeight: 44, minWidth: 44 }}
                key={pair.id}
                onClick={() => act(() => setConditions(pair.after))}
              >
                <Text
                  mode={mode}
                  text={
                    pair.id === 'cold-rewarm'
                      ? t('冷藏后回到40°C检测', 'Chill then assay at 40°C')
                      : t('热处理后回到40°C检测', 'Heat then assay at 40°C')
                  }
                />
              </button>
            ))}
          </div>
        </>
      )}
      {id === 'L080' && (
        <>
          <Choice
            mode={mode}
            label={t('食物底物', 'Food substrate')}
            value={food}
            options={[
              { value: 'starch', label: t('淀粉', 'Starch') },
              { value: 'protein', label: t('蛋白质', 'Protein') },
              { value: 'fat', label: t('甘油三酯', 'Triglyceride') },
            ]}
            onChange={(v) =>
              act(() => {
                setFood(v);
                flow.reset();
              })
            }
          />
          <Choice
            mode={mode}
            label={t('选择一种作用物', 'Select one agent')}
            value={agent}
            options={[
              { value: 'amylase', label: t('淀粉酶', 'Amylase') },
              { value: 'protease', label: t('蛋白酶', 'Protease') },
              { value: 'lipase', label: t('脂肪酶', 'Lipase') },
              {
                value: 'bile',
                label: t('胆汁（非酶）', 'Bile (not an enzyme)'),
              },
            ]}
            onChange={(v) =>
              act(() => {
                setAgent(v);
                flow.reset();
              })
            }
          />
        </>
      )}
      <Figure
        id={id}
        mode={mode}
        frame={figureFrame}
        side={side}
        shape={shape}
        fault={fault}
        fate={fate}
        progenitors={progenitors}
        catalyst={catalyst}
        match={match}
        substrate={substrate}
        conditions={conditions}
        axis={axis}
        food={food}
        agent={agent}
      />
      {['L074', 'L075', 'L078', 'L080'].includes(id) &&
        !(id === 'L074' && damage) && <Playback mode={mode} flow={flow} />}
      {id === 'L073' && (
        <>
          <table>
            <caption>
              <Text
                mode={mode}
                text={t(
                  '尺寸表；面积单位µm²，体积µm³，比例µm⁻¹',
                  'Dimensions table; area µm², volume µm³, ratio µm⁻¹',
                )}
              />
            </caption>
            <thead>
              <tr>
                {[
                  t('形状', 'Shape'),
                  t('三条边/µm', 'Edges/µm'),
                  t('面积', 'Area'),
                  t('体积', 'Volume'),
                  t('面积/体积', 'Area/volume'),
                ].map((x) => (
                  <th key={x.en}>
                    <Text mode={mode} text={x} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['cube', 'flat'] as const).map((s) => {
                const g = cellGeometry(side, s);
                return (
                  <tr key={s}>
                    <td>
                      <Text
                        mode={mode}
                        text={
                          s === 'cube'
                            ? t('立方体', 'Cube')
                            : t('扁平形', 'Flattened')
                        }
                      />
                    </td>
                    <td>{g.dimensions.join(' × ')}</td>
                    <td>{g.area.toFixed(2)}</td>
                    <td>{g.volume.toFixed(2)}</td>
                    <td>{g.ratio.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Note
            mode={mode}
            text={t(
              '立方体 A=6l²，V=l³，A/V=6/l。l从2到4：面积24→96，体积8→64，比例3→1.5。扁平形以4l、l、l/4保持同体积；面积较大。模型没有计算真实交换速率，浓度梯度、运输蛋白、代谢和内部运输也会限制大小。',
              'Cube: A=6l², V=l³, A/V=6/l. From l=2 to 4: area 24→96, volume 8→64, ratio 3→1.5. Flattening to 4l, l, l/4 holds volume constant while increasing area. Real exchange rates are not calculated: gradients, transport proteins, metabolism and internal transport also matter.',
            )}
          />
        </>
      )}
      {id === 'L074' && (
        <Note
          mode={mode}
          text={
            damage
              ? t(
                  'G2检查暂停：本模型阻止进入M。修复选“否”后可重新比较。真实检查点会降低风险，并不保证每个错误被发现。',
                  'Held at the G2 check: this model prevents M entry. Select No after hypothetical repair to compare again. Real checkpoints reduce risk; they do not guarantee that every error is detected.',
                )
              : t(
                  `当前每细胞/每子细胞：${inventory.chromosomes}条染色体，DNA ${inventory.dnaC}C，${inventory.chromatids}条染色单体。S为结束时，M为中期。S并未把2n变成4n；后期姐妹分开后整细胞暂有8条染色体，但每端仍各4条。阶段格不是等长时间。`,
                  `Per cell/daughter now: ${inventory.chromosomes} chromosomes, DNA ${inventory.dnaC}C, ${inventory.chromatids} chromatids. S means its end; M means metaphase. S does not change 2n to 4n. After sisters separate, the whole anaphase cell briefly has 8 chromosomes, with 4 per pole. Steps are not equal durations.`,
                )
          }
        />
      )}
      {id === 'L075' && (
        <Note
          mode={mode}
          text={
            fault
              ? t(
                  '错误对照：A2也走到左端，成为5比3。总数守恒不代表分配正确；比较每端的A、a、B、b身份。正常情况下每个子细胞保留两对同源染色体。',
                  'Error comparison: A2 also goes left, giving 5 versus 3. Conserving the total does not ensure correct distribution; compare A, a, B and b at each pole. Normally each daughter retains both homologous pairs.',
                )
              : t(
                  '静态路线：前期凝缩→中期排列→后期姐妹分离→末期核重建→胞质分裂。A/a及B/b是两对同源；A1/A2才是复制产生的姐妹。理想复制、无新突变且分离正确时，两个子细胞获得相同核遗传信息。',
                  'Static route: prophase condensation → metaphase alignment → anaphase sister separation → telophase nuclear reformation → cytokinesis. A/a and B/b are homologous pairs; A1/A2 are copied sisters. With faithful replication, no new mutation and correct segregation, daughters receive the same nuclear genetic information.',
                )
          }
        />
      )}
      {id === 'L076' && (
        <Note
          mode={mode}
          text={t(
            'K/M/N/H是虚构基因组：K代表表皮相关蛋白，M肌肉相关，N神经相关，H共同维持功能。ON/low不是现实的开关全貌。成熟细胞不都能分裂，也不都能变成任何细胞；修复取决于组织、适合的干/祖细胞、信号与血供。本活动不要求个人伤口测试。',
            'K/M/N/H are fictional: K represents epidermal proteins, M muscle-related, N neuron-related and H shared maintenance. ON/low simplifies quantitative expression. Mature cells do not all divide or become any cell type; repair depends on tissue, suitable stem/progenitor cells, signals and blood supply. No personal wound test is needed.',
          )}
        />
      )}
      {id === 'L077' && (
        <Note
          mode={mode}
          text={t(
            `活化能${reactionEnergy(catalyst).activation}；反应物20、产物5，所以ΔG始终−15模型单位。酶稳定过渡态，改变反应路径和达到平衡的速度，不改变平衡位置，不提供凭空能量，净反应不消耗酶。横轴不是时间，因此本图用条件比较。`,
            `Activation energy ${reactionEnergy(catalyst).activation}; reactants 20 and products 5, so ΔG remains −15 model units. An enzyme stabilises the transition state and changes the route and speed of approaching equilibrium, not the equilibrium position. It supplies no free energy and is not consumed overall. The horizontal axis is not time, so this is a condition comparison.`,
          )}
        />
      )}
      {id === 'L078' && (
        <Note
          mode={mode}
          text={t(
            '静态步骤：相遇→结合并调整→催化→释放。相互作用取决于形状与化学性质，酶并非完全刚性的锁。只在释放这一步记一次底物转换；没底物就没有产物，B在本选定反应中不匹配并非所有酶都不能作用于B。增加底物在酶饱和后不会无限加速。',
            'Static steps: encounter → binding and adjustment → catalysis → release. Shape and chemistry matter; enzymes are not rigid locks. One substrate unit is converted at release. No substrate means no product. B mismatches this selected reaction, not every enzyme. Adding substrate cannot increase rate without limit once enzymes saturate.',
          )}
        />
      )}
      {id === 'L079' && (
        <>
          <Note
            mode={mode}
            text={t(
              `当前初始速率=${rate.toFixed(1)}任意单位；酶量1、底物浓度8任意单位。本虚构E的新鲜样品适宜点40°C、pH7；绝非所有酶的最适条件。曲线各点是独立样品，不是同一样品一路升温。75°C×10分钟假设使92%失活，冷却后仍保留这个历史；滑块本身不模拟处理历史。`,
              `Current initial rate=${rate.toFixed(1)} arbitrary units; enzyme amount 1, substrate concentration 8 arbitrary units. Fresh fictional E has its model optimum at 40°C and pH7; this is not universal. Each curve point is a separately prepared sample, not one continuously heated sample. A prior 75°C × 10 min treatment is assumed to inactivate 92%, persisting after cooling. Sliders alone do not simulate treatment history.`,
            )}
          />
          <table>
            <caption>
              <Text
                mode={mode}
                text={t(
                  '处理前后对照；检测pH固定7，酶量与底物相同',
                  'Treatment comparisons; assay pH 7, same enzyme amount and substrate',
                )}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('历史', 'History')} />
                </th>
                <th>
                  <Text mode={mode} text={t('处理后首次检测', 'First assay')} />
                </th>
                <th>
                  <Text mode={mode} text={t('回到40°C检测', 'Assay at 40°C')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {enzymeEvidencePairs.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Text
                      mode={mode}
                      text={
                        p.id === 'cold-rewarm'
                          ? t('冷藏（结构保持）', 'Chilled (intact)')
                          : t('75°C处理10分钟', '75°C for 10 min')
                      }
                    />
                  </td>
                  <td>
                    {p.before.temperatureC}°C: {enzymeRate(p.before).toFixed(1)}
                  </td>
                  <td>40°C: {enzymeRate(p.after).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Note
            mode={mode}
            text={t(
              '低温减慢通常不等于变性；极端pH可能改变电荷、结合与结构，恢复pH是否恢复活性取决于损伤。本模型未模拟每种pH处理的可逆性、测量噪声、时间依赖与真实蛋白折叠。',
              'Cold slowdown usually differs from denaturation. Extreme pH can alter charge, binding and structure; recovery depends on damage. The model does not simulate every pH treatment’s reversibility, measurement noise, time dependence or actual protein folding.',
            )}
          />
        </>
      )}
      {id === 'L080' && (
        <Note
          mode={mode}
          text={t(
            digestion.matched
              ? agent === 'bile'
                ? '胆汁把脂肪分散成较小液滴，增加界面；它不水解化学键，也不是酶。再选脂肪酶比较。'
                : food === 'starch'
                  ? '淀粉酶产生麦芽糖和较短寡糖；还需小肠其他酶生成葡萄糖。'
                  : food === 'protein'
                    ? '蛋白酶先形成较短肽；进一步由蛋白酶与肽酶生成可吸收的氨基酸。'
                    : '小肠中的胰脂肪酶主要产生脂肪酸与单甘油酯；乳化有助于界面接触，但不替代脂肪酶。'
              : '所选作用物不在本路线中催化此底物。保持底物不变，换合适作用物作对照。',
            `${digestion.product}; ${digestion.next}. Digestion and absorption are different processes. This is a selected route under suitable conditions, not a complete digestive tract. No bodily fluids, tasting or home pH experiments.`,
          )}
        />
      )}
    </div>
  );
}
