import { useEffect, useRef, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { LabOptions, type LabProps } from './LabControls';
import {
  solvingProblem,
  reasoningSteps,
  checkReasonAnswer,
  solvedPrefix,
  decodeReasonDrafts,
  blankReasonDraft,
  reasoningReport,
  format,
  type SolvingKind,
  type ReasonDraft,
  type Problem,
  type Pair,
} from './solvingModels';
const cream = '#eeeee3',
  blue = '#95c7cb',
  gold = '#e6c58b',
  ink = '#30423b';
const names: Record<SolvingKind, Pair> = {
  arrival: ['到门口的时间规划', 'Plan the arrival time'],
  energy: ['阅读灯的能量预算', 'A reading-lamp energy budget'],
  spring: ['悬挂弹簧的伸长账', 'Hanging-spring extension account'],
  density: ['密度数字与操作证据', 'Density numbers and procedure evidence'],
};
const shortSteps: Pair[] = [
  ['情境', 'Scene'],
  ['画图', 'Sketch'],
  ['已知', 'Known'],
  ['未知', 'Unknown'],
  ['模型', 'Model'],
  ['计算', 'Calculate'],
  ['单位', 'Unit'],
  ['反查', 'Sense check'],
];
const w = (m: LanguageMode, p: Pair) => (m === 'en' ? p[1] : p[0]);
function Sketch({
  kind,
  variant = 0,
}: {
  kind: SolvingKind;
  variant?: number;
}) {
  return (
    <svg viewBox="0 0 240 100" aria-hidden="true">
      <rect width="240" height="100" rx="9" fill={ink} />
      <g stroke={blue} strokeWidth="2" fill="none">
        {kind === 'arrival' && (
          <>
            <path d={variant === 2 ? 'M25 68H213M213 78H25' : 'M25 70H213'} />
            <path d="M51 50H179l-8-5m8 5-8 5" />
            <text x="116" y="28" textAnchor="middle" fill={cream} stroke="none">
              {variant === 1 ? 'd / (m/s)' : 'd / m'}
            </text>
            <text x="113" y="91" textAnchor="middle" fill={gold} stroke="none">
              {variant === 2 ? 'out + back' : 't = ?'}
            </text>
          </>
        )}
        {kind === 'energy' && (
          <>
            <rect x="24" y="30" width="38" height="44" />
            <path d={variant === 2 ? 'M75 53h0' : 'M75 53H163l-8-5m8 5-8 5'} />
            <circle cx="190" cy="45" r="17" fill={gold} />
            <text x="30" y="25" fill={cream} stroke="none">
              {variant === 1 ? 'E / W' : 'E / J'}
            </text>
            <text x="163" y="87" fill={cream} stroke="none">
              {variant === 1 ? 'P / J' : 'P / W'}
            </text>
          </>
        )}
        {kind === 'spring' && (
          <>
            <rect x="98" y="38" width="35" height="25" fill={gold} />
            <path
              d={
                variant === 1
                  ? 'M78 19V83m-5-8 5 8 5-8'
                  : 'M78 83V19m-5 8 5-8 5 8'
              }
            />
            <path d="M154 19V83m-5-8 5 8 5-8" />
            <text x="50" y="96" fill={cream} stroke="none">
              {variant === 2 ? 'x = L₀' : 'F↑ = W↓'}
            </text>
          </>
        )}
        {kind === 'density' && (
          <>
            <path d="M30 18v64h50V18m90 0v64h50V18" />
            <path
              d={variant === 2 ? 'M35 53H75m95 0h40' : 'M31 58h48m92-18h48'}
            />
            {variant !== 1 && (
              <text x="39" y="96" fill={cream} stroke="none">
                V₁
              </text>
            )}
            <text x="176" y="96" fill={cream} stroke="none">
              V₂
            </text>
            <text x="106" y="49" fill={gold} stroke="none">
              {variant === 2 ? 'F ?' : variant === 1 ? 'V₂' : 'ΔV'}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
function Scene({
  p,
  mode,
  reveal,
}: {
  p: Problem;
  mode: LanguageMode;
  reveal: boolean;
}) {
  const tx = (x: number, y: number, text: string, size = 20) => (
    <text
      key={`${x}:${y}:${text}`}
      x={x}
      y={y}
      textAnchor="middle"
      style={{ fontSize: size }}
    >
      {text}
    </text>
  );
  return (
    <svg
      className="phy-reason-scene"
      viewBox="0 0 620 240"
      role="img"
      aria-label={w(mode, names[p.kind])}
    >
      <rect width="620" height="240" rx="15" fill={ink} />
      <g fill={cream}>
        {p.kind === 'arrival' && (
          <>
            {tx(
              310,
              32,
              w(mode, [
                '单程匀速 · 先问条件',
                'One-way uniform motion · check conditions',
              ]),
            )}
            <path
              d="M60 174H557M503 71v97h37V71z"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            <rect x="83" y="130" width="42" height="28" rx="6" fill={gold} />
            <circle cx="93" cy="164" r="6" fill={cream} />
            <circle cx="117" cy="164" r="6" fill={cream} />
            <path
              d="M160 120H445l-10-7m10 7-10 7"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            {tx(310, 82, p.index === 1 ? 'd = 0.24 km = 240 m' : 'd = 120 m')}
            {tx(
              310,
              211,
              reveal
                ? p.result === null
                  ? w(mode, ['没有有限到达时间', 'No finite arrival time'])
                  : `t = ${format(p.result)} s`
                : 't = ?',
            )}
            {tx(
              310,
              149,
              `v = ${p.index === 1 ? 4 : p.index === 2 ? 0 : 2} m/s`,
            )}
          </>
        )}
        {p.kind === 'energy' && (
          <>
            {tx(
              310,
              32,
              w(mode, [
                '给定能量预算 · 固定接收功率',
                'Given energy budget · fixed received power',
              ]),
            )}
            <rect
              x="75"
              y="70"
              width="111"
              height="98"
              rx="12"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            <path
              d="M215 115H415l-10-7m10 7-10 7"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            <circle cx="492" cy="108" r="35" fill={gold} />
            <path d="M471 146h42m-39 7h35" stroke={cream} fill="none" />
            {tx(131, 104, 'E / J', 18)}
            {tx(131, 137, p.index === 2 ? '2400' : '1200')}
            {tx(310, 87, `P = ${p.index === 1 ? 4 : 2} W`)}
            {tx(
              310,
              213,
              reveal
                ? `t = ${p.result} s = ${format(p.result! / 60)} min`
                : 't = ?',
            )}
            {tx(490, 184, w(mode, ['阅读灯', 'Reading lamp']), 18)}
          </>
        )}
        {p.kind === 'spring' && (
          <>
            {tx(
              310,
              32,
              w(mode, [
                '先力平衡 · 再求额外伸长',
                'Force balance first · then extra extension',
              ]),
            )}
            <path
              d="M72 59H240m-84 0v15l-10 8 20 12-20 12 20 12-20 12 10 8v17"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            <rect x="135" y="154" width="42" height="31" rx="5" fill={gold} />
            <path
              d="M212 172V91l-6 10m6-10 6 10M253 96v81l-6-10m6 10 6-10"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            {tx(431, 86, `m = ${p.index === 1 ? 2 : 1} kg`)}
            {tx(431, 122, `g = ${p.index === 2 ? 1.6 : 10} N/kg`)}
            {tx(431, 158, 'k = 100 N/m')}
            {tx(
              310,
              219,
              reveal
                ? `x = ${format(p.result!)} cm · L = ${format(20 + p.result!)} cm`
                : 'L₀ = 20 cm · x = ?',
            )}
            {tx(253, 201, 'mg', 16)}
            {tx(212, 83, 'kx', 16)}
          </>
        )}
        {p.kind === 'density' && (
          <>
            {tx(
              310,
              32,
              w(mode, [
                '质量 + 水位变化 + 操作记录',
                'Mass + level change + procedure record',
              ]),
            )}
            <path
              d="M88 68v119h103V68m230 0v119h103V68"
              stroke={blue}
              fill="none"
              strokeWidth="3"
            />
            <path d="M89 137h101" stroke={blue} strokeWidth="4" />
            <path
              d={`M422 ${197 - 1.2 * (p.index === 1 ? 90 : p.index === 2 ? 62 : 70)}h100`}
              stroke={blue}
              strokeWidth="4"
            />
            <rect
              x="456"
              y={p.index === 2 ? 105 : 133}
              width="35"
              height="40"
              rx="4"
              fill={gold}
            />
            {tx(141, 93, '50 mL', 18)}
            {tx(
              475,
              65,
              `${p.index === 1 ? 90 : p.index === 2 ? 62 : 70} mL`,
              18,
            )}
            {tx(310, 82, `m = ${p.index === 1 ? 108 : 54} g`, 18)}
            {tx(
              310,
              146,
              w(
                mode,
                p.valid
                  ? ['完全浸没', 'Fully immersed']
                  : ['仅部分浸入', 'Partial immersion'],
              ),
              18,
            )}
            {tx(
              310,
              221,
              reveal
                ? `${p.valid ? 'ρ' : 'apparent'} = ${format(p.result!)} g/cm³`
                : 'ρ = ?',
            )}
            {!p.valid &&
              tx(310, 185, w(mode, ['需要重测', 'Remeasure needed']), 18)}
          </>
        )}
      </g>
    </svg>
  );
}
export function SolvingLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: SolvingKind }) {
  const key = `study-physics-reasoning-${kind}-v1`;
  const [drafts, setDrafts] = useState(() => {
      try {
        return decodeReasonDrafts(kind, localStorage.getItem(key));
      } catch {
        return decodeReasonDrafts(kind, null);
      }
    }),
    [index, setIndex] = useState(0),
    [saved, setSaved] = useState(true),
    [undo, setUndo] = useState<ReasonDraft | null>(null),
    [checked, setChecked] = useState(false),
    [downloadError, setDownloadError] = useState(false);
  const notified = useRef(false);
  const p = solvingProblem(kind, index),
    steps = reasoningSteps(p),
    draft = drafts[index]!,
    step = steps[draft.step]!,
    prefix = solvedPrefix(p, draft.answers),
    answer = draft.answers[draft.step],
    correct = checkReasonAnswer(step, answer),
    complete = prefix === 8,
    done = drafts.map(
      (d, i) => solvedPrefix(solvingProblem(kind, i), d.answers) === 8,
    ),
    count = done.filter(Boolean).length;
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, cases: drafts }));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [drafts, key]);
  useEffect(() => {
    if (count === 3 && !notified.current) {
      notified.current = true;
      onExplore?.();
    }
  }, [count, onExplore]);
  const update = (next: ReasonDraft) =>
    setDrafts((prev) => prev.map((d, i) => (i === index ? next : d)));
  const commit = (value: string) => {
    const a = [...draft.answers];
    if (a[draft.step] !== value)
      for (let j = draft.step + 1; j < 8; j++) a[j] = null;
    a[draft.step] = value;
    update({ ...draft, answers: a });
    setChecked(true);
    setUndo(null);
  };
  const select = (i: number) => {
    setIndex(i);
    setChecked(false);
    setUndo(null);
  };
  const exportReport = () => {
    try {
      const url = URL.createObjectURL(
          new Blob([reasoningReport(kind, drafts)], {
            type: 'text/markdown;charset=utf-8',
          }),
        ),
        a = document.createElement('a');
      a.href = url;
      a.download = `physics-reasoning-${kind}.md`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadError(false);
    } catch {
      setDownloadError(true);
    }
  };
  return (
    <div className="phy-lab phy-reason-lab">
      <div className="phy-lab-toolbar">
        <span>PHYSICS BRIDGE / BUILD A REASON</span>
        <B zh={names[kind][0]} en={names[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['三个教学情境', 'Three teaching scenarios']}
        values={[0, 1, 2].map((i) => ({
          id: i,
          zh: solvingProblem(kind, i).name[0],
          en: solvingProblem(kind, i).name[1],
        }))}
        value={index}
        set={select}
      />
      <div className="phy-reason-story">
        <B zh={p.story[0]} en={p.story[1]} mode={mode} />
      </div>
      <Scene p={p} mode={mode} reveal={prefix >= 6} />
      <nav
        className="phy-reason-nav"
        aria-label={w(mode, ['八步解题', 'Eight reasoning steps'])}
      >
        {steps.map((s, i) => (
          <button
            key={i}
            type="button"
            disabled={i > Math.min(prefix, 7)}
            aria-current={i === draft.step ? 'step' : undefined}
            aria-label={`${i + 1}. ${w(mode, s.title)}`}
            className={
              i === draft.step ? 'active' : i < prefix ? 'checked' : ''
            }
            onClick={() => {
              update({ ...draft, step: i });
              setChecked(false);
            }}
          >
            <span>{i < prefix ? '✓' : String(i + 1).padStart(2, '0')}</span>
            <B zh={shortSteps[i]![0]} en={shortSteps[i]![1]} mode={mode} />
          </button>
        ))}
      </nav>
      <section
        className="phy-reason-current"
        aria-label={w(mode, ['当前解题步骤', 'Current reasoning step'])}
      >
        <span className="phy-reason-kicker">STEP {draft.step + 1} / 8</span>
        <h3>
          <B zh={step.title[0]} en={step.title[1]} mode={mode} />
        </h3>
        {draft.step === 2 && (
          <p className="phy-reason-known">
            <B zh={p.known[0]} en={p.known[1]} mode={mode} />
          </p>
        )}
        {step.numeric ? (
          <>
            <p>
              <B zh={step.prompt[0]} en={step.prompt[1]} mode={mode} />
            </p>
            <form
              className="phy-reason-calc"
              onSubmit={(e) => {
                e.preventDefault();
                commit(draft.input);
              }}
            >
              <label>
                <B zh="计算结果" en="Calculated result" mode={mode} />
                <input
                  type="text"
                  inputMode="decimal"
                  value={draft.input}
                  maxLength={40}
                  aria-label={w(mode, ['计算结果', 'Calculated result'])}
                  onChange={(e) => {
                    const a = [...draft.answers];
                    a[draft.step] = null;
                    for (let j = draft.step + 1; j < 8; j++) a[j] = null;
                    update({ ...draft, input: e.target.value, answers: a });
                    setChecked(false);
                  }}
                />
              </label>
              <strong>{step.numeric.unit}</strong>
              <button className="phy-button" type="submit">
                <B zh="核对计算" en="Check calculation" mode={mode} />
              </button>
            </form>
            <p className="phy-reason-rounding">
              <B
                zh="可用小数或科学记数法（例如6e2）；数值允许0.1%的舍入差。单位在下一步单独检查。"
                en="Decimals or scientific notation (for example 6e2) are accepted with 0.1% rounding tolerance. Units are checked separately in the next step."
                mode={mode}
              />
            </p>
          </>
        ) : (
          <div
            className={`phy-reason-options ${draft.step === 1 ? 'sketches' : ''}`}
          >
            {step.options.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={answer === o.id}
                className={
                  answer === o.id ? (correct ? 'correct' : 'incorrect') : ''
                }
                onClick={() => commit(o.id)}
              >
                {o.sketch !== undefined && (
                  <Sketch kind={kind} variant={o.sketch} />
                )}
                <B zh={o.text[0]} en={o.text[1]} mode={mode} />
              </button>
            ))}
          </div>
        )}
        {(checked || answer !== null) && (
          <div
            className={`phy-reason-feedback ${correct ? 'correct' : 'incorrect'}`}
            role="status"
          >
            <strong>
              <B
                zh={correct ? '这一步有依据。' : '再检查一下。'}
                en={
                  correct
                    ? 'This step is supported.'
                    : 'Check the reasoning again.'
                }
                mode={mode}
              />
            </strong>
            <B
              zh={
                correct
                  ? step.feedback[0]
                  : step.numeric
                    ? '先核对公式、原始数据与单位换算，重新输入；空白不是零。'
                    : '回到情境和图，核对这项选择依赖的条件。'
              }
              en={
                correct
                  ? step.feedback[1]
                  : step.numeric
                    ? 'Check the equation, original data and unit conversion, then retry; a blank is not zero.'
                    : 'Return to the scenario and sketch and check the conditions required by this choice.'
              }
              mode={mode}
            />
          </div>
        )}
        {draft.step < 7 ? (
          <button
            className="phy-button phy-reason-next"
            disabled={!correct}
            onClick={() => {
              update({ ...draft, step: draft.step + 1 });
              setChecked(false);
            }}
          >
            <B
              zh="保留理由，下一步 →"
              en="Keep reasoning, next step →"
              mode={mode}
            />
          </button>
        ) : (
          <p className="phy-reason-case-status" role="status">
            <B
              zh={
                complete
                  ? '此情境八步已核验；可以比较另外两个情境。'
                  : '最后还要反查结果与模型条件。'
              }
              en={
                complete
                  ? 'All eight steps checked for this case; compare the other two scenarios.'
                  : 'Finish by checking the result and model conditions.'
              }
              mode={mode}
            />
          </p>
        )}
      </section>
      <p className="phy-model-note">
        <B
          zh={`${p.assumptions[0]} 图为示意，不按尺寸比例；判断依据给定量与条件。`}
          en={`${p.assumptions[1]} Sketches are schematic, not to scale; use the given quantities and conditions.`}
          mode={mode}
        />
      </p>
      <div className="phy-reason-footer">
        <span>
          <B
            zh={`${prefix}/8 步已核验 · ${saved ? '草稿已保存在本机' : '本地保存不可用，本次可继续'}`}
            en={`${prefix}/8 steps checked · ${saved ? 'draft saved on this device' : 'local saving unavailable; this session can continue'}`}
            mode={mode}
          />
        </span>
        <button
          className="phy-button secondary"
          onClick={() => {
            setUndo(draft);
            update(blankReasonDraft());
            setChecked(false);
          }}
        >
          <B zh="重做这个情境" en="Restart this case" mode={mode} />
        </button>
        {undo && (
          <button
            className="phy-button secondary"
            onClick={() => {
              update(undo);
              setUndo(null);
            }}
          >
            <B zh="撤销重做" en="Undo restart" mode={mode} />
          </button>
        )}
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已核验 ${count}/3 个情境；每个都需要八步理由、计算与检查。`}
          en={`${count}/3 scenarios verified; each needs all eight reasoning, calculation and checking steps.`}
          mode={mode}
        />
      </p>
      {count > 0 && (
        <>
          <div className="phy-electric-table">
            <table className="phy-data-table">
              <caption>
                <B
                  zh="已核验的解题记录（教学情境）"
                  en="Verified reasoning records (teaching scenarios)"
                  mode={mode}
                />
              </caption>
              <thead>
                <tr>
                  <th>
                    <B zh="情境" en="Scenario" mode={mode} />
                  </th>
                  <th>
                    <B
                      zh="保留的计算与判断"
                      en="Retained calculation and judgement"
                      mode={mode}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {done.map(
                  (valid, i) =>
                    valid && (
                      <tr key={i}>
                        <td>
                          <B
                            zh={solvingProblem(kind, i).name[0]}
                            en={solvingProblem(kind, i).name[1]}
                            mode={mode}
                          />
                        </td>
                        <td>
                          <B
                            zh={solvingProblem(kind, i).row[0]}
                            en={solvingProblem(kind, i).row[1]}
                            mode={mode}
                          />
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          </div>
          <button
            className="phy-button secondary phy-reason-export"
            onClick={exportReport}
          >
            <B
              zh="下载八步解题记录"
              en="Download eight-step record"
              mode={mode}
            />
          </button>
          {downloadError && (
            <p role="status">
              <B
                zh="导出未完成，草稿仍在本机。"
                en="Export did not complete; the draft remains on this device."
                mode={mode}
              />
            </p>
          )}
        </>
      )}
    </div>
  );
}
