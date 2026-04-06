# Publish Checklist

## Before publishing

- `npm ci`
- `npm run verify`
- confirm `README.md` matches the current CLI and API
- confirm `npm pack --json` produces one clean root tarball
- confirm the tarball contains:
  - `dist/index.js`
  - `dist/index.mjs`
  - `dist/index.d.ts`
  - `dist/cli/index.js`
- confirm the tarball does not contain stale artifacts such as:
  - `dist/loaders.d.ts`
  - `dist/setupTests.d.ts`
  - old CLI package metadata

## Publishing

```bash
npm publish
```

## After publishing

- test `npx webpolyglot@latest init` in a fresh temp project
- verify `webpolyglot add <language>` and `webpolyglot list`
- verify the npm page shows the latest README
