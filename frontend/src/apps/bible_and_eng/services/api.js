// The Bible-and-<language> family shares a single HTTP layer in
// `frontend/src/shared/bibleLangApi.js`. We re-export from here so this
// app still follows the per-app `services/api.js` convention.

export { fetchConfig, fetchChapter, requestTtsAudio } from "../../../shared/bibleLangApi.js";
