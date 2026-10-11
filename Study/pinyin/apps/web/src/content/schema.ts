export type ExerciseType =
  | 'audio_to_pinyin'
  | 'pinyin_to_audio'
  | 'assemble_syllable'
  | 'contrast_pairs'
  | 'read_aloud'
  | 'type_pinyin'
  | 'type_hanzi_ime';
export type ErrorTag =
  | 'initial_confusion'
  | 'final_confusion'
  | 'tone_error'
  | 'front_back_nasal'
  | 'spelling_rule'
  | 'syllable_boundary'
  | 'ime_candidate'
  | 'typo'
  | 'reading_decode';
export type Phase = 'review' | 'guided' | 'challenge';
export interface Word {
  id: string;
  hanzi: string;
  pinyinMarked: string;
  pinyinPlain: string;
  audio: string;
  final?: string;
  introducedIn?: number;
}
export interface Option {
  label: string;
  value: string;
  wordId?: string;
}
export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  phase: Phase;
  prompt: string;
  wordId?: string;
  display?: string;
  options?: Option[];
  acceptedAnswers: string[];
  parts?: { initial: string[]; final: string[]; tone: string[] };
  skillIds: string[];
  errorTag: ErrorTag;
  feedback: string;
  wordIds?: string[];
  readingTotal?: number;
  transfer?: boolean;
  initialText?: string;
  minAccuracy?: number;
  freeWriting?: { minChars: number; maxChars: number; topic: string };
}
export interface Lesson {
  id: string;
  number: number;
  week: number;
  title: string;
  subtitle: string;
  minutes: number;
  available: boolean;
  wordIds: string[];
  skills: string[];
  prerequisites?: string[];
  assessmentId?: string;
}
export interface Skill {
  id: string;
  label: string;
  dimension: 'reading' | 'typing';
  introducedIn?: number;
}
export interface AssessmentGroup {
  id: string;
  label: string;
  questionIds: string[];
  minCorrect?: number;
  minAccuracy?: number;
}
export interface Assessment {
  id: string;
  title: string;
  description: string;
  minutes: number;
  afterLesson?: number;
  questionIds: string[];
  groups: AssessmentGroup[];
}
export const typeLabels: Record<ExerciseType, string> = {
  audio_to_pinyin: '听音辨认',
  pinyin_to_audio: '拼音找读音',
  assemble_syllable: '拆开再拼',
  contrast_pairs: '易混音侦查',
  read_aloud: '独立朗读',
  type_pinyin: '字母输入',
  type_hanzi_ime: '真实中文输入',
};
export const errorLabels: Record<ErrorTag, string> = {
  initial_confusion: '声母辨认',
  final_confusion: '韵母辨认',
  tone_error: '声调',
  front_back_nasal: '前后鼻音',
  spelling_rule: '拼写规则',
  syllable_boundary: '音节边界',
  ime_candidate: '选词与汉字',
  typo: '键盘拼写',
  reading_decode: '拼音认读',
};
