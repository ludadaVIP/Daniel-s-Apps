import { createNineHundredApi } from "../../../shared/nineHundredApi";

export const { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } =
  createNineHundredApi("/api/french-900");
