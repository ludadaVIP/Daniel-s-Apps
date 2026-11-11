import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { CheckCard } from './StageCheck';
import { storyStageOutcome, withStoryProject, type Store } from './progress';
import {
  emptyStoryProject,
  editStoryCase,
  frameNames,
  storyTopics,
  storyNames,
  storyEvidence,
  storyModelValue,
  storyCaseReady,
  storyStageQuestions,
  storyQuestionLessons,
  storyUnderstanding,
  type StoryCase,
} from './storyProject';
import { storyNotes, storySceneSvg, storySvg } from './storySvg';

const dataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const labels = {
  observation: t(
    '实际记录是什么？引用数值、时间与单位；模型输出请明确标记。',
    'What was recorded? Cite values, times and units; clearly mark model outputs.',
  ),
  assumptions: t(
    '哪些是模型设定而非观测？哪些因素还没有测？',
    'Which are model assumptions rather than observations? What was not measured?',
  ),
  chain: t(
    '用“因为…所以…”连起微观机制与现象，并说出限制。',
    'Connect mechanism to phenomenon with because/therefore, including a limit.',
  ),
  variable: t(
    '检验时，只主动改变什么变量？',
    'What variable will you deliberately change?',
  ),
  measured: t(
    '测什么结果？单位、时间窗口与方法？',
    'What outcome will you measure? Give units, time window and method.',
  ),
  controls: t(
    '哪些条件保持相同？对照组是什么？',
    'What will you hold constant? What is the control group?',
  ),
  challenge: t(
    '出现什么结果，会挑战你的主张？',
    'What result would challenge your claim?',
  ),
  zh: t(
    '中文简要总结（也可先用你熟悉的语言写）',
    'Concise Chinese summary (you may start in your stronger language)',
  ),
  en: t(
    '英文简要总结：The evidence suggests… because…; however…',
    'Concise English summary: The evidence suggests… because…; however…',
  ),
};
export function StoryboardProject({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const d = store.progress.projects.S04 ?? emptyStoryProject(),
    topic = d.topic,
    c = d.cases[topic];
  const [frame, setFrame] = useState(0);
  const outcome = storyStageOutcome(store.progress),
    understanding = storyUnderstanding(d);
  const evidence = storyEvidence(topic, c.input);
  const patch = (value: Partial<StoryCase>) =>
    store.update((p) =>
      withStoryProject(
        p,
        editStoryCase(p.projects.S04 ?? emptyStoryProject(), topic, value),
      ),
    );
  const selectTopic = (value: typeof topic) => {
    store.update((p) =>
      withStoryProject(p, {
        ...(p.projects.S04 ?? emptyStoryProject()),
        topic: value,
      }),
    );
    setFrame(0);
  };
  return (
    <>
      <span className="bio-eyebrow">
        S04 /{' '}
        <Text
          mode={mode}
          text={t(
            '阶段作品 · 科学分镜',
            'STAGE PROJECT · SCIENTIFIC STORYBOARD',
          )}
        />
      </span>
      <h1>
        <Text
          mode={mode}
          text={t('解释一个看得见的现象', 'Explain a visible phenomenon')}
        />
      </h1>
      <p>
        <Text
          mode={mode}
          text={t(
            '选一个问题，用四格原创图解释：现象→微观机制→条件对照→可检验预测。约25–35分钟，草稿自动保留；可以分次完成。',
            'Choose a question and explain it in four illustrated frames: phenomenon → microscopic mechanism → controlled comparison → testable prediction. About 25–35 minutes; drafts autosave across visits.',
          )}
        />
      </p>
      <p className="bio-caption">
        <Text
          mode={mode}
          text={t(
            '三种题材的文字分别保存。引用至少两条不同数值记录，区分观察与假设，再提出能挑战解释的检验。中文或英文清楚表达即可保存；双语栏供练习，英语水平不锁定进度。',
            'Writing is retained separately for all three topics. Cite at least two distinct numeric records, separate observations from assumptions, and propose a test that could challenge your explanation. Clear writing in either language can be saved; bilingual fields support practice without an English gate.',
          )}
        />
      </p>
      <div
        className="bio-choice-row bio-story-topics"
        aria-label={mode === 'en' ? 'Choose a topic' : '选择题材'}
      >
        {storyTopics.map((id) => (
          <button
            key={id}
            aria-pressed={topic === id}
            onClick={() => selectTopic(id)}
          >
            <Text mode={mode} text={storyNames[id]} />
            {d.cases[id].savedAt ? ' ✓' : ''}
          </button>
        ))}
      </div>
      <section className="bio-story-controls bio-lab bio-s3-lab">
        <h2>
          <Text
            mode={mode}
            text={t('先读数据，再解释', 'Read the evidence before explaining')}
          />
        </h2>
        <div className="bio-choice-row">
          {(topic === 'plant'
            ? [20, 60]
            : topic === 'enzyme'
              ? [5, 40]
              : [0, 1]
          ).map((n) => (
            <button
              key={n}
              aria-pressed={c.input === n}
              onClick={() => patch({ input: n })}
            >
              <Text
                mode={mode}
                text={
                  topic === 'plant'
                    ? t(`模型光指数 ${n}`, `Model light index ${n}`)
                    : topic === 'enzyme'
                      ? t(`冷却酶测定 ${n}°C`, `Cooled enzyme assay ${n}°C`)
                      : n === 0
                        ? t('干旱', 'Drought')
                        : t('洪水', 'Flood')
                }
              />
            </button>
          ))}
        </div>
        <p aria-live="polite">
          <Text
            mode={mode}
            text={
              topic === 'plant'
                ? t(
                    `独立光合模型相对速率：${storyModelValue(topic, c.input).toFixed(0)}；不换算成干质量。`,
                    `Separate photosynthesis model relative rate: ${storyModelValue(topic, c.input).toFixed(0)}; not converted to dry mass.`,
                  )
                : topic === 'enzyme'
                  ? t(
                      `虚构酶E相对初速：${storyModelValue(topic, c.input).toFixed(1)}；温度与先前热史要分开。`,
                      `Fictional enzyme E relative initial rate: ${storyModelValue(topic, c.input).toFixed(1)}; separate assay temperature and prior heat.`,
                    )
                  : t(
                      `A群落30天内恢复损失比例：${(storyModelValue(topic, c.input) * 100).toFixed(1)}%；不是普遍恢复速率。`,
                      `A regained ${(storyModelValue(topic, c.input) * 100).toFixed(1)}% of lost function within 30 days; not a universal recovery rate.`,
                    )
            }
          />
        </p>
        <div className="bio-table-scroll">
          <table>
            <caption>
              <Text
                mode={mode}
                text={t(
                  '原创虚构教学记录；酶与生态数值为模型输出',
                  'Original fictional teaching records; enzyme and ecological values are model outputs',
                )}
              />
            </caption>
            <colgroup>
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  <Text mode={mode} text={t('数值证据', 'Numeric evidence')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.id}</th>
                  <td>
                    <Text mode={mode} text={r.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bio-story-citations">
          {[0, 1].map((i) => (
            <label key={i}>
              <Text
                mode={mode}
                text={t(`引用记录 ${i + 1}`, `Cited record ${i + 1}`)}
              />
              <select
                value={c.citations[i]}
                onChange={(e) =>
                  patch({
                    citations: c.citations.map((v, j) =>
                      j === i ? e.target.value : v,
                    ),
                  })
                }
              >
                <option value="">
                  {mode === 'en' ? 'Choose a record' : '选择一条记录'}
                </option>
                {evidence.map((r) => (
                  <option value={r.id} key={r.id}>
                    {mode === 'en' ? r.label.en : r.label.zh}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>
      <section className="bio-story-guided">
        <h2>
          <Text
            mode={mode}
            text={t('逐格看解释', 'Walk through the explanation')}
          />
        </h2>
        <div className="bio-choice-row">
          {frameNames.map((name, i) => (
            <button
              key={i}
              aria-pressed={frame === i}
              onClick={() => setFrame(i)}
            >
              <Text mode={mode} text={name} />
            </button>
          ))}
        </div>
        <figure>
          <img
            className="bio-story-image"
            src={dataUrl(storySceneSvg(topic, frame, c.input))}
            alt={`${storyNames[topic].zh} / ${storyNames[topic].en}: ${frameNames[frame]!.zh} / ${frameNames[frame]!.en}`}
          />
          <figcaption>
            <Text mode={mode} text={storyNotes[topic][frame]!} />
          </figcaption>
        </figure>
        <div className="bio-playback">
          <button disabled={frame === 0} onClick={() => setFrame(frame - 1)}>
            <Text mode={mode} text={t('上一格', 'Previous frame')} />
          </button>
          <button disabled={frame === 3} onClick={() => setFrame(frame + 1)}>
            <Text mode={mode} text={t('下一格', 'Next frame')} />
          </button>
          <button onClick={() => setFrame(0)}>
            <Text mode={mode} text={t('从头看', 'Start again')} />
          </button>
          <span>{frame + 1} / 4</span>
        </div>
      </section>
      <h2>
        <Text
          mode={mode}
          text={t(
            '四格总览：写下自己的科学说明',
            'Four-frame overview: write your scientific captions',
          )}
        />
      </h2>
      <div className="bio-story-grid">
        {frameNames.map((name, i) => (
          <section className="bio-story-card" key={i}>
            <h3>
              <Text mode={mode} text={name} />
            </h3>
            <img
              className="bio-story-image"
              src={dataUrl(storySceneSvg(topic, i, c.input))}
              alt={`${name.zh} / ${name.en}`}
            />
            <details>
              <summary>
                <Text
                  mode={mode}
                  text={t('证据与解释线索', 'Evidence and explanation clues')}
                />
              </summary>
              <p>
                <Text mode={mode} text={storyNotes[topic][i]!} />
              </p>
            </details>
            {(['zh', 'en'] as const).map((language) => (
              <label key={language}>
                {language === 'zh' ? '中文说明' : 'English caption'}
                <textarea
                  rows={3}
                  maxLength={1200}
                  value={c.frames[i]![language]}
                  onChange={(e) =>
                    patch({
                      frames: c.frames.map((f, j) =>
                        j === i ? { ...f, [language]: e.target.value } : f,
                      ),
                    })
                  }
                />
              </label>
            ))}
          </section>
        ))}
      </div>
      <section className="bio-story-writing">
        <h2>
          <Text
            mode={mode}
            text={t(
              '把证据连到可检验的解释',
              'Connect evidence to a testable explanation',
            )}
          />
        </h2>
        {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => (
          <label key={key}>
            <Text mode={mode} text={labels[key]} />
            <textarea
              rows={3}
              maxLength={1600}
              value={c[key]}
              onChange={(e) => patch({ [key]: e.target.value })}
            />
          </label>
        ))}
        <label>
          <Text
            mode={mode}
            text={t(
              '独立重复数（2–30；建议至少3）',
              'Independent replicates (2–30; at least 3 recommended)',
            )}
          />
          <input
            type="number"
            min={2}
            max={30}
            step={1}
            value={c.repeats}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isInteger(n) && n >= 2 && n <= 30)
                patch({ repeats: n });
            }}
          />
        </label>
      </section>
      <p>
        <Text
          mode={mode}
          text={t(
            '保存条件：四格各有至少一种语言说明、两条不同数值引用、观察/假设/机制、完整检验方案及至少一种语言总结。系统只检查结构，不判断自由文字的科学真实性或英语质量。修改本题材后需重新保存；另一个已保存题材仍可计入阶段作品。',
            'To save: a caption in at least one language per frame, two distinct numeric citations, observations/assumptions/mechanism, a full test plan and a summary in either language. Checks cover structure, not scientific truth of prose or English quality. Edits require saving this topic again; another saved topic can still qualify.',
          )}
        />
      </p>
      <div className="bio-question-actions">
        <button
          className="bio-button"
          disabled={!storyCaseReady(topic, c)}
          onClick={() =>
            store.update((p) => {
              const draft = p.projects.S04 ?? emptyStoryProject();
              return withStoryProject(p, {
                ...draft,
                cases: {
                  ...draft.cases,
                  [topic]: { ...draft.cases[topic], savedAt: Date.now() },
                },
              });
            })
          }
        >
          <Text mode={mode} text={t('保存这份分镜', 'Save this storyboard')} />
        </button>
        <a
          className="bio-button secondary"
          href={dataUrl(storySvg(topic, c))}
          download={`biology-S04-${topic}.svg`}
        >
          <Text
            mode={mode}
            text={t('下载完整分镜 SVG', 'Download full storyboard SVG')}
          />
        </a>
      </div>
      <p role="status">
        <Text
          mode={mode}
          text={
            c.savedAt
              ? t(
                  '✓ 当前题材已保存；改动后需重新保存。',
                  '✓ Current topic saved; save again after edits.',
                )
              : t(
                  '当前题材为自动保存的草稿。',
                  'Current topic is an autosaved draft.',
                )
          }
        />
      </p>
      <section className="bio-story-check">
        <h2>
          <Text
            mode={mode}
            text={t('跨单元理解检查', 'Across-unit understanding check')}
          />
        </h2>
        <p>
          {understanding.correct} / 6 ·{' '}
          <Text
            mode={mode}
            text={t(
              '六题全答，至少五题正确，可回看和订正。',
              'Answer all six with at least five correct; revisit and revise.',
            )}
          />
        </p>
        {storyStageQuestions.map((question, i) => (
          <div className="bio-question" key={question.id}>
            <CheckCard
              question={question}
              relatedLesson={storyQuestionLessons[i]!}
              answer={d.answers[question.id]}
              save={(value) =>
                store.update((p) => {
                  const draft = p.projects.S04 ?? emptyStoryProject();
                  return withStoryProject(p, {
                    ...draft,
                    answers: { ...draft.answers, [question.id]: value },
                  });
                })
              }
              mode={mode}
            />
          </div>
        ))}
      </section>
      <p className="bio-inquiry-result" role="status">
        <Text
          mode={mode}
          text={
            outcome.complete
              ? t(
                  '✓ 第四阶段探索完成：24课、6任务、保存的科学分镜与理解检查。',
                  '✓ Stage four explored: 24 lessons, six investigations, saved storyboard and understanding check.',
                )
              : t(
                  `第四阶段：${outcome.lessons}/24课，${outcome.missions}/6任务；至少一个完整已保存题材，六题全答且≥5/6。`,
                  `Stage four: ${outcome.lessons}/24 lessons, ${outcome.missions}/6 investigations; at least one complete saved topic and all six checks answered with ≥5/6.`,
                )
          }
        />
      </p>
      <Link to="/biology#U19">
        <Text
          mode={mode}
          text={t('返回第四阶段课程 →', 'Return to stage-four lessons →')}
        />
      </Link>
    </>
  );
}
