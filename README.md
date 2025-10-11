# WebPolyglot

A simple, powerful React/Next.js i18n framework that works without route changes. WebPolyglot saves the preferred language to localStorage and provides a clean API for internationalization.

## Features

- 🚀 **CLI Setup** - Easy initialization with `npx webpolyglot-init`
- 💾 **localStorage Persistence** - Remembers user's language preference
- 🌐 **No Route Changes** - Works with any routing system
- 📦 **TypeScript Support** - Full type safety
- ⚡ **Lightweight** - Minimal bundle size
- 🔧 **Flexible** - Works with React and Next.js
- 🎯 **Nested Translations** - Support for dot-notation keys
- 🛠️ **CLI Management** - Add languages with `webpolyglot add <language>`
- 🌍 **100+ Languages** - Comprehensive language database with country codes
- 🔍 **Smart Search** - Search languages by name, native name, or code
- ➕ **Custom Languages** - Create your own languages with custom codes
- 📍 **Location Detection** - Automatic language detection based on user location

## Quick Start

### 1. Initialize WebPolyglot

```bash
npx webpolyglot-init
```

This will:
- Create a `dictionaries/` folder with your language files
- Install the `webpolyglot` package
- Generate example usage code
- Create a configuration file

### 2. Add More Languages

```bash
# Add a new language
webpolyglot add es

# Add multiple languages
webpolyglot add fr
webpolyglot add de
```

### 3. List Your Languages

```bash
webpolyglot list
```

## Usage

### Using Dictionary Files (Recommended)

After running `npx webpolyglot-init`, you'll have dictionary files in your `dictionaries/` folder:

```
dictionaries/
├── en.json
├── es.json
└── fr.json
```

Import and use them in your app:

```tsx
import { I18nProvider, useTranslation } from 'webpolyglot';
import enTranslations from './dictionaries/en.json';
import esTranslations from './dictionaries/es.json';
import frTranslations from './dictionaries/fr.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
};

function App() {
  return (
    <I18nProvider translations={translations}>
      <YourApp />
    </I18nProvider>
  );
}
```

### Static Translations (Alternative)

```tsx
import { I18nProvider } from 'webpolyglot';

const translations = {
  en: {
    welcome: "Welcome!",
    navigation: {
      home: "Home",
      about: "About"
    }
  },
  es: {
    welcome: "¡Bienvenido!",
    navigation: {
      home: "Inicio",
      about: "Acerca de"
    }
  }
};

function App() {
  return (
    <I18nProvider translations={translations}>
      <YourApp />
    </I18nProvider>
  );
}
```

### Using Translations in Components

```tsx
import { useTranslation } from 'webpolyglot';

function MyComponent() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <nav>
        <a href="/">{t('navigation.home')}</a>
        <a href="/about">{t('navigation.about')}</a>
      </nav>
      
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        {availableLanguages.map(lang => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}
```

## CLI Commands

### Initialize Project

```bash
npx webpolyglot-init
```

Interactive setup that creates:
- `dictionaries/` folder with language files
- `webpolyglot.config.json` configuration
- Example usage code
- Installs the `webpolyglot` package

### Add Language

```bash
webpolyglot add <language-code>
```

Examples:
```bash
webpolyglot add es        # Spanish
webpolyglot add fr        # French  
webpolyglot add de        # German
webpolyglot add zh        # Chinese
webpolyglot add ja        # Japanese
webpolyglot add arabic    # Search for Arabic
webpolyglot add hindi     # Search for Hindi
webpolyglot add custom    # Create custom language
```

This creates a new dictionary file with all existing keys (empty values) that you can fill in.

### List Languages

```bash
webpolyglot list
```

Shows all available languages in your project with key counts and file sizes.

## Language Support

### 100+ Languages Available

WebPolyglot includes support for over 100 languages with proper country codes and native names:

**Major Languages:**
- English, Spanish, French, German, Italian, Portuguese
- Chinese, Japanese, Korean, Arabic, Hindi, Russian
- Dutch, Swedish, Danish, Norwegian, Finnish, Polish

**Regional Languages:**
- European: Catalan, Basque, Welsh, Irish, Maltese
- Asian: Thai, Vietnamese, Indonesian, Malay, Filipino
- African: Swahili, Amharic, Hausa, Yoruba, Zulu
- Middle Eastern: Hebrew, Persian, Turkish, Urdu

**Custom Languages:**
Create your own languages with custom codes, names, and country associations.

### Location-Based Detection

```tsx
import { getLocationBasedLanguages, getTimezoneBasedLanguages } from 'webpolyglot';

// Get languages based on user's location
const locationLanguages = await getLocationBasedLanguages();

// Get languages based on timezone
const timezoneLanguages = getTimezoneBasedLanguages();
```

### Language Search

```tsx
import { searchLanguages, getLanguagesByCountry } from 'webpolyglot';

// Search for languages
const results = searchLanguages('arabic');
// Returns: Arabic, Persian, Hebrew, etc.

// Get languages by country
const usLanguages = getLanguagesByCountry('US');
// Returns: English
```

## API Reference

### I18nProvider

The main provider component that wraps your application.

```tsx
interface I18nProviderProps {
  children: React.ReactNode;
  translations?: Record<Language, Translations>;
  languages?: Language[];
  config?: I18nConfig;
}

interface I18nConfig {
  defaultLanguage?: Language;
  storageKey?: string;
  fallbackLanguage?: Language;
}
```

### useTranslation Hook

Returns the translation functions and current state.

```tsx
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}
```

### Translation Structure

```tsx
interface Translations {
  [key: string]: string | Translations;
}
```

## Advanced Usage

### Custom Configuration

```tsx
<I18nProvider 
  translations={translations}
  config={{
    defaultLanguage: 'en',
    storageKey: 'my-app-language',
    fallbackLanguage: 'en'
  }}
>
  <App />
</I18nProvider>
```

### Next.js Integration

```tsx
// pages/_app.tsx
import { I18nProvider } from 'webpolyglot';

export default function App({ Component, pageProps }) {
  return (
    <I18nProvider translations={translations}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

### Dictionary Files Structure

When using dictionary files, organize them like this:

```
dictionaries/
├── en.json
├── es.json
├── fr.json
└── de.json
```

Each file should contain the complete translation object for that language:

```json
// dictionaries/en.json
{
  "welcome": "Welcome!",
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### Dynamic Language Loading

```tsx
import { loadDictionaries, createDictionaryLoader } from 'webpolyglot';

// Load specific languages
const translations = await loadDictionaries(['en', 'es', 'fr']);

// Create a loader for specific languages
const loadMyLanguages = createDictionaryLoader(['en', 'es', 'fr']);
const myTranslations = await loadMyLanguages();
```

## Examples

Check the `examples/` directory for complete usage examples:

- `basic-usage.tsx` - Basic React setup with static translations
- `dictionary-usage.tsx` - Using dictionary files approach
- `nextjs-usage.tsx` - Next.js integration

## Browser Support

- Modern browsers with localStorage support
- React 16.8+ (hooks support)
- TypeScript 4.0+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
