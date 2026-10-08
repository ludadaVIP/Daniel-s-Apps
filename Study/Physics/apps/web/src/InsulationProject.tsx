import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { t } from './content/schema';
import { materialNumber } from './materials';
import { ProjectReport } from './ProjectReport';
import {
  emptyInsulation,
  emptyInsulationReading,
  insulationState,
  insulationFormat as fmt,
  insulationReading,
  insulationSetup,
  insulationPlanFields,
  insulationExplainFields,
  insulationMarkdown,
  insulationHasData,
  MAX_INSULATION_READINGS,
  type InsulationDraft,
  type InsulationReading,
} from './insulation';
const steps = [
  t('准备', 'Prepare'),
  t('记录起点', 'Starting point'),
  t('一起计时', 'Shared clock'),
  t('解释与报告', 'Explain & report'),
];
const rowFields = [
  {
    key: 'time',
    label: t('已过时间 / min', 'Elapsed time / min'),
    max: 120,
    zero: false,
  },
  {
    key: 'a',
    label: t('A温度 / °C', 'A temperature / °C'),
    max: 60,
    zero: true,
  },
  {
    key: 'b',
    label: t('B温度 / °C', 'B temperature / °C'),
    max: 60,
    zero: true,
  },
  {
    key: 'room',
    label: t('室温 / °C（选填）', 'Room °C (optional)'),
    max: 60,
    zero: true,
  },
] as const;
function CupArt() {
  return (
    <svg viewBox="0 0 320 150" aria-hidden="true">
      <path
        d="M55 48h70l-6 75H61Z"
        fill="#e9dfef"
        stroke="#ac96bb"
        strokeWidth="2"
      />
      <path d="M61 70h58l-4 48H65Z" fill="#c8b5d9" />
      <path
        d="M200 48h70l-6 75h-58Z"
        fill="#eadcc8"
        stroke="#b59970"
        strokeWidth="2"
      />
      <path d="M204 70h62l-4 48h-54Z" fill="#c8b5d9" />
      <path
        d="M194 65h82l-5 53h-72Z"
        fill="#b9c9b5"
        fillOpacity=".8"
        stroke="#88ac9a"
        strokeDasharray="5 4"
      />
      <path
        d="M80 32q-12-8 0-16m20 16q-12-8 0-16m125 16q-12-8 0-16m20 16q-12-8 0-16"
        stroke="#ac96bb"
        fill="none"
        strokeWidth="2"
      />
      <text x="90" y="144" textAnchor="middle">
        A
      </text>
      <text x="235" y="144" textAnchor="middle">
        B
      </text>
    </svg>
  );
}
export function InsulationChart({
  draft,
  mode,
  example = false,
}: {
  draft: InsulationDraft;
  mode: LanguageMode;
  example?: boolean;
}) {
  const s = insulationState(draft);
  const visible = s.readings
    .map((r, i) => ({ ...r, i }))
    .filter(
      (r) => r.time !== undefined && r.a !== undefined && r.b !== undefined,
    );
  const end = Math.max(10, ...visible.map((r) => r.time!)),
    x = (n: number) => 60 + (n / end) * 520,
    y = (n: number) => 260 - (n / 60) * 210;
  const baselineNumbers = s.initialA !== undefined && s.initialB !== undefined;
  return (
    <figure className="phy-insulation-chart">
      <div className="phy-insulation-legend">
        <span>
          A · <B zh="未包裹" en="Bare" mode={mode} />
        </span>
        <span>
          B · <B zh="包裹" en="Wrapped" mode={mode} />
        </span>
      </div>
      <svg
        viewBox="0 0 640 310"
        role="img"
        aria-label={
          mode === 'en'
            ? `${example ? 'Constructed example' : 'My readings'}: temperature against elapsed minutes, A and B on shared axes`
            : `${example ? '编写示例' : '我的读数'}：两杯温度与已过分钟，共用坐标轴`
        }
      >
        {[0, 20, 40, 60].map((v) => (
          <g key={v}>
            <path d={`M60 ${y(v)}H580`} stroke="#e3d9e8" />
            <text x="48" y={y(v) + 7} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <path d="M60 40v220h530" fill="none" stroke="#a18aab" />
        {[0, end / 2, end].map((v) => (
          <text key={v} x={x(v)} y="290" textAnchor="middle">
            {Number(v.toFixed(2))}
          </text>
        ))}
        <text x="60" y="27">
          °C
        </text>
        <text x="580" y="27" textAnchor="end">
          min
        </text>
        {(['a', 'b'] as const).map((key) => {
          const initial = key === 'a' ? s.initialA : s.initialB,
            color = key === 'a' ? '#9b7cb0' : '#a3885c';
          const connected =
            s.baseline && s.ordered
              ? [
                  { time: 0, value: initial! },
                  ...s.used.map((r) => ({ time: r.time!, value: r[key]! })),
                ]
              : [];
          return (
            <g key={key}>
              {connected.length > 1 && (
                <polyline
                  points={connected
                    .map((p) => `${x(p.time)},${y(p.value)}`)
                    .join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              )}
              {baselineNumbers && (
                <circle
                  cx={x(0)}
                  cy={y(initial!)}
                  r="6"
                  stroke={color}
                  strokeWidth="2.5"
                  fill={s.baseline ? color : '#fffcf8'}
                >
                  <title>
                    {key.toUpperCase()}: 0 min, {initial} °C
                  </title>
                </circle>
              )}
              {visible.map((r) => (
                <circle
                  key={r.i}
                  cx={x(r.time!)}
                  cy={y(r[key]!)}
                  r="6"
                  stroke={color}
                  strokeWidth="2.5"
                  fill={r.used ? color : '#fffcf8'}
                >
                  <title>
                    {key.toUpperCase()}: {r.time} min, {r[key]} °C —{' '}
                    {r.used ? '使用 / Used' : '未使用 / Not used'}
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
        {!baselineNumbers && !visible.length && (
          <text x="320" y="145" textAnchor="middle">
            {mode === 'en'
              ? 'Your readings appear here'
              : '你的读数会出现在这里'}
          </text>
        )}
      </svg>
      <figcaption>
        <B
          zh={
            example
              ? '编写示例，不是实测，也不填入你的记录。'
              : '实心：已确认使用；空心：可画出的未使用原读数。'
          }
          en={
            example
              ? 'Constructed example, not measurements; it does not fill your record.'
              : 'Filled: checked used readings. Hollow: plottable unused originals.'
          }
          mode={mode}
        />{' '}
        <B
          zh="虚线是读数间的近似，不能说明每一刻的温度。不同时间不取平均。"
          en="Dashed lines approximate between readings, not every instant. Do not average different times."
          mode={mode}
        />
      </figcaption>
    </figure>
  );
}
function exampleDraft() {
  const d = emptyInsulation();
  d.setup = {
    massA: '100',
    massB: '100',
    initialA: '40',
    initialB: '40',
    room: '20',
  };
  d.initialChecked = true;
  d.readings = [
    { time: '2', a: '37', b: '39' },
    { time: '4', a: '34', b: '38' },
    { time: '6', a: '32', b: '37' },
  ].map((r) => ({ ...emptyInsulationReading(), ...r, checked: true }));
  return d;
}
export function InsulationProject({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const d = store.progress.insulationProject ?? emptyInsulation(),
    s = insulationState(d);
  const update = (change: (old: InsulationDraft) => InsulationDraft) =>
    store.update((old) => ({
      ...old,
      insulationProject: {
        ...change(old.insulationProject ?? emptyInsulation()),
        updatedAt: Date.now(),
      },
    }));
  const patch = (i: number, change: Partial<InsulationReading>) =>
    update((old) => ({
      ...old,
      readings: old.readings.map((r, n) => (n === i ? { ...r, ...change } : r)),
    }));
  const field = (
    f:
      | (typeof insulationPlanFields)[number]
      | (typeof insulationExplainFields)[number],
  ) => (
    <label key={f.key}>
      <Text value={f.label} mode={mode} />
      <textarea
        rows={2}
        maxLength={f.max}
        aria-label={mode === 'en' ? f.label.en : f.label.zh}
        value={d.fields[f.key] ?? ''}
        onChange={(e) =>
          update((old) => ({
            ...old,
            fields: { ...old.fields, [f.key]: e.target.value },
            ...(f.key === 'conditions' || f.key === 'procedure'
              ? {
                  initialChecked: false,
                  readings: old.readings.map((r) => ({ ...r, checked: false })),
                }
              : {}),
          }))
        }
      />
      <small>
        <Text value={f.hint} mode={mode} />
      </small>
    </label>
  );
  return (
    <div className="phy-page phy-power-page phy-insulation-page">
      <Link className="phy-back" to="/physics/path">
        <B zh="← 返回探索路线" en="← Back to the learning path" mode={mode} />
      </Link>
      <div className="phy-power-hero">
        <div>
          <p className="phy-eyebrow">STAGE 2 / KEEP THE WARMTH</p>
          <h1>
            <B
              zh="两杯温水，一个自己的发现。"
              en="Two warm cups. One discovery of your own."
              mode={mode}
            />
          </h1>
          <p className="phy-lead">
            <B
              zh="让包裹成为唯一计划改变的因素，看看温度怎样随时间变化。"
              en="Plan to change only the wrapping, then see how temperatures change over time."
              mode={mode}
            />
          </p>
        </div>
        <div className="phy-power-hero-art">
          <CupArt />
        </div>
      </div>
      <nav
        className="phy-step-nav phy-power-steps"
        aria-label={mode === 'en' ? 'Investigation steps' : '调查步骤'}
      >
        {steps.map((v, i) => (
          <button
            key={i}
            className={d.step === i ? 'active' : ''}
            aria-current={d.step === i ? 'step' : undefined}
            onClick={() => update((old) => ({ ...old, step: i }))}
          >
            <span>{i + 1}</span>
            <Text value={v} mode={mode} />
          </button>
        ))}
      </nav>
      <div className="phy-project-layout">
        <div>
          {d.step === 0 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="01 / 先想怎样公平比较"
                  en="01 / Plan a fair comparison"
                  mode={mode}
                />
              </h2>
              <p className="phy-power-note">
                <B
                  zh="请家人协助准备摸着舒适的温水，例如约35–40°C；不用开水、不加热。用稳定的相同杯子，包裹只在外侧，保持盖子一致，温度计按说明使用。没有工具就先保存计划。此档案只记录同一次实验。"
                  en="Ask a helper to prepare comfortably warm water, for example about 35–40°C. No boiling water or heating. Use stable matching cups, wrap only the outside, keep lids matched and follow thermometer instructions. Without tools, save a plan first. This record holds one run."
                  mode={mode}
                />
              </p>
              {insulationPlanFields.map(field)}
              <details className="phy-power-example">
                <summary>
                  <B
                    zh="看一个编写示例，不填入我的记录"
                    en="See a constructed example without filling my record"
                    mode={mode}
                  />
                </summary>
                <InsulationChart draft={exampleDraft()} mode={mode} example />
                <p>
                  <B
                    zh="两杯各100 g，从40°C开始，室温20°C；6分钟时A32°C、B37°C，各下降8°C与3°C。这里只说明怎样读图，不能据此预言你家的杯子。"
                    en="Both cups: 100 g, initially 40°C, room 20°C. At 6 min A is 32°C and B 37°C: drops of 8°C and 3°C. This illustrates reading a graph, not a prediction for your cups."
                    mode={mode}
                  />
                </p>
              </details>
            </section>
          )}
          {d.step === 1 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="02 / 两杯的0分钟"
                  en="02 / Minute zero for both cups"
                  mode={mode}
                />
              </h2>
              <p className="phy-power-note">
                <B
                  zh="两杯各记录一次起始温度，共用一个计时起点。接下来的时间都是从这个起点已过的分钟；记录水本身的质量，不包含杯子。输入范围是本调查的工具范围，不代表物理量的全部范围。"
                  en="Record each initial temperature with one shared clock start. Later times are minutes elapsed from that start. Record water mass, excluding the cup. Input limits belong to this investigation, not the full range of physics."
                  mode={mode}
                />
              </p>
              <div className="phy-power-numbers">
                {insulationSetup.map((f) => {
                  const value = d.setup[f.key] ?? '',
                    invalid =
                      !!value.trim() &&
                      materialNumber(value, f.max, f.zero) === undefined;
                  return (
                    <label key={f.key}>
                      <Text value={f.label} mode={mode} />
                      <input
                        inputMode="decimal"
                        maxLength={16}
                        aria-label={mode === 'en' ? f.label.en : f.label.zh}
                        aria-invalid={invalid}
                        value={value}
                        onChange={(e) =>
                          update((old) => ({
                            ...old,
                            setup: { ...old.setup, [f.key]: e.target.value },
                            initialChecked: false,
                            readings: old.readings.map((r) => ({
                              ...r,
                              checked: false,
                            })),
                          }))
                        }
                      />
                      {invalid && (
                        <small role="status">
                          <B
                            zh={`请输入${f.zero ? '0' : '大于0'}至${f.max}的小数；原输入保留。`}
                            en={`Enter a decimal ${f.zero ? 'from 0' : 'above 0'}, at most ${f.max}; original retained.`}
                            mode={mode}
                          />
                        </small>
                      )}
                    </label>
                  );
                })}
              </div>
              <label className="phy-power-check">
                <input
                  type="checkbox"
                  checked={d.initialChecked}
                  onChange={(e) =>
                    update((old) => ({
                      ...old,
                      initialChecked: e.target.checked,
                    }))
                  }
                />
                <B
                  zh="已核对单位、两杯标签、水质量与共同计时起点；条件差别如实写进计划。"
                  en="Checked units, cup labels, water masses and shared clock start; condition differences are recorded in my plan."
                  mode={mode}
                />
              </label>
              <p className="phy-power-note">
                <B
                  zh="修改起点、条件或测量方法会取消读数确认，原输入仍保留。请据实重新核对；不要把旧实验改成新实验。"
                  en="Changing the start, conditions or method clears reading confirmations and retains originals. Recheck honestly; do not turn an old run into a new one."
                  mode={mode}
                />
              </p>
            </section>
          )}
          {d.step === 2 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="03 / 同一计时起点，保留每一对读数"
                  en="03 / One clock start. Retain every reading pair."
                  mode={mode}
                />
              </h2>
              <InsulationChart draft={d} mode={mode} />
              <p className="phy-power-note">
                <B
                  zh="按实际测量先后记录至少3个后续时间点。温度不一定每次都下降，先查过程，不改成“好看”的曲线；两杯读数有明显时间差就写备注，不能当作精确同时。"
                  en="Enter at least 3 later time points in measurement order. Temperatures need not fall at every reading: investigate the procedure, not a prettier curve. Note meaningful delays between cups; do not treat them as exactly simultaneous."
                  mode={mode}
                />
              </p>
              {!s.ordered && (
                <p className="phy-power-alert" role="status">
                  <B
                    zh="使用的时间有重复或倒序，暂不连线，也不汇总最新降温量。查原记录；有过程问题时写原因并保留排除。"
                    en="Used times repeat or reverse. Connections and latest drops are withheld. Check originals; document and retain any excluded procedure issue."
                    mode={mode}
                  />
                </p>
              )}
              <div className="phy-power-readings">
                {d.readings.map((r, i) => {
                  const v = insulationReading(r);
                  return (
                    <article
                      className={`phy-power-trial ${v.excluded ? 'excluded' : ''}`}
                      key={i}
                    >
                      <div className="phy-power-trial-heading">
                        <strong>
                          <B
                            zh={`原始记录 ${i + 1}`}
                            en={`Original record ${i + 1}`}
                            mode={mode}
                          />
                        </strong>
                        <span>
                          <B
                            zh={
                              v.excluded
                                ? '保留并排除'
                                : v.pendingReason
                                  ? '待补原因'
                                  : v.used
                                    ? '使用'
                                    : '未使用'
                            }
                            en={
                              v.excluded
                                ? 'Retained, excluded'
                                : v.pendingReason
                                  ? 'Reason needed'
                                  : v.used
                                    ? 'Used'
                                    : 'Not used'
                            }
                            mode={mode}
                          />
                        </span>
                      </div>
                      <div className="phy-insulation-inputs">
                        {rowFields.map((f) => (
                          <label key={f.key}>
                            <Text value={f.label} mode={mode} />
                            <input
                              inputMode="decimal"
                              maxLength={16}
                              aria-label={
                                mode === 'en'
                                  ? `${f.label.en} ${i + 1}`
                                  : `${f.label.zh} ${i + 1}`
                              }
                              aria-invalid={
                                !!r[f.key].trim() &&
                                materialNumber(r[f.key], f.max, f.zero) ===
                                  undefined
                              }
                              value={r[f.key]}
                              onChange={(e) =>
                                patch(i, {
                                  [f.key]: e.target.value,
                                  checked: false,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                      <label className="phy-power-check">
                        <input
                          type="checkbox"
                          checked={r.checked}
                          onChange={(e) =>
                            patch(i, { checked: e.target.checked })
                          }
                        />
                        <B
                          zh="已核对同次实验的已过时间、A/B标签与读数过程。"
                          en="Checked this run’s elapsed time, A/B labels and reading procedure."
                          mode={mode}
                        />
                      </label>
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
                              ? `Reading note ${i + 1}`
                              : `读数备注${i + 1}`
                          }
                          value={r.note}
                          onChange={(e) => patch(i, { note: e.target.value })}
                        />
                      </label>
                      <label className="phy-power-check">
                        <input
                          type="checkbox"
                          checked={r.excluded}
                          onChange={(e) =>
                            patch(i, { excluded: e.target.checked })
                          }
                        />
                        <B
                          zh="有过程问题，申请排除（保留原读数）"
                          en="Exclude for a procedure issue (retain originals)"
                          mode={mode}
                        />
                      </label>
                      {v.pendingReason && (
                        <p className="phy-power-alert" role="status">
                          <B
                            zh="先写原因；有效且已确认的读数目前仍使用。数值不同本身不是排除理由。"
                            en="Give a reason first; valid checked readings remain used for now. Difference alone is not a reason."
                            mode={mode}
                          />
                        </p>
                      )}
                      {v.entered && !v.valid && !v.excluded && (
                        <p className="phy-power-alert" role="status">
                          <B
                            zh="时间需要大于0且不超过120 min，两杯温度需0–60°C。室温可空白；填入时需0–60°C。只输入小数，原输入保留。"
                            en="Time must be above 0, at most 120 min; both temperatures 0–60°C. Room may be blank or 0–60°C. Enter decimals only; originals are retained."
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
                disabled={d.readings.length >= MAX_INSULATION_READINGS}
                onClick={() =>
                  update((old) => ({
                    ...old,
                    readings: [...old.readings, emptyInsulationReading()],
                  }))
                }
              >
                <B
                  zh={
                    d.readings.length >= MAX_INSULATION_READINGS
                      ? '12条原记录已保留'
                      : '＋ 增加时间点，保留原记录'
                  }
                  en={
                    d.readings.length >= MAX_INSULATION_READINGS
                      ? '12 original records retained'
                      : '＋ Add a time point, keep originals'
                  }
                  mode={mode}
                />
              </button>
            </section>
          )}
          {d.step === 3 && (
            <section className="phy-project-section">
              <h2>
                <B
                  zh="04 / 用自己的读数说话"
                  en="04 / Let your readings speak"
                  mode={mode}
                />
              </h2>
              <InsulationChart draft={d} mode={mode} />
              {insulationExplainFields.map(field)}
              <p className="phy-power-note">
                <B
                  zh="这是一次实验的温度记录。降温量不是能量，不能直接算包裹材料的热导率；没有足够证据时，不下结论也有价值。"
                  en="This records temperatures from one run. A drop is not energy and cannot directly give wrapping conductivity. An inconclusive result is valuable too."
                  mode={mode}
                />
              </p>
              <ProjectReport
                mode={mode}
                report={insulationMarkdown(d)}
                hasData={insulationHasData(d)}
                fileName="my-insulation-investigation.md"
                downloadLabel={t(
                  '导出双语保温报告',
                  'Export bilingual insulation report',
                )}
                reportLabel={t(
                  '保温调查双语报告',
                  'Bilingual insulation report',
                )}
              />
            </section>
          )}
          <div className="phy-lesson-footer">
            <button
              className="phy-button secondary"
              disabled={d.step === 0}
              onClick={() => update((old) => ({ ...old, step: old.step - 1 }))}
            >
              <B zh="← 上一步" en="← Previous" mode={mode} />
            </button>
            {d.step < 3 && (
              <button
                className="phy-button"
                onClick={() =>
                  update((old) => ({ ...old, step: old.step + 1 }))
                }
              >
                <B zh="下一步 →" en="Next →" mode={mode} />
              </button>
            )}
          </div>
        </div>
        <aside className="phy-power-ledger">
          <p className="phy-eyebrow">MY CUP EVIDENCE</p>
          <h3>
            <B
              zh={s.completed ? '记录完整' : '我的保温调查'}
              en={
                s.completed ? 'Record complete' : 'My insulation investigation'
              }
              mode={mode}
            />
          </h3>
          <dl>
            <div>
              <dt>
                <B zh="起点" en="Starting point" mode={mode} />
              </dt>
              <dd>
                <B
                  zh={s.baseline ? '已确认' : '待核对'}
                  en={s.baseline ? 'Checked' : 'Check needed'}
                  mode={mode}
                />
              </dd>
            </div>
            <div>
              <dt>
                <B
                  zh="已确认使用的后续时间点"
                  en="Checked used later time points"
                  mode={mode}
                />
              </dt>
              <dd>
                {s.used.length} <small>/ ≥3</small>
              </dd>
            </div>
            <div>
              <dt>
                <B zh="最新使用时间" en="Latest used time" mode={mode} />
              </dt>
              <dd>
                {s.ordered ? fmt(s.used.at(-1)?.time) : '—'} <small>min</small>
              </dd>
            </div>
            <div>
              <dt>
                <B
                  zh="各自降温量 T₀−T"
                  en="Each temperature drop T₀−T"
                  mode={mode}
                />
              </dt>
              <dd>
                A {fmt(s.dropA)} <small>°C</small>
                <br />B {fmt(s.dropB)} <small>°C</small>
              </dd>
            </div>
          </dl>
          {s.unequalStart && (
            <p className="phy-power-alert">
              <B
                zh="起始质量或温度不同：原数据保留。不能仅按最后温度判断包裹效果，也不能仅用降温量消除条件差别。"
                en="Starting masses or temperatures differ: originals are kept. Final temperature alone cannot judge wrapping, and drops do not remove condition differences."
                mode={mode}
              />
            </p>
          )}
          {s.notWarm && (
            <p className="phy-power-alert">
              <B
                zh="至少一杯起始不比室温高：可能升温，不能当作两杯温水冷却的比较。"
                en="At least one cup is not initially above room temperature: it may warm, so this is not a matched warm-water cooling comparison."
                mode={mode}
              />
            </p>
          )}
          <p>
            <B
              zh="完整记录需要计划、已确认起点、至少3个按时间递增的使用点、处理所有已填记录和自己的解释。徽章只表示记录齐全，不认证理解或结论正确。"
              en="Completion needs a plan, checked start, at least 3 increasing used times, resolved entered records and your explanations. The badge marks completeness, not verified understanding or a correct conclusion."
              mode={mode}
            />
          </p>
          <p>
            <B
              zh="此设备浏览器自动保存；导出报告可保留副本。"
              en="Autosaved in this device’s browser; export a report to keep a copy."
              mode={mode}
            />
          </p>
        </aside>
      </div>
    </div>
  );
}
