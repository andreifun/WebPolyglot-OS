// Define the structure of your translations
export interface Translations {
  [key: string]: string | Translations;
}

// Available languages - can be extended
export type Language = 'en' | 'es' | 'fr' | string;

// Configuration options for the I18n provider
export interface I18nConfig {
  defaultLanguage?: Language;
  storageKey?: string;
  fallbackLanguage?: Language;
}

// Context type for the I18n provider
export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}
