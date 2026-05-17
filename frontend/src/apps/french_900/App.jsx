import "./styles.css";

import { NineHundredApp } from "../../shared/NineHundredApp";
import { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts } from "./services/api";

const api = { deleteGroup, fetchGroup, fetchGroups, importGroup, requestTts };

const config = {
  appName: "French 900",
  prefix: "f900",
  storageKey: "french-900:last-group",
  brandSubtitle: "Français parlé · français-espagnol",
  defaultLevel: "A1–C1",
  sidebarFoot: "Édité avec soin pour préparer un séjour d'études et la vie quotidienne en France.",
  sentenceNumberPad: 3,
  dataTools: {
    appName: "French 900",
    fields: ["french", "spanish"],
    example: {
      french: "Je cherche une chambre près de l'université.",
      spanish: "Estoy buscando una habitación cerca de la universidad.",
    },
  },
  modeButtonClasses: {
    all: "is-mode-all",
    french: "is-mode-fr",
  },
  primaryMode: {
    id: "french",
    steps: [{ field: "french", language: "fr", keySuffix: "fr" }],
  },
  allMode: {
    id: "all",
    steps: [
      { field: "french", language: "fr", keySuffix: "all" },
      { field: "spanish", language: "es", keySuffix: "es" },
    ],
  },
  sentenceFields: [
    { key: "french", className: "f900-french", lang: "fr" },
    { key: "spanish", className: "f900-spanish", lang: "es" },
  ],
  text: {
    allButton: "Tout écouter",
    allSentenceTitle: "Écouter français puis espagnol",
    audioPlaying: "Lecture en cours…",
    fallbackDescription: "900 phrases utiles pour vivre, étudier et débattre en français.",
    groupLabel: "Groupe",
    groupNavLabel: "Groupes French 900",
    groupOf: "sur",
    groupUnitPlural: "groupes",
    heroKicker: "Apprentissage progressif · écoute mains libres",
    listLabel: "Phrases du groupe",
    levelPrefix: "Niveau ",
    loadingGroups: "Chargement des groupes",
    loadingSentences: "Chargement des phrases…",
    playbackError: "La lecture a échoué.",
    playingAll: "Lecture français puis espagnol",
    playingGroupAll: "Lecture bilingue du groupe complet",
    playingGroupPrimary: "Lecture du groupe en français",
    playingPrimary: "Lecture du français",
    playingQueue: "Lecture en cours",
    preparingAudio: "Préparation de l'audio…",
    primaryButton: "Écouter le groupe",
    primarySentenceTitle: "Écouter le français",
    ready: "Prêt à pratiquer",
    searchPlaceholder: "Rechercher en français, en espagnol ou par thème",
    sentenceUnitPlural: "phrases",
    shownLabel: "affichées",
    stopTitle: "Arrêter la lecture",
  },
};

export default function French900App() {
  return <NineHundredApp api={api} config={config} />;
}
