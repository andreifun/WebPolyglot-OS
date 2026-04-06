import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const workspaceRoot = process.cwd();
const cacheDir = mkdtempSync(path.join(tmpdir(), 'webpolyglot-smoke-cache-'));
const extractDir = mkdtempSync(path.join(tmpdir(), 'webpolyglot-smoke-pack-'));
const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'webpolyglot-smoke-fixtures-'));

try {
  const tarballName = packTarball(workspaceRoot, cacheDir);
  extractTarball(workspaceRoot, tarballName, extractDir);

  const packedPackageRoot = path.join(extractDir, 'package');
  const cliEntry = path.join(packedPackageRoot, 'dist/cli/index.js');
  const nodePath = [path.join(workspaceRoot, 'node_modules'), path.join(workspaceRoot, 'cli/node_modules')]
    .filter((entry) => existsSync(entry))
    .join(path.delimiter);

  runReactSmoke(cliEntry, fixtureRoot, nodePath);
  runNextSmoke(cliEntry, fixtureRoot, nodePath);
} finally {
  rmSync(cacheDir, { recursive: true, force: true });
  rmSync(extractDir, { recursive: true, force: true });
  rmSync(fixtureRoot, { recursive: true, force: true });
}

function runReactSmoke(cliEntry, fixtureRoot, nodePath) {
  const projectDir = path.join(fixtureRoot, 'react-app');
  mkdirSync(path.join(projectDir, 'src'), { recursive: true });
  writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({ name: 'react-smoke', version: '1.0.0' }, null, 2));
  writeFileSync(path.join(projectDir, 'src/main.tsx'), 'root.render(<App />);');

  execCli(cliEntry, projectDir, nodePath, [
    'init',
    '--dir',
    projectDir,
    '--framework',
    'react',
    '--default-language',
    'en',
    '--languages',
    'es,pt-br',
    '--no-install',
    '--no-prompt',
  ]);

  assertFileContains(path.join(projectDir, 'src/webpolyglot-provider.tsx'), "import lang_pt_br from './dictionaries/pt-br.json';");
  assertFileContains(path.join(projectDir, 'webpolyglot.setup.md'), "import { WebPolyglotProvider } from './webpolyglot-provider';");
}

function runNextSmoke(cliEntry, fixtureRoot, nodePath) {
  const projectDir = path.join(fixtureRoot, 'next-app');
  mkdirSync(path.join(projectDir, 'app'), { recursive: true });
  writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify({ name: 'next-smoke', version: '1.0.0', dependencies: { next: '^14.0.0' } }, null, 2)
  );
  writeFileSync(
    path.join(projectDir, 'app/layout.tsx'),
    'export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }'
  );

  execCli(cliEntry, projectDir, nodePath, [
    'init',
    '--dir',
    projectDir,
    '--default-language',
    'en',
    '--languages',
    'fr',
    '--no-install',
    '--no-prompt',
  ]);

  assertFileContains(path.join(projectDir, 'app/webpolyglot-provider.tsx'), "'use client';");
  assertFileContains(path.join(projectDir, 'webpolyglot.setup.md'), '<body>');
  const layout = readFileSync(path.join(projectDir, 'app/layout.tsx'), 'utf8');
  if (layout.includes('WebPolyglotProvider')) {
    throw new Error('Smoke test expected layout.tsx to remain untouched.');
  }
}

function execCli(cliEntry, projectDir, nodePath, args) {
  execFileSync('node', [cliEntry, ...args], {
    cwd: projectDir,
    env: {
      ...process.env,
      NODE_PATH: nodePath,
    },
    stdio: 'pipe',
  });
}

function assertFileContains(filePath, expectedText) {
  const content = readFileSync(filePath, 'utf8');
  if (!content.includes(expectedText)) {
    throw new Error(`Expected ${filePath} to include: ${expectedText}`);
  }
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
