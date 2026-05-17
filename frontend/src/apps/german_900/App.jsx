import "./styles.css";

import { NineHundredApp } from "../../shared/NineHundredApp";
import { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } from "./services/api";

const api = { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts };

const config = {
  appName: "German 900",
  prefix: "g900",
  storageKey: "german-900:last-group",
  brandSubtitle: "Deutsch sprechen · DE / FR / ES",
  defaultLevel: "A1–C1",
  sidebarFoot: "Sorgfältig erstellt, um ein Studium und das Alltagsleben in Deutschland vorzubereiten.",
  sentenceNumberPad: 3,
  dataTools: {
    appName: "German 900",
    fields: ["german", "french", "spanish"],
    example: {
      german: "Ich würde gern wissen, ob der Kurs noch Plätze frei hat.",
      french: "J'aimerais savoir s'il reste des places dans ce cours.",
      spanish: "Me gustaría saber si todavía quedan plazas en este curso.",
    },
  },
  modeButtonClasses: {
    all: "is-mode-all",
    german: "is-mode-de",
  },
  primaryMode: {
    id: "german",
    steps: [{ field: "german", language: "de", keySuffix: "de" }],
  },
  allMode: {
    id: "all",
    steps: [
      { field: "german", language: "de", keySuffix: "all" },
      { field: "french", language: "fr", keySuffix: "fr" },
      { field: "spanish", language: "es", keySuffix: "es" },
    ],
  },
  sentenceFields: [
    { key: "german", className: "g900-german", lang: "de" },
    { key: "french", className: "g900-french", lang: "fr" },
    { key: "spanish", className: "g900-spanish", lang: "es" },
  ],
  text: {
    allButton: "Alles anhören",
    allSentenceTitle: "Deutsch, dann Französisch und Spanisch anhören",
    audioPlaying: "Wiedergabe läuft …",
    fallbackDescription: "900 nützliche Sätze, um in Deutschland zu leben, zu studieren und zu diskutieren.",
    groupLabel: "Gruppe",
    groupNavLabel: "German 900 Gruppen",
    groupOf: "von",
    groupUnitPlural: "Gruppen",
    heroKicker: "Progressives Lernen · freihändiges Zuhören",
    listLabel: "Sätze der Gruppe",
    levelPrefix: "Niveau ",
    loadingGroups: "Gruppen werden geladen",
    loadingSentences: "Sätze werden geladen …",
    playbackError: "Wiedergabe fehlgeschlagen.",
    playingAll: "Deutsch, dann Französisch und Spanisch",
    playingGroupAll: "Dreisprachige Gruppe wird gelesen",
    playingGroupPrimary: "Ganze Gruppe auf Deutsch",
    playingPrimary: "Deutsch wird gelesen",
    playingQueue: "Wiedergabe läuft",
    preparingAudio: "Audio wird vorbereitet …",
    primaryButton: "Gruppe anhören",
    primarySentenceTitle: "Deutsch anhören",
    ready: "Bereit zum Üben",
    searchPlaceholder: "Suchen auf Deutsch, Französisch, Spanisch oder nach Thema",
    sentenceUnitPlural: "Sätze",
    shownLabel: "angezeigt",
    stopTitle: "Wiedergabe stoppen",
  },
};

export default function German900App() {
  return <NineHundredApp api={api} config={config} />;
}
