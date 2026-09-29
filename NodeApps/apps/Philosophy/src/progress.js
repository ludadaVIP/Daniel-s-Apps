const STORAGE_KEY = 'nodeapps.philosophy.progress.v1';

export function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (value?.version === 1 && value.lessons && typeof value.lessons === 'object') return value;
  } catch { /* Start with an empty local record if storage is unavailable or invalid. */ }
  return { version: 1, lessons: {}, lastLessonId: null };
}

export function writeProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch { return false; }
}

export function updateLesson(progress, lessonId, patch) {
  const old = progress.lessons[lessonId] || { answers: {} };
  return {
    ...progress,
    lastLessonId: lessonId,
    lessons: { ...progress.lessons, [lessonId]: { ...old, ...patch } },
  };
}

export function updateArtifact(progress, courseId, patch) {
  const old = progress.artifacts?.[courseId] || { ratings: {} };
  return {
    ...progress,
    artifacts: { ...progress.artifacts, [courseId]: { ...old, ...patch } },
  };
}

export function courseProgress(course, progress) {
  const total = course.lessons.length;
  const completed = course.lessons.filter((lesson) => progress.lessons[lesson.id]?.completedAt).length;
  return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}

export function restoreProgress(value, courses) {
  if (value?.app !== 'nodeapps.philosophy' || value.version !== 1 || !value.lessons || typeof value.lessons !== 'object' || Array.isArray(value.lessons)) {
    throw new Error('这不是可识别的 Philosophy 学习档案。');
  }
  const lessonIds = new Set(courses.flatMap((course) => course.lessons.map((lesson) => lesson.id)));
  const courseIds = new Set(courses.map((course) => course.id));
  const lessons = {};
  for (const [id, entry] of Object.entries(value.lessons)) {
    if (!lessonIds.has(id) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const answers = {};
    if (entry.answers && typeof entry.answers === 'object' && !Array.isArray(entry.answers)) {
      for (const [questionId, answer] of Object.entries(entry.answers)) if (typeof answer === 'string') answers[questionId] = answer;
    }
    lessons[id] = {
      answers,
      openedAt: typeof entry.openedAt === 'string' ? entry.openedAt : null,
      lastOpenedAt: typeof entry.lastOpenedAt === 'string' ? entry.lastOpenedAt : null,
      completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : null,
      review: entry.review === true,
    };
  }
  const artifacts = {};
  if (value.artifacts && typeof value.artifacts === 'object' && !Array.isArray(value.artifacts)) {
    for (const [id, entry] of Object.entries(value.artifacts)) {
      if (!courseIds.has(id) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const ratings = {};
      if (entry.ratings && typeof entry.ratings === 'object' && !Array.isArray(entry.ratings)) {
        for (const [key, rating] of Object.entries(entry.ratings)) {
          if (['text', 'concept', 'argument', 'opponent', 'revision', 'sources'].includes(key) && /^[0-4]$/.test(String(rating))) ratings[key] = String(rating);
        }
      }
      artifacts[id] = Object.fromEntries(['reference', 'evidence', 'feedback', 'revision'].map((field) => [field, typeof entry[field] === 'string' ? entry[field] : '']));
      artifacts[id].ratings = ratings;
    }
  }
  return { version: 1, lessons, artifacts, lastLessonId: lessonIds.has(value.lastLessonId) ? value.lastLessonId : null };
}
