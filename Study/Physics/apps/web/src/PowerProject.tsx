import { Link } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { t } from './content/schema';
import { ProjectReport } from './ProjectReport';
import {
  emptyPower,
  emptyPowerTrial,
  powerPlanFields,
  powerExplainFields,
  powerState,
  powerNumber,
  powerFormat as fmt,
  powerReading,
  powerMarkdown,
  powerHasData,
  MAX_POWER_TRIALS,
  type PowerDraft,
  type PowerTrial,
} from './power';
const steps = [
  t('准备调查', 'Prepare'),
  t('高度与质量', 'Rise & mass'),
  t('上楼与时间', 'Ascent & time'),
  t('解释与报告', 'Explain & report'),
];
const numericLabels = {
  mass: t('同一总质量（kg）', 'Same total mass (kg)'),
  risers: t('起终点之间的竖直台阶数', 'Vertical riser count between endpoints'),
};
function TimeEvidence({
  mode,
  draft,
}: {
  mode: LanguageMode;
  draft: PowerDraft;
}) {
  const records = powerState(draft).times.records.filter(
    (r) => r.value !== undefined,
  );
  if (!records.length) return null;
  const ceiling = Math.max(...records.map((r) => r.value!)) * 1.2;
  return (
    <figure className="phy-power-chart">
      <p className="phy-power-chart-scale">
        <B zh="同一秒刻度" en="One shared seconds scale" mode={mode} /> · 0 —{' '}
        {fmt(ceiling)} s
      </p>
      {Array.from({ length: Math.ceil(records.length / 4) }, (_, panel) => {
        const group = records.slice(panel * 4, panel * 4 + 4),
          width = 500 / group.length;
        return (
          <svg
            key={panel}
            viewBox="0 0 600 260"
            role="img"
            aria-label={
              mode === 'en'
                ? `Independent ascent times, group ${panel + 1}`
                : `各次独立上楼时间，第${panel + 1}组`
            }
          >
            <path
              d="M65 40V210H575"
              fill="none"
              stroke="#b5a4c0"
              strokeWidth="2"
            />
            <text x="10" y="30" fill="#91769d" fontSize="26">
              t / s
            </text>
            <text x="53" y="218" textAnchor="end" fontSize="24" fill="#91769d">
              0
            </text>
            <path d="M65 55H575" stroke="#d7ccdf" strokeDasharray="5 6" />
            {group.map((r, i) => {
              const x = 75 + width * i,
                y = 210 - (r.value! / ceiling) * 155;
              return (
                <g key={r.trial}>
                  <rect
                    x={x + width * 0.18}
                    y={y}
                    width={width * 0.58}
                    height={210 - y}
                    fill={
                      r.used ? '#b9cfbf' : r.excluded ? '#ece5f0' : '#e0cba8'
                    }
                    stroke={r.used ? '#8faf98' : '#b79dc5'}
                    strokeDasharray={r.used ? undefined : '5 5'}
                  />
                  <text
                    x={x + width * 0.47}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="24"
                    fill="#8b7197"
                  >
                    {fmt(r.value)}
                  </text>
                  <text
                    x={x + width * 0.47}
                    y="244"
                    textAnchor="middle"
                    fontSize="25"
                    fill="#8b7197"
                  >
                    #{r.trial}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      })}
      <figcaption>
        <B
          zh="每根柱是一趟独立上楼，不是同一趟的时间线。绿柱为已确认使用值；虚线柱保留未确认或排除值。各组使用同一秒刻度；功率还取决于同一质量和高度。"
          en="Each bar is a separate ascent, not a timeline of one journey. Green bars are checked used values; dashed bars retain unchecked or excluded values. Groups share the same seconds scale; power also depends on the same mass and rise."
          mode={mode}
        />
      </figcaption>
    </figure>
  );
}
export function PowerProject({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const draft = store.progress.powerProject ?? emptyPower(),
    state = powerState(draft),
    step = draft.step;
  const update = (change: (old: PowerDraft) => PowerDraft) =>
    store.update((old) => ({
      ...old,
      powerProject: {
        ...change(old.powerProject ?? emptyPower()),
        updatedAt: Date.now(),
      },
    }));
  const patch = (
    key: 'heights' | 'times',
    index: number,
    value: Partial<PowerTrial>,
  ) =>
    update((old) => ({
      ...old,
      [key]: old[key].map((r, i) => (i === index ? { ...r, ...value } : r)),
    }));
  const field = (f: {
    key: string;
    label: LocalizedText;
    hint: LocalizedText;
    max: number;
  }) => (
    <label key={f.key}>
      <Text value={f.label} mode={mode} />
      <textarea
        rows={2}
        maxLength={f.max}
        aria-label={mode === 'en' ? f.label.en : f.label.zh}
        aria-describedby={`power-${f.key}-hint`}
        value={draft.fields[f.key] ?? ''}
        onChange={(e) =>
          update((old) => ({
            ...old,
            fields: { ...old.fields, [f.key]: e.target.value },
            ...(['route', 'procedure'].includes(f.key)
              ? { times: old.times.map((r) => ({ ...r, checked: false })) }
              : {}),
            ...(f.key === 'route'
              ? {
                  countChecked: false,
                  heights: old.heights.map((r) => ({ ...r, checked: false })),
                }
              : {}),
          }))
        }
      />
      <small id={`power-${f.key}-hint`}>
        <Text value={f.hint} mode={mode} />
      </small>
    </label>
  );
  const number = (key: 'mass' | 'risers', max: number) => (
    <label>
      <Text value={numericLabels[key]} mode={mode} />
      <input
        inputMode={key === 'risers' ? 'numeric' : 'decimal'}
        maxLength={16}
        aria-label={
          mode === 'en' ? numericLabels[key].en : numericLabels[key].zh
        }
        aria-invalid={
          !!draft[key].trim() &&
          (powerNumber(draft[key], max) === undefined ||
            (key === 'risers' &&
              !Number.isInteger(powerNumber(draft[key], max))))
        }
        value={draft[key]}
        onChange={(e) =>
          update((old) => ({
            ...old,
            [key]: e.target.value,
            [key === 'mass' ? 'massChecked' : 'countChecked']: false,
            times: old.times.map((r) => ({ ...r, checked: false })),
          }))
        }
      />
      {!!draft[key].trim() &&
        (powerNumber(draft[key], max) === undefined ||
          (key === 'risers' &&
            !Number.isInteger(powerNumber(draft[key], max)))) && (
          <small role="status">
            <B
              zh={
                key === 'mass'
                  ? '质量应为大于0、不超过300 kg的小数；原输入已保留。'
                  : '台阶数应为1–100之间的整数；原输入已保留。'
              }
              en={
                key === 'mass'
                  ? 'Mass must be a decimal above 0 up to 300 kg; original text retained.'
                  : 'Riser count must be a whole number from 1 to 100; original text retained.'
              }
              mode={mode}
            />
          </small>
        )}
    </label>
  );
  const trials = (key: 'heights' | 'times') => {
    const height = key === 'heights',
      series = height ? state.heights : state.times;
    return (
      <>
        <div className="phy-power-readings">
          {draft[key].map((raw, index) => {
            const r = powerReading(raw, height ? 50 : 600),
              label = height
                ? t(
                    `台阶高度读数${index + 1}（cm）`,
                    `Riser reading ${index + 1} (cm)`,
                  )
                : t(
                    `上楼时间${index + 1}（s）`,
                    `Ascent time ${index + 1} (s)`,
                  );
            return (
              <article
                className={`phy-power-trial ${r.excluded ? 'excluded' : ''}`}
                key={index}
              >
                <div className="phy-power-trial-heading">
                  <strong>
                    <B
                      zh={`原始记录 ${index + 1}`}
                      en={`Original record ${index + 1}`}
                      mode={mode}
                    />
                  </strong>
                  <span>
                    <B
                      zh={
                        r.excluded
                          ? '保留并排除'
                          : r.pendingReason
                            ? '待补排除原因'
                            : r.used
                              ? '参与汇总'
                              : '尚未参与'
                      }
                      en={
                        r.excluded
                          ? 'Retained, excluded'
                          : r.pendingReason
                            ? 'Reason needed'
                            : r.used
                              ? 'Used'
                              : 'Not yet used'
                      }
                      mode={mode}
                    />
                  </span>
                </div>
                <label>
                  <Text value={label} mode={mode} />
                  <input
                    inputMode="decimal"
                    maxLength={16}
                    aria-label={mode === 'en' ? label.en : label.zh}
                    aria-invalid={!!raw.value.trim() && r.value === undefined}
                    value={raw.value}
                    onChange={(e) => {
                      patch(key, index, { value: e.target.value });
                      if (height)
                        update((old) => ({
                          ...old,
                          times: old.times.map((time) => ({
                            ...time,
                            checked: false,
                          })),
                        }));
                    }}
                  />
                </label>
                <label className="phy-power-check">
                  <input
                    type="checkbox"
                    checked={raw.checked}
                    onChange={(e) =>
                      patch(key, index, { checked: e.target.checked })
                    }
                  />
                  <B
                    zh={
                      height
                        ? '确认量的是竖直台阶高度，属于这段近似等高楼梯'
                        : '确认同质量、同起终点，按计划计完整上楼时间'
                    }
                    en={
                      height
                        ? 'Checked vertical riser height from this approximately equal-riser flight'
                        : 'Checked same mass/endpoints and full ascent timing as planned'
                    }
                    mode={mode}
                  />
                </label>
                {!height && (
                  <p className="phy-power-trial-value">
                    <B
                      zh="本次机械功率估算"
                      en="This ascent’s estimated mechanical power"
                      mode={mode}
                    />
                    <strong>
                      {fmt(
                        state.work !== undefined && r.value !== undefined
                          ? state.work / r.value
                          : undefined,
                      )}{' '}
                      W
                    </strong>
                    <small>
                      <B
                        zh="未确认或已排除的结果不进入使用汇总。"
                        en="Unchecked or excluded results do not enter the used summary."
                        mode={mode}
                      />
                    </small>
                  </p>
                )}
                <label>
                  <B
                    zh="过程备注或排除原因"
                    en="Procedure note or exclusion reason"
                    mode={mode}
                  />
                  <textarea
                    rows={2}
                    maxLength={500}
                    aria-label={
                      mode === 'en'
                        ? `${height ? 'Riser' : 'Ascent'} note ${index + 1}`
                        : `${height ? '高度' : '时间'}备注${index + 1}`
                    }
                    value={raw.note}
                    onChange={(e) =>
                      patch(key, index, { note: e.target.value })
                    }
                  />
                </label>
                <label className="phy-power-check">
                  <input
                    type="checkbox"
                    checked={raw.excluded}
                    onChange={(e) =>
                      patch(key, index, { excluded: e.target.checked })
                    }
                  />
                  <B
                    zh="有明确过程问题，申请排除（原读数仍保留）"
                    en="Exclude for a documented procedure issue (retain the original)"
                    mode={mode}
                  />
                </label>
                {r.pendingReason && (
                  <p role="status" className="phy-power-alert">
                    <B
                      zh="先写原因；有效且已确认的读数目前仍参与汇总。不要只因数值不同就排除。"
                      en="Give a reason first. A valid checked reading still enters the summary for now. Difference alone is not a reason."
                      mode={mode}
                    />
                  </p>
                )}
                {!!raw.value.trim() && r.value === undefined && (
                  <p role="status" className="phy-power-alert">
                    <B
                      zh={
                        height
                          ? '请输入大于0、不超过50 cm的小数；原输入已保留。'
                          : '请输入大于0、不超过600 s的小数；原输入已保留。'
                      }
                      en={
                        height
                          ? 'Enter a decimal above 0, at most 50 cm; original text is retained.'
                          : 'Enter a decimal above 0, at most 600 s; original text is retained.'
                      }
                      mode={mode}
                    />
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <button
          className="phy-button secondary"
          disabled={draft[key].length >= MAX_POWER_TRIALS}
          onClick={() =>
            update((old) => ({
              ...old,
              [key]: [...old[key], emptyPowerTrial()],
            }))
          }
        >
          <B
            zh={
              draft[key].length >= MAX_POWER_TRIALS
                ? '12条原记录已保留'
                : '＋ 增加一次读数，保留原记录'
            }
            en={
              draft[key].length >= MAX_POWER_TRIALS
                ? '12 original records retained'
                : '＋ Add a reading, keep originals'
            }
            mode={mode}
          />
        </button>
        <div className="phy-power-series">
          <span>
            <B zh="已确认使用数" en="Checked used count" mode={mode} />
            <strong>{series.count}</strong>
          </span>
          <span>
            <B zh="使用均值" en="Used mean" mode={mode} />
            <strong>
              {fmt(series.mean)} {height ? 'cm' : 's'}
            </strong>
          </span>
          <span>
            <B zh="使用读数范围" en="Used reading range" mode={mode} />
            <strong>
              {fmt(series.range)} {height ? 'cm' : 's'}
            </strong>
          </span>
          <span>
            <B zh="原始数值均值" en="Raw numeric mean" mode={mode} />
            <strong>
              {fmt(series.rawMean)} {height ? 'cm' : 's'}
            </strong>
          </span>
        </div>
        <p className="phy-power-note">
          <B
            zh="原始数值均值包含所有可计算读数（包括未确认或已排除的）。范围是这些读数的分散，不是完整误差。空白备用栏不影响完整性。"
            en="Raw numeric mean includes all computable readings, including unchecked or excluded ones. Range describes these readings, not full uncertainty. Blank spare slots do not affect completeness."
            mode={mode}
          />
        </p>
      </>
    );
  };
  return (
    <div className="phy-page phy-power-page">
      <Link className="phy-back" to="/physics/path">
        <B zh="← 返回探索路线" en="← Back to the learning path" mode={mode} />
      </Link>
      <div className="phy-power-hero">
        <div>
          <p className="phy-eyebrow">STAGE 2 / HOW MANY WATTS?</p>
          <h1>
            <B
              zh="走上一段楼梯，留下自己的证据。"
              en="Walk a flight. Leave your own evidence."
              mode={mode}
            />
          </h1>
          <p className="phy-lead">
            <B
              zh="不比谁最快。用竖直高度、总质量与上楼时间，估算这次上楼的机械功率。"
              en="No fastest-time contest. Use vertical rise, total mass and ascent time to estimate this task’s mechanical power."
              mode={mode}
            />
          </p>
        </div>
        <div className="phy-power-hero-art" aria-hidden="true">
          <svg viewBox="0 0 320 150">
            <path
              d="M25 130h45v-25h45V80h45V55h45V30h40"
              fill="none"
              stroke="#ac96bb"
              strokeWidth="3"
            />
            <path
              d="M285 130V30m-5 6 5-6 5 6"
              stroke="#88ac9a"
              fill="none"
              strokeWidth="2"
            />
            <text x="275" y="88" textAnchor="end">
              h
            </text>
            <circle cx="220" cy="15" r="7" fill="#c7ad83" />
            <path
              d="M220 22v15m0-9-10 7m10-7 10 7m-10 2-8 10m8-10 8 10"
              fill="none"
              stroke="#c7ad83"
              strokeWidth="3"
            />
            <text x="105" y="28" textAnchor="middle">
              m × g × h / t
            </text>
          </svg>
        </div>
      </div>
      <nav
        className="phy-step-nav phy-power-steps"
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
                  zh="01 / 一个问题，一段楼梯"
                  en="01 / One question, one flight"
                  mode={mode}
                />
              </h2>
              <p className="phy-power-note">
                <B
                  zh="找一段熟悉、干燥、没有障碍物的楼梯，请家人协助量与计时；普通步行，使用扶手，不边走边看屏幕。记录自然发生的时间变化，不冲刺、不额外负重；没有合适条件就先保留计划。"
                  en="Choose a familiar, dry, unobstructed flight with a helper for measuring and timing. Walk normally, use the handrail and keep the screen away while moving. Record natural time variation; no sprinting or added load. Keep a plan if conditions are unsuitable."
                  mode={mode}
                />
              </p>
              {powerPlanFields.map(field)}
              <details className="phy-power-example">
                <summary>
                  <B
                    zh="看一个编写示例，不填入我的记录"
                    en="See a constructed example without filling my record"
                    mode={mode}
                  />
                </summary>
                <p>
                  <B
                    zh="示例：总质量50 kg，20个竖直台阶，三次台阶高度15/15/15 cm，h=3 m。三次上楼时间10/12/14 s，使用均时间12 s：每次mgh≈1500 J，汇总P≈125 W。各次150/125/107.14 W的算术平均约127.38 W，回答的是另一个平均问题。示例不是你的实测，也不评价人的能力。"
                    en="Example: 50 kg total, 20 risers, three riser readings 15/15/15 cm, so h=3 m. Ascent times 10/12/14 s give mean 12 s: each mgh≈1500 J and summary power≈125 W. Arithmetic mean of 150/125/107.14 W is about 127.38 W, a different averaging question. This is not your measurement or a rating of ability."
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
                  zh="02 / 高度是竖直的，不是沿坡走的"
                  en="02 / Rise is vertical, not distance along the slope"
                  mode={mode}
                />
              </h2>
              <div className="phy-power-numbers">
                {number('mass', 300)}
                {number('risers', 100)}
              </div>
              <label className="phy-power-check">
                <input
                  type="checkbox"
                  checked={draft.massChecked}
                  onChange={(e) =>
                    update((old) => ({ ...old, massChecked: e.target.checked }))
                  }
                />
                <B
                  zh="已确认用kg、包含原有衣物与携带物；各次保持一致"
                  en="Checked kg, usual clothing/carried items included; same in every trial"
                  mode={mode}
                />
              </label>
              <label className="phy-power-check">
                <input
                  type="checkbox"
                  checked={draft.countChecked}
                  onChange={(e) =>
                    update((old) => ({
                      ...old,
                      countChecked: e.target.checked,
                    }))
                  }
                />
                <B
                  zh="已数起终点之间的竖直升高次数；不是踏板长度或沿坡距离"
                  en="Counted vertical rises between endpoints, not tread length or slope distance"
                  mode={mode}
                />
              </label>
              <p className="phy-power-note">
                <B
                  zh="量至少两个位置的竖直台阶高度；重复数值也照实保留。h≈台阶数×平均台阶高度÷100（cm换m）。先检查台阶近似等高；若明显不等高，本工作台的方法不适用，先记下问题。本档案的质量范围0–300 kg（不含0），台阶数1–100；只填写自己的实际值。"
                  en="Measure vertical riser heights at two or more positions; retain equal readings too. h≈riser count×mean cm/100. Check that risers are approximately equal; if clearly unequal, this method does not apply, so record the problem first. This record accepts mass above 0 up to 300 kg and 1–100 risers; enter actual values."
                  mode={mode}
                />
              </p>
              {trials('heights')}
            </section>
          )}
          {step === 2 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="03 / 每一次上楼，都留下原时间"
                  en="03 / Every ascent keeps its original time"
                  mode={mode}
                />
              </h2>
              <p className="phy-power-note">
                <B
                  zh="至少三次可用时间，家人计时，休息后再重复。一次上楼若中途停顿，完整任务时间应包含它；若按错计时器，保留原读数、写明过程问题再决定排除。改质量、台阶数或高度读数后，各次时间条件需重新确认。不要把数字更好看当作排除理由。"
                  en="Retain at least three usable times, with a helper and rest between trials. Include pauses within the ascent. If a timer was misused, retain the original and document the issue before excluding. Changing mass, count or riser readings resets timing confirmations. A nicer-looking number is not an exclusion reason."
                  mode={mode}
                />
              </p>
              {trials('times')}
              <TimeEvidence mode={mode} draft={draft} />
            </section>
          )}
          {step === 3 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="04 / 把数字变成解释"
                  en="04 / Turn numbers into an explanation"
                  mode={mode}
                />
              </h2>
              <TimeEvidence mode={mode} draft={draft} />
              {powerExplainFields.map(field)}
              <p className="phy-power-note">
                <B
                  zh="汇总采用同任务的总mgh÷使用总时间，也就是mgh÷使用均时间。不是把各次功率简单平均。至少两个可用高度与三个可用时间，解决所有已填写的异常并写完计划、解释，才显示“记录完整”；徽章不证明实验正确。"
                  en="Summary uses summed mgh for identical tasks divided by summed used times, equal to mgh/mean used time. It does not simply average trial powers. The record badge needs two usable riser readings, three usable times, resolved entered issues, a plan and explanations; it does not verify the experiment."
                  mode={mode}
                />
              </p>
              <ProjectReport
                mode={mode}
                report={powerMarkdown(draft)}
                hasData={powerHasData(draft)}
                fileName="physics-stair-power.md"
                downloadLabel={t(
                  '下载我的双语功率记录',
                  'Download my bilingual power record',
                )}
                reportLabel={t(
                  '功率调查双语报告',
                  'Bilingual power investigation report',
                )}
              />
            </section>
          )}
          <div className="phy-lesson-footer">
            <button
              className="phy-button secondary"
              disabled={step === 0}
              onClick={() => update((old) => ({ ...old, step: old.step - 1 }))}
            >
              <B zh="← 上一步" en="← Back" mode={mode} />
            </button>
            <span>{step + 1} / 4</span>
            {step < 3 ? (
              <button
                className="phy-button"
                onClick={() =>
                  update((old) => ({ ...old, step: old.step + 1 }))
                }
              >
                <B zh="下一步" en="Next" mode={mode} />
              </button>
            ) : (
              <Link
                className="phy-button"
                to="/physics/lesson/human-power-vertical-rise"
              >
                <B zh="回看功率课" en="Revisit the power lesson" mode={mode} />
              </Link>
            )}
          </div>
        </div>
        <aside className="phy-power-ledger">
          <p className="phy-eyebrow">YOUR TASK / YOUR LEDGER</p>
          <h3>
            <B zh="同一段上楼的账本" en="Ledger for this flight" mode={mode} />
          </h3>
          <span className="phy-tag">
            <B
              zh={
                state.completed
                  ? '记录完整'
                  : state.planned
                    ? '计划已准备好'
                    : '调查草稿'
              }
              en={
                state.completed
                  ? 'Record complete'
                  : state.planned
                    ? 'Plan ready'
                    : 'Investigation draft'
              }
              mode={mode}
            />
          </span>
          <dl>
            {[
              [t('总质量', 'Total mass'), fmt(state.mass), 'kg'],
              [
                t('垂直高度估算', 'Estimated vertical rise'),
                fmt(state.rise),
                'm',
              ],
              [
                t('势能增加估算', 'Estimated gravitational increase'),
                fmt(state.work),
                'J',
              ],
              [t('使用均时间', 'Used mean time'), fmt(state.times.mean), 's'],
              [
                t('机械功率估算', 'Estimated mechanical power'),
                fmt(state.power),
                'W',
              ],
            ].map(([label, value, unit], i) => (
              <div key={i}>
                <dt>
                  <Text value={label as LocalizedText} mode={mode} />
                </dt>
                <dd>
                  {value as string} <small>{unit as string}</small>
                </dd>
              </div>
            ))}
          </dl>
          <p>
            <B
              zh="P≈m×10×h÷t。这里t是使用均时间，h是竖直高度估算，g≈10 N/kg。"
              en="P≈m×10×h/t. Here t is mean used time, h is estimated vertical rise and g≈10 N/kg."
              mode={mode}
            />
          </p>
          <p>
            <B
              zh="人+地球的势能增加，忽略起终点动能差及其他去向；不是食物能量消耗、全部肌肉做功或健康评分。"
              en="Person–Earth gravitational increase, omitting endpoint kinetic changes and other destinations. Not food-energy use, all muscular work or a health score."
              mode={mode}
            />
          </p>
          <p>
            <B
              zh="数值显示有四舍五入，不代表仪器精度。这里填写的记录留在此浏览器。"
              en="Rounded displays do not claim instrument precision. Entered records stay in this browser."
              mode={mode}
            />
          </p>
        </aside>
      </div>
    </div>
  );
}
