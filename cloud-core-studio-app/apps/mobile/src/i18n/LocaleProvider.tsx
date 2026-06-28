import { getDirection, type Locale } from "@cloud-core/shared";
import { createContext, useContext, useMemo, useState, useEffect, type PropsWithChildren } from "react";
import { I18nManager } from "react-native";
import { copy } from "./copy";

interface LocaleState {
  locale: Locale;
  direction: "rtl" | "ltr";
  rowDirection: "row" | "row-reverse";
  textAlign: "left" | "right";
  setLocale: (locale: Locale) => void;
  t: Record<string, string>;
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>("he");

  useEffect(() => {
    try {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    } catch (e) {
      // Ignore native layout setting failures in non-native testing environments
    }
  }, []);

  const value = useMemo<LocaleState>(() => {
    const direction = getDirection(locale);
    const rowDirection = direction === "rtl" ? "row-reverse" : "row";
    const textAlign = direction === "rtl" ? "right" : "left";

    return {
      locale,
      direction,
      rowDirection,
      textAlign,
      t: copy[locale],
      setLocale(nextLocale) {
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

