import { getDirection, type Locale } from "@cloud-core/shared";
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { I18nManager } from "react-native";
import { copy } from "./copy";

interface LocaleState {
  locale: Locale;
  direction: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  t: Record<string, string>;
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>("he");

  const value = useMemo<LocaleState>(() => {
    const direction = getDirection(locale);
    return {
      locale,
      direction,
      t: copy[locale],
      setLocale(nextLocale) {
        I18nManager.allowRTL(nextLocale === "he");
        setLocaleState(nextLocale);
      },
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useCopy() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useCopy must be used inside LocaleProvider");
  }
  return context;
}
