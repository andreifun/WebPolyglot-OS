import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { detectPackageManager, getInstallCommand } from '../../cli/src/package-manager';

describe('package manager helpers', () => {
  let projectDir: string;

  beforeEach(async () => {
    projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'webpolyglot-pm-test-'));
  });

  afterEach(async () => {
    await fs.remove(projectDir);
  });

  it('detects pnpm before npm when both lockfiles are absent/present', async () => {
    await fs.writeFile(path.join(projectDir, 'pnpm-lock.yaml'), 'lockfileVersion: 9');
    await fs.writeFile(path.join(projectDir, 'package-lock.json'), '{}');

    expect(detectPackageManager(projectDir)).toBe('pnpm');
  });

  it('falls back to npm when no lockfile exists', () => {
    expect(detectPackageManager(projectDir)).toBe('npm');
  });

  it('builds the correct install command', () => {
    expect(getInstallCommand('npm', 'webpolyglot')).toBe('npm install webpolyglot');
    expect(getInstallCommand('pnpm', 'webpolyglot')).toBe('pnpm add webpolyglot');
    expect(getInstallCommand('yarn', 'webpolyglot')).toBe('yarn add webpolyglot');
    expect(getInstallCommand('bun', 'webpolyglot')).toBe('bun add webpolyglot');
  });
});
