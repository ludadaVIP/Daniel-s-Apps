import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Text, Icon } from './ui';
import {
  DETECTIVE_ID,
  detectiveFields,
  detectiveState,
  detectiveMarkdown,
} from './projects';
export function ProjectCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const fields = store.progress.projects?.[DETECTIVE_ID]?.fields ?? {},
    state = detectiveState(fields);
  return (
    <Link to="/physics/project/detective" className="phy-project-card">
      <Icon name="book" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 0 / FIELD PROJECT</span>
        <h3>
          <B
            zh="物理侦探：调查一个生活现象"
            en="Physics Detective: investigate everyday life"
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="带着一个问题，写计划、记证据，再讲给家人听。"
            en="Choose a question, plan a test, record evidence and explain it to your family."
            mode={mode}
          />
        </p>
      </div>
      <span className="phy-tag">
        <B
          zh={
            state.completed
              ? '调查记录完成'
              : state.planned
                ? '计划已准备好'
                : '开始调查'
          }
          en={
            state.completed
              ? 'Record complete'
              : state.planned
                ? 'Plan ready'
                : 'Start investigating'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
export function ProjectPage({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const draft = store.progress.projects?.[DETECTIVE_ID],
    fields = draft?.fields ?? {},
    state = detectiveState(fields);
  const patch = (key: string, value: string) =>
    store.update((old) => ({
      ...old,
      projects: {
        ...old.projects,
        [DETECTIVE_ID]: {
          fields: { ...old.projects?.[DETECTIVE_ID]?.fields, [key]: value },
          updatedAt: Date.now(),
        },
      },
    }));
  const groups = [
    {
      zh: '01 / 选一个现象',
      en: '01 / Choose a phenomenon',
      keys: ['phenomenon', 'observation', 'question'],
    },
    {
      zh: '02 / 先猜，再公平计划',
      en: '02 / Predict and plan fairly',
      keys: ['prediction', 'change', 'keep', 'measure'],
    },
    {
      zh: '03 / 带着证据回来',
      en: '03 / Return with evidence',
      keys: ['result', 'explanation', 'next'],
    },
  ];
  return (
    <div className="phy-page">
      <div className="phy-breadcrumb">
        <Link to="/physics/path">
          <B zh="学习路线" en="Learning path" mode={mode} />
        </Link>
        <span>/</span>
        <B zh="物理侦探" en="Physics Detective" mode={mode} />
      </div>
      <p className="phy-eyebrow">YOUR FIRST FIELD INVESTIGATION</p>
      <h1>
        <B
          zh="世界就是你的实验室。"
          en="The world is your laboratory."
          mode={mode}
        />
      </h1>
      <p className="phy-lead">
        <B
          zh="选一个真正看见的现象。从小问题开始，不急着找标准答案。这个项目记录你的想法和证据，允许不确定。"
          en="Choose something you actually noticed. Start small and let evidence develop your explanation. Uncertainty belongs in this record too."
          mode={mode}
        />
      </p>
      <div className="phy-project-inspiration">
        <h2>
          <B
            zh="不知道从哪里开始？"
            en="Need a starting question?"
            mode={mode}
          />
        </h2>
        <div>
          <Link to="/physics/lesson/cause-and-effect">
            <B
              zh="毛巾会改变小球的停止距离吗？"
              en="Does a towel change a ball’s stopping distance?"
              mode={mode}
            />
          </Link>
          <Link to="/physics/lesson/why-balls-bounce">
            <B
              zh="同一颗球，从不同高度释放呢？"
              en="What if the same ball starts at different heights?"
              mode={mode}
            />
          </Link>
          <Link to="/physics/lesson/measure-temperature">
            <B
              zh="触感能准确判断室温物体的温度吗？"
              en="Can touch judge the temperature of room-temperature objects?"
              mode={mode}
            />
          </Link>
        </div>
      </div>
      <div className="phy-project-layout">
        <div>
          {groups.map((group) => (
            <section className="phy-project-section" key={group.en}>
              <h2>
                <B zh={group.zh} en={group.en} mode={mode} />
              </h2>
              {detectiveFields
                .filter((f) => group.keys.includes(f.key))
                .map((f) => (
                  <label key={f.key}>
                    <Text value={f.label} mode={mode} />
                    {f.key === 'phenomenon' ? (
                      <input
                        maxLength={f.max}
                        value={fields[f.key] ?? ''}
                        onChange={(e) => patch(f.key, e.target.value)}
                      />
                    ) : (
                      <textarea
                        rows={
                          f.key === 'result' || f.key === 'explanation' ? 4 : 2
                        }
                        maxLength={f.max}
                        value={fields[f.key] ?? ''}
                        onChange={(e) => patch(f.key, e.target.value)}
                      />
                    )}
                    <small>
                      <Text value={f.hint} mode={mode} />
                    </small>
                  </label>
                ))}
            </section>
          ))}
        </div>
        <aside className="phy-project-guide">
          <h2>
            <B zh="让证据带路" en="Let evidence lead" mode={mode} />
          </h2>
          <ol>
            <li>
              <B
                zh="把观察和解释分开。"
                en="Separate observation and explanation."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="只改一个主要条件，尽量公平比较。"
                en="Change one main condition and compare fairly."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="每次结果都记录，包括意外结果。"
                en="Keep every result, including surprises."
                mode={mode}
              />
            </li>
            <li>
              <B
                zh="只用合适的玩具与日常材料。"
                en="Use suitable toys and everyday materials."
                mode={mode}
              />
            </li>
          </ol>
          <p>
            <B
              zh="涉及加热、用电或陌生材料时，先改成安全的观察问题或请家长帮助。"
              en="For heat, electricity or unfamiliar materials, choose a safe observation question or involve a parent."
              mode={mode}
            />
          </p>
          <div className="phy-project-status" role="status">
            <strong>
              <B
                zh={
                  state.completed
                    ? '调查记录完整了'
                    : state.planned
                      ? '可以带着计划去观察了'
                      : '小问题正在成形'
                }
                en={
                  state.completed
                    ? 'Investigation record complete'
                    : state.planned
                      ? 'Ready to investigate'
                      : 'A question is taking shape'
                }
                mode={mode}
              />
            </strong>
            <p>
              <B
                zh={
                  state.completed
                    ? '把证据讲给家人听。记录完成，不代表猜想已经被证明；可以继续修订。'
                    : state.planned
                      ? '保留相同条件，重复记录。完成后回来写真实结果。'
                      : '写下观察、问题、猜想，以及要改、保持和测量的内容。'
                }
                en={
                  state.completed
                    ? 'Explain the evidence to your family. A complete record does not prove your prediction; keep revising.'
                    : state.planned
                      ? 'Keep conditions consistent and repeat records. Return with your actual results.'
                      : 'Write an observation, question, prediction, and what to change, keep and measure.'
                }
                mode={mode}
              />
            </p>
          </div>
          <p className="phy-soft">
            <B
              zh={
                store.storageAvailable
                  ? '输入自动保存在此浏览器。'
                  : '当前无法保存到浏览器；请下载记录。'
              }
              en={
                store.storageAvailable
                  ? 'Your entries are saved automatically in this browser.'
                  : 'Browser storage is unavailable; download your record.'
              }
              mode={mode}
            />
          </p>
          <button
            className="phy-button"
            disabled={!Object.values(fields).some((v) => v.trim())}
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([detectiveMarkdown(fields)], {
                  type: 'text/markdown;charset=utf-8',
                }),
              );
              const a = document.createElement('a');
              a.href = url;
              a.download = 'physics-detective.md';
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            <B zh="下载调查记录" en="Download investigation" mode={mode} />
            <Icon name="arrow" />
          </button>
          <Link className="phy-text-button" to="/physics/notebook">
            <B zh="去发现手帐 →" en="Visit your notebook →" mode={mode} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
