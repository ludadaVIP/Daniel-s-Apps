import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  meadowGrid,
  meadowCensus,
  meadowArea,
  pathSample,
  randomQuadrats,
  estimateMeadow,
  populationBalance,
  limitingResource,
  resourceScenarios,
  ecoRecords,
  mean,
  fictionalLeafLength,
  variationBins,
  leafLengths,
  spotCounts,
  offspringPossibilities,
} from './populationModel';

type Props = { id: string; mode: LanguageMode; onExplore: () => void };
type ArtProps = {
  id: string;
  mode: LanguageMode;
  frame?: number;
  option?: number;
  option2?: number;
  selected?: readonly string[];
  onCell?: (id: string) => void;
};
const green = '#6e855a',
  blue = '#568998',
  gold = '#b59548',
  pink = '#b97770';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const labels: Record<string, LocalizedText> = {
  L065: t(
    '同种个体、范围与四项数量流向',
    'One species, a boundary and four population flows',
  ),
  L066: t(
    '相同模型单位的三种资源支持容量',
    'Three resource support capacities in matching model units',
  ),
  L067: t(
    '36平方米虚拟草地的样方位置与计数',
    'Quadrat positions and counts in a 36 m² virtual meadow',
  ),
  L068: t(
    '四次访问的原始重复与均值',
    'Raw replicates and means from four visits',
  ),
  L069: t(
    '虚构植物基因型与环境的受控比较',
    'Controlled genotype and environment comparisons in fictional plants',
  ),
  L070: t(
    '细胞、核、染色体、DNA与基因的关系',
    'Cell, nucleus, chromosome, DNA and gene relationships',
  ),
  L071: t(
    '同种虚构叶虫的连续长度与离散斑点变异',
    'Continuous length and discrete spots in fictional leafbugs',
  ),
  L072: t(
    '虚构单位置的亲代、配子和子代组合',
    'Parents, gametes and offspring possibilities at a fictional locus',
  ),
};
function Label({
  mode,
  text,
  x,
  y,
  size = 13,
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
function Scene({
  id,
  mode,
  children,
  height = 300,
}: {
  id: string;
  mode: LanguageMode;
  children: ReactNode;
  height?: number;
}) {
  return (
    <svg
      viewBox={`0 0 420 ${height}`}
      role="img"
      aria-label={word(mode, labels[id]!)}
      style={{ width: '100%', height: 'auto', maxHeight: 440 }}
    >
      <title>{word(mode, labels[id]!)}</title>
      <rect
        x="8"
        y="8"
        width="404"
        height={height - 16}
        rx="22"
        fill="#eff1e6"
      />
      {children}
    </svg>
  );
}
function Leaf({
  x,
  y,
  length = 45,
  color = green,
}: {
  x: number;
  y: number;
  length?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 0 C${-length / 2} ${-length / 3} ${-length / 2} ${-length} 0 ${-length} C${length / 2} ${-length} ${length / 2} ${-length / 3} 0 0`}
        fill={color}
      />
      <path
        d={`M0 12 V${-length + 6}`}
        stroke="#354832"
        fill="none"
        strokeWidth="2"
      />
    </g>
  );
}
function Arrow({
  x,
  y,
  down = false,
  color = blue,
}: {
  x: number;
  y: number;
  down?: boolean;
  color?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) ${down ? 'rotate(90)' : ''}`}
      stroke={color}
      fill={color}
    >
      <path d="M0 0H42" strokeWidth="3" />
      <path d="M42 0l-8 -5v10Z" />
    </g>
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
    <div
      className="bio-choice-row"
      role="group"
      aria-label={word(mode, label)}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}
    >
      {items.map((item, i) => (
        <button
          type="button"
          key={i}
          aria-pressed={i === value}
          onClick={() => choose(i)}
          style={{ minHeight: 44, maxWidth: '100%', whiteSpace: 'normal' }}
        >
          <Text mode={mode} text={item} />
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
          text={t('文字版、假设与局限', 'Text version, assumptions and limits')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
const staticNotes: Record<string, LocalizedText> = {
  L065: t(
    '虚构池塘的一种蛙，从20开始。出生5、死亡3、迁入2或6、迁出4，末值20或24；其他物种不进入蛙种群总数。仅核对已提供事件，不预测真实生物。',
    'One frog species in an invented pond starts at 20. Births 5, deaths 3, immigration 2 or 6, emigration 4 produce 20 or 24. Other species are excluded from frog abundance. This accounts for supplied events, not real forecasts.',
  ),
  L066: t(
    '水、光、矿质支持容量均为同一种人为幼苗单位。干燥3/8/6→容量3，补水7/8/6→6，遮光7/2/6→2。取最小是类比规则，不是自然种群或真实容纳量公式。',
    'Water/light/mineral capacities all use the same invented seedling-units: dry 3/8/6 → 3, watered 7/8/6 → 6, shaded 7/2/6 → 2. The minimum is an analogy, not a natural-population or carrying-capacity equation.',
  ),
  L067: t(
    '36格各1平方米，同种可区分植物在同一时期的虚构计数，总数96。随机方案不放回抽取；路边六格计数4，估计24。点击格可检验人为偏差；密集选点可能偏高，路边偏低。总数是教学普查，不是环境容纳量。',
    'Thirty-six 1 m² cells contain invented counts of distinct individuals of one species at one time, census 96. Random samples are without replacement. Six roadside cells contain four, estimating 24. Manual dense choices can bias upwards; roadsides bias downwards here. Census is not carrying capacity.',
  ),
  L068: t(
    '四次虚构访问，每次每组3个不同1平方米样方。遮荫均值3/4/5/4，开阔2/3/4/3。雨量12/25/41/18毫米来自每次之前相等时段；观察性关联不能排除温度、季节、计数差异等原因。不作真实保护预测。',
    'Four invented visits each survey three distinct 1 m² quadrats per group. Shade means 3/4/5/4, open means 2/3/4/3. Rainfall 12/25/41/18 mm covers equal preceding periods. Observational association does not exclude temperature, season or detection. No real conservation prediction.',
  ),
  L069: t(
    '纸叶草完全虚构。单位置基础AA18/Aa16/aa14，遮护加4、暴露加0。用于比较设计，未模拟基因表达、真实发育或多基因性状；真实连续性状通常复杂得多。',
    'Paperleaf is entirely fictional. One-locus baselines AA18/Aa16/aa14 gain four under shelter and zero under exposure. This teaches comparisons, not real expression, development or polygenic traits; actual continuous traits are usually more complex.',
  ),
  L070: t(
    '细胞核含染色体，染色体含长DNA与蛋白质，基因是DNA功能区段。局部两序列是示意，不能预测表型。非按比例；核外细胞器和细菌也有DNA，染色体不是永久X形。',
    'Nuclei contain chromosomes; chromosomes include DNA and proteins; genes are functional DNA regions. Two local sequences are schematic, without phenotype predictions. Not to scale. Organelles and bacteria also contain DNA; chromosomes are not permanently X-shaped.',
  ),
  L071: t(
    '12条虚构记录。长度区间12–<15、15–<18、18–<21，各4；斑点0/1/2各3/4/5。每条只分组一次。图形描述分布，不证明遗传或环境原因；连续/离散不对应单一遗传规则。',
    'Twelve invented records: length intervals 12–<15,15–<18,18–<21 each contain four; spot counts 0/1/2 have frequencies 3/4/5. Each record is assigned once. Distributions do not establish genetic/environmental causes, and variable type does not identify an inheritance rule.',
  ),
  L072: t(
    '虚构二倍体单位置模型，每个配子得一个版本，随机结合。四格保留亲代来源，Aa×Aa得到AA/Aa/Aa/aa；概率不保证小家庭精确比例或次序。不指定复杂人类性状，不模拟连锁、细胞器遗传或完整减数分裂。',
    'A fictional diploid single-locus model gives one allele to each gamete with random union. Four routes preserve origin: Aa×Aa yields AA/Aa/Aa/aa. Probabilities guarantee neither exact small-family ratios nor order. No complex human trait, linkage, organelle inheritance or full meiosis is simulated.',
  ),
};

function Art({
  id,
  mode,
  frame = 3,
  option = 0,
  option2 = 0,
  selected = [],
  onCell,
}: ArtProps) {
  if (id === 'L065') {
    const imm = option ? 6 : 2,
      steps = [20, 25, 22, 22 + imm, 18 + imm];
    return (
      <Scene id={id} mode={mode}>
        <ellipse
          cx="210"
          cy="150"
          rx="132"
          ry="75"
          fill="#d6e5df"
          stroke={blue}
          strokeDasharray="6 4"
        />
        {Array.from({ length: Math.min(28, steps[Math.min(frame, 4)]!) }).map(
          (_, i) => (
            <circle
              key={i}
              cx={108 + (i % 7) * 34}
              cy={109 + Math.floor(i / 7) * 26}
              r="7"
              fill={green}
            />
          ),
        )}
        <Label
          mode={mode}
          text={t(
            `蛙：${steps[Math.min(frame, 4)]}`,
            `Frogs: ${steps[Math.min(frame, 4)]}`,
          )}
          x={210}
          y={247}
        />
        <Label
          mode={mode}
          text={t('同种 · 同地 · 同时期', 'One species · place · time')}
          x={210}
          y={38}
        />
        <Label
          mode={mode}
          text={
            [
              t('初始20', 'Start 20'),
              t('出生+5', 'Births +5'),
              t('死亡−3', 'Deaths −3'),
              t(`迁入+${imm}`, `Immigration +${imm}`),
              t('迁出−4', 'Emigration −4'),
            ][Math.min(frame, 4)]!
          }
          x={210}
          y={276}
        />
        {option2 === 1 && (
          <>
            <Leaf x={57} y={190} length={45} />
            <circle cx="365" cy="136" r="13" fill={gold} />
            <Label
              mode={mode}
              text={t('其他物种', 'Other species')}
              x={210}
              y={67}
            />
          </>
        )}
      </Scene>
    );
  }
  if (id === 'L066') {
    const s =
        resourceScenarios[(['dry', 'watered', 'shaded'] as const)[option]!],
      values = Object.values(s),
      limit = limitingResource(s);
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          text={t(
            '假设支持容量，不是真实株数',
            'Hypothetical capacities, not actual counts',
          )}
          x={210}
          y={36}
          size={12}
        />
        <path d="M65 65V231H365" stroke="#87927b" fill="none" />
        {values.map((v, i) => (
          <g key={i}>
            <rect
              x={90 + i * 92}
              y={230 - v * 18}
              width="48"
              height={frame >= i ? v * 18 : 0}
              fill={[blue, gold, green][i]}
            />
            <Label
              mode={mode}
              text={t(
                String(frame >= i ? v : '?'),
                String(frame >= i ? v : '?'),
              )}
              x={114 + i * 92}
              y={223 - v * 18}
            />
            <Label
              mode={mode}
              text={
                [t('水', 'Water'), t('光', 'Light'), t('矿质', 'Minerals')][i]!
              }
              x={114 + i * 92}
              y={254}
            />
          </g>
        ))}
        {frame >= 3 && (
          <path
            d={`M70 ${230 - limit.capacity * 18}H365`}
            stroke={pink}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
        )}
        <Label
          mode={mode}
          text={t(
            `容量＝${frame >= 3 ? limit.capacity : '?'}`,
            `Capacity = ${frame >= 3 ? limit.capacity : '?'}`,
          )}
          x={210}
          y={282}
        />
      </Scene>
    );
  }
  if (id === 'L067')
    return (
      <Scene id={id} mode={mode} height={360}>
        <Label
          mode={mode}
          text={t('每格1 m² · 总面积36 m²', '1 m² per cell · total 36 m²')}
          x={210}
          y={30}
        />
        {meadowGrid.map((q) => (
          <g
            key={q.id}
            role={onCell ? 'button' : undefined}
            tabIndex={onCell ? 0 : undefined}
            aria-label={`${q.id}: ${q.count}`}
            aria-pressed={onCell ? selected.includes(q.id) : undefined}
            onClick={() => onCell?.(q.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCell?.(q.id);
              }
            }}
            style={{ cursor: onCell ? 'pointer' : 'default' }}
          >
            <rect
              x={47 + q.column * 54}
              y={45 + q.row * 47}
              width="50"
              height="43"
              rx="4"
              fill={selected.includes(q.id) ? '#dbe6c7' : '#faf9f1'}
              stroke={selected.includes(q.id) ? pink : '#bbc5ac'}
              strokeWidth={selected.includes(q.id) ? 3 : 1}
            />
            <text
              x={72 + q.column * 54}
              y={59 + q.row * 47}
              textAnchor="middle"
              fontSize="10"
              fill="#354832"
            >
              {q.id}
            </text>
            <text
              x={72 + q.column * 54}
              y={79 + q.row * 47}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill={green}
            >
              {frame >= 1 ? q.count : '·'}
            </text>
          </g>
        ))}
        <Label
          mode={mode}
          text={t(
            '路边：上排六格；其余同属研究区域',
            'Path: top six cells; all cells are in scope',
          )}
          x={210}
          y={345}
          size={11}
        />
      </Scene>
    );
  if (id === 'L068') {
    const key = option ? 'open' : 'shaded';
    return (
      <Scene id={id} mode={mode} height={330}>
        <Label
          mode={mode}
          text={t(
            '均值：株/1 m²；每次n＝3',
            'Mean: plants/1 m²; n = 3 each visit',
          )}
          x={210}
          y={31}
          size={12}
        />
        <path d="M60 70V235H374" stroke="#87927b" fill="none" />
        {[0, 2, 4, 6].map((n) => (
          <g key={n}>
            <text x="47" y={239 - n * 23} fontSize="11">
              {n}
            </text>
            <path d={`M60 ${235 - n * 23}H374`} stroke="#d6ddcc" />
          </g>
        ))}
        {ecoRecords.slice(0, frame + 1).map((r, i) => {
          const m = mean(r[key])!;
          return (
            <g key={i}>
              <rect
                x={82 + i * 76}
                y={235 - m * 23}
                width="40"
                height={m * 23}
                fill={option ? gold : green}
              />
              <Label
                mode={mode}
                text={t(String(m), String(m))}
                x={102 + i * 76}
                y={226 - m * 23}
              />
              <text x={102 + i * 76} y="254" textAnchor="middle" fontSize="12">
                {r.visit}
              </text>
              <text x={102 + i * 76} y="278" textAnchor="middle" fontSize="11">
                {r[key].join(', ')}
              </text>
              <text x={102 + i * 76} y="301" textAnchor="middle" fontSize="11">
                {r.rain} mm
              </text>
            </g>
          );
        })}
        <Label
          mode={mode}
          text={t(
            '访问 / 原始数 / 之前等时段雨量',
            'Visit / raw counts / preceding rainfall',
          )}
          x={210}
          y={322}
          size={11}
        />
      </Scene>
    );
  }
  if (id === 'L069') {
    const g = (['AA', 'Aa', 'aa'] as const)[option]!,
      env = (['exposed', 'sheltered'] as const)[option2]!,
      length = fictionalLeafLength(g, env);
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          text={t(
            '虚构规则 · 非真实物种数据',
            'Invented rule · not real species data',
          )}
          x={210}
          y={32}
          size={12}
        />
        <Leaf
          x={128}
          y={211}
          length={
            frame >= 2 ? length * 6 : fictionalLeafLength(g, 'exposed') * 6
          }
        />
        <path d="M240 65V213M232 65H249M232 213H249" stroke={blue} />
        <Label mode={mode} text={t(g, g)} x={128} y={244} />
        <Label
          mode={mode}
          text={t(
            `${frame >= 2 ? length : '?'} 模型单位`,
            `${frame >= 2 ? length : '?'} model units`,
          )}
          x={300}
          y={148}
        />
        <Label
          mode={mode}
          text={
            option2
              ? t('遮护：+4', 'Shelter: +4')
              : t('暴露：+0', 'Exposure: +0')
          }
          x={210}
          y={278}
        />
        {frame >= 1 && (
          <Label
            mode={mode}
            text={t(
              `基础 ${fictionalLeafLength(g, 'exposed')}`,
              `Baseline ${fictionalLeafLength(g, 'exposed')}`,
            )}
            x={300}
            y={116}
          />
        )}
      </Scene>
    );
  }
  if (id === 'L070') {
    const seq = option ? 'ATGCCT' : 'ATGCGT',
      pair: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
    return (
      <Scene id={id} mode={mode} height={340}>
        <ellipse
          cx="85"
          cy="104"
          rx="54"
          ry="64"
          fill="#dae5d2"
          stroke={green}
        />
        <circle cx="86" cy="104" r="25" fill="#d5c7d8" stroke={pink} />
        <Label
          mode={mode}
          text={t('细胞 / 核', 'Cell / nucleus')}
          x={85}
          y={194}
          size={12}
        />
        <Arrow x={143} y={102} />
        {frame >= 1 && (
          <>
            <path
              d="M214 62q-32 10 0 23t0 23t0 23t0 23"
              fill="none"
              stroke={pink}
              strokeWidth="8"
            />
            <circle cx="214" cy="87" r="7" fill={gold} />
            <Label
              mode={mode}
              text={t('DNA＋蛋白质', 'DNA + proteins')}
              x={292}
              y={98}
              size={12}
            />
            <Label
              mode={mode}
              text={t('染色体', 'Chromosome')}
              x={214}
              y={194}
              size={12}
            />
          </>
        )}
        {frame >= 2 &&
          seq.split('').map((a, i) => (
            <g key={i}>
              <line
                x1={79 + i * 51}
                y1="233"
                x2={79 + i * 51}
                y2="284"
                stroke={i > 1 && i < 5 ? pink : blue}
                strokeWidth="4"
              />
              <text x={79 + i * 51} y="229" textAnchor="middle" fontSize="15">
                {a}
              </text>
              <text x={79 + i * 51} y="302" textAnchor="middle" fontSize="15">
                {pair[a]}
              </text>
            </g>
          ))}
        {frame >= 3 && (
          <>
            <path d="M166 311H294" stroke={pink} strokeWidth="4" />
            <Label
              mode={mode}
              text={t('基因：局部功能区段', 'Gene: a functional region')}
              x={230}
              y={330}
              size={12}
            />
          </>
        )}
      </Scene>
    );
  }
  if (id === 'L071') {
    const bins = variationBins(option ? 'spots' : 'length'),
      raw = option ? spotCounts : leafLengths,
      visible = Math.min(raw.length, (frame + 1) * 3);
    return (
      <Scene id={id} mode={mode} height={330}>
        <Label
          mode={mode}
          text={
            option
              ? t('完整斑点数（整数）', 'Whole spots (integers)')
              : t('体长（模型长度单位）', 'Length (model length units)')
          }
          x={210}
          y={31}
        />
        <path d="M65 65V231H372" stroke="#87927b" fill="none" />
        {bins.map((bin, i) => {
          const count = raw
            .slice(0, visible)
            .filter((v) =>
              option
                ? String(v) === bin.label
                : i === 0
                  ? v >= 12 && v < 15
                  : i === 1
                    ? v >= 15 && v < 18
                    : v >= 18 && v < 21,
            ).length;
          return (
            <g key={i}>
              <rect
                x={option ? 86 + i * 94 : 80 + i * 91}
                y={230 - count * 25}
                width={option ? 55 : 91}
                height={count * 25}
                fill={i % 2 ? gold : green}
                stroke="#f8f6ed"
              />
              <text
                x={option ? 113 + i * 94 : 125 + i * 91}
                y={221 - count * 25}
                textAnchor="middle"
                fontSize="13"
              >
                {count}
              </text>
              <text
                x={option ? 113 + i * 94 : 125 + i * 91}
                y="252"
                textAnchor="middle"
                fontSize="12"
              >
                {bin.label}
              </text>
            </g>
          );
        })}
        <Label
          mode={mode}
          text={t(`已显示 ${visible}/12`, `${visible}/12 records shown`)}
          x={210}
          y={285}
        />
        <text x="210" y="310" textAnchor="middle" fontSize="12">
          {raw.slice(0, visible).join(', ')}
        </text>
      </Scene>
    );
  }
  const first = (['Aa', 'AA', 'aa'] as const)[option]!,
    second = (['Aa', 'AA', 'aa'] as const)[option2]!,
    possibilities = offspringPossibilities(first, second);
  return (
    <Scene id={id} mode={mode} height={330}>
      <Label
        mode={mode}
        text={t(`亲代1：${first}`, `Parent 1: ${first}`)}
        x={111}
        y={41}
      />
      <Label
        mode={mode}
        text={t(`亲代2：${second}`, `Parent 2: ${second}`)}
        x={309}
        y={41}
      />
      {frame >= 1 && (
        <>
          <Label
            mode={mode}
            text={t(
              `配子 ${first[0]} / ${first[1]}`,
              `Gametes ${first[0]} / ${first[1]}`,
            )}
            x={111}
            y={91}
          />
          <Label
            mode={mode}
            text={t(
              `配子 ${second[0]} / ${second[1]}`,
              `Gametes ${second[0]} / ${second[1]}`,
            )}
            x={309}
            y={91}
          />
        </>
      )}
      {frame >= 2 &&
        possibilities.map((p, i) => (
          <g key={i}>
            <rect
              x={63 + (i % 2) * 155}
              y={125 + Math.floor(i / 2) * 77}
              width="140"
              height="66"
              rx="12"
              fill={frame === 3 ? '#dbe6c7' : '#f7f4e9'}
              stroke={green}
            />
            <text
              x={133 + (i % 2) * 155}
              y={149 + Math.floor(i / 2) * 77}
              textAnchor="middle"
              fontSize="13"
            >
              <tspan fill={pink}>{p.first}</tspan> +{' '}
              <tspan fill={blue}>{p.second}</tspan>
            </text>
            <text
              x={133 + (i % 2) * 155}
              y={175 + Math.floor(i / 2) * 77}
              textAnchor="middle"
              fontWeight="bold"
              fontSize="17"
            >
              {p.genotype}
            </text>
          </g>
        ))}
      <Label
        mode={mode}
        text={t(
          '四条等可能路线，不是出生顺序',
          'Four equally likely routes, not birth order',
        )}
        x={210}
        y={309}
        size={12}
      />
    </Scene>
  );
}

const captions: Record<string, LocalizedText[]> = {
  L065: [
    t(
      '先界定同种、区域、时期：初始20。',
      'Define species, area and time: start at 20.',
    ),
    t(
      '出生5使计数变25；不是从区域外迁来。',
      'Five births give 25; they are not immigrants.',
    ),
    t(
      '死亡3后为22；死亡与迁出不同。',
      'Three deaths leave 22; death differs from emigration.',
    ),
    t(
      '加入迁入个体：检查区域边界。',
      'Add immigrants crossing the study boundary.',
    ),
    t(
      '再减迁出4，核对末值；总数相同也可能有更替。',
      'Subtract four emigrants; stable totals can still include turnover.',
    ),
  ],
  L066: [
    t(
      '先揭示水支持容量，单位是人为幼苗单位。',
      'Reveal water capacity in invented seedling-units.',
    ),
    t(
      '加入光容量，不能把资源相加。',
      'Add light capacity; do not add resources.',
    ),
    t(
      '加入矿质容量，寻找最小值。',
      'Add mineral capacity and locate the minimum.',
    ),
    t(
      '虚线是本类比的共同支持容量；不预测真实种群。',
      'The line gives this analogy’s support capacity, not a real population forecast.',
    ),
  ],
  L067: [
    t(
      '先确定抽样位置，所有格都在研究范围。',
      'Set sample positions before inspecting counts; all cells are in scope.',
    ),
    t(
      '每格1平方米，只把已选格的计数相加。',
      'Each cell is 1 m²; add selected counts only.',
    ),
    t(
      '密度＝样本计数÷实际抽样面积。',
      'Density = sample count ÷ sampled area.',
    ),
    t(
      '估计＝密度×36平方米。换样本会波动；可揭示普查比较误差。',
      'Estimate = density × 36 m². Samples vary; reveal the census to compare error.',
    ),
  ],
  L068: [
    t(
      '第一次：查看3个原始记录与均值。',
      'Visit 1: inspect three raw records and their mean.',
    ),
    t(
      '第二次：比较同规则观察，不把均值当每个个体。',
      'Visit 2: compare common-rule records; a mean is not every individual.',
    ),
    t(
      '第三次：均值增加，观察并不等于已证明原因。',
      'Visit 3: the mean rises, but observations do not establish cause.',
    ),
    t(
      '第四次回落。雨量与数量有关联，仍需排除替代解释。',
      'Visit 4 declines. Rain and counts are associated; alternatives remain.',
    ),
  ],
  L069: [
    t(
      '选定基因型与环境，先作预测。',
      'Set genotype and environment, then predict.',
    ),
    t(
      '固定基因型看基础长度；不是实际物种数据。',
      'Inspect the fixed genotype baseline, not real species data.',
    ),
    t(
      '环境增量改变表型，字母组合不变。',
      'The environmental addition changes phenotype, not the allele letters.',
    ),
    t(
      '比较暴露AA与遮护aa：相同表型不能唯一推出基因型。',
      'Compare exposed AA and sheltered aa: equal phenotype does not uniquely reveal genotype.',
    ),
  ],
  L070: [
    t(
      '从典型真核细胞与细胞核开始。',
      'Start with a typical eukaryotic cell and nucleus.',
    ),
    t(
      '染色体由长DNA与蛋白质组织而成。',
      'Chromosomes organise long DNA with proteins.',
    ),
    t(
      '局部放大DNA：A–T与C–G配对，颜色只是标记。',
      'Enlarge local DNA: A–T and C–G pair; colours are labels.',
    ),
    t(
      '基因只是较长DNA的一个功能区段。这个序列不计算表型。',
      'A gene is a functional region of longer DNA; no phenotype is calculated here.',
    ),
  ],
  L071: [
    t(
      '先看3条记录：变量类型与记录精度不同。',
      'Inspect three records: variable type differs from recording precision.',
    ),
    t(
      '每条记录进入一个类别或区间。',
      'Assign each record to one category or interval.',
    ),
    t(
      '检查区间边界，不能重计18。',
      'Check boundaries; do not double-count 18.',
    ),
    t(
      '12条都保留。分布描述差异，不证明唯一原因。',
      'All twelve remain. Distribution describes differences, not a unique cause.',
    ),
  ],
  L072: [
    t('明确两个亲代在单一位置的组合。', 'Specify both parents at one locus.'),
    t(
      '每个配子得一个版本；重复字母仍有两个来源位置。',
      'Each gamete gets one version; repeated letters still have two source positions.',
    ),
    t(
      '逐条组合一个来自亲代1、一个来自亲代2的版本。',
      'Join one allele from each parent along each route.',
    ),
    t(
      '四条等可能路线给条件性概率，不强制出生比例或顺序。',
      'Four equally likely routes give conditional probabilities, not required ratios or birth order.',
    ),
  ],
};
function StandardLab({ id, mode, onExplore }: Props) {
  const [option, setOption] = useState(0),
    [option2, setOption2] = useState(0),
    [route, setRoute] = useState(0),
    flow = useFrames(id === 'L065' ? 4 : 3, onExplore);
  const change = (n: number, second = false) => {
    if (second) setOption2(n);
    else setOption(n);
    flow.reset();
    onExplore();
  };
  const controls: Record<string, LocalizedText[]> = {
    L065: [t('迁入2', '2 immigrants'), t('迁入6', '6 immigrants')],
    L066: [t('干燥', 'Dry'), t('补水', 'Watered'), t('遮光', 'Shaded')],
    L068: [t('遮荫', 'Shade'), t('开阔', 'Open')],
    L069: [t('AA', 'AA'), t('Aa', 'Aa'), t('aa', 'aa')],
    L070: [
      t('局部版本1', 'Local version 1'),
      t('局部版本2', 'Local version 2'),
    ],
    L071: [t('体长', 'Length'), t('斑点数', 'Spot count')],
    L072: [
      t('亲代1 Aa', 'Parent 1 Aa'),
      t('亲代1 AA', 'Parent 1 AA'),
      t('亲代1 aa', 'Parent 1 aa'),
    ],
  };
  const second =
    id === 'L065'
      ? [t('种群视角', 'Population'), t('群落视角', 'Community')]
      : id === 'L069'
        ? [t('暴露', 'Exposed'), t('遮护', 'Sheltered')]
        : id === 'L072'
          ? [
              t('亲代2 Aa', 'Parent 2 Aa'),
              t('亲代2 AA', 'Parent 2 AA'),
              t('亲代2 aa', 'Parent 2 aa'),
            ]
          : null;
  return (
    <>
      <Choices
        mode={mode}
        label={t('比较条件', 'Comparison conditions')}
        items={controls[id]!}
        value={option}
        choose={(n) => change(n)}
      />
      {second && (
        <Choices
          mode={mode}
          label={t('第二项条件', 'Second condition')}
          items={second}
          value={option2}
          choose={(n) => change(n, true)}
        />
      )}
      <Art
        id={id}
        mode={mode}
        option={option}
        option2={option2}
        frame={flow.frame}
      />
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={captions[id]![flow.frame]!} />
      </p>
      {id === 'L065' && (
        <p>
          <Text
            mode={mode}
            text={t(
              `核对最终账目：20 + 5 − 3 + ${option ? 6 : 2} − 4 = ${populationBalance(20, 5, 3, option ? 6 : 2, 4)}`,
              `Final account: 20 + 5 − 3 + ${option ? 6 : 2} − 4 = ${populationBalance(20, 5, 3, option ? 6 : 2, 4)}`,
            )}
          />
        </p>
      )}
      {id === 'L068' && <DataEvidence mode={mode} frame={flow.frame} />}
      {id === 'L072' &&
        flow.frame >= 2 &&
        (() => {
          const first = (['Aa', 'AA', 'aa'] as const)[option]!,
            second = (['Aa', 'AA', 'aa'] as const)[option2]!,
            possibilities = offspringPossibilities(first, second),
            selected = possibilities[route]!;
          return (
            <>
              <Choices
                mode={mode}
                label={t('追踪一条组合路线', 'Trace one combination route')}
                items={possibilities.map((p, i) =>
                  t(
                    `路线${i + 1}: ${p.first} + ${p.second}`,
                    `Route ${i + 1}: ${p.first} + ${p.second}`,
                  ),
                )}
                value={route}
                choose={(n) => {
                  setRoute(n);
                  onExplore();
                }}
              />
              <p aria-live="polite">
                <Text
                  mode={mode}
                  text={t(
                    `路线${route + 1}：亲代1提供${selected.first}，亲代2提供${selected.second}，组合${selected.genotype}。${possibilities.filter((p) => p.genotype === selected.genotype).length}/4条等可能路线具有这个组合；不是四个子代的顺序。`,
                    `Route ${route + 1}: parent 1 contributes ${selected.first}; parent 2 contributes ${selected.second}; the combination is ${selected.genotype}. ${possibilities.filter((p) => p.genotype === selected.genotype).length}/4 equally likely routes yield this genotype, not a birth order.`,
                  )}
                />
              </p>
            </>
          );
        })()}
      <Notes mode={mode} text={staticNotes[id]!} />
    </>
  );
}
function DataEvidence({ mode, frame }: { mode: LanguageMode; frame: number }) {
  const [claim, setClaim] = useState(0);
  return (
    <>
      <Choices
        mode={mode}
        label={t('检查结论强度', 'Check claim strength')}
        items={[
          t('支持关联', 'Supports association'),
          t('证明唯一原因', 'Proves a sole cause'),
        ]}
        value={claim}
        choose={setClaim}
      />
      <p role="status">
        <Text
          mode={mode}
          text={
            claim
              ? t(
                  '超出证据：没有控制雨量、温度、季节或探测。可提出机制，但需要进一步比较。',
                  'Beyond the evidence: rain, temperature, season and detection were not controlled. A mechanism needs further comparison.',
                )
              : t(
                  `已显示${frame + 1}次虚构访问。可描述共同变化；不把它写成已控制的因果试验。`,
                  `${frame + 1} invented visits are shown. Describe joint changes without calling this a controlled causal experiment.`,
                )
          }
        />
      </p>
    </>
  );
}
function SamplingLab({ id, mode, onExplore }: Props) {
  const [method, setMethod] = useState(0),
    [seed, setSeed] = useState(42),
    [size, setSize] = useState(0),
    [manual, setManual] = useState<string[]>([]),
    [census, setCensus] = useState(false),
    flow = useFrames(3, onExplore);
  const ids =
      method === 1
        ? pathSample
        : method === 2
          ? manual
          : randomQuadrats(seed, size ? 12 : 6),
    result = ids.length ? estimateMeadow(ids) : null;
  const chooseCell = (cell: string) => {
    setMethod(2);
    setManual((prev) =>
      prev.includes(cell) ? prev.filter((x) => x !== cell) : [...prev, cell],
    );
    flow.reset();
    onExplore();
  };
  return (
    <>
      <Choices
        mode={mode}
        label={t('抽样方法', 'Sampling method')}
        items={[
          t('随机选点', 'Random positions'),
          t('路边六格', 'Six roadside cells'),
          t('自己选点', 'Choose cells'),
        ]}
        value={method}
        choose={(n) => {
          setMethod(n);
          flow.reset();
          onExplore();
        }}
      />
      {method === 0 && (
        <>
          <Choices
            mode={mode}
            label={t('样本量', 'Sample size')}
            items={[t('6格', '6 quadrats'), t('12格', '12 quadrats')]}
            value={size}
            choose={(n) => {
              setSize(n);
              flow.reset();
              onExplore();
            }}
          />
          <button
            type="button"
            className="bio-button"
            style={{ minHeight: 44 }}
            onClick={() => {
              setSeed((s) => s + 1);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={t(
                `换一套位置（当前种子${seed}）`,
                `New positions (current seed ${seed})`,
              )}
            />
          </button>
        </>
      )}
      <Art
        id={id}
        mode={mode}
        frame={flow.frame}
        selected={ids}
        onCell={chooseCell}
      />
      <p className="bio-muted">
        <Text
          mode={mode}
          text={t(
            '点格子或Tab后按Enter可转为自选，重复点击取消；此时不能再称随机样本。',
            'Click a cell or press Enter after Tab to switch to manual selection; repeat to deselect. This is no longer a random sample.',
          )}
        />
      </p>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t(
              '样方文字按钮（图的替代）',
              'Quadrat text buttons (diagram alternative)',
            )}
          />
        </summary>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
            gap: 6,
          }}
        >
          {meadowGrid.map((q) => (
            <button
              type="button"
              key={q.id}
              aria-pressed={ids.includes(q.id)}
              onClick={() => chooseCell(q.id)}
              style={{ minHeight: 44, whiteSpace: 'normal' }}
            >
              {q.id}
              {flow.frame >= 1 ? `: ${q.count}` : ''}
            </button>
          ))}
        </div>
      </details>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={captions[id]![flow.frame]!} />
      </p>
      <p>
        <Text
          mode={mode}
          text={
            result
              ? t(
                  `位置：${ids.join('、')}；${ids.length}格，面积${result.sampledArea} m²${flow.frame >= 1 ? `；计数${result.count}` : ''}${flow.frame >= 2 ? `；密度${result.count}/${result.sampledArea}＝${result.density.toFixed(2)}株/m²` : ''}${flow.frame >= 3 ? `；估计${result.estimate.toFixed(1)}株` : ''}`,
                  `Positions: ${ids.join(', ')}; ${ids.length} cells, ${result.sampledArea} m²${flow.frame >= 1 ? `; count ${result.count}` : ''}${flow.frame >= 2 ? `; density ${result.count}/${result.sampledArea} = ${result.density.toFixed(2)} plants/m²` : ''}${flow.frame >= 3 ? `; estimate ${result.estimate.toFixed(1)} plants` : ''}`,
                )
              : t(
                  '先选至少一格；没有样本就不计算密度。',
                  'Select at least one cell; no density is calculated without a sample.',
                )
          }
        />
      </p>
      {flow.frame >= 1 && result && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {result.records.map((q) => (
            <span key={q.id}>
              {q.id}: {q.count}
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        className="bio-text-button"
        style={{ minHeight: 44 }}
        aria-expanded={census}
        onClick={() => setCensus(!census)}
      >
        <Text
          mode={mode}
          text={
            census
              ? t('收起普查', 'Hide census')
              : t(
                  '揭示教学普查，比较误差',
                  'Reveal teaching census and compare error',
                )
          }
        />
      </button>
      {census && (
        <p>
          <Text
            mode={mode}
            text={t(
              `普查${meadowCensus}株 / ${meadowArea} m²。${result ? `本样本估计与普查相差${(result.estimate - meadowCensus).toFixed(1)}株。` : ''}这是真实总数已知的教学图，不是实际野外调查。`,
              `Census: ${meadowCensus} plants / ${meadowArea} m². ${result ? `This estimate differs by ${(result.estimate - meadowCensus).toFixed(1)} plants.` : ''} This teaching grid has a known total; it is not field data.`,
            )}
          />
        </p>
      )}
      <Notes mode={mode} text={staticNotes[id]!} />
    </>
  );
}
export function PopulationExplore(props: Props) {
  return (
    <div className="bio-diversity-lab bio-s3-lab">
      {props.id === 'L067' ? (
        <SamplingLab {...props} />
      ) : (
        <StandardLab key={props.id} {...props} />
      )}
    </div>
  );
}
export function PopulationHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return (
    <Art
      id={id}
      mode={mode}
      frame={id === 'L065' ? 0 : 3}
      selected={id === 'L067' ? randomQuadrats(42) : []}
    />
  );
}
export function PopulationDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0);
  return (
    <figure className="bio-diversity-diagram">
      <PopulationHookArt id={id} mode={mode} />
      <Choices
        mode={mode}
        label={t('图中线索', 'Diagram clues')}
        items={[
          t('看结构', 'Structure'),
          t('找机制', 'Mechanism'),
          t('查边界', 'Limits'),
        ]}
        value={clue}
        choose={setClue}
      />
      <figcaption aria-live="polite">
        <Text
          mode={mode}
          text={
            clue === 0
              ? labels[id]!
              : clue === 1
                ? captions[id]![Math.min(2, captions[id]!.length - 1)]!
                : staticNotes[id]!
          }
        />
      </figcaption>
    </figure>
  );
}
