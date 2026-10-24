import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { QuestionNavigator } from '@study/ui';
import { unitChecks, type UnitCheckId } from './content';
import { newSession, t } from './model';
import { Question } from './Question';
import { Text } from './ui';
import { Intro, type Props } from './pageSupport';
import { postRouteUnitFor } from './content/retrievalUnits';
import {
  maintenanceForUnit,
  maintenanceHref,
  recurrenceEvidence,
  type MaintenanceSet,
} from './content/maintenance';
export function UnitCheck(props: Props & { maintenance?: boolean }) {
  const { unitId } = useParams();
  const [params, setParams] = useSearchParams();
  const postUnit = postRouteUnitFor(unitId);
  const requested = params.get('question');
  const requestedSet = params.get('set');
  const unitMaintenance = maintenanceForUnit(unitId);
  const maintenance: MaintenanceSet | undefined =
    props.maintenance && requestedSet !== null
      ? unitMaintenance.find((set) => set.id === requestedSet)
      : ((props.maintenance
          ? unitMaintenance.find((set) =>
              set.questions.some((question) => question.id === requested),
            )
          : undefined) ?? unitMaintenance[0]);
  const check = props.maintenance
    ? maintenance
    : unitId && Object.hasOwn(unitChecks, unitId)
      ? unitChecks[unitId as UnitCheckId]
      : undefined;
  const requestedIndex =
    check?.questions.findIndex((question) => question.id === requested) ?? -1;
  const update = props.store.update;
  useEffect(() => {
    if (!check || requestedIndex < 0) return;
    update(check.id, (old) => ({ ...old, practiceIndex: requestedIndex }));
    const nextParams = new URLSearchParams(params);
    nextParams.delete('question');
    if (props.maintenance && unitMaintenance.length > 1)
      nextParams.set('set', check.id);
    setParams(nextParams, { replace: true });
  }, [
    check,
    requestedIndex,
    params,
    setParams,
    update,
    props.maintenance,
    unitMaintenance.length,
  ]);
  if (!check)
    return (
      <>
        <Intro
          mode={props.mode}
          kicker={props.maintenance ? 'CROSS-UNIT RETRIEVAL' : 'UNIT REVIEW'}
          title={
            postUnit && !props.maintenance
              ? t('这里是后续维护单元。', 'This unit contains later retrieval.')
              : props.maintenance
                ? t(
                    '这个单元的跨单元维护还在准备中。',
                    'Cross-unit retrieval for this unit is being prepared.',
                  )
                : t(
                    '这个单元回顾还在准备中。',
                    'This unit review is being prepared.',
                  )
          }
          body={
            postUnit && !props.maintenance
              ? t(
                  '这里没有正式单元回顾；打开已提供的维护任务组。',
                  'There is no formal unit check here;open the available retrieval groups.',
                )
              : t(
                  '先探索已经开放的单元。',
                  'Explore one of the open units first.',
                )
          }
        />
        <Link
          className="math-button"
          to={
            postUnit && !props.maintenance
              ? `/math/unit/${postUnit.id}/maintenance`
              : '/math'
          }
        >
          <Text
            mode={props.mode}
            text={
              postUnit && !props.maintenance
                ? t('打开这个维护单元', 'Open this retrieval unit')
                : t('回到探索', 'Back to Discover')
            }
          />
        </Link>
      </>
    );
  const { mode, store } = props,
    s = store.progress.sessions[check.id] ?? newSession(),
    index =
      requestedIndex >= 0
        ? requestedIndex
        : Math.min(s.practiceIndex ?? 0, check.questions.length - 1),
    q = check.questions[index]!;
  const bridge = props.maintenance
    ? (maintenance?.bridgeByQuestion?.[q.id] ??
      recurrenceEvidence.find((e) => e.targets.includes(q.id))?.sourceLesson ??
      check.bridge)
    : check.bridge;
  const sourceUnit = bridge.split('-')[0];
  const retrievalIntro =
    maintenance?.intro ??
    t(
      '完成本单元后，可另选一次10–15分钟回看B01的五个想法：先预测，再独立作答或画图。可以分两次、不计时；需要时再展开提示。两道解释由家长核验，不影响正常选课。',
      'After this unit, optionally revisit five B01 ideas in a separate 10–15 minute session. Predict before answering or drawing; split it into two sessions if useful, without a timer. Open hints when needed. A parent reviews both explanations; this does not restrict lesson choice.',
    );
  const recorded = check.questions.filter(
      (q) => s.answers[q.id]?.checked,
    ).length,
    independent = check.questions.filter(
      (q) => s.answers[q.id]?.correct && s.answers[q.id]?.independent,
    ).length;
  return (
    <>
      <Link
        className="math-back"
        to={postUnit ? '/math/retrieval' : `/math#${check.unit}`}
      >
        ←{' '}
        <Text
          mode={mode}
          text={
            postUnit
              ? t('回到后续维护', 'Back to later retrieval')
              : t('回到这个单元', 'Back to this unit')
          }
        />
      </Link>
      <Intro
        mode={mode}
        kicker={`${check.unit} / ${props.maintenance ? 'CROSS-UNIT RETRIEVAL' : 'UNIT REVIEW'}`}
        title={check.title}
        body={
          props.maintenance
            ? retrievalIntro
            : t(
                '把几节课的想法连起来。没有计时；可以分两次做，答案和提示都会保留。解释题仍由家长核对。',
                'Connect the ideas from several lessons. No timer; split this across two sessions if useful. Answers and hints stay saved, and a parent reviews the explanation.',
              )
        }
      />
      <section className="math-panel">
        <QuestionNavigator
          mode={mode}
          index={index}
          count={check.questions.length}
          onChange={(i) =>
            store.update(check.id, (old) => ({ ...old, practiceIndex: i }))
          }
        />
        <Question
          key={q.id}
          question={q}
          mode={mode}
          attempt={s.answers[q.id]}
          onChange={(a) =>
            store.update(check.id, (old) => ({
              ...old,
              answers: { ...old.answers, [q.id]: a },
            }))
          }
        />
      </section>
      <section className="math-panel">
        <h3>
          <Text
            mode={mode}
            text={t(
              '看看哪些想法已经连起来',
              'Notice which ideas are connected',
            )}
          />
        </h3>
        <p>
          <Text
            mode={mode}
            text={t(
              `已记录 ${recorded}/${check.questions.length} 题；${independent} 题独立完成。尚未核对的解释不算完成。`,
              `Recorded ${recorded}/${check.questions.length}; ${independent} independently completed. An explanation is unfinished until reviewed.`,
            )}
          />
        </p>
        {recorded === check.questions.length && (
          <div className="math-hint">
            <Text
              mode={mode}
              text={
                independent >= Math.ceil(check.questions.length * 0.8)
                  ? t(
                      '这次回顾有较好的独立完成证据。请孩子再用图说明一题，再决定下一步；一次表现不代表永久掌握。',
                      'This review gives useful evidence of independent understanding. Ask the learner to explain another answer with a diagram before choosing the next step; one attempt does not mean permanent mastery.',
                    )
                  : props.maintenance
                    ? t(
                        '有些想法还值得再解释。回到当前题对应的基础模型，用图重看；不必为了做满题量而赶进度。',
                        'Some ideas deserve another explanation. Revisit the foundation model for this task; there is no need to rush for a question count.',
                      )
                    : t(
                        '有些想法还值得再解释。先回到本单元的基础模型，用图重看；不必为了做满题量而赶进度。',
                        'Some ideas deserve another explanation. Revisit this unit’s foundation model; there is no need to rush for a question count.',
                      )
              }
            />
          </div>
        )}
        <Link
          className="math-button secondary"
          to={`/math/lesson/${bridge}?step=1`}
        >
          <Text
            mode={mode}
            text={
              props.maintenance
                ? sourceUnit === 'B01'
                  ? t('回看B01数感模型', 'Revisit B01 number models')
                  : t(
                      `回看${sourceUnit}基础模型`,
                      `Revisit ${sourceUnit} foundation models`,
                    )
                : t('回到基础模型', 'Revisit the foundation model')
            }
          />{' '}
          ↗
        </Link>
        <p className="math-muted">
          <Text
            mode={mode}
            text={
              props.maintenance
                ? t(
                    '维护题另存记录，不覆盖本单元回顾或源课程的掌握状态；做过两次也不等于永久掌握。家长请区分数学提示与英文读题协助，记录孩子自己的解释。',
                    'Retrieval has its own records and does not overwrite this unit check or source lesson mastery. Two attempts do not mean permanent mastery. Distinguish mathematical hints from English reading assistance and listen to the learner’s own explanation.',
                  )
                : t(
                    '单元回顾的记录独立保存，不会修改各课的掌握状态。可以逐题回看方法；每课的复习仍在“温故知新”中继续。',
                    'This review is stored separately and does not alter lesson mastery. Review each method here; lesson retrieval continues in the Review space.',
                  )
            }
          />
        </p>
      </section>
      {maintenance &&
        (!props.maintenance || Object.hasOwn(unitChecks, check.unit)) && (
          <section className="math-panel">
            <h3>
              <Text
                mode={mode}
                text={
                  props.maintenance
                    ? t('回到本单元回顾', 'Return to this unit review')
                    : t(
                        '换个情境，回看更早的想法',
                        'Revisit earlier ideas in a changed context',
                      )
                }
              />
            </h3>
            <p>
              <Text
                mode={mode}
                text={
                  props.maintenance
                    ? t(
                        '两组记录各自保存，可以随时切换。',
                        'Both sets keep their own records; switch at any time.',
                      )
                    : t(
                        `另有${maintenance.questions.length}道跨单元维护题。可以分次再做，不增加本次单元回顾的题量。`,
                        `${maintenance.questions.length} separate cross-unit retrieval tasks are available. Save them for other sessions if useful; they do not add to this unit check.`,
                      )
                }
              />
            </p>
            <Link
              className="math-button secondary"
              to={`/math/unit/${check.unit}/${props.maintenance ? 'check' : 'maintenance'}`}
            >
              <Text
                mode={mode}
                text={
                  props.maintenance
                    ? t('打开单元回顾', 'Open unit review')
                    : t(
                        `打开${maintenance.questions.length}题跨单元维护`,
                        `Open ${maintenance.questions.length === 5 ? 'five' : maintenance.questions.length} cross-unit retrieval tasks`,
                      )
                }
              />{' '}
              ↗
            </Link>
          </section>
        )}
      {maintenance && unitMaintenance.length > 1 && (
        <section className="math-panel">
          <h3>
            <Text
              mode={mode}
              text={t('更多跨单元维护', 'More retrieval groups')}
            />
          </h3>
          <p>
            <Text
              mode={mode}
              text={t(
                '每组可分次完成，答案和提示分别保留。',
                'Split each group across sittings; answers and hints stay saved separately.',
              )}
            />
          </p>
          <ul>
            {unitMaintenance
              .filter((set) => set.id !== maintenance.id)
              .map((set) => (
                <li key={set.id}>
                  <Link to={maintenanceHref(set)}>
                    <Text mode={mode} text={set.title} /> (
                    {set.questions.length})
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </>
  );
}
