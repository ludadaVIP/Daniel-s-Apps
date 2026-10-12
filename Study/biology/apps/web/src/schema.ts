import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type Skill = 'concept' | 'reasoning' | 'vocabulary';
export type Question = {
  id: string;
  skill: Skill;
  prompt: LocalizedText;
  options: LocalizedText[];
  correct: number;
  feedback: LocalizedText;
  revisit: LocalizedText;
};
export type Lesson = {
  id: string;
  title: LocalizedText;
  hook: LocalizedText;
  minutes: number;
  icon: string;
  summary?: LocalizedText;
  reference?: { title: string; url: string };
  objectives: LocalizedText[];
  prediction: LocalizedText[];
  terms: { word: LocalizedText; meaning: LocalizedText }[];
  questions: Question[];
  mission: LocalizedText;
};
export const q = (
  id: string,
  skill: Skill,
  prompt: LocalizedText,
  options: LocalizedText[],
  correct: number,
  feedback: LocalizedText,
  revisit: LocalizedText,
): Question => ({ id, skill, prompt, options, correct, feedback, revisit });
export const term = (zh: string, en: string, a: string, b: string) => ({
  word: t(zh, en),
  meaning: t(a, b),
});
