/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { STORAGE_KEYS } from '../utils/storageKeys';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
type TranslationValue = string | { [key: string]: TranslationValue };

const TRANSLATIONS: Record<Language, Record<string, TranslationValue>> = {
  fr,
  en,
};

function findTranslation(language: Language, keyPath: string): TranslationValue | undefined {
  return keyPath.split('.').reduce<TranslationValue | undefined>((current, key) => {
    if (!current || typeof current === 'string') return undefined;
    return current[key];
  }, TRANSLATIONS[language]);
}

function getBrowserLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.split('-')[0].toLowerCase();
    if (lang === 'en' || lang === 'fr') {
      return lang as Language;
    }
  }
  return 'fr';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    if (stored === 'en' || stored === 'fr') return stored as Language;
    return getBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const current = findTranslation(language, keyPath) ?? findTranslation('fr', keyPath);

      if (typeof current !== 'string') {
        return keyPath;
      }

      let text = current;
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
