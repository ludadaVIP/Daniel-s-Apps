import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { t } from './content/schema';
import { ProjectReport } from './ProjectReport';
import { useAnimation } from './interactive/useSimulation';
import { pointOnPath } from './interactive/lightModels';
import { periscopeRay } from './interactive/periscopeModel';
import {
  emptyPeriscope,
  emptyPeriscopeTrial,
  periscopeTrial,
  periscopeState,
  periscopeHasData,
  revisePeriscopeField,
  revisePeriscopeTrial,
  MAX_PERISCOPE_TRIALS,
  type PeriscopeDraft,
  type PeriscopeTrial,
} from './periscope';
import {
  periscopePlanFields,
  periscopeBuildField,
  periscopeExplainFields,
  periscopeResults,
  periscopeMarkdown,
} from './periscopeReport';
const steps = [
  t('准备', 'Prepare'),
  t('制作与光路', 'Build & trace'),
  t('我的观察', 'My trials'),
  t('解释与报告', 'Explain & report'),
];
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
function PeriscopeArt() {
  return (
    <svg viewBox="0 0 320 155" aria-hidden="true">
      <path
        d="M135 20h65v115h-65V65M135 20v12M200 20v80m0 27v8"
        fill="none"
        stroke="#b49fc4"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path d="m148 34 37 37m-37 33 37 37" stroke="#81aa9a" strokeWidth="5" />
      <path d="M40 52h126v70h98" fill="none" stroke="#c49a5f" strokeWidth="3" />
      <path d="m40 40-9 12h18Z" fill="#81aa9a" />
      <path d="M38 94h55v48H38Z" fill="#e2d6e8" />
      <path d="m244 115 9 7-9 7" fill="none" stroke="#c49a5f" strokeWidth="3" />
      <circle
        cx="275"
        cy="122"
        r="10"
        fill="#eee4f2"
        stroke="#aa90bb"
        strokeWidth="2"
      />
    </svg>
  );
}
function RayWorkbench({ mode }: { mode: LanguageMode }) {
  const [tilt, setTilt] = useState(45),
    animation = useAnimation(2),
    model = periscopeRay(tilt);
  const marker = pointOnPath(model.path, animation.time / 2);
  const changeTilt = (value: number) => {
    animation.reset();
    setTilt(value);
  };
  function mirror(x: number, y: number, angle: number, lower: boolean) {
    const a = (angle * Math.PI) / 180,
      dx = 35 * Math.cos(a),
      dy = 35 * Math.sin(a),
      offset = lower ? -5 : 5;
    return (
      <g>
        <line
          x1={x - dx + offset * Math.sin(a)}
          y1={y - dy - offset * Math.cos(a)}
          x2={x + dx + offset * Math.sin(a)}
          y2={y + dy - offset * Math.cos(a)}
          stroke="#d7c9df"
          strokeWidth="7"
        />
        <line
          x1={x - dx}
          y1={y - dy}
          x2={x + dx}
          y2={y + dy}
          stroke="#81aa9a"
          strokeWidth="4"
        />
        <line
          x1={x - 40}
          y1={y}
          x2={x + 45}
          y2={y}
          stroke="#bdb0c6"
          strokeDasharray="4 4"
        />
      </g>
    );
  }
  return (
    <div className="phy-periscope-workbench">
      <div className="phy-periscope-model-heading">
        <div>
          <span className="phy-eyebrow">FOLLOW THE LIGHT</span>
          <h3>
            <B
              zh="转一面镜子，光往哪里走？"
              en="Turn one mirror. Where does light go?"
              mode={mode}
            />
          </h3>
        </div>
        <span className="phy-tag">
          <B zh="模型预览" en="Model preview" mode={mode} />
        </span>
      </div>
      <figure className="phy-periscope-diagram">
        <svg
          viewBox="0 0 620 460"
          role="img"
          aria-label={word(
            mode,
            '潜望镜光路：目标到上镜，向下到下镜，再向右到眼睛窗口。挡板阻止直视。',
            'Periscope path: target to upper mirror, down to lower mirror, then right to the eye aperture. A barrier blocks direct sight.',
          )}
        >
          <path
            d="M250 55h100v190m0 70v15H250V125m0-40V55"
            fill="none"
            stroke="#d2c1dc"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <rect
            x="110"
            y="140"
            width="115"
            height="105"
            rx="7"
            fill="#e4dbe9"
          />
          <text
            x="167"
            y="193"
            textAnchor="middle"
            fill="#937d9c"
            fontSize="18"
          >
            {word(mode, '挡板', 'Barrier')}
          </text>
          <line
            x1="70"
            y1="100"
            x2={model.blockedDirect.x}
            y2="140"
            stroke="#bcafc4"
            strokeDasharray="5 5"
            strokeWidth="2"
          />
          <path d="m45 90 10-16 10 16h-6v28h-8V90Z" fill="#81aa9a" />
          <text x="25" y="57" fill="#80668d" fontSize="20">
            {word(mode, '目标', 'Target')}
          </text>
          {mirror(300, 100, 45, false)}
          {mirror(300, 280, tilt, true)}
          <text x="382" y="82" fill="#80668d" fontSize="20">
            {word(mode, '上镜 45°', 'Upper 45°')}
          </text>
          <text x="208" y="372" fill="#80668d" fontSize="20">
            {word(mode, `下镜 ${tilt}°`, `Lower ${tilt}°`)}
          </text>
          <polyline
            points={model.path.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#c49a5f"
            strokeWidth="3"
          />
          <path
            d="m188 94 9 6-9 6m106 78 6 9 6-9"
            fill="none"
            stroke="#c49a5f"
            strokeWidth="3"
          />
          <path
            d="m-8-5 8 5-8 5"
            transform={`translate(425 ${280 + (model.end.y - 280) / 2}) rotate(${model.outgoingAngle})`}
            fill="none"
            stroke="#c49a5f"
            strokeWidth="3"
          />
          <line
            x1="550"
            y1="262"
            x2="550"
            y2="298"
            stroke="#81aa9a"
            strokeWidth="7"
          />
          <ellipse
            cx="580"
            cy="280"
            rx="18"
            ry="11"
            fill="#f9f4fc"
            stroke="#aa90bb"
            strokeWidth="2"
          />
          <circle cx="580" cy="280" r="6" fill="#aa90bb" />
          <text x="530" y="242" fill="#80668d" fontSize="18">
            {word(mode, '眼睛', 'Eye')}
          </text>
          {(animation.running || animation.time > 0) && (
            <circle cx={marker.x} cy={marker.y} r="6" fill="#719e8b" />
          )}
          <text
            className="phy-periscope-svg-key"
            x="310"
            y="448"
            textAnchor="middle"
            fill="#937d9c"
            fontSize="17"
          >
            {word(
              mode,
              '金色：光路 · 绿色：反光面 · 虚线：水平参考',
              'Gold: ray · Green: reflective face · Dashes: horizontal',
            )}
          </text>
        </svg>
        <figcaption>
          <span className="phy-periscope-mobile-key">
            <B
              zh="金色：光路 · 绿色：反光面 · 虚线：水平参考"
              en="Gold: ray · Green: reflective face · Dashes: horizontal"
              mode={mode}
            />
          </span>
          <B
            zh="倾斜角从水平量，不是从法线量的入射角。只画目标一个点的理想光线；到达窗口不保证完整图像清晰。"
            en="Tilt is measured from horizontal, not incidence from the normal. This ideal ray comes from one target point; reaching the aperture does not guarantee a clear full image."
            mode={mode}
          />
        </figcaption>
      </figure>
      <div className="phy-periscope-controls">
        <label>
          <B zh="下镜倾斜 / °" en="Lower mirror tilt / °" mode={mode} />
          <input
            type="range"
            min="30"
            max="60"
            step="1"
            value={tilt}
            aria-label={word(mode, '下镜倾斜', 'Lower mirror tilt')}
            onChange={(e) => changeTilt(Number(e.target.value))}
          />
        </label>
        <div className="phy-periscope-presets">
          {[35, 45, 55].map((a) => (
            <button
              key={a}
              className="phy-button secondary"
              aria-pressed={a === tilt}
              onClick={() => changeTilt(a)}
            >
              {a}°
            </button>
          ))}
          <button
            className="phy-button"
            disabled={animation.running}
            onClick={animation.start}
          >
            <B zh="追踪两次反射" en="Trace two reflections" mode={mode} />
          </button>
        </div>
      </div>
      <div className="phy-periscope-metrics" aria-live="polite">
        <div>
          <B zh="下镜与水平" en="Lower tilt from horizontal" mode={mode} />
          <strong>{tilt}°</strong>
        </div>
        <div>
          <B
            zh="出射方向与水平"
            en="Exit direction from horizontal"
            mode={mode}
          />
          <strong>
            {Math.abs(model.outgoingAngle) < 1e-8
              ? '0'
              : model.outgoingAngle.toFixed(0)}
            °
          </strong>
        </div>
        <div>
          <B zh="这一条模型光线" en="This model ray" mode={mode} />
          <strong>
            <B
              zh={model.hit ? '到达眼睛窗口' : '错过眼睛窗口'}
              en={model.hit ? 'Reaches eye aperture' : 'Misses eye aperture'}
              mode={mode}
            />
          </strong>
        </div>
      </div>
      <p className="phy-power-note">
        <B
          zh="上镜固定45°，下镜改变10°，出射方向改变20°。屏幕向下为正。移动点只帮助读光路，动画时间不是光的飞行时间；这些设置不会写进你的观察记录。"
          en="The upper mirror stays at 45°. Turning the lower mirror by 10° turns the outgoing ray by 20°. Down the screen is positive. The moving dot helps read the path; animation time is not light travel time. Model settings do not enter your observations."
          mode={mode}
        />
      </p>
    </div>
  );
}
export default function PeriscopeProject({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const d = store.progress.periscopeProject ?? emptyPeriscope(),
    s = periscopeState(d);
  const update = (change: (old: PeriscopeDraft) => PeriscopeDraft) =>
    store.update((old) => ({
      ...old,
      periscopeProject: {
        ...change(old.periscopeProject ?? emptyPeriscope()),
        updatedAt: Date.now(),
      },
    }));
  const patch = (index: number, change: Partial<PeriscopeTrial>) =>
    update((old) => revisePeriscopeTrial(old, index, change));
  function field(
    f:
      | (typeof periscopePlanFields)[number]
      | typeof periscopeBuildField
      | (typeof periscopeExplainFields)[number],
  ) {
    return (
      <label key={f.key}>
        <Text value={f.label} mode={mode} />
        <textarea
          rows={2}
          maxLength={f.max}
          aria-label={word(mode, f.label.zh, f.label.en)}
          value={d.fields[f.key] ?? ''}
          onChange={(e) =>
            update((old) => revisePeriscopeField(old, f.key, e.target.value))
          }
        />
        <small>
          <Text value={f.hint} mode={mode} />
        </small>
      </label>
    );
  }
  const status = (v: ReturnType<typeof periscopeTrial>) =>
    t(
      v.excluded
        ? '保留并排除'
        : v.pendingReason
          ? '待补原因'
          : v.used
            ? '使用'
            : '待核对',
      v.excluded
        ? 'Retained, excluded'
        : v.pendingReason
          ? 'Reason needed'
          : v.used
            ? 'Used'
            : 'Check needed',
    );
  return (
    <div className="phy-page phy-power-page phy-periscope-page">
      <Link className="phy-back" to="/physics/path">
        <B zh="← 返回学习路线" en="← Back to learning path" mode={mode} />
      </Link>
      <header className="phy-power-hero">
        <div>
          <p className="phy-eyebrow">STAGE 2 / THE PERISCOPE WORKSHOP</p>
          <h1>
            <B
              zh="两面镜子，看见另一边"
              en="Two mirrors. A different view."
              mode={mode}
            />
          </h1>
          <p className="phy-lead">
            <B
              zh="先追一束光，再做自己的潜望镜。让每一次“看见”与“看不到”都有证据。"
              en="Follow a ray, then build your own periscope. Give every view—and every missing view—its evidence."
              mode={mode}
            />
          </p>
        </div>
        <div className="phy-power-hero-art">
          <PeriscopeArt />
        </div>
      </header>
      <nav
        className="phy-step-nav phy-power-steps"
        aria-label={word(mode, '潜望镜项目步骤', 'Periscope project steps')}
      >
        {steps.map((step, i) => (
          <button
            key={step.en}
            className={d.step === i ? 'active' : ''}
            aria-current={d.step === i ? 'step' : undefined}
            onClick={() => update((old) => ({ ...old, step: i }))}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <Text value={step} mode={mode} />
          </button>
        ))}
      </nav>
      <div className="phy-project-layout">
        <div>
          <section className="phy-project-section">
            <h2>
              <Text value={steps[d.step]!} mode={mode} />
            </h2>
            {d.step === 0 && (
              <>
                <p className="phy-power-note">
                  <B
                    zh="挑战：眼睛低于挡板，目标在上方窗口对面，能绕过挡板看到它吗？用普通室内光和纸箭头就够了。选小塑料镜，裁切请家人帮忙；不用太阳光或激光。"
                    en="Challenge: with your eye below a barrier and a target opposite the upper window, can you look past it? Use ordinary room light and a paper arrow. Choose small plastic mirrors and ask a helper to cut openings; use no sunlight or lasers."
                    mode={mode}
                  />
                </p>
                {periscopePlanFields.map(field)}
                <details className="phy-power-example">
                  <summary>
                    <B
                      zh="材料还没准备好？先探索光路"
                      en="No materials yet? Explore the path first"
                      mode={mode}
                    />
                  </summary>
                  <p>
                    <B
                      zh="可以随时进入第二步试转镜子，先保存计划，等准备好再填自己的观察。"
                      en="Visit step 2 to turn the mirror. Save your plan now and enter your own observations when ready."
                      mode={mode}
                    />
                  </p>
                </details>
              </>
            )}
            {d.step === 1 && (
              <>
                <RayWorkbench mode={mode} />
                <ol className="phy-periscope-build">
                  <li>
                    <B
                      zh="在纸盒的上、下端开相对两侧的窗口；让家人裁切，固定好边缘。"
                      en="Make upper and lower windows on opposite sides of a cardboard tube. Have a helper cut them and secure the edges."
                      mode={mode}
                    />
                  </li>
                  <li>
                    <B
                      zh="上下镜面先平行、各倾斜约45°，反光面相对朝向内部光路：上镜朝向目标和下镜，下镜朝向上镜和眼睛。"
                      en="Start with parallel mirrors tilted about 45°. Face the reflective sides toward the inner path: upper toward target and lower mirror, lower toward upper mirror and eye."
                      mode={mode}
                    />
                  </li>
                  <li>
                    <B
                      zh="放好纸箭头和挡板，固定上镜与观察位置。轻微转动下镜，记录看到什么，再回到起始设置复查。"
                      en="Place the paper arrow and barrier. Fix the upper mirror and viewing position. Turn the lower mirror slightly, observe, then return to the start and check again."
                      mode={mode}
                    />
                  </li>
                </ol>
                {field(periscopeBuildField)}
                <label className="phy-power-check">
                  <input
                    type="checkbox"
                    checked={d.buildChecked}
                    onChange={(e) =>
                      update((old) => ({
                        ...old,
                        buildChecked: e.target.checked,
                      }))
                    }
                  />
                  <B
                    zh="我已实际安装并核对镜面朝向、窗口和固定边缘。"
                    en="I built it and checked reflective faces, openings and secured edges."
                    mode={mode}
                  />
                </label>
                <label className="phy-power-check">
                  <input
                    type="checkbox"
                    checked={d.fairChecked}
                    onChange={(e) =>
                      update((old) => ({
                        ...old,
                        fairChecked: e.target.checked,
                      }))
                    }
                  />
                  <B
                    zh="比较时上镜、目标、观察位置和照明保持一致；差别已写进方法。"
                    en="Upper mirror, target, viewpoint and lighting stay fixed for comparisons; differences are recorded in my method."
                    mode={mode}
                  />
                </label>
                <p className="phy-power-note">
                  <B
                    zh="修改材料、方法或安装描述会取消安装与观察确认，原输入保留。请重新核对，不能把旧观察当成另一套装置的新数据。"
                    en="Changing materials, method or build description clears build and trial confirmations while retaining originals. Recheck; do not treat an old observation as new data from a different device."
                    mode={mode}
                  />
                </p>
              </>
            )}
            {d.step === 2 && (
              <>
                <p className="phy-power-note">
                  <B
                    zh="至少记录3次、2种设置，包括回到起始设置的复查。写自己的观察，角度测不到可以留空；不要把演示数字当作测量。不同设置标签并不能证明比较公平。"
                    en="Record at least 3 trials across 2 settings, including a return to the starting setting. Use your observations; leave tilt blank if unmeasured. Model numbers are not measurements. Different setting labels do not prove fairness."
                    mode={mode}
                  />
                </p>
                <div className="phy-power-readings">
                  {d.trials.map((r, i) => {
                    const v = periscopeTrial(r);
                    return (
                      <article
                        className={`phy-power-trial ${v.excluded ? 'excluded' : ''}`}
                        key={i}
                      >
                        <div className="phy-power-trial-heading">
                          <strong>
                            <B
                              zh={`原始观察 ${i + 1}`}
                              en={`Original observation ${i + 1}`}
                              mode={mode}
                            />
                          </strong>
                          <Text value={status(v)} mode={mode} />
                        </div>
                        <label>
                          <B zh="设置名称" en="Setting name" mode={mode} />
                          <input
                            maxLength={300}
                            aria-label={word(
                              mode,
                              `设置名称 ${i + 1}`,
                              `Setting name ${i + 1}`,
                            )}
                            value={r.condition}
                            onChange={(e) =>
                              patch(i, { condition: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          <B
                            zh="下镜与水平 / °（选填）"
                            en="Lower tilt from horizontal / ° (optional)"
                            mode={mode}
                          />
                          <input
                            inputMode="decimal"
                            maxLength={16}
                            aria-label={word(
                              mode,
                              `下镜角度 ${i + 1}`,
                              `Lower tilt ${i + 1}`,
                            )}
                            aria-invalid={
                              !!r.angle.trim() && v.angle === undefined
                            }
                            value={r.angle}
                            onChange={(e) =>
                              patch(i, { angle: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          <B
                            zh="从固定观察位置看"
                            en="View from the fixed position"
                            mode={mode}
                          />
                          <select
                            aria-label={word(
                              mode,
                              `可见情况 ${i + 1}`,
                              `Visibility ${i + 1}`,
                            )}
                            value={r.result}
                            onChange={(e) =>
                              patch(i, {
                                result: e.target
                                  .value as PeriscopeTrial['result'],
                              })
                            }
                          >
                            {Object.entries(periscopeResults).map(
                              ([key, value]) => (
                                <option key={key} value={key}>
                                  {mode === 'bilingual'
                                    ? `${value.zh} / ${value.en}`
                                    : word(mode, value.zh, value.en)}
                                </option>
                              ),
                            )}
                          </select>
                        </label>
                        <label>
                          <B
                            zh="我实际看到了什么？"
                            en="What did I actually see?"
                            mode={mode}
                          />
                          <textarea
                            rows={2}
                            maxLength={800}
                            aria-label={word(
                              mode,
                              `实际观察 ${i + 1}`,
                              `Actual observation ${i + 1}`,
                            )}
                            value={r.observation}
                            onChange={(e) =>
                              patch(i, { observation: e.target.value })
                            }
                          />
                        </label>
                        <label className="phy-power-check">
                          <input
                            type="checkbox"
                            checked={r.checked}
                            onChange={(e) =>
                              patch(i, { checked: e.target.checked })
                            }
                          />
                          <B
                            zh="已核对设置、观察位置与自己的观察。"
                            en="Checked the setting, viewpoint and my own observation."
                            mode={mode}
                          />
                        </label>
                        <label>
                          <B
                            zh="排除原因（需要时填写）"
                            en="Exclusion reason (if needed)"
                            mode={mode}
                          />
                          <textarea
                            rows={2}
                            maxLength={500}
                            aria-label={word(
                              mode,
                              `排除原因 ${i + 1}`,
                              `Exclusion reason ${i + 1}`,
                            )}
                            value={r.reason}
                            onChange={(e) =>
                              patch(i, { reason: e.target.value })
                            }
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
                            zh="过程有问题，保留原观察并申请排除"
                            en="Procedure issue: retain this observation and request exclusion"
                            mode={mode}
                          />
                        </label>
                        {v.pendingReason && (
                          <p className="phy-power-alert" role="status">
                            <B
                              zh="先写原因；有效且确认的观察仍使用。看不到或与预测不同本身不是排除理由。"
                              en="Give a reason first; valid checked observations remain used. A missing view or surprise alone is not a reason."
                              mode={mode}
                            />
                          </p>
                        )}
                        {v.entered && !v.valid && !v.excluded && (
                          <p className="phy-power-alert" role="status">
                            <B
                              zh="请补设置、可见情况与具体观察。角度可空白；填入时需0–90°的小数。原输入保留。"
                              en="Add a setting, visibility and specific observation. Tilt may be blank; if entered, use a decimal 0–90°. Originals remain."
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
                  disabled={d.trials.length >= MAX_PERISCOPE_TRIALS}
                  onClick={() =>
                    update((old) => ({
                      ...old,
                      trials: [...old.trials, emptyPeriscopeTrial()],
                    }))
                  }
                >
                  <B
                    zh={
                      d.trials.length >= MAX_PERISCOPE_TRIALS
                        ? '8条原观察已保留'
                        : '＋ 增加观察，保留原记录'
                    }
                    en={
                      d.trials.length >= MAX_PERISCOPE_TRIALS
                        ? '8 original observations retained'
                        : '＋ Add a trial, retain originals'
                    }
                    mode={mode}
                  />
                </button>
              </>
            )}
            {d.step === 3 && (
              <>
                <div className="phy-periscope-evidence">
                  {d.trials.map(
                    (r, i) =>
                      s.trials[i]!.entered && (
                        <article key={i}>
                          <strong>
                            #{i + 1} {r.condition || '—'}
                          </strong>
                          <Text
                            value={periscopeResults[r.result]}
                            mode={mode}
                          />
                          <p>{r.observation || '—'}</p>
                          <small>
                            <Text value={status(s.trials[i]!)} mode={mode} />
                            {r.reason && <> · {r.reason}</>}
                          </small>
                        </article>
                      ),
                  )}
                </div>
                {periscopeExplainFields.map(field)}
                <p className="phy-power-note">
                  <B
                    zh="成功或暂时看不到，都能产生有用证据。这里检查记录是否齐全，不判定你的解释一定正确。"
                    en="A successful view or no view can both produce useful evidence. This checks completeness, not whether your explanation is correct."
                    mode={mode}
                  />
                </p>
                <ProjectReport
                  mode={mode}
                  report={periscopeMarkdown(d)}
                  hasData={periscopeHasData(d)}
                  fileName="my-periscope-investigation.md"
                  downloadLabel={t(
                    '导出双语潜望镜报告',
                    'Export bilingual periscope report',
                  )}
                  reportLabel={t(
                    '潜望镜双语报告',
                    'Bilingual periscope report',
                  )}
                />
              </>
            )}
          </section>
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
          <p className="phy-eyebrow">MY LIGHT EVIDENCE</p>
          <h3>
            <B
              zh={s.completed ? '记录完整' : '我的潜望镜调查'}
              en={
                s.completed ? 'Record complete' : 'My periscope investigation'
              }
              mode={mode}
            />
          </h3>
          <dl>
            <div>
              <dt>
                <B zh="计划" en="Plan" mode={mode} />
              </dt>
              <dd>
                <B
                  zh={s.planned ? '已准备好' : '待填写'}
                  en={s.planned ? 'Ready' : 'To write'}
                  mode={mode}
                />
              </dd>
            </div>
            <div>
              <dt>
                <B zh="安装与比较条件" en="Build & conditions" mode={mode} />
              </dt>
              <dd>
                <B
                  zh={s.built ? '已确认' : '待核对'}
                  en={s.built ? 'Checked' : 'Check needed'}
                  mode={mode}
                />
              </dd>
            </div>
            <div>
              <dt>
                <B
                  zh="已确认使用的观察"
                  en="Checked used observations"
                  mode={mode}
                />
              </dt>
              <dd>
                {s.used.length} <small>/ ≥3</small>
              </dd>
            </div>
            <div>
              <dt>
                <B zh="使用的设置标签" en="Used setting labels" mode={mode} />
              </dt>
              <dd>
                {s.conditions} <small>/ ≥2</small>
              </dd>
            </div>
          </dl>
          <p>
            <B
              zh="完整记录需要计划、实际安装确认、至少3次使用观察、2种设置标签、处理所有已填记录和自己的解释。记录完整不等于装置成功或理解已认证。"
              en="Completion needs a plan, checked physical build, at least 3 used observations, 2 setting labels, resolved entered records and your explanations. Completeness does not certify a successful device or understanding."
              mode={mode}
            />
          </p>
          <p>
            <B
              zh="此设备浏览器自动保存；导出双语报告可保留副本。"
              en="Autosaved in this device’s browser; export a bilingual report to keep a copy."
              mode={mode}
            />
          </p>
          <Link to="/physics/lesson/light-reflection-from-normal">
            <B
              zh="回看：反射为什么从法线量？ →"
              en="Revisit: why measure reflection from the normal? →"
              mode={mode}
            />
          </Link>
        </aside>
      </div>
    </div>
  );
}
