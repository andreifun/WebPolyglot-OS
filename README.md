# WebPolyglot

WebPolyglot is a lightweight i18n toolkit for React and Next.js with a production-ready CLI.

It keeps translation files local, persists the selected language in `localStorage`, and bootstraps a project with safe generated files instead of risky source mutation.

## Why WebPolyglot

- One package, one command: `npx webpolyglot@latest init`
- Local JSON dictionaries with no hosted translation service
- Safe bootstrap flow that generates provider/setup files instead of rewriting your app
- Works well for React apps and Next.js App Router projects
- Simple runtime API: `I18nProvider` and `useTranslation`

## Quick Start

```bash
npx webpolyglot@latest init
```

The CLI will:

- detect your framework
- detect your package manager
- create dictionary files
- create `webpolyglot.config.json`
- generate a provider file and `webpolyglot.setup.md`
- print the exact next steps for your app

## What `init` Creates

- `dictionaries/*.json`
- `webpolyglot.config.json`
- a generated provider file such as `src/webpolyglot-provider.tsx` or `app/webpolyglot-provider.tsx`
- `webpolyglot.setup.md`

## What `init` Will Not Do

- it will not rewrite your app entry automatically
- it will not guess complex framework-specific architecture
- it will not overwrite your existing layout/app files

## React Example

After `init`, import the generated provider into your app entry:

```tsx
import { WebPolyglotProvider } from './webpolyglot-provider';

root.render(
  <WebPolyglotProvider>
    <App />
  </WebPolyglotProvider>
);
```

Generated provider files use your local dictionaries:

```tsx
import type { ReactNode } from 'react';
import { I18nProvider } from 'webpolyglot';
import lang_en from './dictionaries/en.json';
import lang_es from './dictionaries/es.json';

const translations = {
  en: lang_en,
  es: lang_es,
};

export function WebPolyglotProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider translations={translations} config={{ defaultLanguage: 'en' }}>
      {children}
    </I18nProvider>
  );
}
```

## Next.js App Router Example

For Next.js App Router, use the generated client provider inside `app/layout.tsx`:

```tsx
import { WebPolyglotProvider } from './webpolyglot-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebPolyglotProvider>{children}</WebPolyglotProvider>
      </body>
    </html>
  );
}
```

## Using Translations

```tsx
import { useTranslation } from 'webpolyglot';

export function LanguageSwitcher() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        {availableLanguages.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## CLI

Initialize a project:

```bash
npx webpolyglot@latest init
```

Non-interactive example:

```bash
npx webpolyglot@latest init --framework react --default-language en --languages es,fr --no-prompt
```

Add a language:

```bash
webpolyglot add de
```

List configured languages:

```bash
webpolyglot list
```

## API

### `I18nProvider`

```tsx
interface I18nProviderProps {
  children: React.ReactNode;
  translations: Record<Language, Translations>;
  config?: {
    defaultLanguage?: Language;
    storageKey?: string;
    fallbackLanguage?: Language;
  };
}
```

### `useTranslation`

Returns:

- `t(key: string)`
- `language`
- `setLanguage(language)`
- `availableLanguages`

## Advanced Utilities

WebPolyglot also exports language search utilities and browser-oriented location helpers.

Location detection is browser-only and should be treated as an enhancement, not a server-side defaulting strategy.

## Troubleshooting

- If `init` says no `package.json` was found, run it from your app root.
- If you use `--no-install`, install the package yourself with your package manager.
- If you already have a custom app architecture, follow `webpolyglot.setup.md` manually instead of expecting the CLI to wire files for you.

## Development

```bash
npm run verify
```
