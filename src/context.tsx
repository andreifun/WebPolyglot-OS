import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nContextType, I18nConfig, Language, Translations } from './types';
import { getNestedTranslation, getBrowserLanguage, getStoredLanguage, saveLanguage } from './utils';

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
export interface I18nProviderProps {
  children: React.ReactNode;
  translations: Record<Language, Translations>;
  config?: I18nConfig;
}

export function I18nProvider({ 
  children, 
  translations,
  config = {} 
}: I18nProviderProps) {
  const {
    defaultLanguage = 'en',
    storageKey = 'language',
    fallbackLanguage = 'en'
  } = config;

  const availableLanguages = Object.keys(translations) as Language[];
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Load language from localStorage or browser preference on mount
  useEffect(() => {
    const storedLanguage = getStoredLanguage(storageKey);
    
    if (storedLanguage && translations[storedLanguage]) {
      setLanguageState(storedLanguage);
    } else {
      const browserLang = getBrowserLanguage();
      if (translations[browserLang]) {
        setLanguageState(browserLang);
      } else if (translations[fallbackLanguage]) {
        setLanguageState(fallbackLanguage);
      }
    }
  }, [translations, storageKey, fallbackLanguage]);

  // Save language to localStorage when it changes
  useEffect(() => {
    saveLanguage(language, storageKey);
  }, [language, storageKey]);

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang);
    } else {
      console.warn(`Language "${lang}" is not available. Available languages: ${availableLanguages.join(', ')}`);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations[fallbackLanguage] || {};
    return getNestedTranslation(currentTranslations, key);
  };

  return (
    <I18nContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      availableLanguages 
    }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
