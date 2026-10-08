import { useEffect, useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { lessonContent } from './content/loadLesson';
import { lessonCatalog } from './content/catalog';
import type { Lesson } from './content/schema';
import { B, Text } from './ui';

export function LessonContentGate({
  id,
  mode,
  children,
}: {
  id: string;
  mode: LanguageMode;
  children: (lesson: Lesson) => ReactNode;
}) {
  const [state, setState] = useState<{
    id: string;
    lesson?: Lesson;
    error?: boolean;
  }>(() => ({ id, lesson: lessonContent.getLoaded(id) }));
  useEffect(() => {
    let current = true;
    lessonContent.load(id).then(
      (lesson) => {
        if (current) setState({ id, lesson, error: !lesson });
      },
      () => {
        if (current) setState({ id, error: true });
      },
    );
    return () => {
      current = false;
    };
  }, [id]);
  const lesson =
    lessonContent.getLoaded(id) ?? (state.id === id ? state.lesson : undefined);
  if (lesson) return children(lesson);
  const entry = lessonCatalog.find((l) => l.id === id);
  const error = state.id === id && state.error;
  return (
    <section className="phy-content-state" aria-busy={!error}>
      {entry && (
        <h2>
          <Text value={entry.title} mode={mode} />
        </h2>
      )}
      <p role="status">
        <B
          zh={
            error
              ? '这课暂时没能打开，已有学习记录仍保留。可以重试。'
              : '正在准备这场探索…'
          }
          en={
            error
              ? 'This lesson could not open. Your saved work is retained. Try again.'
              : 'Preparing this discovery…'
          }
          mode={mode}
        />
      </p>
      {error && (
        <button className="phy-button" onClick={() => window.location.reload()}>
          <B zh="重新打开" en="Try again" mode={mode} />
        </button>
      )}
    </section>
  );
}
