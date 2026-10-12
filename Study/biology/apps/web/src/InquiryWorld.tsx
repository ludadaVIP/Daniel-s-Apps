import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  fairTestIssues,
  seedlingRecords,
  summariseGrowth,
  type FairPlan,
} from './models';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const green = '#708a58',
  blue = '#608b9b',
  gold = '#b59a52';
export function NotebookPlant({
  height = 7,
  pale = false,
}: {
  height?: number;
  pale?: boolean;
}) {
  const top = 240 - height * 8;
  return (
    <g>
      <path d={`M120 240V${top}`} stroke={green} strokeWidth="4" fill="none" />
      <path
        d={`M120 ${top + 17}q-34-26-42-9q4 25 42 9M120 ${top + 35}q34-26 42-9q-4 25-42 9`}
        fill={pale ? '#e2d69a' : '#a8c28f'}
        stroke={green}
      />
      <circle cx="120" cy={top} r="3" fill={green} />
      <path
        d="M82 240h76l-9 48h-58Z"
        fill="#dcc9ab"
        stroke={gold}
        strokeWidth="2"
      />
      <path d="M83 241h74" stroke="#917f60" strokeWidth="5" />
    </g>
  );
}
function MeasuredPlant({
  height = 4,
  pale = false,
  mode,
}: {
  height?: number;
  pale?: boolean;
  mode: LanguageMode;
}) {
  return (
    <>
      <NotebookPlant height={height} pale={pale} />
      <path d="M202 136v104h-9" stroke={blue} fill="none" strokeWidth="2" />
      {[0, 4, 8, 12].map((n) => (
        <g key={n}>
          <path d={`M196 ${240 - n * 8}h6`} stroke={blue} />
          <text x="215" y={245 - n * 8} fill={blue} fontSize="14">
            {n}
          </text>
        </g>
      ))}
      <path
        d={`M125 ${240 - height * 8}H190`}
        stroke={gold}
        strokeDasharray="4 4"
      />
      <text x="118" y="315" textAnchor="middle" fontSize="16" fill={green}>
        {height} cm
      </text>
      <text x="120" y="335" textAnchor="middle" fontSize="12" fill={green}>
        {word(mode, t('土面→茎顶', 'Soil → stem tip'))}
      </text>
    </>
  );
}
function PairedPlants({ mode }: { mode: LanguageMode }) {
  return (
    <>
      <g transform="translate(-25 0)">
        <NotebookPlant />
        <circle cx="120" cy="60" r="18" fill="#e2d7aa" />
        <text x="120" y="105" textAnchor="middle" fontSize="15">
          {word(mode, t('A 较弱光', 'A Weaker light'))}
        </text>
      </g>
      <g transform="translate(220 0)">
        <NotebookPlant />
        <circle cx="120" cy="60" r="25" fill="#e8cf7e" />
        <text x="120" y="105" textAnchor="middle" fontSize="15">
          {word(mode, t('B 较强光', 'B Stronger light'))}
        </text>
      </g>
      <text x="225" y="325" textAnchor="middle" fontSize="14" fill={green}>
        {word(
          mode,
          t('方案示意；没有预测结果', 'Plan only; no predicted outcome'),
        )}
      </text>
    </>
  );
}
export function GrowthChart({
  mode,
  mean = false,
}: {
  mode: LanguageMode;
  mean?: boolean;
}) {
  const groups = ['weak', 'strong'] as const;
  return (
    <svg
      viewBox="0 0 500 320"
      role="img"
      aria-label={word(
        mode,
        t(
          '虚拟幼苗7天茎高度增量；弱光6、7、8，较强光3、4、5厘米；均值7和4',
          'Fictional seven-day stem-height gains: weaker light 6, 7, 8; stronger light 3, 4, 5 cm; means 7 and 4',
        ),
      )}
    >
      <text x="60" y="25" fontSize="16" fill={green}>
        {word(mode, t('7天茎高度增量（cm）', '7-day stem-height gain (cm)'))}
      </text>
      {[0, 2, 4, 6, 8, 10].map((n) => (
        <g key={n}>
          <path d={`M60 ${255 - n * 20}h400`} stroke="#dce2d3" />
          <text
            x="48"
            y={260 - n * 20}
            textAnchor="end"
            fontSize="14"
            fill={green}
          >
            {n}
          </text>
        </g>
      ))}
      <path d="M60 55v200h400" fill="none" stroke={green} />
      {groups.map((group, g) => {
        const rows = seedlingRecords.filter((r) => r.group === group),
          stats = summariseGrowth(rows),
          x = 100 + g * 200;
        return (
          <g key={group}>
            {mean ? (
              <g>
                <rect
                  x={x + 35}
                  y={255 - stats.mean! * 20}
                  width="58"
                  height={stats.mean! * 20}
                  rx="3"
                  fill={g === 0 ? gold : blue}
                />
                <text
                  x={x + 64}
                  y={247 - stats.mean! * 20}
                  textAnchor="middle"
                  fontSize="17"
                  fill={green}
                >
                  {stats.mean}
                </text>
                <text x={x + 64} y="277" textAnchor="middle" fontSize="12">
                  {word(mode, t('平均 · n=3', 'Mean · n=3'))}
                </text>
              </g>
            ) : (
              rows.map((r, i) => (
                <g key={r.id}>
                  <rect
                    x={x + i * 44}
                    y={255 - (r.end - r.start) * 20}
                    width="30"
                    height={(r.end - r.start) * 20}
                    fill={g === 0 ? gold : blue}
                    rx="3"
                  />
                  <text
                    x={x + i * 44 + 15}
                    y={247 - (r.end - r.start) * 20}
                    textAnchor="middle"
                    fontSize="16"
                  >
                    {r.end - r.start}
                  </text>
                  <text
                    x={x + i * 44 + 15}
                    y="277"
                    textAnchor="middle"
                    fontSize="13"
                  >
                    {r.id}
                  </text>
                </g>
              ))
            )}
            <text
              x={x + 60}
              y="305"
              textAnchor="middle"
              fontSize="15"
              fill={green}
            >
              {word(
                mode,
                g === 0
                  ? t('A 较弱光', 'A Weaker light')
                  : t('B 较强光', 'B Stronger light'),
              )}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
const clues: Record<string, LocalizedText[]> = {
  L021: [
    t(
      '记录：A2第0天4 cm、第7天11 cm，方法是土面至茎顶。',
      'Record: A2 measured 4 cm on day 0 and 11 cm on day 7, from soil to stem tip.',
    ),
    t(
      '解释：“低光可能促使茎伸长”需要检验；不是尺子直接读出的原因。',
      'Interpret: “Low light may promote elongation” needs testing; a ruler does not directly read a cause.',
    ),
    t(
      '检验：比较光照，核对水、品种与温度，寻找能支持或挑战解释的记录。',
      'Test: compare light, checking water, variety and temperature. Seek records that support or challenge the explanation.',
    ),
  ],
  L022: [
    t(
      '改变：本次改变光照强度，照射时长尽量一致。',
      'Change: vary light intensity while keeping exposure duration similar.',
    ),
    t(
      '测量：7天高度增量=末次高度−初始高度，同一单位与方法。',
      'Measure: seven-day height gain = final − initial height, using the same unit and method.',
    ),
    t(
      '控制：其他相关条件尽量一致；用重复和随机分组减少偶然差异与挑选偏差。',
      'Control: make other relevant conditions similar; replication and random assignment reduce chance differences and selection bias.',
    ),
  ],
  L023: [
    t(
      '原始值：六个柱对应六株，颜色代表光照组，不代表健康。',
      'Raw values: six bars represent six plants; colour marks light group, not health.',
    ),
    t(
      '平均：弱光(6+7+8)÷3=7 cm；较强光(3+4+5)÷3=4 cm。',
      'Means: weaker light (6+7+8)/3=7 cm; stronger light (3+4+5)/3=4 cm.',
    ),
    t(
      '范围：图只测这些虚拟幼苗7天茎高度增量，没有测健康或制糖。',
      'Scope: the chart measures seven-day stem-height gain in these fictional seedlings, not health or sugar production.',
    ),
  ],
  L024: [
    t(
      '主张：本例弱光组平均高度增量较大。不要把高度换成健康。',
      'Claim: mean height gain is greater in the weaker-light group here. Do not substitute health for height.',
    ),
    t(
      '证据：平均7与4 cm；另有叶色与茎形态记录。两类记录回答不同问题。',
      'Evidence: mean gains of 7 and 4 cm, plus leaf-colour and stem-form records. The records address different questions.',
    ),
    t(
      '局限：每组3株、7天，虚拟数据；还需定义健康指标并收集相关记录。',
      'Limits: three plants per group, seven days, fictional data. Define health indicators and gather relevant records.',
    ),
  ],
};
export function InquiryDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    labels =
      id === 'L021'
        ? [t('记录', 'Record'), t('解释', 'Interpret'), t('检验', 'Test')]
        : id === 'L022'
          ? [t('改变', 'Change'), t('测量', 'Measure'), t('控制', 'Control')]
          : id === 'L023'
            ? [t('原始值', 'Raw values'), t('平均', 'Mean'), t('范围', 'Scope')]
            : [t('主张', 'Claim'), t('证据', 'Evidence'), t('局限', 'Limits')];
  return (
    <figure className="bio-diagram bio-inquiry-diagram">
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('窗台调查站', 'WINDOWSILL INVESTIGATION')} />
      </span>
      {id === 'L023' ? (
        <GrowthChart mode={mode} mean={clue === 1} />
      ) : (
        <svg
          viewBox="0 0 450 350"
          role="img"
          aria-label={word(
            mode,
            t(
              '幼苗、尺子与比较方案原创示意',
              'Original seedling, ruler or comparison schematic',
            ),
          )}
        >
          {id === 'L022' ? (
            <PairedPlants mode={mode} />
          ) : (
            <g transform="translate(75 0)">
              <MeasuredPlant
                mode={mode}
                height={id === 'L021' && clue === 0 ? 4 : 11}
                pale={id === 'L024'}
              />
            </g>
          )}
        </svg>
      )}
      <div className="bio-choice-row bio-inquiry-choices">
        {labels.map((label, i) => (
          <button key={i} aria-pressed={clue === i} onClick={() => setClue(i)}>
            <Text mode={mode} text={label} />
          </button>
        ))}
      </div>
      <figcaption aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
        <small>
          <Text
            mode={mode}
            text={t(
              '原创示意，非按比例；所有幼苗记录为虚拟教学数据。',
              'Original schematic, not to scale; all seedling records are fictional teaching data.',
            )}
          />
        </small>
      </figcaption>
    </figure>
  );
}
export function InquiryHookArt({ mode }: { id: string; mode: LanguageMode }) {
  return (
    <svg
      viewBox="0 0 450 350"
      role="img"
      aria-label={word(
        mode,
        t('幼苗与研究笔记插图', 'Seedling investigation illustration'),
      )}
    >
      <g transform="translate(20 0)">
        <NotebookPlant height={9} />
      </g>
      <rect
        x="245"
        y="115"
        width="150"
        height="170"
        rx="12"
        fill="#f3eedc"
        stroke={gold}
      />
      {[150, 180, 210, 240].map((y) => (
        <path key={y} d={`M268 ${y}h102`} stroke="#b7c5ad" strokeWidth="3" />
      ))}
      <path d="m285 117 41-34 7 9-41 34" fill={gold} />
      <text x="320" y="265" textAnchor="middle" fill={green} fontSize="18">
        ?
      </text>
    </svg>
  );
}
function Notes({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字版与模型说明', 'Text version & model notes')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
function FrameText({
  mode,
  text,
}: {
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <p className="bio-frame-caption" aria-live="polite">
      <Text mode={mode} text={text} />
    </p>
  );
}
const observationCards = [
  {
    text: t(
      '第7天从土面量至茎顶为11 cm',
      'Day-7 height from soil to stem tip is 11 cm',
    ),
    observation: true,
    why: t(
      '这是带时间、方法和单位的尺读数。',
      'This is a ruler reading with time, method and unit.',
    ),
  },
  {
    text: t(
      '第7天图像中叶色比第0天浅',
      'Leaves look paler in the day-7 image than on day 0',
    ),
    observation: true,
    why: t(
      '这是颜色观察；比较时仍需一致拍摄条件。',
      'This is a colour observation; photographing conditions still need to be consistent.',
    ),
  },
  {
    text: t('低光可能使茎伸长', 'Low light may cause stem elongation'),
    observation: false,
    why: t(
      '这连接现象与可能原因，需要进一步比较。',
      'This connects a pattern with a possible cause requiring further comparison.',
    ),
  },
  {
    text: t(
      '这株苗比所有矮苗更健康',
      'This seedling is healthier than all shorter seedlings',
    ),
    observation: false,
    why: t(
      '这超出了高度记录；还没有测所有矮苗或定义健康。',
      'This exceeds the height record: health is undefined and all shorter seedlings were not measured.',
    ),
  },
];
export function InquiryExplore(props: Props) {
  return (
    <div data-resource-id={`${props.id}-I01`}>
      {props.id === 'L021' ? (
        <ObservationLab {...props} />
      ) : props.id === 'L022' ? (
        <FairTestLab {...props} />
      ) : props.id === 'L023' ? (
        <DataLab {...props} />
      ) : (
        <EvidenceLab {...props} />
      )}
    </div>
  );
}
function ObservationLab({ mode, onExplore }: Props) {
  const flow = useFrames(3, onExplore),
    [card, setCard] = useState(0),
    [guess, setGuess] = useState<boolean | null>(null);
  const texts = [
    t(
      '第0天：同一方法记录A2茎高4 cm。',
      'Day 0: A2 stem height is recorded as 4 cm using a fixed method.',
    ),
    t(
      '第7天：记录11 cm；增量是11−4=7 cm。读数和增量都不是健康分数。',
      'Day 7: 11 cm is recorded; gain is 11−4=7 cm. Neither reading is a health score.',
    ),
    t(
      '还有叶色线索：图示较浅。先记录，再核对拍摄与生长条件。',
      'Another clue: leaves are depicted as paler. Record it, then check photographing and growing conditions.',
    ),
    t(
      '提出可检验问题：两种光照下，其他重要条件相近时，高度增量怎样不同？',
      'Ask a testable question: under two light intensities with similar important conditions, how does height gain differ?',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('把笔记分成两种', 'Two kinds of notebook statements')}
        />
      </h3>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 360 350"
          role="img"
          aria-label={word(
            mode,
            t('A2幼苗与高度读数', 'A2 seedling and height reading'),
          )}
        >
          <g transform="translate(40 0)">
            <MeasuredPlant
              mode={mode}
              height={flow.frame === 0 ? 4 : 11}
              pale={flow.frame >= 2}
            />
          </g>
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={texts[flow.frame]!} />
      <div className="bio-choice-row bio-inquiry-choices">
        {observationCards.map((c, i) => (
          <button
            key={i}
            aria-pressed={card === i}
            onClick={() => {
              setCard(i);
              setGuess(null);
              onExplore();
            }}
          >
            <Text mode={mode} text={c.text} />
          </button>
        ))}
      </div>
      <div className="bio-choice-row bio-inquiry-choices">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            aria-pressed={guess === v}
            onClick={() => {
              setGuess(v);
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                v
                  ? t('这是观察', 'Observation')
                  : t('这是解释或判断', 'Interpretation or judgement')
              }
            />
          </button>
        ))}
      </div>
      {guess !== null && (
        <p className="bio-inquiry-result" role="status">
          <Text
            mode={mode}
            text={
              guess === observationCards[card]!.observation
                ? t('分类合适。', 'Good classification.')
                : t(
                    '再核对它是在记录现象，还是解释原因。',
                    'Check whether it records a phenomenon or interprets a cause.',
                  )
            }
          />
          <Text mode={mode} text={observationCards[card]!.why} />
        </p>
      )}
      <Notes
        mode={mode}
        text={t(
          'A2的4与11 cm为虚拟记录；示意不代表真实生长用时。观察包含定量与定性信息。解释可以被支持、挑战或修正。',
          'A2’s 4 and 11 cm are fictional records. Playback does not model real timing. Observations include quantitative and qualitative information; explanations may be supported, challenged or revised.',
        )}
      />
    </>
  );
}
const factors = {
  water: t('水分方案', 'Watering plan'),
  variety: t('品种与起始状态', 'Variety & starting condition'),
  temperature: t('温度', 'Temperature'),
};
export function FairTestLab({ mode, onExplore }: Omit<Props, 'id'>) {
  const [plan, setPlan] = useState<FairPlan>({
      water: false,
      variety: false,
      temperature: false,
    }),
    flow = useFrames(3, onExplore),
    issues = fairTestIssues(plan);
  const texts = [
    t(
      '问题：比较两种光照强度与7天茎高度增量。花盆、土、时长与测量方法已约定相同。',
      'Question: compare two light intensities and seven-day stem-height gain. Pots, soil, duration and measurement method are agreed to be similar.',
    ),
    t(
      '找混杂：水分方案、品种或温度若也随组别改变，光的影响难以分离。点击卡片修正。',
      'Find confounding: if watering, variety or temperature also changes with group, the light effect is hard to isolate. Select cards to repair the plan.',
    ),
    issues.length
      ? t(
          '还有列出的混杂因素需要修正。相同浇水量不保证相同土壤水分，还要监测。',
          'Listed confounders remain. Equal watering volume does not guarantee equal soil moisture; monitor it too.',
        )
      : t(
          '已对齐列出的三个因素。光照强度仍不同；结果尚未测量，不可预填。',
          'The three listed factors are aligned. Light intensity still differs; outcomes have not been measured and must not be prefilled.',
        ),
    t(
      '重复：每组多株相近幼苗，随机分组，同一方法量初始与末次高度。更公平不保证没有误差。',
      'Replicate with several similar seedlings per group, assign randomly, and measure initial and final heights consistently. A fairer plan does not eliminate error.',
    ),
  ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('修理一个公平比较方案', 'Repair a fair comparison plan')}
        />
      </h3>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 450 350"
          role="img"
          aria-label={word(
            mode,
            t(
              '光照不同、其他条件待修正的两组方案',
              'Two light groups with other conditions to repair',
            ),
          )}
        >
          <PairedPlants mode={mode} />
        </svg>
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            '点击卡片切换“不同 / 已对齐”。目标光照保持不同。',
            'Select a card to toggle Different / Aligned. Target light stays different.',
          )}
        />
      </p>
      <div className="bio-inquiry-factors">
        {(Object.keys(factors) as (keyof FairPlan)[]).map((key) => (
          <button
            key={key}
            aria-pressed={plan[key]}
            onClick={() => {
              setPlan((p) => ({ ...p, [key]: !p[key] }));
              onExplore();
            }}
          >
            <Text mode={mode} text={factors[key]} />
            <strong>
              <Text
                mode={mode}
                text={
                  plan[key]
                    ? t('✓ 已对齐', '✓ Aligned')
                    : t('! 随组别不同', '! Different by group')
                }
              />
            </strong>
            <small>
              <Text
                mode={mode}
                text={
                  key === 'water'
                    ? plan.water
                      ? t(
                          '相同计划，监测土壤水分',
                          'Same plan; monitor soil moisture',
                        )
                      : t(
                          'A少、B多，水也变化',
                          'A less, B more; water also changes',
                        )
                    : key === 'variety'
                      ? plan.variety
                        ? t(
                            '同品种、年龄与起始状态相近',
                            'Same variety, similar age and start',
                          )
                        : t(
                            'A与B不同品种与年龄',
                            'Different varieties and ages',
                          )
                      : plan.temperature
                        ? t(
                            '同温度目标，核对实际条件',
                            'Same target; check actual conditions',
                          )
                        : t('A较冷、B较暖', 'A cooler, B warmer')
                }
              />
            </small>
          </button>
        ))}
      </div>
      <p className="bio-inquiry-result" aria-live="polite">
        <Text
          mode={mode}
          text={
            issues.length
              ? t(
                  `还有${issues.length}个列出的混杂。`,
                  `Listed confounders remaining: ${issues.length}.`,
                )
              : t(
                  '列出的混杂已修正；还需重复、测量和核对真实条件。',
                  'Listed confounders repaired; replication, measurement and real-condition checks remain.',
                )
          }
        />
      </p>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={texts[flow.frame]!} />
      <Notes
        mode={mode}
        text={t(
          '这只是试验设计，没有模拟结果或给出照料建议。改光照强度、保持照射时长一致；每组多株相近幼苗随机分组。控制重要条件并监测；3株只是小样本例子。实际窗台光照与温度可能一起变化。',
          'This is a design exercise, without simulated results or plant-care advice. Vary light intensity with similar exposure duration; randomly assign several similar seedlings per group. Control and monitor important conditions. Three plants are only a small sample example; windowsill light and temperature may vary together.',
        )}
      />
    </>
  );
}
function Records({ mode }: { mode: LanguageMode }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t(
            '原始记录表（虚拟数据）',
            'Raw record table (fictional data)',
          )}
        />
      </summary>
      <table className="bio-inquiry-table">
        <caption>
          <Text
            mode={mode}
            text={t(
              '单位cm；第0天→第7天，土面至茎顶',
              'cm; day 0 → day 7, soil to stem tip',
            )}
          />
        </caption>
        <thead>
          <tr>
            {[
              t('幼苗', 'Plant'),
              t('初始', 'Initial'),
              t('末次', 'Final'),
              t('增量', 'Gain'),
            ].map((v, i) => (
              <th key={i} scope="col">
                <Text mode={mode} text={v} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seedlingRecords.map((r) => (
            <tr key={r.id}>
              <th scope="row">{r.id}</th>
              <td>{r.start}</td>
              <td>{r.end}</td>
              <td>{r.end - r.start}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Text
          mode={mode}
          text={t(
            'A=较弱光，B=较强光，每组3株；同品种与年龄、相近起始状态，随机分组。重要条件按公平方案监测。数字不预测真实生长。',
            'A=weaker light, B=stronger light; three plants per group, same variety and age, similar starting condition, random assignment. Important conditions are monitored as planned. Values do not predict real growth.',
          )}
        />
      </p>
    </details>
  );
}
function DataLab({ mode, onExplore }: Props) {
  const flow = useFrames(3, onExplore),
    [mean, setMean] = useState(false),
    texts = [
      t(
        '测量定义：高度增量=第7天高度−第0天高度，单位cm。横轴为组别，不是时间。',
        'Definition: gain = day-7 minus day-0 height, in cm. The horizontal axis shows groups, not time.',
      ),
      t(
        '原始差异：A组6、7、8；B组3、4、5。不要把不同个体删掉。',
        'Raw variation: A has 6, 7, 8; B has 3, 4, 5. Retain different individual records.',
      ),
      t(
        '平均：A为7 cm，B为4 cm；每组n=3。切换图形，看看平均省略了什么。',
        'Means: A=7 cm, B=4 cm; n=3 each. Toggle the chart to inspect what averages omit.',
      ),
      t(
        '范围：本图只描述7天茎高度增量，没有测整体健康、质量或制糖。',
        'Scope: the graph describes seven-day stem-height gain, not overall health, mass or sugar production.',
      ),
    ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('六个数，两种看法', 'Six values, two views')}
        />
      </h3>
      <div className="bio-choice-row bio-inquiry-choices">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            aria-pressed={mean === v}
            onClick={() => {
              setMean(v);
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                v ? t('组平均', 'Group means') : t('每株记录', 'Each seedling')
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-micro-window bio-inquiry-chart">
        <GrowthChart mode={mode} mean={mean} />
      </div>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={texts[flow.frame]!} />
      <Records mode={mode} />
      <Notes
        mode={mode}
        text={t(
          '纵轴共用0–10 cm尺度，柱高只表示高度增量。平均由原始表计算；没有误差线或统计显著性结论。只有两个时间读数，不能由图推断每天增长速度。',
          'Both groups share a 0–10 cm scale. Bar height only means height gain. Means are calculated from raw records; no error bars or statistical-significance claims are provided. Two time readings cannot establish daily growth rates.',
        )}
      />
    </>
  );
}
function EvidenceLab({ mode, onExplore }: Props) {
  const flow = useFrames(3, onExplore),
    [colour, setColour] = useState(false),
    texts = [
      t(
        '主张先收窄：本例7天内，弱光组平均茎高度增量较大。',
        'Scope the claim: in this example, weaker-light seedlings had greater mean stem-height gain over seven days.',
      ),
      t(
        '数字证据：7与4 cm。它没有直接测健康或光合作用。',
        'Numerical evidence: 7 versus 4 cm. Neither directly measures health or photosynthesis.',
      ),
      colour
        ? t(
            '新线索：弱光组较浅、细长，较强光组较绿。部分幼苗弱光下会伸长，高度不等于整体健康；颜色也有其他影响因素。',
            'New clues: weaker-light plants are paler and slender; stronger-light plants greener. Some seedlings elongate in low light. Height is not overall health; colour also has other influences.',
          )
        : t(
            '只看高度还不能评整体健康。点击“加入叶色记录”，再考虑需要修正什么。',
            'Height alone cannot assess overall health. Add leaf-colour records, then consider what needs revising.',
          ),
      t(
        '下一步：定义要比较的状态，增加重复和观察时长，收集叶数、颜色等相关指标并核对条件。',
        'Next: define the condition to compare, add replicates and observation time, gather relevant indicators such as leaf number and colour, and check conditions.',
      ),
    ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('让结论跟着证据走', 'Let evidence shape the conclusion')}
        />
      </h3>
      <div className="bio-choice-row bio-inquiry-choices">
        <button
          aria-pressed={!colour}
          onClick={() => {
            setColour(false);
            onExplore();
          }}
        >
          <Text mode={mode} text={t('只看高度', 'Height only')} />
        </button>
        <button
          aria-pressed={colour}
          onClick={() => {
            setColour(true);
            onExplore();
          }}
        >
          <Text
            mode={mode}
            text={t('加入叶色记录', 'Add leaf-colour records')}
          />
        </button>
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 450 350"
          role="img"
          aria-label={word(
            mode,
            colour
              ? t(
                  '虚拟弱光幼苗较高而叶色较浅；较强光幼苗较矮且较绿',
                  'Fictional weaker-light seedlings taller and paler; stronger-light seedlings shorter and greener',
                )
              : t(
                  '虚拟两组幼苗高度对照，颜色信息尚未揭示',
                  'Fictional seedling-height comparison without colour information',
                ),
          )}
        >
          <g transform="translate(-25 0)">
            <NotebookPlant height={11} pale={colour} />
            <text x="120" y="65" textAnchor="middle" fontSize="15">
              {word(mode, t('A 较弱光', 'A Weaker light'))}
            </text>
            <text x="120" y="315" textAnchor="middle" fontSize="14">
              {word(mode, t('平均增量7 cm', 'Mean gain 7 cm'))}
            </text>
          </g>
          <g transform="translate(220 0)">
            <NotebookPlant height={8} />
            <text x="120" y="65" textAnchor="middle" fontSize="15">
              {word(mode, t('B 较强光', 'B Stronger light'))}
            </text>
            <text x="120" y="315" textAnchor="middle" fontSize="14">
              {word(mode, t('平均增量4 cm', 'Mean gain 4 cm'))}
            </text>
          </g>
        </svg>
      </div>
      <p className="bio-inquiry-result" aria-live="polite">
        <Text
          mode={mode}
          text={
            colour
              ? t(
                  '叶色为定性记录，需一致拍摄条件；不是新的高度或健康数字。',
                  'Leaf colour is a qualitative record requiring consistent photography, not another height or health score.',
                )
              : t(
                  '图中统一绿色只是占位，没有揭示叶色记录；不能当成实际观察。',
                  'Matching green is a placeholder before colour records are revealed, not an observation.',
                )
          }
        />
      </p>
      <Playback flow={flow} mode={mode} />
      <FrameText mode={mode} text={texts[flow.frame]!} />
      <Records mode={mode} />
      <Notes
        mode={mode}
        text={t(
          '原创虚拟数据与代表性示意，不是实际试验照片。弱光可使部分幼苗细长，但不能仅凭颜色确定原因。种子储备支持早期生长；茎伸长不等于制糖多。每组3株、7天，尚未测整体健康。',
          'Authored fictional data and representative schematics, not real trial photographs. Low light can make some seedlings spindly, but colour alone does not establish a cause. Seed reserves support early growth; elongation does not establish more sugar production. Three plants per group, seven days; overall health unmeasured.',
        )}
      />
    </>
  );
}
