import { lessons, unitChecks } from './content';
import {
  maintenanceSets,
  maintenanceHref,
  recurrenceEvidence,
} from './content/maintenance';
import { t } from './model';
import type { LocalizedText } from '@study/shared';

const targets = new Map<
  string,
  { title: LocalizedText; label: LocalizedText; href: string }
>(
  lessons.flatMap((lesson) =>
    [
      { question: lesson.guided, label: t('一起做', 'Guided task') },
      ...lesson.questions.map((question, index) => ({
        question,
        label: t(`练习${index + 1}`, `Practice ${index + 1}`),
      })),
      { question: lesson.exit, label: t('出口题', 'Exit task') },
    ].map(
      ({ question, label }) =>
        [
          question.id,
          {
            title: lesson.title,
            label,
            href: `/math/lesson/${lesson.id}?question=${encodeURIComponent(question.id)}`,
          },
        ] as const,
    ),
  ),
);

for (const [sets, suffix] of [
  [unitChecks, 'check'],
  [maintenanceSets, 'maintenance'],
] as const) {
  for (const set of Object.values(sets)) {
    set.questions.forEach((question, index) =>
      targets.set(question.id, {
        title: set.title,
        label: t(`第${index + 1}题`, `Question ${index + 1}`),
        href:
          suffix === 'maintenance'
            ? maintenanceHref(set, question.id)
            : `/math/unit/${set.unit}/${suffix}?question=${encodeURIComponent(question.id)}`,
      }),
    );
  }
}

export function recurrenceLinksFor(lessonId: string) {
  return recurrenceEvidence
    .filter((evidence) => evidence.sourceLesson === lessonId)
    .map((evidence) => ({
      focus: evidence.focus,
      targets: evidence.targets.map((id) => ({ id, ...targets.get(id)! })),
    }));
}
