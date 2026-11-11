import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  atpBudget,
  combine,
  chromosomeCounts,
  photoCurve,
  photosynthesisRate,
  punnett,
  sampleOffspring,
  type Genotype,
  type PhotoConditions,
  type RespirationRoute,
} from './energyGeneModel';

type Props = { id: string; mode: LanguageMode };
const green = '#557d59',
  blue = '#407f9c',
  gold = '#bd8a30',
  red = '#ad596c';
const titles: Record<string, LocalizedText> = {
  L081: t('原子从哪里来？', 'Where do the atoms come from?'),
  L082: t('寻找限制因素', 'Find the bottleneck'),
  L083: t('同一份糖，不同路线', 'One glucose, different routes'),
  L084: t('ATP的收支与再生', 'ATP use and regeneration'),
  L085: t('同源不是姐妹', 'Homologues are not sisters'),
  L086: t('一次复制，两次分裂', 'One replication, two divisions'),
  L087: t('每方贡献一个等位基因', 'One allele from each parent'),
  L088: t('概率与一次样本', 'Probability and one sample'),
};
function Label({
  x,
  y,
  text,
  mode,
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="14" fill="#243a32">
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="17" fontSize="12">
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Scene({ id, mode, children }: Props & { children: ReactNode }) {
  const title =
    titles[id] ?? t('物质、能量与遗传', 'Matter, energy and inheritance');
  return (
    <svg
      viewBox="0 0 560 340"
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
      <rect x="4" y="4" width="552" height="332" rx="20" fill="#f2f5ec" />
      {children}
    </svg>
  );
}
function Arrow({ x, y, width = 65 }: { x: number; y: number; width?: number }) {
  return (
    <g stroke={blue} strokeWidth="3">
      <path d={`M${x},${y}h${width}`} />
      <path d={`M${x + width - 8},${y - 6}l8,6l-8,6`} fill="none" />
    </g>
  );
}
function Chromosome({
  x,
  y,
  color = blue,
  replicated = false,
  cross = false,
  allele = 'A',
  faded = false,
}: {
  x: number;
  y: number;
  color?: string;
  replicated?: boolean;
  cross?: boolean;
  allele?: string;
  faded?: boolean;
}) {
  return (
    <g opacity={faded ? 0.2 : 1} strokeLinecap="round" strokeWidth="8">
      <path
        d={
          replicated
            ? `M${x - 10},${y - 27}L${x + 10},${y + 27}`
            : `M${x},${y - 27}V${y + 27}`
        }
        stroke={color}
      />
      {replicated && (
        <path d={`M${x + 10},${y - 27}L${x - 10},${y + 27}`} stroke={color} />
      )}
      {cross && (
        <path
          d={
            replicated
              ? `M${x + 3},${y + 8}L${x + 10},${y + 27}`
              : `M${x},${y + 8}V${y + 27}`
          }
          stroke={color === blue ? red : blue}
        />
      )}
      <circle cx={x} cy={y} r="5" fill="#243a32" stroke="none" />
      <text x={x + 16} y={y - 12} stroke="none" fontSize="14" fill="#243a32">
        {allele}
      </text>
    </g>
  );
}
type FigureProps = Props & {
  frame?: number;
  trace?: 'carbon' | 'oxygen';
  conditions?: PhotoConditions;
  variable?: keyof PhotoConditions;
  route?: RespirationRoute;
  regenerate?: boolean;
  demand?: number;
  replicated?: boolean;
  cross?: boolean;
  swap?: boolean;
  parentA?: Genotype;
  parentB?: Genotype;
  seed?: number;
  count?: number;
  selectedRow?: number;
  selectedCol?: number;
};
function Figure({
  id,
  mode,
  frame = 3,
  trace = 'carbon',
  conditions = { light: 50, co2: 20, temperature: 25 },
  variable = 'light',
  route = 'aerobic',
  regenerate = true,
  demand = 5,
  replicated = false,
  cross = true,
  swap = false,
  parentA = 'Aa',
  parentB = 'Aa',
  seed = 42,
  count = 40,
  selectedRow,
  selectedCol,
}: FigureProps) {
  if (id === 'L081')
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={35}
          text={t(
            trace === 'carbon'
              ? '净反应：原子守恒'
              : '来源追踪：保留未约去的水',
            trace === 'carbon'
              ? 'Net reaction: atoms conserved'
              : 'Source trace: keep water before cancellation',
          )}
        />
        <text
          x="280"
          y="104"
          textAnchor="middle"
          fontSize={trace === 'carbon' ? 23 : 19}
          fill={green}
        >
          {trace === 'carbon'
            ? '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂'
            : '6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O'}
        </text>
        <Label
          mode={mode}
          x={280}
          y={140}
          text={t(
            '光能输入 → 糖中的化学能',
            'Light input → chemical energy in sugars',
          )}
        />
        {Array.from({ length: trace === 'carbon' ? 6 : 12 }, (_, i) => (
          <g key={i}>
            <circle
              cx={65 + i * (trace === 'carbon' ? 23 : 11)}
              cy="211"
              r={trace === 'carbon' ? 8 : 4}
              fill={trace === 'carbon' ? gold : blue}
            />
            {frame >= 1 && (
              <path
                d={`M${65 + i * (trace === 'carbon' ? 23 : 11)},225 Q280,${250 + i * 2} ${350 + i * (trace === 'carbon' ? 23 : 11)},225`}
                fill="none"
                stroke={trace === 'carbon' ? gold : blue}
                strokeWidth="2"
              />
            )}
            {frame >= 2 && (
              <circle
                cx={350 + i * (trace === 'carbon' ? 23 : 11)}
                cy="211"
                r={trace === 'carbon' ? 8 : 4}
                fill={trace === 'carbon' ? gold : blue}
              />
            )}
          </g>
        ))}
        <Label
          mode={mode}
          x={125}
          y={182}
          text={
            trace === 'carbon'
              ? t('CO₂中的碳', 'Carbon in CO₂')
              : t('12H₂O的12个氧', '12 O atoms in 12 H₂O')
          }
        />
        <Label
          mode={mode}
          x={405}
          y={182}
          text={
            trace === 'carbon'
              ? t('糖中的碳', 'Carbon in sugar')
              : t('6O₂的12个氧', '12 O atoms in 6 O₂')
          }
        />
        <Label
          mode={mode}
          x={280}
          y={299}
          text={
            frame === 3
              ? t(
                  '净方程不显示全部中间步骤',
                  'Net equation omits intermediate reactions',
                )
              : t(
                  '追踪来源，不是反应路线动画',
                  'Tracing sources, not the reaction mechanism',
                )
          }
        />
      </Scene>
    );
  if (id === 'L082') {
    const curve = photoCurve(variable, conditions),
      result = photosynthesisRate(conditions),
      max = variable === 'temperature' ? 50 : 100;
    const points = curve
      .slice(0, Math.max(2, Math.ceil(((frame + 1) * curve.length) / 4)))
      .map((p) => `${65 + (p.x / max) * 425},${265 - p.rate * 1.8}`)
      .join(' ');
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={35}
          text={t(
            '虚构的相对光合速率（不是生长）',
            'Fictional photosynthesis rate (not growth)',
          )}
        />
        <path d="M65,70V265H500" stroke="#56645c" fill="none" strokeWidth="2" />
        <polyline points={points} fill="none" stroke={green} strokeWidth="4" />
        <text x="40" y="90" fontSize="13">
          100
        </text>
        <text x="45" y="267" fontSize="13">
          0
        </text>
        <text x="495" y="286" fontSize="13">
          {max}
        </text>
        <Label
          mode={mode}
          x={280}
          y={308}
          text={
            variable === 'temperature'
              ? t('温度 / °C', 'Temperature / °C')
              : variable === 'co2'
                ? t('CO₂指数（无量纲）', 'CO₂ index (dimensionless)')
                : t('光照指数（无量纲）', 'Light index (dimensionless)')
          }
        />
        <circle
          cx={65 + (conditions[variable] / max) * 425}
          cy={265 - result.rate * 1.8}
          r="7"
          fill={red}
        />
      </Scene>
    );
  }
  if (id === 'L083') {
    const aerobic = route === 'aerobic',
      human = route === 'lactate';
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={35}
          text={t(
            '能量转移，不是能量创造',
            'Energy transfer, not energy creation',
          )}
        />
        <rect x="25" y="100" width="125" height="80" rx="12" fill="#e5dab8" />
        <Label mode={mode} x={87} y={127} text={t('葡萄糖', 'Glucose')} />
        {frame >= 1 && (
          <>
            <Arrow x={155} y={140} />
            <rect
              x="225"
              y="100"
              width="120"
              height="80"
              rx="12"
              fill="#cadfce"
            />
            <Label
              mode={mode}
              x={285}
              y={127}
              text={t('糖酵解', 'Glycolysis')}
            />
          </>
        )}
        {frame >= 2 && (
          <>
            <Arrow x={350} y={140} width={45} />
            <rect
              x="400"
              y="95"
              width="140"
              height="95"
              rx="12"
              fill={aerobic ? '#d1e4ea' : '#ecd5d5'}
            />
            <Label
              mode={mode}
              x={470}
              y={120}
              text={
                aerobic
                  ? t('有氧后续步骤', 'Aerobic stages')
                  : human
                    ? t('乳酸发酵', 'Lactate route')
                    : t('酒精发酵', 'Ethanol route')
              }
            />
            <text x="470" y="175" textAnchor="middle" fontSize="14">
              {aerobic ? 'CO₂ + H₂O' : human ? 'lactate' : 'ethanol + CO₂'}
            </text>
          </>
        )}
        {frame >= 3 && (
          <>
            <Label
              mode={mode}
              x={280}
              y={232}
              text={
                aerobic
                  ? t(
                      '氧为末端电子受体；ATP产量较高且可变',
                      'O₂ accepts electrons; higher, variable ATP yield',
                    )
                  : t(
                      '再生NAD⁺，让糖酵解继续净产2 ATP',
                      'Regenerate NAD⁺: glycolysis can net 2 ATP',
                    )
              }
            />
            <Label
              mode={mode}
              x={280}
              y={293}
              text={t(
                '这里比较发酵；微生物无氧呼吸是另一路线',
                'Fermentation here; microbial anaerobic respiration differs',
              )}
            />
          </>
        )}
      </Scene>
    );
  }
  if (id === 'L084') {
    const budget = atpBudget(3, regenerate ? 4 : 0, demand);
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={35}
          text={t(
            '短期转移载体：ATP ⇄ ADP + Pi',
            'Short-term carrier: ATP ⇄ ADP + Pi',
          )}
        />
        <circle cx="145" cy="155" r="59" fill="#e5d6aa" />
        <text x="145" y="162" textAnchor="middle" fontSize="28">
          ATP
        </text>
        <circle cx="420" cy="155" r="59" fill="#cbdfe5" />
        <text x="420" y="162" textAnchor="middle" fontSize="23">
          ADP + Pi
        </text>
        {frame >= 1 && (
          <>
            <Arrow x={210} y={125} width={140} />
            <Label
              mode={mode}
              x={280}
              y={89}
              text={t('水解耦联做功', 'Hydrolysis + work')}
            />
          </>
        )}
        {frame >= 2 && regenerate && (
          <>
            <path
              d="M360,193 Q280,265 205,193"
              fill="none"
              stroke={green}
              strokeWidth="3"
            />
            <Label
              mode={mode}
              x={280}
              y={253}
              text={t('再生必须输入能量', 'Energy input to regenerate')}
            />
          </>
        )}
        {frame === 3 && (
          <Label
            mode={mode}
            x={280}
            y={301}
            text={t(
              `模型：完成${budget.completed}；余${budget.remaining}；缺${budget.unmet}`,
              `Model: done ${budget.completed}; left ${budget.remaining}; unmet ${budget.unmet}`,
            )}
          />
        )}
      </Scene>
    );
  }
  if (id === 'L085')
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={34}
          text={t('2n = 4：两对同源染色体', '2n = 4: two homologous pairs')}
        />
        <ellipse cx="280" cy="170" rx="230" ry="102" fill="#e4e9df" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Chromosome
              x={130 + i * 100}
              y={158}
              color={i % 2 ? red : blue}
              replicated={replicated}
              allele={i < 2 ? (i === 0 ? 'A' : 'a') : i === 2 ? 'B' : 'b'}
              faded={frame === 1 && i >= 2}
            />
            {frame >= 1 && (
              <circle
                cx={130 + i * 100}
                cy="138"
                r="13"
                fill="none"
                stroke={gold}
                strokeWidth="2"
              />
            )}
          </g>
        ))}
        <Label
          mode={mode}
          x={180}
          y={237}
          text={t('同一基因位置，版本可不同', 'Same locus, different alleles')}
        />
        {frame >= 2 && (
          <Label
            mode={mode}
            x={398}
            y={237}
            text={
              replicated
                ? t('每条有两条姐妹', 'Two sisters each')
                : t('尚无姐妹对', 'No sister pair yet')
            }
          />
        )}
        <Label
          mode={mode}
          x={280}
          y={302}
          text={t(
            `每细胞：4条染色体；${replicated ? 8 : 4}个DNA分子`,
            `Per cell: 4 chromosomes; ${replicated ? 8 : 4} DNA molecules`,
          )}
        />
      </Scene>
    );
  if (id === 'L086') {
    const cells = frame < 2 ? 1 : frame === 2 ? 2 : 4,
      per = frame < 2 ? 4 : 2,
      rep = frame < 3;
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={32}
          text={
            frame < 2
              ? t(
                  '复制后：2n，4C；同源配对',
                  'After S: 2n, 4C; homologues pair',
                )
              : frame === 2
                ? t('分裂I后：每细胞n，2C', 'After I: each cell n, 2C')
                : t('分裂II后：每细胞n，1C', 'After II: each cell n, 1C')
          }
        />
        {Array.from({ length: cells }, (_, c) => {
          const cx =
            cells === 1 ? 280 : cells === 2 ? 155 + c * 250 : 75 + c * 137;
          return (
            <g key={c}>
              <ellipse
                cx={cx}
                cy="169"
                rx={cells === 1 ? 220 : cells === 2 ? 112 : 62}
                ry="94"
                fill="#e2e9dd"
                stroke={green}
              />
              {Array.from({ length: per }, (_, j) => {
                const origin = cells === 1 ? j % 2 : c < cells / 2 ? 0 : 1;
                const small = j >= (cells === 1 ? 2 : 1),
                  color = (small && swap ? 1 - origin : origin) ? red : blue;
                return (
                  <g
                    key={j}
                    transform={
                      small
                        ? `translate(0 45) translate(${cx} 120) scale(1 .7) translate(${-cx} -120)`
                        : undefined
                    }
                  >
                    <Chromosome
                      x={cx + (j - (per - 1) / 2) * (cells === 1 ? 80 : 42)}
                      y={cells === 1 ? 165 : 145}
                      color={color}
                      replicated={rep}
                      cross={
                        cross &&
                        frame >= 1 &&
                        (cells === 1 ? j < 2 : !small) &&
                        (frame < 3 || c % 2 === 0)
                      }
                      allele={small ? 'B' : 'A'}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
        <Label
          mode={mode}
          x={280}
          y={294}
          text={t(
            `每细胞：${frame < 2 ? 4 : 2}条染色体；${frame < 2 ? 8 : frame === 2 ? 4 : 2}个DNA分子`,
            `Per cell: ${frame < 2 ? 4 : 2} chromosomes; ${frame < 2 ? 8 : frame === 2 ? 4 : 2} DNA molecules`,
          )}
        />
      </Scene>
    );
  }
  if (id === 'L087') {
    const square = punnett(parentA, parentB);
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={280}
          y={30}
          text={t(
            '虚构灯豆：A完全显性；每格1/4',
            'Fictional glowbean: A complete dominance; each cell ¼',
          )}
        />
        <text x="170" y="87" fontSize="18">
          {parentA} × {parentB}
        </text>
        {[0, 1].map((i) => (
          <g key={i}>
            <text
              x={270 + i * 125}
              y="93"
              textAnchor="middle"
              fontSize="23"
              fill={red}
            >
              {parentB[i]}
            </text>
            <text
              x="155"
              y={155 + i * 100}
              textAnchor="middle"
              fontSize="23"
              fill={blue}
            >
              {parentA[i]}
            </text>
          </g>
        ))}
        {square.cells.map((cell, i) => (
          <g key={i}>
            <rect
              x={210 + cell.col * 125}
              y={105 + cell.row * 100}
              width="117"
              height="90"
              rx="10"
              fill={cell.genotype === 'aa' ? '#d4dfeb' : '#e8dab2'}
              stroke={
                selectedRow === cell.row && selectedCol === cell.col
                  ? red
                  : green
              }
              strokeWidth={
                selectedRow === cell.row && selectedCol === cell.col ? 4 : 1
              }
            />
            {i <= frame && (
              <>
                <text
                  x={268 + cell.col * 125}
                  y={148 + cell.row * 100}
                  textAnchor="middle"
                  fontSize="27"
                >
                  {cell.genotype}
                </text>
                <text
                  x={268 + cell.col * 125}
                  y={177 + cell.row * 100}
                  textAnchor="middle"
                  fontSize="14"
                >
                  {cell.fromFirst} + {cell.fromSecond}
                </text>
              </>
            )}
          </g>
        ))}
      </Scene>
    );
  }
  const sample = sampleOffspring(parentA, parentB, count, seed),
    visible = Math.floor((count * (frame + 1)) / 4),
    partial = sample.offspring.slice(0, visible),
    aa = partial.filter((child) => child.genotype === 'aa').length;
  return (
    <Scene id={id} mode={mode}>
      <Label
        mode={mode}
        x={280}
        y={34}
        text={t(
          '每次独立：前一次不改变下次概率',
          'Independent trials: previous outcomes do not change odds',
        )}
      />
      {partial.slice(0, 120).map((child, i) => (
        <circle
          key={i}
          cx={34 + (i % 20) * 26}
          cy={87 + Math.floor(i / 20) * 28}
          r="9"
          fill={child.genotype === 'aa' ? blue : gold}
        />
      ))}
      <Label
        mode={mode}
        x={280}
        y={279}
        text={t(
          `已显示${visible}；aa有${aa}；期望${(visible * sample.expected.aa).toFixed(1)}`,
          `Shown ${visible}; aa observed ${aa}; expected ${(visible * sample.expected.aa).toFixed(1)}`,
        )}
      />
      <Label
        mode={mode}
        x={280}
        y={316}
        text={t(
          '蓝=aa；金=AA或Aa；图最多120个',
          'Blue=aa; gold=AA or Aa; plot capped at 120',
        )}
      />
    </Scene>
  );
}
export function EnergyGeneDiagram(props: Props) {
  return (
    <figure className="bio-lab bio-s3-lab">
      <Figure {...props} />
      <figcaption>
        <Text
          mode={props.mode}
          text={t(
            '原创机制示意图；非按比例。先看标签，再用探索区改变条件。',
            'Original mechanism schematic; not to scale. Read the labels, then change conditions in Explore.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function EnergyGeneHookArt(props: Props) {
  return <EnergyGeneDiagram {...props} />;
}

export function EnergyGeneExplore({
  id,
  mode,
  onExplore,
}: Props & { onExplore: () => void }) {
  const flow = useFrames(3, onExplore);
  const [trace, setTrace] = useState<'carbon' | 'oxygen'>('carbon'),
    [conditions, setConditions] = useState<PhotoConditions>({
      light: 50,
      co2: 20,
      temperature: 25,
    }),
    [variable, setVariable] = useState<keyof PhotoConditions>('light'),
    [records, setRecords] = useState<PhotoConditions[]>([]),
    [route, setRoute] = useState<RespirationRoute>('aerobic'),
    [regenerate, setRegenerate] = useState(true),
    [demand, setDemand] = useState(5),
    [replicated, setReplicated] = useState(false),
    [cross, setCross] = useState(true),
    [swap, setSwap] = useState(false),
    [parentA, setParentA] = useState<Genotype>('Aa'),
    [parentB, setParentB] = useState<Genotype>('Aa'),
    [seed, setSeed] = useState(42),
    [count, setCount] = useState(40),
    [firstGamete, setFirstGamete] = useState(0),
    [secondGamete, setSecondGamete] = useState(0);
  const update = (action: () => void) => {
    action();
    flow.reset();
    onExplore();
  };
  const label = (text: LocalizedText) => <Text mode={mode} text={text} />;
  const slider = (
    text: LocalizedText,
    value: number,
    max: number,
    change: (n: number) => void,
    min = 0,
  ) => (
    <label>
      {label(text)} <strong>{value}</strong>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => update(() => change(Number(e.target.value)))}
      />
    </label>
  );
  const parents = (
    <div className="bio-controls">
      {(
        [
          ['A', parentA, setParentA],
          ['B', parentB, setParentB],
        ] as const
      ).map(([name, value, set]) => (
        <label key={name}>
          {label(t(`亲代${name}`, `Parent ${name}`))}
          <select
            value={value}
            onChange={(e) => update(() => set(e.target.value as Genotype))}
          >
            {(['AA', 'Aa', 'aa'] as const).map((genotype) => (
              <option key={genotype}>{genotype}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
  const result = photosynthesisRate(conditions),
    budget = atpBudget(3, regenerate ? 4 : 0, demand),
    sample = sampleOffspring(parentA, parentB, count, seed),
    square = punnett(parentA, parentB);
  const stage =
      flow.frame < 2 ? 'afterS' : flow.frame === 2 ? 'afterI' : 'afterII',
    counts = chromosomeCounts[stage];
  const steps: Record<string, LocalizedText[]> = {
    L081: [
      t(
        trace === 'carbon'
          ? '先数净反应左侧的原子。'
          : '先数所示未约分反应式左侧的原子。',
        trace === 'carbon'
          ? 'Count atoms on the left of the net equation.'
          : 'Count atoms on the left of the displayed equation before cancellation.',
      ),
      t(
        '追踪所选来源：线表示原子来源，不表示单步反应。',
        'Trace selected source: lines show provenance, not one-step chemistry.',
      ),
      t(
        '对照产物中的相同原子，保持元素总数。',
        'Match the same atoms in products, conserving each element.',
      ),
      t(
        trace === 'carbon'
          ? '净式两侧均为C6、H12、O18。糖的碳来自CO₂；原子配平本身不能证明氧的来源。'
          : '未约分式两侧均为C6、H24、O24。同位素证据表明放出的氧来自水；来源不是仅凭配平判断。',
        trace === 'carbon'
          ? 'Net equation: C6, H12, O18 on each side. Sugar carbon comes from CO₂; balancing alone does not establish oxygen provenance.'
          : 'Before cancellation: C6, H24, O24 on each side. Isotope evidence traces released oxygen to water; balancing alone does not establish provenance.',
      ),
    ],
    L082: [
      t(
        '从横轴低值开始，其他条件固定。',
        'Begin at low x; hold the other conditions fixed.',
      ),
      t(
        '查看前半曲线：增加一个因素是否有效？',
        'Inspect the first half: does increasing this factor help?',
      ),
      t(
        '曲线逐步展现；红点是当前条件。',
        'More of the curve appears; the red point marks current conditions.',
      ),
      t(
        '完整曲线：平台表示其他因素可限制；高温端可能下降。',
        'Full curve: plateaus reveal other limits; high temperatures can reduce rate.',
      ),
    ],
    L083: [
      t(
        '每条路线均从糖开始，细胞仍需要可用能量。',
        'Each route starts with sugar; cells need usable energy.',
      ),
      t(
        '糖酵解产生少量ATP和丙酮酸，不直接需要氧。',
        'Glycolysis yields some ATP and pyruvate without directly requiring oxygen.',
      ),
      t(
        '比较有氧后续步骤与两种发酵的产物。',
        'Compare aerobic stages with products of the two fermentation routes.',
      ),
      t(
        '发酵再生NAD⁺支持糖酵解，不能把缺氧理解为ATP必为零。',
        'Fermentation regenerates NAD⁺ to sustain glycolysis; low oxygen does not imply zero ATP.',
      ),
    ],
    L084: [
      t(
        '初始有3个ATP模型代币；代币不代表分子能量数值。',
        'Start with 3 model ATP tokens; tokens are not molecular energy measurements.',
      ),
      t(
        'ATP水解与做功耦联；断键本身耗能。',
        'Hydrolysis couples to work; breaking a bond itself costs energy.',
      ),
      t(
        '若允许再生，输入能量把ADP与Pi重新组成ATP。',
        'If regeneration is enabled, energy input converts ADP and Pi back to ATP.',
      ),
      t(
        '核对：初始ATP＋再生ATP＝已用ATP＋剩余ATP。',
        'Check: starting ATP + regenerated ATP = ATP used + ATP left.',
      ),
    ],
    L085: [
      t(
        '两对同源染色体；每对各来自一个遗传亲代。',
        'Two homologous pairs; each pair contains a chromosome from each genetic parent.',
      ),
      t(
        '金色圈标示相同基因位置；A与a为不同版本。',
        'Gold circles mark the same gene locus; A and a are different versions.',
      ),
      t(
        '同源染色体可有不同等位基因；姐妹来自同一条染色体复制。',
        'Homologues can carry different alleles; sisters arise by copying one chromosome.',
      ),
      t(
        '切换复制前后：染色体仍为4，DNA分子从4变为8。',
        'Toggle replication: chromosomes stay at 4; DNA molecules change from 4 to 8.',
      ),
    ],
    L086: [
      t(
        '已完成S期：4条复制染色体、8个DNA分子；2n，4C。',
        'After S: 4 replicated chromosomes, 8 DNA molecules; 2n, 4C.',
      ),
      t(
        '同源配对；交换只示意非姐妹染色单体对应片段的互换。',
        'Homologues pair; crossing over shows corresponding segments exchanged between non-sisters.',
      ),
      t(
        '分裂I分开同源染色体：每细胞2条复制染色体，n，2C。',
        'Meiosis I separates homologues: 2 replicated chromosomes per cell, n, 2C.',
      ),
      t(
        '分裂II分开姐妹：四个单倍体产物，每个2条染色体、2个DNA分子。',
        'Meiosis II separates sisters: four haploid products, each with 2 chromosomes and 2 DNA molecules.',
      ),
    ],
    L087: [
      t(
        '四格由两亲代的两种等概率配子槽交叉组成。',
        'Four cells cross two equally likely gamete slots from each parent.',
      ),
      t(
        '每格只能取每方一个等位基因；大小写仍保留。',
        'Each cell receives one allele from each parent; letter case is retained.',
      ),
      t(
        'Aa与aA合并记为Aa：来源不同，基因型同类。',
        'Aa and aA are grouped as Aa: origin order differs, genotype class does not.',
      ),
      t(
        '完整显性假设下，AA与Aa表型同类；aa是另一类。',
        'Under complete dominance, AA and Aa share a phenotype; aa is the other class.',
      ),
    ],
    L088: [
      t(
        '揭示前四分之一样本；结果不必符合理论比例。',
        'Reveal the first quarter; it need not match theoretical ratios.',
      ),
      t(
        '增加到一半；每个子代重新独立抽取亲代配子。',
        'Reveal half; each offspring independently draws parental gametes.',
      ),
      t(
        '继续抽样；先前结果不会产生“补偿欠账”。',
        'Continue: previous outcomes create no debt to be repaid.',
      ),
      t(
        '比较整批观察值与期望值；换种子重复，概率假设不变。',
        'Compare the full observed and expected counts; change seed to repeat with the same probabilities.',
      ),
    ],
  };
  return (
    <div className="bio-lab bio-s3-lab">
      <h3>{label(titles[id] ?? t('机制探索', 'Explore mechanisms'))}</h3>
      {id === 'L081' && (
        <div className="bio-controls">
          {(['carbon', 'oxygen'] as const).map((value) => (
            <button
              key={value}
              aria-pressed={trace === value}
              onClick={() => update(() => setTrace(value))}
            >
              {label(
                value === 'carbon'
                  ? t('追踪碳', 'Trace carbon')
                  : t('追踪放出的氧', 'Trace released oxygen'),
              )}
            </button>
          ))}
        </div>
      )}
      {id === 'L082' && (
        <>
          <div className="bio-controls">
            <label>
              {label(t('曲线横轴', 'Curve x-axis'))}
              <select
                value={variable}
                onChange={(e) =>
                  update(() =>
                    setVariable(e.target.value as keyof PhotoConditions),
                  )
                }
              >
                <option value="light">
                  {mode === 'en' ? 'Light' : '光照 / Light'}
                </option>
                <option value="co2">CO₂</option>
                <option value="temperature">
                  {mode === 'en' ? 'Temperature' : '温度 / Temperature'}
                </option>
              </select>
            </label>
            {slider(t('光照指数', 'Light index'), conditions.light, 100, (n) =>
              setConditions({ ...conditions, light: n }),
            )}
            {slider(t('CO₂指数', 'CO₂ index'), conditions.co2, 100, (n) =>
              setConditions({ ...conditions, co2: n }),
            )}
            {slider(
              t('温度 / °C', 'Temperature / °C'),
              conditions.temperature,
              50,
              (n) => setConditions({ ...conditions, temperature: n }),
            )}
          </div>
          <p>
            {label(
              t(
                `当前速率${result.rate}；能力上限：光${result.capacities.light}、CO₂ ${result.capacities.co2}、温度${result.capacities.temperature}。限制因素：${result.limitingFactors.map((x) => (x === 'light' ? '光' : x === 'co2' ? 'CO₂' : '温度')).join('、')}。`,
                `Current rate ${result.rate}; capacities: light ${result.capacities.light}, CO₂ ${result.capacities.co2}, temperature ${result.capacities.temperature}. Limits: ${result.limitingFactors.join(', ')}.`,
              ),
            )}
          </p>
          <button
            disabled={records.length >= 8}
            onClick={() => {
              setRecords([...records, { ...conditions }]);
              onExplore();
            }}
          >
            {label(t('保留比较记录（最多8组）', 'Keep comparison (up to 8)'))}
          </button>
          <button
            disabled={records.length === 0}
            onClick={() => {
              setRecords([]);
              onExplore();
            }}
          >
            {label(t('清空记录', 'Clear records'))}
          </button>
          {records.length > 0 && (
            <table>
              <caption>
                {label(t('虚构数据记录', 'Fictional data records'))}
              </caption>
              <thead>
                <tr>
                  {[
                    t('组', 'Run'),
                    t('光照', 'Light'),
                    t('CO₂', 'CO₂'),
                    t('温度 / °C', 'Temperature / °C'),
                    t('速率', 'Rate'),
                  ].map((x) => (
                    <th key={x.en}>{label(x)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((c, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{c.light}</td>
                    <td>{c.co2}</td>
                    <td>{c.temperature}</td>
                    <td>{photosynthesisRate(c).rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p>
            {label(
              t(
                '水分充足、叶面积及其他条件固定。最小能力规则是课堂模型；速率无真实单位，不能推算生长。',
                'Water adequate; leaf area and other conditions fixed. Minimum-capacity rule is a classroom model; rate has no real units and cannot predict growth.',
              ),
            )}
          </p>
        </>
      )}
      {id === 'L083' && (
        <div className="bio-controls">
          {(['aerobic', 'lactate', 'yeast'] as const).map((value) => (
            <button
              key={value}
              aria-pressed={route === value}
              onClick={() => update(() => setRoute(value))}
            >
              {label(
                value === 'aerobic'
                  ? t('有氧路线', 'Aerobic route')
                  : value === 'lactate'
                    ? t('人细胞：缺氧乳酸路线', 'Human cell: low-O₂ lactate')
                    : t('酵母：缺氧酒精路线', 'Yeast: low-O₂ ethanol'),
              )}
            </button>
          ))}
        </div>
      )}
      {id === 'L084' && (
        <div className="bio-controls">
          <label>
            <input
              type="checkbox"
              checked={regenerate}
              onChange={(e) => update(() => setRegenerate(e.target.checked))}
            />
            {label(
              t(
                '输入能量，再生4个ATP代币',
                'Supply energy to regenerate 4 ATP tokens',
              ),
            )}
          </label>
          {slider(
            t('做功需求（每项用1代币）', 'Work demand (1 token each)'),
            demand,
            10,
            setDemand,
          )}
          <p>
            {label(
              t(
                `起始3＋再生${budget.regenerated}；可完成${budget.completed}项。假定ADP与Pi充足，再生还需能量输入；未追踪全部前体物质库。`,
                `Start 3 + regenerate ${budget.regenerated}; ${budget.completed} tasks can be completed. ADP and Pi are assumed adequate; regeneration also needs energy input. The full precursor reservoir is not tracked.`,
              ),
            )}
          </p>
        </div>
      )}
      {id === 'L085' && (
        <label>
          <input
            type="checkbox"
            checked={replicated}
            onChange={(e) => update(() => setReplicated(e.target.checked))}
          />
          {label(t('完成S期复制', 'S phase completed'))}
        </label>
      )}
      {id === 'L086' && (
        <div className="bio-controls">
          <label>
            <input
              type="checkbox"
              checked={cross}
              onChange={(e) => update(() => setCross(e.target.checked))}
            />
            {label(t('示意一次交叉互换', 'Show one crossover'))}
          </label>
          <label>
            <input
              type="checkbox"
              checked={swap}
              onChange={(e) => update(() => setSwap(e.target.checked))}
            />
            {label(t('翻转第二对的排列方向', 'Reverse pair 2 orientation'))}
          </label>
          <p>
            {label(
              t(
                `本帧${counts.cells}个细胞；每细胞${counts.chromosomesPerCell}条染色体、${counts.dnaMoleculesPerCell}个DNA分子，${counts.ploidy}n，${counts.C}C。`,
                `This frame: ${counts.cells} cells; each ${counts.chromosomesPerCell} chromosomes, ${counts.dnaMoleculesPerCell} DNA molecules, ${counts.ploidy}n, ${counts.C}C.`,
              ),
            )}
          </p>
        </div>
      )}
      {(id === 'L087' || id === 'L088') && parents}
      {id === 'L087' && (
        <>
          <div className="bio-controls">
            {(
              [
                ['A', parentA, firstGamete, setFirstGamete],
                ['B', parentB, secondGamete, setSecondGamete],
              ] as const
            ).map(([name, parent, value, set]) => (
              <label key={name}>
                {label(
                  t(
                    `取亲代${name}的配子槽`,
                    `Choose parent ${name} gamete slot`,
                  ),
                )}
                <select
                  value={value}
                  onChange={(e) => {
                    set(Number(e.target.value));
                    onExplore();
                  }}
                >
                  {[0, 1].map((i) => (
                    <option value={i} key={i}>
                      {i + 1}: {parent[i]}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p aria-live="polite">
            {label(
              t(
                `构建：${parentA[firstGamete]}（亲代A）＋${parentB[secondGamete]}（亲代B）＝${combine(parentA[firstGamete] === 'A' ? 'A' : 'a', parentB[secondGamete] === 'A' ? 'A' : 'a')}。红框标出所选格，每方恰取一个。`,
                `Build: ${parentA[firstGamete]} (parent A) + ${parentB[secondGamete]} (parent B) = ${combine(parentA[firstGamete] === 'A' ? 'A' : 'a', parentB[secondGamete] === 'A' ? 'A' : 'a')}. The red outline marks the selected cell: one allele from each parent.`,
              ),
            )}
          </p>
          <p>
            {label(
              t(
                `AA ${square.probabilities.AA * 100}%；Aa ${square.probabilities.Aa * 100}%；aa ${square.probabilities.aa * 100}%。`,
                `AA ${square.probabilities.AA * 100}%; Aa ${square.probabilities.Aa * 100}%; aa ${square.probabilities.aa * 100}%.`,
              ),
            )}
          </p>
        </>
      )}
      {id === 'L088' && (
        <>
          <div className="bio-controls">
            {slider(t('样本数量', 'Sample size'), count, 120, setCount, 4)}
            <label>
              {label(t('随机种子', 'Random seed'))}
              <input
                type="number"
                min="0"
                max="1000000"
                value={seed}
                onChange={(e) =>
                  update(() =>
                    setSeed(
                      Math.max(
                        0,
                        Math.min(
                          1000000,
                          Math.floor(Number(e.target.value) || 0),
                        ),
                      ),
                    ),
                  )
                }
              />
            </label>
            <button onClick={() => update(() => setSeed(seed + 1))}>
              {label(t('下一批（种子＋1）', 'Next batch (seed + 1)'))}
            </button>
          </div>
          <table>
            <caption>
              {label(
                t(
                  '整批结果：期望不是保证',
                  'Full batch: expectation is not a guarantee',
                ),
              )}
            </caption>
            <thead>
              <tr>
                <th>{label(t('基因型', 'Genotype'))}</th>
                <th>{label(t('概率', 'Probability'))}</th>
                <th>{label(t('期望数量', 'Expected count'))}</th>
                <th>{label(t('观察数量', 'Observed count'))}</th>
              </tr>
            </thead>
            <tbody>
              {(['AA', 'Aa', 'aa'] as const).map((g) => (
                <tr key={g}>
                  <th>{g}</th>
                  <td>{sample.expected[g] * 100}%</td>
                  <td>{(sample.expected[g] * count).toFixed(1)}</td>
                  <td>{sample.counts[g]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            {label(
              t(
                '随机数可复现；每个子代独立抽样。真实性状常受多基因与环境影响；显性不等于更强或更常见。',
                'Seeded draws are reproducible; offspring are sampled independently. Real traits often involve many genes and environments; dominant does not mean stronger or more common.',
              ),
            )}
          </p>
        </>
      )}
      <Figure
        {...{
          id,
          mode,
          frame: flow.frame,
          selectedRow: firstGamete,
          selectedCol: secondGamete,
          trace,
          conditions,
          variable,
          route,
          regenerate,
          demand,
          replicated,
          cross,
          swap,
          parentA,
          parentB,
          seed,
          count,
        }}
      />
      <p aria-live="polite">
        {label(
          steps[id]?.[flow.frame] ?? t('观察模型。', 'Observe the model.'),
        )}
      </p>
      <Playback flow={flow} mode={mode} />
      <details>
        <summary>
          {label(
            t('静态步骤与键盘替代', 'Static steps and keyboard alternative'),
          )}
        </summary>
        <ol>
          {steps[id]?.map((step, i) => (
            <li key={i}>
              {label(step)}{' '}
              <button onClick={() => flow.choose(i)}>
                {label(t(`显示第${i + 1}步`, `Show step ${i + 1}`))}
              </button>
            </li>
          ))}
        </ol>
        <p>
          {label(
            t(
              '所有按钮、选择框和滑块可用Tab定位；用Enter、空格或方向键操作。无需拖动。',
              'Tab reaches every button, select and slider; use Enter, Space or arrow keys. Dragging is unnecessary.',
            ),
          )}
        </p>
      </details>
    </div>
  );
}
