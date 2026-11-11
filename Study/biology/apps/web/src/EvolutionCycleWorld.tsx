import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { Playback, useFrames } from './LabPlayback';
import {
  carbonStates,
  energyBudget,
  selection,
  nitrogenState,
  variationRoutes,
  evidenceRecords,
  disturbanceComparison,
  disturbanceComparisonRecords,
  type Community,
} from './evolutionCycleModel';

type Props = { id: string; mode: LanguageMode; onExplore: () => void };
type ArtProps = {
  id: string;
  mode: LanguageMode;
  frame?: number;
  option?: number;
  alternate?: number;
};
const green = '#527b65',
  blue = '#457e96',
  gold = '#bc8c39';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const titles: Record<string, LocalizedText> = {
  L089: t(
    '序列、重组与遗传路线',
    'Sequence, recombination and transmission routes',
  ),
  L090: t(
    '归一化的跨代后代贡献',
    'Normalized offspring contributions across generations',
  ),
  L091: t(
    '独立证据与推论的限制',
    'Independent evidence and limits of inference',
  ),
  L092: t(
    '共同祖先节点与物种分化',
    'Common-ancestor nodes and lineage divergence',
  ),
  L093: t('四个碳库的守恒转移', 'Conserved transfers among four carbon stores'),
  L094: t('一个氮原子的两条路径', 'Two routes for one marked nitrogen atom'),
  L095: t(
    '能量生产量与三项输出',
    'Energy production and three output destinations',
  ),
  L096: t(
    '虚构落叶分解功能的扰动比较',
    'Disturbance comparisons of fictional litter decomposition',
  ),
};
const captions: Record<string, LocalizedText[]> = {
  L089: [
    t(
      '起点AB与ab中的A/a、B/b是已有等位基因。选择机制，先区分序列改变与组合改变。',
      'A/a and B/b in AB and ab are existing alleles. Select a mechanism and distinguish sequence change from combination change.',
    ),
    t(
      '突变路径用星号表示新的序列版本；重组路径把原有字母配成Ab/aB；体细胞路径把变化限定在动物皮肤谱系。',
      'The mutation route marks a new sequence version with a star; recombination pairs existing letters as Ab/aB; the somatic route confines change to an animal skin lineage.',
    ),
    t(
      '新组合不需要新等位基因。动物生殖细胞系变化只有进入参与受精的配子才可能传下；皮肤细胞变化通常没有这条路径。',
      'New combinations need no new allele. Animal germline changes can be transmitted only through a gamete involved in fertilization; skin changes ordinarily lack that route.',
    ),
    t(
      '结果随传递路线而异，不是环境按需要指定。植物与无性繁殖可能有不同路线；本图不预测突变的效应或发生率。',
      'Transmission depends on lineage, not a change specified on demand. Plants and asexual reproduction may differ; the diagram predicts neither mutation effects nor rates.',
    ),
  ],
  L090: [
    t(
      '模型起点：可遗传的无性单倍体A/B。选择初始A为一半或零；关闭突变、迁入、随机性和密度限制。',
      'Start with inherited asexual haploid A/B types. Set initial A to one half or zero; mutation, immigration, stochasticity and density limits are excluded.',
    ),
    t(
      '第一代把亲代频率乘相对后代贡献，再除以总贡献。A有利时从一半变2/3；A起点为零仍为零。',
      'Generation one multiplies parental frequency by offspring contribution and divides by the total. Favoured A rises from one half to two thirds; absent A remains absent.',
    ),
    t(
      '第二代按同一规则重新归一化。环境反转时A/B贡献交换为1/2；生物没有通过努力改写类型。',
      'Generation two repeats normalization. Reversing conditions swaps A/B contributions to1/2; organisms do not rewrite types through effort.',
    ),
    t(
      '第三代一半起点在A有利时达8/9，在B有利时A为1/9。此为条件性比例，不是实际数量预测；适合度依赖环境。',
      'By generation three an initial half gives A8/9 when favoured or1/9 when B is favoured. These are conditional proportions, not counts or forecasts; fitness depends on environment.',
    ),
  ],
  L091: [
    t(
      '先分开观察与解释：地层位置、对应结构、100位点差异都是证据记录，不能把结论藏进记录中。',
      'Separate observation from interpretation: layer positions, corresponding structures and100-site differences are records, not conclusions hidden inside observations.',
    ),
    t(
      '地层顺序支持相对先后；详细对应结构支持同源假说；原创分子差异AB4、AC18、BC17在可比假设下支持A/B较近。',
      'Layer order informs relative timing; detailed correspondence supports homology; invented differences AB4,AC18,BC17 support closer A/B ancestry under comparability assumptions.',
    ),
    t(
      '每类都有边界：检查地层扰动和保存缺口、趋同、序列取样和变化速率。多条独立证据吻合更有力；冲突需要调查。',
      'Each line has limits: disturbance and fossil gaps, convergence, sequence sampling and rates. Independent agreement is stronger; conflict needs investigation.',
    ),
  ],
  L092: [
    t(
      '原有种群可能交换基因。三末端树中的名字全部虚构；连接显示Amber与Birch共享较近祖先。',
      'An initial population may exchange genes. All three taxon names are fictional; connections place Amber and Birch at a more recent shared ancestor.',
    ),
    t(
      '屏障可减少基因流，但隔开不是成种证明。旋转分支只改变画面位置，不改变共同祖先。',
      'A barrier can reduce gene flow but separation is not proof of speciation. Branch rotation changes drawing position, not common ancestry.',
    ),
    t(
      '突变、选择与随机过程可使谱系分化；交配时间、行为或后代育性屏障需独立证据，不能只看外形。',
      'Mutation, selection and stochastic processes can drive divergence; mating-time, behavioural or fertility barriers need evidence beyond appearance.',
    ),
    t(
      '恢复接触后若仍有有效生殖屏障，可支持成种解释。树不是阶梯，末端不排名，线长无时间尺度。',
      'Persistent effective reproductive barriers after contact can support speciation. The tree is not a ladder, tips are unranked, and lengths have no time scale.',
    ),
  ],
  L093: [
    t(
      '空气40、植物30、碎屑20、燃料10，共100模型碳单位。此四库封闭账本省略海洋、动物和活微生物等库。',
      'Air40, plants30, detritus20, fuel10 total100 model carbon units. This closed four-store account omits oceans, animals and living microbial stores.',
    ),
    t(
      '光合作用将8份碳由空气CO₂转入植物：空气32、植物38。光提供能量，不创造碳原子；植物碳主要不来自土壤。',
      'Photosynthesis moves8 carbon units from air CO₂ into plants: air32, plants38. Light provides energy without creating atoms; soil is not the main plant-carbon source.',
    ),
    t(
      '植物呼吸将3份碳返回空气：空气35、植物35。植物白天也会呼吸；箭头数是规定的步骤量，不是真实速率。',
      'Plant respiration returns3 to air: air35, plants35. Plants respire in daylight too; arrows are stipulated step amounts, not real rates.',
    ),
    t(
      '凋落把4份植物碳转入碎屑：植物31、碎屑24。转出减4、转入加4，总量仍100。',
      'Litter moves4 plant units into detritus: plants31, detritus24. Source loses4 and destination gains4; total remains100.',
    ),
    t(
      '分解过程的分解者呼吸支路把2份碎屑碳变为空气CO₂：空气37、碎屑22。并非所有碎屑即时变气体，微生物身体储碳未单列。',
      'A decomposer-respiration branch releases2 detrital carbon units as air CO₂: air37, detritus22. Not all litter instantly becomes gas; microbial body stores are not separately represented.',
    ),
    t(
      '若燃烧，5份燃料碳进空气，空气42、燃料5；不燃烧则空气37、燃料10。两种情形总量均100；碳循环不代表能量循环。',
      'Combustion transfers5 fuel units to air, giving air42/fuel5; without combustion air37/fuel10. Both totals remain100; carbon cycling does not imply energy cycling.',
    ),
  ],
  L094: [
    t(
      '金色标记是N₂分子两个氮原子中的一个，非一个只有单原子的N₂分子；每步追踪同一原子。',
      'The gold marker tracks one of the two atoms in an N₂ molecule, not a one-atom N₂ molecule. The same atom is followed throughout.',
    ),
    t(
      '相关微生物固氮把N₂转为氨/铵形式。大多数植物不直接完成这个反应；根瘤中的共生者也需明确。',
      'Relevant microbes fix N₂ into ammonia/ammonium forms. Most plants do not perform this directly; symbiotic nodule microbes must be distinguished.',
    ),
    t(
      '硝化的第一段把NH₄⁺转到NO₂⁻，由相关微生物完成。本图省略反应中其他原子、电荷及能量平衡。',
      'The first nitrification stage moves nitrogen from NH₄⁺ to NO₂⁻ through microbial activity. Other atoms, charge balances and energy reactions are omitted.',
    ),
    t(
      '硝化下一段把NO₂⁻转为NO₃⁻。植物也能直接吸收铵，并非必须依次走完这些站。',
      'The next nitrification stage gives NO₃⁻ from NO₂⁻. Plants can also absorb ammonium; not every atom must visit every station.',
    ),
    t(
      '吸收路线：植物吸收硝酸盐并同化到有机分子。返回路线：反硝化将硝酸盐氮转向N₂，通常在适宜低氧条件下发生。',
      'Uptake route: plants acquire nitrate and assimilate nitrogen into organic molecules. Return route: denitrification moves nitrate nitrogen towards N₂ under suitable, often low-oxygen conditions.',
    ),
    t(
      '吸收路线经有机物分解氨化返回NH₄⁺；返回路线标记仍在N₂。每步守恒一个标记氮原子；其他养分不必共享氮的气态路径。',
      'The uptake route returns organic nitrogen to NH₄⁺ by ammonification; the return-route marker remains in N₂. One marked atom is conserved; other nutrients need not share this atmospheric route.',
    ),
  ],
  L095: [
    t(
      '起点1000kJ是同面积、同时间的生产者新生物量能量；不等于入射太阳能或某时点所有生物量。',
      'The1000kJ input is producer production over a matched area and interval, not incoming sunlight or total standing biomass.',
    ),
    t(
      '第一层将输入分为下一层、碎屑、热三路。10%示例给100+300+600=1000kJ；碎屑30%只是本模型假设。',
      'The first level splits input among next-level production, detritus and heat. At10%,100+300+600=1000kJ. The30% detrital share is a model assumption.',
    ),
    t(
      '下一层以得到的能量为新输入，再按同一假设分账。传递效率5%、10%、20%会产生不同上层生产量，不是固定10%法则。',
      'The next level uses received energy as its input and repeats the account.5%,10% and20% efficiencies give different upper-level production rather than a fixed ten-percent law.',
    ),
    t(
      '多个营养级的碎屑都可供分解者利用，分解者也呼吸散热。每行守恒，不代表有用能量可无损循环或回到太阳。',
      'Detritus from several levels can support decomposers, which also respire and release heat. Each account conserves energy without recycling useful energy losslessly or returning it to the Sun.',
    ),
  ],
  L096: [
    t(
      '三个虚构分解者群落都以落叶分解速率指数100开始，落叶投入和扰动强度相同。四种差异响应、四种同样敏感或一种耐旱者是人为规定。',
      'Three fictional decomposer communities start with litter-decomposition rate index100, equal litter inputs and disturbance intensity. Four differing responders, four similarly sensitive species or one drought-tolerant species are stipulated.',
    ),
    t(
      '第1天显示扰动后功能；抵抗指标=第1天/100。假设湿度改变酶活动与存活，响应不同的存活者可部分承担相同分解功能。',
      'Day1 shows function after impact; resistance=day1/100. Moisture is assumed to affect enzyme activity and survival; differently responding survivors may partly compensate in decomposition.',
    ),
    t(
      '第30天记录恢复快照；损失恢复比例=(第30天−第1天)/(100−第1天)，不是通用恢复速率。四种都怕旱时可不如一种耐旱者，换水淹可换排名。虚构数据无重复，不能给现实置信区间。',
      'Day30 is a recovery snapshot; recovered-loss fraction=(day30−day1)/(100−day1), not a universal recovery rate. Four drought-sensitive species can underperform one tolerant species, and flooding may change rankings. Fictional unreplicated records yield no real confidence interval.',
    ),
  ],
};
function Label({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#273f35" fontSize="17">
      {children}
    </text>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  active = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1),
    backX = x2 - 12 * Math.cos(angle),
    backY = y2 - 12 * Math.sin(angle);
  return (
    <g
      stroke={active ? gold : '#c4c9be'}
      strokeWidth={active ? 5 : 3}
      fill="none"
    >
      <path d={`M${x1} ${y1} L${x2} ${y2}`} />
      <polygon
        points={`${x2},${y2} ${backX + 7 * Math.sin(angle)},${backY - 7 * Math.cos(angle)} ${backX - 7 * Math.sin(angle)},${backY + 7 * Math.cos(angle)}`}
        fill={active ? gold : '#c4c9be'}
        stroke="none"
      />
    </g>
  );
}
function Artwork({ id, mode, frame = 3, option = 0, alternate = 0 }: ArtProps) {
  let scene: ReactNode;
  if (id === 'L089') {
    const r = variationRoutes[option]!;
    scene = (
      <>
        <Label x={320} y={50}>
          {word(
            mode,
            t(
              '已有版本 → 改变 → 传递',
              'Existing versions → change → transmission',
            ),
          )}
        </Label>
        {r.before.map((s, i) => (
          <g key={s}>
            <rect
              x={65 + i * 270}
              y={85}
              width="210"
              height="55"
              rx="12"
              fill={i ? blue : green}
            />
            <text
              x={170 + i * 270}
              y={120}
              textAnchor="middle"
              fontSize="26"
              fill="white"
            >
              {s}
            </text>
          </g>
        ))}
        <Arrow x1={320} y1={150} x2={320} y2={195} active={frame > 0} />
        {frame > 0 &&
          r.after.map((s, i) => (
            <g key={s}>
              <rect
                x={40 + i * 145}
                y={210}
                width="128"
                height="58"
                rx="12"
                fill={s.includes('*') ? gold : i % 2 ? blue : green}
              />
              <text
                x={104 + i * 145}
                y={248}
                textAnchor="middle"
                fontSize="23"
                fill="white"
              >
                {s}
              </text>
            </g>
          ))}
        {frame > 1 && (
          <>
            <Arrow x1={320} y1={280} x2={320} y2={315} />
            <Label x={320} y={350}>
              {word(
                mode,
                option === 2
                  ? t(
                      '皮肤细胞：通常不传给后代',
                      'Skin lineage: ordinarily not inherited',
                    )
                  : t(
                      '配子传递取决于参与受精',
                      'Transmission depends on fertilization',
                    ),
              )}
            </Label>
          </>
        )}
      </>
    );
  } else if (id === 'L090') {
    const rows = selection(
      alternate ? 0 : 0.5,
      option ? 1 : 2,
      option ? 2 : 1,
      3,
    );
    scene = (
      <>
        <Label x={320} y={40}>
          {word(
            mode,
            t(
              'A（绿色）与B（蓝色）的频率',
              'Frequency of A (green) and B (blue)',
            ),
          )}
        </Label>
        {rows.slice(0, frame + 1).map((p, i) => (
          <g key={i}>
            <Label x={72} y={98 + i * 78}>{`G${i}`}</Label>
            <rect x="120" y={67 + i * 78} width="440" height="44" fill={blue} />
            <rect
              x="120"
              y={67 + i * 78}
              width={440 * p}
              height="44"
              fill={green}
            />
            <Label
              x={340}
              y={134 + i * 78}
            >{`A ${(p * 100).toFixed(1)}% · B ${((1 - p) * 100).toFixed(1)}%`}</Label>
          </g>
        ))}
      </>
    );
  } else if (id === 'L091') {
    scene =
      option === 0 ? (
        <>
          {[0, 1, 2].map((n) => (
            <g key={n}>
              <rect
                x="80"
                y={65 + n * 95}
                width="480"
                height="84"
                fill={['#e2d6b5', '#c6b592', '#a49479'][n]}
              />
              <path
                d={`M230 ${105 + n * 95} q40 -30 80 0 l45 -15 -10 35 -35 -15 q-40 30 -80 0z`}
                fill={green}
                opacity={frame === 0 && n > 0 ? 0.15 : 1}
              />
              {Array.from({ length: 3 + n }, (_, i) => (
                <path
                  key={i}
                  d={`M${260 + i * 16} ${100 + n * 95} l-5 25`}
                  stroke="#f8f3df"
                  strokeWidth="4"
                />
              ))}
              <Label x={125} y={115 + n * 95}>
                {3 - n}
              </Label>
            </g>
          ))}
          <Label x={320} y={385}>
            {word(
              mode,
              t(
                '下方通常较早；检查扰动',
                'Lower generally older; check disturbance',
              ),
            )}
          </Label>
        </>
      ) : option === 1 ? (
        <>
          {[0, 1, 2].map((n) => (
            <g
              key={n}
              transform={`translate(80 ${70 + n * 100})`}
              opacity={frame === 0 && n > 0 ? 0.15 : 1}
            >
              <path
                d="M0 25 L150 25 M150 25 L250 0 M150 25 L250 55 M250 0 L400 -10 M250 55 L400 70"
                fill="none"
                stroke={n === 1 ? blue : green}
                strokeWidth={14 - n * 3}
                strokeLinecap="round"
              />
              <circle cx="150" cy="25" r="12" fill={gold} />
            </g>
          ))}
          <Label x={320} y={385}>
            {word(
              mode,
              t(
                '比较对应细节，不只比较用途',
                'Compare correspondence, not function alone',
              ),
            )}
          </Label>
        </>
      ) : (
        <>
          <Label x={320} y={55}>
            {word(
              mode,
              t('虚构对齐：100个位点', 'Invented alignment: 100 sites'),
            )}
          </Label>
          {[
            ['A—B', 4],
            ['A—C', 18],
            ['B—C', 17],
          ].map(([pair, d], i) => (
            <g key={pair}>
              <Label x={105} y={125 + i * 90}>
                {pair}
              </Label>
              <rect
                x="180"
                y={95 + i * 90}
                width={Number(d) * 17}
                height="42"
                rx="6"
                fill={i === 0 ? green : blue}
              />
              <Label x={530} y={125 + i * 90}>
                {d}
              </Label>
            </g>
          ))}
          <Label x={320} y={385}>
            {word(mode, t('差异数不是年数', 'Differences are not years'))}
          </Label>
        </>
      );
    scene = (
      <>
        {scene}
        {frame >= 1 && (
          <path
            d={option === 2 ? 'M170 88 H155 V142 H170' : 'M225 45 V340'}
            stroke={gold}
            strokeWidth="5"
            fill="none"
          />
        )}
        {frame === 2 && (
          <>
            <rect
              x="455"
              y="300"
              width="105"
              height="55"
              rx="10"
              fill="#f6e5bd"
              stroke={gold}
              strokeDasharray="6 4"
            />
            <Label x={507} y={336}>
              ?
            </Label>
          </>
        )}
      </>
    );
  } else if (id === 'L092') {
    const a = option ? 'Birch' : 'Amber',
      b = option ? 'Amber' : 'Birch';
    scene = (
      <>
        <path
          d="M80 210 H190 M190 210 V120 H320 M190 210 V300 H480 M320 120 V70 H480 M320 120 V170 H480"
          stroke={green}
          fill="none"
          strokeWidth="6"
        />
        <circle cx="190" cy="210" r="11" fill={gold} />
        <circle cx="320" cy="120" r="11" fill={gold} />
        <Label x={540} y={77}>
          {a}
        </Label>
        <Label x={540} y={177}>
          {b}
        </Label>
        <Label x={540} y={307}>
          Cobalt
        </Label>
        {frame > 0 && (
          <path
            d="M270 325 q-35 20 0 45 t0 25"
            stroke={blue}
            fill="none"
            strokeWidth="7"
          />
        )}
        {frame >= 2 && (
          <>
            <circle cx="420" cy="70" r="9" fill={green} />
            <circle cx="420" cy="170" r="9" fill={blue} />
          </>
        )}
        {frame === 3 && (
          <path
            d="M440 85 V150"
            stroke={gold}
            strokeWidth="4"
            strokeDasharray="5 5"
          />
        )}
        <Label x={320} y={375}>
          {word(
            mode,
            [
              t('可交换基因', 'Gene exchange'),
              t('屏障减少基因流', 'Barrier reduces gene flow'),
              t('分化可能发生', 'Divergence may occur'),
              t('接触后需检验生殖屏障', 'Test barriers after renewed contact'),
            ][Math.min(frame, 3)]!,
          )}
        </Label>
      </>
    );
  } else if (id === 'L093') {
    const state = carbonStates(!option)[Math.min(frame, 5)]!;
    const boxes = [
      ['air', 95, 55, t('空气', 'Air')],
      ['plants', 405, 55, t('植物', 'Plants')],
      ['detritus', 405, 245, t('碎屑', 'Detritus')],
      ['fuel', 95, 245, t('燃料', 'Fuel')],
    ] as const;
    const arrows = [
      [245, 83, 395, 83],
      [395, 147, 245, 147],
      [485, 175, 485, 232],
      [400, 250, 245, 160],
      [175, 235, 175, 175],
    ];
    {
      scene = (
        <>
          {arrows.map(([x1, y1, x2, y2], i) => (
            <Arrow
              key={i}
              x1={x1!}
              y1={y1!}
              x2={x2!}
              y2={y2!}
              active={frame === i + 1}
            />
          ))}
          {boxes.map(([key, x, y, label]) => (
            <g key={key}>
              <rect
                x={x}
                y={y}
                width="150"
                height="112"
                rx="18"
                fill={key === 'plants' ? '#d4e3cf' : '#e2e9e6'}
              />
              <Label x={x + 75} y={y + 38}>
                {word(mode, label)}
              </Label>
              <text
                x={x + 75}
                y={y + 85}
                textAnchor="middle"
                fontSize="32"
                fill={green}
              >
                {state[key]}
              </text>
            </g>
          ))}
          <Label
            x={320}
            y={390}
          >{`${word(mode, t('总碳', 'Total carbon'))} = ${Object.values(state).reduce((a, b) => a + b, 0)}`}</Label>
        </>
      );
    }
  } else if (id === 'L094') {
    const path = option ? 'return' : 'uptake',
      active = nitrogenState(path, Math.min(frame, 5));
    const forms = [
      'N₂',
      'NH₄⁺',
      'NO₂⁻',
      'NO₃⁻',
      option ? 'N₂' : 'organic N',
      option ? 'N₂' : 'NH₄⁺',
    ].slice(0, option ? 5 : 6);
    scene = (
      <>
        {forms.map((form, i) => {
          const x = 85 + (i < 3 ? i : 5 - i) * 235,
            y = 80 + Math.floor(i / 3) * 185;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="47"
                fill={frame === i ? gold : '#dce5d9'}
                stroke={green}
                strokeWidth="2"
              />
              <Label x={x} y={y + 6}>
                {form === 'organic N'
                  ? word(mode, t('有机氮', 'Organic N'))
                  : form}
              </Label>
              <Label x={x} y={y + 78}>
                {i + 1}
              </Label>
              {i < forms.length - 1 && (
                <Arrow
                  x1={i === 2 ? x : i < 3 ? x + 55 : x - 55}
                  y1={i === 2 ? y + 90 : y}
                  x2={i === 2 ? x : i < 3 ? x + 180 : x - 180}
                  y2={i === 2 ? y + 130 : y}
                  active={frame === i + 1}
                />
              )}
            </g>
          );
        })}
        <Label
          x={320}
          y={385}
        >{`${word(mode, t('标记氮原子', 'Marked N atom'))}: ${active.nitrogenAtoms}`}</Label>
      </>
    );
  } else if (id === 'L095') {
    const e = [0.05, 0.1, 0.2][option]!;
    scene = (
      <>
        <Label
          x={320}
          y={38}
        >{`${word(mode, t('假设传递效率', 'Assumed transfer'))}: ${e * 100}%`}</Label>
        {[0, 1, 2]
          .filter((i) => i <= frame)
          .map((i) => {
            const input = 1000 * e ** i,
              y = 245 - i * 85;
            return (
              <g key={i}>
                <path
                  d={`M${110 + i * 65} ${y} H${530 - i * 65} L${560 - i * 65} ${y + 70} H${80 + i * 65}Z`}
                  fill={[green, blue, gold][i]}
                />
                <text
                  x="320"
                  y={y + 45}
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                >
                  {input.toFixed(1)} kJ
                </text>
                {frame === 3 && (
                  <Arrow x1={550 - i * 65} y1={y + 35} x2={600} y2={y + 35} />
                )}
              </g>
            );
          })}
        <Label x={320} y={365}>
          {word(
            mode,
            t(
              '热＋碎屑＋下一层＝本层输入',
              'Heat + detritus + next = level input',
            ),
          )}
        </Label>
        <Label x={320} y={395}>
          {word(
            mode,
            t(
              '图带宽仅排版；数值为生产量',
              'Band widths are layout; numbers are production',
            ),
          )}
        </Label>
      </>
    );
  } else {
    const result = disturbanceComparison({
      community: (['diverse', 'redundant', 'single'] as const)[option]!,
      disturbance: alternate ? 'flood' : 'drought',
    });
    const coords = result.records
      .slice(0, frame + 1)
      .map((r, i) => `${110 + i * 210},${320 - r.function * 2.3}`)
      .join(' ');
    scene = (
      <>
        <Label x={320} y={35}>
          {word(
            mode,
            t(
              '落叶分解速率指数；起点100',
              'Litter-decomposition index; baseline100',
            ),
          )}
        </Label>
        <path d="M80 70 V320 H580" fill="none" stroke={green} strokeWidth="3" />
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <Label x={48} y={325 - v * 2.3}>
              {v}
            </Label>
            <path d={`M80 ${320 - v * 2.3} H580`} stroke="#d6decf" />
          </g>
        ))}
        <polyline points={coords} fill="none" stroke={blue} strokeWidth="5" />
        {result.records.slice(0, frame + 1).map((r, i) => (
          <g key={r.time}>
            <circle
              cx={110 + i * 210}
              cy={320 - r.function * 2.3}
              r="9"
              fill={gold}
            />
            <Label x={110 + i * 210} y={296 - r.function * 2.3}>
              {r.function}
            </Label>
          </g>
        ))}
        {result.records.map((r, i) => (
          <Label
            key={r.time}
            x={110 + i * 210}
            y={352}
          >{`${word(mode, t('第', 'Day '))}${r.time}${mode === 'en' ? '' : '天'}`}</Label>
        ))}
        <Label x={320} y={390}>
          {word(
            mode,
            t(
              '快照横向间隔不代表等长时间',
              'Snapshot spacing does not represent equal time',
            ),
          )}
        </Label>
      </>
    );
  }
  return (
    <>
      <div
        role="region"
        aria-label={word(
          mode,
          t(
            '可横向滚动的机制图；方向键移动',
            'Scrollable mechanism diagram; use arrow keys',
          ),
        )}
        tabIndex={0}
        style={{ minWidth: 0, maxWidth: '100%', overflowX: 'auto' }}
      >
        <svg
          role="img"
          aria-label={word(mode, titles[id]!)}
          viewBox="0 0 640 420"
          style={{
            width: '100%',
            minWidth: 520,
            height: 'auto',
            maxHeight: 460,
          }}
        >
          <title>{word(mode, titles[id]!)}</title>
          <rect x="4" y="4" width="632" height="412" rx="20" fill="#f1f3e9" />
          {scene}
        </svg>
      </div>
      <p style={{ fontSize: '0.9em' }}>
        <Text
          mode={mode}
          text={t(
            '窄屏可横向滑动；键盘聚焦图后用方向键。完整过程与数据在图下。',
            'On narrow screens, swipe horizontally or focus the diagram and use arrow keys. Full explanations and data follow below.',
          )}
        />
      </p>
    </>
  );
}

