// pages/_app.tsx - Next.js App Router example
// import { I18nProvider } from 'webpolyglot';
// import type { AppProps } from 'next/app';

// Your translations
const translations = {
  en: {
    title: "My Next.js App",
    description: "A multilingual Next.js application",
    // ... more translations
  },
  es: {
    title: "Mi Aplicación Next.js",
    description: "Una aplicación Next.js multilingüe",
    // ... more translations
  },
  fr: {
    title: "Mon Application Next.js",
    description: "Une application Next.js multilingue",
    // ... more translations
  }
};

export default function App({ Component, pageProps }: any) {
  return (
    <div>
      {/* <I18nProvider 
        translations={translations}
        config={{
          defaultLanguage: 'en',
          storageKey: 'nextjs-app-language'
        }}
      > */}
        <Component {...pageProps} />
      {/* </I18nProvider> */}
    </div>
  );
}

// components/Header.tsx - Example component
import { useTranslation } from 'webpolyglot';

export function Header() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <header>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      
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
    </header>
  );
}
