import React from 'react';
// import { I18nProvider, useTranslation } from 'webpolyglot';

// Import your dictionary files (created by CLI)
// import enTranslations from '../dictionaries/en.json';
// import esTranslations from '../dictionaries/es.json';
// import frTranslations from '../dictionaries/fr.json';

// Mock translations for example
const enTranslations = { welcome: 'Welcome', navigation: { home: 'Home' } };
const esTranslations = { welcome: 'Bienvenido', navigation: { home: 'Inicio' } };
const frTranslations = { welcome: 'Bienvenue', navigation: { home: 'Accueil' } };

// Example component using translations
function MyComponent() {
  // const { t, language, setLanguage, availableLanguages } = useTranslation();
  const t = (key: string) => key; // Mock function for example
  const language = 'en';
  const setLanguage = (lang: string) => console.log('Set language:', lang);
  const availableLanguages = ['en', 'es', 'fr'];

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting').replace('{name}', 'John')}</p>
      
      <nav>
        <a href="/">{t('navigation.home')}</a>
        <a href="/about">{t('navigation.about')}</a>
        <a href="/contact">{t('navigation.contact')}</a>
      </nav>
      
      <div>
        <button>{t('buttons.save')}</button>
        <button>{t('buttons.cancel')}</button>
        <button>{t('buttons.submit')}</button>
      </div>
      
      <div>
        <label>Language: </label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// App component using dictionary files
export default function App() {
  const translations = {
    en: enTranslations,
    es: esTranslations,
    fr: frTranslations
  };

  return (
    <div>
      {/* <I18nProvider 
        translations={translations}
        config={{
          defaultLanguage: 'en',
          storageKey: 'my-app-language',
          fallbackLanguage: 'en'
        }}
      > */}
        <MyComponent />
      {/* </I18nProvider> */}
    </div>
  );
}
