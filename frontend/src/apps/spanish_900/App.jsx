import "./styles.css";

import { createNineHundredApp } from "../../shared/createNineHundredApp";

export default createNineHundredApp({
  appName: "Spanish 900",
  prefix: "s900",
  apiBase: "/api/spanish-900",
  uiLocale: "en",
  brandSubtitle: "Speaking course",
  defaultLevel: "A1-B2",
  primary: { field: "spanish", lang: "es", name: "Spanish" },
  secondary: [{ field: "english", lang: "en", name: "English" }],
  example: {
    spanish: "No sabía que la biblioteca cerraba tan temprano.",
    english: "I didn't know the library closed so early.",
  },
});
