/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, any>> = {
  fr,
  en,
};

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
    const stored = localStorage.getItem('mijo-lang');
    if (stored === 'en' || stored === 'fr') return stored as Language;
    return getBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mijo-lang', lang);
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      let current: any = TRANSLATIONS[language];

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          // If translation is missing in the current language, fall back to 'fr'
          let fallback: any = TRANSLATIONS['fr'];
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              fallback = undefined;
              break;
            }
          }
          if (fallback !== undefined) {
            current = fallback;
            break;
          }
          return keyPath;
        }
      }

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
