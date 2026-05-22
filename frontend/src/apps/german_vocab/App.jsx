import "./styles.css";

import { VocabApp } from "../../shared/VocabApp";
import { fetchGroup, fetchLevel, fetchLevels, requestTts } from "./services/api";

const api = { fetchLevels, fetchLevel, fetchGroup, requestTts };

const config = {
  appName: "German Vocab",
  prefix: "gv",
  storageKey: "german-vocab:last",
  brandSubtitle: "Vocabulario aleman · A1 -> C2",
  heroKicker: "Horen, wiederholen, behalten",
  targetLang: "de",
  translationLang: "es",
  translationField: "translation_es",
  exampleTransField: "example_es",
  text: {
    brandSubtitle: "Vocabulario aleman · A1 -> C2",
    lemmaButton: "Solo palabras",
    primaryButton: "Leer en aleman",
    allButton: "Leer aleman + espanol",
    primarySentenceTitle: "Escuchar la palabra",
    allSentenceTitle: "Escuchar palabra + traduccion + ejemplo",
    markLearnedTitle: "Marcar como aprendido y saltar en la lectura",
    restoreWordTitle: "Volver a incluir en la cola",
    learnedBadge: "Aprendido",
    learnedSkippedLabel: "aprendidos omitidos",
    progressItemLabel: "palabra",
    progressJumpLabel: "Ir a la palabra",
    progressPauseLabel: "Pausa",
    progressResumeLabel: "Continuar",
    progressStopLabel: "Detener",
    queueInterrupted: "Lectura detenida en la palabra",
    collapseSectionTitle: "Contraer seccion",
    expandSectionTitle: "Expandir seccion",
    playSectionLemma: "Leer solo palabras",
    playSectionTarget: "Leer toda la seccion",
    playSectionAll: "Leer seccion con espanol",
    stopTitle: "Detener lectura",
    searchPlaceholder: "Buscar palabra, traduccion o etiqueta...",
    ready: "Listo para estudiar",
    preparingAudio: "Preparando audio...",
    audioPlaying: "Reproduciendo...",
    loadingLevels: "Cargando niveles...",
    loadingGroup: "Cargando palabras...",
    shownLabel: "mostradas",
    groupLabel: "Grupo",
    groupOf: "de",
    groupsUnit: "grupos",
    wordsUnit: "palabras",
    fallbackDescription: "Elige un nivel y un grupo para practicar cada palabra con audio.",
    noWords: "Este grupo todavia no tiene palabras. Agrega mas JSON en backend/data/GermanVocab/levels/.",
    posLabel: {
      noun: "Sustantivos",
      verb: "Verbos",
      adj: "Adjetivos",
      adv: "Adverbios",
      phrase: "Expresiones",
      other: "Otros",
    },
    posPlural: {
      noun: "sustantivos",
      verb: "verbos",
      adj: "adjetivos",
      adv: "adverbios",
      phrase: "expresiones",
      other: "elementos",
    },
    examplePrefix: "ej.",
    playbackError: "No se pudo reproducir.",
  },
};

export default function GermanVocabApp() {
  return <VocabApp api={api} config={config} />;
}
