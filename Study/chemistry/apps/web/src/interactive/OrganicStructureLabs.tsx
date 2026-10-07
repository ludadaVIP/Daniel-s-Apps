import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  butaneSkeleton,
  ethaneSkeleton,
  etheneSkeleton,
  hydrocarbonInventory,
  isobutaneSkeleton,
  polyetheneSegment,
  propaneSkeleton,
  sameCarbonConnectivity,
  type CarbonSkeleton,
} from './organicStructures';
import './OrganicStructureLabs.css';

type Point = readonly [number, number];
const bentButane: readonly Point[] = [
  [12, 60],
  [37, 35],
  [63, 60],
  [88, 35],
];
const alternateButane: readonly Point[] = [
  [25, 25],
  [75, 25],
  [75, 75],
  [25, 75],
];
const branchedButane: readonly Point[] = [
  [50, 60],
  [20, 60],
  [50, 20],
  [80, 60],
];

function GroupLabel({ hydrogen }: { hydrogen: number }) {
  return <>C{hydrogen > 0 && <>H{hydrogen > 1 && <sub>{hydrogen}</sub>}</>}</>;
}

function SkeletonPlot({
  skeleton,
  points,
  label,
}: {
  skeleton: CarbonSkeleton;
  points: readonly Point[];
  label: string;
}) {
  const inventory = hydrocarbonInventory(skeleton);
  return (
    <div className="organic-skeleton" role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {skeleton.bonds.map(([a, b, order], i) => (
          <g key={i}>
            {Array.from({ length: order }, (_, j) => (
              <line
                key={j}
                x1={points[a]![0]}
                y1={points[a]![1] + (j - (order - 1) / 2) * 4}
                x2={points[b]![0]}
                y2={points[b]![1] + (j - (order - 1) / 2) * 4}
              />
            ))}
          </g>
        ))}
      </svg>
      {points.map(([x, y], i) => (
        <span
          className="organic-carbon"
          key={i}
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-hidden="true"
        >
          <i>{i + 1}</i>
          <b>
            <GroupLabel hydrogen={inventory.perCarbon[i]!} />
          </b>
        </span>
      ))}
    </div>
  );
}

function Formula({
  carbons,
  hydrogens,
}: {
  carbons: number;
  hydrogens: number;
}) {
  return (
    <>
      C<sub>{carbons}</sub>H<sub>{hydrogens}</sub>
    </>
  );
}

