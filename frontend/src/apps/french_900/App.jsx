import "./styles.css";

import { createNineHundredApp } from "../../shared/createNineHundredApp";

export default createNineHundredApp({
  appName: "French 900",
  prefix: "f900",
  apiBase: "/api/french-900",
  uiLocale: "fr",
  brandSubtitle: "Français parlé · français-espagnol",
  defaultLevel: "A1–C1",
  sidebarFoot: "Édité avec soin pour préparer un séjour d'études et la vie quotidienne en France.",
  sentenceNumberPad: 3,
  primary: { field: "french", lang: "fr", name: "français" },
  secondary: [{ field: "spanish", lang: "es", name: "espagnol" }],
  example: {
    french: "Je cherche une chambre près de l'université.",
    spanish: "Estoy buscando una habitación cerca de la universidad.",
  },
});
