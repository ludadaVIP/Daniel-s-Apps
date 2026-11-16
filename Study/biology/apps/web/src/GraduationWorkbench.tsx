import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { CheckCard } from './StageCheck';
import {
  graduationStageOutcome,
  withGraduationProject,
  type Store,
} from './progress';
import {
  actualGraduationCaption,
  appendGraduationPractice,
  calculationFeedback,
  changeObservationStartDate,
  caseProblems,
  datasetLimits,
  editGraduationCase,
  emptyGraduationProject,
  formatNumber,
  graduationCases,
  graduationQuestionLessons,
  graduationQuestions,
  graduationUnderstanding,
  graduationTextLimit,
  manualRubric,
  observationDate,
  observationLimits,
  plantAnalysis,
  ratioPercent,
  researchFields,
  saveGraduationCase,
  speechSeconds,
  speechTitles,
  structuredAbstract,
  validCitationIds,
  validPlantRecords,
  wolfRecords,
  wolfSource,
  wolfSummary,
  wolfSourceTotals,
  type GraphKind,
  type PlantRecord,
  type ResearchCase,
  type Scope,
} from './graduationProject';
import {
  graduationGraphSvg,
  graduationReportDataUrl,
  researchLabels,
} from './graduationReport';
import './graduationProject.css';

