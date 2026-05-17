import "./styles.css";

import { VocabApp } from "../../shared/VocabApp";
import { fetchGroup, fetchLevel, fetchLevels, requestTts } from "./services/api";

const api = { fetchLevels, fetchLevel, fetchGroup, requestTts };

const config = {
  appName: "Esp Vocab",
  prefix: "esv",
  storageKey: "esp-vocab:last",
  brandSubtitle: "Vocabulario español · A1 → C2",
  heroKicker: "Escucha, repite, interioriza",
  targetLang: "es",
  text: {
    brandSubtitle: "Vocabulario español · A1 → C2",
    lemmaButton: "Solo palabras",
    primaryButton: "Reproducir solo en español",
    allButton: "Reproducir español + inglés",
    primarySentenceTitle: "Escuchar la palabra",
    allSentenceTitle: "Escuchar palabra + traducción + ejemplo",
    markLearnedTitle: "Marcar como aprendida y omitir en la reproducción",
    restoreWordTitle: "Restaurar a la reproducción",
    learnedBadge: "Aprendida",
    learnedSkippedLabel: "aprendidas omitidas",
    playSectionLemma: "Leer solo palabras",
    playSectionTarget: "Leer toda la sección",
    playSectionAll: "Leer sección con traducción",
    stopTitle: "Detener la lectura",
    searchPlaceholder: "Buscar lema, traducción, etiqueta…",
    ready: "Listo para estudiar",
    preparingAudio: "Preparando audio…",
    audioPlaying: "Reproduciendo…",
    loadingLevels: "Cargando niveles…",
    loadingGroup: "Cargando palabras…",
    shownLabel: "mostradas",
    groupLabel: "Grupo",
    groupOf: "de",
    groupsUnit: "grupos",
    wordsUnit: "palabras",
    fallbackDescription: "Elige un nivel, luego un grupo, y practica cada palabra con audio.",
    noWords: "Aún no hay palabras en este grupo. Añade más archivos JSON en backend/data/EspVocab/levels/.",
    posLabel: {
      noun: "Sustantivos",
      verb: "Verbos",
      adj: "Adjetivos",
      adv: "Adverbios",
      phrase: "Frases",
      other: "Otros",
    },
    posPlural: {
      noun: "sustantivos",
      verb: "verbos",
      adj: "adjetivos",
      adv: "adverbios",
      phrase: "frases",
      other: "elementos",
    },
    examplePrefix: "ej.",
    playbackError: "Error de reproducción.",
  },
};

export default function EspVocabApp() {
  return <VocabApp api={api} config={config} />;
}
