import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { PackageManager } from './config';

const PACKAGE_MANAGER_LOCKFILES: Array<[PackageManager, string]> = [
  ['pnpm', 'pnpm-lock.yaml'],
  ['yarn', 'yarn.lock'],
  ['bun', 'bun.lockb'],
  ['bun', 'bun.lock'],
  ['npm', 'package-lock.json'],
];

export function detectPackageManager(projectPath: string): PackageManager {
  for (const [packageManager, lockfile] of PACKAGE_MANAGER_LOCKFILES) {
    if (fs.existsSync(path.join(projectPath, lockfile))) {
      return packageManager;
    }
  }

  return 'npm';
}

export function getInstallCommand(packageManager: PackageManager, packageName: string): string {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm add ${packageName}`;
    case 'yarn':
      return `yarn add ${packageName}`;
    case 'bun':
      return `bun add ${packageName}`;
    case 'npm':
    default:
      return `npm install ${packageName}`;
  }
}

export function installPackage(projectPath: string, packageManager: PackageManager, packageName: string) {
  execSync(getInstallCommand(packageManager, packageName), {
    cwd: projectPath,
    stdio: 'inherit',
  });
}
