import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { CheckCard } from './StageCheck';
import {
  evidenceStageOutcome,
  withEvidenceProject,
  type Store,
} from './progress';
import {
  actualEvidenceCaption,
  calculationCorrect,
  editEvidence,
  emptyEvidenceProject,
  evidenceAssumptions,
  evidenceProtocol,
  evidenceQuestions,
  evidenceQuestionLessons,
  evidenceReady,
  evidenceSummary,
  evidenceUnderstanding,
  graphTitle,
  potatoRecords,
  percentChange,
  saveEvidence,
  zeroEstimate,
  type EvidenceDraft,
} from './evidenceProject';
import { evidenceDataUrl, evidenceGraphSvg, evidenceSvg } from './evidenceSvg';
import './evidenceProject.css';

const fields = {
  claim: t(
    '主张：浓度与60 min净质量变化有什么关系？范围多大？',
    'Claim: how is concentration related to net mass change after 60 min, and over what range?',
  ),
  mechanism: t(
    '机制：用水势、选择透过膜解释；明确哪些是假设。',
    'Mechanism: use water potential and a selectively permeable membrane; identify assumptions.',
  ),
  limitation: t(
    '局限：零交点为什么不是精确胞内浓度？范围为什么不是置信区间？',
    'Limits: why is the zero crossing not an exact internal concentration, and why is a range not a confidence interval?',
  ),
  alternative: t(
    '替代解释：除净水移动，还有什么影响称重？怎样区分？',
    'Alternative explanation: what besides net water movement could change measured mass, and how could you distinguish it?',
  ),
  variable: t(
    '进一步实验：只主动改变什么变量及水平？',
    'Further experiment: which variable and levels will you deliberately change?',
  ),
  measured: t(
    '测量结果：什么量、单位、方法？',
    'Measured outcome: what quantity, units and method?',
  ),
  timing: t(
    '测量时间：何时测、间隔及单位？',
    'Measurement time: when, at what interval, and in what units?',
  ),
  controls: t(
    '控制：保持什么相同？比较基准是什么？',
    'Controls: what stays the same, and what is the comparison baseline?',
  ),
  repeats: t(
    '生物重复：多少独立块茎？如何块内随机并保留配对？',
    'Biological replication: how many independent tubers, how will you randomize within blocks and retain pairing?',
  ),
  challenge: t(
    '可证伪预测：什么结果会挑战主张或渗透解释？',
    'Testable prediction: what result would challenge your claim or osmotic interpretation?',
  ),
};
export function EvidenceProject({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const d = store.progress.projects.S05 ?? emptyEvidenceProject(),
    outcome = evidenceStageOutcome(store.progress),
    understanding = evidenceUnderstanding(d);
  const caption = actualEvidenceCaption(d);
  const patch = (value: Partial<EvidenceDraft>) =>
    store.update((p) =>
      withEvidenceProject(
        p,
        editEvidence(p.projects.S05 ?? emptyEvidenceProject(), value),
      ),
    );
  const tr = (zh: string, en: string) => <Text mode={mode} text={t(zh, en)} />;
  return (
    <article className="bio-evidence">
      <span className="bio-eyebrow">S05 / EVIDENCE LAB</span>
      <h1>{tr('生物学证据报告', 'Biology evidence report')}</h1>
      <p>
        {tr(
          '从20条配对数据到可以质疑的科学解释。科学说明用任一语言；第二语言练习不锁进度。草稿自动保存。',
          'Turn 20 paired records into a scientific explanation that can be challenged. Write scientific explanations in either language; second-language practice never locks progress. Drafts autosave.',
        )}
      </p>
      <p role="status">
        {tr(
          `S05：${outcome.lessons}/24课 · ${outcome.missions}/6任务 · 理解${understanding.correct}/6 · ${outcome.complete ? '阶段完成' : '继续收集证据'}`,
          `S05: ${outcome.lessons}/24 lessons · ${outcome.missions}/6 missions · understanding ${understanding.correct}/6 · ${outcome.complete ? 'stage complete' : 'keep building evidence'}`,
        )}
      </p>
      <section>
        <h2>{tr('① 读清实验单位', '① Identify the experimental units')}</h2>
        <p>
          <Text mode={mode} text={evidenceProtocol} />
        </p>
        <p>
          <Text mode={mode} text={evidenceAssumptions} />
        </p>
        <div
          className="bio-evidence-scroll"
          role="region"
          aria-label={
            mode === 'en'
              ? 'All 20 paired raw mass records'
              : '全部20条原始配对质量数据'
          }
          tabIndex={0}
        >
          <table>
            <caption>
              {tr(
                '全部原始记录 · 初终质量属于同一条',
                'All raw records · each before/after pair is the same strip',
              )}
            </caption>
            <thead>
              <tr>
                {[
                  'ID',
                  'Block / 块茎',
                  'mol/L',
                  'Before / 初 g',
                  'After / 终 g',
                  'Change / 变化 %',
                ].map((s) => (
                  <th key={s} scope="col">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {potatoRecords.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.id}</th>
                  <td>{r.block}</td>
                  <td>{r.concentration.toFixed(1)}</td>
                  <td>{r.before.toFixed(2)}</td>
                  <td>{r.after.toFixed(2)}</td>
                  <td>{percentChange(r.before, r.after).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>
          {tr('② 先算每条，再求均值', '② Calculate each strip, then average')}
        </h2>
        <p>100 × (after − before) / before</p>
        <p>
          {tr(
            '初质量是分母。质量不同，直接平均质量差或先平均初终质量再算比率，会给出不同的加权结果。',
            'The starting mass is the denominator. With different starting masses, averaging raw differences or taking a percentage of mean masses gives a different weighted result.',
          )}
        </p>
        {[potatoRecords[1]!, potatoRecords[2]!].map((r, i) => (
          <label key={r.id}>
            {tr(
              `${r.id}：${r.before.toFixed(2)} → ${r.after.toFixed(2)} g，百分比变化（保留符号）`,
              `Percentage change for ${r.id}: ${r.before.toFixed(2)} → ${r.after.toFixed(2)} g (keep the sign)`,
            )}
            <input
              type="text"
              inputMode="decimal"
              value={d.calculations[i]}
              onChange={(e) =>
                patch({
                  calculations: d.calculations.map((v, j) =>
                    j === i ? e.target.value : v,
                  ),
                })
              }
            />
            {d.calculations[i] !== '' && (
              <span role="status">
                {calculationCorrect(d.calculations[i]!, i)
                  ? tr(
                      '正确：以初质量为基准。',
                      'Correct: the initial mass is the reference.',
                    )
                  : tr(
                      `再试：(${r.after.toFixed(2)} − ${r.before.toFixed(2)}) ÷ ${r.before.toFixed(2)} × 100。分母不是终质量；减少要负号。`,
                      `Try (${r.after.toFixed(2)} − ${r.before.toFixed(2)}) ÷ ${r.before.toFixed(2)} × 100. Do not divide by final mass; loss needs a minus sign.`,
                    )}
              </span>
            )}
          </label>
        ))}
        <div
          className="bio-evidence-scroll"
          role="region"
          aria-label={
            mode === 'en' ? 'Five concentration summaries' : '五组浓度汇总'
          }
          tabIndex={0}
        >
          <table>
            <caption>
              {tr(
                '每浓度4条，来自A–D；均值是四个百分比的平均',
                'Each concentration: four strips from A–D; mean of four percentages',
              )}
            </caption>
            <thead>
              <tr>
                {['mol/L', 'Mean / 均值 %', 'Min %', 'Max %', 'n'].map((s) => (
                  <th key={s} scope="col">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evidenceSummary.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.concentration.toFixed(1)}</th>
                  <td>{r.mean.toFixed(2)}</td>
                  <td>{r.min.toFixed(2)}</td>
                  <td>{r.max.toFixed(2)}</td>
                  <td>{r.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>
          {tr(
            '③ 修复图表，观察选择的影响',
            '③ Repair the graph and observe each choice',
          )}
        </h2>
        {(['xAxis', 'yAxis', 'display'] as const).map((key, i) => (
          <label key={key}>
            {
              [
                tr('横轴', 'Horizontal axis'),
                tr('纵轴', 'Vertical axis'),
                tr('证据显示', 'Evidence display'),
              ][i]
            }
            <select
              value={d[key]}
              onChange={(e) => patch({ [key]: Number(e.target.value) })}
            >
              {(i === 0
                ? [
                    t('外液浓度 (mol/L)', 'External concentration (mol/L)'),
                    t('杯子类别1–5', 'Cup categories 1–5'),
                  ]
                : i === 1
                  ? [
                      t(
                        '每条质量百分比变化',
                        'Percentage mass change per strip',
                      ),
                      t('原始质量差 (g)', 'Raw mass difference (g)'),
                    ]
                  : [
                      t(
                        '原始点 + 均值 + min–max',
                        'Raw points + mean + min–max',
                      ),
                      t('只有均值', 'Mean only'),
                    ]
              ).map((v, j) => (
                <option key={j} value={j}>
                  {mode === 'en'
                    ? v.en
                    : mode === 'zh'
                      ? v.zh
                      : `${v.zh} · ${v.en}`}
                </option>
              ))}
            </select>
          </label>
        ))}
        <p role="status">
          {d.xAxis !== 0 &&
            tr(
              '类别横轴隐藏了连续浓度，不能诚实支持零交点估计。',
              'A categorical axis hides continuous concentration and cannot honestly support zero-crossing estimation.',
            )}
          {d.yAxis !== 0 &&
            tr(
              '纵轴现在是克数，大条的绝对变化权重较大；应比较每条相对初质量的变化。',
              'The y axis now shows grams: larger strips contribute larger absolute changes. Compare change relative to each strip’s initial mass.',
            )}
          {d.display !== 0 &&
            tr(
              '只有均值掩盖了个体差异；恢复原始点和范围。',
              'Means alone hide individual differences; restore raw points and ranges.',
            )}
          {d.xAxis === 0 &&
            d.yAxis === 0 &&
            d.display === 0 &&
            tr(
              '图已保留方向、零线、所有原始点和组内范围；范围不是置信区间。',
              'The graph preserves direction, zero, every raw point and within-group ranges. Ranges are not confidence intervals.',
            )}
        </p>
        <figure>
          <p>
            {tr(
              '图可横向滚动；可用Tab聚焦图框，再用方向键查看。完整数据和图注在图外保留。',
              'Scroll the graph sideways. Tab to its frame and use arrow keys to inspect it. Complete data and captions remain available outside the graph.',
            )}
          </p>
          <div
            className="bio-evidence-graph-scroll"
            role="region"
            tabIndex={0}
            aria-label={
              mode === 'en'
                ? 'Scrollable evidence graph: current axes and data display'
                : '可横向滚动的证据图：当前坐标轴和数据显示'
            }
          >
            <img
              src={evidenceDataUrl(evidenceGraphSvg(d))}
              alt={
                mode === 'en'
                  ? 'Graph preview: current axes and data display'
                  : '图表预览：当前坐标轴和证据显示'
              }
            />
          </div>
          <figcaption>
            <strong>{graphTitle}</strong>
            <p lang="zh">{caption.zh}</p>
            <p lang="en">{caption.en}</p>
          </figcaption>
        </figure>
        <p>
          {tr(
            '已提供合适的英文科学标题和真正双语图注，无须先掌握英文写作。',
            'A suitable English scientific title and a genuine bilingual caption are provided; English composition is not a prerequisite.',
          )}
        </p>
        <p>
          {tr(
            `0.2 mol/L均值为正，0.4为负；线性内插约${zeroEstimate.toFixed(2)} mol/L。只是在本条件下60 min零净质量变化的估计。`,
            `The mean is positive at 0.2 mol/L and negative at 0.4; linear interpolation gives about ${zeroEstimate.toFixed(2)} mol/L. This estimates zero net mass change after 60 min under these conditions only.`,
          )}
        </p>
      </section>
      <section>
        <h2>{tr('④ 写可以检验的论证', '④ Write a testable argument')}</h2>
        <p>
          {tr(
            '选择两条不同的有效数据引用，再在主张/机制中说出这些数值为何相关。只检查引用存在，不会自动判断文字科学质量。',
            'Select two different valid data citations, then explain in your claim/mechanism why their values matter. Citation existence is checked; scientific prose quality is not automatically graded.',
          )}
        </p>
        {[0, 1].map((i) => (
          <label key={i}>
            {tr(`证据引用 ${i + 1}`, `Evidence citation ${i + 1}`)}
            <select
              value={d.citations[i]}
              onChange={(e) =>
                patch({
                  citations: d.citations.map((v, j) =>
                    i === j ? e.target.value : v,
                  ),
                })
              }
            >
              <option value="">
                {mode === 'en' ? 'Choose a record' : '选择一条记录'}
              </option>
              {evidenceSummary.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.concentration} mol/L: mean {r.mean.toFixed(2)}%, min–max{' '}
                  {r.min.toFixed(2)}–{r.max.toFixed(2)}%, n=4
                </option>
              ))}
              {potatoRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.concentration} mol/L, {r.before.toFixed(2)} →{' '}
                  {r.after.toFixed(2)} g,{' '}
                  {percentChange(r.before, r.after).toFixed(2)}%
                </option>
              ))}
            </select>
          </label>
        ))}
        {Object.entries(fields).map(([key, label]) => (
          <label key={key}>
            <Text mode={mode} text={label} />
            <textarea
              rows={4}
              value={d[key as keyof typeof fields]}
              onChange={(e) => patch({ [key]: e.target.value })}
            />
          </label>
        ))}
        <label>
          {tr(
            '可选第二语言练习：The evidence suggests… because…; however…',
            'Optional second-language practice: 证据表明…因为…；但…',
          )}
          <textarea
            rows={3}
            value={d.languagePractice}
            onChange={(e) => patch({ languagePractice: e.target.value })}
          />
        </label>
        <details>
          <summary>
            {tr(
              '一个示范论证与人工自核标准',
              'One model argument and manual self-review rubric',
            )}
          </summary>
          <p>
            {tr(
              '示范：0.2 mol/L均值约+4%，0.4约−4%，每组n=4；因此60 min零变化估计约0.30 mol/L。假定蔗糖这段时间近似不透膜且其他净质量变化可忽略，外液浓度升高降低水势，可解释水的净移动改变。质量数据本身不能证明机制：擦干不一致也可能改变称重。范围不是CI，不宣称显著；零变化也不能确定胞内浓度或平衡。可用更多独立块茎、块内随机，在0.20–0.40 mol/L每0.05一级，同样22°C/50 mL/尺寸/擦干，配对测0、30、60、120 min的质量(g)并换算%。若零交点随时间大幅漂移，就挑战把60 min当平衡的解释。',
              'Example: the mean is about +4% at 0.2 mol/L and −4% at 0.4, n=4 each, suggesting zero change at about 0.30 mol/L after 60 min. Assuming sucrose is approximately impermeant during this period and other net mass changes are negligible, increasing external sucrose lowers water potential and can explain altered net water movement. Mass alone cannot prove this mechanism: inconsistent blotting could also change readings. Ranges are not CIs and do not establish significance; zero change does not establish internal concentration or equilibrium. A follow-up could use more independent tubers, within-block randomization, 0.05 mol/L steps from 0.20 to 0.40, and paired masses (g) at 0, 30, 60 and 120 min, with 22°C, 50 mL, dimensions and blotting controlled. A large shift in the zero crossing over time would challenge treating 60 min as equilibrium.',
            )}
          </p>
          <ol>
            {[
              t(
                '主张是否限定时间、温度和浓度范围？',
                'Is the claim limited to the tested time, temperature and concentrations?',
              ),
              t(
                '两条不同引用是否含数值、单位、方向与n，且真的支持主张？',
                'Do two distinct citations include values, units, direction and n, and actually support the claim?',
              ),
              t(
                '是否区分观察、机制假设、替代解释和未测因素？',
                'Are observations, mechanism assumptions, alternatives and unmeasured factors distinguished?',
              ),
              t(
                '后续实验是否有变量、测量、时间单位、控制、独立生物重复和挑战性结果？',
                'Does the follow-up specify variables, measurements, time units, controls, independent biological replication and a challenging result?',
              ),
            ].map((v, i) => (
              <li key={i}>
                <Text mode={mode} text={v} />
              </li>
            ))}
          </ol>
        </details>
        <label className="bio-evidence-check">
          <input
            type="checkbox"
            checked={d.reviewed}
            onChange={(e) => patch({ reviewed: e.target.checked })}
          />
          {tr(
            '我已按上述标准人工自核。结构完整不代表科学解释已被自动判对。',
            'I have reviewed my report against the rubric. Structural completeness does not mean the scientific explanation has been automatically judged correct.',
          )}
        </label>
      </section>
      <section>
        <h2>
          {tr(
            '⑤ 跨单元理解：错了可以订正',
            '⑤ Connect the units: revise after feedback',
          )}
        </h2>
        {evidenceQuestions.map((question, i) => (
          <div className="bio-evidence-question" key={question.id}>
            <CheckCard
              question={question}
              relatedLesson={evidenceQuestionLessons[i]!}
              mode={mode}
              answer={d.answers[question.id]}
              save={(value) =>
                patch({ answers: { ...d.answers, [question.id]: value } })
              }
            />
          </div>
        ))}
        <p>
          {tr(
            '六题全部作答，至少五题正确，才满足阶段理解条件。',
            'Answer all six questions and get at least five correct for the stage understanding requirement.',
          )}
        </p>
      </section>
      <section>
        <h2>
          {tr(
            '⑥ 保存与下载完整报告',
            '⑥ Save and download the complete report',
          )}
        </h2>
        <p>
          {tr(
            '保存检查两次计算、三个图设置、两条不同有效引用、必填说明（每项至少8字/字符）和人工自核。文字质量由你和教师复核。编辑会撤销报告保存标记。',
            'Saving checks both calculations, three graph settings, two distinct valid citations, required explanations (at least eight characters each) and self-review. You and a teacher assess prose quality. Editing clears the report’s saved marker.',
          )}
        </p>
        <div className="bio-evidence-actions">
          <button
            className="bio-button"
            disabled={!evidenceReady(d)}
            onClick={() =>
              store.update((p) =>
                withEvidenceProject(
                  p,
                  saveEvidence(p.projects.S05 ?? emptyEvidenceProject()),
                ),
              )
            }
          >
            {tr('保存已自核报告', 'Save self-reviewed report')}
          </button>
          <a
            className="bio-button"
            href={evidenceDataUrl(evidenceSvg(d))}
            download="biology-evidence-report.svg"
          >
            {tr(
              '下载完整图文SVG（含草稿）',
              'Download full SVG report (draft included)',
            )}
          </a>
        </div>
        <p role="status">
          {d.savedAt
            ? tr(
                '报告已保存；阶段还需24课、6任务和理解检查。',
                'Report saved; the stage also requires 24 lessons, six missions and understanding checks.',
              )
            : tr(
                '草稿自动保存，报告尚未通过结构保存检查。',
                'Draft autosaves; report has not passed the structural save check.',
              )}
        </p>
        <p>
          <Link to="/biology/notebook?unit=U30">
            {tr('回到U30证据任务 →', 'Return to the U30 evidence mission →')}
          </Link>
        </p>
      </section>
      <details>
        <summary>{tr('来源与项目状态', 'Sources and project status')}</summary>
        <p>
          {tr(
            '原创数据、图与工作台，2026-11-14核验概念来源。试学稿，外部科学复核和学生试用待办；公开技能参考不代表完整考试大纲覆盖，不替代实际实验。',
            'Original data, graph and workbench. Concept sources checked 2026-11-14. Pilot: external science review and learner trials remain pending. Public skills references do not claim complete exam coverage or replace practical work.',
          )}
        </p>
        <ul>
          <li>
            <a href="https://openstax.org/books/biology-2e/pages/5-2-passive-transport">
              OpenStax Biology 2e 5.2 — passive transport
            </a>
          </li>
          <li>
            <a href="https://www.aqa.org.uk/subjects/science/gcse/science-8465/specification/practical-assessment">
              AQA practical analysis and evaluation skills
            </a>
          </li>
          <li>
            <a href="https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm">
              NIST randomized block designs
            </a>
          </li>
        </ul>
      </details>
    </article>
  );
}
