import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import {
  fieldClues,
  stageQuestions,
  emptyProject,
  projectTextReady,
  projectCheck,
  type ProjectDraft,
  type FieldRecord,
} from './project';
import { withProject, stageOutcome, type Store } from './progress';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
export function FieldScene({
  mode,
  selected,
  onSelect,
}: {
  mode: LanguageMode;
  selected: number;
  onSelect: (i: number) => void;
}) {
  const positions = [
    [65, 220],
    [180, 210],
    [85, 315],
    [285, 245],
    [325, 90],
  ];
  return (
    <svg
      viewBox="0 0 420 380"
      role="group"
      aria-label={word(
        mode,
        t(
          '五种虚拟生物观察场景，按编号选择',
          'Five fictional organism observations; select a number',
        ),
      )}
    >
      <rect x="8" y="8" width="404" height="356" rx="22" fill="#eef2e3" />
      <circle cx="360" cy="50" r="22" fill="#e8d195" />
      <path d="M30 339q190-36 355 0" fill="#dce4cf" />
      <path
        d="M305 195V70m0 32 64 14m-64-14-40-25"
        stroke="#94a17a"
        strokeWidth="8"
      />
      <g stroke="#708a58" strokeWidth="4" fill="none">
        <path d="M52 258q-24-56-15-72M53 258q3-70 17-83M53 258q33-45 31-66M163 290v-98" />
      </g>
      <g fill="#b5c997">
        <path d="M163 265q-43-34-42-11q6 25 42 11M163 249q45-36 45-13q-7 25-45 13M266 286q18-55 77-54q-24 58-77 54" />
      </g>
      <g transform="translate(163 185)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-14"
            rx="8"
            ry="17"
            transform={`rotate(${a})`}
            fill="#fffdf5"
            stroke="#d0d6be"
          />
        ))}
        <circle r="12" fill="#dbc676" />
      </g>
      <g transform="translate(90 321)">
        <path
          d="M-30 13h68q16-2 17-14"
          fill="none"
          stroke="#b6a873"
          strokeWidth="8"
        />
        <circle cx="-1" cy="-1" r="21" fill="#ddd1a6" stroke="#b6a873" />
        <path
          d="M4 10q-20 2-19-14q2-14 18-8q9 6 3 15"
          fill="none"
          stroke="#b6a873"
          strokeWidth="2"
        />
        <path d="m48-5 7-12m-7 12 13-3" stroke="#b6a873" strokeWidth="2" />
      </g>
      <g transform="translate(300 250)">
        <ellipse rx="14" ry="19" fill="#c99989" stroke="#8e776d" />
        <circle cy="-21" r="7" fill="#8e776d" />
        {[-1, 1].map((s) => (
          <g key={s}>
            <path
              d={`M${s * 12}-6l${s * 10}-7m${s * -2}24h${s * 15}`}
              stroke="#8e776d"
              fill="none"
            />
            <circle cx={s * 6} cy="-4" r="3" fill="#8e776d" />
            <circle cx={s * 7} cy="8" r="3" fill="#8e776d" />
          </g>
        ))}
      </g>
      <g transform="translate(350 94)">
        <ellipse rx="25" ry="15" fill="#bad097" stroke="#708a58" />
        <circle cx="17" cy="-13" r="12" fill="#bad097" stroke="#708a58" />
        <path
          d="m29-13 12 3-12 3M-24 0l-17-10 8 16m22 9-2 10m13-10-1 10"
          stroke="#708a58"
          fill="#d6c27b"
        />
        <circle cx="21" cy="-16" r="2" fill="#385842" />
      </g>
      {positions.map(([x, y], i) => (
        <g
          key={i}
          role="button"
          tabIndex={0}
          aria-label={word(
            mode,
            t(
              `${i + 1} ${fieldClues[i]!.name.zh}`,
              `${i + 1} ${fieldClues[i]!.name.en}`,
            ),
          )}
          aria-pressed={selected === i}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(i);
            }
          }}
          transform={`translate(${x} ${y})`}
        >
          <circle
            r="22"
            fill={selected === i ? '#708a58' : '#fbfaf5'}
            stroke="#708a58"
          />
          <text
            y="6"
            textAnchor="middle"
            fontSize="17"
            fill={selected === i ? 'white' : '#385842'}
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
export function FieldProject({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const draft = store.progress.projects?.S01 ?? emptyProject(),
    [index, setIndex] = useState(0),
    [panel, setPanel] = useState<'notes' | 'check'>('notes'),
    [clue, setClue] = useState(0),
    status = stageOutcome(store.progress),
    row = draft.records[index]!,
    check = projectCheck(draft);
  function update(patch: Partial<ProjectDraft>) {
    store.update((p) => withProject(p, 'S01', patch));
  }
  function edit(key: keyof FieldRecord, value: string) {
    const records = draft.records.map((r, i) =>
      i === index ? { ...r, [key]: value } : r,
    );
    update({ records, savedAt: undefined });
  }
  return (
    <>
      <span className="bio-eyebrow">
        S01 / <Text mode={mode} text={t('阶段作品', 'STAGE PROJECT')} />
      </span>
      <h1>
        <Text
          mode={mode}
          text={t('生命侦探野外笔记', 'Life Detective field notebook')}
        />
      </h1>
      <p className="bio-project-intro">
        <Text
          mode={mode}
          text={t(
            '记录5种生物：名字不知道，可以清楚描述。每条写观察证据、环境和一个疑问，再用中英文各总结一句。可在熟悉安全的地方观察，也可完全使用下方虚拟场景；不捕捉或改变生物。',
            'Record five kinds of organisms; a clear description is enough if a name is unknown. Include evidence, habitat and a question, then one summary in each language. Observe in a safe familiar place or use the fictional scene below, without catching or altering organisms.',
          )}
        />
      </p>
      <div className="bio-choice-row bio-inquiry-choices">
        <button
          aria-pressed={panel === 'notes'}
          onClick={() => setPanel('notes')}
        >
          <Text
            mode={mode}
            text={t('我的观察作品', 'My observation notebook')}
          />
        </button>
        <button
          aria-pressed={panel === 'check'}
          onClick={() => setPanel('check')}
        >
          <Text mode={mode} text={t('综合理解检查', 'Understanding check')} />
        </button>
      </div>
      {panel === 'notes' ? (
        <>
          <details className="bio-project-scene" open>
            <summary>
              <Text
                mode={mode}
                text={t(
                  '屏幕内观察：虚拟后院',
                  'Screen observation: fictional garden',
                )}
              />
            </summary>
            <div className="bio-project-scene-grid">
              <FieldScene mode={mode} selected={clue} onSelect={setClue} />
              <div>
                <h3>
                  <Text mode={mode} text={fieldClues[clue]!.name} />
                </h3>
                <p>
                  <Text mode={mode} text={fieldClues[clue]!.evidence} />
                </p>
                <p>
                  <Text mode={mode} text={fieldClues[clue]!.habitat} />
                </p>
                <div className="bio-choice-row bio-inquiry-choices">
                  {fieldClues.map((c, i) => (
                    <button
                      key={i}
                      aria-pressed={clue === i}
                      onClick={() => setClue(i)}
                    >
                      <Text
                        mode={mode}
                        text={t(
                          `${i + 1} ${c.name.zh}`,
                          `${i + 1} ${c.name.en}`,
                        )}
                      />
                    </button>
                  ))}
                </div>
                <small>
                  <Text
                    mode={mode}
                    text={t(
                      '原创静态虚拟场景，非真实野外记录。只显示外观和位置，不证明种名、食谱或数量变化。提出自己的问题。',
                      'Original static fictional scene, not a field record. Appearance and position do not establish species names, diets or population changes. Ask your own question.',
                    )}
                  />
                </small>
              </div>
            </div>
          </details>
          <section className="bio-project-writing">
            <div
              className="bio-choice-row bio-inquiry-choices"
              aria-label={word(mode, t('选择记录', 'Choose a record'))}
            >
              {draft.records.map((r, i) => (
                <button
                  key={i}
                  aria-pressed={index === i}
                  onClick={() => setIndex(i)}
                >
                  {i + 1} {r.name || word(mode, t('待记录', 'To record'))}
                </button>
              ))}
            </div>
            <h2>
              <Text
                mode={mode}
                text={t(`第${index + 1}条观察`, `Observation ${index + 1}`)}
              />
            </h2>
            <div
              className="bio-choice-row bio-inquiry-choices"
              aria-label={word(mode, t('观察来源', 'Observation source'))}
            >
              {(['virtual', 'real'] as const).map((source) => (
                <button
                  key={source}
                  aria-pressed={row.source === source}
                  onClick={() => edit('source', source)}
                >
                  <Text
                    mode={mode}
                    text={
                      source === 'virtual'
                        ? t('课中虚拟场景', 'Lesson’s fictional scene')
                        : t('真实观察或照片', 'Real observation or photo')
                    }
                  />
                </button>
              ))}
            </div>
            {(['name', 'evidence', 'habitat', 'question'] as const).map(
              (key, i) => (
                <label key={key}>
                  <Text
                    mode={mode}
                    text={
                      [
                        t(
                          '名称或清楚的外观描述',
                          'Name or clear appearance description',
                        ),
                        t(
                          '观察证据（时间、来源、看见什么）',
                          'Evidence (time, source, what was seen)',
                        ),
                        t(
                          '栖息环境（位置、光、水分等）',
                          'Habitat (location, light, moisture, etc.)',
                        ),
                        t('我还想问什么？', 'What question remains?'),
                      ][i]!
                    }
                  />
                  <textarea
                    value={row[key]}
                    maxLength={500}
                    rows={key === 'name' ? 2 : 3}
                    onChange={(e) => edit(key, e.target.value)}
                  />
                </label>
              ),
            )}
            <p className="bio-muted">
              <Text
                mode={mode}
                text={t(
                  '同一种生物的5个个体不是5种。种名不确定就写描述，不要从外观编造食谱。每条至少一个疑问。',
                  'Five individuals of one kind are not five kinds. Use descriptions if uncertain; do not invent diets from appearances. Include a question for each record.',
                )}
              />
            </p>
            <label>
              <Text
                mode={mode}
                text={t('中文总结（一句话）', 'Chinese summary (one sentence)')}
              />
              <textarea
                lang="zh"
                rows={2}
                maxLength={1000}
                value={draft.zh}
                onChange={(e) =>
                  update({ zh: e.target.value, savedAt: undefined })
                }
              />
            </label>
            <label>
              <Text
                mode={mode}
                text={t(
                  '英文总结（一句话，可用简单词）',
                  'English summary (one sentence; simple words are welcome)',
                )}
              />
              <textarea
                lang="en"
                rows={2}
                maxLength={1000}
                value={draft.en}
                onChange={(e) =>
                  update({ en: e.target.value, savedAt: undefined })
                }
              />
            </label>
            <button
              className="bio-button"
              disabled={!projectTextReady(draft)}
              onClick={() => update({ savedAt: Date.now() })}
            >
              <Text
                mode={mode}
                text={t('保存这份作品 ✓', 'Save this notebook ✓')}
              />
            </button>
            <p role="status">
              <Text
                mode={mode}
                text={
                  draft.savedAt
                    ? t(
                        '✓ 作品已保存；需要自己核对事实与描述。',
                        '✓ Notebook saved; check your facts and descriptions yourself.',
                      )
                    : t(
                        '草稿随输入保存。写完5条与两句总结即可保存作品。',
                        'Draft saves as you type. Finish five records and both summaries to save the notebook.',
                      )
                }
              />
            </p>
          </section>
        </>
      ) : (
        <ProjectCheck draft={draft} update={update} mode={mode} />
      )}
      <section className="bio-project-status" aria-live="polite">
        <h3>
          <Text
            mode={mode}
            text={
              status.complete
                ? t('✓ 第一阶段探索已完成', '✓ First stage explored')
                : t('第一阶段的探索进度', 'First-stage exploration progress')
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
              '作品保存 + 综合理解至少4/5 + 24课与6任务完成，构成阶段探索。可以先写草稿；英语句子由自己或家人校对，不自动判语言成绩。',
              'Saved notebook + at least 4/5 on the understanding check + 24 lessons and six unit missions complete the stage. Draft anytime; review English with family, without automatic language grading.',
            )}
          />
        </p>
        <Link to="/biology/notebook?unit=U06">
          <Text
            mode={mode}
            text={t('回到U06比较方案 →', 'Return to the U06 comparison plan →')}
          />
        </Link>
      </section>
    </>
  );
}
function ProjectCheck({
  draft,
  update,
  mode,
}: {
  draft: ProjectDraft;
  update: (patch: Partial<ProjectDraft>) => void;
  mode: LanguageMode;
}) {
  const [index, setIndex] = useState(0),
    question = stageQuestions[index]!;
  return (
    <section className="bio-project-writing">
      <p>
        <Text
          mode={mode}
          text={t(
            '五个跨单元问题，可回看课程并订正。英语不影响这一检查。',
            'Five questions connect the units. Revisit lessons and revise answers. English does not affect this check.',
          )}
        />
      </p>
      <div className="bio-choice-row bio-inquiry-choices">
        {stageQuestions.map((q, i) => (
          <button
            key={q.id}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {i + 1} {draft.answers[q.id] === q.correct ? '✓' : ''}
          </button>
        ))}
      </div>
      <CheckCard
        key={question.id}
        mode={mode}
        question={question}
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
            '达到4/5是建议理解线；未达到时按反馈回看，不惩罚、不清空作品。',
            '4/5 is a suggested understanding threshold. Revisit feedback if needed; your notebook remains available.',
          )}
        />
      </p>
    </section>
  );
}
function CheckCard({
  question,
  answer,
  save,
  mode,
}: {
  question: (typeof stageQuestions)[number];
  answer: number | undefined;
  save: (value: number) => void;
  mode: LanguageMode;
}) {
  const [choice, setChoice] = useState(answer),
    [submitted, setSubmitted] = useState(answer !== undefined);
  return (
    <>
      <h2>
        <Text mode={mode} text={question.prompt} />
      </h2>
      <div className="bio-options">
        {question.options.map((o, i) => (
          <button
            key={i}
            aria-pressed={choice === i}
            disabled={submitted}
            onClick={() => setChoice(i)}
          >
            <span>{'ABC'[i]}</span>
            <Text mode={mode} text={o} />
          </button>
        ))}
      </div>
      {submitted ? (
        <div className="bio-inquiry-result" role="status">
          <Text
            mode={mode}
            text={
              choice === question.correct
                ? t('这条证据找对了。', 'You identified the evidence.')
                : t('还有值得回看的线索。', 'There is a clue to revisit.')
            }
          />
          <Text mode={mode} text={question.feedback} />
          <Link
            to={`/biology/lesson/${['L001', 'L008', 'L009', 'L018', 'L024'][stageQuestions.indexOf(question)]}`}
          >
            <Text
              mode={mode}
              text={t('回看相关课程 ↗', 'Revisit the related lesson ↗')}
            />
          </Link>
          <button onClick={() => setSubmitted(false)}>
            <Text mode={mode} text={t('重新想一次', 'Think again')} />
          </button>
        </div>
      ) : (
        <button
          className="bio-button"
          disabled={choice === undefined}
          onClick={() => {
            save(choice!);
            setSubmitted(true);
          }}
        >
          <Text mode={mode} text={t('查看解释 →', 'View explanation →')} />
        </button>
      )}
    </>
  );
}
