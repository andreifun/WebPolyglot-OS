import React from 'react';
// import { I18nProvider, useTranslation } from 'webpolyglot';

// Option 1: Static translations (inline)
const staticTranslations = {
  en: {
    welcome: "Welcome to WebPolyglot!",
    greeting: "Hello, {name}!",
    navigation: {
      home: "Home",
      about: "About",
      contact: "Contact"
    },
    buttons: {
      save: "Save",
      cancel: "Cancel",
      submit: "Submit"
    }
  },
  es: {
    welcome: "¡Bienvenido a WebPolyglot!",
    greeting: "¡Hola, {name}!",
    navigation: {
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto"
    },
    buttons: {
      save: "Guardar",
      cancel: "Cancelar",
      submit: "Enviar"
    }
  },
  fr: {
    welcome: "Bienvenue à WebPolyglot!",
    greeting: "Bonjour, {name}!",
    navigation: {
      home: "Accueil",
      about: "À propos",
      contact: "Contact"
    },
    buttons: {
      save: "Sauvegarder",
      cancel: "Annuler",
      submit: "Soumettre"
    }
  }
};

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

// App component with static translations
export default function App() {
  return (
    <div>
      {/* <I18nProvider 
        translations={staticTranslations}
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

// Note: For dictionary files approach, use the CLI tool:
// npx webpolyglot-init
