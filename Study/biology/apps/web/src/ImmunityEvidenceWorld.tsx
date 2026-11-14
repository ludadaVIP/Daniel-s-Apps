import { useId, useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  immuneRoutes,
  memoryCurve,
  resistanceFrames,
  resistantFraction,
  riskComparison,
  summary,
  seedlingData,
  biologicalReplicates,
  assessHypothesis,
  blockData,
} from './immunityEvidenceModel';
import './immunityEvidence.css';

type ArtProps = { id: string; mode: LanguageMode };
type ExploreProps = ArtProps & { onExplore: () => void };
const title: Record<string, LocalizedText> = {
  L113: t('防御路线协作图', 'Cooperating defence routes'),
  L114: t('相同抗原的两次反应', 'Two responses to a matched antigen'),
  L115: t('先选择，再繁殖', 'Selection, then reproduction'),
  L116: t('先检查分母', 'Inspect the denominator first'),
  L117: t('把问题变成可检验比较', 'Make a question testable'),
  L118: t('位置分块与独立样本', 'Position blocks and independent units'),
  L119: t('原始点、均值和最小最大', 'Raw points, means and min–max'),
  L120: t('数据能承受的结论', 'A conclusion the data can support'),
};
const pick = (mode: LanguageMode, z: string, e: string) =>
  mode === 'en' ? e : z;
