import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  anticodon,
  carbonBudget,
  codingDna,
  coupling,
  expression,
  feedbackFlux,
  replication,
  respiration,
  teachingRna,
  templateDna,
  translate,
} from './molecularEnergyModel';
import './molecularEnergy.css';

type Props = { id: string; mode: LanguageMode };
const blue = '#326d91',
  gold = '#a56b1d',
  green = '#3b7855',
  red = '#a54d60';
const names: Record<string, LocalizedText> = {
  L121: t('复制：保留旧链，合成新链', 'Replication: retain old, build new'),
  L122: t('转录：读取模板，不搬走DNA', 'Transcription: read the template'),
  L123: t(
    '翻译：读密码子，装配氨基酸',
    'Translation: read codons, assemble amino acids',
  ),
  L124: t('表达：生成与降解共同决定数量', 'Expression: production and loss'),
  L125: t('偶联需要实际的共享过程', 'Coupling needs a physical mechanism'),
  L126: t('分开记碳、电子和ATP', 'Separate carbon, electrons and ATP'),
  L127: t('光反应供能，碳固定用能', 'Light reactions supply the carbon budget'),
  L128: t('末端产物反馈到特定酶', 'Product feeds back to a specific enzyme'),
};
function Label({
  x,
  y,
  text,
  mode,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
  anchor?: 'middle' | 'start';
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="#203a38" fontSize="16">
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="21" fontSize="14">
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Arrow({
  x,
  y,
  length = 60,
  reverse = false,
  color = blue,
}: {
  x: number;
  y: number;
  length?: number;
  reverse?: boolean;
  color?: string;
}) {
  const end = x + length;
  return (
    <g stroke={color} strokeWidth="3" fill="none">
      <path d={`M${x} ${y}H${end}`} />
      <path
        d={
          reverse
            ? `M${x + 9} ${y - 6}L${x} ${y}l9 6`
            : `M${end - 9} ${y - 6}L${end} ${y}l-9 6`
        }
      />
    </g>
  );
}
function Scene({ id, mode, children }: Props & { children: ReactNode }) {
  const title = names[id] ?? t('分子与能量', 'Molecules and energy');
  return (
    <svg
      viewBox="0 0 760 430"
      role="img"
      aria-label={mode === 'en' ? title.en : title.zh}
    >
      <title>
        {mode === 'en'
          ? title.en
          : mode === 'zh'
            ? title.zh
            : `${title.zh} / ${title.en}`}
      </title>
      <rect x="3" y="3" width="754" height="424" rx="20" fill="#f4f6ed" />
      <Label x={380} y={34} text={title} mode={mode} />
      {children}
    </svg>
  );
}
function ReplicationArt({
  mode,
  frame,
  rounds,
}: {
  mode: LanguageMode;
  frame: number;
  rounds: number;
}) {
  const r = replication(rounds);
  const forkX = 180 + frame * 71;
  return (
    <Scene id="L121" mode={mode}>
      <Label
        x={385}
        y={91}
        text={t('一个向右移动的复制叉 →', 'One fork moving right →')}
        mode={mode}
      />
      <path
        d={`M90 155H${forkX}L680 210M90 315H${forkX}L680 260`}
        stroke={blue}
        strokeWidth="6"
        fill="none"
      />
      <text x="35" y="160">
        3′
      </text>
      <text x="35" y="320">
        5′
      </text>
      <text x="690" y="210">
        5′
      </text>
      <text x="690" y="265">
        3′
      </text>
      <path d={`M110 183H${110 + frame * 78}`} stroke={gold} strokeWidth="7" />
      {frame > 0 && (
        <>
          <text x="95" y="209">
            5′
          </text>
          <text x={100 + frame * 78} y="209">
            3′
          </text>
          <Arrow
            x={125}
            y={228}
            length={Math.max(24, frame * 65)}
            color={gold}
          />
        </>
      )}
      {[0, 1, 2].map(
        (n) =>
          frame > n + 1 && (
            <g key={n}>
              <path
                d={`M${180 + n * 135} 286h-80`}
                stroke={gold}
                strokeWidth="7"
              />
              <text x={175 + n * 135} y="275">
                5′
              </text>
              <text x={95 + n * 135} y="275">
                3′
              </text>
              <Arrow
                x={105 + n * 135}
                y={252}
                length={65}
                reverse
                color={gold}
              />
            </g>
          ),
      )}
      <Label x={590} y={142} text={t('旧模板', 'Old templates')} mode={mode} />
      <Label
        x={620}
        y={322}
        text={t('新链5′→3′', 'New strands 5′→3′')}
        mode={mode}
      />
      <Label
        x={380}
        y={376}
        text={t(
          `${rounds}轮后：${r.molecules}个双链；原来旧链始终2条`,
          `After ${rounds} rounds: ${r.molecules} duplexes; 2 original strands`,
        )}
        mode={mode}
      />
    </Scene>
  );
}
function TranscriptionArt({
  mode,
  frame,
  variant,
}: {
  mode: LanguageMode;
  frame: number;
  variant: boolean;
}) {
  const coding = variant ? codingDna.replace('GCT', 'GCC') : codingDna;
  const template = variant ? templateDna.replace('CGA', 'CGG') : templateDna;
  const rna = variant ? teachingRna.replace('GCU', 'GCC') : teachingRna;
  return (
    <Scene id="L122" mode={mode}>
      <rect
        x="35"
        y="90"
        width="690"
        height="270"
        rx="32"
        fill="#e6eee6"
        stroke={green}
        strokeDasharray="8 5"
      />
      <Label
        x={165}
        y={118}
        text={t('细胞核（真核简化）', 'Nucleus (eukaryotic model)')}
        mode={mode}
      />
      <text x="100" y="195" fill={blue}>
        5′ {coding.match(/.{3}/g)?.join(' ')} 3′
      </text>
      <Label x={570} y={183} text={t('编码链', 'Coding strand')} mode={mode} />
      <text x="100" y="247" fill={blue}>
        3′ {template.match(/.{3}/g)?.join(' ')} 5′
      </text>
      <Label
        x={570}
        y={238}
        text={t('模板链', 'Template strand')}
        mode={mode}
      />
      <Arrow x={108} y={270} length={270} />
      <text x="100" y="324" fill={gold}>
        5′{' '}
        {rna
          .slice(0, frame * 3)
          .match(/.{1,3}/g)
          ?.join(' ')}{' '}
        {frame > 0 ? '3′' : ''}
      </text>
      <Label
        x={570}
        y={307}
        text={t('RNA含U，不含T', 'RNA uses U, not T')}
        mode={mode}
      />
      <Label
        x={380}
        y={390}
        text={t(
          'RNA加工 → 核输出；DNA仍是DNA',
          'RNA processing → export; DNA remains DNA',
        )}
        mode={mode}
      />
    </Scene>
  );
}
function TranslationArt({
  mode,
  frame,
  variant,
}: {
  mode: LanguageMode;
  frame: number;
  variant: boolean;
}) {
  const rna = variant ? teachingRna.replace('GCU', 'GCC') : teachingRna;
  const result = translate(rna);
  const current = Math.min(4, frame),
    codon = result.codons[current]!;
  return (
    <Scene id="L123" mode={mode}>
      <Label
        x={380}
        y={94}
        text={t(
          'mRNA读取方向5′→3′；当前框是一个密码子',
          'Read mRNA 5′→3′; the box marks one codon',
        )}
        mode={mode}
      />
      <path d="M70 183H690" stroke={blue} strokeWidth="4" />
      <text x="35" y="190">
        5′
      </text>
      <text x="700" y="190">
        3′
      </text>
      {result.codons.map((c, i) => (
        <g key={i}>
          <rect
            x={90 + i * 118}
            y="154"
            width="100"
            height="55"
            rx="12"
            fill={current === i ? '#f4d89d' : '#ffffff'}
            stroke={current === i ? gold : blue}
          />
          <text x={140 + i * 118} y="189" textAnchor="middle">
            {c}
          </text>
        </g>
      ))}
      <Label
        x={380}
        y={245}
        text={t(
          codon === 'UAA'
            ? '终止：释放因子识别；无氨基酸'
            : `tRNA反密码子3′-${anticodon(codon)}-5′`,
          codon === 'UAA'
            ? 'Stop: release factor; no amino acid'
            : `tRNA anticodon 3′-${anticodon(codon)}-5′`,
        )}
        mode={mode}
      />
      {result.aminoAcids.slice(0, Math.min(frame + 1, 4)).map((aa, i) => (
        <g key={i}>
          {i > 0 && (
            <path
              d={`M${150 + (i - 1) * 130} 325h130`}
              stroke={green}
              strokeWidth="5"
            />
          )}
          <circle
            cx={150 + i * 130}
            cy="325"
            r="35"
            fill="#dbe9d8"
            stroke={green}
          />
          <text x={150 + i * 130} y="331" textAnchor="middle">
            {aa}
          </text>
        </g>
      ))}
      <Label
        x={380}
        y={391}
        text={t(
          '氨基酸原料装配成链；mRNA没有变成蛋白质',
          'Amino acid building blocks form a chain; mRNA remains RNA',
        )}
        mode={mode}
      />
    </Scene>
  );
}
function ExpressionArt({
  mode,
  frame,
  transcription,
  translation,
}: {
  mode: LanguageMode;
  frame: number;
  transcription: number;
  translation: number;
}) {
  const rows = expression(transcription, translation);
  return (
    <Scene id="L124" mode={mode}>
      <Label
        x={160}
        y={105}
        text={t('RNA相对量', 'RNA relative amount')}
        mode={mode}
      />
      <Label
        x={525}
        y={105}
        text={t('蛋白相对量', 'Protein relative amount')}
        mode={mode}
      />
      {[0, 1].map((panel) => (
        <g key={panel}>
          <path
            d={`M${65 + panel * 365} 155v180h285`}
            stroke={blue}
            fill="none"
          />
          <text x={65 + panel * 365} y="355">
            0
          </text>
          <text x={315 + panel * 365} y="355">
            5 min
          </text>
          <text x={65 + panel * 365} y="145">
            16
          </text>
          <polyline
            points={rows
              .slice(0, frame + 1)
              .map(
                (row) =>
                  `${65 + panel * 365 + row.minute * 52},${335 - (panel ? row.protein : row.rna) * 11}`,
              )
              .join(' ')}
            fill="none"
            stroke={panel ? gold : green}
            strokeWidth="4"
          />
        </g>
      ))}
      <Label
        x={380}
        y={390}
        text={t(
          '相同DNA；不同转录、翻译或降解可改变产物',
          'Same DNA; synthesis and loss change product amounts',
        )}
        mode={mode}
      />
    </Scene>
  );
}
function CouplingArt({
  mode,
  work,
  hydrolysis,
  shared,
}: {
  mode: LanguageMode;
  work: number;
  hydrolysis: number;
  shared: boolean;
}) {
  const result = coupling(work, hydrolysis, shared);
  return (
    <Scene id="L125" mode={mode}>
      <rect
        x="55"
        y="105"
        width="280"
        height="135"
        rx="18"
        fill="#dce9e6"
        stroke={green}
      />
      <rect
        x="425"
        y="105"
        width="280"
        height="135"
        rx="18"
        fill="#fae7c2"
        stroke={gold}
      />
      <Label
        x={195}
        y={145}
        text={t('需能过程 A→B', 'Endergonic process A→B')}
        mode={mode}
      />
      <text x="195" y="211" textAnchor="middle">
        ΔG = +{work} kJ mol⁻¹
      </text>
      <Label
        x={565}
        y={145}
        text={t('ATP净水解', 'Net ATP hydrolysis')}
        mode={mode}
      />
      <text x="565" y="211" textAnchor="middle">
        ΔG = {hydrolysis} kJ mol⁻¹
      </text>
      <path
        d="M250 260Q380 335 510 260"
        fill="none"
        stroke={shared ? green : red}
        strokeWidth="5"
        strokeDasharray={shared ? undefined : '8 8'}
      />
      <Label
        x={380}
        y={315}
        text={
          shared
            ? t(
                '共享中间体A–P（抽象示意）',
                'Shared intermediate A–P (schematic)',
              )
            : t(
                '未连接：相加不能代替偶联机制',
                'Unconnected: adding values is not coupling',
              )
        }
        mode={mode}
      />
      <Label
        x={380}
        y={385}
        text={t(
          `总ΔG=${result.total} kJ mol⁻¹；${result.canDrive ? '满足本例驱动条件' : '不满足本例驱动条件'}`,
          `Total ΔG=${result.total} kJ mol⁻¹; ${result.canDrive ? 'driving conditions met' : 'driving conditions not met'}`,
        )}
        mode={mode}
      />
    </Scene>
  );
}
function RespirationArt({
  mode,
  frame,
  oxygen,
}: {
  mode: LanguageMode;
  frame: number;
  oxygen: boolean;
}) {
  const r = respiration(oxygen);
  return (
    <Scene id="L126" mode={mode}>
      <rect
        x="30"
        y="99"
        width="210"
        height="220"
        rx="20"
        fill="#e4eee5"
        stroke={green}
      />
      <rect
        x="265"
        y="99"
        width="455"
        height="220"
        rx="30"
        fill="#f7ecd8"
        stroke={gold}
      />
      <Label x={135} y={130} text={t('细胞质', 'Cytosol')} mode={mode} />
      <Label
        x={405}
        y={130}
        text={t('线粒体基质', 'Mitochondrial matrix')}
        mode={mode}
      />
      <Label x={620} y={130} text={t('内膜', 'Inner membrane')} mode={mode} />
      <text x="135" y="202" textAnchor="middle">
        6C → 2 × 3C
      </text>
      <text x="135" y="239" textAnchor="middle">
        +2 ATP
      </text>
      {frame >= 1 && oxygen && (
        <>
          <Arrow x={216} y={215} length={63} />
          <text x="395" y="202" textAnchor="middle">
            2 CO₂ + 4 CO₂
          </text>
          <text x="395" y="239" textAnchor="middle">
            +2 ATP
          </text>
        </>
      )}
      {frame >= 2 && oxygen && (
        <>
          <Arrow x={485} y={215} length={65} />
          <text x="620" y="202" textAnchor="middle">
            12 e⁻ pairs
          </text>
          <text x="620" y="239" textAnchor="middle">
            O₂ → H₂O
          </text>
        </>
      )}
      {frame >= 3 && oxygen && (
        <text x="620" y="282" textAnchor="middle">
          H⁺ → ≈26 ATP
        </text>
      )}
      {!oxygen && (
        <Label
          x={380}
          y={280}
          text={t(
            '乳酸发酵：2×3C；再生NAD⁺',
            'Lactate fermentation: 2×3C; regenerate NAD⁺',
          )}
          mode={mode}
        />
      )}
      <Label
        x={380}
        y={365}
        text={t(
          `每葡萄糖：${r.co2} CO₂；净ATP约${r.totalAtp}（教学假设）`,
          `Per glucose: ${r.co2} CO₂; net ATP ≈${r.totalAtp} (model)`,
        )}
        mode={mode}
      />
      <Label
        x={380}
        y={402}
        text={t(
          '氧接受电子；糖的碳进入CO₂或乳酸',
          'Oxygen accepts electrons; sugar carbon enters CO₂ or lactate',
        )}
        mode={mode}
      />
    </Scene>
  );
}
function PhotoArt({
  mode,
  co2,
  atp,
  nadph,
}: {
  mode: LanguageMode;
  co2: number;
  atp: number;
  nadph: number;
}) {
  const b = carbonBudget(co2, atp, nadph);
  return (
    <Scene id="L127" mode={mode}>
      <rect
        x="35"
        y="100"
        width="690"
        height="230"
        rx="45"
        fill="#e6efdc"
        stroke={green}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="75"
          y={145 + i * 40}
          width="170"
          height="27"
          rx="12"
          fill="#92b98c"
          stroke={green}
        />
      ))}
      <Label
        x={160}
        y={121}
        text={t('类囊体膜', 'Thylakoid membrane')}
        mode={mode}
      />
      <Label
        x={160}
        y={292}
        text={t('光＋水 → O₂', 'Light + water → O₂')}
        mode={mode}
      />
      <Arrow x={260} y={193} length={105} />
      <Label x={400} y={148} text={t(`${atp} ATP`, `${atp} ATP`)} mode={mode} />
      <Label
        x={400}
        y={230}
        text={t(`${nadph} NADPH`, `${nadph} NADPH`)}
        mode={mode}
      />
      <circle
        cx="590"
        cy="212"
        r="68"
        fill="#f7e6bc"
        stroke={gold}
        strokeWidth="4"
      />
      <Label
        x={590}
        y={188}
        text={t('Calvin循环', 'Calvin cycle')}
        mode={mode}
      />
      <text x="590" y="244" textAnchor="middle">
        {co2} CO₂
      </text>
      <Label x={590} y={301} text={t('基质', 'Stroma')} mode={mode} />
      <Label
        x={380}
        y={350}
        text={t(
          `预算支持净G3P ${b.g3p.toFixed(2)} μmol`,
          `Budget supports ${b.g3p.toFixed(2)} μmol net G3P`,
        )}
        mode={mode}
      />
      <Label
        x={380}
        y={400}
        text={t(
          '3 CO₂ + 9 ATP + 6 NADPH → 1净G3P（预算）',
          '3 CO₂ + 9 ATP + 6 NADPH → 1 net G3P (budget)',
        )}
        mode={mode}
      />
    </Scene>
  );
}
function FeedbackArt({
  mode,
  substrate,
  product,
  sensitive,
}: {
  mode: LanguageMode;
  substrate: number;
  product: number;
  sensitive: boolean;
}) {
  const flux = feedbackFlux(substrate, product, sensitive);
  return (
    <Scene id="L128" mode={mode}>
      {[
        t('底物S', 'Substrate S'),
        t('中间物', 'Intermediate'),
        t('产物P', 'Product P'),
      ].map((text, i) => (
        <g key={i}>
          <rect
            x={55 + i * 245}
            y="190"
            width="155"
            height="80"
            rx="18"
            fill="#e0ece1"
            stroke={green}
          />
          <Label x={132 + i * 245} y={221} text={text} mode={mode} />
          {i < 2 && <Arrow x={215 + i * 245} y={230} length={80} />}
        </g>
      ))}
      <rect
        x="218"
        y="155"
        width="75"
        height="42"
        rx="10"
        fill="#f5dfb5"
        stroke={gold}
      />
      <text x="255" y="182" textAnchor="middle">
        E₁
      </text>
      {sensitive ? (
        <g data-feedback="active">
          <path
            d="M622 175V135H255V150"
            stroke={red}
            fill="none"
            strokeWidth="4"
          />
          <path d="M240 150h30" stroke={red} strokeWidth="5" />
        </g>
      ) : (
        <g data-feedback="inactive">
          <path
            d="M622 175V135H360"
            stroke={blue}
            fill="none"
            strokeWidth="4"
            strokeDasharray="7 5"
          />
          <Label
            x={475}
            y={160}
            text={t('未连接E₁：无抑制作用', 'No E₁ connection: no inhibition')}
            mode={mode}
          />
        </g>
      )}
      <Label
        x={470}
        y={94}
        text={
          sensitive
            ? t('特异性反馈抑制', 'Specific feedback inhibition')
            : t('对P不敏感的对照酶', 'Control enzyme insensitive to P')
        }
        mode={mode}
      />
      <Label
        x={380}
        y={315}
        text={t(
          `S=${substrate}，P=${product} μmol L⁻¹；通量=${flux.toFixed(2)} μmol min⁻¹`,
          `S=${substrate}, P=${product} μmol L⁻¹; flux=${flux.toFixed(2)} μmol min⁻¹`,
        )}
        mode={mode}
      />
      <Label
        x={380}
        y={386}
        text={t(
          '改变现有酶活性；未改变本模型的酶数量',
          'Change existing enzyme activity; enzyme amount held fixed',
        )}
        mode={mode}
      />
    </Scene>
  );
}
const records: Record<string, LocalizedText[]> = {
  L121: [
    t(
      '帧1：旧双链局部解开；蓝线为模板。',
      'Frame 1: local unwinding exposes the blue templates.',
    ),
    t(
      '帧2：上方领导链向复制叉5′→3′延伸。',
      'Frame 2: the upper leading strand extends 5′→3′ toward this fork.',
    ),
    t(
      '帧3–4：下方后随链片段都5′→3′，方向远离叉，随后连接。',
      'Frames 3–4: lower lagging fragments grow 5′→3′ away from the fork and are later joined.',
    ),
    t(
      '帧5–6：继续推进；完成后每个双链含一条旧链和一条新链。轮数计算是另一个完整复制账本，不等同于动画帧。',
      'Frames 5–6: synthesis advances; each completed duplex has one old and one new strand. The rounds calculator is a separate completed-replication ledger, not animation time.',
    ),
  ],
  L122: [
    t(
      '帧1：区分上方编码链5′→3′与下方模板3′→5′。',
      'Frame 1: distinguish upper coding 5′→3′ from lower template 3′→5′.',
    ),
    t(
      '帧2–6：按模板依次合成AUG、GCU/GCC、UUU、GGA、UAA；新RNA始终5′→3′，不是DNA变身。',
      'Frames 2–6: synthesize AUG, GCU/GCC, UUU, GGA and UAA along the template. RNA grows 5′→3′; DNA is not transformed.',
    ),
    t(
      '随后真核RNA加工并输出；本片段只显示连续编码区域，不模拟内含子、帽和尾。',
      'Eukaryotic processing and export follow; this continuous coding-region fragment omits introns, caps and tails.',
    ),
  ],
  L123: [
    t(
      '帧1：AUG设定本例起始阅读框并编码Met。',
      'Frame 1: AUG establishes the reading frame here and encodes Met.',
    ),
    t(
      '帧2：GCU或GCC都加入Ala；反密码子标成3′→5′以显示反平行。',
      'Frame 2: GCU or GCC adds Ala; anticodons are shown 3′→5′ to display antiparallel pairing.',
    ),
    t(
      '帧3：UUU加入Phe；帧4：GGA加入Gly。',
      'Frame 3: UUU adds Phe; frame 4: GGA adds Gly.',
    ),
    t(
      '帧5：UAA终止，不加氨基酸；释放因子释放四残基教学短链。',
      'Frame 5: UAA terminates with no amino acid; a release factor releases the four-residue teaching chain.',
    ),
  ],
  L124: [
    t(
      '帧1为0 min：RNA=0，蛋白=0。每步代表虚构1 min。',
      'Frame 1 is 0 min: RNA=0, protein=0; each step represents an invented minute.',
    ),
    t(
      '随后每步：R下一步=0.5R＋转录输入；P下一步=0.75P＋翻译系数×旧R。',
      'Each following step: next R=0.5R+transcription input; next P=0.75P+translation coefficient×previous R.',
    ),
    t(
      '表格保留0–5 min全部数值。蛋白变化落后于RNA；两条纵轴同为相对量，却不是相同分子计数标尺。',
      'The table retains all 0–5 min values. Protein lags RNA; both scales are relative, not interchangeable molecule counts.',
    ),
  ],
  L125: [
    t(
      '先固定条件并记录两个ΔG，再判断有无共享中间体；只有总ΔG<0且实际偶联时，才满足本例驱动条件。',
      'Fix conditions and record both ΔG values; then check a shared intermediate. This model requires a negative total and physical coupling.',
    ),
    t(
      'A–P表示抽象磷酸化中间体，不是所有ATP偶联都靠同一种中间体。断键需能；整个水解反应净自由能下降。',
      'A–P denotes an abstract phosphorylated intermediate, not every coupling mechanism. Breaking a bond costs energy; the whole hydrolysis reaction lowers free energy.',
    ),
  ],
  L126: [
    t(
      '帧1：细胞质糖酵解，6C→2×3C，净2 ATP和2 NADH。',
      'Frame 1: cytosolic glycolysis, 6C→2×3C, net 2 ATP and 2 NADH.',
    ),
    t(
      '帧2：有氧模式中，丙酮酸氧化在基质放2 CO₂；循环再放4 CO₂，得2 ATP并装载电子。',
      'Frame 2: aerobic matrix pyruvate oxidation releases 2 CO₂; the cycle releases 4 more and makes 2 ATP while loading carriers.',
    ),
    t(
      '帧3：合计10 NADH＋2 FADH₂携12对电子到内膜，O₂接受电子形成水。',
      'Frame 3: 10 NADH+2 FADH₂ carry 12 electron pairs to the inner membrane; O₂ accepts electrons to form water.',
    ),
    t(
      '帧4：质子梯度驱动ATP合酶，本例氧化磷酸化约26 ATP，总约30，真实产量可变。',
      'Frame 4: the proton gradient drives ATP synthase: ≈26 oxidative ATP, ≈30 total here; actual yields vary.',
    ),
    t(
      '无氧模式改为乳酸发酵：糖碳仍在两乳酸中，NAD⁺再生使糖酵解继续；不能把这说成无氧运行同一呼吸链。',
      'Oxygen-off selects lactate fermentation: carbon remains in two lactates, NAD⁺ regeneration sustains glycolysis; the same respiratory chain does not run without oxygen in this model.',
    ),
  ],
  L127: [
    t(
      '类囊体膜光反应利用光和水，释放来自水的O₂，供应ATP和NADPH。',
      'Thylakoid light reactions use light and water, release water-derived O₂ and supply ATP/NADPH.',
    ),
    t(
      '基质Calvin循环固定CO₂；每净1 μmol G3P预算需3 μmol CO₂、9 μmol ATP、6 μmol NADPH，受最少资源限制。',
      'Stromal Calvin cycling fixes CO₂: each net μmol G3P costs 3 μmol CO₂, 9 μmol ATP and 6 μmol NADPH; the smallest resource budget limits output.',
    ),
    t(
      '这是一份有限资源预算，不是时间动画或叶片速率；ATP、NADPH再生以及RuBP循环细节未模拟。',
      'This finite resource budget is not a time animation or leaf-rate prediction; ATP/NADPH resupply and detailed RuBP recycling are omitted.',
    ),
  ],
  L128: [
    t(
      '固定底物时提高P：只在敏感酶模型下降低通量。去掉P可恢复，未假定酶被破坏。',
      'At fixed substrate, raising P reduces flux only with the sensitive enzyme. Removing P restores activity; destruction is not assumed.',
    ),
    t(
      'v=12S/(2+S)/(1+P/4)，敏感时采用末项；不敏感对照省略末项。',
      'v=12S/(2+S)/(1+P/4) for the sensitive enzyme; the insensitive control omits the final term.',
    ),
    t(
      '这是现有酶活性的示例；表达调控可改变酶数量。本模型固定酶量、温度和pH，不代表所有抑制机制。',
      'This illustrates activity regulation; expression regulation can change enzyme amount. Enzyme amount, temperature and pH are fixed; not all inhibition mechanisms are represented.',
    ),
  ],
};
function Art({
  id,
  mode,
  frame = 5,
  a,
  b,
  flag = false,
}: Props & { frame?: number; a?: number; b?: number; flag?: boolean }) {
  switch (id) {
    case 'L121':
      return <ReplicationArt mode={mode} frame={frame} rounds={a ?? 1} />;
    case 'L122':
      return <TranscriptionArt mode={mode} frame={frame} variant={flag} />;
    case 'L123':
      return <TranslationArt mode={mode} frame={frame} variant={flag} />;
    case 'L124':
      return (
        <ExpressionArt
          mode={mode}
          frame={frame}
          transcription={a ?? 2}
          translation={b ?? 0.5}
        />
      );
    case 'L125':
      return (
        <CouplingArt
          mode={mode}
          work={a ?? 20}
          hydrolysis={b ?? -30}
          shared={flag}
        />
      );
    case 'L126':
      return <RespirationArt mode={mode} frame={frame} oxygen={flag} />;
    case 'L127':
      return <PhotoArt mode={mode} co2={6} atp={a ?? 18} nadph={b ?? 12} />;
    default:
      return (
        <FeedbackArt
          mode={mode}
          substrate={a ?? 6}
          product={b ?? 0}
          sensitive={!flag}
        />
      );
  }
}
function Figure({ id, mode, children }: Props & { children: ReactNode }) {
  return (
    <>
      <p className="me-scroll-hint">
        <Text
          mode={mode}
          text={t(
            '宽图：聚焦图框后可左右滚动或用方向键；图下保留完整文字记录。',
            'Wide diagram: focus the region and scroll horizontally or use arrow keys; a complete text record follows.',
          )}
        />
      </p>
      <div
        className="me-figure"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? `${id} scrollable science diagram`
            : `${id}可横向滚动科学图`
        }
      >
        {children}
      </div>
    </>
  );
}
export function MolecularEnergyDiagram(props: Props) {
  return (
    <div className="bio-s6-lab me-lab">
      <Figure {...props}>
        <Art {...props} flag={props.id === 'L125' || props.id === 'L126'} />
      </Figure>
      <ol className="me-record">
        {records[props.id]?.map((text, i) => (
          <li key={i}>
            <Text mode={props.mode} text={text} />
          </li>
        ))}
      </ol>
    </div>
  );
}
export function MolecularEnergyHookArt(props: Props) {
  return <MolecularEnergyDiagram {...props} />;
}
export function MolecularEnergyExplore({
  id,
  mode,
  onExplore,
}: Props & { onExplore: () => void }) {
  const [a, setA] = useState(
    id === 'L124'
      ? 2
      : id === 'L125'
        ? 20
        : id === 'L127'
          ? 18
          : id === 'L128'
            ? 6
            : 1,
  );
  const [b, setB] = useState(
    id === 'L124' ? 0.5 : id === 'L125' ? -30 : id === 'L127' ? 12 : 0,
  );
  const [flag, setFlag] = useState(id === 'L125' || id === 'L126');
  const last = id === 'L126' ? 3 : id === 'L123' ? 4 : 5;
  const flow = useFrames(last, onExplore);
  const temporal = ['L121', 'L122', 'L123', 'L124', 'L126'].includes(id);
  const change = (setter: (value: number) => void, value: string) => {
    setter(Number(value));
    onExplore();
  };
  const toggle = () => {
    setFlag(!flag);
    onExplore();
  };
  const row = (
    label: LocalizedText,
    value: number,
    set: (v: number) => void,
    min: number,
    max: number,
    step = 1,
  ) => (
    <label className="me-control">
      <span>
        <Text mode={mode} text={label} /> <strong>{value}</strong>
      </span>
      <input
        aria-label={mode === 'en' ? label.en : label.zh}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(set, e.target.value)}
      />
    </label>
  );
  return (
    <div className="bio-s6-lab me-lab">
      <div className="me-controls">
        {id === 'L121' &&
          row(
            t('完整复制轮数（非动画帧）', 'Completed rounds (separate ledger)'),
            a,
            setA,
            1,
            4,
          )}
        {(id === 'L122' || id === 'L123') && (
          <button onClick={toggle}>
            <Text
              mode={mode}
              text={
                flag
                  ? t('当前GCC；切回GCU', 'GCC selected; switch to GCU')
                  : t('当前GCU；改为GCC', 'GCU selected; change to GCC')
              }
            />
          </button>
        )}
        {id === 'L124' && (
          <>
            {row(
              t(
                '转录输入／相对量 min⁻¹',
                'Transcription input / relative units min⁻¹',
              ),
              a,
              setA,
              0,
              4,
            )}
            {row(
              t('翻译系数／min⁻¹', 'Translation coefficient / min⁻¹'),
              b,
              setB,
              0,
              0.5,
              0.1,
            )}
          </>
        )}
        {id === 'L125' && (
          <>
            {row(
              t('需能过程ΔG／kJ mol⁻¹', 'Work ΔG / kJ mol⁻¹'),
              a,
              setA,
              5,
              40,
              5,
            )}
            {row(
              t(
                '条件下水解ΔG／kJ mol⁻¹',
                'Conditional hydrolysis ΔG / kJ mol⁻¹',
              ),
              b,
              setB,
              -50,
              -10,
              5,
            )}
            <button onClick={toggle}>
              <Text
                mode={mode}
                text={
                  flag
                    ? t(
                        '已共享中间体：点击断开',
                        'Shared intermediate: disconnect',
                      )
                    : t('未偶联：点击连接', 'Uncoupled: connect')
                }
              />
            </button>
          </>
        )}
        {id === 'L126' && (
          <button onClick={toggle}>
            <Text
              mode={mode}
              text={
                flag
                  ? t(
                      '有氧氧化：切换乳酸发酵',
                      'Aerobic oxidation: switch to lactate',
                    )
                  : t(
                      '乳酸发酵：切换有氧氧化',
                      'Lactate fermentation: switch to aerobic',
                    )
              }
            />
          </button>
        )}
        {id === 'L127' && (
          <>
            {row(t('可用ATP／μmol', 'Available ATP / μmol'), a, setA, 0, 36, 3)}
            {row(
              t('可用NADPH／μmol', 'Available NADPH / μmol'),
              b,
              setB,
              0,
              24,
              2,
            )}
            <p>
              <Text
                mode={mode}
                text={t(
                  'CO₂固定为6 μmol；这是有限预算，不是速率。',
                  'CO₂ fixed at 6 μmol; a finite budget, not a rate.',
                )}
              />
            </p>
          </>
        )}
        {id === 'L128' && (
          <>
            {row(
              t('底物S／μmol L⁻¹', 'Substrate S / μmol L⁻¹'),
              a,
              setA,
              0,
              12,
            )}
            {row(t('产物P／μmol L⁻¹', 'Product P / μmol L⁻¹'), b, setB, 0, 16)}
            <button onClick={toggle}>
              <Text
                mode={mode}
                text={
                  flag
                    ? t(
                        '不敏感对照：切为敏感酶',
                        'Insensitive control: select sensitive enzyme',
                      )
                    : t(
                        '敏感酶：切为不敏感对照',
                        'Sensitive enzyme: select insensitive control',
                      )
                }
              />
            </button>
          </>
        )}
      </div>
      {temporal && <Playback flow={flow} mode={mode} />}
      <Figure id={id} mode={mode}>
        <Art
          id={id}
          mode={mode}
          frame={temporal ? flow.frame : 5}
          a={a}
          b={b}
          flag={flag}
        />
      </Figure>
      {id === 'L121' && (
        <p>
          <Text
            mode={mode}
            text={t(
              `完成${a}轮：${replication(a).molecules}个双链，${replication(a).newStrands}条新链，2条原始旧链。`,
              `After ${a} rounds: ${replication(a).molecules} duplexes, ${replication(a).newStrands} new strands, 2 original strands.`,
            )}
          />
        </p>
      )}
      {id === 'L124' && (
        <div
          className="me-table"
          role="region"
          tabIndex={0}
          aria-label={
            mode === 'en' ? 'All expression model values' : '全部表达模型数值'
          }
        >
          <table>
            <thead>
              <tr>
                <th>min</th>
                <th>
                  <Text
                    mode={mode}
                    text={t('RNA相对量', 'RNA relative amount')}
                  />
                </th>
                <th>
                  <Text
                    mode={mode}
                    text={t('蛋白相对量', 'Protein relative amount')}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {expression(a, b).map((r) => (
                <tr key={r.minute}>
                  <td>{r.minute}</td>
                  <td>{r.rna.toFixed(3)}</td>
                  <td>{r.protein.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ol className="me-record">
        {records[id]?.map((text, i) => (
          <li key={i}>
            <Text mode={mode} text={text} />
          </li>
        ))}
      </ol>
      <p className="me-limits">
        <Text
          mode={mode}
          text={t(
            '原创教学图与虚构数据，非实测、非按比例；参数固定时才可公平比较。模型省略的机制不能由图中数值推断。',
            'Original teaching figures and invented data, not measurements or scale drawings. Compare with other parameters fixed; omitted mechanisms cannot be inferred from these values.',
          )}
        />
      </p>
    </div>
  );
}
