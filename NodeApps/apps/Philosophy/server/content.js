import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { levels, syllabusCourses } from './syllabus.js';

export const defaultContentDirectory = fileURLToPath(new URL('../content/', import.meta.url));
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && entry.name.endsWith('.md') ? [filename] : [];
  }).sort();
}

function requiredText(value, field, filename) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${filename}: 缺少 ${field}`);
  return value.trim();
}

function requiredOrder(value, field, filename) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${filename}: ${field} 必须是正整数`);
  return value;
}

export function loadCurriculum(directory = defaultContentDirectory) {
  const courses = [];
  const lessons = [];
  const ids = new Set();

  for (const filename of markdownFiles(directory)) {
    const { data, content } = matter(fs.readFileSync(filename, 'utf8'));
    const relative = path.relative(directory, filename).replaceAll('\\', '/');
    const id = requiredText(data.id, 'id', relative);
    if (!idPattern.test(id)) throw new Error(`${relative}: 无效 ID ${id}`);
    if (ids.has(id)) throw new Error(`${relative}: 重复 ID ${id}`);
    ids.add(id);
    const title = requiredText(data.title, 'title', relative);
    const order = requiredOrder(data.order, 'order', relative);
    if (!content.trim()) throw new Error(`${relative}: 正文不能为空`);

    if (path.basename(filename) === 'course.md') {
      courses.push({
        id, title, order,
        titleEn: typeof data.titleEn === 'string' ? data.titleEn : '',
        level: requiredOrder(data.level, 'level', relative),
        description: requiredText(data.description, 'description', relative),
        body: content.trim(),
      });
      continue;
    }

    const courseId = requiredText(data.course, 'course', relative);
    const questions = Array.isArray(data.questions) ? data.questions : [];
    if (questions.length < 3 || questions.length > 5) throw new Error(`${relative}: 每节课需要 3–5 道问题`);
    const questionIds = new Set();
    for (const question of questions) {
      const questionId = requiredText(question?.id, 'question.id', relative);
      if (!idPattern.test(questionId)) throw new Error(`${relative}: 无效题目 ID ${questionId}`);
      if (questionIds.has(questionId)) throw new Error(`${relative}: 重复题目 ID ${questionId}`);
      questionIds.add(questionId);
      requiredText(question.prompt, 'question.prompt', relative);
      requiredText(question.guidance, 'question.guidance', relative);
    }
    lessons.push({
      id, courseId, title, order,
      subtitle: typeof data.subtitle === 'string' ? data.subtitle : '',
      estimatedMinutes: requiredOrder(data.estimatedMinutes, 'estimatedMinutes', relative),
      tags: Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === 'string') : [],
      questions,
      body: content.trim(),
    });
  }

  const courseIds = new Set(courses.map((course) => course.id));
  const positions = new Set();
  for (const lesson of lessons) {
    if (!courseIds.has(lesson.courseId)) throw new Error(`${lesson.id}: 未知课程 ${lesson.courseId}`);
    const position = `${lesson.courseId}:${lesson.order}`;
    if (positions.has(position)) throw new Error(`${lesson.id}: 课程内顺序重复 ${position}`);
    positions.add(position);
  }
  const coursePositions = new Set();
  for (const course of courses) {
    const position = `${course.level}:${course.order}`;
    if (coursePositions.has(position)) throw new Error(`${course.id}: 课程顺序重复 ${position}`);
    coursePositions.add(position);
  }

  courses.sort((a, b) => a.level - b.level || a.order - b.order);
  lessons.sort((a, b) => a.order - b.order);
  validateSyllabus(courses, lessons);
  return { courses, lessons };
}

function validateSyllabus(courses, lessons) {
  const courseIds = new Set();
  const lessonIds = new Set();
  const positions = new Set();
  for (const course of syllabusCourses) {
    if (courseIds.has(course.id)) throw new Error(`课程路线图重复 ID: ${course.id}`);
    courseIds.add(course.id);
    const position = `${course.level}:${course.order}`;
    if (positions.has(position)) throw new Error(`课程路线图顺序重复: ${position}`);
    positions.add(position);
    if (!levels.some((level) => level.id === course.level)) throw new Error(`课程路线图未知阶段: ${course.id}`);
    for (const lesson of course.lessons) {
      if (lessonIds.has(lesson.id)) throw new Error(`课程路线图重复课次 ID: ${lesson.id}`);
      lessonIds.add(lesson.id);
    }
  }
  const syllabusCourse = new Map(syllabusCourses.map((course) => [course.id, course]));
  const syllabusLesson = new Map(syllabusCourses.flatMap((course) => course.lessons.map((lesson) => [lesson.id, { ...lesson, courseId: course.id }])));
  for (const course of courses) {
    const planned = syllabusCourse.get(course.id);
    if (!planned || planned.level !== course.level || planned.order !== course.order || planned.title !== course.title) {
      throw new Error(`${course.id}: 已发布课程与路线图不一致`);
    }
  }
  for (const lesson of lessons) {
    const planned = syllabusLesson.get(lesson.id);
    if (!planned || planned.courseId !== lesson.courseId || planned.order !== lesson.order || planned.title !== lesson.title) {
      throw new Error(`${lesson.id}: 已发布课次与路线图不一致`);
    }
  }
}

export function curriculumMetadata(content) {
  const publishedIds = new Set(content.lessons.map((lesson) => lesson.id));
  return {
    courses: content.courses.map((course) => ({
      ...course,
      lessons: content.lessons.filter((lesson) => lesson.courseId === course.id).map(({ body: _body, questions, ...lesson }) => ({ ...lesson, questionCount: questions.length })),
    })),
    roadmap: levels.map((level) => ({
      ...level,
      courses: syllabusCourses.filter((course) => course.level === level.id).map((course) => ({
        ...course,
        publishedCount: course.lessons.filter((lesson) => publishedIds.has(lesson.id)).length,
        lessons: course.lessons.map((lesson) => ({ ...lesson, published: publishedIds.has(lesson.id) })),
      })),
    })),
  };
}
