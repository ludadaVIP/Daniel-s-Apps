import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { ProjectReport } from './ProjectReport';
import { t } from './content/schema';
import {
  emptyWalking,
  walkingDistances,
  MAX_WALKING_TRIALS,
  walkingFields,
  walkingSummary,
  walkingGraph,
  walkingState,
  walkingNumber,
  walkingMarkdown,
  type WalkingDraft,
  type WalkingReading,
} from './walking';
type Props = { mode: LanguageMode; store: ProgressStore };
const exampleDraft: WalkingDraft = {
  fields: { midpoint: '4', endpoint: '9' },
  readings: Object.fromEntries(
    walkingDistances.flatMap((d) =>
      [1, 2, 3].map((n) => [
        `${d}-${n}`,
        { time: String(d + n - 2), note: '', excluded: false },
      ]),
    ),
  ),
  updatedAt: 0,
};
function WalkingChart({
  draft,
  mode,
}: {
  draft: WalkingDraft;
  mode: LanguageMode;
}) {
  const [view, setView] = useState<'journey' | 'trials'>('journey');
  const graph = walkingGraph(draft);
  const trials = walkingDistances.flatMap((d) =>
    walkingSummary(draft, d)
      .trials.filter((r) => r.time !== undefined)
      .map((r) => ({
        time: r.time!,
        distance: d,
        excluded: r.excluded,
        trial: r.trial,
      })),
  );
  const points = view === 'journey' ? (graph?.points ?? []) : trials;
  const maxTime =
    view === 'journey'
      ? (graph?.end ?? 10)
      : Math.max(10, ...trials.map((r) => r.time));
  const maxDistance = view === 'journey' ? 10 : 20;
  const x = (time: number) => 85 + (time / maxTime) * 440,
    y = (distance: number) => 245 - (distance / maxDistance) * 180;
  return (
    <div className="phy-walking-chart">
      <div className="phy-lab-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Graph views' : '图像视图'}
        >
          <button
            aria-pressed={view === 'journey'}
            className={view === 'journey' ? 'selected' : ''}
            onClick={() => setView('journey')}
          >
            <B zh="同一趟行程" en="One journey" mode={mode} />
          </button>
          <button
            aria-pressed={view === 'trials'}
            className={view === 'trials' ? 'selected' : ''}
            onClick={() => setView('trials')}
          >
            <B zh="独立试验散点" en="Separate trials" mode={mode} />
          </button>
        </div>
      </div>
      <p className="phy-walking-hint">
        <B
          zh={
            view === 'journey'
              ? '横轴 t (s)：从起点起的累计时间；纵轴 s (m)：这一趟累计走过的路程。'
              : '横轴 t (s)：各次试验总时间；纵轴 s (m)：各次试验总路程。'
          }
          en={
            view === 'journey'
              ? 'Horizontal t (s): elapsed time from the start. Vertical s (m): distance travelled in this journey.'
              : 'Horizontal t (s): total time of each trial. Vertical s (m): total distance of each trial.'
          }
          mode={mode}
        />
      </p>
      <svg
        viewBox="0 0 620 315"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Learner-entered elapsed time and distance graph'
            : '学习者输入的累计时间与路程图'
        }
      >
        {[0, maxDistance / 2, maxDistance].map((d) => (
          <g key={d}>
            <path d={`M85 ${y(d)}H525`} stroke="#e4d9ec" />
            <text x="65" y={y(d) + 5} textAnchor="end">
              {d}
            </text>
          </g>
        ))}
        <path d="M85 55v190h450" fill="none" stroke="#ab93be" />
        {[0, maxTime / 2, maxTime].map((time) => (
          <g key={time}>
            <path d={`M${x(time)} 245v6`} stroke="#ab93be" />
            <text x={x(time)} y="280" textAnchor="middle">
              {walkingNumber(time)}
            </text>
          </g>
        ))}
        <text x="85" y="37">
          s (m)
        </text>
        <text x="548" y="252">
          t (s)
        </text>
        {view === 'journey' && graph && (
          <polyline
            points={graph.points
              .map((p) => `${x(p.time)},${y(p.distance)}`)
              .join(' ')}
            fill="none"
            stroke="#9c7bb2"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        )}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={x(p.time)}
            cy={y(p.distance)}
            r="6"
            fill={'excluded' in p && p.excluded ? '#c19c74' : '#9c7bb2'}
            stroke="#fffcf8"
            strokeWidth="2"
          >
            <title>{`${p.time} s, ${p.distance} m`}</title>
          </circle>
        ))}
        {!points.length && (
          <text x="305" y="155" textAnchor="middle">
            {mode === 'en'
              ? 'Add valid readings below / above'
              : '填写有效读数后显示数据点'}
          </text>
        )}
      </svg>
      <p className="phy-walking-hint">
        <B
          zh={
            view === 'journey'
              ? '实点是你记录的检查点；虚线只是连接点的近似。只有起点、5 m和10 m三个点，不能证明每段匀速，也不能准确定位停留。'
              : '每个点是一趟独立试验：横轴为该次总时间，纵轴为该次路程。点之间不连线；它们不是同一人的连续运动。金色点为有原因的排除读数，仍保留显示。'
          }
          en={
            view === 'journey'
              ? 'Dots are your recorded checkpoints; dashed lines only approximate the intervals. Three points cannot establish constant speed or locate a pause precisely.'
              : 'Each dot is a separate trial: total time on the horizontal axis and total distance vertically. Dots are not joined: they are not one continuous journey. Gold dots are readings excluded with a reason, still retained.'
          }
          mode={mode}
        />
      </p>
      {view === 'journey' && graph && (
        <div className="phy-walking-metrics">
          <div>
            <B zh="前5 m平均速率" en="First 5 m average" mode={mode} />
            <strong>{walkingNumber(graph.firstSpeed)} m/s</strong>
          </div>
          <div>
            <B zh="后5 m平均速率" en="Last 5 m average" mode={mode} />
            <strong>{walkingNumber(graph.secondSpeed)} m/s</strong>
          </div>
          <div>
            <B zh="全程平均速率" en="Whole-trip average" mode={mode} />
            <strong>{walkingNumber(graph.averageSpeed)} m/s</strong>
          </div>
        </div>
      )}
      {view === 'journey' && graph && (
        <p className="phy-walking-hint">
          <B
            zh={`后半段时间 = ${graph.end} − ${graph.middle} = ${walkingNumber(graph.end - graph.middle)} s；不能把终点的累计时间直接当作后半段时间。`}
            en={`Second interval = ${graph.end} − ${graph.middle} = ${walkingNumber(graph.end - graph.middle)} s. The finish reading is cumulative, not the second interval alone.`}
            mode={mode}
          />
        </p>
      )}
    </div>
  );
}
export function WalkingProject({ mode, store }: Props) {
  const draft = store.progress.walkingProject ?? emptyWalking(),
    state = walkingState(draft);
  const update = (change: (old: WalkingDraft) => WalkingDraft) =>
    store.update((old) => ({
      ...old,
      walkingProject: {
        ...change(old.walkingProject ?? emptyWalking()),
        updatedAt: Date.now(),
      },
    }));
  const patchField = (key: string, value: string) =>
    update((old) => ({ ...old, fields: { ...old.fields, [key]: value } }));
  const patchReading = (id: string, patch: Partial<WalkingReading>) =>
    update((old) => ({
      ...old,
      readings: {
        ...old.readings,
        [id]: {
          time: '',
          note: '',
          excluded: false,
          ...old.readings[id],
          ...patch,
        },
      },
    }));
  const fields = (keys: string[]) =>
    walkingFields
      .filter((f) => keys.includes(f.key))
      .map((f) => (
        <label key={f.key}>
          <Text value={f.label} mode={mode} />
          {['midpoint', 'endpoint'].includes(f.key) ? (
            <input
              inputMode="decimal"
              maxLength={f.max}
              value={draft.fields[f.key] ?? ''}
              onChange={(e) => patchField(f.key, e.target.value)}
            />
          ) : (
            <textarea
              rows={f.key === 'explanation' ? 4 : 2}
              maxLength={f.max}
              value={draft.fields[f.key] ?? ''}
              onChange={(e) => patchField(f.key, e.target.value)}
            />
          )}
          <small>
            <Text value={f.hint} mode={mode} />
          </small>
        </label>
      ));
  const hasData =
    Object.values(draft.fields).some((v) => v.trim()) ||
    Object.values(draft.readings).some((r) => r.time.trim() || r.note.trim());
  return (
    <div className="phy-page phy-walking-page">
      <div className="phy-breadcrumb">
        <Link to="/physics/path">
          <B zh="学习路线" en="Learning path" mode={mode} />
        </Link>
        <span>/</span>
        <B zh="步行研究" en="Walking investigation" mode={mode} />
      </div>
      <p className="phy-eyebrow">STAGE 1 / YOUR OWN DATA</p>
      <h1>
        <B
          zh="你的步伐，藏着什么规律？"
          en="What can your footsteps reveal?"
          mode={mode}
        />
      </h1>
      <p className="phy-lead">
        <B
          zh="用真实步行记录比较5、10、20米。先猜、再量、保留每次读数；相近或不同的结果都值得解释。"
          en="Compare 5, 10 and 20 metres with real walking data. Predict, measure and keep every reading. Similar or different results both deserve an explanation."
          mode={mode}
        />
      </p>
      <div className="phy-walking-route" aria-hidden="true">
        <span>START · 0 m</span>
        <span>5 m</span>
        <span>10 m</span>
        <span>20 m →</span>
      </div>
      <details className="phy-project-section phy-walking-demo">
        <summary>
          <B
            zh="先看一份演示：这些数字怎样变成发现？"
            en="See an example: how do readings become discoveries?"
            mode={mode}
          />
        </summary>
        <p className="phy-walking-hint">
          <B
            zh="以下是编写的演示数据，不会填入或保存到你的记录。5 m三次用时4、5、6 s：均时5 s，范围2 s；合并速率 = (5+5+5) ÷ (4+5+6) = 1 m/s。10 m和20 m的演示均时分别为10 s和20 s，合并速率也为1 m/s。相近均值值得观察，但不能证明真实步速永远不变。"
            en="These constructed example data do not fill or save to your record. Three 5 m times are 4, 5 and 6 s: mean 5 s, range 2 s, pooled speed = (5+5+5)/(4+5+6) = 1 m/s. Example 10 m and 20 m means are 10 s and 20 s, also 1 m/s. Similar means are interesting, not proof that real walking pace never varies."
            mode={mode}
          />
        </p>
        <WalkingChart draft={exampleDraft} mode={mode} />
        <p className="phy-walking-hint">
          <B
            zh="图像演示是另一趟：4 s到5 m，9 s到10 m；后半段用了9−4=5 s。全程10÷9≈1.11 m/s。观察点之间可能有变化，虚线不能证明匀速。"
            en="The journey example is a separate trip: 5 m at 4 s and 10 m at 9 s; the second half takes 9−4=5 s. Whole-trip speed is 10/9≈1.11 m/s. Changes may occur between checkpoints; dashed lines cannot establish constant speed."
            mode={mode}
          />
        </p>
      </details>
      <div className="phy-project-layout">
        <div>
          <section className="phy-project-section">
            <h2>
              <B
                zh="01 / 先猜，再准备公平比较"
                en="01 / Predict and prepare a fair comparison"
                mode={mode}
              />
            </h2>
            <p className="phy-walking-hint">
              <B
                zh="尺或卷尺、计时器、几个路线标记，加一位帮忙计时的家人。由成人选择平坦且无车辆的路线，按舒服的步速走；空间不够时先做能完成的距离，草稿随时保留。"
                en="Use a ruler or tape, timer, route markers and a helper. An adult chooses a level route away from traffic; walk comfortably. If space is limited, begin with distances that fit and keep a partial draft."
                mode={mode}
              />
            </p>
            {fields(['prediction', 'route', 'fair', 'timing'])}
          </section>
          <section className="phy-project-section">
            <h2>
              <B
                zh="02 / 每段距离，走三次"
                en="02 / Three trials at each distance"
                mode={mode}
              />
            </h2>
            <p className="phy-walking-hint">
              <B
                zh="每次单独计时，单位为秒。计时器的反应、起步和实际步速都可能让读数不同。输入0–3600之间的正数，最多三位小数；数字有效不代表测量已核实。"
                en="Time each trial separately in seconds. Timing reactions, starting and real pace changes can cause differences. Enter positive seconds up to 3600, with at most three decimal places; valid numbers are not verified measurements."
                mode={mode}
              />
            </p>
            {walkingDistances.map((distance) => {
              const g = walkingSummary(draft, distance);
              return (
                <div className="phy-walking-distance" key={distance}>
                  <div className="phy-walking-distance-title">
                    <strong>{distance} m</strong>
                    <B
                      zh={`使用 ${g.count}/${g.trials.length} 次`}
                      en={`${g.count}/${g.trials.length} used`}
                      mode={mode}
                    />
                  </div>
                  <div className="phy-walking-trials">
                    {g.trials.map((r) => {
                      const id = `${distance}-${r.trial}`,
                        invalid =
                          Boolean(r.raw?.time.trim()) && r.time === undefined;
                      return (
                        <div className="phy-walking-trial" key={id}>
                          <label>
                            <B
                              zh={`第${r.trial}次时间（s）`}
                              en={`Trial ${r.trial} time (s)`}
                              mode={mode}
                            />
                            <input
                              aria-label={
                                mode === 'en'
                                  ? `${distance} m trial ${r.trial} time (s)`
                                  : `${distance}米第${r.trial}次时间（s）`
                              }
                              inputMode="decimal"
                              maxLength={16}
                              value={r.raw?.time ?? ''}
                              aria-invalid={invalid}
                              onChange={(e) =>
                                patchReading(id, { time: e.target.value })
                              }
                            />
                          </label>
                          <p className="phy-walking-speed">
                            <B zh="本次速率" en="Trial speed" mode={mode} />
                            <strong>{walkingNumber(r.speed)} m/s</strong>
                          </p>
                          {invalid && (
                            <p className="phy-walking-warning" role="status">
                              <B
                                zh="请用有效的正数秒；原输入已保留。"
                                en="Use valid positive seconds; your raw entry is retained."
                                mode={mode}
                              />
                            </p>
                          )}
                          {r.speed !== undefined && r.speed > 4 && (
                            <p className="phy-walking-warning">
                              <B
                                zh="这对自然步行偏快，请检查米/秒、计时和距离；原始读数仍保留。"
                                en="Fast for comfortable walking: check metres, seconds and timing. The raw reading stays."
                                mode={mode}
                              />
                            </p>
                          )}
                          <details className="phy-walking-evidence">
                            <summary>
                              <B
                                zh={
                                  r.raw?.excluded
                                    ? '备注与排除（已勾选）'
                                    : '备注与排除'
                                }
                                en={
                                  r.raw?.excluded
                                    ? 'Notes & exclusion (checked)'
                                    : 'Notes & exclusion'
                                }
                                mode={mode}
                              />
                            </summary>
                            <label>
                              <B
                                zh="发生了什么？"
                                en="What happened?"
                                mode={mode}
                              />
                              <textarea
                                aria-label={
                                  mode === 'en'
                                    ? `${distance} m trial ${r.trial} note`
                                    : `${distance}米第${r.trial}次备注`
                                }
                                rows={2}
                                maxLength={500}
                                value={r.raw?.note ?? ''}
                                onChange={(e) =>
                                  patchReading(id, { note: e.target.value })
                                }
                              />
                            </label>
                            <label className="phy-walking-flag">
                              <input
                                type="checkbox"
                                checked={r.raw?.excluded ?? false}
                                aria-label={
                                  mode === 'en'
                                    ? `Exclude ${distance} m trial ${r.trial}`
                                    : `排除${distance}米第${r.trial}次`
                                }
                                onChange={(e) =>
                                  patchReading(id, {
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
                                zh="先写实际原因，例如计时器提前停止；不能只因结果与猜想不同而排除。取消勾选可恢复汇总。"
                                en="Record an actual reason, such as a timer stopping early. Disagreement with a prediction is not a reason. Uncheck to restore."
                                mode={mode}
                              />
                            </small>
                          </details>
                          {r.pendingReason && (
                            <p className="phy-walking-warning" role="status">
                              <B
                                zh="补写原因后才排除；目前仍参与汇总。"
                                en="Add a reason to exclude; currently still included."
                                mode={mode}
                              />
                            </p>
                          )}
                          {r.excluded && (
                            <p className="phy-walking-hint">
                              <B
                                zh="原始读数保留，未参与使用均值。"
                                en="Original reading retained; omitted from used means."
                                mode={mode}
                              />
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="phy-text-button"
                    disabled={g.trials.length >= MAX_WALKING_TRIALS}
                    onClick={() =>
                      patchReading(`${distance}-${g.trials.length + 1}`, {
                        time: '',
                        note: '',
                        excluded: false,
                      })
                    }
                  >
                    <B
                      zh={
                        g.trials.length >= MAX_WALKING_TRIALS
                          ? `${distance} m 已保留12次；可导出后继续调查`
                          : `追加 ${distance} m 第${g.trials.length + 1}次，不覆盖原记录`
                      }
                      en={
                        g.trials.length >= MAX_WALKING_TRIALS
                          ? `${distance} m: 12 records retained; export before further investigation`
                          : `Add ${distance} m trial ${g.trials.length + 1}; keep originals`
                      }
                      mode={mode}
                    />
                  </button>
                  <div className="phy-walking-metrics">
                    <div>
                      <B zh="使用均时" en="Used mean time" mode={mode} />
                      <strong>{walkingNumber(g.meanTime)} s</strong>
                    </div>
                    <div>
                      <B zh="使用时间范围" en="Used time range" mode={mode} />
                      <strong>{walkingNumber(g.range)} s</strong>
                    </div>
                    <div>
                      <B
                        zh="合并平均速率"
                        en="Pooled average speed"
                        mode={mode}
                      />
                      <strong>{walkingNumber(g.averageSpeed)} m/s</strong>
                    </div>
                  </div>
                  <p className="phy-walking-hint">
                    <B
                      zh={`全部有效原始读数均时：${walkingNumber(g.rawMean)} s。${g.count < 2 ? '至少两次使用读数后，才比较重复结果。' : '对照每次读数与范围，再比较不同距离。'}`}
                      en={`All valid raw readings: mean ${walkingNumber(g.rawMean)} s. ${g.count < 2 ? 'Use at least two readings before comparing repeated results.' : 'Compare individual readings and ranges before comparing distances.'}`}
                      mode={mode}
                    />
                  </p>
                </div>
              );
            })}
            <p className="phy-walking-hint">
              <B
                zh="使用均时 = 使用时间总和 ÷ 使用次数；范围 = 最大时间 − 最小时间（不是完整测量误差）。合并平均速率 = 使用路程总和 ÷ 使用时间总和，不包含试验间的休息。不要直接平均各次速率。显示值已四舍五入，并不代表仪器有这样的精度。"
                en="Used mean = summed used times / count; range = maximum − minimum (not full measurement uncertainty). Pooled average = summed used distances / summed used times, excluding rests between trials. Do not simply average trial speeds. Displayed values are rounded, not a claim of instrument accuracy."
                mode={mode}
              />
            </p>
          </section>
          <section className="phy-project-section">
            <h2>
              <B
                zh="03 / 让同一趟行程讲一个故事"
                en="03 / Tell the story of one journey"
                mode={mode}
              />
            </h2>
            <p className="phy-walking-hint">
              <B
                zh="另走一趟10 m。在5 m、10 m分别记下从起点开始的累计时间，中途不重置。这里要研究同一趟的两个区间，不能把独立试验拼起来。"
                en="Walk another 10 m trip. At 5 m and 10 m record elapsed time from the same start, without resetting. These are intervals of one journey; do not join separate trials."
                mode={mode}
              />
            </p>
            <div className="phy-walking-checkpoints">
              {fields(['midpoint', 'endpoint'])}
            </div>
            {(draft.fields.midpoint?.trim() || draft.fields.endpoint?.trim()) &&
              !walkingGraph(draft) && (
                <p className="phy-walking-warning" role="status">
                  <B
                    zh="两项都要是有效秒数，且10 m累计时间必须大于5 m累计时间；不会绘制矛盾的数据线。"
                    en="Both must be valid seconds, with the 10 m reading later than the 5 m reading. Inconsistent readings are not plotted as a journey."
                    mode={mode}
                  />
                </p>
              )}
            <WalkingChart draft={draft} mode={mode} />
            {fields(['graphObservation'])}
          </section>
          <section className="phy-project-section">
            <h2>
              <B
                zh="04 / 用证据解释，留下新问题"
                en="04 / Explain with evidence and ask again"
                mode={mode}
              />
            </h2>
            {fields(['explanation', 'next'])}
          </section>
        </div>
        <aside className="phy-project-guide">
          <h2>
            <B
              zh="这次研究的工具箱"
              en="Your investigation toolkit"
              mode={mode}
            />
          </h2>
          <p>
            <B
              zh="v̄ = 总路程 / 总时间"
              en="Average speed = total distance / total time"
              mode={mode}
            />
          </p>
          <ol>
            <li>
              <B
                zh="先计划，再测每段三次。"
                en="Plan, then time each distance three times."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="保留异常读数与实际原因。"
                en="Keep unusual readings and actual reasons."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="多次试验用散点，同一行程用累计时间。"
                en="Use dots for trials and elapsed time for one journey."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="讲给家人听：你的证据支持什么？"
                en="Explain to your family: what do the data support?"
                mode={mode}
              />
            </li>
          </ol>
          <div className="phy-project-status" role="status">
            <strong>
              <B
                zh={
                  state.completed
                    ? '研究记录完整'
                    : state.measured
                      ? '重复测量已记录'
                      : state.planned
                        ? '计划已准备好'
                        : '从一个猜想开始'
                }
                en={
                  state.completed
                    ? 'Investigation record complete'
                    : state.measured
                      ? 'Repeated readings recorded'
                      : state.planned
                        ? 'Plan ready'
                        : 'Start with a prediction'
                }
                mode={mode}
              />
            </strong>
            <p>
              <B
                zh={`计划 ${state.planned ? '✓' : '○'} · 三组记录 ${state.measured ? '✓' : '○'} · 同趟图像 ${walkingGraph(draft) ? '✓' : '○'}。每组至少三次参与汇总，排除或无效输入需处理；另需图像观察与解释。有操作问题就追加重测，保留原记录。徽章只表示填写完整，不验证科学结论。`}
                en={`Plan ${state.planned ? '✓' : '○'} · Three groups ${state.measured ? '✓' : '○'} · Journey graph ${walkingGraph(draft) ? '✓' : '○'}. Use at least three readings per group and resolve pending exclusions or invalid entries; add graph observations and an explanation. Add repeat trials after procedure problems, retaining originals. The badge means filled records, not a verified conclusion.`}
                mode={mode}
              />
            </p>
          </div>
          <p>
            <B
              zh={
                store.storageAvailable
                  ? '草稿自动保存在此浏览器。'
                  : '浏览器无法保存；请下载草稿。'
              }
              en={
                store.storageAvailable
                  ? 'Draft saves automatically in this browser.'
                  : 'Browser storage is unavailable; download your draft.'
              }
              mode={mode}
            />
          </p>
          <ProjectReport
            mode={mode}
            report={walkingMarkdown(draft)}
            hasData={hasData}
            fileName="physics-walking-investigation.md"
            downloadLabel={t('下载步行研究', 'Download walking report')}
            reportLabel={t('双语步行研究报告', 'Bilingual walking report')}
          />
          <Link className="phy-text-button" to="/physics/lesson/average-speed">
            <B zh="复习平均速率 →" en="Revisit average speed →" mode={mode} />
          </Link>
          <Link
            className="phy-text-button"
            to="/physics/lesson/reading-motion-graphs"
          >
            <B zh="复习运动图像 →" en="Revisit motion graphs →" mode={mode} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
