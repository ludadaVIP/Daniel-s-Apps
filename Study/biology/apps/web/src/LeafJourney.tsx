import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import { CheckCard } from './StageCheck';
import { leafStageOutcome, withLeafProject, type Store } from './progress';
import {
  emptyLeafProject,
  leafRouteIds,
  leafRoutes,
  routeTags,
  leafTextReady,
  leafLabelCheck,
  leafUnderstanding,
  leafStageQuestions,
  leafQuestionLessons,
  type LeafDraft,
  type LeafRoute,
  type RouteTag,
} from './leafProject';
import { leafDiagramSvg } from './leafDiagram';
const word = (mode: LanguageMode, text: ReturnType<typeof t>) =>
  mode === 'en' ? text.en : text.zh;
export function LeafProject({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const draft = store.progress.projects.S02 ?? emptyLeafProject(),
    [panel, setPanel] = useState<'map' | 'check'>('map'),
    [route, setRoute] = useState<LeafRoute>('water'),
    [reviewed, setReviewed] = useState(false),
    [download, setDownload] = useState('');
  const flow = useFrames(4, () => {}),
    row = draft.routes[route],
    info = leafRoutes[route],
    status = leafStageOutcome(store.progress),
    check = leafUnderstanding(draft),
    labels = leafLabelCheck(draft);
  function update(patch: Partial<LeafDraft>) {
    store.update((p) => withLeafProject(p, patch));
  }
  function edit(patch: Partial<LeafDraft>) {
    update({ ...patch, savedAt: undefined });
    setReviewed(false);
    setDownload('');
  }
  function editRoute(patch: Partial<LeafDraft['routes'][LeafRoute]>) {
    edit({ routes: { ...draft.routes, [route]: { ...row, ...patch } } });
  }
  function exportDiagram() {
    const blob = new Blob([leafDiagramSvg(draft, undefined, 4, true)], {
        type: 'image/svg+xml;charset=utf-8',
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'Study-S02-leaf-journey.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownload(
      word(
        mode,
        t(
          '图解已生成，查看浏览器下载。',
          'Diagram generated; check browser downloads.',
        ),
      ),
    );
  }
  return (
    <>
      <span className="bio-eyebrow">
        S02 / <Text mode={mode} text={t('阶段作品', 'STAGE PROJECT')} />
      </span>
      <h1>
        <Text mode={mode} text={t('一片叶子的旅程', 'A leaf’s journey')} />
      </h1>
      <p className="bio-project-intro">
        <Text
          mode={mode}
          text={t(
            '窗台上的叶子，把土壤和空气变成一段合作。为四条路线加标签、各写一句自己的解释，再用中英文讲清物质与能量的区别。屏幕图解即可完成，也可以画在纸上后用这里记录解释。',
            'A windowsill leaf connects soil and air through cooperation. Label four routes, explain each in your own words, then compare matter and energy in Chinese and English. Use this diagram or make a paper drawing and record its explanations here.',
          )}
        />
      </p>
      <div className="bio-choice-row bio-leaf-choices">
        <button
          aria-pressed={panel === 'map'}
          onClick={() => {
            setPanel('map');
            flow.reset();
          }}
        >
          <Text mode={mode} text={t('我的双语图解', 'My bilingual diagram')} />
        </button>
        <button
          aria-pressed={panel === 'check'}
          onClick={() => {
            setPanel('check');
            flow.reset();
          }}
        >
          <Text mode={mode} text={t('综合理解检查', 'Understanding check')} />
        </button>
      </div>
      {panel === 'map' ? (
        <>
          <div
            className="bio-choice-row bio-leaf-choices bio-leaf-routes"
            role="group"
            aria-label={word(mode, t('选择路线', 'Select a route'))}
          >
            {leafRouteIds.map((id) => (
              <button
                key={id}
                aria-pressed={route === id}
                onClick={() => {
                  setRoute(id);
                  flow.reset();
                }}
              >
                <Text mode={mode} text={leafRoutes[id].name} />
                {draft.routes[id].tag !== 'unmarked' &&
                draft.routes[id].note.trim() ? (
                  <>
                    {' '}
                    <span aria-label={word(mode, t('已填写', 'Filled in'))}>
                      {' '}
                      ✓
                    </span>
                  </>
                ) : null}
              </button>
            ))}
          </div>
          <section className="bio-leaf-workbench">
            <div className="bio-leaf-visual">
              <div
                className="bio-leaf-svg"
                dangerouslySetInnerHTML={{
                  __html: leafDiagramSvg(draft, route, flow.frame),
                }}
              />
              <Playback flow={flow} mode={mode} />
              <p className="bio-caption" aria-live="polite">
                <Text mode={mode} text={info.steps[flow.frame]!} />
              </p>
              <details className="bio-static">
                <summary>
                  <Text
                    mode={mode}
                    text={t('图解怎么读？', 'How to read this diagram')}
                  />
                </summary>
                <p>
                  <Text
                    mode={mode}
                    text={t(
                      '四框永远保留中英名称；框下分类是你选的标签。彩色圆点只按顺序讲机制，不是测量单个真实分子。图固定成熟绿叶为源、生长根为库；水蒸气另画支路。光合作用产生的O₂、矿质营养、其他糖库与完整细胞细节未画出，箭头不表示速率或数量。',
                      'Four boxes retain Chinese and English names; their categories are your choices. A coloured dot orders the explanation rather than measures a real molecule. A mature green leaf is the source and growing root the sink, with a vapour branch. Photosynthetic O₂, minerals, other sinks and full cellular details are omitted; arrows give no rates or counts.',
                    )}
                  />
                </p>
              </details>
            </div>
            <div className="bio-project-writing bio-leaf-editor">
              <span className="bio-eyebrow">
                <Text mode={mode} text={t('我的路线卡', 'MY ROUTE CARD')} />
              </span>
              <h2>
                <Text mode={mode} text={info.name} />
              </h2>
              <p>
                <Text mode={mode} text={info.prompt} />
              </p>
              <fieldset className="bio-leaf-tags">
                <legend>
                  <Text
                    mode={mode}
                    text={t(
                      '这条路线表示什么？',
                      'What does this route represent?',
                    )}
                  />
                </legend>
                <div className="bio-choice-row bio-leaf-choices">
                  {(['matter', 'energy', 'both'] as const).map(
                    (tag: RouteTag) => (
                      <button
                        key={tag}
                        aria-pressed={row.tag === tag}
                        onClick={() => editRoute({ tag })}
                      >
                        <Text mode={mode} text={routeTags[tag]} />
                      </button>
                    ),
                  )}
                </div>
              </fieldset>
              <label>
                <Text
                  mode={mode}
                  text={t(
                    '我的解释：来源→边界→去向',
                    'My explanation: source → boundary → destination',
                  )}
                />
                <textarea
                  value={row.note}
                  maxLength={600}
                  rows={4}
                  onChange={(e) => editRoute({ note: e.target.value })}
                />
              </label>
              <details className="bio-static">
                <summary>
                  <Text
                    mode={mode}
                    text={t('需要一点起步线索', 'A clue to get started')}
                  />
                </summary>
                <p>
                  <Text mode={mode} text={info.example} />
                </p>
              </details>
              <Link to={`/biology/lesson/${info.lesson}`}>
                <Text
                  mode={mode}
                  text={t('回看这条路线的课程 ↗', 'Revisit the route lesson ↗')}
                />
              </Link>
            </div>
          </section>
          <section className="bio-project-writing bio-leaf-summary">
            <h2>
              <Text
                mode={mode}
                text={t('让四条路线成为一个解释', 'Connect the four routes')}
              />
            </h2>
            <p>
              <Text
                mode={mode}
                text={t(
                  '想象根和叶的一次合作：谁送物质？谁提供能量？糖为什么能同时担任两种角色？简单英文就很好；不自动判断语法。',
                  'Imagine root–leaf cooperation: what supplies matter, what supplies energy, and why does sugar have both roles? Simple English is welcome; grammar is not automatically graded.',
                )}
              />
            </p>
            <label>
              <Text
                mode={mode}
                text={t(
                  '中文总结（自己的解释）',
                  'Chinese summary (your explanation)',
                )}
              />
              <textarea
                lang="zh"
                rows={3}
                maxLength={1000}
                value={draft.zh}
                onChange={(e) => edit({ zh: e.target.value })}
              />
            </label>
            <label>
              <Text
                mode={mode}
                text={t(
                  '英文总结（简单句即可）',
                  'English summary (simple sentences are enough)',
                )}
              />
              <textarea
                lang="en"
                rows={3}
                maxLength={1000}
                value={draft.en}
                onChange={(e) => edit({ en: e.target.value })}
              />
            </label>
            <div className="bio-leaf-actions">
              <button
                className="bio-button"
                disabled={!leafTextReady(draft)}
                onClick={() => {
                  update({ savedAt: Date.now() });
                  setReviewed(true);
                }}
              >
                <Text
                  mode={mode}
                  text={t(
                    '保存图解，核对标签 ✓',
                    'Save diagram & check labels ✓',
                  )}
                />
              </button>
              <button
                className="bio-button bio-secondary"
                disabled={!draft.savedAt || !leafTextReady(draft)}
                onClick={exportDiagram}
              >
                <Text
                  mode={mode}
                  text={t(
                    '下载双语图解 SVG ↓',
                    'Download bilingual diagram SVG ↓',
                  )}
                />
              </button>
            </div>
            <p role="status">
              <Text
                mode={mode}
                text={
                  draft.savedAt
                    ? t(
                        '✓ 图解已保存。文字解释请自己或和家人一起核对。',
                        '✓ Diagram saved. Review written explanations yourself or with family.',
                      )
                    : t(
                        '输入会保存为草稿。填好四条路线的标签与解释、两段总结，再保存图解。',
                        'Typing saves a draft. Fill all four route labels/explanations and both summaries, then save the diagram.',
                      )
                }
              />
            </p>
            {download && <p role="status">{download}</p>}
            {(reviewed || draft.savedAt) && (
              <div className="bio-leaf-feedback" role="status">
                <strong>
                  <Text
                    mode={mode}
                    text={t(
                      `标签核对 ${labels}/4`,
                      `Labels checked ${labels}/4`,
                    )}
                  />
                </strong>
                {leafRouteIds
                  .filter((id) => draft.routes[id].tag !== leafRoutes[id].tag)
                  .map((id) => (
                    <p key={id}>
                      <Text mode={mode} text={leafRoutes[id].name} /> —{' '}
                      <Text mode={mode} text={leafRoutes[id].feedback} />
                    </p>
                  ))}
                <p>
                  <Text
                    mode={mode}
                    text={t(
                      '核对只比较标签，不证明文字解释正确，也不清空作品。',
                      'This compares labels only; it does not prove your writing correct or erase the work.',
                    )}
                  />
                </p>
              </div>
            )}
          </section>
          <details className="bio-leaf-overview bio-static">
            <summary>
              <Text
                mode={mode}
                text={t(
                  '查看四张已写路线卡',
                  'View all four written route cards',
                )}
              />
            </summary>
            {leafRouteIds.map((id) => (
              <article key={id}>
                <h3>
                  <Text mode={mode} text={leafRoutes[id].name} />
                </h3>
                <p>
                  <Text mode={mode} text={routeTags[draft.routes[id].tag]} />
                </p>
                <p>
                  {draft.routes[id].note ||
                    word(
                      mode,
                      t('这条还待解释。', 'This route needs an explanation.'),
                    )}
                </p>
              </article>
            ))}
          </details>
        </>
      ) : (
        <LeafUnderstanding draft={draft} update={update} mode={mode} />
      )}
      <section className="bio-project-status" aria-live="polite">
        <h3>
          <Text
            mode={mode}
            text={
              status.complete
                ? t('✓ 第二阶段探索已完成', '✓ Second stage explored')
                : t('第二阶段的探索进度', 'Second-stage exploration progress')
            }
          />
        </h3>
        <p>
          <Text
            mode={mode}
            text={t(
              `课程${status.lessons}/24 · 单元任务${status.missions}/6 · 综合检查${check.correct}/5`,
              `Lessons ${status.lessons}/24 · unit missions ${status.missions}/6 · understanding check ${check.correct}/5`,
            )}
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              '阶段探索需要S02的24课、6个单元任务、已保存且四个标签正确的作品，以及答完综合题并至少4/5。可以随时写草稿或订正；中文与英文表述由自己或家人核对。',
              'Stage exploration needs S02’s 24 lessons, six missions, a saved project with all four labels correct, and all five check answers with at least 4/5 correct. Draft and revise anytime; review Chinese and English explanations yourself or with family.',
            )}
          />
        </p>
        <Link to="/biology/notebook?unit=U12">
          <Text
            mode={mode}
            text={t('回到U12检索表任务 →', 'Return to the U12 key mission →')}
          />
        </Link>
      </section>
      <details className="bio-source-note">
        <summary>
          <Text
            mode={mode}
            text={t(
              '课程依据与图示来源',
              'Content references & illustration sources',
            )}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '原创图与题目；科学机制参考下列章节。未使用外部图片或实测数据。',
              'Original diagram and questions; mechanisms are checked against the chapters below. No external images or measured data are used.',
            )}
          />
        </p>
        <a
          href="https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis"
          target="_blank"
          rel="noreferrer"
        >
          OpenStax — Photosynthesis
        </a>
        <br />
        <a
          href="https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants"
          target="_blank"
          rel="noreferrer"
        >
          OpenStax — Plant transport
        </a>
      </details>
    </>
  );
}
function LeafUnderstanding({
  draft,
  update,
  mode,
}: {
  draft: LeafDraft;
  update: (patch: Partial<LeafDraft>) => void;
  mode: LanguageMode;
}) {
  const [index, setIndex] = useState(0),
    question = leafStageQuestions[index]!;
  return (
    <section className="bio-project-writing bio-leaf-check">
      <p>
        <Text
          mode={mode}
          text={t(
            '五个问题，把细胞、叶片、根与身体联系起来。可以回看课程和订正；检查不代替对作品文字的审阅。',
            'Five questions connect cells, leaves, roots and bodies. Revisit lessons and revise; the check does not review your written project.',
          )}
        />
      </p>
      <div
        className="bio-choice-row bio-leaf-choices"
        role="group"
        aria-label={word(mode, t('选择综合题', 'Select a check question'))}
      >
        {leafStageQuestions.map((q, i) => (
          <button
            key={q.id}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {i + 1}
            {draft.answers[q.id] === q.correct ? ' ✓' : ''}
          </button>
        ))}
      </div>
      <CheckCard
        key={question.id}
        question={question}
        relatedLesson={leafQuestionLessons[index]!}
        mode={mode}
        answer={draft.answers[question.id]}
        save={(value) =>
          update({ answers: { ...draft.answers, [question.id]: value } })
        }
      />
      {index < 4 && (
        <button className="bio-button" onClick={() => setIndex(index + 1)}>
          <Text mode={mode} text={t('下一题 →', 'Next question →')} />
        </button>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '4/5是初始理解参考线；未达到时按反馈重走路线，作品仍然保留。',
            '4/5 is an initial understanding reference. Revisit routes using feedback when needed; your work remains available.',
          )}
        />
      </p>
    </section>
  );
}
