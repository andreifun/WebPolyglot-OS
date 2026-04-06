#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { WebPolyglotConfig } from './config';
import { resolveFramework } from './framework';
import {
  normalizeLanguageCode,
  promptLanguageSelection,
  sanitizeSelectedLanguages,
} from './init-language-selection';
import { detectPackageManager, getInstallCommand, installPackage } from './package-manager';
import { writeSetupFiles } from './setup-files';

export const __languageSelectionUtils = {
  normalizeLanguageCode,
  sanitizeSelectedLanguages,
};

export interface InitOptions {
  dir: string;
  framework?: string;
  defaultLanguage?: string;
  languages?: string;
  dictionariesDir?: string;
  install?: boolean;
  example?: boolean;
  prompt?: boolean;
}

interface LanguageSelection {
  defaultLanguage: string;
  selectedLanguages: string[];
}

const initialKeys = {
  welcome: '',
  navigation: {
    home: '',
    about: '',
    contact: '',
  },
  buttons: {
    save: '',
    cancel: '',
    submit: '',
  },
  common: {
    loading: '',
    error: '',
    success: '',
  },
};

export async function init(options: InitOptions) {
  const { dir } = options;
  const projectPath = path.resolve(dir);

  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No package.json found. Please run this command in a Node.js project.');
  }

  const framework = resolveFramework(projectPath, options.framework);
  const packageManager = detectPackageManager(projectPath);
  const dictionariesDir = options.dictionariesDir ?? getDefaultDictionariesDir(framework);
  const install = options.install !== false;
  const example = options.example !== false;
  const prompt = options.prompt !== false;
  const languageSelection = await resolveSelectedLanguages(options, prompt);
  const defaultLanguage = languageSelection.defaultLanguage;
  const selectedLanguages = languageSelection.selectedLanguages;

  console.log(chalk.blue('WebPolyglot bootstrap'));
  console.log(chalk.gray(`Project: ${projectPath}`));
  console.log(chalk.gray(`Framework: ${framework}`));
  console.log(chalk.gray(`Package manager: ${packageManager}`));

  await writeDictionaryFiles(projectPath, dictionariesDir, selectedLanguages);
  const setupFiles = await writeSetupFiles(
    projectPath,
    framework,
    defaultLanguage,
    selectedLanguages,
    dictionariesDir,
    example
  );

  if (install) {
    console.log(chalk.blue(`Installing dependency with ${packageManager}...`));
    installPackage(projectPath, packageManager, 'webpolyglot');
  }

  const config = {
    defaultLanguage,
    languages: selectedLanguages,
    dictionariesDir,
    framework,
    packageManager,
  } satisfies WebPolyglotConfig;

  const configPath = await writeConfig(projectPath, config);
  printSummary(config, {
    configPath,
    providerFilePath: setupFiles.providerFilePath,
    instructionsFilePath: setupFiles.instructionsFilePath,
    installCommand: install ? getInstallCommand(packageManager, 'webpolyglot') : null,
  });
}

async function resolveSelectedLanguages(options: InitOptions, prompt: boolean): Promise<LanguageSelection> {
  const defaultLanguage = normalizeLanguageCode(options.defaultLanguage ?? 'en');
  if (options.languages || options.defaultLanguage || !prompt) {
    const configuredLanguages = options.languages
      ? options.languages.split(',').map((language) => normalizeLanguageCode(language))
      : [];
    const selectedLanguages = sanitizeSelectedLanguages([defaultLanguage, ...configuredLanguages]);

    if (selectedLanguages.length === 0) {
      throw new Error('At least one valid language must be provided.');
    }

    return {
      defaultLanguage: selectedLanguages[0],
      selectedLanguages,
    };
  }

  return promptLanguageSelection();
}

async function writeDictionaryFiles(projectPath: string, dictionariesDirName: string, selectedLanguages: string[]) {
  const dictionariesDir = path.join(projectPath, dictionariesDirName);
  await fs.ensureDir(dictionariesDir);

  for (const lang of selectedLanguages) {
    const filePath = path.join(dictionariesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      await fs.writeJson(filePath, initialKeys, { spaces: 2 });
      console.log(chalk.green(`Created ${path.relative(projectPath, filePath)}`));
    }
  }
}

async function writeConfig(projectPath: string, config: WebPolyglotConfig): Promise<string> {
  const configPath = path.join(projectPath, 'webpolyglot.config.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
  return configPath;
}

function printSummary(
  config: WebPolyglotConfig,
  details: {
    configPath: string;
    providerFilePath: string;
    instructionsFilePath?: string;
    installCommand: string | null;
  }
) {
  console.log('');
  console.log(chalk.green('WebPolyglot is ready.'));
  console.log(chalk.gray(`Config: ${details.configPath}`));
  console.log(chalk.gray(`Provider: ${details.providerFilePath}`));
  if (details.instructionsFilePath) {
    console.log(chalk.gray(`Setup guide: ${details.instructionsFilePath}`));
  }
  console.log(chalk.gray(`Languages: ${config.languages.join(', ')}`));
  if (details.installCommand) {
    console.log(chalk.gray(`Installed with: ${details.installCommand}`));
  }
  console.log('');
  console.log(chalk.blue('Next steps'));
  console.log(chalk.gray('1. Fill in the generated dictionary files.'));
  if (details.instructionsFilePath) {
    console.log(chalk.gray('2. Follow the snippet in webpolyglot.setup.md.'));
  } else {
    console.log(chalk.gray('2. Import the generated provider into your app entry.'));
  }
  console.log(chalk.gray('3. Use "webpolyglot add <language>" when you need another locale.'));
}

function getDefaultDictionariesDir(framework: WebPolyglotConfig['framework']): string {
  return framework === 'react' ? 'src/dictionaries' : 'dictionaries';
}
