import { createFreeLanguageApi } from "../../../shared/freeLanguageApi";

export const {
  fetchLibrary,
  fetchLesson,
  createLevel,
  updateLevel,
  deleteLevel,
  createLesson,
  updateLesson,
  deleteLesson,
  requestTts,
} = createFreeLanguageApi("/api/free-english");
