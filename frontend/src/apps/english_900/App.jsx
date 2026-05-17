import "./styles.css";

import { NineHundredApp } from "../../shared/NineHundredApp";
import { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } from "./services/api";

const api = { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts };

const config = {
  appName: "English 900",
  prefix: "e900",
  storageKey: "english-900:last-group",
  brandSubtitle: "英中口语训练",
  defaultLevel: "A1-B2",
  dataTools: {
    appName: "English 900",
    fields: ["english", "chinese"],
    example: {
      english: "I was wondering whether I could join your study group.",
      chinese: "我想问一下我能不能加入你们的学习小组。",
    },
  },
  primaryMode: {
    id: "english",
    steps: [{ field: "english", language: "en", keySuffix: "en" }],
  },
  allMode: {
    id: "all",
    steps: [
      { field: "english", language: "en", keySuffix: "all" },
      { field: "chinese", language: "zh", keySuffix: "zh" },
    ],
  },
  sentenceFields: [
    { key: "english", className: "e900-english", lang: "en" },
    { key: "chinese", className: "e900-chinese", lang: "zh" },
  ],
  text: {
    allButton: "Play All",
    allSentenceTitle: "Play English and Chinese",
    audioPlaying: "Audio playing",
    fallbackDescription: "900 practical sentences for real life and study abroad.",
    groupLabel: "Group",
    groupNavLabel: "English 900 groups",
    groupOf: "of",
    groupUnitPlural: "groups",
    heroKicker: "Progressive speaking and listening",
    listLabel: "English 900 sentences",
    loadingGroups: "Loading groups",
    loadingSentences: "Loading sentences",
    playbackError: "Playback failed.",
    playingAll: "Playing English + Chinese",
    playingGroupAll: "Playing full bilingual group",
    playingGroupPrimary: "Playing group in English",
    playingPrimary: "Playing English",
    playingQueue: "Playing queue",
    preparingAudio: "Preparing audio",
    primaryButton: "Play English",
    primarySentenceTitle: "Play English",
    ready: "Ready to practice",
    searchPlaceholder: "Search English, Chinese, or tag",
    sentenceUnitPlural: "sentences",
    shownLabel: "shown",
    stopTitle: "Stop audio",
  },
};

export default function English900App() {
  return <NineHundredApp api={api} config={config} />;
}
