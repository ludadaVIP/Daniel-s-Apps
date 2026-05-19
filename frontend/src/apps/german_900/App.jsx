import "./styles.css";

import { createNineHundredApp } from "../../shared/createNineHundredApp";

export default createNineHundredApp({
  appName: "German 900",
  prefix: "g900",
  apiBase: "/api/german-900",
  uiLocale: "de",
  brandSubtitle: "Deutsch sprechen · DE / FR / ES",
  defaultLevel: "A1–C1",
  sidebarFoot: "Sorgfältig erstellt, um ein Studium und das Alltagsleben in Deutschland vorzubereiten.",
  sentenceNumberPad: 3,
  primary: { field: "german", lang: "de", name: "Deutsch" },
  secondary: [
    { field: "french", lang: "fr", name: "Französisch" },
    { field: "spanish", lang: "es", name: "Spanisch" },
  ],
  example: {
    german: "Ich würde gern wissen, ob der Kurs noch Plätze frei hat.",
    french: "J'aimerais savoir s'il reste des places dans ce cours.",
    spanish: "Me gustaría saber si todavía quedan plazas en este curso.",
  },
});
