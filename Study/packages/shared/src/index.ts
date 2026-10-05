export type LocalizedText = { en: string; zh: string };
export type LanguageMode = 'zh' | 'en' | 'bilingual';
export type SubjectId = 'chemistry' | 'physics' | 'biology';

export type LessonStatus =
  'not-started' | 'learning' | 'practicing' | 'mastered' | 'review-due';

export interface LessonMeta {
  id: string;
  title: LocalizedText;
  levelId: string;
  order: number;
  estimatedMinutes: number;
  prerequisites: string[];
  masteryThreshold: number;
  tags: string[];
}

export function pickText(text: LocalizedText, mode: LanguageMode): string {
  return mode === 'en' ? text.en : text.zh;
}
