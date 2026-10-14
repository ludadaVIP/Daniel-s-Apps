import type { LanguageMode, LocalizedText } from '@study/shared';
import curriculum from '../../../content/curriculum.json';
import activityData from '../../../content/activities/lessons.json';
import assets from '../../../metadata/asset-manifest.json';

export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export const words = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
export { curriculum, assets };
export type Question = {
  id: string;
  prompt: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
  hint: LocalizedText;
};
export type Lesson = {
  id: string;
  stage: string;
  title: LocalizedText;
  question: LocalizedText;
  outcomes: LocalizedText[];
  prediction: LocalizedText[];
  terms: { name: LocalizedText; meaning: LocalizedText }[];
  explanationPrompt: LocalizedText;
  transfer: Question;
  recall: Question[];
  blocks: Record<string, LocalizedText>;
  sources: { title: string; url: string; note: LocalizedText }[];
  hero: string;
  assetIds: string[];
  icon: string;
  minutes: number;
};
const markdown = import.meta.glob('../../../content/lessons/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
/** Explicit markers keep editable Markdown separate from executable activities. */
export function parseLessonMarkdown(raw: string) {
  const id = raw.match(/^id: (GEO-\d{3})$/m)?.[1];
  if (!id) throw new Error('Lesson Markdown is missing a stable ID');
  const blocks: Record<string, LocalizedText> = {};
  for (const match of raw.matchAll(
    /<!-- section:([\w-]+) -->\s*<!-- zh -->\s*([\s\S]*?)<!-- en -->\s*([\s\S]*?)(?=<!-- section:|$)/g,
  )) {
    blocks[match[1]!] = t(match[2]!.trim(), match[3]!.trim());
  }
  for (const required of [
    'hook',
    'story-1',
    'story-2',
    'story-3',
    'misconception',
    'mission',
    'parent',
    'door',
  ]) {
    if (!blocks[required]?.zh || !blocks[required]?.en)
      throw new Error(`${id}: missing bilingual ${required}`);
  }
  return { id, blocks };
}
const parsed = Object.values(markdown).map(parseLessonMarkdown);
export const lessons: Lesson[] = activityData.map((data) => {
  const source = parsed.find((l) => l.id === data.id);
  if (!source) throw new Error(`Missing Markdown: ${data.id}`);
  const stage = curriculum.find((s) =>
    s.lessons.some((l) => l.id === data.id && l.status === 'available'),
  );
  if (!stage)
    throw new Error(`Lesson is not published in curriculum: ${data.id}`);
  for (const id of new Set([data.hero, ...data.assetIds])) {
    if (!assets.find((a) => a.id === id)?.publishable)
      throw new Error(`Uncleared asset ${id}: ${data.id}`);
  }
  return { ...data, stage: stage.id, blocks: source.blocks };
});
export const publishedIds = new Set(lessons.map((l) => l.id));
export const lessonById = (id: string | undefined) =>
  lessons.find((lesson) => lesson.id === id);
