"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import es from "./es.json";
import en from "./en.json";

export type Locale = "es" | "en";

const messages: Record<Locale, Record<string, unknown>> = { es, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  setLocale: () => {},
  t: (key: string) => key,
});

/** Resolve nested keys like "landing.heroTitle" */
function resolve(obj: Record<string, unknown>, path: string): string {
  const result = path
    .split(".")
    .reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  return typeof result === "string" ? result : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    // Read from localStorage first, then fall back to browser language
    const stored = localStorage.getItem("ubex-locale");
    if (stored === "es" || stored === "en") {
      setLocaleState(stored);
      return;
    }
    // Check browser language
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "en") {
      setLocaleState("en");
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("ubex-locale", newLocale);
    // Also set cookie so server components / middleware can read it if needed
    document.cookie = `ubex-locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    // Update html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = resolve(messages[locale], key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  return useContext(I18nContext);
}

export { es, en };
