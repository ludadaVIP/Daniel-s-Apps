import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createQuestionLibraryApp } from '../../qanda-core/server/createQuestionLibraryApp.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const library = createQuestionLibraryApp({
  appName: 'Belief Q&A',
  questionsFile: path.join(here, '..', 'Questions.md'),
  answersDirectory: path.join(here, '..', 'answers'),
  categoryHeading: (_title, depth) => depth === 2,
  briefLength: { min: 1500, max: 2000 },
});

export const { app } = library;
export const initializeBeliefQA = library.initialize;
