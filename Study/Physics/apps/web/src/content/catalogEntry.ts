import type { Lesson } from './schema';

export type LessonPack =
  | 'foundations'
  | 'measurement'
  | 'mysteries'
  | 'discoveries'
  | 'measurementSkills'
  | 'motion'
  | 'forces'
  | 'gravity'
  | 'density'
  | 'energy'
  | 'work'
  | 'thermal'
  | 'phase'
  | 'sound'
  | 'light'
  | 'pressure'
  | 'buoyancy'
  | 'machines'
  | 'electricity';

export type LessonCatalogEntry = Pick<
  Lesson,
  'id' | 'title' | 'subtitle' | 'minutes' | 'stage' | 'unit' | 'kind'
> & {
  pack: LessonPack;
  predictionCount: number;
  assessments: { optionCount: number; correct: number }[];
};

// Keep progress validation independent of loading a lesson's bilingual body.
export function catalogEntry(
  lesson: Lesson,
  pack: LessonPack,
): LessonCatalogEntry {
  const { id, title, subtitle, minutes, stage, unit, kind } = lesson;
  return {
    id,
    title,
    subtitle,
    minutes,
    stage,
    unit,
    kind,
    pack,
    predictionCount: lesson.predictions.length,
    assessments: [...lesson.questions, lesson.exit].map((question) => ({
      optionCount: question.options.length,
      correct: question.correct,
    })),
  };
}
