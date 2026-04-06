import { execFileSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const workspaceRoot = process.cwd();
const cacheDir = mkdtempSync(path.join(tmpdir(), 'webpolyglot-pack-cache-'));
const extractDir = mkdtempSync(path.join(tmpdir(), 'webpolyglot-pack-extract-'));

try {
  const tarballName = packTarball(workspaceRoot, cacheDir);
  extractTarball(workspaceRoot, tarballName, extractDir);

  const packageRoot = path.join(extractDir, 'package');
  const fileList = execFileSync('find', ['.', '-type', 'f'], {
    cwd: packageRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .sort();

  const forbiddenFiles = [
    './dist/loaders.d.ts',
    './dist/setupTests.d.ts',
    './cli/package.json',
    './cli/README.md',
  ];

  for (const forbiddenFile of forbiddenFiles) {
    if (fileList.includes(forbiddenFile)) {
      throw new Error(`Packed tarball unexpectedly contains ${forbiddenFile}`);
    }
  }

  const requiredFiles = [
    './dist/index.js',
    './dist/index.mjs',
    './dist/index.d.ts',
    './dist/cli/index.js',
    './README.md',
    './package.json',
  ];

  for (const requiredFile of requiredFiles) {
    if (!fileList.includes(requiredFile)) {
      throw new Error(`Packed tarball is missing ${requiredFile}`);
    }
  }
} finally {
  rmSync(cacheDir, { recursive: true, force: true });
  rmSync(extractDir, { recursive: true, force: true });
}

function packTarball(cwd, cacheDir) {
  const output = execFileSync('npm', ['pack', '--json'], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: cacheDir,
    },
  });
  const [metadata] = JSON.parse(output);
  return metadata.filename;
}

function extractTarball(cwd, tarballName, extractDir) {
  execFileSync('tar', ['-xzf', tarballName, '-C', extractDir], { cwd });
  rmSync(path.join(cwd, tarballName), { force: true });
}
