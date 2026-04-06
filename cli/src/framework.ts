import fs from 'fs-extra';
import path from 'path';
import type { SupportedFramework } from './config';

const NEXT_LAYOUT_FILES = ['app/layout.tsx', 'app/layout.jsx', 'app/layout.js', 'app/layout.ts'];
const NEXT_PAGES_FILES = ['pages/_app.tsx', 'pages/_app.jsx', 'pages/_app.js', 'pages/_app.ts'];
const REACT_ENTRY_FILES = ['src/main.tsx', 'src/main.jsx', 'src/main.js', 'src/main.ts', 'src/App.tsx', 'src/App.jsx', 'src/App.js', 'src/App.ts'];

export function resolveFramework(projectPath: string, requestedFramework?: string): SupportedFramework {
  if (requestedFramework) {
    if (requestedFramework === 'react' || requestedFramework === 'nextjs') {
      return requestedFramework;
    }

    throw new Error(`Unsupported framework "${requestedFramework}". Use "react" or "nextjs".`);
  }

  return detectFramework(projectPath);
}

export function detectFramework(projectPath: string): SupportedFramework {
  if (findFirstExistingFile(projectPath, [...NEXT_LAYOUT_FILES, ...NEXT_PAGES_FILES])) {
    return 'nextjs';
  }

  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (dependencies.next) {
      return 'nextjs';
    }
  }

  return 'react';
}

export function getPrimaryEntryFile(projectPath: string, framework: SupportedFramework): string | null {
  if (framework === 'nextjs') {
    return findFirstExistingFile(projectPath, [...NEXT_LAYOUT_FILES, ...NEXT_PAGES_FILES]);
  }

  return findFirstExistingFile(projectPath, REACT_ENTRY_FILES);
}

export function usesNextAppRouter(projectPath: string): boolean {
  return Boolean(findFirstExistingFile(projectPath, NEXT_LAYOUT_FILES));
}

function findFirstExistingFile(projectPath: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    const fullPath = path.join(projectPath, candidate);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}
