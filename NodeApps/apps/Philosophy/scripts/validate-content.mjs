import { curriculumMetadata, loadCurriculum } from '../server/content.js';

try {
  const { courses, lessons } = loadCurriculum();
  if (!courses.length || !lessons.length) throw new Error('至少需要一门课程和一节课。');
  const roadmap = curriculumMetadata({ courses, lessons }).roadmap;
  const plannedCourses = roadmap.flatMap((level) => level.courses);
  const plannedLessons = plannedCourses.flatMap((course) => course.lessons);
  if (plannedLessons.length < 120) throw new Error('课程路线图少于 120 节。');
  const levelByCourse = new Map(courses.map((course) => [course.id, course.level]));
  for (const lesson of lessons) {
    const minimumLength = levelByCourse.get(lesson.courseId) === 1 ? 1200 : 1800;
    if (lesson.body.length < minimumLength) throw new Error(`${lesson.id}: 课文不足 ${minimumLength} 字符，需完成实质写作后再发布`);
    if (!lesson.body.includes('## 你应记住')) throw new Error(`${lesson.id}: 缺少收束性的“你应记住”章节`);
  }
  console.log(`Philosophy 课程路线图：${roadmap.length} 阶段，${plannedCourses.length} 门课程，${plannedLessons.length} 节规划课。`);
  console.log(`已完成内容校验：${courses.length} 门课程，${lessons.length} 节可阅读课。`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
