import express from 'express';
import { curriculumMetadata, loadCurriculum } from './content.js';

export function createApp() {
  const app = express();

  app.get('/api/curriculum', (_request, response, next) => {
    try {
      response.json(curriculumMetadata(loadCurriculum()));
    } catch (error) { next(error); }
  });

  app.get('/api/lessons/:lessonId', (request, response, next) => {
    try {
      const lesson = loadCurriculum().lessons.find((item) => item.id === request.params.lessonId);
      if (!lesson) return response.status(404).json({ error: '没有找到这节课。' });
      return response.json(lesson);
    } catch (error) { return next(error); }
  });

  return app;
}
