import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculumMetadata, loadCurriculum } from './content.js';

test('the roadmap stays distinct from published lessons', () => {
  const content = loadCurriculum();
  const metadata = curriculumMetadata(content);
  const roadmapCourses = metadata.roadmap.flatMap((level) => level.courses);
  const roadmapLessons = roadmapCourses.flatMap((course) => course.lessons);
  const publishedLessons = metadata.courses.flatMap((course) => course.lessons);

  assert.equal(metadata.roadmap.length, 4);
  assert.equal(roadmapCourses.length, 25);
  assert.equal(roadmapLessons.length, 160);
  assert.equal(publishedLessons.length, 160);
  assert.equal(roadmapLessons.filter((lesson) => lesson.published).length, publishedLessons.length);
  assert.equal(new Set(roadmapLessons.map((lesson) => lesson.id)).size, roadmapLessons.length);
  assert.equal(new Set(publishedLessons.map((lesson) => lesson.id)).size, publishedLessons.length);
  assert.ok(roadmapCourses.every((course) => course.publishedCount === course.lessons.length));
  assert.ok(roadmapCourses.filter((course) => course.level === 1).every((course) => course.publishedCount === 8));
  assert.equal(roadmapCourses.find((course) => course.id === 'ancient-greek-philosophy').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'classical-asian-philosophy').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'medieval-philosophy').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'early-modern-philosophy').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'enlightenment-nineteenth-century').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'twentieth-century-traditions').publishedCount, 8);
  assert.equal(roadmapCourses.find((course) => course.id === 'epistemology').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'metaphysics').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'ethics').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'political-philosophy').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'philosophy-of-mind').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'philosophy-of-science').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'philosophy-of-language').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'philosophy-of-religion').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'aesthetics').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'comparative-social-philosophy').publishedCount, 6);
  assert.equal(roadmapCourses.find((course) => course.id === 'free-will-seminar').publishedCount, 4);
  assert.equal(roadmapCourses.find((course) => course.id === 'consciousness-seminar').publishedCount, 4);
  assert.equal(roadmapCourses.find((course) => course.id === 'meaning-and-death-seminar').publishedCount, 4);
  assert.equal(roadmapCourses.find((course) => course.id === 'technology-ai-seminar').publishedCount, 4);
  assert.equal(roadmapCourses.find((course) => course.id === 'capstone').publishedCount, 4);
  assert.ok(metadata.courses.every((course) => typeof course.body === 'string' && course.body.length > 20));
  assert.ok(publishedLessons.every((lesson) => !Object.hasOwn(lesson, 'body') && !Object.hasOwn(lesson, 'questions')));
});

test('published courses and lessons follow the syllabus order', () => {
  const content = loadCurriculum();
  const metadata = curriculumMetadata(content);
  const roadmapCourses = new Map(metadata.roadmap.flatMap((level) => level.courses.map((course) => [course.id, course])));
  for (const course of metadata.courses) {
    const planned = roadmapCourses.get(course.id);
    assert.ok(planned);
    assert.equal(course.level, planned.level);
    assert.equal(course.order, planned.order);
    assert.equal(course.lessons.length, planned.publishedCount);
    assert.deepEqual(course.lessons.map((lesson) => lesson.order), course.lessons.map((_, index) => index + 1));
    assert.ok(course.lessons.every((lesson) => lesson.questions === undefined && lesson.questionCount >= 3 && lesson.questionCount <= 5));
  }
});
