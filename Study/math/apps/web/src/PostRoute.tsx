import { Link } from 'react-router-dom';
import { t } from './model';
import { Text } from './ui';
import { Intro, type Props } from './pageSupport';
import { postRouteUnits } from './content/retrievalUnits';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
export function PostRouteEntry({ mode }: Pick<Props, 'mode'>) {
  return (
    <section className="math-panel">
      <h2>
        <Text mode={mode} text={t('学到终章之后', 'After the capstone')} />
      </h2>
      <p>
        <Text
          mode={mode}
          text={t(
            '换一次学习时段，在两个后续维护单元中重建拓展方法与项目推理。可以随时进入，不设速度或年级门槛。',
            'In another sitting,rebuild extension methods and project reasoning in two later retrieval units. Enter freely without speed or grade gates.',
          )}
        />
      </p>
      <Link className="math-button secondary" to="/math/retrieval">
        <Text
          mode={mode}
          text={t('打开后续维护单元', 'Open later retrieval units')}
        />{' '}
        ↗
      </Link>
    </section>
  );
}
export function PostRoutePage({ mode, store }: Props) {
  return (
    <>
      <Intro
        mode={mode}
        kicker="AFTER THE CAPSTONE"
        title={t(
          '换个情境，再把方法连起来。',
          'Change the context. Reconnect the methods.',
        )}
        body={t(
          '这两个维护单元承接H38，不增加正式课数。每组五题，可分次做；只核自己完成并解释的部分，整题全部核齐才确认。记录与正式课程分开，一次通过不代表永久掌握。',
          'These two retrieval units follow H38 without adding formal lessons. Each five-task group can span sittings;review your own work and reasoning,and confirm a whole task only after every part is checked. Records stay separate from formal lessons;one pass does not mean permanent mastery.',
        )}
      />
      {postRouteUnits.map((unit) => (
        <section className="math-panel" id={unit.id} key={unit.id}>
          <h2>
            {unit.id} · <Text mode={mode} text={unit.title} />
          </h2>
          <p>
            <Text mode={mode} text={unit.intro} />
          </p>
          <div className="math-retrieval-list">
            {maintenanceForUnit(unit.id).map((set) => {
              const session = store.progress.sessions[set.id],
                checked = set.questions.filter(
                  (q) => session?.answers[q.id]?.checked,
                ).length;
              return (
                <Link key={set.id} to={maintenanceHref(set)}>
                  <span>
                    <Text mode={mode} text={set.title} />
                  </span>
                  <span className="math-status">
                    <Text
                      mode={mode}
                      text={t(
                        `${set.questions.length}题 · 已核${checked}/${set.questions.length}`,
                        `${set.questions.length} tasks · reviewed ${checked}/${set.questions.length}`,
                      )}
                    />{' '}
                    ↗
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
