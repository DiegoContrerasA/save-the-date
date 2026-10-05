"use client";

import { createContext, useContext, useEffect } from "react";
import { getMessages, type Lang, type Messages } from "./messages";

const MessagesContext = createContext<Messages>(getMessages("es"));

/** Entrega los textos del idioma del invitado a todos los componentes. */
export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <MessagesContext.Provider value={getMessages(lang)}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
