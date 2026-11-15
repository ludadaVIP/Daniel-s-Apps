import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  eligibleObservations,
  gelPosition,
  pairedDifferences,
  pcrEvidence,
  researchObservations,
  summarise,
  talkMinutes,
  type PcrCase,
} from './biotechnologyResearchModel';
import './biotechnologyResearch.css';
type ViewProps = { id: string; mode: LanguageMode };
type ExploreProps = ViewProps & { onExplore: () => void };
const uiText = (mode: LanguageMode, value: LocalizedText) =>
  mode === 'en' ? value.en : value.zh;
const titles: Record<string, LocalizedText> & { L144: LocalizedText } = {
  L137: t('选择性扩增与对照', 'Selective copying and controls'),
  L138: t('大小与序列是不同证据', 'Size and sequence are different evidence'),
  L139: t('切割之后还有修复', 'Repair follows cutting'),
  L140: t('事实、不确定与价值', 'Facts, uncertainty and values'),
  L141: t('从兴趣到可回答的问题', 'From curiosity to answerable questions'),
  L142: t('设计决定证据边界', 'Design sets evidence boundaries'),
  L143: t('保留缺失、单位和时间', 'Retain missingness, units and time'),
  L144: t('让别人核查推理链', 'Make the reasoning checkable'),
};
function L({
  x,
  y,
  value,
  mode,
}: {
  x: number;
  y: number;
  value: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#173f43" fontSize="16">
      {mode !== 'en' && <tspan x={x}>{value.zh}</tspan>}
      {mode !== 'zh' && (
        <tspan x={x} dy={mode === 'bilingual' ? 21 : 0}>
          {value.en}
        </tspan>
      )}
    </text>
  );
}
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
    <>
      <p className="br-hint">
        <Text
          mode={mode}
          text={t(
            '图可横向滚动；聚焦后用方向键。示意非实际比例。',
            'Diagram scrolls horizontally; focus it and use arrow keys. Schematic, not to scale.',
          )}
        />
      </p>
      <div
        className="br-scroll"
        role="region"
        tabIndex={0}
        aria-label={uiText(mode, title)}
      >
        <svg viewBox="0 0 680 400" role="img" aria-labelledby={uid}>
          <title id={uid}>{uiText(mode, title)}</title>
          <rect width="680" height="400" rx="18" fill="#edf5f1" />
          {children}
        </svg>
      </div>
    </>
  );
}
function Diagram({
  id,
  mode,
  frame = 4,
  sample = 400,
  raw = true,
  equalEffort = true,
}: ViewProps & {
  frame?: number;
  sample?: number;
  raw?: boolean;
  equalEffort?: boolean;
}) {
  const title = titles[id] ?? titles.L144;
  return (
    <Scene mode={mode} title={title}>
      {id === 'L137' && (
        <>
          <L
            x={340}
            y={30}
            value={t(
              '只复制两端标定的目标区段',
              'Copy the target bounded by primers',
            )}
            mode={mode}
          />
          <path
            d="M55 105 H625 M55 125 H625"
            stroke="#7c9296"
            strokeWidth="5"
          />
          <path
            d="M225 105 H455 M225 125 H455"
            stroke="#286b68"
            strokeWidth="7"
          />
          <path d="M225 88 v55 M455 88 v55" stroke="#b66937" strokeWidth="3" />
          <L x={130} y={165} value={t('模板DNA', 'Template DNA')} mode={mode} />
          <L
            x={340}
            y={165}
            value={t('目标区段', 'Target segment')}
            mode={mode}
          />
          <L
            x={550}
            y={165}
            value={t('引物界定两端', 'Primers bound ends')}
            mode={mode}
          />
          {[0, 1, 2, 3, 4].map((c) => (
            <g key={c} opacity={c <= frame ? 1 : 0.22}>
              <rect
                x={35 + c * 130}
                y={225}
                width="115"
                height="70"
                rx="10"
                fill={c === frame ? '#cce3c5' : '#dae6e4'}
              />
              <text
                x={92 + c * 130}
                y={255}
                textAnchor="middle"
                fontSize="22"
                fill="#173f43"
              >
                {2 * 2 ** c}
              </text>
              <L
                x={92 + c * 130}
                y={278}
                value={t(`循环${c}`, `Cycle ${c}`)}
                mode={mode}
              />
            </g>
          ))}
          <L
            x={340}
            y={340}
            value={t(
              'N₀=2，100%理想效率；不是全基因组',
              'N₀=2, ideal 100% efficiency; not a whole genome',
            )}
            mode={mode}
          />
        </>
      )}
      {id === 'L138' && (
        <>
          <L
            x={340}
            y={28}
            value={t(
              'DNA负电，向正极；marker仅作大小参照',
              'Negative DNA → positive pole; marker estimates size',
            )}
            mode={mode}
          />
          {[120, 310, 500].map((x, i) => (
            <g key={x}>
              <rect
                x={x - 52}
                y={70}
                width="104"
                height="215"
                rx="10"
                fill="#173f43"
              />
              <rect x={x - 20} y={76} width="40" height="8" fill="#e4d7a2" />
              <L
                x={x}
                y={312}
                value={
                  [
                    t('标准(bp)', 'Marker (bp)'),
                    t('样本', 'Sample'),
                    t('参照', 'Reference'),
                  ][i] ?? t('参照', 'Reference')
                }
                mode={mode}
              />
            </g>
          ))}
          {[1600, 800, 400, 200, 100].map((bp) => (
            <g key={bp}>
              <path
                d={`M89 ${gelPosition(bp)} H151`}
                stroke="#d1e9aa"
                strokeWidth="6"
              />
              <text
                x={175}
                y={gelPosition(bp) + 5}
                fontSize="15"
                fill="#173f43"
              >
                {bp}
              </text>
            </g>
          ))}
          <path
            d={`M279 ${gelPosition(sample)} H341 M469 ${gelPosition(400)} H531`}
            stroke="#d1e9aa"
            strokeWidth="7"
          />
          <path
            d="M607 90 V258 l-9 -12 m9 12 l9 -12"
            stroke="#b66937"
            fill="none"
            strokeWidth="3"
          />
          <text x="608" y="280" textAnchor="middle" fontSize="20">
            +
          </text>
          <L
            x={340}
            y={365}
            value={t(
              '同大小≠同序列：ATCG / AGCT（虚构短片段）',
              'Same size ≠ same sequence: ATCG / AGCT (toy fragments)',
            )}
            mode={mode}
          />
        </>
      )}
      {id === 'L139' && (
        <>
          <L
            x={340}
            y={30}
            value={t(
              '虚构植物：100份中只测了20份',
              'Fictional plant: only 20 of 100 samples assessed',
            )}
            mode={mode}
          />
          <path
            d="M70 100 H600 M70 118 H600"
            stroke="#286b68"
            strokeWidth="5"
          />
          {frame >= 1 && (
            <path
              d="M330 80 l22 60 M352 80 l-22 60"
              stroke="#b66937"
              strokeWidth="5"
            />
          )}
          <L
            x={340}
            y={160}
            value={
              frame === 0
                ? t('靶向≠已经改变', 'Targeting ≠ an edit')
                : frame === 1
                  ? t('切割≠指定产物', 'Cut ≠ a specified product')
                  : t('修复可产生混合结果', 'Repair can produce mixed outcomes')
            }
            mode={mode}
          />
          {[
            t('预期12/20', 'Intended 12/20'),
            t('其他修复5/20', 'Other repair 5/20'),
            t('未改变3/20', 'Unchanged 3/20'),
          ].map((v, i) => (
            <g key={i} opacity={frame >= 2 ? 1 : 0.25}>
              <path
                d={`M340 195 L${120 + i * 220} 225`}
                stroke="#7c9296"
                strokeWidth="2"
              />
              <rect
                x={30 + i * 220}
                y="230"
                width="180"
                height="75"
                rx="12"
                fill={['#cce3c5', '#f2dbb9', '#d5e5e5'][i]}
              />
              <L x={120 + i * 220} y={260} value={v} mode={mode} />
            </g>
          ))}
          <L
            x={340}
            y={355}
            value={t(
              '其余80份未测；还需检查其他位点',
              '80 unassessed; other genomic sites still need checking',
            )}
            mode={mode}
          />
        </>
      )}
      {id === 'L140' && (
        <>
          <L
            x={340}
            y={32}
            value={t(
              '虚构耐旱植物的研究决策',
              'A research decision for a fictional drought-tolerant plant',
            )}
            mode={mode}
          />
          {[
            {
              x: 120,
              y: 150,
              c: '#cce3c5',
              v: t('事实：12/20', 'Fact: 12/20'),
            },
            {
              x: 560,
              y: 150,
              c: '#f2dbb9',
              v: t('未知：生态影响', 'Unknown: ecology'),
            },
            {
              x: 340,
              y: 290,
              c: '#d5e5e5',
              v: t('价值：公平/同意', 'Values: fairness/consent'),
            },
          ].map((o) => (
            <g key={o.x}>
              <ellipse
                cx={o.x}
                cy={o.y}
                rx={o.x === 340 ? 115 : 100}
                ry="70"
                fill={o.c}
              />
              <L x={o.x} y={o.y - 8} value={o.v} mode={mode} />
            </g>
          ))}
          <path
            d="M225 150 L455 150 M180 213 L245 250 M500 213 L435 250"
            stroke="#286b68"
            strokeWidth="3"
          />
          <L
            x={340}
            y={375}
            value={t(
              '两种合理决定，都要可质疑、可修订',
              'Two defensible decisions; each open to challenge and revision',
            )}
            mode={mode}
          />
        </>
      )}
      {id === 'L141' && (
        <>
          <L
            x={340}
            y={35}
            value={t(
              '“树多会使鸟更多吗？”先修问题',
              '“Do more trees cause more birds?” Repair the question',
            )}
            mode={mode}
          />
          {[
            t('对象/地点/时期', 'Organisms / place / period'),
            t('记录单位与努力', 'Recorded units and effort'),
            t('描述或比较', 'Describe or compare'),
            t('因果还需新设计', 'Causality needs a new design'),
          ].map((v, i) => (
            <g key={i}>
              <path
                d={`M${60 + i * 35} ${78 + i * 72} H${620 - i * 35} L${585 - i * 35} ${133 + i * 72} H${95 + i * 35} Z`}
                fill={i === 3 ? '#f2dbb9' : '#cce3c5'}
              />
              <L x={340} y={100 + i * 72} value={v} mode={mode} />
            </g>
          ))}
        </>
      )}
      {id === 'L142' && (
        <>
          <L
            x={340}
            y={30}
            value={t(
              '同日期配对，不把重复访问当独立地点',
              'Pair dates; repeated visits are not independent sites',
            )}
            mode={mode}
          />
          {[1, 3, 7, 10].map((d, i) => (
            <g key={d}>
              <L
                x={160 + i * 125}
                y={90}
                value={t(`第${d}天`, `Day ${d}`)}
                mode={mode}
              />
              <circle
                cx={160 + i * 125}
                cy="170"
                r="28"
                fill={i === 2 ? '#f2dbb9' : '#cce3c5'}
              />
              <text x={160 + i * 125} y="177" textAnchor="middle" fontSize="22">
                {[2, 4, 'NA', 0][i]}
              </text>
              <circle
                cx={160 + i * 125}
                cy="280"
                r="28"
                fill={i === 2 ? '#f2dbb9' : '#d5e5e5'}
              />
              <text x={160 + i * 125} y="287" textAnchor="middle" fontSize="22">
                {[4, 6, 8, 2][i]}
              </text>
              {i !== 2 && (
                <path
                  d={`M${160 + i * 125} 200 V247`}
                  stroke="#286b68"
                  strokeWidth="3"
                />
              )}
            </g>
          ))}
          <L x={50} y={168} value={t('地点A', 'Site A')} mode={mode} />
          <L x={50} y={278} value={t('地点B', 'Site B')} mode={mode} />
          <L
            x={340}
            y={355}
            value={t(
              '第7天：A缺失；B观察10 min，其余5 min',
              'Day 7: A missing; B observed 10 min; others 5 min',
            )}
            mode={mode}
          />
        </>
      )}
      {id === 'L143' && (
        <>
          <L
            x={340}
            y={26}
            value={t(
              '虚构鸟类记录数；不是总体密度',
              'Fictional bird records; not population density',
            )}
            mode={mode}
          />
          <path
            d="M90 70 V310 H610"
            stroke="#173f43"
            fill="none"
            strokeWidth="2"
          />
          {[0, 2, 4, 6, 8].map((n) => (
            <g key={n}>
              <path d={`M90 ${310 - n * 25} H610`} stroke="#ccdcd6" />
              <text x="75" y={315 - n * 25} textAnchor="end" fontSize="16">
                {n}
              </text>
            </g>
          ))}
          <L x={45} y={65} value={t('记录数', 'Records')} mode={mode} />
          {raw ? (
            <>
              {[1, 3, 7, 10].map((d) => (
                <text
                  x={110 + (d - 1) * 53}
                  y="334"
                  key={d}
                  textAnchor="middle"
                  fontSize="16"
                >
                  {d}
                </text>
              ))}
              {researchObservations
                .filter(
                  (r) => r.count !== null && (!equalEffort || r.minutes === 5),
                )
                .map((r) => (
                  <g key={r.site + r.day}>
                    <circle
                      cx={110 + (r.day - 1) * 53 + (r.site === 'A' ? -5 : 5)}
                      cy={310 - (r.count ?? 0) * 25}
                      r="7"
                      fill={r.site === 'A' ? '#286b68' : '#b66937'}
                    />
                    {r.minutes === 10 && (
                      <text
                        x={110 + (r.day - 1) * 53 + 8}
                        y={300 - (r.count ?? 0) * 25}
                        fontSize="15"
                      >
                        10 min
                      </text>
                    )}
                  </g>
                ))}
              <L
                x={340}
                y={365}
                value={t(
                  '日期（日）；A绿，B橙；A第7天缺失',
                  'Day; A green, B orange; A day 7 missing',
                )}
                mode={mode}
              />
            </>
          ) : (
            <>
              {['A', 'B'].map((site, i) => {
                const s = summarise(
                  eligibleObservations(site, equalEffort).map((r) => r.count),
                );
                return (
                  <g key={site}>
                    <rect
                      x={200 + i * 220}
                      y={310 - (s.mean ?? 0) * 25}
                      width="80"
                      height={(s.mean ?? 0) * 25}
                      fill={site === 'A' ? '#286b68' : '#b66937'}
                    />
                    <text
                      x={240 + i * 220}
                      y="334"
                      textAnchor="middle"
                      fontSize="18"
                    >
                      {site}: {s.mean?.toFixed(1)}, n={s.n}
                    </text>
                  </g>
                );
              })}
              <L
                x={340}
                y={365}
                value={t(
                  '均值隐藏原始差异；未画置信区间',
                  'Means hide individual values; no confidence interval shown',
                )}
                mode={mode}
              />
            </>
          )}
        </>
      )}
      {id === 'L144' && (
        <>
          <L
            x={340}
            y={30}
            value={t(
              '可核查报告：图、句子、局限相互对齐',
              'Checkable report: align chart, claim and limitation',
            )}
            mode={mode}
          />
          <rect
            x="45"
            y="70"
            width="280"
            height="235"
            rx="12"
            fill="#fff"
            stroke="#7c9296"
          />
          <path
            d="M80 245 V115 M80 245 H285"
            stroke="#286b68"
            strokeWidth="2"
          />
          {[2, 4, 0].map((v, i) => (
            <circle
              key={i}
              cx={115 + i * 65}
              cy={245 - v * 25}
              r="7"
              fill="#286b68"
            />
          ))}
          <L
            x={185}
            y={280}
            value={t('含单位/来源/缺失', 'Units / source / missingness')}
            mode={mode}
          />
          {[
            t('结论：本记录B较高', 'Claim: B higher in these records'),
            t('证据：均值4与2', 'Evidence: means 4 and 2'),
            t('局限：各一个地点', 'Limit: one site per setting'),
          ].map((v, i) => (
            <g key={i}>
              <rect
                x="350"
                y={75 + i * 90}
                width="295"
                height="70"
                rx="10"
                fill={i === 2 ? '#f2dbb9' : '#cce3c5'}
              />
              <L x={497} y={99 + i * 90} value={v} mode={mode} />
            </g>
          ))}
          <L
            x={340}
            y={365}
            value={t(
              'English abstract + 双语图注 + 自己语言讲解',
              'English abstract + bilingual caption + your chosen spoken language',
            )}
            mode={mode}
          />
        </>
      )}
    </Scene>
  );
}
export function BiotechnologyResearchDiagram(props: ViewProps) {
  return (
    <div className="bio-s6-lab br-lab">
      <Diagram {...props} />
    </div>
  );
}
export function BiotechnologyResearchHookArt(props: ViewProps) {
  return <BiotechnologyResearchDiagram {...props} />;
}
function Choices({
  label,
  values,
  value,
  setValue,
  mode,
}: {
  label: LocalizedText;
  values: LocalizedText[];
  value: number;
  setValue: (n: number) => void;
  mode: LanguageMode;
}) {
  return (
    <fieldset>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="br-choices">
        {values.map((v, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={value === i}
            onClick={() => setValue(i)}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Feedback({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <div className="br-feedback" role="status">
      <Text mode={mode} text={text} />
    </div>
  );
}
function PcrLab({ mode, onExplore }: ExploreProps) {
  const [template, setTemplate] = useState(2),
    [eff, setEff] = useState(1),
    [scenario, setScenario] = useState<PcrCase>('clean');
  const flow = useFrames(4, onExplore),
    result = pcrEvidence(template, flow.frame, eff, scenario);
  return (
    <>
      <Choices
        mode={mode}
        label={t('起始目标分子数', 'Initial target molecules')}
        values={[t('0份模板', '0 templates'), t('2份模板', '2 templates')]}
        value={template === 0 ? 0 : 1}
        setValue={(v) => {
          setTemplate(v * 2);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t(
          '每轮概念效率（固定，不代表真实平台期）',
          'Conceptual efficiency per cycle (fixed; no real plateau)',
        )}
        values={[t('50%', '50%'), t('100%理想', '100% ideal')]}
        value={eff === 1 ? 1 : 0}
        setValue={(v) => {
          setEff(v ? 1 : 0.5);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('对照情境', 'Control scenario')}
        values={[
          t('洁净', 'Clean'),
          t('空白目标污染', 'Target-contaminated blank'),
          t('共有抑制情境', 'Shared inhibition scenario'),
        ]}
        value={['clean', 'contaminated', 'inhibited'].indexOf(scenario)}
        setValue={(v) => {
          setScenario(
            (['clean', 'contaminated', 'inhibited'] as PcrCase[])[v] ?? 'clean',
          );
          onExplore();
        }}
      />
      <Diagram id="L137" mode={mode} frame={flow.frame} />
      <Playback flow={flow} mode={mode} />
      <p>
        <Text
          mode={mode}
          text={t(
            '上图为理想2份模板示例；下表随设置变化，分数是期望量而非半个分子。表是目标份数，不模拟仪器信号、阈值或检测概率。阳性初始2份；共有抑制只阻止新增，不使已有DNA消失。0轮尚未验证扩增；对照还需空白无目标且阳性实际新增。现实空白信号也可能涉及非特异扩增等问题。',
            'The diagram illustrates two ideal templates; the table follows your settings. Fractions are expected quantities, not partial molecules. The table counts targets, not instrument signals, thresholds or detection probabilities. The positive starts with two copies; shared inhibition prevents new copies without deleting existing DNA. Zero cycles have not verified amplification. Controls require a target-free blank and actual positive-control increase. Real blank signals can also involve non-specific amplification.',
          )}
        />
      </p>
      <div
        className="br-table"
        role="region"
        tabIndex={0}
        aria-label={uiText(mode, t('扩增结果表', 'Amplification results'))}
      >
        <table>
          <thead>
            <tr>
              <th>
                <Text mode={mode} text={t('循环', 'Cycle')} />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('样本目标份数', 'Sample target copies')}
                />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('空白目标份数', 'Blank target copies')}
                />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('阳性目标份数', 'Positive target copies')}
                />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('阳性新增份数', 'Positive copies added')}
                />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('扩增对照状态', 'Amplification-control status')}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{flow.frame}</td>
              <td>{result.sample.toFixed(2)}</td>
              <td>{result.blank.toFixed(2)}</td>
              <td>{result.positive.toFixed(2)}</td>
              <td>{result.positiveAdded.toFixed(2)}</td>
              <td>
                <Text
                  mode={mode}
                  text={
                    result.blank > 0
                      ? t('空白含目标，未通过', 'Target in blank; invalid')
                      : flow.frame === 0
                        ? t('尚未运行', 'Not yet run')
                        : result.controlsValid
                          ? t('本模型通过', 'Valid in model')
                          : t('未通过', 'Not valid')
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Feedback
        mode={mode}
        text={
          result.blank > 0
            ? t(
                '本模型空白已有目标，提示目标污染，对照不通过；即使阳性增加也不能把样本结果直接归于样本。现实空白异常还可能涉及非特异扩增，需调查来源。',
                'The model blank contains target, indicating target contamination and invalid controls. Even positive-control increase cannot establish sample origin. Real abnormal blanks can also involve non-specific amplification; investigate the source.',
              )
            : flow.frame === 0
              ? t(
                  '0轮还没有检验扩增：阳性2份是原有模板，不是新增产物。先逐步运行再看新增；抑制不会让模板消失。',
                  'At zero cycles amplification has not been tested: the positive’s two copies are starting templates, not new products. Step forward to inspect increase; inhibition does not delete templates.',
                )
              : !result.positiveAmplified
                ? t(
                    '阳性仍2份、新增0：共有抑制使扩增失败，却没有删除原有DNA。样本也保留起始目标份数；本次对照不通过，不能将现实未检出解释为不存在。',
                    'The positive remains at two copies with zero added: shared inhibition prevents amplification without deleting DNA. The sample also retains its starting copies. Controls fail, so a real non-detection cannot establish absence.',
                  )
                : template === 0
                  ? t(
                      '模型中没有起始目标，复制不能创造目标。现实未检出还可能因目标太少、取样未含目标或样本特有抑制；洁净对照也不能证明绝对不存在。',
                      'No starting target means copying cannot create it. A real non-detection can reflect little target, unsampled target or sample-specific inhibition; valid controls do not prove absolute absence.',
                    )
                  : t(
                      '比较100%与50%：从2份经4轮为32与10.125期望份。N=N₀(1+e)ⁿ只适用于本固定效率概念模型；PCR不改写DNA。',
                      'Compare 100% and 50%: two copies after four cycles give 32 and 10.125 expected copies. N=N₀(1+e)ⁿ belongs to this fixed-efficiency model; PCR does not rewrite DNA.',
                    )
        }
      />
      <details>
        <summary>
          <Text
            mode={mode}
            text={t(
              '完整静态过程与替代',
              'Complete static process and alternative',
            )}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '概念顺序：模板两链分开→引物结合→聚合酶延伸→新链也作模板。未给温度、时长或真实引物。2份模板理想0/1/2/3/4轮为2/4/8/16/32；共有抑制时为2/2/2/2/2份，新增始终0。阳性同样保留初始2份。0轮未验证扩增；运行后阳性新增且空白无目标才通过本模型对照，不等于现实检测概率。',
              'Conceptual order: strands separate → primers bind → polymerase extends → new strands become templates. No temperatures, timings or real primers are provided. Two ideal templates at cycles 0/1/2/3/4 yield 2/4/8/16/32; shared inhibition gives 2/2/2/2/2, adding zero. The positive likewise retains its initial two copies. Zero cycles do not verify amplification; after running, positive increase and a target-free blank pass the model controls, not a real detection-probability test.',
            )}
          />
        </p>
      </details>
    </>
  );
}
function GelLab({ mode, onExplore }: ExploreProps) {
  const [size, setSize] = useState(0),
    [evidence, setEvidence] = useState(0),
    [claim, setClaim] = useState(0);
  return (
    <>
      <Choices
        mode={mode}
        label={t('虚构样本片段', 'Fictional sample fragment')}
        values={[t('400 bp', '400 bp'), t('450 bp', '450 bp')]}
        value={size}
        setValue={(v) => {
          setSize(v);
          onExplore();
        }}
      />
      <Diagram id="L138" mode={mode} sample={size ? 450 : 400} />
      <Choices
        mode={mode}
        label={t('增加哪类证据？', 'Which evidence is available?')}
        values={[t('只有电泳', 'Gel only'), t('再给测序', 'Add sequence')]}
        value={evidence}
        setValue={(v) => {
          setEvidence(v);
          onExplore();
        }}
      />
      {evidence === 1 && (
        <p>
          <Text
            mode={mode}
            text={t(
              '虚构四碱基窗口：样本ATCG，参照AGCT，完整片段大小可相同。该窗口不是可执行靶标，也不是完整400 bp序列。',
              'Toy four-base window: sample ATCG, reference AGCT; full fragments may have equal size. This window is not an actionable target or a complete 400 bp sequence.',
            )}
          />
        </p>
      )}
      <Choices
        mode={mode}
        label={t(
          '选择本证据允许的结论',
          'Choose the claim this evidence permits',
        )}
        values={[
          t(
            '仅凭电泳：大小约相近；序列未确定',
            'Gel alone: approximately similar size; sequence undetermined',
          ),
          t('条带相近就是同一身份', 'Similar bands mean identical identity'),
          t(
            '给定窗口序列不同；不能代表全基因组',
            'Given windows differ; not whole-genome evidence',
          ),
        ]}
        value={claim}
        setValue={(v) => {
          setClaim(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          claim === 1
            ? t(
                '越界：大小不等于序列，更不等于身份或行为。回看底部两个不同四碱基片段；还应检查取样链、对照与测量误差。',
                'Overreach: size is not sequence, identity or behaviour. Compare the two distinct four-base windows, and check sample provenance, controls and measurement error.',
              )
            : claim === 2 && evidence === 0
              ? t(
                  '仅电泳没有碱基顺序证据。添加测序后才可比较给定窗口；不能从一条带读出ATCG。',
                  'A gel gives no base-order evidence. Add sequencing to compare the stated window; a band cannot reveal ATCG.',
                )
              : t(
                  '结论层次与证据相配。400与450 bp在示意坐标相距约7.2单位；实际分辨力/读数误差未给，不能凭画得分开就认定真实样本可区分。',
                  'Match the claim to the evidence layer. 400 and 450 bp differ by about 7.2 schematic units; real resolution and reading error are unspecified, so drawn separation does not prove distinguishability.',
                )
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '静态替代：1600/800/400/200/100 bp标记逐渐迁得更远；相同倍数的大小比在本对数示意上间隔相同。DNA从负极端向正极端迁移，条带不是单条DNA的照片。',
            'Static alternative: 1600/800/400/200/100 bp markers migrate progressively farther. Equal size ratios give equal spacing in this logarithmic schematic. DNA moves towards the positive pole; a band is not a photograph of one molecule.',
          )}
        />
      </p>
    </>
  );
}
function EditLab({ mode, onExplore }: ExploreProps) {
  const flow = useFrames(2, onExplore),
    [claim, setClaim] = useState(0);
  return (
    <>
      <Diagram id="L139" mode={mode} frame={flow.frame} />
      <Playback flow={flow} mode={mode} />
      <Choices
        mode={mode}
        label={t('选择产物报告', 'Choose a product report')}
        values={[
          t('测了20份，12份为预期产物', '20 assessed; 12 intended products'),
          t('100份中60份成功', '60 of 100 succeeded'),
          t(
            '靶位点正确，所以没有脱靶',
            'Correct target means no off-target changes',
          ),
        ]}
        value={claim}
        setValue={(v) => {
          setClaim(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          claim === 0
            ? t(
                '12/20=60%只描述已测子样本；5/20其他修复、3/20未改变。样本是否有代表性、80份未测和其他位点检查都限制推广。',
                '12/20=60% describes only assessed samples: 5/20 other repairs and 3/20 unchanged. Representativeness, 80 unassessed samples and other-site checks restrict generalisation.',
              )
            : claim === 1
              ? t(
                  '分母偷换：20份里12份，不是已知100份里60份。外推是附带取样假设的估计；这里未给随机取样。',
                  'Denominator switch: 12 of 20 is not an observed 60 of 100. Extrapolation requires sampling assumptions; random sampling was not specified.',
                )
              : t(
                  '靶位点序列不能检查未测的其他位点；“未观察到”也需说明方法覆盖范围和检出限。PCR复制与编辑改写是不同目的。',
                  'Target-site sequence cannot assess untested sites. “Not observed” needs coverage and detection limits. PCR copying and genome rewriting have different purposes.',
                )
        }
      />
      <details>
        <summary>
          <Text
            mode={mode}
            text={t('完整静态机制', 'Complete static mechanism')}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '靶向识别→此例工具切割→细胞修复→检测混合产物。并非所有编辑工具都切断双链，也并非都加入外源DNA。转基因强调引入外源遗传材料；编辑强调定点改变，二者范围可重叠。切割不指定唯一结局，改变序列不保证预期性状。',
              'Recognition → cutting by the tool illustrated here → cellular repair → assess mixed products. Not every editor makes double-strand breaks or adds foreign DNA. Transgenesis emphasises introduced genetic material; editing emphasises targeted change, and the categories may overlap. Cutting does not specify one outcome, and a sequence change does not guarantee a trait.',
            )}
          />
        </p>
      </details>
    </>
  );
}
function EthicsLab({ mode, onExplore }: ExploreProps) {
  const [policy, setPolicy] = useState(0),
    [basis, setBasis] = useState(0);
  return (
    <>
      <Diagram id="L140" mode={mode} />
      <Choices
        mode={mode}
        label={t(
          '你支持的研究决定（不按立场评分）',
          'Your research decision (no stance-based score)',
        )}
        values={[
          t('有条件继续封闭研究', 'Conditionally continue contained research'),
          t('暂缓扩大，先补证据', 'Pause expansion and gather evidence'),
        ]}
        value={policy}
        setValue={(v) => {
          setPolicy(v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('选择送交听证会的理由', 'Choose a hearing submission')}
        values={[
          t('有利就直接开放，不需再问', 'Benefit alone justifies release'),
          t(
            '事实+未知+受影响者+可修订条件',
            'Facts + unknowns + stakeholders + revision rule',
          ),
          t('有未知就能断定绝对有害', 'Unknown means certainly harmful'),
        ]}
        value={basis}
        setValue={(v) => {
          setBasis(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          basis === 1
            ? policy === 0
              ? t(
                  '可辩护：12/20只是样本事实；继续封闭研究可减少部分接触风险，但需独立检查、受影响社群知情参与、可及性安排与停止条件。新证据若提示基因外流风险，应重审。',
                  'Defensible: 12/20 is a sample fact. Contained research may limit some exposure, but needs independent checks, informed community participation, access provisions and stopping conditions. Evidence of escape risk should trigger review.',
                )
              : t(
                  '可辩护：生态长期影响未明，先补检查可优先避免难逆后果；也要承认推迟可能延后效益、增加成本。写明补什么证据、谁参与、何时重审，不能无限期用“未知”代替理由。',
                  'Defensible: uncertain long-term ecological effects can justify gathering evidence before expansion. Acknowledge delayed benefits and costs. Specify missing evidence, participation and a review date; uncertainty is not an indefinite substitute for reasons.',
                )
            : basis === 0
              ? t(
                  '效益证据不能独自决定公平、同意和生态承受程度。区分“观察到了什么”与“我们优先什么”，并回应反方最强理由。',
                  'Evidence of benefit alone cannot settle fairness, consent or ecological tolerance. Separate what was observed from what is prioritised, and address the strongest counterargument.',
                )
              : t(
                  '未知不等于已证明有害。谨慎立场也应给具体风险路径、获取证据的方法与重审条件；反对或支持都必须诚实描述证据。',
                  'Unknown does not mean proven harmful. Precaution also needs a plausible risk pathway, evidence-gathering and revision conditions; either position must describe evidence honestly.',
                )
        }
      />
      <label className="br-label">
        <Text
          mode={mode}
          text={t(
            '补一句：什么新证据会让你改变决定？',
            'Add: what new evidence would change your decision?',
          )}
        />
        <textarea onChange={onExplore} rows={3} />
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '自查：事实12/20；不确定80未测/生态长期影响；价值效益、公平、同意；治理独立审查、监督、停止与公开理由。HHS伦理原则是思考框架，不能当作此植物情境的法定许可。',
            'Self-check: fact 12/20; uncertainties 80 untested and long-term ecology; values benefit, fairness, consent; governance independent review, monitoring, stopping and public reasons. HHS principles inform reasoning; they are not legal permission for this plant scenario.',
          )}
        />
      </p>
    </>
  );
}
function QuestionLab({ mode, onExplore }: ExploreProps) {
  const [kind, setKind] = useState(0),
    [measure, setMeasure] = useState(0);
  return (
    <>
      <Diagram id="L141" mode={mode} />
      <Choices
        mode={mode}
        label={t('修研究目的', 'Repair the study purpose')}
        values={[
          t('描述A的变化', 'Describe change at A'),
          t('比较A与B同日记录', 'Compare A and B on matched days'),
          t('证明树使鸟变多', 'Prove trees cause more birds'),
        ]}
        value={kind}
        setValue={(v) => {
          setKind(v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('修测量与边界', 'Repair measurement and scope')}
        values={[
          t('所有地方的鸟很多', 'Many birds everywhere'),
          t(
            '两地点第1/3/7/10天，每5 min记录数',
            'Two sites, days 1/3/7/10, records per 5 min',
          ),
        ]}
        value={measure}
        setValue={(v) => {
          setMeasure(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          kind === 2
            ? t(
                '现有观察不能分离树量与食物、噪声、天气、发现概率。改为描述或比较仍是有效研究；因果要另设计，不能只加“为什么”。',
                'These observations cannot separate trees from food, noise, weather and detectability. Description or comparison is valid research; causality needs another design, not merely the word “why”.',
              )
            : measure === 0
              ? t(
                  '“很多”没有可复核单位或时期。把地点、日期、观察努力与记录指标写进问题；记录数不等于真实鸟总数。',
                  '“Many” has no reproducible unit or period. Specify sites, dates, observation effort and recorded metric; records are not a census.',
                )
              : kind === 0
                ? t(
                    '可回答：在这份虚构练习表中，A第1/3/10天每5 min记录数怎样变化？第7天缺失，不可填0；描述性问题不需强行操控变量。',
                    'Answerable: how did A’s fictional records per five minutes change on days 1/3/10? Day 7 is missing, not zero. A descriptive question need not manipulate a variable.',
                  )
                : t(
                    '可回答：在第1/3/10天相同5 min努力下，A与B记录数有何差异？先排除第7天的不同比较条件；一个地点/类型限制推广。',
                    'Answerable: how do A and B differ on days 1/3/10 at equal five-minute effort? Exclude day 7 from this comparison; one site per setting limits generalisation.',
                  )
        }
      />
      <label className="br-label">
        <Text
          mode={mode}
          text={t(
            '把同一规则迁移到你的官方数据/安全观察问题',
            'Transfer the rule to your official-data/safe-observation question',
          )}
        />
        <textarea rows={3} onChange={onExplore} />
      </label>
    </>
  );
}
function DataTable({ mode }: { mode: LanguageMode }) {
  return (
    <div
      className="br-table"
      tabIndex={0}
      role="region"
      aria-label={uiText(
        mode,
        t('虚构原始观察表', 'Fictional raw observations'),
      )}
    >
      <table>
        <thead>
          <tr>
            <th>
              <Text mode={mode} text={t('地点', 'Site')} />
            </th>
            <th>
              <Text mode={mode} text={t('第几天', 'Day')} />
            </th>
            <th>
              <Text mode={mode} text={t('记录数', 'Records')} />
            </th>
            <th>min</th>
          </tr>
        </thead>
        <tbody>
          {researchObservations.map((r) => (
            <tr key={r.site + r.day}>
              <td>{r.site}</td>
              <td>{r.day}</td>
              <td>{r.count ?? 'NA'}</td>
              <td>{r.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function DesignLab({ mode, onExplore }: ExploreProps) {
  const [effort, setEffort] = useState(0),
    [unit, setUnit] = useState(0);
  return (
    <>
      <Diagram id="L142" mode={mode} />
      <DataTable mode={mode} />
      <Choices
        mode={mode}
        label={t('选比较设计', 'Select a comparison design')}
        values={[
          t('直接比所有原始记录', 'Compare all raw records'),
          t(
            '只比同日同5 min的完整配对',
            'Use complete same-day five-minute pairs',
          ),
        ]}
        value={effort}
        setValue={(v) => {
          setEffort(v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('取样单位与重复', 'Sampling unit and replication')}
        values={[
          t('8行=8个独立地点', '8 rows = 8 independent sites'),
          t(
            '两地点重复访问，完整配对3个日期',
            'Two sites revisited; 3 complete paired dates',
          ),
        ]}
        value={unit}
        setValue={(v) => {
          setUnit(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          !effort
            ? t(
                'B第7天10 min记录8，其他5 min：多记录可能来自更长努力。A同日未访，NA不是0。不能把B8与A0当一对。',
                'B has eight records in ten minutes on day 7; other visits last five. More effort can produce more records. A was not visited, so NA is not zero; B8 and A0 are not a pair.',
              )
            : !unit
              ? t(
                  '重复访问同一地点没有增加独立地点数。可配对日期1/3/10，但日期也可能时间相关；不能把三对当三个独立生境重复。',
                  'Revisiting a site adds no independent sites. Days 1/3/10 can be paired, but dates may be temporally related; three pairs are not three independent habitat replicates.',
                )
              : t(
                  '修复后3个日期B-A均2记录/5 min；比较的是这两地点的记录，仍受天气、发现概率和一个地点/类型限制。新增多个独立地点及预定等努力访问可改善设计。',
                  'After repair, B−A is two records per five minutes on each of three dates. This compares records at two sites, still limited by weather, detectability and one site per setting. Add independent sites and planned equal-effort visits.',
                )
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '若选独立地点设计，须另采多个真正独立地点并记录每地点条件；本表不能凭切换按钮变成该设计。除以时间也不保证完全校正发现概率。',
            'An independent-site design requires additional genuinely independent sites and conditions; a button cannot transform this table into that design. Dividing by time does not fully correct detectability.',
          )}
        />
      </p>
    </>
  );
}
function AnalysisLab({ mode, onExplore }: ExploreProps) {
  const [equal, setEqual] = useState(1),
    [chart, setChart] = useState(0),
    [claim, setClaim] = useState(0);
  const a = summarise(eligibleObservations('A', !!equal).map((r) => r.count)),
    b = summarise(eligibleObservations('B', !!equal).map((r) => r.count));
  return (
    <>
      <Choices
        mode={mode}
        label={t('选择作图数据', 'Select plotted data')}
        values={[
          t('所有努力，标出10 min', 'All effort, flag 10 min'),
          t('只纳入5 min观察', 'Only five-minute observations'),
        ]}
        value={equal}
        setValue={(v) => {
          setEqual(v);
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('选择图形', 'Select chart')}
        values={[
          t('原始点，真实时间间隔', 'Raw points, actual time spacing'),
          t('均值柱图', 'Mean bars'),
        ]}
        value={chart}
        setValue={(v) => {
          setChart(v);
          onExplore();
        }}
      />
      <Diagram id="L143" mode={mode} raw={chart === 0} equalEffort={!!equal} />
      <DataTable mode={mode} />
      <p>
        <Text
          mode={mode}
          text={t(
            `A均值${a.mean}，n=${a.n}；B均值${b.mean}，n=${b.n}。A原表缺失1条；0是实际观察。A范围${a.range}，B范围${b.range}记录，不是置信区间。`,
            `A mean ${a.mean}, n=${a.n}; B mean ${b.mean}, n=${b.n}. A’s raw table has one missing record; zero was observed. A range ${a.range}, B range ${b.range} records; these are not confidence intervals.`,
          )}
        />
      </p>
      <Choices
        mode={mode}
        label={t('修正结论', 'Repair the conclusion')}
        values={[
          t('树使鸟显著翻倍', 'Trees significantly double birds'),
          t(
            '等努力完整日期中B记录较高；不能推因果',
            'B records are higher on complete equal-effort dates; no causal claim',
          ),
          t('缺失填0，数据更完整', 'Fill missing with zero for completeness'),
        ]}
        value={claim}
        setValue={(v) => {
          setClaim(v);
          onExplore();
        }}
      />
      <Feedback
        mode={mode}
        text={
          claim === 0
            ? t(
                '越界三次：没有分离树量效应；记录数不是总体鸟数；未进行适当推断分析，不能凭柱高说“显著”。回看原始点与研究单位。',
                'Three overreaches: tree effects were not isolated, records are not population abundance, and bar height alone establishes no statistical significance. Revisit raw points and sampling units.',
              )
            : claim === 2
              ? t(
                  'NA没有被观察；填0把未知变成“确实未记录到”。A(2+4+0)/3=2，错误填0后6/4=1.5，改变了分母与答案。',
                  'NA was not observed; zero asserts an actual non-detection. A is (2+4+0)/3=2; false zero-filling gives 6/4=1.5, changing both denominator and result.',
                )
              : t(
                  '有边界：3个同日5 min配对差均2记录/5 min；A均值2、B均值4，范围均4记录。时间相关、一个地点/类型和检测偏差限制推广；下一步增加地点与标准化访问。',
                  'Bounded: three same-day five-minute pairs each differ by two records/5 min. A mean 2, B mean 4; each range is four records. Temporal dependence, one site per setting and detectability limit generalisation; add sites and standardised visits.',
                )
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `静态替代：可比日期1/3/10，A为2/4/0、B为4/6/2；差${pairedDifferences()
              .map((r) => r.difference)
              .join(
                '/',
              )}。日期1到3相隔2天，3到10相隔7天，不能画成等时间距并解释速度。`,
            `Static alternative: comparable days 1/3/10, A=2/4/0, B=4/6/2; differences ${pairedDifferences()
              .map((r) => r.difference)
              .join(
                '/',
              )}. Days 1 to 3 are two days apart and 3 to 10 seven; equal spacing would misrepresent change rates.`,
          )}
        />
      </p>
    </>
  );
}
const honestAbstract =
  'We compared fictional bird records at sites A and B on three matched dates with five-minute visits. Mean records were 2 at A and 4 at B; each paired difference was 2 records per five minutes. One missed visit and a ten-minute visit were excluded from this comparison. These observations describe records at these two sites and do not establish a tree-cover effect or population density. More independent sites and consistent visits would improve the study.';
function CommunicationLab({ mode, onExplore }: ExploreProps) {
  const [abstract, setAbstract] = useState(honestAbstract),
    [draftKind, setDraftKind] = useState(0),
    [caption, setCaption] = useState(
      '虚构练习图：A/B第1、3、10天每5分钟记录数；原始点，A第7天缺失，B该日10分钟不纳入。Fictional practice: bird records per five-minute visit at A/B on days 1, 3 and 10; raw points. A day 7 is missing; B’s ten-minute visit is excluded.',
    ),
    [speed, setSpeed] = useState(105),
    [script, setScript] = useState('');
  const words = script.trim() ? script.trim().split(/\s+/).length : 0,
    duration = talkMinutes(words, speed);
  return (
    <>
      <Diagram id="L144" mode={mode} />
      <Choices
        mode={mode}
        label={t(
          '比较并选择摘要起点',
          'Compare and choose an abstract starting point',
        )}
        values={[
          t('放入含证据与局限的摘要', 'Insert an evidence-and-limits abstract'),
          t('审查过强摘要', 'Inspect an overstrong abstract'),
        ]}
        value={draftKind}
        setValue={(v) => {
          setDraftKind(v);
          setAbstract(
            v
              ? 'Trees double all bird populations. Our graph proves a significant causal effect everywhere.'
              : honestAbstract,
          );
          onExplore();
        }}
      />
      <label className="br-label">
        <Text
          mode={mode}
          text={t(
            '修订英文摘要：问题→数据→边界',
            'Revise the English abstract: question → data → scope',
          )}
        />
        <textarea
          lang="en"
          rows={7}
          value={abstract}
          onChange={(e) => {
            setAbstract(e.target.value);
            onExplore();
          }}
        />
      </label>
      <label className="br-label">
        <Text
          mode={mode}
          text={t('双语图注（可编辑）', 'Bilingual caption (editable)')}
        />
        <textarea
          rows={5}
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            onExplore();
          }}
        />
      </label>
      <details>
        <summary>
          <Text
            mode={mode}
            text={t(
              '核对与示范，不自动替你判科学',
              'Checklist and model; no automatic scientific grading',
            )}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '核对摘要是否有两地点、3个配对日期、5 min、均值2/4、记录而非总体鸟数、缺失与10 min排除、因果局限。图注中英必须表达同一边界。过强稿缺单位和样本，擅称显著、因果及到处适用；不能靠加入“可能”一个词修好。',
              'Check for two sites, three paired dates, five minutes, means 2/4, records rather than abundance, missing/ten-minute exclusions and causal limits. Both caption languages must convey the same scope. The overstrong draft lacks units and samples and invents significance, causality and universal scope; adding “possibly” alone cannot fix it.',
            )}
          />
        </p>
        <p lang="en">{honestAbstract}</p>
      </details>
      <label className="br-label">
        <Text
          mode={mode}
          text={t(
            '英文讲稿练习区；中文讲解可另写并实际计时',
            'English script practice; Chinese talks can be written separately and timed in rehearsal',
          )}
        />
        <textarea
          rows={5}
          value={script}
          onChange={(e) => {
            setScript(e.target.value);
            onExplore();
          }}
        />
      </label>
      <label className="br-label">
        <Text
          mode={mode}
          text={t(
            '估计英文语速（words/min）',
            'Estimated English pace (words/min)',
          )}
        />
        <input
          type="range"
          min="70"
          max="160"
          step="5"
          value={speed}
          onChange={(e) => {
            setSpeed(Number(e.target.value));
            onExplore();
          }}
        />
        {speed}
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            `英文空格分词估计${words}词，约${duration?.toFixed(1)}分钟。3–5分钟在此语速约${speed * 3}–${speed * 5}词；中文不按空格计词，图示停顿与问答需排练。`,
            `English space-separated estimate: ${words} words, about ${duration?.toFixed(1)} minutes. At this pace, 3–5 minutes is approximately ${speed * 3}–${speed * 5} words. This counter does not count Chinese words; rehearse pauses and questions.`,
          )}
        />
      </p>
      <Feedback
        mode={mode}
        text={t(
          '分镜建议：0–40秒问题和来源；40–100秒设计和单位；100–180秒图与数值；180–240秒推理、局限与下一步。按自己的语速调整，总时长不是科学质量分数。最终项目用官方公开数据或安全自录观察，课堂虚构表只供练习。',
          'Storyboard: 0–40 s question/source; 40–100 s design/units; 100–180 s chart/numbers; 180–240 s reasoning, limits and next steps. Adjust to your pace; duration is not a science-quality score. Use official public data or safe recorded observations for the final project; this fictional table is for practice.',
        )}
      />
    </>
  );
}
export function BiotechnologyResearchExplore(props: ExploreProps) {
  const Component = (
    {
      L137: PcrLab,
      L138: GelLab,
      L139: EditLab,
      L140: EthicsLab,
      L141: QuestionLab,
      L142: DesignLab,
      L143: AnalysisLab,
      L144: CommunicationLab,
    } as Record<string, typeof PcrLab>
  )[props.id];
  return (
    <div className="bio-s6-lab br-lab">
      <h3>
        <Text mode={props.mode} text={titles[props.id] ?? titles.L144} />
      </h3>
      <p>
        <Text
          mode={props.mode}
          text={t(
            '原创虚构练习；生物技术仅概念模拟。更改设置后比较证据与结论。',
            'Original fictional practice; biotechnology is conceptual only. Compare evidence and claims after changing settings.',
          )}
        />
      </p>
      {Component && <Component {...props} />}
    </div>
  );
}
