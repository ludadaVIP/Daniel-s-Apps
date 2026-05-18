import "./styles.css";

import { VocabApp } from "../../shared/VocabApp";
import { fetchGroup, fetchLevel, fetchLevels, requestTts } from "./services/api";

const api = { fetchLevels, fetchLevel, fetchGroup, requestTts };

const config = {
  appName: "Eng Vocab",
  prefix: "env",
  storageKey: "eng-vocab:last",
  brandSubtitle: "English vocabulary · A1 → C2",
  heroKicker: "Listen · repeat · use it tomorrow",
  targetLang: "en",
  translationField: "translation_zh",
  translationLang: "zh",
  exampleTransField: "example_zh",
  text: {
    brandSubtitle: "English vocabulary · A1 → C2",
    primaryButton: "只读英文",
    allButton: "英文 + 中文",
    primarySentenceTitle: "Play the word",
    allSentenceTitle: "Play word + Chinese + example",
    playSectionTarget: "Play this section",
    playSectionAll: "Play section with Chinese",
    stopTitle: "Stop playback",
    searchPlaceholder: "Search lemma, 中文释义, tag…",
    ready: "Ready to study",
    preparingAudio: "Preparing audio…",
    audioPlaying: "Playing…",
    loadingLevels: "Loading levels…",
    loadingGroup: "Loading words…",
    shownLabel: "shown",
    groupLabel: "Group",
    groupOf: "of",
    groupsUnit: "groups",
    wordsUnit: "words",
    fallbackDescription: "Pick a CEFR level, choose a group, then practise each word with sound.",
    noWords: "This group has no words yet — drop more JSON files into backend/data/EngVocab/levels/.",
    posLabel: {
      noun: "Nouns",
      verb: "Verbs",
      adj: "Adjectives",
      adv: "Adverbs",
      phrase: "Phrases",
      other: "Other",
    },
    posPlural: {
      noun: "nouns",
      verb: "verbs",
      adj: "adjectives",
      adv: "adverbs",
      phrase: "phrases",
      other: "items",
    },
    examplePrefix: "e.g.",
    playbackError: "Playback failed.",
  },
};

export default function EngVocabApp() {
  return <VocabApp api={api} config={config} />;
}
