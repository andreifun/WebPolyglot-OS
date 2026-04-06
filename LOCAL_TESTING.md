# Local Testing Guide

Use the root package only.

## Build and verify

```bash
npm run verify
```

That runs tests, builds the library and CLI, checks packed contents, and smoke-tests the packed artifact against React and Next-style fixture apps.

## Manual CLI smoke test

```bash
npm run build
node dist/cli/index.js init --dir /path/to/test-app --framework react --default-language en --languages es,fr --no-install --no-prompt
```

## Manual tarball smoke test

```bash
npm pack
tar -xzf webpolyglot-2.0.0.tgz -C /tmp/webpolyglot-pack-check
node /tmp/webpolyglot-pack-check/package/dist/cli/index.js init --dir /path/to/test-app --framework react --default-language en --languages es --no-install --no-prompt
```

## Suggested fixture apps

React fixture:

- `package.json`
- `src/main.tsx`

Next fixture:

- `package.json` with `next` dependency
- `app/layout.tsx`

The CLI should generate provider/setup files and leave your existing entry/layout files untouched.
