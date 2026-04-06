import fs from 'fs-extra';
import path from 'path';

export type SupportedFramework = 'react' | 'nextjs';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface WebPolyglotConfig {
  defaultLanguage: string;
  languages: string[];
  dictionariesDir: string;
  framework: SupportedFramework;
  packageManager: PackageManager;
}

export async function loadWebPolyglotConfig(projectPath: string): Promise<WebPolyglotConfig> {
  const configPath = path.join(projectPath, 'webpolyglot.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('WebPolyglot is not initialized in this project. Run "webpolyglot init" first.');
  }

  const config = await fs.readJson(configPath);
  validateConfig(config);
  return config;
}

function validateConfig(config: unknown): asserts config is WebPolyglotConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid webpolyglot.config.json: expected an object.');
  }

  const candidate = config as Partial<WebPolyglotConfig>;
  if (!candidate.defaultLanguage || typeof candidate.defaultLanguage !== 'string') {
    throw new Error('Invalid webpolyglot.config.json: "defaultLanguage" must be a string.');
  }

  if (!Array.isArray(candidate.languages) || candidate.languages.some((language) => typeof language !== 'string')) {
    throw new Error('Invalid webpolyglot.config.json: "languages" must be an array of strings.');
  }

  if (!candidate.languages.includes(candidate.defaultLanguage)) {
    throw new Error('Invalid webpolyglot.config.json: "languages" must include the default language.');
  }

  if (!candidate.dictionariesDir || typeof candidate.dictionariesDir !== 'string') {
    throw new Error('Invalid webpolyglot.config.json: "dictionariesDir" must be a string.');
  }

  if (candidate.framework !== 'react' && candidate.framework !== 'nextjs') {
    throw new Error('Invalid webpolyglot.config.json: "framework" must be "react" or "nextjs".');
  }

  if (!candidate.packageManager || !['npm', 'pnpm', 'yarn', 'bun'].includes(candidate.packageManager)) {
    throw new Error('Invalid webpolyglot.config.json: "packageManager" must be one of npm, pnpm, yarn, or bun.');
  }
}
