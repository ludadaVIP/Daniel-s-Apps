import { Link } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { t } from './content/schema';
import { ProjectReport } from './ProjectReport';
import {
  emptyMaterials,
  emptyMaterial,
  emptyMaterialTrial,
  materialPlanFields,
  materialSampleFields,
  MATERIAL_IDS,
  MAX_MATERIAL_TRIALS,
  materialReferences,
  materialSummary,
  materialsState,
  materialFormat,
  materialNumber,
  referenceDifference,
  materialsHasData,
  materialsMarkdown,
  type MaterialsDraft,
  type MaterialSpecimen,
  type MaterialTrial,
  type MaterialReadingKey,
} from './materials';
type Props = { mode: LanguageMode; store: ProgressStore };
const steps = [
  t('准备调查', 'Prepare'),
  t('保留读数', 'Readings'),
  t('材料线索', 'Clues'),
  t('解释与疑问', 'Explain'),
];
const readings: Record<MaterialReadingKey, LocalizedText> = {
  mass: t('干燥质量m（g）', 'Dry mass m (g)'),
  length: t('长（cm）', 'Length (cm)'),
  width: t('宽（cm）', 'Width (cm)'),
  height: t('高（cm）', 'Height (cm)'),
  before: t('初始水位（mL）', 'Initial water (mL)'),
  after: t('末水位（mL）', 'Final water (mL)'),
};
function CaseArt({ mode }: { mode: LanguageMode }) {
  return (
    <div className="phy-materials-art" aria-hidden="true">
      <svg viewBox="0 0 360 110">
        <path d="M20 76h320" stroke="#d8cddf" strokeDasharray="3 6" />
        <path d="M39 30l22-13 33 13-22 13Z" fill="#c4b8ce" />
        <path d="M39 30v36l33 13V43Z" fill="#af9bbe" />
        <path d="M72 43l22-13v36L72 79Z" fill="#947ca7" />
        <path
          d="M132 20v59h46V20"
          fill="none"
          stroke="#a08aaa"
          strokeWidth="2"
        />
        <path d="M134 48h42v29h-42" fill="#c3dbdf" />
        <path d="M147 39l13-5 10 10-6 17-17-3Z" fill="#b5a8c1" />
        <path d="M227 36h76v37h-76Z" fill="#f4eff8" stroke="#b8a5c8" />
        <text x="265" y="59" textAnchor="middle">
          m / V
        </text>
        <text x="65" y="102" textAnchor="middle">
          m
        </text>
        <text x="155" y="102" textAnchor="middle">
          V
        </text>
        <text x="265" y="102" textAnchor="middle">
          ρ → ?
        </text>
      </svg>
      <p>
        <B
          zh="失去标签，留下证据。"
          en="Missing label. Remaining evidence."
          mode={mode}
        />
      </p>
    </div>
  );
}
function ReferenceBook({
  mode,
  density,
}: {
  mode: LanguageMode;
  density?: number;
}) {
  return (
    <div className="phy-materials-references">
      {materialReferences.map((ref) => (
        <div key={ref.id}>
          <svg viewBox="0 0 80 58" aria-hidden="true">
            <path d="M15 21l18-11 33 12-18 11Z" fill={ref.color} opacity=".7" />
            <path d="M15 21v22l33 11V33Z" fill={ref.color} />
            <path d="M48 33l18-11v22L48 54Z" fill={ref.color} opacity=".85" />
          </svg>
          <strong>
            <Text value={ref.name} mode={mode} />
          </strong>
          <span>{ref.density.toFixed(2)} g/cm³</span>
          <small>
            <B
              zh="与你的汇总相差"
              en="Relative difference from yours"
              mode={mode}
            />
          </small>
          <b>
            {materialFormat(referenceDifference(density, ref.density))}
            {density !== undefined ? '%' : ''}
          </b>
        </div>
      ))}
    </div>
  );
}
export function MaterialsProject({ mode, store }: Props) {
  const draft = store.progress.materialsProject ?? emptyMaterials(),
    state = materialsState(draft);
  const specimen =
    draft.specimens.find((s) => s.id === draft.activeId) ?? draft.specimens[0]!;
  const summary = materialSummary(specimen),
    step = draft.step;
  const update = (change: (old: MaterialsDraft) => MaterialsDraft) =>
    store.update((old) => ({
      ...old,
      materialsProject: {
        ...change(old.materialsProject ?? emptyMaterials()),
        updatedAt: Date.now(),
      },
    }));
  const patchSample = (change: (old: MaterialSpecimen) => MaterialSpecimen) =>
    update((old) => ({
      ...old,
      specimens: old.specimens.map((s) =>
        s.id === specimen.id ? change(s) : s,
      ),
    }));
  const patchTrial = (index: number, patch: Partial<MaterialTrial>) =>
    patchSample((old) => ({
      ...old,
      trials: old.trials.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }));
  const field = (
    f: { key: string; label: LocalizedText; hint: LocalizedText; max: number },
    sample = false,
  ) => (
    <label key={f.key}>
      <Text value={f.label} mode={mode} />
      <textarea
        rows={2}
        maxLength={f.max}
        aria-label={mode === 'en' ? f.label.en : f.label.zh}
        aria-describedby={`materials-${sample ? specimen.id : 'plan'}-${f.key}-hint`}
        value={(sample ? specimen.fields : draft.fields)[f.key] ?? ''}
        onChange={(e) =>
          sample
            ? patchSample((old) => ({
                ...old,
                fields: { ...old.fields, [f.key]: e.target.value },
              }))
            : update((old) => ({
                ...old,
                fields: { ...old.fields, [f.key]: e.target.value },
              }))
        }
      />
      <small id={`materials-${sample ? specimen.id : 'plan'}-${f.key}-hint`}>
        <Text value={f.hint} mode={mode} />
      </small>
    </label>
  );
  const nextId = MATERIAL_IDS.find(
    (id) => !draft.specimens.some((s) => s.id === id),
  );
  return (
    <div className="phy-page phy-materials-page">
      <Link className="phy-back" to="/physics/path">
        <B zh="← 返回探索路线" en="← Back to the learning path" mode={mode} />
      </Link>
      <div className="phy-materials-hero">
        <div>
          <p className="phy-eyebrow">STAGE 1 / MYSTERY MATERIALS</p>
          <h1>
            <B
              zh="标签不见了，它可能是什么？"
              en="The label is missing. What could it be?"
              mode={mode}
            />
          </h1>
          <p className="phy-lead">
            <B
              zh="从一个身边的小物件开始。用自己的质量和体积读数寻找线索，再解释为什么还不能只凭密度确定身份。"
              en="Begin with a small everyday object. Use your own mass and volume readings for clues, then explain why density alone cannot establish identity."
              mode={mode}
            />
          </p>
        </div>
        <CaseArt mode={mode} />
      </div>
      <nav
        className="phy-materials-cases"
        aria-label={mode === 'en' ? 'Material case files' : '材料档案'}
      >
        {draft.specimens.map((s) => (
          <button
            key={s.id}
            className={s.id === specimen.id ? 'selected' : ''}
            aria-pressed={s.id === specimen.id}
            aria-label={mode === 'en' ? `Open case ${s.id}` : `打开档案${s.id}`}
            onClick={() => update((old) => ({ ...old, activeId: s.id }))}
          >
            <span>
              FILE {s.id}
              <i>{materialSummary(s).complete ? '✓' : '○'}</i>
            </span>
            <strong>
              {s.label.trim() ||
                (mode === 'en' ? 'Unnamed specimen' : '尚未命名的物体')}
            </strong>
          </button>
        ))}
        <button
          className="phy-materials-add"
          disabled={!nextId}
          onClick={() => {
            if (nextId)
              update((old) => ({
                ...old,
                activeId: nextId,
                step: 1,
                specimens: [...old.specimens, emptyMaterial(nextId)],
              }));
          }}
        >
          <B
            zh={nextId ? `＋ 添加档案${nextId}` : '四份档案已保留'}
            en={nextId ? `＋ Add case ${nextId}` : 'Four cases retained'}
            mode={mode}
          />
        </button>
      </nav>
      <nav
        className="phy-step-nav phy-materials-steps"
        aria-label={mode === 'en' ? 'Investigation steps' : '调查步骤'}
      >
        {steps.map((s, i) => (
          <button
            key={i}
            className={i === step ? 'active' : ''}
            aria-current={i === step ? 'step' : undefined}
            onClick={() => update((old) => ({ ...old, step: i }))}
          >
            <span>{i + 1}</span>
            <Text value={s} mode={mode} />
          </button>
        ))}
      </nav>
      <div className="phy-project-layout">
        <div>
          {step === 0 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="01 / 先猜，再选一种可行测法"
                  en="01 / Predict, then choose a workable method"
                  mode={mode}
                />
              </h2>
              <p className="phy-materials-note">
                <B
                  zh="请家人帮忙，选小而无尖角的日常物件。规则实心块可量三边；排水只用于不吸水、不溶解、能完整浸没的物体。木头会浮或吸水，先考虑规则块测法。秤读不到或形状不合适时，记录困难，不编造读数。"
                  en="With a helper, choose a small everyday object without sharp edges. Use three edges for a regular solid block; use displacement only for an insoluble, non-absorbing, fully immersed object. Wood may float or absorb water, so consider a regular block. Record unsuitable tools or shapes rather than invent readings."
                  mode={mode}
                />
              </p>
              {materialPlanFields.map((f) => field(f))}
              <details className="phy-materials-example">
                <summary>
                  <B
                    zh="看一份推理示例，不填入我的记录"
                    en="See an example without filling my record"
                    mode={mode}
                  />
                </summary>
                <p>
                  <B
                    zh="编写示例：干燥质量54 g；完整浸没、无气泡，水位40→60 mL。V=60−40=20 cm³，ρ=54÷20=2.70 g/cm³，接近“材料线索”页的铝教学样品。它可能含铝，但空洞、合金与测量偏差仍需调查。直接除以末水位60，会得到0.90 g/cm³，回答了错误的问题。"
                    en="Constructed example: dry mass 54 g; full, bubble-free immersion gives 40→60 mL. V=60−40=20 cm³; density=54/20=2.70 g/cm³, close to the aluminium teaching sample on the Clues page. It might contain aluminium, but cavities, alloys and bias still need investigation. Dividing by the final 60 mL gives 0.90 g/cm³ and answers the wrong question."
                    mode={mode}
                  />
                </p>
              </details>
            </section>
          )}
          {step === 1 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh={`02 / 档案${specimen.id}：保留每次原始读数`}
                  en={`02 / Case ${specimen.id}: keep every original reading`}
                  mode={mode}
                />
              </h2>
              <label>
                <B
                  zh="这个物体叫什么？"
                  en="What will you call this specimen?"
                  mode={mode}
                />
                <input
                  maxLength={100}
                  value={specimen.label}
                  onChange={(e) =>
                    patchSample((old) => ({ ...old, label: e.target.value }))
                  }
                />
              </label>
              <p className="phy-materials-note">
                <B
                  zh="同一物体，至少两次可用读数；有问题就保留原读数，再重测。"
                  en="Same specimen, at least two usable readings. Keep problem readings and measure again."
                  mode={mode}
                />
              </p>
              <details className="phy-materials-help">
                <summary>
                  <B
                    zh="填写提示与范围"
                    en="Entry guide and ranges"
                    mode={mode}
                  />
                </summary>
                <p>
                  <B
                    zh="只填字段标注的单位，最多三位小数：质量≤5000 g，边长≤100 cm，水位≤1000 mL。原数字与备注不会自动替换成参照值。"
                    en="Use the stated units with up to three decimals: mass≤5000 g, edges≤100 cm, water≤1000 mL. Raw entries and notes are never replaced by references."
                    mode={mode}
                  />
                </p>
              </details>
              <div className="phy-materials-trials">
                {summary.trials.map((r) => (
                  <div className="phy-materials-trial" key={r.trial}>
                    <header>
                      <strong>
                        <B
                          zh={`第${r.trial}次`}
                          en={`Trial ${r.trial}`}
                          mode={mode}
                        />
                      </strong>
                      <span>
                        <B
                          zh={
                            r.excluded
                              ? '有原因排除'
                              : r.pendingReason
                                ? '待补原因'
                                : r.used
                                  ? '参与汇总'
                                  : '待检查条件'
                          }
                          en={
                            r.excluded
                              ? 'Excluded with reason'
                              : r.pendingReason
                                ? 'Reason needed'
                                : r.used
                                  ? 'Used'
                                  : 'Check conditions'
                          }
                          mode={mode}
                        />
                      </span>
                    </header>
                    <label>
                      <B zh="体积测法" en="Volume method" mode={mode} />
                      <select
                        aria-label={
                          mode === 'en'
                            ? `Case ${specimen.id} trial ${r.trial} volume method`
                            : `档案${specimen.id}第${r.trial}次体积测法`
                        }
                        value={r.raw.method}
                        onChange={(e) =>
                          patchTrial(r.trial - 1, {
                            method: e.target.value as MaterialTrial['method'],
                            volumeChecked: false,
                          })
                        }
                      >
                        <option value="block">
                          {mode === 'en'
                            ? 'Three edges (cm)'
                            : mode === 'zh'
                              ? '三边（cm）'
                              : '三边（cm） · Three edges'}
                        </option>
                        <option value="displacement">
                          {mode === 'en'
                            ? 'Water displacement (mL)'
                            : mode === 'zh'
                              ? '排水（mL）'
                              : '排水（mL） · Water displacement'}
                        </option>
                      </select>
                    </label>
                    <div className="phy-materials-numbers">
                      {(
                        [
                          'mass',
                          ...(r.raw.method === 'block'
                            ? ['length', 'width', 'height']
                            : ['before', 'after']),
                        ] as MaterialReadingKey[]
                      ).map((key) => (
                        <label key={key}>
                          <Text value={readings[key]} mode={mode} />
                          <input
                            inputMode="decimal"
                            maxLength={16}
                            value={r.raw[key]}
                            aria-invalid={
                              !!r.raw[key].trim() &&
                              (materialNumber(
                                r.raw[key],
                                key === 'mass'
                                  ? 5000
                                  : key === 'before' || key === 'after'
                                    ? 1000
                                    : 100,
                                key === 'before',
                              ) === undefined ||
                                (key === 'after' &&
                                  materialNumber(r.raw.before, 1000, true) !==
                                    undefined &&
                                  materialNumber(r.raw.after, 1000)! <=
                                    materialNumber(r.raw.before, 1000, true)!))
                            }
                            aria-label={
                              mode === 'en'
                                ? `Case ${specimen.id} trial ${r.trial} ${readings[key].en}`
                                : `档案${specimen.id}第${r.trial}次${readings[key].zh}`
                            }
                            onChange={(e) =>
                              patchTrial(r.trial - 1, { [key]: e.target.value })
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <div className="phy-materials-trial-result">
                      <span>V = {materialFormat(r.volume)} cm³</span>
                      <strong>
                        <B zh="表观ρ" en="Apparent ρ" mode={mode} />{' '}
                        {materialFormat(r.density)} g/cm³
                      </strong>
                    </div>
                    {r.raw.method === 'displacement' && (
                      <p className="phy-materials-note">
                        <B
                          zh="V = 末水位 − 初水位，1 mL = 1 cm³；末水位必须高于初始。"
                          en="V = final − initial water; 1 mL = 1 cm³. The final reading must be higher."
                          mode={mode}
                        />
                      </p>
                    )}
                    <label className="phy-materials-check">
                      <input
                        type="checkbox"
                        checked={r.raw.dryMass}
                        aria-label={
                          mode === 'en'
                            ? `Case ${specimen.id} trial ${r.trial} dry mass checked`
                            : `档案${specimen.id}第${r.trial}次确认干燥质量`
                        }
                        onChange={(e) =>
                          patchTrial(r.trial - 1, { dryMass: e.target.checked })
                        }
                      />
                      <B
                        zh="干燥质量已记录，检查了g单位与去皮"
                        en="Dry mass recorded; g units and tare checked"
                        mode={mode}
                      />
                    </label>
                    <label className="phy-materials-check">
                      <input
                        type="checkbox"
                        checked={r.raw.volumeChecked}
                        aria-label={
                          mode === 'en'
                            ? `Case ${specimen.id} trial ${r.trial} volume condition checked`
                            : `档案${specimen.id}第${r.trial}次确认体积条件`
                        }
                        onChange={(e) =>
                          patchTrial(r.trial - 1, {
                            volumeChecked: e.target.checked,
                          })
                        }
                      />
                      <B
                        zh={
                          r.raw.method === 'block'
                            ? '规则实心长方体，三边均为cm'
                            : '完整浸没、无附着气泡、不吸水不溶解，未溅水'
                        }
                        en={
                          r.raw.method === 'block'
                            ? 'Regular solid block; all three edges in cm'
                            : 'Fully immersed, bubble-free, non-absorbing, insoluble; no spills'
                        }
                        mode={mode}
                      />
                    </label>
                    {r.unresolved && (
                      <p className="phy-materials-warning" role="status">
                        <B
                          zh={
                            r.density === undefined
                              ? '读数还不能算出有效的m/V；原输入保留，请检查正数、单位和水位顺序。'
                              : !r.conditions
                                ? '这个比值尚未通过你的测量条件检查，暂不参与使用汇总。'
                                : '排除原因还未填写；这次仍参与使用汇总。'
                          }
                          en={
                            r.density === undefined
                              ? 'Cannot yet calculate a valid m/V; raw entries retained. Check positive readings, units and water order.'
                              : !r.conditions
                                ? 'This ratio has not passed your condition checks and is not in the used summary.'
                                : 'Exclusion reason is missing; this reading is still used.'
                          }
                          mode={mode}
                        />
                      </p>
                    )}
                    <details className="phy-materials-evidence">
                      <summary>
                        <B
                          zh={
                            r.raw.excluded
                              ? '备注与排除（已勾选）'
                              : '备注与排除'
                          }
                          en={
                            r.raw.excluded
                              ? 'Notes & exclusion (checked)'
                              : 'Notes & exclusion'
                          }
                          mode={mode}
                        />
                      </summary>
                      <label>
                        <B
                          zh="本次发生了什么？"
                          en="What happened in this trial?"
                          mode={mode}
                        />
                        <textarea
                          rows={2}
                          maxLength={500}
                          value={r.raw.note}
                          aria-label={
                            mode === 'en'
                              ? `Case ${specimen.id} trial ${r.trial} note`
                              : `档案${specimen.id}第${r.trial}次备注`
                          }
                          onChange={(e) =>
                            patchTrial(r.trial - 1, { note: e.target.value })
                          }
                        />
                      </label>
                      <label className="phy-materials-check">
                        <input
                          type="checkbox"
                          checked={r.raw.excluded}
                          aria-label={
                            mode === 'en'
                              ? `Exclude case ${specimen.id} trial ${r.trial}`
                              : `排除档案${specimen.id}第${r.trial}次`
                          }
                          onChange={(e) =>
                            patchTrial(r.trial - 1, {
                              excluded: e.target.checked,
                            })
                          }
                        />
                        <B
                          zh="有明确操作问题，暂不参与汇总"
                          en="Known procedure problem: omit from summary"
                          mode={mode}
                        />
                      </label>
                      <small>
                        <B
                          zh="写实际原因，例如未完整浸没。与猜想不同不是排除理由；取消勾选可恢复。换测法时原输入保留在报告，另开一次更清楚。"
                          en="Give an actual reason, such as incomplete immersion. Disagreement with a prediction is not a reason; uncheck to restore. Changing method retains other raw fields in the report; a new trial is clearer."
                          mode={mode}
                        />
                      </small>
                    </details>
                  </div>
                ))}
              </div>
              <button
                className="phy-text-button"
                disabled={specimen.trials.length >= MAX_MATERIAL_TRIALS}
                onClick={() =>
                  patchSample((old) => ({
                    ...old,
                    trials: [
                      ...old.trials,
                      emptyMaterialTrial(old.trials.at(-1)?.method),
                    ],
                  }))
                }
              >
                <B
                  zh={
                    specimen.trials.length >= MAX_MATERIAL_TRIALS
                      ? '六次读数已保留，可导出后继续调查'
                      : '＋ 追加一次，不覆盖原始读数'
                  }
                  en={
                    specimen.trials.length >= MAX_MATERIAL_TRIALS
                      ? 'Six readings retained; export before further investigation'
                      : '＋ Add a trial; keep original readings'
                  }
                  mode={mode}
                />
              </button>
            </section>
          )}
          {step === 2 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh={`03 / 档案${specimen.id}：数字提供了什么线索？`}
                  en={`03 / Case ${specimen.id}: what clues do the numbers offer?`}
                  mode={mode}
                />
              </h2>
              <div className="phy-materials-metrics">
                <div>
                  <B zh="使用均质量" en="Used mean mass" mode={mode} />
                  <strong>{materialFormat(summary.meanMass)} g</strong>
                </div>
                <div>
                  <B zh="使用均体积" en="Used mean volume" mode={mode} />
                  <strong>{materialFormat(summary.meanVolume)} cm³</strong>
                </div>
                <div>
                  <B
                    zh="汇总ρ = 均m / 均V"
                    en="Summary ρ = mean m / mean V"
                    mode={mode}
                  />
                  <strong>{materialFormat(summary.density)} g/cm³</strong>
                </div>
              </div>
              <p className="phy-materials-note">
                <B
                  zh={`使用 ${summary.count}/${summary.trials.length} 次。原始可计算读数比值 ${materialFormat(summary.rawDensity)} g/cm³；使用ρ范围 ${materialFormat(summary.densityRange)} g/cm³。原始比值包括条件未确认或被排除的数字；范围只是分散，不是完整误差。显示数字已四舍五入，不代表仪器精度。`}
                  en={`${summary.count}/${summary.trials.length} used. Raw numeric ratio ${materialFormat(summary.rawDensity)} g/cm³; used trial density range ${materialFormat(summary.densityRange)} g/cm³. Raw ratio includes unconfirmed or excluded numbers; range describes spread, not full uncertainty. Rounded displays do not establish instrument precision.`}
                  mode={mode}
                />
              </p>
              <h3>
                <B
                  zh="四个教学样品参照"
                  en="Four teaching-sample references"
                  mode={mode}
                />
              </h3>
              <ReferenceBook mode={mode} density={summary.density} />
              <p className="phy-materials-note">
                <B
                  zh="这些是前面实验规定的样品密度，不是天然材料的范围。木头与塑料差异尤其大；铝合金、钢种、空洞和混合材料也会改变比较。相差百分比只作对照，没有“识别成功”的门槛。"
                  en="These are prescribed samples from the earlier labs, not natural-material ranges. Woods and plastics vary widely; alloys, steel grades, cavities and mixtures also change comparisons. Difference percentages are comparisons, with no identification-success threshold."
                  mode={mode}
                />
              </p>
              <details className="phy-materials-example">
                <summary>
                  <B
                    zh="这个百分比怎么来的？"
                    en="How is this percentage calculated?"
                    mode={mode}
                  />
                </summary>
                <p>
                  <B
                    zh="相对差值 = |你的汇总ρ−参照ρ| ÷ 参照ρ ×100%。例如2.70和2.70相差0%；即使0%，也只说明密度相近，不能唯一证明材料。"
                    en="Relative difference = |your summary density − reference density| / reference density ×100%. For 2.70 versus 2.70 the difference is 0%; even 0% cannot uniquely establish material identity."
                    mode={mode}
                  />
                </p>
              </details>
            </section>
          )}
          {step === 3 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh={`04 / 档案${specimen.id}：把线索写成自己的解释`}
                  en={`04 / Case ${specimen.id}: explain the clues in your own words`}
                  mode={mode}
                />
              </h2>
              <p className="phy-materials-note">
                <B
                  zh={`当前汇总ρ：${materialFormat(summary.density)} g/cm³。可以写“暂不能判断”，但要说明数据和原因。`}
                  en={`Current summary density: ${materialFormat(summary.density)} g/cm³. “Not yet sure” is valid when supported by data and reasons.`}
                  mode={mode}
                />
              </p>
              {materialSampleFields.map((f) => field(f, true))}
              <div className="phy-project-status" role="status">
                <strong>
                  <B
                    zh={
                      summary.complete
                        ? `档案${specimen.id}记录完整`
                        : `档案${specimen.id}还有待补证据`
                    }
                    en={
                      summary.complete
                        ? `Case ${specimen.id} record complete`
                        : `Case ${specimen.id} needs more evidence`
                    }
                    mode={mode}
                  />
                </strong>
                <p>
                  <B
                    zh="需样品名称、两次已确认条件的使用读数、观察、判断和不确定之处。未处理的输入或排除原因也需补全。这里只检查填写；密度身份和测量操作由你继续核实。"
                    en="Needs a specimen name, two used readings with checked conditions, observations, judgment and uncertainty. Resolve entered errors and exclusion reasons. This checks filled records; you still investigate measurements and identity."
                    mode={mode}
                  />
                </p>
              </div>
            </section>
          )}
          <div className="phy-lesson-footer">
            <button
              className="phy-button secondary"
              disabled={step === 0}
              onClick={() => update((old) => ({ ...old, step: step - 1 }))}
            >
              <B zh="← 前一步" en="← Previous" mode={mode} />
            </button>
            <span>{step + 1} / 4</span>
            {step === 3 ? (
              <Link className="phy-button" to="/physics/path">
                <B zh="返回路线 →" en="Back to the path →" mode={mode} />
              </Link>
            ) : (
              <button
                className="phy-button"
                onClick={() => update((old) => ({ ...old, step: step + 1 }))}
              >
                <B zh="下一步 →" en="Next →" mode={mode} />
              </button>
            )}
          </div>
        </div>
        <aside className="phy-project-guide phy-materials-guide">
          <h2>
            <B zh="让证据带路" en="Let evidence lead" mode={mode} />
          </h2>
          <p>ρ = m / V</p>
          <ol>
            <li>
              <B
                zh="质量用g；体积用cm³。排水取水位差，不取末读数。"
                en="Mass in g; volume in cm³. Displacement uses the change, not the final reading."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="先确认条件，再比较密度。原始记录全部保留。"
                en="Check conditions before comparing density. Keep every raw record."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="相近是线索；合金、空洞与测量偏差仍可能影响判断。"
                en="Proximity is a clue; alloys, cavities and bias may still affect a judgment."
                mode={mode}
              />
            </li>
          </ol>
          <div className="phy-project-status" role="status">
            <strong>
              <B
                zh={
                  state.completed
                    ? '材料调查记录完整'
                    : state.planned
                      ? '计划已准备好'
                      : '从一个猜想开始'
                }
                en={
                  state.completed
                    ? 'Materials record complete'
                    : state.planned
                      ? 'Plan ready'
                      : 'Start with a prediction'
                }
                mode={mode}
              />
            </strong>
            <p>
              <B
                zh={`计划 ${state.planned ? '✓' : '○'} · 档案 ${state.count}/${draft.specimens.length} 完整。徽章不验证科学结论；先完成一份档案即可，也可添加物体继续比较。`}
                en={`Plan ${state.planned ? '✓' : '○'} · ${state.count}/${draft.specimens.length} cases complete. Badges do not verify conclusions. One case is a useful start; add specimens to compare further.`}
                mode={mode}
              />
            </p>
          </div>
          <p>
            <B
              zh={
                store.storageAvailable
                  ? '草稿自动保存在此浏览器，原始读数与档案位置都会保留。'
                  : '浏览器无法保存；请下载报告保留草稿。'
              }
              en={
                store.storageAvailable
                  ? 'Draft, raw readings and your case position save in this browser.'
                  : 'Browser storage is unavailable; download your draft.'
              }
              mode={mode}
            />
          </p>
          <ProjectReport
            mode={mode}
            report={materialsMarkdown(draft)}
            hasData={materialsHasData(draft)}
            fileName="physics-mystery-materials.md"
            downloadLabel={t('下载材料调查', 'Download materials report')}
            reportLabel={t('双语神秘材料报告', 'Bilingual materials report')}
          />
          <Link
            className="phy-text-button"
            to="/physics/lesson/density-mass-over-volume"
          >
            <B
              zh="复习密度与单位 →"
              en="Revisit density and units →"
              mode={mode}
            />
          </Link>
          <Link
            className="phy-text-button"
            to="/physics/lesson/irregular-object-density"
          >
            <B
              zh="复习排水条件 →"
              en="Revisit displacement conditions →"
              mode={mode}
            />
          </Link>
        </aside>
      </div>
    </div>
  );
}
