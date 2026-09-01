import FreeLanguageApp from "../../shared/FreeLanguageApp";
import * as api from "./services/api";

const config = {
  accent: "#6b4e16",
  brandMark: "ΚΓ",
  brandTitle: "Koine Greek",
  brandSubtitle: "New Testament Greek · small steps · every line audible",
  kicker: "Koine Greek / English",
  targetLanguage: { key: "grc", label: "Koine Greek" },
  supportLanguages: [{ key: "en", label: "English" }],
  ttsVoice: "el-GR-AthinaNeural",
  audioLabel: "Greek audio",
  audioNote: "Natural modern-Greek reference · use the Koine pronunciation key for historical sound.",
  defaultExpandedLevelIds: ["foundation"],
  emptyLessonSection: {
    id: "notes",
    title: "Notes",
    kind: "cards",
    items: [{ grc: "Χαίρε.", en: "Greetings." }],
  },
};

export default function KoineGreekApp() {
  return <FreeLanguageApp api={api} config={config} />;
}
