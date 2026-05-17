import "./styles.css";

import { NineHundredApp } from "../../shared/NineHundredApp";
import { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } from "./services/api";

const api = { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts };

const config = {
  appName: "Spanish 900",
  prefix: "s900",
  storageKey: "spanish-900:last-group",
  brandSubtitle: "Speaking course",
  defaultLevel: "A1-B2",
  dataTools: {
    appName: "Spanish 900",
    fields: ["spanish", "english"],
    example: {
      spanish: "No sabía que la biblioteca cerraba tan temprano.",
      english: "I didn't know the library closed so early.",
    },
  },
  primaryMode: {
    id: "spanish",
    steps: [{ field: "spanish", language: "es", keySuffix: "es" }],
  },
  allMode: {
    id: "all",
    steps: [
      { field: "spanish", language: "es", keySuffix: "all" },
      { field: "english", language: "en", keySuffix: "en" },
    ],
  },
  sentenceFields: [
    { key: "spanish", className: "s900-spanish", lang: "es" },
    { key: "english", className: "s900-english", lang: "en" },
  ],
  text: {
    allButton: "Play All",
    allSentenceTitle: "Play Spanish and English",
    audioPlaying: "Audio playing",
    fallbackDescription: "900 practical sentences for real life and study abroad.",
    groupLabel: "Group",
    groupNavLabel: "Spanish 900 groups",
    groupOf: "of",
    groupUnitPlural: "groups",
    heroKicker: "Progressive speaking and listening",
    listLabel: "Spanish 900 sentences",
    loadingGroups: "Loading groups",
    loadingSentences: "Loading sentences",
    playbackError: "Playback failed.",
    playingAll: "Playing Spanish + English",
    playingGroupAll: "Playing full bilingual group",
    playingGroupPrimary: "Playing group in Spanish",
    playingPrimary: "Playing Spanish",
    playingQueue: "Playing queue",
    preparingAudio: "Preparing audio",
    primaryButton: "Play Spanish",
    primarySentenceTitle: "Play Spanish",
    ready: "Ready to practice",
    searchPlaceholder: "Search Spanish, English, or tag",
    sentenceUnitPlural: "sentences",
    shownLabel: "shown",
    stopTitle: "Stop audio",
  },
};

export default function Spanish900App() {
  return <NineHundredApp api={api} config={config} />;
}
