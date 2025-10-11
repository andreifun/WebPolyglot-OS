// Export all types
export type { Translations, Language, I18nConfig, I18nContextType } from './types';

// Export the main components and hooks
export { I18nProvider, useTranslation } from './context';

// Export utility functions
export { 
  getNestedTranslation, 
  getBrowserLanguage, 
  getStoredLanguage, 
  saveLanguage 
} from './utils';

// Export location detection utilities
export { 
  getLocationBasedLanguages, 
  getTimezoneBasedLanguages, 
  getBrowserLanguageWithFallback 
} from './location-detection';

// Export language utilities
export { 
  getLanguageByCode, 
  getLanguagesByCountry, 
  searchLanguages, 
  getPopularLanguages 
} from './languages';

export type { LanguageInfo } from './languages';

// Export the provider props type
export type { I18nProviderProps } from './context';