function Label({
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
      className={small ? 'ie-svg-small' : 'ie-svg-label'}
    >
      {mode !== 'en' && <tspan x={x}>{text.zh}</tspan>}
      {mode !== 'zh' && (
        <tspan x={x} dy={mode === 'bilingual' ? 19 : 0}>
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Box({
  x,
  y,
  w = 168,
  text,
  mode,
  tint = false,
}: {
  x: number;
  y: number;
  w?: number;
  text: LocalizedText;
  mode: LanguageMode;
  tint?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="62"
        rx="12"
        fill={tint ? '#e6efdc' : '#e8f1f3'}
        stroke="#3c6d74"
      />
      <Label x={x + w / 2} y={y + 25} text={text} mode={mode} />
    </g>
  );
}
function Art({
  id,
  mode,
  frame = 5,
  option = 0,
  alternate = false,
}: ArtProps & { frame?: number; option?: number; alternate?: boolean }) {
  const uid = useId();
  const arrow = `${uid}-arrow`;
  const P = (x: number, y: number, z: string, e: string, small = false) => (
    <Label x={x} y={y} text={t(z, e)} mode={mode} small={small} />
  );
  let body;
  if (id === 'L113')
    body = (
      <>
        <Box
          x={226}
          y={18}
          text={t('病原体接触', 'Pathogen encounter')}
          mode={mode}
        />
        <path
          d="M310 80 L310 105 L112 105 L112 132 M310 105 L510 105 L510 132"
          markerEnd={`url(#${arrow})`}
        />
        <Box
          x={28}
          y={135}
          text={t('屏障 / 60条', 'Barrier / 60 records')}
          mode={mode}
        />
        <Box
          x={406}
          y={135}
          w={200}
          text={t('共有模式识别', 'Shared-pattern sensing')}
          mode={mode}
        />
        <path
          d="M506 200 L506 225 L310 225 L310 252"
          markerEnd={`url(#${arrow})`}
        />
        <circle cx="112" cy="272" r="43" fill="#e6efdc" stroke="#3c6d74" />
        <circle cx="112" cy="261" r="8" fill="#ba903c" />
        <path d="M80 244 Q112 226 144 244" />
        {P(112, 335, '吞噬 / 25条', 'Engulfment / 25')}
        <path
          d="M112 200 L112 226 M159 272 L221 272"
          markerEnd={`url(#${arrow})`}
        />
        <Box
          x={226}
          y={254}
          text={t('B/T 特异克隆', 'Specific B/T clones')}
          mode={mode}
          tint
        />
        <path
          d="M310 317 L310 350 L205 350 L205 384 M310 350 L477 350 L477 384"
          markerEnd={`url(#${arrow})`}
        />
        <Box
          x={110}
          y={386}
          w={190}
          text={t('B→浆细胞→抗体', 'B → plasma → antibody')}
          mode={mode}
        />
        <Box
          x={355}
          y={386}
          w={244}
          text={t('T→协调/感染细胞杀伤', 'T → help / infected-cell killing')}
          mode={mode}
        />
        {P(
          310,
          480,
          '特异B克隆观察15条；不是防御贡献率',
          '15 B-clone records; not shares of protection',
          true,
        )}
      </>
    );
  else if (id === 'L114') {
    const repeat = alternate ? memoryCurve.first : memoryCurve.repeat;
    body = (
      <>
        <path d="M65 65 L65 360 L565 360" />
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <text x="52" y={360 - v * 13} textAnchor="end">
              {v}
            </text>
            <path d={`M65 ${360 - v * 13} H565`} className="ie-gridline" />
          </g>
        ))}
        {P(315, 30, '抗体指数 / 任意单位', 'Antibody index / arbitrary units')}
        {[memoryCurve.first, repeat].map((s, i) => (
          <g key={i}>
            <polyline
              points={s
                .slice(0, frame + 1)
                .map((v, j) => `${75 + j * 94},${360 - v * 13}`)
                .join(' ')}
              fill="none"
              stroke={i ? '#a36f20' : '#277d88'}
              strokeWidth="4"
              strokeDasharray={i ? '9 5' : undefined}
            />
            {s.slice(0, frame + 1).map((v, j) => (
              <circle
                key={j}
                cx={75 + j * 94}
                cy={360 - v * 13}
                r={i ? 5 : 7}
                fill={i ? '#a36f20' : '#277d88'}
              />
            ))}
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <text x={75 + v * 94} y="386" textAnchor="middle" key={v}>
            {v}
          </text>
        ))}
        {P(
          315,
          414,
          '暴露后模型时点 / 非真实天数',
          'Model time after exposure / not real days',
        )}
        <path d="M98 463 H145" stroke="#277d88" strokeWidth="4" />
        {P(215, 468, '首次', 'Primary')}
        <path
          d="M330 463 H370"
          stroke="#a36f20"
          strokeDasharray="9 5"
          strokeWidth="4"
        />
        {P(
          475,
          468,
          alternate ? '不匹配：按首次' : '相同抗原再次',
          alternate ? 'Mismatch: primary rule' : 'Matched secondary',
        )}
      </>
    );
  } else if (id === 'L115') {
    const states = resistanceFrames(alternate ? 0 : 2, option === 0);
    body = (
      <>
        {states.map((s, i) => (
          <g key={i} opacity={i <= frame ? 1 : 0.25}>
            <rect
              x={18 + i * 202}
              y="110"
              width="182"
              height="250"
              rx="12"
              fill="#f7f6ec"
              stroke="#4a7076"
            />
            {P(
              109 + i * 202,
              59,
              ['起点', '存活', '四倍后代'][i]!,
              ['Start', 'Survivors', '4× descendants'][i]!,
            )}
            <circle cx={78 + i * 202} cy="184" r="24" fill="#b8e0e6" />
            <text x={78 + i * 202} y="190" textAnchor="middle">
              S
            </text>
            <circle cx={142 + i * 202} cy="184" r="24" fill="#ecd08d" />
            <text x={142 + i * 202} y="190" textAnchor="middle">
              R
            </text>
            <text x={78 + i * 202} y="245" textAnchor="middle">
              {s.sensitive}
            </text>
            <text x={142 + i * 202} y="245" textAnchor="middle">
              {s.resistant}
            </text>
            <text x={109 + i * 202} y="304" textAnchor="middle">
              R:{' '}
              {resistantFraction(s) === null
                ? '—'
                : `${Math.round(resistantFraction(s)! * 100)}%`}
            </text>
          </g>
        ))}
        {P(
          310,
          420,
          '选择改变存活；繁殖增加后代',
          'Selection changes survival; reproduction adds descendants',
        )}
        {P(
          310,
          476,
          '无突变/转移；零分母比例未定义',
          'No mutation/transfer; zero denominator → undefined',
          true,
        )}
      </>
    );
  } else if (id === 'L116') {
    const n = option === 1 ? 50 : 200;
    const risk = riskComparison(10, n, 20, 200);
    body = (
      <>
        <Box
          x={35}
          y={30}
          w={245}
          text={t(
            `A: 10/${n} → ${risk.a * 100}%`,
            `A: 10/${n} → ${risk.a * 100}%`,
          )}
          mode={mode}
        />
        <Box
          x={338}
          y={30}
          w={245}
          text={t('B: 20/200 → 10%', 'B: 20/200 → 10%')}
          mode={mode}
        />
        {[risk.a, risk.b].map((v, i) => (
          <g key={i}>
            <rect
              x={106 + i * 300}
              y={300 - v * 800}
              width="100"
              height={v * 800}
              fill={i ? '#ecd08d' : '#98cbd2'}
            />
            <text x={156 + i * 300} y="325" textAnchor="middle">
              {i ? 'B' : 'A'}
            </text>
          </g>
        ))}
        <path d="M65 125 V300 H570" />
        {P(48, 118, '%', '%')}
        {[0, 5, 10, 15, 20].map((v) => (
          <text key={v} x="50" y={305 - v * 8} textAnchor="end">
            {v}
          </text>
        ))}
        {P(
          310,
          363,
          '同一期间 / 同一定义 / 每人一次',
          'Same period / same definition / one count per person',
        )}
        <Box
          x={58}
          y={414}
          w={225}
          text={t('睡眠 → 自选饮品', 'Sleep → drink choice')}
          mode={mode}
        />
        <Box
          x={337}
          y={414}
          w={225}
          text={t('睡眠 → 结局', 'Sleep → outcome')}
          mode={mode}
          tint
        />
      </>
    );
  } else if (id === 'L117')
    body = (
      <>
        <Box
          x={110}
          y={20}
          w={400}
          text={t('“更健康”如何测？', 'How is “healthier” measured?')}
          mode={mode}
        />
        <path d="M310 83 V118" markerEnd={`url(#${arrow})`} />
        <Box
          x={25}
          y={135}
          w={260}
          text={t('自变量：4 h / 8 h', 'Factor: 4 h / 8 h')}
          mode={mode}
        />
        <Box
          x={335}
          y={135}
          w={260}
          text={t('固定：水、土、温度', 'Match: water, soil, temperature')}
          mode={mode}
          tint
        />
        <path
          d="M155 200 L155 230 L310 230 V270 M465 200 L465 230 H310"
          markerEnd={`url(#${arrow})`}
        />
        <Box
          x={100}
          y={275}
          w={420}
          text={t(
            '响应：7天株高增量 / cm',
            'Response: 7-day height increase / cm',
          )}
          mode={mode}
        />
        <Box
          x={100}
          y={397}
          w={420}
          text={t(
            '可能反驳：相等或反向的重复结果',
            'Challenge: repeated equal or reversed results',
          )}
          mode={mode}
          tint
        />
        <path d="M310 340 V388" markerEnd={`url(#${arrow})`} />
      </>
    );
  else if (id === 'L118')
    body = (
      <>
        {blockData.map((b, i) => (
          <g key={b.block}>
            <rect
              x="20"
              y={35 + i * 155}
              width="580"
              height="134"
              rx="12"
              fill={i ? '#f1ead9' : '#e7f1f2'}
              stroke="#4a7076"
            />
            {P(
              115,
              79 + i * 155,
              i ? '远窗块' : '近窗块',
              i ? 'Far block' : 'Near block',
            )}
            <Box
              x={235}
              y={68 + i * 155}
              w={155}
              text={t(`4 h → ${b.short} cm`, `4 h → ${b.short} cm`)}
              mode={mode}
            />
            <Box
              x={425}
              y={68 + i * 155}
              w={155}
              text={t(`8 h → ${b.long} cm`, `8 h → ${b.long} cm`)}
              mode={mode}
              tint
            />
          </g>
        ))}
        {P(
          310,
          380,
          '每块差3 cm；不是跨块13−8',
          'Each block: +3 cm; not cross-block 13−8',
        )}
        {P(
          310,
          445,
          '4株 × 3读数 = 12读数，生物n=4',
          '4 plants × 3 readings = 12 readings, biological n=4',
        )}
      </>
    );
  else if (id === 'L119') {
    const a = alternate ? [8, 9, 28, 9] : seedlingData.short;
    const series = [a, seedlingData.long];
    body = (
      <>
        <path d="M70 60 V380 H570" />
        {P(310, 30, '7天株高增量 / cm', '7-day height increase / cm')}
        {[0, 5, 10, 15, 20, 25, 30].map((v) => (
          <g key={v}>
            <text x="57" y={385 - v * 10} textAnchor="end">
              {v}
            </text>
            <path d={`M70 ${380 - v * 10} H570`} className="ie-gridline" />
          </g>
        ))}
        {series.map((s, i) => {
          const st = summary(s),
            x = 210 + i * 250;
          return (
            <g key={i}>
              <path
                d={`M${x} ${380 - st.min * 10} V${380 - st.max * 10} M${x - 22} ${380 - st.min * 10} H${x + 22} M${x - 22} ${380 - st.max * 10} H${x + 22}`}
                stroke="#a46f28"
                strokeWidth="3"
              />
              {s.map((v, j) => (
                <circle
                  key={j}
                  cx={x - 45 + j * 30}
                  cy={380 - v * 10}
                  r="7"
                  fill={i ? '#b8872d' : '#277d88'}
                />
              ))}
              <path
                d={`M${x - 50} ${380 - st.mean * 10} H${x + 50}`}
                stroke="#233f50"
                strokeWidth="4"
              />
              <text x={x} y="410" textAnchor="middle">
                {i ? '8 h' : '4 h'} / n=4
              </text>
            </g>
          );
        })}
        {P(
          310,
          455,
          '点=原始值；粗线=均值；竖线=min–max',
          'Dots=raw; thick line=mean; vertical=min–max',
          true,
        )}
      </>
    );
  } else
    body = (
      <>
        <Box
          x={65}
          y={20}
          w={490}
          text={t(
            '主张：本条件下较长光照与较大增量一致',
            'Claim: greater increase under longer light here',
          )}
          mode={mode}
        />
        <path d="M310 85 V117" markerEnd={`url(#${arrow})`} />
        <Box
          x={65}
          y={120}
          w={490}
          text={t(
            '证据：9 vs 12 cm；7天；n=4/组',
            'Evidence: 9 vs 12 cm; 7 days; n=4/group',
          )}
          mode={mode}
          tint
        />
        <path d="M310 185 V217" markerEnd={`url(#${arrow})`} />
        <Box
          x={65}
          y={220}
          w={490}
          text={t(
            '机制：光合作用机会；未直接测糖',
            'Mechanism: photosynthetic opportunity; sugar unmeasured',
          )}
          mode={mode}
        />
        <path d="M310 285 V317" markerEnd={`url(#${arrow})`} />
        <Box
          x={65}
          y={320}
          w={490}
          text={t(
            '局限：一种、一批、7天',
            'Limits: one variety, one batch, 7 days',
          )}
          mode={mode}
          tint
        />
        <path d="M310 385 V417" markerEnd={`url(#${arrow})`} />
        <Box
          x={65}
          y={420}
          w={490}
          text={t(
            '下一步：新批次、多品种、机制指标',
            'Next: new batches, varieties, mechanism measures',
          )}
          mode={mode}
        />
      </>
    );
  return (
    <>
      <p className="ie-scroll-hint">
        <Text
          mode={mode}
          text={t(
            '图可左右滚动；文字与完整数据在图下。',
            'Scroll the diagram sideways; text and complete data follow.',
          )}
        />
      </p>
      <div
        className="ie-diagram-scroll"
        tabIndex={0}
        role="region"
        aria-label={pick(mode, '可滚动科学图', 'Scrollable science diagram')}
      >
        <svg
          viewBox="0 0 620 520"
          role="img"
          tabIndex={0}
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>
            {`${title[id]?.zh ?? '科学证据'} / ${title[id]?.en ?? 'Scientific evidence'}`}
          </title>
          <desc id={`${uid}-desc`}>
            {pick(
              mode,
              '原创教学示意图；非按比例，数值为虚构教学记录。图下有完整文字数据。',
              'Original teaching schematic, not to scale; fictional data. Complete textual data follow.',
            )}
          </desc>
          <defs>
            <marker
              id={arrow}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L8 4 L0 8Z" fill="#3c6d74" />
            </marker>
          </defs>
          <g fill="none" stroke="#3c6d74" strokeWidth="2">
            {body}
          </g>
        </svg>
      </div>
    </>
  );
}
const limits: Record<string, LocalizedText> = {
  L113: t(
    '本模型分类防御事件，不把病原体分给唯一免疫系统；记录比例不是保护贡献率。',
    'This classifies defence events, not pathogens into exclusive immune systems; event fractions are not protection shares.',
  ),
  L114: t(
    '虚构曲线，时间不是天；未模拟抗原变化、T细胞作用或真实感染风险。',
    'Fictional curves; time is not days. Antigen changes, T-cell effects and real infection risk are not modelled.',
  ),
  L115: t(
    '规定敏感全被去除、耐药全存活、后代四倍；不含突变、转移、迁入或耐药代价。',
    'Sensitive cells all disappear, resistant cells all survive, descendants multiply fourfold. Mutation, transfer, migration and resistance costs are omitted.',
  ),
  L116: t(
    '虚构饮品与事件；数值比较不替代研究设计，失访边界不是置信区间或个人健康判断。',
    'Invented drink and events; numerical comparison does not replace study design. Missing-outcome bounds are not confidence intervals or personal health judgements.',
  ),
  L117: t(
    '这里只检验句子是否可操作；没有模拟真实生长，株高不是全部健康。',
    'This checks operational wording, not real growth. Height does not represent all aspects of health.',
  ),
  L118: t(
    '四项修复不是充分性总分；仍缺更多批次和独立样本，分块未消除所有干扰。',
    'Four repairs are not a sufficiency score. More batches and independent samples remain needed; blocking does not remove every nuisance factor.',
  ),
  L119: t(
    '范围是最大−最小，不是均值±范围、仪器误差或CI；此处不推断统计显著性。',
    'Range=max−min, not mean±range, instrument error or a CI. Statistical significance is not inferred.',
  ),
  L120: t(
    '有条件支持不是定律；4株不是通用足够样本标准，株高证据未直接测机制。',
    'Conditional support is not a law; four plants are not a universal adequate sample size, and height data do not directly measure mechanism.',
  ),
};
function Caption({ id, mode }: ArtProps) {
  return (
    <p className="ie-boundary">
      <Text
        mode={mode}
        text={limits[id] ?? t('原创教学模型', 'Original teaching model')}
      />
    </p>
  );
}
export function ImmunityEvidenceDiagram({ id, mode }: ArtProps) {
  return (
    <div className="bio-s5-lab ie-lab">
      <h3>
        <Text mode={mode} text={title[id] ?? title.L120!} />
      </h3>
      <Art id={id} mode={mode} />
      <Caption id={id} mode={mode} />
    </div>
  );
}
export function ImmunityEvidenceHookArt(props: ArtProps) {
  return <ImmunityEvidenceDiagram {...props} />;
}
function Table({
  mode,
  headers,
  rows,
}: {
  mode: LanguageMode;
  headers: LocalizedText[];
  rows: (string | number)[][];
}) {
  return (
    <>
      <p className="ie-scroll-hint">
        <Text
          mode={mode}
          text={t(
            '完整数据表，可横向滚动。',
            'Complete data table; scroll sideways if needed.',
          )}
        />
      </p>
      <div
        className="ie-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={pick(mode, '完整数据表', 'Complete data table')}
      >
        <table>
          <caption>
            {pick(
              mode,
              '虚构教学数据 / 完整静态替代',
              'Fictional teaching data / complete static alternative',
            )}
          </caption>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th scope="col" key={i}>
                  <Text text={h} mode={mode} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) => (
                  <td key={j}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function Choices({
  mode,
  label,
  options,
  value,
  onChange,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  options: LocalizedText[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="ie-choices">
        {options.map((o, i) => (
          <button
            type="button"
            aria-pressed={value === i}
            className={value === i ? 'ie-selected' : ''}
            key={i}
            onClick={() => onChange(i)}
          >
            <Text mode={mode} text={o} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Notice({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <div className="ie-feedback" role="status" aria-live="polite">
      <Text mode={mode} text={text} />
    </div>
  );
}
function RouteLab({ mode, onExplore }: ExploreProps) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  return (
    <>
      <Art id="L113" mode={mode} />
      {immuneRoutes.map((r, i) => (
        <Choices
          key={r.event}
          mode={mode}
          label={t(
            [
              `屏障记录 ${r.count}条`,
              `吞噬记录 ${r.count}条`,
              `特异B克隆 ${r.count}条`,
            ][i]!,
            [
              `${r.count} barrier records`,
              `${r.count} phagocytosis records`,
              `${r.count} specific B-clone records`,
            ][i]!,
          )}
          options={[
            t('先天路线', 'Innate route'),
            t('适应性路线', 'Adaptive route'),
          ]}
          value={answers[i] ?? -1}
          onChange={(v) => {
            setAnswers((a) => a.map((x, j) => (i === j ? v : x)));
            onExplore();
          }}
        />
      ))}
      <Notice
        mode={mode}
        text={
          answers.every((x) => x === null)
            ? t(
                '先分类，再用85/100与15/100解释；一场感染可同时涉及两路线。',
                'Classify, then explain 85/100 versus 15/100; one infection can involve both routes.',
              )
            : answers[0] === 0 && answers[1] === 0 && answers[2] === 1
              ? t(
                  '分类支持85条先天、15条适应性记录。注意这不是保护贡献；B细胞产生抗体，吞噬由细胞完成。',
                  'Classification gives 85 innate and 15 adaptive records. This is not protection contribution; B cells produce antibodies while cells engulf.',
                )
              : t(
                  '检查机制：屏障及共有模式识别/吞噬属先天；抗原特异B克隆属适应性。没有一种病原体只能用一套系统防御。',
                  'Inspect the mechanism: barriers and shared-pattern recognition/engulfment are innate; specific B clones are adaptive. A pathogen is not limited to one defence system.',
                )
        }
      />
      <Table
        mode={mode}
        headers={[
          t('观察机制', 'Observed mechanism'),
          t('事件数', 'Events'),
          t('分类', 'Classification'),
        ]}
        rows={[
          [pick(mode, '屏障', 'Barrier'), 60, pick(mode, '先天', 'Innate')],
          [
            pick(mode, '吞噬', 'Phagocytosis'),
            25,
            pick(mode, '先天', 'Innate'),
          ],
          [
            pick(mode, 'B克隆', 'B clone'),
            15,
            pick(mode, '适应性', 'Adaptive'),
          ],
        ]}
      />
    </>
  );
}
function MemoryLab({ mode, onExplore }: ExploreProps) {
  const flow = useFrames(5, onExplore);
  const [mismatch, setMismatch] = useState(false);
  return (
    <>
      <Choices
        mode={mode}
        label={t('记忆A遇到什么？', 'What does memory A encounter?')}
        options={[
          t('相同抗原A', 'Same antigen A'),
          t('陌生且不匹配的B', 'Unfamiliar, unmatched B'),
        ]}
        value={mismatch ? 1 : 0}
        onChange={(v) => {
          setMismatch(!!v);
          flow.replay();
        }}
      />
      <Art id="L114" mode={mode} frame={flow.frame} alternate={mismatch} />
      <Playback flow={flow} mode={mode} />
      <Notice
        mode={mode}
        text={
          mismatch
            ? t(
                '本简化条件假定A记忆不识别B，因此两次都按首次规则；真实交叉识别未模拟。不能把A的13单位差照搬给B。',
                'This condition assumes A memory does not recognise B, so both use the primary rule. Cross-recognition is not modelled. A’s 13-unit difference cannot be copied to B.',
              )
            : t(
                `第${flow.frame}点：首次${memoryCurve.first[flow.frame]}，再次${memoryCurve.repeat[flow.frame]}任意单位。第2点差13单位；不是13天或13%保护。`,
                `Point ${flow.frame}: primary ${memoryCurve.first[flow.frame]}, secondary ${memoryCurve.repeat[flow.frame]} arbitrary units. Point 2 differs by 13 units, not 13 days or 13% protection.`,
              )
        }
      />
      <Table
        mode={mode}
        headers={[
          t('模型时点', 'Model time'),
          t('首次指数 / 任意单位', 'Primary / arbitrary units'),
          t('再次指数 / 任意单位', 'Repeat / arbitrary units'),
        ]}
        rows={memoryCurve.first.map((v, i) => [
          i,
          v,
          (mismatch ? memoryCurve.first : memoryCurve.repeat)[i]!,
        ])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '完整过程：首次激活→克隆增殖→效应增加→部分记忆保留；相同抗原再遇可更快反应。',
            'Complete process: activation → clonal expansion → effectors rise → some memory persists; matched re-exposure can respond faster.',
          )}
        />
      </p>
    </>
  );
}
function ResistanceLab({ mode, onExplore }: ExploreProps) {
  const flow = useFrames(2, onExplore);
  const [n, setN] = useState(2),
    [pressure, setPressure] = useState(true);
  const states = resistanceFrames(n, pressure);
  return (
    <>
      <Choices
        mode={mode}
        label={t(
          '初始耐药细胞 / 共20个',
          'Initially resistant / 20 cells total',
        )}
        options={[t('2个R', '2 R'), t('0个R', '0 R')]}
        value={n === 2 ? 0 : 1}
        onChange={(v) => {
          setN(v === 0 ? 2 : 0);
          flow.replay();
        }}
      />
      <Choices
        mode={mode}
        label={t('规定选择条件', 'Stipulated selection condition')}
        options={[
          t('S全被去除，R全存活', 'All S removed; all R survive'),
          t('不选择：S/R全存活', 'No selection: all S/R survive'),
        ]}
        value={pressure ? 0 : 1}
        onChange={(v) => {
          setPressure(v === 0);
          flow.replay();
        }}
      />
      <Art
        id="L115"
        mode={mode}
        frame={flow.frame}
        option={pressure ? 0 : 1}
        alternate={n === 0}
      />
      <Playback flow={flow} mode={mode} />
      <Notice
        mode={mode}
        text={
          n === 0 && pressure
            ? t(
                '无R来源、无存活者：比例未定义。选择没有把S变成R。',
                'No R source and no survivors: fraction undefined. Selection did not turn S into R.',
              )
            : pressure
              ? t(
                  '起点2/20=10%，存活2/2=100%而R数仍2；后代才到8。机制是差异存活，再繁殖。',
                  'Start 2/20=10%; survivors 2/2=100%, while R remains 2. Only descendants reach 8: differential survival, then reproduction.',
                )
              : t(
                  '两类同倍繁殖，频率保持；没有差异存活，不能声称选择提高耐药比例。',
                  'Equal multiplication preserves frequencies. Without differential survival, selection cannot be said to raise resistance frequency.',
                )
        }
      />
      <Table
        mode={mode}
        headers={[
          t('阶段', 'Stage'),
          t('S数量', 'S count'),
          t('R数量', 'R count'),
          t('总数', 'Total'),
          t('R比例', 'R fraction'),
        ]}
        rows={states.map((s, i) => [
          pick(
            mode,
            ['起点', '存活', '后代'][i]!,
            ['Start', 'Survivors', 'Descendants'][i]!,
          ),
          s.sensitive,
          s.resistant,
          s.sensitive + s.resistant,
          resistantFraction(s) === null
            ? '— / undefined'
            : `${Math.round(resistantFraction(s)! * 100)}%`,
        ])}
      />
    </>
  );
}
function HealthLab({ mode, onExplore }: ExploreProps) {
  const [small, setSmall] = useState(false),
    [missing, setMissing] = useState(false),
    [random, setRandom] = useState(false);
  const n = small ? 50 : 200;
  const r = riskComparison(10, n, 20, 200);
  return (
    <>
      <Choices
        mode={mode}
        label={t('完整情景：A组人数', 'Complete scenario: A group size')}
        options={[t('200人', '200 people'), t('50人', '50 people')]}
        value={small ? 1 : 0}
        onChange={(v) => {
          setSmall(!!v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('分配方式', 'Allocation')}
        options={[
          t('参与者自选', 'Self-selected'),
          t('随机分配且有对照', 'Random allocation with control'),
        ]}
        value={random ? 1 : 0}
        onChange={(v) => {
          setRandom(!!v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('另一个缺失情景', 'Separate missing-outcome scenario')}
        options={[
          t('只看完整情景', 'Inspect complete scenario'),
          t('A原200；30失访', 'A originally 200; 30 missing'),
        ]}
        value={missing ? 1 : 0}
        onChange={(v) => {
          setMissing(!!v);
          onExplore();
        }}
      />
      <Art id="L116" mode={mode} option={small ? 1 : 0} />
      <Table
        mode={mode}
        headers={[
          t('情景', 'Scenario'),
          t('A事件/人数', 'A events/people'),
          t('B事件/人数', 'B events/people'),
        ]}
        rows={[
          [
            pick(mode, '完整', 'Complete'),
            `10/${n} = ${r.a * 100}%`,
            '20/200 = 10%',
          ],
          [
            pick(mode, '另情景完整病例', 'Separate complete cases'),
            '10/170 ≈ 5.88%',
            '20/200 = 10%',
          ],
          [
            pick(mode, '另情景全体极端边界', 'Separate full-group bounds'),
            '10/200–40/200 = 5%–20%',
            '20/200 = 10%',
          ],
        ]}
      />
      <Notice
        mode={mode}
        text={
          missing
            ? t(
                '这是另一个原分配200人的情景，不沿用上面50人分母。170有记录，10有事件；10/170≈5.88%。失访30人的全组极端为5%–20%，不能按无事件处理。',
                'This is a separate 200-assigned scenario, independent of the 50-person switch. Of 170 observed, 10 have events: 5.88%. Full-group extreme bounds with 30 missing are 5%–20%; missing is not event-free.',
              )
            : t(
                `完整情景A为${r.a * 100}%，B10%，A相对B${small ? '更高' : '降低50%'}；B−A=${((r.b - r.a) * 100).toFixed(0)}个百分点。${random ? '随机有助减少混杂，但仍须看盲法、随访、样本与结局定义。' : '自选可能混入睡眠等差异，不能据此证明饮品因果作用。'}`,
                `Complete scenario: A ${r.a * 100}%, B 10%; A is ${small ? 'higher' : '50% lower relative to B'}. B−A=${((r.b - r.a) * 100).toFixed(0)} percentage points. ${random ? 'Random allocation helps reduce confounding; still inspect blinding, follow-up, sample and outcome definition.' : 'Self-selection can confound sleep and other factors; this cannot establish a causal drink effect.'}`,
              )
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '青禾饮品、症状与人数均为虚构。盲法降低预期/评估偏差；观察研究可发现关联，但一张图不能排除全部替代解释。',
            'The Qinghe drink, symptoms and counts are fictional. Blinding reduces expectation/assessment bias. Observations can reveal associations, but one graph cannot exclude every alternative.',
          )}
        />
      </p>
    </>
  );
}
function HypothesisLab({ mode, onExplore }: ExploreProps) {
  const [factor, setFactor] = useState(0),
    [outcome, setOutcome] = useState(0),
    [controls, setControls] = useState(false),
    [touched, setTouched] = useState(false);
  const edit = (fn: () => void) => {
    fn();
    setTouched(true);
    onExplore();
  };
  const valid = assessHypothesis(
    factor === 1 ? 'light hours' : 'health',
    outcome === 1 ? 'height change in cm after 7 days' : 'happy',
    controls,
  );
  return (
    <>
      <Art id="L117" mode={mode} />
      <Choices
        mode={mode}
        label={t('安排改变什么？', 'What will be varied?')}
        options={[
          t('“更健康”', '“Healthier”'),
          t('每天4/8 h光照', '4/8 h illumination daily'),
        ]}
        value={factor}
        onChange={(v) => edit(() => setFactor(v))}
      />
      <Choices
        mode={mode}
        label={t('测量什么？', 'What will be measured?')}
        options={[
          t('研究者觉得快乐', 'Researcher’s impression of happiness'),
          t('7天株高增量 / cm', 'Seven-day height increase / cm'),
        ]}
        value={outcome}
        onChange={(v) => edit(() => setOutcome(v))}
      />
      <label className="ie-check">
        <input
          type="checkbox"
          checked={controls}
          onChange={(e) => edit(() => setControls(e.target.checked))}
        />
        <Text
          mode={mode}
          text={t(
            '固定水量、土、品种、温度与测量方法',
            'Match water, soil, variety, temperature and measurement method',
          )}
        />
      </label>
      <Notice
        mode={mode}
        text={
          !touched
            ? t(
                '修复三个位置，使“更健康”成为可比较的预测。',
                'Repair all three fields to turn “healthier” into a comparable prediction.',
              )
            : valid
              ? t(
                  '现在可检验：在固定条件下比较4/8 h组7天cm增量。示例均值9/12 cm支持方向，但不证明全部健康；相等或反向的重复结果会挑战预测。',
                  'Now testable: compare seven-day cm increases at 4/8 h under matched conditions. Means 9/12 cm support the direction, not all health; repeated equal/reversed results would challenge it.',
                )
              : t(
                  `${factor !== 1 ? '自变量需用4/8 h明确；' : ''}${outcome !== 1 ? '响应需有7天、株高增量、cm；' : ''}${!controls ? '水土温度也须匹配；' : ''}不能同时改变多种条件后只归因于光。`,
                  `${factor !== 1 ? 'Define the factor as 4/8 h. ' : ''}${outcome !== 1 ? 'Specify seven days, height change and cm. ' : ''}${!controls ? 'Match water, soil and temperature. ' : ''}Changing several conditions cannot isolate light.`,
                )
        }
      />
      <Table
        mode={mode}
        headers={[
          t('处理', 'Treatment'),
          t('虚构7天增量/cm', 'Fictional seven-day changes / cm'),
          t('均值/cm', 'Mean / cm'),
        ]}
        rows={[
          ['4 h', '8, 9, 10, 9', 9],
          ['8 h', '11, 12, 12, 13', 12],
        ]}
      />
    </>
  );
}
function ReplicateLab({ mode, onExplore }: ExploreProps) {
  const [repairs, setRepairs] = useState([false, false, false, false]);
  const labels = [
    t('同水量：两组一致', 'Same water in both groups'),
    t('独立盆栽：4株各3读数', 'Independent pots: 4 plants × 3 readings'),
    t('用机会机制分配处理', 'Assign treatments by chance'),
    t('每个近/远窗块含两处理', 'Both treatments in each near/far block'),
  ];
  const ids = repairs[1]
    ? ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D']
    : Array<string>(12).fill('A');
  return (
    <>
      <Art id="L118" mode={mode} />
      {labels.map((label, i) => (
        <label className="ie-check" key={i}>
          <input
            type="checkbox"
            checked={repairs[i]}
            onChange={(e) => {
              setRepairs((a) =>
                a.map((v, j) => (j === i ? e.target.checked : v)),
              );
              onExplore();
            }}
          />
          <Text mode={mode} text={label} />
        </label>
      ))}
      <Notice
        mode={mode}
        text={t(
          `已处理${repairs.filter(Boolean).length}/4处设计问题；12条读数来自${biologicalReplicates(ids)}个生物单位。${!repairs[0] ? '水量仍混杂。' : ''}${!repairs[1] ? '同株反复读数不是独立重复。' : ''}${!repairs[2] ? '人为挑选植株仍可能偏倚。' : ''}${!repairs[3] ? '位置仍可能与处理重合。' : ''}这些修复不保证样本足够或所有误差消失。`,
          `Addressed ${repairs.filter(Boolean).length}/4 design problems; 12 readings come from ${biologicalReplicates(ids)} biological units. ${!repairs[0] ? 'Water remains confounded. ' : ''}${!repairs[1] ? 'Re-readings of one plant are not independent replication. ' : ''}${!repairs[2] ? 'Deliberate plant selection can bias allocation. ' : ''}${!repairs[3] ? 'Position may remain confounded. ' : ''}Repairs do not guarantee adequate sampling or eliminate all errors.`,
        )}
      />
      <Table
        mode={mode}
        headers={[t('读数ID', 'Reading IDs'), t('植株ID', 'Plant ID')]}
        rows={
          repairs[1]
            ? [
                ['1–3', 'A'],
                ['4–6', 'B'],
                ['7–9', 'C'],
                ['10–12', 'D'],
              ]
            : [['1–12', 'A']]
        }
      />
      <Table
        mode={mode}
        headers={[
          t('位置块', 'Position block'),
          t('4 h / cm', '4 h / cm'),
          t('8 h / cm', '8 h / cm'),
          t('块内差 / cm', 'Within-block difference / cm'),
        ]}
        rows={blockData.map((b) => [
          b.block,
          b.short,
          b.long,
          b.long - b.short,
        ])}
      />
    </>
  );
}
function GraphLab({ mode, onExplore }: ExploreProps) {
  const [unusual, setUnusual] = useState(false),
    [units, setUnits] = useState(false),
    [decision, setDecision] = useState(-1);
  const a = unusual ? [8, 9, 28, 9] : seedlingData.short;
  const s = summary(a),
    b = summary(seedlingData.long);
  return (
    <>
      <Choices
        mode={mode}
        label={t('选择记录版本', 'Record version')}
        options={[
          t('原记录：8,9,10,9 cm', 'Original: 8,9,10,9 cm'),
          t('待查：8,9,28,9 cm', 'Unverified: 8,9,28,9 cm'),
        ]}
        value={unusual ? 1 : 0}
        onChange={(v) => {
          setUnusual(!!v);
          setDecision(-1);
          onExplore();
        }}
      />
      <Art id="L119" mode={mode} alternate={unusual} />
      <label className="ie-check">
        <input
          type="checkbox"
          checked={units}
          onChange={(e) => {
            setUnits(e.target.checked);
            onExplore();
          }}
        />
        <Text
          mode={mode}
          text={t(
            '将坏图“生长”修为“7天株高增量 / cm”，横轴写4/8 h',
            'Repair “growth” as “seven-day height increase / cm”; label 4/8 h on x',
          )}
        />
      </label>
      <div className="ie-repair-label">
        <Text
          mode={mode}
          text={
            units
              ? t(
                  '修复图题：Seven-day seedling height increase；纵轴cm；横轴日光照时长h。上图已展示正确版本。',
                  'Repaired title: Seven-day seedling height increase; y in cm; x daily illumination in h. The diagram shows this correct version.',
                )
              : t(
                  '待修复坏图题：“生长”；未写时间、响应或单位。请勾选修复；上图是有单位的参考图。',
                  'Faulty title to repair: “Growth”, missing time, response and units. Tick to repair; the diagram is the labelled reference.',
                )
          }
        />
      </div>
      <Choices
        mode={mode}
        label={t(
          '如何处理待查28 cm？',
          'How should the unverified 28 cm be treated?',
        )}
        options={[
          t('不合预测，直接删', 'Delete because it disagrees'),
          t(
            '查原表/单位/方法，先保留并报告影响',
            'Check records/units/method; retain and report influence',
          ),
        ]}
        value={decision}
        onChange={(v) => {
          setDecision(v);
          onExplore();
        }}
      />
      <Notice
        mode={mode}
        text={
          decision === 0
            ? t(
                '不能凭不合预测删点。28可能是真实变异；只有证实错误才有理由透明更正。均值从9到13.5 cm说明敏感性。',
                'Disagreement is not grounds for deletion. 28 may be real variation; only documented error justifies transparent correction. The 9→13.5 cm change shows sensitivity.',
              )
            : t(
                `当前第一组均值${s.mean} cm，范围${s.range} cm，端点${s.min}–${s.max} cm；第二组均值12 cm，范围2 cm。${unusual ? '方向已改变，应追查。' : '样本均值差3 cm。'}范围不是CI，未做统计显著性判断。`,
                `Current first mean ${s.mean} cm, range ${s.range} cm, endpoints ${s.min}–${s.max} cm; second mean 12 cm, range 2 cm. ${unusual ? 'Direction reverses; investigate.' : 'Sample means differ by 3 cm.'} Range is not a CI; significance has not been assessed.`,
              )
        }
      />
      <Table
        mode={mode}
        headers={[
          t('条件', 'Condition'),
          t('原始值/cm', 'Raw / cm'),
          t('均值/cm', 'Mean / cm'),
          t('min–max/cm', 'Min–max / cm'),
          t('范围/cm', 'Range / cm'),
        ]}
        rows={[
          ['4 h', a.join(', '), s.mean, `${s.min}–${s.max}`, s.range],
          [
            '8 h',
            seedlingData.long.join(', '),
            b.mean,
            `${b.min}–${b.max}`,
            b.range,
          ],
        ]}
      />
    </>
  );
}
function ConclusionLab({ mode, onExplore }: ExploreProps) {
  const [repaired, setRepaired] = useState(false),
    [claim, setClaim] = useState(-1);
  return (
    <>
      <Art id="L120" mode={mode} />
      <Choices
        mode={mode}
        label={t('证据来自哪种设计？', 'Which design generated the evidence?')}
        options={[
          t('坏设计：水/位置同时变', 'Faulty: water/position also vary'),
          t(
            '修复：同水、块内随机、独立盆栽',
            'Repaired: matched water, within-block random, independent pots',
          ),
        ]}
        value={repaired ? 1 : 0}
        onChange={(v) => {
          setRepaired(!!v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('选择结论', 'Choose a conclusion')}
        options={[
          t(
            '8 h让所有植物最终高33.3%',
            '8 h makes all plants finally 33.3% taller',
          ),
          t(
            '本样本均值12对9 cm，设计限制归因',
            'Sample means 12 vs 9 cm; design limits attribution',
          ),
          t(
            '修复条件下支持较大7天增量，机制与推广仍待查',
            'Repaired conditions support greater seven-day increase; mechanism and scope need testing',
          ),
        ]}
        value={claim}
        onChange={(v) => {
          setClaim(v);
          onExplore();
        }}
      />
      <Notice
        mode={mode}
        text={
          claim < 0
            ? t(
                '先审查设计再选主张：数据是7天株高增量，不是总株高。',
                'Inspect design, then choose a claim: the data measure seven-day height increase, not final height.',
              )
            : claim === 0
              ? t(
                  '主张越界：3/9≈33.3%指样本平均增量的相对差，不能变成所有植物最终株高或产量。',
                  'Overreach: 3/9≈33.3% is a relative difference in sample mean increases, not all plants’ final height or yield.',
                )
              : !repaired && claim === 2
                ? t(
                    '坏设计仍有水与位置混杂，不能借“修复条件”措辞掩盖。选描述性主张并提出修复。',
                    'The faulty design still confounds water and position; “repaired conditions” cannot hide this. Use a descriptive claim and propose repairs.',
                  )
                : repaired && claim === 2
                  ? t(
                      '结论匹配：本条件下12对9 cm、差3 cm；可行光合作用解释但糖未测。一批一种、n4/组限制推广，需新独立批次与品种。',
                      'Matched conclusion: 12 vs 9 cm, a 3 cm difference here. Photosynthesis is plausible but sugar unmeasured. One batch/variety and n4/group limit scope; test new independent batches/varieties.',
                    )
                  : t(
                      '描述性结论正确保留12与9 cm。若已修复设计，可进一步有条件支持时长效应；仍不能称普遍证明。',
                      'The descriptive claim correctly retains 12 and 9 cm. With repaired design, conditional support for duration is stronger, but not universal proof.',
                    )
        }
      />
      <Table
        mode={mode}
        headers={[t('测量', 'Measurement'), t('4 h', '4 h'), t('8 h', '8 h')]}
        rows={[
          [pick(mode, '7天平均增量/cm', '7-day mean increase / cm'), 9, 12],
          [pick(mode, '独立植株n', 'Independent plants n'), 4, 4],
          [pick(mode, '样本范围/cm', 'Sample range / cm'), 2, 2],
        ]}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '可迁移句框：“在___条件下，___对___（单位）支持___；机制可能___，但未测___；下一步___。”英语可另练，生物推理可中文。',
            'Transfer frame: “Under ___, ___ versus ___ (units) supports ___. A mechanism could be ___, but ___ was unmeasured. Next, ___.” English practice is separate; Chinese reasoning is accepted.',
          )}
        />
      </p>
    </>
  );
}
export function ImmunityEvidenceExplore(props: ExploreProps) {
  const labs: Record<string, typeof RouteLab> = {
    L113: RouteLab,
    L114: MemoryLab,
    L115: ResistanceLab,
    L116: HealthLab,
    L117: HypothesisLab,
    L118: ReplicateLab,
    L119: GraphLab,
    L120: ConclusionLab,
  };
  const Lab = labs[props.id] ?? ConclusionLab;
  return (
    <section
      className="bio-s5-lab ie-lab"
      aria-label={pick(
        props.mode,
        '免疫与证据实验室',
        'Immunity and evidence laboratory',
      )}
    >
      <h3>
        <Text mode={props.mode} text={title[props.id] ?? title.L120!} />
      </h3>
      <Lab {...props} />
      <Caption id={props.id} mode={props.mode} />
    </section>
  );
}
