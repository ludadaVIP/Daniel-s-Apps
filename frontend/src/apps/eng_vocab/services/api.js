import { createVocabApi } from "../../../shared/vocabApi";

export const { fetchLevels, fetchLevel, fetchGroup, requestTts } =
  createVocabApi("/api/eng-vocab");
