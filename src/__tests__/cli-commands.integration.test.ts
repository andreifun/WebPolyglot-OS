import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import { init } from '../../cli/src/commands/init';
import { addLanguage } from '../../cli/src/commands/add-language';
import { listLanguages } from '../../cli/src/commands/list-languages';

jest.mock(
  'inquirer',
  () => ({
    __esModule: true,
    default: {
      prompt: jest.fn(),
      Separator: class Separator {},
    },
  }),
  { virtual: true }
);

jest.mock(
  'chalk',
  () => ({
    __esModule: true,
    default: {
      blue: (value: string) => value,
      green: (value: string) => value,
      yellow: (value: string) => value,
      red: (value: string) => value,
      gray: (value: string) => value,
      cyan: (value: string) => value,
    },
  }),
  { virtual: true }
);

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const mockExecSync = execSync as jest.Mock;

describe('CLI integration flows', () => {
  let projectDir: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'webpolyglot-cli-test-'));
    await fs.writeJson(path.join(projectDir, 'package.json'), {
      name: 'fixture-app',
      version: '1.0.0',
    });
  });

  afterEach(async () => {
    await fs.remove(projectDir);
  });

  it('init generates safe provider and setup guide for React projects', async () => {
    await fs.ensureDir(path.join(projectDir, 'src'));
    await fs.writeFile(path.join(projectDir, 'src', 'main.tsx'), 'root.render(<App />);');

    await init({
      dir: projectDir,
      framework: 'react',
      defaultLanguage: 'en',
      languages: 'es,pt-br',
      install: false,
      prompt: false,
    });

    const config = await fs.readJson(path.join(projectDir, 'webpolyglot.config.json'));
    expect(config).toMatchObject({
      defaultLanguage: 'en',
      languages: ['en', 'es', 'pt-br'],
      dictionariesDir: 'src/dictionaries',
      framework: 'react',
      packageManager: 'npm',
    });

    const providerPath = path.join(projectDir, 'src', 'webpolyglot-provider.tsx');
    const provider = await fs.readFile(providerPath, 'utf8');
    expect(provider).toContain("import lang_pt_br from './dictionaries/pt-br.json';");
    expect(provider).toContain("'pt-br': lang_pt_br");

    const guide = await fs.readFile(path.join(projectDir, 'webpolyglot.setup.md'), 'utf8');
    expect(guide).toContain("import { WebPolyglotProvider } from './webpolyglot-provider';");
    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('init generates Next.js app router provider without mutating layout files', async () => {
    await fs.writeJson(path.join(projectDir, 'package.json'), {
      name: 'fixture-next-app',
      version: '1.0.0',
      dependencies: {
        next: '^14.0.0',
      },
    });
    await fs.ensureDir(path.join(projectDir, 'app'));
    const layoutPath = path.join(projectDir, 'app', 'layout.tsx');
    await fs.writeFile(layoutPath, 'export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }');

    await init({
      dir: projectDir,
      defaultLanguage: 'en',
      languages: 'fr',
      install: false,
      prompt: false,
    });

    const providerPath = path.join(projectDir, 'app', 'webpolyglot-provider.tsx');
    const provider = await fs.readFile(providerPath, 'utf8');
    expect(provider.startsWith("'use client';")).toBe(true);

    const layoutContent = await fs.readFile(layoutPath, 'utf8');
    expect(layoutContent).toContain('RootLayout');
    expect(layoutContent).not.toContain('WebPolyglotProvider');

    const guide = await fs.readFile(path.join(projectDir, 'webpolyglot.setup.md'), 'utf8');
    expect(guide).toContain('<body>');
    expect(guide).toContain('WebPolyglotProvider');
  });

  it('supports add and list after init', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await init({
      dir: projectDir,
      framework: 'react',
      defaultLanguage: 'en',
      prompt: false,
      install: false,
    });
    await addLanguage('de', { dir: projectDir });
    await listLanguages({ dir: projectDir });

    const config = await fs.readJson(path.join(projectDir, 'webpolyglot.config.json'));
    expect(config.languages).toEqual(['en', 'de']);
    expect(await fs.pathExists(path.join(projectDir, 'src', 'dictionaries', 'de.json'))).toBe(true);

    const output = consoleSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(output).toContain('WebPolyglot languages');
    expect(output).toContain('de');

    consoleSpy.mockRestore();
  });
});
