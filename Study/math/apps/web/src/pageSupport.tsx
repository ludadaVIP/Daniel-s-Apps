import type { LanguageMode, LocalizedText } from '@study/shared';
import type { Store } from './progress';
import { lessonById } from './content';
import { t, lessonOutcome } from './model';
import { Text } from './ui';
export const words = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
export type Props = { mode: LanguageMode; store: Store };
export const stepLabels = [
  t('猜一猜', 'Wonder'),
  t('动手探索', 'Explore'),
  t('看懂原理', 'Understand'),
  t('我们一起做', 'Together'),
  t('我来做', 'Practice'),
  t('带走一个发现', 'Reflect'),
];
export const statuses = {
  not_started: t('未开始', 'Not started'),
  exploring: t('探索中', 'Exploring'),
  practice_needed: t('需要巩固', 'Keep practising'),
  ready_to_progress: t('可以前进', 'Ready to progress'),
  review_due: t('该复习了', 'Review due'),
};
export function status(id: string, store: Store) {
  const s = store.progress.sessions[id],
    l = lessonById(id)!;
  if (!s) return 'not_started';
  if (!s.completedAt) return 'exploring';
  if (s.nextReview && new Date(s.nextReview).getTime() <= Date.now())
    return 'review_due';
  return lessonOutcome(l, s);
}
export function Intro({
  mode,
  kicker,
  title,
  body,
}: {
  mode: LanguageMode;
  kicker: string;
  title: LocalizedText;
  body: LocalizedText;
}) {
  return (
    <div className="math-page-heading">
      <span className="math-eyebrow">{kicker}</span>
      <h1>
        <Text mode={mode} text={title} />
      </h1>
      <p>
        <Text mode={mode} text={body} />
      </p>
    </div>
  );
}
