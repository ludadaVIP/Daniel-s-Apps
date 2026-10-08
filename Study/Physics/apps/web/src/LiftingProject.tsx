import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text } from './ui';
import { t } from './content/schema';
import { ProjectReport } from './ProjectReport';
import { useAnimation } from './interactive/useSimulation';
import {
  defaultLiftingDesign,
  designBounds,
  emptyLifting,
  emptyLiftingTrial,
  liftingHasData,
  liftingState,
  reviseLiftingField,
  reviseLiftingTrial,
  trialNumbers,
  MAX_LIFTING_TRIALS,
  type LiftingDesign,
  type LiftingDraft,
  type LiftingTrial,
} from './lifting';
import { liftingArms, liftingComparison } from './liftingDesign';
import {
  liftingFields,
  liftingMarkdown,
  liftingResultLabels,
  liftingStatus,
} from './liftingReport';
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const steps = [
  t('设计目标', 'Design goal'),
  t('做一个小模型', 'Build a small lever'),
  t('我的试验', 'My trials'),
  t('解释与报告', 'Explain & report'),
];
const goals = [
  { key: 'weight', label: t('模型载荷', 'Virtual load'), unit: 'N', step: 5 },
  {
    key: 'heightCm',
    label: t('目标升高', 'Target rise'),
    unit: 'cm',
    step: 0.5,
  },
  {
    key: 'forceLimit',
    label: t('愿意用多大的力？', 'Available effort force'),
    unit: 'N',
    step: 1,
  },
  {
    key: 'travelLimitCm',
    label: t('手有多少移动空间？', 'Available hand travel'),
    unit: 'cm',
    step: 1,
  },
  {
    key: 'efficiency',
    label: t('假定效率', 'Assumed efficiency'),
    unit: '%',
    step: 0.05,
  },
] as const;
const numericLabels = {
  effortArmCm: t('手到支点的标记距离（cm）', 'Hand mark from pivot (cm)'),
  loadArmCm: t('载荷到支点的标记距离（cm）', 'Load mark from pivot (cm)'),
  payloadG: t('杯与硬币总质量（g，可空白）', 'Cup + coins mass (g, optional)'),
  effortN: t('手的力（N，可空白）', 'Effort force (N, optional)'),
  handTravelCm: t(
    '手向下移动（cm，可空白）',
    'Downward hand travel (cm, optional)',
  ),
  liftCm: t('载荷升高（cm，可空白）', 'Load rise (cm, optional)'),
};
function BuildDiagram({ mode }: { mode: LanguageMode }) {
  return (
    <figure className="phy-lifting-diagram">
      <svg
        viewBox="0 0 620 260"
        role="img"
        aria-label={word(
          mode,
          '实物制作示意：硬尺架在固定橡皮上，短端固定小杯，长端标出两个按压位置。',
          'Physical build: a stiff ruler on a fixed eraser, a small cup on the short side, and two push marks on the long side.',
        )}
      >
        <path d="M35 213H580" stroke="#bcaea0" strokeWidth="5" />
        <rect x="35" y="197" width="545" height="16" rx="5" fill="#e2d9c9" />
        <rect
          x="380"
          y="165"
          width="55"
          height="32"
          rx="6"
          fill="#d9c8e2"
          stroke="#b29ac0"
          strokeWidth="2"
        />
        <path
          d="m66 140 460 32"
          stroke="#81aa9a"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="m451 118 6 52h46l6-52Z"
          fill="#ecdfc5"
          stroke="#bea272"
          strokeWidth="2"
        />
        <ellipse
          cx="480"
          cy="118"
          rx="29"
          ry="7"
          fill="#fbf6eb"
          stroke="#bea272"
          strokeWidth="2"
        />
        <ellipse cx="470" cy="112" rx="8" ry="3" fill="#bea272" />
        <ellipse cx="485" cy="110" rx="8" ry="3" fill="#cbb386" />
        <path
          d="M115 70v54m-7-10 7 10 7-10M265 80v54m-7-10 7 10 7-10"
          fill="none"
          stroke="#ba9965"
          strokeWidth="3"
        />
        <circle cx="115" cy="145" r="5" fill="#ba9965" />
        <circle cx="265" cy="155" r="5" fill="#ba9965" />
        <text x="115" y="51" textAnchor="middle" fontSize="23" fill="#927341">
          {word(mode, '手位置①', 'Hand ①')}
        </text>
        <text x="265" y="61" textAnchor="middle" fontSize="23" fill="#927341">
          {word(mode, '手位置②', 'Hand ②')}
        </text>
        <text x="481" y="74" textAnchor="middle" fontSize="23" fill="#927341">
          {word(mode, '同一小杯', 'Same cup')}
        </text>
        <text x="406" y="243" textAnchor="middle" fontSize="23" fill="#927ea2">
          {word(mode, '固定橡皮', 'Fixed eraser')}
        </text>
      </svg>
      <figcaption>
        <B
          zh="图示为抬起状态，尺寸由你自己测量。杯子开始时由桌面支撑；保持载荷位置与起始姿态相同，分别在①、②处轻按。"
          en="Sketch shows a raised cup; measure your own dimensions. Start with the cup supported by the table. Keep the load mark and starting pose the same; push gently at ① or ②."
          mode={mode}
        />
      </figcaption>
    </figure>
  );
}
function LeverWorkbench({
  mode,
  design,
  onChange,
}: {
  mode: LanguageMode;
  design: LiftingDesign;
  onChange: (d: LiftingDesign) => void;
}) {
  const animation = useAnimation(2.4),
    model = liftingComparison(design, design.effortArmCm, animation.time / 2.4);
  const change = (patch: Partial<LiftingDesign>) => {
    animation.reset();
    onChange({ ...design, ...patch });
  };
  const px = 380,
    py = 150,
    scale = 7,
    ex = px - design.effortArmCm * scale * Math.cos(model.angle),
    ey = py + design.effortArmCm * scale * Math.sin(model.angle),
    lx = px + 10 * scale * Math.cos(model.angle),
    ly = py - 10 * scale * Math.sin(model.angle);
  return (
    <div className="phy-periscope-workbench phy-lifting-workbench">
      <div className="phy-periscope-model-heading">
        <div>
          <span className="phy-eyebrow">LESS FORCE · MORE TRAVEL</span>
          <h3>
            <B
              zh="省力方案，也得放得下"
              en="A gentler design must also fit"
              mode={mode}
            />
          </h3>
        </div>
        <span className="phy-tag">
          <B zh="模型计算" en="Model calculation" mode={mode} />
        </span>
      </div>
      <div className="phy-lifting-goals">
        {goals.map((g) => (
          <label key={g.key}>
            <Text value={g.label} mode={mode} />
            <strong>
              {g.key === 'efficiency'
                ? Math.round(design[g.key] * 100)
                : design[g.key]}{' '}
              {g.unit}
            </strong>
            <input
              type="range"
              min={designBounds[g.key][0]}
              max={designBounds[g.key][1]}
              step={g.step}
              value={design[g.key]}
              disabled={animation.running}
              aria-label={word(mode, g.label.zh, g.label.en)}
              onChange={(e) => change({ [g.key]: Number(e.target.value) })}
            />
          </label>
        ))}
      </div>
      <div
        className="phy-lifting-options"
        role="group"
        aria-label={word(mode, '杠杆方案', 'Lever designs')}
      >
        {liftingArms.map((arm) => {
          const m = liftingComparison(design, arm);
          return (
            <button
              key={arm}
              aria-pressed={design.effortArmCm === arm}
              disabled={animation.running}
              onClick={() => change({ effortArmCm: arm })}
            >
              <strong>{arm} cm</strong>
              <B zh="手到支点" en="Hand to pivot" mode={mode} />
              <span>
                {m.force.toFixed(1)} N · {m.handTravelCm.toFixed(1)} cm
              </span>
              <B
                zh={m.feasible ? '模型条件可行' : '需调整'}
                en={m.feasible ? 'Fits model constraints' : 'Adjust needed'}
                mode={mode}
              />
            </button>
          );
        })}
      </div>
      <figure className="phy-lifting-diagram">
        <svg
          viewBox="60 0 510 265"
          role="img"
          aria-label={word(
            mode,
            '杠杆设计模型：手向下移动，支点另一侧的载荷向上移动。',
            'Lever design model: the hand moves down while the load on the other side of the pivot moves up.',
          )}
        >
          <path d="M326 210H434" stroke="#d6c9d9" strokeWidth="2" />
          <path
            d={`M${px - 26} 207L${px} 157L${px + 26} 207Z`}
            fill="#dbcce3"
            stroke="#ae95bd"
            strokeWidth="2"
          />
          <path
            d={`M${ex} ${ey}L${lx} ${ly}`}
            stroke="#81aa9a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle
            cx={px}
            cy={py}
            r="7"
            fill="#fffcf8"
            stroke="#a489b4"
            strokeWidth="3"
          />
          <rect
            x={lx - 22}
            y={ly - 46}
            width="44"
            height="39"
            rx="6"
            fill="#e6d8bd"
            stroke="#ba9b68"
            strokeWidth="2"
          />
          <path
            d={`M${ex} ${ey - 65}V${ey - 17}m-7-10 7 10 7-10M${lx} ${ly - 106}V${ly - 58}m-7-10 7 10 7-10`}
            fill="none"
            stroke="#b79560"
            strokeWidth="3"
          />
          <text x={ex + 15} y={ey - 40} fill="#96713e" fontSize="22">
            {model.force.toFixed(1)} N
          </text>
          <text x={lx + 18} y={ly - 80} fill="#96713e" fontSize="22">
            {design.weight} N
          </text>
          <text
            x={(ex + px) / 2}
            y={(ey + py) / 2 + 30}
            textAnchor="middle"
            fill="#6e8f82"
            fontSize="22"
          >
            {design.effortArmCm} cm
          </text>
          <text
            x={(lx + px) / 2 + 25}
            y={(ly + py) / 2 + 38}
            textAnchor="start"
            fill="#6e8f82"
            fontSize="22"
          >
            10 cm
          </text>
          <text x={px} y="244" textAnchor="middle" fill="#967da6" fontSize="21">
            {word(mode, '固定支点', 'Fixed pivot')}
          </text>
        </svg>
        <figcaption>
          <B
            zh="轻杆、固定支点、缓慢移动、竖直力；载荷位置10 cm，单次转动0–15°。效率把摩擦等损失合并估算，图示不是承重保证。"
            en="Light bar, fixed pivot, slow motion and vertical forces; load mark 10 cm, one 0–15° stroke. Efficiency combines losses such as friction; the drawing is not a load rating."
            mode={mode}
          />
        </figcaption>
      </figure>
      <div className="phy-lifting-metrics">
        <span>
          <B zh="当前升高" en="Current rise" mode={mode} />
          <strong>{model.currentLiftCm.toFixed(2)} cm</strong>
        </span>
        <span>
          <B zh="当前手移动" en="Current hand travel" mode={mode} />
          <strong>{model.currentHandCm.toFixed(2)} cm</strong>
        </span>
        <span>
          <B zh="完成目标所需输入" en="Input required for target" mode={mode} />
          <strong>{model.inputWork.toFixed(2)} J</strong>
        </span>
        <span>
          <B
            zh="目标有用输出／其他转移"
            en="Target useful / other transfers"
            mode={mode}
          />
          <strong>
            {model.outputWork.toFixed(2)} / {model.loss.toFixed(2)} J
          </strong>
        </span>
      </div>
      <p
        className={model.feasible ? 'phy-lifting-fit' : 'phy-power-alert'}
        role="status"
      >
        <B
          zh={
            model.feasible
              ? '这个模型方案满足你的力、移动空间与单次行程条件。看看手与载荷怎样交换移动距离。'
              : '这个方案还不能完成目标：'
          }
          en={
            model.feasible
              ? 'This model fits your force, travel and stroke constraints. Watch the hand trade travel with the load.'
              : 'This design cannot meet the target yet:'
          }
          mode={mode}
        />
        {!model.forceOK && (
          <B
            zh=" 所需力超过上限。"
            en=" Required force exceeds your limit."
            mode={mode}
          />
        )}{' '}
        {!model.travelOK && (
          <B
            zh=" 手的移动空间不够。"
            en=" Not enough hand travel."
            mode={mode}
          />
        )}{' '}
        {!model.strokeOK && (
          <B
            zh={` 单次最多升高${model.maxLiftCm.toFixed(2)} cm，需改目标或重新设计。`}
            en={` One stroke raises at most ${model.maxLiftCm.toFixed(2)} cm; change the goal or redesign.`}
            mode={mode}
          />
        )}
      </p>
      <div className="phy-lifting-actions">
        <button
          className="phy-button"
          disabled={!model.feasible || animation.running}
          onClick={animation.start}
        >
          <B zh="演示一次抬升" en="Show one lift" mode={mode} />
        </button>
        <button className="phy-button secondary" onClick={animation.reset}>
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
        <button
          className="phy-button secondary"
          disabled={animation.running}
          onClick={() => {
            animation.reset();
            onChange(defaultLiftingDesign());
          }}
        >
          <B zh="恢复示例目标" en="Restore example goal" mode={mode} />
        </button>
      </div>
      <p>
        <B
          zh="这里的大载荷只用于模型思考。实物从桌面小杯和少量硬币开始，不把模型数值填进实测表。"
          en="Larger loads are for virtual design only. Physically start with a small cup and a few coins on a tabletop. Do not copy model numbers into measured records."
          mode={mode}
        />
      </p>
    </div>
  );
}
export default function LiftingProject({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const d = store.progress.liftingProject ?? emptyLifting(),
    s = liftingState(d);
  const update = (change: (old: LiftingDraft) => LiftingDraft) =>
    store.update((old) => ({
      ...old,
      liftingProject: {
        ...change(old.liftingProject ?? emptyLifting()),
        updatedAt: Date.now(),
      },
    }));
  const patch = (index: number, value: Partial<LiftingTrial>) =>
    update((old) => reviseLiftingTrial(old, index, value));
  const numbers = (
    r: LiftingTrial,
    i: number,
    keys: (keyof typeof trialNumbers)[],
  ) => (
    <div className="phy-lifting-numbers">
      {keys.map((key) => (
        <label key={key}>
          <Text value={numericLabels[key]} mode={mode} />
          <input
            inputMode="decimal"
            maxLength={16}
            aria-label={`${word(mode, numericLabels[key].zh, numericLabels[key].en)} ${i + 1}`}
            value={r[key]}
            onChange={(e) => patch(i, { [key]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
  const fields = (keys: string[]) =>
    liftingFields
      .filter((f) => keys.includes(f.key))
      .map((f) => (
        <label key={f.key}>
          <Text value={f.label} mode={mode} />
          <textarea
            rows={2}
            maxLength={f.max}
            aria-label={word(mode, f.label.zh, f.label.en)}
            value={d.fields[f.key] ?? ''}
            onChange={(e) =>
              update((old) => reviseLiftingField(old, f.key, e.target.value))
            }
          />
          <small>
            <Text value={f.hint} mode={mode} />
          </small>
        </label>
      ));
  return (
    <div className="phy-page phy-power-page phy-lifting-page">
      <Link className="phy-back-link" to="/physics/path">
        <B zh="← 学习路线" en="← Learning path" mode={mode} />
      </Link>
      <header className="phy-power-hero">
        <div>
          <span className="phy-eyebrow">DESIGN NOTEBOOK / SIMPLE MACHINES</span>
          <h1>
            <B
              zh="轻轻一按，把小载荷抬起来"
              en="A gentler push. A lifted load."
              mode={mode}
            />
          </h1>
          <p>
            <B
              zh="当一次小工程师：先比较省力方案，再用尺子与硬币验证。真正的答案，藏在你自己的记录里。"
              en="Be an engineer: compare gentler designs, then test with a ruler and coins. Your own records hold the real answer."
              mode={mode}
            />
          </p>
        </div>
        <div className="phy-power-hero-art" aria-hidden="true">
          <svg viewBox="0 0 320 155">
            <path d="M30 128H292" stroke="#d6c9df" strokeWidth="2" />
            <path d="m167 128 25-51 26 51Z" fill="#d7c7e0" />
            <path
              d="m42 110 235-55"
              stroke="#81aa9a"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <rect x="251" y="24" width="34" height="27" rx="4" fill="#dbc59d" />
            <path
              d="M42 41v48m-7-10 7 10 7-10"
              stroke="#b79560"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="192" cy="75" r="6" fill="#fffcf8" />
          </svg>
        </div>
      </header>
      <nav
        className="phy-step-nav phy-power-steps"
        aria-label={word(mode, '设计项目步骤', 'Design project steps')}
      >
        {steps.map((label, index) => (
          <button
            key={index}
            className={d.step === index ? 'active' : ''}
            aria-current={d.step === index ? 'step' : undefined}
            onClick={() => update((old) => ({ ...old, step: index }))}
          >
            <span>{index + 1}</span>
            <Text value={label} mode={mode} />
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
                <LeverWorkbench
                  mode={mode}
                  design={d.design}
                  onChange={(design) => update((old) => ({ ...old, design }))}
                />
                {fields(['question', 'prediction', 'materials', 'procedure'])}
              </>
            )}
            {d.step === 1 && (
              <>
                <div className="phy-lifting-build">
                  <h3>
                    <B
                      zh="一把尺、一块橡皮、一杯硬币"
                      en="A ruler, an eraser, a cup of coins"
                      mode={mode}
                    />
                  </h3>
                  <BuildDiagram mode={mode} />
                  <ol>
                    <li>
                      <B
                        zh="在低矮桌面铺软布。把橡皮作为支点，硬尺横放在上面；让尺子能慢慢转动。"
                        en="Put a cloth on a low tabletop. Rest a stiff ruler on an eraser pivot so it can turn slowly."
                        mode={mode}
                      />
                    </li>
                    <li>
                      <B
                        zh="把小纸杯固定在短端，放少量硬币，杯与硬币总质量不超过200 g。杯子开始时落在桌面，离桌只需一点点。"
                        en="Secure a small paper cup on the short side, with a few coins; keep cup plus coins at or below 200 g. Start with the cup on the table and lift only slightly."
                        mode={mode}
                      />
                    </li>
                    <li>
                      <B
                        zh="标出固定支点、固定载荷位置，再标两个手的位置。轻轻向下按，比较手感和移动距离；保持同一起始姿态。"
                        en="Mark the fixed pivot and load position, then two hand positions. Push down gently; compare effort and travel from the same starting pose."
                        mode={mode}
                      />
                    </li>
                    <li>
                      <B
                        zh="每次记录真实结果。重复一个位置。没有仪器就写观察；测力计读数需注明方向，手臂距离只是沿杆的标记。"
                        en="Record each actual result and repeat one setting. Without instruments, write observations. Note force-meter direction; arm distances are marks along the bar."
                        mode={mode}
                      />
                    </li>
                  </ol>
                  <p>
                    <B
                      zh="如果杯子滑动或支点移动，停下重新固定，保留这次记录并说明原因。别用手指卡住支点来假装固定，也别用大重量验证模型。"
                      en="If the cup slips or the pivot moves, stop, secure it again and retain that trial with a reason. Do not pinch the pivot with your fingers or use heavy loads to verify the model."
                      mode={mode}
                    />
                  </p>
                </div>
                {fields(['construction'])}
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
                    zh="已实际制作，并核对支点、载荷与手的位置标记。"
                    en="I built it and checked the pivot, load and hand marks."
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
                    zh="比较时用同一杯和硬币、同一支点与载荷位置、同一起始姿态，只改变手的位置。"
                    en="I compare the same cup and coins, pivot, load mark and starting pose, changing only the hand position."
                    mode={mode}
                  />
                </label>
              </>
            )}
            {d.step === 2 && (
              <>
                <p>
                  <B
                    zh="至少记录3次：同一载荷位置，两种手位置，并重复其中一种。先写自己的观察，再勾选核对；可选读数没测就留空。"
                    en="Record at least 3 trials: one load mark, two hand positions and a repeat of one. Write your own observations before checking; leave optional readings blank if unmeasured."
                    mode={mode}
                  />
                </p>
                <div className="phy-power-readings">
                  {d.trials.map((r, i) => {
                    const v = s.trials[i]!;
                    return (
                      <article
                        key={i}
                        className={`phy-power-trial ${v.excluded ? 'excluded' : ''}`}
                      >
                        <div className="phy-power-trial-heading">
                          <strong>
                            <B
                              zh={`试验 ${i + 1}`}
                              en={`Trial ${i + 1}`}
                              mode={mode}
                            />
                          </strong>
                          <Text value={liftingStatus(v)} mode={mode} />
                        </div>
                        {numbers(r, i, ['effortArmCm', 'loadArmCm'])}
                        <details
                          className="phy-lifting-optional"
                          open={
                            [
                              'payloadG',
                              'effortN',
                              'handTravelCm',
                              'liftCm',
                            ].some(
                              (key) =>
                                !!r[key as keyof typeof trialNumbers].trim(),
                            ) || undefined
                          }
                        >
                          <summary>
                            <B
                              zh="仪器与距离读数（可选）"
                              en="Instrument & travel readings (optional)"
                              mode={mode}
                            />
                          </summary>
                          {numbers(r, i, [
                            'payloadG',
                            'effortN',
                            'handTravelCm',
                            'liftCm',
                          ])}
                        </details>
                        <label>
                          <B
                            zh="实际抬升结果"
                            en="Actual lift result"
                            mode={mode}
                          />
                          <select
                            value={r.result}
                            aria-label={word(
                              mode,
                              `抬升结果 ${i + 1}`,
                              `Lift result ${i + 1}`,
                            )}
                            onChange={(e) =>
                              patch(i, {
                                result: e.target
                                  .value as LiftingTrial['result'],
                              })
                            }
                          >
                            {Object.entries(liftingResultLabels).map(
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
                            zh="我实际观察到什么？"
                            en="What did I actually observe?"
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
                            zh="已核对实际设置、结果与自己的观察。"
                            en="Checked the actual setting, result and my own observation."
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
                            zh="过程有问题，保留并申请排除"
                            en="Procedure issue: retain and request exclusion"
                            mode={mode}
                          />
                        </label>
                        {v.pendingReason && (
                          <p className="phy-power-alert" role="status">
                            <B
                              zh="先写原因；已核对的有效记录仍使用。没抬起来本身不是排除理由。"
                              en="Give a reason first; valid checked trials remain used. No lift alone is not a reason for exclusion."
                              mode={mode}
                            />
                          </p>
                        )}
                        {v.entered && !v.valid && !v.excluded && (
                          <p className="phy-power-alert" role="status">
                            <B
                              zh="请补两个位置、结果与具体观察。数字用最多3位小数；位置>0且≤100 cm，质量≤200 g、力≤50 N、手移动≤200 cm、升高≤20 cm。读数与结果需一致，原输入会保留。"
                              en="Add both marks, a result and observation. Use decimals with up to 3 places: marks >0 and ≤100 cm, mass ≤200 g, force ≤50 N, hand travel ≤200 cm and rise ≤20 cm. Readings must match the result; originals remain."
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
                  disabled={d.trials.length >= MAX_LIFTING_TRIALS}
                  onClick={() =>
                    update((old) => ({
                      ...old,
                      trials: [...old.trials, emptyLiftingTrial()],
                    }))
                  }
                >
                  <B
                    zh={
                      d.trials.length >= MAX_LIFTING_TRIALS
                        ? '8条原记录已保留'
                        : '＋ 增加试验，保留原记录'
                    }
                    en={
                      d.trials.length >= MAX_LIFTING_TRIALS
                        ? '8 original trials retained'
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
                            #{i + 1} · {r.effortArmCm || '—'} /{' '}
                            {r.loadArmCm || '—'} cm
                          </strong>
                          <Text
                            value={liftingResultLabels[r.result]}
                            mode={mode}
                          />
                          <p>{r.observation || '—'}</p>
                          <small>
                            <Text
                              value={liftingStatus(s.trials[i]!)}
                              mode={mode}
                            />
                            {r.reason && <> · {r.reason}</>}
                          </small>
                        </article>
                      ),
                  )}
                </div>
                {fields(['observation', 'explanation', 'uncertainty'])}
                <p>
                  <B
                    zh="记录完整检查的是证据有没有留下。即使没抬起或结果不一致，也可以完成认真调查。没有测量数据，就不计算实测机械优势或效率。"
                    en="Completeness checks whether evidence is recorded. No lift or inconsistent results can still form a careful investigation. Without measurements, no measured advantage or efficiency is calculated."
                    mode={mode}
                  />
                </p>
                <ProjectReport
                  mode={mode}
                  report={liftingMarkdown(d)}
                  hasData={liftingHasData(d)}
                  fileName="my-lifting-design.md"
                  downloadLabel={t(
                    '导出双语设计报告',
                    'Export bilingual design report',
                  )}
                  reportLabel={t(
                    '抬升装置双语报告',
                    'Bilingual lifting design report',
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
          <p className="phy-eyebrow">MY DESIGN EVIDENCE</p>
          <h3>
            <B
              zh={s.completed ? '记录完整' : '我的抬升设计'}
              en={s.completed ? 'Record complete' : 'My lifting design'}
              mode={mode}
            />
          </h3>
          <dl>
            {[
              [t('计划', 'Plan'), s.planned],
              [t('实际装置与比较条件', 'Build & conditions'), s.built],
              [t('两种设置与一次重复', 'Two settings & a repeat'), s.compared],
              [t('自己的解释', 'My explanation'), s.explained],
            ].map(([label, done], i) => (
              <div key={i}>
                <dt>
                  <Text value={label as ReturnType<typeof t>} mode={mode} />
                </dt>
                <dd>
                  <B
                    zh={done ? '已记录' : '待补充'}
                    en={done ? 'Recorded' : 'Still needed'}
                    mode={mode}
                  />
                </dd>
              </div>
            ))}
            <div>
              <dt>
                <B zh="已核对使用的试验" en="Checked used trials" mode={mode} />
              </dt>
              <dd>
                {s.used.length} <small>/ ≥3</small>
              </dd>
            </div>
          </dl>
          <p>
            <B
              zh="计划、实际制作确认、同一载荷位置的至少3次试验（两种手位置与一次重复）、处理所有已填记录，以及自己的解释，组成一份完整记录。"
              en="A complete record needs a plan, a checked physical build, at least 3 trials at one load mark (two hand positions and a repeat), resolved entered records and your explanation."
              mode={mode}
            />
          </p>
          <p>
            <B
              zh="草稿自动保存在当前浏览器；模型动画不算实物试验。记录完整不代表装置成功或理解已认证。"
              en="Drafts save in this browser; model playback is not a physical trial. A complete record does not certify success or understanding."
              mode={mode}
            />
          </p>
          <Link
            to="/physics/lesson/machines-longer-handle"
            className="phy-today-link"
          >
            <B
              zh="回看杠杆探索课 →"
              en="Revisit the lever lesson →"
              mode={mode}
            />
          </Link>
          <a
            className="phy-today-link"
            href="https://www.grc.nasa.gov/WWW/K-12/Summer_Training/KaeAvenueES/Tiny_Lever.html"
            target="_blank"
            rel="noreferrer"
          >
            NASA · Tiny Levers ↗
          </a>
        </aside>
      </div>
    </div>
  );
}
