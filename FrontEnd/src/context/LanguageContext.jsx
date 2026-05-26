import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => localStorage.getItem('lang') || 'en');

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('lang', nextLanguage);
  };

  const t = useMemo(() => {
    return (key) => translations[language]?.[key] || translations.en?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

