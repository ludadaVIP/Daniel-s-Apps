import vocabulary from '../../../../curriculum/lexicon/vocabulary.json';
import skillData from '../../../../curriculum/lexicon/skills.json';
import roadmap from '../../../../curriculum/roadmap.json';
import assessmentCatalog from '../../../../curriculum/assessments/catalog.json';
import lab from '../../../../curriculum/exercises/lab.json';
import type { Assessment, Exercise, Lesson, Skill, Word } from './schema';

export const lessons = roadmap as Lesson[];
export const skills = skillData as Skill[];
export const words = Object.fromEntries(
  (vocabulary as Word[]).map((word) => [word.id, word]),
);
const exerciseFiles = import.meta.glob(
  '../../../../curriculum/exercises/lesson-*.json',
  { eager: true, import: 'default' },
) as Record<string, Exercise[]>;
export const exercises = Object.entries(exerciseFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([, questions]) => questions);
const assessmentFiles = import.meta.glob(
  '../../../../curriculum/assessments/A*.json',
  { eager: true, import: 'default' },
) as Record<string, Exercise[]>;
export const assessmentExercises = Object.values(assessmentFiles).flat();
export const assessments = assessmentCatalog as Assessment[];
export const labExercises = lab as Exercise[];
export const allExercises = [
  ...exercises,
  ...labExercises,
  ...assessmentExercises,
];
const markdown = import.meta.glob('../../../../curriculum/lessons/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
export function lessonMarkdown(number: number) {
  return (
    Object.entries(markdown).find(([path]) =>
      path.includes(`/${String(number).padStart(2, '0')}-`),
    )?.[1] ?? ''
  );
}
export const weeks = [
  {
    title: '发现声音规律',
    detail: '元音 · 声调 · 第一批声母',
    code: 'SOUND MAP',
  },
  {
    title: '认全声母',
    detail: '平翘舌 · 整体音节 · 初试键盘',
    code: 'INITIALS',
  },
  { title: '韵母升级', detail: '复韵母 · 前鼻音 · 后鼻音', code: 'FINALS' },
  { title: '真正会拼', detail: '组合 · 省略 · 标调 · 连读', code: 'DECODE' },
  { title: '用拼音打字', detail: '系统输入法 · 选词 · 句子', code: 'KEYBOARD' },
  { title: '独立使用', detail: '拼音密信 · 自由表达 · 毕业', code: 'MISSION' },
];