const titles = {
  official: t('官方生态数据', 'Official ecological data'),
  observation: t('安全家庭植物观察', 'Safe home plant observation'),
};
const starters = {
  question: 'Within the selected records, how does … compare with …?',
  claim: 'In these records, … . This claim is limited to … .',
  reasoning:
    'Record … reports … (unit), while record … reports … . The denominator is … . This supports … because … .',
  mechanism:
    'One possible mechanism is … . This dataset does not measure …, so this remains a hypothesis.',
  limitation:
    'The sampling unit is … . Repeated observations are not independent because … .',
  alternative:
    'An alternative explanation is … . To distinguish it, I would measure … .',
  nextQuestion: 'Would … differ if …, within …?',
  measured: 'I would measure … in … (unit) on … (dates), using … .',
  sampling:
    'The independent unit would be … . I would compare … independent units rather than counting repeated readings as replicates.',
  challenge: 'My claim would be challenged if … .',
} as const;
export function GraduationProject({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const d = store.progress.projects.S06 ?? emptyGraduationProject();
  const id = d.active,
    c = d.cases[id],
    problems = caseProblems(id, c);
  const outcome = graduationStageOutcome(store.progress),
    check = graduationUnderstanding(d);
  const [rowId, setRowId] = useState('');
  const [plant, setPlant] = useState('');
  const [day, setDay] = useState('');
  const [height, setHeight] = useState('');
  const [missing, setMissing] = useState(false);
  const [rowError, setRowError] = useState(false);
  const [showProblems, setShowProblems] = useState(false);
  const [starterError, setStarterError] = useState<string | null>(null);
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [dateError, setDateError] = useState(false);
  const dateHelpId = useId();
  const update = (patch: Partial<ResearchCase>) =>
    store.update((p) =>
      withGraduationProject(
        p,
        editGraduationCase(
          p.projects.S06 ?? emptyGraduationProject(),
          id,
          patch,
        ),
      ),
    );
  const text = (value: LocalizedText) => <Text mode={mode} text={value} />;
  const appendStarter = (field: keyof typeof starters) => {
    const result = appendGraduationPractice(d, id, starters[field]);
    setStarterError(result.accepted ? null : field);
    if (result.accepted)
      store.update((p) => withGraduationProject(p, result.draft));
  };
  const resetRow = () => {
    setRowId('');
    setPlant('');
    setDay('');
    setHeight('');
    setMissing(false);
    setRowError(false);
  };
  const submitRow = () => {
    const dayNumber = /^\d+$/.test(day) ? Number(day) : NaN;
    const value = missing
      ? null
      : /^\d+(?:\.\d*)?$/.test(height.trim())
        ? Number(height)
        : NaN;
    const row: PlantRecord = {
      id:
        rowId ||
        `P${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      plant: plant.trim(),
      day: dayNumber,
      value,
    };
    const records = rowId
      ? c.records.map((r) => (r.id === rowId ? row : r))
      : [...c.records, row];
    if (!validPlantRecords(records)) {
      setRowError(true);
      return;
    }
    update({ records, activePlant: c.activePlant || row.plant });
    resetRow();
  };
  const deleteRow = (recordId: string) => {
    const records = c.records.filter((r) => r.id !== recordId);
    const activePlant = records.some((r) => r.plant === c.activePlant)
      ? c.activePlant
      : (records[0]?.plant ?? '');
    update({ records, activePlant });
    if (rowId === recordId) resetRow();
  };
  const editRow = (r: PlantRecord) => {
    setRowId(r.id);
    setPlant(r.plant);
    setDay(String(r.day));
    setHeight(r.value === null ? '' : String(r.value));
    setMissing(r.value === null);
    setRowError(false);
  };
  const abstract = structuredAbstract(id, c),
    caption = actualGraduationCaption(id, c);
  const analysis = plantAnalysis(c),
    summary = wolfSummary(c.scope);
  return (
    <div className="bio-graduation">
      <span className="bio-eyebrow">
        S06-P01 / {text(t('毕业研究工作台', 'GRADUATION RESEARCH WORKBENCH'))}
      </span>
      <h1>{text(t('我的生命科学研究', 'My Biology Investigation'))}</h1>
      <p>
        {text(
          t(
            '从真实资料提出问题、分析证据，写下边界，再用自己的话讲明白。文字可任选语言；双语结构化摘要和图注由实际数据提供辅助支架。',
            'Ask a question of real records, analyse evidence, state its boundaries, and explain it in your own words. Write in either language; actual data provide an assisted bilingual abstract and caption.',
          ),
        )}
      </p>
      <nav
        className="bio-graduation-cases"
        aria-label={
          mode === 'en'
            ? 'Choose research path; drafts are kept separately'
            : '选择研究路径；分别保留草稿'
        }
      >
        {graduationCases.map((caseId) => (
          <button
            key={caseId}
            type="button"
            aria-pressed={id === caseId}
            onClick={() => {
              store.update((p) =>
                withGraduationProject(p, {
                  ...(p.projects.S06 ?? emptyGraduationProject()),
                  active: caseId,
                }),
              );
              resetRow();
              setShowProblems(false);
              setStarterError(null);
              setPendingDate(null);
              setDateError(false);
            }}
          >
            {text(titles[caseId])}
            {d.cases[caseId].savedAt ? ' ✓' : ''}
          </button>
        ))}
      </nav>
      <p role="status">
        {text(
          c.savedAt
            ? t(
                '此题材已保存为完整报告。编辑只撤除此题材的保存状态；另一题材保留。',
                'This case is saved as a complete report. Editing removes only this case’s saved status; the other case is retained.',
              )
            : t(
                '此题材为自动保存的草稿，尚未保存为完整报告。',
                'This case is an autosaved draft, not yet saved as a complete report.',
              ),
        )}
      </p>
      <section>
        <h2>
          {text(t('1 · 来源、方法与研究范围', '1 · Source, method and scope'))}
        </h2>
        <p>{text(id === 'official' ? datasetLimits : observationLimits)}</p>
        {id === 'official' ? (
          <>
            <dl className="bio-graduation-source">
              <dt>{text(t('来源机构与题名', 'Agency and title'))}</dt>
              <dd>
                {wolfSource.agency} · {wolfSource.title}
              </dd>
              <dt>
                {text(
                  t('观察与核验日期', 'Observation and verification dates'),
                )}
              </dt>
              <dd>
                {wolfSource.observationDate} · {wolfSource.accessDate} ·{' '}
                {text(t('物理第5页', 'Physical page 5'))}
              </dd>
              <dt>SHA256</dt>
              <dd>{wolfSource.sha256}</dd>
            </dl>
            <p>
              <a href={wolfSource.url} target="_blank" rel="noreferrer">
                {text(t('查看NPS原报告', 'Read the original NPS report'))}
              </a>{' '}
              ·{' '}
              <a
                href={wolfSource.mechanismSource}
                target="_blank"
                rel="noreferrer"
              >
                {text(t('官方生态背景资料', 'Official ecology background'))}
              </a>
            </p>
            <p>
              {text(
                t(
                  '来源方法：NPS利用野外监测、项圈追踪及群体观察编制年末汇总；本工作台仅转录该表十行分类计数，未复制原图。汇总用于校验，不再相加。',
                  'Source method: NPS combines monitoring, collar tracking and group observations in year-end reporting. This workbench transcribes ten grouped count rows and draws original graphs. Published totals are cross-checks, not extra records.',
                ),
              )}
            </p>
            <div className="bio-graduation-controls">
              <label>
                {text(t('分析范围', 'Analysis scope'))}
                <select
                  value={c.scope}
                  onChange={(e) => update({ scope: e.target.value as Scope })}
                >
                  <option value="all">All / 全园</option>
                  <option value="Northern Range">Northern Range / 北部</option>
                  <option value="Interior">Interior / 内部</option>
                </select>
              </label>
              <label>
                {text(t('图表选择', 'Graph type'))}
                <select
                  value={c.graph}
                  onChange={(e) =>
                    update({ graph: e.target.value as GraphKind })
                  }
                >
                  <option value="counts">Counts / 分类计数</option>
                  <option value="shares">
                    Pooled regional pup shares / 地区合并幼狼比例
                  </option>
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() =>
                update({
                  text: {
                    ...c.text,
                    question:
                      c.graph === 'counts'
                        ? `在${c.scope}，2025年末成年与幼狼的计数有何差异？ / In ${c.scope}, how do adult and pup counts compare at the end of 2025?`
                        : `在${c.scope}，2025年末合并幼狼份额是多少？ / What is the pooled year-end pup share in ${c.scope} in 2025?`,
                  },
                })
              }
            >
              {text(
                t(
                  '使用可编辑的双语问题支架',
                  'Use an editable bilingual question scaffold',
                ),
              )}
            </button>
            <div
              className="bio-graduation-scroll"
              tabIndex={0}
              role="region"
              aria-label={
                mode === 'en'
                  ? 'All ten original data rows; scroll horizontally'
                  : '全部十行原始数据，可横向滚动'
              }
            >
              <table>
                <thead>
                  <tr>
                    {[
                      'ID',
                      'Region / 地区',
                      'Group / 群体',
                      'Kind / 类型',
                      'Adults / 成年',
                      'Pups / 幼狼',
                      'Total / 总计',
                      'Pup share / 幼狼份额',
                      'Scope / 范围',
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wolfRecords.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.region}</td>
                      <td>{r.group}</td>
                      <td>{r.kind}</td>
                      <td>{r.adults}</td>
                      <td>{r.pups}</td>
                      <td>{r.total}</td>
                      <td>
                        {formatNumber(ratioPercent(r.pups, r.total))}
                        {r.total ? '%' : ''}
                      </td>
                      <td>
                        {text(
                          c.scope === 'all' || r.region === c.scope
                            ? t('纳入', 'Included')
                            : t('排除：其他地区', 'Excluded: other region'),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              {text(
                t(
                  `当前${summary.rows}行：成年${summary.adults}只，幼狼${summary.pups}只，共${summary.total}只。合并比例 ${summary.pups}/${summary.total} ×100 = ${formatNumber(summary.share)}%。`,
                  `Current ${summary.rows} rows: ${summary.adults} adults, ${summary.pups} pups, ${summary.total} wolves. Pooled share ${summary.pups}/${summary.total} ×100 = ${formatNumber(summary.share)}%.`,
                ),
              )}
            </p>
            <details>
              <summary>
                {text(
                  t(
                    '原表汇总：仅作交叉校验，不再相加',
                    'Published totals: cross-checks only, never added again',
                  ),
                )}
              </summary>
              {Object.entries(wolfSourceTotals).map(([scope, row]) => (
                <p key={scope}>
                  {scope}: {row.adults} adults / 成年 + {row.pups} pups / 幼狼 ={' '}
                  {row.total} wolves / 只
                </p>
              ))}
            </details>
          </>
        ) : (
          <>
            <p>
              {text(
                t(
                  '产品默认没有实测数据。先写来源和测量方法：用同一参照点与尺，记录同一株从基部到选定顶点的高度cm，保持正常照料。日0对应起始日期，允许不等间隔；同株同日仅一行。3–100行，缺失可明确记录。',
                  'No measurements are prefilled. Describe the source and method: use the same reference point and ruler to measure height in cm from the base to a chosen top point, during normal care. Day 0 is the start date; unequal intervals are allowed. One row per plant per day; 3–100 records with explicit missing values.',
                ),
              )}
            </p>
            <div className="bio-graduation-controls">
              <label>
                {text(t('起始日期（真实日0）', 'Start date (real day 0)'))}
                <input
                  type="date"
                  min="1900-01-01"
                  max="9999-12-31"
                  value={pendingDate ?? c.startDate}
                  aria-invalid={dateError || undefined}
                  aria-describedby={dateError ? dateHelpId : undefined}
                  onChange={(e) => {
                    const date = e.target.value;
                    setPendingDate(date);
                    const result = changeObservationStartDate(d, date);
                    const accepted =
                      result.accepted && !e.target.validity.badInput;
                    setDateError(!accepted);
                    if (accepted)
                      store.update((p) =>
                        withGraduationProject(p, result.draft),
                      );
                  }}
                />
                {dateError && (
                  <span id={dateHelpId} role="alert">
                    {text(
                      t(
                        `请输入1900-01-01至9999-12-31的有效日期，或清空。此次输入未写入报告；报告仍使用上次有效日期：${c.startDate || '尚未设置'}。`,
                        `Enter a valid date from 1900-01-01 to 9999-12-31, or clear the field. This input was not saved to the report; its last valid date remains ${c.startDate || 'not set'}.`,
                      ),
                    )}
                  </span>
                )}
              </label>
              <label>
                {text(
                  t(
                    '图表与分析只选一株',
                    'One plant for the graph and analysis',
                  ),
                )}
                <select
                  value={c.activePlant}
                  onChange={(e) => update({ activePlant: e.target.value })}
                >
                  {!c.records.length && <option value="">—</option>}
                  {Array.from(new Set(c.records.map((r) => r.plant))).map(
                    (p) => (
                      <option key={p}>{p}</option>
                    ),
                  )}
                </select>
              </label>
            </div>
            <fieldset>
              <legend>
                {text(
                  rowId
                    ? t('编辑记录（ID保持不变）', 'Edit record (stable ID)')
                    : t(
                        '添加自己真实观察的记录',
                        'Add your own real observation',
                      ),
                )}
              </legend>
              <div className="bio-graduation-controls">
                <label>
                  {text(t('植株ID或昵称', 'Plant ID or nickname'))}
                  <input
                    value={plant}
                    maxLength={80}
                    onChange={(e) => setPlant(e.target.value)}
                  />
                </label>
                <label>
                  {text(
                    t('实际经过日（整数）', 'Actual elapsed day (integer)'),
                  )}
                  <input
                    inputMode="numeric"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  />
                </label>
                <label>
                  {text(
                    t('高度cm（0为真实0）', 'Height in cm (0 is a real zero)'),
                  )}
                  <input
                    inputMode="decimal"
                    disabled={missing}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </label>
              </div>
              <label className="bio-graduation-checkbox">
                <input
                  type="checkbox"
                  checked={missing}
                  onChange={(e) => setMissing(e.target.checked)}
                />
                {text(
                  t(
                    '此次高度缺失（NA，不填0）',
                    'Height missing for this reading (NA, not zero)',
                  ),
                )}
              </label>
              <button type="button" onClick={submitRow}>
                {text(
                  rowId
                    ? t('应用此记录修改', 'Apply record edit')
                    : t('添加记录', 'Add record'),
                )}
              </button>
              {rowId && (
                <button type="button" onClick={resetRow}>
                  {text(t('取消编辑', 'Cancel edit'))}
                </button>
              )}
              {rowError && (
                <p role="alert">
                  {text(
                    t(
                      '检查植株名、0–36500整数日、0–10000有限高度、不同的同株日期及最多100行。缺失请勾选。',
                      'Check the plant name, integer day 0–36500, finite height 0–10000, unique plant/day and 100-row maximum. Tick missing when appropriate.',
                    ),
                  )}
                </p>
              )}
            </fieldset>
            <div
              className="bio-graduation-scroll"
              tabIndex={0}
              role="region"
              aria-label={
                mode === 'en'
                  ? 'All observation records, scroll horizontally'
                  : '全部观察记录，可横向滚动'
              }
            >
              <table>
                <thead>
                  <tr>
                    {[
                      'ID',
                      'Plant / 植株',
                      'Day / 日',
                      'Date / 日期',
                      'Height cm / 高度',
                      'Inclusion / 纳入',
                      'Actions / 操作',
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.records.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.plant}</td>
                      <td>{r.day}</td>
                      <td>{observationDate(c, r.day)}</td>
                      <td>{r.value === null ? 'NA' : r.value}</td>
                      <td>
                        {text(
                          r.plant !== c.activePlant
                            ? t('其他植株，不纳入', 'Other plant, excluded')
                            : r.value === null
                              ? t(
                                  '缺失，计算排除/图中断线',
                                  'Missing; excluded from calculation, breaks line',
                                )
                              : t('纳入', 'Included'),
                        )}
                      </td>
                      <td>
                        <button type="button" onClick={() => editRow(r)}>
                          {text(t('编辑', 'Edit'))}
                        </button>
                        <button type="button" onClick={() => deleteRow(r.id)}>
                          {text(t('删除', 'Delete'))}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!c.records.length && (
                <p>
                  {text(
                    t(
                      '暂无记录；添加真实观察后才会生成数据图。',
                      'No records yet; add real observations to generate a graph.',
                    ),
                  )}
                </p>
              )}
            </div>
            <p>
              {text(
                t(
                  `所选植株有${analysis.valid.length}次有效记录；独立植株n=1。末次−首次：${formatNumber(analysis.difference)} cm；相对变化：${formatNumber(analysis.relative)}%。`,
                  `Selected plant: ${analysis.valid.length} valid readings; independent plant n=1. Last−first: ${formatNumber(analysis.difference)} cm; relative change: ${formatNumber(analysis.relative)}%.`,
                ),
              )}
            </p>
          </>
        )}
      </section>
      <section>
        <h2>
          {text(
            t(
              '2 · 图表、定量核对与引用',
              '2 · Graph, quantitative checks and citations',
            ),
          )}
        </h2>
        <p>
          {text(
            t(
              '宽图表可聚焦后用方向键横向滚动。分类数据不画假时间线；植物连线仅指同株不同日的记录连接，并不证明中间每时刻实测。',
              'Focus the wide graph and use arrow keys to scroll. Categorical records are not a time series; plant lines connect readings of one plant and do not imply continuous measurement.',
            ),
          )}
        </p>
        <div
          className="bio-graduation-scroll bio-graduation-graph"
          tabIndex={0}
          role="region"
          aria-label={
            mode === 'en'
              ? 'Research graph; use arrow keys to scroll horizontally'
              : '研究图表；可用方向键横向滚动'
          }
          dangerouslySetInnerHTML={{ __html: graduationGraphSvg(id, c) }}
        />
        <p>{text(caption)}</p>
        {[0, 1].map((index) => {
          const feedback = calculationFeedback(id, c, index);
          return (
            <div key={index}>
              <label>
                {text(
                  id === 'official'
                    ? index === 0
                      ? t(
                          '定量① 北部幼狼份额17/53，填百分数（不加%）',
                          'Quantitative ① Northern pup share 17/53: enter percent without %',
                        )
                      : t(
                          '定量② 全园幼狼份额17/84，填百分数（不加%）',
                          'Quantitative ② Park-wide pup share 17/84: enter percent without %',
                        )
                    : index === 0
                      ? t(
                          '定量① 所选植株末次−首次高度cm',
                          'Quantitative ① Last minus first height in cm',
                        )
                      : t(
                          '定量② 相对变化百分数；首值0时填NA',
                          'Quantitative ② Relative change percent; enter NA if first height is zero',
                        ),
                )}
                <input
                  value={c.calculations[index]}
                  maxLength={80}
                  onChange={(e) => {
                    const calculations: [string, string] = [...c.calculations];
                    calculations[index] = e.target.value;
                    update({ calculations });
                  }}
                />
              </label>
              {c.calculations[index] && (
                <p role="status">
                  {feedback.correct ? '✓ ' : '↺ '}
                  {feedback.text}
                </p>
              )}
            </div>
          );
        })}
        <fieldset>
          <legend>
            {text(
              t(
                '选择至少两条不同有效记录作为证据',
                'Select at least two distinct valid evidence records',
              ),
            )}
          </legend>
          <p>
            {text(
              t(
                '不同记录不等于不同独立来源或独立重复。改变范围、删数据或改选植株，会清除失效引用。',
                'Distinct records do not mean independent sources or replicates. Changing scope, deleting data or choosing another plant clears invalid citations.',
              ),
            )}
          </p>
          <div className="bio-graduation-citations">
            {validCitationIds(id, c).map((citation) => (
              <label className="bio-graduation-checkbox" key={citation}>
                <input
                  type="checkbox"
                  checked={c.citations.includes(citation)}
                  onChange={(e) =>
                    update({
                      citations: e.target.checked
                        ? [...c.citations, citation]
                        : c.citations.filter((v) => v !== citation),
                    })
                  }
                />
                {citation}
              </label>
            ))}
          </div>
        </fieldset>
      </section>
      <section>
        <h2>
          {text(
            t(
              '3 · 研究报告与英文表达支架',
              '3 · Research report and English expression scaffold',
            ),
          )}
        </h2>
        <p>
          {text(
            t(
              '所有正文可选中文或英文；英文不是生物学进度门槛。英文句型可帮助练习，需自己补实质内容。',
              'Write the report in Chinese or English; English is not a biology progression gate. English starters support practice and need your own substantive content.',
            ),
          )}
        </p>
        {researchFields.map((field) => (
          <div className="bio-graduation-field" key={field}>
            <label>
              {text(researchLabels[field])}
              <textarea
                value={c.text[field]}
                maxLength={graduationTextLimit}
                rows={field === 'question' ? 2 : 3}
                onChange={(e) =>
                  update({ text: { ...c.text, [field]: e.target.value } })
                }
              />
            </label>
            {field in starters && (
              <details>
                <summary>
                  {text(
                    t('英文句型帮助（可选）', 'English starter (optional)'),
                  )}
                </summary>
                <p lang="en">{starters[field as keyof typeof starters]}</p>
                <button
                  type="button"
                  onClick={() => appendStarter(field as keyof typeof starters)}
                >
                  {text(
                    t('加入可选英语练习区', 'Add to optional English practice'),
                  )}
                </button>
                {starterError === field && (
                  <p role="alert">
                    {text(
                      t(
                        `加入句型会超过${graduationTextLimit}字元上限，因此未追加。原文、报告保存状态和其他学习记录均保留；请先自行删减练习区文字。`,
                        `Adding this starter would exceed the ${graduationTextLimit}-character limit, so nothing was appended. Your original text, saved report status and other learning records are retained. Shorten the practice text yourself before adding it.`,
                      ),
                    )}
                  </p>
                )}
              </details>
            )}
          </div>
        ))}
        <h3>
          {text(
            t(
              '按实际数据辅助生成的双语结构化研究摘要',
              'Assisted bilingual structured research abstract from actual data',
            ),
          )}
        </h3>
        <p>
          {text(
            t(
              '这不是自由文字的自动翻译，也不判断你的主张正确与否。问题、方法、数值结果和边界来自当前选择。',
              'This is not a translation of your prose and does not judge your claim. The question, method, numeric result and limits reflect the current selection.',
            ),
          )}
        </p>
        <p lang="zh">{abstract.zh}</p>
        <h4>English scientific abstract</h4>
        <p lang="en">{abstract.en}</p>
      </section>
      <section>
        <h2>
          {text(
            t(
              '4 · 五段3–5分钟口头稿或分镜',
              '4 · Five-part 3–5 minute oral script or storyboard',
            ),
          )}
        </h2>
        <p>
          {text(
            t(
              '每段用自己的话写笔记，任一语言均可。填写整数秒，计划总时长180–300秒；实际速度需排练。若太长，先删重复信息；若太短，补可核查证据和局限。',
              'Write your own notes for every segment in either language. Use whole seconds with a planned total of 180–300 seconds; rehearse your actual pace. If too long, remove repetition; if too short, add checkable evidence and limitations.',
            ),
          )}
        </p>
        {c.speech.map((segment, index) => (
          <fieldset key={index}>
            <legend>
              {index + 1} · {text(speechTitles[index]!)}
            </legend>
            <label>
              {text(
                t('计划秒数（1–300整数）', 'Planned seconds (integer 1–300)'),
              )}
              <input
                type="number"
                min={1}
                max={300}
                step={1}
                value={segment.seconds}
                onChange={(e) => {
                  const seconds = Number(e.target.value);
                  if (
                    !Number.isInteger(seconds) ||
                    seconds < 1 ||
                    seconds > 300
                  )
                    return;
                  update({
                    speech: c.speech.map((s, i) =>
                      i === index ? { ...s, seconds } : s,
                    ),
                  });
                }}
              />
            </label>
            <label>
              {text(
                t(
                  '我的讲解笔记（必填，任一语言）',
                  'My speaking notes (required, either language)',
                ),
              )}
              <textarea
                value={segment.notes}
                maxLength={graduationTextLimit}
                rows={3}
                onChange={(e) =>
                  update({
                    speech: c.speech.map((s, i) =>
                      i === index ? { ...s, notes: e.target.value } : s,
                    ),
                  })
                }
              />
            </label>
            <label>
              {text(t('可选：另一语言', 'Optional: another language'))}
              <textarea
                value={segment.otherLanguage}
                maxLength={graduationTextLimit}
                rows={2}
                onChange={(e) =>
                  update({
                    speech: c.speech.map((s, i) =>
                      i === index ? { ...s, otherLanguage: e.target.value } : s,
                    ),
                  })
                }
              />
            </label>
          </fieldset>
        ))}
        <p>
          {text(
            t(
              `计划总时长 ${speechSeconds(c)}秒；并非自动认证已讲完。`,
              `Planned total ${speechSeconds(c)} seconds; this does not certify that the talk was delivered.`,
            ),
          )}
        </p>
      </section>
      <section>
        <h2>
          {text(
            t(
              '5 · 自核、保存与离线报告',
              '5 · Review, save and offline report',
            ),
          )}
        </h2>
        <p>
          {text(
            t(
              '自动检查只核对结构、计算与图表，不评判文字科学质量。使用手动标准复核，再保存此题材。综合理解检查另行记录。',
              'Automatic checks assess structure, calculations and graphs, not the scientific quality of your prose. Apply the manual criteria before saving this case. The comprehension check is recorded separately.',
            ),
          )}
        </p>
        {manualRubric.map((r, index) => (
          <label className="bio-graduation-checkbox" key={index}>
            <input
              type="checkbox"
              checked={c.rubric[index]}
              onChange={(e) =>
                update({
                  rubric: c.rubric.map((v, i) =>
                    i === index ? e.target.checked : v,
                  ),
                })
              }
            />
            {text(r)}
          </label>
        ))}
        <div className="bio-graduation-actions">
          <button
            type="button"
            onClick={() => {
              setShowProblems(true);
              store.update((p) =>
                withGraduationProject(
                  p,
                  saveGraduationCase(
                    p.projects.S06 ?? emptyGraduationProject(),
                    id,
                  ),
                ),
              );
            }}
          >
            {text(
              t('保存此题材为完整报告', 'Save this case as a complete report'),
            )}
          </button>
          <a
            className="bio-button"
            download={`S06-${id}-research.html`}
            href={graduationReportDataUrl(d, id)}
          >
            {text(
              t(
                '下载完整离线HTML（含草稿状态）',
                'Download full offline HTML (includes draft status)',
              ),
            )}
          </a>
        </div>
        {showProblems && (
          <div role="status">
            {problems.length ? (
              <ul>
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            ) : (
              <p>
                {text(
                  t(
                    '结构与计算检查通过，此题材已保存。请继续人工检查论证。',
                    'Structure and calculation checks passed; this case is saved. Continue reviewing the reasoning manually.',
                  ),
                )}
              </p>
            )}
          </div>
        )}
      </section>
      <section>
        <h2>
          {text(
            t(
              '6 · 跨六单元综合理解检查（可订正）',
              '6 · Understanding across six units (revise freely)',
            ),
          )}
        </h2>
        <p>
          {text(
            t(
              `已答${check.answered}/6，正确${check.correct}/6；六题全答且至少5题正确。报告保存不要求先答对这些题。`,
              `Answered ${check.answered}/6, correct ${check.correct}/6; answer all six with at least five correct. Saving a report is separate from this check.`,
            ),
          )}
        </p>
        {graduationQuestions.map((question, index) => (
          <CheckCard
            key={question.id}
            question={question}
            relatedLesson={graduationQuestionLessons[index]!}
            answer={d.answers[question.id]}
            mode={mode}
            save={(choice) =>
              store.update((p) => {
                const current = p.projects.S06 ?? emptyGraduationProject();
                return withGraduationProject(p, {
                  ...current,
                  answers: { ...current.answers, [question.id]: choice },
                });
              })
            }
          />
        ))}
      </section>
      <p className="bio-inquiry-result" role="status">
        {text(
          outcome.complete
            ? t(
                '✓ S06阶段探索完成：自己的24课、6任务、至少一份完整已保存研究与综合理解检查。',
                '✓ S06 explored: your 24 lessons, six missions, at least one complete saved investigation and the comprehension check.',
              )
            : t(
                `S06：${outcome.lessons}/24课，${outcome.missions}/6任务；至少一个完整保存题材，六题全答且≥5/6。课程制作完成不等于学生毕业。`,
                `S06: ${outcome.lessons}/24 lessons, ${outcome.missions}/6 missions; at least one complete saved case and all six checks answered with ≥5/6. Authored lessons do not count as learner completion.`,
              ),
        )}
      </p>
      <Link to="/biology#U31">
        {text(t('返回S06课程 →', 'Return to S06 lessons →'))}
      </Link>
    </div>
  );
}