export function IsomerDetectiveLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [caseIndex, setCaseIndex] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const cases = [
    {
      skeleton: butaneSkeleton,
      points: alternateButane,
      zh: 'B · 换个摆法',
      en: 'B · Different drawing',
    },
    {
      skeleton: isobutaneSkeleton,
      points: branchedButane,
      zh: 'B · 换成支链',
      en: 'B · Branched skeleton',
    },
    {
      skeleton: propaneSkeleton,
      points: [
        [20, 50],
        [50, 50],
        [80, 50],
      ] as const,
      zh: 'B · 少一个碳',
      en: 'B · One fewer carbon',
    },
  ];
  const data = cases[caseIndex]!;
  const a = hydrocarbonInventory(butaneSkeleton),
    b = hydrocarbonInventory(data.skeleton);
  const sameFormula = a.carbons === b.carbons && a.hydrogens === b.hydrogens;
  const correct = !sameFormula
    ? 2
    : sameCarbonConnectivity(butaneSkeleton, data.skeleton)
      ? 0
      : 1;
  return (
    <div className="quantitative-lab">
      <div className="quantitative-choices">
        {cases.map((c, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={caseIndex === i}
            onClick={() => {
              setCaseIndex(i);
              setPrediction(null);
            }}
          >
            {en ? c.en : c.zh}
          </button>
        ))}
      </div>
      <div className="organic-comparison">
        <div>
          <strong>
            A · <Formula {...a} />
          </strong>
          <SkeletonPlot
            skeleton={butaneSkeleton}
            points={bentButane}
            label={
              en
                ? 'Butane: CH3–CH2–CH2–CH3, drawn bent'
                : '丁烷：CH₃—CH₂—CH₂—CH₃，折线画法'
            }
          />
          <p>{en ? 'Carbon neighbours: 1–2–3–4' : '碳连接：1—2—3—4'}</p>
        </div>
        <div>
          <strong>
            B · <Formula {...b} />
          </strong>
          <SkeletonPlot
            skeleton={data.skeleton}
            points={data.points}
            label={
              caseIndex === 0
                ? en
                  ? 'Butane: CH3–CH2–CH2–CH3, drawn as an open U-shaped chain'
                  : '丁烷：CH₃—CH₂—CH₂—CH₃，画成未闭合的 U 形链'
                : caseIndex === 1
                  ? en
                    ? '2-methylpropane: central CH joined to three CH3 groups'
                    : '2-甲基丙烷：中心 CH 连接三个 CH₃'
                  : en
                    ? 'Propane: CH3–CH2–CH3'
                    : '丙烷：CH₃—CH₂—CH₃'
            }
          />
          <p>
            {caseIndex === 1
              ? en
                ? 'Carbon 1 connects to 2, 3 and 4'
                : '碳 1 分别连接碳 2、3、4'
              : en
                ? `Carbon neighbours: ${caseIndex === 0 ? '1–2–3–4' : '1–2–3'}`
                : `碳连接：${caseIndex === 0 ? '1—2—3—4' : '1—2—3'}`}
          </p>
        </div>
      </div>
      <p className="quantitative-note">
        {en
          ? 'CH₃ means one C with three H atoms; each line is a C–C bond. Numbers identify carbons within each drawing only. Layout and angles are schematic, not real molecular geometry.'
          : 'CH₃ 表示一个 C 连着三个 H；每条线表示一个 C—C 键。编号只用于追踪各图里的碳。图中位置和角度是示意，不是真实分子几何。'}
      </p>
      <p className="quantitative-prompt">
        {en
          ? 'What is the relationship between A and B? Trace the connections, not just the outline.'
          : 'A 与 B 是什么关系？沿着连接看，不要只看外形。'}
      </p>
      <div className="quantitative-choices">
        {(en
          ? ['Same molecule', 'Structural isomers', 'Different formulas']
          : ['同一种分子', '构造异构体', '分子式不同']
        ).map((label, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={prediction === i}
            onClick={() => setPrediction(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="organic-result" aria-live="polite">
          <p className="quantitative-feedback">
            <b>{en ? 'Explanation: ' : '解析：'}</b>
            {prediction === correct
              ? en
                ? 'Correct. '
                : '判断正确。'
              : en
                ? 'Check atom counts and neighbours separately. '
                : '分别检查原子数与邻居。'}
            {correct === 0
              ? en
                ? 'Both drawings have the same 1–2–3–4 carbon chain and the same H groups. Redrawing without changing connections does not create a new structural isomer.'
                : '两图都是 1—2—3—4 碳链，各碳上的 H 数相同。只改变画法、没有改变连接，不会产生新的构造异构体。'
              : correct === 1
                ? en
                  ? 'Both are C₄H₁₀, but B has a carbon with three carbon neighbours; no carbon in A does. Matching formulas plus different connections makes structural isomers.'
                  : '两者都是 C₄H₁₀，但 B 有一个碳连着三个碳邻居，A 中没有这样的碳。分子式相同、连接不同，才是构造异构体。'
                : en
                  ? 'A is C₄H₁₀ and B is C₃H₈. Different molecular formulas rule out isomerism.'
                  : 'A 是 C₄H₁₀，B 是 C₃H₈。分子式不同，不能互称同分异构体。'}
          </p>
          <div className="quantitative-ledger">
            <div>
              <span>{en ? '1 · Count C atoms' : '1 · 数 C 原子'}</span>
              <strong>
                A: {a.carbons} · B: {b.carbons}
              </strong>
            </div>
            <div>
              <span>{en ? '2 · Count H atoms' : '2 · 数 H 原子'}</span>
              <strong>
                A: {a.hydrogens} · B: {b.hydrogens}
              </strong>
            </div>
            <div>
              <span>
                {en ? '3 · Largest C-neighbour count' : '3 · 最多的碳邻居数'}
              </span>
              <strong>A: 2 · B: {caseIndex === 1 ? 3 : 2}</strong>
            </div>
          </div>
          {caseIndex === 1 && (
            <aside className="organic-property">
              <b>
                {en
                  ? 'Same mass, different boiling points'
                  : '质量相同，沸点不同'}
              </b>
              <p>
                {en
                  ? 'Near 1 atm: butane ≈ −0.5 °C; 2-methylpropane ≈ −11.7 °C. Different shape changes intermolecular interactions; boiling does not break the C–C skeleton.'
                  : '约 1 atm 下：丁烷沸点约 −0.5 °C，2-甲基丙烷约 −11.7 °C。形状不同会影响分子间相互作用；沸腾不是把碳骨架中的 C—C 键拆开。'}
              </p>
              <p className="organic-source">
                {en
                  ? 'Rounded values from NIST records; do not apply them directly to pressurised fuel mixtures.'
                  : '数值按 NIST 记录取近似值；不能直接套到加压的混合燃料罐。'}{' '}
                <a
                  href="https://webbook.nist.gov/cgi/cbook.cgi?ID=C106978&Type=TBOIL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {en ? 'Butane data' : '丁烷数据'} ↗
                </a>{' '}
                ·{' '}
                <a
                  href="https://webbook.nist.gov/cgi/cbook.cgi?ID=C75285&Type=TBOIL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {en ? 'Isobutane data' : '异丁烷数据'} ↗
                </a>
              </p>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function PolymerSegment({ units, en }: { units: number; en: boolean }) {
  return (
    <div
      className="organic-chain"
      role="img"
      tabIndex={0}
      aria-label={
        en
          ? `Interior polyethene segment with ${units} CH2–CH2 repeating units; both ends continue; scroll sideways if needed`
          : `聚乙烯内部链段，显示 ${units} 个 CH₂—CH₂ 重复单元，两端继续延伸；需要时左右滑动查看`
      }
    >
      <span aria-hidden="true">⋯</span>
      {Array.from({ length: units }, (_, i) => (
        <div className="organic-repeat" key={i} aria-hidden="true">
          <span>CH₂</span>
          <b>—</b>
          <span>CH₂</span>
        </div>
      ))}
      <span aria-hidden="true">⋯</span>
    </div>
  );
}

export function AlkeneAdditionLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [route, setRoute] = useState<'hydrogen' | 'polymer'>('hydrogen');
  const [units, setUnits] = useState(3);
  const [prediction, setPrediction] = useState<number | null>(null);
  const before = hydrocarbonInventory(etheneSkeleton),
    after = hydrocarbonInventory(ethaneSkeleton),
    segment = polyetheneSegment(units);
  return (
    <div className="quantitative-lab">
      <div className="quantitative-choices">
        {(['hydrogen', 'polymer'] as const).map((r) => (
          <button
            type="button"
            key={r}
            aria-pressed={route === r}
            onClick={() => {
              setRoute(r);
              setPrediction(null);
            }}
          >
            {r === 'hydrogen'
              ? en
                ? 'Add H₂'
                : '加成 H₂'
              : en
                ? 'Join many ethenes'
                : '连接许多乙烯'}
          </button>
        ))}
      </div>
      <div className="organic-monomer">
        <strong>
          {route === 'polymer'
            ? en
              ? 'Monomer example · ethene'
              : '单体示例 · 乙烯'
            : en
              ? 'Ethene · alkene'
              : '乙烯 · 烯烃'}{' '}
          · C₂H₄
        </strong>
        <SkeletonPlot
          skeleton={etheneSkeleton}
          points={[
            [30, 50],
            [70, 50],
          ]}
          label={
            en
              ? 'Ethene: CH2=CH2; two carbon–carbon bond lines'
              : '乙烯：CH₂=CH₂，两个碳之间画两条键线'
          }
        />
      </div>
      <p className="quantitative-note">
        {en
          ? 'A double bond contributes two to each carbon’s bond-order total. With two C–H bonds, each carbon totals four—not five.'
          : '双键对每个碳贡献 2，再加两个 C—H 单键，连接总数是 4，不是 5。'}
      </p>
      {route === 'polymer' && (
        <div className="quantitative-controls organic-single-control">
          <label>
            {en ? 'Repeat units shown' : '显示的重复单元数'}
            <select
              aria-label={en ? 'Repeat units shown' : '显示的重复单元数'}
              value={units}
              onChange={(e) => {
                setUnits(Number(e.target.value));
                setPrediction(null);
              }}
            >
              {[2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {route === 'polymer' && (
        <p className="quantitative-note">
          {en
            ? `The picture shows one monomer example. The ledger compares ${units} ethene portions with ${units} interior repeat units; end groups are not included.`
            : `上图只画了一份单体示例。账本对照 ${units} 份乙烯与 ${units} 个内部重复单元，不含端基。`}
        </p>
      )}
      <p className="quantitative-prompt">
        {route === 'hydrogen'
          ? en
            ? 'Add one H₂ to one ethene under suitable catalytic conditions. What is the product formula?'
            : '在合适催化条件下，一份乙烯加成一份 H₂。产物分子式是什么？'
          : en
            ? 'Many ethenes undergo addition polymerisation. Which repeating unit is correct?'
            : '许多乙烯发生加聚，正确的重复单元是什么？'}
      </p>
      <div className="quantitative-choices">
        {(route === 'hydrogen'
          ? ['C₂H₄', 'C₂H₆', 'CH₄']
          : ['—CH=CH—', '—CH₂—CH₂—', '—CH₃—CH₃—']
        ).map((label, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={prediction === i}
            onClick={() => setPrediction(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="organic-result" aria-live="polite">
          <p className="quantitative-feedback">
            <b>{en ? 'Explanation: ' : '解析：'}</b>
            {prediction === 1
              ? en
                ? 'Correct. '
                : '判断正确。'
              : en
                ? 'Keep four bond-order units around each carbon. '
                : '检查每个碳的连接总数是否为 4。'}
            {route === 'hydrogen'
              ? en
                ? 'The C=C becomes C–C. One H from H₂ bonds to each carbon, making CH₃–CH₃: C₂H₆. The two carbons stay joined.'
                : 'C=C 变成 C—C，H₂ 中两个 H 分别连到两个碳上，得到 CH₃—CH₃，也就是 C₂H₆。两个碳没有断开分离。'
              : en
                ? 'Each C=C becomes a single C–C bond; new single bonds link neighbouring units. Each interior carbon keeps two H atoms and bonds to two C neighbours. No water or H₂ is expelled in ethene addition polymerisation.'
                : '各 C=C 变为 C—C，再用新单键连接相邻单元。链内每个碳仍带两个 H，并连两个碳邻居；乙烯加聚不会排出水或 H₂。'}
          </p>
          {route === 'hydrogen' ? (
            <div className="organic-monomer">
              <strong>{en ? 'Ethane · alkane' : '乙烷 · 烷烃'} · C₂H₆</strong>
              <SkeletonPlot
                skeleton={ethaneSkeleton}
                points={[
                  [30, 50],
                  [70, 50],
                ]}
                label={
                  en
                    ? 'Ethane: CH3–CH3; one carbon–carbon bond line'
                    : '乙烷：CH₃—CH₃，两个碳之间一条单键'
                }
              />
            </div>
          ) : (
            <>
              <PolymerSegment units={units} en={en} />
              <p className="quantitative-note">
                {en
                  ? 'Scroll sideways inside the diagram if needed. The dots and outward bonds mean the chain continues. This is an interior segment, not a complete molecule: initiator and end groups are outside the view. Coloured boxes mark repeat units, not physical gaps.'
                  : '需要时在图内左右滑动。两端省略号及伸出的键表示链继续延伸。这是内部链段，不是完整分子；引发剂和端基在画面外。彩色框只标记重复单元，不是物理间隙。'}
              </p>
              <p className="organic-polymer-equation">
                n CH₂=CH₂ → [—CH₂—CH₂—]<sub>n</sub>
              </p>
            </>
          )}
          <div className="quantitative-ledger">
            <div>
              <span>
                {en ? 'C atoms · before → after' : 'C 原子 · 之前 → 之后'}
              </span>
              <strong>
                {route === 'hydrogen'
                  ? `${before.carbons} → ${after.carbons}`
                  : `${units * before.carbons} → ${segment.carbons}`}
              </strong>
            </div>
            <div>
              <span>
                {en ? 'H atoms · before → after' : 'H 原子 · 之前 → 之后'}
              </span>
              <strong>
                {route === 'hydrogen'
                  ? `${before.hydrogens} + 2 → ${after.hydrogens}`
                  : `${units * before.hydrogens} → ${segment.hydrogens}`}
              </strong>
            </div>
            <div>
              <span>{en ? 'Each product carbon' : '产物中每个碳'}</span>
              <strong>
                {route === 'hydrogen' ? '3 + 1 = 4' : '2 + 1 + 1 = 4'}
              </strong>
              <p>
                {en ? 'C–H bonds + C–C bond orders' : 'C—H 键数 + C—C 键级'}
              </p>
            </div>
          </div>
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'Connectivity model only, not a reaction mechanism or production recipe. Hydrogenation needs suitable catalysts and conditions; polymerisation needs initiation and controlled conditions, not simply mixing molecules. No heating, gas mixing or plastic-making experiments at home.'
          : '只展示连接变化，不是反应机理或生产配方。加氢需要合适催化剂和条件；聚合需要引发及受控条件，不是把分子混合就自动连上。不要在家加热、混合气体或制作塑料。'}
      </p>
    </div>
  );
}
