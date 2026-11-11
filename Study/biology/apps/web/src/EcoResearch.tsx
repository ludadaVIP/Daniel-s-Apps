import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { CheckCard } from './StageCheck';
import { ecoStageOutcome, withEcoProject, type Store } from './progress';
import {
  emptyEcoProject,
  ecoEstimateCheck,
  ecoTextReady,
  ecoUnderstanding,
  ecoStageQuestions,
  ecoQuestionLessons,
  type EcoDraft,
} from './ecoProject';
import {
  meadowGrid,
  meadowArea,
  meadowCensus,
  pathSample,
  estimateMeadow,
  randomQuadrats,
} from './populationModel';
import { ecoReport } from './ecoReport';

const fields = [
  [
    'claim',
    t(
      '我的主张：哪一种抽样方案更适合估计全场，为什么？',
      'Claim: which sampling plan better estimates the whole field, and why?',
    ),
  ],
  [
    'evidenceOne',
    t(
      '证据一：引用自己的样方编号、计数、面积与估计。',
      'Evidence 1: cite your quadrat IDs, count, sampled area and estimate.',
    ),
  ],
  [
    'evidenceTwo',
    t(
      '证据二：引用路边方案的数字，并与自己的结果比较。',
      'Evidence 2: cite roadside numbers and compare them with your result.',
    ),
  ],
  [
    'reasoning',
    t(
      '推理：位置分布怎样影响代表性？提出一个可能机制或替代解释，区分它与直接观察。',
      'Reasoning: how does location affect representation? Offer a mechanism or alternative explanation and distinguish it from observation.',
    ),
  ],
  [
    'missingData',
    t(
      '还需什么数据？写明要测的变量、重复或对照，而不只说“更多数据”。',
      'What further data are needed? Name a variable, repeat or comparison rather than only saying “more data”.',
    ),
  ],
  [
    'zh',
    t(
      '中文研究摘要：问题、主要发现和一条局限。',
      'Chinese abstract: question, main finding and one limitation.',
    ),
  ],
  [
    'en',
    t(
      'English summary：用英语写出发现与不确定性。',
      'English summary: state a finding and uncertainty in English.',
    ),
  ],
] as const;

