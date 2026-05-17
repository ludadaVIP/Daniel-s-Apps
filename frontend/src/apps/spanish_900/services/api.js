import { createNineHundredApi } from "../../../shared/nineHundredApi";

export const { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } =
  createNineHundredApi("/api/spanish-900");
