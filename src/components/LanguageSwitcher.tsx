"use client";

import { useLocale, type Locale } from "@/i18n";
import { GlobeHemisphereWest } from "@phosphor-icons/react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggle = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
      style={{ minHeight: 44 }}
      title={locale === "es" ? "Switch to English" : "Cambiar a Español"}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <GlobeHemisphereWest size={18} />
      <span
        className="uppercase font-semibold tracking-wider"
        style={{ fontSize: 11 }}
      >
        {locale === "es" ? "EN" : "ES"}
      </span>
    </button>
  );
}