function Choices({
  mode,
  label,
  items,
  value,
  choose,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  items: LocalizedText[];
  value: number;
  choose: (n: number) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: '12px 0' }}>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((text, i) => (
          <button
            type="button"
            key={i}
            style={{ minHeight: 44, whiteSpace: 'normal' }}
            aria-pressed={value === i}
            onClick={() => choose(i)}
          >
            <Text mode={mode} text={text} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
const options: Record<string, LocalizedText[]> = {
  L089: [
    t('生殖细胞系突变', 'Germline mutation'),
    t('重组已有版本', 'Recombine existing versions'),
    t('动物皮肤突变', 'Animal skin mutation'),
  ],
  L090: [
    t('A贡献2，B贡献1', 'A contributes2, B1'),
    t('A贡献1，B贡献2', 'A contributes1, B2'),
  ],
  L091: [
    t('地层与化石', 'Layers and fossils'),
    t('对应解剖', 'Corresponding anatomy'),
    t('分子比较', 'Molecular comparisons'),
  ],
  L092: [
    t('原分支位置', 'Original branches'),
    t('旋转分支', 'Rotate branches'),
  ],
  L093: [t('燃烧5份碳', 'Burn5 carbon units'), t('不燃烧', 'No combustion')],
  L094: [
    t('植物吸收与氨化', 'Uptake and ammonification'),
    t('反硝化返回大气', 'Denitrification to air'),
  ],
  L095: [
    t('5%传递', '5% transfer'),
    t('10%传递', '10% transfer'),
    t('20%传递', '20% transfer'),
  ],
  L096: [
    t('四种，不同响应', 'Four, different responses'),
    t('四种，同样敏感', 'Four, similar sensitivities'),
    t('一种，耐旱', 'One, drought tolerant'),
  ],
};
function Data({ id, mode, frame, option, alternate }: Required<ArtProps>) {
  if (id === 'L090') {
    const values = selection(
      alternate ? 0 : 0.5,
      option ? 1 : 2,
      option ? 2 : 1,
      3,
    );
    return (
      <table>
        <caption>
          <Text
            mode={mode}
            text={t(
              '原创条件模型；无突变/迁入，类型稳定复制，归一化比例不是数量预测。',
              'Original conditional model: no mutation/immigration, faithful copying; normalized frequencies are not count predictions.',
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>G</th>
            <th>A</th>
            <th>B</th>
          </tr>
        </thead>
        <tbody>
          {values.slice(0, frame + 1).map((p, i) => (
            <tr key={i}>
              <th>{i}</th>
              <td>{p.toFixed(4)}</td>
              <td>{(1 - p).toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (id === 'L093') {
    const states = carbonStates(!option);
    return (
      <table>
        <caption>
          <Text
            mode={mode}
            text={t(
              '四库封闭碳账本；每步转移量非真实速率。省略动物、活微生物、海洋和岩石等库。',
              'Closed four-store carbon account; transfers per step are not real rates. Animals, living microbes, oceans and rocks are omitted.',
            )}
          />
        </caption>
        <thead>
          <tr>
            {[
              t('步骤', 'Step'),
              t('空气', 'Air'),
              t('植物', 'Plants'),
              t('碎屑', 'Detritus'),
              t('燃料', 'Fuel'),
              t('总碳', 'Total'),
            ].map((x) => (
              <th key={x.en}>
                <Text mode={mode} text={x} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.slice(0, frame + 1).map((s, i) => (
            <tr key={i}>
              <th>
                {i === 0
                  ? '0'
                  : `${i} · ${word(mode, [t('光合', 'Photosynthesis'), t('呼吸', 'Respiration'), t('凋落', 'Litter'), t('分解者呼吸', 'Decomposer respiration'), t('燃烧可关闭', 'Optional combustion')][i - 1]!)}`}
              </th>
              {Object.values(s).map((v, j) => (
                <td key={j}>{v}</td>
              ))}
              <td>{Object.values(s).reduce((a, b) => a + b, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (id === 'L095') {
    const e = [0.05, 0.1, 0.2][option]!;
    return (
      <table>
        <caption>
          <Text
            mode={mode}
            text={t(
              '原创能量账本：kJ，同一面积时期；碎屑固定30%仅为假设，各层分别闭合。',
              'Original energy account: kJ per matched area and interval;30% detritus is assumed, and each level closes separately.',
            )}
          />
        </caption>
        <thead>
          <tr>
            {[
              t('层', 'Level'),
              t('输入', 'Input'),
              t('下一层', 'Next'),
              t('碎屑', 'Detritus'),
              t('热', 'Heat'),
            ].map((x) => (
              <th key={x.en}>
                <Text mode={mode} text={x} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].slice(0, Math.max(1, frame)).map((i) => {
            const b = energyBudget(1000 * e ** i, e);
            return (
              <tr key={i}>
                <th>{i}</th>
                {[b.input, b.next, b.detritus, b.heat].map((v, j) => (
                  <td key={j}>{v.toFixed(2)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  if (id === 'L096') {
    const r = disturbanceComparison({
      community: (['diverse', 'redundant', 'single'] as Community[])[option]!,
      disturbance: alternate ? 'flood' : 'drought',
    });
    return (
      <>
        <p>
          <Text
            mode={mode}
            text={t(
              `抵抗（第1天/100）=${r.resistance.toFixed(2)}；30天损失恢复比例=${(r.resilience * 100).toFixed(1)}%。后者=(第30天−第1天)/(100−第1天)，是窗口快照，不是通用恢复速率。`,
              `Resistance(day1/100)=${r.resistance.toFixed(2)}; lost-function recovery by day30=${(r.resilience * 100).toFixed(1)}%. The latter=(day30−day1)/(100−day1), a window snapshot, not a universal recovery rate.`,
            )}
          />
        </p>
        <table>
          <caption>
            <Text
              mode={mode}
              text={t(
                '同一扰动的原创反事实比较；指数是落叶分解速率，非物种数。',
                'Original matched counterfactual comparisons; indices measure litter-decomposition rate, not species counts.',
              )}
            />
          </caption>
          <thead>
            <tr>
              {[
                t('群落', 'Community'),
                t('物种数', 'Richness'),
                t('第0天', 'Day0'),
                t('第1天', 'Day1'),
                t('第30天', 'Day30'),
              ].map((x) => (
                <th key={x.en}>
                  <Text mode={mode} text={x} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {disturbanceComparisonRecords
              .filter(
                (x) => x.disturbance === (alternate ? 'flood' : 'drought'),
              )
              .map((x) => (
                <tr key={x.community}>
                  <th>
                    <Text
                      mode={mode}
                      text={
                        options.L096![
                          (
                            ['diverse', 'redundant', 'single'] as string[]
                          ).indexOf(x.community)
                        ]!
                      }
                    />
                  </th>
                  <td>{x.richness}</td>
                  {x.records.map((v) => (
                    <td key={v.time}>{v.function}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <p>
          <Text
            mode={mode}
            text={t(
              '因果假设：固定落叶投入与初始总分解；标准化短时干旱或水淹持续至第1天测量，随后恢复共同基线湿度并保持至第30天。湿度影响酶与存活，不同响应的存活者可部分补位。没有重复/误差条，不能从虚构记录估计现实置信区间。',
              'Causal assumptions: fixed litter inputs and initial decomposition; a standardized brief drought/flood pulse lasts through day1 measurement, then common baseline moisture is restored until day30. Moisture affects enzymes and survival; differing survivors may partly compensate. No replicates or error bars; fictional records yield no real confidence interval.',
            )}
          />
        </p>
      </>
    );
  }
  if (id === 'L091') {
    const r = evidenceRecords[option]!;
    return (
      <p>
        <Text
          mode={mode}
          text={
            option === 0
              ? t(
                  '观察：可靠地层顺序中的形态变化。推论需可靠时间背景。限制：保存缺口、翻转和再搬运；不把单项相似当证明。',
                  `${r.observation} ${r.limitation}`,
                )
              : option === 1
                ? t(
                    '观察：不同用途肢体的骨骼位置和连接对应。支持同源假说，仍须多项特征排除仅功能相似的趋同。',
                    `${r.observation} ${r.limitation}`,
                  )
                : t(
                    '原创100位点差异：AB4、AC18、BC17。在序列可比等假设下支持AB较近，不能直接定年，需更多独立片段。',
                    `${r.observation} ${r.limitation}`,
                  )
          }
        />
      </p>
    );
  }
  if (id === 'L089')
    return (
      <p>
        <Text
          mode={mode}
          text={
            option === 1
              ? t(
                  '结果：AB/ab→AB/ab/Ab/aB，组合增加，但每个位置的等位基因仍A/a与B/b。',
                  'Result: AB/ab→AB/ab/Ab/aB adds combinations while alleles remain A/a and B/b.',
                )
              : option === 2
                ? t(
                    '结果：皮肤细胞中的星号新序列可能影响个体，动物例子通常没有配子传递路径。',
                    'Result: a new starred skin sequence may affect the individual but ordinarily lacks a gamete-transmission route in this animal example.',
                  )
                : t(
                    '结果：星号标记新序列版本；是否遗传取决于生殖细胞路径，不预测有利效应。',
                    'Result: a star marks a new sequence version; inheritance depends on reproductive lineage and does not predict benefit.',
                  )
          }
        />
      </p>
    );
  if (id === 'L094')
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            `当前形态：${nitrogenState(option ? 'return' : 'uptake', frame).form}。金色标记始终为一个氮原子；N₂本身有两个氮。植物可直接吸收铵，图只是分支中的一个例子。`,
            `Current form: ${nitrogenState(option ? 'return' : 'uptake', frame).form}. The gold marker always represents one nitrogen atom; N₂ contains two. Plants can absorb ammonium directly; the diagram is one possible branch.`,
          )}
        />
      </p>
    );
  return (
    <p>
      <Text
        mode={mode}
        text={t(
          '始终是((Amber,Birch),Cobalt)：旋转不改变共同祖先。全部为虚构分类群，线长没有时间含义；恢复接触后的基因交流与繁殖证据才可检验屏障。',
          'Always((Amber,Birch),Cobalt): rotation preserves common ancestry. All taxa are fictional and lengths carry no time meaning; gene exchange and reproduction after renewed contact test barriers.',
        )}
      />
    </p>
  );
}
function Lab({ id, mode, onExplore }: Props) {
  const [option, setOption] = useState(id === 'L095' ? 1 : 0),
    [alternate, setAlternate] = useState(0);
  const flow = useFrames(
    id === 'L093'
      ? 5
      : id === 'L094'
        ? option
          ? 4
          : 5
        : id === 'L091' || id === 'L096'
          ? 2
          : 3,
    onExplore,
  );
  const choose = (n: number) => {
    setOption(n);
    flow.reset();
    onExplore();
  };
  return (
    <div className="bio-lab bio-s3-lab">
      <h3>
        <Text mode={mode} text={titles[id]!} />
      </h3>
      <Choices
        mode={mode}
        label={t('比较条件', 'Comparison conditions')}
        items={options[id]!}
        value={option}
        choose={choose}
      />
      {(id === 'L090' || id === 'L096') && (
        <Choices
          mode={mode}
          label={
            id === 'L090'
              ? t('初始可遗传变异', 'Initial inherited variation')
              : t('等强度虚构扰动', 'Equal-intensity fictional disturbance')
          }
          items={
            id === 'L090'
              ? [t('A起点1/2', 'Initial A1/2'), t('A起点0', 'Initial A0')]
              : [t('干旱', 'Drought'), t('水淹', 'Flooding')]
          }
          value={alternate}
          choose={(n) => {
            setAlternate(n);
            flow.reset();
            onExplore();
          }}
        />
      )}
      <Artwork
        id={id}
        mode={mode}
        option={option}
        alternate={alternate}
        frame={flow.frame}
      />
      <Playback flow={flow} mode={mode} />
      <p aria-live="polite">
        <Text mode={mode} text={captions[id]![flow.frame]!} />
      </p>
      <div style={{ overflowX: 'auto' }}>
        <Data
          id={id}
          mode={mode}
          frame={flow.frame}
          option={option}
          alternate={alternate}
        />
      </div>
      <details>
        <summary style={{ minHeight: 44, cursor: 'pointer' }}>
          <Text
            mode={mode}
            text={t(
              '完整静态过程与模型边界',
              'Complete static sequence and model limits',
            )}
          />
        </summary>
        <ol>
          {captions[id]!.map((c, i) => (
            <li key={i}>
              <Text mode={mode} text={c} />
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
export function EvolutionCycleExplore(props: Props) {
  return <Lab key={props.id} {...props} />;
}
export function EvolutionCycleHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return (
    <Artwork
      id={id}
      mode={mode}
      frame={
        id === 'L093' || id === 'L094'
          ? 5
          : id === 'L091' || id === 'L096'
            ? 2
            : 3
      }
      option={id === 'L095' ? 1 : 0}
    />
  );
}
export function EvolutionCycleDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0);
  return (
    <figure className="bio-lab bio-s3-lab">
      <EvolutionCycleHookArt id={id} mode={mode} />
      <Choices
        mode={mode}
        label={t('可键盘选择的图解线索', 'Keyboard-accessible diagram clues')}
        items={[
          t('起点与边界', 'Starting state and boundary'),
          t('因果机制', 'Causal mechanism'),
          t('结论与限制', 'Conclusion and limitations'),
        ]}
        value={clue}
        choose={setClue}
      />
      <figcaption aria-live="polite">
        <Text
          mode={mode}
          text={
            captions[id]![
              clue === 0
                ? 0
                : clue === 1
                  ? Math.min(2, captions[id]!.length - 1)
                  : captions[id]!.length - 1
            ]!
          }
        />
      </figcaption>
    </figure>
  );
}