export function EcoResearch({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const draft = store.progress.projects.S03 ?? emptyEcoProject();
  const [panel, setPanel] = useState<'research' | 'check'>('research');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [census, setCensus] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [download, setDownload] = useState(false);
  const sample = draft.sampleIds.length
    ? estimateMeadow(draft.sampleIds)
    : undefined;
  const roadside = estimateMeadow(pathSample);
  const check = ecoUnderstanding(draft);
  const status = ecoStageOutcome(store.progress);
  const question = ecoStageQuestions[questionIndex]!;
  function update(patch: Partial<EcoDraft>, edit = true) {
    store.update((p) =>
      withEcoProject(p, edit ? { ...patch, savedAt: undefined } : patch),
    );
    if (edit) {
      setReviewed(false);
      setDownload(false);
    }
  }
  function draw(seed: number, count = draft.sampleIds.length === 12 ? 12 : 6) {
    update({
      method: 'random',
      seed,
      sampleIds: randomQuadrats(seed, count),
      estimate: '',
    });
  }
  function exportReport() {
    const blob = new Blob([ecoReport(draft)], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download = 'Study-S03-ecology-report.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownload(true);
  }
  return (
    <>
      <span className="bio-eyebrow">
        S03 / <Text mode={mode} text={t('阶段作品', 'STAGE PROJECT')} />
      </span>
      <h1>
        <Text
          mode={mode}
          text={t(
            '假如我是一名生态研究员',
            'If I were an ecological researcher',
          )}
        />
      </h1>
      <p className="bio-project-intro">
        <Text
          mode={mode}
          text={t(
            '同一块草地，为什么路边样方和随机样方会讲出不同的故事？先检查原始数据、自己计算，再用两组证据写一份有局限的双语报告。',
            'Why can roadside and random quadrats tell different stories about one meadow? Inspect raw records, calculate an estimate, then write a bilingual report using two sets of evidence and a clear limitation.',
          )}
        />
      </p>
      <p className="bio-inquiry-result">
        <Text
          mode={mode}
          text={t(
            '原创虚拟本地草地，不是真实新西兰野外测量。36格各1m²；只数同一虚构植物物种、同一时期的可区分个体。全部调查可在屏幕内完成。',
            'An original virtual local meadow, not measured New Zealand field data. Each of 36 cells is 1 m²; counts refer to distinct individuals of one fictional plant species at one time. No collecting or culturing is needed.',
          )}
        />
      </p>
      <div className="bio-choice-row bio-eco-tabs">
        <button
          aria-pressed={panel === 'research'}
          onClick={() => setPanel('research')}
        >
          <Text
            mode={mode}
            text={t('调查与研究报告', 'Investigation and report')}
          />
        </button>
        <button
          aria-pressed={panel === 'check'}
          onClick={() => setPanel('check')}
        >
          <Text mode={mode} text={t('综合理解检查', 'Understanding check')} />
        </button>
      </div>
      {panel === 'research' ? (
        <>
          <section className="bio-eco-workbench">
            <div className="bio-eco-sampling">
              <h2>
                <Text
                  mode={mode}
                  text={t(
                    '① 先定位置，再看数量',
                    '1. Choose positions before counts',
                  )}
                />
              </h2>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '随机方案先从所有位置不放回抽取。手选可用来研究选择偏差，但不能把它称作随机。路边方案固定为最上面六格。',
                    'The random plan draws without replacement from all locations. Chosen cells can explore selection bias, but are not a random sample. The roadside comparison always uses the top six cells.',
                  )}
                />
              </p>
              <div className="bio-choice-row bio-eco-controls">
                <button
                  aria-pressed={draft.method === 'random'}
                  onClick={() => draw(draft.seed)}
                >
                  <Text
                    mode={mode}
                    text={t('按随机方案抽取', 'Draw a random sample')}
                  />
                </button>
                <button
                  aria-pressed={draft.method === 'chosen'}
                  onClick={() => update({ method: 'chosen' })}
                >
                  <Text
                    mode={mode}
                    text={t('手选位置作比较', 'Choose cells for comparison')}
                  />
                </button>
                <button onClick={() => draw((draft.seed + 1) % 10000)}>
                  <Text
                    mode={mode}
                    text={t('换一组随机位置', 'Draw another random set')}
                  />
                </button>
                <button
                  onClick={() =>
                    draw(draft.seed, draft.sampleIds.length === 12 ? 6 : 12)
                  }
                >
                  <Text
                    mode={mode}
                    text={
                      draft.sampleIds.length === 12
                        ? t('改抽6格', 'Draw 6 cells')
                        : t('改抽12格', 'Draw 12 cells')
                    }
                  />
                </button>
                {draft.method === 'chosen' && (
                  <button
                    onClick={() => update({ sampleIds: [], estimate: '' })}
                  >
                    <Text
                      mode={mode}
                      text={t('清空手选', 'Clear chosen cells')}
                    />
                  </button>
                )}
              </div>
              <p className="bio-muted">
                <Text
                  mode={mode}
                  text={t(
                    `当前：${draft.method === 'random' ? '可重复随机方案' : '手选方案'}；${draft.sampleIds.length}格；随机编号${draft.seed}。手选至少6格、最多12格；重复同一组位置不算独立重复。`,
                    `Current plan: ${draft.method === 'random' ? 'reproducible random draw' : 'chosen cells'}; ${draft.sampleIds.length} cells; seed ${draft.seed}. Choose 6–12 cells; repeating the same positions is not an independent sample.`,
                  )}
                />
              </p>
              <div
                className="bio-eco-grid"
                role="group"
                aria-label={
                  mode === 'en' ? 'Virtual meadow quadrats' : '虚拟草地样方'
                }
              >
                {meadowGrid.map((cell) => {
                  const selected = draft.sampleIds.includes(cell.id);
                  return (
                    <button
                      key={cell.id}
                      type="button"
                      disabled={draft.method !== 'chosen'}
                      aria-pressed={selected}
                      aria-label={`${cell.id}, ${selected || census ? cell.count : '?'} ${mode === 'en' ? 'plants' : '株'}`}
                      onClick={() => {
                        const ids = selected
                          ? draft.sampleIds.filter((id) => id !== cell.id)
                          : draft.sampleIds.length < 12
                            ? [...draft.sampleIds, cell.id]
                            : draft.sampleIds;
                        update({ sampleIds: ids, estimate: '' });
                      }}
                    >
                      <strong>{cell.id}</strong>
                      <span>{selected || census ? cell.count : '·'}</span>
                    </button>
                  );
                })}
              </div>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '选中格显示计数；每格均为1m²。圆点表示此时未展示，不等于0株。图只表示这一个虚拟地点，没有推算地理分布。',
                    'Selected cells show counts; each is 1 m². A dot means not yet shown, not zero plants. The grid represents only this fictional location, not a geographic range.',
                  )}
                />
              </p>
              <button
                className="bio-text-button"
                aria-expanded={census}
                onClick={() => setCensus(!census)}
              >
                <Text
                  mode={mode}
                  text={
                    census
                      ? t('隐藏教学普查', 'Hide teaching census')
                      : t(
                          '揭示教学普查作核对',
                          'Reveal teaching census for checking',
                        )
                  }
                />
              </button>
              {census && (
                <p className="bio-inquiry-result">
                  <Text
                    mode={mode}
                    text={t(
                      `普查为${meadowCensus}株。真实调查往往不知道总数；这里揭示它是为了比较误差，不是让随机抽样每次都猜中。`,
                      `The census is ${meadowCensus} plants. Real studies often lack a known total. It is revealed here to compare errors, not to require every random draw to match.`,
                    )}
                  />
                </p>
              )}
            </div>
            <div className="bio-eco-records">
              <h2>
                <Text
                  mode={mode}
                  text={t(
                    '② 用原始记录算一次',
                    '2. Calculate from raw records',
                  )}
                />
              </h2>
              <div className="bio-eco-table">
                <table>
                  <caption>
                    <Text
                      mode={mode}
                      text={t('我的样本；每格1m²', 'My sample; each cell 1 m²')}
                    />
                  </caption>
                  <thead>
                    <tr>
                      <th>
                        <Text mode={mode} text={t('样方', 'Quadrat')} />
                      </th>
                      <th>
                        <Text mode={mode} text={t('株数', 'Plants')} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sample?.records.map((cell) => (
                      <tr key={cell.id}>
                        <td>{cell.id}</td>
                        <td>{cell.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `总数${sample?.count ?? 0}株 ÷ 抽样面积${sample?.sampledArea ?? 0}m² = ${sample?.density.toFixed(3) ?? '—'}株/m²。估计全场数量 = 样本密度 × ${meadowArea}m²。`,
                    `${sample?.count ?? 0} plants ÷ ${sample?.sampledArea ?? 0} m² sampled = ${sample?.density.toFixed(3) ?? '—'} plants/m². Estimated field total = sample density × ${meadowArea} m².`,
                  )}
                />
              </p>
              <label>
                <Text
                  mode={mode}
                  text={t(
                    '我的全场估计（株；可四舍五入到整数）',
                    'My estimated field total (plants; nearest whole plant is accepted)',
                  )}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  maxLength={30}
                  value={draft.estimate}
                  onChange={(event) => update({ estimate: event.target.value })}
                />
              </label>
              <button
                className="bio-button"
                disabled={!sample || !draft.estimate.trim()}
                onClick={() => setReviewed(true)}
              >
                <Text mode={mode} text={t('核对计算', 'Check calculation')} />
              </button>
              {reviewed && (
                <p className="bio-inquiry-result" role="status">
                  <Text
                    mode={mode}
                    text={
                      ecoEstimateCheck(draft)
                        ? t(
                            '计算相符。它仍是估计；还要判断样本的代表性。',
                            'The calculation matches. It remains an estimate; assess how representative the sample is.',
                          )
                        : t(
                            `再检查分母：用${sample?.sampledArea ?? 0}m²抽样面积求密度，再乘36m²。模型估计为${sample?.estimate.toFixed(2) ?? '—'}株。`,
                            `Check the denominator: use ${sample?.sampledArea ?? 0} m² of sampled area, then multiply by 36 m². The model estimate is ${sample?.estimate.toFixed(2) ?? '—'} plants.`,
                          )
                    }
                  />
                </p>
              )}
              <h3>
                <Text
                  mode={mode}
                  text={t('路边方案对照', 'Roadside comparison')}
                />
              </h3>
              <p>
                {roadside.records
                  .map((cell) => `${cell.id}: ${cell.count}`)
                  .join(' · ')}
              </p>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '4株 ÷ 6m² × 36m² = 24株。它计算正确，却在这块虚拟草地上偏低。专挑密集格也会产生方向相反的选择偏差。',
                    '4 plants ÷ 6 m² × 36 m² = 24 plants. The arithmetic is correct but the estimate is low in this meadow. Choosing dense cells can bias in the opposite direction.',
                  )}
                />
              </p>
              <details className="bio-static">
                <summary>
                  <Text
                    mode={mode}
                    text={t(
                      '怎样解释估计的局限？',
                      'How should an estimate’s limits be explained?',
                    )}
                  />
                </summary>
                <p>
                  <Text
                    mode={mode}
                    text={t(
                      '估计依赖位置选择、样方大小和计数规则。随机抽样减少主观选择偏差，但一次随机样本也会波动；更多样本不保证每一次更接近普查。位置与数量的关系不能单独证明光照、降雨或遗传造成了分布。可提出机制，再设计变量记录或对照去检验。',
                      'Estimation depends on position choice, quadrat size and counting rules. Random sampling reduces subjective selection, but individual samples vary; larger samples need not improve every draw. Position and abundance alone cannot prove effects of light, rain or inheritance. Propose a mechanism, then identify measurements or comparisons that could test it.',
                    )}
                  />
                </p>
              </details>
            </div>
          </section>
          <section className="bio-project-writing bio-eco-writing">
            <h2>
              <Text
                mode={mode}
                text={t(
                  '③ 写出有证据、有边界的解释',
                  '3. Explain with evidence and limits',
                )}
              />
            </h2>
            {fields.map(([key, label]) => (
              <label key={key}>
                <Text mode={mode} text={label} />
                <textarea
                  maxLength={1500}
                  value={draft[key]}
                  onChange={(event) => update({ [key]: event.target.value })}
                />
              </label>
            ))}
            <p>
              <Text
                mode={mode}
                text={t(
                  '填写检查只确认报告结构和计算；系统不自动判定自由文字、科学推理或英语正确。请用原始数字核对，再请家人或老师阅读。',
                  'Checks confirm report structure and arithmetic only. Free writing, scientific reasoning and English are not automatically graded. Check against raw numbers and ask a family member or teacher to read it.',
                )}
              />
            </p>
            <div className="bio-leaf-actions">
              <button
                className="bio-button"
                disabled={!ecoTextReady(draft) || !ecoEstimateCheck(draft)}
                onClick={() => update({ savedAt: Date.now() }, false)}
              >
                <Text
                  mode={mode}
                  text={t('保存研究作品', 'Save research project')}
                />
              </button>
              <button className="bio-text-button" onClick={exportReport}>
                <Text
                  mode={mode}
                  text={t('下载完整双语报告', 'Download full bilingual report')}
                />
              </button>
            </div>
            {draft.savedAt && (
              <p role="status">
                <Text
                  mode={mode}
                  text={t(
                    '作品已保存；修改样本、计算或文字后需重新保存。',
                    'Project saved. Save again after changing samples, calculations or writing.',
                  )}
                />
              </p>
            )}
            {download && (
              <p role="status">
                <Text
                  mode={mode}
                  text={t(
                    '已生成纯文本报告，保留全部原始记录和你的文字。',
                    'A plain-text report was generated with all raw records and your writing.',
                  )}
                />
              </p>
            )}
            {!ecoTextReady(draft) && (
              <p className="bio-muted">
                <Text
                  mode={mode}
                  text={t(
                    '保存需要6–12格，并填写两条证据、推理、补充数据和双语摘要。若与路边方案选同一组位置，应说明这不是独立比较。',
                    'Saving needs 6–12 cells, two evidence references, reasoning, further data and both summaries. If positions match the roadside set, explain that this is not an independent comparison.',
                  )}
                />
              </p>
            )}
          </section>
        </>
      ) : (
        <section className="bio-stage-check">
          <p>
            <Text
              mode={mode}
              text={t(
                '五题连接微生物、繁殖、信息、稳态与生态证据。可回看和订正，不给自由文字或英语拼写打分。',
                'Five questions connect microbes, reproduction, information, homeostasis and ecological evidence. Revisit and revise; free writing and English spelling are not scored.',
              )}
            />
          </p>
          <div className="bio-choice-row bio-eco-tabs">
            {ecoStageQuestions.map((q, index) => (
              <button
                key={q.id}
                aria-pressed={questionIndex === index}
                onClick={() => setQuestionIndex(index)}
              >
                {index + 1}
                {draft.answers[q.id] !== undefined ? ' ✓' : ''}
              </button>
            ))}
          </div>
          <CheckCard
            key={question.id}
            question={question}
            relatedLesson={ecoQuestionLessons[questionIndex]!}
            answer={draft.answers[question.id]}
            save={(value) =>
              update(
                { answers: { ...draft.answers, [question.id]: value } },
                false,
              )
            }
            mode={mode}
          />
        </section>
      )}
      <section className="bio-inquiry-result bio-eco-stage-status">
        <h2>
          <Text
            mode={mode}
            text={
              status.complete
                ? t('S03阶段探索已完成', 'S03 exploration complete')
                : t('S03阶段探索进行中', 'S03 exploration in progress')
            }
          />
        </h2>
        <p>
          <Text
            mode={mode}
            text={t(
              `本阶段课程${status.lessons}/24；单元任务${status.missions}/6；研究作品${draft.savedAt ? '已保存' : '待保存'}；综合题${check.answered}/5已答、${check.correct}/5正确。完成需要本阶段全套课程与任务、有效保存作品，以及五题都答且至少4题正确。`,
              `This stage: ${status.lessons}/24 lessons; ${status.missions}/6 missions; project ${draft.savedAt ? 'saved' : 'not saved'}; ${check.answered}/5 questions answered, ${check.correct}/5 correct. Completion needs this stage’s lessons and missions, a valid saved project, and all five answered with at least four correct.`,
            )}
          />
        </p>
      </section>
      <Link className="bio-back" to="/biology">
        <Text
          mode={mode}
          text={t('← 回到探索地图', '← Back to the exploration map')}
        />
      </Link>
    </>
  );
}
