import React, { createContext, useContext, useState, useEffect } from 'react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

export type Language = 'FR' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof fr;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'FR',
  setLanguage: () => {},
  t: fr,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('FR');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zcore_lang');
      if (saved === 'FR' || saved === 'EN') {
        setLanguageState(saved);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('zcore_lang', lang);
    } catch {
      // Ignore
    }
  };

  const t = language === 'FR' ? fr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
