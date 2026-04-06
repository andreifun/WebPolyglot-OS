import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadWebPolyglotConfig } from '../config';
import { LANGUAGES, getLanguageByCode, searchLanguages } from '../languages';
import { normalizeLanguageCode } from '../init-language-selection';

export interface AddLanguageOptions {
  dir: string;
}

export async function addLanguage(language: string, options: AddLanguageOptions) {
  const { dir } = options;
  const projectPath = path.resolve(dir);
  const configPath = path.join(projectPath, 'webpolyglot.config.json');
  const config = await loadWebPolyglotConfig(projectPath);
  const dictionariesDir = path.join(projectPath, config.dictionariesDir);

  let languageCode = normalizeLanguageCode(language);
  let languageInfo = getLanguageByCode(languageCode);

  // If language not found, search for it
  if (!languageInfo) {
    const searchResults = searchLanguages(language);
    if (searchResults.length === 0) {
      // Ask if user wants to create a custom language
      const createCustom = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createCustom',
          message: `Language '${language}' not found. Do you want to create a custom language?`,
          default: true
        }
      ]);

      if (createCustom.createCustom) {
        const customAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'code',
            message: 'Language code:',
            default: language,
            validate: (input: string) => {
              if (!input.trim()) return 'Please enter a language code';
              if (config.languages.includes(normalizeLanguageCode(input))) {
                return 'This language is already in your project';
              }
              return true;
            },
            filter: (input: string) => normalizeLanguageCode(input),
          },
          {
            type: 'input',
            name: 'name',
            message: 'Language name in English:',
            validate: (input: string) => {
              if (!input.trim()) return 'Please enter a language name';
              return true;
            }
          },
          {
            type: 'input',
            name: 'nativeName',
            message: 'Language name in its native script:',
            validate: (input: string) => {
              if (!input.trim()) return 'Please enter the native name';
              return true;
            }
          },
          {
            type: 'input',
            name: 'countries',
            message: 'Country codes (comma-separated, e.g., US,GB,AU):',
            default: '',
            filter: (input: string) => input.split(',').map(c => c.trim().toUpperCase()).filter(c => c)
          }
        ]);

        languageCode = customAnswer.code;
        languageInfo = {
          code: customAnswer.code,
          name: customAnswer.name,
          nativeName: customAnswer.nativeName,
          countries: customAnswer.countries
        };
      } else {
        throw new Error(`Language '${language}' not found.`);
      }
    } else if (searchResults.length === 1) {
      languageInfo = searchResults[0];
      languageCode = languageInfo.code;
    } else {
      // Multiple results, let user choose
      const choice = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedLanguage',
          message: 'Multiple languages found. Select one:',
          choices: searchResults.map(lang => ({
            name: `${lang.name} (${lang.nativeName}) - ${lang.code}`,
            value: lang.code
          }))
        }
      ]);
      languageInfo = getLanguageByCode(choice.selectedLanguage);
      languageCode = choice.selectedLanguage;
    }
  }

  // Check if language already exists
  const languageFile = path.join(dictionariesDir, `${languageCode}.json`);
  if (fs.existsSync(languageFile)) {
    throw new Error(`Language '${languageCode}' already exists.`);
  }

  // Get existing keys from the default language
  const defaultLanguageFile = path.join(dictionariesDir, `${config.defaultLanguage}.json`);
  if (!fs.existsSync(defaultLanguageFile)) {
    throw new Error(`Default language file '${config.defaultLanguage}.json' not found.`);
  }

  const existingKeys = await fs.readJson(defaultLanguageFile);
  
  // Create new language file with empty values
  const newLanguageData = createEmptyTranslations(existingKeys);
  await fs.writeJson(languageFile, newLanguageData, { spaces: 2 });

  // Update config
  if (!config.languages.includes(languageCode)) {
    config.languages.push(languageCode);
    await fs.writeJson(configPath, config, { spaces: 2 });
  }

  const languageName = languageInfo ? `${languageInfo.name} (${languageInfo.nativeName})` : languageCode;
  console.log(chalk.green(`Created ${path.relative(projectPath, languageFile)} with ${Object.keys(flattenKeys(existingKeys)).length} keys`));
  console.log(chalk.blue(`Next: fill in translations for ${languageName}.`));
}

function createEmptyTranslations(keys: any): any {
  if (typeof keys === 'string') {
    return '';
  }
  
  if (typeof keys === 'object' && keys !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(keys)) {
      result[key] = createEmptyTranslations(value);
    }
    return result;
  }
  
  return '';
}

function flattenKeys(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenKeys(value, fullKey));
    }
  }
  
  return result;
}
