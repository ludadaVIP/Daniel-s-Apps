import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type Question = {
  prompt: LocalizedText;
  options: LocalizedText[];
  correct: number;
  explanation: LocalizedText;
};
export type Lesson = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  minutes: number;
  stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  unit: 'curiosity' | 'measurement' | 'patterns' | 'mysteries' | 'motion';
  kind:
    | 'friction'
    | 'variables'
    | 'observation'
    | 'length'
    | 'speed'
    | 'quantities'
    | 'units'
    | 'time'
    | 'mass'
    | 'temperature'
    | 'data'
    | 'graph'
    | 'floating'
    | 'boats'
    | 'bounce'
    | 'echo'
    | 'mirror'
    | 'static'
    | 'seatbelt'
    | 'fair-test'
    | 'volume'
    | 'accuracy'
    | 'repeats'
    | 'paper';
  hook: LocalizedText;
  prediction: LocalizedText;
  predictions: LocalizedText[];
  explore: LocalizedText;
  concept: LocalizedText;
  example: LocalizedText;
  misconception: LocalizedText;
  realWorld: LocalizedText;
  summary: LocalizedText;
  homeExperiment: LocalizedText;
  vocabulary: LocalizedText[];
  formula?: LocalizedText;
  questions: Question[];
  exit: Question;
};
export const q = (
  zh: string,
  en: string,
  options: [string, string][],
  correct: number,
  explanationZh: string,
  explanationEn: string,
): Question => ({
  prompt: t(zh, en),
  options: options.map(([a, b]) => t(a, b)),
  correct,
  explanation: t(explanationZh, explanationEn),
});
