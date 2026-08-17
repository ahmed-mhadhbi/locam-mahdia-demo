"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { copy, type Locale } from "../lib/i18n";

type FavoritesContextValue = {
  favorites: string[];
  toggleFavorite: (reference: string) => void;
  isFavorite: (reference: string) => boolean;
  hydrated: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof copy)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem("locam-favorites") || "[]");
      if (Array.isArray(stored)) setFavorites(stored.filter((item): item is string => typeof item === "string"));
      const storedLocale = window.localStorage.getItem("locam-locale");
      if (storedLocale === "fr" || storedLocale === "en" || storedLocale === "ar") setLocaleState(storedLocale);
    } catch {
      setFavorites([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("locam-favorites", JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const toggleFavorite = useCallback((reference: string) => {
    setFavorites((current) => current.includes(reference) ? current.filter((item) => item !== reference) : [...current, reference]);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("locam-locale", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  const favoritesValue = useMemo(() => ({
    favorites, toggleFavorite, isFavorite: (reference: string) => favorites.includes(reference), hydrated,
  }), [favorites, toggleFavorite, hydrated]);
  const localeValue = useMemo(() => ({ locale, setLocale, t: copy[locale] }), [locale, setLocale]);

  return <LocaleContext.Provider value={localeValue}><FavoritesContext.Provider value={favoritesValue}>{children}</FavoritesContext.Provider></LocaleContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used inside Providers");
  return value;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside Providers");
  return value;
}
