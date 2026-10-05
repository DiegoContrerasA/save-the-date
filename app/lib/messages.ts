import en from "../messages/en.json";
import es from "../messages/es.json";

export type Lang = "en" | "es";
export type Messages = typeof es;

// `en` debe tener exactamente las mismas claves que `es`
const MESSAGES: Record<Lang, Messages> = { es, en };

export function getMessages(lang: Lang): Messages {
  return MESSAGES[lang];
}
