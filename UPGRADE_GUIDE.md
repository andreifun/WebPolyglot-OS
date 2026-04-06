# Upgrade Guide: 1.x to 2.0

WebPolyglot 2.0 is a reset release.

## What changed

- the separate CLI package story is gone
- the canonical command is now `webpolyglot`
- the canonical init flow is now `npx webpolyglot@latest init`
- loader-based APIs and docs are removed
- the CLI no longer tries to auto-edit your app files
- `init` now generates safe provider/setup files instead

## New workflow

```bash
npx webpolyglot@latest init
```

Then follow `webpolyglot.setup.md` in your app.

## Library API

The core runtime remains intentionally small:

- `I18nProvider`
- `useTranslation`

Translations are passed through the `translations` prop.

## Recommended migration

1. Remove any old loader-based setup.
2. Regenerate setup with `npx webpolyglot@latest init`.
3. Move your app to the generated provider pattern.
4. Delete any legacy bootstrap or injection files from older experiments.
