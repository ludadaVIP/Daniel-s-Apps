import "./styles.css";

import { VocabApp } from "../../shared/VocabApp";
import { fetchGroup, fetchLevel, fetchLevels, requestTts } from "./services/api";

const api = { fetchLevels, fetchLevel, fetchGroup, requestTts };

const config = {
  appName: "French Vocab",
  prefix: "frv",
  storageKey: "french-vocab:last",
  brandSubtitle: "Vocabulaire français · A1 → C2",
  heroKicker: "Écoute, répète, retiens",
  targetLang: "fr",
  text: {
    brandSubtitle: "Vocabulaire français · A1 → C2",
    lemmaButton: "Mots seuls",
    primaryButton: "Lire en français",
    allButton: "Lire français + anglais",
    primarySentenceTitle: "Écouter le mot",
    allSentenceTitle: "Écouter mot + traduction + exemple",
    markLearnedTitle: "Marquer comme appris et ignorer en lecture",
    restoreWordTitle: "Remettre dans la file de lecture",
    learnedBadge: "Appris",
    learnedSkippedLabel: "appris ignorés",
    progressItemLabel: "mot",
    progressJumpLabel: "Aller au mot",
    progressPauseLabel: "Pause",
    progressResumeLabel: "Reprendre",
    progressStopLabel: "Arrêter",
    queueInterrupted: "Lecture arrêtée au mot",
    collapseSectionTitle: "Replier la section",
    expandSectionTitle: "Déplier la section",
    playSectionLemma: "Lire les mots seuls",
    playSectionTarget: "Lire toute la section",
    playSectionAll: "Lire la section avec anglais",
    stopTitle: "Arrêter la lecture",
    searchPlaceholder: "Chercher un mot, une traduction, une étiquette…",
    ready: "Prêt à étudier",
    preparingAudio: "Préparation de l'audio…",
    audioPlaying: "Lecture en cours…",
    loadingLevels: "Chargement des niveaux…",
    loadingGroup: "Chargement des mots…",
    shownLabel: "affichés",
    groupLabel: "Groupe",
    groupOf: "sur",
    groupsUnit: "groupes",
    wordsUnit: "mots",
    fallbackDescription: "Choisis un niveau, puis un groupe, et pratique chaque mot avec l'audio.",
    noWords: "Pas encore de mots dans ce groupe. Ajoute plus de fichiers JSON dans backend/data/FrenchVocab/levels/.",
    posLabel: {
      noun: "Noms",
      verb: "Verbes",
      adj: "Adjectifs",
      adv: "Adverbes",
      phrase: "Expressions",
      other: "Autres",
    },
    posPlural: {
      noun: "noms",
      verb: "verbes",
      adj: "adjectifs",
      adv: "adverbes",
      phrase: "expressions",
      other: "éléments",
    },
    examplePrefix: "ex.",
    playbackError: "Échec de la lecture.",
  },
};

export default function FrenchVocabApp() {
  return <VocabApp api={api} config={config} />;
}
