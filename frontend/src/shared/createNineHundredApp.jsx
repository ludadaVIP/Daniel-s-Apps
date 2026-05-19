import { NineHundredApp } from "./NineHundredApp";
import { createNineHundredApi } from "./nineHundredApi";

// Locale-specific UI strings. Use template tokens that get filled in from each
// app's primary/secondary language descriptors.
const LOCALES = {
  en: {
    audioPlaying: "Audio playing",
    fallbackDescription: "900 practical sentences for real life and study abroad.",
    groupLabel: "Group",
    groupNavLabel: "{appName} groups",
    groupOf: "of",
    groupUnitPlural: "groups",
    heroKicker: "Progressive speaking and listening",
    listLabel: "{appName} sentences",
    loadingGroups: "Loading groups",
    loadingSentences: "Loading sentences",
    playbackError: "Playback failed.",
    preparingAudio: "Preparing audio",
    ready: "Ready to practice",
    sentenceUnitPlural: "sentences",
    shownLabel: "shown",
    stopTitle: "Stop audio",
    allButton: "Play All",
    allSentenceTitle: "Play {primary} and {secondaries}",
    primaryButton: "Play {primary}",
    primarySentenceTitle: "Play {primary}",
    playingPrimary: "Playing {primary}",
    playingAll: "Playing {primary} + {secondaries}",
    playingGroupPrimary: "Playing group in {primary}",
    playingGroupAll: "Playing full bilingual group",
    playingQueue: "Playing queue",
    searchPlaceholder: "Search {primary}, {secondaries}, or tag",
  },
  fr: {
    audioPlaying: "Lecture en cours…",
    fallbackDescription: "900 phrases utiles pour vivre, étudier et débattre en {primary}.",
    groupLabel: "Groupe",
    groupNavLabel: "Groupes {appName}",
    groupOf: "sur",
    groupUnitPlural: "groupes",
    heroKicker: "Apprentissage progressif · écoute mains libres",
    levelPrefix: "Niveau ",
    listLabel: "Phrases du groupe",
    loadingGroups: "Chargement des groupes",
    loadingSentences: "Chargement des phrases…",
    playbackError: "La lecture a échoué.",
    preparingAudio: "Préparation de l'audio…",
    ready: "Prêt à pratiquer",
    sentenceUnitPlural: "phrases",
    shownLabel: "affichées",
    stopTitle: "Arrêter la lecture",
    allButton: "Tout écouter",
    allSentenceTitle: "Écouter {primary} puis {secondaries}",
    primaryButton: "Écouter le groupe",
    primarySentenceTitle: "Écouter le {primary}",
    playingPrimary: "Lecture du {primary}",
    playingAll: "Lecture {primary} puis {secondaries}",
    playingGroupPrimary: "Lecture du groupe en {primary}",
    playingGroupAll: "Lecture bilingue du groupe complet",
    playingQueue: "Lecture en cours",
    searchPlaceholder: "Rechercher en {primary}, en {secondaries} ou par thème",
  },
  de: {
    audioPlaying: "Wiedergabe läuft …",
    fallbackDescription: "900 nützliche Sätze, um in {primary} zu leben, zu studieren und zu diskutieren.",
    groupLabel: "Gruppe",
    groupNavLabel: "{appName} Gruppen",
    groupOf: "von",
    groupUnitPlural: "Gruppen",
    heroKicker: "Progressives Lernen · freihändiges Zuhören",
    levelPrefix: "Niveau ",
    listLabel: "Sätze der Gruppe",
    loadingGroups: "Gruppen werden geladen",
    loadingSentences: "Sätze werden geladen …",
    playbackError: "Wiedergabe fehlgeschlagen.",
    preparingAudio: "Audio wird vorbereitet …",
    ready: "Bereit zum Üben",
    sentenceUnitPlural: "Sätze",
    shownLabel: "angezeigt",
    stopTitle: "Wiedergabe stoppen",
    allButton: "Alles anhören",
    allSentenceTitle: "{primary}, dann {secondaries} anhören",
    primaryButton: "Gruppe anhören",
    primarySentenceTitle: "{primary} anhören",
    playingPrimary: "{primary} wird gelesen",
    playingAll: "{primary}, dann {secondaries}",
    playingGroupPrimary: "Ganze Gruppe auf {primary}",
    playingGroupAll: "Dreisprachige Gruppe wird gelesen",
    playingQueue: "Wiedergabe läuft",
    searchPlaceholder: "Suchen auf {primary}, {secondaries} oder nach Thema",
  },
};

function fill(template, vars) {
  if (typeof template !== "string") return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? vars[key] : ""));
}

export function createNineHundredApp({
  appName,
  prefix,
  apiBase,
  storageKey,
  primary,
  secondary,
  uiLocale = "en",
  brandSubtitle,
  defaultLevel,
  example,
  sidebarFoot,
  sentenceNumberPad,
  textOverrides,
}) {
  const api = createNineHundredApi(apiBase);
  const locale = LOCALES[uiLocale] || LOCALES.en;
  const lastJoiners = { en: " and ", fr: " et ", de: " und " };
  const names = secondary.map((s) => s.name);
  const secondaries =
    names.length <= 1
      ? names.join("")
      : `${names.slice(0, -1).join(", ")}${lastJoiners[uiLocale] || ", "}${names[names.length - 1]}`;
  const vars = { appName, primary: primary.name, secondaries };

  const text = Object.fromEntries(
    Object.entries(locale).map(([key, value]) => [key, fill(value, vars)]),
  );
  if (textOverrides) Object.assign(text, textOverrides);

  const modeButtonClasses = {
    all: "is-mode-all",
    [primary.field]: `is-mode-${primary.lang}`,
  };

  const allModeSteps = [
    { field: primary.field, language: primary.lang, keySuffix: "all" },
    ...secondary.map((s) => ({ field: s.field, language: s.lang, keySuffix: s.lang })),
  ];

  const sentenceFields = [
    { key: primary.field, className: `${prefix}-${primary.field}`, lang: primary.lang },
    ...secondary.map((s) => ({ key: s.field, className: `${prefix}-${s.field}`, lang: s.lang })),
  ];

  const config = {
    appName,
    prefix,
    storageKey: storageKey || `${prefix}:last-group`,
    brandSubtitle,
    defaultLevel,
    sidebarFoot,
    sentenceNumberPad,
    dataTools: {
      appName,
      fields: [primary.field, ...secondary.map((s) => s.field)],
      example,
    },
    modeButtonClasses,
    primaryMode: {
      id: primary.field,
      steps: [{ field: primary.field, language: primary.lang, keySuffix: primary.lang }],
    },
    allMode: { id: "all", steps: allModeSteps },
    sentenceFields,
    text,
  };

  return function App() {
    return <NineHundredApp api={api} config={config} />;
  };
}
