import { Translations } from './types';

/**
 * Helper function to get nested translation
 * @param translations - The translations object
 * @param key - The dot-separated key path
 * @returns The translated string or the key if not found
 */
export function getNestedTranslation(translations: Translations, key: string): string {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof current === 'string' ? current : key;
}

/**
 * Get the browser's preferred language
 * @returns The browser language or 'en' as fallback
 */
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang || 'en';
}

/**
 * Get language from localStorage
 * @param storageKey - The key to use in localStorage
 * @returns The stored language or null if not found
 */
export function getStoredLanguage(storageKey: string = 'language'): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

/**
 * Save language to localStorage
 * @param language - The language to save
 * @param storageKey - The key to use in localStorage
 */
export function saveLanguage(language: string, storageKey: string = 'language'): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // Silently fail if localStorage is not available
  }
}
