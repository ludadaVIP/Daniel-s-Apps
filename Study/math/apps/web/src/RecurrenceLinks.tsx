import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { recurrenceLinksFor } from './recurrenceTargets';
import { Text } from './ui';
import { t } from './model';

export function RecurrenceLinks({
  lessonId,
  mode,
}: {
  lessonId: string;
  mode: LanguageMode;
}) {
  const groups = recurrenceLinksFor(lessonId);
  if (!groups.length) return null;
  return (
    <>
      <h4>
        <Text
          mode={mode}
          text={t('以后换个情境再试', 'Revisit later in a changed context')}
        />
      </h4>
      <p>
        <Text
          mode={mode}
          text={t(
            '学到这些后续单元并具备先修后，再分次选一题。先独立尝试，问孩子“什么变了，什么没变”，需要时再看提示；可用纸笔画图。',
            'When you reach these later units with the prerequisites in place, choose one task in another session. Try independently first; ask what changed and what stayed the same. Use hints when needed and draw on paper if useful.',
          )}
        />
      </p>
      {groups.map((group) => (
        <div key={group.focus.en}>
          <p>
            <strong>
              <Text mode={mode} text={group.focus} />
            </strong>
          </p>
          {group.targets.map((target) => (
            <Link
              key={target.id}
              className="math-prerequisite"
              to={target.href}
            >
              <span>
                <Text mode={mode} text={target.title} /> ·{' '}
                <Text mode={mode} text={target.label} /> ↗
              </span>
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}
