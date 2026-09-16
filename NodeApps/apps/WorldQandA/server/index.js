import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createQuestionLibraryApp } from '../../qanda-core/server/createQuestionLibraryApp.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const library = createQuestionLibraryApp({
  appName: 'WorldQ&A',
  questionsFile: path.join(here, '..', 'questions.md'),
  answersDirectory: path.join(here, '..', 'answers'),
  // The first H1 is the document title; every following numbered Chinese H1 is a category.
  categoryHeading: (title, depth) => depth === 1 && /^[一二三四五六七八九十百千万]+、/.test(title),
});

export const { app } = library;
export const initializeWorldQA = library.initialize;
